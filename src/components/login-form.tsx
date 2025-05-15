"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Você deve inserir um e-mail válido."),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formData = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      await signIn.email(
        {
          ...formData.getValues(),
        },
        {
          onRequest: () => {},
          onResponse: () => {},
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {},
        }
      );
    } catch (error) {
      toast.error("Erro ao fazer Login");
    } finally {
      setIsLoading(false);
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
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder="nome@exemplo.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
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
                  <Label className="sr-only" htmlFor="email">
                    Senha
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      placeholder="********"
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <span>loading</span>}
              Entrar com e-mail
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
