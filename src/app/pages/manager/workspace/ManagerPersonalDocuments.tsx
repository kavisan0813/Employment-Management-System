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
import { showToast } from "../../../components/workflow/ToastNotification";
import { AnimatePresence, motion } from "motion/react";

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

const CATEGORIES: DocCategory[] = [
  {
    id: "identity",
    title: "Identity Documents",
    icon: User,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-[#00B87C]",
    items: [
      {
        name: "Aadhar Card",
        status: "uploaded",
        uploadedDate: "Apr 1, 2026",
        actions: ["view"],
      },
      {
        name: "PAN Card",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Passport",
        status: "expiring",
        expiryLabel: "Expires Jun 2026",
        actions: ["view", "update"],
      },
      { name: "Driving License", status: "not-uploaded", actions: ["upload"] },
    ],
  },
  {
    id: "employment",
    title: "Employment Documents",
    icon: Briefcase,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    items: [
      {
        name: "Offer Letter",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Appointment Letter",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "NDA",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Last Appraisal",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
    ],
  },
  {
    id: "education",
    title: "Educational Certificates",
    icon: GraduationCap,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    items: [
      {
        name: "10th Certificate",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "12th Certificate",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "B.Tech Degree",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      { name: "PG Diploma", status: "not-uploaded", actions: ["upload"] },
    ],
  },
  {
    id: "financial",
    title: "Financial Documents",
    icon: IndianRupee,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    items: [
      {
        name: "Bank Passbook",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Form 16 (2024-25)",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Investment Proofs",
        status: "not-uploaded",
        actions: ["upload"],
      },
    ],
  },
  {
    id: "health",
    title: "Health & Insurance",
    icon: Heart,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    items: [
      {
        name: "Medical Insurance Card",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Health Declaration",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
    ],
  },
  {
    id: "company",
    title: "Company-Issued Documents",
    icon: Building2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-[#00B87C]",
    items: [
      {
        name: "ID Card (digital)",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "Access Badge",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
      {
        name: "NDA",
        status: "uploaded",
        uploadedDate: "Uploaded",
        actions: ["view"],
      },
    ],
  },
];

const DOC_TYPES = [
  "Aadhar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Offer Letter",
  "Appointment Letter",
  "NDA",
  "10th Certificate",
  "12th Certificate",
  "B.Tech Degree",
  "PG Diploma",
  "Bank Passbook",
  "Form 16",
  "Investment Proofs",
  "Medical Insurance Card",
  "Health Declaration",
  "ID Card",
  "Access Badge",
  "Other",
];

function StatusChip({
  status,
  expiryLabel,
}: {
  status: DocStatus;
  expiryLabel?: string;
}) {
  if (status === "uploaded") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-[#00B87C]">
        <CheckCircle2 size={13} /> Uploaded
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
        <AlertTriangle size={13} /> Pending
      </span>
    );
  }
  if (status === "expiring") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold border border-amber-500/20 whitespace-nowrap">
        <AlertTriangle size={11} /> {expiryLabel || "Expiring Soon"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[11px] font-bold border border-rose-500/20 whitespace-nowrap">
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
    (i) => i.status === "uploaded" || i.status === "expiring",
  ).length;
  const hasIssues =
    cat.items.some((i) => i.status === "expiring") ||
    cat.items.some((i) => i.status === "not-uploaded");

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.iconBg}`}
        >
          <cat.icon size={20} className={cat.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-foreground leading-tight truncate">
            {cat.title}
          </h3>
          <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
            {cat.items.length} total items
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#00B87C] text-[11px] font-bold border border-emerald-500/20">
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
            className="px-5 py-3.5 flex items-center gap-4 group hover:bg-[#00B87C]/[0.08] transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate leading-tight">
                {doc.name}
              </p>
              {doc.status === "uploaded" && (
                <span className="text-[11px] font-bold text-muted-foreground">
                  {doc.uploadedDate}
                </span>
              )}
            </div>

            <div className="flex-shrink-0">
              <StatusChip status={doc.status} expiryLabel={doc.expiryLabel} />
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              {doc.actions.includes("view") && (
                <button
                  onClick={() => onViewClick(doc.name)}
                  className="text-[12px] font-bold text-[#00B87C] hover:underline"
                >
                  View
                </button>
              )}
              {doc.actions.includes("upload") && (
                <button
                  onClick={() => onUploadClick(doc.name)}
                  className="text-[12px] font-bold text-[#00B87C] hover:underline"
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
/* Document Preview Graphic Content Components                    */
/* ─────────────────────────────────────────────────────────────── */
function DocumentPreviewContent({ docName }: { docName: string }) {
  const nameLower = docName.toLowerCase();

  if (nameLower.includes("aadhar")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-white to-slate-50 text-slate-800 rounded-2xl border-2 border-emerald-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-emerald-500/30 pb-2">
          <div>
            <p className="text-[10px] font-extrabold text-emerald-800 tracking-wide leading-none">
              Government of India
            </p>
            <p className="text-[8px] text-slate-500 font-bold mt-0.5 leading-none">
              Unique Identification Authority of India
            </p>
          </div>
          <div className="text-right">
            <span className="bg-emerald-600 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Aadhaar
            </span>
          </div>
        </div>

        {/* Middle Body */}
        <div className="flex gap-4 my-2.5 items-center flex-1">
          {/* Mock photo */}
          <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-slate-400 font-black text-xl">SI</div>
          </div>
          <div className="space-y-1 text-[9.5px] font-bold text-slate-700">
            <p className="text-[11px] font-black text-slate-900 leading-tight">
              Suresh Iyer
            </p>
            <p>
              <span className="text-slate-400">DOB:</span> 22/07/1985
            </p>
            <p>
              <span className="text-slate-400">Gender:</span> Male
            </p>
            <p className="text-[8px] leading-tight text-slate-500 font-normal">
              <span className="font-bold text-slate-600">Address:</span> 42,
              Nungambakkam High Road, Chennai 600034
            </p>
          </div>
        </div>

        {/* Bottom Number */}
        <div className="border-t border-emerald-500/30 pt-2 flex flex-col items-center justify-center">
          <p className="text-[14px] font-black text-slate-900 tracking-widest leading-none">
            9824 1042 5632
          </p>
          <p className="text-[7px] text-emerald-700 font-black tracking-widest mt-1 uppercase">
            Mera Aadhaar, Meri Pehchan
          </p>
        </div>

        {/* Subtle Watermark logo */}
        <div className="absolute right-2 bottom-6 opacity-5 pointer-events-none">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-orange-500"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>
    );
  }

  if (nameLower.includes("pan card")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-2xl border border-teal-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/20 pb-2">
          <div>
            <p className="text-[9px] font-black tracking-wider uppercase text-emerald-400">
              Income Tax Department
            </p>
            <p className="text-[7px] text-slate-300 tracking-widest uppercase">
              Govt. Of India
            </p>
          </div>
          <span className="text-[7px] font-black uppercase text-emerald-400 border border-emerald-400/40 px-1 py-0.5 rounded">
            Permanent Account Number
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-4 my-2 items-center flex-1">
          <div className="w-16 h-20 bg-white/10 border border-white/20 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-emerald-400 font-black text-xl">SI</div>
          </div>
          <div className="space-y-1 text-[9px] font-bold text-slate-200">
            <p className="text-[11px] font-black text-white leading-tight">
              SURESH IYER
            </p>
            <p>
              <span className="text-slate-400 uppercase text-[8px]">
                Father's Name:
              </span>{" "}
              M. IYER
            </p>
            <p>
              <span className="text-slate-400 uppercase text-[8px]">
                Date of Birth:
              </span>{" "}
              22/07/1985
            </p>
            <p className="text-[12px] font-black text-emerald-400 tracking-wider mt-1.5">
              ABCPG4321I
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[7px] text-slate-400 font-bold">
          <span>Holder's Signature</span>
          <span className="font-mono text-[9px] text-emerald-400">
            ✔ VERIFIED
          </span>
        </div>
      </div>
    );
  }

  if (nameLower.includes("passport")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl border border-indigo-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/20 pb-2">
          <div>
            <p className="text-[9px] font-black tracking-wider uppercase text-amber-400">
              Republic of India
            </p>
            <p className="text-[7px] text-slate-300 tracking-widest uppercase">
              Passport / पारपत्र
            </p>
          </div>
          <span className="text-[10px] font-black tracking-wider text-amber-400">
            IND
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-4 my-2 items-center flex-1">
          <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-amber-400 font-black text-xl">SI</div>
          </div>
          <div className="space-y-1 text-[8.5px] font-bold text-slate-300">
            <p className="text-[10px] font-black text-white leading-tight">
              IYER SURESH
            </p>
            <p>
              <span className="text-slate-400">Nationality:</span> INDIAN
            </p>
            <p>
              <span className="text-slate-400">Sex:</span> M
            </p>
            <p>
              <span className="text-slate-400">DOB:</span> 22 JUL 1985
            </p>
            <p>
              <span className="text-slate-400">Passport No:</span> Z1024563
            </p>
            <p className="text-[7.5px] text-amber-400/80">
              Expiry Date: 12 JAN 2029
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-2 text-center text-[7px] text-slate-400 tracking-widest font-mono">
          P&lt;INDIYER&lt;&lt;SURESH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>
      </div>
    );
  }

  // Letters (Offer Letter, Appointment Letter, NDA, appraisal, etc.)
  if (
    nameLower.includes("letter") ||
    nameLower.includes("nda") ||
    nameLower.includes("appraisal")
  ) {
    return (
      <div className="w-full aspect-[3/4] bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col justify-between text-left font-serif select-none relative">
        <div className="absolute inset-0 bg-[#00B87C]/[0.01] pointer-events-none" />

        {/* Header */}
        <div className="border-b-2 border-[#00B87C] pb-3 text-center font-sans">
          <h4 className="text-[14px] font-black text-[#00B87C] uppercase tracking-widest">
            NexusHR Technologies
          </h4>
          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Innovating Human Resources
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 my-4 space-y-3">
          <div className="flex justify-between items-center text-[8px] font-sans font-bold text-slate-500 uppercase">
            <span>Ref: NHR/2019/EMP-0042</span>
            <span>Date: 15th January 2019</span>
          </div>

          <h5 className="text-[10px] font-extrabold text-slate-900 uppercase text-center tracking-wide font-sans">
            {docName}
          </h5>

          <p className="text-[9px] leading-relaxed">
            Dear <strong>Suresh Iyer</strong>,
          </p>

          <p className="text-[8px] leading-relaxed text-slate-600">
            {nameLower.includes("offer") &&
              "We are pleased to offer you the position of Engineering Manager at NexusHR Technologies. Your leadership experience and architecture expertise will drive our technical excellence."}
            {nameLower.includes("appointment") &&
              "This letter serves to confirm your formal appointment as Engineering Manager. You report to Sarah Mitchell, VP HR, and will oversee our engineering organization based in Chennai."}
            {nameLower.includes("nda") &&
              "This Non-Disclosure Agreement governs the confidentiality of proprietary engineering designs, codebase resources, client datasets, and internal corporate information."}
            {nameLower.includes("appraisal") &&
              "Based on your exceptional performance rating of 4.6/5 and high completion rate of 1048 tasks, your appraisal cycle review confirms an increment in tenure benefits."}
          </p>

          <p className="text-[8px] leading-relaxed text-slate-600">
            Please review the details regarding work parameters and department
            standards. We look forward to your continued contribution.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end border-t border-slate-100 pt-3 font-sans">
          <div>
            <p className="text-[7px] font-black text-slate-800">
              Sarah Mitchell
            </p>
            <p className="text-[6px] text-slate-500 font-bold uppercase">
              VP, Human Resources
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-emerald-500/20 bg-emerald-50 text-[6px] text-[#00B87C] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              Officially Signed
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Educational Certificate
  if (nameLower.includes("certificate") || nameLower.includes("degree")) {
    return (
      <div className="w-full aspect-[4/3] bg-[#FCFBF7] text-slate-800 rounded-2xl border-4 border-double border-amber-800/20 shadow-md p-6 flex flex-col justify-between text-center font-serif select-none relative">
        <div className="absolute inset-2 border border-amber-800/10 pointer-events-none" />

        <h4 className="text-[13px] font-extrabold tracking-widest text-amber-900 uppercase">
          Board of Technical Education
        </h4>
        <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider -mt-1 font-sans">
          Tamil Nadu, India
        </p>

        <div className="my-2 space-y-1.5">
          <p className="text-[8px] italic text-slate-600 font-sans">
            This is to certify that
          </p>
          <p className="text-[13px] font-extrabold text-slate-900 tracking-wide font-serif">
            Suresh Iyer
          </p>
          <p className="text-[8px] leading-relaxed text-slate-600">
            has successfully completed the program of study and passed the
            examinations prescribed for the degree of
          </p>
          <p className="text-[11px] font-extrabold text-amber-900 tracking-wide font-serif">
            Bachelor of Engineering
          </p>
          <p className="text-[8px] font-bold text-slate-500 font-sans">
            in Information Technology
          </p>
        </div>

        <div className="flex justify-between items-end border-t border-slate-200/50 pt-2 font-sans text-[7px] font-bold text-slate-600">
          <div>
            <p className="italic text-slate-400">
              Class: First Class with Distinction
            </p>
            <p className="text-left mt-0.5">Year: 2007</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-amber-800/20 flex items-center justify-center bg-amber-800/5 text-amber-800 text-[6px] font-black uppercase shrink-0 shadow-inner">
            SEAL
          </div>
          <div className="text-right">
            <p>Registrar Signature</p>
            <p className="text-slate-400">Verified</p>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback card
  return (
    <div className="w-full aspect-[3/4] bg-secondary rounded-2xl border border-border p-6 flex flex-col justify-between text-left font-sans select-none relative">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileText size={22} />
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-primary text-[10px] font-bold border border-primary/20">
          ✔ VERIFIED
        </span>
      </div>

      <div className="flex-1 my-6 flex flex-col justify-center gap-1.5">
        <h4 className="text-[15px] font-black text-foreground">{docName}</h4>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          EMPLOYEE RECORD
        </p>
        <div className="h-px bg-border/50 my-2" />
        <div className="space-y-1 text-[11px] text-muted-foreground font-semibold">
          <p>
            <span className="text-slate-400">Owner:</span> Suresh Iyer
          </p>
          <p>
            <span className="text-slate-400">Uploaded:</span> Yes
          </p>
          <p>
            <span className="text-slate-400">Verification Date:</span> Jan 12,
            2026
          </p>
          <p>
            <span className="text-slate-400">File Type:</span> Secured Document
          </p>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-bold border-t border-border/50 pt-3 text-center tracking-widest font-mono">
        NHR-SECURE-DOC-ID-4567
      </div>
    </div>
  );
}

export function ManagerPersonalDocuments() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [newDoc, setNewDoc] = useState({
    type: "",
    name: "",
    expiryDate: "",
    notes: "",
  });

  const openUploadModal = (docName?: string) => {
    const type = typeof docName === "string" ? docName : "";
    setNewDoc({
      type: type,
      name: "",
      expiryDate: "",
      notes: "",
    });
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      "Uploaded",
      "success",
      `${newDoc.name || "Document"} has been uploaded.`,
    );
    setShowUploadModal(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <Folder size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
              My Documents
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Securely store and manage your personal documents
            </p>
          </div>
        </div>
        <button
          onClick={() => openUploadModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#00B87C] text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <UploadCloud size={18} />
          Upload Document
        </button>
      </div>

      {/* ─── Status Banner ───────────────────────────────────────── */}
      <div className="w-full bg-emerald-500/10 rounded-2xl border border-primary/20 px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3 dark:bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00B87C] animate-pulse" />
          <span className="text-[14px] font-bold text-[#00B87C]">
            2 documents pending upload
          </span>
        </div>
        <div className="w-px h-5 bg-[#00B87C]/20 hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[14px] font-bold text-amber-600 dark:text-amber-500">
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
            onUploadClick={openUploadModal}
            onViewClick={(name) => setViewingDoc(name)}
          />
        ))}
      </div>

      {/* ─── Upload Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/20">
                    <UploadCloud size={22} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-foreground">
                      Upload Document
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Submit files for verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      DOCUMENT TYPE
                    </label>
                    <select
                      required
                      value={newDoc.type}
                      onChange={(e) =>
                        setNewDoc({ ...newDoc, type: e.target.value })
                      }
                      className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Select Category</option>
                      {DOC_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      DOCUMENT NAME
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Passport Copy, Degree Certificate"
                      value={newDoc.name}
                      onChange={(e) =>
                        setNewDoc({ ...newDoc, name: e.target.value })
                      }
                      className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      FILE UPLOAD
                    </label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-8 bg-secondary/50 flex flex-col items-center justify-center gap-2 hover:border-[#00B87C] transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#00B87C] group-hover:scale-110 transition-transform">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-[13px] font-bold text-foreground">
                        Browse Files
                      </p>
                      <p className="text-[11px] font-bold text-muted-foreground">
                        PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        EXPIRY DATE (OPTIONAL)
                      </label>
                      <input
                        type="date"
                        value={newDoc.expiryDate}
                        onChange={(e) =>
                          setNewDoc({ ...newDoc, expiryDate: e.target.value })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        NOTES (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="Additional info..."
                        value={newDoc.notes}
                        onChange={(e) =>
                          setNewDoc({ ...newDoc, notes: e.target.value })
                        }
                        className="w-full px-4 h-[44px] bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3.5 border border-border rounded-xl text-[13px] font-bold text-muted-foreground hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 bg-[#00B87C] text-white rounded-xl font-bold text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {viewingDoc && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-background/40"
            onClick={() => setViewingDoc(null)}
          />
          <div className="relative bg-card w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
                  <FileText size={20} className="text-[#00B87C]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    {viewingDoc}
                  </h3>
                  <p className="text-[11px] font-bold text-[#00B87C]">
                    Preview
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="w-full flex items-center justify-center p-2">
                <DocumentPreviewContent docName={viewingDoc} />
              </div>
              <button
                onClick={() => {
                  showToast("Downloading", "info", "File download started.");
                  setViewingDoc(null);
                }}
                className="w-full py-4 bg-[#00B87C] text-white text-[14px] font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all"
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
