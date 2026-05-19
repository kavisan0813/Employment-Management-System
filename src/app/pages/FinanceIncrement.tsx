import { useState } from "react";
import { 
  BarChart3, 
  Download, 
  Search, 
  RotateCcw, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Star, 
  Check, 
  X, 
  Calendar,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AppraisalEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatarColor: string;
  attendancePct: number;
  leaveDays: number;
  lateMarks: number;
  performanceScore: number;
  kpiScore: number;
  managerRating: number;
  recommendedIncrement: number;
  currentSalary: number;
  revisedSalary: number;
  status: "Pending" | "Approved" | "Rejected";
}

const MOCK_APPRAISALS: AppraisalEmployee[] = [
  {
    id: "EMP-001",
    name: "Robert Chen",
    designation: "VP Engineering",
    department: "Engineering",
    avatarColor: "#8B5CF6",
    attendancePct: 97,
    leaveDays: 2,
    lateMarks: 0,
    performanceScore: 97,
    kpiScore: 96,
    managerRating: 5,
    recommendedIncrement: 15,
    currentSalary: 174000,
    revisedSalary: 200000,
    status: "Approved"
  },
  {
    id: "EMP-002",
    name: "Yuki Tanaka",
    designation: "Lead Designer",
    department: "Design",
    avatarColor: "#10B981",
    attendancePct: 92,
    leaveDays: 3,
    lateMarks: 0,
    performanceScore: 95,
    kpiScore: 94,
    managerRating: 4.8,
    recommendedIncrement: 15,
    currentSalary: 94000,
    revisedSalary: 108100,
    status: "Pending"
  },
  {
    id: "EMP-003",
    name: "Priya Sharma",
    designation: "Product Manager",
    department: "Product",
    avatarColor: "#F59E0B",
    attendancePct: 94,
    leaveDays: 4,
    lateMarks: 1,
    performanceScore: 93,
    kpiScore: 91,
    managerRating: 4.6,
    recommendedIncrement: 10,
    currentSalary: 126000,
    revisedSalary: 139000,
    status: "Pending"
  },
  {
    id: "EMP-004",
    name: "Daniel Kim",
    designation: "Sales Executive",
    department: "Sales",
    avatarColor: "#3B82F6",
    attendancePct: 88,
    leaveDays: 6,
    lateMarks: 2,
    performanceScore: 85,
    kpiScore: 82,
    managerRating: 4.0,
    recommendedIncrement: 5,
    currentSalary: 110000,
    revisedSalary: 115500,
    status: "Pending"
  },
  {
    id: "EMP-005",
    name: "Leo Martinez",
    designation: "Solutions Architect",
    department: "Sales",
    avatarColor: "#EC4899",
    attendancePct: 95,
    leaveDays: 2,
    lateMarks: 0,
    performanceScore: 94,
    kpiScore: 93,
    managerRating: 4.7,
    recommendedIncrement: 15,
    currentSalary: 144000,
    revisedSalary: 166000,
    status: "Approved"
  }
];

