/* ─── Status Badge Components ─── */

import { CheckCircle2, Clock, Circle } from "lucide-react";
import { safeGet } from "../../utils/helpers";

/* Status dot colored by status */
export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    "on-track": "#00B87C",
    delayed: "#F59E0B",
    "at-risk": "#EF4444",
    "pre-joining": "#94A3B8",
    complete: "#00B87C",
  };
  return (
    <span
      className="w-2 h-2 rounded-full inline-block shrink-0"
      style={{ backgroundColor: safeGet<string>(map, status) || "#94A3B8" }}
    />
  );
}

/* XCircle icon (custom SVG) */
export function XCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

/* Task status icon */
export function TaskStatusIcon({ status }: { status: string }) {
  if (status === "done")
    return <CheckCircle2 size={16} className="text-[#00B87C] shrink-0" />;
  if (status === "in-progress")
    return <Clock size={16} className="text-[#F59E0B] shrink-0" />;
  if (status === "overdue")
    return <XCircle size={16} className="text-[#EF4444] shrink-0" />;
  return <Circle size={16} className="text-[#D1D5DB] shrink-0" />;
}
