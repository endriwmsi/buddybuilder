"use client";

import { signUpEmailAction } from "@/actions/sign-up-email.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "../../../../components/ui/password-input";
import { Icons } from "../../../../components/icons";
import { signIn } from "@/lib/auth-client";

export const registerSchema = z.object({
  email: z.string().email().min(2, {
    message: "Você deve fornecer um e-mail válido.",
  }),
  name: z.string().min(2, {
    message: "O Nome deve ter pelo menos 6 caracteres.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
});

const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const formData = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsPending(true);

    const { error } = await signUpEmailAction(values);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success(
        "Usuário cadastrado com sucesso. Por favor, verifique seu e-mail para continuar."
      );
      router.push("/auth/register/success");
    }
  };

  return (
    <>
      <Form {...formData}>
        <form onSubmit={formData.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={formData.control}
              name="email"
              render={({ field }) => (
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder="nome@exemplo.com"
                      type="email"
                      autoComplete="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={formData.control}
              name="name"
              render={({ field }) => (
                <div className="grid gap-1">
                  <Label htmlFor="email">Nome</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="João da Silva"
                      type="text"
                      autoComplete="name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={formData.control}
              name="password"
              render={({ field }) => (
                <div className="grid gap-1">
                  <Label htmlFor="email">Senha</Label>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      id="password"
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  Entrando
                </span>
              ) : (
                "Entrar com e-mail"
              )}
            </Button>
          </div>
        </form>
      </Form>

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
    </>
  );
};

export default RegisterForm;
