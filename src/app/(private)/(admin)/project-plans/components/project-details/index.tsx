import {
  Building2,
  TagIcon,
  Target,
  BarChart3,
  Briefcase,
  Goal,
  LineChart,
  TrendingUp,
} from "lucide-react";
import { BusinessSector, ProjectPlan } from "@/generated/prisma";
import { sectorNames } from "@/lib/plan-questions";

interface ProjectDetailsProps {
  projectPlan: ProjectPlan;
}

export function ProjectDetails({ projectPlan }: ProjectDetailsProps) {
  return (
    <div className="grid gap-6">
      <ProjectInfo projectPlan={projectPlan} />
      {projectPlan.sectorDetails && (
        <SectorDetails sectorDetails={projectPlan.sectorDetails} />
      )}
      {(projectPlan.marketingGoal || projectPlan.commercialGoal) && (
        <ProjectGoals
          marketingGoal={projectPlan.marketingGoal}
          commercialGoal={projectPlan.commercialGoal}
        />
      )}
    </div>
  );
}

function ProjectInfo({ projectPlan }: ProjectDetailsProps) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="mb-6 flex items-center text-xl font-semibold">
        <TagIcon className="text-primary mr-2 h-5 w-5" />
        Informações do Projeto
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2">
            <Building2 className="text-primary h-5 w-5" />
            <span className="text-sm font-medium">Setor</span>
          </div>
          <p className="text-lg font-medium">
            {sectorNames[projectPlan.sector as BusinessSector]}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="text-primary h-5 w-5" />
            <span className="text-sm font-medium">Maturidade de Marketing</span>
          </div>
          <p className="text-lg font-medium capitalize">
            {projectPlan.marketingMaturity.toLowerCase()}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <span className="text-sm font-medium">Maturidade Comercial</span>
          </div>
          <p className="text-lg font-medium capitalize">
            {projectPlan.commercialMaturity.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SectorDetailsProps {
  sectorDetails: any;
}

function SectorDetails({ sectorDetails }: SectorDetailsProps) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="mb-6 flex items-center text-xl font-semibold">
        <Briefcase className="text-primary mr-2 h-5 w-5" />
        Detalhes do Setor
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(sectorDetails as Record<string, string>).map(
          ([key, value]) => (
            <div key={key} className="bg-muted/50 rounded-lg p-4">
              <div className="mb-2 flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              <p className="text-lg font-medium">{value}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

interface ProjectGoalsProps {
  marketingGoal?: string | null;
  commercialGoal?: string | null;
}

function ProjectGoals({ marketingGoal, commercialGoal }: ProjectGoalsProps) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="mb-6 flex items-center text-xl font-semibold">
        <Goal className="text-primary mr-2 h-5 w-5" />
        Objetivos
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {marketingGoal && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="mb-2 flex items-center gap-2">
              <LineChart className="text-primary h-5 w-5" />
              <span className="text-sm font-medium">Objetivo de Marketing</span>
            </div>
            <p className="text-lg font-medium">{marketingGoal}</p>
          </div>
        )}
        {commercialGoal && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <span className="text-sm font-medium">Objetivo Comercial</span>
            </div>
            <p className="text-lg font-medium">{commercialGoal}</p>
          </div>
        )}
      </div>
    </div>
  );
}
