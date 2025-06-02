"use client";

import RegisterForm from "@/components/auth/register-form";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const RegisterPage = () => {
  const [isPending, setIsPending] = useState(false);

  const handleLoginWithGoogle = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-muted-foreground text-sm">
            Insira seu e-mail abaixo para criar sua conta ou
            <br />
            <Link
              href="/auth/login"
              className="hover:text-primary underline underline-offset-4"
            >
              Faça login
            </Link>{" "}
          </p>
        </div>

        <div className="grid gap-6">
          <RegisterForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Ou continuar com
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                Google
              </span>
            ) : (
              "Google"
            )}
          </Button>
        </div>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Clicando em continuar, você concorda com nossos{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Termos de serviço
          </Link>{" "}
          e{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Politica de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
