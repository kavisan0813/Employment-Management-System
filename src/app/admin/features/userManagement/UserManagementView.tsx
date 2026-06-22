import React, { useState } from "react";
import { PlatformUsersTable } from "./components/PlatformUsersTable";
import { SuperAdminsTable } from "./components/SuperAdminsTable";
import { OrgAdminsTable } from "./components/OrgAdminsTable";
import { RoleManagementView } from "./components/RoleManagementView";
import { UserSessionsTable } from "./components/UserSessionsTable";
import { PermissionsMatrix } from "./components/PermissionsMatrix";
import { UserActivityTimeline } from "./components/UserActivityTimeline";
import { AccessControlSettings } from "./components/AccessControlSettings";
import { ImportExportUsers } from "./components/ImportExportUsers";
import {
  Users,
  ShieldAlert,
  Building2,
  Shield,
  Monitor,
  Activity,
  Key,
  Download,
} from "lucide-react";

export default function UserManagementView() {
  const [activeTab, setActiveTab] = useState("platform-users");

  const TABS = [
    { id: "platform-users", label: "Platform Users", icon: Users },
    { id: "super-admins", label: "Super Admins", icon: ShieldAlert },
    { id: "org-admins", label: "Org Admins", icon: Building2 },
    { id: "roles", label: "Roles", icon: Shield },
    { id: "sessions", label: "User Sessions", icon: Monitor },
    { id: "activity", label: "User Activity", icon: Activity },
    { id: "access", label: "Access Control", icon: Key },
    { id: "import", label: "Import / Export", icon: Download },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "platform-users":
        return <PlatformUsersTable />;
      case "super-admins":
        return <SuperAdminsTable />;
      case "org-admins":
        return <OrgAdminsTable />;
      case "roles":
        return (
          <div className="space-y-8">
            <RoleManagementView />
            <div className="pt-6 border-t border-gray-200">
              <PermissionsMatrix />
            </div>
          </div>
        );
      case "sessions":
        return <UserSessionsTable />;
      case "activity":
        return <UserActivityTimeline />;
      case "access":
        return <AccessControlSettings />;
      case "import":
        return <ImportExportUsers />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-sm font-semibold text-gray-900 mt-4">
              Module Segment Coming Soon
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              This module section is currently under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-6rem)]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-1 bg-white border border-gray-200 rounded-xl p-3 shadow-xs h-fit self-start sticky top-6">
        <div className="mb-4 px-2 pt-2">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            User Management
          </h2>
        </div>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
