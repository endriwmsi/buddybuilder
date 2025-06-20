"use client";

import { use } from "react";
import {
  CreditCard,
  FileText,
  Filter,
  Layers,
  MoreHorizontal,
  Plus,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sectorNames } from "@/lib/plan-questions";

interface DashboardStats {
  totalProjects: number;
  totalLeads: number;
  totalValue: number;
  recentProjects: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    sector: string;
  }[];
  leadsByStatus: {
    status: string;
    _count: number;
  }[];
}

interface DashboardContentProps {
  statsPromise: Promise<DashboardStats>;
  projectsPromise: Promise<any[]>;
  sprintsPromise: Promise<any[]>;
  revenueDataPromise: Promise<any[]>;
  salesFunnelDataPromise: Promise<any[]>;
}

export function DashboardContent({
  statsPromise,
  projectsPromise,
  sprintsPromise,
  revenueDataPromise,
  salesFunnelDataPromise,
}: DashboardContentProps) {
  const stats = use(statsPromise);
  const projects = use(projectsPromise);
  const sprints = use(sprintsPromise);
  const revenueData = use(revenueDataPromise);
  const salesFunnelData = use(salesFunnelDataPromise);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!stats) {
    return null;
  }

  const recentProjects = stats.recentProjects || [];
  const totalProjects = stats.totalProjects || 0;
  const totalLeads = stats.totalLeads || 0;
  const totalValue = stats.totalValue || 0;
  const leadsByStatus = stats.leadsByStatus || [];

  const wonLeads = leadsByStatus.find((s) => s.status === "WON")?._count || 0;
  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Todos seus projetos
            </CardTitle>
            <Layers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-muted-foreground text-xs">
              {totalProjects === 0
                ? "Você não tem nenhum projeto ainda"
                : "Projetos ativos"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Todos os leads
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-muted-foreground text-xs">
              {totalLeads === 0 ? "Nenhum lead" : "De todos os funis"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor total</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-muted-foreground text-xs">
              {totalValue === 0 ? "-" : "De todos os Leads"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de conversão
            </CardTitle>
            <Filter className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-muted-foreground text-xs">
              {totalLeads === 0 ? "-" : "Conversões"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Projetos recentes</CardTitle>
              <CardDescription>Projetos mais recentes</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="text-muted-foreground mb-2 h-12 w-12" />
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground mt-2">
                  Create your first project to get started
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/project-plans/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar novo projeto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <div className="grid gap-1">
                      <p className="text-sm leading-none font-medium">
                        {project.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Atualizado{" "}
                        {formatDistanceToNow(new Date(project.updatedAt), {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant="outline">
                        {
                          sectorNames[
                            project.sector as keyof typeof sectorNames
                          ]
                        }
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mais</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/project-plans/${project.id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Visualizar projeto</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {recentProjects.length > 0 && (
            <CardFooter className="px-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/project-plans">Ver todos os projetos</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
}
