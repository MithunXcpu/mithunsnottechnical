import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { checkNewPostAgainstExisting } from "./blog-dedup";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const GITHUB_USER = "MithunXcpu";
const GITHUB_API = "https://api.github.com";

const LIVE_URLS: Record<string, string> = {
  mithunsnottechnical: "https://portfolio-ebon-five-92.vercel.app",
  "esg-mesh": "https://esg-mesh.vercel.app",
  "value-calculator": "https://value-calculator-eta.vercel.app",
};

const SYSTEM_PROMPT = `You are ghostwriting a weekly "What I Built" blog post for Mithun Manjunatha. Mithun is a Solutions Engineer who ships AI-native products fast. He's direct, opinionated, and practical. He's not bragging — he's sharing what he learned by building.

Rules:
- Under 500 words strictly
- Start with the most interesting thing shipped, not a summary
- Use first person ("I shipped...", "The tricky part was...")
- Group related work if multiple repos were touched
- Link to live projects where available using markdown links
- Link to GitHub repos for everything else
- End with what's next or what you learned
- No "This week I..." opening. Jump straight into the most compelling build.
- If only 1-2 repos were touched, go deeper on what changed and why
- If 5+ repos were touched, focus on the theme/pattern, not listing each one`;

interface RepoActivity {
  repo: string;
  url: string;
  liveUrl: string | null;
  commits: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseResponse(text: string): {
  postTitle: string;
  excerpt: string;
  tags: string[];
  body: string;
} {
  const parts = text.split("---");
  const header = parts[0].trim();
  const body = parts.slice(1).join("---").trim();

  let postTitle = "Untitled";
  let excerpt = "";
  let tags: string[] = [];

  for (const line of header.split("\n")) {
    if (line.startsWith("TITLE:")) postTitle = line.replace("TITLE:", "").trim();
    if (line.startsWith("EXCERPT:"))
      excerpt = line.replace("EXCERPT:", "").trim();
    if (line.startsWith("TAGS:"))
      tags = line
        .replace("TAGS:", "")
        .trim()
        .split(",")
        .map((t) => t.trim().toLowerCase());
  }

  // Always include build-recap and weekly tags
  if (!tags.includes("build-recap")) tags.push("build-recap");
  if (!tags.includes("weekly")) tags.push("weekly");

  return { postTitle, excerpt, tags, body };
}

async function ghFetch(endpoint: string) {
  const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-build-recap",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${endpoint}`);
  return res.json();
}

async function fetchWeeklyActivity(): Promise<RepoActivity[] | null> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  console.log(`Fetching repos pushed since ${since}...`);

  const allRepos = await ghFetch(
    `/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`
  );

  const activeRepos = allRepos.filter(
    (r: { pushed_at: string }) => new Date(r.pushed_at) > new Date(since)
  );

  if (activeRepos.length === 0) return null;

  console.log(`Found ${activeRepos.length} active repos this week.`);

  const activity: RepoActivity[] = [];
  for (const repo of activeRepos) {
    try {
      const commits = await ghFetch(
        `/repos/${GITHUB_USER}/${repo.name}/commits?since=${since}&per_page=10`
      );
      const messages = commits
        .map((c: { commit: { message: string } }) =>
          c.commit.message.split("\n")[0]
        )
        .filter(
          (m: string) =>
            !m.startsWith("Merge") && !m.startsWith("blog: auto-generate")
        );

      if (messages.length > 0) {
        activity.push({
          repo: repo.name,
          url: repo.html_url,
          liveUrl: LIVE_URLS[repo.name] || null,
          commits: messages,
        });
      }
    } catch {
      console.warn(`Skipping ${repo.name}: could not fetch commits`);
    }
  }

  return activity.length > 0 ? activity : null;
}

function isDuplicate(): boolean {
  if (!fs.existsSync(POSTS_DIR)) return false;

  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date(
    Date.now() - new Date().getDay() * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 10);

  const existing = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of existing) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    if (
      (file >= weekStart || file >= today) &&
      raw.includes("build-recap")
    ) {
      return true;
    }
  }
  return false;
}

async function main() {
  console.log("Generating weekly build recap...");

  if (isDuplicate()) {
    console.log("Already generated a build recap for this week. Skipping.");
    process.exit(0);
  }

  const activity = await fetchWeeklyActivity();
  if (!activity) {
    console.log("No repo activity this week. Skipping.");
    process.exit(0);
  }

  const activityText = activity
    .map(
      (a) =>
        `## ${a.repo}\n- Live: ${a.liveUrl || "N/A"}\n- GitHub: ${a.url}\n- Commits this week:\n${a.commits.map((c) => `  - ${c}`).join("\n")}`
    )
    .join("\n\n");

  const weekDate = new Date().toISOString().slice(0, 10);

  console.log("Calling Claude...");
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is my GitHub activity for the week of ${weekDate}:\n\n${activityText}\n\nWrite a "What I Built" blog post. Return in this exact format:\n\nTITLE: [post title]\nEXCERPT: [1-2 sentence excerpt]\nTAGS: [comma-separated tags, always include "build-recap" and "weekly"]\n---\n[markdown body with links to projects]`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";
  if (!responseText) {
    console.error("Empty response from Claude.");
    process.exit(1);
  }

  const { postTitle, excerpt, tags, body } = parseResponse(responseText);

  // Pre-publish dedup check
  const dedupWarnings = checkNewPostAgainstExisting(body, postTitle);
  if (dedupWarnings.length > 0) {
    console.warn("[dedup] Content overlap detected (publishing anyway):");
    for (const w of dedupWarnings) {
      console.warn(`  "${w.postA}" overlaps with "${w.postB}" — ${w.overlapPct}%`);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(postTitle);
  const filename = `${today}-${slug}.md`;

  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

  const fileContent = `---
title: "${postTitle.replace(/"/g, '\\"')}"
date: "${today}"
slug: "${slug}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
---

${body}
`;

  fs.writeFileSync(path.join(POSTS_DIR, filename), fileContent);
  console.log(`Generated: content/posts/${filename}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
