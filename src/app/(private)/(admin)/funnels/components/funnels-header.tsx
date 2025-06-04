"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateFunnelDialog from "./dialogs/create-funnel-dialog";
import { useAuth } from "@/contexts/auth-context";

const FunnelsHeader = () => {
  const { user } = useAuth();
  const [isCreateFunnelDialogOpen, setCreateFunnelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-end">
      <Button onClick={() => setCreateFunnelDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar funil
      </Button>

      <CreateFunnelDialog
        open={isCreateFunnelDialogOpen}
        onOpenChange={setCreateFunnelDialogOpen}
        userId={user.id}
      />
    </div>
  );
};

export default FunnelsHeader;
