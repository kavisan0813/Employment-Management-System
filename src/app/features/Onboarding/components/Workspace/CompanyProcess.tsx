import { Check, Send, AlertTriangle } from "lucide-react";
import type { OnboardingPhase } from "../../types/onboarding.types";
import { TaskStatusIcon } from "../shared/StatusBadge";

interface CompanyProcessProps {
  phases: OnboardingPhase[];
  handleMarkDone: (phaseId: string, taskId: string) => void;
  handleSendReminder: () => void;
  handleEscalate: () => void;
}

const DEPARTMENTS = ["HR", "IT", "Finance", "Admin", "Manager"] as const;

export function CompanyProcess({ phases, handleMarkDone, handleSendReminder, handleEscalate }: CompanyProcessProps) {
  // Flatten tasks and keep reference to their parent phaseId
  const allTasks = phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseId: phase.id,
    }))
  );

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
          Internal Company Process
        </h4>
        <span className="text-[11px] font-bold text-muted-foreground">
          {allTasks.filter((t) => t.owner !== "Employee" && t.status === "done").length} /{" "}
          {allTasks.filter((t) => t.owner !== "Employee").length} tasks completed
        </span>
      </div>

      <div className="space-y-6">
        {DEPARTMENTS.map((dept) => {
          const deptTasks = allTasks.filter((t) => t.owner === dept);
          if (deptTasks.length === 0) return null;

          const completedCount = deptTasks.filter((t) => t.status === "done").length;
          const totalCount = deptTasks.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div key={dept} className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
              {/* Department Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B87C]" />
                  <h5 className="text-[14px] font-black text-foreground uppercase tracking-wider">{dept}</h5>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-muted/60 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-[#00B87C] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-[#00B87C]">{pct}% Done</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {deptTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start sm:items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/40 transition-all group gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => handleMarkDone(task.phaseId, task.id)}
                        className="mt-0.5 sm:mt-0 w-[18px] h-[18px] rounded-[4px] border-2 border-muted-foreground/30 text-[#00B87C] focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer checked:border-[#00B87C] shrink-0 accent-[#00B87C]"
                        title={task.status === "done" ? "Mark as Pending" : "Mark as Completed"}
                      />
                      <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span
                          className={`text-[12px] font-bold block ${
                            task.status === "done"
                              ? "text-muted-foreground line-through opacity-60"
                              : task.status === "overdue"
                              ? "text-[#EF4444]"
                              : "text-foreground"
                          }`}
                        >
                          {task.task}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          • Due {task.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Department action options */}
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {task.status !== "done" && (
                        <>
                          {dept === "HR" ? (
                            <button
                              onClick={() => handleMarkDone(task.phaseId, task.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#00B87C]/10 hover:bg-[#00B87C] text-[#00B87C] hover:text-white border border-[#00B87C]/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <Check size={10} /> Complete
                            </button>
                          ) : (
                            <button
                              onClick={handleSendReminder}
                              className="px-2.5 py-1 rounded-lg bg-[#0EA5E9]/10 hover:bg-[#0EA5E9] text-[#0EA5E9] hover:text-white border border-[#0EA5E9]/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <Send size={10} /> Remind
                            </button>
                          )}
                          {task.status === "overdue" && (
                            <button
                              onClick={handleEscalate}
                              className="px-2.5 py-1 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <AlertTriangle size={10} /> Escalate
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
