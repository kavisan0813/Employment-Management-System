import { X, Users } from "lucide-react";
import { Department } from "../types/department.types";
import { Employee } from "../../Employee/types/employee.types";

interface ViewEmployeesModalProps {
  dept: Department;
  employeesList: Employee[];
  onClose: () => void;
}

export function ViewEmployeesModal({
  dept,
  employeesList,
  onClose,
}: ViewEmployeesModalProps) {
  // Filter employees belonging to this department
  const departmentEmployees = employeesList.filter(
    (emp) => emp.department.toLowerCase() === dept.name.toLowerCase(),
  );

  return (
    <div
      className="fixed inset-0 z-[2000] flex justify-end p-4 sm:p-0"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[450px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 bg-card"
        style={{ borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
              <Users size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                {dept.name} Roster
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">
                {departmentEmployees.length} active employees listed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-neutral-50 dark:bg-zinc-900">
          {departmentEmployees.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground font-medium">
              No employees assigned to this department yet.
            </div>
          ) : (
            departmentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center text-xs font-black">
                    {emp.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {emp.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {emp.designation} • {emp.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    emp.status === "Active"
                      ? "bg-[#E6F4EA] text-[#00B87C]"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {emp.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
