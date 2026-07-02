import React, { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../context/AuthContext";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { ToggleRow } from "../components/ToggleRow";
import {
  Moon,
  AlertTriangle,
  Sun,
  Monitor,
} from "lucide-react";

export function EmployeeAppearanceSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [sidebarStyle, setSidebarStyle] = useState<"expanded" | "compact">(
    "expanded",
  );
  const [density, setDensity] = useState<"comfortable" | "compact" | "dense">(
    "comfortable",
  );
  const [fontSize, setFontSize] = useState(14);

  const applyTheme = (t: "light" | "dark" | "system") => {
    setTheme(t);
    if (t === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    showToast("Theme Updated", "success", `Theme changed to ${t}`);
  };

  return (
    <div>
      <Breadcrumb active="Appearance" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Appearance
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>THEME</Label>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              key: "light" as const,
              icon: Sun,
              label: "Light",
              desc: "Default — clean and bright",
              preview: "white",
            },
            {
              key: "dark" as const,
              icon: Moon,
              label: "Dark",
              desc: "Easy on the eyes at night",
              preview: "#0F172A",
            },
            {
              key: "system" as const,
              icon: Monitor,
              label: "System",
              desc: "Follows your device setting",
              preview: "linear-gradient(90deg, white 50%, #0F172A 50%)",
            },
          ].map((t) => {
            const active = theme === t.key;
            const Icon = t.icon;
            return (
              <div
                key={t.key}
                onClick={() => applyTheme(t.key)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] ${active ? "border-primary" : "border-border"}`}
                style={{ backgroundColor: "var(--card)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="h-14 rounded-xl w-full overflow-hidden border"
                    style={{
                      borderColor: "var(--border)",
                      background: t.preview,
                    }}
                  >
                    <div
                      className="h-3 w-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  </div>
                  {active && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-semibold uppercase tracking-wider ml-2 shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-[14px] font-black text-foreground">
                      {t.label}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>SIDEBAR</Label>
        <div className="flex gap-3">
          {[
            { key: "expanded" as const, label: "Expanded (with labels)" },
            { key: "compact" as const, label: "Compact (icons only)" },
          ].map((s) => {
            const active = sidebarStyle === s.key;
            return (
              <button
                key={s.key}
                onClick={() => {
                  setSidebarStyle(s.key);
                  showToast(
                    "Sidebar Updated",
                    "success",
                    `Sidebar: ${s.label}`,
                  );
                }}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all ${active ? "bg-primary text-white shadow-lg shadow-[#00B87C]/20" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>DENSITY</Label>
        <div className="flex gap-3">
          {[
            { key: "comfortable" as const, label: "Comfortable" },
            { key: "compact" as const, label: "Compact" },
            { key: "dense" as const, label: "Dense" },
          ].map((d) => {
            const active = density === d.key;
            return (
              <button
                key={d.key}
                onClick={() => {
                  setDensity(d.key);
                  showToast(
                    "Density Updated",
                    "success",
                    `Density: ${d.label}`,
                  );
                }}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all ${active ? "bg-primary text-white shadow-lg shadow-[#00B87C]/20" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>FONT SIZE</Label>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-black text-foreground">
            Font Size
          </span>
          <span className="text-[13px] font-black text-primary">
            Medium ({fontSize}px)
          </span>
        </div>
        <input
          type="range"
          min="12"
          max="18"
          step="2"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div className="flex justify-between text-[11px] font-bold text-muted-foreground mt-1.5">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <Label>COLOR ACCENT</Label>
        <p className="text-[13px] font-bold text-muted-foreground mb-4">
          The green accent color matches your company branding.
        </p>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary shadow-lg" />
          <div>
            <p className="text-[15px] font-black text-foreground">
              NexusHR Green
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-black mt-1 border border-amber-500/20">
              <AlertTriangle size={12} /> Accent color is set by your
              organization
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: LANGUAGE & REGION
   ═══════════════════════════════════════════ */
