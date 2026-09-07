import { useEffect, useReducer, useCallback, lazy, Suspense } from "react";
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
import { AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import * as m from "motion/react-m";

const AreaChart = lazy(() => import("recharts").then((m) => ({ default: m.AreaChart })));
const Area = lazy(() => import("recharts").then((m) => ({ default: m.Area })));
const XAxis = lazy(() => import("recharts").then((m) => ({ default: m.XAxis })));
const YAxis = lazy(() => import("recharts").then((m) => ({ default: m.YAxis })));
const CartesianGrid = lazy(() => import("recharts").then((m) => ({ default: m.CartesianGrid })));
const Tooltip = lazy(() => import("recharts").then((m) => ({ default: m.Tooltip })));
const ResponsiveContainer = lazy(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })));
const PieChart = lazy(() => import("recharts").then((m) => ({ default: m.PieChart })));
const Pie = lazy(() => import("recharts").then((m) => ({ default: m.Pie })));
const Cell = lazy(() => import("recharts").then((m) => ({ default: m.Cell })));

import { usePermissions } from "../../shared/permission-engine/PermissionContext";
import { PermissionGate } from "../../shared/permission-engine/PermissionGate";
import { P } from "../../shared/permission-engine/permissions";

const HEADCOUNT_PERIOD_DATA = {
  "6M": {
    data: [
      {
        month: "Oct",
        count: 1240,
      },
      {
        month: "Nov",
        count: 1252,
      },
      {
        month: "Dec",
        count: 1260,
      },
      {
        month: "Jan",
        count: 1272,
      },
      {
        month: "Feb",
        count: 1278,
      },
      {
        month: "Mar",
        count: 1284,
      },
    ],
    growth: "+44 Employees",
    rate: "+3.5%",
    peak: "1,284",
    avg: "1,264",
    desc: "Steady linear headcount expansion over the last two quarters.",
  },
  "1Y": {
    data: [
      {
        month: "Apr '25",
        count: 1150,
      },
      {
        month: "May '25",
        count: 1170,
      },
      {
        month: "Jun '25",
        count: 1185,
      },
      {
        month: "Jul '25",
        count: 1200,
      },
      {
        month: "Aug '25",
        count: 1210,
      },
      {
        month: "Sep '25",
        count: 1225,
      },
      {
        month: "Oct '25",
        count: 1240,
      },
      {
        month: "Nov '25",
        count: 1252,
      },
      {
        month: "Dec '25",
        count: 1260,
      },
      {
        month: "Jan '26",
        count: 1272,
      },
      {
        month: "Feb '26",
        count: 1278,
      },
      {
        month: "Mar '26",
        count: 1284,
      },
    ],
    growth: "+134 Employees",
    rate: "+11.7%",
    peak: "1,284",
    avg: "1,217",
    desc: "Double-digit headcount growth driven by engineering scaling.",
  },
  "2Y": {
    data: [
      {
        month: "Q1 '24",
        count: 980,
      },
      {
        month: "Q2 '24",
        count: 1020,
      },
      {
        month: "Q3 '24",
        count: 1060,
      },
      {
        month: "Q4 '24",
        count: 1110,
      },
      {
        month: "Q1 '25",
        count: 1150,
      },
      {
        month: "Q2 '25",
        count: 1185,
      },
      {
        month: "Q3 '25",
        count: 1225,
      },
      {
        month: "Q4 '25",
        count: 1260,
      },
      {
        month: "Q1 '26",
        count: 1284,
      },
    ],
    growth: "+304 Employees",
    rate: "+31.0%",
    peak: "1,284",
    avg: "1,142",
    desc: "Long-term scaling demonstrating 30%+ user expansion over 24 months.",
  },
};
const INITIAL_DEPT_DATA = [
  {
    name: "Engineering",
    value: 450,
    color: "#8B5CF6",
  },
  {
    name: "Sales",
    value: 320,
    color: "#10B981",
  },
  {
    name: "Marketing",
    value: 180,
    color: "#F59E0B",
  },
  {
    name: "Finance",
    value: 120,
    color: "#0EA5E9",
  },
  {
    name: "HR",
    value: 114,
    color: "#EC4899",
  },
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
  const __initialState = {
    totalEmployeesCount: 1284,
    pendingActionsCount: 5,
    headcountPeriod: "6M" as "6M" | "1Y" | "2Y",
    pendingActionsList: INITIAL_PENDING_ACTIONS,
    isAddEmployeeOpen: false,
    isPostAnnouncementOpen: false,
    activePendingAction: null as PendingActionItem | null,
    systemTaskType: null as "Backup" | "Scan" | null,
    progressPercent: 0,
    employeeForm: {
      name: "",
      email: "",
      department: "Engineering",
      designation: "",
      salary: "",
    },
    announcementForm: {
      title: "",
      message: "",
      urgency: "Normal",
    },
  };
  const [__state, __updateState] = useReducer(
    (prev: any, next: any) => ({
      ...prev,
      ...(typeof next === "function" ? next(prev) : next),
    }),
    __initialState,
  );
  const {
    totalEmployeesCount,
    pendingActionsCount,
    headcountPeriod,
    pendingActionsList,
    isAddEmployeeOpen,
    isPostAnnouncementOpen,
    activePendingAction,
    systemTaskType,
    progressPercent,
    employeeForm,
    announcementForm,
  } = __state;

  const setTotalEmployeesCount = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        totalEmployeesCount:
          typeof val === "function" ? val(prev.totalEmployeesCount) : val,
      })),
    [],
  );
  const setPendingActionsCount = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        pendingActionsCount:
          typeof val === "function" ? val(prev.pendingActionsCount) : val,
      })),
    [],
  );
  const setHeadcountPeriod = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        headcountPeriod:
          typeof val === "function" ? val(prev.headcountPeriod) : val,
      })),
    [],
  );
  const setPendingActionsList = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        pendingActionsList:
          typeof val === "function" ? val(prev.pendingActionsList) : val,
      })),
    [],
  );
  const setIsAddEmployeeOpen = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        isAddEmployeeOpen:
          typeof val === "function" ? val(prev.isAddEmployeeOpen) : val,
      })),
    [],
  );
  const setIsPostAnnouncementOpen = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        isPostAnnouncementOpen:
          typeof val === "function" ? val(prev.isPostAnnouncementOpen) : val,
      })),
    [],
  );
  const setActivePendingAction = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        activePendingAction:
          typeof val === "function" ? val(prev.activePendingAction) : val,
      })),
    [],
  );
  const setSystemTaskType = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        systemTaskType:
          typeof val === "function" ? val(prev.systemTaskType) : val,
      })),
    [],
  );
  const setProgressPercent = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        progressPercent:
          typeof val === "function" ? val(prev.progressPercent) : val,
      })),
    [],
  );
  const setEmployeeForm = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        employeeForm: typeof val === "function" ? val(prev.employeeForm) : val,
      })),
    [],
  );
  const setAnnouncementForm = useCallback(
    (val: any) =>
      __updateState((prev: any) => ({
        announcementForm:
          typeof val === "function" ? val(prev.announcementForm) : val,
      })),
    [],
  );

  const { hasPermissionKey } = usePermissions();

  // CRUD Handler: Add Employee
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermissionKey(P.EMPLOYEES_CREATE)) return;
    if (!employeeForm.name || !employeeForm.email) return;
    setTotalEmployeesCount((prev: number) => prev + 1);
    setEmployeeForm({
      name: "",
      email: "",
      department: "Engineering",
      designation: "",
      salary: "",
    });
    setIsAddEmployeeOpen(false);
  };

  // CRUD Handler: Resolve/Delete Action
  const handleResolveAction = (title: string) => {
    if (!hasPermissionKey(P.EMPLOYEES_MANAGE) && !hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) return;
    setPendingActionsList((prev: PendingActionItem[]) => prev.filter((a) => a.title !== title));
    setPendingActionsCount((prev: number) => Math.max(0, prev - 1));
    setActivePendingAction(null);
  };

  // CRUD Handler: Post Announcement
  const handlePostAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermissionKey(P.ANNOUNCEMENTS_MANAGE)) return;
    if (!announcementForm.title || !announcementForm.message) return;
    setAnnouncementForm({
      title: "",
      message: "",
      urgency: "Normal",
    });
    setIsPostAnnouncementOpen(false);
  };

  useEffect(() => {
    if (systemTaskType !== "Backup") return;
    const interval = setInterval(() => {
      setProgressPercent((prev: number) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [systemTaskType]);

  useEffect(() => {
    if (systemTaskType !== "Scan") return;
    const interval = setInterval(() => {
      setProgressPercent((prev: number) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 20;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [systemTaskType]);

  useEffect(() => {
    if (progressPercent < 100 || !systemTaskType) return;
    const timeout = setTimeout(() => {
      setSystemTaskType(null);
    }, 300);
    return () => clearTimeout(timeout);
  }, [progressPercent, systemTaskType]);

  // Action: Backup Data (Simulated loading)
  const triggerBackup = () => {
    if (!hasPermissionKey(P.SETTINGS_FULL)) return;
    setSystemTaskType("Backup");
    setProgressPercent(0);
  };

  // Action: Security Scan (Simulated loading)
  const triggerSecurityScan = () => {
    if (!hasPermissionKey(P.SETTINGS_FULL)) return;
    setSystemTaskType("Scan");
    setProgressPercent(0);
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
          <PermissionGate requires={P.REPORTS_VIEW}>
            <button
              onClick={() => navigate("/reports")}
              className="px-4 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              View Reports
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* ═══ SYSTEM HEALTH BAR ═══ */}
      <div className="w-full py-3 px-4 sm:px-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center gap-y-2.5 gap-x-6 sm:gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
          <span className="text-[12px] font-bold text-slate-800 dark:text-emerald-200 tracking-tight">
            {t("systemAllServicesOperational")}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:border-l sm:border-emerald-200/50 dark:sm:border-emerald-800/40 sm:pl-6 border-l-0 pl-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[12px] font-bold text-slate-800 dark:text-emerald-200 tracking-tight">
            {totalEmployeesCount.toLocaleString()} active users today
          </span>
        </div>
        <div className="flex items-center gap-2 sm:border-l sm:border-emerald-200/50 dark:sm:border-emerald-800/40 sm:pl-6 border-l-0 pl-0">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="text-[12px] font-bold text-slate-800 dark:text-emerald-200 tracking-tight">
            {pendingActionsCount} pending admin actions
          </span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
        {[
          {
            icon: Users,
            label: "TOTAL EMPLOYEES",
            value: totalEmployeesCount.toLocaleString(),
            sub: "+12 this month",
            color: "#00B87C",
            bg: "rgba(0,184,124,0.12)",
          },
          {
            icon: Building,
            label: "DEPARTMENTS",
            value: "7",
            sub: "All active",
            color: "#0EA5E9",
            bg: "rgba(14,165,233,0.12)",
          },
          {
            icon: Calendar,
            label: "ATTENDANCE TODAY",
            value: "91%",
            sub: "1,102 present",
            color: "#00B87C",
            bg: "rgba(0,184,124,0.12)",
          },
          {
            icon: IndianRupee,
            label: "PAYROLL THIS MONTH",
            value: "₹28.4L",
            sub: "Mar 2026",
            color: "#8B5CF6",
            bg: "rgba(139,92,246,0.12)",
          },
          {
            icon: Shield,
            label: "SECURITY ALERTS",
            value: "0",
            sub: "All clear",
            color: "#EF4444",
            bg: "rgba(239,68,68,0.12)",
          },
          {
            icon: Settings,
            label: "SYSTEM UPTIME",
            value: "99.9%",
            sub: "Last 30 days",
            color: "#6366F1",
            bg: "rgba(99,102,241,0.12)",
          },
        ].map((kpi, i) => (
          <m.div
            key={kpi.label}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.05,
            }}
            className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: kpi.bg,
              }}
            >
              <kpi.icon
                size={20}
                style={{
                  color: kpi.color,
                }}
              />
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {kpi.label}
            </p>
            <p className="text-[28px] font-bold text-foreground mb-1">
              {kpi.value}
            </p>
            <p className="text-[12px] text-muted-foreground">{kpi.sub}</p>
          </m.div>
        ))}
      </div>

      {/* ═══ ROW 2 — CHARTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Headcount Trend Chart */}
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
                  className={`px-3 py-1 rounded-full text-[11px] font-black tracking-widest transition-all cursor-pointer ${f === headcountPeriod ? "bg-primary text-white shadow-sm shadow-[#00B87C]/20" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Insights Panel */}
            <div className="md:col-span-3 flex flex-col justify-between p-4 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl h-full min-h-[140px] md:min-h-0">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Period Insights ({headcountPeriod})
                </span>
                <h4 className="text-[20px] font-black text-foreground leading-tight">
                  {HEADCOUNT_PERIOD_DATA[headcountPeriod].growth}
                </h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase tracking-wider">
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
            <div className="md:col-span-7 h-[280px] w-full min-h-[250px]">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground animate-pulse">Loading chart...</div>}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HEADCOUNT_PERIOD_DATA[headcountPeriod].data}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00B87C" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00B87C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border, rgba(148,163,184,0.15))"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 700,
                        fill: "var(--muted-foreground, #64748B)",
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 700,
                        fill: "var(--muted-foreground, #64748B)",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card, #ffffff)",
                        borderColor: "var(--border, #e2e8f0)",
                        borderRadius: "12px",
                        color: "var(--foreground, #0f172a)",
                        fontWeight: 700,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{
                        color: "var(--foreground, #0f172a)",
                      }}
                    />
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
              </Suspense>
            </div>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="lg:col-span-1 bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4">
            {t("deptDistribution")}
          </h3>
          <div className="h-[200px] w-full min-h-[180px]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground animate-pulse">Loading chart...</div>}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INITIAL_DEPT_DATA}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {INITIAL_DEPT_DATA.map((entry) => (
                      <Cell key={`cell-${entry.color}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card, #ffffff)",
                      borderColor: "var(--border, #e2e8f0)",
                      borderRadius: "12px",
                      color: "var(--foreground, #0f172a)",
                      fontWeight: 700,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{
                      color: "var(--foreground, #0f172a)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {INITIAL_DEPT_DATA.map((dept) => (
              <div key={dept.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: dept.color,
                  }}
                />
                <span className="text-[11px] font-bold text-muted-foreground truncate">
                  {dept.name} ({dept.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — PENDING ADMIN ACTIONS + QUICK SYSTEM ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Pending Admin Actions */}
        <div className="lg:col-span-1 bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col justify-between">
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
                pendingActionsList.map((action: PendingActionItem) => (
                  <div
                    key={action.title}
                    onClick={() => setActivePendingAction(action)}
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: action.bg,
                        }}
                      >
                        <action.icon
                          size={18}
                          style={{
                            color: action.color,
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground leading-tight">
                          {action.title}
                        </p>
                        <span
                          className="text-[10px] font-black uppercase tracking-widest"
                          style={{
                            color: action.color,
                          }}
                        >
                          {action.urgency} Priority
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-4 text-center border-t border-border mt-auto">
            <PermissionGate requires={P.EMPLOYEES_VIEW}>
              <button
                onClick={() => navigate("/employees")}
                className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer"
              >
                {t("viewAllActions")}
              </button>
            </PermissionGate>
          </div>
        </div>

        {/* Quick System Actions */}
        <div className="lg:col-span-1 bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">
              {t("quickSystemActions")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: IndianRupee,
                  label: "Run Payroll",
                  color: "#8B5CF6",
                  bg: "rgba(139,92,246,0.12)",
                  permission: P.PAYROLL_MANAGE,
                  action: () => navigate("/payroll"),
                },
                {
                  icon: UserPlus,
                  label: "Add Employee",
                  color: "#00B87C",
                  bg: "rgba(0,184,124,0.12)",
                  permission: P.EMPLOYEES_CREATE,
                  action: () => setIsAddEmployeeOpen(true),
                },
                {
                  icon: Megaphone,
                  label: "Post Announcement",
                  color: "#F59E0B",
                  bg: "rgba(245,158,11,0.12)",
                  permission: P.ANNOUNCEMENTS_MANAGE,
                  action: () => setIsPostAnnouncementOpen(true),
                },
                {
                  icon: BarChart3,
                  label: "Export Reports",
                  color: "#0EA5E9",
                  bg: "rgba(14,165,233,0.12)",
                  permission: P.REPORTS_VIEW,
                  action: () => navigate("/reports"),
                },
                {
                  icon: Database,
                  label: "Backup Data",
                  color: "#64748B",
                  bg: "rgba(100,116,139,0.15)",
                  permission: P.SETTINGS_FULL,
                  action: triggerBackup,
                },
                {
                  icon: ShieldCheck,
                  label: "Security Scan",
                  color: "#EF4444",
                  bg: "rgba(239,68,68,0.12)",
                  permission: P.SETTINGS_FULL,
                  action: triggerSecurityScan,
                },
              ].map((action) => (
                <PermissionGate key={action.label} requires={action.permission}>
                  <button
                    onClick={action.action}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-all group cursor-pointer w-full"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
                      style={{
                        backgroundColor: action.bg,
                      }}
                    >
                      <action.icon
                        size={22}
                        style={{
                          color: action.color,
                        }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-foreground text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                </PermissionGate>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {/* ADD EMPLOYEE MODAL */}
        {isAddEmployeeOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsAddEmployeeOpen(false)}
            />
            <m.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
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
                      setEmployeeForm({
                        ...employeeForm,
                        name: e.target.value,
                      })
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
            </m.div>
          </div>
        )}

        {/* POST ANNOUNCEMENT MODAL */}
        {isPostAnnouncementOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsPostAnnouncementOpen(false)}
            />
            <m.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
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
            </m.div>
          </div>
        )}

        {/* RESOLVE PENDING ACTION MODAL */}
        {activePendingAction && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setActivePendingAction(null)}
            />
            <m.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="relative bg-card w-full max-w-sm rounded-3xl p-6 border border-border shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: activePendingAction.bg,
                }}
              >
                <activePendingAction.icon
                  size={28}
                  style={{
                    color: activePendingAction.color,
                  }}
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
                <span
                  style={{
                    color: activePendingAction.color,
                  }}
                >
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
                <PermissionGate requires={P.EMPLOYEES_MANAGE}>
                  <button
                    onClick={() => handleResolveAction(activePendingAction.title)}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 shadow-md shadow-primary/25 transition-all cursor-pointer"
                  >
                    Resolve / Approve
                  </button>
                </PermissionGate>
              </div>
            </m.div>
          </div>
        )}

        {/* SYSTEM TASK PROGRESS MODAL */}
        {systemTaskType && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            />
            <m.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
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
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              <span className="text-[12px] font-black text-primary">
                {progressPercent}% Completed
              </span>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
