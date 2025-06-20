import { DashboardContent } from "./components/dashboard-content";
import { getDashboardStats } from "./actions/dashboard.action";

export default async function DashboardPage() {
  const statsPromise = getDashboardStats();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está uma visão geral dos seus projetos de
          marketing e vendas.
        </p>
      </div>

      <DashboardContent
        statsPromise={statsPromise}
        projectsPromise={Promise.resolve([])}
        sprintsPromise={Promise.resolve([])}
        revenueDataPromise={Promise.resolve([])}
        salesFunnelDataPromise={Promise.resolve([])}
      />
    </div>
  );
}
