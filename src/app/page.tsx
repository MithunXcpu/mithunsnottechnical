"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const personalProjects = [
  {
    name: "Printing in 2D",
    tagline: "Talk to an AI. Build a micro-tool.",
    description:
      "Describe a repetitive task to an AI avatar and it designs a visual workflow diagram in real-time. Four personalities — Oracle, Spark, Forge, and Flow.",
    tech: ["Next.js", "Claude AI", "Supabase", "Stripe"],
    url: "https://printing-in-2d.vercel.app",
    building: true,
  },
  {
    name: "Spoke",
    tagline: "Screenshot it. Describe it. Ship it.",
    description:
      "Build internal tools in 60 seconds. Paste a screenshot, describe what you need, get a working tracker or dashboard instantly.",
    tech: ["Next.js", "AI Vision", "Templates"],
    url: "https://spoke-pi.vercel.app",
  },
  {
    name: "Interview Manager",
    tagline: "Your hiring pipeline, handled",
    description:
      "Track candidates through stages, send interview invites, share booking links, and let recruiters self-schedule.",
    tech: ["Next.js", "Clerk", "Email"],
    url: "https://interview-manager-bay.vercel.app",
  },
  {
    name: "Captain Brunch",
    tagline: "Split bills instantly",
    description:
      "No more awkward math at the table. Enter the bill, add your crew, everyone pays their share in seconds.",
    tech: ["Next.js", "Tailwind", "Payments"],
    url: "https://caption-brunch.vercel.app",
  },
];

const interviewProjects = [
  {
    name: "SignalRoom",
    tagline: "AI-Powered Call Intelligence",
    description:
      "Real-time AI analysis for investor calls. Detects key statements, risk disclosures, and commitments as they happen.",
    tech: ["Next.js", "OpenAI", "Real-time Audio"],
    url: "https://openexchange-demo.vercel.app",
  },
  {
    name: "Sovos Tax Dashboard",
    tagline: "Tax compliance, simplified",
    description:
      "AI-powered compliance dashboard with jurisdiction tracking, filing calendar, and automated insights for enterprise teams.",
    tech: ["Next.js", "Claude AI", "Dashboard"],
    url: "https://sovos-tax-mvp.vercel.app",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function ProjectCard({ p, i }: { p: typeof personalProjects[number]; i: number }) {
  return (
    <motion.a
      variants={fadeUp}
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card block p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="mono text-xs text-neutral-400">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`dot ${"building" in p && p.building ? "dot-building" : ""}`} />
          <span className="mono text-xs uppercase tracking-wider text-neutral-400" style={{ fontSize: 10 }}>
            {"building" in p && p.building ? "Building" : "Live"}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-base font-semibold">{p.name}</h3>
        <svg className="card-arrow w-3.5 h-3.5 mt-1 flex-shrink-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10L10 4M10 4H5M10 4V9"/></svg>
      </div>
      <p className="text-sm font-medium green mb-2">{p.tagline}</p>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">{p.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className="card-tag">{t}</span>
        ))}
      </div>
    </motion.a>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"personal" | "interview">("personal");
  const projects = tab === "personal" ? personalProjects : interviewProjects;

  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-neutral-100" style={{ background: "rgba(250,250,250,0.8)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun<span className="green">snottechnical</span>
          </a>
          <div className="flex items-center gap-5">
            <a href="#work" className="nav-link">Work</a>
            <a href="#about" className="nav-link">About</a>
            <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
            <a href="https://linkedin.com/in/mithun-manjunatha" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={{ paddingTop: 140 }} className="pb-20 md:pb-28 px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mono text-xs tracking-widest uppercase green mb-6">Portfolio</p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
            I build products{" "}
            <span className="green">that ship.</span>
          </h1>

          <p className="text-lg text-neutral-500 leading-relaxed max-w-md mb-8">
            From idea to working product in hours. AI-native apps, dashboards, and tools.
          </p>

          <div className="flex gap-3">
            <a href="#work" className="btn btn-dark">
              View work
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l6-6M9 3H4.5M9 3v4.5"/></svg>
            </a>
            <a href="mailto:mithundragon@gmail.com" className="btn btn-outline">
              Get in touch
            </a>
          </div>
        </motion.div>
      </header>

      {/* ── Work ── */}
      <section id="work" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="flex items-center justify-between mb-6">
          <p className="mono text-xs tracking-widest uppercase green">Selected Work</p>
          <p className="mono text-xs text-neutral-400">{projects.length} projects</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("personal")}
            className={`tab-btn ${tab === "personal" ? "tab-active" : ""}`}
          >
            Personal Projects
          </button>
          <button
            onClick={() => setTab("interview")}
            className={`tab-btn ${tab === "interview" ? "tab-active" : ""}`}
          >
            Interview Projects
          </button>
        </div>

        <div className="section-line mb-8" />

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={stagger}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid md:grid-cols-2 gap-4"
          >
            {projects.map((p, i) => (
              <ProjectCard key={p.name} p={p} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── About ── */}
      <section id="about" className="border-t border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <p className="mono text-xs tracking-widest uppercase green mb-8">About</p>

          <div className="max-w-2xl">
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
              I use AI to go from idea to working product in hours, not months.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-8">
              Every project here was built conversationally with Claude. Clear thinking, fast iteration, and shipping what works. No fluff — just products people can actually use.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/mithun-manjunatha" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-neutral-400">Mithun Manjunatha</p>
          <p className="text-xs text-neutral-400">Built with Next.js + Claude</p>
        </div>
      </footer>
    </div>
  );
}
