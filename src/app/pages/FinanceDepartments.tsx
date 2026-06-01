import { useState } from "react";
import {
  Building2,
  Download,
  Lock,
  Search,
  LayoutGrid,
  List,
  IndianRupee,
  PieChart,
  Users,
  AlertTriangle,
  ChevronRight,
  X,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  head: string;
  growth: string;
  budgetAmount: string;
  budgetUsedPct: number;
  budgetUsedAmount: string;
  employees: number;
  status: "green" | "amber" | "red";
  nearLimit?: boolean;
}

const DEPARTMENTS: Department[] = [
  {
    id: "d1",
    name: "Engineering",
    head: "Suresh Iyer",
    growth: "+18",
    budgetAmount: "₹1.2Cr",
    budgetUsedPct: 72,
    budgetUsedAmount: "₹86.4L",
    employees: 820,
    status: "green",
  },
  {
    id: "d2",
    name: "Sales",
    head: "Rajesh Kumar",
    growth: "+5",
    budgetAmount: "₹85L",
    budgetUsedPct: 81,
    budgetUsedAmount: "₹68.8L",
    employees: 540,
    status: "amber",
  },
  {
    id: "d3",
    name: "Marketing",
    head: "Priya Singh",
    growth: "+2",
    budgetAmount: "₹60L",
    budgetUsedPct: 65,
    budgetUsedAmount: "₹39L",
    employees: 310,
    status: "green",
  },
  {
    id: "d4",
    name: "HR",
    head: "Anita Desai",
    growth: "+1",
    budgetAmount: "₹40L",
    budgetUsedPct: 58,
    budgetUsedAmount: "₹23.2L",
    employees: 180,
    status: "green",
  },
  {
    id: "d5",
    name: "Finance",
    head: "Vikram Mehta",
    growth: "+3",
    budgetAmount: "₹55L",
    budgetUsedPct: 91,
    budgetUsedAmount: "₹50.05L",
    employees: 240,
    status: "red",
    nearLimit: true,
  },
  {
    id: "d6",
    name: "Operations",
    head: "Sanjay Gupta",
    growth: "+8",
    budgetAmount: "₹95L",
    budgetUsedPct: 78,
    budgetUsedAmount: "₹74.1L",
    employees: 757,
    status: "amber",
  },
  {
    id: "d7",
    name: "Design",
    head: "Kavita Rao",
    growth: "+4",
    budgetAmount: "₹35L",
    budgetUsedPct: 60,
    budgetUsedAmount: "₹21L",
    employees: 150,
    status: "green",
  },
];

