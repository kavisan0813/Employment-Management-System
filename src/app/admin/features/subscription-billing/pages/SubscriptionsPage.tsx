/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CreditCard, Search, ChevronDown, ShieldAlert } from "lucide-react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { SubscriptionDrawer } from "../components/SubscriptionDrawer";

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

const planBadgeClass = (plan: string) =>
  plan === "Enterprise"
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : plan === "Growth"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

const statusBadgeClass = (status: string) =>
  status === "Active"
    ? "bg-teal-50 text-teal-700 border-teal-200"
    : status === "Trial"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "Pending"
        ? "bg-gray-100 text-gray-600 border-gray-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

export function SubscriptionsPage() {
  const {
    filteredSubs,
    stats,
    selectedSub,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    cycleFilter,
    setCycleFilter,
    openDrawer,
    closeDrawer,
    handleChangePlan,
    handleCancel,
    handleReactivate,
  } = useSubscriptions();

  const hasActiveFilters =
    statusFilter !== "ALL" || planFilter !== "ALL" || cycleFilter !== "ALL" || !!searchQuery;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Subscriptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage billing plans and lifecycle for every organization subscription.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active</span>
            <p className="text-xl font-bold text-gray-950 mt-1">{stats.totalActive}</p>
          </div>
          <div className="lg:border-l border-gray-150 lg:pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Revenue</span>
            <p className="text-xl font-bold text-gray-950 mt-1">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Churn Rate</span>
            <p className="text-xl font-bold text-rose-600 mt-1">{stats.churnRate.toFixed(1)}%</p>
          </div>
          <div className="border-l border-gray-150 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Renewals This Month</span>
            <p className="text-xl font-bold text-gray-950 mt-1">{stats.renewalsThisMonth}</p>
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
              placeholder="Search by ID or organization name…"
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
                ["Active", "Active"],
                ["Trial", "Trial"],
                ["Pending", "Pending"],
                ["Suspended", "Suspended"],
                ["Inactive", "Cancelled"],
              ]}
            />
            <FilterSelect
              label="Plan"
              value={planFilter}
              onChange={setPlanFilter as (v: string) => void}
              options={[
                ["ALL", "All plans"],
                ["Starter", "Starter"],
                ["Growth", "Growth"],
                ["Enterprise", "Enterprise"],
              ]}
            />
            <FilterSelect
              label="Cycle"
              value={cycleFilter}
              onChange={setCycleFilter as (v: string) => void}
              options={[
                ["ALL", "All cycles"],
                ["Monthly", "Monthly"],
                ["Annual", "Annual"],
              ]}
            />
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setPlanFilter("ALL");
                  setCycleFilter("ALL");
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Renewal</th>
                <th className="px-4 py-3">Failures</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <ShieldAlert className="w-8 h-8 text-gray-300 animate-pulse" />
                      <span className="font-medium text-gray-500">No subscriptions found.</span>
                      <span className="text-[11px] text-gray-400">Try adjusting your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => openDrawer(sub)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-gray-500">{sub.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{sub.organizationName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-[11px] font-semibold ${planBadgeClass(sub.planTier)}`}>
                        {sub.planTier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sub.billingCycle}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${sub.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{sub.renewalDate || "—"}</td>
                    <td className="px-4 py-3">
                      {sub.failedPaymentCount > 0 ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {sub.failedPaymentCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-medium ${statusBadgeClass(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedSub && (
        <SubscriptionDrawer
          subscription={selectedSub}
          onClose={closeDrawer}
          onChangePlan={handleChangePlan}
          onCancel={handleCancel}
          onReactivate={handleReactivate}
        />
      )}
    </div>
  );
}

export default SubscriptionsPage;
