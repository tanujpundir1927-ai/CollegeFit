"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SaveCollegeButton from "../../../components/SaveCollegeButton";

interface CollegeActionsClientProps {
  collegeId: string;
  collegeName: string;
}

export default function CollegeActionsClient({ collegeId, collegeName }: CollegeActionsClientProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAddToCompare = () => {
    setAdding(true);

    const storedCompareStr  = localStorage.getItem("compare_colleges");
    let currentCompare: string[] = [];

    if (storedCompareStr) {
      try {
        currentCompare = JSON.parse(storedCompareStr);
      } catch {
        currentCompare = [];
      }
    }

    if (currentCompare.includes(collegeId)) {
      alert(`${collegeName} is already added to comparison.`);
      router.push(`/compare?ids=${currentCompare.join(",")}`);
      return;
    }

    if (currentCompare.length >= 3) {
      alert("You can compare a maximum of 3 colleges. Please clear existing selections first.");
      router.push(`/compare?ids=${currentCompare.join(",")}`);
      setAdding(false);
      return;
    }

    const updatedCompare = [...currentCompare, collegeId];
    localStorage.setItem("compare_colleges", JSON.stringify(updatedCompare));
    alert(`${collegeName} successfully added to comparison!`);
    router.push(`/compare?ids=${updatedCompare.join(",")}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        paddingTop: "1rem",
        marginTop: "0.25rem",
        borderTop: "1px solid rgba(99,102,241,0.1)",
      }}
    >
      <SaveCollegeButton collegeId={collegeId} />
      <button
        id="detail-back-btn"
        onClick={() => router.back()}
        className="btn-secondary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          padding: "0.65rem",
          fontSize: "0.82rem",
          width: "100%",
        }}
      >
        ← Back to Results
      </button>

      <button
        id="detail-add-compare"
        onClick={handleAddToCompare}
        disabled={adding}
        className="btn-primary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          padding: "0.65rem",
          fontSize: "0.82rem",
          width: "100%",
          opacity: adding ? 0.75 : 1,
        }}
      >
        {adding ? "Adding…" : "⚖️ Add to Compare"}
      </button>
    </div>
  );
}
