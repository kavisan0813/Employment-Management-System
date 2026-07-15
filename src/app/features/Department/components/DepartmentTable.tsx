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
  canDelete,
  showFinance,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onAssignHeadClick,
}: DepartmentTableProps) {
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const getStatusColor = (status: Department["budgetStatus"]) => {
    switch (status) {
      case "green":
        return "#00B87C";
      case "amber":
        return "#F59E0B";
      case "red":
        return "#EF4444";
      default:
        return "#00B87C";
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">
      {showMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(null)}
        />
      )}

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
                <>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                    Total Budget
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                    Budget Used
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Used %
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                Growth
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="hover:bg-neutral-50 dark:hover:bg-zinc-800/20 transition-colors"
              >
                {/* Dept details */}
                <td className="px-6 py-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onViewClick(dept)}
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
                    onClick={() => {
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
                <td className="px-6 py-4 text-right">
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
                  <>
                    <td className="px-6 py-4 text-right text-xs font-extrabold text-[#8B5CF6]">
                      {dept.budgetAmount}
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-extrabold text-foreground">
                      {dept.budgetUsedAmount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-foreground min-w-[32px]">
                          {dept.budgetUsedPct}%
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${dept.budgetUsedPct}%`,
                              backgroundColor: getStatusColor(dept.budgetStatus),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </>
                )}

                {/* Growth */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-primary">
                    <TrendingUp size={12} />+{dept.growth}%
                  </div>
                </td>

                {/* Actions dropdown */}
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block text-left">
                    <button
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(showMenu === dept.id ? null : dept.id);
                      }}
                    >
                      <MoreIcon size={16} />
                    </button>
                    {showMenu === dept.id && (
                      <div className="absolute right-full top-0 mr-2 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-right-2">
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(null);
                            onViewClick(dept);
                          }}
                        >
                          View Department
                        </button>
                        {canManage && (
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenu(null);
                              onEditClick(dept);
                            }}
                          >
                            Edit Department
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenu(null);
                              onDeleteClick(dept);
                            }}
                          >
                            Delete Department
                          </button>
                        )}
                      </div>
                    )}
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
