import { useState, forwardRef } from "react";
import {
  Target,
  Plus,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  X,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../components/workflow/ToastNotification";

type GoalStatus =
  | "All"
  | "In Progress"
  | "Completed"
  | "At Risk"
  | "Not Started";
type Priority = "High" | "Medium" | "Low";
type Category =
  | "Finance"
  | "Compliance"
  | "Leadership"
  | "Personal"
  | "Technical";

interface Goal {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  progress: number;
  deadline: string;
  kr: string;
  lastUpdated: string;
  manager: string;
  status: GoalStatus;
}

const INITIAL_GOALS: Goal[] = [
  {
    id: "1",
    title: "TDS Automation",
    category: "Finance",
    priority: "High",
    progress: 80,
    deadline: "Q2 Target",
    kr: "Reduce payroll error rate to 0.5%",
    lastUpdated: "Apr 5",
    manager: "Rajan Kumar",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Payroll Error Reduction",
    category: "Finance",
    priority: "High",
    progress: 95,
    deadline: "Q2 Target",
    kr: "Achieve 99.5% accuracy in payroll",
    lastUpdated: "Apr 10",
    manager: "Rajan Kumar",
    status: "Completed",
  },
  {
    id: "3",
    title: "Salary Band Structure",
    category: "Finance",
    priority: "Medium",
    progress: 40,
    deadline: "Q3 Target",
    kr: "Implement new band structure across 5 depts",
    lastUpdated: "Mar 28",
    manager: "Rajan Kumar",
    status: "At Risk",
  },
  {
    id: "4",
    title: "GST Certification",
    category: "Compliance",
    priority: "High",
    progress: 100,
    deadline: "Completed",
    kr: "Obtain professional GST certification",
    lastUpdated: "Apr 1",
    manager: "Rajan Kumar",
    status: "Completed",
  },
  {
    id: "5",
    title: "Mentor Junior Analyst",
    category: "Leadership",
    priority: "Medium",
    progress: 60,
    deadline: "Q4 Target",
    kr: "Weekly mentoring sessions with 2 analysts",
    lastUpdated: "Apr 8",
    manager: "Rajan Kumar",
    status: "In Progress",
  },
  {
    id: "6",
    title: "SAP FICO Module Training",
    category: "Technical",
    priority: "Low",
    progress: 25,
    deadline: "Q4 Target",
    kr: "Complete advanced FICO certification",
    lastUpdated: "Apr 2",
    manager: "Rajan Kumar",
    status: "In Progress",
  },
];

export function FinanceGoals() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [activeTab, setActiveTab] = useState<GoalStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const filteredGoals = goals.filter(
    (goal) => activeTab === "All" || goal.status === activeTab,
  );

  // Compute dynamic stats
  const goalsSetCount = goals.length;
  const completedCount = goals.filter((g) => g.status === "Completed").length;
  const inProgressCount = goals.filter(
    (g) => g.status === "In Progress",
  ).length;
  const atRiskCount = goals.filter((g) => g.status === "At Risk").length;

  const overallProgress =
    goals.length > 0
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
      : 0;
  const goalsOnTrack = goals.filter((g) => g.status !== "At Risk").length;

  const handleAddGoal = (newGoalData: {
    title: string;
    category: Category;
    priority: Priority;
    deadline: string;
    kr: string;
  }) => {
    const newGoal: Goal = {
      id: String(goals.length + 1),
      title: newGoalData.title,
      category: newGoalData.category,
      priority: newGoalData.priority,
      progress: 0,
      deadline: newGoalData.deadline || "Q4 Target",
      kr: newGoalData.kr || "Achieve target outcomes",
      lastUpdated: "Today",
      manager: "Rajan Kumar",
      status: "In Progress",
    };

    setGoals([...goals, newGoal]);
    showToast(
      "Goal Added",
      "success",
      `"${newGoalData.title}" has been successfully added.`,
    );
  };

  const handleCheckIn = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        const newProgress = Math.min(g.progress + 10, 100);
        const newStatus: GoalStatus =
          newProgress === 100
            ? "Completed"
            : g.status === "At Risk" && newProgress >= 50
              ? "In Progress"
              : g.status;

        showToast(
          "Check-in Complete",
          "success",
          `Progress for "${g.title}" updated to ${newProgress}%.`,
        );

        return {
          ...g,
          progress: newProgress,
          status: newStatus,
          lastUpdated: "Today",
        };
      }),
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
            <Target size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              My Goals
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Focus on your key objectives and growth
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-muted text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            FY 2025-26
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Plus size={16} /> Add Goal
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="GOALS SET"
          value={String(goalsSetCount)}
          color="default"
        />
        <KPICard
          label="COMPLETED"
          value={String(completedCount)}
          color="green"
        />
        <KPICard
          label="IN PROGRESS"
          value={String(inProgressCount)}
          color="teal"
        />
        <KPICard label="AT RISK" value={String(atRiskCount)} color="red" />
      </div>

      {/* OVERALL PROGRESS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#00B87C]" />
            <span className="text-[15px] font-black text-foreground tracking-tight">
              Overall Progress: {overallProgress}%
            </span>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">
            {goalsOnTrack} / {goals.length} goals on track
          </span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            className="h-full bg-[#00B87C] rounded-full"
          />
        </div>
      </div>

      {/* GOALS LIST */}
      <div className="bg-card border border-border rounded-[32px] p-2 md:p-4 shadow-sm min-h-[500px]">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border px-4 mb-6 overflow-x-auto no-scrollbar">
          {(
            [
              "All",
              "In Progress",
              "Completed",
              "At Risk",
              "Not Started",
            ] as GoalStatus[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[12px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabGoals"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 px-2">
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onCheckIn={handleCheckIn}
                onViewDetails={setSelectedGoal}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ADD GOAL MODAL */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGoal}
      />

      {/* GOAL DETAILS MODAL */}
      <AnimatePresence>
        {selectedGoal && (
          <GoalDetailsModal
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
            onUpdateProgress={(id, progress) => {
              setGoals((prev) =>
                prev.map((g) => {
                  if (g.id !== id) return g;
                  const newProgress = Math.min(progress, 100);
                  const isCompleted = newProgress === 100;
                  const newStatus = isCompleted
                    ? "Completed"
                    : g.status === "Completed"
                      ? "In Progress"
                      : g.status;
                  showToast(
                    "Goal Updated",
                    "success",
                    `Progress for "${g.title}" updated to ${newProgress}%.`,
                  );
                  return {
                    ...g,
                    progress: newProgress,
                    status: newStatus,
                    lastUpdated: "Today",
                  };
                }),
              );
              setSelectedGoal((prev) => {
                if (!prev) return null;
                const newProgress = Math.min(progress, 100);
                const isCompleted = newProgress === 100;
                const newStatus = isCompleted
                  ? "Completed"
                  : prev.status === "Completed"
                    ? "In Progress"
                    : prev.status;
                return {
                  ...prev,
                  progress: newProgress,
                  status: newStatus,
                  lastUpdated: "Today",
                };
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function KPICard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "default" | "green" | "teal" | "red";
}) {
  const colorMap = {
    default: "text-[#111827] dark:text-white",
    green: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    teal: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    red: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-[#00B87C]/30 transition-all">
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
        {label}
      </p>
      <h3
        className={`text-2xl font-black tracking-tight ${colorMap[color].includes(" ") ? colorMap[color].split(" ")[0] : colorMap[color]}`}
      >
        {value}
      </h3>
    </div>
  );
}

const GoalItem = forwardRef<
  HTMLDivElement,
  {
    goal: Goal;
    onCheckIn: (id: string) => void;
    onViewDetails: (goal: Goal) => void;
  }
>(({ goal, onCheckIn, onViewDetails }, ref) => {
  const statusIcon =
    goal.status === "Completed" ? (
      <CheckCircle2 size={16} className="text-emerald-500" />
    ) : goal.status === "At Risk" ? (
      <AlertCircle size={16} className="text-rose-500" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-[#00B87C]/50 border-t-[#00B87C] animate-spin" />
    );

  const priorityColor =
    goal.priority === "High"
      ? "text-rose-600 bg-rose-500/10 border-rose-500/20"
      : goal.priority === "Medium"
        ? "text-amber-600 bg-amber-500/10 border-amber-500/20"
        : "text-muted-foreground bg-muted/50 border-border";

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="p-4 rounded-2xl border border-border bg-card hover:border-[#00B87C]/30 transition-all space-y-4 group"
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {statusIcon}
          <h4 className="text-[14px] font-black text-foreground tracking-tight">
            {goal.title}
          </h4>
          <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            {goal.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-widest ${priorityColor}`}
          >
            {goal.priority}
          </span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* PROGRESS ROW */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            className="h-full bg-[#00B87C] rounded-full"
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
          <span className="text-[#00B87C]">{goal.progress}%</span>
          <span className="text-muted-foreground">{goal.deadline}</span>
        </div>
      </div>

      {/* DETAIL ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2 border-t border-border/50">
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-muted-foreground italic tracking-tight">
            KR: {goal.kr}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-muted-foreground/60">
              Last updated: {goal.lastUpdated}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[8px] font-black text-blue-600">
                RK
              </div>
              <span className="text-[11px] font-bold text-muted-foreground">
                {goal.manager}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION ROW */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewDetails(goal)}
            className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            View Details <ChevronRight size={14} />
          </button>
          {goal.status !== "Completed" && (
            <button
              onClick={() => onCheckIn(goal.id)}
              className="px-4 py-1.5 rounded-lg border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-muted transition-all bg-transparent"
            >
              Check-in
            </button>
          )}
          <ChevronRight
            size={18}
            className="text-muted-foreground group-hover:text-[#00B87C] transition-all ml-1"
          />
        </div>
      </div>
    </motion.div>
  );
});
GoalItem.displayName = "GoalItem";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: {
    title: string;
    category: Category;
    priority: Priority;
    deadline: string;
    kr: string;
  }) => void;
}

function AddGoalModal({ isOpen, onClose, onSubmit }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Finance");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [targetDate, setTargetDate] = useState("");
  const [kr, setKr] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Validation Error", "error", "Goal title is required.");
      return;
    }

    // Convert targetDate (YYYY-MM-DD) to Q1/Q2/Q3/Q4 Target format for deadline
    let deadlineStr = "Q4 Target";
    if (targetDate) {
      const date = new Date(targetDate);
      const month = date.getMonth(); // 0-11
      if (month >= 0 && month <= 2) deadlineStr = "Q1 Target";
      else if (month >= 3 && month <= 5) deadlineStr = "Q2 Target";
      else if (month >= 6 && month <= 8) deadlineStr = "Q3 Target";
      else deadlineStr = "Q4 Target";
    }

    onSubmit({
      title: title.trim(),
      category,
      priority,
      deadline: deadlineStr,
      kr: kr.trim() || "Achieve target outcomes",
    });

    // Reset inputs
    setTitle("");
    setCategory("Finance");
    setPriority("Medium");
    setTargetDate("");
    setKr("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[480px] bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground tracking-tight">
              Add New Goal
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement TDS Automation"
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "Finance",
                    "Compliance",
                    "Leadership",
                    "Personal",
                    "Technical",
                  ] as Category[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                      category === cat
                        ? "bg-[#00B87C] text-white border-[#00B87C]"
                        : "border-border text-foreground hover:border-[#00B87C]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                      priority === p
                        ? p === "High"
                          ? "bg-rose-500 text-white border-rose-500"
                          : p === "Medium"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-blue-500 text-white border-blue-500"
                        : `border-border hover:border-[#00B87C] ${p === "High" ? "text-rose-600" : p === "Medium" ? "text-amber-600" : "text-blue-600"}`
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1 flex justify-between">
                Key Results
              </label>
              <input
                type="text"
                value={kr}
                onChange={(e) => setKr(e.target.value)}
                placeholder="Key achievement or outcome metric..."
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal..."
                className="w-full h-24 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold resize-none text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-border text-[12px] font-bold uppercase tracking-widest hover:bg-muted transition-all text-foreground bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 px-8 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 border-0"
            >
              Add Goal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── GOAL DETAILS MODAL COMPONENT ─── */
function GoalDetailsModal({
  goal,
  onClose,
  onUpdateProgress,
}: {
  goal: any;
  onClose: () => void;
  onUpdateProgress: (id: string, newProgress: number) => void;
}) {
  const [prog, setProg] = useState(goal.progress);

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#031B17]/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl border border-border overflow-hidden p-6 text-foreground">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <h3 className="text-[16px] font-black text-foreground uppercase tracking-wider">
            Goal Details
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
              Objective
            </span>
            <p className="text-sm font-bold text-foreground">{goal.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
                Category
              </span>
              <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-foreground uppercase tracking-wide">
                {goal.category}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
                Deadline
              </span>
              <span className="text-sm font-bold text-foreground">
                {goal.deadline}
              </span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
              Key Result (KR)
            </span>
            <p className="text-xs font-semibold text-muted-foreground">
              {goal.kr}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
                Manager
              </span>
              <p className="text-xs font-bold text-foreground">
                {goal.manager}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest block mb-1">
                Last Updated
              </span>
              <p className="text-xs font-bold text-foreground">
                {goal.lastUpdated}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
              <span>Track Progress</span>
              <span className="text-[#00B87C]">{prog}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={prog}
              onChange={(e) => setProg(Number(e.target.value))}
              className="w-full accent-[#00B87C] bg-muted h-2 rounded-lg cursor-pointer appearance-none animate-none"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  const checkInProg = Math.min(prog + 10, 100);
                  setProg(checkInProg);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold uppercase tracking-wider hover:bg-muted bg-transparent transition-all"
              >
                +10% Check-in
              </button>
              <button
                onClick={() => {
                  onUpdateProgress(goal.id, prog);
                  onClose();
                }}
                className="px-5 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
