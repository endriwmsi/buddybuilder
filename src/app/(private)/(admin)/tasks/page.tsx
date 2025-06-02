import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksBoard from "./components/tasks-board";

export default async function TasksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mb-6 flex flex-col justify-between">
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <TasksBoard />
      </div>
    </div>
  );
}
