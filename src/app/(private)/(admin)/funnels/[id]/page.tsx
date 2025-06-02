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
    <div className="flex items-center p-8">
      <FunnelBoard funnelId={id} />
    </div>
  );
};

export default FunnelPage;
