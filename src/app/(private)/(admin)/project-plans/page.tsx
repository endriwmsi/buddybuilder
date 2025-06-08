import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProjectCard } from "./components/project-card";
import { getProjectPlans } from "./actions/plan.action";

export const metadata: Metadata = {
  title: "Project Plans",
  description: "Manage your project plans",
};

export default async function ProjectPlansPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const projectPlans = await getProjectPlans();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Link href="/project-plans/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Novo projeto
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectPlans.map((plan) => (
          <ProjectCard key={plan.id} project={plan} />
        ))}
      </div>

      {projectPlans.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">
            Você ainda não tem nenhum planejamento
          </h3>
          <p className="mb-6 text-gray-500">
            Crie seu primeiro projeto para começar.
          </p>
          <Link href="/project-plans/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar novo projeto
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
