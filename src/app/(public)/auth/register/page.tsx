"use client";

import RegisterForm from "@/app/(public)/auth/components/register-form";
import Link from "next/link";

const RegisterPage = () => {
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
        </div>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Continuando, você concorda com nossos{" "}
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
