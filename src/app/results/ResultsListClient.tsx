"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecommendationResult } from "../../lib/engine";

interface ResultsListClientProps {
  recommendations: RecommendationResult[];
  userPercentile: number;
}

export default function ResultsListClient({ recommendations, userPercentile }: ResultsListClientProps) {
  const router = useRouter();
  
  // State to track which colleges are selected for comparison (store IDs)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCompareCheckboxChange = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 colleges at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCompareSubmit = () => {
    if (selectedIds.length < 2) {
      alert("Please select at least 2 colleges to compare.");
      return;
    }
    router.push(`/compare?ids=${selectedIds.join(",")}`);
  };

  return (
    <div className="space-y-6">
      {/* Compare Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-6 z-30 mx-auto max-w-xl bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {selectedIds.map((id) => {
                const rec = recommendations.find((r) => r.college.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold border-2 border-white"
                  >
                    {rec?.college.shortName}
                  </span>
                );
              })}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              ({selectedIds.length}/3) Selected
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleCompareSubmit}
              disabled={selectedIds.length < 2}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Compare Now &rarr;
            </button>
          </div>
        </div>
      )}

      {/* College List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">No colleges matched your preferences.</p>
            <Link href="/" className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
              Reset preferences and search again
            </Link>
          </div>
        ) : (
          recommendations.map((rec) => {
            const { college, matchScore, matchReasons, isReach, isEligible } = rec;
            const isChecked = selectedIds.includes(college.id);

            return (
              <div
                key={college.id}
                className={`relative overflow-hidden bg-white border rounded-2xl p-6 transition-all duration-300 ${
                  isChecked
                    ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/30"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Score badge / status */}
                <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-transparent via-slate-100 to-indigo-500" />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Column: College Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800">
                        NIRF #{college.nirf_rank}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                        {college.type}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        ₹{college.fees_per_year_lakh} Lakhs/yr
                      </span>
                      <span className="text-xs text-slate-500">
                        • {college.location}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      <Link href={`/college/${college.id}`}>{college.name}</Link>
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {college.description}
                    </p>
                  </div>

                  {/* Right Column: Match Score & Action */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 shrink-0 sm:w-44 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`text-2xl font-black ${
                          matchScore >= 80 ? "text-emerald-600" : matchScore >= 60 ? "text-amber-500" : "text-rose-500"
                        }`}>
                          {matchScore}%
                        </span>
                        <span className="text-xs font-bold text-slate-400">Match</span>
                      </div>
                      
                      {/* Safety Label */}
                      <div className="mt-1">
                        {!isEligible ? (
                          <span className="inline-flex items-center rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            Low Admission Odds
                          </span>
                        ) : isReach ? (
                          <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                            Reach College
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            Safe Target
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compare Selection Checkbox */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={!isChecked && selectedIds.length >= 3}
                        onChange={() => handleCompareCheckboxChange(college.id)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {isChecked ? "Selected" : "Compare"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Match Reasons (Why recommended) */}
                <div className="mt-5 border-t border-dashed border-slate-200/80 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Why recommended:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600">
                    {matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold shrink-0">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View Details link */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/college/${college.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Campus Details, Placements & Facilities &rarr;
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
