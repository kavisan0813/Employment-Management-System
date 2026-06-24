/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, AlertTriangle, Building, TrendingUp } from "lucide-react";

export function AttendanceAnalyticsView() {
  const dailyMetrics = [
    { label: "Present", count: "40,000", pct: 80, color: "bg-teal-500", bg: "bg-teal-50/50", border: "border-teal-100" },
    { label: "WFH (Remote)", count: "3,000", pct: 6, color: "bg-indigo-500", bg: "bg-indigo-50/50", border: "border-indigo-100" },
    { label: "On Leave", count: "5,000", pct: 10, color: "bg-amber-500", bg: "bg-amber-50/50", border: "border-amber-100" },
    { label: "Absent", count: "2,000", pct: 4, color: "bg-rose-500", bg: "bg-rose-50/50", border: "border-rose-100" }
  ];

  const monthlyTrend = [
    { month: "Jan", rate: "91%" }, { month: "Feb", rate: "92%" },
    { month: "Mar", rate: "89%" }, { month: "Apr", rate: "93%" }
  ];

  const lateComers = [
    { name: "Ravi Kumar", dept: "IT Support", days: 10, mins: 22 },
    { name: "Kumar Ananth", dept: "Operations", days: 8, mins: 15 }
  ];

  const branchCompliance = [
    { name: "Chennai H.O.", comp: "96.4%", ot: "1,240 hrs" },
    { name: "Bengaluru Dev", comp: "94.8%", ot: "2,150 hrs" }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Attendance Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Track daily attendance and time-off metrics.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dailyMetrics.map(m => (
          <div key={m.label} className={`border ${m.bg} ${m.border} rounded-xl p-4 space-y-3`}>
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>{m.label}</span>
              <span className="bg-white px-1.5 py-0.5 rounded border">{m.pct}%</span>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{m.count}</p>
              <div className="w-full bg-white h-1.5 rounded-full mt-2 overflow-hidden border border-gray-100">
                <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Coming Ledger */}
        <div className="border border-amber-100 rounded-xl p-5 bg-amber-50/30 space-y-4">
          <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Late Coming Incident Ledger
          </h4>
          <div className="bg-white rounded-lg border border-amber-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/50 text-amber-800 uppercase font-semibold">
                <tr><th className="p-3">Employee</th><th className="p-3">Days</th><th className="p-3">Avg/Mins</th></tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {lateComers.map(lc => (
                  <tr key={lc.name} className="hover:bg-amber-50/30">
                    <td className="p-3 font-medium text-gray-700">{lc.name}</td>
                    <td className="p-3 text-amber-700 font-bold">{lc.days}</td>
                    <td className="p-3 text-gray-600">{lc.mins}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Compliance */}
        <div className="border border-indigo-100 rounded-xl p-5 bg-indigo-50/30 space-y-4">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Building className="w-4 h-4" /> Branch Compliance
          </h4>
          <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-50/50 text-indigo-800 uppercase font-semibold">
                <tr><th className="p-3">Branch</th><th className="p-3">Comp</th><th className="p-3">OT</th></tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {branchCompliance.map(b => (
                  <tr key={b.name} className="hover:bg-indigo-50/30">
                    <td className="p-3 font-medium text-gray-700">{b.name}</td>
                    <td className="p-3 text-teal-700 font-bold">{b.comp}</td>
                    <td className="p-3 text-indigo-700 font-bold">{b.ot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly trend metrics */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Attendance Compliance Trend
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {monthlyTrend.map(t => (
            <div key={t.month} className="p-4 bg-white border border-gray-100 rounded-xl text-center shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase">{t.month}</span>
              <p className="text-xl font-semibold text-indigo-600">{t.rate}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    
  );
}