"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, List, Kanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanColumn from "./kanban-column";
import CreateColumnDialog from "./dialogs/create-column-dialog";
import {
  getColumns,
  getTasks,
  reorderColumn,
  moveTask,
} from "@/actions/kanban.action";
import type { Column, Task } from "@/lib/types";
import TasksTable from "./tasks-table";
import { useAuth } from "@/components/dashboard/components/auth-context";

export default function KanbanBoard() {
  const { user } = useAuth();
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
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
        const columnsData = await getColumns(user.id);
        const tasksData = await getTasks(user.id);

        setColumns(columnsData);
        setTasks(tasksData);
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
  }, [user.id]);

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
      const newColumns = [...columns];
      const movedColumn = newColumns.find((col) => col.id === draggableId);

      if (!movedColumn) return;

      newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);

      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setColumns(updatedColumns);

      try {
        await reorderColumn(draggableId, destination.index);
      } catch (error) {
        toast.error("Falha ao reordenar colunas. Por favor, tente novamente.");
        setColumns(columns);
      }

      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destinationColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) return;

    if (source.droppableId === destination.droppableId) {
      const columnTasks = tasks.filter(
        (task) => task.columnId === sourceColumn.id
      );
      const movedTask = columnTasks.find((task) => task.id === draggableId);

      if (!movedTask) return;

      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex((task) => task.id === draggableId);

      if (taskIndex !== -1) {
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          order: destination.index,
        };
      }

      setTasks(newTasks);

      try {
        await moveTask(draggableId, destination.droppableId, destination.index);
      } catch (error) {
        toast.error("Falha ao reordenar tarefas. Por favor, tente novamente.");
        setTasks(tasks);
      }
    } else {
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex((task) => task.id === draggableId);

      if (taskIndex !== -1) {
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          columnId: destination.droppableId,
          order: destination.index,
        };
      }

      setTasks(newTasks);

      try {
        await moveTask(draggableId, destination.droppableId, destination.index);
      } catch (error) {
        toast.error("Falha ao mover tarefa. Por favor, tente novamente.");
        setTasks(tasks);
      }
    }
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const columnsData = await getColumns(user.id);
      const tasksData = await getTasks(user.id);

      setColumns(columnsData);
      setTasks(tasksData);
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
    <div className="space-y-4">
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
        <Button onClick={() => setIsCreateColumnOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Coluna
        </Button>
      </div>

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
                  {columns
                    .sort((a, b) => a.order - b.order)
                    .map((column, index) => (
                      <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={tasks
                          .filter((task) => task.columnId === column.id)
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
        <TasksTable tasks={tasks} columns={columns} refreshData={refreshData} />
      )}

      <CreateColumnDialog
        open={isCreateColumnOpen}
        onOpenChange={setIsCreateColumnOpen}
        userId={user.id}
        refreshData={refreshData}
      />
    </div>
  );
}
