import * as z from "zod";
import { BusinessSector } from "@/generated/prisma";

export const projectPlanFormSchema = z.object({
  title: z.string().min(10, "O Título é obrigatório."),
  description: z.string().min(10, "A descrição é obrigatória."),
  sector: z.nativeEnum(BusinessSector),
  sectorDetails: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string())])
  ),
  marketingMaturity: z
    .string()
    .min(1, "O nível de maturidade de Marketing é obrigatório."),
  commercialMaturity: z
    .string()
    .min(1, "O nível de maturidade Comercial é obrigatório."),
  marketingGoal: z.string().min(1, "O objetivo de Marketing é obrigatório."),
  commercialGoal: z.string().min(1, "O objetivo Comercial é obrigatório."),
});

export type ProjectPlanFormData = z.infer<typeof projectPlanFormSchema>;
