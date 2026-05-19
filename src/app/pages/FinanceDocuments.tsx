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
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";

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

const documentCategories: Category[] = [
  {
    id: "identity",
    title: "Identity Documents",
    icon: FileText,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    chipColor: "bg-teal-500/10 text-teal-600",
    files: [
      { name: "Aadhar Card", status: "Uploaded", uploadDate: "Apr 1" },
      { name: "PAN Card", status: "Uploaded" },
      { name: "Passport", status: "Expiring", expiryDate: "Jun 2026", canUpdate: true },
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
      { name: "Offer Letter", status: "Uploaded" },
      { name: "Appointment Letter", status: "Uploaded" },
      { name: "NDA", status: "Uploaded" },
      { name: "Last Appraisal", status: "Uploaded" },
      { name: "Promotion Letter", status: "Uploaded" },
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
      { name: "10th Certificate", status: "Uploaded" },
      { name: "12th Certificate", status: "Uploaded" },
      { name: "B.Com Degree", status: "Uploaded" },
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
      { name: "Bank Passbook", status: "Uploaded" },
      { name: "Form 16 (2024-25)", status: "Uploaded" },
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
      { name: "Medical Insurance Card", status: "Uploaded" },
      { name: "Health Declaration", status: "Uploaded" },
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
      { name: "Digital ID Card", status: "Uploaded" },
      { name: "Access Badge", status: "Uploaded" },
      { name: "NDA Copy", status: "Uploaded" },
    ]
  }
];

export function FinanceDocuments() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] dark:bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
            <Folder size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">My Documents</h1>
            <p className="text-[13px] font-bold text-muted-foreground">Access and manage your digital repository</p>
          </div>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
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
        {documentCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* UPLOAD MODAL */}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm hover:border-[#00B87C]/30 transition-all flex flex-col h-full">
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${category.iconBg} flex items-center justify-center ${category.iconColor}`}>
            <category.icon size={20} />
          </div>
          <h3 className="text-[16px] font-black text-foreground tracking-tight">{category.title}</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-lg ${category.chipColor} text-[10px] font-black uppercase tracking-widest`}>
          {category.files.length} files
        </span>
      </div>
      
      <div className="divide-y divide-border">
        {category.files.map((file, i) => (
          <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-[#F0FDF4] dark:hover:bg-emerald-500/5 transition-all h-[48px] group">
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
                  <button className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline">View</button>
                  {file.canUpdate && (
                    <button className="text-[11px] font-black text-amber-600 uppercase tracking-widest hover:underline">Update</button>
                  )}
                  {file.uploadDate && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground ml-1">
                      <CheckCircle2 size={12} className="text-emerald-500" /> {file.uploadDate}
                    </div>
                  )}
                </div>
              ) : (
                <button className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest hover:underline">Upload</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

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
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground"><X size={20} /></button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Document Type</label>
              <button className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border flex items-center justify-between text-sm font-bold text-foreground">
                Select type <ChevronDown size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">File Upload</label>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#F0FDF4]/30 dark:bg-emerald-500/5 group hover:border-[#00B87C] transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] mb-4 group-hover:scale-110 transition-transform">
                  <CloudUpload size={24} />
                </div>
                <p className="text-[14px] font-bold text-foreground mb-1">Drag files here or <span className="text-[#00B87C] hover:underline">Browse</span></p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Max 10MB · PDF, JPG, PNG</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description (Optional)</label>
              <input type="text" placeholder="Add a short description..." className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Expiry Date (If applicable)</label>
              <input type="date" className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-sm font-bold" />
            </div>
          </div>

          <button className="w-full py-4 bg-[#00B87C] text-white rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] shadow-xl shadow-[#00B87C]/20 hover:opacity-95 transition-all">
            Upload
          </button>
        </div>
      </motion.div>
    </div>
  );
}
