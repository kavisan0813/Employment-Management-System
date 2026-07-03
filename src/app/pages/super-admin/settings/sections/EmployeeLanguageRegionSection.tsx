import { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";

export function EmployeeLanguageRegionSection({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  const [lang, setLang] = useState("English");
  const [tz, setTz] = useState("IST (UTC+5:30)");
  const [dateFmt, setDateFmt] = useState("DD-MM-YYYY");
  const [timeFmt, setTimeFmt] = useState<"12h" | "24h">("12h");
  const [currency, setCurrency] = useState("₹ INR");
  const [firstDay, setFirstDay] = useState<"sunday" | "monday" | "saturday">(
    "monday",
  );

  return (
    <div>
      <Breadcrumb active="Language & Region" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Language & Region
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>DISPLAY LANGUAGE</Label>
        <div className="max-w-md relative">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
          >
            {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Other"].map(
              (o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ),
            )}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>REGION & FORMATS</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1 mb-2 block">
              Timezone
            </label>
            <div className="relative">
              <select
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {[
                  "IST (UTC+5:30)",
                  "UTC (UTC+0:00)",
                  "EST (UTC-5:00)",
                  "PST (UTC-8:00)",
                ].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1 mb-2 block">
              Date Format
            </label>
            <div className="relative">
              <select
                value={dateFmt}
                onChange={(e) => setDateFmt(e.target.value)}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["DD-MM-YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1 mb-2 block">
              Time Format
            </label>
            <div className="flex gap-3">
              {[
                { key: "12h" as const, label: "12-hour (1:30 PM)" },
                { key: "24h" as const, label: "24-hour (13:30)" },
              ].map((t) => {
                const active = timeFmt === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTimeFmt(t.key)}
                    className={`flex-1 h-12 rounded-xl text-[13px] font-black transition-all ${active ? "bg-primary text-white shadow-lg shadow-[#00B87C]/20" : "border border-border text-muted-foreground hover:bg-secondary"}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1 mb-2 block">
              Currency Display
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["₹ INR", "$ USD", "£ GBP", "€ EUR"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-background border border-border">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
            Preview with current settings:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px] font-black text-foreground">
            <span>
              Date:{" "}
              {dateFmt === "DD-MM-YYYY"
                ? "06-04-2026"
                : dateFmt === "MM/DD/YYYY"
                  ? "04/06/2026"
                  : "2026-04-06"}
            </span>
            <span>Time: {timeFmt === "12h" ? "9:30 AM" : "09:30"}</span>
            <span>Number: 1,28,400</span>
            <span>Currency: {currency}1,28,400</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>FIRST DAY OF WEEK</Label>
        <div className="flex gap-3">
          {(["sunday", "monday", "saturday"] as const).map((day) => {
            const active = firstDay === day;
            return (
              <button
                key={day}
                onClick={() => setFirstDay(day)}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-black capitalize transition-all ${active ? "bg-primary text-white shadow-lg shadow-[#00B87C]/20" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          className="text-[13px] font-semibold text-[#94A3B8] hover:text-foreground transition-all"
          onClick={() => onModal("reset")}
        >
          Reset to System Default
        </button>
        <button
          className="px-6 py-3 rounded-xl bg-primary text-white font-black text-[14px] shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={() =>
            showToast("Region Saved", "success", "Region settings saved.")
          }
        >
          Save Region Settings
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: CONNECTED DEVICES
   ═══════════════════════════════════════════ */
