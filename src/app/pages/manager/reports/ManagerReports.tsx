import { useState, useRef } from "react";
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
  Cell,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Line,
} from "recharts";
import {
  Users,
  TrendingUp,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Download,
  Shield,
  RefreshCw,
  ChevronDown,
  RotateCcw,
  BarChart3,
} from "lucide-react";

/* ═══════════════════════════════════════════
   COLOR PALETTE — matches admin green theme
═══════════════════════════════════════════ */
const G = {
  primary: "#00B87C",
  dark: "#059669",
  light: "#34D39A",
  bg: "rgba(0, 184, 124, 0.05)",
  bgCard: "rgba(0, 184, 124, 0.1)",
  blue: "#0EA5E9",
  amber: "#F59E0B",
  rose: "#EF4444",
  slate: "#64748B",
  purple: "#8B5CF6",
};

/* ═══════════════════════════════════════════
   PERIOD DATA
═══════════════════════════════════════════ */
type Period = "Week" | "Month" | "Quarter";

const PERIOD_META: Record<
  Period,
  {
    label: string;
    kpi: {
      members: number;
      memberDelta: number;
      newJoins: number;
      attendance: string;
      attendanceDelta: string;
      goalPct: number;
      goalDelta: string;
      teamCost: string;
      costDelta: string;
      overtime: string;
      overtimeAlerts: number;
    };
    perfTrend: { label: string; score: number; target: number }[];
    attTrend: { label: string; rate: number }[];
    leaveDist: { name: string; value: number; color: string }[];
    goalItems: { name: string; done: number; total: number; color: string }[];
    pipeline: { stage: string; count: number; pct: number; color: string }[];
  }
