import { Check } from "lucide-react";
import type { OnboardingPhase } from "../../types/onboarding.types";
import { TaskStatusIcon } from "../shared/StatusBadge";

interface CompanyProcessProps {
  phases: OnboardingPhase[];
  handleMarkDone: (phaseId: string, taskId: string) => void;
  handleSendReminder: () => void;
  handleEscalate: () => void;
}

export function CompanyProcess({ phases, handleMarkDone, handleSendReminder, handleEscalate }: CompanyProcessProps) {
  return (
    <div className="px-6 py-5 space-y-0">
      {phases.map((phase, pi) => (
        <div key={phase.id} className="relative">
          {/* Connector line */}
          {pi < phases.length - 1 && (
            <div
              className={`absolute left-[15px] top-10 bottom-0 w-[2px] ${phase.status === "completed" ? "bg-[#00B87C]" : "bg-border dashed"}`}
              style={
                phase.status !== "completed"
                  ? { backgroundImage: "repeating-linear-gradient(to bottom, hsl(var(--border)) 0, hsl(var(--border)) 4px, transparent 4px, transparent 8px)" }
                  : {}
              }
            />
          )}
          <div className="relative pb-6">
            {/* Phase Header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 border-2 ${phase.status === "completed" ? "bg-[#00B87C] border-[#00B87C]" : phase.status === "in-progress" ? "border-[#14B8A6] bg-card" : "border-muted-foreground/30 bg-card"}`}
              >
                {phase.status === "completed" ? (
                  <Check size={14} className="text-white" />
                ) : phase.status === "in-progress" ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4
                    className={`text-[14px] font-black ${phase.status === "completed" ? "text-[#00B87C]" : phase.status === "in-progress" ? "text-[#14B8A6]" : "text-muted-foreground"}`}
                  >
                    {phase.name}
                  </h4>
                  {phase.date && (
                    <span className="text-[11px] font-semibold text-muted-foreground">{phase.date}</span>
                  )}
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider ${phase.status === "completed" ? "bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20" : phase.status === "in-progress" ? "bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20" : "bg-muted/50 text-muted-foreground border border-border"}`}
              >
                {phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? "In Progress" : "Upcoming"}
              </div>
            </div>

            {/* Task Checklist */}
            <div className="ml-[45px] space-y-1">
              {phase.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <TaskStatusIcon status={task.status} />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-[12px] font-bold ${task.status === "overdue" ? "text-[#EF4444]" : task.status === "done" ? "text-foreground line-through opacity-60" : "text-foreground"}`}
                      >
                        {task.task}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground ml-2">
                        ({task.assignee})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.owner === "IT" && task.status === "in-progress" && (
                      <button onClick={handleSendReminder} className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider hover:underline">
                        Send Reminder
                      </button>
                    )}
                    {task.owner === "HR" && task.status === "in-progress" && (
                      <button
                        onClick={() => handleMarkDone(phase.id, task.id)}
                        className="px-2 py-1 rounded-lg border border-border text-[9px] font-black uppercase tracking-wider hover:bg-muted transition-all"
                      >
                        Mark Done
                      </button>
                    )}
                    {task.status === "overdue" && (
                      <button onClick={handleEscalate} className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">
                        Escalate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
