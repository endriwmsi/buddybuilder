"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateFunnelDialog from "./dialogs/create-funnel-dialog";
import { useAuth } from "@/contexts/auth-context";

const FunnelsHeader = () => {
  const { user } = useAuth();
  const [isCreateFunnelDialogOpen, setCreateFunnelDialogOpen] = useState(false);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seus Funis</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os seus funis estratégicos
          </p>
        </div>
        <Button onClick={() => setCreateFunnelDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo funil
        </Button>
      </div>

      <CreateFunnelDialog
        open={isCreateFunnelDialogOpen}
        onOpenChange={setCreateFunnelDialogOpen}
        userId={user.id}
      />
    </div>
  );
};

export default FunnelsHeader;
