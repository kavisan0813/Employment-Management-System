import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { EmployeeLeaves } from "../../employee/EmployeeLeaves";
import { useAuth } from "../../../context/AuthContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  History,
  ShieldAlert,
  CalendarDays,
  LayoutList,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

// Import Modular Components & Service
import { LeaveRequest, LeaveFilterState, ApprovalRole, ApprovalWorkflowConfig } from "./leave/types";
import { LeaveService } from "./leave/leaveService";
import { LeaveFilters } from "./leave/LeaveFilters";
import { LeaveKPICards } from "./leave/LeaveKPICards";
import { LeaveCalendarView } from "./leave/LeaveCalendarView";
import { LeaveDayDetailsModal } from "./leave/LeaveDayDetailsModal";
import { TeamDepartmentMonitoring } from "./leave/TeamDepartmentMonitoring";
import { LeaveAnalyticsView } from "./leave/LeaveAnalyticsView";
import { LeaveTableSection } from "./leave/LeaveTableSection";
import { LeaveApprovalTimeline } from "./leave/LeaveApprovalTimeline";

/* ─── Initial Fallback Data ─────────── */
const initialLeaveData: LeaveRequest[] = [
  {
    id: "LR001",
    employee: "Sneha Patel",
    department: "Engineering",
    team: "Platform Team",
    initials: "SP",
    avatarColor: "linear-gradient(135deg, #059669, #047857)",
    type: "Annual Leave",
    from: "Apr 10",
    to: "Apr 12",
    days: 3,
    managerApproval: "Approved",
    hrApproval: "Pending",
    status: "Pending",
    criticalRole: true,
    conflictWarning: "Overlaps with Ravi Kumar (Eng)",
    remarks: "Taking some time off for family vacation.",
    submissionDate: "2026-04-19T09:00:00Z",
    policyViolations: ["Critical Role Conflict"],
    balance: {
      annual: 12,
      sick: 8,
      casual: 4,
      unpaid: 0,
    },
    summary: {
      takenThisYear: 5,
      lastLeaveDate: "Jan 15, 2026",
      sickFrequency: "Low",
    },
    history: [
      {
        date: "Apr 2, 09:00 AM",
        action: "Submitted",
        by: "Sneha Patel",
      },
      {
        date: "Apr 3, 10:15 AM",
        action: "Team Lead Approved",
        by: "David Lee",
        comment: "Have a good trip!",
      },
    ],
  },
  {
    id: "LR002",
    employee: "Ravi Kumar",
    department: "Engineering",
    team: "Frontend Team",
    initials: "RK",
    avatarColor: "linear-gradient(135deg, #14B8A6, #0D9488)",
    type: "Sick Leave",
    from: "Apr 8",
    to: "Apr 8",
    days: 1,
    managerApproval: "Approved",
    hrApproval: "Approved",
    status: "Approved",
    remarks: "Not feeling well today.",
    submissionDate: "2026-04-08T08:00:00Z",
    attachmentCount: 1,
    balance: {
      annual: 15,
      sick: 7,
      casual: 5,
      unpaid: 0,
    },
    summary: {
      takenThisYear: 2,
      lastLeaveDate: "Mar 10, 2026",
      sickFrequency: "Medium",
    },
    history: [
      {
        date: "Apr 8, 08:00 AM",
        action: "Submitted",
        by: "Ravi Kumar",
      },
      {
        date: "Apr 8, 08:30 AM",
        action: "Team Lead Approved",
        by: "David Lee",
      },
      {
        date: "Apr 8, 09:00 AM",
        action: "Manager Approved",
        by: "Sarah Connor",
      },
    ],
  },
  {
    id: "LR003",
    employee: "Meera Thomas",
    department: "Design",
    team: "UI/UX Team",
    initials: "MT",
    avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
    type: "Casual Leave",
    from: "Apr 15",
    to: "Apr 16",
    days: 2,
    managerApproval: "Pending",
    hrApproval: "Pending",
    status: "Pending",
    remarks: "Personal errands.",
    submissionDate: "2026-04-12T14:00:00Z",
    policyViolations: ["Late Request"],
    balance: {
      annual: 10,
      sick: 10,
      casual: 2,
      unpaid: 1,
    },
    summary: {
      takenThisYear: 8,
      lastLeaveDate: "Feb 20, 2026",
      sickFrequency: "Low",
    },
    history: [
      {
        date: "Apr 12, 14:00 PM",
        action: "Submitted",
        by: "Meera Thomas",
      },
    ],
  },
  {
    id: "LR004",
    employee: "Vikram Singh",
    department: "Sales",
    team: "Sales Core",
    initials: "VS",
    avatarColor: "linear-gradient(135deg, #22C55E, #16A34A)",
    type: "Annual Leave",
    from: "Apr 20",
    to: "Apr 25",
    days: 6,
    managerApproval: "Approved",
    hrApproval: "Approved",
    status: "Approved",
    remarks: "Pre-planned long vacation.",
    submissionDate: "2026-03-20T11:00:00Z",
    balance: {
      annual: 20,
      sick: 10,
      casual: 5,
      unpaid: 0,
    },
    summary: {
      takenThisYear: 0,
      lastLeaveDate: "None",
      sickFrequency: "None",
    },
    history: [
      {
        date: "Mar 20, 11:00 AM",
        action: "Submitted",
        by: "Vikram Singh",
      },
      {
        date: "Mar 21, 10:00 AM",
        action: "Team Lead Approved",
        by: "Alice Wang",
      },
      {
        date: "Mar 22, 15:00 PM",
        action: "Manager Approved",
        by: "Sarah Connor",
      },
    ],
  },
  {
    id: "LR006",
    employee: "Rahul Sharma",
    department: "Support",
    team: "Support Ops",
    initials: "RS",
    avatarColor: "linear-gradient(135deg, #EF4444, #DC2626)",
    type: "Sick Leave",
    from: "Apr 9",
    to: "Apr 10",
    days: 2,
    managerApproval: "Rejected",
    hrApproval: "Pending",
    status: "Rejected",
    criticalRole: true,
    remarks: "Sudden illness.",
    submissionDate: "2026-04-09T07:30:00Z",
    attachmentCount: 1,
    balance: {
      annual: 14,
      sick: 5,
      casual: 3,
      unpaid: 0,
    },
    summary: {
      takenThisYear: 4,
      lastLeaveDate: "Mar 15, 2026",
      sickFrequency: "High",
    },
    history: [
      {
        date: "Apr 9, 07:30 AM",
        action: "Submitted",
        by: "Rahul Sharma",
      },
      {
        date: "Apr 9, 08:00 AM",
        action: "Team Lead Rejected",
        by: "John Doe",
        comment: "Please find coverage first, shift is highly critical.",
      },
    ],
  },
  {
    id: "LR007",
    employee: "Anita Desai",
    department: "Marketing",
    team: "Growth Marketing",
    initials: "AD",
    avatarColor: "linear-gradient(135deg, #0EA5E9, #0369A1)",
    type: "Annual Leave",
    from: "Apr 22",
    to: "Apr 24",
    days: 3,
    managerApproval: "Approved",
    hrApproval: "Pending",
    status: "Pending",
    remarks: "Attending a wedding.",
    submissionDate: "2026-04-14T09:30:00Z",
    policyViolations: ["Insufficient Balance"],
    balance: {
      annual: 2,
      sick: 10,
      casual: 5,
      unpaid: 0,
    },
    summary: {
      takenThisYear: 18,
      lastLeaveDate: "Mar 28, 2026",
      sickFrequency: "Low",
    },
    history: [
      {
        date: "Apr 14, 09:30 AM",
        action: "Submitted",
        by: "Anita Desai",
      },
      {
        date: "Apr 14, 11:00 AM",
        action: "Team Lead Approved",
        by: "Chloe Kim",
      },
    ],
  },
];

