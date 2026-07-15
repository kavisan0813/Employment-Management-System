import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Bell,
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
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
type Severity = "critical" | "warning" | "info";
type ActionType =
  | "APPROVE"
  | "DELETE"
  | "UPDATE"
  | "EXPORT"
  | "RUN"
  | "LOGIN FAILED"
  | "CREATE"
  | "VIEW";
type ModuleType =
  | "Auth"
  | "Employees"
  | "Leave"
  | "Settings"
  | "Reports"
  | "Payroll"
  | "Schedule"
  | "Security";

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

/* ─── Mock Data ─── */
const LOGS: AuditLogEntry[] = [
  {
    id: "l1",
    timestamp: "Today 10:42 AM",
    user: "Unknown",
    userRole: "—",
    action: "DELETE",
    module: "Employees",
    record: "EMP-0421 deleted permanently",
    ip: "192.168.1.45",
    device: "Chrome/Windows",
    severity: "critical",
    isFlagged: true,
  },
  {
    id: "l2",
    timestamp: "Today 10:15 AM",
    user: "Meera Thomas",
    userRole: "HR Manager",
    action: "APPROVE",
    module: "Leave",
    record: "Leave #LV-0892 approved for Priya Sharma",
    ip: "10.0.0.12",
    device: "Chrome/Mac",
    severity: "info",
  },
  {
    id: "l3",
    timestamp: "Today 9:58 AM",
    user: "Ryan Park",
    userRole: "Super Admin",
    action: "UPDATE",
    module: "Settings",
    record: "Role permissions updated — HR Manager",
    ip: "10.0.0.1",
    device: "Safari/Mac",
    severity: "info",
  },
  {
    id: "l4",
    timestamp: "Today 9:42 AM",
    user: "Suresh Iyer",
    userRole: "HR Manager",
    action: "EXPORT",
    module: "Reports",
    record: "Bulk salary data exported — 1,284 records",
    ip: "192.168.2.10",
    device: "Chrome/Windows",
    severity: "warning",
    isFlagged: true,
  },
  {
    id: "l5",
    timestamp: "Today 9:30 AM",
    user: "Ananya Das",
    userRole: "Finance",
    action: "RUN",
    module: "Payroll",
    record: "Payroll April 2026 processing started",
    ip: "10.0.0.8",
    device: "Firefox/Linux",
    severity: "info",
  },
  {
    id: "l6",
    timestamp: "Apr 5 11:20 PM",
    user: "Unknown IP",
    userRole: "—",
    action: "LOGIN FAILED",
    module: "Auth",
    record: "5 consecutive failed login attempts — admin@viyanhr.com",
    ip: "45.123.67.89",
    device: "Bot/Unknown",
    severity: "critical",
    isFlagged: true,
  },
  {
    id: "l7",
    timestamp: "Apr 5 4:45 PM",
    user: "Ryan Park",
    userRole: "Super Admin",
    action: "DELETE",
    module: "Schedule",
    record: "Shift template Engineering-Week-A deleted",
    ip: "10.0.0.1",
    device: "Safari/Mac",
    severity: "info",
  },
  {
    id: "l8",
    timestamp: "Apr 5 2:00 PM",
    user: "Ryan Park",
    userRole: "Super Admin",
    action: "UPDATE",
    module: "Security",
    record: "MFA enforcement enabled for all users",
    ip: "10.0.0.1",
    device: "Safari/Mac",
    severity: "info",
    oldValue: "MFA: Disabled",
    newValue: "MFA: Enforced for all users",
  },
];

/* ─── Helpers ─── */
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

/* ─── Severity Config ─── */
const SEV_CONFIG: Record<
  Severity,
  { label: string; icon: string; chip: string }
> = {
  critical: {
    label: "Critical",
    icon: "🔴",
    chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]",
  },
  warning: {
    label: "Warning",
    icon: "⚠",
    chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  },
  info: {
    label: "Info",
    icon: "ℹ",
    chip: "bg-[#F0FDF4] text-[#00B87C] border-[#A7F3D0]",
  },
};

