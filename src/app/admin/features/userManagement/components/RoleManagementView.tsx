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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">Hierarchy Level</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {role.name}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                  {role.description}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                      role.type === "System"
                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {role.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-mono text-gray-500">
                  Lvl {role.hierarchyLevel}
                </td>
                <td className="px-4 py-3 text-right">
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
