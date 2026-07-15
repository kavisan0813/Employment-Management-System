import { useState } from "react";
import { useNavigate } from "react-router";
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
  TrendingUp,
  User,
} from "lucide-react";
import { showToast } from "../../../components/workflow/ToastNotification";

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
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Sort: Budget");
  const [statusFilter, setStatusFilter] = useState("Status: Active");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [genericModalTitle, setGenericModalTitle] = useState("");

  const filteredAndSortedDepts = DEPARTMENTS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.head.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "Status: All"
        ? true
        : statusFilter === "Status: Active"
          ? true
          : false;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "Sort: Budget") {
      const parseAmount = (s: string) =>
        s.includes("Cr")
          ? parseFloat(s.replace(/[^0-9.]/g, "")) * 10000000
          : parseFloat(s.replace(/[^0-9.]/g, "")) * 100000;
      return parseAmount(b.budgetAmount) - parseAmount(a.budgetAmount);
    }
    if (sortOption === "Sort: Name") return a.name.localeCompare(b.name);
    if (sortOption === "Sort: Utilization")
      return b.budgetUsedPct - a.budgetUsedPct;
    return 0;
  });

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
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] dark:bg-[#00B87C]/20 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <Building2 size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[26px] font-bold text-foreground leading-none">
                Departments
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[11px] font-bold border border-border">
                View Only
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280]">Budget & cost data</p>
          </div>
        </div>
        <button
          onClick={() =>
            showToast(
              "Exporting",
              "info",
              "Downloading Department Cost Report CSV",
            )
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border text-foreground rounded-xl text-[13px] font-black transition-all shadow-sm"
        >
          <Download size={16} className="text-muted-foreground" />
          Export Cost Report
        </button>
      </div>

      {/* ─── Access Notice Banner ────────────────────────────────── */}
      <div className="w-full bg-amber-500/10 rounded-[20px] border border-amber-500/20 px-6 py-4 flex items-start gap-3.5 dark:bg-amber-500/5">
        <Lock
          size={18}
          className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-[13px] font-bold text-amber-700 dark:text-amber-500/90 leading-relaxed">
          <span className="font-black">
            You have view-only access to department data.
          </span>{" "}
          Showing budget and cost information relevant to Finance. Contact HR to
          modify department records.
        </p>
      </div>

      {/* ─── ROW 1 — KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            icon: Building2,
            label: "DEPARTMENTS",
            value: "7",
            sub: "All active",
            color: "#64748B",
            bg: "rgba(100,116,139,0.1)",
          },
          {
            icon: Users,
            label: "HEADCOUNT",
            value: "2,847",
            sub: "+26 this month",
            color: "#00B87C",
            bg: "rgba(0,184,124,0.1)",
            onClick: () => navigate("/employees"),
          },
          {
            icon: IndianRupee,
            label: "ANNUAL BUDGET",
            value: "₹4.35Cr",
            sub: "FY 2026-27",
            color: "#8B5CF6",
            bg: "rgba(139,92,246,0.1)",
            onClick: () => setGenericModalTitle("Annual Budget Details"),
          },
          {
            icon: PieChart,
            label: "AVG UTILIZATION",
            value: "74%",
            sub: "Healthy range",
            color: "#F59E0B",
            bg: "rgba(245,158,11,0.1)",
            onClick: () => setGenericModalTitle("Average Utilization Details"),
          },
          {
            icon: AlertTriangle,
            label: "OVER-BUDGET",
            value: "1",
            sub: "Finance Dept",
            color: "#EF4444",
            bg: "rgba(239,68,68,0.1)",
          },
          {
            icon: IndianRupee,
            label: "MONTHLY PAYROLL",
            value: "₹28.4L",
            sub: "March 2026",
            color: "#8B5CF6",
            bg: "rgba(139,92,246,0.1)",
            onClick: () => navigate("/payroll"),
          },
        ].map((kpi, i) => (
          <div
            key={i}
            onClick={kpi.onClick}
            className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div
                className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: kpi.bg }}
              >
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 leading-tight">
                {kpi.label}
              </p>
              <p className="text-[24px] font-bold text-foreground mb-1 leading-none">
                {kpi.value}
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2 font-medium">
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Filter Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2.5 bg-background border border-border rounded-full text-[13px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] w-[260px] shadow-sm transition-colors"
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-background border border-border text-foreground text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#00B87C] shadow-sm cursor-pointer appearance-none pr-8 relative"
          >
            <option>Sort: Budget</option>
            <option>Sort: Name</option>
            <option>Sort: Utilization</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border text-foreground text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#00B87C] shadow-sm cursor-pointer appearance-none pr-8 relative"
          >
            <option>Status: Active</option>
            <option>Status: All</option>
          </select>
        </div>
        <div className="flex items-center p-1 bg-background border border-border rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-emerald-500/10 text-[#00B87C]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-emerald-500/10 text-[#00B87C]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* ─── Department Cards Grid / List View ─────────────────────────────── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative flex flex-col justify-between group"
            >
              {/* Status / Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${dept.status === "green" ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20" : dept.status === "amber" ? "bg-amber-50 text-amber-600 border-amber-500/20" : "bg-rose-50 text-rose-600 border-rose-500/20"}`}
                >
                  {dept.status === "green"
                    ? "Healthy"
                    : dept.status === "amber"
                      ? "Warning"
                      : "Critical"}
                </span>

                <div className="relative">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDept(dept);
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div
                onClick={() => setSelectedDept(dept)}
                className="cursor-pointer"
              >
                {/* Dept Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                    <Building2 size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {dept.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      {dept.id}
                    </p>
                  </div>
                </div>

                {/* Quick Stats (Finance Specific) */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center bg-neutral-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-border">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                      Employees
                    </span>
                    <span className="text-xs font-extrabold text-foreground">
                      {dept.employees}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 tracking-wider block">
                      Used %
                    </span>
                    <span className="text-xs font-extrabold text-[#F59E0B]">
                      {dept.budgetUsedPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 tracking-wider block">
                      Budget
                    </span>
                    <span className="text-xs font-extrabold text-[#8B5CF6]">
                      {dept.budgetAmount}
                    </span>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5">
                    <div className="flex items-center gap-1">
                      <span>Budget Used</span>
                      {dept.nearLimit && (
                        <span className="text-rose-500 flex items-center gap-1 bg-rose-500/10 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                          <AlertTriangle size={10} /> Near limit
                        </span>
                      )}
                    </div>
                    <span className="font-black text-foreground">
                      {dept.budgetUsedAmount} / {dept.budgetAmount}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.budgetUsedPct}%`,
                        backgroundColor: getStatusColor(dept.status),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <User size={14} className="text-slate-400" />
                  <span>{dept.head}</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[11px] font-bold">
                  <TrendingUp size={12} color="var(--primary)" />
                  <span style={{ color: "var(--primary)" }}>
                    {dept.growth}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50 h-12">
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    ID
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Department
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Head of Department
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Employees
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Total Budget
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Budget Used
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Used %
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedDepts.map((dept) => (
                  <tr
                    key={dept.id}
                    onClick={() => setSelectedDept(dept)}
                    className="hover:bg-secondary/40 transition-colors cursor-pointer h-14"
                  >
                    <td className="px-6 text-xs font-bold text-muted-foreground">
                      {dept.id}
                    </td>
                    <td className="px-6">
                      <span className="text-sm font-extrabold text-foreground">
                        {dept.name}
                      </span>
                    </td>
                    <td className="px-6 text-sm font-bold text-foreground">
                      {dept.head}
                    </td>
                    <td className="px-6 text-sm font-extrabold text-foreground">
                      {dept.employees}
                    </td>
                    <td className="px-6 text-sm font-extrabold text-[#8B5CF6]">
                      {dept.budgetAmount}
                    </td>
                    <td className="px-6 text-sm font-extrabold text-foreground">
                      {dept.budgetUsedAmount}
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-foreground min-w-[32px]">
                          {dept.budgetUsedPct}%
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${dept.budgetUsedPct}%`,
                              backgroundColor: getStatusColor(dept.status),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${
                          dept.status === "green"
                            ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20"
                            : dept.status === "amber"
                              ? "bg-amber-50 text-amber-600 border-amber-500/20"
                              : "bg-rose-50 text-rose-600 border-rose-500/20"
                        }`}
                      >
                        {dept.status === "green"
                          ? "Healthy"
                          : dept.status === "amber"
                            ? "Warning"
                            : "Critical"}
                      </span>
                    </td>
                    <td className="px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDept(dept);
                        }}
                        className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center border-none cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Annual Budget
                  </p>
                  <p className="text-[18px] font-black text-foreground">
                    {selectedDept.budgetAmount}
                  </p>
                </div>
                <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Budget Used
                  </p>
                  <p className="text-[18px] font-black text-foreground">
                    {selectedDept.budgetUsedAmount}
                  </p>
                </div>
                <div
                  onClick={() => navigate("/employees")}
                  className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#00B87C]/10 transition-colors"
                >
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Employees
                  </p>
                  <p className="text-[18px] font-black text-[#00B87C] underline decoration-[#00B87C]/30 underline-offset-4">
                    {selectedDept.employees}
                  </p>
                </div>
                <div
                  onClick={() => navigate("/payroll")}
                  className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#8B5CF6]/10 transition-colors"
                >
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Payroll Cost
                  </p>
                  <p className="text-[18px] font-black text-[#8B5CF6] underline decoration-[#8B5CF6]/30 underline-offset-4">
                    ₹12.4L/m
                  </p>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Budget Breakdown
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      label: "Payroll",
                      amount: "₹10.2L/month",
                      pct: 85,
                      color: "#00B87C",
                    },
                    {
                      label: "Training",
                      amount: "₹8L/year",
                      pct: 7,
                      color: "#0EA5E9",
                    },
                    {
                      label: "Equipment",
                      amount: "₹4.8L/year",
                      pct: 4,
                      color: "#8B5CF6",
                    },
                    {
                      label: "Operations",
                      amount: "₹4.8L/year",
                      pct: 4,
                      color: "#F59E0B",
                    },
                  ].map((cat, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[13px] font-bold">
                        <span className="text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground">
                          {cat.amount}{" "}
                          <span className="font-black text-foreground text-[11px]">
                            ({cat.pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.pct}%`,
                            backgroundColor: cat.color,
                          }}
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
                    <li
                      key={idx}
                      className="flex items-center justify-between text-[13px] font-bold p-3 bg-card border border-border rounded-xl"
                    >
                      <span className="text-foreground">{role.title}</span>
                      <span className="text-[#00B87C] font-black px-2 py-0.5 rounded-md bg-emerald-500/10">
                        {role.count}
                      </span>
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
                  <svg
                    viewBox="0 0 100 40"
                    className="w-full h-full overflow-visible preserve-aspect-ratio-none"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="trendGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00B87C"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#00B87C"
                          stopOpacity="0"
                        />
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
            <div
              className="p-4 border-t border-border bg-amber-500/5 cursor-pointer hover:bg-amber-500/10 transition-colors"
              onClick={() => (window.location.href = "mailto:hr@viyanhr.com")}
            >
              <p className="text-center text-[12px] font-bold text-amber-600 dark:text-amber-500">
                ⚠ No edit permissions — contact HR Manager to modify
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Finance Department Budget Alert Modal ─── */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setAlertModalOpen(false)}
          />
          <div className="relative bg-card w-full max-w-[420px] rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/10">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-black">Budget Alert</h3>
              </div>
              <p className="text-[13px] text-muted-foreground font-semibold leading-relaxed mb-6">
                The Finance department has reached{" "}
                <strong className="text-foreground">91%</strong> of its annual
                budget (₹50.05L used out of ₹55L). Please review upcoming
                expenditures or request a budget expansion.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAlertModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border font-bold text-[13px] hover:bg-muted transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => setAlertModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-[13px] hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                >
                  Review Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Generic KPI Modal ─── */}
      {genericModalTitle && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setGenericModalTitle("")}
          />
          <div className="relative bg-card w-full max-w-[420px] rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-foreground">
                  {genericModalTitle}
                </h3>
                <button
                  onClick={() => setGenericModalTitle("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-[13px] text-muted-foreground font-semibold mb-6">
                Detailed view for {genericModalTitle.toLowerCase()} is not
                available in the current preview mode. Please check back later.
              </p>
              <button
                onClick={() => setGenericModalTitle("")}
                className="w-full py-2.5 rounded-xl border border-border font-bold text-[13px] hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
