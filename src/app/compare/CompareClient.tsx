"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { College } from "../../data/colleges";

interface CompareClientProps {
  initialColleges: College[];
}

export default function CompareClient({ initialColleges }: CompareClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collegesToCompare, setCollegesToCompare] = useState<College[]>(initialColleges);

  // Sync state with localStorage on mount (for consistency)
  useEffect(() => {
    const idsFromParams = searchParams.get("ids");
    if (idsFromParams) {
      const ids = idsFromParams.split(",");
      localStorage.setItem("compare_colleges", JSON.stringify(ids));
    } else {
      // Fallback: If no query params exist, try loading from localStorage and redirect
      const stored = localStorage.getItem("compare_colleges");
      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[];
          if (ids.length > 0) {
            router.replace(`/compare?ids=${ids.join(",")}`);
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }, [searchParams, router]);

  // Remove a college from comparison
  const handleRemove = (id: string) => {
    const updated = collegesToCompare.filter((c) => c.id !== id);
    setCollegesToCompare(updated);

    const updatedIds = updated.map((c) => c.id);
    localStorage.setItem("compare_colleges", JSON.stringify(updatedIds));

    if (updatedIds.length > 0) {
      router.push(`/compare?ids=${updatedIds.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem("compare_colleges");
    setCollegesToCompare([]);
    router.push("/");
  };

  // Helper to find the best metric to highlight
  const getBestMetric = (field: keyof College, order: "asc" | "desc") => {
    if (collegesToCompare.length < 2) return null;
    const values = collegesToCompare.map((c) => c[field] as number);
    return order === "asc" ? Math.min(...values) : Math.max(...values);
  };

  const bestRank = getBestMetric("nirf_rank", "asc"); // lower rank is better
  const bestPackage = getBestMetric("avg_package_lpa", "desc"); // higher placement is better
  const bestFees = getBestMetric("fees_per_year_lakh", "asc"); // lower fees is better
  const bestResearch = getBestMetric("research_score", "desc"); // higher research score is better

  if (collegesToCompare.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">No colleges selected for comparison</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
          Go back to the recommendation results list and check "Compare" on the colleges you want to inspect side-by-side.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
          >
            Start New Recommendation Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Table Toolbar Header */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Comparison Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparing {collegesToCompare.length} of max 3 colleges. Best values highlighted in green.
          </p>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors border border-rose-200 bg-rose-50 hover:bg-rose-100/50 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          Clear Comparison Deck
        </button>
      </div>

      {/* Responsive comparison table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              {/* Header column */}
              <th className="w-1/4 p-4 text-left font-bold text-slate-500 border-r border-slate-100">
                Attributes
              </th>
              
              {/* College columns */}
              {collegesToCompare.map((college) => (
                <th key={college.id} className="p-4 text-center border-r border-slate-100 relative group">
                  <button
                    onClick={() => handleRemove(college.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 text-xs font-bold cursor-pointer"
                    title="Remove from comparison"
                  >
                    ✕ Remove
                  </button>
                  <div className="pt-2">
                    <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-2">
                      {college.type}
                    </span>
                    <h3 className="font-extrabold text-slate-900 line-clamp-1">{college.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{college.location}</p>
                  </div>
                </th>
              ))}
              
              {/* Fill empty comparison columns to preserve structure if less than 3 */}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <th key={`empty-h-${i}`} className="p-4 text-slate-300 font-normal border-r border-slate-100 italic bg-slate-50/50">
                  <div className="py-6 text-center text-xs">
                    Slot Available
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            
            {/* ROW 1: NIRF Ranking */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                NIRF Rank
              </td>
              {collegesToCompare.map((c) => {
                const isBest = c.nirf_rank === bestRank;
                return (
                  <td
                    key={c.id}
                    className={`p-4 text-center border-r border-slate-100 ${
                      isBest ? "bg-emerald-50/40 text-emerald-950 font-bold" : "text-slate-800"
                    }`}
                  >
                    #{c.nirf_rank} {isBest && <span className="text-[10px] text-emerald-600 block">(Best)</span>}
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-rank-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 2: Average Placement Package */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Average Placement
              </td>
              {collegesToCompare.map((c) => {
                const isBest = c.avg_package_lpa === bestPackage;
                return (
                  <td
                    key={c.id}
                    className={`p-4 text-center border-r border-slate-100 ${
                      isBest ? "bg-emerald-50/40 text-emerald-950 font-bold" : "text-slate-800"
                    }`}
                  >
                    ₹{c.avg_package_lpa} LPA {isBest && <span className="text-[10px] text-emerald-600 block">(Best)</span>}
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-pkg-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 3: Annual Fees */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Annual Fees
              </td>
              {collegesToCompare.map((c) => {
                const isBest = c.fees_per_year_lakh === bestFees;
                return (
                  <td
                    key={c.id}
                    className={`p-4 text-center border-r border-slate-100 ${
                      isBest ? "bg-emerald-50/40 text-emerald-950 font-bold" : "text-slate-800"
                    }`}
                  >
                    ₹{c.fees_per_year_lakh} Lakhs {isBest && <span className="text-[10px] text-emerald-600 block">(Lowest)</span>}
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-fees-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 4: Historic Cutoff Percentile */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                JEE Cutoff Percentile
              </td>
              {collegesToCompare.map((c) => (
                <td key={c.id} className="p-4 text-center text-slate-800 border-r border-slate-100">
                  {c.cutoff_percentile}%
                </td>
              ))}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-cutoff-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 5: Campus Size */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Campus Size
              </td>
              {collegesToCompare.map((c) => (
                <td key={c.id} className="p-4 text-center text-slate-800 border-r border-slate-100">
                  {c.campus_size_acres} Acres
                </td>
              ))}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-size-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 6: Research Score */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Research Score (1-10)
              </td>
              {collegesToCompare.map((c) => {
                const isBest = c.research_score === bestResearch;
                return (
                  <td
                    key={c.id}
                    className={`p-4 text-center border-r border-slate-100 ${
                      isBest ? "bg-emerald-50/40 text-emerald-950 font-bold" : "text-slate-800"
                    }`}
                  >
                    {c.research_score}/10 {isBest && <span className="text-[10px] text-emerald-600 block">(Best)</span>}
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-res-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 7: Hostel & Co-Ed */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Campus Facilities
              </td>
              {collegesToCompare.map((c) => (
                <td key={c.id} className="p-4 text-center text-slate-800 border-r border-slate-100 text-xs">
                  <div className="space-y-1">
                    <div>Hostel: <span className="font-semibold">{c.has_hostel ? "Yes" : "No"}</span></div>
                    <div>Co-Ed: <span className="font-semibold">{c.is_coed ? "Yes" : "No"}</span></div>
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-fac-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

            {/* ROW 8: Branches Offered */}
            <tr className="hover:bg-slate-50/30">
              <td className="p-4 font-bold text-slate-700 border-r border-slate-100">
                Branches Offered
              </td>
              {collegesToCompare.map((c) => (
                <td key={c.id} className="p-4 text-center border-r border-slate-100">
                  <div className="flex flex-wrap gap-1.5 justify-center max-h-[160px] overflow-y-auto">
                    {c.branches.map((b) => (
                      <span
                        key={b}
                        className="inline-block text-[10px] bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 text-slate-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - collegesToCompare.length }).map((_, i) => (
                <td key={`empty-br-${i}`} className="border-r border-slate-100 bg-slate-50/50" />
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
