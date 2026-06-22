import React from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { Monitor, XCircle } from "lucide-react";

export function UserSessionsTable() {
  const { sessions, actions } = useUserManagement();

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-600" /> Active User Sessions
          </h2>
          <p className="text-xs text-gray-500">
            Monitor and manage active logins, IP addresses, and connected devices.
          </p>
        </div>
        <button className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
          Terminate All Sessions
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Device / Browser</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">Login Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Kill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {session.userName}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {session.userEmail}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {session.device} &bull; {session.browser}
                </td>
                <td className="px-4 py-3 font-mono text-gray-500">
                  {session.ipAddress}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(session.loginTime).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
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
                <td className="px-4 py-3 text-right">
                  {session.status === "Active" ? (
                    <button
                      onClick={() => actions.killSession(session.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Terminate Session"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
