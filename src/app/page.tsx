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

function QA({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qa-item" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">{q}</p>
        <span className="text-neutral-400 flex-shrink-0 mt-0.5" style={{ fontSize: 18, lineHeight: 1, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      {open && (
        <p className="text-sm text-neutral-500 leading-relaxed mt-3">{a}</p>
      )}
    </div>
  );
}

function ChatBot() {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "them", text: "I noticed some gaps in your resume. Can you explain?" },
    { from: "me", text: "Absolutely. Between Infor and Blend (Jul 2020 — May 2021), I took time to reset after sprinting through internships and my first full-time role. I needed to figure out what kind of career I actually wanted — not just chase the next title." },
    { from: "them", text: "And the gap between Workiva and Datamaran?" },
    { from: "me", text: "Feb — Sep 2024. I was actively interviewing and building. That's when I started using AI tools seriously — prototyping apps, learning prompt engineering, shipping side projects. Every project on this portfolio came from that stretch." },
    { from: "them", text: "So it wasn't idle time?" },
    { from: "me", text: "It was the most productive learning period of my career. I came back to Datamaran and closed $700K+ ARR in my first year. The time off made me sharper, not weaker." },
  ];

  const visible = messages.slice(0, step + 1);
  const hasMore = step < messages.length - 1;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="dot" style={{ width: 8, height: 8 }} />
        <span className="mono text-xs" style={{ fontSize: 11 }}>mithun — explaining the gaps</span>
      </div>
      <div className="chat-body">
        {visible.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.from === "me" ? "chat-me" : "chat-them"}`}>
            {m.text}
          </div>
        ))}
      </div>
      {hasMore && (
        <button className="chat-next" onClick={() => setStep(step + 1)}>
          Continue conversation
        </button>
      )}
      {!hasMore && (
        <p className="text-xs text-neutral-400 text-center py-3">End of conversation</p>
      )}
    </div>
  );
}

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
            <a href="/blog" className="nav-link">Blog</a>
            <a href="#interviewers" className="nav-link">For Interviewers</a>
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

      {/* ── For Interviewers ── */}
      <section id="interviewers" className="border-t border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <p className="mono text-xs tracking-widest uppercase green mb-4">For Interviewers</p>
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-3">
            What this page is — and why it exists.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed mb-10 max-w-2xl">
            This isn&apos;t a traditional portfolio. I&apos;m a Solutions Engineer, not a developer. Every project here was built conversationally with AI — Claude, specifically — to demonstrate how I think about problems, scope solutions, and ship working products. The code is the output. The thinking is the skill.
          </p>

          {/* Key numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { num: "$1.4M+", label: "ARR closed" },
              { num: "6+", label: "Years in SaaS" },
              { num: "150%+", label: "ROI models built" },
              { num: "95%", label: "NPS achieved" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <p className="text-2xl font-bold green">{s.num}</p>
                <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Experience timeline */}
          <p className="mono text-xs tracking-widest uppercase green mb-6">Experience</p>
          <div className="space-y-0 mb-14">
            {[
              { co: "Diligent", role: "Senior Value Engineer", dates: "May 2025 — Present", desc: "GRC & AI governance solutions for boards. Value-based selling to Financial Services, Healthcare, Public Sector." },
              { co: "Datamaran", role: "Senior Solution Engineer", dates: "Sep 2024 — Apr 2025", desc: "AI-powered ESG analytics. Closed $700K+ ARR with Fortune 500 clients. CSRD/SEC/ISSB compliance." },
              { co: "Workiva", role: "Solution Engineer", dates: "Jul 2022 — Feb 2024", desc: "Enterprise reporting & ESG. Won $700K ARR. Delivered ERP integration demos (SAP, Oracle, Workday)." },
              { co: "Blend", role: "Mid-Market Solution Engineer", dates: "May 2021 — Jun 2022", desc: "Digital lending platform. Beat quota 4/5 quarters. API integrations with FIS, Jack Henry, Fiserv." },
              { co: "Infor", role: "Product Solutions Analyst", dates: "Oct 2019 — Jul 2020", desc: "Enterprise ERP & HCM. Achieved 95% NPS. Healthcare and Manufacturing verticals." },
            ].map((job, i) => (
              <div key={job.co} className="timeline-item">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{job.co}<span className="text-neutral-400 font-normal"> — {job.role}</span></p>
                    <p className="text-sm text-neutral-500 leading-relaxed mt-1">{job.desc}</p>
                  </div>
                  <p className="mono text-xs text-neutral-400 flex-shrink-0" style={{ fontSize: 11 }}>{job.dates}</p>
                </div>
                {i < 4 && <div className="section-line mt-4" />}
              </div>
            ))}
          </div>

          {/* Chatbot for gaps */}
          <p className="mono text-xs tracking-widest uppercase green mb-6">The Gaps — Explained</p>
          <div className="mb-14">
            <ChatBot />
          </div>

          {/* Q&A */}
          <p className="mono text-xs tracking-widest uppercase green mb-6">Honest Answers</p>
          <div className="space-y-6 max-w-2xl">
            <QA
              q="What's the hardest project you've worked on?"
              a="The Datamaran ESG compliance framework. I had to align an AI analytics platform with three overlapping regulatory frameworks — CSRD, SEC climate disclosure, and ISSB — each with different timelines, scopes, and reporting requirements. The clients were Fortune 500 companies who needed a single pane of glass across all three. I built the integration framework that mapped data points across standards, and it cut compliance cycles by 20%. The hard part wasn't the tech — it was translating regulatory ambiguity into something a product team could build against."
            />
            <QA
              q="What's your biggest weakness?"
              a="I over-index on speed. I'll ship a working demo in a day when the team expected a week — which sounds good, but it means I sometimes skip the socialization step. I've learned that in enterprise sales, getting buy-in from stakeholders matters as much as the solution itself. At Diligent, I've been intentional about slowing down to bring people along, even when the prototype is already done."
            />
            <QA
              q="Why Solutions Engineering and not pure engineering?"
              a="Because the best solution is the one that gets adopted. I've seen brilliant technical implementations fail because nobody translated them into business value. I sit at the intersection — I can build the demo, run the discovery call, model the ROI, and present to a CFO. That's rare, and it's where I create the most impact. This portfolio is proof: I didn't just write code, I identified real problems and shipped products that work."
            />
            <QA
              q="Why should we hire you?"
              a="I've closed $1.4M+ in ARR across three platforms. I co-authored a GTM playbook that lifted close rates 18%. I build working prototypes with AI faster than most teams can write a spec. And I do all of it while making complex enterprise software feel simple. I'm not choosing between technical and strategic — I'm both."
            />
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="border-t border-neutral-100" style={{ background: "#fafafa" }}>
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
