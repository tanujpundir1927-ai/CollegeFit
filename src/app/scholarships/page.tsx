"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────
interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  amountNum: number; // for sorting
  type: "Government" | "Private" | "Institute" | "International";
  eligibility: string;
  minPercentile: number; // 0 = no percentile requirement
  forTypes: string[]; // IIT, NIT, IIIT, Private, Deemed, Any
  deadline: string;
  description: string;
  applyLink: string;
  icon: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "central-sector",
    name: "Central Sector Scheme of Scholarships",
    provider: "Ministry of Education, GoI",
    amount: "₹12,000/year",
    amountNum: 12000,
    type: "Government",
    eligibility: "12th pass, top 20 percentile of respective boards, family income < ₹8 LPA",
    minPercentile: 0,
    forTypes: ["Any"],
    deadline: "October 31 every year",
    description:
      "One of the largest scholarship programs in India covering students from recognised boards across the country. Provides financial support during undergraduate studies.",
    applyLink: "https://scholarships.gov.in/",
    icon: "🏛️",
  },
  {
    id: "pm-usha",
    name: "PM-USHA Merit Scholarship",
    provider: "Ministry of Education, GoI",
    amount: "₹50,000/year",
    amountNum: 50000,
    type: "Government",
    eligibility: "JEE rank holders admitted to participating institutes",
    minPercentile: 90,
    forTypes: ["IIT", "NIT", "IIIT"],
    deadline: "November 30 every year",
    description:
      "Under PM-USHA, merit-based scholarships are offered to top JEE performers at central technical institutes to reduce financial barriers.",
    applyLink: "https://www.ugc.gov.in/",
    icon: "🇮🇳",
  },
  {
    id: "iit-fellowship",
    name: "IIT Need-cum-Merit Aid",
    provider: "IIT Institutions (Internal)",
    amount: "Up to full fee waiver",
    amountNum: 250000,
    type: "Institute",
    eligibility: "Admitted IIT students with family income < ₹5 LPA — get 100% fee waiver",
    minPercentile: 98,
    forTypes: ["IIT"],
    deadline: "Within first semester",
    description:
      "All IITs offer need-cum-merit financial assistance. Students from families earning < ₹5 LPA can receive full fee waiver plus a monthly stipend.",
    applyLink: "https://www.iitb.ac.in/",
    icon: "🎓",
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship (Girls)",
    provider: "AICTE",
    amount: "₹30,000/year + ₹2,000 contingency",
    amountNum: 32000,
    type: "Government",
    eligibility: "Female students in AICTE-approved institutions, family income < ₹8 LPA",
    minPercentile: 0,
    forTypes: ["Any"],
    deadline: "September every year",
    description:
      "Specifically for girl students pursuing technical education. Supports up to 5,000 students per year to reduce gender gap in engineering.",
    applyLink: "https://www.aicte-india.org/bureaus/ewi/scholarship",
    icon: "👩‍💻",
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship (Disabled)",
    provider: "AICTE",
    amount: "₹30,000/year + ₹2,000 contingency",
    amountNum: 32000,
    type: "Government",
    eligibility: "Students with ≥40% disability admitted to AICTE-approved programs",
    minPercentile: 0,
    forTypes: ["Any"],
    deadline: "September every year",
    description:
      "Designed for differently-abled students. Provides financial aid and contingency funds to help them pursue technical degrees.",
    applyLink: "https://www.aicte-india.org/bureaus/ewi/scholarship",
    icon: "♿",
  },
  {
    id: "tata-trust",
    name: "Tata Trust Scholarship",
    provider: "Tata Trusts",
    amount: "Up to ₹1,50,000/year",
    amountNum: 150000,
    type: "Private",
    eligibility: "Meritorious students from economically weaker sections at top institutions",
    minPercentile: 85,
    forTypes: ["IIT", "NIT", "IIIT", "Deemed"],
    deadline: "Rolling applications",
    description:
      "Tata Trusts provides comprehensive scholarship support including fee, hostel, and books. Strong preference for first-generation college students.",
    applyLink: "https://www.tatatrusts.org/",
    icon: "💙",
  },
  {
    id: "infosys-foundation",
    name: "Infosys Foundation Scholarship",
    provider: "Infosys Foundation",
    amount: "₹1,00,000/year",
    amountNum: 100000,
    type: "Private",
    eligibility: "Top performers in CS/IT branches with financial need",
    minPercentile: 90,
    forTypes: ["IIT", "NIT", "IIIT", "Private"],
    deadline: "July every year",
    description:
      "Awarded to outstanding CS/IT students. Recipients also get mentorship from Infosys employees and potential internship opportunities.",
    applyLink: "https://www.infosys.com/infosys-foundation/",
    icon: "💻",
  },
  {
    id: "l-and-t",
    name: "L&T Build India Scholarship",
    provider: "Larsen & Toubro",
    amount: "₹60,000/year",
    amountNum: 60000,
    type: "Private",
    eligibility: "Civil/Mechanical/Electrical branches, merit + financial need",
    minPercentile: 75,
    forTypes: ["Any"],
    deadline: "August every year",
    description:
      "L&T awards scholarships to budding engineers in core branches (Civil, Mechanical, Electrical). Includes career mentoring and potential hire preferences.",
    applyLink: "https://www.larsentoubro.com/",
    icon: "🏗️",
  },
  {
    id: "bits-merit",
    name: "BITS Pilani Merit Scholarships",
    provider: "BITS Pilani (Internal)",
    amount: "Up to ₹90,000/year",
    amountNum: 90000,
    type: "Institute",
    eligibility: "BITSAT rank holders — top rank automatic award; need-based also available",
    minPercentile: 97,
    forTypes: ["Deemed"],
    deadline: "At admission",
    description:
      "BITS Pilani offers merit-based scholarships to top BITSAT performers. Additional need-cum-merit aid is also available for economically weaker students.",
    applyLink: "https://www.bits-pilani.ac.in/",
    icon: "🔬",
  },
  {
    id: "google-wtp",
    name: "Google Women Techmakers Scholarship",
    provider: "Google",
    amount: "₹75,000 (one-time)",
    amountNum: 75000,
    type: "International",
    eligibility: "Female CS/CE students with strong academic record",
    minPercentile: 90,
    forTypes: ["IIT", "NIT", "IIIT", "Private", "Deemed"],
    deadline: "December every year",
    description:
      "Google's flagship scholarship for women pursuing computer science. Includes a 3-day retreat, mentorship from Google engineers, and networking opportunities.",
    applyLink: "https://buildyourfuture.withgoogle.com/scholarships/",
    icon: "🌐",
  },
];

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Government:    { bg: "rgba(5,150,105,0.1)",    color: "#059669", border: "rgba(5,150,105,0.2)" },
  Private:       { bg: "rgba(99,102,241,0.1)",   color: "#6366f1", border: "rgba(99,102,241,0.2)" },
  Institute:     { bg: "rgba(139,92,246,0.1)",   color: "#8b5cf6", border: "rgba(139,92,246,0.2)" },
  International: { bg: "rgba(14,165,233,0.1)",   color: "#0ea5e9", border: "rgba(14,165,233,0.2)" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedType, setSelectedType]         = useState<string>("All");
  const [selectedForType, setSelectedForType]   = useState<string>("All");
  const [sortBy, setSortBy]                     = useState<"amount" | "name">("amount");

  const schTypes = ["All", "Government", "Private", "Institute", "International"];
  const collegeTypes = ["All", "IIT", "NIT", "IIIT", "Private", "Deemed"];

  const filtered = useMemo(() => {
    return SCHOLARSHIPS
      .filter((s) => {
        const matchesSearch = !searchQuery ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "All" || s.type === selectedType;
        const matchesFor  = selectedForType === "All" ||
          s.forTypes.includes("Any") ||
          s.forTypes.includes(selectedForType);
        return matchesSearch && matchesType && matchesFor;
      })
      .sort((a, b) => sortBy === "amount" ? b.amountNum - a.amountNum : a.name.localeCompare(b.name));
  }, [searchQuery, selectedType, selectedForType, sortBy]);

  return (
    <div style={{ background: "linear-gradient(180deg, var(--nav-bg) 0%, var(--background) 140px)", minHeight: "100vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Back ────────────────────────────────────────── */}
        <div className="animate-fade-in" style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            id="scholarships-back"
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
          <div style={{ position: "absolute", bottom: "-30px", left: "25%", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <span style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(165,180,252,0.3)", borderRadius: "999px", padding: "0.25rem 0.75rem", fontSize: "0.7rem", fontWeight: 800, color: "#a5b4fc", letterSpacing: "0.06em" }}>
                💰 SCHOLARSHIP FINDER
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Find Scholarships for Engineering
            </h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(199,210,254,0.8)", marginTop: "0.5rem", maxWidth: "38rem" }}>
              Discover {SCHOLARSHIPS.length} scholarships from government schemes, private foundations, and international bodies. Filter by type, college tier, and amount.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "0.8rem" }}>
              {[
                { label: "Total Scholarships", value: `${SCHOLARSHIPS.length} listed` },
                { label: "Max Award",          value: "Full fee waiver" },
                { label: "Deadline Reminder",  value: "Sept–Dec cycle" },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ color: "#7c7fff" }}>{item.label}: </span>
                  <span style={{ fontWeight: 700, color: "#e0e7ff" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────── */}
        <div
          className="card-premium animate-fade-in"
          style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.875rem", alignItems: "center" }}
        >
          {/* Search */}
          <div style={{ flex: "1 1 200px", position: "relative" }}>
            <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>🔍</span>
            <input
              id="scholarship-search"
              type="text"
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "2.25rem",
                paddingRight: "0.875rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {schTypes.map((t) => (
              <button
                key={t}
                id={`filter-type-${t}`}
                onClick={() => setSelectedType(t)}
                className={selectedType === t ? "select-btn active" : "select-btn"}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* College filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {collegeTypes.map((t) => (
              <button
                key={t}
                id={`filter-college-${t}`}
                onClick={() => setSelectedForType(t)}
                className={selectedForType === t ? "select-btn active" : "select-btn"}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            id="scholarship-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "amount" | "name")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.6rem",
              border: "1px solid var(--glass-border)",
              background: "var(--glass-bg)",
              color: "var(--foreground)",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            <option value="amount">Sort: Highest Amount</option>
            <option value="name">Sort: Name A–Z</option>
          </select>
        </div>

        {/* ── Results Count ─────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Showing {filtered.length} scholarship{filtered.length !== 1 ? "s" : ""}
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--glass-border), transparent)" }} />
        </div>

        {/* ── Scholarship Cards ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.length === 0 && (
            <div className="empty-state animate-scale-in">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💸</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--foreground)" }}>No scholarships match your filters</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground)", opacity: 0.6, marginTop: "0.5rem" }}>Try relaxing the filters above.</p>
            </div>
          )}

          {filtered.map((s, idx) => {
            const tc = TYPE_COLORS[s.type];
            return (
              <div
                key={s.id}
                id={`scholarship-${s.id}`}
                className="card-premium animate-fade-in"
                style={{ padding: "1.5rem", animationDelay: `${idx * 0.05}s`, opacity: 0, position: "relative", overflow: "hidden" }}
              >
                {/* Accent bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${tc.color}, transparent)`, borderRadius: "1.25rem 1.25rem 0 0" }} />

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Icon */}
                  <div style={{
                    flexShrink: 0,
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.875rem",
                    background: tc.bg,
                    border: `1px solid ${tc.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>
                    {s.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {s.type}
                      </span>
                      {s.forTypes.includes("Any") ? (
                        <span style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.68rem", fontWeight: 700 }}>
                          All College Types
                        </span>
                      ) : s.forTypes.map((ft) => (
                        <span key={ft} style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "999px", padding: "0.2rem 0.55rem", fontSize: "0.65rem", fontWeight: 700 }}>
                          {ft}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>
                      {s.name}
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: tc.color, fontWeight: 600, marginTop: "0.2rem" }}>
                      by {s.provider}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--foreground)", opacity: 0.7, marginTop: "0.5rem", lineHeight: 1.55 }}>
                      {s.description}
                    </p>

                    <div style={{ marginTop: "0.875rem", display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.78rem" }}>
                      <div>
                        <span style={{ color: "var(--foreground)", opacity: 0.5, fontWeight: 600 }}>Eligibility: </span>
                        <span style={{ color: "var(--foreground)", opacity: 0.85, fontWeight: 500 }}>{s.eligibility}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--foreground)", opacity: 0.5, fontWeight: 600 }}>Deadline: </span>
                        <span style={{ color: "var(--foreground)", opacity: 0.85, fontWeight: 700 }}>📅 {s.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount + Apply */}
                  <div style={{ flexShrink: 0, textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 900, color: tc.color, lineHeight: 1 }}>{s.amount}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--foreground)", opacity: 0.45, marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Award Value
                      </div>
                    </div>
                    <a
                      href={s.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`apply-${s.id}`}
                      className="btn-primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.45rem 1rem",
                        fontSize: "0.78rem",
                        borderRadius: "0.6rem",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Disclaimer ───────────────────────────────────── */}
        <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)", fontSize: "0.78rem", color: "var(--foreground)", opacity: 0.65, lineHeight: 1.6 }}>
          ⚠️ Scholarship information is indicative. Deadlines and amounts may vary by year. Always verify on the official scholarship portal before applying.
        </div>

      </div>
    </div>
  );
}
