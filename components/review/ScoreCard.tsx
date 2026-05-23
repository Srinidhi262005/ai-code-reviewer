"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScoreCardProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
}

export function ScoreCard({
  score,
  title = "PR Quality Score",
  subtitle = "AI analysis by Gemini",
}: ScoreCardProps) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);

      setCurrentScore(Math.round(ease * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getColorConfig = (val: number) => {
    if (val < 50)
      return {
        gradient: "from-rose-600 to-red-600",
        text: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        status: "Critical",
        ring: "ring-rose-500/20",
      };
    if (val < 75)
      return {
        gradient: "from-amber-600 to-orange-600",
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        status: "Needs Review",
        ring: "ring-amber-500/20",
      };
    return {
      gradient: "from-emerald-600 to-teal-600",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      status: "Excellent",
      ring: "ring-emerald-500/20",
    };
  };

  const config = getColorConfig(currentScore);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (currentScore / 100) * circumference;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-8 backdrop-blur-xl transition-all duration-500`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${config.gradient} opacity-10 blur-3xl`}
        animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress */}
        <motion.div className="relative h-40 w-40 flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(167, 139, 250, 1)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 1)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="text-5xl font-bold text-white"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              {currentScore}
            </motion.div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mt-1">
              Score
            </div>
          </motion.div>
        </motion.div>

        {/* Right side info */}
        <motion.div
          className="flex-1 space-y-4 text-center md:text-left"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-white/60">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start pt-2">
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${config.bg} border ${config.border} ${config.text} font-semibold text-sm`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-current"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.6,
                }}
              />
              {config.status}
            </motion.div>

            <motion.div
              className="text-xs text-white/40 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {currentScore < 50
                ? "Issues found - review recommended"
                : currentScore < 75
                  ? "Some improvements suggested"
                  : "Code quality approved"}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
