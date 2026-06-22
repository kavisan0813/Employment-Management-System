import React from "react";
import { cn } from "@/app/admin/lib/utils";
import { PRIORITY_STYLES } from "@/app/admin/features/supportTickets/supportTickets.mock";

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
        (PRIORITY_STYLES as Record<string, string>)[priority],
      )}
    >
      {priority}
    </span>
  );
}
