import React, { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Folder,
  Search,
  Grid,
  List,
  FileText,
  UploadCloud,
  X,
  Download,
  Eye,
  Archive,
  Trash2,
  AlertCircle,
  CheckCircle2,
  File,
  Clock,
  HardDrive,
  User,
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
  category:
    | "HR Policies"
    | "IT Policies"
    | "Finance"
    | "Contracts"
    | "Compliance"
    | "Templates";
  linkedEmployee?: string;
  linkedDept?: string;
  uploadedBy: string;
  date: string;
  expiry?: string;
  version: string;
  status: "Active" | "Pending" | "Expired" | "Archived" | "Missing";
  size: string;
  type: "PDF" | "DOC" | "XLS" | "IMG";
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
      { version: "v2.0", updatedBy: "Dave K.", updatedDate: "2025-12-15" },
    ],
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
    versions: [
      { version: "v1.0", updatedBy: "Dave K.", updatedDate: "2026-02-15" },
    ],
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
    versions: [
      { version: "v1.4", updatedBy: "HR Admin", updatedDate: "2026-03-10" },
    ],
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
    versions: [
      { version: "v1.0", updatedBy: "Sarah J.", updatedDate: "2025-12-28" },
    ],
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
    versions: [
      { version: "v1.1", updatedBy: "Sys Admin", updatedDate: "2026-01-05" },
    ],
  },
];

