import React, { useState } from "react";
import { motion } from "motion/react";
import { X, MessageSquare, Check, CheckCircle2 } from "lucide-react";

interface ExitInterviewModalProps {
  employeeName: string;
  interviewDone: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ExitInterviewModal: React.FC<ExitInterviewModalProps> = ({
  employeeName,
  interviewDone,
  onClose,
  onComplete,
}) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [recommendVal, setRecommendVal] = useState<string>("");

  if (interviewDone) {
    return (
      <div
        className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle2 size={40} className="text-[#00B87C] mx-auto mb-4" />
          <h3 className="text-lg font-black text-foreground mb-2">
            Interview Already Completed
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-5">
            This exit interview has already been recorded.
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

  const questions = [
    { id: "overall", label: "Overall experience at viyanHR?", type: "rating" },
    {
      id: "recommend",
      label: "Would you recommend viyanHR to others?",
      type: "choice",
      options: ["Yes", "Maybe", "No"],
    },
    { id: "manager", label: "Manager support quality?", type: "rating" },
    { id: "wlb", label: "Work-life balance satisfaction?", type: "rating" },
  ];

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2">
            <MessageSquare size={18} className="text-[#8B5CF6]" />
            Exit Interview — {employeeName}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
          {questions.map((q) => (
            <div key={q.id}>
              <p className="text-[12px] font-bold text-foreground mb-2">
                {q.label}
              </p>
              {q.type === "rating" ? (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setRatings((prev) => ({ ...prev, [q.id]: r }))
                      }
                      className={`w-9 h-9 rounded-xl text-[12px] font-black border transition-all ${
                        ratings[q.id] === r
                          ? "bg-[#00B87C] text-white border-[#00B87C]"
                          : "border-border text-muted-foreground hover:border-[#00B87C]/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {(q.options || []).map((o) => (
                    <button
                      key={o}
                      onClick={() => setRecommendVal(o)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all ${
                        recommendVal === o
                          ? "bg-[#00B87C] text-white border-[#00B87C]"
                          : "border-border text-muted-foreground hover:border-[#00B87C]/30"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              Primary reason for leaving?
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Career Growth",
                "Compensation",
                "Work Culture",
                "Relocation",
                "Personal",
                "Health",
                "Education",
                "Other",
              ].map((r) => (
                <button
                  key={r}
                  className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted-foreground hover:border-[#00B87C]/30 transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              What did you enjoy most?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              What could be improved?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Suggestions..."
            />
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground mb-2">
              Any other feedback?
            </p>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Additional feedback..."
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={onComplete}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1"
          >
            <Check size={14} /> Mark as Completed
          </button>
        </div>
      </motion.div>
    </div>
  );
};
