import { useState } from "react";
import { 
  IndianRupee, 
  Download, 
  Play, 
  Search, 
  RotateCcw, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Mail, 
  AlertCircle,
  Info,
  Clock,
  ChevronDown,
  Zap,
  Activity,
  FileSpreadsheet,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

interface PayrollRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  basic: number;
  hra: number;
  allowances: number;
  gross: number;
  deductions: number;
  net: number;
  status: "Processed" | "Pending" | "On Hold";
  avatarColor: string;
}

const MOCK_RECORDS: PayrollRecord[] = [
  {
    id: "EMP1284",
    name: "Robert Chen",
    role: "VP Engineering",
    department: "Engineering",
    basic: 75000,
    hra: 30000,
    allowances: 19600,
    gross: 124600,
    deductions: 2200,
    net: 122400,
    status: "Processed",
    avatarColor: "#8B5CF6"
  },
  {
    id: "EMP1285",
    name: "Sarah Jenkins",
    role: "Product Manager",
    department: "Product",
    basic: 65000,
    hra: 26000,
    allowances: 15000,
    gross: 106000,
    deductions: 1800,
    net: 104200,
    status: "Pending",
    avatarColor: "#10B981"
  },
  {
    id: "EMP1286",
    name: "Michael Ross",
    role: "UX Designer",
    department: "Design",
    basic: 55000,
    hra: 22000,
    allowances: 12000,
    gross: 89000,
    deductions: 1500,
    net: 87500,
    status: "Processed",
    avatarColor: "#F59E0B"
  },
  {
    id: "EMP1287",
    name: "Emily Blunt",
    role: "HR Specialist",
    department: "Human Resources",
    basic: 45000,
    hra: 18000,
    allowances: 10000,
    gross: 73000,
    deductions: 1200,
    net: 71800,
    status: "On Hold",
    avatarColor: "#EF4444"
  },
  {
    id: "EMP1288",
    name: "David Wright",
    role: "Backend Lead",
    department: "Engineering",
    basic: 70000,
    hra: 28000,
    allowances: 18000,
    gross: 116000,
    deductions: 2000,
    net: 114000,
    status: "Processed",
    avatarColor: "#3B82F6"
  }
];

