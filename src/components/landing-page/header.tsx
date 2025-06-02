"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 right-0 left-0 z-50 mx-auto w-full max-w-7xl transition-all duration-500 ${
        isScrolled
          ? "border border-gray-200/30 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-gray-800/30 dark:bg-gray-950/90"
          : "border border-gray-200/20 bg-white/70 shadow-lg backdrop-blur-md dark:border-gray-800/20 dark:bg-gray-950/70"
      } rounded-2xl`}
    >
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="h-5 w-5 text-white" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                SalesAI Pro
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {["Features", "Product", "Pricing", "Testimonials"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="group relative text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {item}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                variant="ghost"
                className="rounded-xl text-gray-600 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700">
                Start Free Trial
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <motion.button
                className="rounded-xl p-2 transition-colors hover:bg-gray-100/50 md:hidden dark:hover:bg-gray-800/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 border-gray-200/30 bg-white/95 p-4 backdrop-blur-xl dark:border-gray-800/30 dark:bg-gray-950/95"
            >
              <div className="flex h-full flex-col pt-8">
                {/* Logo in Sheet */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                      SalesAI Pro
                    </span>
                  </Link>
                </motion.div>

                {/* Navigation Links */}
                <nav className="flex-1">
                  <div className="space-y-6">
                    {["Features", "Product", "Pricing", "Testimonials"].map(
                      (item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.2 + index * 0.1,
                            duration: 0.3,
                          }}
                        >
                          <Link
                            href={`#${item.toLowerCase()}`}
                            className="block rounded-lg px-4 py-2 text-lg font-medium text-gray-600 transition-colors hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
                            onClick={handleLinkClick}
                          >
                            {item}
                          </Link>
                        </motion.div>
                      )
                    )}
                  </div>
                </nav>

                {/* CTA Buttons */}
                <motion.div
                  className="space-y-4 border-t border-gray-200/50 pt-8 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-gray-200 hover:bg-gray-100/50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                    onClick={handleLinkClick}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700"
                    onClick={handleLinkClick}
                  >
                    Start Free Trial
                  </Button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  className="mt-8 border-t border-gray-200/50 pt-6 dark:border-gray-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Transform your sales with AI
                  </p>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
