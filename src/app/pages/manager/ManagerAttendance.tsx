import React, { useState } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";

// Mock Data for the table
interface AttendanceRow {
  id: string;
  name: string;
  avatar: string;
  checkIn: string;
  isLate?: boolean;
  checkOut: string;
  hours: string;
  overtime: string;
  status: string;
  action: string;
}

const TEAM_ATTENDANCE_DATA: AttendanceRow[] = [
  {
    id: "EMP-0142",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    checkIn: "08:52 AM",
    checkOut: "—",
    hours: "4h 45m",
    overtime: "0h",
    status: "Present",
    action: "Details",
  },
  {
    id: "EMP-0145",
    name: "Sneha Rao",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    checkIn: "09:18 AM",
    isLate: true,
    checkOut: "—",
    hours: "4h 19m",
    overtime: "0h",
    status: "Late",
    action: "Regularize",
  },
  {
    id: "EMP-0148",
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?u=Priya",
    checkIn: "—",
    checkOut: "—",
    hours: "—",
    overtime: "—",
    status: "On Leave",
    action: "Details",
  },
  {
    id: "EMP-0151",
    name: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    checkIn: "09:35 AM",
    isLate: true,
    checkOut: "—",
    hours: "4h 02m",
    overtime: "0h",
    status: "Late",
    action: "Regularize",
  },
  {
    id: "EMP-0155",
    name: "James Carter",
    avatar: "https://i.pravatar.cc/150?u=James",
    checkIn: "08:45 AM",
    checkOut: "—",
    hours: "4h 52m",
    overtime: "52m",
    status: "Present (OT)",
    action: "Details",
  },
];

const CALENDAR_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MOCK_HEATMAP = Array.from({ length: 5 }, () =>
  Array.from({ length: 30 }, () => Math.floor(Math.random() * 4)),
);

