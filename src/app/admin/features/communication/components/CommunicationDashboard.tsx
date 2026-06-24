/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, MessageSquare, Bell, Send, AlertTriangle, TrendingUp } from "lucide-react";

interface CommunicationDashboardProps {
  setActiveTab: (tab: any) => void;
}

export function CommunicationDashboard({ setActiveTab }: CommunicationDashboardProps) {
  // Enhanced metrics with specific color themes
  const metrics = [
    { label: "Total Emails", val: "15,240", sub: "Delivered: 99.4%", icon: Mail, bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-900", tab: "history" },
    { label: "Total SMS", val: "4,392", sub: "Delivered: 97.2%", icon: MessageSquare, bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-900", tab: "history" },
    { label: "Push", val: "25,912", sub: "Viewed: 45%", icon: Bell, bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-900", tab: "history" },
    { label: "Broadcasts", val: "12 Sent", sub: "Targeting 500+ Orgs", icon: Send, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900", tab: "broadcast" },
    { label: "Failed", val: "142 Packets", sub: "Bounce rate: 0.32%", icon: AlertTriangle, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-900", tab: "reports" }
  ];

  const emailStats = [{ label: "Sent", val: 15.0 }, { label: "Delivered", val: 14.8 }, { label: "Opened", val: 10.2 }, { label: "Clicked", val: 4.1 }];
  const smsStats = [
    { name: "Sent successfully", count: 4392, pct: 97.2, color: "bg-teal-500" },
    { name: "Failed delivery", count: 124, pct: 2.8, color: "bg-rose-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              onClick={() => setActiveTab(m.tab)}
              className={`${m.bg} ${m.border} border rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between h-32`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold uppercase tracking-wider ${m.text} opacity-70`}>{m.label}</span>
                <Icon className={`w-4 h-4 ${m.text}`} />
              </div>
              <div>
                <h4 className={`text-xl font-semibold ${m.text} tracking-tight`}>{m.val}</h4>
                <p className={`text-xs font-medium ${m.text} opacity-60 mt-1`}>{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email delivery funnel */}
        <div className="border border-indigo-100 rounded-2xl p-5 bg-indigo-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-indigo-900">Email Delivery Funnel</h4>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 98.6% Success
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-indigo-100">
             <div className="flex items-end justify-between px-2 pt-4 h-32">
                {emailStats.map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-2">
                        <div className="w-12 bg-indigo-100 rounded-t-lg relative" style={{ height: `${(s.val/16)*100}%` }}>
                            <div className="absolute inset-0 bg-indigo-500 rounded-t-lg opacity-80" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">{s.label}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* SMS logs */}
        <div className="border border-teal-100 rounded-2xl p-5 bg-teal-50/20 space-y-4">
          <h4 className="text-sm font-semibold text-teal-900">SMS Delivery Status</h4>
          <div className="space-y-4">
            {smsStats.map(stat => (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-medium text-teal-900">
                  <span>{stat.name}</span>
                  <span>{stat.count} ({stat.pct}%)</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border border-teal-100 overflow-hidden">
                  <div className={`h-full ${stat.color}`} style={{ width: `${stat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white border border-teal-100 rounded-xl text-xs text-teal-900 leading-relaxed font-medium">
            Carrier logs: Twilio gateway is ACTIVE. Queue latency is 820ms.
          </div>
        </div>
      </div>
    </div>
  );
}