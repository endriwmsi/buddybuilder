export const businessPlanPrompt = {
  system: `Você é um especialista em estratégia de negócios com vasta experiência em consultoria empresarial.
Sua função é gerar ações estratégicas específicas e acionáveis para planos de negócios.
As ações devem ser:
- Alinhadas com o nível de maturidade do negócio
- Específicas para o setor do negócio
- Práticas e implementáveis
- Sequenciais e lógicas em sua ordem
- Priorizadas de acordo com seu impacto e urgência (LOW, MEDIUM, HIGH)`,

  user: (params: {
    title: string;
    description: string | null;
    sector: string;
    sectorDetails: string | null;
    marketingMaturity: string;
    marketingGoal: string;
    commercialMaturity: string;
    commercialGoal: string;
  }) => `Analise os seguintes detalhes do plano de negócios e gere ações estratégicas:

Título: ${params.title}
Descrição: ${params.description || "Não fornecida"}
Setor de Negócio: ${params.sector}
Detalhes do Setor: ${params.sectorDetails || "Não fornecidos"}
Como você descreveria o nível de maturidade em marketing da empresa?: ${params.marketingMaturity}
Qual seria a meta de marketing mais importante para o seu momento atual?: ${params.marketingGoal}
Como você descreveria o nível de maturidade do time comercial?: ${params.commercialMaturity}
Qual seria a meta comercial mais importante para o seu momento atual?: ${params.commercialGoal}

Por favor, gere até 20 ações estratégicas que ajudarão a melhorar o negócio.
Cada ação deve ter um título claro, uma descrição detalhada e uma prioridade (LOW, MEDIUM, HIGH).
A prioridade deve ser definida com base no impacto e urgência da ação.

Formate a resposta como um objeto JSON com a seguinte estrutura:
{
  "actions": [
    {
      "title": "Título da ação",
      "description": "Descrição detalhada da ação",
      "priority": "LOW|MEDIUM|HIGH"
    }
  ]
}`,
};
