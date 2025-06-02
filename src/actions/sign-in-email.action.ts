"use server";

import { loginSchema } from "@/components/auth/login-form";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

type loginSchema = z.infer<typeof loginSchema>;

export async function signInEmailAction(data: loginSchema) {
  const email = String(data.email);
  if (!email) return { error: "Insira um e-mail válido" };

  const password = String(data.password);
  if (!password) return { error: "Insira uma senha válida" };

  try {
    const response = await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: data.email,
        password: data.password,
      },
      asResponse: true,
    });

    if (!response.ok) {
      return { error: "E-mail ou senha inválidos." };
    }

    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";
      console.log(errorCode);

      switch (errorCode) {
        case "EMAIL_NOT_VERIFIED":
          redirect("/auth/verify?error=email_not_verified");
        default:
          return { error: error.message };
      }
    }

    return { error: "Erro de servidor Interno." };
  }
}
