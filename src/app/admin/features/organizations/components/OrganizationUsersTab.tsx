import React, { useMemo } from "react";
import { Users, Building2, Briefcase, UserCheck, Coins, Award } from "lucide-react";
import { Organization } from "../../../types";

interface OrganizationUsersTabProps {
  org: Organization;
}

export function OrganizationUsersTab({ org }: OrganizationUsersTabProps) {
  const totalEmployees = org.userCount;

  // Generate dynamic mock role distribution for each organization based on headcount
  const rolesData = useMemo(() => {
    if (totalEmployees <= 0) {
      return [];
    }

    // Determine available roles based on userCount
    const rolesList: { name: string; category: string; icon: any; colorClass: string; barColor: string }[] = [];
    
    if (totalEmployees < 5) {
      rolesList.push(
        { name: "Manager", category: "Leadership", icon: Award, colorClass: "text-amber-600 bg-amber-50 border-amber-100", barColor: "bg-amber-500" },
        { name: "Employee", category: "Staff", icon: Briefcase, colorClass: "text-sky-600 bg-sky-50 border-sky-100", barColor: "bg-sky-500" }
      );
    } else if (totalEmployees < 20) {
      rolesList.push(
        { name: "HR Specialist", category: "HR", icon: UserCheck, colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100", barColor: "bg-indigo-500" },
        { name: "Manager", category: "Leadership", icon: Award, colorClass: "text-amber-600 bg-amber-50 border-amber-100", barColor: "bg-amber-500" },
        { name: "Employee", category: "Staff", icon: Briefcase, colorClass: "text-sky-600 bg-sky-50 border-sky-100", barColor: "bg-sky-500" }
      );
    } else if (totalEmployees < 100) {
      rolesList.push(
        { name: "HR", category: "HR", icon: UserCheck, colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100", barColor: "bg-indigo-500" },
        { name: "Finance", category: "Finance", icon: Coins, colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100", barColor: "bg-emerald-500" },
        { name: "Manager", category: "Leadership", icon: Award, colorClass: "text-amber-600 bg-amber-50 border-amber-100", barColor: "bg-amber-500" },
        { name: "Employee", category: "Staff", icon: Briefcase, colorClass: "text-sky-600 bg-sky-50 border-sky-100", barColor: "bg-sky-500" }
      );
    } else {
      rolesList.push(
        { name: "Director / VP", category: "Leadership", icon: Award, colorClass: "text-purple-600 bg-purple-50 border-purple-100", barColor: "bg-purple-500" },
        { name: "Manager", category: "Leadership", icon: Award, colorClass: "text-amber-600 bg-amber-50 border-amber-100", barColor: "bg-amber-500" },
        { name: "HR Manager", category: "HR", icon: UserCheck, colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100", barColor: "bg-indigo-500" },
        { name: "Finance Lead", category: "Finance", icon: Coins, colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100", barColor: "bg-emerald-500" },
        { name: "Employee", category: "Staff", icon: Briefcase, colorClass: "text-sky-600 bg-sky-50 border-sky-100", barColor: "bg-sky-500" }
      );
    }

    const numRoles = rolesList.length;
    const counts: Record<string, number> = {};

    if (numRoles === 2) {
      const manager = Math.max(1, Math.floor(totalEmployees * 0.20));
      counts["Manager"] = manager;
      counts["Employee"] = totalEmployees - manager;
    } else if (numRoles === 3) {
      const hr = Math.max(1, Math.floor(totalEmployees * 0.12));
      const manager = Math.max(1, Math.floor(totalEmployees * 0.15));
      counts["HR Specialist"] = hr;
      counts["Manager"] = manager;
      counts["Employee"] = totalEmployees - hr - manager;
    } else if (numRoles === 4) {
      // Nova Media is N=85, which falls here!
      if (totalEmployees === 85) {
        counts["HR"] = 10;
        counts["Finance"] = 5;
        counts["Manager"] = 8;
        counts["Employee"] = 62;
      } else {
        const hr = Math.max(1, Math.floor(totalEmployees * 0.12));
        const finance = Math.max(1, Math.floor(totalEmployees * 0.06));
        const manager = Math.max(1, Math.floor(totalEmployees * 0.10));
        counts["HR"] = hr;
        counts["Finance"] = finance;
        counts["Manager"] = manager;
        counts["Employee"] = totalEmployees - hr - finance - manager;
      }
    } else if (numRoles === 5) {
      const director = Math.max(1, Math.floor(totalEmployees * 0.04));
      const manager = Math.max(1, Math.floor(totalEmployees * 0.08));
      const hr = Math.max(1, Math.floor(totalEmployees * 0.06));
      const finance = Math.max(1, Math.floor(totalEmployees * 0.04));
      counts["Director / VP"] = director;
      counts["Manager"] = manager;
      counts["HR Manager"] = hr;
      counts["Finance Lead"] = finance;
      counts["Employee"] = totalEmployees - director - manager - hr - finance;
    }

    return rolesList.map(role => ({
      ...role,
      count: counts[role.name] || 0
    }));
  }, [org.id, totalEmployees]);

  if (totalEmployees === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mt-6 shadow-sm animate-in fade-in duration-300">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">No Employees Found</h3>
        <p className="text-sm text-gray-500 mt-1 font-semibold">
          This organization does not currently have any assigned employees.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organization Name Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center justify-between hover:shadow-sm transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Organization Focus</span>
            <h3 className="text-xl font-bold text-gray-900 truncate max-w-[200px]" title={org.name}>{org.name}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Headcount Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center justify-between hover:shadow-sm transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Employees</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none">
              {totalEmployees} <span className="text-xs font-semibold text-gray-500">headcount</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Roles Available Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center justify-between hover:shadow-sm transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Roles Available</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none">
              {rolesData.length} <span className="text-xs font-semibold text-gray-500">active roles</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Role Breakdown Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-sm">
            Role Distribution & Headcount Allocation
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Employee Count</th>
                <th className="px-6 py-4">Allocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {rolesData.map((r) => {
                const RoleIcon = r.icon;
                const percentage = totalEmployees > 0 ? ((r.count / totalEmployees) * 100).toFixed(1) : "0.0";
                
                return (
                  <tr key={r.name} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${r.colorClass}`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        r.category === "Leadership" 
                          ? "bg-amber-50 text-amber-700 border-amber-200" 
                          : r.category === "HR" 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : r.category === "Finance" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-bold">{r.count}</span> <span className="text-gray-400 text-xs">{r.count === 1 ? 'user' : 'users'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 max-w-[200px]">
                        <span className="text-gray-900 font-bold min-w-[45px]">{percentage}%</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${r.barColor} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
