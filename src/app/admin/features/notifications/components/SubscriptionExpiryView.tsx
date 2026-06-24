/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar, Mail, Search, AlertCircle } from "lucide-react";
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

  const getBadgeStyle = (days: number) => {
    if (days === 0) return "bg-rose-50 border-rose-100 text-rose-700";
    if (days <= 7) return "bg-orange-50 border-orange-100 text-orange-700";
    if (days <= 15) return "bg-amber-50 border-amber-100 text-amber-700";
    return "bg-indigo-50 border-indigo-100 text-indigo-700";
  };

  return (
    <div className="space-y-6 font-semibold">
      
      {/* SLA Schedule Banner with Gradient/Tint */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-600" /> Subscription Expiry SLA Schedule
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs text-gray-700">
          {[
            { d: "30 DAYS", t: "Friendly Notification", bg: "bg-white" },
            { d: "15 DAYS", t: "Renewal Reminder", bg: "bg-white" },
            { d: "7 DAYS", t: "Urgent Warning", bg: "bg-orange-50/50" },
            { d: "1 DAY", t: "Final Notice", bg: "bg-rose-50/50" },
            { d: "0 DAYS", t: "Access Freeze", bg: "bg-rose-100" }
          ].map((item, i) => (
            <div key={i} className={`${item.bg} border border-black/5 p-3 rounded-xl shadow-inner`}>
              <div className="text-[10px] text-gray-400 mb-1 font-medium">{item.d} BEFORE</div>
              {item.t}
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar with Tint */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenant by company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Tenancy table list with alternating color rows */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100/50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3">Client Organization</th>
              <th className="px-5 py-3">Expiry Date</th>
              <th className="px-5 py-3">Days Remaining</th>
              <th className="px-5 py-3">Threshold</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(alert => (
              <tr key={alert.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{alert.orgName}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">ID: {alert.id}</div>
                </td>
                <td className="px-5 py-4 font-mono text-gray-600">{alert.expiryDate}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getBadgeStyle(alert.daysLeft)}`}>
                    {alert.daysLeft === 0 ? "Expired" : `${alert.daysLeft} Days Left`}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-gray-500">
                  {alert.daysLeft <= 1 ? "Final Reminder" : alert.daysLeft <= 7 ? "Urgent Warning" : "Renewal Reminder"}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-semibold ${alert.status === "notified" ? "text-indigo-600" : alert.daysLeft === 0 ? "text-rose-600" : "text-gray-500"}`}>
                    {alert.status === "notified" ? "Reminder Sent" : alert.daysLeft === 0 ? "Platform Frozen" : "Unnotified"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {alert.daysLeft > 0 ? (
                    <button onClick={() => onSendReminder(alert.id)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold rounded-lg shadow-sm ml-auto">
                      <Mail className="w-3.5 h-3.5 inline mr-1" /> Dispatch
                    </button>
                  ) : (
                    <span className="text-[10px] text-rose-600 font-semibold flex items-center justify-end gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Suspended
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}