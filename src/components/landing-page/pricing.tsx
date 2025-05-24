"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for small teams getting started",
    features: [
      "Up to 5 team members",
      "Basic CRM functionality",
      "10 AI-generated playbooks",
      "Email support",
      "Basic integrations",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 79,
    description: "Ideal for growing sales teams",
    features: [
      "Up to 25 team members",
      "Advanced CRM with AI insights",
      "Unlimited AI playbooks",
      "Workflow automation",
      "Priority support",
      "Advanced integrations",
      "Custom reporting",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large organizations with complex needs",
    features: [
      "Unlimited team members",
      "Full platform access",
      "Custom AI model training",
      "Advanced workflow automation",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "SLA guarantee",
    ],
    popular: false,
  },
];

export default function Pricing() {
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

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 dark:bg-gray-950"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-400/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl dark:bg-purple-400/10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            <span className="text-gray-900 dark:text-white">Simple, </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transparent
            </span>
            <span className="text-gray-900 dark:text-white"> Pricing</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect plan for your team. All plans include a 14-day
            free trial.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="flex" // Add flex to make cards equal height
            >
              <motion.div
                className={`relative flex w-full flex-col rounded-2xl border bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50 ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/30"
                    : "border-gray-200/50 dark:border-gray-700/50"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 transform"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </motion.div>
                )}

                <div className="mb-8 text-center">
                  <motion.h3
                    className="mb-2 text-2xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.p
                    className="mb-4 text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {plan.description}
                  </motion.p>
                  <div className="flex items-baseline justify-center">
                    <motion.span
                      className="text-5xl font-bold text-gray-900 dark:text-white"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      ${plan.price}
                    </motion.span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                      /month
                    </span>
                  </div>
                </div>

                <div className="flex-grow">
                  {" "}
                  {/* This will push the button to bottom */}
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.6 + index * 0.1 + featureIndex * 0.05,
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        </motion.div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="mt-auto" // This ensures button stays at bottom
                >
                  <Button
                    className={`w-full rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }`}
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Need a custom solution?
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="lg" className="rounded-xl">
              Contact Sales
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
