import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

export function ProjectCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden transition-all duration-200">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-gray-600">
              <Skeleton className="mb-1 h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </CardDescription>
          </div>
          <div className="h-8 w-8" /> {/* Placeholder for dropdown menu */}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3">
        <div className="mt-1 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
