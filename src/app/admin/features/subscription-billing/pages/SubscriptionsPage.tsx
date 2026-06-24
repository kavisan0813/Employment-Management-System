/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CreditCard, Search, ChevronDown, ShieldAlert, Activity, DollarSign, TrendingDown, Calendar } from "lucide-react";
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
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium">
      
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Active Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage active organizational plans, trials, and subscription statuses.
          </p>
        </div>
      </div>

      {/* Top Cards row */}
      {stats && (
        <div className="px-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active", val: stats.totalActive.toString(), sub: "Total active subs", icon: Activity, bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-900" },
            { label: "Total Revenue", val: `$${stats.totalRevenue.toLocaleString()}`, sub: "Monthly recurring", icon: DollarSign, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900" },
            { label: "Churn Rate", val: `${stats.churnRate.toFixed(1)}%`, sub: "Last 30 days", icon: TrendingDown, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-900" },
            { label: "Renewals This Month", val: stats.renewalsThisMonth.toString(), sub: "Upcoming", icon: Calendar, bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-900" }
          ].map(m => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
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
        </div>
      )}

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Filters Header Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or organization name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Cycle</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Renewal</th>
                <th className="px-5 py-4">Failures</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
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
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-mono font-semibold text-gray-500">{sub.id}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{sub.organizationName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${planBadgeClass(sub.planTier)}`}>
                        {sub.planTier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{sub.billingCycle}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">${sub.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500">{sub.renewalDate || "—"}</td>
                    <td className="px-5 py-4">
                      {sub.failedPaymentCount > 0 ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {sub.failedPaymentCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusBadgeClass(sub.status)}`}>
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
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedSub && (
        <SubscriptionDrawer
          subscription={selectedSub!}
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
