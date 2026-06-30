import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Globe,
  Key,
  Palette,
  Eye,
  EyeOff,
  Check,
  Download,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { useAuth } from "../../context/AuthContext";

type SettingsTab =
  | "Profile Settings"
  | "Notification Preferences"
  | "Appearance"
  | "Language & Region"
  | "Payroll Configuration"
  | "Security & Password"
  | "Data Export";

export function FinanceSettings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile Settings");

  // States: Profile Settings
  const [firstName, setFirstName] = useState("Ananya");
  const [lastName, setLastName] = useState("Sharma");
  const [email, setEmail] = useState("ananya.sharma@nexushr.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState(
    "Senior Finance Manager overseeing payroll and expense approvals.",
  );

  useEffect(() => {
    if (user) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // States: Notification Preferences
  const [notifPayrollAlerts, setNotifPayrollAlerts] = useState(true);
  const [notifExpenseRequests, setNotifExpenseRequests] = useState(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);

  // States: Language & Region
  const [lang, setLang] = useState("English (India)");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [timeZone, setTimeZone] = useState("IST (UTC +5:30)");

  // States: Payroll Configuration
  const [payrollCutoff, setPayrollCutoff] = useState("25");
  const [autoProcess, setAutoProcess] = useState(false);
  const [taxRegime, setTaxRegime] = useState("New Tax Regime");

  // States: Security & Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // States: Appearance
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  // Password Strength Calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@#$%!]/.test(newPassword);

  const getStrengthScore = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = getStrengthScore();

  // Handlers
  const handleSave = () => {
    if (activeTab === "Profile Settings") {
      if (user) {
        const fullName = `${firstName} ${lastName}`.trim();
        const updatedUser = {
          ...user,
          name: fullName,
          email: email,
          initials:
            fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "AS",
        };
        login(updatedUser);

        try {
          const registeredRaw = localStorage.getItem("nexus_registered_users");
          if (registeredRaw) {
            const users = JSON.parse(registeredRaw);
            const updatedUsers = users.map((u: any) => {
              if (u.email.toLowerCase() === user.email.toLowerCase()) {
                return {
                  ...u,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  initials: updatedUser.initials,
                };
              }
              return u;
            });
            localStorage.setItem(
              "nexus_registered_users",
              JSON.stringify(updatedUsers),
            );
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (activeTab === "Security & Password") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        showToast("Error", "error", "Please fill in all password fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("Error", "error", "New passwords do not match.");
        return;
      }
      if (strengthScore < 4) {
        showToast("Error", "error", "Password does not meet all requirements.");
        return;
      }
      showToast("Success", "success", "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (activeTab === "Appearance") {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (isSystemDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }

    showToast("Saved", "success", `${activeTab} saved successfully.`);
  };

  const handleReset = () => {
    if (activeTab === "Profile Settings") {
      setFirstName("Ananya");
      setLastName("Sharma");
      setEmail("ananya.sharma@nexushr.com");
      setPhone("+91 98765 43210");
      setBio(
        "Senior Finance Manager overseeing payroll and expense approvals.",
      );
    } else if (activeTab === "Notification Preferences") {
      setNotifPayrollAlerts(true);
      setNotifExpenseRequests(true);
      setNotifSystemUpdates(false);
      setNotifEmailDigest(true);
    } else if (activeTab === "Language & Region") {
      setLang("English (India)");
      setDateFormat("DD-MM-YYYY");
      setTimeZone("IST (UTC +5:30)");
    } else if (activeTab === "Appearance") {
      setTheme("system");
    } else if (activeTab === "Payroll Configuration") {
      setPayrollCutoff("25");
      setAutoProcess(false);
      setTaxRegime("New Tax Regime");
    } else if (activeTab === "Security & Password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTwoFactorAuth(false);
    }
    showToast("Reset Complete", "info", `Restored defaults for ${activeTab}.`);
  };

  const handleDownloadExport = () => {
    showToast(
      "Download Started",
      "info",
      "Your data export is being generated and will download shortly.",
    );
  };

  // Custom UI Toggle Component
  const ToggleRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-border last:border-0 gap-8">
      <div className="flex-1">
        <p className="text-[13px] font-black text-foreground leading-tight">
          {label}
        </p>
        <p className="text-[11px] font-bold text-muted-foreground mt-1 max-w-[500px]">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none flex-shrink-0 relative ${
          checked ? "bg-[#00B87C]" : "bg-secondary border border-border"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-28 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-6">
        <div className="w-11 h-11 rounded-[10px] bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 dark:bg-secondary">
          <Settings size={22} className="text-[#6B7280]" />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
            Settings
          </h1>
          <p className="text-[13px] text-[#6B7280]">
            Personal preferences and payroll configuration
          </p>
        </div>
      </div>

      {/* ─── Access Notice Banner (emerald) ────────────────────────── */}
      <div className="w-full bg-emerald-500/10 rounded-[20px] border border-emerald-500/20 px-6 py-4 flex items-start gap-3.5 dark:bg-emerald-500/5">
        <ShieldAlert
          size={18}
          className="text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-500/90 leading-relaxed">
          <span className="font-black">Finance role active.</span> You can
          manage your personal preferences and limited payroll configuration
          settings. System-level settings and integrations require Super Admin
          access.
        </p>
      </div>

      {/* ─── Two-Column Layout ───────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sub-nav */}
        <div className="w-full lg:w-[260px] bg-white rounded-2xl p-3 flex flex-col gap-6 shadow-sm flex-shrink-0 dark:bg-card border border-border">
          {/* Section: PERSONAL */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-2.5">
              PERSONAL
            </p>
            <ul className="space-y-1">
              {[
                { label: "Profile Settings", icon: User },
                { label: "Notification Preferences", icon: Bell },
                { label: "Appearance", icon: Palette },
                { label: "Language & Region", icon: Globe },
              ].map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveTab(item.label as SettingsTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-black transition-all text-left ${
                        isActive
                          ? "bg-[#00B87C] text-white shadow-lg shadow-emerald-500/15"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section: PAYROLL SCOPE */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-2.5">
              PAYROLL SCOPE
            </p>
            <ul className="space-y-1">
              {[{ label: "Payroll Configuration", icon: Sliders }].map(
                (item) => {
                  const isActive = activeTab === item.label;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => setActiveTab(item.label as SettingsTab)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-black transition-all text-left ${
                          isActive
                            ? "bg-[#00B87C] text-white shadow-lg shadow-emerald-500/15"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <item.icon size={16} className="flex-shrink-0" />
                        {item.label}
                      </button>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Section: ACCOUNT */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-2.5">
              ACCOUNT
            </p>
            <ul className="space-y-1">
              {[
                { label: "Security & Password", icon: Key },
                { label: "Data Export", icon: Download },
              ].map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveTab(item.label as SettingsTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-black transition-all text-left ${
                        isActive
                          ? "bg-[#00B87C] text-white shadow-lg shadow-emerald-500/15"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm flex flex-col gap-6 relative min-h-[500px] overflow-hidden dark:bg-card">
          {/* ─── Tab Panel 1: Profile Settings ─────────────────────── */}
          {activeTab === "Profile Settings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Profile Settings
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Update your personal information and profile picture
                </p>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#0EA5E9]/10 border-2 border-[#0EA5E9] flex items-center justify-center text-[#0EA5E9] font-black text-2xl flex-shrink-0">
                  AS
                </div>
                <div>
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = () => {
                        showToast(
                          "Photo Updated",
                          "success",
                          "Your profile photo was updated successfully.",
                        );
                      };
                      input.click();
                    }}
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Change Photo
                  </button>
                  <p className="text-[11px] font-bold text-muted-foreground mt-2">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full py-3 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab Panel 2: Notification Preferences ───────────────── */}
          {activeTab === "Notification Preferences" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Notification Preferences
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Choose what events you want to be notified about
                </p>
              </div>

              <div className="border border-border rounded-xl divide-y divide-border">
                <ToggleRow
                  label="Payroll Alerts"
                  description="Receive notifications about upcoming payroll cutoffs and processing."
                  checked={notifPayrollAlerts}
                  onChange={setNotifPayrollAlerts}
                />
                <ToggleRow
                  label="Expense Approval Requests"
                  description="Get notified when an employee submits an expense that requires your approval."
                  checked={notifExpenseRequests}
                  onChange={setNotifExpenseRequests}
                />
                <ToggleRow
                  label="System Updates"
                  description="Receive alerts about platform maintenance and feature updates."
                  checked={notifSystemUpdates}
                  onChange={setNotifSystemUpdates}
                />
                <ToggleRow
                  label="Email Digest (Weekly)"
                  description="Receive a consolidated email summarizing key activities for the week."
                  checked={notifEmailDigest}
                  onChange={setNotifEmailDigest}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 3: Appearance ───────────────────────────── */}
          {activeTab === "Appearance" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Appearance Settings
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Customize the look and feel of your workspace
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "light", label: "Light Theme" },
                  { id: "dark", label: "Dark Theme" },
                  { id: "system", label: "System Sync" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      theme === t.id
                        ? "border-[#00B87C] bg-emerald-500/5 text-[#00B87C]"
                        : "border-border bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {theme === t.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#00B87C] rounded-full flex items-center justify-center text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <Palette size={24} className="mb-3" />
                    <span className="text-[13px] font-black">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Tab Panel 4: Language & Region ────────────────────── */}
          {activeTab === "Language & Region" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Language & Region
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Set your localization preferences for the interface
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="English (India)">English (India)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="IST (UTC +5:30)">
                      India Standard Time (UTC +5:30)
                    </option>
                    <option value="GMT (UTC +0:00)">
                      Greenwich Mean Time (UTC +0:00)
                    </option>
                    <option value="EST (UTC -5:00)">
                      Eastern Standard Time (UTC -5:00)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab Panel 5: Payroll Configuration ────────────────── */}
          {activeTab === "Payroll Configuration" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Payroll Settings
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Manage personal payroll preferences and cut-off dates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Payroll Cut-off Date
                  </label>
                  <select
                    value={payrollCutoff}
                    onChange={(e) => setPayrollCutoff(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="20">20th of every month</option>
                    <option value="25">25th of every month</option>
                    <option value="Last Day">Last day of the month</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Personal Tax Regime
                  </label>
                  <select
                    value={taxRegime}
                    onChange={(e) => setTaxRegime(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="New Tax Regime">New Tax Regime</option>
                    <option value="Old Tax Regime">Old Tax Regime</option>
                  </select>
                </div>
              </div>

              <div className="border border-border rounded-xl mt-4">
                <ToggleRow
                  label="Auto-process Standard Payroll"
                  description="Enable automatic processing of payroll for standard, un-modified employee records."
                  checked={autoProcess}
                  onChange={setAutoProcess}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 6: Security & Password ──────────────────── */}
          {activeTab === "Security & Password" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Security & Password
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Update your password and manage security settings
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPass ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPass ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="max-w-md bg-secondary/50 rounded-xl p-4 border border-border">
                  <p className="text-[11px] font-bold text-foreground mb-3">
                    Password Requirements:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                    <div
                      className={`flex items-center gap-2 ${hasMinLength ? "text-[#00B87C]" : "text-muted-foreground"}`}
                    >
                      <Check size={14} /> At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${hasUppercase ? "text-[#00B87C]" : "text-muted-foreground"}`}
                    >
                      <Check size={14} /> One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${hasNumber ? "text-[#00B87C]" : "text-muted-foreground"}`}
                    >
                      <Check size={14} /> One number
                    </div>
                    <div
                      className={`flex items-center gap-2 ${hasSpecial ? "text-[#00B87C]" : "text-muted-foreground"}`}
                    >
                      <Check size={14} /> One special character
                    </div>
                  </div>
                </div>
              )}

              <div className="border border-border rounded-xl mt-6">
                <ToggleRow
                  label="Two-Factor Authentication (2FA)"
                  description="Add an extra layer of security to your account by requiring a code from your authenticator app."
                  checked={twoFactorAuth}
                  onChange={setTwoFactorAuth}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 7: Data Export ──────────────────────────── */}
          {activeTab === "Data Export" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-black text-foreground">
                  Data Export
                </h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Download an archive of your personal data and settings
                </p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#00B87C]/20 rounded-2xl p-6 dark:bg-[#00B87C]/5 flex flex-col gap-4">
                <div>
                  <h3 className="text-[14px] font-black text-foreground">
                    Request Data Archive
                  </h3>
                  <p className="text-[12px] font-bold text-muted-foreground mt-1 max-w-[500px]">
                    This will generate a compressed ZIP file containing your
                    profile information, attendance logs, and personal
                    documents.
                  </p>
                </div>

                <button
                  onClick={handleDownloadExport}
                  className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#00B87C]/30 text-[#00B87C] text-[13px] font-bold shadow-sm hover:bg-[#00B87C]/5 transition-colors dark:bg-transparent"
                >
                  <Download size={16} />
                  Export My Data
                </button>
              </div>
            </div>
          )}

          {/* ─── Footer Action Buttons ─────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border flex items-center justify-end gap-3 rounded-b-[24px]">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-border bg-secondary text-[13px] font-bold text-foreground hover:bg-secondary/80 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[13px] font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
