import { Building2, Plus, Users, TrendingUp, X, User, MoreVertical as MoreIcon, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";

/* ─── Types ─────────────────────────────── */
interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  status: 'Active' | 'Inactive';
  employees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  annualBudget: number;
  budgetUsed: number;
  growth: number;
  description?: string;
  createdDate?: string;
  lastUpdated?: string;
}

/* ─── Enhanced Mock Data ─────────────────── */
const initialDeptsData: Department[] = [
  {
    id: "DEPT001",
    name: "Engineering",
    code: "ENG",
    head: "Suresh Iyer",
    status: "Active",
    employees: 820,
    activeEmployees: 805,
    onLeaveEmployees: 15,
    annualBudget: 12000000,
    budgetUsed: 8500000,
    growth: 18,
    description: "Core technology development and infrastructure scaling.",
    createdDate: "Jan 15, 2023",
    lastUpdated: "Apr 20, 2026"
  },
  {
    id: "DEPT002",
    name: "Sales",
    code: "SLS",
    head: "Vikram Singh",
    status: "Active",
    employees: 540,
    activeEmployees: 532,
    onLeaveEmployees: 8,
    annualBudget: 8500000,
    budgetUsed: 6200000,
    growth: 12,
    description: "Revenue acquisition and client relationship onboarding.",
    createdDate: "Mar 10, 2023",
    lastUpdated: "Apr 18, 2026"
  },
  {
    id: "DEPT003",
    name: "Marketing",
    code: "MKT",
    head: "Sneha Patel",
    status: "Active",
    employees: 310,
    activeEmployees: 300,
    onLeaveEmployees: 10,
    annualBudget: 6000000,
    budgetUsed: 4800000,
    growth: 8,
    description: "Product placement, digital campaigns, and branding initiatives.",
    createdDate: "Feb 20, 2023",
    lastUpdated: "Mar 15, 2026"
  },
  {
    id: "DEPT004",
    name: "HR",
    code: "HR",
    head: "Meera Thomas",
    status: "Active",
    employees: 180,
    activeEmployees: 176,
    onLeaveEmployees: 4,
    annualBudget: 4000000,
    budgetUsed: 3100000,
    growth: 5,
    description: "Talent scouting, organizational benefits, and policy rollout.",
    createdDate: "Jan 05, 2023",
    lastUpdated: "Feb 28, 2026"
  },
  {
    id: "DEPT005",
    name: "Finance",
    code: "FIN",
    head: "Ananya Das",
    status: "Active",
    employees: 240,
    activeEmployees: 238,
    onLeaveEmployees: 2,
    annualBudget: 5500000,
    budgetUsed: 4100000,
    growth: 6,
    description: "Corporate audits, payroll compliance, and bookkeeping operations.",
    createdDate: "Jun 01, 2023",
    lastUpdated: "Apr 10, 2026"
  },
  {
    id: "DEPT006",
    name: "Operations",
    code: "OPS",
    head: "Priya Nair",
    status: "Inactive",
    employees: 757,
    activeEmployees: 740,
    onLeaveEmployees: 17,
    annualBudget: 9500000,
    budgetUsed: 8900000,
    growth: 14,
    description: "Logistics fulfillment, quality checks, and supply parameters.",
    createdDate: "May 12, 2023",
    lastUpdated: "Dec 15, 2025"
  }
];

