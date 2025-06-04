"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Columns, Users } from "lucide-react";
import UpdateFunnelDialog from "./dialogs/update-funnel-dialog";
import DeleteFunnelDialog from "./dialogs/delete-funnel-dialog";

type FunnelWithRelations = {
  id: string;
  name: string;
  description: string | null;
  _count: {
    columns: number;
    Lead: number;
  };
};

interface FunnelCardProps {
  funnel: FunnelWithRelations;
}

export default function FunnelCard({ funnel }: FunnelCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="m-0 p-0">
        <div className="h-16 w-full -translate-y-6 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="flex flex-col px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="group-hover:text-primary text-xl font-semibold">
                {funnel.name}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <UpdateFunnelDialog funnel={funnel} />
              <DeleteFunnelDialog
                funnelId={funnel.id}
                funnelName={funnel.name}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {funnel.description || "Sem descrição"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Columns className="h-4 w-4" />
            <span>{funnel._count.columns} colunas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {funnel._count.Lead}{" "}
              {funnel._count.Lead === 0
                ? "leads"
                : funnel._count.Lead === 1
                  ? "lead"
                  : "leads"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6">
        <Button asChild className="w-full" variant="outline">
          <Link
            href={`/funnels/${funnel.id}`}
            className="flex items-center gap-2"
          >
            Acessar funil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
