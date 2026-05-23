"use client";

import React, { useState } from "react";
import { AnalyzeResponse, ReviewFinding } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreCard } from "@/components/review/ScoreCard";
import { ReviewCard } from "@/components/review/ReviewCard";
import { SummaryPanel } from "@/components/review/SummaryPanel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { GradientButton } from "@/components/shared/GradientButton";
import { 
  FolderOpen, 
  FileText, 
  CheckCircle2,
  ChevronRight,
  GitPullRequest,
  ExternalLink
} from "lucide-react";

interface ReviewResultsProps {
  data: AnalyzeResponse;
}

export function ReviewResults({ data }: ReviewResultsProps) {
  const [selectedFile, setSelectedFile] = useState<string>("all");

  if (!data.success || !data.review || !data.prData) {
    return (
      <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6 text-center max-w-2xl mx-auto space-y-4 animate-reveal">
        <p className="text-red-400 font-semibold">❌ Analysis Load Failure</p>
        <p className="text-red-300/80 text-sm">{data.error || "Failed to load PR metadata analysis details."}</p>
      </div>
    );
  }

  const { review, prData, files = [] } = data;

  // Extract unique files with issues
  const filesWithIssues = Array.from(
    new Set(review.findings.map((f) => f.file).filter(Boolean))
  ) as string[];

  // Filter findings based on selection
  const filteredFindings = selectedFile === "all" 
    ? review.findings 
    : review.findings.filter((f) => f.file === selectedFile);

  // Group and sort findings
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedFindings = [...filteredFindings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  // Calculate dynamic stats
  const typeCounts: Record<string, number> = {
    bug: 0,
    security: 0,
    performance: 0,
    smell: 0,
    bestpractice: 0,
  };

  review.findings.forEach((f) => {
    if (f.type in typeCounts) {
      typeCounts[f.type]++;
    }
  });

  // Health Score Calculation Formula (100 base, subtraction based on severity weights)
  const calculateScore = (findings: ReviewFinding[]) => {
    let score = 100;
    findings.forEach((f) => {
      if (f.severity === "critical") score -= 15;
      else if (f.severity === "high") score -= 10;
      else if (f.severity === "medium") score -= 5;
      else if (f.severity === "low") score -= 2;
    });
    return Math.max(score, 10);
  };

  const healthScore = calculateScore(review.findings);

  // File sidebar tree layout content
  const sidebarContent = (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 select-none">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
          <FolderOpen className="h-3.5 w-3.5" />
          File Tree
        </span>
        <Badge variant="outline" className="text-[10px] bg-neutral-900 text-neutral-400 border-neutral-800">
          {filesWithIssues.length} affected
        </Badge>
      </div>
      
      <div className="flex flex-col space-y-1 bg-neutral-900/20 border border-neutral-850 p-2 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => setSelectedFile("all")}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
            selectedFile === "all"
              ? "bg-purple-950/20 text-purple-300 border border-purple-900/30"
              : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border border-transparent"
          }`}
        >
          <span className="truncate">All Findings</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] border border-neutral-800">
            {review.findings.length}
          </span>
        </button>
        
        {filesWithIssues.map((filename) => {
          const fileCount = review.findings.filter(f => f.file === filename).length;
          const displayLabel = filename.split("/").pop() || filename;
          
          return (
            <button
              key={filename}
              onClick={() => setSelectedFile(filename)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                selectedFile === filename
                  ? "bg-purple-950/20 text-purple-300 border border-purple-900/30"
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border border-transparent"
              }`}
              title={filename}
            >
              <span className="flex items-center gap-1.5 truncate">
                <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                <span className="truncate">{displayLabel}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] border border-neutral-800 shrink-0">
                {fileCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-reveal">
      
      {/* PR Heading Banner */}
      <Card className="p-6 bg-neutral-900/40 border-neutral-800/80 backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 h-24 w-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-semibold text-purple-400">{prData.owner}/{prData.repo}</span>
              <ChevronRight className="h-3 w-3" />
              <span>PR #{prData.prNumber}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-purple-400 shrink-0" />
              {prData.title}
            </h1>
            <p className="text-xs text-neutral-400">
              Author: <span className="font-semibold text-neutral-300">{prData.author}</span> • Changed {files.length} file(s)
            </p>
          </div>
          <a
            href={prData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl border border-neutral-800 transition-all self-start md:self-auto shrink-0"
          >
            <span>Open in GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Card>

      {/* Dynamic Health Score Card */}
      <ScoreCard score={healthScore} />

      {/* Summary Metrics Panel */}
      <SummaryPanel typeCounts={typeCounts} />

      {/* Dashboard Explorer Grid */}
      <DashboardLayout sidebar={sidebarContent}>
        <div className="space-y-6">
          <SectionTitle 
            title={`Active Findings (${sortedFindings.length})`} 
            subtitle="Explore recommendations and refactoring suggestions generated below"
          />

          <div className="space-y-4">
            {sortedFindings.map((finding, idx) => (
              <ReviewCard
                key={idx}
                finding={finding}
                matchingFile={files.find((f) => f.filename === finding.file)}
              />
            ))}

            {sortedFindings.length === 0 && (
              <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white">Analysis Fully Clean</h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                  No issues found in selected segments. Keep up the high standards! 🎉
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
