import { useState } from "react";
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
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─── Types ─── */
type Severity = "critical" | "warning" | "info";
type ActionType = "APPROVE" | "DELETE" | "UPDATE" | "EXPORT" | "CREATE" | "VIEW" | "REJECT" | "RUN" | "PROCESS";
type ModuleType = "Payroll" | "Expenses" | "Increment" | "Finance Reports" | "Payroll Settings" | "F&F Settlement";

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

/* ─── Mock Data (Finance-scoped only) ─── */
const LOGS: AuditLogEntry[] = [
  { id: "f1", timestamp: "Today 11:30 AM", user: "Ananya Das", userRole: "Finance", action: "RUN", module: "Payroll", record: "Payroll April 2026 processing initiated — 284 employees", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info" },
  { id: "f2", timestamp: "Today 10:45 AM", user: "Rahul Verma", userRole: "Finance", action: "APPROVE", module: "Expenses", record: "Expense #EXP-4231 approved — ₹45,000 — James Carter", ip: "10.0.0.9", device: "Safari/Mac", severity: "info" },
  { id: "f3", timestamp: "Today 10:12 AM", user: "Unknown", userRole: "—", action: "EXPORT", module: "Finance Reports", record: "Quarterly budget report exported — external IP detected", ip: "203.45.67.89", device: "Chrome/Windows", severity: "critical", isFlagged: true },
  { id: "f4", timestamp: "Today 9:35 AM", user: "Ananya Das", userRole: "Finance", action: "UPDATE", module: "Payroll Settings", record: "TAX slab updated for FY 2026-27 — new regime", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info", oldValue: "Old regime: 20% slab at ₹12L", newValue: "New regime: 20% slab at ₹15L" },
  { id: "f5", timestamp: "Today 9:00 AM", user: "Rahul Verma", userRole: "Finance", action: "APPROVE", module: "Increment", record: "Increment approved for Meera Thomas — 12% raise", ip: "10.0.0.9", device: "Safari/Mac", severity: "info" },
  { id: "f6", timestamp: "Yesterday 5:30 PM", user: "Ananya Das", userRole: "Finance", action: "PROCESS", module: "F&F Settlement", record: "F&F settlement processed — Priya Sharma — ₹1,51,000", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info" },
  { id: "f7", timestamp: "Yesterday 4:15 PM", user: "Rahul Verma", userRole: "Finance", action: "APPROVE", module: "Expenses", record: "Bulk expense approval — 12 travel claims — ₹2,34,000", ip: "10.0.0.9", device: "Safari/Mac", severity: "warning", isFlagged: true },
  { id: "f8", timestamp: "Yesterday 3:00 PM", user: "Ananya Das", userRole: "Finance", action: "REJECT", module: "Expenses", record: "Expense #EXP-4189 rejected — ₹12,000 — out of policy", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info" },
  { id: "f9", timestamp: "Yesterday 2:00 PM", user: "Suresh Iyer", userRole: "HR Manager", action: "VIEW", module: "Finance Reports", record: "Salary budget report accessed by HR", ip: "10.0.0.12", device: "Chrome/Windows", severity: "info" },
  { id: "f10", timestamp: "Yesterday 11:30 AM", user: "Ananya Das", userRole: "Finance", action: "UPDATE", module: "Increment", record: "Bulk increment spreadsheet uploaded for FY 2026-27", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info" },
  { id: "f11", timestamp: "Apr 4 5:00 PM", user: "Rahul Verma", userRole: "Finance", action: "DELETE", module: "Payroll Settings", record: "Archived payroll template 'FY2025-Old' deleted", ip: "10.0.0.9", device: "Safari/Mac", severity: "info" },
  { id: "f12", timestamp: "Apr 4 2:30 PM", user: "Ananya Das", userRole: "Finance", action: "RUN", module: "Payroll", record: "Payroll dry run completed — no errors detected", ip: "10.0.0.8", device: "Chrome/Windows", severity: "info" },
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
  CREATE: { chip: "bg-[#DCFCE7] text-[#00B87C] border-[#A7F3D0]" },
  VIEW: { chip: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  REJECT: { chip: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]" },
  RUN: { chip: "bg-[#EDE9FE] text-[#8B5CF6] border-[#DDD6FE]" },
  PROCESS: { chip: "bg-[#DCFCE7] text-[#00B87C] border-[#A7F3D0]" },
};

/* ─── Sub-components ─── */
function KPICard({ title, value, sub, color, icon: Icon }: { title: string; value: string; sub: string; color: "green" | "red" | "purple" | "amber"; icon: React.ElementType }) {
  const colors = { green: { text: "#00B87C", bg: "#DCFCE7" }, red: { text: "#EF4444", bg: "#FEE2E2" }, purple: { text: "#8B5CF6", bg: "#EDE9FE" }, amber: { text: "#D97706", bg: "#FEF3C7" } };
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colors[color].bg }}>
        <Icon size={20} style={{ color: colors[color].text }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-[28px] font-bold tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
      <p className="text-[12px] text-[#6B7280] mt-1">{sub}</p>
    </motion.div>
  );
}

function FilterSelect({ label }: { label: string }) {
  const [value, setValue] = useState(label);
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="appearance-none flex items-center gap-2.5 px-4 pr-10 py-2.5 bg-card border border-border rounded-xl text-[12px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm outline-none cursor-pointer"
      >
        <option value={label}>{label}</option>
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-[#00B87C] transition-colors" />
    </div>
  );
}

/* ─── Main Component ─── */
export function FinanceAuditLogs() {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [flaggedFilter, setFlaggedFilter] = useState(false);

  const todayLogs = LOGS.filter(l => l.timestamp.startsWith("Today")).length;
  const flaggedCount = LOGS.filter(l => l.isFlagged).length;
  const payrollEvents = LOGS.filter(l => l.module === "Payroll").length;
  const expenseApprovals = LOGS.filter(l => l.module === "Expenses").length;

  const displayedLogs = flaggedFilter ? LOGS.filter(l => l.isFlagged) : LOGS;

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
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all">
            <Download size={18} /> Export Logs
          </button>
        </div>
      </div>

      {/* SCOPE RESTRICTION BANNER */}
      <div className="flex items-start gap-3 px-5 py-3.5 bg-[#EDE9FE] border-l-4 border-[#8B5CF6] rounded-xl">
        <Info size={18} className="text-[#8B5CF6] shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-bold text-[#6D28D9]">You are viewing Finance-related activity only.</p>
          <p className="text-[11px] font-medium text-[#6D28D9]/80">HR, recruitment, and system settings are not visible in your scope.</p>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-6 px-5 py-3.5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00B87C]" /><span className="text-[12px] font-bold text-foreground">{todayLogs} finance actions logged today</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[12px] font-bold text-foreground">{flaggedCount} suspicious activities flagged</span></div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="FINANCE ACTIONS TODAY" value="124" sub="across all finance modules" color="green" icon={FileText} />
        <KPICard title="FLAGGED (FINANCE)" value="0" sub="no issues detected" color="green" icon={AlertTriangle} />
        <KPICard title="PAYROLL EVENTS" value="8" sub="this week" color="purple" icon={IndianRupee} />
        <KPICard title="EXPENSE APPROVALS LOGGED" value="36" sub="this month" color="amber" icon={CheckCircle2} />
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
        <button 
          onClick={() => {
            setFlaggedFilter(false);
            showToast("Filters Reset", "info", "All filters have been cleared.");
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
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
              <button onClick={() => setShowFlags(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-black text-muted-foreground uppercase tracking-wider hover:bg-[#00B87C]/[0.08]/50 transition-all">Dismiss</button>
              <button onClick={() => { setFlaggedFilter(true); setShowFlags(false); }} className="text-[12px] font-black text-[#EF4444] hover:underline">Review All Flags →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIT LOG TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">SYSTEM AUDIT LOG</h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#00B87C]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" /><span className="text-[9px] font-black text-[#00B87C] uppercase tracking-wider">Live</span></span>
          </div>
          {flaggedFilter && <button onClick={() => setFlaggedFilter(false)} className="text-[11px] font-black text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"><X size={14} /> Clear filter</button>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 dark:bg-muted/10 border-b border-border">
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
              {displayedLogs.map((log) => {
                const sev = SEV_CONFIG[log.severity];
                const act = ACTION_CONFIG[log.action];
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-[#00B87C]/[0.08] transition-all cursor-pointer"
                    style={{ borderLeft: log.severity === "critical" ? "3px solid #EF4444" : log.severity === "warning" ? "3px solid #F59E0B" : "3px solid transparent", minHeight: "52px" }}
                    onClick={() => setSelectedLog(log)}
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
                    <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${act.chip}`}>{log.action}</span></td>
                    <td className="px-5 py-3"><span className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-[11px] font-semibold">{log.module}</span></td>
                    <td className="px-5 py-3"><span className="text-[12px] font-medium text-foreground">{log.record}</span></td>
                    <td className="px-5 py-3"><span className={`text-[11px] font-mono font-bold ${log.severity === "critical" ? "text-[#EF4444]" : "text-muted-foreground"}`}>{log.ip}</span></td>
                    <td className="px-5 py-3"><span className="text-[11px] font-medium text-muted-foreground">{log.device}</span></td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sev.chip}`}>{sev.icon} {sev.label}</span></td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }} className={`text-[11px] font-black ${log.severity === "critical" ? "text-[#EF4444]" : "text-[#00B87C]"} hover:underline whitespace-nowrap`}>
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
        <span className="text-[12px] font-bold text-muted-foreground">Showing 1–25 of 124 logs</span>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all"><ChevronLeft size={16} /></button>
          <button className="w-8 h-8 rounded-xl bg-[#00B87C] text-white text-[12px] font-black flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">3</button>
          <span className="text-[12px] font-bold text-muted-foreground px-1">...</span>
          <button className="w-8 h-8 rounded-xl border border-border text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all flex items-center justify-center">5</button>
          <button className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* ─── AUDIT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSelectedLog(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-[520px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedLog.severity === "critical" ? "bg-[#FEF2F2]" : selectedLog.severity === "warning" ? "bg-[#FFFBEB]" : "bg-[#F0FDF4]"}`}>
                    {selectedLog.severity === "critical" ? <ShieldAlert size={18} className="text-[#EF4444]" /> : selectedLog.severity === "warning" ? <AlertTriangle size={18} className="text-[#D97706]" /> : <CheckCircle2 size={18} className="text-[#00B87C]" />}
                  </div>
                  <h3 className="text-[16px] font-black text-foreground tracking-tight">Audit Log Detail</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"><X size={16} className="text-muted-foreground" /></button>
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
              </div>

              <div className="px-6 py-4 border-t border-border bg-muted/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast("Exporting Log", "info", "Downloading log entry...")}
                    className="px-3 py-2 rounded-xl border border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLog.severity !== "info" && (
                    <>
                      <button 
                        onClick={() => {
                          showToast("Log Flagged", "warning", "Log marked for further investigation.");
                          setSelectedLog(null);
                        }}
                        className="px-3 py-2 rounded-xl border border-amber-500/30 text-[11px] font-semibold text-amber-500 uppercase tracking-widest hover:bg-amber-500/5 transition-all flex items-center gap-1.5"
                      >
                        <Flag size={13} /> Flag
                      </button>
                      <button 
                        onClick={() => {
                          showToast("Log Reviewed", "success", "Log marked as reviewed.");
                          setSelectedLog(null);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#00B87C]/10 text-[#00B87C] text-[11px] font-bold uppercase tracking-widest hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20 flex items-center gap-1.5"
                      >
                        <Check size={13} /> Mark Reviewed
                      </button>
                    </>
                  )}
                  {selectedLog.severity === "critical" && (
                    <button onClick={() => { setSelectedLog(null); setShowBlockModal(true); }} className="px-3 py-2 rounded-xl border border-[#EF4444]/30 text-[11px] font-semibold text-[#EF4444] uppercase tracking-widest hover:bg-[#EF4444]/5 transition-all flex items-center gap-1.5"><Ban size={13} /> Block IP</button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EXPORT MODAL (Finance-scoped) ─── */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowExportModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-[440px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center"><Download size={18} className="text-[#6B7280]" /></div>
                  <h3 className="text-[15px] font-bold text-foreground tracking-tight">Export Audit Logs</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"><X size={16} className="text-muted-foreground" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">From</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                  <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">To</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" /></div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Modules (Finance scope)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All","Payroll","Expenses","Increment","Finance Reports","Payroll Settings","F&F Settlement"].map(m => (
                      <button key={m} className="px-2.5 py-1 rounded-lg bg-[#00B87C]/10 text-[#00B87C] text-[11px] font-semibold border border-[#00B87C]/20">{m}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Format</label><div className="flex gap-2">{["CSV","PDF","Excel"].map(f => <button key={f} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${f === "CSV" ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border text-muted-foreground hover:border-[#00B87C]/50"}`}>{f}</button>)}</div></div>
                <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">Severity</label><div className="flex gap-2">{["All","Critical only","Warning+"].map(s => <button key={s} className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider border ${s === "All" ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border text-muted-foreground hover:border-[#00B87C]/50"}`}>{s}</button>)}</div></div>
                <div className="px-3 py-2 rounded-xl bg-[#EDE9FE] border border-[#8B5CF6]/20 flex items-center gap-2">
                  <Info size={14} className="text-[#8B5CF6] shrink-0" />
                  <span className="text-[11px] font-bold text-[#6D28D9]">Export limited to Finance modules per your access scope.</span>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button 
                  onClick={() => {
                    setShowExportModal(false);
                    showToast("Export Started", "success", "Audit logs are being exported.");
                  }} 
                  className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Download size={14} /> Export
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="relative w-full max-w-sm bg-card rounded-2xl p-8 text-center shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4"><Ban size={24} className="text-[#EF4444]" /></div>
              <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Block IP Address</h3>
              <p className="text-[13px] font-medium text-muted-foreground mb-1">Are you sure you want to block <strong className="text-foreground">{selectedLog?.ip || "203.45.67.89"}</strong>?</p>
              <p className="text-[11px] font-bold text-amber-500 mb-6">This IP will be permanently blocked from accessing the system.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowBlockModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
                <button 
                  onClick={() => {
                    setShowBlockModal(false);
                    showToast("IP Blocked", "success", "The IP address has been permanently blocked.");
                  }} 
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
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
