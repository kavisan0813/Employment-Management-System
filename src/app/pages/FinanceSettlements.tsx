import { useState } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Download,
  Search,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
    deductionItems: [
      { label: "Asset Loss Deductions", amount: 5000 },
    ],
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

const formatCurrency = (amount: number) =>
  "₹" + amount.toLocaleString("en-IN");

/* ─── KPI Card ─── */
function KPICard({ title, value, color, icon: Icon }: {
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
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm hover:shadow-md transition-all group"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors[color].bg }}
      >
        <Icon size={24} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.8px] mb-2">{title}</p>
      <h3 className="text-3xl font-black tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
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
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center w-fit gap-1.5 ${styles[status] || styles.Pending}`}>
      {labels[status] || status}
    </span>
  );
}

/* ─── Main Component ─── */
export function FinanceSettlements() {
  const [selectedSettlement, setSelectedSettlement] = useState<FFSettlement | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const pendingCount = SETTLEMENTS.filter(s => s.status === "Pending").length;
  const approvedThisMonth = SETTLEMENTS.filter(s => s.status === "Approved").length;
  const totalDisbursed = SETTLEMENTS
    .filter(s => s.status === "Approved")
    .reduce((sum, s) => sum + s.netFF, 0);

  const handleApprove = () => {
    if (!selectedSettlement) return;
    setApprovalLoading(true);
    setTimeout(() => {
      setApprovalLoading(false);
      setSelectedSettlement(null);
    }, 1000);
  };

  const totalPending = SETTLEMENTS.reduce((s, i) => s + (i.status === "Pending" ? i.netFF : 0), 0);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] dark:bg-[#EDE9FE]/10 flex items-center justify-center shadow-inner border border-purple-100/20">
            <IndianRupee size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">F&F Settlement Approvals</h1>
            <p className="text-[13px] font-semibold text-muted-foreground">Review and approve final full and final settlement for exiting employees</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all">
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
          <span className="text-[11px] font-black text-[#00B87C]">{pendingCount} pending</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">EMPLOYEE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">LAST DATE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">GROSS F&F</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">DEDUCTIONS</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">NET F&F</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">STATUS</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SETTLEMENTS.map((item, i) => (
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
                        <p className="text-[13px] font-bold text-foreground">{item.employeeName}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">{item.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-foreground">{item.lastDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-foreground">{formatCurrency(item.grossFF)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[13px] font-bold ${item.deductions > 0 ? "text-[#EF4444]" : "text-muted-foreground"}`}>
                      {item.deductions > 0 ? `-${formatCurrency(item.deductions)}` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-[#00B87C]">{formatCurrency(item.netFF)}</span>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
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
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                    <IndianRupee size={22} className="text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-foreground tracking-tight">F&F Settlement Review</h3>
                    <p className="text-[12px] font-bold text-muted-foreground">{selectedSettlement.employeeName} · {selectedSettlement.department}</p>
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
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Settlement Components</p>
                  <div className="space-y-2.5">
                    {selectedSettlement.components.map((comp, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <span className="text-[12px] font-medium text-foreground">{comp.label}</span>
                        <span className="text-[12px] font-bold text-foreground">{formatCurrency(comp.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Deductions */}
                {selectedSettlement.deductionItems.length > 0 && (
                  <>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Deductions</p>
                      <div className="space-y-2.5">
                        {selectedSettlement.deductionItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <span className="text-[12px] font-medium text-[#EF4444]">{item.label}</span>
                            <span className="text-[12px] font-bold text-[#EF4444]">-{formatCurrency(item.amount)}</span>
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
                      <p className="text-[10px] font-black text-[#00B87C] uppercase tracking-widest">Net F&F Amount</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Gross: {formatCurrency(selectedSettlement.grossFF)} · Deductions: {formatCurrency(selectedSettlement.deductions)}</p>
                    </div>
                    <span className="text-[22px] font-black text-[#00B87C] tracking-tight">{formatCurrency(selectedSettlement.netFF)}</span>
                  </div>
                </div>

                {selectedSettlement.status === "Approved" && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/20">
                    <CheckCircle2 size={16} className="text-[#00B87C]" />
                    <span className="text-[12px] font-bold text-[#00B87C]">Settlement approved and ready for disbursement</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/5">
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                >
                  Close
                </button>
                <div className="flex items-center gap-3">
                  {selectedSettlement.status === "Pending" && (
                    <>
                      <button className="px-5 py-2.5 rounded-xl border border-[#EF4444]/30 text-[#EF4444] text-[11px] font-black uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5">
                        <X size={14} /> Send Back to HR
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={approvalLoading}
                        className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {approvalLoading ? (
                          "Processing..."
                        ) : (
                          <><CheckCircle2 size={14} /> Approve Settlement</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
