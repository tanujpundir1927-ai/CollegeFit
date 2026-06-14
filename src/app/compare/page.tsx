import React, { Suspense } from "react";
import Link from "next/link";
import { colleges } from "../../data/colleges";
import CompareClient from "./CompareClient";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const rawIds = typeof params.ids === "string" ? params.ids : "";
  const ids    = rawIds ? rawIds.split(",") : [];
  const matchedColleges = colleges.filter((c) => ids.includes(c.id));

  return (
    <div
      style={{
        background: "linear-gradient(180deg, var(--nav-bg) 0%, var(--background) 140px)",
        minHeight: "100vh",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page Header ───────────────────────────────────────── */}
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Back link */}
          <Link
            href="/"
            id="compare-back-home"
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
              width: "fit-content",
              transition: "all 0.2s ease",
            }}
          >
            ← Start New Search
          </Link>

          {/* Title block */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #150f3a 100%)",
              borderRadius: "1.5rem",
              padding: "2rem 2.25rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(99,102,241,0.2)",
            }}
          >
            {/* Orbs */}
            <div style={{
              position: "absolute", top: "-50px", right: "-30px",
              width: "180px", height: "180px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{
                background: "rgba(99,102,241,0.25)", border: "1px solid rgba(165,180,252,0.3)",
                borderRadius: "999px", padding: "0.25rem 0.75rem",
                fontSize: "0.7rem", fontWeight: 800, color: "#a5b4fc",
                letterSpacing: "0.06em", display: "inline-block", marginBottom: "0.75rem",
              }}>
                ⚖️ SIDE-BY-SIDE COMPARISON
              </span>

              <h1
                style={{
                  fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Compare Engineering Colleges
              </h1>
              <p style={{ fontSize: "0.88rem", color: "rgba(199,210,254,0.75)", marginTop: "0.5rem", maxWidth: "38rem" }}>
                Compare key parameters — placements, NIRF ranking, annual fees, research score, and facilities side by side.
              </p>

              {matchedColleges.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  {matchedColleges.map((c) => (
                    <span key={c.id} style={{
                      background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "999px", padding: "0.25rem 0.75rem",
                      fontSize: "0.75rem", fontWeight: 700, color: "#e0e7ff",
                    }}>
                      {c.shortName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Compare Content ────────────────────────────────────── */}
        <Suspense
          fallback={
            <div
              style={{
                background: "var(--glass-bg)",
                borderRadius: "1.25rem",
                border: "1px solid var(--glass-border)",
                padding: "5rem 2rem",
                textAlign: "center",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⏳</div>
              <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.6, fontWeight: 600 }}>
                Loading comparison data…
              </p>
              <div className="skeleton" style={{ width: "200px", height: "8px", margin: "1rem auto 0" }} />
            </div>
          }
        >
          <CompareClient initialColleges={matchedColleges} />
        </Suspense>
      </div>
    </div>
  );
}
