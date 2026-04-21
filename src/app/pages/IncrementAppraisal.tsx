import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Download, Search, ChevronDown, X, CheckCircle2, XCircle,
  AlertCircle, ArrowUpRight, TrendingUp, Users, Clock,
  DollarSign, Star, Award, ChevronRight, Filter,
  BarChart3, CalendarCheck, IndianRupee, ThumbsUp,
  ThumbsDown, Send, RefreshCw, Info,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, Cell,
} from "recharts";
import { employees } from "../data/mockData";

// ─── Types ────────────────────────────────────────────────
interface AppraisalEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar: string;
  attendancePct: number;
  leaveDays: number;
  lateMarks: number;
  performanceScore: number;
  kpiScore: number;
  managerRating: number;
  recommendedIncrement: number;
  currentSalary: number;
  revisedSalary: number;
  status: "Pending" | "Approved" | "Rejected";
  performanceBand: "Excellent" | "Good" | "Average" | "Poor";
  managerRemarks: string;
  hrRemarks: string;
  workflowStep: number; // 0-4
}

// ─── Mock Appraisal Data ──────────────────────────────────
const appraisalData: AppraisalEmployee[] = employees.map((emp, i) => {
  const attendance = [96, 88, 92, 82, 91, 97, 94, 79, 93, 95][i] ?? 90;
  const perf = emp.performance;
  const kpi = [88, 82, 94, 80, 87, 96, 91, 74, 89, 93][i] ?? 85;
  const mgr = [4.5, 4.0, 4.8, 3.9, 4.3, 5.0, 4.6, 3.5, 4.4, 4.7][i] ?? 4.0;
  const leaveDays = [4, 8, 3, 12, 5, 2, 4, 15, 3, 2][i] ?? 5;
  const lateMarks = [1, 4, 0, 7, 2, 0, 1, 9, 1, 0][i] ?? 3;
  const attWeight = 0.4, perfWeight = 0.6;
  const appraisalScore = attendance * attWeight + perf * perfWeight;
  const increment = appraisalScore >= 92 ? 15 : appraisalScore >= 85 ? 12 : appraisalScore >= 78 ? 8 : attendance < 85 ? 0 : 5;
  const currentSalary = emp.grossSalary * 12;
  const revisedSalary = Math.round(currentSalary * (1 + increment / 100));
  const statuses: ("Pending" | "Approved" | "Rejected")[] = ["Pending", "Approved", "Approved", "Rejected", "Pending", "Approved", "Pending", "Rejected", "Approved", "Approved"];
  const bands: ("Excellent" | "Good" | "Average" | "Poor")[] = perf >= 93 ? ["Excellent"] : perf >= 85 ? ["Good"] : perf >= 75 ? ["Average"] : ["Poor"];
  const remarks = [
    "Outstanding contributor this year. Highly recommend full increment.",
    "Consistent performer, solid delivery on all KPIs.",
    "Exceptional creativity and leadership. Top pick for increment.",
    "Attendance was a concern this cycle. Needs improvement.",
    "Strong HR acumen, great team player.",
    "Outstanding leadership and engineering excellence.",
    "Excellent product thinking and cross-functional collaboration.",
    "Performance below expectations; attendance issues noted.",
    "Reliable operations leader with strong execution.",
    "Stellar sales performance and revenue growth.",
  ];
  return {
    id: emp.id,
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    avatar: emp.avatar,
    attendancePct: attendance,
    leaveDays,
    lateMarks,
    performanceScore: perf,
    kpiScore: kpi,
    managerRating: mgr,
    recommendedIncrement: increment,
    currentSalary,
    revisedSalary,
    status: statuses[i] ?? "Pending",
    performanceBand: bands[0],
    managerRemarks: remarks[i] ?? "Good performance overall.",
    hrRemarks: increment > 0 ? "Eligible for increment as per appraisal policy." : "Recommend review before approval.",
    workflowStep: statuses[i] === "Approved" ? 4 : statuses[i] === "Rejected" ? 2 : 2,
  };
});

const deptIncrementData = [
  { dept: "Engineering", avg: 13.2, employees: 68 },
  { dept: "Design", avg: 14.1, employees: 28 },
  { dept: "Product", avg: 12.8, employees: 36 },
  { dept: "Marketing", avg: 10.5, employees: 42 },
  { dept: "Finance", avg: 8.2, employees: 31 },
  { dept: "Operations", avg: 11.0, employees: 29 },
  { dept: "HR", avg: 9.8, employees: 23 },
  { dept: "Sales", avg: 7.4, employees: 55 },
];

