import React, { useState, useMemo } from "react";
import {
  TrendingUp, Search, ChevronDown, Download, Star, Users, 
  Calendar, Award, CheckCircle2, Clock, 
  RefreshCw, ChevronRight, Target, 
  Activity, UserCheck, Plus, FileText, 
  Trash2, Edit3, Home, X, AlertTriangle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie
} from "recharts";
import { employees, departments } from "../data/mockData";
import { toast, Toaster } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/* ─── Types ──────────────────────────────────────────────── */
type ReviewStatus = "Pending" | "In Review" | "Completed" | "Approved";
type Recommendation = "No Change" | "Bonus" | "Increment" | "Promotion";

interface ReviewHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  attendanceScore: number;
  performanceScore: number;
  rating: number;
  recommendation: Recommendation;
  status: ReviewStatus;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const reviewHistory: ReviewHistory[] = [
  { id: "R001", employeeId: "EMP001", employeeName: "Sarah Johnson", department: "Engineering", period: "Q1 2026", attendanceScore: 95, performanceScore: 92, rating: 4.8, recommendation: "Increment", status: "Approved" },
  { id: "R002", employeeId: "EMP002", employeeName: "Marcus Williams", department: "Marketing", period: "Q1 2026", attendanceScore: 88, performanceScore: 85, rating: 4.2, recommendation: "No Change", status: "Completed" },
  { id: "R003", employeeId: "EMP003", employeeName: "Yuki Tanaka", department: "Design", period: "Q1 2026", attendanceScore: 98, performanceScore: 95, rating: 4.9, recommendation: "Promotion", status: "Approved" },
  { id: "R004", employeeId: "EMP004", employeeName: "James Carter", department: "Finance", period: "Q1 2026", attendanceScore: 82, performanceScore: 80, rating: 3.9, recommendation: "No Change", status: "In Review" },
  { id: "R005", employeeId: "EMP005", employeeName: "Emily Rodriguez", department: "HR", period: "Q1 2026", attendanceScore: 91, performanceScore: 88, rating: 4.3, recommendation: "Bonus", status: "Pending" },
];

const trendData = [
  { name: "Jan", score: 78 },
  { name: "Feb", score: 82 },
  { name: "Mar", score: 85 },
  { name: "Apr", score: 88 },
  { name: "May", score: 92 },
];

const distributionData = [
  { name: "Exceptional", value: 15, color: "#10B981" },
  { name: "Exceeds", value: 35, color: "#14B8A6" },
  { name: "Meets", value: 40, color: "#F59E0B" },
  { name: "Below", value: 10, color: "#EF4444" },
];

/* ─── Components ─────────────────────────────────────────── */

