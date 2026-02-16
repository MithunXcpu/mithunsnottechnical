# CLAUDE.md — mithunsnottechnical (Portfolio)

## What This Is
Personal portfolio site with blog automation (All-In Podcast derivative takes) and an interviewers tracking page.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (**NEVER** use custom `*` CSS reset or arbitrary bracket values like `bg-[#hex]`)
- Framer Motion for animations
- Marked + gray-matter for Markdown blog rendering
- @anthropic-ai/sdk for Claude-powered blog post generation
- rss-parser + youtube-transcript for All-In Podcast transcript ingestion
- clsx + tailwind-merge for conditional class utilities

## Key Architecture

### Routes (`src/app/`)
- `/` — Home page (`page.tsx`)
- `/blog` — Blog listing
- `/blog/[slug]` — Individual blog post (dynamic route)
- `/interviewers` — Interviewers tracking page

### Components (`src/components/`)
- `ChatWidget.tsx` — Chat widget component
- `animations.tsx` — Shared animation components (Framer Motion)

### Lib (`src/lib/`)
- `blog.ts` — Blog post loading/parsing (reads from `content/posts/`)
- `utils.ts` — Shared utility functions

### Content
- `content/posts/` — Markdown blog posts (frontmatter + body)
- `content/digests/` — Link Vault digest files (auto-generated)

### Scripts
- `scripts/generate-post.ts` — Blog automation script: pulls All-In Podcast transcript, generates derivative take via Claude, commits markdown
- `scripts/generate-link-digest.ts` — Link Vault digest: cross-references curated dev links against portfolio projects via Claude, saves digest to `content/digests/`, emails summary
- Run with: `npm run generate-post` or `npm run link-digest`

## Commands
```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run generate-post  # Generate a new blog post from All-In Podcast
npm run link-digest    # Generate Link Vault digest (cross-ref links × projects)
```

## Blog Automation Pipeline
GitHub Actions cron (Monday 2pm UTC) triggers `generate-post.ts`:
1. Pulls latest All-In Podcast transcript (RSS + YouTube transcript)
2. Claude generates a derivative take blog post
3. Commits markdown to `content/posts/`

Requires GitHub Secrets: `ANTHROPIC_API_KEY`

## Link Vault Digest Pipeline
GitHub Actions cron (Wednesday 2pm UTC) triggers `generate-link-digest.ts`:
1. Fetches 150+ curated links from `MithunXcpu/link-vault` via GitHub API
2. Cross-references links against 20+ portfolio projects via Claude
3. Generates 8-15 actionable matches with ready-to-paste Claude prompts
4. Saves digest to `content/digests/YYYY-MM-DD-link-vault-digest.md`
5. Emails formatted summary via Gmail

Requires GitHub Secrets: `ANTHROPIC_API_KEY`, `GH_PAT`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`

## Conventions
- Accent color: emerald (`--color-primary`)
- Dark theme throughout
- Repo: MithunXcpu/mithunsnottechnical
- Live: portfolio-ebon-five-92.vercel.app
- No Formspree contact page on this project
