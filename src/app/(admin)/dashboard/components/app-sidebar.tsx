"use client";

import { NavMain } from "@/app/(admin)/dashboard/components/nav-main";
import { NavUser } from "@/app/(admin)/dashboard/components/nav-user";
import { TeamSwitcher } from "@/app/(admin)/dashboard/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { navMain, teams } from "@/lib/constants";

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
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
