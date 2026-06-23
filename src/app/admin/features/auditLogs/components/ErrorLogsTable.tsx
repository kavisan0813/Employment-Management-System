/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Terminal,
} from "lucide-react";
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
  logs,
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
  dateRange,
  setDateRange,
  filterByDate,
}: ErrorLogsTableProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const copyErrorBlock = (log: ErrorLog, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert("Error debug trace payload copied to clipboard.");
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.path.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "ALL" || log.severity === selectedSeverity;
    const matchesDate = filterByDate(log.timestamp);

    return matchesSearch && matchesSeverity && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search system exceptions by error code, error message, API path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Fatal">Fatal</option>
            <option value="Error">Error</option>
            <option value="Warning">Warning</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today (24h)</option>
            <option value="WEEK">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No exception logs registered.
            </div>
          ) : (
            filtered.map((log) => {
              const isExpanded = expandedLogId === log.id;

              // Get severity color
              const getSeverityBadge = (sev: string) => {
                switch (sev) {
                  case "Fatal":
                    return "bg-rose-100 text-rose-700 border-rose-200";
                  case "Error":
                    return "bg-red-50 text-red-700 border-red-150";
                  default:
                    return "bg-amber-50 text-amber-700 border-amber-150";
                }
              };

              return (
                <div
                  key={log.id}
                  className="transition-colors hover:bg-gray-50/20 text-xs"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Timestamp */}
                      <span className="font-mono text-gray-400 w-36 shrink-0">
                        {new Date(log.timestamp)
                          .toLocaleString()
                          .replace(",", "")}
                      </span>

                      {/* Severity badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase shrink-0 ${getSeverityBadge(log.severity)}`}
                      >
                        {log.severity}
                      </span>

                      {/* Error code & message */}
                      <div>
                        <span className="font-mono text-[11px] font-bold text-rose-600 mr-2">
                          {log.errorCode}
                        </span>
                        <span className="text-gray-900 font-bold leading-normal">
                          {log.message}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-gray-400">
                      <span className="font-mono text-[10px] text-gray-550 mr-2 max-w-xs truncate hidden md:block">
                        {log.path}
                      </span>
                      <button
                        onClick={(e) => copyErrorBlock(log, e)}
                        className="p-1 hover:bg-gray-150 rounded text-gray-500 cursor-pointer"
                        title="Copy direct trace dump"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Stack Trace details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-1 duration-100">
                      <div className="mt-2 space-y-4">
                        {/* Scope details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-gray-500 font-medium">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              Organization
                            </span>
                            <span className="text-gray-800 font-bold">
                              {log.organization || "Global System"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              Actor Context
                            </span>
                            <span className="text-gray-800 font-bold">
                              {log.user}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              API endpoint
                            </span>
                            <span className="text-gray-850 font-mono">
                              {log.path}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              Log Reference ID
                            </span>
                            <span className="text-gray-850 font-mono">
                              {log.id}
                            </span>
                          </div>
                        </div>

                        {/* Stack trace display */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-[11px] font-mono text-gray-300 relative overflow-x-auto">
                          <button
                            onClick={(e) => copyErrorBlock(log, e)}
                            className="absolute right-3 top-3 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded text-[9px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Payload
                          </button>

                          <p className="text-indigo-400 flex items-center gap-1.5 mb-2">
                            <Terminal className="w-3.5 h-3.5" />
                            // Interactive Runtime Trace Dump
                          </p>
                          <pre className="whitespace-pre-wrap leading-relaxed select-all selection:bg-indigo-650">
                            {log.stackTrace}
                          </pre>
                        </div>
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
