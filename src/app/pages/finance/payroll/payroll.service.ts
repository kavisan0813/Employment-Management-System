/**
 * Payroll Engine — localStorage-backed Service
 *
 * Follows the same pattern as notifications.service.ts:
 *   INITIAL_STATE + STORAGE_KEY + exported service object with
 *   loadData(), saveData(), and action methods.
 *
 * Enforces the maker-checker state machine:
 *   draft → pending → approved → disbursed
 */

import type {
  PayrollState,
  PayRun,
  Payslip,
  SalaryStructure,
} from "./payroll.types";

/* ═══════════════════════════════════════════════════════════════════
 * SEED DATA — Salary Structures matching mockData.ts employees
 *
 * These are realistic Indian salary structures. The CTC values are
 * monthly salary × 12. Basic is ~50% of monthly, HRA ~20%, rest is
 * allowances.
 * ═══════════════════════════════════════════════════════════════════ */

const SEED_SALARY_STRUCTURES: SalaryStructure[] = [
  {
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    designation: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.johnson@viyanhr.com",
    ctc: 1140000, // ₹11.4L
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
    ctc: 1020000, // ₹10.2L
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
    ctc: 936000, // ₹9.36L
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
    ctc: 1056000, // ₹10.56L
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
    ctc: 864000, // ₹8.64L
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
    ctc: 1740000, // ₹17.4L
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
    ctc: 1260000, // ₹12.6L
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
    ctc: 1440000, // ₹14.4L
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
};

const STORAGE_KEY = "viyan_payroll_engine";

/* ═══════════════════════════════════════════════════════════════════
 * SERVICE OBJECT
 * ═══════════════════════════════════════════════════════════════════ */

export const payrollService = {
  /* ─── Core CRUD ─────────────────────────────────────────────────── */

  loadData(): PayrollState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PayrollState;
        // Ensure seed structures are always present (in case storage was
        // created before we added new employees)
        if (!parsed.salaryStructures || parsed.salaryStructures.length === 0) {
          parsed.salaryStructures = SEED_SALARY_STRUCTURES;
        }
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    } catch (e) {
      console.error("Failed to load payroll data from storage", e);
    }
    return { ...INITIAL_STATE };
  },

  saveData(state: PayrollState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save payroll data to storage", e);
    }
  },

  /* ─── Salary Structures ─────────────────────────────────────────── */

  getSalaryStructures(): SalaryStructure[] {
    return this.loadData().salaryStructures;
  },

  saveSalaryStructure(
    structure: SalaryStructure,
  ): { success: true } | { success: false; error: string } {
    try {
      const state = this.loadData();
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
      this.saveData(state);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error:
          e instanceof Error ? e.message : "Failed to save salary structure.",
      };
    }
  },

  /* ─── Pay Run Queries ───────────────────────────────────────────── */

  getAllPayRuns(): PayRun[] {
    return this.loadData().payRuns;
  },

  getPayRun(month: string): PayRun | undefined {
    return this.loadData().payRuns.find((r) => r.month === month);
  },

  getPayRunById(id: string): PayRun | undefined {
    return this.loadData().payRuns.find((r) => r.id === id);
  },

  /* ─── Pay Run Mutations (with state machine guards) ─────────────── */

  /**
   * Create a new pay run with status "pending".
   * Guard: rejects if a run for that month already exists.
   */
  createPayRun(
    month: string,
    preparedBy: string,
    payslips: Payslip[],
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData();

    // Guard: no duplicate runs per month
    if (state.payRuns.some((r) => r.month === month)) {
      return {
        success: false,
        error: `A pay run for ${month} already exists. Cannot create duplicate.`,
      };
    }

    // Generate deterministic ID from month
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

    const payRun: PayRun = {
      id,
      month,
      status: "pending",
      payslips,
      preparedBy,
      approvedBy: null,
      createdAt: new Date().toISOString(),
      approvedAt: null,
      disbursedAt: null,
    };

    state.payRuns.push(payRun);
    this.saveData(state);

    return { success: true, payRun };
  },

  /**
   * Approve a pending pay run. Sets status to "approved".
   * Guards:
   *   - Run must exist
   *   - Current status must be "pending"
   *   - approvedBy must NOT equal preparedBy (maker-checker)
   */
  approvePayRun(
    id: string,
    approvedBy: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData();
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
        error:
          "Maker-checker violation: the preparer cannot approve their own pay run.",
      };
    }

    const updatedRun: PayRun = {
      ...run,
      status: "approved",
      approvedBy,
      approvedAt: new Date().toISOString(),
    };

    state.payRuns[runIndex] = updatedRun;
    this.saveData(state);

    return { success: true, payRun: updatedRun };
  },

  /**
   * Disburse an approved pay run. Sets status to "disbursed".
   * Guard: current status must be "approved".
   */
  disbursePayRun(
    id: string,
  ): { success: true; payRun: PayRun } | { success: false; error: string } {
    const state = this.loadData();
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

    const updatedRun: PayRun = {
      ...run,
      status: "disbursed",
      disbursedAt: new Date().toISOString(),
    };

    state.payRuns[runIndex] = updatedRun;
    this.saveData(state);

    return { success: true, payRun: updatedRun };
  },

  /**
   * Delete a pay run. Only allowed if status is "draft" or "pending".
   */
  deletePayRun(
    id: string,
  ): { success: true } | { success: false; error: string } {
    const state = this.loadData();
    const runIndex = state.payRuns.findIndex((r) => r.id === id);

    if (runIndex === -1) {
      return { success: false, error: `Pay run ${id} not found.` };
    }

    const run = state.payRuns[runIndex];
    if (run.status === "approved" || run.status === "disbursed") {
      return {
        success: false,
        error: `Cannot delete: pay run is already "${run.status}".`,
      };
    }

    state.payRuns.splice(runIndex, 1);
    this.saveData(state);

    return { success: true };
  },
};