const MONTH_CONFIGS: Record<string, { days: number; offset: number; label: string }> = {
  "Feb 2026": { days: 28, offset: 0, label: "February 2026" },
  "Mar 2026": { days: 31, offset: 0, label: "March 2026" },
  "Apr 2026": { days: 30, offset: 3, label: "April 2026" },
  "May 2026": { days: 31, offset: 5, label: "May 2026" },
  "Jun 2026": { days: 30, offset: 1, label: "June 2026" },
};
const MONTH_LIST = ["Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];

export function ManagerAttendance() {
  const [activeTab, setActiveTab] = useState("All");
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<AttendanceRow | null>(null);

  // For Regularization Form
  const [correctedTime, setCorrectedTime] = useState("09:00 AM");
  const [reason, setReason] = useState("Technical issue");
  const [notes, setNotes] = useState("");

  // Month navigation state
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // Apr 2026
  const activeMonthStr = MONTH_LIST[currentMonthIndex];
  const activeMonthConfig = MONTH_CONFIGS[activeMonthStr];

  // Dropdown & filtering states
  const [showRegularizeDropdown, setShowRegularizeDropdown] = useState(false);
  const [regularizeFilter, setRegularizeFilter] = useState("All");
  const [attendanceData, setAttendanceData] = useState(TEAM_ATTENDANCE_DATA);

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < MONTH_LIST.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const filteredData = attendanceData.filter((row) => {
    // Tab filter
    let tabMatch = true;
    if (activeTab === "Present") tabMatch = row.status.includes("Present");
    else if (activeTab === "Late") tabMatch = row.status === "Late";
    else if (activeTab === "On Leave") tabMatch = row.status === "On Leave";
    else if (activeTab === "Absent") tabMatch = row.status === "Absent";

    // Regularize filter
    let regMatch = true;
    if (regularizeFilter === "Needs Regularization") {
      regMatch = row.action === "Regularize";
    } else if (regularizeFilter === "Regularized") {
      regMatch = (row.id === "EMP-0145" || row.id === "EMP-0151") && row.status === "Present";
    }

    return tabMatch && regMatch;
  });

  const handleRegularizeClick = (emp: AttendanceRow) => {
    setSelectedEmployee(emp);
    setShowRegularizeModal(true);
  };

  const handleDetailsClick = (emp: AttendanceRow) => {
    setSelectedEmployee(emp);
    setShowDetailsModal(true);
  };

  const handleConfirmRegularize = () => {
    if (selectedEmployee) {
      setAttendanceData(prev => prev.map(row => {
        if (row.id === selectedEmployee.id) {
          return {
            ...row,
            status: "Present",
            action: "Details",
            checkIn: correctedTime,
            isLate: false
          };
        }
        return row;
      }));
      setShowRegularizeModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Present"))
      return { text: "#00B87C", bg: "#DCFCE7", dot: "#10B981" };
    if (status === "Late")
      return { text: "#D97706", bg: "#FEF3C7", dot: "#F59E0B" };
    if (status === "On Leave")
      return { text: "#D97706", bg: "#FEF3C7", dot: "#F59E0B" };
    if (status === "Absent")
      return { text: "#DC2626", bg: "#FEE2E2", dot: "#EF4444" };
    return { text: "var(--foreground)", bg: "var(--secondary)", dot: "gray" };
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <CalendarCheck size={22} className="text-[#10B981]" />
          </div>
          <div>
            <h1
              className="text-[26px] font-bold tracking-tight leading-none"
              style={{ color: "var(--foreground)" }}
            >
              Team Attendance
            </h1>
            <p
              className="text-[13px] text-[#6B7280] mt-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Engineering Team · {activeMonthConfig.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-3 px-1 py-1 rounded-full border bg-white dark:bg-zinc-900"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
            <span
              className="text-[13px] font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {activeMonthStr}
            </span>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowRegularizeDropdown(!showRegularizeDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Filter: {regularizeFilter === "All" ? "All" : regularizeFilter} <ChevronDown size={14} />
            </button>
            {showRegularizeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[1000]"
                  onClick={() => setShowRegularizeDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-zinc-900 shadow-lg z-[1001] p-1.5 space-y-0.5" style={{ borderColor: "var(--border)" }}>
                  {[
                    { value: "All", label: "All Records" },
                    { value: "Needs Regularization", label: "Needs Regularization" },
                    { value: "Regularized", label: "Regularized Only" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setRegularizeFilter(opt.value);
                        setShowRegularizeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        regularizeFilter === opt.value
                          ? "bg-[#00B87C]/10 text-[#00B87C]"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TEAM PRESENT TODAY"
          value="11"
          sub="of 12"
          color="green"
        />
        <KPICard title="ON LEAVE" value="1" sub="Priya Sharma" color="amber" />
        <KPICard title="LATE ARRIVALS" value="2" sub="today" color="red" />
        <KPICard
          title="TEAM AVG ATTENDANCE"
          value="91.6%"
          sub="this month"
          color="green"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div
        className="flex items-center gap-6 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {["All", "Present", "Late", "On Leave", "Absent"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[13px] font-bold transition-colors relative ${
              activeTab === tab
                ? "text-[#00B87C]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00B87C] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Team Attendance Table ── */}
      <div
        className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="border-b bg-neutral-50 dark:bg-zinc-800/50"
                style={{ borderColor: "var(--border)" }}
              >
                {[
                  "EMPLOYEE",
                  "CHECK-IN",
                  "CHECK-OUT",
                  "HOURS",
                  "OVERTIME",
                  "STATUS",
                  "ACTION",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border)" }}
            >
              {filteredData.map((row) => {
                const statusColors = getStatusColor(row.status);
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#00B87C]/[0.08] dark:hover:bg-zinc-800/50 transition-colors group"
                    style={{ height: "64px" }}
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.avatar}
                          alt={row.name}
                          className="w-8 h-8 rounded-full border bg-muted"
                          style={{ borderColor: "var(--border)" }}
                        />
                        <div>
                          <p
                            className="text-[13px] font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            {row.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {row.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span
                        className="text-[13px] font-semibold"
                        style={{
                          color: row.isLate ? "#F59E0B" : "var(--foreground)",
                        }}
                      >
                        {row.checkIn} {row.isLate && "LATE"}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span className="text-[13px] font-medium text-muted-foreground">
                        {row.checkOut}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {row.hours}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span
                        className="text-[13px] font-semibold"
                        style={{
                          color:
                            row.overtime !== "0h" && row.overtime !== "—"
                              ? "#D97706"
                              : "var(--foreground)",
                        }}
                      >
                        {row.overtime}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      {row.action === "Regularize" ? (
                        <button
                          onClick={() => handleRegularizeClick(row)}
                          className="text-[12px] font-bold text-[#F59E0B] hover:underline"
                        >
                          Regularize
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDetailsClick(row)}
                          className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Monthly Calendar View ── */}
      <div
        className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-6"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-[14px] font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Monthly Calendar View
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {CALENDAR_DAYS.map((day) => (
            <div
              key={day}
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Mock empty cells for offset */}
          {Array.from({ length: activeMonthConfig.offset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10"></div>
          ))}
          {Array.from({ length: activeMonthConfig.days }).map((_, i) => {
            const date = i + 1;
            const isToday = activeMonthStr === "Apr 2026" && date === 15;
            const isWeekend = (date + activeMonthConfig.offset) % 7 === 0 || (date + activeMonthConfig.offset) % 7 === 6;
            const isLeave = date === 8;

            let bg;
            let textColor;

            if (isToday) {
              bg = "bg-[#00B87C] border-transparent";
              textColor = "text-white";
            } else if (isLeave) {
              bg = "bg-[#FEF3C7] border-[#FEF3C7] dark:border-transparent";
              textColor = "text-[#D97706]";
            } else if (isWeekend) {
              bg = "bg-neutral-50 dark:bg-zinc-800/50 border-transparent";
              textColor = "text-muted-foreground";
            } else {
              bg = "bg-[#DCFCE7] border-[#DCFCE7] dark:border-transparent";
              textColor = "text-[#10B981]";
            }

            return (
              <div
                key={date}
                className={`h-10 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all hover:scale-105 cursor-pointer ${bg} ${textColor}`}
                style={{ borderColor: "var(--border)" }}
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Attendance Heatmap ── */}
      <div
        className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-6 overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-[14px] font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Attendance Heatmap
        </h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex flex-col gap-2 min-w-[800px]">
            {TEAM_ATTENDANCE_DATA.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-2">
                <div className="w-32 shrink-0 flex items-center gap-2">
                  <img src={emp.avatar} className="w-5 h-5 rounded-full" />
                  <span className="text-[11px] font-semibold text-muted-foreground truncate">
                    {emp.name}
                  </span>
                </div>
                <div className="flex-1 flex gap-1">
                  {MOCK_HEATMAP[i].map((status, dayIndex) => {
                    let color = "#10B981"; // Present
                    if (status === 1) color = "#F59E0B"; // Late
                    if (status === 2) color = "#EF4444"; // Absent
                    if (status === 3) color = "#F97316"; // Leave

                    // Weekends
                    if ((dayIndex + 3) % 7 === 0 || (dayIndex + 3) % 7 === 6) {
                      color = "var(--border)";
                    }

                    return (
                      <div
                        key={dayIndex}
                        className="flex-1 aspect-square rounded-sm"
                        style={{ backgroundColor: color }}
                        title={`${emp.name} - Day ${dayIndex + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex items-center gap-4 mt-4 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#10B981]" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Present
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F59E0B]" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Late
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#EF4444]" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Absent
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F97316]" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Leave
            </span>
          </div>
        </div>
      </div>

      {/* ── Regularization Modal ── */}
      {showRegularizeModal && selectedEmployee && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowRegularizeModal(false)}
          />
          <div
            className="relative w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-200"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="p-6 border-b flex items-center gap-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center shrink-0">
                <Clock size={20} className="text-[#0EA5E9]" />
              </div>
              <div>
                <h3
                  className="text-[16px] font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  Approve Regularization Request
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedEmployee.avatar}
                    className="w-6 h-6 rounded-full"
                  />
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {selectedEmployee.name}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground font-medium pl-8">
                  Apr 7, 2026 — Late Arrival
                </p>
                <p
                  className="text-[13px] font-semibold pl-8 mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Check-in:{" "}
                  <span className="text-[#EF4444]">
                    {selectedEmployee.checkIn}
                  </span>{" "}
                  (18 mins late)
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Corrected Check-in Time
                  </label>
                  <input
                    type="time"
                    value={correctedTime}
                    onChange={(e) => setCorrectedTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Reason for regularization
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors appearance-none"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="Technical issue">Technical issue</option>
                    <option value="Traffic">Traffic</option>
                    <option value="System error">System error</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Manager Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your remarks..."
                    className="w-full min-h-[80px] p-4 rounded-xl border bg-transparent text-[13px] outline-none focus:border-[#00B87C] transition-colors resize-none"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
                <p className="text-[12px] font-semibold text-[#10B981]">
                  <span className="font-bold">Employee's reason:</span> Internet
                  outage at home
                </p>
              </div>
            </div>

            <div
              className="p-6 border-t flex items-center justify-end gap-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-b-2xl"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowRegularizeModal(false)}
                className="px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-colors hover:bg-[#00B87C]/[0.08] dark:hover:bg-zinc-900"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRegularize}
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-[#10B981]/20 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#00B87C" }}
              >
                Approve Regularization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-[500px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border animate-in zoom-in-95 p-6 space-y-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <img src={selectedEmployee.avatar} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedEmployee.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEmployee.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedEmployee.status}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{activeMonthStr === "Apr 2026" ? "April 6, 2026" : "Selected Month Day"}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Check-in</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedEmployee.checkIn}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Check-out</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedEmployee.checkOut}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hours Worked</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedEmployee.hours}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overtime</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedEmployee.overtime}</p>
                </div>
              </div>

              <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Today's Logs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">08:45 AM</span>
                    <span className="font-semibold text-foreground">Swipe In (Office Gate)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">01:00 PM</span>
                    <span className="font-semibold text-foreground">Swipe Out (Lunch Break)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">02:00 PM</span>
                    <span className="font-semibold text-foreground">Swipe In (Back to Desk)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#00B87C" }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  color: "green" | "amber" | "red";
}) {
  const colors = {
    green: { text: "#00B87C" },
    amber: { text: "#F59E0B" },
    red: { text: "#EF4444" },
  };

  return (
    <div
      className="p-5 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
        {title}
      </h3>
      <div className="flex items-end gap-2">
        <span
          className="text-[28px] font-bold leading-none tracking-tight"
          style={{ color: colors[color].text }}
        >
          {value}
        </span>
        <span className="text-[12px] font-bold text-muted-foreground mb-1">
          {sub}
        </span>
      </div>
    </div>
  );
}
