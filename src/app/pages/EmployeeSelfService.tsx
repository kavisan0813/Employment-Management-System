import { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  IndianRupee,
  MessageSquare,
  User,
  Download,
  Zap,
  Star,
  Target,
  Users,
  Home,
  Sparkles,
  ArrowUpRight,
  CalendarX,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/workflow/ToastNotification";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ i, v }));
  const id = `sp${color.replace(/[^a-z0-9]/gi, "").slice(0, 8)}`;
  return (
    <ResponsiveContainer width={90} height={36}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.22} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#${id})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- Mock Data (Theme-aware versions) ---
const PENDING_ACTIONS = [
  {
    id: 1,
    title: "Leave request pending approval",
    desc: "Manager review required for your PTO on Apr 15",
    icon: Calendar,
    color: "var(--primary)",
    bg: "var(--secondary)",
    status: "Pending",
    route: "/leave",
  },
  {
    id: 2,
    title: "Upload Aadhar card",
    desc: "Document required for statutory compliance",
    icon: FileText,
    color: "var(--destructive)",
    bg: "rgba(239, 68, 68, 0.1)",
    status: "Overdue",
    route: "/my-documents",
  },
  {
    id: 3,
    title: "Complete self-review by Apr 25",
    desc: "Part of Q1 Performance Appraisal cycle",
    icon: Star,
    color: "var(--primary)",
    bg: "var(--secondary)",
    status: "Due Soon",
    route: "/performance",
  },
  {
    id: 4,
    title: 'Complete "Docker Basics" course',
    desc: "Self-learning module due by the end of month",
    icon: BookOpen,
    color: "var(--primary)",
    bg: "var(--secondary)",
    status: "Due Soon",
    route: "/training",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Apply Leave",
    icon: Calendar,
    route: "/leave",
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    label: "Download Payslip",
    icon: Download,
    route: "/payroll",
    color: "#7C3AED",
    bg: "rgba(124, 58, 237, 0.1)",
  },
  {
    label: "My Expenses",
    icon: Receipt,
    route: "/expenses",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    label: "My Documents",
    icon: FileText,
    route: "/my-documents",
    color: "#0EA5E9",
    bg: "rgba(14, 165, 233, 0.1)",
  },
  {
    label: "Update Profile",
    icon: User,
    route: "/profile",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
  },
  {
    label: "Raise Ticket",
    icon: MessageSquare,
    route: "/support",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    label: "View Team",
    icon: Users,
    route: "/employees",
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    label: "My Goals",
    icon: Target,
    route: "/goals",
    color: "var(--destructive)",
    bg: "rgba(239, 68, 68, 0.1)",
  },
];

const ANNOUNCEMENTS = [
  {
    title: "Townhall Meeting",
    time: "2 hours ago",
    priority: "green",
    desc: "Quarterly updates & vision sharing",
  },
  {
    title: "Health & Wellness",
    time: "1 day ago",
    priority: "amber",
    desc: "Meditation session tomorrow",
  },
  {
    title: "Policy Update",
    time: "2 days ago",
    priority: "red",
    desc: "New travel reimbursement policy",
  },
];

export function EmployeeSelfService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  // Attendance Punch State
  const [punchState, setPunchState] = useState<{
    isPunchedIn: boolean;
    punchInTime: string | null;
    punchInTimestamp: number | null;
    punchOutTime: string | null;
    workedHours: string | null;
  }>({
    isPunchedIn: false,
    punchInTime: null,
    punchInTimestamp: null,
    punchOutTime: null,
    workedHours: null,
  });

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`nexus_punch_${user.email}`);
      if (saved) {
        setPunchState(JSON.parse(saved));
      }
    }
  }, [user]);

  const handlePunchIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timestamp = Date.now();
    const newState = {
      isPunchedIn: true,
      punchInTime: timeStr,
      punchInTimestamp: timestamp,
      punchOutTime: null,
      workedHours: null,
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast(
      "Punched In",
      "success",
      `Shift started successfully at ${timeStr}.`,
    );
  };

  const handlePunchOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const elapsedMs = Date.now() - (punchState.punchInTimestamp || Date.now());
    const elapsedSecs = Math.floor(elapsedMs / 1000);
    const elapsedMins = Math.floor(elapsedSecs / 60);

    let workedStr = "";
    if (elapsedMins < 1) {
      workedStr = `${elapsedSecs} seconds`;
    } else if (elapsedMins < 60) {
      workedStr = `${elapsedMins} mins`;
    } else {
      workedStr = `${(elapsedMs / (1000 * 60 * 60)).toFixed(2)} hours`;
    }

    const newState = {
      ...punchState,
      isPunchedIn: false,
      punchOutTime: timeStr,
      workedHours: workedStr,
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast(
      "Punched Out",
      "success",
      `Shift completed at ${timeStr}. Duration: ${workedStr}`,
    );
  };

  const handleResetPunch = () => {
    const newState = {
      isPunchedIn: false,
      punchInTime: null,
      punchInTimestamp: null,
      punchOutTime: null,
      workedHours: null,
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.removeItem(`nexus_punch_${user.email}`);
    }
    showToast("Shift Reset", "info", "You can now punch in for a new shift.");
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
    showToast("Opening Module", "info", "Navigating to " + route);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 animate-in fade-in duration-700 bg-background">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-primary/10 flex items-center justify-center shadow-sm border border-primary/20">
            <Home size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none mb-1">
              My Dashboard
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground">
              Monday, April 6, 2026
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm w-fit">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[12px] font-black text-primary uppercase tracking-widest">
            Live Status
          </span>
        </div>
      </div>

      {/* ─── Greeting Banner ──────────────────────────────────────── */}
      <div className="w-full bg-card rounded-2xl p-8 mb-8 flex items-center justify-between border border-border shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-[22px] font-black text-foreground mb-1">
            Good Morning, Priya! 👋
          </h2>
          <p className="text-[14px] font-medium text-muted-foreground">
            You have{" "}
            <span className="text-primary font-bold">3 pending actions</span>{" "}
            that require your attention today.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20">
              Engineering Team
            </div>
            <p className="text-[11px] font-bold text-muted-foreground mt-1">
              #EMP-0142
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden shadow-inner">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">
              {user?.initials || "PS"}
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 — ATTENDANCE */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group overflow-hidden">
          <div className="absolute top-10 right-6">
            <Sparkline
              data={[20, 25, 22, 28, 26, 32, 30]}
              color="var(--primary)"
            />
          </div>
          <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center mb-6">
            <Calendar size={18} className="text-primary" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            ATTENDANCE
          </p>
          <p className="text-[28px] font-black text-primary">92%</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[12px] font-bold text-[#6B7280]">
              22/24 days
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black border border-primary/20">
              +2.1%
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/attendance");
            }}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        {/* Card 2 — LEAVE BALANCE */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group overflow-hidden">
          <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center mb-6">
            <CalendarX size={18} className="text-amber-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            LEAVE BALANCE
          </p>
          <p className="text-[28px] font-black text-foreground">12</p>
          <div className="flex flex-col mt-3">
            <span className="text-[12px] font-bold text-[#6B7280] mb-1">
              days remaining
            </span>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              CL: 6 | EL: 4 | SL: 2
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/leave");
            }}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        {/* Card 3 — CURRENT SALARY */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group overflow-hidden">
          <div className="w-9 h-9 rounded-[10px] bg-indigo-500/10 flex items-center justify-center mb-6">
            <IndianRupee size={18} className="text-indigo-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            CURRENT CTC
          </p>
          <p className="text-[28px] font-black text-indigo-500">₹18L</p>
          <div className="flex flex-col mt-3">
            <span className="text-[12px] font-bold text-[#6B7280] mb-1">
              Annual package
            </span>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              Revised Apr 2025
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/payroll");
            }}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        {/* Card 4 — PERFORMANCE */}
        <div
          onClick={() => handleQuickAction("/performance")}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group overflow-hidden cursor-pointer active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center mb-6">
            <Star size={18} className="text-primary" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            PERFORMANCE
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-[28px] font-black text-primary">4.5</p>
            <p className="text-[16px] font-bold text-muted-foreground/60">
              / 5
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[12px] font-bold text-[#6B7280]">
              Last review: Dec '25
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black border border-primary/20 uppercase tracking-tighter">
              Excellent
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/performance");
            }}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── LEFT COLUMN (65%) ──────────────────────────────────── */}
        <div className="lg:w-[65%] space-y-8">
          {/* PENDING ACTIONS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                PENDING ACTIONS
              </h3>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {PENDING_ACTIONS.map((action, i) => (
                <div
                  key={action.id}
                  className={`flex items-center justify-between p-5 hover:bg-secondary transition-all cursor-pointer ${i !== PENDING_ACTIONS.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: action.bg }}
                    >
                      <action.icon size={18} style={{ color: action.color }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-foreground truncate">
                        {action.title}
                      </h4>
                      <p className="text-[12px] text-muted-foreground truncate font-medium">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        action.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : action.status === "Overdue"
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {action.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.route);
                      }}
                      className="text-primary text-[13px] font-bold hover:underline whitespace-nowrap"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAY'S SCHEDULE */}
          <div className="bg-card rounded-2xl p-7 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-black text-foreground">
                Today's Shift Attendance
              </h3>
              <span className="text-[12px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
                {new Date().toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-secondary/50 rounded-2xl p-6 border-l-[4px] border-primary">
              <div className="flex-1">
                <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">
                  MORNING SHIFT (09:00 – 18:00)
                </p>
                {punchState.isPunchedIn ? (
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[16px] font-black text-foreground flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Active Shift In Progress
                    </p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      Punched in at:{" "}
                      <span className="text-foreground font-bold">
                        {punchState.punchInTime}
                      </span>
                    </p>
                  </div>
                ) : punchState.punchOutTime ? (
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[16px] font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                      ✓ Shift Completed
                    </p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      In:{" "}
                      <span className="text-foreground font-bold">
                        {punchState.punchInTime}
                      </span>{" "}
                      | Out:{" "}
                      <span className="text-foreground font-bold">
                        {punchState.punchOutTime}
                      </span>
                    </p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      Total worked:{" "}
                      <span className="text-primary font-black">
                        {punchState.workedHours}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[16px] font-black text-muted-foreground">
                      Not Punched In Yet
                    </p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      Please punch in to record your attendance.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {punchState.isPunchedIn ? (
                  <button
                    onClick={handlePunchOut}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                  >
                    Punch Out
                  </button>
                ) : punchState.punchOutTime ? (
                  <button
                    onClick={handleResetPunch}
                    className="px-6 py-3 rounded-xl bg-[#00B87C] hover:bg-[#009966] text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg active:scale-[0.98] transition-all border-none cursor-pointer"
                  >
                    Reset Shift
                  </button>
                ) : (
                  <button
                    onClick={handlePunchIn}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B87C] to-[#009966] hover:from-[#00c987] hover:to-[#00a36d] text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                  >
                    Punch In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN (35%) ─────────────────────────────────── */}
        <div className="lg:w-[35%] space-y-8">
          {/* QUICK ACTIONS */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-primary fill-primary" />
              <h3 className="text-[14px] font-black text-foreground">
                Quick Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.route)}
                  onMouseEnter={() => setHoveredAction(i)}
                  onMouseLeave={() => setHoveredAction(null)}
                  className="flex flex-col items-start gap-3 p-4 rounded-xl border transition-all duration-200 group text-left h-[100px] justify-between relative overflow-hidden"
                  style={{
                    backgroundColor:
                      hoveredAction === i ? action.bg : "var(--background)",
                    borderColor:
                      hoveredAction === i
                        ? `${action.color}30`
                        : "var(--border)",
                    boxShadow:
                      hoveredAction === i
                        ? `0 4px 14px ${action.color}15`
                        : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: action.bg }}
                  >
                    <action.icon size={16} style={{ color: action.color }} />
                  </div>
                  <span className="text-[11px] font-black text-foreground leading-tight transition-colors">
                    {action.label}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="absolute top-4 right-4 text-muted-foreground/40 group-hover:text-primary transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-black text-foreground">
                Announcements
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black border border-primary/20">
                3 new
              </span>
            </div>

            <div className="space-y-4">
              {ANNOUNCEMENTS.map((ann, i) => (
                <div
                  key={i}
                  className={`pl-3 border-l-[3px] py-1 ${
                    ann.priority === "green"
                      ? "border-primary"
                      : ann.priority === "amber"
                        ? "border-amber-500"
                        : "border-rose-500"
                  }`}
                >
                  <h4 className="text-[13px] font-black text-foreground hover:text-primary cursor-pointer transition-colors leading-tight mb-1">
                    {ann.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {ann.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="text-[11px] text-muted-foreground font-medium truncate">
                      {ann.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/notifications")}
              className="w-full mt-6 py-3 text-primary text-[13px] font-black hover:underline text-center"
            >
              View All Announcements →
            </button>
          </div>

          {/* MILESTONE WIDGET */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden group cursor-pointer">
            <Sparkles
              size={80}
              className="absolute -right-4 -bottom-4 text-white opacity-10 group-hover:rotate-12 transition-transform duration-500"
            />
            <h3 className="text-[16px] font-black mb-1">
              Company Goal Reached!
            </h3>
            <p className="text-white/80 text-[12px] font-medium mb-4">
              We hit 100% of our Q1 targets. Well done team!
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="w-6 h-6 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-white"
                >
                  +
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
