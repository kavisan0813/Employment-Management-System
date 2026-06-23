/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertCircle, AlertTriangle, ShieldAlert, Coins, RefreshCw, Lock, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { NotificationState, SystemAlert, FailedPaymentAlert, SecurityAlert } from "../types/notifications.types";

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
  
  // Calculate metric values
  const totalAlertsCount = state.systemAlerts.filter(a => !a.acknowledged).length + 
                           state.securityAlerts.filter(a => a.actionTaken === "none").length +
                           state.failedPayments.filter(p => !p.resolved).length;
                           
  const criticalCount = state.systemAlerts.filter(a => a.severity === "critical" && !a.acknowledged).length +
                        state.securityAlerts.filter(a => a.severity === "critical" && a.actionTaken === "none").length;
                        
  const failedPaymentsCount = state.failedPayments.filter(p => !p.resolved).length;
  const expiringCount = state.expiryAlerts.filter(a => a.daysLeft <= 7).length;

  // Gather recent warnings/critical alerts (limit to 5)
  const recentCriticals: Array<{
    id: string;
    source: "system" | "security" | "payment" | "expiry";
    title: string;
    description: string;
    severity: "critical" | "high" | "warning";
    time: string;
    rawItem: any;
  }> = [];

  state.systemAlerts
    .filter(a => !a.acknowledged && (a.severity === "critical" || a.severity === "warning"))
    .forEach(a => {
      recentCriticals.push({
        id: a.id,
        source: "system",
        title: a.alertName,
        description: a.description,
        severity: a.severity === "critical" ? "critical" : "warning",
        time: a.timestamp,
        rawItem: a
      });
    });

  state.securityAlerts
    .filter(a => a.actionTaken === "none" && (a.severity === "critical" || a.severity === "high"))
    .forEach(a => {
      recentCriticals.push({
        id: a.id,
        source: "security",
        title: a.reason,
        description: `Threat detected for user ${a.userEmail} at ${a.location}`,
        severity: a.severity === "critical" ? "critical" : "high",
        time: a.timestamp,
        rawItem: a
      });
    });

  state.failedPayments
    .filter(p => !p.resolved)
    .forEach(p => {
      recentCriticals.push({
        id: p.id,
        source: "payment",
        title: `Failed Payment: ${p.amount}`,
        description: `Invoice ${p.invoiceId} failed for ${p.orgName} (${p.reason})`,
        severity: "warning",
        time: p.date,
        rawItem: p
      });
    });

  state.expiryAlerts
    .filter(e => e.daysLeft <= 7)
    .forEach(e => {
      recentCriticals.push({
        id: e.id,
        source: "expiry",
        title: `Subscription Expiring: ${e.daysLeft} Days Left`,
        description: `${e.orgName} will expire on ${e.expiryDate}. Status is ${e.status.toUpperCase()}.`,
        severity: e.daysLeft === 0 ? "critical" : "warning",
        time: new Date().toISOString(), // Mock time
        rawItem: e
      });
    });

  // Sort by time descending
  recentCriticals.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const criticalFeed = recentCriticals.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Active Warnings */}
        <div 
          onClick={() => setActiveTab("system")}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-indigo-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Unresolved Warnings</span>
            <span className="text-2xl font-black text-gray-900 leading-tight">{totalAlertsCount}</span>
          </div>
        </div>

        {/* Critical Alerts */}
        <div 
          onClick={() => setActiveTab("security")}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-rose-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Critical Threats</span>
            <span className="text-2xl font-black text-rose-750 leading-tight">{criticalCount}</span>
          </div>
        </div>

        {/* Failed Payments */}
        <div 
          onClick={() => setActiveTab("failedPayments")}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Failed Payments</span>
            <span className="text-2xl font-black text-gray-900 leading-tight">{failedPaymentsCount}</span>
          </div>
        </div>

        {/* Expiring Subscriptions */}
        <div 
          onClick={() => setActiveTab("expiry")}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-orange-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Expiring in 7 Days</span>
            <span className="text-2xl font-black text-gray-900 leading-tight">{expiringCount}</span>
          </div>
        </div>

      </div>

      {/* Main content grid: Critical alerts feed + system summary panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns: Critical Warnings feed */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-gray-950 uppercase tracking-wider">Urgent Real-Time Alert Stream</h3>
            <p className="text-[11px] text-gray-450 font-semibold mt-0.5">Real-time alerts requiring immediate operator check or remediation actions.</p>
          </div>

          <div className="space-y-3.5">
            {criticalFeed.map(alert => {
              return (
                <div 
                  key={`${alert.source}-${alert.id}`} 
                  className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    alert.severity === "critical" 
                      ? "bg-rose-50/20 border-rose-150" 
                      : alert.severity === "high"
                      ? "bg-orange-50/15 border-orange-200"
                      : "bg-amber-50/15 border-amber-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded border ${
                        alert.severity === "critical"
                          ? "bg-rose-50 border-rose-200 text-rose-700"
                          : alert.severity === "high"
                          ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {new Date(alert.time).toLocaleTimeString()} &middot; {alert.source.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-gray-900 leading-snug">{alert.title}</h4>
                    <p className="text-[11px] text-gray-500 font-semibold">{alert.description}</p>
                  </div>

                  {/* Context Actions */}
                  <div className="flex gap-1.5 shrink-0 self-start md:self-center">
                    {alert.source === "system" && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 bg-white border border-gray-250 hover:bg-gray-50 text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.source === "payment" && (
                      <>
                        <button
                          onClick={() => onRetryPayment(alert.id)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry Payment
                        </button>
                      </>
                    )}

                    {alert.source === "security" && (
                      <>
                        <button
                          onClick={() => onSecurityAction(alert.id, "warned")}
                          className="px-2.5 py-1 bg-white border border-gray-250 hover:bg-gray-55 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Warn User
                        </button>
                        <button
                          onClick={() => onSecurityAction(alert.id, "locked")}
                          className="px-2.5 py-1 bg-rose-650 hover:bg-rose-750 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Lock className="w-3 h-3" /> Lock Account
                        </button>
                      </>
                    )}

                    {alert.source === "expiry" && (
                      <button
                        onClick={() => onSendReminder(alert.id)}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Mail className="w-3 h-3" /> Notify Org
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {criticalFeed.length === 0 && (
              <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl flex flex-col justify-center items-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-800">Operational Integrity Active</span>
                <p className="text-[10px] text-gray-400 font-semibold">All nodes reporting within bounds. Zero critical threats detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns: Alert summaries & quick template navigation */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Summary Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Outbound Channels Health</h3>
            
            <div className="space-y-3 text-xs font-semibold text-gray-700">
              <div className="flex justify-between items-center">
                <span>In-App Center</span>
                <span className="text-emerald-600 font-bold">99.9% Delivered</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "99.9%" }} />
              </div>

              <div className="flex justify-between items-center">
                <span>Email SMTP Relay</span>
                <span className="text-emerald-600 font-bold">98.2% Sent</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98.2%" }} />
              </div>

              <div className="flex justify-between items-center">
                <span>SMS Gateway</span>
                <span className="text-amber-600 font-bold">94.7% Delivery</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "94.7%" }} />
              </div>
            </div>
            
            <button
              onClick={() => setActiveTab("channels")}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border border-indigo-100"
            >
              Analyze Channel Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Rules Check information */}
          <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-650" />
              SaaS Threat Mitigation Policy
            </h4>
            <p className="text-[11px] text-indigo-800 leading-relaxed font-semibold">
              EMS Engine monitors login attempts globally. If a user exceeds 10 failed login attempts, the system generates a warning and allows the operator to lock the account immediately.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
