import Anthropic from "@anthropic-ai/sdk";
import { TwitterApi } from "twitter-api-v2";
import { YoutubeTranscript } from "youtube-transcript";
import Parser from "rss-parser";
import fs from "fs";
import path from "path";

const YOUTUBE_RSS =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCESLZhusAkFfsNsApnjF_Cg";
const POSTS_DIR = path.join(process.cwd(), "content/posts");
const BLOG_BASE_URL = "https://portfolio-ebon-five-92.vercel.app/blog";

const SYSTEM_PROMPT = `You are ghostwriting a blog post for Mithun Manjunatha. Mithun is a Solutions Engineer who builds AI-native products. He's direct, opinionated, practical, and thinks in terms of business outcomes. He's not a journalist — he's a builder who has opinions about tech, business, and startups. His style is conversational but sharp. No fluff.

The post should be inspired by Chamath Palihapitiya's take from the All-In Podcast, but it must be Mithun's OWN derivative opinion. He can agree, disagree, extend, or reframe Chamath's point. The post should feel like a smart friend texting you their hot take, not a news summary.

Rules:
- Under 500 words strictly
- No "In this week's episode..." framing. Jump straight into the take.
- Use first person ("I think...", "Here's what bugs me...")
- One clear thesis per post
- If there are multiple interesting topics, pick the strongest one or find a thread connecting them
- End with a forward-looking thought, not a summary`;

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
  tweet: string;
  body: string;
} {
  const parts = text.split("---");
  const header = parts[0].trim();
  const body = parts.slice(1).join("---").trim();

  let postTitle = "Untitled";
  let excerpt = "";
  let tags: string[] = [];
  let tweet = "";

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
    if (line.startsWith("TWEET:"))
      tweet = line.replace("TWEET:", "").trim();
  }

  return { postTitle, excerpt, tags, tweet, body };
}

async function postTweet(tweetText: string, blogUrl: string) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.log("Twitter credentials not configured. Skipping tweet.");
    return;
  }

  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret,
  });

  const fullTweet = `${tweetText}\n\n${blogUrl}`;
  try {
    const { data } = await client.v2.tweet(fullTweet);
    console.log(`Tweet posted: https://x.com/i/status/${data.id}`);
  } catch (err) {
    console.error("Failed to post tweet:", err);
  }
}

async function main() {
  console.log("Fetching latest All-In episode from YouTube RSS...");

  const parser = new Parser();
  const feed = await parser.parseURL(YOUTUBE_RSS);
  const latest = feed.items[0];

  if (!latest || !latest.id) {
    console.log("No episodes found in feed.");
    process.exit(0);
  }

  const videoId = latest.id.split(":").pop()!;
  const episodeTitle = latest.title || "Unknown Episode";
  console.log(`Latest: "${episodeTitle}" (${videoId})`);

  // Check if already generated
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  const existing = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of existing) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    if (raw.includes(videoId) || raw.includes(episodeTitle)) {
      console.log(`Already generated a post for this episode. Skipping.`);
      process.exit(0);
    }
  }

  // Fetch transcript
  console.log("Fetching YouTube transcript...");
  let transcript: string;
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    transcript = segments.map((s) => s.text).join(" ");
    console.log(`Transcript length: ${transcript.length} chars`);
  } catch (err) {
    console.error("Failed to fetch transcript:", err);
    console.log("Falling back to episode title/description only.");
    transcript = `Episode title: ${episodeTitle}\nDescription: ${latest.contentSnippet || latest.content || "No description available."}`;
  }

  // Truncate if very long (keep under 100K chars for cost)
  if (transcript.length > 100000) {
    transcript = transcript.slice(0, 100000);
    console.log("Truncated transcript to 100K chars.");
  }

  // Call Claude
  console.log("Generating blog post with Claude...");
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the transcript from the latest All-In Podcast episode titled "${episodeTitle}":\n\n${transcript}\n\nWrite a blog post as Mithun, derivative of Chamath's most interesting take from this episode. Return your response in this exact format:\n\nTITLE: [post title]\nEXCERPT: [1-2 sentence excerpt for the listing page]\nTAGS: [comma-separated tags]\nTWEET: [an original one-liner for Twitter/X that's catchy and opinionated — NOT a summary. Max 200 chars. Do NOT include the blog link, it will be appended automatically.]\n---\n[markdown body of the post]`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  if (!responseText) {
    console.error("Empty response from Claude.");
    process.exit(1);
  }

  const { postTitle, excerpt, tags, tweet, body } = parseResponse(responseText);
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(postTitle);
  const filename = `${today}-${slug}.md`;

  const fileContent = `---
title: "${postTitle.replace(/"/g, '\\"')}"
date: "${today}"
slug: "${slug}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
episode: "${episodeTitle.replace(/"/g, '\\"')}"
videoId: "${videoId}"
---

${body}
`;

  fs.writeFileSync(path.join(POSTS_DIR, filename), fileContent);
  console.log(`Generated: content/posts/${filename}`);

  // Post to Twitter/X
  const blogUrl = `${BLOG_BASE_URL}/${slug}`;
  if (tweet) {
    await postTweet(tweet, blogUrl);
  } else {
    console.log("No tweet text generated. Skipping tweet.")
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
