/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, ShieldAlert, Monitor, Info, Calendar, Clock, Laptop, X
} from "lucide-react";
import { LoginLog } from "../types/logs.types";

interface LoginLogsTableProps {
  logs: LoginLog[];
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

export function LoginLogsTable({
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
  filterByDate
}: LoginLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null);

  // Filter login logs based on search + selected filters
  const filtered = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesOrg = selectedOrg === "ALL" || log.organization === selectedOrg;
    const matchesStatus = selectedStatus === "ALL" || log.status === selectedStatus;
    const matchesDate = filterByDate(log.loginTime);

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
            placeholder="Search logins by user name, email address, or IP..."
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
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
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
          </select>

          {/* Date Range Filter */}
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

      {/* Grid List / Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Organization / Role</th>
                <th className="px-4 py-3">Login Time</th>
                <th className="px-4 py-3">Logout Time</th>
                <th className="px-4 py-3">IP & Device</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No login log records found.</td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900">{log.user}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{log.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-gray-800">{log.organization}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{log.role}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500">
                      {new Date(log.loginTime).toLocaleString().replace(",", "")}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500">
                      {log.logoutTime ? (
                        new Date(log.logoutTime).toLocaleString().replace(",", "")
                      ) : (
                        <span className="inline-flex items-center gap-1 text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.5 rounded text-[9px]">
                          Active Session
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[11px] text-gray-800">{log.ipAddress}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{log.device} &bull; {log.browser}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.status === "Success" 
                          ? "bg-teal-50 text-teal-700" 
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {log.status === "Success" ? "SUCCESS" : "FAILED"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border border-gray-250 bg-white hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer"
                      >
                        <Info className="w-3 h-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex justify-end z-[100] animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                  <Laptop className="w-4.5 h-4.5 text-indigo-500" />
                  Session Audit Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 hover:bg-gray-150 rounded-full text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* User Section */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {selectedLog.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{selectedLog.user}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedLog.email}</p>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Organization</span>
                    <p className="text-xs font-semibold text-gray-900">{selectedLog.organization}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Role / Access Level</span>
                    <p className="text-xs font-semibold text-gray-900">{selectedLog.role}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">IP Address</span>
                    <p className="text-xs font-semibold font-mono text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Authentication Result</span>
                    <div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        selectedLog.status === "Success" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {selectedLog.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Login Timestamp</span>
                      <p className="text-xs font-semibold text-gray-800">{new Date(selectedLog.loginTime).toString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Logout Timestamp</span>
                      <p className="text-xs font-semibold text-gray-800">
                        {selectedLog.logoutTime ? new Date(selectedLog.logoutTime).toString() : "Session Active (No logout registered)"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedLog.status === "Failed" && selectedLog.failureReason && (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 mt-4">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-rose-800">Security Exception</h5>
                      <p className="text-xs text-rose-700 mt-1">{selectedLog.failureReason}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t border-gray-100 font-mono text-[10px] text-gray-400">
                  <p className="text-indigo-400">// Client System Browser Fingerprint</p>
                  <p>device_os: "{selectedLog.device}"</p>
                  <p>user_agent: "{selectedLog.browser} WebKit"</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2 bg-gray-900 hover:bg-gray-850 text-white rounded-lg text-xs font-semibold cursor-pointer text-center"
            >
              Close Ledger Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
