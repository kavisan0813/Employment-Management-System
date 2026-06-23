/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BarChart3, Mail, MessageSquare, Bell, ArrowUpRight } from "lucide-react";

export function DeliveryReportsView() {
  const emailReport = [
    { label: "Delivered", value: "99.4%", description: "Successful mail delivery", pct: 99.4, color: "bg-teal-500" },
    { label: "Open Rate", value: "68.2%", description: "Recipients who read the email", pct: 68.2, color: "bg-indigo-650" },
    { label: "Click-Through (CTR)", value: "28.4%", description: "Links clicked inside emails", pct: 28.4, color: "bg-sky-500" },
    { label: "Bounce Rate", value: "0.3%", description: "Hard or soft bounced mail addresses", pct: 0.3, color: "bg-rose-500" }
  ];

  const smsReport = [
    { label: "Delivered successfully", value: "97.2%", count: "4,268", pct: 97.2, color: "bg-teal-500" },
    { label: "Failed packet delivery", value: "2.8%", count: "124", pct: 2.8, color: "bg-rose-500" }
  ];

  const pushReport = [
    { label: "Viewed / Clicked", value: "45.1%", count: "11,686", pct: 45.1, color: "bg-indigo-600" },
    { label: "Dismissed / Ignored", value: "54.9%", count: "14,226", pct: 54.9, color: "bg-gray-400" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Email Delivery Statistics */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-indigo-500" /> Email Campaign Delivery & Engagement Reports
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emailReport.map(item => (
            <div key={item.label} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">{item.label}</span>
              <p className="text-2xl font-bold text-gray-900 font-mono flex items-baseline gap-1">
                {item.value}
                {item.label === "Click-Through (CTR)" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
              </p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-[9px] text-gray-400 font-semibold block">{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SMS Delivery Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-teal-600" /> SMS gateway dispatch verification
          </h4>
          <div className="space-y-4">
            {smsReport.map(item => (
              <div key={item.label} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-800">{item.label}</span>
                  <span className="text-gray-400 font-mono">{item.count} packets ({item.value})</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push notification view tracking */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-sky-500" /> Push alert engagement indexes
          </h4>
          <div className="space-y-4">
            {pushReport.map(item => (
              <div key={item.label} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-800">{item.label}</span>
                  <span className="text-gray-400 font-mono">{item.count} alerts ({item.value})</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
