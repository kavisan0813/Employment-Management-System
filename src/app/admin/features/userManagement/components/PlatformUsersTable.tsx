import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Edit,
  KeyRound,
  UserX,
  UserCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useUserManagement } from "../hooks/useUserManagement";
import { PlatformUser } from "../../../types";

// FilterSelect Component
interface FilterSelectProps {
  filters: any;
  organizations: any[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  filters,
  organizations,
}) => {
  return (
    <div className="flex items-center gap-2">
      <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500">
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="User">User</option>
      </select>

      <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500">
        <option value="">All Organizations</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const PlatformUsersTable: React.FC = () => {
  const { filteredUsers, filters, organizations, actions } =
    useUserManagement();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<PlatformUser | null>(null);

  // ====================== ACTION HANDLERS ======================

  const handleViewUser = (user: PlatformUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
    setOpenMenu(null);
  };

  const handleEditUser = (user: PlatformUser) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setIsEditModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleResetPassword = (user: PlatformUser) => {
    if (window.confirm(`Send password reset link to ${user.email}?`)) {
      setTimeout(() => {
        alert(`Password reset link sent to ${user.email}`);
      }, 300);
    }
    setOpenMenu(null);
  };

  const handleSuspendUser = (user: PlatformUser) => {
    if (window.confirm(`Suspend user ${user.name}?`)) {
      actions.updateUserStatus(user.id, "Suspended");
      alert(`${user.name} has been suspended.`);
    }
    setOpenMenu(null);
  };

  const handleActivateUser = (user: PlatformUser) => {
    if (window.confirm(`Activate user ${user.name}?`)) {
      actions.updateUserStatus(user.id, "Active");
      alert(`${user.name} has been activated.`);
    }
    setOpenMenu(null);
  };

  const handleDeleteUser = (user: PlatformUser) => {
    if (window.confirm(`Delete ${user.name} permanently?`)) {
      actions.deleteUser(user.id);
      alert(`${user.name} has been deleted.`);
    }
    setOpenMenu(null);
  };

  // ====================== MODALS ======================

  const PlatformUserModal = () => {
    if (!selectedUser) return null;
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
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
              <p className="text-gray-500 mt-1">{selectedUser.name}</p>
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
                  Email
                </p>
                <p className="font-medium text-gray-900">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Role
                </p>
                <p className="font-semibold text-indigo-600">
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Organization
                </p>
                <p className="font-medium text-gray-900">
                  {selectedUser.organization}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Last Active
                </p>
                <p className="font-medium text-gray-900">
                  {selectedUser.lastLoginAt}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Status
              </p>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  selectedUser.status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {selectedUser.status}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                Manage User
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleEditUser(selectedUser)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleResetPassword(selectedUser)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4" /> Password Reset
                </button>
                {selectedUser.status === "Active" ? (
                  <button
                    onClick={() => handleSuspendUser(selectedUser)}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <UserX className="w-4 h-4" /> Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateUser(selectedUser)}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" /> Activate
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteUser(selectedUser);
                    setIsDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
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

  const EditModal = () => {
    if (!formData) return null;

    const handleSave = () => {
      if (!formData) return;
      actions.updateUser(formData.id, formData);
      alert("User updated successfully!");
      setIsEditModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Edit User</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Full Name"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Email Address"
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Active" | "Suspended",
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
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
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Save Changes
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
            <Users className="w-5 h-5 text-indigo-600" />
            Platform Users
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage all platform users, their roles, and system access.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Search & Filter Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterSelect filters={filters} organizations={organizations} />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4 text-left text-sm font-medium text-gray-500 rounded-tl-2xl">
                    User
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">
                    Organization
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">
                    Last Active
                  </th>
                  <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user: PlatformUser) => (
                  <tr
                    key={user.id}
                    onClick={() => handleViewUser(user)}
                    className="hover:bg-gray-50 cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {user.organization}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {user.lastLoginAt}
                    </td>
                    <td
                      className="px-5 py-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleViewUser(user)}
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
      {isDrawerOpen && <PlatformUserModal />}
      {isEditModalOpen && <EditModal />}
    </div>
  );
};

export default PlatformUsersTable;
