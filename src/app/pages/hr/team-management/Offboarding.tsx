import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  LogOut,
  Download,
  Plus,
  X,
  Search,
  Calendar,
  ChevronRight,
  Check,
  Clock,
  User,
  Briefcase,
  Laptop,
  ShieldCheck,
  Star,
  ArrowLeft,
  FileText,
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
type ExitType =
  | "Resignation"
  | "Termination"
  | "Retirement"
  | "Contract End"
  | "Other";
type ClearanceStatus = "cleared" | "pending" | "not_started";
type TabType = "Active" | "Completed" | "Scheduled" | "Exit Analytics";

interface ExitTimelineItem {
  label: string;
  date: string;
  status: "done" | "active" | "pending";
}

interface ClearanceItem {
  dept: string;
  person: string;
  status: ClearanceStatus;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface AssetRecoveryItem {
  name: string;
  status: "returned" | "pending";
  detail: string;
}

interface DocumentItem {
  name: string;
  status: "uploaded" | "pending" | "not_generated";
}

interface ExitEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  type: ExitType;
  lwd: string;
  progress: number;
  clearance: ClearanceItem[];
  resumptionDate: string;
  acceptedDate: string;
  noticePeriodDays: number;
  timeline: ExitTimelineItem[];
  assets: AssetRecoveryItem[];
  documents: DocumentItem[];
  salary: number;
  gratuity: number;
  leaveEncashment: number;
  reimbursements: number;
  deductions: number;
  netAmount: number;
  ffStatus: string;
  interviewDone: boolean;
}

