import { Skeleton } from "@/components/ui/skeleton";

export function TasksSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {/* Coluna 1 - To Do */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-4">
            <Skeleton className="mb-2 h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-2/3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 2 - In Progress */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-4">
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-1/2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 3 - Done */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-4">
            <Skeleton className="mb-2 h-6 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-2/3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-1/2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-3 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
