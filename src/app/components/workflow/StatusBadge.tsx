import React from "react";
import { CheckCircle2, Clock, AlertCircle, Ban, RotateCcw } from "lucide-react";

export type StatusType =
  | "Draft"
  | "Pending Manager Approval"
  | "Approved"
  | "Paid"
  | "Processing"
  | "Rejected"
  | "Returned"
  | "Open"
  | "In Progress"
  | "Resolved";

interface StatusBadgeProps {
  status: StatusType | string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  Draft: { label: "Draft", icon: Clock, color: "#64748B", bg: "#F1F5F9" },
  "Pending Manager Approval": {
    label: "Pending",
    icon: Clock,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "#D1FAE5",
  },
  Paid: { label: "Paid", icon: CheckCircle2, color: "#10B981", bg: "#D1FAE5" },
  Processing: {
    label: "Processing",
    icon: RotateCcw,
    color: "#3B82F6",
    bg: "#DBEAFE",
  },
  Rejected: { label: "Rejected", icon: Ban, color: "#EF4444", bg: "#FEE2E2" },
  Returned: {
    label: "Returned",
    icon: RotateCcw,
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  Open: { label: "Open", icon: AlertCircle, color: "#3B82F6", bg: "#DBEAFE" },
  "In Progress": {
    label: "In Progress",
    icon: Clock,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  Resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "#D1FAE5",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    icon: AlertCircle,
    color: "#64748B",
    bg: "#F1F5F9",
  };
  const Icon = config.icon;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <Icon size={12} strokeWidth={3} />
      <span>{config.label}</span>
    </div>
  );
}
