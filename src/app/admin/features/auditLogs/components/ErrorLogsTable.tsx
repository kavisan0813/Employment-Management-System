/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Copy, Terminal } from "lucide-react";
import { ErrorLog } from "../types/logs.types";

interface ErrorLogsTableProps {
  logs: ErrorLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (sev: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function ErrorLogsTable({
  logs, searchQuery, setSearchQuery, selectedSeverity, setSelectedSeverity,
  dateRange, setDateRange, filterByDate,
}: ErrorLogsTableProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedLogId(expandedLogId === id ? null : id);

  const copyErrorBlock = (log: ErrorLog, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
  };

  const filtered = logs.filter((log) => {
    const matchesSearch = log.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (selectedSeverity === "ALL" || log.severity === selectedSeverity) && filterByDate(log.timestamp);
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exceptions (code, message, path)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none">
            <option value="ALL">All Severities</option>
            {["Fatal", "Error", "Warning"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none">
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-gray-500">No exception logs registered.</div>
          ) : (
            filtered.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const severityClasses = log.severity === "Fatal" ? "bg-rose-50 text-rose-700 border-rose-100" : 
                                     log.severity === "Error" ? "bg-red-50 text-red-700 border-red-100" : 
                                     "bg-amber-50 text-amber-700 border-amber-100";

              return (
                <div key={log.id} className="transition-colors hover:bg-gray-50/50 text-sm">
                  <div onClick={() => toggleExpand(log.id)} className="p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-gray-400 w-32">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${severityClasses}`}>{log.severity}</span>
                      <span className="font-mono text-xs font-semibold text-rose-600">{log.errorCode}</span>
                      <span className="font-medium text-gray-800">{log.message}</span>
                    </div>
                    <button onClick={(e) => copyErrorBlock(log, e)} className="text-gray-400 hover:text-indigo-600 p-1">
                      <Copy className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-gray-50/50 border-t border-gray-100 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mt-2 mb-4">
                        <div><span className="block font-medium text-gray-400 uppercase">Org</span><span className="font-semibold text-gray-800">{log.organization || "Global"}</span></div>
                        <div><span className="block font-medium text-gray-400 uppercase">Actor</span><span className="font-semibold text-gray-800">{log.user}</span></div>
                        <div><span className="block font-medium text-gray-400 uppercase">Endpoint</span><span className="font-semibold text-gray-800 font-mono">{log.path}</span></div>
                        <div><span className="block font-medium text-gray-400 uppercase">Log ID</span><span className="font-semibold text-gray-800 font-mono">{log.id}</span></div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto">
                        <p className="text-indigo-400 mb-2 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5"/> Trace Dump</p>
                        {log.stackTrace}
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