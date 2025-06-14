"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailedAction, PlanAction, ProjectPlan } from "@/generated/prisma";
import { generateDetailedActions as generateDetailedActionsServer } from "../actions/detailed-actions.action";
import { toast } from "sonner";
import { ActionCard } from "./action-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProjectDetails } from "./project-details";

interface ProjectPlanDetailProps {
  projectPlan: ProjectPlan & {
    actions: (PlanAction & {
      detailedActions: DetailedAction[];
      priority: "LOW" | "MEDIUM" | "HIGH";
    })[];
  };
}

export function ProjectPlanDetail({ projectPlan }: ProjectPlanDetailProps) {
  const router = useRouter();
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);

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
        <Tabs defaultValue="details" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="general">Ações Gerais</TabsTrigger>
              <TabsTrigger value="refined">Ações Refinadas</TabsTrigger>
            </TabsList>

            {hasSelectedActions && (
              <Button
                onClick={handleGenerateDetailedActions}
                disabled={isGenerating}
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
            )}
          </div>

          <TabsContent value="details" className="mt-4">
            <ProjectDetails projectPlan={projectPlan} />
          </TabsContent>

          <TabsContent value="general" className="mt-4 space-y-4">
            {projectPlan.actions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                isSelected={selectedActions[action.id] || false}
                onSelectionChange={handleSelectionChange}
              />
            ))}
          </TabsContent>

          <TabsContent value="refined" className="mt-4 space-y-4">
            {projectPlan.actions
              .filter((action) => action.detailedActions.length > 0)
              .map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isSelected={selectedActions[action.id] || false}
                  onSelectionChange={handleSelectionChange}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
