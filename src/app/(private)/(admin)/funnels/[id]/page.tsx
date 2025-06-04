"use client";

import { use } from "react";
import FunnelBoard from "../components/funnel-board";

interface FunnelPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FunnelPage = ({ params }: FunnelPageProps) => {
  const { id } = use(params);
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-10">
      <FunnelBoard funnelId={id} />
    </div>
  );
};

export default FunnelPage;
