import React from "react";
import { Search, RotateCcw, Download, Filter } from "lucide-react";
import { LeaveFilterState } from "./types";

interface LeaveFiltersProps {
  filters: LeaveFilterState;
  onFilterChange: (updated: Partial<LeaveFilterState>) => void;
  onReset: () => void;
  onOpenExport: () => void;
  departments: string[];
  teams: string[];
  employees: string[];
  leaveTypes: string[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function LeaveFilters({
  filters,
  onFilterChange,
  onReset,
  onOpenExport,
  departments,
  teams,
  employees,
  leaveTypes,
}: LeaveFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
      {/* TOP BAR: FILTER ICON + SEARCH INPUT + ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#00B87C] shrink-0">
            <Filter size={16} />
          </div>
          <div className="relative w-64 sm:w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full h-9 pl-9 pr-3 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground shadow-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={onOpenExport}
            className="px-4 py-1.5 rounded-xl bg-[#00B87C] hover:bg-[#009966] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* 7-AXIS FILTER DROPDOWNS GRID (EVEN 7-COLUMN LAYOUT WITHOUT EMPTY SPACE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Month */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Month
          </label>
          <select
            value={filters.month}
            onChange={(e) => onFilterChange({ month: parseInt(e.target.value, 10) })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value={-1}>All Months</option>
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Year */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: parseInt(e.target.value, 10) })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>

        {/* 3. Department */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value="All">All Depts</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Team */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Team
          </label>
          <select
            value={filters.team}
            onChange={(e) => onFilterChange({ team: e.target.value })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value="All">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Employee */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Employee
          </label>
          <select
            value={filters.employee}
            onChange={(e) => onFilterChange({ employee: e.target.value })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value="All">All Employees</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Leave Type */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Leave Type
          </label>
          <select
            value={filters.leaveType}
            onChange={(e) => onFilterChange({ leaveType: e.target.value })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value="All">All Types</option>
            {leaveTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Status */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full h-9 px-2.5 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
}
