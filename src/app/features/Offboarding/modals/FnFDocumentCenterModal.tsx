import React, { useState } from "react";
import { X, FileText, Download, ShieldCheck, CheckCircle2, AlertCircle, Award, FileCheck, CreditCard, Lock } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import { SettlementStatementModal } from "./SettlementStatementModal";
import { SalarySettlementSlipModal } from "./SalarySettlementSlipModal";
import { ExperienceLetterModal } from "./ExperienceLetterModal";
import { RelievingLetterModal } from "./RelievingLetterModal";
import { PaymentReceiptModal } from "./PaymentReceiptModal";
import * as m from "motion/react-m";

interface FnFDocumentCenterModalProps {
  settlement: FnFSettlement;
  clearancesDone?: boolean;
  onClose: () => void;
}

export const FnFDocumentCenterModal: React.FC<FnFDocumentCenterModalProps> = ({
  settlement,
  clearancesDone = true,
  onClose,
}) => {
  const [activeDocModal, setActiveDocModal] = useState<"statement" | "salary" | "experience" | "relieving" | "receipt" | null>(null);

  const isPaid = settlement.paymentStatus === "PAID";
  const isApproved = settlement.settlementStatus === "APPROVED";

  const documents = [
    {
      id: "statement",
      name: "F&F Settlement Statement",
      description: "Complete financial breakdown of earnings, statutory deductions, and net payable.",
      status: "Available",
      statusColor: "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20",
      isEligible: true,
      icon: FileText,
      classification: "PASS",
    },
    {
      id: "salary",
      name: "Salary Settlement Slip",
      description: "Payroll component slip containing Basic, HRA, PF, ESI, PT, and TDS breakdown.",
      status: "Front-End Ready",
      statusColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      isEligible: true,
      icon: CreditCard,
      classification: "PASS / BACKEND PAYROLL DATA REQUIRED",
    },
    {
      id: "experience",
      name: "Experience Letter",
      description: "Official service & experience certificate signed by HR Operations.",
      status: clearancesDone ? "Available" : "Pending Clearances",
      statusColor: clearancesDone ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20",
      isEligible: clearancesDone,
      icon: Award,
      classification: "PASS / TEMPLATE READY",
    },
    {
      id: "relieving",
      name: "Relieving Letter",
      description: "Formal relieving order confirming resignation acceptance & exit completion.",
      status: isApproved && isPaid ? "Available" : "Pending Payment & Finance Complete",
      statusColor: isApproved && isPaid ? "bg-[#00B87C]/10 text-[#00B87C] border-[#00B87C]/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20",
      isEligible: isApproved && isPaid,
      icon: FileCheck,
      classification: "PASS / TEMPLATE READY",
    },
    {
      id: "receipt",
      name: "Payment Receipt",
      description: "Official treasury disbursement voucher with UTR bank reference number.",
      status: isPaid ? "Available" : "Pending Payment (Status must be PAID)",
      statusColor: isPaid ? "bg-[#00B87C]/10 text-[#00B87C] border-[#00B87C]/20" : "bg-red-500/10 text-red-600 border-red-500/20",
      isEligible: isPaid,
      icon: ShieldCheck,
      classification: "PASS",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-card rounded-[36px] p-6 md:p-8 shadow-2xl border border-border my-8 max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">F&F Document Center</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                Generate, preview and download official exit & settlement documents for {settlement.employeeName} ({settlement.employeeId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Document Cards List */}
        <div className="space-y-4">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-muted/20 border border-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-muted/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shrink-0 shadow-sm">
                    <Icon size={20} className="text-[#00B87C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground">{doc.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${doc.statusColor}`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{doc.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    disabled={!doc.isEligible}
                    onClick={() => setActiveDocModal(doc.id as any)}
                    className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    {!doc.isEligible ? <Lock size={12} /> : <Download size={12} />}
                    {doc.isEligible ? "Preview & Download" : "Not Eligible"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-Modals */}
        {activeDocModal === "statement" && (
          <SettlementStatementModal settlement={settlement} onClose={() => setActiveDocModal(null)} />
        )}
        {activeDocModal === "salary" && (
          <SalarySettlementSlipModal settlement={settlement} onClose={() => setActiveDocModal(null)} />
        )}
        {activeDocModal === "experience" && (
          <ExperienceLetterModal settlement={settlement} onClose={() => setActiveDocModal(null)} />
        )}
        {activeDocModal === "relieving" && (
          <RelievingLetterModal settlement={settlement} onClose={() => setActiveDocModal(null)} />
        )}
        {activeDocModal === "receipt" && (
          <PaymentReceiptModal settlement={settlement} onClose={() => setActiveDocModal(null)} />
        )}
      </m.div>
    </div>
  );
};
