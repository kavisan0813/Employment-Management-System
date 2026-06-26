import React, { useState } from "react";
import {
  Book,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Award,
  Search,
  X,
  Clock,
  BookOpen,
  CalendarDays,
  MoreHorizontal,
  ChevronDown,
  Star,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_MY_TEAM = [
  {
    id: "p1",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    designation: "Sr Developer",
    enrolledCourses: "AWS Architect",
    completed: 3,
    mandatoryStatus: "All complete",
    certs: 5,
    atRisk: false,
    actionLabel: "Assign More",
  },
  {
    id: "p2",
    name: "Sneha Rao",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    designation: "Frontend Dev",
    enrolledCourses: "React Advanced",
    completed: 1,
    mandatoryStatus: "Complete",
    certs: 3,
    atRisk: false,
    actionLabel: "Assign",
  },
  {
    id: "p3",
    name: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    designation: "Junior Dev",
    enrolledCourses: "Git CI/CD",
    completed: 0,
    mandatoryStatus: "1 overdue",
    certs: 0,
    atRisk: true,
    actionLabel: "Remind + Assign",
  },
  {
    id: "p4",
    name: "Leo Martinez",
    avatar: "https://i.pravatar.cc/150?u=Leo",
    designation: "Backend Dev",
    enrolledCourses: "Leadership 101",
    completed: 2,
    mandatoryStatus: "Complete",
    certs: 2,
    atRisk: false,
    actionLabel: "Assign",
  },
];

const MOCK_CATALOG = [
  {
    id: "c1",
    title: "AWS Cloud Architect",
    provider: "Amazon Web Services",
    duration: "12 hours",
    rating: 4.8,
    category: "Engineering",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    id: "c2",
    title: "React Performance Masterclass",
    provider: "Frontend Masters",
    duration: "8 hours",
    rating: 4.9,
    category: "Frontend",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: "c3",
    title: "Secure Coding Practices",
    provider: "NexusHR Infosec",
    duration: "3 hours",
    rating: 4.5,
    category: "Security",
    color: "from-rose-500 to-rose-700",
  },
  {
    id: "c4",
    title: "Engineering Leadership",
    provider: "Coursera",
    duration: "16 hours",
    rating: 4.7,
    category: "Leadership",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "c5",
    title: "Advanced Git & CI/CD",
    provider: "Pluralsight",
    duration: "6 hours",
    rating: 4.6,
    category: "DevOps",
    color: "from-teal-500 to-teal-700",
  },
  {
    id: "c6",
    title: "Data Privacy & GDPR",
    provider: "Internal Legal",
    duration: "2 hours",
    rating: 4.2,
    category: "Compliance",
    color: "from-amber-500 to-amber-700",
  },
];

const MOCK_ASSIGNMENTS = [
  {
    id: "a1",
    emp: "Arjun Mehta",
    course: "Advanced Git & CI/CD",
    assignedOn: "Apr 01, 2026",
    dueDate: "Apr 30, 2026",
    progress: 60,
    status: "In Progress",
  },
  {
    id: "a2",
    emp: "Dev Patel",
    course: "Secure Coding Practices",
    assignedOn: "Mar 15, 2026",
    dueDate: "Mar 31, 2026",
    progress: 20,
    status: "Overdue",
  },
  {
    id: "a3",
    emp: "Leo Martinez",
    course: "Data Privacy & GDPR",
    assignedOn: "Apr 10, 2026",
    dueDate: "Apr 25, 2026",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "a4",
    emp: "Sneha Rao",
    course: "AWS Cloud Architect",
    assignedOn: "Apr 05, 2026",
    dueDate: "May 15, 2026",
    progress: 100,
    status: "Completed",
  },
];

export function ManagerTeamTraining() {
  const [activeTab, setActiveTab] = useState<
    "My Team" | "Training Catalog" | "Assignments"
  >("My Team");
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Filters State
  const [catalogFilter, setCatalogFilter] = useState("All");
  const [assignmentSearch, setAssignmentSearch] = useState("");

  // Assign Modal State
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [priority, setPriority] = useState("Recommended");

  const toggleAssignee = (id: string) => {
    if (id === "all") {
      if (selectedAssignees.length === MOCK_MY_TEAM.length) {
        setSelectedAssignees([]);
      } else {
        setSelectedAssignees(MOCK_MY_TEAM.map((m) => m.id));
      }
      return;
    }
    if (selectedAssignees.includes(id)) {
      setSelectedAssignees(selectedAssignees.filter((a) => a !== id));
    } else {
      setSelectedAssignees([...selectedAssignees, id]);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("overdue") || status === "Overdue")
      return "text-red-600 bg-red-50 border-red-100";
    if (status.includes("complete") || status === "Completed")
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (status === "In Progress")
      return "text-teal-600 bg-teal-50 border-teal-100";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center shrink-0">
            <Book size={22} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight leading-none text-foreground">
              Team Training
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Manage skills, assign courses, and track compliance.
            </p>
          </div>
        </div>
        <button
          onClick={() => setAssignModalOpen(true)}
          className="px-4 py-2.5 text-sm font-bold rounded-xl text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Assign Training
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Mandatory Pending
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-red-500 leading-none">2</p>
            <p className="text-sm font-bold text-red-500/70 mb-0.5">overdue</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            In Progress
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-teal-600 leading-none">5</p>
            <p className="text-sm font-bold text-teal-600/70 mb-0.5">courses</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Completed This Month
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-emerald-600 leading-none">
              8
            </p>
            <p className="text-sm font-bold text-emerald-600/70 mb-0.5">
              finished
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Certifications
          </p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-purple-600 leading-none">
              12
            </p>
            <p className="text-sm font-bold text-purple-600/70 mb-0.5">
              active
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {(["My Team", "Training Catalog", "Assignments"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-t-lg"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00B87C] rounded-t-full" />
              )}
            </button>
          ),
        )}
      </div>

      {/* TAB CONTENT: MY TEAM */}
      {activeTab === "My Team" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-border">Employee</th>
                  <th className="px-6 py-4 border-b border-border">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-4 border-b border-border">
                    Completed
                  </th>
                  <th className="px-6 py-4 border-b border-border">
                    Mandatory Status
                  </th>
                  <th className="px-6 py-4 border-b border-border">
                    Certifications
                  </th>
                  <th className="px-6 py-4 border-b border-border text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_MY_TEAM.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#00B87C]/[0.08] transition-colors h-[64px] ${row.atRisk ? "border-l-[3px] border-l-red-500" : "border-l-[3px] border-l-transparent"}`}
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.avatar}
                          className="w-9 h-9 rounded-full border border-border"
                        />
                        <div>
                          <p className="text-sm font-bold text-foreground flex items-center gap-2">
                            {row.name}
                            {row.atRisk && (
                              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-bold uppercase tracking-wider rounded border border-red-200">
                                Training at risk
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            {row.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2 font-bold text-foreground">
                      {row.enrolledCourses}
                    </td>
                    <td className="px-6 py-2 text-muted-foreground font-semibold">
                      {row.completed} done
                    </td>
                    <td className="px-6 py-2">
                      <span
                        className={`px-2 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1 w-max ${getStatusColor(row.mandatoryStatus)}`}
                      >
                        {row.mandatoryStatus.includes("overdue") ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        {row.mandatoryStatus}
                      </span>
                    </td>
                    <td className="px-6 py-2 font-bold text-foreground flex items-center gap-1.5 mt-2">
                      <Award size={16} className="text-purple-500" />{" "}
                      {row.certs} certs
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedAssignees([row.id]);
                          setAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {row.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRAINING CATALOG */}
      {activeTab === "Training Catalog" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border shadow-sm">
            <div className="flex gap-2">
              {[
                "All",
                "Engineering",
                "Frontend",
                "Security",
                "DevOps",
                "Compliance",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogFilter(cat)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    catalogFilter === cat
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CATALOG.filter(
              (c) => catalogFilter === "All" || c.category === catalogFilter,
            ).map((course) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow flex flex-col"
              >
                <div
                  className={`h-24 bg-gradient-to-r ${course.color} p-4 flex flex-col justify-between shrink-0`}
                >
                  <span className="w-max px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider rounded">
                    {course.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground mb-4">
                    {course.provider}
                  </p>

                  <div className="flex items-center gap-4 mt-auto mb-5 text-xs font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-muted-foreground" />{" "}
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        className="text-amber-400"
                        fill="currentColor"
                      />{" "}
                      {course.rating}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCourseSearch(course.title);
                      setSelectedAssignees([]);
                      setAssignModalOpen(true);
                    }}
                    className="w-full py-2 bg-secondary text-foreground text-sm font-bold rounded-xl border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    Assign to Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ASSIGNMENTS */}
      {activeTab === "Assignments" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder="Search assignments..."
                value={assignmentSearch}
                onChange={(e) => setAssignmentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs font-semibold outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b border-border">
                      Employee
                    </th>
                    <th className="px-6 py-4 border-b border-border">Course</th>
                    <th className="px-6 py-4 border-b border-border">
                      Assigned On
                    </th>
                    <th className="px-6 py-4 border-b border-border">
                      Due Date
                    </th>
                    <th className="px-6 py-4 border-b border-border">
                      Progress
                    </th>
                    <th className="px-6 py-4 border-b border-border">Status</th>
                    <th className="px-6 py-4 border-b border-border text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_ASSIGNMENTS.filter((a) => {
                    const query = assignmentSearch.toLowerCase();
                    return (
                      a.emp.toLowerCase().includes(query) ||
                      a.course.toLowerCase().includes(query)
                    );
                  }).map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#00B87C]/[0.08] transition-colors h-[64px]"
                    >
                      <td className="px-6 py-2 font-bold text-foreground">
                        {row.emp}
                      </td>
                      <td className="px-6 py-2 font-semibold text-muted-foreground">
                        {row.course}
                      </td>
                      <td className="px-6 py-2 text-xs text-muted-foreground">
                        {row.assignedOn}
                      </td>
                      <td className="px-6 py-2 text-xs font-bold text-foreground">
                        {row.dueDate}
                      </td>
                      <td className="px-6 py-2">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span>{row.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.progress === 100 ? "bg-emerald-500" : "bg-primary"}`}
                              style={{ width: `${row.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border ${getStatusColor(row.status)}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-right">
                        <button
                          onClick={() =>
                            alert(
                              `Managing details for ${row.emp}'s assignment.`,
                            )
                          }
                          className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TRAINING MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[480px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center text-sky-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Assign Training to Team
                </h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-800 text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Select Course
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold outline-none focus:border-primary transition-colors"
                  />
                </div>
                {/* Simulated search results dropdown */}
                {courseSearch && (
                  <div className="mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden max-h-[120px] overflow-y-auto absolute z-10 w-[calc(100%-48px)]">
                    {MOCK_CATALOG.filter((c) =>
                      c.title
                        .toLowerCase()
                        .includes(courseSearch.toLowerCase()),
                    ).map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 hover:bg-secondary cursor-pointer border-b border-border last:border-0"
                        onClick={() => setCourseSearch(c.title)}
                      >
                        <p className="text-sm font-bold text-foreground">
                          {c.title}
                        </p>
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          {c.provider}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Assign To
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleAssignee("all")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                      selectedAssignees.length === MOCK_MY_TEAM.length
                        ? "bg-primary text-white border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:bg-neutral-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    All Team
                  </button>
                  {MOCK_MY_TEAM.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => toggleAssignee(emp.id)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                        selectedAssignees.includes(emp.id)
                          ? "bg-primary text-white border-primary"
                          : "bg-background text-foreground border-border hover:bg-secondary"
                      }`}
                    >
                      {emp.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Due Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-sm font-semibold outline-none focus:border-primary appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-background border border-border rounded-xl text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option>Optional</option>
                      <option>Recommended</option>
                      <option>Mandatory</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Note to Team (Optional)
                </label>
                <textarea
                  placeholder="Why this training is important..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary min-h-[80px] resize-none"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border bg-background rounded-xl hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedAssignees.length === 0) {
                    alert("Please select at least one team member.");
                    return;
                  }
                  alert(
                    "Successfully assigned training to selected team members!",
                  );
                  setAssignModalOpen(false);
                  setSelectedAssignees([]);
                  setCourseSearch("");
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Assign to Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
