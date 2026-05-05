import { useState } from "react";
import {
  Folder,
  UploadCloud,
  X,
  User,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Heart,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
type DocStatus = "uploaded" | "expiring" | "not-uploaded" | "pending";

interface DocItem {
  name: string;
  status: DocStatus;
  uploadedDate?: string;
  expiryLabel?: string;
  actions: ("view" | "update" | "upload")[];
}

interface DocCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  items: DocItem[];
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const CATEGORIES: DocCategory[] = [
  {
    id: "identity",
    title: "Identity Documents",
    icon: User,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-primary",
    items: [
      { name: "Aadhar Card",      status: "uploaded",     uploadedDate: "Apr 1, 2026",  actions: ["view"] },
      { name: "PAN Card",         status: "uploaded",     uploadedDate: "Uploaded",      actions: ["view"] },
      { name: "Passport",         status: "expiring",     expiryLabel: "Expires Jun 2026", actions: ["view", "update"] },
      { name: "Driving License",  status: "not-uploaded",                                 actions: ["upload"] },
    ],
  },
  {
    id: "employment",
    title: "Employment Documents",
    icon: Briefcase,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    items: [
      { name: "Offer Letter",         status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Appointment Letter",   status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "NDA",                  status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Last Appraisal",       status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
    ],
  },
  {
    id: "education",
    title: "Educational Certificates",
    icon: GraduationCap,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    items: [
      { name: "10th Certificate",  status: "uploaded",     uploadedDate: "Uploaded", actions: ["view"] },
      { name: "12th Certificate",  status: "uploaded",     uploadedDate: "Uploaded", actions: ["view"] },
      { name: "B.Tech Degree",     status: "uploaded",     uploadedDate: "Uploaded", actions: ["view"] },
      { name: "PG Diploma",        status: "not-uploaded",                            actions: ["upload"] },
    ],
  },
  {
    id: "financial",
    title: "Financial Documents",
    icon: IndianRupee,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    items: [
      { name: "Bank Passbook",           status: "uploaded",     uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Form 16 (2024-25)",        status: "uploaded",     uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Investment Proofs",        status: "not-uploaded",                            actions: ["upload"] },
    ],
  },
  {
    id: "health",
    title: "Health & Insurance",
    icon: Heart,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    items: [
      { name: "Medical Insurance Card", status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Health Declaration",     status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
    ],
  },
  {
    id: "company",
    title: "Company-Issued Documents",
    icon: Building2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-primary",
    items: [
      { name: "ID Card (digital)", status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "Access Badge",      status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
      { name: "NDA",               status: "uploaded", uploadedDate: "Uploaded", actions: ["view"] },
    ],
  },
];

const DOC_TYPES = [
  "Aadhar Card", "PAN Card", "Passport", "Driving License",
  "Offer Letter", "Appointment Letter", "NDA",
  "10th Certificate", "12th Certificate", "B.Tech Degree", "PG Diploma",
  "Bank Passbook", "Form 16", "Investment Proofs",
  "Medical Insurance Card", "Health Declaration",
  "ID Card", "Access Badge", "Other",
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function StatusChip({ status, expiryLabel }: { status: DocStatus; expiryLabel?: string }) {
  if (status === "uploaded") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-black text-primary">
        <CheckCircle2 size={13} /> Uploaded
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-black text-amber-500">
        <AlertTriangle size={13} /> Pending
      </span>
    );
  }
  if (status === "expiring") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black border border-amber-500/20 whitespace-nowrap">
        <AlertTriangle size={11} /> {expiryLabel || "Expiring Soon"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black border border-rose-500/20 whitespace-nowrap">
      <XCircle size={11} /> Not Uploaded
    </span>
  );
}

function CategoryCard({
  cat,
  onUploadClick,
  onViewClick,
}: {
  cat: DocCategory;
  onUploadClick: (docName: string) => void;
  onViewClick: (docName: string) => void;
}) {
  const uploadedCount = cat.items.filter(
    (i) => i.status === "uploaded" || i.status === "expiring"
  ).length;
  const hasIssues =
    cat.items.some((i) => i.status === "expiring") ||
    cat.items.some((i) => i.status === "not-uploaded");

  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.iconBg}`}>
          <cat.icon size={20} className={cat.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-black text-foreground leading-tight truncate">
            {cat.title}
          </h3>
          <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{cat.items.length} total items</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-primary text-[10px] font-black border border-primary/20">
            {uploadedCount}/{cat.items.length}
          </span>
          {hasIssues && (
            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          )}
        </div>
      </div>

      <div className="divide-y divide-border">
        {cat.items.map((doc, i) => (
          <div
            key={i}
            className="px-5 py-3.5 flex items-center gap-4 group hover:bg-secondary/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-foreground truncate leading-tight">
                {doc.name}
              </p>
              {doc.status === "uploaded" && (
                <span className="text-[11px] font-bold text-muted-foreground">{doc.uploadedDate}</span>
              )}
            </div>

            <div className="flex-shrink-0">
              <StatusChip status={doc.status} expiryLabel={doc.expiryLabel} />
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              {doc.actions.includes("view") && (
                <button
                  onClick={() => onViewClick(doc.name)}
                  className="text-[12px] font-black text-primary hover:underline"
                >
                  View
                </button>
              )}
              {doc.actions.includes("upload") && (
                <button
                  onClick={() => onUploadClick(doc.name)}
                  className="text-[12px] font-black text-primary hover:underline"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeDocuments() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [preselectedDocType, setPreselectedDocType] = useState<string | undefined>();
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const handleUpload = (docName?: string) => {
    setPreselectedDocType(typeof docName === 'string' ? docName : undefined);
    setShowUploadModal(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-20">

      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Folder size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            My Documents
          </h1>
        </div>
        <button
          onClick={() => handleUpload()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <UploadCloud size={18} />
          Upload Document
        </button>
      </div>

      {/* ─── Status Banner ───────────────────────────────────────── */}
      <div className="w-full bg-emerald-500/10 rounded-[20px] border border-primary/20 px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3 dark:bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[14px] font-black text-primary">
            2 documents pending upload
          </span>
        </div>
        <div className="w-px h-5 bg-primary/20 hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[14px] font-black text-amber-600 dark:text-amber-500">
            1 document expiring soon{" "}
            <span className="font-bold opacity-80">(Passport)</span>
          </span>
        </div>
      </div>

      {/* ─── Category Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            onUploadClick={handleUpload}
            onViewClick={(name) => setViewingDoc(name)}
          />
        ))}
      </div>

      {/* ─── Modals ──────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" onClick={() => setShowUploadModal(false)} />
           <div className="relative bg-card w-full max-w-[480px] rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <UploadCloud size={20} className="text-primary" />
                    </div>
                    <h3 className="text-[18px] font-black text-foreground">Upload Document</h3>
                 </div>
                 <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); showToast("Uploaded", "success", "Document has been uploaded."); setShowUploadModal(false); }}>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Document Type</label>
                    <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none" defaultValue={preselectedDocType}>
                       <option value="">Select type...</option>
                       {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">File Selection</label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-secondary transition-all cursor-pointer">
                       <UploadCloud size={32} className="text-muted-foreground" />
                       <p className="text-[13px] font-black text-foreground">Drop file or Click to Browse</p>
                       <p className="text-[11px] font-bold text-muted-foreground">PDF, PNG, JPG (Max 10MB)</p>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all">
                    Upload Document
                 </button>
              </form>
           </div>
        </div>
      )}

      {viewingDoc && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" onClick={() => setViewingDoc(null)} />
           <div className="relative bg-card w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                       <h3 className="text-[15px] font-black text-foreground">{viewingDoc}</h3>
                       <p className="text-[11px] font-bold text-primary">Preview</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-8 flex flex-col items-center gap-6">
                 <div className="w-full aspect-[3/4] bg-secondary rounded-2xl border border-border flex flex-col items-center justify-center gap-2">
                    <FileText size={48} className="text-muted-foreground/30" />
                    <p className="text-[12px] font-bold text-muted-foreground italic">Document Preview Not Available</p>
                 </div>
                 <button 
                  onClick={() => { showToast("Downloading", "info", "File download started."); setViewingDoc(null); }}
                  className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all"
                 >
                    Download File
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
