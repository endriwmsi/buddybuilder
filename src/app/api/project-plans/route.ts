import { NextResponse } from "next/server";
import { BusinessSector } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generatePlanActions } from "@/lib/openai";
import db from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      sector,
      sectorDetails,
      marketingMaturity,
      commercialMaturity,
      marketingGoal,
      commercialGoal,
      userId,
    } = body;

    if (!title || !sector || !marketingMaturity || !commercialMaturity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the project plan
    const projectPlan = await db.projectPlan.create({
      data: {
        title,
        description,
        sector: sector as BusinessSector,
        sectorDetails,
        marketingMaturity,
        commercialMaturity,
        marketingGoal,
        commercialGoal,
        userId,
      },
    });

    // Verificação de limite de ações (apenas para usuários não-admin)
    let maxActions = Infinity;

    if (session.user.role === "ADMIN") {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { plan: { select: { maxActions: true } } },
      });
      maxActions = user?.plan?.maxActions ?? Infinity;
    }

    // Generate initial plan actions using AI
    const initialActions = await generatePlanActions(
      title,
      description,
      sector,
      sectorDetails,
      marketingMaturity,
      marketingGoal,
      commercialMaturity,
      commercialGoal,
      maxActions
    );

    // Create the plan actions
    await Promise.all(
      initialActions.map((action) =>
        db.planAction.create({
          data: {
            ...action,
            projectPlanId: projectPlan.id,
          },
        })
      )
    );

    return NextResponse.json(projectPlan);
  } catch (error) {
    console.error("[PROJECT_PLANS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
