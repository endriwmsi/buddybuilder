"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { updateColumn } from "@/app/(private)/(admin)/tasks/actions/tasks.action";
import type { Column } from "@/lib/types";
import ColorPicker from "../color-picker";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da coluna é obrigatório")
    .max(50, "Nome da coluna deve ter menos de 50 caracteres"),
  color: z.string(),
});

interface EditColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: Column;
  refreshData: () => Promise<void>;
}

export default function EditColumnDialog({
  open,
  onOpenChange,
  column,
  refreshData,
}: EditColumnDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: column.name,
      color: column.color,
    },
  });

  // Reset form when column changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: column.name,
        color: column.color,
      });
    }
  }, [open, column, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await updateColumn({
        id: column.id,
        name: values.name,
        color: values.color,
      });

      await refreshData();
      onOpenChange(false);
      toast.success("Coluna atualizada com sucesso");
    } catch (error) {
      console.error("Failed to update column:", error);
      toast.error("Falha ao atualizar coluna. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Coluna</DialogTitle>
          <DialogDescription>Atualize os detalhes da coluna.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Coluna</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da coluna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor da Coluna</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