> = {
  Week: {
    label: "This Week",
    kpi: {
      members: 12,
      memberDelta: 0,
      newJoins: 0,
      attendance: "93%",
      attendanceDelta: "+2.1%",
      goalPct: 78,
      goalDelta: "+5%",
      teamCost: "₹1.2L",
      costDelta: "+0.3%",
      overtime: "18 hrs",
      overtimeAlerts: 1,
    },
    perfTrend: [
      { label: "Mon", score: 83, target: 85 },
      { label: "Tue", score: 87, target: 85 },
      { label: "Wed", score: 84, target: 85 },
      { label: "Thu", score: 91, target: 85 },
      { label: "Fri", score: 89, target: 85 },
    ],
    attTrend: [
      { label: "Mon", rate: 92 },
      { label: "Tue", rate: 97 },
      { label: "Wed", rate: 88 },
      { label: "Thu", rate: 95 },
      { label: "Fri", rate: 94 },
    ],
    leaveDist: [
      { name: "Casual", value: 2, color: G.primary },
      { name: "Sick", value: 1, color: G.rose },
      { name: "WFH", value: 4, color: G.blue },
      { name: "Earned", value: 0, color: G.amber },
    ],
    goalItems: [
      { name: "Sprint Tasks", done: 14, total: 18, color: G.primary },
      { name: "Code Reviews", done: 6, total: 7, color: G.blue },
      { name: "Bug Fixes", done: 9, total: 10, color: G.purple },
    ],
    pipeline: [
      { stage: "On Track", count: 9, pct: 75, color: G.primary },
      { stage: "At Risk", count: 2, pct: 17, color: G.amber },
      { stage: "Blocked", count: 1, pct: 8, color: G.rose },
    ],
  },
  Month: {
    label: "This Month",
    kpi: {
      members: 12,
      memberDelta: 0,
      newJoins: 1,
      attendance: "94%",
      attendanceDelta: "+1.4%",
      goalPct: 81,
      goalDelta: "+3%",
      teamCost: "₹4.8L",
      costDelta: "+0.8%",
      overtime: "42 hrs",
      overtimeAlerts: 2,
    },
    perfTrend: [
      { label: "W1", score: 81, target: 85 },
      { label: "W2", score: 86, target: 85 },
      { label: "W3", score: 83, target: 85 },
      { label: "W4", score: 90, target: 85 },
    ],
    attTrend: [
      { label: "W1", rate: 91 },
      { label: "W2", rate: 94 },
      { label: "W3", rate: 88 },
      { label: "W4", rate: 95 },
    ],
    leaveDist: [
      { name: "Casual", value: 18, color: G.primary },
      { name: "Sick", value: 12, color: G.rose },
      { name: "WFH", value: 24, color: G.blue },
      { name: "Earned", value: 8, color: G.amber },
    ],
    goalItems: [
      { name: "Sprint Goals", done: 8, total: 10, color: G.primary },
      { name: "Quarterly OKRs", done: 5, total: 8, color: G.blue },
      { name: "Training Plans", done: 9, total: 12, color: G.purple },
      { name: "Code Reviews", done: 14, total: 15, color: G.dark },
    ],
    pipeline: [
      { stage: "Completed", count: 36, pct: 80, color: G.primary },
      { stage: "In Progress", count: 6, pct: 13, color: G.blue },
      { stage: "Overdue", count: 3, pct: 7, color: G.rose },
    ],
  },
  Quarter: {
    label: "Q2 2026",
    kpi: {
      members: 12,
      memberDelta: 2,
      newJoins: 2,
      attendance: "93%",
      attendanceDelta: "+2.8%",
      goalPct: 82,
      goalDelta: "+7%",
      teamCost: "₹14.2L",
      costDelta: "+4.2%",
      overtime: "142 hrs",
      overtimeAlerts: 3,
    },
    perfTrend: [
      { label: "Apr", score: 79, target: 85 },
      { label: "May", score: 84, target: 85 },
      { label: "Jun", score: 88, target: 85 },
    ],
    attTrend: [
      { label: "Apr", rate: 90 },
      { label: "May", rate: 93 },
      { label: "Jun", rate: 95 },
    ],
    leaveDist: [
      { name: "Casual", value: 42, color: G.primary },
      { name: "Sick", value: 28, color: G.rose },
      { name: "WFH", value: 65, color: G.blue },
      { name: "Earned", value: 19, color: G.amber },
    ],
    goalItems: [
      { name: "OKR Targets", done: 14, total: 20, color: G.primary },
      { name: "Training Certs", done: 9, total: 12, color: G.blue },
      { name: "Delivery Goals", done: 18, total: 22, color: G.purple },
      { name: "Team Goals", done: 11, total: 14, color: G.dark },
    ],
    pipeline: [
      { stage: "Completed", count: 52, pct: 74, color: G.primary },
      { stage: "In Progress", count: 12, pct: 17, color: G.blue },
      { stage: "Overdue", count: 6, pct: 9, color: G.rose },
    ],
  },
};

