export type ExitType =
  | "Resignation"
  | "Termination"
  | "Retirement"
  | "Contract End"
  | "Other";

export type ClearanceStatus = "cleared" | "pending" | "not_started";

export type TabType = "Requests" | "Active" | "Completed" | "Scheduled" | "Exit Analytics" | "Templates";

/** Configurable, versioned exit workflow template */
export interface OffboardingTemplate {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  status: "draft" | "active" | "inactive" | "archived";
  version: number;
  isDefault?: boolean;
  clearances?: Array<{
    id: string;
    dept: string;
    person: string;
    tasks: Array<{
      id: string;
      name: string;
      owner: string;
      isMandatory?: boolean;
      description?: string;
      dueBeforeLWD?: number;
      priority?: "High" | "Medium" | "Low";
      requiresApproval?: boolean;
      completionEvidence?: string;
      notes?: string;
    }>;
  }>;
  assets?: Array<{ id: string; name: string; category: string; mandatory: boolean }>;
  documents?: Array<{ id: string; name: string; mandatory: boolean }>;
  exitInterviewRequired?: boolean;
  exitInterviewQuestionnaire?: string[];
  knowledgeTransferChecklist?: string[];
  settlementChecklist?: string[];
  customTasks?: Array<{ id: string; name: string; owner: string; dueDays: number; priority: string; mandatory: boolean }>;
}

export interface ExitTimelineItem {
  label: string;
  date: string;
  status: "done" | "active" | "pending";
}

export interface ClearanceItem {
  dept: string;
  person: string;
  status: ClearanceStatus;
  icon: string;
  color: string;
  bgColor: string;
  approvedBy?: string;
  approvedDate?: string;
  approvedTime?: string;
  comments?: string;
  checklist?: string[];
}

export interface AssetRecoveryItem {
  name: string;
  status: "returned" | "pending";
  detail: string;
  assetId?: string;
  assignedDate?: string;
  condition?: "Good" | "Damaged" | "Not applicable";
  verifiedBy?: string;
  verifiedDate?: string;
  owner?: "IT" | "Admin";
}

export interface DocumentItem {
  id?: string;
  name: string;
  status: "uploaded" | "pending" | "not_generated";
  source?: "employee_exit";
  verificationStatus?: "pending" | "verified" | "rejected";
  verificationComment?: string;
}

export interface EmployeeExitTaskItem {
  id: string;
  label: string;
  status: "done" | "pending" | "in_progress";
  completedAt?: string;
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
  employeeTasks?: EmployeeExitTaskItem[];
  salary: number;
  gratuity: number;
  leaveEncashment: number;
  reimbursements: number;
  deductions: number;
  netAmount: number;
  ffStatus: string;
  interviewDone: boolean;
  
  // F&F Settlement Detailed Fields
  bonus?: number;
  incentives?: number;
  otherEarnings?: number;
  noticePeriodRecovery?: number;
  loanRecovery?: number;
  assetRecovery?: number;
  taxDeduction?: number;
  pfEsiAdjustment?: number;
  otherDeductions?: number;
  totalEarnings?: number;
  totalDeductions?: number;
  ffApprovedBy?: string;
  ffApprovedDate?: string;
  reason?: string;
  createdBy?: string;
  createdDate?: string;
  workflowStatus?: string;
  assignedTemplateId?: string;
  assignedTemplateVersion?: number;
}
