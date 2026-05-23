"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FolderOpen } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Mobile Drawer Toggle */}
      <motion.div
        className="lg:hidden w-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] text-white text-sm font-semibold select-none hover:border-white/20 transition-all duration-300 backdrop-blur-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FolderOpen className="h-4 w-4 text-violet-400" />
            </motion.div>
            <span>File Navigator</span>
          </span>
          <motion.div
            animate={{ rotate: mobileExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4 text-white/60" />
          </motion.div>
        </motion.button>

        {/* Collapsible Mobile Sidebar */}
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              className="mt-2 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:block lg:col-span-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="sticky top-20 space-y-3">
          <motion.div
            className="premium-glass p-4 rounded-lg border border-white/10 backdrop-blur-xl"
            whileHover={{ scale: 1.01 }}
          >
            {sidebar}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="lg:col-span-3 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
