import { useState } from "react";
import type { ReactNode } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

const settingsTabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({
    label,
    value,
    icon,
    type = "text",
  }: {
    label: string;
    value: string;
    icon?: ReactNode;
    type?: string;
  }) => (
    <div>
      <label style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 rounded-xl px-4"
        style={{
          border: "1px solid var(--border)",
          height: "42px",
          backgroundColor: "var(--background)",
        }}
      >
        {icon && <span style={{ color: "var(--muted-foreground)", display: "flex" }}>{icon}</span>}
        <input
          type={type}
          defaultValue={value}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "13px",
            color: "var(--foreground)",
            width: "100%",
          }}
        />
      </div>
    </div>
  );

  const Toggle = ({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{label}</p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>{desc}</p>
        </div>
        <button
          onClick={() => setOn(!on)}
          className="rounded-full transition-all"
          style={{
            width: "44px",
            height: "24px",
            backgroundColor: on ? "var(--primary)" : "var(--border)",
            position: "relative",
            flexShrink: 0,
            border: "none",
            cursor: "pointer"
          }}
        >
          <div
            className="absolute top-1 rounded-full bg-white transition-all"
            style={{
              width: "16px",
              height: "16px",
              left: on ? "24px" : "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div className="flex gap-5">
        {/* Tab List */}
        <div
          className="rounded-2xl p-3 shrink-0 shadow-sm"
          style={{
            width: "200px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            alignSelf: "flex-start",
          }}
        >
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
              style={{
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: activeTab === tab.id ? "var(--secondary)" : "transparent",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 700 : 500,
                marginBottom: "2px",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {activeTab === "company" && (
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  Company Information
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                  Update your organization details and preferences.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Company Name" value="NexusHR Technologies" />
                  <Field label="Industry" value="Software & Technology" />
                  <Field label="Email" value="hr@nexushr.com" icon={<Mail size={14} />} />
                  <Field label="Phone" value="+1 (800) 123-4567" icon={<Phone size={14} />} />
                  <div className="col-span-2">
                    <Field label="Headquarters" value="1000 Innovation Drive, San Francisco, CA 94105" icon={<MapPin size={14} />} />
                  </div>
                  <Field label="Website" value="www.nexushr.com" icon={<Globe size={14} />} />
                  <Field label="Founded Year" value="2018" />
                  <div className="col-span-2">
                    <label style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Company Description
                    </label>
                    <textarea
                      defaultValue="NexusHR is a leading enterprise HR management platform empowering organizations to manage their most valuable assets — their people."
                      style={{
                        width: "100%",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "var(--foreground)",
                        backgroundColor: "var(--background)",
                        outline: "none",
                        resize: "none",
                        height: "80px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  Notification Preferences
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                  Choose what events you want to be notified about.
                </p>
                <Toggle label="New Employee Onboarding" desc="Get notified when a new employee joins" defaultOn={true} />
                <Toggle label="Leave Requests" desc="Alerts for pending leave approvals" defaultOn={true} />
                <Toggle label="Payroll Processed" desc="Confirmation when payroll is run" defaultOn={true} />
                <Toggle label="Performance Reviews" desc="Reminders for upcoming review cycles" defaultOn={false} />
                <Toggle label="Recruitment Updates" desc="Candidate stage changes and new applications" defaultOn={true} />
                <Toggle label="System Alerts" desc="Critical system notifications and errors" defaultOn={true} />
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  Security Settings
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                  Manage authentication and access control.
                </p>
                <Toggle label="Two-Factor Authentication" desc="Require 2FA for all admin accounts" defaultOn={true} />
                <Toggle label="Single Sign-On (SSO)" desc="Enable SSO via Google Workspace" defaultOn={false} />
                <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn={true} />
                <Toggle label="IP Restriction" desc="Only allow access from approved IPs" defaultOn={false} />
                <Toggle label="Audit Logging" desc="Track all admin actions for compliance" defaultOn={true} />
              </div>
            )}

            {activeTab === "account" && (
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  Account Settings
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                  Manage your personal profile and preferences.
                </p>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
                  >
                    <span style={{ color: "white", fontSize: "20px", fontWeight: 800 }}>RP</span>
                  </div>
                  <div>
                    <p style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Ryan Park</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>HR Administrator</p>
                  </div>
                  <button
                    className="ml-auto px-4 py-2 rounded-xl"
                    style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}
                  >
                    Change Photo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" value="Ryan" />
                  <Field label="Last Name" value="Park" />
                  <Field label="Email Address" value="ryan.park@nexushr.com" />
                  <Field label="Role" value="HR Administrator" />
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  Appearance
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                  Customize the look and feel of your dashboard.
                </p>
                <div>
                  <p style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                    Accent Color
                  </p>
                  <div className="flex items-center gap-3">
                    {["#059669", "#14B8A6", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"].map((color) => (
                      <button
                        key={color}
                        className="w-9 h-9 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          border: color === "#059669" ? "3px solid var(--card)" : "none",
                          boxShadow: color === "#059669" ? `0 0 0 2px ${color}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{
                  background: saved
                    ? "linear-gradient(135deg, #22C55E, #16A34A)"
                    : "linear-gradient(135deg, #059669, #047857)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                }}
              >
                <Save size={14} />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}