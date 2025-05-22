"use client";

import { createContext, useContext } from "react";
import { User } from "@/generated/prisma";

type AuthContextType = {
  user: Pick<User, "id" | "name" | "email" | "image">;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Pick<User, "id" | "name" | "email" | "image">;
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
