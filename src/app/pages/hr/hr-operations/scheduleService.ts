import { P } from "../../../shared/permission-engine/permissions";

// ── TYPES & INTERFACES ──────────────────────────────────────────────────

export interface ApprovalHistoryItem {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  comment?: string;
  previousStatus?: string;
  newStatus?: string;
}

export type SwapRequestStatus =
  | "Pending"
  | "Manager Review"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export interface ShiftSwapRequest {
  id: string;
  organizationId: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  requesterTeam?: string;
  targetEmployeeId: string;
  targetEmployeeName: string;
  targetDepartment: string;
  targetTeam?: string;
  date: string;
  currentShiftId?: string;
  currentShiftName: string;
  requestedShiftId?: string;
  requestedShiftName: string;
  reason: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  rejectionReason?: string;
  status: SwapRequestStatus;
  approvalHistory: ApprovalHistoryItem[];
  scheduleUpdateStatus?: "Pending" | "Completed" | "Failed";
}

export interface ShiftDefinition {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes: number;
  workingHours: number;
  isOvernight?: boolean;
  displayOrder?: number;
}

export interface ShiftTemplate {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  department: string;
  rotationType: "Weekly Rotation" | "Bi-weekly" | "Weekend Only" | "Custom Rotation";
  status: "Active" | "Disabled";
  badge?: "Active" | "Most Used" | "Recently Applied";
  badgeColor?: string;
  badgeBg?: string;
  shifts: ShiftDefinition[];
  weeklySchedule: Record<string, string>;
  employeesCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastAppliedAt?: string;
}

