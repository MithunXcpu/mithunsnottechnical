import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { repos } from "./repo-catalog";

const GITHUB_API = "https://api.github.com";
const LINK_VAULT_REPO = "MithunXcpu/link-vault";
const LINK_VAULT_FILE = "app/data.ts";
const DIGESTS_DIR = path.join(process.cwd(), "content/digests");

const SYSTEM_PROMPT = `You are Mithun's Link Vault advisor. He has 20+ portfolio projects and 150+ curated dev links (tools, libraries, articles, tutorials). Your job is to cross-reference the links against his projects and find actionable matches.

Rules:
- Return 8-15 matches, grouped by project
- Each match must include:
  1. The link name and URL
  2. Which project it applies to (use the exact project name)
  3. Why it's a good match (2-3 specific sentences — mention concrete features/files that would benefit)
  4. A ready-to-paste Claude prompt that Mithun can use to implement the improvement (be specific: mention the project repo, the tool/library, and exactly what to build)
- Prioritize matches that:
  - Solve a real gap in the project (missing feature, outdated pattern)
  - Are quick wins (< 2 hours to implement)
  - Make the project more impressive for interviews or demos
- At the end, add a "Top 3 Quick Wins" section picking the 3 fastest, highest-impact matches
- Format the Claude prompts as fenced code blocks with a "Prompt:" label
- Keep the total response under 3000 words
- Use markdown formatting throughout`;

interface LinkEntry {
  id: string;
  type: string;
  url: string;
  title: string;
  summary: string;
  category: string;
  scope: string;
  useCase: string;
  appIdea: string;
  hasGithub?: boolean;
  githubUrl?: string;
  stars?: string;
  tags?: string[];
}

async function ghFetch(endpoint: string) {
  const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-link-digest",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${endpoint}`);
  return res.json();
}

async function fetchLinkVaultData(): Promise<string> {
  console.log("Fetching Link Vault data from GitHub...");
  const data = await ghFetch(
    `/repos/${LINK_VAULT_REPO}/contents/${LINK_VAULT_FILE}`
  );
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  console.log(`Fetched ${content.length} chars from ${LINK_VAULT_FILE}`);
  return content;
}

function parseLinkEntries(raw: string): LinkEntry[] {
  // Strip TypeScript type exports/interfaces, keep only the array data
  // Remove: export type ..., export interface ..., and type annotations on the array
  let cleaned = raw
    .replace(/export\s+type\s+\w+\s*=[\s\S]*?;\s*/g, "")
    .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}\s*/g, "")
    .replace(/export\s+const\s+links:\s*LinkEntry\[\]\s*=/, "const __links =")
    .replace(/:\s*LinkType/g, "")
    .replace(/:\s*LinkCategory/g, "")
    .replace(/:\s*LinkScope/g, "");

  try {
    // Evaluate the cleaned JS to extract the array
    const fn = new Function(`${cleaned}; return __links;`);
    const parsed = fn() as LinkEntry[];
    console.log(`Parsed ${parsed.length} link entries.`);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Link Vault data via eval, falling back to regex:", err);

    // Regex fallback: extract title + url per object block
    const entries: LinkEntry[] = [];
    const blockPattern = /\{[^{}]*?id:\s*"([^"]+)"[^{}]*?url:\s*"([^"]+)"[^{}]*?title:\s*"([^"]+)"[^{}]*?\}/gs;
    let match;
    while ((match = blockPattern.exec(raw)) !== null) {
      entries.push({
        id: match[1],
        type: "unknown",
        url: match[2],
        title: match[3],
        summary: "",
        category: "uncategorized",
        scope: "work",
        useCase: "",
        appIdea: "",
      });
    }
    console.log(`Regex fallback parsed ${entries.length} link entries.`);
    return entries;
  }
}

function buildProjectSummary(): string {
  return repos
    .map(
      (r) =>
        `- **${r.name}** (${r.repo}): ${r.summary} | App idea: ${r.appIdea} | Category: ${r.category}`
    )
    .join("\n");
}

function buildLinkSummary(links: LinkEntry[]): string {
  return links
    .map(
      (l) =>
        `- [${l.title}](${l.url}) [${l.type}/${l.category}]: ${l.summary}${l.useCase ? ` | Use case: ${l.useCase}` : ""}${l.appIdea ? ` | App idea: ${l.appIdea}` : ""}`
    )
    .join("\n");
}

function isDuplicateDigest(): boolean {
  if (!fs.existsSync(DIGESTS_DIR)) return false;

  const today = new Date().toISOString().slice(0, 10);
  const existing = fs.readdirSync(DIGESTS_DIR).filter((f) => f.endsWith(".md"));
  return existing.some((f) => f.startsWith(today));
}

