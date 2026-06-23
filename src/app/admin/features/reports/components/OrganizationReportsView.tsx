/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Globe, Sparkles, TrendingUp } from "lucide-react";

export function OrganizationReportsView() {
  const metrics = [
    { label: "Total Organizations", val: "500", color: "text-gray-900 bg-gray-50 border-gray-200" },
    { label: "Active Organizations", val: "450", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Trial Accounts", val: "30", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
    { label: "Suspended Accounts", val: "20", color: "text-rose-700 bg-rose-50 border-rose-200" }
  ];

  // SVG parameters for Organization Growth Chart (Jan-Jun)
  // Coordinates (x, y) mapping for: Jan(100), Feb(120), Mar(150), Apr(200), May(300), Jun(500)
  const growthData = [
    { label: "Jan", count: 100 },
    { label: "Feb", count: 120 },
    { label: "Mar", count: 150 },
    { label: "Apr", count: 200 },
    { label: "May", count: 300 },
    { label: "Jun", count: 500 }
  ];

  // SVG settings
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = growthData.map((d, i) => {
    const x = paddingX + (i / (growthData.length - 1)) * (width - 2 * paddingX);
    // scale 100 to 500
    const y = height - paddingY - ((d.count - 100) / 400) * (height - 2 * paddingY);
    return { x, y, label: d.label, count: d.count };
  });

  const linePath = points.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Industry split
  const industries = [
    { name: "IT & Software", count: 200, pct: 40, color: "bg-indigo-600" },
    { name: "Education", count: 120, pct: 24, color: "bg-teal-500" },
    { name: "Manufacturing", count: 100, pct: 20, color: "bg-sky-500" },
    { name: "Healthcare", count: 80, pct: 16, color: "bg-amber-500" }
  ];

  // Countries
  const countries = [
    { name: "India", count: 350, pct: 70 },
    { name: "United Arab Emirates", count: 100, pct: 20 },
    { name: "Singapore", count: 50, pct: 10 }
  ];

  // Top Orgs
  const topOrgs = [
    { name: "ABC Tech Group", employees: "5,000", industry: "IT & Software", status: "Active" },
    { name: "XYZ Global Ltd", employees: "3,000", industry: "Manufacturing", status: "Active" },
    { name: "Stellar Education SRL", employees: "1,200", industry: "Education", status: "Active" }
  ];

  return (
    <div className="space-y-6">
      {/* Metric blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`p-4 border rounded-xl flex flex-col justify-between h-24 ${m.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{m.label}</span>
            <span className="text-2xl font-black">{m.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Platform Growth Index (Jan - Jun)</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +400%
            </span>
          </div>

          <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              <defs>
                <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Guidelines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth={1.5} />

              <path d={areaPath} fill="url(#orgGrad)" />
              <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2.5} strokeLinecap="round" />

              {points.map((p, i) => (
                <g key={i} className="group">
                  <circle cx={p.x} cy={p.y} r={4} fill="#4f46e5" stroke="#ffffff" strokeWidth={1.5} />
                  <text x={p.x} y={height - 2} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">{p.label}</text>
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#0f172a" fontSize={9} fontWeight="bold" fontFamily="monospace" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                    {p.count}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Industry Split */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Tenant Industry Distribution</h4>
          <div className="space-y-3.5">
            {industries.map(ind => (
              <div key={ind.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{ind.name}</span>
                  <span className="font-semibold text-gray-400">{ind.count} orgs ({ind.pct}%)</span>
                </div>
                <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${ind.color}`} style={{ width: `${ind.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country distribution */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-500" /> Geography Operations Allocation
          </h4>
          <div className="divide-y divide-gray-100">
            {countries.map(c => (
              <div key={c.name} className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-gray-800">{c.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-500">{c.count} organizations</span>
                  <span className="font-extrabold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                    {c.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Organizations list */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Top Tenant Workspaces
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-extrabold uppercase tracking-wide">Organization</th>
                  <th className="pb-2 font-extrabold uppercase tracking-wide">Industry</th>
                  <th className="pb-2 font-extrabold uppercase tracking-wide text-right">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topOrgs.map(org => (
                  <tr key={org.name} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold text-gray-900">{org.name}</td>
                    <td className="py-2.5 text-gray-500 font-semibold">{org.industry}</td>
                    <td className="py-2.5 text-right font-black text-indigo-650">{org.employees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
