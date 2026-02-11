import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const GITHUB_USER = "MithunXcpu";
const GITHUB_API = "https://api.github.com";
const VERCEL_API = "https://api.vercel.com";
const TEMPLATES_DIR = path.join(__dirname, "templates");
const CATALOG_PATH = path.join(__dirname, "repo-catalog.ts");

const ACCENT_MAP: Record<string, { primary: string; hover: string }> = {
  emerald: { primary: "#10b981", hover: "#34d399" },
  violet: { primary: "#8b5cf6", hover: "#a78bfa" },
  amber: { primary: "#f59e0b", hover: "#fbbf24" },
  indigo: { primary: "#6366f1", hover: "#818cf8" },
  slate: { primary: "#64748b", hover: "#94a3b8" },
  sky: { primary: "#0ea5e9", hover: "#38bdf8" },
  blue: { primary: "#3b82f6", hover: "#60a5fa" },
};

interface AutoBuildEntry {
  name: string;
  description: string;
  accent: string;
  appIdea: string;
  techStack: string[];
  sourceUrl: string;
  score: number;
}

function getSupabase() {
  const url = process.env.ANTFARM_SUPABASE_URL;
  const key = process.env.ANTFARM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing ANTFARM_SUPABASE_URL or ANTFARM_SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}

function run(cmd: string, cwd?: string) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit", timeout: 120000 });
}

function runQuiet(cmd: string, cwd?: string): string {
  return execSync(cmd, { cwd, encoding: "utf-8", timeout: 30000 }).trim();
}

