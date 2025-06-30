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
import LeadDetailsDialog from "./dialogs/leads/lead-details-dialog";
import { sourceOptions, statusTranslations } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const items = [
    {
      type: "column",
      content: columnName,
    },
    ...(lead.source
      ? [
          {
            type: "source",
            content: sourceOptions.find(
              (option) => option.value === lead.source
            )?.label,
          },
        ]
      : []),
    ...(lead.status
      ? [
          {
            type: "status",
            content: statusTranslations[lead.status],
          },
        ]
      : []),
    ...(lead.tags
      ? [
          {
            type: "tags",
            content: lead.tags,
          },
        ]
      : []),
    ...(lead.createdAt
      ? [
          {
            type: "date",
            content: new Date(lead.createdAt).toLocaleDateString(),
            icon: CalendarCheck2,
          },
        ]
      : []),
  ];

  // Split items into visible and hidden
  const visibleItems = items.slice(0, 3);
  const hiddenItems = items.slice(3);

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
                <CardTitle className="truncate">{lead.name}</CardTitle>
                <CardDescription>{lead.company}</CardDescription>
              </CardHeader>

              <CardFooter className="gap-2 overflow-hidden p-0">
                {visibleItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.content}
                    </span>
                  </div>
                ))}

                {hiddenItems.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-muted-foreground w-max cursor-pointer rounded-sm border px-2 py-1 text-xs">
                          <span className="flex items-center gap-2">
                            +{hiddenItems.length}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-muted/30 flex flex-wrap gap-2 p-2">
                        {hiddenItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-muted-foreground w-max rounded-sm border px-2 py-1 text-xs"
                          >
                            <span className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              {item.content}
                            </span>
                          </div>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
