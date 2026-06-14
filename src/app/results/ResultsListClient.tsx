"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RecommendationResult } from "../../lib/engine";
import SaveCollegeButton from "../../components/SaveCollegeButton";

// ── AI Insight Sub-component ──────────────────────────────────────────────────
interface AIInsightProps {
  collegeId: string;
  collegeName: string;
  userPercentile: number;
  priority: string;
  reasons: string[];
  isDark?: boolean;
}

function AIInsight({
  collegeId,
  collegeName,
  userPercentile,
  priority,
  reasons,
  isDark = false,
}: AIInsightProps) {
  const cacheKey = `insight_${collegeId}_${userPercentile}_${priority}`;
  const [insight, setInsight] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(cacheKey) || "";
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem(cacheKey);
  });

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return;
    }

    let isMounted = true;
    const fetchInsight = async () => {
      try {
        const res = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collegeId,
            collegeName,
            percentile: userPercentile,
            priority,
            reasons,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.insight) {
            setInsight(data.insight);
            localStorage.setItem(cacheKey, data.insight);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInsight();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, collegeId, collegeName, userPercentile, priority, reasons]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.75rem" }}>
        <div className="skeleton" style={{ height: "0.8rem", width: "100%", background: isDark ? "rgba(255,255,255,0.1)" : undefined }} />
        <div className="skeleton" style={{ height: "0.8rem", width: "70%", background: isDark ? "rgba(255,255,255,0.1)" : undefined }} />
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div
      style={{
        marginTop: "0.75rem",
        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(99, 102, 241, 0.04)",
        borderLeft: isDark ? "3px solid #c4b5fd" : "3px solid #8b5cf6",
        borderRadius: "0.375rem",
        padding: "0.55rem 0.8rem",
        fontSize: "0.78rem",
        lineHeight: 1.45,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
        <span style={{ fontSize: "0.8rem" }}>✨</span>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            color: isDark ? "#c4b5fd" : "#8b5cf6",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          AI Match Insight
        </span>
      </div>
      <p style={{ margin: 0, fontStyle: "italic", color: isDark ? "rgba(255,255,255,0.9)" : "inherit" }}>
        &ldquo;{insight}&rdquo;
      </p>
    </div>
  );
}

interface ResultsListClientProps {
  recommendations: RecommendationResult[];
  userPercentile: number;
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--glass-bg)",
        borderRadius: "1.25rem",
        border: "1px solid var(--glass-border)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div className="skeleton" style={{ height: "1.25rem", width: "5rem" }} />
            <div className="skeleton" style={{ height: "1.25rem", width: "4rem" }} />
            <div className="skeleton" style={{ height: "1.25rem", width: "6rem" }} />
          </div>
          <div className="skeleton" style={{ height: "1.6rem", width: "75%" }} />
          <div className="skeleton" style={{ height: "1rem", width: "90%" }} />
          <div className="skeleton" style={{ height: "1rem", width: "70%" }} />
        </div>
        <div style={{ width: "7rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
          <div className="skeleton" style={{ height: "2.5rem", width: "4rem" }} />
          <div className="skeleton" style={{ height: "1.25rem", width: "5rem" }} />
          <div className="skeleton" style={{ height: "1.75rem", width: "6rem" }} />
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="empty-state animate-scale-in">
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔍</div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
        No colleges matched your filters
      </h3>
      <p style={{ fontSize: "0.875rem", color: "var(--foreground)", opacity: 0.6, marginTop: "0.5rem", maxWidth: "28rem" }}>
        Try relaxing your criteria — expand to more branches, a higher budget, or
        fewer location restrictions to see results.
      </p>
      <Link
        href="/"
        id="empty-state-reset"
        className="btn-primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          marginTop: "1.5rem",
          padding: "0.65rem 1.5rem",
          fontSize: "0.875rem",
          borderRadius: "0.75rem",
          textDecoration: "none",
        }}
      >
        ← Adjust Preferences
      </Link>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResultsListClient({ recommendations, userPercentile }: ResultsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priority = searchParams.get("priority") || "balanced";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visible, setVisible]         = useState(false);

  // Small delay so the list animates in after page renders
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleCompareCheckboxChange = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 colleges at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCompareSubmit = () => {
    if (selectedIds.length < 2) {
      alert("Please select at least 2 colleges to compare.");
      return;
    }
    router.push(`/compare?ids=${selectedIds.join(",")}`);
  };

  if (!visible) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <EmptyState />;
  }

  const topMatch = recommendations[0];
  const rest     = recommendations.slice(1);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Compare Floating Bar ───────────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div
          className="animate-slide-up"
          style={{
            position: "sticky",
            bottom: "1.25rem",
            zIndex: 30,
            margin: "0 auto",
            maxWidth: "32rem",
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "1rem",
            padding: "0.875rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {selectedIds.map((id) => {
                const rec = recommendations.find((r) => r.college.id === id);
                return (
                  <span
                    key={id}
                    style={{
                      background: "rgba(99,102,241,0.25)",
                      border: "1px solid rgba(99,102,241,0.4)",
                      borderRadius: "0.4rem",
                      padding: "0.2rem 0.55rem",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#a5b4fc",
                    }}
                  >
                    {rec?.college.shortName}
                  </span>
                );
              })}
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }}>
              ({selectedIds.length}/3) selected
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={() => setSelectedIds([])}
              id="compare-clear"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#94a3b8",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.35rem 0.65rem",
                borderRadius: "0.5rem",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              Clear
            </button>
            <button
              onClick={handleCompareSubmit}
              id="compare-submit"
              disabled={selectedIds.length < 2}
              className="btn-primary"
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.78rem",
                borderRadius: "0.6rem",
                opacity: selectedIds.length < 2 ? 0.5 : 1,
                cursor: selectedIds.length < 2 ? "not-allowed" : "pointer",
              }}
            >
              Compare Now →
            </button>
          </div>
        </div>
      )}

      {/* ── 🏆 Best Match Banner ───────────────────────────────────── */}
      <div
        className="best-match-banner animate-scale-in"
        style={{ padding: "1.75rem 2rem", position: "relative" }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Top label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <span
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.1))",
                border: "1px solid rgba(251,191,36,0.35)",
                borderRadius: "999px",
                padding: "0.25rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#fbbf24",
                letterSpacing: "0.08em",
              }}
            >
              🏆 BEST MATCH
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(165,180,252,0.7)", fontWeight: 500 }}>
              Highest compatibility with your profile
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div>
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
                <span className="chip chip-purple" style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd" }}>
                  {topMatch.college.type}
                </span>
                <span className="chip" style={{ background: "rgba(5,150,105,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                  ₹{topMatch.college.fees_per_year_lakh} Lakhs/yr
                </span>
                <span className="chip" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(165,180,252,0.2)" }}>
                  NIRF #{topMatch.college.nirf_rank}
                </span>
              </div>

              {/* College name */}
              <Link href={`/college/${topMatch.college.id}`}>
                <h2
                  style={{
                    fontSize: "clamp(1.15rem, 3vw, 1.6rem)",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                >
                  {topMatch.college.name}
                </h2>
              </Link>
              <p style={{ fontSize: "0.82rem", color: "rgba(165,180,252,0.75)", marginTop: "0.3rem" }}>
                {topMatch.college.location}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {/* Why recommended */}
              <div style={{ flex: "1 1 auto" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7c7fff", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>
                  Why it&apos;s your top pick:
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {topMatch.matchReasons.slice(0, 3).map((reason, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(199,210,254,0.9)" }}>
                      <span style={{ color: "#a78bfa", flexShrink: 0, marginTop: "0.05rem" }}>✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>

                <AIInsight
                  collegeId={topMatch.college.id}
                  collegeName={topMatch.college.name}
                  userPercentile={userPercentile}
                  priority={priority}
                  reasons={topMatch.matchReasons}
                  isDark
                />
              </div>

              {/* Score circle */}
              <div
                style={{
                  flexShrink: 0,
                  textAlign: "center",
                  background: "rgba(99,102,241,0.15)",
                  border: "2px solid rgba(99,102,241,0.35)",
                  borderRadius: "1rem",
                  padding: "0.875rem 1.25rem",
                  minWidth: "7rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                  }}
                >
                  {topMatch.matchScore}%
                </div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#7c7fff", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Match Score
                </div>
                <div style={{ fontSize: "0.62rem", color: "rgba(224,231,255,0.7)", marginTop: "0.25rem" }}>
                  {Math.min(98, Math.max(68, topMatch.matchScore + 7))}% confidence
                </div>
                <Link
                  href={`/college/${topMatch.college.id}`}
                  id={`view-best-${topMatch.college.id}`}
                  style={{
                    display: "inline-block",
                    marginTop: "0.6rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#c4b5fd",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                >
                  View Details →
                </Link>
                <div style={{ marginTop: "0.55rem" }}>
                  <SaveCollegeButton collegeId={topMatch.college.id} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Remaining Cards ────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Other Recommendations
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(99,102,241,0.2), transparent)" }} />
            <span className="chip chip-slate">
              {rest.length} college{rest.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {rest.map((rec, idx) => {
              const { college, matchScore, matchReasons, isReach, isEligible } = rec;
              const isChecked = selectedIds.includes(college.id);
              const scoreColor = matchScore >= 80 ? "#059669" : matchScore >= 60 ? "#d97706" : "#dc2626";

              return (
                <div
                  key={college.id}
                  id={`college-card-${college.id}`}
                  className="card-premium animate-fade-in"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "1.5rem",
                    animationDelay: `${idx * 0.06}s`,
                    opacity: 0,
                    border: isChecked
                      ? "1.5px solid rgba(99, 102, 241, 0.5)"
                      : "1px solid var(--glass-border)",
                    boxShadow: isChecked
                      ? "0 0 0 3px rgba(99,102,241,0.1), 0 4px 24px rgba(99,102,241,0.12)"
                      : undefined,
                  }}
                >
                  {/* Top gradient accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      left: 0,
                      height: "3px",
                      background: matchScore >= 80
                        ? "linear-gradient(90deg, transparent, #059669)"
                        : matchScore >= 60
                        ? "linear-gradient(90deg, transparent, #d97706)"
                        : "linear-gradient(90deg, transparent, #6366f1)",
                      borderRadius: "1.25rem 1.25rem 0 0",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      {/* Left */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
                          <span className="chip chip-slate">NIRF #{college.nirf_rank}</span>
                          <span className="chip chip-indigo">{college.type}</span>
                          <span className="chip chip-emerald">₹{college.fees_per_year_lakh} Lakhs/yr</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", alignSelf: "center" }}>
                            • {college.location}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            color: "var(--foreground)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.25,
                          }}
                        >
                          <Link
                            href={`/college/${college.id}`}
                            id={`college-link-${college.id}`}
                            style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s ease" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                          >
                            {college.name}
                          </Link>
                        </h3>

                        <p className="line-clamp-2" style={{ fontSize: "0.82rem", color: "var(--foreground)", opacity: 0.6, marginTop: "0.35rem" }}>
                          {college.description}
                        </p>
                      </div>

                      {/* Right: score + compare */}
                      <div
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.6rem",
                          minWidth: "7.5rem",
                        }}
                      >
                        <div style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", justifyContent: "flex-end" }}>
                            <span style={{ fontSize: "1.9rem", fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                              {matchScore}%
                            </span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8" }}>Match</span>
                          </div>
                          <div style={{ marginTop: "0.2rem", fontSize: "0.64rem", color: "#94a3b8" }}>
                            {Math.min(98, Math.max(65, matchScore + 6))}% confidence
                          </div>

                          <div style={{ marginTop: "0.3rem" }}>
                            {!isEligible ? (
                              <span className="chip chip-rose">Low Odds</span>
                            ) : isReach ? (
                              <span className="chip chip-amber">Reach</span>
                            ) : (
                              <span className="chip chip-emerald">Safe Target</span>
                            )}
                          </div>
                        </div>

                        {/* Compare checkbox */}
                        <label
                          htmlFor={`compare-check-${college.id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "0.5rem",
                            background: isChecked ? "rgba(99,102,241,0.08)" : "transparent",
                            border: `1px solid ${isChecked ? "rgba(99,102,241,0.25)" : "transparent"}`,
                            transition: "all 0.15s ease",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`compare-check-${college.id}`}
                            checked={isChecked}
                            disabled={!isChecked && selectedIds.length >= 3}
                            onChange={() => handleCompareCheckboxChange(college.id)}
                            style={{ cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: isChecked ? "#6366f1" : "#64748b" }}>
                            {isChecked ? "Selected" : "Compare"}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div
                      style={{
                        borderTop: "1px dashed rgba(99, 102, 241, 0.12)",
                        paddingTop: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>
                        Why recommended:
                      </p>
                      <ul
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                          gap: "0.3rem 1.5rem",
                        }}
                      >
                        {matchReasons.map((reason, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.78rem", color: "var(--foreground)", opacity: 0.75 }}>
                            <span style={{ color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>✓</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <AIInsight
                      collegeId={college.id}
                      collegeName={college.name}
                      userPercentile={userPercentile}
                      priority={priority}
                      reasons={matchReasons}
                    />

                    {/* Footer link */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
                      <SaveCollegeButton collegeId={college.id} compact />
                      <Link
                        href={`/college/${college.id}`}
                        id={`details-link-${college.id}`}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: "#6366f1",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "0.5rem",
                          transition: "all 0.15s ease",
                          background: "rgba(99,102,241,0.06)",
                          border: "1px solid rgba(99,102,241,0.15)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                          e.currentTarget.style.color = "#4338ca";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                          e.currentTarget.style.color = "#6366f1";
                        }}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
