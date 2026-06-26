import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Calendar,
  Paperclip,
  User,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "../../components/workflow/StatusBadge";

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
  { date: "01 Apr 2026", in: "08:55 AM", out: "06:02 PM", status: "Present" },
  { date: "02 Apr 2026", in: "08:50 AM", out: "06:05 PM", status: "Present" },
  { date: "03 Apr 2026", in: "09:08 AM", out: "06:12 PM", status: "Present" },
  { date: "04 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "05 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "06 Apr 2026", in: "08:55 AM", out: "06:00 PM", status: "Present" },
  { date: "07 Apr 2026", in: "08:52 AM", out: "06:08 PM", status: "Present" },
  { date: "08 Apr 2026", in: "09:18 AM", out: "06:00 PM", status: "Late" },
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
    manager: "Sathish Kumar",
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
      "Regularization request submitted to HR.",
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
            <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/20">
              <Calendar size={22} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-foreground uppercase tracking-tight">
                Apply Regularization
              </h3>
              <p className="text-[12px] text-[#6B7280]">
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
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Date Selector *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Regularization Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] transition-all shadow-inner"
              >
                <option value="">Select Type</option>
                <option value="Missed Check-in">Missed Check-in</option>
                <option value="Missed Check-out">Missed Check-out</option>
                <option value="Full Day Correction">Full Day Correction</option>
                <option value="Half Day Correction">Half Day Correction</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Check-in Time
              </label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData({ ...formData, checkIn: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Check-out Time
              </label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData({ ...formData, checkOut: e.target.value })
                }
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Approving Authority *
            </label>
            <select
              required
              value={formData.manager}
              onChange={(e) =>
                setFormData({ ...formData, manager: e.target.value })
              }
              className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] transition-all shadow-inner"
            >
              <option value="Sathish Kumar">Sathish Kumar (HR Director)</option>
              <option value="Admin Office">Admin Office</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Reason *
            </label>
            <textarea
              required
              placeholder="Explain why you need this regularization..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-3xl px-6 py-4 text-[14px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-[#00B87C] transition-all shadow-inner h-28 resize-none"
            />
          </div>

          <div className="p-4 border-2 border-dashed border-emerald-500/10 rounded-2xl flex items-center justify-between group hover:border-[#00B87C] transition-all bg-[#F0FDF4]/20 cursor-pointer">
            <div className="flex items-center gap-3">
              <Paperclip
                size={18}
                className="text-muted-foreground group-hover:text-[#00B87C]"
              />
              <span className="text-[13px] font-bold text-muted-foreground group-hover:text-[#00B87C]">
                Upload Proof (Optional)
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PDF, JPG
            </span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[14px] font-bold text-slate-500 hover:bg-secondary rounded-2xl transition-all uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.8] py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-bold uppercase tracking-wider shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
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

