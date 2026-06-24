/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, UserPlus, HeartCrack, Percent } from "lucide-react";

export function EmployeeStatisticsView() {
  const totalEmployees = 50000;
  const activeEmployees = 47000;
  const inactiveEmployees = 3000;

  const genderData = [
    { label: "Male", count: 30000, pct: 60, color: "bg-indigo-500" },
    { label: "Female", count: 18000, pct: 36, color: "bg-pink-500" },
    { label: "Other", count: 2000, pct: 4, color: "bg-gray-400" }
  ];

  const [joinedInput, setJoinedInput] = useState<number>(1000);
  const [resignedInput, setResignedInput] = useState<number>(200);
  const calculatedAttrition = joinedInput > 0 ? ((resignedInput / joinedInput) * 100).toFixed(1) : "0.0";

  const empTypes = [
    { label: "Permanent", count: "38,000", pct: 76, color: "bg-indigo-500" },
    { label: "Contract", count: "8,500", pct: 17, color: "bg-sky-500" },
    { label: "Intern", count: "2,000", pct: 4, color: "bg-teal-500" },
    { label: "Consultant", count: "1,500", pct: 3, color: "bg-amber-500" }
  ];

  const departments = [
    { name: "Information Technology", count: "22,000", pct: 44, color: "bg-indigo-500" },
    { name: "Operations", count: "11,000", pct: 22, color: "bg-sky-500" },
    { name: "Sales & Marketing", count: "8,500", pct: 17, color: "bg-teal-500" },
    { name: "Finance", count: "5,000", pct: 10, color: "bg-amber-500" },
    { name: "Human Resources", count: "3,500", pct: 7, color: "bg-emerald-500" }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Employee Statistics
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Workforce demographics and attrition metrics.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Headcount", val: totalEmployees.toLocaleString(), icon: Users, color: "text-indigo-600 bg-indigo-50", sub: `Active: ${activeEmployees.toLocaleString()} | Inactive: ${inactiveEmployees.toLocaleString()}` },
          { label: "Monthly Growth", val: "+11%", icon: UserPlus, color: "text-emerald-600 bg-emerald-50", sub: "Growth from 45,000 in May" },
          { label: "Annual Attrition", val: "20.0%", icon: HeartCrack, color: "text-rose-600 bg-rose-50", sub: "Joined: 1,000 | Resigned: 200" }
        ].map((m, i) => (
          <div key={i} className={`p-4 border rounded-xl space-y-1 ${m.color.replace('text-', 'bg-').replace('600', '50').replace('500', '50')} border-transparent`}>
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase ${m.color.split(' ')[0]}`}>
              <m.icon className="w-4 h-4" /> {m.label}
            </div>
            <p className="text-2xl font-semibold text-gray-800">{m.val}</p>
            <span className="text-xs font-medium opacity-75">{m.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attrition Calculator */}
        <div className="border border-indigo-100 rounded-xl p-5 bg-indigo-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-1.5">
            <Percent className="w-4 h-4" /> Attrition Sandbox
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {[{l: "Joined", v: joinedInput, s: setJoinedInput}, {l: "Resigned", v: resignedInput, s: setResignedInput}].map(field => (
              <div key={field.l} className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">{field.l}</label>
                <input type="number" value={field.v} onChange={e => field.s(parseInt(e.target.value) || 0)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-indigo-400" />
              </div>
            ))}
          </div>
          <div className="p-4 bg-indigo-600 rounded-xl flex items-center justify-between text-white">
            <span className="text-xs font-semibold">Calculated Attrition Ratio</span>
            <span className="text-xl font-bold">{calculatedAttrition}%</span>
          </div>
        </div>

        {/* Gender Demographics */}
        <div className="border border-pink-100 rounded-xl p-5 bg-pink-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-pink-900">Gender Demographics</h4>
          <div className="space-y-3">
            {genderData.map(g => (
              <div key={g.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>{g.label}</span>
                  <span>{g.pct}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border border-pink-100 overflow-hidden">
                  <div className={`h-full ${g.color}`} style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employment Type */}
        <div className="border border-teal-100 rounded-xl p-5 bg-teal-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-teal-900">Employment Distribution</h4>
          <div className="space-y-3">
            {empTypes.map(type => (
              <div key={type.label} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                  <span>{type.label}</span>
                  <span>{type.pct}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border border-teal-100 overflow-hidden">
                  <div className={`h-full ${type.color}`} style={{ width: `${type.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="border border-amber-100 rounded-xl p-5 bg-amber-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-amber-900">Department Analytics</h4>
          <div className="space-y-3">
            {departments.map(dept => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                  <span className="truncate">{dept.name}</span>
                  <span>{dept.pct}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border border-amber-100 overflow-hidden">
                  <div className={`h-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}