"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getProfile, saveProfile } from "../../lib/client-store";

export default function AccountClient() {
  const [profile, setProfile] = useState(() => typeof window === "undefined" ? null : getProfile());
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = { name: name.trim(), email: email.trim(), provider: "email" as const };
    saveProfile(next);
    setProfile(next);
  };

  if (profile) {
    return <div className="product-page"><div className="mx-auto max-w-xl px-4 py-16"><section className="card-premium auth-card"><p className="eyebrow">Signed in locally</p><h1>{profile.name}</h1><p>{profile.email}</p><div className="auth-actions"><Link href="/dashboard" className="btn-primary product-link">Open dashboard</Link><button className="btn-secondary" onClick={() => { saveProfile(null); setProfile(null); }}>Sign out</button></div></section></div></div>;
  }

  return (
    <div className="product-page"><div className="mx-auto max-w-xl px-4 py-16">
      <section className="card-premium auth-card">
        <p className="eyebrow">CollegeFit account</p><h1>Save your admission journey</h1><p>Your profile connects wishlist, reviews, searches, and AI conversations on this device.</p>
        <a href="/api/auth/google" className="google-button">Continue with Google</a>
        <div className="auth-divider"><span>or email</span></div>
        <form onSubmit={submit} style={{ display: "grid", gap: "0.8rem" }}>
          <input className="product-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" minLength={2} required />
          <input className="product-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          <button className="btn-primary" style={{ padding: "0.7rem" }}>Continue with email</button>
        </form>
        <p className="auth-note">Email mode is local-first for the current deployment. Configure PostgreSQL and OAuth environment variables to enable shared server accounts.</p>
      </section>
    </div></div>
  );
}
