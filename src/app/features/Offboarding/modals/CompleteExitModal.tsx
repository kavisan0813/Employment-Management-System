import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Check } from "lucide-react";
import { ExitEmployee } from "../types/offboarding.types";

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
  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-[#00B87C]" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
          Complete Exit
        </h3>
        <p className="text-[13px] font-medium text-muted-foreground mb-2">
          Are you sure you want to mark{" "}
          <strong className="text-foreground">{exit.name}</strong>'s exit as
          complete?
        </p>
        <p className="text-[11px] font-bold text-amber-500 mb-6">
          This will finalize all records and generate the relieving letter.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1"
          >
            <Check size={14} /> Confirm Complete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
