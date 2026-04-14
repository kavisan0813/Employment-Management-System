import { Download, FileText, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const headcountTrend = [
  { month: "Oct", count: 228 },
  { month: "Nov", count: 233 },
  { month: "Dec", count: 235 },
  { month: "Jan", count: 237 },
  { month: "Feb", count: 241 },
  { month: "Mar", count: 244 },
  { month: "Apr", count: 248 },
];

const reports = [
  {
    title: "Headcount Report",
    desc: "Full employee roster with details",
    icon: Users,
    color: "#059669",
    bg: "#ECFDF5",
    generated: "Today",
    size: "248 records",
  },
  {
    title: "Payroll Summary",
    desc: "Monthly payroll breakdown",
    icon: DollarSign,
    color: "#22C55E",
    bg: "#F0FDF4",
    generated: "Apr 1, 2026",
    size: "8 pages",
  },
  {
    title: "Attendance Report",
    desc: "Monthly attendance logs",
    icon: Calendar,
    color: "#F59E0B",
    bg: "#FFFBEB",
    generated: "Apr 1, 2026",
    size: "30 days",
  },
  {
    title: "Performance Review",
    desc: "Q1 2026 performance scores",
    icon: TrendingUp,
    color: "#14B8A6",
    bg: "#F0FDFA",
    generated: "Mar 31, 2026",
    size: "248 reviews",
  },
  {
    title: "Recruitment Pipeline",
    desc: "Hiring funnel & candidate stats",
    icon: FileText,
    color: "#0EA5E9",
    bg: "#F0F9FF",
    generated: "Apr 5, 2026",
    size: "12 candidates",
  },
  {
    title: "Turnover Analysis",
    desc: "Employee retention metrics",
    icon: Users,
    color: "#EF4444",
    bg: "#FEF2F2",
    generated: "Mar 31, 2026",
    size: "Annual",
  },
];

export function Reports() {
  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: "248", color: "#059669" },
          { label: "Monthly Payroll", value: "$86,584", color: "#22C55E" },
          { label: "Attendance Rate", value: "88.3%", color: "#F59E0B" },
          { label: "Turnover Rate", value: "3.2%", color: "#EF4444" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl px-5 py-4 shadow-sm"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: "24px", fontWeight: 800, marginTop: "2px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Headcount Trend Chart */}
        <div
          className="col-span-2 rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
            Headcount Growth Trend
          </h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "20px" }}>
            Oct 2025 — Apr 2026
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={headcountTrend}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[220, 255]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#064E3B",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#059669"
                strokeWidth={3}
                fill="url(#areaGrad)"
                dot={{ fill: "#059669", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
            Key Metrics
          </h3>
          <div className="space-y-4">
            {[
              { label: "Avg. Tenure", value: "3.2 years", bar: 64, color: "#059669" },
              { label: "Avg. Salary", value: "$94,200", bar: 72, color: "#22C55E" },
              { label: "Training Hours", value: "48 hrs/yr", bar: 48, color: "#14B8A6" },
              { label: "Retention Rate", value: "96.8%", bar: 97, color: "#F59E0B" },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>{m.label}</span>
                  <span style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{m.value}</span>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: "5px", backgroundColor: "#D1FAE5" }}
                >
                  <div
                    className="rounded-full"
                    style={{ width: `${m.bar}%`, height: "100%", backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
          Available Reports
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex items-start justify-between transition-all cursor-pointer border border-border bg-background"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--secondary)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--background)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{ width: "36px", height: "36px", backgroundColor: report.bg }}
                >
                  <report.icon size={16} color={report.color} />
                </div>
                <div>
                  <p style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{report.title}</p>
                  <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "1px" }}>{report.desc}</p>
                  <p style={{ color: "#CBD5E1", fontSize: "10px", marginTop: "4px" }}>
                    {report.size} · {report.generated}
                  </p>
                </div>
              </div>
              <button
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5";
                  (e.currentTarget as HTMLButtonElement).style.color = "#059669";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
                }}
              >
                <Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