export function ManagerPersonalAttendance() {
  const [selectedMonth, setSelectedMonth] = useState(3); // April
  const [selectedYear] = useState(2026);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("Suresh Iyer");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [requests, setRequests] = useState<RegularizationRequest[]>([
    {
      id: "REG-901",
      date: "08 Apr 2026",
      type: "Late Correction",
      checkIn: "08:55 AM",
      checkOut: "06:00 PM",
      reason: "Metro delay, biometric was marked late",
      manager: "Sathish Kumar",
      status: "Pending",
      appliedOn: "08 Apr 2026",
    },
  ]);

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
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-8 animate-in fade-in duration-700 bg-[#F0FDF4]/30 dark:bg-transparent min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/20">
            <Clock size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
              My Attendance
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Personal Log & Corrections
            </p>
          </div>
        </div>

        {/* Employee Selector Preselected to Suresh Iyer */}
        <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
          <User size={16} className="text-[#00B87C]" />
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="bg-transparent text-[13px] font-bold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="Suresh Iyer">Suresh Iyer (Manager)</option>
          </select>
        </div>
      </div>

      {/* Month navigator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-card rounded-xl border border-border shadow-sm w-fit">
          <button
            onClick={() =>
              setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
            }
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 text-[14px] font-bold text-foreground min-w-[100px] text-center">
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-[#00B87C] text-[#00B87C] hover:bg-emerald-500/10 shadow-sm"
        >
          <Plus size={16} /> Apply Regularization
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Working Days", value: "22", color: "var(--foreground)" },
          { label: "Present", value: "21", color: "#00B87C" },
          { label: "Absent", value: "0", color: "var(--destructive)" },
          { label: "Leaves Taken", value: "1", color: "#F59E0B" },
        ].map((card, i) => (
          <div
            key={i}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#00B87C] transition-colors"
          >
            <p
              className="text-[28px] font-bold mb-1"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-bold text-foreground">
                Attendance Calendar
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { label: "Present", color: "#00B87C" },
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
                  className="text-center text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]/40"
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
                const isToday = day === 6;
                const isLeave = day === 7;
                const isLate = day === 8;

                let cellStyle = "bg-background";
                let textStyle = "text-foreground";
                let dotStyle = "bg-transparent";

                if (isToday) {
                  cellStyle = "bg-[#00B87C] shadow-xl shadow-emerald-500/30";
                  textStyle = "text-white";
                  dotStyle = "bg-white";
                } else if (isLeave) {
                  cellStyle = "bg-amber-500/10 border-amber-500/20";
                  textStyle = "text-amber-500";
                  dotStyle = "bg-amber-500";
                } else if (isLate) {
                  cellStyle = "bg-amber-500/10 border-amber-500/20";
                  textStyle = "text-amber-500";
                  dotStyle = "bg-amber-500";
                } else if (isWeekend) {
                  cellStyle = "bg-secondary/30 border-transparent opacity-40";
                  textStyle = "text-muted-foreground";
                } else if (day < 6) {
                  cellStyle = "bg-emerald-500/10 border-emerald-500/20";
                  textStyle = "text-[#00B87C]";
                  dotStyle = "bg-[#00B87C]";
                }

                return (
                  <div
                    key={day}
                    onClick={() =>
                      setSelectedDay(day === selectedDay ? null : day)
                    }
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 border ${cellStyle} ${selectedDay === day ? "ring-2 ring-[#00B87C] ring-offset-1" : ""}`}
                  >
                    <span className={`text-base font-bold ${textStyle}`}>
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

            {/* Day Detail Popup */}
            {selectedDay !== null && (
              <div
                className="mt-5 rounded-xl border overflow-hidden animate-in slide-in-from-top-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ background: "#00B87C" }}
                >
                  <div>
                    <span className="text-[14px] font-black text-white">
                      {MONTH_NAMES[selectedMonth]} {selectedDay}, {selectedYear}
                    </span>
                    <span className="text-[11px] text-white/80 ml-3">
                      Daily Log Detail
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-white/80 hover:text-white text-lg font-black leading-none w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                  >
                    ×
                  </button>
                </div>
                {(() => {
                  const dayStr = selectedDay.toString().padStart(2, "0");
                  const log = ATTENDANCE_LOGS.find((l) =>
                    l.date.startsWith(dayStr),
                  ) || { in: "-", out: "-", status: "No Data" };
                  const isWknd = log.status === "Weekend";
                  return (
                    <div className="p-5 bg-card flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              log.status === "Present"
                                ? "bg-[#00B87C]/10 text-[#00B87C]"
                                : log.status === "Late"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : log.status === "Weekend"
                                    ? "bg-secondary text-muted-foreground"
                                    : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        {!isWknd && log.status !== "No Data" && (
                          <button
                            onClick={() => {
                              setIsRegModalOpen(true);
                              setSelectedDay(null);
                            }}
                            className="text-[11px] font-bold text-[#00B87C] hover:underline"
                          >
                            Request Regularization
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                            Check-in
                          </p>
                          <p className="text-[13px] font-black text-foreground">
                            {log.in}
                          </p>
                        </div>
                        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                            Check-out
                          </p>
                          <p className="text-[13px] font-black text-foreground">
                            {log.out}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Mini Stats Below Calendar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Check-in Avg",
                value: "08:52 AM",
                color: "text-[#00B87C]",
              },
              {
                label: "Check-out Avg",
                value: "06:03 PM",
                color: "text-muted-foreground",
              },
              { label: "Punctuality", value: "98%", color: "text-[#00B87C]" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center group hover:border-[#00B87C] transition-colors"
              >
                <p className={`text-lg font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Log Table */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-foreground">
                  Daily Log
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-background border border-border text-[11px] font-bold text-muted-foreground">
                  April 2026
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#F3F4F6]">
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase">
                      In
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase">
                      Out
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ATTENDANCE_LOGS.map((log, i) => (
                    <tr
                      key={i}
                      className="h-14 border-b border-[#F3F4F6] hover:bg-[#00B87C]/[0.08] transition-colors group"
                    >
                      <td className="px-6 text-[13px] font-bold text-foreground">
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
                          className={`text-[11px] font-semibold ${
                            log.status === "Present"
                              ? "text-[#00B87C]"
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

          {/* Pending Corrections */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[15px] font-bold text-foreground mb-4">
              Pending Regularizations
            </h3>
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-border bg-secondary/20 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">
                      {req.type}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground font-bold">
                    <span>Date: {req.date}</span>
                    <span>Approver: {req.manager}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground font-medium italic mt-1">
                    "{req.reason}"
                  </p>
                </div>
              ))}
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
      </AnimatePresence>
    </div>
  );
}
