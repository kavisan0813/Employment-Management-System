import React, { useState } from "react";
import PlatformUsersTable from "./components/PlatformUsersTable";
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
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 font-semibold" />
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage system-wide platform users, super administrators, organization admins, roles, active sessions, and access control settings.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse font-semibold" />
          Access Registry Connected
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
     <div className="w-full overflow-hidden">
  <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-55"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="pt-2">
        {renderContent()}
      </div>
    </div>
  );
}
