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
            <Building2 className="w-5 h-5 text-indigo-600" /> Organization
            Admins
          </h2>
          <p className="text-xs text-gray-500">
            Primary administrators and point of contacts for each tenant.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4">Organization</th>
              <th className="px-5 py-4">Admin Name</th>
              <th className="px-5 py-4">Email Profile</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {orgAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-5 py-4 font-semibold text-gray-900">
                  {admin.organization || "Unassigned"}
                </td>
                <td className="px-5 py-4 font-medium text-gray-800">
                  {admin.name}
                </td>
                <td className="px-5 py-4 font-mono text-gray-500">
                  {admin.email}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      admin.status === "Active"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {orgAdmins.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-gray-400"
                >
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