// ─── Badge Components ─────────────────────────────────────
function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const cfg = {
    Pending: { bg: "rgba(245,158,11,0.12)", color: "#D97706", label: "⏳ Pending" },
    Approved: { bg: "rgba(16,185,129,0.12)", color: "#059669", label: "✓ Approved" },
    Rejected: { bg: "rgba(239,68,68,0.12)", color: "#DC2626", label: "✕ Rejected" },
  }[status];
  return (
    <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function AttBadge({ pct }: { pct: number }) {
  const color = pct >= 93 ? "#059669" : pct >= 85 ? "#D97706" : "#DC2626";
  const bg = pct >= 93 ? "rgba(5,150,105,0.1)" : pct >= 85 ? "rgba(217,119,6,0.1)" : "rgba(220,38,38,0.1)";
  return (
    <span style={{ backgroundColor: bg, color, fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px" }}>
      {pct}%
    </span>
  );
}



// ─── Sparkline ────────────────────────────────────────────
function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28, step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ─── Workflow Timeline ─────────────────────────────────────
const WORKFLOW_STEPS = [
  "Attendance Finalized",
  "Performance Reviewed",
  "Increment Recommended",
  "HR Approved",
  "Payroll Revised",
];

function WorkflowTimeline({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {WORKFLOW_STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        const color = done ? "#059669" : active ? "#F59E0B" : "var(--border)";
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: done ? "rgba(5,150,105,0.12)" : active ? "rgba(245,158,11,0.12)" : "var(--secondary)",
                border: `2px solid ${color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {done ? <CheckCircle2 size={14} color="#059669" /> : active ? <Clock size={14} color="#F59E0B" /> : <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--border)" }} />}
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div style={{ width: "2px", height: "24px", backgroundColor: done ? "#059669" : "var(--border)", marginTop: "2px" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < WORKFLOW_STEPS.length - 1 ? "16px" : "0", paddingTop: "4px" }}>
              <p style={{ fontSize: "13px", fontWeight: done || active ? 600 : 400, color: done ? "var(--foreground)" : active ? "#D97706" : "var(--muted-foreground)", margin: 0 }}>
                {label}
              </p>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>
                {done ? "Completed" : active ? "In Progress" : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────
function DetailDrawer({
  emp, onClose, onApprove, onReject, onSendReview, onApplyPayroll,
}: {
  emp: AppraisalEmployee;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSendReview: () => void;
  onApplyPayroll: () => void;
}) {
  const navigate = useNavigate();
  const attScore = emp.attendancePct * 0.4 + emp.performanceScore * 0.6;
  const annualImpact = emp.revisedSalary - emp.currentSalary;
  const monthlyImpact = Math.round(annualImpact / 12);
  const attendanceTrend = [82, 86, 89, 91, emp.attendancePct - 2, emp.attendancePct];
  const perfTrend = [78, 82, 85, 88, emp.performanceScore - 3, emp.performanceScore];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.25)", zIndex: 200 }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "520px",
          backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.16)", zIndex: 201,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(20,184,166,0.04))", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Employee Appraisal Detail
            </span>
            <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px", borderRadius: "8px" }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ position: "relative" }}>
              <img src={emp.avatar} alt={emp.name} style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary)" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10B981", border: "2px solid var(--card)" }} />
            </div>
            <div>
              <p
                style={{ fontSize: "17px", fontWeight: 800, color: "var(--foreground)", margin: 0, cursor: "pointer" }}
                onClick={() => { navigate(`/employees/${emp.id}`); onClose(); }}
              >
                {emp.name}
              </p>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: "2px 0" }}>{emp.designation}</p>
              <p style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600, margin: 0 }}>{emp.department}</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <StatusBadge status={emp.status} />
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "4px" }}>
                ₹{emp.currentSalary.toLocaleString()}/yr
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Attendance Summary */}
          <DrawerSection title="Yearly Attendance Summary" icon={<CalendarCheck size={14} color="var(--primary)" />} linkLabel="View Attendance" onLink={() => { navigate("/attendance"); onClose(); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {[
                { label: "Attendance %", value: `${emp.attendancePct}%`, color: emp.attendancePct >= 93 ? "#059669" : emp.attendancePct >= 85 ? "#D97706" : "#DC2626" },
                { label: "Leave Days", value: emp.leaveDays, color: "#D97706" },
                { label: "Late Marks", value: emp.lateMarks, color: "#DC2626" },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "3px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Monthly Trend</span>
              <Sparkline data={attendanceTrend} color="#10B981" />
            </div>
          </DrawerSection>

          {/* Performance Summary */}
          <DrawerSection title="Performance Summary" icon={<TrendingUp size={14} color="#14B8A6" />} linkLabel="View Performance" onLink={() => { navigate("/performance"); onClose(); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {[
                { label: "Perf. Score", value: `${emp.performanceScore}%`, color: "#059669" },
                { label: "KPI Score", value: `${emp.kpiScore}%`, color: "#14B8A6" },
                { label: "Mgr Rating", value: `${emp.managerRating}/5`, color: "#D97706" },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "3px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Quarterly Trend</span>
              <Sparkline data={perfTrend} color="#14B8A6" />
            </div>
            <div style={{ backgroundColor: "var(--secondary)", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Manager Remarks</p>
              <p style={{ fontSize: "12px", color: "var(--foreground)", margin: 0, lineHeight: 1.5 }}>"{emp.managerRemarks}"</p>
            </div>
          </DrawerSection>

          {/* Increment Recommendation */}
          <DrawerSection title="Increment Recommendation" icon={<IndianRupee size={14} color="#059669" />} linkLabel="View Payroll" onLink={() => { navigate("/payroll"); onClose(); }}>
            <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.06))", borderRadius: "14px", padding: "16px", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "0 0 2px" }}>Final Appraisal Score</p>
                  <p style={{ fontSize: "22px", fontWeight: 900, color: "var(--primary)", margin: 0 }}>{attScore.toFixed(1)}<span style={{ fontSize: "13px", fontWeight: 500 }}>/100</span></p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "0 0 2px" }}>Recommended Increment</p>
                  <p style={{ fontSize: "26px", fontWeight: 900, color: emp.recommendedIncrement > 0 ? "#059669" : "#DC2626", margin: 0 }}>
                    {emp.recommendedIncrement > 0 ? `+${emp.recommendedIncrement}%` : "Not Eligible"}
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ backgroundColor: "var(--card)", borderRadius: "10px", padding: "10px" }}>
                  <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: "0 0 2px" }}>Attendance Weight (40%)</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{(emp.attendancePct * 0.4).toFixed(1)} pts</p>
                </div>
                <div style={{ backgroundColor: "var(--card)", borderRadius: "10px", padding: "10px" }}>
                  <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: "0 0 2px" }}>Performance Weight (60%)</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{(emp.performanceScore * 0.6).toFixed(1)} pts</p>
                </div>
              </div>
            </div>
            {/* Salary revision */}
            <div style={{ backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Current Annual Salary</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>₹{emp.currentSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Revised Annual Salary</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#059669" }}>₹{emp.revisedSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Monthly Increment</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#059669" }}>+₹{monthlyImpact.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Effective Date</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>May 1, 2026</span>
              </div>
            </div>
          </DrawerSection>

          {/* Approval Workflow */}
          <DrawerSection title="Approval Workflow" icon={<Info size={14} color="#D97706" />}>
            <WorkflowTimeline step={emp.workflowStep} />
          </DrawerSection>

          {/* Remarks */}
          <DrawerSection title="HR Remarks" icon={<Star size={14} color="#D97706" />}>
            <div style={{ backgroundColor: "var(--secondary)", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "12px", color: "var(--foreground)", margin: 0, lineHeight: 1.5 }}>"{emp.hrRemarks}"</p>
            </div>
          </DrawerSection>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", backgroundColor: "var(--card)", flexShrink: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <button
              onClick={onApprove}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #047857)", color: "white", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <ThumbsUp size={14} /> Approve Increment
            </button>
            <button
              onClick={onReject}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "12px", backgroundColor: "rgba(239,68,68,0.1)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <ThumbsDown size={14} /> Reject
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button
              onClick={onSendReview}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "12px", backgroundColor: "rgba(245,158,11,0.1)", color: "#D97706", border: "1px solid rgba(245,158,11,0.2)", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <Send size={14} /> Send for Review
            </button>
            <button
              onClick={onApplyPayroll}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "12px", backgroundColor: "rgba(20,184,166,0.1)", color: "#0D9488", border: "1px solid rgba(20,184,166,0.2)", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <IndianRupee size={14} /> Apply to Payroll
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerSection({
  title, icon, children, linkLabel, onLink,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  linkLabel?: string;
  onLink?: () => void;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {icon}
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
        </div>
        {linkLabel && onLink && (
          <button
            onClick={onLink}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
          >
            {linkLabel} <ArrowUpRight size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Success Toast ─────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "warning" | "info"; onClose: () => void }) {
  const cfg = {
    success: { bg: "rgba(5,150,105,0.12)", border: "rgba(5,150,105,0.3)", color: "#059669", Icon: CheckCircle2 },
    warning: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#D97706", Icon: AlertCircle },
    info: { bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.3)", color: "#0D9488", Icon: Info },
  }[type];
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 300, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: "280px" }}>
      <cfg.Icon size={18} color={cfg.color} />
      <span style={{ fontSize: "13px", fontWeight: 600, color: cfg.color }}>{msg}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: cfg.color }}><X size={14} /></button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export function IncrementAppraisal() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2025–2026");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bandFilter, setBandFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<string>("performanceScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selectedEmp, setSelectedEmp] = useState<AppraisalEmployee | null>(null);
  const [empList, setEmpList] = useState<AppraisalEmployee[]>(appraisalData);
  const [showYearDrop, setShowYearDrop] = useState(false);
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showBandDrop, setShowBandDrop] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning" | "info" } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyTarget, setApplyTarget] = useState<AppraisalEmployee | null>(null);

  const yearDRef = useRef<HTMLDivElement>(null);
  const deptDRef = useRef<HTMLDivElement>(null);
  const statusDRef = useRef<HTMLDivElement>(null);
  const bandDRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (yearDRef.current && !yearDRef.current.contains(e.target as Node)) setShowYearDrop(false);
      if (deptDRef.current && !deptDRef.current.contains(e.target as Node)) setShowDeptDrop(false);
      if (statusDRef.current && !statusDRef.current.contains(e.target as Node)) setShowStatusDrop(false);
      if (bandDRef.current && !bandDRef.current.contains(e.target as Node)) setShowBandDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const PAGE_SIZE = 6;
  const YEARS = ["2023–2024", "2024–2025", "2025–2026"];
  const DEPTS = ["All Departments", "Engineering", "Marketing", "Design", "Finance", "HR", "Product", "Sales", "Operations"];
  const STATUSES = ["All", "Pending", "Approved", "Rejected"];
  const BANDS = ["All", "Excellent", "Good", "Average", "Poor"];

  const filtered = empList
    .filter(e =>
      (selectedDept === "All Departments" || e.department === selectedDept) &&
      (statusFilter === "All" || e.status === statusFilter) &&
      (bandFilter === "All" || e.performanceBand === bandFilter) &&
      (searchQuery === "" || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.designation.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortCol] as number;
      const bv = (b as unknown as Record<string, unknown>)[sortCol] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const kpiData = {
    eligible: empList.filter(e => e.recommendedIncrement > 0).length,
    pending: empList.filter(e => e.status === "Pending").length,
    approved: empList.filter(e => e.status === "Approved").length,
    avgAtt: Math.round(empList.reduce((s, e) => s + e.attendancePct, 0) / empList.length),
    avgPerf: Math.round(empList.reduce((s, e) => s + e.performanceScore, 0) / empList.length),
    payrollImpact: empList.filter(e => e.status === "Approved").reduce((s, e) => s + (e.revisedSalary - e.currentSalary), 0),
  };

  const scatterData = empList.map(e => ({ x: e.attendancePct, y: e.performanceScore, name: e.name, dept: e.department, increment: e.recommendedIncrement }));

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
    setPage(0);
  }

  function updateEmpStatus(id: string, status: "Approved" | "Rejected") {
    setEmpList(prev => prev.map(e => e.id === id ? { ...e, status, workflowStep: status === "Approved" ? 4 : 2 } : e));
    setSelectedEmp(prev => prev?.id === id ? { ...prev, status, workflowStep: status === "Approved" ? 4 : 2 } : prev);
  }

  function handleExport() {
    const headers = ["Name", "Department", "Attendance%", "Leave Days", "Late Marks", "Performance Score", "KPI Score", "Manager Rating", "Increment%", "Current Salary", "Revised Salary", "Status"];
    const rows = filtered.map(e => [e.name, e.department, e.attendancePct, e.leaveDays, e.lateMarks, e.performanceScore, e.kpiScore, e.managerRating, e.recommendedIncrement, e.currentSalary, e.revisedSalary, e.status]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `increment_appraisal_${selectedYear.replace("–", "-")}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setToast({ msg: "Export downloaded successfully.", type: "success" });
  }

  function handleApplyPayroll(emp: AppraisalEmployee) {
    setApplyTarget(emp);
    setShowApplyModal(true);
  }
  function confirmApplyPayroll() {
    if (!applyTarget) return;
    setShowApplyModal(false);
    updateEmpStatus(applyTarget.id, "Approved");
    setToast({ msg: `Payroll revised for ${applyTarget.name}. Effective May 1, 2026.`, type: "success" });
    navigate("/payroll");
  }

  function ColHeader({ label, col }: { label: string; col: string }) {
    return (
      <span
        onClick={() => handleSort(col)}
        style={{ cursor: "pointer", userSelect: "none", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.8, color: sortCol === col ? "var(--primary)" : "var(--foreground)" }}
      >
        {label}{sortCol === col ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
      </span>
    );
  }

  function DropBtn({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "10px",
          backgroundColor: "var(--card)", border: `1px solid ${open ? "var(--primary)" : "var(--border)"}`,
          color: "var(--foreground)", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          boxShadow: open ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {label} <ChevronDown size={13} color="var(--muted-foreground)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
    );
  }

  function DropMenu({ items, selected, onSelect, open }: { items: string[]; selected: string; onSelect: (v: string) => void; open: boolean }) {
    if (!open) return null;
    return (
      <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: "180px", zIndex: 150, overflow: "hidden" }}>
        {items.map(item => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            style={{ width: "100%", padding: "9px 14px", textAlign: "left", fontSize: "13px", fontWeight: item === selected ? 700 : 400, color: item === selected ? "var(--primary)" : "var(--foreground)", backgroundColor: item === selected ? "var(--secondary)" : "transparent", border: "none", cursor: "pointer", display: "block" }}
            onMouseEnter={(e) => { if (item !== selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; }}
            onMouseLeave={(e) => { if (item !== selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #10B981, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={18} color="white" />
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", margin: 0, letterSpacing: "-0.4px" }}>
                Increment & Appraisal Evaluation
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
              Review yearly attendance, performance score, and salary revision recommendations before increment approval.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate("/attendance")}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            >
              <CalendarCheck size={13} /> Attendance
            </button>
            <button
              onClick={() => navigate("/performance")}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", backgroundColor: "var(--secondary)", color: "#0D9488", border: "1px solid rgba(20,184,166,0.2)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            >
              <TrendingUp size={13} /> Performance
            </button>
            <button
              onClick={() => navigate("/payroll")}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", backgroundColor: "var(--secondary)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            >
              <IndianRupee size={13} /> Payroll
            </button>
          </div>
        </div>
      </div>

      {/* ── Smart Insights Bar ── */}
      <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "12px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(16,185,129,0.08)", padding: "6px 12px", borderRadius: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#059669" }}>{kpiData.eligible} employees eligible for increment this year</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(245,158,11,0.08)", padding: "6px 12px", borderRadius: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#D97706" }}>
            {empList.filter(e => e.attendancePct < 85).length} employees need manual review (attendance &lt; 85%)
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(20,184,166,0.08)", padding: "6px 12px", borderRadius: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#14B8A6" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#0D9488" }}>
            Estimated payroll increase: ₹{Math.round(empList.reduce((s, e) => s + (e.revisedSalary - e.currentSalary), 0) / 100000).toFixed(1)}L this cycle
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Eligible for Increment", value: kpiData.eligible, icon: Users, color: "#059669", bg: "var(--secondary)", sub: "of 10 total", link: null },
          { label: "Pending Reviews", value: kpiData.pending, icon: Clock, color: "#D97706", bg: "rgba(245,158,11,0.1)", sub: "awaiting action", link: null },
          { label: "Approved Increments", value: kpiData.approved, icon: CheckCircle2, color: "#059669", bg: "rgba(16,185,129,0.1)", sub: "increment approved", link: "/payroll" },
          { label: "Avg. Attendance", value: `${kpiData.avgAtt}%`, icon: CalendarCheck, color: "#14B8A6", bg: "rgba(20,184,166,0.1)", sub: "yearly avg.", link: "/attendance" },
          { label: "Avg. Performance", value: `${kpiData.avgPerf}%`, icon: TrendingUp, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", sub: "yearly avg.", link: "/performance" },
          { label: "Payroll Impact", value: `₹${Math.round(kpiData.payrollImpact / 1000)}K`, icon: DollarSign, color: "#059669", bg: "rgba(5,150,105,0.1)", sub: "annual increment", link: "/payroll" },
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => card.link && navigate(card.link)}
            style={{
              backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)", cursor: card.link ? "pointer" : "default",
              transition: "box-shadow 0.15s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => { if (card.link) { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", backgroundColor: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
              <card.icon size={16} color={card.color} />
            </div>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: "0 0 3px", fontWeight: 500 }}>{card.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 900, color: card.color, margin: "0 0 2px", letterSpacing: "-0.5px" }}>{card.value}</p>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
              {card.sub}{card.link && <ArrowUpRight size={10} style={{ marginLeft: 2 }} />}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter / Control Bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px", maxWidth: "280px" }}>
          <Search size={14} color="var(--muted-foreground)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
            placeholder="Search employees..."
            style={{ width: "100%", paddingLeft: "32px", paddingRight: "10px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--card)", fontSize: "13px", color: "var(--foreground)", boxSizing: "border-box" }}
          />
        </div>

        {/* Year */}
        <div ref={yearDRef} style={{ position: "relative" }}>
          <DropBtn label={selectedYear} open={showYearDrop} onClick={() => setShowYearDrop(v => !v)} />
          <DropMenu items={YEARS} selected={selectedYear} onSelect={v => { setSelectedYear(v); setShowYearDrop(false); setPage(0); }} open={showYearDrop} />
        </div>

        {/* Dept */}
        <div ref={deptDRef} style={{ position: "relative" }}>
          <DropBtn label={selectedDept} open={showDeptDrop} onClick={() => setShowDeptDrop(v => !v)} />
          <DropMenu items={DEPTS} selected={selectedDept} onSelect={v => { setSelectedDept(v); setShowDeptDrop(false); setPage(0); }} open={showDeptDrop} />
        </div>

        {/* Status */}
        <div ref={statusDRef} style={{ position: "relative" }}>
          <DropBtn label={`Status: ${statusFilter}`} open={showStatusDrop} onClick={() => setShowStatusDrop(v => !v)} />
          <DropMenu items={STATUSES} selected={statusFilter} onSelect={v => { setStatusFilter(v); setShowStatusDrop(false); setPage(0); }} open={showStatusDrop} />
        </div>

        {/* Band */}
        <div ref={bandDRef} style={{ position: "relative" }}>
          <DropBtn label={`Band: ${bandFilter}`} open={showBandDrop} onClick={() => setShowBandDrop(v => !v)} />
          <DropMenu items={BANDS} selected={bandFilter} onSelect={v => { setBandFilter(v); setShowBandDrop(false); setPage(0); }} open={showBandDrop} />
        </div>

        {/* Reset */}
        <button
          onClick={() => { setStatusFilter("All"); setBandFilter("All"); setSelectedDept("All Departments"); setSearchQuery(""); setPage(0); }}
          title="Reset Filters"
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "10px", backgroundColor: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
        >
          <RefreshCw size={13} /> Reset
        </button>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={handleExport}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", background: "linear-gradient(135deg, #059669, #047857)", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(5,150,105,0.25)" }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Main Table ── */}
      <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Increment Appraisal Table</h3>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: "2px 0 0" }}>
              {filtered.length} employees · Click row to view details · Sort columns to reorder
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              Page {page + 1} of {totalPages || 1}
            </span>
            <Filter size={14} color="var(--muted-foreground)" />
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: "grid", padding: "10px 20px", backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)", gridTemplateColumns: "2.2fr 1fr 0.9fr 0.7fr 0.7fr 0.9fr 0.8fr 0.8fr 0.9fr 1.1fr 1.1fr 0.9fr 1fr" }}>
          {[
            { label: "Employee", col: "name" },
            { label: "Department", col: "department" },
            { label: "Attendance", col: "attendancePct" },
            { label: "Leaves", col: "leaveDays" },
            { label: "Late", col: "lateMarks" },
            { label: "Perf. Score", col: "performanceScore" },
            { label: "KPI", col: "kpiScore" },
            { label: "Mgr Rating", col: "managerRating" },
            { label: "Increment %", col: "recommendedIncrement" },
            { label: "Current Salary", col: "currentSalary" },
            { label: "Revised Salary", col: "revisedSalary" },
            { label: "Status", col: "status" },
            { label: "Action", col: "" },
          ].map(({ label, col }) => (
            <ColHeader key={label} label={label} col={col} />
          ))}
        </div>

        {/* Table Rows */}
        {visible.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--muted-foreground)", fontSize: "14px" }}>
            No employees match the current filters.
          </div>
        ) : (
          visible.map((emp, i) => {
            const isHov = hoveredRow === emp.id;
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                onMouseEnter={() => setHoveredRow(emp.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid", padding: "12px 20px", alignItems: "center", cursor: "pointer",
                  borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
                  backgroundColor: isHov ? "var(--secondary)" : i % 2 === 0 ? "var(--card)" : "var(--background)",
                  gridTemplateColumns: "2.2fr 1fr 0.9fr 0.7fr 0.7fr 0.9fr 0.8fr 0.8fr 0.9fr 1.1fr 1.1fr 0.9fr 1fr",
                  transition: "background-color 0.12s ease",
                }}
              >
                {/* Employee */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={emp.avatar} alt={emp.name} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{emp.name}</p>
                    <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>{emp.designation}</p>
                  </div>
                </div>
                {/* Department */}
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{emp.department}</span>
                {/* Attendance */}
                <AttBadge pct={emp.attendancePct} />
                {/* Leaves */}
                <span style={{ fontSize: "12px", color: emp.leaveDays > 10 ? "#DC2626" : "var(--foreground)" }}>{emp.leaveDays}d</span>
                {/* Late */}
                <span style={{ fontSize: "12px", color: emp.lateMarks > 5 ? "#DC2626" : emp.lateMarks > 2 ? "#D97706" : "var(--foreground)" }}>{emp.lateMarks}</span>
                {/* Performance */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "40px", height: "4px", borderRadius: "4px", backgroundColor: "var(--border)", overflow: "hidden" }}>
                    <div style={{ width: `${emp.performanceScore}%`, height: "100%", backgroundColor: emp.performanceScore >= 90 ? "#059669" : emp.performanceScore >= 80 ? "#14B8A6" : "#F59E0B", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: emp.performanceScore >= 90 ? "#059669" : emp.performanceScore >= 80 ? "#0D9488" : "#D97706" }}>{emp.performanceScore}%</span>
                </div>
                {/* KPI */}
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{emp.kpiScore}%</span>
                {/* Manager Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{emp.managerRating}</span>
                </div>
                {/* Increment % */}
                <span style={{ fontSize: "13px", fontWeight: 800, color: emp.recommendedIncrement > 0 ? "#059669" : "#DC2626" }}>
                  {emp.recommendedIncrement > 0 ? `+${emp.recommendedIncrement}%` : "—"}
                </span>
                {/* Current Salary */}
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>₹{(emp.currentSalary / 1000).toFixed(0)}K</span>
                {/* Revised Salary */}
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>₹{(emp.revisedSalary / 1000).toFixed(0)}K</span>
                {/* Status */}
                <StatusBadge status={emp.status} />
                {/* Action */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }} onClick={e => e.stopPropagation()}>
                  {emp.status === "Pending" && (
                    <>
                      <button
                        onClick={() => { updateEmpStatus(emp.id, "Approved"); setToast({ msg: `${emp.name}'s increment approved.`, type: "success" }); }}
                        title="Approve"
                        style={{ width: "26px", height: "26px", borderRadius: "8px", backgroundColor: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <CheckCircle2 size={13} color="#059669" />
                      </button>
                      <button
                        onClick={() => { updateEmpStatus(emp.id, "Rejected"); setToast({ msg: `${emp.name}'s increment rejected.`, type: "warning" }); }}
                        title="Reject"
                        style={{ width: "26px", height: "26px", borderRadius: "8px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <XCircle size={13} color="#DC2626" />
                      </button>
                    </>
                  )}
                  {emp.status === "Approved" && (
                    <button
                      onClick={() => handleApplyPayroll(emp)}
                      title="Apply to Payroll"
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "8px", backgroundColor: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#0D9488", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}
                    >
                      <IndianRupee size={11} /> Payroll
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEmp(emp)}
                    title="View Details"
                    style={{ width: "26px", height: "26px", borderRadius: "8px", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ChevronRight size={13} color="var(--muted-foreground)" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", backgroundColor: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            Showing {Math.min(filtered.length, page * PAGE_SIZE + 1)}–{Math.min(filtered.length, (page + 1) * PAGE_SIZE)} of {filtered.length}
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: page === i ? "var(--primary)" : "var(--card)", color: page === i ? "white" : "var(--foreground)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "24px" }}>
        {/* Scatter: Attendance vs Performance */}
        <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 3px" }}>Attendance vs. Performance</h3>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Correlation scatter • each dot = one employee</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" name="Attendance %" domain={[75, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "Attendance %", position: "insideBottom", offset: -5, fill: "#6B7280", fontSize: 11 }} />
              <YAxis dataKey="y" name="Performance %" domain={[70, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload as { name: string; x: number; y: number; increment: number };
                  return (
                    <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", fontSize: "12px" }}>
                      <p style={{ fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px" }}>{d.name}</p>
                      <p style={{ color: "var(--muted-foreground)", margin: "0" }}>Attendance: {d.x}% · Perf: {d.y}%</p>
                      <p style={{ color: "#059669", margin: "0", fontWeight: 700 }}>Increment: +{d.increment}%</p>
                    </div>
                  );
                }}
              />
              <Scatter data={scatterData} fill="var(--primary)">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.increment >= 12 ? "#059669" : entry.increment >= 8 ? "#14B8A6" : entry.increment > 0 ? "#F59E0B" : "#EF4444"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Dept Increment Distribution */}
        <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 3px" }}>Dept-wise Avg. Increment %</h3>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Average recommended increment by department</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptIncrementData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="dept" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 18]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "12px" }}
                formatter={(v: number) => [`${v}%`, "Avg. Increment"]}
              />
              <Bar dataKey="avg" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {deptIncrementData.map((_, i) => (
                  <Cell key={`bar-${i}`} fill={i % 2 === 0 ? "#10B981" : "#14B8A6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recommendation Logic Card ── */}
      <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <BarChart3 size={16} color="var(--primary)" />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Increment Recommendation Logic</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { score: "≥ 92", band: "Excellent", increment: "+15%", color: "#059669", bg: "rgba(5,150,105,0.08)", msg: "Eligible for 15% increment" },
            { score: "85–91", band: "Good", increment: "+12%", color: "#14B8A6", bg: "rgba(20,184,166,0.08)", msg: "Eligible for 12% increment" },
            { score: "78–84", band: "Average", increment: "+8%", color: "#D97706", bg: "rgba(245,158,11,0.08)", msg: "Eligible for 8% with review" },
            { score: "< 78", band: "Poor / Low Att.", increment: "0% / 5%", color: "#DC2626", bg: "rgba(239,68,68,0.08)", msg: "Not eligible or 5% if att. ok" },
          ].map((r, i) => (
            <div key={i} style={{ backgroundColor: r.bg, borderRadius: "14px", padding: "16px", border: `1px solid ${r.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: r.color, textTransform: "uppercase" }}>Score {r.score}</span>
                <span style={{ fontSize: "16px", fontWeight: 900, color: r.color }}>{r.increment}</span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--foreground)", fontWeight: 600, margin: "0 0 4px" }}>{r.band}</p>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: 0 }}>"{r.msg}"</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={14} color="var(--primary)" />
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            Final score = <strong>Attendance × 40%</strong> + <strong>Performance × 60%</strong> · Attendance below 85% automatically flags for manual review.
          </span>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {selectedEmp && (
        <DetailDrawer
          emp={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          onApprove={() => { updateEmpStatus(selectedEmp.id, "Approved"); setToast({ msg: `${selectedEmp.name}'s increment approved.`, type: "success" }); setSelectedEmp(null); }}
          onReject={() => { updateEmpStatus(selectedEmp.id, "Rejected"); setToast({ msg: `${selectedEmp.name}'s increment rejected.`, type: "warning" }); setSelectedEmp(null); }}
          onSendReview={() => { setToast({ msg: `${selectedEmp.name}'s review sent to HR.`, type: "info" }); setSelectedEmp(null); }}
          onApplyPayroll={() => { handleApplyPayroll(selectedEmp); setSelectedEmp(null); }}
        />
      )}

      {/* ── Apply to Payroll Confirmation Modal ── */}
      {showApplyModal && applyTarget && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowApplyModal(false)}>
          <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <IndianRupee size={26} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--foreground)", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Apply to Payroll</h3>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 20px", lineHeight: 1.5 }}>
              Confirm salary revision for <strong style={{ color: "var(--foreground)" }}>{applyTarget.name}</strong>. This will update payroll effective May 1, 2026.
            </p>
            <div style={{ backgroundColor: "var(--secondary)", borderRadius: "14px", padding: "14px 16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Current Salary</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>₹{applyTarget.currentSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Revised Salary</span>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>₹{applyTarget.revisedSalary.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowApplyModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "12px", backgroundColor: "var(--secondary)", color: "var(--foreground)", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmApplyPayroll} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #047857)", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}>
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