export function Documents() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
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
    category: "HR Policies" as
      | "HR Policies"
      | "IT Policies"
      | "Finance"
      | "Contracts"
      | "Compliance"
      | "Templates",
    linkedEmployee: "",
    linkedDept: "All",
    expiry: "",
    notes: "",
  });

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Name,Category,Status,UploadedBy,Date\n" +
      docs
        .map(
          (d) =>
            `${d.name},${d.category},${d.status},${d.uploadedBy},${d.date}`,
        )
        .join("\n");
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
      date: new Date().toISOString().split("T")[0],
      expiry: uploadForm.expiry || undefined,
      version: "v1.0",
      status: "Active",
      size: "1.5 MB",
      type: uploadForm.name.endsWith(".pdf")
        ? "PDF"
        : uploadForm.name.endsWith(".xls")
          ? "XLS"
          : "DOC",
      versions: [
        {
          version: "v1.0",
          updatedBy: "Sarah J.",
          updatedDate: new Date().toISOString().split("T")[0],
        },
      ],
    };

    setDocs((prev) => [newDoc, ...prev]);
    setShowUploadModal(false);
    setUploadForm({
      name: "",
      category: "HR Policies",
      linkedEmployee: "",
      linkedDept: "All",
      expiry: "",
      notes: "",
    });
  };

  const handleArchive = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Archived" } : d)),
    );
  };

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/5 text-emerald-600 border-emerald-500/10";
      case "Pending":
        return "bg-amber-500/5 text-amber-600 border-amber-500/10";
      case "Expired":
        return "bg-rose-500/5 text-rose-600 border-rose-500/10";
      case "Archived":
        return "bg-slate-500/5 text-slate-500 border-slate-500/10";
      case "Missing":
        return "bg-purple-500/5 text-purple-600 border-purple-500/10";
      default:
        return "bg-neutral-500/5 text-slate-600 border-neutral-500/10";
    }
  };

  const getFileIconColor = (type: string) => {
    return type ? "bg-[#00B87C] text-white" : "bg-[#00B87C] text-white";
  };

  // Filter Calculations
  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCat = catFilter === "All" || doc.category === catFilter;
    const matchesDept = deptFilter === "All" || doc.linkedDept === deptFilter;
    const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
    return matchesSearch && matchesCat && matchesDept && matchesStatus;
  });

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">
              Documents
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-[#111827] dark:text-foreground flex items-center gap-3">
            <Folder size={32} className="text-[#00B87C]" />
            Documents
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage employee and company documents securely.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground bg-card border border-border hover:bg-muted/50 transition-all shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-[#00B87C] hover:bg-[#059669] shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 cursor-pointer"
          >
            <UploadCloud size={16} />
            Upload Document
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total Documents",
            val: docs.length,
            icon: File,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "80%",
            colorName: "emerald",
          },
          {
            label: "Expiring Soon",
            val: "2",
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            percent: "20%",
            colorName: "amber",
          },
          {
            label: "Pending Approval",
            val: docs.filter((d) => d.status === "Pending").length,
            icon: Clock,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "40%",
            colorName: "emerald",
          },
          {
            label: "Recently Added",
            val: "4",
            icon: CheckCircle2,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "60%",
            colorName: "emerald",
          },
          {
            label: "Storage Used",
            val: "1.2 GB",
            icon: HardDrive,
            color: "text-[#00B87C]",
            bg: "bg-[#00B87C]/10",
            percent: "70%",
            colorName: "emerald",
          },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="relative group bg-card border border-border p-5 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#00B87C]/5 transition-all duration-300"
          >
            {/* Glow circle */}
            <div
              className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#00B87C]/5 group-hover:scale-150 transition-transform duration-500`}
            />

            <div className="relative flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} dark:bg-zinc-800/50 ${kpi.color}`}
              >
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                  {kpi.val}
                </p>
              </div>
            </div>

            <div className="mt-4 w-full h-1 bg-muted/50 rounded-full overflow-hidden relative z-10">
              <div
                className={`h-full ${kpi.colorName === "amber" ? "bg-amber-500" : "bg-[#00B87C]"} transition-all duration-1000`}
                style={{ width: kpi.percent }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-card border border-border p-4 rounded-3xl shadow-sm flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[9px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-1 ml-1">
              Search Files
            </label>
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00B87C] transition-colors"
              />
              <input
                type="text"
                placeholder="Search by file name..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-white dark:bg-zinc-900/50 text-foreground font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-1 ml-1">
              Category
            </label>
            <select
              className="text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
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
            <label className="block text-[9px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-1 ml-1">
              Department
            </label>
            <select
              className="text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
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
            <label className="block text-[9px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-1 ml-1">
              Status
            </label>
            <select
              className="text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
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

          <div className="flex items-center gap-0.5 border border-border rounded-xl p-0.5 bg-white dark:bg-zinc-900/50 h-[34px] self-end ml-auto">
            <button
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-[#00B87C] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={15} />
            </button>
            <button
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#00B87C] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT TABLE / GRID ── */}
      {viewMode === "list" ? (
        <div className="bg-card border border-border rounded-[32px] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-muted/30">
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Linked To</th>
                  <th className="px-4 py-4">Uploaded By</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Expiry</th>
                  <th className="px-4 py-4">Version</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-bold text-slate-700 dark:text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="group hover:bg-emerald-500/[0.02] dark:hover:bg-emerald-500/[0.02] transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getFileIconColor(doc.type)} shadow-lg shadow-[#00B87C]/20`}
                      >
                        <FileText size={18} />
                      </div>
                      <span className="truncate max-w-[180px] font-black text-foreground">
                        {doc.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 font-bold">
                      {doc.category}
                    </td>
                    <td className="px-4 py-4">
                      {doc.linkedEmployee ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/10 text-[10px] font-black uppercase tracking-wider">
                          <User size={12} className="text-[#00B87C]" />
                          {doc.linkedEmployee}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/10 text-[10px] font-black uppercase tracking-wider">
                          {doc.linkedDept || "Global"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-foreground/80">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-4 py-4 text-slate-400 font-medium">
                      {doc.date}
                    </td>
                    <td className="px-4 py-4 text-slate-400 font-medium">
                      {doc.expiry || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] font-bold bg-muted/80 px-2 py-0.5 rounded-lg border border-border">
                        {doc.version}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[9px] font-black tracking-wider uppercase ${getStatusBadge(doc.status)}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-[#00B87C] hover:border-[#00B87C]/35 transition-all"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleArchive(doc.id)}
                          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-amber-600 hover:border-amber-500/35 transition-all"
                          title="Archive"
                        >
                          <Archive size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(doc.id)}
                          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-rose-600 hover:border-rose-500/35 transition-all"
                          title="Delete"
                        >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Dedicated Upload Document Card in Grid */}
          <div
            onClick={() => setShowUploadModal(true)}
            className="bg-[#F0FDF4]/30 dark:bg-emerald-500/5 p-6 rounded-3xl border-2 border-dashed border-[#00B87C]/30 hover:border-[#00B87C] flex flex-col items-center justify-center text-center relative cursor-pointer transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] group min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#00B87C]/10 text-[#00B87C] mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <UploadCloud size={24} />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
              Upload Document
            </h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              Drag files or click to browse
            </p>
          </div>

          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center text-center relative transition-all hover:-translate-y-[2px] hover:border-[#00B87C]/50 hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getFileIconColor(doc.type)} mb-3 shadow-lg shadow-[#00B87C]/20`}
              >
                <FileText size={24} />
              </div>

              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate w-full px-2">
                {doc.name}
              </h4>
              <div className="text-[11px] font-bold text-slate-400 mt-1">
                {doc.size} • {doc.type}
              </div>

              <span
                className={`mt-3 px-2.5 py-1 rounded-full border text-[8px] font-black tracking-wider uppercase ${getStatusBadge(doc.status)}`}
              >
                {doc.status}
              </span>

              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border w-full">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="text-slate-500 hover:text-[#00B87C] text-[11px] font-black flex items-center gap-1 transition-all"
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => handleArchive(doc.id)}
                  className="text-slate-400 hover:text-amber-600 text-[11px] font-black flex items-center gap-1 transition-all"
                >
                  <Archive size={12} /> Archive
                </button>
                <button
                  onClick={() => setConfirmDeleteId(doc.id)}
                  className="text-slate-400 hover:text-rose-600 text-[11px] font-black flex items-center gap-1 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Upload Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-xl bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl bg-[#F0FDF4]/30 dark:bg-emerald-500/5 p-6 flex flex-col items-center text-center relative hover:border-[#00B87C] transition-all cursor-pointer group">
                <UploadCloud
                  size={32}
                  className="text-[#00B87C] mb-1 group-hover:scale-105 transition-transform"
                />
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Drag files here or{" "}
                  <span className="text-[#00B87C] hover:underline">Browse</span>
                </p>
                <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
                  Max 25MB · PDF, DOC, XLS
                </span>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Employee Handbook"
                  className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all"
                  value={uploadForm.name}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider">
                    Category
                  </label>
                  <select
                    className="w-full text-xs px-3 py-2 border border-border rounded-xl bg-white dark:bg-zinc-900/50 text-foreground font-bold hover:border-[#00B87C] focus:border-[#00B87C] outline-none transition-all cursor-pointer"
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        category: e.target.value as DocItem["category"],
                      })
                    }
                  >
                    <option value="HR Policies">HR Policies</option>
                    <option value="IT Policies">IT Policies</option>
                    <option value="Finance">Finance</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase ml-1 tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full text-xs px-3 py-2 border border-border bg-white dark:bg-zinc-900/50 rounded-xl font-bold text-foreground outline-none focus:border-[#00B87C] focus:ring-4 focus:ring-[#00B87C]/5 transition-all cursor-pointer"
                    value={uploadForm.expiry}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, expiry: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#00B87C] hover:bg-[#059669] text-white text-xs font-black rounded-xl shadow-lg shadow-[#00B87C]/20 transition-all active:scale-95 uppercase tracking-widest"
              >
                Upload Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Preview Side Drawer ── */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[2000] flex justify-end bg-black/40"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl animate-in slide-in-from-right p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4 flex-shrink-0 bg-emerald-500/[0.01]">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Document Details
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-xl bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-none">
              {/* File Display Card */}
              <div className="w-full aspect-video bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-center text-white relative shadow-inner border border-border">
                <FileText
                  size={40}
                  className={`${getFileIconColor(previewDoc.type)} p-2 rounded-xl shadow shadow-[#00B87C]/20`}
                />
                <span className="text-xs font-black mt-3 truncate px-4 w-full">
                  {previewDoc.name}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-bold">
                  {previewDoc.size} • {previewDoc.type}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-border pb-1">
                  Metadata
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`text-[9px] px-2.5 py-0.5 rounded-full border w-fit ${getStatusBadge(previewDoc.status)}`}
                  >
                    {previewDoc.status}
                  </span>

                  <span className="text-slate-500">Uploaded By:</span>
                  <span className="text-slate-850 dark:text-slate-200">
                    {previewDoc.uploadedBy}
                  </span>

                  <span className="text-slate-500">Date Added:</span>
                  <span className="text-slate-850 dark:text-slate-200">
                    {previewDoc.date}
                  </span>

                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="text-slate-850 dark:text-slate-200">
                    {previewDoc.expiry || "None"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-border pb-1">
                  Version History
                </h4>
                <div className="space-y-2">
                  {previewDoc.versions.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs font-bold bg-white dark:bg-zinc-900/30 p-3 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-black border border-border">
                          {v.version}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {v.updatedBy}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {v.updatedDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  setPreviewDoc(null);
                  toast.success("File download started successfully.");
                }}
                className="flex-1 py-3 text-xs font-black text-white bg-[#00B87C] hover:bg-[#059669] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
              >
                <Download size={16} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm bg-card border border-border rounded-[28px] shadow-2xl p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">
              Confirm Deletion
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-bold">
              Are you absolutely sure you want to permanently remove this
              document? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 bg-muted border border-border hover:bg-neutral-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                  toast.success("Document deleted successfully");
                }}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
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
