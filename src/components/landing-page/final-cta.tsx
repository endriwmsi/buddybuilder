"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-24"
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <motion.div
              className="mb-8 inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm dark:bg-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-300 dark:text-yellow-200" />
              </motion.div>
              <span className="text-sm font-medium text-white/90">
                Oferta por Tempo Limitado
              </span>
            </motion.div>
          </motion.div>

          <motion.h2
            className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-6xl"
            variants={itemVariants}
          >
            Pronto para Transformar Seu Processo de Vendas?
          </motion.h2>

          <motion.p
            className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90 dark:text-white/95"
            variants={itemVariants}
          >
            Junte-se a milhares de equipes de vendas que já revolucionaram sua
            abordagem com estratégias alimentadas por IA. Comece seu teste
            gratuito hoje e veja resultados na primeira semana.
          </motion.p>

          <motion.div
            className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-gray-100"
              >
                Começar Teste Grátis
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 px-8 py-4 text-lg text-white hover:bg-white/10"
              >
                Agendar Demonstração
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3"
            variants={containerVariants}
          >
            {[
              { number: "14 Dias", label: "Teste Grátis" },
              { number: "Sem Taxas", label: "de Configuração" },
              { number: "24/7", label: "Suporte Disponível" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.5 }
                  }
                  transition={{
                    delay: 1 + index * 0.2,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {item.number}
                </motion.div>
                <div className="text-white/80 dark:text-white/90">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
