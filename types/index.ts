// GitHub PR Data Types
export interface GitHubPRData {
  owner: string;
  repo: string;
  prNumber: number;
  title: string;
  description: string;
  author: string;
  url: string;
}

export interface GitHubFile {
  filename: string;
  status: "added" | "removed" | "modified";
  additions: number;
  deletions: number;
  patch?: string; // The diff
  content?: string; // File content
}

// AI Review Types
export interface ReviewFinding {
  type: "bug" | "security" | "performance" | "smell" | "bestpractice";
  severity: "critical" | "high" | "medium" | "low";
  line?: number;
  description: string;
  suggestion: string;
  file?: string;
}

export interface AIReview {
  summary: string;
  findings: ReviewFinding[];
}

// API Response Types
export interface AnalyzeRequest {
  prUrl: string;
  githubToken?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  error?: string;
  prData?: GitHubPRData;
  files?: GitHubFile[];
  review?: AIReview;
}
