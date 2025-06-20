"use client";

import { useAIProcessing } from "@/contexts/ai-processing-context";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AIStatusBadgeProps {
  status?: "ok" | "processing";
}

export function AIStatusBadge({ status }: AIStatusBadgeProps) {
  const { isProcessing, estimatedTimeRemaining } = useAIProcessing();

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-sm border px-2 text-xs",
        isProcessing
          ? "border-amber-500 bg-amber-300/60 text-amber-100"
          : "border-green-500 bg-green-500/60 text-green-100"
      )}
    >
      <span className="font-bold">IA: </span>
      {isProcessing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Ativo</span>
        </>
      ) : (
        <>
          <span>Ocioso</span>
        </>
      )}
      {isProcessing && estimatedTimeRemaining > 0 && (
        <span className="text-xs">({estimatedTimeRemaining}s)</span>
      )}
    </div>
  );
}
