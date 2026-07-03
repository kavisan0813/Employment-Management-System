/**
 * Payroll Engine — Type Definitions
 *
 * Defines the data model for the maker-checker payroll flow:
 *   HR prepares → Finance approves → Finance disburses → Employee views.
 *
 * Convention: follows the same "types in a dedicated file" pattern
 * used by admin/features/notifications/types/notifications.types.ts
 */

/* ─── Salary Structure (per-employee config) ────────────────────── */

export interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  email: string;
  /** Annual Cost-to-Company in INR */
  ctc: number;
  /** Monthly basic salary in INR */
  basic: number;
  /** Monthly HRA in INR */
  hra: number;
  /** Monthly special + other allowances in INR */
  allowances: number;
  /** Whether PF deduction applies */
  pfApplicable: boolean;
  /** Whether ESI deduction applies (auto-disabled if gross > 21000) */
  esiApplicable: boolean;
  /** State code for Professional Tax slab lookup */
  ptState: string;
  /** Bank account (masked) */
  bankAccount: string;
}

/* ─── Pay Run Status (state machine) ────────────────────────────── */

/**
 * Status transitions (enforced by the service):
 *   draft → pending → approved → disbursed
 *
 * - HR can create a run (→ pending)
 * - Only Finance can approve (→ approved) — and approver ≠ preparer
 * - Only Finance can disburse (→ disbursed)
 */
export type PayRunStatus = "draft" | "pending" | "approved" | "disbursed";

/* ─── Payslip (calculated output per employee) ──────────────────── */

export interface PayslipEarnings {
  basic: number;
  hra: number;
  allowances: number;
  bonus?: number;
  gross: number;
}

export interface PayslipDeductions {
  pf: number;
  esi: number;
  pt: number;
  tds: number;
  total: number;
}

export interface Payslip {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  email: string;
  bankAccount: string;
  /** Month string e.g. "July 2026" */
  month: string;
  /** Total working days in the month */
  totalWorkingDays: number;
  /** Payable days after LOP deduction */
  payableDays: number;
  /** Loss-of-Pay days */
  lopDays: number;
  earnings: PayslipEarnings;
  deductions: PayslipDeductions;
  bonus?: number;
  /** Net take-home = earnings.gross - deductions.total */
  netPay: number;
}

/* ─── Pay Run (batch container) ─────────────────────────────────── */

export interface PayRun {
  /** Unique run ID, e.g. "PR-202607" */
  id: string;
  /** Month label, e.g. "July 2026" */
  month: string;
  /** Current status in the maker-checker flow */
  status: PayRunStatus;
  /** All payslips in this run */
  payslips: Payslip[];
  /** Email of the HR user who prepared this run */
  preparedBy: string;
  /** Email of the Finance user who approved (null until approved) */
  approvedBy: string | null;
  /** ISO timestamp of when the run was created */
  createdAt: string;
  /** ISO timestamp of when the run was approved (null until approved) */
  approvedAt: string | null;
  /** ISO timestamp of when the run was disbursed (null until disbursed) */
  disbursedAt: string | null;
}

/* ─── Top-level state shape for localStorage ────────────────────── */

export interface PayrollState {
  /** All pay runs across months */
  payRuns: PayRun[];
  /** Salary structures for all employees */
  salaryStructures: SalaryStructure[];
}
