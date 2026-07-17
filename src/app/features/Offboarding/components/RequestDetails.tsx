import { useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import type { ResignationRequest } from "./requestTypes";

interface Props {
  request: ResignationRequest;
  onApprove: (
    id: string,
    role: string,
    payload?: { comments?: string; lwd?: string; noticePeriod?: string },
  ) => void;
  onReject: (id: string, role: string, comments: string) => void;
  onRequestDiscussion: (id: string, role: string, comments: string) => void;
  onSendBack: (id: string, comments: string) => void;
}

export function RequestDetails({
  request,
  onApprove,
  onReject,
  onRequestDiscussion,
  onSendBack,
}: Props) {
  const { user } = useAuth();
  const canManageOffboarding = usePermissionKey(P.OFFBOARDING_MANAGE);
  const canManageTeamClearance = usePermissionKey(
    P.OFFBOARDING_CLEARANCE_MANAGER,
  );
  const [comments, setComments] = useState("");
  const [lwd, setLwd] = useState(request.lwd);
  const [notice, setNotice] = useState(request.noticePeriod);
  // The manager stage is intentionally restricted to the assigned manager.
  const isAssignedManager =
    canManageTeamClearance && user?.name === request.manager;
  // HR can manage offboarding requests at any stage, or the assigned manager can act on the manager stage.
  const canAct =
    canManageOffboarding ||
    (request.status === "pending_manager" && isAssignedManager);
  const actingStage = request.status === "pending_manager" ? "Manager" : "HR";

  return (
    <section className="h-full overflow-auto rounded-l-2xl bg-card border border-border p-6 shadow-xl">
      <h2 className="text-xl font-black">Resignation request</h2>
      <p className="text-sm text-muted-foreground mt-1">
        {request.employeeName} · {request.designation}
      </p>
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
          <b>Manager</b>
          <br />
          {request.manager}
        </p>
      </div>
      <p className="rounded-xl bg-muted p-3 text-sm">{request.comments}</p>
      <div className="my-6 border-t border-border pt-5">
        <h3 className="font-bold">Approval timeline</h3>
        {request.timeline.map((event) => (
          <p key={event.id} className="mt-3 text-xs">
            <b>{event.action}</b>
            <br />
            <span className="text-muted-foreground">
              {event.performedBy} · {event.role} · {event.date}
              {event.time ? ` ${event.time}` : ""}
            </span>
            {event.comments && (
              <span className="block text-muted-foreground">
                {event.comments}
              </span>
            )}
          </p>
        ))}
      </div>
      {request.status.startsWith("pending") && canAct && (
        <div className="space-y-3 border-t border-border pt-5">
          <textarea
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm"
            placeholder="Comments (required for reject/discussion)"
            rows={3}
          />
          {request.status === "pending_hr" && (
            <div className="grid grid-cols-2 gap-2">
              <input
                value={lwd}
                onChange={(event) => setLwd(event.target.value)}
                className="rounded-xl border border-border p-2 text-sm"
              />
              <input
                value={notice}
                onChange={(event) => setNotice(event.target.value)}
                className="rounded-xl border border-border p-2 text-sm"
              />
            </div>
          )}
          <button
            onClick={() =>
              onApprove(request.id, actingStage, {
                comments,
                lwd,
                noticePeriod: notice,
              })
            }
            className="w-full rounded-xl bg-[#00B87C] p-3 text-sm font-bold text-white"
          >
            <Check size={16} className="inline mr-1" />
            Approve
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                onReject(request.id, actingStage, comments || "Rejected")
              }
              className="rounded-xl border border-red-200 p-3 text-sm font-bold text-red-600"
            >
              <X size={16} className="inline mr-1" />
              Reject
            </button>
            <button
              onClick={() =>
                onRequestDiscussion(
                  request.id,
                  actingStage,
                  comments || "Discussion requested",
                )
              }
              className="rounded-xl border border-border p-3 text-sm font-bold"
            >
              <MessageSquare size={16} className="inline mr-1" />
              Discuss
            </button>
          </div>
          {request.status === "pending_hr" && (
            <button
              onClick={() =>
                onSendBack(request.id, comments || "Sent back for review.")
              }
              className="w-full text-sm text-muted-foreground"
            >
              Send back to manager
            </button>
          )}
        </div>
      )}
      {request.status === "pending_manager" && !canAct && (
        <p className="border-t border-border pt-5 text-sm text-muted-foreground">
          Waiting for approval from the assigned manager, {request.manager}.
        </p>
      )}
    </section>
  );
}
