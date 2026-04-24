import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Printer,
  Mail,
  Edit2,
  Building2,
  Wallet
} from "lucide-react";
import { payrollEmployees, leaveRequests } from "../data/mockData";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = ["2024", "2025", "2026"];

interface PayrollEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: string;
  gross: number;
  deductions: number;
  net: number;
  avatar: string;
}

/* ─── Payslip Modal ────────────────────── */
function PayslipModal({
  onClose,
  employee,
  month,
  year
}: {
  onClose: () => void;
  employee: PayrollEmployee;
  month: string;
  year: string
}) {
  const [, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const components = [
    { label: "Basic Salary", amount: Math.round(employee.gross * 0.5) },
    { label: "HRA", amount: Math.round(employee.gross * 0.2) },
    { label: "Conveyance Allowance", amount: Math.round(employee.gross * 0.1) },
    { label: "Medical Allowance", amount: Math.round(employee.gross * 0.1) },
    { label: "Special Allowance", amount: Math.round(employee.gross * 0.1) },
  ];

  const deductions = [
    { label: "Income Tax (TDS)", amount: Math.round(employee.deductions * 0.6) },
    { label: "Provident Fund", amount: Math.round(employee.deductions * 0.3) },
    { label: "Professional Tax", amount: Math.round(employee.deductions * 0.1) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#06211C] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText size={20} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Employee Payslip</h3>
              <p className="text-xs text-muted-foreground">{month} {year} • {employee.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-emerald-500/10 rounded-lg text-muted-foreground hover:text-emerald-500 transition-colors"
              title="Print Payslip"
            >
              <Printer size={18} />
            </button>
            <button
              className="p-2 hover:bg-emerald-500/10 rounded-lg text-muted-foreground hover:text-emerald-500 transition-colors"
              title="Email to Employee"
            >
              <Mail size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 payslip-content">
          {/* Company Branding */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-black text-emerald-600 tracking-tight">NexusHR</h2>
              <p className="text-sm text-muted-foreground">Premium Enterprise Solutions</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>123 Tech Avenue, Innovation Park</p>
                <p>Silicon Valley, CA 94025</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${employee.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                {employee.status}
              </div>
              <p className="text-xs text-muted-foreground">Payment Date: {month} 28, {year}</p>
            </div>
          </div>

          {/* Employee Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-muted/30 border border-border mb-8">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Employee Name</p>
              <p className="text-sm font-bold text-foreground">{employee.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Designation</p>
              <p className="text-sm font-bold text-foreground">{employee.designation}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Department</p>
              <p className="text-sm font-bold text-foreground">{employee.department}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Pay Period</p>
              <p className="text-sm font-bold text-foreground">{month} {year}</p>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Earnings */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                Earnings
              </h4>
              <div className="space-y-3">
                {components.map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-semibold text-foreground">₹{c.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-dashed border-border flex justify-between items-center font-bold text-foreground">
                  <span>Gross Earnings</span>
                  <span className="text-lg">₹{employee.gross.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                Deductions
              </h4>
              <div className="space-y-3">
                {deductions.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-semibold text-red-500">₹{d.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-dashed border-border flex justify-between items-center font-bold text-foreground">
                  <span>Total Deductions</span>
                  <span className="text-lg text-red-500">₹{employee.deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Highlight */}
          <div className="mt-10 p-8 rounded-3xl bg-emerald-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20">
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Net Payable Amount</p>
              <h2 className="text-4xl font-black">₹{employee.net.toLocaleString()}</h2>
              <p className="text-emerald-200 text-[10px] mt-2 italic">Amount in words: Eight Thousand Three Hundred Sixty Rupees Only</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] text-muted-foreground text-center md:text-left">
            <p>This is a computer generated payslip and does not require a signature.</p>
            <p>© 2026 NexusHR Inc. All rights reserved.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-muted/30 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-foreground border border-border hover:bg-background transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Run Payroll Modal ─────────────────── */
function RunPayrollModal({ onClose, month, year }: { onClose: () => void; month: string; year: string }) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const totalNet = payrollEmployees.reduce((s, e) => s + e.net, 0);

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => setStep("success"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === "confirm" && (
          <>
            <div className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/10"
                >
                  <Play size={28} className="text-emerald-500 fill-emerald-500" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-colors hover:bg-emerald-500/10 text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-foreground tracking-tight">
                Process Payroll
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You are about to run the payroll for <span className="text-foreground font-bold">{month} {year}</span>.
              </p>

              <div
                className="mt-8 rounded-2xl p-6 bg-muted/30 border border-border"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <span className="text-muted-foreground text-xs font-medium">Total Employees</span>
                  <span className="text-foreground text-sm font-bold">{payrollEmployees.length}</span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <span className="text-muted-foreground text-xs font-medium">Gross Payout</span>
                  <span className="text-foreground text-sm font-bold">
                    ₹{payrollEmployees.reduce((s, e) => s + e.gross, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">Net Disbursement</span>
                  <span className="text-emerald-500 text-xl font-black">
                    ₹{totalNet.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-600 text-xs leading-relaxed">
                  Disbursement will be initiated immediately. Please ensure all tax deductions and bonuses are reviewed before confirming.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 flex gap-4 border-t border-border bg-card">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:bg-emerald-500/10 bg-emerald-500/5 text-emerald-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("processing")}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg shadow-emerald-500/20 bg-emerald-600"
              >
                Confirm & Disburse
              </button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                <Loader2 size={40} className="text-emerald-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground">Processing Payroll...</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">
              Securely calculating disbursements and initiating bank transfers.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div
              className="w-20 h-20 rounded-full mb-8 flex items-center justify-center bg-emerald-500/10"
            >
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              Success!
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Payroll for <span className="text-foreground font-bold">{month} {year}</span> has been processed successfully.
            </p>
            <button
              onClick={onClose}
              className="mt-10 w-full py-4 rounded-xl text-sm font-bold text-white transition-all shadow-xl bg-emerald-600 shadow-emerald-500/20"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EditPayrollModal({ employee, onClose, onSave }: { employee: PayrollEmployee, onClose: () => void, onSave: (updated: PayrollEmployee) => void }) {
  const [gross, setGross] = useState(employee.gross.toString());
  const [deductions, setDeductions] = useState(employee.deductions.toString());
  const [status, setStatus] = useState(employee.status);

  const netPay = (parseFloat(gross) || 0) - (parseFloat(deductions) || 0);

  const handleSave = () => {
    onSave({
      ...employee,
      gross: parseFloat(gross) || 0,
      deductions: parseFloat(deductions) || 0,
      net: netPay,
      status
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
          <div>
            <h2 className="text-lg font-black text-foreground">Edit Payroll Entry</h2>
            <p className="text-sm text-muted-foreground">{employee.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-2 block">Gross Salary (₹)</label>
            <input
              type="number"
              value={gross}
              onChange={e => setGross(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 bg-transparent text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-2 block">Deductions (₹)</label>
            <input
              type="number"
              value={deductions}
              onChange={e => setDeductions(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 bg-transparent text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-2 block">Net Pay (₹)</label>
            <div className="w-full border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl px-4 py-3 text-sm font-bold text-emerald-600">
              ₹{netPay.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-2 block">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 bg-transparent text-foreground"
            >
              <option value="Paid">Processed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-border/50 flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="w-1/2 py-3 border border-border text-foreground font-bold rounded-xl text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionSuccessModal({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-[#06211C] rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function Payroll() {
  const [employeesData, setEmployeesData] = useState(payrollEmployees);
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState<PayrollEmployee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<PayrollEmployee | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{ title: string; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const closeMenu = () => setOpenActionId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Filter logic
  const filteredEmployees = useMemo(() => {
    return employeesData.filter(emp => {
      const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery, employeesData]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const totalGross = filteredEmployees.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = filteredEmployees.reduce((s, e) => s + e.deductions, 0);
  const totalNet = filteredEmployees.reduce((s, e) => s + e.net, 0);

  // Helper to get leave impact (mock logic)
  const getLeaveImpact = (empId: string) => {
    const leaves = leaveRequests.filter(lr => lr.employee.includes(employeesData.find(e => e.id === empId)?.name || "") && lr.status === "Approved");
    const totalDays = leaves.reduce((sum, lr) => sum + lr.days, 0);
    if (totalDays === 0) return { days: 0, amount: 0 };
    // Assume 1 day pay deduction for every 3 days leave for this demo
    const impactAmount = Math.round((totalDays / 30) * 1000);
    return { days: totalDays, amount: impactAmount };
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Wallet className="text-emerald-500" size={32} />
            Payroll Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium"> Manage disbursements, taxes, and payslips effortlessly.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 bg-card border border-border shadow-sm hover:border-emerald-500/50 transition-all text-sm font-bold text-foreground"
            >
              <Calendar size={16} className="text-emerald-500" />
              {selectedMonth}
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showMonthDropdown ? "rotate-180" : ""}`} />
            </button>
            {showMonthDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-40 py-2 animate-in slide-in-from-top-2 duration-200">
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedMonth === m ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Selector */}
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 bg-card border border-border shadow-sm hover:border-emerald-500/50 transition-all text-sm font-bold text-foreground"
            >
              {selectedYear}
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
            </button>
            {showYearDropdown && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-2xl z-40 py-2 animate-in slide-in-from-top-2 duration-200">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setShowYearDropdown(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedYear === y ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>

          <button
            onClick={() => setShowRunModal(true)}
            className="flex items-center gap-2.5 rounded-xl px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <Play size={16} className="fill-white" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-card border border-border rounded-xl px-5 py-3 flex items-center gap-6 mb-8 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-[#00B87C]"></div> Payroll due in 8 days
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div> 36 employees pending action
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> TDS filing: Apr 15
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Gross Salary Payout",
            value: `₹${totalGross.toLocaleString()}`,
            trend: "+12.5%",
            isUp: true,
            icon: <ArrowUpRight size={18} />,
            color: "emerald",
            desc: "Total pre-tax earnings"
          },
          {
            label: "Total Deductions",
            value: `₹${totalDeductions.toLocaleString()}`,
            trend: "-2.4%",
            isUp: false,
            icon: <ArrowDownRight size={18} />,
            color: "rose",
            desc: "Tax, PF, and insurance"
          },
          {
            label: "Net Disbursement",
            value: `₹${totalNet.toLocaleString()}`,
            trend: "+8.1%",
            isUp: true,
            icon: <ArrowUpRight size={18} />,
            color: "sky",
            desc: "Final amount paid to employees"
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative group bg-card border border-border rounded-3xl p-6 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${stat.color}-500/5 group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.icon} {stat.trend}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.desc}</p>

              <div className="mt-6 w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stat.color}-500 transition-all duration-1000`}
                  style={{ width: i === 0 ? "85%" : i === 1 ? "40%" : "75%" }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-card border border-border rounded-3xl p-2 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-2xl w-full md:w-auto">
          {["All", "Paid", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as "All" | "Paid" | "Pending")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === status
                ? "bg-white dark:bg-[#04100D] text-emerald-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto pr-2">
          <div className="relative flex-1 md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employee, ID or department..."
              className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
              className={`p-2.5 rounded-xl border transition-colors ${isFilterOpen ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'border-border text-muted-foreground hover:bg-muted/50'}`}
            >
              <Filter size={18} />
            </button>
          </div>
          <button
            onClick={() => {
              const headers = ["ID", "Name", "Department", "Gross", "Deductions", "Net Pay", "Status"];
              const rows = filteredEmployees.map(e => [e.id, e.name, e.department, e.gross, e.deductions, e.net, e.status]);
              const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
              a.click();
            }}
            className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            title="Export CSV"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isFilterOpen && (
        <div className="bg-card border border-border rounded-3xl p-5 mb-6 shadow-sm animate-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">Department</label>
              <select className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-foreground">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Sales</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">Pay Range</label>
              <select className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-foreground">
                <option>All Ranges</option>
                <option>₹0 - ₹50,000</option>
                <option>₹50,000 - ₹100,000</option>
                <option>₹100,000+</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex-1"
              >
                Apply Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2.5 bg-muted border border-border font-bold rounded-xl text-sm hover:bg-background transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Base Salary</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Leave Impact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Deductions</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Net Pay</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedEmployees.map((emp) => {
                const impact = getLeaveImpact(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/10"
                          />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${emp.status === "Paid" ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors">{emp.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase">{emp.id} • {emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">{emp.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-foreground">₹{emp.gross.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-xs font-bold ${impact.amount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                          {impact.amount > 0 ? `-₹${impact.amount}` : "No Impact"}
                        </span>
                        {impact.days > 0 && (
                          <span className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                            <Clock size={10} /> {impact.days} days approved leave
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-rose-500">₹{emp.deductions.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">₹{emp.net.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${emp.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        }`}>
                        {emp.status === "Paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {emp.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedPayslipEmployee(emp)}
                          className="p-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                          title="View Payslip"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedPayslipEmployee(emp)}
                          className="p-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === emp.id ? null : emp.id); }}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openActionId === emp.id && (
                            <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setOpenActionId(null); setEditingEmployee(emp); }} className="w-full text-left px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-muted/50 transition-colors flex items-center gap-2 font-medium">
                                <Edit2 size={16} className="text-slate-600 dark:text-slate-400" /> Edit
                              </button>
                              <button onClick={() => {
                                setOpenActionId(null);
                                setActionSuccess({
                                  title: "Email Sent!",
                                  message: `The payslip for ${emp.name} has been successfully sent to their registered email address.`
                                });
                              }} className="w-full text-left px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-muted/50 transition-colors flex items-center gap-2 font-medium">
                                <Mail size={16} className="text-slate-600 dark:text-slate-400" /> Email Payslip
                              </button>
                              <div className="bg-orange-50 dark:bg-orange-950/20 border-t border-border/50">
                                <button onClick={() => {
                                  setOpenActionId(null);
                                  setEmployeesData(prev => prev.map(e => e.id === emp.id ? { ...e, status: "Pending" } : e));
                                  setActionSuccess({
                                    title: "Payment Held",
                                    message: `The disbursement for ${emp.name} has been placed on hold and moved to Pending status.`
                                  });
                                }} className="w-full text-left px-4 py-3 text-sm text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2 font-medium">
                                  <AlertCircle size={16} className="text-amber-600" /> Hold Payment
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
            <tfoot>
              <tr className="bg-muted/30 font-bold border-t border-border">
                <td className="px-6 py-6" colSpan={2}>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground">Total Summary ({filteredEmployees.length} Records)</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right text-foreground text-sm font-black">₹{totalGross.toLocaleString()}</td>
                <td className="px-6 py-6 text-right"></td>
                <td className="px-6 py-6 text-right text-rose-500 text-sm font-black">₹{totalDeductions.toLocaleString()}</td>
                <td className="px-6 py-6 text-right text-emerald-600 text-lg font-black">₹{totalNet.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">
            Showing <span className="text-foreground font-bold">{Math.min(filteredEmployees.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-foreground font-bold">{Math.min(filteredEmployees.length, currentPage * itemsPerPage)}</span> of <span className="text-foreground font-bold">{filteredEmployees.length}</span> employees
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Process Timeline */}
      <div className="mt-6 bg-card border border-border rounded-3xl p-8 shadow-sm overflow-x-auto">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-10">Process Timeline</h3>

        <div className="relative flex justify-between min-w-[700px] px-4">
          {/* Connecting Line */}
          <div className="absolute top-[11px] left-12 right-12 h-[2px] bg-muted-foreground/20 z-0"></div>

          {/* Timeline Steps */}
          {[
            { label: "Data Collection", status: "completed" },
            { label: "Attendance Lock", status: "completed" },
            { label: "Calculation", status: "active" },
            { label: "Review", status: "pending" },
            { label: "Approval", status: "pending" },
            { label: "Disbursement", status: "pending" }
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-3 relative z-10 w-28">
              <div className="bg-card px-2 pb-1">
                {step.status === "completed" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20"></div>
                )}
                {step.status === "active" && (
                  <div className="w-6 h-6 rounded-full bg-card border-2 border-emerald-400 ring-4 ring-emerald-400/20"></div>
                )}
                {step.status === "pending" && (
                  <div className="w-6 h-6 rounded-full bg-card border-[3px] border-muted-foreground/20"></div>
                )}
              </div>
              <span className={`text-[11px] font-bold text-center -mt-1 ${step.status === "completed" ? "text-emerald-600" :
                step.status === "active" ? "text-foreground" :
                  "text-muted-foreground"
                }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showRunModal && (
        <RunPayrollModal
          onClose={() => setShowRunModal(false)}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

      {selectedPayslipEmployee && (
        <PayslipModal
          onClose={() => setSelectedPayslipEmployee(null)}
          employee={selectedPayslipEmployee}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

      {editingEmployee && (
        <EditPayrollModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={(updated) => {
            setEmployeesData(prev => prev.map(e => e.id === updated.id ? updated : e));
            setEditingEmployee(null);
            setActionSuccess({
              title: "Updated!",
              message: `Payroll records for ${updated.name} have been successfully updated.`
            });
          }}
        />
      )}

      {actionSuccess && (
        <ActionSuccessModal
          title={actionSuccess.title}
          message={actionSuccess.message}
          onClose={() => setActionSuccess(null)}
        />
      )}

      {/* Floating Action Hint */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowRunModal(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Play size={24} className="fill-white translate-x-0.5" />
          <div className="absolute right-full mr-4 px-4 py-2 bg-foreground text-background text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Run Quick Payroll
          </div>
        </button>
      </div>
    </div>
  );
}
