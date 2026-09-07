/**
 * Payroll Engine — Tenant-Scoped localStorage Service
 *
 * Enforces the maker-checker & lockable state machine:
 *   DRAFT → PENDING_APPROVAL → APPROVED (LOCKED) → DISBURSED (LOCKED)
 *   Rejection Path: PENDING_APPROVAL → REJECTED → DRAFT
 */

import type {
  PayrollState,
  PayRun,
  Payslip,
  SalaryStructure,
  PayrollAuditItem,
  PayRunStatus,
} from "./payroll.types";

/* ═══════════════════════════════════════════════════════════════════
 * SEED DATA — Default Salary Structures
 * ═══════════════════════════════════════════════════════════════════ */

const SEED_SALARY_STRUCTURES: SalaryStructure[] = [
  {
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    designation: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.johnson@viyanhr.com",
    ctc: 1140000,
    basic: 47500,
    hra: 19000,
    allowances: 28500,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Karnataka",
    bankAccount: "****4821",
  },
  {
    employeeId: "EMP002",
    employeeName: "Marcus Williams",
    designation: "Marketing Manager",
    department: "Marketing",
    email: "marcus.williams@viyanhr.com",
    ctc: 1020000,
    basic: 42500,
    hra: 17000,
    allowances: 25500,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Maharashtra",
    bankAccount: "****3912",
  },
  {
    employeeId: "EMP003",
    employeeName: "Yuki Tanaka",
    designation: "Lead UX Designer",
    department: "Design",
    email: "yuki.tanaka@viyanhr.com",
    ctc: 936000,
    basic: 39000,
    hra: 15600,
    allowances: 23400,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Karnataka",
    bankAccount: "****7654",
  },
  {
    employeeId: "EMP004",
    employeeName: "James Carter",
    designation: "Senior Financial Analyst",
    department: "Finance",
    email: "james.carter@viyanhr.com",
    ctc: 1056000,
    basic: 44000,
    hra: 17600,
    allowances: 26400,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Maharashtra",
    bankAccount: "****2098",
  },
  {
    employeeId: "EMP005",
    employeeName: "Emily Rodriguez",
    designation: "HR Business Partner",
    department: "HR",
    email: "emily.rodriguez@viyanhr.com",
    ctc: 864000,
    basic: 36000,
    hra: 14400,
    allowances: 21600,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Maharashtra",
    bankAccount: "****5501",
  },
  {
    employeeId: "EMP006",
    employeeName: "Robert Chen",
    designation: "VP of Engineering",
    department: "Engineering",
    email: "robert.chen@viyanhr.com",
    ctc: 1740000,
    basic: 72500,
    hra: 29000,
    allowances: 43500,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Karnataka",
    bankAccount: "****8877",
  },
  {
    employeeId: "EMP007",
    employeeName: "Priya Sharma",
    designation: "Senior Product Manager",
    department: "Product",
    email: "priya.sharma@viyanhr.com",
    ctc: 1260000,
    basic: 52500,
    hra: 21000,
    allowances: 31500,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Maharashtra",
    bankAccount: "****4921",
  },
  {
    employeeId: "EMP008",
    employeeName: "Leo Martinez",
    designation: "Director of Sales",
    department: "Sales",
    email: "leo.martinez@viyanhr.com",
    ctc: 1440000,
    basic: 60000,
    hra: 24000,
    allowances: 36000,
    pfApplicable: true,
    esiApplicable: false,
    ptState: "Maharashtra",
    bankAccount: "****6210",
  },
];

const INITIAL_STATE: PayrollState = {
  payRuns: [],
  salaryStructures: SEED_SALARY_STRUCTURES,
  auditLogs: [],
};

