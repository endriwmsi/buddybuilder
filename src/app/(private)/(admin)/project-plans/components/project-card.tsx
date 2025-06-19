"use client";

import Link from "next/link";
import { CalendarIcon, Eye, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProjectPlan } from "../actions/plan.action";
import { cn } from "@/lib/utils";
import { useAIProcessing } from "@/contexts/ai-processing-context";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    sector: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { isProcessing, processingProjectId } = useAIProcessing();

  const isProjectProcessing =
    isProcessing && processingProjectId === project.id;

  const handleDelete = async () => {
    try {
      const result = await deleteProjectPlan(project.id);

      if (result.success) {
        toast.success("Project plan deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete project plan");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the project plan");
    }
  };

  return (
    <Link href={`/project-plans/${project.id}`}>
      <Card
        className={cn(
          "group hover:border-primary relative overflow-hidden transition-all duration-200 hover:shadow-md",
          isProjectProcessing ? "opacity-50" : ""
        )}
      >
        {isProjectProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="mt-2 text-sm font-medium text-purple-600">
              IA está processando seu planejamento...
            </p>
          </div>
        )}
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold">
                {project.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-primary bg-purple-100 capitalize hover:bg-purple-200"
              >
                {project.sector.toLowerCase()}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={isProjectProcessing}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={`/project-plans/${project.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your project plan and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardDescription className="line-clamp-2 text-sm text-gray-600">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={project.createdAt.toISOString()}>
              {new Date(project.createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
