import React, { useState } from "react";
import { Users, Shield } from "lucide-react";
import { PlatformUsersTab } from "./components/PlatformUsersTab";
import { RolesPermissionsTab } from "./components/RolesPermissionsTab";

export default function UserManagementView() {
  const [activeTab, setActiveTab] = useState("platform-users");

  const TABS = [
    { id: "platform-users", label: "Platform Users", icon: Users },
    { id: "roles", label: "Roles and Permissions", icon: Shield },
  ];

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
            Manage system-wide platform users and configure roles and permissions.
          </p>
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
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "platform-users" && <PlatformUsersTab />}
        {activeTab === "roles" && <RolesPermissionsTab />}
      </div>
    </div>
  );
}
