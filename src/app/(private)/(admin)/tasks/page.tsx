import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksBoard from "./components/tasks-board";

const TasksPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-10">
      <TasksBoard />
    </div>
  );
};

export default TasksPage;
