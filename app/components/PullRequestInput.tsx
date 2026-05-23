"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitPullRequest, ArrowRight, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

interface PullRequestInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function PullRequestInput({ onSubmit, isLoading }: PullRequestInputProps) {
  const [prUrl, setPrUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!prUrl.trim()) {
      setError("Please enter a GitHub PR URL to begin analysis");
      return;
    }

    if (!prUrl.includes("github.com") || !prUrl.includes("/pull/")) {
      setError(
        "Invalid format. Use: https://github.com/owner/repo/pull/123"
      );
      return;
    }

    onSubmit(prUrl);
  };

  const handleExampleClick = (url: string) => {
    setPrUrl(url);
    setError("");
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Premium Input Container */}
        <motion.div
          className="relative group"
          animate={{
            boxShadow: isFocused
              ? "0 0 40px rgba(167, 139, 250, 0.3)"
              : "0 0 0px rgba(167, 139, 250, 0)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-violet-600/50 via-cyan-600/30 to-violet-600/50 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
            animate={isFocused ? { opacity: 0.5 } : { opacity: 0 }}
          />

          {/* Input container */}
          <div className="relative flex items-center bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 group-focus-within:border-violet-500/50 rounded-xl p-1 backdrop-blur-xl transition-all duration-300 overflow-hidden">
            {/* Left icon */}
            <div className="pl-4 pr-3 text-white/40 shrink-0 group-focus-within:text-violet-400 transition-colors">
              <motion.div
                animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <GitPullRequest className="h-5 w-5" />
              </motion.div>
            </div>

            {/* Input field */}
            <Input
              id="prUrl"
              type="url"
              placeholder="Paste GitHub PR URL here..."
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              className="w-full bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-white/30 text-base py-3 pr-12 disabled:opacity-60"
            />

            {/* Right submit button (Desktop) */}
            <motion.div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
              <motion.button
                type="submit"
                disabled={isLoading || !prUrl.trim()}
                className="relative px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 shadow-lg shadow-violet-500/30 border border-violet-400/20 transition-all duration-300"
                whileHover={!isLoading && prUrl.trim() ? { scale: 1.05 } : {}}
                whileTap={!isLoading && prUrl.trim() ? { scale: 0.95 } : {}}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
                  }
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Error message with animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 backdrop-blur-xl text-rose-300 px-4 py-3 rounded-lg text-sm font-medium"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 flex-none" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile submit button */}
        <motion.div className="block md:hidden">
          <motion.button
            type="submit"
            disabled={isLoading}
            onClick={(e) => {
              handleSubmit(e as React.FormEvent);
            }}
            className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 shadow-lg shadow-violet-500/30 border border-violet-400/20 transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze PR</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Example shortcuts */}
        <motion.div
          className="text-center pt-4 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
            Try Examples
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "react #27953", url: "https://github.com/facebook/react/pull/27953" },
              { label: "next.js #48960", url: "https://github.com/vercel/next.js/pull/48960" },
            ].map((example, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => handleExampleClick(example.url)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-violet-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {example.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
