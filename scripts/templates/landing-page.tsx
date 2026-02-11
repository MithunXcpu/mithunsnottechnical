import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-block mb-4 px-3 py-1 bg-card border border-border rounded-full text-xs text-muted">
          Built by Mithun Manjunatha
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {{TITLE}}
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          {{DESCRIPTION}}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="{{GITHUB_URL}}"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-card-hover border border-border text-foreground rounded-lg text-sm font-medium transition-colors"
          >
            View Source
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">What It Does</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Fast", desc: "Built with performance in mind from day one." },
            { icon: Shield, title: "Reliable", desc: "Handles edge cases so you don't have to." },
            { icon: BarChart3, title: "Insightful", desc: "Turn raw data into actionable decisions." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6">
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-card border border-border rounded-xl p-10">
          <h2 className="text-2xl font-bold mb-3">Ready to try it?</h2>
          <p className="text-muted mb-6">
            This project is open source. Star it, fork it, or contribute.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
