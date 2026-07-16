/* ─── Onboarding Types ─── */

export type NewHireStatus = "on-track" | "delayed" | "at-risk" | "pre-joining" | "complete";

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
}

export type TaskStatus = "done" | "pending" | "overdue" | "in-progress";

export interface PhaseTask {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  assignee: string;
  priority?: "Low" | "Medium" | "High";
  mandatory?: boolean;
  description?: string;
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
  branch?: string;
  company?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  isDefault?: boolean;
  sections?: Array<{
    id: string;
    name: string;
    tasks: Array<{
      id: string;
      name: string;
      owner: string;
      priority?: string;
      mandatory?: boolean;
      description?: string;
      dueDays?: number;
    }>;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    mandatory: boolean;
    maxSize: number;
    allowedTypes: string[];
    needVerification: boolean;
    visibleToEmployee: boolean;
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
