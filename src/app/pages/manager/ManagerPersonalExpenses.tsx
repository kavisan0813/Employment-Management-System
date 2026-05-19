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
import { showToast } from "../../components/workflow/ToastNotification";
import { AnimatePresence, motion } from "framer-motion";

type ExpenseStatus = "Approved" | "Pending L1" | "Pending L2" | "Rejected" | "Draft";
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

const MOCK_EXPENSES: Expense[] = [
  {
    id: "EXP-0501",
    title: "Client Dinner — Acme Corp",
    vendor: "Taj Coromandel · 4 attendees",
    category: "Food",
    date: "May 8, 2026",
    amount: 5400,
    receiptStatus: "Attached",
    status: "Pending L2",
    description: "Business dinner with Acme Corp leadership team.",
    project: "Sales & Strategy",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0502",
    title: "AWS Advanced Workshop Certification",
    vendor: "Amazon Web Services",
    category: "Training",
    date: "May 5, 2026",
    amount: 12000,
    receiptStatus: "Attached",
    status: "Approved",
    description: "Advanced Cloud Practitioner Training for Engineering division.",
    project: "NexusHR Infrastructure",
    paymentMode: "Company Card",
  },
  {
    id: "EXP-0503",
    title: "Flight to Mumbai — Leadership Summit",
    vendor: "Air India · Booking #AI8839",
    category: "Travel",
    date: "Apr 28, 2026",
    amount: 6800,
    receiptStatus: "Attached",
    status: "Approved",
    description: "Flight to attend the Q1 Leadership Summit.",
    project: "Operations",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0504",
    title: "Home Office Keyboard & Trackpad",
    vendor: "Apple India · Order #APL9942",
    category: "Equipment",
    date: "Apr 25, 2026",
    amount: 14500,
    receiptStatus: "Attached",
    status: "Pending L1",
    description: "Replacement peripherals for active remote work setup.",
    project: "NexusHR Development",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0505",
    title: "Team Retrospective Lunch",
    vendor: "Sigree Chennai · 6 attendees",
    category: "Food",
    date: "Apr 15, 2026",
    amount: 3200,
    receiptStatus: "Attached",
    status: "Approved",
    description: "Monthly sprint retrospective lunch with core reports.",
    project: "NexusHR Development",
    paymentMode: "Cash",
  },
  {
    id: "EXP-0506",
    title: "Cab rides — Weekly Commute",
    vendor: "Uber · Monthly Statement",
    category: "Transport",
    date: "Apr 12, 2026",
    amount: 2400,
    receiptStatus: "Missing",
    status: "Rejected",
    description: "Weekly commute allowance for office visit weeks.",
    project: "Operations",
    paymentMode: "Personal Card",
  },
  {
    id: "EXP-0507",
    title: "Udemy Leadership Certification Course",
    vendor: "Udemy · Draft",
    category: "Training",
    date: "—",
    amount: 3899,
    receiptStatus: "Pending",
    status: "Draft",
    description: "Continuous professional development for managerial effectiveness.",
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
    color: "text-[#00B87C]",
    chip: "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20",
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

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const cfg: Record<ExpenseStatus, string> = {
    Approved: "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20",
    "Pending L1": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Pending L2": "bg-sky-500/10 text-sky-500 border-sky-500/20",
    Rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Draft: "bg-secondary text-muted-foreground border-border",
  };
  const icons: Record<ExpenseStatus, React.ElementType> = {
    Approved: CheckCircle2,
    "Pending L1": Clock,
    "Pending L2": Clock,
    Rejected: X,
    Draft: Edit3,
  };
  const Icon = icons[status];

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 w-fit uppercase tracking-wider ${cfg[status]}`}
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
      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-[#00B87C] border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-wider">
        <FileText size={12} /> Attached
      </span>
    );
  if (status === "Missing")
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5 uppercase tracking-wider">
        <X size={12} /> Missing
      </span>
    );
  return (
    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 uppercase tracking-wider">
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
    <div className="bg-card p-5 rounded-[24px] border border-border shadow-sm relative group hover:shadow-md transition-all">
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
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
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
                ? "bg-emerald-500/10 text-[#00B87C] border-emerald-500/20"
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

const MONTHS = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
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

const STATUSES_ALL = ["All Status", "Approved", "Pending L1", "Pending L2", "Rejected", "Draft"];

const MONTH_DATE_MAP: Record<string, string> = {
  March: "Mar",
  April: "Apr",
  May: "May",
};

export function ManagerPersonalExpenses() {
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
  
  const [newExpense, setNewExpense] = useState({
    title: "",
    vendor: "",
    amount: "",
    category: "Travel" as ExpenseCategory,
    description: "",
    project: "",
    paymentMode: "Personal Card",
  });

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
    a.download = "manager_expenses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!", "success", "Expense report downloaded as CSV.");
  };

  const filteredExpenses = useMemo(() => {
    return MOCK_EXPENSES.filter((e) => {
      const tabMatch =
        activeTab === "All"
          ? true
          : activeTab === "Pending"
            ? e.status.includes("Pending")
            : e.status === activeTab;

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
  }, [activeTab, selectedCategory, selectedMonth, selectedStatus]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Submitted!", "success", "Your expense claim has been successfully submitted.");
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <Receipt size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none mb-1">
              My Expenses
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
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
            className="flex items-center gap-2 px-6 py-3 bg-[#00B87C] text-white rounded-xl font-black hover:opacity-95 transition-all text-[13px] shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} /> New Expense
          </button>
        </div>
      </div>

      {/* ─── Info Bar ────────────────────────────────────────────── */}
      <div className="bg-card p-4 px-6 rounded-2xl border border-border shadow-sm flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-[#00B87C]" /> ₹8,200 approved — added to next payroll
        </div>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 2 claims pending approval
        </div>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Monthly limit: ₹30,000 | Used: ₹12,400 (41%)
        </div>
      </div>

      {/* ─── KPI Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={Receipt}
          color="text-amber-500"
          bg="bg-amber-500/10"
          label="CLAIMED THIS MONTH"
          value="₹12,400"
          subValue="3 expense claims"
          chip="↑ ₹3,650 vs last month"
          chipColor="amber"
        />
        <SummaryCard
          icon={CheckCircle2}
          color="text-[#00B87C]"
          bg="bg-emerald-500/10"
          label="APPROVED"
          value="₹8,200"
          subValue="2 claims approved"
          chip="Credited May 1"
          chipColor="green"
        />
        <SummaryCard
          icon={Clock}
          color="text-sky-500"
          bg="bg-sky-500/10"
          label="PENDING REVIEW"
          value="₹4,200"
          subValue="1 claim in final review"
          chip="L2 Finance status"
          chipColor="sky"
        />
        <SummaryCard
          icon={Gauge}
          color="text-purple-500"
          bg="bg-purple-500/10"
          label="MONTHLY LIMIT"
          value="₹30,000"
          subValue="₹17,600 remaining"
          progress={41}
          chip="41% used"
          chipColor="purple"
        />
      </div>

      {/* ─── Main Content Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Column — Table */}
        <div className="space-y-6">
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Row */}
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/10">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
                  EXPENSE CLAIMS
                </h3>
                <span className="text-[11px] font-bold text-muted-foreground/60 ml-1">
                  {filteredExpenses.length} total
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
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
                    <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                      {CATEGORIES_ALL.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCategory(c);
                            setShowCatDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedCategory === c ? "text-[#00B87C] font-black" : "text-foreground"}`}
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
                    <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px] max-h-[220px] overflow-y-auto">
                      {MONTHS.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedMonth(m);
                            setShowMonthDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedMonth === m ? "text-[#00B87C] font-black" : "text-foreground"}`}
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
                    <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                      {STATUSES_ALL.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedStatus(s);
                            setShowStatusDrop(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-secondary transition-colors ${selectedStatus === s ? "text-[#00B87C] font-black" : "text-foreground"}`}
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
                      ? "text-[#00B87C]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[750px] table-fixed">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[30%]">
                      EXPENSE
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center w-[15%]">
                      CATEGORY
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center w-[12%]">
                      DATE
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center w-[15%]">
                      AMOUNT
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center w-[13%]">
                      RECEIPT
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center w-[15%]">
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
                              <p className="text-[13px] font-black text-foreground group-hover:text-[#00B87C] transition-colors leading-tight truncate">
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
                Showing 1–{filteredExpenses.length} of {filteredExpenses.length} claims
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-card border border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all">
                  {"<"} Prev
                </button>
                <div className="w-8 h-8 flex items-center justify-center bg-[#00B87C] text-white rounded-lg font-black text-[12px]">
                  1
                </div>
                <button className="px-4 py-2 bg-card border border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all">
                  Next {">"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Budget Tracker */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col gap-5">
            <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest">
              Budget Breakdown
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-[12px] font-black text-foreground mb-1.5">
                  <span>Travel & Lodging</span>
                  <span>₹6,800 / ₹15,000</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: "45%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] font-black text-foreground mb-1.5">
                  <span>Food & Client Meals</span>
                  <span>₹5,400 / ₹8,000</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: "67%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] font-black text-foreground mb-1.5">
                  <span>Equipment & Tech</span>
                  <span>₹0 / ₹5,000</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "0%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] font-black text-foreground mb-1.5">
                  <span>Other / Miscellaneous</span>
                  <span>₹200 / ₹2,000</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500" style={{ width: "10%" }} />
                </div>
              </div>
            </div>

            <div className="bg-secondary/40 border border-border p-4 rounded-2xl text-[12px] font-bold text-muted-foreground leading-relaxed">
              ⚠️ Expense submissions for the current month close on <strong className="text-foreground">May 25</strong>. Ensure all valid receipts are attached before submitting.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedExpense && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExpense(null)}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/20">
                    <Receipt size={22} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-foreground leading-none mb-1">
                      {selectedExpense.id}
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Expense Claim Details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[15px] font-black text-foreground mb-1 leading-tight">
                    {selectedExpense.title}
                  </h4>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    {selectedExpense.vendor}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/40 border border-border p-3.5 rounded-2xl">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Category
                    </span>
                    <span className="text-[13px] font-black text-foreground uppercase">
                      {selectedExpense.category}
                    </span>
                  </div>
                  <div className="bg-secondary/40 border border-border p-3.5 rounded-2xl">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Amount
                    </span>
                    <span className="text-[13px] font-black text-foreground">
                      ₹{selectedExpense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-secondary/40 border border-border p-3.5 rounded-2xl">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Date
                    </span>
                    <span className="text-[13px] font-black text-foreground">
                      {selectedExpense.date}
                    </span>
                  </div>
                  <div className="bg-secondary/40 border border-border p-3.5 rounded-2xl">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Status
                    </span>
                    <StatusBadge status={selectedExpense.status} />
                  </div>
                </div>

                <div className="bg-secondary/30 p-4 rounded-2xl border border-border space-y-2.5">
                  <div className="flex justify-between text-[12px] font-bold text-muted-foreground">
                    <span>Project:</span>
                    <span className="text-foreground font-black">{selectedExpense.project}</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-muted-foreground">
                    <span>Payment Mode:</span>
                    <span className="text-foreground font-black">{selectedExpense.paymentMode}</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-muted-foreground">
                    <span>Receipt:</span>
                    <ReceiptBadge status={selectedExpense.receiptStatus} />
                  </div>
                </div>

                {selectedExpense.description && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      Description
                    </label>
                    <p className="text-[13px] font-bold text-foreground leading-relaxed bg-secondary/20 border border-border p-3.5 rounded-2xl">
                      {selectedExpense.description}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExpense(null)}
                    className="flex-1 px-6 py-3.5 border border-border rounded-xl text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all"
                  >
                    Close Details
                  </button>
                  {selectedExpense.receiptStatus === "Attached" && (
                    <button
                      onClick={() => {
                        showToast("Downloading", "info", "Downloading expense receipt.");
                        setSelectedExpense(null);
                      }}
                      className="flex-1 px-6 py-3.5 bg-[#00B87C] text-white rounded-xl font-black text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Receipt
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Add Expense Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/20">
                    <Plus size={22} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-foreground">
                      New Expense Claim
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Submit reimbursement requests
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        CATEGORY
                      </label>
                      <select
                        required
                        value={newExpense.category}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all appearance-none"
                      >
                        {CATEGORIES_ALL.filter(c => c !== "All Categories").map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        AMOUNT (₹)
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="e.g. 1500"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, amount: e.target.value })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      TITLE
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Flight to Delhi — Client Meeting"
                      value={newExpense.title}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, title: e.target.value })
                      }
                      className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      VENDOR & DETAILS
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Air India · Booking #AI8839"
                      value={newExpense.vendor}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, vendor: e.target.value })
                      }
                      className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        PROJECT
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Sales"
                        value={newExpense.project}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, project: e.target.value })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        PAYMENT MODE
                      </label>
                      <select
                        required
                        value={newExpense.paymentMode}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, paymentMode: e.target.value })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all appearance-none"
                      >
                        <option value="Personal Card">Personal Card</option>
                        <option value="Company Card">Company Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Online Transfer">Online Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      DESCRIPTION
                    </label>
                    <textarea
                      placeholder="Enter detailed description of the expense..."
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, description: e.target.value })
                      }
                      rows={3}
                      className="w-full p-4 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      RECEIPT ATTACHMENT
                    </label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-6 bg-secondary/50 flex flex-col items-center justify-center gap-1 hover:border-[#00B87C] transition-all cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#00B87C] group-hover:scale-110 transition-transform">
                        <UploadCloud size={18} />
                      </div>
                      <p className="text-[12px] font-black text-foreground">
                        Browse Files
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground">
                        PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2 border-t border-border mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3.5 border border-border rounded-xl text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 bg-[#00B87C] text-white rounded-xl font-black text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
