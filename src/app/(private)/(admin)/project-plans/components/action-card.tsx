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
          "group relative p-4 transition-all duration-200 hover:shadow-md",
          isDialogOpen && "ring-primary ring-2",
          isRefined && "hover:bg-muted/50 cursor-pointer"
        )}
        onClick={() => isRefined && setIsDialogOpen(true)}
      >
        <div
          className={cn("flex gap-3", viewMode === "list" && "items-center")}
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
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-medium">
                {action.title}
              </h3>
              <div className="flex shrink-0 gap-1.5">
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 px-1.5 text-xs font-medium",
                    getPriorityColor(action.priority)
                  )}
                >
                  {getPriorityText(action.priority)}
                </Badge>
                {isRefined && (
                  <Badge
                    variant="outline"
                    className="h-5 border-green-500 bg-green-600/20 px-1.5 text-xs text-green-500"
                  >
                    Refinada
                  </Badge>
                )}
              </div>
            </div>
            <p className="line-clamp-2 text-xs text-gray-400">
              {action.description}
            </p>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">{action.title}</DialogTitle>
              <Badge
                variant="secondary"
                className={cn(
                  "mr-5 h-6 px-2 text-sm font-medium",
                  getPriorityColor(action.priority)
                )}
              >
                {getPriorityText(action.priority)}
              </Badge>
            </div>
            <DialogDescription className="text-sm">
              {action.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2">
            {action.detailedActions.map((detailedAction) => {
              const details = parseDetailedDescription(
                detailedAction.description
              );
              return (
                <div key={detailedAction.id} className="space-y-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-2 text-base font-semibold">Objetivo</h4>
                    <div className="text-sm whitespace-pre-line">
                      {details.objective}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-2 text-base font-semibold">Execução</h4>
                    <div className="text-sm whitespace-pre-line">
                      {details.execution}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-2 text-base font-semibold">Conclusão</h4>
                    <div className="text-sm whitespace-pre-line">
                      {details.conclusion}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-2 text-base font-semibold">Subtarefas</h4>
                    <div className="text-sm whitespace-pre-line">
                      {details.subtasks}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