/* ─── Detail Drawer Component ─── */
function LeaveDetailDrawer({
  request,
  workflowConfig,
  onClose,
  onApprove,
  onReject,
  canApprove,
}: {
  request: LeaveRequest;
  workflowConfig: ApprovalWorkflowConfig;
  onClose: () => void;
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, comment?: string) => void;
  canApprove: boolean;
}) {
  const [remarkInput, setRemarkInput] = useState("");

  const currentStageRole = request.currentStageRole || "TL";

  return (
    <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">
            Leave Request {request.id}
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Submitted by {request.employee}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Employee Info Card */}
        <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-2xl border border-border/50">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: request.avatarColor }}
          >
            {request.initials}
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-base">
              {request.employee}
            </h3>
            <p className="text-xs text-muted-foreground font-semibold">
              {request.department} • {request.team}
            </p>
          </div>
        </div>

        {/* DYNAMIC WORKFLOW APPROVAL TIMELINE COMPONENT */}
        <LeaveApprovalTimeline request={request} workflowConfig={workflowConfig} />

        {/* Warning Badges */}
        {request.policyViolations && request.policyViolations.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <ShieldAlert size={16} />
              <span>Policy Violations & Coverage Conflicts</span>
            </div>
            <ul className="list-disc list-inside text-xs text-muted-foreground font-medium space-y-1">
              {request.policyViolations.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Request Details Grid */}
        <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-2xl border border-border">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Leave Type
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {request.type}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Duration
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {request.days} Day{request.days > 1 ? "s" : ""}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-border/50">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Timeline Window
            </span>
            <span className="text-sm font-extrabold text-[#00B87C]">
              {request.from} – {request.to}
            </span>
          </div>
        </div>

        {/* Current Balance Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Current Entitlement Balances
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/40 p-3 rounded-xl border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground block">Annual Leave</span>
              <span className="text-base font-extrabold text-foreground">{request.balance.annual} days</span>
            </div>
            <div className="bg-secondary/40 p-3 rounded-xl border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground block">Sick Leave</span>
              <span className="text-base font-extrabold text-foreground">{request.balance.sick} days</span>
            </div>
          </div>
        </div>

        {/* Reason / Remarks */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Employee Remarks
          </h4>
          <p className="text-xs text-foreground bg-background p-3 rounded-xl border border-border font-medium leading-relaxed">
            {request.remarks || "No additional remarks provided."}
          </p>
        </div>

        {/* Action Remarks Input */}
        {canApprove && request.status === "Pending" && (
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Approver Remarks / Note for Stage ({currentStageRole})
            </label>
            <textarea
              rows={2}
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              placeholder="Add review notes or comments..."
              className="w-full text-xs p-3 bg-background border border-border rounded-xl focus:border-[#00B87C] outline-none text-foreground"
            />
          </div>
        )}
      </div>

      {/* Drawer Action Bar */}
      {canApprove && request.status === "Pending" && (
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center gap-3">
          <button
            onClick={() => {
              onReject(request.id, remarkInput);
              onClose();
            }}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Reject Request
          </button>
          <button
            onClick={() => {
              onApprove(request.id, remarkInput);
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#00B87C] hover:bg-[#009966] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Approve {currentStageRole} Stage
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main LeaveManagement Component ─── */
export function LeaveManagement() {
  const { user } = useAuth();
  const { hasPermissionKey, primaryRoleName } = usePermissions();

  // Active Tenant Workflow Configuration
  const [workflowConfig, setWorkflowConfig] = useState<ApprovalWorkflowConfig>(() =>
    LeaveService.getWorkflowConfig(user?.organizationId)
  );

  // Tenant-scoped Leave Requests state
  const [requests, setRequests] = useState<LeaveRequest[]>(() =>
    LeaveService.getLeaveRequests(user?.organizationId, initialLeaveData)
  );

  useEffect(() => {
    const config = LeaveService.getWorkflowConfig(user?.organizationId);
    setWorkflowConfig(config);
    setRequests(LeaveService.getLeaveRequests(user?.organizationId, initialLeaveData));
  }, [user?.organizationId]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // View Mode State: "calendar" or "table"
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");

  // 8-Axis Filters state
  const [filters, setFilters] = useState<LeaveFilterState>({
    month: 3, // April
    year: 2026,
    department: "All",
    team: "All",
    employee: "All",
    leaveType: "All",
    status: "All",
    search: "",
    approvalStage: "All",
    conflictOnly: false,
    criticalOnly: false,
  });

  // Calendar Day Click Drawer/Modal state
  const [clickedDateModal, setClickedDateModal] = useState<{
    dateStr: string;
    leaves: LeaveRequest[];
  } | null>(null);

  // UI Modals state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"CSV" | "Excel" | "PDF">("Excel");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const canApprove =
    hasPermissionKey(P.LEAVE_APPROVE) ||
    hasPermissionKey(P.LEAVE_MANAGE) ||
    hasPermissionKey(P.LEAVE_FULL) ||
    hasPermissionKey(P.LEAVE_APPROVE_TEAM) ||
    hasPermissionKey(P.LEAVE_APPROVE_DEPT);

  // Filter lists derived from dataset
  const departments = Array.from(new Set(requests.map((r) => r.department)));
  const teams = Array.from(new Set(requests.map((r) => r.team)));
  const employees = Array.from(new Set(requests.map((r) => r.employee)));
  const leaveTypes = Array.from(new Set(requests.map((r) => r.type)));

  // Filter requests based on active 8-axis filters
  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      filters.search === "" ||
      r.employee.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.department.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.team.toLowerCase().includes(filters.search.toLowerCase());

    const matchDept = filters.department === "All" || r.department === filters.department;
    const matchTeam = filters.team === "All" || r.team === filters.team;
    const matchEmp = filters.employee === "All" || r.employee === filters.employee;
    const matchType = filters.leaveType === "All" || r.type === filters.leaveType;
    const matchStatus = filters.status === "All" || r.status === filters.status;

    return matchSearch && matchDept && matchTeam && matchEmp && matchType && matchStatus;
  });

  // Clean up selectedIds that are no longer in visible filtered dataset (Selection Safety)
  useEffect(() => {
    const visibleIds = filteredRequests.map((r) => r.id);
    const visibleIdSet = new Set(visibleIds);
    setSelectedIds((prev) => prev.filter((id) => visibleIdSet.has(id)));
  }, [filters, filteredRequests]);

  // Permission Guard
  if (!hasPermissionKey(P.LEAVE_VIEW) && !hasPermissionKey(P.LEAVE_FULL)) {
    return <EmployeeLeaves />;
  }

  // Action handlers
  const handleFilterChange = (updated: Partial<LeaveFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      month: 3,
      year: 2026,
      department: "All",
      team: "All",
      employee: "All",
      leaveType: "All",
      status: "All",
      search: "",
      approvalStage: "All",
      conflictOnly: false,
      criticalOnly: false,
    });
  };

  const handleApprove = (id: string, comment?: string) => {
    if (!canApprove) return;
    const approverName = user?.name || "HR Admin";
    const res = LeaveService.approveRequest(id, approverName, comment, user?.organizationId, requests);
    setRequests(res.updatedRequests);
    if (res.updatedReq && selectedRequest?.id === id) {
      setSelectedRequest(res.updatedReq);
    }
  };

  const handleReject = (id: string, comment?: string) => {
    if (!canApprove) return;
    const approverName = user?.name || "HR Admin";
    const res = LeaveService.rejectRequest(id, approverName, comment, user?.organizationId, requests);
    setRequests(res.updatedRequests);
    if (res.updatedReq && selectedRequest?.id === id) {
      setSelectedRequest(res.updatedReq);
    }
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredRequests.map((r) => r.id);
    const visibleIdSet = new Set(visibleIds);
    const selectedIdSet = new Set(selectedIds);
    const allVisibleSelected = visibleIds.every((id) => selectedIdSet.has(id));

    if (allVisibleSelected) {
      // Deselect all visible filtered IDs
      setSelectedIds((prev) => prev.filter((id) => !visibleIdSet.has(id)));
    } else {
      // Select all visible filtered IDs
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportData = () => {
    const selectedIdSet = new Set(selectedIds);
    const dataToExport =
      selectedIds.length > 0
        ? requests.filter((r) => selectedIdSet.has(r.id))
        : filteredRequests;

    if (exportFormat === "PDF") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const rowsHtml = dataToExport
          .map(
            (r) => `<tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0;"><b>${r.employee}</b></td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.department}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.type}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.from} - ${r.to}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${r.days}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${r.status}</td>
            </tr>`
          )
          .join("");
        printWindow.document.write(
          DOMPurify.sanitize(
            `<html>
              <head>
                <title>Leave Report</title>
                <style>
                  body { font-family: sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                  th { background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
                </style>
              </head>
              <body>
                <h2>Leave Management Report</h2>
                <p>Generated: ${new Date().toLocaleDateString()} | Total Records: ${dataToExport.length}</p>
                <table>
                  <thead>
                    <tr><th>Employee</th><th>Department</th><th>Type</th><th>Timeline</th><th>Days</th><th>Status</th></tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
                <script>window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 500); }</script>
              </body>
            </html>`,
            { ADD_TAGS: ["html", "head", "body", "style", "title", "script"], ADD_ATTR: ["style"] }
          )
        );
        printWindow.document.close();
      }
    } else {
      const content =
        "Employee,Department,Team,Type,From,To,Days,Status\n" +
        dataToExport
          .map((r) => `${r.employee},${r.department},${r.team},${r.type},${r.from},${r.to},${r.days},${r.status}`)
          .join("\n");
      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leave_report_${new Date().toISOString().split("T")[0]}.${exportFormat.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setIsExportOpen(false);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-12 space-y-6 animate-in fade-in duration-500">
      {/* ═══════ 1. PAGE HEADER & ACTIONS ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <CalendarIcon size={22} className="text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight leading-none">
              Leave Management
            </h1>
            <p className="text-[13px] font-semibold text-[#6B7280] mt-1">
              Active Workflow: <span className="text-[#00B87C] font-extrabold">{workflowConfig.layerType} LAYER</span> ({workflowConfig.stages.map(s => s.role).join(" → ")})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle: Calendar | Table */}
          <div className="flex items-center p-1 h-10 rounded-xl border bg-card shadow-xs" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-[#00B87C]/15 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays size={15} />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#00B87C]/15 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList size={15} />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="px-5 py-2.5 h-10 rounded-xl bg-[#00B87C] hover:bg-[#009966] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      {/* ═══════ 2. LEAVE KPI / SUMMARY CARDS ═══════ */}
      <LeaveKPICards requests={filteredRequests} />

      {/* ═══════ 3. FILTER BAR ═══════ */}
      <LeaveFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenExport={() => setIsExportOpen(true)}
        departments={departments}
        teams={teams}
        employees={employees}
        leaveTypes={leaveTypes}
      />

      {/* ═══════ 4. COMBINED LEAVE RECORDS & CALENDAR SECTION ═══════ */}
      {viewMode === "calendar" ? (
        <LeaveCalendarView
          requests={filteredRequests}
          month={filters.month}
          year={filters.year}
          onMonthChange={(m) => handleFilterChange({ month: m })}
          onYearChange={(y) => handleFilterChange({ year: y })}
          onDateClick={(dateStr, leaves) => setClickedDateModal({ dateStr, leaves })}
        />
      ) : (
        <LeaveTableSection
          requests={filteredRequests}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectRow={handleToggleSelectRow}
          onSelectRequest={(req) => setSelectedRequest(req)}
          onApprove={(id) => handleApprove(id, "Stage Approved")}
          onReject={(id) => handleReject(id, "Stage Rejected")}
          canApprove={canApprove}
        />
      )}

      {/* ═══════ 5. TEAM & DEPARTMENT MONITORING ═══════ */}
      <TeamDepartmentMonitoring
        requests={filteredRequests}
        selectedDepartment={filters.department}
        selectedTeam={filters.team}
      />

      {/* ═══════ 6. LEAVE ANALYTICS / GRAPHS ═══════ */}
      <LeaveAnalyticsView requests={filteredRequests} />

      {/* ═══════ DETAIL DRAWER ═══════ */}
      {selectedRequest && (
        <LeaveDetailDrawer
          request={selectedRequest}
          workflowConfig={workflowConfig}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          canApprove={canApprove}
        />
      )}

      {/* ═══════ CALENDAR DAY DETAILS MODAL ═══════ */}
      {clickedDateModal && (
        <LeaveDayDetailsModal
          dateStr={clickedDateModal.dateStr}
          leaves={clickedDateModal.leaves}
          onClose={() => setClickedDateModal(null)}
          onSelectLeave={(req) => setSelectedRequest(req)}
        />
      )}

      {/* ═══════ EXPORT REPORT MODAL ═══════ */}
      {isExportOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-black text-foreground uppercase tracking-wider">
                Export Leave Report
              </h3>
              <button onClick={() => setIsExportOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["CSV", "Excel", "PDF"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      exportFormat === fmt
                        ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExportOpen(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                className="px-5 py-2 rounded-xl bg-[#00B87C] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#009966]"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ APPLY LEAVE MODAL ═══════ */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-black text-foreground uppercase tracking-wider">
                Apply Leave
              </h3>
              <button onClick={() => setIsNewRequestOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newReq: LeaveRequest = {
                  id: `LR00${requests.length + 1}`,
                  employee: (formData.get("employee") as string) || "Sneha Patel",
                  department: "Engineering",
                  team: "Platform Team",
                  initials: "SP",
                  avatarColor: "linear-gradient(135deg, #059669, #047857)",
                  type: (formData.get("type") as string) || "Annual Leave",
                  from: (formData.get("from") as string) || "May 1",
                  to: (formData.get("to") as string) || "May 3",
                  days: 3,
                  managerApproval: "Pending",
                  hrApproval: "Pending",
                  status: "Pending",
                  remarks: (formData.get("remarks") as string) || "Applied via HR Admin portal.",
                  submissionDate: new Date().toISOString(),
                  balance: { annual: 10, sick: 10, casual: 5, unpaid: 0 },
                  summary: { takenThisYear: 3, lastLeaveDate: "Apr 2, 2026", sickFrequency: "Low" },
                  history: [{ date: "Just now", action: "Submitted", by: "Admin" }],
                };
                const normalized = LeaveService.normalizeRequest(newReq, workflowConfig);
                const updatedList = [normalized, ...requests];
                setRequests(updatedList);
                LeaveService.saveLeaveRequests(updatedList, user?.organizationId);
                setIsNewRequestOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Employee
                </label>
                <select
                  name="employee"
                  className="w-full h-10 px-3 text-xs font-bold bg-background border border-border rounded-xl text-foreground focus:border-[#00B87C] outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Leave Type
                  </label>
                  <select
                    name="type"
                    className="w-full h-10 px-3 text-xs font-bold bg-background border border-border rounded-xl text-foreground focus:border-[#00B87C] outline-none"
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    name="from"
                    defaultValue="May 1"
                    placeholder="May 1"
                    className="w-full h-10 px-3 text-xs font-bold bg-background border border-border rounded-xl text-foreground focus:border-[#00B87C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Remarks / Reason
                </label>
                <textarea
                  name="remarks"
                  rows={3}
                  placeholder="Enter reason for leave request..."
                  className="w-full p-3 text-xs font-bold bg-background border border-border rounded-xl text-foreground focus:border-[#00B87C] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B87C] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#009966] cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
