import React from "react";
import { X, Printer, Download, CheckCircle2, Building, User, Calendar, ShieldCheck, CreditCard } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import * as m from "motion/react-m";

interface SettlementStatementModalProps {
  settlement: FnFSettlement;
  onClose: () => void;
}

export const SettlementStatementModal: React.FC<SettlementStatementModalProps> = ({
  settlement,
  onClose,
}) => {
  const formatCurrency = (amt: number) => "₹" + amt.toLocaleString("en-IN");

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvLines = [
      `NexusHR EMS — FULL & FINAL SETTLEMENT STATEMENT`,
      `Settlement ID,${settlement.id}`,
      `Employee ID,${settlement.employeeId}`,
      `Employee Name,${settlement.employeeName}`,
      `Department,${settlement.department}`,
      `Designation,${settlement.designation}`,
      `Joining Date,${settlement.joiningDate || "N/A"}`,
      `Last Working Day,${settlement.lwd}`,
      `Exit Reason,${settlement.exitReason || "N/A"}`,
      ``,
      `EARNINGS BREAKDOWN,Amount (INR)`,
      `Basic Salary Payable,${settlement.salary}`,
      `Gratuity,${settlement.gratuity}`,
      `Leave Encashment,${settlement.leaveEncashment}`,
      `Reimbursements,${settlement.reimbursements}`,
      `Bonus,${settlement.bonus}`,
      `Incentives,${settlement.incentives}`,
      `Other Earnings,${settlement.otherEarnings}`,
      `GROSS EARNINGS,${settlement.grossSettlement}`,
      ``,
      `DEDUCTIONS BREAKDOWN,Amount (INR)`,
      `Notice Period Recovery,${settlement.noticePeriodRecovery}`,
      `Loan / Advance Recovery,${settlement.loanRecovery}`,
      `Asset Recovery,${settlement.assetRecovery}`,
      `Tax / TDS Deduction,${settlement.taxDeduction}`,
      `PF / ESI Adjustment,${settlement.pfEsiAdjustment}`,
      `Other Deductions,${settlement.otherDeductions}`,
      `TOTAL DEDUCTIONS,${settlement.totalDeductions}`,
      ``,
      `NET SETTLEMENT PAYABLE,${settlement.netSettlementPayable}`,
      ``,
      `Settlement Status,${settlement.settlementStatus}`,
      `Approved By,${settlement.approvedBy || "N/A"}`,
      `Approved Date,${settlement.approvedDate || "N/A"}`,
      `Payment Status,${settlement.paymentStatus}`,
      `Payment UTR / Ref,${settlement.paymentReference || "N/A"}`,
      `Payment Date,${settlement.paymentDate || "N/A"}`,
      `Payment Method,${settlement.paymentMethod || "N/A"}`,
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FNF-Settlement-${settlement.employeeId}-${settlement.id}.csv`;
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
        {/* Header Actions Toolbar (Hidden on Print) */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#00B87C]" />
            <h2 className="text-lg font-black text-foreground">F&F Settlement Statement</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-[#00B87C] text-white hover:opacity-90 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={14} /> Export Statement CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE STATEMENT BODY */}
        <div className="space-y-6 text-foreground print:space-y-4">
          {/* Organization & Statement Header */}
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#00B87C] font-black text-xl mb-1">
                <Building size={24} />
                <span>NexusHR EMS</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                Enterprise Human Resource & Finance System
              </p>
              <p className="text-[11px] text-muted-foreground">
                Confidential — Official Full & Final Settlement Document
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#00B87C] text-[11px] font-black uppercase tracking-wider border border-emerald-500/20 inline-block mb-2">
                Settlement Statement
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Ref: {settlement.id}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Employee & Employment Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/80">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Employee Name
              </p>
              <p className="text-xs font-bold text-foreground">{settlement.employeeName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Employee ID
              </p>
              <p className="text-xs font-mono font-bold text-foreground">{settlement.employeeId}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Department
              </p>
              <p className="text-xs font-bold text-foreground">{settlement.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Designation
              </p>
              <p className="text-xs font-bold text-foreground">{settlement.designation}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Date of Joining
              </p>
              <p className="text-xs font-bold text-foreground">{settlement.joiningDate || "Jan 15, 2022"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Last Working Day
              </p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{settlement.lwd}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Exit Reason
              </p>
              <p className="text-xs font-bold text-foreground">{settlement.exitReason || "Resignation"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Clearance Gate
              </p>
              <p className="text-xs font-bold text-[#00B87C] flex items-center gap-1">
                <CheckCircle2 size={12} /> 100% Cleared
              </p>
            </div>
          </div>

          {/* Earnings & Deductions Tables Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#00B87C] mb-3 pb-2 border-b border-emerald-500/20 flex items-center justify-between">
                <span>1. Earnings & Additions</span>
                <span>(INR)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Earned Basic & DA</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.salary)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Gratuity Settlement</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.gratuity)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Leave Encashment</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.leaveEncashment)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Expense Reimbursements</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.reimbursements)}</span>
                </div>
                {settlement.bonus > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Bonus Pay</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.bonus)}</span>
                  </div>
                )}
                {settlement.incentives > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Incentives</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.incentives)}</span>
                  </div>
                )}
                {settlement.otherEarnings > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Other Additions</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.otherEarnings)}</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-emerald-500/20 flex justify-between font-black text-sm text-[#00B87C]">
                  <span>GROSS EARNINGS (A)</span>
                  <span className="font-mono">{formatCurrency(settlement.grossSettlement)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-red-500/20 rounded-2xl p-4 bg-red-500/5">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500 mb-3 pb-2 border-b border-red-500/20 flex items-center justify-between">
                <span>2. Deductions & Recoveries</span>
                <span>(INR)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Notice Period Recovery</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.noticePeriodRecovery)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Loan / Advance Recovery</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.loanRecovery)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Asset Recovery / Damages</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.assetRecovery)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">TDS / Income Tax</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.taxDeduction)}</span>
                </div>
                {settlement.pfEsiAdjustment > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">PF / ESI Adjustment</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.pfEsiAdjustment)}</span>
                  </div>
                )}
                {settlement.otherDeductions > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Other Deductions</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrency(settlement.otherDeductions)}</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-red-500/20 flex justify-between font-black text-sm text-red-500">
                  <span>TOTAL DEDUCTIONS (B)</span>
                  <span className="font-mono">{formatCurrency(settlement.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NET SETTLEMENT SUMMARY CALLOUT */}
          <div className="p-6 rounded-2xl bg-[#00B87C]/10 border border-[#00B87C]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Net Full & Final Payable (A - B)
              </p>
              <h3 className="text-2xl md:text-3xl font-black font-mono text-[#00B87C]">
                {formatCurrency(settlement.netSettlementPayable)}
              </h3>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-bold">
                <CreditCard size={14} className="text-[#00B87C]" />
                <span>Status: <strong className="text-foreground">{settlement.settlementStatus}</strong> / Payment: <strong className="text-[#00B87C]">{settlement.paymentStatus}</strong></span>
              </div>
            </div>
          </div>

          {/* Approval & Payment Verification Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Finance Approval Audit
              </p>
              <p className="font-medium text-foreground">
                Approved By: <strong className="font-bold">{settlement.approvedBy || "Finance Manager"}</strong>
              </p>
              <p className="font-medium text-muted-foreground">
                Date: {settlement.approvedDate || "Mar 25, 2026"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Disbursement & Payment Verification
              </p>
              <p className="font-medium text-foreground">
                UTR / Reference: <strong className="font-mono font-bold">{settlement.paymentReference || "Pending UTR"}</strong>
              </p>
              <p className="font-medium text-muted-foreground">
                Method & Date: {settlement.paymentMethod || "NEFT"} ({settlement.paymentDate || "Pending"})
              </p>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-8 border-t border-border flex items-end justify-between text-xs text-muted-foreground">
            <div>
              <div className="w-36 border-b border-muted-foreground/40 mb-1"></div>
              <p className="font-bold text-foreground">Prepared By (Finance)</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-muted-foreground/40 mb-1 ml-auto"></div>
              <p className="font-bold text-foreground">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};
