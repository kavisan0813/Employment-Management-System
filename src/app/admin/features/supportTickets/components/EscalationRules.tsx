import React from "react";
import { Zap, ArrowUpCircle } from "lucide-react";
import type { EscalationRule } from "../types/types";

export function EscalationRules({ escalationRules, actions }: { escalationRules: EscalationRule[], actions: any }) {
  const levelColor = (l: string) => {
    if (l === "Admin") return "bg-red-50 text-red-700";
    if (l === "Manager") return "bg-orange-50 text-orange-700";
    if (l === "L2") return "bg-amber-50 text-amber-700";
    return "bg-blue-50 text-blue-700";
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            Escalation Rules
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Automatic escalation paths when SLA targets are at risk.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3">Rule Name</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">No Response Window</th>
              <th className="px-5 py-3">Escalate To</th>
              <th className="px-5 py-3">Level</th>
              <th className="px-5 py-3 text-right">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {escalationRules.map(rule => (
              <tr key={rule.id} className={`hover:bg-gray-50/50 transition-colors ${!rule.active ? 'opacity-50' : ''}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-gray-900">{rule.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{rule.priority}</span></td>
                <td className="px-5 py-4 font-medium text-gray-700">
                  {rule.noResponseMinutes < 60 ? `${rule.noResponseMinutes} min` : rule.noResponseMinutes < 1440 ? `${Math.round(rule.noResponseMinutes / 60)} hr` : `${Math.round(rule.noResponseMinutes / 1440)} day`}
                </td>
                <td className="px-5 py-4 flex items-center gap-1 text-gray-700 font-medium">
                  <ArrowUpCircle className="w-3.5 h-3.5 text-orange-500" /> {rule.escalateTo}
                </td>
                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${levelColor(rule.level)}`}>{rule.level}</span></td>
                <td className="px-5 py-4 text-right">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={rule.active} onChange={() => actions.toggleEscalationRule(rule.id)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
