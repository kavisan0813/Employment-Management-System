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
export type PayRunStatus = "draft" | "pending" | "approved" | "rejected" | "disbursed";

export interface PayrollAuditItem {
  id: string;
  payRunId: string;
  action:
    | "PAYROLL_CREATED"
    | "PAYROLL_SUBMITTED"
    | "PAYROLL_APPROVED"
    | "PAYROLL_REJECTED"
    | "PAYROLL_LOCKED"
    | "PAYROLL_DISBURSED"
    | "PAYSLIP_GENERATED";
  actor: string;
  timestamp: string;
  previousStatus?: PayRunStatus;
  newStatus?: PayRunStatus;
  comment?: string;
}

/* ─── Payslip (calculated output per employee) ──────────────────── */

export interface PayslipEarnings {
  basic: number;
  hra: number;
  allowances: number;
  overtimePay?: number;
  incentives?: number;
  bonus?: number;
  customEarnings?: Record<string, number>;
  gross: number;
}

export interface PayslipDeductions {
  pf: number;
  esi: number;
  pt: number;
  tds: number;
  customDeductions?: Record<string, number>;
  total: number;
}

export interface EmployerContributions {
  pf: number;
  esi: number;
  gratuity: number;
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
  /** Overtime hours worked (if any) */
  overtimeHours?: number;
  earnings: PayslipEarnings;
  deductions: PayslipDeductions;
  employerContributions?: EmployerContributions;
  bonus?: number;
  incentives?: number;
  overtimePay?: number;
  regimeUsed?: "oldRegime" | "newRegime";
  /** Net take-home = earnings.gross - deductions.total */
  netPay: number;
}

/* ─── Pay Run (batch container) ─────────────────────────────────── */

export interface PayRun {
  /** Unique run ID, e.g. "PR-202607" */
  id: string;
  /** Month label, e.g. "July 2026" */
  month: string;
  /** Organization ID for multi-tenant isolation */
  organizationId?: string;
  /** Current status in the maker-checker flow */
  status: PayRunStatus;
  /** Explicit lock state: true when approved or disbursed */
  isLocked: boolean;
  /** All payslips in this run */
  payslips: Payslip[];
  /** Email of the HR user who prepared this run */
  preparedBy: string;
  /** Email of the Finance user who approved (null until approved) */
  approvedBy: string | null;
  /** Email of user who rejected (null unless rejected) */
  rejectedBy?: string | null;
  /** Rejection reason string */
  rejectionReason?: string;
  /** ISO timestamp of when the run was created */
  createdAt: string;
  /** ISO timestamp of when the run was approved (null until approved) */
  approvedAt: string | null;
  /** ISO timestamp of when the run was rejected (null unless rejected) */
  rejectedAt?: string | null;
  /** ISO timestamp of when the run was disbursed (null until disbursed) */
  disbursedAt: string | null;
  /** Append-only audit history log */
  auditTrail?: PayrollAuditItem[];
  /** Aggregate financial totals */
  totals?: {
    employeeCount: number;
    grossPay: number;
    totalDeductions: number;
    employerContributions: number;
    netPay: number;
  };
}

/* ─── Top-level state shape for localStorage ────────────────────── */

export interface PayrollState {
  /** All pay runs across months */
  payRuns: PayRun[];
  /** Salary structures for all employees */
  salaryStructures: SalaryStructure[];
  /** Global tenant audit logs */
  auditLogs?: PayrollAuditItem[];
}

/* ─── Comprehensive Payroll Settings Models ─────────────────────── */

export interface PayCycleSettings {
  frequency: "Monthly" | "Bi-Weekly" | "Weekly";
  basis: "Calendar Days" | "Working Days";
  processingDate: string;
  payoutDate: string;
  cutoffDay: string;
  lockAfterProcessing: boolean;
  effectiveDate: string;
}

export interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: "Earnings" | "Deductions";
  calculationBasis: "Fixed" | "Percentage of Basic" | "Percentage of CTC" | "Formula";
  formula: string;
  fixedAmount?: number;
  percentageValue?: number;
  taxable: boolean;
  pfApplicable: boolean;
  esiApplicable: boolean;
  order: number;
  isSystem: boolean;
  status: "Enabled" | "Disabled";
  effectiveDate?: string;
}

export interface SalaryBand {
  id: string;
  code: string;
  grade: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  department: string;
  employees: number;
  desc: string;
  status: "Active" | "Inactive";
  effectiveDate?: string;
}

export interface PfConfig {
  employerContrib: string;
  employeeContrib: string;
  wageCeiling: string;
  epsApplicable: boolean;
  enabled: boolean;
  effectiveDate?: string;
}

export interface EsiConfig {
  employeeContrib: string;
  employerContrib: string;
  salaryLimit: string;
  enabled: boolean;
  effectiveDate?: string;
}

export interface ProfessionalTaxSlab {
  id: string;
  state: string;
  minSalary: number;
  maxSalary: number;
  amount: number;
}

export interface PtConfig {
  enabled: boolean;
  slabs: ProfessionalTaxSlab[];
}

export interface TaxSlab {
  id: string;
  fromAmt: number;
  toAmt: number;
  rate: number;
}

export interface TdsConfig {
  enabled: boolean;
  activeRegime: "oldRegime" | "newRegime";
  oldRegime: TaxSlab[];
  newRegime: TaxSlab[];
  effectiveDate?: string;
}

export interface GratuityConfig {
  eligibilityYears: string;
  formula: string;
  enabled: boolean;
  effectiveDate?: string;
}

export interface PayrollCalendarPeriod {
  id: string;
  month: string;
  processingDate: string;
  transferDate: string;
  status: "Processed" | "Upcoming" | "Draft";
}

export interface BankItem {
  id: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
  paymentMode: "NEFT" | "RTGS" | "IMPS" | "Direct Credit";
  isDefault: boolean;
  status: "Configured" | "Pending" | "Disabled";
  lastSync?: string;
}

export interface VisiblePayslipSections {
  employeeInfo: boolean;
  earnings: boolean;
  deductions: boolean;
  employerContrib: boolean;
  netPay: boolean;
  paymentInfo: boolean;
}

export interface PayslipTemplateConfig {
  templateId: "sleek" | "corporate" | "minimal";
  templateSource: "EMS_DEFAULT" | "COMPANY_UPLOADED";
  name: string;
  desc: string;
  logoUrl: string;
  headerColor: string;
  footerText: string;
  signatureUrl: string;
  emailSubject: string;
  emailBody: string;
  autoEmail: boolean;
  // Customization fields
  customTitle?: string;
  accentColor?: string;
  headerText?: string;
  notes?: string;
  visibleSections?: VisiblePayslipSections;
  // Company Uploaded Template Metadata
  uploadedTemplateFileName?: string;
  uploadedTemplateFileType?: "pdf" | "png" | "jpg" | "docx" | "html";
  uploadedTemplateAssetUrl?: string;
  uploadedTemplateStatus?: string;
}

export interface PayrollSettingsState {
  version: string;
  lastUpdatedBy: string;
  lastUpdatedTime: string;
  payCycle: PayCycleSettings;
  salaryComponents: SalaryComponent[];
  salaryBands: SalaryBand[];
  pfConfig: PfConfig;
  esiConfig: EsiConfig;
  ptConfig: PtConfig;
  tdsConfig: TdsConfig;
  gratuityConfig: GratuityConfig;
  payrollCalendar: PayrollCalendarPeriod[];
  bankItems: BankItem[];
  payslipTemplate: PayslipTemplateConfig;
  attendanceRules: {
    lopEnabled: boolean;
    otPayEnabled: boolean;
    halfDayCalcTrigger: string;
  };
}

