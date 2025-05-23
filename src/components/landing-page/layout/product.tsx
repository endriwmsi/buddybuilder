import { Check } from "lucide-react";
import Image from "next/image";

const Product = () => {
  return (
    <section id="product" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Conheça Nossa Plataforma
          </h2>
          <p className="text-muted-foreground text-lg">
            Uma interface intuitiva e poderosa para transformar sua gestão de
            marketing e processos comerciais.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h3 className="mb-4 text-2xl font-bold">Dashboard Inteligente</h3>
            <p className="text-muted-foreground mb-6">
              Visualize todos os seus KPIs importantes em um único lugar, com
              insights gerados por IA para ajudar na tomada de decisões.
            </p>
            <ul className="space-y-2">
              {[
                "Visão 360° do desempenho",
                "Alertas inteligentes",
                "Previsões baseadas em dados",
                "Recomendações personalizadas",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="from-primary/10 order-1 rounded-xl bg-gradient-to-br to-purple-500/10 p-4 md:order-2">
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Dashboard Inteligente"
              width={800}
              height={500}
              className="rounded-lg border shadow-lg"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="from-primary/10 rounded-xl bg-gradient-to-br to-purple-500/10 p-4">
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Automação de Fluxos"
              width={800}
              height={500}
              className="rounded-lg border shadow-lg"
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Automação de Fluxos</h3>
            <p className="text-muted-foreground mb-6">
              Crie fluxos de trabalho personalizados com nossa interface
              drag-and-drop e automatize processos complexos sem precisar de
              código.
            </p>
            <ul className="space-y-2">
              {[
                "Interface visual intuitiva",
                "Integração com mais de 100 ferramentas",
                "Automações condicionais avançadas",
                "Monitoramento em tempo real",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
