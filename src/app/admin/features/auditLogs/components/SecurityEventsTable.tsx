/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import { SecurityEventLog } from "../types/logs.types";

interface SecurityEventsTableProps {
  events: SecurityEventLog[];
  organizations: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (sev: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
  resolveSecurityEvent: (
    id: string,
    status: "Resolved" | "Pending" | "Active",
  ) => void;
}

export function SecurityEventsTable({
  events,
  organizations,
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  selectedSeverity,
  setSelectedSeverity,
  selectedStatus,
  setSelectedStatus,
  filterByDate,
  resolveSecurityEvent,
}: SecurityEventsTableProps) {
  const filtered = events.filter((evt) => {
    const matchesSearch =
      evt.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesSearch &&
      (selectedOrg === "ALL" || evt.organization === selectedOrg) &&
      (selectedSeverity === "ALL" || evt.severity === selectedSeverity) &&
      (selectedStatus === "ALL" || evt.status === selectedStatus) &&
      filterByDate(evt.detectedAt)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search security alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              v: selectedSeverity,
              s: setSelectedSeverity,
              opts: [
                ["ALL", "All Severities"],
                ["Critical", "Critical"],
                ["High", "High"],
                ["Medium", "Medium"],
                ["Low", "Low"],
              ],
            },
            {
              v: selectedStatus,
              s: setSelectedStatus,
              opts: [
                ["ALL", "All Statuses"],
                ["Active", "Active"],
                ["Pending", "Pending"],
                ["Resolved", "Resolved"],
              ],
            },
            {
              v: selectedOrg,
              s: setSelectedOrg,
              opts: [["ALL", "All Orgs"], ...organizations.map((o) => [o, o])],
            },
          ].map((f, i) => (
            <select
              key={i}
              value={f.v}
              onChange={(e) => f.s(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none"
            >
              {f.opts.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Security Events List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm font-medium text-gray-500 shadow-sm">
            No security threat logs found.
          </div>
        ) : (
          filtered.map((evt) => {
            const isResolved = evt.status === "Resolved";
            return (
              <div
                key={evt.id}
                className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${evt.severity === "Critical" && !isResolved ? "border-rose-200" : "border-gray-200"}`}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className={`p-3 rounded-xl ${isResolved ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {isResolved ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          evt.severity === "Critical"
                            ? "bg-rose-50 text-rose-700"
                            : evt.severity === "High"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {evt.severity}
                      </span>
                      <span className="text-xs font-medium text-gray-400 font-mono">
                        {new Date(evt.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {evt.type}
                    </h4>
                    <p className="text-xs font-medium text-gray-600">
                      {evt.details}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 pt-1">
                      Actor: {evt.actor} • IP: {evt.ipAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isResolved ? (
                    <button
                      onClick={() => resolveSecurityEvent(evt.id, "Resolved")}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Resolve Alert
                    </button>
                  ) : (
                    <button
                      onClick={() => resolveSecurityEvent(evt.id, "Active")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-open
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
