import { useState } from "react";
import { Search, X, Laptop, Calendar } from "lucide-react";
import { LoginLog } from "../types/logs.types";

interface LoginLogsTableProps {
  logs: LoginLog[];
  organizations: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterByDate: (timestamp: string) => boolean;
}

export function LoginLogsTable({
  logs,
  organizations,
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  selectedStatus,
  setSelectedStatus,
  dateRange,
  setDateRange,
  filterByDate,
}: LoginLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    return (
      matchesSearch &&
      (selectedOrg === "ALL" || log.organization === selectedOrg) &&
      (selectedStatus === "ALL" || log.status === selectedStatus) &&
      filterByDate(log.loginTime)
    );
  });

  const closeModal = () => setSelectedLog(null);

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logins by user, email, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            {
              v: selectedOrg,
              s: setSelectedOrg,
              opts: [["ALL", "All Orgs"], ...organizations.map((o) => [o, o])],
            },
            {
              v: selectedStatus,
              s: setSelectedStatus,
              opts: [
                ["ALL", "All Statuses"],
                ["Success", "Success"],
                ["Failed", "Failed"],
              ],
            },
            {
              v: dateRange,
              s: setDateRange,
              opts: [
                ["ALL", "All Time"],
                ["TODAY", "Today"],
                ["WEEK", "Last 7 Days"],
              ],
            },
          ].map((f, i) => (
            <select
              key={i}
              value={f.v}
              onChange={(e) => f.s(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium outline-none focus:border-indigo-400"
            >
              {f.opts.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Org / Role</th>
              <th className="px-5 py-4">Login Time</th>
              <th className="px-5 py-4">Logout Time</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            {filtered.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div className="text-gray-900 font-semibold">{log.user}</div>
                  <div className="text-xs font-normal text-gray-500">
                    {log.email}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div>{log.organization}</div>
                  <div className="text-xs font-normal text-gray-500">
                    {log.role}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs">
                  {new Date(log.loginTime).toLocaleString()}
                </td>
                <td className="px-5 py-4 font-mono text-xs">
                  {log.logoutTime ? (
                    new Date(log.logoutTime).toLocaleString()
                  ) : (
                    <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${log.status === "Success" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"}`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td
                  className="px-5 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-gray-500 text-sm"
                >
                  No login logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ====================== CENTERED MODAL ====================== */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Session Audit Details
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* User Info */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-2xl font-semibold text-gray-900">
                  {selectedLog.user}
                </p>
                <p className="text-gray-500 mt-1">{selectedLog.email}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Organization
                  </span>
                  <p className="font-semibold text-lg">
                    {selectedLog.organization}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Role
                  </span>
                  <p className="font-semibold text-lg">{selectedLog.role}</p>
                </div>
              </div>

              {/* Login / Logout Times */}
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex gap-4">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Login Time
                    </p>
                    <p className="font-semibold mt-1">
                      {new Date(selectedLog.loginTime).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Logout Time
                    </p>
                    <p className="font-semibold mt-1">
                      {selectedLog.logoutTime ? (
                        new Date(selectedLog.logoutTime).toLocaleString()
                      ) : (
                        <span className="text-teal-600">
                          Session Still Active
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </span>
                <span
                  className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold ${selectedLog.status === "Success" ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700"}`}
                >
                  {selectedLog.status.toUpperCase()}
                </span>
              </div>

              {/* IP Address (if available) */}
              {selectedLog.ipAddress && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    IP Address
                  </span>
                  <p className="font-mono text-gray-700">
                    {selectedLog.ipAddress}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
