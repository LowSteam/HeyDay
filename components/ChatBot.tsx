"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "@/types";

const SUGGESTED = [
  "What's vegetarian?",
  "Spicy dishes under $15?",
  "Best desserts?",
  "Vegan options?",
  "Most popular dishes?",
  "Gluten-free options?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Heyday's AI food guide 👋\n\nAsk me anything — \"What's vegetarian?\", \"Spicy dishes under $15?\", or \"What's the best pasta?\"",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response ?? data.error ?? "Sorry, something went wrong.",
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again.", timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  // Always keep a fresh ref to sendMessage to avoid stale closures in event handlers
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  // Listen for events from HeroChat and Navbar
  useEffect(() => {
    const handleChat = (e: Event) => {
      setOpen(true);
      setTimeout(() => sendMessageRef.current((e as CustomEvent).detail.message), 200);
    };
    const handleOpen = () => setOpen(true);
    window.addEventListener("heyday:chat", handleChat);
    window.addEventListener("heyday:open-chat", handleOpen);
    return () => {
      window.removeEventListener("heyday:chat", handleChat);
      window.removeEventListener("heyday:open-chat", handleOpen);
    };
  }, []);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 h-14 rounded-full shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer ${
          open
            ? "w-14 bg-zinc-800 hover:bg-zinc-700 shadow-zinc-900/20"
            : "w-auto px-5 gap-2 bg-amber-500 hover:bg-amber-400 shadow-amber-900/30"
        }`}
        aria-label="Toggle AI food guide"
      >
        {open ? (
          <span className="text-lg font-light">✕</span>
        ) : (
          <>
            <span className="text-lg">✨</span>
            <span className="font-semibold text-sm">Ask AI</span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl shadow-zinc-900/15 border border-zinc-200/80 flex flex-col animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-amber-950 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-base">
                ✨
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">Heyday AI Guide</p>
                <p className="text-amber-300/60 text-xs mt-0.5">Powered by Gemini</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Online" />
          </div>

          {/* Messages */}
          <div className="overflow-y-auto p-4 space-y-3 max-h-[420px] min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-br-sm font-medium"
                      : "bg-zinc-100 text-zinc-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 px-4 py-3.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (only on fresh chat) */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-2 p-3 border-t border-zinc-100"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any dish..."
              disabled={loading}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-30 text-white flex items-center justify-center transition-all shrink-0 font-bold cursor-pointer"
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
