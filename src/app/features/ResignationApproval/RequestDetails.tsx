import React, { useState } from "react";
import { ResignationRequest } from "./types/resignation.types";
import { User, Calendar, Clock, FileText, Check, X, MessageSquare, RefreshCw, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface RequestDetailsProps {
  request: ResignationRequest;
  onApprove: (id: string, role: string, payload?: any) => void;
  onReject: (id: string, role: string, comments: string) => void;
  onRequestDiscussion: (id: string, role: string, comments: string) => void;
  onSendBack?: (id: string, comments: string) => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  onApprove,
  onReject,
  onRequestDiscussion,
  onSendBack,
}) => {
  const { user } = useAuth();
  const isManager = user?.role === "Manager" || user?.role === "Finance" || user?.role === "Team Lead";
  const isHR = user?.role === "HR Manager" || user?.role === "Super Admin" || user?.role === "Platform Admin";

  const [commentText, setCommentText] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [showDiscussionBox, setShowDiscussionBox] = useState(false);

  // HR inputs
  const [customLwd, setCustomLwd] = useState(request.lwd);
  const [customNotice, setCustomNotice] = useState(request.noticePeriod);
  const [exitCategory, setExitCategory] = useState("Voluntary");

  const handleManagerApprove = () => {
    onApprove(request.id, "Manager", { comments: commentText || "Approved" });
    setCommentText("");
  };

  const handleHRApprove = () => {
    onApprove(request.id, "HR", {
      lwd: customLwd,
      noticePeriod: customNotice,
      exitCategory,
      comments: commentText || "HR Approved & Exit Initiated.",
    });
    setCommentText("");
  };

  const handleRejectSubmit = () => {
    if (!commentText.trim()) return;
    onReject(request.id, isHR ? "HR" : "Manager", commentText);
    setCommentText("");
    setShowRejectBox(false);
  };

  const handleDiscussionSubmit = () => {
    if (!commentText.trim()) return;
    onRequestDiscussion(request.id, isHR ? "HR" : "Manager", commentText);
    setCommentText("");
    setShowDiscussionBox(false);
  };

  const handleSendBackSubmit = () => {
    if (onSendBack) {
      onSendBack(request.id, commentText || "Sent back for review.");
      setCommentText("");
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 overflow-y-auto max-h-[85vh] scrollbar-thin">
      <div>
        <h2 className="text-[18px] font-black text-foreground">Employee Exit Request</h2>
        <p className="text-[12px] font-medium text-muted-foreground mt-0.5">
          Submitted by {request.employeeName}
        </p>
      </div>

      <hr className="border-border" />

      {/* Employee Information */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
          Employee Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Name</p>
            <p className="text-[13px] font-bold text-foreground">{request.employeeName}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Employee ID</p>
            <p className="text-[13px] font-bold text-foreground">{request.employeeId}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Department</p>
            <p className="text-[13px] font-bold text-foreground">{request.department}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Designation</p>
            <p className="text-[13px] font-bold text-foreground">{request.designation}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Manager</p>
            <p className="text-[13px] font-bold text-foreground">{request.manager}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Joining Date</p>
            <p className="text-[13px] font-bold text-foreground">{request.joiningDate}</p>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Resignation details */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
          Resignation Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Resignation Date</p>
            <p className="text-[13px] font-bold text-foreground">{request.resignationDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Expected LWD</p>
            <p className="text-[13px] font-bold text-foreground">{request.lwd}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Notice Period</p>
            <p className="text-[13px] font-bold text-foreground">{request.noticePeriod}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Reason</p>
            <p className="text-[13px] font-bold text-foreground">{request.reason}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-semibold text-muted-foreground">Comments</p>
            <p className="text-[13px] font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
              {request.comments}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Workflow Timeline */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
          Approval Timeline
        </h3>
        <div className="relative border-l-2 border-border ml-3 space-y-6">
          {request.timeline.map((event) => (
            <div key={event.id} className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#00B87C] border-2 border-card" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[12px] font-bold text-foreground">{event.action}</p>
                <p className="text-[10px] font-semibold text-muted-foreground">
                  By {event.performedBy} ({event.role}) · {event.date}
                </p>
                {event.comments && (
                  <p className="text-[11px] font-medium text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border mt-1">
                    "{event.comments}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Actionable buttons */}
      {request.status === "pending_manager" && isManager && (
        <div className="space-y-3 pt-2">
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
            Manager Review Actions
          </p>
          {showRejectBox || showDiscussionBox ? (
            <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border border-border">
              <label className="text-[11px] font-black text-foreground uppercase tracking-wider">
                {showRejectBox ? "Rejection Comments" : "Discussion Topic"}
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter details here..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRejectBox(false);
                    setShowDiscussionBox(false);
                    setCommentText("");
                  }}
                  className="flex-1 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={showRejectBox ? handleRejectSubmit : handleDiscussionSubmit}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-[11px] font-bold"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleManagerApprove}
                className="w-full py-2.5 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00B87C]/10"
              >
                <Check size={16} /> Approve & Send to HR
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRejectBox(true)}
                  className="flex-1 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => setShowDiscussionBox(true)}
                  className="flex-1 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <MessageSquare size={14} /> Discuss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {request.status === "pending_hr" && isHR && (
        <div className="space-y-4 pt-2">
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
            HR Review & Exit Setup
          </p>

          <div className="bg-secondary/10 p-4 rounded-2xl space-y-4 border border-border/50">
            {/* LWD and Notice updates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Adjust LWD
                </label>
                <input
                  type="date"
                  value={customLwd}
                  onChange={(e) => setCustomLwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Notice Period
                </label>
                <input
                  type="text"
                  value={customNotice}
                  onChange={(e) => setCustomNotice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"
                />
              </div>
            </div>

            {/* Exit Category */}
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Select Exit Category
              </label>
              <select
                value={exitCategory}
                onChange={(e) => setExitCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"
              >
                <option value="Voluntary">Voluntary</option>
                <option value="Termination">Termination</option>
                <option value="Retirement">Retirement</option>
                <option value="Contract End">Contract End</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="HR Comments (optional)..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none resize-none"
            />
            <button
              onClick={handleHRApprove}
              className="w-full py-2.5 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00B87C]/10"
            >
              <Check size={16} /> Approve & Issue Clearance
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => onReject(request.id, "HR", commentText || "Rejected by HR.")}
                className="flex-1 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold transition-all"
              >
                Reject Request
              </button>
              <button
                onClick={handleSendBackSubmit}
                className="flex-1 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-[11px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw size={12} /> Send Back
              </button>
            </div>
          </div>
        </div>
      )}

      {request.status === "approved" && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl text-center">
          <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
            ✓ Request Fully Approved
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Offboarding exit record has been successfully initiated.
          </p>
        </div>
      )}

      {request.status === "rejected" && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl text-center">
          <p className="text-[13px] font-bold text-rose-600 dark:text-rose-400">
            ✕ Request Rejected
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Rejection status is updated. The employee may update or reset.
          </p>
        </div>
      )}
    </div>
  );
};
