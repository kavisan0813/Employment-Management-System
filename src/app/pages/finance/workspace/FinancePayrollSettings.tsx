import { useState, useEffect, useMemo, useReducer } from "react";
import { useAuth } from "../../../context/AuthContext";
import type { Employee } from "../../../context/AppContext";
import {
  Settings,
  Plus,
  Search,
  ArrowUpDown,
  Download,
  Edit2,
  Trash2,
  X,
  Calendar,
  Calculator,
  RefreshCw,
  Upload,
  ShieldCheck,
  IndianRupee,
  Info,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useEmployees } from "../../../context/AppContext";
import { payrollService } from "../payroll/payroll.service";

interface PayrollConfigState {
  payCycle: { frequency: string; basis: string; processingDate: string; payoutDate: string; lockAfterProcessing: boolean };
  salaryComponents: SalaryComponent[];
  salaryBands: SalaryGrade[];
  pfConfig: { employerContrib: string; employeeContrib: string; wageCeiling: string; epsApplicable: boolean };
  esiConfig: { employeeContrib: string; employerContrib: string; salaryLimit: string; enabled: boolean };
  professionalTax: any[];
  tdsSlabs: { oldRegime: any[]; newRegime: any[] };
  gratuityConfig: { eligibilityYears: string; formula: string; enabled: boolean };
  payrollCalendar: any[];
  banks: any[];
  payslipTemplate: any;
}

type PayrollConfigAction =
  | { type: "SYNC_ALL"; payload: PayrollConfigState }
  | { type: "SET_FIELD"; field: keyof PayrollConfigState; value: any };

const initialPayrollConfigState: PayrollConfigState = {
  payCycle: {
    frequency: "Monthly",
    basis: "Calendar Days",
    processingDate: "25",
    payoutDate: "30",
    lockAfterProcessing: true,
  },
  salaryComponents: [],
  salaryBands: [],
  pfConfig: {
    employerContrib: "12",
    employeeContrib: "12",
    wageCeiling: "15000",
    epsApplicable: true,
  },
  esiConfig: {
    employeeContrib: "0.75",
    employerContrib: "3.25",
    salaryLimit: "21000",
    enabled: true,
  },
  professionalTax: [],
  tdsSlabs: {
    oldRegime: [],
    newRegime: [],
  },
  gratuityConfig: {
    eligibilityYears: "5",
    formula: "(15 * Basic * Service Years) / 26",
    enabled: true,
  },
  payrollCalendar: [],
  banks: [],
  payslipTemplate: {
    templateId: "sleek",
    templateSource: "EMS_DEFAULT",
    name: "Modern Sleek",
    desc: "Clean glassmorphic layout with breakdown charts and corporate header",
    logoUrl: "",
    headerColor: "#00B87C",
    accentColor: "#00B87C",
    customTitle: "PAYSLIP FOR THE MONTH",
    headerText: "VIYAN HR EMS CORPORATE PAYSLIP",
    footerText: "This is a computer-generated payslip and does not require a physical signature.",
    notes: "Confidential - For Internal Use Only",
    signatureUrl: "",
    emailSubject: "Salary Payslip - {Month} {Year} - {EmployeeName}",
    emailBody: "Dear {EmployeeName},\n\nPlease find attached your salary payslip for {Month} {Year}.\n\nBest regards,\nFinance Team",
    autoEmail: true,
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
    uploadedTemplateStatus: "FRONTEND READY — BACKEND FILE STORAGE REQUIRED",
  },
};

function payrollConfigReducer(state: PayrollConfigState, action: PayrollConfigAction): PayrollConfigState {
  switch (action.type) {
    case "SYNC_ALL":
      return action.payload;
    case "SET_FIELD":
      return { ...state, [action.field]: typeof action.value === "function" ? action.value(state[action.field]) : action.value };
    default:
      return state;
  }
}
import { payrollSettingsService } from "../payroll/payrollSettings.service";
import { usePermissionKey } from "../../../shared/permission-engine/usePermission";
import { P } from "../../../shared/permission-engine/permissions";
import { calculatePayslip } from "../payroll/calculatePayslip";
import type { SalaryStructure } from "../payroll/payroll.types";
import { useForm } from "react-hook-form";
import * as m from "motion/react-m";

type NavItem = {
  id: string;
  label: string;
  section: "PAYROLL" | "STATUTORY" | "PROCESSING";
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "pay-cycle",
    label: "Pay Cycle",
    section: "PAYROLL",
  },
  {
    id: "salary-components",
    label: "Salary Components",
    section: "PAYROLL",
  },
  {
    id: "salary-structures",
    label: "Salary Structures",
    section: "PAYROLL",
  },
  {
    id: "bands-grades",
    label: "Salary Bands & Grades",
    section: "PAYROLL",
  },
  {
    id: "pf",
    label: "Provident Fund (PF)",
    section: "STATUTORY",
  },
  {
    id: "tds",
    label: "Tax (TDS) Settings",
    section: "STATUTORY",
  },
  {
    id: "prof-tax",
    label: "Professional Tax",
    section: "STATUTORY",
  },
  {
    id: "esi",
    label: "ESI Settings",
    section: "STATUTORY",
  },
  {
    id: "gratuity",
    label: "Gratuity",
    section: "STATUTORY",
  },
  {
    id: "calendar",
    label: "Payroll Calendar",
    section: "PROCESSING",
  },
  {
    id: "bank",
    label: "Bank Integration",
    section: "PROCESSING",
  },
  {
    id: "payslip",
    label: "Payslip Template",
    section: "PROCESSING",
  },
];

export interface SalaryComponent {
  id: string;
  code?: string;
  name: string;
  type: string;
  calculationBasis?: string;
  taxable: boolean;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  formula: string;
  order: number;
  isSystem: boolean;
  status: string;
}

export interface SalaryGrade {
  id: string;
  code?: string;
  grade: string;
  minSalary: number;
  maxSalary: number;
  currency?: string;
  department?: string;
  employees: number;
  desc: string;
}

export interface TaxSlab {
  id: string;
  fromAmt: number;
  toAmt: number;
  rate: number;
}

export interface ProfessionalTax {
  id: string;
  state: string;
  minSalary: number;
  maxSalary: number;
  amount: number;
}

export interface MonthSchedule {
  id: string;
  month: string;
  processingDate: string;
  transferDate: string;
  status: string;
}

export interface BankItem {
  id: string;
  bank?: string;
  bankName: string;
  accountNo: string;
  ifsc?: string;
  ifscCode: string;
  branch: string;
  status: string;
  lastSync?: string;
  paymentMode?: string;
  isDefault?: boolean;
}

export interface PayslipTemplate {
  id: string;
  name: string;
  desc: string;
  status: string;
  previewUrl: string;
}

