"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AIProcessingContextType {
  isProcessing: boolean;
  processingProjectId: string | null;
  estimatedTimeRemaining: number;
  startProcessing: (projectId: string, estimatedTime?: number) => void;
  stopProcessing: () => void;
}

const AIProcessingContext = createContext<AIProcessingContextType | undefined>(
  undefined
);

export function AIProcessingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProjectId, setProcessingProjectId] = useState<string | null>(
    null
  );
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] =
    useState<number>(0);

  const startProcessing = useCallback(
    (projectId: string, estimatedTime: number = 0) => {
      setIsProcessing(true);
      setProcessingProjectId(projectId);
      setEstimatedTimeRemaining(estimatedTime);
    },
    []
  );

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setProcessingProjectId(null);
    setEstimatedTimeRemaining(0);
  }, []);

  return (
    <AIProcessingContext.Provider
      value={{
        isProcessing,
        processingProjectId,
        estimatedTimeRemaining,
        startProcessing,
        stopProcessing,
      }}
    >
      {children}
    </AIProcessingContext.Provider>
  );
}

export function useAIProcessing() {
  const context = useContext(AIProcessingContext);
  if (context === undefined) {
    throw new Error(
      "useAIProcessing must be used within an AIProcessingProvider"
    );
  }
  return context;
}
