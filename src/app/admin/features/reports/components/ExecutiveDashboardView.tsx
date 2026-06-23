/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, Award, ShieldAlert, Sparkles, Percent } from "lucide-react";

export function ExecutiveDashboardView() {
  // Slider states for growth projection
  const [targetGrowthPct, setTargetGrowthPct] = useState<number>(15);

  const baseMrr = 1000000; // ₹10L
  const projectedMrr = Math.round(baseMrr * (1 + targetGrowthPct / 100));
  const projectedArr = projectedMrr * 12;

  // Executive KPIs list
  const metrics = [
    { label: "Monthly Recurring Revenue (MRR)", val: "₹10,00,000", desc: "Active Monthly Baseline", status: "Healthy" },
    { label: "Annual Recurring Revenue (ARR)", val: "₹1,20,00,000", desc: "Projected Annual Velocity", status: "Healthy" },
    { label: "Customer Lifetime Value (LTV)", val: "₹25,00,000", desc: "Average subscription value", status: "Premium" },
    { label: "Customer Acquisition Cost (CAC)", val: "₹3,50,000", desc: "Benchmark payback window", status: "Optimal" },
    { label: "Customer Churn Rate", val: "3.0%", desc: "Benchmark limit: 5% max", status: "Excellent" },
    { label: "Trial-to-Paid Conversion", val: "40.0%", desc: "Trial signup converted count", status: "Strong" },
    { label: "Subscription Renewal Rate", val: "97.0%", desc: "Account retention schedules", status: "High" },
    { label: "Attendance Compliance", val: "95.0%", desc: "Daily punch compliance", status: "Optimal" },
    { label: "Payroll Processing Success", val: "99.9%", desc: "Disbursements success rate", status: "Secure" },
    { label: "System Uptime SLA", val: "99.998%", desc: "Workspace server clusters", status: "Stable" }
  ];

  return (
    <div className="space-y-6">
      {/* Executive stats metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.slice(0, 5).map(m => (
          <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between h-28 shadow-xs">
            <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider block">{m.label}</span>
            <div>
              <p className="text-lg font-black text-gray-950">{m.val}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-500 font-semibold">{m.desc}</span>
                <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100 font-mono">
                  {m.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.slice(5).map(m => (
          <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between h-28 shadow-xs">
            <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider block">{m.label}</span>
            <div>
              <p className="text-lg font-black text-gray-950">{m.val}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-500 font-semibold">{m.desc}</span>
                <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-mono">
                  {m.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projection simulator box */}
      <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-indigo-750 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> SaaS Growth Projection Simulator
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Slide the selector indicator to set target customer growth rate forecasts. Projections simulate target recurring revenues dynamically based on core platform variables.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-gray-800">
              <span>Target Annual Growth Index:</span>
              <span className="text-indigo-650 font-mono">{targetGrowthPct}% Growth</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={targetGrowthPct}
              onChange={e => setTargetGrowthPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">
              <span>0% Stable</span>
              <span>50% Target</span>
              <span>100% Double</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block">Projected Revenue Output</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">New Projected MRR</span>
              <span className="text-sm font-black text-gray-900 font-mono">₹{projectedMrr.toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">New Projected ARR</span>
              <span className="text-sm font-black text-emerald-700 font-mono">₹{projectedArr.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-850 pt-1 border-t border-indigo-100">
            <Award className="w-4 h-4 text-amber-500 animate-pulse" /> Forecast maps business benchmark multipliers.
          </div>
        </div>
      </div>
    </div>
  );
}
