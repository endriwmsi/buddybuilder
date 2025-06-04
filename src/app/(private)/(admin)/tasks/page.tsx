import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksBoard from "./components/tasks-board";
import { Suspense } from "react";
import FunnelsSkeleton from "../funnels/components/funnels-skeleton";

export default async function TasksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    // <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    //   <div className="mb-6 flex flex-col justify-between">
    //     <h1 className="text-3xl font-bold">Tarefas</h1>
    //     <TasksBoard />
    //   </div>
    // </div>

    <div className="flex flex-1 flex-col gap-4 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing and sales
            projects.
          </p>
        </div>
      </div>

      <Suspense fallback={<FunnelsSkeleton />}>
        <TasksBoard />
      </Suspense>
    </div>
  );
}
