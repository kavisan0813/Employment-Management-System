import { Calendar, Umbrella, PartyPopper, Briefcase } from "lucide-react";
import type { KPIMetrics } from "./attendance.types";

interface AttendanceKPICardsProps {
  metrics: KPIMetrics;
  selectedMonth: string;
  selectedYear: number;
}

const CARDS = [
  {
    key: "weekdays" as const,
    label: "Weekdays",
    icon: Calendar,
    color: "var(--primary)",
    bgLight: "rgba(0, 184, 124, 0.06)",
    bgDark: "rgba(0, 184, 124, 0.08)",
    desc: "Mon – Fri this month",
  },
  {
    key: "weekendHolidays" as const,
    label: "Weekend Holidays",
    icon: Umbrella,
    color: "#6366F1",
    bgLight: "rgba(99, 102, 241, 0.06)",
    bgDark: "rgba(99, 102, 241, 0.08)",
    desc: "Saturday & Sunday off",
  },
  {
    key: "festivalHolidays" as const,
    label: "Festival Holidays",
    icon: PartyPopper,
    color: "#F59E0B",
    bgLight: "rgba(245, 158, 11, 0.06)",
    bgDark: "rgba(245, 158, 11, 0.08)",
    desc: "Gazetted holidays",
  },
  {
    key: "workingDays" as const,
    label: "Working Days",
    icon: Briefcase,
    color: "#10B981",
    bgLight: "rgba(16, 185, 129, 0.06)",
    bgDark: "rgba(16, 185, 129, 0.08)",
    desc: "Weekdays – holidays",
  },
];

export function AttendanceKPICards({
  metrics,
  selectedMonth,
  selectedYear,
}: AttendanceKPICardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];

        return (
          <div
            key={card.key}
            className="rounded-2xl border bg-card shadow-sm p-4 transition-all hover:shadow-md group"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: card.bgLight }}
                  >
                    <Icon size={16} style={{ color: card.color }} />
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                </div>
                <p className="text-3xl font-black" style={{ color: card.color }}>
                  {value}
                </p>
              </div>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground mt-2">
              {card.desc} • {selectedMonth} {selectedYear}
            </p>
          </div>
        );
      })}
    </div>
  );
}
