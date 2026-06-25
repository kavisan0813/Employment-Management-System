import React, { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import {
  Building2,
  MoreVertical,
  Edit,
  Users,
  KeyRound,
  Mail,
  Shield,
  UserX,
  UserCheck,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

interface OrgAdmin {
  id: string;
  name: string;
  email: string;
  organization: string;
  status: "Active" | "Suspended" | "Inactive" | "Pending";
  // Add other fields if needed from your User type
}

export function OrgAdminsTable() {
  const { users, actions } = useUserManagement();

  // Filter Org Admins
  const orgAdmins: OrgAdmin[] = users.filter(
    (u: any) => u.role === "Org Admin",
  );

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<OrgAdmin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ====================== ACTION HANDLERS ======================

  const handleViewAdmin = (admin: OrgAdmin) => {
    setSelectedAdmin(admin);
    setIsDrawerOpen(true);
    setOpenMenu(null);
  };

  const handleEditAdmin = (admin: OrgAdmin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleViewOrganization = (admin: OrgAdmin) => {
    alert(`Viewing organization: ${admin.organization}`);
    setOpenMenu(null);
  };

  const handleManageEmployees = (admin: OrgAdmin) => {
    alert(`Managing employees for: ${admin.organization}`);
    setOpenMenu(null);
  };

  const handleResetPassword = (admin: OrgAdmin) => {
    if (window.confirm(`Send password reset to ${admin.email}?`)) {
      setTimeout(
        () => alert(`Password reset link sent to ${admin.email}`),
        300,
      );
    }
    setOpenMenu(null);
  };

  const handleResendInvitation = (admin: OrgAdmin) => {
    alert(`Invitation resent to ${admin.email}`);
    setOpenMenu(null);
  };

  const handleManagePermissions = (admin: OrgAdmin) => {
    alert(`Managing permissions for ${admin.name}`);
    setOpenMenu(null);
  };

  const handleSuspendAdmin = (admin: OrgAdmin) => {
    if (window.confirm(`Suspend admin ${admin.name}?`)) {
      actions.updateUserStatus(admin.id, "Suspended");
      alert(`${admin.name} has been suspended.`);
    }
    setOpenMenu(null);
  };

  const handleActivateAdmin = (admin: OrgAdmin) => {
    if (window.confirm(`Activate admin ${admin.name}?`)) {
      actions.updateUserStatus(admin.id, "Active");
      alert(`${admin.name} has been activated.`);
    }
    setOpenMenu(null);
  };

  const handleTransferOwnership = (admin: OrgAdmin) => {
    if (window.confirm(`Transfer ownership for ${admin.organization}?`)) {
      alert(`Ownership transferred for ${admin.organization}`);
    }
    setOpenMenu(null);
  };

  const handleRemoveAdmin = (admin: OrgAdmin) => {
    if (window.confirm(`Remove ${admin.name} as admin?`)) {
      actions.deleteUser(admin.id);
      alert(`${admin.name} has been removed.`);
    }
    setOpenMenu(null);
  };

  // ====================== MODALS ======================

  const OrgAdminModal = () => {
    if (!selectedAdmin) return null;
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
              <h2 className="text-2xl font-bold text-gray-900">
                Org Admin Profile
              </h2>
              <p className="text-gray-500 mt-1">{selectedAdmin.name}</p>
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
                  {selectedAdmin.email}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Organization
                </p>
                <p className="font-semibold text-indigo-600">
                  {selectedAdmin.organization}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Status
              </p>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  selectedAdmin.status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {selectedAdmin.status}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                Manage Org Admin
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleEditAdmin(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit Admin
                </button>
                <button
                  onClick={() => handleViewOrganization(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Building2 className="w-4 h-4" /> View Org
                </button>
                <button
                  onClick={() => handleManageEmployees(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4" /> Manage Employees
                </button>
                <button
                  onClick={() => handleResetPassword(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4" /> Reset Password
                </button>
                <button
                  onClick={() => handleResendInvitation(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Resend Invite
                </button>
                <button
                  onClick={() => handleManagePermissions(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Shield className="w-4 h-4" /> Permissions
                </button>
                {selectedAdmin.status === "Active" ? (
                  <button
                    onClick={() => handleSuspendAdmin(selectedAdmin)}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <UserX className="w-4 h-4" /> Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateAdmin(selectedAdmin)}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" /> Activate
                  </button>
                )}
                <button
                  onClick={() => handleTransferOwnership(selectedAdmin)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-2xl text-xs font-semibold hover:bg-purple-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Transfer Owner
                </button>
                <button
                  onClick={() => {
                    handleRemoveAdmin(selectedAdmin);
                    setIsDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove
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
    if (!selectedAdmin) return null;
    const [formData, setFormData] = useState(selectedAdmin);

    const handleSave = () => {
      actions.updateUser(formData.id, formData);
      alert("Admin updated successfully!");
      setIsEditModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Edit Admin</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Active" | "Suspended",
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-3 border rounded-xl"
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

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Organization Admins
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Primary administrators and point of contacts for each tenant.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4 rounded-tl-2xl">Organization</th>
                  <th className="px-5 py-4">Admin Name</th>
                  <th className="px-5 py-4">Email Profile</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orgAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    onClick={() => handleViewAdmin(admin)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {admin.organization || "Unassigned"}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {admin.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          admin.status === "Active"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td
                      className="px-5 py-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleViewAdmin(admin)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {orgAdmins.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      No Organization Admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {isDrawerOpen && <OrgAdminModal />}
        {isEditModalOpen && <EditModal />}
      </div>
    </div>
  );
}
