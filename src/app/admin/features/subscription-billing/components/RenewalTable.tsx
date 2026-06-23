/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar, Building2, AlertTriangle, Clock } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";

interface RenewalTableProps {
  renewals: SubscriptionRecord[];
  onRowClick: (sub: SubscriptionRecord) => void;
}

const planBadgeClass = (plan: string) =>
  plan === "Enterprise"
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : plan === "Growth"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

function getDaysUntil(dateStr: string | null): number {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function UrgencyBadge({ days }: { days: number }) {
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-2.5 h-2.5" />
        {days}d
      </span>
    );
  }
  if (days <= 14) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-2.5 h-2.5" />
        {days}d
      </span>
    );
  }
  return (
    <span className="text-[10px] text-gray-500 font-medium">{days} days</span>
  );
}

export function RenewalTable({ renewals, onRowClick }: RenewalTableProps) {
  const sorted = [...renewals].sort(
    (a, b) => getDaysUntil(a.renewalDate) - getDaysUntil(b.renewalDate),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-100 font-medium">
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Cycle
            </th>
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Renewal Date
            </th>
            <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Time Left
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                  <span className="font-medium text-gray-500">
                    No upcoming renewals
                  </span>
                  <span className="text-[11px] text-gray-400">
                    All subscriptions are up to date.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((sub) => {
              const days = getDaysUntil(sub.renewalDate);
              return (
                <tr
                  key={sub.id}
                  onClick={() => onRowClick(sub)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {sub.organizationName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${planBadgeClass(sub.planTier)}`}
                    >
                      {sub.planTier}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {sub.billingCycle}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">
                    ${sub.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {sub.renewalDate || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <UrgencyBadge days={days} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RenewalTable;
