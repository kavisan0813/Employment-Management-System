import { useState } from "react";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type NavItem = {
  id: string;
  label: string;
  section: "PAYROLL" | "STATUTORY" | "PROCESSING";
};

const NAV_ITEMS: NavItem[] = [
  { id: "pay-cycle", label: "Pay Cycle", section: "PAYROLL" },
  { id: "salary-components", label: "Salary Components", section: "PAYROLL" },
  { id: "bands-grades", label: "Salary Bands & Grades", section: "PAYROLL" },
  { id: "pf", label: "Provident Fund (PF)", section: "STATUTORY" },
  { id: "tds", label: "Tax (TDS) Settings", section: "STATUTORY" },
  { id: "prof-tax", label: "Professional Tax", section: "STATUTORY" },
  { id: "esi", label: "ESI Settings", section: "STATUTORY" },
  { id: "gratuity", label: "Gratuity", section: "STATUTORY" },
  { id: "calendar", label: "Payroll Calendar", section: "PROCESSING" },
  { id: "bank", label: "Bank Integration", section: "PROCESSING" },
  { id: "payslip", label: "Payslip Template", section: "PROCESSING" },
];

export interface SalaryComponent {
  id: string;
  name: string;
  type: string;
  taxable: boolean;
  formula: string;
  order: number;
  isSystem: boolean;
  status: string;
}

export interface SalaryGrade {
  id: string;
  grade: string;
  minSalary: number;
  maxSalary: number;
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
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
  status: string;
  lastSync?: string;
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
  name?: string;
  type?: string;
  taxable?: boolean;
  formula?: string;
  order?: number;
  isSystem?: boolean;
  status?: string;
  grade?: string;
  minSalary?: number;
  maxSalary?: number;
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
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  branch?: string;
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

