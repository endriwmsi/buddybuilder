import { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewProjectPlanForm } from "@/app/(private)/(admin)/project-plans/components/new-project-plan-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "New Project Plan",
  description: "Create a new project plan",
};

export default async function NewProjectPlanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container py-10">
      <div className="m-auto flex h-max max-w-3xl items-center justify-center">
        <NewProjectPlanForm userId={session.user.id} />
      </div>
    </div>
  );
}
