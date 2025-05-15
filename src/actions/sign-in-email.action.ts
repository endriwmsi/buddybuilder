"use server";

import { loginSchema } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { z } from "zod";

type loginSchema = z.infer<typeof loginSchema>;

export async function signInEmailAction(data: loginSchema) {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Oops! E-mail ou senha inválidos" };
    }

    return { error: "Erro de servidor Interno." };
  }

  return { error: null };
}
