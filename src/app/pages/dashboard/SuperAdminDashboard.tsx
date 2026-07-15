import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Building,
  Calendar,
  IndianRupee,
  Shield,
  Settings,
  Activity,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  ClipboardList,
  Database,
  Lock,
  Megaphone,
  BarChart3,
  UserPlus,
  X,
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
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

const HEADCOUNT_PERIOD_DATA = {
  "6M": {
    data: [
      { month: "Oct", count: 1240 },
      { month: "Nov", count: 1252 },
      { month: "Dec", count: 1260 },
      { month: "Jan", count: 1272 },
      { month: "Feb", count: 1278 },
      { month: "Mar", count: 1284 },
    ],
    growth: "+44 Employees",
    rate: "+3.5%",
    peak: "1,284",
    avg: "1,264",
    desc: "Steady linear headcount expansion over the last two quarters.",
  },
  "1Y": {
    data: [
      { month: "Apr '25", count: 1150 },
      { month: "May '25", count: 1170 },
      { month: "Jun '25", count: 1185 },
      { month: "Jul '25", count: 1200 },
      { month: "Aug '25", count: 1210 },
      { month: "Sep '25", count: 1225 },
      { month: "Oct '25", count: 1240 },
      { month: "Nov '25", count: 1252 },
      { month: "Dec '25", count: 1260 },
      { month: "Jan '26", count: 1272 },
      { month: "Feb '26", count: 1278 },
      { month: "Mar '26", count: 1284 },
    ],
    growth: "+134 Employees",
    rate: "+11.7%",
    peak: "1,284",
    avg: "1,217",
    desc: "Double-digit headcount growth driven by engineering scaling.",
  },
  "2Y": {
    data: [
      { month: "Q1 '24", count: 980 },
      { month: "Q2 '24", count: 1020 },
      { month: "Q3 '24", count: 1060 },
      { month: "Q4 '24", count: 1110 },
      { month: "Q1 '25", count: 1150 },
      { month: "Q2 '25", count: 1185 },
      { month: "Q3 '25", count: 1225 },
      { month: "Q4 '25", count: 1260 },
      { month: "Q1 '26", count: 1284 },
    ],
    growth: "+304 Employees",
    rate: "+31.0%",
    peak: "1,284",
    avg: "1,142",
    desc: "Long-term scaling demonstrating 30%+ user expansion over 24 months.",
  },
};

const INITIAL_DEPT_DATA = [
  { name: "Engineering", value: 450, color: "#8B5CF6" },
  { name: "Sales", value: 320, color: "#10B981" },
  { name: "Marketing", value: 180, color: "#F59E0B" },
  { name: "Finance", value: 120, color: "#0EA5E9" },
  { name: "HR", value: 114, color: "#EC4899" },
];

const INITIAL_PENDING_ACTIONS = [
  {
    icon: ShieldCheck,
    title: "Role approval needed",
    urgency: "High",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    icon: IndianRupee,
    title: "Payroll run due in 3 days",
    urgency: "Medium",
    color: "#00B87C",
    bg: "rgba(0,184,124,0.1)",
  },
  {
    icon: ClipboardList,
    title: "HR Policy update required",
    urgency: "Low",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    icon: Lock,
    title: "Security audit overdue",
    urgency: "Critical",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
  },
  {
    icon: UserCheck,
    title: "12 new hires onboarding",
    urgency: "Medium",
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.1)",
  },
];

const INITIAL_AUDIT_LOG = [
  {
    type: "Delete",
    text: "Employee record #EMP-042 deleted",
    user: "Admin",
    time: "10m ago",
    color: "#EF4444",
  },
  {
    type: "Approve",
    text: "Bulk leave approval processed",
    user: "HR Mgr",
    time: "1h ago",
    color: "#00B87C",
  },
  {
    type: "Update",
    text: "Salary structure modified",
    user: "Finance",
    time: "2h ago",
    color: "#8B5CF6",
  },
  {
    type: "Create",
    text: "New department 'AI Research' created",
    user: "Admin",
    time: "4h ago",
    color: "#0EA5E9",
  },
  {
    type: "Settings",
    text: "MFA enforced for all managers",
    user: "Security",
    time: "1d ago",
    color: "#F59E0B",
  },
];

