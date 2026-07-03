import React from "react";
import { ShieldAlert } from "lucide-react";
import { RolesPermissionsTab } from "./components/RolesPermissionsTab";

export default function RolesPermissionsView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600 font-semibold" />
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage system-wide platform users and configure roles and permissions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="pt-2">
        <RolesPermissionsTab />
      </div>
    </div>
  );
}
