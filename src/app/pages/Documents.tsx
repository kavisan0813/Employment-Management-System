import React, { useState } from "react";
import {
  Folder, Search, Grid, List, FileText,
  UploadCloud, X,
  Download, Eye, Archive, Trash2, AlertCircle,
  CheckCircle2, File, Clock, HardDrive, User
} from "lucide-react";

/* ─── Types ─────────────────────────────── */
interface VersionLog {
  version: string;
  updatedBy: string;
  updatedDate: string;
}

interface DocItem {
  id: string;
  name: string;
  category: 'HR Policies' | 'IT Policies' | 'Finance' | 'Contracts' | 'Compliance' | 'Templates';
  linkedEmployee?: string;
  linkedDept?: string;
  uploadedBy: string;
  date: string;
  expiry?: string;
  version: string;
  status: 'Active' | 'Pending' | 'Expired' | 'Archived' | 'Missing';
  size: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'IMG';
  versions: VersionLog[];
}

/* ─── Mock Data ─────────────────────────── */
const initialDocs: DocItem[] = [
  {
    id: "D1",
    name: "Employee_Handbook_2026.pdf",
    category: "HR Policies",
    linkedDept: "All",
    uploadedBy: "Sarah J.",
    date: "2026-04-01",
    expiry: "2026-12-31",
    version: "v2.1",
    status: "Active",
    size: "2.4 MB",
    type: "PDF",
    versions: [
      { version: "v2.1", updatedBy: "Sarah J.", updatedDate: "2026-04-01" },
      { version: "v2.0", updatedBy: "Dave K.", updatedDate: "2025-12-15" }
    ]
  },
  {
    id: "D2",
    name: "Work_From_Home_Policy.doc",
    category: "HR Policies",
    linkedDept: "Engineering",
    uploadedBy: "Dave K.",
    date: "2026-02-15",
    version: "v1.0",
    status: "Active",
    size: "1.1 MB",
    type: "DOC",
    versions: [{ version: "v1.0", updatedBy: "Dave K.", updatedDate: "2026-02-15" }]
  },
  {
    id: "D3",
    name: "Q1_Finance_Audits.xls",
    category: "Finance",
    linkedDept: "Finance",
    uploadedBy: "HR Admin",
    date: "2026-03-10",
    version: "v1.4",
    status: "Pending",
    size: "850 KB",
    type: "XLS",
    versions: [{ version: "v1.4", updatedBy: "HR Admin", updatedDate: "2026-03-10" }]
  },
  {
    id: "D4",
    name: "Passport_Copy_Priya.pdf",
    category: "Contracts",
    linkedEmployee: "Priya Sharma",
    uploadedBy: "Sarah J.",
    date: "2025-12-28",
    expiry: "2026-05-15",
    version: "v1.0",
    status: "Expired",
    size: "1.8 MB",
    type: "PDF",
    versions: [{ version: "v1.0", updatedBy: "Sarah J.", updatedDate: "2025-12-28" }]
  },
  {
    id: "D5",
    name: "NDA_Agreement_Rohan.doc",
    category: "Compliance",
    linkedEmployee: "Rohan Das",
    uploadedBy: "Sys Admin",
    date: "2026-01-05",
    version: "v1.1",
    status: "Archived",
    size: "1.5 MB",
    type: "DOC",
    versions: [{ version: "v1.1", updatedBy: "Sys Admin", updatedDate: "2026-01-05" }]
  }
];

