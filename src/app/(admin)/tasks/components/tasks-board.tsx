"use client";

import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, List, Kanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getColumns,
  getTasks,
  reorderColumn,
  moveTask,
} from "@/app/(admin)/tasks/actions/tasks.action";
import TasksTable from "./tasks-table";
import { useAuth } from "@/providers/auth-provider";
import CreateColumnDialog from "./dialogs/create-column-dialog";
import { Task, TaskColumn } from "@/generated/prisma";
import TasksColumn from "./tasks-column";
import { Icons } from "@/components/icons";

const TasksBoard = () => {
  const { user } = useAuth();

  // State management
  const [taskColumns, setTaskColumns] = useState<TaskColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

  // View mode with localStorage persistence
  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("tasks-view-mode");
      return (savedViewMode as "kanban" | "list") || "kanban";
    }
    return "kanban";
  });

  // Persist view mode changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks-view-mode", viewMode);
    }
  }, [viewMode]);

  // Load tasks data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [columnsData, tasksData] = await Promise.all([
        getColumns(user.id),
        getTasks(user.id),
      ]);

      setTaskColumns(columnsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load tasks data:", error);
      toast.error(
        "Falha ao carregar dados das tarefas. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [columnsData, tasksData] = await Promise.all([
        getColumns(user.id),
        getTasks(user.id),
      ]);

      setTaskColumns(columnsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to refresh tasks data:", error);
      toast.error(
        "Falha ao atualizar dados das tarefas. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

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
      const newColumns = [...taskColumns];
      const movedColumn = newColumns.find((col) => col.id === draggableId);

      if (!movedColumn) return;

      newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, movedColumn);

      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setTaskColumns(updatedColumns);

      try {
        await reorderColumn(draggableId, destinationIndex);
      } catch (error) {
        toast.error("Falha ao reordenar colunas. Por favor, tente novamente.");
        setTaskColumns(taskColumns);
      }
    },
    [taskColumns]
  );

  const handleTaskMove = useCallback(
    async (
      draggableId: string,
      source: { droppableId: string; index: number },
      destination: { droppableId: string; index: number }
    ) => {
      const sourceColumn = taskColumns.find(
        (col) => col.id === source.droppableId
      );
      const destinationColumn = taskColumns.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceColumn || !destinationColumn) return;

      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex((task) => task.id === draggableId);

      if (taskIndex === -1) return;

      if (source.droppableId === destination.droppableId) {
        // Same column reorder
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          order: destination.index,
        };
      } else {
        // Move between columns
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          taskColumnId: destination.droppableId,
          order: destination.index,
        };
      }

      setTasks(newTasks);

      try {
        await moveTask(draggableId, destination.droppableId, destination.index);
      } catch (error) {
        const errorMessage =
          source.droppableId === destination.droppableId
            ? "Falha ao reordenar tarefas. Por favor, tente novamente."
            : "Falha ao mover tarefa. Por favor, tente novamente.";
        toast.error(errorMessage);
        setTasks(tasks);
      }
    },
    [taskColumns, tasks]
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

      await handleTaskMove(draggableId, source, destination);
    },
    [handleColumnReorder, handleTaskMove]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-15rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icons.spinner className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas tarefas</h1>
          <p className="text-muted-foreground">
            Crie e acompanhe suas tarefas de forma organizada e eficiente.
          </p>
        </div>

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
      </div>

      {/* Content */}
      <div className="max-w-[1535px] overflow-x-hidden">
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
                  {taskColumns
                    .sort((a, b) => a.order - b.order)
                    .map((taskColumn, index) => (
                      <TasksColumn
                        key={taskColumn.id}
                        taskColumn={taskColumn}
                        tasks={tasks
                          .filter((task) => task.taskColumnId === taskColumn.id)
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
          <TasksTable
            tasks={tasks}
            taskColumns={taskColumns}
            refreshData={refreshData}
          />
        )}
      </div>

      {/* Dialog */}
      <CreateColumnDialog
        open={isCreateColumnOpen}
        onOpenChange={setIsCreateColumnOpen}
        userId={user.id}
        refreshData={refreshData}
      />
    </div>
  );
};

export default TasksBoard;
