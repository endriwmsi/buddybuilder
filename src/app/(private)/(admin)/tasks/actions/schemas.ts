import { z } from "zod";

export const createColumnSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string(),
  userId: z.string(),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export const createTaskSchema = z.object({
  taskColumnId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});
