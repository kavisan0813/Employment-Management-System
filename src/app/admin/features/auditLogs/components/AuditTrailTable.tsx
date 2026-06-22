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
  trails,
  organizations,
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  dateRange,
  setDateRange,
  filterByDate,
}: AuditTrailTableProps) {
  const filtered = trails.filter((trail) => {
    const matchesSearch =
      trail.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.target.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrg =
      selectedOrg === "ALL" || trail.organization === selectedOrg;
    const matchesDate = filterByDate(trail.timestamp);

    return matchesSearch && matchesOrg && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search data changes by actor, target, modification description..."
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

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor / Org</th>
                <th className="px-4 py-3">Mutation Description</th>
                <th className="px-4 py-3">Value Delta (Old &rarr; New)</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No data mutation audit entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((trail) => (
                  <tr
                    key={trail.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(trail.timestamp)
                        .toLocaleString()
                        .replace(",", "")}
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {trail.user}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {trail.organization}
                      </div>
                    </td>

                    {/* Target & Action */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-gray-800 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        {trail.action}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Target:{" "}
                        <span className="font-mono text-gray-600">
                          {trail.target}
                        </span>
                      </div>
                    </td>

                    {/* Delta comparison */}
                    <td className="px-4 py-3.5 min-w-[240px]">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 p-2 rounded-lg text-[11px] font-mono w-full">
                        <span
                          className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100 line-through truncate max-w-[120px]"
                          title={trail.oldValue}
                        >
                          {trail.oldValue}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span
                          className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100 font-bold truncate max-w-[120px]"
                          title={trail.newValue}
                        >
                          {trail.newValue}
                        </span>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {trail.ipAddress}
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
