/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { RoleTemplate, PermissionRule, Organization } from "../../types";
import { 
  Users2, Search, ChevronDown, X, ShieldCheck, Copy, Trash2, Settings, Plus
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";
const AVAILABLE_MODULES = ["Employees", "Payroll", "Billing", "Integrations", "System Settings", "Timesheets"];
const AVAILABLE_ACTIONS = ["view", "create", "edit", "delete", "approve"] as const;

export default function RoleTemplatesView({ onNavigate = () => {} }: { onNavigate?: (view: string, targetId?: string) => void }) {
  const [roles, setRoles] = useState<RoleTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selection Detail Organization Drawer
  const [drawerRole, setDrawerRole] = useState<RoleTemplate | null>(null);

  // Multi-step Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleTemplate | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formScope, setFormScope] = useState<RoleTemplate["scope"]>("Organization");
  const [formStatus, setFormStatus] = useState<RoleTemplate["status"]>("Active");
  const [permissionMatrix, setPermissionMatrix] = useState<{ [module: string]: typeof AVAILABLE_ACTIONS[number][] }>({});

  const refreshData = () => {
    setOrgs(db.organizations.get());
    setRoles(db.roleTemplates.get());
  };

  // Re-added helper for the drawer/modal context mapping
  const [orgs, setOrgs] = useState<Organization[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  // Filter Pipeline Logic Matching
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScope = scopeFilter === "ALL" || role.scope === scopeFilter;
    const matchesStatus = statusFilter === "ALL" || role.status === statusFilter;
    return matchesSearch && matchesScope && matchesStatus;
  });

  const hasActiveFilters = scopeFilter !== "ALL" || statusFilter !== "ALL" || !!searchQuery;

  const openCreateModal = () => {
    setEditingRole(null);
    setFormName("");
    setFormDescription("");
    setFormScope("Organization");
    setFormStatus("Active");
    
    const matrix: typeof permissionMatrix = {};
    AVAILABLE_MODULES.forEach(m => { matrix[m] = ["view"]; });
    setPermissionMatrix(matrix);
    setIsModalOpen(true);
  };

  const openEditModal = (role: RoleTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRole(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormScope(role.scope);
    setFormStatus(role.status);

    const matrix: typeof permissionMatrix = {};
    AVAILABLE_MODULES.forEach(m => {
      const match = role.permissions.find(p => p.module === m);
      matrix[m] = match ? [...match.actions] : [];
    });
    setPermissionMatrix(matrix);
    setIsModalOpen(true);
  };

  const handleMatrixToggle = (module: string, action: typeof AVAILABLE_ACTIONS[number]) => {
    const currentActions = permissionMatrix[module] || [];
    const updated = currentActions.includes(action)
      ? currentActions.filter(a => a !== action)
      : [...currentActions, action];
    setPermissionMatrix({ ...permissionMatrix, [module]: updated });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const formattedPermissions: PermissionRule[] = Object.keys(permissionMatrix).map(m => ({
      module: m,
      actions: permissionMatrix[m]
    })).filter(p => p.actions.length > 0);

    const currentRoles = db.roleTemplates.get();

    if (editingRole) {
      if (editingRole.isSystemDefault) return;
      
      if (formStatus === "Inactive" && editingRole.assignedOrgCount > 0) {
        alert(`Cannot deactivate template while it is assigned to ${editingRole.assignedOrgCount} organization(s).`);
        return;
      }

      db.roleTemplates.save(currentRoles.map(r => 
        r.id === editingRole.id ? { 
          ...r, 
          name: formName, 
          description: formDescription, 
          scope: formScope, 
          status: formStatus,
          permissions: formattedPermissions, 
          updatedAt: new Date().toISOString() 
        } : r
      ));
      pushAuditLog("role.template_modified", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { title_name: formName, scope: formScope, status: formStatus });
    } else {
      const newRole: RoleTemplate = {
        id: `role-${Date.now()}`,
        name: formName,
        description: formDescription,
        scope: formScope,
        status: formStatus,
        permissions: formattedPermissions,
        assignedOrgCount: 0,
        isSystemDefault: false,
        updatedAt: new Date().toISOString()
      };
      db.roleTemplates.save([...currentRoles, newRole]);
      pushAuditLog("role.template_created", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { title_name: formName, scope: formScope, status: formStatus });
    }

    setIsModalOpen(false);
    refreshData();
  };

  const cloneRoleConfig = (role: RoleTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = db.roleTemplates.get();
    const newName = `${role.name} (Copy)`;
    const newRole: RoleTemplate = {
      ...role,
      id: `role-${Date.now()}`,
      name: newName,
      isSystemDefault: false,
      assignedOrgCount: 0,
      updatedAt: new Date().toISOString()
    };
    db.roleTemplates.save([...current, newRole]);
    pushAuditLog("role.template_cloned", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { original_role: role.name, cloned_role: newName });
    refreshData();
  };

  const purgeTemplateElement = (role: RoleTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    if (role.isSystemDefault || role.assignedOrgCount > 0) return;
    if (!confirm(`Confirm absolute deletion of security role template ${role.name}?`)) return;

    db.roleTemplates.save(db.roleTemplates.get().filter(r => r.id !== role.id));
    pushAuditLog("role.template_deleted", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { deleted_title: role.name });
    refreshData();
  };

  const planBadgeClass = (scope: RoleTemplate["scope"]) =>
    scope === "Platform"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="space-y-5 relative">
      
      {/* Top Professional Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Security Role Templates</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Establish blueprints and modular RBAC matrices for assignable client tenant scopes.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Initialize Role Template
        </button>
      </div>

      {/* Control Navigation Filters Row Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles template titles or descriptive tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect label="Scope" value={scopeFilter} onChange={setScopeFilter} options={[
              ["ALL", "All Scopes"], ["Platform", "Platform Specific"], ["Organization", "Organization Specific"]
            ]} />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              ["ALL", "All Statuses"], ["Active", "Active"], ["Inactive", "Inactive"]
            ]} />

            {hasActiveFilters && (
              <button
                onClick={() => { setScopeFilter("ALL"); setStatusFilter("ALL"); setSearchQuery(""); }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core Ledger Data Table Grid Frame Component */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">Template Identity</th>
                <th className="px-4 py-3">Scope Bounds</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Orgs</th>
                <th className="px-4 py-3">Permissions Matrix Preview</th>
                <th className="px-4 py-3 text-center w-72">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 font-medium">No system access templates defined inside this node boundary layer.</td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/70 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {role.isSystemDefault && (
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[9px] text-indigo-700 font-extrabold tracking-wide uppercase">System</span>
                        )}
                        <span className="font-semibold text-gray-900 text-sm">{role.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-0.5 block truncate max-w-xs">{role.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${planBadgeClass(role.scope)}`}>
                        {role.scope}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-medium ${
                        role.status === "Active" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>{role.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(role.assignedOrgCount > 0) setDrawerRole(role); }}
                        className={`font-semibold transition-colors ${role.assignedOrgCount > 0 ? "text-indigo-600 hover:text-indigo-700 underline cursor-pointer" : "text-gray-400"}`}
                      >
                        {role.assignedOrgCount} orgs
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {role.permissions.map(p => (
                          <span key={p.module} className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-mono text-gray-600">
                            {p.module}:{p.actions.length}
                          </span>
                        ))}
                      </div>
                    </td>
                    {/* Aligned Actions Layout Block */}
                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5 bg-gray-50/80 p-1 rounded-lg border border-gray-100 max-w-[250px] mx-auto shadow-2xs">
                        <button
                          onClick={(e) => openEditModal(role, e)}
                          className="w-16 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-md font-semibold cursor-pointer transition-all text-[11px]"
                        >
                          {role.isSystemDefault ? "Inspect" : "Edit"}
                        </button>
                        <button
                          onClick={(e) => cloneRoleConfig(role, e)}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-md font-semibold cursor-pointer transition-all text-[11px]"
                        >
                          Clone
                        </button>
                        <button
                          disabled={role.isSystemDefault || role.assignedOrgCount > 0}
                          onClick={(e) => purgeTemplateElement(role, e)}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-rose-600 hover:text-rose-700 hover:border-rose-200 rounded-md font-bold cursor-pointer transition-all text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                          title={role.isSystemDefault ? "System default templates cannot be deleted" : role.assignedOrgCount > 0 ? `Cannot delete template while assigned to ${role.assignedOrgCount} organization(s)` : "Delete template"}
                        >
                          Purge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGNED ORGANIZATIONS RETRIEVAL DRAWER */}
      {drawerRole && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600"/>
              Assigned Organizations &bull; {drawerRole.name}
            </h3>
            <button onClick={() => setDrawerRole(null)} className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-2 text-xs text-gray-700 bg-white">
            <p className="text-gray-400 mb-3 leading-relaxed">Organizations actively consuming this role blueprint definition matrix setup config.</p>
            <div className="border border-gray-200 bg-gray-50/50 rounded-xl divide-y divide-gray-200 overflow-hidden font-mono text-[11px]">
              <div className="p-3 text-gray-900 flex justify-between"><span>Acme Corporation</span><span className="text-gray-400">ID: org-11</span></div>
              <div className="p-3 text-gray-900 flex justify-between"><span>Stark Industries</span><span className="text-gray-400">ID: org-42</span></div>
              <div className="p-3 text-gray-900 flex justify-between"><span>Lumina Systems</span><span className="text-gray-400">ID: org-88</span></div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE AND CONFIGURATION HANDSHAKE MATRIX MODAL */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ModalHeader icon={ShieldCheck} title={editingRole ? `Inspect Matrix Blueprint \u2022 ${editingRole.name}` : "Initialize Security Access Template"} onClose={() => setIsModalOpen(false)} />
          <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Field label="Template Access Title Name" required>
                  <input type="text" required disabled={editingRole?.isSystemDefault} placeholder="e.g. Finance Controller" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Explanatory Scope Description">
                  <textarea disabled={editingRole?.isSystemDefault} placeholder="Helper commentary details..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Security Scope">
                    <select disabled={editingRole?.isSystemDefault} value={formScope} onChange={(e) => setFormScope(e.target.value as any)} className={inputClass}>
                      <option value="Organization">Organization</option>
                      <option value="Platform">Platform</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select disabled={editingRole?.isSystemDefault} value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)} className={inputClass}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Right Matrix Column Configuration Blocks */}
              <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Clearance Policy Rule Matrix</span>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {AVAILABLE_MODULES.map(moduleName => {
                    const enabledActions = permissionMatrix[moduleName] || [];
                    return (
                      <div key={moduleName} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                        <span className="font-bold text-gray-900 block font-mono text-[11px]">{moduleName}</span>
                        <div className="flex flex-wrap gap-1">
                          {AVAILABLE_ACTIONS.map(action => {
                            const isChecked = enabledActions.includes(action);
                            return (
                              <button
                                type="button"
                                key={action}
                                disabled={editingRole?.isSystemDefault}
                                onClick={() => handleMatrixToggle(moduleName, action)}
                                className={`px-2 py-0.5 rounded text-[10px] border font-bold transition-all ${
                                  isChecked ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-400"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {isChecked ? "✔" : "+"} {action}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-200">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              {!editingRole?.isSystemDefault && (
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer">
                  {editingRole ? "Save Configurations" : "Provision Template"}
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}

// ---- Pure Presentation Functional Layout Helpers (Clean Light Design Tokens) ----

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 pl-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ children, onClose, maxWidth = "max-w-2xl" }: { children: React.ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl w-full ${maxWidth}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, onClose }: { icon: React.ComponentType<{ className?: string }>; title: string; onClose: () => void }) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-600" />
        {title}
      </h3>
      <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 bg-white rounded-lg cursor-pointer transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/80">
      <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs pr-5 focus:outline-none font-bold appearance-none cursor-pointer z-10"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val} className="bg-white text-gray-800">{lbl}</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none z-0" />
      </div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-gray-400 text-center py-8 font-semibold tracking-wide">{text}</p>;
}