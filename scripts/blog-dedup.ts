import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface DedupWarning {
  postA: string;
  postB: string;
  overlapPct: number;
}

interface PostData {
  filename: string;
  title: string;
  body: string;
  words: string[];
}

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all",
  "can", "her", "was", "one", "our", "out", "has", "have",
  "this", "that", "with", "from", "they", "been", "said",
  "each", "which", "their", "will", "other", "about", "many",
  "then", "them", "these", "some", "would", "make", "like",
  "into", "just", "over", "such", "take", "than", "very",
  "what", "when", "where", "how", "who", "why", "more",
  "also", "here", "there", "could", "should", "still",
  "well", "back", "only", "even", "most", "after", "before",
]);

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function wordOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const matches = a.filter((w) => setB.has(w)).length;
  return matches / Math.max(a.length, b.length);
}

function parseFrontmatter(content: string): { title: string; body: string } {
  const lines = content.split("\n");
  let title = "";
  let inFrontmatter = false;
  let frontmatterEnd = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        frontmatterEnd = i + 1;
        break;
      }
    }
    if (inFrontmatter && lines[i].startsWith("title:")) {
      title = lines[i].replace("title:", "").trim().replace(/^["']|["']$/g, "");
    }
  }

  const body = lines.slice(frontmatterEnd).join("\n").trim();
  return { title, body };
}

function loadPosts(): PostData[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((filename) => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { title, body } = parseFrontmatter(content);
    const words = extractWords(body);
    return { filename, title, body, words };
  });
}

/**
 * Check all published posts for content overlap.
 * Returns pairs with > 50% word overlap.
 */
export function checkForDuplicates(): DedupWarning[] {
  const posts = loadPosts();
  const warnings: DedupWarning[] = [];

  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const overlap = wordOverlap(posts[i].words, posts[j].words);
      if (overlap > 0.5) {
        warnings.push({
          postA: posts[i].title || posts[i].filename,
          postB: posts[j].title || posts[j].filename,
          overlapPct: Math.round(overlap * 100),
        });
      }
    }
  }

  return warnings;
}

/**
 * Check a new post's content against all existing posts.
 * Used as a pre-publish check in generators.
 */
export function checkNewPostAgainstExisting(
  newContent: string,
  newTitle: string
): DedupWarning[] {
  const posts = loadPosts();
  const newWords = extractWords(newContent);
  const warnings: DedupWarning[] = [];

  for (const post of posts) {
    const overlap = wordOverlap(newWords, post.words);
    if (overlap > 0.5) {
      warnings.push({
        postA: newTitle,
        postB: post.title || post.filename,
        overlapPct: Math.round(overlap * 100),
      });
    }
  }

  return warnings;
}

// Allow running standalone: npx tsx scripts/blog-dedup.ts
if (require.main === module) {
  const warnings = checkForDuplicates();
  if (warnings.length === 0) {
    console.log("All posts unique — no duplicates detected.");
  } else {
    console.log(`Found ${warnings.length} potential duplicate(s):`);
    for (const w of warnings) {
      console.log(`  "${w.postA}" <-> "${w.postB}" — ${w.overlapPct}% overlap`);
    }
  }
}
