import {
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "motion/react";

const HEADCOUNT_TREND = [
  { month: "Oct", count: 1240 },
  { month: "Nov", count: 1252 },
  { month: "Dec", count: 1260 },
  { month: "Jan", count: 1272 },
  { month: "Feb", count: 1278 },
  { month: "Mar", count: 1284 },
];

const DEPT_DIST = [
  { name: "Engineering", value: 450, color: "#10B981" },
  { name: "Sales", value: 320, color: "#8B5CF6" },
  { name: "Marketing", value: 180, color: "#F59E0B" },
  { name: "Others", value: 334, color: "#0EA5E9" },
];

const LEAVE_REQUESTS = [
  {
    name: "Sarah Connor",
    type: "Casual Leave",
    date: "Apr 07 - Apr 09",
    status: "Pending",
    avatar: "SC",
  },
  {
    name: "James Bond",
    type: "Sick Leave",
    date: "Apr 06",
    status: "Pending",
    avatar: "JB",
  },
  {
    name: "Elena Gilbert",
    type: "Paid Leave",
    date: "Apr 12 - Apr 15",
    status: "Pending",
    avatar: "EG",
  },
  {
    name: "Tony Stark",
    type: "Sick Leave",
    date: "Apr 06 - Apr 07",
    status: "Pending",
    avatar: "TS",
  },
];

const RECENT_HIRES = [
  {
    name: "Michael Chen",
    role: "Software Engineer",
    dept: "Engineering",
    date: "2 days ago",
    avatar: "MC",
  },
  {
    name: "Jessica Lee",
    role: "UX Designer",
    dept: "Product",
    date: "4 days ago",
    avatar: "JL",
  },
  {
    name: "David Miller",
    role: "Sales Exec",
    dept: "Sales",
    date: "1 week ago",
    avatar: "DM",
  },
];

const DEPT_ATTENDANCE = [
  { name: "Eng", value: 94 },
  { name: "Sales", value: 88 },
  { name: "Mark", value: 91 },
  { name: "Ops", value: 95 },
  { name: "HR", value: 98 },
];

export function HRDashboard() {
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center">
            <Users size={28} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold text-[#111827]">
              HR Dashboard
            </h2>
            <p className="text-[13px] text-[#6B7280]">
              Welcome back, Alex johnson
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search employee..."
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:opacity-90 shadow-lg shadow-primary/20">
            Create Job Post
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            12 pending leave requests
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            8 new applications today
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            Payroll process starts in 2 days
          </span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: "TOTAL EMPLOYEES",
            value: "1,284",
            sub: "Active count",
            color: "#10B981",
            bg: "#DCFCE7",
          },
          {
            icon: UserCheck,
            label: "NEW HIRES",
            value: "24",
            sub: "Last 30 days",
            color: "#8B5CF6",
            bg: "#EDE9FE",
          },
          {
            icon: UserX,
            label: "ATTRITION RATE",
            value: "1.2%",
            sub: "Last month: 1.4%",
            color: "#EF4444",
            bg: "#FEE2E2",
          },
          {
            icon: Briefcase,
            label: "OPEN POSITIONS",
            value: "18",
            sub: "5 high priority",
            color: "#F59E0B",
            bg: "#FEF3C7",
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-[10px] mb-4 flex items-center justify-center"
              style={{ backgroundColor: kpi.bg }}
            >
              <kpi.icon size={24} style={{ color: kpi.color }} />
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              {kpi.label}
            </p>
            <p className="text-[28px] font-bold text-[#111827] mb-1">
              {kpi.value}
            </p>
            <p className="text-[12px] text-[#6B7280]">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ ROW 2 — CHARTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Headcount Trend
            </h3>
            <select className="bg-secondary text-[11px] font-bold px-3 py-1 rounded-lg border-none outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEADCOUNT_TREND}>
                <defs>
                  <linearGradient id="hrColorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.03)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#hrColorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">
            Employee Breakdown
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPT_DIST}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEPT_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {DEPT_DIST.map((dept, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    {dept.name}
                  </span>
                </div>
                <span className="text-[12px] font-bold text-muted-foreground">
                  {Math.round((dept.value / 1284) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — LEAVES & HIRES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leaves */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Leave Approvals
            </h3>
            <span className="px-2 py-1 bg-emerald-100 text-[#10B981] text-[11px] font-black rounded-lg">
              12 PENDING
            </span>
          </div>
          <div className="divide-y divide-border">
            {LEAVE_REQUESTS.map((req, i) => (
              <div
                key={i}
                className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">
                  {req.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-foreground">
                    {req.name}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {req.type} · {req.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                    <CheckCircle2 size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center border-t border-border">
            <button className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">
              Process All Leaves
            </button>
          </div>
        </div>

        {/* Recent Hires */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Recent Hires
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {RECENT_HIRES.map((hire, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-black">
                  {hire.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {hire.name}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {hire.role}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                      {hire.dept}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {hire.date}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="p-4 text-center border-t border-border">
            <button className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">
              Complete Onboarding (4)
            </button>
          </div>
        </div>

        {/* Attrition Risk */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">
            Attendance by Dept
          </h3>
          <div className="space-y-6 flex-1">
            {DEPT_ATTENDANCE.map((dept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[12px] font-bold text-foreground">
                  <span>{dept.name}</span>
                  <span>{dept.value}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-amber-900 leading-tight">
                  Retention Alert
                </p>
                <p className="text-[11px] font-semibold text-amber-700 mt-1">
                  High attrition risk detected in Sales department for Mid-level
                  roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