async function repoExists(name: string): Promise<boolean> {
  const token = process.env.GH_PAT;
  if (!token) throw new Error("Missing GH_PAT");

  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_USER}/${name}`, {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": "auto-scaffold" },
  });
  return res.ok;
}

function fillTemplate(templateFile: string, vars: Record<string, string>): string {
  let content = fs.readFileSync(path.join(TEMPLATES_DIR, templateFile), "utf-8");
  for (const [key, val] of Object.entries(vars)) {
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val);
  }
  return content;
}

function appendToCatalog(entry: {
  name: string;
  repo: string;
  githubUrl: string;
  summary: string;
  appIdea: string;
}) {
  let catalog = fs.readFileSync(CATALOG_PATH, "utf-8");

  const newEntry = `  {
    name: "${entry.name}",
    repo: "${entry.repo}",
    githubUrl: "${entry.githubUrl}",
    summary: "${entry.summary.replace(/"/g, '\\"')}",
    appIdea: "${entry.appIdea.replace(/"/g, '\\"')}",
    category: "passion",
  },`;

  // Insert before the closing ];
  catalog = catalog.replace(/\n\];\s*$/, `\n${newEntry}\n];\n`);
  fs.writeFileSync(CATALOG_PATH, catalog);
}

async function main() {
  console.log("Auto-scaffold: checking for pending build...");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("agent_memory")
    .select("value")
    .eq("agent_name", "scout")
    .eq("key", "auto_build_next")
    .single();

  if (error || !data?.value) {
    console.log("No pending auto-build. Exiting.");
    process.exit(0);
  }

  const build = data.value as AutoBuildEntry;
  console.log(`Found pending build: ${build.name} (score ${build.score})`);

  // Check if repo already exists
  if (await repoExists(build.name)) {
    console.log(`Repo ${GITHUB_USER}/${build.name} already exists. Clearing queue.`);
    await supabase.from("agent_memory").delete()
      .eq("agent_name", "scout")
      .eq("key", "auto_build_next");
    process.exit(0);
  }

  const projectDir = path.join(process.cwd(), "..", build.name);
  const accent = ACCENT_MAP[build.accent] || ACCENT_MAP.emerald;
  const displayName = build.name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Step 1: Create Next.js project
  console.log("\n1. Creating Next.js project...");
  run(
    `npx create-next-app@latest ${build.name} --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm --yes`,
    path.join(process.cwd(), "..")
  );

  // Step 2: Install extra dependencies
  console.log("\n2. Installing dependencies...");
  run("npm install framer-motion lucide-react recharts", projectDir);

  // Step 3: Write globals.css with accent colors
  console.log("\n3. Writing globals.css...");
  const globalsContent = fillTemplate("globals.css", {
    PRIMARY_COLOR: accent.primary,
    PRIMARY_HOVER: accent.hover,
  });
  fs.writeFileSync(path.join(projectDir, "src/app/globals.css"), globalsContent);

  // Step 4: Write CLAUDE.md
  console.log("\n4. Writing CLAUDE.md...");
  const claudeMd = fillTemplate("CLAUDE.md.template", {
    PROJECT_NAME: displayName,
    DESCRIPTION: build.description,
    ACCENT_COLOR: build.accent,
  });
  fs.writeFileSync(path.join(projectDir, "CLAUDE.md"), claudeMd);

  // Step 5: Write contact page
  console.log("\n5. Writing contact page...");
  fs.mkdirSync(path.join(projectDir, "src/app/contact"), { recursive: true });
  fs.copyFileSync(
    path.join(TEMPLATES_DIR, "contact-page.tsx"),
    path.join(projectDir, "src/app/contact/page.tsx")
  );

  // Step 6: Write landing page
  console.log("\n6. Writing landing page...");
  const landingContent = fillTemplate("landing-page.tsx", {
    TITLE: displayName,
    DESCRIPTION: build.description,
    GITHUB_URL: `https://github.com/${GITHUB_USER}/${build.name}`,
  });
  fs.writeFileSync(path.join(projectDir, "src/app/page.tsx"), landingContent);

  // Step 7: Git init + commit
  console.log("\n7. Initializing git...");
  run("git init", projectDir);
  run("git add -A", projectDir);
  run(`git commit -m "Auto-scaffolded from Scout pick: ${build.name}"`, projectDir);

  // Step 8: Create GitHub repo + push
  console.log("\n8. Creating GitHub repo...");
  run(
    `gh repo create ${GITHUB_USER}/${build.name} --public --source=. --push`,
    projectDir
  );

  // Step 9: Create Vercel project via API
  console.log("\n9. Creating Vercel project...");
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelOrgId = process.env.VERCEL_ORG_ID;

  if (vercelToken && vercelOrgId) {
    try {
      const createRes = await fetch(`${VERCEL_API}/v10/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: build.name,
          framework: "nextjs",
          gitRepository: {
            type: "github",
            repo: `${GITHUB_USER}/${build.name}`,
          },
          teamId: vercelOrgId,
        }),
      });

      if (createRes.ok) {
        const project = await createRes.json();
        console.log(`  Vercel project created: ${project.name}`);
      } else {
        const err = await createRes.text();
        console.warn(`  Vercel project creation failed: ${err}`);
      }
    } catch (err) {
      console.warn("  Vercel API error:", err);
    }
  } else {
    console.log("  Skipping Vercel (missing VERCEL_TOKEN or VERCEL_ORG_ID).");
  }

  // Step 10: Update repo catalog
  console.log("\n10. Updating repo catalog...");
  appendToCatalog({
    name: displayName,
    repo: `${GITHUB_USER}/${build.name}`,
    githubUrl: `https://github.com/${GITHUB_USER}/${build.name}`,
    summary: build.description,
    appIdea: build.appIdea,
  });

  // Step 11: Clear auto_build_next from Supabase
  console.log("\n11. Clearing build queue...");
  await supabase.from("agent_memory").delete()
    .eq("agent_name", "scout")
    .eq("key", "auto_build_next");

  // Step 12: Clean up project dir (GitHub Actions workspace)
  console.log("\n12. Cleaning up...");
  try {
    fs.rmSync(projectDir, { recursive: true, force: true });
  } catch {
    console.warn("  Could not remove project dir (may be handled by CI).");
  }

  console.log(`\nAuto-scaffold complete: ${GITHUB_USER}/${build.name}`);
  console.log(`  GitHub: https://github.com/${GITHUB_USER}/${build.name}`);
}

main().catch((err) => {
  console.error("Auto-scaffold failed:", err);
  process.exit(1);
});
