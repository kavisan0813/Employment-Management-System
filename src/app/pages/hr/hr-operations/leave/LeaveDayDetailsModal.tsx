import React from "react";
import { X, Calendar, User, Building, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { LeaveRequest } from "./types";

interface LeaveDayDetailsModalProps {
  dateStr: string;
  leaves: LeaveRequest[];
  onClose: () => void;
  onSelectLeave: (req: LeaveRequest) => void;
}

export function LeaveDayDetailsModal({
  dateStr,
  leaves,
  onClose,
  onSelectLeave,
}: LeaveDayDetailsModalProps) {
  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#00B87C]">
              <Calendar size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Leave Day Details
              </span>
            </div>
            <h2 className="text-xl font-black text-foreground mt-1">
              {formattedDate}
            </h2>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {leaves.length} employee{leaves.length === 1 ? "" : "s"} scheduled on leave
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {leaves.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2 border border-dashed border-border rounded-2xl">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <p className="text-sm font-bold">Full Workforce Available</p>
              <p className="text-xs">No employees are scheduled for leave on this date.</p>
            </div>
          ) : (
            leaves.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  onClose();
                  onSelectLeave(req);
                }}
                className="bg-background border border-border hover:border-[#00B87C] rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm"
                    style={{ background: req.avatarColor || "#00B87C" }}
                  >
                    {req.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-foreground group-hover:text-[#00B87C] transition-colors">
                        {req.employee}
                      </h4>
                      {req.criticalRole && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                          Critical Role
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Building size={12} /> {req.department}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {req.team}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-[#00B87C]">
                      {req.type}
                    </span>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                      {req.from} – {req.to} ({req.days}d)
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      req.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : req.status === "Rejected"
                        ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
