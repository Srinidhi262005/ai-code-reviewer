"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Sparkles, Github, Zap } from "lucide-react";

interface NavbarProps {
  onReset?: () => void;
  hasResult?: boolean;
}

export function Navbar({ onReset, hasResult }: NavbarProps) {
  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side - Logo and Brand */}
        <motion.div
          onClick={onReset}
          className={`flex items-center gap-3 ${onReset ? "cursor-pointer" : ""}`}
          whileHover={onReset ? { scale: 1.02 } : {}}
          whileTap={onReset ? { scale: 0.98 } : {}}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/50">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight leading-none">CodeReview</span>
            <span className="text-xs text-violet-400/70">AI-Powered</span>
          </div>
        </motion.div>

        {/* Right Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </motion.a>

          {hasResult && onReset && (
            <motion.button
              onClick={onReset}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 border border-violet-400/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-4 w-4" />
              <span>New Analysis</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
