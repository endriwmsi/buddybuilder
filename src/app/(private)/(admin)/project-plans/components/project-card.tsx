"use client";

import Link from "next/link";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    sector: string;
    createdAt: Date;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

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
    <Card className="group relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">
            <Link
              href={`/project-plans/${project.id}`}
              className="hover:underline"
            >
              {project.title}
            </Link>
          </CardTitle>
          <Badge variant="secondary" className="capitalize">
            {project.sector.toLowerCase()}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/project-plans/${project.id}`}>
              <DropdownMenuItem variant="default" className="">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  className="text-destructive"
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
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="px-6">
        <p className="text-muted-foreground text-sm">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
