import { useState, useMemo } from "react";
import {
  Receipt,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Plane,
  Utensils,
  Monitor,
  Bed,
  Car,
  BookOpen,
  HeartPulse,
  Phone,
  UploadCloud,
  X,
  FileText,
  Edit3,
  ChevronDown,
  Gauge,
} from "lucide-react";
import { showToast } from "../../../components/workflow/ToastNotification";

type ExpenseStatus = "Approved" | "Pending" | "Rejected" | "Draft";
type ExpenseCategory =
  | "Travel"
  | "Food"
  | "Equipment"
  | "Accommodation"
  | "Transport"
  | "Medical"
  | "Training"
  | "Communication"
  | "Other";

interface Expense {
  id: string;
  title: string;
  vendor: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  receiptStatus: "Attached" | "Missing" | "Pending";
  status: ExpenseStatus;
  description: string;
  project: string;
  paymentMode: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const MOCK_EXPENSES: Expense[] = [
  {
    id: "EXP-0421",
    title: "Flight to Delhi — Client Meeting",
    vendor: "Indigo Airlines · Booking #IND2891",
    category: "Travel",
    date: "Apr 3, 2026",
    amount: 4200,
    receiptStatus: "Attached",
    status: "Approved",
    description:
      "Business trip for client acquisition meeting at Acme Corp HQ.",
    project: "Sales — North Region",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0422",
    title: "Team Lunch — Sprint Retrospective",
    vendor: "ITC Hotel, Chennai · 8 attendees",
    category: "Food",
    date: "Apr 5, 2026",
    amount: 2150,
    receiptStatus: "Attached",
    status: "Pending",
    description: "Quarterly team bonding and retrospective session.",
    project: "viyanHR Internal",
    paymentMode: "Cash",
  },
  {
    id: "EXP-0423",
    title: "USB-C Hub & Keyboard",
    vendor: "Amazon India · Order #AMZ9942",
    category: "Equipment",
    date: "Apr 4, 2026",
    amount: 1400,
    receiptStatus: "Attached",
    status: "Pending",
    description: "Peripherals required for the new development laptop.",
    project: "Operations",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0424",
    title: "Hotel Stay — Bengaluru Conference",
    vendor: "Marriott Bengaluru · 2 nights",
    category: "Accommodation",
    date: "Mar 28, 2026",
    amount: 7800,
    receiptStatus: "Attached",
    status: "Approved",
    description: "Accommodation for the annual developer conference.",
    project: "R&D",
    paymentMode: "Company Card",
  },
  {
    id: "EXP-0425",
    title: "Cab rides — Client visits (Mar)",
    vendor: "Uber · 12 rides",
    category: "Transport",
    date: "Mar 31, 2026",
    amount: 1850,
    receiptStatus: "Missing",
    status: "Rejected",
    description: "Multiple cab rides for client visits throughout March.",
    project: "Client — Acme Corp",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0426",
    title: "Udemy Course — Advanced React",
    vendor: "Draft · Not yet submitted",
    category: "Training",
    date: "—",
    amount: 1999,
    receiptStatus: "Pending",
    status: "Draft",
    description:
      "Professional development course for frontend engineering team.",
    project: "viyanHR Internal",
    paymentMode: "Online Transfer",
  },
  {
    id: "EXP-0427",
    title: "Medical Consultation + Medicines",
    vendor: "Apollo Hospital, Chennai",
    category: "Medical",
    date: "Mar 20, 2026",
    amount: 850,
    receiptStatus: "Attached",
    status: "Approved",
    description: "Annual health checkup reimbursement.",
    project: "Operations",
    paymentMode: "Cash",
  },
  {
    id: "EXP-0428",
    title: "Internet Reimbursement — March",
    vendor: "Jio Fiber · Monthly plan",
    category: "Communication",
    date: "Apr 1, 2026",
    amount: 999,
    receiptStatus: "Attached",
    status: "Pending",
    description: "Monthly WFH internet allowance.",
    project: "Operations",
    paymentMode: "Online Transfer",
  },
];

const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { icon: React.ElementType; bg: string; color: string; chip: string }
> = {
  Travel: {
    icon: Plane,
    bg: "bg-sky-500/10",
    color: "text-sky-500",
    chip: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  Food: {
    icon: Utensils,
    bg: "bg-amber-500/10",
    color: "text-amber-500",
    chip: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  Equipment: {
    icon: Monitor,
    bg: "bg-purple-500/10",
    color: "text-purple-500",
    chip: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  Accommodation: {
    icon: Bed,
    bg: "bg-emerald-500/10",
    color: "text-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  Transport: {
    icon: Car,
    bg: "bg-rose-500/10",
    color: "text-rose-500",
    chip: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  Medical: {
    icon: HeartPulse,
    bg: "bg-rose-500/10",
    color: "text-rose-500",
    chip: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  Training: {
    icon: BookOpen,
    bg: "bg-purple-500/10",
    color: "text-purple-500",
    chip: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  Communication: {
    icon: Phone,
    bg: "bg-sky-500/10",
    color: "text-sky-500",
    chip: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  Other: {
    icon: Receipt,
    bg: "bg-slate-500/10",
    color: "text-slate-500",
    chip: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  },
};

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const getStatusStyle = (s: ExpenseStatus): string => {
    switch (s) {
      case "Approved":
        return "bg-emerald-500/10 text-primary border-primary/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Draft":
        return "bg-secondary text-muted-foreground border-border";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };
  const getStatusIcon = (s: ExpenseStatus): React.ElementType => {
    switch (s) {
      case "Approved":
        return CheckCircle2;
      case "Pending":
        return Clock;
      case "Rejected":
        return X;
      case "Draft":
        return Edit3;
      default:
        return Edit3;
    }
  };
  const Icon = getStatusIcon(status);

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 w-fit uppercase tracking-wider ${getStatusStyle(status)}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function ReceiptBadge({
  status,
}: {
  status: "Attached" | "Missing" | "Pending";
}) {
  if (status === "Attached")
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-primary border border-primary/20 flex items-center gap-1.5 uppercase tracking-wider">
        <FileText size={12} /> Attached
      </span>
    );
  if (status === "Missing")
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5 uppercase tracking-wider">
        <X size={12} /> Missing
      </span>
    );
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 uppercase tracking-wider">
      <UploadCloud size={12} /> Upload
    </span>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
  value: string;
  subValue: string;
  chip?: string;
  chipColor?: "green" | "amber" | "purple" | "sky";
  progress?: number;
}

function SummaryCard({
  icon: Icon,
  color,
  bg,
  label,
  value,
  subValue,
  chip,
  chipColor,
  progress,
}: SummaryCardProps) {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm relative group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}
        >
          <Icon size={20} />
        </div>
        <div className="opacity-10 group-hover:opacity-20 transition-opacity">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path
              d="M0 15C5 12 10 18 15 10C20 2 25 15 30 5C35 -5 40 10 40 10"
              stroke="currentColor"
              strokeWidth="2"
              className={color}
            />
          </svg>
        </div>
      </div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <h3 className="text-[26px] font-black text-foreground tracking-tight leading-none">
          {value}
        </h3>
        {chip && (
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
              chipColor === "green"
                ? "bg-emerald-500/10 text-primary border-primary/20"
                : chipColor === "amber"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : chipColor === "purple"
                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    : "bg-sky-500/10 text-sky-600 border-sky-500/20"
            }`}
          >
            {chip}
          </span>
        )}
      </div>
      <p className="text-[12px] font-bold text-muted-foreground mt-2">
        {subValue}
      </p>
      {progress !== undefined && (
        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
          {title}
        </h3>
      </div>
      {count && (
        <span className="text-[11px] font-bold text-muted-foreground/60">
          {count}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
const MONTHS = [
  "All Months",
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
];
const CATEGORIES_ALL = [
  "All Categories",
  "Travel",
  "Food",
  "Equipment",
  "Accommodation",
  "Transport",
  "Medical",
  "Training",
  "Communication",
  "Other",
];
const STATUSES_ALL = ["All Status", "Approved", "Pending", "Rejected", "Draft"];
const MONTH_DATE_MAP: Record<string, string> = {
  March: "Mar",
  April: "Apr",
  May: "May",
};

export function FinanceMyExpenses() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showMonthDrop, setShowMonthDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseCat, setNewExpenseCat] = useState("Travel");

  // Controlled states for new expense form
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [newExpensePaymentMode, setNewExpensePaymentMode] =
    useState("Personal Card");

  const categoryMap: Record<string, ExpenseCategory> = {
    Travel: "Travel",
    Food: "Food",
    Equipment: "Equipment",
    Stay: "Accommodation",
    Medical: "Medical",
    Training: "Training",
    Other: "Other",
  };

  const handleExport = () => {
    const rows = filteredExpenses.map((e) =>
      [
        e.id,
        e.title,
        e.category,
        e.date,
        `₹${e.amount}`,
        e.status,
        e.description,
      ].join(","),
    );
    const csv = [
      "ID,Title,Category,Date,Amount,Status,Description",
      ...rows,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!", "success", "Expense report downloaded as CSV.");
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const tabMatch = activeTab === "All" || e.status === activeTab;
      const catMatch =
        selectedCategory === "All Categories" ||
        e.category === selectedCategory;
      const statusMatch =
        selectedStatus === "All Status" || e.status === selectedStatus;
      const monthMatch =
        selectedMonth === "All Months" ||
        e.date.includes(
          MONTH_DATE_MAP[selectedMonth] ?? selectedMonth.slice(0, 3),
        );
      return tabMatch && catMatch && statusMatch && monthMatch;
    });
  }, [expenses, activeTab, selectedCategory, selectedMonth, selectedStatus]);

  // Dynamic calculations
  const totalClaimedThisMonth = useMemo(() => {
    return expenses
      .filter((e) => e.status !== "Rejected" && e.status !== "Draft")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalApproved = useMemo(() => {
    return expenses
      .filter((e) => e.status === "Approved")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalPending = useMemo(() => {
    return expenses
      .filter((e) => e.status === "Pending")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const percentUsed = Math.min(
    Math.round((totalClaimedThisMonth / 15000) * 100),
    100,
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-5">
          <div className="w-[52px] h-[52px] rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/20">
            <Receipt size={28} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-tight tracking-tight">
              My Expenses
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground">
              Manage and track your reimbursement claims
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-secondary text-foreground border border-border rounded-xl font-black hover:bg-secondary/80 transition-all text-[13px]"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black hover:opacity-95 transition-all text-[13px] shadow-lg shadow-[#00B87C]/20"
          >
            <Receipt size={18} /> + New Expense
          </button>
        </div>
      </div>

      {/* ─── Info Bar ────────────────────────────────────────────── */}
      <div className="bg-card p-4 px-6 rounded-2xl border border-border shadow-sm flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-primary" /> ₹4,200 approved —
          added to next payroll
        </div>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 2 claims
          pending approval
        </div>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-sky-500" /> Monthly limit:
          ₹15,000 | Used: ₹8,750 (58%)
        </div>
      </div>

      {/* ─── KPI Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={Receipt}
          color="text-amber-500"
          bg="bg-amber-500/10"
          label="CLAIMED THIS MONTH"
          value={`₹${totalClaimedThisMonth.toLocaleString()}`}
          subValue={`${expenses.filter((e) => e.status !== "Draft" && e.status !== "Rejected").length} expense claims`}
          chip="↑ ₹1,200 vs last month"
          chipColor="amber"
        />
        <SummaryCard
          icon={CheckCircle2}
          color="text-primary"
          bg="bg-emerald-500/10"
          label="APPROVED"
          value={`₹${totalApproved.toLocaleString()}`}
          subValue={`${expenses.filter((e) => e.status === "Approved").length} claims approved`}
          chip="Credited Apr 1"
          chipColor="green"
        />
        <SummaryCard
          icon={Clock}
          color="text-sky-500"
          bg="bg-sky-500/10"
          label="PENDING REVIEW"
          value={`₹${totalPending.toLocaleString()}`}
          subValue={`${expenses.filter((e) => e.status === "Pending").length} claims in review`}
          chip="Avg 2 days response"
          chipColor="sky"
        />
        <SummaryCard
          icon={Gauge}
          color="text-purple-500"
          bg="bg-purple-500/10"
          label="MONTHLY LIMIT"
          value="₹15,000"
          subValue={`₹${Math.max(15000 - totalClaimedThisMonth, 0).toLocaleString()} remaining`}
          progress={percentUsed}
          chip={`${percentUsed}% used`}
          chipColor="amber"
        />
      </div>

      {/* ─── Main Content Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Column — Table */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Row */}
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <SectionHeader title="EXPENSE CLAIMS" count="8 total" />
              <div className="flex items-center gap-2">
                {/* Category Dropdown */}
                <div className="relative">
                  <div
                    onClick={() => {
                      setShowCatDrop(!showCatDrop);
                      setShowMonthDrop(false);
                      setShowStatusDrop(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-[11px] font-black text-foreground cursor-pointer hover:bg-secondary/80 transition-all"
                  >
                    {selectedCategory}{" "}
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                  {showCatDrop && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                      {CATEGORIES_ALL.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCategory(c);
                            setShowCatDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedCategory === c ? "text-primary font-black" : "text-foreground"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Month Dropdown */}
                <div className="relative">
                  <div
                    onClick={() => {
                      setShowMonthDrop(!showMonthDrop);
                      setShowCatDrop(false);
                      setShowStatusDrop(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-[11px] font-black text-foreground cursor-pointer hover:bg-secondary/80 transition-all"
                  >
                    {selectedMonth}{" "}
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                  {showMonthDrop && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px] max-h-[220px] overflow-y-auto">
                      {MONTHS.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedMonth(m);
                            setShowMonthDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedMonth === m ? "text-primary font-black" : "text-foreground"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Status Dropdown */}
                <div className="relative">
                  <div
                    onClick={() => {
                      setShowStatusDrop(!showStatusDrop);
                      setShowCatDrop(false);
                      setShowMonthDrop(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-[11px] font-black text-foreground cursor-pointer hover:bg-secondary/80 transition-all"
                  >
                    Status: {selectedStatus}{" "}
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                  {showStatusDrop && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                      {STATUSES_ALL.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedStatus(s);
                            setShowStatusDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedStatus === s ? "text-primary font-black" : "text-foreground"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 flex items-center gap-8 border-b border-border bg-secondary/30">
              {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(
                      tab as "All" | "Pending" | "Approved" | "Rejected",
                    )
                  }
                  className={`py-4 text-[13px] font-black relative transition-all ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[750px] table-fixed">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest w-[30%]">
                      EXPENSE
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center w-[15%]">
                      CATEGORY
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center w-[12%]">
                      DATE
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center w-[15%]">
                      AMOUNT
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center w-[13%]">
                      RECEIPT
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center w-[15%]">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredExpenses.map((expense) => {
                    const cfg = CATEGORY_CONFIG[expense.category];
                    const Icon = cfg.icon;
                    return (
                      <tr
                        key={expense.id}
                        className="group hover:bg-secondary/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0 shadow-sm border border-current/10`}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                {expense.title}
                              </p>
                              <p className="text-[11px] font-bold text-muted-foreground mt-0.5 truncate">
                                {expense.vendor}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border whitespace-nowrap ${cfg.chip}`}
                            >
                              {expense.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">
                          {expense.date}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`text-[14px] font-black ${expense.status === "Rejected" ? "text-rose-500" : expense.status === "Draft" ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            ₹{expense.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <ReceiptBadge status={expense.receiptStatus} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <StatusBadge status={expense.status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 px-6 border-t border-border flex items-center justify-between bg-secondary/10">
              <p className="text-[12px] font-bold text-muted-foreground">
                Showing 1–{filteredExpenses.length} of {filteredExpenses.length}{" "}
                claims
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-card border border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all">
                  {"<"} Prev
                </button>
                <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg font-black text-[12px]">
                  1
                </div>
                <button className="px-4 py-2 bg-card border border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all">
                  Next {">"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Widgets */}
        <div className="space-y-6">
          {/* Widget 1 — Budget Tracker */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <SectionHeader title="BUDGET TRACKER" />
            <p className="text-[11px] font-bold text-muted-foreground mt-1 mb-6 uppercase tracking-wider">
              April 2026 · ₹15,000 LIMIT
            </p>
            <div className="space-y-5">
              {[
                {
                  label: "Travel",
                  val: expenses
                    .filter(
                      (e) => e.category === "Travel" && e.status !== "Rejected",
                    )
                    .reduce((sum, e) => sum + e.amount, 0),
                  limit: 15000,
                  color: "text-sky-500",
                  bar: "bg-sky-500",
                },
                {
                  label: "Food",
                  val: expenses
                    .filter(
                      (e) => e.category === "Food" && e.status !== "Rejected",
                    )
                    .reduce((sum, e) => sum + e.amount, 0),
                  limit: 15000,
                  color: "text-amber-500",
                  bar: "bg-amber-500",
                },
                {
                  label: "Equipment",
                  val: expenses
                    .filter(
                      (e) =>
                        e.category === "Equipment" && e.status !== "Rejected",
                    )
                    .reduce((sum, e) => sum + e.amount, 0),
                  limit: 15000,
                  color: "text-purple-500",
                  bar: "bg-purple-500",
                },
                {
                  label: "Accommodation",
                  val: expenses
                    .filter(
                      (e) =>
                        e.category === "Accommodation" &&
                        e.status !== "Rejected",
                    )
                    .reduce((sum, e) => sum + e.amount, 0),
                  limit: 15000,
                  color: "text-emerald-500",
                  bar: "bg-emerald-500",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[12px] font-black">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={item.color}>
                      ₹{item.val.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{
                        width: `${Math.min((item.val / item.limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground/60 text-right uppercase tracking-tighter">
                    ₹{Math.max(item.limit - item.val, 0).toLocaleString()}{" "}
                    remaining
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-3 text-[13px] font-semibold uppercase tracking-wider">
                <span className="text-foreground">
                  Used: ₹{totalClaimedThisMonth.toLocaleString()}
                </span>
                <span className="text-primary">
                  Left: ₹
                  {Math.max(15000 - totalClaimedThisMonth, 0).toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
              <p className="text-[11px] font-black text-amber-500 text-right">
                {percentUsed}% OF BUDGET EXPENDED
              </p>
            </div>
          </div>

          {/* Widget 2 — Quick Submit */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <SectionHeader title="QUICK SUBMIT" />
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                {
                  label: "Travel",
                  icon: Plane,
                  color: "text-sky-500",
                  bg: "bg-sky-500/10",
                },
                {
                  label: "Food",
                  icon: Utensils,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
                {
                  label: "Equip.",
                  icon: Monitor,
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                },
                {
                  label: "Stay",
                  icon: Bed,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                {
                  label: "Transp.",
                  icon: Car,
                  color: "text-rose-500",
                  bg: "bg-rose-500/10",
                },
                {
                  label: "Other",
                  icon: Plus,
                  color: "text-muted-foreground",
                  bg: "bg-secondary",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setShowAddModal(true)}
                  className="flex flex-col items-center justify-center p-2 h-[72px] bg-secondary/50 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <item.icon
                    size={16}
                    className={`${item.color} mb-1.5 group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tighter">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 3 — Timeline */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <SectionHeader title="TIMELINE" />
            <div className="mt-6 space-y-6">
              {[
                { label: "Submitted", sub: "Apr 5, 2026", status: "completed" },
                {
                  label: "Approved",
                  sub: "Apr 6, 2026 · Rajan K.",
                  status: "completed",
                },
                { label: "Finance", sub: "In Progress", status: "active" },
                { label: "Payroll", sub: "Est. Apr 25", status: "pending" },
              ].map((step, i, arr) => (
                <div key={step.label} className="relative flex gap-4">
                  {i !== arr.length - 1 && (
                    <div
                      className={`absolute left-[9px] top-5 w-[2px] h-8 ${step.status === "completed" ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                      step.status === "completed"
                        ? "bg-primary text-white border-primary"
                        : step.status === "active"
                          ? "border-sky-500 bg-sky-500/10 animate-pulse"
                          : "border-border bg-secondary"
                    }`}
                  >
                    {step.status === "completed" && <CheckCircle2 size={12} />}
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground leading-none">
                      {step.label}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1.5">
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */
      /* MODALS                                                          */
      /* ─────────────────────────────────────────────────────────────── */}

      {/* 1. New Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-card w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-foreground">
                    New Expense Claim
                  </h3>
                  <p className="text-[13px] font-bold text-muted-foreground">
                    Complete the details below
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-secondary/10">
              <div className="space-y-4">
                <SectionHeader title="EXPENSE DETAILS" />

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    CATEGORY
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      "Travel",
                      "Food",
                      "Equipment",
                      "Stay",
                      "Medical",
                      "Training",
                      "Other",
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewExpenseCat(cat)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border ${
                          newExpenseCat === cat
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-card border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      TITLE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flight to Delhi"
                      value={newExpenseTitle}
                      onChange={(e) => setNewExpenseTitle(e.target.value)}
                      className="w-full px-4 h-[44px] bg-card border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      AMOUNT (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      className="w-full px-4 h-[44px] bg-card border border-border rounded-xl text-[13px] font-black text-foreground outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      DATE
                    </label>
                    <input
                      type="date"
                      value={newExpenseDate}
                      onChange={(e) => setNewExpenseDate(e.target.value)}
                      className="w-full px-4 h-[44px] bg-card border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                      PAYMENT MODE
                    </label>
                    <select
                      value={newExpensePaymentMode}
                      onChange={(e) => setNewExpensePaymentMode(e.target.value)}
                      className="w-full px-4 h-[44px] bg-card border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                    >
                      <option value="Personal Card">Personal Card</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI / Bank Transfer">
                        UPI / Bank Transfer
                      </option>
                      <option value="Corporate Card">Corporate Card</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    DESCRIPTION
                  </label>
                  <textarea
                    value={newExpenseDesc}
                    onChange={(e) => setNewExpenseDesc(e.target.value)}
                    placeholder="Provide a brief description of this expense..."
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeader title="RECEIPT (OPTIONAL)" />
                <div className="border-2 border-dashed border-border rounded-2xl p-8 bg-card flex flex-col items-center justify-center hover:border-primary transition-all cursor-pointer group">
                  <UploadCloud
                    size={28}
                    className="text-primary mb-3 group-hover:scale-110 transition-transform"
                  />
                  <p className="text-[13px] font-black text-foreground">
                    Click to upload receipt
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">
                    JPG, PNG, PDF · MAX 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-card shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-border rounded-xl text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (
                    !newExpenseTitle.trim() ||
                    !newExpenseAmount ||
                    !newExpenseDate
                  ) {
                    showToast(
                      "Validation Error",
                      "error",
                      "Please fill in all required fields.",
                    );
                    return;
                  }

                  let formattedDate = "Apr 12, 2026";
                  if (newExpenseDate) {
                    const parts = newExpenseDate.split("-");
                    if (parts.length === 3) {
                      const year = parts[0];
                      const monthIndex = parseInt(parts[1], 10) - 1;
                      const day = parseInt(parts[2], 10);
                      const monthNames = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
                    }
                  }

                  const newExp: Expense = {
                    id: `EXP-0${Math.floor(Math.random() * 900) + 100}`,
                    title: newExpenseTitle,
                    vendor: newExpensePaymentMode + " · Pending Verification",
                    category: categoryMap[newExpenseCat] || "Other",
                    date: formattedDate,
                    amount: parseFloat(newExpenseAmount),
                    receiptStatus: "Attached",
                    status: "Pending",
                    description: newExpenseDesc,
                    project: "viyanHR Internal",
                    paymentMode: newExpensePaymentMode,
                  };

                  setExpenses([newExp, ...expenses]);
                  showToast(
                    "Expense Submitted",
                    "success",
                    "Your expense claim has been submitted for review.",
                  );

                  setShowAddModal(false);
                  setNewExpenseTitle("");
                  setNewExpenseAmount("");
                  setNewExpenseDate("");
                  setNewExpensePaymentMode("Personal Card");
                  setNewExpenseDesc("");
                  setNewExpenseCat("Travel");
                }}
                className="px-6 py-3 bg-primary text-white rounded-xl font-black hover:opacity-95 transition-all text-[13px] shadow-lg shadow-[#00B87C]/20"
              >
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Expense Detail Panel */}
      {selectedExpense && (
        <div className="fixed inset-0 z-[4000] flex justify-end animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-950/20"
            onClick={() => setSelectedExpense(null)}
          />
          <div className="relative w-full max-w-[400px] bg-card h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${CATEGORY_CONFIG[selectedExpense.category].bg} flex items-center justify-center ${CATEGORY_CONFIG[selectedExpense.category].color} border border-current/10`}
                >
                  {(() => {
                    const Icon = CATEGORY_CONFIG[selectedExpense.category].icon;
                    return <Icon size={22} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-foreground truncate max-w-[200px]">
                    {selectedExpense.title}
                  </h3>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    ID: {selectedExpense.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="p-2 hover:bg-secondary rounded-full text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="p-4 bg-secondary/50 border border-border rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    AMOUNT
                  </p>
                  <p className="text-[22px] font-black text-foreground">
                    ₹{selectedExpense.amount.toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={selectedExpense.status} />
              </div>

              <div className="space-y-6">
                <SectionHeader title="DETAILS" />
                <div className="grid grid-cols-2 gap-y-6">
                  {[
                    { label: "Date", val: selectedExpense.date },
                    { label: "Vendor", val: selectedExpense.vendor },
                    { label: "Project", val: selectedExpense.project },
                    { label: "Payment", val: selectedExpense.paymentMode },
                  ].map((d) => (
                    <div key={d.label}>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        {d.label}
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {d.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border mt-auto">
              <button
                onClick={() => setSelectedExpense(null)}
                className="w-full py-4 border border-primary text-primary rounded-xl font-black text-[14px] hover:bg-primary/5 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
