/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertCircle, AlertTriangle, ShieldAlert, Coins, RefreshCw, Lock, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { NotificationState } from "../types/notifications.types";

interface Props {
  state: NotificationState;
  onAcknowledgeAlert: (id: string) => void;
  onRetryPayment: (id: string) => void;
  onSecurityAction: (id: string, action: "warned" | "locked") => void;
  onSendReminder: (id: string) => void;
  setActiveTab: (tab: any) => void;
}

export function NotificationsDashboard({
  state,
  onAcknowledgeAlert,
  onRetryPayment,
  onSecurityAction,
  onSendReminder,
  setActiveTab
}: Props) {
  
  const totalAlertsCount = state.systemAlerts.filter(a => !a.acknowledged).length + 
                           state.securityAlerts.filter(a => a.actionTaken === "none").length +
                           state.failedPayments.filter(p => !p.resolved).length;
                           
  const criticalCount = state.systemAlerts.filter(a => a.severity === "critical" && !a.acknowledged).length +
                        state.securityAlerts.filter(a => a.severity === "critical" && a.actionTaken === "none").length;
                        
  const failedPaymentsCount = state.failedPayments.filter(p => !p.resolved).length;
  const expiringCount = state.expiryAlerts.filter(a => a.daysLeft <= 7).length;

  const recentCriticals: Array<{ id: string; source: "system" | "security" | "payment" | "expiry"; title: string; description: string; severity: "critical" | "high" | "warning"; time: string; }> = [];

  state.systemAlerts.filter(a => !a.acknowledged && (a.severity === "critical" || a.severity === "warning")).forEach(a => {
    recentCriticals.push({ id: a.id, source: "system", title: a.alertName, description: a.description, severity: a.severity === "critical" ? "critical" : "warning", time: a.timestamp });
  });

  state.securityAlerts.filter(a => a.actionTaken === "none" && (a.severity === "critical" || a.severity === "high")).forEach(a => {
    recentCriticals.push({ id: a.id, source: "security", title: a.reason, description: `Threat detected for user ${a.userEmail} at ${a.location}`, severity: a.severity === "critical" ? "critical" : "high", time: a.timestamp });
  });

  state.failedPayments.filter(p => !p.resolved).forEach(p => {
    recentCriticals.push({ id: p.id, source: "payment", title: `Failed Payment: ${p.amount}`, description: `Invoice ${p.invoiceId} failed for ${p.orgName} (${p.reason})`, severity: "warning", time: p.date });
  });

  state.expiryAlerts.filter(e => e.daysLeft <= 7).forEach(e => {
    recentCriticals.push({ id: e.id, source: "expiry", title: `Subscription Expiring: ${e.daysLeft} Days Left`, description: `${e.orgName} will expire on ${e.expiryDate}.`, severity: e.daysLeft === 0 ? "critical" : "warning", time: new Date().toISOString() });
  });

  recentCriticals.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const criticalFeed = recentCriticals.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Unresolved Warnings", val: totalAlertsCount, icon: AlertTriangle, tab: "system", color: "indigo" },
          { label: "Critical Threats", val: criticalCount, icon: ShieldAlert, tab: "security", color: "rose" },
          { label: "Failed Payments", val: failedPaymentsCount, icon: Coins, tab: "failedPayments", color: "amber" },
          { label: "Expiring in 7 Days", val: expiringCount, icon: AlertCircle, tab: "expiry", color: "orange" }
        ].map((kpi, idx) => (
          <div key={idx} onClick={() => setActiveTab(kpi.tab)} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-indigo-400 transition-all flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-gray-500 block tracking-wider">{kpi.label}</span>
              <span className="text-2xl font-semibold text-gray-800 leading-tight">{kpi.val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alerts feed */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Urgent Real-Time Alert Stream</h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">Real-time alerts requiring immediate operator check or remediation actions.</p>
          </div>

          <div className="space-y-3.5">
            {criticalFeed.map(alert => (
              <div key={alert.id} className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${alert.severity === "critical" ? "bg-rose-50/20 border-rose-100" : "bg-amber-50/15 border-amber-100"}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border ${alert.severity === "critical" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {new Date(alert.time).toLocaleTimeString()} &middot; {alert.source.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-700">{alert.title}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">{alert.description}</p>
                </div>

                <div className="flex gap-1.5 shrink-0 self-start md:self-center">
                  {alert.source === "system" && <button onClick={() => onAcknowledgeAlert(alert.id)} className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-medium rounded-lg">Acknowledge</button>}
                  {alert.source === "payment" && <button onClick={() => onRetryPayment(alert.id)} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-medium rounded-lg flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Retry</button>}
                  {alert.source === "security" && (
                    <>
                      <button onClick={() => onSecurityAction(alert.id, "warned")} className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-medium rounded-lg">Warn</button>
                      <button onClick={() => onSecurityAction(alert.id, "locked")} className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-medium rounded-lg flex items-center gap-1"><Lock className="w-3 h-3" /> Lock</button>
                    </>
                  )}
                  {alert.source === "expiry" && <button onClick={() => onSendReminder(alert.id)} className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-medium rounded-lg flex items-center gap-1"><Mail className="w-3 h-3" /> Notify</button>}
                </div>
              </div>
            ))}

            {criticalFeed.length === 0 && (
              <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <span className="text-xs font-semibold text-emerald-700 block mt-2">Operational Integrity Active</span>
                <p className="text-[10px] text-gray-400 font-medium">All nodes reporting within bounds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Outbound Channels Health</h3>
            <div className="space-y-4 text-xs font-medium text-gray-600">
              {[{ l: "In-App Center", v: "99.9%" }, { l: "Email SMTP Relay", v: "98.2%" }, { l: "SMS Gateway", v: "94.7%" }].map((ch, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between"><span>{ch.l}</span><span className="font-medium text-emerald-600">{ch.v}</span></div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-emerald-500 h-full rounded-full" style={{ width: ch.v }} /></div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab("channels")} className="w-full py-2 bg-indigo-50 text-indigo-700 text-[10px] font-medium rounded-xl border border-indigo-100">Analyze Analytics <ArrowUpRight className="w-3.5 h-3.5 inline" /></button>
          </div>

          <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-5 space-y-2">
            <h4 className="text-sm font-semibold text-indigo-700">SaaS Threat Mitigation</h4>
            <p className="text-[11px] text-indigo-800 font-medium leading-relaxed">EMS Engine monitors login attempts globally. Suspicious patterns trigger immediate operator alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}