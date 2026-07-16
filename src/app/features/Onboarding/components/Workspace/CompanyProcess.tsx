import { Check, Send, AlertTriangle, LockKeyhole } from "lucide-react";
import type { NewHire, OnboardingPhase } from "../../types/onboarding.types";
import { useAuth } from "../../../../context/AuthContext";

interface CompanyProcessProps {
  phases: OnboardingPhase[];
  employee: NewHire;
  handleMarkDone: (phaseId: string, taskId: string) => void;
  handleSendReminder: () => void;
  handleEscalate: () => void;
}

const DEPARTMENTS = ["HR", "IT", "Finance", "Admin", "Manager"] as const;
type Department = (typeof DEPARTMENTS)[number];

const getDepartment = (owner: string): Department | null => {
  const normalized = owner.toLowerCase();
  if (normalized.includes("hr")) return "HR";
  if (normalized.includes("finance")) return "Finance";
  if (normalized.includes("it")) return "IT";
  if (normalized.includes("admin")) return "Admin";
  if (normalized.includes("manager") || normalized.includes("lead"))
    return "Manager";
  return null;
};

export function CompanyProcess({
  phases,
  employee,
  handleMarkDone,
  handleSendReminder,
  handleEscalate,
}: CompanyProcessProps) {
  const { user } = useAuth();
  const canCompleteDepartment = (department: Department) => {
    const role = user?.role;
    if (role === "Platform Admin" || role === "Super Admin") return true;
    return (
      (department === "HR" && role === "HR Manager") ||
      (department === "Finance" && role === "Finance") ||
      (department === "IT" && role === "IT") ||
      (department === "Manager" && (role === "Manager" || role === "Team Lead"))
    );
  };

  const allTasks = phases.flatMap((phase) =>
    phase.tasks.map((task) => ({ ...task, phaseId: phase.id })),
  );
  const internalTasks = allTasks.filter((task) => getDepartment(task.owner));
  const canReview = employee.candidateProcessSubmitted === true;
  const reviewMessage =
    "Waiting for the employee to submit their onboarding information.";

  if (internalTasks.length === 0) {
    return (
      <div className="p-10 text-center">
        <h4 className="text-sm font-black text-foreground">
          No company checklist items assigned
        </h4>
        <p className="mt-2 text-xs text-muted-foreground">
          The assigned template has no HR, IT, Finance, Admin, or Manager tasks
          yet.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            Internal Company Process
          </h4>
          {!canReview && (
            <p className="mt-1 text-[11px] font-semibold text-amber-600">
              {reviewMessage}
            </p>
          )}
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">
          {internalTasks.filter((task) => task.status === "done").length} /{" "}
          {internalTasks.length} tasks completed
        </span>
      </div>

      <div className="space-y-6">
        {DEPARTMENTS.map((department) => {
          const tasks = internalTasks.filter(
            (task) => getDepartment(task.owner) === department,
          );
          if (!tasks.length) return null;
          const completed = tasks.filter(
            (task) => task.status === "done",
          ).length;
          const editable = canCompleteDepartment(department) && canReview;
          const percent = Math.round((completed / tasks.length) * 100);
          return (
            <section
              key={department}
              className="p-5 bg-card border border-border rounded-2xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
                <h5 className="text-[14px] font-black text-foreground uppercase tracking-wider">
                  {department}
                </h5>
                <span className="text-[11px] font-black text-[#00B87C]">
                  {percent}% Done
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start sm:items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/40 gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() =>
                          editable && handleMarkDone(task.phaseId, task.id)
                        }
                        disabled={!editable}
                        title={
                          !canCompleteDepartment(department)
                            ? "Only the assigned department can complete this task"
                            : !canReview
                              ? reviewMessage
                              : task.status === "done"
                                ? "Mark as pending"
                                : "Mark as completed"
                        }
                        className={`mt-0.5 sm:mt-0 w-[18px] h-[18px] rounded-[4px] accent-[#00B87C] ${editable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                      />
                      <div className="min-w-0">
                        <span
                          className={`text-[12px] font-bold ${task.status === "done" ? "text-muted-foreground line-through opacity-60" : "text-foreground"}`}
                        >
                          {task.task}
                        </span>
                        <span className="block text-[10px] font-semibold text-muted-foreground">
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                    {task.status !== "done" &&
                      (editable ? (
                        <button
                          onClick={() => handleMarkDone(task.phaseId, task.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
                        >
                          <Check size={10} /> Complete
                        </button>
                      ) : !canReview ? (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <LockKeyhole size={11} /> Awaiting submission
                        </span>
                      ) : (
                        <button
                          onClick={handleSendReminder}
                          className="px-2.5 py-1 rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
                        >
                          <Send size={10} /> Remind
                        </button>
                      ))}
                    {task.status === "overdue" && (
                      <button
                        onClick={handleEscalate}
                        className="text-[#EF4444]"
                      >
                        <AlertTriangle size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