const ACTION_CONFIG: Record<ActionType, { chip: string }> = {
  APPROVE: { chip: "bg-[#F0FDF4] text-[#00B87C] border-[#A7F3D0]" },
  DELETE: { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  UPDATE: { chip: "bg-[#E0F2FE] text-[#0EA5E9] border-[#BAE6FD]" },
  EXPORT: { chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  RUN: { chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  "LOGIN FAILED": { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  CREATE: { chip: "bg-[#DCFCE7] text-[#00B87C] border-[#A7F3D0]" },
  VIEW: { chip: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
};

const getSeverityConfig = (severity: Severity) => {
  switch (severity) {
    case "critical":
      return SEV_CONFIG.critical;
    case "warning":
      return SEV_CONFIG.warning;
    case "info":
    default:
      return SEV_CONFIG.info;
  }
};

const getActionConfig = (action: ActionType) => {
  switch (action) {
    case "APPROVE":
      return ACTION_CONFIG.APPROVE;
    case "DELETE":
      return ACTION_CONFIG.DELETE;
    case "UPDATE":
      return ACTION_CONFIG.UPDATE;
    case "EXPORT":
      return ACTION_CONFIG.EXPORT;
    case "RUN":
      return ACTION_CONFIG.RUN;
    case "LOGIN FAILED":
      return ACTION_CONFIG["LOGIN FAILED"];
    case "CREATE":
      return ACTION_CONFIG.CREATE;
    case "VIEW":
    default:
      return ACTION_CONFIG.VIEW;
  }
};

/* ─── Sub-components ─── */
function KPICard({
  title,
  value,
  sub,
  color,
  icon: Icon,
  onClick,
}: {
  title: string;
  value: string;
  sub: string;
  color: "green" | "red" | "teal" | "purple";
  icon: React.ElementType;
  onClick?: () => void;
}) {
  const colors = {
    green: { text: "#00B87C", bg: "#DCFCE7" },
    red: { text: "#EF4444", bg: "#FEE2E2" },
    teal: { text: "#0EA5E9", bg: "#E0F2FE" },
    purple: { text: "#8B5CF6", bg: "#EDE9FE" },
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`p-6 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}`}
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors[color].bg }}
      >
        <Icon size={20} style={{ color: colors[color].text }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
        {title}
      </p>
      <h3
        className="text-[28px] font-bold tracking-tighter"
        style={{ color: colors[color].text }}
      >
        {value}
      </h3>
      <p className="text-[12px] text-[#6B7280] mt-1">{sub}</p>
    </motion.div>
  );
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [flaggedFilter, setFlaggedFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [alertAction, setAlertAction] = useState("Any Action");
  const [alertModule, setAlertModule] = useState("Any Module");
  const [exportFromDate, setExportFromDate] = useState("");
  const [exportToDate, setExportToDate] = useState("");
  const [exportFormat, setExportFormat] = useState("CSV");
  const todayLogsCount = useMemo(
    () => logs.filter((l) => l.timestamp.startsWith("Today")).length,
    [logs],
  );
  const flaggedCount = useMemo(
    () => logs.filter((l) => l.isFlagged).length,
    [logs],
  );
  const criticalCount = useMemo(
    () => logs.filter((l) => l.severity === "critical").length,
    [logs],
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setModuleFilter("All");
    setActionFilter("All");
    setUserFilter("All");
    setDateFilter("All");
    setSeverityFilter("All");
    setFlaggedFilter(false);
    setCurrentPage(1);
    toast.success("Filters reset successfully");
  };

  const displayedLogs = useMemo(() => {
    return logs.filter((log) => {
      if (flaggedFilter && !log.isFlagged) return false;
      if (moduleFilter !== "All" && log.module !== moduleFilter) return false;
      if (actionFilter !== "All" && log.action !== actionFilter) return false;
      if (userFilter !== "All" && log.user !== userFilter) return false;
      if (severityFilter !== "All" && log.severity !== severityFilter)
        return false;
      if (dateFilter !== "All") {
        if (dateFilter === "Today" && !log.timestamp.startsWith("Today"))
          return false;
        if (dateFilter === "Apr 5" && !log.timestamp.startsWith("Apr 5"))
          return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.user.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query) ||
          log.record.toLowerCase().includes(query) ||
          log.ip.toLowerCase().includes(query) ||
          log.device.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [
    logs,
    flaggedFilter,
    moduleFilter,
    actionFilter,
    userFilter,
    severityFilter,
    dateFilter,
    searchQuery,
  ]);

  const totalPages = Math.ceil(displayedLogs.length / logsPerPage) || 1;
  const startIdx = (currentPage - 1) * logsPerPage;
  const endIdx = Math.min(startIdx + logsPerPage, displayedLogs.length);
  const paginatedLogs = useMemo(() => {
    return displayedLogs.slice(startIdx, endIdx);
  }, [displayedLogs, startIdx, endIdx]);

  const handleViewLog = (log: AuditLogEntry) => setSelectedLog(log);
  const handleCloseModal = () => setSelectedLog(null);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#F3F4F6] flex items-center justify-center shadow-inner">
            <FileText size={22} className="text-[#6B7280]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
              Audit Logs
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Complete system activity trail — who did what, when, from where
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all cursor-pointer"
          >
            <Download size={18} /> Export Logs
          </button>
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all cursor-pointer"
          >
            <Bell size={18} /> Set Alert
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 px-5 py-3.5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[12px] font-bold text-foreground">
            {todayLogsCount} actions logged today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground">
            {flaggedCount} suspicious activities flagged
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-[12px] font-bold text-foreground">
            {criticalCount} critical security events review required
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="TOTAL LOGS TODAY"
          value={todayLogsCount.toString()}
          sub="across all modules"
          color="green"
          icon={FileText}
          onClick={handleResetFilters}
        />
        <KPICard
          title="FLAGGED ACTIVITIES"
          value={flaggedCount.toString()}
          sub="needs review"
          color="red"
          icon={AlertTriangle}
          onClick={() => {
            setFlaggedFilter(true);
            setSeverityFilter("All");
            setCurrentPage(1);
          }}
        />
        <KPICard
          title="ACTIVE USERS TODAY"
          value="5"
          sub="unique users active"
          color="teal"
          icon={Globe}
          onClick={() => {
            setUserFilter("Ryan Park");
            setCurrentPage(1);
          }}
        />
        <KPICard
          title="CRITICAL EVENTS"
          value={criticalCount.toString()}
          sub="immediate attention"
          color="purple"
          icon={ShieldAlert}
          onClick={() => {
            setSeverityFilter("critical");
            setFlaggedFilter(false);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
        <div className="relative flex-1 min-w-[280px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by user, action, module, IP..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-bold"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setModuleDropdownOpen(!moduleDropdownOpen);
              setActionDropdownOpen(false);
              setUserDropdownOpen(false);
              setDateDropdownOpen(false);
              setSeverityDropdownOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${moduleFilter !== "All" ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]" : "bg-card border-border text-foreground hover:border-[#00B87C]/50"}`}
          >
            Module{moduleFilter !== "All" ? `: ${moduleFilter}` : ""}{" "}
            <ChevronDown
              size={14}
              className={
                moduleFilter !== "All"
                  ? "text-[#00B87C]"
                  : "text-muted-foreground"
              }
            />
          </button>
          {moduleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModuleDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
                {[
                  "All",
                  "Auth",
                  "Employees",
                  "Leave",
                  "Settings",
                  "Reports",
                  "Payroll",
                  "Schedule",
                  "Security",
                ].map((mod) => (
                  <button
                    key={mod}
                    onClick={() => {
                      setModuleFilter(mod);
                      setModuleDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted flex items-center justify-between cursor-pointer ${moduleFilter === mod ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"}`}
                  >
                    {mod}{" "}
                    {moduleFilter === mod && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setActionDropdownOpen(!actionDropdownOpen);
              setModuleDropdownOpen(false);
              setUserDropdownOpen(false);
              setDateDropdownOpen(false);
              setSeverityDropdownOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${actionFilter !== "All" ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]" : "bg-card border-border text-foreground hover:border-[#00B87C]/50"}`}
          >
            Action{actionFilter !== "All" ? `: ${actionFilter}` : ""}{" "}
            <ChevronDown
              size={14}
              className={
                actionFilter !== "All"
                  ? "text-[#00B87C]"
                  : "text-muted-foreground"
              }
            />
          </button>
          {actionDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setActionDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
                {[
                  "All",
                  "APPROVE",
                  "DELETE",
                  "UPDATE",
                  "EXPORT",
                  "RUN",
                  "LOGIN FAILED",
                  "CREATE",
                  "VIEW",
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => {
                      setActionFilter(act);
                      setActionDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted flex items-center justify-between cursor-pointer ${actionFilter === act ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"}`}
                  >
                    {act}{" "}
                    {actionFilter === act && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setModuleDropdownOpen(false);
              setActionDropdownOpen(false);
              setDateDropdownOpen(false);
              setSeverityDropdownOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${userFilter !== "All" ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]" : "bg-card border-border text-foreground hover:border-[#00B87C]/50"}`}
          >
            User{userFilter !== "All" ? `: ${userFilter}` : ""}{" "}
            <ChevronDown
              size={14}
              className={
                userFilter !== "All"
                  ? "text-[#00B87C]"
                  : "text-muted-foreground"
              }
            />
          </button>
          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
                {[
                  "All",
                  "Unknown",
                  "Meera Thomas",
                  "Ryan Park",
                  "Suresh Iyer",
                  "Ananya Das",
                  "Unknown IP",
                ].map((usr) => (
                  <button
                    key={usr}
                    onClick={() => {
                      setUserFilter(usr);
                      setUserDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted flex items-center justify-between cursor-pointer ${userFilter === usr ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"}`}
                  >
                    {usr}{" "}
                    {userFilter === usr && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setDateDropdownOpen(!dateDropdownOpen);
              setModuleDropdownOpen(false);
              setActionDropdownOpen(false);
              setUserDropdownOpen(false);
              setSeverityDropdownOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${dateFilter !== "All" ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]" : "bg-card border-border text-foreground hover:border-[#00B87C]/50"}`}
          >
            Date{dateFilter !== "All" ? `: ${dateFilter}` : ""}{" "}
            <ChevronDown
              size={14}
              className={
                dateFilter !== "All"
                  ? "text-[#00B87C]"
                  : "text-muted-foreground"
              }
            />
          </button>
          {dateDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDateDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
                {["All", "Today", "Apr 5"].map((dt) => (
                  <button
                    key={dt}
                    onClick={() => {
                      setDateFilter(dt);
                      setDateDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted flex items-center justify-between cursor-pointer ${dateFilter === dt ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"}`}
                  >
                    {dt === "All" ? "All Dates" : dt}{" "}
                    {dateFilter === dt && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setSeverityDropdownOpen(!severityDropdownOpen);
              setModuleDropdownOpen(false);
              setActionDropdownOpen(false);
              setUserDropdownOpen(false);
              setDateDropdownOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${severityFilter !== "All" ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]" : "bg-card border-border text-foreground hover:border-[#00B87C]/50"}`}
          >
            Severity{severityFilter !== "All" ? `: ${severityFilter}` : ""}{" "}
            <ChevronDown
              size={14}
              className={
                severityFilter !== "All"
                  ? "text-[#00B87C]"
                  : "text-muted-foreground"
              }
            />
          </button>
          {severityDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSeverityDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
                {["All", "critical", "warning", "info"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setSeverityFilter(sev);
                      setSeverityDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted flex items-center justify-between cursor-pointer ${severityFilter === sev ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"}`}
                  >
                    <span className="capitalize">{sev}</span>{" "}
                    {severityFilter === sev && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest cursor-pointer"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C]/10 text-[#00B87C] font-black text-[12px] uppercase tracking-widest hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20 cursor-pointer"
        >
          <Download size={16} /> Export
        </button>
      </div>

      <AnimatePresence>
        {showFlags && flaggedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between px-5 py-3 bg-[#FEF2F2] border-l-4 border-[#EF4444] rounded-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-[#EF4444]" />
              <span className="text-[13px] font-bold text-[#EF4444]">
                {flaggedCount} suspicious activities detected — Review
                immediately
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFlags(false)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-black text-muted-foreground uppercase tracking-wider hover:bg-red-100 transition-all cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setFlaggedFilter(true);
                  setShowFlags(false);
                  setCurrentPage(1);
                }}
                className="text-[12px] font-black text-[#EF4444] hover:underline cursor-pointer"
              >
                Review All Flags →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              SYSTEM AUDIT LOG
            </h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#00B87C]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
              <span className="text-[9px] font-black text-[#00B87C] uppercase tracking-wider">
                Live
              </span>
            </span>
          </div>
          {(flaggedFilter ||
            moduleFilter !== "All" ||
            actionFilter !== "All" ||
            userFilter !== "All" ||
            dateFilter !== "All" ||
            severityFilter !== "All" ||
            searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-black text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-border">
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  TIMESTAMP
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  USER
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  ACTION
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  MODULE
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  RECORD / DETAIL
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  IP ADDRESS
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  DEVICE
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  SEVERITY
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] dark:divide-white/5">
              {paginatedLogs.map((log) => {
                const sev = getSeverityConfig(log.severity);
                const act = getActionConfig(log.action);
                const isUserBlocked = blockedUsers.includes(log.user);
                const isIpBlocked = blockedIPs.includes(log.ip);
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-[#00B87C]/[0.08] transition-all cursor-pointer"
                    style={{
                      borderLeft:
                        log.severity === "critical"
                          ? "3px solid #EF4444"
                          : log.severity === "warning"
                            ? "3px solid #F59E0B"
                            : "3px solid transparent",
                    }}
                    onClick={() => handleViewLog(log)}
                  >
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-bold text-foreground whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {log.user === "Unknown" || log.user === "Unknown IP" ? (
                          <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] font-black text-[9px]">
                            <ShieldAlert size={14} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-[9px]">
                            {initials(log.user)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-foreground"}`}
                          >
                            {log.user}
                          </span>
                          {isUserBlocked && (
                            <span className="text-[9px] font-extrabold text-[#EF4444] uppercase tracking-wider">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${act.chip}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-[11px] font-semibold">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-medium text-foreground">
                        {log.record}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span
                          className={`text-[11px] font-mono font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-muted-foreground"}`}
                        >
                          {log.ip}
                        </span>
                        {isIpBlocked && (
                          <span className="text-[9px] font-extrabold text-[#EF4444] uppercase tracking-wider">
                            Blocked IP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {log.device}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sev.chip}`}
                      >
                        {sev.icon} {sev.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewLog(log);
                        }}
                        className={`text-[11px] font-black ${log.severity === "critical" ? "text-[#EF4444]" : "text-[#00B87C]"} hover:underline whitespace-nowrap cursor-pointer`}
                      >
                        {log.severity === "critical" ? "Review →" : "View →"}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {displayedLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-muted-foreground font-semibold"
                  >
                    No audit logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-muted-foreground">
          Showing {displayedLogs.length > 0 ? startIdx + 1 : 0}–{endIdx} of{" "}
          {displayedLogs.length} logs
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 rounded-xl text-[12px] font-black flex items-center justify-center transition-all cursor-pointer ${currentPage === p ? "bg-[#00B87C] text-white" : "border border-border text-muted-foreground hover:bg-muted"}`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[520px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedLog.severity === "critical" ? "bg-[#FEF2F2]" : selectedLog.severity === "warning" ? "bg-[#FFFBEB]" : "bg-[#F0FDF4]"}`}
                  >
                    {selectedLog.severity === "critical" ? (
                      <ShieldAlert size={18} className="text-[#EF4444]" />
                    ) : selectedLog.severity === "warning" ? (
                      <AlertTriangle size={18} className="text-[#D97706]" />
                    ) : (
                      <CheckCircle2 size={18} className="text-[#00B87C]" />
                    )}
                  </div>
                  <h3 className="text-[16px] font-black text-foreground tracking-tight">
                    Audit Log Detail
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all cursor-pointer"
                >
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
                    {
                      label: "Record Affected",
                      value: selectedLog.record.split(" —")[0],
                    },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                        {f.label}
                      </p>
                      <p className="text-[12px] font-bold text-foreground">
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/5 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() =>
                    toast.success(
                      `Log ${selectedLog.id.toUpperCase()} exported.`,
                    )
                  }
                  className="px-3 py-2 rounded-xl border border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Export
                </button>
                <div className="flex items-center gap-2">
                  {selectedLog.severity !== "info" && (
                    <>
                      <button
                        onClick={() => {
                          const updatedLogs = logs.map((l) =>
                            l.id === selectedLog.id
                              ? { ...l, isFlagged: !l.isFlagged }
                              : l,
                          );
                          setLogs(updatedLogs);
                          setSelectedLog((prev) =>
                            prev
                              ? { ...prev, isFlagged: !prev.isFlagged }
                              : null,
                          );
                          toast.success("Log updated.");
                        }}
                        className={`px-3 py-2 rounded-xl border text-[11px] font-semibold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${selectedLog.isFlagged ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "border-border text-muted-foreground"}`}
                      >
                        <Flag size={13} />{" "}
                        {selectedLog.isFlagged ? "Unflag" : "Flag"}
                      </button>
                      <button
                        onClick={() => {
                          const updatedLogs = logs.map((l) =>
                            l.id === selectedLog.id
                              ? {
                                  ...l,
                                  severity: "info" as const,
                                  isFlagged: false,
                                }
                              : l,
                          );
                          setLogs(updatedLogs);
                          setSelectedLog((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  severity: "info" as const,
                                  isFlagged: false,
                                }
                              : null,
                          );
                          toast.success("Log reviewed.");
                        }}
                        className="px-3 py-2 rounded-xl bg-[#00B87C]/10 text-[#00B87C] text-[11px] font-semibold uppercase tracking-wider border border-[#00B87C]/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={13} /> Review
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (blockedUsers.includes(selectedLog.user))
                        setBlockedUsers((prev) =>
                          prev.filter((u) => u !== selectedLog.user),
                        );
                      else
                        setBlockedUsers((prev) => [...prev, selectedLog.user]);
                    }}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ${blockedUsers.includes(selectedLog.user) ? "bg-red-500/10 text-red-600 border-red-500/30" : "border-[#EF4444]/30 text-[#EF4444]"}`}
                  >
                    <UserX size={13} />{" "}
                    {blockedUsers.includes(selectedLog.user)
                      ? "Unblock"
                      : "Block"}
                  </button>
                  {selectedLog.ip !== "10.0.0.1" &&
                    selectedLog.ip !== "10.0.0.8" &&
                    selectedLog.ip !== "10.0.0.12" && (
                      <button
                        onClick={() => {
                          if (blockedIPs.includes(selectedLog.ip))
                            setBlockedIPs((prev) =>
                              prev.filter((ip) => ip !== selectedLog.ip),
                            );
                          else {
                            handleCloseModal();
                            setShowBlockModal(true);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl border text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ${blockedIPs.includes(selectedLog.ip) ? "bg-red-500/10 text-red-600 border-red-500/30" : "border-[#EF4444]/30 text-[#EF4444]"}`}
                      >
                        <Ban size={13} />{" "}
                        {blockedIPs.includes(selectedLog.ip)
                          ? "Unblock IP"
                          : "Block IP"}
                      </button>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowExportModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[440px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                    <Download size={18} className="text-[#6B7280]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    Export Audit Logs
                  </h3>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
                      From
                    </label>
                    <input
                      type="date"
                      value={exportFromDate}
                      onChange={(e) => setExportFromDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
                      To
                    </label>
                    <input
                      type="date"
                      value={exportToDate}
                      onChange={(e) => setExportToDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
                    Format
                  </label>
                  <div className="flex gap-2">
                    {["CSV", "PDF", "Excel"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setExportFormat(f)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase border transition-all cursor-pointer ${exportFormat === f ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border text-muted-foreground"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3 bg-muted/5">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Export successful.");
                    setShowExportModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold cursor-pointer"
                >
                  Export
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAlertModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[460px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                    <Bell size={18} className="text-[#D97706]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    Create Alert Rule
                  </h3>
                </div>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block">
                  Condition
                </label>
                <div className="text-[11px] font-bold text-foreground">
                  When{" "}
                  <select
                    value={alertAction}
                    onChange={(e) => setAlertAction(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background"
                  >
                    <option>Any Action</option>
                    <option>DELETE</option>
                  </select>{" "}
                  happens in{" "}
                  <select
                    value={alertModule}
                    onChange={(e) => setAlertModule(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background"
                  >
                    <option>Any Module</option>
                    <option>Auth</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3 bg-muted/5">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Alert rule saved.");
                    setShowAlertModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold cursor-pointer"
                >
                  Save Alert Rule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setShowBlockModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-card rounded-2xl p-8 text-center shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
                <Ban size={24} className="text-[#EF4444]" />
              </div>
              <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
                Block IP Address
              </h3>
              <p className="text-[13px] font-medium text-muted-foreground mb-1">
                Are you sure you want to block{" "}
                <strong className="text-foreground">
                  {selectedLog?.ip || "45.123.67.89"}
                </strong>
                ?
              </p>
              <p className="text-[11px] font-bold text-amber-500 mb-6">
                This IP will be permanently blocked from accessing the system.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedLog) {
                      setBlockedIPs((prev) => [...prev, selectedLog.ip]);
                      toast.success(
                        `IP address ${selectedLog.ip} blocked successfully.`,
                      );
                    }
                    setShowBlockModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