export function FinancePayroll() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollRecord | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [runModalStep, setRunModalStep] = useState<1 | 2>(1);
  const [genericModalTitle, setGenericModalTitle] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleExport = (type: string) => {
    setExportDropdownOpen(false);
    setToastMessage(`Exporting ${type} CSV...`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center shadow-inner"
            style={{ backgroundColor: "#EDE9FE" }}
          >
            <IndianRupee size={22} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">Payroll Management</h1>
            <p className="text-[13px] text-[#6B7280]">Manage salary disbursements and slips</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted/50 transition-all"
          >
            <Download size={18} />
            Export CSV
          </button>
          {exportDropdownOpen && (
            <div className="absolute top-full right-40 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <button onClick={() => handleExport("Full Payroll")} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-muted transition-colors border-b border-border">Export Full Payroll CSV</button>
              <button onClick={() => handleExport("Deductions")} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-muted transition-colors border-b border-border">Export Deductions CSV</button>
              <button onClick={() => handleExport("Tax Withholdings")} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-muted transition-colors border-b border-border">Export Tax Withholdings CSV</button>
              <button onClick={() => handleExport("Bank Transfer Format")} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-muted transition-colors">Export Bank Transfer Format</button>
            </div>
          )}
          <button 
            onClick={() => { setShowRunModal(true); setRunModalStep(1); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-[#00B87C]/20"
            style={{ backgroundColor: "#00B87C" }}
          >
            <Play size={18} fill="white" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="w-full py-3 px-6 rounded-2xl bg-[#DCFCE7]/40 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 flex flex-wrap items-center gap-y-3 gap-x-8 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B87C] animate-pulse" />
          <span className="text-[12px] font-bold text-foreground tracking-tight">April 2026 Payroll In Progress</span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-emerald-200/50 dark:border-emerald-800/50 md:pl-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setGenericModalTitle("Payroll Lock Details")}>
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">Lock Date: <span className="text-foreground">Apr 20</span></span>
        </div>
        <div className="flex items-center gap-2 md:border-l border-emerald-200/50 dark:border-emerald-800/50 md:pl-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setGenericModalTitle("Disbursement Schedule")}>
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[12px] font-bold text-foreground/80 tracking-tight">Payment: <span className="text-foreground">Apr 28</span></span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setGenericModalTitle("Total Payroll Breakdown")}><KPICard title="TOTAL PAYROLL" value="₹28.4L" color="purple" icon={IndianRupee} /></div>
        <div onClick={() => setGenericModalTitle("Processed Employees Details")}><KPICard title="EMPLOYEES PROCESSED" value="1,248" color="green" icon={CheckCircle2} /></div>
        <div onClick={() => setGenericModalTitle("Deductions Breakdown")}><KPICard title="TOTAL DEDUCTIONS" value="₹4.2L" color="red" icon={Activity} /></div>
        <div onClick={() => setGenericModalTitle("Net Disbursement Details")}><KPICard title="NET DISBURSEMENT" value="₹24.2L" subValue="(estimated)" color="green" icon={FileSpreadsheet} /></div>
      </div>

      {/* PAYROLL PROCESSING STEPPER */}
      <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between relative px-2 mb-8">
          <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-border z-0 mx-12" />
          {[
            { label: "Data Collection", status: "Done" },
            { label: "Attendance Lock", status: "Done" },
            { label: "Calculation", status: "Active" },
            { label: "Approval", status: "Pending" },
            { label: "Disbursement", status: "Pending" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => setGenericModalTitle(`Stepper Phase: ${step.label}`)}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${
                step.status === 'Done' ? 'bg-[#00B87C] border-[#00B87C] text-white' : 
                step.status === 'Active' ? 'bg-card border-[#0D9488] text-[#0D9488] shadow-[0_0_15px_rgba(13,148,136,0.3)] animate-pulse' : 
                'bg-card border-border text-muted-foreground group-hover:border-[#0D9488]/50 group-hover:text-[#0D9488]/50'
              }`}>
                {step.status === 'Done' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : 
                 step.status === 'Active' ? <Clock size={18} /> : 
                 <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest text-center max-w-[100px] transition-colors group-hover:text-foreground ${
                step.status === 'Done' ? 'text-[#00B87C]' : 
                step.status === 'Active' ? 'text-[#0D9488]' : 
                'text-muted-foreground'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground font-semibold">Estimated completion: April 20, 2026</p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/50">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search employees, department, ID..." 
            className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterSelect label="2025-2026" options={["2025-2026", "2024-2025", "2023-2024"]} />
        <FilterSelect label="All Departments" options={["All Departments", "Engineering", "Sales", "Marketing"]} />
        <FilterSelect label="Status: All" options={["Status: All", "Processed", "Pending", "On Hold"]} />
        <FilterSelect label="Pay Band: All" options={["Pay Band: All", "Band A", "Band B", "Band C"]} />
        <button 
          onClick={() => {
            setSearchQuery("");
            showToast("Filters Reset");
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#00B87C]/10 text-[#00B87C] font-black text-[12px] uppercase tracking-widest rounded-xl hover:bg-[#00B87C]/20 transition-all border border-[#00B87C]/20" onClick={() => handleExport("Register")}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* PAYROLL REGISTER TABLE */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-border bg-card">
          <div>
            <h2 className="text-lg font-black text-foreground tracking-tight">Payroll Register — April 2026</h2>
            <p className="text-[13px] font-semibold text-muted-foreground">1,284 employees · Click row to view slip</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Page 1 of 52</span>
            <button className="p-2 hover:bg-muted rounded-xl transition-all border border-border">
              <Filter size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 dark:bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">EMPLOYEE</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">DEPARTMENT</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">BASIC</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">HRA</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">ALLOWANCES</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">GROSS</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">DEDUCTIONS</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">NET SALARY</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">STATUS</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_RECORDS.map((rec, i) => (
                <motion.tr 
                  key={rec.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-[#00B87C]/[0.08] dark:hover:bg-emerald-500/5 transition-all cursor-pointer h-[56px]"
                  onClick={() => setSelectedEmployee(rec)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                        style={{ backgroundColor: rec.avatarColor }}
                      >
                        {rec.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[14px] font-bold text-foreground leading-tight truncate">{rec.name}</p>
                        <p className="text-[12px] font-semibold text-muted-foreground truncate">{rec.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-medium text-foreground">{rec.department}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#374151] dark:text-gray-300">₹{rec.basic.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#374151] dark:text-gray-300">₹{rec.hra.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#374151] dark:text-gray-300">₹{rec.allowances.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#374151] dark:text-gray-300">₹{rec.gross.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] text-[#EF4444] font-black">₹{rec.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] text-[#00B87C] font-black">₹{rec.net.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusChip status={rec.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#00B87C]/30 text-[#00B87C] text-[11px] font-black uppercase tracking-wider hover:bg-[#00B87C] hover:text-white transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(rec);
                        }}
                      >
                        <IndianRupee size={12} />
                        Slip
                      </button>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SALARY SLIP SLIDE PANEL */}
      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 z-[2100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setSelectedEmployee(null)}
            ></motion.div>
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[440px] h-full bg-card shadow-[-20px_0_40px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-black text-foreground tracking-tight">Salary Slip — March 2026</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="p-2 hover:bg-muted rounded-xl transition-all"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                  <button 
                    onClick={() => {
                      setToastMessage("Downloading Salary Slip PDF...");
                      setTimeout(() => setToastMessage(""), 3000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all"
                  >
                    <Download size={14} />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Company Branding */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B87C] to-[#059669] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Zap size={24} className="text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">NexusHR</h3>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Enterprise EMS Platform</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-6 rounded-2xl bg-muted/30 border border-border shadow-inner">
                  <InfoItem label="Employee Name" value={selectedEmployee.name} />
                  <InfoItem label="Employee ID" value={selectedEmployee.id} />
                  <InfoItem label="Designation" value={selectedEmployee.role} />
                  <InfoItem label="Department" value={selectedEmployee.department} />
                  <InfoItem label="Bank Account" value="XXXX-XXXX-4921" />
                  <InfoItem label="PAN Number" value="ABCDE1234F" />
                  <InfoItem label="Pay Period" value="March 01 - 31, 2026" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-4 flex items-center gap-2">
                       <div className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                      Earnings
                    </h4>
                    <div className="space-y-4">
                      <TableItem label="Basic" value={selectedEmployee.basic} />
                      <TableItem label="HRA" value={selectedEmployee.hra} />
                      <TableItem label="Conveyance" value={1600} />
                      <TableItem label="Special Allowance" value={selectedEmployee.allowances - 1600} />
                      <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
                        <span className="text-[14px] font-black text-foreground uppercase tracking-tight">Gross Earnings</span>
                        <span className="text-[16px] font-black text-foreground">₹{selectedEmployee.gross.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-3.5 bg-rose-500 rounded-full" />
                      Deductions
                    </h4>
                    <div className="space-y-4">
                      <TableItem label="PF Employee" value={9000} />
                      <TableItem label="Professional Tax" value={200} />
                      <TableItem label="TDS" value={18400} />
                      <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
                        <span className="text-[14px] font-black text-foreground uppercase tracking-tight">Total Deductions</span>
                        <span className="text-[16px] font-black text-[#EF4444]">₹27,600</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] dark:from-emerald-500/10 dark:to-emerald-500/5 border border-[#00B87C]/20 text-center shadow-xl shadow-emerald-500/5">
                  <p className="text-[11px] font-black text-[#00B87C] uppercase tracking-[2px] mb-2">Net Pay Amount</p>
                  <h2 className="text-[44px] font-black text-[#00B87C] tracking-tighter">₹{selectedEmployee.net.toLocaleString()}</h2>
                  <p className="text-[11px] font-bold text-emerald-600/60 mt-2 italic">Twelve Lakh Twenty Four Thousand Rupees Only</p>
                </div>
              </div>

              <div className="p-6 border-t border-border grid grid-cols-2 gap-4 bg-muted/5">
                <button 
                  onClick={() => {
                    setToastMessage("Preparing slip for printing...");
                    setTimeout(() => setToastMessage(""), 3000);
                  }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all active:scale-95"
                >
                  <Printer size={18} />
                  Print Slip
                </button>
                <button 
                  onClick={() => {
                    setToastMessage(`Salary Slip emailed to ${selectedEmployee.name}.`);
                    setTimeout(() => setToastMessage(""), 3000);
                  }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20 active:scale-95"
                >
                  <Mail size={18} />
                  Email Slip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RUN PAYROLL MODAL */}
      <AnimatePresence>
        {showRunModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md" 
              onClick={() => setShowRunModal(false)}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[460px] bg-card rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-4">
                {runModalStep === 1 ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] shadow-inner">
                          <IndianRupee size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Run Payroll</h3>
                          <p className="text-[12px] font-bold text-muted-foreground mt-1.5 uppercase tracking-widest">April 2026 Cycle</p>
                        </div>
                      </div>
                      <button onClick={() => setShowRunModal(false)} className="p-2 hover:bg-muted rounded-2xl transition-all">
                        <X size={24} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Pay Cycle / Month</label>
                        <div className="relative">
                          <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 appearance-none">
                            <option>April 2026</option>
                            <option>March 2026</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Department</label>
                          <div className="relative">
                            <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 appearance-none">
                              <option>All Departments</option>
                              <option>Engineering</option>
                              <option>Sales</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Pay Group</label>
                          <div className="relative">
                            <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 appearance-none">
                              <option>Full-Time</option>
                              <option>Contractors</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      <ChecklistItem label="Attendance data locked" status="success" />
                      <ChecklistItem label="Leave data verified for all employees" status="success" />
                      <ChecklistItem label="36 employees have pending expense claims" status="warning" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-6 rounded-[28px] bg-muted/30 border border-border mb-6 shadow-inner">
                      <div>
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Employee Count</p>
                        <p className="text-2xl font-black text-foreground tracking-tighter">1,284</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Est. Total Payout</p>
                        <p className="text-2xl font-black text-[#00B87C] tracking-tighter">₹28.6L</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 mb-4">
                      <AlertCircle size={24} className="text-rose-500 shrink-0" />
                      <p className="text-[12px] text-rose-600 font-bold leading-relaxed">
                        CRITICAL: This action is irreversible. All salary computations, deductions, and tax withholdings will be finalized upon review.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shadow-inner">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Review & Finalize</h3>
                          <p className="text-[12px] font-bold text-muted-foreground mt-1.5 uppercase tracking-widest">April 2026 Cycle</p>
                        </div>
                      </div>
                      <button onClick={() => setShowRunModal(false)} className="p-2 hover:bg-muted rounded-2xl transition-all">
                        <X size={24} className="text-muted-foreground" />
                      </button>
                    </div>
                    
                    <div className="border border-border rounded-xl overflow-hidden mb-6">
                      <table className="w-full text-left">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase">Category</th>
                            <th className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-4 py-3 text-[13px] font-semibold text-foreground">Gross Pay</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-foreground text-right">₹32.8L</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-[13px] font-semibold text-foreground">Total Deductions</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-rose-500 text-right">-₹4.2L</td>
                          </tr>
                          <tr className="bg-emerald-500/5">
                            <td className="px-4 py-3 text-[14px] font-black text-foreground">Net Disbursement</td>
                            <td className="px-4 py-3 text-[14px] font-black text-[#00B87C] text-right">₹28.6L</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button 
                  onClick={() => runModalStep === 2 ? setRunModalStep(1) : setShowRunModal(false)}
                  className="flex-1 py-4 rounded-[20px] border border-border text-foreground font-black text-[13px] uppercase tracking-widest hover:bg-muted transition-all active:scale-95"
                >
                  {runModalStep === 2 ? "Back" : "Cancel"}
                </button>
                <button 
                  onClick={() => {
                    if (runModalStep === 1) {
                      setRunModalStep(2);
                    } else {
                      setShowRunModal(false);
                      setToastMessage("Payroll processing started successfully.");
                      setTimeout(() => setToastMessage(""), 3000);
                    }
                  }}
                  className={`flex-1 py-4 rounded-[20px] text-white font-black text-[13px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 ${runModalStep === 2 ? "bg-[#8B5CF6] shadow-[#8B5CF6]/20" : "bg-[#00B87C] shadow-[#00B87C]/20"}`}
                >
                  {runModalStep === 2 ? "Confirm & Lock" : "Proceed to Review"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Generic Modal */}
      {genericModalTitle && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setGenericModalTitle("")} />
          <div className="relative bg-card w-full max-w-[420px] rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-foreground">{genericModalTitle}</h3>
                <button onClick={() => setGenericModalTitle("")} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <p className="text-[13px] text-muted-foreground font-semibold mb-6">
                Detailed view for {genericModalTitle.toLowerCase()} is not available in the current preview mode. Please check back later.
              </p>
              <button onClick={() => setGenericModalTitle("")} className="w-full py-2.5 rounded-xl border border-border font-bold text-[13px] hover:bg-muted transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[6000] bg-card text-foreground px-6 py-4 rounded-xl shadow-2xl border border-border flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-[#00B87C]" />
            <span className="text-[13px] font-bold">{toastMessage}</span>
            <button onClick={() => setToastMessage("")} className="ml-4 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICard({ title, value, subValue, color, icon: Icon }: { title: string, value: string, subValue?: string, color: 'purple' | 'green' | 'red', icon: React.ElementType }) {
  const colors = {
    purple: { bg: '#F5F3FF', text: '#8B5CF6', iconBg: '#EDE9FE', iconColor: '#8B5CF6' },
    green: { bg: '#F0FDF4', text: '#00B87C', iconBg: '#DCFCE7', iconColor: '#10B981' },
    red: { bg: '#FEF2F2', text: '#EF4444', iconBg: '#FEE2E2', iconColor: '#EF4444' }
  };
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 bg-card border border-border rounded-[32px] shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group"
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colors[color].iconBg }}>
        <Icon size={18} style={{ color: colors[color].iconColor }} />
      </div>
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end gap-2">
        <h3 className="text-[28px] font-bold tracking-tighter" style={{ color: colors[color].text }}>{value}</h3>
        {subValue && <span className="text-[12px] font-bold text-muted-foreground mb-1.5">{subValue}</span>}
      </div>
    </motion.div>
  );
}

function FilterSelect({ label, options = ["Option 1", "Option 2"] }: { label: string, options?: string[] }) {
  const [value, setValue] = useState(label);
  
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="appearance-none flex items-center gap-2.5 px-5 pr-12 py-2.5 bg-card border border-border rounded-xl text-[13px] font-bold text-foreground hover:border-[#00B87C]/50 transition-all shadow-sm outline-none cursor-pointer"
      >
        <option value={label}>{label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-[#00B87C] transition-colors" />
    </div>
  );
}

function StatusChip({ status }: { status: PayrollRecord['status'] }) {
  const styles = {
    Processed: "bg-[#F0FDF4] text-[#00B87C] border-[#00B87C]/20",
    Pending: "bg-[#FFFBEB] text-[#D97706] border-[#FBBF24]/20",
    "On Hold": "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20"
  };
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${styles[status]} flex items-center justify-center w-fit gap-1.5`}>
      {status === "Processed" ? "✓ Processed" : status === "Pending" ? "⏳ Pending" : "⊗ On Hold"}
    </span>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[1.5px] mb-1.5">{label}</p>
      <p className="text-[14px] font-black text-foreground tracking-tight">{value}</p>
    </div>
  );
}

function TableItem({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center group/item">
      <span className="text-[14px] text-muted-foreground font-bold group-hover/item:text-foreground transition-colors">{label}</span>
      <span className="text-[15px] font-black text-foreground">₹{value.toLocaleString()}</span>
    </div>
  );
}

function ChecklistItem({ label, status }: { label: string, status: 'success' | 'warning' | 'info' }) {
  return (
    <div className="flex items-center gap-4 bg-muted/20 p-3.5 rounded-2xl border border-border/50">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
        status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
        status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
        'bg-teal-500/10 text-teal-500'
      }`}>
        {status === 'success' ? <CheckCircle2 size={16} /> : 
         status === 'warning' ? <AlertCircle size={16} /> : 
         <Info size={16} />}
      </div>
      <span className={`text-[13px] font-bold ${status === 'success' ? 'text-foreground' : status === 'warning' ? 'text-amber-700' : 'text-teal-700'}`}>
        {label}
      </span>
      {status === 'success' && <div className="ml-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px] font-semibold">✓</div>}
    </div>
  );
}