function buildEmailHtml(
  digestMarkdown: string,
  linkCount: number,
  projectCount: number
): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Convert markdown to simple HTML for email
  const bodyHtml = digestMarkdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("### "))
        return `<h3 style="font-size:15px;color:#6366f1;margin:20px 0 8px;">${line.slice(4)}</h3>`;
      if (line.startsWith("## "))
        return `<h2 style="font-size:17px;color:#10b981;margin:24px 0 12px;">${line.slice(3)}</h2>`;
      if (line.startsWith("# "))
        return `<h1 style="font-size:20px;margin:0 0 8px;">${line.slice(2)}</h1>`;
      if (line.startsWith("```"))
        return line === "```"
          ? `</pre>`
          : `<pre style="background:#1e1e2e;color:#cdd6f4;padding:12px 16px;border-radius:8px;font-size:12px;overflow-x:auto;white-space:pre-wrap;">`;
      if (line.startsWith("- **"))
        return `<p style="margin:4px 0;font-size:14px;">${line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</p>`;
      if (line.startsWith("- "))
        return `<p style="margin:4px 0 4px 16px;font-size:13px;color:#555;">${line.slice(2)}</p>`;
      if (line.startsWith("**"))
        return `<p style="margin:8px 0 4px;font-size:14px;"><strong>${line.replace(/\*\*/g, "")}</strong></p>`;
      if (line.trim() === "") return "<br>";
      return `<p style="margin:4px 0;font-size:14px;color:#333;">${line}</p>`;
    })
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fafafa;">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="font-size:22px;margin:0 0 4px;">Link Vault Digest</h1>
    <p style="color:#888;font-size:13px;margin:0 0 16px;">${dateStr}</p>

    <div style="display:flex;gap:16px;margin-bottom:24px;">
      <div style="background:#f0fdf4;border-radius:8px;padding:12px 16px;flex:1;text-align:center;">
        <p style="margin:0;font-size:24px;font-weight:700;color:#10b981;">${linkCount}</p>
        <p style="margin:0;font-size:11px;color:#888;">Links Scanned</p>
      </div>
      <div style="background:#eef2ff;border-radius:8px;padding:12px 16px;flex:1;text-align:center;">
        <p style="margin:0;font-size:24px;font-weight:700;color:#6366f1;">${projectCount}</p>
        <p style="margin:0;font-size:11px;color:#888;">Projects Checked</p>
      </div>
    </div>

    ${bodyHtml}
  </div>
  <p style="text-align:center;font-size:11px;color:#aaa;margin-top:16px;">Generated by your portfolio automation pipeline</p>
</body>
</html>`;
}

async function sendEmail(html: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.log("No Gmail credentials, skipping email.");
    return;
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  await transport.sendMail({
    from: `"Portfolio Bot" <${user}>`,
    to: user,
    subject: `Link Vault Digest — ${dateStr}`,
    html,
  });

  console.log("Email sent successfully.");
}

async function main() {
  console.log("Generating Link Vault digest...");

  // Duplicate check
  if (isDuplicateDigest()) {
    console.log("Already generated a digest for today. Skipping.");
    process.exit(0);
  }

  // Fetch Link Vault data
  const rawData = await fetchLinkVaultData();
  const links = parseLinkEntries(rawData);

  if (links.length === 0) {
    console.error("No links parsed from Link Vault. Check the data format.");
    process.exit(1);
  }

  // Build summaries
  const projectSummary = buildProjectSummary();
  const linkSummary = buildLinkSummary(links);

  // Call Claude for cross-reference analysis
  console.log(
    `Calling Claude to cross-reference ${links.length} links against ${repos.length} projects...`
  );
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here are my ${repos.length} portfolio projects:\n\n${projectSummary}\n\n---\n\nHere are my ${links.length} curated dev links from Link Vault:\n\n${linkSummary}\n\nCross-reference these links against my projects. Find 8-15 actionable matches where a link could genuinely improve a project. Include ready-to-paste Claude prompts for each match.`,
      },
    ],
  });

  const digestContent =
    message.content[0].type === "text" ? message.content[0].text : "";
  if (!digestContent) {
    console.error("Empty response from Claude.");
    process.exit(1);
  }

  // Save digest markdown
  const today = new Date().toISOString().slice(0, 10);
  const filename = `${today}-link-vault-digest.md`;

  if (!fs.existsSync(DIGESTS_DIR)) fs.mkdirSync(DIGESTS_DIR, { recursive: true });

  const fileContent = `---
title: "Link Vault Digest"
date: "${today}"
linksScanned: ${links.length}
projectsChecked: ${repos.length}
---

${digestContent}
`;

  fs.writeFileSync(path.join(DIGESTS_DIR, filename), fileContent);
  console.log(`Saved: content/digests/${filename}`);

  // Send email
  const emailHtml = buildEmailHtml(digestContent, links.length, repos.length);
  await sendEmail(emailHtml);

  console.log("Link Vault digest complete.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
