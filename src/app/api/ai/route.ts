import { generatePlanActions } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      sector,
      sectorDetails,
      marketingMaturity,
      marketingGoal,
      commercialMaturity,
      commercialGoal,
      maxActions,
    } = body;

    const actions = await generatePlanActions(
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
    return NextResponse.json({ actions });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
