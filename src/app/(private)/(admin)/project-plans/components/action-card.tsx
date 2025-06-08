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
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HIGH":
      return "bg-red-100 text-red-800";
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
}: ActionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isRefined = action.detailedActions.length > 0;

  return (
    <>
      <Card
        className={cn(
          "p-4 transition-all duration-200 hover:shadow-md",
          isDialogOpen && "ring-primary ring-2",
          isRefined && "hover:bg-muted/50 cursor-pointer"
        )}
        onClick={() => isRefined && setIsDialogOpen(true)}
      >
        <div className="flex items-center gap-4">
          {!isRefined && (
            <div
              className="flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange(action.id, checked as boolean)
                }
                className="h-4 w-4 rounded border-gray-300"
                disabled={isRefined}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{action.title}</h3>
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-medium",
                    getPriorityColor(action.priority)
                  )}
                >
                  {getPriorityText(action.priority)}
                </Badge>
                {isRefined && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Refinada
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-gray-600">{action.description}</p>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{action.title}</DialogTitle>
              <Badge
                variant="secondary"
                className={cn("font-medium", getPriorityColor(action.priority))}
              >
                {getPriorityText(action.priority)}
              </Badge>
            </div>
            <DialogDescription>{action.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 overflow-y-auto pr-2">
            {action.detailedActions.map((detailedAction) => {
              const details = parseDetailedDescription(
                detailedAction.description
              );
              return (
                <div key={detailedAction.id} className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Objetivo</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: details.objective }}
                    />
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Execução</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: details.execution }}
                    />
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Conclusão</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: details.conclusion }}
                    />
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Subtarefas</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: details.subtasks }}
                    />
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
