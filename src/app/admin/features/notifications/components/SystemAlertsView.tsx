/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Server, Database, Mail, HardDrive, Cpu, ShieldAlert, CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
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

  return (
    <div className="space-y-6">
      
      {/* Visual Server Node Health Deck */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Node 1: CPU */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-400">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-indigo-500" /> CPU CORES</span>
            <span className="text-orange-600">95% Load</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: "95%" }} />
          </div>
          <span className="text-[10px] text-gray-500 font-bold block">App Server Node-04 Warning</span>
        </div>

        {/* Node 2: DB */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-400">
            <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-rose-500" /> DB REPLICA</span>
            <span className="text-rose-600">Failover</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full animate-pulse" style={{ width: "100%" }} />
          </div>
          <span className="text-[10px] text-rose-700 font-bold block">Replica heartbeat Lost</span>
        </div>

        {/* Node 3: Storage */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-400">
            <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-amber-500" /> STORAGE S3</span>
            <span className="text-amber-600">85% Used</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "85%" }} />
          </div>
          <span className="text-[10px] text-gray-500 font-bold block">Capacity Warning Threshold</span>
        </div>

        {/* Node 4: SMTP */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-400">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-orange-500" /> SMTP MAIL</span>
            <span className="text-orange-600">Rejected</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: "100%" }} />
          </div>
          <span className="text-[10px] text-gray-500 font-bold block">Relay Handshake Rejected</span>
        </div>

        {/* Node 5: API */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-400">
            <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-emerald-500" /> API GATEWAY</span>
            <span className="text-emerald-600">Normal</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "22%" }} />
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block">Latency: 12ms (Good)</span>
        </div>

      </div>

      {/* Filter and search parameters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search health events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white transition-colors"
          />
        </div>

        {/* Severity selection toggles */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 w-full sm:w-auto self-start sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span>Severity:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-[11px] font-bold text-gray-800 outline-none cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warning Only</option>
            <option value="info">Info Only</option>
          </select>
        </div>

      </div>

      {/* System alerts grid table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-5 py-3">Alert Details</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {filtered.map(alert => {
              return (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-extrabold text-gray-900 leading-snug">{alert.alertName}</div>
                    <div className="text-[10px] text-gray-450 mt-0.5 leading-normal">{alert.description}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-900 text-[11px]">
                    {alert.value}
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-bold text-[10px]">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                      alert.severity === "critical"
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : alert.severity === "warning"
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      alert.acknowledged ? "text-emerald-600" : "text-amber-600 animate-pulse"
                    }`}>
                      {alert.acknowledged ? "Resolved" : "Active Alert"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 bg-white border border-gray-250 hover:bg-gray-50 text-[10px] font-bold text-gray-700 rounded-lg cursor-pointer transition-all shadow-2xs"
                      >
                        Acknowledge & Close
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold flex items-center justify-end gap-1 select-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Closed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-450 font-bold">
                  No system health alerts found matching the parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
