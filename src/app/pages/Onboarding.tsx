import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  UserPlus,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Check,
  X,
  Download,
  AlertTriangle,
  Clock8,
  ChevronRight,
  ChevronLeft,
  Send,
  Upload,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  ArrowLeft,
  Briefcase,
  UserCheck,
  Circle,
  HelpCircle,
  Laptop,
  User,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─── Types ─── */
interface NewHire {
  id: string; initials: string; avatarColor: string; name: string; role: string; dept: string; deptColor: string; joiningDate: string; progress: number; progressColor: string; status: "on-track" | "delayed" | "at-risk" | "pre-joining" | "complete"; daysInOnboarding: number; expectedCompletion: string; manager: string;
}

interface PhaseTask { id: string; task: string; owner: string; dueDate: string; status: "done" | "pending" | "overdue" | "in-progress"; assignee: string; }
interface OnboardingPhase { id: string; name: string; status: "completed" | "in-progress" | "upcoming"; date: string; tasks: PhaseTask[]; }

interface DocumentItem { id: string; name: string; status: "uploaded" | "pending" | "missing" | "optional"; uploadedBy?: string; date?: string; }

interface Template { id: string; name: string; phases: number; tasks: number; dept: string; deptColor: string; avgDays: string; usageCount: number; }

/* ─── Helpers ─── */
const formatDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const initials = (name: string) => name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

const deptBadge = (dept: string, color: string) => (
  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider" style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
    {dept}
  </div>
);

const statusDot = (status: string) => {
  const map: Record<string, string> = { "on-track": "#00B87C", delayed: "#F59E0B", "at-risk": "#EF4444", "pre-joining": "#94A3B8", complete: "#00B87C" };
  return <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: map[status] || "#94A3B8" }} />;
};

const progressRing = (pct: number, size = 36, stroke = 3) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-muted/50" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#00B87C" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
};

/* ─── Mock Data ─── */
const NEW_HIRES: NewHire[] = [
  { id: "nh1", initials: "PS", avatarColor: "#00B87C", name: "Priya Sharma", role: "Frontend Developer", dept: "Engineering", deptColor: "#00B87C", joiningDate: "2026-04-08", progress: 45, progressColor: "#00B87C", status: "on-track", daysInOnboarding: 3, expectedCompletion: "Apr 22, 2026", manager: "Suresh Iyer" },
  { id: "nh2", initials: "DK", avatarColor: "#14B8A6", name: "Dev Kumar", role: "Backend Developer", dept: "Engineering", deptColor: "#00B87C", joiningDate: "2026-04-08", progress: 20, progressColor: "#00B87C", status: "on-track", daysInOnboarding: 3, expectedCompletion: "Apr 22, 2026", manager: "Suresh Iyer" },
  { id: "nh3", initials: "AK", avatarColor: "#8B5CF6", name: "Aisha Khan", role: "UX Designer", dept: "Design", deptColor: "#8B5CF6", joiningDate: "2026-04-01", progress: 78, progressColor: "#00B87C", status: "on-track", daysInOnboarding: 7, expectedCompletion: "Apr 15, 2026", manager: "Neha Joshi" },
  { id: "nh4", initials: "LM", avatarColor: "#F59E0B", name: "Leo Martinez", role: "Sales Manager", dept: "Sales", deptColor: "#F59E0B", joiningDate: "2026-03-28", progress: 60, progressColor: "#F59E0B", status: "delayed", daysInOnboarding: 11, expectedCompletion: "Apr 11, 2026", manager: "Vikram Mehta" },
  { id: "nh5", initials: "RC", avatarColor: "#EF4444", name: "Riya Chandra", role: "Finance Analyst", dept: "Finance", deptColor: "#0EA5E9", joiningDate: "2026-03-25", progress: 90, progressColor: "#00B87C", status: "on-track", daysInOnboarding: 14, expectedCompletion: "Apr 8, 2026", manager: "Deepa Iyer" },
  { id: "nh6", initials: "SM", avatarColor: "#00B87C", name: "Sanjay Mehta", role: "DevOps Engineer", dept: "Engineering", deptColor: "#00B87C", joiningDate: "2026-03-20", progress: 100, progressColor: "#00B87C", status: "complete", daysInOnboarding: 19, expectedCompletion: "Apr 3, 2026", manager: "Arun Nair" },
  { id: "nh7", initials: "TK", avatarColor: "#0EA5E9", name: "Tanya Kapoor", role: "Marketing Lead", dept: "Marketing", deptColor: "#EC4899", joiningDate: "2026-03-15", progress: 35, progressColor: "#EF4444", status: "at-risk", daysInOnboarding: 24, expectedCompletion: "Mar 29, 2026", manager: "Sneha Reddy" },
  { id: "nh8", initials: "PD", avatarColor: "#14B8A6", name: "Pranav Das", role: "Data Analyst", dept: "Analytics", deptColor: "#14B8A6", joiningDate: "2026-04-15", progress: 0, progressColor: "#94A3B8", status: "pre-joining", daysInOnboarding: 0, expectedCompletion: "Apr 29, 2026", manager: "Rajesh Kumar" },
];

