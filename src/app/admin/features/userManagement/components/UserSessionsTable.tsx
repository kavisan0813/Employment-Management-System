import React, { useState } from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { Monitor, MoreVertical, Eye, MapPin, AlertTriangle, Slash, LogOut, X } from "lucide-react";

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

export function UserSessionsTable() {
  const { sessions, actions } = useUserManagement();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewSession = (session: any) => {
    setSelectedSession(session);
    setIsDrawerOpen(true);
    setOpenMenu(null);
  };

  const SessionDrawer = () => {
    if (!selectedSession) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsDrawerOpen(false)}>
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Session Details
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
                selectedSession.status === "Active" ? "bg-teal-50 text-teal-700 border-teal-200" : selectedSession.status === "Expired" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span className="text-xs font-semibold">{selectedSession.status} Session</span>
            </div>

            {/* Profile Info */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                <div className="text-xl font-bold text-indigo-700">
                  {selectedSession.userName.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedSession.userName}</p>
                <p className="text-[11px] text-gray-400 font-mono">{selectedSession.userEmail}</p>
              </div>
            </div>

            {/* Details */}
            <div className="px-5 py-4 space-y-0.5">
              <InfoRow label="Device & Browser" value={`${selectedSession.device} \u2022 ${selectedSession.browser}`} />
              <InfoRow label="IP Address" value={selectedSession.ipAddress} />
              <InfoRow label="Login Time" value={new Date(selectedSession.loginTime).toLocaleString()} />
              <InfoRow label="Status" value={selectedSession.status} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => { alert(`Location: ${selectedSession.ipAddress}`); setIsDrawerOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" /> View Location
            </button>
            <button
              onClick={() => { alert(`Marking session ${selectedSession.id} as suspicious...`); setIsDrawerOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Mark Suspicious
            </button>
            <button
              onClick={() => { alert(`Device ${selectedSession.device} blocked.`); setIsDrawerOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 cursor-pointer"
            >
              <Slash className="w-3.5 h-3.5" /> Block Device
            </button>
            {selectedSession.status === "Active" && (
              <button
                onClick={() => { actions.killSession(selectedSession.id); setIsDrawerOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" /> Force Logout
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
            <Monitor className="w-5 h-5 text-indigo-600" />
            Active User Sessions
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Monitor and manage active logins, IP addresses, and connected devices.
          </p>
        </div>
        <button
          onClick={actions.killAllSessions}
          className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          Terminate All Sessions
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4 rounded-tl-2xl">User</th>
              <th className="px-5 py-4">Device / Browser</th>
              <th className="px-5 py-4">IP Address</th>
              <th className="px-5 py-4">Login Time</th>
              <th className="px-5 py-4 text-center rounded-tr-2xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {sessions.map((session) => (
              <tr
                key={session.id}
                onClick={() => handleViewSession(session)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4 group-hover:text-indigo-600 transition-colors">
                  <div className="font-medium text-gray-900">
                    {session.userName}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {session.userEmail}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-700">
                  {session.device} &bull; {session.browser}
                </td>
                <td className="px-5 py-4 font-mono text-gray-500">
                  {session.ipAddress}
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {new Date(session.loginTime).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-center rounded-tr-2xl">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      session.status === "Active"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : session.status === "Expired"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
      </div>
      
      {/* Modals */}
      {isDrawerOpen && <SessionDrawer />}
    </div>
  );
}
