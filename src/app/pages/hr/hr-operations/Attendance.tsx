import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { EmployeeAttendance } from "../../employee/EmployeeAttendance";
import { Plus, RotateCcw, Search, ChevronDown, Settings, AlertCircle, CheckCircle2, Shield, LayoutList, CalendarDays } from "lucide-react";

import { employees, departments } from "../../../data/mockData";
import { AttendanceRecord } from "../../../context/AttendanceContext";

// Modular Attendance Components
import { AttendanceExportMenu } from "./attendance/AttendanceExportMenu";
import { AttendanceKPICards } from "./attendance/AttendanceKPICards";
import { AttendanceCalendar } from "./attendance/AttendanceCalendar";
import { AttendanceAnalytics } from "./attendance/AttendanceAnalytics";
import { AttendanceRecordsTable } from "./attendance/AttendanceRecordsTable";
import { AttendanceAlerts } from "./attendance/AttendanceAlerts";
import { AddAttendanceModal } from "./attendance/AddAttendanceModal";
import { AttendanceSuperAdminSettings } from "./attendance/AttendanceSuperAdminSettings";
import { AttendanceService } from "./attendance/attendanceService";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function Attendance() {
  const { hasPermissionKey } = usePermissions();

  if (!hasPermissionKey(P.ATTENDANCE_VIEW) && !hasPermissionKey(P.ATTENDANCE_FULL)) {
    return <EmployeeAttendance />;
  }

  return <AdminAttendanceView />;
}

