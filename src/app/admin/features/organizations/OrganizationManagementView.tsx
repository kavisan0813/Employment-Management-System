import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  CreditCard, 
  Settings, 
  Activity, 
  Database, 
  Receipt,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { useOrganizations } from "./hooks/useOrganizations";

// Placeholders for Global Components
import { AllOrganizationsTable } from "./components/AllOrganizationsTable";
import { AddOrganizationForm } from "./components/AddOrganizationForm";
import { SubscriptionPlansTable } from "./components/SubscriptionPlansTable";

// Placeholders for Org-Specific Components
import { OrganizationProfile } from "./components/OrganizationProfile";
import { OrganizationStatus } from "./components/OrganizationStatus";
import { OrganizationSettings } from "./components/OrganizationSettings";
import { OrgActivityLogs } from "./components/OrgActivityLogs";
import { StorageUsage } from "./components/StorageUsage";
import { BillingHistory } from "./components/BillingHistory";

type GlobalTab = "all" | "add" | "plans";
type OrgTab = "profile" | "status" | "settings" | "logs" | "storage" | "billing";

export function OrganizationManagementView() {
  const hook = useOrganizations();
  const [activeGlobalTab, setActiveGlobalTab] = useState<GlobalTab>("all");
  const [activeOrgTab, setActiveOrgTab] = useState<OrgTab>("profile");

  // Determine what to render
  const renderContent = () => {
    if (hook.activeOrgId) {
      // Org Context
      switch (activeOrgTab) {
        case "profile":
          return <OrganizationProfile org={hook.activeOrg!} />;
        case "status":
          return <OrganizationStatus org={hook.activeOrg!} hook={hook} />;
        case "settings":
          return <OrganizationSettings org={hook.activeOrg!} />;
        case "logs":
          return <OrgActivityLogs org={hook.activeOrg!} />;
        case "storage":
          return <StorageUsage org={hook.activeOrg!} />;
        case "billing":
          return <BillingHistory org={hook.activeOrg!} />;
        default:
          return <OrganizationProfile org={hook.activeOrg!} />;
      }
    } else {
      // Global Context
      switch (activeGlobalTab) {
        case "all":
          return <AllOrganizationsTable hook={hook} />;
        case "add":
          return <AddOrganizationForm onSuccess={() => { hook.actions.loadData(); setActiveGlobalTab("all"); }} />;
        case "plans":
          return <SubscriptionPlansTable />;
        default:
          return <AllOrganizationsTable hook={hook} />;
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col relative z-10 shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">Organizations</h2>
              <p className="text-[10px] font-medium text-indigo-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Context Selector */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Context Focus
          </label>
          <select
            value={hook.activeOrgId || "global"}
            onChange={(e) => {
              if (e.target.value === "global") {
                hook.setActiveOrgId(null);
                setActiveGlobalTab("all");
              } else {
                hook.setActiveOrgId(e.target.value);
                setActiveOrgTab("profile");
              }
            }}
            className="w-full bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-indigo-500 shadow-sm transition-colors cursor-pointer"
          >
            <option value="global">Global Platform View</option>
            <optgroup label="Manage Tenant">
              {hook.orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {!hook.activeOrgId ? (
            <>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">
                Global Operations
              </div>
              <button
                onClick={() => setActiveGlobalTab("all")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeGlobalTab === "all"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Building2 className="w-4 h-4" /> All Organizations
              </button>
              <button
                onClick={() => setActiveGlobalTab("add")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeGlobalTab === "add"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Plus className="w-4 h-4" /> Add Organization
              </button>
              <button
                onClick={() => setActiveGlobalTab("plans")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeGlobalTab === "plans"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Subscription Plans
              </button>
            </>
          ) : (
            <>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">
                Tenant: {hook.activeOrg?.name}
              </div>
              <button
                onClick={() => setActiveOrgTab("profile")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "profile"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Building2 className="w-4 h-4" /> Organization Profile
              </button>
              <button
                onClick={() => setActiveOrgTab("status")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "status"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> Organization Status
              </button>
              <button
                onClick={() => setActiveOrgTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "settings"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Settings className="w-4 h-4" /> General Settings
              </button>
              <button
                onClick={() => setActiveOrgTab("logs")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "logs"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Activity className="w-4 h-4" /> Activity Logs
              </button>
              <button
                onClick={() => setActiveOrgTab("storage")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "storage"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Database className="w-4 h-4" /> Storage Usage
              </button>
              <button
                onClick={() => setActiveOrgTab("billing")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeOrgTab === "billing"
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Receipt className="w-4 h-4" /> Billing History
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-6xl mx-auto pb-32">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
