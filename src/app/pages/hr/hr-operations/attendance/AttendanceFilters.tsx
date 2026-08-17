import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, RotateCcw, Download, Loader2 } from "lucide-react";
import { MONTH_NAMES, LOCATIONS, SHIFTS, employees, departments } from "./attendance.service";
import type { AttendanceFilter } from "./attendance.types";

interface AttendanceFiltersProps {
  filter: AttendanceFilter;
  onFilterChange: (filter: AttendanceFilter) => void;
  onReset: () => void;
  onExport: (type: "csv" | "excel" | "pdf") => void;
  isExporting: boolean;
}

export function AttendanceFilters({
  filter,
  onFilterChange,
  onReset,
  onExport,
  isExporting,
}: AttendanceFiltersProps) {
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [empSearch, setEmpSearch] = useState("");
  const deptRef = useRef<HTMLDivElement>(null);
  const empRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) setShowDeptDropdown(false);
      if (empRef.current && !empRef.current.contains(e.target as Node)) setShowEmpDropdown(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExportMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (filter.department !== "All Departments") {
      list = list.filter((e) => e.department === filter.department);
    }
    if (empSearch) {
      list = list.filter((e) =>
        e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
        e.role.toLowerCase().includes(empSearch.toLowerCase())
      );
    }
    return list;
  }, [filter.department, empSearch]);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === filter.employeeId);
  }, [filter.employeeId]);

  const update = (key: keyof AttendanceFilter, value: string | number) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const selectStyle = "w-full h-10 px-3 rounded-xl border bg-transparent text-xs font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none";
  const labelStyle = "text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1";

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 items-end p-4 rounded-2xl border bg-card shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Month & Year */}
      <div className="space-y-1 col-span-2">
        <label className={labelStyle}>Period</label>
        <div className="flex items-center gap-2">
          <select
            value={filter.month}
            onChange={(e) => update("month", parseInt(e.target.value))}
            className={`flex-1 ${selectStyle}`}
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i}>{name}</option>
            ))}
          </select>
          <select
            value={filter.year}
            onChange={(e) => update("year", parseInt(e.target.value))}
            className={`w-20 ${selectStyle}`}
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Department */}
      <div className="space-y-1 relative" ref={deptRef}>
        <label className={labelStyle}>Department</label>
        <button
          onClick={() => setShowDeptDropdown(!showDeptDropdown)}
          className="w-full h-10 px-3 rounded-xl border bg-transparent flex items-center justify-between text-xs font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all truncate"
          style={{ borderColor: showDeptDropdown ? "var(--primary)" : "var(--border)", color: "var(--foreground)" }}
        >
          <span className="truncate">{filter.department}</span>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${showDeptDropdown ? "rotate-180" : ""}`} />
        </button>
        {showDeptDropdown && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[2000] rounded-2xl border bg-card shadow-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="max-h-60 overflow-y-auto">
              <button onClick={() => { update("department", "All Departments"); update("employeeId", "All Employees"); setShowDeptDropdown(false); }} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b" style={{ borderColor: "var(--border)", color: filter.department === "All Departments" ? "var(--primary)" : "var(--foreground)" }}>All Departments</button>
              {departments.map((dept) => (
                <button key={dept.id} onClick={() => { update("department", dept.name); update("employeeId", "All Employees"); setShowDeptDropdown(false); }} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b last:border-0" style={{ borderColor: "var(--border)", color: filter.department === dept.name ? "var(--primary)" : "var(--foreground)" }}>{dept.name}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Employee */}
      <div className="space-y-1 relative" ref={empRef}>
        <label className={labelStyle}>Employee</label>
        <button
          onClick={() => setShowEmpDropdown(!showEmpDropdown)}
          className="w-full h-10 px-3 rounded-xl border bg-transparent flex items-center justify-between text-xs font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all truncate"
          style={{ borderColor: showEmpDropdown ? "var(--primary)" : "var(--border)", color: "var(--foreground)" }}
        >
          <span className="truncate">{selectedEmployee ? selectedEmployee.name : "All Employees"}</span>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${showEmpDropdown ? "rotate-180" : ""}`} />
        </button>
        {showEmpDropdown && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] z-[2000] rounded-2xl border bg-card shadow-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-zinc-800 border" style={{ borderColor: "var(--border)" }}>
                <Search size={12} className="text-muted-foreground" />
                <input autoFocus placeholder="Search..." className="bg-transparent border-none outline-none text-[11px] font-medium w-full" style={{ color: "var(--foreground)" }} value={empSearch} onChange={(e) => setEmpSearch(e.target.value)} />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <button onClick={() => { update("employeeId", "All Employees"); setShowEmpDropdown(false); setEmpSearch(""); }} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--secondary)] transition-colors border-b" style={{ borderColor: "var(--border)", color: filter.employeeId === "All Employees" ? "var(--primary)" : "var(--foreground)" }}>All Employees</button>
              {filteredEmployees.map((emp) => (
                <button key={emp.id} onClick={() => { update("employeeId", emp.id); setShowEmpDropdown(false); setEmpSearch(""); }} className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors border-b last:border-0 hover:bg-[var(--secondary)]" style={{ borderColor: "var(--border)" }}>
                  <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full object-cover border-2" style={{ borderColor: filter.employeeId === emp.id ? "var(--primary)" : "transparent" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: filter.employeeId === emp.id ? "var(--primary)" : "var(--foreground)" }}>{emp.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase">{emp.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1">
        <label className={labelStyle}>Location</label>
        <select value={filter.location} onChange={(e) => update("location", e.target.value)} className={selectStyle} style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
          <option value="All Locations">All Locations</option>
          {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className={labelStyle}>Status</label>
        <select value={filter.status} onChange={(e) => update("status", e.target.value)} className={selectStyle} style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
          <option value="All Statuses">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Leave">Leave</option>
          <option value="Holiday">Holiday</option>
        </select>
      </div>

      {/* Shift */}
      <div className="space-y-1">
        <label className={labelStyle}>Shift</label>
        <select value={filter.shift} onChange={(e) => update("shift", e.target.value)} className={selectStyle} style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
          <option value="All Shifts">All Shifts</option>
          {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          title="Reset filters"
        >
          <RotateCcw size={14} />
        </button>
        <div className="relative flex-1" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--primary)" }}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <><Download size={14} /><span className="text-xs font-bold">Export</span></>}
          </button>
          {showExportMenu && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-40 z-[2000] rounded-xl border bg-card shadow-xl py-1" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => { onExport("csv"); setShowExportMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[var(--secondary)] transition-colors" style={{ color: "var(--foreground)" }}>Export CSV</button>
              <button onClick={() => { onExport("excel"); setShowExportMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[var(--secondary)] transition-colors" style={{ color: "var(--foreground)" }}>Export Excel</button>
              <button onClick={() => { onExport("pdf"); setShowExportMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[var(--secondary)] transition-colors" style={{ color: "var(--foreground)" }}>Export PDF</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