export function FinanceIncrement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvingEmployee, setApprovingEmployee] = useState<AppraisalEmployee | null>(null);

  const filteredAppraisals = MOCK_APPRAISALS.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center shadow-inner border border-purple-100 dark:border-purple-500/20">
            <BarChart3 size={28} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">Increment & Appraisal</h1>
            <p className="text-[13px] font-semibold text-muted-foreground">Manage salary increments and performance appraisals</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* INFO BAR */}
      <div className="bg-[#F8FAFC] dark:bg-muted/10 border border-border/50 rounded-2xl px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[13px] font-bold text-foreground">9 employees eligible for increment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[13px] font-bold text-foreground">2 employees need manual review (&lt; 85%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[13px] font-bold text-foreground">Estimated payroll increase: ₹1.0L this cycle</span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard title="ELIGIBLE FOR INCREMENT" value="9" color="green" icon={Users} />
        <KPICard title="PENDING REVIEWS" value="3" color="amber" icon={Clock} />
        <KPICard title="APPROVED INCREMENTS" value="5" color="green" icon={CheckCircle2} />
        <KPICard title="AVG ATTENDANCE" value="91%" color="green" icon={TrendingUp} />
        <KPICard title="AVG PERFORMANCE" value="90%" color="purple" icon={Star} />
        <KPICard title="PAYROLL IMPACT" value="₹87K" color="purple" icon={DollarSign} />
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search employee, department..." 
            className="w-full bg-muted/20 border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterSelect label="2025-2026" />
        <FilterSelect label="All Departments" />
        <FilterSelect label="Status: All" />
        <FilterSelect label="Band: All" />
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
          <RotateCcw size={16} />
          Reset
        </button>
        <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* APPRAISAL TABLE */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px]">Increment Appraisal Table</h2>
            <div className="w-[1px] h-4 bg-border" />
            <span className="text-[11px] font-bold text-[#00B87C]">10 employees · Click row · Sort to reorder</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">EMPLOYEE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">DEPARTMENT</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">ATTENDANCE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">LEAVES</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">LATE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">PERF SCORE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">KPI</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">MGR RATING</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">INCREMENT %</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">CURRENT</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">REVISED</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">STATUS</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAppraisals.map((emp, i) => (
                <motion.tr 
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-muted/30 transition-all h-[72px]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: emp.avatarColor }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-[14px] font-bold text-foreground leading-tight">{emp.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-muted-foreground">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[11px] font-black ${
                      emp.attendancePct >= 95 ? 'bg-emerald-500/10 text-emerald-600' : 
                      emp.attendancePct >= 90 ? 'bg-blue-500/10 text-blue-600' : 
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {emp.attendancePct}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">{emp.leaveDays}d</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">{emp.lateMarks}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 min-w-[100px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-foreground">{emp.performanceScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emp.performanceScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground">{emp.kpiScore}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[13px] font-black text-foreground">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {emp.managerRating}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[13px] font-black ${emp.recommendedIncrement >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      +{emp.recommendedIncrement}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">₹{(emp.currentSalary/1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground">₹{(emp.revisedSalary/1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <StatusChip status={emp.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {emp.status === 'Pending' ? (
                        <>
                          <button 
                            onClick={() => setApprovingEmployee(emp)}
                            className="p-1.5 rounded-lg bg-[#00B87C] border border-[#00B87C] text-white hover:bg-emerald-600 shadow-sm transition-all" 
                            title="Approve"
                          >
                            <Check size={16} strokeWidth={3} />
                          </button>
                          <button className="p-1.5 rounded-lg bg-rose-500 border border-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all" title="Reject">
                            <X size={16} strokeWidth={3} />
                          </button>
                        </>
                      ) : (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">
                          ₹ Payroll <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVE MODAL */}
      <AnimatePresence>
        {approvingEmployee && (
          <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setApprovingEmployee(null)}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#DCFCE7] dark:bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner">
                  <Check size={32} className="text-[#059669]" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">Approve Increment — {approvingEmployee.name}</h3>
                
                {/* Employee card */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-muted/30 border border-border flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[12px] font-black" style={{ backgroundColor: approvingEmployee.avatarColor }}>
                    {approvingEmployee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-foreground leading-tight">{approvingEmployee.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{approvingEmployee.designation}</p>
                      <span className="px-1.5 py-0.5 rounded-md bg-[#00B87C]/10 text-[#00B87C] text-[9px] font-black uppercase">{approvingEmployee.department}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="w-full mt-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-500/5 border border-emerald-500/20">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current CTC</p>
                        <p className="text-[15px] font-bold text-foreground">₹{approvingEmployee.currentSalary.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Increment</p>
                        <p className="text-[15px] font-black text-emerald-600">+{approvingEmployee.recommendedIncrement}%</p>
                      </div>
                      <div className="col-span-2 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Revised CTC</p>
                          <p className="text-xl font-black text-[#00B87C]">₹{approvingEmployee.revisedSalary.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Annual Increase</p>
                          <p className="text-[13px] font-black text-foreground">₹{((approvingEmployee.revisedSalary - approvingEmployee.currentSalary) * 12).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Effective Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input 
                          type="date" 
                          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                          defaultValue="2026-05-01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Comments</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                        <textarea 
                          placeholder="Add approval note..."
                          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 h-24 resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 flex items-center gap-3">
                <button 
                  onClick={() => setApprovingEmployee(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3.5 rounded-2xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">
                  Confirm & Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICard({ title, value, color, icon: Icon }: { title: string, value: string, color: 'amber' | 'green' | 'purple' | 'dark', icon: React.ElementType }) {
  const colors = {
    amber: { text: '#D97706', bg: '#FEF3C7', iconColor: '#D97706' },
    green: { text: '#00B87C', bg: '#DCFCE7', iconColor: '#10B981' },
    purple: { text: '#8B5CF6', bg: '#EDE9FE', iconColor: '#8B5CF6' },
    dark: { text: '#111827', bg: '#F3F4F6', iconColor: '#64748B' }
  };
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-5 bg-card border border-border rounded-[24px] shadow-sm hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colors[color].bg }}>
        <Icon size={20} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-1.5">{title}</p>
      <h3 className="text-2xl font-black tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
    </motion.div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <div className="relative">
      <button className="flex items-center gap-2.5 px-5 py-2.5 bg-muted/20 border border-border rounded-xl text-[13px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm">
        {label}
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
    </div>
  );
}

function StatusChip({ status }: { status: AppraisalEmployee['status'] }) {
  const styles = {
    Approved: "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
    Pending: "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
    Rejected: "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center justify-center w-fit gap-1.5 ${styles[status]}`}>
      {status === "Approved" ? "✓ Approved" : status === "Pending" ? "⏳ Pending" : "✗ Rejected"}
    </span>
  );
}
