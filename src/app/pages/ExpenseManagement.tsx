import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Receipt, Plus, Download, Clock, Banknote, Search, Calendar, Filter, FileText,
  ChevronDown, X, Upload, MoreVertical, Check, Eye, Edit3, MapPin, CreditCard,
  TrendingUp, RotateCcw, ArrowUpRight, ArrowDownRight, Briefcase, ShieldCheck,
  CheckCircle2, Layers, FileSpreadsheet, FileJson, Share2, Settings, Printer,
  Ban,
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Mock Data ─────────────────────────── */
const trendData = [
  { name: "Oct", value: 45000 },
  { name: "Nov", value: 52000 },
  { name: "Dec", value: 48000 },
  { name: "Jan", value: 61000 },
  { name: "Feb", value: 55000 },
  { name: "Mar", value: 67000 },
  { name: "Apr", value: 72000 },
];

const categoryData = [
  { name: "Travel", value: 42000, color: "#10B981" },
  { name: "Food", value: 28000, color: "#3B82F6" },
  { name: "Fuel", value: 21000, color: "#F59E0B" },
  { name: "Accommodation", value: 19000, color: "#8B5CF6" },
  { name: "Office Supplies", value: 14500, color: "#EC4899" },
  { name: "Other", value: 8500, color: "#64748B" },
];