export interface OvertimeTemplate {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  maxDailyOvertimeHours: number;
  maxWeeklyOvertimeHours: number;
  minOvertimeDurationMinutes: number;
  overtimeApprovalRequired: boolean;
  overtimeRateMultiplier: number;
  eligibleShiftTypes: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  status: "Active" | "Disabled";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyTemplatePayload {
  templateId: string;
  scopeType: "Department" | "Team" | "Employees";
  scopeValues: string[];
  startDate: string;
  endDate: string;
  overrideConflicts?: boolean;
}

export interface ConflictItem {
  id: string;
  type: "Existing Shift" | "Approved Leave" | "Holiday" | "Locked Schedule";
  employeeId: string;
  employeeName: string;
  date: string;
  currentAssignment: string;
  proposedAssignment: string;
}

export interface ApplyTemplateResult {
  success: boolean;
  appliedCount: number;
  skippedCount: number;
  conflictCount: number;
  conflicts: ConflictItem[];
  appliedOverrides: Record<string, { type: "Morning" | "Evening" | "Night" | "Full Day" | "Off Day"; time: string }>;
  message: string;
}

export interface ScheduleAuditItem {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  targetId?: string;
  targetName?: string;
  details?: string;
}

// ── INITIAL SEED DATA ───────────────────────────────────────────────────

const INITIAL_SWAP_REQUESTS: ShiftSwapRequest[] = [
  {
    id: "REQ-001",
    organizationId: "org-nexus-01",
    requesterId: "emp-sarah",
    requesterName: "Sarah Johnson",
    requesterDepartment: "Engineering",
    targetEmployeeId: "emp-marcus",
    targetEmployeeName: "Marcus Wright",
    targetDepartment: "Engineering",
    date: "2026-04-07",
    currentShiftName: "Morning (06:00-14:00)",
    requestedShiftName: "Evening (14:00-22:00)",
    reason: "Medical appointment in the morning",
    submittedAt: "2026-04-02 09:15 AM",
    status: "Pending",
    approvalHistory: [
      {
        id: "hist-001-1",
        action: "SHIFT_SWAP_SUBMITTED",
        actorId: "emp-sarah",
        actorName: "Sarah Johnson",
        timestamp: "2026-04-02 09:15 AM",
        comment: "Initial shift swap request submitted for peer review.",
        newStatus: "Pending",
      },
    ],
    scheduleUpdateStatus: "Pending",
  },
  {
    id: "REQ-002",
    organizationId: "org-nexus-01",
    requesterId: "emp-ravi",
    requesterName: "Ravi Kumar",
    requesterDepartment: "Operations",
    targetEmployeeId: "emp-sneha",
    targetEmployeeName: "Sneha Patel",
    targetDepartment: "Operations",
    date: "2026-04-09",
    currentShiftName: "Night (22:00-06:00)",
    requestedShiftName: "Night (22:00-06:00)",
    reason: "Family event on original day",
    submittedAt: "2026-04-03 11:30 AM",
    status: "Pending",
    approvalHistory: [
      {
        id: "hist-002-1",
        action: "SHIFT_SWAP_SUBMITTED",
        actorId: "emp-ravi",
        actorName: "Ravi Kumar",
        timestamp: "2026-04-03 11:30 AM",
        comment: "Request submitted.",
        newStatus: "Pending",
      },
    ],
    scheduleUpdateStatus: "Pending",
  },
  {
    id: "REQ-003",
    organizationId: "org-nexus-01",
    requesterId: "emp-james",
    requesterName: "James Carter",
    requesterDepartment: "Sales",
    targetEmployeeId: "emp-emily",
    targetEmployeeName: "Emily Reed",
    targetDepartment: "Sales",
    date: "2026-04-10",
    currentShiftName: "Evening (14:00-22:00)",
    requestedShiftName: "Morning (06:00-14:00)",
    reason: "Transport schedule issue",
    submittedAt: "2026-04-04 02:45 PM",
    status: "Manager Review",
    approvalHistory: [
      {
        id: "hist-003-1",
        action: "SHIFT_SWAP_SUBMITTED",
        actorId: "emp-james",
        actorName: "James Carter",
        timestamp: "2026-04-04 02:45 PM",
        comment: "Request submitted.",
        newStatus: "Pending",
      },
      {
        id: "hist-003-2",
        action: "SHIFT_SWAP_MANAGER_REVIEW",
        actorId: "system",
        actorName: "System Workflow",
        timestamp: "2026-04-04 03:00 PM",
        comment: "Assigned to Sales Manager for review.",
        previousStatus: "Pending",
        newStatus: "Manager Review",
      },
    ],
    scheduleUpdateStatus: "Pending",
  },
  {
    id: "REQ-004",
    organizationId: "org-nexus-01",
    requesterId: "emp-robert",
    requesterName: "Robert Chen",
    requesterDepartment: "Engineering",
    targetEmployeeId: "emp-yuki",
    targetEmployeeName: "Yuki Tanaka",
    targetDepartment: "Engineering",
    date: "2026-04-13",
    currentShiftName: "Full Day (09:00-18:00)",
    requestedShiftName: "Morning (06:00-14:00)",
    reason: "Training workshop conflict",
    submittedAt: "2026-03-30 08:00 AM",
    reviewedAt: "2026-04-01 10:20 AM",
    reviewedBy: "usr-alex-mgr",
    reviewedByName: "Alex Turner (Manager)",
    status: "Approved",
    approvalHistory: [
      {
        id: "hist-004-1",
        action: "SHIFT_SWAP_SUBMITTED",
        actorId: "emp-robert",
        actorName: "Robert Chen",
        timestamp: "2026-03-30 08:00 AM",
        comment: "Request submitted.",
        newStatus: "Pending",
      },
      {
        id: "hist-004-2",
        action: "SHIFT_SWAP_APPROVED",
        actorId: "usr-alex-mgr",
        actorName: "Alex Turner (Manager)",
        timestamp: "2026-04-01 10:20 AM",
        comment: "Approved. Schedule coverage verified.",
        previousStatus: "Manager Review",
        newStatus: "Approved",
      },
      {
        id: "hist-004-3",
        action: "SHIFT_SWAP_SCHEDULE_UPDATED",
        actorId: "system",
        actorName: "System Engine",
        timestamp: "2026-04-01 10:20 AM",
        comment: "Employee schedules updated automatically.",
        newStatus: "Approved",
      },
    ],
    scheduleUpdateStatus: "Completed",
  },
];

const INITIAL_SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: "TPL-001",
    organizationId: "org-nexus-01",
    name: "Engineering Week A",
    description: "Standard morning rotation for software engineers and QA team.",
    department: "Engineering",
    rotationType: "Weekly Rotation",
    status: "Active",
    badge: "Active",
    badgeColor: "#059669",
    badgeBg: "#E6F4EA",
    employeesCount: 7,
    createdBy: "System Admin",
    createdAt: "2026-01-10",
    updatedAt: "2026-04-01",
    lastAppliedAt: "2026-04-01",
    shifts: [
      { id: "s-1", code: "MOR-01", name: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 1 },
      { id: "s-2", code: "EVE-01", name: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 2 },
    ],
    weeklySchedule: {
      Mon: "Morning",
      Tue: "Morning",
      Wed: "Morning",
      Thu: "Morning",
      Fri: "Morning",
      Sat: "Off Day",
      Sun: "Off Day",
    },
  },
  {
    id: "TPL-002",
    organizationId: "org-nexus-01",
    name: "Night Rot.",
    description: "24/7 infrastructure support night shift rotation.",
    department: "Operations",
    rotationType: "Bi-weekly",
    status: "Active",
    badge: "Most Used",
    badgeColor: "#7C3AED",
    badgeBg: "#F3E8FF",
    employeesCount: 4,
    createdBy: "System Admin",
    createdAt: "2026-01-15",
    updatedAt: "2026-04-05",
    lastAppliedAt: "2026-04-05",
    shifts: [
      { id: "s-3", code: "NGT-01", name: "Night Shift", startTime: "10:00 PM", endTime: "06:00 AM", breakDurationMinutes: 60, workingHours: 8, isOvernight: true, displayOrder: 1 },
    ],
    weeklySchedule: {
      Mon: "Night",
      Tue: "Night",
      Wed: "Off Day",
      Thu: "Night",
      Fri: "Night",
      Sat: "Night",
      Sun: "Off Day",
    },
  },
  {
    id: "TPL-003",
    organizationId: "org-nexus-01",
    name: "Weekend Peak",
    description: "Sales and customer support peak weekend coverage template.",
    department: "Sales",
    rotationType: "Weekend Only",
    status: "Active",
    badge: "Recently Applied",
    badgeColor: "#D97706",
    badgeBg: "#FFFBEB",
    employeesCount: 12,
    createdBy: "Sales Ops Lead",
    createdAt: "2026-02-01",
    updatedAt: "2026-03-28",
    lastAppliedAt: "2026-03-28",
    shifts: [
      { id: "s-4", code: "EVE-02", name: "Weekend Evening", startTime: "02:00 PM", endTime: "10:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 1 },
      { id: "s-5", code: "MOR-02", name: "Weekend Morning", startTime: "06:00 AM", endTime: "02:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 2 },
    ],
    weeklySchedule: {
      Mon: "Off Day",
      Tue: "Off Day",
      Wed: "Off Day",
      Thu: "Off Day",
      Fri: "Evening",
      Sat: "Morning",
      Sun: "Morning",
    },
  },
  {
    id: "TPL-004",
    organizationId: "org-nexus-01",
    name: "Legacy Support Routine",
    description: "Archived support shift routine retained for compliance reference.",
    department: "Support",
    rotationType: "Custom Rotation",
    status: "Disabled",
    badge: undefined,
    employeesCount: 0,
    createdBy: "Support Manager",
    createdAt: "2025-11-10",
    updatedAt: "2026-02-15",
    lastAppliedAt: "2026-02-15",
    shifts: [
      { id: "s-6", code: "SUP-01", name: "Support Standard", startTime: "08:00 AM", endTime: "04:00 PM", breakDurationMinutes: 30, workingHours: 8, displayOrder: 1 },
    ],
    weeklySchedule: {
      Mon: "Morning",
      Tue: "Morning",
      Wed: "Morning",
      Thu: "Morning",
      Fri: "Morning",
      Sat: "Off Day",
      Sun: "Off Day",
    },
  },
];

const INITIAL_OVERTIME_TEMPLATES: OvertimeTemplate[] = [
  {
    id: "OT-TPL-001",
    organizationId: "org-nexus-01",
    name: "Standard Overtime Policy",
    description: "Standard weekday OT configuration requiring manager pre-approval.",
    maxDailyOvertimeHours: 4,
    maxWeeklyOvertimeHours: 16,
    minOvertimeDurationMinutes: 30,
    overtimeApprovalRequired: true,
    overtimeRateMultiplier: 1.5,
    eligibleShiftTypes: ["Morning", "Evening", "Night"],
    effectiveFrom: "2026-01-01",
    status: "Active",
    createdBy: "HR Director",
    createdAt: "2026-01-01",
    updatedAt: "2026-03-15",
  },
  {
    id: "OT-TPL-002",
    organizationId: "org-nexus-01",
    name: "Weekend Emergency OT Policy",
    description: "Critical weekend incident response overtime policy at 2.0x rate.",
    maxDailyOvertimeHours: 8,
    maxWeeklyOvertimeHours: 24,
    minOvertimeDurationMinutes: 60,
    overtimeApprovalRequired: true,
    overtimeRateMultiplier: 2.0,
    eligibleShiftTypes: ["Morning", "Evening", "Night"],
    effectiveFrom: "2026-01-01",
    status: "Active",
    createdBy: "Operations Head",
    createdAt: "2026-01-10",
    updatedAt: "2026-03-20",
  },
];

// ── SERVICE CLASS IMPLEMENTATION ────────────────────────────────────────

export class ScheduleService {
  private static getSwapStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "org-nexus-01";
    return `nexus_shift_swap_requests:${key}`;
  }

  private static getTemplateStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "org-nexus-01";
    return `nexus_shift_templates:${key}`;
  }

  private static getOvertimeStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "org-nexus-01";
    return `nexus_overtime_templates:${key}`;
  }

  private static getAuditStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "org-nexus-01";
    return `nexus_schedule_audit:${key}`;
  }

  // ── AUDIT LOGGING ─────────────────────────────────────────────────────

  public static logAuditEvent(
    event: {
      action: string;
      actorId: string;
      actorName: string;
      targetId?: string;
      targetName?: string;
      details?: string;
    },
    orgId?: string,
  ): void {
    try {
      const key = this.getAuditStorageKey(orgId);
      const stored = localStorage.getItem(key);
      const list: ScheduleAuditItem[] = stored ? JSON.parse(stored) : [];
      const newAudit: ScheduleAuditItem = {
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action: event.action,
        actorId: event.actorId,
        actorName: event.actorName,
        targetId: event.targetId,
        targetName: event.targetName,
        details: event.details,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      list.unshift(newAudit);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to log schedule audit event", e);
    }
  }

  // ── SHIFT SWAP METHODS (TASK 9.3 ENHANCED) ────────────────────────────

  public static getShiftSwapRequests(orgId?: string): ShiftSwapRequest[] {
    try {
      const stored = localStorage.getItem(this.getSwapStorageKey(orgId));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load shift swap requests", e);
    }
    this.saveShiftSwapRequests(INITIAL_SWAP_REQUESTS, orgId);
    return INITIAL_SWAP_REQUESTS;
  }

  public static saveShiftSwapRequests(requests: ShiftSwapRequest[], orgId?: string): void {
    try {
      localStorage.setItem(this.getSwapStorageKey(orgId), JSON.stringify(requests));
    } catch (e) {
      console.error("Failed to save shift swap requests", e);
    }
  }

  public static validateSwapCompatibility(
    requesterName: string,
    targetEmployeeName: string,
    date: string,
    currentShiftName: string,
    requestedShiftName: string,
    existingRequests: ShiftSwapRequest[],
  ): { isValid: boolean; errorMessage?: string } {
    if (!targetEmployeeName || targetEmployeeName.trim() === "") {
      return { isValid: false, errorMessage: "Target employee is required." };
    }
    if (requesterName.toLowerCase() === targetEmployeeName.toLowerCase()) {
      return { isValid: false, errorMessage: "You cannot swap shifts with yourself." };
    }
    if (!date || date.trim() === "") {
      return { isValid: false, errorMessage: "Swap date is required." };
    }
    if (!currentShiftName || !requestedShiftName) {
      return { isValid: false, errorMessage: "Both current and requested shift types are required." };
    }
    if (currentShiftName.toLowerCase() === requestedShiftName.toLowerCase()) {
      return {
        isValid: false,
        errorMessage: "Requested shift cannot be identical to current shift.",
      };
    }

    const duplicate = existingRequests.find(
      (r) =>
        r.requesterName.toLowerCase() === requesterName.toLowerCase() &&
        r.date === date &&
        (r.status === "Pending" || r.status === "Manager Review"),
    );

    if (duplicate) {
      return {
        isValid: false,
        errorMessage: `An active swap request (${duplicate.id}) already exists for ${date}.`,
      };
    }

    return { isValid: true };
  }

  public static createSwapRequest(
    payload: {
      requesterId: string;
      requesterName: string;
      requesterDepartment: string;
      targetEmployeeId: string;
      targetEmployeeName: string;
      targetDepartment: string;
      date: string;
      currentShiftName: string;
      requestedShiftName: string;
      reason: string;
    },
    orgId: string = "org-nexus-01",
  ): ShiftSwapRequest {
    const existing = this.getShiftSwapRequests(orgId);

    const validation = this.validateSwapCompatibility(
      payload.requesterName,
      payload.targetEmployeeName,
      payload.date,
      payload.currentShiftName,
      payload.requestedShiftName,
      existing,
    );

    if (!validation.isValid) {
      throw new Error(validation.errorMessage || "Invalid swap request.");
    }

    const nextNumber = existing.length + 1;
    const reqId = `REQ-${String(nextNumber).padStart(3, "0")}`;
    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newRequest: ShiftSwapRequest = {
      id: reqId,
      organizationId: orgId,
      requesterId: payload.requesterId,
      requesterName: payload.requesterName,
      requesterDepartment: payload.requesterDepartment,
      targetEmployeeId: payload.targetEmployeeId,
      targetEmployeeName: payload.targetEmployeeName,
      targetDepartment: payload.targetDepartment,
      date: payload.date,
      currentShiftName: payload.currentShiftName,
      requestedShiftName: payload.requestedShiftName,
      reason: payload.reason,
      submittedAt: timestamp,
      status: "Pending",
      approvalHistory: [
        {
          id: `hist-${reqId}-1`,
          action: "SHIFT_SWAP_SUBMITTED",
          actorId: payload.requesterId,
          actorName: payload.requesterName,
          timestamp,
          comment: `Swap requested: ${payload.currentShiftName} ↔ ${payload.requestedShiftName}. Reason: ${payload.reason}`,
          newStatus: "Pending",
        },
      ],
      scheduleUpdateStatus: "Pending",
    };

    const updatedList = [newRequest, ...existing];
    this.saveShiftSwapRequests(updatedList, orgId);
    return newRequest;
  }

  public static validateManagerScope(
    managerDepartment: string | undefined,
    requestDepartment: string,
    hasGlobalManagePermission: boolean,
  ): { isAllowed: boolean; errorMessage?: string } {
    if (hasGlobalManagePermission) {
      return { isAllowed: true };
    }
    if (!managerDepartment) {
      return {
        isAllowed: false,
        errorMessage: "User department scope is missing. Approval denied.",
      };
    }
    if (managerDepartment.toLowerCase() !== requestDepartment.toLowerCase()) {
      return {
        isAllowed: false,
        errorMessage: `Manager scope restriction: You can only approve requests in ${managerDepartment}.`,
      };
    }
    return { isAllowed: true };
  }

  public static approveSwapRequest(
    requestId: string,
    managerId: string,
    managerName: string,
    managerDepartment: string,
    hasGlobalManagePermission: boolean,
    comments: string = "Approved by manager",
    orgId: string = "org-nexus-01",
  ): { success: boolean; request: ShiftSwapRequest; errorMessage?: string } {
    const list = this.getShiftSwapRequests(orgId);
    const index = list.findIndex((r) => r.id === requestId);

    if (index === -1) {
      return { success: false, request: null as any, errorMessage: "Request not found." };
    }

    const request = list[index];

    if (request.status !== "Pending" && request.status !== "Manager Review") {
      return {
        success: false,
        request,
        errorMessage: `Cannot approve request with status '${request.status}'.`,
      };
    }

    const scopeCheck = this.validateManagerScope(
      managerDepartment,
      request.requesterDepartment,
      hasGlobalManagePermission,
    );
    if (!scopeCheck.isAllowed) {
      return { success: false, request, errorMessage: scopeCheck.errorMessage };
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const previousStatus = request.status;
    const updatedRequest: ShiftSwapRequest = {
      ...request,
      status: "Approved",
      reviewedAt: timestamp,
      reviewedBy: managerId,
      reviewedByName: managerName,
      scheduleUpdateStatus: "Completed",
      approvalHistory: [
        ...request.approvalHistory,
        {
          id: `hist-${request.id}-${request.approvalHistory.length + 1}`,
          action: "SHIFT_SWAP_APPROVED",
          actorId: managerId,
          actorName: managerName,
          timestamp,
          comment: comments,
          previousStatus,
          newStatus: "Approved",
        },
        {
          id: `hist-${request.id}-${request.approvalHistory.length + 2}`,
          action: "SHIFT_SWAP_SCHEDULE_UPDATED",
          actorId: "system",
          actorName: "System Schedule Engine",
          timestamp,
          comment: `Schedules for ${request.requesterName} and ${request.targetEmployeeName} successfully swapped on ${request.date}.`,
          previousStatus: "Approved",
          newStatus: "Approved",
        },
      ],
    };

    list[index] = updatedRequest;
    this.saveShiftSwapRequests(list, orgId);
    return { success: true, request: updatedRequest };
  }

  public static rejectSwapRequest(
    requestId: string,
    managerId: string,
    managerName: string,
    managerDepartment: string,
    hasGlobalManagePermission: boolean,
    rejectionReason: string,
    orgId: string = "org-nexus-01",
  ): { success: boolean; request: ShiftSwapRequest; errorMessage?: string } {
    if (!rejectionReason || rejectionReason.trim() === "") {
      return { success: false, request: null as any, errorMessage: "Rejection reason is required." };
    }

    const list = this.getShiftSwapRequests(orgId);
    const index = list.findIndex((r) => r.id === requestId);

    if (index === -1) {
      return { success: false, request: null as any, errorMessage: "Request not found." };
    }

    const request = list[index];

    if (request.status !== "Pending" && request.status !== "Manager Review") {
      return {
        success: false,
        request,
        errorMessage: `Cannot reject request with status '${request.status}'.`,
      };
    }

    const scopeCheck = this.validateManagerScope(
      managerDepartment,
      request.requesterDepartment,
      hasGlobalManagePermission,
    );
    if (!scopeCheck.isAllowed) {
      return { success: false, request, errorMessage: scopeCheck.errorMessage };
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const previousStatus = request.status;
    const updatedRequest: ShiftSwapRequest = {
      ...request,
      status: "Rejected",
      reviewedAt: timestamp,
      reviewedBy: managerId,
      reviewedByName: managerName,
      rejectionReason: rejectionReason.trim(),
      approvalHistory: [
        ...request.approvalHistory,
        {
          id: `hist-${request.id}-${request.approvalHistory.length + 1}`,
          action: "SHIFT_SWAP_REJECTED",
          actorId: managerId,
          actorName: managerName,
          timestamp,
          comment: `Rejection Reason: ${rejectionReason.trim()}`,
          previousStatus,
          newStatus: "Rejected",
        },
      ],
    };

    list[index] = updatedRequest;
    this.saveShiftSwapRequests(list, orgId);
    return { success: true, request: updatedRequest };
  }

  public static cancelSwapRequest(
    requestId: string,
    actorId: string,
    actorName: string,
    orgId: string = "org-nexus-01",
  ): { success: boolean; request: ShiftSwapRequest; errorMessage?: string } {
    const list = this.getShiftSwapRequests(orgId);
    const index = list.findIndex((r) => r.id === requestId);

    if (index === -1) {
      return { success: false, request: null as any, errorMessage: "Request not found." };
    }

    const request = list[index];

    if (request.status !== "Pending" && request.status !== "Manager Review") {
      return {
        success: false,
        request,
        errorMessage: `Cannot cancel request with status '${request.status}'.`,
      };
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const previousStatus = request.status;
    const updatedRequest: ShiftSwapRequest = {
      ...request,
      status: "Cancelled",
      approvalHistory: [
        ...request.approvalHistory,
        {
          id: `hist-${request.id}-${request.approvalHistory.length + 1}`,
          action: "SHIFT_SWAP_CANCELLED",
          actorId,
          actorName,
          timestamp,
          comment: "Request cancelled by requester.",
          previousStatus,
          newStatus: "Cancelled",
        },
      ],
    };

    list[index] = updatedRequest;
    this.saveShiftSwapRequests(list, orgId);
    return { success: true, request: updatedRequest };
  }

  // ── SHIFT TEMPLATE METHODS (TASK 9.4) ────────────────────────────────

  public static getShiftTemplates(orgId?: string): ShiftTemplate[] {
    try {
      const stored = localStorage.getItem(this.getTemplateStorageKey(orgId));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load shift templates", e);
    }
    this.saveShiftTemplates(INITIAL_SHIFT_TEMPLATES, orgId);
    return INITIAL_SHIFT_TEMPLATES;
  }

  public static saveShiftTemplates(templates: ShiftTemplate[], orgId?: string): void {
    try {
      localStorage.setItem(this.getTemplateStorageKey(orgId), JSON.stringify(templates));
    } catch (e) {
      console.error("Failed to save shift templates", e);
    }
  }

  public static createShiftTemplate(
    payload: {
      name: string;
      description?: string;
      department: string;
      rotationType: "Weekly Rotation" | "Bi-weekly" | "Weekend Only" | "Custom Rotation";
      status: "Active" | "Disabled";
      shifts: ShiftDefinition[];
      weeklySchedule: Record<string, string>;
    },
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): ShiftTemplate {
    if (!payload.name || payload.name.trim() === "") {
      throw new Error("Template name is required.");
    }
    if (!payload.department) {
      throw new Error("Department is required.");
    }
    if (!payload.shifts || payload.shifts.length === 0) {
      throw new Error("At least one shift definition is required.");
    }

    // Check duplicate shift codes
    const codes = payload.shifts.map((s) => s.code.toUpperCase());
    if (new Set(codes).size !== codes.length) {
      throw new Error("Duplicate shift codes are not allowed.");
    }

    const existing = this.getShiftTemplates(orgId);

    // Duplicate template name check
    if (existing.some((t) => t.name.toLowerCase() === payload.name.trim().toLowerCase())) {
      throw new Error(`A template with name '${payload.name}' already exists.`);
    }

    const nextId = `TPL-${String(existing.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    const newTemplate: ShiftTemplate = {
      id: nextId,
      organizationId: orgId,
      name: payload.name.trim(),
      description: payload.description?.trim() || "",
      department: payload.department,
      rotationType: payload.rotationType,
      status: payload.status,
      badge: payload.status === "Active" ? "Active" : undefined,
      badgeColor: payload.status === "Active" ? "#059669" : undefined,
      badgeBg: payload.status === "Active" ? "#E6F4EA" : undefined,
      shifts: payload.shifts,
      weeklySchedule: payload.weeklySchedule,
      employeesCount: 0,
      createdBy: actorName,
      createdAt: today,
      updatedAt: today,
    };

    const updated = [newTemplate, ...existing];
    this.saveShiftTemplates(updated, orgId);

    this.logAuditEvent(
      {
        action: "SHIFT_TEMPLATE_CREATED",
        actorId,
        actorName,
        targetId: newTemplate.id,
        targetName: newTemplate.name,
        details: `Template '${newTemplate.name}' created for department ${newTemplate.department}.`,
      },
      orgId,
    );

    return newTemplate;
  }

  public static updateShiftTemplate(
    templateId: string,
    payload: Partial<ShiftTemplate>,
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): ShiftTemplate {
    const templates = this.getShiftTemplates(orgId);
    const index = templates.findIndex((t) => t.id === templateId);
    if (index === -1) {
      throw new Error("Template not found.");
    }

    const current = templates[index];
    const today = new Date().toISOString().split("T")[0];

    const updatedTemplate: ShiftTemplate = {
      ...current,
      ...payload,
      updatedAt: today,
    };

    templates[index] = updatedTemplate;
    this.saveShiftTemplates(templates, orgId);

    this.logAuditEvent(
      {
        action: "SHIFT_TEMPLATE_UPDATED",
        actorId,
        actorName,
        targetId: updatedTemplate.id,
        targetName: updatedTemplate.name,
        details: `Template '${updatedTemplate.name}' configuration updated.`,
      },
      orgId,
    );

    return updatedTemplate;
  }

  public static duplicateShiftTemplate(
    templateId: string,
    newName?: string,
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): ShiftTemplate {
    const templates = this.getShiftTemplates(orgId);
    const target = templates.find((t) => t.id === templateId);
    if (!target) {
      throw new Error("Source template not found.");
    }

    const dupName = newName?.trim() || `${target.name} (Copy)`;
    const nextId = `TPL-${String(templates.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    const duplicated: ShiftTemplate = {
      ...target,
      id: nextId,
      name: dupName,
      employeesCount: 0,
      createdBy: actorName,
      createdAt: today,
      updatedAt: today,
      lastAppliedAt: undefined,
      badge: "Recently Applied",
      badgeColor: "#0EA5E9",
      badgeBg: "#E0F2FE",
    };

    const updated = [duplicated, ...templates];
    this.saveShiftTemplates(updated, orgId);

    this.logAuditEvent(
      {
        action: "SHIFT_TEMPLATE_DUPLICATED",
        actorId,
        actorName,
        targetId: duplicated.id,
        targetName: duplicated.name,
        details: `Duplicated from '${target.name}'.`,
      },
      orgId,
    );

    return duplicated;
  }

  public static toggleTemplateStatus(
    templateId: string,
    newStatus: "Active" | "Disabled",
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): ShiftTemplate {
    return this.updateShiftTemplate(
      templateId,
      {
        status: newStatus,
        badge: newStatus === "Active" ? "Active" : undefined,
        badgeColor: newStatus === "Active" ? "#059669" : undefined,
        badgeBg: newStatus === "Active" ? "#E6F4EA" : undefined,
      },
      actorId,
      actorName,
      orgId,
    );
  }

  // ── APPLY SHIFT TEMPLATE WORKFLOW (TASK 9.4) ─────────────────────────

  public static previewApplyTemplate(
    payload: ApplyTemplatePayload,
    allEmployees: any[],
    existingOverrides: Record<string, any>,
    orgId: string = "org-nexus-01",
  ): {
    template: ShiftTemplate;
    targetEmployees: any[];
    dates: string[];
    conflicts: ConflictItem[];
    affectedEmployeesCount: number;
    affectedDaysCount: number;
  } {
    const templates = this.getShiftTemplates(orgId);
    const template = templates.find((t) => t.id === payload.templateId);

    if (!template) {
      throw new Error("Template not found.");
    }
    if (template.status === "Disabled") {
      throw new Error("Cannot apply a disabled shift template. Please enable the template first.");
    }
    if (!payload.startDate || !payload.endDate) {
      throw new Error("Start date and End date are required.");
    }

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (end < start) {
      throw new Error("End date cannot be before start date.");
    }

    // Determine target employees
    let targetEmployees = allEmployees;
    if (payload.scopeType === "Department") {
      const dept = payload.scopeValues[0] || template.department;
      if (dept && dept !== "All Departments") {
        targetEmployees = allEmployees.filter((e) => e.department.toLowerCase() === dept.toLowerCase());
      }
    } else if (payload.scopeType === "Employees" && payload.scopeValues.length > 0) {
      const scopeValueSet = new Set(payload.scopeValues);
      targetEmployees = allEmployees.filter((e) => scopeValueSet.has(e.id) || scopeValueSet.has(e.name));
    }

    // Build dates list
    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }

    const conflicts: ConflictItem[] = [];

    // Conflict detection pass
    targetEmployees.forEach((emp) => {
      dates.forEach((dateStr) => {
        const dObj = new Date(dateStr);
        const dayName = dObj.toLocaleDateString("en-US", { weekday: "short" });
        const proposedShiftName = template.weeklySchedule[dayName] || "Morning";

        const overrideKey = `${emp.name}_${dateStr}`;
        const existing = existingOverrides[overrideKey];

        if (existing && existing.type !== proposedShiftName) {
          conflicts.push({
            id: `conflict-${emp.id}-${dateStr}`,
            type: "Existing Shift",
            employeeId: emp.id,
            employeeName: emp.name,
            date: dateStr,
            currentAssignment: `${existing.type} (${existing.time})`,
            proposedAssignment: proposedShiftName,
          });
        }
      });
    });

    return {
      template,
      targetEmployees,
      dates,
      conflicts,
      affectedEmployeesCount: targetEmployees.length,
      affectedDaysCount: dates.length,
    };
  }

  public static applyShiftTemplate(
    payload: ApplyTemplatePayload,
    allEmployees: any[],
    existingOverrides: Record<string, any>,
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): ApplyTemplateResult {
    const preview = this.previewApplyTemplate(payload, allEmployees, existingOverrides, orgId);

    const newOverrides = { ...existingOverrides };
    let appliedCount = 0;
    let skippedCount = 0;

    preview.targetEmployees.forEach((emp) => {
      preview.dates.forEach((dateStr) => {
        const dObj = new Date(dateStr);
        const dayName = dObj.toLocaleDateString("en-US", { weekday: "short" });
        const proposedShiftType = (preview.template.weeklySchedule[dayName] || "Morning") as "Morning" | "Evening" | "Night" | "Full Day" | "Off Day";

        const overrideKey = `${emp.name}_${dateStr}`;
        const hasConflict = preview.conflicts.some((c) => c.employeeId === emp.id && c.date === dateStr);

        if (hasConflict && !payload.overrideConflicts) {
          skippedCount++;
          return;
        }

        let time = "09:00 - 18:00";
        if (proposedShiftType === "Morning") time = "06:00 - 14:00";
        if (proposedShiftType === "Evening") time = "14:00 - 22:00";
        if (proposedShiftType === "Night") time = "22:00 - 06:00";

        newOverrides[overrideKey] = {
          type: proposedShiftType,
          time,
        };
        appliedCount++;
      });
    });

    // Update Template lastAppliedAt metadata
    const today = new Date().toISOString().split("T")[0];
    this.updateShiftTemplate(
      preview.template.id,
      {
        lastAppliedAt: today,
        employeesCount: preview.targetEmployees.length,
      },
      actorId,
      actorName,
      orgId,
    );

    this.logAuditEvent(
      {
        action: "SHIFT_TEMPLATE_APPLIED",
        actorId,
        actorName,
        targetId: preview.template.id,
        targetName: preview.template.name,
        details: `Template '${preview.template.name}' applied to ${preview.targetEmployees.length} employees across ${preview.dates.length} days.`,
      },
      orgId,
    );

    return {
      success: true,
      appliedCount,
      skippedCount,
      conflictCount: preview.conflicts.length,
      conflicts: preview.conflicts,
      appliedOverrides: newOverrides,
      message: `'${preview.template.name}' applied successfully to ${preview.targetEmployees.length} employees across ${preview.dates.length} days.`,
    };
  }

  // ── EDITABLE OVERTIME TEMPLATE METHODS (TASK 9.4) ────────────────────

  public static getOvertimeTemplates(orgId?: string): OvertimeTemplate[] {
    try {
      const stored = localStorage.getItem(this.getOvertimeStorageKey(orgId));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load overtime templates", e);
    }
    this.saveOvertimeTemplates(INITIAL_OVERTIME_TEMPLATES, orgId);
    return INITIAL_OVERTIME_TEMPLATES;
  }

  public static saveOvertimeTemplates(templates: OvertimeTemplate[], orgId?: string): void {
    try {
      localStorage.setItem(this.getOvertimeStorageKey(orgId), JSON.stringify(templates));
    } catch (e) {
      console.error("Failed to save overtime templates", e);
    }
  }

  public static validateOvertimeTemplate(payload: Partial<OvertimeTemplate>): void {
    if (!payload.name || payload.name.trim() === "") {
      throw new Error("Overtime template name is required.");
    }
    if (payload.maxDailyOvertimeHours === undefined || payload.maxDailyOvertimeHours < 0) {
      throw new Error("Maximum daily overtime hours cannot be negative.");
    }
    if (payload.maxWeeklyOvertimeHours === undefined || payload.maxWeeklyOvertimeHours < payload.maxDailyOvertimeHours) {
      throw new Error("Maximum weekly overtime hours cannot be less than daily overtime limit.");
    }
    if (payload.minOvertimeDurationMinutes === undefined || payload.minOvertimeDurationMinutes < 0) {
      throw new Error("Minimum overtime duration cannot be negative.");
    }
    if (payload.overtimeRateMultiplier === undefined || payload.overtimeRateMultiplier < 1.0) {
      throw new Error("Overtime rate multiplier must be at least 1.0 (e.g. 1.5x).");
    }
    if (payload.effectiveFrom && payload.effectiveTo) {
      if (new Date(payload.effectiveTo) < new Date(payload.effectiveFrom)) {
        throw new Error("Effective end date cannot be before effective start date.");
      }
    }
  }

  public static createOvertimeTemplate(
    payload: {
      name: string;
      description?: string;
      maxDailyOvertimeHours: number;
      maxWeeklyOvertimeHours: number;
      minOvertimeDurationMinutes: number;
      overtimeApprovalRequired: boolean;
      overtimeRateMultiplier: number;
      eligibleShiftTypes: string[];
      effectiveFrom: string;
      effectiveTo?: string;
      status: "Active" | "Disabled";
    },
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): OvertimeTemplate {
    this.validateOvertimeTemplate(payload);

    const existing = this.getOvertimeTemplates(orgId);
    const nextId = `OT-TPL-${String(existing.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    const newOtTemplate: OvertimeTemplate = {
      id: nextId,
      organizationId: orgId,
      name: payload.name.trim(),
      description: payload.description?.trim() || "",
      maxDailyOvertimeHours: payload.maxDailyOvertimeHours,
      maxWeeklyOvertimeHours: payload.maxWeeklyOvertimeHours,
      minOvertimeDurationMinutes: payload.minOvertimeDurationMinutes,
      overtimeApprovalRequired: payload.overtimeApprovalRequired,
      overtimeRateMultiplier: payload.overtimeRateMultiplier,
      eligibleShiftTypes: payload.eligibleShiftTypes || ["Morning", "Evening", "Night"],
      effectiveFrom: payload.effectiveFrom || today,
      effectiveTo: payload.effectiveTo,
      status: payload.status,
      createdBy: actorName,
      createdAt: today,
      updatedAt: today,
    };

    const updated = [newOtTemplate, ...existing];
    this.saveOvertimeTemplates(updated, orgId);

    this.logAuditEvent(
      {
        action: "OVERTIME_TEMPLATE_CREATED",
        actorId,
        actorName,
        targetId: newOtTemplate.id,
        targetName: newOtTemplate.name,
        details: `Overtime template '${newOtTemplate.name}' created.`,
      },
      orgId,
    );

    return newOtTemplate;
  }

  public static updateOvertimeTemplate(
    templateId: string,
    payload: Partial<OvertimeTemplate>,
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): OvertimeTemplate {
    const list = this.getOvertimeTemplates(orgId);
    const index = list.findIndex((t) => t.id === templateId);
    if (index === -1) {
      throw new Error("Overtime template not found.");
    }

    const merged = { ...list[index], ...payload };
    this.validateOvertimeTemplate(merged);

    const today = new Date().toISOString().split("T")[0];
    const updated: OvertimeTemplate = {
      ...merged,
      updatedAt: today,
    };

    list[index] = updated;
    this.saveOvertimeTemplates(list, orgId);

    this.logAuditEvent(
      {
        action: "OVERTIME_TEMPLATE_UPDATED",
        actorId,
        actorName,
        targetId: updated.id,
        targetName: updated.name,
        details: `Overtime template '${updated.name}' updated.`,
      },
      orgId,
    );

    return updated;
  }

  public static duplicateOvertimeTemplate(
    templateId: string,
    newName?: string,
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): OvertimeTemplate {
    const list = this.getOvertimeTemplates(orgId);
    const target = list.find((t) => t.id === templateId);
    if (!target) {
      throw new Error("Source overtime template not found.");
    }

    const dupName = newName?.trim() || `${target.name} (Copy)`;
    const nextId = `OT-TPL-${String(list.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    const duplicated: OvertimeTemplate = {
      ...target,
      id: nextId,
      name: dupName,
      createdBy: actorName,
      createdAt: today,
      updatedAt: today,
    };

    const updated = [duplicated, ...list];
    this.saveOvertimeTemplates(updated, orgId);

    this.logAuditEvent(
      {
        action: "OVERTIME_TEMPLATE_DUPLICATED",
        actorId,
        actorName,
        targetId: duplicated.id,
        targetName: duplicated.name,
        details: `Duplicated from '${target.name}'.`,
      },
      orgId,
    );

    return duplicated;
  }

  public static toggleOvertimeTemplateStatus(
    templateId: string,
    newStatus: "Active" | "Disabled",
    actorId: string = "system",
    actorName: string = "Admin",
    orgId: string = "org-nexus-01",
  ): OvertimeTemplate {
    return this.updateOvertimeTemplate(
      templateId,
      { status: newStatus },
      actorId,
      actorName,
      orgId,
    );
  }
}
