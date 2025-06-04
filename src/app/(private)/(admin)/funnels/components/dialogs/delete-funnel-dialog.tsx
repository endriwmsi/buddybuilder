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
import { deleteFunnel } from "../../actions/funnel.action";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeleteFunnelDialogProps {
  funnelId: string;
  funnelName: string;
}

export default function DeleteFunnelDialog({
  funnelId,
  funnelName,
}: DeleteFunnelDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteFunnel(funnelId);
        toast.success("Funil excluído com sucesso!");
        setOpen(false);
      } catch (error) {
        toast.error("Erro ao excluir funil!");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Funil</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o funil "{funnelName}"? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
