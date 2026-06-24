/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Download, CheckCircle, XCircle, AlertCircle, X, Calendar } from "lucide-react";
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
  
  const [selectedLog, setSelectedLog] = useState<ExportLog | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.module.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.ipAddress.includes(searchQuery);
    return matchesSearch && (selectedOrg === "ALL" || log.organization === selectedOrg) && 
           (selectedStatus === "ALL" || log.status === selectedStatus) && filterByDate(log.timestamp);
  });

  const handleDownload = (log: ExportLog) => {
    if (log.status !== "Success") return;

    const fileName = `${log.module}_export_${new Date(log.timestamp).toISOString().slice(0,10)}.${log.format.toLowerCase()}`;
    
    // Simulate realistic download
    alert(`✅ Downloading: ${fileName}`);
    
    // Real implementation would be:
    // const link = document.createElement("a");
    // link.href = `/api/exports/download/${log.id}`;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const closeModal = () => setSelectedLog(null);

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
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
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
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        disabled={log.status !== "Success"}
                        onClick={() => handleDownload(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================== CENTERED MODAL ====================== */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Export Details</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{selectedLog.user}</p>
                    <p className="text-gray-500 mt-1">{selectedLog.organization}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedLog.status === "Success" ? "bg-teal-100 text-teal-700" : 
                    selectedLog.status === "Failed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Module</p>
                  <p className="font-semibold text-lg mt-1">{selectedLog.module}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Format</p>
                  <p className="font-semibold text-lg mt-1">{selectedLog.format}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs uppercase tracking-wider text-gray-500">Export Time</p>
                <p className="font-semibold mt-1">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>

              {selectedLog.ipAddress && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">IP Address</p>
                  <p className="font-mono mt-1">{selectedLog.ipAddress}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-2xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedLog)}
                disabled={selectedLog.status !== "Success"}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}