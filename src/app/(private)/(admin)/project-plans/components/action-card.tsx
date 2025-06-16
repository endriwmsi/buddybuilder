"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedAction, PlanAction } from "@/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface ActionCardProps {
  action: PlanAction & {
    detailedActions: DetailedAction[];
    priority: "LOW" | "MEDIUM" | "HIGH";
  };
  isSelected: boolean;
  onSelectionChange: (actionId: string, checked: boolean) => void;
  viewMode: "grid" | "list";
}

interface DetailedDescription {
  objective: string;
  execution: string;
  conclusion: string;
  subtasks: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-blue-600/20 text-blue-500 border-2 border-blue-500";
    case "MEDIUM":
      return "bg-yellow-600/20 text-yellow-500 border-2 border-yellow-500";
    case "HIGH":
      return "bg-red-600/20 text-white border-2 border-red-500";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "Baixa";
    case "MEDIUM":
      return "Média";
    case "HIGH":
      return "Alta";
    default:
      return priority;
  }
};

const parseDetailedDescription = (description: string): DetailedDescription => {
  try {
    return JSON.parse(description);
  } catch (error) {
    console.error("Error parsing detailed description:", error);
    return {
      objective: "Erro ao carregar detalhamento",
      execution: "",
      conclusion: "",
      subtasks: "",
    };
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function ActionCard({
  action,
  isSelected,
  onSelectionChange,
  viewMode,
}: ActionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isRefined = action.detailedActions.length > 0;

  return (
    <>
      <Card
        className={cn(
          "group relative p-3 transition-all duration-200 hover:shadow-md sm:p-4",
          isDialogOpen && "ring-primary ring-2",
          isRefined && "hover:bg-muted/50 cursor-pointer"
        )}
        onClick={() => isRefined && setIsDialogOpen(true)}
      >
        <div
          className={cn(
            "flex gap-2 sm:gap-3",
            viewMode === "list" && "items-center"
          )}
        >
          {!isRefined && (
            <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange(action.id, checked as boolean)
                }
                className="mt-1 h-3.5 w-3.5 rounded border-gray-300"
                disabled={isRefined}
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-1 sm:gap-1.5">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-2">
              <h3 className="line-clamp-1 text-sm font-medium">
                {action.title}
              </h3>
              <div className="flex shrink-0 flex-wrap gap-1 sm:gap-1.5">
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 px-1.5 text-[10px] font-medium sm:text-xs",
                    getPriorityColor(action.priority)
                  )}
                >
                  {getPriorityText(action.priority)}
                </Badge>
                {isRefined && (
                  <Badge
                    variant="outline"
                    className="h-5 border-green-500 bg-green-600/20 px-1.5 text-[10px] text-green-500 sm:text-xs"
                  >
                    Refinada
                  </Badge>
                )}
              </div>
            </div>
            <p className="line-clamp-2 text-[11px] text-gray-400 sm:text-xs">
              {action.description}
            </p>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <DialogTitle className="text-base sm:text-lg">
                {action.title}
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-3 h-5 px-2 text-xs font-medium",
                    getPriorityColor(action.priority)
                  )}
                >
                  {getPriorityText(action.priority)}
                </Badge>
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm">
              {action.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto pr-2 sm:space-y-4">
            {action.detailedActions.map((detailedAction) => {
              const details = parseDetailedDescription(
                detailedAction.description
              );
              return (
                <motion.div
                  key={detailedAction.id}
                  className="space-y-2 text-xs sm:space-y-3 sm:text-sm"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg border p-2 sm:p-3"
                  >
                    <h4 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                      Objetivo
                    </h4>
                    <div className="whitespace-pre-line">
                      {details.objective}
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg border p-2 sm:p-3"
                  >
                    <h4 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                      Execução
                    </h4>
                    <div className="whitespace-pre-line">
                      {details.execution}
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg border p-2 sm:p-3"
                  >
                    <h4 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                      Conclusão
                    </h4>
                    <div className="whitespace-pre-line">
                      {details.conclusion}
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg border p-2 sm:p-3"
                  >
                    <h4 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                      Subtarefas
                    </h4>
                    <div className="whitespace-pre-line">
                      {details.subtasks}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
