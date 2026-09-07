import React from "react";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export type ApprovalLayerType = "SINGLE" | "DOUBLE" | "THIRD";
export type ApprovalRole = "TL" | "HR" | "MANAGER";
export type WorkflowStatus = "PENDING_TL" | "PENDING_HR" | "PENDING_MANAGER" | "APPROVED" | "REJECTED";

export interface ApprovalStageConfig {
  stageId: string;
  stageOrder: number;
  role: ApprovalRole;
  label: string;
}

export interface ApprovalWorkflowConfig {
  layerType: ApprovalLayerType;
  stages: ApprovalStageConfig[];
}

export interface ApprovalStageRecord {
  stageId: string;
  stageOrder: number;
  role: ApprovalRole;
  label: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED";
  approverId?: string;
  approverName?: string;
  actedAt?: string;
  comment?: string;
}

export interface LeaveHistory {
  date: string;
  action: string;
  by: string;
  comment?: string;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  team: string;
  initials: string;
  avatarColor: string;
  type: string;
  from: string;
  to: string;
  days: number;
  managerApproval: ApprovalStatus;
  hrApproval: ApprovalStatus;
  status: ApprovalStatus;
  workflowStatus?: WorkflowStatus;
  currentStageRole?: ApprovalRole;
  stageRecords?: ApprovalStageRecord[];
  criticalRole?: boolean;
  conflictWarning?: string;
  history: LeaveHistory[];
  remarks: string;
  submissionDate: string;
  appliedBy?: string;
  attachmentCount?: number;
  policyViolations?: string[];
  balance: {
    annual: number;
    sick: number;
    casual: number;
    unpaid: number;
  };
  summary: {
    takenThisYear: number;
    lastLeaveDate: string;
    sickFrequency: string;
  };
  escalated?: boolean;
}

export interface LeaveFilterState {
  month: number; // 0 = Jan, 11 = Dec, -1 = All
  year: number;
  department: string;
  team: string;
  employee: string;
  leaveType: string;
  status: string;
  search: string;
  approvalStage: string;
  conflictOnly: boolean;
  criticalOnly: boolean;
}

export type SortField = "employee" | "department" | "team" | "type" | "from" | "days" | "status";
export type SortDirection = "asc" | "desc";