/* ─── Mock Data ─── */
const EXITS: ExitEmployee[] = [
  {
    id: "e1",
    name: "James Carter",
    designation: "Senior Finance Analyst",
    department: "Finance",
    type: "Resignation",
    lwd: "Apr 10, 2026",
    progress: 60,
    resumptionDate: "Apr 1, 2026",
    acceptedDate: "Apr 2, 2026",
    noticePeriodDays: 30,
    timeline: [
      {
        label: "Resignation Letter Received",
        date: "Apr 1, 2026",
        status: "done",
      },
      { label: "Resignation Accepted", date: "Apr 2", status: "done" },
      { label: "Notice Period Started", date: "Apr 2", status: "done" },
      {
        label: "Knowledge Transfer Plan Created",
        date: "Apr 3",
        status: "done",
      },
      { label: "Clearances In Progress", date: "Apr 4", status: "active" },
      { label: "Exit Interview Scheduled", date: "Pending", status: "pending" },
      {
        label: "Final Settlement Processed",
        date: "Pending",
        status: "pending",
      },
      { label: "Relieving Letter Issued", date: "Pending", status: "pending" },
      { label: "Exit Complete", date: "Pending", status: "pending" },
    ],
    clearance: [
      {
        dept: "Manager",
        person: "Rahul Sharma",
        status: "cleared",
        icon: User,
        color: "#00B87C",
        bgColor: "#DCFCE7",
      },
      {
        dept: "IT",
        person: "IT Team",
        status: "cleared",
        icon: Laptop,
        color: "#0EA5E9",
        bgColor: "#E0F2FE",
      },
      {
        dept: "Finance",
        person: "Finance Team",
        status: "pending",
        icon: Briefcase,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
      },
      {
        dept: "HR",
        person: "HR Team",
        status: "pending",
        icon: User,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
      },
      {
        dept: "Admin",
        person: "Admin Team",
        status: "cleared",
        icon: ShieldCheck,
        color: "#14B8A6",
        bgColor: "#CCFBF1",
      },
    ],
    assets: [
      { name: "Laptop Dell XPS", status: "returned", detail: "Returned Apr 5" },
      { name: "iPhone 14 Pro", status: "pending", detail: "Pending return" },
      { name: "Access Card", status: "pending", detail: "Pending" },
      { name: "VPN Token", status: "returned", detail: "Deactivated" },
    ],
    documents: [
      { name: "Resignation Letter", status: "uploaded" },
      { name: "Relieving Letter", status: "not_generated" },
      { name: "Experience Letter", status: "pending" },
      { name: "NDA Acknowledgment", status: "uploaded" },
      { name: "Exit Interview Form", status: "pending" },
    ],
    salary: 87000,
    gratuity: 54000,
    leaveEncashment: 28000,
    reimbursements: 4200,
    deductions: 0,
    netAmount: 173200,
    ffStatus: "Awaiting Finance Clearance",
    interviewDone: false,
  },
  {
    id: "e2",
    name: "Ravi Kumar",
    designation: "Marketing Lead",
    department: "Marketing",
    type: "Resignation",
    lwd: "Apr 20, 2026",
    progress: 30,
    resumptionDate: "Mar 25, 2026",
    acceptedDate: "Mar 26, 2026",
    noticePeriodDays: 45,
    timeline: [
      {
        label: "Resignation Letter Received",
        date: "Mar 25, 2026",
        status: "done",
      },
      { label: "Resignation Accepted", date: "Mar 26", status: "done" },
      { label: "Notice Period Started", date: "Mar 26", status: "done" },
      {
        label: "Knowledge Transfer Plan Created",
        date: "Mar 28",
        status: "done",
      },
      { label: "Clearances In Progress", date: "Apr 2", status: "active" },
      { label: "Exit Interview Scheduled", date: "Pending", status: "pending" },
      {
        label: "Final Settlement Processed",
        date: "Pending",
        status: "pending",
      },
      { label: "Exit Complete", date: "Pending", status: "pending" },
    ],
    clearance: [
      {
        dept: "Manager",
        person: "Priya Patel",
        status: "cleared",
        icon: User,
        color: "#00B87C",
        bgColor: "#DCFCE7",
      },
      {
        dept: "IT",
        person: "IT Team",
        status: "pending",
        icon: Laptop,
        color: "#0EA5E9",
        bgColor: "#E0F2FE",
      },
      {
        dept: "Finance",
        person: "Finance Team",
        status: "not_started",
        icon: Briefcase,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
      },
      {
        dept: "HR",
        person: "HR Team",
        status: "pending",
        icon: User,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
      },
      {
        dept: "Admin",
        person: "Admin Team",
        status: "not_started",
        icon: ShieldCheck,
        color: "#14B8A6",
        bgColor: "#CCFBF1",
      },
    ],
    assets: [
      {
        name: "Laptop MacBook Pro",
        status: "pending",
        detail: "Pending return",
      },
      { name: "iPad Pro", status: "pending", detail: "Pending" },
    ],
    documents: [
      { name: "Resignation Letter", status: "uploaded" },
      { name: "Relieving Letter", status: "not_generated" },
      { name: "Experience Letter", status: "pending" },
      { name: "NDA Acknowledgment", status: "pending" },
      { name: "Exit Interview Form", status: "pending" },
    ],
    salary: 125000,
    gratuity: 72000,
    leaveEncashment: 35000,
    reimbursements: 8200,
    deductions: 0,
    netAmount: 240200,
    ffStatus: "Pending",
    interviewDone: false,
  },
  {
    id: "e3",
    name: "Meena Nair",
    designation: "Operations Manager",
    department: "Operations",
    type: "Retirement",
    lwd: "Apr 30, 2026",
    progress: 15,
    resumptionDate: "Jan 15, 2026",
    acceptedDate: "Jan 16, 2026",
    noticePeriodDays: 90,
    timeline: [
      {
        label: "Retirement Notice Received",
        date: "Jan 15, 2026",
        status: "done",
      },
      { label: "Retirement Accepted", date: "Jan 16", status: "done" },
      { label: "Notice Period Started", date: "Jan 16", status: "done" },
      {
        label: "Knowledge Transfer Plan Created",
        date: "Feb 1",
        status: "done",
      },
      { label: "Clearances In Progress", date: "Mar 1", status: "active" },
      { label: "Exit Interview Scheduled", date: "Pending", status: "pending" },
      {
        label: "Final Settlement Processed",
        date: "Pending",
        status: "pending",
      },
      { label: "Exit Complete", date: "Pending", status: "pending" },
    ],
    clearance: [
      {
        dept: "Manager",
        person: "Anil Menon",
        status: "not_started",
        icon: User,
        color: "#00B87C",
        bgColor: "#DCFCE7",
      },
      {
        dept: "IT",
        person: "IT Team",
        status: "not_started",
        icon: Laptop,
        color: "#0EA5E9",
        bgColor: "#E0F2FE",
      },
      {
        dept: "Finance",
        person: "Finance Team",
        status: "not_started",
        icon: Briefcase,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
      },
      {
        dept: "HR",
        person: "HR Team",
        status: "cleared",
        icon: User,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
      },
      {
        dept: "Admin",
        person: "Admin Team",
        status: "not_started",
        icon: ShieldCheck,
        color: "#14B8A6",
        bgColor: "#CCFBF1",
      },
    ],
    assets: [
      { name: "Laptop HP EliteBook", status: "pending", detail: "Pending" },
      { name: 'Monitor Dell 27"', status: "pending", detail: "Pending" },
      { name: "Access Card", status: "pending", detail: "Pending" },
    ],
    documents: [
      { name: "Retirement Notice", status: "uploaded" },
      { name: "Relieving Letter", status: "not_generated" },
      { name: "Experience Letter", status: "not_generated" },
      { name: "NDA Acknowledgment", status: "uploaded" },
      { name: "Exit Interview Form", status: "pending" },
    ],
    salary: 145000,
    gratuity: 240000,
    leaveEncashment: 62000,
    reimbursements: 3200,
    deductions: 0,
    netAmount: 450200,
    ffStatus: "Pending",
    interviewDone: false,
  },
  {
    id: "e4",
    name: "Suresh Pillai",
    designation: "Sales Director",
    department: "Sales",
    type: "Termination",
    lwd: "Apr 5, 2026 (OVERDUE!)",
    progress: 80,
    resumptionDate: "Mar 10, 2026",
    acceptedDate: "Mar 11, 2026",
    noticePeriodDays: 15,
    timeline: [
      { label: "Termination Notice", date: "Mar 10, 2026", status: "done" },
      { label: "Termination Accepted", date: "Mar 11", status: "done" },
      { label: "Notice Period Started", date: "Mar 11", status: "done" },
      { label: "Handover Completed", date: "Mar 20", status: "done" },
      { label: "Clearances Completed", date: "Apr 2", status: "done" },
      { label: "Exit Interview Done", date: "Apr 1", status: "done" },
      { label: "Final Settlement Pending", date: "Pending", status: "active" },
      { label: "Exit Complete", date: "Pending", status: "pending" },
    ],
    clearance: [
      {
        dept: "Manager",
        person: "Vikram Seth",
        status: "cleared",
        icon: User,
        color: "#00B87C",
        bgColor: "#DCFCE7",
      },
      {
        dept: "IT",
        person: "IT Team",
        status: "cleared",
        icon: Laptop,
        color: "#0EA5E9",
        bgColor: "#E0F2FE",
      },
      {
        dept: "Finance",
        person: "Finance Team",
        status: "pending",
        icon: Briefcase,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
      },
      {
        dept: "HR",
        person: "HR Team",
        status: "cleared",
        icon: User,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
      },
      {
        dept: "Admin",
        person: "Admin Team",
        status: "cleared",
        icon: ShieldCheck,
        color: "#14B8A6",
        bgColor: "#CCFBF1",
      },
    ],
    assets: [
      { name: "Laptop ThinkPad", status: "returned", detail: "Returned Apr 3" },
      { name: "Company Car", status: "returned", detail: "Returned Apr 4" },
      { name: "Access Card", status: "returned", detail: "Returned Apr 3" },
    ],
    documents: [
      { name: "Termination Letter", status: "uploaded" },
      { name: "Relieving Letter", status: "not_generated" },
      { name: "Experience Letter", status: "not_generated" },
      { name: "NDA Acknowledgment", status: "uploaded" },
      { name: "Exit Interview Form", status: "uploaded" },
    ],
    salary: 210000,
    gratuity: 96000,
    leaveEncashment: 42000,
    reimbursements: 12500,
    deductions: 25000,
    netAmount: 335500,
    ffStatus: "Awaiting Finance Clearance",
    interviewDone: true,
  },
];

