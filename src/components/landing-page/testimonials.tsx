"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP de Vendas",
    company: "TechFlow Inc",
    content:
      "O Vector One transformou completamente nosso processo de vendas. Vimos um aumento de 40% nas taxas de conversão no primeiro trimestre.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Marcus Rodriguez",
    role: "Diretor de Vendas",
    company: "Growth Dynamics",
    content:
      "Os playbooks alimentados por IA são revolucionários. Nossa equipe agora tem estratégias claras e baseadas em dados para cada prospecto.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emily Watson",
    role: "CEO",
    company: "StartupX",
    content:
      "Finalmente, uma plataforma que realmente entende nosso fluxo de trabalho de vendas. Os recursos de automação nos economizaram 20 horas por semana.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
];

export default function Testimonials() {
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="testimonials"
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
            <span className="text-gray-900 dark:text-white">Amado por </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Equipes de Vendas
            </span>
            <span className="text-gray-900 dark:text-white">
              {" "}
              no Mundo Todo
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Junte-se a milhares de profissionais de vendas que transformaram
            seus resultados com o Vector One.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="relative h-full rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 0.1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/20 dark:text-blue-400/30" />
                </motion.div>

                {/* Rating */}
                <div className="mb-6 flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.7 + index * 0.1 + i * 0.05,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Star className="h-5 w-5 fill-current text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <motion.p
                  className="mb-6 leading-relaxed text-gray-700 italic dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  "{testimonial.content}"
                </motion.p>

                {/* Author */}
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} na {testimonial.company}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            { number: "10.000+", label: "Usuários Ativos" },
            { number: "40%", label: "Aumento Médio na Conversão" },
            { number: "98%", label: "Satisfação do Cliente" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={statsVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.5 + index * 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
