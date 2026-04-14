import { useState } from "react";
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
type Status = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: string;
  employee: string;
  initials: string;
  avatarColor: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: Status;
}

/* ─── Mock Data (matches image) ─────────── */
const leaveData: LeaveRequest[] = [
  {
    id: "LR001",
    employee: "Sneha Patel",
    initials: "SP",
    avatarColor: "linear-gradient(135deg, #059669, #047857)",
    type: "Annual Leave",
    from: "Apr 10",
    to: "Apr 12",
    days: 3,
    status: "Pending",
  },
  {
    id: "LR002",
    employee: "Ravi Kumar",
    initials: "RK",
    avatarColor: "linear-gradient(135deg, #14B8A6, #0D9488)",
    type: "Sick Leave",
    from: "Apr 8",
    to: "Apr 8",
    days: 1,
    status: "Approved",
  },
  {
    id: "LR003",
    employee: "Meera Thomas",
    initials: "MT",
    avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
    type: "Casual Leave",
    from: "Apr 15",
    to: "Apr 16",
    days: 2,
    status: "Pending",
  },
  {
    id: "LR004",
    employee: "Vikram Singh",
    initials: "VS",
    avatarColor: "linear-gradient(135deg, #22C55E, #16A34A)",
    type: "Annual Leave",
    from: "Apr 20",
    to: "Apr 25",
    days: 6,
    status: "Approved",
  },
  {
    id: "LR005",
    employee: "Priya Nair",
    initials: "PN",
    avatarColor: "linear-gradient(135deg, #A78BFA, #7C3AED)",
    type: "Maternity Leave",
    from: "May 1",
    to: "Jul 31",
    days: 90,
    status: "Approved",
  },
  {
    id: "LR006",
    employee: "Rahul Sharma",
    initials: "RS",
    avatarColor: "linear-gradient(135deg, #EF4444, #DC2626)",
    type: "Sick Leave",
    from: "Apr 9",
    to: "Apr 10",
    days: 2,
    status: "Rejected",
  },
  {
    id: "LR007",
    employee: "Anita Desai",
    initials: "AD",
    avatarColor: "linear-gradient(135deg, #0EA5E9, #0369A1)",
    type: "Annual Leave",
    from: "Apr 22",
    to: "Apr 24",
    days: 3,
    status: "Pending",
  },
  {
    id: "LR008",
    employee: "Karan Mehta",
    initials: "KM",
    avatarColor: "linear-gradient(135deg, #EC4899, #DB2777)",
    type: "Casual Leave",
    from: "Apr 17",
    to: "Apr 17",
    days: 1,
    status: "Approved",
  },
];

/* ─── Status config ─────────────────────── */
const STATUS_CONFIG: Record<Status, { bg: string; color: string; icon: any; label: string }> = {
  Pending: { bg: "#FFFBEB", color: "#F59E0B", icon: Clock, label: "Pending" },
  Approved: { bg: "#F0FDF4", color: "#22C55E", icon: Check, label: "Approved" },
  Rejected: { bg: "#FEF2F2", color: "#EF4444", icon: X, label: "Rejected" },
};

/* ─── Stat card config ───────────────────── */
const statCards = [
  {
    label: "Total Requests",
    value: 156,
    iconBg: "#ECFDF5",
    iconColor: "#059669",
  },
  {
    label: "Approved",
    value: 118,
    iconBg: "#ECFDF5",
    iconColor: "#059669",
  },
  {
    label: "Pending",
    value: 23,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
  },
  {
    label: "Rejected",
    value: 15,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
  },
];

