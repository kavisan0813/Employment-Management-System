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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">Admin Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Specific Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {superAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {admin.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-[11px] font-bold text-indigo-700">
                      {admin.role}
                    </span>
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
                    className="px-4 py-12 text-center text-gray-400"
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
