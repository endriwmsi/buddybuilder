import { Funnel } from "@/generated/prisma";
import Link from "next/link";
import { getFunnels } from "./actions/funnel.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FunnelsHeader from "./components/funnels-header";

export default async function FunnelsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const funnels = await getFunnels(session?.user.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <FunnelsHeader />

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {funnels.map((funnel: Funnel) => (
          <Link
            key={funnel.id}
            href={`/funnels/${funnel.id}`}
            className="group hover:border-primary relative rounded-lg border p-4"
          >
            <div className="flex flex-col gap-2">
              <h2 className="group-hover:text-primary font-semibold">
                {funnel.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {funnel.description || "Sem descrição"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
