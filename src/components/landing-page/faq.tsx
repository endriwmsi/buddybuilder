"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI-powered playbook generation work?",
    answer:
      "Our AI analyzes your industry, target market, and historical sales data to generate customized playbooks with proven strategies, objection handling techniques, and conversation flows tailored to your specific business needs.",
  },
  {
    question: "Can I integrate SalesAI Pro with my existing CRM?",
    answer:
      "Yes! SalesAI Pro integrates with 500+ popular tools including Salesforce, HubSpot, Pipedrive, and many others. We also provide webhooks and APIs for custom integrations.",
  },
  {
    question: "What kind of automation workflows can I create?",
    answer:
      "You can automate lead scoring, email sequences, task assignments, follow-up reminders, data entry, report generation, and much more. Our visual workflow builder makes it easy to create complex automation without coding.",
  },
  {
    question: "Is my data secure with SalesAI Pro?",
    answer:
      "Absolutely. We use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular security audits. Your data is stored in secure, geographically distributed data centers.",
  },
  {
    question: "How quickly can my team get started?",
    answer:
      "Most teams are up and running within 24 hours. We provide guided onboarding, data migration assistance, and dedicated support to ensure a smooth transition.",
  },
  {
    question: "What support options are available?",
    answer:
      "We offer email support for all plans, priority support for Professional plans, and dedicated account management for Enterprise customers. We also provide extensive documentation and video tutorials.",
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
            <span className="text-gray-900 dark:text-white">
              Frequently Asked{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about SalesAI Pro. Can't find what
            you're looking for? Contact our support team.
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
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
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
