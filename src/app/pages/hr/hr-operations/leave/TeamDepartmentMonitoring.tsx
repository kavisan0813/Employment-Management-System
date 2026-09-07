import React from "react";
import { Users, Building, AlertTriangle, ShieldCheck, Activity, Info } from "lucide-react";
import { LeaveRequest } from "./types";

interface TeamDepartmentMonitoringProps {
  requests: LeaveRequest[];
  selectedDepartment: string;
  selectedTeam: string;
}

interface TeamMetrics {
  team: string;
  department: string;
  totalEmployees: number;
  onLeaveCount: number;
  availableEmployees: number;
  leavePercent: number;
  status: "Healthy" | "Watch" | "Warning" | "Critical";
}

interface DepartmentMetrics {
  department: string;
  totalEmployees: number;
  onLeaveCount: number;
  availableEmployees: number;
  totalLeaveDays: number;
  leavePercent: number;
}

export function TeamDepartmentMonitoring({
  requests,
  selectedDepartment,
  selectedTeam,
}: TeamDepartmentMonitoringProps) {
  // Base workforce breakdown (derived from system dataset)
  const teamBaseData: TeamMetrics[] = [
    { team: "Platform Team", department: "Engineering", totalEmployees: 24, onLeaveCount: 2, availableEmployees: 22, leavePercent: 8.3, status: "Healthy" },
    { team: "Frontend Team", department: "Engineering", totalEmployees: 16, onLeaveCount: 1, availableEmployees: 15, leavePercent: 6.25, status: "Healthy" },
    { team: "UI/UX Team", department: "Design", totalEmployees: 12, onLeaveCount: 1, availableEmployees: 11, leavePercent: 8.3, status: "Healthy" },
    { team: "Sales Core", department: "Sales", totalEmployees: 20, onLeaveCount: 1, availableEmployees: 19, leavePercent: 5.0, status: "Healthy" },
    { team: "Support Ops", department: "Support", totalEmployees: 15, onLeaveCount: 3, availableEmployees: 12, leavePercent: 20.0, status: "Watch" },
    { team: "Growth Marketing", department: "Marketing", totalEmployees: 12, onLeaveCount: 5, availableEmployees: 7, leavePercent: 41.7, status: "Warning" },
  ];

  const deptBaseData: DepartmentMetrics[] = [
    { department: "Engineering", totalEmployees: 40, onLeaveCount: 3, availableEmployees: 37, totalLeaveDays: 4, leavePercent: 7.5 },
    { department: "Design", totalEmployees: 12, onLeaveCount: 1, availableEmployees: 11, totalLeaveDays: 2, leavePercent: 8.3 },
    { department: "Sales", totalEmployees: 20, onLeaveCount: 1, availableEmployees: 19, totalLeaveDays: 6, leavePercent: 5.0 },
    { department: "Support", totalEmployees: 15, onLeaveCount: 3, availableEmployees: 12, totalLeaveDays: 4, leavePercent: 20.0 },
    { department: "Marketing", totalEmployees: 12, onLeaveCount: 5, availableEmployees: 7, totalLeaveDays: 3, leavePercent: 41.7 },
  ];

  // Filter team and department data based on selected active filters
  const filteredTeams = teamBaseData.filter((t) => {
    const matchDept = selectedDepartment === "All" || t.department === selectedDepartment;
    const matchTeam = selectedTeam === "All" || t.team === selectedTeam;
    return matchDept && matchTeam;
  });

  const filteredDepts = deptBaseData.filter((d) => {
    return selectedDepartment === "All" || d.department === selectedDepartment;
  });

  return (
    <div className="space-y-6">
      {/* COVERAGE & ABSENCE WARNINGS BANNER */}
      <div className="bg-card border border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={18} />
          <h3 className="text-xs font-black uppercase tracking-widest">
            Workforce Coverage & Concentration Warnings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
              <span>High Leave Concentration</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px]">41.7% Leave</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Marketing department has 5 out of 12 employees scheduled on leave simultaneously.
            </p>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
              <span>Low Team Coverage Alert</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px]">Critical SLA</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Support Ops team has 20% on-leave capacity during peak ticket queue hours.
            </p>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
              <span>Upcoming Leave Cluster</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-[10px]">Apr 10 – 12</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Multiple senior engineering leads are scheduled for annual leave in the same week.
            </p>
          </div>
        </div>
      </div>

      {/* MONITORING TABLES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TEAM MONITORING */}
        <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                  Team Monitoring
                </h3>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Capacity health by functional team
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredTeams.length} teams tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-widest text-[10px]">
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center">On Leave</th>
                  <th className="py-2.5 px-3 text-center">Available</th>
                  <th className="py-2.5 px-3 text-center">Leave %</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTeams.map((t) => (
                  <tr key={t.team} className="hover:bg-muted/40 transition-colors font-semibold">
                    <td className="py-3 px-3">
                      <span className="font-bold text-foreground block">{t.team}</span>
                      <span className="text-[10px] text-muted-foreground">{t.department}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">{t.totalEmployees}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600 dark:text-rose-400">{t.onLeaveCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#00B87C]">{t.availableEmployees}</td>
                    <td className="py-3 px-3 text-center font-extrabold">{t.leavePercent}%</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.status === "Healthy"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : t.status === "Watch"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DEPARTMENT MONITORING */}
        <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-[#0EA5E9]">
                <Building size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                  Department Monitoring
                </h3>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Workforce breakdown across organization
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredDepts.length} departments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-widest text-[10px]">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center">On Leave</th>
                  <th className="py-2.5 px-3 text-center">Available</th>
                  <th className="py-2.5 px-3 text-center">Days</th>
                  <th className="py-2.5 px-3 text-right">Leave %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDepts.map((d) => (
                  <tr key={d.department} className="hover:bg-muted/40 transition-colors font-semibold">
                    <td className="py-3 px-3 font-bold text-foreground">{d.department}</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">{d.totalEmployees}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600 dark:text-rose-400">{d.onLeaveCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#00B87C]">{d.availableEmployees}</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">{d.totalLeaveDays}d</td>
                    <td className="py-3 px-3 text-right font-extrabold text-foreground">{d.leavePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
