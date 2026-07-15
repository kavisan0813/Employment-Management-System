import { motion } from "motion/react";

interface ProgressProps {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export function Progress({ completedCount, totalCount, progressPercent }: ProgressProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00B87C]/[0.05] to-transparent pointer-events-none" />
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Your Progress</h3>
        <p className="text-[28px] font-black text-foreground tracking-tight">
          {completedCount} <span className="text-muted-foreground font-semibold text-lg">/ {totalCount} Tasks Completed</span>
        </p>
        <p className="text-[13px] text-muted-foreground font-medium">
          You are doing great! Keep completing tasks to finish your onboarding.
        </p>
      </div>

      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke="#00B87C"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - progressPercent / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-black text-foreground">{progressPercent}%</span>
      </div>
    </div>
  );
}
