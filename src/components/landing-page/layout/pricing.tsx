import { Button } from "@/components/ui/button";
import { PricingTable } from "../components/pricing-table";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Planos Flexíveis para Seu Negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano ideal para as necessidades da sua empresa, com
            opções para todos os tamanhos de negócio.
          </p>
        </div>

        <PricingTable />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Precisa de um plano personalizado para sua empresa? Entre em contato
            com nossa equipe.
          </p>
          <Button variant="outline" size="lg">
            Falar com Consultor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
