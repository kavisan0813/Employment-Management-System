import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, UserCheck, UserMinus, Briefcase, DollarSign, Star,
  BookOpen, ArrowUpRight, MoreHorizontal, TrendingUp, TrendingDown,
  CheckCircle2, Clock, Play, ClipboardList,
  Award, ChevronRight, Activity, Zap, Calendar, Bell,
  Gift, Heart, Cake, UserPlus,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { departmentHeadcount, attendanceOverview, recentActivities } from "../data/mockData";

// ─── Constants ─────────────────────────────────────────────
const HEADCOUNT_TREND = [
  { month: "May",  count: 214 }, { month: "Jun",  count: 218 },
  { month: "Jul",  count: 221 }, { month: "Aug",  count: 225 },
  { month: "Sep",  count: 228 }, { month: "Oct",  count: 233 },
  { month: "Nov",  count: 236 }, { month: "Dec",  count: 238 },
  { month: "Jan",  count: 240 }, { month: "Feb",  count: 243 },
  { month: "Mar",  count: 246 }, { month: "Apr",  count: 248 },
];

const DEPT_ATT = [
  { dept: "Engineering", present: 42, total: 45, color: "#059669" },
  { dept: "Marketing",   present: 28, total: 30, color: "#14B8A6" },
  { dept: "Design",      present: 18, total: 20, color: "#22C55E" },
  { dept: "Finance",     present: 22, total: 25, color: "#F59E0B" },
  { dept: "HR",          present: 12, total: 14, color: "#8B5CF6" },
  { dept: "Sales",       present: 38, total: 44, color: "#EF4444" },
];

const PENDING_APPROVALS = [
  { id: 1, name: "James Carter",   initials: "JC", type: "Leave",   sub: "Annual leave · Apr 10–14", time: "2h ago",  color: "#F59E0B" },
  { id: 2, name: "Priya Sharma",   initials: "PS", type: "WFH",     sub: "Work from home · Apr 9",    time: "3h ago",  color: "#14B8A6" },
  { id: 3, name: "Marcus Williams",initials: "MW", type: "Expense",  sub: "Travel reimbursement",      time: "5h ago",  color: "#8B5CF6" },
  { id: 4, name: "Yuki Tanaka",    initials: "YT", type: "Leave",   sub: "Sick leave · Apr 11",       time: "1d ago",  color: "#F59E0B" },
  { id: 5, name: "Emily Rodriguez",initials: "ER", type: "Overtime", sub: "OT claim · 8 hrs",         time: "1d ago",  color: "#059669" },
];

