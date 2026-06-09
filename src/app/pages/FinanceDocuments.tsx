import { useState } from "react";
import { 
  Folder, 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  IndianRupee, 
  Heart, 
  Building2,
  CloudUpload,
  ChevronDown,
  Eye,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

interface DocumentItem {
  name: string;
  status: "Uploaded" | "Pending" | "Expiring" | "Not Uploaded";
  uploadDate?: string;
  expiryDate?: string;
  canUpdate?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  chipColor: string;
  files: DocumentItem[];
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "identity",
    title: "Identity Documents",
    icon: FileText,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    chipColor: "bg-teal-500/10 text-teal-600",
    files: [
      { name: "Aadhar Card", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "PAN Card", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Passport", status: "Expiring", expiryDate: "Jun 2026", canUpdate: true, uploadDate: "Mar 15" },
      { name: "Driving License", status: "Not Uploaded" },
    ]
  },
  {
    id: "employment",
    title: "Employment Documents",
    icon: Briefcase,
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#7C3AED]",
    chipColor: "bg-purple-500/10 text-purple-600",
    files: [
      { name: "Offer Letter", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Appointment Letter", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "NDA", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Last Appraisal", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Promotion Letter", status: "Uploaded", uploadDate: "Apr 1" },
    ]
  },
  {
    id: "educational",
    title: "Educational Certificates",
    icon: GraduationCap,
    iconBg: "bg-[#E0F2FE]",
    iconColor: "text-[#0EA5E9]",
    chipColor: "bg-blue-500/10 text-blue-600",
    files: [
      { name: "10th Certificate", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "12th Certificate", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "B.Com Degree", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "CA Foundation", status: "Not Uploaded" },
    ]
  },
  {
    id: "financial",
    title: "Financial Documents",
    icon: IndianRupee,
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    chipColor: "bg-amber-500/10 text-amber-600",
    files: [
      { name: "Bank Passbook", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Form 16 (2024-25)", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Investment Proofs", status: "Not Uploaded" },
    ]
  },
  {
    id: "health",
    title: "Health & Insurance",
    icon: Heart,
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#EF4444]",
    chipColor: "bg-rose-500/10 text-rose-600",
    files: [
      { name: "Medical Insurance Card", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Health Declaration", status: "Uploaded", uploadDate: "Apr 1" },
    ]
  },
  {
    id: "company",
    title: "Company-Issued",
    icon: Building2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    chipColor: "bg-emerald-500/10 text-emerald-600",
    files: [
      { name: "Digital ID Card", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "Access Badge", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "NDA Copy", status: "Uploaded", uploadDate: "Apr 1" },
    ]
  }
];

export function FinanceDocuments() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<{ categoryId: string; fileName: string } | null>(null);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const handleOpenUpload = (categoryId: string, fileName: string) => {
    setSelectedFileForUpload({ categoryId, fileName });
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = (categoryId: string, fileName: string, expiry?: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        files: cat.files.map(f => {
          if (f.name !== fileName) return f;
          return {
            ...f,
            status: "Uploaded" as const,
            uploadDate: "Today",
            expiryDate: expiry || f.expiryDate
          };
        })
      };
    }));
    setIsUploadModalOpen(false);
    setSelectedFileForUpload(null);
    showToast("Upload Successful", "success", `Document "${fileName}" was successfully saved to cloud storage.`);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#E0F2FE] dark:bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
            <Folder size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">My Documents</h1>
            <p className="text-[13px] text-[#6B7280]">Access and manage your digital repository</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedFileForUpload(null);
            setIsUploadModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* STATUS BANNER */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 py-4 rounded-2xl border bg-muted/5 border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[13px] font-black text-foreground">1 document expiring soon</span>
          <span className="text-[12px] font-bold text-muted-foreground">— Passport (Jun 2026)</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase">Expiring</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[13px] font-black text-foreground">3 documents pending upload</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 text-[9px] font-black uppercase">Required</span>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-[#00B87C]/30 transition-all flex flex-col h-full">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${category.iconBg} flex items-center justify-center ${category.iconColor}`}>
                  <category.icon size={20} />
                </div>
                <h3 className="text-[16px] font-black text-foreground tracking-tight">{category.title}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg ${category.chipColor} text-[11px] font-bold uppercase tracking-widest`}>
                {category.files.length} files
              </span>
            </div>
            
            <div className="divide-y divide-border">
              {category.files.map((file, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-[#00B87C]/[0.08] dark:hover:bg-emerald-500/5 transition-all h-[48px] group">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-muted-foreground/40 group-hover:text-[#00B87C] transition-all" />
                    <span className="text-[14px] font-bold text-foreground">{file.name}</span>
                    {file.status === "Expiring" && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase tracking-tight">Expires {file.expiryDate}</span>
                    )}
                    {file.status === "Not Uploaded" && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 text-[9px] font-black uppercase tracking-tight">Not Uploaded</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {file.status === "Uploaded" || file.status === "Expiring" ? (
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setViewingDoc(file.name)}
                          className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline bg-transparent"
                        >
                          View
                        </button>
                        {file.canUpdate && (
                          <button 
                            onClick={() => handleOpenUpload(category.id, file.name)}
                            className="text-[11px] font-black text-amber-600 uppercase tracking-widest hover:underline bg-transparent"
                          >
                            Update
                          </button>
                        )}
                        {file.uploadDate && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground ml-1">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {file.uploadDate}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleOpenUpload(category.id, file.name)}
                        className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-all bg-transparent"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <UploadModal 
            isOpen={isUploadModalOpen} 
            onClose={() => {
              setIsUploadModalOpen(false);
              setSelectedFileForUpload(null);
            }} 
            preSelected={selectedFileForUpload}
            categories={categories}
            onSubmit={handleUploadSubmit}
          />
        )}
      </AnimatePresence>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {viewingDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDoc(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[640px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#00B87C]" size={20} />
                  <h3 className="text-[16px] font-black text-foreground">{viewingDoc} Preview</h3>
                </div>
                <button onClick={() => setViewingDoc(null)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground bg-transparent">
                  <X size={20} />
                </button>
              </div>
              <div className="p-12 flex flex-col items-center justify-center bg-secondary/20 min-h-[300px] border-b border-border">
                <div className="w-24 h-32 rounded-lg bg-card border border-border flex flex-col p-4 shadow-md justify-between items-center relative overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] mb-2">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full" />
                  <div className="w-full h-1 bg-muted rounded-full" />
                  <div className="w-full h-1 bg-muted rounded-full" />
                  <div className="w-full h-4 bg-[#00B87C]/20 border border-[#00B87C]/30 text-[#00B87C] text-[6px] rounded flex items-center justify-center font-bold">NEXUSHR SECURE</div>
                </div>
                <p className="text-[13px] font-bold text-foreground mt-6">{viewingDoc}</p>
                <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Digital Verified Copy</p>
              </div>
              <div className="p-6 bg-muted/10 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setViewingDoc(null)}
                  className="px-5 py-2.5 rounded-xl border border-border bg-secondary text-[12px] font-bold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setViewingDoc(null);
                    showToast("Downloading", "success", "Your file download started successfully.");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelected: { categoryId: string; fileName: string } | null;
  categories: Category[];
  onSubmit: (categoryId: string, fileName: string, expiry?: string) => void;
}

function UploadModal({ isOpen, onClose, preSelected, categories, onSubmit }: UploadModalProps) {
  const [catId, setCatId] = useState(preSelected?.categoryId || categories[0]?.id || "");
  const [docName, setDocName] = useState(preSelected?.fileName || "");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState("");

  const currentCategory = categories.find(c => c.id === catId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId || !docName) {
      showToast("Error", "error", "Please fill in all required fields.");
      return;
    }
    onSubmit(catId, docName, expiry);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[460px] bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground tracking-tight">Upload Document</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground bg-transparent"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Category</label>
              <select 
                value={catId} 
                onChange={(e) => {
                  setCatId(e.target.value);
                  const firstFile = categories.find(c => c.id === e.target.value)?.files[0]?.name || "";
                  setDocName(firstFile);
                }}
                disabled={!!preSelected}
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Document Name</label>
              {preSelected ? (
                <input 
                  type="text" 
                  value={docName} 
                  disabled 
                  className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border text-sm font-bold text-muted-foreground" 
                />
              ) : (
                <select 
                  value={docName} 
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground"
                >
                  {currentCategory?.files.map((f, index) => (
                    <option key={index} value={f.name}>{f.name}</option>
                  ))}
                  <option value="Other Custom Document">Other Custom Document</option>
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">File Upload</label>
              <div 
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf,.jpg,.jpeg,.png";
                  input.onchange = () => {
                    showToast("File Selected", "info", "File loaded successfully.");
                  };
                  input.click();
                }}
                className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#F0FDF4]/30 dark:bg-emerald-500/5 group hover:border-[#00B87C] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] mb-4 group-hover:scale-110 transition-transform">
                  <CloudUpload size={24} />
                </div>
                <p className="text-[14px] font-bold text-foreground mb-1">Drag files here or <span className="text-[#00B87C] hover:underline">Browse</span></p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Max 10MB · PDF, JPG, PNG</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Description (Optional)</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..." 
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Expiry Date (If applicable)</label>
              <input 
                type="date" 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold text-foreground" 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] shadow-xl shadow-[#00B87C]/20 hover:opacity-95 transition-all mt-4"
            >
              Upload
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

