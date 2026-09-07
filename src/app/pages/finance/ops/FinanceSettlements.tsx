import { useEffect, useState, useRef, useMemo, useCallback, useReducer } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Download,
  Lock,
  Save,
  Send,
  CornerUpLeft,
  Search,
  RotateCcw,
  AlertCircle,
  FileText,
  CreditCard,
  Building,
  Calendar,
  Filter,
  Check,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  OFFBOARDING_EXITS_KEY,
  OFFBOARDING_UPDATED_EVENT,
  areAllClearancesComplete,
  areAllDocumentsVerified,
  EXIT_STATUS,
} from "../../../features/Offboarding/services/offboardingWorkflow";
import type { ExitEmployee } from "../../../features/Offboarding/types/offboarding.types";
import { EXITS } from "../../../features/Offboarding/data/mockExits";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import { useAuth } from "../../../context/AuthContext";
import {
  fnfService,
  FnFSettlement,
  CanonicalSettlementStatus,
  CanonicalPaymentStatus,
  normalizeSettlementStatus,
  normalizePaymentStatus,
} from "../../../features/Offboarding/services/fnfService";
import { SettlementStatementModal } from "../../../features/Offboarding/modals/SettlementStatementModal";
import { FnFDocumentCenterModal } from "../../../features/Offboarding/modals/FnFDocumentCenterModal";

interface SettlementWorkspaceState {
  salary: number;
  gratuity: number;
  leaveEncashment: number;
  reimbursements: number;
  bonus: number;
  incentives: number;
  otherEarnings: number;
  noticePeriodRecovery: number;
  loanRecovery: number;
  assetRecovery: number;
  taxDeduction: number;
  pfEsiAdjustment: number;
  otherDeductions: number;
  workspaceComment: string;
}

type WorkspaceAction =
  | { type: "LOAD_SETTLEMENT"; settlement: FnFSettlement }
  | { type: "SET_FIELD"; field: keyof SettlementWorkspaceState; value: any };

const initialWorkspaceState: SettlementWorkspaceState = {
  salary: 0,
  gratuity: 0,
  leaveEncashment: 0,
  reimbursements: 0,
  bonus: 0,
  incentives: 0,
  otherEarnings: 0,
  noticePeriodRecovery: 0,
  loanRecovery: 0,
  assetRecovery: 0,
  taxDeduction: 0,
  pfEsiAdjustment: 0,
  otherDeductions: 0,
  workspaceComment: "",
};

