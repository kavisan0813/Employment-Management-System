import { useState } from "react";
import { 
  CreditCard, 
  Download, 
  Plus, 
  Receipt, 
  CheckCircle2, 
  X, 
  ChevronRight,
  CloudUpload,
  ChevronDown,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExpenseClaim {
  id: string;
  title: string;
  category: "Travel" | "Food" | "Equipment" | "Stay" | "Transport" | "Medical" | "Training" | "Comms" | "Others";
  date: string;
  amount: number;
  receiptStatus: "Attached" | "Missing";
  status: "Approved" | "Pending" | "Rejected";
}

const myExpensesData: ExpenseClaim[] = [
  { id: "EXP-01", title: "Finance Conference — Attend", category: "Travel", date: "Apr 2", amount: 1800, receiptStatus: "Attached", status: "Approved" },
  { id: "EXP-02", title: "Team Lunch", category: "Food", date: "Apr 5", amount: 1400, receiptStatus: "Attached", status: "Pending" },
];

export function FinanceMyExpenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Travel");

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500 overflow-hidden relative min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] dark:bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shadow-sm">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-[#1E293B] dark:text-white tracking-tight">My Expenses</h1>
            <p className="text-[13px] font-bold text-muted-foreground">Manage your personal expense claims</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Plus size={16} /> New Expense
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[13px] font-black text-[#00B87C]">₹1,800 approved</span>
          <span className="text-[12px] font-bold text-slate-500">— added to next payroll</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-[13px] font-black text-[#F59E0B]">1 claim pending approval</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          <Info size={14} className="text-teal-500" />
          <span className="text-[13px] font-black text-[#1E293B] dark:text-white">Monthly limit: ₹15,000</span>
          <span className="text-[12px] font-bold text-slate-500">| Used: ₹3,200 (21%)</span>
          <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-2">
            <div className="h-full bg-teal-500" style={{ width: '21%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: KPIs & TABLE */}
        <div className="lg:col-span-9 space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="CLAIMED THIS MONTH" value="₹3,200" color="amber" />
            <KPICard label="APPROVED" value="₹1,800" color="green" />
            <KPICard label="PENDING" value="₹1,400" color="teal" />
            <KPICard 
              label="MONTHLY LIMIT" 
              value="₹15K" 
              color="purple" 
              progress={21}
            />
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-[14px] font-black text-[#1E293B] dark:text-white uppercase tracking-widest">MY EXPENSE CLAIMS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expense</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Receipt</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myExpensesData.map((exp) => (
                    <tr key={exp.id} className="h-14 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                      <td className="px-6">
                        <div className="flex items-center gap-3">
                          <Receipt size={16} className="text-slate-400 group-hover:text-[#00B87C] transition-all" />
                          <span className="text-[14px] font-bold text-[#1E293B] dark:text-slate-200">{exp.title}</span>
                        </div>
                      </td>
                      <td className="px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          exp.category === 'Travel' ? 'bg-teal-500/10 text-teal-600' : 
                          exp.category === 'Food' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 text-[13px] font-bold text-slate-500">{exp.date}</td>
                      <td className="px-6 text-[14px] font-black text-[#1E293B] dark:text-white">₹{exp.amount.toLocaleString()}</td>
                      <td className="px-6">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#00B87C]">
                          <CheckCircle2 size={12} /> ✓ Attached
                        </span>
                      </td>
                      <td className="px-6">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                          exp.status === 'Approved' ? 'text-[#00B87C]' : 
                          exp.status === 'Pending' ? 'text-[#F59E0B]' : 'text-rose-600'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1 hover:underline">
                            View <ChevronRight size={14} />
                          </button>
                          {exp.status === 'Pending' && (
                            <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-all" title="Cancel Claim">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: BUDGET TRACKER */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-[14px] font-black text-[#1E293B] dark:text-white uppercase tracking-widest mb-6">BUDGET TRACKER</h3>
            <div className="space-y-6">
              <BudgetBar label="Travel" value={1800} limit={5000} color="#14B8A6" />
              <BudgetBar label="Food" value={1400} limit={3000} color="#F59E0B" />
              <BudgetBar label="Equipment" value={0} limit={4000} color="#8B5CF6" />
              <BudgetBar label="Medical" value={0} limit={2000} color="#EF4444" />
              <BudgetBar label="Others" value={0} limit={1000} color="#6B7280" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW EXPENSE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-[520px] h-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#1E293B] dark:text-white tracking-tight">New Expense Claim</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Pills */}
                  <div className="overflow-x-auto pb-2 -mx-1 scrollbar-hide">
                    <div className="flex gap-2 px-1">
                      {["Travel", "Food", "Equipment", "Stay", "Transport", "Medical", "Training", "Comms", "Other"].map((cat) => (
                        <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                            selectedCategory === cat 
                            ? "bg-[#00B87C] border-[#00B87C] text-white shadow-md shadow-[#00B87C]/20" 
                            : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#00B87C] hover:text-[#00B87C]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Title</label>
                      <input type="text" placeholder="e.g. Travel to client site" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                      <input type="text" placeholder="₹ 0.00" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
                      <div className="relative">
                        <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white appearance-none transition-all cursor-pointer">
                          <option>Corporate Card</option>
                          <option>Cash</option>
                          <option>Personal Card</option>
                          <option>UPI</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor</label>
                      <input type="text" placeholder="e.g. Amazon" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project</label>
                      <input type="text" placeholder="Select Project" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea rows={2} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-[#00B87C] outline-none text-sm font-bold text-[#1E293B] dark:text-white resize-none transition-all" placeholder="Explain the expense..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Receipt Upload</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-800/20 group hover:border-[#00B87C] transition-all cursor-pointer">
                      <CloudUpload size={24} className="text-[#00B87C] mb-2" />
                      <p className="text-[12px] font-bold text-[#1E293B] dark:text-slate-200">Drag files here or <span className="text-[#00B87C] hover:underline">Browse</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Max 10MB · PDF, JPG, PNG</p>
                    </div>
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Routing:</span>
                    <span className="text-[11px] font-bold text-[#1E293B] dark:text-white flex items-center gap-1.5">
                      → Rajan Kumar <span className="text-[10px] text-slate-400">(Manager)</span> → Finance → Payroll
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button className="flex-1 text-[13px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1E293B] dark:hover:text-white transition-all">
                    Save as Draft
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-[2] py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] shadow-xl shadow-[#00B87C]/20 hover:opacity-95 transition-all"
                  >
                    Submit Claim
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function KPICard({ label, value, color, progress }: { label: string, value: string, color: string, progress?: number }) {
  const colorMap: Record<string, string> = {
    amber: "text-[#F59E0B]",
    green: "text-[#00B87C]",
    teal: "text-teal-600",
    purple: "text-purple-600",
  };

  const borderMap: Record<string, string> = {
    amber: "hover:border-[#F59E0B]/30",
    green: "hover:border-[#00B87C]/30",
    teal: "hover:border-teal-500/30",
    purple: "hover:border-purple-500/30",
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm group ${borderMap[color]} transition-all cursor-pointer`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="space-y-3">
        <h3 className={`text-2xl font-black tracking-tight ${colorMap[color]}`}>{value}</h3>
        {progress !== undefined && (
          <div className="space-y-1.5">
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">{progress}% used</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BudgetBar({ label, value, limit, color }: { label: string, value: number, limit: number, color: string }) {
  const percentage = Math.min(100, (value / limit) * 100);
  return (
    <div className="space-y-2 group cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-black text-[#1E293B] dark:text-slate-200 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#1E293B] dark:group-hover:text-white transition-colors">₹{value} / ₹{limit}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
          style={{ width: `${percentage}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}
