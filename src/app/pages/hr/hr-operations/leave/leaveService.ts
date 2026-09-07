import {
  LeaveRequest,
  ApprovalLayerType,
  ApprovalRole,
  ApprovalStageConfig,
  ApprovalWorkflowConfig,
  ApprovalStageRecord,
  WorkflowStatus,
} from "./types";
import { P } from "../../../../shared/permission-engine/permissions";

export const WORKFLOW_CONFIGS: Record<ApprovalLayerType, ApprovalWorkflowConfig> = {
  SINGLE: {
    layerType: "SINGLE",
    stages: [
      { stageId: "stage_tl", stageOrder: 1, role: "TL", label: "Team Lead Approval" },
    ],
  },
  DOUBLE: {
    layerType: "DOUBLE",
    stages: [
      { stageId: "stage_tl", stageOrder: 1, role: "TL", label: "Team Lead Approval" },
      { stageId: "stage_mgr", stageOrder: 2, role: "MANAGER", label: "Manager Approval" },
    ],
  },
  THIRD: {
    layerType: "THIRD",
    stages: [
      { stageId: "stage_tl", stageOrder: 1, role: "TL", label: "Team Lead Approval" },
      { stageId: "stage_hr", stageOrder: 2, role: "HR", label: "HR Review" },
      { stageId: "stage_mgr", stageOrder: 3, role: "MANAGER", label: "Manager Final Approval" },
    ],
  },
};

