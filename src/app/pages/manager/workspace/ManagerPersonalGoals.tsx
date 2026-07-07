import { useState, forwardRef, useEffect } from "react";
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
import { showToast } from "../../../components/workflow/ToastNotification";

type GoalStatus =
  | "All"
  | "In Progress"
  | "Completed"
  | "At Risk"
  | "Not Started";
type Priority = "High" | "Medium" | "Low";
type Category =
  | "Leadership"
  | "Compliance"
  | "Strategy"
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

const goalsData: Goal[] = [
  {
    id: "1",
    title: "Lead Architecture Review",
    category: "Technical",
    priority: "High",
    progress: 80,
    deadline: "Q2 Target",
    kr: "Design new event-driven microservices architecture",
    lastUpdated: "May 8",
    manager: "Rajan Kumar",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Grow Team to 15 Members",
    category: "Leadership",
    priority: "High",
    progress: 60,
    deadline: "Q3 Target",
    kr: "Hire and onboard 4 new senior React/Node engineers",
    lastUpdated: "May 10",
    manager: "Rajan Kumar",
    status: "In Progress",
  },
  {
    id: "3",
    title: "PMP Certification",
    category: "Strategy",
    priority: "Medium",
    progress: 100,
    deadline: "Completed",
    kr: "Obtain professional PMP accreditation",
    lastUpdated: "Apr 25",
    manager: "Rajan Kumar",
    status: "Completed",
  },
  {
    id: "4",
    title: "Improve Team Sprint Velocity",
    category: "Strategy",
    priority: "High",
    progress: 95,
    deadline: "Completed",
    kr: "Increase sprint delivery rate by 15%",
    lastUpdated: "Apr 28",
    manager: "Rajan Kumar",
    status: "Completed",
  },
  {
    id: "5",
    title: "Establish DevOps CI/CD Best Practices",
    category: "Technical",
    priority: "Medium",
    progress: 25,
    deadline: "Q4 Target",
    kr: "Reduce pipeline deploy failures to < 2%",
    lastUpdated: "May 4",
    manager: "Rajan Kumar",
    status: "At Risk",
  },
];

