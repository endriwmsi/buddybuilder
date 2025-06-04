import { getFunnels } from "./actions/funnel.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FunnelCard from "./components/funnel-card";
import { Suspense } from "react";
import { DashboardSkeleton } from "../dashboard/components/dashboard-skeleton";
import FunnelsHeader from "./components/funnels-header";

export default async function FunnelsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const funnels = await getFunnels(session.user.id);

  return (
    // <div className="flex flex-1 flex-col gap-4 px-4 py-10">
    //   <FunnelsHeader />

    //   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    //     {funnels.map((funnel) => (
    //       <FunnelCard key={funnel.id} funnel={funnel} />
    //     ))}
    //   </div>
    // </div>

    <div className="flex flex-1 flex-col gap-4 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funis</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing and sales
            projects.
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <FunnelsHeader />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {funnels.map((funnel) => (
            <FunnelCard key={funnel.id} funnel={funnel} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
