import { useState } from "react";
import {
  Building2,
  Plus,
  Database,
  ShieldAlert,
  ArrowLeft,
  Users,
  ToggleLeft,
  MapPin,
} from "lucide-react";
import { useOrganizations } from "./hooks/useOrganizations";

// Placeholders for Global Components
import { AllOrganizationsTable } from "./components/AllOrganizationsTable";
import { AddOrganizationForm } from "./components/AddOrganizationForm";

// Placeholders for Org-Specific Components
import { OrganizationProfile } from "./components/OrganizationProfile";
import { OrganizationStatus } from "./components/OrganizationStatus";
import { StorageUsage } from "./components/StorageUsage";
import { OrganizationUsersTab } from "./components/OrganizationUsersTab";
import { OrganizationFeaturesTab } from "./components/OrganizationFeaturesTab";
import { OrganizationStructureTab } from "./components/OrganizationStructureTab";

type GlobalTab = "all" | "add" | "plans";
type OrgTab = "profile" | "features" | "structure" | "status" | "storage" | "users";

export function OrganizationManagementView() {
  const hook = useOrganizations();
  const [activeGlobalTab, setActiveGlobalTab] = useState<GlobalTab>("all");
  const [activeOrgTab, setActiveOrgTab] = useState<OrgTab>("profile");

  // Determine what to render
  const renderContent = () => {
    if (hook.loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      );
    }

    if (hook.activeOrgId) {
      // Org Context
      switch (activeOrgTab) {
        case "profile":
          return <OrganizationProfile org={hook.activeOrg!} hook={hook} />;
        case "features":
          return <OrganizationFeaturesTab org={hook.activeOrg!} hook={hook} />;
        case "structure":
          return <OrganizationStructureTab org={hook.activeOrg!} hook={hook} />;
        case "status":
          return <OrganizationStatus org={hook.activeOrg!} hook={hook} />;
        case "storage":
          return <StorageUsage org={hook.activeOrg!} />;
        case "users":
          return <OrganizationUsersTab org={hook.activeOrg!} />;
        default:
          return <OrganizationProfile org={hook.activeOrg!} hook={hook} />;
      }
    } else {
      // Global Context
      switch (activeGlobalTab) {
        case "all":
          return <AllOrganizationsTable hook={hook} />;
        case "add":
          return (
            <AddOrganizationForm
              onSuccess={() => {
                hook.actions.loadData();
                setActiveGlobalTab("all");
              }}
            />
          );

        default:
          return <AllOrganizationsTable hook={hook} />;
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4 font-semibold">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600 font-semibold" />
            Organization Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage tenants, context settings, and organizational structures.
          </p>
        </div>

        {/* Navigation Action */}
        <div className="flex items-center gap-2 shrink-0">
          {hook.activeOrgId && (
            <button
              onClick={() => {
                hook.setActiveOrgId(null);
                setActiveGlobalTab("all");
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Organizations
            </button>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {!hook.activeOrgId ? (
            // Global Tabs
            <>
              {(
                [
                  { id: "all", label: "All Organizations", icon: Building2 },
                  { id: "add", label: "Add Organization", icon: Plus },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeGlobalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGlobalTab(tab.id)}
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
              {(
                [
                  { id: "profile", label: "Profile", icon: Building2 },
                  { id: "features", label: "Features & Overrides", icon: ToggleLeft },
                  { id: "structure", label: "Structure & Locations", icon: MapPin },
                  { id: "status", label: "Status", icon: ShieldAlert },
                  { id: "storage", label: "Storage", icon: Database },
                  { id: "users", label: "User Management", icon: Users },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeOrgTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOrgTab(tab.id)}
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
      <div className="w-full">{renderContent()}</div>
    </div>
  );
}
