import { lazy, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../shared/permission-engine/PermissionContext";
import { P } from "../../shared/permission-engine/permissions";
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Search,
  X,
  Calendar,
} from "lucide-react";
const AreaChart = lazy(() =>
  import("recharts").then((m) => ({
    default: m.AreaChart,
  })),
);
const Area = lazy(() =>
  import("recharts").then((m) => ({
    default: m.Area,
  })),
);
const XAxis = lazy(() =>
  import("recharts").then((m) => ({
    default: m.XAxis,
  })),
);
const YAxis = lazy(() =>
  import("recharts").then((m) => ({
    default: m.YAxis,
  })),
);
const CartesianGrid = lazy(() =>
  import("recharts").then((m) => ({
    default: m.CartesianGrid,
  })),
);
const Tooltip = lazy(() =>
  import("recharts").then((m) => ({
    default: m.Tooltip,
  })),
);
const ResponsiveContainer = lazy(() =>
  import("recharts").then((m) => ({
    default: m.ResponsiveContainer,
  })),
);
const PieChart = lazy(() =>
  import("recharts").then((m) => ({
    default: m.PieChart,
  })),
);
const Pie = lazy(() =>
  import("recharts").then((m) => ({
    default: m.Pie,
  })),
);
const Cell = lazy(() =>
  import("recharts").then((m) => ({
    default: m.Cell,
  })),
);
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
const HEADCOUNT_TREND_DATA = {
  Monthly: [
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
  Yearly: [
    {
      month: "Apr",
      count: 1150,
    },
    {
      month: "May",
      count: 1170,
    },
    {
      month: "Jun",
      count: 1190,
    },
    {
      month: "Jul",
      count: 1205,
    },
    {
      month: "Aug",
      count: 1220,
    },
    {
      month: "Sep",
      count: 1235,
    },
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
};
const DEPT_DIST = [
  {
    name: "Engineering",
    value: 450,
    color: "#10B981",
  },
  {
    name: "Sales",
    value: 320,
    color: "#8B5CF6",
  },
  {
    name: "Marketing",
    value: 180,
    color: "#F59E0B",
  },
  {
    name: "Others",
    value: 334,
    color: "#0EA5E9",
  },
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
const DEPT_ATTENDANCE = [
  {
    name: "Engineering",
    value: 94,
  },
  {
    name: "Sales",
    value: 88,
  },
  {
    name: "Marketing",
    value: 91,
  },
  {
    name: "Operations",
    value: 95,
  },
  {
    name: "HR",
    value: 98,
  },
];
export function HRDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [timeRange, setTimeRange] = useState<"Monthly" | "Yearly">("Monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS);

  if (!user?.organizationId) {
    return (
      <div className="w-full p-8 text-center bg-card rounded-2xl border border-red-500/20 m-6">
        <h3 className="text-lg font-bold text-red-500">Organization Access Required</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please select or switch to a valid organization tenant.
        </p>
      </div>
    );
  }

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const handleApproveLeave = (name: string) => {
    if (!hasPermissionKey(P.LEAVE_APPROVE)) {
      showToast("Permission Denied: Leave approval permission required", "error");
      return;
    }
    setLeaveRequests((prev) => prev.filter((req) => req.name !== name));
    showToast(`Approved leave request for ${name}`, "success");
  };
  const handleRejectLeave = (name: string) => {
    if (!hasPermissionKey(P.LEAVE_APPROVE)) {
      showToast("Permission Denied: Leave approval permission required", "error");
      return;
    }
    setLeaveRequests((prev) => prev.filter((req) => req.name !== name));
    showToast(`Rejected leave request for ${name}`, "error");
  };
  const handleProcessAllLeaves = () => {
    if (!hasPermissionKey(P.LEAVE_APPROVE)) {
      showToast("Permission Denied: Leave approval permission required", "error");
      return;
    }
    if (leaveRequests.length === 0) {
      showToast("No pending leave requests to process", "info");
      return;
    }
    setLeaveRequests([]);
    showToast("Approved all pending leave requests", "success");
  };
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 relative">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
            <Users size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold text-foreground">
              HR Dashboard
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Welcome back, {user?.name || "Alex Johnson"}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!hasPermissionKey(P.RECRUITMENT_MANAGE)) {
                showToast("Permission Denied: Recruitment permission required", "error");
                return;
              }
              navigate("/recruitment");
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:opacity-90 shadow-lg shadow-primary/20 cursor-pointer border-none"
          >
            Create Job Post
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-wrap items-center gap-8 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/leave")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 outline-none"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-foreground tracking-tight">
            {leaveRequests.length + 8} pending leave requests
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!hasPermissionKey(P.RECRUITMENT_MANAGE)) {
              showToast("Permission Denied: Recruitment permission required", "error");
              return;
            }
            navigate("/recruitment");
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 outline-none"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-foreground tracking-tight">
            8 new applications today
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/payroll")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 outline-none"
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[12px] font-bold text-foreground tracking-tight">
            Payroll process starts in 2 days
          </span>
        </button>
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
            bg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            path: "/employees",
          },
          {
            icon: UserCheck,
            label: "NEW HIRES",
            value: "24",
            sub: "Last 30 days",
            color: "#8B5CF6",
            bg: "bg-purple-500/10",
            iconColor: "text-purple-500",
            path: "/onboarding",
          },
          {
            icon: UserX,
            label: "ATTRITION RATE",
            value: "1.2%",
            sub: "Last month: 1.4%",
            color: "#EF4444",
            bg: "bg-red-500/10",
            iconColor: "text-red-500",
            path: "/offboarding",
          },
          {
            icon: Briefcase,
            label: "OPEN POSITIONS",
            value: "18",
            sub: "5 high priority",
            color: "#F59E0B",
            bg: "bg-amber-500/10",
            iconColor: "text-amber-500",
            path: "/recruitment",
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
            onClick={() => navigate(kpi.path)}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-[10px] mb-4 flex items-center justify-center ${kpi.bg}`}
            >
              <kpi.icon size={24} className={kpi.iconColor} />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Headcount Trend
            </h3>
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setTimeRange("Monthly")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                  timeRange === "Monthly"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("Yearly")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                  timeRange === "Yearly"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEADCOUNT_TREND_DATA[timeRange]}>
                <defs>
                  <linearGradient id="hrColorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.1)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: "var(--muted-foreground)",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: "var(--muted-foreground)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
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
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-6">
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
                  {DEPT_DIST.map((entry) => (
                    <Cell key={`cell-${entry.color}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {DEPT_DIST.map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: dept.color,
                    }}
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

      {/* ═══ ROW 3 — LEAVES & ATTENDANCE ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leaves Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div
              onClick={() => navigate("/leave?tab=approvals")}
              className="p-6 border-b border-border flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-colors"
            >
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Leave Approvals
              </h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-primary text-[11px] font-black rounded-lg border border-primary/20">
                {leaveRequests.length + 8} PENDING
              </span>
            </div>
            <div className="divide-y divide-border">
              {leaveRequests.length === 0 ? (
                <div className="p-8 text-center text-[13px] font-bold text-muted-foreground">
                  All leave requests processed!
                </div>
              ) : (
                leaveRequests.map((req) => (
                  <div
                    key={req.name}
                    className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
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
                    <div className="flex gap-2 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveLeave(req.name);
                        }}
                        className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer border-none"
                        title="Approve Leave"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectLeave(req.name);
                        }}
                        className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer border-none"
                        title="Reject Leave"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-4 text-center border-t border-border mt-auto">
            <button
              type="button"
              onClick={handleProcessAllLeaves}
              className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer bg-transparent border-none"
            >
              Process All Leaves
            </button>
          </div>
        </div>

        {/* Consolidated Attendance Overview Widget */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Attendance Overview
                </h3>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  Overall Attendance Rate
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-600 uppercase tracking-wider">
                94% Overall
              </span>
            </div>
            <div className="space-y-4">
              {DEPT_ATTENDANCE.map((dept, i) => (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-bold text-foreground">
                    <span>{dept.name}</span>
                    <span>{dept.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <m.div
                      initial={{
                        x: "-100%",
                      }}
                      animate={{
                        x: `-${100 - dept.value}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                      }}
                      className="h-full rounded-full bg-emerald-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
              <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-foreground leading-tight">
                  Retention Alert
                </p>
                <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                  High attrition risk detected in Sales department for Mid-level roles.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/attendance")}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-[12px] uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer border-none shadow-md shadow-primary/20"
            >
              View Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Floating custom Notification Toasts */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <m.div
              key={toast.id}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.9,
              }}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-[350px] border text-[13px] font-bold ${toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : toast.type === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-sky-500/10 border-sky-500/20 text-sky-500"}`}
            >
              <span className="text-foreground">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={14} />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
