import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

const Cta = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="from-primary/10 mx-auto max-w-4xl rounded-2xl border bg-gradient-to-r to-purple-500/10 p-8 text-center shadow-lg md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Pronto para transformar seu marketing?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Entre para nossa lista de espera e seja um dos primeiros a
            experimentar o futuro da gestão de marketing com IA.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Entrar na Lista de Espera <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Agendar Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
