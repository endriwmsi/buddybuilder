"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Database,
  Workflow,
  TrendingUp,
  Webhook,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Playbooks Estratégicos com IA",
    description:
      "Gere estratégias de vendas baseadas em dados e playbooks personalizados para seu setor e mercado-alvo usando algoritmos avançados de IA.",
  },
  {
    icon: Database,
    title: "CRM Inteligente",
    description:
      "Construa e gerencie relacionamentos com clientes com insights alimentados por IA, entrada de dados automatizada e pontuação preditiva de leads.",
  },
  {
    icon: Workflow,
    title: "Automação Inteligente",
    description:
      "Crie fluxos de trabalho inteligentes que se adaptam ao seu processo de vendas, automatize tarefas repetitivas e dispare ações baseadas no comportamento do cliente.",
  },
  {
    icon: TrendingUp,
    title: "Performance Financeira",
    description:
      "Monitore receita, acompanhe KPIs e obtenha insights financeiros em tempo real com dashboards personalizáveis e relatórios automatizados.",
  },
  {
    icon: Webhook,
    title: "Integrações Externas",
    description:
      "Conecte-se com mais de 500 serviços externos via webhooks, APIs e integrações nativas para centralizar seu ecossistema de vendas.",
  },
  {
    icon: BarChart3,
    title: "Funil de Vendas Visual",
    description:
      "Visualize todo o seu pipeline de vendas com funis interativos, rastreamento de conversão e identificação de gargalos.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900/50"
    >
      {/* Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tudo Que Você Precisa
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Para Escalar Suas Vendas
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Nossa plataforma abrangente combina inteligência de IA com
            ferramentas práticas para transformar como você aborda vendas e
            marketing.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="group h-full rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
