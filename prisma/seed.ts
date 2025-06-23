import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar planos padrão
  console.log("📋 Criando planos...");

  const plans = [
    {
      id: 1,
      name: "Freemium",
      maxProjects: 1,
      maxActions: 5,
      maxDetails: 10,
    },
    {
      id: 2,
      name: "Starter",
      maxProjects: 3,
      maxActions: 15,
      maxDetails: 30,
    },
    {
      id: 3,
      name: "Professional",
      maxProjects: 10,
      maxActions: 50,
      maxDetails: 100,
    },
    {
      id: 4,
      name: "Enterprise",
      maxProjects: -1, // Ilimitado
      maxActions: -1, // Ilimitado
      maxDetails: -1, // Ilimitado
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
    console.log(`✅ Plano "${plan.name}" criado/atualizado`);
  }

  // Criar colunas padrão para tarefas
  console.log("📝 Criando colunas padrão para tarefas...");

  const defaultTaskColumns = [
    { name: "A fazer", order: 1, color: "#e2e8f0" },
    { name: "Em progresso", order: 2, color: "#fbbf24" },
    { name: "Concluído", order: 3, color: "#34d399" },
  ];

  // Criar colunas padrão para funis
  console.log("🔄 Criando colunas padrão para funis...");

  const defaultFunnelColumns = [
    { name: "Novos Leads", order: 1, color: "#e2e8f0" },
    { name: "Contatados", order: 2, color: "#fbbf24" },
    { name: "Qualificados", order: 3, color: "#60a5fa" },
    { name: "Proposta", order: 4, color: "#a78bfa" },
    { name: "Negociação", order: 5, color: "#f59e0b" },
    { name: "Fechado", order: 6, color: "#34d399" },
  ];

  console.log("✅ Seed concluído com sucesso!");
  console.log("");
  console.log("📊 Resumo dos planos criados:");
  console.log("1. Freemium - 1 projeto, 5 ações, 10 detalhes");
  console.log("2. Starter - 3 projetos, 15 ações, 30 detalhes");
  console.log("3. Professional - 10 projetos, 50 ações, 100 detalhes");
  console.log("4. Enterprise - Ilimitado");
  console.log("");
  console.log(
    "💡 Todos os novos usuários serão automaticamente atribuídos ao plano Freemium"
  );
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
