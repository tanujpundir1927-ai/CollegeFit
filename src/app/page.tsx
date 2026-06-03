"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Branch, CollegeType, Location } from "../data/colleges";

// Pre-defined option lists for the UI selection
const BRANCH_OPTIONS: Branch[] = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Data Science",
  "Biotechnology",
  "Information Technology",
];

const LOCATION_OPTIONS: Location[] = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Kharagpur",
  "Roorkee",
  "Pilani",
];

const TYPE_OPTIONS: CollegeType[] = ["IIT", "NIT", "IIIT", "Private", "Deemed"];

export default function StudentPreferenceForm() {
  const router = useRouter();

  // State representing student preferences
  const [percentile, setPercentile] = useState<string>("95.0");
  const [maxFees, setMaxFees] = useState<number>(3.5);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CollegeType[]>([]);
  const [priority, setPriority] = useState<"placements" | "research" | "budget" | "balanced">("balanced");

  // Multi-select toggle helpers
  const toggleBranch = (branch: Branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  const toggleLocation = (location: Location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const toggleType = (type: CollegeType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectAllBranches = () => {
    if (selectedBranches.length === BRANCH_OPTIONS.length) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches([...BRANCH_OPTIONS]);
    }
  };

  const selectAllLocations = () => {
    if (selectedLocations.length === LOCATION_OPTIONS.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations([...LOCATION_OPTIONS]);
    }
  };

  const selectAllTypes = () => {
    if (selectedTypes.length === TYPE_OPTIONS.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([...TYPE_OPTIONS]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL search parameters to pass state to the Results page
    const params = new URLSearchParams();
    params.set("percentile", percentile);
    params.set("maxFees", maxFees.toString());
    params.set("priority", priority);

    if (selectedBranches.length > 0) {
      params.set("branches", selectedBranches.join(","));
    }
    if (selectedLocations.length > 0) {
      params.set("locations", selectedLocations.join(","));
    }
    if (selectedTypes.length > 0) {
      params.set("types", selectedTypes.join(","));
    }

    // Navigate to results page
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Find Your Perfect College Match
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Enter your academics, preferences, and priorities to generate a customized, data-backed match list.
        </p>
      </div>

      {/* Main Preference Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* SECTION 1: Academics & Budget */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            1. Academics & Budget
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="percentile" className="block text-sm font-semibold text-slate-700 mb-2">
                JEE Main / Entrance Percentile
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="percentile"
                  name="percentile"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  value={percentile}
                  onChange={(e) => setPercentile(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="e.g. 98.5"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-slate-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="maxFees" className="block text-sm font-semibold text-slate-700 mb-2">
                Maximum Annual Fees: <span className="text-indigo-600 font-bold">₹{maxFees} Lakhs</span>
              </label>
              <div className="pt-2">
                <input
                  type="range"
                  id="maxFees"
                  min="1"
                  max="6"
                  step="0.5"
                  value={maxFees}
                  onChange={(e) => setMaxFees(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹1 Lakh</span>
                  <span>₹3.5 Lakhs</span>
                  <span>₹6 Lakhs+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Preferred Branches */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              2. Preferred Engineering Branches
            </h2>
            <button
              type="button"
              onClick={selectAllBranches}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {selectedBranches.length === BRANCH_OPTIONS.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BRANCH_OPTIONS.map((branch) => {
              const isChecked = selectedBranches.includes(branch);
              return (
                <button
                  type="button"
                  key={branch}
                  onClick={() => toggleBranch(branch)}
                  className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    isChecked
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {branch}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: College Types & Locations */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* College Types */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                3. College Tier / Type
              </h2>
              <button
                type="button"
                onClick={selectAllTypes}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                {selectedTypes.length === TYPE_OPTIONS.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((type) => {
                const isChecked = selectedTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      isChecked
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                4. Preferred Cities
              </h2>
              <button
                type="button"
                onClick={selectAllLocations}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                {selectedLocations.length === LOCATION_OPTIONS.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_OPTIONS.map((loc) => {
                const isChecked = selectedLocations.includes(loc);
                return (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => toggleLocation(loc)}
                    className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      isChecked
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 4: Decision Priority */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            5. What's Your Primary Priority?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { id: "balanced", label: "Balanced Fit", desc: "Holistic mix of factors" },
              { id: "placements", label: "Placements", desc: "Maximize package & LPA" },
              { id: "research", label: "Research Focus", desc: "Higher academics & labs" },
              { id: "budget", label: "Low Fees", desc: "Minimize cost & ROI" },
            ].map((p) => {
              const isChecked = priority === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPriority(p.id as any)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                    isChecked
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-bold">{p.label}</span>
                  <span className="text-xs text-slate-500 mt-1">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer"
          >
            Generate College Recommendations &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
