"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";

export async function generateDetailedActions(
  projectPlanId: string,
  actionIds: string[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Checagem de limite de detalhamentos do plano do usuário
  const userId = session.user.id;
  // Conta o total de detalhamentos do usuário em todos os projetos
  const [
    {
      _count: { id: detailsCount },
    },
    user,
  ] = await db.$transaction([
    db.detailedAction.aggregate({
      _count: { id: true },
      where: {
        planAction: {
          projectPlan: {
            userId,
          },
        },
      },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { plan: { select: { maxDetails: true } } },
    }),
  ]);
  const maxDetails = user?.plan?.maxDetails ?? Infinity;
  if (detailsCount + actionIds.length > maxDetails) {
    return {
      success: false,
      error: "Limite de detalhamentos atingido para seu plano.",
    };
  }

  try {
    const results = await Promise.all(
      actionIds.map(async (actionId) =>
        fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/project-plans/${projectPlanId}/actions/${actionId}/detailed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: (await headers()).get("cookie") || "",
            },
          }
        ).then(async (response) => {
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to generate detailed action");
          }
          return response.json();
        })
      )
    );

    const hasErrors = results.some((result) => !result.success);
    if (hasErrors) {
      throw new Error("Some detailed actions failed to generate");
    }

    revalidatePath(`/project-plans/${projectPlanId}`);
    return { success: true };
  } catch (error) {
    console.error("Error generating detailed actions:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate detailed actions",
    };
  }
}
