import { useState } from "react";
import { Building2, MoreVertical as MoreIcon, User, TrendingUp } from "lucide-react";
import { Department } from "../types/department.types";

interface DepartmentTableProps {
  departments: Department[];
  canManage: boolean;
  canDelete: boolean;
  showFinance: boolean;
  onViewClick: (d: Department) => void;
  onEditClick: (d: Department) => void;
  onDeleteClick: (d: Department) => void;
  onAssignHeadClick: (d: Department) => void;
}

export function DepartmentTable({
  departments,
  canManage,
  showFinance,
  onViewClick,
  onAssignHeadClick,
}: DepartmentTableProps) {

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-zinc-800/40 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Head
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                Employees
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                Teams
              </th>
              {showFinance && (
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                  Budget Used
                </th>
              )}
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                Growth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="hover:bg-neutral-50 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer"
                onClick={() => onViewClick(dept)}
              >
                {/* Dept details */}
                <td className="px-6 py-4">
                  <div
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary flex-shrink-0">
                      <Building2 size={16} color="var(--primary)" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-foreground">
                        {dept.name}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {dept.code}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Head */}
                <td className="px-6 py-4">
                  <div
                    className={`flex items-center gap-2 text-xs font-bold ${
                      canManage
                        ? "cursor-pointer hover:text-primary transition-colors text-foreground"
                        : "text-foreground"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canManage) {
                        onAssignHeadClick(dept);
                      }
                    }}
                  >
                    <User size={14} className="text-muted-foreground" />
                    {dept.head}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${
                      dept.status === "Active"
                        ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20"
                        : "bg-slate-100 text-slate-400 border-border"
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>

                {/* Employees */}
                <td
                  className="px-6 py-4 text-right cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-xs font-extrabold text-foreground">
                    {dept.employees}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600">
                    {dept.activeEmployees} Active
                  </div>
                </td>

                {/* Teams */}
                <td className="px-6 py-4 text-center">
                  <div className="text-xs font-extrabold text-foreground">
                    {dept.teams?.length || 0}
                  </div>
                </td>

                 {/* Finance columns */}
                 {showFinance && (
                   <td className="px-6 py-4 text-right text-xs font-extrabold text-foreground">
                     {dept.budgetUsedAmount}
                   </td>
                 )}

                {/* Growth */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-primary">
                    <TrendingUp size={12} />+{dept.growth}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
