import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { repos } from "./repo-catalog";
import { checkForDuplicates, DedupWarning } from "./blog-dedup";

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

async function fetchAllStatuses(filteredRepos: typeof repos): Promise<RepoStatus[]> {
  console.log(`Fetching status for ${filteredRepos.length} repos...`);
  const results = await Promise.allSettled(filteredRepos.map(fetchRepoStatus));

  const statuses = results
    .filter(
      (r): r is PromiseFulfilledResult<RepoStatus> => r.status === "fulfilled"
    )
    .map((r) => r.value)
    .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);

  console.log(`Got status for ${statuses.length} repos.`);
  return statuses;
}

interface EmailData {
  recommendations: string;
  statuses: RepoStatus[];
  scoutPicks: ScoutPick[];
  mode: "passion" | "interview";
  dedupWarnings: DedupWarning[];
  autoBuild: AutoBuildStatus | null;
}

function buildEmailHtml(data: EmailData): string {
  const { recommendations, statuses, scoutPicks, mode, dedupWarnings, autoBuild } = data;
  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const modeBadgeColor = mode === "interview" ? "#6366f1" : "#10b981";
  const modeBadgeBg = mode === "interview" ? "#eef2ff" : "#f0fdf4";
  const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);

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
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
      <h1 style="font-size:22px;margin:0;">Weekly Build Plan</h1>
      <span style="display:inline-block;background:${modeBadgeBg};color:${modeBadgeColor};font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;border:1px solid ${modeBadgeColor}20;">Mode: ${modeLabel}</span>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 24px;">Week of ${weekOf}</p>

    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#10b981;margin:0 0 16px;">This Week's Focus</h2>
      ${recsHtml}
    </div>

    ${buildScoutHtml(scoutPicks)}

    ${buildAutoBuildHtml(autoBuild)}

    ${buildDedupHtml(dedupWarnings)}

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

interface ScoutPick {
  tweet: { tweetUrl: string; text: string; author: string };
  github: { name: string; stars: number; language: string | null } | null;
  scores: { composite: number; allinOverlap: number };
  rationale: string;
  buildBrief: {
    problem: string;
    solution: string;
    techStack: string[];
    effort: string;
    firstSteps: string[];
  };
}

async function fetchScoutPicks(): Promise<ScoutPick[]> {
  const url = process.env.ANTFARM_SUPABASE_URL;
  const key = process.env.ANTFARM_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log("No antfarm Supabase credentials, skipping scout section.");
    return [];
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("agent_memory")
      .select("value")
      .eq("agent_name", "scout")
      .eq("key", "latest_scout_results")
      .single();

    if (error || !data?.value) {
      console.log("No scout results found in Supabase.");
      return [];
    }

    const result = data.value as { topPicks?: ScoutPick[] };
    return result.topPicks || [];
  } catch (err) {
    console.error("Failed to fetch scout results:", err);
    return [];
  }
}

async function fetchProjectMode(): Promise<"passion" | "interview"> {
  const url = process.env.ANTFARM_SUPABASE_URL;
  const key = process.env.ANTFARM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return "passion";

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("agent_memory")
      .select("value")
      .eq("agent_name", "system")
      .eq("key", "project_mode")
      .single();

    if (error || !data?.value) return "passion";
    const { mode } = data.value as { mode: string };
    return mode === "interview" ? "interview" : "passion";
  } catch {
    return "passion";
  }
}

interface AutoBuildStatus {
  name: string;
  description: string;
  accent: string;
  appIdea: string;
  techStack: string[];
  sourceUrl: string;
  score: number;
}

async function fetchAutoBuildStatus(): Promise<AutoBuildStatus | null> {
  const url = process.env.ANTFARM_SUPABASE_URL;
  const key = process.env.ANTFARM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("agent_memory")
      .select("value")
      .eq("agent_name", "scout")
      .eq("key", "auto_build_next")
      .single();

    if (error || !data?.value) return null;
    return data.value as AutoBuildStatus;
  } catch {
    return null;
  }
}

function buildDedupHtml(warnings: DedupWarning[]): string {
  if (warnings.length === 0) {
    return `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#10b981;margin:0 0 12px;">Blog Health</h2>
      <div style="padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
        <p style="margin:0;font-size:13px;color:#166534;">All posts unique — no content overlap detected.</p>
      </div>
    </div>`;
  }

  const warningCards = warnings
    .map(
      (w) => `
      <div style="padding:12px 16px;background:#fefce8;border-radius:8px;border:1px solid #fde68a;margin-bottom:8px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          <strong>${w.overlapPct}% overlap:</strong> "${w.postA}" and "${w.postB}"
        </p>
      </div>`
    )
    .join("");

  return `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#eab308;margin:0 0 12px;">Blog Health</h2>
      <p style="font-size:13px;color:#888;margin:0 0 8px;">Found ${warnings.length} post(s) with high content overlap. Consider revising or differentiating.</p>
      ${warningCards}
    </div>`;
}

