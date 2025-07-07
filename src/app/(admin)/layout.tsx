import { AppSidebar } from "@/app/(admin)/dashboard/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavActions from "@/app/(admin)/dashboard/components/nav-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AIStatusBadge } from "@/components/ai-status-badge";
import { CoreProvider } from "@/providers/core-provider";
import CommandSearch from "@/components/ui/command-search";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  return (
    <CoreProvider user={{ ...session.user, image: session.user.image ?? null }}>
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
              <CommandSearch />
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
    </CoreProvider>
  );
};

export default Layout;
