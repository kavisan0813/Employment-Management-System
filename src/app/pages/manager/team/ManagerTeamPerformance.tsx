import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Star,
  ChevronDown,
  X,
  Target,
  MessageSquare,
  Award,
  Clock,
} from "lucide-react";
import { showToast } from "../../../components/workflow/ToastNotification";

const MOCK_TEAM_PERFORMANCE = [
  {
    id: "p1",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    designation: "Sr Developer",
    dept: "Engineering",
    selfRating: "4.5",
    managerRating: "4.6 you",
    goalsMet: 9,
    goalsTotal: 10,
    finalScore: "Exceptional",
    status: "Completed",
  },
  {
    id: "p2",
    name: "Sneha Rao",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    designation: "Frontend Dev",
    dept: "Engineering",
    selfRating: "4.0",
    managerRating: "Pending your rating",
    goalsMet: 7,
    goalsTotal: 10,
    finalScore: "Pending",
    status: "In Progress",
  },
  {
    id: "p3",
    name: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    designation: "Junior Dev",
    dept: "Engineering",
    selfRating: "3.5",
    managerRating: "Pending",
    goalsMet: 6,
    goalsTotal: 10,
    finalScore: "Below Avg",
    status: "Not Started",
  },
  {
    id: "p4",
    name: "Leo Martinez",
    avatar: "https://i.pravatar.cc/150?u=Leo",
    designation: "Backend Dev",
    dept: "Engineering",
    selfRating: "4.2",
    managerRating: "4.3 you",
    goalsMet: 8,
    goalsTotal: 10,
    finalScore: "Exceeds",
    status: "Completed",
  },
  {
    id: "p5",
    name: "Aisha Khan",
    avatar: "https://i.pravatar.cc/150?u=Aisha",
    designation: "Sr Dev",
    dept: "Engineering",
    selfRating: "4.8",
    managerRating: "4.9 you",
    goalsMet: 10,
    goalsTotal: 10,
    finalScore: "Exceptional",
    status: "Completed",
  },
];

const MOCK_COMPLETED_REVIEWS: Record<
  string,
  {
    competencies: Record<string, { rating: number; comment: string }>;
    goals: Record<string, { status: string; comment: string }>;
    strengths: string;
    developmentAreas: string;
    promoRecommended: boolean;
    promoJustification: string;
  }
> = {
  p1: {
    competencies: {
      c1: {
        rating: 5,
        comment: "Exceptional coding standards and system design capabilities.",
      },
      c2: { rating: 4, comment: "Handles tough production issues with ease." },
      c3: {
        rating: 4,
        comment: "Communicates technical concepts clearly to stakeholders.",
      },
      c4: {
        rating: 5,
        comment: "Great mentor, goes out of his way to help others.",
      },
      c5: { rating: 5, comment: "Always delivers milestones on time." },
      c6: {
        rating: 4,
        comment:
          "Demonstrates strong leadership traits in architecture discussions.",
      },
    },
    goals: {
      g1: {
        status: "Met",
        comment: "Frontend migration was completed ahead of schedule.",
      },
      g2: {
        status: "Met",
        comment: "Reduced bundle size by 18%, exceeding the target of 15%.",
      },
      g3: {
        status: "Partially Met",
        comment:
          "Mentored one developer fully; second developer onboarding is ongoing.",
      },
    },
    strengths:
      "System design, high technical expertise, mentorship, and delivery reliability.",
    developmentAreas:
      "Could work on delegating more tasks to team members to scale impact.",
    promoRecommended: true,
    promoJustification:
      "Arjun has consistently performed at a Lead Engineer level over the past year.",
  },
  p4: {
    competencies: {
      c1: { rating: 4, comment: "Solid backend skills, designs robust APIs." },
      c2: { rating: 4, comment: "Strong debugging skills." },
      c3: { rating: 4, comment: "Collaborates well across the backend team." },
      c4: { rating: 4, comment: "Proactive in code reviews." },
      c5: { rating: 4, comment: "Good ownership of backend modules." },
      c6: { rating: 3, comment: "Starting to take initiative on design docs." },
    },
    goals: {
      g1: {
        status: "Met",
        comment: "Successfully supported the migration API requirements.",
      },
      g2: { status: "Met", comment: "Optimized DB queries to reduce load." },
      g3: { status: "Met", comment: "Mentored a junior backend developer." },
    },
    strengths:
      "Database optimization, API security, and collaborative team player.",
    developmentAreas:
      "Focus on presenting technical architecture diagrams to larger audiences.",
    promoRecommended: false,
    promoJustification: "",
  },
  p5: {
    competencies: {
      c1: {
        rating: 5,
        comment: "Outstanding technical architect. Highly proficient.",
      },
      c2: {
        rating: 5,
        comment: "Solves deep technical bugs quickly and cleanly.",
      },
      c3: { rating: 4, comment: "Articulate and constructive." },
      c4: { rating: 5, comment: "Excellent collaborator, loved by the team." },
      c5: {
        rating: 5,
        comment: "Exceptional delivery speed and code quality.",
      },
      c6: {
        rating: 5,
        comment:
          "Natural leader, runs standups and sprint planning efficiently.",
      },
    },
    goals: {
      g1: { status: "Met", comment: "Flawless React 18 migration execution." },
      g2: {
        status: "Met",
        comment: "Exceeded bundle size goal (reduced by 21%).",
      },
      g3: {
        status: "Met",
        comment:
          "Excellent mentorship, both juniors have leveled up significantly.",
      },
    },
    strengths:
      "Technical leadership, extreme ownership, mentoring, and execution speed.",
    developmentAreas:
      "Continue expanding influence to cross-functional product strategy.",
    promoRecommended: true,
    promoJustification:
      "Aisha is a stellar candidate for promotion to Lead/Staff level. Highly recommended.",
  },
};