/* ─── Helpers ─── */
const formatCurrency = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${val.toLocaleString("en-IN")}`;
  return `₹${val}`;
};

const progressColor = (pct: number) => {
  if (pct >= 80) return { bar: "#00B87C", text: "#00B87C" };
  if (pct >= 40) return { bar: "#F59E0B", text: "#F59E0B" };
  return { bar: "#EF4444", text: "#EF4444" };
};

const exitTypeChip = (type: ExitType) => {
  switch (type) {
    case "Resignation":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] border border-[#A7F3D0] text-[11px] font-semibold uppercase tracking-wider">
          Resignation
        </span>
      );
    case "Termination":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] text-[11px] font-semibold uppercase tracking-wider">
          Termination
        </span>
      );
    case "Retirement":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0D9488] border border-[#99F6E4] text-[11px] font-semibold uppercase tracking-wider">
          Retirement
        </span>
      );
    default:
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] text-[11px] font-semibold uppercase tracking-wider">
          {type}
        </span>
      );
  }
};

const clearanceChip = (status: ClearanceStatus) => {
  switch (status) {
    case "cleared":
      return (
        <span className="text-[11px] font-black text-[#00B87C] flex items-center gap-1">
          <Check size={12} /> Done
        </span>
      );
    case "pending":
      return (
        <span className="text-[11px] font-black text-amber-500 flex items-center gap-1">
          <Clock size={12} /> Pending
        </span>
      );
    case "not_started":
      return (
        <span className="text-[11px] font-semibold text-[#94A3B8] flex items-center gap-1">
          <X size={12} /> Not Started
        </span>
      );
  }
};

const ACTIVE_EMPLOYEES = [
  {
    id: "ae1",
    name: "Vikram Malhotra",
    role: "Product Manager",
    dept: "Product",
  },
  { id: "ae2", name: "Neha Sen", role: "Senior HR Specialist", dept: "HR" },
  { id: "ae3", name: "Kunal Kapoor", role: "Data Engineer", dept: "Analytics" },
  { id: "ae4", name: "Ananya Roy", role: "Content Writer", dept: "Marketing" },
  {
    id: "ae5",
    name: "Amit Goel",
    role: "Infrastructure Architect",
    dept: "IT",
  },
];

/* ─── MAIN COMPONENT ─── */
export function Offboarding() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<{
    id: string;
    type: "interview" | "clearance";
  } | null>(null);
  const [exits, setExits] = useState<ExitEmployee[]>(EXITS);
  const activeExits = exits.filter((e) => e.progress < 100);
  const completedExits = exits.filter((e) => e.progress === 100);
  const scheduledExits = exits.filter((e) => e.progress < 30 && e.progress > 0);
  const stats = {
    activeExits: activeExits.length,
    completedThisMonth: completedExits.length,
    pendingFF: exits.filter(
      (e) =>
        e.ffStatus === "Awaiting Finance Clearance" || e.ffStatus === "Pending",
    ).length,
    assetsPending: exits.filter((e) =>
      e.assets.some((a) => a.status === "pending"),
    ).length,
    docsPending: exits.filter((e) =>
      e.documents.some(
        (d) => d.status === "pending" || d.status === "not_generated",
      ),
    ).length,
    interviewsDone: `${exits.filter((e) => e.interviewDone).length}/${exits.length}`,
  };
  const currentExit = showDetail
    ? exits.find((e) => e.id === showDetail)
    : null;
  const completeExit = showComplete
    ? exits.find((e) => e.id === showComplete)
    : null;
  const handleExportCSV = () => {
    const content = `Offboarding Report\nName,Designation,Department,LWD,Progress,InterviewDone,F&F Status\n${exits.map((e) => `"${e.name}","${e.designation}","${e.department}","${e.lwd}",${e.progress}%,${e.interviewDone},"${e.ffStatus}"`).join("\n")}`;
    const blob = new Blob([content], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Offboarding_Report_${Date.now()}.csv`;
    a.click();
    showToast(
      "Export Completed",
      "success",
      "Offboarding report CSV downloaded.",
    );
  };

  const handleSignOff = (exitId: string, dept: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const clearance = e.clearance.map((c) =>
          c.dept === dept ? { ...c, status: "cleared" as const } : c,
        );

        const clearedCount = clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = e.documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          e.documents.length > 0
            ? (uploadedDocs / e.documents.length) * 25
            : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );
        return { ...e, clearance, progress };
      }),
    );
    showToast("Clearance Sign-Off", "success", `${dept} clearance signed off.`);
  };

  const handleGenerateDoc = (exitId: string, docName: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === docName ? { ...d, status: "uploaded" as const } : d,
        );

        const clearedCount = e.clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / e.clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          documents.length > 0 ? (uploadedDocs / documents.length) * 25 : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );
        return { ...e, documents, progress };
      }),
    );
    showToast(
      "Document Generated",
      "success",
      `${docName} generated successfully.`,
    );
  };

  const handleSendToFinance = (exitId: string) => {
    const isHR = user?.role === "HR Manager";
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        return {
          ...e,
          ffStatus: isHR
            ? "Awaiting Finance Clearance"
            : "Approved & Processed",
        };
      }),
    );
    showToast(
      "F&F Settlement",
      "success",
      isHR
        ? "F&F initiated and sent to Finance for clearance."
        : "F&F settlement approved and sent to bank.",
    );
  };

  const handleConfirmComplete = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const timeline = e.timeline.map((t) => ({
          ...t,
          status: "done" as const,
        }));
        return { ...e, progress: 100, timeline };
      }),
    );
    showToast(
      "Exit Completed",
      "success",
      "Employee exit process marked as completed.",
    );
    setShowComplete(null);
  };

  const handleCompleteInterview = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === "Exit Interview Form"
            ? { ...d, status: "uploaded" as const }
            : d,
        );
        return { ...e, interviewDone: true, documents };
      }),
    );
    showToast(
      "Interview Completed",
      "success",
      "Exit interview recorded successfully.",
    );
    setShowSchedule(null);
  };

  const handleInitiateExit = (
    name: string,
    type: ExitType,
    lwd: string,
    noticeDays: number,
  ) => {
    const formattedLWD = lwd
      ? new Date(lwd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "May 10, 2026";
    const newExit: ExitEmployee = {
      id: `exit${Date.now()}`,
      name,
      designation: "Software Engineer",
      department: "Engineering",
      type,
      lwd: formattedLWD,
      progress: 10,
      resumptionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      acceptedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      noticePeriodDays: noticeDays || 30,
      timeline: [
        { label: "Resignation Letter Received", date: "Today", status: "done" },
        { label: "Resignation Accepted", date: "Today", status: "done" },
        { label: "Notice Period Started", date: "Today", status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: "Rahul Sharma",
          status: "cleared",
          icon: User,
          color: "#00B87C",
          bgColor: "#DCFCE7",
        },
        {
          dept: "IT",
          person: "IT Team",
          status: "pending",
          icon: Laptop,
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
        },
        {
          dept: "Finance",
          person: "Finance Team",
          status: "pending",
          icon: Briefcase,
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          dept: "HR",
          person: "HR Team",
          status: "pending",
          icon: User,
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        },
        {
          dept: "Admin",
          person: "Admin Team",
          status: "cleared",
          icon: ShieldCheck,
          color: "#14B8A6",
          bgColor: "#CCFBF1",
        },
      ],
      assets: [
        { name: "Laptop", status: "pending", detail: "Pending return" },
        { name: "Access Card", status: "pending", detail: "Pending" },
      ],
      documents: [
        { name: "Resignation Letter", status: "uploaded" },
        { name: "Relieving Letter", status: "not_generated" },
        { name: "Experience Letter", status: "pending" },
      ],
      salary: 95000,
      gratuity: 0,
      leaveEncashment: 15000,
      reimbursements: 2000,
      deductions: 0,
      netAmount: 112000,
      ffStatus: "Pending",
      interviewDone: false,
    };
    setExits((prev) => [newExit, ...prev]);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEE2E2] dark:bg-red-500/10 flex items-center justify-center shadow-inner border border-red-100 dark:border-red-500/20">
            <LogOut size={22} className="text-[#EF4444]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">
              Offboarding / Exit Management
            </h1>
            <p className="text-[13px] font-semibold text-muted-foreground">
              Manage employee exits, clearances and F&F settlements
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowInitiateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
          >
            <Plus size={18} />
            Initiate Exit
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-[12px] font-bold text-foreground">
            {stats.activeExits} active exits in progress
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground">
            {stats.pendingFF} final settlements pending Finance clearance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[12px] font-bold text-foreground">
            1 exit completing this week — James Carter (Apr 10)
          </span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          icon={User}
          bgColor="#FEE2E2"
          iconColor="#EF4444"
          label="ACTIVE EXITS"
          value={`${stats.activeExits}`}
          valueColor="text-[#EF4444]"
          sub="in progress"
        />
        <KpiCard
          icon={Check}
          bgColor="#DCFCE7"
          iconColor="#00B87C"
          label="COMPLETED THIS MONTH"
          value={`${stats.completedThisMonth}`}
          valueColor="text-[#00B87C]"
          sub="fully settled"
        />
        <KpiCard
          icon={Clock}
          bgColor="#FEF3C7"
          iconColor="#F59E0B"
          label="PENDING F&F SETTLEMENT"
          value={`${stats.pendingFF}`}
          valueColor="text-amber-500"
          sub="awaiting Finance"
        />
        <KpiCard
          icon={Laptop}
          bgColor="#E0F2FE"
          iconColor="#0EA5E9"
          label="ASSETS PENDING RETURN"
          value={`${stats.assetsPending}`}
          valueColor="text-[#0EA5E9]"
          sub="from exiting employees"
        />
        <KpiCard
          icon={FileText}
          bgColor="#EDE9FE"
          iconColor="#8B5CF6"
          label="DOCS PENDING SIGNATURE"
          value={`${stats.docsPending}`}
          valueColor="text-[#8B5CF6]"
          sub="exit docs unsigned"
        />
        <KpiCard
          icon={Star}
          bgColor="#DCFCE7"
          iconColor="#00B87C"
          label="EXIT INTERVIEWS DONE"
          value={stats.interviewsDone}
          valueColor="text-[#00B87C]"
          sub="this cycle"
        />
      </div>

      {/* TABS */}
      <div className="space-y-6">
        <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
          {(
            ["Active", "Completed", "Scheduled", "Exit Analytics"] as TabType[]
          ).map((tab) => {
            const isActive = activeTab === tab;
            const count =
              tab === "Active"
                ? stats.activeExits
                : tab === "Completed"
                  ? stats.completedThisMonth
                  : tab === "Scheduled"
                    ? scheduledExits.length
                    : null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[13px] font-semibold tracking-wider uppercase transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-[#00B87C]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {count !== null ? ` (${count})` : ""}
                {isActive && (
                  <motion.div
                    layoutId="offboardingTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Active" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {activeExits.map((exit) => (
                  <ExitCard
                    key={exit.id}
                    exit={exit}
                    onViewDetail={() => setShowDetail(exit.id)}
                    onSendReminder={() => setShowReminder(exit.id)}
                    onComplete={() => setShowComplete(exit.id)}
                    onScheduleInterview={() =>
                      setShowSchedule({ id: exit.id, type: "interview" })
                    }
                  />
                ))}
              </div>
            )}
            {activeTab === "Completed" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {completedExits.map((exit) => (
                  <ExitCard
                    key={exit.id}
                    exit={exit}
                    onViewDetail={() => setShowDetail(exit.id)}
                    onSendReminder={() => setShowReminder(exit.id)}
                    onComplete={() => setShowComplete(exit.id)}
                    onScheduleInterview={() =>
                      setShowSchedule({ id: exit.id, type: "interview" })
                    }
                  />
                ))}
                {completedExits.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
                    No completed exits this period.
                  </div>
                )}
              </div>
            )}
            {activeTab === "Scheduled" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {scheduledExits.map((exit) => (
                  <ExitCard
                    key={exit.id}
                    exit={exit}
                    onViewDetail={() => setShowDetail(exit.id)}
                    onSendReminder={() => setShowReminder(exit.id)}
                    onComplete={() => setShowComplete(exit.id)}
                    onScheduleInterview={() =>
                      setShowSchedule({ id: exit.id, type: "interview" })
                    }
                  />
                ))}
                {scheduledExits.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
                    No scheduled exits.
                  </div>
                )}
              </div>
            )}
            {activeTab === "Exit Analytics" && (
              <div className="flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
                Exit analytics coming soon.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── MODALS ─── */}

      {/* INITIATE EXIT MODAL */}
      {showInitiateModal && (
        <InitiateExitModal
          onClose={() => setShowInitiateModal(false)}
          onInitiate={handleInitiateExit}
        />
      )}

      {/* OFFBOARDING DETAIL SCREEN */}
      {showDetail && currentExit && (
        <OffboardingDetail
          exit={currentExit}
          onClose={() => setShowDetail(null)}
          onSignOff={(dept) => handleSignOff(currentExit.id, dept)}
          onGenerateDoc={(doc) => handleGenerateDoc(currentExit.id, doc)}
          onSendReminder={() => {
            setShowDetail(null);
            setShowReminder(currentExit.id);
          }}
          onScheduleInterview={() => {
            setShowDetail(null);
            setShowSchedule({ id: currentExit.id, type: "interview" });
          }}
          onSendToFinance={() => handleSendToFinance(currentExit.id)}
        />
      )}

      {/* SEND REMINDER MODAL */}
      {showReminder && (
        <ReminderModal
          exitName={exits.find((e) => e.id === showReminder)?.name || ""}
          onClose={() => setShowReminder(null)}
        />
      )}

      {/* COMPLETE EXIT MODAL */}
      {showComplete && completeExit && (
        <CompleteExitModal
          exit={completeExit}
          onClose={() => setShowComplete(null)}
          onConfirm={() => handleConfirmComplete(completeExit.id)}
        />
      )}

      {/* EXIT INTERVIEW MODAL */}
      {showSchedule &&
        (() => {
          const emp = exits.find((e) => e.id === showSchedule.id);
          if (!emp) return null;
          if (showSchedule.type === "interview") {
            return (
              <ExitInterviewModal
                employeeName={emp.name}
                interviewDone={emp.interviewDone}
                onClose={() => setShowSchedule(null)}
                onComplete={() => handleCompleteInterview(emp.id)}
              />
            );
          }
          return null;
        })()}
    </div>
  );
}

