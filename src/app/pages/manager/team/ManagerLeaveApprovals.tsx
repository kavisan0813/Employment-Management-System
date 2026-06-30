import React, { useState } from "react";
import {
  CalendarOff,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  History,
  Check,
  X,
} from "lucide-react";
import { showToast } from "../../../components/workflow/ToastNotification";

type TabType = "Pending" | "Calendar" | "History";

const MOCK_PENDING_REQUESTS = [
  {
    id: "req-1",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    type: "CL",
    typeLabel: "Casual Leave",
    dateRange: "Apr 10 – Apr 11",
    days: "2 working days",
    reason: "Family function",
    submitted: "2 days ago",
    checks: [
      { text: "Leave balance: 10d remaining", type: "success" },
      { text: "No team overlap", type: "success" },
    ],
  },
  {
    id: "req-2",
    name: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    type: "WFH",
    typeLabel: "Work From Home",
    dateRange: "Apr 8",
    days: "1 working day",
    reason: "Internet at new home",
    submitted: "1 day ago",
    checks: [
      { text: "No deduction", type: "info" },
      { text: "GPS tracking required", type: "warning" },
    ],
  },
  {
    id: "req-3",
    name: "Leo Martinez",
    avatar: "https://i.pravatar.cc/150?u=Leo",
    type: "SL",
    typeLabel: "Sick Leave",
    dateRange: "Apr 7",
    days: "1 working day",
    reason: "Fever",
    submitted: "Just now",
    checks: [
      { text: "Leave balance: 14d remaining", type: "success" },
      { text: "Medical cert req if > 2 days", type: "info" },
    ],
  },
];

const MOCK_HISTORY = [
  {
    id: "h-1",
    emp: "Priya Sharma",
    type: "AL",
    from: "Apr 6",
    to: "Apr 10",
    days: 5,
    reason: "Vacation",
    approvedOn: "Apr 1",
    status: "Approved",
  },
  {
    id: "h-2",
    emp: "Sneha Rao",
    type: "CL",
    from: "Mar 25",
    to: "Mar 25",
    days: 1,
    reason: "Personal work",
    approvedOn: "Mar 23",
    status: "Approved",
  },
  {
    id: "h-3",
    emp: "Leo Martinez",
    type: "WFH",
    from: "Mar 20",
    to: "Mar 21",
    days: 2,
    reason: "Not feeling well",
    approvedOn: "Mar 19",
    status: "Rejected",
  },
  {
    id: "h-4",
    emp: "Aisha Khan",
    type: "SL",
    from: "Mar 10",
    to: "Mar 12",
    days: 3,
    reason: "Viral fever",
    approvedOn: "Mar 10",
    status: "Approved",
  },
  {
    id: "h-5",
    emp: "Dev Patel",
    type: "CL",
    from: "Mar 5",
    to: "Mar 6",
    days: 2,
    reason: "Attending wedding",
    approvedOn: "Mar 2",
    status: "Cancelled",
  },
];

