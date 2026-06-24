/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useInvoices } from "../hooks/useInvoices";
import { usePayments } from "../hooks/usePayments";
import { usePlans } from "../hooks/usePlans";
import { SubscriptionService } from "../services/subscription.service";

type BillingTab = "overview" | "plans" | "subscriptions" | "invoices" | "payments" | "renewals";

interface BillingDashboardProps {
  onNavigateTab?: (tab: BillingTab) => void;
}

export function BillingDashboard({ onNavigateTab }: BillingDashboardProps) {
  const { stats: subStats } = useSubscriptions();
  const { stats: invStats } = useInvoices();
  const { stats: payStats } = usePayments();
  const { plans } = usePlans();
  const renewals = SubscriptionService.getRenewalsUpcoming(30);

  const activePlans = plans.filter((p) => p.status === "Active");
  const totalSubscribers = activePlans.reduce((sum, p) => sum + p.subscriberCount, 0);

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium">
      
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Billing Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            A comprehensive overview of billing performance, active plans, and upcoming renewals.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="p-6 bg-white/50 border-b border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[
            { label: "Total MRR", val: `$${subStats?.totalRevenue?.toLocaleString() || "0"}`, sub: "Monthly recurring", change: "+14.2%", changeDirection: "up", icon: TrendingUp, bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-900" },
            { label: "Active Subscriptions", val: String(subStats?.totalActive || 0), sub: "Currently active", change: "+3", changeDirection: "up", icon: CreditCard, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900" },
            { label: "Revenue Collected", val: `$${payStats?.totalCollected?.toLocaleString() || "0"}`, sub: "Successfully processed", change: "+8.5%", changeDirection: "up", icon: DollarSign, bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-900" },
            { label: "Overdue Invoices", val: `$${invStats?.totalOverdue?.toLocaleString() || "0"}`, sub: "Requires attention", changeDirection: "down", icon: FileText, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-900" },
            { label: "Total Subscribers", val: String(totalSubscribers), sub: "Across all active plans", icon: Users, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-900" }
          ].map(m => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={`${m.bg} ${m.border} border rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between h-32`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${m.text} opacity-70`}>{m.label}</span>
                  <div className="flex flex-col items-end gap-2">
                    <Icon className={`w-4 h-4 ${m.text}`} />
                    {m.change && (
                      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                        m.changeDirection === "up" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {m.changeDirection === "up" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {m.change}
                      </span>
                    )}
                  </div>
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

      {/* Main Content Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-semibold">
        {/* Plan distribution */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs font-semibold">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              Plan Distribution
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("plans")}
                className="text-[10px] font-semibold font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View All →
              </button>
            )}
          </div>
          <div className="p-4 space-y-3">
            {activePlans.map((plan) => {
              const pct = totalSubscribers > 0 ? (plan.subscriberCount / totalSubscribers) * 100 : 0;
              const barColor =
                plan.tier === "Enterprise"
                  ? "bg-amber-500"
                  : plan.tier === "Growth"
                    ? "bg-blue-500"
                    : "bg-emerald-500";
              return (
                <div key={plan.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">{plan.name}</span>
                    <span className="text-gray-400">
                      {plan.subscriberCount} orgs · ${plan.monthlyPrice.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming renewals */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs font-semibold">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Upcoming Renewals (30 days)
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("renewals")}
                className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View All →
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {renewals.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">
                No renewals in the next 30 days.
              </div>
            ) : (
              renewals.slice(0, 5).map((sub) => {
                const daysLeft = Math.ceil(
                  (new Date(sub.renewalDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={sub.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{sub.organizationName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {sub.planTier} · {sub.billingCycle} · ${sub.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-600">{sub.renewalDate}</p>
                      <span
                        className={`text-[10px] font-semibold ${
                          daysLeft <= 7
                            ? "text-rose-600"
                            : daysLeft <= 14
                              ? "text-amber-600"
                              : "text-gray-400"
                        }`}
                      >
                        {daysLeft <= 7 && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />}
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick metrics strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Revenue / Org</span>
          <p className="text-lg font-bold text-gray-900 mt-1.5">
            ${Math.round(subStats?.avgRevenuePerOrg || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Churn Rate</span>
          <p className="text-lg font-bold text-rose-600 mt-1.5">
            {(subStats?.churnRate || 0).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Success</span>
          <p className="text-lg font-bold text-emerald-600 mt-1.5">
            {(payStats?.successRate || 0).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Invoices</span>
          <p className="text-lg font-bold text-amber-600 mt-1.5">
            ${invStats?.totalPending?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default BillingDashboard;
