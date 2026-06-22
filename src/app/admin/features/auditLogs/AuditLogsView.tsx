/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { db } from "../../mockData";
import { AuditLogEntry } from "../../types";
import { 
  History, Search, ShieldCheck, Clipboard, Copy, 
  ChevronDown, ChevronUp, Download, Calendar, X 
} from "lucide-react";

export default function AuditLogsView() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const refreshData = () => {
    // Sort in reverse chronological order
    const list = db.auditLogs.get();
    const sorted = [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setLogs(sorted);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredLogs = logs.filter(log => {
    const text = searchQuery.toLowerCase();
    const matchesSearch = log.actor.toLowerCase().includes(text) || 
                          log.event.toLowerCase().includes(text) || 
                          (log.organization && log.organization.toLowerCase().includes(text)) ||
                          log.id.toLowerCase().includes(text);
    const matchesCategory = categoryFilter === "ALL" || log.eventCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleExpandLog = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const copyMetadataPayload = (log: AuditLogEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const jsonStr = JSON.stringify({
      id: log.id,
      timestamp: log.timestamp,
      actor: log.actor,
      actorType: log.actorType,
      event: log.event,
      eventCategory: log.eventCategory,
      organization: log.organization,
      result: log.result,
      metadata: log.metadata,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent
    }, null, 2);

    navigator.clipboard.writeText(jsonStr);
    alert("Audit log metadata payload copied to clipboard.");
  };

  const purgeAuditTrailWarn = () => {
    alert("Compliance Lock Active:\nFederally compliant SOC2 controls prevent administrative deletion or truncation of the active logging ledger.");
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-950 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Compliance Audit Ledger (SOC2)
          </h1>
          <p className="text-xs text-gray-400">View real-time event logs, security credential accesses, and configuration mutations globally.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={purgeAuditTrailWarn}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-250 text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Clear Audit Trail
          </button>
        </div>
      </div>

      {/* filtration */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Query logs by actor mail address, event slug, organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-lg text-xs focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50/50 p-1 rounded-lg border border-gray-150">
            <span className="text-[10px] pl-1 font-semibold text-gray-400">CATEGORY</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-gray-800 text-xs py-0.5 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Security">Security / Compliance</option>
              <option value="Billing">Billing Cycles</option>
              <option value="Admin Action">Admin Activities</option>
              <option value="Auth">Authentication</option>
              <option value="Data">Data Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chronological List of log assets */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-gray-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">No matching system audit records found.</div>
          ) : (
            filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="transition-colors hover:bg-gray-50/30 text-xs font-medium">
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpandLog(log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Timestamp */}
                      <span className="font-mono text-gray-400 w-36 shrink-0 leading-relaxed block sm:inline">
                        {new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 19)}
                      </span>

                      {/* Event Category Badges */}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                        log.eventCategory === "Security" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        log.eventCategory === "Billing" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        log.eventCategory === "Auth" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                        "bg-teal-50 text-teal-700 border border-teal-100"
                      }`}>
                        {log.eventCategory}
                      </span>

                      {/* Event and actor */}
                      <p className="text-gray-900 font-bold shrink-0">{log.event}</p>

                      <div className="text-gray-450 truncate max-w-xs block sm:inline">
                        by <strong className="text-gray-700 font-semibold">{log.actor}</strong>
                        {log.organization && (
                          <span> &bull; Org: <strong className="text-gray-750 font-semibold">{log.organization}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-semibold text-gray-400">
                      {/* Result badge */}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        log.result === "Active" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {log.result === "Active" ? "SUCCESS" : "FAILED"}
                      </span>
                      <button
                        onClick={(e) => copyMetadataPayload(log, e)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer"
                        title="Copy direct metadata"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Metadata layout */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-1 duration-100">
                      <div className="bg-gray-900 rounded-lg p-3.5 text-[11px] font-mono text-gray-300 mt-2 space-y-1 overflow-x-auto relative">
                        <button
                          onClick={(e) => copyMetadataPayload(log, e)}
                          className="absolute right-3 top-3 px-2 py-1 bg-gray-800 text-white rounded text-[10px] flex items-center gap-1 cursor-pointer border border-gray-750 hover:bg-gray-700"
                        >
                          <Clipboard className="w-3 h-3" /> Copy Block
                        </button>

                        <p className="text-indigo-400">// Immutable Audit Trail Transaction Event Payload</p>
                        <p><span className="text-gray-500">_id:</span> "{log.id}"</p>
                        <p><span className="text-gray-500">timestamp:</span> "{log.timestamp}"</p>
                        <p><span className="text-gray-500">event:</span> "{log.event}" &bull; <span className="text-gray-500">category:</span> "{log.eventCategory}"</p>
                        <p><span className="text-gray-500">actor:</span> "{log.actor}" (<span className="text-gray-500">type:</span> "{log.actorType}")</p>
                        <p><span className="text-gray-500">ip_address:</span> "{log.ipAddress}"</p>
                        <p><span className="text-gray-500">result:</span> "{log.result}"</p>
                        <p><span className="text-gray-500">parameters_grid:</span> {JSON.stringify(log.metadata || {}, null, 2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
