import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { attendanceCalendar, dailyLogs } from "../data/mockData";

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  Present: { bg: "var(--secondary)", color: "var(--primary)", dot: "var(--primary)", label: "Present" },
  Absent: { bg: "rgba(220, 38, 38, 0.1)", color: "#DC2626", dot: "#EF4444", label: "Absent" },
  Leave: { bg: "rgba(245, 158, 11, 0.1)", color: "#D97706", dot: "#F59E0B", label: "Leave" },
  Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#0D9488", dot: "#14B8A6", label: "Holiday" },
  Weekend: { bg: "transparent", color: "var(--muted-foreground)", dot: "var(--muted-foreground)", label: "Weekend" },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// April 2026 starts on Wednesday (day index = 3)
const APRIL_START_DAY = 3;
const APRIL_DAYS = 30;

export function Attendance() {
  const [selectedEmployee, setSelectedEmployee] = useState("Sarah Johnson");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const calendarDays: (number | null)[] = [
    ...Array(APRIL_START_DAY).fill(null),
    ...Array.from({ length: APRIL_DAYS }, (_, i) => i + 1),
  ];

  // Pad to complete weeks
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

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
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} color="var(--primary)" />
            <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>April 2026</span>
          </div>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <img
            src="https://images.unsplash.com/photo-1765005204058-10418f5123c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
            alt={selectedEmployee}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{selectedEmployee}</span>
          <ChevronRight size={14} color="var(--muted-foreground)" />
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
                const isToday = day === 6; // April 6 is today
                const isHovered = hoveredDay === day;

                return (
                  <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
                    style={{
                      height: "56px",
                      backgroundColor: isToday
                        ? "var(--primary)"
                        : isHovered
                        ? config.bg
                        : status === "Weekend"
                        ? "transparent"
                        : config.bg,
                      border: isToday
                        ? "2px solid var(--primary)"
                        : isHovered
                        ? `1px solid ${config.dot}50`
                        : "1px solid transparent",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: isToday ? 800 : 600,
                        color: isToday ? "white" : status === "Weekend" ? "var(--muted-foreground)" : config.color,
                        opacity: status === "Weekend" ? 0.4 : 1
                      }}
                    >
                      {day}
                    </span>
                    {status !== "Weekend" && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1"
                        style={{ backgroundColor: isToday ? "rgba(255,255,255,0.7)" : config.dot }}
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
