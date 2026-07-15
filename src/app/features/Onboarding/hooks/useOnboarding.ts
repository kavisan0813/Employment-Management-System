import { useState } from "react";
import type { NewHire, OnboardingPhase, DocumentItem, PhaseTask } from "../types/onboarding.types";
import { safeGet, safeSet, initials, formatDate } from "../utils/helpers";
import { showToast } from "../../../components/workflow/ToastNotification";

// Mock data
import { NEW_HIRES } from "../constants/employees";
import { DEFAULT_PHASES_DATA } from "../constants/phases";
import { DOCUMENTS_DATA } from "../constants/documents";
import { TEMPLATES } from "../constants/templates";

export function useOnboarding() {
  /* ─── Core selection ─── */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "pre-joining" | "completed" | "templates">("pre-joining");
  const [workspaceTab, setWorkspaceTab] = useState<"company" | "candidate" | "documents">("company");

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
  const [formDept, setFormDept] = useState("Engineering");
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

  /* ─── Data ─── */
  const [phasesData, setPhasesData] = useState(DEFAULT_PHASES_DATA);
  const [newHires, setNewHires] = useState(NEW_HIRES);
  const [documents, setDocuments] = useState(DOCUMENTS_DATA);

  /* ─── Computed ─── */
  const selected = newHires.find((n) => n.id === selectedId) || newHires[0] || NEW_HIRES[0];
  const phases = safeGet<OnboardingPhase[]>(phasesData, selected.id) || phasesData.nh1;

  const filteredList = newHires
    .filter((n) => {
      if (activeTab === "active") return n.status !== "pre-joining" && n.status !== "complete";
      if (activeTab === "pre-joining") return n.status === "pre-joining";
      if (activeTab === "completed") return n.status === "complete";
      return true;
    })
    .filter((n) => {
      if (filterPill === "week") return n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12";
      if (filterPill === "month") return n.joiningDate >= "2026-04-01" && n.joiningDate <= "2026-04-30";
      return true;
    })
    .filter(
      (n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const activeCount = newHires.filter((n) => n.status !== "pre-joining" && n.status !== "complete").length;
  const preJoiningCount = newHires.filter((n) => n.status === "pre-joining").length;
  const completedCount = newHires.filter((n) => n.status === "complete").length;
  const overdueTasks = phases.flatMap((p) => p.tasks).filter((t) => t.status === "overdue").length;
  const pendingDocs = documents.filter((d) => d.status === "pending" || d.status === "missing").length;
  const uploadedDocs = documents.filter((d) => d.status === "uploaded").length;
  const joiningThisWeek = newHires.filter((n) => n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12").length;

  /* ─── Progress recalculation helper ─── */
  const recalcProgress = (hireId: string, hirePhases: OnboardingPhase[]) => {
    const completed = hirePhases.flatMap((p) => p.tasks).filter((t) => t.status === "done").length;
    const total = hirePhases.flatMap((p) => p.tasks).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    setNewHires((prev) =>
      prev.map((nh) =>
        nh.id === hireId
          ? { ...nh, progress, status: progress === 100 ? "complete" : nh.status }
          : nh,
      ),
    );
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
              isDone ? "Task marked as pending." : "Task marked as done."
            );
            return { ...t, status: newStatus };
          }
          return t;
        });
      }
      recalcProgress(selectedId, hirePhases);
    }
    setPhasesData(updated);
  };

  const handleSendReminder = () => {
    showToast("Reminder Sent", "success", "Reminder notification sent to IT Team.");
  };

  const handleEscalate = () => setShowEscalateModal(true);

  const handleRequestDoc = (name: string) => {
    setDocuments((prev) => prev.map((d) => (d.name === name ? { ...d, status: "pending" as const } : d)));
    showToast("Request Sent", "success", `Document request for ${name} sent to employee.`);
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
          ? { ...d, status: "uploaded" as const, uploadedBy: "HR Team", date: "Today" }
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
    const newId = `nh${Date.now()}`;
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
    };

    const newPhases: OnboardingPhase[] = [
      {
        id: "p1",
        name: "Pre-Joining",
        status: "in-progress",
        date: "Apr 5, 2026",
        tasks: [
          { id: "t1", task: "Welcome email sent", owner: "HR", dueDate: "Apr 1", status: "pending", assignee: "HR Team" },
          { id: "t2", task: "Offer letter signed", owner: "Employee", dueDate: "Apr 2", status: "pending", assignee: formEmployee },
          { id: "t3", task: "Background verification completed", owner: "HR", dueDate: "Apr 3", status: "pending", assignee: "HR Team" },
        ],
      },
    ];

    setPhasesData((prev) => safeSet(prev, newId, newPhases) as Record<string, OnboardingPhase[]>);
    setNewHires((prev) => [newHire, ...prev]);
    setSelectedId(newId);

    showToast("Onboarding Launched", "success", `Onboarding launched for ${formEmployee}!`);
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
    showToast("Report Downloaded", "success", "Onboarding progress report downloaded.");
  };

  const handleMarkPhaseComplete = () => setShowPhaseConfirm(true);

  const confirmPhaseComplete = () => {
    const updated = { ...phasesData };
    const hirePhases = safeGet<OnboardingPhase[]>(updated, selected.id);
    if (hirePhases) {
      const idx = hirePhases.findIndex((p) => p.status === "in-progress");
      if (idx !== -1) {
        hirePhases[idx] = { ...hirePhases[idx], status: "completed" };
        hirePhases[idx].tasks = hirePhases[idx].tasks.map((t) => ({ ...t, status: "done" as const }));
        if (idx + 1 < hirePhases.length) {
          hirePhases[idx + 1] = { ...hirePhases[idx + 1], status: "in-progress" };
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
    if (id) showToast("Template Duplicated", "success", "Template duplicated successfully.");
    setShowTemplateMenu(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (id) showToast("Template Deleted", "success", "Template deleted.");
    setShowTemplateMenu(null);
  };

  return {
    // Selection
    selectedId, setSelectedId, activeTab, setActiveTab,
    workspaceTab, setWorkspaceTab,
    // Search & filter
    searchQuery, setSearchQuery, filterPill, setFilterPill,
    // Modal visibility
    showInitiateModal, setShowInitiateModal,
    showTemplatesPanel, setShowTemplatesPanel,
    showEscalateModal, setShowEscalateModal,
    showUploadModal, setShowUploadModal,
    showPhaseConfirm, setShowPhaseConfirm,
    showReminderModal, setShowReminderModal,
    showTemplateEditor, setShowTemplateEditor,
    editingTemplate, setEditingTemplate,
    showTemplateMenu, setShowTemplateMenu,
    inlineTaskOpen, setInlineTaskOpen,
    // Initiate form
    initiateStep, setInitiateStep,
    selectedTemplate, setSelectedTemplate,
    formEmployee, setFormEmployee,
    formJoinDate, setFormJoinDate,
    formDept, setFormDept,
    formDesig, setFormDesig,
    formManager, setFormManager,
    formEmpType, setFormEmpType,
    // Document upload
    selectedDocId, uploadDocType, setUploadDocType,
    // Inline task
    inlineTaskText, setInlineTaskText,
    inlineTaskOwner, setInlineTaskOwner,
    inlineTaskDueDate, setInlineTaskDueDate,
    // Data
    newHires, documents,
    // Computed
    selected, phases, filteredList,
    activeCount, preJoiningCount, completedCount,
    overdueTasks, pendingDocs, uploadedDocs, joiningThisWeek,
    // Handlers
    handleUploadDoc, handleAddInlineTask, handleMarkDone,
    handleSendReminder, handleEscalate, handleRequestDoc,
    handleUploadClick, handleConfirmUpload, handleViewDoc,
    handleLaunchOnboarding, handleDownloadReport,
    handleMarkPhaseComplete, confirmPhaseComplete, confirmEscalate,
    handleDuplicateTemplate, handleDeleteTemplate,
  };
}
