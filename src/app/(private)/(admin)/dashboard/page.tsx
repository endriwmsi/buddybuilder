import { Suspense } from "react";
import { DashboardContent } from "./components/dashboard-content";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { getDashboardStats } from "./actions/dashboard.action";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

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
          statsPromise={Promise.resolve(stats)}
          projectsPromise={Promise.resolve(stats.recentProjects)}
          sprintsPromise={Promise.resolve([])}
          revenueDataPromise={Promise.resolve([])}
          salesFunnelDataPromise={Promise.resolve([])}
        />
      </Suspense>
    </div>
  );
}
