/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReports } from "./hooks/useReports";
import { DashboardOverview } from "./components/DashboardOverview";
import { OrganizationReportsView } from "./components/OrganizationReportsView";
import { SubscriptionReportsView } from "./components/SubscriptionReportsView";
import { RevenueReportsView } from "./components/RevenueReportsView";
import { CustomReportsView } from "./components/CustomReportsView";
import { ExportCenterView } from "./components/ExportCenterView";
import {
  AreaChart,
  LayoutDashboard,
  Building2,
  Calendar,
  CreditCard,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
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
    triggerAlert,
    handleCompileCustomReport,
    handleCreateExport,
    handleDeleteExport,
  } = useReports();

  // Sub-Navigation Configuration
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      group: "Overview",
    },

    {
      id: "organizations",
      label: "Organization Reports",
      icon: Building2,
      group: "Metrics Panels",
    },

    {
      id: "subscriptions",
      label: "Subscription Reports",
      icon: Calendar,
      group: "Metrics Panels",
    },
    {
      id: "revenue",
      label: "Revenue Reports",
      icon: CreditCard,
      group: "Metrics Panels",
    },

    {
      id: "exports",
      label: "Export Center",
      icon: Download,
      group: "Action Centers",
    },
  ] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case "organizations":
        return <OrganizationReportsView />;
      case "subscriptions":
        return <SubscriptionReportsView />;
      case "revenue":
        return <RevenueReportsView />;
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
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
            alertType === "success"
              ? "bg-teal-50 border-teal-200 text-teal-800"
              : alertType === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : alertType === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-indigo-50 border-indigo-200 text-indigo-800"
          }`}
        >
          {alertType === "success" && (
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          )}
          {alertType === "error" && (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          {alertType === "warning" && (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          {alertType === "info" && (
            <Info className="w-5 h-5 text-indigo-650 shrink-0" />
          )}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <AreaChart className="w-6 h-6 text-indigo-650 font-semibold" />
            Reports & Analytics
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Super Admin operational intelligence hub. Track organization growth
            velocity, active staff metrics, subscription conversion trends, and
            system request analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Analytics Pipeline Active
        </div>
      </div>

      {/* Flat Tab Navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render block */}
      <div className="p-6">{renderActiveTabContent()}</div>
    </div>
  );
}

export default ReportsView;
