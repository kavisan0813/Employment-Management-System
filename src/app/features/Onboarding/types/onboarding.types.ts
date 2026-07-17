/* ─── Onboarding Types ─── */

export type NewHireStatus =
  | "on-track"
  | "delayed"
  | "at-risk"
  | "pre-joining"
  | "complete";

export interface NewHire {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  role: string;
  dept: string;
  deptColor: string;
  joiningDate: string;
  progress: number;
  progressColor: string;
  status: NewHireStatus;
  daysInOnboarding: number;
  expectedCompletion: string;
  manager: string;
  email?: string;
  assignedTemplateId?: string;
  /** Set when the employee explicitly sends their onboarding information for review. */
  candidateProcessSubmitted?: boolean;
  /** IDs of policies the employee has acknowledged. */
  completedPolicies?: string[];
  /** IDs of training courses the employee has completed. */
  completedTraining?: string[];
  /** IDs of forms/agreements the employee has signed. */
  completedForms?: string[];
}

export type TaskStatus = "done" | "pending" | "overdue" | "in-progress";

export interface PhaseTask {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  assignee: string;
  priority?: TaskPriority;
  mandatory?: boolean;
  description?: string;
  /** Role/user responsible for verifying completion. */
  verifiedBy?: string;
}

export type PhaseStatus = "completed" | "in-progress" | "upcoming";

export interface OnboardingPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  date: string;
  tasks: PhaseTask[];
}

export type DocumentStatus = "uploaded" | "pending" | "missing" | "optional";

export interface DocumentItem {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedBy?: string;
  date?: string;
  mandatory?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  needVerification?: boolean;
  visibleToEmployee?: boolean;
  /** Identifies the onboarding record this document belongs to. */
  employeeId?: string;
}

export type TaskPriority = "Low" | "Medium" | "High";

export interface CompanyTask {
  id: string;
  name: string;
  owner: string;
  priority: TaskPriority;
  mandatory: boolean;
  description: string;
  dueDays: number;
  /** Role/user responsible for verifying completion. */
  verifiedBy: string;
}

export interface Template {
  id: string;
  name: string;
  code: string;
  description: string;
  phases: number;
  tasks: number;
  dept: string;
  deptColor: string;
  avgDays: string;
  usageCount: number;
  status?: "draft" | "active" | "inactive" | "archived";
  version?: number;
  designation?: string;
  employmentType?: string;
  experienceLevel?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  isDefault?: boolean;
  /** Dynamic, task-based internal process (no hardcoded departments). */
  sections?: Array<{
    id: string;
    name: string;
    tasks: CompanyTask[];
  }>;
  documents?: Array<{
    id: string;
    name: string;
    mandatory: boolean;
    maxSize: number;
    allowedTypes: string[];
    needVerification: boolean;
    visibleToEmployee: boolean;
    /** Uploaded by the organization (HR/Admin) rather than the employee. */
    issuedByOrg?: boolean;
    /** Marks the document as visible to the assigned employee once issued. */
    autoVisibleToEmployee?: boolean;
  }>;
  forms?: Array<{ id: string; name: string; required: boolean }>;
  training?: Array<{ id: string; name: string; required: boolean }>;
  policies?: Array<{ id: string; name: string; required: boolean }>;
}

export interface EmployeeOption {
  id: string;
  name: string;
  role: string;
  dept: string;
}
