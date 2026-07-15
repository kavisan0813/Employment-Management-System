import React from "react";
import { motion } from "motion/react";
import { ChevronRight, Check, Clock, X } from "lucide-react";
import { ExitEmployee } from "../types/offboarding.types";
import { progressColor } from "../utils/progress";
import { exitTypeChip } from "../utils/chips";

interface ExitCardProps {
  exit: ExitEmployee;
  onViewDetail: () => void;
  onSendReminder: () => void;
  onComplete: () => void;
  onScheduleInterview: () => void;
}

export const ExitCard: React.FC<ExitCardProps> = ({
  exit,
  onViewDetail,
  onSendReminder,
  onComplete,
}) => {
  const colors = progressColor(exit.progress);
  const isOverdue = exit.lwd.includes("OVERDUE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all border ${
        isOverdue ? "border-[#EF4444]/50" : "border-border"
      }`}
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-sm shrink-0">
            {exit.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-foreground">
              {exit.name}
            </h4>
            <p className="text-[12px] font-medium text-muted-foreground">
              {exit.designation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#8B5CF6] text-[11px] font-semibold uppercase tracking-wider">
            LWD: {exit.lwd.replace(" (OVERDUE!)", "")}
          </span>
          {exitTypeChip(exit.type)}
        </div>
      </div>

      {/* PROGRESS RING + STEPPER */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="var(--border)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={colors.bar}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - exit.progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
            style={{ color: colors.text }}
          >
            {exit.progress}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Progress Stepper */}
          <div className="flex items-center gap-0">
            {[
              {
                label: "Notice",
                done: exit.timeline
                  .slice(0, 3)
                  .every((t) => t.status === "done"),
              },
              {
                label: "Clearances",
                done: exit.clearance.every((c) => c.status === "cleared"),
              },
              {
                label: "F&F",
                done: exit.timeline
                  .slice(5, 7)
                  .every((t) => t.status === "done"),
              },
              {
                label: "Complete",
                done: exit.timeline[exit.timeline.length - 1].status === "done",
              },
            ].map((step, idx, arr) => {
              const isActiveStep =
                !step.done && (idx === 0 || arr[idx - 1].done);
              return (
                <div
                  key={idx}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 transition-all ${
                        step.done
                          ? "bg-[#00B87C] border-[#00B87C] text-white"
                          : isActiveStep
                            ? "border-[#14B8A6] text-[#14B8A6] bg-[#CCFBF1]"
                            : "border-border text-muted-foreground bg-card"
                      }`}
                    >
                      {step.done ? (
                        <Check size={12} />
                      ) : isActiveStep ? (
                        <Clock size={10} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider mt-1 ${
                        step.done
                          ? "text-[#00B87C]"
                          : isActiveStep
                            ? "text-[#14B8A6]"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1 mt-[-16px] ${
                        step.done ? "bg-[#00B87C]" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CLEARANCE STATUS ROW */}
      <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
        {exit.clearance.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[11px] font-semibold"
          >
            <span className="text-muted-foreground">{c.dept}</span>
            {c.status === "cleared" ? (
              <Check size={12} className="text-[#00B87C]" />
            ) : c.status === "pending" ? (
              <Clock size={12} className="text-amber-500" />
            ) : (
              <X size={12} className="text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <button
          onClick={onViewDetail}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#00B87C]/30 text-[#00B87C] text-[11px] font-black uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all"
        >
          View Full Exit <ChevronRight size={14} />
        </button>
        <button
          onClick={onSendReminder}
          className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-500 text-[11px] font-black uppercase tracking-wider hover:bg-amber-500/5 transition-all"
        >
          Send Reminder
        </button>
        {exit.clearance.every((c) => c.status === "cleared") && (
          <button
            onClick={onComplete}
            className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
          >
            Complete Exit
          </button>
        )}
      </div>
    </motion.div>
  );
};
