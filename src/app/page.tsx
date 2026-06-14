"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Branch, CollegeType, Location } from "../data/colleges";
import { saveSearch } from "../lib/client-store";

// ── Option Lists ──────────────────────────────────────────────────────────────
const BRANCH_OPTIONS: Branch[] = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Data Science",
  "Biotechnology",
  "Information Technology",
];

const LOCATION_OPTIONS: Location[] = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Kharagpur",
  "Roorkee",
  "Pilani",
];

const TYPE_OPTIONS: CollegeType[] = ["IIT", "NIT", "IIIT", "Private", "Deemed"];

const PRIORITY_OPTIONS = [
  { id: "balanced",   label: "Balanced Fit",   desc: "Holistic mix of all factors", icon: "⚖️" },
  { id: "placements", label: "Top Placements", desc: "Maximize package & LPA",       icon: "💼" },
  { id: "research",   label: "Research Focus", desc: "Higher academics & labs",       icon: "🔬" },
  { id: "budget",     label: "Low Fees",        desc: "Minimize cost & maximize ROI", icon: "💰" },
];

// ── Stats Strip Data ──────────────────────────────────────────────────────────
const STATS = [
  { icon: "🎓", value: "30+",  label: "Top Colleges",            sublabel: "IITs, NITs, IIITs & more" },
  { icon: "📊", value: "12",   label: "Smart Match Factors",     sublabel: "Data-driven scoring" },
  { icon: "🏆", value: "100%", label: "Personalized Results",    sublabel: "Tailored to your profile" },
  { icon: "⚡", label: "Instant Results",         sublabel: "No waiting, no signup" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentPreferenceForm() {
  const router = useRouter();

  const [percentile, setPercentile]           = useState<string>("95.0");
  const [maxFees, setMaxFees]                 = useState<number>(3.5);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedTypes, setSelectedTypes]     = useState<CollegeType[]>([]);
  const [priority, setPriority]               = useState<"placements"|"research"|"budget"|"balanced">("balanced");
  const [isSubmitting, setIsSubmitting]       = useState(false);

  // ── Toggles ──────────────────────────────────────────────────────────────
  const toggle = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, value: T) =>
    set((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);

  const selectAll = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, all: T[], current: T[]) => {
    if (current.length === all.length) set([]); else set([...all]);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.set("percentile", percentile);
    params.set("maxFees", maxFees.toString());
    params.set("priority", priority);
    if (selectedBranches.length > 0)  params.set("branches",  selectedBranches.join(","));
    if (selectedLocations.length > 0) params.set("locations", selectedLocations.join(","));
    if (selectedTypes.length > 0)     params.set("types",     selectedTypes.join(","));

    const url = `/results?${params.toString()}`;
    saveSearch({
      label: `${percentile}% · ${priority} · up to ₹${maxFees}L`,
      url,
    });
    router.push(url);
  };

  // ── Fee slider pct for CSS fill ─────────────────────────────────────────
  const feePct = Math.round(((maxFees - 1) / (6 - 1)) * 100);

  return (
    <div className="relative">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="hero-bg relative">
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 mb-6">
            <span
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(139,92,246,0.35)",
                borderRadius: "999px",
                padding: "0.35rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#a78bfa",
                letterSpacing: "0.05em",
              }}
            >
              🚀 AI-POWERED MATCHING ENGINE
            </span>
          </div>

          <h1
            className="animate-fade-in"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              animationDelay: "0.1s",
            }}
          >
            Find Your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8, #c4b5fd, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "textShine 4s linear infinite",
              }}
            >
              Perfect College
            </span>
            <br />
            with AI
          </h1>
          <style>{`
            @keyframes textShine {
              to { background-position: 200% center; }
            }
          `}</style>

          {/* Subheading */}
          <p
            className="animate-fade-in mx-auto mt-5 max-w-xl"
            style={{
              fontSize: "1.05rem",
              color: "rgba(199,210,254,0.85)",
              lineHeight: 1.65,
              animationDelay: "0.2s",
            }}
          >
            Personalized recommendations powered by intelligent matching and career-focused insights.
          </p>

          {/* ── Stats Strip ───────────────────────────────────────────── */}
          <div
            className="animate-fade-in stagger mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
            style={{ animationDelay: "0.3s" }}
          >
            {STATS.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1rem",
                  padding: "1rem",
                  transition: "transform 0.25s ease, background 0.25s ease",
                }}
                className="text-center hover:scale-105"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{stat.icon}</div>
                {stat.value && (
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#ffffff" }}>
                    {stat.value}
                  </div>
                )}
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a5b4fc", marginTop: "0.1rem" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.65rem", color: "rgba(165,180,252,0.65)", marginTop: "0.15rem" }}>
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </section>

      {/* ── Form Section ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--form-bg)",
            borderRadius: "1.5rem",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "2.5rem",
            marginTop: "-1rem",
          }}
          className="animate-scale-in space-y-8"
        >
          {/* Header */}
          <div className="text-center pb-2">
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Configure Your Preferences
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.35rem" }}>
              All fields are optional — more details = better matches
            </p>
          </div>

          <div className="section-divider" />

          {/* ── SECTION 1: Academics & Budget ──────────────────────────── */}
          <div>
            <SectionLabel number="01" title="Academics & Budget" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">

              {/* Percentile Input */}
              <div>
                <label
                  htmlFor="percentile"
                  style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.85, marginBottom: "0.5rem" }}
                >
                  JEE Main / Entrance Percentile
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    id="percentile"
                    name="percentile"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={percentile}
                    onChange={(e) => setPercentile(e.target.value)}
                    placeholder="e.g. 98.5"
                    style={{
                      display: "block",
                      width: "100%",
                      borderRadius: "0.75rem",
                      border: "1.5px solid var(--glass-border)",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "0.65rem 2.5rem 0.65rem 1rem",
                      fontSize: "0.9rem",
                      color: "var(--foreground)",
                      fontWeight: 600,
                      outline: "none",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 232, 240, 0.9)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#6366f1",
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

              {/* Max Fees Slider */}
              <div>
                <label
                  htmlFor="maxFees"
                  style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.85, marginBottom: "0.5rem" }}
                >
                  Maximum Annual Fees:{" "}
                  <span style={{ color: "#818cf8", fontWeight: 800 }}>₹{maxFees} Lakhs</span>
                </label>
                <div style={{ paddingTop: "0.5rem" }}>
                  <input
                    type="range"
                    id="maxFees"
                    min="1"
                    max="6"
                    step="0.5"
                    value={maxFees}
                    onChange={(e) => setMaxFees(parseFloat(e.target.value))}
                    style={{ width: "100%", "--pct": `${feePct}%` } as React.CSSProperties}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.7rem",
                      color: "#94a3b8",
                      marginTop: "0.4rem",
                      fontWeight: 500,
                    }}
                  >
                    <span>₹1 Lakh</span>
                    <span>₹3.5 Lakhs</span>
                    <span>₹6 Lakhs+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider" />

          {/* ── SECTION 2: Branches ────────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLabel number="02" title="Preferred Engineering Branches" />
              <button
                type="button"
                onClick={() => selectAll(setSelectedBranches, BRANCH_OPTIONS, selectedBranches)}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "999px",
                  padding: "0.2rem 0.65rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {selectedBranches.length === BRANCH_OPTIONS.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-4 sm:grid-cols-3 stagger">
              {BRANCH_OPTIONS.map((branch) => {
                const active = selectedBranches.includes(branch);
                return (
                  <button
                    type="button"
                    key={branch}
                    id={`branch-${branch.replace(/\s+/g, "-").toLowerCase()}`}
                    onClick={() => toggle(setSelectedBranches, branch)}
                    className={`select-btn animate-fade-in ${active ? "active" : ""}`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="section-divider" />

          {/* ── SECTION 3: College Type + Location ─────────────────────── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* College Types */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SectionLabel number="03" title="College Tier / Type" />
                <button
                  type="button"
                  onClick={() => selectAll(setSelectedTypes, TYPE_OPTIONS, selectedTypes)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#6366f1",
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "999px",
                    padding: "0.2rem 0.65rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {selectedTypes.length === TYPE_OPTIONS.length ? "Deselect All" : "All"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {TYPE_OPTIONS.map((type) => {
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      id={`type-${type.toLowerCase()}`}
                      onClick={() => toggle(setSelectedTypes, type)}
                      className={`select-btn ${active ? "active" : ""}`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Locations */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SectionLabel number="04" title="Preferred Cities" />
                <button
                  type="button"
                  onClick={() => selectAll(setSelectedLocations, LOCATION_OPTIONS, selectedLocations)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#6366f1",
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "999px",
                    padding: "0.2rem 0.65rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {selectedLocations.length === LOCATION_OPTIONS.length ? "Deselect All" : "All"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {LOCATION_OPTIONS.map((loc) => {
                  const active = selectedLocations.includes(loc);
                  return (
                    <button
                      type="button"
                      key={loc}
                      id={`loc-${loc.toLowerCase()}`}
                      onClick={() => toggle(setSelectedLocations, loc)}
                      className={`select-btn ${active ? "active" : ""}`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="section-divider" />

          {/* ── SECTION 5: Priority ────────────────────────────────────── */}
          <div>
            <SectionLabel number="05" title="What's Your Primary Priority?" />
            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
              {PRIORITY_OPTIONS.map((p) => {
                const active = priority === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    id={`priority-${p.id}`}
                    onClick={() => setPriority(p.id as typeof priority)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.875rem",
                      border: active ? "2px solid #6366f1" : "1.5px solid var(--glass-border)",
                      background: active
                        ? "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)"
                        : "rgba(255, 255, 255, 0.03)",
                      padding: "1rem 0.5rem",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow: active
                        ? "0 0 0 3px rgba(99,102,241,0.2), 0 4px 12px rgba(99,102,241,0.2)"
                        : "0 1px 3px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(99,102,241,0.12)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLButtonElement).style.transform = "none";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                      }
                    }}
                  >
                    <span style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{p.icon}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: active ? "#a5b4fc" : "var(--foreground)" }}>
                      {p.label}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Submit Button ──────────────────────────────────────────── */}
          <div style={{ paddingTop: "0.5rem" }}>
            <button
              type="submit"
              id="submit-recommendations"
              disabled={isSubmitting}
              className="btn-primary w-full"
              style={{
                padding: "1rem",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                letterSpacing: "-0.01em",
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Finding Best Matches...
                </>
              ) : (
                <>Generate College Recommendations →</>
              )}
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        </form>
      </section>
    </div>
  );
}

// ── Section Label Sub-component ───────────────────────────────────────────────
function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <span
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#ffffff",
          fontSize: "0.65rem",
          fontWeight: 800,
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "0.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          letterSpacing: "0.02em",
        }}
      >
        {number}
      </span>
      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
        {title}
      </span>
    </div>
  );
}
