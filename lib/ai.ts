import { ReviewFinding, AIReview, GitHubFile } from "@/types";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Create analysis prompt for a single file
 */
function createAnalysisPrompt(filename: string, patch: string): string {
  return `You are an expert code reviewer. Analyze this code change and identify issues.

FILE: ${filename}
CHANGED CODE (diff format):
\`\`\`
${patch}
\`\`\`

For each issue found, respond in this EXACT JSON format:
{
  "findings": [
    {
      "type": "bug|security|performance|smell|bestpractice",
      "severity": "critical|high|medium|low",
      "line": 25,
      "description": "Clear description of what's wrong",
      "suggestion": "Specific fix or explanation"
    }
  ]
}

Rules:
1. Only report real issues, not style preferences
2. Prioritize security and bugs over style
3. Line number is optional (best guess if unclear)
4. Suggest actual fixes, not just criticism
5. Keep descriptions under 100 words
6. Return ONLY valid JSON, no extra text`;
}

/**
 * Send request to Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  try {
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || "Unknown error"}`
      );
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

/**
 * Parse Gemini response to structured findings
 */
function parseGeminiResponse(response: string): ReviewFinding[] {
  try {
    // Try to extract JSON from response (in case of extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("No JSON found in Gemini response");
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const rawFindings = parsed.findings || [];

    if (!Array.isArray(rawFindings)) {
      return [];
    }

    const validTypes = ["bug", "security", "performance", "smell", "bestpractice"];
    const validSeverities = ["critical", "high", "medium", "low"];

    return rawFindings.map((f: any) => {
      // Normalize finding type (lowercase and remove spaces/hyphens)
      let type = "bestpractice";
      if (f.type && typeof f.type === "string") {
        const lowerType = f.type.toLowerCase().replace(/[^a-z]/g, "");
        if (validTypes.includes(lowerType)) {
          type = lowerType;
        } else if (lowerType === "codequality" || lowerType === "style" || lowerType === "cleanliness") {
          type = "bestpractice";
        }
      }

      // Normalize severity
      let severity = "low";
      if (f.severity && typeof f.severity === "string") {
        const lowerSeverity = f.severity.toLowerCase().replace(/[^a-z]/g, "");
        if (validSeverities.includes(lowerSeverity)) {
          severity = lowerSeverity;
        }
      }

      // Safe parse line number
      let line: number | undefined = undefined;
      if (f.line !== undefined && f.line !== null) {
        const parsedLine = parseInt(String(f.line), 10);
        if (!isNaN(parsedLine) && parsedLine > 0) {
          line = parsedLine;
        }
      }

      return {
        type: type as any,
        severity: severity as any,
        line,
        description: typeof f.description === "string" ? f.description : "No description provided.",
        suggestion: typeof f.suggestion === "string" ? f.suggestion : "No suggestion provided.",
      };
    });
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
}

/**
 * Analyze a single file
 */
async function analyzeFile(
  filename: string,
  patch: string
): Promise<ReviewFinding[]> {
  // Skip binary files and large diffs
  if (!patch || patch.length > 10000) {
    return [];
  }

  const prompt = createAnalysisPrompt(filename, patch);
  const response = await callGeminiAPI(prompt);
  const findings = parseGeminiResponse(response);

  // Add filename to each finding
  return findings.map((f) => ({
    ...f,
    file: filename,
  }));
}

/**
 * Main function: Analyze all files
 */
export async function analyzeCode(files: GitHubFile[]): Promise<AIReview> {
  const allFindings: ReviewFinding[] = [];

  // Analyze files sequentially (avoid rate limits)
  for (const file of files) {
    if (!file.patch) continue;

    try {
      const findings = await analyzeFile(file.filename, file.patch);
      allFindings.push(...findings);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error analyzing ${file.filename}:`, error);
    }
  }

  // Generate summary
  const bugCount = allFindings.filter((f) => f.type === "bug").length;
  const securityCount = allFindings.filter((f) => f.type === "security").length;
  const perfCount = allFindings.filter((f) => f.type === "performance").length;
  const smellCount = allFindings.filter((f) => f.type === "smell" || f.type === "bestpractice").length;

  const summary =
    `Found ${bugCount} bugs, ${securityCount} security issues, ` +
    `${perfCount} performance tips, ${smellCount} code smells.`;

  return {
    summary,
    findings: allFindings,
  };
}
