import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";

export function PricingTable() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 199",
      period: "/mês",
      description:
        "Ideal para pequenas empresas começando com marketing digital.",
      features: [
        { name: "Até 3 usuários", included: true },
        { name: "Automação básica", included: true },
        { name: "Análise de dados", included: true },
        { name: "Integrações limitadas (5)", included: true },
        { name: "Suporte por email", included: true },
        { name: "Segmentação avançada", included: false },
        { name: "IA para geração de conteúdo", included: false },
        { name: "API acesso", included: false },
        { name: "Gerente de conta dedicado", included: false },
      ],
      cta: "Começar Agora",
      popular: false,
    },
    {
      name: "Professional",
      price: "R$ 499",
      period: "/mês",
      description:
        "Para equipes em crescimento que precisam de recursos avançados.",
      features: [
        { name: "Até 10 usuários", included: true },
        { name: "Automação avançada", included: true },
        { name: "Análise preditiva", included: true },
        { name: "Integrações ilimitadas", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Segmentação avançada", included: true },
        { name: "IA para geração de conteúdo", included: true },
        { name: "API acesso", included: false },
        { name: "Gerente de conta dedicado", included: false },
      ],
      cta: "Escolher Professional",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "R$ 1.299",
      period: "/mês",
      description:
        "Solução completa para grandes empresas com necessidades complexas.",
      features: [
        { name: "Usuários ilimitados", included: true },
        { name: "Automação personalizada", included: true },
        { name: "Análise preditiva avançada", included: true },
        { name: "Integrações personalizadas", included: true },
        { name: "Suporte 24/7", included: true },
        { name: "Segmentação avançada", included: true },
        { name: "IA para geração de conteúdo", included: true },
        { name: "API acesso completo", included: true },
        { name: "Gerente de conta dedicado", included: true },
      ],
      cta: "Falar com Vendas",
      popular: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`bg-background/60 flex flex-col overflow-hidden rounded-xl border backdrop-blur-sm ${
            plan.popular ? "ring-primary shadow-lg ring-2" : ""
          }`}
        >
          {plan.popular && (
            <div className="bg-primary text-primary-foreground px-4 py-1 text-center text-sm font-medium">
              Mais Popular
            </div>
          )}

          <div className="flex-grow p-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-1">{plan.period}</span>
            </div>
            <p className="text-muted-foreground mt-2">{plan.description}</p>

            <ul className="mt-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <X className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <span
                    className={feature.included ? "" : "text-muted-foreground"}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t p-6">
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              asChild
            >
              <Link href="/waitlist">{plan.cta}</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
