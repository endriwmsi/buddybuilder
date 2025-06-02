"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createLeadSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

// Task Actions
export async function getLeads(funnelId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const leads = await db.lead.findMany({
    where: {
      funnelId,
    },
    orderBy: { order: "asc" },
  });

  return leads;
}

export async function createLead(
  funnelId: string,
  data: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    value?: number;
    source?:
      | "WEBSITE"
      | "REFERRAL"
      | "COLD_CALL"
      | "EMAIL_CAMPAIGN"
      | "SOCIAL_MEDIA"
      | "EVENT"
      | "OTHER";
    status?:
      | "NEW"
      | "CONTACTED"
      | "QUALIFIED"
      | "PROPOSAL"
      | "NEGOTIATION"
      | "WON"
      | "LOST";
    description?: string;
    tags?: string;
    expectedClose?: string;
    funnelColumnId: string;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const validatedData = createLeadSchema.parse(data);

  // Verify column ownership
  const column = await db.funnelColumn.findUnique({
    where: { id: validatedData.funnelColumnId },
    include: {
      funnel: {
        select: { userId: true },
      },
    },
  });

  if (!column || column.funnel.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Get the highest order value for the column
  const highestOrder = await db.lead.findFirst({
    where: { funnelColumnId: validatedData.funnelColumnId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const lead = await db.lead.create({
    data: {
      name: validatedData.name,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      company: validatedData.company || null,
      position: validatedData.position || null,
      value: validatedData.value ? new Decimal(validatedData.value) : null,
      source: validatedData.source || "OTHER",
      status: validatedData.status || "NEW",
      description: validatedData.description || null,
      tags: validatedData.tags || null,
      expectedClose: validatedData.expectedClose
        ? new Date(validatedData.expectedClose)
        : null,
      order: newOrder,
      funnelId: column.funnelId,
      funnelColumnId: validatedData.funnelColumnId,
    },
  });

  revalidatePath(`/funnels/${funnelId}`);
  return lead;
}

export async function moveLead(
  id: string,
  funnelColumnId: string,
  // taskColumnId: string,
  newOrder: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify task ownership
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      funnelColumn: {
        select: {
          funnelId: true,
        },
      },
    },
  });

  if (!lead) {
    throw new Error("Unauthorized");
  }

  // Verify funnelColumn ownership
  const funnelColumn = await db.funnelColumn.findUnique({
    where: { id: funnelColumnId },
    select: { funnelId: true },
  });

  if (!funnelColumn) {
    throw new Error("Unauthorized");
  }

  const oldLeadColumnId = lead.funnelColumnId;

  // If moving to a different column
  if (oldLeadColumnId !== funnelColumnId) {
    // Update orders in the old column
    const oldLeadsColumn = await db.lead.findMany({
      where: {
        funnelColumnId: oldLeadColumnId,
        id: { not: id },
      },
      orderBy: { order: "asc" },
    });

    await Promise.all(
      oldLeadsColumn.map(async (lead, index) => {
        return db.task.update({
          where: { id: lead.id },
          data: { order: index },
        });
      })
    );

    // Update orders in the new column
    const newFunnelColumnLead = await db.lead.findMany({
      where: { funnelColumnId },
      orderBy: { order: "asc" },
    });

    // Insert at the specified position
    await Promise.all(
      newFunnelColumnLead.map(async (lead, index) => {
        let newLeadOrder = index;

        if (index >= newOrder) {
          newLeadOrder = index + 1;
        }

        return db.task.update({
          where: { id: lead.id },
          data: { order: newLeadOrder },
        });
      })
    );

    // Move the task to the new column and position
    await db.lead.update({
      where: { id },
      data: {
        funnelColumnId,
        order: newOrder,
      },
    });
  } else {
    // Moving within the same column
    const funnelColumnLeads = await db.lead.findMany({
      where: {
        funnelColumnId,
        id: { not: id },
      },
      orderBy: { order: "asc" },
    });

    // Create a new array with the task at the new position
    const reorderedLeads = [...funnelColumnLeads];
    reorderedLeads.splice(newOrder, 0, lead);

    // Update all tasks with their new order
    await Promise.all(
      reorderedLeads.map(async (lead, index) => {
        return db.lead.update({
          where: { id: lead.id },
          data: { order: index },
        });
      })
    );
  }

  revalidatePath(`/funnels`);
  return { success: true };
}

export async function updateLead(data: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  value?: number;
  source?:
    | "WEBSITE"
    | "REFERRAL"
    | "COLD_CALL"
    | "EMAIL_CAMPAIGN"
    | "SOCIAL_MEDIA"
    | "EVENT"
    | "OTHER";
  status?:
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "PROPOSAL"
    | "NEGOTIATION"
    | "WON"
    | "LOST";
  description?: string;
  tags?: string;
  expectedClose?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify lead funnel
  const lead = await db.lead.findUnique({
    where: { id: data.id },
    include: {
      funnelColumn: {
        select: {
          funnelId: true,
        },
      },
    },
  });

  if (!lead) {
    throw new Error("Unauthorized");
  }

  const updatedLead = await db.lead.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      position: data.position || null,
      value: data.value ? new Decimal(data.value) : null,
      source: data.source || "OTHER",
      status: data.status || "NEW",
      description: data.description || null,
      tags: data.tags || null,
      expectedClose: data.expectedClose ? new Date(data.expectedClose) : null,
    },
  });

  revalidatePath(`/funnels`);
  return updatedLead;
}