export function ManagerLeaveApprovals() {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const [pendingRequests, setPendingRequests] = useState(MOCK_PENDING_REQUESTS);

  const [calendarMonth, setCalendarMonth] = useState("April 2026");

  const handlePrevCalendarMonth = () => {
    if (calendarMonth === "April 2026") setCalendarMonth("March 2026");
    else if (calendarMonth === "May 2026") setCalendarMonth("April 2026");
  };
  const handleNextCalendarMonth = () => {
    if (calendarMonth === "April 2026") setCalendarMonth("May 2026");
    else if (calendarMonth === "March 2026") setCalendarMonth("April 2026");
  };

  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] =
    useState("All Statuses");

  const filteredHistory = MOCK_HISTORY.filter((row) => {
    const matchesSearch = row.emp
      .toLowerCase()
      .includes(historySearch.toLowerCase());
    const matchesStatus =
      historyStatusFilter === "All Statuses" ||
      row.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    if (activeTab === "History") {
      const headers = [
        "History ID",
        "Employee",
        "Type",
        "From",
        "To",
        "Days",
        "Reason",
        "Approved On",
        "Status",
      ];
      const rows = filteredHistory.map((h) =>
        [
          h.id,
          `"${h.emp}"`,
          h.type,
          `"${h.from}"`,
          `"${h.to}"`,
          h.days,
          `"${h.reason}"`,
          `"${h.approvedOn}"`,
          h.status,
        ].join(","),
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leave_history_export.csv";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Exported!", "success", "Leave history downloaded as CSV.");
    } else {
      const headers = [
        "Request ID",
        "Name",
        "Type",
        "Type Label",
        "Date Range",
        "Days",
        "Reason",
        "Submitted",
      ];
      const rows = pendingRequests.map((r) =>
        [
          r.id,
          `"${r.name}"`,
          r.type,
          `"${r.typeLabel}"`,
          `"${r.dateRange}"`,
          `"${r.days}"`,
          `"${r.reason}"`,
          `"${r.submitted}"`,
        ].join(","),
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pending_leave_requests.csv";
      a.click();
      URL.revokeObjectURL(url);
      showToast(
        "Exported!",
        "success",
        "Pending leave requests downloaded as CSV.",
      );
    }
  };

  // Reject Modal State
  const [rejectingRequest, setRejectingRequest] = useState<
    (typeof MOCK_PENDING_REQUESTS)[0] | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComments, setRejectComments] = useState("");

  const handleApprove = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleConfirmReject = () => {
    if (rejectingRequest) {
      setPendingRequests((prev) =>
        prev.filter((r) => r.id !== rejectingRequest.id),
      );
      setRejectingRequest(null);
      setRejectReason("");
      setRejectComments("");
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "CL":
        return {
          border: "border-l-emerald-500",
          bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        };
      case "SL":
        return {
          border: "border-l-rose-500",
          bg: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
        };
      case "EL":
      case "AL":
        return {
          border: "border-l-teal-500",
          bg: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
        };
      case "WFH":
        return {
          border: "border-l-purple-500",
          bg: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        };
      default:
        return {
          border: "border-l-slate-500",
          bg: "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
        };
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <CalendarOff size={22} className="text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight leading-none text-foreground">
              Leave Approvals
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Review and manage time-off requests for your team
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("Calendar")}
            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2"
          >
            <Calendar size={16} /> View Calendar
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-dashed border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Pending Approval
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-amber-500 leading-none">
              {pendingRequests.length}
            </p>
            <p className="text-sm font-bold text-amber-600/70 mb-0.5">
              requests
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Approved This Month
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-emerald-500 leading-none">
              8
            </p>
            <p className="text-sm font-bold text-emerald-600/70 mb-0.5">
              requests
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            On Leave Today
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-amber-500 leading-none">1</p>
            <p className="text-sm font-bold text-amber-600/70 mb-0.5">
              employee
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-border mb-6">
        {(["Pending", "Calendar", "History"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab === "Pending" && <Clock size={16} />}
            {tab === "Calendar" && <CalendarDays size={16} />}
            {tab === "History" && <History size={16} />}
            {tab} {tab === "Pending" && `(${pendingRequests.length})`}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "Pending" && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Pending Leave Requests
          </h3>
          {pendingRequests.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                All caught up!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no pending leave requests to review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {pendingRequests.map((req) => {
                const styles = getTypeStyles(req.type);
                return (
                  <div
                    key={req.id}
                    className={`bg-card border border-border rounded-xl p-5 shadow-sm border-l-4 ${styles.border} flex flex-col hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow`}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.avatar}
                          alt={req.name}
                          className="w-9 h-9 rounded-full border border-border object-cover"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-foreground">
                            {req.name}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mt-0.5 ${styles.bg}`}
                          >
                            {req.type} • {req.typeLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {req.submitted}
                      </span>
                    </div>

                    {/* Detail Row */}
                    <div className="mb-3 flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-muted-foreground"
                      />
                      <p className="text-sm font-bold text-foreground">
                        {req.dateRange}
                      </p>
                      <span className="text-xs font-medium text-muted-foreground ml-2">
                        ({req.days})
                      </span>
                    </div>

                    {/* Reason Row */}
                    <div className="mb-4 bg-secondary/50 p-3 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                        <span className="font-serif text-xl leading-none text-muted-foreground/40">
                          "
                        </span>
                        {req.reason}
                        <span className="font-serif text-xl leading-none text-muted-foreground/40 translate-y-2">
                          "
                        </span>
                      </p>
                    </div>

                    {/* Policy Checks Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      {req.checks.map((check, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          {check.type === "success" && (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          )}
                          {check.type === "warning" && (
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                          )}
                          {check.type === "info" && (
                            <Clock size={14} className="text-blue-500" />
                          )}
                          <span
                            className={`text-[11px] font-bold ${
                              check.type === "success"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : check.type === "warning"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {check.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Buttons */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <button className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        View Details <ChevronRight size={14} />
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRejectingRequest(req)}
                          className="px-4 py-2 text-sm font-bold text-rose-600 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors active:scale-95"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 shadow-sm transition-colors active:scale-95"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "Calendar" && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">
              {calendarMonth}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCalendarMonth}
                className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCalendarMonth("April 2026")}
                className="px-3 py-1.5 text-sm font-bold border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextCalendarMonth}
                className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-[1px] bg-border border border-border rounded-xl overflow-hidden">
            {/* Days Header */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="bg-secondary p-3 text-center text-xs font-bold uppercase text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {/* Calendar Cells (Mock Data) */}
            {Array.from({ length: 30 }).map((_, i) => {
              const date = i + 1;
              const isToday = date === 15;
              const hasLeave = [6, 7, 8, 9, 10, 25].includes(date);

              return (
                <div
                  key={i}
                  className={`bg-card min-h-[100px] p-2 hover:bg-[#00B87C]/[0.08] transition-colors cursor-pointer group relative ${isToday ? "ring-2 ring-primary inset-0 z-10" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-primary text-white" : "text-foreground group-hover:bg-secondary"}`}
                    >
                      {date}
                    </span>
                  </div>

                  {hasLeave && (
                    <div className="mt-2 space-y-1">
                      {date >= 6 && date <= 10 && (
                        <div className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded truncate border border-emerald-200 dark:border-emerald-800/50">
                          Priya S. (AL)
                        </div>
                      )}
                      {date === 7 && (
                        <div className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[11px] font-bold rounded truncate border border-rose-200 dark:border-rose-800/50">
                          Leo M. (SL)
                        </div>
                      )}
                      {date === 8 && (
                        <div className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[11px] font-bold rounded truncate border border-purple-200 dark:border-purple-800/50">
                          Dev P. (WFH)
                        </div>
                      )}
                      {date === 10 && (
                        <div className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded truncate border border-emerald-200 dark:border-emerald-800/50">
                          Arjun M. (CL)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center text-sm font-medium text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">
              Legend:
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800/50 border border-emerald-300"></div>{" "}
              CL / AL
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rose-200 dark:bg-rose-800/50 border border-rose-300"></div>{" "}
              Sick Leave
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-purple-200 dark:bg-purple-800/50 border border-purple-300"></div>{" "}
              Work From Home
            </div>
          </div>
        </div>
      )}

      {activeTab === "History" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
            <h3 className="text-sm font-bold text-foreground">Leave History</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search employee..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="px-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary"
              />
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b border-border">Employee</th>
                  <th className="px-4 py-3 border-b border-border">Type</th>
                  <th className="px-4 py-3 border-b border-border">From</th>
                  <th className="px-4 py-3 border-b border-border">To</th>
                  <th className="px-4 py-3 border-b border-border">Days</th>
                  <th className="px-4 py-3 border-b border-border">Reason</th>
                  <th className="px-4 py-3 border-b border-border">
                    Approved On
                  </th>
                  <th className="px-4 py-3 border-b border-border text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHistory.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#00B87C]/[0.08] transition-colors group"
                  >
                    <td className="px-4 py-3 font-bold text-foreground">
                      {row.emp}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${getTypeStyles(row.type).bg}`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{row.from}</td>
                    <td className="px-4 py-3 font-medium">{row.to}</td>
                    <td className="px-4 py-3 font-medium">{row.days}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">
                      {row.reason}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.approvedOn}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.status === "Approved" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          <Check size={12} /> Approved
                        </span>
                      )}
                      {row.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                          <X size={12} /> Rejected
                        </span>
                      )}
                      {row.status === "Cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REJECT MODAL OVERLAY */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[400px] bg-card rounded-2xl shadow-2xl border border-border animate-in zoom-in-95">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Reject Leave Request
                </h3>
                <p className="text-sm font-semibold text-muted-foreground mt-1">
                  For{" "}
                  <span className="text-foreground">
                    {rejectingRequest.name}
                  </span>{" "}
                  ({rejectingRequest.type})
                </p>
              </div>
              <button
                onClick={() => setRejectingRequest(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
                  Reason for rejection
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Business critical period",
                    "Insufficient balance",
                    "Team coverage",
                    "Policy violation",
                    "Other",
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
                        rejectReason === reason
                          ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400"
                          : "bg-background text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={rejectComments}
                  onChange={(e) => setRejectComments(e.target.value)}
                  placeholder="Provide more context..."
                  className="w-full h-24 p-3 text-sm bg-background border border-border rounded-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setRejectingRequest(null)}
                className="flex-1 py-2.5 text-sm font-bold bg-secondary text-foreground rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason}
                className="flex-1 py-2.5 text-sm font-bold bg-[#EF4444] text-white rounded-xl hover:bg-rose-600 shadow-sm transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
