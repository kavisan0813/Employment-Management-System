import React, { useState } from "react";
import { 
  UserPlus, Plus, Search, Calendar, CheckCircle2, Clock, 
  FileText, Check, X, FileCheck, Download, 
  Laptop, MoreVertical as MoreIcon, AlertTriangle, Users
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
interface NewHire {
  id: string;
  name: string;
  role: string;
  department: string;
  joiningDate: string;
  progress: number;
  currentStep: string;
  status: 'On Track' | 'Delayed' | 'Overdue' | 'Completed';
  avatarColor: string;
  manager: string;
  email: string;
  buddy?: string;
  probationDays: number;
}

interface TaskItem {
  id: string;
  category: 'HR' | 'IT' | 'Manager';
  task: string;
  status: 'Done' | 'Pending' | 'Overdue';
  due: string;
}

interface DocumentItem {
  id: string;
  name: string;
  status: 'Uploaded' | 'Pending' | 'Rejected';
}

/* ─── Mock Data ─────────────────────────── */
const initialHiresData: NewHire[] = [
  {
    id: "NH001",
    name: "Priya Sharma",
    role: "Frontend Developer",
    department: "Engineering",
    joiningDate: "2026-04-28",
    progress: 57,
    currentStep: "IT Setup",
    status: "Delayed",
    avatarColor: "bg-emerald-600",
    manager: "Rajan Kumar",
    email: "priya.s@nexus.com",
    buddy: "Aarti Gupta",
    probationDays: 30
  },
  {
    id: "NH002",
    name: "Rahul Mehta",
    role: "Product Designer",
    department: "Design",
    joiningDate: "2026-04-30",
    progress: 85,
    currentStep: "Orientation",
    status: "On Track",
    avatarColor: "bg-indigo-600",
    manager: "Sneha Patel",
    email: "rahul.m@nexus.com",
    buddy: "Divya S.",
    probationDays: 30
  },
  {
    id: "NH003",
    name: "Suresh G.",
    role: "Backend Engineer",
    department: "Engineering",
    joiningDate: "2026-05-02",
    progress: 28,
    currentStep: "Documents Submitted",
    status: "Overdue",
    avatarColor: "bg-rose-600",
    manager: "Suresh Iyer",
    email: "suresh.g@nexus.com",
    buddy: "Rohan Sharma",
    probationDays: 90
  },
  {
    id: "NH004",
    name: "Neha Kapoor",
    role: "HR Specialist",
    department: "HR",
    joiningDate: "2026-05-05",
    progress: 14,
    currentStep: "Offer Accepted",
    status: "On Track",
    avatarColor: "bg-amber-600",
    manager: "Meera Thomas",
    email: "neha.k@nexus.com",
    buddy: "Ananya Das",
    probationDays: 60
  },
  {
    id: "NH005",
    name: "Vikram Aditya",
    role: "QA Engineer",
    department: "Engineering",
    joiningDate: "2026-04-25",
    progress: 100,
    currentStep: "Completed",
    status: "Completed",
    avatarColor: "bg-slate-600",
    manager: "Suresh Iyer",
    email: "vikram.a@nexus.com",
    buddy: "Vijay Kumar",
    probationDays: 30
  }
];

const initialDocsData: Record<string, DocumentItem[]> = {
  "NH001": [
    { id: "D1", name: "ID Proof (Aadhaar/Passport)", status: "Uploaded" },
    { id: "D2", name: "PAN Card", status: "Uploaded" },
    { id: "D3", name: "Bank Details", status: "Pending" },
    { id: "D4", name: "Resume / CV", status: "Uploaded" },
    { id: "D5", name: "Academic Certificates", status: "Rejected" },
    { id: "D6", name: "Passport Size Photo", status: "Uploaded" }
  ],
  "NH002": [
    { id: "D1", name: "ID Proof (Aadhaar/Passport)", status: "Uploaded" },
    { id: "D2", name: "PAN Card", status: "Uploaded" },
    { id: "D3", name: "Bank Details", status: "Uploaded" },
    { id: "D4", name: "Resume / CV", status: "Uploaded" },
    { id: "D5", name: "Academic Certificates", status: "Uploaded" },
    { id: "D6", name: "Passport Size Photo", status: "Uploaded" }
  ],
};

const initialTasksData: Record<string, TaskItem[]> = {
  "NH001": [
    { id: "T1", category: "HR", task: "Verify background docs", status: "Done", due: "2026-04-25" },
    { id: "T2", category: "HR", task: "Generate Employee ID", status: "Done", due: "2026-04-26" },
    { id: "T3", category: "IT", task: "Laptop Allocation", status: "Pending", due: "2026-04-27" },
    { id: "T4", category: "IT", task: "Corporate Email Setup", status: "Pending", due: "2026-04-27" },
    { id: "T5", category: "IT", task: "Access Rights Provision", status: "Pending", due: "2026-04-28" },
    { id: "T6", category: "Manager", task: "Introductory Team Meeting", status: "Overdue", due: "2026-04-26" },
    { id: "T7", category: "Manager", task: "Provide Team Space Access", status: "Pending", due: "2026-04-29" }
  ]
};

const onboardingSteps = [
  "Offer Accepted",
  "Documents Submitted",
  "HR Verification",
  "IT Setup",
  "Orientation",
  "Training Assigned",
  "Completed"
];

function NewHireFormModal({ 
  hire, 
  onClose, 
  onSave 
}: { 
  hire?: NewHire | null; 
  onClose: () => void; 
  onSave: (d: NewHire) => void 
}) {
  const [form, setForm] = useState({
    name: hire?.name || "",
    role: hire?.role || "",
    department: hire?.department || "Engineering",
    joiningDate: hire?.joiningDate || "2026-04-28",
    manager: hire?.manager || "",
    email: hire?.email || "",
    buddy: hire?.buddy || "",
    probationDays: hire ? String(hire.probationDays) : "30",
    currentStep: hire?.currentStep || "Offer Accepted",
    status: hire?.status || "On Track"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.role.trim()) newErrors.role = "Role is required.";
    if (!form.manager.trim()) newErrors.manager = "Manager is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: hire?.id || `NH00${Math.floor(Math.random() * 100)}`,
      name: form.name,
      role: form.role,
      department: form.department,
      joiningDate: form.joiningDate,
      manager: form.manager,
      email: form.email || `${form.name.toLowerCase().replace(' ', '.')}@nexus.com`,
      buddy: form.buddy,
      probationDays: Number(form.probationDays),
      progress: hire?.progress || (form.currentStep === 'Completed' ? 100 : form.currentStep === 'Offer Accepted' ? 14 : 50),
      currentStep: form.currentStep,
      status: form.status as 'On Track' | 'Delayed' | 'Overdue' | 'Completed',
      avatarColor: hire?.avatarColor || 'bg-indigo-600'
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border" style={{ background: "var(--card)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>
              {hire ? "Edit Onboarding Flow" : "Register New Hire"}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              Setup operational readiness parameters
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Full Name</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.name}</span>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Designation Role</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            {errors.role && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.role}</span>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Department</label>
            <select
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* Manager */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Reporting Manager</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="Enter manager name..."
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
            />
            {errors.manager && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.manager}</span>}
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Joining Date</label>
            <input
              type="date"
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
            />
          </div>

          {/* Pipeline Step */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Current Pipeline Stage</label>
            <select
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.currentStep}
              onChange={(e) => setForm({ ...form, currentStep: e.target.value })}
            >
              {onboardingSteps.map(step => (
                <option key={step} value={step}>{step}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Pipeline Status</label>
            <select
              className="w-full rounded-xl px-4 py-2 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'On Track' | 'Delayed' | 'Overdue' | 'Completed' })}
            >
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="Overdue">Overdue</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex gap-3 border-t border-border bg-neutral-50 dark:bg-zinc-800/40">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 text-xs font-extrabold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-sm transition-all active:scale-95 rounded-xl"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}

export function Onboarding() {
  const [hires, setHires] = useState<NewHire[]>(initialHiresData);
  const [selectedHire, setSelectedHire] = useState<NewHire | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editHire, setEditHire] = useState<NewHire | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [reminderPrompt, setReminderPrompt] = useState<string | null>(null);

  const handleSave = (newHire: NewHire) => {
    if (editHire) {
      setHires(prev => prev.map(h => h.id === newHire.id ? newHire : h));
      setEditHire(null);
    } else {
      setHires(prev => [...prev, newHire]);
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Role", "Department", "Joining Date", "Progress", "Current Step", "Status"];
    const rows = filteredHires.map(h => [h.id, h.name, h.role, h.department, h.joiningDate, `${h.progress}%`, h.currentStep, h.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "onboarding_hires.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summaries logic
  const kpiData = {
    total: hires.length,
    pendingDocs: 14, // Aggregated mock
    joiningWeek: hires.filter(h => h.joiningDate <= "2026-04-30" && h.status !== "Completed").length,
    completed: hires.filter(h => h.status === "Completed").length,
    itPending: hires.filter(h => h.currentStep === "IT Setup").length
  };

  const filteredHires = hires.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || h.department === deptFilter;
    const matchesStatus = statusFilter === "All" || h.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-[#E6F4EA] text-[#00B87C]';
      case 'Delayed': return 'bg-amber-50 text-amber-600';
      case 'Overdue': return 'bg-rose-50 text-rose-600';
      case 'Completed': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getStepIndex = (step: string) => onboardingSteps.indexOf(step);

  return (
    <div className="w-full">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">Onboarding</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus size={24} color="var(--primary)" />
            Employee Onboarding
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Manage new hire joining process efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-neutral-100 dark:bg-zinc-800 border border-border text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-neutral-200 transition-all"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            Add New Hire
          </button>
        </div>
      </div>

      {/* ── Top KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total New Hires', val: kpiData.total, icon: Users, color: 'text-[#00B87C]' },
          { label: 'Pending Documents', val: kpiData.pendingDocs, icon: FileText, color: 'text-amber-600' },
          { label: 'Joining This Week', val: kpiData.joiningWeek, icon: Calendar, color: 'text-indigo-600' },
          { label: 'Completed Onboarding', val: kpiData.completed, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'IT Setup Pending', val: kpiData.itPending, icon: Laptop, color: 'text-rose-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-50 dark:bg-zinc-800/50 ${kpi.color}`}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="text-lg font-extrabold text-foreground mt-0.5">{kpi.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Notifications Section ── */}
      <div className="bg-rose-50/60 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-3 mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-400">
          <AlertTriangle size={16} />
          <span>System Alert: Suresh G. background verification documents remain overdue by 3 days.</span>
        </div>
        <button className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-400 hover:underline">View Task</button>
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Employee Name / ID..."
            className="w-full pl-11 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Design">Design</option>
          </select>

          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ── Employee Table ── */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-zinc-800/40 border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-4 py-4">Department & Role</th>
                <th className="px-4 py-4">Joining Date</th>
                <th className="px-4 py-4">Current Step</th>
                <th className="px-4 py-4">Progress</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHires.map(hire => (
                <tr key={hire.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${hire.avatarColor} text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {hire.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{hire.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{hire.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{hire.role}</div>
                    <div className="text-[10px] font-medium text-muted-foreground">{hire.department}</div>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                    {hire.joiningDate}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      {hire.currentStep}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00B87C] rounded-full" style={{ width: `${hire.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{hire.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider border ${getStatusStyle(hire.status)}`}>
                      {hire.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedHire(hire)} 
                        className="px-3 py-1.5 text-[10px] font-extrabold text-[#00B87C] bg-emerald-50 dark:bg-emerald-950/30 rounded-lg hover:bg-emerald-100 transition-all"
                      >
                        View
                      </button>
                      <div className="relative">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                          onClick={() => setShowMenu(showMenu === hire.id ? null : hire.id)}
                        >
                          <MoreIcon size={16} />
                        </button>
                        {showMenu === hire.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
                            {['Edit', 'Send Reminder'].map(action => (
                              <button
                                key={action}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40"
                                onClick={() => { 
                                  setShowMenu(null); 
                                  if (action === 'Edit') setEditHire(hire);
                                }}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Employee Detail Panel (Drawer) ── */}
      {selectedHire && (
        <div
          className="fixed inset-0 z-[2000] flex justify-end p-4 sm:p-0"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setSelectedHire(null)}
        >
          <div
            className="w-full sm:w-[600px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 bg-white dark:bg-zinc-900"
            style={{ borderLeft: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${selectedHire.avatarColor} text-white flex items-center justify-center font-black text-sm shadow-sm`}>
                  {selectedHire.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{selectedHire.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedHire.role} • {selectedHire.department}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHire(null)} className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Advanced Parameters */}
              <div className="grid grid-cols-3 gap-3 text-center p-3 bg-neutral-50 dark:bg-zinc-800/40 border border-border rounded-2xl">
                <div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Manager</span>
                  <p className="text-xs font-extrabold text-foreground mt-1">{selectedHire.manager}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Buddy</span>
                  <p className="text-xs font-extrabold text-[#00B87C] mt-1">{selectedHire.buddy || 'Unassigned'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Probation</span>
                  <p className="text-xs font-extrabold text-foreground mt-1">{selectedHire.probationDays} Days</p>
                </div>
              </div>

              {/* Workflow Stepper Progress */}
              <div>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-4">Onboarding Pipeline</h4>
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 h-1 bg-neutral-100 dark:bg-zinc-800 z-0" />
                  <div 
                    className="absolute left-0 h-1 bg-[#00B87C] transition-all duration-500 z-0" 
                    style={{ width: `${(getStepIndex(selectedHire.currentStep) / (onboardingSteps.length - 1)) * 100}%` }}
                  />
                  {onboardingSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedHire.currentStep);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                          isDone ? 'bg-[#00B87C] border-[#00B87C] text-white' : 
                          isCurrent ? 'bg-white dark:bg-zinc-900 border-[#00B87C] text-[#00B87C] ring-4 ring-[#00B87C]/20' : 
                          'bg-white dark:bg-zinc-900 border-slate-200 text-slate-400'
                        }`}>
                          {isDone ? <Check size={12} /> : (idx + 1)}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-wider mt-2 hidden sm:block text-center max-w-[50px] ${
                          isCurrent ? 'text-[#00B87C]' : 'text-slate-400'
                        }`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document Checklist */}
              <div className="border-t border-border pt-5">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FileText size={14} /> Document Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(initialDocsData[selectedHire.id] || initialDocsData["NH001"]).map(doc => (
                    <div key={doc.id} className="p-3 rounded-xl border border-border bg-neutral-50 dark:bg-zinc-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck size={16} className={doc.status === 'Uploaded' ? 'text-[#00B87C]' : 'text-slate-400'} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{doc.name}</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        doc.status === 'Uploaded' ? 'bg-[#E6F4EA] text-[#00B87C]' : 
                        doc.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-amber-50 text-amber-600'
                      }`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Assignment Breakdown */}
              <div className="border-t border-border pt-5">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">Operation Clearances</h4>
                <div className="space-y-2">
                  {(initialTasksData[selectedHire.id] || initialTasksData["NH001"]).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                          task.category === 'HR' ? 'bg-indigo-50 text-indigo-600' : 
                          task.category === 'IT' ? 'bg-rose-50 text-rose-600' : 
                          'bg-amber-50 text-amber-600'
                        }`}>{task.category}</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{task.task}</p>
                          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Deadline: {task.due}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        task.status === 'Done' ? 'text-[#00B87C]' : 
                        task.status === 'Overdue' ? 'text-rose-600' : 
                        'text-amber-600'
                      }`}>
                        {task.status === 'Done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40 flex items-center justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setReminderPrompt(`Reminder successfully dispatched for ${selectedHire.name}.`)}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 border border-border rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Send Reminder
              </button>
              <button 
                onClick={() => {
                  setHires(prev => prev.map(h => h.id === selectedHire.id ? { ...h, progress: 100, currentStep: "Completed", status: "Completed" } : h));
                  setSelectedHire(null);
                }}
                className="px-4 py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-all"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {reminderPrompt && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#00B87C] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">Reminder Sent</h3>
            <p className="text-xs text-muted-foreground mb-5">{reminderPrompt}</p>
            <button
              className="w-full py-2.5 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-all"
              onClick={() => setReminderPrompt(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showAddModal && <NewHireFormModal onClose={() => setShowAddModal(false)} onSave={handleSave} />}
      {editHire && <NewHireFormModal hire={editHire} onClose={() => setEditHire(null)} onSave={handleSave} />}
    </div>
  );
}
