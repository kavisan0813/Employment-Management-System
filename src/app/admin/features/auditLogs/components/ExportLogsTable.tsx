/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
  logs,
  organizations,
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  selectedStatus,
  setSelectedStatus,
  dateRange,
  setDateRange,
  filterByDate,
}: ExportLogsTableProps) {
  const triggerMockDownload = (log: ExportLog) => {
    // Simulate compilation and download
    alert(
      `Compiling download link...\nFile: ${log.module.replace(/\s+/g, "_")}_export.${log.format.toLowerCase()}\nRecords: ${log.recordsCount} rows\nStatus: Secure verified ledger token issued.`,
    );
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesOrg =
      selectedOrg === "ALL" || log.organization === selectedOrg;
    const matchesStatus =
      selectedStatus === "ALL" || log.status === selectedStatus;
    const matchesDate = filterByDate(log.timestamp);

    return matchesSearch && matchesOrg && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search export ledger by module, user email, IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Org Filter */}
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Organizations</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Processing">Processing</option>
          </select>

          {/* Date Filter */}
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

      {/* Exports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User / Org</th>
                <th className="px-4 py-3">Export Module</th>
                <th className="px-4 py-3">Row Count</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No export logs registered.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp)
                        .toLocaleString()
                        .replace(",", "")}
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {log.user}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {log.organization}
                      </div>
                    </td>

                    {/* Module */}
                    <td className="px-4 py-3.5 font-semibold text-gray-800">
                      {log.module}
                    </td>

                    {/* Record count */}
                    <td className="px-4 py-3.5 font-mono font-bold text-gray-750">
                      {log.recordsCount} rows
                    </td>

                    {/* Format */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          log.format === "PDF"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : log.format === "Excel"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : log.format === "CSV"
                                ? "bg-gray-50 text-gray-700 border border-gray-200"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        {log.format}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.status === "Success"
                            ? "bg-teal-50 text-teal-700"
                            : log.status === "Failed"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700 animate-pulse"
                        }`}
                      >
                        {log.status === "Success" && (
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        {log.status === "Failed" && (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {log.status === "Processing" && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {log.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {log.status === "Success" ? (
                        <button
                          onClick={() => triggerMockDownload(log)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-650 hover:text-indigo-850 hover:bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          <Download className="w-3 h-3" />
                          Download File
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed opacity-60"
                        >
                          <Download className="w-3 h-3" />
                          Unavailable
                        </button>
                      )}
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
