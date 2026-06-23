/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useReports } from "./hooks/useReports";

// Import Modular Sub-components
import { DashboardOverview } from "./components/DashboardOverview";
import { OrganizationReportsView } from "./components/OrganizationReportsView";
import { EmployeeStatisticsView } from "./components/EmployeeStatisticsView";
import { AttendanceAnalyticsView } from "./components/AttendanceAnalyticsView";
import { SubscriptionReportsView } from "./components/SubscriptionReportsView";
import { RevenueReportsView } from "./components/RevenueReportsView";
import { SystemUsageReportsView } from "./components/SystemUsageReportsView";
import { CustomReportsView } from "./components/CustomReportsView";
import { ScheduledReportsView } from "./components/ScheduledReportsView";
import { ExportCenterView } from "./components/ExportCenterView";
import { ExecutiveDashboardView } from "./components/ExecutiveDashboardView";

// Import Lucide Icons
import {
  AreaChart,
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  Calendar,
  CreditCard,
  Activity,
  Sliders,
  BellRing,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown
} from "lucide-react";

export function ReportsView() {
  const {
    state,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    customFilters,
    setCustomFilters,
    customReportResult,
    schedTemplateId,
    setSchedTemplateId,
    schedFrequency,
    setSchedFrequency,
    schedEmail,
    setSchedEmail,
    triggerAlert,
    handleCompileCustomReport,
    handleCreateExport,
    handleDeleteExport,
    handleCreateSchedule,
    handleToggleSchedule,
    handleDeleteSchedule
  } = useReports();

  // Sub-Navigation Configuration
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
    { id: "executive", label: "Executive Dashboard", icon: ShieldCheck, group: "Overview" },
    
    { id: "organizations", label: "Organization Reports", icon: Building2, group: "Metrics Panels" },
    { id: "employees", label: "Employee Statistics", icon: Users, group: "Metrics Panels" },
    { id: "attendance", label: "Attendance Analytics", icon: Clock, group: "Metrics Panels" },
    { id: "subscriptions", label: "Subscription Reports", icon: Calendar, group: "Metrics Panels" },
    { id: "revenue", label: "Revenue Reports", icon: CreditCard, group: "Metrics Panels" },
    { id: "usage", label: "System Usage Reports", icon: Activity, group: "Metrics Panels" },
    
    { id: "custom", label: "Custom Reports", icon: Sliders, group: "Action Centers" },
    { id: "scheduled", label: "Scheduled Reports", icon: BellRing, group: "Action Centers" },
    { id: "exports", label: "Export Center", icon: Download, group: "Action Centers" }
  ] as const;

  const groups = ["Overview", "Metrics Panels", "Action Centers"] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case "executive":
        return <ExecutiveDashboardView />;
      case "organizations":
        return <OrganizationReportsView />;
      case "employees":
        return <EmployeeStatisticsView />;
      case "attendance":
        return <AttendanceAnalyticsView />;
      case "subscriptions":
        return <SubscriptionReportsView triggerAlert={triggerAlert} />;
      case "revenue":
        return <RevenueReportsView />;
      case "usage":
        return <SystemUsageReportsView />;
      case "custom":
        return (
          <CustomReportsView
            customFilters={customFilters}
            setCustomFilters={setCustomFilters}
            customReportResult={customReportResult}
            handleCompileCustomReport={handleCompileCustomReport}
            handleCreateExport={handleCreateExport}
          />
        );
      case "scheduled":
        return (
          <ScheduledReportsView
            state={state}
            schedTemplateId={schedTemplateId}
            setSchedTemplateId={setSchedTemplateId}
            schedFrequency={schedFrequency}
            setSchedFrequency={setSchedFrequency}
            schedEmail={schedEmail}
            setSchedEmail={setSchedEmail}
            handleCreateSchedule={handleCreateSchedule}
            handleToggleSchedule={handleToggleSchedule}
            handleDeleteSchedule={handleDeleteSchedule}
          />
        );
      case "exports":
        return (
          <ExportCenterView
            state={state}
            handleDeleteExport={handleDeleteExport}
            triggerAlert={triggerAlert}
          />
        );
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Dynamic Feedback Banner */}
      {showAlert && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          alertType === "success" 
            ? "bg-teal-50 border-teal-200 text-teal-800" 
            : alertType === "error" 
            ? "bg-rose-50 border-rose-200 text-rose-800" 
            : alertType === "warning"
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-indigo-50 border-indigo-200 text-indigo-800"
        }`}>
          {alertType === "success" && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
          {alertType === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {alertType === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
          {alertType === "info" && <Info className="w-5 h-5 text-indigo-650 shrink-0" />}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-2">
            <AreaChart className="w-6 h-6 text-indigo-650" />
            Reports & Analytics
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Super Admin operational intelligence hub. Track organization growth velocity, active staff metrics, subscription conversion trends, and system request analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Analytics Pipeline Active
        </div>
      </div>

      {/* Top Tab Navigation Bar (Grouped on Hover) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs relative">
        <div className="flex items-center gap-2 p-1.5">
          {groups.map((groupName) => {
            const isGroupActive = navItems.some(item => item.group === groupName && item.id === activeTab);
            const activeItemInGroup = navItems.find(item => item.group === groupName && item.id === activeTab);
            
            return (
              <div key={groupName} className="relative group/menu">
                {/* Main Group Button */}
                <button
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isGroupActive
                      ? "bg-indigo-50 text-indigo-750 border-indigo-100"
                      : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
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
                    {navItems
                      .filter((item) => item.group === groupName)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-950 hover:bg-gray-55"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                            <span>{item.label}</span>
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
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Detailed analytics summary panel for platform {activeTab} operations.
              </p>
            </div>
          </div>

          {/* Render block */}
          <div className="p-6">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;
