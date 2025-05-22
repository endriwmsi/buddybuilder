import { AppSidebar } from "@/components/app-sidebar";
import InsetHeader from "@/components/inset-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <AuthProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <InsetHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
