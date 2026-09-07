import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users } from "lucide-react";
import { LeaveRequest } from "./types";

interface LeaveCalendarViewProps {
  requests: LeaveRequest[];
  month: number; // 0..11
  year: number;
  onMonthChange: (newMonth: number) => void;
  onYearChange: (newYear: number) => void;
  onDateClick: (dateStr: string, leaves: LeaveRequest[]) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function LeaveCalendarView({
  requests,
  month,
  year,
  onMonthChange,
  onYearChange,
  onDateClick,
}: LeaveCalendarViewProps) {
  // If month is -1 (All Months selected in filter), default calendar display to current month (e.g., April = 3)
  const displayMonth = month === -1 ? 3 : month;
  const displayYear = year;

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      onMonthChange(11);
      onYearChange(displayYear - 1);
    } else {
      onMonthChange(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      onMonthChange(0);
      onYearChange(displayYear + 1);
    } else {
      onMonthChange(displayMonth + 1);
    }
  };

  const handleToday = () => {
    onMonthChange(3); // April in mock dataset
    onYearChange(2026);
  };

  // Helper to parse mock dates like "Apr 10" or "Apr 8" into a Date object
  const parseMockDate = (str: string, currentYr: number) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length < 2) return null;
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const m = monthMap[parts[0]];
    const d = parseInt(parts[1], 10);
    if (m === undefined || isNaN(d)) return null;
    return new Date(currentYr, m, d);
  };

  // Compute days for calendar month grid starting from Monday
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1);
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  // Convert JS Sunday=0 to Monday=0
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

  // Get matching requests for a specific calendar date
  const getLeavesForDate = (dayNum: number) => {
    const targetDate = new Date(displayYear, displayMonth, dayNum);
    return requests.filter((r) => {
      if (r.status === "Rejected") return false;
      const fromObj = parseMockDate(r.from, displayYear);
      const toObj = parseMockDate(r.to, displayYear);
      if (!fromObj || !toObj) return false;
      return targetDate >= fromObj && targetDate <= toObj;
    });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
      {/* CALENDAR HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C]">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight m-0">
              {MONTH_NAMES[displayMonth]} {displayYear}
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              Primary workforce availability calendar
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-bold text-foreground">
              {MONTH_NAMES[displayMonth]} {displayYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <select
            value={displayMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
            className="h-9 px-3 text-xs font-bold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={displayYear}
            onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            className="h-9 px-3 text-xs font-bold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>

          <button
            onClick={handleToday}
            className="px-3.5 h-9 bg-secondary hover:bg-neutral-200 dark:hover:bg-zinc-700 text-foreground text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Today
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="border border-border rounded-2xl overflow-hidden bg-border/40">
        {/* DAYS OF WEEK HEADER */}
        <div className="grid grid-cols-7 gap-[1px] bg-secondary/80 text-center font-black text-[11px] text-muted-foreground uppercase tracking-widest py-2.5">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* MONTH CELLS */}
        <div className="grid grid-cols-7 gap-[1px]">
          {Array.from({ length: totalCells }).map((_, idx) => {
            const dayNum = idx - startingDayOfWeek + 1;
            const isCurrentMonthDay = dayNum > 0 && dayNum <= daysInMonth;
            const dateStr = isCurrentMonthDay
              ? `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
              : "";
            const dayLeaves = isCurrentMonthDay ? getLeavesForDate(dayNum) : [];
            const isToday = isCurrentMonthDay && dayNum === 18 && displayMonth === 3 && displayYear === 2026;

            if (!isCurrentMonthDay) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[100px] bg-card/30 p-2 border-b border-r border-border/20 opacity-40 pointer-events-none"
                />
              );
            }

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => onDateClick(dateStr, dayLeaves)}
                className={`min-h-[100px] p-2 bg-card border-b border-r border-border/40 hover:bg-[#00B87C]/[0.06] cursor-pointer transition-all flex flex-col justify-between group relative ${
                  isToday ? "ring-2 ring-[#00B87C] ring-inset z-10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold ${
                      isToday
                        ? "w-6 h-6 bg-[#00B87C] text-white rounded-full flex items-center justify-center shadow-xs"
                        : "text-foreground group-hover:text-[#00B87C]"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayLeaves.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[#00B87C] text-[10px] font-bold">
                      {dayLeaves.length} on leave
                    </span>
                  )}
                </div>

                {/* LEAVE BADGES IN DAY CELL */}
                <div className="mt-1 space-y-1 flex-1 flex flex-col justify-end">
                  {dayLeaves.slice(0, 2).map((req) => (
                    <div
                      key={req.id}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold truncate flex items-center justify-between gap-1 shadow-2xs border ${
                        req.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                      }`}
                      title={`${req.employee} (${req.type})`}
                    >
                      <span className="truncate">{req.employee}</span>
                      <span className="uppercase text-[9px] opacity-80 shrink-0">
                        {req.type === "Annual Leave" ? "AL" : req.type === "Sick Leave" ? "SL" : "CL"}
                      </span>
                    </div>
                  ))}
                  {dayLeaves.length > 2 && (
                    <div className="text-[10px] font-bold text-muted-foreground text-center bg-muted/60 rounded py-0.5">
                      +{dayLeaves.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border text-xs font-semibold text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold uppercase tracking-wider text-[11px]">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
            <span>Approved Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40 inline-block" />
            <span>Pending Approval</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40 inline-block" />
            <span>Critical Role Conflict</span>
          </div>
        </div>
        <span className="text-[11px] italic">Click any date cell to view detailed workforce availability</span>
      </div>
    </div>
  );
}
