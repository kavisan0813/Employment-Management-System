import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Users,
  CheckSquare,
  Clock,
  ArrowLeftRight,
  CalendarPlus,
  X,
  Check,
  Filter,
  AlertTriangle,
  Download,
  CalendarDays,
  Activity,
  UserCheck,
  MoreVertical as MoreIcon,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";

interface ShiftDetails {
  type: string;
  time: string;
  isOT?: boolean;
}

interface EmployeeScheduleRow {
  name: string;
  dept: string;
  avatar: string;
  shifts: (ShiftDetails | null)[];
}

const INITIAL_SCHEDULE: EmployeeScheduleRow[] = [
  {
    name: "Arjun Mehta",
    dept: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    shifts: [
      { type: "Morning", time: "06:00-14:00" },
      null,
      { type: "Evening", time: "14:00-22:00", isOT: true },
      null,
      { type: "Morning", time: "06:00-14:00" },
      { type: "Full Day", time: "09:00-18:00" },
      { type: "Off Day", time: "Rest Day" },
    ],
  },
  {
    name: "Sneha Rao",
    dept: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    shifts: [
      null,
      { type: "Night", time: "22:00-06:00" },
      { type: "Morning", time: "06:00-14:00" },
      null,
      { type: "Evening", time: "14:00-22:00", isOT: true },
      null,
      null,
    ],
  },
  {
    name: "Dev Patel",
    dept: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    shifts: [
      { type: "Night", time: "22:00-06:00" },
      null,
      { type: "Morning", time: "06:00-14:00", isOT: true },
      { type: "Evening", time: "14:00-22:00" },
      null,
      null,
      null,
    ],
  },
  {
    name: "Priya Sharma",
    dept: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=Priya",
    shifts: [
      { type: "Leave", time: "ON APPROVED LEAVE" },
      { type: "Leave", time: "ON APPROVED LEAVE" },
      { type: "Leave", time: "ON APPROVED LEAVE" },
      { type: "Leave", time: "ON APPROVED LEAVE" },
      { type: "Leave", time: "ON APPROVED LEAVE" },
      null,
      null,
    ],
  },
  {
    name: "Aisha Khan",
    dept: "Design",
    avatar: "https://i.pravatar.cc/150?u=Aisha",
    shifts: [
      { type: "Full Day", time: "09:00-18:00" },
      { type: "Full Day", time: "09:00-18:00" },
      null,
      { type: "Morning", time: "06:00-14:00" },
      { type: "Morning", time: "06:00-14:00" },
      null,
      { type: "Off Day", time: "Rest Day" },
    ],
  },
];

const BRUSH_SHIFTS: Record<string, ShiftDetails> = {
  Morning: { type: "Morning", time: "06:00-14:00" },
  Evening: { type: "Evening", time: "14:00-22:00" },
  Night: { type: "Night", time: "22:00-06:00" },
  "Full Day": { type: "Full Day", time: "09:00-18:00" },
};

