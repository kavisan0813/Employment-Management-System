export type ExitType =
  | "Resignation"
  | "Termination"
  | "Retirement"
  | "Contract End"
  | "Other";

export type ClearanceStatus = "cleared" | "pending" | "not_started";

export type TabType = "Active" | "Completed" | "Scheduled" | "Exit Analytics";

export interface ExitTimelineItem {
  label: string;
  date: string;
  status: "done" | "active" | "pending";
}

export interface ClearanceItem {
  dept: string;
  person: string;
  status: ClearanceStatus;
  icon: string; // Keep as string (icon identifier) so it can be serialized easily, or handle dynamically
  color: string;
  bgColor: string;
}

export interface AssetRecoveryItem {
  name: string;
  status: "returned" | "pending";
  detail: string;
}

export interface DocumentItem {
  name: string;
  status: "uploaded" | "pending" | "not_generated";
}

export interface ExitEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  type: ExitType;
  lwd: string;
  progress: number;
  clearance: ClearanceItem[];
  resumptionDate: string;
  acceptedDate: string;
  noticePeriodDays: number;
  timeline: ExitTimelineItem[];
  assets: AssetRecoveryItem[];
  documents: DocumentItem[];
  salary: number;
  gratuity: number;
  leaveEncashment: number;
  reimbursements: number;
  deductions: number;
  netAmount: number;
  ffStatus: string;
  interviewDone: boolean;
}
