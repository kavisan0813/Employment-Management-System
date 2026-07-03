import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";
import {
  Download,
  Clock,
  Calendar,
  FileText,
  Receipt,
  Target,
  Folder,
  Star,
  Info,
} from "lucide-react";

export function DataDownloadsSection({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  const cards = [
    {
      icon: FileText,
      bg: "var(--secondary)",
      color: "var(--primary)",
      title: "My Payslips",
      desc: "All salary slips — FY 2022 to 2026",
      last: "Never",
      btn: "Download ZIP",
      primary: true,
    },
    {
      icon: Calendar,
      bg: "#E0F2FE",
      color: "#0EA5E9",
      title: "My Attendance Records",
      desc: "Check-in/out history — Current FY",
      last: "Mar 1, 2026",
      btn: "Download CSV",
      primary: false,
    },
    {
      icon: Clock,
      bg: "#FEF3C7",
      color: "#F59E0B",
      title: "My Leave History",
      desc: "All leave requests and approvals",
      last: "Never",
      btn: "Download CSV",
      primary: false,
    },
    {
      icon: Receipt,
      bg: "#FEF3C7",
      color: "#F59E0B",
      title: "My Expense Claims",
      desc: "All expense submissions — All time",
      last: "Never",
      btn: "Download CSV",
      primary: false,
    },
    {
      icon: Target,
      bg: "var(--secondary)",
      color: "var(--primary)",
      title: "My Goals & Performance",
      desc: "Performance reviews, ratings and goals",
      last: "Never",
      btn: "Download PDF",
      primary: false,
    },
    {
      icon: Folder,
      bg: "#E0F2FE",
      color: "#0EA5E9",
      title: "My Documents",
      desc: "All uploaded personal documents",
      last: "Never",
      btn: "Download ZIP",
      primary: false,
    },
    {
      icon: Star,
      bg: "#FEF3C7",
      color: "#F59E0B",
      title: "My Training Records",
      desc: "Course completions and certifications",
      last: "Never",
      btn: "Download PDF",
      primary: false,
    },
  ];

  return (
    <div>
      <Breadcrumb active="My Data & Downloads" />
      <h2 className="text-[22px] font-black text-foreground mb-5">
        My Data & Downloads
      </h2>

      <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Info size={20} className="text-blue-500" />
        </div>
        <p className="text-[14px] font-bold text-muted-foreground leading-relaxed">
          Your data is securely stored by NexusHR. You can download or request
          deletion of your personal data at any time.
        </p>
      </div>

      <Label>DOWNLOAD MY DATA</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-black text-foreground">
                    {card.title}
                  </p>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    {card.desc}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground/60 mt-1">
                    Last: {card.last}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  showToast(
                    "Download Started",
                    "success",
                    `Downloading ${card.title}...`,
                  )
                }
                className={`w-full py-2.5 rounded-xl text-[12px] font-black transition-all active:scale-95 ${card.primary ? "bg-primary text-white shadow-lg shadow-[#00B87C]/20 hover:opacity-90" : "border border-primary text-primary hover:bg-primary/10"}`}
              >
                ⬇ Download {card.btn}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-[16px] font-black text-foreground">
              Download All My Data
            </p>
            <p className="text-[13px] font-bold text-muted-foreground">
              Complete export of all your NexusHR data in one ZIP file
            </p>
          </div>
        </div>
        <button
          className="w-full py-3 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={() => onModal("export")}
        >
          Request Full Export
        </button>
      </div>

      <Label>ACCOUNT MANAGEMENT</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
          <p className="text-[15px] font-black text-rose-500 mb-1">
            Deactivate Account
          </p>
          <p className="text-[12px] font-bold text-muted-foreground">
            Temporarily disable your account. HR will be notified.
          </p>
          <p className="text-[11px] font-bold text-muted-foreground/60 mt-1">
            Contact HR to reactivate when ready
          </p>
          <button
            className="mt-4 px-5 py-2.5 rounded-xl border border-rose-500 text-rose-500 text-[12px] font-black hover:bg-rose-500/10 transition-all"
            onClick={() => onModal("deactivate")}
          >
            Request Deactivation
          </button>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
          <p className="text-[15px] font-black text-rose-500 mb-1">
            Delete Personal Data
          </p>
          <p className="text-[12px] font-bold text-muted-foreground">
            Request permanent deletion of non-essential personal data.
          </p>
          <p className="text-[11px] font-bold text-muted-foreground/60 mt-1">
            Subject to legal and HR policy requirements
          </p>
          <button
            className="mt-4 px-5 py-2.5 rounded-xl border border-rose-500 text-rose-500 text-[12px] font-black hover:bg-rose-500/10 transition-all"
            onClick={() => onModal("delete")}
          >
            Request Data Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: HELP & FAQ
   ═══════════════════════════════════════════ */