export function FinanceDepartments() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getStatusColor = (status: Department["status"]) => {
    switch (status) {
      case "green":
        return "#00B87C";
      case "amber":
        return "#F59E0B";
      case "red":
        return "#EF4444";
      default:
        return "#00B87C";
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-28 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent relative">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] dark:bg-[#00B87C]/20 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <Building2 size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[26px] font-black text-foreground leading-none">
                Departments
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[11px] font-bold border border-border">
                View Only
              </span>
            </div>
            <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
              Budget & cost data
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border text-foreground rounded-xl text-[13px] font-black transition-all shadow-sm">
          <Download size={16} className="text-muted-foreground" />
          Export Cost Report
        </button>
      </div>

      {/* ─── Access Notice Banner ────────────────────────────────── */}
      <div className="w-full bg-amber-500/10 rounded-[20px] border border-amber-500/20 px-6 py-4 flex items-start gap-3.5 dark:bg-amber-500/5">
        <Lock size={18} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] font-bold text-amber-700 dark:text-amber-500/90 leading-relaxed">
          <span className="font-black">You have view-only access to department data.</span> Showing budget and cost information relevant to Finance. Contact HR to modify department records.
        </p>
      </div>

      {/* ─── Global Budget Summary Bar ───────────────────────────── */}
      <div className="bg-card rounded-[24px] border border-border p-5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border shadow-sm">
        {[
          { label: "TOTAL DEPARTMENTS", value: "7", color: "text-[#111827] dark:text-white" },
          { label: "TOTAL HEADCOUNT", value: "2,847", color: "text-[#00B87C]" },
          { label: "TOTAL ANNUAL BUDGET", value: "₹4.35Cr", color: "text-[#8B5CF6]" },
          { label: "AVG BUDGET UTILIZATION", value: "74%", color: "text-[#F59E0B]" },
          { label: "OVER-BUDGET DEPTS", value: "1", color: "text-[#EF4444]" },
          { label: "PAYROLL THIS MONTH", value: "₹28.4L", color: "text-[#8B5CF6]" },
        ].map((stat, idx) => (
          <div key={idx} className="flex-1 px-4 py-3 md:py-0 text-center first:pl-2 last:pr-2 flex flex-col justify-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
              {stat.label}
            </p>
            <p className={`text-[22px] font-black leading-none ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Filter Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-[13px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] w-[260px] shadow-sm transition-colors"
            />
          </div>
          <select className="bg-card border border-border text-foreground text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#00B87C] shadow-sm cursor-pointer appearance-none pr-8 relative">
            <option>Sort: Budget</option>
            <option>Sort: Name</option>
            <option>Sort: Utilization</option>
          </select>
          <select className="bg-card border border-border text-foreground text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#00B87C] shadow-sm cursor-pointer appearance-none pr-8 relative">
            <option>Status: Active</option>
            <option>Status: All</option>
          </select>
        </div>
        <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-emerald-500/10 text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-emerald-500/10 text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* ─── Department Cards Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Top row: Icon and Growth */}
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] dark:bg-[#00B87C]/20 flex items-center justify-center border border-emerald-500/20">
                <Building2 size={20} className="text-[#00B87C]" />
              </div>
              <div className="px-2 py-1 rounded-md bg-[#DCFCE7] text-[#00B87C] text-[11px] font-black border border-[#00B87C]/20">
                {dept.growth}
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-[22px] font-black text-foreground mb-0.5">{dept.name}</h3>
              <p className="text-[13px] font-bold text-muted-foreground">Head: {dept.head}</p>
            </div>

            {/* Quick Stats (Finance Specific) */}
            <div className="flex items-center divide-x divide-border bg-secondary/50 rounded-xl border border-border p-3">
              <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <IndianRupee size={12} className="text-[#8B5CF6]" />
                  <span className="text-[14px] font-black text-[#8B5CF6] leading-none">{dept.budgetAmount}</span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">Annual Budget</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <PieChart size={12} className="text-[#F59E0B]" />
                  <span className="text-[14px] font-black text-[#F59E0B] leading-none">{dept.budgetUsedPct}%</span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">Budget Used</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-[#00B87C]" />
                  <span className="text-[14px] font-black text-[#00B87C] leading-none">{dept.employees}</span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">Employees</span>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dept.budgetUsedPct}%`, backgroundColor: getStatusColor(dept.status) }}
                />
              </div>
              <div className="flex items-center justify-between">
                {dept.nearLimit ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[10px] font-black border border-rose-500/20">
                    <AlertTriangle size={10} /> ⚠ Near limit
                  </div>
                ) : (
                  <div />
                )}
                <span className="text-[11px] font-bold text-muted-foreground">
                  {dept.budgetUsedAmount} used of {dept.budgetAmount}
                </span>
              </div>
            </div>

            {/* Expand chevron */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
              <div className="w-8 h-8 bg-card rounded-full shadow-md border border-border flex items-center justify-center">
                <ChevronRight size={18} className="text-[#00B87C]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Department Detail Side Panel ───────────────────────── */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedDept(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[400px] h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div>
                <h2 className="text-[20px] font-black text-foreground">
                  {selectedDept.name} — Details
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Departmental budget breakdown
                </p>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {/* Top 4 Mini Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Annual Budget</p>
                  <p className="text-[18px] font-black text-foreground">{selectedDept.budgetAmount}</p>
                </div>
                <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Budget Used</p>
                  <p className="text-[18px] font-black text-foreground">{selectedDept.budgetUsedAmount}</p>
                </div>
                <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Employees</p>
                  <p className="text-[18px] font-black text-foreground">{selectedDept.employees}</p>
                </div>
                <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Payroll Cost</p>
                  <p className="text-[18px] font-black text-[#8B5CF6]">₹12.4L/month</p>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Budget Breakdown
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Payroll", amount: "₹10.2L/month", pct: 85, color: "#00B87C" },
                    { label: "Training", amount: "₹8L/year", pct: 7, color: "#0EA5E9" },
                    { label: "Equipment", amount: "₹4.8L/year", pct: 4, color: "#8B5CF6" },
                    { label: "Operations", amount: "₹4.8L/year", pct: 4, color: "#F59E0B" },
                  ].map((cat, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[13px] font-bold">
                        <span className="text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground">
                          {cat.amount} <span className="font-black text-foreground text-[11px]">({cat.pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Headcount by Designation */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Headcount By Designation
                </p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    { title: "VP / Director", count: 3 },
                    { title: "Sr. Engineers", count: 120 },
                    { title: "Engineers", count: 480 },
                    { title: "Junior / Associate", count: 217 },
                  ].map((role, idx) => (
                    <li key={idx} className="flex items-center justify-between text-[13px] font-bold p-3 bg-card border border-border rounded-xl">
                      <span className="text-foreground">{role.title}</span>
                      <span className="text-[#00B87C] font-black px-2 py-0.5 rounded-md bg-emerald-500/10">{role.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Monthly Payroll Trend */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Monthly Payroll Trend
                </p>
                <div className="w-full h-[120px] bg-secondary/20 rounded-xl border border-border flex items-end overflow-hidden p-4 pt-8 relative">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-aspect-ratio-none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00B87C" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00B87C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q15,35 20,28 T40,25 T60,20 T80,18 T100,10 L100,40 L0,40 Z"
                      fill="url(#trendGrad)"
                    />
                    <path
                      d="M0,35 Q15,35 20,28 T40,25 T60,20 T80,18 T100,10"
                      fill="none"
                      stroke="#00B87C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="p-4 border-t border-border bg-amber-500/5">
              <p className="text-center text-[12px] font-bold text-amber-600 dark:text-amber-500">
                ⚠ No edit permissions — contact HR Manager to modify
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
