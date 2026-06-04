import { useState } from "react";
import { useLocation } from "react-router";
import {
  Target,
  Clock,
  Award,
  Plus,
  X,
  MessageSquare,
  TrendingUp,
  Download,
  Info,
  ChevronRight,
  Star,
  FileText,
  History,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
type GoalStatus = "Not Started" | "In Progress" | "Completed" | "Overdue";
type GoalPriority = "High" | "Medium" | "Low";
type GoalCategory = "Technical" | "Soft Skills" | "Leadership" | "Operational";

interface GoalUpdate {
  id: number;
  date: string;
  user: string;
  comment: string;
  progress: number;
  type: "Created" | "Updated" | "Reviewed" | "Completed";
}

interface Goal {
  id: number;
  title: string;
  category: GoalCategory;
  progress: number;
  targetDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  description: string;
  targetMetric: string;
  managerComments: string;
  lastUpdated: string;
  timeline: GoalUpdate[];
}

interface PerformanceReview {
  id: number;
  period: string;
  overallScore: number;
  rating: string;
  attendanceScore: number;
  goalCompletion: number;
  kpiScore: number;
  recommendation: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
  hrComments: string;
  periodStart: string;
  periodEnd: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const MOCK_GOALS: Goal[] = [
  {
    id: 1,
    title: "Complete React Advanced Training",
    category: "Technical",
    progress: 85,
    targetDate: "May 20, 2026",
    priority: "High",
    status: "In Progress",
    description:
      "Deep dive into React performance optimization, custom hooks, and server components.",
    targetMetric: "Certification completion & demo project",
    managerComments:
      "Great progress, ensure you apply the learnings to the new dashboard.",
    lastUpdated: "May 01, 2026",
    timeline: [
      {
        id: 1,
        date: "Apr 15, 2026 10:00 AM",
        user: "System",
        comment: "Goal Created",
        progress: 0,
        type: "Created",
      },
      {
        id: 2,
        date: "Apr 25, 2026 02:30 PM",
        user: "Marcus Williams",
        comment: "Initial review and guidance provided.",
        progress: 10,
        type: "Reviewed",
      },
      {
        id: 3,
        date: "May 01, 2026 04:45 PM",
        user: "Sathya (You)",
        comment: "Completed hooks module and started optimization patterns.",
        progress: 85,
        type: "Updated",
      },
    ],
  },
  {
    id: 2,
    title: "Maintain attendance above 95%",
    category: "Operational",
    progress: 98,
    targetDate: "Dec 31, 2026",
    priority: "Medium",
    status: "In Progress",
    description:
      "Ensure consistent punctuality and minimal unplanned leaves throughout the year.",
    targetMetric: "Attendance records from EMS",
    managerComments: "Consistency is key. Keep up the good work.",
    lastUpdated: "Apr 28, 2026",
    timeline: [
      {
        id: 1,
        date: "Jan 01, 2026 09:00 AM",
        user: "System",
        comment: "Goal Created",
        progress: 0,
        type: "Created",
      },
    ],
  },
];

const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 1,
    period: "Annual Review 2025-26",
    overallScore: 4.5,
    rating: "Exceeds Expectations",
    attendanceScore: 96,
    goalCompletion: 90,
    kpiScore: 92,
    recommendation: "Salary Increment & Promotion",
    status: "Approved",
    date: "Mar 28, 2026",
    strengths: [
      "Technical Proficiency",
      "Problem Solving",
      "Team Collaboration",
    ],
    improvements: ["Time Management for minor tasks", "Public speaking"],
    feedback:
      "Exceptional contribution to the React migration project. One of the top performers in the engineering team.",
    hrComments: "Candidate eligible for senior role appraisal.",
    periodStart: "Apr 01, 2025",
    periodEnd: "Mar 31, 2026",
  },
  {
    id: 2,
    period: "Mid-Year Review 2025",
    overallScore: 4.2,
    rating: "Meets Expectations",
    attendanceScore: 94,
    goalCompletion: 85,
    kpiScore: 88,
    recommendation: "Training Suggested",
    status: "Approved",
    date: "Sep 15, 2025",
    strengths: ["Reliability", "Coding Standards"],
    improvements: ["Requirement gathering"],
    feedback: "Solid performance, meeting all key targets.",
    hrComments: "Consistent performance observed.",
    periodStart: "Apr 01, 2025",
    periodEnd: "Sep 30, 2025",
  },
];