export const payrollService = {
  /* ─── Tenant Keying ─────────────────────────────────────────────── */
  getStorageKey(orgId?: string): string {
    const safeOrgId = orgId || "org-1";
    return `nexus_payroll_engine:${safeOrgId}`;
  },

  /* ─── Core Load / Save ───────────────────────────────────────────── */

  loadData(orgId?: string): PayrollState {
    try {
      const key = this.getStorageKey(orgId);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as PayrollState;
        if (!parsed.salaryStructures || parsed.salaryStructures.length === 0) {
          parsed.salaryStructures = SEED_SALARY_STRUCTURES;
        }
        if (!parsed.auditLogs) {
          parsed.auditLogs = [];
        }
        return parsed;
      }
      localStorage.setItem(key, JSON.stringify(INITIAL_STATE));
    } catch (e) {
      console.error("Failed to load payroll data from storage", e);
    }
    return { ...INITIAL_STATE };
  },

  saveData(state: PayrollState, orgId?: string): void {
    try {
      const key = this.getStorageKey(orgId);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save payroll data to storage", e);
    }
  },

  /* ─── Helper: Compute Totals ────────────────────────────────────── */
  computeTotals(payslips: Payslip[]) {
    const grossPay = payslips.reduce((s, p) => s + (p.earnings?.gross || 0), 0);
    const totalDeductions = payslips.reduce((s, p) => s + (p.deductions?.total || 0), 0);
    const employerContributions = payslips.reduce(
      (s, p) => s + (p.employerContributions?.total || 0),
      0,
    );
    const netPay = payslips.reduce((s, p) => s + (p.netPay || 0), 0);
    return {
      employeeCount: payslips.length,
      grossPay,
      totalDeductions,
      employerContributions,
      netPay,
    };
  },

  /* ─── Salary Structures ─────────────────────────────────────────── */

  getSalaryStructures(orgId?: string): SalaryStructure[] {
    return this.loadData(orgId).salaryStructures;
  },

  saveSalaryStructure(
    structure: SalaryStructure,
    orgId?: string,
  ): { success: true } | { success: false; error: string } {
    try {
      const state = this.loadData(orgId);
      if (!state.salaryStructures) {
        state.salaryStructures = [];
      }
      const index = state.salaryStructures.findIndex(
        (s) => s.employeeId === structure.employeeId,
      );
      if (index === -1) {
        state.salaryStructures.push(structure);
      } else {
        state.salaryStructures[index] = structure;
      }
      this.saveData(state, orgId);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to save salary structure.",
      };
    }
  },

  /* ─── Pay Run Queries ───────────────────────────────────────────── */

  getAllPayRuns(orgId?: string): PayRun[] {
    return this.loadData(orgId).payRuns;
  },

  getPayRun(month: string, orgId?: string): PayRun | undefined {
    return this.loadData(orgId).payRuns.find((r) => r.month === month);
  },

  getPayRunById(id: string, orgId?: string): PayRun | undefined {
    return this.loadData(orgId).payRuns.find((r) => r.id === id);
  },

  /* ─── Pay Run Mutations ─────────────────────────────────────────── */

  /**
   * Create a new pay run with status "pending".
   */
  createPayRun(
    month: string,
    preparedBy: string,
    payslips: Payslip[],
    orgId?: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData(orgId);

    // Guard: no duplicate runs per month
    if (state.payRuns.some((r) => r.month === month)) {
      return {
        success: false,
        error: `A pay run for ${month} already exists. Cannot create duplicate.`,
      };
    }

    const monthParts = month.split(" ");
    const monthNum =
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].indexOf(monthParts[0]) + 1;
    const id = `PR-${monthParts[1] || "2026"}${String(monthNum).padStart(2, "0")}`;

    const timestamp = new Date().toISOString();
    const totals = this.computeTotals(payslips);

    const auditItem: PayrollAuditItem = {
      id: `audit-${Date.now()}-1`,
      payRunId: id,
      action: "PAYROLL_SUBMITTED",
      actor: preparedBy,
      timestamp,
      previousStatus: "draft",
      newStatus: "pending",
      comment: `Pay run for ${month} prepared and submitted for approval.`,
    };

    const payRun: PayRun = {
      id,
      month,
      organizationId: orgId || "org-1",
      status: "pending",
      isLocked: false,
      payslips,
      preparedBy,
      approvedBy: null,
      createdAt: timestamp,
      approvedAt: null,
      disbursedAt: null,
      auditTrail: [auditItem],
      totals,
    };

    state.payRuns.push(payRun);
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.push(auditItem);

    this.saveData(state, orgId);
    return { success: true, payRun };
  },

  /**
   * Approve a pending pay run (sets status to "approved" & isLocked to true).
   * Maker-checker guard: approvedBy !== preparedBy.
   */
  approvePayRun(
    id: string,
    approvedBy: string,
    orgId?: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData(orgId);
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];

    if (run.status !== "pending") {
      return {
        success: false,
        error: `Cannot approve: current status is "${run.status}", expected "pending".`,
      };
    }

    if (run.preparedBy === approvedBy) {
      return {
        success: false,
        error: "Maker-checker violation: the preparer cannot approve their own pay run.",
      };
    }

    const timestamp = new Date().toISOString();
    const auditItem: PayrollAuditItem = {
      id: `audit-${Date.now()}`,
      payRunId: id,
      action: "PAYROLL_APPROVED",
      actor: approvedBy,
      timestamp,
      previousStatus: "pending",
      newStatus: "approved",
      comment: `Pay run approved by ${approvedBy} and locked against further edits.`,
    };

    const updatedRun: PayRun = {
      ...run,
      status: "approved",
      isLocked: true,
      approvedBy,
      approvedAt: timestamp,
      auditTrail: [...(run.auditTrail || []), auditItem],
    };

    state.payRuns[runIndex] = updatedRun;
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.push(auditItem);

    this.saveData(state, orgId);
    return { success: true, payRun: updatedRun };
  },

  /**
   * Reject a pending pay run with a required reason.
   */
  rejectPayRun(
    id: string,
    rejectedBy: string,
    reason: string,
    orgId?: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    if (!reason || !reason.trim()) {
      return { success: false, error: "A rejection reason must be provided." };
    }

    const state = this.loadData(orgId);
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];

    if (run.status !== "pending") {
      return {
        success: false,
        error: `Cannot reject: current status is "${run.status}", expected "pending".`,
      };
    }

    const timestamp = new Date().toISOString();
    const auditItem: PayrollAuditItem = {
      id: `audit-${Date.now()}`,
      payRunId: id,
      action: "PAYROLL_REJECTED",
      actor: rejectedBy,
      timestamp,
      previousStatus: "pending",
      newStatus: "rejected",
      comment: `Rejected: ${reason.trim()}`,
    };

    const updatedRun: PayRun = {
      ...run,
      status: "rejected",
      isLocked: false,
      rejectedBy,
      rejectedAt: timestamp,
      rejectionReason: reason.trim(),
      auditTrail: [...(run.auditTrail || []), auditItem],
    };

    state.payRuns[runIndex] = updatedRun;
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.push(auditItem);

    this.saveData(state, orgId);
    return { success: true, payRun: updatedRun };
  },

  /**
   * Resubmit a rejected pay run back to pending status.
   */
  resubmitPayRun(
    id: string,
    preparedBy: string,
    updatedPayslips?: Payslip[],
    orgId?: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData(orgId);
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];
    if (run.status !== "rejected" && run.status !== "draft") {
      return {
        success: false,
        error: `Cannot resubmit: current status is "${run.status}".`,
      };
    }

    const timestamp = new Date().toISOString();
    const newPayslips = updatedPayslips || run.payslips;
    const totals = this.computeTotals(newPayslips);

    const auditItem: PayrollAuditItem = {
      id: `audit-${Date.now()}`,
      payRunId: id,
      action: "PAYROLL_SUBMITTED",
      actor: preparedBy,
      timestamp,
      previousStatus: run.status,
      newStatus: "pending",
      comment: `Corrected and resubmitted for approval by ${preparedBy}.`,
    };

    const updatedRun: PayRun = {
      ...run,
      status: "pending",
      isLocked: false,
      payslips: newPayslips,
      preparedBy,
      rejectedBy: null,
      rejectionReason: undefined,
      auditTrail: [...(run.auditTrail || []), auditItem],
      totals,
    };

    state.payRuns[runIndex] = updatedRun;
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.push(auditItem);

    this.saveData(state, orgId);
    return { success: true, payRun: updatedRun };
  },

  /**
   * Disburse an approved pay run.
   */
  disbursePayRun(
    id: string,
    orgId?: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData(orgId);
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];

    if (run.status !== "approved") {
      return {
        success: false,
        error: `Cannot disburse: current status is "${run.status}", expected "approved".`,
      };
    }

    const timestamp = new Date().toISOString();
    const auditItem: PayrollAuditItem = {
      id: `audit-${Date.now()}`,
      payRunId: id,
      action: "PAYROLL_DISBURSED",
      actor: "Finance Disburser",
      timestamp,
      previousStatus: "approved",
      newStatus: "disbursed",
      comment: "Payroll marked as disbursed. Employee payslips published.",
    };

    const updatedRun: PayRun = {
      ...run,
      status: "disbursed",
      isLocked: true,
      disbursedAt: timestamp,
      auditTrail: [...(run.auditTrail || []), auditItem],
    };

    state.payRuns[runIndex] = updatedRun;
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.push(auditItem);

    this.saveData(state, orgId);
    return { success: true, payRun: updatedRun };
  },

  /**
   * Delete a pay run. Only allowed if NOT locked / NOT approved / NOT disbursed.
   */
  deletePayRun(
    id: string,
    orgId?: string,
  ): { success: true } | { success: false; error: string } {
    const state = this.loadData(orgId);
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];
    if (run.isLocked || run.status === "approved" || run.status === "disbursed") {
      return {
        success: false,
        error: `Cannot delete: pay run is locked/finalized in status "${run.status}".`,
      };
    }

    state.payRuns.splice(runIndex, 1);
    this.saveData(state, orgId);
    return { success: true };
  },

  /**
   * Fetch audit trail for a specific run or tenant.
   */
  getAuditTrail(payRunId?: string, orgId?: string): PayrollAuditItem[] {
    const state = this.loadData(orgId);
    if (payRunId) {
      const run = state.payRuns.find((r) => r.id === payRunId);
      return run?.auditTrail || [];
    }
    return state.auditLogs || [];
  },
};
