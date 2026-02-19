"use client";

import { useState } from "react";

const SUGGESTED = [
  "What's vegetarian?",
  "Spicy dishes under $15?",
  "Best desserts?",
  "Vegan-friendly options?",
  "Something with truffle?",
  "Gluten-free dishes?",
];

export default function HeroChat() {
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    window.dispatchEvent(new CustomEvent("heyday:chat", { detail: { message: text.trim() } }));
    setInput("");
  };

  return (
    <div className="w-full space-y-4">
      {/* Suggested chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="text-sm bg-white/10 hover:bg-amber-400/20 border border-white/20 hover:border-amber-400/50 text-amber-100/80 hover:text-amber-200 rounded-full px-4 py-2 transition-all duration-200 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl p-2 focus-within:border-amber-500/50 focus-within:bg-white/[0.13] transition-all"
      >
        <span className="pl-2 text-amber-400/60 text-lg shrink-0">✨</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: 'Spicy dishes under $15' or 'What's vegan?'"
          className="flex-1 bg-transparent text-white placeholder-white/30 px-2 py-3 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-25 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 font-semibold text-sm transition-all shrink-0 cursor-pointer"
        >
          Ask →
        </button>
      </form>
    </div>
  );
}
