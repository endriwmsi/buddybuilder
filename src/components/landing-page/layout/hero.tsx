import Image from "next/image";
import { PartnersCarousel } from "../components/partners-carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-[0.02]" />
        <div className="from-background to-background/80 absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
            Transforme sua gestão de marketing com Inteligência Artificial
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Automatize processos, aumente a produtividade e tome decisões
            baseadas em dados com nossa plataforma completa de gestão
            potencializada por IA.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Entrar na Lista de Espera <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Agendar Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mt-16">
          <div className="pointer-events-none absolute inset-0 z-10" />
          <div className="relative z-0 overflow-hidden rounded-xl border shadow-2xl">
            <Image
              src="/images/work-item-dark.webp"
              alt="Dashboard da plataforma"
              width={1200}
              height={600}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-16 pt-8">
          <div className="bg-background/30 rounded-xl border p-8 shadow-lg backdrop-blur-lg">
            <h3 className="text-muted-foreground mb-6 text-center text-sm font-medium">
              EMPRESAS QUE CONFIAM EM NOSSA TECNOLOGIA
            </h3>
            <PartnersCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