function AdminAttendanceView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermissionKey, primaryRoleName } = usePermissions();

  // Canonical RBAC permission checks
  const isSuperAdmin =
    (primaryRoleName && primaryRoleName.toLowerCase().includes("super")) ||
    hasPermissionKey(P.ATTENDANCE_FULL) ||
    hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE);

  const canManageAttendance =
    hasPermissionKey(P.ATTENDANCE_MANAGE) ||
    hasPermissionKey(P.ATTENDANCE_APPROVE) ||
    hasPermissionKey(P.ATTENDANCE_FULL);

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState(3); // April (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedEmpId, setSelectedEmpId] = useState("All Employees");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [searchQuery, setSearchQuery] = useState("");

  // View Mode: "table" or "calendar"
  const [viewMode, setViewMode] = useState<"table" | "calendar">("calendar");

  // Dropdown UI States
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);

  // Tenant-scoped Attendance Records State from AttendanceService
  const [records, setRecords] = useState<AttendanceRecord[]>(() =>
    AttendanceService.getAttendanceRecords(user?.organizationId)
  );

  useEffect(() => {
    setRecords(AttendanceService.getAttendanceRecords(user?.organizationId));
  }, [user?.organizationId]);

  const [showAddModal, setShowAddModal] = useState(false);
  const editRecordRef = useRef<AttendanceRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = deleteDialogRef.current;
    if (!el) return;
    if (deleteConfirmId) el.showModal();
    else el.close();
  }, [deleteConfirmId]);
  const [showSuperAdminConfig, setShowSuperAdminConfig] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deptRef = useRef<HTMLDivElement>(null);
  const empRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setShowDeptDropdown(false);
      }
      if (empRef.current && !empRef.current.contains(e.target as Node)) {
        setShowEmpDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetFilters = () => {
    setSelectedMonth(3);
    setSelectedYear(2026);
    setSelectedDept("All Departments");
    setSelectedEmpId("All Employees");
    setSelectedLocation("All Locations");
    setSelectedStatus("All Statuses");
    setSelectedShift("All Shifts");
    setSearchQuery("");
  };

  // Filtered employees list based on selected department
  const filteredEmployeesList = useMemo(() => {
    if (selectedDept === "All Departments") return employees;
    return employees.filter((emp) => emp.department === selectedDept);
  }, [selectedDept]);

  const displayedEmployees = useMemo(() => {
    if (!searchQuery) return filteredEmployeesList;
    return filteredEmployeesList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredEmployeesList, searchQuery]);

  const selectedEmployeeObj = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId);
  }, [selectedEmpId]);

  // Filtered attendance records according to active filters
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (selectedDept !== "All Departments" && rec.department !== selectedDept) {
        return false;
      }
      if (selectedEmpId !== "All Employees" && rec.employeeId !== selectedEmpId) {
        return false;
      }
      if (selectedStatus !== "All Statuses" && rec.status !== selectedStatus) {
        return false;
      }
      if (selectedLocation !== "All Locations" && rec.location && rec.location !== selectedLocation) {
        return false;
      }
      if (selectedShift !== "All Shifts" && rec.shift && !rec.shift.toLowerCase().includes(selectedShift.toLowerCase())) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.employeeName.toLowerCase().includes(q);
        const matchesId = rec.employeeId.toLowerCase().includes(q);
        const matchesNotes = (rec.notes || "").toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesNotes) return false;
      }
      return true;
    });
  }, [records, selectedDept, selectedEmpId, selectedStatus, selectedLocation, selectedShift, searchQuery]);

  // Handlers with RBAC Permission Enforcements
  const handleAddRecord = (newRec: AttendanceRecord) => {
    if (!canManageAttendance) {
      triggerToast("Unauthorized: Requires attendance management permission.");
      return;
    }
    const created = AttendanceService.createAttendanceRecord(newRec, user?.organizationId);
    setRecords(AttendanceService.getAttendanceRecords(user?.organizationId));
    triggerToast("Attendance record saved successfully!");
  };

  const handleEditSave = (edited: AttendanceRecord) => {
    if (!canManageAttendance) {
      triggerToast("Unauthorized: Requires attendance management permission.");
      return;
    }
    AttendanceService.updateAttendanceRecord(edited, user?.organizationId);
    setRecords(AttendanceService.getAttendanceRecords(user?.organizationId));
    editRecordRef.current = null;
    triggerToast("Attendance record updated!");
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    if (!canManageAttendance) {
      triggerToast("Unauthorized: Requires attendance management permission.");
      setDeleteConfirmId(null);
      return;
    }
    AttendanceService.deleteAttendanceRecord(deleteConfirmId, user?.organizationId);
    setRecords(AttendanceService.getAttendanceRecords(user?.organizationId));
    setDeleteConfirmId(null);
    triggerToast("Attendance record deleted!");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-12 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[3000] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#00B87C] flex items-center justify-center text-white font-bold text-xs">
            ✓
          </div>
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* ── 1. Page Header (Requirement #3) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Attendance Management
          </h1>
          <p className="text-[13px] font-medium text-muted-foreground mt-0.5">
            Track and analyze employee presence across the organization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Add Attendance Button (Requirement #24) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 h-10 bg-[#00B87C] text-white rounded-xl hover:bg-[#00a36d] shadow-sm transition-all text-xs font-extrabold active:scale-95"
          >
            <Plus size={16} />
            <span>Add Attendance</span>
          </button>

          {/* View Toggle: Table | Calendar */}
          <div className="flex items-center p-1 h-10 rounded-xl border bg-card shadow-sm" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === "table"
                  ? "bg-[#00B87C]/15 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList size={15} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === "calendar"
                  ? "bg-[#00B87C]/15 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays size={15} />
              <span>Calendar</span>
            </button>
          </div>

          {/* Export Menu Dropdown (Requirement #23) */}
          <AttendanceExportMenu
            records={filteredRecords}
            monthName={MONTH_NAMES[selectedMonth]}
            year={selectedYear}
            selectedDept={selectedDept}
            selectedEmpName={selectedEmployeeObj?.name || "All Employees"}
            selectedLocation={selectedLocation}
            selectedStatus={selectedStatus}
            selectedShift={selectedShift}
          />

          {/* Super Admin Settings Button (Requirement #19 & #20) */}
          {isSuperAdmin && (
            <button
              onClick={() => setShowSuperAdminConfig(true)}
              className="flex items-center gap-2 px-3.5 h-10 rounded-xl border bg-card text-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-all text-xs font-bold"
              style={{ borderColor: "var(--border)" }}
              title="Super Admin Attendance Configuration"
            >
              <Settings size={16} className="text-[#00B87C]" />
              <span className="hidden sm:inline">Settings & Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Filter Bar (Requirement #4) ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end p-4 rounded-2xl border bg-card shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Filter 1: Month */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 2: Year */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Department */}
        <div className="space-y-1 relative" ref={deptRef}>
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Department
          </label>
          <button
            type="button"
            onClick={() => setShowDeptDropdown(!showDeptDropdown)}
            className="w-full h-10 px-3 rounded-xl border bg-card flex items-center justify-between text-xs font-bold text-foreground outline-none transition-all truncate"
            style={{ borderColor: showDeptDropdown ? "#00B87C" : "var(--border)" }}
          >
            <span className="truncate">{selectedDept}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${showDeptDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDeptDropdown && (
            <div
              className="absolute top-[calc(100%+6px)] left-0 w-full z-[2200] rounded-2xl border bg-card shadow-xl overflow-hidden py-1"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => {
                  setSelectedDept("All Departments");
                  setSelectedEmpId("All Employees");
                  setShowDeptDropdown(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800 text-foreground"
              >
                All Departments
              </button>
              {departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDept(d.name);
                    setSelectedEmpId("All Employees");
                    setShowDeptDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800 text-foreground"
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter 4: Employee */}
        <div className="space-y-1 relative" ref={empRef}>
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Employee
          </label>
          <button
            type="button"
            onClick={() => setShowEmpDropdown(!showEmpDropdown)}
            className="w-full h-10 px-3 rounded-xl border bg-card flex items-center justify-between text-xs font-bold text-foreground outline-none transition-all truncate"
            style={{ borderColor: showEmpDropdown ? "#00B87C" : "var(--border)" }}
          >
            <span className="truncate">{selectedEmployeeObj ? selectedEmployeeObj.name : "All Employees"}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${showEmpDropdown ? "rotate-180" : ""}`} />
          </button>
          {showEmpDropdown && (
            <div
              className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[220px] z-[2200] rounded-2xl border bg-card shadow-xl overflow-hidden p-1.5"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="p-1 mb-1 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-zinc-800">
                  <Search size={13} className="text-muted-foreground" />
                  <input
                    autoFocus
                    placeholder="Search employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs font-medium outline-none w-full text-foreground"
                  />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                <button
                  onClick={() => {
                    setSelectedEmpId("All Employees");
                    setShowEmpDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg text-foreground"
                >
                  All Employees
                </button>
                {displayedEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmpId(emp.id);
                      setShowEmpDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full object-cover border" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{emp.name}</p>
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase">{emp.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter 5: Location */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="All Locations">All Locations</option>
            <option value="HQ Office">HQ Office</option>
            <option value="Branch Office">Branch Office</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Filter 6: Attendance Status */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
            <option value="Holiday">Holiday</option>
            <option value="Half-day">Half-day</option>
            <option value="WFH">WFH</option>
          </select>
        </div>

        {/* Filter 7: Shift */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            Shift
          </label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="All Shifts">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="Night">Night Shift</option>
          </select>
        </div>

        {/* Filter Actions: Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl border bg-card text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all"
            style={{ borderColor: "var(--border)" }}
            title="Reset Filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ── 3. KPI Cards (Requirement #5: Replace Old AVG KPI cards) ── */}
      <AttendanceKPICards
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        festivalHolidaysCount={2}
      />

      {/* ── 4. Main View Section: Attendance Calendar OR Records Table ── */}
      {viewMode === "calendar" ? (
        <AttendanceCalendar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedDept={selectedDept}
          selectedEmpId={selectedEmpId}
          selectedLocation={selectedLocation}
          selectedStatus={selectedStatus}
          selectedShift={selectedShift}
          records={filteredRecords}
          onMonthChange={(m) => setSelectedMonth(m)}
          onYearChange={(y) => setSelectedYear(y)}
          onNavigateToEmployee={(id) => navigate(`/employees/${id}`)}
        />
      ) : (
        <AttendanceRecordsTable
          records={filteredRecords}
          canManageAttendance={canManageAttendance}
          onOpenEdit={(rec) => { editRecordRef.current = rec; }}
          onOpenDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* ── 5. Attendance Analytics ── */}
      <AttendanceAnalytics
        selectedDept={selectedDept}
        selectedLocation={selectedLocation}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* ── 6. System Alerts & Insights (Requirement #31) ── */}
      <AttendanceAlerts
        onOpenHardwareConfig={() => setShowSuperAdminConfig(true)}
      />

      {/* Add Attendance Modal */}
      <AddAttendanceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddRecord}
        defaultEmployeeId={selectedEmpId !== "All Employees" ? selectedEmpId : ""}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      {/* Super Admin Settings Modal */}
      {showSuperAdminConfig && (
        <AttendanceSuperAdminSettings
          onClose={() => setShowSuperAdminConfig(false)}
        />
      )}

      {/* Delete Record Confirmation Modal */}
      <dialog
        ref={deleteDialogRef}
        id="delete-attendance-confirm"
        onClose={() => setDeleteConfirmId(null)}
        className="w-full max-w-sm rounded-2xl bg-card border shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        style={{ borderColor: "var(--border)" }}
      >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 id="delete-confirm-title" className="text-base font-extrabold text-foreground mb-1">
              Delete Attendance Record
            </h3>
            <p className="text-xs font-medium text-muted-foreground mb-5">
              Are you sure you want to delete this log entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border text-xs font-extrabold text-foreground bg-card hover:bg-neutral-100 dark:hover:bg-zinc-800"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Delete
              </button>
            </div>
      </dialog>
    </div>
  );
}
