import React from "react";
import { BarChart3, Clock, PieChart } from "lucide-react";
import type { Ticket, Feedback } from "../types/types";

export function SupportReports({ tickets, feedback }: { tickets: Ticket[], feedback: Feedback[] }) {
  // Category breakdown
  const categories: Record<string, number> = {};
  tickets.forEach(t => { categories[t.category] = (categories[t.category] || 0) + 1; });
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  // Priority breakdown
  const priorities: Record<string, number> = {};
  tickets.forEach(t => { priorities[t.priority] = (priorities[t.priority] || 0) + 1; });

  // Resolution metrics
  const resolved = tickets.filter(t => t.resolvedAt);
  const avgResolutionHours = resolved.length > 0
    ? resolved.reduce((sum, t) => sum + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 3600000, 0) / resolved.length
    : 0;

  // CSAT distribution
  const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedback.forEach(f => { ratingDist[f.rating] = (ratingDist[f.rating] || 0) + 1; });

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Comprehensive support team performance metrics.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs text-center">
          <BarChart3 className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <p className="text-3xl font-extrabold text-gray-900">{tickets.length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase mt-1">Total Tickets</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs text-center">
          <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-3xl font-extrabold text-gray-900">{avgResolutionHours.toFixed(1)}h</p>
          <p className="text-xs font-bold text-gray-400 uppercase mt-1">Avg Resolution Time</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs text-center">
          <PieChart className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-3xl font-extrabold text-gray-900">{feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length * 20).toFixed(0) : 0}%</p>
          <p className="text-xs font-bold text-gray-400 uppercase mt-1">CSAT Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Issue Categories */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Issue Categories</h3>
          <div className="space-y-3">
            {sortedCategories.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${tickets.length ? (count / tickets.length * 100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {["Critical", "High", "Medium", "Low"].map(p => {
              const count = priorities[p] || 0;
              const colors: Record<string, string> = { Critical: "bg-red-500", High: "bg-orange-500", Medium: "bg-amber-400", Low: "bg-blue-400" };
              return (
                <div key={p}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{p}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[p]} rounded-full`} style={{ width: `${tickets.length ? (count / tickets.length * 100) : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
