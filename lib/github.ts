import axios from "axios";
import { GitHubPRData, GitHubFile } from "@/types";

const GITHUB_API_BASE = "https://api.github.com";

interface PRParsed {
  owner: string;
  repo: string;
  prNumber: number;
}

/**
 * Parse GitHub PR URL to extract owner, repo, and PR number
 * Example: https://github.com/facebook/react/pull/12345
 */
export function parsePRUrl(url: string): PRParsed {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    throw new Error("Invalid GitHub PR URL format");
  }
  return {
    owner: match[1],
    repo: match[2],
    prNumber: parseInt(match[3]),
  };
}

/**
 * Fetch PR details from GitHub API
 */
export async function getPRDetails(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<GitHubPRData> {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return {
      owner,
      repo,
      prNumber,
      title: response.data.title,
      description: response.data.body || "No description",
      author: response.data.user.login,
      url: response.data.html_url,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("PR not found. Check the URL.");
    } else if (error.response?.status === 403) {
      throw new Error("GitHub API rate limited. Use a valid token.");
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

/**
 * Fetch changed files in PR
 * Limits to 10 files for performance
 */
export async function getPRFiles(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<GitHubFile[]> {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          per_page: 10, // Limit to 10 files
        },
      }
    );

    return response.data.map((file: any) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch PR files: ${error.message}`);
  }
}

/**
 * Main function: Get PR details and files
 */
export async function fetchPRData(prUrl: string): Promise<{
  prData: GitHubPRData;
  files: GitHubFile[];
}> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN not configured");
  }

  const { owner, repo, prNumber } = parsePRUrl(prUrl);

  const prData = await getPRDetails(owner, repo, prNumber, token);
  const files = await getPRFiles(owner, repo, prNumber, token);

  return { prData, files };
}
