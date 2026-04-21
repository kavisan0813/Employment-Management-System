import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  CalendarDays,
  BarChart2,
  Users,
  FileText,
  CheckCircle2,
  MoreVertical,
  Activity,
  Download,
  ChevronDown,
  Paperclip,
  History,
  UserPlus,
  ShieldAlert,
  ListFilter,
  Trash,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
type ApprovalStatus = "Pending" | "Approved" | "Rejected";

interface LeaveHistory {
  date: string;
  action: string;
  by: string;
  comment?: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  initials: string;
  avatarColor: string;
  type: string;
  from: string;
  to: string;
  days: number;
  managerApproval: ApprovalStatus;
  hrApproval: ApprovalStatus;
  status: ApprovalStatus;
  criticalRole?: boolean;
  conflictWarning?: string;
  history: LeaveHistory[];
  remarks: string;
  // New Enhanced Fields
  submissionDate: string; // ISO string for aging calc
  appliedBy?: string;
  attachmentCount?: number;
  policyViolations?: string[];
  balance: {
    annual: number;
    sick: number;
    casual: number;
    unpaid: number;
  };
  summary: {
    takenThisYear: number;
    lastLeaveDate: string;
    sickFrequency: string;
  };
  escalated?: boolean;
}

/* ─── Mock Data ─────────── */
const leaveData: LeaveRequest[] = [
  {
    id: "LR001",
    employee: "Sneha Patel",
    department: "Engineering",
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
    balance: { annual: 12, sick: 8, casual: 4, unpaid: 0 },
    summary: { takenThisYear: 5, lastLeaveDate: "Jan 15, 2026", sickFrequency: "Low" },
    history: [
      { date: "Apr 2, 09:00 AM", action: "Submitted", by: "Sneha Patel" },
      { date: "Apr 3, 10:15 AM", action: "Manager Approved", by: "David Lee", comment: "Have a good trip!" }
    ]
  },
  {
    id: "LR002",
    employee: "Ravi Kumar",
    department: "Engineering",
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
    balance: { annual: 15, sick: 7, casual: 5, unpaid: 0 },
    summary: { takenThisYear: 2, lastLeaveDate: "Mar 10, 2026", sickFrequency: "Medium" },
    history: [
      { date: "Apr 8, 08:00 AM", action: "Submitted", by: "Ravi Kumar" },
      { date: "Apr 8, 08:30 AM", action: "Manager Approved", by: "David Lee" },
      { date: "Apr 8, 09:00 AM", action: "HR Approved", by: "Sarah Connor" }
    ]
  },
  {
    id: "LR003",
    employee: "Meera Thomas",
    department: "Design",
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
    balance: { annual: 10, sick: 10, casual: 2, unpaid: 1 },
    summary: { takenThisYear: 8, lastLeaveDate: "Feb 20, 2026", sickFrequency: "Low" },
    history: [
      { date: "Apr 12, 14:00 PM", action: "Submitted", by: "Meera Thomas" }
    ]
  },
  {
    id: "LR004",
    employee: "Vikram Singh",
    department: "Sales",
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
    balance: { annual: 20, sick: 10, casual: 5, unpaid: 0 },
    summary: { takenThisYear: 0, lastLeaveDate: "None", sickFrequency: "None" },
    history: [
      { date: "Mar 20, 11:00 AM", action: "Submitted", by: "Vikram Singh" },
      { date: "Mar 21, 10:00 AM", action: "Manager Approved", by: "Alice Wang" },
      { date: "Mar 22, 15:00 PM", action: "HR Approved", by: "Sarah Connor" }
    ]
  },
  {
    id: "LR006",
    employee: "Rahul Sharma",
    department: "Support",
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
    balance: { annual: 14, sick: 5, casual: 3, unpaid: 0 },
    summary: { takenThisYear: 4, lastLeaveDate: "Mar 15, 2026", sickFrequency: "High" },
    history: [
      { date: "Apr 9, 07:30 AM", action: "Submitted", by: "Rahul Sharma" },
      { date: "Apr 9, 08:00 AM", action: "Manager Rejected", by: "John Doe", comment: "Please find coverage first, shift is highly critical." }
    ]
  },
  {
    id: "LR007",
    employee: "Anita Desai",
    department: "Marketing",
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
    balance: { annual: 2, sick: 10, casual: 5, unpaid: 0 },
    summary: { takenThisYear: 18, lastLeaveDate: "Mar 28, 2026", sickFrequency: "Low" },
    history: [
      { date: "Apr 14, 09:30 AM", action: "Submitted", by: "Anita Desai" },
      { date: "Apr 14, 11:00 AM", action: "Manager Approved", by: "Chloe Kim" }
    ]
  }
];

