import type { ClearanceStatus, DocumentItem, EmployeeExitTaskItem, ExitEmployee } from "../types/offboarding.types";

export const EXIT_DOCUMENTS_KEY = "viyan_exit_documents";
export const OFFBOARDING_EXITS_KEY = "viyan_offboarding_exits";
export const OFFBOARDING_UPDATED_EVENT = "viyan:offboarding-updated";

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
