import React, { useState, useRef, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, AlertCircle, Plus } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { employees } from "../../../../data/mockData";

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
  defaultEmployeeId?: string;
  defaultMonth?: number;
  defaultYear?: number;
}

export function AddAttendanceModal({
  isOpen,
  onClose,
  onSave,
  defaultEmployeeId = "",
  defaultMonth = 3,
  defaultYear = 2026,
}: AddAttendanceModalProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || employees[0]?.id || "");
  const [date, setDate] = useState(`${defaultYear}-${(defaultMonth + 1).toString().padStart(2, "0")}-01`);
  const [status, setStatus] = useState("Present");
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("18:00");
  const [location, setLocation] = useState("HQ Office");
  const [shift, setShift] = useState("Morning Shift");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) el.showModal();
    else el.close();
  }, [isOpen]);

  const formatDisplayDate = (inputDateStr: string): string => {
    const parts = inputDateStr.split("-");
    if (parts.length < 3) return "";
    const yr = parts[0];
    const moIdx = parseInt(parts[1]) - 1;
    const dy = parts[2];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[moIdx]} ${dy}, ${yr}`;
  };

  const to12HourFormat = (time24: string): string => {
    if (!time24) return "--:--";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const displayH = h < 10 ? `0${h}` : `${h}`;
    return `${displayH}:${mStr} ${ampm}`;
  };

  const calculateWorkingHours = (inTime: string, outTime: string, statusVal: string): string => {
    if (["Absent", "Leave", "Holiday", "Weekend"].includes(statusVal)) return "0h 00m";
    if (!inTime || !outTime) return "8h 00m";
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);
    let diffMins = outH * 60 + outM - (inH * 60 + inM);
    if (diffMins < 0) diffMins += 24 * 60;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins < 10 ? `0${mins}` : mins}m`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!employeeId) errs.employeeId = "Please select an employee.";
    if (!date) errs.date = "Please select a date.";
    if (!status) errs.status = "Please select a status.";

    const needsTimes = ["Present", "Late", "Half-day", "WFH"].includes(status);
    if (needsTimes) {
      if (!checkIn) errs.checkIn = "Punch-in time is required.";
      if (!checkOut) errs.checkOut = "Punch-out time is required.";
      if (checkIn && checkOut && checkOut <= checkIn) {
        errs.checkOut = "Punch-out time cannot be earlier than or equal to Punch-in time.";
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const empObj = employees.find((e) => e.id === employeeId) || employees[0];
    const displayDate = formatDisplayDate(date);
    const displayCheckIn = needsTimes ? to12HourFormat(checkIn) : "--:--";
    const displayCheckOut = needsTimes ? to12HourFormat(checkOut) : "--:--";
    const displayHours = needsTimes ? calculateWorkingHours(checkIn, checkOut, status) : "0h 00m";

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      employeeId: empObj.id,
      employeeName: empObj.name,
      employeeAvatar: empObj.avatar,
      department: empObj.department,
      date: displayDate,
      status,
      checkIn: displayCheckIn,
      checkOut: displayCheckOut,
      hours: displayHours,
      notes: notes || "Manually added attendance entry",
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id="add-attendance-dialog"
      onClose={onClose}
      className="w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      style={{ borderColor: "var(--border)" }}
    >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/40"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center font-bold">
              <Plus size={20} />
            </div>
            <div>
              <h3 id="add-attendance-title" className="text-base font-extrabold text-foreground">
                Add Attendance Record
              </h3>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Record new employee presence, hours & shift details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
              Select Employee *
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
              style={{ borderColor: "var(--border)" }}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id}) — {emp.department}
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.employeeId}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              />
              {errors.date && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Half-day">Half-day</option>
                <option value="WFH">Work From Home (WFH)</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
              </select>
              {errors.status && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.status}</p>}
            </div>
          </div>

          {["Present", "Late", "Half-day", "WFH"].includes(status) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                  Punch In Time *
                </label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                  style={{ borderColor: "var(--border)" }}
                />
                {errors.checkIn && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.checkIn}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                  Punch Out Time *
                </label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                  style={{ borderColor: "var(--border)" }}
                />
                {errors.checkOut && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.checkOut}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="HQ Office">HQ Office</option>
                <option value="Branch Office">Branch Office</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="Morning Shift">Morning Shift (09:00 - 18:00)</option>
                <option value="Evening Shift">Evening Shift (14:00 - 23:00)</option>
                <option value="Night Shift">Night Shift (22:00 - 07:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
              Remarks / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Manual entry added by HR administrator."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t flex gap-3" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-card hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: "#00B87C" }}
            >
              Save Attendance Record
            </button>
          </div>
        </form>
    </dialog>
  );
}
