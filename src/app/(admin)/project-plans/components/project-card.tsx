"use client";

import Link from "next/link";
import {
  CalendarIcon,
  Eye,
  MoreVertical,
  Trash2,
  Loader2,
  Briefcase,
  ShoppingCart,
  GraduationCap,
  HeartPulse,
  Utensils,
  Building2,
  FolderIcon,
} from "lucide-react";
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
import { sectorNames } from "@/lib/plan-questions";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    sector: string;
  };
}

// Mapeamento de ícones para setores
const sectorIcons = {
  ECOMMERCE: <ShoppingCart className="text-primary h-5 w-5" />, // E-commerce
  SAAS: <Briefcase className="text-primary h-5 w-5" />, // SaaS
  HEALTH: <HeartPulse className="text-primary h-5 w-5" />, // Saúde
  FOOD: <Utensils className="text-primary h-5 w-5" />, // Alimentação
  EDUCATION: <GraduationCap className="text-primary h-5 w-5" />, // Educação
  OTHER: <Building2 className="text-primary h-5 w-5" />, // Outro
};

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
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="bg-muted-foreground/10 flex items-center justify-center rounded p-3">
                <FolderIcon className="h-5 w-5" />
              </div>
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-gray-600">
              {project.description}
            </CardDescription>
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
                      This action cannot be undone. This will permanently delete
                      your project plan and all associated data.
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
      </CardHeader>

      <CardContent className="flex flex-col space-y-3">
        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-500 bg-green-500/60 px-2 text-xs font-semibold text-green-100"
          >
            {sectorNames[project.sector as keyof typeof sectorNames]}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <time
            dateTime={project.createdAt.toISOString()}
            className="font-medium"
          >
            {new Date(project.createdAt).toLocaleDateString()}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
