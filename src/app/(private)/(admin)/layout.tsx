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
import { AIProcessingProvider } from "@/contexts/ai-processing-context";
import { AIStatusBadge } from "@/components/ai-status-badge";

const Layout = async ({ children }: { children: React.ReactNode }) => {
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
      <AIProcessingProvider>
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

              <div className="ml-auto flex items-center gap-2 px-3">
                <AIStatusBadge />
                <NavActions />
              </div>
            </header>
            <div className="flex w-full flex-1 flex-col gap-4 p-4 sm:px-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AIProcessingProvider>
    </AuthProvider>
  );
};

export default Layout;
