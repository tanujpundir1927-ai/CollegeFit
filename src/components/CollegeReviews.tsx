"use client";

import { FormEvent, useState } from "react";
import { addReview, getProfile, getReviews } from "../lib/client-store";

export default function CollegeReviews({ collegeId }: { collegeId: string }) {
  const [reviews, setReviews] = useState(() =>
    typeof window === "undefined" ? [] : getReviews(collegeId)
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = comment.trim();
    if (text.length < 10) return;
    const profile = getProfile();
    const review = addReview({
      collegeId,
      author: profile?.name || "CollegeFit Student",
      rating,
      comment: text,
    });
    setReviews((current) => [review, ...current]);
    setComment("");
  };

  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <section className="card-premium" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow">Student voice</p>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800 }}>College Reviews</h2>
        </div>
        <strong style={{ color: "#a78bfa" }}>{average} / 5</strong>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>
          Rating
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="product-input" style={{ marginTop: "0.35rem" }}>
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
          </select>
        </label>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          minLength={10}
          maxLength={500}
          required
          rows={3}
          className="product-input"
          placeholder="Share placements, campus life, faculty, or admissions experience..."
        />
        <button className="btn-primary" style={{ justifySelf: "start", padding: "0.55rem 1rem" }}>Post review</button>
      </form>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {reviews.length === 0 && <p style={{ opacity: 0.6, fontSize: "0.82rem" }}>No reviews yet. Be the first to share a useful experience.</p>}
        {reviews.map((review) => (
          <article key={review.id} style={{ paddingTop: "0.85rem", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <strong style={{ fontSize: "0.82rem" }}>{review.author}</strong>
              <span style={{ color: "#f59e0b", fontSize: "0.78rem" }}>{"★".repeat(review.rating)}</span>
            </div>
            <p style={{ marginTop: "0.4rem", fontSize: "0.82rem", lineHeight: 1.6, opacity: 0.75 }}>{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
