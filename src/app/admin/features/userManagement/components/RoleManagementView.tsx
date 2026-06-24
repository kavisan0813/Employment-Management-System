import React, { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import {
  Shield,
  MoreVertical,
  Eye,
  Edit,
  Users,
  Copy,
  BarChart3,
  Building2,
  RefreshCw,
  Ban,
  Trash2,
  Lock,
  X,
} from "lucide-react";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: "System" | "Custom";
  hierarchyLevel: number;
  status: "Active" | "Disabled" | "Inactive";
  assignedUsers?: number;
}

export function RoleManagementView() {
  const { roles, setRoles } = useUserManagement(); // Assuming setRoles is available

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // ====================== ACTION HANDLERS ======================

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
    setOpenMenu(null);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
    setOpenMenu(null);
  };

  const handleViewAssignedUsers = (role: Role) => {
    alert(`Showing users assigned to role: ${role.name} (${role.assignedUsers || 0} users)`);
    setOpenMenu(null);
  };

  const handleCloneRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      id: `clone-${Date.now()}`,
      name: `${role.name} (Copy)`,
      type: "Custom",
    };
    setRoles((prev: any[]) => [...prev, newRole]);
    alert(`Role "${role.name}" cloned successfully!`);
    setOpenMenu(null);
  };

  const handleRoleAnalytics = (role: Role) => {
    alert(`Role Analytics for ${role.name}\nUsage: ${role.assignedUsers || 0} users\nHierarchy Level: ${role.hierarchyLevel}`);
    setOpenMenu(null);
  };

  const handleOrganizationAssignment = (role: Role) => {
    alert(`Managing Organization Assignment for role: ${role.name}`);
    setOpenMenu(null);
  };

  const handleChangeHierarchy = (role: Role) => {
    const newLevel = prompt(`Enter new hierarchy level for ${role.name} (current: ${role.hierarchyLevel})`, role.hierarchyLevel.toString());
    if (newLevel) {
      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === role.id ? { ...r, hierarchyLevel: parseInt(newLevel) } : r
        )
      );
      alert(`Hierarchy level updated for ${role.name}`);
    }
    setOpenMenu(null);
  };

  const handleDisableRole = (role: Role) => {
    if (window.confirm(`Disable role "${role.name}"?`)) {
      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === role.id ? { ...r, status: "Disabled" } : r
        )
      );
      alert(`Role "${role.name}" has been disabled.`);
    }
    setOpenMenu(null);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.type === "System") {
      alert("System roles cannot be deleted.");
      return;
    }
    if (window.confirm(`Delete role "${role.name}" permanently?`)) {
      setRoles((prev: any[]) => prev.filter((r: any) => r.id !== role.id));
      alert(`Role "${role.name}" has been deleted.`);
    }
    setOpenMenu(null);
  };

  // ====================== MODALS ======================

  const RoleDrawer = () => {
    if (!selectedRole) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsDrawerOpen(false)}>
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Role Profile
              </h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Status banner */}
            <div
              className={`mx-5 mt-5 flex items-center gap-2.5 px-4 py-3 rounded-lg border ${
                selectedRole.status === "Active" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span className="text-xs font-semibold">{selectedRole.status} Role</span>
            </div>

            {/* Profile Info */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                <div className="text-xl font-bold text-indigo-700">
                  {selectedRole.name.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedRole.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">{selectedRole.type} Role</p>
              </div>
            </div>

            {/* Details */}
            <div className="px-5 py-4 space-y-0.5">
              <InfoRow label="Description" value={selectedRole.description} />
              <InfoRow label="Hierarchy Level" value={`Level ${selectedRole.hierarchyLevel}`} />
              <InfoRow label="Assigned Users" value={selectedRole.assignedUsers || 0} />
            </div>
          </div>

          {/* Footer Actions (Scrollable wrap) */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            {selectedRole.type === "Custom" && (
              <button
                onClick={() => handleEditRole(selectedRole)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Role
              </button>
            )}
            <button
              onClick={() => handleManagePermissions(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Permissions
            </button>
            <button
              onClick={() => handleViewAssignedUsers(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" /> Users
            </button>
            <button
              onClick={() => handleCloneRole(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Clone
            </button>
            <button
              onClick={() => handleRoleAnalytics(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
            <button
              onClick={() => handleOrganizationAssignment(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" /> Org Assignment
            </button>
            <button
              onClick={() => handleChangeHierarchy(selectedRole)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Hierarchy
            </button>

            {selectedRole.type === "Custom" && (
              <>
                <button
                  onClick={() => handleDisableRole(selectedRole)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" /> Disable
                </button>

                <button
                  onClick={() => { handleDeleteRole(selectedRole); setIsDrawerOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    if (!selectedRole) return null;
    const [formData, setFormData] = useState(selectedRole);

    const handleSave = () => {
      setRoles((prev: any[]) =>
        prev.map((r: any) => (r.id === formData.id ? formData : r))
      );
      alert("Role updated successfully!");
      setIsEditModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Edit Role</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              placeholder="Role Name"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl h-24"
              placeholder="Description"
            />
            <input
              type="number"
              value={formData.hierarchyLevel}
              onChange={(e) => setFormData({ ...formData, hierarchyLevel: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const PermissionsModal = () => {
    if (!selectedRole) return null;
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6">Manage Permissions - {selectedRole.name}</h2>
          <p className="text-gray-500 mb-6">Configure access rights for this role (mock interface).</p>
          {/* Add permission toggles here in real implementation */}
          <div className="text-center py-8 text-gray-400">Permission matrix would go here...</div>
          <button
            onClick={() => setIsPermissionsModalOpen(false)}
            className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Role Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Define system roles and custom positions within the hierarchy.
          </p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
          Create Custom Role
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4 rounded-tl-2xl">Role Name</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4 text-center">Type</th>
              <th className="px-5 py-4 text-center rounded-tr-2xl">Hierarchy Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {roles.map((role: any) => (
              <tr
                key={role.id}
                onClick={() => handleViewRole(role as Role)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {role.name}
                </td>
                <td className="px-5 py-4 text-gray-600 max-w-xs truncate">
                  {role.description}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${
                      role.type === "System"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {role.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-center font-mono text-gray-500 rounded-tr-2xl">
                  Lvl {role.hierarchyLevel}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isDrawerOpen && <RoleDrawer />}
      {isEditModalOpen && <EditModal />}
      {isPermissionsModalOpen && <PermissionsModal />}
      </div>
    </div>
  );
}
