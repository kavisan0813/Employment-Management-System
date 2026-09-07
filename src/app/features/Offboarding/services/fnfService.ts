import {
  OFFBOARDING_EXITS_KEY,
  OFFBOARDING_UPDATED_EVENT,
  areAllClearancesComplete,
  EXIT_STATUS,
} from "./offboardingWorkflow";
import type { ExitEmployee } from "../types/offboarding.types";
import { EXITS } from "../data/mockExits";

export type CanonicalSettlementStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "SENT_BACK";

export type CanonicalPaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED";

export interface FnFAuditEvent {
  id: string;
  event: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  dateStr: string;
  reason?: string;
  comment?: string;
  metadata?: Record<string, any>;
}

export interface FnFSettlement {
  id: string; // e.g. "FNF-2026-001" or exit id
  exitId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  lwd: string;
  joiningDate?: string;
  exitReason?: string;

  // Earnings
  salary: number;
  gratuity: number;
  leaveEncashment: number;
  reimbursements: number;
  bonus: number;
  incentives: number;
  otherEarnings: number;
  grossSettlement: number;

  // Deductions
  noticePeriodRecovery: number;
  loanRecovery: number;
  assetRecovery: number;
  taxDeduction: number;
  pfEsiAdjustment: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net Amount
  netSettlementPayable: number;

  // Lifecycle Statuses
  settlementStatus: CanonicalSettlementStatus;
  paymentStatus: CanonicalPaymentStatus;

  // Approval Metadata
  approvedBy?: string;
  approvedDate?: string;

  // Send Back Metadata
  sendBackReason?: string;
  sendBackComment?: string;
  sendBackDate?: string;

  // Payment Execution Metadata
  paymentDate?: string;
  paymentReference?: string; // UTR Number
  paymentMethod?: string;
  bankAccountDetails?: string;
  paymentFailureReason?: string;

