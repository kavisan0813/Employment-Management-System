import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  BookOpen,
  Download,
  CheckCircle2,
  Clock,
  Award,
  Star,
  Search,
  Bookmark,
  ArrowRight,
  AlertCircle,
  Plus,
  BarChart3,
  User,
  Check,
  X,
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
interface Course {
  id: string;
  title: string;
  category: string;
  trainer: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  timeLeft?: string;
  type: "Technical" | "Leadership" | "Compliance";
  mandatory?: boolean;
  dueDate?: string;
  rating?: number;
  reviews?: number;
  isEnrolled?: boolean;
  department: string;
  lastAccessed?: string;
}

interface Certification {
  name: string;
  dateEarned: string;
  expiryDate?: string;
  authority: string;
}

interface SkillRecord {
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  percentage: number;
}

/* ─── Mock Data ─────────────────────────── */
const initialCourses: Course[] = [
  {
    id: "C001",
    title: "Advanced React Architecture",
    category: "Technical",
    trainer: "Alex Mercer",
    duration: "12 hrs",
    difficulty: "Advanced",
    progress: 65,
    timeLeft: "2h 30m",
    type: "Technical",
    isEnrolled: true,
    department: "Engineering",
    lastAccessed: "2026-04-25",
  },
  {
    id: "C002",
    title: "Empathetic Leadership 101",
    category: "Leadership",
    trainer: "Sarah Jenkins",
    duration: "6 hrs",
    difficulty: "Intermediate",
    progress: 30,
    timeLeft: "4h 15m",
    type: "Leadership",
    isEnrolled: true,
    department: "Management",
    lastAccessed: "2026-04-26",
  },
  {
    id: "C003",
    title: "Global Data Compliance (GDPR)",
    category: "Compliance",
    trainer: "Legal Team",
    duration: "3 hrs",
    difficulty: "Beginner",
    progress: 0,
    dueDate: "Overdue",
    mandatory: true,
    type: "Compliance",
    isEnrolled: true,
    department: "All",
    lastAccessed: "N/A",
  },
  {
    id: "C004",
    title: "Cybersecurity Fundamentals",
    category: "Technical",
    trainer: "IT Security",
    duration: "4 hrs",
    difficulty: "Beginner",
    progress: 0,
    dueDate: "5 days left",
    mandatory: true,
    type: "Technical",
    isEnrolled: false,
    department: "All",
    rating: 4.7,
    reviews: 128,
  },
  {
    id: "C005",
    title: "Conflict Resolution for Managers",
    category: "Leadership",
    trainer: "Elena Rostova",
    duration: "5 hrs",
    difficulty: "Intermediate",
    progress: 100,
    type: "Leadership",
    isEnrolled: false,
    department: "Management",
    rating: 4.5,
    reviews: 85,
  },
];

const initialCertifications: Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    dateEarned: "2025-11-10",
    expiryDate: "2028-11-10",
    authority: "Amazon Web Services",
  },
  {
    name: "Professional Scrum Master I",
    dateEarned: "2026-01-15",
    authority: "Scrum.org",
  },
];

const initialSkills: SkillRecord[] = [
  { skill: "Communication", level: "Advanced", percentage: 85 },
  { skill: "Excel & Analytics", level: "Intermediate", percentage: 60 },
  { skill: "Leadership", level: "Intermediate", percentage: 55 },
  { skill: "React Development", level: "Advanced", percentage: 90 },
  { skill: "Python Automation", level: "Beginner", percentage: 30 },
];

function AddCourseModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (c: Course) => void;
}) {
  const [form, setForm] = useState<{
    title: string;
    category: string;
    trainer: string;
    duration: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    department: string;
  }>({
    title: "",
    category: "Technical",
    trainer: "",
    duration: "4 hrs",
    difficulty: "Beginner",
    department: "Engineering",
  });

  const handleSave = () => {
    if (!form.title.trim() || !form.trainer.trim()) return;
    onSave({
      id: `C00${Math.floor(Math.random() * 100)}`,
      title: form.title,
      category: form.category,
      trainer: form.trainer,
      duration: form.duration,
      difficulty: form.difficulty,
      progress: 0,
      type: form.category as "Technical" | "Leadership" | "Compliance",
      department: form.department,
      isEnrolled: false,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Create Course
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-xl bg-transparent transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
              Trainer
            </label>
            <input
              type="text"
              className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
              value={form.trainer}
              onChange={(e) => setForm({ ...form, trainer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
              Category
            </label>
            <select
              className="w-full text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Technical">Technical</option>
              <option value="Leadership">Leadership</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold text-foreground outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
                Difficulty
              </label>
              <select
                className="w-full text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
                value={form.difficulty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty: e.target.value as
                      | "Beginner"
                      | "Intermediate"
                      | "Advanced",
                  })
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-muted border border-border hover:bg-neutral-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#00B87C] hover:bg-[#059669] text-white text-xs font-black rounded-xl shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 uppercase tracking-widest"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignCourseModal({
  courses,
  onClose,
}: {
  courses: Course[];
  onClose: () => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [assignee, setAssignee] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAssign = () => {
    if (!assignee.trim()) return;
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Assign Training
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-xl bg-transparent transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {isSuccess ? (
          <div className="py-6 text-center text-[#00B87C] text-xs font-bold flex flex-col items-center gap-2">
            <CheckCircle2 size={30} className="animate-bounce" />
            Course successfully assigned to {assignee}!
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
                Select Course
              </label>
              <select
                className="w-full text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider mb-1">
                Employee or Department
              </label>
              <input
                type="text"
                placeholder="e.g. Engineering Team"
                className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-muted border border-border hover:bg-neutral-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="flex-1 py-2.5 bg-[#00B87C] hover:bg-[#059669] text-white text-xs font-black rounded-xl shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 uppercase tracking-widest"
              >
                Assign Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoursePlayerModal({
  course,
  onClose,
  onUpdateProgress,
}: {
  course: Course;
  onClose: () => void;
  onUpdateProgress: (id: string, p: number) => void;
}) {
  const [simulatedProgress, setSimulatedProgress] = useState(course.progress);

  const handleSimulateProgress = () => {
    const next = Math.min(simulatedProgress + 25, 100);
    setSimulatedProgress(next);
    onUpdateProgress(course.id, next);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card border border-border rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 text-[9px] font-black tracking-wide uppercase">
              {course.type}
            </span>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mt-2">
              {course.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-xl bg-transparent transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 py-2 space-y-4">
          {/* Simulated Video Screen */}
          <div className="w-full aspect-video bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-center text-white relative overflow-hidden shadow-inner border border-zinc-800">
            <BookOpen size={40} className="text-[#00B87C] animate-pulse" />
            <span className="text-xs font-bold mt-2">
              Playing Module 1: Overview
            </span>
            <span className="text-[9px] text-slate-400 mt-1">
              Trainer: {course.trainer}
            </span>
          </div>

          {/* Progress stats */}
          <div className="bg-white dark:bg-zinc-900/30 p-4 rounded-2xl border border-border flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 block mb-1">
                Course progress
              </span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {simulatedProgress}% Completed
              </span>
            </div>
            {simulatedProgress < 100 ? (
              <button
                onClick={handleSimulateProgress}
                className="px-4 py-2 bg-[#00B87C] hover:bg-[#059669] text-white text-xs font-black rounded-xl shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                Study Next Lesson
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-[#00B87C]/10 text-[#00B87C] text-xs font-black rounded-xl border border-[#00B87C]/25 flex items-center gap-1">
                <CheckCircle2 size={16} /> Completed
              </span>
            )}
          </div>

          {/* Details overview */}
          <div className="text-xs space-y-2 text-slate-650 dark:text-slate-405 font-bold">
            <div className="flex justify-between border-b border-border pb-1">
              <span className="font-medium text-slate-400">Duration:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {course.duration}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-1">
              <span className="font-medium text-slate-400">Difficulty:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {course.difficulty}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Department Target:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {course.department}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Training() {
  const [activeTab, setActiveTab] = useState<
    "My Learning" | "Catalog" | "Mandatory" | "Analytics"
  >("My Learning");
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);

  const handleDownloadCert = (certName: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8,Certificate Name,Date Earned,Authority\n" +
      certName;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${certName.replace(/\s+/g, "_")}_Certificate.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const enrolledCourses = courses.filter(
    (c) => c.isEnrolled && c.progress < 100,
  );

  const getGradient = (type: string) => {
    switch (type) {
      case "Technical":
        return "from-emerald-400 to-teal-600";
      case "Leadership":
        return "from-purple-400 to-indigo-600";
      case "Compliance":
        return "from-amber-400 to-orange-500";
      default:
        return "from-slate-400 to-slate-600";
    }
  };

  const getDiffStyle = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "bg-emerald-500/5 text-emerald-600 border-emerald-500/10";
      case "Intermediate":
        return "bg-amber-500/5 text-amber-600 border-amber-500/10";
      case "Advanced":
        return "bg-rose-500/5 text-rose-600 border-rose-500/10";
      default:
        return "bg-slate-500/5 text-slate-500 border-slate-500/10";
    }
  };

  const handleEnroll = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isEnrolled: true, progress: 5 } : c,
      ),
    );
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Title",
      "Category",
      "Trainer",
      "Duration",
      "Progress",
    ];
    const rows = courses.map((c) => [
      c.id,
      c.title,
      c.category,
      c.trainer,
      c.duration,
      `${c.progress}%`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "training_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">
              Training & Learning
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-[#111827] dark:text-foreground flex items-center gap-3">
            <BookOpen size={32} className="text-[#00B87C]" />
            Training & Learning
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Upskill employees and track learning progress.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground bg-card border border-border hover:bg-muted/50 transition-all shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground bg-card border border-border hover:bg-muted/50 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Add Course
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-[#00B87C] hover:bg-[#059669] shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 cursor-pointer"
          >
            Assign Course
          </button>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className="bg-card border border-[#00B87C]/15 px-6 py-4 rounded-2xl flex flex-wrap items-center gap-x-8 gap-y-3 shadow-sm mb-8">
        <span className="flex items-center gap-2 text-[12px] font-black text-rose-600 dark:text-rose-500">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
          3 mandatory trainings due
        </span>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <span className="flex items-center gap-2 text-[12px] font-black text-emerald-600 dark:text-primary">
          <span className="w-2 h-2 rounded-full bg-[#00B87C] inline-block" />
          8 courses completed this year
        </span>
        <div className="hidden md:block w-[1px] h-4 bg-border" />
        <span className="flex items-center gap-2 text-[12px] font-black text-amber-600 dark:text-amber-500">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          2 certifications expiring soon
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Continued Courses",
            val: courses.length + 12,
            icon: BookOpen,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "80%",
            colorName: "emerald",
          },
          {
            label: "Active Learners",
            val: "142",
            icon: User,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "65%",
            colorName: "emerald",
          },
          {
            label: "Completed Month",
            val: "8",
            icon: CheckCircle2,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "45%",
            colorName: "emerald",
          },
          {
            label: "Certifications",
            val: "24",
            icon: Award,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "75%",
            colorName: "emerald",
          },
          {
            label: "Mandatory Pending",
            val: "3",
            icon: Clock,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            percent: "30%",
            colorName: "rose",
          },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="relative group bg-card border border-border p-5 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#00B87C]/5 transition-all duration-300"
          >
            {/* Glow circle */}
            <div
              className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#00B87C]/5 group-hover:scale-150 transition-transform duration-500`}
            />
            
            <div className="relative flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} dark:bg-zinc-800/50 ${kpi.color}`}
              >
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                  {kpi.val}
                </p>
              </div>
            </div>
            
            <div className="mt-4 w-full h-1 bg-muted/50 rounded-full overflow-hidden relative z-10">
              <div
                className={`h-full ${kpi.colorName === "rose" ? "bg-rose-500" : "bg-[#00B87C]"} transition-all duration-1000`}
                style={{ width: kpi.percent }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-card border border-border p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <div className="relative flex-1 w-full group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00B87C] transition-colors"
          />
          <input
            type="text"
            placeholder="Search courses, instructors, skills..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-white dark:bg-zinc-900/50 text-foreground font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            className="px-3 py-2 text-xs rounded-xl border border-border bg-white dark:bg-zinc-900/50 text-foreground hover:border-[#00B87C] focus:border-[#00B87C] outline-none font-bold cursor-pointer transition-all"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Leadership">Leadership</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select
            className="px-3 py-2 text-xs rounded-xl border border-border bg-white dark:bg-zinc-900/50 text-foreground hover:border-[#00B87C] focus:border-[#00B87C] outline-none font-bold cursor-pointer transition-all"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("All");
              setDeptFilter("All");
            }}
            className="text-[11px] font-black text-slate-500 hover:text-[#00B87C] uppercase tracking-widest transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex border-b border-border mb-8 flex-wrap">
        {(["My Learning", "Catalog", "Mandatory", "Analytics"] as const).map(
          (tab) => (
            <button
              key={tab}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab
                  ? "border-[#00B87C] text-[#00B87C]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } cursor-pointer`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "My Learning" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Enrolled & Certifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrolled Courses Section */}
            <div>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase block mb-4 ml-1">
                CONTINUE LEARNING
              </span>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setLearningCourse(course)}
                    className="w-[240px] h-[300px] bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col flex-shrink-0 transition-all hover:-translate-y-1 hover:border-[#00B87C]/50 hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] cursor-pointer"
                  >
                    {/* Gradient Banner */}
                    <div
                      className={`h-[120px] bg-gradient-to-br ${getGradient(course.type)} p-4 relative flex flex-col justify-between`}
                    >
                      <span className="px-2.5 py-1 rounded-full bg-white/95 text-foreground text-[9px] font-black tracking-wide uppercase self-start shadow-sm">
                        {course.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-400">
                          Trainer: {course.trainer}
                        </p>
                      </div>

                      <div>
                        {/* Progress bar */}
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 mb-1.5">
                          <div className="h-1.5 w-[75%] bg-muted/80 rounded-full overflow-hidden border border-border/20">
                            <div
                              className="h-full bg-[#00B87C] rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-foreground/80">{course.progress}%</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/80">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <Clock size={12} />
                            {course.timeLeft}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLearningCourse(course);
                            }}
                            className="px-2.5 py-1.5 bg-[#00B87C]/10 text-[#00B87C] hover:bg-[#00B87C] hover:text-white text-[11px] font-black rounded-xl border border-[#00B87C]/15 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Continue <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase block mb-4 ml-1">
                ACHIEVED CERTIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialCertifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="bg-card p-5 rounded-3xl border border-border shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00B87C]/15 text-[#00B87C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00B87C]/10">
                        <Award size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {cert.name}
                        </h4>
                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                          {cert.authority}
                        </p>
                        <span className="text-[9px] font-medium text-slate-400 block mt-1">
                          Earned: {cert.dateEarned}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadCert(cert.name)}
                      className="px-3 py-2 border border-border rounded-xl text-[11px] font-black text-slate-550 dark:text-slate-300 hover:bg-[#00B87C]/10 hover:text-[#00B87C] hover:border-[#00B87C]/30 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <Download size={12} />
                      Get
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skill Matrix */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#00B87C]" />
                Personal Skill Matrix
              </h3>
              <div className="space-y-4">
                {initialSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        {skill.skill}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDiffStyle(skill.level)}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted/80 rounded-full overflow-hidden border border-border/20">
                      <div
                        className="h-full bg-[#00B87C] rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Catalog" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses
            .filter((c) => {
              const matchesSearch = c.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
              const matchesType = typeFilter === "All" || c.type === typeFilter;
              const matchesDept =
                deptFilter === "All" || c.department === deptFilter;
              return matchesSearch && matchesType && matchesDept;
            })
            .map((course) => (
              <div
                key={course.id}
                onClick={() => setLearningCourse(course)}
                className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col relative transition-all hover:-translate-y-1 hover:border-[#00B87C]/50 hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] cursor-pointer"
              >
                {/* Banner */}
                <div
                  className={`h-[120px] bg-gradient-to-br ${getGradient(course.type)} p-3 relative flex items-start justify-between`}
                >
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-foreground text-[9px] font-black tracking-wide uppercase self-start shadow-sm">
                    {course.type}
                  </span>
                  <Bookmark
                    size={16}
                    className="text-white/80 hover:text-white cursor-pointer"
                  />
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDiffStyle(course.difficulty)}`}
                    >
                      {course.difficulty}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-2 line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mt-2">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>By {course.trainer}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      <Star size={14} className="fill-current" />
                      <span>{course.rating || 4.5}</span>
                    </div>

                    {course.progress === 100 ? (
                      <span className="px-2.5 py-1.5 text-[11px] font-black text-[#00B87C] bg-[#00B87C]/10 rounded-xl border border-[#00B87C]/20 flex items-center gap-1">
                        Completed ✓
                      </span>
                    ) : course.isEnrolled ? (
                      <span className="px-2.5 py-1.5 text-[11px] font-black text-slate-500 bg-muted rounded-xl border border-border/50 flex items-center gap-1">
                        Enrolled ({course.progress}%)
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll(course.id);
                        }}
                        className="px-4 py-1.5 bg-[#00B87C] hover:bg-[#059669] text-white text-[11px] font-black rounded-xl shadow-lg shadow-[#00B87C]/20 active:scale-95 transition-all cursor-pointer"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === "Mandatory" && (
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              title: "Security Awareness Training",
              due: "2026-05-10",
              status: "Pending",
              instructor: "IT Sec Team",
            },
            {
              title: "Global Compliance & Anti-Bribery",
              due: "2026-04-15",
              status: "Overdue",
              instructor: "Legal Counsel",
            },
            {
              title: "Health & Safety Orientation",
              due: "2026-04-20",
              status: "Completed",
              instructor: "HR Ops",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-card p-5 rounded-3xl border border-border shadow-sm border-l-4 ${
                item.status === "Completed"
                  ? "border-l-[#00B87C]"
                  : item.status === "Overdue"
                    ? "border-l-rose-500"
                    : "border-l-amber-500"
              } flex items-center justify-between gap-4 hover:border-l-8 transition-all duration-200`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={`w-6 h-6 flex-shrink-0 ${
                    item.status === "Completed"
                      ? "text-[#00B87C]"
                      : item.status === "Overdue"
                        ? "text-rose-500"
                        : "text-amber-500"
                  }`}
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                    Instructor: {item.instructor} • Deadline: {item.due}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border ${
                    item.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : item.status === "Overdue"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  {item.status}
                </span>
                {item.status !== "Completed" && (
                  <button className="px-4 py-1.5 text-[11px] font-black text-white bg-[#00B87C] hover:bg-[#059669] rounded-xl shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 cursor-pointer uppercase tracking-wider">
                    Launch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Analytics Card */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <User size={18} className="text-[#00B87C]" />
              Manager Analytics Dashboard
            </h3>
            <div className="space-y-4 text-xs font-bold">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-slate-450 font-medium">
                  Team Completion Rate
                </span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                  74%
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-slate-450 font-medium">
                  Pending Course Clearances
                </span>
                <span className="font-extrabold text-rose-600 text-sm">12</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-slate-450 font-medium">
                  Top Performer
                </span>
                <span className="font-extrabold text-[#00B87C] text-sm">
                  Aarti Gupta (140 hrs)
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Training */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Star size={18} className="text-amber-500" />
              Recommended Next Actions
            </h3>
            <div className="space-y-3">
              {[
                "Assign Docker Orchestration to Dev Core",
                "Review Sneha's pending Project Management exam",
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900/30 border border-border p-3.5 rounded-2xl"
                >
                  <Check className="text-[#00B87C] flex-shrink-0" size={16} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onSave={(newCourse) => {
            setCourses((prev) => [...prev, newCourse]);
            setShowAddModal(false);
          }}
        />
      )}

      {showAssignModal && (
        <AssignCourseModal
          courses={courses}
          onClose={() => setShowAssignModal(false)}
        />
      )}
      {learningCourse && (
        <CoursePlayerModal
          course={learningCourse}
          onClose={() => setLearningCourse(null)}
          onUpdateProgress={(id, progress) => {
            setCourses((prev) =>
              prev.map((c) =>
                c.id === id ? { ...c, progress, isEnrolled: true } : c,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