export function Documents() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Upload State
  const [uploadForm, setUploadForm] = useState({
    name: "",
    category: "HR Policies" as 'HR Policies' | 'IT Policies' | 'Finance' | 'Contracts' | 'Compliance' | 'Templates',
    linkedEmployee: "",
    linkedDept: "All",
    expiry: "",
    notes: ""
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Category,Status,UploadedBy,Date\n" +
      docs.map(d => `${d.name},${d.category},${d.status},${d.uploadedBy},${d.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "documents_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) return;

    const newDoc: DocItem = {
      id: `D${Math.floor(Math.random() * 1000)}`,
      name: uploadForm.name,
      category: uploadForm.category,
      linkedEmployee: uploadForm.linkedEmployee || undefined,
      linkedDept: uploadForm.linkedDept,
      uploadedBy: "Sarah J.",
      date: new Date().toISOString().split('T')[0],
      expiry: uploadForm.expiry || undefined,
      version: "v1.0",
      status: "Active",
      size: "1.5 MB",
      type: uploadForm.name.endsWith('.pdf') ? 'PDF' : uploadForm.name.endsWith('.xls') ? 'XLS' : 'DOC',
      versions: [{ version: "v1.0", updatedBy: "Sarah J.", updatedDate: new Date().toISOString().split('T')[0] }]
    };

    setDocs(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
    setUploadForm({ name: "", category: "HR Policies", linkedEmployee: "", linkedDept: "All", expiry: "", notes: "" });
  };

  const handleArchive = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'Archived' } : d));
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Expired': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Archived': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Missing': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-neutral-50 text-slate-600';
    }
  };

  const getFileIconColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-rose-500 text-white';
      case 'DOC': return 'bg-blue-500 text-white';
      case 'XLS': return 'bg-emerald-500 text-white';
      case 'IMG': return 'bg-purple-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  // Filter Calculations
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter === "All" || doc.category === catFilter;
    const matchesDept = deptFilter === "All" || doc.linkedDept === deptFilter;
    const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
    return matchesSearch && matchesCat && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 bg-background w-full">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">Documents</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Folder size={26} className="text-[#00B87C]" />
            Documents
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Manage employee and company documents securely
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-white dark:bg-zinc-900 border border-border text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs shadow-sm active:scale-95"
          >
            <UploadCloud size={16} />
            Upload Document
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Documents', val: docs.length, icon: File, color: 'text-[#00B87C]', bg: 'bg-emerald-50' },
          { label: 'Expiring Soon', val: '2', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending Approval', val: docs.filter(d => d.status === 'Pending').length, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Recently Added', val: '4', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Storage Used', val: '1.2 GB', icon: HardDrive, color: 'text-rose-500', bg: 'bg-rose-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-border shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} dark:bg-zinc-800/50 ${kpi.color}`}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="text-lg font-extrabold tracking-tight-slate-900 dark:text-slate-100 mt-0.5">{kpi.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-border shadow-sm flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Search Files</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by file name..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-border bg-background text-foreground font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Category</label>
            <select
              className="text-xs p-1.5 border border-border rounded-xl bg-background text-foreground font-bold"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="HR Policies">HR Policies</option>
              <option value="IT Policies">IT Policies</option>
              <option value="Finance">Finance</option>
              <option value="Contracts">Contracts</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Department</label>
            <select
              className="text-xs p-1.5 border border-border rounded-xl bg-background text-foreground font-bold"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</label>
            <select
              className="text-xs p-1.5 border border-border rounded-xl bg-background text-foreground font-bold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex items-end gap-1 border border-border rounded-xl p-0.5 bg-neutral-50 dark:bg-zinc-800 h-[34px] self-end">
            <button
              className={`p-1 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-[#00B87C] shadow-sm' : 'text-slate-400'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`p-1 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-[#00B87C] shadow-sm' : 'text-slate-400'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT TABLE / GRID ── */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-zinc-800 border-b border-border text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Linked To</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-[#F8FAF9] dark:hover:bg-zinc-800/40 transition-all">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileIconColor(doc.type)}`}>
                        <FileText size={16} />
                      </div>
                      <span className="truncate max-w-[180px]">{doc.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{doc.category}</td>
                    <td className="px-4 py-3">
                      {doc.linkedEmployee ? (
                        <span className="flex items-center gap-1 text-[10px]">
                          <User size={12} className="text-slate-400" />
                          {doc.linkedEmployee}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-500">
                          {doc.linkedDept || "Global"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-slate-400">{doc.date}</td>
                    <td className="px-4 py-3 text-slate-400">{doc.expiry || '-'}</td>
                    <td className="px-4 py-3"><span className="text-[10px] font-bold bg-neutral-100 dark:bg-zinc-800 px-1 rounded">{doc.version}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setPreviewDoc(doc)} className="p-1.5 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-lg text-slate-500 hover:text-[#00B87C]" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleArchive(doc.id)} className="p-1.5 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-amber-600" title="Archive">
                          <Archive size={14} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(doc.id)} className="p-1.5 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-rose-600" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Dedicated Upload Document Card in Grid */}
          <div 
            onClick={() => setShowUploadModal(true)}
            className="bg-[#F0FDF4]/50 dark:bg-zinc-800/20 p-4 rounded-2xl border-2 border-dashed border-[#00B87C]/30 hover:border-[#00B87C]/80 flex flex-col items-center justify-center text-center relative cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group min-h-[160px]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E6F4EA] text-[#00B87C] mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <UploadCloud size={24} />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Upload Document</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Drag files or click to browse</p>
          </div>

          {filteredDocs.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center relative transition-all hover:-translate-y-1 hover:shadow-md group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileIconColor(doc.type)} mb-3 shadow-md`}>
                <FileText size={24} />
              </div>

              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate w-full px-2">{doc.name}</h4>
              <div className="text-[10px] font-bold text-slate-400 mt-1">{doc.size} • {doc.type}</div>

              <span className={`mt-2 px-2 py-0.5 rounded-full border text-[8px] font-black tracking-wider uppercase ${getStatusBadge(doc.status)}`}>
                {doc.status}
              </span>

              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-neutral-50 dark:border-zinc-800 w-full">
                <button onClick={() => setPreviewDoc(doc)} className="text-slate-500 hover:text-[#00B87C] text-[10px] font-extrabold flex items-center gap-1">
                  <Eye size={12} /> View
                </button>
                <button onClick={() => handleArchive(doc.id)} className="text-slate-400 hover:text-amber-600 text-[10px] font-extrabold flex items-center gap-1">
                  <Archive size={12} /> Archive
                </button>
                <button onClick={() => setConfirmDeleteId(doc.id)} className="text-slate-400 hover:text-rose-600 text-[10px] font-extrabold flex items-center gap-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUploadModal(false)}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-xl p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="border-2 border-dashed border-neutral-200 dark:border-zinc-800 rounded-2xl bg-[#F0FDF4]/30 p-6 flex flex-col items-center text-center relative hover:border-[#00B87C]/50 transition-all cursor-pointer">
                <UploadCloud size={40} className="text-[#00B87C] mb-1" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Drag files here or Browse</p>
                <span className="text-[9px] text-slate-400 mt-1">Max 25MB · PDF, DOC, XLS</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Document Name</label>
                <input
                  type="text"
                  className="w-full text-xs p-2 border border-border bg-background rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20"
                  value={uploadForm.name}
                  onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                  <select
                    className="w-full text-xs p-2 border border-border rounded-xl bg-background text-foreground font-bold cursor-pointer"
                    value={uploadForm.category}
                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value as 'HR Policies' | 'IT Policies' | 'Finance' | 'Contracts' | 'Compliance' | 'Templates' })}
                  >
                    <option value="HR Policies">HR Policies</option>
                    <option value="IT Policies">IT Policies</option>
                    <option value="Finance">Finance</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full text-xs p-2 border border-border bg-background rounded-xl font-bold text-foreground cursor-pointer"
                    value={uploadForm.expiry}
                    onChange={e => setUploadForm({ ...uploadForm, expiry: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 bg-[#00B87C] hover:bg-[#00a36d] text-white text-xs font-black rounded-xl shadow-sm transition-all active:scale-95"
              >
                Upload Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Preview Side Drawer ── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setPreviewDoc(null)}>
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl animate-in slide-in-from-right p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4 flex-shrink-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Document Details</h3>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-none">
              {/* File Display Card */}
              <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center text-white relative shadow-inner border border-zinc-800">
                <FileText size={40} className={`${getFileIconColor(previewDoc.type)} p-2 rounded-xl shadow`} />
                <span className="text-xs font-extrabold mt-3 truncate px-4 w-full">{previewDoc.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{previewDoc.size} • {previewDoc.type}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/60 pb-1">Metadata</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <span className="text-slate-500">Status:</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded border w-fit ${getStatusBadge(previewDoc.status)}`}>{previewDoc.status}</span>

                  <span className="text-slate-500">Uploaded By:</span>
                  <span className="text-slate-800 dark:text-slate-200">{previewDoc.uploadedBy}</span>

                  <span className="text-slate-500">Date Added:</span>
                  <span className="text-slate-800 dark:text-slate-200">{previewDoc.date}</span>

                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="text-slate-800 dark:text-slate-200">{previewDoc.expiry || 'None'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/60 pb-1">Version History</h4>
                <div className="space-y-2">
                  {previewDoc.versions.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold bg-neutral-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-border">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-zinc-700 text-[9px] font-black">{v.version}</span>
                        <span className="text-slate-700 dark:text-slate-300">{v.updatedBy}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{v.updatedDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex gap-3 flex-shrink-0">
              <button className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 rounded-xl flex items-center justify-center gap-2">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setConfirmDeleteId(null)}>
          <div 
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-xl p-6 animate-in zoom-in-95" 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-2">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 mb-4 font-bold">Are you absolutely sure you want to permanently remove this document? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 bg-neutral-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
