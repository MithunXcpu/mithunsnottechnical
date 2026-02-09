"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import ChatWidget from "@/components/ChatWidget";

const Aurora = dynamic(() => import("@/components/effects/Aurora"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface" />,
});

/* ─── Data ─── */

const personalProjects = [
  {
    name: "Printing in 2D",
    tagline: "Talk to an AI. Build a micro-tool.",
    description:
      "Describe a repetitive task to an AI avatar and it designs a visual workflow diagram in real-time. Four personalities — Oracle, Spark, Forge, and Flow.",
    tech: ["Next.js", "Claude AI", "Supabase", "Stripe"],
    url: "https://printing-in-2d.vercel.app",
    building: true,
    emoji: "01",
  },
  {
    name: "Spoke",
    tagline: "Screenshot it. Describe it. Ship it.",
    description:
      "Build internal tools in 60 seconds. Paste a screenshot, describe what you need, get a working tracker or dashboard instantly.",
    tech: ["Next.js", "AI Vision", "Templates"],
    url: "https://spoke-pi.vercel.app",
    emoji: "02",
  },
  {
    name: "Interview Manager",
    tagline: "Your hiring pipeline, handled",
    description:
      "Track candidates through stages, send interview invites, share booking links, and let recruiters self-schedule.",
    tech: ["Next.js", "Clerk", "Email"],
    url: "https://interview-manager-bay.vercel.app",
    emoji: "03",
  },
  {
    name: "Captain Brunch",
    tagline: "Split bills instantly",
    description:
      "No more awkward math at the table. Enter the bill, add your crew, everyone pays their share in seconds.",
    tech: ["Next.js", "Tailwind", "Payments"],
    url: "https://caption-brunch.vercel.app",
    emoji: "04",
  },
  {
    name: "TVCode",
    tagline: "Software from your favorite shows — actually built",
    description:
      "Catalogs every app, UI, and tech from TV shows like Iron Man, Severance, and Mr. Robot — then recreates them as functional demos.",
    tech: ["Next.js", "Framer Motion", "Interactive Demos"],
    url: "https://tvcode.vercel.app",
    building: true,
    emoji: "05",
  },
  {
    name: "PsychRef",
    tagline: "Every reference. Every episode. Explained.",
    description:
      "The ultimate guide to every pop culture reference in Psych. All 8 seasons, 121 episodes, with links to the movies and shows referenced.",
    tech: ["Next.js", "Tailwind", "Content DB"],
    url: "https://psych-references.vercel.app",
    building: true,
    emoji: "06",
  },
  {
    name: "IntentSight",
    tagline: "Read the room before they read your price tag",
    description:
      "AI-powered buyer intent detection from video. Facial expressions, body language, and engagement signals analyzed in real-time.",
    tech: ["Next.js", "AI Vision", "Analytics"],
    url: "https://buyerintent.vercel.app",
    building: true,
    emoji: "07",
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
    emoji: "08",
  },
  {
    name: "Sovos Tax Dashboard",
    tagline: "Tax compliance, simplified",
    description:
      "AI-powered compliance dashboard with jurisdiction tracking, filing calendar, and automated insights for enterprise teams.",
    tech: ["Next.js", "Claude AI", "Dashboard"],
    url: "https://sovos-tax-mvp.vercel.app",
    emoji: "09",
  },
];

/* ─── Animations ─── */

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

/* ─── Split Text Component ─── */

function SplitText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.025,
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{ display: "inline-block" }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Project Card ─── */

