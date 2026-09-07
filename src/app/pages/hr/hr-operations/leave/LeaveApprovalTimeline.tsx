import React from "react";
import { CheckCircle2, XCircle, Clock, ArrowRight, ShieldCheck, History, AlertCircle } from "lucide-react";
import { LeaveRequest, ApprovalWorkflowConfig, ApprovalStageRecord, LeaveHistory } from "./types";

interface LeaveApprovalTimelineProps {
  request: LeaveRequest;
  workflowConfig: ApprovalWorkflowConfig;
}

export function LeaveApprovalTimeline({ request, workflowConfig }: LeaveApprovalTimelineProps) {
  const stageRecords: ApprovalStageRecord[] = request.stageRecords || [];
  const history: LeaveHistory[] = request.history || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5 m-0">
          <History size={14} className="text-[#00B87C]" /> Multi-Stage Approval Pipeline ({workflowConfig.layerType} LAYER)
        </h4>
        <span className="text-[10px] font-bold text-muted-foreground">
          {workflowConfig.stages.length} Stage{workflowConfig.stages.length > 1 ? "s" : ""} Configured
        </span>
      </div>

      {/* WORKFLOW STAGE PROGRESSION PIPELINE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stageRecords.map((stg) => {
          const isCurrent = request.status === "Pending" && request.currentStageRole === stg.role;
          const isApproved = stg.status === "APPROVED";
          const isRejected = stg.status === "REJECTED";

          return (
            <div
              key={stg.stageId}
              className={`p-3 rounded-2xl border transition-all space-y-1.5 ${
                isApproved
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : isRejected
                  ? "bg-rose-500/10 border-rose-500/30"
                  : isCurrent
                  ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30"
                  : "bg-background border-border opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Stage {stg.stageOrder}: {stg.role}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    isApproved
                      ? "bg-emerald-500 text-white"
                      : isRejected
                      ? "bg-rose-600 text-white"
                      : isCurrent
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isApproved ? "Approved" : isRejected ? "Rejected" : isCurrent ? "Current" : "Pending"}
                </span>
              </div>

              <div className="font-extrabold text-xs text-foreground truncate">
                {stg.label}
              </div>

              {stg.approverName && (
                <div className="text-[11px] font-semibold text-muted-foreground">
                  By: <span className="text-foreground font-bold">{stg.approverName}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* APPEND-ONLY AUDIT HISTORY LOG TIMELINE */}
      <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
        <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Append-Only Audit History ({history.length} Event{history.length === 1 ? "" : "s"})
        </span>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No approval events recorded yet.</p>
        ) : (
          <div className="relative border-l-2 border-border/80 pl-4 space-y-4 my-2">
            {history.map((item) => {
              const isApproval = item.action.toLowerCase().includes("approved");
              const isRejection = item.action.toLowerCase().includes("rejected");

              return (
                <div key={`${item.date}-${item.action}-${item.by}`} className="relative space-y-1">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      isApproval
                        ? "bg-[#00B87C]"
                        : isRejection
                        ? "bg-rose-600"
                        : "bg-amber-500"
                    }`}
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      {isApproval && <CheckCircle2 size={13} className="text-[#00B87C]" />}
                      {isRejection && <XCircle size={13} className="text-rose-600" />}
                      {!isApproval && !isRejection && <Clock size={13} className="text-amber-500" />}
                      {item.action}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {item.date}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-muted-foreground">
                    Action by: <span className="text-foreground font-bold">{item.by}</span>
                  </div>

                  {item.comment && (
                    <div className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-xl border border-border/60 font-medium italic mt-1">
                      "{item.comment}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
