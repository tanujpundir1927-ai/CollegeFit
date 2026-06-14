"use client";

import { useEffect, useState } from "react";
import { getWishlist, STORE_EVENT, toggleWishlist } from "../lib/client-store";

interface SaveCollegeButtonProps {
  collegeId: string;
  compact?: boolean;
}

export default function SaveCollegeButton({ collegeId, compact = false }: SaveCollegeButtonProps) {
  const [saved, setSaved] = useState(() =>
    typeof window !== "undefined" && getWishlist().includes(collegeId)
  );

  useEffect(() => {
    const sync = () => setSaved(getWishlist().includes(collegeId));
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, [collegeId]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleWishlist(collegeId))}
      aria-pressed={saved}
      aria-label={saved ? "Remove college from wishlist" : "Save college to wishlist"}
      className={saved ? "btn-primary" : "btn-secondary"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        minHeight: "2.3rem",
        padding: compact ? "0.45rem 0.7rem" : "0.6rem 0.9rem",
        borderRadius: "0.65rem",
        fontSize: "0.78rem",
      }}
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
      {!compact && (saved ? "Saved" : "Save")}
    </button>
  );
}
