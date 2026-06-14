import type { Metadata } from "next";
import Link from "next/link";
import MouseGlow from "../components/MouseGlow";
import AIAssistant from "../components/AIAssistant";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeToggle from "../components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://collegefit.vercel.app"),
  title: "CollegeFit | Smart Indian College Recommendation System",
  applicationName: "CollegeFit AI",
  description:
    "Find the best-fit engineering college based on percentile, budget, and preferences. AI-powered matching for JEE students.",
  openGraph: {
    title: "CollegeFit — Smart College Matching",
    description: "AI-powered engineering college recommendation platform for Indian students.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeFit",
    description: "AI-powered engineering college recommendation platform.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/" },
  keywords: ["college predictor", "JEE colleges", "engineering college comparison", "college recommendations", "India admissions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('collegefit_theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)" }}>

        {/* Mouse-follow glow — renders only on client */}
        <MouseGlow />

        {/* Floating AI Chat Assistant */}
        <AIAssistant />

        {/* Animated Background Blobs */}
        <AnimatedBackground />

        {/* ── Navigation ───────────────────────────────── */}
        <header
          className="sticky top-0 z-40 w-full"
          style={{
            background: "var(--nav-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-subtle)",
            boxShadow: "0 1px 12px rgba(99, 102, 241, 0.06)",
          }}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="CollegeFit home">
              {/* Icon mark */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "0.6rem",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                className="group-hover:scale-105"
              >
                🎓
              </div>
              <span
                className="gradient-text text-xl font-extrabold tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                CollegeFit
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "0.4rem",
                  padding: "0.15rem 0.5rem",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "#6366f1",
                  letterSpacing: "0.05em",
                }}
              >
                BETA
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-6" aria-label="Main navigation">
              <Link href="/" className="nav-link" id="nav-home">
                Find College
              </Link>
              <Link href="/predictor" className="nav-link" id="nav-predictor">
                Predictor
              </Link>
              <Link href="/scholarships" className="nav-link" id="nav-scholarships">
                Scholarships
              </Link>
              <Link href="/compare" className="nav-link" id="nav-compare">
                Compare
              </Link>
              <Link href="/analytics" className="nav-link hidden lg:inline-flex" id="nav-analytics">
                Analytics
              </Link>
              <Link href="/dashboard" className="nav-link hidden md:inline-flex" id="nav-dashboard">
                Dashboard
              </Link>

              <ThemeToggle />

              <Link
                href="/account"
                id="nav-cta"
                className="btn-primary hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm"
                style={{ borderRadius: "0.75rem", fontSize: "0.8rem" }}
              >
                Sign In →
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Main Content ──────────────────────────────── */}
        <main className="flex-1 flex flex-col relative z-10">{children}</main>

        {/* ── Footer ───────────────────────────────────── */}
        <footer
          className="relative z-10"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--nav-bg)",
            padding: "2.5rem 0",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ marginBottom: "2rem" }}>
              {/* Brand */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span className="gradient-text text-lg font-extrabold">CollegeFit</span>
                  <span style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "0.4rem", padding: "0.1rem 0.4rem", fontSize: "0.6rem", fontWeight: 800, color: "#6366f1" }}>BETA</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--foreground)", opacity: 0.55, lineHeight: 1.6 }}>
                  AI-powered engineering college recommendation platform for Indian JEE students.
                </p>
              </div>

              {/* Tools */}
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--foreground)", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>Tools</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { href: "/",            label: "College Finder" },
                    { href: "/predictor",   label: "Admission Predictor" },
                    { href: "/scholarships",label: "Scholarship Finder" },
                    { href: "/compare",     label: "Compare Colleges" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--foreground)", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>About</p>
                <p style={{ fontSize: "0.78rem", color: "var(--foreground)", opacity: 0.55, lineHeight: 1.6 }}>
                  Data covers IITs, NITs, IIITs, and top private colleges. AI insights powered by Gemini.
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.73rem", color: "var(--foreground)", opacity: 0.4 }}>
                © {new Date().getFullYear()} CollegeFit AI. Built for better admission decisions.
              </p>
              <p style={{ fontSize: "0.73rem", color: "var(--foreground)", opacity: 0.4 }}>
                AI-powered · Dark Mode · Open Beta
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
