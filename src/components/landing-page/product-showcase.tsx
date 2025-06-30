"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const centerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 dark:bg-gray-950"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-400/10"
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
        className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl dark:bg-purple-400/10"
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
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Main Showcase */}
          <motion.div className="mb-16 text-center" variants={centerVariants}>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="text-gray-900 dark:text-white">Veja o </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vector One
              </span>
              <span className="text-gray-900 dark:text-white"> em Ação</span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              Experimente o poder da automação de vendas alimentada por IA com
              nossa interface intuitiva projetada para equipes de vendas
              modernas.
            </p>
          </motion.div>

          {/* Main Product Image */}
          <motion.div className="mb-20" variants={centerVariants}>
            <div className="relative mx-auto max-w-6xl">
              <motion.div
                className="rounded-3xl border border-gray-200/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8 backdrop-blur-sm dark:border-gray-800/30 dark:from-blue-600/20 dark:to-purple-600/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="overflow-hidden rounded-2xl bg-gray-900 shadow-2xl dark:bg-gray-800"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2 bg-gray-800 p-4 dark:bg-gray-700">
                    <motion.div
                      className="h-3 w-3 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.div
                      className="h-3 w-3 rounded-full bg-yellow-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.3,
                      }}
                    />
                    <motion.div
                      className="h-3 w-3 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.6,
                      }}
                    />
                  </div>
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                    <div className="text-center">
                      <motion.div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0.3)",
                            "0 0 0 20px rgba(255, 255, 255, 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Play className="ml-1 h-8 w-8 text-white" />
                      </motion.div>
                      <p className="text-lg text-white/80">
                        Demonstração Interativa do Produto
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left Side - Dashboard Preview */}
            <motion.div variants={leftVariants}>
              <motion.div
                className="rounded-2xl border border-gray-200/50 bg-white p-8 shadow-xl dark:border-gray-700/50 dark:bg-gray-800/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="h-4 w-4 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Dashboard ao Vivo
                    </span>
                  </div>
                  <div className="space-y-3">
                    <motion.div
                      className="h-3 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <motion.div
                      className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    />
                    <motion.div
                      className="h-3 w-5/6 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: "83.333333%" }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <motion.div
                      className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        R$ 127K
                      </motion.div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Receita
                      </div>
                    </motion.div>
                    <motion.div
                      className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        89%
                      </motion.div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Conversão
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div variants={rightVariants}>
              <h3 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Analytics e Insights em Tempo Real
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Obtenha visibilidade instantânea do desempenho de suas vendas
                com analytics alimentados por IA que ajudam você a tomar
                decisões baseadas em dados e otimizar suas estratégias em tempo
                real.
              </p>
              <div className="mb-8 space-y-4">
                {[
                  "Acompanhamento de performance ao vivo",
                  "Previsão preditiva de receita",
                  "Relatórios automatizados",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div
                      className={`h-2 w-2 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-purple-500"
                            : "bg-green-500"
                      }`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.3,
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Explorar Recursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
