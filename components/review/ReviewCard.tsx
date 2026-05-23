"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewFinding, GitHubFile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CodeDiffDisplay } from "@/components/CodeDiffDisplay";
import { Bug, ShieldAlert, Zap, AlertTriangle, Sparkles, ChevronDown } from "lucide-react";

interface ReviewCardProps {
  finding: ReviewFinding;
  matchingFile?: GitHubFile;
  index?: number;
}

const severityConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: string }
> = {
  critical: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30 border-l-4 border-l-rose-500",
    icon: "🔴",
  },
  high: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30 border-l-4 border-l-orange-500",
    icon: "🟠",
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30 border-l-4 border-l-amber-500",
    icon: "🟡",
  },
  low: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30 border-l-4 border-l-blue-500",
    icon: "🔵",
  },
};

const typeIcons: Record<string, React.ReactNode> = {
  bug: <Bug className="h-5 w-5" />,
  security: <ShieldAlert className="h-5 w-5" />,
  performance: <Zap className="h-5 w-5" />,
  smell: <AlertTriangle className="h-5 w-5" />,
  bestpractice: <Sparkles className="h-5 w-5" />,
};

const typeLabels: Record<string, string> = {
  bug: "Bug",
  security: "Security",
  performance: "Performance",
  smell: "Code Smell",
  bestpractice: "Best Practice",
};

export function ReviewCard({
  finding,
  matchingFile,
  index = 0,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[finding.severity] || severityConfig.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left rounded-lg border p-4 md:p-5 backdrop-blur-xl transition-all duration-300 ${config.bg} ${config.border} hover:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Type badge with icon */}
              <motion.div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} border border-current/20 text-xs font-semibold ${config.color}`}
                whileHover={{ scale: 1.05 }}
              >
                {typeIcons[finding.type] || typeIcons.bestpractice}
                <span>{typeLabels[finding.type] || "Code Quality"}</span>
              </motion.div>

              {/* Severity badge */}
              <Badge
                className={`capitalize font-semibold text-xs px-2.5 py-1 ${config.color} border-current/30`}
                variant="outline"
              >
                {finding.severity}
              </Badge>
            </div>

            {/* Title */}
            <h4 className="text-sm md:text-base font-bold text-white leading-relaxed line-clamp-2">
              {finding.description}
            </h4>
          </div>

          {/* Expand button */}
          <motion.div
            className="flex-shrink-0 text-white/40 hover:text-white"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>

        {/* Mini preview of suggestion */}
        {finding.suggestion && !isExpanded && (
          <motion.p
            className="text-xs text-white/50 mt-3 line-clamp-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            💡 {finding.suggestion.substring(0, 100)}
            {finding.suggestion.length > 100 ? "..." : ""}
          </motion.p>
        )}
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div
              className={`mt-1 rounded-lg border-t-0 border ${config.border} p-4 md:p-5 bg-gradient-to-b from-white/5 to-white/[0.02]} backdrop-blur-xl space-y-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Full description */}
              {finding.suggestion && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-white">💡 Suggestion</h5>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {finding.suggestion}
                  </p>
                </div>
              )}

              {/* Code diff */}
              {(finding.file || finding.suggestion) && (
                <div>
                  <CodeDiffDisplay
                    filename={finding.file || "Code Context"}
                    line={finding.line}
                    suggestion={finding.suggestion}
                    patch={matchingFile?.patch}
                  />
                </div>
              )}

              {/* Action buttons */}
              <motion.div
                className="flex gap-2 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Copy Suggestion
                </motion.button>
                <motion.button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 border border-white/5 transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark as Fixed
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
