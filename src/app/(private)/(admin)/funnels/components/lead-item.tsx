"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { CalendarCheck2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lead } from "@/generated/prisma";
import LeadDetailsDialog from "./dialogs/lead-details-dialog";

interface LeadItemProps {
  lead: Lead;
  index: number;
  columnName: string;
  refreshData: () => Promise<void>;
}

export default function LeadItem({
  lead,
  index,
  columnName,
  refreshData,
}: LeadItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={lead.id} index={index}>
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
                <CardDescription>{lead.name}</CardDescription>
                <CardTitle className="truncate">{lead.company}</CardTitle>
              </CardHeader>

              <CardFooter className="gap-2 p-0">
                {/* <TooltipProvider>
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
                </TooltipProvider> */}

                <div className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs">
                  <span className="flex items-center gap-2">{columnName}</span>
                </div>

                {lead.createdAt && (
                  <div className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs">
                    <span className="flex items-center gap-2">
                      <CalendarCheck2 className="h-4 w-4" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>

      <LeadDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        lead={lead}
        refreshData={refreshData}
      />
    </>
  );
}
