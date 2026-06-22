/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { PlatformUser, Organization } from "../../types";
import { 
  Users, Search, Plus, ChevronDown, Mail, ShieldAlert, CheckSquare, Square, 
  X, Lock, RefreshCcw, Smartphone, Trash2, ShieldX, Key, UserCheck, UserMinus
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function GlobalUsersView() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom filter selections
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [orgFilter, setOrgFilter] = useState("ALL");

  // Detail Profile Drawer
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  // Modals
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
// Form states
  const [selectedUserOperator, setSelectedUserOperator] = useState<PlatformUser | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<PlatformUser | null>(null); // <-- ADD THIS LINE
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formOrgId, setFormOrgId] = useState("");
  const [formRole, setFormRole] = useState<PlatformUser["role"]>("Employee");
  const [editRoleValue, setEditRoleValue] = useState<PlatformUser["role"]>("Employee");
  const [deleteInputEmail, setDeleteInputEmail] = useState("");

  const refreshData = () => {
    setUsers(db.users.get());
    setOrgs(db.organizations.get());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter Matching
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesOrg = orgFilter === "ALL" || user.organizationId === orgFilter;
    return matchesSearch && matchesStatus && matchesRole && matchesOrg;
  });

  const hasActiveFilters = statusFilter !== "ALL" || roleFilter !== "ALL" || orgFilter !== "ALL" || !!searchQuery;

  // Checkbox management
  const toggleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // ---- Bulk Operations Operators ----
  const handleBulkSuspend = () => {
    const updated = db.users.get().map(u => 
      selectedUsers.includes(u.id) ? { ...u, status: "Suspended" as const } : u
    );
    db.users.save(updated);
    pushAuditLog("user.bulk_suspended", "Security", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { user_ids_count: String(selectedUsers.length) });
    setSelectedUsers([]);
    refreshData();
    toast(`Suspended selected user accounts.`);
  };

  const handleBulkReset = () => {
    pushAuditLog("user.bulk_password_reset", "Security", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { targets: String(selectedUsers.length) });
    setSelectedUsers([]);
    toast(`Emailed secure password reset tokens.`);
  };

  const handleBulkExport = () => {
    const header = "ID,Name,Email,Organization,Role,Status,MfaEnabled,JoinedAt\n";
    const targets = users.filter(u => selectedUsers.includes(u.id));
    const rows = targets.map(t => `${t.id},"${t.name}",${t.email},"${t.organization}",${t.role},${t.status},${t.mfaEnabled},${t.joinedAt}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedUsers([]);
  };

  // ---- User Pipeline Actions ----
  const openInviteModal = () => {
    setFormName("");
    setFormEmail("");
    if (orgs.length > 0) setFormOrgId(orgs[0].id);
    setFormRole("Employee");
    setIsInviteOpen(true);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedOrg = orgs.find(o => o.id === formOrgId);
    if (!targetedOrg) return;

    const currentOrgUsersCount = users.filter(u => u.organizationId === targetedOrg.id).length;
    if (currentOrgUsersCount >= targetedOrg.seatLimit) {
      alert(`Tenant '${targetedOrg.name}' has exhausted active seat capacities (${targetedOrg.seatLimit} max licenses). Please upgrade billing first.`);
      return;
    }

    const newUser: PlatformUser = {
      id: `user-${Date.now()}`,
      name: formName,
      email: formEmail,
      status: "Pending",
      role: formRole,
      organization: targetedOrg.name,
      organizationId: targetedOrg.id,
      lastLoginAt: new Date().toISOString(),
      mfaEnabled: false,
      joinedAt: new Date().toISOString()
    };

    db.users.save([newUser, ...db.users.get()]);

    db.organizations.save(orgs.map(o => 
      o.id === targetedOrg.id ? { ...o, userCount: o.userCount + 1 } : o
    ));

    pushAuditLog("user.invited", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", targetedOrg.name, "Active", { invite_email: formEmail, invited_role: formRole });
    setIsInviteOpen(false);
    refreshData();
    toast(`Invite scheduled and dispatched to ${formEmail}.`);
  };

  const triggerResetPassword = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    pushAuditLog("user.password_reset_sent", "Security", CURRENT_ADMIN_EMAIL, "platform_admin", user.organization, "Active", { reset_target: user.email });
    toast(`Sent password reset instructions link to ${user.email}.`);
  };

  const forceMfaEnrollment = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    pushAuditLog("user.mfa_enforced", "Security", CURRENT_ADMIN_EMAIL, "platform_admin", user.organization, "Active", { target: user.email });
    toast(`MFA enrollment required on next validation handshake session.`);
  };

  const openEditRoleModal = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUserForRole(user);
    setEditRoleValue(user.role);
    setIsEditRoleOpen(true);
  };

  const handleRoleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole) return;

    db.users.save(db.users.get().map(u => 
      u.id === selectedUserForRole.id ? { ...u, role: editRoleValue } : u
    ));

    pushAuditLog("user.role_change", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", selectedUserForRole.organization, "Active", { user_email: selectedUserForRole.email, previous_role: selectedUserForRole.role, new_role: editRoleValue });
    setIsEditRoleOpen(false);
    refreshData();
    toast(`Updated security permissions role vector scope.`);
  };

  const toggleSuspendStatus = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = user.status === "Suspended" ? "Active" : "Suspended";
    db.users.save(db.users.get().map(u => 
      u.id === user.id ? { ...u, status: nextStatus as any } : u
    ));

    pushAuditLog(`user.${nextStatus === "Suspended" ? "lockout" : "reactivate"}`, "Security", CURRENT_ADMIN_EMAIL, "platform_admin", user.organization, "Active", { target: user.email });
    refreshData();
    if (drawerUserId === user.id) setDrawerUserId(null);
  };

  const promptRemoveFromOrg = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUserOperator(user);
    setIsRemoveConfirmOpen(true);
  };

  const handleRemoveFromOrgConfirm = () => {
    if (!selectedUserOperator) return;

    db.users.save(db.users.get().map(u => 
      u.id === selectedUserOperator.id ? { ...u, organization: "Unassigned", organizationId: "" } : u
    ));

    db.organizations.save(db.organizations.get().map(o => 
      o.id === selectedUserOperator.organizationId ? { ...o, userCount: Math.max(0, o.userCount - 1) } : o
    ));

    pushAuditLog("user.detached_from_org", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", selectedUserOperator.organization, "Active", { user_email: selectedUserOperator.email });
    setIsRemoveConfirmOpen(false);
    setSelectedUserOperator(null);
    refreshData();
    toast(`Detached account from organization roster workspace configuration mapping.`);
  };

  const promptConfirmDelete = (user: PlatformUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUserOperator(user);
    setDeleteInputEmail("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUserOperator || deleteInputEmail !== selectedUserOperator.email) return;

    db.users.save(db.users.get().filter(u => u.id !== selectedUserOperator.id));

    db.organizations.save(db.organizations.get().map(o => 
      o.id === selectedUserOperator.organizationId ? { ...o, userCount: Math.max(0, o.userCount - 1) } : o
    ));

    pushAuditLog("user.deleted", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", selectedUserOperator.organization, "Active", { deleted_email: selectedUserOperator.email });
    setIsDeleteOpen(false);
    setSelectedUserOperator(null);
    setDrawerUserId(null);
    refreshData();
    toast(`Destructive user database trace file removal cycle execution success.`);
  };

  function toast(msg: string) {
    console.log(msg);
  }

  const activeDrawerUser = users.find(u => u.id === drawerUserId);

  return (
    <div className="space-y-5 relative">
      {/* Page Title Block Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Global Users
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Every user account across every tenant, for support lookups and platform-wide user management.</p>
        </div>
        <button
          onClick={openInviteModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Query Filters System Row */}
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              ["ALL", "All statuses"], ["Active", "Active"], ["Pending", "Pending"], ["Suspended", "Suspended"], ["Inactive", "Inactive"]
            ]} />
            <FilterSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={[
              ["ALL", "All roles"], ["Super Admin", "Super Admin"], ["Org Admin", "Org Admin"], ["HR Manager", "HR Manager"], ["Manager", "Manager"], ["Employee", "Employee"]
            ]} />
            <FilterSelect label="Organization" value={orgFilter} onChange={setOrgFilter} options={[
              ["ALL", "All organizations"], ...orgs.map(o => [o.id, o.name] as [string, string])
            ]} />

            {hasActiveFilters && (
              <button
                onClick={() => { setStatusFilter("ALL"); setRoleFilter("ALL"); setOrgFilter("ALL"); setSearchQuery(""); }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Row Selection Checked Batch Action Strip */}
      {selectedUsers.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in duration-100">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <p className="text-xs font-semibold text-indigo-900">{selectedUsers.length} account workspace profiles checked</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleBulkSuspend} className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 rounded-lg transition-colors cursor-pointer">Suspend selected</button>
            <button onClick={handleBulkReset} className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 rounded-lg transition-colors cursor-pointer">Force Reset</button>
            <button onClick={handleBulkExport} className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-semibold text-gray-700 rounded-lg transition-colors cursor-pointer">Export CSV</button>
            <button onClick={() => setSelectedUsers([])} className="text-xs text-indigo-700 hover:text-indigo-800 px-2 font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Core Users Table Frame Component */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-9">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email Profile</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Security Role</th>
                <th className="px-4 py-3">MFA Setup</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center w-[380px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No registered system users matched your filters metrics criteria indices.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isChecked = selectedUsers.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setDrawerUserId(user.id)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3" onClick={(e) => toggleSelect(user.id, e)}>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 text-gray-700">{user.organization || <span className="text-gray-400 italic">Unassigned</span>}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.mfaEnabled ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1">
                            <ShieldX className="w-3.5 h-3.5 text-gray-300" /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          user.status === "Active" ? "bg-teal-50 text-teal-700 border-teal-200" :
                          user.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      {/* Explicit Fixed-Width Balanced Buttons Grid Column (No Hovers Allowed) */}
                      <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5 bg-gray-50/80 p-1 rounded-lg border border-gray-100 max-w-[365px] mx-auto shadow-2xs">
                          <button
                            onClick={(e) => openEditRoleModal(user, e)}
                            className="w-16 py-1 text-center bg-white border border-gray-200 text-indigo-600 hover:border-indigo-200 font-semibold cursor-pointer rounded-md text-[11px] transition-all"
                          >
                            Role
                          </button>
                          <button
                            onClick={(e) => triggerResetPassword(user, e)}
                            className="w-16 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:border-gray-300 font-semibold cursor-pointer rounded-md text-[11px] transition-all"
                          >
                            Reset
                          </button>
                          <button
                            onClick={(e) => forceMfaEnrollment(user, e)}
                            className="w-16 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:border-gray-300 font-semibold cursor-pointer rounded-md text-[11px] transition-all"
                          >
                            MFA
                          </button>
                          <button
                            onClick={(e) => toggleSuspendStatus(user, e)}
                            className={`w-16 py-1 text-center bg-white border border-gray-200 font-semibold cursor-pointer rounded-md text-[11px] transition-all ${
                              user.status === "Suspended" ? "text-teal-600 hover:border-teal-200" : "text-amber-600 hover:border-amber-200"
                            }`}
                          >
                            {user.status === "Suspended" ? "Activate" : "Suspend"}
                          </button>
                          {user.organizationId ? (
                            <button
                              onClick={(e) => promptRemoveFromOrg(user, e)}
                              className="w-16 py-1 text-center bg-white border border-gray-200 text-orange-600 hover:border-orange-200 font-semibold cursor-pointer rounded-md text-[11px] transition-all"
                            >
                              Detach
                            </button>
                          ) : (
                            <button
                              onClick={(e) => promptConfirmDelete(user, e)}
                              className="w-16 py-1 text-center bg-white border border-gray-200 text-rose-600 hover:border-rose-200 font-bold cursor-pointer rounded-md text-[11px] transition-all"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RETRIEVAL PROFILE SYSTEM DRAWER */}
      {drawerUserId && activeDrawerUser && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-base shadow-sm">
                {activeDrawerUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 truncate max-w-xs">{activeDrawerUser.name}</h3>
                <p className="text-[11px] font-mono text-gray-400">{activeDrawerUser.id}</p>
              </div>
            </div>
            <button onClick={() => setDrawerUserId(null)} className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-gray-700">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Identity Account File Dossier</h4>
            <div className="bg-gray-50/60 border border-gray-150 rounded-xl p-3.5 space-y-2.5">
              <div className="flex justify-between items-center"><span className="text-gray-400">Email Address</span><span className="font-mono text-gray-900 font-medium">{activeDrawerUser.email}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">Organization</span><span className="font-semibold text-gray-900">{activeDrawerUser.organization || "None"}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">System Role</span><span className="px-2 py-0.5 rounded border border-gray-200 bg-white text-[11px] font-medium text-gray-700">{activeDrawerUser.role}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">MFA Setup</span><span className="font-medium text-gray-900">{activeDrawerUser.mfaEnabled ? "Active (Push Verification)" : "Disabled"}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">Created At</span><span className="text-gray-500">{new Date(activeDrawerUser.joinedAt).toLocaleDateString()}</span></div>
            </div>

            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-2 block">Login History Handshake Trail (Last 3 Sessions)</h4>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="border border-gray-200 p-2.5 rounded-lg bg-gray-50/50 flex justify-between items-center">
                <div><p className="font-semibold text-gray-900 font-sans">Chrome 125 &bull; Windows 11 Desktop</p><p className="text-[10px] text-gray-400 mt-0.5">IP: 192.168.1.42 (Current Active Frame)</p></div>
                <span className="text-teal-600 font-bold text-[10px] font-sans">ACTIVE</span>
              </div>
              <div className="border border-gray-200 p-2.5 rounded-lg bg-gray-50/50 flex justify-between items-center">
                <div><p className="font-semibold text-gray-800 font-sans">Safari Mobile &bull; iOS iPhone 15 Pro</p><p className="text-[10px] text-gray-400 mt-0.5">IP: 203.0.113.88 &bull; Delhi, IN</p></div>
                <span className="text-gray-400 text-[10px] font-sans">2 hours ago</span>
              </div>
              <div className="border border-gray-200 p-2.5 rounded-lg bg-gray-50/50 flex justify-between items-center">
                <div><p className="font-semibold text-gray-800 font-sans">Firefox Stable &bull; Linux Ubuntu Desktop</p><p className="text-[10px] text-gray-400 mt-0.5">IP: 45.79.12.11 &bull; Mumbai, IN</p></div>
                <span className="text-gray-400 text-[10px] font-sans">3 days ago</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
            <button onClick={(e) => toggleSuspendStatus(activeDrawerUser, e)} className="flex-1 px-3 py-2 text-xs bg-gray-950 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm cursor-pointer">
              {activeDrawerUser.status === "Suspended" ? "Activate Account" : "Suspend Account"}
            </button>
            <button onClick={(e) => promptConfirmDelete(activeDrawerUser, e)} className="px-4 py-2 text-xs bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold rounded-lg cursor-pointer">
              Purge Profile
            </button>
          </div>
        </div>
      )}

      {/* INVITE PIPELINE USER DIALOG MODAL */}
      {isInviteOpen && (
        <Modal onClose={() => setIsInviteOpen(false)}>
          <ModalHeader icon={Users} title="Invite new platform user" onClose={() => setIsInviteOpen(false)} />
          <form onSubmit={handleInviteSubmit} className="p-5 space-y-4 text-xs">
            <Field label="Display name identity" required>
              <input type="text" required placeholder="John Doe" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Contact login email endpoint" required>
              <input type="email" required placeholder="johndoe@corporate.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className={`${inputClass} font-mono`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Assign target workspace organization" required>
                <select required value={formOrgId} onChange={(e) => setFormOrgId(e.target.value)} className={inputClass}>
                  <option value="" disabled>Choose mapping registry...</option>
                  {orgs.map(org => (
                    <option key={org.id} value={org.id}>{org.name} ({org.userCount}/{org.seatLimit} seats)</option>
                  ))}
                </select>
              </Field>
              <Field label="Security clearance role vector" required>
                <select value={formRole} onChange={(e) => setFormRole(e.target.value as any)} className={inputClass}>
                  <option value="Employee">Employee Tier</option>
                  <option value="Manager">Manager Group</option>
                  <option value="HR Manager">HR Operations</option>
                  <option value="Org Admin">Organization Admin</option>
                  <option value="Super Admin">System Super Admin</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setIsInviteOpen(false)} className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer">Dispatch invite packet</button>
            </div>
          </form>
        </Modal>
      )}

      {/* SECURITY ROLE CONVERSION MODAL */}
      {isEditRoleOpen && selectedUserForRole && (
        <Modal onClose={() => setIsEditRoleOpen(false)}>
          <ModalHeader icon={Key} title={`Reassign role \u2022 ${selectedUserForRole.name}`} onClose={() => setIsEditRoleOpen(false)} />
          <form onSubmit={handleRoleSave} className="p-5 space-y-4 text-xs">
            <p className="text-gray-600 leading-relaxed">Modify internal clear-out privilege configurations parameters for account profile <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-900">{selectedUserForRole.email}</span>.</p>
            <Field label="Target authorization scope hierarchy">
              <select value={editRoleValue} onChange={(e) => setEditRoleValue(e.target.value as any)} className={inputClass}>
                <option value="Employee">Employee Tier</option>
                <option value="Manager">Manager Group</option>
                <option value="HR Manager">HR Operations</option>
                <option value="Org Admin">Organization Admin</option>
                <option value="Super Admin">System Super Admin</option>
              </select>
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setIsEditRoleOpen(false)} className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer">Save configurations</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ORG ROSTER DETACHMENT DIALOG */}
      {isRemoveConfirmOpen && selectedUserOperator && (
        <Modal onClose={() => setIsRemoveConfirmOpen(false)} maxWidth="max-w-sm">
          <div className="p-5 text-xs">
            <div className="flex items-center gap-2.5 text-orange-600 mb-3 font-semibold">
              <UserMinus className="w-5 h-5 shrink-0" />
              <h4>Detach user from tenant grid workspace?</h4>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              This action removes <strong className="text-gray-900">{selectedUserOperator.name}</strong> from the roster of <strong>{selectedUserOperator.organization}</strong>. The profile will remain intact but will have no workspace associations.
            </p>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setIsRemoveConfirmOpen(false)} className="px-3.5 py-1.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleRemoveFromOrgConfirm} className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg cursor-pointer">Detach user</button>
            </div>
          </div>
        </Modal>
      )}

      {/* CRITICAL PURGE PROFILE DIALOG */}
      {isDeleteOpen && selectedUserOperator && (
        <Modal onClose={() => setIsDeleteOpen(false)}>
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-rose-800 font-semibold">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <Trash2 className="w-4 h-4 text-rose-600" /> Purge global account profile
            </div>
            <button onClick={() => setIsDeleteOpen(false)} className="text-rose-400 hover:text-rose-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <p className="text-gray-600 leading-relaxed">This completely strips account metadata files traces for global user profile <strong className="text-rose-700">{selectedUserOperator.name}</strong> from database registers index clusters.</p>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-rose-800 font-medium">
              Type validation key email address <strong className="font-mono text-rose-950 font-bold">{selectedUserOperator.email}</strong> below:
            </div>
            <input
              type="text"
              placeholder="Confirm account email endpoint typing..."
              value={deleteInputEmail}
              onChange={(e) => setDeleteInputEmail(e.target.value)}
              className="w-full bg-rose-50 border border-rose-200 text-rose-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 rounded-lg p-2.5 font-mono text-center text-xs"
            />
            <div className="flex justify-end gap-2.5 pt-1">
              <button onClick={() => setIsDeleteOpen(false)} className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteInputEmail !== selectedUserOperator.email}
                className={`px-3.5 py-2 rounded-lg font-semibold text-white shadow-sm transition-colors cursor-pointer ${
                  deleteInputEmail === selectedUserOperator.email ? "bg-rose-600 hover:bg-rose-700" : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---- Reusable Structural Layout Context Presentational Helpers ----

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ children, onClose, maxWidth = "max-w-md" }: { children: React.ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl w-full ${maxWidth}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, onClose }: { icon: React.ComponentType<{ className?: string }>; title: string; onClose: () => void }) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-600" />
        {title}
      </h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
      <span className="text-[10px] uppercase font-semibold text-gray-400">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0.5 pr-5 focus:outline-none font-medium appearance-none cursor-pointer z-10 select-none"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none z-0" />
      </div>
    </div>
  );
}