const UPCOMING_EVENTS = [
  { icon: Cake,      label: "Birthday",    name: "Robert Chen",      date: "Apr 7",  color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  { icon: Heart,     label: "Anniversary", name: "Priya Sharma",     date: "Apr 9",  color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  { icon: Calendar,  label: "Holiday",     name: "Eid Al-Fitr",      date: "Apr 10", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { icon: Star,      label: "Review",      name: "Q1 Perf. Reviews", date: "Apr 15", color: "#059669", bg: "rgba(5,150,105,0.1)"  },
];

const RECENT_HIRES = [
  { name: "Alex Thompson",   role: "Sr. Developer",     dept: "Engineering", joined: "Mar 28, 2026", status: "Active",  avatar: "" },
  { name: "Neha Gupta",      role: "UX Researcher",     dept: "Design",      joined: "Apr 1, 2026",  status: "Active",  avatar: "" },
  { name: "Carlos Mendez",   role: "Sales Executive",   dept: "Sales",       joined: "Apr 3, 2026",  status: "Active",  avatar: "" },
  { name: "Lily Zhang",      role: "Finance Analyst",   dept: "Finance",     joined: "Apr 5, 2026",  status: "Pending", avatar: "" },
];

const QUICK_ACTIONS = [
  { label: "Add Employee",       icon: UserPlus,      route: "/employees",  color: "#059669", bg: "rgba(5,150,105,0.1)"  },
  { label: "Run Payroll",        icon: Play,          route: "/payroll",    color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  { label: "Approve Leaves",     icon: CheckCircle2,  route: "/leave",      color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { label: "Generate Report",    icon: ClipboardList, route: "/reports",    color: "#14B8A6", bg: "rgba(20,184,166,0.1)" },
  { label: "Schedule Interview", icon: Calendar,      route: "/recruitment",color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  { label: "View Appraisals",    icon: Award,         route: "/appraisal",  color: "#059669", bg: "rgba(5,150,105,0.1)"  },
];

const KPI_CARDS = [
  { title: "Total Employees", value: "248",  trend: "+4.9%", up: true,  sub: "+12 this month",       icon: Users,   grad: "linear-gradient(135deg,#059669,#047857)", accent: "#059669", route: "/employees",  spark: [60,65,70,68,72,75,80,78,82,85,88,92] },
  { title: "Present Today",   value: "219",  trend: "+2.1%", up: true,  sub: "88.3% attendance",     icon: UserCheck,grad:"linear-gradient(135deg,#22C55E,#16A34A)", accent: "#22C55E",route: "/attendance", spark: [70,72,75,73,76,80,82,85,83,87,88,90] },
  { title: "On Leave Today",  value: "17",   trend: "-1.2%", up: false, sub: "6.9% of workforce",    icon: UserMinus,grad:"linear-gradient(135deg,#F59E0B,#D97706)", accent: "#F59E0B",route: "/leave",      spark: [30,28,25,27,24,22,20,21,19,17,18,17] },
  { title: "Open Positions",  value: "18",   trend: "+12.5%",up: true,  sub: "6 urgent",             icon: Briefcase,grad:"linear-gradient(135deg,#8B5CF6,#7C3AED)", accent: "#8B5CF6",route: "/recruitment",spark: [10,11,12,13,14,13,15,16,15,17,18,18] },
];

const activityIcons: Record<string, React.ElementType> = {
  UserPlus: Users, Calendar, DollarSign, Briefcase, Star, BookOpen,
};

// ─── Tooltips ──────────────────────────────────────────────
const TrendTip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "10px", padding: "8px 12px" }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: "0 0 2px" }}>{label}</p>
      <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, margin: 0 }}>{payload[0].value} employees</p>
    </div>
  );
};
const PieTip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "10px", padding: "8px 12px" }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: "0 0 2px" }}>{payload[0].name}</p>
      <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, margin: 0 }}>{payload[0].value} employees</p>
    </div>
  );
};

// ─── Sparkline ─────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ i, v }));
  const id = `sp${color.replace(/[^a-z0-9]/gi, "").slice(0, 8)}`;
  return (
    <ResponsiveContainer width={90} height={36}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.22} />
            <stop offset="95%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area dataKey="v" stroke={color} strokeWidth={1.8} fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Avatar initials ───────────────────────────────────────
