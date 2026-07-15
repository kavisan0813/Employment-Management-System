import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { Laptop, AlertTriangle, Smartphone } from "lucide-react";

export function ConnectedDevicesSection({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  return (
    <div>
      <Breadcrumb active="Connected Devices" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-black text-foreground">
          Connected Devices & Sessions
        </h2>
        <button
          className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[12px] font-black hover:bg-rose-600 transition-all active:scale-95"
          onClick={() => onModal("signout-all")}
        >
          Sign Out All
        </button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-primary/10">
              <Laptop size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-[16px] font-black text-foreground">
                MacBook Pro 14
              </p>
              <p className="text-[13px] font-bold text-muted-foreground">
                Chrome 124 · macOS 14
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20">
            Current Device
          </span>
        </div>
        <p className="text-[13px] font-bold text-muted-foreground">
          Chennai, India · Apr 6, 2026, 9:02 AM
        </p>
        <p className="text-[13px] font-black text-primary mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />{" "}
          Your current active session
        </p>
      </div>

      <Label>OTHER ACTIVE SESSIONS</Label>
      {[
        {
          icon: Smartphone,
          bg: "#E0F2FE",
          color: "#0EA5E9",
          name: "iPhone 14 Pro",
          meta: "viyanHR App · iOS 17",
          location: "Chennai, India · Apr 5, 2026, 8:45 PM",
        },
        {
          icon: Laptop,
          bg: "#EDE9FE",
          color: "#8B5CF6",
          name: "Windows 11 PC",
          meta: "Chrome 123 · Windows 11",
          location: "Mumbai, India · Mar 28, 2026, 2:30 PM",
        },
      ].map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-4 flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.bg }}
              >
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[15px] font-black text-foreground">
                  {s.name}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground">
                  {s.meta}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground/60">
                  {s.location}
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-xl border border-rose-500 text-rose-500 text-[11px] font-black hover:bg-rose-500/10 transition-all shrink-0"
              onClick={() => onModal("revoke")}
            >
              Revoke Access
            </button>
          </div>
        );
      })}

      <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-amber-500" />
          <p className="text-[14px] font-black text-amber-500">
            Unusual activity detected
          </p>
        </div>
        <p className="text-[13px] font-bold text-muted-foreground mb-4">
          Login from new location: Mumbai on Mar 28. Was this you?
        </p>
        <div className="flex gap-3">
          <button
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all"
            onClick={() =>
              showToast(
                "Alert Dismissed",
                "info",
                "Unusual activity alert dismissed.",
              )
            }
          >
            Yes, that was me
          </button>
          <button
            className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[12px] font-black hover:bg-rose-600 transition-all"
            onClick={() =>
              showToast(
                "Account Secured",
                "success",
                "All sessions revoked. Password has been reset.",
              )
            }
          >
            No, secure my account
          </button>
        </div>
      </div>

      <Label>MOBILE APP</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Smartphone size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-[15px] font-black text-foreground">
              viyanHR Mobile App
            </p>
            <p className="text-[13px] font-black text-primary">
              Connected — Last sync: Today 9:05 AM
            </p>
          </div>
        </div>
        <button
          className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-[12px] font-black hover:bg-secondary transition-all"
          onClick={() => onModal("disconnect")}
        >
          Disconnect App
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: MY DATA & DOWNLOADS
   ═══════════════════════════════════════════ */
