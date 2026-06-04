import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  RotateCcw, 
  ChevronDown, 
  Clock, 
  FileText, 
  Plus, 
  ChevronRight,
  BarChart as BarChartIcon,
  Settings,
  Database,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Package,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Laptop,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Smartphone,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Monitor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Printer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Wifi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Watch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Car,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IndianRupee,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AlertTriangle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingUp,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Search,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CheckCircle2,
  RefreshCw,
  Building2,
  Wrench,
  Activity,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─── Mock Data ─── */
const PAYROLL_TREND_DATA = [
  { month: "May", cost: 24.2 },
  { month: "Jun", cost: 25.1 },
  { month: "Jul", cost: 24.8 },
  { month: "Aug", cost: 26.3 },
  { month: "Sep", cost: 25.9 },
  { month: "Oct", cost: 27.4 },
  { month: "Nov", cost: 26.8 },
  { month: "Dec", cost: 28.1 },
  { month: "Jan", cost: 27.9 },
  { month: "Feb", cost: 28.5 },
  { month: "Mar", cost: 29.2 },
  { month: "Apr", cost: 28.4 }
];

const DEPT_DIST_DATA = [
  { name: "Engineering", value: 45, color: "#00B87C" },
  { name: "Sales", value: 20, color: "#8B5CF6" },
  { name: "Marketing", value: 15, color: "#3B82F6" },
  { name: "Operations", value: 12, color: "#F59E0B" },
  { name: "HR", value: 8, color: "#EF4444" }
];

const EXPENSE_CAT_DATA = [
  { name: "Travel", value: 12400 },
  { name: "Food", value: 8200 },
  { name: "Software", value: 15600 },
  { name: "Equipment", value: 4500 },
  { name: "Marketing", value: 9800 }
];

const SALARY_BAND_DATA = [
  { band: "0-5L", count: 240 },
  { band: "5-10L", count: 480 },
  { band: "10-15L", count: 320 },
  { band: "15-25L", count: 140 },
  { band: "25L+", count: 68 }
];

