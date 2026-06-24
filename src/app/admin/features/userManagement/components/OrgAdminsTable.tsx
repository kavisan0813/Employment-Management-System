import React, { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import {
  Building2,
  MoreVertical,
  Eye,
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
  const orgAdmins: OrgAdmin[] = users.filter((u: any) => u.role === "Org Admin");

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
      setTimeout(() => alert(`Password reset link sent to ${admin.email}`), 300);
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

  const OrgAdminDrawer = () => {
    if (!selectedAdmin) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsDrawerOpen(false)}>
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Org Admin Profile
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
                selectedAdmin.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span className="text-xs font-semibold">{selectedAdmin.status} Admin</span>
            </div>

            {/* Profile Info */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                <div className="text-xl font-bold text-indigo-700">
                  {selectedAdmin.name.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedAdmin.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">{selectedAdmin.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="px-5 py-4 space-y-0.5">
              <InfoRow label="Organization" value={selectedAdmin.organization} />
              <InfoRow label="Status" value={selectedAdmin.status} />
            </div>
          </div>

          {/* Footer Actions (Scrollable wrap) */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => handleEditAdmin(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Admin
            </button>
            <button
              onClick={() => handleViewOrganization(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" /> View Org
            </button>
            <button
              onClick={() => handleManageEmployees(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" /> Manage Employees
            </button>
            <button
              onClick={() => handleResetPassword(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" /> Reset Password
            </button>
            <button
              onClick={() => handleResendInvitation(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" /> Resend Invite
            </button>
            <button
              onClick={() => handleManagePermissions(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-100 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> Permissions
            </button>

            {selectedAdmin.status === "Active" ? (
              <button
                onClick={() => handleSuspendAdmin(selectedAdmin)}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" /> Suspend
              </button>
            ) : (
              <button
                onClick={() => handleActivateAdmin(selectedAdmin)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" /> Activate
              </button>
            )}

            <button
              onClick={() => handleTransferOwnership(selectedAdmin)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold hover:bg-purple-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Transfer Owner
            </button>

            <button
              onClick={() => { handleRemoveAdmin(selectedAdmin); setIsDrawerOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Suspended" })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border rounded-xl">
              Cancel
            </button>
            <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
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
                <td className="px-5 py-4 rounded-tr-2xl">
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
              </tr>
            ))}

            {orgAdmins.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                  No Organization Admins found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isDrawerOpen && <OrgAdminDrawer />}
      {isEditModalOpen && <EditModal />}
      </div>
    </div>
  );
}