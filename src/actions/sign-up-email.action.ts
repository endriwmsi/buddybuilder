"use server";

import { registerSchema } from "@/components/register-form";
import { auth } from "@/lib/auth";
import { z } from "zod";

type registerSchema = z.infer<typeof registerSchema>;

export async function signUpEmailAction(data: registerSchema) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Oops! Ocorreu um erro ao cadastrar o usuário" };
    }

    return { error: "Erro de servidor Interno." };
  }

  return { error: null };
}
