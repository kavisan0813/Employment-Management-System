import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Info,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { LeaveService } from "../../hr/hr-operations/leave/leaveService";
import { ApprovalWorkflowConfig, LeaveRequest } from "../../hr/hr-operations/leave/types";
import { showToast } from "../../../components/workflow/ToastNotification";

type TabType = "Pending" | "Calendar" | "History";

export function ManagerLeaveApprovals() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Pending");

  const [workflowConfig, setWorkflowConfig] = useState<ApprovalWorkflowConfig>(() =>
    LeaveService.getWorkflowConfig(user?.organizationId)
  );

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() =>
    LeaveService.getLeaveRequests(user?.organizationId)
  );

  useEffect(() => {
    const config = LeaveService.getWorkflowConfig(user?.organizationId);
    setWorkflowConfig(config);
    setLeaveRequests(LeaveService.getLeaveRequests(user?.organizationId));
  }, [user?.organizationId]);

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
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Statuses");

  // Requests requiring Manager Action: Must be PENDING, and current active stage must be MANAGER
  const managerPendingRequests = leaveRequests.filter((r) => {
    if (r.status !== "Pending") return false;
    return r.currentStageRole === "MANAGER";
  });

  const historyRequests = leaveRequests.filter((r) => {
    const matchesSearch = r.employee.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus =
      historyStatusFilter === "All Statuses" || r.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string, name: string) => {
    const approverName = user?.name || "Manager";
    const res = LeaveService.approveRequest(
      id,
      approverName,
      "Manager Approved",
      user?.organizationId,
      leaveRequests
    );
    setLeaveRequests(res.updatedRequests);
    showToast(`Leave request for ${name} approved successfully!`);
  };

  const handleReject = (id: string, name: string) => {
    const approverName = user?.name || "Manager";
    const res = LeaveService.rejectRequest(
      id,
      approverName,
      "Manager Rejected",
      user?.organizationId,
      leaveRequests
    );
    setLeaveRequests(res.updatedRequests);
    showToast(`Leave request for ${name} rejected.`);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Team Operations
            </span>
            <ChevronRight size={12} className="text-muted-foreground" />
            <span className="text-xs font-bold text-[#00B87C] uppercase tracking-wider">
              Leave Approvals
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight m-0">
            Manager Leave Approvals
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Active Approval Workflow:{" "}
            <span className="text-[#00B87C] font-extrabold">
              {workflowConfig.layerType} LAYER ({workflowConfig.stages.map((s) => s.role).join(" → ")})
            </span>
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            const csv =
              "Employee,Type,From,To,Days,Status\n" +
              leaveRequests.map((r) => `${r.employee},${r.type},${r.from},${r.to},${r.days},${r.status}`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `manager_leave_report_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 rounded-xl bg-background border border-border hover:bg-secondary text-foreground text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Download size={14} /> Export Team Schedule
        </button>
      </div>

      {/* WORKFLOW LAYER BANNER */}
      {workflowConfig.layerType === "SINGLE" ? (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3">
          <Info className="text-blue-500 shrink-0" size={18} />
          <p className="text-xs text-foreground font-semibold">
            <strong>Single Layer Workflow Active:</strong> Employee leave requests are fully approved at the Team Lead (TL) stage. No secondary Manager sign-off is required.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="text-[#00B87C] shrink-0" size={18} />
          <p className="text-xs text-foreground font-semibold">
            <strong>{workflowConfig.layerType} Layer Workflow Active:</strong> Requests require Team Lead approval first before advancing to Manager stage.
          </p>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        {[
          { id: "Pending", label: `Pending Approvals (${managerPendingRequests.length})`, icon: Clock },
          { id: "Calendar", label: "Team Leave Calendar", icon: CalendarDays },
          { id: "History", label: "Approval History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#00B87C] text-white shadow-md shadow-[#00B87C]/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "Pending" && (
        <div className="space-y-4">
          {managerPendingRequests.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#00B87C] flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-foreground m-0">No Pending Manager Approvals</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                All team leave requests are either processed, waiting for earlier stage approvals, or fully approved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managerPendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:border-[#00B87C]/50 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs"
                          style={{ background: req.avatarColor || "#00B87C" }}
                        >
                          {req.initials}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm m-0">{req.employee}</h4>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {req.department} • {req.team}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {req.type}
                      </span>
                    </div>

                    <div className="bg-secondary/50 p-3 rounded-xl border border-border/50 text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-muted-foreground">Timeline:</span>
                        <span className="text-foreground">{req.from} – {req.to}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="text-[#00B87C]">{req.days} Day(s)</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic bg-background p-2.5 rounded-xl border border-border">
                      "{req.remarks || "No reason specified"}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleReject(req.id, req.employee)}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X size={14} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id, req.employee)}
                      className="flex-1 py-2 rounded-xl bg-[#00B87C] hover:bg-[#009966] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check size={14} /> Approve Stage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Calendar" && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-foreground m-0">Team Availability Grid</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCalendarMonth}
                className="p-2 rounded-xl border border-border hover:bg-secondary text-foreground"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-extrabold text-foreground px-2">{calendarMonth}</span>
              <button
                onClick={handleNextCalendarMonth}
                className="p-2 rounded-xl border border-border hover:bg-secondary text-foreground"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground pt-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 bg-secondary/50 rounded-xl">{day}</div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-16 border border-border/60 rounded-xl p-1.5 text-left flex flex-col justify-between bg-background">
                <span className="text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                {i + 1 === 10 && (
                  <span className="text-[9px] font-bold bg-[#00B87C]/20 text-[#00B87C] p-1 rounded-md truncate">
                    Sneha Patel (Leave)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "History" && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search history by employee..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full sm:w-64 h-9 px-3 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none"
            />
            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs font-semibold bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-border rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-secondary/60 text-muted-foreground font-black text-[11px] uppercase tracking-wider border-b border-border">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4 text-center">Days</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 font-medium">
                    <td className="py-3 px-4 font-bold text-foreground">{r.employee}</td>
                    <td className="py-3 px-4">{r.type}</td>
                    <td className="py-3 px-4">{r.from} – {r.to}</td>
                    <td className="py-3 px-4 text-center font-bold">{r.days}d</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          r.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : r.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
