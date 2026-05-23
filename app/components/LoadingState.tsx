"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Terminal, CheckCircle2, ChevronRight } from "lucide-react";

export function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = [
    "Connecting to GitHub API & pulling PR patches...",
    "Analyzing repository code structure & file modifications...",
    "Scanning code segments with Gemini AI review models...",
    "Assembling vulnerability report & proposed refactoring recommendations..."
  ];

  const simulatedLogs = [
    "info: initializing api client connection...",
    "info: fetching repository reference: owner/repo/pulls...",
    "info: found 3 modified files in this PR",
    "info: extracting raw code diff metrics...",
    "info: initiating Gemini multi-agent prompt context...",
    "info: scanning for security flaws & open connection leaks...",
    "info: evaluating code compliance with industry clean practices...",
    "info: calculating dynamic code quality health score...",
    "info: preparing side-by-side solutions..."
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Progress steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);

    // Stream logs
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < simulatedLogs.length) {
        setLogs((prev) => [...prev, simulatedLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 1200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(logInterval);
    };
  }, [steps, simulatedLogs]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-reveal">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)]">
        {/* Shimmer glowing bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shimmer-bg" />

        {/* Loading Indicator */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-neutral-900 border border-purple-500/30 text-purple-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Gemini Code Analysis Active</h2>
            <p className="text-sm text-neutral-400">Please stand by. Standard scans require 10-20 seconds.</p>
          </div>
        </div>

        {/* Step Checklists */}
        <div className="space-y-4 mb-8">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? "bg-purple-950/10 border-purple-500/20 shadow-sm shadow-purple-500/5 text-purple-200" 
                    : isCompleted 
                      ? "bg-neutral-900/20 border-neutral-900 text-neutral-400"
                      : "bg-transparent border-transparent text-neutral-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-purple-400 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-neutral-800 shrink-0 mt-0.5" />
                )}
                <span className="text-xs md:text-sm font-medium leading-relaxed">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Terminal Logs Stream */}
        <div className="rounded-xl border border-neutral-900 bg-black/80 p-4 font-mono text-[11px] leading-relaxed text-neutral-400">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 mb-2 text-neutral-500 select-none">
            <Terminal className="h-3.5 w-3.5" />
            <span>analysis_session.log</span>
          </div>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-1">
                <ChevronRight className="h-3 w-3 text-purple-500 shrink-0 mt-0.5" />
                <span className="break-all">{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-purple-400 animate-pulse mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>executing agent check...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
