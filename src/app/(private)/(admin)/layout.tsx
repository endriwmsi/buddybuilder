import { AppSidebar } from "@/components/dashboard/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/auth-context";
import { Separator } from "@/components/ui/separator";
import NavActions from "@/components/dashboard/components/nav-actions";

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
          {/* <InsetHeader /> */}
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>
          <div className="w-full px-4 sm:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
