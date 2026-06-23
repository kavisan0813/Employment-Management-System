/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  Download,
  CheckCircle,
  Globe,
  Terminal,
  ShieldAlert as AlertIcon,
} from "lucide-react";
import {
  LoginLog,
  SecurityEventLog,
  ErrorLog,
  LogsStats,
} from "../types/logs.types";

interface LogsDashboardProps {
  stats: LogsStats;
  loginLogs: LoginLog[];
  securityEvents: SecurityEventLog[];
  errorLogs: ErrorLog[];
}

export function LogsDashboard({
  stats,
  loginLogs,
  securityEvents,
  errorLogs,
}: LogsDashboardProps) {
  // Get active sessions
  const activeSessionsList = loginLogs.filter(
    (l) => l.status === "Success" && l.logoutTime === null,
  );

  // Get active alerts
  const activeAlerts = securityEvents.filter((s) => s.status !== "Resolved");

  // Get recent errors
  const recentErrors = errorLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logins */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden transition-all duration-200 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Logins
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">
                {stats.totalLogins}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700 font-semibold">
              {stats.loginSuccessRate}% success rate
            </span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden transition-all duration-200 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Sessions
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">
                {stats.activeSessions}
              </h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl relative">
              <Globe className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full animate-ping" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
            <span>Real-time connected consoles</span>
          </div>
        </div>

        {/* Security Incidents */}
        <div
          className={`rounded-xl border p-5 shadow-2xs transition-all duration-200 hover:shadow-xs ${
            stats.criticalSecurityEvents > 0
              ? "bg-rose-50/30 border-rose-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Alerts
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${
                  stats.criticalSecurityEvents > 0
                    ? "text-rose-600 animate-pulse"
                    : "text-gray-950"
                }`}
              >
                {activeAlerts.length}
              </h3>
            </div>
            <div
              className={`p-3 rounded-xl ${
                stats.criticalSecurityEvents > 0
                  ? "bg-rose-100 text-rose-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span
              className={
                stats.criticalSecurityEvents > 0
                  ? "text-rose-700 font-bold"
                  : "text-gray-500"
              }
            >
              {stats.criticalSecurityEvents} unresolved critical events
            </span>
          </div>
        </div>

        {/* System Error Logs */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden transition-all duration-200 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Error Rate (24h)
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">
                {stats.errorRateToday}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
            <span>Total logged system exceptions</span>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Active Sessions & Telemetry graphs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sessions Monitor */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                Active Sessions Monitor
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700">
                {activeSessionsList.length} Connected
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {activeSessionsList.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No active user sessions found.
                </div>
              ) : (
                activeSessionsList.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {session.user.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">
                          {session.user}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {session.email} &bull; {session.organization}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-gray-500">
                        {session.ipAddress}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {session.device} &bull; {session.browser}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Event Telemetry Graph Simulation */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              Event Volume Timeline (Hourly)
            </h3>
            <div className="h-48 flex items-end justify-between gap-1 pt-6 px-2">
              {[
                35, 48, 62, 51, 80, 95, 70, 60, 45, 90, 110, 85, 75, 98, 120,
                115, 80, 92, 110, 125, 140, 105, 90, 95,
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                >
                  <div
                    className="w-full bg-indigo-100 hover:bg-indigo-500 rounded-t transition-all duration-200"
                    style={{ height: `${(val / 150) * 100}%` }}
                  />
                  <span className="text-[8px] text-gray-400 mt-2 scale-90 sm:scale-100 hidden sm:block">
                    {idx % 4 === 0 ? `${idx}:00` : ""}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-gray-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
                    {idx}:00 - {val} events
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Security alerts and system health */}
        <div className="space-y-6">
          {/* Security Alert Feed */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <AlertIcon className="w-4 h-4 text-rose-500" />
                Security Threat Feed
              </h3>
              {activeAlerts.length > 0 && (
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {activeAlerts.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  No active security concerns detected.
                </div>
              ) : (
                activeAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 space-y-2 hover:bg-rose-50/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          alert.severity === "Critical"
                            ? "bg-rose-100 text-rose-700"
                            : alert.severity === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(alert.detectedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {alert.type}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {alert.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Error Stack Monitor */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                Recent System Exceptions
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentErrors.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  Zero error logs registered.
                </div>
              ) : (
                recentErrors.map((err) => (
                  <div
                    key={err.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-rose-600">
                        {err.errorCode}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(err.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-1 truncate">
                      {err.message}
                    </p>
                    <p className="text-[9px] font-mono text-gray-400 mt-0.5 truncate">
                      {err.path}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
