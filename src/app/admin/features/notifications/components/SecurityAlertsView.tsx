/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, ShieldAlert, CheckCircle2, Lock, Search, Globe, AlertCircle } from "lucide-react";
import { SecurityAlert } from "../types/notifications.types";

interface Props {
  securityAlerts: SecurityAlert[];
  onSecurityAction: (id: string, action: "warned" | "locked") => void;
}

export function SecurityAlertsView({ securityAlerts, onSecurityAction }: Props) {
  const [search, setSearch] = useState("");

  const filtered = securityAlerts.filter(a => 
    a.userEmail.toLowerCase().includes(search.toLowerCase()) || 
    a.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Search Filter */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email or alert threat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Security Alerts List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-800 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3">Security Event</th>
              <th className="px-5 py-3">Account Email</th>
              <th className="px-5 py-3">Location Network</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Event Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(alert => (
              <tr key={alert.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{alert.reason}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-medium">Alert ID: {alert.id}</div>
                </td>
                <td className="px-5 py-4 font-mono text-gray-900">{alert.userEmail}</td>
                <td className="px-5 py-4 flex items-center gap-1.5 mt-2">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{alert.location}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded border ${
                    alert.severity === "critical" ? "bg-rose-50 border-rose-100 text-rose-700" : 
                    alert.severity === "high" ? "bg-orange-50 border-orange-100 text-orange-700" : 
                    "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-semibold uppercase ${
                    alert.actionTaken === "locked" ? "text-rose-700" : 
                    alert.actionTaken === "warned" ? "text-indigo-600" : "text-amber-600"
                  }`}>
                    {alert.actionTaken === "locked" ? "Account Locked" : alert.actionTaken === "warned" ? "User Warned" : "Requires Review"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {alert.actionTaken === "none" ? (
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => onSecurityAction(alert.id, "warned")} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg shadow-sm transition-all">
                        Warn User
                      </button>
                      <button onClick={() => onSecurityAction(alert.id, "locked")} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold rounded-lg shadow-sm transition-all">
                        Lock Account
                      </button>
                    </div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No security breach records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cyber Policy Reminder */}
      <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl text-xs text-rose-900 leading-relaxed font-medium flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <strong>Brute Force & Geo-Location Policy:</strong> Restricting accounts blocks logins immediately. Locked users must contact support or complete MFA validation resets to recover workspace sessions.
        </div>
      </div>
    </div>
  );
}