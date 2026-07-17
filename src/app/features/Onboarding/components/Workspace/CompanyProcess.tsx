import { Check, Send, AlertTriangle, LockKeyhole, Upload, FileText, Eye, Trash2, Paperclip } from "lucide-react";
import type { NewHire, OnboardingPhase } from "../../types/onboarding.types";
import { useAuth } from "../../../../context/AuthContext";
import { showToast } from "../../../../components/workflow/ToastNotification";

interface CompanyProcessProps {
  phases: OnboardingPhase[];
  employee: NewHire;
  handleMarkDone: (phaseId: string, taskId: string) => void;
  handleSendReminder: () => void;
  handleEscalate: () => void;
}

/**
 * Map a task owner/verifier name to the platform roles allowed to act on it.
 * The structure is fully dynamic — tasks are grouped by the role configured
 * on the template, never by a hardcoded HR/IT/Finance/Admin list.
 */
const OWNER_TO_ROLES: Record<string, string[]> = {
  hr: ["HR Manager", "HR"],
  finance: ["Finance", "Finance Manager"],
  it: ["IT", "IT Admin", "IT Manager"],
  admin: ["Admin"],
  manager: ["Manager", "Team Lead", "Engineering Manager"],
};

const rolesForOwner = (owner: string): string[] => {
  const normalized = owner.toLowerCase();
  for (const key of Object.keys(OWNER_TO_ROLES)) {
    if (normalized.includes(key)) return OWNER_TO_ROLES[key];
  }
  // Default: any matching system role plus super admins.
  return [owner];
};

