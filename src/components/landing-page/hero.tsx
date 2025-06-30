"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const isInView = useInView(heroRef, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () =>
        heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const partners = [
    "Salesforce",
    "HubSpot",
    "Slack",
    "Microsoft",
    "Google",
    "Zapier",
    "Stripe",
    "Shopify",
    "Notion",
    "Airtable",
  ];

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
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pt-24 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20"
    >
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </motion.div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main Heading */}
          <motion.h1
            className="mb-6 text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Gestão de Projetos com IA
            </motion.span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Que realmente funciona
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl dark:text-gray-300"
            variants={itemVariants}
          >
            Gere playbooks estratégicos, automatize fluxos de trabalho e
            visualize todo o seu funil de vendas em uma plataforma inteligente
            que cresce com o seu negócio.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg shadow-lg hover:from-blue-700 hover:to-purple-700"
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
                className="rounded-xl border-2 px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demonstração
              </Button>
            </motion.div>
          </motion.div>

          {/* Partner Logos Carousel */}
          <motion.div className="relative" variants={itemVariants}>
            <motion.div
              className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md dark:border-gray-700/30 dark:bg-gray-900/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="mb-6 text-sm tracking-wider text-gray-600 uppercase dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Confiado por equipes da
              </motion.p>

              {/* Carousel Container */}
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex space-x-12"
                  animate={{
                    x: [0, -1200],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {/* First set of logos */}
                  {partners.map((partner, index) => (
                    <motion.div
                      key={`first-${partner}`}
                      className="flex-shrink-0 cursor-pointer text-lg font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      whileHover={{
                        opacity: 1,
                        scale: 1.1,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        delay: 1.2 + index * 0.1,
                        duration: 0.5,
                      }}
                    >
                      {partner}
                    </motion.div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {partners.map((partner, index) => (
                    <motion.div
                      key={`second-${partner}`}
                      className="flex-shrink-0 cursor-pointer text-lg font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      initial={{ opacity: 0.6 }}
                      whileHover={{
                        opacity: 1,
                        scale: 1.1,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {partner}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
