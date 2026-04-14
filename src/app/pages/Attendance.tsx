import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { attendanceCalendar, dailyLogs } from "../data/mockData";

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  Present: { bg: "#F0FDF4", color: "#16A34A", dot: "#22C55E", label: "Present" },
  Absent: { bg: "#FEF2F2", color: "#DC2626", dot: "#EF4444", label: "Absent" },
  Leave: { bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B", label: "Leave" },
  Holiday: { bg: "#F5F3FF", color: "#7C3AED", dot: "#8B5CF6", label: "Holiday" },
  Weekend: { bg: "#F8FAFC", color: "#CBD5E1", dot: "#CBD5E1", label: "Weekend" },
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
    Present: { bg: "#F0FDF4", color: "#16A34A" },
    Absent: { bg: "#FEF2F2", color: "#DC2626" },
    Leave: { bg: "#FFFBEB", color: "#D97706" },
    Holiday: { bg: "#F5F3FF", color: "#7C3AED" },
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
          className="flex items-center gap-3 rounded-xl px-4 py-2.5"
          style={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} color="#3B82F6" />
            <span style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700 }}>April 2026</span>
          </div>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
        >
          <img
            src="https://images.unsplash.com/photo-1765005204058-10418f5123c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
            alt={selectedEmployee}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span style={{ color: "#0F172A", fontSize: "13px", fontWeight: 600 }}>{selectedEmployee}</span>
          <ChevronRight size={14} color="#94A3B8" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Calendar + Summary */}
        <div className="col-span-2 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Working Days", value: summary.totalWorkingDays, color: "#3B82F6", bg: "#EFF6FF" },
              { label: "Present", value: summary.present, color: "#22C55E", bg: "#F0FDF4" },
              { label: "Absent", value: summary.absent, color: "#EF4444", bg: "#FEF2F2" },
              { label: "Leaves Taken", value: summary.leaves, color: "#F59E0B", bg: "#FFFBEB" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "white",
                  border: `1px solid ${s.color}20`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2"
                  style={{ backgroundColor: s.bg }}
                >
                  <span style={{ color: s.color, fontSize: "16px", fontWeight: 800 }}>{s.value}</span>
                </div>
                <p style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#0F172A", fontSize: "15px", fontWeight: 700 }}>
                Monthly Attendance Calendar
              </h3>
              {/* Legend */}
              <div className="flex items-center gap-4">
                {Object.entries(STATUS_COLORS)
                  .filter(([k]) => k !== "Weekend")
                  .map(([key, val]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.dot }} />
                      <span style={{ color: "#64748B", fontSize: "11px" }}>{val.label}</span>
                    </div>
                  ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#CBD5E1" }} />
                  <span style={{ color: "#64748B", fontSize: "11px" }}>Weekend</span>
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
                    color: d === "Sun" || d === "Sat" ? "#CBD5E1" : "#94A3B8",
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
                        ? "#3B82F6"
                        : isHovered
                        ? config.bg
                        : status === "Weekend"
                        ? "transparent"
                        : config.bg,
                      border: isToday
                        ? "2px solid #2563EB"
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
                        color: isToday ? "white" : status === "Weekend" ? "#CBD5E1" : config.color,
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
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            alignSelf: "flex-start",
          }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700 }}>Daily Log</h3>
            <p style={{ color: "#94A3B8", fontSize: "11px", marginTop: "2px" }}>April 2026</p>
          </div>

          {/* Table header */}
          <div
            className="grid px-5 py-2.5"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 80px",
              backgroundColor: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            {["Date", "In", "Out", "Status"].map((col) => (
              <span key={col} style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>
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
                  borderBottom: i < dailyLogs.length - 1 ? "1px solid #F1F5F9" : "none",
                  backgroundColor: i % 2 === 0 ? "white" : "#FAFBFD",
                }}
              >
                <span style={{ color: "#1E293B", fontSize: "11px", fontWeight: 600 }}>{log.date.split(",")[0].replace("Apr ", "Apr ")}</span>
                <span style={{ color: "#475569", fontSize: "11px" }}>{log.checkIn}</span>
                <span style={{ color: "#475569", fontSize: "11px" }}>{log.checkOut}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-center"
                  style={{
                    backgroundColor: logStatusConfig[log.status]?.bg || "#F1F5F9",
                    color: logStatusConfig[log.status]?.color || "#475569",
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
            style={{ borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: "#64748B", fontSize: "12px" }}>Avg. Hours/Day</span>
              <span style={{ color: "#0F172A", fontSize: "13px", fontWeight: 700 }}>9h 06m</span>
            </div>
            <div
              className="rounded-full overflow-hidden mt-2"
              style={{ height: "4px", backgroundColor: "#E2E8F0" }}
            >
              <div
                className="rounded-full"
                style={{ width: "88%", height: "100%", backgroundColor: "#3B82F6" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