function ProjectCard({
  p,
  i,
}: {
  p: (typeof personalProjects)[number];
  i: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.a
      ref={cardRef}
      variants={fadeUp}
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card block p-6 group"
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-start justify-between mb-5">
        <span className="project-number">{p.emoji}</span>
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`dot ${
              "building" in p && p.building ? "dot-building" : ""
            }`}
          />
          <span
            className="mono text-[10px] uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {"building" in p && p.building ? "Building" : "Live"}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
        <svg
          className="card-arrow w-4 h-4 mt-1.5 flex-shrink-0"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10L10 4M10 4H5M10 4V9" />
        </svg>
      </div>
      <p className="text-sm font-medium mb-2" style={{ color: "var(--green)" }}>
        {p.tagline}
      </p>
      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {p.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className="card-tag">
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  const [tab, setTab] = useState<"personal" | "interview">("personal");
  const projects = tab === "personal" ? personalProjects : interviewProjects;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen noise-overlay">
      {/* Scroll progress bar */}
      <div className="scroll-progress" />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{
          background: "rgba(12, 12, 12, 0.8)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun
            <span className="green">snottechnical</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#work" className="nav-link">
              Work
            </a>
            <a href="/blog" className="nav-link">
              Blog
            </a>
            <a href="/interviewers" className="nav-link">
              Interviewers
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
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

      {/* ── Hero ── */}
      <motion.header
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Aurora background */}
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Aurora
              colorStops={["#059669", "#10b981", "#047857"]}
              amplitude={1.2}
              blend={0.6}
              speed={0.4}
            />
          )}
          {/* Gradient fade to surface at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-64"
            style={{
              background:
                "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-5 gap-12 items-end">
            {/* Left — 3 cols */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span
                  className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-8"
                  style={{ color: "var(--green)" }}
                >
                  <span
                    className="w-8 h-px"
                    style={{ background: "var(--green)" }}
                  />
                  Portfolio
                </span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8">
                <SplitText text="I build" delay={0.4} />
                <br />
                <SplitText
                  text="products"
                  className="font-display italic"
                  delay={0.7}
                />
                <br />
                <span className="gradient-text">
                  <SplitText text="that ship." delay={1.0} />
                </span>
              </h1>

              <motion.p
                className="text-lg leading-relaxed max-w-md mb-10"
                style={{ color: "var(--color-text-secondary)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                From idea to working product in hours.
                <br />
                AI-native apps, dashboards, and tools.
              </motion.p>

              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
              >
                <a href="#work" className="btn btn-primary">
                  View work
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M7 1v12M7 13l5-5M7 13l-5-5" />
                  </svg>
                </a>
                <a href="mailto:mithundragon@gmail.com" className="btn btn-ghost">
                  Get in touch
                </a>
              </motion.div>
            </div>

            {/* Right — 2 cols: stats */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.7 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "9+", label: "Projects shipped" },
                  { value: "5", label: "Currently building" },
                  { value: "AI", label: "Powered everything" },
                  { value: "0", label: "Days wasted" },
                ].map((stat, si) => (
                  <div
                    key={stat.label}
                    className="p-5 rounded-2xl"
                    style={{
                      background: "rgba(20, 20, 20, 0.6)",
                      border: "1px solid var(--color-border-subtle)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="font-display text-3xl italic mb-1"
                      style={{ color: "var(--green-light)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Scroll
              </span>
              <div
                className="w-px h-8"
                style={{ background: "var(--color-border-hover)" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Work Section ── */}
      <section id="work" className="relative py-24 md:py-32">
        {/* Section glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px]">
          <div className="glow-line" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-12"
          >
            <span
              className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-4"
              style={{ color: "var(--green)" }}
            >
              <span
                className="w-8 h-px"
                style={{ background: "var(--green)" }}
              />
              Selected Work
            </span>
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl md:text-5xl italic tracking-tight">
                Things I&apos;ve built
              </h2>
              <span
                className="mono text-xs hidden sm:block"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {projects.length} projects
              </span>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-10 scroll-reveal">
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

          <div className="glow-line mb-10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid md:grid-cols-2 gap-5"
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.name} p={p} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px]">
          <div className="glow-line" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Left label */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <span
                className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-4"
                style={{ color: "var(--green)" }}
              >
                <span
                  className="w-8 h-px"
                  style={{ background: "var(--green)" }}
                />
                About
              </span>
              <h2 className="font-display text-3xl md:text-5xl italic tracking-tight mb-6">
                Not your typical developer
              </h2>
              <div
                className="w-24 h-px mb-6"
                style={{ background: "var(--color-border-hover)" }}
              />
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Based in the US. Building with AI since 2024.
              </p>
            </motion.div>

            {/* Right content */}
            <motion.div
              className="lg:col-span-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <p
                className="text-xl md:text-2xl font-medium leading-relaxed mb-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                I use AI to go from idea to working product in hours, not months.
              </p>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Every project here was built conversationally with Claude. Clear
                thinking, fast iteration, and shipping what works. No fluff — just
                products people can actually use.
              </p>

              {/* Tech stack pills */}
              <div className="flex flex-wrap gap-2 mb-10">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind",
                  "Claude AI",
                  "Supabase",
                  "Vercel",
                  "Framer Motion",
                ].map((tech) => (
                  <span key={tech} className="card-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href="https://github.com/MithunXcpu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/mithun-manjunatha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative"
        style={{
          borderTop: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Mithun Manjunatha
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Built with Next.js + Claude
          </p>
        </div>
      </footer>

      {/* ── Chat Widget ── */}
      <ChatWidget />
    </div>
  );
}