const DEFAULT_PHASES_DATA: Record<string, OnboardingPhase[]> = {
  nh1: [
    { id: "p1", name: "Pre-Joining", status: "completed", date: "Apr 5, 2026", tasks: [
      { id: "t1", task: "Welcome email sent", owner: "HR", dueDate: "Apr 1", status: "done", assignee: "HR Team" },
      { id: "t2", task: "Offer letter signed", owner: "Employee", dueDate: "Apr 2", status: "done", assignee: "Priya Sharma" },
      { id: "t3", task: "Background verification completed", owner: "HR", dueDate: "Apr 3", status: "done", assignee: "HR Team" },
      { id: "t4", task: "Documents collected: Aadhar, PAN, Degree", owner: "HR", dueDate: "Apr 3", status: "done", assignee: "Priya Sharma" },
      { id: "t5", task: "IT equipment ordered: Dell XPS + iPhone", owner: "IT", dueDate: "Apr 4", status: "done", assignee: "IT Team" },
      { id: "t6", task: "Workspace/desk assigned: Zone B, Desk 14", owner: "Admin", dueDate: "Apr 4", status: "done", assignee: "Admin" },
    ]},
    { id: "p2", name: "Day 1", status: "in-progress", date: "Apr 8, 2026 — Today", tasks: [
      { id: "t7", task: "System credentials created", owner: "IT", dueDate: "Apr 7", status: "done", assignee: "IT Team" },
      { id: "t8", task: "Email account setup: priya@nexushr.com", owner: "IT", dueDate: "Apr 7", status: "done", assignee: "IT Team" },
      { id: "t9", task: "Laptop setup & configuration", owner: "IT", dueDate: "Apr 8", status: "in-progress", assignee: "IT Team" },
      { id: "t10", task: "Office tour", owner: "HR", dueDate: "Apr 8", status: "in-progress", assignee: "HR Team" },
      { id: "t11", task: "Access card issuance", owner: "Admin", dueDate: "Apr 8", status: "overdue", assignee: "Admin" },
      { id: "t12", task: "Welcome lunch arranged", owner: "HR", dueDate: "Apr 8", status: "pending", assignee: "HR Team" },
      { id: "t13", task: "Meet team", owner: "Manager", dueDate: "Apr 8", status: "pending", assignee: "Suresh Iyer" },
    ]},
    { id: "p3", name: "Week 1", status: "upcoming", date: "Apr 8–14, 2026", tasks: [
      { id: "t14", task: "Department orientation", owner: "HR", dueDate: "Apr 9", status: "pending", assignee: "HR Team" },
      { id: "t15", task: "System access setup — CRM, JIRA, GitHub", owner: "IT", dueDate: "Apr 9", status: "pending", assignee: "IT Team" },
      { id: "t16", task: "NDA & policy acknowledgment signing", owner: "HR", dueDate: "Apr 10", status: "pending", assignee: "Priya Sharma" },
      { id: "t17", task: "HR policy training (mandatory e-learning)", owner: "HR", dueDate: "Apr 11", status: "pending", assignee: "HR Team" },
      { id: "t18", task: "Initial 1:1 with manager", owner: "Manager", dueDate: "Apr 10", status: "pending", assignee: "Suresh Iyer" },
      { id: "t19", task: "Introduce to key stakeholders", owner: "Manager", dueDate: "Apr 11", status: "pending", assignee: "Suresh Iyer" },
      { id: "t20", task: "Health insurance enrollment", owner: "Finance", dueDate: "Apr 12", status: "pending", assignee: "Finance Team" },
      { id: "t21", task: "PF/ESI enrollment", owner: "Finance", dueDate: "Apr 14", status: "pending", assignee: "Finance Team" },
    ]},
    { id: "p4", name: "Month 1", status: "upcoming", date: "Apr 8 – May 8, 2026", tasks: [
      { id: "t22", task: "Role-specific technical training", owner: "Manager", dueDate: "Apr 22", status: "pending", assignee: "Suresh Iyer" },
      { id: "t23", task: "Company culture & values session", owner: "HR", dueDate: "Apr 15", status: "pending", assignee: "HR Team" },
      { id: "t24", task: "Complete all mandatory e-learning modules", owner: "HR", dueDate: "Apr 30", status: "pending", assignee: "Priya Sharma" },
      { id: "t25", task: "Set FY goals with manager", owner: "Manager", dueDate: "Apr 20", status: "pending", assignee: "Suresh Iyer" },
      { id: "t26", task: "First performance check-in", owner: "Manager", dueDate: "May 1", status: "pending", assignee: "Suresh Iyer" },
      { id: "t27", task: "Buddy/mentor program enrollment", owner: "HR", dueDate: "Apr 15", status: "pending", assignee: "HR Team" },
      { id: "t28", task: "30-day feedback form completion", owner: "HR", dueDate: "May 8", status: "pending", assignee: "Priya Sharma" },
    ]},
    { id: "p5", name: "Onboarding Complete", status: "upcoming", date: "", tasks: [] },
  ],
};

