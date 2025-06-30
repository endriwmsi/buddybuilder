"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Como funciona a geração de playbooks alimentada por IA?",
    answer:
      "Nossa IA analisa seu setor, mercado-alvo e dados históricos de vendas para gerar playbooks personalizados com estratégias comprovadas, técnicas de tratamento de objeções e fluxos de conversa adaptados às necessidades específicas do seu negócio.",
  },
  {
    question: "Posso integrar o Vector One com meu CRM existente?",
    answer:
      "Sim! O Vector One se integra com mais de 500 ferramentas populares incluindo Salesforce, HubSpot, Pipedrive e muitas outras. Também fornecemos webhooks e APIs para integrações personalizadas.",
  },
  {
    question: "Que tipo de fluxos de trabalho de automação posso criar?",
    answer:
      "Você pode automatizar pontuação de leads, sequências de email, atribuição de tarefas, lembretes de acompanhamento, entrada de dados, geração de relatórios e muito mais. Nosso construtor de fluxo de trabalho visual facilita a criação de automações complexas sem codificação.",
  },
  {
    question: "Meus dados estão seguros com o Vector One?",
    answer:
      "Absolutamente. Usamos segurança de nível empresarial com conformidade SOC 2, criptografia de ponta a ponta e auditorias de segurança regulares. Seus dados são armazenados em data centers seguros e geograficamente distribuídos.",
  },
  {
    question: "Com que rapidez minha equipe pode começar?",
    answer:
      "A maioria das equipes está funcionando em 24 horas. Fornecemos onboarding guiado, assistência na migração de dados e suporte dedicado para garantir uma transição suave.",
  },
  {
    question: "Quais opções de suporte estão disponíveis?",
    answer:
      "Oferecemos suporte por email para todos os planos, suporte prioritário para planos Profissional e gerenciamento de conta dedicado para clientes Empresariais. Também fornecemos documentação extensa e tutoriais em vídeo.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    hidden: { opacity: 0, y: 30 },
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
            <span className="text-gray-900 dark:text-white">Perguntas </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Tudo que você precisa saber sobre o Vector One. Não encontrou o que
            está procurando? Entre em contato com nossa equipe de suporte.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-4 overflow-hidden rounded-2xl border border-gray-200/50 bg-white backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/50"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <span className="pr-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <motion.div
                      className="px-8 pb-6"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="dark:text-gray-30 mt-4 leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
