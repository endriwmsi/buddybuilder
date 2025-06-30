import SendVerificationEmailForm from "@/app/(public)/auth/components/send-verification-email-form";
import { Icons } from "@/components/icons";

import { redirect } from "next/navigation";

interface VerifyPageProps {
  searchParams: Promise<{ error: string }>;
}

const VerifyPage = async ({ searchParams }: VerifyPageProps) => {
  const error = (await searchParams).error;

  if (!error) redirect("/dashboard");

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icons.logo className="h-10 w-10" />
        <p className="text-destructive">
          {error === "invalid_token" || error === "expired_token"
            ? "O seu link de verificação é inválido ou expirou. Solicite um novo link de verificação."
            : error === "email_not_verified"
              ? "Por favor, verifique seu e-mail ou solicite um novo link de verificação abaixo."
              : "Por favor, tente novamente mais tarde."}
        </p>

        <SendVerificationEmailForm />
      </div>
    </div>
  );
};

export default VerifyPage;
