"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateFunnelSchema,
  type UpdateFunnelFormData,
} from "../../actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateFunnel } from "../../actions/funnel.action";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface UpdateFunnelDialogProps {
  funnel: {
    id: string;
    name: string;
    description: string | null;
  };
}

export default function UpdateFunnelDialog({
  funnel,
}: UpdateFunnelDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateFunnelFormData>({
    resolver: zodResolver(updateFunnelSchema),
    defaultValues: {
      name: funnel.name,
      description: funnel.description || "",
    },
  });

  const onSubmit = (data: UpdateFunnelFormData) => {
    startTransition(async () => {
      try {
        await updateFunnel({
          id: funnel.id,
          ...data,
        });
        toast.success("Funil atualizado com sucesso!");
        setOpen(false);
      } catch (error) {
        toast.error("Erro ao atualizar funil!");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Funil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu funil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do funil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do funil"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
