"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TaskPriority } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";

// Column Actions
export async function getColumns(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Check if user has any columns
  const existingColumns = await db.kanbanColumn.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  // If user has no columns, create default columns
  if (existingColumns.length === 0) {
    const defaultColumns = [
      { name: "To-do", order: 0, color: "#e2e8f0" },
      { name: "In Progress", order: 1, color: "#bfdbfe" },
      { name: "Done", order: 2, color: "#bbf7d0" },
    ];

    const createdColumns = await Promise.all(
      defaultColumns.map(async (column) => {
        return db.kanbanColumn.create({
          data: {
            name: column.name,
            order: column.order,
            color: column.color,
            userId,
          },
        });
      })
    );

    return createdColumns;
  }

  return existingColumns;
}

export async function createColumn(data: {
  name: string;
  color: string;
  userId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const createColumnSchema = z.object({
    name: z.string().min(1).max(50),
    color: z.string(),
    userId: z.string(),
  });

  const validatedData = createColumnSchema.parse(data);

  // Get the highest order value
  const highestOrder = await db.kanbanColumn.findFirst({
    where: { userId: validatedData.userId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const column = await db.kanbanColumn.create({
    data: {
      name: validatedData.name,
      color: validatedData.color,
      order: newOrder,
      userId: validatedData.userId,
    },
  });

  revalidatePath("/kanban");
  return column;
}

export async function updateColumn(data: {
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

  const updateColumnSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(50),
    color: z.string(),
  });

  const validatedData = updateColumnSchema.parse(data);

  // Verify ownership
  const column = await db.kanbanColumn.findUnique({
    where: { id: validatedData.id },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedColumn = await db.kanbanColumn.update({
    where: { id: validatedData.id },
    data: {
      name: validatedData.name,
      color: validatedData.color,
    },
  });

  revalidatePath("/kanban");
  return updatedColumn;
}

export async function deleteColumn(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify ownership
  const column = await db.kanbanColumn.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Delete the column and all its tasks
  await db.kanbanColumn.delete({
    where: { id },
  });

  // Reorder remaining columns
  const remainingColumns = await db.kanbanColumn.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingColumns.map(async (column, index) => {
      return db.kanbanColumn.update({
        where: { id: column.id },
        data: { order: index },
      });
    })
  );

  revalidatePath("/kanban");
  return { success: true };
}

export async function reorderColumn(id: string, newOrder: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify ownership
  const column = await db.kanbanColumn.findUnique({
    where: { id },
    select: { userId: true, order: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const oldOrder = column.order;

  // Get all columns for the user
  const columns = await db.kanbanColumn.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  // Update orders
  await Promise.all(
    columns.map(async (col) => {
      let newColOrder = col.order;

      if (oldOrder > newOrder) {
        // Moving up
        if (col.order >= newOrder && col.order < oldOrder) {
          newColOrder = col.order + 1;
        }
      } else if (oldOrder < newOrder) {
        // Moving down
        if (col.order > oldOrder && col.order <= newOrder) {
          newColOrder = col.order - 1;
        }
      }

      // Set the new order for the moved column
      if (col.id === id) {
        newColOrder = newOrder;
      }

      if (newColOrder !== col.order) {
        return db.kanbanColumn.update({
          where: { id: col.id },
          data: { order: newColOrder },
        });
      }
    })
  );

  revalidatePath("/kanban");
  return { success: true };
}

// Task Actions
export async function getTasks(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const tasks = await db.kanbanTask.findMany({
    where: {
      column: {
        userId,
      },
    },
    orderBy: { order: "asc" },
    include: {
      column: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Filter out column field
  return tasks.map(({ column, ...task }) => task);
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  columnId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const createTaskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    columnId: z.string(),
  });

  const validatedData = createTaskSchema.parse(data) as {
    title: string;
    description?: string;
    dueDate?: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    columnId: string;
  };

  // Verify column ownership
  const column = await db.kanbanColumn.findUnique({
    where: { id: validatedData.columnId },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Get the highest order value for the column
  const highestOrder = await db.kanbanTask.findFirst({
    where: { columnId: validatedData.columnId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const task = await db.kanbanTask.create({
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority,
      order: newOrder,
      columnId: validatedData.columnId,
    },
  });

  revalidatePath("/kanban");
  return task;
}

export async function updateTask(data: {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const updateTaskSchema = z.object({
    id: z.string(),
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    dueDate: z.string().nullable().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  });

  const validatedData = updateTaskSchema.parse(data) as {
    id: string;
    title: string;
    description?: string;
    dueDate?: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  };

  // Verify task ownership
  const task = await db.kanbanTask.findUnique({
    where: { id: validatedData.id },
    include: {
      column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedTask = await db.kanbanTask.update({
    where: { id: validatedData.id },
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority,
    },
  });

  revalidatePath("/kanban");
  return updatedTask;
}

export async function deleteTask(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify task ownership
  const task = await db.kanbanTask.findUnique({
    where: { id },
    include: {
      column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Delete the task
  await db.kanbanTask.delete({
    where: { id },
  });

  // Reorder remaining tasks in the column
  const remainingTasks = await db.kanbanTask.findMany({
    where: { columnId: task.columnId },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingTasks.map(async (task, index) => {
      return db.kanbanTask.update({
        where: { id: task.id },
        data: { order: index },
      });
    })
  );

  revalidatePath("/kanban");
  return { success: true };
}

export async function deleteMultipleTasks(taskIds: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify task ownership for all tasks
  const tasks = await db.kanbanTask.findMany({
    where: {
      id: {
        in: taskIds,
      },
    },
    include: {
      column: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Check if all tasks belong to the current user
  const unauthorized = tasks.some(
    (task) => task.column.userId !== session.user.id
  );
  if (unauthorized) {
    throw new Error("Unauthorized");
  }

  // Group tasks by column for reordering later
  const columnTaskMap = tasks.reduce(
    (acc, task) => {
      if (!acc[task.columnId]) {
        acc[task.columnId] = [];
      }
      acc[task.columnId].push(task.id);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Delete all tasks
  await db.kanbanTask.deleteMany({
    where: {
      id: {
        in: taskIds,
      },
    },
  });

  // Reorder remaining tasks in each affected column
  await Promise.all(
    Object.keys(columnTaskMap).map(async (columnId) => {
      const remainingTasks = await db.kanbanTask.findMany({
        where: { columnId },
        orderBy: { order: "asc" },
      });

      await Promise.all(
        remainingTasks.map(async (task, index) => {
          return db.kanbanTask.update({
            where: { id: task.id },
            data: { order: index },
          });
        })
      );
    })
  );

  revalidatePath("/kanban");
  return { success: true };
}

export async function moveTask(id: string, columnId: string, newOrder: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify task ownership
  const task = await db.kanbanTask.findUnique({
    where: { id },
    include: {
      column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Verify column ownership
  const column = await db.kanbanColumn.findUnique({
    where: { id: columnId },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const oldColumnId = task.columnId;
  const oldOrder = task.order;

  // If moving to a different column
  if (oldColumnId !== columnId) {
    // Update orders in the old column
    const oldColumnTasks = await db.kanbanTask.findMany({
      where: {
        columnId: oldColumnId,
        id: { not: id },
      },
      orderBy: { order: "asc" },
    });

    await Promise.all(
      oldColumnTasks.map(async (t, index) => {
        return db.kanbanTask.update({
          where: { id: t.id },
          data: { order: index },
        });
      })
    );

    // Update orders in the new column
    const newColumnTasks = await db.kanbanTask.findMany({
      where: { columnId },
      orderBy: { order: "asc" },
    });

    // Insert at the specified position
    await Promise.all(
      newColumnTasks.map(async (t, index) => {
        let newTaskOrder = index;

        if (index >= newOrder) {
          newTaskOrder = index + 1;
        }

        return db.kanbanTask.update({
          where: { id: t.id },
          data: { order: newTaskOrder },
        });
      })
    );

    // Move the task to the new column and position
    await db.kanbanTask.update({
      where: { id },
      data: {
        columnId,
        order: newOrder,
      },
    });
  } else {
    // Moving within the same column
    const columnTasks = await db.kanbanTask.findMany({
      where: {
        columnId,
        id: { not: id },
      },
      orderBy: { order: "asc" },
    });

    // Create a new array with the task at the new position
    const reorderedTasks = [...columnTasks];
    reorderedTasks.splice(newOrder, 0, task);

    // Update all tasks with their new order
    await Promise.all(
      reorderedTasks.map(async (t, index) => {
        return db.kanbanTask.update({
          where: { id: t.id },
          data: { order: index },
        });
      })
    );
  }

  revalidatePath("/kanban");
  return { success: true };
}
