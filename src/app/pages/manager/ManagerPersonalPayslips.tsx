import { useState, useMemo } from "react";
import {
  IndianRupee,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  FileText,
  TrendingUp,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion } from "motion/react";

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  paidDate: string;
  status: "Paid" | "Processing" | "Pending";
  breakdown: {
    basicSalary: number;
    hra: number;
    conveyance: number;
    medicalAllowance: number;
    specialAllowance: number;
    providentFund: number;
    professionalTax: number;
    incomeTax: number;
  };
}

const MOCK_PAYSLIPS: Payslip[] = [
  {
    id: "PAY-2026-04",
    month: "April",
    year: 2026,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "May 1, 2026",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
  {
    id: "PAY-2026-03",
    month: "March",
    year: 2026,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "Apr 1, 2026",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
  {
    id: "PAY-2026-02",
    month: "February",
    year: 2026,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "Mar 1, 2026",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
  {
    id: "PAY-2026-01",
    month: "January",
    year: 2026,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "Feb 1, 2026",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
  {
    id: "PAY-2025-12",
    month: "December",
    year: 2025,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "Jan 1, 2026",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
  {
    id: "PAY-2025-11",
    month: "November",
    year: 2025,
    grossPay: 200000,
    deductions: 38000,
    netPay: 162000,
    paidDate: "Dec 1, 2025",
    status: "Paid",
    breakdown: {
      basicSalary: 100000,
      hra: 40000,
      conveyance: 10000,
      medicalAllowance: 5000,
      specialAllowance: 45000,
      providentFund: 12000,
      professionalTax: 200,
      incomeTax: 25800,
    },
  },
];

const YEARS = ["All Years", "2026", "2025", "2024"];
const MONTHS = [
  "All Months",
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

function PayslipModal({
  payslip,
  onClose,
}: {
  payslip: Payslip;
  onClose: () => void;
}) {
  const earnings = [
    { label: "Basic Salary", value: payslip.breakdown.basicSalary },
    { label: "HRA", value: payslip.breakdown.hra },
    { label: "Conveyance Allowance", value: payslip.breakdown.conveyance },
    { label: "Medical Allowance", value: payslip.breakdown.medicalAllowance },
    { label: "Special Allowance", value: payslip.breakdown.specialAllowance },
  ];
  const deductionItems = [
    { label: "Provident Fund (PF)", value: payslip.breakdown.providentFund },
    { label: "Professional Tax", value: payslip.breakdown.professionalTax },
    { label: "Income Tax (TDS)", value: payslip.breakdown.incomeTax },
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[580px] max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <IndianRupee size={20} className="text-[#00B87C]" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-foreground">
                Payslip Preview
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                {payslip.month} {payslip.year} · {payslip.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-xl transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider mb-1">
                Employee
              </p>
              <p className="text-[15px] font-bold text-foreground">
                Suresh Iyer
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                #EMP-1045 · Operations Manager
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Pay Period
              </p>
              <p className="text-[15px] font-bold text-foreground">
                {payslip.month} {payslip.year}
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                Paid: {payslip.paidDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={12} /> Earnings
              </h4>
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                {earnings.map((e, i) => (
                  <div
                    key={i}
                    className={`flex justify-between px-4 py-3 text-[12px] ${i < earnings.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="font-medium text-muted-foreground">
                      {e.label}
                    </span>
                    <span className="font-bold text-foreground">
                      ₹{e.value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-3 bg-emerald-500/5 border-t border-emerald-500/20">
                  <span className="text-[12px] font-bold text-[#00B87C]">
                    Gross Pay
                  </span>
                  <span className="text-[12px] font-bold text-[#00B87C]">
                    ₹{payslip.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowDownCircle size={12} /> Deductions
              </h4>
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                {deductionItems.map((d, i) => (
                  <div
                    key={i}
                    className={`flex justify-between px-4 py-3 text-[12px] ${i < deductionItems.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="font-medium text-muted-foreground">
                      {d.label}
                    </span>
                    <span className="font-bold text-rose-500">
                      ₹{d.value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-3 bg-rose-500/5 border-t border-rose-500/20">
                  <span className="text-[12px] font-bold text-rose-500">
                    Total Deductions
                  </span>
                  <span className="text-[12px] font-bold text-rose-500">
                    ₹{payslip.deductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#00B87C] rounded-2xl flex items-center justify-between shadow-xl shadow-emerald-500/20">
            <div>
              <p className="text-white/70 text-[11px] font-bold uppercase tracking-wider mb-1">
                Net Take-Home Pay
              </p>
              <p className="text-[28px] font-bold text-white">
                ₹{payslip.netPay.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-white/70 text-[12px] font-bold">
              <p>Credited to</p>
              <p className="font-bold text-white">ICICI Bank ****9852</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-secondary/30 flex gap-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Close
          </button>
          <button
            onClick={() =>
              showToast(
                "Downloading",
                "success",
                `${payslip.month} ${payslip.year} payslip PDF downloaded.`,
              )
            }
            className="flex-[2] py-3.5 bg-[#00B87C] text-white rounded-2xl text-[13px] font-bold uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ManagerPersonalPayslips() {
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [showYearDrop, setShowYearDrop] = useState(false);
  const [showMonthDrop, setShowMonthDrop] = useState(false);
  const [previewPayslip, setPreviewPayslip] = useState<Payslip | null>(null);

  const filteredPayslips = useMemo(() => {
    return MOCK_PAYSLIPS.filter((p) => {
      const yearMatch =
        selectedYear === "All Years" || p.year === parseInt(selectedYear);
      const monthMatch =
        selectedMonth === "All Months" || p.month === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [selectedYear, selectedMonth]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <IndianRupee size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
              My Payslips
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              View and download your monthly salary statements
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            showToast("Exporting", "info", "Generating annual pay statement...")
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground hover:bg-secondary/80 transition-all"
        >
          <Download size={16} /> Export Annual Statement
        </button>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
              <Wallet size={20} className="text-[#00B87C]" />
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Current CTC
            </p>
          </div>
          <p className="text-[28px] font-bold text-[#00B87C]">₹24L</p>
          <p className="text-[12px] font-bold text-muted-foreground mt-1">
            Annual package · Revised Apr 2025
          </p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#00B87C]" />
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Monthly Net Pay
            </p>
          </div>
          <p className="text-[28px] font-bold text-[#00B87C]">₹1,62,000</p>
          <p className="text-[12px] font-bold text-muted-foreground mt-1">
            After all deductions · April 2026
          </p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-rose-500/10 flex items-center justify-center">
              <ArrowDownCircle size={20} className="text-rose-500" />
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Monthly Deductions
            </p>
          </div>
          <p className="text-[28px] font-bold text-rose-500">₹38,000</p>
          <p className="text-[12px] font-bold text-muted-foreground mt-1">
            PF + Tax + Professional Tax
          </p>
        </div>
      </div>

      {/* ─── Table Card ──────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[1.5px]">
              PAYSLIP HISTORY
            </h3>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              {filteredPayslips.length} records
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Month Filter */}
            <div className="relative">
              <div
                onClick={() => {
                  setShowMonthDrop(!showMonthDrop);
                  setShowYearDrop(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-[11px] font-bold text-foreground cursor-pointer hover:bg-secondary/80 transition-all"
              >
                {selectedMonth}{" "}
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
              {showMonthDrop && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[150px] max-h-[220px] overflow-y-auto">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMonth(m);
                        setShowMonthDrop(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedMonth === m ? "text-[#00B87C] font-bold" : "text-foreground"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Year Filter */}
            <div className="relative">
              <div
                onClick={() => {
                  setShowYearDrop(!showYearDrop);
                  setShowMonthDrop(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-[11px] font-bold text-foreground cursor-pointer hover:bg-secondary/80 transition-all"
              >
                {selectedYear}{" "}
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
              {showYearDrop && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[120px]">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setSelectedYear(y);
                        setShowYearDrop(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedYear === y ? "text-[#00B87C] font-bold" : "text-foreground"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase">
                  Month
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase text-right">
                  Gross Pay
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase text-right">
                  Deductions
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase text-right">
                  Net Pay
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase">
                  Paid Date
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayslips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText
                        size={40}
                        className="text-muted-foreground/30"
                      />
                      <p className="text-[14px] font-bold text-muted-foreground">
                        No payslips found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayslips.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#00B87C]/[0.08] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                          <IndianRupee size={16} className="text-[#00B87C]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-foreground">
                            {p.month} {p.year}
                          </p>
                          <p className="text-[11px] font-bold text-muted-foreground">
                            {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[14px] font-bold text-foreground">
                        ₹{p.grossPay.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[14px] font-bold text-rose-500">
                        ₹{p.deductions.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[16px] font-bold text-[#00B87C]">
                        ₹{p.netPay.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">
                      {p.paidDate}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === "Paid" ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-[#00B87C] border border-[#00B87C]/20 flex items-center gap-1.5 w-fit uppercase tracking-wider">
                          <CheckCircle2 size={11} /> Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 w-fit uppercase tracking-wider">
                          <Clock size={11} /> {p.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setPreviewPayslip(p)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-[11px] font-bold text-foreground hover:bg-secondary hover:border-[#00B87C]/30 transition-all"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() =>
                            showToast(
                              "Downloading",
                              "success",
                              `${p.month} ${p.year} payslip downloaded.`,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-[#00B87C] hover:bg-emerald-500/20 transition-all"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-6 border-t border-border flex items-center justify-between bg-secondary/10">
          <p className="text-[12px] font-bold text-muted-foreground">
            Showing {filteredPayslips.length} of {MOCK_PAYSLIPS.length} payslips
          </p>
          <p className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider">
            FY 2025–26
          </p>
        </div>
      </div>

      {/* ─── Preview Modal ────────────────────────────────────────── */}
      {previewPayslip && (
        <PayslipModal
          payslip={previewPayslip}
          onClose={() => setPreviewPayslip(null)}
        />
      )}
    </div>
  );
}
