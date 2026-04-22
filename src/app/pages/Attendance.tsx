import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  ChevronDown, 
  Search, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  User,
  Users,
  Download,
  MoreVertical,
  ArrowUpRight,
  Monitor,
  Home,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from "recharts";

interface AttendanceRow {
  date: string;
  name: string;
  department: string;
  status: string;
  checkIn: string;
  checkOut: string;
  hours: string;
}

import { attendanceCalendar, dailyLogs, employees, departments } from "../data/mockData";

/* ─── Constants ─────────────────────────────── */

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: React.ElementType; label: string }> = {
  Present: { bg: "rgba(16, 185, 129, 0.1)", color: "var(--primary)", icon: CheckCircle2, label: "Present" },
  Absent: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", icon: XCircle, label: "Absent" },
  Late: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", icon: Clock, label: "Late" },
  "Half-day": { bg: "rgba(234, 179, 8, 0.1)", color: "#EAB308", icon: AlertCircle, label: "Half-day" },
  WFH: { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", icon: Home, label: "WFH" },
  Leave: { bg: "rgba(167, 139, 250, 0.1)", color: "#A78BFA", icon: CalendarIcon, label: "Leave" },
  Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#14B8A6", icon: CalendarDays, label: "Holiday" },
  Weekend: { bg: "transparent", color: "var(--muted-foreground)", icon: Monitor, label: "Weekend" },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Mock Analytics Data ──────────────────── */

const monthlyTrendData = [
  { month: "Jan", attendance: 94 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 96 },
  { month: "Apr", attendance: 91 },
  { month: "May", attendance: 95 },
  { month: "Jun", attendance: 93 },
];

const statusDistribution = [
  { name: "Present", value: 85, color: "var(--primary)" },
  { name: "Absent", value: 5, color: "#EF4444" },
  { name: "Late", value: 6, color: "#F59E0B" },
  { name: "Leave", value: 4, color: "#A78BFA" },
];

/* ─── Components ─────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Present;
  const Icon = config.icon;
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

export function Attendance() {
  const navigate = useNavigate();
  const [view, setView] = useState<"table" | "calendar">("table");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedEmpId, setSelectedEmpId] = useState("All Employees");
  const [selectedMonth, setSelectedMonth] = useState(3); // April
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 8;

  const deptRef = useRef<HTMLDivElement>(null);
  const empRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) setShowDeptDropdown(false);
      if (empRef.current && !empRef.current.contains(e.target as Node)) setShowEmpDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Dependent Filter Logic
  const filteredEmployeesList = useMemo(() => {
    if (selectedDept === "All Departments") return employees;
    return employees.filter(emp => emp.department === selectedDept);
  }, [selectedDept]);

  const displayedEmployees = useMemo(() => {
    if (!searchQuery) return filteredEmployeesList;
    return filteredEmployeesList.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredEmployeesList, searchQuery]);

  const selectedEmployee = useMemo(() => {
    return employees.find(emp => emp.id === selectedEmpId);
  }, [selectedEmpId]);

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    setSelectedEmpId("All Employees"); // Reset employee when department changes
    setShowDeptDropdown(false);
  };

  const handleReset = () => {
    setSelectedDept("All Departments");
    setSelectedEmpId("All Employees");
    setSelectedMonth(3);
    setSelectedYear(2026);
    setSearchQuery("");
  };

  const handleDownload = (e: React.MouseEvent, type: "full" | "row" = "full", rowData?: AttendanceRow) => {
    e.stopPropagation();
    if (isDownloading) return;
    if (type === "row" && !rowData) return;
    
    setIsDownloading(true);
    
    // Simulate processing
    setTimeout(() => {
      let csvContent = "";
      let filename = "attendance_report_bulk.csv";

      if (type === "full") {
        csvContent = "Date,Employee,Department,Status,Check In,Check Out,Hours\n" + 
          dailyLogs.map(log => `${log.date},${selectedEmployee?.name || "Multiple"},${selectedDept},${log.status},${log.checkIn},${log.checkOut},${log.hours}`).join("\n");
      } else if (rowData) {
        csvContent = `Date,Employee,Department,Status,Check In,Check Out,Hours\n${rowData.date},${rowData.name},${rowData.department},${rowData.status},${rowData.checkIn},${rowData.checkOut},${rowData.hours}`;
        filename = `attendance_report_${rowData.name.replace(/\s+/g, "_")}.csv`;
      }
      
      if (!csvContent) {
        setIsDownloading(false);
        return;
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
    }, 1500);
  };

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [selectedMonth, selectedYear, daysInMonth, firstDayOfMonth]);

  // Metrics
  const metrics = {
    totalDays: 22,
    present: 19,
    absent: 1,
    late: 2,
    attendanceRate: 92,
    lateTrend: -5, // Percentage change
  };

  const handleEmployeeRedirect = (id: string) => {
    navigate(`/employees/${id}`);
  };

  return (
    <div className="max-w-[1320px] mx-auto pb-6 space-y-5">
      
      {/* Day Detail Modal Overlay */}
      {selectedDayDetail && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDayDetail(null)}
        >
          <div 
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ borderColor: "var(--border)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold">
                  {selectedDayDetail}
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>{MONTH_NAMES[selectedMonth]} {selectedDayDetail}, {selectedYear}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Attendance Detail</p>
                </div>
              </div>
              <button onClick={() => setSelectedDayDetail(null)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors">
                <MoreVertical size={18} className="rotate-90" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-zinc-800/50 border" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--primary)]">
                    <img src={selectedEmployee?.avatar || employees[0].avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black" style={{ color: "var(--foreground)" }}>{selectedEmployee?.name || "Sarah Johnson"}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{selectedEmployee?.role || "Senior Developer"}</p>
                  </div>
                </div>
                <StatusBadge status={attendanceCalendar[selectedDayDetail] || "Present"} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Punch In</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: "var(--foreground)" }}>08:58 AM</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">2m early</p>
                </div>
                <div className="p-4 rounded-xl border bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight size={16} className="text-orange-500 rotate-90" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Punch Out</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: "var(--foreground)" }}>06:02 PM</p>
                  <p className="text-[9px] text-muted-foreground font-bold mt-1">On time</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log Timeline</h4>
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-1 before:bottom-1 before:w-0.5 before:bg-neutral-100 dark:before:bg-zinc-800">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute -left-[22px] w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
                    <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Check-in recorded</span>
                    <span className="text-[10px] font-bold text-muted-foreground">08:58 AM</span>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="absolute -left-[22px] w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
                    <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Work started</span>
                    <span className="text-[10px] font-bold text-muted-foreground">09:05 AM</span>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="absolute -left-[22px] w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
                    <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Checkout recorded</span>
                    <span className="text-[10px] font-bold text-muted-foreground">06:02 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 dark:bg-zinc-800/50 border-t flex gap-3" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setSelectedDayDetail(null)} className="flex-1 py-3 rounded-xl border text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white dark:hover:bg-zinc-900 transition-all" style={{ borderColor: "var(--border)" }}>
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedDayDetail(null);
                  handleEmployeeRedirect(selectedEmployee?.id || "EMP001");
                }}
                className="flex-1 py-3 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all" 
                style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header & View Toggle ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>Attendance Management</h1>
          <p className="text-[13px] font-medium mt-0.5" style={{ color: "var(--muted-foreground)" }}>Track and analyze employee presence across the organization.</p>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
          <button 
            onClick={() => setView("table")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "table" ? "bg-[var(--secondary)] text-[var(--primary)] shadow-sm" : "text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800"}`}
          >
            <List size={14} /> Table
          </button>
          <button 
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "calendar" ? "bg-[var(--secondary)] text-[var(--primary)] shadow-sm" : "text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800"}`}
          >
            <LayoutGrid size={14} /> Calendar
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm" style={{ borderColor: "var(--border)" }}>
        
        {/* Date Filter */}
        <div className="lg:col-span-3 space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Period Selection</label>
          <div className="flex items-center gap-2">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 h-10 px-3 rounded-xl border bg-transparent text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-20 h-10 px-3 rounded-xl border bg-transparent text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="lg:col-span-3 space-y-1 relative" ref={deptRef}>
          <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Department</label>
          <button 
            onClick={() => setShowDeptDropdown(!showDeptDropdown)}
            className="w-full h-10 px-4 rounded-xl border bg-transparent flex items-center justify-between text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            style={{ borderColor: showDeptDropdown ? "var(--primary)" : "var(--border)", color: "var(--foreground)" }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Users size={14} className="text-emerald-600 flex-shrink-0" />
              <span className="truncate">{selectedDept}</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showDeptDropdown ? "rotate-180" : ""}`} />
          </button>
          
          {showDeptDropdown && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div className="max-h-60 overflow-y-auto">
                <button 
                  onClick={() => handleDeptChange("All Departments")}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b"
                  style={{ borderColor: "var(--border)", color: selectedDept === "All Departments" ? "var(--primary)" : "var(--foreground)" }}
                >
                  All Departments
                </button>
                {departments.map(dept => (
                  <button 
                    key={dept.id}
                    onClick={() => handleDeptChange(dept.name)}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b last:border-0"
                    style={{ borderColor: "var(--border)", color: selectedDept === dept.name ? "var(--primary)" : "var(--foreground)" }}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Employee Dropdown (Dependent) */}
        <div className="lg:col-span-4 space-y-1 relative" ref={empRef}>
          <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Employee</label>
          <button 
            onClick={() => setShowEmpDropdown(!showEmpDropdown)}
            className="w-full h-10 px-4 rounded-xl border bg-transparent flex items-center justify-between text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            style={{ borderColor: showEmpDropdown ? "var(--primary)" : "var(--border)", color: "var(--foreground)" }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <User size={14} className="text-emerald-600 flex-shrink-0" />
              <span className="truncate">{selectedEmployee ? selectedEmployee.name : "All Employees"}</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showEmpDropdown ? "rotate-180" : ""}`} />
          </button>

          {showEmpDropdown && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-zinc-800 border" style={{ borderColor: "var(--border)" }}>
                  <Search size={12} className="text-muted-foreground" />
                  <input 
                    autoFocus
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-[11px] font-medium w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <button 
                  onClick={() => { setSelectedEmpId("All Employees"); setShowEmpDropdown(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b"
                  style={{ borderColor: "var(--border)", color: selectedEmpId === "All Employees" ? "var(--primary)" : "var(--foreground)" }}
                >
                  All Employees
                </button>
                {displayedEmployees.map(emp => (
                  <button 
                    key={emp.id}
                    onClick={() => { setSelectedEmpId(emp.id); setShowEmpDropdown(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors border-b last:border-0 hover:bg-[var(--secondary)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full object-cover border-2" style={{ borderColor: selectedEmpId === emp.id ? "var(--primary)" : "transparent" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: selectedEmpId === emp.id ? "var(--primary)" : "var(--foreground)" }}>{emp.name}</p>
                      <p className="text-[9px] text-muted-foreground truncate uppercase">{emp.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border border-dashed text-xs font-bold transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button 
            onClick={(e) => handleDownload(e, "full")}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Working Days", value: metrics.totalDays, icon: CalendarIcon, color: "var(--primary)", bg: "var(--secondary)", trend: null },
          { label: "Present Days", value: metrics.present, icon: CheckCircle2, color: "var(--primary)", bg: "var(--secondary)", trend: "+2%", trendUp: true },
          { label: "Absent Days", value: metrics.absent, icon: XCircle, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", trend: "-1%", trendUp: false },
          { label: "Late Count", value: metrics.late, icon: Clock, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", trend: metrics.lateTrend + "%", trendUp: false },
        ].map((card, i) => (
          <div key={i} className="group p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: card.bg }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${card.trendUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-orange-50 text-orange-600 dark:bg-orange-500/10"}`}>
                  {card.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {card.trend}
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-black mt-0.5" style={{ color: "var(--foreground)" }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* ── Main View (Table or Calendar) ── */}
        <div className="xl:col-span-8 space-y-6">
          
          {view === "table" ? (
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col" style={{ borderColor: "var(--border)" }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-extrabold" style={{ color: "var(--foreground)" }}>Attendance Records</h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  Showing <span className="text-foreground">{Math.min(dailyLogs.length, itemsPerPage)}</span> of <span className="text-foreground">{dailyLogs.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-zinc-800/50">
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Employee</th>
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Date</th>
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Status</th>
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Punch In</th>
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Punch Out</th>
                      <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((log, i) => {
                      const emp = selectedEmployee || employees[i % employees.length];
                      return (
                        <tr key={i} className="group hover:bg-neutral-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-3 cursor-pointer group/emp" onClick={() => handleEmployeeRedirect(emp.id)}>
                              <div className="relative">
                                <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm transition-transform group-hover/emp:scale-110" />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900" style={{ backgroundColor: "var(--primary)" }} />
                              </div>
                              <div>
                                <p className="text-xs font-bold transition-colors group-hover/emp:text-[var(--primary)]" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">{emp.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{log.date}</p>
                          </td>
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-1.5">
                              <ArrowUpRight size={12} className="text-emerald-500" />
                              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{log.checkIn}</span>
                            </div>
                          </td>
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-1.5">
                              <ArrowUpRight size={12} className="text-orange-500 rotate-90" />
                              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{log.checkOut}</span>
                            </div>
                          </td>
                          <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="space-y-1">
                              <p className="text-xs font-black" style={{ color: "var(--foreground)" }}>{log.hours}</p>
                              <div className="w-20 h-1 rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-bold text-muted-foreground">
                  Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, dailyLogs.length)}</span> of <span className="text-foreground">{dailyLogs.length}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg border text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all active:scale-95" 
                    style={{ borderColor: "var(--border)" }} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.ceil(dailyLogs.length / itemsPerPage) }).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-[var(--primary)] text-white shadow-lg shadow-emerald-500/20" : "border border-transparent hover:border-border text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800"}`}
                      style={{ borderColor: currentPage !== i + 1 ? "var(--border)" : "transparent" }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(dailyLogs.length / itemsPerPage), prev + 1))}
                    className="p-1.5 rounded-lg border text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all active:scale-95" 
                    style={{ borderColor: "var(--border)" }}
                    disabled={currentPage === Math.ceil(dailyLogs.length / itemsPerPage)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 rounded-full bg-emerald-500" />
                  <h3 className="text-lg font-extrabold" style={{ color: "var(--foreground)" }}>Monthly Attendance Calendar</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {[
                    { label: "Present", color: "#10B981" },
                    { label: "Absent", color: "#EF4444" },
                    { label: "Leave", color: "#F59E0B" },
                    { label: "Holiday", color: "#14B8A6" },
                    { label: "Weekend", color: "#94A3B8" }
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-7 mb-6">
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="aspect-[4/3]" />;
                    
                    const isWeekend = i % 7 === 0 || i % 7 === 6;
                    const status = isWeekend ? "Weekend" : (attendanceCalendar[day] || "Present");
                    const config = STATUS_CONFIG[status];
                    const isToday = day === 22 && selectedMonth === 3;
                    const isSelected = selectedDayDetail === day;

                    // Custom styling to match image
                    let cellStyle: React.CSSProperties = {
                      borderColor: "transparent",
                      backgroundColor: "transparent",
                    };
                    let textColor = "var(--foreground)";
                    let dotColor = config.color;

                    if (isToday) {
                      cellStyle = {
                        backgroundColor: "#10B981",
                        boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)",
                      };
                      textColor = "white";
                      dotColor = "white";
                    } else if (status === "Present") {
                      cellStyle = { backgroundColor: "rgba(16, 185, 129, 0.08)" };
                      textColor = "#10B981";
                    } else if (status === "Leave") {
                      cellStyle = { backgroundColor: "rgba(245, 158, 11, 0.08)" };
                      textColor = "#F59E0B";
                    } else if (status === "Absent") {
                      cellStyle = { backgroundColor: "rgba(239, 68, 68, 0.08)" };
                      textColor = "#EF4444";
                    } else if (status === "Holiday") {
                      cellStyle = { backgroundColor: "rgba(20, 184, 166, 0.08)" };
                      textColor = "#14B8A6";
                    } else if (isWeekend) {
                      textColor = "var(--muted-foreground)";
                      cellStyle = { opacity: 0.6 };
                    }

                    if (isSelected && !isToday) {
                      cellStyle.border = `2px solid ${config.color}`;
                    }

                    return (
                      <button 
                        key={day} 
                        onClick={() => status !== "Weekend" && setSelectedDayDetail(day)}
                        className={`aspect-[4/3] relative rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group ${status !== "Weekend" ? "hover:scale-[1.02] active:scale-95" : "cursor-default"}`}
                        style={cellStyle}
                      >
                        <span className="text-base font-black" style={{ color: textColor }}>{day}</span>
                        {status !== "Weekend" && (
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                        )}
                        
                        {/* Status Label on Hover */}
                        {status !== "Weekend" && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 rounded-2xl pointer-events-none">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white dark:bg-zinc-900 shadow-sm border" style={{ color: config.color, borderColor: "var(--border)" }}>
                              {status}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Monthly Trend Chart */}
          <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="text-base font-extrabold" style={{ color: "var(--foreground)" }}>Attendance Trends</h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Monthly visibility</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <TrendingUp size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-600">+4.2%</span>
              </div>
            </div>
            
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                    domain={[80, 100]}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      borderColor: "var(--border)", 
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "white" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar: Advanced Analytics ── */}
        <div className="xl:col-span-4 space-y-5">
          
          {/* Employee Year Summary */}
          <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-extrabold mb-4" style={{ color: "var(--foreground)" }}>Year-wise Summary</h3>
            
            <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-neutral-50 dark:bg-zinc-800/50 border border-dashed" style={{ borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--primary)] p-0.5">
                <img src={selectedEmployee?.avatar || employees[0].avatar} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate" style={{ color: "var(--foreground)" }}>{selectedEmployee?.name || "Sarah Johnson"}</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{selectedYear} Cumulative Data</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: "Total Days", value: "248", color: "var(--primary)" },
                { label: "Attendance %", value: "96.4%", color: "var(--primary)" },
                { label: "Absence %", value: "3.6%", color: "#EF4444" },
                { label: "Late Mark", value: "12", color: "#F59E0B" },
              ].map((stat, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-zinc-800/30 border" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{stat.label}</p>
                  <p className="text-base font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendance Stability</h4>
              <div className="space-y-3">
                {[
                  { label: "Punctuality", value: 88, color: "bg-emerald-500" },
                  { label: "Consistency", value: 94, color: "bg-emerald-500" },
                  { label: "Balance", value: 72, color: "bg-emerald-500" },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span style={{ color: "var(--foreground)" }}>{bar.label}</span>
                      <span style={{ color: "var(--foreground)" }}>{bar.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-extrabold mb-4" style={{ color: "var(--foreground)" }}>Status Distribution</h3>
            
            <div className="h-[200px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>85%</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase">Present</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black" style={{ color: "var(--foreground)" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-extrabold mb-3" style={{ color: "var(--foreground)" }}>System Alerts</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex gap-2.5">
                <AlertCircle className="text-orange-600 flex-shrink-0" size={16} />
                <div>
                  <p className="text-[11px] font-black text-orange-900 dark:text-orange-400">Late Attendance Peak</p>
                  <p className="text-[9px] font-medium text-orange-700 dark:text-orange-500 mt-0.5">High late count in Marketing this week.</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex gap-2.5">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={16} />
                <div>
                  <p className="text-[11px] font-black text-emerald-900 dark:text-emerald-400">Attendance Goal Met</p>
                  <p className="text-[9px] font-medium text-emerald-700 dark:text-emerald-500 mt-0.5">Engineering reached 98% yesterday.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate("/reports")}
              className="w-full mt-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
              style={{ borderColor: "var(--border)" }}
            >
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
