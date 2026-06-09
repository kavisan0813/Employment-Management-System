import { ReactNode, useState } from "react";
import {
  IndianRupee,
  Download,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  X,
  Search,
  User,
  Shield,
  Upload,
  ChevronDown,
  ChevronRight,
  Briefcase,
  MapPin,
  Check,
  AlertTriangle,
  Building,
  Banknote,
  FileText,
  Eye,
  ArrowUpRight,
  RefreshCw,
  Percent,
  UserCheck,
  Landmark,
  CreditCard,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

interface FinancialTask {
  [x: string]: ReactNode;
  id: string;
  label: string;
  status: "done" | "pending" | "overdue" | "waiting";
  desc: string;
  actionType?: "bank" | "pf" | "form" | "payroll" | "request" | "view";
  doneDate?: string;
}

interface NewHire {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  joiningDate: string;
  ctc: string;
  band: string;
  empId: string;
  monthlyGross: string;
  netEst: string;
  tasks: FinancialTask[];
  urgency: "amber" | "red" | "gray";
}

const NEW_HIRES: NewHire[] = [
  {
    id: "EMP-1285",
    name: "Priya Sharma",
    initials: "PS",
    role: "Frontend Developer",
    department: "Engineering",
    joiningDate: "April 8, 2026",
    ctc: "₹12,00,000",
    band: "Band C — Engineering",
    empId: "EMP-1285",
    monthlyGross: "₹1,00,000",
    netEst: "₹82,400",
    urgency: "amber",
    tasks: [
      { id: "p1-salary", label: "Salary Structure Confirmed", status: "done", desc: "₹12,00,000 CTC — Standard Engineering Band", doneDate: "Apr 3" },
      { id: "p1-bank", label: "Bank Account Setup", status: "pending", desc: "Collect bank account details and set up in payroll system", actionType: "bank" },
      { id: "p1-pf", label: "PF / ESI Enrollment", status: "pending", desc: "Register employee for Provident Fund and ESIC", actionType: "pf" },
      { id: "p1-tax", label: "Investment Declaration Form", status: "pending", desc: "Send investment declaration form for TDS calculation", actionType: "form" },
      { id: "p1-payroll", label: "Payroll Addition", status: "pending", desc: "Add employee to April payroll cycle", actionType: "payroll" },
      { id: "p1-form12b", label: "Form 12B Collection", status: "pending", desc: "Previous employment tax details", actionType: "request" },
    ],
  },
  {
    id: "EMP-1272",
    name: "Riya Chandra",
    initials: "RC",
    role: "Finance Analyst",
    department: "Finance",
    joiningDate: "March 25, 2026",
    ctc: "₹8,50,000",
    band: "Band B — Finance",
    empId: "EMP-1272",
    monthlyGross: "₹70,833",
    netEst: "₹58,200",
    urgency: "red",
    tasks: [
      { id: "r1-salary", label: "Salary Structure Confirmed", status: "done", desc: "₹8,50,000 CTC — Standard Finance Band", doneDate: "Mar 20" },
      { id: "r1-bank", label: "Bank Account Setup", status: "done", desc: "Verified and saved", doneDate: "Mar 24" },
      { id: "r1-pf", label: "PF / ESI Enrollment", status: "done", desc: "Enrolled successfully", doneDate: "Mar 25" },
      { id: "r1-tax", label: "Investment Declaration Form", status: "overdue", desc: "3 days overdue — form not yet submitted", actionType: "form" },
      { id: "r1-payroll", label: "Add to Payroll", status: "overdue", desc: "Must complete before Apr 20", actionType: "payroll" },
      { id: "r1-form12b", label: "Form 12B Collection", status: "done", desc: "Received and verified", doneDate: "Mar 26" },
    ],
  },
  {
    id: "EMP-1286",
    name: "Dev Kumar",
    initials: "DK",
    role: "Backend Developer",
    department: "Engineering",
    joiningDate: "April 8, 2026",
    ctc: "₹14,00,000",
    band: "Band C — Engineering",
    empId: "EMP-1286",
    monthlyGross: "₹1,16,667",
    netEst: "₹95,800",
    urgency: "gray",
    tasks: [
      { id: "d1-salary", label: "Salary Structure", status: "waiting", desc: "Pending confirmation from HR", actionType: "view" },
      { id: "d1-bank", label: "Bank Account Setup", status: "waiting", desc: "Not joined yet — do after Apr 8" },
      { id: "d1-pf", label: "PF Enrollment", status: "waiting", desc: "Pending joining" },
    ],
  },
];

const ALL_HIRES_TABLE = [
  { emp: "Priya Sharma", join: "Apr 8, 2026", salary: "₹12,00,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
  { emp: "Riya Chandra", join: "Mar 25, 2026", salary: "₹8,50,000", bank: "✓ Done", pf: "✓ Done", tax: "⚠ Overdue", payroll: "⚠ Overdue" },
  { emp: "Dev Kumar", join: "Apr 8, 2026", salary: "₹14,00,000", bank: "—", pf: "—", tax: "—", payroll: "—" },
  { emp: "Ananya Patel", join: "Apr 15, 2026", salary: "₹18,00,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
  { emp: "Rohit Verma", join: "Apr 15, 2026", salary: "₹9,50,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
  { emp: "Sneha Kapoor", join: "Apr 20, 2026", salary: "₹11,00,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
  { emp: "Arjun Nair", join: "Apr 22, 2026", salary: "₹15,50,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
  { emp: "Meera Joshi", join: "Apr 28, 2026", salary: "₹7,80,000", bank: "Pending", pf: "Pending", tax: "Pending", payroll: "Pending" },
];

type Tab = "Pending Tasks" | "All New Hires" | "Completed" | "Settings";

export function FinanceOnboarding() {
  const [activeTab, setActiveTab] = useState<Tab>("Pending Tasks");

  // Modal states
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPFModal, setShowPFModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<NewHire | null>(null);
  const [genericModalTitle, setGenericModalTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<FinancialTask | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Bank form
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountType, setAccountType] = useState<"Savings" | "Current">("Savings");
  const [bankVerified, setBankVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // PF form
  const [uanNumber, setUanNumber] = useState("");
  const [newUan, setNewUan] = useState(false);
  const [vpfPercent, setVpfPercent] = useState("");
  const [esicApplicable, setEsicApplicable] = useState(false);
  const [esicNumber, setEsicNumber] = useState("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [nomineeDob, setNomineeDob] = useState("");
  const [nomineeAadhaar, setNomineeAadhaar] = useState("");

  // Payroll form
  const [effectiveDate, setEffectiveDate] = useState("2026-04-28");
  const [payBand, setPayBand] = useState("Band C — Engineering");
  const [prorate, setProrate] = useState(true);

  // Expandable task sections
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleTasks = (id: string) => {
    setExpandedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openBankModal = (emp: NewHire) => {
    setSelectedEmployee(emp);
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
    setAccountHolder("");
    setAccountType("Savings");
    setBankVerified(false);
    setShowBankModal(true);
  };

  const openPFModal = (emp: NewHire) => {
    setSelectedEmployee(emp);
    setUanNumber("");
    setNewUan(false);
    setVpfPercent("");
    setEsicApplicable(emp.department === "Engineering" ? false : true);
    setEsicNumber("");
    setNomineeName("");
    setNomineeRelation("");
    setNomineeDob("");
    setNomineeAadhaar("");
    setShowPFModal(true);
  };

  const openPayrollModal = (emp: NewHire) => {
    setSelectedEmployee(emp);
    setEffectiveDate("2026-04-28");
    setPayBand(emp.band);
    setProrate(true);
    setShowPayrollModal(true);
  };

  const openTaskModal = (task: FinancialTask, emp: NewHire) => {
    setSelectedTask(task);
    setSelectedEmployee(emp);
  };

  const openTaxModal = (emp: NewHire) => {
    setSelectedEmployee(emp);
    setShowTaxModal(true);
  };

  const openDetailsPanel = (emp: NewHire) => {
    setSelectedEmployee(emp);
    setShowDetailsPanel(true);
  };

  const handleVerifyAccount = () => {
    if (!ifscCode || !accountNumber) {
      showToast("Missing Fields", "error", "Please enter IFSC and Account Number");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setBankVerified(true);
      showToast("Account Verified", "success", "Bank account verified successfully");
    }, 1200);
  };

  const handleSaveBank = () => {
    if (!bankVerified) {
      showToast("Verify First", "error", "Please verify the bank account first");
      return;
    }
    setShowBankModal(false);
    showToast("Bank Details Saved", "success", `Bank details saved for ${selectedEmployee?.name}`);
  };

  const handleSavePF = () => {
    if (!uanNumber && !newUan) {
      showToast("Missing UAN", "error", "Please enter or request a new UAN");
      return;
    }
    setShowPFModal(false);
    showToast("PF Enrollment Saved", "success", `PF/ESI enrollment saved for ${selectedEmployee?.name}`);
  };

  const handleAddToPayroll = () => {
    setShowPayrollModal(false);
    showToast("Added to Payroll", "success", `${selectedEmployee?.name} added to April payroll cycle`);
  };

  const handleSendForm = (empName: string) => {
    showToast("Form Sent", "success", `Investment declaration form sent to ${empName}`);
  };

  const handleResendForm = (empName: string) => {
    showToast("Form Resent", "success", `Investment declaration reminder sent to ${empName}`);
  };

  const handleSaveTax = () => {
    setShowTaxModal(false);
    showToast("Tax Declaration Saved", "success", `Tax details updated for ${selectedEmployee?.name}`);
  };

  const handleExport = () => {
    showToast("Exporting", "info", "Downloading financial onboarding status CSV");
  };

  const handlePreviewPayslip = () => {
    showToast("Preview", "info", "Payslip preview generated");
  };

  const pendingCount = NEW_HIRES.filter(h => h.urgency === "amber" || h.urgency === "red").length;
  const pendingTasks = NEW_HIRES.flatMap(h => h.tasks.filter(t => t.status === "pending" || t.status === "overdue"));
  const todayHires = NEW_HIRES.filter(h => h.joiningDate.includes("Apr 8"));

  const getStatusChip = (status: string) => {
    switch (status) {
      case "done": return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B87C] uppercase tracking-widest"><Check size={11} className="text-[#00B87C]" /> Done</span>;
      case "overdue": return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 uppercase tracking-widest"><AlertTriangle size={11} /> Overdue</span>;
      case "waiting": return <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Waiting</span>;
      default: return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 uppercase tracking-widest"><Clock size={11} /> Pending</span>;
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-300 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent relative">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center border border-[#8B5CF6]/20 shadow-sm">
            <IndianRupee size={22} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none">Financial Onboarding</h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1.5">Set up salary, tax and compliance for new joiners</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-[13px] font-black text-foreground hover:bg-secondary transition-all shadow-sm">
            <Download size={16} /> EXPORT <ChevronDown size={14} className={showExportDropdown ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>
          <AnimatePresence>
            {showExportDropdown && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                <button onClick={() => { setShowExportDropdown(false); showToast("Exporting", "info", "Downloading Pending Setup Tasks CSV"); }} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-secondary transition-colors border-b border-border/50">Pending Setup Tasks</button>
                <button onClick={() => { setShowExportDropdown(false); showToast("Exporting", "info", "Downloading Tax Declarations Status CSV"); }} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-secondary transition-colors border-b border-border/50">Tax Declarations Status</button>
                <button onClick={() => { setShowExportDropdown(false); showToast("Exporting", "info", "Downloading Full Onboarding Report"); }} className="w-full text-left px-4 py-3 text-[13px] font-bold text-foreground hover:bg-secondary transition-colors text-[#00B87C]">Full Onboarding Report</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Info Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 bg-card px-5 py-3.5 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[12px] font-bold text-foreground"><span className="text-[#00B87C]">8</span> new hires currently onboarding</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-bold text-muted-foreground"><span className="text-amber-500">3</span> financial tasks pending your action</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[12px] font-bold text-muted-foreground"><span className="text-purple-500">2</span> new hires joining this week — setup required</span>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group cursor-pointer" onClick={() => setGenericModalTitle("Pending Setup Tasks")}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock size={18} className="text-amber-500" />
            </div>
            <span className="text-[28px] font-black text-amber-500 leading-none">3</span>
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">PENDING SETUP</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">need financial action</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group cursor-pointer" onClick={() => setGenericModalTitle("Completed This Month")}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle size={18} className="text-[#00B87C]" />
            </div>
            <span className="text-[28px] font-black text-[#00B87C] leading-none">5</span>
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">COMPLETED THIS MONTH</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">financial setup done</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group cursor-pointer" onClick={() => setGenericModalTitle("PF Enrollments Due")}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Shield size={18} className="text-purple-500" />
            </div>
            <span className="text-[28px] font-black text-purple-500 leading-none">2</span>
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">PF ENROLLMENTS DUE</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">for new hires</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group cursor-pointer" onClick={() => setGenericModalTitle("Tax Declarations Pending")}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Percent size={18} className="text-cyan-500" />
            </div>
            <span className="text-[28px] font-black text-cyan-500 leading-none">4</span>
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">TAX DECLARATIONS PENDING</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-1">investment declarations</p>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {(["Pending Tasks", "All New Hires", "Completed", "Settings"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[13px] font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="finTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────── */}
      {activeTab === "Pending Tasks" && (
        <div className="space-y-6">
          {NEW_HIRES.filter(h => h.urgency === "amber" || h.urgency === "red").map((hire) => {
            const pendingList = hire.tasks.filter(t => t.status !== "done");
            const doneList = hire.tasks.filter(t => t.status === "done");
            const expanded = expandedTasks[hire.id] ?? false;
            const overdueCount = hire.tasks.filter(t => t.status === "overdue").length;

            return (
              <div key={hire.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Employee Header */}
                <div className={`p-5 border-l-[3px] ${
                  hire.urgency === "red" ? "border-l-red-500" : "border-l-amber-500"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[14px] font-black text-[#00B87C] shrink-0">
                      {hire.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-black text-foreground">{hire.name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 text-[9px] font-black border border-cyan-500/20 uppercase tracking-widest">Joining: {hire.joiningDate}</span>
                        {overdueCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[9px] font-black border border-red-500/20 uppercase tracking-widest">{overdueCount} task{overdueCount > 1 ? "s" : ""} OVERDUE</span>
                        )}
                      </div>
                      <p className="text-[12px] font-bold text-muted-foreground mt-0.5">{hire.role} — {hire.department}</p>
                    </div>
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="px-5 pb-4">
                  {pendingList.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 py-2.5 border-t border-border/50 first:border-t-0 min-h-[44px] hover:bg-muted/30 cursor-pointer" onClick={() => openTaskModal(task, hire)}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        task.status === "done" ? "bg-[#00B87C] border-[#00B87C]" :
                        task.status === "overdue" ? "border-red-400" :
                        task.status === "waiting" ? "border-gray-300" :
                        "border-amber-400"
                      }`}>
                        {task.status === "done" ? <Check size={11} className="text-white" strokeWidth={3} /> :
                         task.status === "overdue" ? <AlertTriangle size={10} className="text-red-500" /> :
                         task.status === "pending" ? <Clock size={10} className="text-amber-500" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[13px] font-bold ${
                            task.status === "done" ? "text-[#00B87C] line-through" :
                            task.status === "overdue" ? "text-red-500" :
                            task.status === "waiting" ? "text-gray-400" :
                            "text-foreground"
                          }`}>{task.label}</span>
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{task.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {task.status === "done" && task.doneDate && (
                          <span className="text-[11px] font-bold text-muted-foreground">{task.doneDate}</span>
                        )}
                        {task.actionType === "bank" && (
                          <button onClick={(e) => { e.stopPropagation(); openBankModal(hire); }} className="px-3 py-1.5 bg-[#00B87C] text-white text-[11px] font-semibold rounded-lg hover:opacity-90 transition-all uppercase tracking-widest shadow-sm shadow-emerald-500/20">Collect Details</button>
                        )}
                        {task.actionType === "pf" && (
                          <button onClick={(e) => { e.stopPropagation(); openPFModal(hire); }} className="px-3 py-1.5 bg-[#00B87C] text-white text-[11px] font-semibold rounded-lg hover:opacity-90 transition-all uppercase tracking-widest shadow-sm shadow-emerald-500/20">Enroll Now</button>
                        )}
                        {task.actionType === "form" && task.status === "overdue" && (
                          <button onClick={(e) => { e.stopPropagation(); openTaxModal(hire); }} className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-semibold rounded-lg hover:opacity-90 transition-all uppercase tracking-widest">Resend Form</button>
                        )}
                        {task.actionType === "form" && task.status !== "overdue" && (
                          <button onClick={(e) => { e.stopPropagation(); openTaxModal(hire); }} className="px-3 py-1.5 border border-border text-[11px] font-semibold rounded-lg hover:bg-secondary transition-all uppercase tracking-widest text-foreground">View Declaration</button>
                        )}
                        {task.actionType === "payroll" && task.status === "overdue" && (
                          <button onClick={(e) => { e.stopPropagation(); openPayrollModal(hire); }} className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-semibold rounded-lg hover:opacity-90 transition-all uppercase tracking-widest">Add to Payroll</button>
                        )}
                        {task.actionType === "payroll" && task.status !== "overdue" && (
                          <button onClick={(e) => { e.stopPropagation(); openPayrollModal(hire); }} className="px-3 py-1.5 border border-border text-[11px] font-semibold rounded-lg hover:bg-secondary transition-all uppercase tracking-widest text-foreground">Add to Payroll</button>
                        )}
                        {task.actionType === "request" && (
                          <button onClick={(e) => { e.stopPropagation(); showToast("Request Sent", "success", `Form 12B request sent to ${hire.name}`); }} className="text-[#00B87C] text-[11px] font-bold hover:underline uppercase tracking-widest">Send Request</button>
                        )}
                        {task.actionType === "view" && (
                          <button onClick={(e) => { e.stopPropagation(); showToast("Offer Letter", "info", `Opening offer letter for ${hire.name}`); }} className="text-[#00B87C] text-[11px] font-bold hover:underline uppercase tracking-widest">View Offer Letter</button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Completed tasks for this employee */}
                  {doneList.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => toggleTasks(hire.id)}
                        className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all"
                      >
                        {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        {doneList.length} completed {doneList.length === 1 ? "task" : "tasks"}
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-1 mt-2">
                              {doneList.map((task) => (
                                <div key={task.id} className="flex items-center gap-2.5 py-1.5 pl-1">
                                  <Check size={11} className="text-[#00B87C]" />
                                  <span className="text-[12px] font-medium text-[#00B87C]">{task.label}</span>
                                  <span className="text-[11px] text-muted-foreground ml-auto">{task.doneDate}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "All New Hires" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 pb-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  <th className="pb-3 pr-4">EMPLOYEE</th>
                  <th className="pb-3 pr-4">JOINING DATE</th>
                  <th className="pb-3 pr-4">SALARY</th>
                  <th className="pb-3 pr-4">BANK SETUP</th>
                  <th className="pb-3 pr-4">PF ENROLLED</th>
                  <th className="pb-3 pr-4">TAX DEC</th>
                  <th className="pb-3 text-right">PAYROLL STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {ALL_HIRES_TABLE.map((row, i) => (
                  <tr key={i} className="text-[12px] hover:bg-secondary/30 transition-all cursor-pointer" onClick={() => {
                    const hire = NEW_HIRES.find(h => h.name === row.emp);
                    if (hire) { openDetailsPanel(hire); }
                  }}>
                    <td className="py-3 pr-4 font-bold text-foreground">{row.emp}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.join}</td>
                    <td className="py-3 pr-4 font-bold text-foreground">{row.salary}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        row.bank === "✓ Done" ? "text-[#00B87C]" : row.bank === "Pending" ? "text-amber-500" : "text-gray-400"
                      }`}>{row.bank}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        row.pf === "✓ Done" ? "text-[#00B87C]" : row.pf === "Pending" ? "text-amber-500" : "text-gray-400"
                      }`}>{row.pf}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        row.tax === "✓ Done" ? "text-[#00B87C]" : row.tax === "⚠ Overdue" ? "text-red-500" : row.tax === "Pending" ? "text-amber-500" : "text-gray-400"
                      }`}>{row.tax}</span>
                    </td>
                    <td className="py-3 text-right flex items-center justify-end gap-3">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        row.payroll === "✓ Done" ? "text-[#00B87C]" : row.payroll === "⚠ Overdue" ? "text-red-500" : row.payroll === "Pending" ? "text-amber-500" : "text-gray-400"
                      }`}>{row.payroll}</span>
                      <div className="text-muted-foreground">
                        <ChevronRight size={14} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Completed" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-[#00B87C]" />
          </div>
          <h3 className="text-[18px] font-black text-foreground mb-2">5 Financial Setups Completed This Month</h3>
          <p className="text-[13px] font-bold text-muted-foreground max-w-md mx-auto">
            All completed setups are logged in the payroll system. View detailed history in the Payroll module.
          </p>
        </div>
      )}

      {activeTab === "Settings" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <h3 className="text-[15px] font-black text-foreground">Financial Onboarding Settings</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Default Pay Band</label>
              <select className="w-full appearance-none px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all">
                <option>Band A — Support</option>
                <option>Band B — Associate</option>
                <option>Band C — Engineering</option>
                <option>Band D — Senior</option>
                <option>Band E — Leadership</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Auto-Prorate Salary</label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setProrate(!prorate)} className={`w-9 h-5 rounded-full transition-all relative ${prorate ? "bg-[#00B87C]" : "bg-border"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${prorate ? "left-4" : "left-0.5"}`} />
                </div>
                <span className="text-[12px] font-bold text-foreground">Auto-calculate prorated salary for mid-month joiners</span>
              </label>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">ESIC Threshold</label>
              <input defaultValue="₹21,000" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* ── Bank Account Setup Modal ─────────────────────────── */}
      <AnimatePresence>
        {showBankModal && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setShowBankModal(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative bg-card w-full max-w-[480px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
                    <Landmark size={18} className="text-[#00B87C]" />
                  </div>
                  <h3 className="text-[16px] font-black text-foreground">Bank Account Setup — {selectedEmployee.name}</h3>
                  <button onClick={() => setShowBankModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"><X size={18} /></button>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">EMPLOYEE SUBMITTED DETAILS</span>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-2">
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-[12px] font-bold text-amber-600">Not yet submitted — awaiting employee input</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">VERIFY AND CONFIRM</span>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Bank Name</label>
                    <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Account Number</label>
                    <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter account number" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">IFSC Code</label>
                      <input value={ifscCode} onChange={e => setIfscCode(e.target.value)} placeholder="HDFC0001234" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Account Holder</label>
                      <input value={accountHolder} onChange={e => setAccountHolder(e.target.value)} placeholder="Full name" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Account Type</label>
                    <div className="flex gap-2">
                      {(["Savings", "Current"] as const).map(t => (
                        <button key={t} onClick={() => setAccountType(t)} className={`px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${accountType === t ? "bg-[#00B87C] text-white" : "bg-background border border-border text-muted-foreground hover:border-[#00B87C]/50"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleVerifyAccount} disabled={verifying} className="w-full py-2.5 bg-[#00B87C] text-white text-[11px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                    {verifying ? "Verifying..." : "Verify Account"}
                  </button>
                  {bankVerified && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-[#00B87C]/20 flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#00B87C]" />
                      <span className="text-[12px] font-bold text-[#00B87C]">Account Verified ✓</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Cancelled Cheque / Bank Passbook</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#00B87C]/50 transition-all cursor-pointer group">
                      <Upload size={20} className="mx-auto mb-2 text-muted-foreground group-hover:text-[#00B87C] transition-all" />
                      <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-all">Drop scan here or click to upload</p>
                      <p className="text-[9px] text-muted-foreground mt-1 font-medium">PDF, JPG or PNG (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowBankModal(false)} className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-all text-foreground">Cancel</button>
                  <button onClick={handleSaveBank} className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">Save to Payroll System</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PF Enrollment Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showPFModal && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setShowPFModal(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative bg-card w-full max-w-[460px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
                    <Shield size={18} className="text-[#00B87C]" />
                  </div>
                  <h3 className="text-[16px] font-black text-foreground">PF / ESI Enrollment — {selectedEmployee.name}</h3>
                  <button onClick={() => setShowPFModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"><X size={18} /></button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  <div>
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">PROVIDENT FUND (PF)</span>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">UAN Number</label>
                        <input value={uanNumber} onChange={e => setUanNumber(e.target.value)} placeholder="Universal Account Number" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <div onClick={() => setNewUan(!newUan)} className={`w-9 h-5 rounded-full transition-all relative ${newUan ? "bg-[#00B87C]" : "bg-border"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${newUan ? "left-4" : "left-0.5"}`} />
                        </div>
                        <span className="text-[12px] font-bold text-foreground">New UAN Required (first job)</span>
                      </label>
                      <div className="p-3 rounded-xl bg-secondary/50 border border-border text-[11px] font-medium text-muted-foreground">
                        PF Contribution: <span className="font-bold text-foreground">12% Employee | 12% Employer</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">VPF (Voluntary PF) — Optional</label>
                        <div className="flex items-center gap-2">
                          <input value={vpfPercent} onChange={e => setVpfPercent(e.target.value)} placeholder="Extra %" className="w-24 px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                          <span className="text-[12px] font-bold text-muted-foreground">% additional contribution</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">ESIC</span>
                    <label className="flex items-center gap-2.5 cursor-pointer mb-3">
                      <div onClick={() => setEsicApplicable(!esicApplicable)} className={`w-9 h-5 rounded-full transition-all relative ${esicApplicable ? "bg-[#00B87C]" : "bg-border"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${esicApplicable ? "left-4" : "left-0.5"}`} />
                      </div>
                      <span className="text-[12px] font-bold text-foreground">ESIC Applicable (gross &lt; ₹21,000)</span>
                    </label>
                    {esicApplicable && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">ESIC Number</label>
                        <input value={esicNumber} onChange={e => setEsicNumber(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">NOMINEE DETAILS</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Nominee Name</label>
                        <input value={nomineeName} onChange={e => setNomineeName(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Relationship</label>
                        <input value={nomineeRelation} onChange={e => setNomineeRelation(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Date of Birth</label>
                        <input type="date" value={nomineeDob} onChange={e => setNomineeDob(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Aadhaar</label>
                        <input value={nomineeAadhaar} onChange={e => setNomineeAadhaar(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <button onClick={() => setShowBankModal(false)} className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-all text-foreground">Cancel</button>
                  <button onClick={handleSavePF} className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">Save PF Enrollment</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add to Payroll Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showPayrollModal && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setShowPayrollModal(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative bg-card w-full max-w-[460px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                    <IndianRupee size={18} className="text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-[16px] font-black text-foreground">Add to Payroll — {selectedEmployee.name}</h3>
                  <button onClick={() => setShowPayrollModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"><X size={18} /></button>
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-white/5 dark:bg-gray-800 border border-border mb-5 space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">Name:</span>
                    <span className="font-black text-foreground">{selectedEmployee.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">EMP ID:</span>
                    <span className="font-black text-foreground">{selectedEmployee.empId}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">Dept:</span>
                    <span className="font-black text-foreground">{selectedEmployee.department}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">CTC:</span>
                    <span className="font-black text-foreground">{selectedEmployee.ctc}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">Monthly Gross:</span>
                    <span className="font-black text-foreground">{selectedEmployee.monthlyGross}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-muted-foreground">Net Est:</span>
                    <span className="font-black text-[#00B87C]">{selectedEmployee.netEst}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Effective From</label>
                    <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Pay Band</label>
                    <select value={payBand} onChange={e => setPayBand(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all">
                      <option>Band A — Support</option>
                      <option>Band B — Associate</option>
                      <option>Band C — Engineering</option>
                      <option>Band D — Senior</option>
                      <option>Band E — Leadership</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div onClick={() => setProrate(!prorate)} className={`w-9 h-5 rounded-full transition-all relative ${prorate ? "bg-[#00B87C]" : "bg-border"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${prorate ? "left-4" : "left-0.5"}`} />
                    </div>
                    <span className="text-[12px] font-bold text-foreground">Prorate salary for remaining days</span>
                  </label>
                  {prorate && (
                    <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-cyan-600">23 days = ₹74,194</span>
                      <span className="text-[11px] font-medium text-muted-foreground">Joined Apr 8, 2026</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handlePreviewPayslip} className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-all text-foreground">Preview Payslip</button>
                  <button onClick={handleAddToPayroll} className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">Add to Payroll</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Task Edit Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedTask && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative bg-card w-full max-w-[400px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <List size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-foreground">Task Details</h3>
                    <p className="text-[13px] font-semibold text-muted-foreground">{selectedEmployee.name}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Task Name</label>
                    <p className="text-[14px] font-bold text-foreground">{selectedTask.task}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedTask.status === 'done' ? 'bg-[#00B87C]' : selectedTask.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                      <span className="text-[13px] font-bold uppercase tracking-wider">{selectedTask.status}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button onClick={() => setSelectedTask(null)} className="w-full bg-[#00B87C] hover:bg-[#00B87C]/90 text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-[#00B87C]/20 uppercase tracking-widest text-[13px]">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Tax Declaration Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showTaxModal && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setShowTaxModal(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative bg-card w-full max-w-[460px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Percent size={20} className="text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-foreground">Tax Declaration</h3>
                    <p className="text-[13px] font-semibold text-muted-foreground">{selectedEmployee.name}</p>
                  </div>
                  <button onClick={() => setShowTaxModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"><X size={18} /></button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Regime Selected</label>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all">
                      <option>New Tax Regime</option>
                      <option>Old Tax Regime</option>
                    </select>
                  </div>
                  <div className="border-t border-border pt-4">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Section 80C Investments</label>
                    <input type="text" placeholder="e.g. ₹1,50,000" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">House Rent Allowance (HRA) Claim</label>
                    <input type="text" placeholder="e.g. ₹2,00,000" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Supporting Documents</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#00B87C]/50 transition-all cursor-pointer group">
                      <Upload size={20} className="mx-auto mb-2 text-muted-foreground group-hover:text-[#00B87C] transition-all" />
                      <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-all">Upload Rent Receipts / Proofs</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <button onClick={() => setShowTaxModal(false)} className="flex-1 py-3 border border-border text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-all text-foreground">Cancel</button>
                  <button onClick={handleSaveTax} className="flex-1 py-3 bg-[#00B87C] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">Save Declaration</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Employee Details Slide Panel ──────────────────────────────────── */}
      <AnimatePresence>
        {showDetailsPanel && selectedEmployee && (
          <div className="fixed inset-0 z-[5000] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setShowDetailsPanel(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-[440px] bg-card h-full shadow-2xl border-l border-border flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[14px] font-black text-purple-600">
                    {selectedEmployee.initials}
                  </div>
                  <div>
                    <h2 className="text-[16px] font-black text-foreground">{selectedEmployee.name}</h2>
                    <p className="text-[12px] font-bold text-muted-foreground">{selectedEmployee.role}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailsPanel(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-3">Onboarding Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <span className="text-[12px] font-bold text-muted-foreground">Joining Date</span>
                      <span className="text-[12px] font-black text-foreground">{selectedEmployee.joiningDate}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <span className="text-[12px] font-bold text-muted-foreground">Department</span>
                      <span className="text-[12px] font-black text-foreground">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <span className="text-[12px] font-bold text-muted-foreground">Emp ID</span>
                      <span className="text-[12px] font-black text-foreground">{selectedEmployee.empId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-3">Financial Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <span className="text-[12px] font-bold text-muted-foreground">CTC</span>
                      <span className="text-[12px] font-black text-foreground">{selectedEmployee.ctc}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <span className="text-[12px] font-bold text-muted-foreground">Pay Band</span>
                      <span className="text-[12px] font-black text-foreground">{selectedEmployee.band}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border grid grid-cols-1 gap-3 bg-muted/5">
                <button onClick={() => { setShowDetailsPanel(false); setActiveTab("Pending Tasks"); }} className="w-full py-4 rounded-2xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20">
                  View Tasks
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
