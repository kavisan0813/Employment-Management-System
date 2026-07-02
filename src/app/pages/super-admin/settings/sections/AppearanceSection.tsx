import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
  CheckCircle,
  Check,
} from "lucide-react";

export function AppearanceSection() {
  const {
    extraConfig,
    setThemeMode,
    showToast,
    themeMode,
    updateExtraConfig,
  } = useSettingsContext();

  const accentColors = [
    { hex: "#00B87C", name: "Emerald Green" },
    { hex: "#6366F1", name: "Indigo" },
    { hex: "#8B5CF6", name: "Purple" },
    { hex: "#0EA5E9", name: "Sky Blue" },
    { hex: "#F59E0B", name: "Amber" },
    { hex: "#EF4444", name: "Red" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>System Preferences</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>Appearance</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Appearance
        </h2>
        <button
          onClick={() => showToast("Appearance preferences saved")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>

      {/* POLICY BLOCK 1: THEME */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{
          backgroundColor: "#F0FDF4",
          borderColor: "rgba(0,184,124,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[3px] h-4 bg-[#00B87C] rounded-full" />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9CA3AF",
              letterSpacing: "0.5px",
            }}
          >
            THEME
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              id: "light",
              label: "Light",
              bg: "#FFFFFF",
              sidebar: "#00B87C",
            },
            { id: "dark", label: "Dark", bg: "#1F2937", sidebar: "#1F2937" },
            {
              id: "system",
              label: "System Default",
              bg: "linear-gradient(135deg, #FFFFFF 50%, #1F2937 50%)",
              sidebar: "#00B87C",
            },
          ].map((t) => {
            const selected = themeMode === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setThemeMode(t.id)}
                className="rounded-xl border cursor-pointer relative transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: selected ? "#00B87C" : "#E5E7EB",
                  borderWidth: selected ? "2px" : "1px",
                  padding: "12px",
                }}
              >
                {selected && (
                  <CheckCircle
                    size={16}
                    className="text-[#00B87C] absolute top-2 right-2"
                  />
                )}
                <div
                  className="w-full h-[60px] rounded-lg mb-2 border flex overflow-hidden"
                  style={{ background: t.bg, borderColor: "#E5E7EB" }}
                >
                  <div
                    className="w-4 h-full"
                    style={{ backgroundColor: t.sidebar }}
                  />
                </div>
                <div
                  className="text-center font-bold text-[13px]"
                  style={{ color: selected ? "#111827" : "#374151" }}
                >
                  {t.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POLICY BLOCK 2: COLOR ACCENT */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          ACCENT COLOR
        </span>
        <div className="flex items-center gap-3 mb-3">
          {accentColors.map((c) => {
            const selected = extraConfig.accentColor === c.hex;
            return (
              <button
                key={c.hex}
                onClick={() => updateExtraConfig("accentColor", c.hex)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: selected
                    ? `0 0 0 2px white, 0 0 0 4px ${c.hex}`
                    : "none",
                }}
              >
                {selected && <Check size={14} className="text-white" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#00B87C] cursor-pointer font-medium">
            Custom Color
          </span>
          <input
            type="color"
            value={extraConfig.accentColor}
            onChange={(e) => updateExtraConfig("accentColor", e.target.value)}
            className="w-6 h-6 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      {/* POLICY BLOCK 3: TYPOGRAPHY & DENSITY */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="mb-4">
          <span className="block text-[11px] font-bold text-[#94A3B8] mb-2 uppercase">
            FONT SIZE
          </span>
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 w-fit">
            {["Small", "Medium", "Large"].map((size) => {
              const active = extraConfig.fontSize === size;
              return (
                <button
                  key={size}
                  onClick={() => updateExtraConfig("fontSize", size)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg border-none cursor-pointer transition-all"
                  style={{
                    backgroundColor: active ? "#00B87C" : "transparent",
                    color: active ? "white" : "var(--foreground)",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <span className="block text-[11px] font-bold text-[#94A3B8] mb-2 uppercase">
            SIDEBAR DENSITY
          </span>
          <div className="space-y-3">
            {[
              {
                key: "compactSidebar",
                label: "Compact Sidebar",
                desc: "Reduce sidebar item height to 32px",
              },
              {
                key: "showSidebarIconsOnly",
                label: "Show Sidebar Icons Only (Collapsed)",
                desc: "Display only icons when collapsed",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    {item.desc}
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateExtraConfig(
                      item.key,
                      !extraConfig[item.key as keyof typeof extraConfig],
                    )
                  }
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[
                      item.key as keyof typeof extraConfig
                    ]
                      ? "#00B87C"
                      : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: extraConfig[item.key as keyof typeof extraConfig]
                        ? "18px"
                        : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transition: "all 0.2s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-bold text-[#94A3B8] mb-2 uppercase">
            CONTENT DENSITY
          </span>
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 w-fit">
            {["Comfortable", "Compact", "Spacious"].map((d) => {
              const active = extraConfig.contentDensity === d;
              return (
                <button
                  key={d}
                  onClick={() => updateExtraConfig("contentDensity", d)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg border-none cursor-pointer transition-all"
                  style={{
                    backgroundColor: active ? "#00B87C" : "transparent",
                    color: active ? "white" : "var(--foreground)",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 4: DASHBOARD PREFERENCES */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          DASHBOARD PREFERENCES
        </span>
        <div className="space-y-3 mb-4">
          {[
            {
              key: "showWelcomeMessage",
              label: "Show Welcome Message on Dashboard",
              desc: "",
            },
            {
              key: "enableAnimatedCharts",
              label: "Enable Animated Charts",
              desc: "Charts animate on page load",
            },
            {
              key: "showQuickActionButtons",
              label: "Show Quick Action Buttons",
              desc: "",
            },
            {
              key: "enableRealTimeRefresh",
              label: "Enable Real-time Data Refresh",
              desc: "Data refreshes every 30 seconds automatically",
            },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <div>
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                  {item.label}
                </span>
                {item.desc && (
                  <span className="text-[11px] text-[#94A3B8]">
                    {item.desc}
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  updateExtraConfig(
                    item.key,
                    !extraConfig[item.key as keyof typeof extraConfig],
                  )
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: extraConfig[
                    item.key as keyof typeof extraConfig
                  ]
                    ? "#00B87C"
                    : "#E5E7EB",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: extraConfig[item.key as keyof typeof extraConfig]
                      ? "18px"
                      : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
            Dashboard Refresh Interval
          </label>
          <select
            value={extraConfig.dashboardRefreshInterval}
            onChange={(e) =>
              updateExtraConfig("dashboardRefreshInterval", e.target.value)
            }
            className="rounded-xl px-3 py-2 text-sm border bg-white dark:bg-neutral-800"
            style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
          >
            <option>15 seconds</option>
            <option>30 seconds</option>
            <option>1 minute</option>
            <option>5 minutes</option>
          </select>
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Settings reset to default", "error")}
          style={{
            backgroundColor: "transparent",
            color: "#9CA3AF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => showToast("Appearance preferences saved")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
