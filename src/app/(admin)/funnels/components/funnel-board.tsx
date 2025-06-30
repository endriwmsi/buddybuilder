"use client";

import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, List, Kanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunnelColumn, Lead } from "@/generated/prisma";
import {
  getFunnelColumns,
  reorderFunnelColumn,
} from "../actions/funnel-column.action";
import { getLeads, moveLead } from "../actions/lead.action";
import { getFunnelById } from "../actions/funnel.action";
import CreateFunnelColumnDialog from "./dialogs/create-funnel-column-dialog";
import FunnelColumns from "./funnel-column";
import LeadsTable from "./leads-table";
import { Icons } from "@/components/icons";

interface FunnelBoardProps {
  funnelId: string;
}

const FunnelBoard = ({ funnelId }: FunnelBoardProps) => {
  // State management
  const [funnel, setFunnel] = useState<any>(null);
  const [funnelColumns, setFunnelColumns] = useState<FunnelColumn[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateFunnelColumnOpen, setIsCreateFunnelColumnOpen] =
    useState(false);

  // View mode with localStorage persistence
  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("funnel-view-mode");
      return (savedViewMode as "kanban" | "list") || "kanban";
    }
    return "kanban";
  });

  // Persist view mode changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("funnel-view-mode", viewMode);
    }
  }, [viewMode]);

  // Load funnel data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [funnelData, funnelColumnsData, leadsData] = await Promise.all([
        getFunnelById(funnelId),
        getFunnelColumns(funnelId),
        getLeads(funnelId),
      ]);

      setFunnel(funnelData);
      setFunnelColumns(funnelColumnsData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to load funnel data:", error);
      toast.error(
        "Falha ao carregar dados do funil. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [funnelId]);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [funnelColumnsData, leadsData] = await Promise.all([
        getFunnelColumns(funnelId),
        getLeads(funnelId),
      ]);

      setFunnelColumns(funnelColumnsData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to refresh funnel data:", error);
      toast.error(
        "Falha ao atualizar dados do funil. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [funnelId]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Drag and drop handlers
  const handleColumnReorder = useCallback(
    async (
      draggableId: string,
      sourceIndex: number,
      destinationIndex: number
    ) => {
      const newFunnelColumns = [...funnelColumns];
      const movedFunnelColumn = newFunnelColumns.find(
        (col) => col.id === draggableId
      );

      if (!movedFunnelColumn) return;

      newFunnelColumns.splice(sourceIndex, 1);
      newFunnelColumns.splice(destinationIndex, 0, movedFunnelColumn);

      const updatedFunnelColumns = newFunnelColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setFunnelColumns(updatedFunnelColumns);

      try {
        await reorderFunnelColumn(draggableId, destinationIndex);
      } catch (error) {
        toast.error("Falha ao reordenar colunas. Por favor, tente novamente.");
        setFunnelColumns(funnelColumns);
      }
    },
    [funnelColumns]
  );

  const handleLeadMove = useCallback(
    async (
      draggableId: string,
      source: { droppableId: string; index: number },
      destination: { droppableId: string; index: number }
    ) => {
      const sourceFunnelColumn = funnelColumns.find(
        (col) => col.id === source.droppableId
      );
      const destinationFunnelColumn = funnelColumns.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceFunnelColumn || !destinationFunnelColumn) return;

      const newLeads = [...leads];
      const leadIndex = newLeads.findIndex((lead) => lead.id === draggableId);

      if (leadIndex === -1) return;

      if (source.droppableId === destination.droppableId) {
        // Same column reorder
        newLeads[leadIndex] = {
          ...newLeads[leadIndex],
          order: destination.index,
        };
      } else {
        // Move between columns
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
        const errorMessage =
          source.droppableId === destination.droppableId
            ? "Falha ao reordenar leads. Por favor, tente novamente."
            : "Falha ao mover lead. Por favor, tente novamente.";
        toast.error(errorMessage);
        setLeads(leads);
      }
    },
    [funnelColumns, leads]
  );

  const handleDragEnd = useCallback(
    async (result: any) => {
      const { destination, source, draggableId, type } = result;

      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      if (type === "column") {
        await handleColumnReorder(draggableId, source.index, destination.index);
        return;
      }

      await handleLeadMove(draggableId, source, destination);
    },
    [handleColumnReorder, handleLeadMove]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icons.spinner className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Carregando dados do funil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{funnel?.name}</h1>
          <p className="text-muted-foreground text-sm">{funnel?.description}</p>
        </div>
        <div className="flex items-center gap-4">
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
      </div>

      {/* Content */}
      <div className="max-w-[1535px]">
        {viewMode === "kanban" ? (
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
        ) : (
          <LeadsTable
            leads={leads}
            funnelColumns={funnelColumns}
            refreshData={refreshData}
          />
        )}
      </div>

      {/* Dialog */}
      <CreateFunnelColumnDialog
        open={isCreateFunnelColumnOpen}
        onOpenChange={setIsCreateFunnelColumnOpen}
        funnelId={funnelId}
        refreshData={refreshData}
      />
    </div>
  );
};

export default FunnelBoard;
