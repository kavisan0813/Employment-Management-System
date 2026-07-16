import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import { ExitEmployee, ExitType, OffboardingTemplate } from "../types/offboarding.types";
import { createOffboardingRecord, getExitDocuments, OFFBOARDING_EXITS_KEY, OFFBOARDING_UPDATED_EVENT, persistOffboardingRecord, verifyExitDocument } from "../services/offboardingWorkflow";
import { OFFBOARDING_MOCK_TEMPLATES } from "../constants/mockTemplates";

const withSharedDocuments = (exit: ExitEmployee): ExitEmployee => {
  const employeeDocuments = getExitDocuments(exit.name);
  const generatedDocuments = exit.documents.filter((document) => document.source !== "employee_exit");
  return { ...exit, documents: [...employeeDocuments, ...generatedDocuments] };
};

export function useOffboarding() {
  const { user } = useAuth();
  const [exits, setExits] = useState<ExitEmployee[]>(() => {
    const saved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(withSharedDocuments);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [templates, setTemplates] = useState<OffboardingTemplate[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("viyan_offboarding_templates") || "[]") as OffboardingTemplate[];
      return saved.length ? saved : OFFBOARDING_MOCK_TEMPLATES;
    } catch {
      return [];
    }
  });

  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(exits));
  }, [exits]);

  useEffect(() => {
    const refresh = () => {
      const saved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
      if (saved) {
        try { setExits(JSON.parse(saved).map(withSharedDocuments)); } catch { /* keep last valid state */ }
      }
      try {
        const savedTemplates = JSON.parse(localStorage.getItem("viyan_offboarding_templates") || "[]") as OffboardingTemplate[];
        setTemplates(savedTemplates.length ? savedTemplates : OFFBOARDING_MOCK_TEMPLATES);
      } catch {
        // ignore
      }
    };
    window.addEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const activeExits = exits.filter((e) => e.progress < 100);
  const completedExits = exits.filter((e) => e.progress === 100);
  const scheduledExits = exits.filter((e) => e.progress < 30 && e.progress > 0);

  const stats = {
    activeExits: activeExits.length,
    completedThisMonth: completedExits.length,
    pendingFF: exits.filter(
      (e) =>
        e.ffStatus === "Awaiting Finance Clearance" || e.ffStatus === "Pending",
    ).length,
    assetsPending: exits.filter((e) =>
      e.assets.some((a) => a.status === "pending"),
    ).length,
    docsPending: exits.filter((e) =>
      e.documents.some(
        (d) => d.status === "pending" || d.status === "not_generated",
      ),
    ).length,
    interviewsDone: `${exits.filter((e) => e.interviewDone).length}/${exits.length}`,
  };

  const handleExportCSV = () => {
    const content = `Offboarding Report\nName,Designation,Department,LWD,Progress,InterviewDone,F&F Status\n${exits
      .map(
        (e) =>
          `"${e.name}","${e.designation}","${e.department}","${e.lwd}",${e.progress}%,${e.interviewDone},"${e.ffStatus}"`,
      )
      .join("\n")}`;
    const blob = new Blob([content], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Offboarding_Report_${Date.now()}.csv`;
    a.click();
    showToast(
      "Export Completed",
      "success",
      "Offboarding report CSV downloaded.",
    );
  };

  const handleSignOff = (exitId: string, dept: string, approvedBy: string, comments: string) => {
    const now = new Date();
    const approvedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const approvedTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const timelineDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const updatedExits = exits.map((e) => {
        if (e.id !== exitId) return e;
        const clearance = e.clearance.map((c) =>
          c.dept === dept
            ? { ...c, status: "cleared" as const, approvedBy, approvedDate, approvedTime, comments }
            : c,
        );

        const clearedCount = clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = e.documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          e.documents.length > 0
            ? (uploadedDocs / e.documents.length) * 25
            : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );

        const timeline = [
          ...e.timeline,
          {
            label: `${dept} Clearance Signed Off`,
            date: timelineDate,
            status: "done" as const,
          },
        ];

        return { ...e, clearance, progress, timeline };
      });
    // Persist before notifying other workspaces so their refresh reads the
    // approved clearance, not the previous localStorage snapshot.
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updatedExits));
    setExits(updatedExits);
    window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));
    showToast("Clearance Sign-Off", "success", `${dept} clearance signed off.`);
  };

  const handleVerifyDocument = (documentId: string, approved: boolean) => {
    verifyExitDocument(documentId, approved);
    showToast("Document Verification", "success", approved ? "Document verified." : "Document rejected.");
  };

  const handleGenerateDoc = (exitId: string, docName: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === docName ? { ...d, status: "uploaded" as const } : d,
        );

        const clearedCount = e.clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / e.clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          documents.length > 0 ? (uploadedDocs / documents.length) * 25 : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );
        return { ...e, documents, progress };
      }),
    );
    showToast(
      "Document Generated",
      "success",
      `${docName} generated successfully.`,
    );
  };

  const handleSendToFinance = (exitId: string) => {
    const isHR = user?.role === "HR Manager";
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        return {
          ...e,
          ffStatus: isHR
            ? "Awaiting Finance Clearance"
            : "Approved & Processed",
        };
      }),
    );
    showToast(
      "F&F Settlement",
      "success",
      isHR
        ? "F&F initiated and sent to Finance for clearance."
        : "F&F settlement approved and sent to bank.",
    );
  };

  const handleConfirmComplete = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const timeline = e.timeline.map((t) => ({
          ...t,
          status: "done" as const,
        }));
        return { ...e, progress: 100, timeline };
      }),
    );
    showToast(
      "Exit Completed",
      "success",
      "Employee exit process marked as completed.",
    );
  };

  const handleCompleteInterview = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === "Exit Interview Form"
            ? { ...d, status: "uploaded" as const }
            : d,
        );
        return { ...e, interviewDone: true, documents };
      }),
    );
    showToast(
      "Interview Completed",
      "success",
      "Exit interview recorded successfully.",
    );
  };

  const handleInitiateExit = (
    name: string,
    type: ExitType,
    lwd: string,
    noticeDays: number,
  ) => {
    const formattedLWD = lwd
      ? new Date(lwd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "May 10, 2026";
    const newExit: ExitEmployee = {
      id: `exit${Date.now()}`,
      name,
      designation: "Software Engineer",
      department: "Engineering",
      type,
      lwd: formattedLWD,
      progress: 10,
      resumptionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      acceptedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      noticePeriodDays: noticeDays || 30,
      timeline: [
        { label: "Resignation Letter Received", date: "Today", status: "done" },
        { label: "Resignation Accepted", date: "Today", status: "done" },
        { label: "Notice Period Started", date: "Today", status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: "Rahul Sharma",
          status: "cleared",
          icon: "User",
          color: "#00B87C",
          bgColor: "#DCFCE7",
        },
        {
          dept: "IT",
          person: "IT Team",
          status: "pending",
          icon: "Laptop",
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
        },
        {
          dept: "Finance",
          person: "Finance Team",
          status: "pending",
          icon: "Briefcase",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          dept: "HR",
          person: "HR Team",
          status: "pending",
          icon: "User",
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        },
        {
          dept: "Admin",
          person: "Admin Team",
          status: "cleared",
          icon: "ShieldCheck",
          color: "#14B8A6",
          bgColor: "#CCFBF1",
        },
      ],
      assets: [
        { name: "Laptop", status: "pending", detail: "Pending return" },
        { name: "Access Card", status: "pending", detail: "Pending" },
      ],
      documents: [
        { name: "Resignation Letter", status: "uploaded" },
        { name: "Relieving Letter", status: "not_generated" },
        { name: "Experience Letter", status: "pending" },
      ],
      salary: 95000,
      gratuity: 0,
      leaveEncashment: 15000,
      reimbursements: 2000,
      deductions: 0,
      netAmount: 112000,
      ffStatus: "Pending",
      interviewDone: false,
    };
    setExits((prev) => [newExit, ...prev]);
  };

  // Helper to add approved employee from resignation directly to exits
  const addApprovedExit = (resignationData: {
    name: string;
    designation: string;
    department: string;
    resignationDate: string;
    lwd: string;
    noticePeriod: string;
  }) => {
    const noticeDays = parseInt(resignationData.noticePeriod) || 30;
    const newExit: ExitEmployee = {
      id: `exit${Date.now()}`,
      name: resignationData.name,
      designation: resignationData.designation,
      department: resignationData.department,
      type: "Resignation",
      lwd: resignationData.lwd,
      progress: 10,
      resumptionDate: resignationData.resignationDate,
      acceptedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      noticePeriodDays: noticeDays,
      timeline: [
        { label: "Resignation Letter Received", date: resignationData.resignationDate, status: "done" },
        { label: "Resignation Accepted", date: "Today", status: "done" },
        { label: "Notice Period Started", date: "Today", status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: "Rahul Sharma",
          status: "cleared",
          icon: "User",
          color: "#00B87C",
          bgColor: "#DCFCE7",
        },
        {
          dept: "IT",
          person: "IT Team",
          status: "pending",
          icon: "Laptop",
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
        },
        {
          dept: "Finance",
          person: "Finance Team",
          status: "pending",
          icon: "Briefcase",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          dept: "HR",
          person: "HR Team",
          status: "pending",
          icon: "User",
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        },
        {
          dept: "Admin",
          person: "Admin Team",
          status: "cleared",
          icon: "ShieldCheck",
          color: "#14B8A6",
          bgColor: "#CCFBF1",
        },
      ],
      assets: [
        { name: "Laptop", status: "pending", detail: "Pending return" },
        { name: "Access Card", status: "pending", detail: "Pending" },
      ],
      documents: [
        { name: "Resignation Letter", status: "uploaded" },
        { name: "Relieving Letter", status: "not_generated" },
        { name: "Experience Letter", status: "pending" },
      ],
      salary: 95000,
      gratuity: 0,
      leaveEncashment: 15000,
      reimbursements: 2000,
      deductions: 0,
      netAmount: 112000,
      ffStatus: "Pending",
      interviewDone: false,
    };
    setExits((prev) => [newExit, ...prev]);
  };

  const handleAssignTemplate = (exitId: string, templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) {
      showToast("Template not found", "error", "The selected offboarding template could not be loaded.");
      return;
    }
    const emp = exits.find((e) => e.id === exitId);
    if (!emp) return;

    const clearanceStyle: Record<string, { icon: string; color: string; bgColor: string }> = {
      Manager: { icon: "User", color: "#00B87C", bgColor: "#DCFCE7" },
      IT: { icon: "Laptop", color: "#0EA5E9", bgColor: "#E0F2FE" },
      Finance: { icon: "Briefcase", color: "#F59E0B", bgColor: "#FEF3C7" },
      HR: { icon: "User", color: "#8B5CF6", bgColor: "#EDE9FE" },
      Admin: { icon: "ShieldCheck", color: "#14B8A6", bgColor: "#CCFBF1" },
    };

    const generatedClearances = (tpl.clearances || []).map((c) => ({
      dept: c.dept,
      person: c.person || "Department Lead",
      status: "pending" as const,
      icon: clearanceStyle[c.dept]?.icon || "CheckCircle",
      color: clearanceStyle[c.dept]?.color || "#64748B",
      bgColor: clearanceStyle[c.dept]?.bgColor || "#F1F5F9",
      checklist: c.tasks.map((task) => task.name),
    }));

    const generatedAssets = (tpl.assets || []).map((a) => ({
      name: a.name,
      status: "pending" as const,
      detail: `Pending return (${a.category})`,
      owner: a.category === "Accounts" ? "IT" as const : "Admin" as const,
    }));

    const generatedDocs = (tpl.documents || []).map((d) => ({
      id: `template-doc-${exitId}-${d.id}`,
      name: d.name,
      status: "pending" as const,
    }));

    const generatedEmployeeTasks = [
      ...(tpl.knowledgeTransferChecklist || []).map((kt, idx) => ({
      id: `kt-${idx}`,
      label: kt,
      status: "pending" as const,
      })),
      ...(tpl.customTasks || [])
        .filter((task) => task.owner.toLowerCase() === "employee")
        .map((task) => ({ id: `custom-${task.id}`, label: task.name, status: "pending" as const })),
      ...(tpl.documents || []).map((document) => ({
        id: `document-${document.id}`,
        label: `Upload ${document.name}`,
        status: "pending" as const,
      })),
    ];

    const updatedExits = exits.map((item) =>
        item.id === exitId
          ? {
              ...item,
              assignedTemplateId: templateId,
              assignedTemplateVersion: tpl.version,
              clearance: generatedClearances,
              assets: generatedAssets,
              documents: generatedDocs,
              employeeTasks: generatedEmployeeTasks,
            }
          : item
      );
    // Persist before notifying. Otherwise consumers refresh against the old
    // snapshot and only see the confirmation toast, not the assignment.
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updatedExits));
    setExits(updatedExits);

    showToast("Template Assigned", "success", `Successfully assigned ${tpl.name} exit template.`);
    window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));
  };

  const saveTemplate = (tpl: OffboardingTemplate) => {
    setTemplates((prev) => {
      const existing = prev.find((t) => t.id === tpl.id);
      const next = existing
        ? prev.map((t) => t.id === tpl.id ? { ...tpl, version: t.version + 1 } : t)
        : [...prev, { ...tpl, id: tpl.id || `exit-template-${Date.now()}`, version: 1 }];
      localStorage.setItem("viyan_offboarding_templates", JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new Event("viyan:offboarding-updated"));
    showToast("Template Saved", "success", "The offboarding template is ready for assignment.");
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem("viyan_offboarding_templates", JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new Event("viyan:offboarding-updated"));
    showToast("Template Deleted", "success", "The offboarding template has been deleted.");
  };

  const handleDuplicateTemplate = (id: string) => {
    const source = templates.find((t) => t.id === id);
    if (source) {
      const duplicated: OffboardingTemplate = {
        ...source,
        id: `exit-template-${Date.now()}`,
        name: `${source.name} (Copy)`,
        status: "draft",
        version: 1
      };
      setTemplates((prev) => {
        const next = [...prev, duplicated];
        localStorage.setItem("viyan_offboarding_templates", JSON.stringify(next));
        return next;
      });
      window.dispatchEvent(new Event("viyan:offboarding-updated"));
      showToast("Template Duplicated", "success", "Template duplicated as a draft.");
    }
  };

  return {
    exits,
    stats,
    activeExits,
    completedExits,
    scheduledExits,
    handleExportCSV,
    handleSignOff,
    handleVerifyDocument,
    handleGenerateDoc,
    handleSendToFinance,
    handleConfirmComplete,
    handleCompleteInterview,
    handleInitiateExit,
    addApprovedExit,
    templates,
    showTemplateEditor, setShowTemplateEditor,
    editingTemplate, setEditingTemplate,
    showTemplateMenu, setShowTemplateMenu,
    saveTemplate, deleteTemplate, handleDuplicateTemplate,
    handleAssignTemplate,
  };
}
