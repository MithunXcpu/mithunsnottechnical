"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  from: "them" | "me";
  timestamp: number;
}

const STORAGE_KEY = "portfolio-chat-messages";
const FORMSPREE_URL = "https://formspree.io/f/xplaceholder";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = loadMessages();
    if (loaded.length > 0) {
      setMessages(loaded);
    } else {
      setMessages([
        {
          id: "greeting",
          text: "Hey! I'm Mithun. Ask me anything about my work, or just say hi — I'll get back to you.",
          from: "them",
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      text,
      from: "me",
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(updated);
    setInput("");
    setSending(true);

    try {
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          message: text,
          _subject: `Portfolio Chat: ${text.slice(0, 50)}`,
          timestamp: new Date().toISOString(),
        }),
      });

      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        text: "Thanks! I got your message and will get back to you soon. You can also email me at mithundragon@gmail.com.",
        from: "them",
        timestamp: Date.now(),
      };
      const withReply = [...updated, replyMsg];
      setMessages(withReply);
      saveMessages(withReply);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        text: "Hmm, something went wrong. Try emailing me directly at mithundragon@gmail.com.",
        from: "them",
        timestamp: Date.now(),
      };
      const withErr = [...updated, errMsg];
      setMessages(withErr);
      saveMessages(withErr);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
            style={{ background: "var(--green)" }}
            aria-label="Open chat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96"
            style={{ maxHeight: "70vh" }}
          >
            <div className="chat-container shadow-xl" style={{ width: "100%" }}>
              {/* Header */}
              <div className="chat-header">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--green)" }}
                >
                  M
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Mithun</p>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Usually replies within a few hours</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded transition-colors flex-shrink-0"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-overlay)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  aria-label="Close chat"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="chat-body" ref={bodyRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.from === "me" ? "chat-me" : "chat-them"}`}>
                    {msg.text}
                  </div>
                ))}
                {sending && (
                  <div className="chat-bubble chat-them" style={{ opacity: 0.6 }}>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-3" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={sent ? "Message sent!" : "Type a message..."}
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{ color: "var(--color-text-primary)" }}
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-2 rounded-lg transition-colors disabled:opacity-30"
                  style={{ background: input.trim() ? "var(--green)" : "transparent" }}
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={input.trim() ? "#fff" : "#a3a3a3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
