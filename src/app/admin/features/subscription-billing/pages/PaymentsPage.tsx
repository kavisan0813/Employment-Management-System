/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DollarSign, Search, ChevronDown, ShieldAlert, CheckCircle2, XCircle, Clock, RotateCw } from "lucide-react";
import { usePayments } from "../hooks/usePayments";
import { PaymentDrawer } from "../components/PaymentDrawer";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
      <span className="text-[10px] uppercase font-semibold text-gray-400">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0.5 pr-5 focus:outline-none font-medium appearance-none cursor-pointer z-10"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none z-0" />
      </div>
    </div>
  );
}

const statusConfig: Record<string, { class: string; icon: React.ElementType }> = {
  Success: { class: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Failed: { class: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  Pending: { class: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  Refunded: { class: "bg-blue-50 text-blue-700 border-blue-200", icon: RotateCw },
};

export function PaymentsPage() {
  const {
    filteredPayments,
    stats,
    selectedPayment,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    openDrawer,
    closeDrawer,
    handleRetry,
    handleRefund,
  } = usePayments();

  const hasActiveFilters = statusFilter !== "ALL" || methodFilter !== "ALL" || !!searchQuery;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            Payments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track payment transactions, retry failures, and issue refunds.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Collected</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">${stats.totalCollected.toLocaleString()}</p>
          </div>
          <div className="lg:border-l border-gray-150 lg:pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Failed</span>
            <p className="text-xl font-bold text-rose-600 mt-1">${stats.totalFailed.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending</span>
            <p className="text-xl font-bold text-amber-600 mt-1">${stats.totalPending.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Refunded</span>
            <p className="text-xl font-bold text-blue-600 mt-1">${stats.totalRefunded.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Success Rate</span>
            <p className="text-xl font-bold text-gray-950 mt-1">{stats.successRate.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by organization, transaction ID, or invoice…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter as (v: string) => void}
              options={[
                ["ALL", "All statuses"],
                ["Success", "Success"],
                ["Failed", "Failed"],
                ["Pending", "Pending"],
                ["Refunded", "Refunded"],
              ]}
            />
            <FilterSelect
              label="Method"
              value={methodFilter}
              onChange={setMethodFilter}
              options={[
                ["ALL", "All methods"],
                ["Credit Card", "Credit Card"],
                ["Bank Transfer", "Bank Transfer"],
                ["Wire Transfer", "Wire Transfer"],
                ["PayPal", "PayPal"],
              ]}
            />
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setMethodFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">Transaction</th>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Invoice</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <ShieldAlert className="w-8 h-8 text-gray-300 animate-pulse" />
                      <span className="font-medium text-gray-500">No payments found.</span>
                      <span className="text-[11px] text-gray-400">Try adjusting your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => {
                  const cfg = statusConfig[pay.status] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={pay.id}
                      onClick={() => openDrawer(pay)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-[10px] text-gray-500">{pay.transactionId}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">{pay.organizationName}</td>
                      <td className="px-5 py-4 text-gray-600 font-mono">{pay.invoiceNumber}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">${pay.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {pay.method}
                        {pay.cardLast4 && <span className="text-gray-400 ml-1">•••• {pay.cardLast4}</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-500">{pay.paymentDate}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.class}`}>
                          <StatusIcon className="w-3 h-3" />
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedPayment && (
        <PaymentDrawer
          payment={selectedPayment}
          onClose={closeDrawer}
          onRetry={handleRetry}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
}

export default PaymentsPage;
