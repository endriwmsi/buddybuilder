import { z } from "zod";

export const createFunnelColumnSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório!" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres!" }),
  color: z.string({ required_error: "A cor é obrigatória!" }),
});

export type CreateFunnelColumnFormData = z.infer<
  typeof createFunnelColumnSchema
>;

export const updateFunnelColumnSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório!" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres!" }),
  color: z.string({ required_error: "A cor é obrigatória!" }),
});

export type UpdateFunnelColumnFormData = z.infer<
  typeof updateFunnelColumnSchema
>;

export const updateFunnelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório!" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres!" }),
  description: z
    .string()
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres!" })
    .optional(),
});

export type UpdateFunnelFormData = z.infer<typeof updateFunnelSchema>;

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório!" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres!" }),
  email: z
    .string()
    .email({ message: "E-mail inválido!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  value: z
    .number()
    .min(1, { message: "O valor é obrigatório e deve ser maior que zero!" }),
  source: z
    .enum(
      [
        "WEBSITE",
        "REFERRAL",
        "COLD_CALL",
        "EMAIL_CAMPAIGN",
        "SOCIAL_MEDIA",
        "EVENT",
        "OTHER",
      ],
      { required_error: "A origem é obrigatória!" }
    )
    .default("OTHER"),
  status: z
    .enum(
      [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "PROPOSAL",
        "NEGOTIATION",
        "WON",
        "LOST",
      ],
      { required_error: "O status é obrigatório!" }
    )
    .default("NEW"),
  description: z.string().optional(),
  tags: z.string().optional(),
  expectedClose: z.string().optional(),
  funnelColumnId: z.string({
    required_error: "A coluna do funil é obrigatória!",
  }),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório!" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres!" }),
  email: z
    .string()
    .email({ message: "E-mail inválido!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  value: z
    .number()
    .positive({ message: "O valor deve ser maior que zero!" })
    .optional(),
  source: z.enum(
    [
      "WEBSITE",
      "REFERRAL",
      "COLD_CALL",
      "EMAIL_CAMPAIGN",
      "SOCIAL_MEDIA",
      "EVENT",
      "OTHER",
    ],
    { required_error: "A origem é obrigatória!" }
  ),
  status: z.enum(
    ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"],
    { required_error: "O status é obrigatório!" }
  ),
  description: z.string().optional(),
  tags: z.string().optional(),
  expectedClose: z.string().nullable().optional(),
});

export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