/* ─── Add / Edit Modal ───────────────────── */
function DepartmentFormModal({ 
  dept, 
  onClose, 
  onSave 
}: { 
  dept?: Department | null; 
  onClose: () => void; 
  onSave: (d: Department) => void 
}) {
  const [form, setForm] = useState({
    name: dept?.name || "",
    code: dept?.code || "",
    head: dept?.head || "",
    budget: dept ? String(dept.annualBudget) : "",
    status: dept?.status || "Active",
    description: dept?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Department name is required.";
    if (!form.code.trim()) newErrors.code = "Department code is required.";
    if (!form.head.trim()) newErrors.head = "Department head is required.";
    
    const budgetNum = Number(form.budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = "Please enter a valid annual budget amount.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: dept?.id || `DEPT00${Math.floor(Math.random() * 100)}`,
      name: form.name,
      code: form.code.toUpperCase(),
      head: form.head,
      status: form.status,
      annualBudget: budgetNum,
      budgetUsed: dept?.budgetUsed || 0,
      employees: dept?.employees || 0,
      activeEmployees: dept?.activeEmployees || 0,
      onLeaveEmployees: dept?.onLeaveEmployees || 0,
      growth: dept?.growth || 0,
      description: form.description,
      createdDate: dept?.createdDate || "Apr 27, 2026",
      lastUpdated: "Apr 27, 2026"
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 border-b border-border"
          style={{ background: "var(--card)" }}
        >
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>
              {dept ? "Edit Department" : "Create Department"}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              Manage organizational boundaries
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Dept Name */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Department Name</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="e.g. Engineering"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.name}</span>}
          </div>

          {/* Dept Code */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Department Code</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold uppercase"
              placeholder="e.g. ENG"
              value={form.code}
              maxLength={4}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            {errors.code && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.code}</span>}
          </div>

          {/* Dept Head */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Department Head</label>
            <input
              type="text"
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="Select manager..."
              value={form.head}
              onChange={(e) => setForm({ ...form, head: e.target.value })}
            />
            {errors.head && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.head}</span>}
          </div>

          {/* Allocated Budget */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Allocated Budget (Annual)</label>
            <input
              type="number"
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              placeholder="Annual capacity in INR"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
            {errors.budget && <span className="text-[10px] font-bold text-rose-600 mt-1 block">{errors.budget}</span>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Operational Status</label>
            <select
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              rows={2}
              className="w-full rounded-xl px-4 py-2.5 text-xs border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 resize-none font-medium leading-relaxed"
              placeholder="Describe primary focus points..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex gap-3 border-t border-border bg-neutral-50 dark:bg-zinc-800/40">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-sm transition-all active:scale-95"
          >
            {dept ? "Update Unit" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail View Modal ──────────────────── */
function DepartmentDetailModal({ dept, onClose }: { dept: Department; onClose: () => void }) {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val/10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val/100000).toFixed(0)}L`;
    return `₹${val.toLocaleString()}`;
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end p-4 sm:p-0"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[550px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 bg-white dark:bg-zinc-900"
        style={{ borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
              <Building2 size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                {dept.name} 
                <span className="text-xs font-black text-slate-400 border border-border px-2 py-0.5 rounded-lg">{dept.code}</span>
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Department Intelligence Summary</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stat Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Staff</p>
              <p className="text-lg font-extrabold text-foreground mt-1">{dept.employees}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Active</p>
              <p className="text-lg font-extrabold text-emerald-600 mt-1">{dept.activeEmployees}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">On Leave</p>
              <p className="text-lg font-extrabold text-rose-500 mt-1">{dept.onLeaveEmployees}</p>
            </div>
          </div>

          {/* Budget Stat Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Allocated</p>
              <p className="text-base font-extrabold text-foreground mt-1">{formatCurrency(dept.annualBudget)}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Used</p>
              <p className="text-base font-extrabold text-[#F59E0B] mt-1">{formatCurrency(dept.budgetUsed)}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-background text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Remaining</p>
              <p className="text-base font-extrabold text-emerald-600 mt-1">{formatCurrency(dept.annualBudget - dept.budgetUsed)}</p>
            </div>
          </div>

          {/* General Information */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block mb-1">Department Head</span>
              <div className="text-sm font-bold text-foreground">{dept.head}</div>
            </div>
            <div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block mb-1">Description</span>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{dept.description}</div>
            </div>
            <div className="flex gap-6 border-t border-border pt-3">
              <div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Created Date</span>
                <span className="text-xs font-bold text-foreground">{dept.createdDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Last Updated</span>
                <span className="text-xs font-bold text-foreground">{dept.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Employee List Preview */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Users size={16} />
              <span>Department Roster Preview</span>
            </h4>
            <div className="space-y-2 max-h-[250px] overflow-y-auto border border-border rounded-2xl p-2 bg-neutral-50 dark:bg-zinc-800/50">
              {[
                { name: 'Rohan Sharma', role: 'Lead Engineer', status: 'Active' },
                { name: 'Aarti Gupta', role: 'Staff Dev', status: 'Active' },
                { name: 'Vijay Kumar', role: 'QA Analyst', status: 'On Leave' },
                { name: 'Divya S.', role: 'Frontend Dev', status: 'Active' }
              ].map((emp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-zinc-700/40 rounded-xl transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{emp.role}</p>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${emp.status === 'Active' ? 'bg-[#E6F4EA] text-[#00B87C]' : 'bg-amber-50 text-amber-600'}`}>
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Departments Page ──────────────── */
export function Departments() {
  const [depts, setDepts] = useState<Department[]>(initialDeptsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [sortBy, setSortBy] = useState<"Employees" | "Budget" | "Name">("Employees");

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<Department | null>(null);
  const [assignHeadDept, setAssignHeadDept] = useState<Department | null>(null);
  const [viewEmployeesDept, setViewEmployeesDept] = useState<Department | null>(null);
  const [headInput, setHeadInput] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Currencies formating
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val/10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val/100000).toFixed(0)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const handleSave = (newDept: Department) => {
    if (editDept) {
      setDepts(prev => prev.map(d => d.id === newDept.id ? newDept : d));
      setEditDept(null);
    } else {
      setDepts(prev => [...prev, newDept]);
    }
  };

  // Filter / Sort application
  const filteredDepts = depts
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           d.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           d.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "Employees") return b.employees - a.employees;
      if (sortBy === "Budget") return b.annualBudget - a.annualBudget;
      return a.name.localeCompare(b.name);
    });

  return (
    <div style={{ maxWidth: "1360px" }}>
      
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Departments
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Manage organizational capacity boundaries efficiently.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs active:scale-95 shadow-sm"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, head, or code..."
            className="w-full pl-11 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'Employees' | 'Budget' | 'Name')}
          >
            <option value="Employees">Sort: Employees</option>
            <option value="Budget">Sort: Budget</option>
            <option value="Name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* ── Department Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => {
          const budgetPercent = Math.min((dept.budgetUsed / dept.annualBudget) * 100, 100);
          
          return (
            <div
              key={dept.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group"
            >
              {/* Status / Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${dept.status === 'Active' ? 'bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20' : 'bg-slate-100 text-slate-400 border-border'}`}>
                  {dept.status}
                </span>
                
                <div className="relative">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === dept.id ? null : dept.id);
                    }}
                  >
                    <MoreIcon size={16} />
                  </button>
                  
                  {showMenu === dept.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
                      {['View Department', 'Edit Department', 'Assign Head', 'View Employees', 'Delete Department'].map(action => (
                        <button
                          key={action}
                          className={`w-full text-left px-4 py-2 text-xs font-bold ${action === 'Delete Department' ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' : 'text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(null);
                            if (action === 'View Department') setSelectedDept(dept);
                            if (action === 'Edit Department') setEditDept(dept);
                            if (action === 'Assign Head') setAssignHeadDept(dept);
                            if (action === 'View Employees') setViewEmployeesDept(dept);
                            if (action === 'Delete Department') setDeleteConfirmDept(dept);
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div onClick={() => setSelectedDept(dept)} className="cursor-pointer">
                {/* Dept Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                    <Building2 size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {dept.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{dept.code}</p>
                  </div>
                </div>

                {/* Stats Sub */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center bg-neutral-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-border">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Total</span>
                    <span className="text-xs font-extrabold text-foreground">{dept.employees}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Active</span>
                    <span className="text-xs font-extrabold text-emerald-600">{dept.activeEmployees}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Leave</span>
                    <span className="text-xs font-extrabold text-rose-500">{dept.onLeaveEmployees}</span>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5">
                    <span>Budget Used</span>
                    <span className="font-black text-foreground">{formatCurrency(dept.budgetUsed)} / {formatCurrency(dept.annualBudget)}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 bg-[#00B87C]" 
                      style={{ width: `${budgetPercent}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <User size={14} className="text-slate-400" />
                  <span>{dept.head}</span>
                </div>
                
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold">
                  <TrendingUp size={12} color="var(--primary)" />
                  <span color="var(--primary)">+{dept.growth}%</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create Department Option Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed border-border hover:border-[#00B87C] hover:bg-emerald-50/10"
          style={{ minHeight: "180px" }}
        >
          <div className="flex items-center justify-center rounded-full w-10 h-10 bg-secondary text-[#00B87C]">
            <Plus size={20} />
          </div>
          <p className="text-xs font-extrabold text-[#00B87C]">
            Create Department
          </p>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      {deleteConfirmDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Delete Department?</h3>
            <p className="text-xs text-muted-foreground mb-5">Are you sure you want to remove the <span className="font-black text-slate-800 dark:text-slate-200">"{deleteConfirmDept.name}"</span> workspace unit? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                onClick={() => setDeleteConfirmDept(null)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2 text-xs font-extrabold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-sm transition-colors active:scale-95"
                onClick={() => {
                  setDepts(prev => prev.filter(d => d.id !== deleteConfirmDept.id));
                  setDeleteConfirmDept(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Head Modal */}
      {assignHeadDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border p-6 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">Assign Head</h3>
            <p className="text-xs text-muted-foreground mb-4">Update the management lead for <span className="font-black text-slate-800 dark:text-slate-200">"{assignHeadDept.name}"</span>.</p>
            <div className="relative mb-4">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Enter head name..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
                value={headInput !== "" ? headInput : assignHeadDept.head}
                onChange={(e) => setHeadInput(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                onClick={() => { setAssignHeadDept(null); setHeadInput(""); }}
              >
                Cancel
              </button>
              <button
                className="w-full py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors"
                onClick={() => {
                  if (headInput.trim()) {
                    setDepts(prev => prev.map(d => d.id === assignHeadDept.id ? { ...d, head: headInput.trim() } : d));
                  }
                  setAssignHeadDept(null);
                  setHeadInput("");
                }}
              >
                Save Head
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employees Modal */}
      {viewEmployeesDept && (
        <div
          className="fixed inset-0 z-50 flex justify-end p-4 sm:p-0"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setViewEmployeesDept(null)}
        >
          <div
            className="w-full sm:w-[450px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 bg-white dark:bg-zinc-900"
            style={{ borderLeft: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                  <Users size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    {viewEmployeesDept.name} Team
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{viewEmployeesDept.employees} total employees listed</p>
                </div>
              </div>
              <button onClick={() => setViewEmployeesDept(null)} className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-neutral-50 dark:bg-zinc-900">
              {[
                { name: 'Rohan Sharma', role: 'Lead Engineer', status: 'Active', email: 'rohan.s@nexus.com' },
                { name: 'Aarti Gupta', role: 'Staff Dev', status: 'Active', email: 'aarti.g@nexus.com' },
                { name: 'Vijay Kumar', role: 'QA Analyst', status: 'On Leave', email: 'vijay.k@nexus.com' },
                { name: 'Divya S.', role: 'Frontend Dev', status: 'Active', email: 'divya.s@nexus.com' },
                { name: 'Rahul M.', role: 'DevOps Lead', status: 'Active', email: 'rahul.m@nexus.com' }
              ].map((emp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center text-xs font-black">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{emp.role} • {emp.email}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${emp.status === 'Active' ? 'bg-[#E6F4EA] text-[#00B87C]' : 'bg-amber-50 text-amber-600'}`}>
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40 flex justify-end flex-shrink-0">
              <button onClick={() => setViewEmployeesDept(null)} className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors">
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && <DepartmentFormModal onClose={() => setShowAddModal(false)} onSave={handleSave} />}
      {editDept && <DepartmentFormModal dept={editDept} onClose={() => setEditDept(null)} onSave={handleSave} />}
      {selectedDept && <DepartmentDetailModal dept={selectedDept} onClose={() => setSelectedDept(null)} />}
    </div>
  );
}
