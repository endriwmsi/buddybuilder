import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function FunnelsSkeleton() {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="m-0 p-0">
        <div className="h-16 w-full -translate-y-6 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="flex flex-col px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6">
        <Skeleton className="h-10 w-full rounded" />
      </CardFooter>
    </Card>
  );
}