export async function deleteLead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify lead funnel
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      funnelColumn: {
        select: {
          funnelId: true,
        },
      },
    },
  });

  if (!lead) {
    throw new Error("Unauthorized");
  }

  // Delete the lead
  await db.lead.delete({
    where: { id },
  });

  // Reorder remaining leads in the column
  const remainingLeads = await db.lead.findMany({
    where: { funnelColumnId: lead.funnelColumnId },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingLeads.map(async (lead, index) => {
      return db.lead.update({
        where: { id: lead.id },
        data: { order: index },
      });
    })
  );

  revalidatePath(`/funnels`);
  return { success: true };
}

// export async function deleteMultipleLeads(funnelId: string, leadIds: string[]) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/auth/login");
//   }

//   // Verify task ownership for all tasks
//   const leads = await db.lead.findMany({
//     where: {
//       id: {
//         in: leadIds,
//       },
//     },
//     include: {
//       funnelColumn: {
//         select: {
//           funnelId: true,
//         },
//       },
//     },
//   });

//   // Check if all tasks belong to the current funnel
//   const unauthorized = leads.some(
//     (lead) => lead.funnelColumn.id !== session.user.id
//   );
//   if (unauthorized) {
//     throw new Error("Unauthorized");
//   }

//   // Group tasks by column for reordering later
//   const columnTaskMap = tasks.reduce(
//     (acc, task) => {
//       if (!acc[task.leadColumnId]) {
//         acc[task.leadColumnId] = [];
//       }
//       acc[task.leadColumnId].push(task.id);
//       return acc;
//     },
//     {} as Record<string, string[]>
//   );

//   // Delete all tasks
//   await db.lead.deleteMany({
//     where: {
//       id: {
//         in: taskIds,
//       },
//     },
//   });

//   // Reorder remaining tasks in each affected column
//   await Promise.all(
//     Object.keys(columnTaskMap).map(async (taskColumnId) => {
//       const remainingTasks = await db.lead.findMany({
//         where: { taskColumnId },
//         orderBy: { order: "asc" },
//       });

//       await Promise.all(
//         remainingTasks.map(async (task, index) => {
//           return db.lead.update({
//             where: { id: task.id },
//             data: { order: index },
//           });
//         })
//       );
//     })
//   );

//   revalidatePath("/tasks");
//   return { success: true };
// }
