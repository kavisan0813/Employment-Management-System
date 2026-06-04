import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  IndianRupee, Users, Check, Calendar, Receipt,
  Activity, CheckCircle, BarChart3, ChevronRight, Zap, Download,
  FileSpreadsheet, ShieldCheck, X, AlertCircle, AlertTriangle,
  TrendingUp, FileText, Building2, ArrowRight, Lock
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const PAYROLL_TREND_12M = [
  { month: "Apr 25", cost: 24.2 },
  { month: "May 25", cost: 24.5 },
  { month: "Jun 25", cost: 25.1 },
  { month: "Jul 25", cost: 25.8 },
  { month: "Aug 25", cost: 26.2 },
  { month: "Sep 25", cost: 26.8 },
  { month: "Oct 25", cost: 27.1 },
  { month: "Nov 25", cost: 27.5 },
  { month: "Dec 25", cost: 27.8 },
  { month: "Jan 26", cost: 28.1 },
  { month: "Feb 26", cost: 28.2 },
  { month: "Mar 26", cost: 28.4 },
];

const COMPONENT_BREAKDOWN = [
  { name: "Basic", value: 50, color: "#8B5CF6" },
  { name: "HRA", value: 20, color: "#00B87C" },
  { name: "Allowances", value: 15, color: "#F59E0B" },
  { name: "Bonus", value: 10, color: "#3B82F6" },
  { name: "Others", value: 5, color: "#64748B" },
];

const INITIAL_EXPENSES = [
  { id: "EXP-1284", employee: "Sarah Chen", empId: "EMP-1284", category: "Travel", amount: "₹4,250", amountNum: 4250, submitted: "2h ago", status: "Pending", avatar: "SC" },
  { id: "EXP-1285", employee: "Michael Roe", empId: "EMP-1285", category: "Hardware", amount: "₹12,800", amountNum: 12800, submitted: "5h ago", status: "Pending", avatar: "MR" },
  { id: "EXP-1286", employee: "David Smith", empId: "EMP-1286", category: "Software", amount: "₹1,200", amountNum: 1200, submitted: "1d ago", status: "Pending", avatar: "DS" },
  { id: "EXP-1287", employee: "Emily Chen", empId: "EMP-1287", category: "Events", amount: "₹8,500", amountNum: 8500, submitted: "1d ago", status: "Pending", avatar: "EC" },
  { id: "EXP-1288", employee: "Alex John", empId: "EMP-1288", category: "Travel", amount: "₹2,100", amountNum: 2100, submitted: "2d ago", status: "Pending", avatar: "AJ" },
];

const DEADLINES = [
  { title: "PF Payment Done", date: "Apr 10", status: "Done", desc: "Completed on schedule" },
  { title: "TDS Filing", date: "Apr 15", status: "Active", desc: "In progress — Action required" },
  { title: "Payroll Lock", date: "Apr 20", status: "Pending", desc: "Upcoming requirement" },
  { title: "Payroll Run", date: "Apr 28", status: "Pending", desc: "Upcoming requirement" },
];

const SALARY_DIST = [
  { label: "<₹30K", value: 450, total: 450, color: "#8B5CF6" },
  { label: "₹30-50K", value: 380, total: 450, color: "#00B87C" },
  { label: "₹50-80K", value: 240, total: 450, color: "#F59E0B" },
  { label: "₹80K+", value: 178, total: 450, color: "#3B82F6" },
];

const PAYROLL_DEPT_SUMMARY = [
  { dept: "Engineering", employees: 420, gross: "₹9.8L", deductions: "₹1.2L", net: "₹8.6L" },
  { dept: "Marketing", employees: 180, gross: "₹4.2L", deductions: "₹0.5L", net: "₹3.7L" },
  { dept: "Finance", employees: 95, gross: "₹2.5L", deductions: "₹0.3L", net: "₹2.2L" },
  { dept: "HR", employees: 60, gross: "₹1.4L", deductions: "₹0.2L", net: "₹1.2L" },
  { dept: "Operations", employees: 529, gross: "₹10.5L", deductions: "₹1.3L", net: "₹9.2L" },
];

const YTD_MONTHLY = [
  { month: "Apr 2025", amount: "₹24.2L", employees: 1240, status: "Disbursed" },
  { month: "May 2025", amount: "₹24.5L", employees: 1242, status: "Disbursed" },
  { month: "Jun 2025", amount: "₹25.1L", employees: 1248, status: "Disbursed" },
  { month: "Jul 2025", amount: "₹25.8L", employees: 1252, status: "Disbursed" },
  { month: "Aug 2025", amount: "₹26.2L", employees: 1255, status: "Disbursed" },
  { month: "Sep 2025", amount: "₹26.8L", employees: 1258, status: "Disbursed" },
  { month: "Oct 2025", amount: "₹27.1L", employees: 1260, status: "Disbursed" },
  { month: "Nov 2025", amount: "₹27.5L", employees: 1262, status: "Disbursed" },
  { month: "Dec 2025", amount: "₹27.8L", employees: 1265, status: "Disbursed" },
  { month: "Jan 2026", amount: "₹28.1L", employees: 1270, status: "Disbursed" },
  { month: "Feb 2026", amount: "₹28.2L", employees: 1275, status: "Disbursed" },
  { month: "Mar 2026", amount: "₹28.4L", employees: 1284, status: "Disbursed" },
];

