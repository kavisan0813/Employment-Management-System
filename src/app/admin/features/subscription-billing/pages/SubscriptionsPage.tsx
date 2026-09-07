/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  CreditCard,
  Search,
  ChevronDown,
  ShieldAlert,
  Activity,
  IndianRupee,
  TrendingDown,
  Calendar,
  Download,
  Package,
} from "lucide-react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { SubscriptionDrawer } from "../components/SubscriptionDrawer";
import { SubscriptionRecord } from "../types/subscription.types";

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
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
      <span className="text-[10px] uppercase font-semibold text-gray-400">
        {label}
      </span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0.5 pr-5 focus:outline-none font-medium appearance-none cursor-pointer z-10"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
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
    subscriptions,
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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Derive dynamic Plan Distribution counts from subscriptions
  const planDistribution = useMemo(() => {
    const counts: Record<string, number> = { Starter: 0, Growth: 0, Enterprise: 0 };
    subscriptions.forEach((s) => {
      if (counts[s.planTier] !== undefined) {
        counts[s.planTier] += 1;
      } else {
        counts[s.planTier] = 1;
      }
    });
    return counts;
  }, [subscriptions]);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    planFilter !== "ALL" ||
    cycleFilter !== "ALL" ||
    !!searchQuery;

  // Visible IDs
  const visibleIds = useMemo(() => filteredSubs.map((s) => s.id), [filteredSubs]);
  const visibleIdsSet = useMemo(() => new Set(visibleIds), [visibleIds]);
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleSelectedIds = useMemo(
    () => selectedIds.filter((id) => visibleIdsSet.has(id)),
    [selectedIds, visibleIdsSet],
  );

  const isAllSelected = visibleIds.length > 0 && visibleSelectedIds.length === visibleIds.length;
  const isSomeSelected = visibleSelectedIds.length > 0 && !isAllSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const merged = Array.from(new Set([...selectedIds, ...visibleIds]));
      setSelectedIds(merged);
    } else {
      setSelectedIds(selectedIds.filter((id) => !visibleIdsSet.has(id)));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleExportCSV = () => {
    const subsToExport = selectedIds.length > 0
      ? filteredSubs.filter((s) => selectedIdsSet.has(s.id))
      : filteredSubs;

    const headers = ["S.No.", "Subscription ID", "Organization", "Plan", "Billing Cycle", "Amount (INR)", "Renewal Date", "Failures", "Status"];
    const rows = subsToExport.map((s, idx) => [
      idx + 1,
      s.id,
      `"${s.organizationName}"`,
      s.planTier,
      s.billingCycle,
      s.amount,
      s.renewalDate || "N/A",
      s.failedPaymentCount,
      s.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium">
      {/* Navigation Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Active Subscriptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-semibold">
            Manage active organizational plans, trials, and subscription statuses.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Report {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </button>
      </div>

      {/* Top Summary Cards */}
      {stats && (
        <div className="px-6 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Active Subscriptions",
                val: stats.totalActive.toString(),
                sub: "Currently active",
                icon: Activity,
                bg: "bg-indigo-50/50",
                border: "border-indigo-100",
                text: "text-indigo-900",
              },
              {
                label: "Total Revenue",
                val: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
                sub: "Monthly recurring",
                icon: IndianRupee,
                bg: "bg-emerald-50/50",
                border: "border-emerald-100",
                text: "text-emerald-900",
              },
              {
                label: "Churn Rate",
                val: `${stats.churnRate.toFixed(1)}%`,
                sub: "Last 30 days",
                icon: TrendingDown,
                bg: "bg-rose-50/50",
                border: "border-rose-100",
                text: "text-rose-900",
              },
              {
                label: "Renewals This Month",
                val: stats.renewalsThisMonth.toString(),
                sub: "Upcoming",
                icon: Calendar,
                bg: "bg-sky-50/50",
                border: "border-sky-100",
                text: "text-sky-900",
              },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className={`${m.bg} ${m.border} border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer flex flex-col justify-between h-28`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${m.text} opacity-70`}>
                      {m.label}
                    </span>
                    <Icon className={`w-4 h-4 ${m.text}`} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${m.text} tracking-tight`}>
                      {m.val}
                    </h4>
                    <p className={`text-[11px] font-medium ${m.text} opacity-60 mt-0.5`}>
                      {m.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan Distribution Breakdown Section */}
      <div className="px-6 pt-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-600" />
              Plan Distribution
            </h3>
            <span className="text-[11px] font-semibold text-gray-500">
              Total {subscriptions.length} Subscriptions
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(planDistribution).map(([tier, count]) => {
              const badgeClass = planBadgeClass(tier);
              return (
                <div
                  key={tier}
                  onClick={() => setPlanFilter(tier as any)}
                  className="p-3 bg-gray-50/50 hover:bg-gray-100/60 border border-gray-200/80 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                      {tier}
                    </span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{count} orgs</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
        {/* Filters Header Container */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or organization name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 transition-colors font-medium"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
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
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Showing {filteredSubs.length} of {subscriptions.length} subscriptions</span>
            {selectedIds.length > 0 && (
              <span className="text-indigo-600 font-bold">{selectedIds.length} row(s) selected</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      ref={headerCheckboxRef}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 w-14">S.No.</th>
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
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <ShieldAlert className="w-8 h-8 text-gray-300 animate-pulse" />
                        <span className="font-medium text-gray-500">
                          No subscriptions found matching your filters.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub, index) => {
                    const isSelected = selectedIdsSet.has(sub.id);
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => openDrawer(sub)}
                        className={`hover:bg-gray-50/70 transition-colors cursor-pointer group ${
                          isSelected ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectRow(sub.id, e as any)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-gray-500">
                          {sub.id}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          {sub.organizationName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold ${planBadgeClass(sub.planTier)}`}
                          >
                            {sub.planTier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-semibold">
                          {sub.billingCycle}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          ₹{sub.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {sub.renewalDate || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {sub.failedPaymentCount > 0 ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              {sub.failedPaymentCount}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusBadgeClass(sub.status)}`}
                          >
                            {sub.status}
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
