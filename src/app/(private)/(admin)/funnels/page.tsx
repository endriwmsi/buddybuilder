import { getFunnels } from "./actions/funnel.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FunnelCard from "./components/funnel-card";
import FunnelsHeader from "./components/funnels-header";

const FunnelsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const funnels = await getFunnels(session.user.id);

  return (
    <div className="container mx-auto py-10">
      <FunnelsHeader />

      {funnels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">
            Você ainda não tem nenhum funil
          </h3>
          <p className="text-muted-foreground text-sm">
            Crie seu primeiro funil para começar a gerenciar seus projetos de
            marketing e vendas.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {funnels.map((funnel) => (
            <FunnelCard key={funnel.id} funnel={funnel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FunnelsPage;
