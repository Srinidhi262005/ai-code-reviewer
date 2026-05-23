"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, ChevronRight, Sparkles, Brain } from "lucide-react";

export function LoadingOverlay() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = useMemo(() => [
    { label: "Connecting", description: "Fetching PR from GitHub API", icon: Sparkles },
    { label: "Analyzing", description: "Processing code structure & diffs", icon: Brain },
    { label: "Scanning", description: "Running Gemini AI analysis models", icon: Zap },
    { label: "Generating", description: "Creating actionable recommendations", icon: CheckCircle2 },
  ], []);

  const simulatedLogs = useMemo(() => [
    "→ initializing code reviewer agent...",
    "→ fetching github repository diffs...",
    "→ found 3 modified files in pr",
    "→ extracting code segments...",
    "→ initializing gemini analysis pipeline...",
    "→ scanning for security vulnerabilities...",
    "→ checking performance patterns...",
    "→ evaluating code quality metrics...",
    "→ generating patch suggestions...",
  ], []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 3500);

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < simulatedLogs.length) {
        setLogs((prev) => [...prev, simulatedLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 1100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(logInterval);
    };
  }, [steps.length, simulatedLogs]);

  const progressVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Loading Card */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
        {/* Animated border glow */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* Loading Indicator */}
          <motion.div className="flex flex-col items-center text-center space-y-4">
            <motion.div
              className="relative h-20 w-20 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/10 border border-violet-500/20 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(167, 139, 250, 0.3)",
                  "0 0 40px rgba(167, 139, 250, 0.5)",
                  "0 0 20px rgba(167, 139, 250, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-10 w-10 text-violet-400" />
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white">AI Code Review Active</h2>
              <p className="text-sm text-white/60">Analyzing your pull request...</p>
            </motion.div>
          </motion.div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;

              return (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                    isActive
                      ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10"
                      : isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-white/5 border-white/10"
                  }`}
                >
                  <motion.div
                    className="relative flex-shrink-0"
                    animate={
                      isActive
                        ? { scale: [1, 1.1, 1] }
                        : isCompleted
                          ? { scale: 1 }
                          : {}
                    }
                    transition={
                      isActive ? { duration: 1.5, repeat: Infinity } : {}
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <StepIcon className="h-6 w-6 text-violet-400" />
                      </motion.div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-white/20" />
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold ${
                        isActive || isCompleted
                          ? "text-white"
                          : "text-white/60"
                      }`}>
                        {step.label}
                      </h3>
                      {isActive && (
                        <motion.div
                          className="h-1 w-1 rounded-full bg-violet-400"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-white/40">{step.description}</p>
                  </div>

                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Terminal Logs */}
          <motion.div
            className="rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3 text-white/40 select-none">
              <ChevronRight className="h-3.5 w-3.5" />
              <span>analysis.log</span>
            </div>

            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2 text-white/50 hover:text-white/70 transition-colors"
                >
                  <span className="text-violet-500 flex-shrink-0">$</span>
                  <span className="flex-1 break-all">{log}</span>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center gap-2 text-cyan-400 mt-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>processing...</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="h-1 bg-white/5 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
