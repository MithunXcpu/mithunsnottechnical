import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { repos } from "./repo-catalog";

const GITHUB_API = "https://api.github.com";

const SYSTEM_PROMPT = `You are Mithun's personal build advisor. He has 20 side projects. Your job is to look at his repo activity, open issues, and each project's "app idea" field, then recommend exactly 5 projects he should focus on this week.

Rules:
- Pick 5 repos. No more, no less.
- Prioritize: repos with open issues > repos that are stale but have strong app ideas > repos that were recently active (momentum)
- For each repo, give a specific 2-3 sentence action item. Not "work on this" but "Add the OCR receipt scanning feature you described. Start with the camera capture component, then wire up Tesseract.js."
- Be opinionated about what to skip this week. If a repo is a dead end, say so.
- Format as a numbered list (1-5) with repo name as a bold header, then the action item below.
- End with a one-liner "theme of the week" that ties the 5 picks together.
- Keep the total response under 400 words.`;

interface RepoStatus {
  name: string;
  repo: string;
  summary: string;
  appIdea: string;
  daysSinceActivity: number;
  openIssues: number;
  issueTitles: string[];
}

async function ghFetch(endpoint: string) {
  const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-weekly-email",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${endpoint}`);
  return res.json();
}

async function fetchRepoStatus(
  repo: typeof repos[number]
): Promise<RepoStatus> {
  try {
    const repoData = await ghFetch(`/repos/${repo.repo}`);
    const pushedAt = new Date(repoData.pushed_at);
    const daysSince = Math.floor(
      (Date.now() - pushedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    let issueTitles: string[] = [];
    if (repoData.open_issues_count > 0) {
      try {
        const issues = await ghFetch(
          `/repos/${repo.repo}/issues?state=open&per_page=5`
        );
        issueTitles = issues.map((i: { title: string }) => i.title);
      } catch {
        // Issues fetch failed, continue without
      }
    }

    return {
      name: repo.name,
      repo: repo.repo,
      summary: repo.summary,
      appIdea: repo.appIdea,
      daysSinceActivity: daysSince,
      openIssues: repoData.open_issues_count || 0,
      issueTitles,
    };
  } catch {
    return {
      name: repo.name,
      repo: repo.repo,
      summary: repo.summary,
      appIdea: repo.appIdea,
      daysSinceActivity: -1,
      openIssues: 0,
      issueTitles: [],
    };
  }
}

async function fetchAllStatuses(): Promise<RepoStatus[]> {
  console.log(`Fetching status for ${repos.length} repos...`);
  const results = await Promise.allSettled(repos.map(fetchRepoStatus));

  const statuses = results
    .filter(
      (r): r is PromiseFulfilledResult<RepoStatus> => r.status === "fulfilled"
    )
    .map((r) => r.value)
    .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);

  console.log(`Got status for ${statuses.length} repos.`);
  return statuses;
}

function buildEmailHtml(recommendations: string, statuses: RepoStatus[]): string {
  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const recsHtml = recommendations
    .split("\n")
    .map((line) => {
      if (line.match(/^\d+\./)) return `<p style="margin:12px 0 4px;"><strong>${line}</strong></p>`;
      if (line.startsWith("**")) return `<p style="margin:4px 0 12px;font-size:14px;color:#555;">${line.replace(/\*\*/g, "")}</p>`;
      if (line.trim() === "") return "";
      return `<p style="margin:4px 0;font-size:14px;color:#333;">${line}</p>`;
    })
    .join("\n");

  const tableRows = statuses
    .map(
      (s) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${s.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${s.daysSinceActivity >= 0 ? `${s.daysSinceActivity}d` : "?"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${s.openIssues}</td>
        </tr>`
    )
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fafafa;">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="font-size:22px;margin:0 0 4px;">Weekly Build Plan</h1>
    <p style="color:#888;font-size:13px;margin:0 0 24px;">Week of ${weekOf}</p>

    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#10b981;margin:0 0 16px;">This Week's Focus</h2>
      ${recsHtml}
    </div>

    <div>
      <h2 style="font-size:16px;color:#6366f1;margin:0 0 12px;">Repo Health</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px;text-align:left;font-size:12px;color:#888;border-bottom:2px solid #e5e7eb;">Project</th>
            <th style="padding:8px;text-align:center;font-size:12px;color:#888;border-bottom:2px solid #e5e7eb;">Last Push</th>
            <th style="padding:8px;text-align:center;font-size:12px;color:#888;border-bottom:2px solid #e5e7eb;">Issues</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#aaa;margin-top:16px;">Generated by your portfolio automation pipeline</p>
</body>
</html>`;
}

async function sendEmail(html: string) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  await transport.sendMail({
    from: `"Portfolio Bot" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER!,
    subject: `Weekly Build Plan — ${weekOf}`,
    html,
  });

  console.log("Email sent successfully.");
}

async function main() {
  console.log("Generating weekly email...");

  const statuses = await fetchAllStatuses();

  const statusText = statuses
    .map(
      (s) =>
        `## ${s.name} (${s.repo})\n- Last pushed: ${s.daysSinceActivity >= 0 ? `${s.daysSinceActivity} days ago` : "unknown"}\n- Open issues: ${s.openIssues}\n- Issue titles: ${s.issueTitles.length > 0 ? s.issueTitles.join(", ") : "None"}\n- Summary: ${s.summary}\n- App idea: ${s.appIdea}`
    )
    .join("\n\n");

  console.log("Calling Claude for recommendations...");
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here are my 20 side projects with their current status:\n\n${statusText}\n\nPick 5 projects I should focus on this week and give me specific action items.`,
      },
    ],
  });

  const recommendations =
    message.content[0].type === "text" ? message.content[0].text : "";
  if (!recommendations) {
    console.error("Empty response from Claude.");
    process.exit(1);
  }

  console.log("Building email...");
  const html = buildEmailHtml(recommendations, statuses);
  await sendEmail(html);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
