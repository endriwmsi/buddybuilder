"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TaskPriority } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import {
  createColumnSchema,
  createTaskSchema,
  updateTaskSchema,
} from "./schemas";

// Column Actions
export async function getColumns(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const existingColumns = await db.taskColumn.findMany({
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
        return db.taskColumn.create({
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

  const validatedData = createColumnSchema.parse(data);

  // Get the highest order value
  const highestOrder = await db.taskColumn.findFirst({
    where: { userId: validatedData.userId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const column = await db.taskColumn.create({
    data: {
      name: validatedData.name,
      color: validatedData.color,
      order: newOrder,
      userId: validatedData.userId,
    },
  });

  revalidatePath("/tasks");
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
  const column = await db.taskColumn.findUnique({
    where: { id: validatedData.id },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedColumn = await db.taskColumn.update({
    where: { id: validatedData.id },
    data: {
      name: validatedData.name,
      color: validatedData.color,
    },
  });

  revalidatePath("/tasks");
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
  const column = await db.taskColumn.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Delete the column and all its tasks
  await db.taskColumn.delete({
    where: { id },
  });

  // Reorder remaining columns
  const remainingColumns = await db.taskColumn.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingColumns.map(async (column, index) => {
      return db.taskColumn.update({
        where: { id: column.id },
        data: { order: index },
      });
    })
  );

  revalidatePath("/tasks");
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
  const column = await db.taskColumn.findUnique({
    where: { id },
    select: { userId: true, order: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const oldOrder = column.order;

  // Get all columns for the user
  const columns = await db.taskColumn.findMany({
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
        return db.taskColumn.update({
          where: { id: col.id },
          data: { order: newColOrder },
        });
      }
    })
  );

  revalidatePath("/tasks");
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

  const tasks = await db.task.findMany({
    where: {
      task_column: {
        userId,
      },
    },
    orderBy: { order: "asc" },
    include: {
      task_column: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Filter out column field
  return tasks.map(({ task_column, ...task }) => task);
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  taskColumnId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const validatedData = createTaskSchema.parse(data);

  // Verify column ownership
  const column = await db.taskColumn.findUnique({
    where: { id: validatedData.taskColumnId },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Get the highest order value for the column
  const highestOrder = await db.task.findFirst({
    where: { taskColumnId: validatedData.taskColumnId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 0;

  const task = await db.task.create({
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority,
      order: newOrder,
      taskColumnId: validatedData.taskColumnId,
      userId: session.user.id,
    },
  });

  revalidatePath("/tasks");
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

  const validatedData = updateTaskSchema.parse(data) as {
    id: string;
    title: string;
    description?: string;
    dueDate?: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  };

  // Verify task ownership
  const task = await db.task.findUnique({
    where: { id: validatedData.id },
    include: {
      task_column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.task_column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedTask = await db.task.update({
    where: { id: validatedData.id },
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority,
    },
  });

  revalidatePath("/tasks");
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
  const task = await db.task.findUnique({
    where: { id },
    include: {
      task_column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.task_column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Delete the task
  await db.task.delete({
    where: { id },
  });

  // Reorder remaining tasks in the column
  const remainingTasks = await db.task.findMany({
    where: { task_column: task.task_column },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    remainingTasks.map(async (task, index) => {
      return db.task.update({
        where: { id: task.id },
        data: { order: index },
      });
    })
  );

  revalidatePath("/tasks");
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
  const tasks = await db.task.findMany({
    where: {
      id: {
        in: taskIds,
      },
    },
    include: {
      task_column: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Check if all tasks belong to the current user
  const unauthorized = tasks.some(
    (task) => task.task_column.userId !== session.user.id
  );
  if (unauthorized) {
    throw new Error("Unauthorized");
  }

  // Group tasks by column for reordering later
  const columnTaskMap = tasks.reduce(
    (acc, task) => {
      if (!acc[task.taskColumnId]) {
        acc[task.taskColumnId] = [];
      }
      acc[task.taskColumnId].push(task.id);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Delete all tasks
  await db.task.deleteMany({
    where: {
      id: {
        in: taskIds,
      },
    },
  });

  // Reorder remaining tasks in each affected column
  await Promise.all(
    Object.keys(columnTaskMap).map(async (taskColumnId) => {
      const remainingTasks = await db.task.findMany({
        where: { taskColumnId },
        orderBy: { order: "asc" },
      });

      await Promise.all(
        remainingTasks.map(async (task, index) => {
          return db.task.update({
            where: { id: task.id },
            data: { order: index },
          });
        })
      );
    })
  );

  revalidatePath("/tasks");
  return { success: true };
}

export async function moveTask(
  id: string,
  taskColumnId: string,
  newOrder: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verify task ownership
  const task = await db.task.findUnique({
    where: { id },
    include: {
      task_column: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!task || task.task_column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Verify column ownership
  const column = await db.taskColumn.findUnique({
    where: { id: taskColumnId },
    select: { userId: true },
  });

  if (!column || column.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const oldTaskColumnId = task.taskColumnId;

  // If moving to a different column
  if (oldTaskColumnId !== taskColumnId) {
    // Update orders in the old column
    const oldTasksColumn = await db.task.findMany({
      where: {
        taskColumnId: oldTaskColumnId,
        id: { not: id },
      },
      orderBy: { order: "asc" },
    });

    await Promise.all(
      oldTasksColumn.map(async (t, index) => {
        return db.task.update({
          where: { id: t.id },
          data: { order: index },
        });
      })
    );

    // Update orders in the new column
    const newColumnTasks = await db.task.findMany({
      where: { taskColumnId },
      orderBy: { order: "asc" },
    });

    // Insert at the specified position
    await Promise.all(
      newColumnTasks.map(async (t, index) => {
        let newTaskOrder = index;

        if (index >= newOrder) {
          newTaskOrder = index + 1;
        }

        return db.task.update({
          where: { id: t.id },
          data: { order: newTaskOrder },
        });
      })
    );

    // Move the task to the new column and position
    await db.task.update({
      where: { id },
      data: {
        taskColumnId,
        order: newOrder,
      },
    });
  } else {
    // Moving within the same column
    const columnTasks = await db.task.findMany({
      where: {
        taskColumnId,
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
        return db.task.update({
          where: { id: t.id },
          data: { order: index },
        });
      })
    );
  }

  revalidatePath("/tasks");
  return { success: true };
}
