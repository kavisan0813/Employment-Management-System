import type {
  ClearanceStatus,
  DocumentItem,
  EmployeeExitTaskItem,
  ExitEmployee,
  ExitType,
} from "../types/offboarding.types";

export const EXIT_DOCUMENTS_KEY = "viyan_exit_documents:v1";
export const OFFBOARDING_EXITS_KEY = "viyan_offboarding_exits:v1";
export const OFFBOARDING_UPDATED_EVENT = "viyan:offboarding-updated";

// ── Canonical Exit Status Model ───────────────────────────────
export const EXIT_STATUS = {
  DRAFT: "exit_draft",
  MANAGER_REVIEW: "manager_review",
  MANAGER_APPROVED: "manager_approved",
  MANAGER_REJECTED: "manager_rejected",
  HR_PROCESSING: "hr_processing",
  CLEARANCE_PENDING: "clearance_pending",
  CLEARANCE_IN_PROGRESS: "clearance_in_progress",
  CLEARANCE_COMPLETE: "clearance_complete",
  FINANCE_PENDING: "finance_pending",
  FINANCE_COMPLETE: "finance_complete",
  EXIT_COMPLETED: "exit_completed",
} as const;

export type ExitStatus = (typeof EXIT_STATUS)[keyof typeof EXIT_STATUS];

/** Normalize status strings (including legacy strings) to canonical ExitStatus */
export function normalizeExitStatus(status: string): ExitStatus {
  switch (status) {
    case "draft":
    case "exit_draft":
      return EXIT_STATUS.DRAFT;
    case "pending_manager":
    case "manager_review":
      return EXIT_STATUS.MANAGER_REVIEW;
    case "pending_hr":
    case "manager_approved":
      return EXIT_STATUS.MANAGER_APPROVED;
    case "rejected":
    case "manager_rejected":
      return EXIT_STATUS.MANAGER_REJECTED;
    case "approved":
    case "hr_processing":
      return EXIT_STATUS.HR_PROCESSING;
    case "clearance_pending":
      return EXIT_STATUS.CLEARANCE_PENDING;
    case "clearance_in_progress":
    case "in_progress":
      return EXIT_STATUS.CLEARANCE_IN_PROGRESS;
    case "clearance_complete":
      return EXIT_STATUS.CLEARANCE_COMPLETE;
    case "finance_pending":
      return EXIT_STATUS.FINANCE_PENDING;
    case "finance_complete":
      return EXIT_STATUS.FINANCE_COMPLETE;
    case "completed":
    case "exit_completed":
      return EXIT_STATUS.EXIT_COMPLETED;
    default:
      return EXIT_STATUS.MANAGER_REVIEW;
  }
}

/** Human-readable status label formatter */
export function formatExitStatusLabel(status: string): string {
  const normalized = normalizeExitStatus(status);
  switch (normalized) {
    case EXIT_STATUS.DRAFT:
      return "Draft";
    case EXIT_STATUS.MANAGER_REVIEW:
      return "Awaiting Manager Review";
    case EXIT_STATUS.MANAGER_APPROVED:
      return "Manager Approved";
    case EXIT_STATUS.MANAGER_REJECTED:
      return "Manager Rejected";
    case EXIT_STATUS.HR_PROCESSING:
      return "HR Processing";
    case EXIT_STATUS.CLEARANCE_PENDING:
      return "Clearance Pending";
    case EXIT_STATUS.CLEARANCE_IN_PROGRESS:
      return "Clearance In Progress";
    case EXIT_STATUS.CLEARANCE_COMPLETE:
      return "Clearance Complete";
    case EXIT_STATUS.FINANCE_PENDING:
      return "Finance / F&F Pending";
    case EXIT_STATUS.FINANCE_COMPLETE:
      return "Finance / F&F Complete";
    case EXIT_STATUS.EXIT_COMPLETED:
      return "Exit Completed";
    default:
      return "Under Review";
  }
}

/** Controlled transition validation */
export function canTransitionTo(
  currentStatus: string,
  nextStatus: string,
): boolean {
  const current = normalizeExitStatus(currentStatus);
  const next = normalizeExitStatus(nextStatus);

  if (current === next) return true;

  const allowedTransitions: Record<ExitStatus, ExitStatus[]> = {
    [EXIT_STATUS.DRAFT]: [EXIT_STATUS.MANAGER_REVIEW],
    [EXIT_STATUS.MANAGER_REVIEW]: [
      EXIT_STATUS.MANAGER_APPROVED,
      EXIT_STATUS.MANAGER_REJECTED,
      EXIT_STATUS.DRAFT,
    ],
    [EXIT_STATUS.MANAGER_APPROVED]: [
      EXIT_STATUS.HR_PROCESSING,
      EXIT_STATUS.MANAGER_REVIEW, // allowed if HR sends back to manager
    ],
    [EXIT_STATUS.HR_PROCESSING]: [
      EXIT_STATUS.CLEARANCE_PENDING,
      EXIT_STATUS.CLEARANCE_IN_PROGRESS,
    ],
    [EXIT_STATUS.CLEARANCE_PENDING]: [EXIT_STATUS.CLEARANCE_IN_PROGRESS],
    [EXIT_STATUS.CLEARANCE_IN_PROGRESS]: [EXIT_STATUS.CLEARANCE_COMPLETE],
    [EXIT_STATUS.CLEARANCE_COMPLETE]: [EXIT_STATUS.FINANCE_PENDING],
    [EXIT_STATUS.FINANCE_PENDING]: [EXIT_STATUS.FINANCE_COMPLETE],
    [EXIT_STATUS.FINANCE_COMPLETE]: [EXIT_STATUS.EXIT_COMPLETED],
    [EXIT_STATUS.MANAGER_REJECTED]: [],
    [EXIT_STATUS.EXIT_COMPLETED]: [],
  };

  const allowed = allowedTransitions[current] || [];
  return allowed.includes(next);
}

