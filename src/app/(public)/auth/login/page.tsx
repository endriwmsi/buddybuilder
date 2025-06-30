"use client";

import Link from "next/link";
import { useState } from "react";
import LoginForm from "@/app/(public)/auth/components/login-form";

const LoginPage = () => {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-muted-foreground text-sm">
            Insira seu e-mail e senha para continuar ou
            <br />
            <Link
              href="/auth/register"
              className="hover:text-primary underline underline-offset-4"
            >
              Crie sua conta
            </Link>{" "}
          </p>
        </div>

        <div className="grid gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
