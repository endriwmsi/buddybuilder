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
import { deleteColumn } from "@/app/(private)/(admin)/tasks/actions/tasks.action";
import CreateTaskDialog from "./dialogs/create-task-dialog";
import EditColumnDialog from "./dialogs/edit-column-dialog";
import DeleteConfirmDialog from "./dialogs/delete-confirm-dialog";
import { Task, TaskColumn } from "@/generated/prisma";
import TaskItem from "./task-item";

interface TasksColumnProps {
  taskColumn: TaskColumn;
  tasks: Task[];
  index: number;
  refreshData: () => Promise<void>;
}

export default function TasksColumn({
  taskColumn,
  tasks,
  index,
  refreshData,
}: TasksColumnProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn(taskColumn.id);
      await refreshData();
      toast.success("Coluna excluída com sucesso");
    } catch (error) {
      console.error("Falha ao excluir coluna:", error);
      toast.error("Falha ao excluir coluna. Por favor, tente novamente.");
    }
  };

  return (
    <Draggable draggableId={taskColumn.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-80 flex-shrink-0"
        >
          <Card
            className="flex h-max flex-col rounded-sm border-t-4"
            style={{ borderTop: `4px solid ${taskColumn.color}` }}
            {...provided.dragHandleProps}
          >
            <CardHeader className="border-b px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{taskColumn.name}</CardTitle>
                  <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-1 text-xs">
                    {tasks.length}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditColumnOpen(true)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteColumnOpen(true)}
                      className="text-destructive"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="-mt-6 p-0">
              <Droppable droppableId={taskColumn.id} type="task">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto p-2 ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                    style={{ minHeight: "200px" }}
                  >
                    {tasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        columnName={taskColumn.name}
                        refreshData={refreshData}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
            <CardFooter className="border-t p-0 px-2">
              <Button
                variant="ghost"
                className="text-muted-foreground w-full justify-start"
                onClick={() => setIsCreateTaskOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar Tarefa
              </Button>
            </CardFooter>
          </Card>

          <CreateTaskDialog
            open={isCreateTaskOpen}
            onOpenChange={setIsCreateTaskOpen}
            columnId={taskColumn.id}
            refreshData={refreshData}
          />

          <EditColumnDialog
            open={isEditColumnOpen}
            onOpenChange={setIsEditColumnOpen}
            column={taskColumn}
            refreshData={refreshData}
          />

          <DeleteConfirmDialog
            open={isDeleteColumnOpen}
            onOpenChange={setIsDeleteColumnOpen}
            title="Excluir Coluna"
            description="Tem certeza que deseja excluir esta coluna? Todas as tarefas nesta coluna também serão excluídas. Esta ação não pode ser desfeita."
            onConfirm={handleDeleteColumn}
          />
        </div>
      )}
    </Draggable>
  );
}
