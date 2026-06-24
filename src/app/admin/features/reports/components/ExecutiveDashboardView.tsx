import React, { useState } from "react";
import { TrendingUp, Award, ShieldAlert } from "lucide-react";

// Utility to match the Organization Report Page container styles
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Healthy": return "bg-emerald-50 border-emerald-100 text-emerald-800";
    case "Premium": return "bg-indigo-50 border-indigo-100 text-indigo-800";
    case "Optimal": return "bg-sky-50 border-sky-100 text-sky-800";
    case "Excellent": return "bg-teal-50 border-teal-100 text-teal-800";
    case "Strong": return "bg-amber-50 border-amber-100 text-amber-800";
    case "High": return "bg-violet-50 border-violet-100 text-violet-800";
    case "Secure": return "bg-emerald-50 border-emerald-100 text-emerald-800";
    case "Stable": return "bg-gray-50 border-gray-200 text-gray-800";
    default: return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

export function ExecutiveDashboardView() {
  const [targetGrowthPct, setTargetGrowthPct] = useState<number>(15);

  const baseMrr = 1000000;
  const projectedMrr = Math.round(baseMrr * (1 + targetGrowthPct / 100));
  const projectedArr = projectedMrr * 12;

  const metrics = [
    { label: "Monthly Recurring Revenue", val: "₹10,00,000", desc: "Active Monthly Baseline", status: "Healthy" },
    { label: "Annual Recurring Revenue", val: "₹1,20,00,000", desc: "Projected Annual Velocity", status: "Healthy" },
    { label: "Customer Lifetime Value", val: "₹25,00,000", desc: "Average subscription value", status: "Premium" },
    { label: "Customer Acquisition Cost", val: "₹3,50,000", desc: "Benchmark payback window", status: "Optimal" },
    { label: "Customer Churn Rate", val: "3.0%", desc: "Benchmark limit: 5% max", status: "Excellent" },
    { label: "Trial-to-Paid Conversion", val: "40.0%", desc: "Trial signup conversion", status: "Strong" },
    { label: "Subscription Renewal Rate", val: "97.0%", desc: "Account retention schedules", status: "High" },
    { label: "Attendance Compliance", val: "95.0%", desc: "Daily punch compliance", status: "Optimal" },
    { label: "Payroll Processing Success", val: "99.9%", desc: "Disbursements success rate", status: "Secure" },
    { label: "System Uptime SLA", val: "99.998%", desc: "Workspace server clusters", status: "Stable" }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Executive Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            C-level metrics and growth projections.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Executive stats metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`p-4 border rounded-xl flex flex-col justify-between h-28 shadow-xs ${getStatusStyles(m.status)}`}>
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">{m.label}</span>
            <div>
              <p className="text-lg font-semibold">{m.val}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-medium opacity-80">{m.desc}</span>
                <span className="text-[10px] font-semibold bg-white/50 px-2 py-0.5 rounded border border-black/5">
                  {m.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projection simulator box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> SaaS Growth Projection Simulator
          </h4>
          <p className="text-sm font-medium text-gray-500 leading-relaxed">
            Slide the selector indicator to set target customer growth rate forecasts. 
            Projections simulate target recurring revenues dynamically based on core platform variables.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>Target Annual Growth Index:</span>
              <span className="text-indigo-600 font-semibold">{targetGrowthPct}% Growth</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={targetGrowthPct}
              onChange={e => setTargetGrowthPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
          <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block">Projected Revenue Output</span>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-medium text-indigo-700 block uppercase">New Projected MRR</span>
              <span className="text-lg font-semibold text-indigo-900">₹{projectedMrr.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-indigo-700 block uppercase">New Projected ARR</span>
              <span className="text-lg font-semibold text-indigo-900">₹{projectedArr.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-800 pt-2 border-t border-indigo-200">
            <Award className="w-4 h-4 text-amber-500" /> Forecast maps business benchmark multipliers.
          </div>
        </div>
      </div>
      </div>
      </div>
    
  );
}