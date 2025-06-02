import { z } from "zod";

export const createFunnelColumnSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string(),
});

export const updateFunnelColumnSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  color: z.string(),
});

export const createLeadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  value: z.number().positive().optional(),
  source: z
    .enum([
      "WEBSITE",
      "REFERRAL",
      "COLD_CALL",
      "EMAIL_CAMPAIGN",
      "SOCIAL_MEDIA",
      "EVENT",
      "OTHER",
    ])
    .default("OTHER"),
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "PROPOSAL",
      "NEGOTIATION",
      "WON",
      "LOST",
    ])
    .default("NEW"),
  description: z.string().optional(),
  tags: z.string().optional(),
  expectedClose: z.string().optional(),
  funnelId: z.string(),
  funnelColumnId: z.string(),
});

export const updateLeadSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  value: z.number().positive().optional(),
  source: z.enum([
    "WEBSITE",
    "REFERRAL",
    "COLD_CALL",
    "EMAIL_CAMPAIGN",
    "SOCIAL_MEDIA",
    "EVENT",
    "OTHER",
  ]),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL",
    "NEGOTIATION",
    "WON",
    "LOST",
  ]),
  description: z.string().optional(),
  tags: z.string().optional(),
  expectedClose: z.string().nullable().optional(),
});
