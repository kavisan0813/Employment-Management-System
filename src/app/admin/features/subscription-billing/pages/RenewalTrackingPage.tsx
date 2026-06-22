/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar } from "lucide-react";
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Renewal Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor upcoming subscription renewals and proactively manage retention.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-semibold text-gray-400">Show next</span>
          <select
            value={daysAhead}
            onChange={(e) => setDaysAhead(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Renewals</span>
          <p className="text-2xl font-bold text-gray-900 mt-1.5">{renewals.length}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">in the next {daysAhead} days</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Renewal Revenue</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1.5">
            ${renewals.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">expected inflows</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Urgent (≤7 days)</span>
          <p className="text-2xl font-bold text-rose-600 mt-1.5">
            {renewals.filter((r) => {
              if (!r.renewalDate) return false;
              const days = Math.ceil((new Date(r.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return days <= 7;
            }).length}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">need immediate attention</p>
        </div>
      </div>

      {/* Renewal table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <RenewalTable renewals={renewals} onRowClick={handleRowClick} />
      </div>

      {/* Drawer */}
      {selectedSub && (
        <SubscriptionDrawer
          subscription={selectedSub}
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
