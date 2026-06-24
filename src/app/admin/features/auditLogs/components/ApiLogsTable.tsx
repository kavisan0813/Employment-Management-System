import React, { useState } from "react";
import { Search, Network, X, Calendar, Activity, Info, Server } from "lucide-react";
import { ApiLog } from "../types/logs.types";

interface ApiLogsTableProps {
  logs: ApiLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function ApiLogsTable({
  logs,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  filterByDate,
}: ApiLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.apiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = selectedMethod === "ALL" || log.method === selectedMethod;
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "Success" && log.statusCode >= 200 && log.statusCode < 300) ||
      (selectedStatus === "Error" && log.statusCode >= 400);

    return matchesSearch && matchesMethod && matchesStatus && filterByDate(log.date);
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-blue-700 bg-blue-50";
      case "POST":
        return "text-teal-700 bg-teal-50";
      case "PUT":
        return "text-amber-700 bg-amber-50";
      case "DELETE":
        return "text-rose-700 bg-rose-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return "text-teal-700 bg-teal-50";
    if (code >= 400 && code < 500) return "text-amber-700 bg-amber-50";
    if (code >= 500) return "text-rose-700 bg-rose-50";
    return "text-gray-700 bg-gray-50";
  };

  const closeModal = () => setSelectedLog(null);

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search APIs by name, endpoint, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400"
          >
            <option value="ALL">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Success">Success (2xx)</option>
            <option value="Error">Error (4xx/5xx)</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              <th className="px-5 py-4">API Name / Endpoint</th>
              <th className="px-5 py-4">Method / Status</th>
              <th className="px-5 py-4">Response Time</th>
              <th className="px-5 py-4">User Client</th>
              <th className="px-5 py-4">Timestamp</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            {filtered.map((log) => (
              <tr 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div className="text-gray-900 font-semibold">{log.apiName}</div>
                  <div className="text-xs font-normal text-gray-500 font-mono mt-0.5">{log.endpoint}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(log.statusCode)}`}>
                      {log.statusCode}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs ${log.responseTimeMs > 1000 ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                    {log.responseTimeMs} ms
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700">{log.user}</td>
                <td className="px-5 py-4 font-mono text-xs">{new Date(log.date).toLocaleString()}</td>
                <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500 text-sm">
                  No API logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ====================== CENTERED MODAL ====================== */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">API Trace Details</h3>
              </div>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Main Info Card */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wider ${getMethodColor(selectedLog.method)}`}>
                    {selectedLog.method}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(selectedLog.statusCode)}`}>
                    {selectedLog.statusCode}
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900">{selectedLog.apiName}</p>
                <p className="text-sm text-gray-500 font-mono break-all">{selectedLog.endpoint}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Response Time</span>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Activity className="w-5 h-5 text-gray-400" />
                    {selectedLog.responseTimeMs} ms
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Client / User</span>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Server className="w-5 h-5 text-gray-400" />
                    {selectedLog.user}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {selectedLog.errorMessage && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="block font-medium text-rose-500 uppercase text-xs mb-2">Error Detail</span>
                  <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-sm font-mono">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-500">Timestamp</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(selectedLog.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}