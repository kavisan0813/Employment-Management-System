/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coins, AlertCircle, RefreshCw, CheckCircle2, Search, Link2, DollarSign } from "lucide-react";
import { FailedPaymentAlert } from "../types/notifications.types";

interface Props {
  failedPayments: FailedPaymentAlert[];
  onRetryPayment: (id: string) => void;
}

export function FailedPaymentsView({ failedPayments, onRetryPayment }: Props) {
  const [search, setSearch] = useState("");

  const filtered = failedPayments.filter(p => 
    p.orgName.toLowerCase().includes(search.toLowerCase()) || 
    p.invoiceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Search Bar with Tint */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice or company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Invoice Table with Header Tint */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-800 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3">Organization</th>
              <th className="px-5 py-3">Invoice ID</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Failure Reason</th>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(payment => (
              <tr key={payment.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{payment.orgName}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">ID: {payment.id}</div>
                </td>
                <td className="px-5 py-4 font-mono text-indigo-700 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" /> {payment.invoiceId}
                </td>
                <td className="px-5 py-4 font-mono text-gray-900">{payment.amount}</td>
                <td className="px-5 py-4">
                  <span className="text-[11px] text-rose-600 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {payment.reason}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-400">{new Date(payment.date).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-semibold ${payment.resolved ? "text-emerald-600" : "text-amber-600"}`}>
                    {payment.resolved ? "Resolved" : "Payment Failed"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {!payment.resolved ? (
                    <button
                      onClick={() => onRetryPayment(payment.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] rounded-lg shadow-sm transition-all"
                    >
                      <RefreshCw className="w-3 h-3 inline mr-1" /> Retry Charge
                    </button>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue Leakage Warning with Tint */}
      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-900 leading-relaxed font-medium flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <strong>Revenue Protection Warning:</strong> Invoices remaining unresolved for more than 7 days will automatically trigger a temporary platform access freeze for the tenant.
        </div>
      </div>
    </div>
  );
}