function StatusBadge({ status }: { status: ReviewStatus }) {
  const cfg = {
    Pending: { bg: "rgba(100,116,139,0.1)", text: "#64748B" },
    "In Review": { bg: "rgba(245,158,11,0.1)", text: "#D97706" },
    Completed: { bg: "rgba(16,185,129,0.1)", text: "#059669" },
    Approved: { bg: "rgba(20,184,166,0.1)", text: "#0D9488" },
  }[status];
  return (
    <span style={{ backgroundColor: cfg.bg, color: cfg.text, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
      {status}
    </span>
  );
}

function MetricItem({ label, val, icon: Icon }: { label: string; val: number; icon: React.ElementType }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-slate-600">{label}</span>
        </div>
        <span className="text-xs font-bold text-slate-900">{val}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export function Performance() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedEmpId, setSelectedEmpId] = useState("All Employees");
  const [year, setYear] = useState("2026");
  const [period, setPeriod] = useState("Quarterly");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [history, setHistory] = useState<ReviewHistory[]>(reviewHistory);
  const [activeReview, setActiveReview] = useState<ReviewHistory | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);

  const filteredEmployees = useMemo(() => {
    if (selectedDept === "All Departments") return employees;
    return employees.filter(e => e.department === selectedDept);
  }, [selectedDept]);

  const selectedEmployee = useMemo(() => {
    if (modalMode === "create") return employees.find(e => e.id === selectedEmpId);
    return employees.find(e => e.name === activeReview?.employeeName);
  }, [selectedEmpId, activeReview, modalMode]);

  const filteredHistory = useMemo(() => {
    return history.filter(r => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        r.employeeName.toLowerCase().includes(q) || 
        r.employeeId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      
      const matchesStatus = status === "All" || r.status === status;
      const matchesDept = selectedDept === "All Departments" || r.department === selectedDept;
      
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [search, status, selectedDept, history]);

  const handleExport = () => {
    toast.loading('Generating performance report...');
    setTimeout(() => {
      const headers = "Employee,Dept,Period,Attendance,Performance,Rating,Recommendation,Status\n";
      const rows = filteredHistory.map(r => `${r.employeeName},${r.department},${r.period},${r.attendanceScore}%,${r.performanceScore}%,${r.rating},${r.recommendation},${r.status}`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `Performance_Report_${year}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.dismiss();
      toast.success('Report downloaded successfully!');
    }, 1500);
  };

  const handleStartReview = () => {
    if (selectedEmpId === "All Employees") {
      toast.error("Please select an employee first from the filters");
      return;
    }
    setModalMode("create");
    setActiveReview(null);
    setIsModalOpen(true);
  };

  const handleView = (review: ReviewHistory) => {
    setModalMode("view");
    setActiveReview(review);
    setIsModalOpen(true);
  };

  const handleEdit = (review: ReviewHistory) => {
    setModalMode("edit");
    setActiveReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setHistory(prev => prev.filter(r => r.id !== deleteTarget.id));
      toast.success("Review deleted successfully");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSaveReview = () => {
    if (modalMode === "edit" && activeReview) {
      setHistory(prev => prev.map(r => r.id === activeReview.id ? { ...r, status: "Completed" } : r));
      toast.success("Review updated successfully");
    } else {
      toast.success("New review submitted successfully");
    }
    setIsModalOpen(false);
  };

  const stats = [
    { label: "Total Reviews", val: "1,284", sub: "+12% from last cycle", icon: <FileText size={18} />, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    { label: "Pending Reviews", val: "124", sub: "Awaiting your action", icon: <Clock size={18} />, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "Completed Reviews", val: "842", sub: "65% completion rate", icon: <CheckCircle2 size={18} />, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Average Score", val: "86.4", sub: "↑ 2.4% vs last year", icon: <TrendingUp size={18} />, color: "#0D9488", bg: "rgba(13,148,136,0.1)" },
    { label: "Eligible for Increment", val: "48", sub: "Based on perf scores", icon: <Award size={18} />, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    { label: "Promotion Recommended", val: "12", sub: "High performers list", icon: <UserCheck size={18} />, color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
            <Home size={12} />
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-emerald-600">Performance Review</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Performance Review</h1>
          <p className="text-sm font-bold text-slate-500">Track employee performance, appraisal scores, and review history</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} /> Export Report
          </button>
          <button 
            onClick={handleStartReview}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-black flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={18} /> Start Review
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: s.bg, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mb-1" style={{ color: s.color }}>{s.val}</h3>
              <p className="text-[10px] font-bold text-slate-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <div className="relative">
              <select 
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedEmpId("All Employees"); }}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option>All Departments</option>
                {departments.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee</label>
            <div className="relative">
              <select 
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option>All Employees</option>
                {filteredEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
            <div className="relative">
              <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
            <div className="relative">
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Half-Yearly</option>
                <option>Yearly</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <div className="relative">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer">
                <option>All</option>
                <option>Pending</option>
                <option>In Review</option>
                <option>Completed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => { setSelectedDept("All Departments"); setSelectedEmpId("All Employees"); setStatus("All"); setSearch(""); }}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-all"
          >
            <RefreshCw size={14} /> Clear Filters
          </button>
        </div>
      </div>

      {/* ── Performance Table ── */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Review History</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent 5 records</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Att. Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perf. Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendation</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs uppercase">
                        {r.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{r.employeeName}</p>
                        <p className="text-[10px] font-bold text-slate-500">{r.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{r.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{r.period}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${r.attendanceScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{r.attendanceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={{ width: `${r.performanceScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{r.performanceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-black ml-0.5">{r.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${r.recommendation === 'Promotion' ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {r.recommendation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleView(r)}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all"
                      >
                        <FileText size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(r)}
                        className="p-2 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id, r.employeeName)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Employee Performance Summary Card (Always Visible) */}
        <div className="lg:col-span-12">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[20px] bg-slate-50 overflow-hidden border-2 border-emerald-50 shrink-0">
                  {selectedEmployee?.avatar ? (
                    <img src={selectedEmployee.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-slate-300">
                      <Users size={32} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedEmployee?.name || "Select Employee"}</h3>
                  <p className="text-sm font-bold text-slate-500">{selectedEmployee?.id || "EMP---"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Performance Score</p>
                <div className="flex items-center gap-3">
                   <h4 className="text-3xl font-black text-emerald-600">88.5</h4>
                   <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <MetricItem label="Attendance Score" val={95} icon={Calendar} />
               <MetricItem label="Productivity" val={92} icon={Activity} />
               <MetricItem label="Teamwork" val={85} icon={Users} />
               <MetricItem label="Task Completion" val={84} icon={Target} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Appraisal Eligibility Panel ── */}
      <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Appraisal Eligibility</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance %</p>
            <p className="text-xl font-black text-slate-900">96.8%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Late Count</p>
            <p className="text-xl font-black text-amber-600">02</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leave Count</p>
            <p className="text-xl font-black text-slate-900">04</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perf. Score</p>
            <p className="text-xl font-black text-emerald-600">92/100</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility</p>
              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white">ELIGIBLE</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-slate-900">Suggested Increment</p>
              <p className="text-2xl font-black text-emerald-600">12.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Dept Avg Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="employees" radius={[0, 10, 10, 0]} barSize={20}>
                  {departments.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#14B8A6', '#0D9488', '#0891B2', '#0284C7'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Rating Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden focus:outline-none">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <div>
                <Dialog.Title className="text-xl font-black text-slate-900">
                  {modalMode === "view" ? "Performance Report" : modalMode === "edit" ? "Edit Appraisal" : "New Performance Evaluation"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-bold text-slate-500">
                  {modalMode === "view" ? "Detailed performance analytics and ratings" : `Complete the appraisal for ${selectedEmployee?.name}`}
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className="p-8 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Metrics Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <img src={selectedEmployee?.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-black text-slate-900">{selectedEmployee?.name}</h4>
                        <p className="text-xs font-bold text-slate-500">{selectedEmployee?.role || selectedEmployee?.designation}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <MetricItem label="Attendance" val={activeReview?.attendanceScore || 95} icon={Calendar} />
                      <MetricItem label="Performance" val={activeReview?.performanceScore || 92} icon={Activity} />
                      <MetricItem label="Teamwork" val={85} icon={Users} />
                      <MetricItem label="Task Completion" val={88} icon={Target} />
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Review Period</label>
                      <input type="text" value={activeReview?.period || `${period} ${year}`} readOnly className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reviewer</label>
                      <input type="text" value="Robert Chen" readOnly className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Strengths</label>
                    <textarea 
                      rows={2} 
                      readOnly={modalMode === "view"}
                      placeholder="Key strengths..." 
                      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-emerald-500 transition-all ${modalMode === "view" ? 'bg-slate-50 cursor-not-allowed' : ''}`} 
                      defaultValue={modalMode !== "create" ? "Exceptional attention to detail and consistent high-quality output." : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Improvement Areas</label>
                    <textarea 
                      rows={2} 
                      readOnly={modalMode === "view"}
                      placeholder="Areas to grow..." 
                      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-emerald-500 transition-all ${modalMode === "view" ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      defaultValue={modalMode !== "create" ? "Could improve communication frequency with external stakeholders." : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Recommendation</label>
                    <div className="relative">
                      <select 
                        disabled={modalMode === "view"}
                        defaultValue={activeReview?.recommendation || "No Change"}
                        className={`w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer ${modalMode === "view" ? 'bg-slate-50 cursor-not-allowed opacity-100' : ''}`}
                      >
                        <option>No Change</option>
                        <option>Bonus</option>
                        <option>Increment</option>
                        <option>Promotion</option>
                      </select>
                      {modalMode !== "view" && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 flex items-center gap-4 bg-slate-50/50">
              <Dialog.Close className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-black hover:bg-slate-50 transition-all">
                {modalMode === "view" ? "Close" : "Cancel"}
              </Dialog.Close>
              {modalMode !== "view" && (
                <button 
                  onClick={handleSaveReview}
                  className="flex-[2] py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                >
                  {modalMode === "edit" ? "Save Changes" : "Submit Evaluation"}
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Delete Confirmation Modal ── */}
      <AlertDialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-slate-900/30 z-[110]" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[32px] shadow-2xl z-[111] overflow-hidden focus:outline-none p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <AlertDialog.Title className="text-xl font-black text-slate-900 mb-2">Delete Review Record?</AlertDialog.Title>
            <AlertDialog.Description className="text-sm font-bold text-slate-500 mb-8">
              Are you sure you want to delete the performance record for <span className="text-slate-900 font-black">{deleteTarget?.name}</span>? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex items-center gap-4">
              <AlertDialog.Cancel className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black hover:bg-slate-200 transition-all">
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action 
                onClick={confirmDelete}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-black shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
              >
                Delete Record
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}