/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Activity, Database, Smartphone, Chrome } from "lucide-react";

export function SystemUsageReportsView() {
  // Login stats
  const activeUsers = [
    { label: "Daily Active Users (DAU)", count: "10,000", pct: 20 },
    { label: "Weekly Active Users (WAU)", count: "30,000", pct: 60 },
    { label: "Monthly Active Users (MAU)", count: "50,000", pct: 100 }
  ];

  // Module adoption
  const modules = [
    { name: "Attendance & Punch Clock", usage: "95%", pct: 95, color: "bg-teal-500" },
    { name: "Leave & Absence Management", usage: "90%", pct: 90, color: "bg-indigo-600" },
    { name: "Payroll Processing", usage: "75%", pct: 75, color: "bg-sky-500" },
    { name: "Recruitment & Applicant Pipeline", usage: "40%", pct: 40, color: "bg-amber-500" }
  ];

  // Storage usage
  const storageUsage = [
    { org: "XYZ Global Ltd", used: "25 GB", allocated: "50 GB", pct: 50 },
    { org: "ABC Tech Group", used: "15 GB", allocated: "100 GB", pct: 15 },
    { org: "Stellar Education SRL", used: "8 GB", allocated: "20 GB", pct: 40 }
  ];

  // API volumes
  const apiRequests = "8.4M requests";
  const apiSuccessRate = "99.82%";
  const apiFailedRequests = "15,120 calls";
  const apiAvgResponse = "42 ms";

  // Device splits
  const devices = [
    { label: "Desktop/Laptop", pct: 75, color: "bg-indigo-600" },
    { label: "Mobile Browser", pct: 20, color: "bg-sky-500" },
    { label: "Tablet Devices", pct: 5, color: "bg-amber-500" }
  ];

  // Browser splits
  const browsers = [
    { name: "Google Chrome", share: "68%" },
    { name: "Mozilla Firefox", share: "14%" },
    { name: "Apple Safari", share: "11%" },
    { name: "Microsoft Edge", share: "7%" }
  ];

  return (
    <div className="space-y-6">
      {/* Active Users row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activeUsers.map(u => (
          <div key={u.label} className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">{u.label}</span>
            <p className="text-2xl font-black text-gray-950">{u.count}</p>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full" style={{ width: `${u.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module adoption bars */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Module Usage Analytics</h4>
          <div className="space-y-3.5">
            {modules.map(m => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{m.name}</span>
                  <span className="font-semibold text-gray-400">{m.usage} Adoption</span>
                </div>
                <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database storage distribution */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-500" /> Organization Storage Usage
          </h4>
          <div className="space-y-4">
            {storageUsage.map(s => (
              <div key={s.org} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{s.org}</span>
                  <span className="font-semibold text-gray-400">{s.used} / {s.allocated}</span>
                </div>
                <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API response telemetry details */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> API Requests Diagnostics (24h)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Total Requests</span>
              <span className="text-sm font-black text-gray-900 font-mono">{apiRequests}</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-150 rounded-xl">
              <span className="text-[9px] font-bold text-teal-600 uppercase block">Success Rate</span>
              <span className="text-sm font-black text-teal-850 font-mono">{apiSuccessRate}</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl">
              <span className="text-[9px] font-bold text-rose-600 uppercase block">Failed Calls</span>
              <span className="text-sm font-black text-rose-850 font-mono">{apiFailedRequests}</span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl">
              <span className="text-[9px] font-bold text-indigo-700 uppercase block">Avg Latency</span>
              <span className="text-sm font-black text-indigo-900 font-mono">{apiAvgResponse}</span>
            </div>
          </div>
        </div>

        {/* Device & Browser split indicators */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Device & Browser Diagnostic Profile</h4>
          
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" /> Device Type share
            </span>
            <div className="flex h-3 rounded-full overflow-hidden w-full">
              {devices.map(d => (
                <div 
                  key={d.label} 
                  className={`h-full ${d.color}`} 
                  style={{ width: `${d.pct}%` }} 
                  title={`${d.label}: ${d.pct}%`} 
                />
              ))}
            </div>
            <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-500 pt-1">
              {devices.map(d => (
                <div key={d.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${d.color}`} />
                  <span>{d.label} ({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Chrome className="w-3.5 h-3.5 text-indigo-500" /> Client Browser usage share
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {browsers.map(b => (
                <div key={b.name} className="flex justify-between items-center bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-150">
                  <span className="text-gray-700">{b.name}</span>
                  <span className="font-extrabold text-indigo-650 font-mono">{b.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
