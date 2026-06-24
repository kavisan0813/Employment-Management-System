import React, { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { ShieldAlert, MoreVertical, ShieldOff, ShieldCheck, Mail, X } from "lucide-react";


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

  const SuperAdminDrawer = () => {
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
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Super Admin Profile
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
                selectedAdmin.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
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
              <InfoRow label="Specific Role" value={selectedAdmin.role} />
              <InfoRow label="Status" value={selectedAdmin.status} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => { alert("Message functionality coming soon."); setIsDrawerOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" /> Send Message
            </button>

            {selectedAdmin.status === "Active" ? (
              <button
                onClick={() => { handleDeactivate(selectedAdmin.id, selectedAdmin.name); setIsDrawerOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 cursor-pointer ml-auto"
              >
                <ShieldOff className="w-3.5 h-3.5" /> Revoke Access
              </button>
            ) : (
              <button
                onClick={() => { handleActivate(selectedAdmin.id, selectedAdmin.name); setIsDrawerOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold hover:bg-teal-100 cursor-pointer ml-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Restore Access
              </button>
            )}
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
      {isDrawerOpen && <SuperAdminDrawer />}
    </div>
  );
}
