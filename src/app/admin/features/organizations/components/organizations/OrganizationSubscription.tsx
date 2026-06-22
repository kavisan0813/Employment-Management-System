/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Subscription } from "../../../../types";

interface OrganizationSubscriptionProps {
  subscriptions: Subscription[];
}

export function OrganizationSubscription({ subscriptions }: OrganizationSubscriptionProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        Subscription
      </h4>
      {subscriptions.length === 0 ? (
        <div className="p-8 text-center text-gray-400 bg-gray-50 border border-gray-100 border-dashed rounded-2xl">
          No subscription on file.
        </div>
      ) : (
        subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="border border-gray-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {sub.plan} plan
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  {sub.id}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                  sub.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {sub.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-gray-400 font-medium">Amount</span>
                <p className="font-medium text-gray-900">
                  ${sub.amount.toLocaleString()} ({sub.currency})
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Billing cycle</span>
                <p className="font-medium text-gray-900">
                  {sub.billingCycle}
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Card on file</span>
                <p className="font-mono text-gray-900">
                  •••• {sub.paymentMethodLast4 || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Renews</span>
                <p className="font-medium text-gray-900">
                  {sub.renewalDate || "—"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrganizationSubscription;
