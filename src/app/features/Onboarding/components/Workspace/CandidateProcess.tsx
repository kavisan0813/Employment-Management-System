import { useState, useEffect } from "react";
import { Check, Circle } from "lucide-react";

interface CandidateTask {
  id: string;
  label: string;
  status: "done" | "pending";
}

interface CandidateChecklist {
  personalDetails: CandidateTask[];
  documents: CandidateTask[];
  forms: CandidateTask[];
}

const DEFAULT_CHECKLISTS: Record<string, CandidateChecklist> = {
  nh1: {
    personalDetails: [
      { id: "p1", label: "Basic Information", status: "done" },
      { id: "p2", label: "Emergency Contact", status: "pending" },
      { id: "p3", label: "Address Details", status: "pending" },
      { id: "p4", label: "Bank Details", status: "pending" },
    ],
    documents: [
      { id: "d1", label: "Passport Photo", status: "done" },
      { id: "d2", label: "Aadhaar Card", status: "done" },
      { id: "d3", label: "PAN Card", status: "pending" },
      { id: "d4", label: "Degree Certificate", status: "pending" },
      { id: "d5", label: "Experience Letter", status: "pending" },
    ],
    forms: [
      { id: "f1", label: "Non-Disclosure Agreement (NDA)", status: "pending" },
      { id: "f2", label: "Company Policies Acknowledgement", status: "pending" },
      { id: "f3", label: "Digital Signature Setup", status: "pending" },
    ],
  },
  nh2: {
    personalDetails: [
      { id: "p1", label: "Basic Information", status: "done" },
      { id: "p2", label: "Emergency Contact", status: "done" },
      { id: "p3", label: "Address Details", status: "pending" },
      { id: "p4", label: "Bank Details", status: "pending" },
    ],
    documents: [
      { id: "d1", label: "Passport Photo", status: "pending" },
      { id: "d2", label: "Aadhaar Card", status: "pending" },
      { id: "d3", label: "PAN Card", status: "pending" },
      { id: "d4", label: "Degree Certificate", status: "pending" },
      { id: "d5", label: "Experience Letter", status: "pending" },
    ],
    forms: [
      { id: "f1", label: "Non-Disclosure Agreement (NDA)", status: "pending" },
      { id: "f2", label: "Company Policies Acknowledgement", status: "pending" },
      { id: "f3", label: "Digital Signature Setup", status: "pending" },
    ],
  },
};

// Fallback generator for other employees
const generateChecklist = (id: string, progress: number): CandidateChecklist => {
  if (DEFAULT_CHECKLISTS[id]) return DEFAULT_CHECKLISTS[id];

  const statusForProgress = (threshold: number) => (progress >= threshold ? "done" : "pending");

  return {
    personalDetails: [
      { id: "p1", label: "Basic Information", status: statusForProgress(10) },
      { id: "p2", label: "Emergency Contact", status: statusForProgress(30) },
      { id: "p3", label: "Address Details", status: statusForProgress(50) },
      { id: "p4", label: "Bank Details", status: statusForProgress(70) },
    ],
    documents: [
      { id: "d1", label: "Passport Photo", status: statusForProgress(20) },
      { id: "d2", label: "Aadhaar Card", status: statusForProgress(40) },
      { id: "d3", label: "PAN Card", status: statusForProgress(60) },
      { id: "d4", label: "Degree Certificate", status: statusForProgress(80) },
      { id: "d5", label: "Experience Letter", status: statusForProgress(90) },
    ],
    forms: [
      { id: "f1", label: "Non-Disclosure Agreement (NDA)", status: statusForProgress(35) },
      { id: "f2", label: "Company Policies Acknowledgement", status: statusForProgress(65) },
      { id: "f3", label: "Digital Signature Setup", status: statusForProgress(95) },
    ],
  };
};

interface CandidateProcessProps {
  employeeId: string;
  employeeName: string;
  employeeProgress: number;
}

export function CandidateProcess({ employeeId, employeeName, employeeProgress }: CandidateProcessProps) {
  const [checklist, setChecklist] = useState<CandidateChecklist>(() =>
    generateChecklist(employeeId, employeeProgress)
  );

  // Sync checklist when switching employees
  useEffect(() => {
    setChecklist(generateChecklist(employeeId, employeeProgress));
  }, [employeeId, employeeProgress]);

  const toggleTask = (section: keyof CandidateChecklist, taskId: string) => {
    setChecklist((prev) => {
      const updatedSection = prev[section].map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? ("pending" as const) : ("done" as const) }
          : task
      );
      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  const getSectionStats = (tasks: CandidateTask[]) => {
    const done = tasks.filter((t) => t.status === "done").length;
    return { done, total: tasks.length };
  };

  const renderSection = (title: string, sectionKey: keyof CandidateChecklist, tasks: CandidateTask[]) => {
    const { done, total } = getSectionStats(tasks);
    return (
      <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
          <h5 className="text-[13px] font-black text-foreground uppercase tracking-wider">{title}</h5>
          <span className="text-[11px] font-black text-[#00B87C]">
            {done} / {total} Completed
          </span>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(sectionKey, task.id)}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/40 transition-all text-left group"
            >
              <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                {task.status === "done" ? (
                  <div className="w-5 h-5 rounded-full bg-[#00B87C] flex items-center justify-center border border-[#00B87C]">
                    <Check size={12} className="text-white" />
                  </div>
                ) : (
                  <Circle size={20} className="opacity-60" />
                )}
              </div>
              <span
                className={`text-[12px] font-bold ${
                  task.status === "done" ? "text-muted-foreground line-through opacity-60" : "text-foreground"
                }`}
              >
                {task.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Calculate overall candidate completion progress
  const allTasks = [...checklist.personalDetails, ...checklist.documents, ...checklist.forms];
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "done").length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            Candidate Portal Process
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Simulated view of employee-side dashboard tasks for {employeeName}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[13px] font-black text-[#00B87C] block">{progressPct}% Complete</span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
            Candidate Tasks
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00B87C] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderSection("Personal Details", "personalDetails", checklist.personalDetails)}
          {renderSection("Forms & Signatures", "forms", checklist.forms)}
        </div>
        <div>
          {renderSection("Documents Required", "documents", checklist.documents)}
        </div>
      </div>
    </div>
  );
}