/* ─── Mini Calendar ─────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/* ─── "New Request" Modal ────────────────── */
function NewRequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    employee: "",
    type: "Annual Leave",
    from: "",
    to: "",
    reason: "",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #D1FAE5" }}
        >
          <div>
            <h3 style={{ color: "#022C22", fontSize: "16px", fontWeight: 700 }}>
              New Leave Request
            </h3>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "2px" }}>
              Submit a new leave request for an employee
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "#ECFDF5")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4">
          {/* Employee name */}
          <div>
            <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600 }}>
              Employee Name
            </label>
            <input
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                border: "1px solid #D1FAE5",
                backgroundColor: "#F9FAFB",
                color: "#022C22",
              }}
              placeholder="e.g. Sarah Johnson"
              value={form.employee}
              onChange={(e) => setForm({ ...form, employee: e.target.value })}
            />
          </div>

          {/* Leave type */}
          <div>
            <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600 }}>
              Leave Type
            </label>
            <select
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{
                border: "1px solid #D1FAE5",
                backgroundColor: "#F9FAFB",
                color: "#022C22",
              }}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {["Annual Leave", "Sick Leave", "Casual Leave", "Maternity Leave", "Paternity Leave"].map(
                (t) => <option key={t}>{t}</option>
              )}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600 }}>From</label>
              <input
                type="date"
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid #D1FAE5", backgroundColor: "#F9FAFB", color: "#022C22" }}
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
              />
            </div>
            <div>
              <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600 }}>To</label>
              <input
                type="date"
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid #D1FAE5", backgroundColor: "#F9FAFB", color: "#022C22" }}
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600 }}>
              Reason <span style={{ color: "#9CA3AF" }}>(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              style={{ border: "1px solid #D1FAE5", backgroundColor: "#F9FAFB", color: "#022C22" }}
              placeholder="Brief reason for leave..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
        </div>

        {/* Modal footer */}
        <div
          className="px-6 pb-6 flex gap-3"
          style={{ borderTop: "1px solid #D1FAE5", paddingTop: "16px" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#ECFDF5", color: "#166534" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #059669, #047857)",
              boxShadow: "0 4px 12px rgba(5,150,105,0.35)",
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────── */
export function LeaveManagement() {
  const [activeFilter, setActiveFilter] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveData);
  const [currentMonth, setCurrentMonth] = useState(3); // April (0-indexed)

  const filters: Array<"All" | Status> = ["All", "Pending", "Approved", "Rejected"];

  const filtered = requests.filter((r) => {
    const matchFilter = activeFilter === "All" || r.status === activeFilter;
    const matchSearch =
      search === "" ||
      r.employee.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" as Status } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as Status } : r))
    );
  };

  /* calendar helpers */
  const firstDayOfMonth = new Date(2026, currentMonth, 1).getDay();
  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();

  /* stat values derived from live state */
  const totalRequests = requests.length + 150 - leaveData.length; // padded to match image
  const approved = requests.filter((r) => r.status === "Approved").length + 114 - leaveData.filter(r => r.status === "Approved").length;
  const pending = requests.filter((r) => r.status === "Pending").length + 20 - leaveData.filter(r => r.status === "Pending").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length + 14 - leaveData.filter(r => r.status === "Rejected").length;

  const dynamicStats = [
    { label: "Total Requests", value: totalRequests, iconBg: "#ECFDF5", iconColor: "#059669" },
    { label: "Approved",       value: approved,       iconBg: "#ECFDF5", iconColor: "#059669" },
    { label: "Pending",        value: pending,        iconBg: "#FFFBEB", iconColor: "#F59E0B" },
    { label: "Rejected",       value: rejected,       iconBg: "#FEF2F2", iconColor: "#EF4444" },
  ];

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ color: "#022C22", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px" }}>
            Leave Management
          </h2>
          <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "3px" }}>
            Manage and approve employee leave requests
          </p>
        </div>
        <button
          id="leave-new-request-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(5,150,105,0.35)",
          }}
        >
          <Plus size={15} />
          New Request
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {dynamicStats.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: "white",
              border: "1px solid #D1FAE5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div>
              <p
                style={{
                  color: "#022C22",
                  fontSize: "30px",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                {card.value}
              </p>
              <p style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500, marginTop: "5px" }}>
                {card.label}
              </p>
            </div>
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: card.iconBg,
              }}
            >
              <Calendar size={20} color={card.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content: table + calendar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Leave Requests Table */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "white",
            border: "1px solid #D1FAE5",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Table toolbar */}
          <div
            className="px-5 py-4 flex items-center justify-between gap-3"
            style={{ borderBottom: "1px solid #D1FAE5" }}
          >
            <h3 style={{ color: "#022C22", fontSize: "15px", fontWeight: 700, flexShrink: 0 }}>
              Leave Requests
            </h3>

            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Search */}
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  backgroundColor: "#F0FDF4",
                  border: "1px solid #D1FAE5",
                  maxWidth: "200px",
                  flex: 1,
                }}
              >
                <Search size={13} color="#6B7280" />
                <input
                  className="bg-transparent text-xs outline-none w-full"
                  style={{ color: "#022C22" }}
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filter tabs */}
              <div
                className="flex gap-1 rounded-xl p-1 shrink-0"
                style={{ backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5" }}
              >
                {filters.map((f) => (
                  <button
                    key={f}
                    id={`leave-filter-${f.toLowerCase()}`}
                    onClick={() => setActiveFilter(f)}
                    className="px-3 py-1 text-xs rounded-lg transition-all font-medium"
                    style={{
                      backgroundColor: activeFilter === f ? "#059669" : "transparent",
                      color: activeFilter === f ? "white" : "#6B7280",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5", borderBottom: "1px solid #D1FAE5" }}>
                  {["EMPLOYEE", "LEAVE TYPE", "FROM", "TO", "DAYS", "STATUS", "ACTIONS"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#166534" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar size={32} color="#D1FAE5" />
                        <p style={{ color: "#9CA3AF", fontSize: "13px" }}>No requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((req, idx) => {
                    const sc = STATUS_CONFIG[req.status];
                    const StatusIcon = sc.icon;
                    const isPending = req.status === "Pending";

                    return (
                      <tr
                        key={req.id}
                        style={{
                          borderBottom: idx < filtered.length - 1 ? "1px solid #D1FAE5" : "none",
                        }}
                        className="transition-colors"
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0FDF4")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                        }
                      >
                        {/* Employee */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="flex items-center justify-center rounded-full shrink-0"
                              style={{
                                width: "34px",
                                height: "34px",
                                background: req.avatarColor,
                              }}
                            >
                              <span
                                style={{ color: "white", fontSize: "11px", fontWeight: 700 }}
                              >
                                {req.initials}
                              </span>
                            </div>
                            <p
                              style={{
                                color: "#022C22",
                                fontSize: "13px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {req.employee}
                            </p>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="px-5 py-3.5">
                          <span style={{ color: "#166534", fontSize: "13px" }}>{req.type}</span>
                        </td>

                        {/* From */}
                        <td className="px-5 py-3.5">
                          <span style={{ color: "#166534", fontSize: "13px" }}>{req.from}</span>
                        </td>

                        {/* To */}
                        <td className="px-5 py-3.5">
                          <span
                            style={{
                              color:
                                req.days >= 30 ? "#F59E0B" : "#166534",
                              fontSize: "13px",
                              fontWeight: req.days >= 30 ? 600 : 400,
                            }}
                          >
                            {req.to}
                          </span>
                        </td>

                        {/* Days */}
                        <td className="px-5 py-3.5">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                req.days >= 30
                                  ? "#FFFBEB"
                                  : "#ECFDF5",
                              color:
                                req.days >= 30
                                  ? "#F59E0B"
                                  : "#059669",
                            }}
                          >
                            {req.days}d
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: sc.bg, color: sc.color }}
                          >
                            <StatusIcon size={10} />
                            {sc.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          {isPending ? (
                            <div className="flex items-center gap-1.5">
                              {/* Approve icon button */}
                              <button
                                id={`approve-${req.id}`}
                                onClick={() => handleApprove(req.id)}
                                className="p-1.5 rounded-full transition-colors"
                                style={{ backgroundColor: "#F0FDF4", color: "#22C55E" }}
                                title="Approve"
                                onMouseEnter={(e) =>
                                  ((e.currentTarget as HTMLElement).style.backgroundColor = "#DCFCE7")
                                }
                                onMouseLeave={(e) =>
                                  ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0FDF4")
                                }
                              >
                                <Check size={14} />
                              </button>
                              {/* Reject icon button */}
                              <button
                                id={`reject-${req.id}`}
                                onClick={() => handleReject(req.id)}
                                className="p-1.5 rounded-full transition-colors"
                                style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}
                                title="Reject"
                                onMouseEnter={(e) =>
                                  ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEE2E2")
                                }
                                onMouseLeave={(e) =>
                                  ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")
                                }
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: "#D1D5DB", fontSize: "13px" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid #D1FAE5" }}
          >
            <p style={{ color: "#6B7280", fontSize: "12px" }}>
              Showing <span style={{ fontWeight: 600, color: "#022C22" }}>{filtered.length}</span>{" "}
              of {requests.length} requests
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: p === 1 ? "#059669" : "transparent",
                    color: p === 1 ? "white" : "#6B7280",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: Calendar + Upcoming */}
        <div className="flex flex-col gap-4">
          {/* Mini Calendar */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: "1px solid #D1FAE5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#022C22", fontSize: "14px", fontWeight: 700 }}>
                {MONTHS[currentMonth]} 2026
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentMonth((m) => Math.max(0, m - 1))}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: "#6B7280" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#ECFDF5")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                  }
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentMonth((m) => Math.min(11, m + 1))}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: "#6B7280" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#ECFDF5")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                  }
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAY_LABELS.map((d, i) => (
                <div key={i} style={{ color: "#9CA3AF", fontSize: "11px", fontWeight: 500 }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasLeave =
                  [10, 11, 12, 15, 16, 20, 21, 22, 23, 24, 25].includes(day) && currentMonth === 3;
                const isToday = day === 14 && currentMonth === 3;
                return (
                  <div
                    key={day}
                    className="w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isToday
                        ? "#059669"
                        : hasLeave
                        ? "#FFFBEB"
                        : "transparent",
                      color: isToday
                        ? "white"
                        : hasLeave
                        ? "#F59E0B"
                        : "#166534",
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              className="flex items-center gap-4 mt-4 pt-4"
              style={{ borderTop: "1px solid #D1FAE5" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#059669" }} />
                <span style={{ color: "#6B7280", fontSize: "11px" }}>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                <span style={{ color: "#6B7280", fontSize: "11px" }}>On Leave</span>
              </div>
            </div>
          </div>

          {/* Leave Type Summary */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: "1px solid #D1FAE5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{ color: "#022C22", fontSize: "14px", fontWeight: 700, marginBottom: "14px" }}
            >
              Leave Balances
            </h3>
            {[
              { type: "Annual Leave", used: 8, total: 21, color: "#059669" },
              { type: "Sick Leave", used: 3, total: 10, color: "#22C55E" },
              { type: "Casual Leave", used: 1, total: 7, color: "#14B8A6" },
              { type: "Maternity Leave", used: 0, total: 90, color: "#F59E0B" },
            ].map((lt) => (
              <div key={lt.type} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: "#374151", fontSize: "12px", fontWeight: 500 }}>
                    {lt.type}
                  </span>
                  <span style={{ color: "#6B7280", fontSize: "11px" }}>
                    <span style={{ color: "#022C22", fontWeight: 700 }}>{lt.total - lt.used}</span>
                    /{lt.total} left
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(lt.used / lt.total) * 100}%`,
                      backgroundColor: lt.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Leaves */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: "1px solid #D1FAE5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{ color: "#022C22", fontSize: "14px", fontWeight: 700, marginBottom: "14px" }}
            >
              Upcoming Leaves
            </h3>
            <div className="space-y-3">
              {requests
                .filter((r) => r.status !== "Rejected")
                .slice(0, 5)
                .map((req) => {
                  const sc = STATUS_CONFIG[req.status];
                  const StatusIcon = sc.icon;
                  return (
                    <div key={req.id} className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full shrink-0"
                        style={{ width: "30px", height: "30px", background: req.avatarColor }}
                      >
                        <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>
                          {req.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color: "#022C22", fontSize: "12px", fontWeight: 600 }}>
                          {req.employee}
                        </p>
                        <p style={{ color: "#6B7280", fontSize: "11px" }}>
                          {req.type} · {req.from} – {req.to}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        <StatusIcon size={9} />
                        {sc.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* ── New Request Modal ── */}
      {showModal && <NewRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
