import { 
  Users, Star, 
  MessageSquare, TrendingUp, UserPlus,
  Briefcase, GraduationCap, Award, Coffee
} from "lucide-react";
import { motion } from "motion/react";

const TEAM_STATS = [
  { label: "TEAM SIZE", value: "12", sub: "10 Full-time", color: "#F59E0B", bg: "#FEF3C7" },
  { label: "ATTENDANCE", value: "100%", sub: "Everyone present", color: "#10B981", bg: "#DCFCE7" },
  { label: "AVG PERFORMANCE", value: "4.8", sub: "Top 10% in dept", color: "#8B5CF6", bg: "#EDE9FE" },
  { label: "TASKS PENDING", value: "24", sub: "6 high priority", color: "#EF4444", bg: "#FEE2E2" },
];

const MY_TEAM = [
  { name: "John Doe", role: "Sr. Frontend Dev", status: "Present", avatar: "JD", performance: 4.9 },
  { name: "Jane Smith", role: "UI Designer", status: "Present", avatar: "JS", performance: 4.7 },
  { name: "Mike Ross", role: "Backend Dev", status: "On Leave", avatar: "MR", performance: 4.8 },
  { name: "Rachel Zane", role: "Product Manager", status: "Present", avatar: "RZ", performance: 5.0 },
  { name: "Harvey Specter", role: "Team Lead", status: "Present", avatar: "HS", performance: 4.9 },
];

const TEAM_ATTENDANCE = [
  { avatar: "JD", name: "John" },
  { avatar: "JS", name: "Jane" },
  { avatar: "MR", name: "Mike", onLeave: true },
  { avatar: "RZ", name: "Rachel" },
  { avatar: "HS", name: "Harvey" },
  { avatar: "DL", name: "Donna" },
  { avatar: "LL", name: "Louis" },
];

const PENDING_APPROVALS = [
  { type: "Leave", user: "Jane Smith", info: "Apr 12 - 14 (3 days)", urgency: "Medium" },
  { type: "Expense", user: "John Doe", info: "₹2,400 (Client Dinner)", urgency: "Low" },
  { type: "Overtime", user: "Mike Ross", info: "4 hours (Project Launch)", urgency: "High" },
];

export function ManagerDashboard() {
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">
            <Users size={28} className="text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-foreground tracking-tight">Manager Dashboard</h2>
            <p className="text-[13px] font-semibold text-muted-foreground">Engineering Team · 12 direct reports</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-colors">
            Team Schedule
          </button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:opacity-90 shadow-lg shadow-primary/20">
            Post Announcement
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">3 pending team approvals</span>
        </div>
        <div className="flex items-center gap-2 border-l border-amber-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">Everyone is clocked in on time</span>
        </div>
        <div className="flex items-center gap-2 border-l border-amber-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">Next performance review: April 15</span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEAM_STATS.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
              <Users size={24} style={{ color: kpi.color }} />
            </div>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-foreground tracking-tighter mb-1">{kpi.value}</p>
            <p className="text-[12px] font-bold text-muted-foreground">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ ROW 2 — TEAM TABLE & APPROVALS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="lg:col-span-2 bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">My Team</h3>
            <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">Manage Team</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Performance</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MY_TEAM.map((member, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-[11px]">
                          {member.avatar}
                        </div>
                        <span className="text-sm font-bold text-foreground">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-muted-foreground">{member.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-[11px] font-bold text-foreground">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[13px] font-black">{member.performance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground"><MessageSquare size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Team Approvals</h3>
          </div>
          <div className="divide-y divide-border">
            {PENDING_APPROVALS.map((app, i) => (
              <div key={i} className="p-4 space-y-3 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    app.type === 'Leave' ? 'bg-emerald-50 text-emerald-600' :
                    app.type === 'Expense' ? 'bg-purple-50 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>{app.type} Request</span>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{app.urgency}</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-foreground">{app.user}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">{app.info}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors">Approve</button>
                  <button className="flex-1 py-1.5 rounded-lg bg-secondary text-foreground text-[11px] font-black uppercase tracking-wider hover:bg-border transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center border-t border-border">
            <button className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">Go to Approval Center</button>
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — TEAM ATTENDANCE & ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Team Attendance Today</h3>
            <span className="text-[11px] font-bold text-emerald-600">11 / 12 Present</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {TEAM_ATTENDANCE.map((member, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all group-hover:scale-110 ${
                  member.onLeave ? 'bg-secondary text-muted-foreground grayscale' : 'bg-amber-100 text-amber-700 ring-2 ring-emerald-500 ring-offset-2 ring-offset-card'
                }`}>
                  {member.avatar}
                  {!member.onLeave && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" />}
                </div>
                <span className="text-[11px] font-bold text-foreground">{member.name}</span>
              </div>
            ))}
            <button className="w-14 h-14 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
              <UserPlus size={20} />
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Quick Team Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Briefcase, label: "Assign Task", color: "#8B5CF6", bg: "#EDE9FE" },
              { icon: GraduationCap, label: "Training", color: "#10B981", bg: "#DCFCE7" },
              { icon: Award, label: "Reward", color: "#F59E0B", bg: "#FEF3C7" },
              { icon: Coffee, label: "1:1 Meeting", color: "#0EA5E9", bg: "#E0F2FE" },
              { icon: MessageSquare, label: "Chat Team", color: "#64748B", bg: "#F3F4F6" },
              { icon: TrendingUp, label: "Perf Review", color: "#EF4444", bg: "#FEE2E2" },
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
