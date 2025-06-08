"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BusinessSector } from "@/generated/prisma";

interface CreateProjectPlanData {
  title: string;
  description?: string;
  sector: BusinessSector;
  sectorDetails: Record<string, string>;
  marketingMaturity: string;
  commercialMaturity: string;
  marketingGoal?: string | null;
  commercialGoal?: string | null;
  userId: string;
}

export async function getProjectPlans() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const projectPlans = await db.projectPlan.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projectPlans;
}

export async function createProjectPlan(data: CreateProjectPlanData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/project-plans`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to create project plan");
    }

    const projectPlan = await response.json();
    revalidatePath("/project-plans");
    return { success: true, data: projectPlan };
  } catch (error) {
    console.error("Error creating project plan:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create project plan",
    };
  }
}

export async function getProjectPlan(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const projectPlan = await db.projectPlan.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      actions: {
        include: {
          detailedActions: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!projectPlan) {
    redirect("/project-plans");
  }

  return projectPlan;
}

export async function deleteProjectPlan(projectPlanId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }
  try {
    await db.projectPlan.delete({
      where: { id: projectPlanId },
    });

    revalidatePath("/project-plans");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project plan:", error);
    return { success: false, error: "Failed to delete project plan" };
  }
}
