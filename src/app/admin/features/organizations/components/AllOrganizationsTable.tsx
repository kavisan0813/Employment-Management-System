import React from "react";
import { Search, ChevronDown, Activity, Globe, Zap, MoreVertical } from "lucide-react";

export function AllOrganizationsTable({ hook }: { hook: any }) {
  const { filteredOrgs, filters, actions, setActiveOrgId } = hook;

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            All Organizations
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage and monitor all tenant organizations on the platform.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Filters Header Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={filters.searchQuery}
            onChange={(e) => filters.setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full focus:outline-none text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.statusFilter}
            onChange={(e) => filters.setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Trial">Trial</option>
            <option value="Expired">Expired</option>
          </select>
          <select
            value={filters.planFilter}
            onChange={(e) => filters.setPlanFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer"
          >
            <option value="ALL">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
          </select>
          <select
            value={filters.industryFilter}
            onChange={(e) => filters.setIndustryFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer"
          >
            <option value="ALL">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Financial Services">Financial Services</option>
            <option value="SpaceTech">SpaceTech</option>
            <option value="Media & Entertainment">Media & Entertainment</option>
          </select>
        </div>
        </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Industry</th>
                <th className="px-5 py-4">Employees</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrgs.map((org: any) => (
                <tr key={org.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                            {org.code || org.id.split('-')[1]}
                          </span>
                          <span>•</span>
                          <Globe className="w-3 h-3" />
                          <span>{org.domain}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium">{org.industry}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      {org.userCount} / {org.seatLimit}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <Zap className="w-3 h-3" />
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      org.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      org.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-200' :
                      org.status === 'Trial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setActiveOrgId(org.id)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No organizations found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