function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: size * 0.35, fontWeight: 800, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ─── Section header ────────────────────────────────────────
function SectionHeader({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{title}</h3>
        {sub && <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "8px", backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
          {action} <ArrowUpRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const [openMenu,      setOpenMenu]      = useState<number | null>(null);
  const [trendFilter,   setTrendFilter]   = useState<"6M"|"1Y"|"2Y">("1Y");
  const [activePie,     setActivePie]     = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [approvalState, setApprovalState] = useState<Record<number, "approved"|"rejected"|null>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const trendData = trendFilter === "6M" ? HEADCOUNT_TREND.slice(6) :
                    trendFilter === "2Y" ? HEADCOUNT_TREND : HEADCOUNT_TREND;

  const deptColors = ["#059669","#14B8A6","#22C55E","#F59E0B","#8B5CF6","#EF4444","#10B981","#06B6D4"];

  return (
    <div style={{ maxWidth: "1360px" }}>

      {/* ═══ PAGE HEADER ═══ */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>NexusHR EMS</span>
            <ChevronRight size={12} color="var(--muted-foreground)" />
            <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700 }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 38, height: 38, borderRadius: "11px", background: "linear-gradient(135deg,#10B981,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,0.28)" }}>
              <Activity size={18} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--foreground)", margin: 0, letterSpacing: "-0.4px" }}>Dashboard</h2>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Monday, April 6, 2026</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 13px", borderRadius: "20px", backgroundColor: "var(--secondary)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>Live</span>
          </div>
          <button onClick={() => navigate("/reports")}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}>
            <ClipboardList size={13} /> View Reports
          </button>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div ref={menuRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {KPI_CARDS.map((card, i) => (
          <div key={i}
            className="rounded-2xl p-5 relative overflow-hidden cursor-pointer shadow-sm"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", transition: "box-shadow 0.15s, transform 0.15s" }}
            onClick={() => navigate(card.route)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
          >
            {/* Accent glow */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top right, ${card.accent}0A 0%, transparent 65%)`, pointerEvents: "none" }} />
            {/* Left border accent */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: card.grad, borderRadius: "16px 0 0 16px" }} />

            {/* Icon + Sparkline */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ width: 42, height: 42, borderRadius: "12px", background: card.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${card.accent}40` }}>
                <card.icon size={19} color="white" />
              </div>
              <Sparkline data={card.spark} color={card.accent} />
            </div>

            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{card.title}</p>
            <p style={{ fontSize: "30px", fontWeight: 900, color: "var(--foreground)", margin: 0, letterSpacing: "-0.8px", lineHeight: 1.1 }}>{card.value}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{card.sub}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "20px", backgroundColor: card.up ? "rgba(16,185,129,0.1)" : "rgba(220,38,38,0.1)", color: card.up ? "#059669" : "#DC2626", fontSize: "11px", fontWeight: 700 }}>
                {card.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {card.trend}
              </span>
            </div>

            {/* ⋯ menu */}
            <div style={{ position: "absolute", top: "12px", right: "12px" }} onClick={(e) => e.stopPropagation()}>
              <button style={{ width: 26, height: 26, borderRadius: "8px", border: "none", background: openMenu === i ? "var(--secondary)" : "transparent", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === i ? null : i); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; }}
                onMouseLeave={(e) => { if (openMenu !== i) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                <MoreHorizontal size={14} />
              </button>
              {openMenu === i && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", minWidth: "160px", zIndex: 50, overflow: "hidden" }}
                  onClick={(e) => e.stopPropagation()}>
                  {[["View Details", card.route], ["Go to Module", card.route]].map(([lbl, rt], idx) => (
                    <button key={idx} onClick={() => { setOpenMenu(null); navigate(rt); }}
                      style={{ display: "block", width: "100%", padding: "9px 14px", textAlign: "left", fontSize: "13px", color: "var(--foreground)", backgroundColor: "transparent", border: "none", cursor: "pointer", borderBottom: idx === 0 ? "1px solid var(--border)" : "none" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ ROW 2 — HEADCOUNT TREND + DEPT DISTRIBUTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Headcount Trend — area chart (60%) */}
        <div className="lg:col-span-3 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Headcount Trend</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>Total headcount over time</p>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {(["6M","1Y","2Y"] as const).map((f) => (
                <button key={f} onClick={() => setTrendFilter(f)}
                  style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: trendFilter === f ? "var(--primary)" : "var(--secondary)", color: trendFilter === f ? "white" : "var(--muted-foreground)", transition: "all 0.15s" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto","auto"]} width={40} />
              <Tooltip content={<TrendTip />} />
              <Area dataKey="count" stroke="#10B981" strokeWidth={2.2} fill="url(#trendGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981", strokeWidth: 2, stroke: "white" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution — donut (40%) */}
        <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <SectionHeader title="Dept. Distribution" sub="Employees by department" />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={departmentHeadcount} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="count"
                  onMouseEnter={(_: unknown, i: number) => setActivePie(i)}
                  onMouseLeave={() => setActivePie(null)}>
                  {departmentHeadcount.map((_entry, index) => (
                    <Cell key={`dc-${index}`} fill={deptColors[index % deptColors.length]}
                      opacity={activePie === null || activePie === index ? 1 : 0.4} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
            {departmentHeadcount.slice(0, 5).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: deptColors[i % deptColors.length], flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{item.department}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>{item.count}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "6px", backgroundColor: `${deptColors[i % deptColors.length]}18`, color: deptColors[i % deptColors.length] }}>
                    {Math.round((item.count / 248) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — TODAY'S ATTENDANCE + PENDING APPROVALS + UPCOMING EVENTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Today's Attendance — dept progress bars */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <SectionHeader title="Today's Attendance" sub="Per department, live" action="Full Report" onAction={() => navigate("/attendance")} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {DEPT_ATT.map((d, i) => {
              const pct = Math.round((d.present / d.total) * 100);
              return (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{d.dept}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{d.present}/{d.total}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: d.color }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: "20px", backgroundColor: "var(--background)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: "20px", background: d.color, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Overall today */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", padding: "10px 14px", borderRadius: "12px", backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>Overall Today</span>
            <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--primary)" }}>
              {attendanceOverview.find(a => a.name === "Present")?.value ?? 219} / 248
              &nbsp;·&nbsp;
              {Math.round(((attendanceOverview.find(a => a.name === "Present")?.value ?? 219) / 248) * 100)}%
            </span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Pending Approvals</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>Requires your action</p>
            </div>
            <span style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#DC2626", fontSize: "11px", fontWeight: 800, padding: "2px 9px", borderRadius: "20px" }}>
              {PENDING_APPROVALS.filter(p => !approvalState[p.id]).length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PENDING_APPROVALS.map((item) => {
              const state = approvalState[item.id];
              if (state) {
                return (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "12px", backgroundColor: state === "approved" ? "rgba(5,150,105,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${state === "approved" ? "rgba(5,150,105,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                    {state === "approved" ? <CheckCircle2 size={14} color="#059669" /> : <Clock size={14} color="#DC2626" />}
                    <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 600 }}>
                      {item.name} — {state === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                );
              }
              return (
                <div key={item.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "9px 10px", borderRadius: "12px", backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  <Avatar initials={item.initials} color={item.color} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>{item.name}</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px", backgroundColor: `${item.color}15`, color: item.color }}>{item.type}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "1px 0 0" }}>{item.sub}</p>
                    <div style={{ display: "flex", gap: "5px", marginTop: "6px" }}>
                      <button onClick={() => setApprovalState(s => ({ ...s, [item.id]: "approved" }))}
                        style={{ padding: "3px 10px", borderRadius: "7px", fontSize: "11px", fontWeight: 700, backgroundColor: "rgba(5,150,105,0.1)", color: "#059669", border: "none", cursor: "pointer" }}>
                        Approve
                      </button>
                      <button onClick={() => setApprovalState(s => ({ ...s, [item.id]: "rejected" }))}
                        style={{ padding: "3px 10px", borderRadius: "7px", fontSize: "11px", fontWeight: 700, backgroundColor: "rgba(239,68,68,0.1)", color: "#DC2626", border: "none", cursor: "pointer" }}>
                        Reject
                      </button>
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--muted-foreground)", flexShrink: 0 }}>{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <SectionHeader title="Upcoming Events" sub="Next 14 days" action="Calendar" onAction={() => navigate("/attendance")} />
          {/* Mini month header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "12px", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", marginBottom: "12px" }}>
            <Bell size={13} color="var(--muted-foreground)" />
            <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--foreground)" }}>April 2026</span>
            <span style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700 }}>4 events</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {UPCOMING_EVENTS.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "12px", backgroundColor: "var(--background)", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.12s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ev.bg; (e.currentTarget as HTMLDivElement).style.borderColor = `${ev.color}30`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--background)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}>
                <div style={{ width: 32, height: 32, borderRadius: "10px", backgroundColor: ev.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ev.icon size={14} color={ev.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: ev.color, textTransform: "uppercase", letterSpacing: "0.3px" }}>{ev.label}</span>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)", margin: "1px 0 0" }}>{ev.name}</p>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", flexShrink: 0, backgroundColor: "var(--secondary)", padding: "3px 8px", borderRadius: "8px" }}>
                  {ev.date}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "10px", backgroundColor: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)", display: "flex", alignItems: "center", gap: "7px" }}>
            <Gift size={13} color="#059669" />
            <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>3 upcoming birthdays this week</span>
          </div>
        </div>
      </div>

      {/* ═══ ROW 4 — RECENT HIRES + QUICK ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Hires — table (67%) */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Recent Hires</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>Latest additions to the team</p>
            </div>
            <button onClick={() => navigate("/employees")}
              style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "8px", backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.8fr", padding: "9px 20px", backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Role", "Department", "Joined", "Status"].map((col) => (
              <span key={col} style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</span>
            ))}
          </div>
          {RECENT_HIRES.map((hire, i) => {
            const initials = hire.name.split(" ").map(n => n[0]).join("").slice(0, 2);
            const deptColors2: Record<string, string> = { Engineering: "#059669", Design: "#14B8A6", Sales: "#EF4444", Finance: "#F59E0B", HR: "#8B5CF6", Marketing: "#22C55E" };
            const dc = deptColors2[hire.dept] ?? "#059669";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.8fr", padding: "11px 20px", borderBottom: i < RECENT_HIRES.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center", transition: "background-color 0.12s", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--secondary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
                onClick={() => navigate("/employees")}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${dc},${dc}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>{hire.name}</span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{hire.role}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", backgroundColor: `${dc}15`, color: dc, width: "fit-content" }}>{hire.dept}</span>
                <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{hire.joined}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", width: "fit-content", backgroundColor: hire.status === "Active" ? "rgba(5,150,105,0.1)" : "rgba(245,158,11,0.1)", color: hire.status === "Active" ? "#059669" : "#F59E0B" }}>
                  {hire.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions — 2×3 grid (33%) */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "8px", background: "linear-gradient(135deg,#10B981,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={13} color="white" />
            </div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Quick Actions</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {QUICK_ACTIONS.map((action, i) => (
              <button key={i} onClick={() => navigate(action.route)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px",
                  padding: "14px", borderRadius: "14px",
                  backgroundColor: hoveredAction === i ? action.bg : "var(--background)",
                  border: `1px solid ${hoveredAction === i ? action.color + "30" : "var(--border)"}`,
                  cursor: "pointer", transition: "all 0.15s ease", textAlign: "left",
                  boxShadow: hoveredAction === i ? `0 4px 14px ${action.color}15` : "none",
                }}
                onMouseEnter={() => setHoveredAction(i)}
                onMouseLeave={() => setHoveredAction(null)}>
                <div style={{ width: 32, height: 32, borderRadius: "9px", backgroundColor: action.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <action.icon size={15} color={action.color} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: hoveredAction === i ? action.color : "var(--foreground)", lineHeight: 1.3 }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Recent Activity feed teaser */}
          <div style={{ marginTop: "14px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Recent Activity</span>
              <button onClick={() => navigate("/employees")} style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>View all</button>
            </div>
            {recentActivities.slice(0, 3).map((activity) => {
              const Icon = activityIcons[activity.icon];
              return (
                <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "10px", marginBottom: "2px", cursor: "pointer", transition: "background-color 0.1s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--secondary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}>
                  <div style={{ width: 26, height: 26, borderRadius: "8px", backgroundColor: `${activity.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {Icon && <Icon size={11} style={{ color: activity.color }} />}
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--foreground)", margin: 0, flex: 1, lineHeight: 1.3 }}>{activity.text}</p>
                  <span style={{ fontSize: "10px", color: "var(--muted-foreground)", flexShrink: 0 }}>{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