function buildAutoBuildHtml(build: AutoBuildStatus | null): string {
  if (!build) return "";

  return `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#10b981;margin:0 0 12px;">Auto-Build Queued</h2>
      <div style="padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
        <p style="margin:0 0 8px;font-size:15px;"><strong>${build.name}</strong></p>
        <p style="margin:0 0 8px;font-size:13px;color:#333;">${build.description}</p>
        <p style="margin:0 0 4px;font-size:12px;color:#888;">Score: ${build.score.toFixed(1)}/10 · Stack: ${build.techStack.join(", ")}</p>
        <p style="margin:4px 0 0;font-size:12px;"><a href="${build.sourceUrl}" style="color:#3b82f6;">Source tweet</a></p>
      </div>
      <p style="font-size:12px;color:#888;margin:8px 0 0;">Will auto-scaffold at 4pm UTC Monday.</p>
    </div>`;
}

function buildScoutHtml(picks: ScoutPick[]): string {
  if (picks.length === 0) return "";

  const picksHtml = picks
    .map((pick, i) => {
      const gh = pick.github
        ? `<span style="color:#888;font-size:12px;">${pick.github.name} · ${pick.github.stars}★ · ${pick.github.language || "?"}</span>`
        : "";

      const steps = pick.buildBrief.firstSteps
        .map((s) => `<li style="font-size:13px;color:#555;margin:2px 0;">${s}</li>`)
        .join("");

      const allinTag = pick.scores.allinOverlap >= 6
        ? `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:11px;padding:2px 8px;border-radius:4px;margin-left:8px;">All-In overlap</span>`
        : "";

      return `
        <div style="margin-bottom:20px;padding:16px;background:#f9fafb;border-radius:8px;border-left:3px solid #f59e0b;">
          <p style="margin:0 0 4px;font-size:15px;"><strong>${i + 1}. ${pick.buildBrief.solution}</strong>${allinTag}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#666;">@${pick.tweet.author} · Score: ${pick.scores.composite.toFixed(1)}/10 · Effort: ${pick.buildBrief.effort}</p>
          ${gh ? `<p style="margin:0 0 8px;">${gh}</p>` : ""}
          <p style="margin:0 0 8px;font-size:13px;color:#333;">${pick.rationale}</p>
          <p style="margin:0 0 4px;font-size:12px;color:#888;font-weight:600;">First steps:</p>
          <ol style="margin:0;padding-left:20px;">${steps}</ol>
          <p style="margin:8px 0 0;font-size:12px;"><a href="${pick.tweet.tweetUrl}" style="color:#3b82f6;">Source tweet</a> · Stack: ${pick.buildBrief.techStack.join(", ")}</p>
        </div>`;
    })
    .join("");

  return `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:16px;color:#f59e0b;margin:0 0 16px;">Idea Scout Picks</h2>
      <p style="font-size:13px;color:#888;margin:0 0 12px;">Top ideas from your liked tweets, cross-referenced with All-In topics + GitHub signals.</p>
      ${picksHtml}
    </div>`;
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

  // Fetch mode + filter repos (infra always included)
  const mode = await fetchProjectMode();
  console.log(`Mode: ${mode}`);
  const filteredRepos = repos.filter(
    (r) => r.category === mode || r.category === "infra"
  );
  console.log(`Filtered to ${filteredRepos.length} repos (${mode} + infra).`);

  const statuses = await fetchAllStatuses(filteredRepos);

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
        content: `Here are my ${filteredRepos.length} side projects (${mode} mode) with their current status:\n\n${statusText}\n\nPick 5 projects I should focus on this week and give me specific action items.`,
      },
    ],
  });

  const recommendations =
    message.content[0].type === "text" ? message.content[0].text : "";
  if (!recommendations) {
    console.error("Empty response from Claude.");
    process.exit(1);
  }

  // Parallel: fetch scout picks, auto-build status, and run dedup check
  console.log("Fetching scout picks, auto-build status, and blog health...");
  const [scoutPicks, autoBuild, dedupWarnings] = await Promise.all([
    fetchScoutPicks(),
    fetchAutoBuildStatus(),
    Promise.resolve(checkForDuplicates()),
  ]);
  console.log(`Got ${scoutPicks.length} scout picks, ${dedupWarnings.length} dedup warnings.`);

  console.log("Building email...");
  const html = buildEmailHtml({
    recommendations,
    statuses,
    scoutPicks,
    mode,
    dedupWarnings,
    autoBuild,
  });
  await sendEmail(html);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
