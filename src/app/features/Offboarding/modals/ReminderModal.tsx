import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, X } from "lucide-react";

interface ReminderModalProps {
  exitName: string;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  exitName,
  onClose,
}) => {
  const [sent, setSent] = useState(false);

  if (sent) {
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
          <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-[#00B87C]" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">
            Reminder Sent!
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-5">
            Notification sent to all pending departments.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <Mail size={18} className="text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground">
              Send Reminder — {exitName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REMIND DEPARTMENT
            </label>
            <div className="space-y-2">
              {["IT Team", "Finance Team", "HR Team", "Admin Team"].map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    {d}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              MESSAGE (OPTIONAL)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              placeholder="Reminder message..."
              defaultValue="Please complete pending clearances for this exit at the earliest."
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={() => setSent(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-2"
          >
            <Send size={14} /> Send Reminder
          </button>
        </div>
      </motion.div>
    </div>
  );
};
