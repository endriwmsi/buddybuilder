import { TestimonialCard } from "../components/testimonial-card";

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground text-lg">
            Empresas de diversos setores já transformaram seus resultados com
            nossa plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <TestimonialCard
            quote="A plataforma revolucionou nossa estratégia de marketing. Conseguimos aumentar nossa conversão em 45% em apenas 3 meses."
            author="Ana Silva"
            role="Diretora de Marketing, TechCorp"
            avatarUrl="/placeholder.svg?height=100&width=100"
          />
          <TestimonialCard
            quote="A automação de processos nos economizou mais de 20 horas semanais. A equipe agora foca no estratégico em vez de tarefas operacionais."
            author="Carlos Mendes"
            role="CEO, Inovativa Inc."
            avatarUrl="/placeholder.svg?height=100&width=100"
          />
          <TestimonialCard
            quote="Os insights gerados pela IA nos ajudaram a identificar oportunidades que nunca teríamos visto por conta própria. Resultado: 37% de aumento em receita."
            author="Patrícia Oliveira"
            role="CMO, Global Solutions"
            avatarUrl="/placeholder.svg?height=100&width=100"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
