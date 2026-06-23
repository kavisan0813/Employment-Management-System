/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, AlertTriangle, Timer, Activity, Building } from "lucide-react";

export function AttendanceAnalyticsView() {
  // Daily attendance numbers
  const dailyMetrics = [
    { label: "Present", count: "40,000", pct: 80, color: "bg-teal-500 text-teal-800" },
    { label: "WFH (Remote)", count: "3,000", pct: 6, color: "bg-indigo-500 text-indigo-800" },
    { label: "On Leave", count: "5,000", pct: 10, color: "bg-amber-500 text-amber-800" },
    { label: "Absent", count: "2,000", pct: 4, color: "bg-rose-500 text-rose-800" }
  ];

  // Monthly Trend
  const monthlyTrend = [
    { month: "Jan", rate: "91%" },
    { month: "Feb", rate: "92%" },
    { month: "Mar", rate: "89%" },
    { month: "Apr", rate: "93%" }
  ];

  // Late Coming report
  const lateComers = [
    { name: "Ravi Kumar", department: "IT Support", lateDays: 10, avgMinutes: 22 },
    { name: "Kumar Ananth", department: "Operations", lateDays: 8, avgMinutes: 15 },
    { name: "Sarah Smith", department: "Sales", lateDays: 6, avgMinutes: 12 },
    { name: "John Doe", department: "HR Services", lateDays: 5, avgMinutes: 18 }
  ];

  // Branch statistics
  const branchCompliance = [
    { name: "Chennai H.O.", compliance: "96.4%", overtimeHours: "1,240 hrs" },
    { name: "Bengaluru Dev Center", compliance: "94.8%", overtimeHours: "2,150 hrs" },
    { name: "Delhi Regional Office", compliance: "91.2%", overtimeHours: "890 hrs" },
    { name: "Mumbai Branch", compliance: "95.1%", overtimeHours: "1,050 hrs" }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dailyMetrics.map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-gray-400">
              <span>{m.label}</span>
              <span className="font-mono text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded">{m.pct}%</span>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-950">{m.count}</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${m.color.split(" ")[0]}`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Coming Ledger */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" /> Late Coming Incident Ledger
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-150">
                  <th className="pb-2 font-bold uppercase tracking-wide">Employee</th>
                  <th className="pb-2 font-bold uppercase tracking-wide">Department</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-center">Late Days</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-right">Avg Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lateComers.map(lc => (
                  <tr key={lc.name} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold text-gray-950">{lc.name}</td>
                    <td className="py-2.5 text-gray-500 font-semibold">{lc.department}</td>
                    <td className="py-2.5 text-center font-extrabold text-amber-600 bg-amber-50 rounded-md font-mono">{lc.lateDays} days</td>
                    <td className="py-2.5 text-right font-black text-gray-800 font-mono">+{lc.avgMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overtime & Branch Analytics */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-500" /> Multi-Branch Compliance & Overtime
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-150">
                  <th className="pb-2 font-bold uppercase tracking-wide">Branch</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-center">Compliance</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-right">Total Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {branchCompliance.map(b => (
                  <tr key={b.name} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold text-gray-950">{b.name}</td>
                    <td className="py-2.5 text-center font-extrabold text-teal-600 bg-teal-50 rounded-md font-mono">{b.compliance}</td>
                    <td className="py-2.5 text-right font-black text-indigo-650 font-mono">{b.overtimeHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly trend metrics */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" /> Monthly Attendance Compliance Trend
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {monthlyTrend.map(t => (
            <div key={t.month} className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">{t.month}</span>
              <span className="text-xl font-black text-indigo-950 font-mono">{t.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