const PERFORMANCE_TREND_DATA = [
  { month: "Apr", score: 4.0 },
  { month: "May", score: 4.1 },
  { month: "Jun", score: 4.3 },
  { month: "Jul", score: 4.2 },
  { month: "Aug", score: 4.4 },
  { month: "Sep", score: 4.2 },
  { month: "Oct", score: 4.5 },
  { month: "Nov", score: 4.3 },
  { month: "Dec", score: 4.6 },
  { month: "Jan", score: 4.5 },
  { month: "Feb", score: 4.7 },
  { month: "Mar", score: 4.5 },
];

const GOAL_COMPLETION_DATA = [
  { name: "Technical", completed: 80, target: 100 },
  { name: "Soft Skills", completed: 60, target: 100 },
  { name: "Leadership", completed: 40, target: 100 },
  { name: "Operational", completed: 95, target: 100 },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Completed: "bg-emerald-500/10 text-primary border-primary/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Overdue: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "Not Started":
      "bg-secondary text-muted-foreground border-border dark:bg-zinc-800",
    Approved: "bg-emerald-500/10 text-primary border-primary/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${cfg[status] || cfg["Not Started"]}`}
    >
      {status}
    </span>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
  value: string | number;
  subValue: string;
  chip?: string;
  chipColor?: "green" | "amber" | "purple" | "teal";
}

function SummaryCard({
  icon: Icon,
  color,
  bg,
  label,
  value,
  subValue,
  chip,
  chipColor,
  onClick,
}: SummaryCardProps & { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color}`}
      >
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-black text-foreground leading-none">
            {value}
          </p>
          {chip && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                chipColor === "green"
                  ? "bg-emerald-500/10 text-primary border-primary/20"
                  : chipColor === "amber"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : chipColor === "purple"
                      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      : "bg-teal-500/10 text-teal-600 border-teal-500/20"
              }`}
            >
              {chip}
            </span>
          )}
        </div>
        <p className="text-[12px] font-bold text-muted-foreground mt-1">
          {subValue}
        </p>
      </div>
    </div>
  );
}

