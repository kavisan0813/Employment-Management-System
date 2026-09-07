import type { ExitStatus } from "../services/offboardingWorkflow";

export type ResignationStatus =
  | ExitStatus
  | "exit_draft"
  | "manager_review"
  | "manager_approved"
  | "manager_rejected"
  | "hr_processing"
  | "pending_manager"
  | "pending_hr"
  | "approved"
  | "rejected";
export interface ResignationRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: string;
  status: ResignationStatus;
  resignationDate: string;
  lwd: string;
  noticePeriod: string;
  reason: string;
  comments: string;
  timeline: {
    id: string;
    action: string;
    performedBy: string;
    role: string;
    date: string;
    time?: string;
    comments?: string;
  }[];
}
