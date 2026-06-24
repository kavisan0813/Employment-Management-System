import React, { useState } from "react";
import { Search, Info, X, Laptop, Calendar, Clock, ShieldAlert } from "lucide-react";
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
  logs, organizations, searchQuery, setSearchQuery, selectedOrg, 
  setSelectedOrg, selectedStatus, setSelectedStatus, dateRange, 
  setDateRange, filterByDate,
}: LoginLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.ipAddress.includes(searchQuery);
    return matchesSearch && (selectedOrg === "ALL" || log.organization === selectedOrg) && 
           (selectedStatus === "ALL" || log.status === selectedStatus) && filterByDate(log.loginTime);
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logins by user, email, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { v: selectedOrg, s: setSelectedOrg, opts: [["ALL", "All Orgs"], ...organizations.map(o => [o, o])] },
            { v: selectedStatus, s: setSelectedStatus, opts: [["ALL", "All Statuses"], ["Success", "Success"], ["Failed", "Failed"]] },
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Org / Role</th>
              <th className="px-5 py-4">Login Time</th>
              <th className="px-5 py-4">Logout Time</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="text-gray-900 font-semibold">{log.user}</div>
                  <div className="text-xs font-normal text-gray-500">{log.email}</div>
                </td>
                <td className="px-5 py-4">
                  <div>{log.organization}</div>
                  <div className="text-xs font-normal text-gray-500">{log.role}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs">{new Date(log.loginTime).toLocaleString()}</td>
                <td className="px-5 py-4 font-mono text-xs">
                  {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs">Active</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${log.status === "Success" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"}`}>
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => setSelectedLog(log)} className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer Overlay */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-950/20 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-500" /> Session Audit
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="mt-6 space-y-6 flex-1">
              <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                <p className="text-sm font-semibold text-gray-900">{selectedLog.user}</p>
                <p className="text-xs text-gray-500 font-medium">{selectedLog.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="block font-medium text-gray-500 uppercase">Org</span><span className="font-semibold">{selectedLog.organization}</span></div>
                <div><span className="block font-medium text-gray-500 uppercase">Role</span><span className="font-semibold">{selectedLog.role}</span></div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div><p className="font-medium text-gray-500">Login</p><p className="font-semibold">{new Date(selectedLog.loginTime).toString()}</p></div>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedLog(null)} className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}