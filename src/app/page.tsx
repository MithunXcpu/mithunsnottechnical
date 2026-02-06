"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "Printing in 2D",
    tagline: "Talk to an AI. Build a micro-tool.",
    description:
      "Describe a repetitive task to an AI avatar and it designs a visual workflow diagram in real-time. Four personalities — Oracle, Spark, Forge, and Flow.",
    tech: ["Next.js", "Claude AI", "Supabase", "Stripe"],
    url: "https://printing-in-2d.vercel.app",
    status: "building" as const,
  },
  {
    name: "SignalRoom",
    tagline: "AI-Powered Call Intelligence",
    description:
      "Real-time AI analysis for investor calls. Detects key statements, risk disclosures, and commitments as they happen.",
    tech: ["Next.js", "OpenAI", "Real-time Audio"],
    url: "https://openexchange-demo.vercel.app",
    status: "live" as const,
  },
  {
    name: "Sovos Tax Dashboard",
    tagline: "Tax compliance, simplified",
    description:
      "AI-powered compliance dashboard with jurisdiction tracking, filing calendar, and automated insights for enterprise teams.",
    tech: ["Next.js", "Claude AI", "Dashboard"],
    url: "https://sovos-tax-mvp.vercel.app",
    status: "live" as const,
  },
  {
    name: "Spoke",
    tagline: "Screenshot it. Describe it. Ship it.",
    description:
      "Build internal tools in 60 seconds. Paste a screenshot, describe what you need, get a working tracker or dashboard instantly.",
    tech: ["Next.js", "AI Vision", "Templates"],
    url: "https://spoke-pi.vercel.app",
    status: "live" as const,
  },
  {
    name: "Interview Manager",
    tagline: "Your hiring pipeline, handled",
    description:
      "Track candidates through stages, send interview invites, share booking links, and let recruiters self-schedule.",
    tech: ["Next.js", "Clerk", "Email"],
    url: "https://interview-manager-bay.vercel.app",
    status: "live" as const,
  },
  {
    name: "Captain Brunch",
    tagline: "Split bills instantly",
    description:
      "No more awkward math at the table. Enter the bill, add your crew, everyone pays their share in seconds.",
    tech: ["Next.js", "Tailwind", "Payments"],
    url: "https://caption-brunch.vercel.app",
    status: "live" as const,
  },
  {
    name: "MLB News",
    tagline: "Baseball at a glance",
    description:
      "A clean, fast news dashboard for MLB fans. Headlines, scores, and updates — zero fluff.",
    tech: ["HTML", "CSS", "Static"],
    url: "https://mlb-news.vercel.app",
    status: "live" as const,
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10L10 4M10 4H5M10 4V9" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen noise-overlay">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-[15px] font-bold tracking-tight text-neutral-900">
            mithun<span className="text-accent">.</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#projects" className="nav-link">Work</a>
            <a href="#about" className="nav-link">About</a>
            <a
              href="https://github.com/MithunXcpu"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mithun-manjunatha"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="hero-glow" />
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="accent-line mb-8" />

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-5 text-neutral-900">
              I build products
              <br />
              <span className="text-accent">that ship.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-lg mb-8">
              From idea to working product in hours. AI-native apps, dashboards, and tools — designed to solve real problems.
            </p>

            <div className="flex items-center gap-3">
              <a href="#projects" className="btn-primary">
                View projects
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="mailto:mithundragon@gmail.com" className="btn-secondary">
                Get in touch
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Projects */}
      <main id="projects" className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <span className="section-label">Selected Work</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {projects.length} projects
          </span>
        </motion.div>

        <div className="divider mb-10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-5"
        >
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              variants={fadeUp}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card block p-6 cursor-pointer"
            >
              {/* Top row: number + status */}
              <div className="flex items-center justify-between mb-5">
                <span className="project-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`status-dot ${
                      project.status === "building" ? "building" : ""
                    }`}
                  />
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Title + tagline */}
              <h3 className="text-[17px] font-semibold text-neutral-900 mb-1 flex items-center gap-2">
                {project.name}
                <ArrowUpRight className="arrow-icon text-neutral-300 w-3.5 h-3.5" />
              </h3>
              <p className="text-[13px] font-medium text-green-600 mb-3">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-[13px] text-neutral-500 leading-[1.6] mb-5">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </main>

      {/* About */}
      <section id="about" className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <span className="section-label">About</span>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-medium text-neutral-800 leading-relaxed mb-4">
                I use AI to go from idea to working product in hours, not months.
              </p>
              <p className="text-[15px] text-neutral-500 leading-[1.7] mb-8">
                Every project here was built conversationally with Claude. Clear thinking, fast iteration, and shipping what works. No fluff — just products people can actually use.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/MithunXcpu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/mithun-manjunatha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="footer-text">
            Mithun Manjunatha
          </p>
          <p className="footer-text">
            Built with Next.js + Claude
          </p>
        </div>
      </footer>
    </div>
  );
}