export type ExitDocument = DocumentItem & {
  id: string;
  employeeName: string;
  source: "employee_exit";
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationComment?: string;
};

const read = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};

const notify = () => window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));

export function persistOffboardingRecord(record: ExitEmployee) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  if (!exits.some((exit) => exit.name === record.name)) {
    localStorage.setItem(
      OFFBOARDING_EXITS_KEY,
      JSON.stringify([record, ...exits]),
    );
    notify();
  }
}

export const getExitDocuments = (employeeName: string) =>
  read<ExitDocument[]>(EXIT_DOCUMENTS_KEY, []).filter(
    (document) => document.employeeName === employeeName,
  );

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
  localStorage.setItem(
    EXIT_DOCUMENTS_KEY,
    JSON.stringify([...existing, ...uploads]),
  );
  notify();
}

export function verifyExitDocument(
  documentId: string,
  approved: boolean,
  verificationComment = "",
) {
  const documents = read<ExitDocument[]>(EXIT_DOCUMENTS_KEY, []).map(
    (document) =>
      document.id === documentId
        ? {
            ...document,
            verificationStatus: approved
              ? ("verified" as const)
              : ("rejected" as const),
            verificationComment,
          }
        : document,
  );
  localStorage.setItem(EXIT_DOCUMENTS_KEY, JSON.stringify(documents));
  notify();
}

/** Check if all required clearances are completed for an exit record */
export function areAllClearancesComplete(exit: ExitEmployee): boolean {
  if (!exit.clearance || exit.clearance.length === 0) return false;
  return exit.clearance.every((item) => item.status === "cleared");
}

/** Check if all uploaded exit documents are verified (none pending or rejected) */
export function areAllDocumentsVerified(exit: ExitEmployee): boolean {
  const docs = [
    ...(exit.documents || []),
    ...getExitDocuments(exit.name),
  ];
  if (docs.length === 0) return true;
  return docs.every((doc) => {
    if (doc.verificationStatus === "rejected") return false;
    if (doc.verificationStatus === "pending" && doc.status === "uploaded") return false;
    return true;
  });
}

/** Update exit status with transition check and timeline audit logging */
export function updateExitStatus(
  employeeName: string,
  newStatus: ExitStatus,
  timelineLabel?: string,
  performedBy = "System",
) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const updated = exits.map((exit) => {
    if (exit.name !== employeeName) return exit;
    
    // Validate transition
    if (!canTransitionTo(exit.workflowStatus || EXIT_STATUS.HR_PROCESSING, newStatus)) {
      console.warn(`[offboardingWorkflow] Invalid status transition from ${exit.workflowStatus} to ${newStatus}`);
    }

    const timeline = timelineLabel
      ? [
          ...exit.timeline.filter((item) => item.label !== timelineLabel),
          { label: timelineLabel, date, status: "done" as const },
        ]
      : exit.timeline;

    return {
      ...exit,
      workflowStatus: newStatus,
      timeline,
    };
  });
  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updated));
  notify();
}

export function publishClearance(
  employeeName: string,
  dept: string,
  status: "cleared" | "pending" | "rejected" = "cleared",
  note = "",
) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const updated = exits.map((exit) => {
    if (exit.name !== employeeName) return exit;
    const clearance = exit.clearance.map((c) =>
      c.dept.toLowerCase() === dept.toLowerCase()
        ? { ...c, status, note, approvedDate: date, approvedTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
        : c,
    );
    const clearedCount = clearance.filter((c) => c.status === "cleared").length;
    const totalCount = Math.max(clearance.length, 1);
    const progress = Math.min(100, Math.round((clearedCount / totalCount) * 100));

    // Determine workflow stage based on clearance completion
    let workflowStatus = exit.workflowStatus || EXIT_STATUS.HR_PROCESSING;
    if (clearedCount > 0 && clearedCount < totalCount) {
      workflowStatus = EXIT_STATUS.CLEARANCE_IN_PROGRESS;
    } else if (clearedCount === totalCount) {
      workflowStatus = EXIT_STATUS.FINANCE_PENDING; // Transitions directly to finance pending when clearances finish
    }

    const timeline = [
      ...exit.timeline.filter((t) => t.label !== `${dept} Clearance Completed`),
      { label: `${dept} Clearance Completed`, date, status: "done" as const },
    ];
    if (clearedCount === totalCount && !timeline.some((t) => t.label === "All Clearances Completed")) {
      timeline.push({ label: "All Clearances Completed", date, status: "done" as const });
      timeline.push({ label: "Finance / F&F Pending", date, status: "active" as const });
    }

    return { ...exit, clearance, progress, workflowStatus, timeline };
  });

  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updated));
  notify();
}

