"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  CalendarCheck2,
  SignalLow,
  SignalMedium,
  SignalHigh,
  OctagonAlert,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskDetailsDialog from "./dialogs/task-details-dialog";
import { PRIORITY_CONFIG, TaskPriority } from "@/lib/types";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface KanbanTaskProps {
  task: Task;
  index: number;
  columnName: string;
  refreshData: () => Promise<void>;
}

export default function KanbanTask({
  task,
  index,
  columnName,
  refreshData,
}: KanbanTaskProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "LOW":
        return <SignalLow className="h-3 w-3" />;
      case "MEDIUM":
        return <SignalMedium className="h-3 w-3" />;
      case "HIGH":
        return <SignalHigh className="h-3 w-3" />;
      case "URGENT":
        return <OctagonAlert className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-2"
          >
            <Card
              className={`h-max cursor-pointer gap-3 rounded-md p-3 transition-shadow hover:shadow-sm ${
                snapshot.isDragging ? "shadow-lg" : ""
              }`}
              onClick={() => setIsDetailsOpen(true)}
            >
              <CardHeader className="p-0">
                <CardDescription>{task.description}</CardDescription>
                <CardTitle className="truncate">{task.title}</CardTitle>
              </CardHeader>

              <CardFooter className="gap-2 overflow-hidden p-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          `rounded-sm border p-1`,
                          priorityConfig.color
                        )}
                      >
                        {getPriorityIcon(task.priority)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{priorityConfig.label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs">
                  <span className="flex items-center gap-2">{columnName}</span>
                </div>

                {task.dueDate && (
                  <div className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs">
                    <span className="flex items-center gap-2">
                      <CalendarCheck2 className="h-4 w-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>

      <TaskDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        task={task}
        refreshData={refreshData}
      />
    </>
  );
}
