/**
 * Utility functions and constants
 */

export const ISSUE_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-800 border-red-300",
  security: "bg-orange-100 text-orange-800 border-orange-300",
  performance: "bg-yellow-100 text-yellow-800 border-yellow-300",
  smell: "bg-blue-100 text-blue-800 border-blue-300",
  bestpractice: "bg-green-100 text-green-800 border-green-300",
};

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

export const SEVERITY_ICONS: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🔵",
};

/**
 * Format file path for display
 */
export function formatFilePath(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

/**
 * Group findings by type
 */
export function groupFindingsByType(
  findings: Array<{ type: string; [key: string]: any }>
): Record<string, any[]> {
  return findings.reduce((acc, finding) => {
    const type = finding.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(finding);
    return acc;
  }, {} as Record<string, any[]>);
}

/**
 * Sort findings by severity
 */
export function sortBySeverity(
  findings: Array<{ severity: string; [key: string]: any }>
): Array<{ severity: string; [key: string]: any }> {
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}
