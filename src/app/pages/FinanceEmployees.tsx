import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Download, 
  Lock, 
  LayoutGrid, 
  List, 
  RotateCcw,
  X,
  Calendar,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { employees } from "../data/mockData";

/* ─── Mock Financial Data for Details ─── */
const MOCK_FINANCIAL_DETAILS = {
  basic: 80000,
  hra: 40000,
  allowances: 35000,
  taxSlab: "30%",
  pfContribution: 9600,
  payHistory: [
    { month: "March 2026", amount: 155000, status: "Paid" },
    { month: "February 2026", amount: 155000, status: "Paid" },
    { month: "January 2026", amount: 155000, status: "Paid" },
  ]
};

export function FinanceEmployees() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("Status: All");
  const [selectedBand, setSelectedBand] = useState("Pay Band");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "Status: All" || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* ACCESS RESTRICTION BANNER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-500/10 border-l-4 border-amber-500 shadow-sm"
      >
        <div className="p-2 rounded-full bg-amber-500/20 text-amber-600">
          <Lock size={18} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[14px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Access Restricted</p>
          <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-300 opacity-90">
            You have view-only access to employee financial data. Contact HR Manager to make changes to employee records.
          </p>
        </div>
      </motion.div>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[24px] bg-[#DCFCE7] dark:bg-emerald-500/10 flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-500/20">
            <Users size={28} className="text-[#059669]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-black text-foreground tracking-tight">Employees</h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-muted-foreground border border-border">
                View Only
              </span>
            </div>
            <p className="text-[13px] font-semibold text-muted-foreground">Financial data access enabled for your role</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm">
            <Download size={18} />
            Export Salary CSV
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-3 rounded-[24px] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or employee ID..." 
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border border-border text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <FilterSelect 
            value={selectedDept} 
            onChange={setSelectedDept} 
            options={["All Departments", "Engineering", "Marketing", "Design", "Finance", "HR", "Product", "Sales", "Operations"]} 
          />
          <FilterSelect 
            value={selectedStatus} 
            onChange={setSelectedStatus} 
            options={["Status: All", "Active", "Inactive", "On Leave"]} 
          />
          <FilterSelect 
            value={selectedBand} 
            onChange={setSelectedBand} 
            options={["Pay Band", "Band A", "Band B", "Band C", "Executive"]} 
          />

          <button className="flex items-center gap-2 px-4 py-3 text-xs font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-card shadow-sm text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="bg-card border border-border rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Designation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">CTC (Annual)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Pay Band</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((emp) => (
                <motion.tr 
                  key={emp.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                  className="group cursor-pointer transition-colors"
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border group-hover:border-emerald-500/30 transition-all">
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground group-hover:text-emerald-600 transition-colors">{emp.name}</p>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-foreground/80">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-foreground/80">{emp.designation}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px] font-black text-foreground tracking-tight">₹{(emp.salary * 12).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-border">
                      {emp.salary > 100000 ? "Band A" : emp.salary > 60000 ? "Band B" : "Band C"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                        emp.status === "On Leave" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
                        "bg-slate-400"
                      }`} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        emp.status === "Active" ? "text-emerald-600" : 
                        emp.status === "On Leave" ? "text-amber-600" : 
                        "text-slate-500"
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center p-2 rounded-xl text-muted-foreground group-hover:text-emerald-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-card border-l border-border shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                {/* Close Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <Lock size={14} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Read Only Mode</span>
                  </div>
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="p-2 rounded-xl hover:bg-muted transition-all text-muted-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Profile Section */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-emerald-500/20 mx-auto shadow-xl">
                    <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">{selectedEmployee.name}</h2>
                    <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {selectedEmployee.designation} · {selectedEmployee.department}
                    </p>
                  </div>
                </div>

                {/* FINANCIAL SUMMARY */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-[2px] text-muted-foreground">Financial Summary</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SummaryItem label="CTC (Annual)" value={`₹${(selectedEmployee.salary * 12).toLocaleString()}`} highlight />
                    <SummaryItem label="Pay Band" value={selectedEmployee.salary > 100000 ? "Band A" : "Band B"} />
                    <SummaryItem label="TDS Slab" value={MOCK_FINANCIAL_DETAILS.taxSlab} />
                    <SummaryItem label="PF Contribution" value={`₹${MOCK_FINANCIAL_DETAILS.pfContribution.toLocaleString()}`} />
                  </div>

                  {/* CTC Breakdown */}
                  <div className="bg-muted/30 border border-border rounded-2xl p-5 space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">CTC Breakdown (Monthly)</p>
                    <div className="space-y-3">
                      <BreakdownRow label="Basic Salary" value={MOCK_FINANCIAL_DETAILS.basic} />
                      <BreakdownRow label="HRA" value={MOCK_FINANCIAL_DETAILS.hra} />
                      <BreakdownRow label="Special Allowances" value={MOCK_FINANCIAL_DETAILS.allowances} />
                      <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-black text-foreground">Gross Monthly</span>
                        <span className="text-sm font-black text-emerald-600">₹{selectedEmployee.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pay History */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Pay History</p>
                    <div className="space-y-2">
                      {MOCK_FINANCIAL_DETAILS.payHistory.map((pay, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                              <Calendar size={14} />
                            </div>
                            <span className="text-[13px] font-bold text-foreground">{pay.month}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-black text-foreground tracking-tight">₹{pay.amount.toLocaleString()}</p>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{pay.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View History Link */}
                  <button 
                    onClick={() => navigate("/payroll")}
                    className="w-full py-4 rounded-2xl border border-emerald-500/20 text-[#00B87C] font-black text-xs uppercase tracking-widest hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
                  >
                    View Full Payslip History <ExternalLink size={14} />
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

/* ─── HELPER COMPONENTS ─── */

interface FilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative group">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-4 pr-10 py-3 rounded-2xl bg-card border border-border text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all hover:border-emerald-500/50"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-emerald-500 transition-colors" />
    </div>
  );
}

function SummaryItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-[15px] font-black tracking-tight ${highlight ? "text-emerald-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
      <span className="text-[13px] font-bold text-foreground">₹{value.toLocaleString()}</span>
    </div>
  );
}