const DOCUMENTS_DATA: DocumentItem[] = [
  { id: "d1", name: "Aadhar Card", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 2" },
  { id: "d2", name: "PAN Card", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 2" },
  { id: "d3", name: "Degree Certificate", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 3" },
  { id: "d4", name: "Passport Photo", status: "pending" },
  { id: "d5", name: "Bank Account Details", status: "pending" },
  { id: "d6", name: "Experience Letter", status: "missing" },
  { id: "d7", name: "Medical Certificate", status: "optional" },
  { id: "d8", name: "NDA Signed Copy", status: "optional" },
];

const TEMPLATES: Template[] = [
  { id: "tpl1", name: "Engineering Onboarding", phases: 5, tasks: 28, dept: "Engineering", deptColor: "#00B87C", avgDays: "14 days", usageCount: 12 },
  { id: "tpl2", name: "Sales Onboarding", phases: 5, tasks: 22, dept: "Sales", deptColor: "#F59E0B", avgDays: "10 days", usageCount: 8 },
  { id: "tpl3", name: "Finance Onboarding", phases: 5, tasks: 25, dept: "Finance", deptColor: "#0EA5E9", avgDays: "12 days", usageCount: 6 },
  { id: "tpl4", name: "General Onboarding", phases: 4, tasks: 18, dept: "All Depts", deptColor: "#8B5CF6", avgDays: "10 days", usageCount: 24 },
  { id: "tpl5", name: "Intern Onboarding", phases: 3, tasks: 12, dept: "All Depts", deptColor: "#14B8A6", avgDays: "7 days", usageCount: 15 },
  { id: "tpl6", name: "Custom (blank)", phases: 0, tasks: 0, dept: "—", deptColor: "#6B7280", avgDays: "—", usageCount: 0 },
];

const employees = [
  { id: "e1", name: "Priya Sharma", role: "Frontend Developer", dept: "Engineering" },
  { id: "e2", name: "Dev Kumar", role: "Backend Developer", dept: "Engineering" },
  { id: "e3", name: "Aisha Khan", role: "UX Designer", dept: "Design" },
  { id: "e4", name: "Leo Martinez", role: "Sales Manager", dept: "Sales" },
  { id: "e5", name: "Riya Chandra", role: "Finance Analyst", dept: "Finance" },
  { id: "e6", name: "Sanjay Mehta", role: "DevOps Engineer", dept: "Engineering" },
  { id: "e7", name: "Tanya Kapoor", role: "Marketing Lead", dept: "Marketing" },
  { id: "e8", name: "Pranav Das", role: "Data Analyst", dept: "Analytics" },
  { id: "e9", name: "Suresh Iyer", role: "Engineering Manager", dept: "Engineering" },
  { id: "e10", name: "Neha Joshi", role: "Design Lead", dept: "Design" },
];

/* ─── Task Status Icon ─── */
const TaskStatusIcon = ({ status }: { status: string }) => {
  if (status === "done") return <CheckCircle2 size={16} className="text-[#00B87C] shrink-0" />;
  if (status === "in-progress") return <Clock size={16} className="text-[#F59E0B] shrink-0" />;
  if (status === "overdue") return <XCircle size={16} className="text-[#EF4444] shrink-0" />;
  return <Circle size={16} className="text-[#D1D5DB] shrink-0" />;
};

const XCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

/* ─── Main Component ─── */
export function Onboarding() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("nh1");
  const [activeTab, setActiveTab] = useState<"active" | "pre-joining" | "completed" | "templates">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPill, setFilterPill] = useState<"all" | "week" | "month">("all");
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhaseConfirm, setShowPhaseConfirm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [initiateStep, setInitiateStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState<string | null>(null);
  const [inlineTaskOpen, setInlineTaskOpen] = useState(false);

  const [phasesData, setPhasesData] = useState(DEFAULT_PHASES_DATA);
  const selected = NEW_HIRES.find(n => n.id === selectedId) || NEW_HIRES[0];
  const phases = phasesData[selectedId] || phasesData.nh1;
  const filteredList = NEW_HIRES.filter(n => {
    if (activeTab === "active") return n.status !== "pre-joining" && n.status !== "complete";
    if (activeTab === "pre-joining") return n.status === "pre-joining";
    if (activeTab === "completed") return n.status === "complete";
    return true;
  }).filter(n => {
    if (filterPill === "week") return n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12";
    if (filterPill === "month") return n.joiningDate >= "2026-04-01" && n.joiningDate <= "2026-04-30";
    return true;
  }).filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.role.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeCount = NEW_HIRES.filter(n => n.status !== "pre-joining" && n.status !== "complete").length;
  const preJoiningCount = NEW_HIRES.filter(n => n.status === "pre-joining").length;
  const completedCount = NEW_HIRES.filter(n => n.status === "complete").length;
  const overdueTasks = phases.flatMap(p => p.tasks).filter(t => t.status === "overdue").length;
  const pendingDocs = DOCUMENTS_DATA.filter(d => d.status === "pending" || d.status === "missing").length;
  const uploadedDocs = DOCUMENTS_DATA.filter(d => d.status === "uploaded").length;

  const handleMarkDone = (phaseId: string, taskId: string) => {
    const updated = { ...phasesData };
    const hirePhases = updated[selectedId];
    if (hirePhases) {
      const phase = hirePhases.find(p => p.id === phaseId);
      if (phase) {
        phase.tasks = phase.tasks.map(t => t.id === taskId ? { ...t, status: "done" as const } : t);
      }
    }
    setPhasesData(updated);
    showToast("Task Completed", "success", "Task marked as done.");
  };
  const handleSendReminder = () => {
    showToast("Reminder Sent", "success", "Reminder notification sent to IT Team.");
  };
  const handleEscalate = () => setShowEscalateModal(true);
  const handleRequestDoc = () => {
    showToast("Request Sent", "success", "Document request sent to employee.");
  };
  const handleUploadDoc = () => setShowUploadModal(true);
  const handleLaunchOnboarding = () => {
    showToast("Onboarding Launched", "success", `Onboarding launched for ${selected.name}!`);
    setShowInitiateModal(false);
    setInitiateStep(1);
  };
  const handleDownloadReport = () => {
    const content = `Onboarding Progress Report - ${selected.name}\nRole: ${selected.role}\nDepartment: ${selected.dept}\nJoining: ${formatDate(selected.joiningDate)}\nProgress: ${selected.progress}%\n\nPhases:\n${phases.map(p => `${p.name} (${p.status}) - ${p.tasks.filter(t => t.status === 'done').length}/${p.tasks.length} tasks`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `Onboarding_${selected.name.replace(" ", "_")}.txt`; a.click();
    showToast("Report Downloaded", "success", "Onboarding progress report downloaded.");
  };
  const handleMarkPhaseComplete = () => setShowPhaseConfirm(true);
  const confirmPhaseComplete = () => {
    const updated = { ...phasesData };
    const hirePhases = updated[selectedId];
    if (hirePhases) {
      const idx = hirePhases.findIndex(p => p.status === "in-progress");
      if (idx !== -1) {
        hirePhases[idx] = { ...hirePhases[idx], status: "completed" };
        if (idx + 1 < hirePhases.length) {
          hirePhases[idx + 1] = { ...hirePhases[idx + 1], status: "in-progress" };
        }
      }
    }
    setPhasesData(updated);
    showToast("Phase Completed", "success", "Phase marked as complete.");
    setShowPhaseConfirm(false);
  };
  const confirmEscalate = () => {
    showToast("Escalated", "warning", "Issue has been escalated to Admin.");
    setShowEscalateModal(false);
  };
  const handleDuplicateTemplate = (id: string) => {
    showToast("Template Duplicated", "success", "Template duplicated successfully.");
    setShowTemplateMenu(null);
  };
  const handleDeleteTemplate = (_id: string) => {
    showToast("Template Deleted", "success", "Template deleted.");
    setShowTemplateMenu(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all shrink-0">
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] flex items-center justify-center border border-[#00B87C]/20">
            <UserPlus size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">Onboarding</h1>
            <p className="text-[13px] font-semibold text-muted-foreground">Manage new hire onboarding journeys</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTemplatesPanel(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all">
            <FileText size={16} /> Templates
          </button>
          <button onClick={() => { setShowInitiateModal(true); setInitiateStep(1); setSelectedTemplate(null); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20">
            <Plus size={16} /> New Onboarding
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-5 px-5 py-3 rounded-2xl bg-[#00B87C]/[0.06] border border-[#00B87C]/15">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#00B87C]"><span className="w-2 h-2 rounded-full bg-[#00B87C]" /> {activeCount} new hires currently onboarding</div>
        <div className="w-px h-4 bg-[#00B87C]/20" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#F59E0B]"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {overdueTasks} tasks overdue across active onboardings</div>
        <div className="w-px h-4 bg-[#00B87C]/20" />
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#14B8A6]"><span className="w-2 h-2 rounded-full bg-[#14B8A6]" /> {NEW_HIRES.filter(n => n.joiningDate >= "2026-04-06" && n.joiningDate <= "2026-04-12").length} new hires joining this week</div>
      </div>

      {/* KPI CARDS (6) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: UserPlus, bg: "#DCFCE7", iconColor: "#00B87C", label: "Active Onboardings", value: `${activeCount}`, valColor: "text-[#00B87C]", sub: "in progress right now" },
          { icon: CheckCircle2, bg: "#DCFCE7", iconColor: "#00B87C", label: "Completed This Month", value: `${completedCount}`, valColor: "text-[#00B87C]", sub: "fully onboarded" },
          { icon: Clock, bg: "#FEF3C7", iconColor: "#F59E0B", label: "Tasks Overdue", value: `${overdueTasks}`, valColor: "text-[#F59E0B]", sub: "across all onboardings" },
          { icon: Calendar, bg: "#E0F2FE", iconColor: "#0EA5E9", label: "Joining This Week", value: "2", valColor: "text-[#0EA5E9]", sub: "Priya + Dev — Apr 8" },
          { icon: FileText, bg: "#EDE9FE", iconColor: "#8B5CF6", label: "Pending Documents", value: `${pendingDocs}`, valColor: "text-[#8B5CF6]", sub: "not yet uploaded" },
          { icon: Clock8, bg: "#F3F4F6", iconColor: "#6B7280", label: "Avg Completion Time", value: "14d", valColor: "text-[#6B7280]", sub: "from joining to complete" },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C]/50 hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[1.5px]">{card.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}><card.icon size={16} style={{ color: card.iconColor }} /></div>
            </div>
            <h3 className={`text-lg font-black tracking-tighter ${card.valColor}`}>{card.value}</h3>
            <p className="text-[9px] font-bold text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
        {[
          { key: "active", label: "Active", count: activeCount },
          { key: "pre-joining", label: "Pre-Joining", count: preJoiningCount },
          { key: "completed", label: "Completed", count: completedCount },
          { key: "templates", label: "Templates", count: TEMPLATES.length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-6 py-4 text-[13px] font-semibold tracking-wider uppercase transition-all relative whitespace-nowrap ${activeTab === tab.key ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label} ({tab.count})
            {activeTab === tab.key && <motion.div layoutId="onboardingTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]" />}
          </button>
        ))}
      </div>

      {/* MAIN 2-COLUMN LAYOUT */}
      <AnimatePresence mode="wait">
        {activeTab === "templates" ? (
          <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-black text-foreground tracking-tight uppercase">Onboarding Templates</h3>
              <button onClick={() => { setShowTemplateEditor(true); setEditingTemplate(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">+ Create Template</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map(tpl => (
                <div key={tpl.id} className="relative p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-[14px] font-bold text-foreground">{tpl.name}</h4>
                    <div className="relative">
                      <button onClick={() => setShowTemplateMenu(showTemplateMenu === tpl.id ? null : tpl.id)} className="p-1 hover:bg-muted rounded-lg transition-all"><MoreVertical size={16} className="text-muted-foreground" /></button>
                      {showTemplateMenu === tpl.id && (
                        <div className="absolute right-0 top-8 w-40 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                          {[
                            { icon: Edit3, label: "Edit", action: () => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); setShowTemplateMenu(null); } },
                            { icon: Copy, label: "Duplicate", action: () => handleDuplicateTemplate(tpl.id) },
                            { icon: Trash2, label: "Delete", action: () => handleDeleteTemplate(tpl.id) },
                          ].map((item, i) => (
                            <button key={i} onClick={item.action} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-foreground hover:bg-muted flex items-center gap-2 transition-all"><item.icon size={14} />{item.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-[11px] font-bold text-muted-foreground">
                    <span>{tpl.phases} phases</span><span className="w-1 h-1 rounded-full bg-muted-foreground/40" /><span>{tpl.tasks} tasks</span><span className="w-1 h-1 rounded-full bg-muted-foreground/40" /><span>Avg {tpl.avgDays}</span>
                  </div>
                  <div className="mb-3">{deptBadge(tpl.dept, tpl.deptColor)}</div>
                  <p className="text-[11px] font-bold text-muted-foreground mb-4">Used for {tpl.usageCount} employees</p>
                  <button onClick={() => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); }} className="w-full py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all">Edit Template</button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN — New Hire List */}
            <div className="w-full lg:w-[35%] bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-340px)] flex flex-col">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Active Onboardings</h3>
                  <span className="text-[11px] font-bold text-muted-foreground">{filteredList.length} employees</span>
                </div>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Search new hires..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 text-foreground text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  {[{ key: "all", label: "All" }, { key: "week", label: "This Week" }, { key: "month", label: "This Month" }].map(p => (
                    <button key={p.key} onClick={() => setFilterPill(p.key as typeof filterPill)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${filterPill === p.key ? "bg-[#00B87C] text-white" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {filteredList.map(nh => (
                  <div key={nh.id} onClick={() => setSelectedId(nh.id)} className={`flex items-center gap-3 px-5 py-[14px] cursor-pointer transition-all hover:bg-[#00B87C]/[0.08] ${selectedId === nh.id ? "bg-[#00B87C]/[0.08] border-l-[3px] border-[#00B87C]" : "border-l-[3px] border-transparent"}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0" style={{ backgroundColor: nh.avatarColor }}>{nh.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{nh.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{nh.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={10} className="text-muted-foreground shrink-0" />
                        <span className="text-[11px] text-muted-foreground">Joining: {formatDate(nh.joiningDate)}</span>
                        {deptBadge(nh.dept, nh.deptColor)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {progressRing(nh.progress, 32, 3)}
                      {statusDot(nh.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — Journey Detail */}
            <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-y-auto h-[calc(100vh-340px)]">
              {/* Employee Header */}
              <div className="px-6 py-5 border-b border-border flex flex-wrap items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black shrink-0" style={{ backgroundColor: selected.avatarColor }}>{selected.initials}</div>
                <div className="flex-1">
                  <h2 className="text-[20px] font-black text-foreground">{selected.name}</h2>
                  <p className="text-[14px] font-bold text-[#00B87C]">{selected.role} — {selected.dept}</p>
                  <div className="flex items-center gap-4 mt-1 text-[12px] font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Joining: {formatDate(selected.joiningDate)}</span>
                    <span className="flex items-center gap-1"><User size={12} /> Manager: {selected.manager}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3 py-1.5 rounded-full bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"><Calendar size={12} /> Day {selected.daysInOnboarding} of Onboarding</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-3 border-b border-border flex items-center gap-4">
                <div className="flex-1 h-[6px] bg-muted/50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${selected.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: selected.progressColor }} />
                </div>
                <span className="text-[13px] font-black" style={{ color: selected.progressColor }}>{selected.progress}% Complete</span>
                <span className="text-[11px] font-bold text-muted-foreground">Expected completion: {selected.expectedCompletion}</span>
              </div>

              {/* Onboarding Phases */}
              <div className="px-6 py-5 space-y-0">
                {phases.map((phase, pi) => (
                  <div key={phase.id} className="relative">
                    {/* Connector line */}
                    {pi < phases.length - 1 && (
                      <div className={`absolute left-[15px] top-10 bottom-0 w-[2px] ${phase.status === "completed" ? "bg-[#00B87C]" : "bg-border dashed"}`} style={phase.status !== "completed" ? { backgroundImage: "repeating-linear-gradient(to bottom, hsl(var(--border)) 0, hsl(var(--border)) 4px, transparent 4px, transparent 8px)" } : {}} />
                    )}
                    <div className="relative pb-6">
                      {/* Phase Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 border-2 ${phase.status === "completed" ? "bg-[#00B87C] border-[#00B87C]" : phase.status === "in-progress" ? "border-[#14B8A6] bg-card" : "border-muted-foreground/30 bg-card"}`}>
                          {phase.status === "completed" ? <Check size={14} className="text-white" /> : phase.status === "in-progress" ? <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" /> : <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className={`text-[14px] font-black ${phase.status === "completed" ? "text-[#00B87C]" : phase.status === "in-progress" ? "text-[#14B8A6]" : "text-muted-foreground"}`}>{phase.name}</h4>
                            {phase.date && <span className="text-[11px] font-semibold text-muted-foreground">{phase.date}</span>}
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider ${phase.status === "completed" ? "bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20" : phase.status === "in-progress" ? "bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                          {phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? "In Progress" : "Upcoming"}
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="ml-[45px] space-y-1">
                        {phase.tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/30 transition-all group">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <TaskStatusIcon status={task.status} />
                              <div className="min-w-0 flex-1">
                                <span className={`text-[12px] font-bold ${task.status === "overdue" ? "text-[#EF4444]" : task.status === "done" ? "text-foreground line-through opacity-60" : "text-foreground"}`}>{task.task}</span>
                                <span className="text-[11px] font-semibold text-muted-foreground ml-2">({task.assignee})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              {task.owner === "IT" && task.status === "in-progress" && <button onClick={handleSendReminder} className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider hover:underline">Send Reminder</button>}
                              {task.owner === "HR" && task.status === "in-progress" && <button onClick={() => handleMarkDone(phase.id, task.id)} className="px-2 py-1 rounded-lg border border-border text-[9px] font-black uppercase tracking-wider hover:bg-muted transition-all">Mark Done</button>}
                              {task.status === "overdue" && <button onClick={handleEscalate} className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">Escalate</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents Section */}
              <div className="mx-6 mb-5 p-5 bg-muted/20 border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Required Documents</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-[6px] w-24 bg-muted/50 rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${(uploadedDocs / DOCUMENTS_DATA.length) * 100}%` }} /></div>
                    <span className="text-[11px] font-bold text-muted-foreground">{uploadedDocs} / {DOCUMENTS_DATA.length} uploaded</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-2 pr-4">Document</th><th className="pb-2 pr-4">Status</th><th className="pb-2 pr-4">Uploaded By</th><th className="pb-2 pr-4">Date</th><th className="pb-2 text-right">Action</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/50">
                      {DOCUMENTS_DATA.map(doc => (
                        <tr key={doc.id} className="text-[12px]">
                          <td className="py-2.5 pr-4 font-bold text-foreground">{doc.name}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${doc.status === "uploaded" ? "text-[#00B87C]" : doc.status === "pending" ? "text-[#F59E0B]" : doc.status === "missing" ? "text-[#EF4444]" : "text-muted-foreground"}`}>
                              {doc.status === "uploaded" ? <CheckCircle2 size={12} /> : doc.status === "pending" ? <Clock size={12} /> : doc.status === "missing" ? <XCircle size={12} /> : <HelpCircle size={12} />}
                              {doc.status === "uploaded" ? "Uploaded" : doc.status === "pending" ? "Pending" : doc.status === "missing" ? "Missing" : "Optional"}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{doc.uploadedBy || "—"}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{doc.date || "—"}</td>
                          <td className="py-2.5 text-right">
                            {doc.status === "uploaded" ? <button className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider hover:underline">View</button> : doc.status === "pending" ? <button onClick={handleRequestDoc} className="text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider hover:underline">Request</button> : doc.status === "missing" ? <button onClick={handleUploadDoc} className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">Upload</button> : <span className="text-muted-foreground">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleUploadDoc} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:border-[#00B87C]/50 hover:text-[#00B87C] transition-all"><Upload size={14} /> Upload Document for Employee</button>
              </div>

              {/* Task Actions Toolbar */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
                <button onClick={() => setInlineTaskOpen(!inlineTaskOpen)} className="text-[12px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1.5 hover:underline"><Plus size={14} /> Add Task</button>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowReminderModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"><Send size={14} /> Send Reminder</button>
                  <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"><Download size={14} /> Download Report</button>
                  <button onClick={handleMarkPhaseComplete} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"><CheckCircle2 size={14} /> Mark Phase Complete</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── INITIATE ONBOARDING MODAL ─── */}
      <AnimatePresence>{showInitiateModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInitiateModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-[520px] max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 flex items-center justify-center"><UserPlus size={20} className="text-[#00B87C]" /></div>
                <div><h2 className="text-lg font-black text-foreground tracking-tight">Initiate New Onboarding</h2><p className="text-[12px] font-semibold text-muted-foreground">Start the onboarding journey for a new hire</p></div>
              </div>
              <button onClick={() => setShowInitiateModal(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} className="text-muted-foreground" /></button>
            </div>
            {/* Step dots */}
            <div className="px-8 py-3 border-b border-border flex items-center gap-2">
              {[1, 2, 3].map(s => <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all ${initiateStep >= s ? "bg-[#00B87C]" : "bg-border"}`} />)}
              <span className="ml-auto text-[11px] font-bold text-muted-foreground">Step {initiateStep} of 3</span>
            </div>

            {initiateStep === 1 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Employee Details</h3>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Select Employee</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search from active employees or new hire records..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {employees.slice(0, 5).map(emp => (
                      <button key={emp.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-left">
                        <div className="w-7 h-7 rounded-full bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] text-[9px] font-black">{initials(emp.name)}</div>
                        <div><p className="text-[12px] font-bold text-foreground">{emp.name}</p><p className="text-[11px] text-muted-foreground">{emp.role} · {emp.dept}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Joining Date</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                  <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Department</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"><option>Engineering</option><option>Sales</option><option>Finance</option><option>Marketing</option><option>Design</option></select></div>
                </div>
                <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Designation</label><input type="text" placeholder="e.g. Senior Frontend Developer" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Reporting Manager</label>
                  <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search employee..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Employment Type</label>
                  <div className="flex gap-2">{
                    ["Full-time", "Part-time", "Contract", "Intern"].map(t => (
                      <button key={t} className="px-4 py-2 rounded-xl border border-border text-[11px] font-black uppercase tracking-wider transition-all hover:bg-[#00B87C] hover:text-white hover:border-[#00B87C]">{t}</button>
                    ))
                  }</div>
                </div>
              </div>
            )}

            {initiateStep === 2 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Select Onboarding Template</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {TEMPLATES.map(tpl => (
                    <div key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTemplate === tpl.id ? "border-[#00B87C]" : "border-border hover:border-[#00B87C]/40"}`}>
                      <div className="flex items-start justify-between">
                        <div><h4 className="text-[13px] font-bold text-foreground">{tpl.name}</h4><p className="text-[11px] text-muted-foreground">{tpl.phases} phases, {tpl.tasks} tasks</p></div>
                        <div className="flex items-center gap-2">
                          {deptBadge(tpl.dept, tpl.deptColor)}
                          {selectedTemplate === tpl.id && <CheckCircle2 size={16} className="text-[#00B87C]" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-muted-foreground"><Clock size={12} /> Avg {tpl.avgDays}<span className="w-1 h-1 rounded-full bg-muted-foreground/40" />Used {tpl.usageCount} times</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {initiateStep === 3 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Team Assignments</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Assigned HR Owner", icon: UserCheck },
                    { label: "Buddy / Mentor", icon: Star },
                    { label: "IT Contact", icon: Laptop },
                    { label: "Finance Contact", icon: Briefcase },
                  ].map(field => (
                    <div key={field.label}><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{field.label}</label>
                      <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Notifications</label>
                  <div className="space-y-2">
                    {["Send welcome email to employee", "Notify reporting manager", "Notify IT team for equipment", "Notify Finance for enrollment"].map(n => (
                      <label key={n} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border accent-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">{n}</span></label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-border accent-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">Notify all department heads</span></label>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-4 border-t border-border flex items-center justify-between">
              <button onClick={() => setShowInitiateModal(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <div className="flex items-center gap-3">
                {initiateStep > 1 && <button onClick={() => setInitiateStep(s => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all"><ChevronLeft size={14} /> Back</button>}
                {initiateStep < 3 ? (
                  <button onClick={() => setInitiateStep(s => s + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Next <ChevronRight size={14} /></button>
                ) : (
                  <button onClick={handleLaunchOnboarding} className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20">Launch Onboarding</button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── TEMPLATES SLIDE PANEL ─── */}
      <AnimatePresence>{showTemplatesPanel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowTemplatesPanel(false)}>
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} onClick={e => e.stopPropagation()} className="absolute right-0 top-0 bottom-0 w-full max-w-[480px] bg-card border-l border-border shadow-2xl overflow-y-auto">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#00B87C]" />
                <h2 className="text-lg font-black text-foreground">Onboarding Templates</h2>
              </div>
              <button onClick={() => setShowTemplatesPanel(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={() => { setShowTemplatesPanel(false); setShowTemplateEditor(true); setEditingTemplate(null); }} className="w-full py-3 rounded-xl bg-[#00B87C] text-white text-[12px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">+ Create Template</button>
              {TEMPLATES.map(tpl => (
                <div key={tpl.id} className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-[14px] font-bold text-foreground">{tpl.name}</h4>
                    <div className="flex items-center gap-2">
                      {deptBadge(tpl.dept, tpl.deptColor)}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${tpl.avgDays !== "—" ? "bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20" : "bg-muted/50 text-muted-foreground border border-border"}`}>{tpl.avgDays !== "—" ? "Active" : "Draft"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground mb-3">
                    <span>{tpl.phases} phases</span><span className="w-1 h-1 rounded-full bg-muted-foreground/40" /><span>{tpl.tasks} tasks</span><span className="w-1 h-1 rounded-full bg-muted-foreground/40" />Avg {tpl.avgDays}
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground mb-3">Used for {tpl.usageCount} employees</p>
                  <button onClick={() => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); setShowTemplatesPanel(false); }} className="w-full py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all">Edit Template</button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── ESCALATION MODAL ─── */}
      <AnimatePresence>{showEscalateModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEscalateModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center"><AlertTriangle size={24} className="text-[#EF4444]" /></div>
              <div><h2 className="text-lg font-black text-foreground">Escalate Issue</h2><p className="text-[12px] text-muted-foreground">This will notify the admin about the overdue task.</p></div>
            </div>
            <textarea className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#EF4444]/20 transition-all resize-none" rows={3} placeholder="Reason for escalation..." />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setShowEscalateModal(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={confirmEscalate} className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Confirm Escalation</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── PHASE COMPLETE CONFIRMATION ─── */}
      <AnimatePresence>{showPhaseConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPhaseConfirm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center"><CheckCircle2 size={24} className="text-[#00B87C]" /></div>
              <div><h2 className="text-lg font-black text-foreground">Mark Phase Complete</h2><p className="text-[12px] text-muted-foreground">Are you sure this phase is fully complete?</p></div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setShowPhaseConfirm(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={confirmPhaseComplete} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── UPLOAD DOCUMENT MODAL ─── */}
      <AnimatePresence>{showUploadModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center"><Upload size={20} className="text-[#8B5CF6]" /></div><h2 className="text-lg font-black text-foreground">Upload Document</h2></div>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-lg hover:bg-muted transition-all flex items-center justify-center"><X size={16} className="text-muted-foreground" /></button>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-[#8B5CF6]/40 transition-all cursor-pointer">
              <Upload size={32} className="mx-auto text-muted-foreground/60 mb-3" />
              <p className="text-[13px] font-bold text-foreground">Drop files here or click to browse</p>
              <p className="text-[11px] text-muted-foreground mt-1">PDF, JPG, PNG — Max 10MB</p>
            </div>
            <div className="mt-4"><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Document Type</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"><option>Experience Letter</option><option>Bank Account Details</option><option>Passport Photo</option><option>Other</option></select></div>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={() => { showToast("Uploaded", "success", "Document uploaded successfully."); setShowUploadModal(false); }} className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Upload</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── REMINDER MODAL ─── */}
      <AnimatePresence>{showReminderModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReminderModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center"><Send size={20} className="text-[#0EA5E9]" /></div><h2 className="text-lg font-black text-foreground">Send Reminder</h2></div>
            <div className="space-y-3 mb-5">
              <p className="text-[12px] font-bold text-muted-foreground">Pending tasks for <span className="text-foreground">{selected.name}</span>:</p>
              {phases.flatMap(p => p.tasks).filter(t => t.status !== "done").slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30"><Clock size={12} className="text-[#F59E0B]" /><span className="text-[12px] font-bold text-foreground">{task.task}</span><span className="ml-auto text-[11px] text-muted-foreground">({task.assignee})</span></div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowReminderModal(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={() => { showToast("Reminder Sent", "success", `Reminder sent to ${selected.name}'s pending task owners.`); setShowReminderModal(false); }} className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Send Reminder</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── TEMPLATE EDITOR MODAL ─── */}
      <AnimatePresence>{showTemplateEditor && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowTemplateEditor(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground">{editingTemplate ? "Edit Template" : "Create New Template"}</h2>
              <button onClick={() => setShowTemplateEditor(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Template Name</label><input type="text" placeholder="e.g. Engineering Onboarding" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Department</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"><option>All Departments</option><option>Engineering</option><option>Sales</option><option>Finance</option></select></div>
                <div><label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"><option>Draft</option><option>Published</option></select></div>
              </div>
              <div><h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Phases & Tasks</h4>
                <div className="space-y-3">
                  {["Pre-Joining", "Day 1", "Week 1", "Month 1", "Completion"].map((phase, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-border bg-muted/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><span className="text-[12px] font-black text-foreground">{phase}</span><span className="text-[11px] text-muted-foreground">({[6, 7, 8, 7, 0][i]} tasks)</span></div>
                        <button className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">Remove</button>
                      </div>
                      <div className="space-y-1.5">{["Welcome email", "Offer letter", "Background check"].slice(0, 3).map((t, j) => (
                        <div key={j} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border"><Edit3 size={12} className="text-muted-foreground shrink-0" /><span className="text-[11px] font-bold text-foreground flex-1">{t}</span><select className="text-[9px] border-none bg-transparent font-bold text-muted-foreground outline-none"><option>HR</option><option>IT</option><option>Manager</option><option>Finance</option></select></div>
                      ))}</div>
                      <button className="mt-2 text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider flex items-center gap-1 hover:underline"><Plus size={12} /> Add Task</button>
                    </div>
                  ))}
                  <button className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:border-[#00B87C]/50 hover:text-[#00B87C] transition-all"><Plus size={14} className="inline mr-1" /> Add Phase</button>
                </div>
              </div>
            </div>
            <div className="px-8 py-4 border-t border-border flex items-center justify-between">
              <button onClick={() => setShowTemplateEditor(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <div className="flex items-center gap-3">
                <button onClick={() => { showToast("Saved as Draft", "success"); setShowTemplateEditor(false); }} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Save as Draft</button>
                <button onClick={() => { showToast("Template Published", "success", "Onboarding template has been published."); setShowTemplateEditor(false); }} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Publish</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* Inline Task Form */}
      {inlineTaskOpen && (
        <div className="fixed bottom-24 right-8 w-80 bg-card border border-border rounded-2xl shadow-2xl p-4 z-40">
          <div className="flex items-center justify-between mb-3"><h4 className="text-[12px] font-black text-foreground uppercase tracking-wider">Add Task</h4><button onClick={() => setInlineTaskOpen(false)}><X size={16} className="text-muted-foreground" /></button></div>
          <input type="text" placeholder="Task description..." className="w-full px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all mb-2" />
          <div className="flex items-center gap-2 mb-3">
            <select className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none"><option>HR</option><option>IT</option><option>Manager</option><option>Finance</option></select>
            <input type="date" className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none" />
          </div>
          <button onClick={() => { showToast("Task Added", "success", "New task has been added to the phase."); setInlineTaskOpen(false); }} className="w-full py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all">Add Task</button>
        </div>
      )}

      {/* Click-away overlay for template menu */}
      {showTemplateMenu && <div className="fixed inset-0 z-10" onClick={() => setShowTemplateMenu(null)} />}
    </div>
  );
}
