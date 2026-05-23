"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bug, ShieldAlert, Zap, AlertTriangle, Sparkles } from "lucide-react";

interface SummaryPanelProps {
  typeCounts: Record<string, number>;
}

const typeConfig: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    label: string;
  }
> = {
  bug: {
    icon: <Bug className="h-5 w-5" />,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
    label: "Bugs",
  },
  security: {
    icon: <ShieldAlert className="h-5 w-5" />,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    label: "Security",
  },
  performance: {
    icon: <Zap className="h-5 w-5" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    label: "Performance",
  },
  smell: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    label: "Code Smells",
  },
  bestpractice: {
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    label: "Best Practices",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

export function SummaryPanel({ typeCounts }: SummaryPanelProps) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-5 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Object.entries(typeCounts).map(([type, count]) => {
        const config = typeConfig[type];
        return (
          <motion.div
            key={type}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring" as const, stiffness: 400, damping: 10 },
            }}
          >
            <div
              className={`relative overflow-hidden rounded-lg border p-4 backdrop-blur-xl transition-all duration-300 ${config.bg} hover:border-opacity-100 cursor-pointer group`}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.05) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative flex flex-col items-center justify-center text-center space-y-2">
                {/* Icon */}
                <motion.div
                  className={`p-2 rounded-lg ${config.bg} ${config.color}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                >
                  {config.icon}
                </motion.div>

                {/* Count */}
                <motion.div className="space-y-1">
                  <motion.span
                    className="block text-2xl font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    {count}
                  </motion.span>
                  <span className={`block text-xs font-semibold uppercase tracking-widest ${config.color}`}>
                    {config.label}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
