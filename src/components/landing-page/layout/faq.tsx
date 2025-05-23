import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <section id="faq" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre nossa plataforma e como ela pode ajudar seu
            negócio.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Como a IA melhora os processos de marketing?
              </AccordionTrigger>
              <AccordionContent>
                Nossa plataforma utiliza algoritmos avançados de inteligência
                artificial para analisar dados, identificar padrões e fazer
                previsões que humanos dificilmente conseguiriam. Isso permite
                otimização de campanhas, personalização em escala e automação de
                tarefas repetitivas, liberando sua equipe para focar no
                estratégico.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Quanto tempo leva para implementar a plataforma?
              </AccordionTrigger>
              <AccordionContent>
                A implementação básica pode ser feita em apenas 48 horas. Para
                integrações mais complexas com seus sistemas existentes, nosso
                time de onboarding trabalha com você para criar um cronograma
                personalizado, geralmente entre 1-3 semanas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                A plataforma se integra com as ferramentas que já uso?
              </AccordionTrigger>
              <AccordionContent>
                Sim! Oferecemos mais de 100 integrações nativas com as
                principais ferramentas de marketing, vendas e gestão de projetos
                do mercado. Para sistemas proprietários, nossa API aberta
                permite desenvolver integrações personalizadas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Como funciona o suporte técnico?
              </AccordionTrigger>
              <AccordionContent>
                Todos os planos incluem suporte por email com tempo de resposta
                de até 24h. Planos Business e Enterprise contam com suporte
                prioritário por chat em tempo real e gerente de conta dedicado
                para garantir o sucesso da sua implementação.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Meus dados estão seguros na plataforma?
              </AccordionTrigger>
              <AccordionContent>
                Absolutamente. Seguimos os mais rigorosos padrões de segurança,
                com certificação ISO 27001 e conformidade com LGPD e GDPR. Todos
                os dados são criptografados em trânsito e em repouso, e você
                mantém total propriedade sobre suas informações.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Posso cancelar minha assinatura a qualquer momento?
              </AccordionTrigger>
              <AccordionContent>
                Sim, não exigimos contratos de longo prazo. Você pode cancelar
                sua assinatura a qualquer momento, e oferecemos garantia de
                devolução do dinheiro nos primeiros 14 dias para que você possa
                testar nossa plataforma sem riscos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                Qual o tamanho ideal de empresa para usar a plataforma?
              </AccordionTrigger>
              <AccordionContent>
                Nossa plataforma é escalável e atende desde startups até grandes
                corporações. Temos planos específicos para cada tamanho de
                negócio, com recursos que crescem conforme suas necessidades.
                Empresas com equipes de marketing de 3+ pessoas já conseguem
                obter ROI significativo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
