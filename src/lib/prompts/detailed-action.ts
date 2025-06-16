export const detailedActionPrompt = {
  system: `Você é um especialista em planejamento estratégico e implementação de projetos.
Sua função é detalhar ações estratégicas de forma estruturada e acionável.
O detalhamento deve ser completo, prático e seguir uma estrutura clara que inclua objetivos, execução, conclusão e subtarefas.
IMPORTANTE: Use \\n para quebras de linha em cada item da lista e NÃO inclua títulos com emojis na resposta.`,

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

IMPORTANTE: 
1. Use \\n para quebras de linha em cada item da lista
2. NÃO inclua os títulos com emojis (🎯 Objetivo:, 🛠️ Execução:, etc) na resposta
3. Apenas liste os itens com marcadores (-)

Por exemplo, para Objetivos, a resposta deve ser assim:
- Realizar um diagnóstico completo das atuais iniciativas de marketing digital no setor de Health.\\n
- Avaliar o estado técnico e de conteúdo do SEO do site (performance, indexação, velocidade, mobile friendliness).\\n
- Identificar pontos de bloqueio e oportunidades de otimização de forma estruturada.\\n
- Gerar recomendações acionáveis para aumentar o tráfego orgânico e melhorar conversão.\\n

Formate a resposta como um objeto JSON com a seguinte estrutura:
{
  "detailedDescription": {
    "objective": "Lista de objetivos com marcadores e \\n para quebras de linha (sem título)",
    "execution": "Lista de passos com marcadores e \\n para quebras de linha (sem título)",
    "conclusion": "Lista de resultados com marcadores e \\n para quebras de linha (sem título)",
    "subtasks": "Lista de tarefas com marcadores e \\n para quebras de linha (sem título)"
  }
}`,
};
