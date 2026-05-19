import { 
  Users, Calendar, 
  Plus, 
  TrendingUp,  Receipt,
  MessageSquare,
  X,
  UserSearch,
  
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from "recharts";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

// ─── MOCK DATA ───────────────────────────────────

const ATTENDANCE_TREND = [
  { date: "01 May", rate: 92 },
  { date: "02 May", rate: 88 },
  { date: "03 May", rate: 94 },
  { date: "04 May", rate: 91 },
  { date: "05 May", rate: 95 },
  { date: "06 May", rate: 93 },
  { date: "07 May", rate: 92 },
  { date: "08 May", rate: 91 },
  { date: "09 May", rate: 89 },
  { date: "10 May", rate: 90 },
  { date: "11 May", rate: 92 },
  { date: "12 May", rate: 94 },
  { date: "13 May", rate: 93 },
  { date: "14 May", rate: 91.6 },
];

const TEAM_COMPOSITION = [
  { name: "Active", value: 10, color: "#00B87C" },
  { name: "On Leave", value: 1, color: "#EF4444" },
  { name: "WFH", value: 1, color: "#0EA5E9" },
];

const TEAM_MEMBERS = [
  { name: "Priya Sharma", dept: "Engineering", avatar: "PS", attendance: "98%", shift: "Day Shift", status: "Present", shiftColor: "#FEF3C7", shiftText: "#92400E" },
  { name: "Dev Patel", dept: "Engineering", avatar: "DP", attendance: "78%", shift: "Day Shift", status: "At Risk", shiftColor: "#FEF3C7", shiftText: "#92400E" },
  { name: "Anish Kumar", dept: "Engineering", avatar: "AK", attendance: "95%", shift: "Night Shift", status: "Present", shiftColor: "#E0F2FE", shiftText: "#0369A1" },
  { name: "Sanya Gupta", dept: "Engineering", avatar: "SG", attendance: "92%", shift: "Day Shift", status: "WFH", shiftColor: "#FEF3C7", shiftText: "#92400E" },
];

const PENDING_APPROVALS = [
  { name: "Priya Sharma", type: "Annual Leave", date: "Apr 20 - 22", avatar: "PS", badge: "Leave" },
  { name: "Anish Kumar", type: "Travel Expense", date: "Apr 15", avatar: "AK", badge: "Expense" },
  { name: "Sanya Gupta", type: "WFH Request", date: "Apr 18", avatar: "SG", badge: "WFH" },
];

const DEPT_PERFORMANCE = [
  { metric: "Attendance", team: 92, company: 88 },
  { metric: "Performance", team: 85, company: 80 },
  { metric: "Goal Completion", team: 78, company: 75 },
  { metric: "Training", team: 95, company: 90 },
];

const TEAM_TODAY = [
  { id: 1, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { id: 2, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { id: 3, status: 'leave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  { id: 4, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  { id: 5, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
  { id: 6, status: 'wfh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
  { id: 7, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
  { id: 8, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
  { id: 9, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9' },
  { id: 10, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10' },
  { id: 11, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11' },
  { id: 12, status: 'present', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12' },
];

export function ManagerDashboard() {
  const [activeRange, setActiveRange] = useState('1Y');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const navigate = useNavigate();

  const handleAction = (label: string) => {
    if (label === "Approve Leaves") setShowApproveModal(true);
    else if (label === "Add Shift") setShowAddShiftModal(true);
    else if (label === "Review Team") navigate("/employees");
    else if (label === "Team Report") navigate("/reports");
    else if (label === "Expense Approvals") navigate("/expenses");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shadow-inner">
            <Users size={28} className="text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-foreground tracking-tight">Team Dashboard</h2>
            <p className="text-[13px] font-semibold text-muted-foreground">Engineering Team · 12 direct reports</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-[#00B87C] animate-pulse" />
            <span className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest">Live</span>
          </div>
          <button 
            onClick={() => setShowApproveModal(true)}
            className="px-5 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-all text-foreground"
          >
            Approve Leaves
          </button>
          <button 
            onClick={() => setShowAddShiftModal(true)}
            className="px-5 py-2 rounded-xl bg-[#00B87C] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
          >
            Team Schedule
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border flex flex-wrap items-center gap-y-3 gap-x-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">3 leave requests need approval</span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-border md:pl-8">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">2 team members on overtime</span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-border md:pl-8">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">Performance reviews due Apr 25</span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-border md:pl-8">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">Dev Patel attendance at risk (78%)</span>
        </div>
      </div>

      {/* ═══ KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MY TEAM", value: "12", sub: "direct reports", change: "+1 this month", color: "#00B87C", bg: "#DCFCE7", isPositive: true },
          { label: "TEAM ATTENDANCE", value: "91.6%", sub: "11/12 present today", change: "", color: "#00B87C", bg: "#DCFCE7", isPositive: true },
          { label: "ON LEAVE TODAY", value: "1", sub: "Priya Sharma", change: "", color: "#F59E0B", bg: "#FEF3C7", isPositive: false },
          { label: "TEAM OVERTIME", value: "42h", sub: "+8h vs last week", change: "+8h", color: "#F59E0B", bg: "#FEF3C7", isPositive: false },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-[20px] border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                <Users size={20} style={{ color: kpi.color }} />
              </div>
              {kpi.change && (
                <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {kpi.change}
                </div>
              )}
            </div>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-foreground tracking-tighter mb-1">{kpi.value}</p>
            <p className="text-[11px] font-bold text-muted-foreground">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Trend (70%) */}
        <div className="lg:col-span-8 bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Team Attendance Trend</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">Average daily attendance rate</p>
            </div>
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-full">
              {['6M', '1Y'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveRange(f)}
                  className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${activeRange === f ? 'bg-white text-black shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                  domain={[80, 100]}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#00B87C" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#00B87C', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Composition (30%) */}
        <div className="lg:col-span-4 bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-8">Team Composition</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={TEAM_COMPOSITION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {TEAM_COMPOSITION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-foreground">12</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="w-full mt-8 space-y-3">
              {TEAM_COMPOSITION.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[12px] font-bold text-foreground">{item.name}</span>
                  </div>
                  <span className="text-[12px] font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Team Members (7/12 span) */}
        <div className="lg:col-span-7 bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Team Members</h3>
            <button 
              onClick={() => navigate("/employees")}
              className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/20">
                  <th className="px-6 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Attendance</th>
                  <th className="px-6 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shift Today</th>
                  <th className="px-6 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TEAM_MEMBERS.map((emp, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#00B87C] font-black text-[10px] shrink-0">
                          {emp.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-foreground truncate">{emp.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{emp.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[12px] font-black ${emp.status === 'At Risk' ? 'text-red-500' : 'text-foreground'}`}>{emp.attendance}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                        style={{ backgroundColor: emp.shiftColor, color: emp.shiftText }}
                      >
                        {emp.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Present' ? 'bg-[#00B87C]' : 
                          emp.status === 'WFH' ? 'bg-[#0EA5E9]' : 'bg-red-500 animate-pulse'
                        }`} />
                        <span className="text-[11px] font-bold text-foreground">{emp.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Manager Actions (5/12 span) */}
        <div className="lg:col-span-5 bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-8">Quick Manager Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {[
              { icon: CalendarDays, label: "Approve Leaves", color: "#F59E0B", bg: "#FEF3C7" },
              { icon: Plus, label: "Add Shift", color: "#00B87C", bg: "#DCFCE7" },
              { icon: UserSearch, label: "Review Team", color: "#8B5CF6", bg: "#EDE9FE" },
              { icon: Receipt, label: "Expense Approvals", color: "#F59E0B", bg: "#FEF3C7" },
              { icon: BarChart3, label: "Team Report", color: "#64748B", bg: "#F3F4F6" },
              { icon: MessageSquare, label: "Message Team", color: "#0EA5E9", bg: "#E0F2FE" },
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={() => handleAction(action.label)}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary hover:border-[#00B87C]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: action.bg }}>
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <span className="text-[12px] font-bold text-foreground text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-lg font-black text-foreground">Approve Team Leaves</h3>
              <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {PENDING_APPROVALS.filter(a => a.badge === 'Leave').map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.type} • {item.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-[#00B87C] text-white text-[11px] font-bold">Approve</button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-[11px] font-bold">Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-secondary/10 flex justify-end gap-3">
              <button onClick={() => setShowApproveModal(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-foreground hover:bg-secondary">Close</button>
              <button className="px-6 py-2 rounded-xl bg-[#00B87C] text-white text-sm font-bold">Approve All</button>
            </div>
          </motion.div>
        </div>
      )}

      {showAddShiftModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-lg font-black text-foreground">Add New Team Shift</h3>
              <button onClick={() => setShowAddShiftModal(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Select Employee</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#00B87C] outline-none">
                  {TEAM_MEMBERS.map(e => <option key={e.name}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Shift Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 rounded-xl border-2 border-[#00B87C] bg-emerald-50 dark:bg-emerald-500/10 text-[#00B87C] text-xs font-black uppercase tracking-widest">Day Shift</button>
                  <button className="p-3 rounded-xl border border-border hover:bg-secondary text-foreground text-xs font-black uppercase tracking-widest transition-all">Night Shift</button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-secondary/10 flex justify-end gap-3">
              <button onClick={() => setShowAddShiftModal(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-foreground hover:bg-secondary">Cancel</button>
              <button className="px-6 py-2 rounded-xl bg-[#00B87C] text-white text-sm font-bold">Assign Shift</button>
            </div>
          </motion.div>
        </div>
      )}
      {/* ═══ SECOND ROW — PERFORMANCE & Pending Approvals & Team Today's Attendance  ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Department Performance (55%) */}
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Department Performance</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">Team average vs. company average</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#00B87C]" />
                <span className="text-[10px] font-bold text-muted-foreground">Team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#F3F4F6] dark:bg-zinc-800" />
                <span className="text-[10px] font-bold text-muted-foreground">Company</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_PERFORMANCE} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="metric" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}}
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="team" fill="#00B87C" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="company" fill="var(--secondary)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals & Team Today */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:col-span-1">
          {/* Center: Pending Approvals */}
          <div className="bg-card rounded-[24px] border border-border shadow-sm flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Pending Approvals</h3>
              <button 
                onClick={() => navigate("/leave")}
                className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {PENDING_APPROVALS.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-border flex items-center justify-center text-[#00B87C] font-black text-xs shrink-0 shadow-sm">
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-foreground truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          item.badge === 'Leave' ? 'bg-amber-50 text-amber-600' :
                          item.badge === 'Expense' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {item.badge} Request
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar size={13} />
                      <span className="text-[11px] font-bold">{item.date}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <button className="py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90">Approve</button>
                    <button className="py-2 rounded-xl bg-card border border-border text-foreground text-[11px] font-black uppercase tracking-widest hover:bg-secondary">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Team Today */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Team Today</h3>
              <span className="text-[11px] font-black text-[#00B87C]">10 / 12</span>
            </div>
            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
              {TEAM_TODAY.map((member) => (
                <div key={member.id} className="flex flex-col items-center gap-2">
                  <div className={`relative w-12 h-12 rounded-full p-0.5 ${
                    member.status === 'present' ? 'border-2 border-[#00B87C]' :
                    member.status === 'leave' ? 'border-2 border-red-500' : 'border-2 border-[#0EA5E9]'
                  }`}>
                    <img src={member.avatar} alt="avatar" className="w-full h-full rounded-full bg-secondary object-cover" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === 'present' ? 'bg-[#00B87C]' :
                      member.status === 'leave' ? 'bg-red-500' : 'bg-[#0EA5E9]'
                    }`} />
                  </div>
                </div>
              ))}
              <button className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-[#00B87C] hover:text-[#00B87C] transition-all">
                <Plus size={20} />
              </button>
            </div>
            <div className="mt-auto pt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
                <span className="text-[10px] font-bold text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-muted-foreground">Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                <span className="text-[10px] font-bold text-muted-foreground">WFH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using icon from lucide-react (handled by import)
const CalendarDays = Calendar;
const BarChart3 = TrendingUp;
