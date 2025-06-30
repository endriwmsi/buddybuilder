"use client";

import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: string;
  name: string;
  owner: {
    name: string;
    email: string;
    avatar: string;
  };
  status: "Active" | "Completed" | "On Hold" | "Planning";
  progress: number;
  lastUpdated: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  tags: string[];
}

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleAllProjects = () => {
    setSelectedProjects((prev) =>
      prev.length === filteredProjects.length
        ? []
        : filteredProjects.map((p) => p.id)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {selectedProjects.length > 0 && (
          <Badge variant="secondary">{selectedProjects.length} selected</Badge>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedProjects.length === filteredProjects.length &&
                    filteredProjects.length > 0
                  }
                  onCheckedChange={toggleAllProjects}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Project
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProjectSelection(project.id)}
                    aria-label={`Select ${project.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {project.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={project.owner.avatar || "/placeholder.svg"}
                        alt={project.owner.name}
                      />
                      <AvatarFallback>
                        {project.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">
                        {project.owner.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {project.owner.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      project.status === "Active" ? "default" : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={project.progress}
                      className="h-2 w-[60px]"
                    />
                    <span className="text-muted-foreground text-xs">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>{project.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(project.id)
                        }
                      >
                        Copy project ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View project</DropdownMenuItem>
                      <DropdownMenuItem>View analytics</DropdownMenuItem>
                      <DropdownMenuItem>Generate playbook</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <div>
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
        <div>
          {selectedProjects.length} of {filteredProjects.length} row(s) selected
        </div>
      </div>
    </div>
  );
}
