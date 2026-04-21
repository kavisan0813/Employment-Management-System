import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown } from "lucide-react";
import { attendanceCalendar, dailyLogs, employees } from "../data/mockData";

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  Present: { bg: "var(--secondary)", color: "var(--primary)", dot: "var(--primary)", label: "Present" },
  Absent: { bg: "rgba(220, 38, 38, 0.1)", color: "#DC2626", dot: "#EF4444", label: "Absent" },
  Leave: { bg: "rgba(245, 158, 11, 0.1)", color: "#D97706", dot: "#F59E0B", label: "Leave" },
  Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#0D9488", dot: "#14B8A6", label: "Holiday" },
  Weekend: { bg: "transparent", color: "var(--muted-foreground)", dot: "var(--muted-foreground)", label: "Weekend" },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export function Attendance() {
  // Start at April 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].name);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowEmployeeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  // Compute calendar grid dynamically
  const startDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const selectedEmp = employees.find((e) => e.name === selectedEmployee) || employees[0];

  const logStatusConfig: Record<string, { bg: string; color: string }> = {
    Present: { bg: "var(--secondary)", color: "var(--primary)" },
    Absent: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
    Leave: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" },
    Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#14B8A6" },
  };

  const summary = {
    totalWorkingDays: 22,
    present: Object.values(attendanceCalendar).filter((s) => s === "Present").length,
    absent: Object.values(attendanceCalendar).filter((s) => s === "Absent").length,
    leaves: Object.values(attendanceCalendar).filter((s) => s === "Leave").length,
    holidays: Object.values(attendanceCalendar).filter((s) => s === "Holiday").length,
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">

        {/* ── Calendar month navigator ── */}
        <div
          className="flex items-center gap-1 rounded-2xl px-2 py-2"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Prev arrow */}
          <button
            onClick={prevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-xl transition-all"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
            }}
          >
            <ChevronLeft size={15} />
          </button>

          {/* Month label */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: "var(--secondary)", minWidth: "130px", justifyContent: "center" }}
          >
            <CalendarDays size={15} color="var(--primary)" />
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
              {monthLabel}
            </span>
          </div>

          {/* Next arrow */}
          <button
            onClick={nextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-xl transition-all"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* ── Employee selector pill with dropdown ── */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowEmployeeDropdown((v) => !v)}
            className="flex items-center gap-2.5 rounded-2xl transition-all"
            style={{
              backgroundColor: "var(--card)",
              border: `1px solid ${showEmployeeDropdown ? "var(--primary)" : "var(--border)"}`,
              boxShadow: showEmployeeDropdown
                ? "0 0 0 3px rgba(16,185,129,0.12), 0 2px 8px rgba(0,0,0,0.06)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              padding: "6px 12px 6px 8px",
              cursor: "pointer",
            }}
          >
            {/* Avatar with green ring */}
            <div
              style={{
                padding: "2px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981, #059669)",
                flexShrink: 0,
              }}
            >
              <div style={{ borderRadius: "50%", overflow: "hidden", width: "28px", height: "28px", border: "2px solid var(--card)" }}>
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmployee}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
              {selectedEmployee}
            </span>
            <ChevronDown
              size={14}
              color="var(--primary)"
              style={{
                flexShrink: 0,
                transition: "transform 200ms ease",
                transform: showEmployeeDropdown ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Dropdown list */}
          {showEmployeeDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: "220px",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "10px 14px 8px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <p style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                  Select Employee
                </p>
              </div>
              {/* List */}
              <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                {employees.map((emp) => {
                  const isSelected = emp.name === selectedEmployee;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => { setSelectedEmployee(emp.name); setShowEmployeeDropdown(false); }}
                      className="w-full flex items-center gap-3 text-left transition-colors"
                      style={{
                        padding: "9px 14px",
                        backgroundColor: isSelected ? "var(--secondary)" : "transparent",
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          padding: isSelected ? "1.5px" : "0",
                          borderRadius: "50%",
                          background: isSelected ? "linear-gradient(135deg,#10B981,#059669)" : "transparent",
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ borderRadius: "50%", overflow: "hidden", width: "30px", height: "30px", border: isSelected ? "1.5px solid var(--card)" : "none" }}>
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                      </div>
                      {/* Name + role */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: isSelected ? "var(--primary)" : "var(--foreground)", fontSize: "13px", fontWeight: isSelected ? 700 : 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {emp.name}
                        </p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {emp.role}
                        </p>
                      </div>
                      {/* Check mark for selected */}
                      {isSelected && (
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Calendar + Summary */}
        <div className="col-span-2 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Working Days", value: summary.totalWorkingDays, color: "var(--foreground)", bg: "var(--secondary)" },
              { label: "Present", value: summary.present, color: "var(--primary)", bg: "var(--secondary)" },
              { label: "Absent", value: summary.absent, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
              { label: "Leaves Taken", value: summary.leaves, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4 shadow-sm"
                style={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2"
                  style={{ backgroundColor: s.bg }}
                >
                  <span style={{ color: s.color, fontSize: "16px", fontWeight: 800 }}>{s.value}</span>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div
            className="rounded-2xl p-5 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
                Monthly Attendance Calendar
              </h3>
              {/* Legend */}
              <div className="flex items-center gap-4">
                {Object.entries(STATUS_COLORS)
                  .filter(([k]) => k !== "Weekend")
                  .map(([key, val]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.dot }} />
                      <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{val.label}</span>
                    </div>
                  ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--muted-foreground)", opacity: 0.3 }} />
                  <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Weekend</span>
                </div>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className="text-center py-2"
                  style={{
                    color: d === "Sun" || d === "Sat" ? "var(--muted-foreground)" : "var(--foreground)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} />;
                }
                const status = attendanceCalendar[day] || "Weekend";
                const config = STATUS_COLORS[status];
                // Mark today only when viewing April 2026
                const isToday = month === 3 && year === 2026 && day === 6;
                const isHov = hoveredDay === day;

                // Clearly stronger hover colours per status
                const hoverBgMap: Record<string, string> = {
                  Present: "rgba(16, 185, 129, 0.25)",
                  Absent: "rgba(220, 38,  38,  0.22)",
                  Leave: "rgba(245, 158, 11,  0.22)",
                  Holiday: "rgba(20,  184, 166, 0.22)",
                  Weekend: "rgba(107, 114, 128, 0.10)",
                };
                const activeBg = hoverBgMap[status] ?? "rgba(16,185,129,0.2)";

                return (
                  <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="rounded-xl flex flex-col items-center justify-center cursor-pointer"
                    style={{
                      height: "56px",
                      transition: "background-color 150ms ease, border 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                      backgroundColor: isToday
                        ? "var(--primary)"
                        : isHov
                          ? activeBg
                          : status === "Weekend"
                            ? "transparent"
                            : config.bg,
                      border: isToday
                        ? "2px solid var(--primary)"
                        : isHov
                          ? `2px solid ${config.dot}`
                          : "2px solid transparent",
                      boxShadow: isHov && !isToday
                        ? `0 4px 16px ${config.dot}66`
                        : "none",
                      transform: isHov && !isToday ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: isToday || isHov ? 800 : 600,
                        color: isToday
                          ? "white"
                          : isHov
                            ? config.dot
                            : status === "Weekend"
                              ? "var(--muted-foreground)"
                              : config.color,
                        opacity: status === "Weekend" && !isHov ? 0.4 : 1,
                        transition: "color 150ms ease",
                      }}
                    >
                      {day}
                    </span>
                    {status !== "Weekend" && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1"
                        style={{
                          backgroundColor: isToday ? "rgba(255,255,255,0.8)" : config.dot,
                          transform: isHov ? "scale(1.3)" : "scale(1)",
                          transition: "transform 150ms ease",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Log Table */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            alignSelf: "flex-start",
          }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Daily Log</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>April 2026</p>
          </div>

          {/* Table header */}
          <div
            className="grid px-5 py-2.5"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 80px",
              backgroundColor: "var(--secondary)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Date", "In", "Out", "Status"].map((col) => (
              <span key={col} style={{ color: "var(--foreground)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.8 }}>
                {col}
              </span>
            ))}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "460px" }}>
            {dailyLogs.map((log, i) => (
              <div
                key={i}
                className="grid px-5 py-3 items-center"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr 80px",
                  borderBottom: i < dailyLogs.length - 1 ? "1px solid var(--border)" : "none",
                  backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)",
                }}
              >
                <span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 600 }}>{log.date.split(",")[0].replace("Apr ", "Apr ")}</span>
                <span style={{ color: "var(--foreground)", fontSize: "11px", opacity: 0.8 }}>{log.checkIn}</span>
                <span style={{ color: "var(--foreground)", fontSize: "11px", opacity: 0.8 }}>{log.checkOut}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-center"
                  style={{
                    backgroundColor: logStatusConfig[log.status]?.bg || "var(--secondary)",
                    color: logStatusConfig[log.status]?.color || "var(--primary)",
                    fontSize: "10px",
                    fontWeight: 700,
                    width: "fit-content",
                  }}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom summary */}
          <div
            className="px-5 py-4"
            style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Avg. Hours/Day</span>
              <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>9h 06m</span>
            </div>
            <div
              className="rounded-full overflow-hidden mt-2"
              style={{ height: "4px", backgroundColor: "var(--border)" }}
            >
              <div
                className="rounded-full"
                style={{ width: "88%", height: "100%", backgroundColor: "var(--primary)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
