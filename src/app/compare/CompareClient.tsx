"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { College } from "../../data/colleges";

interface CompareClientProps {
  initialColleges: College[];
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyCompareState() {
  return (
    <div className="empty-state animate-scale-in">
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚖️</div>
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 800,
          color: "#1e293b",
          letterSpacing: "-0.02em",
        }}
      >
        No colleges selected for comparison
      </h2>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#64748b",
          marginTop: "0.5rem",
          maxWidth: "28rem",
          lineHeight: 1.6,
        }}
      >
        Go back to the recommendation results and check{" "}
        <strong style={{ color: "#6366f1" }}>Compare</strong> on up to 3 colleges
        you want to inspect side-by-side.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          id="empty-compare-search"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.65rem 1.5rem",
            fontSize: "0.875rem",
            borderRadius: "0.75rem",
            textDecoration: "none",
          }}
        >
          → Start New Search
        </Link>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CompareClient({ initialColleges }: CompareClientProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>(initialColleges);
  const [explaining, setExplaining] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const handleExplainWithAI = async () => {
    if (colleges.length < 2 || explaining) return;
    setExplaining(true);
    setAiSummary("");

    try {
      const collegeIds = colleges.map((c) => c.id);
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate AI comparison.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream reader available.");

      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        streamText += chunk;
        setAiSummary(streamText);
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to generate comparison.";
      setAiSummary(`Error: ${message} Please check your API key.`);
    } finally {
      setExplaining(false);
    }
  };

  const renderMarkdown = (markdown: string) => (
    <div>
      {markdown.split("\n").map((rawLine, index) => {
        const line = rawLine.replace(/^#{1,3}\s+/, "").replace(/\*\*/g, "").trim();
        if (!line) return <div key={index} style={{ height: "0.45rem" }} />;
        const isHeading = /^#{1,3}\s+/.test(rawLine);
        const isBullet = /^[-*]\s+/.test(rawLine);
        const text = line.replace(/^[-*]\s+/, "");
        if (isHeading) {
          return <h4 key={index} style={{ margin: "1rem 0 0.4rem", fontWeight: 800, color: "#8b5cf6", fontSize: "0.92rem" }}>{text}</h4>;
        }
        return <p key={index} style={{ margin: "0.28rem 0", paddingLeft: isBullet ? "0.8rem" : 0, fontSize: "0.82rem" }}>{isBullet ? `• ${text}` : text}</p>;
      })}
    </div>
  );

  useEffect(() => {
    const idsFromParams = searchParams.get("ids");
    if (idsFromParams) {
      const ids = idsFromParams.split(",");
      localStorage.setItem("compare_colleges", JSON.stringify(ids));
    } else {
      const stored = localStorage.getItem("compare_colleges");
      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[];
          if (ids.length > 0) router.replace(`/compare?ids=${ids.join(",")}`);
        } catch {
          /* ignore */
        }
      }
    }
  }, [searchParams, router]);

  const handleRemove = (id: string) => {
    const updated    = colleges.filter((c) => c.id !== id);
    setColleges(updated);
    const updatedIds = updated.map((c) => c.id);
    localStorage.setItem("compare_colleges", JSON.stringify(updatedIds));
    if (updatedIds.length > 0) router.push(`/compare?ids=${updatedIds.join(",")}`);
    else router.push("/compare");
  };

  const handleClearAll = () => {
    localStorage.removeItem("compare_colleges");
    setColleges([]);
    router.push("/");
  };

  // Best metric helpers
  const getBest = (field: keyof College, order: "asc" | "desc") => {
    if (colleges.length < 2) return null;
    const vals = colleges.map((c) => c[field] as number);
    return order === "asc" ? Math.min(...vals) : Math.max(...vals);
  };

  const bestRank     = getBest("nirf_rank", "asc");
  const bestPackage  = getBest("avg_package_lpa", "desc");
  const bestFees     = getBest("fees_per_year_lakh", "asc");
  const bestResearch = getBest("research_score", "desc");

  if (colleges.length === 0) return <EmptyCompareState />;

  // ── Row config ──────────────────────────────────────────────────────────
  type RowCell = { value: string; isBest: boolean; suffix?: string };
  const rows: { label: string; icon: string; render: (c: College) => RowCell }[] = [
    {
      label: "NIRF Rank",
      icon: "🏅",
      render: (c: College): RowCell => {
        const isBest = c.nirf_rank === bestRank;
        return { value: `#${c.nirf_rank}`, isBest, suffix: isBest ? "Highest Ranked" : undefined };
      },
    },
    {
      label: "Avg Placement",
      icon: "💼",
      render: (c: College): RowCell => {
        const isBest = c.avg_package_lpa === bestPackage;
        return { value: `₹${c.avg_package_lpa} LPA`, isBest, suffix: isBest ? "Best Package" : undefined };
      },
    },
    {
      label: "Annual Fees",
      icon: "💰",
      render: (c: College) => {
        const isBest = c.fees_per_year_lakh === bestFees;
        return { value: `₹${c.fees_per_year_lakh} Lakhs`, isBest, suffix: isBest ? "Most Affordable" : undefined };
      },
    },
    {
      label: "JEE Cutoff",
      icon: "📊",
      render: (c: College) => ({ value: `${c.cutoff_percentile}%`, isBest: false }),
    },
    {
      label: "Campus Size",
      icon: "🏛️",
      render: (c: College) => ({ value: `${c.campus_size_acres} Acres`, isBest: false }),
    },
    {
      label: "Research Score",
      icon: "🔬",
      render: (c: College) => {
        const isBest = c.research_score === bestResearch;
        return { value: `${c.research_score}/10`, isBest, suffix: isBest ? "Best Research" : undefined };
      },
    },
    {
      label: "Facilities",
      icon: "🏠",
      render: (c: College) => ({
        value: [c.has_hostel ? "Hostel ✓" : "No Hostel", c.is_coed ? "Co-Ed ✓" : "Single-Sex"].join("\n"),
        isBest: false,
      }),
    },
  ];

  return (
    <div
      className="animate-fade-in"
      style={{
        background: "var(--form-bg)",
        borderRadius: "1.25rem",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            Comparison Matrix
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--foreground)", opacity: 0.55, marginTop: "0.2rem" }}>
            Comparing{" "}
            <strong style={{ color: "#6366f1" }}>{colleges.length}</strong> of max 3 colleges.{" "}
            <span style={{ color: "#059669", fontWeight: 600 }}>Green = best value</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={handleExplainWithAI}
            disabled={colleges.length < 2 || explaining}
            className="btn-primary"
            style={{
              fontSize: "0.78rem",
              borderRadius: "0.6rem",
              padding: "0.45rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              opacity: colleges.length < 2 ? 0.5 : 1,
            }}
          >
            {explaining ? "Explaining..." : "✨ Explain with AI"}
          </button>

          <button
            id="compare-clear-all"
            onClick={handleClearAll}
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#dc2626",
              background: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "0.6rem",
              padding: "0.45rem 0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.background = "rgba(220,38,38,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.background = "rgba(220,38,38,0.06)";
            }}
          >
            ✕ Clear All
          </button>
        </div>
      </div>

      {/* AI Comparison Summary Panel */}
      {(explaining || aiSummary) && (
        <div
          style={{
            padding: "1.5rem",
            background: "rgba(99, 102, 241, 0.03)",
            borderBottom: "1px solid rgba(99,102,241,0.1)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
            <span style={{ fontSize: "1.1rem" }}>✨</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              AI Comparison Report
            </span>
          </div>

          <div
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "var(--foreground)",
              whiteSpace: "pre-wrap",
            }}
          >
            {aiSummary ? (
              renderMarkdown(aiSummary)
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: 600 }}>Analyzing colleges using Gemini...</span>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "bounce-bubble 0.8s infinite alternate" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "bounce-bubble 0.8s infinite alternate 0.2s" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "bounce-bubble 0.8s infinite alternate 0.4s" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: "0.8rem", width: "95%" }} />
                <div className="skeleton" style={{ height: "0.8rem", width: "80%" }} />
                <div className="skeleton" style={{ height: "0.8rem", width: "85%" }} />
              </div>
            )}
          </div>
          <style>{`
            @keyframes bounce-bubble {
              from { transform: translateY(0); }
              to { transform: translateY(-4px); }
            }
          `}</style>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "580px",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1.5px solid rgba(99,102,241,0.1)" }}>
              {/* Label column */}
              <th
                style={{
                  width: "22%",
                  padding: "1rem",
                  textAlign: "left",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRight: "1px solid var(--border-subtle)",
                }}
              >
                Attribute
              </th>

              {/* College columns */}
              {colleges.map((college) => (
                <th
                  key={college.id}
                  style={{
                    padding: "1.25rem 1rem",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-subtle)",
                    position: "relative",
                    background: "transparent",
                    verticalAlign: "top",
                  }}
                >
                  <button
                    onClick={() => handleRemove(college.id)}
                    id={`remove-${college.id}`}
                    style={{
                      position: "absolute",
                      top: "0.6rem",
                      right: "0.6rem",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      background: "rgba(100,116,139,0.08)",
                      border: "1px solid rgba(100,116,139,0.15)",
                      borderRadius: "0.35rem",
                      padding: "0.15rem 0.4rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget).style.color = "#dc2626";
                      (e.currentTarget).style.background = "rgba(220,38,38,0.08)";
                      (e.currentTarget).style.borderColor = "rgba(220,38,38,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget).style.color = "#94a3b8";
                      (e.currentTarget).style.background = "rgba(100,116,139,0.08)";
                      (e.currentTarget).style.borderColor = "rgba(100,116,139,0.15)";
                    }}
                  >
                    ✕ Remove
                  </button>

                  <div style={{ paddingTop: "0.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.18)",
                        borderRadius: "0.4rem",
                        padding: "0.15rem 0.5rem",
                        color: "#4f46e5",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {college.type}
                    </span>
                    <h3
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 800,
                        color: "var(--foreground)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.25,
                      }}
                      className="line-clamp-2"
                    >
                      <Link
                        href={`/college/${college.id}`}
                        style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                      >
                        {college.name}
                      </Link>
                    </h3>
                    <p style={{ fontSize: "0.72rem", color: "var(--foreground)", opacity: 0.5, marginTop: "0.25rem" }}>
                      {college.location}
                    </p>
                  </div>
                </th>
              ))}

              {/* Empty filler columns */}
              {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <th
                  key={`empty-h-${i}`}
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-subtle)",
                    background: "rgba(255, 255, 255, 0.01)",
                    verticalAlign: "middle",
                  }}
                >
                  <div
                    style={{
                      border: "2px dashed var(--border-subtle)",
                      borderRadius: "0.75rem",
                      padding: "1.5rem 0.5rem",
                      color: "#94a3b8",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    + Slot Available
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.label}
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background-color 0.15s ease",
                  background: rowIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(99, 102, 241, 0.05)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = rowIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)")}
              >
                {/* Row label */}
                <td
                  style={{
                    padding: "0.875rem 1rem",
                    borderRight: "1px solid var(--border-subtle)",
                    background: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.95rem" }}>{row.icon}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)" }}>
                      {row.label}
                    </span>
                  </div>
                </td>

                {/* Data cells */}
                {colleges.map((c) => {
                  const { value, isBest, suffix } = row.render(c);
                  return (
                    <td
                      key={c.id}
                      style={{
                        padding: "0.875rem 1rem",
                        textAlign: "center",
                        borderRight: "1px solid var(--border-subtle)",
                        background: isBest ? "rgba(5, 150, 105, 0.1)" : "transparent",
                        transition: "background 0.15s ease",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: isBest ? 800 : 600,
                          color: isBest ? "#34d399" : "var(--foreground)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {value}
                      </div>
                      {isBest && suffix && (
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: "0.25rem",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "#059669",
                            background: "rgba(5,150,105,0.12)",
                            border: "1px solid rgba(5,150,105,0.2)",
                            borderRadius: "999px",
                            padding: "0.1rem 0.5rem",
                          }}
                        >
                          ✓ {suffix}
                        </span>
                      )}
                    </td>
                  );
                })}

                {/* Filler cells */}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td
                    key={`empty-${row.label}-${i}`}
                    style={{
                      borderRight: "1px solid rgba(99,102,241,0.08)",
                      background: "rgba(248,249,255,0.3)",
                    }}
                  />
                ))}
              </tr>
            ))}

            {/* Branches row */}
            <tr
              style={{ borderBottom: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(238,240,255,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
            >
              <td
                style={{
                  padding: "0.875rem 1rem",
                  borderRight: "1px solid rgba(99,102,241,0.08)",
                  background: "rgba(248,249,255,0.6)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.95rem" }}>🎓</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.7 }}>
                    Branches
                  </span>
                </div>
              </td>

              {colleges.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: "0.875rem 1rem",
                    textAlign: "center",
                    borderRight: "1px solid rgba(99,102,241,0.08)",
                    verticalAlign: "top",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      justifyContent: "center",
                      maxHeight: "160px",
                      overflowY: "auto",
                    }}
                  >
                    {c.branches.map((b) => (
                      <span
                        key={b}
                        style={{
                          display: "inline-block",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          background: "rgba(99,102,241,0.07)",
                          border: "1px solid rgba(99,102,241,0.14)",
                          borderRadius: "0.375rem",
                          padding: "0.15rem 0.5rem",
                          color: "#4f46e5",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
              ))}

              {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td
                  key={`empty-br-${i}`}
                  style={{
                    borderRight: "1px solid rgba(99,102,241,0.08)",
                    background: "rgba(248,249,255,0.3)",
                  }}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
