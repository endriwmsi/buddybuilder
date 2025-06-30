"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteColumn } from "../actions/funnel-column.action";
import DeleteConfirmDialog from "../../tasks/components/dialogs/delete-confirm-dialog";
import { FunnelColumn, Lead } from "@/generated/prisma";
import LeadItem from "./lead-item";
import EditFunnelColumnDialog from "./dialogs/edit-funnel-column-dialog";
import CreateLeadDialog from "./dialogs/leads/create-lead-dialog";

interface FunnelColumnsProps {
  funnelColumn: FunnelColumn;
  leads: Lead[];
  index: number;
  refreshData: () => Promise<void>;
}

export default function FunnelColumns({
  funnelColumn,
  leads,
  index,
  refreshData,
}: FunnelColumnsProps) {
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isEditFunnelColumnOpen, setIsEditFunnelColumnOpen] = useState(false);
  const [isDeleteFunnelColumnOpen, setIsDeleteFunnelColumnOpen] =
    useState(false);

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn(funnelColumn.id);
      await refreshData();
      toast.success("Coluna excluída com sucesso");
    } catch (error) {
      console.error("Falha ao excluir coluna:", error);
      toast.error("Falha ao excluir coluna. Por favor, tente novamente.");
    }
  };

  return (
    <Draggable draggableId={funnelColumn.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-80 flex-shrink-0"
        >
          <Card
            className="flex h-max flex-col rounded-sm border-t-4"
            style={{ borderTop: `4px solid ${funnelColumn.color}` }}
            {...provided.dragHandleProps}
          >
            <CardHeader className="border-b px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{funnelColumn.name}</CardTitle>
                  <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-1 text-xs">
                    {leads.length}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsEditFunnelColumnOpen(true)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteFunnelColumnOpen(true)}
                      className="text-destructive"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="-mt-6 p-0">
              <Droppable droppableId={funnelColumn.id} type="task">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto p-2 ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                    style={{ minHeight: "200px" }}
                  >
                    {leads.map((lead, index) => (
                      <LeadItem
                        key={lead.id}
                        lead={lead}
                        index={index}
                        columnName={funnelColumn.name}
                        refreshData={refreshData}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>

            <CardFooter className="-mt-8 border-t px-2">
              <Button
                variant="ghost"
                className="text-muted-foreground w-full justify-start"
                onClick={() => setIsCreateLeadOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Lead
              </Button>
            </CardFooter>
          </Card>

          <CreateLeadDialog
            open={isCreateLeadOpen}
            onOpenChange={setIsCreateLeadOpen}
            funnelId={funnelColumn.funnelId}
            funnelColumnId={funnelColumn.id}
            refreshData={refreshData}
          />

          <EditFunnelColumnDialog
            open={isEditFunnelColumnOpen}
            onOpenChange={setIsEditFunnelColumnOpen}
            funnelColumn={funnelColumn}
            refreshData={refreshData}
          />

          <DeleteConfirmDialog
            open={isDeleteFunnelColumnOpen}
            onOpenChange={setIsDeleteFunnelColumnOpen}
            title="Excluir Coluna"
            description="Tem certeza que deseja excluir esta coluna? Todos os Leads nesta coluna também serão excluídos. Esta ação não pode ser desfeita."
            onConfirm={handleDeleteColumn}
          />
        </div>
      )}
    </Draggable>
  );
}
