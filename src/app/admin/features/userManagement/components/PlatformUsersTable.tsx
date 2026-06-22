import React from "react";
import { PlatformUser } from "../../../types";
import { useUserManagement } from "../hooks/useUserManagement";
import {
  Search,
  CheckSquare,
  Square,
  Smartphone,
  ShieldX,
  MoreVertical,
} from "lucide-react";

// Helper Filter component
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-indigo-400"
      >
        {options.map(([val, text]) => (
          <option key={val} value={val}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PlatformUsersTable() {
  const { filteredUsers, filters, organizations } = useUserManagement();

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Platform Users</h2>
          <p className="text-xs text-gray-500">
            Master list of all users across the platform.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={filters.userSearch}
              onChange={(e) => filters.setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect
              label="Status"
              value={filters.statusFilter}
              onChange={filters.setStatusFilter}
              options={[
                ["ALL", "All statuses"],
                ["Active", "Active"],
                ["Pending", "Pending"],
                ["Suspended", "Suspended"],
              ]}
            />
            <FilterSelect
              label="Role"
              value={filters.roleFilter}
              onChange={filters.setRoleFilter}
              options={[
                ["ALL", "All roles"],
                ["Super Admin", "Super Admin"],
                ["Org Admin", "Org Admin"],
                ["HR Manager", "HR Manager"],
                ["Manager", "Manager"],
                ["Employee", "Employee"],
              ]}
            />
            <FilterSelect
              label="Org"
              value={filters.orgFilter}
              onChange={filters.setOrgFilter}
              options={[
                ["ALL", "All Organizations"],
                ...organizations.map((o) => [o.id, o.name] as [string, string]),
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email Profile</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Security Role</th>
                <th className="px-4 py-3">MFA Setup</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {user.organization || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.mfaEnabled ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-500" />{" "}
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <ShieldX className="w-3.5 h-3.5 text-gray-300" />{" "}
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        user.status === "Active"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : user.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No users found matching current filters.
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
