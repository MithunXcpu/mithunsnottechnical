"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    label: "Walk me through your career moves",
    answer:
      "Infor to Blend was a growth move — ERP to fintech. Blend to Workiva was mid-market to enterprise. Both intentional steps up. Workiva and Datamaran were market-driven exits — ESG backlash killed deal flow at both companies. Diligent's Value Engineer role wasn't the right fit — it's a different function than Solutions Engineering. I recognized it fast. Now I'm looking for an SE role where I can own the full technical sale.",
  },
  {
    label: "What about the gap in 2024?",
    answer:
      "Feb — Sep 2024. I went all-in on building. Taught myself AI development — prompt engineering, Claude, Next.js — and shipped every project on this portfolio. When I came back at Datamaran, I closed $350K+ because I came back sharper. The gap wasn't downtime. It was the most productive stretch of my career.",
  },
  {
    label: "What's the hardest project you've worked on?",
    answer:
      "The Datamaran ESG compliance framework. Three overlapping regulatory frameworks — CSRD, SEC climate disclosure, ISSB — each with different timelines and scopes. Fortune 500 clients needed a single pane of glass across all three. I built the demo framework that mapped data points across standards. The hard part wasn't the tech — it was translating regulatory ambiguity into something a product team could build against.",
  },
  {
    label: "What's your biggest weakness?",
    answer:
      "I over-index on speed. I'll ship a working demo in a day when the team expected a week — sounds good, but I sometimes skip the socialization step. In enterprise sales, getting buy-in matters as much as the solution itself. I've been intentional about slowing down to bring people along, even when the prototype is done.",
  },
  {
    label: "Why SE and not pure engineering?",
    answer:
      "Because the best solution is the one that gets adopted. I've seen brilliant technical work fail because nobody translated it into business value. I sit at the intersection — I can build the demo, run discovery, model ROI, and present to a CFO. This portfolio proves it: I didn't just write code, I identified real problems and shipped working products.",
  },
  {
    label: "Why should we hire you?",
    answer:
      "7 years in SaaS. $3M+ in closed ARR across four platforms. 100+ deals supported. ROI models north of 300%. I build working prototypes with AI faster than most teams can write a spec. And I make complex enterprise software feel simple. I'm not choosing between technical and strategic — I'm both.",
  },
];

const experience = [
  {
    co: "Diligent",
    role: "Senior Value Engineer",
    dates: "May 2025 — Present",
    desc: "GRC & AI governance solutions for boards. Value-based selling to Financial Services, Healthcare, Public Sector.",
    context: "Left — role wasn't the right fit",
  },
  {
    co: "Datamaran",
    role: "Senior Solution Engineer",
    dates: "Sep 2024 — Apr 2025",
    desc: "AI-powered ESG analytics. Closed $350K+ ARR with Fortune 500 clients across CSRD, SEC, and ISSB compliance.",
    context: "Left — ESG market downturn, low deal flow",
  },
  {
    co: "Workiva",
    role: "Solution Engineer",
    dates: "Jul 2022 — Feb 2024",
    desc: "Enterprise reporting & ESG. Won $700K+ ARR. ERP integration demos (SAP, Oracle, Workday) for Fortune 500.",
    context: "Let go — ESG backlash, market contraction",
  },
  {
    co: "Blend",
    role: "Mid-Market Solution Engineer",
    dates: "May 2021 — Jun 2022",
    desc: "Digital lending platform. Beat quota 4/5 quarters. API demos with FIS, Jack Henry, Fiserv.",
    context: "Left for growth — moved to enterprise at Workiva",
  },
  {
    co: "Infor",
    role: "Product Solutions Analyst",
    dates: "Oct 2019 — Jul 2020",
    desc: "Enterprise ERP & HCM. 95% NPS. Healthcare and Manufacturing verticals. First SE role.",
    context: "Left for growth — moved to fintech at Blend",
  },
];

