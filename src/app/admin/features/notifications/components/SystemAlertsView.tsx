/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Server, Database, Mail, HardDrive, Cpu, Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { SystemAlert } from "../types/notifications.types";

interface Props {
  alerts: SystemAlert[];
  onAcknowledgeAlert: (id: string) => void;
}

export function SystemAlertsView({ alerts, onAcknowledgeAlert }: Props) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = alerts.filter(a => {
    const matchesSeverity = filterSeverity === "all" || a.severity === filterSeverity;
    const matchesSearch = a.alertName.toLowerCase().includes(search.toLowerCase()) || 
                          a.description.toLowerCase().includes(search.toLowerCase()) || 
                          a.value.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getNodeColor = (load: number, isCritical: boolean = false) => {
    if (isCritical) return "bg-rose-500";
    if (load > 90) return "bg-orange-500";
    if (load > 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Visual Server Node Health Deck - Added subtle background tints */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "CPU CORES", val: "95% Load", icon: Cpu, color: "orange", node: "App Server Node-04", bg: "bg-orange-50/30" },
          { label: "DB REPLICA", val: "Failover", icon: Database, color: "rose", node: "Replica Heartbeat Lost", pulse: true, bg: "bg-rose-50/30" },
          { label: "STORAGE S3", val: "85% Used", icon: HardDrive, color: "amber", node: "Capacity Warning", bg: "bg-amber-50/30" },
          { label: "SMTP MAIL", val: "Rejected", icon: Mail, color: "orange", node: "Relay Handshake Fail", bg: "bg-orange-50/30" },
          { label: "API GATEWAY", val: "Normal", icon: Server, color: "emerald", node: "Latency: 12ms", bg: "bg-emerald-50/30" }
        ].map((node, i) => (
          <div key={i} className={`${node.bg} border border-black/5 rounded-xl p-4 shadow-sm space-y-2 transition-all hover:shadow-md`}>
            <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase">
              <span className="flex items-center gap-1"><node.icon className="w-3.5 h-3.5" /> {node.label}</span>
              <span className={`text-${node.color}-600 font-bold`}>{node.val}</span>
            </div>
            <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
              <div className={`${getNodeColor(parseInt(node.val), node.pulse)} h-full rounded-full ${node.pulse ? 'animate-pulse' : ''}`} style={{ width: "95%" }} />
            </div>
            <span className="text-[10px] text-gray-600">{node.node}</span>
          </div>
        ))}
      </div>

      {/* Filter Controls - Added slight gray tint */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search health events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span>Severity:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      {/* Alerts Table - Added header tint */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-800 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3">Alert Details</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(alert => (
              <tr key={alert.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{alert.alertName}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{alert.description}</div>
                </td>
                <td className="px-5 py-4 font-mono text-indigo-700">{alert.value}</td>
                <td className="px-5 py-4 text-gray-400">{new Date(alert.timestamp).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded border ${
                    alert.severity === "critical" ? "bg-rose-50 border-rose-100 text-rose-700" : 
                    alert.severity === "warning" ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-semibold ${alert.acknowledged ? "text-emerald-600" : "text-amber-600"}`}>
                    {alert.acknowledged ? "Resolved" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {!alert.acknowledged ? (
                    <button onClick={() => onAcknowledgeAlert(alert.id)} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg shadow-sm transition-all">
                      Acknowledge
                    </button>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}