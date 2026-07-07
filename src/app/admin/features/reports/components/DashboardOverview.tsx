/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Activity,
} from "lucide-react";

interface DashboardOverviewProps {
  setActiveTab: (
    tab:
      | "dashboard"
      | "organizations"
      | "subscriptions"
      | "revenue"
      | "custom"
      | "exports"
      | "executive"
      | "employees"
      | "usage",
  ) => void;
}

export function DashboardOverview({ setActiveTab }: DashboardOverviewProps) {
  // Added 'bg' and 'border' classes to each KPI for color-coded containers
  const kpis = [
    {
      id: "organizations",
      label: "Total Organizations",
      value: "500",
      subText: "Active: 450 | Trial: 30",
      icon: Building2,
      color: "text-indigo-600 bg-white",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      tab: "organizations",
    },
    {
      id: "employees",
      label: "Total Employees",
      value: "50,000",
      subText: "Active: 47,000 | Inactive: 3,000",
      icon: Users,
      color: "text-teal-600 bg-white",
      bg: "bg-teal-50/50",
      border: "border-teal-100",
      tab: "employees",
    },
    {
      id: "revenue",
      label: "Monthly Revenue",
      value: "₹10,00,000",
      subText: "MRR: ₹10L | ARR: ₹1.2Cr",
      icon: CreditCard,
      color: "text-emerald-600 bg-white",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      tab: "revenue",
    },
    {
      id: "expiry",
      label: "Expiring Subs",
      value: "20 Alerts",
      subText: "Upcoming renewals (30d)",
      icon: AlertTriangle,
      color: "text-amber-600 bg-white",
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      tab: "subscriptions",
    },
  ] as const;

  const quickLinks = [
    {
      label: "Organization Growth",
      desc: "View tenant signup metrics.",
      icon: Building2,
      tab: "organizations",
    },
    {
      label: "Attrition Analytics",
      desc: "Headcount and resignation data.",
      icon: Users,
      tab: "employees",
    },
    {
      label: "MRR & Revenue Ledger",
      desc: "Income and refund distributions.",
      icon: CreditCard,
      tab: "revenue",
    },
    {
      label: "System Usage",
      desc: "DAU/MAU ratios and storage.",
      icon: Activity,
      tab: "usage",
    },
    {
      label: "Dynamic Reporting",
      desc: "Custom organization filters.",
      icon: BarChart3,
      tab: "custom",
    },
    {
      label: "Executive Dashboard",
      desc: "CLV, CAC, Churn, and renewals.",
      icon: ShieldAlert,
      tab: "executive",
    },
  ] as const;

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            High-level metrics and quick navigation links.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={() => setActiveTab(kpi.tab)}
                className={`${kpi.bg} ${kpi.border} border hover:border-indigo-300 rounded-xl p-5 shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-lg ${kpi.color} shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {kpi.value}
                  </h4>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    {kpi.subText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Navigation Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-5">
            Quick Link Directory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => setActiveTab(link.tab)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 rounded-xl transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-indigo-600 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 group-hover:text-indigo-800">
                        {link.label}
                      </h5>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {link.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
