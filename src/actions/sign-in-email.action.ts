"use server";

import { loginSchema } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { parseSetCookieHeader } from "better-auth/cookies";
import { cookies, headers } from "next/headers";
import { z } from "zod";

type loginSchema = z.infer<typeof loginSchema>;

export async function signInEmailAction(data: loginSchema) {
  const email = String(data.email);
  if (!email) return { error: "Insira um e-mail válido" };
  const password = String(data.password);
  if (!password) return { error: "Insira uma senha válida" };

  try {
    const res = await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: data.email,
        password: data.password,
      },
      asResponse: true,
    });

    //
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookie = parseSetCookieHeader(setCookieHeader);
      const cookieStore = await cookies();

      const [key, cookieAttributes] = [...cookie.entries()][0];
      const value = cookieAttributes.value;
      const maxAge = cookieAttributes["max-age"];
      const path = cookieAttributes.path;
      const httpOnly = cookieAttributes.httponly;
      const sameSite = cookieAttributes.samesite;

      cookieStore.set(key, decodeURIComponent(value), {
        maxAge,
        path,
        httpOnly,
        sameSite,
      });
    }
    //

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Oops! E-mail ou senha inválidos" };
    }

    return { error: "Erro de servidor Interno." };
  }

  return { error: null };
}
