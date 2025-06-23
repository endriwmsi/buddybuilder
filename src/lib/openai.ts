import OpenAI from "openai";
import { businessPlanPrompt } from "./prompts/business-plan";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PlanAction {
  title: string;
  description: string;
  order: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export async function generatePlanActions(
  title: string,
  description: string | null,
  sector: string,
  sectorDetails: string | null,
  marketingMaturity: string,
  marketingGoal: string,
  commercialMaturity: string,
  commercialGoal: string,
  maxActions: number = Infinity
): Promise<PlanAction[]> {
  const completion = await openai.chat.completions.create({
    model: "o4-mini",
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

  try {
    const parsedResponse = JSON.parse(response);

    if (!parsedResponse.actions || !Array.isArray(parsedResponse.actions)) {
      throw new Error("Invalid response format: missing actions array");
    }

    const limitedActions = parsedResponse.actions.slice(0, maxActions);

    return limitedActions.map((action: PlanAction, index: number) => ({
      ...action,
      order: index + 1,
      priority: action.priority || "MEDIUM",
    }));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error("Raw response:", response);
    throw new Error("Failed to parse AI response");
  }
}
