import { useState } from "react";
import {
  Package,
  Laptop,
  Smartphone,
  Monitor,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  Wrench,
  FileText,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Send,
  Clock,
  Flag,
  AlertCircle,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { AnimatePresence, motion } from "motion/react";

/* ─── Types ─────────────────────────────────────────────── */

interface MyAsset {
  id: string;
  name: string;
  category: "Laptop" | "Smartphone" | "Monitor" | "Other";
  serialNo: string;
  value: number;
  assignedDate: string;
  condition: string;
  warrantyExpiry: string;
  warrantyLabel: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
}

/* ─── Mock Data ─────────────────────────────────────────── */

const MY_ASSETS: MyAsset[] = [
  {
    id: "1",
    name: "Dell XPS 15 (2024)",
    category: "Laptop",
    serialNo: "SN-DL2024-421",
    value: 120000,
    assignedDate: "Mar 15, 2021",
    condition: "Good",
    warrantyExpiry: "Mar 15, 2024",
    warrantyLabel: "Expired",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    icon: Laptop,
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    category: "Smartphone",
    serialNo: "SN-IP14-288",
    value: 80000,
    assignedDate: "Jun 10, 2023",
    condition: "Excellent",
    warrantyExpiry: "Jun 10, 2025",
    warrantyLabel: "Jun 2025",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    icon: Smartphone,
  },
  {
    id: "3",
    name: "LG 4K 27inch",
    category: "Monitor",
    serialNo: "SN-LG-101",
    value: 35000,
    assignedDate: "Jan 5, 2022",
    condition: "Good",
    warrantyExpiry: "Jan 5, 2025",
    warrantyLabel: "Expired",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    icon: Monitor,
  },
];

/* ─── Asset Detail Modal ─────────────────────────────────── */

function AssetDetailModal({
  asset,
  onClose,
  onReportIssue,
}: {
  asset: MyAsset;
  onClose: () => void;
  onReportIssue: () => void;
}) {
  const Icon = asset.icon;
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl ${asset.iconBg} flex items-center justify-center ${asset.iconColor} border border-border`}
            >
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground">
                {asset.name}
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                {asset.serialNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-2xl p-4 text-center border border-border">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Assigned Date
              </p>
              <p className="text-[14px] font-extrabold text-foreground">
                {asset.assignedDate}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-2xl p-4 text-center border border-border">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Value
              </p>
              <p className="text-[14px] font-extrabold text-foreground">
                ₹{asset.value.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {[
              { label: "Category", value: asset.category },
              { label: "Serial Number", value: asset.serialNo, mono: true },
              { label: "Condition", value: asset.condition },
              {
                label: "Warranty",
                value: asset.warrantyLabel,
                extra:
                  asset.warrantyLabel === "Expired" ? (
                    <span className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full ml-2">
                      Expired
                    </span>
                  ) : null,
              },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </span>
                <span
                  className={`text-[13px] font-bold text-foreground flex items-center ${
                    row.mono ? "font-mono" : ""
                  }`}
                >
                  {row.value}
                  {row.extra}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] font-bold text-amber-600 dark:text-amber-400">
              Report any damage or issues with this asset immediately.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-[13px] font-black text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              setTimeout(() => onReportIssue(), 300);
            }}
            className="flex-1 py-3 rounded-2xl text-[13px] font-black text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Wrench size={16} />
            Report Issue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Report Issue Modal ─────────────────────────────────── */

function ReportIssueModal({
  asset,
  onClose,
}: {
  asset: MyAsset;
  onClose: () => void;
}) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"Normal" | "Urgent">("Normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !description.trim()) {
      showToast("Error", "error", "Please fill in all required fields.");
      return;
    }
    showToast(
      "Issue Reported",
      "success",
      `Issue reported for ${asset.name}. Support team will follow up.`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-border">
              <Wrench size={22} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground">
                Report Issue
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                {asset.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              ISSUE TYPE <span className="text-rose-500">*</span>
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl text-[13px] font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
              required
            >
              <option value="">Select issue type</option>
              <option value="Hardware Malfunction">Hardware Malfunction</option>
              <option value="Software Issue">Software Issue</option>
              <option value="Physical Damage">Physical Damage</option>
              <option value="Accessory Missing">Accessory Missing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              DESCRIPTION <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl text-[13px] font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              URGENCY
            </label>
            <div className="flex bg-muted p-1 rounded-2xl">
              {(["Normal", "Urgent"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-2.5 text-[12px] font-black rounded-xl transition-all ${
                    urgency === u
                      ? u === "Urgent"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {u === "Urgent" ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <AlertCircle size={14} />
                      Urgent
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock size={14} />
                      Normal
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-secondary/50 border border-border rounded-2xl p-4 flex items-start gap-3">
            <Flag size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[12px] font-bold text-muted-foreground">
              Urgent issues will be escalated to the IT support team immediately.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-[13px] font-black text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl text-[13px] font-black text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit Report
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Asset Request Modal ────────────────────────────────── */

function AssetRequestModal({ onClose }: { onClose: () => void }) {
  const [assetType, setAssetType] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState<"Normal" | "Urgent">("Normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetType || !reason.trim()) {
      showToast("Error", "error", "Please fill in all required fields.");
      return;
    }
    showToast(
      "Request Submitted",
      "success",
      `Your request for ${assetType} has been sent to Suresh Iyer for approval.`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[460px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary border border-border">
              <Package size={22} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground">
                Request Asset
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                Submit a new asset request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              ASSET TYPE NEEDED <span className="text-rose-500">*</span>
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl text-[13px] font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
              required
            >
              <option value="">Select asset type</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Phone">Phone</option>
              <option value="Keyboard">Keyboard</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              REASON FOR REQUEST <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Explain why you need this asset..."
              className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl text-[13px] font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-muted-foreground tracking-wider mb-2">
              URGENCY
            </label>
            <div className="flex bg-muted p-1 rounded-2xl">
              {(["Normal", "Urgent"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-2.5 text-[12px] font-black rounded-xl transition-all ${
                    urgency === u
                      ? u === "Urgent"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {u === "Urgent" ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <AlertCircle size={14} />
                      Urgent
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock size={14} />
                      Normal
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-foreground">
                Manager Approval Required
              </p>
              <p className="text-[12px] font-bold text-muted-foreground mt-1">
                Your request will go to{" "}
                <span className="text-primary">Suresh Iyer</span> for approval.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-[13px] font-black text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl text-[13px] font-black text-white bg-[#00B87C] hover:bg-[#00B87C]/90 shadow-lg shadow-[#00B87C]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Main Page Component ────────────────────────────────── */

export function MyAssets() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [detailAsset, setDetailAsset] = useState<MyAsset | null>(null);
  const [reportAsset, setReportAsset] = useState<MyAsset | null>(null);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20">
      {/* ─── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-sky-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Package size={22} className="text-sky-500" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            My Assets
          </h1>
          <p className="text-[13px] font-bold text-muted-foreground hidden sm:block">
            Company assets assigned to you
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-transparent text-[#00B87C] border-2 border-[#00B87C] rounded-2xl font-black hover:bg-[#00B87C]/5 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus size={18} />
          Request Asset
        </button>
      </div>

      {/* ─── Summary KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-[11px] font-black text-muted-foreground tracking-wider uppercase">
              Assigned to Me
            </p>
          </div>
          <p className="text-2xl font-black text-foreground">3</p>
          <p className="text-[11px] font-bold text-muted-foreground mt-1">
            Active assets
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <IndianRupee size={18} />
            </div>
            <p className="text-[11px] font-black text-muted-foreground tracking-wider uppercase">
              Total Value
            </p>
          </div>
          <p className="text-2xl font-black text-foreground">₹2.5L</p>
          <p className="text-[11px] font-bold text-muted-foreground mt-1">
            Combined asset value
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
              <Calendar size={18} />
            </div>
            <p className="text-[11px] font-black text-muted-foreground tracking-wider uppercase">
              Next Return
            </p>
          </div>
          <p className="text-2xl font-black text-muted-foreground">None</p>
          <p className="text-[11px] font-bold text-muted-foreground mt-1">
            No upcoming returns
          </p>
        </div>
      </div>

      {/* ─── My Assigned Assets Section ─────────────────────── */}
      <div>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h3 className="text-[11px] font-black text-muted-foreground tracking-wider uppercase">
              My Assigned Assets
            </h3>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {MY_ASSETS.map((asset) => {
              const Icon = asset.icon;
              return (
                <div
                  key={asset.id}
                  className="bg-card border border-[#E5E7EB] dark:border-border rounded-xl p-4 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side: icon + info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl ${asset.iconBg} flex items-center justify-center ${asset.iconColor} shrink-0 border border-border`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-extrabold text-foreground truncate">
                          {asset.name}
                        </p>
                        <p className="text-[11px] font-bold font-mono text-muted-foreground mt-0.5">
                          {asset.serialNo}
                        </p>
                      </div>
                    </div>

                    {/* Right side: status chip + value */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          Assigned
                        </span>
                      </div>
                      <span className="text-[13px] font-extrabold text-muted-foreground">
                        ₹{asset.value.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Detail row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-4 pt-3 border-t border-border text-[11px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-muted-foreground/60" />
                      Assigned: {asset.assignedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={13}
                        className={
                          asset.condition === "Excellent"
                            ? "text-emerald-500"
                            : "text-muted-foreground/60"
                        }
                      />
                      Condition: {asset.condition}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText size={13} className="text-muted-foreground/60" />
                      Warranty: {asset.warrantyLabel}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <button
                      onClick={() => setDetailAsset(asset)}
                      className="flex items-center gap-1 text-[12px] font-black text-[#00B87C] hover:text-[#00B87C]/80 transition-colors"
                    >
                      View Details
                      <ChevronRight size={14} strokeWidth={3} />
                    </button>
                    <div className="w-px h-4 bg-border" />
                    <button
                      onClick={() => setReportAsset(asset)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-muted-foreground border border-border rounded-lg hover:bg-secondary hover:text-foreground transition-all"
                    >
                      Report Issue
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Modals ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showRequestModal && (
          <AssetRequestModal onClose={() => setShowRequestModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailAsset && (
          <AssetDetailModal
            asset={detailAsset}
            onClose={() => setDetailAsset(null)}
            onReportIssue={() => {
              setDetailAsset(null);
              setTimeout(() => setReportAsset(detailAsset!), 300);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reportAsset && (
          <ReportIssueModal
            asset={reportAsset}
            onClose={() => setReportAsset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
