import type { ClearanceStatus, DocumentItem, EmployeeExitTaskItem, ExitEmployee, OffboardingTemplate } from "../types/offboarding.types";
import { DEFAULT_OFFBOARDING_TEMPLATES } from "../constants/defaultOffboardingTemplate";

export const EXIT_DOCUMENTS_KEY = "viyan_exit_documents";
export const OFFBOARDING_EXITS_KEY = "viyan_offboarding_exits";
export const OFFBOARDING_UPDATED_EVENT = "viyan:offboarding-updated";
export const OFFBOARDING_TEMPLATES_KEY = "viyan_offboarding_templates";

export type ExitDocument = DocumentItem & {
  id: string;
  employeeName: string;
  source: "employee_exit";
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationComment?: string;
};

const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
};

const notify = () => window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));

const clearanceStyle: Record<string, { icon: string; color: string; bgColor: string }> = {
  Manager: { icon: "User", color: "#00B87C", bgColor: "#DCFCE7" },
  IT: { icon: "Laptop", color: "#0EA5E9", bgColor: "#E0F2FE" },
  Finance: { icon: "Briefcase", color: "#F59E0B", bgColor: "#FEF3C7" },
  HR: { icon: "User", color: "#8B5CF6", bgColor: "#EDE9FE" },
  Admin: { icon: "ShieldCheck", color: "#14B8A6", bgColor: "#CCFBF1" },
};

/** Empty by default: companies own their template library and assignments. */
export const getOffboardingTemplates = () => {
  const saved = read<OffboardingTemplate[]>(OFFBOARDING_TEMPLATES_KEY, []);
  return saved.length ? saved : DEFAULT_OFFBOARDING_TEMPLATES;
};
export const saveOffboardingTemplate = (template: OffboardingTemplate) => {
  const templates = getOffboardingTemplates();
  const existing = templates.find((item) => item.id === template.id);
  const next = existing
    ? templates.map((item) => item.id === template.id ? { ...template, version: item.version + 1 } : item)
    : [...templates, { ...template, id: template.id || `exit-template-${Date.now()}`, version: 1 }];
  localStorage.setItem(OFFBOARDING_TEMPLATES_KEY, JSON.stringify(next));
  notify();
};
export const deleteOffboardingTemplate = (id: string) => {
  localStorage.setItem(OFFBOARDING_TEMPLATES_KEY, JSON.stringify(getOffboardingTemplates().filter((template) => template.id !== id)));
  notify();
};

export function createOffboardingRecord(input: {
  name: string; designation: string; department: string; type: ExitEmployee["type"];
  lwd: string; noticePeriodDays: number; reason?: string; createdBy: string;
  manager?: string; resignationDate?: string; documents?: DocumentItem[];
  template?: OffboardingTemplate;
}): ExitEmployee {
  const now = new Date();
  const createdDate = now.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    id: `exit-${Date.now()}`, name: input.name, designation: input.designation, department: input.department,
    type: input.type, lwd: input.lwd, progress: 0, resumptionDate: input.resignationDate || date,
    acceptedDate: date, noticePeriodDays: input.noticePeriodDays, reason: input.reason,
    createdBy: input.createdBy, createdDate, workflowStatus: "Offboarding in progress",
    timeline: [{ label: "Offboarding Record Created", date, status: "done" }, { label: "Clearances In Progress", date: "Pending", status: "active" }, { label: "Exit Complete", date: "Pending", status: "pending" }],
    clearance: (input.template?.clearances || []).map((c) => ({
      dept: c.dept,
      person: c.person || "Assigned on template",
      status: "pending" as const,
      icon: clearanceStyle[c.dept]?.icon || "CheckCircle",
      color: clearanceStyle[c.dept]?.color || "#64748B",
      bgColor: clearanceStyle[c.dept]?.bgColor || "#F1F5F9",
    })),
    assets: [],
    documents: input.documents || [], salary: 0, gratuity: 0, leaveEncashment: 0, reimbursements: 0, deductions: 0, netAmount: 0, ffStatus: "Pending", interviewDone: false,
    assignedTemplateId: input.template?.id, assignedTemplateVersion: input.template?.version,
  };
}

export function persistOffboardingRecord(record: ExitEmployee) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  if (!exits.some((exit) => exit.name === record.name)) {
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify([record, ...exits]));
    notify();
  }
}

export const getExitDocuments = (employeeName: string) =>
  read<ExitDocument[]>(EXIT_DOCUMENTS_KEY, []).filter((document) => document.employeeName === employeeName);

export function uploadExitDocuments(employeeName: string, names: string[]) {
  const existing = read<ExitDocument[]>(EXIT_DOCUMENTS_KEY, []);
  const uploads = names.map((name) => ({
    id: `exit-doc-${Date.now()}-${name}`,
    employeeName,
    name,
    status: "uploaded" as const,
    source: "employee_exit" as const,
    uploadedAt: new Date().toLocaleString(),
    verificationStatus: "pending" as const,
  }));
  localStorage.setItem(EXIT_DOCUMENTS_KEY, JSON.stringify([...existing, ...uploads]));
  notify();
}

export function verifyExitDocument(documentId: string, approved: boolean, verificationComment = "") {
  const documents = read<ExitDocument[]>(EXIT_DOCUMENTS_KEY, []).map((document) =>
    document.id === documentId
      ? { ...document, verificationStatus: approved ? "verified" as const : "rejected" as const, verificationComment }
      : document,
  );
  localStorage.setItem(EXIT_DOCUMENTS_KEY, JSON.stringify(documents));
  notify();
}

export function publishClearance(employeeName: string, department: string, status: ClearanceStatus = "cleared") {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const updated = exits.map((exit) => {
    if (exit.name !== employeeName) return exit;
    const clearance = exit.clearance.map((item) => item.dept === department ? { ...item, status } : item);
    const allCleared = clearance.every((item) => item.status === "cleared");
    const timeline = [...exit.timeline.filter((item) => item.label !== `${department} Clearance Signed Off`), {
      label: `${department} Clearance Signed Off`, date, status: "done" as const,
    }];
    if (allCleared) timeline.push({ label: "Clearances Completed", date, status: "done" });
    return { ...exit, clearance, timeline };
  });
  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updated));
  notify();
}

export function publishEmployeeExitAction(employeeName: string, task: EmployeeExitTaskItem) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const updated = exits.map((exit) => {
    if (exit.name !== employeeName) return exit;
    const employeeTasks = [...(exit.employeeTasks || []).filter((item) => item.id !== task.id), { ...task, completedAt: date }];
    const assets = exit.assets.map((asset) =>
      (task.id === "t4" && asset.name === "Laptop") || (task.id === "t5" && asset.name.toLowerCase().includes("phone"))
        ? { ...asset, status: "returned" as const, detail: `Confirmed by employee ${date}` }
        : asset,
    );
    const clearances = exit.clearance.filter((item) => item.status === "cleared").length;
    const returnedAssets = assets.filter((item) => item.status === "returned").length;
    const docs = [...exit.documents.filter((item) => item.source !== "employee_exit"), ...getExitDocuments(employeeName)];
    const uploadedDocs = docs.filter((item) => item.status === "uploaded").length;
    const progress = Math.round((clearances / Math.max(exit.clearance.length, 1)) * 50 + (returnedAssets / Math.max(assets.length, 1)) * 25 + (uploadedDocs / Math.max(docs.length, 1)) * 25);
    const timeline = [...exit.timeline.filter((item) => item.label !== task.label), { label: task.label, date, status: "done" as const }];
    return { ...exit, assets, employeeTasks, timeline, progress };
  });
  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updated));
  notify();
}
