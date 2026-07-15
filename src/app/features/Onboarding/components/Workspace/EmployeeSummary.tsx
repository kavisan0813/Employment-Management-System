import { Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import type { NewHire } from "../../types/onboarding.types";
import { formatDate } from "../../utils/helpers";

interface EmployeeSummaryProps {
  selected: NewHire;
}

export function EmployeeSummary({ selected }: EmployeeSummaryProps) {
  return (
    <>
      {/* Employee Header */}
      <div className="px-6 py-5 border-b border-border flex flex-wrap items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black shrink-0"
          style={{ backgroundColor: selected.avatarColor }}
        >
          {selected.initials}
        </div>
        <div className="flex-1">
          <h2 className="text-[20px] font-black text-foreground">{selected.name}</h2>
          <p className="text-[14px] font-bold text-[#00B87C]">
            {selected.role} — {selected.dept}
          </p>
          <div className="flex items-center gap-4 mt-1 text-[12px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Joining: {formatDate(selected.joiningDate)}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} /> Manager: {selected.manager}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-full bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={12} /> Day {selected.daysInOnboarding} of Onboarding
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-4">
        <div className="flex-1 h-[6px] bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${selected.progress}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{ backgroundColor: selected.progressColor }}
          />
        </div>
        <span className="text-[13px] font-black" style={{ color: selected.progressColor }}>
          {selected.progress}% Complete
        </span>
        <span className="text-[11px] font-bold text-muted-foreground">
          Expected completion: {selected.expectedCompletion}
        </span>
      </div>
    </>
  );
}
