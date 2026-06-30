import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CalendarX,
  Plus,
  X,
  CalendarDays,
  FileText,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Info,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";

// Types
type LeaveTab = "My Requests" | "Calendar" | "History" | "Policy";
type LeaveType = "CL" | "EL" | "SL" | "CO";
type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

interface LeaveRecord {
  id: string;
  type: LeaveType;
  typeFull: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  appliedOn: string;
  approvedBy?: string;
  startsIn?: string;
}

export function EmployeeLeaves() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LeaveTab>("My Requests");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHistoryLeave, setSelectedHistoryLeave] =
    useState<LeaveRecord | null>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>("CL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [notifyManager, setNotifyManager] = useState(true);

  // Initialize from navigation state if present
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as LeaveTab);
    }
    if (location.state?.openApplyModal) {
      setIsApplyModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Leave records state (allows mutations)
  const [pendingRequests, setPendingRequests] = useState<LeaveRecord[]>([
    {
      id: "LR-1002",
      type: "SL",
      typeFull: "Sick Leave",
      from: "Apr 18, 2026",
      to: "Apr 20, 2026",
      days: 3,
      reason: "Viral fever, resting at home",
      status: "Pending",
      appliedOn: "Apr 17, 2026",
    },
  ]);

  const approvedLeaves: LeaveRecord[] = [
    {
      id: "LR-0945",
      type: "EL",
      typeFull: "Earned Leave",
      from: "May 10, 2026",
      to: "May 14, 2026",
      days: 5,
      reason: "Family trip",
      status: "Approved",
      appliedOn: "Apr 05, 2026",
      approvedBy: "Ryan Park",
      startsIn: "Starts in 12 days",
    },
  ];

  const [historyLeaves] = useState<LeaveRecord[]>([
    {
      id: "LR-0812",
      type: "CL",
      typeFull: "Casual Leave",
      from: "Mar 12, 2026",
      to: "Mar 12, 2026",
      days: 1,
      reason: "Personal errands",
      status: "Approved",
      appliedOn: "Mar 08, 2026",
    },
    {
      id: "LR-0790",
      type: "CO",
      typeFull: "Comp Off",
      from: "Feb 20, 2026",
      to: "Feb 21, 2026",
      days: 2,
      reason: "Rest after weekend deployment",
      status: "Approved",
      appliedOn: "Feb 18, 2026",
    },
    {
      id: "LR-0705",
      type: "EL",
      typeFull: "Earned Leave",
      from: "Jan 05, 2026",
      to: "Jan 10, 2026",
      days: 6,
      reason: "Winter vacation",
      status: "Approved",
      appliedOn: "Dec 15, 2025",
    },
  ]);

  const leaveTypeLabels: Record<LeaveType, string> = {
    CL: "Casual Leave",
    EL: "Earned Leave",
    SL: "Sick Leave",
    CO: "Comp Off",
  };

  const handleCancelRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(
      "Request Cancelled",
      "info",
      "Your leave request has been cancelled.",
    );
    setShowCancelConfirm(null);
  };

  const handleSubmitLeave = () => {
    if (!fromDate || !toDate) {
      showToast(
        "Missing Dates",
        "error",
        "Please select both from and to dates.",
      );
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.max(
      1,
      Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );
    const newReq: LeaveRecord = {
      id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: selectedLeaveType,
      typeFull: leaveTypeLabels[selectedLeaveType],
      from: from.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      to: to.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      days,
      reason: leaveReason || "No reason provided",
      status: "Pending",
      appliedOn: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
    setPendingRequests((prev) => [newReq, ...prev]);
    showToast(
      "Leave Applied!",
      "success",
      `${leaveTypeLabels[selectedLeaveType]} request submitted for ${days} day(s).`,
    );
    setIsApplyModalOpen(false);
    setFromDate("");
    setToDate("");
    setLeaveReason("");
    setSelectedLeaveType("CL");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500">
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
            <CalendarX size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight m-0 leading-tight">
              My Leaves
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Manage your leave requests and balance
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      {/* ═══════ LEAVE BALANCE CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#00B87C]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
              <Calendar size={18} />
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              CASUAL LEAVE
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#00B87C] leading-none">
              6
            </span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">
              / 12 days
            </span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00B87C] rounded-full"
                style={{ width: "50%" }}
              />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">
              6 days used this year
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#00B87C]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
              <CalendarDays size={18} />
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              EARNED LEAVE
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#00B87C] leading-none">
              18
            </span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">
              / 24 days
            </span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00B87C] rounded-full"
                style={{ width: "75%" }}
              />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">
              6 days used this year
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#0EA5E9]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-[#0EA5E9] font-black text-xs">
              SL
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              SICK LEAVE
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#0EA5E9] leading-none">
              8
            </span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">
              / 12 days
            </span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0EA5E9] rounded-full"
                style={{ width: "66%" }}
              />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">
              4 days used this year
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#8B5CF6]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-[#8B5CF6] font-black text-xs">
              CO
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              COMP OFF
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#8B5CF6] leading-none">
              2
            </span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">
              / 5 days
            </span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] rounded-full"
                style={{ width: "40%" }}
              />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">
              3 days used this year
            </p>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT AREA ═══════ */}
      <div className="bg-card border border-border rounded-[32px] p-2 md:p-6 shadow-sm min-h-[500px]">
        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-border px-4 mb-6 overflow-x-auto no-scrollbar">
          {(["My Requests", "Calendar", "History", "Policy"] as LeaveTab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-[#00B87C]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeLeaveTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C]"
                  />
                )}
              </button>
            ),
          )}
        </div>

        {/* TAB CONTENTS */}
        <div className="px-2">
          {activeTab === "My Requests" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Pending Requests */}
              <div>
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">
                  Pending Requests
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="relative bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#00B87C]/[0.08] transition-colors group overflow-hidden"
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          req.type === "CL"
                            ? "bg-[#00B87C]"
                            : req.type === "EL"
                              ? "bg-[#0EA5E9]"
                              : req.type === "SL"
                                ? "bg-[#EF4444]"
                                : "bg-[#8B5CF6]"
                        }`}
                      />

                      <div className="flex items-start md:items-center gap-4 pl-2">
                        <div
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${
                            req.type === "CL"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : req.type === "EL"
                                ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                                : req.type === "SL"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-violet-500/10 text-violet-600 border-violet-500/20"
                          }`}
                        >
                          {req.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[15px] font-black text-foreground">
                              {req.from} – {req.to}
                            </h4>
                            <span className="text-[12px] font-bold text-muted-foreground">
                              • {req.days} days
                            </span>
                          </div>
                          <p className="text-[13px] font-bold text-muted-foreground italic mt-0.5">
                            {req.reason}
                          </p>
                          <p className="text-[11px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-widest">
                            Applied on {req.appliedOn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 pl-2 md:pl-0 border-t md:border-0 border-border pt-3 md:pt-0">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-[#F59E0B] text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} /> Pending
                        </span>
                        <button
                          onClick={() => setShowCancelConfirm(req.id)}
                          className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold uppercase tracking-widest transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Cancel Confirmation overlay inline */}
                      {showCancelConfirm === req.id && (
                        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 z-10 animate-in fade-in duration-200">
                          <span className="text-[13px] font-bold text-foreground">
                            Are you sure you want to cancel this request?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowCancelConfirm(null)}
                              className="px-4 py-1.5 rounded-lg text-muted-foreground hover:bg-muted text-[11px] font-bold uppercase tracking-widest transition-colors"
                            >
                              No, Keep
                            </button>
                            <button
                              onClick={() => handleCancelRequest(req.id)}
                              className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                              Yes, Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <div className="bg-card border border-border border-dashed rounded-2xl p-8 text-center">
                      <p className="text-[13px] font-bold text-muted-foreground">
                        No pending requests
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Approved Leaves */}
              <div>
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">
                  Upcoming Approved Leaves
                </h3>
                <div className="space-y-3">
                  {approvedLeaves.map((req) => (
                    <div
                      key={req.id}
                      className="relative bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00B87C]" />

                      <div className="flex items-start md:items-center gap-4 pl-2">
                        <div
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${
                            req.type === "CL"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : req.type === "EL"
                                ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                                : req.type === "SL"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-violet-500/10 text-violet-600 border-violet-500/20"
                          }`}
                        >
                          {req.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[15px] font-black text-foreground">
                              {req.from} – {req.to}
                            </h4>
                            <span className="text-[12px] font-bold text-muted-foreground">
                              • {req.days} days
                            </span>
                          </div>
                          <p className="text-[13px] font-bold text-muted-foreground mt-0.5">
                            Approved by {req.approvedBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center pl-2 md:pl-0">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#00B87C] text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
                          {req.startsIn}
                        </span>
                      </div>
                    </div>
                  ))}
                  {approvedLeaves.length === 0 && (
                    <div className="bg-card border border-border border-dashed rounded-2xl p-8 text-center">
                      <p className="text-[13px] font-bold text-muted-foreground">
                        No upcoming approved leaves
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Calendar" && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-black text-foreground">
                    {format(currentDate, "MMMM yyyy")}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1.5 rounded-lg border border-border text-[12px] font-bold uppercase hover:bg-muted text-foreground tracking-widest"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-[11px] font-black text-muted-foreground uppercase tracking-widest py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const monthStart = startOfMonth(currentDate);
                    const monthEnd = endOfMonth(monthStart);
                    const startDate = startOfWeek(monthStart);
                    const endDate = endOfWeek(monthEnd);
                    const dateFormat = "d";

                    let formattedDate = "";

                    const calendarDays = eachDayOfInterval({
                      start: startDate,
                      end: endDate,
                    });

                    return calendarDays.map((calDay, i) => {
                      formattedDate = format(calDay, dateFormat);
                      const isCurrentMonth = isSameMonth(calDay, monthStart);
                      const isCurrentDay = isToday(calDay);
                      const dateNum = parseInt(formattedDate);

                      let bgClass =
                        "bg-card border-border hover:border-[#00B87C]/50 cursor-pointer";
                      let content = null;

                      if (!isCurrentMonth) {
                        return (
                          <div
                            key={i}
                            className="min-h-[80px] p-2 rounded-xl border border-border/50 bg-muted/10 flex flex-col"
                          >
                            <span className="text-muted-foreground/40 text-[12px] font-bold">
                              {formattedDate}
                            </span>
                          </div>
                        );
                      }

                      // Dummy logic for leaves based on the day number to show UI
                      if (dateNum === 5) {
                        bgClass = "bg-[#0EA5E9]/5 border-[#0EA5E9]/20";
                        content = (
                          <div className="mt-1 px-1.5 py-0.5 bg-[#0EA5E9] text-white text-[10px] font-bold rounded uppercase tracking-wider truncate text-center">
                            Holiday
                          </div>
                        );
                      } else if (dateNum >= 18 && dateNum <= 20) {
                        bgClass = "bg-amber-500/5 border-amber-500/20";
                        content = (
                          <div className="mt-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase tracking-wider truncate text-center">
                            SL (Pend)
                          </div>
                        );
                      } else if (dateNum >= 10 && dateNum <= 14) {
                        bgClass = "bg-[#00B87C]/5 border-[#00B87C]/20";
                        content = (
                          <div className="mt-1 px-1.5 py-0.5 bg-[#00B87C] text-white text-[10px] font-bold rounded uppercase tracking-wider truncate text-center">
                            EL (Appr)
                          </div>
                        );
                      }

                      return (
                        <div
                          key={i}
                          className={`min-h-[80px] p-2 rounded-xl border transition-colors flex flex-col ${bgClass}`}
                        >
                          <span
                            className={`text-[12px] font-bold ${isCurrentDay ? "w-6 h-6 bg-[#00B87C] text-white rounded-full flex items-center justify-center" : "text-foreground"}`}
                          >
                            {formattedDate}
                          </span>
                          <div className="flex-1" />
                          {content}
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00B87C]" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Approved
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Rejected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Holiday
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "History" && (
            <div className="animate-in fade-in duration-300 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      LEAVE TYPE
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      FROM
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      TO
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      DAYS
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hidden md:table-cell">
                      REASON
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      STATUS
                    </th>
                    <th className="py-4 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hidden md:table-cell">
                      APPLIED ON
                    </th>
                    <th className="py-4 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {historyLeaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${leave.type === "CL" ? "bg-[#00B87C]" : leave.type === "EL" ? "bg-[#0EA5E9]" : leave.type === "SL" ? "bg-[#EF4444]" : "bg-[#8B5CF6]"}`}
                          />
                          <span className="text-[13px] font-bold text-foreground">
                            {leave.typeFull}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[13px] font-bold text-foreground">
                        {leave.from}
                      </td>
                      <td className="py-4 px-4 text-[13px] font-bold text-foreground">
                        {leave.to}
                      </td>
                      <td className="py-4 px-4 text-[13px] font-bold text-muted-foreground">
                        {leave.days}
                      </td>
                      <td className="py-4 px-4 text-[13px] font-bold text-muted-foreground truncate max-w-[150px] hidden md:table-cell">
                        {leave.reason}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit ${
                            leave.status === "Approved"
                              ? "bg-emerald-500/10 text-[#00B87C]"
                              : leave.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-600"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {leave.status === "Approved" && (
                            <CheckCircle2 size={12} />
                          )}
                          {leave.status === "Rejected" && <X size={12} />}
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[12px] font-bold text-muted-foreground hidden md:table-cell">
                        {leave.appliedOn}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedHistoryLeave(leave)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Policy" && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <div className="bg-[#F0FDF4] border border-[#00B87C]/30 rounded-2xl p-6 dark:bg-[#00B87C]/5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-[#00B87C]" />
                  <h3 className="text-[14px] font-black text-foreground">
                    Leave Types & Entitlements
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="py-3 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Type
                        </th>
                        <th className="py-3 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Days/Year
                        </th>
                        <th className="py-3 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Accrual
                        </th>
                        <th className="py-3 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Carryforward
                        </th>
                        <th className="py-3 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Encashable
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 px-4 text-[13px] font-bold">
                          Casual Leave (CL)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          12
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          Monthly (1/mo)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          No
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          No
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-[13px] font-bold">
                          Earned Leave (EL)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          24
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          Monthly (2/mo)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          Yes (max 45)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-[#00B87C]">
                          Yes
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-[13px] font-bold">
                          Sick Leave (SL)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          12
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          Annual Frontload
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          No
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          No
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-[#00B87C]/30 rounded-2xl p-6 dark:bg-[#00B87C]/5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-[#00B87C]" />
                  <h3 className="text-[14px] font-black text-foreground">
                    General Rules
                  </h3>
                </div>
                <ul className="space-y-3 text-[13px] font-bold text-muted-foreground list-disc pl-5">
                  <li>
                    Sick leave of more than 2 consecutive days requires a
                    medical certificate.
                  </li>
                  <li>
                    Earned leave must be applied at least 14 days in advance for
                    requests longer than 5 days.
                  </li>
                  <li>
                    Clubbing of Casual Leave and Earned Leave is not permitted.
                  </li>
                  <li>
                    Comp-off must be availed within 45 days of the worked
                    holiday/weekend.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ APPLY LEAVE MODAL ═══════ */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                    <CalendarX size={20} />
                  </div>
                  <h2 className="text-[18px] font-black text-foreground tracking-tight">
                    Apply for Leave
                  </h2>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                {/* Leave Type Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Leave Type
                  </label>
                  <div className="flex gap-2 p-1 rounded-xl bg-muted border border-border">
                    {(["CL", "EL", "SL", "CO"] as LeaveType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedLeaveType(type)}
                        className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all ${
                          selectedLeaveType === type
                            ? "bg-[#00B87C] text-white shadow-sm"
                            : "text-muted-foreground hover:bg-card/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground"
                    />
                  </div>
                </div>

                {/* Auto Duration & Balance */}
                <div className="bg-[#F0FDF4] border border-[#00B87C]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center dark:bg-[#00B87C]/5">
                  <span className="text-[18px] font-black text-[#00B87C]">
                    3 Working Days
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Excludes weekends & holidays
                  </span>
                  <div className="mt-3 pt-3 border-t border-[#00B87C]/20 w-full text-[12px] font-bold text-[#00B87C]">
                    CL Balance: 6 days →{" "}
                    <span className="font-black">
                      After this: 3 days remaining
                    </span>
                  </div>
                </div>

                {/* Team Overlap */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/30 dark:bg-[#00B87C]/5">
                  <div className="mt-0.5 text-[#00B87C]">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-[#00B87C]">
                      No team members on leave in this period
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                      Your coverage looks good.
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Brief reason for your leave..."
                    className="w-full h-20 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground resize-none"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between p-1">
                  <span className="text-[13px] font-bold text-foreground">
                    Notify Manager
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifyManager((v) => !v)}
                    className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${notifyManager ? "bg-[#00B87C]" : "bg-gray-300"}`}
                  >
                    <div
                      className={`absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-sm transition-all duration-200 ${notifyManager ? "right-1" : "left-1"}`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLeave}
                  className="flex-1 px-6 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Leave Detail Modal */}
      <AnimatePresence>
        {selectedHistoryLeave && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHistoryLeave(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[400px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">
                      {selectedHistoryLeave.typeFull}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {selectedHistoryLeave.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHistoryLeave(null)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "From", val: selectedHistoryLeave.from },
                    { label: "To", val: selectedHistoryLeave.to },
                    {
                      label: "Days",
                      val: `${selectedHistoryLeave.days} day(s)`,
                    },
                    {
                      label: "Applied On",
                      val: selectedHistoryLeave.appliedOn,
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                        {f.label}
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {f.val}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Reason
                  </p>
                  <p className="text-[13px] font-bold text-foreground">
                    {selectedHistoryLeave.reason}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                      selectedHistoryLeave.status === "Approved"
                        ? "bg-emerald-500/10 text-[#00B87C]"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {selectedHistoryLeave.status === "Approved" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <X size={12} />
                    )}
                    {selectedHistoryLeave.status}
                  </span>
                </div>
              </div>
              <div className="p-5 border-t border-border">
                <button
                  onClick={() => setSelectedHistoryLeave(null)}
                  className="w-full py-3 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
