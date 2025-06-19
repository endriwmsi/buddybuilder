import { Suspense } from "react";
import { DashboardContent } from "./components/dashboard-content";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { getDashboardStats } from "./actions/dashboard.action";

export default function DashboardPage() {
  const statsPromise = getDashboardStats();

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing and sales
            projects.
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          statsPromise={statsPromise}
          projectsPromise={Promise.resolve([])}
          sprintsPromise={Promise.resolve([])}
          revenueDataPromise={Promise.resolve([])}
          salesFunnelDataPromise={Promise.resolve([])}
        />
      </Suspense>
    </div>
  );
}