/* ═══════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════ */
interface Toast {
  id: number;
  type: "success" | "error" | "warning";
  message: string;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border min-w-[300px]"
            style={{
              backgroundColor: "var(--card)",
              borderLeft: `4px solid ${toast.type === "success" ? "#00B87C" : toast.type === "error" ? "#EF4444" : "#F59E0B"}`,
              borderColor: `var(--border)`,
              borderLeftColor: toast.type === "success" ? "#00B87C" : toast.type === "error" ? "#EF4444" : "#F59E0B",
            }}
          >
            {toast.type === "success" && <Check size={16} className="text-[#00B87C] shrink-0" />}
            {toast.type === "error" && <X size={16} className="text-[#EF4444] shrink-0" />}
            {toast.type === "warning" && <AlertTriangle size={16} className="text-[#F59E0B] shrink-0" />}
            <span className="text-[13px] font-semibold flex-1" style={{ color: "var(--foreground)" }}>{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODAL WRAPPER
═══════════════════════════════════════════════════════ */
function Modal({ open, onClose, children, maxWidth = "520px" }: { open: boolean; onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative rounded-[16px] shadow-2xl overflow-hidden w-full"
            style={{ maxWidth, backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export function FinanceDashboard() {
  const navigate = useNavigate();

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useState(0);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expense state
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [pendingCount, setPendingCount] = useState(36);

  // Chart state
  const [chartFilter, setChartFilter] = useState<"6M" | "1Y">("1Y");
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // Modal states
  const [modals, setModals] = useState({
    runPayroll: false,
    approveExpense: false,
    rejectExpense: false,
    stepModal: false,
    tdsInfo: false,
    pfInfo: false,
    payrollLock: false,
    ytdReport: false,
    tdsReport: false,
    pfReport: false,
    salaryRegister: false,
    form16: false,
    deadlinePF: false,
    deadlineTDS: false,
    deadlinePayrollLock: false,
    deadlinePayrollRun: false,
  });
  const openModal = (key: keyof typeof modals) => setModals((p) => ({ ...p, [key]: true }));
  const closeModal = (key: keyof typeof modals) => setModals((p) => ({ ...p, [key]: false }));

  // Selected expense for modal
  const [selectedExpense, setSelectedExpense] = useState<typeof INITIAL_EXPENSES[0] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [fadingRows, setFadingRows] = useState<string[]>([]);

  // Payroll wizard
  const [payrollStep, setPayrollStep] = useState(1);
  const [payrollRunning, setPayrollRunning] = useState(false);
  const [payrollDone, setPayrollDone] = useState(false);

  // Form 16 wizard
  const [form16Step, setForm16Step] = useState(1);
  const [form16FY, setForm16FY] = useState("FY 2025-26");
  const [form16Scope, setForm16Scope] = useState("All");
  const [form16Progress, setForm16Progress] = useState(0);
  const [form16Generating, setForm16Generating] = useState(false);
  const [form16Done, setForm16Done] = useState(false);

  // Step modal content
  const [stepInfo, setStepInfo] = useState({ title: "", content: "" });

  const chartData = chartFilter === "6M" ? PAYROLL_TREND_12M.slice(6) : PAYROLL_TREND_12M;

  // Approve expense
  const handleApproveConfirm = () => {
    if (!selectedExpense) return;
    setExpenses((prev) =>
      prev.map((e) => e.id === selectedExpense.id ? { ...e, status: "Approved" } : e)
    );
    setPendingCount((p) => Math.max(0, p - 1));
    closeModal("approveExpense");
    setSelectedExpense(null);
    addToast("success", `Expense ${selectedExpense.id} approved successfully.`);
  };

  // Reject expense
  const handleRejectConfirm = () => {
    if (!selectedExpense) return;
    setExpenses((prev) =>
      prev.map((e) => e.id === selectedExpense.id ? { ...e, status: "Rejected" } : e)
    );
    setPendingCount((p) => Math.max(0, p - 1));
    setFadingRows((prev) => [...prev, selectedExpense.id]);
    setTimeout(() => {
      setExpenses((prev) => prev.filter((e) => e.id !== selectedExpense.id));
      setFadingRows((prev) => prev.filter((id) => id !== selectedExpense!.id));
    }, 1500);
    closeModal("rejectExpense");
    setSelectedExpense(null);
    setRejectReason("");
    setRejectNotes("");
    addToast("warning", `Expense rejected and removed.`);
  };

  // Run payroll confirm
  const handleRunPayrollConfirm = () => {
    setPayrollRunning(true);
    setTimeout(() => {
      setPayrollRunning(false);
      setPayrollDone(true);
      setTimeout(() => {
        closeModal("runPayroll");
        setPayrollStep(1);
        setPayrollDone(false);
        addToast("success", "Payroll for April 2026 has been initiated successfully!");
      }, 1200);
    }, 2000);
  };

  // Form 16 generate
  const handleForm16Generate = () => {
    setForm16Generating(true);
    setForm16Progress(0);
    const interval = setInterval(() => {
      setForm16Progress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setForm16Generating(false);
          setForm16Done(true);
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  const openStepModal = (label: string, status: string) => {
    const info: Record<string, { title: string; content: string }> = {
      "Data Collection": {
        title: "Data Collection",
        content: status === "Done"
          ? "✅ Data collection completed on Apr 5, 2026.\n\n1,284 employees processed. All attendance, leave, and increment data has been locked and verified. No discrepancies found."
          : "⏳ Data collection in progress...",
      },
      "Attendance Lock": {
        title: "Attendance Lock",
        content: status === "Done"
          ? "✅ Attendance locked on Apr 8, 2026.\n\nFinal attendance: 1,248 present out of 1,284 total. 36 employees on approved leave. Regularization requests: 12 approved, 3 pending."
          : "⏳ Awaiting data collection to complete.",
      },
      "Calculation": {
        title: "Calculation In Progress",
        content: "⚡ Salary calculation currently in progress.\n\nEstimated completion: Apr 12, 2026.\nProgress: 67% complete.\n\n1,284 employees queued. Deductions, bonuses, and TDS being computed automatically.",
      },
      "Approval": {
        title: "Approval Stage",
        content: "🔒 Awaiting calculation completion before approval stage opens.\n\nOnce calculation is complete, the CFO and Finance Head will receive approval requests via email and in-app notification.",
      },
      "Disbursement": {
        title: "Disbursement",
        content: "📅 Disbursement scheduled for Apr 28, 2026.\n\nPayment will be processed after approval sign-off. Bank transfers will be initiated to all 1,248 eligible employee accounts.",
      },
    };
    setStepInfo(info[label] || { title: label, content: "" });
    openModal("stepModal");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">

      {/* ═══ ALERT BAR ═══ */}
      <div className="w-full py-3 px-4 rounded-2xl bg-[#DCFCE7]/40 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 shadow-sm backdrop-blur-sm overflow-x-auto">
        <div className="flex items-center gap-2 flex-nowrap min-w-max">
          {[
            { color: "#F59E0B", text: "Payroll due: April 28", action: () => openModal("runPayroll") },
            { color: "#EF4444", text: "36 pending expense approvals", action: () => navigate("/expenses") },
            { color: "#EF4444", text: "TDS filing deadline: April 15", action: () => openModal("tdsInfo") },
            { color: "#F59E0B", text: "PF payment due: April 20", action: () => openModal("pfInfo") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity shrink-0"
              style={{ background: item.color + "18", border: `1px solid ${item.color}30` }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
              <span className="text-[12px] font-bold" style={{ color: item.color === "#F59E0B" ? "#92400E" : "#991B1B" }}>
                {item.text}
              </span>
              <ArrowRight size={10} style={{ color: item.color }} />
            </button>
          ))}
        </div>
      </div>

      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-[#8B5CF6]/10 flex items-center justify-center shadow-inner">
            <IndianRupee size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold text-[#111827] dark:text-white">Finance Dashboard</h2>
            <p className="text-[13px] text-[#6B7280]">Payroll, expenses and financial overview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live</span>
          </div>
          <button
            onClick={() => { setPayrollStep(1); openModal("runPayroll"); }}
            className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[14px] font-bold hover:bg-[#009F6B] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Zap size={16} fill="white" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* ═══ KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            icon: IndianRupee, label: "MONTHLY PAYROLL", value: "₹28.4L", sub: "March 2026",
            color: "#8B5CF6", bg: "#EDE9FE",
            onClick: () => navigate("/payroll"),
          },
          {
            icon: Users, label: "EMPLOYEES PAID", value: "1,248", sub: "of 1,284 total",
            color: "#00B87C", bg: "#DCFCE7",
            onClick: () => navigate("/employees"),
          },
          {
            icon: Check, label: "APPROVED INCREMENTS", value: "5", sub: "this cycle",
            color: "#00B87C", bg: "#DCFCE7",
            onClick: () => navigate("/appraisal"),
          },
          {
            icon: Calendar, label: "PAYROLL LOCK DATE", value: "Apr 20", sub: "14 days away",
            color: "#3B82F6", bg: "#EFF6FF",
            onClick: () => openModal("payrollLock"),
          },
          {
            icon: Receipt, label: "PENDING EXPENSES", value: `₹42.8K`, sub: `${pendingCount} claims`,
            color: "#F59E0B", bg: "#FEF3C7",
            onClick: () => navigate("/expenses"),
          },
          {
            icon: BarChart3, label: "YTD PAYROLL COST", value: "₹3.2Cr", sub: "FY 2025-26",
            color: "#111827", bg: "#F3F4F6",
            onClick: () => openModal("ytdReport"),
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={kpi.onClick}
            className="bg-card p-5 rounded-[20px] border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[10px] mb-4 flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-[28px] font-bold mb-1" style={{ color: kpi.color === "#111827" ? "var(--foreground)" : kpi.color }}>
              {kpi.label === "PENDING EXPENSES" ? "₹42.8K" : kpi.value}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {kpi.label === "PENDING EXPENSES" ? `${pendingCount} claims` : kpi.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Monthly Payroll Trend</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">Salary expenditure across financial year</p>
            </div>
            <div className="flex gap-1.5 bg-secondary/50 p-1 rounded-full">
              {(["6M", "1Y"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setChartFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest transition-all ${chartFilter === f ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} unit="L" />
                <Tooltip
                  cursor={{ fill: "rgba(124,58,237,0.05)" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  formatter={(value: number) => [`₹${value}L`, "Payroll"]}
                />
                <Bar dataKey="cost" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-6">Salary Components Breakdown</h3>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPONENT_BREAKDOWN}
                  innerRadius={65} outerRadius={85}
                  paddingAngle={4} dataKey="value"
                  onMouseEnter={(_, index) => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  {COMPONENT_BREAKDOWN.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                      opacity={activeSegment === null || activeSegment === index ? 1 : 0.4}
                      style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">₹28.4L</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Monthly</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {COMPONENT_BREAKDOWN.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-muted/30"
                onMouseEnter={() => setActiveSegment(i)}
                onMouseLeave={() => setActiveSegment(null)}
                style={{ opacity: activeSegment === null || activeSegment === i ? 1 : 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] font-bold text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black text-foreground">{item.value}%</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-[9px] font-black text-emerald-600 dark:text-emerald-400">↑ 1.2%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECOND ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">

          {/* Payroll Processing Status */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-10">Payroll Processing Status</h3>
            <div className="flex items-center justify-between relative px-2 mb-10">
              <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-border z-0 mx-8" />
              {[
                { label: "Data Collection", status: "Done" },
                { label: "Attendance Lock", status: "Done" },
                { label: "Calculation", status: "Active" },
                { label: "Approval", status: "Pending" },
                { label: "Disbursement", status: "Pending" },
              ].map((step, i) => (
                <button
                  key={i}
                  onClick={() => openStepModal(step.label, step.status)}
                  className="flex flex-col items-center gap-3 relative z-10 group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    step.status === "Done" ? "bg-[#00B87C] border-[#00B87C] text-white" :
                    step.status === "Active" ? "bg-card border-[#3B82F6] text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse" :
                    "bg-card border-border text-muted-foreground"
                  } group-hover:scale-110`}>
                    {step.status === "Done" ? <Check size={16} strokeWidth={3} /> :
                     step.status === "Active" ? <Activity size={16} /> :
                     <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[70px] ${
                    step.status === "Done" ? "text-[#00B87C]" :
                    step.status === "Active" ? "text-[#3B82F6]" :
                    "text-muted-foreground"
                  }`}>{step.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 w-fit">
              <Activity size={14} className="text-[#00B87C] animate-spin" />
              <span className="text-[12px] font-bold text-[#00B87C]">Current Stage: Calculation in progress</span>
            </div>
          </div>

          {/* Pending Expense Approvals Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Pending Expense Approvals</h3>
              <button
                onClick={() => navigate("/expenses")}
                className="text-[11px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5">
                    {["Employee", "Category", "Amount", "Submitted", "Status", "Action"].map((h) => (
                      <th key={h} className={`px-6 py-4 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider ${h === "Action" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence>
                    {expenses.map((exp) => (
                      <motion.tr
                        key={exp.id}
                        layout
                        animate={{
                          opacity: fadingRows.includes(exp.id) ? 0 : 1,
                          y: fadingRows.includes(exp.id) ? -10 : 0,
                          backgroundColor: exp.status === "Approved" ? "rgba(34,197,94,0.05)" : exp.status === "Rejected" ? "rgba(239,68,68,0.05)" : "transparent",
                        }}
                        transition={{ duration: fadingRows.includes(exp.id) ? 1.5 : 0.3 }}
                        className="h-14 border-b border-[#F3F4F6] hover:bg-[#00B87C]/[0.05] group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8] font-black text-[11px]">
                              {exp.avatar}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-foreground leading-none">{exp.employee}</p>
                              <p className="text-[11px] text-muted-foreground mt-1">{exp.empId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-lg bg-secondary text-foreground text-[11px] font-black uppercase tracking-wider">{exp.category}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-foreground text-[13px]">{exp.amount}</td>
                        <td className="px-6 py-4 text-[11px] font-semibold text-muted-foreground">{exp.submitted}</td>
                        <td className="px-6 py-4">
                          {exp.status === "Pending" && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Pending</span>
                            </div>
                          )}
                          {exp.status === "Approved" && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                              <span className="text-[11px] font-bold text-[#047857] uppercase tracking-widest">Approved</span>
                            </div>
                          )}
                          {exp.status === "Rejected" && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Rejected</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {exp.status === "Pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => { setSelectedExpense(exp); openModal("approveExpense"); }}
                                className="px-3 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-bold hover:bg-[#009F6B] transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => { setSelectedExpense(exp); setRejectReason(""); setRejectNotes(""); openModal("rejectExpense"); }}
                                className="px-3 py-1.5 rounded-lg bg-secondary text-foreground border border-border text-[11px] font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${exp.status === "Approved" ? "text-[#00B87C]" : "text-red-500"}`}>
                              {exp.status}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">

          {/* Upcoming Deadlines */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-8">Upcoming Deadlines</h3>
            <div className="space-y-6">
              {DEADLINES.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (item.title === "PF Payment Done") openModal("deadlinePF");
                    else if (item.title === "TDS Filing") openModal("deadlineTDS");
                    else if (item.title === "Payroll Lock") openModal("deadlinePayrollLock");
                    else if (item.title === "Payroll Run") openModal("runPayroll");
                  }}
                  className="w-full flex gap-4 relative group text-left hover:bg-muted/20 rounded-xl p-2 -mx-2 transition-colors"
                >
                  {i !== DEADLINES.length - 1 && (
                    <div className="absolute left-[21px] top-10 w-[2px] h-8 bg-border group-hover:bg-primary/20 transition-colors" />
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-card ${
                    item.status === "Done" ? "bg-[#00B87C]" :
                    item.status === "Active" ? "bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.3)]" :
                    "bg-secondary border-border"
                  }`}>
                    {item.status === "Done" && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-[14px] font-black ${item.status === "Active" ? "text-[#3B82F6]" : "text-foreground"}`}>{item.title}</p>
                      <span className="text-[11px] font-bold text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-6">Salary Distribution</h3>
            <div className="space-y-5">
              {SALARY_DIST.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate("/employees")}
                  className="w-full space-y-2 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{item.label}</span>
                    <span className="text-foreground">{item.value} employees</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: "Run Payroll", color: "#00B87C", bg: "#DCFCE7", action: () => { setPayrollStep(1); openModal("runPayroll"); } },
                { icon: CheckCircle, label: "Approve Expenses", color: "#8B5CF6", bg: "#EDE9FE", action: () => navigate("/expenses") },
                { icon: FileSpreadsheet, label: "TDS Report", color: "#3B82F6", bg: "#EFF6FF", action: () => openModal("tdsReport") },
                { icon: ShieldCheck, label: "PF Report", color: "#F59E0B", bg: "#FEF3C7", action: () => openModal("pfReport") },
                { icon: BarChart3, label: "Salary Register", color: "#64748B", bg: "#F3F4F6", action: () => openModal("salaryRegister") },
                { icon: Download, label: "Generate Form 16", color: "#EF4444", bg: "#FEE2E2", action: () => { setForm16Step(1); setForm16Done(false); setForm16Progress(0); openModal("form16"); } },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border bg-card hover:bg-secondary hover:border-primary/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: action.bg }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-foreground text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MODALS
      ════════════════════════════════════════ */}

      {/* Approve Expense Modal */}
      <Modal open={modals.approveExpense} onClose={() => closeModal("approveExpense")}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-black text-foreground">Approve Expense</h2>
            <button onClick={() => closeModal("approveExpense")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex justify-between"><span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Employee</span><span className="text-[13px] font-black text-foreground">{selectedExpense.employee}</span></div>
                <div className="flex justify-between"><span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">ID</span><span className="text-[13px] font-bold text-foreground">{selectedExpense.empId}</span></div>
                <div className="flex justify-between"><span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Category</span><span className="text-[13px] font-bold text-foreground">{selectedExpense.category}</span></div>
                <div className="flex justify-between"><span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Amount</span><span className="text-[18px] font-black text-[#00B87C]">{selectedExpense.amount}</span></div>
                <div className="flex justify-between"><span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Submitted</span><span className="text-[13px] font-bold text-foreground">{selectedExpense.submitted}</span></div>
              </div>
              <div className="h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-[12px]">
                📎 Receipt thumbnail placeholder
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => closeModal("approveExpense")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleApproveConfirm} className="flex-1 py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[13px] hover:bg-[#009F6B] transition-colors">Confirm Approve</button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Reject Expense Modal */}
      <Modal open={modals.rejectExpense} onClose={() => closeModal("rejectExpense")}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-black text-foreground">Reject Expense</h2>
            <button onClick={() => closeModal("rejectExpense")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex justify-between items-center">
                <span className="text-[13px] font-bold text-foreground">{selectedExpense.employee} — {selectedExpense.category}</span>
                <span className="text-[15px] font-black text-red-500">{selectedExpense.amount}</span>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Reason *</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 text-foreground text-[13px] font-semibold outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Select reason...</option>
                  <option>Duplicate claim</option>
                  <option>Exceeds policy limit</option>
                  <option>Invalid receipt</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Additional Notes (optional)</label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 text-foreground text-[13px] font-semibold outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => closeModal("rejectExpense")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Cancel</button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason}
                  className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Run Payroll Modal - 3-step wizard */}
      <Modal open={modals.runPayroll} onClose={() => { closeModal("runPayroll"); setPayrollStep(1); setPayrollDone(false); }} maxWidth="560px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[18px] font-black text-foreground">Run Payroll — April 2026</h2>
            <button onClick={() => { closeModal("runPayroll"); setPayrollStep(1); setPayrollDone(false); }} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                  payrollStep > s ? "bg-[#00B87C] text-white" : payrollStep === s ? "bg-[#00B87C] text-white" : "bg-secondary text-muted-foreground"
                }`}>{payrollStep > s ? <Check size={12} /> : s}</div>
                {s < 3 && <div className={`h-[2px] w-12 rounded-full transition-all ${payrollStep > s ? "bg-[#00B87C]" : "bg-border"}`} />}
              </div>
            ))}
            <span className="text-[12px] font-bold text-muted-foreground ml-2">Step {payrollStep} of 3</span>
          </div>

          {payrollStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Month</p>
                  <p className="text-[14px] font-black text-foreground">April 2026</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Eligible</p>
                  <p className="text-[14px] font-black text-foreground">1,284 employees</p>
                </div>
                <div className="col-span-2 p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimated Total</p>
                  <p className="text-[22px] font-black text-[#8B5CF6]">₹2.87 Cr</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Checklist</p>
                {[
                  { label: "Attendance data locked", ok: true },
                  { label: `Expense approvals: ${pendingCount} pending`, ok: pendingCount === 0, warn: pendingCount > 0 },
                  { label: "Increment data updated", ok: true },
                ].map((c, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${c.ok ? "border-emerald-100 bg-emerald-50/50 dark:bg-emerald-500/5" : c.warn ? "border-amber-100 bg-amber-50/50" : "border-border"}`}>
                    {c.ok ? <Check size={16} className="text-[#00B87C]" /> : <AlertTriangle size={16} className="text-amber-500" />}
                    <span className={`text-[13px] font-semibold ${c.ok ? "text-[#047857]" : "text-amber-700"}`}>{c.label}</span>
                    {c.warn && <button onClick={() => { closeModal("runPayroll"); navigate("/expenses"); }} className="ml-auto text-[11px] font-bold text-amber-600 underline">Approve now</button>}
                  </div>
                ))}
              </div>
              <button onClick={() => setPayrollStep(2)} className="w-full py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[13px] hover:bg-[#009F6B] transition-colors flex items-center justify-center gap-2">
                Next: Review <ArrowRight size={16} />
              </button>
            </div>
          )}

          {payrollStep === 2 && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left">
                  <thead className="bg-muted/30">
                    <tr>
                      {["Department", "Employees", "Gross", "Deductions", "Net"].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PAYROLL_DEPT_SUMMARY.map((r, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.dept}</td>
                        <td className="px-4 py-3 text-[12px] font-semibold text-muted-foreground">{r.employees}</td>
                        <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.gross}</td>
                        <td className="px-4 py-3 text-[12px] font-bold text-red-500">{r.deductions}</td>
                        <td className="px-4 py-3 text-[12px] font-black text-[#00B87C]">{r.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPayrollStep(1)} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">← Back</button>
                <button onClick={() => setPayrollStep(3)} className="flex-1 py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[13px] hover:bg-[#009F6B] transition-colors">Confirm & Run →</button>
              </div>
            </div>
          )}

          {payrollStep === 3 && (
            <div className="space-y-5">
              {!payrollDone ? (
                <>
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex gap-3">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] font-semibold text-amber-800 dark:text-amber-200">
                      This will process payroll for <strong>1,284 employees</strong>. This action cannot be undone.
                    </p>
                  </div>
                  {payrollRunning ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <div className="w-10 h-10 border-4 border-[#00B87C]/20 border-t-[#00B87C] rounded-full animate-spin" />
                      <p className="text-[13px] font-bold text-muted-foreground">Processing payroll...</p>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => { closeModal("runPayroll"); setPayrollStep(1); }} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">✕ Cancel</button>
                      <button onClick={handleRunPayrollConfirm} className="flex-1 py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[13px] hover:bg-[#009F6B] transition-colors flex items-center justify-center gap-2">
                        <Zap size={16} fill="white" /> Confirm Run Payroll
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <Check size={28} className="text-[#00B87C]" />
                  </div>
                  <p className="text-[18px] font-black text-foreground">Payroll Initiated!</p>
                  <p className="text-[13px] text-muted-foreground text-center">April 2026 payroll has been queued for processing.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Step Detail Modal */}
      <Modal open={modals.stepModal} onClose={() => closeModal("stepModal")} maxWidth="440px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">{stepInfo.title}</h2>
            <button onClick={() => closeModal("stepModal")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">{stepInfo.content}</p>
          <button onClick={() => closeModal("stepModal")} className="w-full mt-6 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
        </div>
      </Modal>

      {/* TDS Info Modal (alert bar) */}
      <Modal open={modals.tdsInfo} onClose={() => closeModal("tdsInfo")} maxWidth="440px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">TDS Filing Deadline</h2>
            <button onClick={() => closeModal("tdsInfo")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
              <p className="text-[13px] font-bold text-red-700 dark:text-red-300">⚠️ Deadline: April 15, 2026 (10 days remaining)</p>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">TDS (Tax Deducted at Source) quarterly filing for Q4 FY 2025-26 (Jan–Mar 2026) is due by April 15. Late filing attracts a penalty of ₹200/day.</p>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Quarter</span><span className="font-black text-foreground">Q4 FY 2025-26</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Employees covered</span><span className="font-black text-foreground">1,284</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Total TDS</span><span className="font-black text-[#8B5CF6]">₹18.4L</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Status</span><span className="font-black text-[#3B82F6]">In Progress</span></div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => closeModal("tdsInfo")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
            <button onClick={() => { closeModal("tdsInfo"); openModal("tdsReport"); }} className="flex-1 py-3 rounded-xl bg-[#3B82F6] text-white font-bold text-[13px] hover:bg-blue-600 transition-colors">View TDS Report</button>
          </div>
        </div>
      </Modal>

      {/* PF Info Modal (alert bar) */}
      <Modal open={modals.pfInfo} onClose={() => closeModal("pfInfo")} maxWidth="440px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">PF Payment Due</h2>
            <button onClick={() => closeModal("pfInfo")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <p className="text-[13px] font-bold text-amber-700 dark:text-amber-300">📅 Due Date: April 20, 2026 (14 days remaining)</p>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Employee Provident Fund (EPF) contribution for March 2026 payroll must be remitted to EPFO by April 20, 2026.</p>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Employee PF (12%)</span><span className="font-black text-foreground">₹11.5L</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Employer PF (12%)</span><span className="font-black text-foreground">₹11.5L</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Total Remittance</span><span className="font-black text-[#F59E0B]">₹23.0L</span></div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => closeModal("pfInfo")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
            <button onClick={() => { closeModal("pfInfo"); openModal("pfReport"); }} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-white font-bold text-[13px] hover:bg-amber-600 transition-colors">View PF Report</button>
          </div>
        </div>
      </Modal>

      {/* Payroll Lock Modal */}
      <Modal open={modals.payrollLock} onClose={() => closeModal("payrollLock")} maxWidth="440px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">Payroll Lock Date</h2>
            <button onClick={() => closeModal("payrollLock")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <p className="text-[13px] font-bold text-[#1D4ED8] dark:text-blue-300">🔒 Lock Date: April 20, 2026 (14 days away)</p>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">All attendance, leave, and compensation adjustments must be finalized before this date. After payroll lock, no changes can be made to the April 2026 payroll inputs.</p>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Pending regularizations</span><span className="font-black text-amber-600">12 requests</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Pending expense approvals</span><span className="font-black text-amber-600">{pendingCount} claims</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Payroll run date</span><span className="font-black text-foreground">Apr 28, 2026</span></div>
            </div>
          </div>
          <button onClick={() => closeModal("payrollLock")} className="w-full mt-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
        </div>
      </Modal>

      {/* YTD Report Modal */}
      <Modal open={modals.ytdReport} onClose={() => closeModal("ytdReport")} maxWidth="620px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] font-black text-foreground">YTD Payroll Report</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">FY 2025-26 · April 2025 – March 2026</p>
            </div>
            <button onClick={() => closeModal("ytdReport")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="p-3 rounded-xl bg-[#EDE9FE] dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 mb-4 flex justify-between items-center">
            <span className="text-[12px] font-bold text-[#8B5CF6]">Total YTD Payroll Cost</span>
            <span className="text-[20px] font-black text-[#8B5CF6]">₹3.2 Cr</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left">
              <thead className="bg-muted/30">
                <tr>
                  {["Month", "Amount", "Employees", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {YTD_MONTHLY.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.month}</td>
                    <td className="px-4 py-3 text-[12px] font-black text-[#8B5CF6]">{r.amount}</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-muted-foreground">{r.employees.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#047857] text-[10px] font-black uppercase tracking-wider">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => closeModal("ytdReport")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
            <button onClick={() => { closeModal("ytdReport"); addToast("success", "YTD Payroll Report downloaded."); }} className="flex-1 py-3 rounded-xl bg-[#8B5CF6] text-white font-bold text-[13px] hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
              <Download size={16} /> Download Excel
            </button>
          </div>
        </div>
      </Modal>

      {/* TDS Report Modal */}
      <Modal open={modals.tdsReport} onClose={() => closeModal("tdsReport")} maxWidth="600px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] font-black text-foreground">TDS Report — Q4 FY 2025-26</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Period: January 2026 – March 2026</p>
            </div>
            <button onClick={() => closeModal("tdsReport")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-left">
              <thead className="bg-muted/30">
                <tr>
                  {["Employee", "PAN", "Gross Salary", "TDS Deducted", "Certificate"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Sarah Johnson", pan: "ABCDE1234F", gross: "₹2,85,000", tds: "₹19,500", cert: "Form 16A" },
                  { name: "Marcus Williams", pan: "BCDEF2345G", gross: "₹2,55,000", tds: "₹17,000", cert: "Form 16A" },
                  { name: "Yuki Tanaka", pan: "CDEFG3456H", gross: "₹2,34,000", tds: "₹14,500", cert: "Form 16A" },
                  { name: "James Carter", pan: "DEFGH4567I", gross: "₹2,64,000", tds: "₹18,200", cert: "Form 16A" },
                  { name: "Emily Parker", pan: "EFGHI5678J", gross: "₹2,10,000", tds: "₹12,800", cert: "Form 16A" },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-[12px] font-mono text-muted-foreground">{r.pan}</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.gross}</td>
                    <td className="px-4 py-3 text-[12px] font-black text-red-500">{r.tds}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-[#3B82F6] text-[10px] font-black">{r.cert}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { addToast("success", "TDS Report (Excel) downloaded."); closeModal("tdsReport"); }} className="flex-1 py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[13px] hover:bg-[#009F6B] transition-colors flex items-center justify-center gap-2"><Download size={16} /> Download Excel</button>
            <button onClick={() => { addToast("success", "TDS Report (PDF) downloaded."); closeModal("tdsReport"); }} className="flex-1 py-3 rounded-xl bg-[#3B82F6] text-white font-bold text-[13px] hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><FileText size={16} /> Download PDF</button>
            <button onClick={() => closeModal("tdsReport")} className="px-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">✕</button>
          </div>
        </div>
      </Modal>

      {/* PF Report Modal */}
      <Modal open={modals.pfReport} onClose={() => closeModal("pfReport")} maxWidth="560px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] font-black text-foreground">PF Report — March 2026</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Employee Provident Fund Summary</p>
            </div>
            <button onClick={() => closeModal("pfReport")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-left">
              <thead className="bg-muted/30">
                <tr>
                  {["Employee", "UAN", "Emp PF", "Employer PF", "Total"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Sarah Johnson", uan: "101234567890", emp: "₹9,600", er: "₹9,600", total: "₹19,200" },
                  { name: "Marcus Williams", uan: "101234567891", emp: "₹8,800", er: "₹8,800", total: "₹17,600" },
                  { name: "Yuki Tanaka", uan: "101234567892", emp: "₹7,800", er: "₹7,800", total: "₹15,600" },
                  { name: "Emily Parker", uan: "101234567893", emp: "₹7,000", er: "₹7,000", total: "₹14,000" },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{r.uan}</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.emp}</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-foreground">{r.er}</td>
                    <td className="px-4 py-3 text-[12px] font-black text-[#F59E0B]">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { addToast("success", "PF ECR file downloaded."); closeModal("pfReport"); }} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-white font-bold text-[13px] hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"><Download size={16} /> Download ECR</button>
            <button onClick={() => closeModal("pfReport")} className="px-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">✕ Close</button>
          </div>
        </div>
      </Modal>

      {/* Salary Register Modal */}
      <Modal open={modals.salaryRegister} onClose={() => closeModal("salaryRegister")} maxWidth="440px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">Salary Register</h2>
            <button onClick={() => closeModal("salaryRegister")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <p className="text-[13px] text-muted-foreground mb-4">Download the full salary register for March 2026 containing detailed breakdowns for all 1,284 employees.</p>
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 mb-5">
            <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Period</span><span className="font-black text-foreground">March 2026</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Employees</span><span className="font-black text-foreground">1,284</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-semibold">Total Gross</span><span className="font-black text-[#8B5CF6]">₹28.4L</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { addToast("success", "Salary Register downloaded."); closeModal("salaryRegister"); }} className="flex-1 py-3 rounded-xl bg-[#64748B] text-white font-bold text-[13px] hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"><Download size={16} /> Download</button>
            <button onClick={() => closeModal("salaryRegister")} className="px-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
          </div>
        </div>
      </Modal>

      {/* Generate Form 16 Wizard */}
      <Modal open={modals.form16} onClose={() => { closeModal("form16"); setForm16Step(1); setForm16Done(false); setForm16Progress(0); }} maxWidth="500px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[18px] font-black text-foreground">Generate Form 16</h2>
            <button onClick={() => { closeModal("form16"); setForm16Step(1); setForm16Done(false); setForm16Progress(0); }} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${form16Step > s || form16Done ? "bg-[#00B87C] text-white" : form16Step === s ? "bg-[#EF4444] text-white" : "bg-secondary text-muted-foreground"}`}>
                  {form16Step > s || form16Done ? <Check size={10} /> : s}
                </div>
                {s < 4 && <div className={`h-[2px] w-8 rounded-full transition-all ${form16Step > s ? "bg-[#00B87C]" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {form16Step === 1 && (
            <div className="space-y-4">
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">Step 1: Select Financial Year</p>
              {["FY 2024-25", "FY 2025-26"].map((fy) => (
                <button key={fy} onClick={() => setForm16FY(fy)} className={`w-full py-3 rounded-xl border font-bold text-[14px] transition-all ${form16FY === fy ? "border-[#EF4444] bg-red-50 dark:bg-red-500/10 text-[#EF4444]" : "border-border text-foreground hover:bg-muted"}`}>{fy}</button>
              ))}
              <button onClick={() => setForm16Step(2)} className="w-full py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors">Next →</button>
            </div>
          )}

          {form16Step === 2 && (
            <div className="space-y-4">
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">Step 2: Select Employees</p>
              {["All Employees", "By Department", "Individual"].map((opt) => (
                <button key={opt} onClick={() => setForm16Scope(opt)} className={`w-full py-3 rounded-xl border font-bold text-[14px] transition-all ${form16Scope === opt ? "border-[#EF4444] bg-red-50 dark:bg-red-500/10 text-[#EF4444]" : "border-border text-foreground hover:bg-muted"}`}>{opt} {opt === "All Employees" && "(1,284)"}</button>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setForm16Step(1)} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">← Back</button>
                <button onClick={() => setForm16Step(3)} className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors">Next →</button>
              </div>
            </div>
          )}

          {form16Step === 3 && (
            <div className="space-y-4">
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">Step 3: Preview Sample Form 16</p>
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-[12px]">
                <p className="font-black text-foreground">FORM 16 — {form16FY}</p>
                <p className="text-muted-foreground">Name: Sarah Johnson</p>
                <p className="text-muted-foreground">PAN: ABCDE1234F | EMP: EMP001</p>
                <div className="border-t border-border pt-2 mt-2 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Gross Salary</span><span className="font-bold text-foreground">₹11,40,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">TDS Deducted</span><span className="font-bold text-red-500">₹78,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Net Taxable</span><span className="font-bold text-[#00B87C]">₹10,62,000</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setForm16Step(2)} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">← Back</button>
                <button onClick={() => setForm16Step(4)} className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors">Generate All →</button>
              </div>
            </div>
          )}

          {form16Step === 4 && (
            <div className="space-y-4">
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">Step 4: Generate</p>
              {!form16Done ? (
                <>
                  {form16Generating ? (
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full bg-[#EF4444] rounded-full" animate={{ width: `${form16Progress}%` }} transition={{ duration: 0.2 }} />
                      </div>
                      <p className="text-[12px] text-muted-foreground text-center">Generating Form 16 for 1,284 employees... {form16Progress}%</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 text-[12px] space-y-1">
                      <div className="flex justify-between"><span className="text-muted-foreground">FY</span><span className="font-bold text-foreground">{form16FY}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Scope</span><span className="font-bold text-foreground">{form16Scope}</span></div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {!form16Generating && <button onClick={() => setForm16Step(3)} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">← Back</button>}
                    {!form16Generating && (
                      <button onClick={handleForm16Generate} className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                        <Zap size={16} fill="white" /> Generate All
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <Check size={28} className="text-[#EF4444]" />
                  </div>
                  <p className="text-[16px] font-black text-foreground">Generation Complete!</p>
                  <p className="text-[12px] text-muted-foreground text-center">1,284 Form 16 documents generated successfully.</p>
                  <button onClick={() => { addToast("success", "Form 16 ZIP downloaded successfully."); closeModal("form16"); setForm16Step(1); setForm16Done(false); setForm16Progress(0); }} className="w-full py-3 rounded-xl bg-[#EF4444] text-white font-bold text-[13px] hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Download ZIP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Deadline modals */}
      {/* PF Deadline */}
      <Modal open={modals.deadlinePF} onClose={() => closeModal("deadlinePF")} maxWidth="400px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">PF Payment Summary</h2>
            <button onClick={() => closeModal("deadlinePF")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="p-4 rounded-xl bg-[#DCFCE7] dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 mb-4">
            <p className="text-[13px] font-black text-[#047857]">✅ Completed on schedule — April 10, 2026</p>
          </div>
          <p className="text-[13px] text-muted-foreground">PF remittance of ₹23.0L was successfully processed and credited to EPFO on April 10, 2026. ECR challan no: ECR-2026-04-001.</p>
          <button onClick={() => closeModal("deadlinePF")} className="w-full mt-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
        </div>
      </Modal>

      {/* TDS Deadline */}
      <Modal open={modals.deadlineTDS} onClose={() => closeModal("deadlineTDS")} maxWidth="400px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">TDS Filing Status</h2>
            <button onClick={() => closeModal("deadlineTDS")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-4">
            <p className="text-[13px] font-black text-[#1D4ED8] dark:text-blue-300">🔵 In Progress — Action Required by Apr 15</p>
          </div>
          <p className="text-[13px] text-muted-foreground">Q4 FY 2025-26 TDS return (24Q) is currently being prepared. Total TDS: ₹18.4L across 1,284 employees. Please ensure filing before the deadline.</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => closeModal("deadlineTDS")} className="flex-1 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Close</button>
            <button onClick={() => { closeModal("deadlineTDS"); openModal("tdsReport"); }} className="flex-1 py-3 rounded-xl bg-[#3B82F6] text-white font-bold text-[13px] hover:bg-blue-600 transition-colors">View Report</button>
          </div>
        </div>
      </Modal>

      {/* Payroll Lock Deadline */}
      <Modal open={modals.deadlinePayrollLock} onClose={() => closeModal("deadlinePayrollLock")} maxWidth="400px">
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-foreground">Payroll Lock — Apr 20</h2>
            <button onClick={() => closeModal("deadlinePayrollLock")} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-500/10 border border-slate-100 dark:border-slate-500/20 mb-4">
            <p className="text-[13px] font-black text-muted-foreground">○ Upcoming — April 20, 2026</p>
          </div>
          <p className="text-[13px] text-muted-foreground">All input data for April 2026 payroll must be finalized by this date. Ensure all leave, attendance regularizations, and expense approvals are completed before the lock.</p>
          <button onClick={() => closeModal("deadlinePayrollLock")} className="w-full mt-5 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors">Got it</button>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