/* ─── KPI CARD ─── */
function KpiCard({
  icon: Icon,
  bgColor,
  iconColor,
  label,
  value,
  valueColor,
  sub,
}: {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <h3 className={`text-[28px] font-black tracking-tighter ${valueColor}`}>
        {value}
      </h3>
      <p className="text-[12px] font-bold text-[#6B7280] mt-1">{sub}</p>
    </motion.div>
  );
}

/* ─── EXIT CARD ─── */
function ExitCard({
  exit,
  onViewDetail,
  onSendReminder,
  onComplete,
}: {
  exit: ExitEmployee;
  onViewDetail: () => void;
  onSendReminder: () => void;
  onComplete: () => void;
  onScheduleInterview: () => void;
}) {
  const colors = progressColor(exit.progress);
  const isOverdue = exit.lwd.includes("OVERDUE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all border ${isOverdue ? "border-[#EF4444]/50" : "border-border"}`}
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-sm shrink-0">
            {exit.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-foreground">
              {exit.name}
            </h4>
            <p className="text-[12px] font-medium text-muted-foreground">
              {exit.designation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#8B5CF6] text-[11px] font-semibold uppercase tracking-wider">
            LWD: {exit.lwd.replace(" (OVERDUE!)", "")}
          </span>
          {exitTypeChip(exit.type)}
        </div>
      </div>

      {/* PROGRESS RING + STEPPER */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="var(--border)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={colors.bar}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - exit.progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
            style={{ color: colors.text }}
          >
            {exit.progress}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Progress Stepper */}
          <div className="flex items-center gap-0">
            {[
              {
                label: "Notice",
                done: exit.timeline
                  .slice(0, 3)
                  .every((t) => t.status === "done"),
              },
              {
                label: "Clearances",
                done: exit.clearance.every((c) => c.status === "cleared"),
              },
              {
                label: "F&F",
                done: exit.timeline
                  .slice(5, 7)
                  .every((t) => t.status === "done"),
              },
              {
                label: "Complete",
                done: exit.timeline[exit.timeline.length - 1].status === "done",
              },
            ].map((step, idx, arr) => {
              const isActiveStep =
                !step.done && (idx === 0 || arr[idx - 1].done);
              return (
                <div
                  key={idx}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 transition-all ${
                        step.done
                          ? "bg-[#00B87C] border-[#00B87C] text-white"
                          : isActiveStep
                            ? "border-[#14B8A6] text-[#14B8A6] bg-[#CCFBF1]"
                            : "border-border text-muted-foreground bg-card"
                      }`}
                    >
                      {step.done ? (
                        <Check size={12} />
                      ) : isActiveStep ? (
                        <Clock size={10} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider mt-1 ${
                        step.done
                          ? "text-[#00B87C]"
                          : isActiveStep
                            ? "text-[#14B8A6]"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1 mt-[-16px] ${step.done ? "bg-[#00B87C]" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CLEARANCE STATUS ROW */}
      <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
        {exit.clearance.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[11px] font-semibold"
          >
            <span className="text-muted-foreground">{c.dept}</span>
            {c.status === "cleared" ? (
              <Check size={12} className="text-[#00B87C]" />
            ) : c.status === "pending" ? (
              <Clock size={12} className="text-amber-500" />
            ) : (
              <X size={12} className="text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <button
          onClick={onViewDetail}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#00B87C]/30 text-[#00B87C] text-[11px] font-black uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all"
        >
          View Full Exit <ChevronRight size={14} />
        </button>
        <button
          onClick={onSendReminder}
          className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-500 text-[11px] font-black uppercase tracking-wider hover:bg-amber-500/5 transition-all"
        >
          Send Reminder
        </button>
        {exit.clearance.every((c) => c.status === "cleared") && (
          <button
            onClick={onComplete}
            className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
          >
            Complete Exit
          </button>
        )}
      </div>
    </motion.div>
  );
}

function InitiateExitModal({
  onClose,
  onInitiate,
}: {
  onClose: () => void;
  onInitiate: (
    name: string,
    type: ExitType,
    lwd: string,
    noticeDays: number,
  ) => void;
}) {
  const [exitType, setExitType] = useState<ExitType>("Resignation");
  const [step, setStep] = useState<"form" | "preview" | "success">("form");

  const [empName, setEmpName] = useState("");
  const [lwdDate, setLwdDate] = useState("");
  const [resDate, setResDate] = useState("2026-04-06");
  const [noticeDays, setNoticeDays] = useState(30);
  const [hrOwner, setHrOwner] = useState("");

  const exitTypes: ExitType[] = [
    "Resignation",
    "Retirement",
    "Termination",
    "Contract End",
    "Other",
  ];
  const reasonCategories = [
    "Personal",
    "Career Growth",
    "Relocation",
    "Work Culture",
    "Compensation",
    "Health",
    "Education",
    "Other",
  ];

  if (step === "success") {
    return (
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-card rounded-[32px] p-10 text-center shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-[#00B87C]" />
          </div>
          <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
            Exit Initiated Successfully
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-6">
            Checklist tasks have been auto-assigned and notifications sent.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[520px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <LogOut size={20} className="text-[#EF4444]" />
            </div>
            <h3 className="text-[18px] font-bold text-foreground tracking-tight">
              Initiate Employee Exit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Employee Search */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              SELECT EMPLOYEE
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search employee name..."
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
              />
            </div>
            {empName && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto bg-muted/20 rounded-xl p-1">
                {ACTIVE_EMPLOYEES.filter((emp) =>
                  emp.name.toLowerCase().includes(empName.toLowerCase()),
                ).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setEmpName(emp.name);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] text-[9px] font-black">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">
                        {emp.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {emp.role} · {emp.dept}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exit Type */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              EXIT TYPE
            </label>
            <div className="flex flex-wrap gap-2">
              {exitTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setExitType(t)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                    exitType === t
                      ? "bg-[#00B87C] text-white border-[#00B87C]"
                      : "bg-card text-muted-foreground border-border hover:border-[#00B87C]/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
                LAST WORKING DATE
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={lwdDate}
                  onChange={(e) => setLwdDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
                RESIGNATION DATE
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Notice Period */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              NOTICE PERIOD (DAYS)
            </label>
            <input
              type="number"
              value={noticeDays}
              onChange={(e) => setNoticeDays(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
            />
          </div>

          {/* Reason Category */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REASON CATEGORY
            </label>
            <div className="flex flex-wrap gap-2">
              {reasonCategories.map((r) => (
                <button
                  key={r}
                  className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted-foreground hover:border-[#00B87C]/30 hover:text-foreground transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Details */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REASON DETAILS (OPTIONAL)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Add details..."
            />
          </div>

          {/* Assigned HR Owner */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              ASSIGNED HR OWNER
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search HR employee..."
                value={hrOwner}
                onChange={(e) => setHrOwner(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
              />
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              SEND NOTIFICATIONS TO
            </label>
            <div className="space-y-2.5">
              {[
                {
                  label: "Employee (confirmation email)",
                  defaultChecked: true,
                },
                { label: "Direct Manager", defaultChecked: true },
                {
                  label: "IT Team (access deactivation reminder)",
                  defaultChecked: true,
                },
                {
                  label: "Finance (F&F settlement kickoff)",
                  defaultChecked: true,
                },
                { label: "All Department Heads", defaultChecked: false },
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("preview")}
              className="px-5 py-2.5 rounded-xl border border-border text-[12px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all"
            >
              Preview Checklist
            </button>
            <button
              onClick={() => {
                if (!empName.trim()) {
                  showToast(
                    "Validation Error",
                    "error",
                    "Please select or enter an employee name.",
                  );
                  return;
                }
                onInitiate(empName, exitType, lwdDate, noticeDays);
                setStep("success");
              }}
              className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[12px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
            >
              Initiate Exit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── OFFBOARDING DETAIL SCREEN ─── */
function OffboardingDetail({
  exit,
  onClose,
  onSignOff,
  onGenerateDoc,
  onSendReminder,
  onScheduleInterview,
  onSendToFinance,
}: {
  exit: ExitEmployee;
  onClose: () => void;
  onSignOff: (dept: string) => void;
  onGenerateDoc: (doc: string) => void;
  onSendReminder: () => void;
  onScheduleInterview: () => void;
  onSendToFinance: () => void;
}) {
  const { user } = useAuth();
  const colors = progressColor(exit.progress);

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-6xl max-h-[90vh] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-all"
            >
              <ArrowLeft size={16} className="text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-sm">
              {exit.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-[18px] font-black text-foreground tracking-tight">
                {exit.name}
              </h2>
              <p className="text-[12px] font-medium text-muted-foreground">
                {exit.designation} · {exit.department}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {exitTypeChip(exit.type)}
              <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#8B5CF6] text-[11px] font-semibold uppercase tracking-wider">
                LWD: {exit.lwd.replace(" (OVERDUE!)", "")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={colors.bar}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - exit.progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-[12px] font-black"
                style={{ color: colors.text }}
              >
                {exit.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-[30%_40%_30%] divide-x divide-border">
          {/* LEFT: Timeline */}
          <div className="p-6 space-y-4">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              EXIT TIMELINE
            </h3>
            <div className="space-y-0">
              {exit.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        item.status === "done"
                          ? "bg-[#00B87C] border-[#00B87C]"
                          : item.status === "active"
                            ? "bg-[#CCFBF1] border-[#14B8A6]"
                            : "bg-card border-border"
                      }`}
                    >
                      {item.status === "done" ? (
                        <Check size={10} className="text-white" />
                      ) : item.status === "active" ? (
                        <Clock size={9} className="text-[#14B8A6]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                      )}
                    </div>
                    {i < exit.timeline.length - 1 && (
                      <div className="w-[2px] flex-1 bg-border min-h-[24px]" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p
                      className={`text-[12px] font-bold ${item.status === "done" ? "text-[#00B87C]" : item.status === "active" ? "text-[#14B8A6]" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Clearances + Assets + Docs */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Clearances */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                DEPARTMENT CLEARANCES
              </h3>
              <div className="space-y-2">
                {exit.clearance.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#00B87C]/[0.08] transition-all border border-transparent hover:border-[#DCFCE7]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: c.bgColor }}
                      >
                        <c.icon size={14} style={{ color: c.color }} />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground">
                          {c.dept}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {c.person}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {clearanceChip(c.status)}
                      {c.status !== "cleared" ? (
                        <button
                          onClick={() => onSignOff(c.dept)}
                          className="px-3 py-1.5 rounded-lg bg-[#00B87C] text-white text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
                        >
                          Sign Off
                        </button>
                      ) : (
                        <CheckCircle2 size={16} className="text-[#00B87C]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                ASSET RECOVERY CHECKLIST
              </h3>
              <div className="space-y-2">
                {exit.assets.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <Laptop size={14} className="text-muted-foreground" />
                      <div>
                        <p className="text-[12px] font-bold text-foreground">
                          {a.name}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {a.detail}
                        </p>
                      </div>
                    </div>
                    {a.status === "returned" ? (
                      <span className="text-[11px] font-black text-[#00B87C]">
                        ✓ Returned
                      </span>
                    ) : (
                      <button
                        onClick={onSendReminder}
                        className="text-[11px] font-black text-amber-500 hover:underline"
                      >
                        Send Reminder
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                DOCUMENT CHECKLIST
              </h3>
              <div className="space-y-2">
                {exit.documents.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-muted-foreground" />
                      <p className="text-[12px] font-bold text-foreground">
                        {d.name}
                      </p>
                    </div>
                    {d.status === "uploaded" ? (
                      <span className="text-[11px] font-black text-[#00B87C]">
                        ✓ Uploaded
                      </span>
                    ) : d.status === "not_generated" ? (
                      <button
                        onClick={() => onGenerateDoc(d.name)}
                        className="text-[11px] font-black text-[#00B87C] hover:underline"
                      >
                        Generate
                      </button>
                    ) : (
                      <span className="text-[11px] font-black text-amber-500">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Financial + Interview */}
          <div className="p-6 space-y-6">
            {/* F&F Settlement */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                F&F SETTLEMENT CALCULATION
              </h3>
              <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#DCFCE7] dark:border-emerald-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Last Working Month Salary
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.salary)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Gratuity ({Math.round(exit.gratuity / 10800)} yrs)
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.gratuity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Leave Encashment ({Math.round(exit.leaveEncashment / 2333)}{" "}
                    days)
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.leaveEncashment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Pending Reimbursements
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.reimbursements)}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black text-foreground">
                    Gross F&F Amount
                  </span>
                  <span className="text-[12px] font-black text-foreground">
                    {formatCurrency(
                      exit.salary +
                        exit.gratuity +
                        exit.leaveEncashment +
                        exit.reimbursements,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Asset Loss Deductions
                  </span>
                  <span className="text-[11px] font-semibold text-[#94A3B8]">
                    {exit.deductions > 0
                      ? `-${formatCurrency(exit.deductions)}`
                      : "-₹0"}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-foreground">
                    NET F&F AMOUNT
                  </span>
                  <span className="text-[13px] font-black text-[#00B87C]">
                    {formatCurrency(exit.netAmount)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-amber-500 border border-[#FDE68A] text-[11px] font-semibold uppercase tracking-wider">
                  <Clock size={12} /> {exit.ffStatus}
                </span>
              </div>
              {user?.role === "HR Manager" ? (
                <button
                  disabled={exit.ffStatus !== "Pending"}
                  onClick={onSendToFinance}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="inline mr-1.5" /> Initiate F&F
                </button>
              ) : (
                <button
                  disabled={exit.ffStatus === "Approved & Processed"}
                  onClick={onSendToFinance}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="inline mr-1.5" /> Approve & Process
                </button>
              )}
            </div>

            {/* Exit Interview */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                EXIT INTERVIEW
              </h3>
              <div className="p-4 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Conducted by
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {exit.interviewDone ? "HR Team" : "Not Done yet"}
                  </span>
                </div>
                {!exit.interviewDone ? (
                  <button
                    onClick={onScheduleInterview}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    Schedule Interview
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-muted/30">
                    <p className="text-[11px] font-medium text-muted-foreground italic">
                      "Good experience overall. Recommend better cross-team
                      collaboration tools."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── SEND REMINDER MODAL ─── */
function ReminderModal({
  exitName,
  onClose,
}: {
  exitName: string;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div
        className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-[#00B87C]" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">
            Reminder Sent!
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-5">
            Notification sent to all pending departments.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <Mail size={18} className="text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground">
              Send Reminder — {exitName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REMIND DEPARTMENT
            </label>
            <div className="space-y-2">
              {["IT Team", "Finance Team", "HR Team", "Admin Team"].map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    {d}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              MESSAGE (OPTIONAL)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              placeholder="Reminder message..."
              defaultValue="Please complete pending clearances for this exit at the earliest."
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={() => setSent(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-2"
          >
            <Send size={14} /> Send Reminder
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── COMPLETE EXIT MODAL ─── */
function CompleteExitModal({
  exit,
  onClose,
  onConfirm,
}: {
  exit: ExitEmployee;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-[#00B87C]" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
          Complete Exit
        </h3>
        <p className="text-[13px] font-medium text-muted-foreground mb-2">
          Are you sure you want to mark{" "}
          <strong className="text-foreground">{exit.name}</strong>'s exit as
          complete?
        </p>
        <p className="text-[11px] font-bold text-amber-500 mb-6">
          This will finalize all records and generate the relieving letter.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all"
          >
            Confirm Complete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EXIT INTERVIEW MODAL ─── */
function ExitInterviewModal({
  employeeName,
  interviewDone,
  onClose,
  onComplete,
}: {
  employeeName: string;
  interviewDone: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [recommendVal, setRecommendVal] = useState<string>("");

  if (interviewDone) {
    return (
      <div
        className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle2 size={40} className="text-[#00B87C] mx-auto mb-4" />
          <h3 className="text-lg font-black text-foreground mb-2">
            Interview Already Completed
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-5">
            This exit interview has already been recorded.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  const questions = [
    { id: "overall", label: "Overall experience at viyanHR?", type: "rating" },
    {
      id: "recommend",
      label: "Would you recommend viyanHR to others?",
      type: "choice",
      options: ["Yes", "Maybe", "No"],
    },
    { id: "manager", label: "Manager support quality?", type: "rating" },
    { id: "wlb", label: "Work-life balance satisfaction?", type: "rating" },
  ];

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2">
            <MessageSquare size={18} className="text-[#8B5CF6]" />
            Exit Interview — {employeeName}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
          {questions.map((q) => (
            <div key={q.id}>
              <p className="text-[12px] font-bold text-foreground mb-2">
                {q.label}
              </p>
              {q.type === "rating" ? (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setRatings((prev) => ({ ...prev, [q.id]: r }))
                      }
                      className={`w-9 h-9 rounded-xl text-[12px] font-black border transition-all ${
                        ratings[q.id] === r
                          ? "bg-[#00B87C] text-white border-[#00B87C]"
                          : "border-border text-muted-foreground hover:border-[#00B87C]/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {(q.options || []).map((o) => (
                    <button
                      key={o}
                      onClick={() => setRecommendVal(o)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all ${
                        recommendVal === o
                          ? "bg-[#00B87C] text-white border-[#00B87C]"
                          : "border-border text-muted-foreground hover:border-[#00B87C]/30"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              Primary reason for leaving?
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Career Growth",
                "Compensation",
                "Work Culture",
                "Relocation",
                "Personal",
                "Health",
                "Education",
                "Other",
              ].map((r) => (
                <button
                  key={r}
                  className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted-foreground hover:border-[#00B87C]/30 transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              What did you enjoy most?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              What could be improved?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Suggestions..."
            />
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              Any other feedback?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Additional feedback..."
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={onComplete}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all"
          >
            <Check size={14} className="inline mr-1" /> Mark as Completed
          </button>
        </div>
      </motion.div>
    </div>
  );
}
