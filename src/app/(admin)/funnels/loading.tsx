import { FunnelsSkeleton } from "./components/funnels-skeleton";

const FunnelsLoader = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 space-y-2">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-96 animate-pulse rounded" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <FunnelsSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default FunnelsLoader;
