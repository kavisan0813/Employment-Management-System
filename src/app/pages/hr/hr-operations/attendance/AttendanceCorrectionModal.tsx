import React, { useState, useRef, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, FileCheck, Upload, AlertCircle } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { employees } from "../../../../data/mockData";
import { AttendanceService } from "./attendanceService";
import { useAuth } from "../../../../context/AuthContext";

interface AttendanceCorrectionModalProps {
  record: AttendanceRecord | null;
  onClose: () => void;
  onSaveCorrection?: (updatedRecord: AttendanceRecord, correctionDetails: {
    correctedCheckIn: string;
    correctedCheckOut: string;
    reason: string;
    documentName?: string;
  }) => void;
}

export function AttendanceCorrectionModal({
  record,
  onClose,
  onSaveCorrection,
}: AttendanceCorrectionModalProps) {
  const { user } = useAuth();
  const [correctedCheckIn, setCorrectedCheckIn] = useState("09:00");
  const [correctedCheckOut, setCorrectedCheckOut] = useState("18:00");
  const [reason, setReason] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.showModal();
    return () => el.close();
  }, []);
  const [statusState, setStatusState] = useState<"draft" | "submitted">("draft");

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!reason.trim()) {
      errs.reason = "Please enter a valid reason for attendance correction.";
    }

    if (correctedCheckOut <= correctedCheckIn) {
      errs.correctedCheckOut = "Corrected Punch Out cannot be earlier than or equal to Punch In.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Persist via AttendanceService with PENDING status in tenant context
    AttendanceService.requestAttendanceCorrection(
      {
        recordId: record.id,
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        employeeAvatar: record.employeeAvatar,
        department: record.department,
        date: record.date,
        currentCheckIn: record.checkIn,
        currentCheckOut: record.checkOut,
        correctedCheckIn,
        correctedCheckOut,
        reason,
        documentName: documentName || "Attendance_Supporting_Doc.pdf",
      },
      user?.organizationId
    );

    if (onSaveCorrection) {
      onSaveCorrection(record, {
        correctedCheckIn,
        correctedCheckOut,
        reason,
        documentName: documentName || "Attendance_Supporting_Doc.pdf",
      });
    }

    setStatusState("submitted");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <dialog
      ref={dialogRef}
      id="correction-dialog"
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
            <FileCheck className="text-[#00B87C]" size={20} />
            <div>
              <h3 id="correction-modal-title" className="text-base font-extrabold text-foreground">
                Request Attendance Correction
              </h3>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Submit regularization request for HR/Manager approval
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

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Employee & Record Info */}
          <div
            className="p-4 rounded-xl border bg-neutral-50 dark:bg-zinc-800/30 flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <p className="text-xs font-black text-foreground">{record.employeeName}</p>
              <p className="text-[10px] font-bold text-muted-foreground">
                {record.employeeId} • {record.department} • <span className="text-[#00B87C]">{record.date}</span>
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Current: {record.status}
            </span>
          </div>

          {/* Current vs Corrected Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Current Punch In / Out
              </label>
              <div className="p-3 rounded-xl border bg-card text-xs font-bold text-muted-foreground" style={{ borderColor: "var(--border)" }}>
                {record.checkIn || "--:--"} → {record.checkOut || "--:--"} ({record.hours})
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Correction Workflow Status
              </label>
              <div className="p-3 rounded-xl border bg-card text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/5" style={{ borderColor: "var(--border)" }}>
                Pending Manager Approval
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Corrected Punch In Time *
              </label>
              <input
                type="time"
                value={correctedCheckIn}
                onChange={(e) => setCorrectedCheckIn(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
                Corrected Punch Out Time *
              </label>
              <input
                type="time"
                value={correctedCheckOut}
                onChange={(e) => setCorrectedCheckOut(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              />
              {errors.correctedCheckOut && (
                <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.correctedCheckOut}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
              Reason for Correction *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Biometric scanner error at main entrance, verified by security supervisor."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
              style={{ borderColor: "var(--border)" }}
            />
            {errors.reason && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Supporting Document */}
          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wide mb-1.5">
              Supporting Document (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Attach file or enter reference URL / document ID"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs font-medium rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                style={{ borderColor: "var(--border)" }}
              />
              <button
                type="button"
                onClick={() => setDocumentName("Gate_Pass_Approval_Doc.pdf")}
                className="px-3.5 py-2.5 rounded-xl border text-xs font-bold text-foreground bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 flex items-center gap-1.5"
                style={{ borderColor: "var(--border)" }}
              >
                <Upload size={14} />
                <span>Sample</span>
              </button>
            </div>
          </div>

          {statusState === "submitted" && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <FileCheck size={16} />
              <span>Correction request submitted successfully! Pending approval.</span>
            </div>
          )}

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
              Submit Correction
            </button>
          </div>
        </form>
    </dialog>
  );
}
