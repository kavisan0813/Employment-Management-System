/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, Users, CreditCard, AlertTriangle, CheckCircle2, 
  ArrowRight, ShieldAlert, BarChart3, LineChart, Activity, Calendar
} from "lucide-react";

interface DashboardOverviewProps {
  setActiveTab: (tab: any) => void;
}

export function DashboardOverview({ setActiveTab }: DashboardOverviewProps) {
  const kpis = [
    {
      id: "organizations",
      label: "Total Organizations",
      value: "500",
      subText: "Active: 450 | Trial: 30 | Suspended: 20",
      icon: Building2,
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
      tab: "organizations"
    },
    {
      id: "employees",
      label: "Total Employees",
      value: "50,000",
      subText: "Active: 47,000 | Inactive: 3,000",
      icon: Users,
      color: "bg-teal-50 text-teal-700 border-teal-100",
      tab: "employees"
    },
    {
      id: "revenue",
      label: "Monthly Revenue",
      value: "₹10,00,000",
      subText: "MRR: ₹10L | ARR: ₹1.2Cr (SaaS Growth)",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      tab: "revenue"
    },
    {
      id: "expiry",
      label: "Expiring Subscriptions",
      value: "20 Alerts",
      subText: "Upcoming renewals next 30 days",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-700 border-amber-100",
      tab: "subscriptions"
    },
    {
      id: "compliance",
      label: "Attendance Usage",
      value: "95%",
      subText: "Daily Compliance & Punch-In Success",
      icon: CheckCircle2,
      color: "bg-sky-50 text-sky-700 border-sky-100",
      tab: "attendance"
    }
  ] as const;

  const quickLinks = [
    { label: "Organization Growth Trends", desc: "View tenant signup metrics and industry charts.", icon: Building2, tab: "organizations" },
    { label: "Attrition Rate & Demographics", desc: "Evaluate headcount growth and resignations analytics.", icon: Users, tab: "employees" },
    { label: "MRR & Plan-wise Ledger", desc: "Track income distributions and refunds lists.", icon: CreditCard, tab: "revenue" },
    { label: "Login & Module System Usage", desc: "DAU/MAU ratios, browser breakdown, and storage usage.", icon: Activity, tab: "usage" },
    { label: "Custom Query Dynamic Report", desc: "Compile dynamic grids with organization filters.", icon: BarChart3, tab: "custom" },
    { label: "Executive CEO Dashboard", desc: "Check CLV, CAC, Churn rate, and renewals parameters.", icon: ShieldAlert, tab: "executive" }
  ] as const;

  return (
    <div className="space-y-8">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id} 
              onClick={() => setActiveTab(kpi.tab)}
              className="bg-white border border-gray-200 hover:border-indigo-400 rounded-2xl p-5 shadow-xs transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-950 tracking-tight">{kpi.value}</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">{kpi.subText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Panel */}
      <div className="bg-gray-50/50 border border-gray-200/80 rounded-2xl p-6">
        <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-4">Quick Link Navigation Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.tab)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-150 rounded-xl hover:border-indigo-500 transition-all hover:shadow-xs text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-650 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-indigo-650 transition-colors">{link.label}</h5>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">{link.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
