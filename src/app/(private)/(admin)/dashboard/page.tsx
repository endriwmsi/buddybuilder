import { Suspense } from "react";
import { DashboardContent } from "./components/dashboard-content";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

// Mock data fetching functions
async function getDashboardStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalProjects: 24,
    activeProjects: 18,
    activeSprints: 8,
    crmContacts: 1482,
    monthlyRevenue: 24389,
    projectsGrowth: "+2 from last month",
    sprintsInfo: "3 ending this week",
    contactsGrowth: "+24 new leads this week",
    revenueGrowth: "+12.5% from last month",
  };
}

async function getProjects() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "PROJ-1234",
      name: "Q3 Marketing Campaign",
      owner: {
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "Active" as const,
      progress: 75,
      lastUpdated: "2 hours ago",
      description: "Comprehensive marketing campaign for Q3 product launch",
      startDate: "2023-07-01",
      endDate: "2023-09-30",
      budget: 25000,
      tags: ["marketing", "social media", "email"],
    },
    {
      id: "PROJ-2345",
      name: "CRM Integration",
      owner: {
        name: "Sarah Miller",
        email: "sarah@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "Active" as const,
      progress: 45,
      lastUpdated: "1 day ago",
      description: "Integration of new CRM system with existing tools",
      startDate: "2023-06-15",
      endDate: "2023-08-30",
      budget: 18000,
      tags: ["integration", "crm", "automation"],
    },
    {
      id: "PROJ-3456",
      name: "Sales Automation Workflow",
      owner: {
        name: "Michael Chen",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "Planning" as const,
      progress: 10,
      lastUpdated: "3 days ago",
      description: "Automating sales processes with AI-powered workflows",
      startDate: "2023-08-01",
      endDate: "2023-10-15",
      budget: 32000,
      tags: ["automation", "sales", "ai"],
    },
    {
      id: "PROJ-4567",
      name: "Website Redesign",
      owner: {
        name: "Emily Rodriguez",
        email: "emily@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "On Hold" as const,
      progress: 60,
      lastUpdated: "1 week ago",
      description: "Complete redesign of company website with new branding",
      startDate: "2023-05-01",
      endDate: "2023-07-30",
      budget: 45000,
      tags: ["design", "web", "branding"],
    },
    {
      id: "PROJ-5678",
      name: "Product Launch: AI Assistant",
      owner: {
        name: "David Kim",
        email: "david@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "Active" as const,
      progress: 85,
      lastUpdated: "5 hours ago",
      description: "Launch campaign for new AI assistant product",
      startDate: "2023-07-15",
      endDate: "2023-08-15",
      budget: 50000,
      tags: ["product launch", "ai", "marketing"],
    },
    {
      id: "PROJ-6789",
      name: "Sales Training Program",
      owner: {
        name: "Jessica Taylor",
        email: "jessica@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "Completed" as const,
      progress: 100,
      lastUpdated: "2 weeks ago",
      description: "Comprehensive sales training program for new team members",
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      budget: 15000,
      tags: ["training", "sales", "onboarding"],
    },
  ];
}

async function getSprints() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    {
      id: "SPRINT-1",
      name: "Sprint 1: Campaign Planning",
      startDate: "Jul 1",
      endDate: "Jul 14",
      progress: 100,
      status: "Completed" as const,
      project: "Q3 Marketing Campaign",
    },
    {
      id: "SPRINT-2",
      name: "Sprint 2: Content Creation",
      startDate: "Jul 15",
      endDate: "Jul 28",
      progress: 85,
      status: "Active" as const,
      project: "Q3 Marketing Campaign",
    },
    {
      id: "SPRINT-3",
      name: "Sprint 3: Channel Optimization",
      startDate: "Jul 29",
      endDate: "Aug 11",
      progress: 0,
      status: "Upcoming" as const,
      project: "Q3 Marketing Campaign",
    },
    {
      id: "SPRINT-4",
      name: "Sprint 4: Launch & Monitor",
      startDate: "Aug 12",
      endDate: "Aug 25",
      progress: 0,
      status: "Upcoming" as const,
      project: "Q3 Marketing Campaign",
    },
  ];
}

async function getRevenueData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  return [
    { name: "Jan", revenue: 18000, profit: 7200, margin: 40 },
    { name: "Feb", revenue: 20500, profit: 8400, margin: 41 },
    { name: "Mar", revenue: 21800, profit: 9100, margin: 42 },
    { name: "Apr", revenue: 22900, profit: 9800, margin: 43 },
    { name: "May", revenue: 23100, profit: 10200, margin: 44 },
    { name: "Jun", revenue: 24500, profit: 11000, margin: 45 },
  ];
}

async function getSalesFunnelData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { name: "Leads", value: 5890, fill: "#8884d8" },
    { name: "Qualified", value: 4350, fill: "#83a6ed" },
    { name: "Proposals", value: 1800, fill: "#8dd1e1" },
    { name: "Negotiations", value: 1200, fill: "#82ca9d" },
    { name: "Closed Won", value: 750, fill: "#a4de6c" },
  ];
}

export default async function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing and sales
            projects.
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          statsPromise={getDashboardStats()}
          projectsPromise={getProjects()}
          sprintsPromise={getSprints()}
          revenueDataPromise={getRevenueData()}
          salesFunnelDataPromise={getSalesFunnelData()}
        />
      </Suspense>
    </div>
  );
}
