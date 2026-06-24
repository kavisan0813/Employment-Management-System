/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Clock, FileText, User } from "lucide-react";
import { ActivityLog } from "../types/logs.types";

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  organizations: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  selectedAction: string;
  setSelectedAction: (act: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function ActivityLogsTable({
  logs, organizations, searchQuery, setSearchQuery, selectedOrg, setSelectedOrg,
  selectedModule, setSelectedModule, selectedAction, setSelectedAction,
  dateRange, setDateRange, filterByDate,
}: ActivityLogsTableProps) {
  const modules = Array.from(new Set(logs.map((l) => l.module)));
  const actions = Array.from(new Set(logs.map((l) => l.action)));

  const filtered = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && 
           (selectedOrg === "ALL" || log.organization === selectedOrg) && 
           (selectedModule === "ALL" || log.module === selectedModule) && 
           (selectedAction === "ALL" || log.action === selectedAction) && 
           filterByDate(log.timestamp);
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "Create": return "bg-teal-50 text-teal-700 border-teal-200";
      case "Update": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Delete": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Approve": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity by user, details, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { v: selectedOrg, s: setSelectedOrg, opts: [["ALL", "All Orgs"], ...organizations.map(o => [o, o])] },
            { v: selectedModule, s: setSelectedModule, opts: [["ALL", "All Modules"], ...modules.map(m => [m, m])] },
            { v: selectedAction, s: setSelectedAction, opts: [["ALL", "All Actions"], ...actions.map(a => [a, a])] },
            { v: dateRange, s: setDateRange, opts: [["ALL", "All Time"], ["TODAY", "Today"], ["WEEK", "Last 7 Days"]] }
          ].map((f, i) => (
            <select key={i} value={f.v} onChange={(e) => f.s(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400">
              {f.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-gray-500">No activity log entries found.</div>
        ) : (
          <div className="relative border-l border-gray-200 ml-2 space-y-8">
            {filtered.map((log) => (
              <div key={log.id} className="relative pl-6 group">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />

                <div className="flex items-center gap-3 mb-2 text-xs font-medium">
                  <span className="text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold uppercase ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    <FileText className="w-3 h-3" /> {log.module}
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-800">{log.details}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold text-gray-700">{log.user}</span>
                    <span>({log.role}) &bull; {log.organization}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}