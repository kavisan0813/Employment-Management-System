/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar, DollarSign, AlertTriangle, FileText } from "lucide-react";
import { SubscriptionService } from "../services/subscription.service";
import { RenewalTable } from "../components/RenewalTable";
import { SubscriptionDrawer } from "../components/SubscriptionDrawer";
import { SubscriptionRecord } from "../types/subscription.types";
import { useSubscriptions } from "../hooks/useSubscriptions";

export function RenewalTrackingPage() {
  const [daysAhead, setDaysAhead] = React.useState(30);
  const [selectedSub, setSelectedSub] = React.useState<SubscriptionRecord | null>(null);
  const { handleChangePlan, handleCancel, handleReactivate } = useSubscriptions();

  const renewals = SubscriptionService.getRenewalsUpcoming(daysAhead);

  const handleRowClick = (sub: SubscriptionRecord) => {
    setSelectedSub(sub);
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium">
      
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Renewal Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Monitor upcoming subscription renewals and proactively manage retention.
          </p>
        </div>
      </div>

      {/* Top Cards row */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Renewals", val: renewals.length.toString(), sub: `in the next ${daysAhead} days`, icon: FileText, bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-900" },
          { label: "Renewal Revenue", val: `$${renewals.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`, sub: "expected inflows", icon: DollarSign, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900" },
          { label: "Urgent (≤7 days)", val: renewals.filter((r) => {
              if (!r.renewalDate) return false;
              const days = Math.ceil((new Date(r.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return days <= 7;
            }).length.toString(), sub: "need immediate attention", icon: AlertTriangle, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-900" }
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
                <p className={`text-xs font-semibold ${m.text} opacity-60 mt-1`}>{m.sub}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Filters Header Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm font-semibold text-gray-900">Upcoming Renewals</div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Show next</span>
            <select
              value={daysAhead}
              onChange={(e) => setDaysAhead(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none cursor-pointer"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <RenewalTable renewals={renewals} onRowClick={handleRowClick} />
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selectedSub && (
        <SubscriptionDrawer
          subscription={selectedSub!}
          onClose={() => setSelectedSub(null)}
          onChangePlan={handleChangePlan}
          onCancel={handleCancel}
          onReactivate={handleReactivate}
        />
      )}
    </div>
  );
}

export default RenewalTrackingPage;
