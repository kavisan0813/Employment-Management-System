import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Active:
    "bg-success-light text-success border-success/15 dark:bg-success-light/10 dark:text-success",
  Trial:
    "bg-info-light text-info border-info/15 dark:bg-info-light/10 dark:text-info",
  Inactive:
    "bg-neutral-light text-neutral border-neutral/15 dark:bg-neutral-light/10 dark:text-neutral",
  Pending:
    "bg-warning-light text-warning border-warning/15 dark:bg-warning-light/10 dark:text-warning",
  Suspended:
    "bg-danger-light text-danger border-danger/15 dark:bg-danger-light/10 dark:text-danger",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-all",
        STATUS_STYLES[status] ?? STATUS_STYLES.Inactive,
        className,
      )}
    >
      {status}
    </span>
  );
}
