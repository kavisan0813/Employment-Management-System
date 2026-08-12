import React, { useEffect, useState } from "react";
import {
  X,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  Network,
  AlignLeft,
  Clock,
  TrendingUp,
  Database,
  ShieldCheck,
  Rocket,
  UserPlus,
  ChevronRight,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 250);
  };

  const drawerClass = mounted
    ? "translate-x-0 opacity-100 scale-100"
    : "translate-x-[40px] opacity-0 scale-[0.98]";

  const bgClass = mounted ? "opacity-100" : "opacity-0";

  const getTeamsForDepartment = (deptName: string) => {
    const defaultTeams = [
      {
        name: `${deptName} Operations`,
        lead: "Alex Johnson",
        count: 45,
        icon: Network,
      },
      {
        name: `${deptName} Strategy`,
        lead: "Sam Smith",
        count: 20,
        icon: TrendingUp,
      },
      {
        name: `${deptName} Support`,
        lead: "Chris Lee",
        count: 85,
        icon: Users,
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
          },
          {
            name: "Backend Team",
            lead: "Rahul Verma",
            count: 180,
            icon: Database,
          },
          {
            name: "QA Team",
            lead: "Arjun Patel",
            count: 95,
            icon: ShieldCheck,
          },
          { name: "DevOps Team", lead: "Karthik Raj", count: 60, icon: Rocket },
        ];
      case "sales":
        return [
          { name: "Inbound Sales", lead: "John Doe", count: 50, icon: Network },
          {
            name: "Outbound Sales",
            lead: "Jane Smith",
            count: 70,
            icon: Rocket,
          },
        ];
      case "marketing":
        return [
          {
            name: "SEO & Content",
            lead: "Alice Wonderland",
            count: 25,
            icon: Users,
          },
          {
            name: "Performance Marketing",
            lead: "Bob Builder",
            count: 35,
            icon: TrendingUp,
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
        }))
      : getTeamsForDepartment(dept.name);

  const budgetUsedRaw = dept.budgetUsedAmount || "$350,000";

  return (
    <div
      className={`fixed inset-0 z-[2000] flex justify-end p-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-[8px] transition-opacity duration-250 ease-out ${bgClass}`}
      onClick={handleClose}
    >
      <div
        className={`w-full sm:w-[400px] md:w-[450px] max-w-[92vw] h-full bg-[#F8FAFC] dark:bg-[#021B17] rounded-none sm:rounded-l-[24px] shadow-2xl flex flex-col transition-all duration-250 ease-out overflow-hidden border-l border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] ${drawerClass}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-[16px] px-[20px] flex-shrink-0 bg-[#F8FAFC] dark:bg-[#021B17] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#082A24] text-[#00B87C] dark:text-[#00C48C] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] shadow-sm">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-[22px] font-[700] text-[#111827] dark:text-[#FFFFFF] leading-tight flex items-center gap-2">
                {dept.name}
                <span className="text-[11px] font-[600] text-[#6B7280] dark:text-[#9DB7AF] bg-[#FFFFFF] dark:bg-[#082A24] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {dept.code}
                </span>
              </h3>
              <p className="text-[14px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mt-1">
                Department Intelligence Summary
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#F3F4F6] dark:hover:bg-[#12392F] text-[#6B7280] dark:text-[#9DB7AF] hover:text-[#111827] dark:hover:text-[#FFFFFF] transition-colors border border-transparent dark:hover:border-[rgba(255,255,255,0.06)]"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-[24px] space-y-[20px] bg-[#F8FAFC] dark:bg-[#021B17] custom-scrollbar">
          {/* SECTION 1: KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="h-[110px] p-[18px] rounded-[18px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#FFFFFF] dark:bg-[#082A24] hover:-translate-y-[2px] hover:shadow-md transition-all flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2">
                <Users
                  size={16}
                  className="text-[#00B87C] dark:text-[#00C48C]"
                />
                <span className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF]">
                  STAFF
                </span>
              </div>
              <div className="text-[24px] font-[700] text-[#111827] dark:text-[#FFFFFF] leading-none">
                {dept.employees}
              </div>
            </div>

            <div className="h-[110px] p-[18px] rounded-[18px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#00B87C]/5 dark:bg-[#082A24] hover:-translate-y-[2px] hover:shadow-md transition-all flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-[#00B87C] dark:text-[#00C48C]"
                />
                <span className="text-[13px] font-[500] text-[#00B87C] dark:text-[#9DB7AF]">
                  ACTIVE
                </span>
              </div>
              <div className="text-[24px] font-[700] text-[#00B87C] dark:text-[#00C48C] leading-none">
                {dept.activeEmployees}
              </div>
            </div>

            <div className="h-[110px] p-[18px] rounded-[18px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#EF4444]/5 dark:bg-[#082A24] hover:-translate-y-[2px] hover:shadow-md transition-all flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#EF4444]" />
                <span className="text-[13px] font-[500] text-[#EF4444] dark:text-[#9DB7AF]">
                  ON LEAVE
                </span>
              </div>
              <div className="text-[24px] font-[700] text-[#EF4444] leading-none">
                {dept.onLeaveEmployees}
              </div>
            </div>
          </div>

          {/* SECTION 2: Department Information */}
          <div className="p-[18px] rounded-[18px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#FFFFFF] dark:bg-[#0B2E27] hover:-translate-y-[2px] hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h4 className="text-[15px] font-[700] uppercase text-[#111827] dark:text-[#FFFFFF] mb-5 tracking-wider">
              Department Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mb-1">
                  Department Head
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 dark:bg-[#00C48C]/20 flex items-center justify-center text-[#00B87C] dark:text-[#00C48C] text-[14px] font-[700]">
                    {dept.head?.charAt(0) || "U"}
                  </div>
                  <p className="text-[18px] font-[600] text-[#111827] dark:text-[#FFFFFF]">
                    {dept.head}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mb-1">
                  Parent Department
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Network size={16} />
                  </div>
                  <p className="text-[18px] font-[600] text-[#111827] dark:text-[#FFFFFF]">
                    {dept.parentDepartment || "None"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mb-1">
                  Created Date
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Calendar size={16} />
                  </div>
                  <p className="text-[18px] font-[600] text-[#111827] dark:text-[#FFFFFF]">
                    {dept.createdDate || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mb-1">
                  Last Updated
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Clock size={16} />
                  </div>
                  <p className="text-[18px] font-[600] text-[#111827] dark:text-[#FFFFFF]">
                    {dept.lastUpdated || "N/A"}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2 mt-2">
                <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] mb-2">
                  Description
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5">
                    <AlignLeft size={16} />
                  </div>
                  <p className="text-[14px] text-[#111827] dark:text-[#FFFFFF] leading-relaxed">
                    {dept.description ||
                      "Core technology development and infrastructure scaling."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Budget Summary */}
          {showFinance && (
            <div className="p-[18px] rounded-[18px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#FFFFFF] dark:bg-[#0B2E27] hover:-translate-y-[2px] hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h4 className="text-[15px] font-[700] uppercase text-[#111827] dark:text-[#FFFFFF]">
                Budget Used
              </h4>

              <div className="mb-5">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[28px] font-[700] text-[#111827] dark:text-[#FFFFFF] leading-none">
                      {budgetUsedRaw}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Team Distribution */}
          <div className="p-[12px] rounded-[12px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#FFFFFF] dark:bg-[#0B2E27] hover:-translate-y-[2px] hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-[700] uppercase text-[#111827] dark:text-[#FFFFFF] flex items-center gap-2 tracking-wider">
                Team Distribution
                <span className="bg-[#F3F4F6] dark:bg-[#021B17] text-[#6B7280] dark:text-[#9DB7AF] px-1.5 py-0.5 rounded-full text-[10px] font-[600] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)]">
                  {teams.length}
                </span>
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {teams.map((team) => (
                <div
                  key={team.name}
                  onClick={() => {
                    handleClose();
                    navigate(
                      `/employees?department=${encodeURIComponent(dept.name)}&team=${encodeURIComponent(team.name)}`,
                    );
                  }}
                  className="flex items-center justify-between p-2.5 rounded-[10px] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#F8FAFC] dark:bg-[#021B17] hover:border-[#00B87C]/30 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#082A24] text-[#00B87C] dark:text-[#00C48C] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] group-hover:scale-105 transition-transform shadow-sm">
                      <team.icon size={14} />
                    </div>
                    <div>
                      <p className="text-[13px] font-[600] text-[#111827] dark:text-[#FFFFFF] transition-colors">
                        {team.name}
                      </p>
                      <p className="text-[14px] text-[#6B7280] dark:text-[#9DB7AF] font-[500] mt-0.5">
                        Lead:{" "}
                        <span className="text-[#111827] dark:text-[#FFFFFF] font-[600]">
                          {team.lead}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {team.count > 0 && (
                      <div className="text-right">
                        <p className="text-[18px] font-[600] text-[#111827] dark:text-[#FFFFFF]">
                          {team.count}
                        </p>
                        <p className="text-[13px] font-[500] text-[#6B7280] dark:text-[#9DB7AF] uppercase tracking-wider">
                          Staff
                        </p>
                      </div>
                    )}
                    <ChevronRight
                      size={20}
                      className="text-[#6B7280] dark:text-[#9DB7AF] group-hover:text-[#00B87C] dark:group-hover:text-[#00C48C] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom spacing to ensure scroll doesn't get cut off by footer completely */}
          <div className="h-2"></div>
        </div>

        {/* FOOTER */}
        <div className="p-[16px] px-[20px] border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.06)] bg-[#FFFFFF] dark:bg-[#082A24] flex justify-end gap-2 flex-shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          {canDelete && (
            <button
              onClick={() => {
                handleClose();
                onDelete(dept);
              }}
              className="px-4 py-2 rounded-[10px] text-[13px] font-[600] text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-transparent hover:border-[#EF4444]/30 transition-all"
            >
              Delete
            </button>
          )}
          {canEdit && (
            <>
              <button
                onClick={() => {
                  handleClose();
                  onToggleStatus(dept);
                }}
                className={`px-5 py-2.5 rounded-[12px] text-[14px] font-[600] transition-all border ${
                  dept.status === "Active"
                    ? "text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20 hover:bg-[#F5A623]/20"
                    : "text-[#00B87C] dark:text-[#00C48C] bg-[#00B87C]/10 dark:bg-[#00C48C]/10 border-[#00B87C]/20 dark:border-[#00C48C]/20 hover:bg-[#00B87C]/20 dark:hover:bg-[#00C48C]/20"
                }`}
              >
                {dept.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => {
                  handleClose();
                  onEdit(dept);
                }}
                className="px-5 py-2 rounded-[10px] text-[13px] font-[600] text-[#FFFFFF] dark:text-[#021B17] bg-[#00B87C] dark:bg-[#00C48C] hover:bg-[#00a36d] dark:hover:bg-[#00b37f] shadow-[0_4px_14px_rgba(0,184,124,0.3)] dark:shadow-[0_4px_14px_rgba(0,196,140,0.3)] transition-all"
              >
                Edit Department
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
