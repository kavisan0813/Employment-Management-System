import { useEffect, useState } from "react";
import { Clock, MessageSquare, UserRound, ShieldCheck, CheckCircle2 } from "lucide-react";
import { RequestDetails } from "./RequestDetails";
import type { ResignationRequest } from "./requestTypes";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  EXIT_STATUS,
  canTransitionTo,
  createOffboardingRecord,
  formatExitStatusLabel,
  normalizeExitStatus,
  persistOffboardingRecord,
} from "../services/offboardingWorkflow";

export function RequestsTab({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ResignationRequest[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("viyan_resignation_requests:v1") || "[]",
      );
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState<ResignationRequest | null>(null);

  useEffect(() => {
    localStorage.setItem(
      "viyan_resignation_requests:v1",
      JSON.stringify(requests),
    );
  }, [requests]);

  const stamp = () => ({
    date: new Date().toLocaleDateString("en-US", { dateStyle: "medium" }),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  });

  const update = (
    id: string,
    change: (request: ResignationRequest) => ResignationRequest,
  ) => {
    const next = requests.map((request) =>
      request.id === id ? change(request) : request,
    );
    setRequests(next);
    onCountChange?.(
      next.filter((request) => {
        const norm = normalizeExitStatus(request.status);
        return norm === EXIT_STATUS.MANAGER_REVIEW || norm === EXIT_STATUS.MANAGER_APPROVED;
      }).length,
    );
  };

  // ── MANAGER APPROVE ──
  const handleManagerApprove = (
    id: string,
    role: string,
    payload?: { comments?: string; lwd?: string; noticePeriod?: string },
  ) => {
    update(id, (request) => {
      const normalized = normalizeExitStatus(request.status);
      if (!canTransitionTo(normalized, EXIT_STATUS.MANAGER_APPROVED)) {
        showToast(
          "Action Blocked",
          "error",
          "Invalid status transition for Manager Approval.",
        );
        return request;
      }
      const by = user?.name || request.manager || role;
      const roleName = user?.role || "Manager";
      const occurredAt = stamp();
      return {
        ...request,
        status: "manager_approved" as any,
        lwd: payload?.lwd || request.lwd,
        noticePeriod: payload?.noticePeriod || request.noticePeriod,
        timeline: [
          ...request.timeline,
          {
            id: `ev-${Date.now()}`,
            action: "Manager Approved",
            performedBy: by,
            role: roleName,
            ...occurredAt,
            comments:
              payload?.comments ||
              "Exit request approved by manager and forwarded to HR.",
          },
        ],
      };
    });
    showToast("Manager Approved", "success", "Resignation approved. Forwarded to HR.");
  };

  // ── MANAGER REJECT ──
  const handleManagerReject = (id: string, role: string, comments: string) => {
    update(id, (request) => {
      const normalized = normalizeExitStatus(request.status);
      if (!canTransitionTo(normalized, EXIT_STATUS.MANAGER_REJECTED)) {
        showToast(
          "Action Blocked",
          "error",
          "Invalid status transition for Rejection.",
        );
        return request;
      }
      return {
        ...request,
        status: "manager_rejected" as any,
        timeline: [
          ...request.timeline,
          {
            id: `ev-${Date.now()}`,
            action: "Manager Rejected",
            performedBy: user?.name || role,
            role: user?.role || role,
            ...stamp(),
            comments,
          },
        ],
      };
    });
    showToast("Manager Rejected", "error", "Resignation request rejected.");
  };

  // ── REQUEST CHANGES ──
  const handleRequestChanges = (id: string, comments: string) => {
    update(id, (request) => {
      const normalized = normalizeExitStatus(request.status);
      if (!canTransitionTo(normalized, EXIT_STATUS.DRAFT)) {
        showToast("Action Blocked", "error", "Invalid status transition.");
        return request;
      }
      return {
        ...request,
        status: "exit_draft" as any,
        timeline: [
          ...request.timeline,
          {
            id: `ev-${Date.now()}`,
            action: "Changes Requested by Manager",
            performedBy: user?.name || "Manager",
            role: user?.role || "Manager",
            ...stamp(),
            comments,
          },
        ],
      };
    });
    showToast("Changes Requested", "info", "Request returned to employee for editing.");
  };

  // ── HR PROCESS EXIT ──
  const handleHRProcessExit = (
    id: string,
    payload?: { comments?: string; lwd?: string; noticePeriod?: string },
  ) => {
    update(id, (request) => {
      const normalized = normalizeExitStatus(request.status);

      // STRICT GUARD: HR Process Exit MUST ONLY work if status === manager_approved!
      if (!canTransitionTo(normalized, EXIT_STATUS.HR_PROCESSING)) {
        showToast(
          "HR Action Blocked",
          "error",
          "HR can process an exit ONLY AFTER Manager Approval.",
        );
        return request;
      }

      const by = user?.name || "HR Manager";
      const roleName = user?.role || "HR Manager";
      const occurredAt = stamp();

      const processed = {
        ...request,
        status: "hr_processing" as any,
        lwd: payload?.lwd || request.lwd,
        noticePeriod: payload?.noticePeriod || request.noticePeriod,
        timeline: [
          ...request.timeline,
          {
            id: `ev-${Date.now()}`,
            action: "HR Processing Started", // NEVER "HR Approved"
            performedBy: by,
            role: roleName,
            ...occurredAt,
            comments:
              payload?.comments ||
              "HR processing started. Offboarding record created.",
          },
        ],
      };

      persistOffboardingRecord(
        createOffboardingRecord({
          name: request.employeeName,
          designation: request.designation,
          department: request.department,
          type: "Resignation",
          lwd: processed.lwd,
          noticePeriodDays: parseInt(processed.noticePeriod) || 30,
          reason: request.reason,
          createdBy: by,
          manager: request.manager,
          resignationDate: request.resignationDate,
          documents: [
            {
              name: "Resignation Letter",
              status: "uploaded",
              source: "employee_exit",
            },
          ],
        }),
      );
      return processed;
    });
    showToast("HR Processing Started", "success", "Offboarding workflow initialized.");
  };

  // ── SEND BACK TO MANAGER ──
  const handleSendBack = (id: string, comments: string) => {
    update(id, (request) => ({
      ...request,
      status: "manager_review" as any,
      timeline: [
        ...request.timeline,
        {
          id: `ev-${Date.now()}`,
          action: "Sent Back to Manager",
          performedBy: user?.name || "HR",
          role: user?.role || "HR",
          ...stamp(),
          comments,
        },
      ],
    }));
    showToast("Sent Back to Manager", "info", "Request returned to Manager.");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {requests.map((request) => {
          const normalized = normalizeExitStatus(request.status);
          const isManagerPending = normalized === EXIT_STATUS.MANAGER_REVIEW;
          const isManagerApproved = normalized === EXIT_STATUS.MANAGER_APPROVED;

          return (
            <button
              key={request.id}
              onClick={() => setSelected(request)}
              className="text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-[#00B87C]/60 hover:shadow-md transition-all"
            >
              <div className="flex justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center font-black">
                    {request.employeeName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-black">{request.employeeName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {request.designation} · {request.department}
                    </p>
                  </div>
                </div>

                <span
                  className={`h-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    isManagerPending
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : isManagerApproved
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {formatExitStatusLabel(request.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={14} /> LWD: {request.lwd}
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <UserRound size={14} /> {request.manager}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-[#00B87C]">
                <span>
                  {isManagerPending
                    ? "Awaiting Manager Approval"
                    : isManagerApproved
                      ? "Ready for HR Processing"
                      : "View Workflow"}
                </span>
                <MessageSquare size={15} />
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 p-4 flex justify-end"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <RequestDetails
              request={
                requests.find((request) => request.id === selected.id) ||
                selected
              }
              onApprove={handleManagerApprove}
              onReject={handleManagerReject}
              onRequestChanges={handleRequestChanges}
              onProcessExit={handleHRProcessExit}
              onSendBack={handleSendBack}
            />
          </div>
        </div>
      )}
    </>
  );
}

