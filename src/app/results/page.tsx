import React from "react";
import Link from "next/link";
import { getRecommendations, Preferences } from "../../lib/engine";
import { Branch, CollegeType, Location } from "../../data/colleges";
import ResultsListClient from "./ResultsListClient";

interface ResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  // Await search params since they are resolved asynchronously in Next.js 16
  const params = await searchParams;

  // 1. Safely parse percentile
  const rawPercentile = typeof params.percentile === "string" ? parseFloat(params.percentile) : 95.0;
  const percentile = isNaN(rawPercentile) ? 95.0 : Math.max(0, Math.min(100, rawPercentile));

  // 2. Safely parse max fees
  const rawMaxFees = typeof params.maxFees === "string" ? parseFloat(params.maxFees) : 3.5;
  const maxFees = isNaN(rawMaxFees) ? 3.5 : Math.max(0, rawMaxFees);

  // 3. Parse priority
  let priority: "placements" | "research" | "budget" | "balanced" = "balanced";
  if (
    params.priority === "placements" ||
    params.priority === "research" ||
    params.priority === "budget" ||
    params.priority === "balanced"
  ) {
    priority = params.priority;
  }

  // 4. Parse Preferred Branches
  let preferredBranches: Branch[] = [];
  if (typeof params.branches === "string" && params.branches.trim() !== "") {
    preferredBranches = params.branches.split(",") as Branch[];
  }

  // 5. Parse Preferred Locations
  let preferredLocations: Location[] = [];
  if (typeof params.locations === "string" && params.locations.trim() !== "") {
    preferredLocations = params.locations.split(",") as Location[];
  }

  // 6. Parse Preferred College Types
  let preferredTypes: CollegeType[] = [];
  if (typeof params.types === "string" && params.types.trim() !== "") {
    preferredTypes = params.types.split(",") as CollegeType[];
  }

  // Build the preferences object
  const prefs: Preferences = {
    percentile,
    maxFees,
    preferredBranches,
    preferredLocations,
    preferredTypes,
    priority,
  };

  // Run the recommendation engine
  const recommendations = getRecommendations(prefs);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to Preference Form
        </Link>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Showing ranked recommendations for JEE Percentile: <strong>{percentile}%</strong>
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Recommended Colleges For You
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
          Based on your criteria: {preferredBranches.length > 0 ? preferredBranches.join(", ") : "Any Branch"} at{" "}
          {preferredTypes.length > 0 ? preferredTypes.join("/") : "Any College Tier"} with budget max ₹{maxFees} Lakhs/yr.
        </p>

        {/* Query Summary stats */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400">Budget Limit:</span>{" "}
            <span className="font-semibold text-white">₹{maxFees} Lakhs/year</span>
          </div>
          <span className="text-white/20">|</span>
          <div>
            <span className="text-slate-400">Focus Priority:</span>{" "}
            <span className="font-semibold text-white capitalize">{priority}</span>
          </div>
          <span className="text-white/20">|</span>
          <div>
            <span className="text-slate-400">Locations:</span>{" "}
            <span className="font-semibold text-white">
              {preferredLocations.length > 0 ? preferredLocations.join(", ") : "All of India"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Results Listing with Compare functionality */}
      <ResultsListClient recommendations={recommendations} userPercentile={percentile} />
    </div>
  );
}
