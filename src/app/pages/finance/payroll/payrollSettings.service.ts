/**
 * Centralized Tenant-Scoped Payroll Settings Service
 *
 * Provides a single source of truth for all Payroll Settings across:
 * - HR Payroll
 * - Finance Payroll Settings
 * - Super Admin Settings (PayrollSettingsSection)
 *
 * Enforces tenant isolation using: `nexus_payroll_settings:${orgId}`
 */

import type {
  PayrollSettingsState,
  PayCycleSettings,
  SalaryComponent,
  SalaryBand,
  PfConfig,
  EsiConfig,
  PtConfig,
  TdsConfig,
  GratuityConfig,
  PayrollCalendarPeriod,
  BankItem,
  PayslipTemplateConfig,
  ProfessionalTaxSlab,
  TaxSlab,
} from "./payroll.types";

/* ─── Default Initial Settings ──────────────────────────────────── */

export const DEFAULT_PAYROLL_SETTINGS: PayrollSettingsState = {
  version: "3.1",
  lastUpdatedBy: "Finance Admin",
  lastUpdatedTime: "Just now",
  payCycle: {
    frequency: "Monthly",
    basis: "Calendar Days",
    processingDate: "25",
    payoutDate: "30",
    cutoffDay: "20",
    lockAfterProcessing: true,
    effectiveDate: "2026-04-01",
  },
  salaryComponents: [
    {
      id: "comp-1",
      code: "BASIC",
      name: "Basic Pay",
      type: "Earnings",
      calculationBasis: "Percentage of CTC",
      formula: "50% of CTC",
      percentageValue: 50,
      taxable: true,
      pfApplicable: true,
      esiApplicable: true,
      order: 1,
      isSystem: true,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-2",
      code: "HRA",
      name: "House Rent Allowance (HRA)",
      type: "Earnings",
      calculationBasis: "Percentage of Basic",
      formula: "40% of Basic",
      percentageValue: 40,
      taxable: true,
      pfApplicable: false,
      esiApplicable: true,
      order: 2,
      isSystem: true,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-3",
      code: "SPL_ALLOW",
      name: "Special Allowance",
      type: "Earnings",
      calculationBasis: "Formula",
      formula: "Balance of CTC",
      taxable: true,
      pfApplicable: false,
      esiApplicable: true,
      order: 3,
      isSystem: false,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-4",
      code: "PERF_BONUS",
      name: "Performance Bonus",
      type: "Earnings",
      calculationBasis: "Percentage of Basic",
      formula: "% of Basic",
      percentageValue: 10,
      taxable: true,
      pfApplicable: false,
      esiApplicable: false,
      order: 4,
      isSystem: false,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-5",
      code: "CONVEYANCE",
      name: "Conveyance Allowance",
      type: "Earnings",
      calculationBasis: "Fixed",
      formula: "₹1,600/month",
      fixedAmount: 1600,
      taxable: false,
      pfApplicable: false,
      esiApplicable: false,
      order: 5,
      isSystem: false,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-6",
      code: "MED_ALLOW",
      name: "Medical Allowance",
      type: "Earnings",
      calculationBasis: "Fixed",
      formula: "₹1,250/month",
      fixedAmount: 1250,
      taxable: false,
      pfApplicable: false,
      esiApplicable: false,
      order: 6,
      isSystem: false,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
    {
      id: "comp-7",
      code: "PF_EMP",
      name: "PF Employer Contribution",
      type: "Deductions",
      calculationBasis: "Percentage of Basic",
      formula: "12% of Basic",
      percentageValue: 12,
      taxable: false,
      pfApplicable: true,
      esiApplicable: false,
      order: 7,
      isSystem: true,
      status: "Enabled",
      effectiveDate: "2026-01-01",
    },
  ],
  salaryBands: [
    {
      id: "band-1",
      code: "GRADE-A",
      grade: "Grade A",
      minSalary: 30000,
      maxSalary: 60000,
      currency: "INR",
      department: "All",
      employees: 24,
      desc: "Junior Associate / Analyst",
      status: "Active",
      effectiveDate: "2026-01-01",
    },
    {
      id: "band-2",
      code: "GRADE-B",
      grade: "Grade B",
      minSalary: 60000,
      maxSalary: 120000,
      currency: "INR",
      department: "All",
      employees: 42,
      desc: "Senior Specialist / Consultant",
      status: "Active",
      effectiveDate: "2026-01-01",
    },
    {
      id: "band-3",
      code: "GRADE-C",
      grade: "Grade C",
      minSalary: 120000,
      maxSalary: 250000,
      currency: "INR",
      department: "Engineering",
      employees: 15,
      desc: "Lead Developer / Manager",
      status: "Active",
      effectiveDate: "2026-01-01",
    },
    {
      id: "band-4",
      code: "GRADE-D",
      grade: "Grade D",
      minSalary: 250000,
      maxSalary: 500000,
      currency: "INR",
      department: "Executive",
      employees: 5,
      desc: "Director / Vice President",
      status: "Active",
      effectiveDate: "2026-01-01",
    },
  ],
  pfConfig: {
    employerContrib: "12",
    employeeContrib: "12",
    wageCeiling: "15000",
    epsApplicable: true,
    enabled: true,
    effectiveDate: "2026-04-01",
  },
  esiConfig: {
    employeeContrib: "0.75",
    employerContrib: "3.25",
    salaryLimit: "21000",
    enabled: true,
    effectiveDate: "2026-04-01",
  },
  ptConfig: {
    enabled: true,
    slabs: [
      { id: "pt-1", state: "Maharashtra", minSalary: 0, maxSalary: 7500, amount: 0 },
      { id: "pt-2", state: "Maharashtra", minSalary: 7501, maxSalary: 10000, amount: 175 },
      { id: "pt-3", state: "Maharashtra", minSalary: 10001, maxSalary: 99999999, amount: 200 },
      { id: "pt-4", state: "Karnataka", minSalary: 0, maxSalary: 25000, amount: 0 },
      { id: "pt-5", state: "Karnataka", minSalary: 25001, maxSalary: 99999999, amount: 200 },
    ],
  },
  tdsConfig: {
    enabled: true,
    activeRegime: "newRegime",
    effectiveDate: "2026-04-01",
    oldRegime: [
      { id: "o1", fromAmt: 0, toAmt: 250000, rate: 0 },
      { id: "o2", fromAmt: 250001, toAmt: 500000, rate: 5 },
      { id: "o3", fromAmt: 500001, toAmt: 1000000, rate: 20 },
      { id: "o4", fromAmt: 1000001, toAmt: 99999999, rate: 30 },
    ],
    newRegime: [
      { id: "n1", fromAmt: 0, toAmt: 300000, rate: 0 },
      { id: "n2", fromAmt: 300001, toAmt: 600000, rate: 5 },
      { id: "n3", fromAmt: 600001, toAmt: 900000, rate: 10 },
      { id: "n4", fromAmt: 900001, toAmt: 1200000, rate: 15 },
      { id: "n5", fromAmt: 1200001, toAmt: 1500000, rate: 20 },
      { id: "n6", fromAmt: 1500001, toAmt: 99999999, rate: 30 },
    ],
  },
  gratuityConfig: {
    eligibilityYears: "5",
    formula: "(15 * Basic * Service Years) / 26",
    enabled: true,
    effectiveDate: "2026-04-01",
  },
  payrollCalendar: [
    { id: "cal-1", month: "January 2026", processingDate: "2026-01-25", transferDate: "2026-01-30", status: "Processed" },
    { id: "cal-2", month: "February 2026", processingDate: "2026-02-24", transferDate: "2026-02-27", status: "Processed" },
    { id: "cal-3", month: "March 2026", processingDate: "2026-03-25", transferDate: "2026-03-31", status: "Processed" },
    { id: "cal-4", month: "April 2026", processingDate: "2026-04-24", transferDate: "2026-04-30", status: "Processed" },
    { id: "cal-5", month: "May 2026", processingDate: "2026-05-25", transferDate: "2026-05-29", status: "Upcoming" },
    { id: "cal-6", month: "June 2026", processingDate: "2026-06-24", transferDate: "2026-06-30", status: "Upcoming" },
  ],
  bankItems: [
    {
      id: "bank-1",
      bankName: "HDFC Corporate Bank",
      accountNo: "998877665544",
      ifscCode: "HDFC0001234",
      branch: "Redwood City Branch",
      paymentMode: "NEFT",
      isDefault: true,
      status: "Configured",
      lastSync: "2026-04-25 10:30 AM",
    },
    {
      id: "bank-2",
      bankName: "ICICI Commercial Bank",
      accountNo: "112233445566",
      ifscCode: "ICIC0005678",
      branch: "Financial District Branch",
      paymentMode: "RTGS",
      isDefault: false,
      status: "Configured",
      lastSync: "2026-04-20 02:15 PM",
    },
  ],
  payslipTemplate: {
    templateId: "sleek",
    templateSource: "EMS_DEFAULT",
    name: "Modern Sleek",
    desc: "Clean glassmorphic layout with breakdown charts and corporate header",
    logoUrl: "",
    headerColor: "#00B87C",
    footerText: "This is a computer-generated payslip and does not require a physical signature.",
    signatureUrl: "",
    emailSubject: "Salary Payslip - {Month} {Year} - {EmployeeName}",
    emailBody: "Dear {EmployeeName},\n\nPlease find attached your salary payslip for {Month} {Year}.\n\nBest regards,\nFinance Team",
    autoEmail: true,
    customTitle: "PAYSLIP FOR THE MONTH",
    accentColor: "#00B87C",
    headerText: "VIYAN HR EMS CORPORATE PAYSLIP",
    notes: "Confidential - For Internal Use Only",
    visibleSections: {
      employeeInfo: true,
      earnings: true,
      deductions: true,
      employerContrib: true,
      netPay: true,
      paymentInfo: true,
    },
    uploadedTemplateFileName: "",
    uploadedTemplateFileType: "pdf",
    uploadedTemplateAssetUrl: "",
    uploadedTemplateStatus: "FRONTEND READY — BACKEND FILE STORAGE REQUIRED",
  },
  attendanceRules: {
    lopEnabled: true,
    otPayEnabled: false,
    halfDayCalcTrigger: "> 4 Hours Worked",
  },
};

/* ─── Service Class with Subscriber Pattern ──────────────────────── */

type Listener = () => void;

class PayrollSettingsService {
  private listeners: Set<Listener> = new Set();

  private getStorageKey(orgId?: string): string {
    const keyId = orgId && orgId.trim() !== "" ? orgId.trim() : "demo-tenant";
    return `nexus_payroll_settings:${keyId}`;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in payroll settings listener:", err);
      }
    });
  }

  public getSettings(orgId?: string): PayrollSettingsState {
    const key = this.getStorageKey(orgId);
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_PAYROLL_SETTINGS,
          ...parsed,
          payCycle: { ...DEFAULT_PAYROLL_SETTINGS.payCycle, ...parsed.payCycle },
          pfConfig: { ...DEFAULT_PAYROLL_SETTINGS.pfConfig, ...parsed.pfConfig },
          esiConfig: { ...DEFAULT_PAYROLL_SETTINGS.esiConfig, ...parsed.esiConfig },
          ptConfig: { ...DEFAULT_PAYROLL_SETTINGS.ptConfig, ...parsed.ptConfig },
          tdsConfig: { ...DEFAULT_PAYROLL_SETTINGS.tdsConfig, ...parsed.tdsConfig },
          gratuityConfig: { ...DEFAULT_PAYROLL_SETTINGS.gratuityConfig, ...parsed.gratuityConfig },
          payslipTemplate: { ...DEFAULT_PAYROLL_SETTINGS.payslipTemplate, ...parsed.payslipTemplate },
        };
      }
    } catch (e) {
      console.error("Failed to parse payroll settings from localStorage:", e);
    }
    // Return default settings and prime storage
    this.saveSettings(DEFAULT_PAYROLL_SETTINGS, orgId);
    return DEFAULT_PAYROLL_SETTINGS;
  }

  public saveSettings(
    settings: PayrollSettingsState,
    orgId?: string,
    updatedBy: string = "Admin"
  ): void {
    const key = this.getStorageKey(orgId);
    const updatedSettings: PayrollSettingsState = {
      ...settings,
      lastUpdatedBy: updatedBy,
      lastUpdatedTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    try {
      localStorage.setItem(key, JSON.stringify(updatedSettings));
    } catch (e) {
      console.error("Failed to save payroll settings to localStorage:", e);
    }
    this.notifyListeners();
  }

  /* ─── Validation Helpers ─────────────────────────────────────────── */

  public validateSalaryComponent(
    component: Partial<SalaryComponent>,
    existingComponents: SalaryComponent[],
    currentId?: string
  ): { valid: boolean; error?: string } {
    if (!component.name || !component.name.trim()) {
      return { valid: false, error: "Component Name is required." };
    }
    if (!component.code || !component.code.trim()) {
      return { valid: false, error: "Component Code is required." };
    }
    const cleanCode = component.code.trim().toUpperCase();
    const isDuplicateCode = existingComponents.some(
      (c) => c.id !== currentId && c.code.toUpperCase() === cleanCode
    );
    if (isDuplicateCode) {
      return {
        valid: false,
        error: `Component Code "${cleanCode}" already exists. Please use a unique code.`,
      };
    }
    if (component.fixedAmount !== undefined && component.fixedAmount < 0) {
      return { valid: false, error: "Fixed Amount cannot be negative." };
    }
    if (component.percentageValue !== undefined) {
      if (component.percentageValue < 0 || component.percentageValue > 100) {
        return { valid: false, error: "Percentage Value must be between 0% and 100%." };
      }
    }
    return { valid: true };
  }

  public validateSalaryBand(
    band: Partial<SalaryBand>,
    existingBands: SalaryBand[],
    currentId?: string
  ): { valid: boolean; error?: string } {
    if (!band.grade || !band.grade.trim()) {
      return { valid: false, error: "Grade Name is required." };
    }
    if (!band.code || !band.code.trim()) {
      return { valid: false, error: "Band Code is required." };
    }
    const cleanCode = band.code.trim().toUpperCase();
    const isDuplicateCode = existingBands.some(
      (b) => b.id !== currentId && b.code.toUpperCase() === cleanCode
    );
    if (isDuplicateCode) {
      return {
        valid: false,
        error: `Band Code "${cleanCode}" already exists. Please use a unique code.`,
      };
    }
    const min = Number(band.minSalary);
    const max = Number(band.maxSalary);
    if (isNaN(min) || min < 0) {
      return { valid: false, error: "Minimum Salary must be a valid positive number." };
    }
    if (isNaN(max) || max < 0) {
      return { valid: false, error: "Maximum Salary must be a valid positive number." };
    }
    if (min > max) {
      return {
        valid: false,
        error: `Minimum Salary (₹${min.toLocaleString()}) cannot be greater than Maximum Salary (₹${max.toLocaleString()}).`,
      };
    }
    return { valid: true };
  }

  /* ─── Specialized Action Helpers ───────────────────────────────── */

  public updatePayCycle(
    payCycle: Partial<PayCycleSettings>,
    orgId?: string,
    user: string = "Admin"
  ): void {
    const current = this.getSettings(orgId);
    current.payCycle = { ...current.payCycle, ...payCycle };
    this.saveSettings(current, orgId, user);
  }

  public saveSalaryComponent(
    comp: SalaryComponent,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    const current = this.getSettings(orgId);
    const validation = this.validateSalaryComponent(
      comp,
      current.salaryComponents,
      comp.id
    );
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    const idx = current.salaryComponents.findIndex((c) => c.id === comp.id);
    if (idx === -1) {
      current.salaryComponents.push(comp);
    } else {
      current.salaryComponents[idx] = comp;
    }
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public deleteSalaryComponent(
    id: string,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    const current = this.getSettings(orgId);
    const target = current.salaryComponents.find((c) => c.id === id);
    if (target?.isSystem) {
      return {
        success: false,
        error: `System component "${target.name}" cannot be deleted. You may disable it instead.`,
      };
    }
    current.salaryComponents = current.salaryComponents.filter((c) => c.id !== id);
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public saveSalaryBand(
    band: SalaryBand,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    const current = this.getSettings(orgId);
    const validation = this.validateSalaryBand(band, current.salaryBands, band.id);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    const idx = current.salaryBands.findIndex((b) => b.id === band.id);
    if (idx === -1) {
      current.salaryBands.push(band);
    } else {
      current.salaryBands[idx] = band;
    }
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public deleteSalaryBand(
    id: string,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    const current = this.getSettings(orgId);
    current.salaryBands = current.salaryBands.filter((b) => b.id !== id);
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public savePfConfig(pf: Partial<PfConfig>, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.pfConfig = {
      ...current.pfConfig,
      ...pf,
    };
    this.saveSettings(current, orgId, user);
  }

  public saveEsiConfig(esi: EsiConfig, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.esiConfig = esi;
    this.saveSettings(current, orgId, user);
  }

  public savePtConfig(pt: PtConfig, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.ptConfig = pt;
    this.saveSettings(current, orgId, user);
  }

  public saveTdsConfig(tds: TdsConfig, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.tdsConfig = tds;
    this.saveSettings(current, orgId, user);
  }

  public saveGratuityConfig(
    gratuity: GratuityConfig,
    orgId?: string,
    user: string = "Admin"
  ): void {
    const current = this.getSettings(orgId);
    current.gratuityConfig = gratuity;
    this.saveSettings(current, orgId, user);
  }

  public saveCalendarPeriod(
    period: PayrollCalendarPeriod,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    const current = this.getSettings(orgId);
    const existing = current.payrollCalendar.find(
      (p) => p.id !== period.id && p.month.toLowerCase() === period.month.toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        error: `A pay period for "${period.month}" already exists in the calendar.`,
      };
    }
    const idx = current.payrollCalendar.findIndex((p) => p.id === period.id);
    if (idx === -1) {
      current.payrollCalendar.push(period);
    } else {
      current.payrollCalendar[idx] = period;
    }
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public deleteCalendarPeriod(id: string, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.payrollCalendar = current.payrollCalendar.filter((p) => p.id !== id);
    this.saveSettings(current, orgId, user);
  }

  public saveBankItem(
    bank: BankItem,
    orgId?: string,
    user: string = "Admin"
  ): { success: boolean; error?: string } {
    if (!bank.bankName || !bank.bankName.trim()) {
      return { success: false, error: "Bank Name is required." };
    }
    if (!bank.accountNo || !bank.accountNo.trim()) {
      return { success: false, error: "Account Number is required." };
    }
    const current = this.getSettings(orgId);
    if (bank.isDefault) {
      current.bankItems.forEach((b) => (b.isDefault = false));
    }
    const idx = current.bankItems.findIndex((b) => b.id === bank.id);
    if (idx === -1) {
      current.bankItems.push(bank);
    } else {
      current.bankItems[idx] = bank;
    }
    this.saveSettings(current, orgId, user);
    return { success: true };
  }

  public deleteBankItem(id: string, orgId?: string, user: string = "Admin"): void {
    const current = this.getSettings(orgId);
    current.bankItems = current.bankItems.filter((b) => b.id !== id);
    if (current.bankItems.length > 0 && !current.bankItems.some((b) => b.isDefault)) {
      current.bankItems[0].isDefault = true;
    }
    this.saveSettings(current, orgId, user);
  }

  public savePayslipTemplate(
    template: PayslipTemplateConfig,
    orgId?: string,
    user: string = "Admin"
  ): void {
    const current = this.getSettings(orgId);
    current.payslipTemplate = template;
    this.saveSettings(current, orgId, user);
  }

  public updatePayslipTemplate(
    patch: Partial<PayslipTemplateConfig>,
    orgId?: string,
    user: string = "Super Admin"
  ): PayslipTemplateConfig {
    const current = this.getSettings(orgId);
    current.payslipTemplate = {
      ...current.payslipTemplate,
      ...patch,
      visibleSections: {
        ...(current.payslipTemplate.visibleSections || {
          employeeInfo: true,
          earnings: true,
          deductions: true,
          employerContrib: true,
          netPay: true,
          paymentInfo: true,
        }),
        ...(patch.visibleSections || {}),
      },
    };
    this.saveSettings(current, orgId, user);
    return current.payslipTemplate;
  }

  public resetToDefault(orgId?: string, user: string = "Super Admin"): PayrollSettingsState {
    this.saveSettings(DEFAULT_PAYROLL_SETTINGS, orgId, user);
    return DEFAULT_PAYROLL_SETTINGS;
  }
}

export const payrollSettingsService = new PayrollSettingsService();
