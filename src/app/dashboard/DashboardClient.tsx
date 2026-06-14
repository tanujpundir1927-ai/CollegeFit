"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { colleges } from "../../data/colleges";
import { getProfile, getSavedSearches, getWishlist, STORE_EVENT } from "../../lib/client-store";
import SaveCollegeButton from "../../components/SaveCollegeButton";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function readChats(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("collegefit_chat_history") || "[]") as ChatMessage[];
  } catch {
    return [];
  }
}

export default function DashboardClient() {
  const [version, setVersion] = useState(0);
  const profile = typeof window === "undefined" ? null : getProfile();
  const searches = typeof window === "undefined" ? [] : getSavedSearches();
  const chats = typeof window === "undefined" ? [] : readChats();
  const wishlistIds = typeof window === "undefined" ? [] : getWishlist();
  const savedColleges = colleges.filter((college) => wishlistIds.includes(college.id));

  useEffect(() => {
    const sync = () => setVersion((value) => value + 1);
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div key={version} className="product-page">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="product-hero">
          <p className="eyebrow">Your CollegeFit workspace</p>
          <h1>{profile ? `Welcome back, ${profile.name}` : "Your admission command center"}</h1>
          <p>Keep your shortlist, searches, and AI guidance together while you move from exploration to a final decision.</p>
          {!profile && <Link href="/account" className="btn-primary product-link">Create your profile</Link>}
        </section>

        <div className="dashboard-stats">
          {[
            [savedColleges.length, "Saved colleges"],
            [searches.length, "Recent searches"],
            [chats.filter((message) => message.role === "user").length, "AI questions"],
            [wishlistIds.length > 0 ? "Active" : "Start", "Shortlist status"],
          ].map(([value, label]) => <div className="metric-card" key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>

        <div className="dashboard-grid">
          <section className="card-premium dashboard-panel">
            <div className="panel-heading"><div><p className="eyebrow">Wishlist</p><h2>Saved Colleges</h2></div><Link href="/">Find more</Link></div>
            {savedColleges.length === 0 && <p className="panel-empty">Save colleges from recommendations or detail pages to build your shortlist.</p>}
            {savedColleges.map((college) => (
              <article className="dashboard-row" key={college.id}>
                <div><Link href={`/college/${college.id}`}><strong>{college.shortName}</strong></Link><p>{college.location} · ₹{college.fees_per_year_lakh}L/year · {college.avg_package_lpa} LPA</p></div>
                <SaveCollegeButton collegeId={college.id} compact />
              </article>
            ))}
          </section>

          <section className="card-premium dashboard-panel">
            <div className="panel-heading"><div><p className="eyebrow">History</p><h2>Recent Searches</h2></div></div>
            {searches.length === 0 && <p className="panel-empty">Your recommendation searches will appear here automatically.</p>}
            {searches.slice(0, 6).map((search) => (
              <Link className="dashboard-row" href={search.url} key={search.id}>
                <div><strong>{search.label}</strong><p>{new Date(search.createdAt).toLocaleDateString()}</p></div><span>Open →</span>
              </Link>
            ))}
          </section>

          <section className="card-premium dashboard-panel dashboard-wide">
            <div className="panel-heading"><div><p className="eyebrow">Gemini assistant</p><h2>AI Chat Highlights</h2></div></div>
            {chats.length === 0 && <p className="panel-empty">Ask the AI assistant a question and your conversation history will be summarized here.</p>}
            {chats.filter((message) => message.role === "user").slice(-4).reverse().map((message, index) => (
              <div className="dashboard-row" key={`${message.content}-${index}`}><strong>{message.content}</strong><span>AI question</span></div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