function settlementWorkspaceReducer(state: SettlementWorkspaceState, action: WorkspaceAction): SettlementWorkspaceState {
  switch (action.type) {
    case "LOAD_SETTLEMENT":
      return {
        salary: action.settlement.salary,
        gratuity: action.settlement.gratuity,
        leaveEncashment: action.settlement.leaveEncashment,
        reimbursements: action.settlement.reimbursements,
        bonus: action.settlement.bonus,
        incentives: action.settlement.incentives,
        otherEarnings: action.settlement.otherEarnings,
        noticePeriodRecovery: action.settlement.noticePeriodRecovery,
        loanRecovery: action.settlement.loanRecovery,
        assetRecovery: action.settlement.assetRecovery,
        taxDeduction: action.settlement.taxDeduction,
        pfEsiAdjustment: action.settlement.pfEsiAdjustment,
        otherDeductions: action.settlement.otherDeductions,
        workspaceComment: "",
      };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

/* ─── KPI Card ─── */
function KPICard({
  title,
  value,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  color: "amber" | "green" | "purple" | "blue";
  icon: React.ElementType;
}) {
  const colors = {
    amber: {
      text: "#D97706",
      bg: "#FEF3C7",
      iconColor: "#D97706",
    },
    green: {
      text: "#00B87C",
      bg: "#DCFCE7",
      iconColor: "#10B981",
    },
    purple: {
      text: "#8B5CF6",
      bg: "#EDE9FE",
      iconColor: "#8B5CF6",
    },
    blue: {
      text: "#3B82F6",
      bg: "#DBEAFE",
      iconColor: "#3B82F6",
    },
  };
  return (
    <m.div
      whileHover={{ y: -5 }}
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm transition-all group"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors[color].bg }}
      >
        <Icon size={18} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </p>
      <h3
        className="text-[28px] font-bold tracking-tighter"
        style={{ color: colors[color].text }}
      >
        {value}
      </h3>
    </m.div>
  );
}

/* ─── Settlement Status Chip ─── */
function SettlementStatusChip({ status }: { status: CanonicalSettlementStatus }) {
  const styles: Record<CanonicalSettlementStatus, string> = {
    DRAFT: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    APPROVED: "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20",
    SENT_BACK: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const labels: Record<CanonicalSettlementStatus, string> = {
    DRAFT: "📝 Draft",
    PENDING_REVIEW: "⏳ Pending Review",
    UNDER_REVIEW: "🔍 Under Review",
    APPROVED: "✓ Approved",
    SENT_BACK: "↩ Sent Back",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border flex items-center w-fit gap-1.5 ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

/* ─── Payment Status Chip ─── */
function PaymentStatusChip({ status }: { status: CanonicalPaymentStatus }) {
  const styles: Record<CanonicalPaymentStatus, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PAID: "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const labels: Record<CanonicalPaymentStatus, string> = {
    PENDING: "⏳ Pending",
    PROCESSING: "🔄 Processing",
    PAID: "✓ Paid",
    FAILED: "✖ Failed",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border flex items-center w-fit gap-1.5 ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export function FinanceSettlements() {
  const { user } = useAuth();
  const canManage = usePermissionKey(P.OFFBOARDING_FINANCE_MANAGE);

  // Core Data State
  const [settlements, setSettlements] = useState<FnFSettlement[]>([]);
  const [selectedSettlement, setSelectedSettlement] = useState<FnFSettlement | null>(null);

  // Edit workspace state
  const [workspaceState, dispatchWorkspace] = useReducer(settlementWorkspaceReducer, initialWorkspaceState);
  const {
    salary, gratuity, leaveEncashment, reimbursements, bonus, incentives, otherEarnings,
    noticePeriodRecovery, loanRecovery, assetRecovery, taxDeduction, pfEsiAdjustment, otherDeductions,
    workspaceComment
  } = workspaceState;

  const setSalary = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "salary", value: v });
  const setGratuity = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "gratuity", value: v });
  const setLeaveEncashment = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "leaveEncashment", value: v });
  const setReimbursements = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "reimbursements", value: v });
  const setBonus = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "bonus", value: v });
  const setIncentives = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "incentives", value: v });
  const setOtherEarnings = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "otherEarnings", value: v });

  const setNoticePeriodRecovery = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "noticePeriodRecovery", value: v });
  const setLoanRecovery = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "loanRecovery", value: v });
  const setAssetRecovery = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "assetRecovery", value: v });
  const setTaxDeduction = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "taxDeduction", value: v });
  const setPfEsiAdjustment = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "pfEsiAdjustment", value: v });
  const setOtherDeductions = (v: number) => dispatchWorkspace({ type: "SET_FIELD", field: "otherDeductions", value: v });
  const setWorkspaceComment = (v: string) => dispatchWorkspace({ type: "SET_FIELD", field: "workspaceComment", value: v });

  // Operational Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [settlementStatusFilter, setSettlementStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Modal Dialog States
  const [statementSettlement, setStatementSettlement] = useState<FnFSettlement | null>(null);
  const [docCenterSettlement, setDocCenterSettlement] = useState<FnFSettlement | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveComment, setApproveComment] = useState("");

  const [showSendBackModal, setShowSendBackModal] = useState(false);
  const [sendBackReason, setSendBackReason] = useState("Incorrect salary calculation");
  const [sendBackComment, setSendBackComment] = useState("");

  const [showStartPaymentModal, setShowStartPaymentModal] = useState(false);
  const startPaymentCommentRef = useRef("");

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer (NEFT)");
  const [bankAccountDetails, setBankAccountDetails] = useState("");
  const markPaidCommentRef = useRef("");

  const [showMarkFailedModal, setShowMarkFailedModal] = useState(false);
  const [failureReason, setFailureReason] = useState("Account Details Mismatch / Bank Rejection");

  // Load / Sync Data
  const refreshData = useCallback(() => {
    const data = fnfService.getSettlements(user?.organizationId);
    setSettlements(data);
  }, [user?.organizationId]);

  useEffect(() => {
    refreshData();
    window.addEventListener(OFFBOARDING_UPDATED_EVENT, refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener(OFFBOARDING_UPDATED_EVENT, refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, [refreshData]);

  // Open Review Workspace Modal
  const openReviewModal = (item: FnFSettlement) => {
    setSelectedSettlement(item);
    dispatchWorkspace({ type: "LOAD_SETTLEMENT", settlement: item });
  };

  // Filter Pipeline: Search -> Department -> Settlement Status -> Payment Status -> Date Range
  const filteredSettlements = useMemo(() => {
    return settlements.filter((item) => {
      // 1. Search (Employee Name, Employee ID, Settlement ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.employeeName.toLowerCase().includes(q);
        const matchesEmpId = item.employeeId.toLowerCase().includes(q);
        const matchesFnfId = item.id.toLowerCase().includes(q);
        if (!matchesName && !matchesEmpId && !matchesFnfId) return false;
      }

      // 2. Department Filter
      if (deptFilter !== "All" && item.department !== deptFilter) {
        return false;
      }

      // 3. Settlement Status Filter
      if (settlementStatusFilter !== "All" && item.settlementStatus !== settlementStatusFilter) {
        return false;
      }

      // 4. Payment Status Filter
      if (paymentStatusFilter !== "All" && item.paymentStatus !== paymentStatusFilter) {
        return false;
      }

      // 5. Date Range Filter (based on LWD)
      if (dateFrom) {
        const itemDate = new Date(item.lwd).getTime();
        const fromTime = new Date(dateFrom).getTime();
        if (!isNaN(itemDate) && !isNaN(fromTime) && itemDate < fromTime) return false;
      }
      if (dateTo) {
        const itemDate = new Date(item.lwd).getTime();
        const toTime = new Date(dateTo).getTime() + 86400000;
        if (!isNaN(itemDate) && !isNaN(toTime) && itemDate > toTime) return false;
      }

      return true;
    });
  }, [settlements, searchQuery, deptFilter, settlementStatusFilter, paymentStatusFilter, dateFrom, dateTo]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("All");
    setSettlementStatusFilter("All");
    setPaymentStatusFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = "Settlement ID,Employee ID,Employee Name,Department,Last Working Day,Gross Settlement,Total Deductions,Net Payable,Settlement Status,Payment Status,Payment Ref UTR\n";
    const rows = filteredSettlements
      .map(
        (s) =>
          `"${s.id}","${s.employeeId}","${s.employeeName}","${s.department}","${s.lwd}",${s.grossSettlement},${s.totalDeductions},${s.netSettlementPayable},"${s.settlementStatus}","${s.paymentStatus}","${s.paymentReference || "N/A"}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FnF_Settlements_Export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Export Completed", "success", `${filteredSettlements.length} settlement records exported to CSV.`);
  };

  // Save / Update Calculations in Workspace
  const handleSaveCalculation = (desiredStatus: CanonicalSettlementStatus = "PENDING_REVIEW") => {
    if (!selectedSettlement) return;

    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const updated: FnFSettlement = {
      ...selectedSettlement,
      salary,
      gratuity,
      leaveEncashment,
      reimbursements,
      bonus,
      incentives,
      otherEarnings,
      noticePeriodRecovery,
      loanRecovery,
      assetRecovery,
      taxDeduction,
      pfEsiAdjustment,
      otherDeductions,
      settlementStatus: desiredStatus,
    };

    fnfService.saveSettlement(user?.organizationId, updated, actor);
    refreshData();
    showToast("Settlement Updated", "success", "F&F earnings and deductions saved successfully.");
    setSelectedSettlement(null);
  };

  // Confirm Approval
  const handleConfirmApprove = () => {
    if (!selectedSettlement) return;
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const res = fnfService.approveSettlement(user?.organizationId, selectedSettlement.id, actor, approveComment);

    if (!res.success) {
      showToast("Approval Blocked", "error", res.message);
      return;
    }

    refreshData();
    showToast("Settlement Approved", "success", res.message);
    setShowApproveModal(false);
    setSelectedSettlement(null);
  };

  // Confirm Send Back
  const handleConfirmSendBack = () => {
    if (!selectedSettlement) return;
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const res = fnfService.sendBackSettlement(
      user?.organizationId,
      selectedSettlement.id,
      sendBackReason,
      sendBackComment,
      actor
    );

    if (!res.success) {
      showToast("Send Back Failed", "error", res.message);
      return;
    }

    refreshData();
    showToast("Sent Back to HR", "warning", res.message);
    setShowSendBackModal(false);
    setSelectedSettlement(null);
  };

  // Resubmit Settlement
  const handleResubmit = (item: FnFSettlement) => {
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };
    const res = fnfService.resubmitSettlement(user?.organizationId, item.id, actor, "Resubmitted with corrected figures.");

    if (res.success) {
      refreshData();
      showToast("Settlement Resubmitted", "success", res.message);
    } else {
      showToast("Resubmit Failed", "error", res.message);
    }
  };

  // Confirm Start Payment
  const handleConfirmStartPayment = () => {
    if (!selectedSettlement) return;
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const res = fnfService.startPayment(user?.organizationId, selectedSettlement.id, actor, startPaymentCommentRef.current);

    if (!res.success) {
      showToast("Payment Start Failed", "error", res.message);
      return;
    }

    refreshData();
    showToast("Payment Processing Started", "success", res.message);
    setShowStartPaymentModal(false);
    setSelectedSettlement(null);
  };

  // Confirm Mark Paid
  const handleConfirmMarkPaid = () => {
    if (!selectedSettlement) return;
    if (!paymentReference.trim()) {
      showToast("Validation Error", "error", "UTR / Payment Reference Number is mandatory.");
      return;
    }

    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const res = fnfService.markPaymentPaid(
      user?.organizationId,
      selectedSettlement.id,
      {
        paymentDate,
        paymentReference: paymentReference.trim(),
        paymentMethod,
        bankAccountDetails: bankAccountDetails.trim(),
      },
      actor,
      markPaidCommentRef.current
    );

    if (!res.success) {
      showToast("Payment Completion Failed", "error", res.message);
      return;
    }

    refreshData();
    showToast("Payment Completed", "success", res.message);
    setShowMarkPaidModal(false);
    setSelectedSettlement(null);
  };

  // Confirm Mark Payment Failed
  const handleConfirmMarkFailed = () => {
    if (!selectedSettlement) return;
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };

    const res = fnfService.markPaymentFailed(user?.organizationId, selectedSettlement.id, failureReason, actor);

    if (res.success) {
      refreshData();
      showToast("Payment Status Updated", "warning", res.message);
      setShowMarkFailedModal(false);
      setSelectedSettlement(null);
    }
  };

  // Confirm Retry Payment
  const handleRetryPayment = (item: FnFSettlement) => {
    const actor = { id: (user as any)?.id || user?.email || "usr-finance", name: user?.name || "Finance Manager" };
    const res = fnfService.retryPayment(user?.organizationId, item.id, actor);

    if (res.success) {
      refreshData();
      showToast("Payment Retried", "success", res.message);
    }
  };

  // KPI Metrics Calculation
  const pendingReviewCount = useMemo(
    () => settlements.filter((s) => s.settlementStatus === "PENDING_REVIEW" || s.settlementStatus === "UNDER_REVIEW").length,
    [settlements]
  );

  const approvedCount = useMemo(
    () => settlements.filter((s) => s.settlementStatus === "APPROVED").length,
    [settlements]
  );

  const totalDisbursedAmount = useMemo(
    () => settlements.filter((s) => s.paymentStatus === "PAID").reduce((sum, s) => sum + s.netSettlementPayable, 0),
    [settlements]
  );

  const formatCurrency = (amount: number) => "₹" + amount.toLocaleString("en-IN");

  // Realtime workspace calculations
  const computedGross = salary + gratuity + leaveEncashment + reimbursements + bonus + incentives + otherEarnings;
  const computedDeductions = noticePeriodRecovery + loanRecovery + assetRecovery + taxDeduction + pfEsiAdjustment + otherDeductions;
  const computedNet = computedGross - computedDeductions;

  // Parent exit lookup for clearance check
  const parentExitForSelected = useMemo(() => {
    if (!selectedSettlement) return null;
    const rawExitsSaved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    if (!rawExitsSaved) return null;
    try {
      const exits: ExitEmployee[] = JSON.parse(rawExitsSaved);
      return exits.find((e) => e.id === selectedSettlement.exitId || e.name === selectedSettlement.employeeName) || null;
    } catch {
      return null;
    }
  }, [selectedSettlement]);

  const clearancesDone = parentExitForSelected ? areAllClearancesComplete(parentExitForSelected) : false;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-[#EDE9FE]/10 flex items-center justify-center shadow-inner border border-purple-100/20">
            <IndianRupee size={22} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">
              F&F Settlement & Payment Operations
            </h1>
            <p className="text-[13px] text-muted-foreground font-semibold">
              Dual-lifecycle settlement approval, payment processing, send-back workflow & statements
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all cursor-pointer shadow-sm"
          >
            <Download size={18} />
            Export Filtered CSV
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard
          title="PENDING FINANCE REVIEW"
          value={`${pendingReviewCount}`}
          color="amber"
          icon={Clock}
        />
        <KPICard
          title="APPROVED SETTLEMENTS"
          value={`${approvedCount}`}
          color="green"
          icon={CheckCircle2}
        />
        <KPICard
          title="TOTAL F&F DISBURSED"
          value={formatCurrency(totalDisbursedAmount)}
          color="purple"
          icon={IndianRupee}
        />
      </div>

      {/* OPERATIONAL FILTER BAR */}
      <div className="p-6 bg-card border border-border rounded-[28px] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
            <Filter size={14} className="text-[#00B87C]" />
            <span>F&F Operational Filter Bar</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* 1. Search */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Name, Emp ID, FNF ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30"
            />
          </div>

          {/* 2. Department */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* 3. Settlement Status */}
          <div>
            <select
              value={settlementStatusFilter}
              onChange={(e) => setSettlementStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30"
            >
              <option value="All">All Settlement Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="SENT_BACK">Sent Back</option>
            </select>
          </div>

          {/* 4. Payment Status */}
          <div>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30"
            >
              <option value="All">All Payment Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* 5. Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none"
              title="From LWD Date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none"
              title="To LWD Date"
            />
          </div>
        </div>
      </div>

      {/* SETTLEMENTS TABLE */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
            ACTIVE F&F SETTLEMENT WORKFLOWS
          </h2>
          <span className="text-[11px] font-black text-[#00B87C]">
            Showing {filteredSettlements.length} of {settlements.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  EMPLOYEE & ID
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  LAST WORKING DAY
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  GROSS F&F
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  DEDUCTIONS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  NET PAYABLE
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  SETTLEMENT STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  PAYMENT STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSettlements.map((item, i) => (
                <m.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-muted/30 transition-all h-[64px]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-xs shrink-0">
                        {item.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">
                          {item.employeeName}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {item.employeeId} · {item.department}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-foreground">
                      {item.lwd}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-foreground">
                      {formatCurrency(item.grossSettlement)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[13px] font-bold ${
                        item.totalDeductions > 0 ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {item.totalDeductions > 0 ? `-${formatCurrency(item.totalDeductions)}` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-black text-[#00B87C]">
                      {formatCurrency(item.netSettlementPayable)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SettlementStatusChip status={item.settlementStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentStatusChip status={item.paymentStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* 1. Review & Calculate */}
                      <button
                        onClick={() => openReviewModal(item)}
                        className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-[11px] font-bold text-foreground flex items-center gap-1 transition-all cursor-pointer"
                        title="Review and Edit Calculation"
                      >
                        Review
                        <ChevronRight size={12} />
                      </button>

                      {/* 2. Statement Modal */}
                      <button
                        onClick={() => setStatementSettlement(item)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00B87C] border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="View / Download F&F Statement"
                      >
                        <FileText size={12} /> Statement
                      </button>

                      {/* 2b. Document Center */}
                      <button
                        onClick={() => setDocCenterSettlement(item)}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-[#8B5CF6] border border-purple-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Open F&F Document Center (All 5 Documents)"
                      >
                        <FileText size={12} /> Docs
                      </button>

                      {/* 3. Lifecycle Specific Actions */}
                      {item.settlementStatus === "SENT_BACK" && (
                        <button
                          onClick={() => handleResubmit(item)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RefreshCw size={12} /> Resubmit
                        </button>
                      )}

                      {item.settlementStatus === "APPROVED" && item.paymentStatus === "PENDING" && canManage && (
                        <button
                          onClick={() => {
                            setSelectedSettlement(item);
                            startPaymentCommentRef.current = "";
                            setShowStartPaymentModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <CreditCard size={12} /> Start Payment
                        </button>
                      )}

                      {item.settlementStatus === "APPROVED" && item.paymentStatus === "PROCESSING" && canManage && (
                        <button
                          onClick={() => {
                            setSelectedSettlement(item);
                            setPaymentReference("");
                            markPaidCommentRef.current = "";
                            setShowMarkPaidModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold hover:opacity-90 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        >
                          <CheckCircle2 size={12} /> Mark Paid
                        </button>
                      )}

                      {item.paymentStatus === "FAILED" && canManage && (
                        <button
                          onClick={() => handleRetryPayment(item)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RefreshCw size={12} /> Retry Payment
                        </button>
                      )}
                    </div>
                  </td>
                </m.tr>
              ))}

              {filteredSettlements.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground text-xs font-semibold">
                    No F&F settlement records match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── CALCULATION WORKSPACE MODAL ─── */}
      <AnimatePresence>
        {selectedSettlement && !showApproveModal && !showSendBackModal && !showStartPaymentModal && !showMarkPaidModal && !showMarkFailedModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setSelectedSettlement(null)}
            />
            <m.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-[36px] shadow-2xl overflow-y-auto p-6 md:p-8 space-y-6 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-lg">
                    {selectedSettlement.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <span>{selectedSettlement.employeeName}</span>
                      <SettlementStatusChip status={selectedSettlement.settlementStatus} />
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                      {selectedSettlement.employeeId} · {selectedSettlement.designation} ({selectedSettlement.department}) · LWD: {selectedSettlement.lwd}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Hard Clearance Gate Banner */}
              {!clearancesDone && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-sm">F&F Settlement Approval Blocked</p>
                    <p className="font-normal mt-0.5">
                      F&F settlement cannot be approved until all departmental clearances are completed.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. EARNINGS & ADDITIONS */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#00B87C] pb-2 border-b border-border">
                    1. Earnings & Additions (INR)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Earned Basic Salary Payable
                      </label>
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Gratuity Amount
                      </label>
                      <input
                        type="number"
                        value={gratuity}
                        onChange={(e) => setGratuity(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Leave Encashment
                      </label>
                      <input
                        type="number"
                        value={leaveEncashment}
                        onChange={(e) => setLeaveEncashment(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Reimbursements
                      </label>
                      <input
                        type="number"
                        value={reimbursements}
                        onChange={(e) => setReimbursements(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Bonus Pay
                      </label>
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Incentives / Commission
                      </label>
                      <input
                        type="number"
                        value={incentives}
                        onChange={(e) => setIncentives(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Other Earnings
                      </label>
                      <input
                        type="number"
                        value={otherEarnings}
                        onChange={(e) => setOtherEarnings(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B87C]/30 disabled:opacity-60"
                      />
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between text-xs font-black text-[#00B87C]">
                      <span>GROSS EARNINGS TOTAL</span>
                      <span className="font-mono">{formatCurrency(computedGross)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. DEDUCTIONS & RECOVERIES */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-red-500 pb-2 border-b border-border">
                    2. Deductions & Recoveries (INR)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Notice Period Shortfall Recovery
                      </label>
                      <input
                        type="number"
                        value={noticePeriodRecovery}
                        onChange={(e) => setNoticePeriodRecovery(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Salary Advance / Loan Recovery
                      </label>
                      <input
                        type="number"
                        value={loanRecovery}
                        onChange={(e) => setLoanRecovery(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Asset Damage / Unreturned Asset Recovery
                      </label>
                      <input
                        type="number"
                        value={assetRecovery}
                        onChange={(e) => setAssetRecovery(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Tax / TDS Deduction
                      </label>
                      <input
                        type="number"
                        value={taxDeduction}
                        onChange={(e) => setTaxDeduction(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        PF / ESI Statutory Adjustments
                      </label>
                      <input
                        type="number"
                        value={pfEsiAdjustment}
                        onChange={(e) => setPfEsiAdjustment(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                        Other Deductions
                      </label>
                      <input
                        type="number"
                        value={otherDeductions}
                        onChange={(e) => setOtherDeductions(Number(e.target.value))}
                        disabled={selectedSettlement.settlementStatus === "APPROVED"}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
                      />
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between text-xs font-black text-red-500">
                      <span>TOTAL DEDUCTIONS</span>
                      <span className="font-mono">{formatCurrency(computedDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Settlement Calculation Result */}
              <div className="p-6 rounded-2xl bg-[#00B87C]/10 border border-[#00B87C]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                    NET SETTLEMENT AMOUNT PAYABLE
                  </p>
                  <h3 className="text-3xl font-black font-mono text-[#00B87C]">
                    {formatCurrency(computedNet)}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {selectedSettlement.settlementStatus !== "APPROVED" && (
                    <button
                      onClick={() => handleSaveCalculation(selectedSettlement.settlementStatus)}
                      className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Save size={14} /> Save Calculation
                    </button>
                  )}
                </div>
              </div>

              {/* History & Timeline */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Audit History & Event Timeline
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {selectedSettlement.history.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-muted/20 border border-border/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#00B87C]">{h.event}</span>
                        <span className="text-[10px] text-muted-foreground">{h.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-foreground">
                        Actor: <strong>{h.actorName}</strong>
                      </p>
                      {h.reason && (
                        <p className="text-[11px] text-red-500 font-medium">
                          Reason: {h.reason}
                        </p>
                      )}
                      {h.comment && (
                        <p className="text-[11px] text-muted-foreground italic">
                          "{h.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workspace Modal Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                {/* Send Back Action */}
                {selectedSettlement.settlementStatus !== "APPROVED" && canManage && (
                  <button
                    onClick={() => {
                      setSendBackReason("Incorrect salary calculation");
                      setSendBackComment("");
                      setShowSendBackModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <CornerUpLeft size={14} /> Send Back to HR
                  </button>
                )}

                {/* Approve F&F Action */}
                {selectedSettlement.settlementStatus !== "APPROVED" && canManage && (
                  <button
                    disabled={!clearancesDone}
                    onClick={() => {
                      setApproveComment("");
                      setShowApproveModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Approve F&F Settlement
                  </button>
                )}

                {/* Start Payment Action */}
                {selectedSettlement.settlementStatus === "APPROVED" && selectedSettlement.paymentStatus === "PENDING" && canManage && (
                  <button
                    onClick={() => {
                      startPaymentCommentRef.current = "";
                      setShowStartPaymentModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <CreditCard size={14} /> Start Payment Processing
                  </button>
                )}

                {/* Mark Paid Action */}
                {selectedSettlement.settlementStatus === "APPROVED" && selectedSettlement.paymentStatus === "PROCESSING" && canManage && (
                  <button
                    onClick={() => {
                      setPaymentReference("");
                      markPaidCommentRef.current = "";
                      setShowMarkPaidModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Mark Payment as Paid
                  </button>
                )}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPROVE CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {showApproveModal && selectedSettlement && (
          <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-[32px] p-6 text-left shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center gap-3 text-[#00B87C]">
                <CheckCircle2 size={24} />
                <h3 className="text-lg font-black text-foreground">Approve F&F Settlement</h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Are you sure you want to approve the Full & Final settlement for{" "}
                <strong className="text-foreground">{selectedSettlement.employeeName}</strong>?
              </p>
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-1">
                <p>Employee ID: <strong>{selectedSettlement.employeeId}</strong></p>
                <p>Net Settlement Amount: <strong className="text-[#00B87C] font-mono">{formatCurrency(computedNet)}</strong></p>
                <p>Payment Status will be set to: <strong>PENDING</strong></p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Approval Comment (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved after full departmental clearance."
                  value={approveComment}
                  onChange={(e) => setApproveComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApprove}
                  className="flex-1 py-2.5 rounded-xl bg-[#00B87C] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Confirm Approval
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SEND BACK MODAL ─── */}
      <AnimatePresence>
        {showSendBackModal && selectedSettlement && (
          <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-[32px] p-6 text-left shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center gap-3 text-red-500">
                <CornerUpLeft size={24} />
                <h3 className="text-lg font-black text-foreground">Send Back Settlement to HR</h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Specify the mandatory reason for sending this settlement back for correction:
              </p>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Reason *
                </label>
                <select
                  value={sendBackReason}
                  onChange={(e) => setSendBackReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="Incorrect salary calculation">Incorrect salary calculation</option>
                  <option value="Missing clearance">Missing clearance</option>
                  <option value="Incorrect leave encashment">Incorrect leave encashment</option>
                  <option value="Asset recovery mismatch">Asset recovery mismatch</option>
                  <option value="Tax discrepancy">Tax discrepancy</option>
                  <option value="Missing documentation">Missing documentation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Notes / Explanation
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide details on what needs correction..."
                  value={sendBackComment}
                  onChange={(e) => setSendBackComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSendBackModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSendBack}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Confirm Send Back
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── START PAYMENT MODAL ─── */}
      <AnimatePresence>
        {showStartPaymentModal && selectedSettlement && (
          <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-[32px] p-6 text-left shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center gap-3 text-blue-600">
                <CreditCard size={24} />
                <h3 className="text-lg font-black text-foreground">Start Payment Processing</h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Start payment processing for{" "}
                <strong className="text-foreground">{selectedSettlement.employeeName}</strong>?
              </p>
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-1">
                <p>Net Settlement Amount: <strong className="text-[#00B87C] font-mono">{formatCurrency(selectedSettlement.netSettlementPayable)}</strong></p>
                <p>Status Transition: <strong>PENDING → PROCESSING</strong></p>
              </div>
              <p className="text-[11px] text-muted-foreground italic bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                * Note: Bank payment connectivity is simulated until external payment gateway integration.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowStartPaymentModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStartPayment}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Start Processing
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MARK PAID MODAL ─── */}
      <AnimatePresence>
        {showMarkPaidModal && selectedSettlement && (
          <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-[32px] p-6 text-left shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center gap-3 text-[#00B87C]">
                <CheckCircle2 size={24} />
                <h3 className="text-lg font-black text-foreground">Mark Payment as Paid</h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Record bank disbursement reference for{" "}
                <strong className="text-foreground">{selectedSettlement.employeeName}</strong>:
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    UTR / Bank Reference Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-99882736412"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
                    <option value="Bank Transfer (RTGS)">Bank Transfer (RTGS)</option>
                    <option value="Bank Transfer (IMPS)">Bank Transfer (IMPS)</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Beneficiary Bank Account
                  </label>
                  <input
                    type="text"
                    placeholder="HDFC Bank · A/C Ending in ****4829"
                    value={bankAccountDetails}
                    onChange={(e) => setBankAccountDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowMarkPaidModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMarkPaid}
                  className="flex-1 py-2.5 rounded-xl bg-[#00B87C] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Confirm Paid
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── STATEMENT MODAL ─── */}
      {statementSettlement && (
        <SettlementStatementModal
          settlement={statementSettlement}
          onClose={() => setStatementSettlement(null)}
        />
      )}

      {/* ─── DOCUMENT CENTER MODAL ─── */}
      {docCenterSettlement && (
        <FnFDocumentCenterModal
          settlement={docCenterSettlement}
          onClose={() => setDocCenterSettlement(null)}
        />
      )}
    </div>
  );
}