/* ═══════════════════════════════════════════
   TEAM MEMBERS
═══════════════════════════════════════════ */
const TEAM = [
  {
    id: 1,
    name: "Priya Mehta",
    role: "Sr. Engineer",
    avatar: "PM",
    score: 92,
    attendance: 97,
    goals: 85,
    workload: 88,
    status: "active",
    trend: "up",
  },
  {
    id: 2,
    name: "Arjun Singh",
    role: "Engineer II",
    avatar: "AS",
    score: 78,
    attendance: 91,
    goals: 72,
    workload: 95,
    status: "active",
    trend: "up",
  },
  {
    id: 3,
    name: "Kavitha Rao",
    role: "UX Designer",
    avatar: "KR",
    score: 88,
    attendance: 98,
    goals: 90,
    workload: 72,
    status: "active",
    trend: "stable",
  },
  {
    id: 4,
    name: "Rohan Desai",
    role: "Product Lead",
    avatar: "RD",
    score: 95,
    attendance: 94,
    goals: 98,
    workload: 98,
    status: "active",
    trend: "up",
  },
  {
    id: 5,
    name: "Sneha Patel",
    role: "QA Engineer",
    avatar: "SP",
    score: 74,
    attendance: 88,
    goals: 68,
    workload: 65,
    status: "leave",
    trend: "down",
  },
  {
    id: 6,
    name: "Kiran Nair",
    role: "Backend Dev",
    avatar: "KN",
    score: 85,
    attendance: 95,
    goals: 80,
    workload: 90,
    status: "active",
    trend: "stable",
  },
  {
    id: 7,
    name: "Deepa Kumar",
    role: "Data Analyst",
    avatar: "DK",
    score: 90,
    attendance: 99,
    goals: 88,
    workload: 78,
    status: "active",
    trend: "up",
  },
  {
    id: 8,
    name: "Vikram Joshi",
    role: "DevOps Eng",
    avatar: "VJ",
    score: 82,
    attendance: 92,
    goals: 76,
    workload: 85,
    status: "active",
    trend: "stable",
  },
  {
    id: 9,
    name: "Ananya Sharma",
    role: "Frontend Dev",
    avatar: "AN",
    score: 70,
    attendance: 85,
    goals: 62,
    workload: 60,
    status: "wfh",
    trend: "down",
  },
  {
    id: 10,
    name: "Rajan Iyer",
    role: "Scrum Master",
    avatar: "RI",
    score: 87,
    attendance: 96,
    goals: 85,
    workload: 82,
    status: "active",
    trend: "up",
  },
  {
    id: 11,
    name: "Meera Nambiar",
    role: "Tech Writer",
    avatar: "MN",
    score: 80,
    attendance: 93,
    goals: 78,
    workload: 70,
    status: "active",
    trend: "stable",
  },
  {
    id: 12,
    name: "Suresh Babu",
    role: "Architect",
    avatar: "SB",
    score: 94,
    attendance: 97,
    goals: 95,
    workload: 96,
    status: "active",
    trend: "up",
  },
];

const radarAvg = [
  {
    subject: "Attendance",
    A: Math.round(TEAM.reduce((s, t) => s + t.attendance, 0) / TEAM.length),
  },
  {
    subject: "Performance",
    A: Math.round(TEAM.reduce((s, t) => s + t.score, 0) / TEAM.length),
  },
  {
    subject: "Goals",
    A: Math.round(TEAM.reduce((s, t) => s + t.goals, 0) / TEAM.length),
  },
  {
    subject: "Workload",
    A: Math.round(TEAM.reduce((s, t) => s + t.workload, 0) / TEAM.length),
  },
  { subject: "Engagement", A: 86 },
  { subject: "Training", A: 83 },
];

/* ─── helpers ─── */
function avatarColor(id: number) {
  const cols = [G.primary, G.blue, G.purple, G.amber];
  return cols[id % cols.length];
}

function AvatarBubble({
  initials,
  size = 32,
  color = G.primary,
  status,
}: {
  initials: string;
  size?: number;
  color?: string;
  status?: string;
}) {
  const dot: Record<string, string> = {
    active: G.primary,
    leave: G.amber,
    wfh: G.blue,
  };
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${color}25,${color}50)`,
          border: `1.5px solid ${color}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.33,
          fontWeight: 800,
          color,
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: dot[status] || "#94A3B8",
            border: "1.5px solid var(--card)",
          }}
        />
      )}
    </div>
  );
}

