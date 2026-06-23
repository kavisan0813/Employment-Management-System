/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Download,
  History,
  UserCheck,
  Terminal,
  Settings2,
  Trash2,
  Shield,
  ChevronDown,
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
    filterByDate,
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

  const tabsConfig: { id: ActiveTab; label: string; icon: any; group: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
    { id: "trail", label: "Audit Trail", icon: History, group: "Overview" },
    { id: "login", label: "Login Logs", icon: UserCheck, group: "Access & Activity" },
    { id: "activity", label: "Activity Logs", icon: Terminal, group: "Access & Activity" },
    { id: "export", label: "Export Logs", icon: Download, group: "Access & Activity" },
    { id: "security", label: "Security Events", icon: ShieldAlert, group: "System Security" },
    { id: "error", label: "Error Logs", icon: AlertTriangle, group: "System Security" },
    { id: "settings", label: "Log Retention", icon: Settings2, group: "System Security" },
  ];

  const groups = ["Overview", "Access & Activity", "System Security"] as const;

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
            Real-time event logging registry, credential accesses, and
            configuration mutations globally.
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

      {/* Top Tab Navigation Bar (Grouped on Hover) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs relative">
        <div className="flex items-center gap-2 p-1.5">
          {groups.map((groupName) => {
            const isGroupActive = tabsConfig.some(item => item.group === groupName && item.id === activeTab);
            const activeItemInGroup = tabsConfig.find(item => item.group === groupName && item.id === activeTab);
            
            return (
              <div key={groupName} className="relative group/menu">
                {/* Main Group Button */}
                <button
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isGroupActive
                      ? "bg-indigo-50 text-indigo-750 border-indigo-100"
                      : "bg-transparent text-gray-600 hover:bg-gray-55 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <span>{groupName}</span>
                  {activeItemInGroup && (
                    <span className="text-[10px] text-indigo-650 font-extrabold bg-indigo-100/50 px-1.5 py-0.5 rounded-md ml-1">
                      {activeItemInGroup.label}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover/menu:rotate-180 transition-transform duration-200" />
                </button>

                {/* Hover Dropdown Menu */}
                <div className="absolute left-0 top-full pt-1.5 z-40 hidden group-hover/menu:block min-w-[220px]">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in duration-100">
                    {tabsConfig
                      .filter((item) => item.group === groupName)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-955 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                            <span className="flex-1">{item.label}</span>
                            {item.id === "security" && stats.criticalSecurityEvents > 0 && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0 ml-1.5" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                {tabsConfig.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Detailed compliance log registry for platform {activeTab} operations.
              </p>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
