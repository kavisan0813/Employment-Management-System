import React from "react";
import { RECENT_ACTIVITY } from "@/app/admin/constants/dashboard";

export function RecentActivityCard() {
  return (
    <div className="rounded-xl border border-border/40 bg-card px-6 py-5 shadow-sm dark:bg-card/40 dark:backdrop-blur-md">
      <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-foreground">
        Recent Activity
      </div>
      <div className="flex flex-col gap-3">
        {RECENT_ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
              style={{ backgroundColor: a.colorVar }}
            />
            <span className="flex-1 text-[13px] text-foreground truncate">{a.label}</span>
            <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecentActivityCard;