export default function InterviewersPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{
          background: "rgba(12, 12, 12, 0.8)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun<span className="green">snottechnical</span>
          </a>
          <div className="hidden md:flex items-center gap-5">
            <a href="/#work" className="nav-link">Work</a>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/interviewers" className="nav-link" style={{ color: "var(--green)" }}>For Interviewers</Link>
            <a href="/#about" className="nav-link">About</a>
            <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ paddingTop: 120 }} className="pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <span
            className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-6"
            style={{ color: "var(--green)" }}
          >
            <span className="w-8 h-px" style={{ background: "var(--green)" }} />
            For Interviewers
          </span>
          <h1 className="font-display text-3xl md:text-5xl italic tracking-tight mb-3">
            What this page is — and why it exists.
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            This isn&apos;t a traditional portfolio. I&apos;m a Solutions
            Engineer, not a developer. Every project here was built
            conversationally with AI — Claude, specifically — to demonstrate how
            I think about problems, scope solutions, and ship working products.
            The code is the output. The thinking is the skill.
          </p>
        </div>
      </header>

      <div className="glow-line max-w-3xl mx-auto" />

      {/* Key numbers */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <span
          className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-6"
          style={{ color: "var(--green)" }}
        >
          <span className="w-8 h-px" style={{ background: "var(--green)" }} />
          Key Numbers
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "$3M+", label: "ARR closed" },
            { num: "7", label: "Years in SaaS" },
            { num: "100+", label: "Deals supported" },
            { num: "300%+", label: "ROI delivered" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <p className="text-2xl font-bold font-display italic" style={{ color: "var(--green-light)" }}>{s.num}</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-line max-w-3xl mx-auto" />

      {/* Experience timeline */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <span
          className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-6"
          style={{ color: "var(--green)" }}
        >
          <span className="w-8 h-px" style={{ background: "var(--green)" }} />
          Experience
        </span>
        <div className="space-y-0">
          {experience.map((job, i) => (
            <div key={job.co} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {job.co}
                    <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>
                      {" "}— {job.role}
                    </span>
                  </p>
                  <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    {job.desc}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)", fontStyle: "italic" }}>
                    {job.context}
                  </p>
                </div>
                <p
                  className="mono text-xs flex-shrink-0"
                  style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}
                >
                  {job.dates}
                </p>
              </div>
              {i < experience.length - 1 && (
                <div className="section-line mt-5" />
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="glow-line max-w-3xl mx-auto" />

      {/* Ask Me Anything */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <span
          className="mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-2"
          style={{ color: "var(--green)" }}
        >
          <span className="w-8 h-px" style={{ background: "var(--green)" }} />
          Ask Me Anything
        </span>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          Pick a question. Get an honest answer.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className="text-left text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
              style={{
                background: selected === i ? "var(--green)" : "var(--color-surface-raised)",
                color: selected === i ? "#fff" : "var(--color-text-secondary)",
                border: `1px solid ${selected === i ? "var(--green)" : "var(--color-border-subtle)"}`,
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--green)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <p className="text-sm font-semibold green mb-3">
              {questions[selected].label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {questions[selected].answer}
            </p>
          </div>
        )}

        {selected === null && (
          <div
            className="rounded-xl p-5 text-center"
            style={{
              border: "1px dashed var(--color-border-hover)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              Pick a question above to see my answer.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div
          className="rounded-2xl text-center p-8"
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-lg font-semibold mb-2 font-display italic" style={{ color: "var(--color-text-primary)" }}>
            Want to learn more?
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--color-text-secondary)" }}>
            I&apos;m looking for my next Solutions Engineering role. Let&apos;s talk.
          </p>
          <div className="flex justify-center gap-3">
            <a href="mailto:mithundragon@gmail.com" className="btn btn-primary">
              Get in touch
            </a>
            <a href="https://linkedin.com/in/mithun-manjunatha" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-10"
        style={{
          borderTop: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Mithun Manjunatha</p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Built with Next.js + Claude</p>
        </div>
      </footer>
    </div>
  );
}
