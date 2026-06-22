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
  logs,
  organizations,
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  selectedModule,
  setSelectedModule,
  selectedAction,
  setSelectedAction,
  dateRange,
  setDateRange,
  filterByDate
}: ActivityLogsTableProps) {
  
  // Extract all unique modules
  const modules = Array.from(new Set(logs.map(l => l.module)));
  // Extract all unique actions
  const actions = Array.from(new Set(logs.map(l => l.action)));

  const filtered = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrg = selectedOrg === "ALL" || log.organization === selectedOrg;
    const matchesModule = selectedModule === "ALL" || log.module === selectedModule;
    const matchesAction = selectedAction === "ALL" || log.action === selectedAction;
    const matchesDate = filterByDate(log.timestamp);

    return matchesSearch && matchesOrg && matchesModule && matchesAction && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search operations by user name, details, email..."
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

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Modules</option>
            {modules.map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Actions</option>
            {actions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
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

      {/* Timeline Layout */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">No activity log entries found.</div>
        ) : (
          <div className="relative border-l border-gray-200 ml-4 space-y-6 py-2">
            {filtered.map(log => {
              // Action color mappings
              const getActionColor = (action: string) => {
                switch(action) {
                  case "Create": return "bg-teal-50 text-teal-700 border-teal-200";
                  case "Update": return "bg-indigo-50 text-indigo-700 border-indigo-200";
                  case "Delete": return "bg-rose-50 text-rose-700 border-rose-200";
                  case "Approve": return "bg-emerald-50 text-emerald-700 border-emerald-200";
                  case "Reject": return "bg-amber-50 text-amber-700 border-amber-200";
                  case "Export": return "bg-purple-50 text-purple-700 border-purple-200";
                  default: return "bg-gray-50 text-gray-700 border-gray-200";
                }
              };

              return (
                <div key={log.id} className="relative pl-6 group">
                  {/* Timeline indicator node */}
                  <div className="absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 group-hover:scale-125 transition-transform" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Timestamp */}
                      <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString().replace(",", "")}
                      </span>

                      {/* Action Badges */}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold uppercase shrink-0 ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>

                      {/* Module Badge */}
                      <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100/60 px-1.5 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                        <FileText className="w-2.5 h-2.5" />
                        {log.module}
                      </span>
                    </div>

                    {/* Actor label */}
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      by <strong className="text-gray-800 font-semibold">{log.user}</strong> ({log.role})
                    </div>
                  </div>

                  {/* Operation details */}
                  <div className="mt-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-150 p-3 rounded-lg text-xs text-gray-800 transition-colors">
                    <p className="font-medium">{log.details}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      Scope: {log.organization} &bull; ID: {log.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
