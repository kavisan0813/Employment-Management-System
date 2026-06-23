/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, MessageSquare, Bell, Send, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";

interface CommunicationDashboardProps {
  setActiveTab: (tab: any) => void;
}

export function CommunicationDashboard({ setActiveTab }: CommunicationDashboardProps) {
  // Metrics summary
  const metrics = [
    { label: "Total Emails Sent", val: "15,240", sub: "Delivered: 99.4% | Opened: 68%", icon: Mail, color: "bg-indigo-50 text-indigo-700 border-indigo-100", tab: "history" },
    { label: "Total SMS Sent", val: "4,392", sub: "Delivered: 97.2% | Failed: 2.8%", icon: MessageSquare, color: "bg-teal-50 text-teal-700 border-teal-100", tab: "history" },
    { label: "Push Notifications", val: "25,912", sub: "Viewed: 45% | Ignored: 55%", icon: Bell, color: "bg-sky-50 text-sky-700 border-sky-100", tab: "history" },
    { label: "Broadcast Campaigns", val: "12 Sent", sub: "Targeting 500+ Organizations", icon: Send, color: "bg-emerald-50 text-emerald-700 border-emerald-100", tab: "broadcast" },
    { label: "Failed Deliveries", val: "142 Packets", sub: "Queue bounce rate: 0.32%", icon: AlertTriangle, color: "bg-rose-50 text-rose-700 border-rose-100", tab: "reports" }
  ];

  // SVG parameters for Email statistics line chart
  // Data: Sent(15K), Delivered(14.8K), Opened(10.2K), Clicked(4.1K)
  const emailStats = [
    { label: "Sent", val: 15.0, color: "#6366f1" },
    { label: "Delivered", val: 14.8, color: "#10b981" },
    { label: "Opened", val: 10.2, color: "#0ea5e9" },
    { label: "Clicked", val: 4.1, color: "#f59e0b" }
  ];

  // SVG settings
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = emailStats.map((d, i) => {
    const x = paddingX + (i / (emailStats.length - 1)) * (width - 2 * paddingX);
    // scale 0 to 16
    const y = height - paddingY - (d.val / 16) * (height - 2 * paddingY);
    return { x, y, label: d.label, valStr: `${d.val}k` };
  });

  const linePath = points.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");

  // SMS splits
  const smsStats = [
    { name: "Sent successfully", count: 4392, pct: 97.2, color: "bg-teal-500" },
    { name: "Failed delivery", count: 124, pct: 2.8, color: "bg-rose-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              onClick={() => setActiveTab(m.tab)}
              className="bg-white border border-gray-200 hover:border-indigo-400 rounded-2xl p-5 shadow-xs transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{m.label}</span>
                <div className={`p-2 rounded-2xl border ${m.color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-950 tracking-tight">{m.val}</h4>
                <p className="text-[9px] text-gray-500 font-semibold mt-1">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email opens line plot */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Email Delivery funnel metrics</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 98.6% Success
            </span>
          </div>

          <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              {/* Guidelines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth={1.5} />

              <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2.5} strokeLinecap="round" />

              {points.map((p, i) => (
                <g key={i} className="group">
                  <circle cx={p.x} cy={p.y} r={4} fill="#4f46e5" stroke="#ffffff" strokeWidth={1.5} />
                  <text x={p.x} y={height - 2} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">{p.label}</text>
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#0f172a" fontSize={9} fontWeight="bold" fontFamily="monospace" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                    {p.valStr}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* SMS logs splits */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">SMS Delivery Status</h4>
          <div className="space-y-4">
            {smsStats.map(stat => (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{stat.name}</span>
                  <span className="font-semibold text-gray-400">{stat.count} packets ({stat.pct}%)</span>
                </div>
                <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color}`} style={{ width: `${stat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <hr className="border-gray-100 my-2" />
          
          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-[11px] text-indigo-850 leading-relaxed font-semibold">
            Carrier logs check: Twilio gateway connection is ACTIVE. Outbound queue latency is average 820ms.
          </div>
        </div>
      </div>
    </div>
  );
}
