import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { colleges } from "../../../data/colleges";
import CollegeActionsClient from "./CollegeActionsClient";
import CollegeReviews from "../../../components/CollegeReviews";

interface CollegeDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateStaticParams() {
  return colleges.map((college) => ({ id: college.id }));
}

export async function generateMetadata({ params }: CollegeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const college = colleges.find((item) => item.id === id);
  if (!college) return {};
  return {
    title: `${college.name} Admissions, Fees & Placements | CollegeFit AI`,
    description: `${college.name} details including JEE cutoff, fees, placements, branches, campus data, and AI-powered comparison insights.`,
    alternates: { canonical: `/college/${college.id}` },
  };
}

export default async function CollegeDetailPage({ params, searchParams }: CollegeDetailPageProps) {
  const { id }                = await params;
  const resolvedSearchParams  = await searchParams;
  const college               = colleges.find((c) => c.id === id);
  if (!college) notFound();

  const passedScore = typeof resolvedSearchParams.score === "string" ? resolvedSearchParams.score : null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    address: { "@type": "PostalAddress", addressLocality: college.location, addressCountry: "IN" },
    description: college.description,
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, var(--nav-bg) 0%, var(--background) 140px)",
        minHeight: "100vh",
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <div className="animate-fade-in" style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/results"
            id="detail-back"
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
            ← Back to Results
          </Link>
        </div>

        {/* ── Hero Card ─────────────────────────────────────────── */}
        <div
          className="animate-scale-in"
          style={{
            background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #150f3a 100%)",
            borderRadius: "1.5rem",
            padding: "2rem 2.25rem",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(99,102,241,0.2), 0 2px 12px rgba(15,23,42,0.15)",
          }}
        >
          {/* Orbs */}
          <div style={{
            position: "absolute", top: "-60px", right: "-40px",
            width: "220px", height: "220px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", left: "20%",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              {/* Left: Title info */}
              <div style={{ flex: "1 1 auto" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      background: "rgba(99,102,241,0.25)",
                      border: "1px solid rgba(165,180,252,0.3)",
                      borderRadius: "999px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#a5b4fc",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {college.type} Institution
                  </span>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "999px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "rgba(199,210,254,0.8)",
                    }}
                  >
                    📍 {college.location}, India
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  {college.name}
                </h1>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "rgba(199,210,254,0.75)",
                    marginTop: "0.65rem",
                    maxWidth: "40rem",
                    lineHeight: 1.65,
                  }}
                >
                  {college.description}
                </p>
              </div>

              {/* Right: Match score badge (if passed) */}
              {passedScore && (
                <div
                  style={{
                    flexShrink: 0,
                    textAlign: "center",
                    background: "rgba(99,102,241,0.2)",
                    border: "2px solid rgba(99,102,241,0.4)",
                    borderRadius: "1rem",
                    padding: "1.25rem 1.5rem",
                    minWidth: "8rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                    }}
                  >
                    {passedScore}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      color: "#7c7fff",
                      marginTop: "0.35rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Match Score
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Grid Content ──────────────────────────────────────── */}
        <div
          className="animate-fade-in"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          {/* Use a responsive 2-col on md+ via inline style workaround */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left 2 columns */}
            <div className="md:col-span-2 space-y-6">

              {/* Key Metrics */}
              <section>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    letterSpacing: "-0.015em",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📐</span>
                  Key Academic Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "NIRF Rank",
                      value: `#${college.nirf_rank}`,
                      sub: "National engineering ranking",
                      color: "#6366f1",
                      bg: "rgba(99,102,241,0.06)",
                      border: "rgba(99,102,241,0.12)",
                    },
                    {
                      label: "Avg Placements",
                      value: `₹${college.avg_package_lpa} LPA`,
                      sub: "Average annual package",
                      color: "#059669",
                      bg: "rgba(5,150,105,0.06)",
                      border: "rgba(5,150,105,0.12)",
                    },
                    {
                      label: "Annual Fees",
                      value: `₹${college.fees_per_year_lakh} Lakhs`,
                      sub: "Per year tuition fees",
                      color: "var(--foreground)",
                      bg: "var(--glass-bg)",
                      border: "var(--glass-border)",
                    },
                    {
                      label: "JEE Cutoff",
                      value: `${college.cutoff_percentile}%`,
                      sub: "Historic JEE percentile cutoff",
                      color: "#7c3aed",
                      bg: "rgba(124,58,237,0.06)",
                      border: "rgba(124,58,237,0.12)",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="card-premium"
                      style={{
                        padding: "1.1rem",
                        background: m.bg,
                        border: `1px solid ${m.border}`,
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "1.7rem",
                          fontWeight: 900,
                          color: m.color,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                          marginTop: "0.3rem",
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.7rem",
                          color: "#94a3b8",
                          marginTop: "0.25rem",
                        }}
                      >
                        {m.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Branches */}
              <section
                className="card-premium"
                style={{ padding: "1.5rem" }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    letterSpacing: "-0.015em",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>🎓</span>
                  Available Engineering Branches
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {college.branches.map((branch) => (
                    <span
                      key={branch}
                      className="branch-chip"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              </section>

              {/* Strengths */}
              <section className="card-premium" style={{ padding: "1.5rem" }}>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    letterSpacing: "-0.015em",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>⭐</span>
                  Why Students Choose This College
                </h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {college.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        fontSize: "0.875rem",
                        color: "var(--foreground)",
                        lineHeight: 1.5,
                        opacity: 0.85,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: "1.35rem",
                          height: "1.35rem",
                          borderRadius: "50%",
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: "#6366f1",
                          marginTop: "0.05rem",
                        }}
                      >
                        ✓
                      </span>
                      {strength}
                    </li>
                  ))}
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                      lineHeight: 1.5,
                      opacity: 0.85,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "1.35rem",
                        height: "1.35rem",
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: "#6366f1",
                        marginTop: "0.05rem",
                      }}
                    >
                      ✓
                    </span>
                    Established track record of technical education with highly credentialed faculty.
                  </li>
                </ul>
              </section>
            </div>

            {/* Right column: Campus + Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Research score visual */}
              <div
                className="card-premium"
                style={{ padding: "1.25rem" }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Research Score
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#6366f1",
                      lineHeight: 1,
                    }}
                  >
                    {college.research_score}
                  </span>
                  <span style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: 600 }}>/10</span>
                </div>
                {/* Bar */}
                <div
                  style={{
                    marginTop: "0.75rem",
                    height: "6px",
                    borderRadius: "999px",
                    background: "rgba(99,102,241,0.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${college.research_score * 10}%`,
                      background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      borderRadius: "999px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>

              {/* Campus Info */}
              <div className="card-premium" style={{ padding: "1.25rem" }}>
                <h2
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    letterSpacing: "-0.015em",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--glass-border)",
                    marginBottom: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>🏛️</span> Campus Information
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { label: "Location",         value: college.location },
                    { label: "City Type",         value: college.city_type },
                    { label: "Campus Size",       value: `${college.campus_size_acres} Acres` },
                    { label: "Hostel On Campus",  value: college.has_hostel  ? "Yes ✓" : "No" },
                    { label: "Co-Education",      value: college.is_coed     ? "Co-Ed ✓" : "Single-Sex" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.82rem",
                        padding: "0.35rem 0",
                        borderBottom: "1px solid var(--glass-border)",
                      }}
                    >
                      <span style={{ color: "var(--foreground)", fontWeight: 500, opacity: 0.6 }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <CollegeActionsClient collegeId={college.id} collegeName={college.name} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <CollegeReviews collegeId={college.id} />
        </div>
      </div>
    </div>
  );
}
