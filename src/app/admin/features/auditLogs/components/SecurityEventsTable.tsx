/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
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
  dateRange,
  setDateRange,
  filterByDate,
  resolveSecurityEvent,
}: SecurityEventsTableProps) {
  const filtered = events.filter((evt) => {
    const matchesSearch =
      evt.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.ipAddress.includes(searchQuery);

    const matchesOrg =
      selectedOrg === "ALL" || evt.organization === selectedOrg;
    const matchesSeverity =
      selectedSeverity === "ALL" || evt.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "ALL" || evt.status === selectedStatus;
    const matchesDate = filterByDate(evt.detectedAt);

    return (
      matchesSearch &&
      matchesOrg &&
      matchesSeverity &&
      matchesStatus &&
      matchesDate
    );
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search security alerts by type, actor, IP, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg focus:outline-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>

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

          {/* Date Range */}
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

      {/* Grid of Security incidents */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-xs shadow-2xs">
            No security threat logs found.
          </div>
        ) : (
          filtered.map((evt) => {
            // Severity Styles
            const getSeverityClass = (sev: string) => {
              switch (sev) {
                case "Critical":
                  return "bg-rose-100 text-rose-700 border-rose-200";
                case "High":
                  return "bg-orange-100 text-orange-700 border-orange-200";
                case "Medium":
                  return "bg-amber-100 text-amber-700 border-amber-200";
                default:
                  return "bg-blue-100 text-blue-700 border-blue-200";
              }
            };

            // Status Styles
            const getStatusClass = (status: string) => {
              switch (status) {
                case "Resolved":
                  return "bg-teal-50 text-teal-700 border border-teal-200";
                case "Pending":
                  return "bg-amber-50 text-amber-700 border border-amber-200";
                default:
                  return "bg-rose-50 text-rose-700 border border-rose-200";
              }
            };

            return (
              <div
                key={evt.id}
                className={`bg-white border rounded-xl p-5 shadow-2xs transition-all hover:shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  evt.status !== "Resolved" && evt.severity === "Critical"
                    ? "border-rose-300 bg-rose-50/5"
                    : "border-gray-200"
                }`}
              >
                {/* Left Side: Incident telemetry */}
                <div className="flex gap-4 items-start">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      evt.status === "Resolved"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {evt.status === "Resolved" ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded ${getSeverityClass(evt.severity)}`}
                      >
                        {evt.severity} Severity
                      </span>
                      <span
                        className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded ${getStatusClass(evt.status)}`}
                      >
                        {evt.status}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(evt.detectedAt)
                          .toLocaleString()
                          .replace(",", "")}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 mt-1">
                      {evt.type}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                      {evt.details}
                    </p>

                    <div className="text-[10px] text-gray-400 font-mono pt-1">
                      Target Organization:{" "}
                      <strong className="text-gray-600">
                        {evt.organization || "Platform-wide"}
                      </strong>{" "}
                      &bull; Actor:{" "}
                      <strong className="text-gray-600">{evt.actor}</strong>{" "}
                      &bull; IP:{" "}
                      <strong className="text-gray-600">{evt.ipAddress}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Side: Resolution controls */}
                <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 justify-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:inline">
                    Action
                  </span>
                  <div className="flex items-center gap-2">
                    {evt.status !== "Resolved" ? (
                      <button
                        onClick={() => resolveSecurityEvent(evt.id, "Resolved")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Resolve Alert
                      </button>
                    ) : (
                      <button
                        onClick={() => resolveSecurityEvent(evt.id, "Active")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Re-open Alert
                      </button>
                    )}

                    {evt.status === "Active" && (
                      <button
                        onClick={() => resolveSecurityEvent(evt.id, "Pending")}
                        className="px-3 py-1.5 border border-amber-250 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
