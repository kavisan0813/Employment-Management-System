/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Users,
  AlertTriangle,
  ShieldAlert,
  Terminal,
  Globe,
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
  const activeSessionsList = loginLogs.filter(
    (l) => l.status === "Success" && l.logoutTime === null,
  );
  const activeAlerts = securityEvents.filter((s) => s.status !== "Resolved");
  const recentErrors = errorLogs.slice(0, 4);

  // Defining color themes for different sections
  const themes = {
    sessions: "bg-teal-50 border-teal-100",
    security: "bg-rose-50 border-rose-100",
    errors: "bg-amber-50 border-amber-100",
    primary: "bg-indigo-50 border-indigo-100",
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Logins",
            val: stats.totalLogins,
            icon: Users,
            bg: themes.primary,
          },
          {
            label: "Active Sessions",
            val: stats.activeSessions,
            icon: Globe,
            bg: themes.sessions,
          },
          {
            label: "Active Alerts",
            val: activeAlerts.length,
            icon: ShieldAlert,
            bg: themes.security,
          },
          {
            label: "Error Rate (24h)",
            val: stats.errorRateToday,
            icon: AlertTriangle,
            bg: themes.errors,
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className={`p-5 border ${kpi.bg} rounded-xl shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {kpi.label}
                </p>
                <Icon className="w-4 h-4 text-gray-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mt-2">
                {kpi.val}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Sessions */}
        <div
          className={`lg:col-span-2 border rounded-xl overflow-hidden shadow-sm`}
        >
          <div className="px-5 py-4 border-b border-teal-100 flex items-center justify-between font-semibold text-teal-900 text-sm">
            <span>Active Sessions Monitor</span>
            <span className="text-xs bg-teal-100 px-2 py-0.5 rounded-full">
              {activeSessionsList.length} Connected
            </span>
          </div>
          <div className="divide-y divide-teal-100 max-h-[300px] overflow-y-auto bg-white">
            {activeSessionsList.map((session) => (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold">
                    {session.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {session.user}
                    </p>
                    <p className="text-[10px] text-gray-500">{session.email}</p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-gray-500 font-mono">
                  {session.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Errors */}
        <div className="space-y-6">
          <div className={`border rounded-xl overflow-hidden shadow-sm`}>
            <div className="px-5 py-4 border-b border-rose-100 font-semibold text-rose-900 text-sm">
              Security Threat Feed
            </div>
            <div className="divide-y divide-rose-100 bg-white">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-4">
                  <p className="text-[10px] font-semibold uppercase text-rose-600">
                    {alert.severity}
                  </p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">
                    {alert.type}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`border ${themes.errors} rounded-xl overflow-hidden shadow-sm`}
          >
            <div className="px-5 py-4 border-b border-amber-100 font-semibold text-amber-900 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Recent Exceptions
            </div>
            <div className="divide-y divide-amber-100 bg-white">
              {recentErrors.map((err) => (
                <div key={err.id} className="p-4">
                  <p className="text-[10px] font-semibold text-amber-700 font-mono">
                    {err.errorCode}
                  </p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">
                    {err.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
