/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlertCircle, Calendar, Mail, CheckCircle2, Search } from "lucide-react";
import { SubscriptionExpiryAlert } from "../types/notifications.types";

interface Props {
  expiryAlerts: SubscriptionExpiryAlert[];
  onSendReminder: (id: string) => void;
}

export function SubscriptionExpiryView({ expiryAlerts, onSendReminder }: Props) {
  const [search, setSearch] = useState("");

  const filtered = expiryAlerts.filter(a => 
    a.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const getDaysLeftBadge = (days: number) => {
    if (days === 0) {
      return "bg-rose-50 border-rose-200 text-rose-700";
    }
    if (days <= 7) {
      return "bg-orange-50 border-orange-200 text-orange-700";
    }
    if (days <= 15) {
      return "bg-amber-50 border-amber-200 text-amber-700";
    }
    return "bg-indigo-50 border-indigo-200 text-indigo-700";
  };

  const getDaysLeftLabel = (days: number) => {
    if (days === 0) return "Expired";
    if (days === 1) return "1 Day Left";
    return `${days} Days Left`;
  };

  return (
    <div className="space-y-6">
      
      {/* Reminder schedule metadata banner */}
      <div className="bg-indigo-50/20 border border-indigo-100 rounded-2xl p-5 space-y-3.5">
        <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-650" />
          Subscription Expiry Reminder SLA Schedule
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-bold text-gray-700">
          <div className="bg-white border border-gray-150 p-3 rounded-xl">
            <div className="text-[10px] text-gray-400 block mb-1">30 DAYS BEFORE</div>
            Friendly Notification
          </div>
          <div className="bg-white border border-gray-150 p-3 rounded-xl">
            <div className="text-[10px] text-gray-400 block mb-1">15 DAYS BEFORE</div>
            Renewal Reminder
          </div>
          <div className="bg-white border border-gray-150 p-3 rounded-xl text-orange-700 border-orange-100">
            <div className="text-[10px] text-gray-450 block mb-1">7 DAYS BEFORE</div>
            Urgent Warning
          </div>
          <div className="bg-white border border-gray-150 p-3 rounded-xl text-rose-700 border-rose-100">
            <div className="text-[10px] text-rose-450 block mb-1">1 DAY BEFORE</div>
            Final Notice
          </div>
          <div className="bg-rose-50 border border-rose-150 p-3 rounded-xl text-rose-800">
            <div className="text-[10px] text-rose-600 block mb-1">EXPIRED (0 DAYS)</div>
            Access Freeze Enforced
          </div>
        </div>
      </div>

      {/* Search inputs bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenant by company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Tenancy table list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-5 py-3">Client Organization</th>
              <th className="px-5 py-3">Expiry Date</th>
              <th className="px-5 py-3">Days Remaining</th>
              <th className="px-5 py-3">Alert Threshold</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {filtered.map(alert => {
              return (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-gray-900 leading-snug">{alert.orgName}</div>
                    <div className="text-[10px] text-gray-450 mt-0.5 font-bold uppercase tracking-wider">Tenant ID: {alert.id}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-gray-600">
                    {alert.expiryDate}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-extrabold font-mono px-2 py-0.5 rounded border ${getDaysLeftBadge(alert.daysLeft)}`}>
                      {getDaysLeftLabel(alert.daysLeft)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-bold text-gray-500">
                      {alert.daysLeft <= 1 ? "Final Reminder" : alert.daysLeft <= 7 ? "Urgent Warning" : alert.daysLeft <= 15 ? "Renewal Reminder" : "Friendly Note"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-extrabold ${
                      alert.status === "notified" ? "text-indigo-650" : alert.daysLeft === 0 ? "text-rose-700 font-black" : "text-gray-500"
                    }`}>
                      {alert.status === "notified" ? "Reminder Sent" : alert.daysLeft === 0 ? "Platform Frozen" : "Unnotified"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {alert.daysLeft > 0 ? (
                      <button
                        onClick={() => onSendReminder(alert.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs ml-auto"
                      >
                        <Mail className="w-3.5 h-3.5" /> Dispatch Renewal Alert
                      </button>
                    ) : (
                      <span className="text-[10px] text-rose-600 font-black flex items-center justify-end gap-1 select-none">
                        <AlertCircle className="w-3.5 h-3.5" /> Suspended
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-450 font-bold">
                  No expiring tenant records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
