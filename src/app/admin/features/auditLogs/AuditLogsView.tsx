/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  LayoutDashboard, ShieldAlert, AlertTriangle, Download, History, 
  UserCheck, Terminal, Settings2, Trash2, Shield, Network
} from "lucide-react";
import { useAuditLogs } from "./hooks/useAuditLogs";
import { LogsDashboard } from "./components/LogsDashboard";
import { LoginLogsTable } from "./components/LoginLogsTable";
import { ActivityLogsTable } from "./components/ActivityLogsTable";
import { AuditTrailTable } from "./components/AuditTrailTable";
import { SecurityEventsTable } from "./components/SecurityEventsTable";
import { ErrorLogsTable } from "./components/ErrorLogsTable";
import { ExportLogsTable } from "./components/ExportLogsTable";
import { LogRetentionSettings } from "./components/LogRetentionSettings";
import { ApiLogsTable } from "./components/ApiLogsTable";
// ... (Your other component imports remain the same)

type ActiveTab = "dashboard" | "api" | "login" | "activity" | "trail" | "security" | "error" | "export" | "settings";

export default function AuditLogsView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const {
    loginLogs, activityLogs, auditTrails, securityEvents, errorLogs, exportLogs, apiLogs,
    retentionPolicy, stats, loading, organizations, searchQuery, setSearchQuery,
    selectedOrg, setSelectedOrg, selectedStatus, setSelectedStatus, selectedSeverity,
    setSelectedSeverity, selectedModule, setSelectedModule, selectedAction,
    setSelectedAction, dateRange, setDateRange, resolveSecurityEvent,
    updateRetentionPolicy, purgeAuditTrail, filterByDate,
  } = useAuditLogs();

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedOrg("ALL");
    setSelectedStatus("ALL");
    setSelectedSeverity("ALL");
    setSelectedModule("ALL");
    setSelectedAction("ALL");
    setDateRange("ALL");
  };

  const tabsConfig: { id: ActiveTab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "api", label: "API Logs", icon: Network },
    { id: "login", label: "Login Logs", icon: UserCheck },
    { id: "activity", label: "Activity Logs", icon: Terminal },
    { id: "trail", label: "Audit Trail", icon: History },
    { id: "security", label: "Security Events", icon: ShieldAlert },
    { id: "error", label: "Error Logs", icon: AlertTriangle },
    { id: "export", label: "Export Logs", icon: Download },
    { id: "settings", label: "Log Retention", icon: Settings2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600 font-semibold" />
            Compliance Audit Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage platform event logs, API traces, security auditing, and retention policies.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-50 text-rose-750 border border-rose-100 self-start md:self-auto shadow-xs">
          <button onClick={purgeAuditTrail} className="inline-flex items-center gap-1.5 text-rose-700 hover:text-rose-800 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Purge Ledger
          </button>
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === "security" && stats.criticalSecurityEvents > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="space-y-6 pt-2">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-wide">
                {tabsConfig.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Detailed diagnostics workspace for {activeTab} operations.
              </p>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm font-semibold text-gray-500 animate-pulse">Loading secure ledger...</div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
            {activeTab === "dashboard" && <LogsDashboard stats={stats} loginLogs={loginLogs} securityEvents={securityEvents} errorLogs={errorLogs} />}
            {activeTab === "api" && <ApiLogsTable logs={apiLogs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "login" && <LoginLogsTable logs={loginLogs} organizations={organizations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "activity" && <ActivityLogsTable logs={activityLogs} organizations={organizations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} selectedModule={selectedModule} setSelectedModule={setSelectedModule} selectedAction={selectedAction} setSelectedAction={setSelectedAction} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "trail" && <AuditTrailTable trails={auditTrails} organizations={organizations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "security" && <SecurityEventsTable events={securityEvents} organizations={organizations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} selectedSeverity={selectedSeverity} setSelectedSeverity={setSelectedSeverity} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} resolveSecurityEvent={resolveSecurityEvent} />}
            {activeTab === "error" && <ErrorLogsTable logs={errorLogs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedSeverity={selectedSeverity} setSelectedSeverity={setSelectedSeverity} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "export" && <ExportLogsTable logs={exportLogs} organizations={organizations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} dateRange={dateRange} setDateRange={setDateRange} filterByDate={filterByDate} />}
            {activeTab === "settings" && <LogRetentionSettings policy={retentionPolicy} onSavePolicy={updateRetentionPolicy} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}