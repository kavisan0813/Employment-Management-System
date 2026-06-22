import React from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { Building2, MoreVertical } from "lucide-react";

export function OrgAdminsTable() {
  const { users } = useUserManagement();

  // For Org Admins, we look for users with 'Org Admin' role
  const orgAdmins = users.filter((u) => u.role === "Org Admin");

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" /> Organization Admins
          </h2>
          <p className="text-xs text-gray-500">
            Primary administrators and point of contacts for each tenant.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Admin Name</th>
              <th className="px-4 py-3">Email Profile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orgAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {admin.organization || "Unassigned"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {admin.name}
                </td>
                <td className="px-4 py-3 font-mono text-gray-500">
                  {admin.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      admin.status === "Active"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {orgAdmins.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  No Organization Admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
