"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "@/components/login-form";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

const LoginPage = () => {
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
          >
            <Icons.google className="h-4 w-4" />
            Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
