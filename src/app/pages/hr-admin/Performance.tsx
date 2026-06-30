import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Search,
  ChevronDown,
  Download,
  Star,
  Users,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  RefreshCw,
  ChevronRight,
  Target,
  Activity,
  UserCheck,
  Plus,
  FileText,
  Trash2,
  Edit3,
  Home,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import { employees, departments } from "../../data/mockData";
import { toast, Toaster } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/* ─── Types ──────────────────────────────────────────────── */
type ReviewStatus = "Pending" | "In Review" | "Completed" | "Approved";
type Recommendation = "No Change" | "Bonus" | "Increment" | "Promotion";

interface ReviewHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  attendanceScore: number;
  performanceScore: number;
  rating: number;
  recommendation: Recommendation;
  status: ReviewStatus;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const reviewHistory: ReviewHistory[] = [
  {
    id: "R001",
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    department: "Engineering",
    period: "Q1 2026",
    attendanceScore: 95,
    performanceScore: 92,
    rating: 4.8,
    recommendation: "Increment",
    status: "Approved",
  },
  {
    id: "R002",
    employeeId: "EMP002",
    employeeName: "Marcus Williams",
    department: "Marketing",
    period: "Q1 2026",
    attendanceScore: 88,
    performanceScore: 85,
    rating: 4.2,
    recommendation: "No Change",
    status: "Completed",
  },
  {
    id: "R003",
    employeeId: "EMP003",
    employeeName: "Yuki Tanaka",
    department: "Design",
    period: "Q1 2026",
    attendanceScore: 98,
    performanceScore: 95,
    rating: 4.9,
    recommendation: "Promotion",
    status: "Approved",
  },
  {
    id: "R004",
    employeeId: "EMP004",
    employeeName: "James Carter",
    department: "Finance",
    period: "Q1 2026",
    attendanceScore: 82,
    performanceScore: 80,
    rating: 3.9,
    recommendation: "No Change",
    status: "In Review",
  },
  {
    id: "R005",
    employeeId: "EMP005",
    employeeName: "Emily Rodriguez",
    department: "HR",
    period: "Q1 2026",
    attendanceScore: 91,
    performanceScore: 88,
    rating: 4.3,
    recommendation: "Bonus",
    status: "Pending",
  },
];

const loadPerformanceReviews = (): ReviewHistory[] => {
  const local = localStorage.getItem("nexus_performance_reviews");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse performance reviews", e);
    }
  }
  localStorage.setItem(
    "nexus_performance_reviews",
    JSON.stringify(reviewHistory),
  );
  return reviewHistory;
};

const trendData = [
  { name: "Jan", score: 78 },
  { name: "Feb", score: 82 },
  { name: "Mar", score: 85 },
  { name: "Apr", score: 88 },
  { name: "May", score: 92 },
];

/* ─── Components ─────────────────────────────────────────── */

function StatusBadge({ status }: { status: ReviewStatus }) {
  const cfg = {
    Pending: { bg: "rgba(100,116,139,0.1)", text: "#64748B" },
    "In Review": { bg: "rgba(245,158,11,0.1)", text: "#D97706" },
    Completed: { bg: "rgba(16,185,129,0.1)", text: "#059669" },
    Approved: { bg: "rgba(20,184,166,0.1)", text: "#0D9488" },
  }[status];
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
      }}
    >
      {status}
    </span>
  );
}

