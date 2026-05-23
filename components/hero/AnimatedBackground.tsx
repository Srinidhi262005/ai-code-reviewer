"use client";

import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/40 to-purple-600/20 rounded-full blur-[100px]"
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/25 to-blue-500/10 rounded-full blur-[100px]"
        animate={{
          y: [0, -80, 0],
          x: [0, -60, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-rose-500/15 to-orange-500/5 rounded-full blur-[100px]"
        animate={{
          y: [0, 80, 0],
          x: [0, -80, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60" />
    </div>
  );
}
