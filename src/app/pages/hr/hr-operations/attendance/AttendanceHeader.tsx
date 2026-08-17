import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "./attendance.service";

interface AttendanceHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (m: number, y: number) => void;
  onAddAttendance: () => void;
  onExportClick: () => void;
}

export function AttendanceHeader({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onAddAttendance,
  onExportClick,
}: AttendanceHeaderProps) {
  const handlePrev = () => {
    let m = selectedMonth - 1;
    let y = selectedYear;
    if (m < 0) { m = 11; y--; }
    onMonthChange(m, y);
  };

  const handleNext = () => {
    let m = selectedMonth + 1;
    let y = selectedYear;
    if (m > 11) { m = 0; y++; }
    onMonthChange(m, y);
  };

  const handleToday = () => {
    const now = new Date();
    onMonthChange(now.getMonth(), now.getFullYear());
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1
          className="text-xl font-extrabold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Attendance Management
        </h1>
        <p
          className="text-[13px] font-medium mt-0.5"
          style={{ color: "var(--muted-foreground)" }}
        >
          Track and analyze employee presence across the organization.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddAttendance}
          className="flex items-center gap-2 px-4 h-10 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 shadow-sm transition-all text-xs font-bold active:scale-95"
        >
          <Plus size={16} />
          <span>Add Attendance</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-2 px-4 h-10 rounded-xl border text-xs font-bold transition-all hover:bg-[var(--secondary)] active:scale-95"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          Export
        </button>

        <div
          className="flex items-center gap-1.5 p-1 h-10 rounded-xl border bg-card"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-8 h-full rounded-lg text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleToday}
            className="px-3 h-full rounded-lg text-xs font-bold text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-8 h-full rounded-lg text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
