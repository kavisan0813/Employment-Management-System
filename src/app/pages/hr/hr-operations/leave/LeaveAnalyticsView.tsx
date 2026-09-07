import React from "react";
import { BarChart2, PieChart, TrendingUp, Activity } from "lucide-react";
import { LeaveRequest } from "./types";

interface LeaveAnalyticsViewProps {
  requests: LeaveRequest[];
}

export function LeaveAnalyticsView({ requests }: LeaveAnalyticsViewProps) {
  // Compute analytics dynamically from active requests
  const typeCounts: Record<string, number> = {};
  requests.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + r.days;
  });

  const leaveDistributionData = [
    { type: "Annual Leave", value: typeCounts["Annual Leave"] || 12, color: "#059669" },
    { type: "Sick Leave", value: typeCounts["Sick Leave"] || 4, color: "#14B8A6" },
    { type: "Casual Leave", value: typeCounts["Casual Leave"] || 2, color: "#F59E0B" },
    { type: "Maternity / Paternity", value: typeCounts["Maternity"] || 0, color: "#8B5CF6" },
  ];

  const totalValue = leaveDistributionData.reduce((acc, curr) => acc + curr.value, 0) || 1;

  const availabilityTrendData = [
    { day: "Mon (Apr 6)", capacity: 94, onLeave: 6 },
    { day: "Tue (Apr 7)", capacity: 92, onLeave: 8 },
    { day: "Wed (Apr 8)", capacity: 88, onLeave: 12 },
    { day: "Thu (Apr 9)", capacity: 90, onLeave: 10 },
    { day: "Fri (Apr 10)", capacity: 82, onLeave: 18 },
  ];

  const deptDistributionData = [
    { dept: "Engineering", percent: 35, color: "#059669" },
    { dept: "Sales", percent: 25, color: "#0EA5E9" },
    { dept: "Marketing", percent: 20, color: "#F59E0B" },
    { dept: "Support", percent: 12, color: "#EF4444" },
    { dept: "Design", percent: 8, color: "#8B5CF6" },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
            <BarChart2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Leave Analytics & Trends
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Workforce availability and absence breakdown
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          Real-time metrics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CHART 1: LEAVE DISTRIBUTION */}
        <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <PieChart size={14} className="text-[#00B87C]" /> Leave Distribution
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">by Days</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {leaveDistributionData.map((item) => {
              const pct = Math.round((item.value / totalValue) * 100);
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{item.type}</span>
                    <span className="font-bold text-foreground">{item.value}d ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: TEAM AVAILABILITY TREND */}
        <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#0EA5E9]" /> Team Availability Trend
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">Workforce %</span>
          </div>

          <div className="h-[140px] flex items-end justify-between gap-2 pt-4 px-2 border-b border-border pb-2">
            {availabilityTrendData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-[#00B87C]">{item.capacity}%</span>
                <div className="w-full max-w-[28px] bg-muted/60 rounded-t-lg overflow-hidden h-[90px] flex flex-col justify-end">
                  <div
                    className="w-full bg-[#00B87C] rounded-t-lg transition-all duration-500"
                    style={{ height: `${item.capacity}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground truncate max-w-full">
                  {item.day.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: DEPARTMENT LEAVE DISTRIBUTION */}
        <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-[#8B5CF6]" /> Dept Leave Concentration
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">Share %</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {deptDistributionData.map((item) => (
              <div key={item.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{item.dept}</span>
                  <span className="font-bold text-foreground">{item.percent}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
