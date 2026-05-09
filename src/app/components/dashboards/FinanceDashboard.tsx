import { 
  IndianRupee, CreditCard, Wallet, Receipt, 
  TrendingUp, Activity, CheckCircle2, AlertCircle, 
  FileText
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { motion } from "motion/react";

const PAYROLL_HISTORY = [
  { month: "Oct", amount: 24.2 },
  { month: "Nov", amount: 24.5 },
  { month: "Dec", amount: 25.1 },
  { month: "Jan", amount: 26.8 },
  { month: "Feb", amount: 27.2 },
  { month: "Mar", amount: 28.4 },
];

const EXPENSE_DATA = [
  { name: "Travel", value: 35000, color: "#8B5CF6" },
  { name: "Hardware", value: 125000, color: "#10B981" },
  { name: "Software", value: 85000, color: "#F59E0B" },
  { name: "Events", value: 45000, color: "#0EA5E9" },
];

const PENDING_EXPENSES = [
  { id: "EXP-882", user: "Sarah Chen", amount: "₹4,250", type: "Travel", date: "Apr 04", avatar: "SC" },
  { id: "EXP-885", user: "Michael Roe", amount: "₹12,000", type: "Hardware", date: "Apr 05", avatar: "MR" },
  { id: "EXP-887", user: "David Smith", amount: "₹1,200", type: "Food", date: "Apr 06", avatar: "DS" },
];

const PAYROLL_STATUS = [
  { step: "Data Sync", status: "Completed", date: "Apr 01" },
  { step: "Tax Calc", status: "Completed", date: "Apr 02" },
  { step: "Review", status: "In-Progress", date: "Today" },
  { step: "Disbursement", status: "Pending", date: "Apr 28" },
];

export function FinanceDashboard() {
  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
            <IndianRupee size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-foreground tracking-tight">Finance Dashboard</h2>
            <p className="text-[13px] font-semibold text-muted-foreground">Payroll & Expense Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-[13px] font-bold hover:bg-secondary transition-colors">
            Tax Settings
          </button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:opacity-90 shadow-lg shadow-primary/20">
            Process Payroll
          </button>
        </div>
      </div>

      {/* ═══ INFO BAR ═══ */}
      <div className="w-full py-3 px-6 rounded-2xl bg-[#EDE9FE]/30 border border-purple-100 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">Payroll Disbursement in 4 days</span>
        </div>
        <div className="flex items-center gap-2 border-l border-purple-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">24 pending expense approvals</span>
        </div>
        <div className="flex items-center gap-2 border-l border-purple-200/50 pl-8">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[12px] font-bold text-slate-700 tracking-tight">Q1 TDS Filing deadline: Apr 15</span>
        </div>
      </div>

      {/* ═══ ROW 1 — KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Wallet, label: "TOTAL PAYOUT", value: "₹28.4L", sub: "+4.2% vs prev", color: "#8B5CF6", bg: "#EDE9FE" },
          { icon: CreditCard, label: "EXPENSES", value: "₹2.9L", sub: "18 pending", color: "#10B981", bg: "#DCFCE7" },
          { icon: Receipt, label: "TAX LIABILITY", value: "₹4.1L", sub: "Q1 estimated", color: "#F59E0B", bg: "#FEF3C7" },
          { icon: TrendingUp, label: "REVENUE/EMP", value: "₹18.2K", sub: "Target: 20K", color: "#0EA5E9", bg: "#E0F2FE" },
          { icon: FileText, label: "INVOICES", value: "42", sub: "12 overdue", color: "#EF4444", bg: "#FEE2E2" },
          { icon: Activity, label: "BUDGET UTIL.", value: "84%", sub: "Within limits", color: "#64748B", bg: "#F3F4F6" },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-foreground tracking-tighter mb-1">{kpi.value}</p>
            <p className="text-[11px] font-bold text-muted-foreground">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ ROW 2 — PAYROLL STATUS & EXPENSES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Status Stepper */}
        <div className="lg:col-span-1 bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-8">Payroll Progress</h3>
          <div className="space-y-8">
            {PAYROLL_STATUS.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== PAYROLL_STATUS.length - 1 && (
                  <div className={`absolute left-[13px] top-7 w-[2px] h-9 ${step.status === 'Completed' ? 'bg-emerald-500' : 'bg-border'}`} />
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                  step.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                  step.status === 'In-Progress' ? 'bg-purple-500 text-white animate-pulse' : 
                  'bg-secondary text-muted-foreground'
                }`}>
                  {step.status === 'Completed' ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i+1}</span>}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground leading-none">{step.step}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      step.status === 'Completed' ? 'text-emerald-600' : 
                      step.status === 'In-Progress' ? 'text-purple-600' : 
                      'text-muted-foreground'
                    }`}>{step.status}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] text-muted-foreground font-bold">{step.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 rounded-2xl bg-secondary text-foreground text-sm font-bold hover:bg-border transition-colors">
            View Detail Schedule
          </button>
        </div>

        {/* Expense Approvals */}
        <div className="lg:col-span-2 bg-card p-6 rounded-[24px] border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Pending Expense Approvals</h3>
            <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">Review All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Employee</th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="pb-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PENDING_EXPENSES.map((exp, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-[10px]">
                          {exp.avatar}
                        </div>
                        <span className="text-sm font-bold text-foreground">{exp.user}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-wider">{exp.type}</span>
                    </td>
                    <td className="py-4 font-black text-foreground text-sm">{exp.amount}</td>
                    <td className="py-4 text-[12px] font-semibold text-muted-foreground">{exp.date}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:shadow-lg transition-all"><CheckCircle2 size={14}/></button>
                        <button className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:shadow-lg transition-all"><AlertCircle size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ ROW 3 — FINANCIAL ANALYTICS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Payroll Expenditure (Last 6 Months)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAYROLL_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} unit="L" />
                <Tooltip />
                <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">Expense Breakdown</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={EXPENSE_DATA} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {EXPENSE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {EXPENSE_DATA.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] font-bold text-foreground">{item.name}</span>
                </div>
                <span className="text-[13px] font-black text-foreground">₹{(item.value/1000).toFixed(1)}K</span>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-black text-muted-foreground uppercase tracking-widest">Total Expenses</span>
                <span className="text-lg font-black text-foreground">₹2.9L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