export function ManagerPersonalGoals() {
  const [activeTab, setActiveTab] = useState<GoalStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(goalsData);
  const [selectedGoalForDetails, setSelectedGoalForDetails] =
    useState<Goal | null>(null);
  const [selectedGoalForCheckIn, setSelectedGoalForCheckIn] =
    useState<Goal | null>(null);
  const [activeMenuGoalId, setActiveMenuGoalId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const filteredGoals = goals.filter(
    (goal) => activeTab === "All" || goal.status === activeTab,
  );

  const handleAddGoal = (newGoalData: Partial<Goal>) => {
    if (editingGoal) {
      // update
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, ...newGoalData, lastUpdated: "Today" }
            : g,
        ),
      );
      showToast("Updated!", "success", "Goal updated successfully.");
      setEditingGoal(null);
    } else {
      // add new
      const newGoal: Goal = {
        id: (goals.length + 1).toString(),
        title: newGoalData.title || "New Goal",
        category: newGoalData.category || "Technical",
        priority: newGoalData.priority || "Medium",
        progress: 0,
        deadline: newGoalData.deadline || "Q2 Target",
        kr: newGoalData.kr || "Key result details",
        lastUpdated: "Today",
        manager: "Rajan Kumar",
        status: "In Progress",
      };
      setGoals((prev) => [...prev, newGoal]);
      showToast(
        "Added!",
        "success",
        "Your personal goal has been added successfully.",
      );
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-[#00B87C]">
            <Target size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight mb-1">
              My Goals
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Focus on your key objectives and professional growth
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-[#00B87C] uppercase tracking-wider">
            FY 2025-26
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Plus size={16} /> Add Goal
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="GOALS SET"
          value={goals.length.toString()}
          color="default"
        />
        <KPICard
          label="COMPLETED"
          value={goals
            .filter((g) => g.status === "Completed")
            .length.toString()}
          color="green"
        />
        <KPICard
          label="IN PROGRESS"
          value={goals
            .filter((g) => g.status === "In Progress")
            .length.toString()}
          color="teal"
        />
        <KPICard
          label="AT RISK"
          value={goals.filter((g) => g.status === "At Risk").length.toString()}
          color="red"
        />
      </div>

      {/* OVERALL PROGRESS */}
      {(() => {
        const totalGoals = goals.length;
        const onTrackCount = goals.filter((g) => g.status !== "At Risk").length;
        const avgProgress =
          totalGoals > 0
            ? Math.round(
                goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals,
              )
            : 0;
        return (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#00B87C]" />
                <span className="text-[15px] font-bold text-foreground tracking-tight">
                  Overall Progress: {avgProgress}%
                </span>
              </div>
              <span className="text-[12px] font-bold text-muted-foreground">
                {onTrackCount} / {totalGoals} goals on track
              </span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avgProgress}%` }}
                className="h-full bg-[#00B87C] rounded-full"
              />
            </div>
          </div>
        );
      })()}

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
              className={`pb-4 text-[12px] font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
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
                onViewDetails={() => setSelectedGoalForDetails(goal)}
                onCheckIn={() => setSelectedGoalForCheckIn(goal)}
                isMenuOpen={activeMenuGoalId === goal.id}
                onMenuToggle={() =>
                  setActiveMenuGoalId(
                    activeMenuGoalId === goal.id ? null : goal.id,
                  )
                }
                onDelete={() => {
                  setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                  showToast("Deleted!", "info", "Goal has been deleted.");
                  setActiveMenuGoalId(null);
                }}
                onMarkCompleted={() => {
                  setGoals((prev) =>
                    prev.map((g) =>
                      g.id === goal.id
                        ? { ...g, progress: 100, status: "Completed" }
                        : g,
                    ),
                  );
                  showToast("Success", "success", "Goal marked as Completed!");
                  setActiveMenuGoalId(null);
                }}
                onEdit={() => {
                  setEditingGoal(goal);
                  setIsModalOpen(true);
                  setActiveMenuGoalId(null);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ADD GOAL MODAL */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleAddGoal}
        editingGoal={editingGoal}
      />

      {/* CHECK-IN GOAL MODAL */}
      <CheckInGoalModal
        goal={selectedGoalForCheckIn}
        isOpen={selectedGoalForCheckIn !== null}
        onClose={() => setSelectedGoalForCheckIn(null)}
        onSave={(progress, status) => {
          setGoals((prev) =>
            prev.map((g) =>
              g.id === selectedGoalForCheckIn?.id
                ? {
                    ...g,
                    progress,
                    status,
                    lastUpdated: "Today",
                  }
                : g,
            ),
          );
          showToast("Saved!", "success", "Progress checked in successfully.");
          setSelectedGoalForCheckIn(null);
        }}
      />

      {/* VIEW DETAILS GOAL MODAL */}
      {selectedGoalForDetails && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedGoalForDetails(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-[480px] bg-card border border-border rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Target className="text-[#00B87C]" size={20} />
                <h3 className="text-lg font-bold text-foreground">
                  Goal Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedGoalForDetails(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-6 space-y-5 text-sm">
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Objective
                </span>
                <p className="font-bold text-foreground text-[15px]">
                  {selectedGoalForDetails.title}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                    Category
                  </span>
                  <span className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-bold uppercase rounded">
                    {selectedGoalForDetails.category}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                    Priority
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                      selectedGoalForDetails.priority === "High"
                        ? "bg-rose-500/10 text-rose-500 border-rose-200"
                        : "bg-amber-500/10 text-amber-500 border-amber-200"
                    }`}
                  >
                    {selectedGoalForDetails.priority}
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Key Results (KRs)
                </span>
                <p className="text-xs font-semibold text-foreground bg-secondary/40 p-3 rounded-xl border border-border italic leading-relaxed">
                  {selectedGoalForDetails.kr}
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Progress
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex-1 border">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${selectedGoalForDetails.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {selectedGoalForDetails.progress}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t text-[11px] font-bold text-muted-foreground uppercase">
                <span>Deadline: {selectedGoalForDetails.deadline}</span>
                <span>Last Updated: {selectedGoalForDetails.lastUpdated}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-end">
              <button
                onClick={() => setSelectedGoalForDetails(null)}
                className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-[#00B87C]/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    default: "text-foreground",
    green: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    teal: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    red: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-[#00B87C]/30 transition-all">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
        {label}
      </p>
      <h3
        className={`text-2xl font-bold tracking-tight ${colorMap[color].includes(" ") ? colorMap[color].split(" ")[0] : colorMap[color]}`}
      >
        {value}
      </h3>
    </div>
  );
}

interface GoalItemProps {
  goal: Goal;
  onViewDetails: () => void;
  onCheckIn: () => void;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onDelete: () => void;
  onMarkCompleted: () => void;
  onEdit: () => void;
}

const GoalItem = forwardRef<HTMLDivElement, GoalItemProps>(
  (
    {
      goal,
      onViewDetails,
      onCheckIn,
      onMenuToggle,
      isMenuOpen,
      onDelete,
      onMarkCompleted,
      onEdit,
    },
    ref,
  ) => {
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
        className="p-4 rounded-2xl border border-border bg-card hover:border-[#00B87C]/30 transition-all space-y-4 group relative"
      >
        {/* TOP ROW */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {statusIcon}
            <h4 className="text-[14px] font-bold text-foreground tracking-tight">
              {goal.title}
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              {goal.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${priorityColor}`}
            >
              {goal.priority}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle();
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 overflow-hidden animate-in fade-in duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary transition-all"
                >
                  Edit Goal
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkCompleted();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-secondary transition-all"
                >
                  Mark Completed
                </button>
                <div className="h-[1px] bg-border my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-all animate-in"
                >
                  Delete Goal
                </button>
              </div>
            )}
          </div>
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
          <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
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
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[8px] font-bold text-blue-600">
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
              onClick={onViewDetails}
              className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View Details <ChevronRight size={14} />
            </button>
            <button
              onClick={onCheckIn}
              className="px-4 py-1.5 rounded-lg border border-border text-[11px] font-bold uppercase tracking-wider hover:bg-muted transition-all"
            >
              Check-in
            </button>
            <ChevronRight
              size={18}
              className="text-muted-foreground group-hover:text-[#00B87C] transition-all ml-1"
            />
          </div>
        </div>
      </motion.div>
    );
  },
);
GoalItem.displayName = "GoalItem";

function AddGoalModal({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Partial<Goal>) => void;
  editingGoal: Goal | null;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Technical");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState("");
  const [kr, setKr] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setCategory(editingGoal.category);
      setPriority(editingGoal.priority);
      setDeadline(editingGoal.deadline);
      setKr(editingGoal.kr);
      setDescription("");
    } else {
      setTitle("");
      setCategory("Technical");
      setPriority("Medium");
      setDeadline("");
      setKr("");
      setDescription("");
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast("Error", "error", "Goal title is required.");
      return;
    }
    onSubmit({
      title,
      category,
      priority,
      deadline: deadline || "Q2 Target",
      kr: kr || "Key result details",
    });
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[480px] bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              {editingGoal ? "Edit Goal" : "Add New Goal"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement TDS Automation"
                className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Leadership",
                  "Compliance",
                  "Strategy",
                  "Personal",
                  "Technical",
                ].map((cat) => {
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat as Category)}
                      className={`px-4 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-[#00B87C] text-white border-[#00B87C]"
                          : "border-border hover:border-[#00B87C] text-foreground bg-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(["High", "Medium", "Low"] as Priority[]).map((p) => {
                  const isActive = priority === p;
                  let colorClasses: string;
                  if (isActive) {
                    if (p === "High")
                      colorClasses = "bg-rose-600 text-white border-rose-600";
                    else if (p === "Medium")
                      colorClasses = "bg-amber-600 text-white border-amber-600";
                    else
                      colorClasses = "bg-blue-600 text-white border-blue-600";
                  } else {
                    colorClasses =
                      "border-border hover:border-[#00B87C] text-foreground bg-transparent";
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${colorClasses}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Target Date / Deadline
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Q2 Target or 2026-12-31"
                className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex justify-between">
                Key Results
              </label>
              <input
                type="text"
                value={kr}
                onChange={(e) => setKr(e.target.value)}
                placeholder="Result 1..."
                className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal..."
                className="w-full h-24 px-4 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-[#00B87C] outline-none text-sm font-bold resize-none text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-border text-[12px] font-bold uppercase tracking-wider hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-2 px-8 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
            >
              {editingGoal ? "Update Goal" : "Add Goal"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckInGoalModal({
  goal,
  isOpen,
  onClose,
  onSave,
}: {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (progress: number, status: GoalStatus) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GoalStatus>("In Progress");
  const [checkInComment, setCheckInComment] = useState("");

  useEffect(() => {
    if (goal) {
      setProgress(goal.progress);
      setStatus(goal.status);
      setCheckInComment("");
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const handleSaveCheckIn = () => {
    onSave(progress, status);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-[440px] bg-card border border-border rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">Goal Check-in</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <div className="py-6 space-y-4 text-sm flex-1">
          <div>
            <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Goal
            </span>
            <p className="font-bold text-foreground text-sm">{goal.title}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Goal Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none appearance-none cursor-pointer focus:border-[#00B87C] bg-card text-foreground dark:bg-zinc-900"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="At Risk">At Risk</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Check-in Comments
            </label>
            <textarea
              value={checkInComment}
              onChange={(e) => setCheckInComment(e.target.value)}
              placeholder="What updates do you have on this goal?"
              className="w-full h-20 p-3 rounded-xl border bg-transparent text-xs outline-none resize-none focus:border-[#00B87C] text-foreground"
            />
          </div>
        </div>
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3 bg-secondary/10 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCheckIn}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold bg-[#00B87C] hover:opacity-90 shadow-lg shadow-emerald-500/20"
          >
            Save Check-in
          </button>
        </div>
      </div>
    </div>
  );
}
