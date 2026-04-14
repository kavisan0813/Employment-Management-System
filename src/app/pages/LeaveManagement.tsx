import { useState } from "react";
import { Check, X, Clock, Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { leaveRequests } from "../data/mockData";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_CONFIG = {
  Pending: { bg: "#FFFBEB", color: "#F59E0B" },
  Approved: { bg: "#F0FDF4", color: "#22C55E" },
  Rejected: { bg: "#FEF2F2", color: "#EF4444" },
};

const LEAVE_TYPES = [
  { type: "Annual Leave", used: 8, total: 21, color: "#059669" },
  { type: "Sick Leave", used: 3, total: 10, color: "#22C55E" },
  { type: "Personal Leave", used: 1, total: 5, color: "#14B8A6" },
  { type: "Maternity/Paternity", used: 0, total: 90, color: "#0EA5E9" },
];

export default function LeaveManagement() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(3);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);

  const filters = ["All", "Pending", "Approved", "Rejected"];
  const filtered = leaveRequests.filter((r) => activeFilter === "All" || r.status === activeFilter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: "#022C22" }} className="text-xl font-semibold">Leave Management</h2>
          <p style={{ color: "#6B7280" }} className="text-sm mt-0.5">Manage employee leave requests and balances</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#059669" }}
        >
          <Plus style={{ width: "16px", height: "16px" }} />
          Request Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LEAVE_TYPES.map((lt) => (
          <div
            key={lt.type}
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p style={{ color: "#6B7280" }} className="text-xs font-medium">{lt.type}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: lt.color + "15" }}>
                <Calendar style={{ width: "13px", height: "13px", color: lt.color }} />
              </div>
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span style={{ color: "#022C22" }} className="text-2xl font-bold">{lt.total - lt.used}</span>
              <span style={{ color: "#6B7280" }} className="text-sm mb-1">/ {lt.total} days</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#D1FAE5" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(lt.used / lt.total) * 100}%`, backgroundColor: lt.color }}
              />
            </div>
            <p style={{ color: "#6B7280" }} className="text-xs mt-1.5">{lt.used} days used</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Leave Requests Table */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #D1FAE5" }}>
            <div>
              <h3 style={{ color: "#022C22" }} className="font-semibold">Leave Requests</h3>
              <p style={{ color: "#6B7280" }} className="text-xs mt-0.5">{leaveRequests.filter(r => r.status === "Pending").length} pending approval</p>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5" }}>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3 py-1 text-xs rounded-lg transition-all"
                  style={{
                    backgroundColor: activeFilter === f ? "#059669" : "transparent",
                    color: activeFilter === f ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5", borderBottom: "1px solid #D1FAE5" }}>
                  {["Employee", "Leave Type", "Duration", "Days", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#166534" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, idx) => {
                  const sc = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr
                      key={req.id}
                      style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #D1FAE5" : "none" }}
                      className="transition-colors"
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0FDF4")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={req.avatar} alt={req.employee} className="w-8 h-8 rounded-full object-cover" />
                          <p style={{ color: "#022C22" }} className="text-sm font-medium whitespace-nowrap">{req.employee}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span style={{ color: "#166534" }} className="text-sm">{req.type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ color: "#166534" }} className="text-xs whitespace-nowrap">{req.from} → {req.to}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ backgroundColor: "#ECFDF5", color: "#059669" }}
                        >
                          {req.days}d
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {req.status === "Pending" && <Clock style={{ width: "10px", height: "10px" }} />}
                          {req.status === "Approved" && <Check style={{ width: "10px", height: "10px" }} />}
                          {req.status === "Rejected" && <X style={{ width: "10px", height: "10px" }} />}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {req.status === "Pending" ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setShowApproveModal(req.id)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors"
                              style={{ backgroundColor: "#F0FDF4", color: "#22C55E" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#DCFCE7")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0FDF4")}
                            >
                              <Check style={{ width: "12px", height: "12px" }} />
                              Approve
                            </button>
                            <button
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors"
                              style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEE2E2")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")}
                            >
                              <X style={{ width: "12px", height: "12px" }} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#6B7280" }} className="text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Calendar */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#022C22" }} className="font-semibold">{MONTHS[currentMonth]} 2025</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonth((m) => Math.max(0, m - 1))}
                className="p-1 rounded-lg"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#ECFDF5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
              >
                <ChevronLeft style={{ width: "14px", height: "14px" }} />
              </button>
              <button
                onClick={() => setCurrentMonth((m) => Math.min(11, m + 1))}
                className="p-1 rounded-lg"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#ECFDF5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
              >
                <ChevronRight style={{ width: "14px", height: "14px" }} />
              </button>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {DAYS.map((d) => (
              <div key={d} className="text-xs pb-1" style={{ color: "#6B7280" }}>{d[0]}</div>
            ))}
            {Array.from({ length: new Date(2025, currentMonth, 1).getDay() }).map((_, i) => <div key={i} />)}
            {Array.from({ length: new Date(2025, currentMonth + 1, 0).getDate() }).map((_, i) => {
              const day = i + 1;
              const hasLeave = [10, 11, 12, 13, 14, 20, 21].includes(day) && currentMonth === 3;
              const isToday = day === 6 && currentMonth === 3;
              return (
                <div
                  key={day}
                  className="w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs cursor-pointer"
                  style={{
                    backgroundColor: isToday ? "#059669" : hasLeave ? "#FFFBEB" : "transparent",
                    color: isToday ? "#FFFFFF" : hasLeave ? "#F59E0B" : "#166534",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Upcoming Leaves */}
          <div style={{ borderTop: "1px solid #D1FAE5", paddingTop: "16px" }}>
            <p style={{ color: "#6B7280" }} className="text-xs font-medium uppercase tracking-wide mb-3">Upcoming Leaves</p>
            <div className="space-y-2.5">
              {leaveRequests.filter(r => r.status !== "Rejected").slice(0, 4).map((req) => (
                <div key={req.id} className="flex items-center gap-2.5">
                  <img src={req.avatar} alt={req.employee} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#166534" }} className="text-xs font-medium truncate">{req.employee}</p>
                    <p style={{ color: "#6B7280" }} className="text-xs">{req.type} · {req.days}d</p>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG].bg,
                      color: STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG].color,
                    }}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F0FDF4" }}>
                <Check style={{ width: "24px", height: "24px", color: "#22C55E" }} />
              </div>
              <h3 style={{ color: "#022C22" }} className="text-lg font-semibold mb-2">Approve Leave Request</h3>
              <p style={{ color: "#6B7280" }} className="text-sm">
                Are you sure you want to approve this leave request?
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowApproveModal(null)}
                className="flex-1 py-2.5 text-sm rounded-xl"
                style={{ backgroundColor: "#ECFDF5", color: "#166534" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApproveModal(null)}
                className="flex-1 py-2.5 text-sm rounded-xl text-white"
                style={{ backgroundColor: "#22C55E" }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
