"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { colleges } from "../../data/colleges";

// ── Helper ────────────────────────────────────────────────────────────────────
function predictChance(userPercentile: number, cutoff: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
  pct: number;
} {
  const delta = userPercentile - cutoff;

  if (delta >= 1.5) return { label: "High Chance",   color: "#059669", bg: "rgba(5,150,105,0.1)",    border: "rgba(5,150,105,0.25)",   pct: 90 };
  if (delta >= 0.5) return { label: "Good Chance",   color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",   pct: 75 };
  if (delta >= 0)   return { label: "Borderline",    color: "#f59e0b", bg: "rgba(245,158,11,0.09)",  border: "rgba(245,158,11,0.22)",  pct: 50 };
  if (delta >= -1)  return { label: "Reach",         color: "#f97316", bg: "rgba(249,115,22,0.09)",  border: "rgba(249,115,22,0.2)",   pct: 25 };
  return               { label: "Very Unlikely",  color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.18)",   pct: 5  };
}

const TYPE_ICONS: Record<string, string> = {
  IIT: "🏛️", NIT: "🎓", IIIT: "💻", Private: "🏢", Deemed: "🔬",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdmissionPredictorPage() {
  const [percentile, setPercentile] = useState("95.0");
  const [filterType, setFilterType] = useState<string>("All");
  const [showOnly, setShowOnly]     = useState<"All" | "Reachable">("All");
  const [sorted, setSorted]         = useState<"chance" | "rank" | "package">("chance");

  const pct = parseFloat(percentile) || 0;

  const results = useMemo(() => {
    return colleges
      .filter((c) => filterType === "All" || c.type === filterType)
      .map((c) => ({ college: c, prediction: predictChance(pct, c.cutoff_percentile) }))
      .filter((r) => showOnly === "All" || r.prediction.pct >= 50)
      .sort((a, b) => {
        if (sorted === "chance")   return b.prediction.pct - a.prediction.pct;
        if (sorted === "rank")     return a.college.nirf_rank - b.college.nirf_rank;
        if (sorted === "package")  return b.college.avg_package_lpa - a.college.avg_package_lpa;
        return 0;
      });
  }, [pct, filterType, showOnly, sorted]);

  const summary = useMemo(() => ({
    high:       results.filter((r) => r.prediction.pct >= 75).length,
    borderline: results.filter((r) => r.prediction.pct === 50).length,
    reach:      results.filter((r) => r.prediction.pct < 50 && r.prediction.pct > 5).length,
  }), [results]);

  const typeOptions = ["All", "IIT", "NIT", "IIIT", "Private", "Deemed"];

  return (
    <div style={{ background: "linear-gradient(180deg, var(--nav-bg) 0%, var(--background) 140px)", minHeight: "100vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Back ─────────────────────────────────────────── */}
        <div className="animate-fade-in" style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            id="predictor-back"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#6366f1",
              textDecoration: "none",
              padding: "0.4rem 0.875rem",
              borderRadius: "0.6rem",
              background: "rgba(99,102,241,0.07)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            ← Home
          </Link>
        </div>

        {/* ── Hero ─────────────────────────────────────────── */}
        <div
          className="animate-scale-in"
          style={{
            background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #150f3a 100%)",
            borderRadius: "1.5rem",
            padding: "2rem 2.25rem",
            marginBottom: "1.75rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(99,102,241,0.2)",
          }}
        >
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <span style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(165,180,252,0.3)", borderRadius: "999px", padding: "0.25rem 0.75rem", fontSize: "0.7rem", fontWeight: 800, color: "#a5b4fc", letterSpacing: "0.06em" }}>
                🎯 ADMISSION PREDICTOR
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Predict Your Admission Chances
            </h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(199,210,254,0.8)", marginTop: "0.5rem", maxWidth: "38rem" }}>
              Enter your JEE percentile to instantly see your admission probability across all top institutes. Based on historical cutoff data.
            </p>

            {/* Percentile Input */}
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  Your JEE Percentile
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    id="predictor-percentile"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={percentile}
                    onChange={(e) => setPercentile(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "0.6rem 0.875rem",
                      borderRadius: "0.6rem",
                      border: "1.5px solid rgba(99,102,241,0.4)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#a5b4fc" }}>%ile</span>
                </div>
              </div>

              {/* Summary pills */}
              {pct > 0 && (
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: "rgba(5,150,105,0.2)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "999px", padding: "0.3rem 0.875rem", fontSize: "0.75rem", fontWeight: 700, color: "#34d399" }}>
                    ✓ {summary.high} High-Chance
                  </span>
                  <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "999px", padding: "0.3rem 0.875rem", fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24" }}>
                    ≈ {summary.borderline} Borderline
                  </span>
                  <span style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "0.3rem 0.875rem", fontSize: "0.75rem", fontWeight: 700, color: "#fb923c" }}>
                    ↑ {summary.reach} Reach
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────── */}
        <div
          className="card-premium animate-fade-in"
          style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.875rem", alignItems: "center" }}
        >
          {/* College type filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {typeOptions.map((t) => (
              <button
                key={t}
                id={`pred-type-${t}`}
                onClick={() => setFilterType(t)}
                className={filterType === t ? "select-btn active" : "select-btn"}
                style={{ padding: "0.35rem 0.7rem", fontSize: "0.78rem" }}
              >
                {t !== "All" && TYPE_ICONS[t]} {t}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Show only reachable */}
            <button
              id="pred-show-reachable"
              onClick={() => setShowOnly((p) => p === "All" ? "Reachable" : "All")}
              className={showOnly === "Reachable" ? "select-btn active" : "select-btn"}
              style={{ padding: "0.35rem 0.7rem", fontSize: "0.78rem" }}
            >
              {showOnly === "Reachable" ? "✓ " : ""}Reachable Only
            </button>

            {/* Sort */}
            <select
              id="pred-sort"
              value={sorted}
              onChange={(e) => setSorted(e.target.value as "chance" | "rank" | "package")}
              style={{
                padding: "0.38rem 0.75rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "var(--foreground)",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              <option value="chance">Sort: Admission Chance</option>
              <option value="rank">Sort: NIRF Rank</option>
              <option value="package">Sort: Avg Package</option>
            </select>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {results.length === 0 && (
            <div className="empty-state animate-scale-in">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--foreground)" }}>No matching colleges</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground)", opacity: 0.6, marginTop: "0.5rem" }}>Try changing the filters or entering a different percentile.</p>
            </div>
          )}

          {results.map(({ college: c, prediction: pred }, idx) => (
            <div
              key={c.id}
              id={`pred-card-${c.id}`}
              className="card-premium animate-fade-in"
              style={{ padding: "1.25rem 1.5rem", animationDelay: `${idx * 0.04}s`, opacity: 0, position: "relative", overflow: "hidden" }}
            >
              {/* Accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${pred.color}, transparent)`, borderRadius: "1.25rem 1.25rem 0 0" }} />

              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                {/* College Icon */}
                <div style={{
                  flexShrink: 0,
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "0.75rem",
                  background: pred.bg,
                  border: `1px solid ${pred.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                }}>
                  {TYPE_ICONS[c.type]}
                </div>

                {/* Name + details */}
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.3rem" }}>
                    <span style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "999px", padding: "0.15rem 0.55rem", fontSize: "0.65rem", fontWeight: 700 }}>
                      NIRF #{c.nirf_rank}
                    </span>
                    <span style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "999px", padding: "0.15rem 0.55rem", fontSize: "0.65rem", fontWeight: 700 }}>
                      {c.type}
                    </span>
                  </div>
                  <Link
                    href={`/college/${c.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.015em", lineHeight: 1.25, cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      {c.name}
                    </h3>
                  </Link>
                  <p style={{ fontSize: "0.75rem", color: "var(--foreground)", opacity: 0.55, marginTop: "0.15rem" }}>
                    {c.location} · ₹{c.avg_package_lpa} LPA avg · Cutoff: {c.cutoff_percentile}%ile
                  </p>
                </div>

                {/* Chance meter */}
                <div style={{ flexShrink: 0, textAlign: "center", minWidth: "9rem" }}>
                  <div style={{
                    display: "inline-block",
                    padding: "0.35rem 0.9rem",
                    borderRadius: "999px",
                    background: pred.bg,
                    border: `1px solid ${pred.border}`,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: pred.color,
                    marginBottom: "0.5rem",
                  }}>
                    {pred.label}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "6px", borderRadius: "999px", background: "var(--glass-border)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${pred.pct}%`,
                      background: `linear-gradient(90deg, ${pred.color}, ${pred.color}aa)`,
                      borderRadius: "999px",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--foreground)", opacity: 0.4, marginTop: "0.25rem", fontWeight: 700 }}>
                    ~{pred.pct}% chance
                  </div>
                </div>

                {/* View button */}
                <Link
                  href={`/college/${c.id}`}
                  id={`pred-view-${c.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#6366f1",
                    textDecoration: "none",
                    padding: "0.4rem 0.875rem",
                    borderRadius: "0.5rem",
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Note ─────────────────────────────────────────── */}
        <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)", fontSize: "0.78rem", color: "var(--foreground)", opacity: 0.65, lineHeight: 1.6 }}>
          ⚠️ Predictions are based on historical closing ranks. Actual cutoffs vary year-to-year based on difficulty, number of applicants, and seat availability. This tool is for guidance only.
        </div>

      </div>
    </div>
  );
}