function ModalLayout({
  title,
  icon: Icon,
  onClose,
  children,
  maxWidth = "520px",
}: {
  title: string;
  icon: React.ElementType;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
        onClick={onClose}
      />
      <div
        className="relative bg-card w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-border"
        style={{ maxWidth }}
      >
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
            <h3 className="text-[18px] font-black text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeePerformance() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"My Goals" | "My Performance">(
    location.pathname === "/goals" ? "My Goals" : "My Performance",
  );

  // Modal States
  const [selectedGoalDetail, setSelectedGoalDetail] = useState<Goal | null>(
    null,
  );
  const [goalToUpdate, setGoalToUpdate] = useState<Goal | null>(null);
  const [showGoalTimeline, setShowGoalTimeline] = useState<Goal | null>(null);
  const [showPerformanceSummary, setShowPerformanceSummary] = useState(false);
  const [selectedReviewDetail, setSelectedReviewDetail] =
    useState<PerformanceReview | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Form States (Mock)

  const handleDownloadReport = () => {
    showToast(
      "Report Downloaded",
      "success",
      "Your performance report is ready and downloaded.",
    );
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      "Feedback Requested",
      "success",
      "Your request has been sent to the manager.",
    );
    setShowFeedback(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-purple-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Target size={22} className="text-purple-500" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            {activeTab === "My Goals"
              ? "My Goals & Objectives"
              : "My Performance Review"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-5 py-3 bg-secondary text-foreground border border-border rounded-2xl font-black hover:bg-secondary/80 transition-all text-[13px]"
          >
            <Download size={18} /> Download Report
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black hover:bg-primary/20 transition-all text-[13px]"
          >
            <MessageSquare size={18} /> Request Feedback
          </button>
        </div>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-8 border-b border-border mt-4">
        {(["My Goals", "My Performance"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-[14px] font-black relative transition-all ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(16,185,129,0.3)]" />
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─────────────────────────────────────────── */}
      <div className="space-y-8">
        {activeTab === "My Goals" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
                  FY 2025-26 GOALS
                </h3>
                <span className="text-[12px] font-bold text-muted-foreground">
                  {MOCK_GOALS.length} goals
                </span>
              </div>
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-primary rounded-xl text-[12px] font-black hover:bg-emerald-500/20 transition-all"
              >
                <Plus size={16} /> Propose New Goal
              </button>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {MOCK_GOALS.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalDetail(goal)}
                    className="p-5 flex items-center justify-between hover:bg-[#00B87C]/[0.08] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          goal.priority === "High"
                            ? "bg-rose-500/10 text-rose-500"
                            : goal.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-emerald-500/10 text-primary"
                        }`}
                      >
                        <Target size={20} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">
                          {goal.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {goal.category}
                          </span>
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} /> {goal.targetDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                        <div className="flex items-center justify-between w-full text-[11px] font-black">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-primary">{goal.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={goal.status} />
                        <ChevronRight
                          size={18}
                          className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "My Performance" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <SummaryCard
                icon={Star}
                color="text-amber-500"
                bg="bg-amber-500/10"
                label="OVERALL SCORE"
                value="4.5"
                subValue="FY 2025-26"
                chip="Excellent"
                chipColor="green"
                onClick={() => setShowPerformanceSummary(true)}
              />
              <SummaryCard
                icon={Clock}
                color="text-blue-500"
                bg="bg-blue-500/10"
                label="ATTENDANCE SCORE"
                value="96%"
                subValue="Last 12 Months"
                chip="On Track"
                chipColor="green"
                onClick={() => setShowPerformanceSummary(true)}
              />
              <SummaryCard
                icon={Target}
                color="text-primary"
                bg="bg-emerald-500/10"
                label="GOAL COMPLETION"
                value="90%"
                subValue="8/10 Completed"
                chip="High"
                chipColor="green"
                onClick={() => setShowPerformanceSummary(true)}
              />
              <SummaryCard
                icon={Award}
                color="text-purple-500"
                bg="bg-purple-500/10"
                label="MANAGER RATING"
                value="A"
                subValue="Top Performer"
                chip="Elite"
                chipColor="purple"
                onClick={() => setShowPerformanceSummary(true)}
              />
            </div>

            {/* Review History Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
                  PERFORMANCE REVIEW HISTORY
                </h3>
                <span className="text-[12px] font-bold text-muted-foreground">
                  Review Period: Apr 2025 - Mar 2026
                </span>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Review Period
                      </th>
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Score
                      </th>
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Recommendation
                      </th>
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_REVIEWS.map((review) => (
                      <tr
                        key={review.id}
                        className="hover:bg-secondary transition-colors cursor-pointer group"
                        onClick={() => setSelectedReviewDetail(review)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors">
                              {review.period}
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[15px] font-black text-primary">
                            {review.overallScore}
                          </span>
                          <span className="text-[11px] font-bold text-muted-foreground ml-1">
                            / 5.0
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] font-bold text-foreground">
                            {review.rating}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[12px] font-bold text-muted-foreground">
                            {review.recommendation}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={review.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary text-[12px] font-black hover:underline flex items-center gap-1 justify-end ml-auto">
                            View Review <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KPI & Metric Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-[14px] font-black text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" /> Key
                  Performance Indicators
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Code Quality", val: 92 },
                    { label: "Documentation", val: 85 },
                    { label: "Team Collaboration", val: 95 },
                    { label: "Timely Delivery", val: 88 },
                  ].map((kpi) => (
                    <div key={kpi.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12px] font-bold">
                        <span className="text-muted-foreground">
                          {kpi.label}
                        </span>
                        <span className="text-foreground">{kpi.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${kpi.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-[14px] font-black text-foreground mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-500" /> Recent Feedback
                </h3>
                <div className="space-y-4">
                  <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                    <p className="text-[12px] font-bold text-foreground leading-relaxed italic mb-2">
                      "Excellent work on the React migration. Your attention to
                      performance details was outstanding."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary">
                        MW
                      </div>
                      <span className="text-[11px] font-black text-muted-foreground">
                        Marcus Williams, Manager
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="w-full py-3 border border-dashed border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all"
                  >
                    + Request More Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */
      /* MODALS                                                          */
      /* ─────────────────────────────────────────────────────────────── */}

      {/* 1. Goal Detail Modal */}
      {selectedGoalDetail && (
        <ModalLayout
          title="Goal Details"
          icon={Target}
          onClose={() => setSelectedGoalDetail(null)}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Category
                </h4>
                <span className="px-3 py-1 bg-secondary rounded-lg text-[11px] font-black text-foreground border border-border">
                  {selectedGoalDetail.category}
                </span>
              </div>
              <div className="text-right">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Priority
                </h4>
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-black border ${
                    selectedGoalDetail.priority === "High"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  {selectedGoalDetail.priority}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                Goal Description
              </h4>
              <p className="text-[13px] font-bold text-foreground leading-relaxed">
                {selectedGoalDetail.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Target Metric
                </h4>
                <p className="text-[13px] font-black text-primary">
                  {selectedGoalDetail.targetMetric}
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Due Date
                </h4>
                <p className="text-[13px] font-black text-foreground">
                  {selectedGoalDetail.targetDate}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Current Progress
                </h4>
                <span className="text-[13px] font-black text-primary">
                  {selectedGoalDetail.progress}%
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${selectedGoalDetail.progress}%` }}
                />
              </div>
            </div>

            <div className="bg-secondary p-4 rounded-2xl border border-border">
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MessageSquare size={12} /> Manager Comments
              </h4>
              <p className="text-[12px] font-bold text-muted-foreground italic">
                "{selectedGoalDetail.managerComments}"
              </p>
              <p className="text-[11px] font-bold text-muted-foreground mt-2 text-right">
                Last updated: {selectedGoalDetail.lastUpdated}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGoalToUpdate(selectedGoalDetail)}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all"
                >
                  Update Progress
                </button>
                <button
                  onClick={() => setShowGoalTimeline(selectedGoalDetail)}
                  className="flex-1 py-3 px-4 rounded-xl border border-border text-[13px] font-black text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
                >
                  <History size={16} /> View Timeline
                </button>
              </div>
              <button
                onClick={() => setSelectedGoalDetail(null)}
                className="w-full py-3 px-4 rounded-xl border border-border text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </ModalLayout>
      )}

      {/* 2. Update Goal Progress Modal */}
      {goalToUpdate && (
        <ModalLayout
          title="Update Goal Progress"
          icon={TrendingUp}
          onClose={() => setGoalToUpdate(null)}
        >
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              showToast(
                "Progress Updated",
                "success",
                "Your goal progress has been updated and a history entry was added.",
              );
              setGoalToUpdate(null);
            }}
          >
            <div className="p-4 bg-secondary/50 rounded-2xl border border-border mb-4">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                Currently Updating
              </p>
              <p className="text-[14px] font-black text-foreground">
                {goalToUpdate.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Current Progress
                </label>
                <div className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-[13px] font-bold text-muted-foreground">
                  {goalToUpdate.progress}%
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  New Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={goalToUpdate.progress}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Progress Notes
              </label>
              <textarea
                rows={3}
                placeholder="What have you achieved since the last update?"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Attachment (Optional)
              </label>
              <div className="w-full px-4 py-3 bg-secondary border border-dashed border-border rounded-xl text-[12px] font-bold text-muted-foreground text-center hover:bg-secondary/80 transition-all cursor-pointer">
                Click to upload proof of progress
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGoalToUpdate(null)}
                className="flex-1 py-4 rounded-xl border border-border text-[14px] font-black text-muted-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all"
              >
                Save Update
              </button>
            </div>
          </form>
        </ModalLayout>
      )}

      {/* 3. Performance Summary Modal */}
      {showPerformanceSummary && (
        <ModalLayout
          title="Performance Summary"
          icon={TrendingUp}
          onClose={() => setShowPerformanceSummary(false)}
          maxWidth="700px"
        >
          <div className="space-y-8 pb-4">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Overall Score", val: "4.5", color: "text-amber-500" },
                { label: "Attendance", val: "96%", color: "text-blue-500" },
                { label: "KPI Score", val: "92%", color: "text-primary" },
                { label: "Goals", val: "90%", color: "text-purple-500" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-4 bg-card border border-border rounded-2xl text-center"
                >
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    {m.label}
                  </p>
                  <p className={`text-[18px] font-black ${m.color}`}>{m.val}</p>
                </div>
              ))}
            </div>

            {/* Performance Trend Chart */}
            <div className="space-y-3">
              <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Monthly
                Performance Trend
              </h4>
              <div className="h-[200px] w-full bg-secondary/30 rounded-2xl border border-border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PERFORMANCE_TREND_DATA}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.05)"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 900,
                        fill: "#71717a",
                      }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 900,
                        fill: "#71717a",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e4e4e7",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        fontSize: "12px",
                        fontWeight: "900",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981", strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Goal Completion Chart */}
            <div className="space-y-3">
              <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-purple-500" /> Goal Completion
                by Category
              </h4>
              <div className="h-[200px] w-full bg-secondary/30 rounded-2xl border border-border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GOAL_COMPLETION_DATA} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="rgba(0,0,0,0.05)"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 900,
                        fill: "#71717a",
                      }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 900,
                        fill: "#71717a",
                      }}
                      width={100}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.02)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e4e4e7",
                        fontSize: "12px",
                        fontWeight: "900",
                      }}
                    />
                    <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={20}>
                      {GOAL_COMPLETION_DATA.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#10b981" : "#8b5cf6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowPerformanceSummary(false);
                  setSelectedReviewDetail(MOCK_REVIEWS[0]);
                }}
                className="flex-1 py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={18} /> View Full Review
              </button>
              <button
                onClick={() => {
                  setShowPerformanceSummary(false);
                  setShowExportModal(true);
                }}
                className="flex-1 py-4 rounded-xl border border-border text-[14px] font-black text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Report
              </button>
              <button
                onClick={() => {
                  setShowPerformanceSummary(false);
                  setShowFeedback(true);
                }}
                className="flex-1 py-4 rounded-xl border border-border text-[14px] font-black text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Request Feedback
              </button>
            </div>
          </div>
        </ModalLayout>
      )}

      {/* 4. Performance Review Detail Modal (Expanded) */}
      {selectedReviewDetail && (
        <ModalLayout
          title="Review Detail"
          icon={Award}
          onClose={() => setSelectedReviewDetail(null)}
          maxWidth="600px"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-secondary p-5 rounded-2xl border border-border">
              <div>
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Review Period
                </h4>
                <p className="text-[16px] font-black text-foreground">
                  {selectedReviewDetail.period}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                  {selectedReviewDetail.periodStart} -{" "}
                  {selectedReviewDetail.periodEnd}
                </p>
              </div>
              <div className="text-right">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Overall Rating
                </h4>
                <p className="text-[24px] font-black text-primary leading-none mt-1">
                  {selectedReviewDetail.overallScore}
                  <span className="text-[14px] text-muted-foreground font-bold">
                    /5.0
                  </span>
                </p>
                <p className="text-[12px] font-black text-muted-foreground mt-1 uppercase tracking-wider">
                  {selectedReviewDetail.rating}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest border-b border-border pb-2">
                  KPI Breakdown
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "KPI Score", val: selectedReviewDetail.kpiScore },
                    {
                      label: "Attendance",
                      val: selectedReviewDetail.attendanceScore,
                    },
                    {
                      label: "Goal Comp.",
                      val: selectedReviewDetail.goalCompletion,
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-black">
                        <span className="text-muted-foreground uppercase">
                          {item.label}
                        </span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest border-b border-border pb-2">
                  Highlights
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                      Top Strengths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReviewDetail.strengths.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-emerald-500/10 rounded text-[11px] font-bold text-primary border border-primary/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-rose-500 uppercase tracking-widest">
                      Growth Areas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReviewDetail.improvements
                        .slice(0, 2)
                        .map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-rose-500/10 rounded text-[11px] font-bold text-rose-500 border border-rose-500/20"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" /> Manager
                  Feedback
                </h4>
                <p className="text-[13px] font-bold text-foreground leading-relaxed italic">
                  "{selectedReviewDetail.feedback}"
                </p>
              </div>
              <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Info size={14} className="text-blue-500" /> HR Comments
                </h4>
                <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                  {selectedReviewDetail.hrComments}
                </p>
              </div>
            </div>

            <div className="p-5 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-black text-purple-600 uppercase tracking-widest">
                  Recommendation
                </h4>
                <p className="text-[16px] font-black text-purple-700">
                  {selectedReviewDetail.recommendation}
                </p>
              </div>
              <CheckCircle2 size={32} className="text-purple-500 opacity-40" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() =>
                  showToast(
                    "Review Downloaded",
                    "success",
                    "Detailed review PDF is ready.",
                  )
                }
                className="flex-1 py-4 rounded-xl border border-border text-[14px] font-black text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Review
              </button>
              <button
                onClick={() => {
                  showToast(
                    "Review Acknowledged",
                    "success",
                    "Your acknowledgment has been recorded.",
                  );
                  setSelectedReviewDetail(null);
                }}
                className="flex-1 py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Acknowledge Review
              </button>
            </div>
          </div>
        </ModalLayout>
      )}

      {/* 5. Export Modal */}
      {showExportModal && (
        <ModalLayout
          title="Download Performance Report"
          icon={Download}
          onClose={() => setShowExportModal(false)}
        >
          <div className="space-y-6">
            <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
              Select the format and type of report you wish to generate for your
              performance records.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "pdf",
                  label: "Detailed Performance PDF",
                  desc: "Complete review including feedback and charts",
                  icon: FileText,
                  color: "text-rose-500",
                },
                {
                  id: "excel",
                  label: "KPI Metrics Excel",
                  desc: "Raw data for scores and goal progress",
                  icon: Target,
                  color: "text-emerald-500",
                },
                {
                  id: "summary",
                  label: "Summary Report",
                  desc: "Single page overview of key highlights",
                  icon: Award,
                  color: "text-amber-500",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className="p-4 bg-secondary/50 rounded-2xl border border-border hover:border-primary transition-all cursor-pointer group flex items-center gap-4"
                  onClick={() => {
                    showToast(
                      "Report Downloaded",
                      "success",
                      `${opt.label} downloaded successfully.`,
                    );
                    setShowExportModal(false);
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-card flex items-center justify-center ${opt.color} shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <opt.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-black text-foreground">
                      {opt.label}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full py-4 rounded-xl bg-secondary text-foreground text-[14px] font-black hover:bg-secondary/80 transition-all mt-2"
            >
              Cancel
            </button>
          </div>
        </ModalLayout>
      )}

      {/* 6. Goal Timeline Modal */}
      {showGoalTimeline && (
        <ModalLayout
          title="Goal Progress Timeline"
          icon={History}
          onClose={() => setShowGoalTimeline(null)}
        >
          <div className="space-y-6">
            <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                Goal
              </p>
              <p className="text-[14px] font-black text-foreground">
                {showGoalTimeline.title}
              </p>
            </div>
            <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              {showGoalTimeline.timeline.map((entry) => (
                <div key={entry.id} className="relative pl-12">
                  <div
                    className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-card flex items-center justify-center z-10 ${
                      entry.type === "Created"
                        ? "bg-emerald-500/10 text-primary"
                        : entry.type === "Completed"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {entry.type === "Created" ? (
                      <Target size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                  </div>
                  <div className="p-4 bg-secondary/40 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black text-foreground">
                        {entry.type}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-muted-foreground leading-relaxed">
                      {entry.comment}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-black text-muted-foreground">
                        {entry.user.substring(0, 1)}
                      </div>
                      <span className="text-[11px] font-black text-foreground">
                        {entry.user}
                      </span>
                      <span className="ml-auto text-[11px] font-black text-primary">
                        {entry.progress}% Progress
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGoalTimeline(null)}
              className="w-full py-4 rounded-xl bg-secondary text-foreground text-[14px] font-black hover:bg-secondary/80 transition-all mt-4"
            >
              Close History
            </button>
          </div>
        </ModalLayout>
      )}

      {/* 7. Propose New Goal Modal */}
      {showAddGoal && (
        <ModalLayout
          title="Propose New Goal"
          icon={Plus}
          onClose={() => setShowAddGoal(false)}
        >
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              showToast(
                "Goal Proposed",
                "success",
                "Your goal request has been submitted to your manager.",
              );
              setShowAddGoal(false);
            }}
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Goal Title
              </label>
              <input
                type="text"
                placeholder="Enter goal name..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Category
                </label>
                <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none appearance-none">
                  <option>Technical</option>
                  <option>Operational</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Priority
                </label>
                <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none appearance-none">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Target Value / Metric
              </label>
              <input
                type="text"
                placeholder="e.g. 100% completion, 5 tasks"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief details about the goal..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all mt-2"
            >
              Submit Goal Request
            </button>
          </form>
        </ModalLayout>
      )}

      {/* 8. Request Feedback Modal */}
      {showFeedback && (
        <ModalLayout
          title="Request Feedback"
          icon={MessageSquare}
          onClose={() => setShowFeedback(false)}
        >
          <form onSubmit={handleSendFeedback} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Select Manager / Colleague
              </label>
              <select
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none appearance-none"
                required
              >
                <option value="">Select a person...</option>
                <option>Marcus Williams (Manager)</option>
                <option>Sarah Johnson (Team Lead)</option>
                <option>Robert Chen (Peer)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Feedback Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Project Delivery, Collaboration"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Briefly explain what aspects you'd like feedback on..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
                required
              />
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-primary/20 flex items-center gap-3">
              <Info size={16} className="text-primary" />
              <p className="text-[11px] font-black text-primary">
                A notification will be sent to the selected person.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowFeedback(false)}
                className="flex-1 py-4 rounded-xl border border-border text-[14px] font-black text-muted-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all"
              >
                Send Request
              </button>
            </div>
          </form>
        </ModalLayout>
      )}
    </div>
  );
}
