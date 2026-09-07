import React from "react";
import { CalendarDays, CalendarCheck, Palmtree, Briefcase } from "lucide-react";

interface AttendanceKPICardsProps {
  selectedMonth: number; // 0-indexed (0 = Jan, 3 = Apr)
  selectedYear: number;
  festivalHolidaysCount?: number;
}

export function AttendanceKPICards({
  selectedMonth,
  selectedYear,
  festivalHolidaysCount = 2,
}: AttendanceKPICardsProps) {
  // Calculate exact days in month, weekend count, weekday count
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  let weekendDays = 0;
  let weekdays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      weekdays++;
    }
  }

  const workingDays = Math.max(0, weekdays - festivalHolidaysCount);

  const cards = [
    {
      id: "weekdays",
      label: "WEEKDAYS",
      value: weekdays,
      desc: "Selected month",
      icon: CalendarDays,
      accentColor: "var(--primary)",
      badgeBg: "rgba(0, 184, 124, 0.1)",
      badgeText: "text-[#00B87C]",
    },
    {
      id: "weekend_holidays",
      label: "WEEKEND HOLIDAYS",
      value: weekendDays,
      desc: "Saturday + Sunday",
      icon: CalendarCheck,
      accentColor: "#64748B",
      badgeBg: "rgba(100, 116, 139, 0.1)",
      badgeText: "text-slate-600 dark:text-slate-400",
    },
    {
      id: "festival_holidays",
      label: "FESTIVAL HOLIDAYS",
      value: festivalHolidaysCount,
      desc: "Configured holidays",
      icon: Palmtree,
      accentColor: "#F59E0B",
      badgeBg: "rgba(245, 158, 11, 0.1)",
      badgeText: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "working_days",
      label: "WORKING DAYS",
      value: workingDays,
      desc: "Expected working days",
      icon: Briefcase,
      accentColor: "#10B981",
      badgeBg: "rgba(16, 185, 129, 0.15)",
      badgeText: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="group relative p-4 rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
                {card.label}
              </span>
              <div
                className={`p-2 rounded-xl flex items-center justify-center ${card.badgeText}`}
                style={{ backgroundColor: card.badgeBg }}
              >
                <IconComponent size={16} />
              </div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span
                className="text-3xl sm:text-4xl font-black leading-none tracking-tight"
                style={{ color: card.id === "working_days" ? "#10B981" : "var(--foreground)" }}
              >
                {card.value}
              </span>
              <span className="text-xs font-bold text-muted-foreground truncate">
                days
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-semibold text-muted-foreground" style={{ borderColor: "var(--border)" }}>
              <span className="truncate">{card.desc}</span>
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-[#00B87C]">
                Active Filter
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
