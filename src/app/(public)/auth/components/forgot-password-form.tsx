"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgetPassword } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "../../../../components/icons";

export const ForgotPasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Por favor, insira seu e-mail.");

    await forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
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
          toast.success("Link de redefinição enviado para seu e-mail.");
          router.push("/auth/forgot-password/success");
        },
      },
    });
  }

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="nome@exemplo.com"
          autoComplete="email"
          disabled={isPending}
        />
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Enviando link de redefinição
          </span>
        ) : (
          "Enviar link de redefinição"
        )}
      </Button>
    </form>
  );
};
