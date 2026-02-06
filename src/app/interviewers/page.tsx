"use client";

import { useState } from "react";
import Link from "next/link";

function QA({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qa-item" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">{q}</p>
        <span
          className="text-neutral-400 flex-shrink-0 mt-0.5"
          style={{
            fontSize: 18,
            lineHeight: 1,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
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
    {
      from: "them",
      text: "I noticed some gaps in your resume. Can you explain?",
    },
    {
      from: "me",
      text: "Absolutely. Between Infor and Blend (Jul 2020 — May 2021), I took time to reset after sprinting through internships and my first full-time role. I needed to figure out what kind of career I actually wanted — not just chase the next title.",
    },
    {
      from: "them",
      text: "And the gap between Workiva and Datamaran?",
    },
    {
      from: "me",
      text: "Feb — Sep 2024. I was actively interviewing and building. That's when I started using AI tools seriously — prototyping apps, learning prompt engineering, shipping side projects. Every project on this portfolio came from that stretch.",
    },
    { from: "them", text: "So it wasn't idle time?" },
    {
      from: "me",
      text: "It was the most productive learning period of my career. I came back to Datamaran and closed $700K+ ARR in my first year. The time off made me sharper, not weaker.",
    },
  ];

  const visible = messages.slice(0, step + 1);
  const hasMore = step < messages.length - 1;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="dot" style={{ width: 8, height: 8 }} />
        <span className="mono text-xs" style={{ fontSize: 11 }}>
          mithun — explaining the gaps
        </span>
      </div>
      <div className="chat-body">
        {visible.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.from === "me" ? "chat-me" : "chat-them"}`}
          >
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
        <p className="text-xs text-neutral-400 text-center py-3">
          End of conversation
        </p>
      )}
    </div>
  );
}

const experience = [
  {
    co: "Diligent",
    role: "Senior Value Engineer",
    dates: "May 2025 — Present",
    desc: "GRC & AI governance solutions for boards. Value-based selling to Financial Services, Healthcare, Public Sector.",
  },
  {
    co: "Datamaran",
    role: "Senior Solution Engineer",
    dates: "Sep 2024 — Apr 2025",
    desc: "AI-powered ESG analytics. Closed $700K+ ARR with Fortune 500 clients. CSRD/SEC/ISSB compliance.",
  },
  {
    co: "Workiva",
    role: "Solution Engineer",
    dates: "Jul 2022 — Feb 2024",
    desc: "Enterprise reporting & ESG. Won $700K ARR. Delivered ERP integration demos (SAP, Oracle, Workday).",
  },
  {
    co: "Blend",
    role: "Mid-Market Solution Engineer",
    dates: "May 2021 — Jun 2022",
    desc: "Digital lending platform. Beat quota 4/5 quarters. API integrations with FIS, Jack Henry, Fiserv.",
  },
  {
    co: "Infor",
    role: "Product Solutions Analyst",
    dates: "Oct 2019 — Jul 2020",
    desc: "Enterprise ERP & HCM. Achieved 95% NPS. Healthcare and Manufacturing verticals.",
  },
];

const qaItems = [
  {
    q: "What's the hardest project you've worked on?",
    a: "The Datamaran ESG compliance framework. I had to align an AI analytics platform with three overlapping regulatory frameworks — CSRD, SEC climate disclosure, and ISSB — each with different timelines, scopes, and reporting requirements. The clients were Fortune 500 companies who needed a single pane of glass across all three. I built the integration framework that mapped data points across standards, and it cut compliance cycles by 20%. The hard part wasn't the tech — it was translating regulatory ambiguity into something a product team could build against.",
  },
  {
    q: "What's your biggest weakness?",
    a: "I over-index on speed. I'll ship a working demo in a day when the team expected a week — which sounds good, but it means I sometimes skip the socialization step. I've learned that in enterprise sales, getting buy-in from stakeholders matters as much as the solution itself. At Diligent, I've been intentional about slowing down to bring people along, even when the prototype is already done.",
  },
  {
    q: "Why Solutions Engineering and not pure engineering?",
    a: "Because the best solution is the one that gets adopted. I've seen brilliant technical implementations fail because nobody translated them into business value. I sit at the intersection — I can build the demo, run the discovery call, model the ROI, and present to a CFO. That's rare, and it's where I create the most impact. This portfolio is proof: I didn't just write code, I identified real problems and shipped products that work.",
  },
  {
    q: "Why should we hire you?",
    a: "I've closed $1.4M+ in ARR across three platforms. I co-authored a GTM playbook that lifted close rates 18%. I build working prototypes with AI faster than most teams can write a spec. And I do all of it while making complex enterprise software feel simple. I'm not choosing between technical and strategic — I'm both.",
  },
];

export default function InterviewersPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-neutral-100"
        style={{ background: "rgba(250,250,250,0.8)" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun<span className="green">snottechnical</span>
          </a>
          <div className="flex items-center gap-5">
            <a href="/#work" className="nav-link">Work</a>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/interviewers" className="nav-link" style={{ color: "#15803d" }}>For Interviewers</Link>
            <a href="/#about" className="nav-link">About</a>
            <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ paddingTop: 120 }} className="pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="mono text-xs tracking-widest uppercase green mb-4">
            For Interviewers
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            What this page is — and why it exists.
          </h1>
          <p className="text-base text-neutral-500 leading-relaxed max-w-2xl">
            This isn&apos;t a traditional portfolio. I&apos;m a Solutions
            Engineer, not a developer. Every project here was built
            conversationally with AI — Claude, specifically — to demonstrate how
            I think about problems, scope solutions, and ship working products.
            The code is the output. The thinking is the skill.
          </p>
        </div>
      </header>

      <div className="section-line max-w-3xl mx-auto" />

      {/* Key numbers */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <p className="mono text-xs tracking-widest uppercase green mb-6">
          Key Numbers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </section>

      <div className="section-line max-w-3xl mx-auto" />

      {/* Experience timeline */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <p className="mono text-xs tracking-widest uppercase green mb-6">
          Experience
        </p>
        <div className="space-y-0">
          {experience.map((job, i) => (
            <div key={job.co} className="timeline-item">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {job.co}
                    <span className="text-neutral-400 font-normal">
                      {" "}
                      — {job.role}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500 leading-relaxed mt-1">
                    {job.desc}
                  </p>
                </div>
                <p
                  className="mono text-xs text-neutral-400 flex-shrink-0"
                  style={{ fontSize: 11 }}
                >
                  {job.dates}
                </p>
              </div>
              {i < experience.length - 1 && (
                <div className="section-line mt-4" />
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="section-line max-w-3xl mx-auto" />

      {/* Chatbot for gaps */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <p className="mono text-xs tracking-widest uppercase green mb-6">
          The Gaps — Explained
        </p>
        <ChatBot />
      </section>

      <div className="section-line max-w-3xl mx-auto" />

      {/* Q&A */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <p className="mono text-xs tracking-widest uppercase green mb-6">
          Honest Answers
        </p>
        <div className="space-y-6 max-w-2xl">
          {qaItems.map((item) => (
            <QA key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white mt-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-neutral-400">Mithun Manjunatha</p>
          <p className="text-xs text-neutral-400">Built with Next.js + Claude</p>
        </div>
      </footer>
    </div>
  );
}
