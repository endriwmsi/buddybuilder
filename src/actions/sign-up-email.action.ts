"use server";

import { registerSchema } from "@/app/(public)/auth/components/register-form";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
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
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";

      switch (errorCode) {
        case "USER_ALREADY_EXISTS":
          return { error: "Oops! E-mail já cadastrado" };
        default:
          return { error: error.message };
      }
    }

    return { error: "Erro de servidor Interno." };
  }

  return { error: null };
}
