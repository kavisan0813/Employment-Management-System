import { useState, useEffect } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Download,
  MessageSquare,
  Plus,
  Trash2,
  Lock,
  Save,
  Send,
  CornerUpLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  OFFBOARDING_EXITS_KEY,
  OFFBOARDING_UPDATED_EVENT,
} from "../../../features/Offboarding/services/offboardingWorkflow";
import type { ExitEmployee } from "../../../features/Offboarding/types/offboarding.types";
import { EXITS } from "../../../features/Offboarding/data/mockExits";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import { useAuth } from "../../../context/AuthContext";

/* ─── Helper to read/write state ─── */
const readExits = (): ExitEmployee[] => {
  const saved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return EXITS;
    }
  }
  // Initialize with mock exits if not set
  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(EXITS));
  return EXITS;
};

/* ─── KPI Card ─── */
function KPICard({
  title,
  value,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  color: "amber" | "green" | "purple";
  icon: React.ElementType;
}) {
  const colors = {
    amber: { text: "#D97706", bg: "#FEF3C7", iconColor: "#D97706" },
    green: { text: "#00B87C", bg: "#DCFCE7", iconColor: "#10B981" },
    purple: { text: "#8B5CF6", bg: "#EDE9FE", iconColor: "#8B5CF6" },
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm transition-all group"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors[color].bg }}
      >
        <Icon size={18} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
        {title}
      </p>
      <h3
        className="text-[28px] font-bold tracking-tighter"
        style={{ color: colors[color].text }}
      >
        {value}
      </h3>
    </motion.div>
  );
}