function ChartTip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !Array.isArray(payload) || !payload.length) return null;
  return (
    <div
      style={{
        background: "#0A2E1A",
        border: `1px solid ${G.primary}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: "white",
        boxShadow: `0 8px 24px ${G.primary}44`,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, color: G.light }}>
        {String(label)}
      </div>
      {(payload as Array<{ name: string; value: number; color?: string }>).map(
        (p, i) => (
          <div key={i} style={{ color: p.color || "white" }}>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ),
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   KPI STAT CARD  (matches admin style)
═══════════════════════════════════════════ */
function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  delta,
  deltaType,
  value,
  label,
  sub,
}: {
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
  delta?: string;
  deltaType?: "up" | "down" | "alert";
  value: string;
  label: string;
  sub?: string;
}) {
  const deltaColors = { up: G.primary, down: G.rose, alert: G.amber };
  const deltaBg = {
    up: G.bgCard,
    down: "rgba(239, 68, 68, 0.1)",
    alert: "rgba(245, 158, 11, 0.1)",
  };
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = "translateY(-2px)";
        d.style.boxShadow = `0 8px 24px ${G.primary}18`;
      }}
      onMouseLeave={(e) => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = "none";
        d.style.boxShadow = "none";
      }}
    >
      {/* bg blob */}
      <div
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: iconBg,
          opacity: 0.25,
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color={iconColor} />
        </div>
        {delta && deltaType && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: deltaColors[deltaType],
              background: deltaBg[deltaType],
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            {delta}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 900,
          color: "var(--foreground)",
          letterSpacing: "-0.5px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--muted-foreground)",
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "var(--muted-foreground)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION CARD
═══════════════════════════════════════════ */
function SCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export function ManagerReports() {
  const [period, setPeriod] = useState<Period>("Month");
  const [teamFilter, setTeamFilter] = useState("Engineering");
  const [showTeamDrop, setShowTeamDrop] = useState(false);
  const [memberFilter, setMemberFilter] = useState("All");
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = (msg: string) => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setShowToast(msg);
    toastRef.current = setTimeout(() => setShowToast(null), 3000);
  };

  const meta = PERIOD_META[period];
  const activeCount = TEAM.filter((t) => t.status === "active").length;
  const teamHealth = Math.round(
    TEAM.reduce((s, t) => s + t.score, 0) / TEAM.length,
  );

  const filteredMembers = TEAM.filter((m) => {
    if (memberFilter === "Active") return m.status === "active";
    if (memberFilter === "On Leave") return m.status === "leave";
    if (memberFilter === "WFH") return m.status === "wfh";
    return true;
  });

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "var(--background)",
        minHeight: "100%",
      }}
    >
      {/* ══════ HEADER ══════ */}
      <div
        style={{
          padding: "28px 32px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${G.primary}, ${G.dark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 20px ${G.primary}44`,
            }}
          >
            <BarChart3 size={22} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "var(--foreground)",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Team Reports & Analytics
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                margin: 0,
                marginTop: 2,
              }}
            >
              My Engineering Team · {activeCount} active of {TEAM.length}{" "}
              members
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => {
                setIsRefreshing(false);
                toast("Data refreshed");
              }, 1200);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <RefreshCw
              size={15}
              color="var(--muted-foreground)"
              style={{
                animation: isRefreshing ? "spin 0.8s linear infinite" : "none",
              }}
            />
          </button>
          <button
            onClick={() => toast("Exporting report...")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              background: `linear-gradient(135deg, ${G.primary}, ${G.dark})`,
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${G.primary}44`,
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "none";
            }}
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* ══════ FILTER BAR ══════ */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          marginTop: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Period tabs */}
          <div
            style={{
              display: "flex",
              background: "var(--secondary)",
              borderRadius: 10,
              padding: 3,
              border: "1px solid var(--border)",
            }}
          >
            {(["Week", "Month", "Quarter"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  toast(`Switched to ${p} view`);
                }}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  transition: "all 0.2s",
                  background: period === p ? G.primary : "transparent",
                  color: period === p ? "white" : "var(--muted-foreground)",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Team dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowTeamDrop(!showTeamDrop)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              📋 {teamFilter} <ChevronDown size={13} />
            </button>
            {showTeamDrop && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  zIndex: 20,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  minWidth: 160,
                }}
              >
                {["Engineering", "My Team Only", "All Reports"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTeamFilter(opt);
                      setShowTeamDrop(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 16px",
                      border: "none",
                      background: teamFilter === opt ? G.bgCard : "transparent",
                      color:
                        teamFilter === opt ? G.primary : "var(--foreground)",
                      fontSize: 12,
                      fontWeight: teamFilter === opt ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setPeriod("Month");
              setTeamFilter("Engineering");
              setMemberFilter("All");
              toast("Filters reset");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          Data as of Jun 23, 2026
        </div>
      </div>

      {/* ══════ KPI CARDS ══════ */}
      <div style={{ padding: "20px 32px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 14,
          }}
        >
          <StatCard
            icon={Users}
            iconColor={G.primary}
            iconBg={G.bgCard}
            delta={
              meta.kpi.memberDelta > 0 ? `+${meta.kpi.memberDelta}` : undefined
            }
            deltaType="up"
            value={`${meta.kpi.members}`}
            label="Team Members"
            sub={`${activeCount} active`}
          />
          <StatCard
            icon={TrendingUp}
            iconColor={G.primary}
            iconBg={G.bgCard}
            delta={`+${meta.kpi.newJoins}`}
            deltaType="up"
            value={`${teamHealth}`}
            label="Health Score"
            sub="Composite avg"
          />
          <StatCard
            icon={Shield}
            iconColor={G.blue}
            iconBg="rgba(14, 165, 233, 0.1)"
            delta={meta.kpi.goalDelta}
            deltaType="up"
            value={`${meta.kpi.goalPct}%`}
            label="Goal Completion"
            sub={meta.label}
          />
          <StatCard
            icon={Clock}
            iconColor={G.primary}
            iconBg={G.bgCard}
            delta={meta.kpi.attendanceDelta}
            deltaType="up"
            value={meta.kpi.attendance}
            label="Avg Attendance"
            sub={meta.label}
          />
          <StatCard
            icon={Zap}
            iconColor={G.amber}
            iconBg="rgba(245, 158, 11, 0.1)"
            delta={meta.kpi.costDelta}
            deltaType="up"
            value={meta.kpi.teamCost}
            label="Team Cost"
            sub={meta.label}
          />
          <StatCard
            icon={AlertCircle}
            iconColor={G.rose}
            iconBg="rgba(239, 68, 68, 0.1)"
            delta={`${meta.kpi.overtimeAlerts} Alerts`}
            deltaType="alert"
            value={meta.kpi.overtime}
            label="Active Overtime"
            sub="This period"
          />
        </div>
      </div>

      {/* ══════ ROW 2: Performance Trend + Team Pipeline ══════ */}
      <div
        style={{
          padding: "20px 32px 0",
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 18,
        }}
      >
        {/* Performance Trend */}
        <SCard>
          <div
            style={{
              padding: "20px 24px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Team Performance Trend
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                {meta.label} — avg daily score vs target
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* mini period insight box like admin */}
              <div
                style={{
                  background: G.bgCard,
                  borderRadius: 10,
                  padding: "8px 14px",
                  border: `1px solid ${G.primary}30`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: G.primary,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {meta.label} Avg
                </div>
                <div
                  style={{ fontSize: 18, fontWeight: 900, color: G.primary }}
                >
                  {Math.round(
                    meta.perfTrend.reduce((s, d) => s + d.score, 0) /
                      meta.perfTrend.length,
                  )}
                </div>
                <div style={{ fontSize: 10, color: G.dark }}>
                  +
                  {(
                    Math.round(
                      meta.perfTrend.reduce((s, d) => s + d.score, 0) /
                        meta.perfTrend.length,
                    ) - 85
                  ).toFixed(1)}{" "}
                  vs target
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 24px 20px" }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={meta.perfTrend}>
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={G.primary}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={G.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    domain={[70, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <Tooltip content={<ChartTip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={G.primary}
                    strokeWidth={2.5}
                    fill="url(#perfGrad)"
                    dot={{
                      fill: G.primary,
                      r: 4,
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                    name="Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke={G.rose}
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SCard>

        {/* Team Pipeline */}
        <SCard>
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--foreground)",
              }}
            >
              Team Pipeline
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 12,
                marginTop: 14,
              }}
            >
              {[
                { label: "Total Members", val: `${TEAM.length}` },
                { label: "Conversion", val: `${meta.kpi.goalPct}%` },
                { label: `${period} Active`, val: `${activeCount}` },
                { label: "Pending", val: `${meta.kpi.overtimeAlerts}` },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: "var(--foreground)",
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted-foreground)",
                      marginTop: 2,
                    }}
                  >
                    {s.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {meta.pipeline.map((p) => (
              <div key={p.stage}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: p.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {p.stage}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 110,
                        height: 7,
                        borderRadius: 4,
                        background: "var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${p.pct}%`,
                          height: "100%",
                          borderRadius: 4,
                          background: p.color,
                          transition: "width 0.7s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--muted-foreground)",
                        minWidth: 30,
                      }}
                    >
                      {p.pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SCard>
      </div>

      {/* ══════ ROW 3: Attendance Trend + Radar ══════ */}
      <div
        style={{
          padding: "18px 32px 0",
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 18,
        }}
      >
        {/* Attendance */}
        <SCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Attendance Trend
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                {meta.label} — team attendance rate
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: G.bgCard,
                color: G.primary,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${G.primary}30`,
              }}
            >
              Avg: {meta.kpi.attendance}
            </span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={meta.attTrend}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={G.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={G.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis
                  domain={[80, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke={G.blue}
                  strokeWidth={2.5}
                  fill="url(#attGrad)"
                  dot={{ fill: G.blue, r: 4, stroke: "white", strokeWidth: 2 }}
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* individual bars */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {[...TEAM]
              .sort((a, b) => b.attendance - a.attendance)
              .slice(0, 5)
              .map((m) => {
                const col =
                  m.attendance >= 95
                    ? G.primary
                    : m.attendance >= 88
                      ? G.blue
                      : G.amber;
                return (
                  <div
                    key={m.id}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <AvatarBubble initials={m.avatar} size={24} color={col} />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        width: 100,
                        flexShrink: 0,
                      }}
                    >
                      {m.name.split(" ")[0]}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "var(--border)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${m.attendance}%`,
                          height: "100%",
                          background: col,
                          borderRadius: 3,
                          transition: "width 0.7s",
                          boxShadow: `0 0 6px ${col}55`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: col,
                        minWidth: 35,
                        textAlign: "right",
                      }}
                    >
                      {m.attendance}%
                    </span>
                  </div>
                );
              })}
            <div
              style={{
                fontSize: 11,
                color: "var(--muted-foreground)",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Showing top 5 · {TEAM.length} total members
            </div>
          </div>
        </SCard>

        {/* Radar */}
        <SCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Team Health Radar
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                6-dimension avg
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: G.primary,
                background: G.bgCard,
                padding: "4px 14px",
                borderRadius: 30,
                border: `1px solid ${G.primary}30`,
              }}
            >
              {teamHealth}
            </div>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarAvg}>
                <defs>
                  <radialGradient id="rGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={G.primary} stopOpacity={0.3} />
                    <stop
                      offset="100%"
                      stopColor={G.primary}
                      stopOpacity={0.02}
                    />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 10,
                    fill: "var(--muted-foreground)",
                    fontWeight: 600,
                  }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Team"
                  dataKey="A"
                  stroke={G.primary}
                  strokeWidth={2.5}
                  fill="url(#rGrad)"
                  dot={{
                    fill: G.primary,
                    r: 4,
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginTop: 4,
            }}
          >
            {radarAvg.map((r) => (
              <div
                key={r.subject}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  background: "var(--secondary)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      r.A >= 85 ? G.primary : r.A >= 75 ? G.blue : G.amber,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--foreground)",
                    flex: 1,
                  }}
                >
                  {r.subject}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: r.A >= 85 ? G.primary : r.A >= 75 ? G.blue : G.amber,
                  }}
                >
                  {r.A}
                </span>
              </div>
            ))}
          </div>
        </SCard>
      </div>

      {/* ══════ ROW 4: Goals + Leave ══════ */}
      <div
        style={{
          padding: "18px 32px 0",
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 18,
        }}
      >
        {/* Goals */}
        <SCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Goals & OKRs
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                {meta.label}
              </div>
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: G.primary,
                background: G.bgCard,
                padding: "4px 14px",
                borderRadius: 20,
                border: `1px solid ${G.primary}30`,
              }}
            >
              {meta.kpi.goalPct}%
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {meta.goalItems.map((g) => {
              const pct = Math.round((g.done / g.total) * 100);
              return (
                <div key={g.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}
                    >
                      {g.name}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {g.done}/{g.total}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 900,
                          color: g.color,
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 9,
                      background: "var(--border)",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${g.color}, ${g.color}BB)`,
                        transition: "width 0.8s ease",
                        boxShadow: `0 0 8px ${g.color}44`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* summary row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginTop: 20,
            }}
          >
            {[
              {
                label: "Completed",
                val: meta.goalItems.reduce((s, g) => s + g.done, 0),
                color: G.primary,
              },
              {
                label: "Remaining",
                val: meta.goalItems.reduce((s, g) => s + (g.total - g.done), 0),
                color: G.amber,
              },
              {
                label: "Total",
                val: meta.goalItems.reduce((s, g) => s + g.total, 0),
                color: G.blue,
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  textAlign: "center",
                  padding: "10px 0",
                  background: "var(--secondary)",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </SCard>

        {/* Leave */}
        <SCard style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--foreground)",
              }}
            >
              Leave Distribution
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted-foreground)",
                marginTop: 2,
              }}
            >
              {meta.label} — {meta.leaveDist.reduce((s, d) => s + d.value, 0)}{" "}
              total days
            </div>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={meta.leaveDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {meta.leaveDist.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 8,
            }}
          >
            {meta.leaveDist.map((d) => (
              <div
                key={d.name}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 12, color: "var(--foreground)", flex: 1 }}
                >
                  {d.name}
                </span>
                <div
                  style={{
                    width: 70,
                    height: 5,
                    background: "var(--border)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(d.value / meta.leaveDist.reduce((s, x) => s + x.value, 0)) * 100}%`,
                      height: "100%",
                      background: d.color,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: d.color,
                    minWidth: 30,
                    textAlign: "right",
                  }}
                >
                  {d.value}d
                </span>
              </div>
            ))}
          </div>
          {/* pending approve */}
          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: `${G.amber}12`,
              borderRadius: 12,
              border: `1px solid ${G.amber}30`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: G.amber,
                marginBottom: 8,
              }}
            >
              ⏳ Pending Approvals
            </div>
            {[
              { name: "Sneha Patel", type: "Sick Leave", days: 3 },
              { name: "Ananya Sharma", type: "WFH Request", days: 1 },
            ].map((l) => (
              <div
                key={l.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {l.name}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "var(--muted-foreground)" }}
                  >
                    {l.type} · {l.days}d
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => toast(`Leave approved for ${l.name}`)}
                    style={{
                      padding: "4px 10px",
                      background: `${G.primary}15`,
                      color: G.primary,
                      border: `1px solid ${G.primary}30`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => toast(`Leave declined for ${l.name}`)}
                    style={{
                      padding: "4px 10px",
                      background: `${G.rose}15`,
                      color: G.rose,
                      border: `1px solid ${G.rose}30`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SCard>
      </div>

      {/* ══════ ROW 5: Workload Bar Chart ══════ */}
      <div style={{ padding: "18px 32px 0" }}>
        <SCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Workload Distribution — {meta.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                Capacity utilization per member
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: `${G.rose}15`,
                  color: G.rose,
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                🔴 Overloaded: {TEAM.filter((t) => t.workload >= 90).length}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: G.bgCard,
                  color: G.primary,
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                🟢 Healthy: {TEAM.filter((t) => t.workload < 75).length}
              </span>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TEAM.map((m) => ({
                  name: m.name.split(" ")[0],
                  load: m.workload,
                }))}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTip />} />
                <Bar
                  dataKey="load"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  name="Workload %"
                >
                  {TEAM.map((m, i) => (
                    <Cell
                      key={i}
                      fill={
                        m.workload >= 90
                          ? G.rose
                          : m.workload >= 75
                            ? G.amber
                            : G.primary
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SCard>
      </div>

      {/* ══════ ROW 6: TEAM TABLE ══════ */}
      <div style={{ padding: "18px 32px 32px" }}>
        <SCard>
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                }}
              >
                Direct Reports Overview
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                {filteredMembers.length} of {TEAM.length} members shown
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Active", "On Leave", "WFH"].map((f) => (
                <button
                  key={f}
                  onClick={() => setMemberFilter(f)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 20,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: memberFilter === f ? G.primary : "transparent",
                    color:
                      memberFilter === f ? "white" : "var(--muted-foreground)",
                    border:
                      memberFilter === f ? "none" : "1px solid var(--border)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--secondary)" }}>
                  {[
                    "Member",
                    "Role",
                    "Health Score",
                    "Attendance",
                    "Goals",
                    "Workload",
                    "Status",
                    "Trend",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 18px",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "var(--muted-foreground)",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const col = avatarColor(m.id);
                  const statusMap: Record<
                    string,
                    { label: string; bg: string; color: string }
                  > = {
                    active: { label: "Active", bg: G.bgCard, color: G.primary },
                    leave: { label: "On Leave", bg: "#FEF3C7", color: G.amber },
                    wfh: { label: "WFH", bg: "#EFF6FF", color: G.blue },
                  };
                  const st = statusMap[m.status];
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.15s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = "var(--secondary)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "12px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <AvatarBubble
                            initials={m.avatar}
                            size={32}
                            color={col}
                            status={m.status}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--foreground)",
                            }}
                          >
                            {m.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 18px",
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {m.role}
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              background: "var(--border)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${m.score}%`,
                                height: "100%",
                                borderRadius: 3,
                                background:
                                  m.score >= 85
                                    ? G.primary
                                    : m.score >= 70
                                      ? G.amber
                                      : G.rose,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color:
                                m.score >= 85
                                  ? G.primary
                                  : m.score >= 70
                                    ? G.amber
                                    : G.rose,
                            }}
                          >
                            {m.score}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 18px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: m.attendance >= 90 ? G.primary : G.amber,
                        }}
                      >
                        {m.attendance}%
                      </td>
                      <td
                        style={{
                          padding: "12px 18px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--foreground)",
                        }}
                      >
                        {m.goals}%
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 50,
                              height: 5,
                              borderRadius: 3,
                              background: "var(--border)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${m.workload}%`,
                                height: "100%",
                                borderRadius: 3,
                                background:
                                  m.workload >= 90
                                    ? G.rose
                                    : m.workload >= 75
                                      ? G.amber
                                      : G.primary,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {m.workload}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            background: st.bg,
                            color: st.color,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        {m.trend === "up" ? (
                          <ArrowUpRight size={16} color={G.primary} />
                        ) : m.trend === "down" ? (
                          <ArrowDownRight size={16} color={G.rose} />
                        ) : (
                          <div
                            style={{
                              width: 14,
                              height: 2,
                              background: G.slate,
                              borderRadius: 1,
                              margin: "0 auto",
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SCard>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0A2E1A",
            color: "white",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: `0 8px 32px ${G.primary}55`,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${G.primary}`,
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: G.primary,
            }}
          />
          {showToast}
        </div>
      )}

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(10px); }
                              to   { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}
