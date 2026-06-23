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

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeDirection,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down";
  accent: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {change && (
          <span
            className={`text-[10px] font-semibold flex items-center gap-0.5 ${
              changeDirection === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {changeDirection === "up" ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Billing Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Financial overview of subscriptions, invoices, and payments across all organizations.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total MRR"
          value={`$${subStats?.totalRevenue?.toLocaleString() || "0"}`}
          change="+14.2%"
          changeDirection="up"
          accent="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={CreditCard}
          label="Active Subscriptions"
          value={String(subStats?.totalActive || 0)}
          change="+3"
          changeDirection="up"
          accent="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue Collected"
          value={`$${payStats?.totalCollected?.toLocaleString() || "0"}`}
          change="+8.5%"
          changeDirection="up"
          accent="bg-teal-100 text-teal-600"
        />
        <StatCard
          icon={FileText}
          label="Overdue Invoices"
          value={`$${invStats?.totalOverdue?.toLocaleString() || "0"}`}
          changeDirection="down"
          accent="bg-rose-100 text-rose-600"
        />
        <StatCard
          icon={Users}
          label="Total Subscribers"
          value={String(totalSubscribers)}
          accent="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Plan distribution */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              Plan Distribution
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("plans")}
                className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
}

export default BillingDashboard;
