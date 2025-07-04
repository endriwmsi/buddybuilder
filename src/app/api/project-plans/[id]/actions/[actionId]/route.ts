import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
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

    const body = await req.json();
    const { isSelected } = body;

    const projectPlan = await db.projectPlan.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!projectPlan) {
      return new NextResponse("Project plan not found", { status: 404 });
    }

    const action = await db.planAction.update({
      where: {
        id: actionId,
        projectPlanId: id,
      },
      data: {
        isSelected,
      },
    });

    return NextResponse.json(action);
  } catch (error) {
    console.error("[PROJECT_PLAN_ACTION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