/* ─── Status Config ─────────────────────── */
const STATUS_CONFIG: Record<ApprovalStatus, { bg: string; color: string; icon: React.ElementType; label: string }> = {
  Pending: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", icon: Clock, label: "Pending" },
  Approved: { bg: "var(--secondary)", color: "var(--primary)", icon: Check, label: "Approved" },
  Rejected: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", icon: X, label: "Rejected" },
};

/* ─── Leave Analytics Mock Data ─────────── */
const leaveDistribution = [
  { type: "Annual Leave", value: 45, color: "#059669" },
  { type: "Sick Leave", value: 25, color: "#14B8A6" },
  { type: "Casual Leave", value: 20, color: "#F59E0B" },
  { type: "Maternity", value: 10, color: "#A78BFA" },
];

/* ─── Components ─────────────────────────── */

function StatusBadge({ status, small = false }: { status: ApprovalStatus; small?: boolean }) {
  const sc = STATUS_CONFIG[status];
  const Icon = sc.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}
      style={{ backgroundColor: sc.bg, color: sc.color }}
    >
      <Icon size={small ? 10 : 12} />
      {sc.label}
    </span>
  );
}

function DetailDrawer({ 
  request, 
  onClose,
  onApprove,
  onReject
}: { 
  request: LeaveRequest; 
  onClose: () => void;
  onApprove: (id: string, stage: 'manager' | 'hr', remarks: string) => void;
  onReject: (id: string, stage: 'manager' | 'hr', remarks: string) => void;
}) {
  const [remarks, setRemarks] = useState("");
  const [showViolationDetails, setShowViolationDetails] = useState(false);

  const stage = request.managerApproval === "Pending" ? "manager" : "hr";

  const canAct = request.status === "Pending";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div 
        className="w-[500px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Leave Detail</h3>
            {request.escalated && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 flex items-center gap-1">
                <AlertCircle size={10} /> ESCALATED TO HR
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner" style={{ background: request.avatarColor }}>
              <span className="text-white font-bold text-xl">{request.initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{request.employee}</h2>
                <button title="View Profile" className="text-emerald-600 hover:text-emerald-700">
                  <ExternalLink size={14} />
                </button>
              </div>
              <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>{request.department} Dept · {request.type}</p>
            </div>
          </div>

          {/* SLA / Aging Info */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-zinc-800/50 border border-dashed" style={{ borderColor: "var(--border)" }}>
            <Clock size={16} className="text-emerald-600" />
            <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Requested <span className="text-foreground">2 days ago</span> 
              {canAct && <span className="ml-2 px-1.5 py-0.5 rounded bg-red-100 text-red-700">SLA: 24h overdue</span>}
            </p>
          </div>

          {/* Policy Violation Alerts */}
          {request.policyViolations && request.policyViolations.length > 0 && (
            <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-orange-600" />
                  <p className="text-sm font-bold text-orange-900">Policy Violations Detected</p>
                </div>
                <button onClick={() => setShowViolationDetails(!showViolationDetails)} className="text-[10px] font-bold text-orange-700 uppercase hover:underline">
                  {showViolationDetails ? "Hide" : "Details"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.policyViolations.map(v => (
                  <span key={v} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-orange-700 border border-orange-200">
                    {v}
                  </span>
                ))}
              </div>
              {showViolationDetails && (
                <p className="text-xs text-orange-800 leading-relaxed italic border-t border-orange-200 pt-2">
                  Approval of this request requires manual override as it triggers organization-level compliance alerts.
                </p>
              )}
            </div>
          )}

          {/* Leave Balance Section */}
          <div>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <History size={16} className="text-emerald-600" /> Current Entitlements
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Annual", value: request.balance.annual, total: 24, color: "#059669" },
                { label: "Sick", value: request.balance.sick, total: 12, color: "#14B8A6" },
                { label: "Casual", value: request.balance.casual, total: 10, color: "#F59E0B" },
                { label: "Unpaid", value: request.balance.unpaid, total: 0, color: "#EF4444" }
              ].map(b => (
                <div key={b.label} className="p-3 rounded-xl border bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{b.label}</span>
                    <span className="text-xs font-bold" style={{ color: b.color }}>{b.value}{b.total > 0 ? `/${b.total}` : ""}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: b.total > 0 ? `${(b.value / b.total) * 100}%` : '0%', backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Summary Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: "var(--foreground)" }}>Leave Window</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-bold">{request.from}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-bold">{request.to}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-dashed">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-bold text-emerald-600">{request.days} Working Days</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: "var(--foreground)" }}>Employee Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taken this year</span>
                  <span className="font-bold text-foreground">{request.summary.takenThisYear}d</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last leave</span>
                  <span className="font-bold text-foreground">{request.summary.lastLeaveDate}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sick freq.</span>
                  <span className={`font-bold px-1 rounded ${request.summary.sickFrequency === 'High' ? 'bg-red-100 text-red-700' : 'text-foreground'}`}>{request.summary.sickFrequency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
               <Paperclip size={16} className="text-emerald-600" /> Supporting Documents
            </h4>
            {request.attachmentCount && request.attachmentCount > 0 ? (
              <div className="p-3 rounded-xl border border-dashed flex items-center justify-between bg-emerald-50/30" style={{ borderColor: "#10B981" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <FileText size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">medical_cert_v1.pdf</p>
                    <p className="text-[10px] text-muted-foreground">1.2 MB · Uploaded Apr 12</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white transition-colors text-emerald-600">
                  <Download size={14} />
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed text-center" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs text-muted-foreground">No attachments provided.</p>
              </div>
            )}
          </div>

          {/* Remarks Section */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <MessageSquare size={16} className="text-emerald-600" /> Employee Remarks
              </h4>
              <div className="p-4 rounded-xl text-sm italic" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                "{request.remarks || "No remarks provided."}"
              </div>
            </div>

            {canAct && (
              <div>
                <h4 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>Approval Remarks</h4>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-4 rounded-xl text-sm bg-transparent border focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="Enter remarks for approval or rejection..."
                  rows={3}
                />
                <p className="text-[10px] mt-1 text-muted-foreground">* Remarks are mandatory for rejection.</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: "var(--foreground)" }}>Audit Trail</h4>
            <div className="relative pl-4 border-l-2 space-y-6" style={{ borderColor: "var(--border)" }}>
              {request.history.map((hist, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full border-2" style={{ backgroundColor: "var(--card)", borderColor: "var(--primary)" }} />
                  <div className="-mt-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{hist.date}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "var(--foreground)" }}>{hist.action} <span className="font-normal text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>by {hist.by}</span></p>
                    {hist.comment && (
                      <p className="text-xs mt-1 italic p-2 rounded bg-neutral-50 dark:bg-zinc-800" style={{ color: "var(--muted-foreground)" }}>"{hist.comment}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canAct && (
          <div className="p-6 border-t flex gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button 
              onClick={() => {
                if (!remarks.trim()) {
                  alert("Remarks are required for rejection.");
                  return;
                }
                onReject(request.id, stage, remarks);
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:bg-red-50 text-red-600 border border-red-200 shadow-sm"
              style={{ backgroundColor: "white" }}
            >
              Reject Request
            </button>
            <button 
              onClick={() => onApprove(request.id, stage, remarks)}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
            >
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



export function LeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveData);

  const [search, setSearch] = useState("");
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"CSV" | "Excel" | "PDF">("Excel");

  // Advanced Filter States
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filters, setFilters] = useState({
    department: "All",
    leaveType: "All",
    dateRange: "All",
    approvalStage: "All",
    conflictOnly: false,
    criticalOnly: false
  });

  // Bulk Action States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0 ? requests.filter(r => selectedIds.includes(r.id)) : requests;
    const content = "Employee,Department,Type,From,To,Days,Status\n" + dataToExport.map(r => `${r.employee},${r.department},${r.type},${r.from},${r.to},${r.days},${r.status}`).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave_report_${new Date().toISOString().split('T')[0]}.${exportFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
    setSelectedIds([]);
  };

  const filtered = requests.filter(r => {
    const matchSearch = search === "" || r.employee.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = filters.department === "All" || r.department === filters.department;
    const matchType = filters.leaveType === "All" || r.type === filters.leaveType;
    const matchStage = filters.approvalStage === "All" || 
      (filters.approvalStage === "Manager Pending" && r.managerApproval === "Pending") ||
      (filters.approvalStage === "HR Pending" && r.hrApproval === "Pending");
    const matchConflict = !filters.conflictOnly || !!r.policyViolations?.length;
    const matchCritical = !filters.criticalOnly || r.criticalRole;
    
    return matchSearch && matchDept && matchType && matchStage && matchConflict && matchCritical;
  });

  const handleApprove = (id: string, stage: 'manager' | 'hr', remarks: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newHistory = [...r.history, { date: new Date().toLocaleString(), action: stage === 'manager' ? "Manager Approved" : "HR Approved", by: "Current User", comment: remarks }];
      
      let newManager = r.managerApproval;
      let newHr = r.hrApproval;
      let newStatus = r.status;

      if (stage === 'manager') {
        newManager = "Approved";
        if (newHr === "Approved") newStatus = "Approved";
      } else {
        newHr = "Approved";
        if (newManager === "Approved") newStatus = "Approved";
      }
      return { ...r, managerApproval: newManager, hrApproval: newHr, status: newStatus, history: newHistory };
    }));
    setSelectedRequest(null);
  };

  const handleReject = (id: string, stage: 'manager' | 'hr', remarks: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newHistory = [...r.history, { date: new Date().toLocaleString(), action: stage === 'manager' ? "Manager Rejected" : "HR Rejected", by: "Current User", comment: remarks }];
      return { ...r, managerApproval: stage === 'manager' ? "Rejected" : r.managerApproval, hrApproval: stage === 'hr' ? "Rejected" : r.hrApproval, status: "Rejected", history: newHistory };
    }));
    setSelectedRequest(null);
  };

  const handleBulkAction = (action: 'Approve' | 'Reject') => {
    if (confirm(`Are you sure you want to ${action.toLowerCase()} ${selectedIds.length} requests?`)) {
      setRequests(prev => prev.map(r => {
        if (!selectedIds.includes(r.id) || r.status !== "Pending") return r;
        return {
          ...r,
          status: action === 'Approve' ? "Approved" : "Rejected",
          managerApproval: action === 'Approve' ? "Approved" : "Rejected",
          hrApproval: action === 'Approve' ? "Approved" : "Rejected",
          history: [...r.history, { date: new Date().toLocaleString(), action: `Bulk ${action}d`, by: "Admin" }]
        };
      }));
      setSelectedIds([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalReqs = requests.length + 150 - leaveData.length;

  const pendingReqs = requests.filter(r => r.status === "Pending").length + 20 - leaveData.filter(r => r.status === "Pending").length;

  const overdueApprovals = requests.filter(r => r.status === "Pending" && (new Date().getTime() - new Date(r.submissionDate).getTime() > 86400000)).length + 5;

  const getAgingLabel = (dateStr: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 3600000);
    if (hours < 1) return { label: "Just now", overdue: false };
    if (hours < 24) return { label: `${hours}h`, overdue: hours > 12 };
    const days = Math.floor(hours / 24);
    return { label: `${days}d`, overdue: days >= 1 };
  };

  const dynamicStats = [
    { label: "Total Requests", value: totalReqs, iconBg: "var(--secondary)", iconColor: "var(--primary)", icon: FileText },
    { label: "Pending Approvals", value: pendingReqs, iconBg: "rgba(245, 158, 11, 0.1)", iconColor: "#F59E0B", icon: Clock },
    { label: "Overdue Approvals", value: overdueApprovals, iconBg: "rgba(239, 68, 68, 0.1)", iconColor: "#EF4444", icon: AlertTriangle },
    { label: "On Leave Today", value: 12, iconBg: "rgba(14, 165, 233, 0.1)", iconColor: "#0EA5E9", icon: Users },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>Enterprise Leave Module</h2>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>Comprehensive absence management, workflow approvals, and analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-dashed transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            Export Report
          </button>
          <button 
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", fontSize: "13px", fontWeight: 700 }}>
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      {/* Smart Insights Bar */}
      <div className="flex items-center gap-6 py-3 px-4 mb-6 rounded-xl border bg-neutral-50 dark:bg-zinc-800/30 overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 border-r pr-6" style={{ borderColor: "var(--border)" }}>
          <Activity size={14} className="text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Smart Insights:</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-orange-500" />
          <span className="text-xs font-semibold">⚠️ 3 employees from Engineering on leave this week</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-zinc-700" />
        <div className="flex items-center gap-2">
          <Users size={14} className="text-blue-500" />
          <span className="text-xs font-semibold">📉 Team availability dropped 10% in Support Dept</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-zinc-700" />
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-red-500" />
          <span className="text-xs font-semibold">🟡 5 approvals pending more than 2 days</span>
        </div>
      </div>

      {/* Smart Warning Banner (Existing, kept for consistency) */}
      <div className="mb-6 rounded-xl flex items-center justify-between p-4 px-5 shadow-sm border border-orange-200" style={{ backgroundColor: "#FFFBEB" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100">
            <AlertTriangle size={16} color="#D97706" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-900">Critical Coverage Warning: Engineering & Support</p>
            <p className="text-xs font-medium text-orange-700 mt-0.5">3 team members have overlapping leaves requested between Apr 10 - Apr 15. Please review pending approvals.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const conflictReq = requests.find(r => r.conflictWarning);
            if (conflictReq) setSelectedRequest(conflictReq);
          }}
          className="text-xs font-bold text-orange-800 hover:text-orange-900 underline underline-offset-2">
          View Conflicts
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {dynamicStats.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>{card.label}</p>
                  <p className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>{card.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.iconBg }}>
                  <Icon size={20} color={card.iconColor} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Table & Analytics */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Table Card */}
          <div className="rounded-2xl border shadow-sm flex flex-col bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 color="var(--primary)" size={20} />
                  <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Leave Workflow Approvals</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                    <Search size={14} color="var(--muted-foreground)" />
                    <input 
                      className="bg-transparent text-sm w-32 outline-none" 
                      placeholder="Search..." 
                      style={{ color: "var(--foreground)" }}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${isFilterExpanded ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'hover:bg-neutral-50 dark:hover:bg-zinc-800'}`}
                    style={{ borderColor: isFilterExpanded ? '#10B981' : 'var(--border)' }}
                  >
                    <ListFilter size={16} /> Filters
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Advanced Filter Panel */}
              {isFilterExpanded && (
                <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200" style={{ borderColor: "var(--border)" }}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Department</label>
                      <select 
                        value={filters.department}
                        onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 active:border-emerald-500 transition-all outline-none"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <option value="All">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Leave Type</label>
                      <select 
                        value={filters.leaveType}
                        onChange={(e) => setFilters(prev => ({ ...prev, leaveType: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <option value="All">All Types</option>
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Approval Stage</label>
                      <select 
                        value={filters.approvalStage}
                        onChange={(e) => setFilters(prev => ({ ...prev, approvalStage: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <option value="All">All Stages</option>
                        <option value="Manager Pending">Manager Pending</option>
                        <option value="HR Pending">HR Pending</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div 
                          onClick={() => setFilters(prev => ({ ...prev, conflictOnly: !prev.conflictOnly }))}
                          className={`w-9 h-5 rounded-full relative transition-colors ${filters.conflictOnly ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-zinc-700'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${filters.conflictOnly ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-foreground">Conflict Only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div 
                          onClick={() => setFilters(prev => ({ ...prev, criticalOnly: !prev.criticalOnly }))}
                          className={`w-9 h-5 rounded-full relative transition-colors ${filters.criticalOnly ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-zinc-700'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${filters.criticalOnly ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-foreground">Critical Role</span>
                      </label>
                    </div>
                    <button 
                      onClick={() => setFilters({ department: "All", leaveType: "All", dateRange: "All", approvalStage: "All", conflictOnly: false, criticalOnly: false })}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Trash size={12} /> Reset Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Bulk Action Bar */}
              {selectedIds.length > 0 && (
                <div className="px-6 py-3 bg-emerald-600 text-white flex items-center justify-between animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">{selectedIds.length} items selected</span>
                    <div className="h-4 w-px bg-white/20" />
                    <button onClick={toggleSelectAll} className="text-xs font-bold hover:underline">Deselect All</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleBulkAction('Approve')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors">
                      <Check size={14} /> Approve Selected
                    </button>
                    <button onClick={() => handleBulkAction('Reject')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors">
                      <X size={14} /> Reject Selected
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors text-white">
                      <Download size={14} /> Export
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}>
                    <th className="px-3 py-3 w-10">
                      <div 
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${selectedIds.length === filtered.length && filtered.length > 0 ? 'bg-emerald-600 border-emerald-600' : 'border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'}`}
                      >
                        {selectedIds.length === filtered.length && filtered.length > 0 && <Check size={12} className="text-white" />}
                      </div>
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Employee</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Leave Detail & Policy</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Timeline & SLA</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap">Manager</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap">HR</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <CalendarIcon size={32} className="mx-auto mb-3 text-neutral-300 dark:text-zinc-700" />
                        <p className="text-sm font-medium text-neutral-500">No requests found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(req => {
                      const isSelected = selectedIds.includes(req.id);
                      const aging = getAgingLabel(req.submissionDate);

                      return (
                        <tr 
                          key={req.id} 
                          className={`hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer ${isSelected ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`} 
                          onClick={() => setSelectedRequest(req)}
                        >
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            <div 
                              onClick={() => toggleSelect(req.id)}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-neutral-300 dark:border-zinc-700 hover:border-emerald-500'}`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: req.avatarColor }}>
                                <span className="text-white text-xs font-extrabold">{req.initials}</span>
                              </div>
                              <div>
                                 <p className="text-sm font-bold truncate max-w-[120px]" style={{ color: "var(--foreground)" }}>{req.employee}</p>
                                 <p className="text-xs font-medium mt-0.5 truncate max-w-[120px]" style={{ color: "var(--muted-foreground)" }}>{req.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{req.type}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-zinc-800" style={{ color: "var(--muted-foreground)" }}>{req.days}d</span>
                              {req.criticalRole && <span title="Critical Role" className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-red-100 text-red-700">Critical</span>}
                              {req.policyViolations?.map(v => (
                                <span key={v} title={v} className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">Violation</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                             <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{req.from} - {req.to}</p>
                             <div className="flex items-center gap-1 mt-1">
                               <Clock size={10} className={aging.overdue ? "text-red-500" : "text-muted-foreground"} />
                               <span className={`text-[10px] font-bold ${aging.overdue ? "text-red-600" : "text-muted-foreground"}`}>{aging.label}</span>
                             </div>
                          </td>
                          <td className="px-3 py-3 text-center text-xs">
                            <StatusBadge status={req.managerApproval} small />
                            <p className="text-[9px] mt-1 text-muted-foreground font-semibold">David Lee</p>
                          </td>
                          <td className="px-3 py-3 text-center text-xs">
                            <StatusBadge status={req.hrApproval} small />
                            <p className="text-[9px] mt-1 text-muted-foreground font-semibold">Sarah Connor</p>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button 
                              className="p-1.5 rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-zinc-700"
                              onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                            >
                              <MoreVertical size={16} style={{ color: "var(--muted-foreground)" }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
               <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Showing {filtered.length} requests</p>
               <div className="flex gap-1">
                 <button className="px-2.5 py-1 text-xs font-bold rounded" style={{ backgroundColor: "var(--primary)", color: "white" }}>1</button>
                 <button className="px-2.5 py-1 text-xs font-bold rounded text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800">2</button>
               </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5 bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Leave Distribution</h3>
                <BarChart2 size={16} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <div className="space-y-4">
                {leaveDistribution.map(dist => (
                  <div key={dist.type}>
                     <div className="flex justify-between text-xs font-semibold mb-1.5">
                       <span style={{ color: "var(--foreground)" }}>{dist.type}</span>
                       <span style={{ color: "var(--muted-foreground)" }}>{dist.value}%</span>
                     </div>
                     <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                       <div className="h-full rounded-full transition-all" style={{ width: `${dist.value}%`, backgroundColor: dist.color }} />
                     </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-2xl border p-5 bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Team Availability Trend</h3>
                <Activity size={16} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <div className="h-32 flex items-end gap-2 mt-4 px-2">
                {[80, 85, 75, 90, 95, 88, 85].map((val, i) => (
                   <div key={i} className="flex-1 rounded-t-sm flex flex-col justify-end" style={{ height: '100%' }}>
                     <div className="w-full rounded-t-sm transition-all hover:opacity-80" style={{ height: `${val}%`, backgroundColor: val < 80 ? '#F59E0B' : 'var(--primary)', opacity: val < 80 ? 0.8 : 0.4 }} />
                   </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-neutral-400 uppercase">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Calendar & Widgets */}
        <div className="space-y-6">
          
          {/* Team Coverage Widget */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Team Coverage</h3>
              <Activity size={16} className="text-emerald-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Daily Capacity</p>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">SAFE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-zinc-800 border" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-bold">24/28</p>
                  <p className="text-[9px] font-medium text-muted-foreground">Available</p>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-zinc-800 border" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-bold text-emerald-600">4</p>
                  <p className="text-[9px] font-medium text-muted-foreground">On Leave</p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1.5">
                  <span>Coverage Health</span>
                  <span className="text-emerald-600">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Leave Calendar */}
          <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-emerald-600" />
                <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Team Calendar</h3>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }} onClick={() => setCurrentMonth(m => Math.max(0, m - 1))}>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold mx-1" style={{ color: "var(--foreground)", width: '60px', textAlign: 'center' }}>
                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentMonth]}
                </span>
                <button className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }} onClick={() => setCurrentMonth(m => Math.min(11, m + 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[11px] font-bold uppercase" style={{ color: "var(--muted-foreground)" }}>{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 14 && currentMonth === 3;
                const leaves = currentMonth === 3 ? [
                  { day: 8, color: "#14B8A6", name: "Ravi K." },
                  { day: 10, color: "#F59E0B", name: "Sneha P." },
                  { day: 11, color: "#059669", name: "Sneha P." },
                  { day: 12, color: "#059669", name: "Sneha P." },
                  { day: 15, color: "#F59E0B", name: "Meera T." },
                  { day: 22, color: "#0EA5E9", name: "Anita D." },
                ].filter(l => l.day === day) : [];

                return (
                  <div 
                    key={day} 
                    className={`group relative aspect-square flex flex-col justify-between p-1 border rounded-lg cursor-pointer transition-all ${isToday ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-emerald-50/50 dark:hover:bg-zinc-800'} `} 
                    style={{ borderColor: isToday ? 'var(--primary)' : 'var(--border)', backgroundColor: isToday ? 'var(--secondary)' : 'transparent' }}
                  >
                    <span className={`text-[11px] font-semibold text-left ml-0.5 ${isToday ? 'text-emerald-700' : 'text-neutral-600 dark:text-neutral-400'}`}>{day}</span>
                    <div className="flex flex-wrap gap-0.5 h-1/2 mt-0.5 p-0.5">
                      {leaves.map((l, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                      ))}
                    </div>
                    {/* Tooltip */}
                    {leaves.length > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="bg-zinc-900 text-white text-[10px] py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                          {leaves.map(l => l.name).join(", ")}
                        </div>
                        <div className="w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-5 border-t pt-4 flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#059669" }} /> Annual
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#14B8A6" }} /> Sick
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} /> Casual
              </div>
            </div>
          </div>

          {/* Pending Approvals Widget */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Quick Actions</h3>
               <span className="text-[10px] font-bold text-muted-foreground uppercase">{requests.filter(r => r.status === "Pending").length} Pending</span>
            </div>
            <div className="space-y-3">
              {requests.filter(r => r.status === "Pending").slice(0, 3).map(req => (
                <div key={req.id} className="p-3 rounded-xl border flex gap-3 hover:shadow-sm transition-shadow cursor-pointer group" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }} onClick={() => setSelectedRequest(req)}>
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: req.avatarColor }}>
                    {req.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold truncate group-hover:text-emerald-600 transition-colors" style={{ color: "var(--foreground)" }}>{req.employee}</p>
                      <span className="text-[9px] font-bold text-muted-foreground">{getAgingLabel(req.submissionDate).label}</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">{req.type} ({req.days}d)</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">{req.managerApproval === "Pending" ? "Mgr Review" : "HR Review"}</span>
                       {req.policyViolations?.length ? <AlertCircle size={10} className="text-orange-500" /> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-xl border border-dashed text-xs font-bold text-muted-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors">
              View All Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Render Detail Drawer conditionally */}
      {selectedRequest && (
        <DetailDrawer 
          request={selectedRequest as LeaveRequest} 
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* New Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setIsNewRequestOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>New Leave Request</h3>
              </div>
              <button onClick={() => setIsNewRequestOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Apply On Behalf Section */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-emerald-700" />
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Apply on Behalf</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-5 rounded-full relative bg-neutral-200 dark:bg-zinc-700">
                      <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-foreground">Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Applied By</label>
                    <input disabled type="text" value="Admin User (HR)" className="w-full px-3 py-2 rounded-lg border text-sm bg-neutral-100 dark:bg-zinc-800/50" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} />
                  </div>
                  <div className="flex items-center group cursor-pointer mt-5">
                    <div className="w-5 h-5 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white">
                      <Check size={12} />
                    </div>
                    <span className="ml-2 text-xs font-bold text-foreground">Employee Informed?</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Select Employee</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    <option value="">Search Employee...</option>
                    <option value="1">John Doe (Engineering)</option>
                    <option value="2">Jane Smith (Design)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Leave Type</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>From Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>To Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Remarks (Audit Log)</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent resize-none" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="Enter mandatory reasons for HR application..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Attachments (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800/50" style={{ borderColor: "var(--border)" }}>
                  <div className="space-y-1 text-center">
                    <Paperclip className="mx-auto h-10 w-10 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label className="relative cursor-pointer rounded-md font-bold text-emerald-600 hover:text-emerald-500">
                        <span>Upload documents</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button onClick={() => setIsNewRequestOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}>Cancel</button>
              <button 
                onClick={() => setIsNewRequestOpen(false)} 
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setIsExportOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-2">
                <Download size={18} style={{ color: "var(--primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Export Report</h3>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setExportFormat("CSV")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "CSV" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "CSV" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    CSV
                  </button>
                  <button 
                    onClick={() => setExportFormat("Excel")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "Excel" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "Excel" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    Excel
                  </button>
                  <button 
                    onClick={() => setExportFormat("PDF")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "PDF" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "PDF" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    PDF
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Date Range</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="q1">Q1 2026</option>
                  <option value="ytd">Year to Date</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="include-rejected" className="rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <label htmlFor="include-rejected" className="text-sm font-medium cursor-pointer" style={{ color: "var(--muted-foreground)" }}>Include rejected requests</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}>Cancel</button>
              <button 
                onClick={handleExport}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
