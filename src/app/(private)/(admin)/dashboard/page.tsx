import { getDashboardStats } from "./actions/dashboard.action";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { User } from "@/generated/prisma";
import db from "@/lib/prisma";
import UserDashboardContent from "./components/user-dashboard-content";
import AdminDashboardContent from "./components/admin-dashboard-content";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const statsPromise = getDashboardStats();

  // Se admin, buscar todos os usuários
  let allUsers: User[] = [];

  if (session?.user.role === "ADMIN") {
    allUsers = await db.user.findMany({
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está uma visão geral dos seus projetos de
          marketing e vendas.
        </p>
      </div>

      {session?.user.role === "ADMIN" ? (
        <AdminDashboardContent users={allUsers} />
      ) : (
        <UserDashboardContent
          statsPromise={statsPromise}
          projectsPromise={Promise.resolve([])}
          sprintsPromise={Promise.resolve([])}
          revenueDataPromise={Promise.resolve([])}
          salesFunnelDataPromise={Promise.resolve([])}
        />
      )}
    </div>
  );
};

export default DashboardPage;
