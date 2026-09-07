import React from "react";
import { X, Printer, Download, Building, ShieldCheck, Award } from "lucide-react";
import type { FnFSettlement } from "../services/fnfService";
import * as m from "motion/react-m";

interface ExperienceLetterModalProps {
  settlement: FnFSettlement;
  onClose: () => void;
}

export const ExperienceLetterModal: React.FC<ExperienceLetterModalProps> = ({
  settlement,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const text = `
NEXUSHR EMS ENTERPRISE — SERVICE & EXPERIENCE CERTIFICATE

Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
Ref ID: EXP-${settlement.employeeId}-2026

TO WHOM IT MAY CONCERN

This is to certify that ${settlement.employeeName} (Employee ID: ${settlement.employeeId}) was employed with NexusHR EMS Enterprise as a ${settlement.designation} in the ${settlement.department} Department from ${settlement.joiningDate || "Jan 15, 2022"} to ${settlement.lwd}.

During their tenure with us, ${settlement.employeeName} demonstrated high technical competence, professional dedication, and strong teamwork.

We appreciate their contributions to the organization and wish them all success in their future endeavors.

For NexusHR EMS Enterprise,

Priya Sharma
Head of Human Resources & Talent Operations
NexusHR EMS Enterprise
    `.trim();

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Experience-Letter-${settlement.employeeId}.txt`;
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
            <Award size={20} className="text-[#8B5CF6]" />
            <h2 className="text-lg font-black text-foreground">Experience Certificate Letter</h2>
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
              className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white hover:opacity-90 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
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
                100 Innovation Boulevard, Cyber City, Tech Corridor · HR Operations
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-[#8B5CF6] text-[11px] font-black uppercase tracking-wider border border-purple-500/20 inline-block mb-2">
                Experience Certificate
              </span>
              <p className="text-xs font-mono font-bold text-muted-foreground">
                Ref: EXP-{settlement.employeeId}-2026
              </p>
              <p className="text-xs font-bold text-foreground">
                Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <h3 className="text-lg font-black tracking-widest text-foreground uppercase underline decoration-[#8B5CF6] underline-offset-8">
              TO WHOM IT MAY CONCERN
            </h3>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-foreground font-medium">
            <p>
              This is to certify that <strong>{settlement.employeeName}</strong> (Employee ID: <strong className="font-mono">{settlement.employeeId}</strong>) was employed with <strong>NexusHR EMS Enterprise</strong> as a <strong>{settlement.designation}</strong> in the <strong>{settlement.department}</strong> Department from <strong>{settlement.joiningDate || "Jan 15, 2022"}</strong> to <strong>{settlement.lwd}</strong>.
            </p>

            <p>
              During their tenure with us, {settlement.employeeName} demonstrated high technical proficiency, professional dedication, and exemplary performance across assigned organizational responsibilities.
            </p>

            <p>
              All departmental clearance requirements, asset return protocols, and company obligations have been fully satisfied.
            </p>

            <p>
              We express our sincere appreciation for their valuable service and wish them continuous success in all future professional endeavors.
            </p>
          </div>

          {/* Signatory */}
          <div className="pt-12 border-t border-border flex justify-between items-end text-xs">
            <div>
              <p className="font-mono font-bold text-muted-foreground text-[11px]">Digitally Certified by HR Operations</p>
              <p className="text-[10px] text-muted-foreground">Verification Hash: 0x889392A0B7F</p>
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
