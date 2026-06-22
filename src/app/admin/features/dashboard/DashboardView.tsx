/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { db } from "../../mockData";
import { Organization, AuditLogEntry } from "../../types";
import { Building2, Users, DollarSign, LifeBuoy, ArrowUpRight, ArrowDownRight, Activity, Calendar } from "lucide-react";

interface DashboardViewProps {
  onNavigate?: (view: string, targetId?: string) => void;
}

export default function DashboardView({ onNavigate = () => {} }: DashboardViewProps) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedRange, setSelectedRange] = useState("30d");

  useEffect(() => {
    setOrgs(db.organizations.get());
    setLogs(db.auditLogs.get().slice(0, 5));
  }, []);

  // Compute platform stats
  const totalOrgs = orgs.length;
  const activeOrgs = orgs.filter(o => o.status === "Active").length;
  const totalUsers = orgs.reduce((acc, curr) => acc + curr.userCount, 0);
  const totalMRR = orgs.reduce((acc, curr) => acc + curr.mrr, 0);
  const trialOrgs = orgs.filter(o => o.status === "Trial").length;

  // Let's build plan distribution data
  const planDistribution = orgs.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.plan] = (acc[curr.plan] || 0) + 1;
    return acc;
  }, {});

  const plans = Object.keys(planDistribution).map(key => ({
    name: key,
    value: planDistribution[key],
    color: key === "Enterprise" ? "#6366F1" : key === "Growth" ? "#3B82F6" : "#10B981"
  }));

  const totalPlanItems = plans.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Live heartbeat metrics of your multi-tenant environment.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50 text-xs font-medium">
            <button
              onClick={() => setSelectedRange("7d")}
              className={`px-3 py-1.5 rounded-md transition-all ${selectedRange === "7d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedRange("30d")}
              className={`px-3 py-1.5 rounded-md transition-all ${selectedRange === "30d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedRange("90d")}
              className={`px-3 py-1.5 rounded-md transition-all ${selectedRange === "90d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              90 Days
            </button>
          </div>
          <button
            onClick={() => {
              const csv = "Metric,Value\nTotal Tenants," + totalOrgs + "\nActive Users," + totalUsers + "\nMonthly Recurring Revenue,$" + totalMRR;
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ems-platform-summary-${selectedRange}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Export Snapshot
          </button>
        </div>
      </div>

      {/* StatsStrip conforming to minimal 1-line label:value styles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Active Tenants</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-gray-950">{activeOrgs}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">{totalOrgs} total Registered</span>
        </div>
        <div className="flex flex-col border-l border-gray-100 pl-4">
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Global Users</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-gray-950">{totalUsers.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">Active cross-tenant sessions</span>
        </div>
        <div className="flex flex-col border-l border-gray-100 pl-4">
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Platform MRR</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-gray-950">${totalMRR.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +9.2%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">USD billed monthly recurring</span>
        </div>
        <div className="flex flex-col border-l border-gray-100 pl-4">
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Trial Accounts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-gray-950">{trialOrgs}</span>
            <span className="text-xs text-amber-600 font-medium flex items-center">
              <Calendar className="w-3 h-3 mr-0.5" /> 14d limit
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">Nurturing funnel prospects</span>
        </div>
      </div>

      {/* Main Content Pane Split */}
     <div className="grid grid-cols-1 gap-6">
  <div className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Recent Tenant Sign-Ups
              </h2>
              <button
                onClick={() => onNavigate("Organizations")}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
              >
                Manage All
              </button>
            </div>
            <div className="divide-y divide-gray-150 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/30 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Tenant Name</th>
                    <th className="px-4 py-3">Representative Domain</th>
                    <th className="px-4 py-3">Pricing Plan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orgs.slice(0, 5).map(org => (
                    <tr
                      key={org.id}
                      onClick={() => onNavigate("Organizations", org.id)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 font-medium text-gray-900 group-hover:text-primary-600 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {org.name.charAt(0)}
                        </div>
                        {org.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{org.domain}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          org.plan === "Enterprise" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                          org.plan === "Growth" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {org.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          org.status === "Active" ? "bg-teal-50 text-teal-700 border border-teal-100" :
                          org.status === "Trial" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          org.status === "Pending" ? "bg-gray-150 text-gray-700" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-400">
                        {new Date(org.joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Core Platform Activities */}
          {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              {/* <h2 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Live Compliance Stream (Audit Trail)
              </h2> */}
            </div>
         {/*    <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50/30 transition-colors flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    log.eventCategory === "Security" ? "bg-rose-50 text-rose-600" :
                    log.eventCategory === "Billing" ? "bg-emerald-50 text-emerald-600" :
                    log.eventCategory === "Auth" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                  }`}> */}
                   {/*  <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0"> */}
                    {/* <div className="flex items-center justify-between gap-2"> */}
                      {/* <p className="text-xs font-semibold text-gray-900">
                        {log.event} &middot; <span className="text-gray-400 font-normal">{log.eventCategory}</span>
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      Performed by <span className="font-semibold text-gray-700">{log.actor}</span> ({log.actorType})
                      {log.organization ? ` for ${log.organization}` : " (Platform Level)"}
                    </p> */}
                    {/* Render quick snippet metadata */}
                   {/*  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {Object.entries(log.metadata).map(([k, v]) => (
                        <span key={k} className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-[9px] font-mono text-gray-600">
                          {k}: {String(v)}
                        </span>
                      ))}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        log.result === "Active" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {log.result === "Active" ? "SUCCESS" : "FAILED"}
                      </span>
                    </div>
                  </div>
                </div>
              ))} */}
            
           {/*  <div className="p-3 bg-gray-50/30 border-t border-gray-100 text-center">
             
            </div> */}
         

        {/* Right Column: Interactive Circular Share Diagram */}
      {/*   <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
           {/*  <h2 className="text-sm font-semibold text-gray-950 mb-4 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Subscription Revenue Mix
            </h2> */}

            {/* Render a beautiful SVG Pie/Donut Chart manually for ultra safety and custom UI design */}
            
                {/* Center text for donut chart */}
              

             

          
        </div>
      </div>
  
  );
}
