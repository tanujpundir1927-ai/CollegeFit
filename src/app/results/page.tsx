import React from "react";
import Link from "next/link";
import { getRecommendations, Preferences } from "../../lib/engine";
import { Branch, CollegeType, Location } from "../../data/colleges";
import ResultsListClient from "./ResultsListClient";

interface ResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;

  const rawPercentile = typeof params.percentile === "string" ? parseFloat(params.percentile) : 95.0;
  const percentile    = isNaN(rawPercentile) ? 95.0 : Math.max(0, Math.min(100, rawPercentile));

  const rawMaxFees = typeof params.maxFees === "string" ? parseFloat(params.maxFees) : 3.5;
  const maxFees    = isNaN(rawMaxFees) ? 3.5 : Math.max(0, rawMaxFees);

  let priority: "placements" | "research" | "budget" | "balanced" = "balanced";
  if (
    params.priority === "placements" ||
    params.priority === "research" ||
    params.priority === "budget" ||
    params.priority === "balanced"
  ) {
    priority = params.priority;
  }

  let preferredBranches: Branch[] = [];
  if (typeof params.branches === "string" && params.branches.trim() !== "") {
    preferredBranches = params.branches.split(",") as Branch[];
  }

  let preferredLocations: Location[] = [];
  if (typeof params.locations === "string" && params.locations.trim() !== "") {
    preferredLocations = params.locations.split(",") as Location[];
  }

  let preferredTypes: CollegeType[] = [];
  if (typeof params.types === "string" && params.types.trim() !== "") {
    preferredTypes = params.types.split(",") as CollegeType[];
  }

  const prefs: Preferences = {
    percentile,
    maxFees,
    preferredBranches,
    preferredLocations,
    preferredTypes,
    priority,
  };

  const recommendations = getRecommendations(prefs);

  const priorityLabels: Record<string, string> = {
    balanced:   "Balanced Fit",
    placements: "Top Placements",
    research:   "Research Focus",
    budget:     "Low Fees",
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, var(--nav-bg) 0%, var(--background) 140px)",
        minHeight: "100vh",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Back + Percentile pill ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
          className="animate-fade-in"
        >
          <Link
            href="/"
            id="results-back"
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
              transition: "all 0.2s ease",
            }}
          >
            ← Adjust Preferences
          </Link>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#4f46e5",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "999px",
                padding: "0.3rem 0.875rem",
              }}
            >
              JEE: {percentile}%
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#059669",
                background: "rgba(5,150,105,0.08)",
                border: "1px solid rgba(5,150,105,0.15)",
                borderRadius: "999px",
                padding: "0.3rem 0.875rem",
              }}
            >
              ₹{maxFees} Lakhs max
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#7c3aed",
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: "999px",
                padding: "0.3rem 0.875rem",
              }}
            >
              {priorityLabels[priority]}
            </span>
          </div>
        </div>

        {/* ── Hero Header ────────────────────────────────────────── */}
        <div
          className="animate-scale-in"
          style={{
            background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #150f3a 100%)",
            borderRadius: "1.5rem",
            padding: "2rem 2.25rem",
            marginBottom: "1.75rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(99,102,241,0.2), 0 2px 12px rgba(15,23,42,0.15)",
          }}
        >
          {/* Decorative orbs */}
          <div style={{
            position: "absolute", top: "-60px", right: "-40px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", left: "30%",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <span style={{
                background: "rgba(99,102,241,0.25)", border: "1px solid rgba(165,180,252,0.3)",
                borderRadius: "999px", padding: "0.25rem 0.75rem",
                fontSize: "0.7rem", fontWeight: 800, color: "#a5b4fc", letterSpacing: "0.06em",
              }}>
                🎯 PERSONALIZED RESULTS
              </span>
              <span style={{ fontSize: "0.75rem", color: "rgba(165,180,252,0.6)" }}>
                {recommendations.length} college{recommendations.length !== 1 ? "s" : ""} found
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              }}
            >
              Your College Recommendations
            </h1>

            <p style={{ fontSize: "0.88rem", color: "rgba(199,210,254,0.8)", marginTop: "0.5rem", maxWidth: "38rem" }}>
              Showing results for{" "}
              <strong style={{ color: "#e0e7ff" }}>
                {preferredBranches.length > 0 ? preferredBranches.join(", ") : "Any Branch"}
              </strong>{" "}
              at{" "}
              <strong style={{ color: "#e0e7ff" }}>
                {preferredTypes.length > 0 ? preferredTypes.join("/") : "Any College Tier"}
              </strong>
              , budget ≤{" "}
              <strong style={{ color: "#e0e7ff" }}>₹{maxFees} Lakhs/yr</strong>
            </p>

            {/* Query summary row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginTop: "1.25rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.8rem",
              }}
            >
              {[
                { label: "Budget Limit",    value: `₹${maxFees} Lakhs/year` },
                { label: "Focus Priority",  value: priorityLabels[priority] },
                { label: "Locations",       value: preferredLocations.length > 0 ? preferredLocations.join(", ") : "All of India" },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ color: "#7c7fff" }}>{item.label}: </span>
                  <span style={{ fontWeight: 700, color: "#e0e7ff" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results List ────────────────────────────────────────── */}
        <ResultsListClient recommendations={recommendations} userPercentile={percentile} />
      </div>
    </div>
  );
}
