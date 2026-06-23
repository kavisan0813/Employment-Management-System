/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, UserPlus, HeartCrack, Percent } from "lucide-react";

export function EmployeeStatisticsView() {
  // Headcount Overview metrics
  const totalEmployees = 50000;
  const activeEmployees = 47000;
  const inactiveEmployees = 3000;

  // Gender Analytics
  const genderData = [
    { label: "Male", count: 30000, pct: 60, color: "bg-indigo-600 border-indigo-200" },
    { label: "Female", count: 18000, pct: 36, color: "bg-pink-500 border-pink-200" },
    { label: "Other", count: 2000, pct: 4, color: "bg-gray-400 border-gray-200" }
  ];

  // Attrition Interactive Calculator State
  const [joinedInput, setJoinedInput] = useState<number>(1000);
  const [resignedInput, setResignedInput] = useState<number>(200);

  const calculatedAttrition = joinedInput > 0 ? ((resignedInput / joinedInput) * 100).toFixed(1) : "0.0";

  // Employment Type
  const empTypes = [
    { label: "Permanent", count: "38,000", pct: 76, color: "bg-indigo-600" },
    { label: "Contract", count: "8,500", pct: 17, color: "bg-sky-500" },
    { label: "Intern", count: "2,000", pct: 4, color: "bg-teal-500" },
    { label: "Consultant", count: "1,500", pct: 3, color: "bg-amber-500" }
  ];

  // Department Analytics
  const departments = [
    { name: "Information Technology", count: "22,000", pct: 44, color: "bg-indigo-600" },
    { name: "Operations", count: "11,000", pct: 22, color: "bg-sky-500" },
    { name: "Sales & Marketing", count: "8,500", pct: 17, color: "bg-teal-500" },
    { name: "Finance", count: "5,000", pct: 10, color: "bg-amber-500" },
    { name: "Human Resources", count: "3,500", pct: 7, color: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <Users className="w-4 h-4 text-indigo-500" /> Total Headcount
          </div>
          <p className="text-2xl font-black text-gray-950">{totalEmployees.toLocaleString()}</p>
          <span className="text-[10px] text-gray-500 font-semibold">Active: {activeEmployees.toLocaleString()} | Inactive: {inactiveEmployees.toLocaleString()}</span>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <UserPlus className="w-4 h-4 text-emerald-500" /> Monthly Growth Trend
          </div>
          <p className="text-2xl font-black text-gray-950">+11%</p>
          <span className="text-[10px] text-gray-500 font-semibold">Growth from 45,000 in May</span>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <HeartCrack className="w-4 h-4 text-rose-500" /> Annual Attrition Rate
          </div>
          <p className="text-2xl font-black text-gray-950">20.0%</p>
          <span className="text-[10px] text-gray-500 font-semibold">Joined: 1,000 | Resigned: 200 (Benchmark: 15%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attrition Rate Interactive Calculator */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
            <Percent className="w-4 h-4 text-indigo-500" /> Attrition Rate Sandbox Calculator
          </h4>
          <p className="text-[11px] text-gray-500 font-medium">
            Adjust employee headcount variables below to simulate real-time organization attrition percentages.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Joined Employees</label>
              <input
                type="number"
                min="1"
                value={joinedInput}
                onChange={e => setJoinedInput(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Resigned Employees</label>
              <input
                type="number"
                min="0"
                value={resignedInput}
                onChange={e => setResignedInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Calculated Attrition Ratio</span>
              <p className="text-[11px] text-gray-500 font-medium">Resigned / Joined * 100</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-950">{calculatedAttrition}%</span>
            </div>
          </div>
        </div>

        {/* Gender split & demographics */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Gender Demographics</h4>
          <div className="flex items-center gap-6 h-full py-2">
            {/* Visual Ring bar */}
            <div className="flex-1 space-y-3">
              {genderData.map(g => (
                <div key={g.label} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border ${g.color}`} />
                    <span className="text-gray-700">{g.label}</span>
                  </div>
                  <span className="text-gray-900">{g.count.toLocaleString()} ({g.pct}%)</span>
                </div>
              ))}
            </div>

            {/* Simulated circular pie percentage indicators */}
            <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Male (60%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="3.2" strokeDasharray="60 40" strokeDashoffset="0" />
                {/* Female (36%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.2" strokeDasharray="36 64" strokeDashoffset="-60" />
                {/* Other (4%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="3.2" strokeDasharray="4 96" strokeDashoffset="-96" />
              </svg>
              <div className="absolute text-[10px] font-black text-gray-800 uppercase">Ratio</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employment Type */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Employment Types Distribution</h4>
          <div className="space-y-3.5">
            {empTypes.map(type => (
              <div key={type.label} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{type.label}</span>
                  <span className="font-semibold text-gray-400">{type.count} staff ({type.pct}%)</span>
                </div>
                <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${type.color}`} style={{ width: `${type.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Analytics */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Department Analytics</h4>
          <div className="space-y-3.5">
            {departments.map(dept => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700 truncate max-w-[200px]">{dept.name}</span>
                  <span className="font-semibold text-gray-400">{dept.count} ({dept.pct}%)</span>
                </div>
                <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
