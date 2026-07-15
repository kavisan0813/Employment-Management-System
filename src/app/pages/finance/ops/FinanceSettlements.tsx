import { useState } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Download,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../../components/workflow/ToastNotification";
import { publishClearance } from "../../../features/Offboarding/services/offboardingWorkflow";

/* ─── Types ─── */
interface SettlementComponent {
  label: string;
  amount: number;
}

interface FFSettlement {
  id: string;
  employeeName: string;
  designation: string;
  department: string;
  initial: string;
  lastDate: string;
  grossFF: number;
  deductions: number;
  netFF: number;
  status: "Pending" | "Approved" | "Rejected";
  components: SettlementComponent[];
  deductionItems: SettlementComponent[];
}

/* ─── Mock Data ─── */
const SETTLEMENTS: FFSettlement[] = [
  {
    id: "s1",
    employeeName: "James Carter",
    designation: "Senior Finance Analyst",
    department: "Finance",
    initial: "JC",
    lastDate: "Apr 10, 2026",
    grossFF: 173200,
    deductions: 0,
    netFF: 173200,
    status: "Pending",
    components: [
      { label: "Last Working Month Salary", amount: 85000 },
      { label: "Gratuity", amount: 43200 },
      { label: "Leave Encashment (18 days)", amount: 35000 },
      { label: "Pending Reimbursements", amount: 10000 },
    ],
    deductionItems: [],
  },
  {
    id: "s2",
    employeeName: "Ravi Kumar",
    designation: "Marketing Lead",
    department: "Marketing",
    initial: "RK",
    lastDate: "Apr 20, 2026",
    grossFF: 240000,
    deductions: 15000,
    netFF: 225000,
    status: "Pending",
    components: [
      { label: "Last Working Month Salary", amount: 120000 },
      { label: "Gratuity", amount: 58000 },
      { label: "Leave Encashment (22 days)", amount: 44000 },
      { label: "Pending Reimbursements", amount: 18000 },
    ],
    deductionItems: [
      { label: "Asset Loss Deductions", amount: 10000 },
      { label: "Unpaid Leave Adjustments", amount: 5000 },
    ],
  },
  {
    id: "s3",
    employeeName: "Priya Sharma",
    designation: "HR Executive",
    department: "Human Resources",
    initial: "PS",
    lastDate: "Mar 28, 2026",
    grossFF: 156000,
    deductions: 5000,
    netFF: 151000,
    status: "Approved",
    components: [
      { label: "Last Working Month Salary", amount: 72000 },
      { label: "Gratuity", amount: 38000 },
      { label: "Leave Encashment (15 days)", amount: 26000 },
      { label: "Pending Reimbursements", amount: 20000 },
    ],
    deductionItems: [{ label: "Asset Loss Deductions", amount: 5000 }],
  },
  {
    id: "s4",
    employeeName: "Amit Verma",
    designation: "Software Engineer",
    department: "Engineering",
    initial: "AV",
    lastDate: "Mar 15, 2026",
    grossFF: 310000,
    deductions: 12000,
    netFF: 298000,
    status: "Approved",
    components: [
      { label: "Last Working Month Salary", amount: 160000 },
      { label: "Gratuity", amount: 75000 },
      { label: "Leave Encashment (20 days)", amount: 55000 },
      { label: "Pending Reimbursements", amount: 20000 },
    ],
    deductionItems: [
      { label: "Asset Loss Deductions", amount: 8000 },
      { label: "Unpaid Leave Adjustments", amount: 4000 },
    ],
  },
];

