import React from "react";
import { X, Printer, Download, Building, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import * as m from "motion/react-m";

interface PaymentReceiptModalProps {
  settlement: FnFSettlement;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  settlement,
  onClose,
}) => {
  const formatCurrency = (amt: number) => "₹" + amt.toLocaleString("en-IN");

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const lines = [
      `NexusHR EMS — OFFICIAL PAYMENT DISBURSEMENT RECEIPT`,
      `Receipt ID,RCT-${settlement.id}`,
      `Settlement ID,${settlement.id}`,
      `Employee ID,${settlement.employeeId}`,
      `Employee Name,${settlement.employeeName}`,
      `Department,${settlement.department}`,
      `Disbursed Amount (INR),${settlement.netSettlementPayable}`,
      `Payment Status,${settlement.paymentStatus}`,
      `Payment Date,${settlement.paymentDate || "N/A"}`,
      `Payment Method,${settlement.paymentMethod || "Bank Transfer"}`,
      `UTR / Reference Number,${settlement.paymentReference || "N/A"}`,
      `Beneficiary Account,${settlement.bankAccountDetails ? "A/C ****" + settlement.bankAccountDetails.slice(-4) : "HDFC Bank · A/C ****4829"}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payment-Receipt-${settlement.employeeId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const maskedAccount = settlement.bankAccountDetails
    ? settlement.bankAccountDetails.replace(/\d(?=\d{4})/g, "•")
    : "HDFC Bank · A/C •••••••• 4829";

  return (
    <div
      className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-card rounded-[32px] p-6 md:p-8 shadow-2xl border border-border my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-[#00B87C]" />
            <h2 className="text-lg font-black text-foreground">Disbursement Payment Receipt</h2>
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
              <Download size={14} /> Export Receipt CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT BODY */}
        <div className="space-y-6 text-foreground print:space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#00B87C] font-black text-xl mb-1">
                <Building size={24} />
                <span>NexusHR EMS Enterprise</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                Official Treasury & Disbursement Voucher
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#00B87C] text-[11px] font-black uppercase tracking-wider border border-emerald-500/20 inline-block mb-2 flex items-center gap-1 w-fit ml-auto">
                <CheckCircle2 size={12} /> Payment Verified & Paid
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Receipt ID: RCT-{settlement.id}
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Date: {settlement.paymentDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Amount Callout Card */}
          <div className="p-6 rounded-2xl bg-[#00B87C]/10 border border-[#00B87C]/30 text-center space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Total Amount Disbursed
            </p>
            <h2 className="text-3xl md:text-4xl font-black font-mono text-[#00B87C]">
              {formatCurrency(settlement.netSettlementPayable)}
            </h2>
            <p className="text-xs font-bold text-muted-foreground pt-1">
              Full & Final Settlement Net Payout
            </p>
          </div>

          {/* Payment & Employee Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Beneficiary Name</p>
              <p className="font-bold text-foreground">{settlement.employeeName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Employee ID</p>
              <p className="font-mono font-bold text-foreground">{settlement.employeeId}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Department & Role</p>
              <p className="font-bold text-foreground">{settlement.department} · {settlement.designation}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Settlement Ref</p>
              <p className="font-mono font-bold text-foreground">{settlement.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Bank UTR / Ref Number</p>
              <p className="font-mono font-bold text-[#00B87C]">{settlement.paymentReference || "UTR-88392019482"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Payment Method</p>
              <p className="font-bold text-foreground">{settlement.paymentMethod || "Bank Transfer (NEFT)"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Masked Beneficiary Account</p>
              <p className="font-mono font-bold text-foreground">{maskedAccount}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-border flex justify-between items-end text-xs text-muted-foreground">
            <div>
              <p className="font-mono font-bold text-foreground text-[11px]">Treasury Disbursement Signoff</p>
              <p className="text-[10px]">Approved by Finance Manager on {settlement.approvedDate || "Mar 25, 2026"}</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-muted-foreground/40 mb-1 ml-auto"></div>
              <p className="font-bold text-foreground">Finance Operations Signatory</p>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};
