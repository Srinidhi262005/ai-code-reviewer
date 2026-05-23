"use client";

import React, { useState } from "react";
import { Terminal, FileCode, Check, Copy } from "lucide-react";

interface CodeDiffDisplayProps {
  filename: string;
  line?: number;
  suggestion?: string;
  patch?: string;
}

export function CodeDiffDisplay({ filename, line, suggestion, patch }: CodeDiffDisplayProps) {
  const [activeTab, setActiveTab] = useState<"diff" | "suggestion">(patch ? "diff" : "suggestion");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse git patches into renderable lines
  const parsePatch = (patchStr: string) => {
    if (!patchStr) return [];
    
    return patchStr.split("\n").map((lineText, idx) => {
      let type: "header" | "normal" | "addition" | "deletion" = "normal";
      if (lineText.startsWith("@@")) type = "header";
      else if (lineText.startsWith("+")) type = "addition";
      else if (lineText.startsWith("-")) type = "deletion";
      
      return {
        id: idx,
        text: lineText,
        type
      };
    });
  };

  const parsedLines = parsePatch(patch || "");

  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-300">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/60 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-mono text-neutral-300 font-semibold">{filename}</span>
          {line && (
            <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono">
              Line {line}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggles */}
          {patch && suggestion && (
            <div className="flex items-center bg-neutral-950 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setActiveTab("diff")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  activeTab === "diff"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Git Diff
              </button>
              <button
                onClick={() => setActiveTab("suggestion")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  activeTab === "suggestion"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                AI Suggestion
              </button>
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(activeTab === "diff" ? patch || "" : suggestion || "")}
            className="p-1.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 text-neutral-400 hover:text-white transition-all"
            title="Copy Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed max-h-[350px] overflow-y-auto">
        {activeTab === "diff" && parsedLines.length > 0 ? (
          <div className="space-y-0.5">
            {parsedLines.map((lineObj) => {
              let bg = "";
              let textClass = "text-neutral-300";
              if (lineObj.type === "header") {
                bg = "bg-neutral-900/40";
                textClass = "text-neutral-500 font-semibold select-none border-b border-neutral-900/30 py-0.5 block";
              } else if (lineObj.type === "addition") {
                bg = "bg-emerald-500/10 border-l-2 border-emerald-500/50 -mx-4 px-4 block";
                textClass = "text-emerald-300";
              } else if (lineObj.type === "deletion") {
                bg = "bg-red-500/10 border-l-2 border-red-500/50 -mx-4 px-4 block";
                textClass = "text-red-300";
              }

              return (
                <div key={lineObj.id} className={`${bg} py-0.5`}>
                  <span className={`${textClass} whitespace-pre-wrap font-mono`}>{lineObj.text}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-neutral-300 bg-neutral-950/40 p-3 rounded-lg border border-neutral-900">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-2 uppercase tracking-wide select-none">
              <Terminal className="h-3.5 w-3.5" />
              Proposed Solution
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-[12px] leading-relaxed text-emerald-100">
              {suggestion || "No specific code suggestions provided."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
