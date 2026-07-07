import { Clock, Shield } from "lucide-react";
import type { SLAPolicy } from "../types/types";
import { useSupportTickets } from "../hooks/useSupportTickets";

export function SLAManagement({
  slaPolicies,
  actions,
}: {
  slaPolicies: SLAPolicy[];
  actions: ReturnType<typeof useSupportTickets>["actions"];
}) {
  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    if (mins < 1440) return `${Math.round(mins / 60)} hr`;
    return `${Math.round(mins / 1440)} day`;
  };

  const tierColor = (t: string) => {
    if (t === "Critical") return "bg-red-50 text-red-700 border-red-200";
    if (t === "High") return "bg-orange-50 text-orange-700 border-orange-200";
    if (t === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            SLA Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Define response and resolution time targets by priority tier.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slaPolicies.map((sla) => (
            <div
              key={sla.id}
              className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-xs ${!sla.active ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${tierColor(sla.tier)}`}
                  >
                    {sla.tier} Priority
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sla.active}
                    onChange={() =>
                      actions.updateSLAPolicy(sla.id, { active: !sla.active })
                    }
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(sla.responseMinutes)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Response
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(sla.resolutionMinutes)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Resolution
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(sla.escalationMinutes)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Escalation
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
