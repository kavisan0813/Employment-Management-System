/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, ShieldAlert, CheckCircle2, Lock, Unlock, Search, Globe } from "lucide-react";
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
    <div className="space-y-6">
      
      {/* Search Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email or alert threat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Security Alerts List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-5 py-3">Security Event</th>
              <th className="px-5 py-3">Account Email</th>
              <th className="px-5 py-3">Location Network</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Event Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {filtered.map(alert => {
              return (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-extrabold text-gray-905 leading-snug">{alert.reason}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Alert ID: {alert.id}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-gray-900 text-[11px]">
                    {alert.userEmail}
                  </td>
                  <td className="px-5 py-4 flex items-center gap-1 mt-4">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{alert.location}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                      alert.severity === "critical"
                        ? "bg-rose-50 border-rose-200 text-rose-700 font-black animate-pulse"
                        : alert.severity === "high"
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : alert.severity === "medium"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-extrabold uppercase ${
                      alert.actionTaken === "locked" 
                        ? "text-rose-700" 
                        : alert.actionTaken === "warned" 
                        ? "text-indigo-650" 
                        : "text-amber-600 font-bold"
                    }`}>
                      {alert.actionTaken === "locked" 
                        ? "Account Locked" 
                        : alert.actionTaken === "warned" 
                        ? "User Warned" 
                        : "Requires Review"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {alert.actionTaken === "none" ? (
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => onSecurityAction(alert.id, "warned")}
                          className="px-2.5 py-1.5 bg-white border border-gray-250 hover:bg-gray-50 text-[10px] font-bold text-gray-700 rounded-lg cursor-pointer"
                        >
                          Dispatch Warning
                        </button>
                        <button
                          onClick={() => onSecurityAction(alert.id, "locked")}
                          className="px-2.5 py-1.5 bg-rose-650 hover:bg-rose-750 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs border-none"
                        >
                          <Lock className="w-3.5 h-3.5" /> Lock Account
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold flex items-center justify-end gap-1 select-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Action Taken
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-455 font-bold">
                  No security breach records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cyber policy reminder */}
      <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl text-[10px] text-rose-900 leading-relaxed font-semibold flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <strong>Brute Force & Geo-Location Alerts Policy:</strong> Restricting accounts blocks logins immediately. Locked users must contact support or complete MFA validation resets to recover workspace sessions.
        </div>
      </div>

    </div>
  );
}
