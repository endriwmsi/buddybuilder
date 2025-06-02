"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateFunnelParams {
  name: string;
  description?: string | null;
  userId: string;
}

interface UpdateFunnelParams {
  id: string;
  name: string;
  description?: string | null;
}

export async function createFunnel({
  name,
  description,
  userId,
}: CreateFunnelParams) {
  try {
    const funnel = await db.funnel.create({
      data: {
        name,
        description,
        userId,
      },
    });

    revalidatePath("/funnels");
    return funnel;
  } catch (error) {
    console.error("Error creating funnel:", error);
    throw new Error("Failed to create funnel");
  }
}

export async function getFunnels(userId: string) {
  try {
    const funnels = await db.funnel.findMany({
      where: {
        userId,
      },
      include: {
        columns: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return funnels;
  } catch (error) {
    console.error("Error fetching funnels:", error);
    throw new Error("Failed to fetch funnels");
  }
}

export async function getFunnelById(id: string) {
  try {
    const funnel = await db.funnel.findUnique({
      where: {
        id,
      },
      include: {
        columns: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!funnel) {
      throw new Error("Funnel not found");
    }

    return funnel;
  } catch (error) {
    console.error("Error fetching funnel:", error);
    throw new Error("Failed to fetch funnel");
  }
}

export async function updateFunnel({
  id,
  name,
  description,
}: UpdateFunnelParams) {
  try {
    const funnel = await db.funnel.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    revalidatePath("/funnels");
    return funnel;
  } catch (error) {
    console.error("Error updating funnel:", error);
    throw new Error("Failed to update funnel");
  }
}

export async function deleteFunnel(id: string) {
  try {
    await db.funnel.delete({
      where: {
        id,
      },
    });

    revalidatePath("/funnels");
  } catch (error) {
    console.error("Error deleting funnel:", error);
    throw new Error("Failed to delete funnel");
  }
}

export async function setDefaultFunnel(id: string, userId: string) {
  try {
    // First, set all funnels to non-default
    await db.funnel.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });

    // Then set the selected funnel as default
    const funnel = await db.funnel.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/funnels");
    return funnel;
  } catch (error) {
    console.error("Error setting default funnel:", error);
    throw new Error("Failed to set default funnel");
  }
}