  // History & Audit Log
  history: FnFAuditEvent[];

  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PREFIX = "viyan_fnf_settlements:";

export function normalizeSettlementStatus(rawStatus?: string): CanonicalSettlementStatus {
  if (!rawStatus) return "PENDING_REVIEW";
  const s = rawStatus.trim().toLowerCase();
  if (s === "draft") return "DRAFT";
  if (s === "approved" || s === "approved & processed" || s === "finance complete") return "APPROVED";
  if (s === "sent_back" || s.includes("sent back")) return "SENT_BACK";
  if (s === "under_review") return "UNDER_REVIEW";
  return "PENDING_REVIEW";
}

export function normalizePaymentStatus(rawPaymentStatus?: string, settlementStatus?: CanonicalSettlementStatus): CanonicalPaymentStatus {
  if (!rawPaymentStatus) {
    if (settlementStatus === "APPROVED") return "PENDING";
    return "PENDING";
  }
  const p = rawPaymentStatus.trim().toUpperCase();
  if (p === "PAID") return "PAID";
  if (p === "PROCESSING") return "PROCESSING";
  if (p === "FAILED") return "FAILED";
  return "PENDING";
}

export function getFnFStorageKey(orgId?: string): string {
  return `${STORAGE_PREFIX}${orgId || "default"}`;
}

export const fnfService = {
  /**
   * Get all settlements for an organization, seamlessly initializing/syncing from offboarding exits
   */
  getSettlements(orgId?: string): FnFSettlement[] {
    const storageKey = getFnFStorageKey(orgId);
    const stored = localStorage.getItem(storageKey);
    let settlements: FnFSettlement[] = [];

    if (stored) {
      try {
        settlements = JSON.parse(stored);
      } catch {
        settlements = [];
      }
    }

    // Sync with main offboarding exits to ensure all offboarding records are represented
    const rawExitsSaved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    let exits: ExitEmployee[] = EXITS;
    if (rawExitsSaved) {
      try {
        exits = JSON.parse(rawExitsSaved);
      } catch {
        exits = EXITS;
      }
    }

    let hasNewOrUpdated = false;
    const nowStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const nowTimeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    exits.forEach((exit, index) => {
      const existingIdx = settlements.findIndex((s) => s.exitId === exit.id || s.employeeName === exit.name);
      const gross =
        (exit.salary || 0) +
        (exit.gratuity || 0) +
        (exit.leaveEncashment || 0) +
        (exit.reimbursements || 0) +
        (exit.bonus || 0) +
        (exit.incentives || 0) +
        (exit.otherEarnings || 0);

      const deductionsTotal =
        (exit.noticePeriodRecovery || 0) +
        (exit.loanRecovery || 0) +
        (exit.assetRecovery || 0) +
        (exit.taxDeduction || 0) +
        (exit.pfEsiAdjustment || 0) +
        (exit.otherDeductions || exit.deductions || 0);

      const net = gross - deductionsTotal;

      if (existingIdx === -1) {
        // Create initial settlement mapping
        const isApproved = exit.ffStatus === "Approved & Processed" || exit.workflowStatus === EXIT_STATUS.FINANCE_COMPLETE;
        const initialSettlementStatus: CanonicalSettlementStatus = isApproved
          ? "APPROVED"
          : exit.ffStatus === "Sent Back to HR"
          ? "SENT_BACK"
          : exit.ffStatus === "Draft"
          ? "DRAFT"
          : "PENDING_REVIEW";

        const initialPaymentStatus: CanonicalPaymentStatus = isApproved ? "PAID" : "PENDING";

        const empId = `EMP-${(100 + index + 1).toString().padStart(3, "0")}`;
        const fnfId = `FNF-2026-${(index + 1).toString().padStart(3, "0")}`;

        const newRecord: FnFSettlement = {
          id: fnfId,
          exitId: exit.id,
          employeeId: empId,
          employeeName: exit.name,
          department: exit.department,
          designation: exit.designation,
          lwd: exit.lwd,
          joiningDate: exit.acceptedDate || "Jan 15, 2022",
          exitReason: exit.reason || exit.type || "Resignation",
          salary: exit.salary || 0,
          gratuity: exit.gratuity || 0,
          leaveEncashment: exit.leaveEncashment || 0,
          reimbursements: exit.reimbursements || 0,
          bonus: exit.bonus || 0,
          incentives: exit.incentives || 0,
          otherEarnings: exit.otherEarnings || 0,
          grossSettlement: gross,
          noticePeriodRecovery: exit.noticePeriodRecovery || 0,
          loanRecovery: exit.loanRecovery || 0,
          assetRecovery: exit.assetRecovery || 0,
          taxDeduction: exit.taxDeduction || 0,
          pfEsiAdjustment: exit.pfEsiAdjustment || 0,
          otherDeductions: exit.otherDeductions || exit.deductions || 0,
          totalDeductions: deductionsTotal,
          netSettlementPayable: net > 0 ? net : exit.netAmount || 0,
          settlementStatus: initialSettlementStatus,
          paymentStatus: initialPaymentStatus,
          approvedBy: exit.ffApprovedBy || (isApproved ? "Finance Manager" : undefined),
          approvedDate: exit.ffApprovedDate || (isApproved ? "Mar 25, 2026" : undefined),
          paymentDate: isApproved ? exit.ffApprovedDate || "Mar 25, 2026" : undefined,
          paymentReference: isApproved ? "UTR-88392019482" : undefined,
          paymentMethod: isApproved ? "Bank Transfer (NEFT)" : undefined,
          history: [
            {
              id: `evt-init-${Date.now()}-${index}`,
              event: "Settlement Record Initialized",
              actorId: "system",
              actorName: "System",
              timestamp: `${nowStr} ${nowTimeStr}`,
              dateStr: nowStr,
              comment: "F&F Settlement initialized from Offboarding exit record.",
            },
            ...(isApproved
              ? [
                  {
                    id: `evt-app-${Date.now()}-${index}`,
                    event: "F&F Settlement Approved & Payment Completed",
                    actorId: "fin-mgr",
                    actorName: exit.ffApprovedBy || "Finance Manager",
                    timestamp: "Mar 25, 2026 11:30 AM",
                    dateStr: "Mar 25, 2026",
                    comment: "Full and Final settlement processed and disbursement verified.",
                  },
                ]
              : []),
          ],
          organizationId: orgId || "default",
          createdAt: exit.createdDate || "2026-03-01T10:00:00.000Z",
          updatedAt: new Date().toISOString(),
        };

        settlements.push(newRecord);
        hasNewOrUpdated = true;
      }
    });

    if (hasNewOrUpdated || !stored) {
      localStorage.setItem(storageKey, JSON.stringify(settlements));
    }

    return settlements;
  },

  /**
   * Save / sync single settlement update
   */
  saveSettlement(orgId: string | undefined, settlement: FnFSettlement, actor?: { id: string; name: string }): FnFSettlement {
    const settlements = this.getSettlements(orgId);
    const index = settlements.findIndex((s) => s.id === settlement.id || s.exitId === settlement.exitId);

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Recalculate totals
    const gross =
      settlement.salary +
      settlement.gratuity +
      settlement.leaveEncashment +
      settlement.reimbursements +
      settlement.bonus +
      settlement.incentives +
      settlement.otherEarnings;

    const deductionsTotal =
      settlement.noticePeriodRecovery +
      settlement.loanRecovery +
      settlement.assetRecovery +
      settlement.taxDeduction +
      settlement.pfEsiAdjustment +
      settlement.otherDeductions;

    const net = gross - deductionsTotal;

    const updatedRecord: FnFSettlement = {
      ...settlement,
      grossSettlement: gross,
      totalDeductions: deductionsTotal,
      netSettlementPayable: net,
      updatedAt: new Date().toISOString(),
    };

    if (index !== -1) {
      settlements[index] = updatedRecord;
    } else {
      settlements.push(updatedRecord);
    }

    const storageKey = getFnFStorageKey(orgId);
    localStorage.setItem(storageKey, JSON.stringify(settlements));

    // Also update parent Exit record in offboarding
    this.syncToOffboardingExit(updatedRecord);
    window.dispatchEvent(new Event(OFFBOARDING_UPDATED_EVENT));

    return updatedRecord;
  },

  /**
   * Approve F&F Settlement (Hard clearance gate check required)
   */
  approveSettlement(
    orgId: string | undefined,
    id: string,
    actor: { id: string; name: string },
    comment?: string
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    // Check clearance hard gate
    const rawExitsSaved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    if (rawExitsSaved) {
      try {
        const exits: ExitEmployee[] = JSON.parse(rawExitsSaved);
        const parentExit = exits.find((e) => e.id === target.exitId || e.name === target.employeeName);
        if (parentExit && !areAllClearancesComplete(parentExit)) {
          return {
            success: false,
            message: "F&F settlement cannot be approved until all departmental clearances are completed.",
          };
        }
      } catch (err) {
        console.error("Error reading exits for clearance check", err);
      }
    }

    if (target.settlementStatus === "APPROVED") {
      return { success: false, message: "Settlement is already approved." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-app-${Date.now()}`,
      event: "FNF_SETTLEMENT_APPROVED",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: comment || "Full & Final settlement calculation approved by Finance.",
    };

    const updated: FnFSettlement = {
      ...target,
      settlementStatus: "APPROVED",
      paymentStatus: target.paymentStatus === "PAID" ? "PAID" : "PENDING",
      approvedBy: actor.name,
      approvedDate: dateStr,
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: "F&F Settlement approved successfully. Payment status set to PENDING.",
      settlement: updated,
    };
  },

  /**
   * Send Back F&F Settlement to HR / Reviewer with mandatory reason
   */
  sendBackSettlement(
    orgId: string | undefined,
    id: string,
    reason: string,
    comment: string,
    actor: { id: string; name: string }
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    if (!reason || !reason.trim()) {
      return { success: false, message: "Mandatory reason required for sending back settlement." };
    }

    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-sb-${Date.now()}`,
      event: "FNF_SETTLEMENT_SENT_BACK",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      reason,
      comment,
    };

    const updated: FnFSettlement = {
      ...target,
      settlementStatus: "SENT_BACK",
      sendBackReason: reason,
      sendBackComment: comment,
      sendBackDate: dateStr,
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: `Settlement sent back to HR/Reviewer for reason: ${reason}`,
      settlement: updated,
    };
  },

  /**
   * Resubmit a SENT_BACK settlement back into PENDING_REVIEW
   */
  resubmitSettlement(
    orgId: string | undefined,
    id: string,
    actor: { id: string; name: string },
    comment?: string
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    if (target.settlementStatus !== "SENT_BACK") {
      return { success: false, message: "Only SENT_BACK settlements can be resubmitted." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-resub-${Date.now()}`,
      event: "FNF_SETTLEMENT_RESUBMITTED",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: comment || "Settlement corrections updated and resubmitted for Finance review.",
    };

    const updated: FnFSettlement = {
      ...target,
      settlementStatus: "PENDING_REVIEW",
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: "Settlement resubmitted for Finance review.",
      settlement: updated,
    };
  },

  /**
   * Start Payment Processing (APPROVED -> Payment Status = PROCESSING)
   */
  startPayment(
    orgId: string | undefined,
    id: string,
    actor: { id: string; name: string },
    comment?: string
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    if (target.settlementStatus !== "APPROVED") {
      return { success: false, message: "Settlement must be APPROVED before starting payment processing." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-pay-start-${Date.now()}`,
      event: "FNF_PAYMENT_PROCESSING_STARTED",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: comment || "Payment processing instruction dispatched to finance queue.",
    };

    const updated: FnFSettlement = {
      ...target,
      paymentStatus: "PROCESSING",
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: "Payment processing started. Workflow status set to PROCESSING.",
      settlement: updated,
    };
  },

  /**
   * Mark Payment as PAID with payment reference & bank details.
   * Automatically triggers Finance Complete transition if all conditions met!
   */
  markPaymentPaid(
    orgId: string | undefined,
    id: string,
    paymentDetails: {
      paymentDate: string;
      paymentReference: string;
      paymentMethod: string;
      bankAccountDetails?: string;
    },
    actor: { id: string; name: string },
    comment?: string
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    if (!paymentDetails.paymentDate || !paymentDetails.paymentReference) {
      return { success: false, message: "Payment Date and UTR / Reference Number are required." };
    }

    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    if (target.settlementStatus !== "APPROVED") {
      return { success: false, message: "Settlement must be APPROVED to complete payment." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-pay-paid-${Date.now()}`,
      event: "FNF_PAYMENT_PAID",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: comment || `Payment marked as PAID with Ref UTR: ${paymentDetails.paymentReference}`,
      metadata: paymentDetails,
    };

    const updated: FnFSettlement = {
      ...target,
      paymentStatus: "PAID",
      paymentDate: paymentDetails.paymentDate,
      paymentReference: paymentDetails.paymentReference,
      paymentMethod: paymentDetails.paymentMethod,
      bankAccountDetails: paymentDetails.bankAccountDetails || target.bankAccountDetails,
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: `Payment successfully completed and verified with UTR ${paymentDetails.paymentReference}.`,
      settlement: updated,
    };
  },

  /**
   * Mark Payment as FAILED
   */
  markPaymentFailed(
    orgId: string | undefined,
    id: string,
    reason: string,
    actor: { id: string; name: string }
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-pay-fail-${Date.now()}`,
      event: "FNF_PAYMENT_FAILED",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      reason,
      comment: `Payment processing failed: ${reason}`,
    };

    const updated: FnFSettlement = {
      ...target,
      paymentStatus: "FAILED",
      paymentFailureReason: reason,
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: `Payment status set to FAILED (${reason}).`,
      settlement: updated,
    };
  },

  /**
   * Retry Payment (FAILED -> PROCESSING)
   */
  retryPayment(
    orgId: string | undefined,
    id: string,
    actor: { id: string; name: string }
  ): { success: boolean; message: string; settlement?: FnFSettlement } {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);

    if (!target) {
      return { success: false, message: "F&F Settlement record not found." };
    }

    if (target.paymentStatus !== "FAILED") {
      return { success: false, message: "Only FAILED payments can be retried." };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newHistoryEvent: FnFAuditEvent = {
      id: `evt-pay-retry-${Date.now()}`,
      event: "FNF_PAYMENT_RETIED",
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: "Payment retry initiated.",
    };

    const updated: FnFSettlement = {
      ...target,
      paymentStatus: "PROCESSING",
      history: [...target.history, newHistoryEvent],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);

    return {
      success: true,
      message: "Payment retry started.",
      settlement: updated,
    };
  },

  /**
   * Sync FnFSettlement back into canonical Offboarding Exit record
   */
  syncToOffboardingExit(settlement: FnFSettlement) {
    const rawExitsSaved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    let exits: ExitEmployee[] = EXITS;
    if (rawExitsSaved) {
      try {
        exits = JSON.parse(rawExitsSaved);
      } catch {
        exits = EXITS;
      }
    }

    const targetIdx = exits.findIndex((e) => e.id === settlement.exitId || e.name === settlement.employeeName);
    if (targetIdx === -1) return;

    const target = exits[targetIdx];
    const isApprovedAndPaid = settlement.settlementStatus === "APPROVED" && settlement.paymentStatus === "PAID";
    const legacyStatus = isApprovedAndPaid
      ? "Approved & Processed"
      : settlement.settlementStatus === "SENT_BACK"
      ? "Sent Back to HR"
      : settlement.settlementStatus === "DRAFT"
      ? "Draft"
      : "Pending";

    const dateStr = settlement.approvedDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Clearance updates
    const updatedClearance = target.clearance.map((c) =>
      c.dept === "Finance" && isApprovedAndPaid
        ? {
            ...c,
            status: "cleared" as const,
            approvedBy: settlement.approvedBy || "Finance Manager",
            approvedDate: dateStr,
            approvedTime: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            comments: "F&F Settlement approved and payment verified.",
          }
        : c
    );

    // Timeline updates
    let timeline = [...target.timeline];
    if (isApprovedAndPaid) {
      timeline = [
        ...timeline.filter(
          (t) =>
            t.label !== "Finance Clearance Signed Off" &&
            t.label !== "F&F Settlement Approved" &&
            t.label !== "Finance / F&F Completed"
        ),
        { label: "Finance Clearance Signed Off", date: dateStr, status: "done" as const },
        { label: "Finance / F&F Completed", date: dateStr, status: "done" as const },
      ];
    } else if (settlement.settlementStatus === "SENT_BACK") {
      timeline = [
        ...timeline.filter((t) => !t.label.includes("Settlement Sent Back")),
        {
          label: `Settlement Sent Back: "${settlement.sendBackReason || "Review required"}"`,
          date: dateStr,
          status: "active" as const,
        },
      ];
    }

    const updatedExit: ExitEmployee = {
      ...target,
      salary: settlement.salary,
      gratuity: settlement.gratuity,
      leaveEncashment: settlement.leaveEncashment,
      reimbursements: settlement.reimbursements,
      bonus: settlement.bonus,
      incentives: settlement.incentives,
      otherEarnings: settlement.otherEarnings,
      noticePeriodRecovery: settlement.noticePeriodRecovery,
      loanRecovery: settlement.loanRecovery,
      assetRecovery: settlement.assetRecovery,
      taxDeduction: settlement.taxDeduction,
      pfEsiAdjustment: settlement.pfEsiAdjustment,
      otherDeductions: settlement.otherDeductions,
      totalEarnings: settlement.grossSettlement,
      totalDeductions: settlement.totalDeductions,
      netAmount: settlement.netSettlementPayable,
      ffStatus: legacyStatus,
      ffApprovedBy: settlement.approvedBy,
      ffApprovedDate: settlement.approvedDate,
      workflowStatus: isApprovedAndPaid ? EXIT_STATUS.FINANCE_COMPLETE : target.workflowStatus,
      clearance: updatedClearance,
      timeline,
    };

    exits[targetIdx] = updatedExit;
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(exits));
  },

  /**
   * Centralized Document Eligibility Engine
   */
  canGenerateSettlementStatement(_s: FnFSettlement): boolean {
    return true; // Available during & after settlement calculation
  },

  canGenerateSalarySettlementSlip(_s: FnFSettlement): boolean {
    return true; // Available during & after settlement calculation
  },

  canGenerateExperienceLetter(_s: FnFSettlement, clearancesDone: boolean): boolean {
    return clearancesDone;
  },

  canGenerateRelievingLetter(s: FnFSettlement): boolean {
    return s.settlementStatus === "APPROVED" && s.paymentStatus === "PAID";
  },

  canGeneratePaymentReceipt(s: FnFSettlement): boolean {
    return s.paymentStatus === "PAID";
  },

  recordDocumentEvent(
    orgId: string | undefined,
    id: string,
    docType: string,
    actor: { id: string; name: string }
  ) {
    const settlements = this.getSettlements(orgId);
    const target = settlements.find((s) => s.id === id || s.exitId === id);
    if (!target) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const event: FnFAuditEvent = {
      id: `evt-doc-${Date.now()}`,
      event: `${docType.toUpperCase()}_GENERATED`,
      actorId: actor.id,
      actorName: actor.name,
      timestamp: `${dateStr} ${timeStr}`,
      dateStr,
      comment: `Document generated: ${docType}`,
    };

    const updated: FnFSettlement = {
      ...target,
      history: [...target.history, event],
      updatedAt: new Date().toISOString(),
    };

    this.saveSettlement(orgId, updated, actor);
  },
};
