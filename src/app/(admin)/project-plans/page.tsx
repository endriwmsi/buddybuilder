import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Info } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProjectCard } from "./components/project-card";
import db from "@/lib/prisma";

export const metadata: Metadata = {
  title: "BuddyBuilder - Projetos",
  description: "Gerencie seus projetos e planejamentos estratégicos",
};

const ProjectPlansPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Buscar usuário, plano e projetos
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { plan: true },
  });

  const projectPlans = await db.projectPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Verificar se o usuário é admin
  const isAdmin = session.user.role === "ADMIN";

  // Se for admin, não há limitação. Se não for, verifica o limite do plano
  const atingiuLimite =
    !isAdmin && !!(user?.plan && projectPlans.length >= user.plan.maxProjects);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os seus planejamentos estratégicos
            </p>
          </div>
          {atingiuLimite ? (
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Novo projeto
            </Button>
          ) : (
            <Link href="/project-plans/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo projeto
              </Button>
            </Link>
          )}
        </div>
      </div>

      {atingiuLimite && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Você atingiu o limite de projetos do seu plano.
              {!isAdmin &&
                " Faça upgrade do seu plano para criar mais projetos."}
            </p>
          </div>
        </div>
      )}

      {projectPlans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectPlans.map((plan) => (
            <ProjectCard key={plan.id} project={plan} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-17rem)] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">
            Você ainda não tem nenhum planejamento
          </h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro projeto para começar.
          </p>
          {atingiuLimite ? (
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Criar novo projeto
            </Button>
          ) : (
            <Link href="/project-plans/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar novo projeto
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPlansPage;
