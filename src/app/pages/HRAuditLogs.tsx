import { useState, useRef, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  RotateCcw,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ShieldAlert,
  Globe,
  Flag,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Ban,
  Info,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
type Severity = "critical" | "warning" | "info";
type ActionType = "APPROVE" | "DELETE" | "UPDATE" | "EXPORT" | "CREATE" | "VIEW" | "REJECT" | "SUBMIT";
type ModuleType = "Employees" | "Leave" | "Attendance" | "Recruitment" | "Performance" | "Training" | "Onboarding" | "Documents" | "HR Settings";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: ActionType;
  module: ModuleType;
  record: string;
  ip: string;
  device: string;
  severity: Severity;
  isFlagged?: boolean;
  oldValue?: string;
  newValue?: string;
  sessionEvents?: { timestamp: string; action: string; module: string }[];
}

/* ─── Mock Data (HR-scoped only) ─── */
const LOGS: AuditLogEntry[] = [
  { id: "h1", timestamp: "Today 11:02 AM", user: "Suresh Iyer", userRole: "HR Manager", action: "UPDATE", module: "Employees", record: "Employee #EMP-021 profile updated — Priya Sharma", ip: "10.0.0.12", device: "Chrome/Windows", severity: "info" },
  { id: "h2", timestamp: "Today 10:48 AM", user: "Meera Thomas", userRole: "HR Manager", action: "APPROVE", module: "Leave", record: "Leave #LV-0895 approved for Amit Verma (Apr 15–17)", ip: "10.0.0.12", device: "Chrome/Mac", severity: "info" },
  { id: "h3", timestamp: "Today 10:30 AM", user: "Unknown", userRole: "—", action: "DELETE", module: "Employees", record: "Draft employee record DEL-024 deleted", ip: "192.168.1.45", device: "Chrome/Windows", severity: "critical", isFlagged: true },
  { id: "h4", timestamp: "Today 10:12 AM", user: "Priya Sharma", userRole: "HR Executive", action: "UPDATE", module: "Attendance", record: "Attendance regularization submitted for Mar 28", ip: "10.0.0.15", device: "Firefox/Linux", severity: "info" },
  { id: "h5", timestamp: "Today 9:55 AM", user: "Meera Thomas", userRole: "HR Manager", action: "CREATE", module: "Recruitment", record: "Job requisition #REQ-042 created — Senior Developer", ip: "10.0.0.12", device: "Chrome/Mac", severity: "info" },
  { id: "h6", timestamp: "Today 9:30 AM", user: "Suresh Iyer", userRole: "HR Manager", action: "SUBMIT", module: "Performance", record: "Performance review Q1 submitted for James Carter", ip: "10.0.0.12", device: "Chrome/Windows", severity: "info" },
  { id: "h7", timestamp: "Today 9:15 AM", user: "Ravi Kumar", userRole: "Manager", action: "APPROVE", module: "Leave", record: "Leave #LV-0891 approved for Neha Singh", ip: "10.0.0.22", device: "Safari/Mac", severity: "info" },
  { id: "h8", timestamp: "Apr 5 4:20 PM", user: "Meera Thomas", userRole: "HR Manager", action: "EXPORT", module: "Recruitment", record: "Candidate shortlist exported — 28 candidates", ip: "10.0.0.12", device: "Chrome/Mac", severity: "warning", isFlagged: true },
  { id: "h9", timestamp: "Apr 5 2:30 PM", user: "Suresh Iyer", userRole: "HR Manager", action: "UPDATE", module: "HR Settings", record: "Leave policy updated — sick leave max increased to 15 days", ip: "10.0.0.12", device: "Chrome/Windows", severity: "info", oldValue: "Sick leave max: 12 days", newValue: "Sick leave max: 15 days" },
  { id: "h10", timestamp: "Apr 5 11:00 AM", user: "Ananya Das", userRole: "Recruiter", action: "UPDATE", module: "Recruitment", record: "Candidate status changed — John Doe → Interview Scheduled", ip: "10.0.0.18", device: "Firefox/Linux", severity: "info" },
  { id: "h11", timestamp: "Apr 4 5:15 PM", user: "Meera Thomas", userRole: "HR Manager", action: "CREATE", module: "Onboarding", record: "Onboarding plan created for new hire EMP-056", ip: "10.0.0.12", device: "Chrome/Mac", severity: "info" },
  { id: "h12", timestamp: "Apr 4 3:00 PM", user: "Suresh Iyer", userRole: "HR Manager", action: "APPROVE", module: "Training", record: "Training request #TR-023 approved — AWS Certification", ip: "10.0.0.12", device: "Chrome/Windows", severity: "info" },
  { id: "h13", timestamp: "Apr 4 1:45 PM", user: "Priya Sharma", userRole: "HR Executive", action: "UPDATE", module: "Documents", record: "Document uploaded — EMP-021 Offer Letter signed", ip: "10.0.0.15", device: "Firefox/Linux", severity: "info" },
  { id: "h14", timestamp: "Apr 4 10:20 AM", user: "Unknown", userRole: "—", action: "VIEW", module: "Employees", record: "14 employee records bulk viewed from external IP", ip: "203.45.67.12", device: "Chrome/Windows", severity: "warning", isFlagged: true },
];

