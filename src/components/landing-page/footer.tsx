"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-gray-900 py-16 text-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="mb-6 flex items-center space-x-2">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Zap className="h-5 w-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold">SalesAI Pro</span>
              </Link>
            </motion.div>
            <motion.p
              className="mb-6 max-w-md leading-relaxed text-gray-300 dark:text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Empowering sales teams worldwide with AI-driven strategies,
              intelligent automation, and comprehensive analytics to achieve
              unprecedented growth and success.
            </motion.p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "#" },
              ].map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-semibold">Product</h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Integrations", "API Documentation"].map(
                (item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="#"
                        className="text-gray-300 transition-colors hover:text-white dark:text-gray-400"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="#"
                      className="text-gray-300 transition-colors hover:text-white dark:text-gray-400"
                    >
                      {item}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-sm text-gray-400 md:mb-0 dark:text-gray-500">
            © {new Date().getFullYear()} SalesAI Pro. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white dark:text-gray-500"
                  >
                    {item}
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
