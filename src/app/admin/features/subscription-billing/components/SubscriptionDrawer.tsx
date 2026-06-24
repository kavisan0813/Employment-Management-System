/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, CreditCard, Calendar, Building2, ArrowRightLeft, Ban, RotateCw } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";

interface SubscriptionDrawerProps {
  subscription: SubscriptionRecord;
  onClose: () => void;
  onChangePlan: (subId: string, newPlan: "Starter" | "Growth" | "Enterprise", newAmount: number) => void;
  onCancel: (subId: string) => void;
  onReactivate: (subId: string) => void;
}

const PLAN_PRICES = { Starter: 99, Growth: 1200, Enterprise: 3500 };

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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}

export function SubscriptionDrawer({
  subscription: sub,
  onClose,
  onChangePlan,
  onCancel,
  onReactivate,
}: SubscriptionDrawerProps) {
  const [showPlanChange, setShowPlanChange] = React.useState(false);
  const [newPlan, setNewPlan] = React.useState(sub.planTier);

  const handlePlanChange = () => {
    const amount = sub.billingCycle === "Annual"
      ? PLAN_PRICES[newPlan] * 12 * 0.9
      : PLAN_PRICES[newPlan];
    onChangePlan(sub.id, newPlan, amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Subscription Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Organization header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{sub.organizationName}</p>
              <p className="text-[11px] text-gray-400 font-mono">{sub.id}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-0.5">
          <InfoRow
            label="Plan"
            value={
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${planBadgeClass(sub.planTier)}`}>
                {sub.planTier}
              </span>
            }
          />
          <InfoRow
            label="Status"
            value={
              <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusBadgeClass(sub.status)}`}>
                {sub.status}
              </span>
            }
          />
          <InfoRow
            label="Billing Cycle"
            value={
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                {sub.billingCycle}
              </span>
            }
          />
          <InfoRow
            label="Amount"
            value={`$${sub.amount.toLocaleString()} ${sub.currency}`}
          />
          <InfoRow label="Start Date" value={sub.startDate} />
          <InfoRow label="Renewal Date" value={sub.renewalDate || "—"} />
          <InfoRow
            label="Payment Method"
            value={sub.paymentMethodLast4 ? `•••• ${sub.paymentMethodLast4}` : "Not on file"}
          />
          <InfoRow
            label="Failed Payments"
            value={
              sub.failedPaymentCount > 0 ? (
                <span className="text-rose-600 font-semibold">{sub.failedPaymentCount} failures</span>
              ) : (
                <span className="text-emerald-600">None</span>
              )
            }
          />
          <InfoRow
            label="Auto Renew"
            value={sub.autoRenew ? "Yes" : "No"}
          />
        </div>

        {/* Plan change section */}
        {sub.status === "Active" && (
          <div className="px-5 py-4 border-t border-gray-100">
            {!showPlanChange ? (
              <button
                onClick={() => setShowPlanChange(true)}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Change Plan
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                    New plan tier
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none"
                  >
                    <option value="Starter">Starter ($99/mo)</option>
                    <option value="Growth">Growth ($1,200/mo)</option>
                    <option value="Enterprise">Enterprise ($3,500/mo)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPlanChange(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlanChange}
                    disabled={newPlan === sub.planTier}
                    className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
                  >
                    Apply Change
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        {sub.status === "Active" ? (
          <button
            onClick={() => onCancel(sub.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            Cancel Subscription
          </button>
        ) : sub.status === "Inactive" || sub.status === "Suspended" ? (
          <button
            onClick={() => onReactivate(sub.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Reactivate Subscription
          </button>
        ) : null}
        <button
          onClick={onClose}
          className="px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Close
        </button>
      </div>
      </div>
    </div>
  );
}

export default SubscriptionDrawer;
