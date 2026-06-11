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
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingEmp, setReviewingEmp] = useState<
    (typeof MOCK_TEAM_PERFORMANCE)[0] | null
  >(null);

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

  const handleReviewClick = (emp: (typeof MOCK_TEAM_PERFORMANCE)[0]) => {
    setReviewingEmp(emp);
    setReviewModalOpen(true);
    // Reset form state
    setCompRatings({});
    setCompComments({});
    setExpandedComments({});
    setGoalStatus({});
    setGoalComments({});
    setOverrideRating(false);
    setFinalRating("Exceeds");
    setPromoRec(false);
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
          <button className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2">
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
          <select className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-primary">
            <option>All Employees</option>
            <option>Engineering</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
        <div className="relative">
          <select className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-primary">
            <option>Review Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
        <div className="relative">
          <select className="pl-4 pr-8 py-2 rounded-xl border border-border bg-background text-sm font-bold outline-none appearance-none cursor-pointer focus:border-primary">
            <option>Rating</option>
            <option>&gt; 4.0</option>
            <option>&lt; 3.0</option>
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
              {MOCK_TEAM_PERFORMANCE.map((row) => (
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
                      <span className="text-xs font-semibold text-muted-foreground italic">
                        {row.managerRating}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-foreground">
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
                      <button className="text-sm font-bold text-primary hover:underline">
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
                      className="w-full p-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary resize-none min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Development Areas
                    </label>
                    <textarea
                      placeholder="Areas for improvement..."
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
                onClick={() => setReviewModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border bg-background rounded-xl hover:bg-secondary transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
