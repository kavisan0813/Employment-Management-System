/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Calendar, Bell, ArrowUpRight } from "lucide-react";
import { pushAuditLog } from "../../../mockData";

interface SubscriptionReportsViewProps {
  triggerAlert: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
}

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function SubscriptionReportsView({ triggerAlert }: SubscriptionReportsViewProps) {
  const plans = [
    { name: "Basic Plan", count: 200, price: "$99/mo", color: "bg-sky-50 border-sky-100 text-sky-900" },
    { name: "Professional Plan", count: 180, price: "$299/mo", color: "bg-indigo-50 border-indigo-100 text-indigo-900" },
    { name: "Enterprise Plan", count: 120, price: "$999/mo", color: "bg-emerald-50 border-emerald-100 text-emerald-900" }
  ];

  const warningList = [
    { label: "Expiring in 7 Days", count: 5, actionLabel: "Dispatch SMS", urgency: "Critical" },
    { label: "Expiring in 15 Days", count: 8, actionLabel: "Email Reminder", urgency: "High" },
    { label: "Expiring in 30 Days", count: 7, actionLabel: "Queue Notice", urgency: "Medium" }
  ];

  const handleDispatchRenewalAlert = (label: string, count: number) => {
    triggerAlert(`Renewal reminders successfully dispatched to ${count} tenants.`, "success");
    pushAuditLog("subscription.renewal_notices_sent", "Billing", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { expiry_window: label, tenants_count: String(count) });
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Subscription Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Track active plans and dispatch renewal notices.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className={`p-5 border rounded-xl flex flex-col justify-between h-28 ${p.color}`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{p.name}</span>
              <span className="text-xs font-semibold opacity-80">{p.price}</span>
            </div>
            <div>
              <span className="text-2xl font-semibold">{p.count}</span>
              <span className="text-xs font-medium block opacity-80">Active subscriptions</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Conversion Funnel */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Trial Conversion Funnel
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[{l: "Trial Users", v: "100", c: "bg-gray-50"}, {l: "Converted", v: "40", c: "bg-teal-50"}, {l: "Expired", v: "60", c: "bg-rose-50"}].map(item => (
              <div key={item.l} className={`p-3 ${item.c} border border-gray-100 rounded-lg text-center`}>
                <span className="text-xs font-medium text-gray-500 uppercase block">{item.l}</span>
                <span className="text-lg font-semibold text-gray-700">{item.v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-800 uppercase">Conversion Rate</span>
              <p className="text-xs font-medium text-indigo-600 mt-0.5">Industry Benchmark: 30.0%</p>
            </div>
            <span className="text-2xl font-semibold text-indigo-900 flex items-center gap-1">
              40.0% <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </span>
          </div>
        </div>

        {/* Business Vital Indexes */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Business Vital Indexes</h4>
          <div className="divide-y divide-gray-100">
            {[
              { label: "Customer Churn Rate", val: "3.0% Churn", color: "text-rose-700 bg-rose-50" },
              { label: "Renewal Success Rate", val: "97.0% Renewed", color: "text-teal-700 bg-teal-50" },
              { label: "Converted Accounts", val: "250 Accounts", color: "text-gray-700 bg-gray-50" }
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`font-medium px-2 py-0.5 rounded ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Renewal Dispatch Center */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-500" /> Renewal Warning Center
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warningList.map(item => (
            <div key={item.label} className="p-4 border border-gray-200 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-900">{item.label}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  item.urgency === "Critical" ? "bg-rose-50 text-rose-700" : 
                  item.urgency === "High" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                }`}>{item.urgency}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-semibold text-gray-700">{item.count} tenants</span>
                <button
                  onClick={() => handleDispatchRenewalAlert(item.label, item.count)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-all"
                >
                  <Bell className="w-3 h-3" /> {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    
  );
}