import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  Settings, 
  CheckCircle, 
  Lock, 
  Layers, 
  UserCheck, 
  Globe, 
  Briefcase 
} from "lucide-react";
import { db } from "../../mockData";
import { RoleTemplate } from "../../types";

export default function RoleTemplatesView() {
  const [roles, setRoles] = useState<RoleTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState("ALL");

  useEffect(() => {
    setRoles(db.roleTemplates.get());
  }, []);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.permissions.some(p => p.module.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesScope = scopeFilter === "ALL" || role.scope === scopeFilter;
    
    return matchesSearch && matchesScope;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4 font-medium">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            System Role Definitions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and configure template roles, scopes, and localized module permission parameters.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] w-full">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search role names, scopes, or modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full focus:outline-none text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">All Scopes</option>
            <option value="Platform">Platform level</option>
            <option value="Organization">Organization level</option>
          </select>
        </div>
      </div>

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <div 
            key={role.id} 
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <div>
              {/* Header Title Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                    {role.name}
                    {role.isSystemDefault && (
                      <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                        System Default
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-semibold">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      role.scope === "Platform" 
                        ? "bg-slate-100 text-slate-700 border border-slate-200" 
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {role.scope} Scope
                    </span>
                    <span>•</span>
                    <span>{role.assignedOrgCount} active organizations assigned</span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  role.status === "Active" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${role.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                  {role.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {role.description}
              </p>

              {/* Permission Rules Matrix */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">
                  Module Actions Permissions
                </h4>
                
                <div className="divide-y divide-gray-100">
                  {role.permissions.map((perm, idx) => (
                    <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                        <div className="w-1.5 h-3 bg-indigo-500 rounded-sm" />
                        {perm.module}
                      </span>
                      
                      <div className="flex flex-wrap gap-1">
                        {perm.actions.map((act) => (
                          <span 
                            key={act} 
                            className="bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-2xs"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between text-xs text-gray-400 font-semibold">
              <span>Last updated: {new Date(role.updatedAt).toLocaleDateString()}</span>
              <button 
                className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold uppercase tracking-wider cursor-pointer"
                onClick={() => alert(`Full matrix auditing: ${role.name}`)}
              >
                Audit Matrix Logs
              </button>
            </div>
          </div>
        ))}

        {filteredRoles.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <Lock className="w-8 h-8 text-gray-400" />
            <p className="text-sm">No role templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
