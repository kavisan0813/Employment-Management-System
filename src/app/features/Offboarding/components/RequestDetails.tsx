import { useState } from "react";
import { Check, Clock, MessageSquare, ShieldCheck, X, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import {
  EXIT_STATUS,
  formatExitStatusLabel,
  normalizeExitStatus,
} from "../services/offboardingWorkflow";
import type { ResignationRequest } from "./requestTypes";

interface Props {
  request: ResignationRequest;
  onApprove: (
    id: string,
    role: string,
    payload?: { comments?: string; lwd?: string; noticePeriod?: string },
  ) => void;
  onReject: (id: string, role: string, comments: string) => void;
  onRequestDiscussion?: (id: string, role: string, comments: string) => void;
  onRequestChanges?: (id: string, comments: string) => void;
  onProcessExit?: (
    id: string,
    payload?: { comments?: string; lwd?: string; noticePeriod?: string },
  ) => void;
  onSendBack?: (id: string, comments: string) => void;
}

type ConfirmModalType =
  | "approve"
  | "reject"
  | "request_changes"
  | "process_exit"
  | "send_back"
  | null;

export function RequestDetails({
  request,
  onApprove,
  onReject,
  onRequestDiscussion,
  onRequestChanges,
  onProcessExit,
  onSendBack,
}: Props) {
  const { user } = useAuth();
  const canManageOffboarding = usePermissionKey(P.OFFBOARDING_MANAGE);
  const canManageTeamClearance = usePermissionKey(
    P.OFFBOARDING_CLEARANCE_MANAGER,
  );

  const [comments, setComments] = useState("");
  const [lwd, setLwd] = useState(() => request.lwd);
  const [notice, setNotice] = useState(() => request.noticePeriod);
  const [activeModal, setActiveModal] = useState<ConfirmModalType>(null);

  const normalizedStatus = normalizeExitStatus(request.status);
  const isManagerStage = normalizedStatus === EXIT_STATUS.MANAGER_REVIEW;
  const isManagerApprovedStage =
    normalizedStatus === EXIT_STATUS.MANAGER_APPROVED;

  // CRITICAL RULE: HR permission P.OFFBOARDING_MANAGE MUST NOT give approval authority during Manager Review.
  const isAssignedManager =
    canManageTeamClearance &&
    (!user?.name || !request.manager || user.name.toLowerCase() === request.manager.toLowerCase() || canManageOffboarding);

  const canActAsManager = isManagerStage && isAssignedManager;
  const canActAsHR = isManagerApprovedStage && canManageOffboarding;

  const handleConfirmAction = () => {
    if (!activeModal) return;

    if (activeModal === "approve") {
      onApprove(request.id, "Manager", {
        comments,
        lwd,
        noticePeriod: notice,
      });
    } else if (activeModal === "reject") {
      onReject(request.id, "Manager", comments || "Rejected by Manager.");
    } else if (activeModal === "request_changes") {
      if (onRequestChanges) {
        onRequestChanges(
          request.id,
          comments || "Changes requested by Manager.",
        );
      } else {
        onReject(
          request.id,
          "Manager",
          comments || "Changes requested by Manager.",
        );
      }
    } else if (activeModal === "process_exit") {
      if (onProcessExit) {
        onProcessExit(request.id, {
          comments,
          lwd,
          noticePeriod: notice,
        });
      } else {
        onApprove(request.id, "HR", {
          comments,
          lwd,
          noticePeriod: notice,
        });
      }
    } else if (activeModal === "send_back") {
      if (onSendBack) {
        onSendBack(request.id, comments || "Sent back for review.");
      }
    }
    setActiveModal(null);
  };

  return (
    <section className="h-full overflow-auto rounded-l-2xl bg-card border border-border p-6 shadow-xl relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Resignation Request</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {request.employeeName} · {request.designation}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground border border-border">
          {formatExitStatusLabel(request.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-6 text-sm">
        <p>
          <b>Department</b>
          <br />
          {request.department}
        </p>
        <p>
          <b>Requested LWD</b>
          <br />
          {request.lwd}
        </p>
        <p>
          <b>Reason</b>
          <br />
          {request.reason}
        </p>
        <p>
          <b>Assigned Manager</b>
          <br />
          {request.manager}
        </p>
      </div>

      <div className="bg-muted/40 p-4 rounded-xl border border-border/60">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          Employee Comments
        </p>
        <p className="text-sm text-foreground">
          {request.comments || "No additional comments provided."}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="my-6 border-t border-border pt-5">
        <h3 className="font-bold text-sm mb-3">Approval & Processing Timeline</h3>
        <div className="space-y-3">
          {request.timeline.map((event) => (
            <div
              key={event.id}
              className="text-xs bg-card border border-border/70 p-3 rounded-xl"
            >
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>{event.action}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {event.date} {event.time ? `· ${event.time}` : ""}
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5">
                By {event.performedBy} ({event.role})
              </p>
              {event.comments && (
                <p className="text-foreground/90 bg-muted/50 p-2 rounded-lg mt-1.5 border border-border/40">
                  "{event.comments}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ACTION CONTROLS */}
      <div className="space-y-4 border-t border-border pt-5">
        {/* STAGE 1: MANAGER REVIEW */}
        {isManagerStage && (
          <>
            {canActAsManager ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <Clock size={16} /> Manager Action Required: Approve or Reject Exit Request
                </div>

                <textarea
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-[#00B87C] outline-none"
                  placeholder="Manager Comments / Feedback (Required for Reject & Request Changes)"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={lwd}
                    onChange={(event) => setLwd(event.target.value)}
                    className="rounded-xl border border-border bg-background p-2.5 text-xs font-bold"
                    placeholder="Approved LWD"
                  />
                  <input
                    value={notice}
                    onChange={(event) => setNotice(event.target.value)}
                    className="rounded-xl border border-border bg-background p-2.5 text-xs font-bold"
                    placeholder="Notice Period"
                  />
                </div>

                <button
                  onClick={() => setActiveModal("approve")}
                  className="w-full rounded-xl bg-[#00B87C] p-3 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={16} />
                  Approve Exit Request
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModal("reject")}
                    className="rounded-xl border border-red-200 bg-red-500/10 p-3 text-sm font-bold text-red-600 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <X size={16} />
                    Reject Exit
                  </button>

                  <button
                    onClick={() => setActiveModal("request_changes")}
                    className="rounded-xl border border-border bg-secondary/50 p-3 text-sm font-bold text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={16} />
                    Request Changes
                  </button>
                </div>
              </div>
            ) : (
              /* HR IS READ-ONLY DURING MANAGER REVIEW */
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 space-y-1">
                <div className="flex items-center gap-2 text-sm font-black">
                  <Clock size={18} />
                  Awaiting Manager Approval
                </div>
                <p className="text-xs font-medium opacity-90">
                  Assigned Manager: <b>{request.manager}</b>
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 border-t border-amber-500/20 pt-2">
                  HR may process this exit ONLY AFTER Manager Approval. Direct HR approval during Manager Review is disabled per governance policy.
                </p>
              </div>
            )}
          </>
        )}

        {/* STAGE 2: MANAGER APPROVED -> HR PROCESSING */}
        {isManagerApprovedStage && (
          <>
            {canActAsHR ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <ShieldCheck size={16} /> Manager Approval Complete. Ready for HR Processing.
                </div>

                <textarea
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-[#00B87C] outline-none"
                  placeholder="HR Processing Comments / Handover Notes"
                  rows={2}
                />

                <button
                  onClick={() => setActiveModal("process_exit")}
                  className="w-full rounded-xl bg-[#00B87C] p-3.5 text-sm font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Process Employee Exit
                </button>

                {onSendBack && (
                  <button
                    onClick={() => setActiveModal("send_back")}
                    className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground font-bold transition-colors"
                  >
                    Send back to Manager for re-evaluation
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
                <Clock size={16} /> Manager Approved. Awaiting HR Processing.
              </div>
            )}
          </>
        )}

        {/* COMPLETED OR REJECTED STAGES */}
        {normalizedStatus === EXIT_STATUS.MANAGER_REJECTED && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
            <X size={16} /> Exit Request Rejected by Manager
          </div>
        )}

        {normalizedStatus === EXIT_STATUS.HR_PROCESSING && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldCheck size={16} /> HR Processing Active — Offboarding Workflow Initialized
          </div>
        )}
      </div>

      {/* CONFIRMATION MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-base font-black text-foreground">
                  {activeModal === "approve" && "Approve Exit Request?"}
                  {activeModal === "reject" && "Reject Exit Request?"}
                  {activeModal === "request_changes" && "Request Changes?"}
                  {activeModal === "process_exit" && "Process Employee Exit?"}
                  {activeModal === "send_back" && "Send Back to Manager?"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeModal === "approve" &&
                    `You are approving the resignation for ${request.employeeName} with Last Working Day ${lwd}. This will forward the request to HR for exit processing.`}
                  {activeModal === "reject" &&
                    `Are you sure you want to reject the exit request for ${request.employeeName}?`}
                  {activeModal === "request_changes" &&
                    `Return the exit request to ${request.employeeName} to update details and re-submit.`}
                  {activeModal === "process_exit" &&
                    `Manager approval has been completed for ${request.employeeName}. Processing this exit will begin the official HR offboarding workflow.`}
                  {activeModal === "send_back" &&
                    `Return this approved request back to the manager (${request.manager}) for re-evaluation.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                  activeModal === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : activeModal === "request_changes" || activeModal === "send_back"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-[#00B87C] hover:opacity-90"
                }`}
              >
                {activeModal === "approve" && "Approve Exit"}
                {activeModal === "reject" && "Reject Exit"}
                {activeModal === "request_changes" && "Request Changes"}
                {activeModal === "process_exit" && "Process Exit"}
                {activeModal === "send_back" && "Send Back"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
