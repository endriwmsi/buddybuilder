import { LeadSource, LeadStatus } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export type SidebarUserType = {
  id: string;
  name: string;
  email: string;
  image: string | null; // nunca undefined
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Column = {
  id: string;
  name: string;
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  dueDate: Date | null;
  priority: TaskPriority;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Lead = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;

  value: Decimal;
  source: LeadSource;
  status: LeadStatus;

  description: String;
  tags: String;
  lastContact: Date;
  expectedClose: Date;
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: "Baixa",
    color: "bg-blue-600/20 text-blue-500 border-2 border-blue-500",
  },
  MEDIUM: {
    label: "Média",
    color: "bg-yellow-600/20 text-yellow-500 border-2 border-yellow-500",
  },
  HIGH: {
    label: "Alta",
    color: "bg-orange-600/20 text-orange-500 border-2 border-orange-500",
  },
  URGENT: {
    label: "Urgente",
    color: "bg-red-600/20 text-white border-2 border-red-500",
  },
};
