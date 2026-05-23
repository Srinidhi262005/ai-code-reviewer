"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewResults } from "@/app/components/ReviewResults";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { AnimatedBackground } from "@/components/hero/AnimatedBackground";
import { LoadingOverlay } from "@/components/review/LoadingOverlay";
import { AnalyzeResponse } from "@/types";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (prUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prUrl }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Analysis failed. Please try another PR.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen relative text-white antialiased overflow-hidden selection:bg-violet-500/30">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar onReset={handleReset} hasResult={!!result} />

      {/* Main content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {/* Hero State - Initial landing */}
          {!result && !isLoading && !error && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection onSubmit={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingOverlay />
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              key="error"
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-8 backdrop-blur-xl">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 opacity-10 blur-3xl"
                  animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="relative space-y-4 text-center">
                  <motion.div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <AlertCircle className="h-6 w-6 text-rose-400" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      Analysis Failed
                    </h3>
                    <p className="text-sm text-white/60">{error}</p>
                  </div>

                  <motion.button
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30 border border-violet-400/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results State */}
          {result && !isLoading && !error && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <ReviewResults data={result} />

              {/* New analysis button */}
              <motion.div
                className="flex justify-center pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-lg font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, borderColor: "rgba(167, 139, 250, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Another PR
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Footer */}
      <motion.footer
        className="relative z-10 border-t border-white/10 py-12 mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>Powered by</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
            </motion.div>
            <span>Gemini AI</span>
          </div>
          <p className="text-xs text-white/40 font-medium">
            Developer Hackathon • 2026
          </p>
        </div>
      </motion.footer>
    </main>
  );
}
