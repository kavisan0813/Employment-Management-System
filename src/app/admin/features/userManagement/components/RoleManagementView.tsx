import React from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { Shield, Settings } from "lucide-react";

export function RoleManagementView() {
  const { roles } = useUserManagement();

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" /> Role Management
          </h2>
          <p className="text-xs text-gray-500">
            Define system roles and custom positions within the hierarchy.
          </p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
          Create Custom Role
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4">Role Name</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4 text-center">Type</th>
              <th className="px-5 py-4 text-center">Hierarchy Level</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-5 py-4 font-semibold text-gray-900">
                  {role.name}
                </td>
                <td className="px-5 py-4 text-gray-600 max-w-xs truncate">
                  {role.description}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${
                      role.type === "System"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {role.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-center font-mono text-gray-500">
                  Lvl {role.hierarchyLevel}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
