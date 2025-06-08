"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get total projects (project plans)
  const totalProjects = await db.projectPlan.count({
    where: { userId: session.user.id },
  });

  // Get total leads across all funnels
  const totalLeads = await db.lead.count({
    where: {
      funnel: {
        userId: session.user.id,
      },
    },
  });

  // Get recent projects
  const recentProjects = await db.projectPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      sector: true,
    },
  });

  // Get leads by status
  const leadsByStatus = await db.lead.groupBy({
    by: ["status"],
    where: {
      funnel: {
        userId: session.user.id,
      },
    },
    _count: true,
  });

  // Calculate total value of all leads
  const totalValue = await db.lead.aggregate({
    where: {
      funnel: {
        userId: session.user.id,
      },
    },
    _sum: {
      value: true,
    },
  });

  return {
    totalProjects,
    totalLeads,
    totalValue: totalValue._sum.value || 0,
    recentProjects,
    leadsByStatus,
  };
}
