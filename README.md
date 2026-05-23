# 🤖 CodeReview AI: Intelligent PR Review Assistant

**Live Demo:** [https://your-project-name.vercel.app](https://your-project-name.vercel.app)

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Gemini AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**CodeReview AI** is an intelligent, developer-first code review assistant built for modern engineering teams. Paste any public GitHub Pull Request URL and receive structured, actionable, and category-specific AI feedback in seconds. 

Designed with premium, responsive glassmorphism aesthetics and animated by Framer Motion, it bridges the gap between raw git patches and high-level architectural insight.

---

## 💡 The Problem & The Solution

### **The Problem ❌**
Code reviews are critical to software quality, but they suffer from major bottlenecks:
- **Time Consuming**: Senior engineers spend hours parsing changes rather than writing code.
- **Inconsistent Checks**: Security flaws, performance traps, and architectural anti-patterns frequently bypass manual peer reviews.
- **High Friction**: Reviewing raw `.diff` or `.patch` files on the run is mentally fatiguing.

### **The Solution (CodeReview AI) ✅**
Our assistant automates the initial cycle of reviews:
- **Instant Feeds**: Scans and reviews the entire PR within 15–20 seconds.
- **Categorized Findings**: Separates issues into *Bugs*, *Security*, *Performance*, *Code Smells*, and *Best Practices*.
- **Quantitative Health Score**: Computes a dynamic **PR Quality Score** out of 100 based on weighted issue severity.
- **Interactive Diff Explorer**: Shows exactly where the code requires attention side-by-side with proposed code solutions.

---

## 🛠️ Tech Stack & Architecture

- **Core**: [Next.js 14](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/)
- **UI & Layout**: [React 18](https://react.dev/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Vanilla config with backdrop blur filters)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Smooth transitions, stagger animations, radial hover glows)
- **Integrations**: 
  - **GitHub REST API**: Fetches metadata, commit author, and code diff patches.
  - **Google Gemini API**: Analyzes raw patch diffs to return structured JSON recommendations.

### **System Architecture Flow**
```
                       [ USER ENTRY ]
                             │
                             ▼
                    Next.js App Router (Client)
                             │
            (POST /api/analyze with GitHub PR URL)
                             │
                             ▼
                    Next.js API Handler (Server)
                             │
             ┌───────────────┴───────────────┐
             ▼                               ▼
      GitHub REST API                 Google Gemini API
   (Fetch PR & File Diffs)          (Generate Code Analysis)
             │                               │
             └───────────────┬───────────────┘
                             │ (Normalized JSON Output)
                             ▼
                    Next.js Client Dashboard
             ┌────────────────────────────────┐
             │ - Interactive Sidebar Tree     │
             │ - Dynamic PR Quality Score     │
             │ - Category Summary Panel       │
             │ - Expandable Git Diff Cards    │
             └────────────────────────────────┘
```

---

## 📋 Features

1. **Intelligent GitHub PR URL Parser**: Handles URLs like `https://github.com/owner/repo/pull/123` and handles query strings, trailing slashes, and anchor tags automatically.
2. **PR Quality Score**: A 0–100 metrics meter calculated using weighted deductions:
   - Critical: `-15` points
   - High: `-10` points
   - Medium: `-5` points
   - Low: `-2` points
3. **Category Breakdown Panel**: Provides a visual metric layout of findings categorized by type.
4. **Interactive File Tree Sidebar**: Filter recommendations dynamically based on individual files with active issues.
5. **Git Diff Viewer & Suggestion Panel**: Switch seamlessly between the raw Git Diff of the PR file and the AI's Proposed Solution with copy-to-clipboard functionality.

---

## ⚙️ Configuration & Environment Variables

Create a `.env.local` file in the root directory (based on `.env.example`):

```bash
# GitHub API Token (Classic Personal Access Token)
# Go to: Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic)
# Required scope: "repo" (for accessing code repositories)
GITHUB_TOKEN=ghp_YOUR_GITHUB_TOKEN_HERE

# Google Gemini API Key
# Go to: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyYOUR_GEMINI_KEY_HERE
```

---

## 🛠️ Repository Setup

If you are setting this up for the first time:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## � Quick Start Guide

### **1. Install Dependencies**
```bash
npm install
```

### **2. Launch Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### **3. Example PR URLs to Test**
- React Pull Request: `https://github.com/facebook/react/pull/27953`
- Next.js Pull Request: `https://github.com/vercel/next.js/pull/48960`

---

## 📦 Production Build & Testing

Validate that the app is production-ready by compiling it locally:

```bash
# Compile and build the Next.js project
npm run build

# Start the production server locally
npm run start
```

---

## 🚀 Deploying to Vercel

The fastest and most stable way to deploy **CodeReview AI** is via [Vercel](https://vercel.com):

1. **Commit and Push**: Ensure your project is pushed to a public or private GitHub repository.
2. **Import Repository**: Log in to Vercel, click **Add New** -> **Project**, and select your GitHub repository.
3. **Configure Environment Variables**:
   - In the **Environment Variables** section, add:
     - Name: `GITHUB_TOKEN`, Value: `[your_github_token]`
     - Name: `GEMINI_API_KEY`, Value: `[your_gemini_api_key]`
4. **Deploy**: Click **Deploy**. Vercel will automatically compile, optimize, and serve your app.

---

## 🐛 Troubleshooting

* **PR Not Found (404)**: Ensure the target repository is public and the PR number is correct. If the repo is private, verify your `GITHUB_TOKEN` has full `repo` access.
* **Rate Limited (403)**: Ensure your `GITHUB_TOKEN` is configured. Unauthenticated requests are limited to 60/hr, whereas authenticated requests allow up to 5,000/hr.
* **Malformed AI Response**: If Gemini returns invalid JSON, the server cleans up the response and maps it to a safe fallback. Try refreshing the review or analyzing another PR.

---

## 🔮 Future Roadmap (v2.0)

- **GitHub App Webhooks**: Post AI reviews directly as comments/annotations on GitHub PR files.
- **User Authentication**: GitHub OAuth login to review private files securely.
- **Multilingual AI Reviews**: Generate reports in Spanish, Japanese, or German.
- **Custom Guidelines File**: Allow repositories to define a `.reviewrules` file for custom check criteria.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
