/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CreditCard, Wallet, Receipt, DollarSign, TrendingUp } from "lucide-react";

export function RevenueReportsView() {
  // Revenue Summary metrics
  const mrr = "₹10,00,000";
  const arr = "₹1,20,00,000";
  const totalRevenue = "₹5,00,000";

  // Plan revenue breakdown
  const planRevenue = [
    { planName: "Basic Plan", revenue: "₹2,00,000", pct: 20, color: "bg-sky-500" },
    { planName: "Professional Plan", revenue: "₹4,00,000", pct: 40, color: "bg-indigo-600" },
    { planName: "Enterprise Plan", revenue: "₹4,00,000", pct: 40, color: "bg-emerald-500" }
  ];

  // Country revenue
  const countryRevenue = [
    { country: "India", revenue: "₹8,00,000", pct: 80 },
    { country: "United Arab Emirates", revenue: "₹1,00,000", pct: 10 },
    { country: "Singapore", revenue: "₹1,00,000", pct: 10 }
  ];

  // Outstanding/Overdue invoices list
  const outstandingInvoices = [
    { org: "Nova Media Ltd", status: "Overdue", amount: "₹68,000", days: 22 },
    { org: "Umbrella Biotech", status: "Pending", amount: "₹2,80,000", days: 5 },
    { org: "Apex Global", status: "Pending", amount: "₹96,000", days: 2 }
  ];

  // Refunds summary
  const refundAmt = "₹35,000";
  const refundCount = 3;

  // SVG parameters for revenue trends
  // Coordinates (x, y) mapping for: Jan(5L), Feb(6L), Mar(7L), Apr(8L), May(9L), Jun(10L)
  const trendsData = [
    { label: "Jan", amt: 5 },
    { label: "Feb", amt: 6 },
    { label: "Mar", amt: 7 },
    { label: "Apr", amt: 8 },
    { label: "May", amt: 9 },
    { label: "Jun", amt: 10 }
  ];

  // SVG dimensions
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = trendsData.map((d, i) => {
    const x = paddingX + (i / (trendsData.length - 1)) * (width - 2 * paddingX);
    // scale 5 to 10
    const y = height - paddingY - ((d.amt - 5) / 5) * (height - 2 * paddingY);
    return { x, y, label: d.label, amtStr: `₹${d.amt}L` };
  });

  const linePath = points.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");

  return (
    <div className="space-y-6">
      {/* Revenue core boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <Wallet className="w-4 h-4 text-indigo-500" /> Monthly Recurring Revenue
          </div>
          <p className="text-2xl font-black text-gray-950">{mrr}</p>
          <span className="text-[10px] text-gray-500 font-semibold">Active MRR Core Baseline</span>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Annual Recurring Revenue
          </div>
          <p className="text-2xl font-black text-gray-950">{arr}</p>
          <span className="text-[10px] text-gray-500 font-semibold">Projected ARR: MRR * 12</span>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <Receipt className="w-4 h-4 text-sky-500" /> Outstanding Ledgers
          </div>
          <p className="text-2xl font-black text-gray-950">₹4,44,000</p>
          <span className="text-[10px] text-gray-500 font-semibold">3 Pending/Overdue Invoices</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth line chart */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Revenue Trend (Jan - Jun)</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +100%
            </span>
          </div>

          <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              {/* Guidelines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth={1.5} />

              <path d={linePath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />

              {points.map((p, i) => (
                <g key={i} className="group">
                  <circle cx={p.x} cy={p.y} r={4} fill="#10b981" stroke="#ffffff" strokeWidth={1.5} />
                  <text x={p.x} y={height - 2} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">{p.label}</text>
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#0f172a" fontSize={9} fontWeight="bold" fontFamily="monospace" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                    {p.amtStr}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Plan Revenue breakdown */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Plan-wise Revenue Contribution</h4>
          <div className="space-y-4">
            {planRevenue.map(p => (
              <div key={p.planName} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{p.planName}</span>
                  <span className="font-semibold text-gray-400">{p.revenue} ({p.pct}%)</span>
                </div>
                <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country revenue splits */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Country-wise Revenue</h4>
          <div className="divide-y divide-gray-100">
            {countryRevenue.map(c => (
              <div key={c.country} className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-gray-800">{c.country}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-500">{c.revenue}</span>
                  <span className="font-extrabold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-mono">
                    {c.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices Pending and Refund Reports */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Outstanding Invoices Log</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-bold uppercase tracking-wide">Client Organization</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-center">Status</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-center">Delay</th>
                  <th className="pb-2 font-bold uppercase tracking-wide text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {outstandingInvoices.map(inv => (
                  <tr key={inv.org}>
                    <td className="py-2 font-bold text-gray-950">{inv.org}</td>
                    <td className="py-2 text-center">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                        inv.status === "Overdue" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                      }`}>{inv.status}</span>
                    </td>
                    <td className="py-2 text-center text-gray-400 font-semibold font-mono">{inv.days} days</td>
                    <td className="py-2 text-right font-black text-indigo-650 font-mono">{inv.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <hr className="border-gray-100 my-2" />
          
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Monthly Refund Volume:</span>
            <span className="font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded font-mono">
              {refundAmt} ({refundCount} transactions)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