export interface EditingItem {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  calculationBasis?: string;
  taxable?: boolean;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  formula?: string;
  order?: number;
  isSystem?: boolean;
  status?: string;
  grade?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  department?: string;
  employees?: number;
  desc?: string;
  fromAmt?: number;
  toAmt?: number;
  rate?: number;
  state?: string;
  amount?: number;
  month?: string;
  processingDate?: string;
  transferDate?: string;
  bank?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  ifscCode?: string;
  branch?: string;
  paymentMode?: string;
  isDefault?: boolean;
  previewUrl?: string;
  regime?: "oldRegime" | "newRegime";
  headerColor?: string;
  footerText?: string;
  logoUrl?: string;
  signatureUrl?: string;
  emailSubject?: string;
  emailBody?: string;
}
export interface PayslipTemplateConfig {
  logoUrl: string;
  headerColor: string;
  footerText: string;
  signatureUrl: string;
  emailSubject: string;
  emailBody: string;
}
export function FinancePayrollSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pay-cycle");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Custom Toast System (for bulletproof toast delivery)
  const [localToasts, setLocalToasts] = useState<
    {
      id: string;
      message: string;
      type: "success" | "error" | "info";
    }[]
  >([]);
  const showLocalToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Date.now().toString();
    setLocalToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
    toast[type](message); // Call sonner toast too
    setTimeout(() => {
      setLocalToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Determine Role Permissions using Canonical Permission Engine
  const hasPayrollManage = usePermissionKey(P.PAYROLL_MANAGE);
  const hasPayrollFull = usePermissionKey(P.PAYROLL_FULL);
  const canManagePayroll =
    hasPayrollManage ||
    hasPayrollFull ||
    user?.role === "Finance" ||
    user?.role === "Super Admin";

  // Global Tenant-Scoped Payroll Settings State (synced with payrollSettingsService)
  const orgId = user?.organizationId || "";

  const [payrollConfig, dispatchPayrollConfig] = useReducer(payrollConfigReducer, initialPayrollConfigState);
  const {
    payCycle, salaryComponents, salaryBands, pfConfig, esiConfig,
    professionalTax, tdsSlabs, gratuityConfig, payrollCalendar, banks, payslipTemplate
  } = payrollConfig;

  const setPayCycle = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "payCycle", value: v });
  const setSalaryComponents = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "salaryComponents", value: v });
  const setSalaryBands = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "salaryBands", value: v });
  const setPfConfig = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "pfConfig", value: v });
  const setEsiConfig = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "esiConfig", value: v });
  const setProfessionalTax = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "professionalTax", value: v });
  const setTdsSlabs = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "tdsSlabs", value: v });
  const setGratuityConfig = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "gratuityConfig", value: v });
  const setPayrollCalendar = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "payrollCalendar", value: v });
  const setBanks = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "banks", value: v });
  const setPayslipTemplate = (v: any) => dispatchPayrollConfig({ type: "SET_FIELD", field: "payslipTemplate", value: v });

  // Sync state from payrollSettingsService
  useEffect(() => {
    const sync = () => {
      const s = payrollSettingsService.getSettings(orgId);
      dispatchPayrollConfig({
        type: "SYNC_ALL",
        payload: {
          payCycle: {
            frequency: s.payCycle.frequency,
            basis: s.payCycle.basis,
            processingDate: s.payCycle.processingDate,
            payoutDate: s.payCycle.payoutDate,
            lockAfterProcessing: s.payCycle.lockAfterProcessing,
          },
          salaryComponents: s.salaryComponents.map((c) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            type: c.type,
            taxable: c.taxable,
            formula: c.formula || (c.fixedAmount ? `₹${c.fixedAmount}` : `${c.percentageValue}%`),
            order: c.order,
            isSystem: c.isSystem,
            status: c.status,
            calculationBasis: c.calculationBasis,
            fixedAmount: c.fixedAmount,
            percentageValue: c.percentageValue,
            pfApplicable: c.pfApplicable,
            esiApplicable: c.esiApplicable,
            effectiveDate: c.effectiveDate,
          })) as any,
          salaryBands: s.salaryBands.map((b) => ({
            id: b.id,
            code: b.code,
            grade: b.grade,
            minSalary: b.minSalary,
            maxSalary: b.maxSalary,
            employees: b.employees,
            desc: b.desc,
            currency: b.currency,
            department: b.department,
            status: b.status,
            effectiveDate: b.effectiveDate,
          })) as any,
          pfConfig: {
            employerContrib: s.pfConfig.employerContrib,
            employeeContrib: s.pfConfig.employeeContrib,
            wageCeiling: s.pfConfig.wageCeiling,
            epsApplicable: s.pfConfig.epsApplicable,
          },
          esiConfig: {
            employeeContrib: s.esiConfig.employeeContrib,
            employerContrib: s.esiConfig.employerContrib,
            salaryLimit: s.esiConfig.salaryLimit,
            enabled: s.esiConfig.enabled,
          },
          professionalTax: s.ptConfig.slabs as any,
          tdsSlabs: {
            oldRegime: s.tdsConfig.oldRegime,
            newRegime: s.tdsConfig.newRegime,
          },
          gratuityConfig: {
            eligibilityYears: s.gratuityConfig.eligibilityYears,
            formula: s.gratuityConfig.formula,
            enabled: s.gratuityConfig.enabled,
          },
          payrollCalendar: s.payrollCalendar as any,
          banks: s.bankItems.map((b) => ({
            id: b.id,
            bank: b.bankName,
            accountNo: b.accountNo,
            ifsc: b.ifscCode,
            branch: b.branch,
            status: b.status === "Configured" ? "Connected" : b.status,
            lastSync: b.lastSync || "N/A",
            paymentMode: b.paymentMode,
            isDefault: b.isDefault,
          })),
          payslipTemplate: s.payslipTemplate
            ? {
                ...s.payslipTemplate,
                visibleSections: s.payslipTemplate.visibleSections || {
                  employeeInfo: true,
                  earnings: true,
                  deductions: true,
                  employerContrib: true,
                  netPay: true,
                  paymentInfo: true,
                },
              }
            : initialPayrollConfigState.payslipTemplate,
        },
      });
    };

    sync();
    const unsubscribe = payrollSettingsService.subscribe(sync);
    return unsubscribe;
  }, [orgId]);

  // Table Helpers (Search, Sort, Pagination)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };
  const genericExport = (
    filename: string,
    headers: string[],
    rows: (string | number | boolean)[][],
  ) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(",")]
        .concat(
          rows.map((e) =>
            e.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(","),
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showLocalToast(`${filename} exported successfully!`);
  };

  // Modals States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 space-y-6 animate-in fade-in duration-500 bg-background min-h-screen text-foreground">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Settings size={22} className="text-[#00C781]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-foreground">
              Payroll Settings
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Configure pay cycles, salary components, statutory rules, and bank
              integrations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 text-[12px] font-bold text-[#00C781]">
          <ShieldCheck size={16} />
          <span>Role: {user?.role || "Finance"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* LEFT SUB-NAV */}
        <aside className="bg-card border border-border rounded-[20px] p-3 shadow-lg space-y-6">
          <NavSection
            title="PAYROLL"
            items={NAV_ITEMS.filter((i) => i.section === "PAYROLL")}
            activeId={activeTab}
            onSelect={(id) => {
              setActiveTab(id);
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
          <NavSection
            title="STATUTORY"
            items={NAV_ITEMS.filter((i) => i.section === "STATUTORY")}
            activeId={activeTab}
            onSelect={(id) => {
              setActiveTab(id);
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
          <NavSection
            title="PROCESSING"
            items={NAV_ITEMS.filter((i) => i.section === "PROCESSING")}
            activeId={activeTab}
            onSelect={(id) => {
              setActiveTab(id);
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
        </aside>

        {/* CONTENT AREA */}
        <main className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.2,
              }}
              className="space-y-6"
            >
              {/* TAB 1: PAY CYCLE */}
              {activeTab === "pay-cycle" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                    <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                      Monthly Payroll Settings
                    </h2>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Payroll Frequency
                        </label>
                        <select
                          value={payCycle.frequency}
                          onChange={(e) =>
                            setPayCycle({
                              ...payCycle,
                              frequency: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        >
                          <option>Monthly</option>
                          <option>Bi-Weekly</option>
                          <option>Semi-Monthly</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Salary Calculation Basis
                        </label>
                        <select
                          value={payCycle.basis}
                          onChange={(e) =>
                            setPayCycle({
                              ...payCycle,
                              basis: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        >
                          <option>Calendar Days</option>
                          <option>30 Days Fixed</option>
                          <option>Actual Days Worked</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Payroll Processing Date
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={payCycle.processingDate}
                          onChange={(e) =>
                            setPayCycle({
                              ...payCycle,
                              processingDate: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Salary Payout Date
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={payCycle.payoutDate}
                          onChange={(e) =>
                            setPayCycle({
                              ...payCycle,
                              payoutDate: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between py-4 border-t border-border">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Lock payroll after processing
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Lock all employee financial cards instantly after
                            final approval
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setPayCycle({
                              ...payCycle,
                              lockAfterProcessing:
                                !payCycle.lockAfterProcessing,
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${payCycle.lockAfterProcessing ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]" : "bg-muted border border-border"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${payCycle.lockAfterProcessing ? "translate-x-6" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                      <button
                        onClick={() => {
                          if (!canManagePayroll) {
                            showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                            return;
                          }
                          const defaultCycle = {
                            frequency: "Monthly",
                            basis: "Calendar Days",
                            processingDate: "25",
                            payoutDate: "30",
                            lockAfterProcessing: true,
                          };
                          setPayCycle(defaultCycle);
                          payrollSettingsService.updatePayCycle(defaultCycle as any, orgId, user?.name);
                          showLocalToast(
                            "Pay cycle settings reset to defaults",
                            "info",
                          );
                        }}
                        className="px-6 py-2.5 rounded-xl border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          if (!canManagePayroll) {
                            showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                            return;
                          }
                          payrollSettingsService.updatePayCycle(payCycle as any, orgId, user?.name);
                          showLocalToast("Payroll cycle updated successfully", "success");
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 2: SALARY COMPONENTS */}
              {activeTab === "salary-components" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Salary Components Matrix
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("add-component");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                    >
                      <Plus size={14} /> Add Component
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Filter & Export Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative max-w-xs w-full">
                        <Search
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type="text"
                          placeholder="Search components..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder-gray-500 focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            genericExport(
                              "SalaryComponents.csv",
                              [
                                "Name",
                                "Type",
                                "Formula",
                                "Taxable",
                                "Order",
                                "Status",
                              ],
                              salaryComponents.map((c) => [
                                c.name,
                                c.type,
                                c.formula,
                                c.taxable ? "Yes" : "No",
                                c.order,
                                c.status,
                              ]),
                            )
                          }
                          className="p-2.5 rounded-xl border border-border hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          title="Export CSV"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                      <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                          <tr>
                            <th
                              onClick={() => handleSort("name")}
                              className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            >
                              <span className="flex items-center gap-1">
                                Component <ArrowUpDown size={12} />
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("type")}
                              className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            >
                              <span className="flex items-center gap-1">
                                Type <ArrowUpDown size={12} />
                              </span>
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Formula
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                              Taxable
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                              Status
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {salaryComponents
                            .filter((c) =>
                              c.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                            )
                            .sort((a, b) => {
                              if (!sortField) return 0;
                              const fieldA = (a as any)[sortField]?.toString() || "";
                              const fieldB = (b as any)[sortField]?.toString() || "";
                              return sortAsc
                                ? fieldA.localeCompare(fieldB)
                                : fieldB.localeCompare(fieldA);
                            })
                            .slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage,
                            )
                            .map((comp) => (
                              <tr
                                key={comp.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm font-bold text-foreground">
                                  {comp.name}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                  <span
                                    className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${comp.type === "Earnings" ? "bg-emerald-500/10 border-emerald-500/20 text-[#00C781]" : "bg-purple-500/10 border-purple-500/20 text-purple-400"}`}
                                  >
                                    {comp.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                  {comp.formula}
                                </td>
                                <td className="px-6 py-4 text-center text-xs">
                                  <span
                                    className={`font-bold ${comp.taxable ? "text-amber-500" : "text-muted-foreground"}`}
                                  >
                                    {comp.taxable ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => {
                                      setSalaryComponents((prev) =>
                                        prev.map((c) =>
                                          c.id === comp.id
                                            ? {
                                              ...c,
                                              status:
                                                c.status === "Enabled"
                                                  ? "Disabled"
                                                  : "Enabled",
                                            }
                                            : c,
                                        ),
                                      );
                                      showLocalToast(
                                        `${comp.name} ${comp.status === "Enabled" ? "Disabled" : "Enabled"} successfully`,
                                      );
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${comp.status === "Enabled" ? "bg-emerald-500/10 text-[#00C781]" : "bg-red-500/10 text-red-400"}`}
                                  >
                                    {comp.status}
                                  </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingItem(comp);
                                        setActiveModal("add-component");
                                      }}
                                      className="p-1 hover:text-[#00C781] text-muted-foreground transition-colors"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                       disabled={comp.isSystem && !canManagePayroll}
                                       onClick={() => {
                                         if (!canManagePayroll) {
                                           showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                                           return;
                                         }
                                         if (comp.isSystem) {
                                           showLocalToast("Permission denied: System components cannot be deleted", "error");
                                           return;
                                         }
                                         const res = payrollSettingsService.deleteSalaryComponent(comp.id, orgId, user?.name);
                                         if (!res.success) {
                                           showLocalToast(res.error || "Failed to delete component", "error");
                                           return;
                                         }
                                         showLocalToast("Component deleted successfully", "success");
                                       }}
                                       className={`p-1 transition-colors ${comp.isSystem ? "text-white/10 cursor-not-allowed" : "hover:text-red-400 text-muted-foreground"}`}
                                       title={
                                         comp.isSystem
                                           ? "System Component (Protected)"
                                           : "Delete Component"
                                       }
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Page {currentPage} of{" "}
                        {Math.ceil(salaryComponents.length / itemsPerPage)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          className="px-3 py-1 rounded bg-input-background border border-border text-xs text-foreground disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <button
                          disabled={
                            currentPage >=
                            Math.ceil(salaryComponents.length / itemsPerPage)
                          }
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          className="px-3 py-1 rounded bg-input-background border border-border text-xs text-foreground disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 3: SALARY BANDS & GRADES */}
              {activeTab === "bands-grades" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Salary Bands & Grade Matrix
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("add-grade");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                    >
                      <Plus size={14} /> Add Grade
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Search & Export */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative max-w-xs w-full">
                        <Search
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type="text"
                          placeholder="Search grades..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder-gray-500 focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() =>
                          genericExport(
                            "SalaryBands.csv",
                            [
                              "Grade",
                              "Min Salary",
                              "Max Salary",
                              "Employees",
                              "Description",
                            ],
                            salaryBands.map((s) => [
                              s.grade,
                              s.minSalary,
                              s.maxSalary,
                              s.employees,
                              s.desc,
                            ]),
                          )
                        }
                        className="p-2.5 rounded-xl border border-border hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Download size={16} />
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                      <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Grade
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Min Salary
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Max Salary
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                              Employees
                            </th>
                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {salaryBands
                            .filter((g) =>
                              g.grade
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                            )
                            .map((band) => (
                              <tr
                                key={band.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4 font-bold text-foreground text-sm">
                                  {band.grade}
                                  <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                                    {band.desc}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-foreground">
                                  ₹{band.minSalary.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-foreground">
                                  ₹{band.maxSalary.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-bold text-[#00C781]">
                                  {band.employees}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingItem(band);
                                        setActiveModal("add-grade");
                                      }}
                                      className="p-1 hover:text-[#00C781] text-muted-foreground transition-colors"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      disabled={!canManagePayroll}
                                      onClick={() => {
                                        if (!canManagePayroll) {
                                          showLocalToast(
                                            "Permission denied: PAYROLL_MANAGE required",
                                            "error",
                                          );
                                          return;
                                        }
                                        const res = payrollSettingsService.deleteSalaryBand(band.id, orgId, user?.name);
                                        if (!res.success) {
                                          showLocalToast(res.error || "Failed to delete salary band", "error");
                                          return;
                                        }
                                        showLocalToast("Grade deleted successfully", "success");
                                      }}
                                      className={`p-1 transition-colors ${!canManagePayroll ? "text-white/10 cursor-not-allowed" : "hover:text-red-400 text-muted-foreground"}`}
                                      title={
                                        !canManagePayroll
                                          ? "Permission Required"
                                          : "Delete Grade"
                                      }
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 4: PROVIDENT FUND */}
              {activeTab === "pf" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                    <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                      PF Configuration
                    </h2>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Employer Contribution %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={pfConfig.employerContrib}
                            onChange={(e) =>
                              setPfConfig({
                                ...pfConfig,
                                employerContrib: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Employee Contribution %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={pfConfig.employeeContrib}
                            onChange={(e) =>
                              setPfConfig({
                                ...pfConfig,
                                employeeContrib: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Wage Ceiling (INR)
                        </label>
                        <input
                          type="number"
                          value={pfConfig.wageCeiling}
                          onChange={(e) =>
                            setPfConfig({
                              ...pfConfig,
                              wageCeiling: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between py-4 border-t border-border col-span-1 md:col-span-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            EPS Applicability
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Divert 8.33% of employer contribution into Pension
                            Scheme (EPS)
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setPfConfig({
                              ...pfConfig,
                              epsApplicable: !pfConfig.epsApplicable,
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${pfConfig.epsApplicable ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]" : "bg-muted border border-border"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${pfConfig.epsApplicable ? "translate-x-6" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                      <button
                        onClick={() => {
                          if (!canManagePayroll) {
                            showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                            return;
                          }
                          payrollSettingsService.savePfConfig(pfConfig, orgId, user?.name);
                          showLocalToast(
                            "PF configurations updated successfully",
                            "success"
                          );
                        }}
                        className="px-6 py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 5: TAX (TDS) SETTINGS */}
              {activeTab === "tds" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Old Regime Slabs */}
                  <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                    <div className="px-6 py-4 bg-amber-500/5 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <h2 className="text-[12px] font-bold text-amber-500 uppercase tracking-widest">
                          Old Regime Slabs
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem({
                            regime: "oldRegime",
                          });
                          setActiveModal("add-slab");
                        }}
                        className="px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500/10 transition-all"
                      >
                        + Add Slab
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                        <table className="w-full text-left">
                          <thead className="bg-card border-b border-border">
                            <tr>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground">
                                From Amount
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground">
                                To Amount
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground text-center">
                                Tax Rate
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground text-right">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <TdsSlabRows
                              slabs={tdsSlabs.oldRegime}
                              onEdit={(slab) => {
                                setEditingItem({
                                  ...slab,
                                  regime: "oldRegime",
                                });
                                setActiveModal("add-slab");
                              }}
                              onDelete={(id) => {
                                setTdsSlabs({
                                  ...tdsSlabs,
                                  oldRegime: tdsSlabs.oldRegime.filter(
                                    (s) => s.id !== id,
                                  ),
                                });
                                showLocalToast("Slab deleted");
                              }}
                            />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  {/* New Regime Slabs */}
                  <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                    <div className="px-6 py-4 bg-[#00B87C]/5 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                        <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                          New Regime Slabs
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem({
                            regime: "newRegime",
                          });
                          setActiveModal("add-slab");
                        }}
                        className="px-3 py-1.5 rounded-xl border border-emerald-500/30 text-[#00C781] text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/10 transition-all"
                      >
                        + Add Slab
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                        <table className="w-full text-left">
                          <thead className="bg-card border-b border-border">
                            <tr>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground">
                                From Amount
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground">
                                To Amount
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground text-center">
                                Tax Rate
                              </th>
                              <th className="px-4 py-3 text-[10px] uppercase text-muted-foreground text-right">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <TdsSlabRows
                              slabs={tdsSlabs.newRegime}
                              onEdit={(slab) => {
                                setEditingItem({
                                  ...slab,
                                  regime: "newRegime",
                                });
                                setActiveModal("add-slab");
                              }}
                              onDelete={(id) => {
                                setTdsSlabs({
                                  ...tdsSlabs,
                                  newRegime: tdsSlabs.newRegime.filter(
                                    (s) => s.id !== id,
                                  ),
                                });
                                showLocalToast("Slab deleted");
                              }}
                            />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 6: PROFESSIONAL TAX */}
              {activeTab === "prof-tax" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Professional Tax (PT) Rules
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("add-pt");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                    >
                      <Plus size={14} /> Add State Rule
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                      <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              State
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Monthly Salary Range
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-center">
                              PT Amount
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {professionalTax.map((rule) => (
                            <tr
                              key={rule.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-bold text-foreground">
                                {rule.state}
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {rule.minSalary === 0 &&
                                  rule.maxSalary === 99999999
                                  ? "Any Gross Salary"
                                  : `₹${rule.minSalary.toLocaleString()} - ${rule.maxSalary > 90000000 ? "Above" : `₹${rule.maxSalary.toLocaleString()}`}`}
                              </td>
                              <td className="px-6 py-4 text-center text-sm font-bold text-emerald-400">
                                ₹{rule.amount}/month
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(rule);
                                      setActiveModal("add-pt");
                                    }}
                                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setProfessionalTax((prev) =>
                                        prev.filter((r) => r.id !== rule.id),
                                      );
                                      showLocalToast("PT state rule deleted");
                                    }}
                                    className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 7: ESI SETTINGS */}
              {activeTab === "esi" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                    <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                      ESI Settings
                    </h2>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Employee Contribution %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={esiConfig.employeeContrib}
                            onChange={(e) =>
                              setEsiConfig({
                                ...esiConfig,
                                employeeContrib: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Employer Contribution %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={esiConfig.employerContrib}
                            onChange={(e) =>
                              setEsiConfig({
                                ...esiConfig,
                                employerContrib: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          Gross Salary Limit (INR)
                        </label>
                        <input
                          type="number"
                          value={esiConfig.salaryLimit}
                          onChange={(e) =>
                            setEsiConfig({
                              ...esiConfig,
                              salaryLimit: e.target.value,
                            })
                          }
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between py-4 border-t border-border col-span-1 md:col-span-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Enable ESI Deduction
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Check to activate ESI contributions automatically
                            for eligible employees
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setEsiConfig({
                              ...esiConfig,
                              enabled: !esiConfig.enabled,
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${esiConfig.enabled ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]" : "bg-muted border border-border"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${esiConfig.enabled ? "translate-x-6" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                      <button
                        onClick={() => {
                          if (!canManagePayroll) {
                            showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                            return;
                          }
                          payrollSettingsService.saveEsiConfig(esiConfig, orgId, user?.name);
                          showLocalToast("ESI settings updated successfully", "success");
                        }}
                        className="px-6 py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 8: GRATUITY */}
              {activeTab === "gratuity" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left config card */}
                  <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg lg:col-span-2">
                    <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Gratuity Provision Settings
                      </h2>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                            Eligibility (Minimum Years)
                          </label>
                          <input
                            type="number"
                            value={gratuityConfig.eligibilityYears}
                            onChange={(e) =>
                              setGratuityConfig({
                                ...gratuityConfig,
                                eligibilityYears: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                            Gratuity Formula
                          </label>
                          <input
                            type="text"
                            value={gratuityConfig.formula}
                            onChange={(e) =>
                              setGratuityConfig({
                                ...gratuityConfig,
                                formula: e.target.value,
                              })
                            }
                            className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between py-4 border-t border-border col-span-1 md:col-span-2">
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              Enable Gratuity Accumulation
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Accumulate gratuity liabilities on a monthly basis
                              for eligible profiles
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setGratuityConfig({
                                ...gratuityConfig,
                                enabled: !gratuityConfig.enabled,
                              })
                            }
                            className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${gratuityConfig.enabled ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]" : "bg-muted border border-border"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${gratuityConfig.enabled ? "translate-x-6" : "translate-x-0"}`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-amber-500 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                          <AlertCircle size={14} />
                          <span>Calculation Engine Boundary: Gratuity liability accrual is calculated during payroll run.</span>
                        </div>
                        <button
                          onClick={() => {
                            if (!canManagePayroll) {
                              showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                              return;
                            }
                            payrollSettingsService.saveGratuityConfig(gratuityConfig, orgId, user?.name);
                            showLocalToast(
                              "Gratuity settings saved successfully",
                              "success"
                            );
                          }}
                          className="px-6 py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Calculator preview card */}
                  <GratuityCalculator
                    eligibilityYears={
                      parseInt(gratuityConfig.eligibilityYears) || 5
                    }
                  />
                </div>
              )}

              {/* TAB 9: PAYROLL CALENDAR */}
              {activeTab === "calendar" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Payroll Calendars & Cycles
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("add-month");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                    >
                      <Plus size={14} /> Add Month
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                      <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Month
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Processing Date
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Bank Transfer Date
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-center">
                              Status
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {payrollCalendar.map((cal) => (
                            <tr
                              key={cal.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-bold text-foreground flex items-center gap-2">
                                <Calendar
                                  size={14}
                                  className="text-muted-foreground"
                                />
                                {cal.month}
                              </td>
                              <td className="px-6 py-4 text-xs text-foreground">
                                {cal.processingDate}
                              </td>
                              <td className="px-6 py-4 text-xs text-foreground">
                                {cal.transferDate}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${cal.status === "Processed" ? "bg-emerald-500/10 border-emerald-500/20 text-[#00C781]" : cal.status === "Scheduled" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}
                                >
                                  {cal.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setEditingItem(cal);
                                    setActiveModal("add-month");
                                  }}
                                  className="text-[11px] font-bold text-[#00C781] hover:underline uppercase tracking-wider"
                                >
                                  Edit Schedule
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 10: BANK INTEGRATION */}
              {activeTab === "bank" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                            Connected Settlement Banks
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            CONFIGURED IN FRONTEND
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Bank API Boundary: Account configurations are persisted locally. Direct payment gateway APIs remain a documented backend boundary.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("connect-bank");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all shrink-0"
                    >
                      <Plus size={14} /> Connect Bank
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
                      <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Bank Details
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              IFSC & Branch
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-center">
                              Status
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground">
                              Last Sync
                            </th>
                            <th className="px-6 py-4 text-[11px] uppercase text-muted-foreground text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {banks.map((b) => (
                            <tr
                              key={b.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-bold text-foreground">
                                {b.bank}
                                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                                  A/C: {b.accountNo}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-foreground">
                                {b.ifsc}
                                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                                  {b.branch}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${b.status === "Connected" ? "bg-emerald-500/10 text-[#00C781]" : "bg-white/5 text-muted-foreground"}`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {b.lastSync}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {b.status === "Connected" ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setBanks((prev) =>
                                            prev.map((bank) =>
                                              bank.id === b.id
                                                ? {
                                                  ...bank,
                                                  lastSync:
                                                    new Date().toLocaleString(),
                                                }
                                                : bank,
                                            ),
                                          );
                                          showLocalToast(
                                            "Sync complete with " + b.bank,
                                          );
                                        }}
                                        className="p-1 hover:text-[#00C781] text-muted-foreground transition-colors"
                                        title="Sync Gateway"
                                      >
                                        <RefreshCw
                                          size={14}
                                          className="animate-spin-hover"
                                        />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setBanks((prev) =>
                                            prev.map((bank) =>
                                              bank.id === b.id
                                                ? {
                                                  ...bank,
                                                  status: "Disconnected",
                                                  lastSync: "N/A",
                                                }
                                                : bank,
                                            ),
                                          );
                                          showLocalToast(
                                            "Disconnected from " + b.bank,
                                            "info",
                                          );
                                        }}
                                        className="text-[10px] font-bold text-red-400 uppercase tracking-wider hover:underline"
                                      >
                                        Disconnect
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setBanks((prev) =>
                                          prev.map((bank) =>
                                            bank.id === b.id
                                              ? {
                                                ...bank,
                                                status: "Connected",
                                                lastSync:
                                                  new Date().toLocaleString(),
                                              }
                                              : bank,
                                          ),
                                        );
                                        showLocalToast(
                                          b.bank + " connected successfully!",
                                        );
                                      }}
                                      className="text-[10px] font-bold text-[#00C781] uppercase tracking-wider hover:underline"
                                    >
                                      Connect
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 11: PAYSLIP TEMPLATE */}
              {activeTab === "payslip" && (
                <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg">
                  <PayslipConfigurator
                    template={payslipTemplate}
                    onChange={setPayslipTemplate}
                    onToast={showLocalToast}
                  />
                </section>
              )}

              {/* TAB: SALARY STRUCTURES */}
              {activeTab === "salary-structures" && (
                <SalaryStructuresSection
                  key={refreshKey}
                  onConfigure={(emp) => {
                    setSelectedEmployee(emp);
                    setActiveModal("configure-structure");
                  }}
                />
              )}
            </m.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── MODALS ────────────────────────── */}
      <AnimatePresence>
        {activeModal && activeModal !== "configure-structure" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B17]/80 backdrop-blur-sm p-4 text-foreground">
            <m.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="w-full max-w-md bg-card border border-border rounded-[20px] shadow-2xl overflow-hidden text-foreground"
            >
              <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                  {editingItem ? "Edit Setting" : "Create Setting"}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body Loader */}
              {activeModal === "add-component" && (
                <SalaryComponentForm
                  item={editingItem}
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const compToSave: any = {
                      id: editingItem?.id || `comp-${Date.now()}`,
                      code: data.code,
                      name: data.name,
                      type: data.type as any,
                      calculationBasis: data.calculationBasis as any,
                      formula: data.formula,
                      taxable: data.taxable,
                      pfApplicable: data.pfApplicable,
                      esiApplicable: data.esiApplicable,
                      order: data.order,
                      isSystem: editingItem?.isSystem ?? false,
                      status: editingItem?.status || "Enabled",
                    };
                    const res = payrollSettingsService.saveSalaryComponent(compToSave, orgId, user?.name);
                    if (!res.success) {
                      showLocalToast(res.error || "Failed to save component", "error");
                      return;
                    }
                    showLocalToast(editingItem ? "Component updated successfully" : "Component added successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-grade" && (
                <SalaryGradeForm
                  item={editingItem}
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const bandToSave: any = {
                      id: editingItem?.id || `band-${Date.now()}`,
                      code: data.code,
                      grade: data.grade,
                      minSalary: Number(data.minSalary),
                      maxSalary: Number(data.maxSalary),
                      currency: data.currency,
                      department: data.department,
                      employees: editingItem?.employees || 0,
                      desc: data.desc,
                      status: editingItem?.status || "Active",
                    };
                    const res = payrollSettingsService.saveSalaryBand(bandToSave, orgId, user?.name);
                    if (!res.success) {
                      showLocalToast(res.error || "Failed to save salary band", "error");
                      return;
                    }
                    showLocalToast(editingItem ? "Grade updated successfully" : "Grade created successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-slab" && (
                <TaxSlabForm
                  item={editingItem}
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const regime = editingItem?.regime as "oldRegime" | "newRegime" || "newRegime";
                    const currentTds = payrollSettingsService.getSettings(orgId).tdsConfig;
                    const updatedSlabs = editingItem?.id
                      ? currentTds[regime].map((s) => (s.id === editingItem.id ? { ...s, ...data } : s))
                      : [...currentTds[regime], { ...data, id: `slab-${Date.now()}` }];
                    
                    const newTdsConfig = {
                      ...currentTds,
                      [regime]: updatedSlabs,
                    };
                    payrollSettingsService.saveTdsConfig(newTdsConfig, orgId, user?.name);
                    showLocalToast("Tax slab configured successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-pt" && (
                <ProfessionalTaxForm
                  item={editingItem}
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const currentPt = payrollSettingsService.getSettings(orgId).ptConfig;
                    const updatedSlabs = editingItem?.id
                      ? currentPt.slabs.map((r) => (r.id === editingItem.id ? { ...r, ...data } : r))
                      : [...currentPt.slabs, { ...data, id: `pt-${Date.now()}` }];

                    payrollSettingsService.savePtConfig({ ...currentPt, slabs: updatedSlabs as any }, orgId, user?.name);
                    showLocalToast("PT state rule configured successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-month" && (
                <MonthScheduleForm
                  item={editingItem}
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const periodToSave: any = {
                      id: editingItem?.id || `cal-${Date.now()}`,
                      month: data.month,
                      processingDate: data.processingDate,
                      transferDate: data.transferDate,
                      status: editingItem?.status || "Scheduled",
                    };
                    const res = payrollSettingsService.saveCalendarPeriod(periodToSave, orgId, user?.name);
                    if (!res.success) {
                      showLocalToast(res.error || "Failed to save calendar period", "error");
                      return;
                    }
                    showLocalToast("Payroll calendar configured successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "connect-bank" && (
                <ConnectBankForm
                  onSave={(data) => {
                    if (!canManagePayroll) {
                      showLocalToast("Permission denied: PAYROLL_MANAGE required", "error");
                      return;
                    }
                    const bankToSave: any = {
                      id: `bank-${Date.now()}`,
                      bankName: data.bank,
                      accountNo: data.accountNo,
                      ifscCode: data.ifsc,
                      branch: data.branch,
                      paymentMode: "NEFT",
                      isDefault: false,
                      status: "Configured",
                      lastSync: new Date().toLocaleString(),
                    };
                    const res = payrollSettingsService.saveBankItem(bankToSave, orgId, user?.name);
                    if (!res.success) {
                      showLocalToast(res.error || "Failed to connect bank", "error");
                      return;
                    }
                    showLocalToast("Bank connected successfully", "success");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}
            </m.div>
          </div>
        )}

        {activeModal === "configure-structure" && selectedEmployee && (
          <SalaryStructureModal
            employee={selectedEmployee}
            onClose={() => {
              setActiveModal(null);
              setSelectedEmployee(null);
            }}
            onSaveSuccess={() => {
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}
      </AnimatePresence>

      {/* Local Toast Portal UI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {localToasts.map((t) => (
          <m.div
            key={t.id}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            className={`px-5 py-3 rounded-xl shadow-lg border text-sm font-bold text-white min-w-[280px] pointer-events-auto flex items-center justify-between ${t.type === "error" ? "bg-red-500/20 border-red-500/30 text-red-300" : t.type === "info" ? "bg-blue-500/20 border-blue-500/30 text-blue-300" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"}`}
          >
            <span>{t.message}</span>
            <button
              onClick={() =>
                setLocalToasts((prev) =>
                  prev.filter((item) => item.id !== t.id),
                )
              }
              className="ml-4 opacity-75 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </m.div>
        ))}
      </div>
    </div>
  );
}

/* ─── HELPER COMPONENTS ────────────────────────── */

function TdsSlabRows({
  slabs,
  onEdit,
  onDelete,
}: {
  slabs: TaxSlab[];
  onEdit: (slab: TaxSlab) => void;
  onDelete: (slabId: string) => void;
}) {
  return (
    <>
      {slabs.map((slab) => (
        <tr key={slab.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3 text-xs text-foreground font-medium">
            ₹{slab.fromAmt.toLocaleString()}
          </td>
          <td className="px-4 py-3 text-xs text-foreground font-medium">
            {slab.toAmt > 90000000 ? "Above" : `₹${slab.toAmt.toLocaleString()}`}
          </td>
          <td className="px-4 py-3 text-xs font-bold text-[#00C781] text-center">
            {slab.rate}%
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => onEdit(slab)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => onDelete(slab.id)}
                className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

function NavSection({
  title,
  items,
  activeId,
  onSelect,
}: {
  title: string;
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
        {title}
      </p>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all relative ${isActive ? "bg-emerald-500/10 text-[#00C781]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            {item.label}
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── MODAL FORMS ────────────────────────── */

function SalaryComponentForm({
  item,
  onSave,
  onCancel,
}: {
  item: EditingItem | null;
  onSave: (data: {
    code: string;
    name: string;
    type: string;
    calculationBasis: string;
    formula: string;
    taxable: boolean;
    pfApplicable: boolean;
    esiApplicable: boolean;
    order: number;
  }) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(item?.code || "");
  const [name, setName] = useState(item?.name || "");
  const [type, setType] = useState(item?.type || "Earnings");
  const [calculationBasis, setCalculationBasis] = useState(item?.calculationBasis || "Fixed");
  const [taxable, setTaxable] = useState(item?.taxable ?? true);
  const [pfApplicable, setPfApplicable] = useState(item?.pfApplicable ?? false);
  const [esiApplicable, setEsiApplicable] = useState(item?.esiApplicable ?? false);
  const [formula, setFormula] = useState(item?.formula || "");
  const [order, setOrder] = useState(item?.order || 1);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Component Name is required.");
      return;
    }
    if (!code.trim()) {
      setError("Component Code is required.");
      return;
    }
    setError("");
    onSave({
      code: code.trim().toUpperCase(),
      name,
      type,
      calculationBasis,
      formula: formula || (calculationBasis === "Fixed" ? "Fixed amount" : "Percentage"),
      taxable,
      pfApplicable,
      esiApplicable,
      order: order || 1,
    });
  };

  return (
    <div className="p-6 space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Component Code *
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none font-mono uppercase"
            placeholder="e.g. BASIC"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Component Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
            placeholder="e.g. Basic Pay"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Classification
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
          >
            <option value="Earnings">Earnings</option>
            <option value="Deductions">Deductions</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Calculation Basis
          </label>
          <select
            value={calculationBasis}
            onChange={(e) => setCalculationBasis(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
          >
            <option value="Fixed">Fixed Amount</option>
            <option value="Percentage of Basic">Percentage of Basic</option>
            <option value="Percentage of CTC">Percentage of CTC</option>
            <option value="Formula">Custom Formula</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Formula / Rule Expression
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. 50% of CTC or ₹1,600/month"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 py-2 border-y border-border">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">Taxable</span>
          <button
            type="button"
            onClick={() => setTaxable(!taxable)}
            className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${taxable ? "bg-[#00B87C]" : "bg-muted border border-border"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${taxable ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">PF Applicable</span>
          <button
            type="button"
            onClick={() => setPfApplicable(!pfApplicable)}
            className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${pfApplicable ? "bg-[#00B87C]" : "bg-muted border border-border"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${pfApplicable ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">ESI Applicable</span>
          <button
            type="button"
            onClick={() => setEsiApplicable(!esiApplicable)}
            className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${esiApplicable ? "bg-[#00B87C]" : "bg-muted border border-border"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${esiApplicable ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Display Order
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:shadow-lg transition-all"
        >
          Save Component
        </button>
      </div>
    </div>
  );
}

function SalaryGradeForm({
  item,
  onSave,
  onCancel,
}: {
  item: EditingItem | null;
  onSave: (data: {
    code: string;
    grade: string;
    minSalary: number | string;
    maxSalary: number | string;
    currency: string;
    department: string;
    desc: string;
  }) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(item?.code || "");
  const [grade, setGrade] = useState(item?.grade || "");
  const [minSalary, setMinSalary] = useState<number | string>(item?.minSalary ?? "");
  const [maxSalary, setMaxSalary] = useState<number | string>(item?.maxSalary ?? "");
  const [currency, setCurrency] = useState(item?.currency || "INR");
  const [department, setDepartment] = useState(item?.department || "All");
  const [desc, setDesc] = useState(item?.desc || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!grade.trim()) {
      setError("Grade Name is required.");
      return;
    }
    if (!code.trim()) {
      setError("Band Code is required.");
      return;
    }
    const min = Number(minSalary);
    const max = Number(maxSalary);
    if (isNaN(min) || min < 0) {
      setError("Minimum Salary must be a non-negative number.");
      return;
    }
    if (isNaN(max) || max < 0) {
      setError("Maximum Salary must be a non-negative number.");
      return;
    }
    if (min > max) {
      setError(`Minimum Salary (₹${min.toLocaleString()}) cannot be greater than Maximum Salary (₹${max.toLocaleString()}).`);
      return;
    }
    setError("");
    onSave({
      code: code.trim().toUpperCase(),
      grade,
      minSalary: min,
      maxSalary: max,
      currency,
      department,
      desc,
    });
  };

  return (
    <div className="p-6 space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Band Code *
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none font-mono uppercase"
            placeholder="e.g. GRADE-A"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Grade Name *
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
            placeholder="e.g. Grade A"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Minimum Salary ({currency}) *
          </label>
          <input
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
            placeholder="30000"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Maximum Salary ({currency}) *
          </label>
          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
            placeholder="60000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Department Scope
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Description
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="Short role level description"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:shadow-lg transition-all"
        >
          Save Grade Band
        </button>
      </div>
    </div>
  );
}

function TaxSlabForm({
  item,
  onSave,
  onCancel,
}: {
  item: EditingItem | null;
  onSave: (data: { fromAmt: number; toAmt: number; rate: number }) => void;
  onCancel: () => void;
}) {
  const [fromAmt, setFromAmt] = useState(item?.fromAmt || 0);
  const [toAmt, setToAmt] = useState(item?.toAmt || 0);
  const [rate, setRate] = useState(item?.rate || 0);
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          From Amount (INR)
        </label>
        <input
          type="number"
          value={fromAmt}
          onChange={(e) =>
            setFromAmt(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          To Amount (INR)
        </label>
        <input
          type="number"
          value={toAmt}
          onChange={(e) =>
            setToAmt(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Tax Rate (%)
        </label>
        <input
          type="number"
          value={rate}
          onChange={(e) =>
            setRate(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              fromAmt,
              toAmt,
              rate,
            })
          }
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}
function ProfessionalTaxForm({
  item,
  onSave,
  onCancel,
}: {
  item: EditingItem | null;
  onSave: (data: {
    state: string;
    minSalary: number;
    maxSalary: number;
    amount: number;
  }) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState(item?.state || "");
  const [minSalary, setMinSalary] = useState(item?.minSalary || 0);
  const [maxSalary, setMaxSalary] = useState(item?.maxSalary || 0);
  const [amount, setAmount] = useState(item?.amount || 0);
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          State
        </label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. Maharashtra"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Min Salary Range (INR)
        </label>
        <input
          type="number"
          value={minSalary}
          onChange={(e) =>
            setMinSalary(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Max Salary Range (INR)
        </label>
        <input
          type="number"
          value={maxSalary}
          onChange={(e) =>
            setMaxSalary(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          PT Amount (INR)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value === "" || isNaN(parseInt(e.target.value))
                ? undefined
                : parseInt(e.target.value),
            )
          }
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              state,
              minSalary,
              maxSalary,
              amount,
            })
          }
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}
function MonthScheduleForm({
  item,
  onSave,
  onCancel,
}: {
  item: EditingItem | null;
  onSave: (data: {
    month: string;
    processingDate: string;
    transferDate: string;
  }) => void;
  onCancel: () => void;
}) {
  const [month, setMonth] = useState(item?.month || "");
  const [processingDate, setProcessingDate] = useState(
    item?.processingDate || "",
  );
  const [transferDate, setTransferDate] = useState(item?.transferDate || "");
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Month
        </label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. August 2026"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Processing Date
        </label>
        <input
          type="date"
          value={processingDate}
          onChange={(e) => setProcessingDate(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Bank Transfer Date
        </label>
        <input
          type="date"
          value={transferDate}
          onChange={(e) => setTransferDate(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              month,
              processingDate,
              transferDate,
            })
          }
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}
function ConnectBankForm({
  onSave,
  onCancel,
}: {
  onSave: (data: {
    bank: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  }) => void;
  onCancel: () => void;
}) {
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branch, setBranch] = useState("");
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Bank Name
        </label>
        <input
          type="text"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. Axis Bank"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Account Number
        </label>
        <input
          type="text"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="Account Number"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          IFSC Code
        </label>
        <input
          type="text"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="IFSC Code"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Branch
        </label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="Branch location"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              bank,
              accountNo,
              ifsc,
              branch,
            })
          }
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

/* ─── CALCULATOR SUBCOMPONENT ────────────────────────── */

function GratuityCalculator({
  eligibilityYears,
}: {
  eligibilityYears: number;
}) {
  const [basic, setBasic] = useState("35000");
  const [tenure, setTenure] = useState("6");
  const [result, setResult] = useState<number | null>(null);
  const calculate = () => {
    const years = parseFloat(tenure);
    const sal = parseFloat(basic);
    if (years < eligibilityYears) {
      setResult(0);
      return;
    }
    const val = (15 * sal * years) / 26;
    setResult(Math.round(val));
  };
  return (
    <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="text-[#00C781]" size={18} />
        <h3 className="font-bold text-sm text-foreground">
          Gratuity Calculator Preview
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Test the gratuity projection for a sample profile below.
      </p>

      <div className="space-y-3 pt-2">
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase">
            Monthly Basic Salary (INR)
          </label>
          <input
            type="number"
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs text-foreground"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase">
            Years of Service
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs text-foreground"
          />
        </div>
        <button
          onClick={calculate}
          className="w-full py-2 bg-[#00B87C] hover:bg-emerald-500 rounded-xl text-xs font-bold uppercase text-white transition-colors"
        >
          Project Gratuity
        </button>

        {result !== null && (
          <div className="mt-4 p-4 rounded-xl bg-input-background border border-border text-center">
            {result === 0 ? (
              <p className="text-xs text-red-400 font-bold">
                Ineligible (Minimum {eligibilityYears} years required)
              </p>
            ) : (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Gratuity Entitlement
                </p>
                <p className="text-lg font-bold text-[#00C781] mt-1">
                  ₹{result.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── PAYSLIP TEMPLATE SUBCOMPONENT ────────────────────────── */

function PayslipConfigurator({
  template,
  onChange,
  onToast,
}: {
  template: any;
  onChange: (data: any) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const { user } = useAuth();
  const orgId = user?.organizationId || "";
  const [subTab, setSubTab] = useState<"source" | "design" | "preview" | "email">("source");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const visibleSections = template.visibleSections || {
    employeeInfo: true,
    earnings: true,
    deductions: true,
    employerContrib: true,
    netPay: true,
    paymentInfo: true,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Uploaded template file size exceeds 5MB limit.");
      onToast("Uploaded template file size exceeds 5MB limit", "error");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "png", "jpg", "jpeg", "docx", "html"].includes(ext || "")) {
      setUploadError("Invalid file format. Supported formats: PDF, PNG, JPG, DOCX, HTML.");
      onToast("Invalid template file format", "error");
      return;
    }

    // Read asset preview URL
    const reader = new FileReader();
    reader.onload = () => {
      const assetUrl = reader.result as string;
      const updated = {
        ...template,
        templateSource: "COMPANY_UPLOADED",
        uploadedTemplateFileName: file.name,
        uploadedTemplateFileType: ext as any,
        uploadedTemplateAssetUrl: assetUrl,
        uploadedTemplateStatus: "FRONTEND READY — BACKEND FILE STORAGE REQUIRED",
      };
      onChange(updated);
      onToast(`Uploaded company payslip template "${file.name}" (Frontend ready)`);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSection = (key: string) => {
    const updated = {
      ...template,
      visibleSections: {
        ...visibleSections,
        [key]: !visibleSections[key],
      },
    };
    onChange(updated);
  };

  const handleSave = () => {
    payrollSettingsService.updatePayslipTemplate(template, orgId, user?.name || "Admin");
    onToast("Payslip template configuration saved successfully to tenant store");
  };

  const handleReset = () => {
    const defaultSettings = payrollSettingsService.getSettings(orgId);
    const defaultPayslip = defaultSettings.payslipTemplate;
    onChange(defaultPayslip);
    payrollSettingsService.updatePayslipTemplate(defaultPayslip, orgId, user?.name || "Admin");
    setShowResetConfirm(false);
    onToast("Payslip template reset to EMS default configuration");
  };

  return (
    <div className="space-y-4">
      {/* Sub Header tabs */}
      <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
          <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
            Payslip Configuration & Template Editor
          </h2>
        </div>
        <div className="flex gap-1.5 p-1 bg-input-background border border-border rounded-xl flex-wrap">
          <button
            onClick={() => setSubTab("source")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "source" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Template Source
          </button>
          <button
            onClick={() => setSubTab("design")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "design" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Customization & Sections
          </button>
          <button
            onClick={() => setSubTab("preview")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "preview" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setSubTab("email")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "email" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Email Dispatch
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* SUBTAB 1: TEMPLATE SOURCE */}
        {subTab === "source" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-1">
                Select Payslip Template Engine
              </h3>
              <p className="text-xs text-muted-foreground">
                Choose between standard EMS built-in template or upload your organization's custom branded payslip template.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: EMS Default */}
              <div
                onClick={() => onChange({ ...template, templateSource: "EMS_DEFAULT" })}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${template.templateSource !== "COMPANY_UPLOADED" ? "border-[#00B87C] bg-[#00B87C]/5 shadow-md" : "border-border bg-card hover:border-[#00C781]/40"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${template.templateSource !== "COMPANY_UPLOADED" ? "border-[#00B87C] bg-[#00B87C]" : "border-border"}`}>
                      {template.templateSource !== "COMPANY_UPLOADED" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      EMS Built-in Dynamic Template
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-[#00C781] border border-emerald-500/20">
                    System Standard
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clean, responsive, glassmorphic payslip template with customizable colors, header titles, disclaimer footers, and toggleable statutory section matrices.
                </p>
              </div>

              {/* Option 2: Company Uploaded */}
              <div
                onClick={() => onChange({ ...template, templateSource: "COMPANY_UPLOADED" })}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${template.templateSource === "COMPANY_UPLOADED" ? "border-[#00B87C] bg-[#00B87C]/5 shadow-md" : "border-border bg-card hover:border-[#00C781]/40"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${template.templateSource === "COMPANY_UPLOADED" ? "border-[#00B87C] bg-[#00B87C]" : "border-border"}`}>
                      {template.templateSource === "COMPANY_UPLOADED" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      Company Uploaded Template
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Custom Branded
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload an existing corporate payslip template (PDF, PNG, DOCX, HTML). Preserves exact corporate typography and legal layout.
                </p>
              </div>
            </div>

            {/* Upload Area for Company Uploaded */}
            {template.templateSource === "COMPANY_UPLOADED" && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Upload Organization Payslip Template
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    FRONTEND READY — BACKEND FILE STORAGE REQUIRED
                  </span>
                </div>

                <div className="relative border-2 border-dashed border-border hover:border-[#00C781]/50 rounded-2xl p-8 text-center transition-all bg-card flex flex-col items-center justify-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.html"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C]">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {template.uploadedTemplateFileName
                        ? `Selected: ${template.uploadedTemplateFileName}`
                        : "Click or drag & drop to upload corporate template"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, PNG, JPG, DOCX, HTML (Max 5MB file size limit)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                    <AlertCircle size={14} /> {uploadError}
                  </p>
                )}

                {template.uploadedTemplateFileName && (
                  <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-[#00C781]" />
                      <div>
                        <p className="font-bold text-foreground">{template.uploadedTemplateFileName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Format: {template.uploadedTemplateFileType?.toUpperCase()} • {template.uploadedTemplateStatus}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        onChange({
                          ...template,
                          uploadedTemplateFileName: "",
                          uploadedTemplateAssetUrl: "",
                        })
                      }
                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: CUSTOMIZATION & SECTIONS */}
        {subTab === "design" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Custom Payslip Document Title
                </label>
                <input
                  type="text"
                  value={template.customTitle || "PAYSLIP FOR THE MONTH"}
                  onChange={(e) => onChange({ ...template, customTitle: e.target.value })}
                  placeholder="e.g. SALARY PAYSLIP FOR THE MONTH"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Header Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={template.headerColor || "#00B87C"}
                    onChange={(e) => onChange({ ...template, headerColor: e.target.value })}
                    className="w-14 h-11 bg-input-background border border-border rounded-xl p-1 cursor-pointer outline-none"
                  />
                  <input
                    type="text"
                    value={template.headerColor || "#00B87C"}
                    onChange={(e) => onChange({ ...template, headerColor: e.target.value })}
                    className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground uppercase font-mono focus:border-[#00C781] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Organization Header Subtitle / Branch Address
                </label>
                <input
                  type="text"
                  value={template.headerText || "VIYAN HR EMS CORPORATE PAYSLIP"}
                  onChange={(e) => onChange({ ...template, headerText: e.target.value })}
                  placeholder="e.g. 100 Tech Park Road, Bangalore - 560001"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Footer Disclaimer Text
                </label>
                <input
                  type="text"
                  value={template.footerText || ""}
                  onChange={(e) => onChange({ ...template, footerText: e.target.value })}
                  placeholder="e.g. Computer-generated payslip. No physical signature required."
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
                />
              </div>
            </div>

            {/* Confidentiality notes */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Confidentiality & Compliance Note
              </label>
              <input
                type="text"
                value={template.notes || "Confidential - For Internal Use Only"}
                onChange={(e) => onChange({ ...template, notes: e.target.value })}
                placeholder="e.g. Confidential - Strictly for intended recipient"
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
              />
            </div>

            {/* Visible Sections Matrix */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-wider mb-1">
                  Payslip Section Visibility Matrix
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Select which financial and statutory sections are displayed on the employee payslip.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "employeeInfo", label: "Employee Info", desc: "ID, Name, Dept, Designation" },
                  { key: "earnings", label: "Earnings Breakdown", desc: "Basic, HRA, Allowances, Gross" },
                  { key: "deductions", label: "Deductions Matrix", desc: "PF, ESI, PT, TDS deductions" },
                  { key: "employerContrib", label: "Employer Contributions", desc: "Statutory PF & ESI contributions" },
                  { key: "netPay", label: "Net Take-Home Pay", desc: "Final net disbursement total" },
                  { key: "paymentInfo", label: "Bank Settlement Info", desc: "Bank Account & IFSC details" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${visibleSections[item.key] ? "bg-emerald-500/5 border-[#00C781]/40" : "bg-card border-border opacity-70"}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!visibleSections[item.key]}
                      onChange={() => handleToggleSection(item.key)}
                      className="mt-1 w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]/20"
                    />
                    <div>
                      <span className="text-xs font-bold text-foreground block">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: LIVE PREVIEW */}
        {subTab === "preview" && (
          <div className="p-6 bg-card text-card-foreground rounded-2xl space-y-6 max-w-3xl mx-auto shadow-xl border border-border">
            {/* Header banner */}
            <div
              className="p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start text-white transition-all shadow-md"
              style={{ backgroundColor: template.headerColor || "#00B87C" }}
            >
              <div>
                <h4 className="text-xl font-black tracking-tight">{user?.name || "Viyan HR Solutions Pvt Ltd"}</h4>
                <p className="text-xs opacity-90 mt-1 font-medium">
                  {template.headerText || "VIYAN HR EMS CORPORATE PAYSLIP"}
                </p>
              </div>
              <div className="text-left sm:text-right mt-3 sm:mt-0">
                <h5 className="font-black text-xs uppercase opacity-75 tracking-wider">
                  {template.customTitle || "PAYSLIP FOR THE MONTH"}
                </h5>
                <p className="text-lg font-extrabold mt-0.5">JUNE 2026</p>
              </div>
            </div>

            {/* Template Source Indicator */}
            {template.templateSource === "COMPANY_UPLOADED" && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-xs text-blue-400 font-bold">
                <span>Active Template: Company Uploaded ({template.uploadedTemplateFileName || "Custom File"})</span>
                <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded font-black uppercase">
                  {template.uploadedTemplateFileType || "PDF"}
                </span>
              </div>
            )}

            {/* Employee info */}
            {visibleSections.employeeInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-b border-border pb-4 bg-muted/30 p-4 rounded-xl">
                <div>
                  <p className="text-muted-foreground font-semibold text-[10px] uppercase">Employee ID</p>
                  <p className="text-foreground font-bold">NEX-9041</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold text-[10px] uppercase">Employee Name</p>
                  <p className="text-foreground font-bold">John Doe</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold text-[10px] uppercase">Department</p>
                  <p className="text-foreground font-bold">Engineering</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold text-[10px] uppercase">Designation</p>
                  <p className="text-foreground font-bold">Senior Specialist</p>
                </div>
              </div>
            )}

            {/* Calculations matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {visibleSections.earnings && (
                <div className="space-y-2 bg-card p-4 rounded-xl border border-border">
                  <h6 className="font-black text-[11px] border-b border-border pb-2 text-[#00C781] uppercase tracking-wider">
                    Earnings Breakdown
                  </h6>
                  <div className="flex justify-between py-1">
                    <span>Basic Pay</span>
                    <span className="font-bold text-foreground">₹45,000.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-bold text-foreground">₹18,000.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Special Allowance</span>
                    <span className="font-bold text-foreground">₹12,400.00</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-dashed border-border text-xs font-black text-foreground pt-2">
                    <span>Gross Earnings</span>
                    <span>₹75,400.00</span>
                  </div>
                </div>
              )}

              {visibleSections.deductions && (
                <div className="space-y-2 bg-card p-4 rounded-xl border border-border">
                  <h6 className="font-black text-[11px] border-b border-border pb-2 text-rose-500 uppercase tracking-wider">
                    Statutory Deductions
                  </h6>
                  <div className="flex justify-between py-1">
                    <span>Provident Fund (PF)</span>
                    <span className="font-bold text-foreground">₹1,800.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Employee ESI (0.75%)</span>
                    <span className="font-bold text-foreground">₹200.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Income Tax (TDS)</span>
                    <span className="font-bold text-foreground">₹4,500.00</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-dashed border-border text-xs font-black text-rose-500 pt-2">
                    <span>Total Deductions</span>
                    <span>-₹6,500.00</span>
                  </div>
                </div>
              )}
            </div>

            {/* Employer Contributions */}
            {visibleSections.employerContrib && (
              <div className="p-4 bg-muted/40 rounded-xl border border-border text-xs">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                  Employer Statutory Contributions (Not Deducted From Salary)
                </span>
                <div className="flex justify-between text-muted-foreground font-semibold">
                  <span>Employer PF Contribution (12%): ₹1,800.00</span>
                  <span>Employer ESI Contribution (3.25%): ₹2,450.00</span>
                </div>
              </div>
            )}

            {/* Totals banner */}
            {visibleSections.netPay && (
              <div className="p-5 bg-[#00B87C]/10 border border-[#00B87C]/20 rounded-xl flex justify-between items-center text-xs font-black">
                <span className="text-foreground">TOTAL NET DISBURSEMENT</span>
                <span className="text-[#00C781] text-lg font-black tracking-tight">
                  ₹68,900.00
                </span>
              </div>
            )}

            {/* Bank details */}
            {visibleSections.paymentInfo && (
              <div className="p-3 bg-card border border-border rounded-xl text-xs flex justify-between items-center">
                <span className="text-muted-foreground">Settlement Bank: HDFC Corporate Bank (A/C: ****5544)</span>
                <span className="text-[10px] font-black uppercase text-[#00C781]">NEFT Direct Credit</span>
              </div>
            )}

            {/* Footer */}
            <div className="text-[10px] text-muted-foreground text-center space-y-1 pt-4 border-t border-border">
              <p className="font-bold italic">{template.footerText || "This is a computer-generated payslip and does not require a physical signature."}</p>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{template.notes}</p>
            </div>
          </div>
        )}

        {/* SUBTAB 4: EMAIL SETTINGS */}
        {subTab === "email" && (
          <div className="space-y-5 max-w-xl mx-auto">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-1">
                Payslip Dispatch Email Template
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure subject lines and email body template when payslips are automatically dispatched to employees.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Default Email Subject
              </label>
              <input
                type="text"
                value={template.emailSubject || ""}
                onChange={(e) => onChange({ ...template, emailSubject: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Email Body Template
              </label>
              <textarea
                value={template.emailBody || ""}
                rows={6}
                onChange={(e) => onChange({ ...template, emailBody: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
              />
            </div>
          </div>
        )}

        {/* ACTIONS FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border mt-8">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto px-5 py-2.5 border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 rounded-xl transition-all"
          >
            Reset to EMS Default
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write(
                    "<html><head><title>Payslip Document Preview</title></head><body style='font-family:sans-serif;padding:40px;'><h1>VIYAN HR EMS PAYSLIP</h1><p>Sample Payslip PDF structure ready for generation.</p></body></html>"
                  );
                  printWindow.document.close();
                }
                onToast("Payslip PDF document downloaded");
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 border border-border text-xs font-bold uppercase tracking-wider text-foreground hover:bg-white/5 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Download size={14} /> Download Sample PDF
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertCircle size={24} />
              <h3 className="font-black text-base uppercase tracking-wider">Confirm Reset Payslip Template</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to reset the payslip template to system defaults? Custom uploaded templates, headers, accent colors, and custom section configurations will be reverted.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-rose-600 transition-all"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Salary Structures Section (Table & Badges)                       */
/* ─────────────────────────────────────────────────────────────── */
interface SalaryStructuresSectionProps {
  onConfigure: (employee: Employee) => void;
}
export function SalaryStructuresSection({
  onConfigure,
}: SalaryStructuresSectionProps) {
  const { employeesList } = useEmployees();
  const [structures,] = useState<SalaryStructure[]>(() =>
    payrollService.getSalaryStructures(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeEmployees = useMemo(() => {
    return employeesList.filter((emp: Employee) => emp.status === "Active");
  }, [employeesList]);
  const filteredEmployees = useMemo(() => {
    return activeEmployees.filter((emp: Employee) => {
      const matchQuery =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [activeEmployees, searchQuery]);
  return (
    <section className="bg-card border border-border rounded-[20px] overflow-hidden shadow-lg space-y-4">
      <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
          <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
            Employee Salary Structures
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder-gray-500 focus:border-[#00C781] outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-border rounded-xl bg-input-background">
          <table className="w-full text-left">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Employee
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Annual CTC
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Monthly Gross
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  PF
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  ESI
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  PT State
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((emp: Employee) => {
                const struct = structures.find((s) => s.employeeId === emp.id);
                const isConfigured = !!struct;
                const monthlyGross = struct
                  ? struct.basic + struct.hra + struct.allowances
                  : 0;
                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/5 transition-all text-xs font-semibold text-foreground h-[56px]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] font-bold text-foreground leading-tight truncate">
                          {emp.name}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate">
                          {emp.designation}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4">
                      {isConfigured ? (
                        <span className="font-bold text-[#00C781]">
                          ₹{struct.ctc.toLocaleString()}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Missing Structure
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {isConfigured ? `₹${monthlyGross.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isConfigured ? (
                        struct.pfApplicable ? (
                          <span className="text-[#00C781] font-bold">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isConfigured ? (
                        struct.esiApplicable ? (
                          <span className="text-[#00C781] font-bold">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {isConfigured ? struct.ptState : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onConfigure(emp)}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ml-auto ${isConfigured ? "border border-border text-muted-foreground hover:text-foreground hover:bg-white/5" : "bg-[#00B87C] text-white hover:opacity-90 shadow-md shadow-[#00B87C]/10"}`}
                      >
                        <Edit2 size={12} />
                        {isConfigured ? "Edit" : "Configure"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground text-xs"
                  >
                    No active employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Salary Structure Configuration & Preview Modal                  */
/* ─────────────────────────────────────────────────────────────── */
interface SalaryStructureFormValues {
  ctc: number;
  gross: number;
  basic: number;
  hra: number;
  pfApplicable: boolean;
  ptState: string;
}
interface SalaryStructureModalProps {
  employee: Employee;
  onClose: () => void;
  onSaveSuccess: () => void;
}
export function SalaryStructureModal({
  employee,
  onClose,
  onSaveSuccess,
}: SalaryStructureModalProps) {
  const { user } = useAuth();
  const PREVIEW_WORKING_DAYS = 22; // preview-only assumption; real run uses actual days for the month.

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SalaryStructureFormValues>({
    defaultValues: {
      ctc: 0,
      gross: 0,
      basic: 0,
      hra: 0,
      pfApplicable: true,
      ptState: "Maharashtra",
    },
  });

  // Prefill when component mounts/changes
  useEffect(() => {
    const structures = payrollService.getSalaryStructures();
    const struct = structures.find((s) => s.employeeId === employee.id);
    if (struct) {
      const grossVal = struct.basic + struct.hra + struct.allowances;
      setValue("ctc", struct.ctc);
      setValue("gross", grossVal);
      setValue("basic", struct.basic);
      setValue("hra", struct.hra);
      setValue("pfApplicable", struct.pfApplicable);
      setValue("ptState", struct.ptState);
    }
  }, [employee, setValue]);

  // Watchers for live preview calculations
  const watchedCtc = watch("ctc") || 0;
  const watchedGross = watch("gross") || 0;
  const watchedBasic = watch("basic") || 0;
  const watchedHra = watch("hra") || 0;
  const watchedPf = watch("pfApplicable");
  const watchedPt = watch("ptState");

  // Custom change handlers for controlled cascades
  const handleCtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(
      0,
      (e.target.value === "" || isNaN(Number(e.target.value))
        ? undefined
        : Number(e.target.value)) || 0,
    );
    setValue("ctc", val);
    const derivedGross = Math.round(val / 12);
    setValue("gross", derivedGross);
    const derivedBasic = Math.round(derivedGross * 0.4);
    setValue("basic", derivedBasic);
    const derivedHra = Math.round(derivedBasic * 0.5);
    setValue("hra", derivedHra);
  };
  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(
      0,
      (e.target.value === "" || isNaN(Number(e.target.value))
        ? undefined
        : Number(e.target.value)) || 0,
    );
    setValue("gross", val);
    const derivedBasic = Math.round(val * 0.4);
    setValue("basic", derivedBasic);
    const derivedHra = Math.round(derivedBasic * 0.5);
    setValue("hra", derivedHra);
  };
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(
      0,
      (e.target.value === "" || isNaN(Number(e.target.value))
        ? undefined
        : Number(e.target.value)) || 0,
    );
    setValue("basic", val);
    const derivedHra = Math.round(val * 0.5);
    setValue("hra", derivedHra);
  };
  const allowances = Math.max(0, watchedGross - watchedBasic - watchedHra);
  const esiApplicable = watchedGross <= 21000;

  // Compute live preview using calculatePayslip pure logic
  const previewPayslip = useMemo(() => {
    const mockStructure: SalaryStructure = {
      employeeId: employee.id,
      employeeName: employee.name,
      designation: employee.designation,
      department: employee.department,
      email: employee.email,
      ctc: Number(watchedCtc) || 0,
      basic: Number(watchedBasic) || 0,
      hra: Number(watchedHra) || 0,
      allowances,
      pfApplicable: !!watchedPf,
      esiApplicable,
      ptState: watchedPt || "Maharashtra",
      bankAccount: "****0000",
    };
    return calculatePayslip(
      mockStructure,
      PREVIEW_WORKING_DAYS,
      0,
      "July 2026",
      { settings: payrollSettingsService.getSettings(user?.organizationId) },
    );
  }, [
    employee,
    watchedCtc,
    watchedGross,
    watchedBasic,
    watchedHra,
    allowances,
    watchedPf,
    esiApplicable,
    watchedPt,
    user,
  ]);
  const onSubmit = (data: SalaryStructureFormValues) => {
    const ctcVal = Number(data.ctc);
    const grossVal = Number(data.gross);
    const basicVal = Number(data.basic);
    const hraVal = Number(data.hra);
    if (ctcVal <= 0) {
      toast.error("Annual CTC must be greater than 0.");
      return;
    }
    if (grossVal < 0 || basicVal < 0 || hraVal < 0 || allowances < 0) {
      toast.error("All salary components must be non-negative.");
      return;
    }
    if (basicVal + hraVal + allowances !== grossVal) {
      toast.error("Basic Pay + HRA + Allowances must equal monthly Gross Pay.");
      return;
    }
    const structureToSave: SalaryStructure = {
      employeeId: employee.id,
      employeeName: employee.name,
      designation: employee.designation,
      department: employee.department,
      email: employee.email,
      ctc: ctcVal,
      basic: basicVal,
      hra: hraVal,
      allowances,
      pfApplicable: !!data.pfApplicable,
      esiApplicable,
      ptState: data.ptState,
      bankAccount: "****1234",
    };
    const res = payrollService.saveSalaryStructure(structureToSave);
    if (res.success) {
      toast.success(
        `Salary structure for ${employee.name} saved successfully!`,
      );
      onSaveSuccess();
      onClose();
    } else {
      toast.error("error" in res ? res.error : "An error occurred");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B17]/80 backdrop-blur-sm p-4 overflow-y-auto">
      <m.div
        initial={{
          scale: 0.95,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.95,
          opacity: 0,
        }}
        className="w-full max-w-4xl bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden text-foreground flex flex-col md:flex-row h-auto max-h-[90vh]"
      >
        {/* LEFT COLUMN: FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-8 space-y-5 overflow-y-auto border-b md:border-b-0 md:border-r border-border"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-black text-base text-foreground uppercase tracking-widest">
                Configure Payroll Structure
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground mt-1">
                {employee.name} · {employee.designation} ({employee.department})
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {/* CTC */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Annual CTC (INR) *
              </label>
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="number"
                  placeholder="e.g. 1200000"
                  {...register("ctc", {
                    required: "Annual CTC is required",
                    min: {
                      value: 1,
                      message: "CTC must be greater than 0",
                    },
                    onChange: handleCtcChange,
                  })}
                  className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:border-[#00C781] outline-none transition-all"
                />
              </div>
              {errors.ctc && (
                <p className="text-xs text-rose-500 font-bold">
                  {errors.ctc.message}
                </p>
              )}
            </div>

            {/* Monthly Gross */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Monthly Gross Pay (INR)
              </label>
              <input
                type="number"
                placeholder="e.g. 100000"
                {...register("gross", {
                  required: "Gross pay is required",
                  min: {
                    value: 0,
                    message: "Gross pay cannot be negative",
                  },
                  onChange: handleGrossChange,
                })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-[#00C781] outline-none transition-all"
              />
            </div>

            {/* Basic & HRA Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Basic Salary (INR)
                </label>
                <input
                  type="number"
                  {...register("basic", {
                    required: "Basic is required",
                    min: {
                      value: 0,
                      message: "Basic cannot be negative",
                    },
                    onChange: handleBasicChange,
                  })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-[#00C781] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  HRA (INR)
                </label>
                <input
                  type="number"
                  {...register("hra", {
                    required: "HRA is required",
                    min: {
                      value: 0,
                      message: "HRA cannot be negative",
                    },
                  })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-[#00C781] outline-none transition-all"
                />
              </div>
            </div>

            {/* Special Allowances (Balancing) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                <span>Special Allowances (INR)</span>
                <span className="text-[9px] font-bold bg-[#00C781]/10 text-[#00C781] px-1.5 rounded">
                  Balancing Figure
                </span>
              </label>
              <input
                type="number"
                value={allowances}
                readOnly
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground cursor-not-allowed outline-none"
              />
            </div>

            {/* PT State & Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Professional Tax State
                </label>
                <select
                  {...register("ptState")}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-[#00C781] outline-none transition-all"
                >
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Others</option>
                </select>
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    {...register("pfApplicable")}
                    className="w-4.5 h-4.5 rounded border-border text-[#00B87C] focus:ring-[#00B87C]/20 bg-input-background"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground">
                      PF Applicable
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      12% of basic (capped at ₹15,000 ceiling)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ESI Read-only indicator */}
            <div className="flex gap-4 p-4 rounded-2xl bg-muted border border-border items-start">
              <Info size={20} className="text-[#00C781] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    ESI Contribution:
                  </span>
                  <span
                    className={`text-xs font-black uppercase ${esiApplicable ? "text-[#00C781]" : "text-muted-foreground"}`}
                  >
                    {esiApplicable ? "Applicable" : "Not Applicable"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  {esiApplicable
                    ? "Auto-computed: gross salary is ≤ ₹21,000. Employee contribution (0.75% of gross) will be deducted."
                    : "Auto-computed: gross salary is > ₹21,000 limit. Employee is excluded from statutory ESI."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border text-foreground font-black text-[11px] uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#00B87C] text-white font-black text-[11px] uppercase tracking-widest hover:opacity-90 rounded-xl transition-all shadow-lg active:scale-95 shadow-[#00B87C]/20"
            >
              Save Structure
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="flex-1 p-8 bg-muted/30 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-6">
              <h4 className="font-black text-xs text-foreground uppercase tracking-widest flex items-center gap-2">
                <Calculator size={16} className="text-[#00C781]" />
                Live Paycheck Preview
              </h4>
              <span className="text-[10px] font-bold text-muted-foreground bg-white/5 border border-border px-2 py-0.5 rounded-full uppercase">
                {PREVIEW_WORKING_DAYS} Days Cycle
              </span>
            </div>

            {previewPayslip ? (
              <div className="space-y-6">
                {/* Structure details banner */}
                <div className="grid grid-cols-2 gap-4 bg-card/60 p-4 rounded-2xl border border-border/40 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                      Basic Salary (Prorated)
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₹{previewPayslip.earnings.basic.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                      HRA (Prorated)
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₹{previewPayslip.earnings.hra.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                      Allowances (Prorated)
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₹{previewPayslip.earnings.allowances.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                      Monthly Gross Pay
                    </span>
                    <span className="text-sm font-black text-[#00C781]">
                      ₹{previewPayslip.earnings.gross.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Deductions matrix */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-1 mb-3">
                    Calculated Monthly Deductions
                  </h5>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Provident Fund (PF)
                    </span>
                    <span className="text-foreground">
                      {previewPayslip.deductions.pf > 0
                        ? `₹${previewPayslip.deductions.pf.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Employee ESI (0.75%)
                    </span>
                    <span className="text-foreground">
                      {previewPayslip.deductions.esi > 0
                        ? `₹${previewPayslip.deductions.esi.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Professional Tax (PT)
                    </span>
                    <span className="text-foreground">
                      {previewPayslip.deductions.pt > 0
                        ? `₹${previewPayslip.deductions.pt.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Income Tax (TDS Estimate)
                    </span>
                    <span className="text-foreground">
                      {previewPayslip.deductions.tds > 0
                        ? `₹${previewPayslip.deductions.tds.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-dashed border-border">
                    <span className="text-rose-500">Total Deductions</span>
                    <span className="text-rose-500">
                      -₹{previewPayslip.deductions.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-xs">
                Enter valid inputs to generate a payroll paycheck preview.
              </div>
            )}
          </div>

          {/* NET DISBURSEMENT CARD */}
          {previewPayslip && (
            <div className="bg-[#00B87C]/5 border border-[#00B87C]/20 rounded-2xl p-5 mt-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-[#00B87C] uppercase tracking-widest block">
                  Estimated Take-Home Net Pay
                </span>
                <span className="text-2xl font-black text-[#00B87C] tracking-tighter">
                  ₹{previewPayslip.netPay.toLocaleString()}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C]">
                <IndianRupee size={20} />
              </div>
            </div>
          )}
        </div>
      </m.div>
    </div>
  );
}
