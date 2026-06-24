/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ExportLog } from "../types/logs.types";

interface ExportLogsTableProps {
  logs: ExportLog[];
  organizations: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function ExportLogsTable({
  logs, organizations, searchQuery, setSearchQuery, selectedOrg, setSelectedOrg,
  selectedStatus, setSelectedStatus, dateRange, setDateRange, filterByDate,
}: ExportLogsTableProps) {
  
  const filtered = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.module.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.ipAddress.includes(searchQuery);
    return matchesSearch && (selectedOrg === "ALL" || log.organization === selectedOrg) && 
           (selectedStatus === "ALL" || log.status === selectedStatus) && filterByDate(log.timestamp);
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search export ledger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { v: selectedOrg, s: setSelectedOrg, opts: [["ALL", "All Orgs"], ...organizations.map(o => [o, o])] },
            { v: selectedStatus, s: setSelectedStatus, opts: [["ALL", "All Statuses"], ["Success", "Success"], ["Failed", "Failed"], ["Processing", "Processing"]] },
            { v: dateRange, s: setDateRange, opts: [["ALL", "All Time"], ["TODAY", "Today"], ["WEEK", "Last 7 Days"]] }
          ].map((f, i) => (
            <select key={i} value={f.v} onChange={(e) => f.s(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400">
              {f.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User / Org</th>
                <th className="p-4">Module</th>
                <th className="p-4 text-center">Format</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-gray-500">No export logs found.</td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{log.user}</div>
                      <div className="text-xs text-gray-500 font-normal">{log.organization}</div>
                    </td>
                    <td className="p-4">{log.module}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                        log.format === "PDF" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        log.format === "Excel" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>{log.format}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
                        log.status === "Success" ? "text-teal-700" : 
                        log.status === "Failed" ? "text-rose-700" : "text-amber-700"
                      }`}>
                        {log.status === "Success" && <CheckCircle className="w-3.5 h-3.5" />}
                        {log.status === "Failed" && <XCircle className="w-3.5 h-3.5" />}
                        {log.status === "Processing" && <AlertCircle className="w-3.5 h-3.5" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        disabled={log.status !== "Success"}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" /> {log.status === "Success" ? "Download" : "N/A"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}