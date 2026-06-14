"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Best colleges for 95 percentile",
  "Best colleges for CSE",
  "Best ROI colleges",
  "IIT vs NIT comparison",
  "Which college should I choose?"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("collegefit_chat_history");
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamedTextRef = useRef("");

  // Save chat history to localStorage
  const saveHistory = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem("collegefit_chat_history", JSON.stringify(newMessages));
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear chat history?")) {
      saveHistory([]);
    }
  };

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    saveHistory(updatedMessages);

    // Placeholder assistant message for streaming
    const assistantMessage: Message = { role: "assistant", content: "" };
    const messagesWithPlaceholder = [...updatedMessages, assistantMessage];
    setMessages(messagesWithPlaceholder);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get AI response.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream available.");
      }

      const decoder = new TextDecoder();
      streamedTextRef.current = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const nextText = streamedTextRef.current + chunk;
        streamedTextRef.current = nextText;

        // Update last message in history
        setMessages((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = { role: "assistant", content: nextText };
          }
          return next;
        });
      }

      // Save complete text to storage
      const finalMessages: Message[] = [
        ...updatedMessages,
        { role: "assistant", content: streamedTextRef.current },
      ];
      localStorage.setItem("collegefit_chat_history", JSON.stringify(finalMessages));
    } catch (err: unknown) {
      console.error("AI Assistant Error:", err);
      const message = err instanceof Error ? err.message : "Failed to communicate with AI.";
      // Update assistant message with error text
      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: `Error: ${message} Please make sure GEMINI_API_KEY is configured in your .env.local file.`
        }
      ];
      saveHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100, fontFamily: "inherit" }}>
      {/* ── Chat Toggle Button ────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(99, 102, 241, 0.45)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          outline: "none",
        }}
        className="hover:scale-105 active:scale-95"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          // Close Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Sparkles Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.3-6.3l-.7.7M6.7 17.3l-.7.7m12.6 0l-.7-.7M6.7 6.7l-.7-.7N"></path>
            <path d="M10 8.5L12 6l2 2.5L16.5 7l-1 2.5 2.5 1-2.5 1 1 2.5-2.5-1L12 18l-2-2.5-2.5 1 1-2.5-2.5-1 2.5-1-1-2.5L10 8.5z" fill="currentColor"></path>
          </svg>
        )}
      </button>

      {/* ── Chat Panel Window ─────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "4.5rem",
            right: "0",
            width: "clamp(300px, 90vw, 390px)",
            height: "530px",
            background: "rgba(10, 10, 20, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "1.25rem",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "chat-fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 10px #10b981",
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#ffffff" }}>
                  CollegeFit AI Copilot
                </h3>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                  Gemini-powered admissions expert
                </span>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                className="hover:text-red-400"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: "1.25rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.length === 0 ? (
              // Welcome State
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#a5b4fc" }}>
                    Hello! Ask me anything about Indian colleges
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                    I have access to the CollegeFit database of IITs, NITs, IIITs, BITS, and can help you find cutoffs, placements, budget fits, and choose the right option.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Suggested Prompts
                  </span>
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      style={{
                        padding: "0.6rem 0.875rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "0.75rem",
                        textAlign: "left",
                        color: "#e2e8f0",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
                        e.currentTarget.style.color = "#c4b5fd";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.color = "#e2e8f0";
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Message Bubble List
              messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.875rem",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        color: "#ffffff",
                        background: isUser
                          ? "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
                          : "rgba(255, 255, 255, 0.06)",
                        border: isUser
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow: isUser ? "0 4px 12px rgba(99,102,241,0.2)" : undefined,
                      }}
                    >
                      {m.content === "" && idx === messages.length - 1 && isLoading ? (
                        // Typing Indicator
                        <div style={{ display: "flex", gap: "0.3rem", padding: "0.2rem 0" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a5b4fc", display: "inline-block", animation: "bounce-bubble 1s infinite alternate" }} />
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a5b4fc", display: "inline-block", animation: "bounce-bubble 1s infinite alternate 0.2s" }} />
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a5b4fc", display: "inline-block", animation: "bounce-bubble 1s infinite alternate 0.4s" }} />
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            style={{
              padding: "1rem 1.25rem",
              background: "rgba(10, 10, 15, 0.95)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about placement package, CSE ranks..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
                padding: "0.6rem 0.875rem",
                fontSize: "0.82rem",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                e.target.style.background = "rgba(255, 255, 255, 0.06)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.target.style.background = "rgba(255, 255, 255, 0.04)";
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                width: "2.4rem",
                height: "2.4rem",
                borderRadius: "0.6rem",
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" : "rgba(255,255,255,0.05)",
                border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

          {/* Embedded Styles */}
          <style>{`
            @keyframes chat-fade-in {
              from { opacity: 0; transform: translateY(12px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes bounce-bubble {
              from { transform: translateY(0); }
              to { transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
