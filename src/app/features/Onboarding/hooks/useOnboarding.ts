import { useEffect, useState } from "react";
import type {
  NewHire,
  OnboardingPhase,
  DocumentItem,
  PhaseTask,
  Template,
} from "../types/onboarding.types";
import { safeGet, safeSet, initials, formatDate } from "../utils/helpers";
import { showToast } from "../../../components/workflow/ToastNotification";

import { ROLE_TEMPLATES } from "../../../shared/permission-engine/roles";
import { INITIAL_DEPARTMENTS } from "../../Department/constants/department.constants";
import { DEFAULT_ONBOARDING_TEMPLATES } from "../constants/defaultOnboardingTemplate";
import { ONBOARDING_MOCK_TEMPLATES } from "../constants/mockTemplates";

const readStore = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};

export function useOnboarding() {
  /* ─── Core selection ─── */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "active" | "pre-joining" | "completed" | "templates"
  >("pre-joining");
  const [workspaceTab, setWorkspaceTab] = useState<
    "company" | "candidate" | "documents"
  >("company");

  /* ─── Search & Filter ─── */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPill, setFilterPill] = useState<"all" | "week" | "month">("all");

  /* ─── Modal visibility ─── */
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhaseConfirm, setShowPhaseConfirm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState<string | null>(null);
  const [inlineTaskOpen, setInlineTaskOpen] = useState(false);

  /* ─── Initiate form ─── */
  const [initiateStep, setInitiateStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formEmployee, setFormEmployee] = useState("");
  const [formJoinDate, setFormJoinDate] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formDesig, setFormDesig] = useState("");
  const [formManager, setFormManager] = useState("");
  const [formEmpType, setFormEmpType] = useState("Full-time");

  /* ─── Document upload ─── */
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [uploadDocType, setUploadDocType] = useState("Experience Letter");

  /* ─── Inline task ─── */
  const [inlineTaskText, setInlineTaskText] = useState("");
  const [inlineTaskOwner, setInlineTaskOwner] = useState("HR");
  const [inlineTaskDueDate, setInlineTaskDueDate] = useState("");

  /* Templates are intentionally unseeded. This storage shape is backend-ready
     and is the single source for the dashboard, assignment flow and portals. */
  const [templates, setTemplates] = useState<Template[]>(() =>
    readStore<Template[]>(
      "viyan_onboarding_templates",
      DEFAULT_ONBOARDING_TEMPLATES,
    ),
  );
  const [departments, setDepartments] = useState(() => {
    const list = readStore<Array<{ name?: string }>>("viyan_departments", []);
    const source = list.length > 0 ? list : INITIAL_DEPARTMENTS;
    return source.map((department) => department.name || "").filter(Boolean);
  });
  const taskOwners = Object.values(ROLE_TEMPLATES)
    .filter((role) => role.isSystemRole)
    .map((role) => role.name);

  /* ─── Data ─── */
  const [phasesData, setPhasesData] = useState(() =>
    readStore<Record<string, OnboardingPhase[]>>("viyan_onboarding_phases", {}),
  );
  // The queue has no seed data: an employee account + joining date must create it.
  const [newHires, setNewHires] = useState<NewHire[]>(() =>
    readStore<NewHire[]>("viyan_onboarding_queue", []),
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    readStore<DocumentItem[]>("viyan_onboarding_documents", []),
  );

  useEffect(() => {
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(newHires));
  }, [newHires]);
  useEffect(() => {
    localStorage.setItem("viyan_onboarding_phases", JSON.stringify(phasesData));
  }, [phasesData]);
  useEffect(() => {
    localStorage.setItem(
      "viyan_onboarding_documents",
      JSON.stringify(documents),
    );
  }, [documents]);
  useEffect(() => {
    localStorage.setItem(
      "viyan_onboarding_templates",
      JSON.stringify(templates),
    );
  }, [templates]);
  useEffect(() => {
    const syncWorkflow = (event: StorageEvent | Event) => {
      if (
        event instanceof StorageEvent &&
        event.key &&
        ![
          "viyan_onboarding_queue",
          "viyan_onboarding_phases",
          "viyan_onboarding_documents",
          "viyan_onboarding_templates",
          "viyan_departments",
        ].includes(event.key)
      )
        return;
      setNewHires(readStore<NewHire[]>("viyan_onboarding_queue", []));
      setPhasesData(
        readStore<Record<string, OnboardingPhase[]>>(
          "viyan_onboarding_phases",
          {},
        ),
      );
      setDocuments(readStore<DocumentItem[]>("viyan_onboarding_documents", []));
      setTemplates(
        readStore<Template[]>(
          "viyan_onboarding_templates",
          DEFAULT_ONBOARDING_TEMPLATES,
        ),
      );
      const savedDepts = readStore<Array<{ name?: string }>>(
        "viyan_departments",
        [],
      );
      const source = savedDepts.length > 0 ? savedDepts : INITIAL_DEPARTMENTS;
      setDepartments(
        source.map((department) => department.name || "").filter(Boolean),
      );
    };
    window.addEventListener("storage", syncWorkflow);
    window.addEventListener("viyan:onboarding-updated", syncWorkflow);
    return () => {
      window.removeEventListener("storage", syncWorkflow);
      window.removeEventListener("viyan:onboarding-updated", syncWorkflow);
    };
  }, []);

  /* ─── Computed ─── */
  const selected = newHires.find((n) => n.id === selectedId) || newHires[0];
  const phases = selected
    ? safeGet<OnboardingPhase[]>(phasesData, selected.id) || []
    : [];

  const filteredList = newHires
    .filter((n) => {
      if (activeTab === "active")
        return n.status !== "pre-joining" && n.status !== "complete";
      if (activeTab === "pre-joining") return n.status === "pre-joining";
      if (activeTab === "completed") return n.status === "complete";
      return true;
    })
    .filter((n) => {
      if (filterPill === "week")
        return n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12";
      if (filterPill === "month")
        return n.joiningDate >= "2026-04-01" && n.joiningDate <= "2026-04-30";
      return true;
    })
    .filter(
      (n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const activeCount = newHires.filter(
    (n) => n.status !== "pre-joining" && n.status !== "complete",
  ).length;
  const preJoiningCount = newHires.filter(
    (n) => n.status === "pre-joining",
  ).length;
  const completedCount = newHires.filter((n) => n.status === "complete").length;
  const overdueTasks = phases
    .flatMap((p) => p.tasks)
    .filter((t) => t.status === "overdue").length;
  const pendingDocs = documents.filter(
    (d) => d.status === "pending" || d.status === "missing",
  ).length;
  const uploadedDocs = documents.filter((d) => d.status === "uploaded").length;
  const joiningThisWeek = newHires.filter(
    (n) => n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12",
  ).length;

  /* ─── Progress recalculation helper ─── */
  const recalcProgress = (hireId: string, hirePhases: OnboardingPhase[]) => {
    const completed = hirePhases
      .flatMap((p) => p.tasks)
      .filter((t) => t.status === "done").length;
    const total = hirePhases.flatMap((p) => p.tasks).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const next = newHires.map((nh) =>
      nh.id === hireId
        ? { ...nh, progress, status: progress === 100 ? "complete" : nh.status }
        : nh,
    );
    setNewHires(next);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(next));
  };

  /* ─── Handlers ─── */
  const handleUploadDoc = () => {
    setSelectedDocId(null);
    setUploadDocType("Experience Letter");
    setShowUploadModal(true);
  };

  const handleAddInlineTask = () => {
    if (!selectedId) return;
    if (!inlineTaskText.trim()) {
      showToast("Error", "error", "Task description cannot be empty.");
      return;
    }
    const updated = { ...phasesData };
    const hirePhases = safeGet<OnboardingPhase[]>(updated, selectedId);
    if (hirePhases) {
      let phase = hirePhases.find((p) => p.status === "in-progress");
      if (!phase && hirePhases.length > 0) phase = hirePhases[0];
      if (phase) {
        const newTask: PhaseTask = {
          id: `t${Date.now()}`,
          task: inlineTaskText,
          owner: inlineTaskOwner,
          dueDate: inlineTaskDueDate || "Today",
          status: "pending",
          assignee:
            inlineTaskOwner === "Employee"
              ? newHires.find((n) => n.id === selectedId)?.name || "Employee"
              : `${inlineTaskOwner} Team`,
        };
        phase.tasks = [...phase.tasks, newTask];
        recalcProgress(selectedId, hirePhases);
      }
    }
    setPhasesData(updated);
    showToast("Task Added", "success", "New task has been added.");
    setInlineTaskText("");
    setInlineTaskOpen(false);
  };

  const handleMarkDone = (phaseId: string, taskId: string) => {
    if (!selectedId) return;
    const updated = { ...phasesData };
    const hirePhases = safeGet<OnboardingPhase[]>(updated, selectedId);
    if (hirePhases) {
      const phase = hirePhases.find((p) => p.id === phaseId);
      if (phase) {
        phase.tasks = phase.tasks.map((t) => {
          if (t.id === taskId) {
            const isDone = t.status === "done";
            const newStatus = isDone ? ("pending" as const) : ("done" as const);
            showToast(
              isDone ? "Task Reopened" : "Task Completed",
              "success",
              isDone ? "Task marked as pending." : "Task marked as done.",
            );
            return { ...t, status: newStatus };
          }
          return t;
        });
      }
      recalcProgress(selectedId, hirePhases);
    }
    setPhasesData(updated);
    localStorage.setItem("viyan_onboarding_phases", JSON.stringify(updated));
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
  };

  const handleSendReminder = () => {
    showToast(
      "Reminder Sent",
      "success",
      "Reminder notification sent to IT Team.",
    );
  };

  const handleEscalate = () => setShowEscalateModal(true);

  const handleRequestDoc = (name: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.name === name ? { ...d, status: "pending" as const } : d,
      ),
    );
    showToast(
      "Request Sent",
      "success",
      `Document request for ${name} sent to employee.`,
    );
  };

  const handleUploadClick = (docId: string, docName: string) => {
    setSelectedDocId(docId);
    setUploadDocType(docName);
    setShowUploadModal(true);
  };

  const handleConfirmUpload = () => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === selectedDocId || d.name === uploadDocType
          ? {
              ...d,
              status: "uploaded" as const,
              uploadedBy: "HR Team",
              date: "Today",
            }
          : d,
      ),
    );
    showToast("Uploaded", "success", "Document uploaded successfully.");
    setShowUploadModal(false);
    setSelectedDocId(null);
  };

  const handleViewDoc = (name: string) => {
    showToast("Viewing Document", "info", `Opening ${name}...`);
  };

  const handleLaunchOnboarding = () => {
    if (!formEmployee.trim()) {
      showToast("Error", "error", "Please select or enter an employee name.");
      return;
    }
    const assignedTemplate = templates.find(
      (template) =>
        template.id === selectedTemplate &&
        template.status === "active" &&
        template.dept === formDept,
    );
    if (!assignedTemplate) {
      showToast(
        "Template required",
        "error",
        "Select an active template that matches the employee's department.",
      );
      return;
    }
    const newId = `nh${Date.now()}`;
    const resolvedEmail = (() => {
      const users = JSON.parse(
        localStorage.getItem("viyan_registered_users") || "[]",
      );
      const match = users.find(
        (u: any) => u.name.toLowerCase() === formEmployee.toLowerCase(),
      );
      return (
        match?.email ||
        `${formEmployee.toLowerCase().replace(/\s+/g, ".")}@viyanhr.com`
      );
    })();

    const newHire: NewHire = {
      id: newId,
      initials: initials(formEmployee),
      avatarColor: "#8B5CF6",
      name: formEmployee,
      role: formDesig || "Software Engineer",
      dept: formDept,
      deptColor: "#00B87C",
      joiningDate: formJoinDate || new Date().toISOString().split("T")[0],
      progress: 0,
      progressColor: "#00B87C",
      status: "pre-joining",
      daysInOnboarding: 0,
      expectedCompletion: "Apr 29, 2026",
      manager: formManager || "Arun Nair",
      assignedTemplateId: selectedTemplate || undefined,
      email: resolvedEmail,
    };

    const newPhases: OnboardingPhase[] = (assignedTemplate.sections || []).map(
      (section, index) => ({
        id: `phase-${newId}-${section.id}`,
        name: section.name,
        status: index === 0 ? "in-progress" : "upcoming",
        date: formJoinDate || new Date().toISOString().split("T")[0],
        tasks: section.tasks.map((task) => ({
          id: `task-${newId}-${task.id}`,
          task: task.name,
          owner: task.owner,
          dueDate: "To be scheduled",
          status: "pending",
          assignee: task.owner === "Employee" ? formEmployee : task.owner,
        })),
      }),
    );

    // Generate required documents from the template
    const generatedDocs: DocumentItem[] = (
      assignedTemplate.documents || []
    ).map((doc) => ({
      id: `doc-${newId}-${doc.id}`,
      employeeId: newId,
      name: doc.name,
      status: "pending",
      mandatory: doc.mandatory,
      maxSize: doc.maxSize,
      allowedTypes: doc.allowedTypes,
      needVerification: doc.needVerification,
      visibleToEmployee: doc.visibleToEmployee,
    }));

    // Save phases and documents to state and localStorage
    const updatedPhasesData = safeSet(phasesData, newId, newPhases) as Record<
      string,
      OnboardingPhase[]
    >;
    setPhasesData(updatedPhasesData);
    localStorage.setItem(
      "viyan_onboarding_phases",
      JSON.stringify(updatedPhasesData),
    );

    const allDocs = readStore<DocumentItem[]>("viyan_onboarding_documents", []);
    const mergedDocs = [...allDocs, ...generatedDocs];
    setDocuments(mergedDocs);
    localStorage.setItem(
      "viyan_onboarding_documents",
      JSON.stringify(mergedDocs),
    );

    const updatedQueue = [newHire, ...newHires];
    setNewHires(updatedQueue);
    localStorage.setItem(
      "viyan_onboarding_queue",
      JSON.stringify(updatedQueue),
    );

    window.dispatchEvent(new Event("viyan:onboarding-updated"));
    setSelectedId(newId);

    showToast(
      "Onboarding Launched",
      "success",
      `Onboarding launched for ${formEmployee}!`,
    );
    setShowInitiateModal(false);
    setInitiateStep(1);
    setFormEmployee("");
    setFormDesig("");
    setFormManager("");
    setFormJoinDate("");
    setFormEmpType("Full-time");
  };

  const handleDownloadReport = () => {
    const content = `Onboarding Progress Report - ${selected.name}\nRole: ${selected.role}\nDepartment: ${selected.dept}\nJoining: ${formatDate(selected.joiningDate)}\nProgress: ${selected.progress}%\n\nPhases:\n${phases.map((p) => `${p.name} (${p.status}) - ${p.tasks.filter((t) => t.status === "done").length}/${p.tasks.length} tasks`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Onboarding_${selected.name.replace(" ", "_")}.txt`;
    a.click();
    showToast(
      "Report Downloaded",
      "success",
      "Onboarding progress report downloaded.",
    );
  };

  const handleMarkPhaseComplete = () => setShowPhaseConfirm(true);

  const confirmPhaseComplete = () => {
    const updated = { ...phasesData };
    const hirePhases = safeGet<OnboardingPhase[]>(updated, selected.id);
    if (hirePhases) {
      const idx = hirePhases.findIndex((p) => p.status === "in-progress");
      if (idx !== -1) {
        hirePhases[idx] = { ...hirePhases[idx], status: "completed" };
        hirePhases[idx].tasks = hirePhases[idx].tasks.map((t) => ({
          ...t,
          status: "done" as const,
        }));
        if (idx + 1 < hirePhases.length) {
          hirePhases[idx + 1] = {
            ...hirePhases[idx + 1],
            status: "in-progress",
          };
        }
      }
      recalcProgress(selected.id, hirePhases);
    }
    setPhasesData(updated);
    showToast("Phase Completed", "success", "Phase marked as complete.");
    setShowPhaseConfirm(false);
  };

  const confirmEscalate = () => {
    showToast("Escalated", "warning", "Issue has been escalated to Admin.");
    setShowEscalateModal(false);
  };

  const handleDuplicateTemplate = (id: string) => {
    const source = templates.find((template) => template.id === id);
    if (source) {
      setTemplates((current) => [
        ...current,
        {
          ...source,
          id: `tpl-${Date.now()}`,
          name: `${source.name} (Copy)`,
          status: "draft",
          usageCount: 0,
          version: 1,
        },
      ]);
      showToast(
        "Template Duplicated",
        "success",
        "Template duplicated as a draft.",
      );
    }
    setShowTemplateMenu(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((current) => current.filter((template) => template.id !== id));
    showToast("Template Deleted", "success", "Template deleted.");
    setShowTemplateMenu(null);
  };

  const handleAssignTemplate = (employeeId: string, templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) {
      showToast(
        "Template not found",
        "error",
        "The selected template could not be loaded.",
      );
      return;
    }
    const emp = newHires.find((h) => h.id === employeeId);
    if (!emp) return;

    // Generate phases from sections
    const generatedPhases: OnboardingPhase[] = (tpl.sections || []).map(
      (sec, idx) => ({
        id: `phase-${employeeId}-${sec.id}`,
        name: sec.name,
        status: idx === 0 ? "in-progress" : "upcoming",
        date: emp.joiningDate,
        tasks: sec.tasks.map((task) => ({
          id: `task-${employeeId}-${task.id}`,
          task: task.name,
          owner: task.owner,
          dueDate: `Within ${task.dueDays || 3} days`,
          status: "pending",
          assignee: task.owner === "Employee" ? emp.name : `${task.owner} Team`,
          priority: (task.priority as any) || "Medium",
          mandatory: task.mandatory,
          description: task.description,
        })),
      }),
    );

    // Generate documents list
    const generatedDocs: DocumentItem[] = (tpl.documents || []).map((doc) => ({
      id: `doc-${employeeId}-${doc.id}`,
      employeeId,
      name: doc.name,
      status: "pending",
      mandatory: doc.mandatory,
      maxSize: doc.maxSize,
      allowedTypes: doc.allowedTypes,
      needVerification: doc.needVerification,
      visibleToEmployee: doc.visibleToEmployee,
    }));

    // Save back to localStorage
    const updatedPhases = { ...phasesData, [employeeId]: generatedPhases };
    setPhasesData(updatedPhases);
    localStorage.setItem(
      "viyan_onboarding_phases",
      JSON.stringify(updatedPhases),
    );

    // Append to viyan_onboarding_documents list
    const allDocs = readStore<DocumentItem[]>("viyan_onboarding_documents", []);
    const mergedDocs = [...allDocs, ...generatedDocs];
    setDocuments(mergedDocs);
    localStorage.setItem(
      "viyan_onboarding_documents",
      JSON.stringify(mergedDocs),
    );

    // Update employee template link and email
    const updatedQueue = newHires.map((nh) =>
      nh.id === employeeId
        ? {
            ...nh,
            assignedTemplateId: templateId,
            status: "on-track" as const,
            email:
              nh.email ||
              (() => {
                const users = JSON.parse(
                  localStorage.getItem("viyan_registered_users") || "[]",
                );
                const match = users.find(
                  (u: any) => u.name.toLowerCase() === nh.name.toLowerCase(),
                );
                return (
                  match?.email ||
                  `${nh.name.toLowerCase().replace(/\s+/g, ".")}@viyanhr.com`
                );
              })(),
          }
        : nh,
    );
    setNewHires(updatedQueue);
    localStorage.setItem(
      "viyan_onboarding_queue",
      JSON.stringify(updatedQueue),
    );

    showToast(
      "Template Assigned",
      "success",
      `Successfully assigned ${tpl.name} to ${emp.name}!`,
    );
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
  };

  const saveTemplate = (template: Template) => {
    setTemplates((current) => {
      const existing = current.find((item) => item.id === template.id);
      return existing
        ? current.map((item) =>
            item.id === template.id
              ? { ...template, version: (item.version || 1) + 1 }
              : item,
          )
        : [
            ...current,
            { ...template, id: `tpl-${Date.now()}`, version: 1, usageCount: 0 },
          ];
    });
    showToast(
      "Template Saved",
      "success",
      "The template is ready for assignment.",
    );
  };

  return {
    handleAssignTemplate,
    // Selection
    selectedId,
    setSelectedId,
    activeTab,
    setActiveTab,
    workspaceTab,
    setWorkspaceTab,
    // Search & filter
    searchQuery,
    setSearchQuery,
    filterPill,
    setFilterPill,
    // Modal visibility
    showInitiateModal,
    setShowInitiateModal,
    showTemplatesPanel,
    setShowTemplatesPanel,
    showEscalateModal,
    setShowEscalateModal,
    showUploadModal,
    setShowUploadModal,
    showPhaseConfirm,
    setShowPhaseConfirm,
    showReminderModal,
    setShowReminderModal,
    showTemplateEditor,
    setShowTemplateEditor,
    editingTemplate,
    setEditingTemplate,
    showTemplateMenu,
    setShowTemplateMenu,
    inlineTaskOpen,
    setInlineTaskOpen,
    // Initiate form
    initiateStep,
    setInitiateStep,
    selectedTemplate,
    setSelectedTemplate,
    formEmployee,
    setFormEmployee,
    formJoinDate,
    setFormJoinDate,
    formDept,
    setFormDept,
    formDesig,
    setFormDesig,
    formManager,
    setFormManager,
    formEmpType,
    setFormEmpType,
    // Document upload
    selectedDocId,
    uploadDocType,
    setUploadDocType,
    // Inline task
    inlineTaskText,
    setInlineTaskText,
    inlineTaskOwner,
    setInlineTaskOwner,
    inlineTaskDueDate,
    setInlineTaskDueDate,
    // Data
    newHires,
    documents,
    templates,
    departments,
    taskOwners,
    // Computed
    selected,
    phases,
    filteredList,
    activeCount,
    preJoiningCount,
    completedCount,
    overdueTasks,
    pendingDocs,
    uploadedDocs,
    joiningThisWeek,
    // Handlers
    handleUploadDoc,
    handleAddInlineTask,
    handleMarkDone,
    handleSendReminder,
    handleEscalate,
    handleRequestDoc,
    handleUploadClick,
    handleConfirmUpload,
    handleViewDoc,
    handleLaunchOnboarding,
    handleDownloadReport,
    handleMarkPhaseComplete,
    confirmPhaseComplete,
    confirmEscalate,
    handleDuplicateTemplate,
    handleDeleteTemplate,
    saveTemplate,
  };
}
