"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { sendVerificationEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { Icons } from "./icons";

const SendVerificationEmailForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("E-mail é obrigatório");

    await sendVerificationEmail({
      email,
      callbackURL: "/auth/verify",
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
        onSuccess: () => {
          toast.success("E-mail de verificação enviado com sucesso");
          router.push("/auth/verify/success");
        },
      },
    });

    setIsPending(false);
  };

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input type="email" name="email" id="email" />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Enviando e-mail de verificação
          </span>
        ) : (
          "Enviar e-mail de verificação"
        )}
      </Button>
    </form>
  );
};

export default SendVerificationEmailForm;
