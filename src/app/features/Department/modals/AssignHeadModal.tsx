import { useState } from "react";
import { User } from "lucide-react";
import { Department } from "../types/department.types";
import { Employee } from "../../Employee/types/employee.types";

interface AssignHeadModalProps {
  dept: Department;
  employeesList: Employee[];
  onClose: () => void;
  onAssign: (id: string, headName: string, reason: string) => void;
}

export function AssignHeadModal({
  dept,
  employeesList,
  onClose,
  onAssign,
}: AssignHeadModalProps) {
  const [headInput, setHeadInput] = useState(dept.head || "");
  const [reason, setReason] = useState("");

  const handleAssign = () => {
    if (headInput.trim()) {
      onAssign(dept.id, headInput.trim(), reason.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
          Assign Head
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Update the management lead for{" "}
          <span className="font-black text-slate-800 dark:text-slate-200">
            "{dept.name}"
          </span>
          .
        </p>

        {/* Select Head */}
        <div className="mb-4">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
            Select Head
          </label>
          <div className="relative">
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold appearance-none"
              value={headInput}
              onChange={(e) => setHeadInput(e.target.value)}
            >
              <option value="">-- Select Eligible Employee --</option>
              {employeesList
                .filter(
                  (emp) =>
                    emp.department === dept.name &&
                    emp.status === "Active" &&
                    (emp.role?.includes("Manager") ||
                      emp.role?.includes("Head") ||
                      emp.role?.includes("Lead") ||
                      emp.designation.includes("Manager") ||
                      emp.designation.includes("Head") ||
                      emp.designation.includes("Lead") ||
                      emp.designation.includes("Director")),
                )
                .map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.designation})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Assignment Reason */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
            Reason (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="E.g., Promotion, Restructuring..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors"
            onClick={handleAssign}
            disabled={!headInput.trim()}
          >
            Assign Head
          </button>
        </div>
      </div>
    </div>
  );
}
