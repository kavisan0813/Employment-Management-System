import { useState, useCallback } from "react";
import {
  Users,
  Download,
  X,
  Check,
  AlertTriangle,
  Calendar,
  Lock,
  ChevronDown,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronRight,
  ExternalLink,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { employees } from "../../data/mockData";

/* ─── Mock Financial Data ─── */
const MOCK_FINANCIAL_DETAILS: Record<
  string,
  {
    basic: number;
    hra: number;
    allowances: number;
    taxSlab: string;
    pfContribution: number;
    payBand: string;
    payHistory: { month: string; amount: number; status: string }[];
  }
> = {
  default: {
    basic: 80000,
    hra: 40000,
    allowances: 35000,
    taxSlab: "30%",
    pfContribution: 9600,
    payBand: "Band B",
    payHistory: [
      { month: "March 2026", amount: 155000, status: "Paid" },
      { month: "February 2026", amount: 155000, status: "Paid" },
      { month: "January 2026", amount: 155000, status: "Paid" },
    ],
  },
};

/* ─── Toast ─── */
interface Toast {
  id: number;
  type: "success" | "error" | "warning";
  message: string;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
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
              borderColor: "var(--border)",
              borderLeftColor:
                toast.type === "success"
                  ? "#00B87C"
                  : toast.type === "error"
                    ? "#EF4444"
                    : "#F59E0B",
            }}
          >
            {toast.type === "success" && (
              <Check size={16} className="text-[#00B87C] shrink-0" />
            )}
            {toast.type === "error" && (
              <X size={16} className="text-[#EF4444] shrink-0" />
            )}
            {toast.type === "warning" && (
              <AlertTriangle size={16} className="text-[#F59E0B] shrink-0" />
            )}
            <span
              className="text-[13px] font-semibold flex-1"
              style={{ color: "var(--foreground)" }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Modal Wrapper ─── */
function Modal({
  open,
  onClose,
  children,
  maxWidth = "520px",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative rounded-[16px] shadow-2xl overflow-hidden w-full"
            style={{
              maxWidth,
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Payslip Modal ─── */
function PayslipModal({
  open,
  onClose,
  employee,
  month,
  addToast,
}: {
  open: boolean;
  onClose: () => void;
  employee: (typeof employees)[0] | null;
  month: string;
  addToast: (type: Toast["type"], msg: string) => void;
}) {
  if (!employee) return null;
  const fin = MOCK_FINANCIAL_DETAILS.default;
  const gross = fin.basic + fin.hra + fin.allowances;
  const totalDeductions = fin.pfContribution + 6500; // PF + TDS
  const netPay = gross - totalDeductions;

  const earnings = [
    { label: "Basic Salary", value: fin.basic },
    { label: "HRA", value: fin.hra },
    { label: "Special Allowances", value: fin.allowances },
  ].filter((e) => e.value > 0);

  const deductionItems = [
    { label: "PF (Employee)", value: fin.pfContribution },
    { label: "TDS", value: 6500 },
  ].filter((d) => d.value > 0);

  const maxRows = Math.max(earnings.length, deductionItems.length);
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push({
      earning: earnings[i] || null,
      deduction: deductionItems[i] || null,
    });
  }

  // Convert Net Salary to Words
  const netInWords = (() => {
    const num = Math.round(netPay);
    if (num === 0) return "Zero";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function g(n: number): string {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
    }

    function h(n: number): string {
      if (n < 100) return g(n);
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " and " + g(n % 100) : "")
      );
    }

    function c(n: number): string {
      const parts: string[] = [];
      if (n >= 10000000) {
        parts.push(h(Math.floor(n / 10000000)) + " Crore");
        n %= 10000000;
      }
      if (n >= 100000) {
        parts.push(h(Math.floor(n / 100000)) + " Lakh");
        n %= 100000;
      }
      if (n >= 1000) {
        parts.push(h(Math.floor(n / 1000)) + " Thousand");
        n %= 1000;
      }
      if (n > 0) {
        parts.push(h(n));
      }
      return parts.join(" ");
    }

    return "Rupees " + c(num) + " Only";
  })();

  const handlePrint = () => {
    window.print();
    addToast(
      "success",
      `${month} payslip printed/downloaded for ${employee.name}.`,
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] no-print"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-card rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col z-[3001] print-payslip-card"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <FileText size={20} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground">
                    Salary Payslip
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {month} · {employee.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-500 transition-colors ml-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Corporate Header Section */}
              <div className="flex justify-between items-start border-b border-neutral-300 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-1.5">
                    <span className="bg-[#00B87C] text-white p-1.5 rounded-xl text-lg leading-none font-bold">
                      N
                    </span>
                    NexusHR Inc.
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    100 Marine Parkway, Redwood City, CA 94065
                    <br />
                    Phone: +1 (650) 555-0199 | Email: payroll@nexushr.com
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-black text-foreground uppercase tracking-wider">
                    Salary Payslip
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground mt-1">
                    Pay Period: {month}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-emerald-500/10 text-[#00B87C] border-emerald-500/20">
                    <CheckCircle2 size={12} /> Paid
                  </div>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-muted/20">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Employee Name
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {employee.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Employee ID
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {employee.id}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Designation
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {employee.designation}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Department
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {employee.department}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Bank Name
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    ICICI Bank
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Bank A/c No.
                  </p>
                  <p className="text-sm font-bold text-foreground">****9852</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    PF Number
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    PF/{employee.id}/2026
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Tax Account (PAN)
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    PAN/EMP/{employee.id.replace("EMP-", "")}
                  </p>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-neutral-200 dark:border-neutral-800">
                      <th className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800 text-left font-black uppercase text-foreground">
                        Earnings
                      </th>
                      <th className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800 text-right font-black uppercase text-foreground">
                        Amount
                      </th>
                      <th className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800 text-left font-black uppercase text-foreground">
                        Deductions
                      </th>
                      <th className="px-4 py-2.5 text-right font-black uppercase text-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {rows.map((row, index) => (
                      <tr key={index} className="h-9">
                        <td className="px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 text-muted-foreground">
                          {row.earning?.label || ""}
                        </td>
                        <td className="px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 text-right font-medium text-foreground">
                          {row.earning
                            ? `₹${row.earning.value.toLocaleString()}`
                            : ""}
                        </td>
                        <td className="px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 text-muted-foreground">
                          {row.deduction?.label || ""}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-red-500">
                          {row.deduction
                            ? `₹${row.deduction.value.toLocaleString()}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-bold border-t border-neutral-200 dark:border-neutral-800 h-10 text-foreground">
                      <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800">
                        Gross Earnings
                      </td>
                      <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800 text-right font-black">
                        ₹{gross.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800">
                        Total Deductions
                      </td>
                      <td className="px-4 py-2.5 text-right font-black text-red-500">
                        ₹{totalDeductions.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Salary Summary */}
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#00B87C]">
                      Net Take-Home Salary
                    </p>
                    <h3 className="text-2xl font-black text-foreground mt-0.5">
                      ₹{netPay.toLocaleString()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Payment Mode
                    </p>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      Direct Bank Transfer
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-dashed border-emerald-500/20 text-xs">
                  <span className="font-bold text-muted-foreground">
                    Amount in Words:{" "}
                  </span>
                  <span className="font-black text-foreground italic">
                    {netInWords}
                  </span>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs">
                <div className="space-y-12">
                  <div className="h-0.5 bg-neutral-300 w-3/4 mx-auto" />
                  <p className="font-bold text-muted-foreground uppercase tracking-wider">
                    Employee Signature
                  </p>
                </div>
                <div className="space-y-12">
                  <div className="h-0.5 bg-neutral-300 w-3/4 mx-auto" />
                  <p className="font-bold text-muted-foreground uppercase tracking-wider">
                    Authorized Signatory
                    <br />
                    <span className="text-[10px] lowercase font-normal">
                      for NexusHR Inc.
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-center text-[9px] text-muted-foreground/60 italic pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                This is a system-generated payslip and does not require a
                physical stamp or signature.
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-secondary/30 flex gap-4 border-t border-border shrink-0 no-print">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider border border-border rounded-2xl hover:bg-card"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-[2] py-3 bg-[#00B87C] text-white rounded-2xl text-[13px] font-bold uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Full Payslip History Modal ─── */
function FullPayslipHistoryModal({
  open,
  onClose,
  employee,
  addToast,
}: {
  open: boolean;
  onClose: () => void;
  employee: (typeof employees)[0] | null;
  addToast: (type: Toast["type"], msg: string) => void;
}) {
  if (!employee) return null;
  const history = [
    { month: "March 2026", amount: 155000, status: "Paid" },
    { month: "February 2026", amount: 155000, status: "Paid" },
    { month: "January 2026", amount: 155000, status: "Paid" },
    { month: "December 2025", amount: 152000, status: "Paid" },
    { month: "November 2025", amount: 152000, status: "Paid" },
    { month: "October 2025", amount: 150000, status: "Paid" },
    { month: "September 2025", amount: 148000, status: "Paid" },
    { month: "August 2025", amount: 148000, status: "Paid" },
    { month: "July 2025", amount: 145000, status: "Paid" },
    { month: "June 2025", amount: 145000, status: "Paid" },
    { month: "May 2025", amount: 142000, status: "Paid" },
    { month: "April 2025", amount: 142000, status: "Paid" },
  ];

  return (
    <Modal open={open} onClose={onClose} maxWidth="500px">
      <div className="p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-black text-foreground">
              Full Payslip History
            </h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {employee.name} · {employee.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
          {history.map((pay, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-[#00B87C]">
                  <Calendar size={14} />
                </div>
                <span className="text-[13px] font-bold text-foreground">
                  {pay.month}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-black text-foreground tracking-tight">
                  ₹{pay.amount.toLocaleString()}
                </p>
                <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#047857] text-[10px] font-black uppercase tracking-wider">
                  {pay.status}
                </span>
                <button
                  onClick={() =>
                    addToast("success", `${pay.month} payslip downloaded.`)
                  }
                  className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-muted-foreground hover:text-[#00B87C] transition-colors"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ─── MAIN COMPONENT ─── */
export function FinanceEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("Status: All");
  const [selectedBand, setSelectedBand] = useState("Pay Band");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof employees)[0] | null
  >(null);

  // Payslip modal
  const [payslipModal, setPayslipModal] = useState(false);
  const [payslipMonth, setPayslipMonth] = useState("");
  const [fullHistoryModal, setFullHistoryModal] = useState(false);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  }, []);
  const removeToast = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDept === "All Departments" || emp.department === selectedDept;
    const matchesStatus =
      selectedStatus === "Status: All" || emp.status === selectedStatus;
    const payBand =
      emp.salary > 100000 ? "Band A" : emp.salary > 60000 ? "Band B" : "Band C";
    const matchesBand = selectedBand === "Pay Band" || payBand === selectedBand;
    return matchesSearch && matchesDept && matchesStatus && matchesBand;
  });

  const fin = MOCK_FINANCIAL_DETAILS.default;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 relative overflow-hidden">
      {/* ACCESS RESTRICTION BANNER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-500/10 border-l-4 border-amber-500 shadow-sm"
      >
        <div className="p-2 rounded-full bg-amber-500/20 text-amber-600">
          <Lock size={18} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[14px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">
            Access Restricted
          </p>
          <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-300 opacity-90">
            You have view-only access to employee financial data. Contact HR
            Manager to make changes to employee records.
          </p>
        </div>
      </motion.div>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] dark:bg-emerald-500/10 flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-500/20">
            <Users size={22} className="text-[#047857]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold text-foreground tracking-tight">
                Employees
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-widest text-muted-foreground border border-border">
                View Only
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280]">
              Financial data access enabled for your role
            </p>
          </div>
        </div>
        <div className="relative group z-20">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm">
            <Download size={18} />
            Export Salary CSV
            <ChevronDown size={14} className="ml-1" />
          </button>
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto origin-top-right transform scale-95 group-hover:scale-100">
            <div className="p-1.5 flex flex-col">
              <button
                onClick={() =>
                  addToast("success", "Exporting Current Month Salary CSV...")
                }
                className="w-full text-left px-3 py-2 text-[12px] font-bold text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Current Month
              </button>
              <button
                onClick={() =>
                  addToast("success", "Exporting FY 2025-26 Salary CSV...")
                }
                className="w-full text-left px-3 py-2 text-[12px] font-bold text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                FY 2025-26
              </button>
              <button
                onClick={() =>
                  addToast("success", "Custom Date Range selected.")
                }
                className="w-full text-left px-3 py-2 text-[12px] font-bold text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Custom Date Range
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-3 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border border-border text-sm font-semibold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <FilterSelect
            value={selectedDept}
            onChange={setSelectedDept}
            options={[
              "All Departments",
              "Engineering",
              "Marketing",
              "Design",
              "Finance",
              "HR",
              "Product",
              "Sales",
              "Operations",
            ]}
          />
          <FilterSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={["Status: All", "Active", "Inactive", "On Leave"]}
          />
          <FilterSelect
            value={selectedBand}
            onChange={setSelectedBand}
            options={["Pay Band", "Band A", "Band B", "Band C", "Executive"]}
          />

          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDept("All Departments");
              setSelectedStatus("Status: All");
              setSelectedBand("Pay Band");
            }}
            className="flex items-center gap-2 px-4 py-3 text-xs font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-card shadow-sm text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* EMPLOYEE TABLE / GRID */}
      {viewMode === "list" ? (
        <div className="bg-card border border-border rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  {[
                    "Employee",
                    "Department",
                    "Designation",
                    "CTC (Annual)",
                    "Pay Band",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] ${h === "Action" ? "text-center" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => {
                  const payBand =
                    emp.salary > 100000
                      ? "Band A"
                      : emp.salary > 60000
                        ? "Band B"
                        : "Band C";
                  return (
                    <motion.tr
                      key={emp.id}
                      whileHover={{ backgroundColor: "rgba(34,197,94,0.03)" }}
                      className="group cursor-pointer transition-colors"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border group-hover:border-[#00B87C]/30 transition-all">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground group-hover:text-[#00B87C] transition-colors">
                              {emp.name}
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              {emp.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-foreground/80">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-foreground/80">
                          {emp.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px] font-black text-foreground tracking-tight">
                          ₹{(emp.salary * 12).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-border">
                          {payBand}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === "Active"
                                ? "bg-[#00B87C] shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                : emp.status === "On Leave"
                                  ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                  : "bg-slate-400"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-bold uppercase tracking-widest ${
                              emp.status === "Active"
                                ? "text-[#00B87C]"
                                : emp.status === "On Leave"
                                  ? "text-amber-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center p-2 rounded-xl text-muted-foreground group-hover:text-[#00B87C] transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <Users size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">
                No employees found matching your filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => {
            const payBand =
              emp.salary > 100000
                ? "Band A"
                : emp.salary > 60000
                  ? "Band B"
                  : "Band C";
            return (
              <motion.div
                key={emp.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-[#00B87C]/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">
                      {emp.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                      {emp.id}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-muted-foreground mb-1">
                  {emp.designation}
                </p>
                <p className="text-[12px] font-semibold text-muted-foreground mb-3">
                  {emp.department}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-black text-foreground">
                    ₹{(emp.salary * 12).toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      emp.status === "Active"
                        ? "bg-[#DCFCE7] text-[#047857]"
                        : emp.status === "On Leave"
                          ? "bg-[#FEF3C7] text-amber-700"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                    {payBand}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── RIGHT PANEL — Employee Financial Detail ─── */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] border-l border-border shadow-2xl z-[101] overflow-y-auto"
              style={{ backgroundColor: "var(--card)" }}
            >
              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <Lock size={14} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Read Only Mode
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="p-2 rounded-xl hover:bg-muted transition-all text-muted-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Profile */}
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-[#00B87C]/20 mx-auto shadow-xl">
                    <img
                      src={selectedEmployee.avatar}
                      alt={selectedEmployee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {selectedEmployee.designation} ·{" "}
                      {selectedEmployee.department}
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-[#00B87C]" />
                    <h3 className="text-[11px] font-black uppercase tracking-[2px] text-muted-foreground">
                      Financial Summary
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "CTC (Annual)",
                        value: `₹${(selectedEmployee.salary * 12).toLocaleString()}`,
                        highlight: true,
                      },
                      {
                        label: "Pay Band",
                        value:
                          selectedEmployee.salary > 100000
                            ? "Band A"
                            : "Band B",
                        highlight: false,
                      },
                      {
                        label: "TDS Slab",
                        value: fin.taxSlab,
                        highlight: false,
                      },
                      {
                        label: "PF Contribution",
                        value: `₹${fin.pfContribution.toLocaleString()}`,
                        highlight: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-4 rounded-2xl border border-border bg-card shadow-sm"
                      >
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          {item.label}
                        </p>
                        <p
                          className={`text-[15px] font-black tracking-tight ${item.highlight ? "text-[#00B87C]" : "text-foreground"}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTC Breakdown */}
                  <div className="bg-muted/30 border border-border rounded-2xl p-5 space-y-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      CTC Breakdown (Monthly)
                    </p>
                    {[
                      { label: "Basic Salary", amount: fin.basic },
                      { label: "HRA", amount: fin.hra },
                      { label: "Special Allowances", amount: fin.allowances },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[13px] font-semibold text-muted-foreground">
                          {r.label}
                        </span>
                        <span className="text-[13px] font-bold text-foreground">
                          ₹{r.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-black text-foreground">
                        Gross Monthly
                      </span>
                      <span className="text-sm font-black text-[#00B87C]">
                        ₹{selectedEmployee.salary.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Recent Pay History */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Recent Pay History
                    </p>
                    <div className="space-y-2">
                      {fin.payHistory.map((pay, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setPayslipMonth(pay.month);
                            setPayslipModal(true);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-[#00B87C]/30 hover:bg-[#DCFCE7]/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-[#00B87C]">
                              <Calendar size={14} />
                            </div>
                            <span className="text-[13px] font-bold text-foreground">
                              {pay.month}
                            </span>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="text-[13px] font-black text-foreground tracking-tight">
                                ₹{pay.amount.toLocaleString()}
                              </p>
                              <span className="text-[10px] font-bold text-[#00B87C] uppercase tracking-widest">
                                {pay.status}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-muted-foreground group-hover:text-[#00B87C] transition-colors"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View Full Payslip History */}
                  <button
                    onClick={() => setFullHistoryModal(true)}
                    className="w-full py-4 rounded-2xl border border-[#00B87C]/20 text-[#00B87C] font-black text-xs uppercase tracking-widest hover:bg-[#00B87C]/5 transition-all flex items-center justify-center gap-2"
                  >
                    View Full Payslip History <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payslip Modal */}
      <PayslipModal
        open={payslipModal}
        onClose={() => setPayslipModal(false)}
        employee={selectedEmployee}
        month={payslipMonth}
        addToast={addToast}
      />

      {/* Full Payslip History Modal */}
      <FullPayslipHistoryModal
        open={fullHistoryModal}
        onClose={() => setFullHistoryModal(false)}
        employee={selectedEmployee}
        addToast={addToast}
      />

      {/* Toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

/* ─── HELPER COMPONENTS ─── */
interface FilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-4 pr-10 py-3 rounded-2xl bg-card border border-border text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 cursor-pointer transition-all hover:border-[#00B87C]/50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-[#00B87C] transition-colors"
      />
    </div>
  );
}
