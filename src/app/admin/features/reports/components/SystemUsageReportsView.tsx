/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Activity, Database, Smartphone, Globe, HardDrive } from "lucide-react";

export function SystemUsageReportsView() {
  const activeUsers = [
    { label: "Daily (DAU)", count: "10,000", pct: 20, color: "bg-indigo-500" },
    { label: "Weekly (WAU)", count: "30,000", pct: 60, color: "bg-indigo-600" },
    { label: "Monthly (MAU)", count: "50,000", pct: 100, color: "bg-indigo-700" }
  ];

  const modules = [
    { name: "Attendance", usage: "95%", pct: 95, color: "bg-teal-500" },
    { name: "Leave Management", usage: "90%", pct: 90, color: "bg-indigo-600" },
    { name: "Payroll", usage: "75%", pct: 75, color: "bg-sky-500" },
    { name: "Recruitment", usage: "40%", pct: 40, color: "bg-amber-500" }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            System Usage Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Track module adoption, API health, and storage utilization.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Active Users row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activeUsers.map(u => (
          <div key={u.label} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">{u.label}</span>
            <p className="text-2xl font-semibold text-indigo-900">{u.count}</p>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-indigo-100">
              <div className={`${u.color} h-full`} style={{ width: `${u.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module adoption */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Module Usage Analytics</h4>
          <div className="space-y-4">
            {modules.map(m => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                  <span>{m.name}</span>
                  <span className="text-gray-500">{m.usage}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage usage */}
        <div className="border border-sky-100 rounded-xl p-5 bg-sky-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-sky-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Organization Storage
          </h4>
          <div className="space-y-4">
            {[
              { org: "XYZ Global", used: "25 GB", pct: 50 },
              { org: "ABC Tech", used: "15 GB", pct: 15 },
              { org: "Stellar Edu", used: "8 GB", pct: 40 }
            ].map(s => (
              <div key={s.org} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                  <span>{s.org}</span>
                  <span className="text-gray-500">{s.used}</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border border-sky-100 overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Diagnostics */}
        <div className="border border-emerald-100 rounded-xl p-5 bg-emerald-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
            <Activity className="w-4 h-4" /> API Diagnostics (24h)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Req", val: "8.4M", bg: "bg-white" },
              { label: "Success", val: "99.8%", bg: "bg-white" },
              { label: "Failed", val: "15K", bg: "bg-white" },
              { label: "Latency", val: "42ms", bg: "bg-white" }
            ].map(item => (
              <div key={item.label} className={`p-3 ${item.bg} border border-emerald-100 rounded-lg`}>
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">{item.label}</span>
                <span className="text-sm font-semibold text-gray-700">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Browser */}
        <div className="border border-indigo-100 rounded-xl p-5 bg-indigo-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-indigo-900">Device & Browser Profile</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Device Distribution
              </span>
              <div className="flex h-2 rounded-full overflow-hidden w-full border border-indigo-100 bg-white">
                <div className="h-full bg-indigo-500" style={{ width: '75%' }} />
                <div className="h-full bg-sky-500" style={{ width: '20%' }} />
                <div className="h-full bg-amber-500" style={{ width: '5%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2">
              {[
                { n: "Chrome", s: "68%" }, { n: "Firefox", s: "14%" },
                { n: "Safari", s: "11%" }, { n: "Edge", s: "7%" }
              ].map(b => (
                <div key={b.n} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-indigo-100">
                  <span className="text-gray-700">{b.n}</span>
                  <span className="text-indigo-600 font-semibold">{b.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      
  );
}