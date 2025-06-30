import { Metadata } from "next";
import { ProjectPlanDetail } from "@/app/(admin)/project-plans/components/project-plan-detail";
import { getProjectPlan } from "@/app/(admin)/project-plans/actions/plan.action";

interface ProjectPlanPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Detalhes do projeto",
  description: "View and manage your project plan",
};

const ProjectPlanPage = async ({ params }: ProjectPlanPageProps) => {
  const { id } = await params;
  const projectPlan = await getProjectPlan(id);

  return (
    <div className="container mx-auto py-10">
      <ProjectPlanDetail projectPlan={projectPlan} />
    </div>
  );
};

export default ProjectPlanPage;
