import { useState } from "react";
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
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { StatusBadge } from "../components/workflow/StatusBadge";

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
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: RegularizationRequest) => void;
}) {
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    checkIn: "",
    checkOut: "",
    reason: "",
    manager: "Arjun Reddy",
  });

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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              PDF, JPG
            </span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[14px] font-black text-slate-500 hover:bg-secondary rounded-[20px] transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.8] py-4 bg-[#00B87C] text-white rounded-[20px] text-[14px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all"
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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
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
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Status
              </span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Applied On
              </span>
              <span className="text-[14px] font-black text-foreground">
                {request.appliedOn}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-primary" /> Date
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.date}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} className="text-primary" /> Type
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.type}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-emerald-500" /> Check-in
              </p>
              <p className="text-[15px] font-black text-emerald-600 dark:text-emerald-400">
                {request.checkIn}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-slate-400" /> Check-out
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.checkOut}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
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
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Reporting Manager
              </p>
              <p className="text-[14px] font-black text-foreground">
                {request.manager}
              </p>
            </div>
            {request.status === "Approved" && (
              <div className="text-right">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
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
            className="w-full py-4 bg-primary text-white rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
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
  const navigate = useNavigate();
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

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handleApplyRegularization = () => {
    setIsRegModalOpen(true);
  };

  const handleSubmitRegularization = (newReq: RegularizationRequest) => {
    setRequests([newReq, ...requests]);
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
              className="text-3xl font-black mb-1"
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

      {/* ─── Main Content Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT PANEL: Calendar (7/12) */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm relative overflow-hidden">
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
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
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
                  className="text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/40"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, i) => {
                if (day === null)
                  return <div key={`empty-${i}`} className="aspect-square" />;

                const isWeekend = i % 7 === 0 || i % 7 === 6;
                const isToday = day === 6; // April 6
                const isLeave = day === 7;

                let cellStyle = "bg-background";
                let textStyle = "text-foreground";
                let dotStyle = "bg-transparent";

                if (isToday) {
                  cellStyle = "bg-primary shadow-xl shadow-primary/30";
                  textStyle = "text-white";
                  dotStyle = "bg-white";
                } else if (isLeave) {
                  cellStyle = "bg-amber-500/10 border-amber-500/20";
                  textStyle = "text-amber-500";
                  dotStyle = "bg-amber-500";
                } else if (isWeekend) {
                  cellStyle = "bg-secondary/30 border-transparent opacity-40";
                  textStyle = "text-muted-foreground";
                } else if (day < 6) {
                  cellStyle = "bg-primary/10 border-primary/20";
                  textStyle = "text-primary";
                  dotStyle = "bg-primary";
                }

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 border ${cellStyle}`}
                  >
                    <span className={`text-base font-black ${textStyle}`}>
                      {day}
                    </span>
                    {!isWeekend && (
                      <div
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotStyle}`}
                      />
                    )}
                  </div>
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
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Daily Log & Regularization (5/12) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-foreground">
                  Daily Log
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-background border border-border text-[10px] font-bold text-muted-foreground">
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

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      In
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Out
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ATTENDANCE_LOGS.map((log, i) => (
                    <tr
                      key={i}
                      className="h-14 hover:bg-secondary transition-colors group"
                    >
                      <td className="px-6 text-[13px] font-black text-foreground">
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
                            log.status === "Present"
                              ? "text-primary"
                              : log.status === "Late"
                                ? "text-amber-500"
                                : log.status === "Leave"
                                  ? "text-indigo-400"
                                  : "text-muted-foreground/30"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regularization Requests Section */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
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
