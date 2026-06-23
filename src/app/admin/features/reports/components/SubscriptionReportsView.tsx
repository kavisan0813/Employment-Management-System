/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, Bell, AlertTriangle, ArrowUpRight } from "lucide-react";
import { pushAuditLog } from "../../../mockData";

interface SubscriptionReportsViewProps {
  triggerAlert: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
}

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function SubscriptionReportsView({ triggerAlert }: SubscriptionReportsViewProps) {
  // Plan splits
  const plans = [
    { name: "Basic Plan", count: 200, price: "$99/mo", color: "border-sky-200 bg-sky-50 text-sky-800" },
    { name: "Professional Plan", count: 180, price: "$299/mo", color: "border-indigo-200 bg-indigo-50 text-indigo-800" },
    { name: "Enterprise Plan", count: 120, price: "$999/mo", color: "border-emerald-200 bg-emerald-50 text-emerald-800" }
  ];

  // Expiring notices counts
  const warningList = [
    { label: "Expiring in 7 Days", count: 5, actionLabel: "Dispatch SMS Warning", urgency: "Critical" },
    { label: "Expiring in 15 Days", count: 8, actionLabel: "Send Email Reminder", urgency: "High" },
    { label: "Expiring in 30 Days", count: 7, actionLabel: "Queue Standard Notice", urgency: "Medium" }
  ];

  const handleDispatchRenewalAlert = (label: string, count: number) => {
    triggerAlert(`Renewal reminders successfully dispatched to ${count} tenants under '${label}' warning.`, "success");
    pushAuditLog(
      "subscription.renewal_notices_sent",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { expiry_window: label, tenants_count: String(count) }
    );
  };

  return (
    <div className="space-y-6">
      {/* SaaS business KPI grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className={`p-5 border rounded-2xl flex flex-col justify-between h-28 ${p.color}`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">{p.name}</span>
              <span className="text-[10px] font-black opacity-80">{p.price}</span>
            </div>
            <div>
              <span className="text-2xl font-black">{p.count}</span>
              <span className="text-[10px] font-semibold block mt-1">Active subscriptions</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Conversion Rates summary */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Trial Conversion Funnel
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Trial Users</span>
              <span className="text-lg font-black text-gray-900">100</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-150 rounded-xl text-center">
              <span className="text-[9px] font-bold text-teal-600 uppercase block">Converted</span>
              <span className="text-lg font-black text-teal-850">40</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-center">
              <span className="text-[9px] font-bold text-rose-600 uppercase block">Expired</span>
              <span className="text-lg font-black text-rose-850">60</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Trial-to-Paid Conversion Rate</span>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Industry Benchmark: 30.0%</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-950 flex items-center gap-1">
                40.0% <ArrowUpRight className="w-4 h-4 text-teal-600" />
              </span>
            </div>
          </div>
        </div>

        {/* Churn Rate and renewal indicators */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Business Vital Indexes</h4>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-bold text-gray-700">Customer Churn Rate (Monthly)</span>
              <span className="font-mono font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">3.0% Churn</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-bold text-gray-700">Account Renewal Success Rate</span>
              <span className="font-mono font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">97.0% Renewed</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-bold text-gray-700">Trial Converted accounts (Yearly)</span>
              <span className="font-mono font-extrabold text-gray-700 bg-gray-55 px-2 py-0.5 rounded">250 Accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry alerts dashboard dispatches */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-500" /> Upcoming Renewals Warnings & Dispatch Center
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warningList.map(item => (
            <div key={item.label} className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">{item.label}</span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                  item.urgency === "Critical" 
                    ? "bg-rose-50 text-rose-700 border border-rose-100" 
                    : item.urgency === "High" 
                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                    : "bg-indigo-50 text-indigo-750 border border-indigo-100"
                }`}>{item.urgency}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-gray-950">{item.count} tenants</span>
                <button
                  onClick={() => handleDispatchRenewalAlert(item.label, item.count)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer border-none shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Bell className="w-3 h-3" /> {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