const initialClaims = [
  {
    id: "EXP-2026-001",
    employee: { name: "Sarah Chen", dept: "Engineering", avatar: "SC", email: "sarah.c@nexus.com" },
    category: "Travel",
    catIcon: "🚗",
    description: "Uber to client meeting (Microsoft HQ)",
    amount: 18450,
    date: "2026-04-24",
    approvalStatus: "Pending",
    reimbursementStatus: "Not Paid",
    paymentMode: "Personal Card"
  },
  {
    id: "EXP-2026-002",
    employee: { name: "James Wilson", dept: "Sales", avatar: "JW", email: "james.w@nexus.com" },
    category: "Food",
    catIcon: "🍽️",
    description: "Client dinner - quarterly review",
    amount: 5280,
    date: "2026-04-23",
    approvalStatus: "Approved",
    reimbursementStatus: "Processing",
    paymentMode: "Cash"
  },
  {
    id: "EXP-2026-003",
    employee: { name: "Michael Ross", dept: "HR", avatar: "MR", email: "michael.r@nexus.com" },
    category: "Fuel",
    catIcon: "⛽",
    description: "Monthly fuel allowance reimbursement",
    amount: 3500,
    date: "2026-04-22",
    approvalStatus: "Pending",
    reimbursementStatus: "Not Paid",
    paymentMode: "Personal Card"
  },
  {
    id: "EXP-2026-004",
    employee: { name: "Emily Blunt", dept: "Marketing", avatar: "EB", email: "emily.b@nexus.com" },
    category: "Accommodation",
    catIcon: "🏨",
    description: "Hotel stay for TechConf 2026",
    amount: 12500,
    date: "2026-04-21",
    approvalStatus: "Approved",
    reimbursementStatus: "Paid",
    paymentMode: "Corporate Card"
  },
  {
    id: "EXP-2026-005",
    employee: { name: "David Miller", dept: "Design", avatar: "DM", email: "david.m@nexus.com" },
    category: "Office Supplies",
    catIcon: "🛒",
    description: "Apple Magic Mouse (Replacement)",
    amount: 8500,
    date: "2026-04-20",
    approvalStatus: "Rejected",
    reimbursementStatus: "Not Paid",
    paymentMode: "Personal Card"
  }
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = ["2024", "2025", "2026"];

interface Employee {
  name: string;
  dept: string;
  avatar: string;
  email: string;
}

interface ExpenseClaim {
  id: string;
  employee: Employee;
  category: string;
  catIcon: string;
  description: string;
  amount: number;
  date: string;
  approvalStatus: string;
  reimbursementStatus: string;
  paymentMode: string;
}

export function Expenses() {
  const navigate = useNavigate();
  const [claims] = useState<ExpenseClaim[]>(initialClaims);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Custom Select States
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // UI Interaction States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState("All");
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Advanced Filter States
  const [selectedDept, setSelectedDept] = useState("All");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClaim, setEditingClaim] = useState<ExpenseClaim | null>(null);
  const [viewClaim, setViewClaim] = useState<ExpenseClaim | null>(null);
  const [receiptToView, setReceiptToView] = useState<ExpenseClaim | null>(null);

  // New Workflow Modals
  const [showManagerShare, setShowManagerShare] = useState(false);
  const [showFinanceShare, setShowFinanceShare] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    details: true, category: true, date: true, amount: true, receipt: true, approval: true, reimbursement: true
  });

  // Workflow Status Modals
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);
  const [showManagerQueue, setShowManagerQueue] = useState(false);
  const [showDuePayments, setShowDuePayments] = useState(false);
  const [showRejectedResubmit, setShowRejectedResubmit] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionId(null);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchesSearch = c.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || c.approvalStatus === activeTab;
      const matchesDept = selectedDept === "All" || c.employee.dept === selectedDept;
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;

      let matchesDateRange = true;
      if (selectedDateRange !== "All") {
        // Simple mock logic for date range filtering
        const claimDate = new Date(c.date);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - claimDate.getTime()) / (1000 * 3600 * 24));

        if (selectedDateRange === "Today") matchesDateRange = diffDays === 0;
        else if (selectedDateRange === "Last 7 Days") matchesDateRange = diffDays <= 7;
        else if (selectedDateRange === "Last 30 Days") matchesDateRange = diffDays <= 30;
      }

      return matchesSearch && matchesTab && matchesDept && matchesCategory && matchesDateRange;
    });
  }, [claims, searchQuery, activeTab, selectedDept, selectedCategory, selectedDateRange]);

  const kpis = [
    { label: "Total Claims", val: "248", trend: "+12.5%", isUp: true, icon: <Receipt size={18} />, color: "emerald", desc: "Submitted this month" },
    { label: "Pending Approval", val: "36", trend: "+2.4%", isUp: true, icon: <Clock size={18} />, color: "amber", desc: "Awaiting manager action" },
    { label: "Approved Amount", val: "₹1.84L", trend: "+8.1%", isUp: true, icon: <CheckCircle2 size={18} />, color: "sky", desc: "Finalized for payment" },
    { label: "Reimbursed", val: "₹1.42L", trend: "+5.3%", isUp: true, icon: <Banknote size={18} />, color: "teal", desc: "Completed disbursements" },
  ];

  const categories = ["Travel", "Food", "Fuel", "Accommodation", "Office Supplies", "Training", "Medical", "Other"];

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-10 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pt-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Layers className="text-emerald-500" size={32} />
            Expense Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Track employee claims, approvals, and reimbursements effortlessly.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 bg-card border border-border shadow-sm hover:border-emerald-500/50 transition-all text-sm font-bold text-foreground"
            >
              <Calendar size={16} className="text-emerald-500" />
              {selectedMonth}
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showMonthDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showMonthDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 py-2"
                >
                  {months.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedMonth === m ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    >
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 bg-card border border-border shadow-sm hover:border-emerald-500/50 transition-all text-sm font-bold text-foreground"
            >
              {selectedYear}
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showYearDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-2xl z-50 py-2"
                >
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => { setSelectedYear(y); setShowYearDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedYear === y ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    >
                      {y}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2.5 text-sm font-bold text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted/50 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                >
                  <ExportItem icon={<FileText size={16} />} label="Export as PDF" onClick={() => { toast.success("PDF Export Started"); setShowExportMenu(false); }} />
                  <ExportItem icon={<FileSpreadsheet size={16} />} label="Export as Excel" onClick={() => { toast.success("Excel Export Started"); setShowExportMenu(false); }} />
                  <ExportItem icon={<FileJson size={16} />} label="Export as CSV" onClick={() => { toast.success("CSV Export Started"); setShowExportMenu(false); }} />
                  <div className="border-t border-border my-1" />
                  <ExportItem icon={<Printer size={16} />} label="Print Summary" onClick={() => window.print()} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── PREMIUM TOP WORKFLOW STATUS BAR ── */}
      <div className="mt-6 mb-8 bg-card border border-border rounded-[24px] shadow-sm p-2 flex flex-wrap items-center gap-2">
        <StatusChip dotColor="bg-orange-500" label="₹42K Pending Approvals" onClick={() => setShowPendingApprovals(true)} />
        <StatusChip dotColor="bg-amber-400" label="12 Claims Need Manager Action" onClick={() => setShowManagerQueue(true)} />
        <StatusChip dotColor="bg-emerald-500" label="3 Reimbursements Due Today" onClick={() => setShowDuePayments(true)} />
        <StatusChip dotColor="bg-rose-500" label="2 Rejected Claims Need Resubmission" onClick={() => setShowRejectedResubmit(true)} />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpis.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="relative group bg-card border border-border rounded-3xl p-6 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${stat.color}-500/5 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.trend}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.val}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.desc}</p>
              <div className="mt-6 w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'amber' ? 'amber' : stat.color === 'sky' ? 'sky' : 'teal'}-500 transition-all duration-1000`}
                  style={{ width: i === 0 ? "85%" : i === 1 ? "30%" : i === 2 ? "75%" : "60%" }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filter Suite (EXACTLY LIKE IMAGE) ── */}
      <div className="space-y-4 mb-8">
        {/* Search Input Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search expenses by employee name, claim ID or department..."
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full pl-14 pr-6 py-4 text-[15px] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-7 py-4 rounded-full font-bold text-[15px] bg-[#10B981] text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Advanced Filter Row (The Rounded White Bar) */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[24px] shadow-sm p-4 flex flex-wrap items-center gap-8"
            >
              <FilterPill
                icon={<MapPin size={18} />}
                label="Department"
                options={["Engineering", "Sales", "HR", "Marketing"]}
                value={selectedDept}
                onSelect={setSelectedDept}
              />
              <FilterPill
                icon={<Briefcase size={18} />}
                label="Category"
                options={categories}
                value={selectedCategory}
                onSelect={setSelectedCategory}
              />
              <FilterPill
                icon={<CreditCard size={18} />}
                label="Status"
                options={["Pending", "Approved", "Rejected"]}
                value={activeTab}
                onSelect={setActiveTab}
              />

              <FilterPill
                icon={<Calendar size={18} />}
                label="Date Range"
                options={["Today", "Last 7 Days", "Last 30 Days", "This Month", "This Year"]}
                value={selectedDateRange}
                onSelect={setSelectedDateRange}
              />

              <div className="flex items-center gap-6 ml-auto">
                <div className="w-[1px] h-8 bg-slate-200 dark:bg-zinc-800" />
                <button
                  onClick={() => {
                    setSelectedDept("All");
                    setSelectedCategory("All");
                    setSelectedDateRange("All");
                    setActiveTab("All");
                    setSearchQuery("");
                  }}
                  className="px-2 py-2 text-[11px] font-black text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-2 uppercase tracking-widest"
                >
                  <RotateCcw size={14} />
                  RESET
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
                  onClick={() => toast.success("Downloading report...")}
                >
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Table Card ── */}
      <div className="bg-card border border-border rounded-[32px] shadow-xl mb-10 relative">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-foreground">Expense Claims</h2>
            <p className="text-xs font-bold text-muted-foreground mt-1">Manage reimbursements, receipts, and payouts effortlessly.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={settingsMenuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className={`p-2.5 rounded-xl border transition-all ${showSettingsMenu ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-border text-muted-foreground hover:bg-muted/50'}`}
              >
                <Settings size={18} />
              </button>
              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Table Preferences</p>
                    </div>
                    <ActionItem icon={<Layers size={14} />} label="Column Visibility" onClick={() => { setShowColumnModal(true); setShowSettingsMenu(false); }} />
                    <ActionItem icon={<RotateCcw size={14} />} label="Reset Table View" onClick={() => { setVisibleColumns({ details: true, category: true, date: true, amount: true, receipt: true, approval: true, reimbursement: true }); toast.success("Table view reset"); setShowSettingsMenu(false); }} />
                    <div className="border-t border-border my-1" />
                    <ActionItem icon={<ShieldCheck size={14} />} label="Audit Settings" onClick={() => { toast.info("Navigating to Audit Logs..."); setTimeout(() => navigate("/settings?tab=audit_logs"), 500); setShowSettingsMenu(false); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`p-2.5 rounded-xl border transition-all ${showShareMenu ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-border text-muted-foreground hover:bg-muted/50'}`}
              >
                <Share2 size={18} />
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share Expense Report</p>
                    </div>
                    <ActionItem icon={<Briefcase size={14} />} label="Share with Manager" onClick={() => { setShowManagerShare(true); setShowShareMenu(false); }} />
                    <ActionItem icon={<ShieldCheck size={14} />} label="Share with Finance" onClick={() => { setShowFinanceShare(true); setShowShareMenu(false); }} />
                    <div className="border-t border-border my-1" />
                    <ActionItem icon={<Check size={14} />} label="Copy Report Link" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard!"); setShowShareMenu(false); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 bg-muted/30">
                {visibleColumns.details && <th className="px-8 py-5">Employee Details</th>}
                {visibleColumns.category && <th className="px-4 py-5">Category</th>}
                {visibleColumns.date && <th className="px-4 py-5">Date</th>}
                {visibleColumns.amount && <th className="px-4 py-5">Amount</th>}
                {visibleColumns.receipt && <th className="px-4 py-5">Receipt</th>}
                {visibleColumns.approval && <th className="px-4 py-5">Approval</th>}
                {visibleColumns.reimbursement && <th className="px-4 py-5">Reimbursement</th>}
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClaims.map((claim, index) => (
                <tr
                  key={claim.id}
                  className="group hover:bg-emerald-500/[0.02] transition-all cursor-pointer"
                  onClick={() => setViewClaim(claim)}
                >
                  {visibleColumns.details && (
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          {claim.employee.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground leading-none mb-1">{claim.employee.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-tight">{claim.employee.dept} • {claim.id}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.category && (
                    <td className="px-4 py-5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-sm">{claim.catIcon}</span>
                        {claim.category}
                      </span>
                    </td>
                  )}
                  {visibleColumns.date && <td className="px-4 py-5 text-xs font-bold text-muted-foreground">{claim.date}</td>}
                  {visibleColumns.amount && (
                    <td className="px-4 py-5">
                      <p className="text-sm font-black text-foreground">{formatCurrency(claim.amount)}</p>
                    </td>
                  )}
                  {visibleColumns.receipt && (
                    <td className="px-4 py-5">
                      <button className="flex items-center gap-1 text-[11px] font-black text-emerald-500 hover:underline uppercase tracking-wider" onClick={e => { e.stopPropagation(); setReceiptToView(claim); }}>
                        <FileText size={14} /> View
                      </button>
                    </td>
                  )}
                  {visibleColumns.approval && (
                    <td className="px-4 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${claim.approvalStatus === 'Pending' ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' :
                        claim.approvalStatus === 'Approved' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' :
                          'bg-rose-500/5 text-rose-600 border-rose-500/10'
                        }`}>
                        {claim.approvalStatus}
                      </span>
                    </td>
                  )}
                  {visibleColumns.reimbursement && (
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${claim.reimbursementStatus === 'Paid' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[11px] font-bold text-muted-foreground">{claim.reimbursementStatus}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setViewClaim(claim)} className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-emerald-500 transition-all" title="Quick View">
                        <Eye size={16} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setActiveActionId(claim.id === activeActionId ? null : claim.id)}
                          className={`p-2 rounded-xl border transition-all ${activeActionId === claim.id ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'border-border text-muted-foreground hover:bg-muted/50'}`}
                        >
                          <MoreVertical size={16} />
                        </button>
                        <AnimatePresence>
                          {activeActionId === claim.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: index >= filteredClaims.length - 2 ? 10 : -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: index >= filteredClaims.length - 2 ? 10 : -10 }}
                              className={`absolute ${index >= filteredClaims.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 bg-card border border-border rounded-2xl shadow-2xl z-[60] py-2 overflow-hidden`}
                            >
                              <ActionItem icon={<Check size={14} />} label="Approve Claim" onClick={() => { setSelectedClaim(claim); setShowApproveModal(true); setActiveActionId(null); }} />
                              <ActionItem icon={<Ban size={14} />} label="Reject Claim" danger onClick={() => { setSelectedClaim(claim); setShowRejectModal(true); setActiveActionId(null); }} />
                              <div className="border-t border-border my-1" />
                              <ActionItem icon={<Banknote size={14} />} label="Mark as Paid" onClick={() => { setSelectedClaim(claim); setShowPaidModal(true); setActiveActionId(null); }} />
                              <ActionItem icon={<Edit3 size={14} />} label="Edit Details" onClick={() => { setEditingClaim(claim); setIsEditing(true); setShowAddModal(true); setActiveActionId(null); }} />
                              <ActionItem icon={<Download size={14} />} label="Download Info" onClick={() => { toast.success(`Downloading report for ${claim.id}...`); setActiveActionId(null); }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Workflow Modal ── */}
      <AnimatePresence>
        {showWorkflowModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWorkflowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xl bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Reimbursement Workflow</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enterprise Approval Pipeline</p>
                  </div>
                </div>
                <button onClick={() => setShowWorkflowModal(false)} className="p-2 rounded-xl hover:bg-muted"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <WorkflowBlock title="Submission" status="Automated" desc="Employee submits receipt via Self-Service portal." completed />
                <WorkflowBlock title="Department Review" status="Manager Action" desc="Direct reporting manager validates and approves spend." active />
                <WorkflowBlock title="Finance Audit" status="Accounting" desc="Finance team checks policy compliance and tax deductions." />
                <WorkflowBlock title="Payout" status="Final Step" desc="Funds are transferred via automated payroll batch." />
              </div>

              <button onClick={() => setShowWorkflowModal(false)} className="mt-8 w-full py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Close Pipeline View</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add/Edit Expense Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingClaim(null); }} className="absolute inset-0 bg-black/40 " />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-emerald-500/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Receipt size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">{isEditing ? "Edit Expense" : "Submit Expense"}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{isEditing ? `Modifying ${editingClaim?.id}` : "Employee Reimbursement Portal"}</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingClaim(null); }} className="p-2 rounded-xl hover:bg-muted text-muted-foreground"><X size={24} /></button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category*</label><select defaultValue={editingClaim?.category} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 outline-none font-bold">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Claim Date*</label><input type="date" defaultValue={editingClaim?.date} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 outline-none font-bold" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (₹)*</label><input type="number" defaultValue={editingClaim?.amount} placeholder="0.00" className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 outline-none font-bold" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Mode</label><select defaultValue={editingClaim?.paymentMode} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 outline-none font-bold"><option>Personal Card</option><option>Corporate Card</option><option>Cash</option></select></div>
                <div className="col-span-2 space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label><textarea rows={3} defaultValue={editingClaim?.description} placeholder="Provide details for faster approval..." className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 outline-none font-medium" /></div>
                <div className="col-span-2 border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.02] rounded-3xl p-8 text-center group hover:border-emerald-500/40 transition-all cursor-pointer"><Upload size={32} className="mx-auto mb-2 text-emerald-500 opacity-40" /><p className="text-sm font-black text-foreground">Click to upload receipt</p><p className="text-[10px] font-bold text-muted-foreground mt-1 tracking-tight">PDF, JPG, PNG up to 10MB</p></div>
              </div>

              <div className="p-8 border-t border-border bg-muted/20 flex gap-4">
                <button onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingClaim(null); }} className="flex-1 py-3 text-sm font-black text-muted-foreground hover:bg-muted rounded-2xl transition-all">Cancel</button>
                <button onClick={() => { toast.success(isEditing ? "Claim Updated Successfully!" : "Claim Submitted Successfully!"); setShowAddModal(false); setIsEditing(false); setEditingClaim(null); }} className="flex-[2] py-3 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-all shadow-xl shadow-emerald-500/30">{isEditing ? "Update Claim" : "Submit Claim"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── View Claim Drawer ── */}
      <AnimatePresence>
        {viewClaim && (
          <div className="fixed inset-0 z-[4000] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewClaim(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-[500px] h-full bg-card border-l border-border shadow-2xl flex flex-col">
              <div className="p-8 border-b border-border flex items-center justify-between bg-emerald-500/[0.02]">
                <div>
                  <h3 className="text-xl font-black text-foreground">Claim Details</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{viewClaim.id}</p>
                </div>
                <button onClick={() => setViewClaim(null)} className="p-2 rounded-xl hover:bg-muted text-slate-400"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-border">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">{viewClaim.employee.avatar}</div>
                  <div>
                    <h4 className="text-base font-black text-foreground">{viewClaim.employee.name}</h4>
                    <p className="text-xs font-bold text-muted-foreground">{viewClaim.employee.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/10">{viewClaim.employee.dept}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <DetailItem label="Category" val={viewClaim.category} icon={viewClaim.catIcon} />
                  <DetailItem label="Claim Date" val={viewClaim.date} />
                  <DetailItem label="Payment Mode" val={viewClaim.paymentMode} />
                  <DetailItem label="Status" val={viewClaim.approvalStatus} isStatus />
                </div>

                <div className="p-6 rounded-[28px] bg-slate-900 dark:bg-emerald-600 text-white shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Payout Amount</span>
                  <p className="text-3xl font-black mt-1">{formatCurrency(viewClaim.amount)}</p>
                </div>

                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label><p className="text-sm font-bold text-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl">{viewClaim.description}</p></div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Receipt Preview</label>
                  <div className="relative group rounded-3xl overflow-hidden border border-border shadow-lg h-48 bg-muted">
                    <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=600" alt="Receipt" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><button className="px-4 py-2 bg-white text-slate-900 text-[11px] font-black rounded-xl shadow-xl flex items-center gap-2"><Download size={14} /> Full Receipt</button></div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border bg-muted/20 flex gap-3">
                <button className="flex-1 py-3 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20" onClick={() => { toast.success("Approved Successfully"); setViewClaim(null); }}>Approve</button>
                <button className="flex-1 py-3 text-sm font-black text-rose-600 bg-white dark:bg-zinc-900 border border-border rounded-2xl hover:bg-rose-50" onClick={() => { toast.error("Rejected Successfully"); setViewClaim(null); }}>Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Share with Manager Modal ── */}
      <AnimatePresence>
        {showManagerShare && (
          <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManagerShare(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Share with Manager</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Approval Request Workflow</p>
                  </div>
                </div>
                <button onClick={() => setShowManagerShare(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Manager</label>
                  <select className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none">
                    <option>Robert Fox (Head of Eng)</option>
                    <option>Jane Cooper (Sales Lead)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Note</label>
                  <textarea rows={2} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-medium outline-none" placeholder="Explain the urgency..." />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20">
                  <span className="text-xs font-black">Priority Level</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-border text-[10px] font-black rounded-lg">Normal</button>
                    <button className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-emerald-500/20">Urgent</button>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 flex items-center justify-center bg-emerald-500 text-white">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-foreground">Attach Receipt automatically</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center"></div>
                    <span className="text-xs font-bold text-muted-foreground">Notify manager by email</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowManagerShare(false)} className="flex-1 py-3 text-sm font-black text-muted-foreground bg-muted hover:bg-slate-200 rounded-2xl transition-all">Cancel</button>
                <button onClick={() => { toast.success("Sent to Manager successfully"); setShowManagerShare(false); }} className="flex-[2] py-3 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20">Send for Approval</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Share with Finance Modal ── */}
      <AnimatePresence>
        {showFinanceShare && (
          <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFinanceShare(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Share with Finance</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Audit & Disbursement Review</p>
                  </div>
                </div>
                <button onClick={() => setShowFinanceShare(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finance Approver</label>
                    <select className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none"><option>Finance Team A</option></select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cost Center</label>
                    <select className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none"><option>Engineering (ENG-01)</option></select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reimbursement Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Bank Transfer", "Payroll", "Cash"].map(m => (
                      <button key={m} className={`py-2 text-[9px] font-black uppercase rounded-xl border ${m === 'Bank Transfer' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-muted border-border text-muted-foreground'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finance Note</label>
                  <textarea rows={2} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-medium outline-none" placeholder="Internal finance instructions..." />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowFinanceShare(false)} className="flex-1 py-3 text-sm font-black text-muted-foreground bg-muted hover:bg-slate-200 rounded-2xl transition-all">Cancel</button>
                <button onClick={() => { toast.success("Sent to Finance successfully"); setShowFinanceShare(false); }} className="flex-[2] py-3 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20">Send to Finance</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Approve Confirmation Modal ── */}
      <AnimatePresence>
        {showApproveModal && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApproveModal(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-card border border-border rounded-[32px] shadow-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowApproveModal(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-foreground">Approve Claim?</h3>
              <p className="text-sm font-medium text-muted-foreground mt-2 mb-8 px-4">You are about to approve the expense of <span className="text-foreground font-black">{formatCurrency(selectedClaim?.amount || 0)}</span> for {selectedClaim?.employee.name}.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3 text-sm font-black text-muted-foreground bg-muted rounded-2xl transition-all">Cancel</button>
                <button onClick={() => { toast.success("Claim Approved successfully"); setShowApproveModal(false); }} className="flex-[2] py-3 text-sm font-black text-white bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20">Confirm Approve</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Reject Modal ── */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-foreground">Reject Claim</h3>
                <button onClick={() => setShowRejectModal(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-6 tracking-tight">Please provide a reason for rejecting this claim. This will be visible to the employee.</p>
              <div className="space-y-1.5 mb-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reason for Rejection*</label>
                <textarea rows={3} required className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-medium outline-none focus:border-rose-500 transition-colors" placeholder="e.g. Missing valid tax invoice, category mismatch..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 text-sm font-black text-muted-foreground bg-muted rounded-2xl">Cancel</button>
                <button onClick={() => { toast.error("Claim Rejected successfully"); setShowRejectModal(false); }} className="flex-[2] py-3 text-sm font-black text-white bg-rose-500 rounded-2xl shadow-xl shadow-rose-500/20">Reject Claim</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mark as Paid Modal ── */}
      <AnimatePresence>
        {showPaidModal && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaidModal(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                    <Banknote size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Mark as Reimbursed?</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Disbursement Confirmation</p>
                  </div>
                </div>
                <button onClick={() => setShowPaidModal(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</label>
                    <select className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none">
                      <option>Bank Transfer</option>
                      <option>Payroll</option>
                      <option>UPI</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference Number</label>
                  <input type="text" placeholder="e.g. TXN982347239" className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-bold outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowPaidModal(false)} className="flex-1 py-3 text-sm font-black text-muted-foreground bg-muted rounded-2xl">Cancel</button>
                <button onClick={() => { toast.success("Marked as Reimbursed successfully"); setShowPaidModal(false); }} className="flex-[2] py-3 text-sm font-black text-white bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20">Confirm Payment</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── View Claim Drawer ── */}
      <AnimatePresence>
        {viewClaim && (
          <div className="fixed inset-0 z-[4000] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewClaim(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-[500px] h-full bg-card border-l border-border shadow-2xl flex flex-col">
              <div className="p-8 border-b border-border flex items-center justify-between bg-emerald-500/[0.02]">
                <div>
                  <h3 className="text-xl font-black text-foreground">Claim Details</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{viewClaim.id}</p>
                </div>
                <button onClick={() => setViewClaim(null)} className="p-2 rounded-xl hover:bg-muted text-slate-400"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-border">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">{viewClaim.employee.avatar}</div>
                  <div>
                    <h4 className="text-base font-black text-foreground">{viewClaim.employee.name}</h4>
                    <p className="text-xs font-bold text-muted-foreground">{viewClaim.employee.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/10">{viewClaim.employee.dept}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <DetailItem label="Category" val={viewClaim.category} icon={viewClaim.catIcon} />
                  <DetailItem label="Claim Date" val={viewClaim.date} />
                  <DetailItem label="Payment Mode" val={viewClaim.paymentMode} />
                  <DetailItem label="Status" val={viewClaim.approvalStatus} isStatus />
                </div>

                <div className="p-6 rounded-[28px] bg-slate-900 dark:bg-emerald-600 text-white shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Payout Amount</span>
                  <p className="text-3xl font-black mt-1">{formatCurrency(viewClaim.amount)}</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timeline Tracker</label>
                  <div className="space-y-4">
                    <WorkflowBlock title="Submitted" status="Completed" desc={`Expense claim initiated on ${viewClaim.date}`} completed />
                    <WorkflowBlock title="Shared with Manager" status="Action Done" desc="Sent to Robert Fox for initial validation." completed />
                    <WorkflowBlock title="Manager Approved" status="In Progress" desc="Pending final manager digital signature." active />
                    <WorkflowBlock title="Sent to Finance" status="Waiting" desc="Awaiting tax compliance audit." />
                    <WorkflowBlock title="Paid" status="Final Step" desc="Fund transfer via automated payroll batch." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Comments</label>
                  <div className="bg-muted/30 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-foreground leading-relaxed">"The Uber receipt matches the client meeting schedule in Outlook."</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">— System Audit • 10:20 AM</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Receipt Preview</label>
                  <div className="relative group rounded-3xl overflow-hidden border border-border shadow-lg h-48 bg-muted">
                    <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=600" alt="Receipt" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={(e) => { e.stopPropagation(); setReceiptToView(viewClaim); }} className="px-4 py-2 bg-white text-slate-900 text-[11px] font-black rounded-xl shadow-xl flex items-center gap-2">
                        <Eye size={14} /> Full Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border bg-muted/20 flex gap-3">
                <button className="flex-1 py-3 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20" onClick={() => { setSelectedClaim(viewClaim); setShowApproveModal(true); }}>Approve</button>
                <button className="flex-1 py-3 text-sm font-black text-rose-600 bg-white dark:bg-zinc-900 border border-border rounded-2xl hover:bg-rose-50" onClick={() => { setSelectedClaim(viewClaim); setShowRejectModal(true); }}>Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Column Visibility Modal ── */}
      <AnimatePresence>
        {showColumnModal && (
          <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowColumnModal(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-foreground">Column Visibility</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Customize Table View</p>
                </div>
                <button onClick={() => setShowColumnModal(false)} className="p-3 rounded-2xl bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(visibleColumns).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20 cursor-pointer hover:bg-emerald-500/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${val ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-300'}`}>
                        {val && <Check size={12} strokeWidth={4} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={val}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    />
                  </label>
                ))}
              </div>
              <button onClick={() => setShowColumnModal(false)} className="mt-8 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Save Preferences</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Receipt Viewer Modal ── */}
      <AnimatePresence>
        {receiptToView && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReceiptToView(null)} className="absolute inset-0 bg-black/80" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl h-[85vh] bg-card border border-border rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-10 py-6 border-b border-border flex items-center justify-between bg-emerald-500/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Receipt Viewer</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{receiptToView.id} • {receiptToView.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-2xl border border-border text-muted-foreground hover:bg-muted transition-all" onClick={() => toast.success("Downloading receipt...")}>
                    <Download size={20} />
                  </button>
                  <button onClick={() => setReceiptToView(null)} className="p-3 rounded-2xl bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-10 overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border shadow-2xl bg-white dark:bg-zinc-900 group">
                  <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200" alt="Receipt Full" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-foreground">Verified Receipt Image</p>
                        <p className="text-[10px] font-bold text-muted-foreground">Uploaded by {receiptToView.employee.name} on {receiptToView.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">Valid Doc</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border bg-muted/20 flex justify-center">
                <p className="text-[11px] font-bold text-muted-foreground italic flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  NexusHR Security: This document is encrypted and stored securely.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Pending Approvals Modal ── */}
      <WorkflowModal
        isOpen={showPendingApprovals}
        onClose={() => setShowPendingApprovals(false)}
        title="Pending Expense Approvals"
      >
        <div className="space-y-4">
          {[
            { id: "SC", name: "Sarah Chen", date: "2026-04-24", cat: "Travel", amount: 18450 },
            { id: "JW", name: "James Wilson", date: "2026-04-23", cat: "Food", amount: 5280 },
            { id: "MR", name: "Michael Ross", date: "2026-04-22", cat: "Fuel", amount: 3500 },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-3xl border border-border bg-muted/20 flex items-center justify-between group hover:bg-emerald-500/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-500/10">{item.id}</div>
                <div>
                  <p className="text-sm font-black text-foreground">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">{item.date} • {item.cat}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-sm font-black text-foreground">{formatCurrency(item.amount)}</p>
                <div className="flex gap-2">
                  <button onClick={() => toast.success("Approved Successfully")} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"><Check size={14} /></button>
                  <button onClick={() => toast.error("Rejected Successfully")} className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all"><X size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WorkflowModal>

      {/* ── Manager Review Queue Modal ── */}
      <WorkflowModal
        isOpen={showManagerQueue}
        onClose={() => setShowManagerQueue(false)}
        title="Manager Review Queue"
      >
        <div className="space-y-6">
          {[1, 2].map((_, i) => (
            <div key={i} className="p-6 rounded-[32px] border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-foreground">Client Meeting Travel</h4>
                  <p className="text-lg font-black text-emerald-600 mt-1">₹2,450</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/10">High Priority</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Manager Comment</label>
                <textarea className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-muted/30 font-medium outline-none h-20" placeholder="Add a comment..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success("Approved")} className="flex-1 py-2.5 text-[11px] font-black text-white bg-emerald-500 rounded-xl">Approve</button>
                <button onClick={() => toast.error("Rejected")} className="flex-1 py-2.5 text-[11px] font-black text-rose-600 bg-rose-500/5 rounded-xl">Reject</button>
                <button onClick={() => toast.info("Returned to employee")} className="flex-1 py-2.5 text-[11px] font-black text-muted-foreground bg-muted rounded-xl">Return</button>
              </div>
            </div>
          ))}
        </div>
      </WorkflowModal>

      {/* ── Due Payments Modal ── */}
      <WorkflowModal
        isOpen={showDuePayments}
        onClose={() => setShowDuePayments(false)}
        title="Due Reimbursements Today"
      >
        <div className="space-y-4">
          {[
            { id: "JW", name: "James Wilson", method: "Cash", amount: 5280 },
            { id: "EB", name: "Emily Blunt", method: "Corporate Card", amount: 12500 },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-[28px] border border-border bg-muted/20 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl">{item.id}</div>
                <div>
                  <p className="text-sm font-black text-foreground">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{item.method} • <span className="text-emerald-500">Approved</span></p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <p className="text-base font-black text-foreground">{formatCurrency(item.amount)}</p>
                <button onClick={() => toast.success("Marked as Paid")} className="px-5 py-2.5 bg-white text-slate-900 border border-border text-[11px] font-black rounded-xl shadow-lg hover:bg-slate-50 transition-all">Mark as Paid</button>
              </div>
            </div>
          ))}
        </div>
      </WorkflowModal>

      {/* ── Rejected Claims Modal ── */}
      <WorkflowModal
        isOpen={showRejectedResubmit}
        onClose={() => setShowRejectedResubmit(false)}
        title="Rejected Claims"
      >
        <div className="space-y-6">
          {[
            { title: "Internet Bill Claim", amount: 1200, reason: "Missing official GST invoice. Digital receipt not accepted." },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-[32px] border-2 border-rose-500/10 bg-card shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-foreground">{item.title}</h4>
                <p className="text-lg font-black text-rose-600">₹{item.amount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-1">Reason for rejection</p>
                <p className="text-xs font-bold text-rose-700 leading-relaxed">{item.reason}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toast.success("Resubmitted")} className="flex-1 py-3 text-[11px] font-black text-white bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">Resubmit</button>
                <button onClick={() => { setShowRejectedResubmit(false); setShowAddModal(true); setIsEditing(true); }} className="flex-1 py-3 text-[11px] font-black text-muted-foreground bg-muted rounded-xl">Edit Claim</button>
              </div>
            </div>
          ))}
        </div>
      </WorkflowModal>

      {/* ── Analytics (Charts) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div><h3 className="text-lg font-black text-foreground">Monthly Trend</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Operational Spend Analytics</p></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 text-emerald-600 text-xs font-black"><TrendingUp size={14} /> +14.2%</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-xl">
          <h3 className="text-lg font-black text-foreground mb-6">Spend Distribution</h3>
          <div className="h-[200px] w-full relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={categoryData} innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">{categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</span><span className="text-2xl font-black text-foreground">₹1.32L</span></div>
          </div>
          <div className="space-y-3">{categoryData.slice(0, 3).map(cat => (<div key={cat.name} className="flex items-center justify-between text-xs font-bold"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-muted-foreground">{cat.name}</span></div><span className="text-foreground font-black">{formatCurrency(cat.value)}</span></div>))}</div>
        </div>
      </div>
    </div>
  );

  function ExportItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
      <button onClick={onClick} className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
        {icon} {label}
      </button>
    );
  }

  function ActionItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
    return (
      <button onClick={onClick} className={`w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold transition-colors ${danger ? 'text-rose-600 hover:bg-rose-500/10' : 'text-foreground hover:bg-emerald-500/10 hover:text-emerald-600'}`}>
        {icon} {label}
      </button>
    );
  }

  function WorkflowBlock({ title, status, desc, completed, active }: { title: string; status: string; desc: string; completed?: boolean; active?: boolean }) {
    return (
      <div className="flex gap-4 relative">
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${completed ? 'bg-emerald-500 border-emerald-500' : active ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/20' : 'bg-white border-slate-300'}`} />
          <div className="w-0.5 h-full bg-slate-100 dark:bg-white/5 mt-1" />
        </div>
        <div className="-mt-1 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-black ${completed || active ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</p>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${completed ? 'bg-emerald-500/10 text-emerald-600' : active ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'}`}>{status}</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    );
  }

  function WorkflowModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-[40px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-emerald-500/[0.02]">
                <h3 className="text-xl font-black text-foreground">{title}</h3>
                <button onClick={onClose} className="p-2.5 rounded-2xl bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {children}
              </div>
              <div className="p-6 border-t border-border bg-muted/20">
                <button onClick={onClose} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  function StatusChip({ dotColor, label, onClick }: { dotColor: string; label: string; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-white dark:bg-zinc-900 hover:border-emerald-500/40 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm group-hover:scale-125 transition-transform`} />
        <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{label}</span>
      </button>
    );
  }

  function DetailItem({ label, val, icon, isStatus }: { label: string; val: string; icon?: string; isStatus?: boolean }) {
    return (
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <div className="flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          <p className={`text-sm font-black ${isStatus ? (val === 'Approved' ? 'text-emerald-600' : val === 'Pending' ? 'text-amber-600' : 'text-rose-600') : 'text-slate-900 dark:text-white'}`}>
            {val}
          </p>
        </div>
      </div>
    );
  }
}

function FilterPill({ icon, label, options, value, onSelect }: { icon: React.ReactNode; label: string; options: string[]; value: string; onSelect: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-[13px] font-bold ${value !== "All"
          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600"
          : "bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 text-slate-700 dark:text-slate-200"
          }`}
      >
        {value}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden"
          >
            {["All", ...options].map(opt => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-xs transition-colors ${value === opt ? "bg-emerald-500/10 text-emerald-600 font-black" : "text-slate-600 dark:text-slate-400 hover:bg-muted"}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
