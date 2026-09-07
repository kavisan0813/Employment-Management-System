import React from "react";
import { X, Printer, Download, Building, CheckCircle2, FileCheck } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import * as m from "motion/react-m";

interface RelievingLetterModalProps {
  settlement: FnFSettlement;
  onClose: () => void;
}

export const RelievingLetterModal: React.FC<RelievingLetterModalProps> = ({
  settlement,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const text = `
NEXUSHR EMS ENTERPRISE — OFFICIAL RELIEVING LETTER

Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
Ref ID: REL-${settlement.employeeId}-2026

To,
${settlement.employeeName}
Employee ID: ${settlement.employeeId}
Designation: ${settlement.designation}
Department: ${settlement.department}

SUBJECT: RELIEVING LETTER AND ACCEPTANCE OF RESIGNATION

Dear ${settlement.employeeName},

With reference to your resignation, we hereby accept your resignation and confirm that you are formally relieved from your duties and services as ${settlement.designation} at NexusHR EMS Enterprise with effect from the close of working hours on ${settlement.lwd}.

We confirm that all departmental clearances, asset returns, knowledge transfers, and Full & Final settlement obligations have been successfully completed in full.

We thank you for your contributions during your tenure and wish you success in your future endeavors.

Sincerely,

Priya Sharma
Head of Human Resources & Talent Operations
NexusHR EMS Enterprise
    `.trim();

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Relieving-Letter-${settlement.employeeId}.txt`;
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
        className="w-full max-w-3xl bg-card rounded-[32px] p-6 md:p-10 shadow-2xl border border-border my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck size={20} className="text-[#00B87C]" />
            <h2 className="text-lg font-black text-foreground">Official Relieving Letter</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadText}
              className="px-4 py-2 rounded-xl bg-[#00B87C] text-white hover:opacity-90 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={14} /> Download Letter
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE LETTER BODY */}
        <div className="space-y-8 text-foreground print:space-y-6">
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#00B87C] font-black text-xl mb-1">
                <Building size={24} />
                <span>NexusHR EMS Enterprise</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                100 Innovation Boulevard, Cyber City, Tech Corridor · People Operations
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#00B87C] text-[11px] font-black uppercase tracking-wider border border-emerald-500/20 inline-block mb-2">
                Relieving Order
              </span>
              <p className="text-xs font-mono font-bold text-muted-foreground">
                Ref: REL-{settlement.employeeId}-2026
              </p>
              <p className="text-xs font-bold text-foreground">
                Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/20 border border-border/80 text-xs space-y-1">
            <p className="font-bold text-foreground">To,</p>
            <p className="font-bold text-[#00B87C]">{settlement.employeeName}</p>
            <p className="text-muted-foreground">Employee ID: <strong className="font-mono">{settlement.employeeId}</strong></p>
            <p className="text-muted-foreground">{settlement.designation} · {settlement.department} Department</p>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
              SUBJECT: RELIEVING LETTER AND ACCEPTANCE OF RESIGNATION
            </h4>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-foreground font-medium">
            <p>
              Dear <strong>{settlement.employeeName}</strong>,
            </p>

            <p>
              With reference to your notice of resignation, we hereby confirm acceptance of your resignation and state that you are officially relieved from your position as <strong>{settlement.designation}</strong> in the <strong>{settlement.department}</strong> department of NexusHR EMS Enterprise with effect from the close of business hours on <strong>{settlement.lwd}</strong>.
            </p>

            <p>
              We confirm that all departmental clearances (Manager, IT, Admin, HR, and Finance), asset recoveries, and Full & Final financial settlement obligations have been verified and cleared in full.
            </p>

            <p>
              We thank you for your contributions during your period of service with the company and wish you continued success in all your future endeavors.
            </p>
          </div>

          {/* Signatory */}
          <div className="pt-12 border-t border-border flex justify-between items-end text-xs">
            <div>
              <p className="font-mono font-bold text-muted-foreground text-[11px]">Authorized Relieving Document</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 text-[#00B87C] font-bold mt-1">
                <CheckCircle2 size={12} /> 100% Exit Clearance Completed
              </p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-muted-foreground/40 mb-2 ml-auto"></div>
              <p className="font-bold text-foreground text-sm">Priya Sharma</p>
              <p className="text-muted-foreground font-medium">Head of HR & Talent Operations</p>
              <p className="text-muted-foreground font-semibold">NexusHR EMS Enterprise</p>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};