/* ─── Status Chip ─── */
function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
    "Awaiting Finance Clearance": "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
    Draft: "bg-[#EDE9FE] text-[#8B5CF6] border-[#8B5CF6]/20",
    "Approved & Processed": "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
    "Sent Back to HR": "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20",
  };
  const labels: Record<string, string> = {
    Pending: "⏳ Pending HR",
    "Awaiting Finance Clearance": "⏳ Finance Review",
    Draft: "📝 Draft F&F",
    "Approved & Processed": "✓ Approved",
    "Sent Back to HR": "✗ Sent Back",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border flex items-center w-fit gap-1.5 ${
        styles[status] || "bg-[#FFFBEB] text-[#D97706]"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export function FinanceSettlements() {
  const { user } = useAuth();
  const [exits, setExits] = useState<ExitEmployee[]>(readExits);
  const [selectedExit, setSelectedExit] = useState<ExitEmployee | null>(null);

  // Clearance and F&F edit permission
  const canManage = usePermissionKey(P.OFFBOARDING_FINANCE_MANAGE);

  // F&F Calculation Form State
  const [salary, setSalary] = useState(0);
  const [gratuity, setGratuity] = useState(0);
  const [leaveEncashment, setLeaveEncashment] = useState(0);
  const [reimbursements, setReimbursements] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [incentives, setIncentives] = useState(0);
  const [otherEarnings, setOtherEarnings] = useState(0);

  const [noticePeriodRecovery, setNoticePeriodRecovery] = useState(0);
  const [loanRecovery, setLoanRecovery] = useState(0);
  const [assetRecovery, setAssetRecovery] = useState(0);
  const [taxDeduction, setTaxDeduction] = useState(0);
  const [pfEsiAdjustment, setPfEsiAdjustment] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const [comments, setComments] = useState("");

  // Sync state on localStorage changes
  useEffect(() => {
    const refresh = () => setExits(readExits());
    window.addEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const openReviewModal = (employee: ExitEmployee) => {
    setSelectedExit(employee);
    setSalary(employee.salary || 0);
    setGratuity(employee.gratuity || 0);
    setLeaveEncashment(employee.leaveEncashment || 0);
    setReimbursements(employee.reimbursements || 0);
    setBonus(employee.bonus || 0);
    setIncentives(employee.incentives || 0);
    setOtherEarnings(employee.otherEarnings || 0);

    setNoticePeriodRecovery(employee.noticePeriodRecovery || 0);
    setLoanRecovery(employee.loanRecovery || 0);
    setAssetRecovery(employee.assetRecovery || 0);
    setTaxDeduction(employee.taxDeduction || 0);
    setPfEsiAdjustment(employee.pfEsiAdjustment || 0);
    setOtherDeductions(employee.otherDeductions || employee.deductions || 0);
    setComments("");
  };

  const handleSave = (status: string) => {
    if (!selectedExit) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const timelineDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const gross = salary + gratuity + leaveEncashment + reimbursements + bonus + incentives + otherEarnings;
    const deductionsTotal = noticePeriodRecovery + loanRecovery + assetRecovery + taxDeduction + pfEsiAdjustment + otherDeductions;
    const net = gross - deductionsTotal;

    const updatedExits = exits.map((exit) => {
      if (exit.id !== selectedExit.id) return exit;

      let clearance = exit.clearance;
      let timeline = exit.timeline;

      if (status === "Approved & Processed") {
        clearance = exit.clearance.map((c) =>
          c.dept === "Finance"
            ? {
                ...c,
                status: "cleared" as const,
                approvedBy: user?.name || "Finance Manager",
                approvedDate: dateStr,
                approvedTime: timeStr,
                comments: comments || "F&F Settlement processed and approved.",
              }
            : c,
        );
        timeline = [
          ...exit.timeline.filter((t) => t.label !== "Finance Clearance Signed Off" && t.label !== "F&F Settlement Approved"),
          {
            label: "Finance Clearance Signed Off",
            date: timelineDate,
            status: "done" as const,
          },
          {
            label: "F&F Settlement Approved",
            date: timelineDate,
            status: "done" as const,
          },
        ];
      } else if (status === "Sent Back to HR") {
        timeline = [
          ...exit.timeline,
          {
            label: `Settlement Sent Back to HR: "${comments}"`,
            date: timelineDate,
            status: "active" as const,
          },
        ];
      }

      // Recalculate progress ratio
      const clearances = clearance.filter((item) => item.status === "cleared").length;
      const returnedAssets = exit.assets.filter((item) => item.status === "returned").length;
      const docs = exit.documents;
      const uploadedDocs = docs.filter((item) => item.status === "uploaded").length;
      const progress = Math.round(
        (clearances / Math.max(clearance.length, 1)) * 50 +
          (returnedAssets / Math.max(exit.assets.length, 1)) * 25 +
          (uploadedDocs / Math.max(docs.length, 1)) * 25,
      );

      return {
        ...exit,
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
        totalEarnings: gross,
        totalDeductions: deductionsTotal,
        netAmount: net,
        ffStatus: status,
        ffApprovedBy: status === "Approved & Processed" ? (user?.name || "Finance Manager") : undefined,
        ffApprovedDate: status === "Approved & Processed" ? dateStr : undefined,
        clearance,
        timeline,
        progress,
      };
    });

    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updatedExits));
    setExits(updatedExits);
    window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));

    showToast(
      status === "Approved & Processed" ? "F&F Approved" : status === "Draft" ? "Draft Saved" : "Sent Back to HR",
      "success",
      `Full & Final settlement status updated to: ${status}`,
    );
    setSelectedExit(null);
  };

  const pendingExits = exits.filter(
    (e) => e.ffStatus === "Pending" || e.ffStatus === "Awaiting Finance Clearance" || e.ffStatus === "Draft",
  );
  const approvedExits = exits.filter((e) => e.ffStatus === "Approved & Processed");
  const totalDisbursed = approvedExits.reduce((sum, e) => sum + e.netAmount, 0);

  const formatCurrency = (amount: number) => "₹" + amount.toLocaleString("en-IN");

  const handleExport = () => {
    const csvContent =
      "Employee,Last Date,Gross,Deductions,Net Settlement,Status\n" +
      exits
        .map((e) => {
          const gross = e.totalEarnings || e.salary + e.gratuity + e.leaveEncashment + e.reimbursements;
          const ded = e.totalDeductions || e.deductions;
          return `"${e.name}","${e.lwd}",${gross},${ded},${e.netAmount},"${e.ffStatus}"`;
        })
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FF_Settlements_Report_${Date.now()}.csv`;
    link.click();
    showToast("Export Completed", "success", "F&F Settlement list downloaded.");
  };

  // Real-time calculations for form
  const computedGross = salary + gratuity + leaveEncashment + reimbursements + bonus + incentives + otherEarnings;
  const computedDeductions =
    noticePeriodRecovery + loanRecovery + assetRecovery + taxDeduction + pfEsiAdjustment + otherDeductions;
  const computedNet = computedGross - computedDeductions;

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
              F&F Settlement Calculation
            </h1>
            <p className="text-[13px] text-muted-foreground font-semibold">
              Calculate earnings, deductions, and finalize F&F Settlements for exiting employees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all cursor-pointer"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard
          title="PENDING FINANCE REVIEW"
          value={`${pendingExits.length}`}
          color="amber"
          icon={Clock}
        />
        <KPICard
          title="APPROVED SETTLEMENTS"
          value={`${approvedExits.length}`}
          color="green"
          icon={CheckCircle2}
        />
        <KPICard
          title="TOTAL F&F DISBURSED"
          value={formatCurrency(totalDisbursed)}
          color="purple"
          icon={IndianRupee}
        />
      </div>

      {/* SETTLEMENTS TABLE */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
            ACTIVE F&F WORKFLOWS
          </h2>
          <span className="text-[11px] font-black text-[#00B87C]">
            {pendingExits.length} pending calculation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 dark:bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  EMPLOYEE
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  LAST DATE
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  GROSS F&F
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  DEDUCTIONS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  NET SETTLEMENT
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exits.map((item, i) => {
                const gross =
                  item.totalEarnings ||
                  item.salary + item.gratuity + item.leaveEncashment + item.reimbursements;
                const ded = item.totalDeductions || item.deductions;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-muted/30 transition-all h-[64px]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-xs shrink-0">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {item.designation} · {item.department}
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
                        {formatCurrency(gross)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[13px] font-bold ${
                          ded > 0 ? "text-[#EF4444]" : "text-muted-foreground"
                        }`}
                      >
                        {ded > 0 ? `-${formatCurrency(ded)}` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-[#00B87C]">
                        {formatCurrency(item.netAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip status={item.ffStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {item.ffStatus !== "Approved & Processed" ? (
                          <button
                            onClick={() => openReviewModal(item)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm cursor-pointer"
                          >
                            Calculate
                            <ChevronRight size={14} strokeWidth={3} />
                          </button>
                        ) : (
                          <button
                            onClick={() => openReviewModal(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                          >
                            View Summary
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── CALCULATION WORKSPACE MODAL ─── */}
      <AnimatePresence>
        {selectedExit && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setSelectedExit(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[900px] bg-card rounded-[40px] overflow-hidden shadow-2xl border border-border flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-5 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center shadow-inner border border-purple-100">
                    <IndianRupee size={22} className="text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-foreground tracking-tight flex items-center gap-2">
                      F&F Settlement Workspace
                      {!canManage && (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                          <Lock size={10} /> Read Only
                        </span>
                      )}
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      {selectedExit.name} · {selectedExit.designation} ({selectedExit.department})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExit(null)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT COLUMN: EARNINGS */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider border-b border-[#00B87C]/20 pb-2">
                    Total Earnings
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                        Pending Salary
                      </label>
                      <input
                        type="number"
                        disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                        Leave Encashment
                      </label>
                      <input
                        type="number"
                        disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                        value={leaveEncashment}
                        onChange={(e) => setLeaveEncashment(Number(e.target.value))}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Bonus
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={bonus}
                          onChange={(e) => setBonus(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Incentives
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={incentives}
                          onChange={(e) => setIncentives(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                        Pending Reimbursements
                      </label>
                      <input
                        type="number"
                        disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                        value={reimbursements}
                        onChange={(e) => setReimbursements(Number(e.target.value))}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Gratuity
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={gratuity}
                          onChange={(e) => setGratuity(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Other Earnings
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={otherEarnings}
                          onChange={(e) => setOtherEarnings(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: DEDUCTIONS */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-red-500 uppercase tracking-wider border-b border-red-200/20 pb-2">
                    Total Deductions
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                        Notice Period Recovery
                      </label>
                      <input
                        type="number"
                        disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                        value={noticePeriodRecovery}
                        onChange={(e) => setNoticePeriodRecovery(Number(e.target.value))}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Loan Recovery
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={loanRecovery}
                          onChange={(e) => setLoanRecovery(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Asset Recovery / Loss
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={assetRecovery}
                          onChange={(e) => setAssetRecovery(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                        Tax Deduction (TDS)
                      </label>
                      <input
                        type="number"
                        disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                        value={taxDeduction}
                        onChange={(e) => setTaxDeduction(Number(e.target.value))}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          PF / ESI Adjustments
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={pfEsiAdjustment}
                          onChange={(e) => setPfEsiAdjustment(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                          Other Deductions
                        </label>
                        <input
                          type="number"
                          disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                          value={otherDeductions}
                          onChange={(e) => setOtherDeductions(Number(e.target.value))}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SUMMARY: FULL SPAN */}
                <div className="col-span-1 md:col-span-2 bg-[#F0FDF4] dark:bg-[#00B87C]/5 p-6 rounded-3xl border border-[#00B87C]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest">
                      Live Settlement Calculation
                    </p>
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Gross Earnings: <strong className="text-foreground">{formatCurrency(computedGross)}</strong> ·
                      Deductions: <strong className="text-foreground">{formatCurrency(computedDeductions)}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Net Payable</p>
                    <p className="text-[26px] font-black text-[#00B87C] tracking-tight">{formatCurrency(computedNet)}</p>
                  </div>
                </div>

                {/* COMMENTS PANEL: FULL SPAN */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block">
                    Settlement Workflow Comments / Rejection Notes
                  </label>
                  <textarea
                    disabled={!canManage || selectedExit.ffStatus === "Approved & Processed"}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter approval details or audit notes..."
                    rows={3}
                    className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-border flex items-center justify-between shrink-0 bg-muted/5">
                <button
                  onClick={() => setSelectedExit(null)}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all cursor-pointer"
                >
                  Close
                </button>
                {canManage && selectedExit.ffStatus !== "Approved & Processed" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSave("Sent Back to HR")}
                      className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-wider hover:bg-red-500/5 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CornerUpLeft size={14} /> Send Back to HR
                    </button>
                    <button
                      onClick={() => handleSave("Draft")}
                      className="px-5 py-2.5 rounded-xl border border-border text-foreground text-[11px] font-black uppercase tracking-wider hover:bg-muted transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Draft
                    </button>
                    <button
                      onClick={() => handleSave("Approved & Processed")}
                      className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={14} /> Approve F&F
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