const INITIAL_MODULE_USAGE = [
  { label: "Dashboard", value: 98, color: "#00B87C" },
  { label: "Attendance", value: 94, color: "#00B87C" },
  { label: "Payroll", value: 86, color: "#8B5CF6" },
  { label: "Leave", value: 82, color: "#F59E0B" },
  { label: "Performance", value: 75, color: "#0EA5E9" },
];

const INITIAL_ROLE_DIST = [
  {
    role: "Super Admin",
    count: 4,
    status: "Active",
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  {
    role: "HR Manager",
    count: 12,
    status: "Active",
    color: "#00B87C",
    bg: "#DCFCE7",
  },
  {
    role: "Finance",
    count: 8,
    status: "Active",
    color: "#0EA5E9",
    bg: "#E0F2FE",
  },
  {
    role: "Manager",
    count: 42,
    status: "Active",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    role: "Employee",
    count: 1218,
    status: "Active",
    color: "#64748B",
    bg: "#F3F4F6",
  },
];

interface RoleDistItem {
  role: string;
  count: number;
  status: string;
  color: string;
  bg: string;
}

interface PendingActionItem {
  icon: React.ElementType;
  title: string;
  urgency: string;
  color: string;
  bg: string;
}

export function SuperAdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Reactive CRUD and Statistics state
  const [totalEmployeesCount, setTotalEmployeesCount] = useState(1284);
  const [pendingActionsCount, setPendingActionsCount] = useState(3);
  const [headcountPeriod, setHeadcountPeriod] = useState<"6M" | "1Y" | "2Y">(
    "6M",
  );

  const [pendingActionsList, setPendingActionsList] = useState(
    INITIAL_PENDING_ACTIONS,
  );
  const [auditLogList, setAuditLogList] = useState(INITIAL_AUDIT_LOG);
  const [roleDistList, setRoleDistList] = useState(INITIAL_ROLE_DIST);

  // Modals Visibility
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isPostAnnouncementOpen, setIsPostAnnouncementOpen] = useState(false);
  const [isManageRoleOpen, setIsManageRoleOpen] = useState(false);
  const [selectedRoleToManage, setSelectedRoleToManage] =
    useState<RoleDistItem | null>(null);
  const [activePendingAction, setActivePendingAction] =
    useState<PendingActionItem | null>(null);

  // System actions (loading state)
  const [systemTaskType, setSystemTaskType] = useState<
    "Backup" | "Scan" | null
  >(null);
  const [progressPercent, setProgressPercent] = useState(0);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
    designation: "",
    salary: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    urgency: "Normal",
  });

  // CRUD Handler: Add Employee
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.email) return;

    setTotalEmployeesCount((prev) => prev + 1);

    const newLog = {
      type: "Create",
      text: `New employee '${employeeForm.name}' (${employeeForm.designation || "Staff"}) created`,
      user: "Admin",
      time: "Just now",
      color: "#0EA5E9",
    };
    setAuditLogList((prev) => [newLog, ...prev]);

    setRoleDistList((prev) =>
      prev.map((r) => {
        if (r.role === "Employee") {
          return { ...r, count: r.count + 1 };
        }
        return r;
      }),
    );

    setEmployeeForm({
      name: "",
      email: "",
      department: "Engineering",
      designation: "",
      salary: "",
    });
    setIsAddEmployeeOpen(false);
  };

  // CRUD Handler: Update Role
  const handleManageRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleToManage) return;

    setRoleDistList((prev) =>
      prev.map((r) => {
        if (r.role === selectedRoleToManage.role) {
          return {
            ...r,
            count: Number(selectedRoleToManage.count),
            status: selectedRoleToManage.status,
          };
        }
        return r;
      }),
    );

    const newLog = {
      type: "Update",
      text: `Role '${selectedRoleToManage.role}' settings modified`,
      user: "Admin",
      time: "Just now",
      color: "#8B5CF6",
    };
    setAuditLogList((prev) => [newLog, ...prev]);

    setIsManageRoleOpen(false);
    setSelectedRoleToManage(null);
  };

  // CRUD Handler: Resolve/Delete Action
  const handleResolveAction = (title: string) => {
    setPendingActionsList((prev) => prev.filter((a) => a.title !== title));
    setPendingActionsCount((prev) => Math.max(0, prev - 1));

    const newLog = {
      type: "Approve",
      text: `Action '${title}' resolved/approved`,
      user: "Admin",
      time: "Just now",
      color: "#00B87C",
    };
    setAuditLogList((prev) => [newLog, ...prev]);
    setActivePendingAction(null);
  };

  // CRUD Handler: Post Announcement
  const handlePostAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.message) return;

    const newLog = {
      type: "Settings",
      text: `Announcement: '${announcementForm.title}' published`,
      user: "Admin",
      time: "Just now",
      color: "#F59E0B",
    };
    setAuditLogList((prev) => [newLog, ...prev]);

    setAnnouncementForm({
      title: "",
      message: "",
      urgency: "Normal",
    });
    setIsPostAnnouncementOpen(false);
  };

  // Action: Backup Data (Simulated loading)
  const triggerBackup = () => {
    setSystemTaskType("Backup");
    setProgressPercent(0);
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSystemTaskType(null);
            const newLog = {
              type: "Settings",
              text: "Full database backup completed successfully",
              user: "System",
              time: "Just now",
              color: "#64748B",
            };
            setAuditLogList((prevLog) => [newLog, ...prevLog]);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Action: Security Scan (Simulated loading)
  const triggerSecurityScan = () => {
    setSystemTaskType("Scan");
    setProgressPercent(0);
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSystemTaskType(null);
            const newLog = {
              type: "Settings",
              text: "Vulnerability security scan completed - 0 threats found",
              user: "Security",
              time: "Just now",
              color: "#EF4444",
            };
            setAuditLogList((prevLog) => [newLog, ...prevLog]);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center">
            <Activity size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-foreground tracking-tight">
              {t("adminDashboard")}
            </h2>
            <p className="text-[13px] font-semibold text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-bold text-emerald-700">
              {t("live")}
            </span>
          </div>
          <button
            onClick={() => navigate("/reports")}
            className="px-4 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-colors cursor-pointer"
          >
            View Reports
          </button>
        </div>
      </div>

      {/* ═══ SYSTEM HEALTH BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            {t("systemAllServicesOperational")}
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            {totalEmployeesCount.toLocaleString()} active users today
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">
            {pendingActionsCount} pending admin actions
          </span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            icon: Users,
            label: "TOTAL EMPLOYEES",
            value: totalEmployeesCount.toLocaleString(),
            sub: "+12 this month",
            color: "#00B87C",
            bg: "#DCFCE7",
          },
          {
            icon: Building,
            label: "DEPARTMENTS",
            value: "7",
            sub: "All active",
            color: "#0EA5E9",
            bg: "#E0F2FE",
          },
          {
            icon: Calendar,
            label: "ATTENDANCE TODAY",
            value: "91%",
            sub: "1,102 present",
            color: "#00B87C",
            bg: "#DCFCE7",
          },
          {
            icon: IndianRupee,
            label: "PAYROLL THIS MONTH",
            value: "₹28.4L",
            sub: "Mar 2026",
            color: "#8B5CF6",
            bg: "#EDE9FE",
          },
          {
            icon: Shield,
            label: "SECURITY ALERTS",
            value: "0",
            sub: "All clear",
            color: "#EF4444",
            bg: "#FEE2E2",
          },
          {
            icon: Settings,
            label: "SYSTEM UPTIME",
            value: "99.9%",
            sub: "Last 30 days",
            color: "#111827",
            bg: "#F3F4F6",
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center"
              style={{ backgroundColor: kpi.bg }}
            >
              <kpi.icon size={20} style={{ color: kpi.color }} />
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
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              {t("headcountTrend")}
            </h3>
            <div className="flex gap-2">
              {(["6M", "1Y", "2Y"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setHeadcountPeriod(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-black tracking-widest transition-all cursor-pointer ${
                    f === headcountPeriod
                      ? "bg-primary text-white shadow-sm shadow-[#00B87C]/20"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Insights Panel */}
            <div className="md:col-span-3 flex flex-col justify-between p-4 bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-500/10 rounded-2xl h-full min-h-[140px] md:min-h-0">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Period Insights ({headcountPeriod})
                </span>
                <h4 className="text-[20px] font-black text-foreground leading-tight">
                  {HEADCOUNT_PERIOD_DATA[headcountPeriod].growth}
                </h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  {HEADCOUNT_PERIOD_DATA[headcountPeriod].rate} Growth
                </span>
                <p className="text-[12px] font-semibold text-muted-foreground leading-snug mt-2">
                  {HEADCOUNT_PERIOD_DATA[headcountPeriod].desc}
                </p>
              </div>
              <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                    Peak Count
                  </span>
                  <span className="text-[15px] font-black text-foreground">
                    {HEADCOUNT_PERIOD_DATA[headcountPeriod].peak}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                    Average
                  </span>
                  <span className="text-[15px] font-black text-foreground">
                    {HEADCOUNT_PERIOD_DATA[headcountPeriod].avg}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Panel */}
            <div className="md:col-span-7 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HEADCOUNT_PERIOD_DATA[headcountPeriod].data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B87C" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#00B87C" stopOpacity={0} />
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
                    stroke="#00B87C"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">
            {t("deptDistribution")}
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INITIAL_DEPT_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {INITIAL_DEPT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {INITIAL_DEPT_DATA.map((dept, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
                <span className="text-[11px] font-bold text-muted-foreground truncate">
                  {dept.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — ADMIN ACTIONS & LOGS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                {t("pendingAdminActions")}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {pendingActionsList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-[13px] font-bold">
                  All actions resolved!
                </div>
              ) : (
                pendingActionsList.map((action, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePendingAction(action)}
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: action.bg }}
                      >
                        <action.icon
                          size={18}
                          style={{ color: action.color }}
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground leading-tight">
                          {action.title}
                        </p>
                        <span
                          className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: action.color }}
                        >
                          {action.urgency} Priority
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-4 text-center border-t border-border mt-auto">
            <button
              onClick={() => navigate("/employees")}
              className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer"
            >
              {t("viewAllActions")}
            </button>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              {t("recentSystemActivity")}
            </h3>
          </div>
          <div className="p-6 space-y-6 max-h-[380px] overflow-y-auto custom-scrollbar">
            {auditLogList.map((log, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== auditLogList.length - 1 && (
                  <div className="absolute left-[5px] top-4 w-[1px] h-full bg-border" />
                )}
                <div
                  className="w-[11px] h-[11px] rounded-full mt-1.5 z-10 shrink-0 border-2 border-card"
                  style={{ backgroundColor: log.color }}
                />
                <div className="overflow-hidden">
                  <p className="text-[13px] font-bold text-foreground leading-tight">
                    {log.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {log.user}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {log.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Usage */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              {t("moduleUsage")}
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              {t("mostUsedAttendance", { value: 94 })}
            </span>
          </div>
          <div className="space-y-6 flex-1">
            {INITIAL_MODULE_USAGE.map((mod, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[12px] font-bold text-foreground">
                  <span>{mod.label}</span>
                  <span>{mod.value}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: mod.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM ROW — ROLES & QUICK ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm overflow-hidden">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">
            {t("userRolesDistribution")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {t("roleName")}
                  </th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {t("members")}
                  </th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {t("status")}
                  </th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roleDistList.map((role, i) => (
                  <tr
                    key={i}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider"
                        style={{ color: role.color, backgroundColor: role.bg }}
                      >
                        {role.role}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-foreground text-sm">
                      {role.count}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${role.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        <span className="text-[11px] font-bold text-muted-foreground">
                          {role.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRoleToManage(role);
                          setIsManageRoleOpen(true);
                        }}
                        className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        {t("manageArrow")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">
            {t("quickSystemActions")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                icon: IndianRupee,
                label: "Run Payroll",
                color: "#8B5CF6",
                bg: "#EDE9FE",
                action: () => navigate("/payroll"),
              },
              {
                icon: UserPlus,
                label: "Add Employee",
                color: "#00B87C",
                bg: "#DCFCE7",
                action: () => setIsAddEmployeeOpen(true),
              },
              {
                icon: Megaphone,
                label: "Post Announcement",
                color: "#F59E0B",
                bg: "#FEF3C7",
                action: () => setIsPostAnnouncementOpen(true),
              },
              {
                icon: BarChart3,
                label: "Export Reports",
                color: "#0EA5E9",
                bg: "#E0F2FE",
                action: () => navigate("/reports"),
              },
              {
                icon: Database,
                label: "Backup Data",
                color: "#64748B",
                bg: "#F3F4F6",
                action: triggerBackup,
              },
              {
                icon: ShieldCheck,
                label: "Security Scan",
                color: "#EF4444",
                bg: "#FEE2E2",
                action: triggerSecurityScan,
              },
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-all group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: action.bg }}
                >
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <span className="text-[12px] font-bold text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {/* ADD EMPLOYEE MODAL */}
        {isAddEmployeeOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsAddEmployeeOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card w-full max-w-md rounded-3xl p-6 border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                  <UserPlus className="text-primary" size={20} /> Add New
                  Employee
                </h3>
                <button
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={handleAddEmployeeSubmit}
                className="space-y-4 pt-4"
              >
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rajan Kumar"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={employeeForm.name}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. rajan.k@viyanhr.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={employeeForm.email}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Department
                    </label>
                    <select
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                      value={employeeForm.department}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          department: e.target.value,
                        })
                      }
                    >
                      <option>Engineering</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>HR</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Engineer"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                      value={employeeForm.designation}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          designation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Annual Salary (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500000"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={employeeForm.salary}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        salary: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddEmployeeOpen(false)}
                    className="flex-1 py-3 bg-secondary hover:bg-border text-foreground text-[13px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* POST ANNOUNCEMENT MODAL */}
        {isPostAnnouncementOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsPostAnnouncementOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card w-full max-w-md rounded-3xl p-6 border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                  <Megaphone className="text-amber-500" size={20} /> Publish
                  Announcement
                </h3>
                <button
                  onClick={() => setIsPostAnnouncementOpen(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={handlePostAnnouncementSubmit}
                className="space-y-4 pt-4"
              >
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Announcement Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Q2 Performance Review Timelines"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Message Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write announcement description here..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground resize-none"
                    value={announcementForm.message}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Priority Level
                  </label>
                  <select
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={announcementForm.urgency}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        urgency: e.target.value,
                      })
                    }
                  >
                    <option>Normal</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsPostAnnouncementOpen(false)}
                    className="flex-1 py-3 bg-secondary hover:bg-border text-foreground text-[13px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MANAGE ROLE MODAL */}
        {isManageRoleOpen && selectedRoleToManage && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsManageRoleOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card w-full max-w-sm rounded-3xl p-6 border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                  <Settings className="text-[#8B5CF6]" size={20} /> Manage Role:{" "}
                  {selectedRoleToManage.role}
                </h3>
                <button
                  onClick={() => setIsManageRoleOpen(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={handleManageRoleSubmit}
                className="space-y-4 pt-4"
              >
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Active Members Count
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={selectedRoleToManage.count}
                    onChange={(e) =>
                      setSelectedRoleToManage({
                        ...selectedRoleToManage,
                        count: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                    Role Status
                  </label>
                  <select
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-[13px] font-bold outline-none focus:border-primary transition-all text-foreground"
                    value={selectedRoleToManage.status}
                    onChange={(e) =>
                      setSelectedRoleToManage({
                        ...selectedRoleToManage,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsManageRoleOpen(false)}
                    className="flex-1 py-3 bg-secondary hover:bg-border text-foreground text-[13px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* RESOLVE PENDING ACTION MODAL */}
        {activePendingAction && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setActivePendingAction(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card w-full max-w-sm rounded-3xl p-6 border border-border shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: activePendingAction.bg }}
              >
                <activePendingAction.icon
                  size={28}
                  style={{ color: activePendingAction.color }}
                />
              </div>
              <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
                Resolve Pending Action
              </h3>
              <p className="text-[13px] font-bold text-muted-foreground mb-1">
                Action:{" "}
                <strong className="text-foreground">
                  {activePendingAction.title}
                </strong>
              </p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
                Priority Level:{" "}
                <span style={{ color: activePendingAction.color }}>
                  {activePendingAction.urgency}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setActivePendingAction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleResolveAction(activePendingAction.title)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 shadow-md shadow-primary/25 transition-all cursor-pointer"
                >
                  Resolve / Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SYSTEM TASK PROGRESS MODAL */}
        {systemTaskType && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-card w-full max-w-xs rounded-3xl p-6 border border-border shadow-2xl text-center overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 animate-bounce">
                {systemTaskType === "Backup" ? (
                  <Database className="text-primary" size={28} />
                ) : (
                  <Shield className="text-rose-500" size={28} />
                )}
              </div>
              <h3 className="text-md font-black text-foreground tracking-tight mb-2">
                {systemTaskType === "Backup"
                  ? "Backing Up Database..."
                  : "Scanning for Security Vulnerabilities..."}
              </h3>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[12px] font-black text-primary">
                {progressPercent}% Completed
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
