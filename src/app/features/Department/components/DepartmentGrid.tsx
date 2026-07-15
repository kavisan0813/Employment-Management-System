import { useState } from "react";
import {
  Building2,
  Plus,
  TrendingUp,
  MoreVertical as MoreIcon,
  User,
  AlertTriangle,
} from "lucide-react";
import { Department } from "../types/department.types";

interface DepartmentGridProps {
  departments: Department[];
  canManage: boolean;
  canDelete: boolean;
  showFinance: boolean;
  onViewClick: (d: Department) => void;
  onEditClick: (d: Department) => void;
  onDeleteClick: (d: Department) => void;
  onAssignHeadClick: (d: Department) => void;
  onAddClick: () => void;
}

export function DepartmentGrid({
  departments,
  canManage,
  canDelete,
  showFinance,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onAssignHeadClick,
  onAddClick,
}: DepartmentGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Search menu backdrop helper */}
      {showMenu && (
        <div className="fixed inset-0 z-20" onClick={() => setShowMenu(null)} />
      )}

      {departments.map((dept) => (
        <div
          key={dept.id}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative flex flex-col justify-between group"
        >
          {/* Status / Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${
                dept.status === "Active"
                  ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20"
                  : "bg-slate-100 text-slate-400 border-border"
              }`}
            >
              {dept.status}
            </span>

            <div className="relative">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(showMenu === dept.id ? null : dept.id);
                }}
              >
                <MoreIcon size={16} />
              </button>

              {showMenu === dept.id && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
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
          </div>

          <div onClick={() => onViewClick(dept)} className="cursor-pointer">
            {/* Dept Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                <Building2 size={20} color="var(--primary)" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {dept.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {dept.code}
                </p>
              </div>
            </div>

            {/* Employee Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center bg-neutral-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-border">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                  Total
                </span>
                <span className="text-xs font-extrabold text-foreground">
                  {dept.employees}
                </span>
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                  Active
                </span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {dept.activeEmployees}
                </span>
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                  Leave
                </span>
                <span className="text-xs font-extrabold text-rose-500">
                  {dept.onLeaveEmployees}
                </span>
              </div>
            </div>

            {/* Finance Details if authorized */}
            {showFinance && (
              <div className="mb-4 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5">
                  <div className="flex items-center gap-1">
                    <span>Budget Used ({dept.budgetUsedPct}%)</span>
                    {dept.nearLimit && (
                      <span className="text-rose-500 flex items-center gap-0.5 bg-rose-500/10 px-1 rounded text-[8px] font-black uppercase tracking-wider">
                        <AlertTriangle size={9} /> Near limit
                      </span>
                    )}
                  </div>
                  <span className="font-black text-foreground">
                    {dept.budgetUsedAmount} / {dept.budgetAmount}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dept.budgetUsedPct}%`,
                      backgroundColor: getStatusColor(dept.budgetStatus),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <div
              className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                canManage
                  ? "text-slate-600 dark:text-slate-300 cursor-pointer hover:text-primary"
                  : "text-slate-500"
              }`}
              onClick={(e) => {
                if (canManage) {
                  e.stopPropagation();
                  onAssignHeadClick(dept);
                }
              }}
            >
              <User size={14} className="text-slate-400" />
              <span>{dept.head}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[11px] font-bold">
              <TrendingUp size={12} color="var(--primary)" />
              <span style={{ color: "var(--primary)" }}>+{dept.growth}%</span>
            </div>
          </div>
        </div>
      ))}

      {/* Create Card Option */}
      {canManage && (
        <div
          onClick={onAddClick}
          className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed border-border hover:border-[#00B87C] hover:bg-emerald-50/10"
          style={{ minHeight: "180px" }}
        >
          <div className="flex items-center justify-center rounded-full w-10 h-10 bg-secondary text-[#00B87C]">
            <Plus size={20} />
          </div>
          <p className="text-xs font-extrabold text-[#00B87C]">
            Create Department
          </p>
        </div>
      )}
    </div>
  );
}
