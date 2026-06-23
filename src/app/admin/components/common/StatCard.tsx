import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/app/admin/lib/utils";

const ACCENT_STYLES: Record<string, { chip: string; text: string }> = {
  primary: {
    chip: "bg-secondary text-primary dark:bg-primary/20 dark:text-primary-foreground",
    text: "text-primary"
  },
  success: {
    chip: "bg-success-light text-success dark:bg-success-light/10 dark:text-success",
    text: "text-success"
  },
  info: {
    chip: "bg-info-light text-info dark:bg-info-light/10 dark:text-info",
    text: "text-info"
  },
  warning: {
    chip: "bg-warning-light text-warning dark:bg-warning-light/10 dark:text-warning",
    text: "text-warning"
  },
  danger: {
    chip: "bg-danger-light text-danger dark:bg-danger-light/10 dark:text-danger",
    text: "text-danger"
  }
};

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  accent?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendUp,
  accent = "primary",
  className
}: StatCardProps) {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.primary;

  return (
    <div
      className={cn(
        "relative min-w-0 flex-1 rounded-xl border border-border/40 bg-card px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-card/40 dark:backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-normal text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors border border-transparent",
            styles.chip
          )}
        >
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </span>
      </div>
      <div className="mt-3 text-[28px] font-semibold tracking-tight text-foreground md:text-3xl leading-none">
        {value}
      </div>
    </div>
  );
}
