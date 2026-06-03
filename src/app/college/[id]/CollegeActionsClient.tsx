"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CollegeActionsClientProps {
  collegeId: string;
  collegeName: string;
}

export default function CollegeActionsClient({ collegeId, collegeName }: CollegeActionsClientProps) {
  const router = useRouter();

  const handleAddToCompare = () => {
    // We use a simple localStorage to persist comparisons between pages
    const storedCompareStr = localStorage.getItem("compare_colleges");
    let currentCompare: string[] = [];

    if (storedCompareStr) {
      try {
        currentCompare = JSON.parse(storedCompareStr);
      } catch (e) {
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
      return;
    }

    const updatedCompare = [...currentCompare, collegeId];
    localStorage.setItem("compare_colleges", JSON.stringify(updatedCompare));
    alert(`${collegeName} successfully added to comparison!`);
    router.push(`/compare?ids=${updatedCompare.join(",")}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
      <button
        onClick={() => router.back()}
        className="inline-flex justify-center items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer"
      >
        &larr; Back to Results
      </button>

      <button
        onClick={handleAddToCompare}
        className="inline-flex justify-center items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
      >
        Add to Compare &amp; View
      </button>
    </div>
  );
}
