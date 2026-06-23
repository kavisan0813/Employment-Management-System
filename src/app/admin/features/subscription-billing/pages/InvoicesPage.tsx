/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileText, Search, ChevronDown, ShieldAlert, CheckCircle2, Clock, AlertTriangle, Ban } from "lucide-react";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceDrawer } from "../components/InvoiceDrawer";

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
  Paid: { class: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Pending: { class: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  Overdue: { class: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertTriangle },
  Cancelled: { class: "bg-gray-100 text-gray-600 border-gray-200", icon: Ban },
  Refunded: { class: "bg-blue-50 text-blue-700 border-blue-200", icon: Ban },
};

export function InvoicesPage() {
  const {
    filteredInvoices,
    stats,
    selectedInvoice,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    openDrawer,
    closeDrawer,
    handleMarkPaid,
    handleRefund,
  } = useInvoices();

  const hasActiveFilters = statusFilter !== "ALL" || !!searchQuery;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Invoices
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage invoices across all organization subscriptions.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Invoiced</span>
            <p className="text-xl font-bold text-gray-950 mt-1">${stats.totalInvoiced.toLocaleString()}</p>
          </div>
          <div className="lg:border-l border-gray-150 lg:pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Paid</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">${stats.totalPaid.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Overdue</span>
            <p className="text-xl font-bold text-rose-600 mt-1">${stats.totalOverdue.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending</span>
            <p className="text-xl font-bold text-amber-600 mt-1">${stats.totalPending.toLocaleString()}</p>
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
              placeholder="Search by invoice number or organization…"
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
                ["Paid", "Paid"],
                ["Pending", "Pending"],
                ["Overdue", "Overdue"],
                ["Refunded", "Refunded"],
                ["Cancelled", "Cancelled"],
              ]}
            />
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
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
                <th className="px-5 py-4">Invoice #</th>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Tax</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Issued</th>
                <th className="px-5 py-4">Due</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <ShieldAlert className="w-8 h-8 text-gray-300 animate-pulse" />
                      <span className="font-medium text-gray-500">No invoices found.</span>
                      <span className="text-[11px] text-gray-400">Try adjusting your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const cfg = statusConfig[inv.status] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => openDrawer(inv)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-gray-700">{inv.invoiceNumber}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{inv.organizationName}</td>
                      <td className="px-5 py-4 text-gray-600">${inv.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-400">${inv.tax.toLocaleString()}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">${inv.totalAmount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-500">{inv.issuedDate}</td>
                      <td className="px-5 py-4 text-gray-500">{inv.dueDate}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.class}`}>
                          <StatusIcon className="w-3 h-3" />
                          {inv.status}
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
      {isDrawerOpen && selectedInvoice && (
        <InvoiceDrawer
          invoice={selectedInvoice}
          onClose={closeDrawer}
          onMarkPaid={handleMarkPaid}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
}

export default InvoicesPage;
