"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailedAction, PlanAction, ProjectPlan } from "@/generated/prisma";
import { generateDetailedActions as generateDetailedActionsServer } from "../actions/detailed-actions.action";
import { toast } from "sonner";
import { ActionCard } from "./action-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutGrid, List } from "lucide-react";
import { ProjectDetails } from "./project-details";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectPlanDetailProps {
  projectPlan: ProjectPlan & {
    actions: (PlanAction & {
      detailedActions: DetailedAction[];
      priority: "LOW" | "MEDIUM" | "HIGH";
    })[];
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: (viewMode: "grid" | "list") => ({
    opacity: 0,
    x: viewMode === "grid" ? 50 : 0,
    y: viewMode === "list" ? 20 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function ProjectPlanDetail({ projectPlan }: ProjectPlanDetailProps) {
  const router = useRouter();
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("details");
  const isMobile = useIsMobile();

  const handleSelectionChange = (actionId: string, checked: boolean) => {
    setSelectedActions((prev) => ({
      ...prev,
      [actionId]: checked,
    }));
  };

  const handleGenerateDetailedActions = async () => {
    const selectedActionIds = Object.entries(selectedActions)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (selectedActionIds.length === 0) return;

    setIsGenerating(true);
    try {
      const result = await generateDetailedActionsServer(
        projectPlan.id,
        selectedActionIds
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Ações detalhadas geradas com sucesso.");
      setSelectedActions({});
      router.refresh();
    } catch (error) {
      console.error("Error generating detailed actions:", error);
      toast.error(
        "Não foi possível gerar as ações detalhadas. Por favor, tente novamente."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const hasSelectedActions = Object.values(selectedActions).some(
    (selected) => selected
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{projectPlan.title}</h1>
          <p className="mb-4 text-gray-600">{projectPlan.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {isMobile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="details">Detalhes</SelectItem>
                  <SelectItem value="general">Ações Gerais</SelectItem>
                  <SelectItem value="refined">Ações Refinadas</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleGenerateDetailedActions}
                disabled={isGenerating || !hasSelectedActions}
                className="cursor-pointer whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar Detalhamentos"
                )}
              </Button>
            </div>

            {activeTab === "details" && (
              <ProjectDetails projectPlan={projectPlan} />
            )}

            {activeTab === "general" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {projectPlan.actions.map((action) => (
                  <motion.div
                    key={action.id}
                    variants={itemVariants}
                    custom="list"
                  >
                    <ActionCard
                      action={action}
                      isSelected={selectedActions[action.id] || false}
                      onSelectionChange={handleSelectionChange}
                      viewMode="list"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "refined" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {projectPlan.actions
                  .filter((action) => action.detailedActions.length > 0)
                  .map((action) => (
                    <motion.div
                      key={action.id}
                      variants={itemVariants}
                      custom="list"
                    >
                      <ActionCard
                        action={action}
                        isSelected={selectedActions[action.id] || false}
                        onSelectionChange={handleSelectionChange}
                        viewMode="list"
                      />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="details" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="general">Ações Gerais</TabsTrigger>
                <TabsTrigger value="refined">Ações Refinadas</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) =>
                    value && setViewMode(value as "grid" | "list")
                  }
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Button
                  onClick={handleGenerateDetailedActions}
                  disabled={isGenerating || !hasSelectedActions}
                  className="cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Detalhamentos...
                    </>
                  ) : (
                    "Gerar Detalhamentos Selecionados"
                  )}
                </Button>
              </div>
            </div>

            <TabsContent value="details" className="mt-4 w-full">
              <ProjectDetails projectPlan={projectPlan} />
            </TabsContent>

            <TabsContent value="general" className="mt-4 w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  "gap-4",
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col"
                )}
              >
                {projectPlan.actions.map((action) => (
                  <motion.div
                    key={action.id}
                    variants={itemVariants}
                    custom={viewMode}
                  >
                    <ActionCard
                      action={action}
                      isSelected={selectedActions[action.id] || false}
                      onSelectionChange={handleSelectionChange}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="refined" className="mt-4 w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  "gap-4",
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col"
                )}
              >
                {projectPlan.actions
                  .filter((action) => action.detailedActions.length > 0)
                  .map((action) => (
                    <motion.div
                      key={action.id}
                      variants={itemVariants}
                      custom={viewMode}
                    >
                      <ActionCard
                        action={action}
                        isSelected={selectedActions[action.id] || false}
                        onSelectionChange={handleSelectionChange}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
