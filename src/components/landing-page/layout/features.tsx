import { FeatureCard } from "../components/feature-card";

const Features = () => {
  return (
    <section id="features" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Recursos Poderosos para seu Negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Nossa plataforma oferece ferramentas avançadas para otimizar seus
            processos de marketing e vendas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="Brain"
            title="Automação Inteligente"
            description="Automatize tarefas repetitivas e fluxos de trabalho com nossa IA avançada, liberando sua equipe para focar no estratégico."
          />
          <FeatureCard
            icon="BarChart"
            title="Análise Preditiva"
            description="Antecipe tendências de mercado e comportamento do cliente com análises preditivas baseadas em machine learning."
          />
          <FeatureCard
            icon="Users"
            title="Segmentação Avançada"
            description="Segmente seu público com precisão usando algoritmos de IA que identificam padrões ocultos nos dados."
          />
          <FeatureCard
            icon="MessageSquare"
            title="Comunicação Personalizada"
            description="Crie mensagens personalizadas em escala com nossa tecnologia de geração de conteúdo por IA."
          />
          <FeatureCard
            icon="Workflow"
            title="Fluxos de Trabalho Otimizados"
            description="Desenhe e otimize processos comerciais com sugestões inteligentes baseadas em dados reais."
          />
          <FeatureCard
            icon="LineChart"
            title="Relatórios em Tempo Real"
            description="Visualize o desempenho de suas campanhas e processos em tempo real com dashboards interativos."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
