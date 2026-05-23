import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Code Reviewer - GitHub PR Analysis",
  description:
    "Paste a GitHub PR URL to get instant AI-powered code review with bug detection, security analysis, performance tips, and more.",
  keywords: [
    "code review",
    "AI",
    "GitHub",
    "pull request",
    "code analysis",
    "security",
    "bugs",
    "performance",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
