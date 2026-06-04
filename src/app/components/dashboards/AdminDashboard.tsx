import { 
  Users, Building, Calendar, IndianRupee, Shield, Settings, 
  Activity, 
  UserCheck, ShieldCheck, ArrowRight, ClipboardList,
  Database, Lock, Megaphone, BarChart3, UserPlus
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { motion } from "motion/react";

const HEADCOUNT_TREND = [
  { month: "Oct", count: 1240 },
  { month: "Nov", count: 1252 },
  { month: "Dec", count: 1260 },
  { month: "Jan", count: 1272 },
  { month: "Feb", count: 1278 },
  { month: "Mar", count: 1284 },
];

const DEPT_DATA = [
  { name: "Engineering", value: 450, color: "#8B5CF6" },
  { name: "Sales", value: 320, color: "#10B981" },
  { name: "Marketing", value: 180, color: "#F59E0B" },
  { name: "Finance", value: 120, color: "#0EA5E9" },
  { name: "HR", value: 114, color: "#EC4899" },
];

const PENDING_ACTIONS = [
  { icon: ShieldCheck, title: "Role approval needed", urgency: "High", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  { icon: IndianRupee, title: "Payroll run due in 3 days", urgency: "Medium", color: "#00B87C", bg: "rgba(0,184,124,0.1)" },
  { icon: ClipboardList, title: "HR Policy update required", urgency: "Low", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { icon: Lock, title: "Security audit overdue", urgency: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  { icon: UserCheck, title: "12 new hires onboarding", urgency: "Medium", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
];

const AUDIT_LOG = [
  { type: "Delete", text: "Employee record #EMP-042 deleted", user: "Admin", time: "10m ago", color: "#EF4444" },
  { type: "Approve", text: "Bulk leave approval processed", user: "HR Mgr", time: "1h ago", color: "#00B87C" },
  { type: "Update", text: "Salary structure modified", user: "Finance", time: "2h ago", color: "#8B5CF6" },
  { type: "Create", text: "New department 'AI Research' created", user: "Admin", time: "4h ago", color: "#0EA5E9" },
  { type: "Settings", text: "MFA enforced for all managers", user: "Security", time: "1d ago", color: "#F59E0B" },
];

const MODULE_USAGE = [
  { label: "Dashboard", value: 98, color: "#00B87C" },
  { label: "Attendance", value: 94, color: "#00B87C" },
  { label: "Payroll", value: 86, color: "#8B5CF6" },
  { label: "Leave", value: 82, color: "#F59E0B" },
  { label: "Performance", value: 75, color: "#0EA5E9" },
];

const ROLE_DIST = [
  { role: "Super Admin", count: 4, status: "Active", color: "#8B5CF6", bg: "#EDE9FE" },
  { role: "HR Manager", count: 12, status: "Active", color: "#00B87C", bg: "#DCFCE7" },
  { role: "Finance", count: 8, status: "Active", color: "#0EA5E9", bg: "#E0F2FE" },
  { role: "Manager", count: 42, status: "Active", color: "#F59E0B", bg: "#FEF3C7" },
  { role: "Employee", count: 1218, status: "Active", color: "#64748B", bg: "#F3F4F6" },
];

export function AdminDashboard() {
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center">
            <Activity size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold text-[#111827]">Admin Dashboard</h2>
            <p className="text-[13px] text-[#6B7280]">Monday, April 6, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-bold text-emerald-700">Live</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-colors">
            View Reports
          </button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:opacity-90 shadow-lg shadow-primary/20">
            + Add Employee
          </button>
        </div>
      </div>

      {/* ═══ SYSTEM HEALTH BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">System: All services operational</span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">1,284 active users today</span>
        </div>
        <div className="flex items-center gap-2 border-l border-emerald-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">3 pending admin actions</span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Users, label: "TOTAL EMPLOYEES", value: "1,284", sub: "+12 this month", color: "#00B87C", bg: "#DCFCE7" },
          { icon: Building, label: "DEPARTMENTS", value: "7", sub: "All active", color: "#0EA5E9", bg: "#E0F2FE" },
          { icon: Calendar, label: "ATTENDANCE TODAY", value: "91%", sub: "1,102 present", color: "#00B87C", bg: "#DCFCE7" },
          { icon: IndianRupee, label: "PAYROLL THIS MONTH", value: "₹28.4L", sub: "Mar 2026", color: "#8B5CF6", bg: "#EDE9FE" },
          { icon: Shield, label: "SECURITY ALERTS", value: "0", sub: "All clear", color: "#EF4444", bg: "#FEE2E2" },
          { icon: Settings, label: "SYSTEM UPTIME", value: "99.9%", sub: "Last 30 days", color: "#111827", bg: "#F3F4F6" },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[10px] mb-3 flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-[28px] font-bold text-[#111827] mb-1">{kpi.value}</p>
            <p className="text-[12px] text-[#6B7280]">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ ROW 2 — CHARTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Headcount Trend</h3>
            <div className="flex gap-2">
              {['6M', '1Y', '2Y'].map(f => (
                <button key={f} className={`px-3 py-1 rounded-full text-[11px] font-black tracking-widest ${f === '6M' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEADCOUNT_TREND}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B87C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00B87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#00B87C" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">Dept Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEPT_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {DEPT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {DEPT_DATA.map((dept, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                <span className="text-[11px] font-bold text-muted-foreground truncate">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — ADMIN ACTIONS & LOGS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Pending Admin Actions</h3>
          </div>
          <div className="divide-y divide-border">
            {PENDING_ACTIONS.map((action, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.bg }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground leading-tight">{action.title}</p>
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: action.color }}>{action.urgency} Priority</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            ))}
          </div>
          <div className="p-4 text-center border-t border-border">
            <button className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">View All Actions</button>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Recent System Activity</h3>
          </div>
          <div className="p-6 space-y-6">
            {AUDIT_LOG.map((log, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== AUDIT_LOG.length - 1 && <div className="absolute left-[5px] top-4 w-[1px] h-full bg-border" />}
                <div className="w-[11px] h-[11px] rounded-full mt-1.5 z-10 shrink-0 border-2 border-card" style={{ backgroundColor: log.color }} />
                <div className="overflow-hidden">
                  <p className="text-[13px] font-bold text-foreground leading-tight">{log.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground font-medium">{log.user}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[11px] text-muted-foreground font-medium">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Usage */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Module Usage</h3>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[11px] font-black text-emerald-600 uppercase tracking-widest">Most used: Attendance 94%</span>
          </div>
          <div className="space-y-6 flex-1">
            {MODULE_USAGE.map((mod, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[12px] font-bold text-foreground">
                  <span>{mod.label}</span>
                  <span>{mod.value}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: mod.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM ROW — ROLES & QUICK ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm overflow-hidden">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">User Roles Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] dark:bg-white/5">
                  <th className="pb-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Role Name</th>
                  <th className="pb-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Members</th>
                  <th className="pb-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                  <th className="pb-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROLE_DIST.map((role, i) => (
                  <tr key={i} className="h-14 border-b border-[#F3F4F6] hover:bg-[#00B87C]/[0.08]">
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider" style={{ color: role.color, backgroundColor: role.bg }}>{role.role}</span>
                    </td>
                    <td className="py-4 font-bold text-foreground text-sm">{role.count}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-bold text-muted-foreground">{role.status}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[12px] font-bold text-primary hover:underline">Manage →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">Quick System Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: IndianRupee, label: "Run Payroll", color: "#8B5CF6", bg: "#EDE9FE" },
              { icon: UserPlus, label: "Add Employee", color: "#00B87C", bg: "#DCFCE7" },
              { icon: Megaphone, label: "Post Announcement", color: "#F59E0B", bg: "#FEF3C7" },
              { icon: BarChart3, label: "Export Reports", color: "#0EA5E9", bg: "#E0F2FE" },
              { icon: Database, label: "Backup Data", color: "#64748B", bg: "#F3F4F6" },
              { icon: ShieldCheck, label: "Security Scan", color: "#EF4444", bg: "#FEE2E2" },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-all group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: action.bg }}>
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <span className="text-[12px] font-bold text-foreground text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
