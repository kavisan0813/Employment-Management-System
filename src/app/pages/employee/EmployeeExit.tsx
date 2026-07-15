import { useState, useEffect, FormEvent } from "react";
import {
  LogOut,
  CheckCircle2,
  Clock,
  X,
  UploadCloud,
  FileText,
  Calendar,
  AlertCircle,
  Check,
  Pen,
  ShieldCheck,
  User,
  ArrowRight,
  Send,
  Building,
  CheckSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
export type WorkflowStatus =
  | "draft"
  | "pending_manager"
  | "pending_hr"
  | "approved"
  | "rejected";

export interface ResignationDetails {
  resignationDate: string;
  lwd: string;
  noticePeriod: string;
  reason: string;
  comments: string;
}

export interface TimelineEvent {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  date: string;
  comments?: string;
}

type TaskStatus = "done" | "pending" | "in_progress";

interface ExitTask {
  id: string;
  label: string;
  description: string;
  responsible: string;
  responsibleChip: string;
  status: TaskStatus;
  actionLabel?: string;
  actionType?: "link" | "btn" | "schedule" | "sign";
  completedDate?: string;
}

/* ─── Mock Data ─── */
const EXIT_TASKS: ExitTask[] = [
  {
    id: "t1",
    label: "Submit Resignation Letter",
    description: "Formal resignation submitted to manager",
    responsible: "You",
    responsibleChip: "You",
    status: "done",
    actionLabel: "View",
    actionType: "link",
    completedDate: "Mar 28",
  },
  {
    id: "t2",
    label: "Resignation Accepted",
    description: "Manager has accepted your resignation",
    responsible: "HR",
    responsibleChip: "HR",
    status: "done",
    completedDate: "Mar 30",
  },
  {
    id: "t3",
    label: "Upload Clearance Documents",
    description: "Submit ID card copy, NOC, and other clearance docs",
    responsible: "You",
    responsibleChip: "You",
    status: "in_progress",
    actionLabel: "Upload",
    actionType: "btn",
  },
  {
    id: "t4",
    label: "Return Company Laptop",
    description: "Submit laptop to IT desk with charger and accessories",
    responsible: "IT Dept",
    responsibleChip: "IT",
    status: "pending",
    actionLabel: "Confirm Drop-off",
    actionType: "btn",
  },
  {
    id: "t5",
    label: "Return iPhone 14 Pro",
    description: "Return company phone with charger and box",
    responsible: "IT",
    responsibleChip: "IT",
    status: "pending",
    actionLabel: "Confirm Drop-off",
    actionType: "btn",
  },
  {
    id: "t6",
    label: "Complete Exit Interview",
    description: "Schedule and complete exit interview with HR",
    responsible: "HR",
    responsibleChip: "HR",
    status: "pending",
    actionLabel: "Schedule",
    actionType: "schedule",
  },
  {
    id: "t7",
    label: "Return Access Card",
    description: "Submit access card to Admin on last working day",
    responsible: "Admin",
    responsibleChip: "Admin",
    status: "pending",
  },
  {
    id: "t8",
    label: "Sign NDA Acknowledgment",
    description: "Digitally sign the non-disclosure agreement",
    responsible: "You",
    responsibleChip: "You",
    status: "pending",
    actionLabel: "Sign Digitally",
    actionType: "sign",
  },
  {
    id: "t9",
    label: "Collect Experience Letter",
    description: "Experience letter will be issued after last working day",
    responsible: "HR",
    responsibleChip: "HR",
    status: "pending",
  },
  {
    id: "t10",
    label: "F&F Settlement",
    description: "Final settlement will be processed after all clearances",
    responsible: "Finance",
    responsibleChip: "Finance",
    status: "pending",
  },
];

const formatCurrency = (amount: number) => "₹" + amount.toLocaleString("en-IN");

/* ─── Status Circle ─── */
function StatusCircle({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <div className="w-6 h-6 rounded-full bg-[#00B87C] flex items-center justify-center shrink-0">
        <Check size={14} className="text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === "in_progress") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-[#D97706] flex items-center justify-center shrink-0">
        <Clock size={12} className="text-[#D97706]" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
    </div>
  );
}

/* ─── Responsible Pill ─── */
function ResponsiblePill({ label }: { label: string }) {
  const getResponsibleStyle = (l: string): string => {
    switch (l) {
      case "You":
        return "bg-[#DCFCE7] text-[#00B87C] border-[#00B87C]/20";
      case "HR":
        return "bg-[#EDE9FE] text-[#8B5CF6] border-[#8B5CF6]/20";
      case "IT":
        return "bg-[#E0F2FE] text-[#0EA5E9] border-[#0EA5E9]/20";
      case "Admin":
        return "bg-[#FEF3C7] text-[#D97706] border-[#D97706]/20";
      case "Finance":
        return "bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getResponsibleStyle(label)}`}
    >
      {label}
    </span>
  );
}

/* ─── Status Pill ─── */
function StatusPill({ status }: { status: TaskStatus }) {
  const getStatusConfig = (
    s: TaskStatus,
  ): { label: string; classes: string } => {
    switch (s) {
      case "done":
        return {
          label: "Done",
          classes: "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
        };
      case "in_progress":
        return {
          label: "In Progress",
          classes: "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
        };
      case "pending":
        return {
          label: "Pending",
          classes: "bg-muted text-muted-foreground border-border",
        };
      default:
        return {
          label: "Pending",
          classes: "bg-muted text-muted-foreground border-border",
        };
    }
  };
  const c = getStatusConfig(status);
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${c.classes}`}
    >
      {c.label}
    </span>
  );
}

/* ─── Resignation Form Component ─── */
function ResignationForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: ResignationDetails) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("Career Growth");
  const [comments, setComments] = useState("");
  const [lwd, setLwd] = useState("2026-04-10");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      resignationDate: new Date().toISOString().split("T")[0],
      lwd,
      noticePeriod: "30 Days",
      reason,
      comments,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-8 py-6 border-b border-border bg-secondary/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center border border-red-100">
            <LogOut size={24} className="text-[#EF4444]" />
          </div>
          <div>
            <h2 className="text-[20px] font-black text-foreground">
              Submit Resignation
            </h2>
            <p className="text-[13px] text-muted-foreground font-medium mt-1">
              Initiate your exit process by submitting a formal request.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
              Resignation Date
            </label>
            <input
              type="date"
              disabled
              value={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-[13px] font-semibold text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
              Last Working Day (Expected)
            </label>
            <input
              type="date"
              value={lwd}
              onChange={(e) => setLwd(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-border focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C] rounded-xl text-[13px] font-bold text-foreground outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
              Notice Period
            </label>
            <input
              type="text"
              disabled
              value="30 Days (Standard Policy)"
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-[13px] font-semibold text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
              Reason for leaving
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C] rounded-xl text-[13px] font-bold text-foreground outline-none transition-all"
            >
              <option value="Career Growth">Career Growth</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Relocation">Relocation</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="Better Opportunity">Better Opportunity</option>
              <option value="Family">Family</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
            Detailed Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Please provide any additional details..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C] rounded-xl text-[13px] font-medium text-foreground outline-none transition-all resize-none"
          />
        </div>

        <div className="p-5 border-2 border-dashed border-border rounded-xl flex items-center justify-center flex-col gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
          <UploadCloud size={24} className="text-muted-foreground" />
          <p className="text-[13px] font-bold text-foreground">
            Click to upload attachment
          </p>
          <p className="text-[11px] font-medium text-muted-foreground">
            Optional (PDF, DOCX up to 5MB)
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border text-[13px] font-bold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-secondary/50 text-[13px] font-bold text-foreground hover:bg-secondary transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[13px] font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            Submit Resignation <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Status Tracker Component ─── */
function StatusTracker({
  details,
  timeline,
  status,
}: {
  details: ResignationDetails | null;
  timeline: TimelineEvent[];
  status: WorkflowStatus;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Tracker Header */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 flex items-center justify-center border border-[#00B87C]/20">
            <CheckSquare size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <h2 className="text-[20px] font-black text-foreground">
              Resignation Request
            </h2>
            <p className="text-[13px] text-muted-foreground font-medium mt-1">
              Submitted on {details?.resignationDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary/20 border border-border">
          <Clock size={16} className="text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Current Status
            </span>
            <span className="text-[13px] font-black text-foreground">
              {status === "pending_manager"
                ? "Pending Manager Approval"
                : status === "pending_hr"
                  ? "Pending HR Approval"
                  : status === "rejected"
                    ? "Rejected"
                    : "Approved"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/10">
              <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                Submission Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Reason
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {details?.reason}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Notice Period
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {details?.noticePeriod}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Requested LWD
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {details?.lwd}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Manager
                </p>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground" />
                  <p className="text-[14px] font-bold text-foreground">
                    Suresh Iyer
                  </p>
                </div>
              </div>
              {details?.comments && (
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Comments
                  </p>
                  <p className="text-[13px] font-medium text-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
                    {details.comments}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/10">
              <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                Approval Timeline
              </h3>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-border ml-3 space-y-8">
                {timeline.map((event, idx) => (
                  <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-[#00B87C] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#00B87C] rounded-full" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[13px] font-bold text-foreground">
                        {event.action}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        By {event.performedBy} ({event.role})
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                        {event.date}
                      </p>
                      {event.comments && (
                        <p className="text-[12px] font-medium text-foreground bg-muted/50 p-2.5 rounded-lg border border-border mt-2">
                          "{event.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {status === "pending_manager" && (
            <button className="w-full py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100 transition-colors">
              Withdraw Resignation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function EmployeeExit() {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("draft");
  const [resignationDetails, setResignationDetails] =
    useState<ResignationDetails | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  const [tasks] = useState<ExitTask[]>(EXIT_TASKS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    const checkRequest = () => {
      const saved = localStorage.getItem("viyan_resignation_requests");
      if (saved) {
        try {
          const requests = JSON.parse(saved);
          const priyaReq = requests.find((r: any) => r.employeeName === "Priya Sharma");
          if (priyaReq) {
            setWorkflowStatus(priyaReq.status);
            setResignationDetails({
              resignationDate: priyaReq.resignationDate,
              lwd: priyaReq.lwd,
              noticePeriod: priyaReq.noticePeriod,
              reason: priyaReq.reason,
              comments: priyaReq.comments,
            });
            setTimelineEvents(priyaReq.timeline);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkRequest();
    window.addEventListener("storage", checkRequest);
    // Poll localstorage to simulate updates in single page app transitions
    const interval = setInterval(checkRequest, 1000);
    return () => {
      window.removeEventListener("storage", checkRequest);
      clearInterval(interval);
    };
  }, []);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  const handleUpload = (files: string[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    setShowUploadModal(false);
  };

  const openModalFor = (task: ExitTask) => {
    if (task.actionType === "btn" && task.label.includes("Upload")) {
      setShowUploadModal(true);
    } else if (task.actionType === "sign") {
      setShowSignatureModal(true);
    } else if (task.actionType === "schedule") {
      setShowScheduleModal(true);
    }
  };

  const handleResignationSubmit = (data: ResignationDetails) => {
    const dateStr = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const timeline = [
      {
        id: "ev1",
        action: "Resignation Submitted",
        performedBy: "Priya Sharma",
        role: "Employee",
        date: dateStr,
      },
    ];

    setResignationDetails(data);
    setWorkflowStatus("pending_manager");
    setTimelineEvents(timeline);

    const saved = localStorage.getItem("viyan_resignation_requests");
    let requests = [];
    if (saved) {
      try {
        requests = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    const priyaIndex = requests.findIndex((r: any) => r.employeeName === "Priya Sharma");
    const newRequest = {
      id: `req-${Date.now()}`,
      employeeName: "Priya Sharma",
      employeeId: "EMP101",
      department: "Engineering",
      designation: "Software Engineer",
      manager: "Suresh Iyer",
      joiningDate: "2023-06-15",
      status: "pending_manager" as const,
      resignationDate: data.resignationDate || new Date().toISOString().split("T")[0],
      lwd: data.lwd,
      noticePeriod: data.noticePeriod,
      reason: data.reason,
      comments: data.comments,
      timeline,
    };

    if (priyaIndex > -1) {
      requests[priyaIndex] = newRequest;
    } else {
      requests.push(newRequest);
    }
    localStorage.setItem("viyan_resignation_requests", JSON.stringify(requests));
  };

  if (workflowStatus === "draft") {
    return (
      <div className="w-full px-4 md:px-8 py-6 pb-20">
        <ResignationForm
          onSubmit={handleResignationSubmit}
          onCancel={() => {}}
        />
      </div>
    );
  }

  if (
    workflowStatus === "pending_manager" ||
    workflowStatus === "pending_hr" ||
    workflowStatus === "rejected"
  ) {
    return (
      <div className="w-full px-4 md:px-8 py-6 pb-20 space-y-6">
        <StatusTracker
          details={resignationDetails}
          timeline={timelineEvents}
          status={workflowStatus}
        />
      </div>
    );
  }

  // workflowStatus === "approved"
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEE2E2] flex items-center justify-center shadow-inner border border-red-100">
            <LogOut size={22} className="text-[#EF4444]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-[26px] font-black text-foreground tracking-tight">
                My Exit Checklist
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA] text-[11px] font-semibold uppercase tracking-wider">
                LWD: Apr 10, 2026
              </span>
            </div>
            <p className="text-[13px] font-semibold text-muted-foreground">
              Complete all tasks before your last working day
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00B87C] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] font-black text-foreground">
              {doneCount}/{totalCount} tasks complete
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN — Checklist */}
        <div className="flex-1 space-y-6">
          {/* NOTICE PERIOD COUNTDOWN CARD */}
          <div className="relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#00B87C] to-[#059669]" />
            <div className="p-6 pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <div className="text-[36px] font-black text-[#EF4444] tracking-tight leading-none">
                    4
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground">
                      Days Remaining
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Notice Period: Apr 1 – Apr 10, 2026
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#FEF3C7] border border-[#FBBF24]/30">
                <Calendar size={16} className="text-[#D97706]" />
                <span className="text-[12px] font-bold text-[#D97706]">
                  LWD: Apr 10, 2026
                </span>
              </div>
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/10 flex items-center justify-between">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                YOUR EXIT CHECKLIST
              </h3>
              <span className="text-[11px] font-black text-[#00B87C]">
                {doneCount}/{totalCount} completed
              </span>
            </div>

            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-[#00B87C]/[0.08]/20 transition-colors"
                  style={{ minHeight: "52px" }}
                >
                  <StatusCircle status={task.status} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[13px] font-bold ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {task.label}
                      </p>
                      <ResponsiblePill label={task.responsibleChip} />
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={task.status} />

                    {task.status !== "done" && task.actionType === "btn" && (
                      <button
                        onClick={() => openModalFor(task)}
                        className="px-4 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                      >
                        {task.actionLabel}
                      </button>
                    )}

                    {task.status !== "done" && task.actionType === "link" && (
                      <button className="text-[11px] font-black text-[#00B87C] hover:underline whitespace-nowrap">
                        {task.actionLabel} →
                      </button>
                    )}

                    {task.status !== "done" &&
                      task.actionType === "schedule" && (
                        <button
                          onClick={() => openModalFor(task)}
                          className="px-4 py-1.5 rounded-lg border border-[#00B87C]/30 text-[#00B87C] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all whitespace-nowrap"
                        >
                          {task.actionLabel}
                        </button>
                      )}

                    {task.status !== "done" && task.actionType === "sign" && (
                      <button
                        onClick={() => openModalFor(task)}
                        className="px-4 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                      >
                        {task.actionLabel}
                      </button>
                    )}

                    {task.status === "done" && task.completedDate && (
                      <span className="text-[11px] font-bold text-[#00B87C] whitespace-nowrap">
                        Done {task.completedDate}
                      </span>
                    )}

                    {task.status === "done" && (
                      <CheckCircle2 size={16} className="text-[#00B87C]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — F&F Summary */}
        <div className="lg:w-[340px] shrink-0">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-border bg-secondary/10">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                MY ESTIMATED F&F SETTLEMENT
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Last month salary
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {formatCurrency(87000)}
                  </span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Gratuity
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {formatCurrency(54000)}
                  </span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Leave encashment
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {formatCurrency(28000)}
                  </span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Reimbursements
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {formatCurrency(4200)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <div className="bg-[#F0FDF4] dark:bg-[#00B87C]/5 rounded-2xl p-4 border border-[#00B87C]/20">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-widest">
                      Estimated Net
                    </p>
                    <span className="text-[24px] font-black text-[#00B87C] tracking-tight">
                      {formatCurrency(173200)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground italic mt-3 text-center">
                  Final amount pending Finance approval
                </p>
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF3C7] border border-[#FBBF24]/20">
                  <AlertCircle size={14} className="text-[#D97706]" />
                  <span className="text-[11px] font-bold text-[#D97706]">
                    Settlement processed after all clearances
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── UPLOAD DOCUMENTS MODAL ─── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
                    <UploadCloud size={18} className="text-[#00B87C]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                    Upload Clearance Documents
                  </h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block">
                  Document Type
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all appearance-none">
                  <option>ID Card Copy</option>
                  <option>NOC Letter</option>
                  <option>Clearance Certificate</option>
                  <option>Other</option>
                </select>

                <div className="border-2 border-dashed border-border rounded-2xl p-8 bg-secondary/50 flex flex-col items-center justify-center gap-2 hover:border-[#00B87C] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] group-hover:scale-110 transition-transform">
                    <UploadCloud size={20} />
                  </div>
                  <p className="text-[13px] font-black text-foreground">
                    Browse Files
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Uploaded Files
                    </p>
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/20 text-[12px] font-bold text-[#00B87C]"
                      >
                        <FileText size={14} /> {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpload(["Clearance_Doc_1.pdf"])}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <UploadCloud size={14} /> Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── E-SIGNATURE MODAL ─── */}
      <AnimatePresence>
        {showSignatureModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setShowSignatureModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                    <Pen size={18} className="text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                    NDA Acknowledgment
                  </h3>
                </div>
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div className="px-4 py-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/20 flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="text-[#00B87C] shrink-0 mt-0.5"
                  />
                  <p className="text-[12px] font-medium text-foreground">
                    By signing below, you acknowledge that you have read and
                    agree to the terms of the Non-Disclosure Agreement. You
                    confirm that you will not disclose any confidential company
                    information after your employment ends.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="James Carter"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Digital Signature
                  </label>
                  <div className="border-2 border-dashed border-border rounded-2xl h-24 flex items-center justify-center bg-background cursor-pointer group hover:border-[#00B87C] transition-all">
                    {signatureComplete ? (
                      <div className="flex items-center gap-2 text-[#00B87C]">
                        <CheckCircle2 size={20} />
                        <span className="text-[12px] font-black">Signed</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Pen
                          size={20}
                          className="text-muted-foreground group-hover:text-[#00B87C] transition-colors"
                        />
                        <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                          Click to sign
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    I agree to the terms of the NDA
                  </span>
                </label>
              </div>

              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSignatureComplete(true);
                    setShowSignatureModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Pen size={14} /> Sign & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SCHEDULE EXIT INTERVIEW MODAL ─── */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[460px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] flex items-center justify-center">
                    <Calendar size={18} className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                    Schedule Exit Interview
                  </h3>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Preferred Time
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all appearance-none">
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Calendar size={14} /> Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