const formatCurrency = (amount: number) => "₹" + amount.toLocaleString("en-IN");

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
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group"
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
    Approved: "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
    Rejected: "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20",
  };
  const labels: Record<string, string> = {
    Pending: "⏳ Pending",
    Approved: "✓ Approved",
    Rejected: "✗ Rejected",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border flex items-center w-fit gap-1.5 ${styles[status] || styles.Pending}`}
    >
      {labels[status] || status}
    </span>
  );
}

/* ─── Main Component ─── */
export function FinanceSettlements() {
  const [settlements, setSettlements] = useState<FFSettlement[]>(SETTLEMENTS);
  const [selectedSettlement, setSelectedSettlement] =
    useState<FFSettlement | null>(null);
  const [rejectingSettlement, setRejectingSettlement] =
    useState<FFSettlement | null>(null);
  const [processingSettlement, setProcessingSettlement] =
    useState<FFSettlement | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [transferRef, setTransferRef] = useState("");

  const pendingCount = settlements.filter((s) => s.status === "Pending").length;
  const approvedThisMonth = settlements.filter(
    (s) => s.status === "Approved",
  ).length;
  const totalDisbursed = settlements
    .filter((s) => s.status === "Approved")
    .reduce((sum, s) => sum + s.netFF, 0);

  const handleApprove = () => {
    if (!processingSettlement) return;
    setApprovalLoading(true);
    setTimeout(() => {
      setApprovalLoading(false);
      setSettlements((prev) =>
        prev.map((s) =>
          s.id === processingSettlement.id ? { ...s, status: "Approved" } : s,
        ),
      );
      publishClearance(processingSettlement.employeeName, "Finance");
      showToast(
        "Settlement Processed",
        "success",
        `F&F settlement for ${processingSettlement.employeeName} processed successfully. Transfer Ref: ${transferRef}`,
      );
      setProcessingSettlement(null);
      setSelectedSettlement(null);
      setTransferRef("");
    }, 1000);
  };

  const handleReject = () => {
    if (rejectingSettlement) {
      setSettlements((prev) =>
        prev.map((s) =>
          s.id === rejectingSettlement.id ? { ...s, status: "Rejected" } : s,
        ),
      );
      showToast(
        "Settlement Rejected",
        "success",
        `Settlement sent back to HR for ${rejectingSettlement.employeeName}.`,
      );
      setRejectingSettlement(null);
      setSelectedSettlement(null);
      setRejectReason("");
    }
  };

  const handleExport = () => {
    showToast("Exporting", "info", "Downloading F&F Settlements CSV...");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-[#EDE9FE]/10 flex items-center justify-center shadow-inner border border-purple-100/20">
            <IndianRupee size={22} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              F&F Settlement Approvals
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Review and approve final full and final settlement for exiting
              employees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard
          title="PENDING APPROVAL"
          value={`${pendingCount}`}
          color="amber"
          icon={Clock}
        />
        <KPICard
          title="APPROVED THIS MONTH"
          value={`${approvedThisMonth}`}
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

      {/* F&F SETTLEMENT TABLE */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between bg-card">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
            F&F SETTLEMENTS
          </h2>
          <span className="text-[11px] font-black text-[#00B87C]">
            {pendingCount} pending
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
                  NET F&F
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
              {settlements.map((item, i) => (
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
                        {item.initial}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">
                          {item.employeeName}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {item.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-foreground">
                      {item.lastDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-foreground">
                      {formatCurrency(item.grossFF)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[13px] font-bold ${item.deductions > 0 ? "text-[#EF4444]" : "text-muted-foreground"}`}
                    >
                      {item.deductions > 0
                        ? `-${formatCurrency(item.deductions)}`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-[#00B87C]">
                      {formatCurrency(item.netFF)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusChip status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {item.status === "Pending" ? (
                        <button
                          onClick={() => setSelectedSettlement(item)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
                        >
                          Review
                          <ChevronRight size={14} strokeWidth={3} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedSettlement(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                        >
                          View
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SETTLEMENT REVIEW MODAL ─── */}
      <AnimatePresence>
        {selectedSettlement && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setSelectedSettlement(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[520px] bg-card rounded-[40px] overflow-hidden shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                    <IndianRupee size={22} className="text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-foreground tracking-tight">
                      F&F Settlement Review
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      {selectedSettlement.employeeName} ·{" "}
                      {selectedSettlement.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 space-y-6 max-h-[55vh] overflow-y-auto">
                {/* Components */}
                <div>
                  <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                    Settlement Components
                  </p>
                  <div className="space-y-2.5">
                    {selectedSettlement.components.map((comp, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-[12px] font-medium text-foreground">
                          {comp.label}
                        </span>
                        <span className="text-[12px] font-bold text-foreground">
                          {formatCurrency(comp.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Deductions */}
                {selectedSettlement.deductionItems.length > 0 && (
                  <>
                    <div>
                      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                        Deductions
                      </p>
                      <div className="space-y-2.5">
                        {selectedSettlement.deductionItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2"
                          >
                            <span className="text-[12px] font-medium text-[#EF4444]">
                              {item.label}
                            </span>
                            <span className="text-[12px] font-bold text-[#EF4444]">
                              -{formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border" />
                  </>
                )}

                {/* Net Total */}
                <div className="bg-[#F0FDF4] dark:bg-[#00B87C]/5 rounded-2xl p-5 border border-[#00B87C]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-widest">
                        Net F&F Amount
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        Gross: {formatCurrency(selectedSettlement.grossFF)} ·
                        Deductions:{" "}
                        {formatCurrency(selectedSettlement.deductions)}
                      </p>
                    </div>
                    <span className="text-[22px] font-black text-[#00B87C] tracking-tight">
                      {formatCurrency(selectedSettlement.netFF)}
                    </span>
                  </div>
                </div>

                {selectedSettlement.status === "Approved" && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/20">
                    <CheckCircle2 size={16} className="text-[#00B87C]" />
                    <span className="text-[12px] font-bold text-[#00B87C]">
                      Settlement approved and ready for disbursement
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/5">
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all"
                >
                  Close
                </button>
                <div className="flex items-center gap-3">
                  {selectedSettlement.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          setRejectingSettlement(selectedSettlement)
                        }
                        className="px-5 py-2.5 rounded-xl border border-[#EF4444]/30 text-[#EF4444] text-[11px] font-bold uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5"
                      >
                        <X size={14} /> Send Back to HR
                      </button>
                      <button
                        onClick={() =>
                          setProcessingSettlement(selectedSettlement)
                        }
                        className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} /> Process Settlement
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {rejectingSettlement && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setRejectingSettlement(null)}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 shadow-inner">
                  <X size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  Send Back to HR
                </h3>
                <p className="text-[13px] font-bold text-muted-foreground mt-2 mb-6">
                  Are you sure you want to reject the settlement for{" "}
                  {rejectingSettlement.employeeName}?
                </p>

                <div className="w-full text-left space-y-4">
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">
                      Rejection Reason
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className="absolute left-3.5 top-3 text-muted-foreground"
                        size={16}
                      />
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide a reason for sending back..."
                        className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 h-24 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 flex items-center gap-3">
                <button
                  onClick={() => setRejectingSettlement(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROCESS MODAL */}
      <AnimatePresence>
        {processingSettlement && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setProcessingSettlement(null)}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  Process Settlement
                </h3>
                <p className="text-[13px] font-bold text-muted-foreground mt-2 mb-6">
                  Process final settlement for{" "}
                  {processingSettlement.employeeName}
                </p>

                <div className="w-full text-left space-y-4">
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">
                      Net Amount
                    </label>
                    <div className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-black text-[#00B87C]">
                      {formatCurrency(processingSettlement.netFF)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">
                      Transfer Reference Number
                    </label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="e.g. TRN-987654321"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 flex items-center gap-3">
                <button
                  onClick={() => setProcessingSettlement(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!transferRef.trim() || approvalLoading}
                  className="flex-1 py-3.5 rounded-2xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {approvalLoading ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