const COMPETENCIES = [
  {
    id: "c1",
    name: "Technical Skills",
    desc: "Depth of technical knowledge and application.",
    self: "4.0",
  },
  {
    id: "c2",
    name: "Problem Solving",
    desc: "Ability to analyze and resolve complex issues.",
    self: "4.0",
  },
  {
    id: "c3",
    name: "Communication",
    desc: "Clarity in written and verbal exchanges.",
    self: "4.5",
  },
  {
    id: "c4",
    name: "Teamwork & Collaboration",
    desc: "Working effectively within and across teams.",
    self: "4.0",
  },
  {
    id: "c5",
    name: "Delivery & Ownership",
    desc: "Taking responsibility for project outcomes.",
    self: "3.5",
  },
  {
    id: "c6",
    name: "Leadership Potential",
    desc: "Mentoring others and taking initiative.",
    self: "4.0",
  },
];

const GOALS = [
  { id: "g1", text: "Complete Frontend Migration to React 18" },
  { id: "g2", text: "Reduce bundle size by 15%" },
  { id: "g3", text: "Mentorship of 2 junior developers" },
];

export function ManagerTeamPerformance() {
  const [teamPerformance, setTeamPerformance] = useState(MOCK_TEAM_PERFORMANCE);
  const [completedReviews, setCompletedReviews] = useState(
    MOCK_COMPLETED_REVIEWS,
  );

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingEmp, setReviewingEmp] = useState<
    (typeof MOCK_TEAM_PERFORMANCE)[0] | null
  >(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingEmp, setViewingEmp] = useState<
    (typeof MOCK_TEAM_PERFORMANCE)[0] | null
  >(null);

  const [deptFilter, setDeptFilter] = useState("All Employees");
  const [statusFilter, setStatusFilter] = useState("Review Status");
  const [ratingFilter, setRatingFilter] = useState("Rating");

  const filteredPerformance = teamPerformance.filter((row) => {
    // Dept filter
    if (deptFilter !== "All Employees" && row.dept !== deptFilter) {
      return false;
    }
    // Status filter
    if (statusFilter === "Completed" && row.status !== "Completed") {
      return false;
    }
    if (statusFilter === "Pending" && row.status === "Completed") {
      return false;
    }
    // Rating filter
    const selfRatingNum = parseFloat(row.selfRating);
    if (ratingFilter === "> 4.0" && selfRatingNum <= 4.0) {
      return false;
    }
    if (ratingFilter === "< 3.0" && selfRatingNum >= 3.0) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Designation",
      "Department",
      "Self Rating",
      "Manager Rating",
      "Goals Met",
      "Goals Total",
      "Final Score",
      "Status",
    ];
    const rows = filteredPerformance.map((row) =>
      [
        row.id,
        `"${row.name}"`,
        `"${row.designation}"`,
        `"${row.dept}"`,
        row.selfRating,
        `"${row.managerRating}"`,
        row.goalsMet,
        row.goalsTotal,
        row.finalScore,
        row.status,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_performance_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      "Exported!",
      "success",
      "Team performance report downloaded as CSV.",
    );
  };

  const handleExportScorecard = (emp: (typeof MOCK_TEAM_PERFORMANCE)[0]) => {
    const reviewDetails = completedReviews[emp.id];
    if (!reviewDetails) {
      showToast(
        "No Review Data",
        "error",
        "No completed review data found for this employee.",
      );
      return;
    }
    const lines = [
      `viyanHR Scorecard Report`,
      `Employee Name: ${emp.name}`,
      `Designation: ${emp.designation}`,
      `Department: ${emp.dept}`,
      `Self Rating: ${emp.selfRating}`,
      `Manager Rating: ${emp.managerRating}`,
      `Final Score: ${emp.finalScore}`,
      `Goals Met: ${emp.goalsMet} / ${emp.goalsTotal}`,
      `----------------------------------------`,
      `Key Strengths: ${reviewDetails.strengths}`,
      `Development Areas: ${reviewDetails.developmentAreas}`,
      `Promotion Recommended: ${reviewDetails.promoRecommended ? "Yes" : "No"}`,
      `Promotion Justification: ${reviewDetails.promoJustification || "N/A"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${emp.name.replace(/\s+/g, "_")}_scorecard.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!", "success", "Scorecard exported successfully.");
  };

  // Review Form State
  const [compRatings, setCompRatings] = useState<Record<string, number>>({});
  const [compComments, setCompComments] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [goalStatus, setGoalStatus] = useState<Record<string, string>>({});
  const [goalComments, setGoalComments] = useState<Record<string, string>>({});
  const [overrideRating, setOverrideRating] = useState(false);
  const [finalRating, setFinalRating] = useState("Exceeds");
  const [promoRec, setPromoRec] = useState(false);
  const [strengths, setStrengths] = useState("");
  const [developmentAreas, setDevelopmentAreas] = useState("");
  const [promoJustification, setPromoJustification] = useState("");

  const handleReviewClick = (emp: (typeof MOCK_TEAM_PERFORMANCE)[0]) => {
    setReviewingEmp(emp);
    setReviewModalOpen(true);
    // Reset form state or load draft if exists
    const draft = completedReviews[emp.id];
    if (draft) {
      const compRatingsMap: Record<string, number> = {};
      const compCommentsMap: Record<string, string> = {};
      const expandedCommentsMap: Record<string, boolean> = {};
      Object.entries(draft.competencies).forEach(([id, c]) => {
        compRatingsMap[id] = c.rating;
        compCommentsMap[id] = c.comment;
        if (c.comment) {
          expandedCommentsMap[id] = true;
        }
      });
      setCompRatings(compRatingsMap);
      setCompComments(compCommentsMap);
      setExpandedComments(expandedCommentsMap);

      const goalStatusMap: Record<string, string> = {};
      const goalCommentsMap: Record<string, string> = {};
      Object.entries(draft.goals).forEach(([id, g]) => {
        goalStatusMap[id] = g.status;
        goalCommentsMap[id] = g.comment;
      });
      setGoalStatus(goalStatusMap);
      setGoalComments(goalCommentsMap);

      setOverrideRating(
        emp.status === "Completed" && emp.finalScore !== "Pending",
      );
      setFinalRating(emp.finalScore !== "Pending" ? emp.finalScore : "Exceeds");
      setPromoRec(draft.promoRecommended);
      setStrengths(draft.strengths);
      setDevelopmentAreas(draft.developmentAreas);
      setPromoJustification(draft.promoJustification);
    } else {
      setCompRatings({});
      setCompComments({});
      setExpandedComments({});
      setGoalStatus({});
      setGoalComments({});
      setOverrideRating(false);
      setFinalRating("Exceeds");
      setPromoRec(false);
      setStrengths("");
      setDevelopmentAreas("");
      setPromoJustification("");
    }
  };

  const handleSaveReview = (isSubmit: boolean) => {
    if (!reviewingEmp) return;

    const avg = calcAvg();
    let finalScoreStr = finalRating;

    if (!overrideRating) {
      const avgNum = parseFloat(avg);
      if (avgNum >= 4.5) finalScoreStr = "Exceptional";
      else if (avgNum >= 4.0) finalScoreStr = "Exceeds";
      else if (avgNum >= 3.0) finalScoreStr = "Meets";
      else if (avgNum >= 2.0) finalScoreStr = "Below Avg";
      else finalScoreStr = "Unsatisfactory";
    }

    setTeamPerformance((prev) =>
      prev.map((emp) =>
        emp.id === reviewingEmp.id
          ? {
              ...emp,
              status: isSubmit ? "Completed" : "In Progress",
              managerRating: avg !== "0.0" ? `${avg} you` : emp.managerRating,
              finalScore: isSubmit ? finalScoreStr : emp.finalScore,
            }
          : emp,
      ),
    );

    const finalCompetencies: Record<
      string,
      { rating: number; comment: string }
    > = {};
    COMPETENCIES.forEach((comp) => {
      finalCompetencies[comp.id] = {
        rating: compRatings[comp.id] || 3,
        comment: compComments[comp.id] || "",
      };
    });

    const finalGoals: Record<string, { status: string; comment: string }> = {};
    GOALS.forEach((goal) => {
      finalGoals[goal.id] = {
        status: goalStatus[goal.id] || "Met",
        comment: goalComments[goal.id] || "",
      };
    });

    setCompletedReviews((prev) => ({
      ...prev,
      [reviewingEmp.id]: {
        competencies: finalCompetencies,
        goals: finalGoals,
        strengths: strengths || "No strengths specified.",
        developmentAreas: developmentAreas || "No development areas specified.",
        promoRecommended: promoRec,
        promoJustification: promoRec ? promoJustification : "",
      },
    }));

    setReviewModalOpen(false);
    showToast(
      isSubmit ? "Submitted!" : "Saved!",
      "success",
      isSubmit ? "Review submitted successfully." : "Draft saved successfully.",
    );
  };

  const getScoreChip = (score: string) => {
    if (score === "Exceptional")
      return (
        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-200">
          Exceptional
        </span>
      );
    if (score === "Exceeds")
      return (
        <span className="px-2 py-1 rounded bg-teal-100 text-teal-700 text-[11px] font-bold border border-teal-200">
          Exceeds
        </span>
      );
    if (score === "Below Avg")
      return (
        <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[11px] font-bold border border-red-200">
          Below Avg
        </span>
      );
    if (score === "Pending")
      return (
        <span className="text-[11px] font-bold text-muted-foreground">—</span>
      );
    return (
      <span className="px-2 py-1 rounded bg-slate-500/10 text-slate-500 text-[11px] font-bold border border-slate-200">
        {score}
      </span>
    );
  };

  const getStatusChip = (status: string) => {
    if (status === "Completed")
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
          <CheckCircle2 size={12} /> Completed
        </span>
      );
    if (status === "In Progress")
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
          <Clock size={12} /> In Progress
        </span>
      );
    if (status === "Not Started")
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
          <AlertTriangle size={12} /> Not Started
        </span>
      );
    return null;
  };

  const getRatingColor = (rating: number, isSelected: boolean) => {
    if (!isSelected)
      return "bg-[#F3F4F6] text-muted-foreground border-transparent hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700";
    if (rating === 1) return "bg-rose-500 text-white border-rose-600 shadow-sm";
    if (rating === 2)
      return "bg-amber-500 text-white border-amber-600 shadow-sm";
    if (rating === 3)
      return "bg-yellow-500 text-white border-yellow-600 shadow-sm";
    if (rating === 4) return "bg-teal-500 text-white border-teal-600 shadow-sm";
    if (rating === 5)
      return "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    return "";
  };

  const calcAvg = () => {
    const values = Object.values(compRatings);
    if (values.length === 0) return "0.0";
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center shrink-0">
            <TrendingUp size={22} className="text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold tracking-tight leading-none text-foreground">
                Team Performance
              </h1>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[11px] font-semibold uppercase rounded-full border border-indigo-200">
                FY 2024-25 Annual Review
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Evaluate your direct reports and submit final ratings.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-bold rounded-lg border border-amber-200 flex items-center gap-1.5">
            <Clock size={14} /> Review deadline: Apr 25
          </span>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Reviews Completed
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-emerald-600 leading-none">
              5/12
            </p>
            <p className="text-sm font-bold text-emerald-600/70 mb-0.5">
              reports
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Pending My Reviews
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-amber-500 leading-none">4</p>
            <p className="text-sm font-bold text-amber-600/70 mb-0.5">
              pending
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Avg Team Rating
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-amber-500 leading-none flex items-center gap-1">
              4.1
              <Star size={24} fill="currentColor" />
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Team Band
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-emerald-600 leading-none">
              B
            </p>
            <p className="text-sm font-bold text-emerald-600/70 mb-0.5">
              overall
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-3 mb-6 bg-card p-3 rounded-2xl border border-border shadow-sm">
        <div className="relative">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C]"
          >
            <option value="All Employees">All Employees</option>
            <option value="Engineering">Engineering</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C]"
          >
            <option value="Review Status">Review Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
        <div className="relative">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-[#00B87C] focus:ring-1 focus:ring-[#00B87C]"
          >
            <option value="Rating">Rating</option>
            <option value="> 4.0">&gt; 4.0</option>
            <option value="< 3.0">&lt; 3.0</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* PERFORMANCE TABLE */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-border">Employee</th>
                <th className="px-6 py-4 border-b border-border">
                  Self Rating
                </th>
                <th className="px-6 py-4 border-b border-border">
                  Manager Rating
                </th>
                <th className="px-6 py-4 border-b border-border">Goals Met</th>
                <th className="px-6 py-4 border-b border-border">
                  Final Score
                </th>
                <th className="px-6 py-4 border-b border-border">Status</th>
                <th className="px-6 py-4 border-b border-border text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPerformance.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#00B87C]/[0.08] transition-colors h-[64px]"
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        className="w-9 h-9 rounded-full border border-border"
                      />
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {row.name}
                        </p>
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          {row.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <Star
                        size={14}
                        className="text-amber-400"
                        fill="#fbbf24"
                      />{" "}
                      {row.selfRating}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    {row.managerRating.includes("Pending") ? (
                      <span
                        onClick={() => handleReviewClick(row)}
                        className="text-xs font-semibold text-muted-foreground italic cursor-pointer hover:text-emerald-600 hover:underline transition-colors"
                        title="Click to review this employee"
                      >
                        {row.managerRating}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setViewingEmp(row);
                          setViewModalOpen(true);
                        }}
                        className="flex items-center gap-1 font-bold text-foreground cursor-pointer hover:text-emerald-600 hover:underline transition-colors"
                        title="Click to view scorecard"
                      >
                        <Star
                          size={14}
                          className="text-emerald-500"
                          fill="#10b981"
                        />{" "}
                        {row.managerRating}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>
                          {row.goalsMet}/{row.goalsTotal}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.goalsMet >= 8 ? "bg-emerald-500" : row.goalsMet >= 7 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{
                            width: `${(row.goalsMet / row.goalsTotal) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">{getScoreChip(row.finalScore)}</td>
                  <td className="px-6 py-2">{getStatusChip(row.status)}</td>
                  <td className="px-6 py-2 text-right">
                    {row.status === "Completed" ? (
                      <button
                        onClick={() => {
                          setViewingEmp(row);
                          setViewModalOpen(true);
                        }}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        View
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReviewClick(row)}
                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
                      >
                        Review Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PERFORMANCE REVIEW MODAL */}
      {reviewModalOpen && reviewingEmp && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[560px] max-h-[90vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center text-amber-500">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-none mb-1">
                    Performance Review
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">
                      {reviewingEmp.name}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider rounded-full">
                      FY 2024-25
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-800 text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Employee Mini Card */}
              <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl border border-border/50">
                <img
                  src={reviewingEmp.avatar}
                  className="w-12 h-12 rounded-full border-2 border-background shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {reviewingEmp.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-medium">
                    <span>{reviewingEmp.designation}</span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="px-1.5 py-0.5 bg-background border border-border rounded text-[11px] uppercase font-bold">
                      {reviewingEmp.dept}
                    </span>
                  </div>
                </div>
              </div>

              {/* COMPETENCY RATINGS */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">
                  Competency Ratings
                </h4>
                <div className="space-y-4">
                  {COMPETENCIES.map((comp) => (
                    <div
                      key={comp.id}
                      className="bg-background border border-border rounded-xl p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {comp.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {comp.desc}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
                            {[1, 2, 3, 4, 5].map((rating) => {
                              const isSelected =
                                compRatings[comp.id] === rating;
                              return (
                                <button
                                  key={rating}
                                  onClick={() =>
                                    setCompRatings((prev) => ({
                                      ...prev,
                                      [comp.id]: rating,
                                    }))
                                  }
                                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all border ${getRatingColor(rating, isSelected)}`}
                                >
                                  {rating}
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Self: ⭐{comp.self}
                          </span>
                        </div>
                      </div>

                      {/* Comment Toggle */}
                      <div>
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [comp.id]: !prev[comp.id],
                            }))
                          }
                          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <MessageSquare size={12} />{" "}
                          {expandedComments[comp.id]
                            ? "Hide Comment"
                            : "Add Comment"}
                        </button>
                        {expandedComments[comp.id] && (
                          <textarea
                            placeholder="Manager comments on this competency..."
                            className="w-full mt-2 p-2.5 text-xs bg-secondary border border-border rounded-lg outline-none focus:border-primary resize-none min-h-[60px]"
                            value={compComments[comp.id] || ""}
                            onChange={(e) =>
                              setCompComments((prev) => ({
                                ...prev,
                                [comp.id]: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* GOAL REVIEW */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Target size={14} /> Goal Review
                </h4>
                <div className="space-y-3">
                  {GOALS.map((goal) => (
                    <div
                      key={goal.id}
                      className="bg-background border border-border rounded-xl p-4"
                    >
                      <p className="text-sm font-bold text-foreground mb-3">
                        {goal.text}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {["Met", "Partially Met", "Not Met"].map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              setGoalStatus((prev) => ({
                                ...prev,
                                [goal.id]: status,
                              }))
                            }
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                              goalStatus[goal.id] === status
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-secondary text-muted-foreground border-border hover:bg-neutral-200 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      <textarea
                        placeholder="Manager evaluation for this goal..."
                        className="w-full p-2.5 text-xs bg-secondary border border-border rounded-lg outline-none focus:border-primary resize-none min-h-[50px]"
                        value={goalComments[goal.id] || ""}
                        onChange={(e) =>
                          setGoalComments((prev) => ({
                            ...prev,
                            [goal.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* OVERALL RATING */}
              <section className="bg-secondary/50 rounded-xl p-5 border border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Award size={14} /> Overall Rating
                </h4>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Calculated Average
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Based on competency ratings
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-foreground flex items-center gap-1">
                    {calcAvg()}{" "}
                    <Star
                      size={20}
                      className="text-amber-500"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                  <label className="text-sm font-bold text-foreground">
                    Override Final Rating
                  </label>
                  <button
                    onClick={() => setOverrideRating(!overrideRating)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${overrideRating ? "bg-primary" : "bg-neutral-300 dark:bg-zinc-600"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${overrideRating ? "left-5" : "left-1"}`}
                    ></div>
                  </button>
                </div>

                {overrideRating && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Final Status
                    </label>
                    <div className="relative">
                      <select
                        value={finalRating}
                        onChange={(e) => setFinalRating(e.target.value)}
                        className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none focus:border-primary"
                      >
                        <option>Exceptional</option>
                        <option>Exceeds</option>
                        <option>Meets</option>
                        <option>Below Avg</option>
                        <option>Unsatisfactory</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* FEEDBACK */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">
                  Summary Feedback
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Key Strengths
                    </label>
                    <textarea
                      placeholder="Key strengths observed..."
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                      className="w-full p-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary resize-none min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Development Areas
                    </label>
                    <textarea
                      placeholder="Areas for improvement..."
                      value={developmentAreas}
                      onChange={(e) => setDevelopmentAreas(e.target.value)}
                      className="w-full p-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary resize-none min-h-[80px]"
                    />
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                        Promotion Recommendation
                      </label>
                      <div className="flex bg-background border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setPromoRec(true)}
                          className={`px-3 py-1 text-xs font-bold transition-colors ${promoRec ? "bg-indigo-500 text-white" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setPromoRec(false)}
                          className={`px-3 py-1 text-xs font-bold transition-colors ${!promoRec ? "bg-slate-200 dark:bg-zinc-700 text-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {promoRec && (
                      <textarea
                        placeholder="Justification for promotion..."
                        value={promoJustification}
                        onChange={(e) => setPromoJustification(e.target.value)}
                        className="w-full mt-2 p-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-indigo-400 resize-none min-h-[60px]"
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30 rounded-b-2xl flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => handleSaveReview(false)}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border bg-background rounded-xl hover:bg-secondary transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSaveReview(true)}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PERFORMANCE SCORECARD MODAL */}
      {viewModalOpen &&
        viewingEmp &&
        (() => {
          const defaultReview = {
            competencies: {
              c1: {
                rating: 4,
                comment: "Demonstrates solid technical capabilities.",
              },
              c2: {
                rating: 4,
                comment:
                  "Analytically strong and resolves issues methodically.",
              },
              c3: {
                rating: 4,
                comment: "Communication is clear and professional.",
              },
              c4: {
                rating: 4,
                comment: "Collaborates effectively within the team.",
              },
              c5: {
                rating: 4,
                comment: "Consistent delivery of assigned responsibilities.",
              },
              c6: {
                rating: 3,
                comment:
                  "Actively participates and takes ownership when prompted.",
              },
            },
            goals: {
              g1: {
                status: "Met",
                comment: "Met the core objectives of this goal.",
              },
              g2: {
                status: "Met",
                comment: "Successfully accomplished bundle size reductions.",
              },
              g3: {
                status: "Met",
                comment: "Helped guide junior members during onboarding.",
              },
            },
            strengths:
              "Dependable, technical skills, and team-oriented approach.",
            developmentAreas:
              "Continue to drive initiatives independently and build leadership capability.",
            promoRecommended: false,
            promoJustification: "",
          };

          const reviewDetails =
            completedReviews[viewingEmp.id] || defaultReview;

          return (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-[640px] max-h-[90vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-emerald-500/15 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-none mb-1">
                        Performance Scorecard
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          {viewingEmp.name}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-full">
                          Submitted
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-800 text-muted-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Profile Details */}
                  <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl border border-border/50">
                    <img
                      src={viewingEmp.avatar}
                      className="w-12 h-12 rounded-full border-2 border-background shadow-sm"
                    />
                    <div>
                      <h4 className="text-base font-bold text-foreground">
                        {viewingEmp.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-medium">
                        <span>{viewingEmp.designation}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="px-1.5 py-0.5 bg-background border border-border rounded text-[11px] uppercase font-bold">
                          {viewingEmp.dept}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric Cards Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-background border border-border rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Final Score
                      </span>
                      <div className="mt-1.5 flex justify-center">
                        {getScoreChip(viewingEmp.finalScore)}
                      </div>
                    </div>
                    <div className="bg-background border border-border rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Manager Rating
                      </span>
                      <div className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        <Star size={14} fill="currentColor" />
                        <span>
                          {viewingEmp.managerRating.replace(" you", "")}
                        </span>
                      </div>
                    </div>
                    <div className="bg-background border border-border rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Self Rating
                      </span>
                      <div className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span>{viewingEmp.selfRating}</span>
                      </div>
                    </div>
                    <div className="bg-background border border-border rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Goals Met
                      </span>
                      <div className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                        <Target size={14} className="text-muted-foreground" />
                        <span>
                          {viewingEmp.goalsMet}/{viewingEmp.goalsTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Competency Ratings Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">
                      Competency Scores & Feedback
                    </h4>
                    <div className="space-y-3.5">
                      {COMPETENCIES.map((comp) => {
                        const score =
                          reviewDetails.competencies[comp.id]?.rating || 4;
                        const comment =
                          reviewDetails.competencies[comp.id]?.comment || "";
                        return (
                          <div
                            key={comp.id}
                            className="bg-background border border-border rounded-xl p-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                              <div>
                                <p className="text-sm font-bold text-foreground">
                                  {comp.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {comp.desc}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <span
                                      key={num}
                                      className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold border ${
                                        num === score
                                          ? getRatingColor(num, true)
                                          : "bg-secondary text-muted-foreground border-transparent"
                                      }`}
                                    >
                                      {num}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border shrink-0">
                                  Self: ⭐{comp.self}
                                </div>
                              </div>
                            </div>
                            {comment && (
                              <div className="mt-2.5 p-2.5 bg-secondary/60 rounded-lg border border-border/50 text-xs text-foreground italic flex gap-2">
                                <MessageSquare
                                  size={12}
                                  className="text-muted-foreground shrink-0 mt-0.5"
                                />
                                <span>"{comment}"</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Goals Review Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2 flex items-center gap-2">
                      <Target size={14} /> Goal Achievements
                    </h4>
                    <div className="space-y-3">
                      {GOALS.map((goal) => {
                        const gInfo = reviewDetails.goals[goal.id] || {
                          status: "Met",
                          comment: "",
                        };
                        return (
                          <div
                            key={goal.id}
                            className="bg-background border border-border rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="text-sm font-bold text-foreground">
                                {goal.text}
                              </p>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                  gInfo.status === "Met"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-200"
                                    : gInfo.status === "Partially Met"
                                      ? "bg-amber-500/10 text-amber-500 border-amber-200"
                                      : "bg-rose-500/10 text-rose-500 border-rose-200"
                                }`}
                              >
                                {gInfo.status}
                              </span>
                            </div>
                            {gInfo.comment && (
                              <p className="text-xs text-muted-foreground mt-1 bg-secondary/40 p-2 rounded-lg border border-border/30">
                                {gInfo.comment}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Feedback & Promo Recommendations */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 border-b border-border pb-2">
                      Summary Feedback
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-background border border-border rounded-xl p-4">
                        <span className="text-xs font-bold text-foreground block mb-1">
                          Key Strengths
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {reviewDetails.strengths}
                        </p>
                      </div>
                      <div className="bg-background border border-border rounded-xl p-4">
                        <span className="text-xs font-bold text-foreground block mb-1">
                          Development Areas
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {reviewDetails.developmentAreas}
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                          Promotion Recommendation
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-lg ${
                            reviewDetails.promoRecommended
                              ? "bg-indigo-500 text-white"
                              : "bg-slate-200 dark:bg-zinc-700 text-foreground"
                          }`}
                        >
                          {reviewDetails.promoRecommended
                            ? "Recommended"
                            : "Not Recommended"}
                        </span>
                      </div>
                      {reviewDetails.promoRecommended &&
                        reviewDetails.promoJustification && (
                          <p className="mt-2.5 text-xs text-indigo-950/80 dark:text-indigo-200/80 italic bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                            {reviewDetails.promoJustification}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-secondary/30 rounded-b-2xl flex items-center justify-between shrink-0">
                  <button
                    onClick={() => {
                      if (viewingEmp) {
                        handleExportScorecard(viewingEmp);
                      }
                    }}
                    className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border bg-background hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <Download size={16} /> Export PDF
                  </button>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
