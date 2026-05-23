import { NextRequest, NextResponse } from "next/server";
import { fetchPRData } from "@/lib/github";
import { analyzeCode } from "@/lib/ai";
import { AnalyzeResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prUrl } = body;

    // Validate input
    if (!prUrl || typeof prUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "prUrl is required" } as AnalyzeResponse,
        { status: 400 }
      );
    }

    // Fetch PR data and files
    const { prData, files } = await fetchPRData(prUrl);

    // Analyze with AI
    const review = await analyzeCode(files);

    // Return result
    return NextResponse.json({
      success: true,
      prData,
      files,
      review,
    } as AnalyzeResponse);
  } catch (error: any) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Analysis failed",
      } as AnalyzeResponse,
      { status: 500 }
    );
  }
}
