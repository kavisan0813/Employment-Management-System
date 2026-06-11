import React, { useState, useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  Clock,
  AlertCircle,
  Book,
  Download,
  Plus,
  Search,
  ChevronLeft,
  Play,
  CheckCircle,
  Star,
  X,
  Upload,
  Calendar,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
type Stage =
  | "Not Enrolled"
  | "Enrolled"
  | "In Progress"
  | "Completed"
  | "Overdue";
type CourseCategory =
  | "Technical"
  | "Compliance"
  | "Soft Skills"
  | "Design"
  | "Management";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: CourseCategory;
  provider: string;
  trainer: string;
  progress: number;
  timeLeft: string;
  duration: string;
  difficulty: Difficulty;
  rating: number;
  gradient: string;
  status: Stage;
  isMandatory?: boolean;
  dueDate?: string;
  lastAccessed?: string;
  lessons: Lesson[];
}

interface Certification {
  id: number;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Pending Verification";
  isExternal?: boolean;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const ALL_COURSES: Course[] = [
  {
    id: 1,
    title: "Advanced React Architecture",
    description:
      "Master complex React patterns, performance optimization, and scalable state management for large enterprise applications.",
    category: "Technical",
    provider: "Internal",
    trainer: "Sarah Johnson",
    progress: 65,
    timeLeft: "2h 30m",
    duration: "8h 15m",
    difficulty: "Advanced",
    rating: 4.8,
    gradient: "from-emerald-400 to-teal-600",
    status: "In Progress",
    lastAccessed: "2 days ago",
    lessons: [
      {
        id: 1,
        title: "Introduction to React Architecture",
        duration: "15:00",
        completed: true,
      },
      {
        id: 2,
        title: "Custom Hooks & Logic Reuse",
        duration: "45:00",
        completed: true,
      },
      {
        id: 3,
        title: "Compound Components Pattern",
        duration: "30:00",
        completed: true,
      },
      {
        id: 4,
        title: "Render Props vs. Higher-Order Components",
        duration: "25:00",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: "Data Privacy & GDPR",
    description:
      "Essential training on data protection regulations, employee responsibilities, and best practices for handling sensitive information.",
    category: "Compliance",
    provider: "Internal",
    trainer: "Robert Lee",
    progress: 30,
    timeLeft: "1h 15m",
    duration: "2h 45m",
    difficulty: "Beginner",
    rating: 4.5,
    gradient: "from-blue-400 to-indigo-600",
    status: "In Progress",
    isMandatory: true,
    dueDate: "May 15, 2026",
    lastAccessed: "5 days ago",
    lessons: [
      { id: 1, title: "What is GDPR?", duration: "20:00", completed: true },
      {
        id: 2,
        title: "Personal Data & Processing",
        duration: "35:00",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: "Effective Communication",
    description:
      "Build stronger professional relationships through clear, empathetic, and strategic communication techniques.",
    category: "Soft Skills",
    provider: "LinkedIn Learning",
    trainer: "Emily Chen",
    progress: 45,
    timeLeft: "45m",
    duration: "3h 20m",
    difficulty: "Intermediate",
    rating: 4.9,
    gradient: "from-purple-400 to-fuchsia-600",
    status: "In Progress",
    lastAccessed: "1 week ago",
    lessons: [
      {
        id: 1,
        title: "The Art of Listening",
        duration: "25:00",
        completed: true,
      },
      {
        id: 2,
        title: "Non-Verbal Communication",
        duration: "30:00",
        completed: true,
      },
      {
        id: 3,
        title: "Giving & Receiving Feedback",
        duration: "45:00",
        completed: false,
      },
    ],
  },
  {
    id: 4,
    title: "Cloud Computing Fundamentals",
    description:
      "A comprehensive overview of cloud infrastructure, service models (IaaS, PaaS, SaaS), and security fundamentals.",
    category: "Technical",
    provider: "LinkedIn Learning",
    trainer: "David Smith",
    progress: 0,
    timeLeft: "5h 20m",
    duration: "5h 20m",
    difficulty: "Beginner",
    rating: 4.7,
    gradient: "from-cyan-400 to-blue-600",
    status: "Not Enrolled",
    lessons: [
      { id: 1, title: "Cloud Basics", duration: "30:00", completed: false },
    ],
  },
  {
    id: 5,
    title: "Product Design Mastery",
    description:
      "Learn the end-to-end product design process from discovery and wireframing to high-fidelity prototyping and testing.",
    category: "Design",
    provider: "Internal",
    trainer: "Jessica Williams",
    progress: 0,
    timeLeft: "12h",
    duration: "12h",
    difficulty: "Advanced",
    rating: 4.9,
    gradient: "from-rose-400 to-pink-600",
    status: "Not Enrolled",
    lessons: [
      {
        id: 1,
        title: "Design Thinking Overview",
        duration: "45:00",
        completed: false,
      },
    ],
  },
  {
    id: 6,
    title: "Cybersecurity Awareness 2026",
    description:
      "Protecting company assets and data in an evolving threat landscape. Mandatory for all employees.",
    category: "Compliance",
    provider: "Internal",
    trainer: "Security Team",
    progress: 0,
    timeLeft: "1h",
    duration: "1h",
    difficulty: "Beginner",
    rating: 4.4,
    gradient: "from-orange-400 to-red-600",
    status: "Not Enrolled",
    isMandatory: true,
    dueDate: "May 10, 2026",
    lessons: [
      {
        id: 1,
        title: "Phishing & Social Engineering",
        duration: "30:00",
        completed: false,
      },
      {
        id: 2,
        title: "Strong Passwords & MFA",
        duration: "30:00",
        completed: false,
      },
    ],
  },
];

const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuedBy: "Amazon Web Services",
    issueDate: "Nov 15, 2025",
    expiryDate: "Nov 15, 2028",
    status: "Active",
  },
  {
    id: 2,
    name: "Professional Scrum Master (PSM I)",
    issuedBy: "Scrum.org",
    issueDate: "Jan 20, 2026",
    expiryDate: "Never",
    status: "Active",
  },
  {
    id: 3,
    name: "Google Data Analytics Professional",
    issuedBy: "Google",
    issueDate: "Mar 10, 2025",
    expiryDate: "Mar 10, 2027",
    status: "Expiring Soon",
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface StatsCardProps {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
  subValue: string;
  bg: string;
}

function StatsCard({
  icon: Icon,
  color,
  label,
  value,
  subValue,
  bg,
}: StatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]">
      <div
        className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
      >
        <Icon
          size={24}
          className={color.startsWith("#") ? "" : color}
          style={color.startsWith("#") ? { color } : {}}
        />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-2xl font-black text-foreground leading-none mb-1">
          {value}
        </p>
        <p className="text-[12px] font-bold text-muted-foreground">
          {subValue}
        </p>
      </div>
    </div>
  );
}

/* ─── Modal Components ────────────────────────────────────────── */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-[32px] border border-border shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-black text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  );
}

/* ─── Views ─────────────────────────────────────────────────── */

export function EmployeeTraining() {
  const [view, setView] = useState<
    "dashboard" | "catalog" | "my-courses" | "learning"
  >("dashboard");
  const [courses, setCourses] = useState<Course[]>(ALL_COURSES);
  const [certs, setCerts] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEnrollConfirm, setShowEnrollConfirm] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === activeCourseId),
    [courses, activeCourseId],
  );

  // Filters for Catalog
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [durationFilter, setDurationFilter] = useState("All");

  /* Logic Handlers */
  const handleEnroll = (courseId: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, status: "In Progress", progress: 0 } : c,
      ),
    );
    showToast(
      "Enrollment Successful",
      "success",
      "You are now enrolled in the course!",
    );
    setShowEnrollConfirm(false);
    setShowDetailModal(false);
  };

  const handleStartNow = (course: Course) => {
    if (course.status === "Not Enrolled") {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, status: "In Progress", progress: 0 } : c,
        ),
      );
      showToast("Training Started", "success", `Launching ${course.title}...`);
    }
    setActiveCourseId(course.id);
    setView("learning");
  };

  const handleLessonToggle = (courseId: number, lessonId: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const newLessons = c.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l,
        );
        const completedCount = newLessons.filter((l) => l.completed).length;
        const newProgress = Math.round(
          (completedCount / newLessons.length) * 100,
        );
        return {
          ...c,
          lessons: newLessons,
          progress: newProgress,
          status: newProgress === 100 ? "Completed" : "In Progress",
        };
      }),
    );
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: Certification = {
      id: Date.now(),
      name: "Cloud Security Professional",
      issuedBy: "Security Hub",
      issueDate: "May 2026",
      expiryDate: "May 2029",
      status: "Pending Verification",
      isExternal: true,
    };
    setCerts([newCert, ...certs]);
    showToast(
      "Certificate Submitted",
      "success",
      "Pending verification by HR.",
    );
    setShowAddCertModal(false);
  };

  const handleDownloadCert = (certName: string, status: string) => {
    if (status === "Pending Verification") {
      showToast(
        "Verification Pending",
        "info",
        "Certificate will be available after verification.",
      );
      return;
    }
    showToast(
      "Downloading",
      "success",
      `Preparing ${certName} for download...`,
    );
  };

  /* Render Helpers */
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
            <Book size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Training & Learning
          </h1>
        </div>
        <button
          onClick={() => setView("catalog")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-emerald-500/10 active:scale-[0.98] whitespace-nowrap"
        >
          Browse Catalog
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          icon={BookOpen}
          color="text-emerald-500"
          label="ENROLLED"
          value={courses.filter((c) => c.status === "In Progress").length}
          subValue="courses active"
          bg="bg-emerald-500/10"
        />
        <StatsCard
          icon={CheckCircle2}
          color="text-teal-500"
          label="COMPLETED"
          value={courses.filter((c) => c.status === "Completed").length}
          subValue="total history"
          bg="bg-teal-500/10"
        />
        <StatsCard
          icon={Award}
          color="text-purple-500"
          label="CERTIFICATIONS"
          value={certs.length}
          subValue="active & valid"
          bg="bg-purple-500/10"
        />
      </div>

      {/* Continue Learning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            CONTINUE LEARNING
          </h3>
          <button
            onClick={() => setView("my-courses")}
            className="text-[11px] font-black text-primary hover:underline"
          >
            View All My Courses
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {courses
            .filter((c) => c.status === "In Progress")
            .map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setShowDetailModal(true);
                }}
                className="w-[220px] h-[320px] bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col flex-shrink-0 transition-all hover:-translate-y-1 hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] cursor-pointer group"
              >
                <div
                  className={`h-[130px] bg-gradient-to-br ${course.gradient} p-4 relative flex flex-col justify-between`}
                >
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-black tracking-wide uppercase self-start border border-white/20">
                    {course.category}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center self-end border border-white/10">
                    <Book size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[14px] font-black text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      {course.provider}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-muted-foreground uppercase">
                          Progress
                        </span>
                        <span className="text-primary">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                        <Clock size={12} /> {course.timeLeft}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCourseId(course.id);
                          setView("learning");
                        }}
                        className="px-3 py-1.5 bg-emerald-500/10 text-primary text-[11px] font-black rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                      >
                        Continue <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Mandatory Training */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            MANDATORY TRAINING
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 text-[11px] font-semibold border border-rose-100 dark:bg-rose-500/10">
            {
              courses.filter((c) => c.isMandatory && c.status !== "Completed")
                .length
            }{" "}
            pending
          </span>
        </div>
        <div className="space-y-3">
          {courses
            .filter((c) => c.isMandatory)
            .map((item) => (
              <div
                key={item.id}
                className={`bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between gap-4 border-l-[3px] ${
                  item.status === "Overdue"
                    ? "border-l-rose-500"
                    : item.status === "Completed"
                      ? "border-l-primary"
                      : "border-l-amber-500"
                } transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] group`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === "Overdue" ? "bg-rose-50 text-rose-500" : "bg-emerald-500/10 text-primary"}`}
                  >
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                      Deadline: {item.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${item.status === "Overdue" ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-emerald-500/10 text-primary border border-primary/20"}`}
                  >
                    {item.status}
                  </span>
                  {item.status !== "Completed" ? (
                    <button
                      onClick={() => handleStartNow(item)}
                      className="px-5 py-2 bg-primary text-white text-[12px] font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
                    >
                      Start Now
                    </button>
                  ) : (
                    <CheckCircle2 size={24} className="text-primary" />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Certifications Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            MY CERTIFICATIONS
          </h3>
          <button
            onClick={() => setShowAddCertModal(true)}
            className="flex items-center gap-1.5 text-[11px] font-black text-primary hover:underline"
          >
            <Plus size={14} /> Add External Certification
          </button>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  CERTIFICATION
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  ISSUED BY
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  ISSUE DATE
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  STATUS
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {certs.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-secondary transition-colors"
                >
                  <td className="px-6 py-4 font-black text-[14px] text-foreground">
                    {cert.name}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">
                    {cert.issuedBy}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-muted-foreground">
                    {cert.issueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${cert.status === "Active" ? "bg-emerald-500/10 text-primary border-primary/20" : cert.status === "Pending Verification" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-500 border-rose-100"}`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownloadCert(cert.name, cert.status)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => {
    const filteredCourses = courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || c.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "All" || c.difficulty === difficultyFilter;

      // Basic duration filter logic
      let matchesDuration = true;
      if (durationFilter === "Short")
        matchesDuration = parseInt(c.duration) <= 3;
      if (durationFilter === "Medium")
        matchesDuration = parseInt(c.duration) > 3 && parseInt(c.duration) <= 8;
      if (durationFilter === "Long") matchesDuration = parseInt(c.duration) > 8;

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesDuration
      );
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("dashboard")}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <h2 className="text-[26px] font-black text-foreground">
            Course Catalog
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses, skills, or trainers..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-4 py-3 rounded-2xl border border-border bg-card font-bold text-sm outline-none cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Design">Design</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Compliance">Compliance</option>
            </select>
            <select
              className="px-4 py-3 rounded-2xl border border-border bg-card font-bold text-sm outline-none cursor-pointer"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              className="px-4 py-3 rounded-2xl border border-border bg-card font-bold text-sm outline-none cursor-pointer"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
            >
              <option value="All">Any Duration</option>
              <option value="Short">Short (&lt; 3h)</option>
              <option value="Medium">Medium (3-8h)</option>
              <option value="Long">Long (&gt; 8h)</option>
            </select>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setDifficultyFilter("All");
                setDurationFilter("All");
              }}
              className="p-3 rounded-2xl border border-border bg-card hover:bg-secondary transition-all"
              title="Clear Filters"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourse(course);
                setShowDetailModal(true);
              }}
              className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl group"
            >
              <div
                className={`h-[160px] bg-gradient-to-br ${course.gradient} p-6 relative flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase border border-white/20">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-white text-[11px] font-black">
                    <Star size={12} fill="currentColor" /> {course.rating}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h4>
                <p className="text-sm font-bold text-muted-foreground mb-4">
                  {course.trainer} · {course.provider}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-black text-muted-foreground uppercase">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {course.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground">
                      {course.difficulty}
                    </span>
                  </div>
                  {course.status === "Not Enrolled" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                        setShowEnrollConfirm(true);
                      }}
                      className="w-full py-3.5 bg-primary text-white font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-lg shadow-[#00B87C]/10 hover:opacity-95 transition-all"
                    >
                      Enroll Now
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCourseId(course.id);
                        setView("learning");
                      }}
                      className="w-full py-3.5 bg-secondary text-primary font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMyCourses = () => {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("dashboard")}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <h2 className="text-[26px] font-black text-foreground">My Courses</h2>
        </div>

        <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary">
                <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  COURSE
                </th>
                <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  PROGRESS
                </th>
                <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  STATUS
                </th>
                <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  LAST ACCESSED
                </th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses
                .filter((c) => c.status !== "Not Enrolled")
                .map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-secondary/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}
                        >
                          <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">
                            {c.title}
                          </p>
                          <p className="text-xs font-bold text-muted-foreground">
                            {c.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-black text-primary">
                          {c.progress}%
                        </span>
                        <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${c.status === "Completed" ? "bg-emerald-500/10 text-primary border-primary/20" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-muted-foreground">
                      {c.lastAccessed || "Never"}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {c.status === "Completed" ? (
                        <button
                          onClick={() => handleDownloadCert(c.title, "Active")}
                          className="px-4 py-2 bg-emerald-500/10 text-primary rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2 ml-auto"
                        >
                          <Download size={14} /> Certificate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveCourseId(c.id);
                            setView("learning");
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#00B87C]/10 hover:opacity-90 transition-all ml-auto"
                        >
                          Continue
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLearning = () => {
    if (!activeCourse) return null;

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("my-courses")}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <ChevronLeft size={20} className="text-primary" />
            </button>
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                {activeCourse.category}
              </p>
              <h2 className="text-2xl font-black text-foreground">
                {activeCourse.title}
              </h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Progress
              </p>
              <p className="text-lg font-black text-primary">
                {activeCourse.progress}%
              </p>
            </div>
            <div className="w-40 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative group border-4 border-white/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group-hover:bg-primary/30">
                  <Play size={32} className="text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/60 text-xs font-bold">
                <span>Module 1: Getting Started</span>
                <span>15:42</span>
              </div>
            </div>

            <div className="bg-card p-8 rounded-[32px] border border-border shadow-sm">
              <h3 className="text-xl font-black text-foreground mb-4">
                About this lesson
              </h3>
              <p className="text-muted-foreground font-bold leading-relaxed">
                In this module, we'll dive deep into the core concepts and set
                up our development environment. We'll explore why this topic is
                critical for modern enterprise software and the common pitfalls
                to avoid.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {["Video Lesson", "Hands-on Exercise", "Quiz"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-secondary text-foreground text-[11px] font-semibold uppercase tracking-wider border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson List */}
          <div className="space-y-6">
            <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-secondary/30">
                <h3 className="font-black text-foreground uppercase text-xs tracking-widest">
                  Course Curriculum
                </h3>
              </div>
              <div className="flex-1 max-h-[600px] overflow-y-auto p-2">
                {activeCourse.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    onClick={() =>
                      handleLessonToggle(activeCourse.id, lesson.id)
                    }
                    className={`p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      lesson.completed
                        ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${lesson.completed ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}
                      >
                        {lesson.completed ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="text-xs font-black">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-black ${lesson.completed ? "text-primary" : "text-foreground"}`}
                        >
                          {lesson.title}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                    {!lesson.completed && (
                      <Play
                        size={14}
                        className="text-muted-foreground opacity-0 group-hover:opacity-100"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-border mt-auto">
                {activeCourse.progress === 100 ? (
                  <button
                    onClick={() =>
                      handleDownloadCert(activeCourse.title, "Active")
                    }
                    className="w-full py-4 bg-[#00B87C] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={16} /> Claim Certificate
                  </button>
                ) : (
                  <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2">
                    Next Lesson <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Award size={16} />
                </div>
                <h4 className="text-xs font-black text-primary uppercase">
                  Completion Goal
                </h4>
              </div>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                Complete all lessons and pass the final assessment to earn your
                official certification.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full px-4 md:px-8 py-6 pb-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <motion.div
            key="dash"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderDashboard()}
          </motion.div>
        )}
        {view === "catalog" && (
          <motion.div
            key="cat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderCatalog()}
          </motion.div>
        )}
        {view === "my-courses" && (
          <motion.div
            key="myc"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderMyCourses()}
          </motion.div>
        )}
        {view === "learning" && (
          <motion.div
            key="learn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLearning()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Course Details"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div
              className={`h-40 rounded-3xl bg-gradient-to-br ${selectedCourse.gradient} p-8 flex flex-col justify-end`}
            >
              <h2 className="text-2xl font-black text-white">
                {selectedCourse.title}
              </h2>
              <p className="text-white/80 font-bold">
                {selectedCourse.trainer} · {selectedCourse.provider}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary p-4 rounded-2xl text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Duration
                </p>
                <p className="text-sm font-black">{selectedCourse.duration}</p>
              </div>
              <div className="bg-secondary p-4 rounded-2xl text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Level
                </p>
                <p className="text-sm font-black">
                  {selectedCourse.difficulty}
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-2xl text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Rating
                </p>
                <p className="text-sm font-black">
                  {selectedCourse.rating} / 5
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-2xl text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Modules
                </p>
                <p className="text-sm font-black">
                  {selectedCourse.lessons.length}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-black text-foreground">Course Overview</h4>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>
            <div className="pt-4 flex gap-4">
              {selectedCourse.status === "Not Enrolled" ? (
                <button
                  onClick={() => setShowEnrollConfirm(true)}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-[#00B87C]/10"
                >
                  Enroll for Free
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setActiveCourseId(selectedCourse.id);
                    setView("learning");
                  }}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-[#00B87C]/10"
                >
                  Continue Learning
                </button>
              )}
              <button className="flex-1 py-4 bg-secondary text-foreground font-black rounded-2xl">
                View Syllabus
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showEnrollConfirm}
        onClose={() => setShowEnrollConfirm(false)}
        title="Confirm Enrollment"
      >
        {selectedCourse && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto text-primary">
              <BookOpen size={40} />
            </div>
            <div>
              <h4 className="text-xl font-black text-foreground mb-2">
                Ready to start?
              </h4>
              <p className="text-muted-foreground font-bold">
                You are about to enroll in{" "}
                <span className="text-primary">{selectedCourse.title}</span>.
                This will be added to your active courses list.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowEnrollConfirm(false)}
                className="flex-1 py-4 bg-secondary text-foreground font-black rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEnroll(selectedCourse.id)}
                className="flex-1 py-4 bg-primary text-white font-black rounded-2xl"
              >
                Yes, Enroll Me
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showAddCertModal}
        onClose={() => setShowAddCertModal(false)}
        title="Add External Certificate"
      >
        <form onSubmit={handleAddCert} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-widest">
              Certificate Name
            </label>
            <input
              required
              type="text"
              className="w-full px-5 py-3.5 rounded-2xl bg-secondary border-none font-bold outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Google Cloud Professional"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-widest">
                Issuing Organization
              </label>
              <input
                required
                type="text"
                className="w-full px-5 py-3.5 rounded-2xl bg-secondary border-none font-bold outline-none"
                placeholder="e.g. Google"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-widest">
                Credential ID
              </label>
              <input
                type="text"
                className="w-full px-5 py-3.5 rounded-2xl bg-secondary border-none font-bold outline-none"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-widest">
                Issue Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  required
                  type="date"
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-secondary border-none font-bold outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-widest">
                Expiry Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="date"
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-secondary border-none font-bold outline-none"
                />
              </div>
            </div>
          </div>
          <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center space-y-2 hover:bg-secondary/50 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <Upload size={20} />
            </div>
            <p className="text-xs font-black text-foreground">
              Upload Certificate File
            </p>
            <p className="text-[11px] font-bold text-muted-foreground">
              PDF, JPG, or PNG (Max 5MB)
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddCertModal(false)}
              className="flex-1 py-4 bg-secondary text-foreground font-black rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-primary text-white font-black rounded-2xl"
            >
              Submit Certificate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
