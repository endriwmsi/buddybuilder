"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import DeleteConfirmDialog from "../delete-confirm-dialog";
import { Lead } from "@/generated/prisma";
import { deleteLead } from "../../../actions/lead.action";
import UpdateLeadDialog from "./update-lead-dialog";
import { statusTranslations } from "@/lib/constants";

interface LeadDetailsDialogProps {
  open: boolean;
  lead: Lead;
  onOpenChange: (open: boolean) => void;
  refreshData: () => Promise<void>;
}

export default function LeadDetailsDialog({
  lead,
  open,
  onOpenChange,
  refreshData,
}: LeadDetailsDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Visualize os detalhes do Lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  Nome
                </h3>
                <p className="mt-1">{lead.name}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {statusTranslations[lead.status] || lead.status}
              </Badge>
            </div>
            {lead.description && (
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  Descrição
                </h3>
                <p className="mt-1 whitespace-pre-line">{lead.description}</p>
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
            <Button onClick={() => setIsUpdateDialogOpen(true)}>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateLeadDialog
        lead={lead}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        refreshData={refreshData}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Lead"
        description="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
        onConfirm={handleDeletelead}
      />
    </>
  );
}
