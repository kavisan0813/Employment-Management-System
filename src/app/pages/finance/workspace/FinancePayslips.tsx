import { useState } from "react";
import { FileText, Download, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../../components/workflow/ToastNotification";

interface Payslip {
  id: string;
  month: string;
  year: string;
  gross: string;
  deductions: string;
  net: string;
  status: "Credited" | "Pending";
  isLatest?: boolean;
}

const payslipsData: Payslip[] = [
  {
    id: "1",
    month: "March",
    year: "2026",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
    isLatest: true,
  },
  {
    id: "2",
    month: "February",
    year: "2026",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
  },
  {
    id: "3",
    month: "January",
    year: "2026",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
  },
  {
    id: "4",
    month: "December",
    year: "2025",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
  },
  {
    id: "5",
    month: "November",
    year: "2025",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
  },
  {
    id: "6",
    month: "October",
    year: "2025",
    gross: "₹1,00,000",
    deductions: "₹17,600",
    net: "₹82,400",
    status: "Credited",
  },
];

export function FinancePayslips() {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [yearFilter, setYearFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");

  const filteredPayslips = payslipsData.filter((p) => {
    const yearMatch = yearFilter === "All" || p.year === yearFilter;
    const monthMatch = monthFilter === "All" || p.month === monthFilter;
    return yearMatch && monthMatch;
  });

  const handleView = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setShowViewer(true);
  };

  const downloadPayslipFile = (payslip: Payslip) => {
    const content = `
==================================================
           viyanHR SOLUTIONS PVT LTD
==================================================
Salary Statement: ${payslip.month} ${payslip.year}
Employee Name: Ananya Sharma
Employee ID: EMP-0088
Designation: Senior Finance Manager
Department: Finance
--------------------------------------------------
Gross Earning: ${payslip.gross}
Total Deductions: ${payslip.deductions}
Net Payable Amount: ${payslip.net}
Status: ${payslip.status}
==================================================
This is a secure, digitally generated pay slip copy.
Thank you for your valuable contribution.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_Ananya_Sharma_${payslip.month}_${payslip.year}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(
      "Download Complete",
      "success",
      `Salary slip for ${payslip.month} ${payslip.year} downloaded.`,
    );
  };

  const downloadAllPayslips = () => {
    let merged = `==================================================\n`;
    merged += `           viyanHR SYSTEM - SALARY HISTORY\n`;
    merged += `==================================================\n`;
    merged += `Employee: Ananya Sharma (EMP-0088)\n\n`;

    payslipsData.forEach((p) => {
      merged += `${p.month} ${p.year}: Gross ${p.gross} | Deductions ${p.deductions} | Net Pay ${p.net} [${p.status}]\n`;
    });
    merged += `\nReport generated on May 29, 2026.`;

    const blob = new Blob([merged], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Payslips_Ananya_Sharma.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(
      "Download Complete",
      "success",
      "All historical payslips downloaded.",
    );
  };

  const handleEmailPayslip = (payslip: Payslip) => {
    showToast(
      "Email Sent",
      "success",
      `Payslip for ${payslip.month} ${payslip.year} sent to ananya.sharma@viyanhr.com`,
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500 overflow-hidden relative">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              My Payslips
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Manage and download your salary statements
            </p>
          </div>
        </div>
        <button
          onClick={downloadAllPayslips}
          className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-secondary transition-all flex items-center gap-2"
        >
          <Download size={16} /> Download All
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="CURRENT CTC"
          value="₹12,00,000"
          subValue="Annual"
          color="purple"
        />
        <KPICard
          label="LAST NET SALARY"
          value="₹82,400"
          subValue="March 2026 · Credited Apr 1"
          color="green"
          chip="Credited"
        />
        <KPICard
          label="YTD EARNINGS"
          value="₹8.2L"
          subValue="FY 2025-26"
          color="default"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <h3 className="text-[14px] font-black text-foreground uppercase tracking-widest">
            PAYSLIPS HISTORY
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-card text-[11px] font-semibold uppercase tracking-wider hover:bg-secondary outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-card text-[11px] font-semibold uppercase tracking-wider hover:bg-secondary outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="All">All Months</option>
              {[
                "January",
                "February",
                "March",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Month
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Gross Salary
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Deductions
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Net Salary
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayslips.map((payslip) => (
                <tr
                  key={payslip.id}
                  className="h-14 hover:bg-[#00B87C]/[0.08] dark:hover:bg-emerald-500/5 transition-all group"
                >
                  <td className="px-8 text-[14px] font-bold text-foreground">
                    <div className="flex items-center gap-3">
                      {payslip.month} {payslip.year}
                      {payslip.isLatest && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[#00B87C] text-[9px] font-black uppercase">
                          Latest
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 text-[14px] font-bold text-muted-foreground">
                    {payslip.gross}
                  </td>
                  <td className="px-8 text-[14px] font-bold text-rose-600">
                    {payslip.deductions}
                  </td>
                  <td className="px-8 text-[14px] font-black text-[#00B87C]">
                    {payslip.net}
                  </td>
                  <td className="px-8">
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${payslip.status === "Credited" ? "text-[#00B87C]" : "text-amber-500"}`}
                    >
                      <CheckCircle2 size={12} /> {payslip.status}
                    </span>
                  </td>
                  <td className="px-8 text-right space-x-2">
                    <button
                      onClick={() => handleView(payslip)}
                      className="px-4 py-1.5 rounded-lg border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all bg-transparent"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadPayslipFile(payslip)}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all bg-transparent"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEWER PANEL */}
      <AnimatePresence>
        {showViewer && selectedPayslip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewer(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-card border-l border-border shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-foreground tracking-tight">
                    Salary Slip
                  </h3>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {selectedPayslip.month} {selectedPayslip.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPayslipFile(selectedPayslip)}
                    className="p-2 rounded-xl bg-[#00B87C] text-white hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20 border-0"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => setShowViewer(false)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground bg-transparent border-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Company Block */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#00B87C] mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#00B87C]/20 mb-4">
                    N
                  </div>
                  <h4 className="text-[16px] font-black text-foreground uppercase tracking-tight">
                    viyanHR Solutions Pvt Ltd
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    123, Business District, Whitefield, Bangalore - 560066
                    <br />
                    CIN: U74140KA2022PTC123456
                  </p>
                </div>

                <div className="h-px bg-border w-full" />

                {/* Employee Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <InfoItem label="Employee Name" value="Ananya Sharma" />
                  <InfoItem label="Emp ID" value="EMP-0088" />
                  <InfoItem
                    label="Designation"
                    value="Senior Finance Manager"
                  />
                  <InfoItem label="Department" value="Finance" />
                  <InfoItem label="Bank Account" value="XXXX XXXX 1234" />
                  <InfoItem label="PAN" value="ABCDE1234F" />
                  <InfoItem
                    label="Pay Period"
                    value={`${selectedPayslip.month} ${selectedPayslip.year}`}
                  />
                  <InfoItem label="Pay Date" value="Apr 1, 2026" />
                </div>

                {/* EARNINGS TABLE */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    EARNINGS
                  </h5>
                  <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
                    <SalaryRow label="Basic Salary" value="₹50,000" />
                    <SalaryRow label="HRA" value="₹20,000" />
                    <SalaryRow label="Conveyance" value="₹1,600" />
                    <SalaryRow label="Medical Allowance" value="₹1,250" />
                    <SalaryRow label="Special Allowance" value="₹27,150" />
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                      <span className="text-xs font-black text-foreground uppercase">
                        Gross Earnings
                      </span>
                      <span className="text-[15px] font-black text-foreground">
                        ₹1,00,000
                      </span>
                    </div>
                  </div>
                </div>

                {/* DEDUCTIONS TABLE */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    DEDUCTIONS
                  </h5>
                  <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
                    <SalaryRow label="PF Employee" value="₹6,000" />
                    <SalaryRow label="Professional Tax" value="₹200" />
                    <SalaryRow label="Income Tax (TDS)" value="₹11,400" />
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                      <span className="text-xs font-black text-rose-600 uppercase">
                        Total Deductions
                      </span>
                      <span className="text-[15px] font-black text-rose-600">
                        ₹17,600
                      </span>
                    </div>
                  </div>
                </div>

                {/* NET PAY */}
                <div className="p-6 rounded-2xl bg-[#00B87C]/5 border border-[#00B87C]/20 text-center space-y-1">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    NET PAYABLE AMOUNT
                  </p>
                  <h2 className="text-[32px] font-black text-[#00B87C] tracking-tight">
                    {selectedPayslip.net}
                  </h2>
                  <p className="text-[11px] font-bold text-[#00B87C] opacity-70 uppercase tracking-widest">
                    Eighty Two Thousand Four Hundred Only
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border space-y-3 bg-muted/20">
                <button
                  onClick={() => downloadPayslipFile(selectedPayslip)}
                  className="w-full py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] shadow-xl shadow-[#00B87C]/20 hover:opacity-95 transition-all border-0"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleEmailPayslip(selectedPayslip)}
                  className="w-full py-4 border border-border bg-card text-foreground rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] hover:bg-muted transition-all"
                >
                  Email Payslip
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function KPICard({
  label,
  value,
  subValue,
  color,
  chip,
}: {
  label: string;
  value: string;
  subValue: string;
  color: "purple" | "green" | "default";
  chip?: string;
}) {
  const colorClasses = {
    purple: "text-purple-600",
    green: "text-emerald-600",
    default: "text-[#111827] dark:text-white",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-[#00B87C]/30 transition-all">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        <h3
          className={`text-2xl font-black tracking-tight ${colorClasses[color]}`}
        >
          {value}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground tracking-tight">
            {subValue}
          </span>
          {chip && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase">
              {chip}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p className="text-[13px] font-bold text-foreground">{value}</p>
    </div>
  );
}

function SalaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-[12px] font-bold text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
