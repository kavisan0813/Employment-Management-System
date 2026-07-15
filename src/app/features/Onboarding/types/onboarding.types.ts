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
}

export type TaskStatus = "done" | "pending" | "overdue" | "in-progress";

export interface PhaseTask {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  assignee: string;
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
}

export interface Template {
  id: string;
  name: string;
  phases: number;
  tasks: number;
  dept: string;
  deptColor: string;
  avgDays: string;
  usageCount: number;
}

export interface EmployeeOption {
  id: string;
  name: string;
  role: string;
  dept: string;
}
