import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  UserMinus,
  UserPlus,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  BookOpen,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  departmentHeadcount,
  attendanceOverview,
  recentActivities,
} from "../data/mockData";

const kpiCards = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12 this month",
    changePositive: true,
    icon: Users,
    iconBg: "linear-gradient(135deg, #059669, #047857)",
    accent: "#059669",
    lightBg: "#ECFDF5",
  },
  {
    title: "Present Today",
    value: "219",
    change: "88.3% attendance",
    changePositive: true,
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #22C55E, #16A34A)",
    accent: "#22C55E",
    lightBg: "#F0FDF4",
  },
  {
    title: "On Leave",
    value: "17",
    change: "6.9% of workforce",
    changePositive: false,
    icon: UserMinus,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
  },
  {
    title: "New This Month",
    value: "12",
    change: "+3 vs last month",
    changePositive: true,
    icon: UserPlus,
    iconBg: "linear-gradient(135deg, #14B8A6, #0D9488)",
    accent: "#14B8A6",
    lightBg: "#F0FDFA",
  },
];

const activityIcons: Record<string, any> = {
  UserPlus,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  BookOpen,
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 shadow-lg"
        style={{ 
          backgroundColor: "var(--popover)", 
          border: "1px solid var(--border)",
          color: "var(--popover-foreground)" 
        }}
      >
        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "2px" }}>{label}</p>
        <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 shadow-lg"
        style={{ 
          backgroundColor: "var(--popover)", 
          border: "1px solid var(--border)",
          color: "var(--popover-foreground)" 
        }}
      >
        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "2px" }}>{payload[0].name}</p>
        <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Background accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.07]"
              style={{ background: card.accent, transform: "translate(30%, -30%)" }}
            />
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: "44px",
                  height: "44px",
                  background: card.iconBg,
                  boxShadow: `0 4px 12px ${card.accent}40`,
                }}
              >
                <card.icon size={20} color="white" />
              </div>
              <button
                className="rounded-lg p-1.5 transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>
              {card.title}
            </p>
            <p style={{ color: "var(--foreground)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>
              {card.value}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: card.changePositive ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  color: card.changePositive ? "#10B981" : "#F59E0B",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Department Headcount - Horizontal Bar Chart */}
        <div
          className="col-span-2 rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
                Department Headcount
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
                Employee distribution by department
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
              style={{
                color: "var(--primary)",
                backgroundColor: "var(--secondary)",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onClick={() => navigate("/employees")}
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={departmentHeadcount}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="department"
                type="category"
                tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
              <Bar
                key="bar-count"
                dataKey="count"
                radius={[0, 6, 6, 0]}
                fill="var(--primary)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Overview - Donut Chart */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-4">
            <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
              Attendance Overview
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              Today, April 6, 2026
            </p>
          </div>

          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={attendanceOverview}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {attendanceOverview.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label overlay */}
          <div className="flex flex-col gap-2 mt-1">
            {attendanceOverview.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>
                    {item.value}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${item.color}18`,
                      color: item.color,
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {Math.round((item.value / 248) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-4 rounded-xl p-3 text-center"
            style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Total Workforce</p>
            <p style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>248</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Stats + Recent Activity */}
      <div className="grid grid-cols-3 gap-5">
        {/* Quick Links */}
        <div className="col-span-1 grid grid-cols-1 gap-4">
          {[
            {
              title: "Next Payroll",
              value: "Apr 30, 2026",
              sub: "24 days away",
              icon: DollarSign,
              color: "#10B981",
              bg: "rgba(16, 185, 129, 0.1)",
            },
            {
              title: "Open Positions",
              value: "7 Roles",
              sub: "43 applications pending",
              icon: Briefcase,
              color: "#14B8A6",
              bg: "rgba(20, 184, 166, 0.1)",
            },
            {
              title: "Performance Reviews",
              value: "Q1 2026",
              sub: "Completed: 248 / 248",
              icon: Star,
              color: "#22C55E",
              bg: "rgba(34, 197, 94, 0.1)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01] shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: item.bg,
                }}
              >
                <item.icon size={18} color={item.color} />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 500 }}>{item.title}</p>
                <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>{item.value}</p>
                <p style={{ color: item.color, fontSize: "11px", opacity: 0.8 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div
          className="col-span-2 rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
                Recent Activity
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
                Latest updates across the system
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
              style={{
                color: "var(--primary)",
                backgroundColor: "var(--secondary)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, i) => {
              const Icon = activityIcons[activity.icon];
              return (
                <div key={activity.id} className="flex items-start gap-4 p-2 rounded-xl transition-colors hover:bg-var(--background)">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: `${activity.color}15`,
                    }}
                  >
                    {Icon && <Icon size={16} style={{ color: activity.color }} />}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        color: "var(--foreground)",
                        fontSize: "13px",
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {activity.text}
                    </p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "1px" }}>
                      {activity.subtext}
                    </p>
                  </div>
                  {/* Time */}
                  <span
                    className="shrink-0 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--muted-foreground)",
                      fontSize: "11px",
                      border: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}