"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { updateTask, deleteTask } from "@/actions/kanban-actions";
import { PRIORITY_CONFIG } from "@/lib/types";
import type { Task } from "@/lib/types";
import { TaskPriority } from "@/generated/prisma";
import { ptBR } from "date-fns/locale";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter menos de 100 caracteres"),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.nativeEnum(TaskPriority),
});

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  refreshData: () => Promise<void>;
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  refreshData,
}: TaskDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      priority: task.priority,
    },
  });

  // Reset form when task changes
  useEffect(() => {
    if (open) {
      form.reset({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        priority: task.priority,
      });
    }
  }, [open, task, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await updateTask({
        id: task.id,
        title: values.title,
        description: values.description || "",
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        priority: values.priority,
      });

      await refreshData();
      setIsEditing(false);
      toast.success("Tarefa atualizada com sucesso");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Falha ao atualizar tarefa. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      await refreshData();
      onOpenChange(false);
      toast.success("Tarefa excluída com sucesso");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Falha ao excluir tarefa. Por favor, tente novamente.");
    }
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Tarefa" : "Detalhes da Tarefa"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite os detalhes da tarefa."
                : "Visualize os detalhes da tarefa."}
            </DialogDescription>
          </DialogHeader>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título da tarefa"
                          {...field}
                        />
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
                          placeholder="Digite a descrição da tarefa (opcional)"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Prioridade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PRIORITY_CONFIG).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Vencimento</FormLabel>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              locale={ptBR}
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={(date) => field.onChange(date)}
                              initialFocus={false}
                            />
                          </PopoverContent>
                        </Popover>
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => field.onChange(null)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      Título
                    </h3>
                    <p className="mt-1">{task.title}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${priorityConfig.color}`}
                  >
                    {priorityConfig.label}
                  </Badge>
                </div>
                {task.description && (
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      Descrição
                    </h3>
                    <p className="mt-1 whitespace-pre-line">
                      {task.description}
                    </p>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      Data de Vencimento
                    </h3>
                    <p className="mt-1">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Criado em
                  </h3>
                  <p className="mt-1">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="rounded-full"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Fechar
                </Button>
                <Button onClick={() => setIsEditing(true)}>Editar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Tarefa"
        description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteTask}
      />
    </>
  );
}
