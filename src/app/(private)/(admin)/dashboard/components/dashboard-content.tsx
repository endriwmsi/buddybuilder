"use client";

import { use } from "react";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Filter,
  Layers,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectsTable } from "./projects-table";
import { RevenueChart } from "./revenue-charts";
import { SalesFunnelChart } from "./sales-funnel-chart";
import { SprintTimeline } from "./sprint-timeline";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  activeSprints: number;
  crmContacts: number;
  monthlyRevenue: number;
  projectsGrowth: string;
  sprintsInfo: string;
  contactsGrowth: string;
  revenueGrowth: string;
}

interface Project {
  id: string;
  name: string;
  owner: {
    name: string;
    email: string;
    avatar: string;
  };
  status: "Active" | "Completed" | "On Hold" | "Planning";
  progress: number;
  lastUpdated: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  tags: string[];
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "Completed" | "Active" | "Upcoming";
  project: string;
}

interface RevenueData {
  name: string;
  revenue: number;
  profit: number;
  margin: number;
}

interface SalesFunnelData {
  name: string;
  value: number;
  fill: string;
}

interface DashboardContentProps {
  statsPromise: Promise<DashboardStats>;
  projectsPromise: Promise<Project[]>;
  sprintsPromise: Promise<Sprint[]>;
  revenueDataPromise: Promise<RevenueData[]>;
  salesFunnelDataPromise: Promise<SalesFunnelData[]>;
}

export function DashboardContent({
  statsPromise,
  projectsPromise,
  sprintsPromise,
  revenueDataPromise,
  salesFunnelDataPromise,
}: DashboardContentProps) {
  const stats = use(statsPromise);
  const projects = use(projectsPromise);
  const sprints = use(sprintsPromise);
  const revenueData = use(revenueDataPromise);
  const salesFunnelData = use(salesFunnelDataPromise);

  return (
    <>
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Layers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-muted-foreground text-xs">
              {stats.projectsGrowth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sprints
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSprints}</div>
            <p className="text-muted-foreground text-xs">{stats.sprintsInfo}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CRM Contacts</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.crmContacts.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.contactsGrowth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.revenueGrowth}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="h-8 w-[200px] pl-8"
              />
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart data={revenueData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesFunnelChart data={salesFunnelData} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Recently created or updated projects
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto gap-1">
                      <span>Last 7 days</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                    <DropdownMenuItem>All time</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                        <FileText className="text-primary h-5 w-5" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm leading-none font-medium">
                          {project.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Updated {project.lastUpdated}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <Badge
                          variant={
                            project.status === "Active" ? "default" : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View all projects
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sprint Timeline</CardTitle>
                <CardDescription>
                  Current and upcoming sprint schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SprintTimeline sprints={sprints} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View sprint details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your marketing and sales projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsTable projects={projects} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-muted-foreground text-sm">12.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Customer Acquisition Cost
                    </span>
                    <span className="text-muted-foreground text-sm">
                      $45.20
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lifetime Value</span>
                    <span className="text-muted-foreground text-sm">
                      $1,250
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Return on Ad Spend
                    </span>
                    <span className="text-muted-foreground text-sm">4.2x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>
                  Performance breakdown by marketing channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email Marketing</span>
                    <span className="text-muted-foreground text-sm">
                      35% of leads
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Social Media</span>
                    <span className="text-muted-foreground text-sm">
                      28% of leads
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Paid Search</span>
                    <span className="text-muted-foreground text-sm">
                      22% of leads
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Organic Search</span>
                    <span className="text-muted-foreground text-sm">
                      15% of leads
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Integrations</CardTitle>
                <CardDescription>
                  Connected services and webhooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Salesforce CRM</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">HubSpot</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-sm">Slack</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Webhook Events</CardTitle>
                <CardDescription>Recent webhook activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Lead Created</div>
                    <div className="text-muted-foreground">2 minutes ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Deal Updated</div>
                    <div className="text-muted-foreground">15 minutes ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Campaign Completed</div>
                    <div className="text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                  Current month usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Calls</span>
                    <span className="text-sm font-medium">12,450 / 50,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook Deliveries</span>
                    <span className="text-sm font-medium">3,240</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">99.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
