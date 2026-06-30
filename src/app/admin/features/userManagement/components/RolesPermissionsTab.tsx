import React, { useState } from "react";
import useSWR from "swr";
import { fetchRoles, createRole, updateRole, deleteRole, Role, RolePermissions } from "../services/userServices";
import { Shield, ShieldAlert, Users, Plus, Check, X, AlertTriangle, Trash2 } from "lucide-react";

export function RolesPermissionsTab() {
  const { data: roles, error, isLoading, mutate } = useSWR("roles", fetchRoles);

  const [isCreating, setIsCreating] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePerms, setNewRolePerms] = useState<RolePermissions>({
    employee: { view: false, create: false, edit: false, delete: false },
    leave: { view: false, approve: false, reject: false },
    payroll: { view: false, edit: false, generate_payslip: false },
    reports: { view: false },
    settings: { edit: false },
    billing: { view: false, edit: false }
  });
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const closeModal = () => {
    setIsCreating(false);
    setEditingRole(null);
    setNewRoleName("");
    setNewRolePerms({
      employee: { view: false, create: false, edit: false, delete: false },
      leave: { view: false, approve: false, reject: false },
      payroll: { view: false, edit: false, generate_payslip: false },
      reports: { view: false },
      settings: { edit: false },
      billing: { view: false, edit: false }
    });
    setCreateError("");
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (newRoleName.length < 3 || newRoleName.length > 50) {
      setCreateError("Role name must be between 3 and 50 characters");
      return;
    }
    
    // Check if at least 1 permission selected
    const hasPerm = Object.values(newRolePerms).some(mod => Object.values(mod).some(val => val));
    if (!hasPerm) {
      setCreateError("Select at least one permission");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingRole) {
        await updateRole(editingRole.id, { name: newRoleName, permissions: newRolePerms });
      } else {
        await createRole({ name: newRoleName, permissions: newRolePerms });
      }
      mutate();
      closeModal();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    if (deletingRole.userCount > 0 && deleteConfirmText !== "DELETE") {
      setDeleteError("Type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRole(deletingRole.id);
      mutate();
      setDeletingRole(null);
      setDeleteConfirmText("");
      setDeleteError("");
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPermissionGroup = (moduleName: string, perms: Record<string, boolean>) => {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 capitalize mb-2">{moduleName}</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(perms).map(([perm, granted]) => (
            <div key={perm} className="flex items-center gap-2 text-sm">
              {granted ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
              <span className={granted ? "text-gray-700 font-medium" : "text-gray-400"}>
                {perm.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 w-1/4 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 font-semibold mb-2">Failed to load roles</div>
        <button onClick={() => mutate()} className="text-sm text-indigo-600 hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Platform Roles</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles?.map(role => (
          <div key={role.id} className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${role.isSystemRole ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                   {role.isSystemRole ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{role.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium">
                    {role.isSystemRole ? (
                      <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">System Role</span>
                    ) : (
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Custom Role</span>
                    )}
                    <span className="text-gray-500 flex items-center gap-1">
                       <Users className="w-3 h-3" /> {role.userCount} users
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!role.isSystemRole && (
                  <button 
                    onClick={() => setDeletingRole(role)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-5 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
               {Object.entries(role.permissions).map(([mod, perms]) => (
                 <div key={mod} className="mb-2">
                   {renderPermissionGroup(mod, perms)}
                 </div>
               ))}
            </div>

            <div className="p-4 border-t border-gray-50 bg-gray-50/50 rounded-b-xl flex justify-end">
               <button 
                 disabled={role.name === "Super Admin"}
                 onClick={() => {
                   setEditingRole(role);
                   setNewRoleName(role.name);
                   setNewRolePerms(role.permissions);
                 }}
                 className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Edit Permissions
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Role Modal */}
      {(isCreating || editingRole) && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingRole ? "Edit Role" : "Create New Role"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveRole} className="overflow-y-auto flex-1 p-5">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role Name *</label>
                <input 
                  type="text"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="e.g. Regional Manager"
                  required
                  disabled={!!editingRole?.isSystemRole}
                />
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(newRolePerms).map(([mod, perms]) => (
                  <div key={mod} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 capitalize mb-3 border-b border-gray-200 pb-2">{mod}</h4>
                    <div className="space-y-2">
                      {Object.keys(perms).map(perm => (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={(newRolePerms as unknown as Record<string, Record<string, boolean>>)[mod][perm]}
                            onChange={(e) => {
                              setNewRolePerms(prev => ({
                                ...prev,
                                [mod]: {
                                  ...(prev as unknown as Record<string, Record<string, boolean>>)[mod],
                                  [perm]: e.target.checked
                                }
                              }));
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{perm.replace("_", " ")}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {createError && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {createError}
                </div>
              )}
            </form>
            
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
               <button 
                 type="button"
                 onClick={closeModal}
                 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveRole}
                 disabled={isSubmitting}
                 className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50"
               >
                 {isSubmitting ? 'Saving...' : (editingRole ? 'Update Role' : 'Save Role')}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRole && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-bold">Delete Role?</h2>
            </div>
            
            {deletingRole.userCount > 0 ? (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 mb-4 font-medium flex gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>{deletingRole.userCount} users currently have this role. They will lose access immediately.</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Please type <strong>DELETE</strong> to confirm deletion of the "{deletingRole.name}" role.
                </p>
                <input 
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 outline-none mb-1 text-sm"
                  placeholder="Type DELETE"
                />
              </>
            ) : (
               <p className="text-sm text-gray-600 mb-4">
                 Are you sure you want to delete the "{deletingRole.name}" role? This cannot be undone.
               </p>
            )}

            {deleteError && (
              <p className="text-sm text-red-600 mt-2">{deleteError}</p>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => {
                  setDeletingRole(null);
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRole}
                disabled={isDeleting || (deletingRole.userCount > 0 && deleteConfirmText !== "DELETE")}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
