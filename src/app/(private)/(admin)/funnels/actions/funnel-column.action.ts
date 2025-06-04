"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createFunnelColumnSchema, updateFunnelColumnSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export async function getFunnelColumns(funnelId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const existingFunnelColumns = await db.funnelColumn.findMany({
    where: { funnelId },
    orderBy: { order: "asc" },
  });

  // If user has no columns, create default columns
  if (existingFunnelColumns.length === 0) {
    const defaultFunnelColumns = [
      { name: "Lead", order: 0, color: "#e2e8f0" },
      { name: "Qualificado", order: 1, color: "#bfdbfe" },
      { name: "Proposta", order: 2, color: "#fef3c7" },
      { name: "Negociação", order: 3, color: "#fecaca" },
      { name: "Fechado", order: 4, color: "#bbf7d0" },
    ];

    const createdColumns = await Promise.all(
      defaultFunnelColumns.map(async (funnelColumn) => {
        return db.funnelColumn.create({
          data: {
            funnelId,
            name: funnelColumn.name,
            order: funnelColumn.order,
            color: funnelColumn.color,
          },
        });
      })
    );

    return createdColumns;
  }

  return existingFunnelColumns;
}

export async function createFunnelColumn(
  funnelId: string,
  data: {
    name: string;
    color: string;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const validatedData = createFunnelColumnSchema.parse(data);

  // Get the highest order value
  const highestOrder = await db.funnelColumn.findFirst({
    where: { funnelId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const funnelColumn = await db.funnelColumn.create({
    data: {
      funnelId,
      name: validatedData.name,
      color: validatedData.color,
      order: newOrder,
    },
  });

  revalidatePath(`/funnels/${funnelId}`);
  return funnelColumn;
}

export async function updateFunnelColumn(data: {
  id: string;
  name: string;
  color: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const validatedData = updateFunnelColumnSchema.parse(data);

  // Verify funnel ownership
  const funnelColumn = await db.funnelColumn.findUnique({
    where: { id: data.id },
    select: { funnelId: true },
  });

  if (!funnelColumn) {
    throw new Error("Funnel column not found");
  }

  const updatedFunnelColumn = await db.funnelColumn.update({
    where: { id: data.id },
    data: {
      name: validatedData.name,
      color: validatedData.color,
    },
  });

  revalidatePath(`/funnels/${funnelColumn.funnelId}`);
  return updatedFunnelColumn;
}

export async function deleteColumn(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get funnel column to verify ownership and get funnelId
  const funnelColumn = await db.funnelColumn.findUnique({
    where: { id },
    select: { funnelId: true },
  });

  if (!funnelColumn) {
    throw new Error("Funnel column not found");
  }

  // Delete the column and all its tasks
  await db.funnelColumn.delete({
    where: { id },
  });

  // Reorder remaining columns
  const remainingFunnelColumns = await db.funnelColumn.findMany({
    where: { funnelId: funnelColumn.funnelId },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingFunnelColumns.map(async (column, index) => {
      return db.funnelColumn.update({
        where: { id: column.id },
        data: { order: index },
      });
    })
  );

  revalidatePath(`/funnels/${funnelColumn.funnelId}`);
  return { success: true };
}

export async function reorderFunnelColumn(id: string, newOrder: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify ownership
  const funnelColumn = await db.funnelColumn.findUnique({
    where: { id },
    select: { funnelId: true, order: true },
  });

  if (!funnelColumn) {
    throw new Error("Unauthorized");
  }

  const oldFunnelColumnOrder = funnelColumn.order;

  // Get all columns from funnels
  const funnelColumns = await db.funnelColumn.findMany({
    where: { funnelId: funnelColumn.funnelId },
    orderBy: { order: "asc" },
  });

  // Update orders
  await Promise.all(
    funnelColumns.map(async (col) => {
      let newColOrder = col.order;

      if (oldFunnelColumnOrder > newOrder) {
        // Moving up
        if (col.order >= newOrder && col.order < oldFunnelColumnOrder) {
          newColOrder = col.order + 1;
        }
      } else if (oldFunnelColumnOrder < newOrder) {
        // Moving down
        if (col.order > oldFunnelColumnOrder && col.order <= newOrder) {
          newColOrder = col.order - 1;
        }
      }

      // Set the new order for the moved column
      if (col.id === id) {
        newColOrder = newOrder;
      }

      if (newColOrder !== col.order) {
        return db.funnelColumn.update({
          where: { id: col.id },
          data: { order: newColOrder },
        });
      }
    })
  );

  revalidatePath("/funnel");
  return { success: true };
}

// export async function reorderFunnelColumn(id: string, newOrder: number) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/auth/login");
//   }

//   // Get funnel column to verify ownership and get funnelId
//   const funnelColumn = await db.funnelColumn.findUnique({
//     where: { id },
//     select: { funnelId: true, order: true },
//   });

//   if (!funnelColumn) {
//     throw new Error("Funnel column not found");
//   }

//   const oldOrder = funnelColumn.order;

//   // Get all columns for the funnel
//   const funnelColumns = await db.funnelColumn.findMany({
//     where: { funnelId: funnelColumn.funnelId },
//     orderBy: { order: "asc" },
//   });

//   // Update orders
//   await Promise.all(
//     funnelColumns.map(async (column) => {
//       let newColOrder = column.order;

//       if (oldOrder > newOrder) {
//         // Moving up
//         if (column.order >= newOrder && column.order < oldOrder) {
//           newColOrder = column.order + 1;
//         }
//       } else if (oldOrder < newOrder) {
//         // Moving down
//         if (column.order > oldOrder && column.order <= newOrder) {
//           newColOrder = column.order - 1;
//         }
//       }

//       // Set the new order for the moved column
//       if (column.id === id) {
//         newColOrder = newOrder;
//       }

//       if (newColOrder !== column.order) {
//         return db.funnelColumn.update({
//           where: { id: column.id },
//           data: { order: newColOrder },
//         });
//       }
//     })
//   );

//   revalidatePath(`/funnels/${funnelColumn.funnelId}`);
//   return { success: true };
// }
