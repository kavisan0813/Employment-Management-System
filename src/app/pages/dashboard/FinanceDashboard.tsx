import { useNavigate } from "react-router";
import {
  Home,
  CalendarCheck,
  CalendarX,
  IndianRupee,
  Star,
  FileText,
  Receipt,
  Download,
  Target,
  Users,
  HelpCircle,
  ChevronRight,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";

/* ═══════════════════════════════════════════════════════════════
   FINANCE PERSONAL DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export function FinancePersonalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ── Greeting ─────────────────────────────────────────── */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const firstName = user?.name?.split(" ")[0] || "Ananya";
  const initials = user?.initials || "AD";

  /* ── KPI DATA ─────────────────────────────────────────── */
  const kpiCards = [
    {
      icon: CalendarCheck,
      iconBg: "#DCFCE7",
      iconColor: "#00B87C",
      label: "MY ATTENDANCE",
      value: "94%",
      valueColor: "#00B87C",
      sub: "22/24 working days",
      trend: "+2.1%",
      trendColor: "#00B87C",
      trendBg: "rgba(0,184,124,0.1)",
    },
    {
      icon: CalendarX,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      label: "LEAVE BALANCE",
      value: "12",
      valueColor: "#F59E0B",
      sub: "days remaining",
      trend: "CL:6  EL:4  SL:2",
      trendColor: "#6B7280",
      trendBg: "transparent",
    },
    {
      icon: IndianRupee,
      iconBg: "#EDE9FE",
      iconColor: "#8B5CF6",
      label: "MY CTC",
      value: "₹12L",
      valueColor: "#8B5CF6",
      sub: "Annual package",
      trend: "Effective Jan 2026",
      trendColor: "#6B7280",
      trendBg: "transparent",
    },
    {
      icon: Star,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      label: "MY RATING",
      value: "4.3★",
      valueColor: "#F59E0B",
      sub: "Last review: Dec 2025",
      trend: "B+",
      trendColor: "#8B5CF6",
      trendBg: "rgba(139,92,246,0.1)",
    },
  ];

  /* ── PENDING ACTIONS ──────────────────────────────────── */
  const pendingActions = [
    {
      icon: CalendarX,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      title: "Apply for Leave",
      desc: "CL Balance: 6 days",
      chip: "8 days remaining",
      chipColor: "#00B87C",
      chipBg: "rgba(0,184,124,0.1)",
      onClick: () => navigate("/leave", { state: { openApplyModal: true } }),
    },
    {
      icon: FileText,
      iconBg: "#EDE9FE",
      iconColor: "#8B5CF6",
      title: "Upload Investment Declaration",
      desc: "Required for accurate TDS calculation",
      chip: "Due Apr 30",
      chipColor: "#F59E0B",
      chipBg: "rgba(245,158,11,0.1)",
      onClick: () =>
        navigate("/my-documents", { state: { activeTab: "Financial" } }),
    },
    {
      icon: Star,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      title: "Complete Self-Review",
      desc: "Performance review due April 25",
      chip: "19 days left",
      chipColor: "#F59E0B",
      chipBg: "rgba(245,158,11,0.1)",
      onClick: () =>
        navigate("/performance", { state: { activeTab: "Self Review" } }),
    },
    {
      icon: Receipt,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      title: "Submit Pending Expense",
      desc: "1 draft expense claim unpublished",
      chip: "Draft",
      chipColor: "#6B7280",
      chipBg: "rgba(107,114,128,0.1)",
      onClick: () =>
        navigate("/finance/my-expenses", { state: { activeTab: "Draft" } }),
    },
  ];

  /* ── QUICK ACTIONS ────────────────────────────────────── */
  const quickActions = [
    {
      icon: CalendarX,
      label: "Apply Leave",
      color: "#00B87C",
      bg: "#DCFCE7",
      onClick: () => navigate("/leave", { state: { openApplyModal: true } }),
    },
    {
      icon: Download,
      label: "Download Payslip",
      color: "#8B5CF6",
      bg: "#EDE9FE",
      onClick: () => navigate("/payslips"),
    },
    {
      icon: Receipt,
      label: "Submit Expense",
      color: "#F59E0B",
      bg: "#FEF3C7",
      onClick: () =>
        navigate("/finance/my-expenses", {
          state: { openNewExpense: true },
        }),
    },
    {
      icon: Target,
      label: "My Goals",
      color: "#EF4444",
      bg: "#FEE2E2",
      onClick: () => navigate("/goals"),
    },
    {
      icon: Users,
      label: "View Team",
      color: "#0EA5E9",
      bg: "#E0F2FE",
      onClick: () => navigate("/employees"),
    },
    {
      icon: HelpCircle,
      label: "Raise Ticket",
      color: "#6366F1",
      bg: "#EEF2FF",
      onClick: () => navigate("/support"),
    },
  ];

  /* ── ANNOUNCEMENTS ────────────────────────────────────── */
  const announcements = [
    {
      id: 1,
      title: "System Downtime: Scheduled Maintenance",
      time: "2 hours ago",
      borderColor: "#EF4444",
      type: "URGENT",
    },
    {
      id: 2,
      title: "Quarterly Townhall Meeting — Q1 Review",
      time: "5 hours ago",
      borderColor: "#F59E0B",
      type: "IMPORTANT",
    },
    {
      id: 3,
      title: "Enhanced Health Insurance Benefits",
      time: "1 day ago",
      borderColor: "#00B87C",
      type: "INFO",
    },
  ];

  /* ── TEAM ─────────────────────────────────────────────── */
  const teamMembers = [
    {
      name: "Rajan Kumar",
      initials: "RK",
      role: "Finance Lead",
      status: "online",
      statusColor: "#22C55E",
    },
    {
      name: "Priya Nair",
      initials: "PN",
      role: "Payroll Analyst",
      status: "away",
      statusColor: "#F59E0B",
    },
    {
      name: "Vikram Mehta",
      initials: "VM",
      role: "Tax Specialist",
      status: "offline",
      statusColor: "#9CA3AF",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500">
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-[10px]"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#DCFCE7",
            }}
          >
            <Home size={22} color="#00B87C" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              My Dashboard
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              Your personal workspace
            </p>
          </div>
        </div>
        {/* Live Pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(0,184,124,0.08)",
            border: "1px solid rgba(0,184,124,0.2)",
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B87C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00B87C]" />
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#00B87C",
              letterSpacing: "0.5px",
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* ═══════ GREETING BANNER ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-card rounded-2xl p-8 mb-8 flex items-center justify-between border border-border shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA5E9]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-[22px] font-bold text-foreground mb-1">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-[14px] font-medium text-muted-foreground">
            You have{" "}
            <span className="text-[#0EA5E9] font-bold">
              {pendingActions.length} pending actions
            </span>{" "}
            today.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-[11px] font-bold uppercase tracking-wider border border-[#0EA5E9]/20">
              Finance
            </div>
            <p className="text-[11px] font-bold text-muted-foreground mt-1">
              #EMP-1082
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-[#0EA5E9]/20 p-0.5 overflow-hidden shadow-inner">
            <div className="w-full h-full rounded-full bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {initials}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════ KPI CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35 }}
            className="rounded-2xl p-5 group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-[10px]"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: kpi.iconBg,
                }}
              >
                <kpi.icon size={18} color={kpi.iconColor} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {kpi.label}
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: kpi.valueColor,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {kpi.value}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {kpi.sub}
            </p>
            <div className="mt-3">
              <span
                className="px-2.5 py-1 rounded-lg inline-block"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: kpi.trendColor,
                  backgroundColor: kpi.trendBg,
                }}
              >
                {kpi.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══════ MAIN 2-COLUMN LAYOUT ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* ─── LEFT COLUMN (65%) ─── */}
        <div className="lg:col-span-6 space-y-6">
          {/* PENDING ACTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-5 pt-5 pb-2 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#00B87C]" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Pending Actions
              </span>
              <span
                className="ml-auto px-2 py-0.5 rounded-full"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#EF4444",
                  backgroundColor: "rgba(239,68,68,0.1)",
                }}
              >
                {pendingActions.length}
              </span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {pendingActions.map((action, idx) => (
                <div
                  key={idx}
                  onClick={action.onClick}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all group"
                  style={{ minHeight: 52 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F0FDF4")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: action.iconBg,
                    }}
                  >
                    <action.icon size={16} color={action.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {action.title}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {action.desc}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-lg shrink-0"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: action.chipColor,
                      backgroundColor: action.chipBg,
                    }}
                  >
                    {action.chip}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* TODAY'S SCHEDULE */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="rounded-2xl"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-5 pt-5 pb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#00B87C]" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Today's Schedule
              </span>
            </div>
            <div className="px-5 pb-5">
              <div
                onClick={() => navigate("/schedule")}
                className="rounded-xl px-4 py-3.5 cursor-pointer transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]"
                style={{
                  backgroundColor: "#DCFCE7",
                  borderLeft: "3px solid #00B87C",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#009966",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      MORNING SHIFT
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "var(--foreground)",
                        margin: "4px 0 0",
                      }}
                    >
                      06:00 – 14:00
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        margin: "2px 0 0",
                        fontWeight: 500,
                      }}
                    >
                      HQ Office, Chennai · Check-in: 09:05 AM ✓
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="#009966" />
                    <ChevronRight size={16} color="#009966" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT COLUMN (35%) ─── */}
        <div className="lg:col-span-4 space-y-6">
          {/* QUICK ACTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9CA3AF",
                margin: "0 0 12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={qa.onClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all group"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = qa.bg;
                    e.currentTarget.style.borderColor = qa.color + "40";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: qa.bg,
                    }}
                  >
                    <qa.icon size={18} color={qa.color} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--foreground)",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {qa.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* LATEST ANNOUNCEMENTS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            className="rounded-2xl"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Latest Announcements
              </h3>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#00B87C",
                  backgroundColor: "rgba(0,184,124,0.1)",
                }}
              >
                3 new
              </span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() =>
                    navigate("/notifications", {
                      state: { activeTab: "Announcements" },
                    })
                  }
                  className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-all hover:bg-[var(--accent)]"
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: ann.borderColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {ann.title}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--muted-foreground)",
                        margin: "2px 0 0",
                        fontWeight: 500,
                      }}
                    >
                      {ann.time}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-muted-foreground shrink-0 mt-1"
                  />
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 pt-1">
              <button
                onClick={() => navigate("/notifications")}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#00B87C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: 0,
                }}
              >
                View All Announcements <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* MY TEAM QUICK VIEW */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="rounded-2xl"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-5 pt-5 pb-2">
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                My Team / Colleagues
              </h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--accent)] transition-all"
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs"
                      style={{
                        background: "linear-gradient(135deg, #0EA5E9, #0369A1)",
                      }}
                    >
                      {member.initials}
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{
                        backgroundColor: member.statusColor,
                        borderColor: "var(--card)",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {member.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {member.role}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full capitalize"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: member.statusColor,
                      backgroundColor: member.statusColor + "18",
                    }}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 pt-2">
              <button
                onClick={() => navigate("/smart-search")}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#00B87C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: 0,
                }}
              >
                View Full Directory <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