export class LeaveService {
  private static getSettingsStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "default";
    return `viyan_leave_settings:${key}`;
  }

  private static getRecordsStorageKey(orgId?: string): string {
    const key = orgId && orgId.trim() !== "" ? orgId : "default";
    return `viyan_leave_records:${key}`;
  }

  /**
   * Get active tenant approval workflow configuration
   */
  public static getWorkflowConfig(orgId?: string): ApprovalWorkflowConfig {
    try {
      const stored = localStorage.getItem(this.getSettingsStorageKey(orgId));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.layerType && WORKFLOW_CONFIGS[parsed.layerType as ApprovalLayerType]) {
          return WORKFLOW_CONFIGS[parsed.layerType as ApprovalLayerType];
        }
      }
    } catch (e) {
      console.warn("Failed to parse stored leave workflow config, using default DOUBLE layer.", e);
    }
    return WORKFLOW_CONFIGS.DOUBLE; // Default requirement: DOUBLE layer (TL -> Manager)
  }

  /**
   * Save tenant approval workflow configuration (e.g. from Super Admin settings)
   */
  public static saveWorkflowConfig(
    layerType: ApprovalLayerType,
    orgId?: string
  ): ApprovalWorkflowConfig {
    const config = WORKFLOW_CONFIGS[layerType];
    try {
      localStorage.setItem(
        this.getSettingsStorageKey(orgId),
        JSON.stringify({ layerType: config.layerType, updatedAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error("Failed to persist leave workflow config to localStorage.", e);
    }
    return config;
  }

  /**
   * Normalize leave request with stageRecords matching active workflow configuration
   */
  public static normalizeRequest(
    req: LeaveRequest,
    config: ApprovalWorkflowConfig
  ): LeaveRequest {
    let stageRecords: ApprovalStageRecord[] = req.stageRecords || [];

    // Ensure stageRecords matches config.stages
    if (stageRecords.length === 0 || stageRecords.length !== config.stages.length) {
      stageRecords = config.stages.map((stg) => {
        let stgStatus: "PENDING" | "APPROVED" | "REJECTED" = "PENDING";
        if (req.status === "Approved") {
          stgStatus = "APPROVED";
        } else if (req.status === "Rejected") {
          if (stg.role === "TL" && req.managerApproval === "Rejected") stgStatus = "REJECTED";
          else if (stg.role === "MANAGER" && req.managerApproval === "Rejected") stgStatus = "REJECTED";
          else if (stg.role === "HR" && req.hrApproval === "Rejected") stgStatus = "REJECTED";
        } else {
          if (stg.role === "TL" && (req.managerApproval === "Approved" || req.hrApproval === "Approved")) stgStatus = "APPROVED";
          else if (stg.role === "HR" && req.hrApproval === "Approved") stgStatus = "APPROVED";
          else if (stg.role === "MANAGER" && req.managerApproval === "Approved" && req.hrApproval === "Approved") stgStatus = "APPROVED";
        }

        return {
          stageId: stg.stageId,
          stageOrder: stg.stageOrder,
          role: stg.role,
          label: stg.label,
          status: stgStatus,
        };
      });
    }

    // Determine current active stage role
    let currentRole: ApprovalRole | null = null;
    let workflowStatus: WorkflowStatus = "PENDING_TL";

    if (req.status === "Approved") {
      workflowStatus = "APPROVED";
      currentRole = null;
    } else if (req.status === "Rejected") {
      workflowStatus = "REJECTED";
      currentRole = null;
    } else {
      const activeStage = stageRecords.find((s) => s.status === "PENDING");
      if (activeStage) {
        currentRole = activeStage.role;
        workflowStatus = `PENDING_${activeStage.role}` as WorkflowStatus;
      } else {
        workflowStatus = "APPROVED";
        currentRole = null;
      }
    }

    return {
      ...req,
      stageRecords,
      currentStageRole: currentRole || undefined,
      workflowStatus,
    };
  }

  /**
   * Get all tenant leave requests with normalized workflow stages
   */
  public static getLeaveRequests(
    orgId?: string,
    initialFallback: LeaveRequest[] = []
  ): LeaveRequest[] {
    const config = this.getWorkflowConfig(orgId);
    try {
      const stored = localStorage.getItem(this.getRecordsStorageKey(orgId));
      if (stored) {
        const parsed: LeaveRequest[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r) => this.normalizeRequest(r, config));
        }
      }
    } catch (e) {
      console.warn("Failed to parse stored leave records, initializing default dataset.", e);
    }

    // Initialize default fallback records
    const normalizedFallback = initialFallback.map((r) => this.normalizeRequest(r, config));
    this.saveLeaveRequests(normalizedFallback, orgId);
    return normalizedFallback;
  }

  /**
   * Persist leave requests to tenant storage
   */
  public static saveLeaveRequests(requests: LeaveRequest[], orgId?: string): void {
    try {
      localStorage.setItem(this.getRecordsStorageKey(orgId), JSON.stringify(requests));
    } catch (e) {
      console.error("Failed to save leave records to localStorage.", e);
    }
  }

  /**
   * Determine if a user can approve the current active stage of a request
   */
  public static canUserApprove(
    req: LeaveRequest,
    hasPermissionKey: (key: string) => boolean,
    userRoleName?: string
  ): { canApprove: boolean; reason?: string } {
    if (req.status === "Approved") {
      return { canApprove: false, reason: "Request is already fully approved." };
    }
    if (req.status === "Rejected") {
      return { canApprove: false, reason: "Request has been rejected." };
    }

    const currentRole = req.currentStageRole || "TL";
    const hasFullAdmin =
      hasPermissionKey(P.LEAVE_FULL) ||
      hasPermissionKey(P.LEAVE_MANAGE) ||
      (userRoleName && userRoleName.toLowerCase().includes("super"));

    if (hasFullAdmin) {
      return { canApprove: true };
    }

    // Role-specific stage enforcement
    if (currentRole === "TL") {
      const canTl =
        hasPermissionKey(P.LEAVE_APPROVE_TEAM) ||
        hasPermissionKey(P.LEAVE_APPROVE) ||
        hasPermissionKey(P.LEAVE_RECOMMEND);
      if (!canTl) return { canApprove: false, reason: "Requires Team Lead approval permission." };
      return { canApprove: true };
    }

    if (currentRole === "HR") {
      const canHr =
        hasPermissionKey(P.LEAVE_APPROVE_DEPT) ||
        hasPermissionKey(P.LEAVE_MANAGE) ||
        hasPermissionKey(P.LEAVE_APPROVE);
      if (!canHr) return { canApprove: false, reason: "Requires HR approval permission." };
      return { canApprove: true };
    }

    if (currentRole === "MANAGER") {
      const canMgr =
        hasPermissionKey(P.LEAVE_APPROVE_TEAM) ||
        hasPermissionKey(P.LEAVE_APPROVE_DEPT) ||
        hasPermissionKey(P.LEAVE_APPROVE);
      if (!canMgr) return { canApprove: false, reason: "Requires Manager approval permission." };
      return { canApprove: true };
    }

    return { canApprove: false, reason: "Unauthorized stage approval." };
  }

  /**
   * Approve current stage of a leave request
   */
  public static approveRequest(
    reqId: string,
    approverName: string,
    comment?: string,
    orgId?: string,
    initialFallback: LeaveRequest[] = []
  ): { updatedRequests: LeaveRequest[]; updatedReq?: LeaveRequest; isFullyApproved: boolean } {
    const config = this.getWorkflowConfig(orgId);
    const requests = this.getLeaveRequests(orgId, initialFallback);
    let updatedReq: LeaveRequest | undefined;
    let isFullyApproved = false;

    const updatedRequests = requests.map((r) => {
      if (r.id !== reqId) return r;

      const norm = this.normalizeRequest(r, config);
      const stageRecords = [...(norm.stageRecords || [])];
      const activeIndex = stageRecords.findIndex((s) => s.status === "PENDING");

      if (activeIndex === -1) {
        return norm; // Already completed or invalid state
      }

      const activeStage = stageRecords[activeIndex];
      const nowIso = new Date().toISOString();
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Update active stage record
      stageRecords[activeIndex] = {
        ...activeStage,
        status: "APPROVED",
        approverName,
        actedAt: nowIso,
        comment,
      };

      const newHistory = [
        ...norm.history,
        {
          date: nowTimeStr,
          action: `${activeStage.label} Approved`,
          by: approverName,
          comment: comment || "Approved",
        },
      ];

      // Check if there is a next stage in workflow
      const nextIndex = activeIndex + 1;
      let finalStatus: "Pending" | "Approved" | "Rejected" = "Pending";
      let nextRole: ApprovalRole | undefined = undefined;

      if (nextIndex < stageRecords.length) {
        nextRole = stageRecords[nextIndex].role;
        finalStatus = "Pending";
      } else {
        // Final stage completed!
        finalStatus = "Approved";
        nextRole = undefined;
        isFullyApproved = true;
      }

      updatedReq = {
        ...norm,
        stageRecords,
        status: finalStatus,
        managerApproval: finalStatus === "Approved" ? "Approved" : norm.managerApproval,
        hrApproval: finalStatus === "Approved" ? "Approved" : norm.hrApproval,
        workflowStatus: finalStatus === "Approved" ? "APPROVED" : (`PENDING_${nextRole}` as WorkflowStatus),
        currentStageRole: nextRole,
        history: newHistory,
      };

      return updatedReq;
    });

    this.saveLeaveRequests(updatedRequests, orgId);
    return { updatedRequests, updatedReq, isFullyApproved };
  }

  /**
   * Reject current stage of a leave request
   */
  public static rejectRequest(
    reqId: string,
    approverName: string,
    comment?: string,
    orgId?: string,
    initialFallback: LeaveRequest[] = []
  ): { updatedRequests: LeaveRequest[]; updatedReq?: LeaveRequest } {
    const config = this.getWorkflowConfig(orgId);
    const requests = this.getLeaveRequests(orgId, initialFallback);
    let updatedReq: LeaveRequest | undefined;

    const updatedRequests = requests.map((r) => {
      if (r.id !== reqId) return r;

      const norm = this.normalizeRequest(r, config);
      const stageRecords = [...(norm.stageRecords || [])];
      const activeIndex = stageRecords.findIndex((s) => s.status === "PENDING");

      if (activeIndex !== -1) {
        stageRecords[activeIndex] = {
          ...stageRecords[activeIndex],
          status: "REJECTED",
          approverName,
          actedAt: new Date().toISOString(),
          comment,
        };
      }

      const nowTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const activeLabel = activeIndex !== -1 ? stageRecords[activeIndex].label : "Stage";

      const newHistory = [
        ...norm.history,
        {
          date: nowTimeStr,
          action: `${activeLabel} Rejected`,
          by: approverName,
          comment: comment || "Rejected",
        },
      ];

      updatedReq = {
        ...norm,
        stageRecords,
        status: "Rejected",
        managerApproval: "Rejected",
        hrApproval: "Rejected",
        workflowStatus: "REJECTED",
        currentStageRole: undefined,
        history: newHistory,
      };

      return updatedReq;
    });

    this.saveLeaveRequests(updatedRequests, orgId);
    return { updatedRequests, updatedReq };
  }
}
