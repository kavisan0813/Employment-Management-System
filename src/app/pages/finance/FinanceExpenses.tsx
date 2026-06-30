import React, { useState } from "react";
import { useLocation } from "react-router";
import {
  Receipt,
  Download,
  Search,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Eye,
  FileText,
  ExternalLink,
  AlertCircle,
  Calendar,
  CreditCard,
  Store,
  Briefcase,
  MapPin,
  MessageSquare,
  Paperclip,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExpenseClaim {
  id: string;
  employee: {
    name: string;
    role: string;
    department: string;
    avatarColor: string;
  };
  category: "Travel" | "Food" | "Equipment" | "Transport" | "Others";
  description: string;
  amount: number;
  receiptStatus: "Attached" | "Missing";
  submittedOn: string;
  status: "Pending" | "Approved" | "Rejected";
  vendor?: string;
  paymentMode?: string;
  project?: string;
}

const MOCK_EXPENSES: ExpenseClaim[] = [
  {
    id: "EXP-1284",
    employee: {
      name: "Robert Chen",
      role: "VP Engineering",
      department: "Engineering",
      avatarColor: "#8B5CF6",
    },
    category: "Travel",
    description: "Flight to Delhi — Client Meeting",
    amount: 4200,
    receiptStatus: "Attached",
    submittedOn: "Apr 3, 2026",
    status: "Pending",
    vendor: "IndiGo Airlines",
    paymentMode: "Corporate Card",
    project: "Apollo Expansion",
  },
  {
    id: "EXP-1285",
    employee: {
      name: "Priya Sharma",
      role: "Product Manager",
      department: "Product",
      avatarColor: "#10B981",
    },
    category: "Food",
    description: "Team Lunch — Sprint Retro",
    amount: 2150,
    receiptStatus: "Missing",
    submittedOn: "Apr 5, 2026",
    status: "Pending",
    vendor: "The Great Indian Kitchen",
    paymentMode: "Personal",
    project: "Nexus V2.0",
  },
  {
    id: "EXP-1283",
    employee: {
      name: "Daniel Kim",
      role: "Sales Lead",
      department: "Sales",
      avatarColor: "#F59E0B",
    },
    category: "Equipment",
    description: "USB-C Hub",
    amount: 1400,
    receiptStatus: "Attached",
    submittedOn: "Apr 4, 2026",
    status: "Approved",
    vendor: "Amazon Business",
    paymentMode: "Personal",
    project: "Sales Enablement",
  },
  {
    id: "EXP-1282",
    employee: {
      name: "Aisha Patel",
      role: "Ops Specialist",
      department: "Operations",
      avatarColor: "#EF4444",
    },
    category: "Transport",
    description: "Cab rides — no receipts",
    amount: 1850,
    receiptStatus: "Missing",
    submittedOn: "Mar 31, 2026",
    status: "Rejected",
    vendor: "Uber",
    paymentMode: "Personal",
    project: "Internal Ops",
  },
];

export function FinanceExpenses() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >(location.state?.activeTab || "Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewingExpense, setViewingExpense] = useState<ExpenseClaim | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rejectingExpense, setRejectingExpense] = useState<ExpenseClaim | null>(
    null,
  );
  const [clarifyingExpense, setClarifyingExpense] =
    useState<ExpenseClaim | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<"all" | "selected">("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [amountFilter, setAmountFilter] = useState("Any Amount");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = (mode: "all" | "selected") => {
    setExportMode(mode);
    setShowExportModal(true);
  };

  const executeExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const expensesToExport =
        exportMode === "selected"
          ? MOCK_EXPENSES.filter((exp) => selectedRows.includes(exp.id))
          : MOCK_EXPENSES;

      const headers = [
        "ID,Employee,Department,Category,Description,Amount,Receipt Status,Submitted On,Status",
      ];
      const rows = expensesToExport.map(
        (exp) =>
          `${exp.id},"${exp.employee.name}",${exp.employee.department},${exp.category},"${exp.description}",${exp.amount},${exp.receiptStatus},"${exp.submittedOn}",${exp.status}`,
      );

      const csvContent = headers.concat(rows).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `expenses_report_${exportMode}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setShowExportModal(false);
      showToast(
        `Exported ${expensesToExport.length} expense claims successfully.`,
      );
    }, 1500);
  };

  const filteredExpenses = MOCK_EXPENSES.filter((exp) => {
    const matchesTab = activeTab === "All" || exp.status === activeTab;
    const matchesSearch =
      exp.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All Categories" || exp.category === categoryFilter;
    const matchesDept =
      departmentFilter === "All Departments" ||
      exp.employee.department === departmentFilter;
    const matchesAmount =
      amountFilter === "Any Amount" ||
      (amountFilter === "< ₹1000" && exp.amount < 1000) ||
      (amountFilter === "₹1000 - ₹5000" &&
        exp.amount >= 1000 &&
        exp.amount <= 5000) ||
      (amountFilter === "> ₹5000" && exp.amount > 5000);
    return (
      matchesTab &&
      matchesSearch &&
      matchesCategory &&
      matchesDept &&
      matchesAmount
    );
  });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (
      selectedRows.length === filteredExpenses.length &&
      filteredExpenses.length > 0
    ) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredExpenses.map((e) => e.id));
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEF3C7] dark:bg-amber-500/10 flex items-center justify-center shadow-inner">
            <Receipt size={22} className="text-[#D97706]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              Expense Approvals
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Review and approve all employee expense claims
            </p>
          </div>
        </div>
        <button
          onClick={() => handleExport("all")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all"
        >
          <Download size={18} />
          Export All
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="TOTAL PENDING" value="36" color="amber" icon={Clock} />
        <KPICard
          title="APPROVED THIS MONTH"
          value="84"
          subValue="₹1,28,400"
          color="green"
          icon={CheckCircle2}
        />
        <KPICard title="REJECTED" value="12" color="red" icon={XCircle} />
        <KPICard
          title="AVG APPROVAL TIME"
          value="1.8d"
          color="dark"
          icon={Clock}
        />
      </div>

      {/* TABS & FILTER BAR */}
      <div className="space-y-6">
        {/* TABS */}
        <div className="flex items-center border-b border-border">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => {
            const count = tab === "Pending" ? 36 : null;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-8 py-4 text-[14px] font-semibold tracking-wider uppercase transition-all relative ${
                  isActive
                    ? "text-[#00B87C]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab} {count && `(${count})`}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B87C]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search employee, description..."
              className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FilterSelect
            label="All Categories"
            options={[
              "All Categories",
              "Travel",
              "Food",
              "Equipment",
              "Transport",
              "Others",
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <FilterSelect
            label="All Departments"
            options={[
              "All Departments",
              "Engineering",
              "Sales",
              "Product",
              "Operations",
            ]}
            value={departmentFilter}
            onChange={setDepartmentFilter}
          />
          <FilterSelect
            label="Any Amount"
            options={["Any Amount", "< ₹1000", "₹1000 - ₹5000", "> ₹5000"]}
            value={amountFilter}
            onChange={setAmountFilter}
          />
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("All Categories");
              setDepartmentFilter("All Departments");
              setAmountFilter("Any Amount");
              showToast("Filters Reset");
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* EXPENSE TABLE */}
      <div className="bg-card border border-border rounded-[32px] shadow-sm relative overflow-hidden">
        {/* BULK ACTIONS BAR */}
        <AnimatePresence>
          {selectedRows.length > 0 && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="sticky top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-[#00B87C]/30 shadow-lg px-8 py-3 flex items-center justify-between z-[20]"
            >
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-black text-[#00B87C]">
                  {selectedRows.length} claims selected
                </span>
                <div className="w-[1px] h-4 bg-border" />
                <button
                  onClick={() => setSelectedRows([])}
                  className="text-[11px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest"
                >
                  Deselect All
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    showToast(
                      `${selectedRows.length} claims approved successfully!`,
                    );
                    setSelectedRows([]);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-emerald-500/20"
                >
                  Approve All
                </button>
                <button
                  onClick={() =>
                    showToast(`Rejected ${selectedRows.length} claims.`)
                  }
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-rose-500/20"
                >
                  Reject All
                </button>
                <button
                  onClick={() => handleExport("selected")}
                  className="px-5 py-2 rounded-xl border border-border text-foreground text-[12px] font-bold uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Export Selected
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 border-b border-border flex items-center justify-between bg-card">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">
            All Expense Claims
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 dark:bg-muted/10 border-b border-border">
                <th className="px-6 py-4 w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === filteredExpenses.length &&
                      filteredExpenses.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  EMPLOYEE
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  CATEGORY
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  DESCRIPTION
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  AMOUNT
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  RECEIPT
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  SUBMITTED
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.map((exp, i) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group hover:bg-muted/50 dark:hover:bg-accent/50 transition-all cursor-pointer h-[64px] border-b border-border/50 last:border-0 ${
                    selectedRows.includes(exp.id)
                      ? "bg-[#F0FDF4] dark:bg-emerald-500/5"
                      : ""
                  }`}
                  onClick={() => setViewingExpense(exp)}
                >
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedRows.includes(exp.id)}
                      onChange={() => toggleRow(exp.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                        style={{ backgroundColor: exp.employee.avatarColor }}
                      >
                        {exp.employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-foreground leading-tight">
                          {exp.employee.name}
                        </p>
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          {exp.employee.department}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <CategoryChip category={exp.category} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-semibold text-muted-foreground max-w-[200px] truncate">
                      {exp.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[14px] font-black ${exp.status === "Rejected" ? "text-rose-500" : "text-foreground"}`}
                    >
                      ₹{exp.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ReceiptStatus status={exp.receiptStatus} />
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-muted-foreground">
                    {exp.submittedOn}
                  </td>
                  <td className="px-6 py-4">
                    <StatusChip status={exp.status} />
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {exp.status === "Pending" ? (
                        <>
                          <button
                            disabled={exp.receiptStatus === "Missing"}
                            onClick={() =>
                              showToast(`Expense ${exp.id} Approved!`)
                            }
                            className={`p-1.5 rounded-lg border transition-all ${
                              exp.receiptStatus === "Missing"
                                ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50"
                                : "bg-[#00B87C] border-[#00B87C] text-white hover:bg-emerald-600 shadow-sm"
                            }`}
                            title={
                              exp.receiptStatus === "Missing"
                                ? "Receipt required for approval"
                                : "Approve"
                            }
                          >
                            <Check size={16} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => setRejectingExpense(exp)}
                            className="p-1.5 rounded-lg bg-rose-500 border border-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all"
                            title="Reject"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </>
                      ) : (
                        <button
                          className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline ${exp.status === "Rejected" ? "text-rose-500" : "text-[#00B87C]"}`}
                        >
                          {exp.status === "Approved"
                            ? "View ›"
                            : "View Reason ›"}
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPENSE DETAIL PANEL */}
      <AnimatePresence>
        {viewingExpense && (
          <div className="fixed inset-0 z-[2100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setViewingExpense(null)}
            ></motion.div>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[400px] h-full bg-card shadow-[-20px_0_40px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Receipt size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                        {viewingExpense.category} Expense
                      </h3>
                      <p className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">
                        {viewingExpense.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingExpense(null)}
                    className="p-2 hover:bg-muted rounded-xl transition-all"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight line-clamp-2">
                  {viewingExpense.description}
                </h2>
              </div>

              {/* Status Banner */}
              <div
                className={`px-6 py-2 flex items-center gap-2 ${
                  viewingExpense.status === "Approved"
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : viewingExpense.status === "Pending"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                {viewingExpense.status === "Approved" ? (
                  <CheckCircle2 size={14} />
                ) : viewingExpense.status === "Pending" ? (
                  <Clock size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {viewingExpense.status} Claim
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Mini Stat Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-[20px] bg-muted/30 border border-border text-center">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                      Amount
                    </p>
                    <p className="text-xl font-black text-foreground">
                      ₹{viewingExpense.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-[20px] bg-muted/30 border border-border text-center">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                      Category
                    </p>
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">
                      {viewingExpense.category}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-5">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-3 bg-[#00B87C] rounded-full" />
                    Claim Details
                  </h4>
                  <div className="space-y-4">
                    <DetailItem
                      icon={Calendar}
                      label="Expense Date"
                      value={viewingExpense.submittedOn}
                    />
                    <DetailItem
                      icon={Store}
                      label="Vendor"
                      value={viewingExpense.vendor || "N/A"}
                    />
                    <DetailItem
                      icon={CreditCard}
                      label="Payment Mode"
                      value={viewingExpense.paymentMode || "N/A"}
                    />
                    <DetailItem
                      icon={Briefcase}
                      label="Project"
                      value={viewingExpense.project || "N/A"}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Department"
                      value={viewingExpense.employee.department}
                    />
                    <DetailItem
                      icon={Clock}
                      label="Submitted On"
                      value={viewingExpense.submittedOn}
                    />
                  </div>
                </div>

                {/* Receipt Preview */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Paperclip size={14} />
                    Receipt Attachment
                  </h4>
                  {viewingExpense.receiptStatus === "Attached" ? (
                    <div className="relative group cursor-pointer">
                      <div className="w-full aspect-video rounded-2xl bg-muted border border-border overflow-hidden flex items-center justify-center">
                        <FileText
                          size={48}
                          className="text-muted-foreground/30"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <Eye
                            className="text-white opacity-0 group-hover:opacity-100 transition-all"
                            size={24}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] font-bold text-muted-foreground">
                          {viewingExpense.category}_Receipt.pdf
                        </span>
                        <button className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1 hover:underline">
                          View Full <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-dashed border-rose-500/30 text-center space-y-2">
                      <AlertCircle
                        size={32}
                        className="text-rose-500 mx-auto"
                      />
                      <p className="text-[12px] font-bold text-rose-600">
                        No receipt attached to this claim
                      </p>
                      <p className="text-[11px] text-rose-500/60 uppercase font-semibold tracking-wider leading-tight">
                        Employee must provide proof for reimbursement
                      </p>
                    </div>
                  )}
                </div>

                {/* Approval Timeline */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Approval Timeline
                  </h4>
                  <div className="space-y-4">
                    <TimelineStep
                      label="Claim Submitted"
                      date={viewingExpense.submittedOn}
                      status="success"
                    />
                    <TimelineStep
                      label="Manager Approval"
                      date="Apr 6, 2026"
                      status={
                        viewingExpense.status === "Rejected"
                          ? "error"
                          : "success"
                      }
                    />
                    <TimelineStep
                      label="Finance Verification"
                      date="Pending"
                      status={
                        viewingExpense.status === "Pending"
                          ? "active"
                          : viewingExpense.status === "Approved"
                            ? "success"
                            : "muted"
                      }
                    />
                    <TimelineStep
                      label="Audit Check"
                      date="Upcoming"
                      status="muted"
                    />
                    <TimelineStep
                      label="Disbursement"
                      date="Upcoming"
                      status="muted"
                    />
                  </div>
                </div>

                {/* Manager Comment */}
                {viewingExpense.status === "Rejected" && (
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                      <MessageSquare size={14} />
                      Manager Comment
                    </div>
                    <p className="text-[13px] font-medium text-foreground leading-relaxed italic">
                      "The cab rides submitted for Mar 31 do not have
                      accompanying receipts. Please resubmit with proof of
                      payment."
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-border bg-muted/5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={
                      viewingExpense.receiptStatus === "Missing" ||
                      viewingExpense.status !== "Pending"
                    }
                    onClick={() => {
                      showToast(`Expense ${viewingExpense.id} Approved!`);
                      setViewingExpense(null);
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                  <button
                    disabled={viewingExpense.status !== "Pending"}
                    onClick={() => setRejectingExpense(viewingExpense)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
                <button
                  onClick={() => setClarifyingExpense(viewingExpense)}
                  className="w-full py-3 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all active:scale-95"
                >
                  Request More Info
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {rejectingExpense && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setRejectingExpense(null)}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#FEE2E2] dark:bg-rose-500/10 flex items-center justify-center mb-6 shadow-inner border border-rose-500/20">
                  <XCircle size={32} className="text-[#EF4444]" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  Reject Expense
                </h3>
                <p className="text-[13px] text-muted-foreground mt-2 max-w-[280px]">
                  Please provide a reason for rejecting the expense claim{" "}
                  <strong className="text-foreground">
                    {rejectingExpense.id}
                  </strong>
                  .
                </p>

                <div className="w-full mt-6 space-y-4 text-left">
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      placeholder="e.g. Receipt is unreadable, out of policy limit..."
                      className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 flex items-center gap-3">
                <button
                  onClick={() => setRejectingExpense(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(`Expense ${rejectingExpense.id} rejected.`);
                    setRejectingExpense(null);
                    setViewingExpense(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUEST CLARIFICATION MODAL */}
      <AnimatePresence>
        {clarifyingExpense && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setClarifyingExpense(null)}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#FEF3C7] dark:bg-amber-500/10 flex items-center justify-center mb-6 shadow-inner border border-amber-500/20">
                  <MessageSquare size={32} className="text-[#D97706]" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  Request Clarification
                </h3>
                <p className="text-[13px] text-muted-foreground mt-2 max-w-[280px]">
                  Send a message to{" "}
                  <strong>{clarifyingExpense.employee.name}</strong> regarding
                  expense{" "}
                  <strong className="text-foreground">
                    {clarifyingExpense.id}
                  </strong>
                  .
                </p>

                <div className="w-full mt-6 space-y-4 text-left">
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="What do you need clarification on?"
                      className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-medium min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 flex items-center gap-3">
                <button
                  onClick={() => setClarifyingExpense(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(
                      `Clarification request sent to ${clarifyingExpense.employee.name}.`,
                    );
                    setClarifyingExpense(null);
                  }}
                  className="flex-1 flex justify-center items-center gap-2 py-3.5 rounded-2xl bg-amber-500 text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Send size={16} />
                  Send Query
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[3000] bg-card border border-border shadow-2xl rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 flex items-center justify-center">
              <Check size={16} className="text-[#00B87C]" />
            </div>
            <p className="text-[13px] font-bold text-foreground pr-4">
              {toastMessage}
            </p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isExporting && setShowExportModal(false)}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#F0FDF4] dark:bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner border border-[#00B87C]/20">
                  <Download size={32} className="text-[#00B87C]" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  Export Expense Claims
                </h3>
                <p className="text-[13px] text-muted-foreground mt-2 max-w-[280px]">
                  {exportMode === "selected"
                    ? `Generating a CSV report for the ${selectedRows.length} selected expense claims.`
                    : "Generating a CSV report for all expense claims matching current filters."}
                </p>

                {isExporting && (
                  <div className="w-full mt-6 space-y-2 text-left">
                    <p className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest text-center">
                      Processing File...
                    </p>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="h-full bg-[#00B87C] rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 flex items-center gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  disabled={isExporting}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeExport}
                  disabled={isExporting}
                  className="flex-1 py-3.5 rounded-2xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isExporting ? "Exporting..." : "Download CSV"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICard({
  title,
  value,
  subValue,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  subValue?: string;
  color: "amber" | "green" | "red" | "dark";
  icon: React.ElementType;
}) {
  const colors = {
    amber: { text: "#D97706", bg: "#FEF3C7", iconColor: "#D97706" },
    green: { text: "#00B87C", bg: "#DCFCE7", iconColor: "#10B981" },
    red: { text: "#EF4444", bg: "#FEE2E2", iconColor: "#EF4444" },
    dark: { text: "#111827", bg: "#F3F4F6", iconColor: "#64748B" },
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors[color].bg }}
      >
        <Icon size={18} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="flex items-end gap-2">
        <h3
          className="text-[28px] font-bold tracking-tighter"
          style={{ color: colors[color].text }}
        >
          {value}
        </h3>
        {subValue && (
          <span className="text-[12px] font-bold text-[#00B87C] mb-1.5">
            {subValue}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function FilterSelect({
  label,
  options = ["Option 1", "Option 2"],
  value: externalValue,
  onChange: externalOnChange,
}: {
  label: string;
  options?: string[];
  value?: string;
  onChange?: (val: string) => void;
}) {
  const [internalValue, setInternalValue] = useState(label);
  const value = externalValue ?? internalValue;
  const handleChange = externalOnChange ?? setInternalValue;

  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none flex items-center gap-2.5 px-5 pr-12 py-2.5 bg-card border border-border rounded-xl text-[13px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm outline-none cursor-pointer"
      >
        <option value={label}>{label}</option>
        {options
          .filter((opt) => opt !== label)
          .map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-[#00B87C] transition-colors"
      />
    </div>
  );
}

function CategoryChip({ category }: { category: ExpenseClaim["category"] }) {
  const styles = {
    Travel:
      "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
    Food: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Equipment:
      "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    Transport:
      "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    Others:
      "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${styles[category]}`}
    >
      {category}
    </span>
  );
}

function ReceiptStatus({ status }: { status: ExpenseClaim["receiptStatus"] }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border flex items-center gap-1 w-fit ${
        status === "Attached"
          ? "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20"
          : "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20"
      }`}
    >
      {status === "Attached" ? (
        <Check size={10} strokeWidth={4} />
      ) : (
        <X size={10} strokeWidth={4} />
      )}
      {status === "Attached" ? "✓ Attached" : "✗ Missing"}
    </span>
  );
}

function StatusChip({ status }: { status: ExpenseClaim["status"] }) {
  const styles = {
    Approved: "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
    Pending: "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
    Rejected: "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border flex items-center justify-center w-fit gap-1.5 ${styles[status]}`}
    >
      {status === "Approved"
        ? "✓ Approved"
        : status === "Pending"
          ? "⏳ Pending"
          : "✗ Rejected"}
    </span>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
        checked
          ? "bg-[#00B87C] border-[#00B87C]"
          : "bg-card border-border hover:border-[#00B87C]/50"
      }`}
    >
      {checked && <Check size={14} strokeWidth={4} className="text-white" />}
    </button>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest leading-tight">
          {label}
        </p>
        <p className="text-[13px] font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function TimelineStep({
  label,
  date,
  status,
}: {
  label: string;
  date: string;
  status: "success" | "active" | "muted" | "error";
}) {
  return (
    <div className="flex gap-4 relative group">
      <div className="flex flex-col items-center gap-1.5">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${
            status === "success"
              ? "bg-[#00B87C] border-[#00B87C]"
              : status === "active"
                ? "bg-card border-[#00B87C] animate-pulse shadow-[0_0_8px_rgba(0,184,124,0.4)]"
                : status === "error"
                  ? "bg-rose-500 border-rose-500"
                  : "bg-card border-border"
          }`}
        />
        <div
          className={`w-[1px] flex-1 bg-border group-last:hidden ${status === "success" ? "bg-[#00B87C]/30" : ""}`}
        />
      </div>
      <div className="pb-4">
        <p
          className={`text-[12px] font-bold uppercase tracking-widest leading-none ${
            status === "success"
              ? "text-[#00B87C]"
              : status === "active"
                ? "text-[#00B87C]"
                : status === "error"
                  ? "text-rose-500"
                  : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-1.5">
          {date}
        </p>
      </div>
    </div>
  );
}
