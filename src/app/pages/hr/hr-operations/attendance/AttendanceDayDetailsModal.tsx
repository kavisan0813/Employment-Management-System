import React, { useRef, useEffect } from "react";
import { X, Clock, MapPin, CheckCircle2, AlertCircle, Calendar as CalendarIcon, ArrowUpRight, UserCheck, Briefcase, FileText, ArrowRight } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { employees } from "../../../../data/mockData";

export interface LeaveDetail {
  id: string;
  employeeName: string;
  employeeId: string;
  employeeAvatar: string;
  department: string;
  leaveType: "Sick Leave" | "Casual Leave" | "Earned Leave" | "Comp Off" | "Loss of Pay" | "Work From Home" | "Permission" | "Half Day" | "Holiday";
  duration: "Full Day" | "Half Day" | "2 Hours";
  status: "Approved" | "Pending" | "Rejected";
  reason: string;
  approvalStatus: string;
}

interface AttendanceDayDetailsModalProps {
  day: number;
  month: number; // 0-indexed
  year: number;
  selectedEmpId: string;
  records: AttendanceRecord[];
  onClose: () => void;
  onNavigateToEmployee?: (id: string) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function AttendanceDayDetailsModal({
  day,
  month,
  year,
  selectedEmpId,
  records,
  onClose,
  onNavigateToEmployee,
}: AttendanceDayDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.showModal();
    return () => el.close();
  }, []);
  const monthName = MONTH_NAMES[month] || "";
  const dateStr = `${monthName.substring(0, 3)} ${day < 10 ? `0${day}` : day}, ${year}`;
  const fullDateTitle = `${monthName} ${day}, ${year}`;

  // Find attendance record for selected employee or filter
  const dayRecords = records.filter((r) => {
    const isDate = r.date === dateStr;
    if (selectedEmpId !== "All Employees") {
      return isDate && r.employeeId === selectedEmpId;
    }
    return isDate;
  });

  const primaryRecord = dayRecords[0] || {
    id: `ATT-MOCK-${day}`,
    employeeId: selectedEmpId !== "All Employees" ? selectedEmpId : employees[0].id,
    employeeName: selectedEmpId !== "All Employees" ? (employees.find(e => e.id === selectedEmpId)?.name || employees[0].name) : employees[0].name,
    employeeAvatar: selectedEmpId !== "All Employees" ? employees.find(e => e.id === selectedEmpId)?.avatar : employees[0].avatar,
    department: selectedEmpId !== "All Employees" ? employees.find(e => e.id === selectedEmpId)?.department : employees[0].department,
    date: dateStr,
    status: day % 7 === 0 ? "Holiday" : day % 6 === 0 ? "Leave" : "Present",
    checkIn: "08:58 AM",
    checkOut: "06:02 PM",
    hours: "9h 04m",
    notes: "Regular shift attendance log",
  };

  // Applicable Leave Records for this date (Workforce Leave Picture)
  const applicableLeaves: LeaveDetail[] = [
    {
      id: `LV-${day}-1`,
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      employeeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      department: "Engineering",
      leaveType: "Sick Leave",
      duration: "Full Day",
      status: "Approved",
      reason: "High fever and medical consultation",
      approvalStatus: "Approved by Alex Rivera",
    },
    {
      id: `LV-${day}-2`,
      employeeName: "Marcus Williams",
      employeeId: "EMP002",
      employeeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      department: "Marketing",
      leaveType: "Casual Leave",
      duration: "Half Day",
      status: "Approved",
      reason: "Personal banking work",
      approvalStatus: "Approved by HR Admin",
    },
    {
      id: `LV-${day}-3`,
      employeeName: "Elena Rostova",
      employeeId: "EMP003",
      employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      department: "Finance",
      leaveType: "Work From Home",
      duration: "Full Day",
      status: "Approved",
      reason: "Home maintenance visit",
      approvalStatus: "Approved by Finance Head",
    },
    {
      id: `LV-${day}-4`,
      employeeName: "David Chen",
      employeeId: "EMP004",
      employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      department: "Engineering",
      leaveType: "Earned Leave",
      duration: "Full Day",
      status: "Pending",
      reason: "Family event travel",
      approvalStatus: "Pending Manager Review",
    },
  ];

  return (
    <dialog
      ref={dialogRef}
      id="day-details-dialog"
      onClose={onClose}
      className="w-full max-w-2xl rounded-2xl bg-card border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      style={{ borderColor: "var(--border)" }}
    >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/40"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 flex flex-col items-center justify-center font-black">
              <span className="text-[10px] uppercase font-extrabold">{monthName.substring(0, 3)}</span>
              <span className="text-base leading-none">{day}</span>
            </div>
            <div>
              <h3
                id="day-details-modal-title"
                className="text-lg font-extrabold text-foreground"
              >
                Attendance Details — {fullDateTitle}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                Workforce status & leave picture for {fullDateTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Employee Attendance Overview Card */}
          <div
            className="p-5 rounded-2xl border bg-neutral-50 dark:bg-zinc-800/30 space-y-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <img
                  src={primaryRecord.employeeAvatar || employees[0].avatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#00B87C]"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-foreground">
                    {primaryRecord.employeeName}
                  </h4>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    {primaryRecord.employeeId} • {primaryRecord.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {primaryRecord.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 dark:bg-zinc-700 text-muted-foreground">
                  Morning Shift
                </span>
              </div>
            </div>

            {/* Attendance Punch Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Punch In</p>
                <p className="text-base font-extrabold text-foreground">{primaryRecord.checkIn || "08:58 AM"}</p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">On time</p>
              </div>

              <div className="p-3 rounded-xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Punch Out</p>
                <p className="text-base font-extrabold text-foreground">{primaryRecord.checkOut || "06:02 PM"}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Completed</p>
              </div>

              <div className="p-3 rounded-xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Working Hours</p>
                <p className="text-base font-extrabold text-[#00B87C]">{primaryRecord.hours || "9h 04m"}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Standard 8h+</p>
              </div>

              <div className="p-3 rounded-xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Location</p>
                <p className="text-base font-extrabold text-foreground">HQ Office</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Biometric Gate 1</p>
              </div>
            </div>
          </div>

          {/* Applicable Workforce Leaves on Selected Day Section (Requirement #10) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText size={14} className="text-[#00B87C]" />
                Workforce Leaves & Absences on {fullDateTitle}
              </h4>
              <span className="text-[11px] font-extrabold text-[#00B87C] bg-[#00B87C]/10 px-2.5 py-0.5 rounded-full">
                {applicableLeaves.length} Active Records
              </span>
            </div>

            <div className="space-y-2.5">
              {applicableLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3.5 rounded-2xl border bg-card shadow-sm hover:border-[#00B87C] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={leave.employeeAvatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{leave.employeeName}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">({leave.department})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        <span className="font-bold text-foreground">{leave.leaveType}</span> • {leave.duration} — <span className="italic">"{leave.reason}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        leave.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : leave.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {leave.status}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground hidden md:inline">
                      {leave.approvalStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 bg-neutral-50 dark:bg-zinc-800/40 border-t flex gap-3 flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-card hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all"
            style={{ borderColor: "var(--border)" }}
          >
            Close
          </button>
          {onNavigateToEmployee && (
            <button
              onClick={() => {
                onClose();
                onNavigateToEmployee(primaryRecord.employeeId);
              }}
              className="flex-1 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "#00B87C" }}
            >
              <span>View Employee Profile</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
    </dialog>
  );
}
