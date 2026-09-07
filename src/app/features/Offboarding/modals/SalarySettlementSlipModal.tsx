import React from "react";
import { X, Printer, Download, Building, ShieldCheck, CreditCard, AlertCircle } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import * as m from "motion/react-m";

interface SalarySettlementSlipModalProps {
  settlement: FnFSettlement;
  onClose: () => void;
}

export const SalarySettlementSlipModal: React.FC<SalarySettlementSlipModalProps> = ({
  settlement,
  onClose,
}) => {
  const formatCurrency = (amt: number) => "₹" + amt.toLocaleString("en-IN");

  // Deconstruct salary components using standard 50-30-20 payroll structure
  const basic = Math.round(settlement.salary * 0.5);
  const hra = Math.round(settlement.salary * 0.3);
  const specialAllowance = Math.round(settlement.salary * 0.2);

  const pfDeduction = settlement.pfEsiAdjustment > 0 ? Math.round(settlement.pfEsiAdjustment * 0.7) : Math.round(basic * 0.12);
  const esiDeduction = settlement.pfEsiAdjustment > 0 ? Math.round(settlement.pfEsiAdjustment * 0.3) : Math.round(settlement.salary * 0.0075);
  const ptDeduction = 200;
  const tdsDeduction = settlement.taxDeduction > 0 ? settlement.taxDeduction : Math.round(settlement.salary * 0.05);

  const totalEarnings = basic + hra + specialAllowance + settlement.leaveEncashment + settlement.reimbursements + settlement.bonus;
  const totalDeductions = pfDeduction + esiDeduction + ptDeduction + tdsDeduction + settlement.noticePeriodRecovery + settlement.loanRecovery;
  const netSalarySettlement = totalEarnings - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const lines = [
      `NexusHR EMS — SALARY SETTLEMENT SLIP`,
      `Employee ID,${settlement.employeeId}`,
      `Employee Name,${settlement.employeeName}`,
      `Department,${settlement.department}`,
      `Designation,${settlement.designation}`,
      `Last Working Day,${settlement.lwd}`,
      ``,
      `SALARY EARNINGS,Amount (INR)`,
      `Basic Salary,${basic}`,
      `House Rent Allowance (HRA),${hra}`,
      `Special Allowance,${specialAllowance}`,
      `Leave Encashment Pay,${settlement.leaveEncashment}`,
      `Reimbursements,${settlement.reimbursements}`,
      `Bonus / Incentives,${settlement.bonus}`,
      `GROSS SALARY EARNINGS,${totalEarnings}`,
      ``,
      `STATUTORY DEDUCTIONS,Amount (INR)`,
      `Provident Fund (PF 12%),${pfDeduction}`,
      `Employee State Insurance (ESI 0.75%),${esiDeduction}`,
      `Professional Tax (PT),${ptDeduction}`,
      `Tax Deducted at Source (TDS),${tdsDeduction}`,
      `Notice Period Recovery,${settlement.noticePeriodRecovery}`,
      `Loan / Advance Recovery,${settlement.loanRecovery}`,
      `TOTAL SALARY DEDUCTIONS,${totalDeductions}`,
      ``,
      `NET SALARY SETTLEMENT PAYABLE,${netSalarySettlement}`,
      `Payment Reference UTR,${settlement.paymentReference || "Pending UTR"}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Salary-Settlement-Slip-${settlement.employeeId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-card rounded-[32px] p-6 md:p-8 shadow-2xl border border-border my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#00B87C]" />
            <div>
              <h2 className="text-lg font-black text-foreground">Salary Settlement Slip</h2>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                FRONTEND READY — BACKEND PAYROLL DATA REQUIRED
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={14} /> Print / PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-[#00B87C] text-white hover:opacity-90 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={14} /> Download CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP BODY */}
        <div className="space-y-6 text-foreground print:space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#00B87C] font-black text-xl mb-1">
                <Building size={24} />
                <span>NexusHR EMS</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                Final Salary Settlement Pay Slip
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[11px] font-black uppercase tracking-wider border border-blue-500/20 inline-block mb-2">
                Salary Settlement Slip
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Settlement Month: {settlement.lwd ? settlement.lwd.split(" ")[0] : "Mar"} 2026
              </p>
            </div>
          </div>

          {/* Employee Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Employee Name</p>
              <p className="font-bold text-foreground">{settlement.employeeName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Employee ID</p>
              <p className="font-mono font-bold text-foreground">{settlement.employeeId}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Department</p>
              <p className="font-bold text-foreground">{settlement.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Designation</p>
              <p className="font-bold text-foreground">{settlement.designation}</p>
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/5 text-xs space-y-2">
              <h4 className="font-black uppercase tracking-wider text-[#00B87C] pb-2 border-b border-emerald-500/20 flex justify-between">
                <span>Salary Earnings</span>
                <span>Amount (INR)</span>
              </h4>
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-mono font-bold">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold">{formatCurrency(hra)}</span>
              </div>
              <div className="flex justify-between">
                <span>Special Allowance</span>
                <span className="font-mono font-bold">{formatCurrency(specialAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Leave Encashment Pay</span>
                <span className="font-mono font-bold">{formatCurrency(settlement.leaveEncashment)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reimbursements</span>
                <span className="font-mono font-bold">{formatCurrency(settlement.reimbursements)}</span>
              </div>
              <div className="pt-2 border-t border-emerald-500/20 flex justify-between font-black text-sm text-[#00B87C]">
                <span>TOTAL SALARY EARNINGS</span>
                <span className="font-mono">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-red-500/20 rounded-2xl p-4 bg-red-500/5 text-xs space-y-2">
              <h4 className="font-black uppercase tracking-wider text-red-500 pb-2 border-b border-red-500/20 flex justify-between">
                <span>Statutory Deductions</span>
                <span>Amount (INR)</span>
              </h4>
              <div className="flex justify-between">
                <span>Provident Fund (PF 12%)</span>
                <span className="font-mono font-bold">{formatCurrency(pfDeduction)}</span>
              </div>
              <div className="flex justify-between">
                <span>Employee State Insurance (ESI)</span>
                <span className="font-mono font-bold">{formatCurrency(esiDeduction)}</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Tax (PT)</span>
                <span className="font-mono font-bold">{formatCurrency(ptDeduction)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Deducted at Source (TDS)</span>
                <span className="font-mono font-bold">{formatCurrency(tdsDeduction)}</span>
              </div>
              {settlement.noticePeriodRecovery > 0 && (
                <div className="flex justify-between">
                  <span>Notice Shortfall Recovery</span>
                  <span className="font-mono font-bold">{formatCurrency(settlement.noticePeriodRecovery)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-red-500/20 flex justify-between font-black text-sm text-red-500">
                <span>TOTAL SALARY DEDUCTIONS</span>
                <span className="font-mono">{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Payable */}
          <div className="p-6 rounded-2xl bg-[#00B87C]/10 border border-[#00B87C]/30 flex justify-between items-center">
            <div>
              <p className="text-[11px] font-black uppercase text-muted-foreground">NET SALARY SETTLEMENT PAYABLE</p>
              <h3 className="text-2xl font-black font-mono text-[#00B87C]">{formatCurrency(netSalarySettlement)}</h3>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-foreground">Disbursement Ref UTR:</p>
              <p className="font-mono text-muted-foreground">{settlement.paymentReference || "Pending UTR"}</p>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};
