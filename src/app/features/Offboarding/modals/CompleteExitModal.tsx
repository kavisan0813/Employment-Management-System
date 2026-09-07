import React from "react";
import { CheckCircle2, Check, XCircle, AlertCircle } from "lucide-react";
import { ExitEmployee } from "../types/offboarding.types";
import {
  areAllClearancesComplete,
  areAllDocumentsVerified,
  normalizeExitStatus,
  EXIT_STATUS,
} from "../services/offboardingWorkflow";
import * as m from "motion/react-m";

interface CompleteExitModalProps {
  exit: ExitEmployee;
  onClose: () => void;
  onConfirm: () => void;
}

export const CompleteExitModal: React.FC<CompleteExitModalProps> = ({
  exit,
  onClose,
  onConfirm,
}) => {
  const clearancesDone = areAllClearancesComplete(exit);
  const docsDone = areAllDocumentsVerified(exit);
  const normalizedStatus = normalizeExitStatus(exit.workflowStatus || "");
  const financeDone =
    exit.ffStatus === "Approved & Processed" ||
    normalizedStatus === EXIT_STATUS.FINANCE_COMPLETE ||
    (exit.settlementStatus === "APPROVED" && exit.paymentStatus === "PAID");

  const canComplete = clearancesDone && docsDone && financeDone;

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-full max-w-md bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
            canComplete ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {canComplete ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
        </div>

        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
          Complete Employee Exit
        </h3>
        <p className="text-[13px] font-medium text-muted-foreground mb-4">
          Are you sure you want to mark{" "}
          <strong className="text-foreground">{exit.name}</strong>'s exit as
          complete?
        </p>

        {/* Verification Checklist */}
        <div className="mb-6 p-4 rounded-2xl bg-muted/20 border border-border/60 text-left space-y-2.5">
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
            Exit Completion Requirements
          </p>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              {clearancesDone ? (
                <CheckCircle2 size={14} className="text-[#00B87C]" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              Department Clearances
            </span>
            <span
              className={`text-[11px] font-bold ${
                clearancesDone ? "text-[#00B87C]" : "text-red-500"
              }`}
            >
              {clearancesDone ? "Complete (100%)" : "Incomplete"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              {docsDone ? (
                <CheckCircle2 size={14} className="text-[#00B87C]" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              Document Verification
            </span>
            <span
              className={`text-[11px] font-bold ${
                docsDone ? "text-[#00B87C]" : "text-red-500"
              }`}
            >
              {docsDone ? "Verified" : "Pending / Rejected"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              {financeDone ? (
                <CheckCircle2 size={14} className="text-[#00B87C]" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              Finance / F&F Settlement
            </span>
            <span
              className={`text-[11px] font-bold ${
                financeDone ? "text-[#00B87C]" : "text-red-500"
              }`}
            >
              {financeDone ? "Approved & Processed" : "Pending"}
            </span>
          </div>
        </div>

        {!canComplete && (
          <p className="text-[11px] font-bold text-red-500 mb-6 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            Cannot complete exit: All department clearances, document verification, and Finance F&F settlement must be finished first.
          </p>
        )}

        {canComplete && (
          <p className="text-[11px] font-bold text-amber-500 mb-6">
            This will finalize all exit records, archive system access, and generate the official relieving letter.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!canComplete}
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Check size={14} /> Confirm Complete
          </button>
        </div>
      </m.div>
    </div>
  );
};

