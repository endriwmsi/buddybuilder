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
import { ptBR } from "date-fns/locale";
import { Lead, LeadSource, LeadStatus } from "@/generated/prisma";
import { deleteLead, updateLead } from "../../actions/lead.action";

const formSchema = z.object({
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  position: z.string().nullable(),
  description: z.string().nullable(),
  value: z.number().nullable(),
  source: z.nativeEnum(LeadSource),
  status: z.nativeEnum(LeadStatus),
  tags: z.string().nullable(),
  lastContact: z.date().nullable(),
  expectedClose: z.date().nullable(),
});

interface LeadDetailsDialogProps {
  open: boolean;
  lead: Lead;
  onOpenChange: (open: boolean) => void;
  refreshData: () => Promise<void>;
}

export default function LeadDetailsDialog({
  open,
  onOpenChange,
  lead,
  refreshData,
}: LeadDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      description: lead.description,
      value: lead.value ? Number(lead.value) : null,
      source: lead.source,
      status: lead.status,
      tags: lead.tags,
      lastContact: lead.lastContact,
      expectedClose: lead.expectedClose,
    },
  });

  // Reset form when lead changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        description: lead.description,
        value: lead.value ? Number(lead.value) : null,
        source: lead.source,
        status: lead.status,
        tags: lead.tags,
        lastContact: lead.lastContact,
        expectedClose: lead.expectedClose,
      });
    }
  }, [open, lead, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formattedValues = {
        id: lead.id,
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        company: values.company || undefined,
        position: values.position || undefined,
        description: values.description || undefined,
        value: values.value || undefined,
        source: values.source,
        status: values.status,
        tags: values.tags || undefined,
        lastContact: values.lastContact?.toISOString() || undefined,
        expectedClose: values.expectedClose?.toISOString() || undefined,
      };
      await updateLead(formattedValues);

      await refreshData();
      setIsEditing(false);
      toast.success("Lead atualizado com sucesso");
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Falha ao atualizar lead. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletelead = async () => {
    try {
      await deleteLead(lead.id);
      await refreshData();
      onOpenChange(false);
      toast.success("Lead excluída com sucesso");
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast.error("Falha ao excluir lead. Por favor, tente novamente.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Lead" : "Detalhes do Lead"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite os detalhes do Lead."
                : "Visualize os detalhes do Lead."}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do Lead" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o email do Lead"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o telefone do Lead"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a empresa do Lead"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o cargo do Lead"
                          {...field}
                          value={field.value || ""}
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
                          placeholder="Digite a descrição do Lead (opcional)"
                          className="min-h-[100px] resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Digite o valor do Lead"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a fonte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadSource).map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedClose"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Fechamento Esperada</FormLabel>
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
                              onSelect={field.onChange}
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
                      Nome
                    </h3>
                    <p className="mt-1">{lead.name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {lead.status}
                  </Badge>
                </div>
                {lead.description && (
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      Descrição
                    </h3>
                    <p className="mt-1 whitespace-pre-line">
                      {lead.description}
                    </p>
                  </div>
                )}
                {lead.expectedClose && (
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      Data de Fechamento Esperada
                    </h3>
                    <p className="mt-1">
                      {new Date(lead.expectedClose).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Criado em
                  </h3>
                  <p className="mt-1">
                    {new Date(lead.createdAt).toLocaleDateString()}
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
        onConfirm={handleDeletelead}
      />
    </>
  );
}
