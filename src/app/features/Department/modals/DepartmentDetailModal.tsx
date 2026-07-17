import {
  X,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  User,
  Network,
  AlignLeft,
  Clock,
  TrendingUp,
  Database,
  ShieldCheck,
  Rocket,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Department } from "../types/department.types";

interface DepartmentDetailModalProps {
  dept: Department;
  onClose: () => void;
  showFinance: boolean;
  onEdit: (d: Department) => void;
  onDelete: (d: Department) => void;
  onToggleStatus: (d: Department) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function DepartmentDetailModal({
  dept,
  onClose,
  showFinance,
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit,
  canDelete,
}: DepartmentDetailModalProps) {
  const navigate = useNavigate();

  const getTeamsForDepartment = (deptName: string) => {
    const defaultTeams = [
      {
        name: `${deptName} Operations`,
        lead: "Alex Johnson",
        count: 45,
        icon: Network,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        name: `${deptName} Strategy`,
        lead: "Sam Smith",
        count: 20,
        icon: TrendingUp,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
      {
        name: `${deptName} Support`,
        lead: "Chris Lee",
        count: 85,
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-50",
      },
    ];

    switch (deptName.toLowerCase()) {
      case "engineering":
        return [
          {
            name: "Frontend Team",
            lead: "Priya Sharma",
            count: 120,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            name: "Backend Team",
            lead: "Rahul Verma",
            count: 180,
            icon: Database,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            name: "QA Team",
            lead: "Arjun Patel",
            count: 95,
            icon: ShieldCheck,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            name: "DevOps Team",
            lead: "Karthik Raj",
            count: 60,
            icon: Rocket,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
        ];
      case "sales":
        return [
          {
            name: "Inbound Sales",
            lead: "John Doe",
            count: 50,
            icon: Network,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            name: "Outbound Sales",
            lead: "Jane Smith",
            count: 70,
            icon: Rocket,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
        ];
      case "marketing":
        return [
          {
            name: "SEO & Content",
            lead: "Alice Wonderland",
            count: 25,
            icon: Users,
            color: "text-cyan-500",
            bg: "bg-cyan-50",
          },
          {
            name: "Performance Marketing",
            lead: "Bob Builder",
            count: 35,
            icon: TrendingUp,
            color: "text-rose-500",
            bg: "bg-rose-50",
          },
        ];
      case "hr":
      case "human resources":
        return [
          {
            name: "Talent Acquisition",
            lead: "Sarah Connor",
            count: 15,
            icon: UserPlus,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
        ];
      default:
        return defaultTeams;
    }
  };

  const teams =
    dept.teams && dept.teams.length > 0
      ? dept.teams.map((t: { name: string; lead: string }) => ({
          name: t.name || "Unknown",
          lead: t.lead || "TBD",
          count: 0,
          icon: Users,
          color: "text-[#00B87C]",
          bg: "bg-[#00B87C]/10",
        }))
      : getTeamsForDepartment(dept.name);

  return (
    <div
      className="fixed inset-0 z-[2000] flex justify-end p-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[750px] h-full max-h-screen bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#10B981]/10 text-[#10B981]">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="text-[32px] font-bold text-gray-900 dark:text-zinc-100 leading-tight flex items-center gap-3">
                {dept.name}
                <span className="text-[14px] font-bold text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  {dept.code}
                </span>
              </h3>
              <p className="text-[16px] font-medium text-gray-500 dark:text-zinc-400 mt-1">
                Department Intelligence Summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-zinc-900 space-y-6">
          {/* SECTION 1: KPI Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 rounded-[16px] border border-gray-100 dark:border-zinc-800 bg-[#10B981]/5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <Users size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-widest">
                    Staff
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-gray-900 dark:text-zinc-100 mt-2">
                  {dept.employees}
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[16px] border border-gray-100 dark:border-zinc-800 bg-[#10B981]/5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-[#10B981] mt-2">
                  {dept.activeEmployees}
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[16px] border border-gray-100 dark:border-zinc-800 bg-[#EF4444]/5 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
                    <Calendar size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-widest">
                    On Leave
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-[#EF4444] mt-2">
                  {dept.onLeaveEmployees}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-zinc-800" />

          {/* SECTION 2: Department Information */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Department Head
                  </p>
                  <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                    {dept.head}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Network size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Parent Department
                  </p>
                  <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                    {dept.parentDepartment || "None"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <AlignLeft size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Description
                  </p>
                  <p className="text-[14px] font-medium text-gray-700 dark:text-zinc-300 leading-relaxed">
                    {dept.description ||
                      "Core organizational workspace boundary."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-zinc-800 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Created Date
                  </p>
                  <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                    {dept.createdDate || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-orange-500 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Last Updated
                  </p>
                  <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                    {dept.lastUpdated || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Finance Breakdown (if authorized) */}
          {showFinance && (
            <>
              <hr className="border-gray-100 dark:border-zinc-800" />
              <div>
                <h4 className="text-[18px] font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  Budget Used
                </h4>
                <div className="bg-slate-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-5 flex flex-col justify-center items-center text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Amount Utilized
                  </p>
                  <p className="text-[24px] font-black text-slate-900 dark:text-zinc-100">
                    {dept.budgetUsedAmount}
                  </p>
                </div>
              </div>
            </>
          )}

          <hr className="border-gray-100 dark:border-zinc-800" />

          {/* SECTION 4: Teams list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[18px] font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                Teams
                <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-0.5 rounded-full text-xs">
                  ({teams.length})
                </span>
              </h4>
            </div>

            <div className="space-y-3 pb-8">
              {teams.map((team, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    navigate(
                      `/employees?department=${encodeURIComponent(dept.name)}&team=${encodeURIComponent(team.name)}`,
                    );
                  }}
                  className="flex items-center justify-between p-4 rounded-[16px] border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#10B981]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#10B981]/10 text-[#10B981]">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100 group-hover:text-[#10B981] transition-colors">
                        {team.name}
                      </p>
                      <p className="text-[14px] text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                        Lead:{" "}
                        <span className="text-gray-700 dark:text-zinc-300 font-bold">
                          {team.lead}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {team.count > 0 && (
                      <div className="text-right">
                        <p className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                          {team.count}
                        </p>
                        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">
                          Employees
                        </p>
                      </div>
                    )}
                    <span className="text-xs font-bold text-emerald-600 hover:underline">
                      View Roster →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end flex-shrink-0 gap-3">
          {canEdit && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onToggleStatus(dept);
                }}
                className={`px-4 py-2.5 rounded-[12px] text-[14px] font-bold transition-colors shadow-sm ${
                  dept.status === "Active"
                    ? "text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                }`}
              >
                {dept.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(dept);
                }}
                className="px-4 py-2.5 rounded-[12px] text-[14px] font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] transition-colors shadow-sm"
              >
                Edit Department
              </button>
            </>
          )}

          {canDelete && (
            <button
              onClick={() => {
                onClose();
                onDelete(dept);
              }}
              className="px-4 py-2.5 rounded-[12px] text-[14px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
