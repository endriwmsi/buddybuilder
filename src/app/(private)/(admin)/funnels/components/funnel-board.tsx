"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, List, Kanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/dashboard/components/auth-context";
import { FunnelColumn, Lead } from "@/generated/prisma";
import {
  getFunnelColumns,
  reorderFunnelColumn,
} from "../actions/funnel-column.action";
import { getLeads, moveLead } from "../actions/lead.action";
import CreateFunnelColumnDialog from "./dialogs/create-funnel-column-dialog";
import FunnelColumns from "./funnel-column";
import LeadsTable from "./leads-table";

interface FunnelBoardProps {
  funnelId: string;
}

export default function FunnelBoard({ funnelId }: FunnelBoardProps) {
  const { user } = useAuth();
  const [funnelColumns, setFunnelColumns] = useState<FunnelColumn[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFunnelColumnOpen, setIsCreateFunnelColumnOpen] =
    useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("tasks-view-mode");
      return (savedViewMode as "kanban" | "list") || "kanban";
    }
    return "kanban";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks-view-mode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    const loadKanbanData = async () => {
      try {
        setIsLoading(true);
        const funnelColumnsData = await getFunnelColumns(funnelId);
        const leadsData = await getLeads(funnelId);

        setFunnelColumns(funnelColumnsData);
        setLeads(leadsData);
      } catch (error) {
        console.error("Failed to load kanban data:", error);
        toast.error(
          "Falha ao carregar dados do kanban. Por favor, tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadKanbanData();
  }, [funnelId]);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "column") {
      const newFunnelColumns = [...funnelColumns];
      const movedFunnelColumn = newFunnelColumns.find(
        (col) => col.id === draggableId
      );

      if (!movedFunnelColumn) return;

      newFunnelColumns.splice(source.index, 1);
      newFunnelColumns.splice(destination.index, 0, movedFunnelColumn);

      const updatedFunnelColumns = newFunnelColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setFunnelColumns(updatedFunnelColumns);

      try {
        await reorderFunnelColumn(draggableId, destination.index);
      } catch (error) {
        toast.error("Falha ao reordenar colunas. Por favor, tente novamente.");
        setFunnelColumns(funnelColumns);
      }

      return;
    }

    const sourceFunnelColumn = funnelColumns.find(
      (col) => col.id === source.droppableId
    );
    const destinationFunnelColumn = funnelColumns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceFunnelColumn || !destinationFunnelColumn) return;

    if (source.droppableId === destination.droppableId) {
      const funnelColumnLeads = leads.filter(
        (lead) => lead.funnelColumnId === sourceFunnelColumn.id
      );
      const movedLead = funnelColumnLeads.find(
        (lead) => lead.id === draggableId
      );

      if (!movedLead) return;

      const newLeads = [...leads];
      const leadIndex = newLeads.findIndex((lead) => lead.id === draggableId);

      if (leadIndex !== -1) {
        newLeads[leadIndex] = {
          ...newLeads[leadIndex],
          order: destination.index,
        };
      }

      setLeads(newLeads);

      try {
        await moveLead(draggableId, destination.droppableId, destination.index);
      } catch (error) {
        toast.error("Falha ao reordenar tarefas. Por favor, tente novamente.");
        setLeads(leads);
      }
    } else {
      const newLeads = [...leads];
      const leadIndex = newLeads.findIndex((lead) => lead.id === draggableId);

      if (leadIndex !== -1) {
        newLeads[leadIndex] = {
          ...newLeads[leadIndex],
          funnelColumnId: destination.droppableId,
          order: destination.index,
        };
      }

      setLeads(newLeads);

      try {
        await moveLead(draggableId, destination.droppableId, destination.index);
      } catch (error) {
        toast.error("Falha ao mover lead. Por favor, tente novamente.");
        setLeads(leads);
      }
    }
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const funnelColumnsData = await getFunnelColumns(funnelId);
      const leadsData = await getLeads(funnelId);

      setFunnelColumns(funnelColumnsData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to refresh kanban data:", error);
      toast.error(
        "Falha ao atualizar dados do kanban. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-4">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "kanban" | "list")}
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="kanban">
              <Kanban className="mr-2 h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setIsCreateFunnelColumnOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Coluna
        </Button>
      </div>

      <div className="max-w-[1560px]">
        {viewMode === "kanban" ? (
          <div className="">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4 overflow-x-auto pb-4"
                  >
                    {funnelColumns
                      .sort((a, b) => a.order - b.order)
                      .map((funnelColumn, index) => (
                        <FunnelColumns
                          key={funnelColumn.id}
                          funnelColumn={funnelColumn}
                          leads={leads
                            .filter(
                              (lead) => lead.funnelColumnId === funnelColumn.id
                            )
                            .sort((a, b) => a.order - b.order)}
                          index={index}
                          refreshData={refreshData}
                        />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <LeadsTable
            leads={leads}
            funnelColumns={funnelColumns}
            refreshData={refreshData}
          />
        )}
      </div>

      <CreateFunnelColumnDialog
        open={isCreateFunnelColumnOpen}
        onOpenChange={setIsCreateFunnelColumnOpen}
        funnelId={funnelId}
        refreshData={refreshData}
      />
    </div>
  );
}
