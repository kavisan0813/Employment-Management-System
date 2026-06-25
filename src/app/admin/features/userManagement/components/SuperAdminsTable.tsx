import { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import {
  ShieldAlert,
  MoreVertical,
  ShieldOff,
  ShieldCheck,
  Mail,
  X,
} from "lucide-react";

export function SuperAdminsTable() {
  const { superAdmins, actions } = useUserManagement();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setIsDrawerOpen(true);
    setOpenMenu(null);
  };

  const handleDeactivate = (adminId: string, name: string) => {
    if (window.confirm(`Deactivate Super Admin ${name}?`)) {
      actions.updateSuperAdminStatus(adminId, "Inactive");
    }
    setOpenMenu(null);
  };

  const handleActivate = (adminId: string, name: string) => {
    if (window.confirm(`Activate Super Admin ${name}?`)) {
      actions.updateSuperAdminStatus(adminId, "Active");
    }
    setOpenMenu(null);
  };

  const SuperAdminModal = () => {
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
                Super Admin Profile
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
                  Specific Role
                </p>
                <p className="font-semibold text-indigo-600">
                  {selectedAdmin.role}
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
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {selectedAdmin.status}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                Manage Access
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    alert("Message functionality coming soon.");
                    setIsDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Send Message
                </button>

                {selectedAdmin.status === "Active" ? (
                  <button
                    onClick={() => {
                      handleDeactivate(selectedAdmin.id, selectedAdmin.name);
                      setIsDrawerOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-sm font-semibold hover:bg-rose-100 transition-colors"
                  >
                    <ShieldOff className="w-4 h-4" /> Revoke Access
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleActivate(selectedAdmin.id, selectedAdmin.name);
                      setIsDrawerOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-700 border border-teal-200 rounded-2xl text-sm font-semibold hover:bg-teal-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" /> Restore Access
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
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Super Admins
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Platform Owners with system-wide privileges.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Admin Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Specific Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {superAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    onClick={() => handleViewAdmin(admin)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {admin.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-[11px] font-bold text-indigo-700">
                        {admin.role}
                      </span>
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
                {superAdmins.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      No Super Admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isDrawerOpen && <SuperAdminModal />}
    </div>
  );
}
