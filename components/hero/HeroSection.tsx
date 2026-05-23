"use client";

import React from "react";
import { motion } from "framer-motion";
import { PullRequestInput } from "@/app/components/PullRequestInput";
import { Sparkles, GitBranch, Zap, ShieldCheck, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.6,
    },
  }),
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

export function HeroSection({ onSubmit, isLoading }: HeroSectionProps) {
  return (
    <div className="space-y-16 max-w-5xl mx-auto text-center py-8 md:py-16">
      {/* Hero Headers */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-white/10 backdrop-blur-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
          </motion.div>
          <span className="text-sm font-medium bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
            AI-Powered Code Review
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            <span className="block text-white">Intelligent</span>
            <motion.span
              className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Code Review
            </motion.span>
            <span className="block text-white">in Seconds</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Paste a GitHub PR URL and let AI analyze your code for bugs, security issues, performance bottlenecks, and architectural problems—with instant actionable fixes.
        </motion.p>
      </motion.div>

      {/* PR Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <PullRequestInput onSubmit={onSubmit} isLoading={isLoading} />
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            icon: GitBranch,
            title: "GitHub Integration",
            description: "Connect any public repository and analyze pull requests instantly",
            gradient: "from-violet-500/20 to-purple-500/10",
            borderColor: "border-violet-500/30",
          },
          {
            icon: Zap,
            title: "AI Analysis",
            description: "Powered by Gemini AI for deep code understanding and patterns",
            gradient: "from-cyan-500/20 to-blue-500/10",
            borderColor: "border-cyan-500/30",
          },
          {
            icon: ShieldCheck,
            title: "Actionable Fixes",
            description: "Get exact code suggestions with one-click implementations",
            gradient: "from-emerald-500/20 to-teal-500/10",
            borderColor: "border-emerald-500/30",
          },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              className={`premium-glass p-6 ${feature.borderColor} hover:border-white/30 group cursor-pointer transition-all duration-300`}
              custom={i}
              variants={featureVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
