"use client";

import { NavMain } from "@/app/(admin)/dashboard/components/nav-main";
import { NavUser } from "@/app/(admin)/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { navMain } from "@/lib/constants";
import { IconInnerShadowTop } from "@tabler/icons-react";

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon">
      {/* <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader> */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Vector One</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
