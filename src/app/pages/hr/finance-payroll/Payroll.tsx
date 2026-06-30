import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { EmployeePayslips } from "../../employee/EmployeePayslips";
import { useAuth } from "../../../context/AuthContext";
import {
  Download,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowDownRight,
  MoreVertical,
  Printer,
  Mail,
  Edit2,
  Wallet,
  Zap,
  TrendingUp,
  Shield,
  Cpu,
  BarChart3,
  PieChart,
  Sparkles,
  BanknoteIcon,
  BadgeCheck,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  CircleDollarSign,
  ChevronUp,
  Layers,
  Lock,
  Unlock,
  SendHorizonal,
} from "lucide-react";
import { payrollEmployees, leaveRequests, employees } from "../../../data/mockData";

/* ─── Constants ─────────────────────────── */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = ["2024", "2025", "2026"];
const DEPT_COLORS: Record<string, string> = {
  Engineering: "#10b981",
  Marketing: "#6366f1",
  Design: "#f59e0b",
  Finance: "#0ea5e9",
  HR: "#ec4899",
  Product: "#8b5cf6",
  Sales: "#14b8a6",
};

/* ─── Types ──────────────────────────────── */
interface PayrollEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: "Paid" | "Pending" | "On Hold";
  gross: number;
  deductions: number;
  net: number;
  avatar: string;
  bonus?: number;
  bankAccount?: string;
  transferProgress?: number;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

/* ─── Helpers ────────────────────────────── */
const generateMockPayrollForMonthYear = (
  month: string,
  year: string,
): PayrollEmployee[] => {
  const monthIdx = MONTHS.indexOf(month) + 1; // 1 to 12
  const yearNum = parseInt(year);

  // Deterministic seed formula based on month index and year number
  const seed = (monthIdx * 7 + (yearNum - 2024) * 13) % 100;

  return payrollEmployees.map((e, idx) => {
    // Modify gross and deductions slightly based on seed and employee index
    const variancePercent = ((seed + idx) % 15) - 7; // range: -7% to +7%
    const newGross = Math.round(e.gross * (1 + variancePercent / 100));

    // Deductions also vary slightly
    const deductionVariance = ((seed * 3 + idx) % 10) - 5; // range: -5% to +5%
    const newDeductions = Math.round(
      e.deductions * (1 + deductionVariance / 100),
    );

    const newNet = newGross - newDeductions;

    // Determine status deterministically based on whether period is past relative to "April 2026"
    let status: "Paid" | "Pending" | "On Hold" = "Pending";
    const currentYear = 2026;
    const currentMonthIdx = 3; // April (0-indexed)

    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthIdx - 1 < currentMonthIdx)
    ) {
      status = "Paid";
    } else {
      const statusSeed = (seed + idx) % 10;
      if (statusSeed < 6) {
        status = "Paid";
      } else if (statusSeed < 9) {
        status = "Pending";
      } else {
        status = "On Hold";
      }
    }

    return {
      ...e,
      gross: newGross,
      deductions: newDeductions,
      net: newNet,
      status,
      bonus: 0,
      bankAccount: `****${Math.floor(1000 + ((seed * 17 + idx * 31) % 9000))}`,
      transferProgress: status === "Paid" ? 100 : 0,
    };
  });
};