const PAGE_SIZE = 8;

/* ─── Helpers ─── */
const initials = (name: string) => name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

/* ─── Severity Config ─── */
const SEV_CONFIG: Record<Severity, { label: string; icon: string; chip: string }> = {
  critical: { label: "Critical", icon: "🔴", chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  warning: { label: "Warning", icon: "⚠", chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  info: { label: "Info", icon: "ℹ", chip: "bg-[#F0FDF4] text-[#00B87C] border-[#A7F3D0]" },
};

const ACTION_CONFIG: Record<ActionType, { chip: string }> = {
  APPROVE: { chip: "bg-[#F0FDF4] text-[#00B87C] border-[#A7F3D0]" },
  DELETE: { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  UPDATE: { chip: "bg-[#E0F2FE] text-[#0EA5E9] border-[#BAE6FD]" },
  EXPORT: { chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  CREATE: { chip: "bg-[#DCFCE7] text-[#00B87C] border-[#A7F3D0]" },
  VIEW: { chip: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  REJECT: { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  SUBMIT: { chip: "bg-[#EDE9FE] text-[#8B5CF6] border-[#DDD6FE]" },
};

const ALL_MODULES: ModuleType[] = ["Employees", "Leave", "Attendance", "Recruitment", "Performance", "Training", "Onboarding", "Documents", "HR Settings"];
const ALL_ACTIONS: ActionType[] = ["APPROVE", "DELETE", "UPDATE", "EXPORT", "CREATE", "VIEW", "REJECT", "SUBMIT"];
const ALL_USERS = [...new Set(LOGS.map(l => l.user))];
const DATE_OPTIONS = ["Today", "Last 7 Days", "Last 30 Days", "All Time"];
const SEVERITY_OPTIONS: Severity[] = ["critical", "warning", "info"];

/* ─── KPI Card ─── */
function KPICard({ title, value, sub, color, icon: Icon }: { title: string; value: string; sub: string; color: "green" | "red" | "teal" | "amber"; icon: React.ElementType }) {
  const colors = { green: { text: "#00B87C", bg: "#DCFCE7" }, red: { text: "#EF4444", bg: "#FEE2E2" }, teal: { text: "#0EA5E9", bg: "#E0F2FE" }, amber: { text: "#D97706", bg: "#FEF3C7" } };
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colors[color].bg }}>
        <Icon size={20} style={{ color: colors[color].text }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-[28px] font-bold tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
      <p className="text-[12px] text-[#6B7280] mt-1">{sub}</p>
    </motion.div>
  );
}

/* ─── Dropdown Filter ─── */
function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = selected ? selected : label;
  const isActive = !!selected;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold hover:border-[#00B87C]/50 transition-all shadow-sm whitespace-nowrap ${
          isActive
            ? "bg-[#00B87C]/10 border-[#00B87C]/40 text-[#00B87C]"
            : "bg-card border-border text-foreground"
        }`}
      >
        {displayLabel}
        {isActive ? (
          <span
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ml-1 w-4 h-4 rounded-full bg-[#00B87C]/20 flex items-center justify-center hover:bg-[#00B87C]/40 transition-all"
          >
            <X size={10} className="text-[#00B87C]" />
          </span>
        ) : (
          <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1.5 left-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold hover:bg-[#00B87C]/10 hover:text-[#00B87C] transition-all ${
                  selected === opt ? "bg-[#00B87C]/10 text-[#00B87C]" : "text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Export Format Button State ─── */
/* ─── Main Component ─── */
export function HRAuditLogs() {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [flaggedFilter, setFlaggedFilter] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);

  // Export modal state
  const [exportFormat, setExportFormat] = useState("CSV");
  const [exportSeverity, setExportSeverity] = useState("All");
  const [exportedModules, setExportedModules] = useState<string[]>(["All"]);

  // Reviewed logs tracking
  const [reviewedLogs, setReviewedLogs] = useState<Set<string>>(new Set());

  const todayLogs = LOGS.filter(l => l.timestamp.startsWith("Today")).length;
  const flaggedCount = LOGS.filter(l => l.isFlagged).length;
  const sensitiveEdits = LOGS.filter(l => l.action === "UPDATE" && l.severity !== "info").length + LOGS.filter(l => l.action === "DELETE").length;

  /* ─── Filtered logs ─── */
  const filteredLogs = useMemo(() => {
    let logs = flaggedFilter ? LOGS.filter(l => l.isFlagged) : LOGS;
    if (search.trim()) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        l.user.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q) ||
        l.record.toLowerCase().includes(q)
      );
    }
    if (moduleFilter) logs = logs.filter(l => l.module === moduleFilter);
    if (actionFilter) logs = logs.filter(l => l.action === actionFilter);
    if (userFilter) logs = logs.filter(l => l.user === userFilter);
    if (dateFilter === "Today") logs = logs.filter(l => l.timestamp.startsWith("Today"));
    if (severityFilter) logs = logs.filter(l => l.severity === severityFilter.toLowerCase());
    return logs;
  }, [flaggedFilter, search, moduleFilter, actionFilter, userFilter, dateFilter, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, moduleFilter, actionFilter, userFilter, dateFilter, severityFilter, flaggedFilter]);

  const handleReset = () => {
    setSearch("");
    setModuleFilter(null);
    setActionFilter(null);
    setUserFilter(null);
    setDateFilter(null);
    setSeverityFilter(null);
    setFlaggedFilter(false);
    setPage(1);
  };

  const handleMarkReviewed = (logId: string) => {
    setReviewedLogs(prev => new Set(prev).add(logId));
    setSelectedLog(null);
  };

  const toggleExportModule = (mod: string) => {
    if (mod === "All") {
      setExportedModules(["All"]);
      return;
    }
    setExportedModules(prev => {
      const without = prev.filter(m => m !== "All");
      if (without.includes(mod)) {
        const next = without.filter(m => m !== mod);
        return next.length === 0 ? ["All"] : next;
      }
      return [...without, mod];
    });
  };

  const isModuleSelected = (mod: string) => exportedModules.includes(mod);

  /* ─── Pagination helpers ─── */
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#F3F4F6] flex items-center justify-center shadow-inner">
            <FileText size={22} className="text-[#6B7280]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Audit Logs</h1>
            <p className="text-[13px] text-[#6B7280]">Complete system activity trail — who did what, when, from where</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 hover:border-[#00B87C]/50 transition-all"
          >
            <Download size={18} /> Export Logs
          </button>
        </div>
      </div>

      {/* SCOPE RESTRICTION BANNER */}
      <div className="flex items-start gap-3 px-5 py-3.5 bg-[#E0F2FE] border-l-4 border-[#0EA5E9] rounded-xl">
        <Info size={18} className="text-[#0EA5E9] shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-bold text-[#0369A1]">You are viewing HR-related activity only.</p>
          <p className="text-[11px] font-medium text-[#0369A1]/80">System security, settings changes, and financial actions are not visible in your scope. Contact Super Admin for full audit access.</p>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-6 px-5 py-3.5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">{todayLogs} HR actions logged today</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[12px] font-bold text-foreground">{flaggedCount} suspicious activities flagged</span></div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="HR ACTIONS TODAY" value="842" sub="across all HR modules" color="green" icon={FileText} />
        <KPICard title="FLAGGED (HR)" value={String(flaggedCount)} sub="needs review" color="red" icon={AlertTriangle} />
        <KPICard title="HR USERS ACTIVE" value="12" sub="logged in today" color="teal" icon={Globe} />
        <KPICard title="SENSITIVE EDITS" value={String(sensitiveEdits)} sub="delete / critical updates" color="amber" icon={ShieldAlert} />
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, action, module, IP..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-bold"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all">
              <X size={14} />
            </button>
          )}
        </div>
        <FilterDropdown
          label="All Modules"
          options={ALL_MODULES}
          selected={moduleFilter}
          onSelect={setModuleFilter}
          onClear={() => setModuleFilter(null)}
        />
        <FilterDropdown
          label="All Actions"
          options={ALL_ACTIONS}
          selected={actionFilter}
          onSelect={setActionFilter}
          onClear={() => setActionFilter(null)}
        />
        <FilterDropdown
          label="All Users"
          options={ALL_USERS}
          selected={userFilter}
          onSelect={setUserFilter}
          onClear={() => setUserFilter(null)}
        />
        <FilterDropdown
          label="Date: Today"
          options={DATE_OPTIONS}
          selected={dateFilter}
          onSelect={setDateFilter}
          onClear={() => setDateFilter(null)}
        />
        <FilterDropdown
          label="Severity"
          options={["Critical", "Warning", "Info"]}
          selected={severityFilter}
          onSelect={setSeverityFilter}
          onClear={() => setSeverityFilter(null)}
        />
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-black text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-xl transition-all uppercase tracking-widest"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C]/10 text-[#00B87C] font-black text-[12px] uppercase tracking-widest hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20"
        >
          <Download size={16} /> Export
        </button>
      </div>

      {/* FLAGGED ACTIVITIES BANNER */}
      <AnimatePresence>
        {showFlags && flaggedCount > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-between px-5 py-3 bg-[#FEF2F2] border-l-4 border-[#EF4444] rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-[#EF4444]" />
              <span className="text-[13px] font-bold text-[#EF4444]">{flaggedCount} suspicious activities detected — Review immediately</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFlags(false)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-black text-muted-foreground uppercase tracking-wider hover:bg-muted/50 transition-all"
              >
                Dismiss
              </button>
              <button
                onClick={() => { setFlaggedFilter(true); setShowFlags(false); }}
                className="text-[12px] font-black text-[#EF4444] hover:underline"
              >
                Review All Flags →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIT LOG TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">SYSTEM AUDIT LOG</h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#00B87C]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" />
              <span className="text-[9px] font-black text-[#00B87C] uppercase tracking-wider">Live</span>
            </span>
            {filteredLogs.length !== LOGS.length && (
              <span className="text-[11px] font-semibold text-muted-foreground">({filteredLogs.length} results)</span>
            )}
          </div>
          {(flaggedFilter || search || moduleFilter || actionFilter || userFilter || dateFilter || severityFilter) && (
            <button onClick={handleReset} className="text-[11px] font-black text-muted-foreground hover:text-foreground transition-all flex items-center gap-1">
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-muted/10 border-b border-border">
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">TIMESTAMP</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">USER</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">ACTION</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">MODULE</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">RECORD / DETAIL</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">IP ADDRESS</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">DEVICE</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">SEVERITY</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center">
                        <Search size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-[13px] font-bold text-muted-foreground">No audit logs found matching your filters.</p>
                      <button onClick={handleReset} className="text-[12px] font-black text-[#00B87C] hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const sev = SEV_CONFIG[log.severity];
                  const act = ACTION_CONFIG[log.action];
                  const isReviewed = reviewedLogs.has(log.id);
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group hover:bg-[#00B87C]/[0.05] transition-all cursor-pointer ${isReviewed ? "opacity-60" : ""}`}
                      style={{ borderLeft: log.severity === "critical" ? "3px solid #EF4444" : log.severity === "warning" ? "3px solid #F59E0B" : "3px solid transparent", minHeight: "52px" }}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-bold text-foreground whitespace-nowrap">{log.timestamp}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {log.user === "Unknown" || log.user === "Unknown IP" ? (
                            <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] font-black text-[9px]"><ShieldAlert size={14} /></div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-[9px]">{initials(log.user)}</div>
                          )}
                          <div>
                            <span className={`text-[12px] font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-foreground"}`}>{log.user}</span>
                            <p className="text-[10px] text-muted-foreground">{log.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${act.chip}`}>{log.action}</span></td>
                      <td className="px-5 py-3"><span className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-[11px] font-semibold">{log.module}</span></td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-medium text-foreground">
                          {log.record}
                          {log.isFlagged && !isReviewed && <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[9px] font-black border border-[#FECACA]"><Flag size={9} /> FLAGGED</span>}
                          {isReviewed && <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B87C] text-[9px] font-black border border-[#A7F3D0]"><Check size={9} /> REVIEWED</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3"><span className={`text-[11px] font-mono font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-muted-foreground"}`}>{log.ip}</span></td>
                      <td className="px-5 py-3"><span className="text-[11px] font-medium text-muted-foreground">{log.device}</span></td>
                      <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sev.chip}`}>{sev.icon} {sev.label}</span></td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                          className={`text-[11px] font-black ${log.severity === "critical" ? "text-[#EF4444]" : "text-[#00B87C]"} hover:underline whitespace-nowrap`}
                        >
                          {log.severity === "critical" ? "Review →" : "View →"}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredLogs.length)}–{Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} logs
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-[12px] font-bold text-muted-foreground px-1">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 rounded-xl text-[12px] font-black flex items-center justify-center transition-all ${
                    page === p
                      ? "bg-[#00B87C] text-white"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ─── AUDIT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSelectedLog(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[520px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedLog.severity === "critical" ? "bg-[#FEF2F2]" : selectedLog.severity === "warning" ? "bg-[#FFFBEB]" : "bg-[#F0FDF4]"}`}>
                    {selectedLog.severity === "critical" ? <ShieldAlert size={18} className="text-[#EF4444]" /> : selectedLog.severity === "warning" ? <AlertTriangle size={18} className="text-[#D97706]" /> : <CheckCircle2 size={18} className="text-[#00B87C]" />}
                  </div>
                  <h3 className="text-[16px] font-black text-foreground tracking-tight">Audit Log Detail</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Event ID", value: selectedLog.id.toUpperCase() },
                    { label: "Timestamp", value: selectedLog.timestamp },
                    { label: "User", value: selectedLog.user },
                    { label: "User Role", value: selectedLog.userRole },
                    { label: "IP Address", value: selectedLog.ip },
                    { label: "Device/Browser", value: selectedLog.device },
                    { label: "Action Type", value: selectedLog.action },
                    { label: "Module", value: selectedLog.module },
                    { label: "Record Affected", value: selectedLog.record.split(" —")[0] },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{f.label}</p>
                      <p className="text-[12px] font-bold text-foreground">{f.value}</p>
                    </div>
                  ))}
                </div>

                {selectedLog.oldValue && selectedLog.newValue && (
                  <>
                    <div className="border-t border-border" />
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Old Value</p>
                      <p className="text-[12px] font-medium text-[#EF4444] bg-[#FEF2F2] px-3 py-2 rounded-xl">{selectedLog.oldValue}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">New Value</p>
                      <p className="text-[12px] font-medium text-[#00B87C] bg-[#F0FDF4] px-3 py-2 rounded-xl">{selectedLog.newValue}</p>
                    </div>
                  </>
                )}

                <div className="border-t border-border" />
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Event Description</p>
                  <p className="text-[12px] font-medium text-muted-foreground bg-muted/30 px-4 py-3 rounded-xl leading-relaxed">
                    {selectedLog.user} ({selectedLog.userRole}) performed a <strong className="text-foreground">{selectedLog.action}</strong> action on the <strong className="text-foreground">{selectedLog.module}</strong> module. {selectedLog.record}. Source IP: {selectedLog.ip} via {selectedLog.device}.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border bg-muted/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-3 py-2 rounded-xl border border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLog.severity !== "info" && !reviewedLogs.has(selectedLog.id) && (
                    <>
                      <button className="px-3 py-2 rounded-xl border border-amber-500/30 text-[11px] font-semibold text-amber-500 uppercase tracking-widest hover:bg-amber-500/5 transition-all flex items-center gap-1.5">
                        <Flag size={13} /> Flag
                      </button>
                      <button
                        onClick={() => handleMarkReviewed(selectedLog.id)}
                        className="px-3 py-2 rounded-xl bg-[#00B87C]/10 text-[#00B87C] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20 flex items-center gap-1.5"
                      >
                        <Check size={13} /> Mark Reviewed
                      </button>
                    </>
                  )}
                  {reviewedLogs.has(selectedLog.id) && (
                    <span className="px-3 py-2 rounded-xl bg-[#F0FDF4] text-[#00B87C] text-[11px] font-semibold border border-[#A7F3D0] flex items-center gap-1.5">
                      <Check size={13} /> Reviewed
                    </span>
                  )}
                  {selectedLog.severity === "critical" && (
                    <button
                      onClick={() => { setSelectedLog(null); setShowBlockModal(true); }}
                      className="px-3 py-2 rounded-xl border border-[#EF4444]/30 text-[11px] font-semibold text-[#EF4444] uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5"
                    >
                      <Ban size={13} /> Block IP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EXPORT MODAL (HR-scoped) ─── */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowExportModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[440px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center"><Download size={18} className="text-[#6B7280]" /></div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">Export Audit Logs</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">From</label>
                    <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">To</label>
                    <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Modules (HR scope)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...ALL_MODULES].map(m => (
                      <button
                        key={m}
                        onClick={() => toggleExportModule(m)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isModuleSelected(m)
                            ? "bg-[#00B87C] text-white border-[#00B87C]"
                            : "bg-[#00B87C]/10 text-[#00B87C] border-[#00B87C]/20 hover:bg-[#00B87C]/20"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Format</label>
                  <div className="flex gap-2">
                    {["CSV", "PDF", "Excel"].map(f => (
                      <button
                        key={f}
                        onClick={() => setExportFormat(f)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                          exportFormat === f
                            ? "bg-[#00B87C] text-white border-[#00B87C]"
                            : "border-border text-muted-foreground hover:border-[#00B87C]/50"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Severity</label>
                  <div className="flex gap-2">
                    {["All", "Critical only", "Warning+"].map(s => (
                      <button
                        key={s}
                        onClick={() => setExportSeverity(s)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider border transition-all ${
                          exportSeverity === s
                            ? "bg-[#00B87C] text-white border-[#00B87C]"
                            : "border-border text-muted-foreground hover:border-[#00B87C]/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#E0F2FE] border border-[#0EA5E9]/20 flex items-center gap-2">
                  <Info size={14} className="text-[#0EA5E9] shrink-0" />
                  <span className="text-[11px] font-bold text-[#0369A1]">Export limited to HR modules per your access scope.</span>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Download size={14} /> Export {exportFormat}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── BLOCK IP CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowBlockModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-sm bg-card rounded-2xl p-8 text-center shadow-2xl border border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4"><Ban size={24} className="text-[#EF4444]" /></div>
              <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Block IP Address</h3>
              <p className="text-[13px] font-medium text-muted-foreground mb-1">Are you sure you want to block <strong className="text-foreground">203.45.67.12</strong>?</p>
              <p className="text-[11px] font-bold text-amber-500 mb-6">This IP will be permanently blocked from accessing the system.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowBlockModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Ban size={14} /> Block IP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
