import React from "react";
import { FileText, Clock, CheckCircle2, XCircle, Users, AlertTriangle } from "lucide-react";
import { LeaveRequest } from "./types";

interface LeaveKPICardsProps {
  requests: LeaveRequest[];
}

export function LeaveKPICards({ requests }: LeaveKPICardsProps) {
  const totalRequests = requests.length;
  const pendingApprovals = requests.filter((r) => r.status === "Pending").length;
  const approvedLeaves = requests.filter((r) => r.status === "Approved").length;
  const rejectedLeaves = requests.filter((r) => r.status === "Rejected").length;
  const totalLeaveDays = requests.reduce((acc, curr) => acc + (curr.status !== "Rejected" ? curr.days : 0), 0);
  const criticalWarnings = requests.filter((r) => r.criticalRole || (r.policyViolations && r.policyViolations.length > 0)).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Requests */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#00B87C]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Total Requests
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
            <FileText size={16} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-black tracking-tight text-foreground leading-none">
            {totalRequests}
          </span>
          <span className="text-[12px] font-bold text-muted-foreground">
            {totalLeaveDays} total days
          </span>
        </div>
      </div>

      {/* 2. Pending Approvals */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#F59E0B]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Pending Approvals
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#F59E0B]">
            <Clock size={16} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-black tracking-tight text-[#F59E0B] leading-none">
            {pendingApprovals}
          </span>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            Action required
          </span>
        </div>
      </div>

      {/* 3. Approved Leaves */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#00B87C]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Approved Leaves
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-black tracking-tight text-[#00B87C] leading-none">
            {approvedLeaves}
          </span>
          <span className="text-[12px] font-bold text-muted-foreground">
            Scheduled
          </span>
        </div>
      </div>

      {/* 4. Rejected Leaves */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#EF4444]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Rejected Leaves
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-[#EF4444]">
            <XCircle size={16} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-black tracking-tight text-[#EF4444] leading-none">
            {rejectedLeaves}
          </span>
          <span className="text-[12px] font-bold text-muted-foreground">
            Declined
          </span>
        </div>
      </div>

      {/* 5. Critical Coverage Warnings */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#0EA5E9]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Coverage Alerts
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-[#0EA5E9]">
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-black tracking-tight text-[#0EA5E9] leading-none">
            {criticalWarnings}
          </span>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
            Policy conflicts
          </span>
        </div>
      </div>
    </div>
  );
}
