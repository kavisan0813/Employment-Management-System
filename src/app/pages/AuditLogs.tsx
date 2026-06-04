import { useState } from "react";
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
  Monitor,
  Eye,
  Flag,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Ban,
  Settings,
  Clock,
  LogIn,
  Trash2,
  Edit3,
  Upload,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
type Severity = "critical" | "warning" | "info";
type ActionType = "APPROVE" | "DELETE" | "UPDATE" | "EXPORT" | "RUN" | "LOGIN FAILED" | "CREATE" | "VIEW";
type ModuleType = "Auth" | "Employees" | "Leave" | "Settings" | "Reports" | "Payroll" | "Schedule" | "Security";

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
  { id: "l1", timestamp: "Today 10:42 AM", user: "Unknown", userRole: "—", action: "DELETE", module: "Employees", record: "EMP-0421 deleted permanently", ip: "192.168.1.45", device: "Chrome/Windows", severity: "critical", isFlagged: true },
  { id: "l2", timestamp: "Today 10:15 AM", user: "Meera Thomas", userRole: "HR Manager", action: "APPROVE", module: "Leave", record: "Leave #LV-0892 approved for Priya Sharma", ip: "10.0.0.12", device: "Chrome/Mac", severity: "info" },
  { id: "l3", timestamp: "Today 9:58 AM", user: "Ryan Park", userRole: "Super Admin", action: "UPDATE", module: "Settings", record: "Role permissions updated — HR Manager", ip: "10.0.0.1", device: "Safari/Mac", severity: "info" },
  { id: "l4", timestamp: "Today 9:42 AM", user: "Suresh Iyer", userRole: "HR Manager", action: "EXPORT", module: "Reports", record: "Bulk salary data exported — 1,284 records", ip: "192.168.2.10", device: "Chrome/Windows", severity: "warning", isFlagged: true },
  { id: "l5", timestamp: "Today 9:30 AM", user: "Ananya Das", userRole: "Finance", action: "RUN", module: "Payroll", record: "Payroll April 2026 processing started", ip: "10.0.0.8", device: "Firefox/Linux", severity: "info" },
  { id: "l6", timestamp: "Apr 5 11:20 PM", user: "Unknown IP", userRole: "—", action: "LOGIN FAILED", module: "Auth", record: "5 consecutive failed login attempts — admin@nexushr.com", ip: "45.123.67.89", device: "Bot/Unknown", severity: "critical", isFlagged: true },
  { id: "l7", timestamp: "Apr 5 4:45 PM", user: "Ryan Park", userRole: "Super Admin", action: "DELETE", module: "Schedule", record: "Shift template Engineering-Week-A deleted", ip: "10.0.0.1", device: "Safari/Mac", severity: "info" },
  { id: "l8", timestamp: "Apr 5 2:00 PM", user: "Ryan Park", userRole: "Super Admin", action: "UPDATE", module: "Security", record: "MFA enforcement enabled for all users", ip: "10.0.0.1", device: "Safari/Mac", severity: "info", oldValue: "MFA: Disabled", newValue: "MFA: Enforced for all users" },
];

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
  RUN: { chip: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  "LOGIN FAILED": { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  CREATE: { chip: "bg-[#DCFCE7] text-[#00B87C] border-[#A7F3D0]" },
  VIEW: { chip: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
};

const getSeverityConfig = (severity: Severity) => {
  switch (severity) {
    case "critical": return SEV_CONFIG.critical;
    case "warning": return SEV_CONFIG.warning;
    case "info":
    default:
      return SEV_CONFIG.info;
  }
};

const getActionConfig = (action: ActionType) => {
  switch (action) {
    case "APPROVE": return ACTION_CONFIG.APPROVE;
    case "DELETE": return ACTION_CONFIG.DELETE;
    case "UPDATE": return ACTION_CONFIG.UPDATE;
    case "EXPORT": return ACTION_CONFIG.EXPORT;
    case "RUN": return ACTION_CONFIG.RUN;
    case "LOGIN FAILED": return ACTION_CONFIG["LOGIN FAILED"];
    case "CREATE": return ACTION_CONFIG.CREATE;
    case "VIEW":
    default:
      return ACTION_CONFIG.VIEW;
  }
};

/* ─── Sub-components ─── */
function KPICard({ title, value, sub, color, icon: Icon }: { title: string; value: string; sub: string; color: "green" | "red" | "teal" | "purple"; icon: React.ElementType }) {
  const colors = { green: { text: "#00B87C", bg: "#DCFCE7" }, red: { text: "#EF4444", bg: "#FEE2E2" }, teal: { text: "#0EA5E9", bg: "#E0F2FE" }, purple: { text: "#8B5CF6", bg: "#EDE9FE" } };
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 bg-card border border-border rounded-[32px] shadow-sm hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colors[color].bg }}>
        <Icon size={24} style={{ color: colors[color].text }} />
      </div>
      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.8px] mb-2">{title}</p>
      <h3 className="text-3xl font-black tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
      <p className="text-[11px] font-medium text-muted-foreground mt-1">{sub}</p>
    </motion.div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <div className="relative">
      <button className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-xl text-[12px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm whitespace-nowrap">
        {label} <ChevronDown size={14} className="text-muted-foreground" />
      </button>
    </div>
  );
}

