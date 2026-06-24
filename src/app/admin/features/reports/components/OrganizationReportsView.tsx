/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Globe, Sparkles, TrendingUp } from "lucide-react";

export function OrganizationReportsView() {
  const metrics = [
    { label: "Total Organizations", val: "500", color: "bg-gray-50 border-gray-200" },
    { label: "Active Organizations", val: "450", color: "bg-emerald-50 border-emerald-200" },
    { label: "Trial Accounts", val: "30", color: "bg-indigo-50 border-indigo-200" },
    { label: "Suspended Accounts", val: "20", color: "bg-rose-50 border-rose-200" }
  ];

  const growthData = [
    { label: "Jan", count: 100 }, { label: "Feb", count: 120 }, { label: "Mar", count: 150 },
    { label: "Apr", count: 200 }, { label: "May", count: 300 }, { label: "Jun", count: 500 }
  ];

  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = growthData.map((d, i) => ({
    x: paddingX + (i / (growthData.length - 1)) * (width - 2 * paddingX),
    y: height - paddingY - ((d.count - 100) / 400) * (height - 2 * paddingY),
    label: d.label,
    count: d.count
  }));

  const linePath = points.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");

  const industries = [
    { name: "IT & Software", count: 200, pct: 40, color: "bg-indigo-600" },
    { name: "Education", count: 120, pct: 24, color: "bg-teal-500" },
    { name: "Manufacturing", count: 100, pct: 20, color: "bg-sky-500" },
    { name: "Healthcare", count: 80, pct: 16, color: "bg-amber-500" }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Organization Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Metrics and analytics across all tenants.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Metric blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`p-4 border rounded-xl flex flex-col justify-between h-24 ${m.color}`}>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{m.label}</span>
            <span className="text-2xl font-semibold text-gray-700">{m.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Growth Index</h4>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +400%
            </span>
          </div>

          <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2.5} strokeLinecap="round" />
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={4} fill="#4f46e5" />
                  <text x={p.x} y={height - 2} textAnchor="middle" fill="#64748b" fontSize={10} className="font-medium">{p.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Industry Split */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Industry Distribution</h4>
          <div className="space-y-4">
            {industries.map(ind => (
              <div key={ind.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-medium text-gray-700">
                  <span>{ind.name}</span>
                  <span className="text-gray-500">{ind.count} orgs ({ind.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
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
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" /> Geography Operations
          </h4>
          <div className="divide-y divide-gray-100">
            {[
              { name: "India", count: 350, pct: 70 },
              { name: "UAE", count: 100, pct: 20 },
              { name: "Singapore", count: 50, pct: 10 }
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between py-3 text-xs">
                <span className="font-medium text-gray-700">{c.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">{c.count} orgs</span>
                  <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Organizations */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Top Workspaces
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-medium uppercase text-xs">Organization</th>
                  <th className="pb-3 font-medium uppercase text-xs">Industry</th>
                  <th className="pb-3 font-medium uppercase text-xs text-right">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: "ABC Tech Group", employees: "5,000", industry: "IT" },
                  { name: "XYZ Global Ltd", employees: "3,000", industry: "Mfg" },
                  { name: "Stellar Education", employees: "1,200", industry: "Edu" }
                ].map(org => (
                  <tr key={org.name}>
                    <td className="py-3 font-medium text-gray-900">{org.name}</td>
                    <td className="py-3 text-gray-600">{org.industry}</td>
                    <td className="py-3 text-right font-medium text-gray-700">{org.employees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}