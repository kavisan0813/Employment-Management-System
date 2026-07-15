import { Building2, Users, IndianRupee, PieChart, AlertTriangle } from "lucide-react";
import { Department } from "../types/department.types";

interface DepartmentStatsProps {
  departments: Department[];
  showFinance: boolean;
}

export function DepartmentStats({ departments, showFinance }: DepartmentStatsProps) {
  const totalDepts = departments.length;
  const totalEmployees = departments.reduce((acc, d) => acc + d.employees, 0);
  const activeEmployees = departments.reduce((acc, d) => acc + d.activeEmployees, 0);
  const onLeaveEmployees = departments.reduce((acc, d) => acc + d.onLeaveEmployees, 0);

  // Compute finance stats
  const overBudgetCount = departments.filter((d) => d.budgetUsedPct > 90 || d.budgetStatus === "red").length;
  const avgUtilization = totalDepts > 0 ? Math.round(departments.reduce((acc, d) => acc + d.budgetUsedPct, 0) / totalDepts) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {/* Total Departments */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-slate-500/10">
            <Building2 size={20} className="text-slate-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
            DEPARTMENTS
          </p>
          <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
            {totalDepts}
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2 font-medium">
          All active units
        </p>
      </div>

      {/* Headcount */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-emerald-500/10">
            <Users size={20} className="text-emerald-600" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
            TOTAL STAFF
          </p>
          <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
            {totalEmployees.toLocaleString()}
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2 font-medium">
          {activeEmployees} active • {onLeaveEmployees} leave
        </p>
      </div>

      {/* Finance Specific Stats */}
      {showFinance ? (
        <>
          {/* Annual Budget */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-violet-500/10">
                <IndianRupee size={20} className="text-violet-600" />
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
                ANNUAL BUDGET
              </p>
              <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
                ₹4.35Cr
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2 font-medium">
              FY 2026-27 Approved
            </p>
          </div>

          {/* Average Utilization */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-amber-500/10">
                <PieChart size={20} className="text-amber-500" />
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
                AVG UTILIZATION
              </p>
              <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
                {avgUtilization}%
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2 font-medium">
              Healthy range overall
            </p>
          </div>

          {/* Over Budget count */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-rose-500/10">
                <AlertTriangle size={20} className="text-rose-600" />
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
                OVER BUDGET
              </p>
              <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
                {overBudgetCount}
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2 font-medium">
              Critical attention needed
            </p>
          </div>

          {/* Monthly Payroll */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center bg-violet-500/10">
                <IndianRupee size={20} className="text-violet-600" />
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
                MONTHLY COST
              </p>
              <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
                ₹28.4L
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2 font-medium">
              March 2026 Payroll
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Active Employee Rate */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col justify-center">
            <p className="text-[12px] font-extrabold text-foreground uppercase tracking-widest mb-2">
              Operational Efficiency
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Overall operations are running at <strong className="text-emerald-600">{Math.round((activeEmployees / totalEmployees) * 100)}%</strong> active capacity. HR is tracking leaves and vacancy adjustments for the Q3 pipeline.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
