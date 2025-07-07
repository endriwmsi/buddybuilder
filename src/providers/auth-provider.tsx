"use client";

import { createContext, ReactNode, useContext } from "react";
import { User } from "@/generated/prisma";

type AuthContextType = {
  user: User;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
