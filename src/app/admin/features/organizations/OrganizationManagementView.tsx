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
    <div className="space-y-4 max-w-7xl mx-auto p-4 pb-32">
      {/* Context Selector & Tab Navigation Top Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Context Selector Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] font-bold text-gray-405 uppercase tracking-wider whitespace-nowrap">
            Context Focus:
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
            className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold px-3 py-2 outline-none focus:border-indigo-500 shadow-sm transition-colors cursor-pointer"
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

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-0.5 overflow-x-auto flex-1 md:justify-end">
          {!hook.activeOrgId ? (
            // Global Tabs
            <>
              {[
                { id: "all", label: "All Organizations", icon: Building2 },
                { id: "add", label: "Add Organization", icon: Plus },
                { id: "plans", label: "Subscription Plans", icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeGlobalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGlobalTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </>
          ) : (
            // Org Tabs
            <>
              {[
                { id: "profile", label: "Profile", icon: Building2 },
                { id: "status", label: "Status", icon: ShieldAlert },
                { id: "settings", label: "Settings", icon: Settings },
                { id: "logs", label: "Logs", icon: Activity },
                { id: "storage", label: "Storage", icon: Database },
                { id: "billing", label: "Billing", icon: Receipt }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeOrgTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOrgTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </>
          )}
        </div>

      </div>

      {/* Active Page Content Area */}
      <div className="bg-[#F8F9FA] rounded-xl p-6 min-h-[calc(100vh-200px)]">
        {renderContent()}
      </div>
    </div>
  );
}
