import { useState } from "react";
import {
  Shield,
  MoreVertical,
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
  Plus,
} from "lucide-react";
import { useUserManagement } from "../hooks/useUserManagement";

interface Role {
  id: string;
  name: string;
  description: string;
  type: "System" | "Custom";
  hierarchyLevel: number;
  status: "Active" | "Disabled" | "Inactive";
  assignedUsers?: number;
  permissions?: Record<string, boolean>;
}

export function RoleManagementView() {
  const { roles, setRoles } = useUserManagement();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    alert(
      `Showing users assigned to role: ${role.name} (${role.assignedUsers || 0} users)`,
    );
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
    alert(
      `Role Analytics for ${role.name}\nUsage: ${role.assignedUsers || 0} users\nHierarchy Level: ${role.hierarchyLevel}`,
    );
    setOpenMenu(null);
  };

  const handleOrganizationAssignment = (role: Role) => {
    alert(`Managing Organization Assignment for role: ${role.name}`);
    setOpenMenu(null);
  };

  const handleChangeHierarchy = (role: Role) => {
    const newLevel = prompt(
      `Enter new hierarchy level for ${role.name} (current: ${role.hierarchyLevel})`,
      role.hierarchyLevel.toString(),
    );
    if (newLevel) {
      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === role.id ? { ...r, hierarchyLevel: parseInt(newLevel) } : r,
        ),
      );
      alert(`Hierarchy level updated for ${role.name}`);
    }
    setOpenMenu(null);
  };

  const handleDisableRole = (role: Role) => {
    if (window.confirm(`Disable role "${role.name}"?`)) {
      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === role.id ? { ...r, status: "Disabled" } : r,
        ),
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

  // ====================== CREATE NEW ROLE ======================
  const handleCreateRole = () => {
    setIsCreateModalOpen(true);
  };

  const CreateRoleModal = () => {
    const [newRole, setNewRole] = useState({
      name: "",
      description: "",
      hierarchyLevel: 5,
    });

    const handleSave = () => {
      if (!newRole.name.trim()) {
        alert("Role name is required");
        return;
      }

      const createdRole: Role = {
        id: `role-${Date.now()}`,
        name: newRole.name.trim(),
        description: newRole.description.trim() || "Custom role",
        type: "Custom",
        hierarchyLevel: newRole.hierarchyLevel,
        status: "Active",
        assignedUsers: 0,
      };

      setRoles((prev: any[]) => [...prev, createdRole]);
      alert(`Custom role "${createdRole.name}" created successfully!`);
      setIsCreateModalOpen(false);
      setNewRole({ name: "", description: "", hierarchyLevel: 5 });
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Create Custom Role</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <textarea
              placeholder="Description"
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl h-24"
            />
            <input
              type="number"
              placeholder="Hierarchy Level"
              value={newRole.hierarchyLevel}
              onChange={(e) =>
                setNewRole({
                  ...newRole,
                  hierarchyLevel: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 py-3 border border-gray-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Create Role
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ====================== PERMISSIONS MODAL (with Save) ======================
  const PermissionsModal = () => {
    if (!selectedRole) return null;

    const [permissions, setPermissions] = useState<Record<string, boolean>>(
      selectedRole.permissions || {
        users: true,
        organizations: true,
        billing: false,
        reports: true,
        settings: false,
      },
    );

    const togglePermission = (key: string) => {
      setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSavePermissions = () => {
      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === selectedRole.id ? { ...r, permissions } : r,
        ),
      );
      alert(
        `Permissions for "${selectedRole.name}" have been saved successfully!`,
      );
      setIsPermissionsModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-2">Manage Permissions</h2>
          <p className="text-gray-500 mb-6">
            Role:{" "}
            <span className="font-medium text-gray-900">
              {selectedRole.name}
            </span>
          </p>

          <div className="space-y-3">
            {Object.entries(permissions).map(([key, enabled]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50"
              >
                <div className="capitalize font-medium">
                  {key.replace(/([A-Z])/g, " $1")}
                </div>
                <button
                  onClick={() =>
                    togglePermission(key as keyof typeof permissions)
                  }
                  className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${enabled ? "right-0.5" : "left-0.5"}`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsPermissionsModalOpen(false)}
              className="flex-1 py-3 border border-gray-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePermissions}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Save Matrix
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ====================== EDIT MODAL ======================
  const EditModal = () => {
    if (!selectedRole) return null;

    const [editedRole, setEditedRole] = useState({
      name: selectedRole.name,
      description: selectedRole.description,
      hierarchyLevel: selectedRole.hierarchyLevel,
    });

    const handleSave = () => {
      if (!editedRole.name.trim()) {
        alert("Role name is required");
        return;
      }

      setRoles((prev: any[]) =>
        prev.map((r: any) =>
          r.id === selectedRole.id
            ? {
                ...r,
                name: editedRole.name.trim(),
                description: editedRole.description.trim(),
                hierarchyLevel: editedRole.hierarchyLevel,
              }
            : r,
        ),
      );

      alert(`Role "${editedRole.name}" updated successfully!`);
      setIsEditModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Edit Role</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Role Name"
              value={editedRole.name}
              onChange={(e) =>
                setEditedRole({ ...editedRole, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <textarea
              placeholder="Description"
              value={editedRole.description}
              onChange={(e) =>
                setEditedRole({ ...editedRole, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl h-24"
            />
            <input
              type="number"
              placeholder="Hierarchy Level"
              value={editedRole.hierarchyLevel}
              onChange={(e) =>
                setEditedRole({
                  ...editedRole,
                  hierarchyLevel: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RoleModal = () => {
    if (!selectedRole) return null;
    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={() => setIsDrawerOpen(false)}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Role Profile</h2>
              <p className="text-gray-500 mt-1">{selectedRole.name}</p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Description
                </p>
                <p className="font-medium text-gray-900">
                  {selectedRole.description}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Hierarchy Level
                </p>
                <p className="font-semibold text-indigo-600">
                  Level {selectedRole.hierarchyLevel}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Assigned Users
                </p>
                <p className="font-medium text-gray-900">
                  {selectedRole.assignedUsers || 0}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Type
                </p>
                <p className="font-mono text-gray-500">
                  {selectedRole.type} Role
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Status
              </p>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  selectedRole.status === "Active"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {selectedRole.status} Role
              </span>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                Manage Role
              </p>
              <div className="grid grid-cols-2 gap-3">
                {selectedRole.type === "Custom" && (
                  <button
                    onClick={() => handleEditRole(selectedRole)}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit Role
                  </button>
                )}
                <button
                  onClick={() => handleManagePermissions(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Lock className="w-4 h-4" /> Permissions
                </button>
                <button
                  onClick={() => handleViewAssignedUsers(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4" /> View Users
                </button>
                <button
                  onClick={() => handleCloneRole(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" /> Clone Role
                </button>
                <button
                  onClick={() => handleRoleAnalytics(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" /> Analytics
                </button>
                <button
                  onClick={() => handleOrganizationAssignment(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Building2 className="w-4 h-4" /> Assign Orgs
                </button>
                <button
                  onClick={() => handleChangeHierarchy(selectedRole)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Change Hierarchy
                </button>
                {selectedRole.type === "Custom" &&
                  selectedRole.status !== "Disabled" && (
                    <button
                      onClick={() => handleDisableRole(selectedRole)}
                      className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <Ban className="w-4 h-4" /> Disable Role
                    </button>
                  )}
                {selectedRole.type === "Custom" && (
                  <button
                    onClick={() => {
                      handleDeleteRole(selectedRole);
                      setIsDrawerOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Role
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-2xl transition-colors"
            >
              Close
            </button>
          </div>
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
        <button
          onClick={handleCreateRole}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* Table Section */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4 rounded-tl-2xl">Role Name</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4 text-center">Type</th>
                  <th className="px-5 py-4 text-center">Hierarchy Level</th>
                  <th className="px-5 py-4 text-right rounded-tr-2xl">
                    Actions
                  </th>
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
                        className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${role.type === "System" ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        {role.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-gray-500">
                      Lvl {role.hierarchyLevel}
                    </td>
                    <td
                      className="px-5 py-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleViewRole(role as Role)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isDrawerOpen && <RoleModal />}
      {isEditModalOpen && <EditModal />}
      {isPermissionsModalOpen && <PermissionsModal />}
      {isCreateModalOpen && <CreateRoleModal />}
    </div>
  );
}
