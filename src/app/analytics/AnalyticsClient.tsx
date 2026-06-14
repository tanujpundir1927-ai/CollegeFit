"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { colleges } from "../../data/colleges";

const collegeTrends = colleges.map((college) => ({
  name: college.shortName,
  placements: college.avg_package_lpa,
  fees: college.fees_per_year_lakh,
  roi: Number((college.avg_package_lpa / college.fees_per_year_lakh).toFixed(1)),
}));

const branchTrends = Array.from(new Set(colleges.flatMap((college) => college.branches)))
  .map((branch) => ({ branch, colleges: colleges.filter((college) => college.branches.includes(branch)).length }))
  .sort((a, b) => b.colleges - a.colleges)
  .slice(0, 8);

export default function AnalyticsClient() {
  return (
    <div className="product-page">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="product-hero">
          <p className="eyebrow">Decision intelligence</p>
          <h1>College Analytics</h1>
          <p>Compare placement outcomes, annual fees, ROI, and popular engineering branches across the CollegeFit dataset.</p>
        </section>

        <div className="analytics-grid">
          <section className="card-premium chart-card">
            <h2>Placement vs annual fees</h2>
            <p>Values are shown in lakh rupees.</p>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 600, height: 330 }}>
                <BarChart data={collegeTrends}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" /><XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#111128", border: "1px solid rgba(129,140,248,.3)", borderRadius: 12 }} /><Legend /><Bar dataKey="placements" fill="#6366f1" radius={[6,6,0,0]} /><Bar dataKey="fees" fill="#a78bfa" radius={[6,6,0,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card-premium chart-card">
            <h2>ROI index</h2>
            <p>Average package divided by annual fees.</p>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 600, height: 330 }}><BarChart data={collegeTrends} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" /><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis type="category" dataKey="name" width={72} tick={{ fill: "#94a3b8", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#111128", border: "1px solid rgba(129,140,248,.3)", borderRadius: 12 }} /><Bar dataKey="roi" fill="#22c55e" radius={[0,6,6,0]} /></BarChart></ResponsiveContainer>
            </div>
          </section>

          <section className="card-premium chart-card analytics-wide">
            <h2>Popular branches</h2>
            <p>Number of colleges in the current dataset offering each branch.</p>
            <div className="branch-bars">{branchTrends.map((item) => <div key={item.branch}><span>{item.branch}</span><div><i style={{ width: `${(item.colleges / colleges.length) * 100}%` }} /></div><strong>{item.colleges}</strong></div>)}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
