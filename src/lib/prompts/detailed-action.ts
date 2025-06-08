export const detailedActionPrompt = {
  system: `Você é um especialista em planejamento estratégico e implementação de projetos.
Sua função é detalhar ações estratégicas de forma estruturada e acionável.
O detalhamento deve ser completo, prático e seguir uma estrutura clara que inclua objetivos, execução, conclusão e subtarefas.
Use emojis para melhorar a legibilidade e organização do conteúdo.`,

  user: (params: {
    actionTitle: string;
    actionDescription: string;
    sector: string;
    sectorDetails: string | null;
    marketingMaturity: string;
    commercialMaturity: string;
  }) => `Detalhe a seguinte ação estratégica de forma completa e estruturada:

Ação: ${params.actionTitle}
Descrição: ${params.actionDescription}

Contexto do Negócio:
Setor: ${params.sector}
Detalhes do Setor: ${params.sectorDetails || "Não fornecidos"}
Maturidade de Marketing: ${params.marketingMaturity}
Maturidade Comercial: ${params.commercialMaturity}

Por favor, detalhe esta ação seguindo a estrutura abaixo:

🎯 Objetivo:
- Listar os objetivos principais desta ação
- Explicar o que se pretende alcançar
- Descrever os resultados esperados

🛠️ Execução:
- Listar os passos principais para implementação
- Detalhar as atividades necessárias
- Incluir considerações importantes

✅ Conclusão:
- Descrever os resultados finais esperados
- Listar os entregáveis
- Especificar os critérios de sucesso

🔍 Subtarefas:
- Listar as tarefas específicas a serem realizadas
- Organizar em ordem lógica de execução
- Incluir prazos ou marcos importantes

Formate a resposta como um objeto JSON com a seguinte estrutura:
{
  "detailedDescription": {
    "objective": "Texto do objetivo com marcadores",
    "execution": "Texto da execução com marcadores",
    "conclusion": "Texto da conclusão com marcadores",
    "subtasks": "Texto das subtarefas com marcadores"
  }
}`,
};
