import { AppSidebar } from "@/components/app-sidebar";
import InsetHeader from "@/components/inset-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { SidebarUserType } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  const sidebarUser: SidebarUserType = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} />
      <SidebarInset>
        <InsetHeader user={sidebarUser} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
