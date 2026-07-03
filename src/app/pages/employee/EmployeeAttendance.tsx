import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Calendar,
  FileText,
  Paperclip,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { StatusBadge } from "../../components/workflow/StatusBadge";
import { useAttendance } from "../../context/AttendanceContext";
import { useAuth } from "../../context/AuthContext";

interface RegularizationRequest {
  id: string;
  date: string;
  type: string;
  checkIn: string;
  checkOut: string;
  reason: string;
  manager: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
  approvalDate?: string;
  rejectionReason?: string;
}

const ATTENDANCE_LOGS = [
  { date: "01 Apr 2026", in: "08:52 AM", out: "06:05 PM", status: "Present" },
  { date: "02 Apr 2026", in: "08:58 AM", out: "06:02 PM", status: "Present" },
  { date: "03 Apr 2026", in: "09:15 AM", out: "06:10 PM", status: "Late" },
  { date: "04 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "05 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "06 Apr 2026", in: "08:45 AM", out: "06:00 PM", status: "Present" },
  { date: "07 Apr 2026", in: "-", out: "-", status: "Leave" },
  { date: "08 Apr 2026", in: "09:02 AM", out: "06:15 PM", status: "Present" },
];

function RegularizationModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDate = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: RegularizationRequest) => void;
  defaultDate?: string;
}) {
  const [formData, setFormData] = useState({
    date: defaultDate,
    type: "",
    checkIn: "",
    checkOut: "",
    reason: "",
    manager: "Arjun Reddy",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        date: defaultDate || prev.date,
      }));
    }
  }, [isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.type || !formData.reason) {
      showToast(
        "Required Fields",
        "error",
        "Please fill in all required fields.",
      );
      return;
    }

    if (
      (formData.type === "Missed Check-in" ||
        formData.type === "Full Day Correction") &&
      !formData.checkIn
    ) {
      showToast(
        "Missing Time",
        "error",
        "Check-in time is required for this request type.",
      );
      return;
    }

    if (
      (formData.type === "Missed Check-out" ||
        formData.type === "Full Day Correction") &&
      !formData.checkOut
    ) {
      showToast(
        "Missing Time",
        "error",
        "Check-out time is required for this request type.",
      );
      return;
    }

    const newReq: RegularizationRequest = {
      id: `REG-${Math.floor(Math.random() * 1000)}`,
      date: formData.date,
      type: formData.type,
      checkIn: formData.checkIn || "09:00 AM",
      checkOut: formData.checkOut || "06:00 PM",
      reason: formData.reason,
      manager: formData.manager,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    onSubmit(newReq);
    showToast(
      "Request Submitted",
      "success",
      "Regularization request submitted successfully.",
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[550px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                Apply Attendance Regularization
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                Correct your attendance logs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white dark:bg-card"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Date Selector *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Regularization Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
              >
                <option value="">Select Type</option>
                <option value="Missed Check-in">Missed Check-in</option>
                <option value="Missed Check-out">Missed Check-out</option>
                <option value="Full Day Correction">Full Day Correction</option>
                <option value="Half Day Correction">Half Day Correction</option>
                <option value="Work From Home">Work From Home</option>
                <option value="On-site / Client Visit">
                  On-site / Client Visit
                </option>
                <option value="Biometric Issue">Biometric Issue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Check-in Time
              </label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData({ ...formData, checkIn: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Check-out Time
              </label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData({ ...formData, checkOut: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Reporting Manager *
            </label>
            <select
              required
              value={formData.manager}
              onChange={(e) =>
                setFormData({ ...formData, manager: e.target.value })
              }
              className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
            >
              <option value="Arjun Reddy">Arjun Reddy (Manager)</option>
              <option value="Sathish Kumar">Sathish Kumar (HR)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Reason *
            </label>
            <textarea
              required
              placeholder="Explain why you need this regularization..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-3xl px-6 py-4 text-[14px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all shadow-inner h-28 resize-none"
            />
          </div>

          <div className="p-4 border-2 border-dashed border-emerald-500/10 rounded-2xl flex items-center justify-between group hover:border-primary transition-all bg-[#F0FDF4]/20 cursor-pointer">
            <div className="flex items-center gap-3">
              <Paperclip
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
              <span className="text-[13px] font-bold text-muted-foreground group-hover:text-primary">
                Upload Proof (Optional)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              PDF, JPG
            </span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[14px] font-black text-slate-500 hover:bg-secondary rounded-2xl transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.8] py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-bold uppercase tracking-wider shadow-xl shadow-[#00B87C]/25 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function RequestDetailPopup({
  request,
  onClose,
}: {
  request: RegularizationRequest;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                Request Details
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                {request.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-xl transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Status
              </span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Applied On
              </span>
              <span className="text-[14px] font-black text-foreground">
                {request.appliedOn}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} className="text-primary" /> Date
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.date}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <FileText size={12} className="text-primary" /> Type
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.type}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} className="text-emerald-500" /> Check-in
              </p>
              <p className="text-[15px] font-black text-emerald-600 dark:text-emerald-400">
                {request.checkIn}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} className="text-slate-400" /> Check-out
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.checkOut}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Reason
            </p>
            <div className="p-4 rounded-2xl bg-background border border-border text-[14px] font-medium text-foreground/80 leading-relaxed italic">
              "{request.reason}"
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-border">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
              AR
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Reporting Manager
              </p>
              <p className="text-[14px] font-black text-foreground">
                {request.manager}
              </p>
            </div>
            {request.status === "Approved" && (
              <div className="text-right">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Approved On
                </p>
                <p className="text-[14px] font-black text-primary">
                  {request.approvalDate || request.appliedOn}
                </p>
              </div>
            )}
          </div>

          {request.status === "Rejected" && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">
                Rejection Reason
              </p>
              <p className="text-[13px] font-bold text-rose-600 dark:text-rose-400">
                {request.rejectionReason || "Insufficient proof provided"}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-secondary/30 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-white rounded-2xl text-[14px] font-semibold uppercase tracking-wider shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EmployeeAttendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    punchState,
    handlePunchIn,
    handlePunchOut,
    handleStartBreak,
    handleEndBreak,
    handleResetPunch,
  } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(3); // April
  const [selectedYear] = useState(2026);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<RegularizationRequest | null>(null);
  const [requests, setRequests] = useState<RegularizationRequest[]>([
    {
      id: "REG-001",
      date: "10 Apr 2026",
      type: "Missed Check-out",
      checkIn: "08:52 AM",
      checkOut: "06:05 PM",
      reason: "Forgot to punch out",
      manager: "Arjun Reddy",
      status: "Pending",
      appliedOn: "10 Apr 2026",
    },
    {
      id: "REG-002",
      date: "12 Apr 2026",
      type: "On-site / Client Visit",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      reason: "On-site client meeting",
      manager: "Arjun Reddy",
      status: "Approved",
      appliedOn: "12 Apr 2026",
      approvalDate: "13 Apr 2026",
    },
  ]);

  const [logs, setLogs] = useState(ATTENDANCE_LOGS);
  const [selectedDay, setSelectedDay] = useState<number | null>(6); // Default to April 6 (Today)
  const [regDefaultDate, setRegDefaultDate] = useState("");

  const mergedLogs = useMemo(() => {
    const todayStr = "06 Apr 2026";
    let updated = [...logs];
    const todayIdx = updated.findIndex((l) => l.date === todayStr);

    if (punchState.punchInTime) {
      const todayLog = {
        date: todayStr,
        in: punchState.punchInTime,
        out: punchState.punchOutTime || "-",
        status: "Present",
      };
      if (todayIdx > -1) {
        updated[todayIdx] = todayLog;
      } else {
        updated.push(todayLog);
      }
    }
    return updated;
  }, [logs, punchState.punchInTime, punchState.punchOutTime]);

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const convertInputToDisplayDate = (inputDate: string): string => {
    if (!inputDate) return "";
    const parts = inputDate.split("-");
    if (parts.length < 3) return inputDate;
    const year = parts[0];
    const monthIdx = parseInt(parts[1]) - 1;
    const day = parts[2];
    const monthShort = MONTH_NAMES[monthIdx]?.substring(0, 3) || "";
    return `${day} ${monthShort} ${year}`;
  };

  const getLogForDay = useMemo(() => {
    return (day: number) => {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const monthStr = MONTH_NAMES[selectedMonth].substring(0, 3);
      const dateStr = `${dayStr} ${monthStr} ${selectedYear}`;

      const found = logs.find((l) => l.date === dateStr);
      if (found) return found;

      // Determine if weekend
      const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend) {
        return { date: dateStr, in: "-", out: "-", status: "Weekend" };
      }

      // Hardcoded leave for day 7
      if (day === 7) {
        return { date: dateStr, in: "-", out: "-", status: "Leave" };
      }

      // Past weekdays (day < today (6)) with no logs default to Present
      if (day < 6) {
        return {
          date: dateStr,
          in: "09:00 AM",
          out: "06:00 PM",
          status: "Present",
        };
      }

      // Future/today with no log
      return { date: dateStr, in: "-", out: "-", status: "-" };
    };
  }, [logs, selectedMonth, selectedYear, firstDayOfMonth]);

  const selectedDayLog = useMemo(() => {
    if (selectedDay === null) return null;
    return getLogForDay(selectedDay);
  }, [selectedDay, getLogForDay]);

  const handleApplyRegularization = () => {
    if (selectedDay) {
      const dayPadded = String(selectedDay).padStart(2, "0");
      const monthPadded = String(selectedMonth + 1).padStart(2, "0");
      const dateStr = `${selectedYear}-${monthPadded}-${dayPadded}`;
      setRegDefaultDate(dateStr);
    } else {
      setRegDefaultDate("");
    }
    setIsRegModalOpen(true);
  };

  const handleSubmitRegularization = (newReq: RegularizationRequest) => {
    setRequests([newReq, ...requests]);

    const displayDate = convertInputToDisplayDate(newReq.date);
    let statusText = "Present";
    if (newReq.type === "Work From Home") statusText = "WFH";
    else if (newReq.type === "On-site / Client Visit") statusText = "On-site";
    else if (
      newReq.type === "Missed Check-in" ||
      newReq.type === "Missed Check-out" ||
      newReq.type === "Full Day Correction"
    ) {
      statusText = "Present"; // Regularized/approved correction represents presence
    }

    setLogs((prevLogs) => {
      const existingIdx = prevLogs.findIndex((l) => l.date === displayDate);
      const newLog = {
        date: displayDate,
        in: newReq.checkIn,
        out: newReq.checkOut,
        status: statusText,
      };

      if (existingIdx > -1) {
        const updated = [...prevLogs];
        updated[existingIdx] = newLog;
        return updated;
      } else {
        const updated = [...prevLogs, newLog];
        return updated.sort((a, b) => {
          const dayA = parseInt(a.date.split(" ")[0]);
          const dayB = parseInt(b.date.split(" ")[0]);
          return dayA - dayB;
        });
      }
    });
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-8 animate-in fade-in duration-700">
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-card rounded-xl border border-border shadow-sm">
          <button
            onClick={() =>
              setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
            }
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 text-[14px] font-black text-foreground min-w-[100px] text-center">
            {MONTH_NAMES[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={() =>
              setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))
            }
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          onClick={handleApplyRegularization}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-primary/10 shadow-sm"
        >
          <Plus size={16} /> Apply Regularization
        </button>
      </div>

      {/* ─── Stat Cards Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Working Days",
            value: "22",
            color: "var(--foreground)",
            bg: "bg-card",
          },
          {
            label: "Present",
            value: "19",
            color: "var(--primary)",
            bg: "bg-card",
          },
          {
            label: "Absent",
            value: "0",
            color: "var(--destructive)",
            bg: "bg-card",
          },
          {
            label: "Leaves Taken",
            value: "2",
            color: "#F59E0B",
            bg: "bg-card",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary transition-colors ${card.bg}`}
          >
            <p
              className="text-[28px] font-bold mb-1"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* TODAY'S SCHEDULE */}
      <div className="bg-card rounded-2xl p-7 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-black text-foreground">
            Today's Shift Attendance
          </h3>
          <span className="text-[12px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
            {new Date().toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-secondary/50 rounded-2xl p-6 border-l-[4px] border-primary">
          <div className="flex-1">
            <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">
              MORNING SHIFT (09:00 – 18:00)
            </p>
            {punchState.isPunchedIn ? (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-[16px] font-black text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Active Shift In Progress
                </p>
                <p className="text-[13px] font-semibold text-muted-foreground">
                  Punched in at:{" "}
                  <span className="text-foreground font-bold">
                    {punchState.punchInTime}
                  </span>
                </p>
              </div>
            ) : punchState.punchOutTime ? (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-[16px] font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                  ✓ Shift Completed
                </p>
                <p className="text-[13px] font-semibold text-muted-foreground">
                  In:{" "}
                  <span className="text-foreground font-bold">
                    {punchState.punchInTime}
                  </span>{" "}
                  | Out:{" "}
                  <span className="text-foreground font-bold">
                    {punchState.punchOutTime}
                  </span>
                </p>
                <p className="text-[13px] font-semibold text-muted-foreground">
                  Total worked:{" "}
                  <span className="text-primary font-black">
                    {punchState.workedHours}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-[16px] font-black text-muted-foreground">
                  Not Punched In Yet
                </p>
                <p className="text-[13px] font-semibold text-muted-foreground">
                  Please punch in to record your attendance.
                </p>
              </div>
            )}

            {/* Display Today's Logs Timeline */}
            {punchState.logs && punchState.logs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-3">
                  Today's Activity Timeline
                </p>
                <div className="space-y-3">
                  {punchState.logs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          log.type === "in" || log.type === "break_end"
                            ? "bg-emerald-500"
                            : log.type === "break_start"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[12px] font-bold text-foreground w-[65px]">
                        {log.time}
                      </span>
                      <span className="text-[12px] font-medium text-muted-foreground">
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {punchState.isPunchedIn ? (
              <>
                {!punchState.isOnBreak ? (
                  <button
                    onClick={handleStartBreak}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                  >
                    Take Break
                  </button>
                ) : (
                  <button
                    onClick={handleEndBreak}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                  >
                    End Break
                  </button>
                )}
                <button
                  onClick={handlePunchOut}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                >
                  Punch Out
                </button>
              </>
            ) : punchState.punchOutTime ? (
              <button
                onClick={handleResetPunch}
                className="px-6 py-3 rounded-xl bg-[#00B87C] hover:bg-[#009966] text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                Reset Shift
              </button>
            ) : (
              <button
                onClick={handlePunchIn}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B87C] to-[#009966] hover:from-[#00c987] hover:to-[#00a36d] text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                Punch In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT PANEL: Calendar (7/12) */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-black text-foreground">
                Attendance Calendar
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { label: "Present", color: "var(--primary)" },
                  { label: "Absent", color: "var(--destructive)" },
                  { label: "Leave", color: "#F59E0B" },
                  { label: "Weekend", color: "var(--muted-foreground)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, i) => {
                if (day === null)
                  return <div key={`empty-${i}`} className="aspect-square" />;

                const log = getLogForDay(day);
                const status = log.status;
                const isToday = day === 6;
                const isSelected = selectedDay === day;

                let cellStyle =
                  "bg-background border-border hover:border-primary/40";
                let textStyle = "text-foreground";
                let dotStyle = "bg-transparent";

                if (isToday) {
                  cellStyle =
                    "bg-primary text-white shadow-xl shadow-primary/30 border-primary hover:bg-primary/95";
                  textStyle = "text-white font-extrabold";
                  dotStyle = "bg-white";
                } else if (
                  status === "Present" ||
                  status === "WFH" ||
                  status === "On-site"
                ) {
                  cellStyle =
                    "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20";
                  textStyle =
                    "text-emerald-700 dark:text-emerald-400 font-bold";
                  dotStyle = "bg-emerald-500";
                } else if (status === "Late") {
                  cellStyle =
                    "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20";
                  textStyle = "text-amber-600 dark:text-amber-400 font-bold";
                  dotStyle = "bg-amber-500";
                } else if (status === "Leave") {
                  cellStyle =
                    "bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20";
                  textStyle = "text-indigo-600 dark:text-indigo-400 font-bold";
                  dotStyle = "bg-indigo-500";
                } else if (status === "Weekend") {
                  cellStyle =
                    "bg-secondary/30 border-transparent opacity-40 hover:opacity-60";
                  textStyle = "text-muted-foreground";
                  dotStyle = "bg-transparent";
                } else if (status === "Absent") {
                  cellStyle =
                    "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20";
                  textStyle = "text-rose-600 dark:text-rose-400 font-bold";
                  dotStyle = "bg-rose-500";
                }

                const selectedRing = isSelected
                  ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950 scale-105 z-10 shadow-md"
                  : "";

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 border ${cellStyle} ${selectedRing}`}
                  >
                    <span className={`text-base font-black ${textStyle}`}>
                      {day}
                    </span>
                    {status !== "Weekend" && status !== "-" && (
                      <div
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotStyle}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mini Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Check-in Avg",
                value: "08:54 AM",
                color: "text-primary",
              },
              {
                label: "Check-out Avg",
                value: "06:04 PM",
                color: "text-muted-foreground",
              },
              { label: "Punctuality", value: "96%", color: "text-primary" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center group hover:border-primary transition-colors"
              >
                <p className={`text-lg font-black mb-1 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Daily Log & Regularization (5/12) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-foreground">
                  Daily Log
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-background border border-border text-[11px] font-bold text-muted-foreground">
                  April 2026
                </span>
              </div>
              <button
                onClick={() => navigate("/regularization-history")}
                className="text-primary text-[12px] font-black hover:underline flex items-center gap-1"
              >
                View History <ChevronRight size={14} />
              </button>
            </div>

            {/* Selected Day Details Panel */}
            {selectedDayLog && (
              <div className="p-6 bg-gradient-to-br from-[#F0FDF4] via-[#F0FDF4]/30 to-transparent dark:from-emerald-500/5 dark:to-transparent border-b border-border animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest leading-none mb-1">
                        Selected Attendance Details
                      </p>
                      <h4 className="text-[14px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                        {selectedDayLog.date}
                      </h4>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      selectedDayLog.status === "Present" ||
                      selectedDayLog.status === "WFH" ||
                      selectedDayLog.status === "On-site"
                        ? "bg-emerald-500/10 text-primary border border-emerald-500/20"
                        : selectedDayLog.status === "Late"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : selectedDayLog.status === "Leave"
                            ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                            : selectedDayLog.status === "Weekend"
                              ? "bg-secondary text-muted-foreground border border-border"
                              : selectedDayLog.status === "Absent"
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                : "bg-secondary text-muted-foreground/40 border border-border"
                    }`}
                  >
                    {selectedDayLog.status === "-"
                      ? "No Record"
                      : selectedDayLog.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-background rounded-xl border border-border/80 text-center">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Punch In
                    </p>
                    <p className="text-[13px] font-bold text-foreground">
                      {selectedDayLog.in}
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-border/80 text-center">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Punch Out
                    </p>
                    <p className="text-[13px] font-bold text-foreground">
                      {selectedDayLog.out}
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-border/80 text-center">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Hours
                    </p>
                    <p className="text-[13px] font-black text-primary">
                      {selectedDayLog.status === "Present" ||
                      selectedDayLog.status === "Late" ||
                      selectedDayLog.status === "WFH" ||
                      selectedDayLog.status === "On-site"
                        ? "9h 00m"
                        : "-"}
                    </p>
                  </div>
                </div>

                {(selectedDayLog.status === "Absent" ||
                  selectedDayLog.status === "Late" ||
                  selectedDayLog.status === "-") && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/10">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                      {selectedDayLog.status === "Absent" ||
                      selectedDayLog.status === "-"
                        ? "Missed logging this day? Submit a regularization request."
                        : "Late punch-in? Correct details with manager approval."}
                    </span>
                    <button
                      onClick={() => {
                        const dayPadded = String(selectedDay).padStart(2, "0");
                        const monthPadded = String(selectedMonth + 1).padStart(
                          2,
                          "0",
                        );
                        const dateStr = `${selectedYear}-${monthPadded}-${dayPadded}`;
                        setRegDefaultDate(dateStr);
                        setIsRegModalOpen(true);
                      }}
                      className="whitespace-nowrap px-4 py-1.5 bg-amber-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    >
                      Regularize
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      In
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Out
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mergedLogs.map((log, i) => {
                    const logDay = parseInt(log.date.split(" ")[0]);
                    const isSelectedRow = selectedDay === logDay;
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedDay(logDay)}
                        className={`h-14 hover:bg-secondary transition-colors group cursor-pointer ${
                          isSelectedRow
                            ? "bg-primary/5 hover:bg-primary/10 border-l-[3px] border-l-primary"
                            : ""
                        }`}
                      >
                        <td className="px-6 text-[13px] font-black text-slate-800 dark:text-slate-100">
                          {log.date}
                        </td>
                        <td className="px-6 text-[12px] font-bold text-muted-foreground">
                          {log.in}
                        </td>
                        <td className="px-6 text-[12px] font-bold text-muted-foreground">
                          {log.out}
                        </td>
                        <td className="px-6">
                          <span
                            className={`text-[12px] font-black ${
                              log.status === "Present" ||
                              log.status === "WFH" ||
                              log.status === "On-site"
                                ? "text-primary"
                                : log.status === "Late"
                                  ? "text-amber-500"
                                  : log.status === "Leave"
                                    ? "text-indigo-400"
                                    : log.status === "Weekend"
                                      ? "text-muted-foreground/50"
                                      : log.status === "Absent"
                                        ? "text-rose-500"
                                        : "text-muted-foreground/30"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regularization Requests Section */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-black text-foreground">
                Regularization
              </h3>
              <button
                onClick={handleApplyRegularization}
                className="text-primary text-[12px] font-black hover:underline px-3 py-1 bg-primary/10 rounded-lg transition-all active:scale-95"
              >
                Apply New
              </button>
            </div>

            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((req, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center justify-between p-4 rounded-xl bg-background border border-border transition-all hover:border-primary/40 group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">
                        {req.date}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {req.reason}
                      </span>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-background rounded-2xl border border-dashed border-border">
                  <p className="text-[13px] font-bold text-muted-foreground italic">
                    No regularization requests this month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRegModalOpen && (
          <RegularizationModal
            isOpen={isRegModalOpen}
            onClose={() => setIsRegModalOpen(false)}
            onSubmit={handleSubmitRegularization}
            defaultDate={regDefaultDate}
          />
        )}
        {selectedRequest && (
          <RequestDetailPopup
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
