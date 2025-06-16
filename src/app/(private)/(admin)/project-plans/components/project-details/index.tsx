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
import { sectorNames, sectorQuestions } from "@/lib/plan-questions";
import { motion } from "framer-motion";

interface ProjectDetailsProps {
  projectPlan: ProjectPlan;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function ProjectDetails({ projectPlan }: ProjectDetailsProps) {
  return (
    <motion.div
      className="grid gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ProjectInfo projectPlan={projectPlan} />
      </motion.div>
      {projectPlan.sectorDetails && (
        <motion.div variants={itemVariants}>
          <SectorDetails
            sectorDetails={projectPlan.sectorDetails}
            sector={projectPlan.sector}
          />
        </motion.div>
      )}
      {(projectPlan.marketingGoal || projectPlan.commercialGoal) && (
        <motion.div variants={itemVariants}>
          <ProjectGoals
            marketingGoal={projectPlan.marketingGoal}
            commercialGoal={projectPlan.commercialGoal}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

function ProjectInfo({ projectPlan }: ProjectDetailsProps) {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <TagIcon className="text-primary mr-2 h-4 w-4" />
        Informações do Projeto
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <Building2 className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">Setor</span>
          </div>
          <p className="text-base font-medium">
            {sectorNames[projectPlan.sector as BusinessSector]}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <BarChart3 className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">Maturidade de Marketing</span>
          </div>
          <p className="text-base font-medium capitalize">
            {projectPlan.marketingMaturity.toLowerCase()}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">Maturidade Comercial</span>
          </div>
          <p className="text-base font-medium capitalize">
            {projectPlan.commercialMaturity.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SectorDetailsProps {
  sectorDetails: any;
  sector: BusinessSector;
}

function SectorDetails({ sectorDetails, sector }: SectorDetailsProps) {
  const questions = sectorQuestions[sector];
  const questionMap = new Map(questions.map((q) => [q.key, q.question]));

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <Briefcase className="text-primary mr-2 h-4 w-4" />
        Detalhes do Setor
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Object.entries(sectorDetails as Record<string, string>).map(
          ([key, value]) => (
            <div key={key} className="bg-muted/50 rounded-lg p-3">
              <div className="mb-1 flex items-center gap-2">
                <Target className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">
                  {questionMap.get(key) ||
                    key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              <p className="text-base font-medium">{value}</p>
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
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <Goal className="text-primary mr-2 h-4 w-4" />
        Objetivos
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {marketingGoal && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <LineChart className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">Objetivo de Marketing</span>
            </div>
            <p className="text-base font-medium">{marketingGoal}</p>
          </div>
        )}
        {commercialGoal && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">Objetivo Comercial</span>
            </div>
            <p className="text-base font-medium">{commercialGoal}</p>
          </div>
        )}
      </div>
    </div>
  );
}
