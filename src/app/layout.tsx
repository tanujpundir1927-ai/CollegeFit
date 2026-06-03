import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://collegefit.vercel.app"),
  title: "CollegeFit | Smart Indian College Recommendation System",
  description: "Find the best-fit engineering college based on percentile, budget, and preferences.",
  openGraph: {
    title: "CollegeFit",
    description: "AI-powered engineering college recommendation platform.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeFit",
    description: "AI-powered engineering college recommendation platform.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  CollegeFit
                </span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                  MVP
                </span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Find College
              </Link>
              <Link
                href="/compare"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Compare
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
            <p>
              &copy; {new Date().getFullYear()} CollegeFit. Built as a 2.5-day Internship Assessment MVP.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
