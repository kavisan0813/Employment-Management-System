import React from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { ShieldAlert, MoreVertical } from "lucide-react";

export function SuperAdminsTable() {
  const { users } = useUserManagement();

  const superAdmins = users.filter((u) =>
    [
      "Super Admin",
      "Root Admin",
      "Billing Admin",
      "Support Admin",
      "Technical Admin",
    ].includes(u.role),
  );

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" /> Super Admins
          </h2>
          <p className="text-xs text-gray-500">
            Platform Owners with system-wide privileges.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">Admin Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Specific Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {superAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {admin.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-[11px] font-bold text-indigo-700">
                      {admin.role}
                    </span>
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
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {superAdmins.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    No Super Admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
