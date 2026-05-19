import { 
  IndianRupee, Users, Check, Calendar, Receipt, 
  Activity, CheckCircle,
  BarChart3, ChevronRight, Zap, Download, 
  FileSpreadsheet, ShieldCheck
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { motion } from "motion/react";

const PAYROLL_TREND = [
  { month: "Apr 25", cost: 24.2 },
  { month: "May 25", cost: 24.5 },
  { month: "Jun 25", cost: 25.1 },
  { month: "Jul 25", cost: 25.8 },
  { month: "Aug 25", cost: 26.2 },
  { month: "Sep 25", cost: 26.8 },
  { month: "Oct 25", cost: 27.1 },
  { month: "Nov 25", cost: 27.5 },
  { month: "Dec 25", cost: 27.8 },
  { month: "Jan 26", cost: 28.1 },
  { month: "Feb 26", cost: 28.2 },
  { month: "Mar 26", cost: 28.4 },
];

const COMPONENT_BREAKDOWN = [
  { name: "Basic", value: 50, color: "#8B5CF6" },
  { name: "HRA", value: 20, color: "#10B981" },
  { name: "Allowances", value: 15, color: "#F59E0B" },
  { name: "Bonus", value: 10, color: "#0EA5E9" },
  { name: "Others", value: 5, color: "#64748B" },
];

const PENDING_APPROVALS = [
  { id: "EXP-1284", employee: "Sarah Chen", category: "Travel", amount: "₹4,250", submitted: "2h ago", status: "Pending", avatar: "SC" },
  { id: "EXP-1285", employee: "Michael Roe", category: "Hardware", amount: "₹12,800", submitted: "5h ago", status: "Pending", avatar: "MR" },
  { id: "EXP-1286", employee: "David Smith", category: "Software", amount: "₹1,200", submitted: "1d ago", status: "Pending", avatar: "DS" },
  { id: "EXP-1287", employee: "Emily Chen", category: "Events", amount: "₹8,500", submitted: "1d ago", status: "Pending", avatar: "EC" },
  { id: "EXP-1288", employee: "Alex John", category: "Travel", amount: "₹2,100", submitted: "2d ago", status: "Pending", avatar: "AJ" },
];

const DEADLINES = [
  { title: "PF Payment Done", date: "Apr 10", status: "Done", color: "#00B87C" },
  { title: "TDS Filing", date: "Apr 15", status: "Active", color: "#0EA5E9" },
  { title: "Payroll Lock", date: "Apr 20", status: "Pending", color: "#64748B" },
  { title: "Payroll Run", date: "Apr 28", status: "Pending", color: "#64748B" },
];

const SALARY_DIST = [
  { label: "<₹30K", value: 450, color: "#8B5CF6" },
  { label: "₹30-50K", value: 380, color: "#10B981" },
  { label: "₹50-80K", value: 240, color: "#F59E0B" },
  { label: "₹80K+", value: 178, color: "#0EA5E9" },
];

export function FinanceDashboard() {
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] dark:bg-[#8B5CF6]/10 flex items-center justify-center shadow-inner">
            <IndianRupee size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-foreground tracking-tight">Finance Dashboard</h2>
            <p className="text-[13px] font-semibold text-muted-foreground">Payroll, expenses and financial overview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live</span>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[14px] font-bold hover:bg-[#00a36e] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2">
            <Zap size={16} fill="white" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-[#DCFCE7]/40 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 flex flex-wrap items-center gap-y-3 gap-x-8 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">Payroll due: <span className="text-foreground">April 28</span></span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-emerald-200/50 dark:border-emerald-800/50 md:pl-8">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight"><span className="text-foreground">36</span> pending expense approvals</span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-emerald-200/50 dark:border-emerald-800/50 md:pl-8">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">TDS filing deadline: <span className="text-foreground">April 15</span></span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-emerald-200/50 dark:border-emerald-800/50 md:pl-8">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">PF payment due: <span className="text-foreground">April 20</span></span>
        </div>
      </div>

      {/* ═══ KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: IndianRupee, label: "MONTHLY PAYROLL", value: "₹28.4L", sub: "March 2026", color: "#8B5CF6", bg: "#EDE9FE" },
          { icon: Users, label: "EMPLOYEES PAID", value: "1,248", sub: "of 1,284 total", color: "#10B981", bg: "#DCFCE7" },
          { icon: Check, label: "APPROVED INCREMENTS", value: "5", sub: "this cycle", color: "#10B981", bg: "#DCFCE7" },
          { icon: Calendar, label: "PAYROLL LOCK DATE", value: "Apr 20", sub: "14 days away", color: "#0EA5E9", bg: "#E0F2FE" },
          { icon: Receipt, label: "PENDING EXPENSES", value: "₹42.8K", sub: "36 claims", color: "#F59E0B", bg: "#FEF3C7" },
          { icon: BarChart3, label: "YTD PAYROLL COST", value: "₹3.2Cr", sub: "FY 2025-26", color: "#111827", bg: "#F3F4F6" },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-[20px] border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-foreground tracking-tighter mb-1" style={{ color: kpi.color === '#111827' ? undefined : kpi.color }}>{kpi.value}</p>
            <p className="text-[11px] font-bold text-muted-foreground">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Monthly Payroll Trend</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">Salary expenditure across financial year</p>
            </div>
            <div className="flex gap-1.5 bg-secondary/50 p-1 rounded-full">
              {['6M', '1Y'].map(f => (
                <button key={f} className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${f === '1Y' ? 'bg-[#00B87C] text-white' : 'text-muted-foreground hover:bg-secondary'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAYROLL_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} unit="L" />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 92, 246, 0.05)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="cost" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Salary Components Breakdown</h3>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPONENT_BREAKDOWN} innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value">
                  {COMPONENT_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">₹28.4L</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Monthly</span>
            </div>
          </div>
          <div className="mt-8 space-y-3.5">
            {COMPONENT_BREAKDOWN.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] font-bold text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black text-foreground">{item.value}%</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-[9px] font-black text-emerald-600 dark:text-emerald-400">↑ 1.2%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECOND ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column (60%) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Payroll Processing Status */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-10">Payroll Processing Status</h3>
            
            {/* Horizontal Stepper */}
            <div className="flex items-center justify-between relative px-2 mb-10">
              <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-border z-0 mx-8" />
              {[
                { label: "Data Collection", status: "Done" },
                { label: "Attendance Lock", status: "Done" },
                { label: "Calculation", status: "Active" },
                { label: "Approval", status: "Pending" },
                { label: "Disbursement", status: "Pending" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    step.status === 'Done' ? 'bg-[#00B87C] border-[#00B87C] text-white' : 
                    step.status === 'Active' ? 'bg-card border-[#0EA5E9] text-[#0EA5E9] shadow-[0_0_15px_rgba(14,165,233,0.3)] animate-pulse' : 
                    'bg-card border-border text-muted-foreground'
                  }`}>
                    {step.status === 'Done' ? <Check size={16} strokeWidth={3} /> : 
                     step.status === 'Active' ? <Activity size={16} /> : 
                     <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] ${
                    step.status === 'Done' ? 'text-[#00B87C]' : 
                    step.status === 'Active' ? 'text-[#0EA5E9]' : 
                    'text-muted-foreground'
                  }`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 w-fit">
              <Activity size={14} className="text-[#00B87C] animate-spin" />
              <span className="text-[12px] font-bold text-[#00B87C]">Current Stage: Calculation in progress</span>
            </div>
          </div>

          {/* Pending Expense Approvals Table */}
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Pending Expense Approvals</h3>
              <button className="text-[11px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submitted</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PENDING_APPROVALS.map((exp, i) => (
                    <tr key={i} className="hover:bg-secondary/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] font-black text-[10px]">
                            {exp.avatar}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-foreground leading-none">{exp.employee}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{exp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-lg bg-secondary text-foreground text-[10px] font-black uppercase tracking-wider">{exp.category}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-foreground text-[13px]">{exp.amount}</td>
                      <td className="px-6 py-4 text-[11px] font-semibold text-muted-foreground">{exp.submitted}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">{exp.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors">Approve</button>
                          <button className="px-3 py-1.5 rounded-lg bg-secondary text-foreground border border-border text-[11px] font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-8">Upcoming Deadlines</h3>
            <div className="space-y-8">
              {DEADLINES.map((item, i) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== DEADLINES.length - 1 && (
                    <div className="absolute left-[13px] top-7 w-[2px] h-9 bg-border group-hover:bg-primary/20 transition-colors" />
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-card ${
                    item.status === 'Done' ? 'bg-[#00B87C]' : 
                    item.status === 'Active' ? 'bg-[#0EA5E9] shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 
                    'bg-secondary border-border'
                  }`}>
                    {item.status === 'Done' && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-[14px] font-black ${item.status === 'Active' ? 'text-[#0EA5E9]' : 'text-foreground'}`}>{item.title}</p>
                      <span className="text-[11px] font-bold text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-1">
                      {item.status === 'Done' ? 'Completed on schedule' : 
                       item.status === 'Active' ? 'In progress — Action required' : 
                       'Upcoming requirement'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Salary Distribution</h3>
            <div className="space-y-5">
              {SALARY_DIST.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{item.label}</span>
                    <span className="text-foreground">{item.value} employees</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 450) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: "Run Payroll", color: "#00B87C", bg: "#DCFCE7" },
                { icon: CheckCircle, label: "Approve Expenses", color: "#8B5CF6", bg: "#EDE9FE" },
                { icon: FileSpreadsheet, label: "TDS Report", color: "#0EA5E9", bg: "#E0F2FE" },
                { icon: ShieldCheck, label: "PF Report", color: "#F59E0B", bg: "#FEF3C7" },
                { icon: BarChart3, label: "Salary Register", color: "#64748B", bg: "#F3F4F6" },
                { icon: Download, label: "Generate Form 16", color: "#EF4444", bg: "#FEE2E2" },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border bg-card hover:bg-secondary hover:border-primary/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: action.bg }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-foreground text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
