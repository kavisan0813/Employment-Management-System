import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";

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

const MONTH_CONFIGS: Record<
  string,
  { days: number; offset: number; label: string }
> = {
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

  const { getPunchStateForEmail, punchState: globalPunchState } =
    useAttendance();

  // For testing our context, we'll assume "today" is the 23rd of June 2026
  const todayMockDay = new Date().getDate();
  const todayMockMonth = new Date().getMonth();

  // Month navigation state - dynamically default to current month
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const today = new Date();
    const mNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonthStr = `${mNames[today.getMonth()]} ${today.getFullYear()}`;
    const idx = MONTH_LIST.indexOf(currentMonthStr);
    return idx !== -1 ? idx : 4; // default to Jun 2026 (index 4)
  });
  const activeMonthStr = MONTH_LIST[currentMonthIndex];
  const activeMonthConfig = MONTH_CONFIGS[activeMonthStr];

  // Dropdown & filtering states
  const [showRegularizeDropdown, setShowRegularizeDropdown] = useState(false);
  const [regularizeFilter, setRegularizeFilter] = useState("All");
  const [attendanceData, setAttendanceData] = useState(TEAM_ATTENDANCE_DATA);

  // Sync Priya's real-time punch state to the table view
  useEffect(() => {
    const priyaPunch = getPunchStateForEmail("emp@nexushr.com");
    setAttendanceData((prev) =>
      prev.map((row) => {
        if (row.name === "Priya Sharma") {
          if (priyaPunch?.isPunchedIn || priyaPunch?.punchOutTime) {
            return {
              ...row,
              status: "Present",
              checkIn: priyaPunch.punchInTime || row.checkIn,
              checkOut: priyaPunch.punchOutTime || "--:-- --",
              hours: priyaPunch.workedHours || "--",
              isLate: false,
            };
          } else {
            return {
              ...row,
              status: "Absent",
              checkIn: "--:-- --",
              checkOut: "--:-- --",
              hours: "--",
              isLate: false,
            };
          }
        }
        return row;
      }),
    );
  }, [globalPunchState]); // re-run if global punch state changes

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
      regMatch =
        (row.id === "EMP-0145" || row.id === "EMP-0151") &&
        row.status === "Present";
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
      setAttendanceData((prev) =>
        prev.map((row) => {
          if (row.id === selectedEmployee.id) {
            return {
              ...row,
              status: "Present",
              action: "Details",
              checkIn: correctedTime,
              isLate: false,
            };
          }
          return row;
        }),
      );
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
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Filter: {regularizeFilter === "All" ? "All" : regularizeFilter}{" "}
              <ChevronDown size={14} />
            </button>
            {showRegularizeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[1000]"
                  onClick={() => setShowRegularizeDropdown(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-zinc-900 shadow-lg z-[1001] p-1.5 space-y-0.5"
                  style={{ borderColor: "var(--border)" }}
                >
                  {[
                    { value: "All", label: "All Records" },
                    {
                      value: "Needs Regularization",
                      label: "Needs Regularization",
                    },
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
      {(() => {
        // ─── Dynamic per-day attendance data for Jun 2026 ───────────────
        // 0 = present, 1 = late, 2 = absent, 3 = on leave
        // Key: date (1-30), Value: array of member statuses [m1,m2,...,m12]
        const TEAM_NAMES = [
          "Priya M.",
          "Arjun S.",
          "Kavitha R.",
          "Rohan D.",
          "Sneha P.",
          "Kiran N.",
          "Deepa K.",
          "Vikram J.",
          "Ananya S.",
          "Rajan I.",
          "Meera N.",
          "Suresh B.",
        ];
        const TEAM_AVATARS = [
          "PM",
          "AS",
          "KR",
          "RD",
          "SP",
          "KN",
          "DK",
          "VJ",
          "AN",
          "RI",
          "MN",
          "SB",
        ];
        // company holidays in Jun 2026
        const HOLIDAYS: Record<number, string> = { 19: "Eid al-Adha" };

        // seeded per-day per-member attendance (deterministic, not random)
        function dayData(date: number): number[] {
          return TEAM_NAMES.map((name, mi) => {
            // Check real-time punch state for Priya M.
            if (
              name === "Priya M." &&
              date === todayMockDay &&
              currentMonthIndex === todayMockMonth
            ) {
              const priyaPunch = getPunchStateForEmail("emp@nexushr.com");
              if (priyaPunch?.isPunchedIn || priyaPunch?.punchOutTime) {
                return 0; // Present
              } else {
                return 2; // Absent (Not punched in yet)
              }
            }

            // Sneha (index 4) is frequently on leave
            if (mi === 4 && date >= 5 && date <= 7) return 3;
            if (mi === 4 && (date === 14 || date === 21)) return 3;
            // Ananya (index 8) WFH / late on Mondays
            if (mi === 8 && date % 7 === 1) return 1;
            // Arjun (index 1) was absent on 3rd
            if (mi === 1 && date === 3) return 2;
            // Vikram late on 10
            if (mi === 7 && date === 10) return 1;
            // Meera absent on 17
            if (mi === 10 && date === 17) return 2;
            // Holiday: everyone off
            if (HOLIDAYS[date]) return 3;
            // Seed-based light variation
            const v = (date * 13 + mi * 7) % 20;
            if (v === 0 && mi < 6) return 1; // occasional late
            if (v === 1 && mi > 8) return 1;
            return 0; // present
          });
        }

        const memberColor = (s: number) =>
          s === 0
            ? "#00B87C"
            : s === 1
              ? "#F59E0B"
              : s === 2
                ? "#EF4444"
                : "#8B5CF6";

        const today = new Date();
        const formatMonthStr = (d: Date): string => {
          const mNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return `${mNames[d.getMonth()]} ${d.getFullYear()}`;
        };
        const currentRealMonthStr = formatMonthStr(today);
        const endDay = Math.min(today.getDate(), activeMonthConfig.days);

        // Monthly summary
        let totalPresent = 0,
          totalLate = 0,
          totalAbsent = 0,
          totalLeave = 0;
        for (let d = 1; d <= endDay; d++) {
          const isWeekend =
            (d + activeMonthConfig.offset - 1 + 7) % 7 === 0 ||
            (d + activeMonthConfig.offset - 1 + 7) % 7 === 6;
          if (isWeekend) continue;
          dayData(d).forEach((s) => {
            if (s === 0) totalPresent++;
            else if (s === 1) totalLate++;
            else if (s === 2) totalAbsent++;
            else totalLeave++;
          });
        }

        const memberCount = TEAM_NAMES.length || 1;
        const avgPresent = (totalPresent / memberCount).toFixed(1);
        const avgLate = (totalLate / memberCount).toFixed(1);
        const avgAbsent = (totalAbsent / memberCount).toFixed(1);
        const avgLeave = (totalLeave / memberCount).toFixed(1);

        const [selectedDay, setSelectedDay] = React.useState<number | null>(
          null,
        );
        const selectedData = selectedDay ? dayData(selectedDay) : [];

        return (
          <div
            className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-6"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-[14px] font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  Monthly Calendar View
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Click any working day to see who attended ·{" "}
                  {activeMonthConfig.label}
                </p>
              </div>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                {
                  label: "Avg. Present Days",
                  value: avgPresent,
                  color: "#00B87C",
                  bg: "#ECFDF5",
                },
                {
                  label: "Avg. Late Arrivals",
                  value: avgLate,
                  color: "#F59E0B",
                  bg: "#FEF3C7",
                },
                {
                  label: "Avg. Absent Days",
                  value: avgAbsent,
                  color: "#EF4444",
                  bg: "#FEF2F2",
                },
                {
                  label: "Avg. Leave Days",
                  value: avgLeave,
                  color: "#8B5CF6",
                  bg: "#F5F3FF",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: s.bg }}
                >
                  <div
                    className="text-[20px] font-black"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Day headers */}
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

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: activeMonthConfig.offset }).map((_, i) => (
                <div key={`e-${i}`} className="h-14" />
              ))}
              {Array.from({ length: activeMonthConfig.days }).map((_, i) => {
                const date = i + 1;
                // dow: 0=Sun...6=Sat
                const dow = (date + activeMonthConfig.offset - 1 + 7) % 7;
                const isWeekend = dow === 0 || dow === 6;
                const isHoliday = !!HOLIDAYS[date];
                const isToday =
                  activeMonthStr === currentRealMonthStr &&
                  date === today.getDate();
                const isFuture = date > endDay;

                let bg = "",
                  textCol = "",
                  border = "";
                let presentCount = 0,
                  lateCount = 0,
                  absentCount = 0;
                let tooltip = "";

                if (isWeekend) {
                  bg = "var(--secondary)";
                  textCol = "var(--muted-foreground)";
                  border = "transparent";
                } else if (isHoliday) {
                  bg = "#F5F3FF";
                  textCol = "#8B5CF6";
                  border = "#DDD6FE";
                  tooltip = HOLIDAYS[date];
                } else if (isToday) {
                  bg = "#00B87C";
                  textCol = "white";
                  border = "transparent";
                  const d = dayData(date);
                  presentCount = d.filter((s) => s === 0).length;
                  lateCount = d.filter((s) => s === 1).length;
                  absentCount = d.filter((s) => s === 2 || s === 3).length;
                } else if (isFuture) {
                  // future days (greyed)
                  bg = "var(--secondary)";
                  textCol = "var(--muted-foreground)";
                  border = "transparent";
                } else {
                  const d = dayData(date);
                  presentCount = d.filter((s) => s === 0).length;
                  lateCount = d.filter((s) => s === 1).length;
                  absentCount = d.filter((s) => s === 2).length;
                  const pct = ((presentCount + lateCount * 0.5) / 12) * 100;
                  if (pct >= 90) {
                    bg = "#DCFCE7";
                    textCol = "#059669";
                    border = "#A7F3D0";
                  } else if (pct >= 70) {
                    bg = "#FEF3C7";
                    textCol = "#D97706";
                    border = "#FDE68A";
                  } else {
                    bg = "#FEE2E2";
                    textCol = "#DC2626";
                    border = "#FECACA";
                  }
                }

                const canClick = !isWeekend && !isHoliday && !isFuture;

                return (
                  <div
                    key={date}
                    onClick={() =>
                      canClick &&
                      setSelectedDay(date === selectedDay ? null : date)
                    }
                    title={
                      tooltip ||
                      (isWeekend ? "Weekend" : date > 15 ? "Upcoming" : "")
                    }
                    className={`h-14 rounded-xl flex flex-col items-center justify-center transition-all select-none ${
                      canClick
                        ? "cursor-pointer hover:scale-105 hover:shadow-md"
                        : "cursor-default"
                    } ${selectedDay === date ? "ring-2 ring-[#00B87C] ring-offset-1" : ""}`}
                    style={{
                      background: bg,
                      color: textCol,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <span className="text-[13px] font-black leading-none">
                      {date}
                    </span>
                    {isHoliday && (
                      <span className="text-[8px] font-bold mt-0.5 opacity-80">
                        HOLIDAY
                      </span>
                    )}
                    {!isWeekend && !isHoliday && date <= 15 && (
                      <span className="text-[9px] font-bold mt-0.5 opacity-80">
                        {presentCount}/{12}
                        {lateCount > 0 ? ` · ${lateCount}L` : ""}
                        {absentCount > 0 ? ` · ${absentCount}A` : ""}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              className="flex items-center gap-5 mt-5 pt-4 border-t flex-wrap"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Legend:
              </span>
              {[
                {
                  color: "#DCFCE7",
                  text: "#059669",
                  label: "Full / High Attendance (≥90%)",
                },
                {
                  color: "#FEF3C7",
                  text: "#D97706",
                  label: "Moderate (70–89%)",
                },
                { color: "#FEE2E2", text: "#DC2626", label: "Low (<70%)" },
                { color: "#00B87C", text: "white", label: "Today" },
                { color: "#F5F3FF", text: "#8B5CF6", label: "Holiday" },
                {
                  color: "var(--secondary)",
                  text: "var(--muted-foreground)",
                  label: "Weekend",
                },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-md flex-shrink-0"
                    style={{
                      background: l.color,
                      border: `1px solid ${l.text}40`,
                    }}
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Day detail popup */}
            {selectedDay !== null && (
              <div
                className="mt-5 rounded-xl border overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ background: "#00B87C" }}
                >
                  <div>
                    <span className="text-[14px] font-black text-white">
                      {activeMonthConfig.label.split(" ")[0]} {selectedDay},
                      2026
                    </span>
                    <span className="text-[11px] text-white/80 ml-3">
                      Team Attendance Detail
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-white/80 hover:text-white text-lg font-black leading-none w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                  >
                    ×
                  </button>
                </div>
                {/* summary chips */}
                <div
                  className="px-5 py-3 border-b flex gap-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "#F0FDF4",
                  }}
                >
                  {[
                    {
                      label: "Present",
                      count: selectedData.filter((s) => s === 0).length,
                      color: "#00B87C",
                    },
                    {
                      label: "Late",
                      count: selectedData.filter((s) => s === 1).length,
                      color: "#F59E0B",
                    },
                    {
                      label: "Absent",
                      count: selectedData.filter((s) => s === 2).length,
                      color: "#EF4444",
                    },
                    {
                      label: "On Leave",
                      count: selectedData.filter((s) => s === 3).length,
                      color: "#8B5CF6",
                    },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: c.color }}
                      />
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: c.color }}
                      >
                        {c.count}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        {c.label}
                      </span>
                    </div>
                  ))}
                  <div className="ml-auto">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#00B87C" }}
                    >
                      {Math.round(
                        (selectedData.filter((s) => s === 0 || s === 1).length /
                          12) *
                          100,
                      )}
                      % Attendance Rate
                    </span>
                  </div>
                </div>
                {/* member rows */}
                <div
                  className="grid grid-cols-2 gap-0 divide-x divide-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  {TEAM_NAMES.map((name, mi) => {
                    const s = selectedData[mi];
                    const dotColor = memberColor(s);
                    const badge: Record<
                      number,
                      { bg: string; text: string; label: string }
                    > = {
                      0: { bg: "#ECFDF5", text: "#059669", label: "✓ Present" },
                      1: { bg: "#FEF3C7", text: "#D97706", label: "⏰ Late" },
                      2: { bg: "#FEF2F2", text: "#DC2626", label: "✕ Absent" },
                      3: {
                        bg: "#F5F3FF",
                        text: "#7C3AED",
                        label: "🏖 On Leave",
                      },
                    };
                    const b = badge[s];
                    return (
                      <div
                        key={mi}
                        className="flex items-center gap-3 px-4 py-2.5"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                          style={{
                            background: `${dotColor}25`,
                            color: dotColor,
                            border: `1.5px solid ${dotColor}50`,
                          }}
                        >
                          {TEAM_AVATARS[mi]}
                        </div>
                        <span
                          className="text-[12px] font-semibold flex-1"
                          style={{ color: "var(--foreground)" }}
                        >
                          {name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: b.bg, color: b.text }}
                        >
                          {b.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
            <div
              className="flex justify-between items-start border-b pb-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedEmployee.id}
                  </p>
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
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {selectedEmployee.status}
                  </p>
                </div>
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Date
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {activeMonthStr === "Apr 2026"
                      ? "April 6, 2026"
                      : "Selected Month Day"}
                  </p>
                </div>
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Check-in
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {selectedEmployee.checkIn}
                  </p>
                </div>
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Check-out
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {selectedEmployee.checkOut}
                  </p>
                </div>
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Hours Worked
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {selectedEmployee.hours}
                  </p>
                </div>
                <div
                  className="bg-neutral-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Overtime
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {selectedEmployee.overtime}
                  </p>
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Today's Logs
                </h4>
                <div className="space-y-2">
                  {selectedEmployee.name === "Priya Sharma" &&
                  globalPunchState.logs &&
                  globalPunchState.logs.length > 0 ? (
                    globalPunchState.logs.map((log, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs py-1"
                      >
                        <span className="text-muted-foreground">
                          {log.time}
                        </span>
                        <span className="font-semibold text-foreground">
                          {log.action}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs py-1">
                        <span className="text-muted-foreground">08:45 AM</span>
                        <span className="font-semibold text-foreground">
                          Swipe In (Office Gate)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1">
                        <span className="text-muted-foreground">01:00 PM</span>
                        <span className="font-semibold text-foreground">
                          Swipe Out (Lunch Break)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1">
                        <span className="text-muted-foreground">02:00 PM</span>
                        <span className="font-semibold text-foreground">
                          Swipe In (Back to Desk)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className="border-t pt-4 flex justify-end"
              style={{ borderColor: "var(--border)" }}
            >
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
