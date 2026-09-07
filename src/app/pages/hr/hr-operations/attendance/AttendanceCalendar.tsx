import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { AttendanceDayDetailsModal } from "./AttendanceDayDetailsModal";
import { employees, attendanceCalendar } from "../../../../data/mockData";

interface AttendanceCalendarProps {
  selectedMonth: number;
  selectedYear: number;
  selectedDept: string;
  selectedEmpId: string;
  selectedLocation: string;
  selectedStatus: string;
  selectedShift: string;
  records: AttendanceRecord[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onNavigateToEmployee?: (id: string) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_HEADER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function AttendanceCalendar({
  selectedMonth,
  selectedYear,
  selectedDept,
  selectedEmpId,
  selectedLocation,
  selectedStatus,
  selectedShift,
  records,
  onMonthChange,
  onYearChange,
  onNavigateToEmployee,
}: AttendanceCalendarProps) {
  const [activeDayDetail, setActiveDayDetail] = useState<number | null>(null);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  // Calculate first day of month starting from Monday (0 = Mon, 6 = Sun)
  const rawFirstDay = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  const firstDayIndex = (rawFirstDay + 6) % 7; // Convert to Mon-first grid

  const calendarGrid = useMemo(() => {
    const grid = [];
    for (let i = 0; i < firstDayIndex; i++) grid.push(null);
    for (let i = 1; i <= daysInMonth; i++) grid.push(i);
    return grid;
  }, [firstDayIndex, daysInMonth]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    onMonthChange(now.getMonth());
    onYearChange(now.getFullYear());
  };

  // Helper to format date string to match Attendance records
  const formatDateStr = (day: number) => {
    const monthShort = MONTH_NAMES[selectedMonth].substring(0, 3);
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return `${monthShort} ${dayStr}, ${selectedYear}`;
  };

  // Determine status for each day based on active filters and records
  const getDayStatusData = (day: number, isWeekend: boolean) => {
    if (isWeekend) {
      return { status: "Weekend", label: "Weekend", checkIn: "", checkOut: "", hours: "" };
    }

    const dateStr = formatDateStr(day);

    const matchingRecord = records.find((r) => {
      const matchDate = r.date === dateStr;
      if (selectedEmpId !== "All Employees") {
        return matchDate && r.employeeId === selectedEmpId;
      }
      if (selectedDept !== "All Departments") {
        return matchDate && r.department === selectedDept;
      }
      return matchDate;
    });

    if (matchingRecord) {
      return {
        status: matchingRecord.status,
        label: matchingRecord.status,
        checkIn: matchingRecord.checkIn,
        checkOut: matchingRecord.checkOut,
        hours: matchingRecord.hours,
      };
    }

    // Default status logic for selected month preview
    if (selectedMonth === 3 && selectedYear === 2026) {
      const mockStatus = Reflect.get(attendanceCalendar, day) || (day % 7 === 0 ? "Holiday" : day % 9 === 0 ? "Leave" : "Present");
      return {
        status: mockStatus,
        label: mockStatus,
        checkIn: ["Present", "Late", "Half-day", "WFH"].includes(mockStatus) ? "09:00 AM" : "--:--",
        checkOut: ["Present", "Late", "Half-day", "WFH"].includes(mockStatus) ? "06:00 PM" : "--:--",
        hours: ["Present", "Late", "Half-day", "WFH"].includes(mockStatus) ? "9h 00m" : "0h 00m",
      };
    }

    return {
      status: day % 12 === 0 ? "Holiday" : day % 8 === 0 ? "Leave" : day % 5 === 0 ? "Late" : "Present",
      label: day % 12 === 0 ? "Holiday" : day % 8 === 0 ? "Leave" : day % 5 === 0 ? "Late" : "Present",
      checkIn: "08:58 AM",
      checkOut: "06:02 PM",
      hours: "9h 04m",
    };
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Absent":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Late":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Leave":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Holiday":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Half-day":
      case "Half Day":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "WFH":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Weekend":
        return "bg-neutral-100 dark:bg-zinc-800 text-muted-foreground border-transparent";
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
  };

  const selectedEmployeeName = useMemo(() => {
    if (selectedEmpId === "All Employees") return null;
    return employees.find((e) => e.id === selectedEmpId)?.name;
  }, [selectedEmpId]);

  return (
    <div
      className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Calendar Top Controls Header */}
      <div
        className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/50 dark:bg-zinc-800/20"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 rounded-full bg-[#00B87C]" />
          <div>
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span>Attendance Calendar</span>
              {selectedEmployeeName && (
                <span className="text-xs font-bold text-[#00B87C] bg-[#00B87C]/10 px-2.5 py-0.5 rounded-full">
                  {selectedEmployeeName}
                </span>
              )}
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Primary monthly workforce view for {MONTH_NAMES[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-card border rounded-xl p-1 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-extrabold px-2 text-foreground min-w-[90px] text-center">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Selectors */}
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="h-9 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="h-9 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={handleToday}
            className="h-9 px-3 rounded-xl border bg-card text-xs font-extrabold text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            style={{ borderColor: "var(--border)" }}
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-4 sm:p-6 overflow-x-auto scrollbar-thin">
        <div className="min-w-[640px]">
          {/* Weekday Labels Header (MON | TUE | WED | THU | FRI | SAT | SUN) */}
          <div className="grid grid-cols-7 mb-3 text-center">
            {DAYS_HEADER.map((dayLabel, index) => (
              <div
                key={dayLabel}
                className={`py-2 text-[11px] font-black uppercase tracking-wider ${
                  index >= 5 ? "text-slate-400 dark:text-slate-500" : "text-muted-foreground"
                }`}
              >
                {dayLabel}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[90px] rounded-2xl border border-dashed border-border/30 bg-neutral-50/30 dark:bg-zinc-900/20"
                  />
                );
              }

              const isWeekend = idx % 7 === 5 || idx % 7 === 6;
              const dayData = getDayStatusData(day, isWeekend);
              const isToday = day === 22 && selectedMonth === 3 && selectedYear === 2026;

              return (
                <button
                  key={day}
                  onClick={() => setActiveDayDetail(day)}
                  className={`group relative min-h-[90px] p-2.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between ${
                    isToday
                      ? "ring-2 ring-[#00B87C] bg-emerald-500/[0.04] border-[#00B87C]"
                      : isWeekend
                      ? "bg-neutral-50 dark:bg-zinc-800/30 border-border/60 hover:border-border"
                      : "bg-card hover:border-[#00B87C] hover:shadow-md"
                  }`}
                  style={{ borderColor: isToday ? "#00B87C" : "var(--border)" }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-sm font-black leading-none ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-[#00B87C] text-white flex items-center justify-center text-xs"
                          : isWeekend
                          ? "text-slate-400 dark:text-slate-500"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>

                    {isToday && (
                      <span className="text-[9px] font-black text-[#00B87C] uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Meaningful Status Pill (REPLACING dot-only indicators - Requirement #7) */}
                  <div className="mt-2 space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold border leading-tight ${getStatusBadgeStyle(
                        dayData.status
                      )}`}
                    >
                      {dayData.label}
                    </span>

                    {/* Show punch times & hours if employee is selected or available */}
                    {["Present", "Late", "Half-day", "WFH"].includes(dayData.status) && (
                      <div className="text-[9px] font-semibold text-muted-foreground hidden sm:block truncate">
                        <span>{dayData.checkIn}</span>
                        {dayData.hours && <span className="ml-1 text-foreground font-bold">• {dayData.hours}</span>}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar Compact Legend (Requirement #11) */}
      <div
        className="p-4 border-t bg-neutral-50/80 dark:bg-zinc-800/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-muted-foreground uppercase text-[10px] tracking-widest font-black">
          Calendar Legend:
        </span>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-foreground">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-foreground">Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-foreground">Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-foreground">Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-foreground">Half Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-foreground">WFH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Weekend</span>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {activeDayDetail !== null && (
        <AttendanceDayDetailsModal
          day={activeDayDetail}
          month={selectedMonth}
          year={selectedYear}
          selectedEmpId={selectedEmpId}
          records={records}
          onClose={() => setActiveDayDetail(null)}
          onNavigateToEmployee={onNavigateToEmployee}
        />
      )}
    </div>
  );
}