export function CompanyProcess({
  phases,
  employee,
  handleMarkDone,
  handleSendReminder,
  handleEscalate,
}: CompanyProcessProps) {
  const { user } = useAuth();

  const canActOnOwner = (owner: string): boolean => {
    const role = user?.role;
    if (role === "Platform Admin" || role === "Super Admin") return true;
    return rolesForOwner(owner).includes(role || "");
  };

  const handleAttachDocumentToTask = (phaseId: string, taskId: string, docName: string) => {
    try {
      const allPhases = JSON.parse(localStorage.getItem("viyan_onboarding_phases") || "{}");
      const hirePhases = allPhases[employee.id] || [];
      const updatedPhases = hirePhases.map((phase: any) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((t: any) =>
            t.id === taskId
              ? { ...t, documentName: docName, documentUrl: `/documents/${docName}` }
              : t
          ),
        };
      });
      allPhases[employee.id] = updatedPhases;
      localStorage.setItem("viyan_onboarding_phases", JSON.stringify(allPhases));

      const allDocs = JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]");
      const docId = `doc-${employee.id}-task-${taskId}`;
      const existingIdx = allDocs.findIndex((d: any) => d.id === docId);
      
      const docRecord = {
        id: docId,
        employeeId: employee.id,
        name: docName,
        status: "uploaded" as const,
        verificationStatus: "verified" as const,
        mandatory: true,
        maxSize: 5,
        allowedTypes: [".pdf", ".jpg", ".png"],
        needVerification: true,
        visibleToEmployee: true,
        issuedByOrg: true,
        uploadedBy: user?.role || "HR Team",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };

      if (existingIdx !== -1) {
        allDocs[existingIdx] = docRecord;
      } else {
        allDocs.push(docRecord);
      }
      localStorage.setItem("viyan_onboarding_documents", JSON.stringify(allDocs));

      window.dispatchEvent(new Event("viyan:onboarding-updated"));
      window.dispatchEvent(new Event("storage"));

      showToast("Document Attached", "success", `"${docName}" attached to the task and made available to the employee.`);
    } catch (e) {
      console.error(e);
      showToast("Failed to attach document", "error", "Storage operation failed.");
    }
  };

  const handleRemoveDocumentFromTask = (phaseId: string, taskId: string) => {
    try {
      const allPhases = JSON.parse(localStorage.getItem("viyan_onboarding_phases") || "{}");
      const hirePhases = allPhases[employee.id] || [];
      const updatedPhases = hirePhases.map((phase: any) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((t: any) =>
            t.id === taskId
              ? { ...t, documentName: undefined, documentUrl: undefined }
              : t
          ),
        };
      });
      allPhases[employee.id] = updatedPhases;
      localStorage.setItem("viyan_onboarding_phases", JSON.stringify(allPhases));

      const allDocs = JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]");
      const docId = `doc-${employee.id}-task-${taskId}`;
      const updatedDocs = allDocs.filter((d: any) => d.id !== docId);
      localStorage.setItem("viyan_onboarding_documents", JSON.stringify(updatedDocs));

      window.dispatchEvent(new Event("viyan:onboarding-updated"));
      window.dispatchEvent(new Event("storage"));

      showToast("Document Removed", "success", "Attached document removed.");
    } catch (e) {
      console.error(e);
      showToast("Failed to remove document", "error", "Storage operation failed.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, phaseId: string, taskId: string, defaultName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleAttachDocumentToTask(phaseId, taskId, file.name || defaultName);
  };

  const allTasks = phases.flatMap((phase) =>
    phase.tasks.map((task) => ({ ...task, phaseId: phase.id } as any)),
  );

  const canReview = employee.candidateProcessSubmitted === true;
  const reviewMessage =
    "Waiting for the employee to submit their onboarding information.";

  if (allTasks.length === 0) {
    return (
      <div className="p-10 text-center">
        <h4 className="text-sm font-black text-foreground">
          No company process tasks assigned
        </h4>
        <p className="mt-2 text-xs text-muted-foreground">
          The assigned template has no internal tasks configured yet.
        </p>
      </div>
    );
  }

  // Group tasks dynamically by their assigned owner (role/user).
  const owners = Array.from(new Set(allTasks.map((t) => t.owner)));

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
          {allTasks.filter((task) => task.status === "done").length} /{" "}
          {allTasks.length} tasks completed
        </span>
      </div>

      <div className="space-y-6">
        {owners.map((owner) => {
          const tasks = allTasks.filter((task) => task.owner === owner);
          if (!tasks.length) return null;
          const completed = tasks.filter(
            (task) => task.status === "done",
          ).length;
          const editable = canActOnOwner(owner);
          const percent = Math.round((completed / tasks.length) * 100);
          return (
            <section
              key={owner}
              className="p-5 bg-card border border-border rounded-2xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
                <div>
                  <h5 className="text-[14px] font-black text-foreground uppercase tracking-wider">
                    {owner}
                  </h5>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                    Responsible for completing / verifying these tasks
                  </p>
                </div>
                <span className="text-[11px] font-black text-[#00B87C]">
                  {percent}% Done
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div key={task.id} className="space-y-1.5 py-2 px-3 rounded-xl hover:bg-muted/40 transition-all">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={task.status === "done"}
                          onChange={() =>
                            editable && handleMarkDone(task.phaseId, task.id)
                          }
                          disabled={!editable}
                          title={
                            !canActOnOwner(owner)
                              ? `Only ${owner} can complete this task`
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
                          {task.description && (
                            <span className="block text-[10px] font-semibold text-muted-foreground">
                              {task.description}
                            </span>
                          )}
                          <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Verified By:{" "}
                            <span className="text-foreground">
                              {task.verifiedBy || owner}
                            </span>
                            {" · "}
                            Due {task.dueDate}
                            {task.mandatory && " · Mandatory"}
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

                    {/* Inline Document Upload/Attachment Section */}
                    <div className="pl-[30px] flex items-center gap-3">
                      {task.documentName ? (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00B87C]/10 border border-[#00B87C]/20 rounded-lg text-[10px] font-bold text-[#00B87C] uppercase tracking-wider animate-in fade-in zoom-in-95 duration-200">
                          <FileText size={12} className="text-[#00B87C]" />
                          <span className="truncate max-w-[180px]">{task.documentName}</span>
                          <button
                            onClick={() => showToast("Viewing File", "info", `Opening ${task.documentName}...`)}
                            className="hover:text-foreground/80 p-0.5 ml-1 transition-all cursor-pointer"
                            title="View Attached File"
                          >
                            <Eye size={12} />
                          </button>
                          {editable && (
                            <button
                              onClick={() => handleRemoveDocumentFromTask(task.phaseId, task.id)}
                              className="text-red-500 hover:text-red-700 p-0.5 transition-all cursor-pointer"
                              title="Remove Attachment"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ) : (
                        editable && (
                          <>
                            <input
                              type="file"
                              id={`file-upload-${task.id}`}
                              className="hidden"
                              onChange={(e) => handleFileChange(e, task.phaseId, task.id, task.task)}
                            />
                            <label
                              htmlFor={`file-upload-${task.id}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground text-[9px] font-black uppercase tracking-wider border border-border rounded-lg transition-all cursor-pointer"
                            >
                              <Upload size={10} /> Upload Document
                            </label>
                          </>
                        )
                      )}
                    </div>
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