const loadFromStorage = (month: string, year: string): PayrollEmployee[] => {
  const key = `nexus_payroll_records_${month.toLowerCase()}_${year}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as PayrollEmployee[];
  } catch {
    // ignore
  }
  const generated = generateMockPayrollForMonthYear(month, year);
  try {
    localStorage.setItem(key, JSON.stringify(generated));
  } catch {
    // ignore
  }
  return generated;
};

const saveToStorage = (
  month: string,
  year: string,
  data: PayrollEmployee[],
) => {
  const key = `nexus_payroll_records_${month.toLowerCase()}_${year}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

/* ─── Toast System ───────────────────────── */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[300px] animate-in slide-in-from-right-4 duration-300 ${
            t.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100"
              : t.type === "error"
                ? "bg-red-950/90 border-red-500/30 text-red-100"
                : t.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/30 text-amber-100"
                  : "bg-sky-950/90 border-sky-500/30 text-sky-100"
          }`}
        >
          {t.type === "success" && (
            <CheckCircle2
              size={18}
              className="text-emerald-400 shrink-0 mt-0.5"
            />
          )}
          {t.type === "error" && (
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          )}
          {t.type === "warning" && (
            <AlertTriangle
              size={18}
              className="text-amber-400 shrink-0 mt-0.5"
            />
          )}
          {t.type === "info" && (
            <Sparkles size={18} className="text-sky-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">{t.title}</p>
            <p className="text-xs opacity-75 mt-0.5 leading-relaxed">
              {t.message}
            </p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Mini Bar Chart ─────────────────────── */
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-700"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.3 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Donut Chart ────────────────────────── */
function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, v) => s + v.value, 0);
  let cumulative = 0;
  const size = 120;
  const radius = 46;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashArray = `${circumference * pct} ${circumference * (1 - pct)}`;
          const dashOffset = -circumference * cumulative;
          cumulative += pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={radius - 14} fill="var(--card)" />
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]">
              {seg.label}
            </span>
            <span className="text-[10px] font-bold text-foreground ml-auto">
              {((seg.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Transfer Progress Bar ──────────────── */
function TransferProgressBar({
  progress,
  status,
}: {
  progress: number;
  status: string;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          {status === "Paid"
            ? "Transfer Complete"
            : status === "On Hold"
              ? "On Hold"
              : "Awaiting Transfer"}
        </span>
        <span className="text-[9px] font-bold text-emerald-500">
          {progress}%
        </span>
      </div>
      <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            status === "On Hold"
              ? "bg-amber-500"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Payslip Modal ────────────────────── */
function PayslipModal({
  onClose,
  employee,
  month,
  year,
}: {
  onClose: () => void;
  employee: PayrollEmployee;
  month: string;
  year: string;
}) {
  const earnings = [
    { label: "Basic Salary", amount: Math.round(employee.gross * 0.5) },
    { label: "House Rent Allowance", amount: Math.round(employee.gross * 0.2) },
    { label: "Conveyance Allowance", amount: Math.round(employee.gross * 0.1) },
    { label: "Medical Allowance", amount: Math.round(employee.gross * 0.1) },
    { label: "Performance Bonus", amount: Math.round(employee.bonus || 0) },
    { label: "Special Allowance", amount: Math.round(employee.gross * 0.1) },
  ].filter((e) => e.amount > 0);

  const deductionBreakdown = [
    {
      label: "Income Tax (TDS)",
      amount: Math.round(employee.deductions * 0.6),
    },
    { label: "Provident Fund", amount: Math.round(employee.deductions * 0.3) },
    {
      label: "Professional Tax",
      amount: Math.round(employee.deductions * 0.1),
    },
  ];

  const maxRows = Math.max(earnings.length, deductionBreakdown.length);
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push({
      earning: earnings[i] || null,
      deduction: deductionBreakdown[i] || null,
    });
  }

  // Convert Net Salary to Words
  const netInWords = (() => {
    const num = Math.round(employee.net);
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

  const handleEmail = () => {
    const empEmail =
      employees.find((e) => e.id === employee.id)?.email ||
      `${employee.name.toLowerCase().replace(/\s+/g, ".")}@nexushr.com`;
    const subject = encodeURIComponent(
      `Salary Payslip - ${month} ${year} - ${employee.name} (${employee.id})`,
    );
    const body = encodeURIComponent(
      `Dear ${employee.name},\n\n` +
        `Please find below the summary of your payslip for the pay period ${month} ${year}.\n\n` +
        `Employee Details:\n` +
        `------------------------------------------\n` +
        `Employee ID: ${employee.id}\n` +
        `Designation: ${employee.designation}\n` +
        `Department: ${employee.department}\n\n` +
        `Salary Breakdown:\n` +
        `------------------------------------------\n` +
        `Gross Earnings: ₹${employee.gross.toLocaleString()}\n` +
        `Total Deductions: ₹${employee.deductions.toLocaleString()}\n` +
        `Net Pay Disbursed: ₹${employee.net.toLocaleString()}\n\n` +
        `Your payslip is also available for download in the NexusHR portal.\n\n` +
        `Best regards,\n` +
        `Finance Department\n` +
        `NexusHR Inc.`,
    );
    window.location.href = `mailto:${empEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-card rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-emerald-500/10 print-payslip-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header stripe */}
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 no-print" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileText size={20} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                Salary Payslip
              </h3>
              <p className="text-xs text-muted-foreground">
                {month} {year} · {employee.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={handleEmail}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              title="Email"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-500 transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
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
                Pay Period: {month} {year}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-emerald-500/10 text-[#00B87C] border-emerald-500/20">
                <CheckCircle2 size={12} /> {employee.status}
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
              <p className="text-sm font-bold text-foreground">{employee.id}</p>
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
              <p className="text-sm font-bold text-foreground">HDFC Bank</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                Bank A/c No.
              </p>
              <p className="text-sm font-bold text-foreground">
                {employee.bankAccount || "****0000"}
              </p>
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
              <p className="text-sm font-bold text-foreground">PAN/EMR/920</p>
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
                        ? `₹${row.earning.amount.toLocaleString()}`
                        : ""}
                    </td>
                    <td className="px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 text-muted-foreground">
                      {row.deduction?.label || ""}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-red-500">
                      {row.deduction
                        ? `₹${row.deduction.amount.toLocaleString()}`
                        : ""}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/20 font-bold border-t border-neutral-200 dark:border-neutral-800 h-10 text-foreground">
                  <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800">
                    Gross Earnings
                  </td>
                  <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800 text-right font-black">
                    ₹{employee.gross.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 border-r border-neutral-200 dark:border-neutral-800">
                    Total Deductions
                  </td>
                  <td className="px-4 py-2.5 text-right font-black text-red-500">
                    ₹{employee.deductions.toLocaleString()}
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
                  ₹{employee.net.toLocaleString()}
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
            This is a system-generated payslip and does not require a physical
            stamp or signature.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-muted/10 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#00B87C] hover:bg-[#00A06B] shadow-lg shadow-emerald-500/10 flex items-center gap-2 transition-all active:scale-95"
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Insights Panel ──────────────────── */
function AIInsightsPanel({ employees }: { employees: PayrollEmployee[] }) {
  const insights = useMemo(() => {
    const pending = employees.filter((e) => e.status === "Pending").length;
    const onHold = employees.filter((e) => e.status === "On Hold").length;
    const avgNet =
      employees.reduce((s, e) => s + e.net, 0) / (employees.length || 1);
    const topEarner = [...employees].sort((a, b) => b.gross - a.gross)[0];
    return [
      {
        icon: <Sparkles size={14} className="text-violet-400" />,
        text: `${pending} payslips are pending disbursement. Process before the 28th to avoid delays.`,
        color: "violet",
      },
      {
        icon: <TrendingUp size={14} className="text-emerald-400" />,
        text: `Average net pay this cycle is ₹${Math.round(avgNet).toLocaleString()} — up 8.1% from last month.`,
        color: "emerald",
      },
      {
        icon: <Shield size={14} className="text-sky-400" />,
        text:
          onHold > 0
            ? `${onHold} payments on hold. Review compliance flags before releasing.`
            : "All compliance checks passed. No flagged transactions this cycle.",
        color: "sky",
      },
      {
        icon: <Zap size={14} className="text-amber-400" />,
        text: topEarner
          ? `Top earner this cycle: ${topEarner.name} (${topEarner.department}) at ₹${topEarner.gross.toLocaleString()} gross.`
          : "",
        color: "amber",
      },
    ].filter((i) => i.text);
  }, [employees]);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Cpu size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-foreground">
            AI Payroll Insights
          </h3>
          <p className="text-[10px] text-muted-foreground">
            Powered by NexusAI Engine
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-600">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl bg-${ins.color}-500/5 border border-${ins.color}-500/10`}
          >
            <div
              className={`w-6 h-6 rounded-lg bg-${ins.color}-500/10 flex items-center justify-center shrink-0`}
            >
              {ins.icon}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ins.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Run Payroll Modal ─────────────────── */
function RunPayrollModal({
  onClose,
  month,
  year,
  employees,
  onComplete,
}: {
  onClose: () => void;
  month: string;
  year: string;
  employees: PayrollEmployee[];
  onComplete: () => void;
}) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">(
    "confirm",
  );
  const [progress, setProgress] = useState(0);
  const [currentEmp, setCurrentEmp] = useState("");
  const pendingEmps = employees.filter((e) => e.status === "Pending");
  const totalNet = pendingEmps.reduce((s, e) => s + e.net, 0);

  useEffect(() => {
    if (step !== "processing") return;
    let i = 0;
    const names = pendingEmps.map((e) => e.name);
    const interval = setInterval(() => {
      i++;
      setProgress(
        Math.min(100, Math.round((i / Math.max(names.length, 1)) * 100)),
      );
      setCurrentEmp(names[Math.min(i - 1, names.length - 1)] || "");
      if (i >= names.length) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("success");
          onComplete();
        }, 600);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border"
        style={{ backgroundColor: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />

        {step === "confirm" && (
          <>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Play
                    size={26}
                    className="text-white fill-white translate-x-0.5"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-foreground">
                Process Payroll
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Initiating disbursement for{" "}
                <span className="text-foreground font-bold">
                  {month} {year}
                </span>
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-muted/20 divide-y divide-border/50">
                {[
                  {
                    label: "Pending Employees",
                    value: pendingEmps.length.toString(),
                  },
                  {
                    label: "Gross Payout",
                    value: `₹${pendingEmps.reduce((s, e) => s + e.gross, 0).toLocaleString()}`,
                  },
                  {
                    label: "Net Disbursement",
                    value: `₹${totalNet.toLocaleString()}`,
                    highlight: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {row.label}
                    </span>
                    <span
                      className={`text-sm font-black ${row.highlight ? "text-emerald-500" : "text-foreground"}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle
                  size={16}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-600 leading-relaxed">
                  Disbursement is immediate and irreversible. Ensure all records
                  are verified.
                </p>
              </div>
            </div>

            <div className="px-8 py-5 flex gap-3 border-t border-border">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingEmps.length === 0) return;
                  setStep("processing");
                }}
                disabled={pendingEmps.length === 0}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {pendingEmps.length === 0
                  ? "All Processed"
                  : "Confirm & Disburse"}
              </button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
                <SendHorizonal size={32} className="text-emerald-500" />
              </div>
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">
              Processing Transfers
            </h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs">
              Securely initiating bank transfers via NexusPay Gateway
            </p>
            <div className="w-full mb-2">
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between w-full text-[10px] text-muted-foreground font-medium">
              <span className="truncate max-w-[200px]">
                {currentEmp && `Transferring to ${currentEmp}...`}
              </span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-foreground">Disbursed!</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              <span className="text-foreground font-bold">
                {month} {year}
              </span>{" "}
              payroll has been processed successfully. ₹
              {totalNet.toLocaleString()} transferred.
            </p>
            <button
              onClick={onClose}
              className="mt-8 w-full py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-xl shadow-emerald-500/25 hover:opacity-90 active:scale-95 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Edit Payroll Modal ─────────────────── */
function EditPayrollModal({
  employee,
  onClose,
  onSave,
}: {
  employee: PayrollEmployee;
  onClose: () => void;
  onSave: (updated: PayrollEmployee) => void;
}) {
  const [gross, setGross] = useState(employee.gross.toString());
  const [deductions, setDeductions] = useState(employee.deductions.toString());
  const [bonus, setBonus] = useState((employee.bonus || 0).toString());
  const [bankAccount, setBankAccount] = useState(employee.bankAccount || "");
  const [status, setStatus] = useState(employee.status);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grossNum = parseFloat(gross) || 0;
  const deductNum = parseFloat(deductions) || 0;
  const bonusNum = parseFloat(bonus) || 0;
  const netPay = grossNum + bonusNum - deductNum;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (grossNum <= 0) errs.gross = "Gross must be positive";
    if (deductNum < 0) errs.deductions = "Deductions cannot be negative";
    if (bonusNum < 0) errs.bonus = "Bonus cannot be negative";
    if (deductNum >= grossNum) errs.deductions = "Deductions exceed gross pay";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...employee,
      gross: grossNum,
      deductions: deductNum,
      net: netPay,
      bonus: bonusNum,
      bankAccount,
      status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border"
        style={{ backgroundColor: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-sm font-black text-foreground">
                {employee.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {employee.id} · {employee.designation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Gross */}
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Gross Salary (₹)
            </label>
            <input
              type="number"
              value={gross}
              min="0"
              onChange={(e) => setGross(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-transparent text-foreground transition-colors ${errors.gross ? "border-red-500 focus:border-red-500" : "border-border focus:border-emerald-500"}`}
            />
            {errors.gross && (
              <p className="text-xs text-red-500 mt-1">{errors.gross}</p>
            )}
          </div>

          {/* Bonus */}
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Performance Bonus (₹)
            </label>
            <input
              type="number"
              value={bonus}
              min="0"
              onChange={(e) => setBonus(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-transparent text-foreground transition-colors ${errors.bonus ? "border-red-500" : "border-border focus:border-emerald-500"}`}
            />
            {errors.bonus && (
              <p className="text-xs text-red-500 mt-1">{errors.bonus}</p>
            )}
          </div>

          {/* Deductions */}
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Total Deductions (₹)
            </label>
            <input
              type="number"
              value={deductions}
              min="0"
              onChange={(e) => setDeductions(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-transparent text-foreground transition-colors ${errors.deductions ? "border-red-500" : "border-border focus:border-emerald-500"}`}
            />
            {errors.deductions && (
              <p className="text-xs text-red-500 mt-1">{errors.deductions}</p>
            )}
          </div>

          {/* Net Pay Preview */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-sm text-muted-foreground font-medium">
              Calculated Net Pay
            </span>
            <span
              className={`text-lg font-black ${netPay >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              ₹{netPay.toLocaleString()}
            </span>
          </div>

          {/* Bank Account */}
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Bank Account (masked)
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="****1234"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-transparent text-foreground transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as PayrollEmployee["status"])
              }
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-transparent text-foreground transition-colors"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl text-sm hover:opacity-90 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  trend,
  isUp,
  sparkData,
  color,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  trend: string;
  isUp: boolean;
  sparkData: number[];
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative bg-card border border-border rounded-3xl p-6 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div
        className={`absolute -right-6 -top-6 w-28 h-28 rounded-full bg-${color}-500/5 group-hover:scale-150 transition-transform duration-700`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-9 h-9 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}
          >
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? `bg-emerald-500/10 text-emerald-500` : `bg-red-500/10 text-red-500`}`}
          >
            {isUp ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {trend}
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black text-foreground tracking-tight">
          {value}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          {sub}
        </p>
        <div className="mt-4">
          <MiniBarChart
            data={sparkData}
            color={`var(--${color === "emerald" ? "emerald" : color === "rose" ? "red" : "sky"}-500, #10b981)`}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Payroll Component ─────────────── */
export function Payroll() {
  const { user } = useAuth();

  /* ── Guard: Employee role sees their own payslips ── */
  if (user?.role === "Employee") return <EmployeePayslips />;

  /* ── State ── */
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [employeesData, setEmployeesData] = useState<PayrollEmployee[]>(() =>
    loadFromStorage("April", "2026"),
  );
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Paid" | "Pending" | "On Hold"
  >("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [payRangeFilter, setPayRangeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRunModal, setShowRunModal] = useState(false);
  const [payslipEmp, setPayslipEmp] = useState<PayrollEmployee | null>(null);
  const [editingEmp, setEditingEmp] = useState<PayrollEmployee | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<
    "name" | "gross" | "net" | "deductions"
  >("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const itemsPerPage = 8;
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Sync to/from localStorage when month/year changes
  useEffect(() => {
    setEmployeesData(loadFromStorage(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  /* ── Persist to localStorage ── */
  useEffect(() => {
    saveToStorage(selectedMonth, selectedYear, employeesData);
  }, [employeesData, selectedMonth, selectedYear]);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const close = () => {
      setOpenActionId(null);
      setShowMonthDropdown(false);
      setShowYearDropdown(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ── Reset page on filter change ── */
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [statusFilter, searchQuery, deptFilter, payRangeFilter]);

  /* ── Toast helpers ── */
  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Departments list ── */
  const departments = useMemo(
    () => [
      "All",
      ...Array.from(new Set(employeesData.map((e) => e.department))),
    ],
    [employeesData],
  );

  /* ── Filtered & sorted employees ── */
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employeesData
      .filter((emp) => {
        const matchStatus =
          statusFilter === "All" || emp.status === statusFilter;
        const matchDept = deptFilter === "All" || emp.department === deptFilter;
        const matchRange =
          payRangeFilter === "All"
            ? true
            : payRangeFilter === "0-50k"
              ? emp.net < 50000
              : payRangeFilter === "50-100k"
                ? emp.net >= 50000 && emp.net < 100000
                : emp.net >= 100000;
        const matchSearch =
          emp.name.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q);
        return matchStatus && matchDept && matchRange && matchSearch;
      })
      .sort((a, b) => {
        let val = 0;
        if (sortField === "name") val = a.name.localeCompare(b.name);
        else if (sortField === "gross") val = a.gross - b.gross;
        else if (sortField === "net") val = a.net - b.net;
        else if (sortField === "deductions") val = a.deductions - b.deductions;
        return sortDir === "asc" ? val : -val;
      });
  }, [
    statusFilter,
    deptFilter,
    payRangeFilter,
    searchQuery,
    employeesData,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ── Aggregates ── */
  const totalGross = filteredEmployees.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = filteredEmployees.reduce(
    (s, e) => s + e.deductions,
    0,
  );
  const totalNet = filteredEmployees.reduce((s, e) => s + e.net, 0);
  const paidCount = employeesData.filter((e) => e.status === "Paid").length;
  const pendingCount = employeesData.filter(
    (e) => e.status === "Pending",
  ).length;
  const onHoldCount = employeesData.filter(
    (e) => e.status === "On Hold",
  ).length;

  /* ── Department donut data ── */
  const deptDonutData = useMemo(() => {
    const map: Record<string, number> = {};
    employeesData.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + e.gross;
    });
    return Object.entries(map).map(([dept, val]) => ({
      label: dept,
      value: val,
      color: DEPT_COLORS[dept] || "#6b7280",
    }));
  }, [employeesData]);

  /* ── Leave impact ── */
  const getLeaveImpact = (empId: string) => {
    const empName = employeesData.find((e) => e.id === empId)?.name || "";
    const leaves = leaveRequests.filter(
      (lr) => lr.employee.includes(empName) && lr.status === "Approved",
    );
    const days = leaves.reduce((s, lr) => s + lr.days, 0);
    return { days, amount: days > 0 ? Math.round((days / 30) * 1000) : 0 };
  };

  /* ── Sorting toggle ── */
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  /* ── Bulk select ── */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedEmployees.length)
      setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedEmployees.map((e) => e.id)));
  };

  /* ── Bulk actions ── */
  const bulkMarkPaid = () => {
    if (selectedIds.size === 0) return;
    setEmployeesData((prev) =>
      prev.map((e) =>
        selectedIds.has(e.id)
          ? { ...e, status: "Paid" as const, transferProgress: 100 }
          : e,
      ),
    );
    addToast({
      type: "success",
      title: "Bulk Update",
      message: `${selectedIds.size} employee(s) marked as Paid.`,
    });
    setSelectedIds(new Set());
  };

  const bulkHold = () => {
    if (selectedIds.size === 0) return;
    setEmployeesData((prev) =>
      prev.map((e) =>
        selectedIds.has(e.id) ? { ...e, status: "On Hold" as const } : e,
      ),
    );
    addToast({
      type: "warning",
      title: "Payments On Hold",
      message: `${selectedIds.size} payment(s) placed on hold.`,
    });
    setSelectedIds(new Set());
  };

  /* ── CSV Export ── */
  const exportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Designation",
      "Department",
      "Gross",
      "Bonus",
      "Deductions",
      "Net Pay",
      "Status",
    ];
    const rows = filteredEmployees.map((e) => [
      e.id,
      e.name,
      e.designation,
      e.department,
      e.gross,
      e.bonus || 0,
      e.deductions,
      e.net,
      e.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: "info",
      title: "Export Ready",
      message: `Payroll data for ${selectedMonth} ${selectedYear} exported.`,
    });
  };

  /* ── Sort icon helper ── */
  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp size={10} className="text-emerald-500" />
      ) : (
        <ChevronDown size={10} className="text-emerald-500" />
      )
    ) : (
      <ChevronDown size={10} className="opacity-30" />
    );

  /* ─────────────────────────── JSX ─────────────────────────── */
  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="w-full px-4 md:px-8 py-6 pb-20">
        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Wallet size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Payroll Intelligence
              </h1>
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium pl-13">
              Real-time payroll processing · tax management · smart
              disbursements
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm hover:border-emerald-500/50 text-sm font-bold text-foreground transition-all"
              >
                <Calendar size={14} className="text-emerald-500" />
                {selectedMonth}
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground transition-transform ${showMonthDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMonth(m);
                        setShowMonthDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedMonth === m ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm hover:border-emerald-500/50 text-sm font-bold text-foreground transition-all"
              >
                {selectedYear}
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground transition-transform ${showYearDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showYearDropdown && (
                <div className="absolute top-full left-0 mt-2 w-28 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setSelectedYear(y);
                        setShowYearDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedYear === y ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-border hidden sm:block" />

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${showAnalytics ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" : "border-border text-muted-foreground hover:bg-muted/50"}`}
            >
              <BarChart3 size={14} />
              Analytics
            </button>

            <button
              onClick={() => setShowRunModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 hover:opacity-90 active:scale-95 transition-all"
            >
              <Play size={14} className="fill-white" />
              Run Payroll
            </button>
          </div>
        </div>

        {/* ── Status Bar ── */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto">
          {[
            {
              label: `${paidCount} Paid`,
              icon: <BadgeCheck size={12} />,
              color: "emerald",
            },
            {
              label: `${pendingCount} Pending`,
              icon: <Clock size={12} />,
              color: "amber",
            },
            {
              label: `${onHoldCount} On Hold`,
              icon: <Lock size={12} />,
              color: "red",
            },
            {
              label: "TDS Filing: Apr 15",
              icon: <AlertTriangle size={12} />,
              color: "orange",
            },
            {
              label: "Next Payroll: 8 days",
              icon: <Calendar size={12} />,
              color: "sky",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/20 text-${item.color}-600 text-xs font-bold whitespace-nowrap shrink-0`}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatCard
            label="Gross Salary Payout"
            value={`₹${totalGross.toLocaleString()}`}
            sub="Total pre-tax earnings"
            trend="+12.5%"
            isUp
            sparkData={[6, 8, 7, 10, 9, 11, totalGross / 1000]}
            color="emerald"
            icon={<CircleDollarSign size={18} />}
          />
          <StatCard
            label="Total Deductions"
            value={`₹${totalDeductions.toLocaleString()}`}
            sub="Tax, PF & insurance"
            trend="-2.4%"
            isUp={false}
            sparkData={[5, 4, 6, 5, 4, 5, totalDeductions / 1000]}
            color="rose"
            icon={<ArrowDownRight size={18} />}
          />
          <StatCard
            label="Net Disbursement"
            value={`₹${totalNet.toLocaleString()}`}
            sub="Final amount paid to employees"
            trend="+8.1%"
            isUp
            sparkData={[5, 7, 6, 8, 9, 10, totalNet / 1000]}
            color="sky"
            icon={<BanknoteIcon size={18} />}
          />
        </div>

        {/* ── Analytics Section ── */}
        {showAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 animate-in slide-in-from-top-2 duration-300">
            {/* Department Distribution */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <PieChart size={14} className="text-indigo-500" />
                <h3 className="text-sm font-black text-foreground">
                  Dept. Distribution
                </h3>
              </div>
              <DonutChart segments={deptDonutData} />
            </div>

            {/* AI Insights — spans 2 columns */}
            <div className="lg:col-span-2">
              <AIInsightsPanel employees={employeesData} />
            </div>
          </div>
        )}

        {/* ── Filters & Search Bar ── */}
        <div className="bg-card border border-border rounded-3xl p-2 mb-4 flex flex-col md:flex-row items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-2xl w-full md:w-auto">
            {(["All", "Paid", "Pending", "On Hold"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-card text-emerald-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto pr-2">
            <div className="relative flex-1 md:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search name, ID, department..."
                className="w-full bg-muted/30 border border-border rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterOpen(!isFilterOpen);
              }}
              className={`p-2.5 rounded-xl border transition-all ${isFilterOpen ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" : "border-border text-muted-foreground hover:bg-muted/50"}`}
            >
              <Filter size={16} />
            </button>

            <button
              onClick={exportCSV}
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              title="Export CSV"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* ── Expanded Filter Panel ── */}
        {isFilterOpen && (
          <div
            className="bg-card border border-border rounded-3xl p-5 mb-4 animate-in slide-in-from-top-2 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Department
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 text-foreground"
                >
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Net Pay Range
                </label>
                <select
                  value={payRangeFilter}
                  onChange={(e) => setPayRangeFilter(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 text-foreground"
                >
                  <option value="All">All Ranges</option>
                  <option value="0-50k">Below ₹50,000</option>
                  <option value="50-100k">₹50,000 – ₹1,00,000</option>
                  <option value="100k+">Above ₹1,00,000</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Sort By
                </label>
                <select
                  value={sortField}
                  onChange={(e) =>
                    setSortField(e.target.value as typeof sortField)
                  }
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 text-foreground"
                >
                  <option value="name">Name</option>
                  <option value="gross">Gross</option>
                  <option value="net">Net Pay</option>
                  <option value="deductions">Deductions</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setDeptFilter("All");
                    setPayRangeFilter("All");
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold hover:opacity-90 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Bulk Actions Bar ── */}
        {selectedIds.size > 0 && (
          <div className="mb-4 p-3 bg-indigo-950/80 border border-indigo-500/30 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-bold">
              <Layers size={14} />
              {selectedIds.size} selected
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={bulkMarkPaid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
              >
                <UserCheck size={12} /> Mark Paid
              </button>
              <button
                onClick={bulkHold}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              >
                <Lock size={12} /> Hold
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="p-1.5 rounded-xl hover:bg-white/10 text-indigo-300 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Data Table ── */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1100px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === paginatedEmployees.length &&
                        paginatedEmployees.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Department
                  </th>
                  <th
                    className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("gross")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Base Salary <SortIcon field="gross" />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                    Leave Impact
                  </th>
                  <th
                    className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("deductions")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Deductions <SortIcon field="deductions" />
                    </span>
                  </th>
                  <th
                    className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("net")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Net Pay <SortIcon field="net" />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40">
                {paginatedEmployees.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Search size={32} className="opacity-30" />
                        <p className="text-sm font-medium">
                          No employees match your filters
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("All");
                            setDeptFilter("All");
                          }}
                          className="text-xs text-emerald-500 hover:underline font-bold"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {paginatedEmployees.map((emp) => {
                  const impact = getLeaveImpact(emp.id);
                  const isSelected = selectedIds.has(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`group hover:bg-emerald-500/5 transition-colors ${isSelected ? "bg-indigo-500/5" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(emp.id)}
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Employee */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-10 h-10 rounded-xl object-cover border border-border"
                            />
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                                emp.status === "Paid"
                                  ? "bg-emerald-500"
                                  : emp.status === "On Hold"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase">
                              {emp.id} · {emp.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                DEPT_COLORS[emp.department] || "#6b7280",
                            }}
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {emp.department}
                          </span>
                        </div>
                      </td>

                      {/* Base Salary */}
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-bold text-foreground">
                          ₹{emp.gross.toLocaleString()}
                        </span>
                        {emp.bonus && emp.bonus > 0 && (
                          <p className="text-[9px] text-emerald-500 font-bold">
                            +₹{emp.bonus.toLocaleString()} bonus
                          </p>
                        )}
                      </td>

                      {/* Leave Impact */}
                      <td className="px-5 py-4 text-right">
                        {impact.amount > 0 ? (
                          <div>
                            <span className="text-xs font-bold text-rose-500">
                              -₹{impact.amount.toLocaleString()}
                            </span>
                            <p className="text-[9px] text-muted-foreground font-medium flex items-center justify-end gap-0.5 mt-0.5">
                              <Clock size={9} /> {impact.days}d leave
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-500 font-bold">
                            No Impact
                          </span>
                        )}
                      </td>

                      {/* Deductions */}
                      <td className="px-5 py-4 text-right">
                        <span className="text-xs font-bold text-rose-500">
                          ₹{emp.deductions.toLocaleString()}
                        </span>
                      </td>

                      {/* Net Pay */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            ₹{emp.net.toLocaleString()}
                          </span>
                          <TransferProgressBar
                            progress={
                              emp.transferProgress ||
                              (emp.status === "Paid" ? 100 : 0)
                            }
                            status={emp.status}
                          />
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            emp.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : emp.status === "On Hold"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-slate-500/10 text-slate-600"
                          }`}
                        >
                          {emp.status === "Paid" ? (
                            <BadgeCheck size={11} />
                          ) : emp.status === "On Hold" ? (
                            <Lock size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          {emp.status}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPayslipEmp(emp)}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                            title="View Payslip"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              const csv = `ID,Name,Department,Gross,Net\n${emp.id},${emp.name},${emp.department},${emp.gross},${emp.net}`;
                              const blob = new Blob([csv], {
                                type: "text/csv",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `payslip_${emp.id}.csv`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500/30 transition-all"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>

                          {/* More menu */}
                          <div
                            className="relative"
                            ref={openActionId === emp.id ? actionMenuRef : null}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionId(
                                  openActionId === emp.id ? null : emp.id,
                                );
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            >
                              <MoreVertical size={14} />
                            </button>
                            {openActionId === emp.id && (
                              <div
                                className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-2xl shadow-2xl z-[2000] overflow-hidden animate-in fade-in zoom-in-95"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setOpenActionId(null);
                                    setEditingEmp(emp);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2.5 font-medium"
                                >
                                  <Edit2
                                    size={14}
                                    className="text-indigo-500"
                                  />{" "}
                                  Edit Entry
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenActionId(null);
                                    const empEmail =
                                      employees.find((e) => e.id === emp.id)
                                        ?.email ||
                                      `${emp.name.toLowerCase().replace(/\s+/g, ".")}@nexushr.com`;
                                    const subject = encodeURIComponent(
                                      `Salary Payslip - ${selectedMonth} ${selectedYear} - ${emp.name} (${emp.id})`,
                                    );
                                    const body = encodeURIComponent(
                                      `Dear ${emp.name},\n\n` +
                                        `Please find below the summary of your payslip for the pay period ${selectedMonth} ${selectedYear}.\n\n` +
                                        `Employee Details:\n` +
                                        `------------------------------------------\n` +
                                        `Employee ID: ${emp.id}\n` +
                                        `Designation: ${emp.designation}\n` +
                                        `Department: ${emp.department}\n\n` +
                                        `Salary Breakdown:\n` +
                                        `------------------------------------------\n` +
                                        `Gross Earnings: ₹${emp.gross.toLocaleString()}\n` +
                                        `Total Deductions: ₹${emp.deductions.toLocaleString()}\n` +
                                        `Net Pay Disbursed: ₹${emp.net.toLocaleString()}\n\n` +
                                        `Your payslip is also available for download in the NexusHR portal.\n\n` +
                                        `Best regards,\n` +
                                        `Finance Department\n` +
                                        `NexusHR Inc.`,
                                    );
                                    window.location.href = `mailto:${empEmail}?subject=${subject}&body=${body}`;
                                    addToast({
                                      type: "info",
                                      title: "Email Client Opened",
                                      message: `Drafting payslip email for ${emp.name}.`,
                                    });
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2.5 font-medium"
                                >
                                  <Mail size={14} className="text-sky-500" />{" "}
                                  Email Payslip
                                </button>
                                {emp.status !== "Paid" && (
                                  <button
                                    onClick={() => {
                                      setOpenActionId(null);
                                      setEmployeesData((prev) =>
                                        prev.map((e) =>
                                          e.id === emp.id
                                            ? {
                                                ...e,
                                                status: "Paid" as const,
                                                transferProgress: 100,
                                              }
                                            : e,
                                        ),
                                      );
                                      addToast({
                                        type: "success",
                                        title: "Marked as Paid",
                                        message: `${emp.name}'s payment has been disbursed.`,
                                      });
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-500/10 transition-colors flex items-center gap-2.5 font-medium"
                                  >
                                    <Unlock size={14} /> Mark as Paid
                                  </button>
                                )}
                                <div className="border-t border-border/50">
                                  <button
                                    onClick={() => {
                                      setOpenActionId(null);
                                      setEmployeesData((prev) =>
                                        prev.map((e) =>
                                          e.id === emp.id
                                            ? {
                                                ...e,
                                                status: "On Hold" as const,
                                              }
                                            : e,
                                        ),
                                      );
                                      addToast({
                                        type: "warning",
                                        title: "Payment On Hold",
                                        message: `${emp.name}'s disbursement is now on hold.`,
                                      });
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2.5 font-medium"
                                  >
                                    <Lock size={14} /> Hold Payment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer totals */}
              {filteredEmployees.length > 0 && (
                <tfoot>
                  <tr className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border-t-2 border-emerald-500/20">
                    <td colSpan={3} className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-black text-foreground">
                        <RefreshCw size={14} className="text-emerald-500" />
                        Total Summary ({filteredEmployees.length} Records)
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-foreground text-sm">
                      ₹{totalGross.toLocaleString()}
                    </td>
                    <td className="px-5 py-4" />
                    <td className="px-5 py-4 text-right font-black text-rose-500 text-sm">
                      ₹{totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-lg font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl">
                        ₹{totalNet.toLocaleString()}
                      </span>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">
                Showing{" "}
                <span className="text-foreground font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                –
                <span className="text-foreground font-bold">
                  {Math.min(
                    filteredEmployees.length,
                    currentPage * itemsPerPage,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-bold">
                  {filteredEmployees.length}
                </span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-border hover:text-emerald-500 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-border hover:text-emerald-500 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Payroll Process Timeline ── */}
        <div className="mt-6 bg-card border border-border rounded-3xl p-8 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                <Zap size={14} className="text-amber-500" /> Payroll Pipeline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current cycle status for {selectedMonth} {selectedYear}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold">
              <Loader2 size={11} className="animate-spin" /> In Progress
            </div>
          </div>

          <div className="relative flex justify-between min-w-[700px] px-6">
            {/* Track */}
            <div className="absolute top-[18px] left-12 right-12 h-0.5 bg-border z-0" />
            <div className="absolute top-[18px] left-12 w-2/5 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 z-0" />

            {[
              { label: "Data Collection", status: "completed", desc: "Apr 1" },
              { label: "Attendance Lock", status: "completed", desc: "Apr 5" },
              { label: "Calculation", status: "active", desc: "In Progress" },
              { label: "Review", status: "pending", desc: "Apr 20" },
              { label: "Approval", status: "pending", desc: "Apr 24" },
              { label: "Disbursement", status: "pending", desc: "Apr 28" },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 relative z-10 w-28"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
                    step.status === "completed"
                      ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30"
                      : step.status === "active"
                        ? "bg-card border-emerald-500 ring-4 ring-emerald-500/20"
                        : "bg-card border-border"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : step.status === "active" ? (
                    <Loader2
                      size={16}
                      className="text-emerald-500 animate-spin"
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`text-[11px] font-bold ${
                      step.status === "completed"
                        ? "text-emerald-600"
                        : step.status === "active"
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  <p className="text-[9px] text-muted-foreground font-medium mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating Action Button ── */}
      <div className="fixed bottom-8 right-8 z-[2000]">
        <button
          onClick={() => setShowRunModal(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Play size={20} className="fill-white translate-x-0.5" />
          <div className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Run Payroll
          </div>
        </button>
      </div>

      {/* ── Modals ── */}
      {showRunModal && (
        <RunPayrollModal
          onClose={() => setShowRunModal(false)}
          month={selectedMonth}
          year={selectedYear}
          employees={employeesData}
          onComplete={() => {
            setEmployeesData((prev) =>
              prev.map((e) =>
                e.status === "Pending"
                  ? { ...e, status: "Paid" as const, transferProgress: 100 }
                  : e,
              ),
            );
            addToast({
              type: "success",
              title: "Payroll Complete!",
              message: `All pending disbursements for ${selectedMonth} ${selectedYear} have been processed.`,
            });
          }}
        />
      )}

      {payslipEmp && (
        <PayslipModal
          onClose={() => setPayslipEmp(null)}
          employee={payslipEmp}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

      {editingEmp && (
        <EditPayrollModal
          employee={editingEmp}
          onClose={() => setEditingEmp(null)}
          onSave={(updated) => {
            setEmployeesData((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e)),
            );
            setEditingEmp(null);
            addToast({
              type: "success",
              title: "Record Updated",
              message: `Payroll entry for ${updated.name} has been saved.`,
            });
          }}
        />
      )}
    </>
  );
}
