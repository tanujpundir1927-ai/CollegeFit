import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { colleges } from "../../../data/colleges";
import CollegeActionsClient from "./CollegeActionsClient";

interface CollegeDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollegeDetailPage({ params, searchParams }: CollegeDetailPageProps) {
  // Await the promises as required by Next.js 16
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  // Find college details from dataset
  const college = colleges.find((c) => c.id === id);
  if (!college) {
    notFound();
  }

  // Get score if passed from search results query param
  const passedScore = typeof resolvedSearchParams.score === "string" ? resolvedSearchParams.score : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/results"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to Results
        </Link>
      </div>

      {/* 1. Hero Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                {college.type} Institution
              </span>
              <span className="text-sm text-slate-500">
                {college.location}, India
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {college.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl pt-2 leading-relaxed">
              {college.description}
            </p>
          </div>

          {/* Optional Match Score Badge */}
          {passedScore && (
            <div className="shrink-0 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded-2xl p-4 md:w-36 text-center">
              <div>
                <span className="block text-3xl font-black text-indigo-600">
                  {passedScore}%
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Match Score
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: College Specifics */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Key Metrics Cards */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Key Academic Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">NIRF Rank</span>
                <span className="block text-2xl font-black text-slate-900 mt-1">#{college.nirf_rank}</span>
                <span className="text-xs text-slate-500">National engineering ranking</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Placements</span>
                <span className="block text-2xl font-black text-emerald-600 mt-1">₹{college.avg_package_lpa} LPA</span>
                <span className="text-xs text-slate-500">Lakhs Per Annum average package</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Tuition Fees</span>
                <span className="block text-2xl font-black text-slate-900 mt-1">₹{college.fees_per_year_lakh} Lakhs</span>
                <span className="text-xs text-slate-500">Per year academic tuition fees</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Cutoff Percentile</span>
                <span className="block text-2xl font-black text-indigo-600 mt-1">{college.cutoff_percentile}%</span>
                <span className="text-xs text-slate-500">Historic JEE cutoff requirement</span>
              </div>
            </div>
          </div>

          {/* Available Branches */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Available Branches</h2>
            <div className="flex flex-wrap gap-2">
              {college.branches.map((branch) => (
                <span
                  key={branch}
                  className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {branch}
                </span>
              ))}
            </div>
          </div>

          {/* Why Choose this college */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Why Students Choose This College</h2>
            <ul className="space-y-3">
              {college.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="text-indigo-600 font-bold text-base select-none">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <span className="text-indigo-600 font-bold text-base select-none">✓</span>
                <span>Established track record of technical education with highly credentialed faculty.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right 1 Column: Campus Details & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Campus Information
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900">{college.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City Classification:</span>
                <span className="font-semibold text-slate-900">{college.city_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campus Size:</span>
                <span className="font-semibold text-slate-900">{college.campus_size_acres} Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Research score:</span>
                <span className="font-semibold text-indigo-600">{college.research_score}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hostel On Campus:</span>
                <span className="font-semibold text-slate-900">{college.has_hostel ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Co-Education:</span>
                <span className="font-semibold text-slate-900">{college.is_coed ? "Co-Ed" : "Single-Sex"}</span>
              </div>
            </div>

            {/* Action buttons */}
            <CollegeActionsClient collegeId={college.id} collegeName={college.name} />
          </div>
        </div>

      </div>
    </div>
  );
}
