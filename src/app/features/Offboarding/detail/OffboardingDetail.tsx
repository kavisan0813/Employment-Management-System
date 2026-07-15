import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Clock, Laptop, FileText, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ExitEmployee } from "../types/offboarding.types";
import { progressColor } from "../utils/progress";
import { formatCurrency } from "../utils/currency";
import { exitTypeChip, clearanceChip, getClearanceIcon } from "../utils/chips";

interface OffboardingDetailProps {
  exit: ExitEmployee;
  onClose: () => void;
  onSignOff: (dept: string) => void;
  onGenerateDoc: (doc: string) => void;
  onSendReminder: () => void;
  onScheduleInterview: () => void;
  onSendToFinance: () => void;
}

export const OffboardingDetail: React.FC<OffboardingDetailProps> = ({
  exit,
  onClose,
  onSignOff,
  onGenerateDoc,
  onSendReminder,
  onScheduleInterview,
  onSendToFinance,
}) => {
  const { user } = useAuth();
  const colors = progressColor(exit.progress);

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-6xl max-h-[90vh] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-all"
            >
              <ArrowLeft size={16} className="text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-sm">
              {exit.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-[18px] font-black text-foreground tracking-tight">
                {exit.name}
              </h2>
              <p className="text-[12px] font-medium text-muted-foreground">
                {exit.designation} · {exit.department}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {exitTypeChip(exit.type)}
              <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#8B5CF6] text-[11px] font-semibold uppercase tracking-wider">
                LWD: {exit.lwd.replace(" (OVERDUE!)", "")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={colors.bar}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - exit.progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-[12px] font-black"
                style={{ color: colors.text }}
              >
                {exit.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-[30%_40%_30%] divide-x divide-border">
          {/* LEFT: Timeline */}
          <div className="p-6 space-y-4">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              EXIT TIMELINE
            </h3>
            <div className="space-y-0">
              {exit.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        item.status === "done"
                          ? "bg-[#00B87C] border-[#00B87C]"
                          : item.status === "active"
                            ? "bg-[#CCFBF1] border-[#14B8A6]"
                            : "bg-card border-border"
                      }`}
                    >
                      {item.status === "done" ? (
                        <Check size={10} className="text-white" />
                      ) : item.status === "active" ? (
                        <Clock size={9} className="text-[#14B8A6]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                      )}
                    </div>
                    {i < exit.timeline.length - 1 && (
                      <div className="w-[2px] flex-1 bg-border min-h-[24px]" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p
                      className={`text-[12px] font-bold ${
                        item.status === "done"
                          ? "text-[#00B87C]"
                          : item.status === "active"
                            ? "text-[#14B8A6]"
                            : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Clearances + Assets + Docs */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Clearances */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                DEPARTMENT CLEARANCES
              </h3>
              <div className="space-y-2">
                {exit.clearance.map((c, i) => {
                  const IconComp = getClearanceIcon(c.icon);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#00B87C]/[0.08] transition-all border border-transparent hover:border-[#DCFCE7]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: c.bgColor }}
                        >
                          <IconComp size={14} style={{ color: c.color }} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-foreground">
                            {c.dept}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {c.person}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {clearanceChip(c.status)}
                        {c.status !== "cleared" ? (
                          <button
                            onClick={() => onSignOff(c.dept)}
                            className="px-3 py-1.5 rounded-lg bg-[#00B87C] text-white text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
                          >
                            Sign Off
                          </button>
                        ) : (
                          <CheckCircle2 size={16} className="text-[#00B87C]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assets */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                ASSET RECOVERY CHECKLIST
              </h3>
              <div className="space-y-2">
                {exit.assets.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <Laptop size={14} className="text-muted-foreground" />
                      <div>
                        <p className="text-[12px] font-bold text-foreground">
                          {a.name}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {a.detail}
                        </p>
                      </div>
                    </div>
                    {a.status === "returned" ? (
                      <span className="text-[11px] font-black text-[#00B87C]">
                        ✓ Returned
                      </span>
                    ) : (
                      <button
                        onClick={onSendReminder}
                        className="text-[11px] font-black text-amber-500 hover:underline"
                      >
                        Send Reminder
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                DOCUMENT CHECKLIST
              </h3>
              <div className="space-y-2">
                {exit.documents.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-muted-foreground" />
                      <p className="text-[12px] font-bold text-foreground">
                        {d.name}
                      </p>
                    </div>
                    {d.status === "uploaded" ? (
                      <span className="text-[11px] font-black text-[#00B87C]">
                        ✓ Uploaded
                      </span>
                    ) : d.status === "not_generated" ? (
                      <button
                        onClick={() => onGenerateDoc(d.name)}
                        className="text-[11px] font-black text-[#00B87C] hover:underline"
                      >
                        Generate
                      </button>
                    ) : (
                      <span className="text-[11px] font-black text-amber-500">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Financial + Interview */}
          <div className="p-6 space-y-6">
            {/* F&F Settlement */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                F&F SETTLEMENT CALCULATION
              </h3>
              <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#DCFCE7] dark:border-emerald-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Last Working Month Salary
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.salary)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Gratuity ({Math.round(exit.gratuity / 10800)} yrs)
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.gratuity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Leave Encashment ({Math.round(exit.leaveEncashment / 2333)} days)
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.leaveEncashment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Pending Reimbursements
                  </span>
                  <span className="text-[11px] font-black text-foreground">
                    {formatCurrency(exit.reimbursements)}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black text-foreground">
                    Gross F&F Amount
                  </span>
                  <span className="text-[12px] font-black text-foreground">
                    {formatCurrency(
                      exit.salary +
                        exit.gratuity +
                        exit.leaveEncashment +
                        exit.reimbursements,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Asset Loss Deductions
                  </span>
                  <span className="text-[11px] font-semibold text-[#94A3B8]">
                    {exit.deductions > 0
                      ? `-${formatCurrency(exit.deductions)}`
                      : "-₹0"}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-foreground">
                    NET F&F AMOUNT
                  </span>
                  <span className="text-[13px] font-black text-[#00B87C]">
                    {formatCurrency(exit.netAmount)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-amber-500 border border-[#FDE68A] text-[11px] font-semibold uppercase tracking-wider">
                  <Clock size={12} /> {exit.ffStatus}
                </span>
              </div>
              {user?.role === "HR Manager" ? (
                <button
                  disabled={exit.ffStatus !== "Pending"}
                  onClick={onSendToFinance}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="inline mr-1.5" /> Initiate F&F
                </button>
              ) : (
                <button
                  disabled={exit.ffStatus === "Approved & Processed"}
                  onClick={onSendToFinance}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="inline mr-1.5" /> Approve & Process
                </button>
              )}
            </div>

            {/* Exit Interview */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                EXIT INTERVIEW
              </h3>
              <div className="p-4 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Conducted by
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {exit.interviewDone ? "HR Team" : "Not Done yet"}
                  </span>
                </div>
                {!exit.interviewDone ? (
                  <button
                    onClick={onScheduleInterview}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    Schedule Interview
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-muted/30">
                    <p className="text-[11px] font-medium text-muted-foreground italic">
                      "Good experience overall. Recommend better cross-team collaboration tools."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
