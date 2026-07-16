import { useEffect, useState } from "react";
import { Sprout, Calendar, Clock, CheckCircle2, FileText, Check, ShieldCheck, Video, BookOpen, Layers } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { Progress } from "./Progress";
import { PersonalInformation } from "./PersonalInformation";
import { showToast } from "../../../../components/workflow/ToastNotification";

type TabKey = "personal" | "documents" | "forms" | "status";
type AssignedTabKey = "candidate-process" | "documents" | "forms" | "policies" | "training" | "assigned-tasks";

export function EmployeePortal() {
  const { user } = useAuth();
  const userName = user?.name || "Employee";
  const userRole = user?.role === "Employee" ? "Team Member" : (user?.role || "Team Member");
  
  // Track onboarding queue state reactively
  const [queue, setQueue] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("viyan_onboarding_queue") || "[]");
    } catch {
      return [];
    }
  });

  const hire = queue.find((item: { email?: string }) => item.email === user?.email);
  const isTemplateAssigned = !!hire?.assignedTemplateId;

  // Track tasks completed state locally for candidate pre-joining profile
  const [taskState, setTaskState] = useState<Record<string, boolean>>(() => {
    const empty = {
      addr: false,
      emg: false,
      bank: false,
      nominee: false,
      aadhaar: false,
      degree: false,
      pan: false,
      photo: false,
      nda: false,
      policy: false,
      decl: false,
      sig: false,
    };
    try {
      return { ...empty, ...JSON.parse(localStorage.getItem(`viyan_candidate_profile_${user?.email}`) || "{}").taskState };
    } catch {
      return empty;
    }
  });

  const [activeSubTab, setActiveSubTab] = useState<TabKey>("personal");
  const [activeAssignedSubTab, setActiveAssignedSubTab] = useState<AssignedTabKey>("candidate-process");

  // Load phases and documents if template is assigned
  const [phases, setPhases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const syncData = () => {
      try {
        const nextQueue = JSON.parse(localStorage.getItem("viyan_onboarding_queue") || "[]");
        setQueue(nextQueue);

        const currentHire = nextQueue.find((item: { email?: string }) => item.email === user?.email);
        if (currentHire) {
          const allPhases = JSON.parse(localStorage.getItem("viyan_onboarding_phases") || "{}");
          setPhases(allPhases[currentHire.id] || []);

          const allDocs = JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]");
          setDocuments(allDocs.filter((d: any) => d.id.startsWith(`doc-${currentHire.id}-`)));

          setTemplates(JSON.parse(localStorage.getItem("viyan_onboarding_templates") || "[]"));
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncData();
    window.addEventListener("viyan:onboarding-updated", syncData);
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("viyan:onboarding-updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, [user?.email]);

  const matchedTemplate = templates.find((t) => t.id === hire?.assignedTemplateId);

  // Recalculation logic for template-assigned candidate progress
  const updateProgress = (nextPhases: any[], nextDocs: any[], nextProfileChecks?: Record<string, boolean>) => {
    if (!hire) return;
    const finalChecks = nextProfileChecks || taskState;

    // 1. Candidate profile checklist (4 items)
    const profileCompleted = [finalChecks.addr, finalChecks.emg, finalChecks.bank, finalChecks.nominee].filter(Boolean).length;
    const profileTotal = 4;

    // 2. Assigned employee checklist tasks
    const empTasks = nextPhases.flatMap((p) => p.tasks).filter((t) => t.owner === "Employee");
    const empCompleted = empTasks.filter((t) => t.status === "done").length;
    const empTotal = empTasks.length;

    // 3. Uploaded documents
    const docCompleted = nextDocs.filter((d) => d.status === "uploaded").length;
    const docTotal = nextDocs.length;

    // 4. Policies completed
    const policiesList = matchedTemplate?.policies || [];
    const policiesCompleted = (hire.completedPolicies || []).length;
    const policiesTotal = policiesList.length;

    // 5. Training completed
    const trainingList = matchedTemplate?.training || [];
    const trainingCompleted = (hire.completedTraining || []).length;
    const trainingTotal = trainingList.length;

    // 6. Forms completed
    const formsList = matchedTemplate?.forms || [];
    const formsCompleted = (hire.completedForms || []).length;
    const formsTotal = formsList.length;

    const totalItems = profileTotal + empTotal + docTotal + policiesTotal + trainingTotal + formsTotal;
    const completedItems = profileCompleted + empCompleted + docCompleted + policiesCompleted + trainingCompleted + formsCompleted;
    const nextPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Save updated queue progress
    const updatedQueue = queue.map((q) =>
      q.id === hire.id ? { ...q, progress: nextPercent, status: nextPercent === 100 ? "completed" : "on-track" } : q
    );
    setQueue(updatedQueue);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(updatedQueue));
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    const nextState = { ...taskState, [id]: completed };
    setTaskState(nextState);
    if (user?.email) {
      localStorage.setItem(
        `viyan_candidate_profile_${user.email}`,
        JSON.stringify({ taskState: nextState, updatedAt: new Date().toISOString() })
      );
    }

    if (isTemplateAssigned) {
      updateProgress(phases, documents, nextState);
    }
  };

  const handleToggleAssignedTask = (taskId: string) => {
    const nextPhases = phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((task: any) =>
        task.id === taskId ? { ...task, status: task.status === "done" ? "pending" : "done" } : task
      ),
    }));
    setPhases(nextPhases);

    const allPhases = JSON.parse(localStorage.getItem("viyan_onboarding_phases") || "{}");
    allPhases[hire.id] = nextPhases;
    localStorage.setItem("viyan_onboarding_phases", JSON.stringify(allPhases));

    updateProgress(nextPhases, documents);
  };

  const handleAssignedDocUpload = (docId: string) => {
    const nextDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, status: "uploaded", verificationStatus: "pending" } : doc
    );
    setDocuments(nextDocs);

    const allDocs = JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]");
    const updatedAllDocs = allDocs.map((d: any) => {
      const match = nextDocs.find((nd) => nd.id === d.id);
      return match ? match : d;
    });
    localStorage.setItem("viyan_onboarding_documents", JSON.stringify(updatedAllDocs));

    updateProgress(phases, nextDocs);
    showToast("Document Uploaded", "success", "Your file is uploaded and is waiting for HR verification.");
  };

  const handlePolicyAcknowledge = (policyId: string) => {
    const completed = hire.completedPolicies || [];
    if (completed.includes(policyId)) return;
    
    const nextCompleted = [...completed, policyId];
    const updatedQueue = queue.map((q) =>
      q.id === hire.id ? { ...q, completedPolicies: nextCompleted } : q
    );
    setQueue(updatedQueue);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(updatedQueue));

    // Force updates triggers
    setTimeout(() => {
      updateProgress(phases, documents);
      showToast("Policy Reviewed", "success", "Thank you for confirming your policy review.");
    }, 100);
  };

  const handleTrainingComplete = (courseId: string) => {
    const completed = hire.completedTraining || [];
    if (completed.includes(courseId)) return;
    
    const nextCompleted = [...completed, courseId];
    const updatedQueue = queue.map((q) =>
      q.id === hire.id ? { ...q, completedTraining: nextCompleted } : q
    );
    setQueue(updatedQueue);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(updatedQueue));

    // Force updates triggers
    setTimeout(() => {
      updateProgress(phases, documents);
      showToast("Training Completed", "success", "Orientation course completed successfully!");
    }, 100);
  };

  const handleFormSign = (formId: string) => {
    const completed = hire.completedForms || [];
    if (completed.includes(formId)) return;
    
    const nextCompleted = [...completed, formId];
    const updatedQueue = queue.map((q) =>
      q.id === hire.id ? { ...q, completedForms: nextCompleted } : q
    );
    setQueue(updatedQueue);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(updatedQueue));

    // Force updates triggers
    setTimeout(() => {
      updateProgress(phases, documents);
      showToast("Form Signed", "success", "Form has been signed successfully.");
    }, 100);
  };

  const submitCandidateProcess = () => {
    if (!user?.email) return;
    const accounts = JSON.parse(localStorage.getItem("viyan_registered_users") || "[]");
    const account = accounts.find((item: { email: string }) => item.email === user.email);
    
    localStorage.setItem(
      "viyan_registered_users",
      JSON.stringify(
        accounts.map((item: { email: string }) =>
          item.email === user.email ? { ...item, candidateStatus: "Completed" } : item
        )
      )
    );

    const nextQueue = JSON.parse(localStorage.getItem("viyan_onboarding_queue") || "[]");
    if (!nextQueue.some((item: { email?: string }) => item.email === user.email)) {
      const name = user.name;
      localStorage.setItem(
        "viyan_onboarding_queue",
        JSON.stringify([
          {
            id: `onb-${Date.now()}`,
            email: user.email,
            initials: user.initials,
            avatarColor: "#00B87C",
            name,
            role: account?.designation || "Employee",
            dept: account?.department || "Unassigned",
            deptColor: "#00B87C",
            joiningDate: account?.joiningDate || new Date().toISOString().slice(0, 10),
            progress: 0,
            progressColor: "#00B87C",
            status: "pre-joining",
            daysInOnboarding: 0,
            expectedCompletion: "To be scheduled",
            manager: account?.manager || "Unassigned",
            completedPolicies: [],
            completedTraining: [],
          },
          ...nextQueue,
        ])
      );
    } else {
      localStorage.setItem(
        "viyan_onboarding_queue",
        JSON.stringify(
          nextQueue.map((item: { email?: string }) =>
            item.email === user.email
              ? { ...item, candidateProcessSubmitted: true }
              : item,
          ),
        ),
      );
    }
    localStorage.setItem(
      "viyan_candidate_activity_logs",
      JSON.stringify([
        { action: "Candidate process completed", employee: user.name, at: new Date().toISOString() },
        ...JSON.parse(localStorage.getItem("viyan_candidate_activity_logs") || "[]"),
      ])
    );
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
    window.dispatchEvent(new Event("storage"));
    showToast("Profile Complete", "success", "Your candidate details have been sent to HR.");
  };

  // State A: Pre-joining self onboarding portal rendering
  if (!isTemplateAssigned || !hire) {
    const totalChecks = 4;
    const completedChecksCount = [taskState.addr, taskState.emg, taskState.bank, taskState.nominee].filter(Boolean).length;
    const percent = Math.round((completedChecksCount / totalChecks) * 100);

    return (
      <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center border border-[#00B87C]/20">
              <Sprout size={24} className="text-[#00B87C]" />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-foreground tracking-tight">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-[13px] font-bold text-muted-foreground">
                {userRole} — Setup Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-[12px] font-bold text-muted-foreground">
            <Calendar size={14} className="text-[#00B87C]" />
            Joining Date: <span className="text-foreground">{hire?.joiningDate || "Awaiting Setup"}</span>
          </div>
        </div>

        <Progress completedCount={completedChecksCount} totalCount={totalChecks} progressPercent={percent} />
        
        {percent === 100 && (
          <button
            onClick={submitCandidateProcess}
            className="w-full py-3.5 bg-[#00B87C] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow hover:opacity-95 transition-all cursor-pointer"
          >
            Submit Candidate Process
          </button>
        )}

        <div className="flex border-b border-border bg-muted/10 px-4 rounded-xl overflow-x-auto scrollbar-hide shrink-0 gap-2">
          {([
            { key: "personal", label: "Personal Information" },
            { key: "status", label: "Verification Status" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`px-4 py-3.5 text-[12px] font-black uppercase tracking-wider border-b-2 transition-all relative whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.key
                  ? "border-[#00B87C] text-[#00B87C]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeSubTab === "personal" && <PersonalInformation onToggle={handleToggleTask} taskState={taskState} />}
          {activeSubTab === "status" && (
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-6">
              <div className="pb-2 border-b border-border">
                <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Verification Status</h4>
              </div>
              <div className="flex items-start gap-4 p-5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl">
                <Clock size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[14px] font-black text-foreground">Awaiting HR Template Assignment</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Once you complete your setup details and HR assigns an onboarding template, your active workflow checklists, policies, and orientations will unlock here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // State B: Active Onboarding dashboard (template assigned)
  const employeeOwnedTasks = phases.flatMap((p) => p.tasks).filter((t) => t.owner === "Employee");
  const completedProfileChecks = [taskState.addr, taskState.emg, taskState.bank, taskState.nominee].filter(Boolean).length;
  
  const totalOnbItems = 4 + employeeOwnedTasks.length + documents.length + (matchedTemplate?.policies?.length || 0) + (matchedTemplate?.training?.length || 0);
  const completedOnbItems = completedProfileChecks + employeeOwnedTasks.filter((t) => t.status === "done").length + documents.filter((d) => d.status === "uploaded").length + (hire.completedPolicies || []).length + (hire.completedTraining || []).length;
  const currentProgressPercent = totalOnbItems > 0 ? Math.round((completedOnbItems / totalOnbItems) * 100) : 0;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center border border-[#00B87C]/20">
            <Sprout size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-foreground tracking-tight">
              My Onboarding Portal
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground">
              {hire.role} — {hire.dept} Onboarding (v{matchedTemplate?.version || 1})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-[12px] font-bold text-muted-foreground">
          <Calendar size={14} className="text-[#00B87C]" />
          Joining Date: <span className="text-foreground">{hire.joiningDate}</span>
        </div>
      </div>

      {/* DYNAMIC PROGRESS BAR */}
      <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-foreground">Onboarding Progress</h3>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">
              Complete your profile information, upload required documents, read policy items, and view orientation media.
            </p>
          </div>
          <span className="text-[20px] font-black text-[#00B87C]">
            {currentProgressPercent}% Complete
          </span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00B87C] rounded-full transition-all duration-500"
            style={{ width: `${currentProgressPercent}%` }}
          />
        </div>
      </div>

      {/* PORTAL ASSIGNED TABS */}
      <div className="flex border-b border-border bg-muted/10 px-4 rounded-xl overflow-x-auto scrollbar-hide shrink-0 gap-2">
        {([
          { key: "candidate-process", label: "Candidate Setup" },
          { key: "documents", label: `Required Files (${documents.filter((d) => d.status !== "uploaded").length})` },
          { key: "forms", label: `Forms (${(matchedTemplate?.forms || []).length - (hire.completedForms || []).length})` },
          { key: "policies", label: `Policies (${(matchedTemplate?.policies || []).length - (hire.completedPolicies || []).length})` },
          { key: "training", label: `Training (${(matchedTemplate?.training || []).length - (hire.completedTraining || []).length})` },
          { key: "assigned-tasks", label: `My Handovers (${employeeOwnedTasks.filter((t) => t.status !== "done").length})` },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveAssignedSubTab(tab.key)}
            className={`px-4 py-3.5 text-[12px] font-black uppercase tracking-wider border-b-2 transition-all relative whitespace-nowrap cursor-pointer ${
              activeAssignedSubTab === tab.key
                ? "border-[#00B87C] text-[#00B87C]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* SUBTAB 1: SETUP */}
        {activeAssignedSubTab === "candidate-process" && (
          <div className="space-y-4">
            <PersonalInformation onToggle={handleToggleTask} taskState={taskState} />
            {completedProfileChecks === 4 && !hire.candidateProcessSubmitted && (
              <button
                onClick={submitCandidateProcess}
                className="w-full py-3.5 bg-[#00B87C] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow hover:opacity-95 transition-all cursor-pointer"
              >
                Submit Candidate Information for Review
              </button>
            )}
            {hire.candidateProcessSubmitted && (
              <p className="text-xs font-bold text-[#00B87C] text-center">Candidate information submitted for department review.</p>
            )}
          </div>
        )}

        {/* SUBTAB FOR FORMS */}
        {activeAssignedSubTab === "forms" && (
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-black text-foreground">Required Forms & Agreements</h4>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Please review and digitally sign the allocated forms</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(matchedTemplate?.forms || []).map((form: any) => {
                const complete = (hire.completedForms || []).includes(form.id);
                return (
                  <div key={form.id} className="p-5 border rounded-2xl bg-muted/10 space-y-4 flex flex-col justify-between">
                    <div>
                      <FileText className="text-[#F59E0B] mb-2" size={24} />
                      <strong className="text-xs text-foreground block">{form.name}</strong>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-muted text-muted-foreground rounded inline-block mt-1">
                        {form.required ? "Required" : "Optional"}
                      </span>
                    </div>
                    {complete ? (
                      <span className="text-xs text-emerald-600 font-bold block">✓ Signed & Submitted</span>
                    ) : (
                      <button
                        onClick={() => handleFormSign(form.id)}
                        className="py-2 w-full text-center bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer"
                      >
                        Sign & Submit
                      </button>
                    )}
                  </div>
                );
              })}
              {(matchedTemplate?.forms || []).length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6 col-span-2">No required forms or agreements.</p>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: REQUIRED FILES */}
        {activeAssignedSubTab === "documents" && (
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-black text-foreground">Documents for Verification</h4>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Please upload formal files for HR review</p>
            </div>
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.id} className="py-4 flex items-center justify-between flex-wrap gap-4 first:pt-0 last:pb-0">
                  <div>
                    <strong className="text-xs text-foreground block">{doc.name}</strong>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                      Mandatory: {doc.mandatory ? "Yes" : "No"} · Max Size: {doc.maxSize || "10MB"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      doc.status === "uploaded" ? "bg-emerald-50 text-[#00B87C] border border-[#00B87C]/15" : "bg-muted text-muted-foreground"
                    }`}>
                      {doc.status === "uploaded" ? `${doc.verificationStatus || "uploaded"}` : "pending"}
                    </span>
                    {doc.status !== "uploaded" ? (
                      <button
                        onClick={() => handleAssignedDocUpload(doc.id)}
                        className="px-4 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                      >
                        Upload file
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground font-bold">Done ✓</span>
                    )}
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6">No required document uploads configured.</p>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: POLICIES */}
        {activeAssignedSubTab === "policies" && (
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-black text-foreground">Company Policies & Frameworks</h4>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Please read, review, and acknowledge each policy document</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(matchedTemplate?.policies || []).map((policy: any) => {
                const acknowledged = (hire.completedPolicies || []).includes(policy.id);
                return (
                  <div key={policy.id} className="p-5 border rounded-2xl bg-muted/10 space-y-4 flex flex-col justify-between">
                    <div>
                      <ShieldCheck className="text-[#00B87C] mb-2" size={24} />
                      <strong className="text-xs text-foreground block">{policy.name}</strong>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-relaxed">{policy.description}</p>
                    </div>
                    {acknowledged ? (
                      <span className="text-xs text-emerald-600 font-bold block">✓ Acknowledged</span>
                    ) : (
                      <button
                        onClick={() => handlePolicyAcknowledge(policy.id)}
                        className="py-2 w-full text-center bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer"
                      >
                        Acknowledge Policy
                      </button>
                    )}
                  </div>
                );
              })}
              {(matchedTemplate?.policies || []).length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6 col-span-2">No policy review items assigned.</p>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: ORIENTATION/TRAINING */}
        {activeAssignedSubTab === "training" && (
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-black text-foreground">Welcome Orientations & Training</h4>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Complete allocated orientation streams and webinars</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(matchedTemplate?.training || []).map((course: any) => {
                const complete = (hire.completedTraining || []).includes(course.id);
                return (
                  <div key={course.id} className="p-5 border rounded-2xl bg-muted/10 space-y-4 flex flex-col justify-between">
                    <div>
                      {course.type === "Video" ? (
                        <Video className="text-[#0EA5E9] mb-2" size={24} />
                      ) : (
                        <BookOpen className="text-[#8B5CF6] mb-2" size={24} />
                      )}
                      <strong className="text-xs text-foreground block">{course.name}</strong>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-muted text-muted-foreground rounded inline-block mt-1">
                        {course.type} ({course.duration || "10 mins"})
                      </span>
                    </div>
                    {complete ? (
                      <span className="text-xs text-emerald-600 font-bold block">✓ Completed</span>
                    ) : (
                      <button
                        onClick={() => handleTrainingComplete(course.id)}
                        className="py-2 w-full text-center bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                );
              })}
              {(matchedTemplate?.training || []).length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6 col-span-2">No orientation or training configured.</p>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 5: MY CHECKLIST TASKS */}
        {activeAssignedSubTab === "assigned-tasks" && (
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-black text-foreground">My Allocated Onboarding Checklist</h4>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Check off task objectives allocated specifically to you</p>
            </div>
            <div className="divide-y divide-border">
              {employeeOwnedTasks.map((task) => (
                <div key={task.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => handleToggleAssignedTask(task.id)}
                    className="h-4.5 w-4.5 rounded border-border text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.task}
                    </p>
                    {task.description && (
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{task.description}</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-muted text-muted-foreground">
                    Due: {task.dueDate}
                  </span>
                </div>
              ))}
              {employeeOwnedTasks.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6">No onboarding tasks configured for employee action.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
