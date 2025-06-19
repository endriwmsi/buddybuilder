import { BusinessSector } from "@/generated/prisma";

export const sectorNames: Record<BusinessSector, string> = {
  [BusinessSector.ECOMMERCE]: "E-commerce",
  [BusinessSector.SAAS]: "SaaS",
  [BusinessSector.HEALTH]: "Saúde",
  [BusinessSector.FOOD]: "Alimentação",
  [BusinessSector.EDUCATION]: "Educação",
  [BusinessSector.OTHER]: "Outro",
};

export interface SectorQuestion {
  question: string;
  key: string;
  type?: "text" | "select" | "radio" | "checkbox";
  options?: { label: string; value: string }[];
}

export const sectorQuestions: Record<BusinessSector, SectorQuestion[]> = {
  [BusinessSector.ECOMMERCE]: [
    {
      question: "Quais categorias de produtos são mais lucrativas?",
      key: "Quais categorias de produtos são mais lucrativas?",
      type: "text",
    },
    {
      question: "Aplicam estratégias upsell cross-sell?",
      key: "Aplicam estratégias upsell cross-sell?",
      type: "select",
      options: [
        { label: "Não aplicamos", value: "Não aplicamos" },
        {
          label: "Aplicamos ocasionalmente",
          value: "Aplicamos ocasionalmente",
        },
        {
          label: "Temos processo estruturado",
          value: "Temos processo estruturado",
        },
      ],
    },
    {
      question: "Principais canais de venda",
      key: "Principais canais de venda",
      type: "text",
    },
    {
      question: "Volume médio de pedidos por mês",
      key: "Volume médio de pedidos por mês",
      type: "text",
    },
    {
      question: "Taxa média de abandono de carrinho",
      key: "Taxa média de abandono de carrinho",
      type: "text",
    },
    {
      question: "Trabalham com remarketing?",
      key: "Trabalham com remarketing?",
      type: "select",
      options: [
        { label: "Não utilizamos", value: "Não utilizamos" },
        {
          label: "Utilizamos ocasionalmente",
          value: "Utilizamos ocasionalmente",
        },
        {
          label: "Temos estratégia definida",
          value: "Temos estratégia definida",
        },
      ],
    },
    {
      question: "Existe uma estratégia de recuperação de Carrinho?",
      key: "Existe uma estratégia de recuperação de Carrinho?",
      type: "select",
      options: [
        { label: "Não temos estratégia", value: "Não temos estratégia" },
        { label: "Envio de emails básicos", value: "Envio de emails básicos" },
        {
          label: "Estratégia completa com automação",
          value: "Estratégia completa com automação",
        },
      ],
    },
  ],
  [BusinessSector.SAAS]: [
    {
      question: "Qual é o principal produto ou solução oferecida?",
      key: "Qual é o principal produto ou solução oferecida?",
      type: "text",
    },
    {
      question: "Qual é o modelo de receita?",
      key: "Qual é o modelo de receita?",
      type: "radio",
      options: [
        {
          label: "Assinatura recorrente (SaaS)",
          value: "Assinatura recorrente (SaaS)",
        },
        { label: "Licenciamento", value: "Licenciamento" },
        { label: "Freemium", value: "Freemium" },
        { label: "Transacional (por uso)", value: "Transacional (por uso)" },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "Qual é o ticket médio por cliente?",
      key: "Qual é o ticket médio por cliente?",
      type: "text",
    },
    {
      question: "Qual a taxa de churn mensal?",
      key: "Qual a taxa de churn mensal?",
      type: "text",
    },
    {
      question: "Quais canais de aquisição são mais eficientes?",
      key: "Quais canais de aquisição são mais eficientes?",
      type: "checkbox",
      options: [
        { label: "Marketing de conteúdo", value: "Marketing de conteúdo" },
        { label: "SEO", value: "SEO" },
        { label: "Cold outreach", value: "Cold outreach" },
        { label: "Eventos", value: "Eventos" },
        { label: "Parcerias", value: "Parcerias" },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "Vocês fazem expansão de receita em clientes atuais?",
      key: "Vocês fazem expansão de receita em clientes atuais?",
      type: "radio",
      options: [
        { label: "Não fazemos ativamente", value: "Não fazemos ativamente" },
        {
          label: "Sim, com upgrade de planos",
          value: "Sim, com upgrade de planos",
        },
        { label: "Sim, com venda cruzada", value: "Sim, com venda cruzada" },
        {
          label: "Sim, com modelo baseado em uso",
          value: "Sim, com modelo baseado em uso",
        },
        { label: "Outro", value: "Outro" },
      ],
    },
  ],
  [BusinessSector.HEALTH]: [
    {
      question:
        "Quais dos serviços oferecidos têm maior procura ou geram mais lucro?",
      key: "Quais dos serviços oferecidos têm maior procura ou geram mais lucro?",
      type: "text",
    },
    {
      question:
        "Sua clínica oferece outros serviços complementares no mesmo atendimento?",
      key: "Sua clínica oferece outros serviços complementares no mesmo atendimento?",
      type: "radio",
      options: [
        {
          label: "Não costumamos oferecer complementares",
          value: "Não costumamos oferecer complementares",
        },
        {
          label: "Oferecemos ocasionalmente, sem padrão",
          value: "Oferecemos ocasionalmente, sem padrão",
        },
        {
          label: "Temos práticas frequentes, mas informais",
          value: "Temos práticas frequentes, mas informais",
        },
        {
          label: "Temos estratégias estruturadas de complementares",
          value: "Temos estratégias estruturadas de complementares",
        },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "A empresa atende:",
      key: "A empresa atende:",
      type: "radio",
      options: [
        { label: "Apenas particular", value: "Apenas particular" },
        { label: "Apenas convênio", value: "Apenas convênio" },
        { label: "Ambos", value: "Ambos" },
      ],
    },
    {
      question: "Quais especialidades ou serviços são oferecidos?",
      key: "Quais especialidades ou serviços são oferecidos?",
      type: "text",
    },
    {
      question: "Como os pacientes costumam marcar consultas?",
      key: "Como os pacientes costumam marcar consultas?",
      type: "checkbox",
      options: [
        { label: "Telefone", value: "Telefone" },
        { label: "WhatsApp", value: "WhatsApp" },
        { label: "Site próprio", value: "Site próprio" },
        {
          label: "Aplicativos especializados (ex: Doctoralia)",
          value: "Aplicativos especializados (ex: Doctoralia)",
        },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "Existe alguma sazonalidade ou pico de demanda?",
      key: "Existe alguma sazonalidade ou pico de demanda?",
      type: "radio",
      options: [
        {
          label: "Sim, temos períodos específicos com alta procura",
          value: "Sim, temos períodos específicos com alta procura",
        },
        {
          label: "Não, a demanda é constante ao longo do ano",
          value: "Não, a demanda é constante ao longo do ano",
        },
      ],
    },
    {
      question:
        "Como vocês se relacionam com os pacientes fora do atendimento?",
      key: "Como vocês se relacionam com os pacientes fora do atendimento?",
      type: "text",
    },
  ],
  [BusinessSector.FOOD]: [
    {
      question: "Tipo de estabelecimento",
      key: "Tipo de estabelecimento",
      type: "select",
      options: [
        { label: "Restaurante", value: "Restaurante" },
        { label: "Fast Food", value: "Fast Food" },
        { label: "Cafeteria", value: "Cafeteria" },
        { label: "Food Truck", value: "Food Truck" },
        { label: "Delivery", value: "Delivery" },
        { label: "Bar", value: "Bar" },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "Quais os pratos ou produtos mais populares?",
      key: "Quais os pratos ou produtos mais populares?",
      type: "text",
    },
    {
      question: "Qual o ticket médio por cliente/pedido?",
      key: "Qual o ticket médio por cliente/pedido?",
      type: "text",
    },
    {
      question: "Trabalham com delivery?",
      key: "deliverySTrabalham com delivery?",
      type: "select",
      options: [
        { label: "Não trabalhamos", value: "Não trabalhamos" },
        {
          label: "Sim, com entregadores próprios",
          value: "Sim, com entregadores próprios",
        },
        {
          label: "Sim, através de aplicativos",
          value: "Sim, através de aplicativos",
        },
        { label: "Ambos", value: "Ambos" },
      ],
    },
    {
      question: "Como lidam com sazonalidade (dias/horários de pico)?",
      key: "Como lidam com sazonalidade (dias/horários de pico)?",
      type: "text",
    },
    {
      question: "Têm estratégia de fidelização de clientes?",
      key: "Têm estratégia de fidelização de clientes?",
      type: "select",
      options: [
        { label: "Não temos", value: "Não temos" },
        { label: "Cartão fidelidade", value: "Cartão fidelidade" },
        {
          label: "Descontos para clientes recorrentes",
          value: "Descontos para clientes recorrentes",
        },
        { label: "Programa de pontos", value: "Programa de pontos" },
        { label: "Outro", value: "Outro" },
      ],
    },
  ],
  [BusinessSector.EDUCATION]: [
    {
      question:
        "Quais cursos ou programas têm mais procura ou são mais lucrativos?",
      key: "Quais cursos ou programas têm mais procura ou são mais lucrativos?",
      type: "text",
    },
    {
      question: "Vocês costumam oferecer serviços ou pacotes complementares?",
      key: "Vocês costumam oferecer serviços ou pacotes complementares?",
      type: "select",
      options: [
        {
          label: "Não oferecemos complementares",
          value: "Não oferecemos complementares",
        },
        {
          label: "Sim, mas sem padronização",
          value: "Sim, mas sem padronização",
        },
        {
          label: "Sim, de forma estruturada",
          value: "Sim, de forma estruturada",
        },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      question: "A instituição é:",
      key: "A instituição é:",
      type: "select",
      options: [
        { label: "Presencial", value: "Presencial" },
        { label: "Online", value: "Online" },
        { label: "Híbrida", value: "Híbrida" },
      ],
    },
    {
      question: "Qual o ticket médio por aluno?",
      key: "Qual o ticket médio por aluno?",
      type: "text",
    },
    {
      question: "Quantos alunos estão ativos atualmente?",
      key: "Quantos alunos estão ativos atualmente?",
      type: "text",
    },
    {
      question: "Como vocês atraem novos alunos hoje?",
      key: "Como vocês atraem novos alunos hoje?",
      type: "text",
    },
    {
      question: "Como lidam com evasão?",
      key: "Como lidam com evasão?",
      type: "select",
      options: [
        {
          label: "Não temos estratégias específicas",
          value: "Não temos estratégias específicas",
        },
        {
          label: "Usamos comunicação direta (e-mail, WhatsApp)",
          value: "Usamos comunicação direta (e-mail, WhatsApp)",
        },
        {
          label: "Temos plano de retenção estruturado",
          value: "Temos plano de retenção estruturado",
        },
        { label: "Outro", value: "Outro" },
      ],
    },
  ],
  [BusinessSector.OTHER]: [
    {
      question: "Quais são os principais produtos ou serviços oferecidos?",
      key: "Quais são os principais produtos ou serviços oferecidos?",
      type: "text",
    },
    {
      question: "Como funciona o modelo de negócio?",
      key: "Como funciona o modelo de negócio?",
      type: "text",
    },
    {
      question: "Quem é o cliente ideal?",
      key: "Quem é o cliente ideal?",
      type: "text",
    },
    {
      question: "Como vocês adquirem novos clientes?",
      key: "Como vocês adquirem novos clientes?",
      type: "text",
    },
    {
      question: "Quais são os maiores desafios do negócio atualmente?",
      key: "Quais são os maiores desafios do negócio atualmente?",
      type: "text",
    },
    {
      question: "Quais são as principais metas para os próximos 12 meses?",
      key: "Quais são as principais metas para os próximos 12 meses?",
      type: "text",
    },
  ],
};

export const marketingMaturityOptions = [
  {
    value: "Não temos nada estruturado ainda",
    label: "Não temos nada estruturado ainda",
    goals: [
      {
        value: "Criar presença online básica (perfis em redes sociais)",
        label: "Criar presença online básica (perfis em redes sociais)",
      },
      {
        value: "Estabelecer identidade visual",
        label: "Estabelecer identidade visual",
      },
      {
        value: "Desenvolver estratégia inicial de conteúdo",
        label: "Desenvolver estratégia inicial de conteúdo",
      },
      {
        value: "Criar primeiras peças de comunicação",
        label: "Criar primeiras peças de comunicação",
      },
      {
        value: "Organizar informações de contatos e inicio de base de leads",
        label: "Organizar informações de contatos e inicio de base de leads",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Fazemos algumas ações pontuais sem estratégia clara",
    label: "Fazemos algumas ações pontuais sem estratégia clara",
    goals: [
      {
        value: "Estruturar calendário de publicações para redes sociais",
        label: "Estruturar calendário de publicações para redes sociais",
      },
      {
        value: "Implementar estratégia básica de SEO",
        label: "Implementar estratégia básica de SEO",
      },
      {
        value: "Iniciar campanhas de mídia paga em escala reduzida",
        label: "Iniciar campanhas de mídia paga em escala reduzida",
      },
      {
        value: "Desenvolver primeiras automações de email marketing",
        label: "Desenvolver primeiras automações de email marketing",
      },
      {
        value: "Organizar fluxo de geração de leads",
        label: "Organizar fluxo de geração de leads",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Temos ações recorrentes, mas sem métricas e indicadores definidos",
    label: "Temos ações recorrentes, mas sem métricas e indicadores definidos",
    goals: [
      {
        value: "Implementar dashboard de métricas de marketing",
        label: "Implementar dashboard de métricas de marketing",
      },
      {
        value: "Otimizar campanhas existentes baseados em dados",
        label: "Otimizar campanhas existentes baseados em dados",
      },
      {
        value: "Criar segmentação avançada de base de leads/clientes",
        label: "Criar segmentação avançada de base de leads/clientes",
      },
      {
        value: "Estruturar estratégia de nutrição de leads",
        label: "Estruturar estratégia de nutrição de leads",
      },
      {
        value: "Implementar estratégia de remarketing",
        label: "Implementar estratégia de remarketing",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Temos ações consistentes com indicadores claros e acompanhamento",
    label: "Temos ações consistentes com indicadores claros e acompanhamento",
    goals: [
      {
        value: "Desenvolver atruibuição multi-canal avançada",
        label: "Desenvolver atruibuição multi-canal avançada",
      },
      {
        value: "Implementar testes A/B em todas as campanhas",
        label: "Implementar testes A/B em todas as campanhas",
      },
      {
        value: "Otimizar funil de conversão baseado em dados",
        label: "Otimizar funil de conversão baseado em dados",
      },
      {
        value: "Estruturar estratégia de marketing baseada em conta (ABM)",
        label: "Estruturar estratégia de marketing baseada em conta (ABM)",
      },
      {
        value: "Implementar sistema de previsão de resultados",
        label: "Implementar sistema de previsão de resultados",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
];

export const commercialMaturityOptions = [
  {
    value: "Não temos processo de vendas estruturado",
    label: "Não temos processo de vendas estruturado",
    goals: [
      {
        value: "Estruturar processo básico de vendas",
        label: "Estruturar processo básico de vendas",
      },
      {
        value: "Implementar qualificação inicial de leads",
        label: "Implementar qualificação inicial de leads",
      },
      {
        value: "Criar primeiros scripts de vendas",
        label: "Criar primeiros scripts de vendas",
      },
      {
        value: "Organizar informações de clientes e oportunidades",
        label: "Organizar informações de clientes e oportunidades",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Temos algumas práticas de vendas, mas sem padronização",
    label: "Temos algumas práticas de vendas, mas sem padronização",
    goals: [
      {
        value: "Estruturar processo completo de vendas",
        label: "Estruturar processo completo de vendas",
      },
      {
        value: "Implementar gestão de pipeline",
        label: "Implementar gestão de pipeline",
      },
      {
        value: "Desenvolver treinamento básico de vendas",
        label: "Desenvolver treinamento básico de vendas",
      },
      { value: "Implementar CRM básico", label: "Implementar CRM básico" },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Temos processo estruturado, mas sem métricas claras",
    label: "Temos processo estruturado, mas sem métricas claras",
    goals: [
      {
        value: "Implementar dashboard de métricas de vendas",
        label: "Implementar dashboard de métricas de vendas",
      },
      {
        value: "Desenvolver previsão de vendas",
        label: "Desenvolver previsão de vendas",
      },
      { value: "Otimizar uso do CRM", label: "Otimizar uso do CRM" },
      {
        value: "Implementar automações de vendas",
        label: "Implementar automações de vendas",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    value: "Temos processo maduro com métricas e acompanhamento",
    label: "Temos processo maduro com métricas e acompanhamento",
    goals: [
      {
        value: "Implementar analytics avançado de vendas",
        label: "Implementar analytics avançado de vendas",
      },
      {
        value: "Desenvolver IA para vendas",
        label: "Desenvolver IA para vendas",
      },
      { value: "Estruturar RevOps", label: "Estruturar RevOps" },
      {
        value: "Otimizar processo de vendas com IA",
        label: "Otimizar processo de vendas com IA",
      },
      { value: "Outro", label: "Outro" },
    ],
  },
];
