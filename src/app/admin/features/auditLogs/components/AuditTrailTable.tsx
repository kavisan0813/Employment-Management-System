/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, History, ArrowRight } from "lucide-react";
import { AuditTrail } from "../types/logs.types";

interface AuditTrailTableProps {
  trails: AuditTrail[];
  organizations: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function AuditTrailTable({
  trails, organizations, searchQuery, setSearchQuery, selectedOrg, 
  setSelectedOrg, dateRange, setDateRange, filterByDate,
}: AuditTrailTableProps) {
  
  const filtered = trails.filter((trail) => {
    const matchesSearch = trail.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trail.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trail.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trail.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (selectedOrg === "ALL" || trail.organization === selectedOrg) && filterByDate(trail.timestamp);
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none">
            <option value="ALL">All Orgs</option>
            {organizations.map(org => <option key={org} value={org}>{org}</option>)}
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none">
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Change Delta</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                filtered.map((trail) => (
                  <tr key={trail.id} className="hover:bg-gray-50/50">
                    <td className="p-4 text-xs font-mono text-gray-500 whitespace-nowrap">
                      {new Date(trail.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{trail.user}</div>
                      <div className="text-xs font-normal text-gray-500">{trail.organization}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                        <History className="w-3.5 h-3.5" /> {trail.action}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{trail.target}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 text-xs font-mono">
                        <span className="text-rose-700 line-through truncate max-w-[100px]">{trail.oldValue}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-emerald-700 font-semibold truncate max-w-[100px]">{trail.newValue}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-500">{trail.ipAddress}</td>
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