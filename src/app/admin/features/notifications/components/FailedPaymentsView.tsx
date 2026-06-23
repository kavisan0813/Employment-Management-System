/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coins, AlertCircle, RefreshCw, CheckCircle2, Search, Link2 } from "lucide-react";
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
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice or company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Invoice failures logs list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-5 py-3">Organization</th>
              <th className="px-5 py-3">Invoice ID</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Failure Reason</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {filtered.map(payment => {
              return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-gray-900 leading-snug">{payment.orgName}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">ID: {payment.id}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-indigo-700 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-gray-400" />
                    {payment.invoiceId}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      {payment.reason}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-bold text-[10px]">
                    {new Date(payment.date).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-extrabold ${
                      payment.resolved ? "text-emerald-600" : "text-amber-600 animate-pulse"
                    }`}>
                      {payment.resolved ? "Resolved" : "Payment Failed"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!payment.resolved ? (
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => onRetryPayment(payment.id)}
                          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs border-none"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry Card Charge
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold flex items-center justify-end gap-1 select-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Resolved
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-455 font-bold">
                  No failed billing transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Revenue leakage warnings metadata box */}
      <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl text-[10px] text-amber-900 leading-relaxed font-semibold flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong>Revenue Protection Warning:</strong> Invoices remaining unresolved for more than 7 days will automatically freeze the tenant organization access to the platform.
        </div>
      </div>

    </div>
  );
}