export function publishEmployeeExitAction(
  employeeName: string,
  task: EmployeeExitTaskItem,
) {
  const exits = read<ExitEmployee[]>(OFFBOARDING_EXITS_KEY, []);
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const updated = exits.map((exit) => {
    if (exit.name !== employeeName) return exit;
    const employeeTasks = [
      ...(exit.employeeTasks || []).filter((item) => item.id !== task.id),
      { ...task, completedAt: date },
    ];
    const assets = exit.assets.map((asset) =>
      (task.id === "t4" && asset.name === "Laptop") ||
      (task.id === "t5" && asset.name.toLowerCase().includes("phone"))
        ? {
            ...asset,
            status: "returned" as const,
            detail: `Confirmed by employee ${date}`,
          }
        : asset,
    );
    const clearances = exit.clearance.filter(
      (item) => item.status === "cleared",
    ).length;
    const returnedAssets = assets.filter(
      (item) => item.status === "returned",
    ).length;
    const docs = [
      ...exit.documents.filter((item) => item.source !== "employee_exit"),
      ...getExitDocuments(employeeName),
    ];
    const uploadedDocs = docs.filter(
      (item) => item.status === "uploaded",
    ).length;
    const progress = Math.round(
      (clearances / Math.max(exit.clearance.length, 1)) * 50 +
        (returnedAssets / Math.max(assets.length, 1)) * 25 +
        (uploadedDocs / Math.max(docs.length, 1)) * 25,
    );
    const timeline = [
      ...exit.timeline.filter((item) => item.label !== task.label),
      { label: task.label, date, status: "done" as const },
    ];
    return { ...exit, assets, employeeTasks, timeline, progress };
  });
  localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(updated));
  notify();
}

export function createOffboardingRecord(input: {
  name: string;
  designation: string;
  department: string;
  type: ExitType;
  lwd: string;
  noticePeriodDays: number;
  reason?: string;
  createdBy?: string;
  manager?: string;
  resignationDate?: string;
  documents?: DocumentItem[];
}): ExitEmployee {
  return {
    id: `exit-${Date.now()}`,
    name: input.name,
    designation: input.designation,
    department: input.department,
    type: input.type,
    lwd: input.lwd,
    progress: 10,
    clearance: [
      {
        dept: "Manager",
        person: input.manager || "Line Manager",
        status: "pending",
        icon: "UserCheck",
        color: "#F59E0B",
        bgColor: "rgba(245,158,11,0.1)",
      },
      {
        dept: "IT",
        person: "Alex Rivera",
        status: "pending",
        icon: "Laptop",
        color: "#3B82F6",
        bgColor: "rgba(59,130,246,0.1)",
      },
      {
        dept: "Finance",
        person: "Sarah Connor",
        status: "pending",
        icon: "Receipt",
        color: "#0EA5E9",
        bgColor: "rgba(14,165,233,0.1)",
      },
      {
        dept: "HR",
        person: "Priya Sharma",
        status: "pending",
        icon: "Shield",
        color: "#10B981",
        bgColor: "rgba(16,185,129,0.1)",
      },
      {
        dept: "Admin",
        person: "Vikram Malhotra",
        status: "pending",
        icon: "Building",
        color: "#8B5CF6",
        bgColor: "rgba(139,92,246,0.1)",
      },
    ],
    resumptionDate: input.lwd,
    acceptedDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    noticePeriodDays: input.noticePeriodDays || 30,
    timeline: [
      {
        label: "Resignation Submitted",
        date:
          input.resignationDate ||
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        status: "done",
      },
      {
        label: "Clearance Pending",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        status: "active",
      },
    ],
    assets: [
      {
        name: "Laptop",
        status: "pending",
        detail: "MacBook Pro M2 - Serial #MB-2024-889",
      },
      { name: "Access Card", status: "pending", detail: "ID Card #AC-9904" },
    ],
    documents: input.documents || [],
    salary: 85000,
    gratuity: 45000,
    leaveEncashment: 12000,
    reimbursements: 3500,
    deductions: 5000,
    netAmount: 140500,
    ffStatus: "pending",
    interviewDone: false,
    reason: input.reason,
    createdBy: input.createdBy,
    createdDate: new Date().toISOString(),
    workflowStatus: "in_progress",
  };
}
