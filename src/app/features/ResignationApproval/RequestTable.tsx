import React from "react";
import { ResignationRequest } from "./types/resignation.types";
import { Clock, Check, X, ShieldCheck } from "lucide-react";

interface RequestTableProps {
  requests: ResignationRequest[];
  selectedId: string | null;
  onSelect: (req: ResignationRequest) => void;
}

export const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  selectedId,
  onSelect,
}) => {
  const getStatusBadge = (status: ResignationRequest["status"]) => {
    switch (status) {
      case "pending_manager":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 text-[11px] font-bold">
            <Clock size={12} /> Pending Manager
          </span>
        );
      case "pending_hr":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30 text-[11px] font-bold">
            <Clock size={12} /> Pending HR
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 text-[11px] font-bold">
            <Check size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 text-[11px] font-bold">
            <X size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/10 border-b border-border">
              <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Joining Date
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Requested LWD
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {requests.map((req) => {
              const isSelected = selectedId === req.id;
              return (
                <tr
                  key={req.id}
                  onClick={() => onSelect(req)}
                  className={`cursor-pointer hover:bg-muted/40 transition-all ${
                    isSelected ? "bg-muted/70 font-medium" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-xs">
                        {req.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">
                          {req.employeeName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {req.designation} · {req.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-foreground">
                    {req.department}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-semibold text-muted-foreground">
                    {req.joiningDate}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-semibold text-muted-foreground">
                    {req.lwd}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground font-bold text-[13px]">
                  No resignation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
