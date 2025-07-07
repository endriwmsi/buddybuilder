import { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { User } from "@/generated/prisma";
import { AIStatusProvider } from "./ai-processing-context";

interface ICoreProviderProps {
  children: ReactNode;
  user: User;
}

export function CoreProvider({ children, user }: ICoreProviderProps) {
  return (
    <AuthProvider user={user}>
      <AIStatusProvider>{children}</AIStatusProvider>
    </AuthProvider>
  );
}
