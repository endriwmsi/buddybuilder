"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "Completed" | "Active" | "Upcoming";
  project: string;
}

interface SprintTimelineProps {
  sprints: Sprint[];
}

export function SprintTimeline({ sprints }: SprintTimelineProps) {
  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <Card
          key={sprint.id}
          className={sprint.status === "Completed" ? "bg-muted/50" : ""}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{sprint.name}</h4>
                <Badge
                  variant={sprint.status === "Active" ? "default" : "outline"}
                >
                  {sprint.status}
                </Badge>
              </div>
              <div className="text-muted-foreground text-xs">
                {sprint.startDate} - {sprint.endDate}
              </div>
              <div className="text-muted-foreground text-xs">
                Project: {sprint.project}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={sprint.progress} className="h-2" />
                <span className="text-xs font-medium">{sprint.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
