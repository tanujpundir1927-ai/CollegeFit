import React, { Suspense } from "react";
import Link from "next/link";
import { colleges } from "../../data/colleges";
import CompareClient from "./CompareClient";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  // Await the searchParams promise (Next.js 16 standard)
  const params = await searchParams;
  
  const rawIds = typeof params.ids === "string" ? params.ids : "";
  const ids = rawIds ? rawIds.split(",") : [];

  // Lookup matching colleges
  const matchedColleges = colleges.filter((c) => ids.includes(c.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Engineering Colleges
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare key parameters like average placement package, NIRF ranking, annual fees, and cutoffs.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/"
            className="inline-flex justify-center items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            &larr; Start New Search
          </Link>
        </div>
      </div>

      {/* Under development page details wrapped in standard suspense boundary */}
      <Suspense fallback={
        <div className="flex items-center justify-center p-20 bg-white border border-slate-200 rounded-2xl">
          <div className="text-slate-500 text-sm">Loading Comparison Data...</div>
        </div>
      }>
        <CompareClient initialColleges={matchedColleges} />
      </Suspense>
    </div>
  );
}
