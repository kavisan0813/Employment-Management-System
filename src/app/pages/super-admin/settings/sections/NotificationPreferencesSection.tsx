import React, { useState } from "react";
import { EmailTemplatesSection } from "./EmailTemplatesSection";
import { SmsSettingsSection } from "./SmsSettingsSection";
import { useSettingsContext } from "../SettingsContext";
import * as Icons from "lucide-react";

export function NotificationPreferencesSection() {
  const { showToast } = useSettingsContext();
  const [activeTab, setActiveTab] = useState<"preferences" | "templates" | "sms">("preferences");

  const [notificationMatrix, setNotificationMatrix] = useState([
    {
      category: "Leave Notifications",
      desc: "Leave application, approval status, and balance alerts",
      channels: { inApp: true, email: true, sms: false, push: true },
    },
    {
      category: "Payroll Notifications",
      desc: "Payslip generation, tax updates, and salary credit alerts",
      channels: { inApp: true, email: true, sms: true, push: false },
    },
    {
      category: "Attendance Alerts",
      desc: "Late check-in, missing logout, and shift reminder alerts",
      channels: { inApp: true, email: true, sms: false, push: true },
    },
    {
      category: "Performance & Appraisals",
      desc: "Review cycle launches, feedback requests, and goal updates",
      channels: { inApp: true, email: true, sms: false, push: false },
    },
    {
      category: "Security & System Alerts",
      desc: "New device logins, password resets, and critical audit alerts",
      channels: { inApp: true, email: true, sms: true, push: true },
    },
  ]);

  const toggleChannel = (catIdx: number, channel: "inApp" | "email" | "sms" | "push") => {
    const updated = [...notificationMatrix];
    updated[catIdx].channels[channel] = !updated[catIdx].channels[channel];
    setNotificationMatrix(updated);
    showToast("Notification channels updated", "success");
  };

  return (
    <div className="space-y-6">
      {/* SUB TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "preferences"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Delivery Preferences
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "templates"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Email Templates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sms")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sms"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          SMS & Gateways
        </button>
      </div>

      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Notification Preferences & Routing
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure event notification triggers and delivery channels across supported modules.
            </p>
          </div>

          {/* GATEWAY STATUS BANNER */}
          <div className="p-4 rounded-2xl bg-card border border-border grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Icons.Bell size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">In-App Alerts</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Active & Live</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Icons.Mail size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">Email Gateway</div>
                <div className="text-[10px] text-blue-600 font-semibold">SMTP Configured</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Icons.Smartphone size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">SMS Provider</div>
                <div className="text-[10px] text-amber-600 font-semibold">Twilio Connected</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Icons.Zap size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">Web Push</div>
                <div className="text-[10px] text-purple-600 font-semibold">VAPID Active</div>
              </div>
            </div>
          </div>

          {/* GROUPED PREFERENCE MATRIX */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Notification Channel Routing Matrix
              </h3>
            </div>

            <div className="divide-y divide-border/60">
              {notificationMatrix.map((row, idx) => (
                <div
                  key={row.category}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{row.category}</h4>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    {[
                      { key: "inApp", label: "In-App" },
                      { key: "email", label: "Email" },
                      { key: "sms", label: "SMS" },
                      { key: "push", label: "Push" },
                    ].map((ch) => {
                      const enabled = row.channels[ch.key as keyof typeof row.channels];
                      return (
                        <label
                          key={ch.key}
                          className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-foreground"
                        >
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() =>
                              toggleChannel(idx, ch.key as "inApp" | "email" | "sms" | "push")
                            }
                            className="w-4 h-4 rounded text-[#00B87C] focus:ring-[#00B87C] border-border accent-[#00B87C] cursor-pointer"
                          />
                          <span>{ch.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "templates" && <EmailTemplatesSection />}
      {activeTab === "sms" && <SmsSettingsSection />}
    </div>
  );
}
