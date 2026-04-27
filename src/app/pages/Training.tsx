import React, { useState } from "react";
import {
  BookOpen, Download, CheckCircle2, Clock, Award, Star,
  Search, Bookmark, ArrowRight, AlertCircle, Plus, BarChart3, User, Check, X
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
interface Course {
  id: string;
  title: string;
  category: string;
  trainer: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  timeLeft?: string;
  type: 'Technical' | 'Leadership' | 'Compliance';
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
  level: 'Beginner' | 'Intermediate' | 'Advanced';
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
    lastAccessed: "2026-04-25"
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
    lastAccessed: "2026-04-26"
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
    lastAccessed: "N/A"
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
    reviews: 128
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
    reviews: 85
  }
];

const initialCertifications: Certification[] = [
  { name: "AWS Certified Cloud Practitioner", dateEarned: "2025-11-10", expiryDate: "2028-11-10", authority: "Amazon Web Services" },
  { name: "Professional Scrum Master I", dateEarned: "2026-01-15", authority: "Scrum.org" }
];

const initialSkills: SkillRecord[] = [
  { skill: "Communication", level: "Advanced", percentage: 85 },
  { skill: "Excel & Analytics", level: "Intermediate", percentage: 60 },
  { skill: "Leadership", level: "Intermediate", percentage: 55 },
  { skill: "React Development", level: "Advanced", percentage: 90 },
  { skill: "Python Automation", level: "Beginner", percentage: 30 }
];

function AddCourseModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Course) => void }) {
  const [form, setForm] = useState<{
    title: string;
    category: string;
    trainer: string;
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    department: string;
  }>({
    title: "",
    category: "Technical",
    trainer: "",
    duration: "4 hrs",
    difficulty: "Beginner",
    department: "Engineering"
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
      type: form.category as 'Technical' | 'Leadership' | 'Compliance',
      department: form.department,
      isEnrolled: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Create Course</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Title</label>
            <input
              type="text"
              className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Trainer</label>
            <input
              type="text"
              className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.trainer}
              onChange={e => setForm({ ...form, trainer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
            <select
              className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground font-bold cursor-pointer"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="Technical">Technical</option>
              <option value="Leadership">Leadership</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Duration</label>
              <input
                type="text"
                className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground font-bold cursor-pointer"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Difficulty</label>
              <select
                className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground font-bold cursor-pointer"
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-xs font-black text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 text-xs font-black text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl">Save Course</button>
        </div>
      </div>
    </div>
  );
}

function AssignCourseModal({ courses, onClose }: { courses: Course[]; onClose: () => void }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Assign Training</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
        </div>
        {isSuccess ? (
          <div className="py-6 text-center text-[#00B87C] text-xs font-bold flex flex-col items-center gap-2">
            <CheckCircle2 size={30} />
            Course successfully assigned to {assignee}!
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Select Course</label>
              <select
                className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground cursor-pointer font-bold"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Employee or Department</label>
              <input
                type="text"
                placeholder="e.g. Engineering Team"
                className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2 text-xs font-black text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200">Cancel</button>
              <button onClick={handleAssign} className="flex-1 py-2 text-xs font-black text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl">Assign Now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoursePlayerModal({ course, onClose, onUpdateProgress }: { course: Course; onClose: () => void; onUpdateProgress: (id: string, p: number) => void }) {
  const [simulatedProgress, setSimulatedProgress] = useState(course.progress);

  const handleSimulateProgress = () => {
    const next = Math.min(simulatedProgress + 25, 100);
    setSimulatedProgress(next);
    onUpdateProgress(course.id, next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] text-[9px] font-black tracking-wide uppercase">
              {course.type}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1">{course.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg flex-shrink-0"><X size={18} /></button>
        </div>

        <div className="flex-1 py-2 space-y-4">
          {/* Simulated Video Screen */}
          <div className="w-full aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center text-center text-white relative overflow-hidden shadow-inner border border-zinc-800">
            <BookOpen size={40} className="text-[#00B87C] animate-pulse" />
            <span className="text-xs font-bold mt-2">Playing Module 1: Overview</span>
            <span className="text-[9px] text-slate-400 mt-1">Trainer: {course.trainer}</span>
          </div>

          {/* Progress stats */}
          <div className="bg-neutral-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-border flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Course progress</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">{simulatedProgress}% Completed</span>
            </div>
            {simulatedProgress < 100 ? (
              <button
                onClick={handleSimulateProgress}
                className="px-4 py-2 bg-[#00B87C] hover:bg-[#00a36d] text-white text-xs font-black rounded-xl shadow-sm transition-all active:scale-95"
              >
                Study Next Lesson
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-[#E6F4EA] text-[#00B87C] text-xs font-black rounded-xl flex items-center gap-1">
                <CheckCircle2 size={16} /> Completed
              </span>
            )}
          </div>

          {/* Details overview */}
          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800 pb-1">
              <span className="font-medium">Duration:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{course.duration}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800 pb-1">
              <span className="font-medium">Difficulty:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{course.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Department Target:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{course.department}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Training() {
  const [activeTab, setActiveTab] = useState<'My Learning' | 'Catalog' | 'Mandatory' | 'Analytics'>('My Learning');
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);

  const handleDownloadCert = (certName: string) => {
    const csvContent = "data:text/csv;charset=utf-8,Certificate Name,Date Earned,Authority\n" + certName;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${certName.replace(/\s+/g, '_')}_Certificate.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const enrolledCourses = courses.filter(c => c.isEnrolled && c.progress < 100);

  const getGradient = (type: string) => {
    switch (type) {
      case 'Technical': return 'from-emerald-400 to-teal-600';
      case 'Leadership': return 'from-purple-400 to-indigo-600';
      case 'Compliance': return 'from-amber-400 to-orange-500';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getDiffStyle = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Intermediate': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Advanced': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleEnroll = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, isEnrolled: true, progress: 5 } : c));
  };

  const handleExport = () => {
    const headers = ["ID", "Title", "Category", "Trainer", "Duration", "Progress"];
    const rows = courses.map(c => [c.id, c.title, c.category, c.trainer, c.duration, `${c.progress}%`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "training_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full p-6 min-h-screen bg-[#F0FDF4] dark:bg-zinc-950/30">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">Training & Learning</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen size={26} color="#00B87C" />
            Training & Learning
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Upskill employees and track learning progress
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-white dark:bg-zinc-900 border border-border text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-neutral-100 dark:bg-zinc-800 border border-border text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-neutral-200 transition-all shadow-sm"
          >
            <Plus size={16} />
            Add Course
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs shadow-sm active:scale-95"
          >
            Assign Course
          </button>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className="bg-white dark:bg-zinc-900/60 border border-border rounded-xl px-4 py-2.5 text-[11px] text-slate-600 dark:text-slate-400 font-bold flex items-center gap-4 flex-wrap mb-6 shadow-sm">
        <span className="flex items-center gap-1.5 text-rose-600">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
          3 mandatory trainings due
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-teal-600">
          <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
          8 courses completed this year
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          2 certifications expiring soon
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'continuel Courses', val: courses.length + 12, icon: BookOpen, color: 'text-[#00B87C]', bg: 'bg-emerald-50' },
          { label: 'Active Learners', val: '142', icon: User, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Completed Month', val: '8', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Certifications', val: '24', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Mandatory Pending', val: '3', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg} dark:bg-zinc-800/50 ${kpi.color}`}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{kpi.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses, instructors, skills..."
            className="w-full pl-11 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Leadership">Leadership</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
          </select>

          <button
            onClick={() => { setSearchTerm(""); setTypeFilter("All"); setDeptFilter("All"); }}
            className="text-[10px] font-black text-muted-foreground uppercase tracking-wider hover:text-[#00B87C]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex border-b border-border mb-8 flex-wrap">
        {(['My Learning', 'Catalog', 'Mandatory', 'Analytics'] as const).map(tab => (
          <button
            key={tab}
            className={`px-6 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === tab ? 'border-[#00B87C] text-[#00B87C]' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'My Learning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Enrolled & Certifications */}
          <div className="lg:col-span-2 space-y-8">

            {/* Enrolled Courses Section */}
            <div>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase block mb-4">
                CONTINUE LEARNING
              </span>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                {enrolledCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => setLearningCourse(course)}
                    className="w-[240px] h-[290px] bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col flex-shrink-0 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
                  >
                    {/* Gradient Banner */}
                    <div className={`h-[120px] bg-gradient-to-br ${getGradient(course.type)} p-3 relative flex flex-col justify-between`}>
                      <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] text-[9px] font-black tracking-wide uppercase self-start">
                        {course.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400">
                          Trainer: {course.trainer}
                        </p>
                      </div>

                      <div>
                        {/* Progress bar */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 mb-1.5">
                          <div className="h-1 w-[75%] bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00B87C]" style={{ width: `${course.progress}%` }} />
                          </div>
                          <span>{course.progress}%</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-zinc-800/60">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Clock size={12} />
                            {course.timeLeft}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLearningCourse(course);
                            }}
                            className="px-2.5 py-1 bg-[#DCFCE7] text-[#00B87C] text-[10px] font-black rounded-lg hover:bg-[#cbf7d9] transition-all flex items-center gap-1"
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
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase block mb-4">
                ACHIEVED CERTIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialCertifications.map((cert, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 flex items-center justify-center flex-shrink-0">
                        <Award size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{cert.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{cert.authority}</p>
                        <span className="text-[9px] font-medium text-slate-400 block mt-1">Earned: {cert.dateEarned}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadCert(cert.name)}
                      className="px-3 py-1.5 border border-border rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-neutral-50 transition-all flex items-center gap-1 flex-shrink-0"
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
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#00B87C]" />
                Personal Skill Matrix
              </h3>
              <div className="space-y-4">
                {initialSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{skill.skill}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDiffStyle(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00B87C] rounded-full" style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'Catalog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses
            .filter(c => {
              const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesType = typeFilter === "All" || c.type === typeFilter;
              const matchesDept = deptFilter === "All" || c.department === deptFilter;
              return matchesSearch && matchesType && matchesDept;
            })
            .map(course => (
              <div
                key={course.id}
                onClick={() => setLearningCourse(course)}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col relative transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                {/* Banner */}
                <div className={`h-[120px] bg-gradient-to-br ${getGradient(course.type)} p-3 relative flex items-start justify-between`}>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] text-[9px] font-black tracking-wide uppercase">
                    {course.type}
                  </span>
                  <Bookmark size={16} className="text-white/80 hover:text-white cursor-pointer" />
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDiffStyle(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-2 line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400 mt-2">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>By {course.trainer}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 dark:border-zinc-800/60 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      <Star size={14} className="fill-current" />
                      <span>{course.rating || 4.5}</span>
                    </div>

                    {course.progress === 100 ? (
                      <span className="px-2.5 py-1 text-[10px] font-black text-[#00B87C] bg-[#E6F4EA] rounded-lg flex items-center gap-1">
                        Completed ✓
                      </span>
                    ) : course.isEnrolled ? (
                      <span className="px-2.5 py-1 text-[10px] font-black text-slate-600 bg-slate-100 rounded-lg flex items-center gap-1">
                        Enrolled ({course.progress}%)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="px-4 py-1.5 bg-[#00B87C] hover:bg-[#00a36d] text-white text-[10px] font-black rounded-xl shadow-sm transition-all active:scale-95"
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

      {activeTab === 'Mandatory' && (
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { title: "Security Awareness Training", due: "2026-05-10", status: "Pending", instructor: "IT Sec Team" },
            { title: "Global Compliance & Anti-Bribery", due: "2026-04-15", status: "Overdue", instructor: "Legal Counsel" },
            { title: "Health & Safety Orientation", due: "2026-04-20", status: "Completed", instructor: "HR Ops" }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border border-border shadow-sm border-l-4 ${item.status === 'Completed' ? 'border-l-[#00B87C]' :
                item.status === 'Overdue' ? 'border-l-rose-500' : 'border-l-amber-500'
                } flex items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className={`w-6 h-6 flex-shrink-0 ${item.status === 'Completed' ? 'text-[#00B87C]' :
                  item.status === 'Overdue' ? 'text-rose-500' : 'text-amber-500'
                  }`} />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Instructor: {item.instructor} • Deadline: {item.due}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${item.status === 'Completed' ? 'bg-[#E6F4EA] text-[#00B87C]' :
                  item.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                  {item.status}
                </span>
                {item.status !== 'Completed' && (
                  <button className="px-4 py-1.5 text-[10px] font-black text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl shadow-sm transition-all">
                    Launch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Team Analytics Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#00B87C]" />
              Manager Analytics Dashboard
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
                <span className="text-slate-500 font-medium">Team Completion Rate</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">74%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
                <span className="text-slate-500 font-medium">Pending Course Clearances</span>
                <span className="font-extrabold text-rose-600 text-sm">12</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
                <span className="text-slate-500 font-medium">Top Performer</span>
                <span className="font-extrabold text-[#00B87C] text-sm">Aarti Gupta (140 hrs)</span>
              </div>
            </div>
          </div>

          {/* Recommended Training */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              Recommended Next Actions
            </h3>
            <div className="space-y-3">
              {[
                "Assign Docker Orchestration to Dev Core",
                "Review Sneha's pending Project Management exam"
              ].map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-neutral-50 dark:bg-zinc-800/30 border border-border p-3 rounded-xl">
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
            setCourses(prev => [...prev, newCourse]);
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
            setCourses(prev => prev.map(c => c.id === id ? { ...c, progress, isEnrolled: true } : c));
          }}
        />
      )}
    </div>
  );
}
