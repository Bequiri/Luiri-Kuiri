"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hei! Olen Northstar-assistenttisi. Kysy hinnoista, reiteistä tai saatavuudesta — vastaan muutamassa sekunnissa.\n\nHi! I'm your Northstar assistant. Ask about prices, routes or availability — I'll reply in seconds.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Pahoittelut, yhteys katkesi. Soita suoraan: +358 40 123 4567" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#D4A853] shadow-lg shadow-[#D4A853]/30 flex items-center justify-center"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-[#0A0A0A] text-xl font-bold">✕</motion.span>
          ) : (
            <motion.span key="star" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="text-[#0A0A0A] text-2xl">★</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#111111] border border-[#D4A853]/30 rounded-sm shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "70vh" }}
          >
            <div className="bg-[#D4A853] px-4 py-3 flex items-center gap-3">
              <span className="text-[#0A0A0A] text-lg">★</span>
              <div>
                <div className="text-[#0A0A0A] font-bold text-sm">Northstar AI</div>
                <div className="text-[#0A0A0A]/60 text-xs">Vastaa muutamassa sekunnissa</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-sm text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-[#D4A853] text-[#0A0A0A]"
                        : "bg-[#1a1a1a] text-[#F5F5F5] border border-[#2a2a2a]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 rounded-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-[#2a2a2a] p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Kysy mitä vain..."
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#888888] focus:outline-none focus:border-[#D4A853]"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-[#D4A853] text-[#0A0A0A] rounded-sm text-sm font-bold hover:bg-[#e8c47a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
