import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CalendarX,
  Plus,
  X,
  FileText,
  MoreVertical,
  CheckCircle2,
  Info,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
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
import { showToast } from "../../../components/workflow/ToastNotification";

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

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  CL: "Casual Leave",
  EL: "Earned Leave",
  SL: "Sick Leave",
  CO: "Comp Off",
};

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  CL: "#00B87C",
  EL: "#0EA5E9",
  SL: "#EF4444",
  CO: "#8B5CF6",
};

export function FinanceLeaves() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LeaveTab>("My Requests");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal state
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>("CL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [notifyManager, setNotifyManager] = useState(true);

  // History filter
  const [historyFilter, setHistoryFilter] = useState<
    "All" | "Approved" | "Rejected"
  >("All");

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

  // Mock Data
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

  const historyLeaves: LeaveRecord[] = [
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
    {
      id: "LR-0650",
      type: "SL",
      typeFull: "Sick Leave",
      from: "Dec 01, 2025",
      to: "Dec 02, 2025",
      days: 2,
      reason: "Medical check-up",
      status: "Rejected",
      appliedOn: "Nov 30, 2025",
    },
  ];

  const filteredHistory =
    historyFilter === "All"
      ? historyLeaves
      : historyLeaves.filter((l) => l.status === historyFilter);

  const handleCancelRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setShowCancelConfirm(null);
    showToast(
      "Request Cancelled",
      "success",
      "Leave request has been cancelled.",
    );
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
    const newRequest: LeaveRecord = {
      id: `LR-${Date.now()}`,
      type: selectedLeaveType,
      typeFull: LEAVE_TYPE_LABELS[selectedLeaveType],
      from: new Date(fromDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      to: new Date(toDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      days: Math.max(
        1,
        Math.ceil(
          (new Date(toDate).getTime() - new Date(fromDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1,
      ),
      reason: leaveReason,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setPendingRequests((prev) => [newRequest, ...prev]);
    setIsApplyModalOpen(false);
    setFromDate("");
    setToDate("");
    setLeaveReason("");
    setSelectedLeaveType("CL");
    showToast(
      "Leave Applied",
      "success",
      `${LEAVE_TYPE_LABELS[selectedLeaveType]} request submitted successfully.`,
    );
  };

  const computedDays =
    fromDate && toDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(toDate).getTime() - new Date(fromDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1,
        )
      : 0;

  const leaveBalances: Record<LeaveType, { used: number; total: number }> = {
    CL: { used: 6, total: 12 },
    EL: { used: 6, total: 24 },
    SL: { used: 4, total: 12 },
    CO: { used: 3, total: 5 },
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const csvContent = [
                "ID,Type,From,To,Days,Reason,Status,Applied On",
                ...historyLeaves.map(
                  (l) =>
                    `${l.id},${l.typeFull},${l.from},${l.to},${l.days},"${l.reason}",${l.status},${l.appliedOn}`,
                ),
              ].join("\n");
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "leave_history.csv";
              a.click();
              showToast(
                "Exported",
                "success",
                "Leave history downloaded as CSV.",
              );
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all"
          >
            <Download size={16} />
            Export
          </button>
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
        {(["CL", "EL", "SL", "CO"] as LeaveType[]).map((type) => {
          const bal = leaveBalances[type];
          const remaining = bal.total - bal.used;
          const pct = Math.round((remaining / bal.total) * 100);
          const color = LEAVE_TYPE_COLORS[type];
          const typeLabels: Record<LeaveType, string> = {
            CL: "CASUAL LEAVE",
            EL: "EARNED LEAVE",
            SL: "SICK LEAVE",
            CO: "COMP OFF",
          };
          return (
            <div
              key={type}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#00B87C]/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {type}
                </div>
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  {typeLabels[type]}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span
                  className="text-[32px] font-black tracking-tight leading-none"
                  style={{ color }}
                >
                  {remaining}
                </span>
                <span className="text-[16px] font-bold text-muted-foreground mb-1">
                  / {bal.total} days
                </span>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <p className="text-[12px] font-bold text-muted-foreground mt-2">
                  {bal.used} days used this year
                </p>
              </div>
            </div>
          );
        })}
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
                        className={`absolute left-0 top-0 bottom-0 w-1`}
                        style={{ backgroundColor: LEAVE_TYPE_COLORS[req.type] }}
                      />

                      <div className="flex items-start md:items-center gap-4 pl-2">
                        <div
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border`}
                          style={{
                            backgroundColor: `${LEAVE_TYPE_COLORS[req.type]}15`,
                            color: LEAVE_TYPE_COLORS[req.type],
                            borderColor: `${LEAVE_TYPE_COLORS[req.type]}30`,
                          }}
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
                      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2
                          size={24}
                          className="text-muted-foreground/30"
                        />
                      </div>
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
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border bg-sky-500/10 text-sky-600 border-sky-500/20">
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
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1.5 rounded-lg border border-border text-[12px] font-bold uppercase hover:bg-muted text-foreground tracking-widest transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
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

                    const calendarDays = eachDayOfInterval({
                      start: startDate,
                      end: endDate,
                    });

                    return calendarDays.map((calDay, i) => {
                      const formattedDate = format(calDay, "d");
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
            <div className="animate-in fade-in duration-300 space-y-4">
              {/* Filter chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {(["All", "Approved", "Rejected"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${
                      historyFilter === f
                        ? "bg-[#00B87C] text-white border-[#00B87C]"
                        : "bg-card text-muted-foreground border-border hover:border-[#00B87C]/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <span className="text-[12px] font-bold text-muted-foreground ml-2">
                  {filteredHistory.length} records
                </span>
              </div>

              <div className="overflow-x-auto">
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
                    {filteredHistory.map((leave) => (
                      <tr
                        key={leave.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: LEAVE_TYPE_COLORS[leave.type],
                              }}
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
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-12 text-center text-[13px] font-bold text-muted-foreground"
                        >
                          No {historyFilter.toLowerCase()} leave records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                      <tr>
                        <td className="py-3 px-4 text-[13px] font-bold">
                          Comp Off (CO)
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          5
                        </td>
                        <td className="py-3 px-4 text-[13px] font-bold text-muted-foreground">
                          On Request
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
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground bg-transparent transition-colors"
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
                            ? "text-white shadow-sm"
                            : "text-muted-foreground hover:bg-card/50"
                        }`}
                        style={
                          selectedLeaveType === type
                            ? { backgroundColor: LEAVE_TYPE_COLORS[type] }
                            : {}
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground ml-1">
                    {LEAVE_TYPE_LABELS[selectedLeaveType]} — Balance:{" "}
                    <span className="text-foreground font-black">
                      {leaveBalances[selectedLeaveType].total -
                        leaveBalances[selectedLeaveType].used}{" "}
                      days remaining
                    </span>
                  </p>
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
                      className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground transition-colors"
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
                      min={fromDate}
                      className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground transition-colors"
                    />
                  </div>
                </div>

                {/* Auto Duration & Balance */}
                <div className="bg-[#F0FDF4] border border-[#00B87C]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center dark:bg-[#00B87C]/5">
                  <span className="text-[18px] font-black text-[#00B87C]">
                    {computedDays > 0
                      ? `${computedDays} Working Day${computedDays !== 1 ? "s" : ""}`
                      : "Select dates above"}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Excludes weekends & holidays
                  </span>
                  {computedDays > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#00B87C]/20 w-full text-[12px] font-bold text-[#00B87C]">
                      {selectedLeaveType} Balance:{" "}
                      {leaveBalances[selectedLeaveType].total -
                        leaveBalances[selectedLeaveType].used}{" "}
                      days →{" "}
                      <span className="font-black">
                        After this:{" "}
                        {Math.max(
                          0,
                          leaveBalances[selectedLeaveType].total -
                            leaveBalances[selectedLeaveType].used -
                            computedDays,
                        )}{" "}
                        days remaining
                      </span>
                    </div>
                  )}
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
                    className="w-full h-20 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground resize-none transition-colors"
                  />
                </div>

                {/* Notify Manager Toggle */}
                <div className="flex items-center justify-between p-1">
                  <span className="text-[13px] font-bold text-foreground">
                    Notify Manager
                  </span>
                  <button
                    onClick={() => setNotifyManager(!notifyManager)}
                    className={`w-10 h-6 rounded-full relative transition-all duration-300 ${notifyManager ? "bg-[#00B87C]" : "bg-muted"}`}
                  >
                    <div
                      className={`absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-sm transition-all duration-300 ${notifyManager ? "right-1" : "left-1"}`}
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
                  disabled={!fromDate || !toDate}
                  className="flex-1 px-6 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
