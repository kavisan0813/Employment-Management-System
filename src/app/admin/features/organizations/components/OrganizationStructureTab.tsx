import { useState, useEffect } from "react";
import { Organization } from "../../../types";
import { MapPin, Building2, Plus, Trash2, Sparkles, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";
import { PermissionGate } from "../../../../shared/permission-engine/PermissionGate";

export function OrganizationStructureTab({
  org,
  hook,
}: {
  org: Organization;
  hook?: {
    actions: {
      updateOrg: (id: string, updates: Partial<Organization>) => void;
    };
  };
}) {
  const { hasPermissionKey } = usePermissions();

  const [branches, setBranches] = useState<string[]>(
    org.branches || ["HQ Main Branch"],
  );
  const [departments, setDepartments] = useState<string[]>(
    org.departments || ["Engineering", "Human Resources", "Finance"],
  );

  // Sync state when active org changes to prevent stale data leakage across orgs
  useEffect(() => {
    setBranches(org.branches || ["HQ Main Branch"]);
    setDepartments(org.departments || ["Engineering", "Human Resources", "Finance"]);
  }, [org.id, org.branches, org.departments]);

  const [newBranch, setNewBranch] = useState("");
  const [newDept, setNewDept] = useState("");

  // Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "branch" | "department";
    name: string;
    index: number;
  } | null>(null);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: You do not have permission to manage organization structure.");
      return;
    }
    if (!newBranch.trim()) return;
    if (branches.includes(newBranch.trim())) {
      toast.error("Branch already exists.");
      return;
    }
    const updated = [...branches, newBranch.trim()];
    setBranches(updated);
    setNewBranch("");
    saveStructure(updated, departments);
  };

  const confirmDeleteBranch = (index: number) => {
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: You do not have permission to delete branch locations.");
      return;
    }
    setDeleteTarget({ type: "branch", name: branches[index], index });
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: You do not have permission to manage organization structure.");
      return;
    }
    if (!newDept.trim()) return;
    if (departments.includes(newDept.trim())) {
      toast.error("Department already exists.");
      return;
    }
    const updated = [...departments, newDept.trim()];
    setDepartments(updated);
    setNewDept("");
    saveStructure(branches, updated);
  };

  const confirmDeleteDept = (index: number) => {
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: You do not have permission to delete departments.");
      return;
    }
    setDeleteTarget({ type: "department", name: departments[index], index });
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: Insufficient authorization.");
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget.type === "branch") {
      const updated = branches.filter((_, i) => i !== deleteTarget.index);
      setBranches(updated);
      saveStructure(updated, departments);
      toast.success(`Branch "${deleteTarget.name}" removed from ${org.name}.`);
    } else {
      const updated = departments.filter((_, i) => i !== deleteTarget.index);
      setDepartments(updated);
      saveStructure(branches, updated);
      toast.success(`Department "${deleteTarget.name}" removed from ${org.name}.`);
    }
    setDeleteTarget(null);
  };

  const saveStructure = (updatedBranches: string[], updatedDepts: string[]) => {
    if (hook?.actions?.updateOrg) {
      hook.actions.updateOrg(org.id, {
        branches: updatedBranches,
        departments: updatedDepts,
      });
    }
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Tenant Branches & Department Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure locations, offices, and departmental hierarchy for <strong className="text-gray-900">{org.name}</strong>.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branches / Locations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Branch Locations ({branches.length})
              </h2>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
              <form onSubmit={handleAddBranch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter new branch location..."
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </PermissionGate>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {branches.map((b, idx) => (
                <div
                  key={`${org.id}-branch-${idx}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{b}</span>
                  </div>
                  <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
                    <button
                      onClick={() => confirmDeleteBranch(idx)}
                      className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </PermissionGate>
                </div>
              ))}
              {branches.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">
                  No branch locations configured yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Configured Departments ({departments.length})
              </h2>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>

            <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
              <form onSubmit={handleAddDept} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter new department name..."
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </PermissionGate>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {departments.map((d, idx) => (
                <div
                  key={`${org.id}-dept-${idx}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>{d}</span>
                  </div>
                  <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
                    <button
                      onClick={() => confirmDeleteDept(idx)}
                      className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </PermissionGate>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">
                  No departments configured yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Confirm Deletion
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-600 my-4 leading-relaxed font-medium">
              Are you sure you want to remove the {deleteTarget.type}{" "}
              <strong className="text-gray-900">"{deleteTarget.name}"</strong> from{" "}
              <strong className="text-gray-900">{org.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Delete {deleteTarget.type === "branch" ? "Branch" : "Department"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