export function ManagerTeamSchedule() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [view, setView] = useState<"Week" | "Month" | "Day">("Week");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBrush, setActiveBrush] = useState<string | null>(null);

  // Week navigation state
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    new Date(2026, 3, 6),
  ); // Apr 6, 2026
  const [shiftsByDate, setShiftsByDate] = useState<
    Record<string, Record<string, ShiftDetails | null>>
  >({});

  const getShiftForDate = (empName: string, dateStr: string) => {
    // Check user edits first
    if (shiftsByDate[empName] && shiftsByDate[empName][dateStr] !== undefined) {
      return shiftsByDate[empName][dateStr];
    }

    // Default mock data mapping for baseline week starting Apr 6, 2026
    const baseDate = new Date(2026, 3, 6);
    const dateObj = new Date(dateStr);

    // Check if it lies in the baseline week (Apr 6, 2026 to Apr 12, 2026)
    const diffTime = dateObj.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const emp = INITIAL_SCHEDULE.find((e) => e.name === empName);
    if (emp && diffDays >= 0 && diffDays < 7) {
      return emp.shifts[diffDays];
    }

    // Deterministic mixed hash for other weeks
    const seed = `${empName}_${dateStr}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 33) ^ seed.charCodeAt(i);
    }
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash = hash ^ (hash >>> 16);
    const rand = Math.abs(hash % 1000) / 1000;

    if (rand > 0.45) {
      const types = ["Morning", "Evening", "Night", "Full Day"];
      const type = types[Math.floor(rand * 4)];
      return BRUSH_SHIFTS[type];
    }
    return null; // Off Day
  };

  const currentWeekScheduleData = useMemo(() => {
    return INITIAL_SCHEDULE.map((emp) => {
      const shiftsArray: (ShiftDetails | null)[] = Array.from({
        length: 7,
      }).map((_, dayIdx) => {
        const dateObj = new Date(weekStartDate);
        dateObj.setDate(weekStartDate.getDate() + dayIdx);
        const dateStr = dateObj.toISOString().split("T")[0];
        return getShiftForDate(emp.name, dateStr);
      });

      return {
        name: emp.name,
        dept: emp.dept,
        avatar: emp.avatar,
        shifts: shiftsArray,
      };
    });
  }, [weekStartDate, shiftsByDate]);
  const [isPainting, setIsPainting] = useState(false);

  // Shift Swap Requests State
  const [swapRequests, setSwapRequests] = useState([
    {
      id: "s1",
      emp1: "Arjun M.",
      emp2: "Dev P.",
      avatar1: "AM",
      avatar2: "DP",
      color1: "#059669",
      color2: "#2563EB",
      details: "Morning ↔ Night",
      dateText: "Wed Apr 8 Evening ↔ Wed Apr 8 Morning",
      reason: "Personal appointment clash on Wednesday morning.",
    },
    {
      id: "s2",
      emp1: "Sneha R.",
      emp2: "Priya S.",
      avatar1: "SR",
      avatar2: "PS",
      color1: "#7C3AED",
      color2: "#DB2777",
      details: "Night ↔ Evening",
      dateText: "Tue Apr 7 Night ↔ Wed Apr 8 Evening",
      reason: "Medical check-up scheduled for Tuesday night.",
    },
  ]);
  const [viewingSwap, setViewingSwap] = useState<
    (typeof swapRequests)[0] | null
  >(null);

  const handleApproveSwap = (id: string) => {
    const swap = swapRequests.find((s) => s.id === id);
    if (!swap) return;
    alert(`Shift swap approved between ${swap.emp1} and ${swap.emp2}`);
    setSwapRequests((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRejectSwap = (id: string) => {
    const swap = swapRequests.find((s) => s.id === id);
    if (!swap) return;
    alert(`Shift swap rejected between ${swap.emp1} and ${swap.emp2}`);
    setSwapRequests((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCellDrop = (
    empName: string,
    dayIndex: number,
    shiftType: string,
  ) => {
    const shiftInfo = BRUSH_SHIFTS[shiftType];
    if (!shiftInfo) return;

    const dateObj = new Date(weekStartDate);
    dateObj.setDate(weekStartDate.getDate() + dayIndex);
    const dateStr = dateObj.toISOString().split("T")[0];

    setShiftsByDate((prev) => ({
      ...prev,
      [empName]: {
        ...(prev[empName] || {}),
        [dateStr]: { ...shiftInfo },
      },
    }));
  };

  // Modal specific fields
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState("");
  const [selectedDayIndexForModal, setSelectedDayIndexForModal] = useState<
    number | null
  >(null);
  const [newShiftType, setNewShiftType] = useState("Morning (06:00 - 14:00)");
  const [newShiftDate, setNewShiftDate] = useState("");
  const [newShiftNotes, setNewShiftNotes] = useState("");

  // Attach a global mouseup listener to stop painting if mouse button is released outside cells
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPainting(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const handleCellPaint = (empName: string, dayIndex: number) => {
    if (!activeBrush) return;
    const shiftInfo = BRUSH_SHIFTS[activeBrush];
    if (!shiftInfo) return;

    const dateObj = new Date(weekStartDate);
    dateObj.setDate(weekStartDate.getDate() + dayIndex);
    const dateStr = dateObj.toISOString().split("T")[0];

    setShiftsByDate((prev) => ({
      ...prev,
      [empName]: {
        ...(prev[empName] || {}),
        [dateStr]: { ...shiftInfo },
      },
    }));
  };

  const handleCellClick = (empName: string, dayIndex: number) => {
    if (activeBrush) {
      handleCellPaint(empName, dayIndex);
    } else {
      setSelectedEmployeeForModal(empName);
      setSelectedDayIndexForModal(dayIndex);
      const dateObj = new Date(weekStartDate);
      dateObj.setDate(weekStartDate.getDate() + dayIndex);
      const dateStr = dateObj.toISOString().split("T")[0];
      setNewShiftDate(dateStr);
      setNewShiftType("Morning (06:00 - 14:00)");
      setShowAddModal(true);
    }
  };

  const handleAddShiftConfirm = () => {
    if (selectedEmployeeForModal && selectedDayIndexForModal !== null) {
      let type = "Morning";
      let time = "06:00-14:00";
      if (newShiftType.includes("Evening")) {
        type = "Evening";
        time = "14:00-22:00";
      } else if (newShiftType.includes("Night")) {
        type = "Night";
        time = "22:00-06:00";
      } else if (newShiftType.includes("Full Day")) {
        type = "Full Day";
        time = "09:00-18:00";
      }

      const dateObj = new Date(weekStartDate);
      dateObj.setDate(weekStartDate.getDate() + selectedDayIndexForModal);
      const dateStr = dateObj.toISOString().split("T")[0];

      setShiftsByDate((prev) => ({
        ...prev,
        [selectedEmployeeForModal]: {
          ...(prev[selectedEmployeeForModal] || {}),
          [dateStr]: { type, time },
        },
      }));
      setShowAddModal(false);
      setSelectedEmployeeForModal("");
      setSelectedDayIndexForModal(null);
      setNewShiftNotes("");
    } else if (selectedEmployeeForModal) {
      const dateObj = new Date(newShiftDate);
      const dateStr = dateObj.toISOString().split("T")[0];

      let type = "Morning";
      let time = "06:00-14:00";
      if (newShiftType.includes("Evening")) {
        type = "Evening";
        time = "14:00-22:00";
      } else if (newShiftType.includes("Night")) {
        type = "Night";
        time = "22:00-06:00";
      } else if (newShiftType.includes("Full Day")) {
        type = "Full Day";
        time = "09:00-18:00";
      }

      setShiftsByDate((prev) => ({
        ...prev,
        [selectedEmployeeForModal]: {
          ...(prev[selectedEmployeeForModal] || {}),
          [dateStr]: { type, time },
        },
      }));
      setShowAddModal(false);
      setSelectedEmployeeForModal("");
      setNewShiftNotes("");
    }
  };

  const handlePrevWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      if (view === "Week") {
        d.setDate(prev.getDate() - 7);
      } else if (view === "Month") {
        d.setMonth(prev.getMonth() - 1);
      } else {
        d.setDate(prev.getDate() - 1);
      }
      return d;
    });
  };

  const handleNextWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      if (view === "Week") {
        d.setDate(prev.getDate() + 7);
      } else if (view === "Month") {
        d.setMonth(prev.getMonth() + 1);
      } else {
        d.setDate(prev.getDate() + 1);
      }
      return d;
    });
  };

  const handleTodayWeek = () => {
    setWeekStartDate(new Date(2026, 3, 6));
  };

  const filteredScheduleData = currentWeekScheduleData.filter((row) => {
    if (selectedDept === "All Departments") return true;
    return row.dept === selectedDept;
  });

  const handleExport = () => {
    const headers = [
      "Employee Name",
      "Department",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
    const rows = filteredScheduleData.map((row) => {
      const shiftStrings = row.shifts.map((s) =>
        s ? `${s.type} (${s.time})` : "Off",
      );
      return [
        `"${row.name}"`,
        `"${row.dept}"`,
        ...shiftStrings.map((s) => `"${s}"`),
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_schedule_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      "Exported!",
      "success",
      "Team schedule exported successfully as CSV.",
    );
  };

  const getWeekRangeLabel = () => {
    if (view === "Week") {
      const startStr = weekStartDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endDate = new Date(weekStartDate);
      endDate.setDate(weekStartDate.getDate() + 6);
      const endStr = endDate.toLocaleDateString("en-US", {
        month:
          weekStartDate.getMonth() === endDate.getMonth() ? undefined : "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startStr} - ${endStr}`;
    } else if (view === "Month") {
      return weekStartDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return weekStartDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Clock size={22} className="text-[#10B981]" />
          </div>
          <div>
            <h1
              className="text-[26px] font-bold tracking-tight leading-none"
              style={{ color: "var(--foreground)" }}
            >
              Team Schedule
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Efficiently manage workforce rotations and coverage.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95 flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => setActiveBrush(activeBrush ? null : "Morning")}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl border transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95 flex items-center gap-2 ${
              activeBrush
                ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]"
                : ""
            }`}
            style={
              activeBrush
                ? {}
                : { borderColor: "var(--border)", color: "var(--foreground)" }
            }
          >
            <CalendarPlus size={16} /> Shift Painter
          </button>
          <button
            onClick={() => {
              setSelectedEmployeeForModal(filteredScheduleData[0]?.name || "");
              setSelectedDayIndexForModal(0);
              const dateStr = weekStartDate.toISOString().split("T")[0];
              setNewShiftDate(dateStr);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#00B87C" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-bold">Add Shift</span>
          </button>
        </div>
      </div>

      {/* COVERAGE + STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckSquare size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">
              Coverage Status
            </p>
            <p className="text-sm font-bold text-foreground">
              94.2% Optimal Coverage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400 tracking-widest">
              System Alerts
            </p>
            <p className="text-sm font-bold text-foreground">
              1 Understaffed Shift
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-blue-700 dark:text-blue-400 tracking-widest">
              Pending Swaps
            </p>
            <p className="text-sm font-bold text-foreground">
              2 Pending Reviews
            </p>
          </div>
        </div>
      </div>

      {/* DATE NAV + CONTROLS */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold px-3 text-foreground min-w-[180px] text-center">
              {getWeekRangeLabel()}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={handleTodayWeek}
            className="px-4 py-2 text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors active:scale-95"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <select
              className="pl-9 pr-6 py-2 rounded-xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-foreground"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All Departments">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
          <div className="flex p-1 bg-secondary rounded-xl">
            {["Week", "Month", "Day"].map((v) => (
              <button
                key={v}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  view === v
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setView(v as "Week" | "Month" | "Day")}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Team Shifts
              </p>
              <p className="text-3xl font-bold tracking-tight text-emerald-600">
                38
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary transition-colors group-hover:bg-neutral-100">
              <Users size={24} color="var(--primary)" />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Coverage Target
              </p>
              <p className="text-3xl font-bold tracking-tight text-emerald-600">
                91%
              </p>
              <div className="w-28 h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "91%" }}
                ></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 group-hover:bg-emerald-100">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Overtime
              </p>
              <p className="text-3xl font-bold tracking-tight text-amber-600">
                42<span className="text-sm ml-1 font-bold">h</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 group-hover:bg-amber-100">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Swap Requests
              </p>
              <p className="text-3xl font-bold tracking-tight text-teal-600">
                2
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 text-teal-600 group-hover:bg-teal-100">
              <CalendarDays size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* QUICK TOOL ROW */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] bg-secondary flex items-center justify-center text-[#00B87C]">
              <CalendarPlus size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mb-1">
                Quick Tool
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                Shift Painter
              </p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          <div className="flex gap-4">
            {[
              { type: "Morning", color: "bg-[#00B87C]", label: "MOR" },
              { type: "Evening", color: "bg-[#F59E0B]", label: "EVE" },
              { type: "Night", color: "bg-[#7C3AED]", label: "NGT" },
              { type: "Full Day", color: "bg-[#3B82F6]", label: "FUL" },
            ].map((type) => (
              <div
                key={type.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("shiftType", type.type);
                }}
                onClick={() =>
                  setActiveBrush(activeBrush === type.type ? null : type.type)
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all hover:bg-secondary select-none ${
                  activeBrush === type.type
                    ? "bg-[#E8F5E9] dark:bg-emerald-900/20 border border-[#00B87C]/20"
                    : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full ${type.color} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}
                >
                  {type.label}
                </div>
                <span className="text-xs font-bold text-foreground pr-1">
                  {type.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase text-emerald-600 tracking-widest leading-none mb-1">
              Staffing Level
            </p>
            <p className="text-sm font-bold text-foreground leading-none">
              Optimal (11/12)
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* VIEW RENDERERS */}
      {view === "Week" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8 bg-white dark:bg-zinc-900">
          <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-secondary/50 border-b border-border">
            <div className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
              Employee
            </div>
            {Array.from({ length: 7 }).map((_, i) => {
              const dateObj = new Date(weekStartDate);
              dateObj.setDate(weekStartDate.getDate() + i);
              const dayLabel = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const monthLabel = dateObj.toLocaleDateString("en-US", {
                month: "short",
              });
              const dateNum = dateObj.getDate();
              return (
                <div
                  key={i}
                  className={`px-3 py-3 text-center border-l border-border flex flex-col justify-center ${dayLabel === "Mon" ? "bg-[#00B87C]/5" : ""}`}
                >
                  <span
                    className={`text-xs font-bold ${dayLabel === "Mon" ? "text-[#00B87C] border-b-2 border-[#00B87C] pb-0.5 inline-block mx-auto" : "text-foreground"}`}
                  >
                    {dayLabel}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-bold mt-1">
                    {monthLabel} {dateNum}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid-body divide-y divide-border">
            {filteredScheduleData.map((emp) => (
              <div
                key={emp.name}
                className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]"
              >
                <EmployeeCell
                  name={emp.name}
                  dept={emp.dept}
                  avatar={emp.avatar}
                />
                {emp.shifts.map((shift, dayIdx) => {
                  if (shift?.type === "Leave") {
                    if (emp.name === "Priya Sharma") {
                      if (dayIdx === 0) {
                        return (
                          <div
                            key={dayIdx}
                            className="col-span-5 border-l border-border/50 p-1"
                          >
                            <div
                              className="w-full h-full rounded-xl flex items-center justify-center text-[11px] font-bold tracking-widest text-[#F59E0B] border-l-4 border-l-[#F59E0B]"
                              style={{ backgroundColor: "#FEF3C7" }}
                            >
                              ON APPROVED LEAVE
                            </div>
                          </div>
                        );
                      } else if (dayIdx < 5) {
                        return null;
                      }
                    }
                    return (
                      <div
                        key={dayIdx}
                        className="border-l border-border/50 p-1 flex items-stretch"
                      >
                        <div className="flex-1 rounded-xl p-2 flex flex-col justify-center text-left bg-[#FEF3C7] text-[#F59E0B] border-l-4 border-l-[#F59E0B]">
                          <span className="text-[11px] font-bold uppercase tracking-tight">
                            Leave
                          </span>
                          <span className="text-[11px] font-bold opacity-80">
                            {shift.time}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (!shift) {
                    return (
                      <EmptyCell
                        key={dayIdx}
                        onMouseDown={() => {
                          setIsPainting(true);
                          handleCellPaint(emp.name, dayIdx);
                        }}
                        onMouseEnter={() => {
                          if (isPainting) handleCellPaint(emp.name, dayIdx);
                        }}
                        onClick={() => handleCellClick(emp.name, dayIdx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const shiftType = e.dataTransfer.getData("shiftType");
                          if (shiftType)
                            handleCellDrop(emp.name, dayIdx, shiftType);
                        }}
                      />
                    );
                  }

                  return (
                    <ShiftCell
                      key={dayIdx}
                      type={shift.type}
                      time={shift.time}
                      isOT={shift.isOT}
                      onMouseDown={() => {
                        setIsPainting(true);
                        handleCellPaint(emp.name, dayIdx);
                      }}
                      onMouseEnter={() => {
                        if (isPainting) handleCellPaint(emp.name, dayIdx);
                      }}
                      onClick={() => handleCellClick(emp.name, dayIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const shiftType = e.dataTransfer.getData("shiftType");
                        if (shiftType)
                          handleCellDrop(emp.name, dayIdx, shiftType);
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "Day" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6 mb-8 bg-white dark:bg-zinc-900">
          <h3 className="text-sm font-bold text-foreground mb-4">
            Shifts for{" "}
            {weekStartDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="divide-y divide-border">
            {filteredScheduleData.map((emp) => {
              const dateStr = weekStartDate.toISOString().split("T")[0];
              const todayShift = getShiftForDate(emp.name, dateStr);
              return (
                <div
                  key={emp.name}
                  className="py-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      className="w-8 h-8 rounded-full border"
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {emp.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {emp.dept}
                      </p>
                    </div>
                  </div>
                  <div>
                    {todayShift ? (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20">
                        {todayShift.type} ({todayShift.time})
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        No shift assigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "Month" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6 mb-8 bg-white dark:bg-zinc-900">
          <h3 className="text-sm font-bold text-foreground mb-4">
            Monthly Shift Coverage Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScheduleData.map((emp) => {
              const year = weekStartDate.getFullYear();
              const month = weekStartDate.getMonth();
              const totalDays = new Date(year, month + 1, 0).getDate();

              let scheduledShiftsCount = 0;
              let restDaysCount = 0;

              for (let d = 1; d <= totalDays; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const shift = getShiftForDate(emp.name, dateStr);
                if (
                  shift &&
                  shift.type !== "Off Day" &&
                  shift.type !== "Leave" &&
                  shift.type !== "Rest Day"
                ) {
                  scheduledShiftsCount++;
                } else {
                  restDaysCount++;
                }
              }

              return (
                <div
                  key={emp.name}
                  className="p-4 rounded-xl border border-border bg-card space-y-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      className="w-8 h-8 rounded-full border"
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {emp.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {emp.dept}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex justify-between items-center text-xs pt-1 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="text-muted-foreground">
                      Scheduled Shifts
                    </span>
                    <span className="font-bold text-foreground">
                      {scheduledShiftsCount} shifts this month
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Monthly Rest Days
                    </span>
                    <span className="font-bold text-foreground">
                      {restDaysCount} days
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {/* Swap Requests */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-[400px] transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <ArrowLeftRight color="#00B87C" size={18} />
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Shift Swap Requests
              </h3>
            </div>
            <span className="px-3 py-1 bg-amber-50/50 text-amber-600 text-[11px] font-bold rounded-full border border-amber-200">
              {swapRequests.length} PENDING
            </span>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {swapRequests.map((swap) => (
              <div
                key={swap.id}
                className="pb-4 border-b border-border/50 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: swap.color1 }}
                      >
                        {swap.avatar1}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: swap.color2 }}
                      >
                        {swap.avatar2}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        {swap.emp1} ↔ {swap.emp2}
                      </span>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {swap.details}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectSwap(swap.id)}
                      className="w-8 h-8 flex items-center justify-center bg-neutral-50 text-muted-foreground rounded-full border border-border hover:bg-neutral-100 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => handleApproveSwap(swap.id)}
                      className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
                <div className="bg-[#F4FBF7] dark:bg-zinc-800/50 px-4 py-3 rounded-2xl flex items-center justify-between">
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {swap.dateText}
                  </p>
                  <button
                    onClick={() => setViewingSwap(swap)}
                    className="text-[12px] font-bold text-[#00B87C] hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
            {swapRequests.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs py-8">
                <Check size={28} className="text-emerald-500 mb-2" />
                No pending shift swap requests
              </div>
            )}
          </div>
        </div>

        {/* Overtime Summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Clock color="#F59E0B" size={18} />
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Overtime Monitoring
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-secondary text-primary text-[11px] font-bold rounded-full border border-primary/20">
              42 TOTAL HRS
            </span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {[
              {
                name: "Dev Patel",
                hrs: 12,
                limit: 15,
                color: "#F59E0B",
                avatar: "DP",
              },
              {
                name: "Arjun Mehta",
                hrs: 8,
                limit: 15,
                color: "var(--primary)",
                avatar: "AM",
              },
              {
                name: "Sneha Rao",
                hrs: 4,
                limit: 15,
                color: "var(--primary)",
                avatar: "SR",
              },
            ].map((item) => (
              <div key={item.name} className="group">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary">
                      {item.avatar}
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: item.color }}
                  >
                    {item.hrs}h{" "}
                    <span className="text-[11px] font-medium text-muted-foreground ml-1">
                      / {item.limit}h
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.hrs / 20) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 mt-auto">
            <button className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors">
              Generate Overtime Report
            </button>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border animate-in zoom-in-95"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="p-6 border-b flex items-center justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-secondary flex items-center justify-center text-primary">
                  <CalendarPlus size={20} />
                </div>
                <h3 className="text-[16px] font-bold text-foreground">
                  Assign New Shift
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Employee
                </label>
                <input
                  type="text"
                  value={selectedEmployeeForModal}
                  onChange={(e) => setSelectedEmployeeForModal(e.target.value)}
                  placeholder="Search team member..."
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors text-foreground"
                  style={{
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Shift Type
                </label>
                <select
                  value={newShiftType}
                  onChange={(e) => setNewShiftType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors appearance-none text-foreground bg-white dark:bg-zinc-900"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <option>Morning (06:00 - 14:00)</option>
                  <option>Evening (14:00 - 22:00)</option>
                  <option>Night (22:00 - 06:00)</option>
                  <option>Full Day (09:00 - 18:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Department
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors appearance-none text-foreground bg-white dark:bg-zinc-900"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <option>Engineering</option>
                  <option>Design</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Shift Date
                </label>
                <input
                  type="date"
                  value={newShiftDate}
                  onChange={(e) => setNewShiftDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors text-foreground"
                  style={{
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  value={newShiftNotes}
                  onChange={(e) => setNewShiftNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="w-full h-20 p-4 rounded-xl border bg-transparent text-[13px] outline-none focus:border-[#00B87C] transition-colors resize-none text-foreground"
                  style={{
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>
            <div
              className="p-6 border-t flex items-center justify-end gap-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-b-2xl"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-colors hover:bg-[#00B87C]/[0.08] dark:hover:bg-zinc-900"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddShiftConfirm}
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-[#10B981]/20 hover:opacity-90"
                style={{ backgroundColor: "#00B87C" }}
              >
                Assign Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Details Modal */}
      {viewingSwap && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="w-full max-w-[420px] bg-card rounded-2xl shadow-2xl border border-border animate-in zoom-in-95">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="text-[#00B87C]" size={20} />
                <h3 className="text-base font-bold text-foreground">
                  Shift Swap Details
                </h3>
              </div>
              <button
                onClick={() => setViewingSwap(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl border border-border">
                <div className="text-center flex-1">
                  <p className="font-bold text-foreground">
                    {viewingSwap.emp1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Original Shift
                  </p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-[#DCFCE7] text-[#00B87C] text-[10px] font-bold rounded">
                    {viewingSwap.details.split(" ↔ ")[0]}
                  </span>
                </div>
                <div className="text-muted-foreground px-2">↔</div>
                <div className="text-center flex-1">
                  <p className="font-bold text-foreground">
                    {viewingSwap.emp2}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Original Shift
                  </p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-bold rounded">
                    {viewingSwap.details.split(" ↔ ")[1]}
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Proposed Timing
                </span>
                <p className="text-xs text-foreground font-semibold bg-secondary/40 p-2.5 rounded-lg border">
                  {viewingSwap.dateText}
                </p>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Reason for Request
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/40 p-2.5 rounded-lg border">
                  {viewingSwap.reason}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-secondary/20 rounded-b-2xl">
              <button
                onClick={() => {
                  handleRejectSwap(viewingSwap.id);
                  setViewingSwap(null);
                }}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  handleApproveSwap(viewingSwap.id);
                  setViewingSwap(null);
                }}
                className="px-5 py-2 rounded-xl text-white text-xs font-bold bg-[#00B87C] hover:opacity-90 shadow-lg shadow-emerald-500/20"
              >
                Approve Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyCell({
  onMouseDown,
  onMouseEnter,
  onClick,
  onDragOver,
  onDrop,
}: {
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="border-l border-border/50 p-1 flex items-stretch select-none"
    >
      <div className="flex-1 rounded-xl border border-dashed border-border/60 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-colors flex items-center justify-center text-muted-foreground/40 hover:text-emerald-500 cursor-pointer">
        <Plus size={12} />
      </div>
    </div>
  );
}

function ShiftCell({
  type,
  time,
  isOT,
  onMouseDown,
  onMouseEnter,
  onClick,
  onDragOver,
  onDrop,
}: {
  type: string;
  time: string;
  isOT?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  let styleClass = "";
  if (type === "Morning")
    styleClass = "bg-[#DCFCE7] text-[#00B87C] border-l-[#00B87C]";
  if (type === "Evening")
    styleClass = "bg-[#FEF3C7] text-[#F59E0B] border-l-[#F59E0B]";
  if (type === "Night")
    styleClass = "bg-[#EDE9FE] text-[#7C3AED] border-l-[#7C3AED]";
  if (type === "Full Day")
    styleClass = "bg-[#DBEAFE] text-[#3B82F6] border-l-[#3B82F6]";
  if (type === "Off Day")
    styleClass = "bg-slate-100 text-[#90A4AE] border-l-[#90A4AE]";

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="border-l border-border/50 p-1 flex items-stretch select-none"
    >
      <div
        className={`flex-1 rounded-xl p-2 flex flex-col justify-center text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm relative group border-l-4 ${styleClass}`}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-tight">
            {type}
          </span>
          {isOT && (
            <span className="text-[8px] bg-red-500 text-white px-1.5 rounded-full font-bold animate-pulse">
              OT
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold opacity-80">{time}</span>
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreIcon
            size={12}
            className="text-current opacity-70 hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}

// Subcomponents for Table Grid
function EmployeeCell({
  name,
  dept,
  avatar,
}: {
  name: string;
  dept: string;
  avatar: string;
}) {
  return (
    <div className="px-4 py-2 flex items-center gap-3 border-r border-border/50">
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-foreground leading-tight">
          {name}
        </span>
        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight mt-0.5">
          {dept}
        </span>
      </div>
    </div>
  );
}
