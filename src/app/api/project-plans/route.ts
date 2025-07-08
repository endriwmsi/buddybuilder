import { NextResponse } from "next/server";
import { BusinessSector, ActionPriority } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ai } from "@/lib/ai";
import { businessPlanPrompt } from "@/lib/prompts/business-plan";
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
      digitalPresence,
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
    const completion = await ai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: businessPlanPrompt.system,
        },
        {
          role: "user",
          content: businessPlanPrompt.user({
            title,
            description,
            sector,
            sectorDetails,
            marketingMaturity,
            marketingGoal,
            commercialMaturity,
            commercialGoal,
            maxActions,
          }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Failed to generate plan actions");
    }

    const parsedResponse = JSON.parse(response);
    if (!parsedResponse.actions || !Array.isArray(parsedResponse.actions)) {
      throw new Error("Invalid response format: missing actions array");
    }

    const limitedActions = parsedResponse.actions.slice(0, maxActions);
    const initialActions = limitedActions.map((action: any, index: number) => ({
      ...action,
      order: index + 1,
      priority: action.priority || "MEDIUM",
    }));

    // Create the plan actions
    await Promise.all(
      initialActions.map(
        (action: {
          title: string;
          description: string;
          priority: string;
          order: number;
        }) =>
          db.planAction.create({
            data: {
              title: action.title,
              description: action.description,
              priority: action.priority as ActionPriority,
              order: action.order,
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