function MetricItem({
  label,
  val,
  icon: Icon,
}: {
  label: string;
  val: number;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        </div>
        <span className="text-xs font-bold text-foreground">{val}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${val}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export function Performance() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedEmpId, setSelectedEmpId] = useState("All Employees");
  const [year, setYear] = useState("2026");
  const [period, setPeriod] = useState("Quarterly");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [history, setHistory] = useState<ReviewHistory[]>(
    loadPerformanceReviews,
  );
  const [activeReview, setActiveReview] = useState<ReviewHistory | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Form State
  const [formPeriod, setFormPeriod] = useState("Q1 2026");
  const [formAttendanceScore, setFormAttendanceScore] = useState(95);
  const [formPerformanceScore, setFormPerformanceScore] = useState(90);
  const [formRating, setFormRating] = useState(4.5);
  const [formRecommendation, setFormRecommendation] =
    useState<Recommendation>("No Change");
  const [formStatus, setFormStatus] = useState<ReviewStatus>("Pending");
  const [formStrengths, setFormStrengths] = useState("");
  const [formImprovement, setFormImprovement] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Close modals on Escape key press
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setIsDeleteOpen(false);
        setDeleteTarget(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredEmployees = useMemo(() => {
    if (selectedDept === "All Departments") return employees;
    return employees.filter((e) => e.department === selectedDept);
  }, [selectedDept]);

  const mainSelectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId);
  }, [selectedEmpId]);

  const modalEmployee = useMemo(() => {
    if (modalMode === "create") {
      return employees.find((e) => e.id === selectedEmpId) || employees[0];
    }
    return employees.find((e) => e.name === activeReview?.employeeName);
  }, [selectedEmpId, activeReview, modalMode]);

  // Calculate overall averages of history for fallback/"All Employees"
  const averages = useMemo(() => {
    if (history.length === 0) {
      return {
        performanceScore: 0,
        attendanceScore: 0,
        rating: 0,
        productivity: 0,
        teamwork: 0,
        taskCompletion: 0,
        lateCount: 0,
        leaveCount: 0,
        increment: "0%",
        eligible: false,
      };
    }
    const totalPerf = history.reduce((acc, r) => acc + r.performanceScore, 0);
    const totalAtt = history.reduce((acc, r) => acc + r.attendanceScore, 0);
    const totalRating = history.reduce((acc, r) => acc + r.rating, 0);
    const count = history.length;

    const avgPerf = Math.round(totalPerf / count);
    const avgAtt = Math.round(totalAtt / count);
    const avgRating = Number((totalRating / count).toFixed(1));

    const avgProd = Math.min(100, Math.max(0, avgPerf + 2));
    const avgTeam = Math.min(100, Math.max(0, Math.round(avgPerf * 0.95)));
    const avgTask = Math.min(100, Math.max(0, Math.round(avgPerf * 0.98 - 1)));

    const avgLate = Math.round((100 - avgAtt) / 2);
    const avgLeave = Math.round((100 - avgAtt) / 1.5);

    let increment = "No Increment";
    let eligible = false;
    if (avgPerf >= 95) {
      increment = "15%";
      eligible = true;
    } else if (avgPerf >= 90) {
      increment = "12.5%";
      eligible = true;
    } else if (avgPerf >= 85) {
      increment = "10%";
      eligible = true;
    } else if (avgPerf >= 80) {
      increment = "8%";
      eligible = true;
    }

    return {
      performanceScore: avgPerf,
      attendanceScore: avgAtt,
      rating: avgRating,
      productivity: avgProd,
      teamwork: avgTeam,
      taskCompletion: avgTask,
      lateCount: avgLate,
      leaveCount: avgLeave,
      increment,
      eligible,
    };
  }, [history]);

  // Find review metrics of selected employee if any, otherwise return averages
  const currentEmployeeMetrics = useMemo(() => {
    if (selectedEmpId === "All Employees" || !mainSelectedEmployee) {
      return averages;
    }

    const review = history.find(
      (r) => r.employeeId === mainSelectedEmployee.id,
    );
    if (review) {
      const perf = review.performanceScore;
      const att = review.attendanceScore;

      const prod = Math.min(100, Math.max(0, perf + 2));
      const team = Math.min(100, Math.max(0, Math.round(perf * 0.95)));
      const task = Math.min(100, Math.max(0, Math.round(perf * 0.98 - 1)));

      const late = Math.round((100 - att) / 2);
      const leave = Math.round((100 - att) / 1.5);

      let increment = "No Increment";
      let eligible = false;
      if (perf >= 95) {
        increment = "15%";
        eligible = true;
      } else if (perf >= 90) {
        increment = "12.5%";
        eligible = true;
      } else if (perf >= 85) {
        increment = "10%";
        eligible = true;
      } else if (perf >= 80) {
        increment = "8%";
        eligible = true;
      }

      return {
        performanceScore: perf,
        attendanceScore: att,
        rating: review.rating,
        productivity: prod,
        teamwork: team,
        taskCompletion: task,
        lateCount: late,
        leaveCount: leave,
        increment,
        eligible,
      };
    }

    // Generate from fallback mock details if no history record exists
    const empPerf = mainSelectedEmployee.performance || 85;
    const empAtt = 90;
    const empRating = Number((empPerf / 20).toFixed(1));

    const prod = Math.min(100, Math.max(0, empPerf + 2));
    const team = Math.min(100, Math.max(0, Math.round(empPerf * 0.95)));
    const task = Math.min(100, Math.max(0, Math.round(empPerf * 0.98 - 1)));

    const late = Math.round((100 - empAtt) / 2);
    const leave = Math.round((100 - empAtt) / 1.5);

    let increment = "No Increment";
    let eligible = false;
    if (empPerf >= 95) {
      increment = "15%";
      eligible = true;
    } else if (empPerf >= 90) {
      increment = "12.5%";
      eligible = true;
    } else if (empPerf >= 85) {
      increment = "10%";
      eligible = true;
    } else if (empPerf >= 80) {
      increment = "8%";
      eligible = true;
    }

    return {
      performanceScore: empPerf,
      attendanceScore: empAtt,
      rating: empRating,
      productivity: prod,
      teamwork: team,
      taskCompletion: task,
      lateCount: late,
      leaveCount: leave,
      increment,
      eligible,
    };
  }, [selectedEmpId, mainSelectedEmployee, history, averages]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <Star
            key={i}
            size={16}
            fill="currentColor"
            className="text-amber-500"
          />,
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <div
            key={i}
            className="relative text-amber-500 inline-flex items-center justify-center w-4 h-4 shrink-0 select-none"
          >
            <Star size={16} fill="none" className="absolute" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
              <Star
                size={16}
                fill="currentColor"
                className="absolute top-0 left-0 text-amber-500"
              />
            </div>
          </div>,
        );
      } else {
        stars.push(
          <Star key={i} size={16} fill="none" className="text-amber-500" />,
        );
      }
    }
    return stars;
  };

  const filteredHistory = useMemo(() => {
    return history.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);

      const matchesStatus = status === "All" || r.status === status;
      const matchesDept =
        selectedDept === "All Departments" || r.department === selectedDept;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [search, status, selectedDept, history]);

  const distributionData = useMemo(() => {
    const exceptional = history.filter((r) => r.rating >= 4.5).length;
    const exceeds = history.filter(
      (r) => r.rating >= 4.0 && r.rating < 4.5,
    ).length;
    const meets = history.filter(
      (r) => r.rating >= 3.0 && r.rating < 4.0,
    ).length;
    const below = history.filter((r) => r.rating < 3.0).length;
    const total = history.length || 1;

    return [
      {
        name: "Exceptional",
        value: Math.round((exceptional / total) * 100),
        color: "#10B981",
      },
      {
        name: "Exceeds",
        value: Math.round((exceeds / total) * 100),
        color: "#14B8A6",
      },
      {
        name: "Meets",
        value: Math.round((meets / total) * 100),
        color: "#F59E0B",
      },
      {
        name: "Below",
        value: Math.round((below / total) * 100),
        color: "#EF4444",
      },
    ];
  }, [history]);

  const handleExport = () => {
    toast.loading("Generating performance report...");
    setTimeout(() => {
      const headers =
        "Employee,Dept,Period,Attendance,Performance,Rating,Recommendation,Status\n";
      const rows = filteredHistory
        .map(
          (r) =>
            `${r.employeeName},${r.department},${r.period},${r.attendanceScore}%,${r.performanceScore}%,${r.rating},${r.recommendation},${r.status}`,
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `Performance_Report_${year}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.dismiss();
      toast.success("Report downloaded successfully!");
    }, 1500);
  };

  const handleStartReview = () => {
    // If no specific employee is selected, default to the first one in the list
    const defaultEmp =
      selectedEmpId !== "All Employees"
        ? selectedEmpId
        : employees[0]?.id || "";
    setSelectedEmpId(defaultEmp);
    setFormPeriod(`Q1 ${year}`);
    setFormAttendanceScore(95);
    setFormPerformanceScore(90);
    setFormRating(4.5);
    setFormRecommendation("No Change");
    setFormStatus("Pending");
    setFormStrengths("");
    setFormImprovement("");
    setFormErrors({});
    setModalMode("create");
    setActiveReview(null);
    setIsModalOpen(true);
  };

  const handleView = (review: ReviewHistory) => {
    setModalMode("view");
    setActiveReview(review);
    setFormPeriod(review.period);
    setFormAttendanceScore(review.attendanceScore);
    setFormPerformanceScore(review.performanceScore);
    setFormRating(review.rating);
    setFormRecommendation(review.recommendation);
    setFormStatus(review.status);
    setFormStrengths(
      "Exceptional attention to detail and consistent high-quality output.",
    );
    setFormImprovement(
      "Could improve communication frequency with external stakeholders.",
    );
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (review: ReviewHistory) => {
    setModalMode("edit");
    setActiveReview(review);
    setFormPeriod(review.period);
    setFormAttendanceScore(review.attendanceScore);
    setFormPerformanceScore(review.performanceScore);
    setFormRating(review.rating);
    setFormRecommendation(review.recommendation);
    setFormStatus(review.status);
    setFormStrengths(
      "Exceptional attention to detail and consistent high-quality output.",
    );
    setFormImprovement(
      "Could improve communication frequency with external stakeholders.",
    );
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      const updated = history.filter((r) => r.id !== deleteTarget.id);
      setHistory(updated);
      localStorage.setItem(
        "nexus_performance_reviews",
        JSON.stringify(updated),
      );
      toast.success("Review deleted successfully");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSaveReview = () => {
    const errors: Record<string, string> = {};
    if (!formPeriod.trim()) errors.period = "Period is required";
    if (
      isNaN(formAttendanceScore) ||
      formAttendanceScore < 0 ||
      formAttendanceScore > 100
    ) {
      errors.attendanceScore = "Attendance score must be between 0 and 100";
    }
    if (
      isNaN(formPerformanceScore) ||
      formPerformanceScore < 0 ||
      formPerformanceScore > 100
    ) {
      errors.performanceScore = "Performance score must be between 0 and 100";
    }
    if (isNaN(formRating) || formRating < 1.0 || formRating > 5.0) {
      errors.rating = "Rating must be between 1.0 and 5.0";
    }
    if (!formStrengths.trim()) errors.strengths = "Strengths field is required";
    if (!formImprovement.trim())
      errors.improvement = "Improvement Areas field is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalMode === "edit" && activeReview) {
      const updated = history.map((r) => {
        if (r.id === activeReview.id) {
          return {
            ...r,
            period: formPeriod,
            attendanceScore: formAttendanceScore,
            performanceScore: formPerformanceScore,
            rating: formRating,
            recommendation: formRecommendation,
            status: formStatus,
          };
        }
        return r;
      });
      setHistory(updated);
      localStorage.setItem(
        "nexus_performance_reviews",
        JSON.stringify(updated),
      );
      toast.success("Review updated successfully");
    } else {
      const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];
      const newReview: ReviewHistory = {
        id: `R${100 + history.length + (Date.now() % 100)}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        period: formPeriod,
        attendanceScore: formAttendanceScore,
        performanceScore: formPerformanceScore,
        rating: formRating,
        recommendation: formRecommendation,
        status: formStatus,
      };
      const updated = [newReview, ...history];
      setHistory(updated);
      localStorage.setItem(
        "nexus_performance_reviews",
        JSON.stringify(updated),
      );
      toast.success("New review submitted successfully");
    }
    setIsModalOpen(false);
  };

  const stats = [
    {
      label: "Total Reviews",
      val: history.length.toString(),
      sub: "Active cycle logs",
      icon: <FileText size={18} />,
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      label: "Pending Reviews",
      val: history
        .filter((r) => r.status === "Pending" || r.status === "In Review")
        .length.toString(),
      sub: "Awaiting your action",
      icon: <Clock size={18} />,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      label: "Completed Reviews",
      val: history
        .filter((r) => r.status === "Completed" || r.status === "Approved")
        .length.toString(),
      sub: `${Math.round((history.filter((r) => r.status === "Completed" || r.status === "Approved").length / (history.length || 1)) * 100)}% completion rate`,
      icon: <CheckCircle2 size={18} />,
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      label: "Average Score",
      val: (
        history.reduce((acc, r) => acc + r.performanceScore, 0) /
        (history.length || 1)
      ).toFixed(1),
      sub: "Average out of 100",
      icon: <TrendingUp size={18} />,
      color: "#0D9488",
      bg: "rgba(13,148,136,0.1)",
    },
    {
      label: "Eligible for Increment",
      val: history
        .filter((r) => r.recommendation === "Increment")
        .length.toString(),
      sub: "Based on perf scores",
      icon: <Award size={18} />,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.1)",
    },
    {
      label: "Promotion Recommended",
      val: history
        .filter((r) => r.recommendation === "Promotion")
        .length.toString(),
      sub: "High performers list",
      icon: <UserCheck size={18} />,
      color: "#F43F5E",
      bg: "rgba(244,63,94,0.1)",
    },
  ];

  return (
    <div className="w-full space-y-6 px-4 md:px-8 py-6 pb-10">
      <Toaster position="top-right" richColors />
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">
            <Home size={12} />
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-emerald-600">Performance Review</span>
          </div>
          <h1 className="text-[26px] font-bold text-foreground mb-1">
            Performance Review
          </h1>
          <p className="text-[13px] text-[#6B7280]">
            Track employee performance, appraisal scores, and review history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-black flex items-center gap-2 hover:bg-muted transition-all shadow-sm"
          >
            <Download size={18} /> Export Report
          </button>
          <button
            onClick={handleStartReview}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-sm font-black flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-40 h-10"
          >
            <Plus size={18} /> Start Review
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <h3 className="text-[28px] font-bold text-foreground mb-1">
                {s.val}
              </h3>
              <p className="text-[12px] text-[#6B7280]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Department
            </label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedEmpId("All Employees");
                }}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="All Departments">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Employee
            </label>
            <div className="relative">
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="All Employees">All Employees</option>
                {filteredEmployees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Year
            </label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Period
            </label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Half-Yearly</option>
                <option>Yearly</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Review</option>
                <option>Completed</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
              Search
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSelectedDept("All Departments");
              setSelectedEmpId("All Employees");
              setStatus("All");
              setSearch("");
            }}
            className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest hover:text-emerald-600 transition-all"
          >
            <RefreshCw size={14} /> Clear Filters
          </button>
        </div>
      </div>

      {/* ── Performance Table ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Review History
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Recent 5 records
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#F3F4F6]">
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Dept
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Att. Score
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Perf. Score
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Recommendation
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((r) => (
                <tr
                  key={r.id}
                  className="h-14 border-b border-[#F3F4F6] hover:bg-[#00B87C]/[0.08] transition-colors cursor-pointer"
                  onClick={() => setSelectedEmpId(r.employeeId)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-muted-foreground text-xs uppercase">
                        {r.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">
                          {r.employeeName}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          {r.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-muted-foreground">
                      {r.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-muted-foreground">
                      {r.period}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${r.attendanceScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {r.attendanceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500"
                          style={{ width: `${r.performanceScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {r.performanceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-black ml-0.5">
                        {r.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold ${r.recommendation === "Promotion" ? "text-emerald-600" : "text-muted-foreground"}`}
                    >
                      {r.recommendation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(r);
                        }}
                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 transition-all"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(r);
                        }}
                        className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.id, r.employeeName);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmpId === "All Employees" || !mainSelectedEmployee ? (
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">
            No Employee Selected
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Select an employee from the dropdown filter above or click on any
            employee's row in the Review History table below to view their
            detailed performance and overall score.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Employee Performance Summary Card (Always Visible when selected) */}
            <div className="lg:col-span-12">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border-2 border-emerald-50 dark:border-emerald-500/20 shrink-0">
                      {mainSelectedEmployee?.avatar ? (
                        <img
                          src={mainSelectedEmployee.avatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black text-muted-foreground">
                          <Users size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground">
                        {mainSelectedEmployee?.name}
                      </h3>
                      <p className="text-sm font-bold text-muted-foreground">
                        {mainSelectedEmployee?.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                      Overall Performance Score
                    </p>
                    <div className="flex items-center gap-3">
                      <h4 className="text-[28px] font-bold text-emerald-600">
                        {currentEmployeeMetrics.performanceScore}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-500">
                        {renderStars(currentEmployeeMetrics.rating)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <MetricItem
                    label="Attendance Score"
                    val={currentEmployeeMetrics.attendanceScore}
                    icon={Calendar}
                  />
                  <MetricItem
                    label="Productivity"
                    val={currentEmployeeMetrics.productivity}
                    icon={Activity}
                  />
                  <MetricItem
                    label="Teamwork"
                    val={currentEmployeeMetrics.teamwork}
                    icon={Users}
                  />
                  <MetricItem
                    label="Task Completion"
                    val={currentEmployeeMetrics.taskCompletion}
                    icon={Target}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Appraisal Eligibility Panel ── */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6 border-l-4 border-emerald-500 pl-3">
              Appraisal Eligibility
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="p-4 rounded-2xl bg-muted border border-border">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Attendance %
                </p>
                <p className="text-xl font-black text-foreground">
                  {currentEmployeeMetrics.attendanceScore}%
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Late Count
                </p>
                <p className="text-xl font-black text-amber-600">
                  {String(currentEmployeeMetrics.lateCount).padStart(2, "0")}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Leave Count
                </p>
                <p className="text-xl font-black text-foreground">
                  {String(currentEmployeeMetrics.leaveCount).padStart(2, "0")}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Perf. Score
                </p>
                <p className="text-xl font-black text-emerald-600">
                  {currentEmployeeMetrics.performanceScore}/100
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border lg:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Eligibility
                  </p>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${currentEmployeeMetrics.eligible ? "bg-emerald-500" : "bg-red-500"}`}
                  >
                    {currentEmployeeMetrics.eligible
                      ? "ELIGIBLE"
                      : "NOT ELIGIBLE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-foreground">
                    Suggested Increment
                  </p>
                  <p className="text-2xl font-black text-emerald-600">
                    {currentEmployeeMetrics.increment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6 border-l-4 border-emerald-500 pl-3">
            Performance Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                  labelStyle={{
                    color: "var(--muted-foreground)",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6 border-l-4 border-emerald-500 pl-3">
            Dept Avg Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments.slice(0, 5)} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: "var(--muted-foreground)",
                  }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="employees" radius={[0, 10, 10, 0]} barSize={20}>
                  {departments.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#10B981", "#14B8A6", "#0D9488", "#0891B2", "#0284C7"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6 border-l-4 border-emerald-500 pl-3">
            Rating Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 z-[2000]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-card rounded-[32px] shadow-2xl z-[2010] overflow-hidden focus:outline-none">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <Dialog.Title className="text-xl font-black text-foreground">
                  {modalMode === "view"
                    ? "Performance Report"
                    : modalMode === "edit"
                      ? "Edit Appraisal"
                      : "New Performance Evaluation"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-bold text-muted-foreground">
                  {modalMode === "view"
                    ? "Detailed performance analytics and ratings"
                    : `Complete the appraisal for ${modalEmployee?.name || "the employee"}`}
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className="p-8 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Metrics Summary */}
                <div className="lg:col-span-5 space-y-6">
                  {modalMode === "create" && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Select Employee
                      </label>
                      <div className="relative">
                        <select
                          value={selectedEmpId}
                          onChange={(e) => setSelectedEmpId(e.target.value)}
                          className="w-full appearance-none px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer bg-card"
                        >
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name} ({e.id})
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-6 rounded-2xl bg-muted border border-border">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-card border border-border overflow-hidden shrink-0 flex items-center justify-center font-black text-muted-foreground text-sm uppercase">
                        {modalEmployee?.avatar ? (
                          <img
                            src={modalEmployee.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          modalEmployee?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "EMP"
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-foreground">
                          {modalEmployee?.name || "Select Employee"}
                        </h4>
                        <p className="text-xs font-bold text-muted-foreground">
                          {modalEmployee?.role ||
                            modalEmployee?.designation ||
                            "Staff"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {modalMode === "view" ? (
                        <>
                          <MetricItem
                            label="Attendance"
                            val={formAttendanceScore}
                            icon={Calendar}
                          />
                          <MetricItem
                            label="Performance"
                            val={formPerformanceScore}
                            icon={Activity}
                          />
                        </>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                              Attendance Score (0-100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={formAttendanceScore}
                              onChange={(e) =>
                                setFormAttendanceScore(
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-full px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none"
                              style={{
                                borderColor: formErrors.attendanceScore
                                  ? "#EF4444"
                                  : "var(--border)",
                              }}
                            />
                            {formErrors.attendanceScore && (
                              <p className="text-xs text-red-500 mt-1">
                                {formErrors.attendanceScore}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                              Performance Score (0-100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={formPerformanceScore}
                              onChange={(e) =>
                                setFormPerformanceScore(
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-full px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none"
                              style={{
                                borderColor: formErrors.performanceScore
                                  ? "#EF4444"
                                  : "var(--border)",
                              }}
                            />
                            {formErrors.performanceScore && (
                              <p className="text-xs text-red-500 mt-1">
                                {formErrors.performanceScore}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      <MetricItem label="Teamwork" val={85} icon={Users} />
                      <MetricItem
                        label="Task Completion"
                        val={88}
                        icon={Target}
                      />
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                        Review Period
                      </label>
                      <input
                        type="text"
                        value={formPeriod}
                        onChange={(e) => setFormPeriod(e.target.value)}
                        readOnly={modalMode === "view"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold text-foreground outline-none bg-card ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                        style={{
                          borderColor: formErrors.period
                            ? "#EF4444"
                            : "var(--border)",
                        }}
                      />
                      {formErrors.period && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.period}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Rating (1.0 - 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={formRating}
                        onChange={(e) =>
                          setFormRating(parseFloat(e.target.value) || 0)
                        }
                        readOnly={modalMode === "view"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold text-foreground outline-none bg-card ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                        style={{
                          borderColor: formErrors.rating
                            ? "#EF4444"
                            : "var(--border)",
                        }}
                      />
                      {formErrors.rating && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.rating}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Reviewer
                      </label>
                      <input
                        type="text"
                        value="Robert Chen"
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-bold text-foreground outline-none opacity-70"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Review Status
                      </label>
                      <div className="relative">
                        <select
                          disabled={modalMode === "view"}
                          value={formStatus}
                          onChange={(e) =>
                            setFormStatus(e.target.value as ReviewStatus)
                          }
                          className={`w-full appearance-none px-4 py-2.5 rounded-xl border text-sm font-bold text-foreground outline-none cursor-pointer bg-card ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                        </select>
                        {modalMode !== "view" && (
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                      Strengths
                    </label>
                    <textarea
                      rows={2}
                      value={formStrengths}
                      onChange={(e) => setFormStrengths(e.target.value)}
                      readOnly={modalMode === "view"}
                      placeholder="Key strengths..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold outline-none focus:border-emerald-500 transition-all bg-card text-foreground ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                      style={{
                        borderColor: formErrors.strengths
                          ? "#EF4444"
                          : "var(--border)",
                      }}
                    />
                    {formErrors.strengths && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.strengths}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                      Improvement Areas
                    </label>
                    <textarea
                      rows={2}
                      value={formImprovement}
                      onChange={(e) => setFormImprovement(e.target.value)}
                      readOnly={modalMode === "view"}
                      placeholder="Areas to grow..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold outline-none focus:border-emerald-500 transition-all bg-card text-foreground ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                      style={{
                        borderColor: formErrors.improvement
                          ? "#EF4444"
                          : "var(--border)",
                      }}
                    />
                    {formErrors.improvement && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.improvement}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                      Recommendation
                    </label>
                    <div className="relative">
                      <select
                        disabled={modalMode === "view"}
                        value={formRecommendation}
                        onChange={(e) =>
                          setFormRecommendation(
                            e.target.value as Recommendation,
                          )
                        }
                        className={`w-full appearance-none px-4 py-2.5 rounded-xl border text-sm font-bold text-foreground outline-none focus:border-emerald-500 transition-all cursor-pointer bg-card ${modalMode === "view" ? "bg-muted cursor-not-allowed opacity-70 border-border" : "border-border"}`}
                      >
                        <option value="No Change">No Change</option>
                        <option value="Bonus">Bonus</option>
                        <option value="Increment">Increment</option>
                        <option value="Promotion">Promotion</option>
                      </select>
                      {modalMode !== "view" && (
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center gap-4 bg-muted/30">
              <Dialog.Close className="flex-1 py-3.5 rounded-2xl bg-card border border-border text-foreground text-sm font-black hover:bg-muted transition-all">
                {modalMode === "view" ? "Close" : "Cancel"}
              </Dialog.Close>
              {modalMode !== "view" && (
                <button
                  onClick={handleSaveReview}
                  className="flex-[2] py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-black shadow-lg shadow-emerald-20 hover:bg-emerald-600 transition-all"
                >
                  {modalMode === "edit" ? "Save Changes" : "Submit Evaluation"}
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Delete Confirmation Modal ── */}
      <AlertDialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-slate-900/30 z-[2000]" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-card rounded-[32px] shadow-2xl z-[2010] overflow-hidden focus:outline-none p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <AlertDialog.Title className="text-xl font-black text-foreground mb-2">
              Delete Review Record?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm font-bold text-muted-foreground mb-8">
              Are you sure you want to delete the performance record for{" "}
              <span className="text-foreground font-black">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex items-center gap-4">
              <AlertDialog.Cancel className="flex-1 py-3.5 rounded-2xl bg-muted text-foreground text-sm font-black hover:bg-secondary transition-all">
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={confirmDelete}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-black shadow-lg shadow-red-20 hover:bg-red-600 transition-all"
              >
                Delete Record
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
