export type SidebarUserType = {
  id: string;
  name: string;
  email: string;
  image: string | null; // nunca undefined
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Column {
  id: string;
  name: string;
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  order: number;
  dueDate: Date | null;
  priority: TaskPriority;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

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
