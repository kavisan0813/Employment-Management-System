import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Clock, Laptop, FileText, Send, MessageSquare, CheckCircle2, User, HelpCircle, Layers } from "lucide-react";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import { ExitEmployee } from "../types/offboarding.types";
import { progressColor } from "../utils/progress";
import { formatCurrency } from "../utils/currency";
import { exitTypeChip, clearanceChip, getClearanceIcon } from "../utils/chips";
import type { OffboardingTemplate } from "../types/offboarding.types";
import { showToast } from "../../../components/workflow/ToastNotification";
import { useAuth } from "../../../context/AuthContext";

interface OffboardingDetailProps {
  exit: ExitEmployee;
  templates: OffboardingTemplate[];
  onAssignTemplate: (templateId: string) => void;
  onClose: () => void;
  onVerifyDocument: (documentId: string, approved: boolean) => void;
  onGenerateDoc: (doc: string) => void;
  onSendReminder: () => void;
  onScheduleInterview: () => void;
  onSendToFinance: () => void;
  onApproveClearance: (dept: string, approvedBy: string, comments: string) => void;
}

const CLEARANCE_CONFIGS: Record<
  string,
  { permission: string; checklist: string[] }
> = {
  Manager: {
    permission: P.OFFBOARDING_CLEARANCE_MANAGER,
    checklist: ["Knowledge Transfer Completed", "Team Handover Completed"],
  },
  IT: {
    permission: P.OFFBOARDING_CLEARANCE_IT,
    checklist: [
      "Laptop & Charger Returned",
      "Company Mobile Returned",
      "Email Account Deactivated",
      "VPN & Access Revoked",
    ],
  },
  Finance: {
    permission: P.OFFBOARDING_CLEARANCE_FINANCE,
    checklist: [
      "Full & Final Settlement Completed",
      "No Pending Advances/Loans",
      "Reimbursements Cleared",
    ],
  },
  HR: {
    permission: P.OFFBOARDING_CLEARANCE_HR,
    checklist: [
      "Exit Interview Conducted",
      "Experience Letter Generated",
      "Relieving Letter Signed",
      "HR Records Updated",
    ],
  },
  Admin: {
    permission: P.OFFBOARDING_CLEARANCE_ADMIN,
    checklist: [
      "ID Card & Access Badge Returned",
      "Locker Keys Handed Over",
      "Parking Permit Cancelled",
    ],
  },
};