const YOY_GROWTH_DATA = [
  { month: "Jan", lastYear: 24.2, currentYear: 27.9 },
  { month: "Feb", lastYear: 24.5, currentYear: 28.5 },
  { month: "Mar", lastYear: 25.1, currentYear: 29.2 },
  { month: "Apr", lastYear: 24.8, currentYear: 28.4 }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ASSET_COST_BY_CATEGORY = [
  { id: "cat1", category: "Laptops", count: 142, totalValue: 18500000, annualDepreciation: 3700000, bookValue: 14800000, icon: "Laptop", status: "Active" },
  { id: "cat2", category: "Smartphones", count: 85, totalValue: 4250000, annualDepreciation: 850000, bookValue: 3400000, icon: "Smartphone", status: "Active" },
  { id: "cat3", category: "Monitors", count: 68, totalValue: 2040000, annualDepreciation: 340000, bookValue: 1700000, icon: "Monitor", status: "Active" },
  { id: "cat4", category: "Printers", count: 24, totalValue: 960000, annualDepreciation: 160000, bookValue: 800000, icon: "Printer", status: "Depreciating" },
  { id: "cat5", category: "Servers & Networking", count: 43, totalValue: 6200000, annualDepreciation: 1240000, bookValue: 4960000, icon: "Wifi", status: "Critical" },
  { id: "cat6", category: "Accessories", count: 120, totalValue: 1200000, annualDepreciation: 240000, bookValue: 960000, icon: "Watch", status: "Active" },
  { id: "cat7", category: "Vehicles", count: 12, totalValue: 7200000, annualDepreciation: 1200000, bookValue: 6000000, icon: "Car", status: "Depreciating" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEPT_ASSET_DIST_DATA = [
  { department: "Engineering", value: 35, color: "#00B87C" },
  { department: "Sales", value: 18, color: "#8B5CF6" },
  { department: "Operations", value: 15, color: "#F59E0B" },
  { department: "Marketing", value: 12, color: "#3B82F6" },
  { department: "Finance", value: 10, color: "#EC4899" },
  { department: "HR", value: 6, color: "#EF4444" },
  { department: "Legal", value: 4, color: "#14B8A6" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ASSET_VALUE_BY_DEPT = [
  { department: "Engineering", total: 85, depreciated: 32, current: 53 },
  { department: "Sales", total: 42, depreciated: 15, current: 27 },
  { department: "Operations", total: 35, depreciated: 14, current: 21 },
  { department: "Marketing", total: 28, depreciated: 9, current: 19 },
  { department: "Finance", total: 22, depreciated: 8, current: 14 },
  { department: "HR", total: 15, depreciated: 5, current: 10 },
  { department: "Legal", total: 10, depreciated: 3, current: 7 },
];

type ReportTab = "Dashboards" | "Payroll Reports" | "Expense Reports" | "Tax Reports" | "Asset Reports" | "Custom Builder";

export function FinanceReports() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ReportTab>(
    location.state?.activeTab || "Dashboards"
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const executeExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      let headers = "";
      let csvContent = "";
      
      if (activeTab === "Dashboards") {
        headers = "Month,Payroll Cost (L),Last Year (L)\n";
        csvContent = headers + YOY_GROWTH_DATA.map(d => `${d.month},${d.currentYear},${d.lastYear}`).join("\n");
      } else {
        headers = "Report Name,Category,Status\n";
        csvContent = headers + `Generated ${activeTab} Report,${activeTab},Ready\n`;
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `finance_${activeTab.toLowerCase().replace(" ", "_")}_report.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      setShowExportModal(false);
      showToast(`${activeTab} report exported successfully.`, "success");
    }, 1500);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#E0F2FE] dark:bg-sky-500/10 flex items-center justify-center shadow-inner border border-sky-100 dark:border-sky-500/20">
            <BarChart3 size={22} className="text-[#0EA5E9]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">Reports & Analytics</h1>
            <p className="text-[13px] text-[#6B7280]">Strategic financial insights and reporting suite</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download size={18} />
            Export Report
          </button>
          <button 
            onClick={() => showToast("Schedule Configured", "success", "Weekly report schedule has been activated.")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all"
          >
            <Calendar size={18} />
            Schedule
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* DATE FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="This Month" icon={Calendar} options={["This Month", "Last Month", "This Quarter", "This Year"]} />
          <FilterSelect label="All Departments" options={["All Departments", "Engineering", "Sales", "Marketing"]} />
          <FilterSelect label="All Pay Bands" options={["All Pay Bands", "Band A", "Band B", "Band C"]} />
          <button 
            onClick={() => showToast("Filters Reset", "success", "All dashboard filters cleared.")}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        <span className="text-[12px] font-bold text-muted-foreground italic">Data as of Apr 6, 2026</span>
      </div>

      {/* HEADLINE KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MiniKPICard title="Monthly Payroll" value="₹28.4L" color="purple" />
        <MiniKPICard title="Employees Paid" value="1,248" color="green" />
        <MiniKPICard title="Total Deductions" value="₹4.2L" color="red" />
        <MiniKPICard title="Net Disbursement" value="₹24.2L" color="green" />
        <MiniKPICard title="Pending Expenses" value="₹42.8K" color="amber" />
        <MiniKPICard title="YTD Cost" value="₹3.2Cr" color="gray" />
      </div>

      {/* TABS */}
      <div className="space-y-6">
        <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
          {["Dashboards", "Payroll Reports", "Expense Reports", "Tax Reports", "Asset Reports", "Custom Builder"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as ReportTab)}
                className={`px-6 py-4 text-[13px] font-semibold tracking-wider uppercase transition-all relative whitespace-nowrap ${
                  isActive ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabReport"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Dashboards" && <DashboardsTab />}
              {activeTab === "Payroll Reports" && <ReportCatalogTab section="PAYROLL REPORTS" type="payroll" />}
              {activeTab === "Expense Reports" && <ReportCatalogTab section="EXPENSE REPORTS" type="expense" />}
              {activeTab === "Tax Reports" && <ReportCatalogTab section="TAX REPORTS" type="tax" />}
              {activeTab === "Asset Reports" && <AssetReportsTab />}
              {activeTab === "Custom Builder" && <CustomBuilderTab onExport={() => setShowExportModal(true)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
                <h3 className="text-xl font-black text-foreground tracking-tight">Export {activeTab}</h3>
                <p className="text-[13px] text-muted-foreground mt-2 max-w-[280px]">
                  Generating a comprehensive CSV export for {activeTab}.
                </p>
                
                {isExporting && (
                  <div className="w-full mt-6 space-y-2 text-left">
                    <p className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest text-center">Processing Data...</p>
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
                  {isExporting ? 'Exporting...' : 'Download CSV'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TAB COMPONENTS ─── */

function DashboardsTab() {
  return (
    <div className="space-y-6">
      {/* Top Row: Payroll Cost & Dept Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[15px] font-black text-foreground tracking-tight uppercase">Payroll Cost Trend</h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Last 12 Months Financial Performance</p>
            </div>
            <div className="flex bg-muted/30 p-1 rounded-xl border border-border">
              <button className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-[#00B87C] text-white">1Y</button>
              <button className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg text-muted-foreground hover:text-foreground transition-all">6M</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PAYROLL_TREND_DATA}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "12px", color: "white" }}
                  itemStyle={{ color: "#8B5CF6", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="cost" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                <Bar dataKey="cost" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} opacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
          <div className="mb-8">
            <h3 className="text-[15px] font-black text-foreground tracking-tight uppercase">Dept Cost Distribution</h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Operational Spend Allocation</p>
          </div>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPT_DIST_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEPT_DIST_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "12px", color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total cost</span>
              <span className="text-xl font-black text-foreground tracking-tighter">₹28.4L</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {DEPT_DIST_DATA.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[12px] font-bold text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-[12px] font-black text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Expense by Category">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={EXPENSE_CAT_DATA}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={70} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Salary Band Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALARY_BAND_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="band" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payroll Growth YoY">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={YOY_GROWTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <Tooltip />
              <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: 'bold', paddingBottom: 10 }} />
              <Line type="monotone" dataKey="currentYear" name="FY 25-26" stroke="#00B87C" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lastYear" name="FY 24-25" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ReportCatalogTab({ section, type }: { section: string, type: 'payroll' | 'expense' | 'tax' }) {
  const reports = {
    payroll: [
      { name: "Monthly Payroll Summary", desc: "Detailed breakdown of current month costs", last: "2h ago" },
      { name: "Salary Register", desc: "Line-by-line employee payout details", last: "1d ago" },
      { name: "Department Cost Report", desc: "Operational spend per business unit", last: "Apr 1" },
      { name: "PF/ESI Contribution Report", desc: "Statutory compliance and filing data", last: "Mar 31" },
      { name: "TDS Calculation Sheet", desc: "Employee-wise tax deduction summary", last: "Apr 3" },
      { name: "Form 16 Generator", desc: "Bulk certificate generation for taxation", last: "Yly" },
      { name: "Gross to Net Summary", desc: "Analysis of deductions and net payouts", last: "Apr 5" },
      { name: "Bank Transfer File", desc: "Standardized format for direct deposits", last: "1h ago" },
      { name: "YTD Earnings Report", desc: "Consolidated earnings for financial year", last: "Apr 2" },
      { name: "Payroll Variance Report", desc: "MoM change analysis and alerts", last: "Apr 4" }
    ],
    expense: [
      { name: "Expense Summary", desc: "Consolidated expense claims overview", last: "3h ago" },
      { name: "By Category", desc: "Spend analysis by expense categories", last: "1d ago" },
      { name: "By Department", desc: "Departmental reimbursement tracking", last: "Apr 2" },
      { name: "By Employee", desc: "Top spenders and claim frequency", last: "Apr 3" },
      { name: "Pending Claims", desc: "Aging report for unapproved expenses", last: "Now" },
      { name: "Rejected Claims", desc: "Audit log of declined reimbursements", last: "1d ago" },
      { name: "Approval TAT Report", desc: "Turnaround time metrics for managers", last: "Wly" }
    ],
    tax: [
      { name: "TDS Worksheet", desc: "Estimated vs Actual tax calculation", last: "Apr 1" },
      { name: "Form 24Q", desc: "Quarterly TDS return preparation data", last: "Qly" },
      { name: "Challan Summary", desc: "Government payment reconciliation", last: "Mly" },
      { name: "Investment Declaration Summary", desc: "Employee proof submission status", last: "Daily" },
      { name: "Tax Projection Report", desc: "Future liability estimates per role", last: "Mly" }
    ]
  };

  const currentReports = reports[type];

  return (
    <div className="space-y-6">
      <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-4">{section}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentReports.map((report, i) => (
          <ReportCard key={i} {...report} />
        ))}
      </div>
    </div>
  );
}

function CustomBuilderTab({ onExport }: { onExport?: () => void }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      {/* Field Picker */}
      <div className="lg:w-[320px] bg-card border border-border rounded-[32px] p-6 shadow-sm flex flex-col">
        <h3 className="text-[14px] font-black text-foreground tracking-tight uppercase mb-6 flex items-center gap-2">
          <Database size={16} className="text-[#00B87C]" />
          Field Picker
        </h3>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <FieldGroup title="Dimensions" items={["Employee Name", "Department", "Location", "Band", "Joining Date"]} color="blue" />
          <FieldGroup title="Measures" items={["Basic", "Gross", "Net", "Deductions", "TDS", "PF"]} color="emerald" />
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 bg-card border border-border rounded-[32px] overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-xl border border-border">
            <button className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-card shadow-sm text-foreground">Table Preview</button>
            <button className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg text-muted-foreground hover:text-foreground transition-all">Chart Preview</button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => showToast("Report Generated", "success", "Custom report generated successfully.")}
              className="px-5 py-2 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
            >
              Generate
            </button>
            <button 
              onClick={() => showToast("Report Saved", "success", "Custom report saved to your catalog.")}
              className="px-4 py-2 rounded-xl border border-border text-foreground font-black text-[11px] uppercase tracking-widest hover:bg-muted transition-all"
            >
              Save Report
            </button>
            <button 
              onClick={() => onExport ? onExport() : showToast("Download Started", "info", "Downloading custom report data...")}
              className="p-2 rounded-xl border border-border text-foreground hover:bg-muted transition-all"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-12 bg-muted/10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-50">
              <BarChartIcon size={40} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-[15px] font-black text-foreground tracking-tight uppercase">Custom Builder Canvas</p>
              <p className="text-[12px] font-semibold text-muted-foreground mt-1">Select fields from the left to start building your report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ASSET REPORTS TAB ─── */

function AssetReportsTab() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const assetReports = [
    ...(user?.role === "Finance" ? [{
      name: "Asset Cost Report",
      desc: "Asset valuation, depreciation overview, and category-wise cost breakdown",
      icon: "BarChart3",
      color: "#8B5CF6",
      bgColor: "#EDE9FE",
      path: "/finance/asset-cost-report"
    }] : []),
    {
      name: "Asset Lifecycle Report",
      desc: "End-of-life tracking, replacement planning, and asset aging analysis",
      icon: "RefreshCw",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      path: "#"
    },
    {
      name: "Asset Utilization Report",
      desc: "Usage metrics, idle asset identification, and allocation efficiency",
      icon: "Activity",
      color: "#0EA5E9",
      bgColor: "#E0F2FE",
      path: "#"
    },
    {
      name: "Department Asset Summary",
      desc: "Department-wise asset count, value, and per-employee cost analysis",
      icon: "Building2",
      color: "#00B87C",
      bgColor: "#DCFCE7",
      path: "#"
    },
    {
      name: "Maintenance Cost Report",
      desc: "Repair history, vendor-wise spend, and maintenance cost trends",
      icon: "Wrench",
      color: "#EC4899",
      bgColor: "#FCE7F3",
      path: "#"
    },
    {
      name: "Compliance & Audit Report",
      desc: "Asset tagging status, verification records, and audit trail summary",
      icon: "ShieldCheck",
      color: "#14B8A6",
      bgColor: "#CCFBF1",
      path: "#"
    }
  ];

  const getIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case "BarChart3": return <BarChart3 size={size} />;
      case "RefreshCw": return <RefreshCw size={size} />;
      case "Activity": return <Activity size={size} />;
      case "Building2": return <Building2 size={size} />;
      case "Wrench": return <Wrench size={size} />;
      case "ShieldCheck": return <ShieldCheck size={size} />;
      default: return <FileText size={size} />;
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-4">ASSET REPORTS</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assetReports.map((report, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all flex flex-col h-full group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0"
                style={{ backgroundColor: report.bgColor, color: report.color, borderColor: `${report.color}30` }}
              >
                {getIcon(report.icon)}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => showToast("Schedule Created", "success", `Scheduled ${report.name}`)}
                  className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground"
                  title="Schedule"
                >
                  <Clock size={16} />
                </button>
                <button
                  onClick={() => showToast("Settings Opened", "info", `Settings for ${report.name}`)}
                  className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground"
                  title="Settings"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-bold text-foreground tracking-tight mb-1 group-hover:text-[#00B87C] transition-colors">{report.name}</h4>
              <p className="text-[12px] font-medium text-muted-foreground leading-relaxed line-clamp-2">{report.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  {i === 0 ? "Updated 2h ago" : i === 1 ? "Updated 1d ago" : `Last run: ${["Apr 2", "Mar 28", "Apr 5", "Apr 1", "Mar 30"][i - 2]}`}
                </span>
              </div>
              <button
                onClick={() => {
                  if (report.path !== "#") {
                    navigate(report.path);
                  } else {
                    showToast("Report Opening", "info", `Opening ${report.name}...`);
                  }
                }}
                className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                Generate <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function MiniKPICard({ title, value, color }: { title: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    purple: "text-[#8B5CF6]",
    green: "text-[#00B87C]",
    red: "text-rose-500",
    amber: "text-amber-500",
    gray: "text-slate-600"
  };

  return (
    <div className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-1">{title}</p>
      <h3 className={`text-lg font-black tracking-tighter ${colorMap[color] || "text-foreground"}`}>{value}</h3>
    </div>
  );
}

function FilterSelect({ label, icon: Icon, options = ["Option 1", "Option 2"] }: { label: string, icon?: React.ElementType, options?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2.5 px-4 py-2 bg-card border border-border rounded-xl text-[12px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm"
      >
        {Icon && <Icon size={14} className="text-muted-foreground" />}
        {selected}
        <ChevronDown size={14} className={`text-muted-foreground ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full min-w-[160px] bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); setSelected(opt); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[12px] font-bold hover:bg-muted transition-all ${selected === opt ? 'text-[#00B87C]' : 'text-foreground'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="p-6 bg-card border border-border rounded-[32px] shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[13px] font-black text-foreground tracking-tight uppercase">{title}</h3>
        <button className="p-1.5 hover:bg-muted rounded-lg transition-all text-muted-foreground">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function ReportCard({ name, desc, last }: { name: string, desc: string, last: string }) {
  const navigate = useNavigate();
  const handleGenerate = () => {
    if (name.includes("Payroll") || name.includes("Salary") || name.includes("Earnings")) {
      navigate("/payroll");
    } else if (name.includes("Expense") || name.includes("Claims")) {
      navigate("/expenses");
    } else if (name.includes("Department")) {
      navigate("/departments");
    } else {
      showToast("Report Generated", "success", `Generating ${name} report...`);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all flex flex-col h-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:bg-[#00B87C]/10 group-hover:border-[#00B87C]/20 transition-all">
          <FileText size={20} className="text-muted-foreground group-hover:text-[#00B87C]" />
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground" title="Schedule">
            <Clock size={16} />
          </button>
          <button className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground" title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-foreground tracking-tight mb-1 group-hover:text-[#00B87C] transition-colors">{name}</h4>
        <p className="text-[12px] font-medium text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Last run: {last}</span>
        </div>
        <button 
          onClick={handleGenerate}
          className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1 hover:underline"
        >
          Generate <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function FieldGroup({ title, items, color }: { title: string, items: string[], color: 'blue' | 'emerald' }) {
  const bg = color === 'blue' ? 'bg-sky-500/5 hover:bg-sky-500/10' : 'bg-emerald-500/5 hover:bg-emerald-500/10';
  const text = color === 'blue' ? 'text-sky-600' : 'text-emerald-600';
  const border = color === 'blue' ? 'border-sky-500/20' : 'border-emerald-500/20';

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`px-3 py-2.5 rounded-xl border ${border} ${bg} ${text} text-[12px] font-bold flex items-center justify-between cursor-grab active:cursor-grabbing transition-all hover:translate-x-1`}
          >
            {item}
            <Plus size={14} className="opacity-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
