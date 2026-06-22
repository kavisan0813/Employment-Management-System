/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  LayoutDashboard, ShieldAlert, AlertTriangle, ShieldCheck, 
  Download, History, UserCheck, Terminal, Settings2, Trash2, Shield
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

type ActiveTab = 
  | "dashboard"
  | "login"
  | "activity"
  | "trail"
  | "security"
  | "error"
  | "export"
  | "settings";

export default function AuditLogsView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  
  const {
    loginLogs,
    activityLogs,
    auditTrails,
    securityEvents,
    errorLogs,
    exportLogs,
    retentionPolicy,
    stats,
    loading,
    organizations,

    // Filter states
    searchQuery,
    setSearchQuery,
    selectedOrg,
    setSelectedOrg,
    selectedStatus,
    setSelectedStatus,
    selectedSeverity,
    setSelectedSeverity,
    selectedModule,
    setSelectedModule,
    selectedAction,
    setSelectedAction,
    dateRange,
    setDateRange,

    // Actions
    resolveSecurityEvent,
    updateRetentionPolicy,
    purgeAuditTrail,
    filterByDate
  } = useAuditLogs();

  // Reset tab-specific filters when switching tabs
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

  const tabsConfig = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "login", label: "Login Logs", icon: UserCheck },
    { id: "activity", label: "Activity Logs", icon: Terminal },
    { id: "trail", label: "Audit Trail", icon: History },
    { id: "security", label: "Security Events", icon: ShieldAlert },
    { id: "error", label: "Error Logs", icon: AlertTriangle },
    { id: "export", label: "Export Logs", icon: Download },
    { id: "settings", label: "Log Retention", icon: Settings2 },
  ] as const;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-150 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
            <Shield className="w-5.5 h-5.5 text-indigo-600" />
            Compliance Audit Ledger (SOC2)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time event logging registry, credential accesses, and configuration mutations globally.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={purgeAuditTrail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge Logs Ledger
          </button>
        </div>
      </div>

      {/* Main Tabbed Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-60 shrink-0">
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 border-b lg:border-b-0 border-gray-150">
            {tabsConfig.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-2xs" 
                      : "text-gray-600 hover:text-gray-950 hover:bg-gray-55"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {tab.label}
                  
                  {/* Alert notification badge inside tab for security alerts */}
                  {tab.id === "security" && stats.criticalSecurityEvents > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Display Area */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-xs font-medium space-y-2">
              <span className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span>Verifying Soc2 ledger checksums...</span>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200">
              {activeTab === "dashboard" && (
                <LogsDashboard
                  stats={stats}
                  loginLogs={loginLogs}
                  securityEvents={securityEvents}
                  errorLogs={errorLogs}
                />
              )}

              {activeTab === "login" && (
                <LoginLogsTable
                  logs={loginLogs}
                  organizations={organizations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                />
              )}

              {activeTab === "activity" && (
                <ActivityLogsTable
                  logs={activityLogs}
                  organizations={organizations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                  selectedModule={selectedModule}
                  setSelectedModule={setSelectedModule}
                  selectedAction={selectedAction}
                  setSelectedAction={setSelectedAction}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                />
              )}

              {activeTab === "trail" && (
                <AuditTrailTable
                  trails={auditTrails}
                  organizations={organizations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                />
              )}

              {activeTab === "security" && (
                <SecurityEventsTable
                  events={securityEvents}
                  organizations={organizations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                  selectedSeverity={selectedSeverity}
                  setSelectedSeverity={setSelectedSeverity}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                  resolveSecurityEvent={resolveSecurityEvent}
                />
              )}

              {activeTab === "error" && (
                <ErrorLogsTable
                  logs={errorLogs}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedSeverity={selectedSeverity}
                  setSelectedSeverity={setSelectedSeverity}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                />
              )}

              {activeTab === "export" && (
                <ExportLogsTable
                  logs={exportLogs}
                  organizations={organizations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filterByDate={filterByDate}
                />
              )}

              {activeTab === "settings" && (
                <LogRetentionSettings
                  policy={retentionPolicy}
                  onSavePolicy={updateRetentionPolicy}
                />
              )}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
