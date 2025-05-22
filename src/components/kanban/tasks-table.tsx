"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Trash2,
  SignalLowIcon,
  SignalMediumIcon,
  Signal,
  OctagonAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TaskDetailsDialog from "./dialogs/task-details-dialog";
import DeleteConfirmDialog from "./dialogs/delete-confirm-dialog";
import { PRIORITY_CONFIG, TaskPriority } from "@/lib/types";
import { deleteMultipleTasks } from "@/actions/kanban-actions";
import type { Column, Task } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";

interface TasksTableProps {
  tasks: Task[];
  columns: Column[];
  refreshData: () => Promise<void>;
}

export default function TasksTable({
  tasks,
  columns,
  refreshData,
}: TasksTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "LOW":
        return <SignalLowIcon className="h-3 w-3" />;
      case "MEDIUM":
        return <SignalMediumIcon className="h-3 w-3" />;
      case "HIGH":
        return <Signal className="h-3 w-3" />;
      case "URGENT":
        return <OctagonAlert className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getColumnName = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column ? column.name : "Desconhecido";
  };

  const getColumnColor = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column ? column.color : "#e2e8f0";
  };

  const tableColumns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.getValue("description") || "Sem descrição"}
        </div>
      ),
    },
    {
      accessorKey: "columnId",
      header: "Coluna",
      cell: ({ row }) => {
        const columnId = row.getValue("columnId") as string;
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getColumnColor(columnId) }}
            ></div>
            {getColumnName(columnId)}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Prioridade",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority;
        const priorityConfig = PRIORITY_CONFIG[priority];
        return (
          <Badge
            variant="outline"
            className={`text-xs ${priorityConfig.color}`}
          >
            <span className="mr-1">{getPriorityIcon(priority)}</span>
            {priorityConfig.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Prazo",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string | null;
        return dueDate ? new Date(dueDate).toLocaleDateString() : "Sem prazo";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return new Date(createdAt).toLocaleDateString();
      },
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const taskIds = selectedRows.map((row) => row.original.id);

      if (taskIds.length === 0) {
        toast.error("Nenhuma tarefa selecionada");
        return;
      }

      await deleteMultipleTasks(taskIds);
      await refreshData();
      setRowSelection({});
      toast.success(`${taskIds.length} tarefa(s) excluída(s) com sucesso`);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
      toast.error("Falha ao excluir tarefas. Por favor, tente novamente.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filtrar por título..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive/10 h-8 gap-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Colunas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "columnId"
                          ? "Coluna"
                          : column.id === "createdAt"
                            ? "Criado em"
                            : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center"
                  >
                    Nenhuma tarefa encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          task={selectedTask}
          refreshData={refreshData}
        />
      )}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Tarefas"
        description={`Tem certeza que deseja excluir ${table.getFilteredSelectedRowModel().rows.length} tarefa(s)? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteSelected}
      />
    </>
  );
}