export const OffboardingDetail: React.FC<OffboardingDetailProps> = ({
  exit,
  templates,
  onAssignTemplate,
  onClose,
  onVerifyDocument,
  onGenerateDoc,
  onSendReminder,
  onScheduleInterview,
  onSendToFinance,
  onApproveClearance,
}) => {
  const { user } = useAuth();
  const colors = progressColor(exit.progress);
  const canVerifyDocuments = usePermissionKey(P.OFFBOARDING_DOCUMENTS_VERIFY);
  const canManageFinance = usePermissionKey(P.OFFBOARDING_FINANCE_MANAGE);
  const canManageOffboarding = usePermissionKey(P.OFFBOARDING_MANAGE);
  
  const canOverrideClearances = usePermissionKey(P.OFFBOARDING_FULL);
  const canApproveManager = usePermissionKey(P.OFFBOARDING_CLEARANCE_MANAGER);
  const canApproveIT = usePermissionKey(P.OFFBOARDING_CLEARANCE_IT);
  const canApproveFinance = usePermissionKey(P.OFFBOARDING_CLEARANCE_FINANCE);
  const canApproveHR = usePermissionKey(P.OFFBOARDING_CLEARANCE_HR);
  const canApproveAdmin = usePermissionKey(P.OFFBOARDING_CLEARANCE_ADMIN);

  const clearanceApprovalByDepartment: Record<string, boolean> = {
    Manager: canApproveManager,
    IT: canApproveIT,
    Finance: canApproveFinance,
    HR: canApproveHR,
    Admin: canApproveAdmin,
  };

  const [completedChecks, setCompletedChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [deptComments, setDeptComments] = useState<Record<string, string>>({});

  const toggleCheck = (dept: string, item: string) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [item]: !prev[dept]?.[item],
      },
    }));
  };

  const handleApproveClick = (dept: string) => {
    const comment = deptComments[dept] || "";
    const approverName = user?.name || user?.role || "System Admin";
    onApproveClearance(dept, approverName, comment);
    setDeptComments((prev) => ({ ...prev, [dept]: "" }));
  };

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

        {!exit.assignedTemplateId ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 bg-background/50 animate-in fade-in duration-300">
            <div className="p-8 max-w-xl w-full bg-card border border-border rounded-3xl shadow-lg space-y-6">
              <div className="text-center">
                <Layers className="mx-auto mb-3 text-[#00B87C]" size={32} />
                <h3 className="text-base font-black text-foreground">Assign Offboarding Template</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Assign a configured exit template to automatically generate clearances checklist, asset recovery rules, and exit forms for {exit.name}.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Employee Details
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 border rounded-2xl text-[12px] font-semibold text-foreground">
                    <div>Department: <span className="font-bold">{exit.department}</span></div>
                    <div>Designation: <span className="font-bold">{exit.designation}</span></div>
                    <div>LWD: <span className="font-bold">{exit.lwd}</span></div>
                    <div>Notice Period: <span className="font-bold">{exit.noticePeriodDays} Days</span></div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Select Active Template
                  </label>
                  {(() => {
                    const matching = templates.filter(t => t.status === "active" && t.department === exit.department);
                    const others = templates.filter(t => t.status === "active" && t.department !== exit.department);
                    const activeTemplates = matching.length > 0 ? matching : templates.filter(t => t.status === "active");

                    return (
                      <div className="space-y-3">
                        <select
                          id="assign-offboarding-template-select"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:border-[#00B87C] transition-all"
                          defaultValue=""
                          onChange={(e) => ((window as any)._selected_assign_off_tpl = e.target.value)}
                        >
                          <option value="">Select template...</option>
                          {matching.length > 0 && (
                            <optgroup label={`Matching templates for ${exit.department}`}>
                              {matching.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} (v{t.version})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {others.length > 0 && (
                            <optgroup label="Other Department Templates">
                              {others.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} ({t.department})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        {activeTemplates.length === 0 && (
                          <p className="text-[11px] text-amber-600 font-bold">
                            No active offboarding templates found. Please create one in the templates tab first.
                          </p>
                        )}

                        <button
                          onClick={() => {
                            const tplId = (window as any)._selected_assign_off_tpl;
                            if (!tplId) {
                              showToast("Select Template", "error", "Please choose a template from the list first.");
                              return;
                            }
                            onAssignTemplate(tplId);
                          }}
                          className="w-full py-3 rounded-xl bg-[#00B87C] text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-md cursor-pointer"
                        >
                          Assign Template
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-[30%_40%_30%] divide-x divide-border">
            {/* LEFT: Timeline */}
            <div className="p-6 space-y-4 overflow-y-auto">
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
                <div className="space-y-4">
                  {exit.clearance.map((c, i) => {
                    const IconComp = getClearanceIcon(c.icon);
                    const clearanceChecklist = c.checklist || CLEARANCE_CONFIGS[c.dept]?.checklist || [];
                    const config = {
                      permission: CLEARANCE_CONFIGS[c.dept]?.permission || "",
                      checklist: clearanceChecklist,
                    };
                    
                    const isCleared = c.status === "cleared";
                    const canApprove = !isCleared &&
                      (canOverrideClearances ||
                        clearanceApprovalByDepartment[c.dept] === true);

                    const allChecked = config.checklist.every(
                      (item) => completedChecks[c.dept]?.[item] === true
                    );

                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCleared
                            ? "border-[#00B87C]/20 bg-[#F0FDF4]/30 dark:bg-emerald-950/5"
                            : "border-border/60 bg-muted/20"
                        }`}
                      >
                        {/* Dept Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: c.bgColor }}
                            >
                              <IconComp size={14} style={{ color: c.color }} />
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-foreground">
                                {c.dept} Clearance
                              </p>
                            </div>
                          </div>
                          {isCleared ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#00B87C] border border-[#00B87C]/15 text-[9px] font-black uppercase tracking-wider">
                              ✓ Cleared
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-500/15 text-[9px] font-black uppercase tracking-wider">
                              ⏳ Pending
                            </span>
                          )}
                        </div>

                        {/* Checklist */}
                        <div className="space-y-2 mb-3">
                          {config.checklist.map((item, idx) => {
                            const isChecked = completedChecks[c.dept]?.[item] || false;
                            return (
                              <label
                                key={idx}
                                className={`flex items-start gap-2.5 text-[11px] font-bold ${
                                  isCleared
                                    ? "text-muted-foreground"
                                    : canApprove
                                    ? "text-foreground cursor-pointer"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  disabled={isCleared || !canApprove}
                                  checked={isCleared ? true : isChecked}
                                  onChange={() => toggleCheck(c.dept, item)}
                                  className="mt-0.5 h-3.5 w-3.5 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                                />
                                <span>{item}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Sign-off panel */}
                        {isCleared ? (
                          <div className="pt-2 border-t border-border/30 text-[10px] font-bold text-muted-foreground space-y-1">
                            <p>
                              Approved By:{" "}
                              <span className="text-foreground">{c.approvedBy || c.person}</span>
                            </p>
                            <p>
                              Approved On:{" "}
                              <span className="text-foreground">
                                {c.approvedDate} {c.approvedTime}
                              </span>
                            </p>
                            {c.comments && (
                              <p className="mt-1.5 p-2 rounded-xl bg-card border border-border/30 text-foreground font-medium italic">
                                "{c.comments}"
                              </p>
                            )}
                          </div>
                        ) : canApprove ? (
                          <div className="pt-3 border-t border-border/30 space-y-3">
                            <textarea
                              value={deptComments[c.dept] || ""}
                              onChange={(e) =>
                                setDeptComments((prev) => ({
                                  ...prev,
                                  [c.dept]: e.target.value,
                                }))
                              }
                              placeholder={`Enter clearance comments for ${c.dept}...`}
                              className="w-full px-3 py-2 text-[11px] font-medium bg-background border rounded-xl outline-none focus:border-[#00B87C] transition-all"
                              rows={2}
                            />
                            <button
                              disabled={!allChecked}
                              onClick={() => handleApproveClick(c.dept)}
                              className="w-full py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Approve {c.dept} Clearance
                            </button>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-border/30 text-[10px] font-bold text-muted-foreground italic">
                            Awaiting clearance from {c.person}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KT Tasks */}
              {exit.employeeTasks && exit.employeeTasks.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">EMPLOYEE EXIT ACTIONS</h3>
                  <div className="space-y-2">
                    {exit.employeeTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50">
                        <span className="text-[12px] font-bold text-foreground">{task.label}</span>
                        <span className="text-[11px] font-black text-[#00B87C]">Completed {task.completedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          className="text-[11px] font-black text-amber-500 hover:underline cursor-pointer"
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
                          className="text-[11px] font-black text-[#00B87C] hover:underline cursor-pointer"
                        >
                          Generate
                        </button>
                      ) : (
                        <span className="text-[11px] font-black text-amber-500">
                          Pending
                        </span>
                      )}
                      {d.id && d.source === "employee_exit" && d.verificationStatus === "pending" && canVerifyDocuments && (
                        <button onClick={() => onVerifyDocument(d.id!, true)} className="ml-2 text-[10px] font-black text-[#00B87C] hover:underline cursor-pointer">Verify</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Financial + Interview */}
            <div className="p-6 space-y-6 overflow-y-auto">
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
                {canManageOffboarding ? (
                  <button
                    disabled={exit.ffStatus !== "Pending"}
                    onClick={onSendToFinance}
                    className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send size={14} className="inline mr-1.5" /> Initiate F&F
                  </button>
                ) : canManageFinance ? (
                  <button
                    disabled={exit.ffStatus === "Approved & Processed"}
                    onClick={onSendToFinance}
                    className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send size={14} className="inline mr-1.5" /> Approve & Process
                  </button>
                ) : null}
              </div>

              {/* Exit Interview */}
              <div>
                <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                  EXIT INTERVIEW
                </h3>
                <div className="p-4 rounded-2xl border border-border space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">
                      Conducted by
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {exit.interviewDone ? "HR Team" : "Not Done yet"}
                    </span>
                  </div>
                  {!exit.interviewDone && canManageOffboarding ? (
                    <button
                      onClick={onScheduleInterview}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
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
        )}
      </motion.div>
    </div>
  );
};