/* ─── Main Component ─── */
export function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [flaggedFilter, setFlaggedFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;

  const todayLogs = LOGS.filter(l => l.timestamp.startsWith("Today")).length;
  const flaggedCount = LOGS.filter(l => l.isFlagged).length;
  const criticalCount = LOGS.filter(l => l.severity === "critical").length;

  const displayedLogs = flaggedFilter ? LOGS.filter(l => l.isFlagged) : LOGS;

  /* ─── Modal Handlers ─── */
  const handleViewLog = (log: AuditLogEntry) => setSelectedLog(log);
  const handleCloseModal = () => setSelectedLog(null);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center shadow-inner">
            <FileText size={22} className="text-[#6B7280]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">Audit Logs</h1>
            <p className="text-[13px] font-semibold text-muted-foreground">Complete system activity trail — who did what, when, from where</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all">
            <Download size={18} /> Export Logs
          </button>
          <button onClick={() => setShowAlertModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all">
            <Bell size={18} /> Set Alert
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-6 px-5 py-3.5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">{todayLogs} actions logged today</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[12px] font-bold text-foreground">{flaggedCount} suspicious activities flagged</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /><span className="text-[12px] font-bold text-foreground">1 critical security event — unauthorized access attempt (Apr 5)</span></div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="TOTAL LOGS TODAY" value="2,847" sub="across all modules" color="green" icon={FileText} />
        <KPICard title="FLAGGED ACTIVITIES" value="3" sub="needs review" color="red" icon={AlertTriangle} />
        <KPICard title="ACTIVE USERS TODAY" value="284" sub="logged in today" color="teal" icon={Globe} />
        <KPICard title="CRITICAL EVENTS" value="1" sub="this week" color="purple" icon={ShieldAlert} />
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by user, action, module, IP..." className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-bold" />
        </div>
        <FilterSelect label="All Modules" />
        <FilterSelect label="All Actions" />
        <FilterSelect label="All Users" />
        <FilterSelect label="Date: Today" />
        <FilterSelect label="Severity" />
        <button className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"><RotateCcw size={14} /> Reset</button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C]/10 text-[#00B87C] font-black text-[12px] uppercase tracking-widest hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20"><Download size={16} /> Export</button>
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
              <button onClick={() => setShowFlags(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-black text-muted-foreground uppercase tracking-wider hover:bg-white/50 transition-all">Dismiss</button>
              <button onClick={() => { setFlaggedFilter(true); setShowFlags(false); }} className="text-[12px] font-black text-[#EF4444] hover:underline">Review All Flags →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIT LOG TABLE */}
      <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">SYSTEM AUDIT LOG</h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#00B87C]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" /><span className="text-[9px] font-black text-[#00B87C] uppercase tracking-wider">Live</span></span>
          </div>
          {flaggedFilter && <button onClick={() => setFlaggedFilter(false)} className="text-[11px] font-black text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"><X size={14} /> Clear filter</button>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-muted/10 border-b border-border">
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">TIMESTAMP</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">USER</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">ACTION</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">MODULE</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">RECORD / DETAIL</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">IP ADDRESS</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">DEVICE</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">SEVERITY</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {displayedLogs.map((log) => {
                const sev = getSeverityConfig(log.severity);
                const act = getActionConfig(log.action);
                const rowBg = log.severity === "critical" ? "bg-[#FFF5F5]" : log.severity === "warning" ? "bg-[#FFFBEB]" : "";
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`group hover:bg-[#F0FDF4]/40 transition-all cursor-pointer`}
                    style={{ borderLeft: log.severity === "critical" ? "3px solid #EF4444" : log.severity === "warning" ? "3px solid #F59E0B" : "3px solid transparent", backgroundColor: rowBg || undefined, minHeight: "52px" }}
                    onClick={() => handleViewLog(log)}
                  >
                    <td className="px-5 py-3"><span className="text-[12px] font-bold text-foreground whitespace-nowrap">{log.timestamp}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {log.user === "Unknown" || log.user === "Unknown IP" ? (
                          <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] font-black text-[9px]"><ShieldAlert size={14} /></div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-[9px]">{initials(log.user)}</div>
                        )}
                        <span className={`text-[12px] font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-foreground"}`}>{log.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${act.chip}`}>{log.action}</span></td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-lg bg-[#F3F4F6] text-[#6B7280] text-[10px] font-bold">{log.module}</span></td>
                    <td className="px-5 py-3"><span className="text-[12px] font-medium text-foreground">{log.record}</span></td>
                    <td className="px-5 py-3"><span className={`text-[11px] font-mono font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-muted-foreground"}`}>{log.ip}</span></td>
                    <td className="px-5 py-3"><span className="text-[11px] font-medium text-muted-foreground">{log.device}</span></td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${sev.chip}`}>{sev.icon} {sev.label}</span></td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={(e) => { e.stopPropagation(); handleViewLog(log); }} className={`text-[11px] font-black ${log.severity === "critical" ? "text-[#EF4444]" : "text-[#00B87C]"} hover:underline whitespace-nowrap`}>
                        {log.severity === "critical" ? "Review →" : "View →"}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-muted-foreground">Showing 1–{logsPerPage} of 2,847 logs</span>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all"><ChevronLeft size={16} /></button>
          <button className="w-8 h-8 rounded-xl bg-[#00B87C] text-white text-[12px] font-black flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">3</button>
          <span className="text-[12px] font-bold text-muted-foreground px-1">...</span>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">114</button>
          <button className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* ─── AUDIT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleCloseModal} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-[520px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedLog.severity === "critical" ? "bg-[#FEF2F2]" : selectedLog.severity === "warning" ? "bg-[#FFFBEB]" : "bg-[#F0FDF4]"}`}>
                    {selectedLog.severity === "critical" ? <ShieldAlert size={18} className="text-[#EF4444]" /> : selectedLog.severity === "warning" ? <AlertTriangle size={18} className="text-[#D97706]" /> : <CheckCircle2 size={18} className="text-[#00B87C]" />}
                  </div>
                  <h3 className="text-[16px] font-black text-foreground tracking-tight">Audit Log Detail</h3>
                </div>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"><X size={16} className="text-muted-foreground" /></button>
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
                  <p className="text-[12px] font-medium text-muted-foreground bg-muted/30 px-4 py-3 rounded-xl leading-relaxed">{selectedLog.user} ({selectedLog.userRole}) performed a <strong className="text-foreground">{selectedLog.action}</strong> action on the <strong className="text-foreground">{selectedLog.module}</strong> module. {selectedLog.record}. Source IP: {selectedLog.ip} via {selectedLog.device}.</p>
                </div>

                {selectedLog.id === "l1" && (
                  <>
                    <div className="border-t border-border" />
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Related Events</p>
                      <div className="space-y-1.5">
                        {[{ t: "Today 10:40 AM", a: "VIEW", m: "Employees" }, { t: "Today 10:38 AM", a: "VIEW", m: "Employees" }, { t: "Today 10:35 AM", a: "LOGIN", m: "Auth" }].map((e, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/20 border border-border">
                            <span className="text-[11px] font-bold text-muted-foreground w-32">{e.t}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${getActionConfig(e.a as ActionType)?.chip || ""}`}>{e.a}</span>
                            <span className="text-[11px] font-medium text-muted-foreground">{e.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-1.5"><Download size={13} /> Export</button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLog.severity !== "info" && (
                    <>
                      <button className="px-3 py-2 rounded-xl border border-amber-500/30 text-[10px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500/5 transition-all flex items-center gap-1.5"><Flag size={13} /> Flag</button>
                      <button className="px-3 py-2 rounded-xl bg-[#00B87C]/10 text-[#00B87C] text-[10px] font-black uppercase tracking-widest hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20 flex items-center gap-1.5"><Check size={13} /> Mark Reviewed</button>
                    </>
                  )}
                  <button className="px-3 py-2 rounded-xl border border-[#EF4444]/30 text-[10px] font-black text-[#EF4444] uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5"><UserX size={13} /> Block User</button>
                  {selectedLog.ip !== "10.0.0.1" && selectedLog.ip !== "10.0.0.8" && selectedLog.ip !== "10.0.0.12" && (
                    <button onClick={() => { handleCloseModal(); setShowBlockModal(true); }} className="px-3 py-2 rounded-xl border border-[#EF4444]/30 text-[10px] font-black text-[#EF4444] uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5"><Ban size={13} /> Block IP</button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EXPORT MODAL ─── */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowExportModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-[440px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center"><Download size={18} className="text-[#6B7280]" /></div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">Export Audit Logs</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"><X size={16} className="text-muted-foreground" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">From</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                  <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">To</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                </div>
                <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Modules</label><div className="flex flex-wrap gap-1.5">{["All","Dashboard","Employees","Attendance","Leave","Payroll","Settings"].map(m => <button key={m} className="px-2.5 py-1 rounded-lg bg-[#00B87C]/10 text-[#00B87C] text-[10px] font-black border border-[#00B87C]/20">{m}</button>)}</div></div>
                <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Format</label><div className="flex gap-2">{["CSV","PDF","Excel"].map(f => <button key={f} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${f === "CSV" ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border text-muted-foreground hover:border-[#00B87C]/50"}`}>{f}</button>)}</div></div>
                <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Severity</label><div className="flex gap-2">{["All","Critical only","Warning+"].map(s => <button key={s} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${s === "All" ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border text-muted-foreground hover:border-[#00B87C]/50"}`}>{s}</button>)}</div></div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button onClick={() => setShowExportModal(false)} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"><Download size={14} /> Export</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── ALERT RULES MODAL ─── */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowAlertModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-[460px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center"><Bell size={18} className="text-[#D97706]" /></div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">Create Alert Rule</h3>
                </div>
                <button onClick={() => setShowAlertModal(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"><X size={16} className="text-muted-foreground" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Condition</label>
                  <div className="text-[11px] font-bold text-foreground mb-2">When <select className="px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] font-bold mx-1"><option>Any Action</option><option>DELETE</option><option>EXPORT</option><option>LOGIN FAILED</option></select> happens in <select className="px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] font-bold mx-1"><option>Any Module</option><option>Auth</option><option>Employees</option><option>Payroll</option></select></div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Threshold</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={3} className="w-16 px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold text-center outline-none focus:ring-2 focus:ring-[#00B87C]/20" />
                    <span className="text-[11px] font-bold text-muted-foreground">times within</span>
                    <input type="number" defaultValue={10} className="w-16 px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold text-center outline-none focus:ring-2 focus:ring-[#00B87C]/20" />
                    <span className="text-[11px] font-bold text-muted-foreground">minutes</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Severity</label>
                  <div className="flex gap-2">{["Critical","Warning"].map(s => <button key={s} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${s === "Critical" ? "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" : "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"}`}>{s}</button>)}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Notify Via</label>
                  <div className="flex gap-4">{["Email","Push","SMS"].map(n => (
                    <label key={n} className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" defaultChecked={n !== "SMS"} className="w-3.5 h-3.5 rounded border-border text-[#00B87C] focus:ring-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">{n}</span></label>
                  ))}</div>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button onClick={() => setShowAlertModal(false)} className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button onClick={() => setShowAlertModal(false)} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm">Save Alert Rule</button>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-sm bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4"><Ban size={24} className="text-[#EF4444]" /></div>
              <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Block IP Address</h3>
              <p className="text-[13px] font-medium text-muted-foreground mb-1">Are you sure you want to block <strong className="text-foreground">45.123.67.89</strong>?</p>
              <p className="text-[11px] font-bold text-amber-500 mb-6">This IP will be permanently blocked from accessing the system.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowBlockModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button onClick={() => setShowBlockModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-1.5"><Ban size={14} /> Block IP</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
