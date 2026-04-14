import { TrendingUp, Star, Award, Target, Users, ArrowUpRight } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { employees, performanceData } from "../data/mockData";

const radarData = [
  { subject: "Productivity", A: 88, fullMark: 100 },
  { subject: "Quality", A: 92, fullMark: 100 },
  { subject: "Teamwork", A: 85, fullMark: 100 },
  { subject: "Innovation", A: 78, fullMark: 100 },
  { subject: "Leadership", A: 80, fullMark: 100 },
  { subject: "Punctuality", A: 95, fullMark: 100 },
];

const quarterlyData = [
  { name: "Engineering", Q1: 88, Q2: 92 },
  { name: "Marketing", Q1: 82, Q2: 85 },
  { name: "Design", Q1: 90, Q2: 94 },
  { name: "Finance", Q1: 84, Q2: 87 },
  { name: "HR", Q1: 88, Q2: 90 },
  { name: "Sales", Q1: 79, Q2: 83 },
];

export function Performance() {
  const topPerformers = [...employees]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg. Score", value: "88.4%", sub: "+4.2% vs last quarter", color: "#3B82F6", bg: "#EFF6FF", icon: TrendingUp },
          { label: "Top Performers", value: "52", sub: "Score ≥ 90%", color: "#22C55E", bg: "#F0FDF4", icon: Star },
          { label: "Need Improvement", value: "18", sub: "Score < 70%", color: "#EF4444", bg: "#FEF2F2", icon: Target },
          { label: "Reviews Done", value: "248/248", sub: "Q1 2026 complete", color: "#8B5CF6", bg: "#F5F3FF", icon: Award },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: "40px", height: "40px", backgroundColor: card.bg }}
              >
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "12px", fontWeight: 500 }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              {card.value}
            </p>
            <p style={{ color: "#64748B", fontSize: "11px", marginTop: "2px" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Department Comparison */}
        <div
          className="col-span-2 rounded-2xl p-6"
          style={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ color: "#0F172A", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
            Q1 vs Q2 2026 — Department Comparison
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "12px", marginBottom: "20px" }}>
            Average performance scores by department
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={quarterlyData} barCategoryGap="25%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "12px",
                }}
              />
              <Bar key="bar-q1" dataKey="Q1" name="Q1 2026" fill="#BFDBFE" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar key="bar-q2" dataKey="Q2" name="Q2 2026" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ color: "#0F172A", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
            Company Competency
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "12px", marginBottom: "8px" }}>Overall team assessment</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Radar
                key="radar-score"
                name="Score"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ color: "#0F172A", fontSize: "15px", fontWeight: 700 }}>Top Performers — Q1 2026</h3>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ color: "#3B82F6", backgroundColor: "#EFF6FF", fontSize: "12px", fontWeight: 600 }}
          >
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {topPerformers.map((emp, i) => (
            <div key={emp.id} className="flex items-center gap-4">
              <span
                className="flex items-center justify-center rounded-full w-7 h-7 shrink-0"
                style={{
                  backgroundColor: i === 0 ? "#FEF3C7" : i === 1 ? "#F1F5F9" : "#FEF2F2",
                  color: i === 0 ? "#D97706" : i === 1 ? "#64748B" : "#B91C1C",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </span>
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                style={{ border: "2px solid #E2E8F0" }}
              />
              <div className="flex-1">
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>{emp.designation}</p>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: "120px" }}>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: "6px", backgroundColor: "#E2E8F0" }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: `${emp.performance}%`,
                        height: "100%",
                        background:
                          emp.performance >= 95
                            ? "linear-gradient(90deg, #22C55E, #16A34A)"
                            : emp.performance >= 90
                            ? "linear-gradient(90deg, #3B82F6, #1D4ED8)"
                            : "linear-gradient(90deg, #F59E0B, #D97706)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      emp.performance >= 95 ? "#F0FDF4" : emp.performance >= 90 ? "#EFF6FF" : "#FFFBEB",
                    color: emp.performance >= 95 ? "#16A34A" : emp.performance >= 90 ? "#1D4ED8" : "#D97706",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {emp.performance}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}