import { useState } from "react";
import {
  UserCheck,
  Download,
  Users,
  Clock,
  Target,
  CheckCircle,
  Calendar,
  X,
  Search,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Briefcase,
  MapPin,
  Check,
  User,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

const NEW_JOINER = {
  id: "EMP-0201",
  name: "Priya Sharma",
  initials: "PS",
  role: "Frontend Developer",
  designation: "Frontend Developer",
  department: "Engineering",
  joiningDate: "April 8, 2026",
  reportsTo: "You (Suresh Iyer)",
  email: "priya.sharma@nexushr.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
};

const ONBOARDING_PHASES = [
  {
    label: "Pre-Joining",
    status: "Done",
    tasks: "6/6",
    doneDate: "Done Apr 5",
    tasksTotal: 6,
    tasksDone: 6,
  },
  {
    label: "Day 1",
    status: "In Progress",
    tasks: "2/7",
    doneDate: "In progress — 2 tasks overdue",
    tasksTotal: 7,
    tasksDone: 2,
  },
  {
    label: "Week 1",
    status: "Pending",
    tasks: "0/8",
    doneDate: "Starts Apr 9",
    tasksTotal: 8,
    tasksDone: 0,
  },
  {
    label: "Month 1",
    status: "Pending",
    tasks: "0/12",
    doneDate: "Starts Apr 15",
    tasksTotal: 12,
    tasksDone: 0,
  },
  {
    label: "Complete",
    status: "Pending",
    tasks: "0/0",
    doneDate: "—",
    tasksTotal: 0,
    tasksDone: 0,
  },
];

interface Task {
  id: number;
  title: string;
  desc: string;
  phase: string;
  due: string;
  dueLabel: string;
  urgency: "amber" | "red" | "gray" | "green";
  estTime?: string;
  icon: typeof Calendar;
  iconBg: string;
  iconColor: string;
  actionLabel?: string;
  actionType?: "schedule" | "complete" | "intro" | "goals";
}

const TASKS_DATA: Task[] = [
  {
    id: 1,
    title: "Conduct Welcome 1:1 Meeting",
    desc: "Schedule and conduct first 1:1 with Priya Sharma",
    phase: "Day 1",
    due: "April 8, 2026",
    dueLabel: "Today",
    urgency: "amber",
    estTime: "30 mins",
    icon: User,
    iconBg: "#DCFCE7",
    iconColor: "#00B87C",
    actionLabel: "Schedule Meeting",
    actionType: "schedule",
  },
  {
    id: 2,
    title: "Introduce Priya to the Team",
    desc: "Arrange team introductions and walk through team structure",
    phase: "Day 1",
    due: "April 10, 2026",
    dueLabel: "Apr 10",
    urgency: "amber",
    icon: Users,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    actionType: "intro",
  },
  {
    id: 3,
    title: "Set 30-Day Goals with Priya",
    desc: "Define 30-day objectives, success metrics, and growth milestones",
    phase: "Month 1",
    due: "April 22, 2026",
    dueLabel: "Apr 22",
    urgency: "gray",
    icon: Target,
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
    actionType: "goals",
  },
  {
    id: 4,
    title: "Review Knowledge Transfer Plan",
    desc: "Verified knowledge transfer documentation and handover plan",
    phase: "Pre-Joining",
    due: "April 5, 2026",
    dueLabel: "Completed",
    urgency: "green",
    icon: CheckCircle,
    iconBg: "#DCFCE7",
    iconColor: "#00B87C",
  },
];

const COMPLETED_TASKS = [
  {
    id: 5,
    title: "Send Offer Letter Confirmation",
    desc: "Verified candidate acceptance and sent offer package",
    phase: "Pre-Joining",
    doneDate: "Apr 1",
  },
  {
    id: 6,
    title: "Set Up IT Workstation",
    desc: "Configured laptop and software access",
    phase: "Pre-Joining",
    doneDate: "Apr 3",
  },
  {
    id: 7,
    title: "Prepare Onboarding Kit",
    desc: "Welcome kit and document package assembled",
    phase: "Pre-Joining",
    doneDate: "Apr 4",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Arjun Mehta",
    initials: "AM",
    designation: "Senior Frontend Developer",
  },
  { name: "Kavita Rao", initials: "KR", designation: "Backend Developer" },
  { name: "Rahul Verma", initials: "RV", designation: "UI/UX Designer" },
  { name: "Neha Gupta", initials: "NG", designation: "QA Engineer" },
  { name: "Vikram Singh", initials: "VS", designation: "DevOps Engineer" },
];

export function ManagerTeamOnboarding() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState<number | null>(
    null,
  );
  const [showBuddyModal, setShowBuddyModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showOnboardingPanel, setShowOnboardingPanel] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [buddyAssigned, setBuddyAssigned] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);

  const handleExport = () => {
    const lines = [
      `NexusHR Onboarding Report`,
      `Employee ID: ${NEW_JOINER.id}`,
      `Employee Name: ${NEW_JOINER.name}`,
      `Role: ${NEW_JOINER.role}`,
      `Department: ${NEW_JOINER.department}`,
      `Joining Date: ${NEW_JOINER.joiningDate}`,
      `Email: ${NEW_JOINER.email}`,
      `Phone: ${NEW_JOINER.phone}`,
      `Location: ${NEW_JOINER.location}`,
      `----------------------------------------`,
      `Onboarding Tasks & Status:`,
    ];

    TASKS_DATA.forEach((task) => {
      const isDone =
        completedTasks.includes(task.id) || task.urgency === "green";
      lines.push(
        `- ${task.title} [${isDone ? "Completed" : "Pending"}] (Due: ${task.due})`,
      );
    });

    COMPLETED_TASKS.forEach((task) => {
      lines.push(`- ${task.title} [Completed]`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${NEW_JOINER.name.replace(/\s+/g, "_")}_onboarding_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      "Exported!",
      "success",
      "Onboarding summary exported successfully.",
    );
  };

  const [scheduleTitle, setScheduleTitle] = useState(
    "Welcome 1:1 — Priya Sharma",
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("30 mins");
  const [scheduleLocation, setScheduleLocation] = useState(
    "Conference Room A / Zoom link",
  );
  const [scheduleNotes, setScheduleNotes] = useState(
    "Agenda: Introduction, Role overview, Q&A",
  );
  const [notifyEmail, setNotifyEmail] = useState(true);

  const [buddySearch, setBuddySearch] = useState("");
  const [buddyMessage, setBuddyMessage] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalTimeline, setGoalTimeline] = useState("30 days");

  const handleMarkComplete = (taskId: number) => {
    setCompletedTasks((prev) => [...prev, taskId]);
    setShowCompleteConfirm(null);
    showToast("Task Completed", "success", "Task marked as complete");
  };

  const handleScheduleMeeting = () => {
    if (!scheduleDate || !scheduleTime) {
      showToast("Missing Fields", "error", "Please fill in date and time");
      return;
    }
    setShowScheduleModal(false);
    showToast(
      "Meeting Scheduled",
      "success",
      `1:1 with Priya scheduled for ${scheduleDate} at ${scheduleTime}`,
    );
  };

  const handleAssignBuddy = () => {
    if (!selectedBuddy) {
      showToast("Select Buddy", "error", "Please select a team member");
      return;
    }
    setBuddyAssigned(true);
    setShowBuddyModal(false);
    showToast(
      "Buddy Assigned",
      "success",
      `${selectedBuddy} assigned as Priya's buddy`,
    );
  };

  const handleCreateGoal = () => {
    if (!goalTitle) {
      showToast("Missing Title", "error", "Please enter a goal title");
      return;
    }
    setShowGoalModal(false);
    showToast("Goals Created", "success", "30-day goals set for Priya");
  };

  const filteredTeam = TEAM_MEMBERS.filter((m) =>
    m.name.toLowerCase().includes(buddySearch.toLowerCase()),
  );

  const getUrgencyBorder = (urgency: string) => {
    switch (urgency) {
      case "green":
        return "border-l-green-500";
      case "amber":
        return "border-l-amber-500";
      case "red":
        return "border-l-red-500";
      default:
        return "border-l-gray-300";
    }
  };

  const getDueChip = (task: Task) => {
    if (task.urgency === "green") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[#00B87C] text-[9px] font-bold border border-[#00B87C]/20 uppercase tracking-wider">
          ✓ Completed
        </span>
      );
    }
    if (task.urgency === "red" || task.dueLabel === "Today") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[9px] font-bold border border-red-500/20 uppercase tracking-wider">
          Due: {task.due} ({task.dueLabel})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[9px] font-bold border border-amber-500/20 uppercase tracking-wider">
        Due: {task.dueLabel}
      </span>
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent relative">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center border border-[#00B87C]/20 shadow-sm">
            <UserCheck size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none">
              Team Onboarding
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1.5">
              Your responsibilities for new team joiners
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground hover:bg-secondary transition-all shadow-sm"
        >
          <Download size={16} /> EXPORT
        </button>
      </div>

      {/* ── Info Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 bg-card px-5 py-3.5 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[12px] font-bold text-foreground">
            <span className="text-[#00B87C]">1</span> new team member onboarding
            — Priya Sharma
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-muted-foreground">
            <span className="text-amber-500">2</span> tasks assigned to you —
            due this week
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-[12px] font-bold text-muted-foreground">
            Priya joining: April 8, 2026{" "}
            <span className="text-cyan-500">(Today!)</span>
          </span>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
              <UserCheck size={18} className="text-[#00B87C]" />
            </div>
            <span className="text-[28px] font-bold text-[#00B87C] leading-none">
              1
            </span>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            NEW TEAM JOINERS
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">
            currently onboarding
          </p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center">
              <Clock size={18} className="text-amber-500" />
            </div>
            <span className="text-[28px] font-bold text-amber-500 leading-none">
              2
            </span>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            MY PENDING TASKS
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">
            assigned to you
          </p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-cyan-500/10 flex items-center justify-center">
              <Target size={18} className="text-cyan-500" />
            </div>
            <span className="text-[28px] font-bold text-cyan-500 leading-none">
              45%
            </span>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            PRIYA'S PROGRESS
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">
            on track
          </p>
        </div>
      </div>

      {/* ── Two Column Layout ────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column */}
        <div className="xl:w-[55%] space-y-6">
          {/* ── New Joiner Profile Card ─────────────────────── */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#00B87C] rounded-full" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                NEW TEAM MEMBER
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <div className="h-[80px] w-full bg-gradient-to-r from-[#00B87C] to-[#059669] opacity-80" />
              <div className="px-6 pb-6 relative">
                <div className="flex items-end gap-5 -mt-8 mb-5">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[18px] font-bold text-[#00B87C] border-[3px] border-card shadow-sm shrink-0">
                    {NEW_JOINER.initials}
                  </div>
                  <div className="pb-1">
                    <h3 className="text-[18px] font-bold text-foreground leading-tight">
                      {NEW_JOINER.name}
                    </h3>
                    <p className="text-[14px] font-bold text-[#00B87C] mt-0.5">
                      {NEW_JOINER.designation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} className="text-[#00B87C]" />{" "}
                    {NEW_JOINER.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#00B87C]" />{" "}
                    {NEW_JOINER.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#00B87C]" /> Joining
                    Today: {NEW_JOINER.joiningDate}
                  </span>
                  <span className="text-muted-foreground/60">
                    Reports to:{" "}
                    <span className="text-foreground">
                      {NEW_JOINER.reportsTo}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-5 py-3 px-4 bg-[#F0FDF4]/50 dark:bg-emerald-950/20 rounded-xl border border-[#00B87C]/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-wider">
                      Day 3
                    </span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
                    <span className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider">
                      45% Complete
                    </span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                      3 tasks pending
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Overall Progress
                    </span>
                    <span className="text-[11px] font-bold text-[#00B87C]">
                      45%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00B87C]"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowOnboardingPanel(true)}
                  className="px-4 py-2 border border-[#00B87C]/30 text-[#00B87C] text-[12px] font-bold rounded-xl hover:bg-[#00B87C] hover:text-white transition-all uppercase tracking-wider"
                >
                  View Full Onboarding
                </button>
              </div>
            </div>
          </div>

          {/* ── Assign Buddy Card ──────────────────────────── */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                BUDDY ASSIGNMENT
              </span>
            </div>

            {!buddyAssigned ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <UserPlus size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground">
                      No buddy assigned yet
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Assign a team member as Priya's buddy
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBuddyModal(true)}
                  className="px-4 py-2 bg-[#00B87C] text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wider shrink-0"
                >
                  Assign Buddy
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-[#00B87C]/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-[14px] font-bold text-amber-500">
                    AM
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-foreground">
                      Arjun Mehta
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      Senior Frontend Developer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#00B87C]">
                    <Check size={12} /> Buddy Assigned
                  </span>
                  <button
                    onClick={() => setShowBuddyModal(true)}
                    className="text-[11px] font-bold text-muted-foreground hover:text-foreground underline"
                  >
                    Change Buddy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:w-[45%] space-y-6">
          {/* ── My Manager Tasks ──────────────────────────────── */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                TASKS ASSIGNED TO YOU
              </span>
            </div>

            <div className="space-y-3">
              {TASKS_DATA.map((task) => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 transition-all relative ${getUrgencyBorder(task.urgency)} border-l-[4px] ${isDone ? "bg-emerald-500/5 border-green-500/30" : "bg-card border-border hover:shadow-sm"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: task.iconBg }}
                      >
                        <task.icon
                          size={14}
                          style={{ color: task.iconColor }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-[14px] ${isDone ? "line-through text-muted-foreground" : "font-bold text-foreground"}`}
                          >
                            {task.title}
                          </h4>
                          {isDone && (
                            <CheckCircle size={14} className="text-[#00B87C]" />
                          )}
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-0.5 font-medium">
                          {task.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[9px] font-bold border border-border uppercase tracking-wider">
                            Phase: {task.phase}
                          </span>
                          {getDueChip(task)}
                          {task.estTime && (
                            <span className="text-[11px] font-bold text-muted-foreground">
                              Est. Time: {task.estTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isDone && task.actionType && (
                      <div className="flex items-center gap-2 mt-3 ml-10">
                        {task.actionType === "schedule" && (
                          <>
                            <button
                              onClick={() => setShowScheduleModal(true)}
                              className="px-3.5 py-1.5 bg-[#00B87C] text-white text-[11px] font-bold rounded-lg hover:opacity-90 transition-all uppercase tracking-wider shadow-sm shadow-emerald-500/20"
                            >
                              Schedule Meeting
                            </button>
                            <button
                              onClick={() => setShowCompleteConfirm(task.id)}
                              className="px-3.5 py-1.5 border border-border text-[11px] font-bold rounded-lg hover:bg-secondary transition-all uppercase tracking-wider text-foreground"
                            >
                              Mark Complete
                            </button>
                          </>
                        )}
                        {task.actionType === "intro" && (
                          <>
                            <button
                              onClick={() => setShowScheduleModal(true)}
                              className="px-3.5 py-1.5 border border-border text-[11px] font-bold rounded-lg hover:bg-secondary transition-all uppercase tracking-wider text-foreground"
                            >
                              Create Intro Meeting
                            </button>
                            <button
                              onClick={() => setShowCompleteConfirm(task.id)}
                              className="px-3.5 py-1.5 border border-border text-[11px] font-bold rounded-lg hover:bg-secondary transition-all uppercase tracking-wider text-foreground"
                            >
                              Mark Complete
                            </button>
                          </>
                        )}
                        {task.actionType === "goals" && (
                          <button
                            onClick={() => setShowGoalModal(true)}
                            className="px-3.5 py-1.5 border border-border text-[11px] font-bold rounded-lg hover:bg-secondary transition-all uppercase tracking-wider text-foreground"
                          >
                            Set Goals
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completed Tasks Accordion */}
            <div className="mt-4 pt-3 border-t border-border">
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-all w-full"
              >
                {showCompletedTasks ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                {COMPLETED_TASKS.length} completed tasks
              </button>
              <AnimatePresence>
                {showCompletedTasks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mt-3">
                      {COMPLETED_TASKS.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-[#00B87C]/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#00B87C]/10 flex items-center justify-center shrink-0">
                            <Check size={12} className="text-[#00B87C]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-foreground">
                              {task.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              {task.desc}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                            {task.doneDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Onboarding Progress Overview ────────────────── */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-cyan-500 rounded-full" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                PRIYA'S ONBOARDING PROGRESS
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between relative px-1 mb-7">
              <div className="absolute top-[11px] left-3 right-3 h-[2px] bg-border z-0" />
              {ONBOARDING_PHASES.map((phase, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 relative z-10"
                >
                  <div
                    onClick={() => {
                      const el = document.getElementById(`mgr-phase-${i}`);
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                    className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[11px] font-bold cursor-pointer ${
                      phase.status === "Done"
                        ? "bg-[#00B87C] border-[#00B87C] text-white"
                        : phase.status === "In Progress"
                          ? "bg-card border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                          : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    {phase.status === "Done" ? (
                      <Check size={11} strokeWidth={3} />
                    ) : phase.status === "In Progress" ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold text-center max-w-[60px] leading-tight ${
                      phase.status === "Done"
                        ? "text-[#00B87C]"
                        : phase.status === "In Progress"
                          ? "text-cyan-500"
                          : "text-muted-foreground"
                    } uppercase tracking-wider`}
                  >
                    {phase.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Phase Details */}
            <div className="space-y-2.5">
              {ONBOARDING_PHASES.filter((p) => p.label !== "Complete").map(
                (phase, i) => (
                  <div
                    key={i}
                    id={`mgr-phase-${i}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          phase.status === "Done"
                            ? "bg-[#00B87C]"
                            : phase.status === "In Progress"
                              ? "bg-cyan-500"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`text-[12px] font-bold ${
                          phase.status === "Done"
                            ? "text-[#00B87C]"
                            : phase.status === "In Progress"
                              ? "text-cyan-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {phase.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[11px] font-bold ${
                          phase.status === "Done"
                            ? "text-[#00B87C]"
                            : phase.status === "In Progress"
                              ? "text-amber-500"
                              : "text-muted-foreground/60"
                        }`}
                      >
                        {phase.tasks}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {phase.doneDate}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <button
              onClick={() => setShowOnboardingPanel(true)}
              className="mt-4 text-[#00B87C] text-[12px] font-bold hover:underline text-center w-full uppercase tracking-wider"
            >
              View Full Checklist →
            </button>
          </div>
        </div>
      </div>

      {/* ── Schedule Meeting Modal ────────────────────────────── */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[440px] rounded-[32px] shadow-2xl border border-border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
                    <Calendar size={18} className="text-[#00B87C]" />
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground">
                    Schedule 1:1 Meeting
                  </h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Meeting Title
                    </label>
                    <input
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      With
                    </label>
                    <input
                      value="Priya Sharma"
                      disabled
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-muted-foreground outline-none opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Duration
                    </label>
                    <select
                      value={scheduleDuration}
                      onChange={(e) => setScheduleDuration(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                    >
                      <option>30 mins</option>
                      <option>45 mins</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Location/Link
                    </label>
                    <input
                      value={scheduleLocation}
                      onChange={(e) => setScheduleLocation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Add Notes
                    </label>
                    <textarea
                      value={scheduleNotes}
                      onChange={(e) => setScheduleNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all resize-none"
                    />
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => setNotifyEmail(!notifyEmail)}
                      className={`w-9 h-5 rounded-full transition-all relative ${notifyEmail ? "bg-[#00B87C]" : "bg-border"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${notifyEmail ? "left-4" : "left-0.5"}`}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-foreground">
                      Notify Priya via email
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-secondary transition-all text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleMeeting}
                    className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mark Complete Confirmation ────────────────────────── */}
      <AnimatePresence>
        {showCompleteConfirm !== null && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompleteConfirm(null)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[380px] rounded-[32px] shadow-2xl p-6 border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={18} className="text-[#00B87C]" />
                </div>
                <h3 className="text-[16px] font-bold text-foreground">
                  Mark as Complete
                </h3>
              </div>
              <p className="text-[13px] font-bold text-muted-foreground mb-6">
                Are you sure you want to mark this task as complete?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteConfirm(null)}
                  className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-secondary transition-all text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkComplete(showCompleteConfirm)}
                  className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Yes, Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Buddy Assignment Modal ────────────────────────────── */}
      <AnimatePresence>
        {showBuddyModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuddyModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[440px] rounded-[32px] shadow-2xl border border-border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <UserPlus size={18} className="text-amber-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground">
                    {buddyAssigned ? "Change Buddy" : "Assign Buddy"}
                  </h3>
                  <button
                    onClick={() => setShowBuddyModal(false)}
                    className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    placeholder="Search team members..."
                    value={buddySearch}
                    onChange={(e) => setBuddySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                  />
                </div>

                <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar mb-4">
                  {filteredTeam.map((member, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedBuddy(member.name)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        selectedBuddy === member.name
                          ? "bg-emerald-500/10 border border-[#00B87C]/30"
                          : "hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[11px] font-bold text-amber-500 shrink-0">
                        {member.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-foreground">
                          {member.name}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {member.designation}
                        </p>
                      </div>
                      {selectedBuddy === member.name && (
                        <div className="w-5 h-5 rounded-full bg-[#00B87C] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Optional Message to Buddy
                  </label>
                  <textarea
                    placeholder="Brief the buddy about their role..."
                    value={buddyMessage}
                    onChange={(e) => setBuddyMessage(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBuddyModal(false)}
                    className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-secondary transition-all text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignBuddy}
                    className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Goal Setting Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[440px] rounded-[32px] shadow-2xl border border-border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Target size={18} className="text-blue-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground">
                    Set 30-Day Goals — Priya
                  </h3>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Goal Title
                    </label>
                    <input
                      placeholder="e.g., Complete onboarding training modules"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe the goal and success criteria..."
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Timeline
                    </label>
                    <select
                      value={goalTimeline}
                      onChange={(e) => setGoalTimeline(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
                    >
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-secondary transition-all text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGoal}
                    className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Onboarding Detail Slide Panel ──────────────────────── */}
      <AnimatePresence>
        {showOnboardingPanel && (
          <div className="fixed inset-0 z-[4000] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOnboardingPanel(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-card w-full max-w-[480px] h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] border-l border-border flex flex-col overflow-y-auto custom-scrollbar z-50"
            >
              <div className="p-6 border-b border-border flex items-center gap-3 sticky top-0 bg-card z-10">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
                  <UserCheck size={18} className="text-[#00B87C]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground">
                    Priya's Onboarding
                  </h3>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    Read-only view
                  </p>
                </div>
                <button
                  onClick={() => setShowOnboardingPanel(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F0FDF4]/50 dark:bg-emerald-950/20 border border-[#00B87C]/10">
                  <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[16px] font-bold text-[#00B87C] shrink-0">
                    PS
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-foreground">
                      Priya Sharma
                    </h4>
                    <p className="text-[12px] font-bold text-[#00B87C]">
                      Frontend Developer · Engineering
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                      Joining: April 8, 2026
                    </p>
                  </div>
                </div>

                {ONBOARDING_PHASES.filter((p) => p.label !== "Complete").map(
                  (phase, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border overflow-hidden"
                    >
                      <div
                        className={`px-4 py-3 border-b border-border flex items-center justify-between ${
                          phase.status === "Done"
                            ? "bg-emerald-500/5"
                            : phase.status === "In Progress"
                              ? "bg-cyan-500/5"
                              : "bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              phase.status === "Done"
                                ? "bg-[#00B87C]"
                                : phase.status === "In Progress"
                                  ? "bg-cyan-500"
                                  : "bg-muted-foreground/30"
                            }`}
                          />
                          <span
                            className={`text-[13px] font-bold ${
                              phase.status === "Done"
                                ? "text-[#00B87C]"
                                : phase.status === "In Progress"
                                  ? "text-cyan-500"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {phase.label}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold ${
                            phase.status === "Done"
                              ? "text-[#00B87C]"
                              : phase.status === "In Progress"
                                ? "text-amber-500"
                                : "text-muted-foreground/60"
                          }`}
                        >
                          {phase.tasks} tasks
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        {Array.from({ length: phase.tasksTotal }).map(
                          (_, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-2.5 py-1.5"
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  j < phase.tasksDone
                                    ? "bg-[#00B87C] border-[#00B87C]"
                                    : "border-border"
                                }`}
                              >
                                {j < phase.tasksDone && (
                                  <Check
                                    size={9}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                              <span
                                className={`text-[12px] font-medium ${j < phase.tasksDone ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {phase.label} task {j + 1}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
