"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "Printing in 2D",
    tagline: "Talk to an AI. Build a micro-tool.",
    description:
      "Describe a repetitive task to an AI avatar and watch it design a visual workflow diagram in real-time. Pick your personality — Oracle, Spark, Forge, or Flow.",
    tech: ["Next.js", "Claude AI", "Supabase", "Stripe"],
    url: "https://printing-in-2d.vercel.app",
    status: "Building",
    accent: "emerald",
  },
  {
    name: "SignalRoom",
    tagline: "AI-Powered Call Intelligence",
    description:
      "Real-time AI analysis for investor calls. Detects key statements, risk disclosures, and commitments as they happen.",
    tech: ["Next.js", "OpenAI", "Real-time Audio"],
    url: "https://openexchange-demo.vercel.app",
    status: "Live",
    accent: "emerald",
  },
  {
    name: "Sovos Tax Dashboard",
    tagline: "Tax compliance, simplified",
    description:
      "AI-powered tax compliance dashboard with jurisdiction tracking, filing calendar, and automated insights for enterprise teams.",
    tech: ["Next.js", "Claude AI", "Dashboard"],
    url: "https://sovos-tax-mvp.vercel.app",
    status: "Live",
    accent: "emerald",
  },
  {
    name: "Spoke",
    tagline: "Screenshot it. Describe it. Ship it.",
    description:
      "Build internal tools in 60 seconds. Paste a screenshot, tell it what you need, get a working tracker or dashboard instantly.",
    tech: ["Next.js", "AI Vision", "Templates"],
    url: "https://spoke-pi.vercel.app",
    status: "Live",
    accent: "emerald",
  },
  {
    name: "Interview Manager",
    tagline: "Your hiring pipeline, handled",
    description:
      "Track candidates through stages, send interview invites, share booking links, and let recruiters self-schedule.",
    tech: ["Next.js", "Clerk", "Email"],
    url: "https://interview-manager-bay.vercel.app",
    status: "Live",
    accent: "emerald",
  },
  {
    name: "Captain Brunch",
    tagline: "Split bills instantly",
    description:
      "No more awkward math at the table. Enter the bill, add your crew, everyone pays their share in seconds.",
    tech: ["Next.js", "Tailwind", "Payments"],
    url: "https://caption-brunch.vercel.app",
    status: "Live",
    accent: "emerald",
  },
  {
    name: "MLB News",
    tagline: "Baseball at a glance",
    description:
      "A clean, fast news dashboard for MLB fans. Headlines, scores, and updates — no fluff.",
    tech: ["HTML", "CSS", "Static"],
    url: "https://mlb-news.vercel.app",
    status: "Live",
    accent: "emerald",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="min-h-screen grid-bg">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            mithun<span className="text-gradient">.</span>
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com/in/mithun-manjunatha"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-emerald-50 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/MithunXcpu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-emerald-50 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="mailto:mithundragon@gmail.com"
              className="p-2 rounded-xl hover:bg-emerald-50 transition-colors"
              aria-label="Email"
            >
              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full status-pulse" />
              Building in public
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              I build things
              <br />
              <span className="text-gradient">that work.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-xl">
              From idea to working product in hours. AI-native apps, dashboards, and tools — shipped fast.
            </p>
          </motion.div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-40 w-48 h-48 bg-green-300/15 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
      </header>

      {/* Projects */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Projects</h2>
          <p className="text-zinc-400">Click any card to visit the live site.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.a
              key={project.name}
              variants={item}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-3d card-shine group block bg-white border border-zinc-200 rounded-2xl p-6 cursor-pointer hover:border-emerald-300 transition-all duration-300"
            >
              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  project.status === "Building"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    project.status === "Building" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  {project.status}
                </span>
                <svg
                  className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-700 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm font-medium text-emerald-600 mb-3">
                {project.tagline}
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-md text-xs font-medium group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </main>

      {/* About */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-4">About</h2>
            <p className="text-2xl font-medium text-zinc-800 leading-relaxed mb-4">
              I use AI to go from idea to working product in hours, not months.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Every project here was built conversationally with Claude. No traditional coding — just clear thinking, fast iteration, and shipping what works.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/MithunXcpu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View GitHub
              </a>
              <a
                href="https://linkedin.com/in/mithun-manjunatha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-400">
          <p>Mithun Manjunatha</p>
          <p>Built with Next.js, Tailwind & Claude</p>
        </div>
      </footer>
    </div>
  );
}
