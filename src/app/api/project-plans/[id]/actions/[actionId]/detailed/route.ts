import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { detailedActionPrompt } from "@/lib/prompts/detailed-action";
import db from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ai } from "@/app/api/ai/route";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; actionId: string }> }
) {
  const { id, actionId } = await context.params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectPlan = await db.projectPlan.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        actions: {
          where: {
            id: actionId,
          },
        },
      },
    });

    if (!projectPlan) {
      return new NextResponse("Project plan not found", { status: 404 });
    }

    const action = projectPlan.actions[0];

    // Generate detailed description using AI
    const completion = await ai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: detailedActionPrompt.system,
        },
        {
          role: "user",
          content: detailedActionPrompt.user({
            actionTitle: action.title,
            actionDescription: action.description,
            sector: projectPlan.sector,
            sectorDetails: projectPlan.sectorDetails?.toString() || null,
            marketingMaturity: projectPlan.marketingMaturity,
            commercialMaturity: projectPlan.commercialMaturity,
          }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Failed to generate detailed description");
    }

    const parsedResponse = JSON.parse(response);
    if (!parsedResponse.detailedDescription) {
      throw new Error("Invalid response format");
    }

    // Create the detailed action
    await db.detailedAction.create({
      data: {
        title: "Detalhamento da Ação",
        description: JSON.stringify(parsedResponse.detailedDescription),
        order: 1,
        planActionId: action.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROJECT_PLAN_DETAILED_ACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
