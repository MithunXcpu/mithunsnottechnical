"use client";

import { useState } from "react";
import { Send, Mail, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch("https://formspree.io/f/xplaceholder", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Message Sent</h1>
        <p className="text-muted text-sm">Thanks for reaching out. I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Contact</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Message</label>
          <textarea
            name="message"
            rows={4}
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Send className="w-4 h-4" /> Send Message
        </button>
      </form>
    </div>
  );
}
