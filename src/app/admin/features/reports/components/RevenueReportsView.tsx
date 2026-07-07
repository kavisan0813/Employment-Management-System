/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, DollarSign, Receipt, TrendingUp } from "lucide-react";

export function RevenueReportsView() {
  const mrr = "₹10,00,000";
  const arr = "₹1,20,00,000";
  const outstandingTotal = "₹4,44,000";

  const planRevenue = [
    {
      planName: "Basic Plan",
      revenue: "₹2,00,000",
      pct: 20,
      color: "bg-sky-500",
    },
    {
      planName: "Professional Plan",
      revenue: "₹4,00,000",
      pct: 40,
      color: "bg-indigo-600",
    },
    {
      planName: "Enterprise Plan",
      revenue: "₹4,00,000",
      pct: 40,
      color: "bg-emerald-500",
    },
  ];

/*   const countryRevenue = [
    { country: "India", revenue: "₹8,00,000", pct: 80 },
    { country: "UAE", revenue: "₹1,00,000", pct: 10 },
    { country: "Singapore", revenue: "₹1,00,000", pct: 10 },
  ];

  const outstandingInvoices = [
    { org: "Nova Media Ltd", status: "Overdue", amount: "₹68,000" },
    { org: "Umbrella Biotech", status: "Pending", amount: "₹2,80,000" },
    { org: "Apex Global", status: "Pending", amount: "₹96,000" },
  ]; */

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Revenue Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Monitor financial performance and outstanding invoices.
          </p>
        </div>
        
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Revenue core boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "MRR",
              val: mrr,
              icon: Wallet,
              bg: "bg-indigo-50",
              border: "border-indigo-100",
              text: "text-indigo-700",
            },
            {
              label: "ARR",
              val: arr,
              icon: DollarSign,
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              text: "text-emerald-700",
            },
            {
              label: "Outstanding",
              val: outstandingTotal,
              icon: Receipt,
              bg: "bg-sky-50",
              border: "border-sky-100",
              text: "text-sky-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-5 border ${item.bg} ${item.border} rounded-xl shadow-sm`}
            >
              <div
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${item.text}`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </div>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {item.val}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="border border-emerald-100 rounded-xl p-5 bg-emerald-50/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-emerald-900 uppercase">
                Revenue Trend
              </h4>
              <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +100%
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-emerald-100">
              <div className="h-32 flex items-end justify-between">
                {[5, 6, 7, 8, 9, 10].map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 bg-emerald-100 rounded-t-lg relative"
                      style={{ height: `${(v / 10) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-emerald-500 rounded-t-lg opacity-80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Revenue */}
          <div className="border border-indigo-100 rounded-xl p-5 bg-indigo-50/20 space-y-4">
            <h4 className="text-sm font-semibold text-indigo-900 uppercase">
              Plan Contribution
            </h4>
            <div className="space-y-4">
              {planRevenue.map((p) => (
                <div key={p.planName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{p.planName}</span>
                    <span>
                      {p.revenue} ({p.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full border border-indigo-100 overflow-hidden">
                    <div
                      className={`h-full ${p.color}`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Revenue */}
      {/*   <div className="border border-sky-100 rounded-xl p-5 bg-sky-50/20 space-y-3">
          <h4 className="text-sm font-semibold text-sky-900 uppercase">
            Country Revenue
          </h4>
          <div className="divide-y divide-sky-100 bg-white rounded-lg border border-sky-100">
            {countryRevenue.map((c) => (
              <div
                key={c.country}
                className="flex items-center justify-between p-3 text-xs"
              >
                <span className="font-semibold text-gray-700">{c.country}</span>
                <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {c.pct}%
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Invoices */}
       {/*  <div className="border border-rose-100 rounded-xl p-5 bg-rose-50/20 space-y-3">
          <h4 className="text-sm font-semibold text-rose-900 uppercase">
            Outstanding Invoices
          </h4>
          <div className="bg-white rounded-lg border border-rose-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/50 text-rose-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {outstandingInvoices.map((inv) => (
                  <tr key={inv.org}>
                    <td className="p-3 font-semibold text-gray-700">
                      {inv.org}
                    </td>
                    <td className="p-3 text-rose-700 font-medium">
                      {inv.status}
                    </td>
                    <td className="p-3 font-semibold text-gray-700">
                      {inv.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>


  );
}