  // Custom Toast System (for bulletproof toast delivery)
  const [localToasts, setLocalToasts] = useState<
    { id: string; message: string; type: "success" | "error" | "info" }[]
  >([]);
  const showLocalToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Date.now().toString();
    setLocalToasts((prev) => [...prev, { id, message, type }]);
    toast[type](message); // Call sonner toast too
    setTimeout(() => {
      setLocalToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Determine Role Permissions
  const isFinance = user?.role === "Finance";

  // Global Mock States
  const [payCycle, setPayCycle] = useState({
    frequency: "Monthly",
    basis: "Calendar Days",
    processingDate: "25",
    payoutDate: "30",
    lockAfterProcessing: true,
  });

  const [salaryComponents, setSalaryComponents] = useState([
    {
      id: "1",
      name: "Basic Pay",
      type: "Earnings",
      taxable: true,
      formula: "50% of CTC",
      order: 1,
      isSystem: true,
      status: "Enabled",
    },
    {
      id: "2",
      name: "HRA",
      type: "Earnings",
      taxable: true,
      formula: "40% of Basic",
      order: 2,
      isSystem: true,
      status: "Enabled",
    },
    {
      id: "3",
      name: "Special Allowance",
      type: "Earnings",
      taxable: true,
      formula: "Balance of CTC",
      order: 3,
      isSystem: false,
      status: "Enabled",
    },
    {
      id: "4",
      name: "Performance Bonus",
      type: "Earnings",
      taxable: true,
      formula: "% of Basic",
      order: 4,
      isSystem: false,
      status: "Enabled",
    },
    {
      id: "5",
      name: "Conveyance",
      type: "Earnings",
      taxable: false,
      formula: "₹1,600/month",
      order: 5,
      isSystem: false,
      status: "Enabled",
    },
    {
      id: "6",
      name: "Medical Allowance",
      type: "Earnings",
      taxable: false,
      formula: "₹1,250/month",
      order: 6,
      isSystem: false,
      status: "Enabled",
    },
    {
      id: "7",
      name: "PF Employer Contribution",
      type: "Deductions",
      taxable: false,
      formula: "12% of Basic",
      order: 7,
      isSystem: true,
      status: "Enabled",
    },
  ]);

  const [salaryBands, setSalaryBands] = useState([
    {
      id: "1",
      grade: "Grade A",
      minSalary: 30000,
      maxSalary: 60000,
      employees: 24,
      desc: "Junior Associate / Analyst",
    },
    {
      id: "2",
      grade: "Grade B",
      minSalary: 60000,
      maxSalary: 120000,
      employees: 42,
      desc: "Senior Specialist / Consultant",
    },
    {
      id: "3",
      grade: "Grade C",
      minSalary: 120000,
      maxSalary: 250000,
      employees: 15,
      desc: "Lead Developer / Manager",
    },
    {
      id: "4",
      grade: "Grade D",
      minSalary: 250000,
      maxSalary: 500000,
      employees: 5,
      desc: "Director / Vice President",
    },
  ]);

  const [pfConfig, setPfConfig] = useState({
    employerContrib: "12",
    employeeContrib: "12",
    wageCeiling: "15000",
    epsApplicable: true,
  });

  const [tdsSlabs, setTdsSlabs] = useState({
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
  });

  const [professionalTax, setProfessionalTax] = useState([
    { id: "1", state: "Maharashtra", minSalary: 0, maxSalary: 7500, amount: 0 },
    {
      id: "2",
      state: "Maharashtra",
      minSalary: 7501,
      maxSalary: 10000,
      amount: 175,
    },
    {
      id: "3",
      state: "Maharashtra",
      minSalary: 10001,
      maxSalary: 99999999,
      amount: 200,
    },
    { id: "4", state: "Karnataka", minSalary: 0, maxSalary: 25000, amount: 0 },
    {
      id: "5",
      state: "Karnataka",
      minSalary: 25001,
      maxSalary: 99999999,
      amount: 200,
    },
  ]);

  const [esiConfig, setEsiConfig] = useState({
    employeeContrib: "0.75",
    employerContrib: "3.25",
    salaryLimit: "21000",
    enabled: true,
  });

  const [gratuityConfig, setGratuityConfig] = useState({
    eligibilityYears: "5",
    formula: "(15 * Basic * Service Years) / 26",
    enabled: true,
  });

  const [payrollCalendar, setPayrollCalendar] = useState([
    {
      id: "1",
      month: "January 2026",
      processingDate: "2026-01-25",
      transferDate: "2026-01-30",
      status: "Processed",
    },
    {
      id: "2",
      month: "February 2026",
      processingDate: "2026-02-24",
      transferDate: "2026-02-27",
      status: "Processed",
    },
    {
      id: "3",
      month: "March 2026",
      processingDate: "2026-03-25",
      transferDate: "2026-03-31",
      status: "Processed",
    },
    {
      id: "4",
      month: "April 2026",
      processingDate: "2026-04-24",
      transferDate: "2026-04-30",
      status: "Processed",
    },
    {
      id: "5",
      month: "May 2026",
      processingDate: "2026-05-25",
      transferDate: "2026-05-29",
      status: "Processed",
    },
    {
      id: "6",
      month: "June 2026",
      processingDate: "2026-06-25",
      transferDate: "2026-06-30",
      status: "Scheduled",
    },
    {
      id: "7",
      month: "July 2026",
      processingDate: "2026-07-24",
      transferDate: "2026-07-31",
      status: "Pending",
    },
  ]);

  const [banks, setBanks] = useState([
    {
      id: "1",
      bank: "HDFC Bank",
      accountNo: "50200012345678",
      ifsc: "HDFC0000123",
      branch: "Mumbai Main",
      status: "Connected",
      lastSync: "2026-06-11 10:30 AM",
    },
    {
      id: "2",
      bank: "ICICI Bank",
      accountNo: "000401512345",
      ifsc: "ICIC0000004",
      branch: "Bangalore MG Road",
      status: "Connected",
      lastSync: "2026-06-11 11:15 AM",
    },
    {
      id: "3",
      bank: "State Bank of India",
      accountNo: "31234567890",
      ifsc: "SBIN0000843",
      branch: "Delhi Connaught",
      status: "Disconnected",
      lastSync: "N/A",
    },
    {
      id: "4",
      bank: "Axis Bank",
      accountNo: "91201001234567",
      ifsc: "UTIB0000010",
      branch: "Pune Deccan",
      status: "Disconnected",
      lastSync: "N/A",
    },
  ]);

  const [payslipTemplate, setPayslipTemplate] = useState({
    logoUrl: "",
    headerColor: "#052E28",
    footerText:
      "This is a computer-generated document and does not require a signature.",
    signatureUrl: "",
    emailSubject: "Payslip for [Month] [Year]",
    emailBody:
      "Dear [Employee Name],\n\nPlease find attached your payslip for the month of [Month] [Year].\n\nBest Regards,\nHR & Finance Team",
  });

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
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
                            setPayCycle({ ...payCycle, basis: e.target.value })
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
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                            payCycle.lockAfterProcessing
                              ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]"
                              : "bg-muted border border-border"
                          }`}
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
                          setPayCycle({
                            frequency: "Monthly",
                            basis: "Calendar Days",
                            processingDate: "25",
                            payoutDate: "30",
                            lockAfterProcessing: true,
                          });
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
                        onClick={() =>
                          showLocalToast("Payroll cycle updated successfully")
                        }
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
                              const fieldA =
                                (a as Record<string, unknown>)[
                                  sortField
                                ]?.toString() || "";
                              const fieldB =
                                (b as Record<string, unknown>)[
                                  sortField
                                ]?.toString() || "";
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
                                    className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                                      comp.type === "Earnings"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-[#00C781]"
                                        : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                    }`}
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
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      comp.status === "Enabled"
                                        ? "bg-emerald-500/10 text-[#00C781]"
                                        : "bg-red-500/10 text-red-400"
                                    }`}
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
                                      disabled={comp.isSystem && isFinance}
                                      onClick={() => {
                                        if (comp.isSystem && isFinance) {
                                          showLocalToast(
                                            "Permission denied: System configurations cannot be deleted by Finance",
                                            "error",
                                          );
                                          return;
                                        }
                                        setSalaryComponents((prev) =>
                                          prev.filter((c) => c.id !== comp.id),
                                        );
                                        showLocalToast(
                                          "Component deleted successfully",
                                        );
                                      }}
                                      className={`p-1 transition-colors ${comp.isSystem && isFinance ? "text-white/10 cursor-not-allowed" : "hover:text-red-400 text-muted-foreground"}`}
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
                                      disabled={isFinance}
                                      onClick={() => {
                                        if (isFinance) {
                                          showLocalToast(
                                            "Permission denied: Delete action requires Super Admin credentials",
                                            "error",
                                          );
                                          return;
                                        }
                                        setSalaryBands((prev) =>
                                          prev.filter((b) => b.id !== band.id),
                                        );
                                        showLocalToast(
                                          "Grade deleted successfully",
                                        );
                                      }}
                                      className={`p-1 transition-colors ${isFinance ? "text-white/10 cursor-not-allowed" : "hover:text-red-400 text-muted-foreground"}`}
                                      title={
                                        isFinance
                                          ? "Admin Only action"
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
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                            pfConfig.epsApplicable
                              ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]"
                              : "bg-muted border border-border"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${pfConfig.epsApplicable ? "translate-x-6" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                      <button
                        onClick={() =>
                          showLocalToast(
                            "PF configurations updated successfully",
                          )
                        }
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
                          setEditingItem({ regime: "oldRegime" });
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
                            {tdsSlabs.oldRegime.map((slab) => (
                              <tr
                                key={slab.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-4 py-3 text-xs text-foreground font-medium">
                                  ₹{slab.fromAmt.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-xs text-foreground font-medium">
                                  {slab.toAmt > 90000000
                                    ? "Above"
                                    : `₹${slab.toAmt.toLocaleString()}`}
                                </td>
                                <td className="px-4 py-3 text-xs font-bold text-[#00C781] text-center">
                                  {slab.rate}%
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingItem({
                                          ...slab,
                                          regime: "oldRegime",
                                        });
                                        setActiveModal("add-slab");
                                      }}
                                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTdsSlabs({
                                          ...tdsSlabs,
                                          oldRegime: tdsSlabs.oldRegime.filter(
                                            (s) => s.id !== slab.id,
                                          ),
                                        });
                                        showLocalToast("Slab deleted");
                                      }}
                                      className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={12} />
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
                          setEditingItem({ regime: "newRegime" });
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
                            {tdsSlabs.newRegime.map((slab) => (
                              <tr
                                key={slab.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-4 py-3 text-xs text-foreground font-medium">
                                  ₹{slab.fromAmt.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-xs text-foreground font-medium">
                                  {slab.toAmt > 90000000
                                    ? "Above"
                                    : `₹${slab.toAmt.toLocaleString()}`}
                                </td>
                                <td className="px-4 py-3 text-xs font-bold text-[#00C781] text-center">
                                  {slab.rate}%
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingItem({
                                          ...slab,
                                          regime: "newRegime",
                                        });
                                        setActiveModal("add-slab");
                                      }}
                                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTdsSlabs({
                                          ...tdsSlabs,
                                          newRegime: tdsSlabs.newRegime.filter(
                                            (s) => s.id !== slab.id,
                                          ),
                                        });
                                        showLocalToast("Slab deleted");
                                      }}
                                      className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={12} />
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
                          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                            esiConfig.enabled
                              ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]"
                              : "bg-muted border border-border"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${esiConfig.enabled ? "translate-x-6" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                      <button
                        onClick={() =>
                          showLocalToast("ESI settings updated successfully")
                        }
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
                            className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                              gratuityConfig.enabled
                                ? "bg-[#00B87C] shadow-[0_0_12px_rgba(0,184,124,0.3)]"
                                : "bg-muted border border-border"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${gratuityConfig.enabled ? "translate-x-6" : "translate-x-0"}`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-border">
                        <button
                          onClick={() =>
                            showLocalToast(
                              "Gratuity settings saved successfully",
                            )
                          }
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
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                    cal.status === "Processed"
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-[#00C781]"
                                      : cal.status === "Scheduled"
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                  }`}
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
                  <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
                      <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
                        Connected Settlement Banks
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setActiveModal("connect-bank");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
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
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    b.status === "Connected"
                                      ? "bg-emerald-500/10 text-[#00C781]"
                                      : "bg-white/5 text-muted-foreground"
                                  }`}
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── MODALS ────────────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B17]/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
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
                    if (editingItem) {
                      setSalaryComponents((prev) =>
                        prev.map((c) =>
                          c.id === editingItem.id ? { ...c, ...data } : c,
                        ),
                      );
                      showLocalToast("Component updated successfully");
                    } else {
                      setSalaryComponents((prev) => [
                        ...prev,
                        {
                          ...data,
                          id: Date.now().toString(),
                          status: "Enabled",
                          isSystem: false,
                        },
                      ]);
                      showLocalToast("Component added successfully");
                    }
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-grade" && (
                <SalaryGradeForm
                  item={editingItem}
                  onSave={(data) => {
                    const formattedData = {
                      ...data,
                      minSalary: Number(data.minSalary) || 0,
                      maxSalary: Number(data.maxSalary) || 0,
                    };
                    if (editingItem) {
                      setSalaryBands((prev) =>
                        prev.map((g) =>
                          g.id === editingItem.id
                            ? { ...g, ...formattedData }
                            : g,
                        ),
                      );
                      showLocalToast("Grade updated successfully");
                    } else {
                      setSalaryBands((prev) => [
                        ...prev,
                        {
                          ...formattedData,
                          id: Date.now().toString(),
                          employees: 0,
                        },
                      ]);
                      showLocalToast("Grade created successfully");
                    }
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-slab" && (
                <TaxSlabForm
                  item={editingItem}
                  onSave={(data) => {
                    if (editingItem?.id && editingItem?.regime) {
                      const regime = editingItem.regime as
                        | "oldRegime"
                        | "newRegime";
                      setTdsSlabs((prev) => ({
                        ...prev,
                        [regime]: prev[regime].map((s) =>
                          s.id === editingItem.id ? { ...s, ...data } : s,
                        ),
                      }));
                    } else if (editingItem?.regime) {
                      const regime = editingItem.regime as
                        | "oldRegime"
                        | "newRegime";
                      setTdsSlabs((prev) => ({
                        ...prev,
                        [regime]: [
                          ...prev[regime],
                          { ...data, id: Date.now().toString() },
                        ],
                      }));
                    }
                    showLocalToast("Tax slab configured successfully");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-pt" && (
                <ProfessionalTaxForm
                  item={editingItem}
                  onSave={(data) => {
                    if (editingItem) {
                      setProfessionalTax((prev) =>
                        prev.map((r) =>
                          r.id === editingItem.id ? { ...r, ...data } : r,
                        ),
                      );
                    } else {
                      setProfessionalTax((prev) => [
                        ...prev,
                        { ...data, id: Date.now().toString() },
                      ]);
                    }
                    showLocalToast("PT state rule configured successfully");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "add-month" && (
                <MonthScheduleForm
                  item={editingItem}
                  onSave={(data) => {
                    if (editingItem) {
                      setPayrollCalendar((prev) =>
                        prev.map((c) =>
                          c.id === editingItem.id ? { ...c, ...data } : c,
                        ),
                      );
                    } else {
                      setPayrollCalendar((prev) => [
                        ...prev,
                        {
                          ...data,
                          id: Date.now().toString(),
                          status: "Scheduled",
                        },
                      ]);
                    }
                    showLocalToast("Payroll calendar configured successfully");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}

              {activeModal === "connect-bank" && (
                <ConnectBankForm
                  onSave={(data) => {
                    setBanks((prev) => [
                      ...prev,
                      {
                        ...data,
                        id: Date.now().toString(),
                        status: "Connected",
                        lastSync: new Date().toLocaleString(),
                      },
                    ]);
                    showLocalToast("Bank connected successfully");
                    setActiveModal(null);
                  }}
                  onCancel={() => setActiveModal(null)}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Local Toast Portal UI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {localToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-5 py-3 rounded-xl shadow-lg border text-sm font-bold text-white min-w-[280px] pointer-events-auto flex items-center justify-between ${
              t.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-300"
                : t.type === "info"
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                  : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
            }`}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── HELPER COMPONENTS ────────────────────────── */

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
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all relative ${
              isActive
                ? "bg-emerald-500/10 text-[#00C781]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
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
    name: string;
    type: string;
    taxable: boolean;
    formula: string;
    order: number;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [type, setType] = useState(item?.type || "Earnings");
  const [taxable, setTaxable] = useState(item?.taxable ?? true);
  const [formula, setFormula] = useState(item?.formula || "");
  const [order, setOrder] = useState(item?.order || 1);

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Component Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. Basic Pay"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        >
          <option>Earnings</option>
          <option>Deductions</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Formula / Fixed Amount
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. 50% of CTC or ₹1,500"
        />
      </div>

      <div className="flex items-center justify-between py-2 border-y border-border">
        <div>
          <p className="text-sm font-bold text-foreground">Taxable Component</p>
          <p className="text-xs text-muted-foreground">
            Include in taxable income calculations
          </p>
        </div>
        <button
          onClick={() => setTaxable(!taxable)}
          className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
            taxable ? "bg-[#00B87C]" : "bg-muted border border-border"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${taxable ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Display Order
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
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
          onClick={() => onSave({ name, type, taxable, formula, order })}
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Save
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
    grade: string;
    minSalary: number | string;
    maxSalary: number | string;
    desc: string;
  }) => void;
  onCancel: () => void;
}) {
  const [grade, setGrade] = useState(item?.grade || "");
  const [minSalary, setMinSalary] = useState(item?.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(item?.maxSalary || "");
  const [desc, setDesc] = useState(item?.desc || "");

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Grade Name
        </label>
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="e.g. Grade A"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Minimum Salary (INR)
        </label>
        <input
          type="number"
          value={minSalary}
          onChange={(e) => setMinSalary(parseInt(e.target.value))}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Maximum Salary (INR)
        </label>
        <input
          type="number"
          value={maxSalary}
          onChange={(e) => setMaxSalary(parseInt(e.target.value))}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Description
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
          placeholder="Short description of the grade role"
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
          onClick={() => onSave({ grade, minSalary, maxSalary, desc })}
          className="px-6 py-2 bg-[#00B87C] rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          Save
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
          onChange={(e) => setFromAmt(parseInt(e.target.value))}
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
          onChange={(e) => setToAmt(parseInt(e.target.value))}
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
          onChange={(e) => setRate(parseInt(e.target.value))}
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
          onClick={() => onSave({ fromAmt, toAmt, rate })}
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
          onChange={(e) => setMinSalary(parseInt(e.target.value))}
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
          onChange={(e) => setMaxSalary(parseInt(e.target.value))}
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
          onChange={(e) => setAmount(parseInt(e.target.value))}
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
          onClick={() => onSave({ state, minSalary, maxSalary, amount })}
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
          onClick={() => onSave({ month, processingDate, transferDate })}
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
          onClick={() => onSave({ bank, accountNo, ifsc, branch })}
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
  template: PayslipTemplateConfig;
  onChange: (data: PayslipTemplateConfig) => void;
  onToast: (msg: string) => void;
}) {
  const [subTab, setSubTab] = useState("design");

  return (
    <div className="space-y-4">
      {/* Sub Header tabs */}
      <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C781] shadow-[0_0_8px_rgba(0,199,129,0.5)]" />
          <h2 className="text-[12px] font-bold text-[#00C781] uppercase tracking-widest">
            Payslip Configuration
          </h2>
        </div>
        <div className="flex gap-1.5 p-1 bg-input-background border border-border rounded-xl">
          <button
            onClick={() => setSubTab("design")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "design" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Template Design
          </button>
          <button
            onClick={() => setSubTab("preview")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "preview" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Preview
          </button>
          <button
            onClick={() => setSubTab("email")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === "email" ? "bg-[#00B87C] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Email Settings
          </button>
        </div>
      </div>

      <div className="p-6">
        {subTab === "design" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Company Logo
                </label>
                <div className="border-2 border-dashed border-border hover:border-[#00C781]/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-xs text-foreground">
                    Click to upload company logo
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Supports PNG, JPG (Max 500KB)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Signature Image
                </label>
                <div className="border-2 border-dashed border-border hover:border-[#00C781]/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-xs text-foreground">
                    Click to upload digital signature
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Supports PNG (transparency requested)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Header Accentuating Color
                </label>
                <input
                  type="color"
                  value={template.headerColor}
                  onChange={(e) =>
                    onChange({ ...template, headerColor: e.target.value })
                  }
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-1.5 h-12 outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Footer text / Disclaimer
                </label>
                <input
                  type="text"
                  value={template.footerText}
                  onChange={(e) =>
                    onChange({ ...template, footerText: e.target.value })
                  }
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-[#00C781] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(
                      "<html><head><title>Payslip Preview</title></head><body><h1>Sample Payslip PDF</h1><p>Generating file structure...</p></body></html>",
                    );
                    printWindow.document.close();
                  }
                  onToast("Payslip PDF document downloaded");
                }}
                className="px-5 py-2.5 border border-border text-xs font-bold uppercase tracking-wider text-foreground hover:bg-white/5 rounded-xl flex items-center gap-2 transition-all"
              >
                <Download size={14} /> Download PDF
              </button>
              <button
                onClick={() =>
                  onToast("Payslip template configuration saved successfully")
                }
                className="px-6 py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
              >
                Save Template
              </button>
            </div>
          </div>
        )}

        {subTab === "preview" && (
          <div className="p-6 bg-white text-slate-800 rounded-xl space-y-6 max-w-2xl mx-auto shadow-md">
            {/* Header banner */}
            <div
              className="p-6 rounded-lg flex justify-between items-start text-white"
              style={{ backgroundColor: template.headerColor }}
            >
              <div>
                <h4 className="text-xl font-bold">NexusHR Solutions Pvt Ltd</h4>
                <p className="text-xs opacity-90 mt-1">
                  100, Tech Park Road, Bangalore - 560001
                </p>
              </div>
              <div className="text-right">
                <h5 className="font-bold text-xs uppercase opacity-75">
                  Pay Slip
                </h5>
                <p className="text-lg font-extrabold mt-1">June 2026</p>
              </div>
            </div>

            {/* Employee info */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <p className="text-slate-500 font-semibold">Employee ID:</p>
                <p className="text-slate-800 font-bold">NEX-9041</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">Employee Name:</p>
                <p className="text-slate-800 font-bold">John Doe</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">Department:</p>
                <p className="text-slate-800 font-bold">Engineering</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">Designation:</p>
                <p className="text-slate-800 font-bold">Senior Specialist</p>
              </div>
            </div>

            {/* Calculations matrix */}
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-2">
                <h6 className="font-bold border-b border-slate-200 pb-1 text-slate-500">
                  Earnings
                </h6>
                <div className="flex justify-between">
                  <span>Basic Pay</span>
                  <span className="font-bold">₹45,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span className="font-bold">₹18,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance</span>
                  <span className="font-bold">₹12,400.00</span>
                </div>
              </div>
              <div className="space-y-2">
                <h6 className="font-bold border-b border-slate-200 pb-1 text-slate-500">
                  Deductions
                </h6>
                <div className="flex justify-between">
                  <span>PF Contribution</span>
                  <span className="font-bold">₹1,800.00</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS</span>
                  <span className="font-bold">₹4,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span className="font-bold">₹200.00</span>
                </div>
              </div>
            </div>

            {/* Totals banner */}
            <div className="p-4 bg-slate-100 rounded-lg flex justify-between items-center text-xs font-bold">
              <span>Gross Earnings: ₹75,400.00</span>
              <span className="text-emerald-700 text-sm">
                Net Pay: ₹68,900.00
              </span>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-slate-400 text-center italic mt-6">
              {template.footerText}
            </p>
          </div>
        )}

        {subTab === "email" && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Default Email Subject
              </label>
              <input
                type="text"
                value={template.emailSubject}
                onChange={(e) =>
                  onChange({ ...template, emailSubject: e.target.value })
                }
                className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Email Body Template
              </label>
              <textarea
                value={template.emailBody}
                rows={5}
                onChange={(e) =>
                  onChange({ ...template, emailBody: e.target.value })
                }
                className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#00C781] outline-none"
              />
            </div>

            <button
              onClick={() =>
                onToast("Payslip Email template saved successfully")
              }
              className="w-full py-2.5 bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
            >
              Save Email Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
