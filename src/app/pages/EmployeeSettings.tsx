import { useState } from "react";
import {
  User,
  ShieldCheck,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Edit3,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/workflow/ToastNotification";
import { useNavigate } from "react-router";

export default function EmployeeSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    sms: false,
    leaveUpdates: true,
    expenseUpdates: true,
    payslipAlerts: true,
    hrAnnouncements: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-[1000px] mx-auto pb-20">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 mb-2">
        <h1 className="text-[28px] font-black text-foreground leading-none">
          Settings
        </h1>
        <p className="text-[14px] font-bold text-muted-foreground">
          Manage your account preferences and notification settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Left Column: Profile & Account ───────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* 1. Profile Information */}
          <section className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight">
                  Profile Information
                </h3>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
              >
                <Edit3 size={14} /> Request Update
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground/70 cursor-not-allowed">
                    {user?.name || "Priya Sharma"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground/70 cursor-not-allowed">
                    {user?.email || "priya.s@nexushr.com"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Department
                  </label>
                  <div className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground/70 cursor-not-allowed">
                    Product Engineering
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Designation / Role
                  </label>
                  <div className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground/70 cursor-not-allowed">
                    Senior UI Developer
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Account Settings */}
          <section className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight">
                Account & Security
              </h3>
            </div>

            <div className="p-8 space-y-4">
              <button
                onClick={() =>
                  showToast(
                    "Security",
                    "info",
                    "Change password modal would open here",
                  )
                }
                className="w-full flex items-center justify-between p-5 rounded-[24px] bg-background border border-border hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-black text-foreground">
                      Change Password
                    </p>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Update your account password regularly
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </button>

              <div className="w-full flex items-center justify-between p-5 rounded-[24px] bg-background border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-black text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-emerald-500 text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">
                  Enable
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ─── Right Column: Notifications & Preferences ───────── */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* 3. Notification Preferences */}
          <section className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Bell size={20} />
              </div>
              <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight">
                Notifications
              </h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Primary Toggles */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Delivery Channels
                </p>
                <div className="space-y-3">
                  <NotificationToggle
                    label="Email Notifications"
                    active={notifications.email}
                    onToggle={() => toggleNotification("email")}
                  />
                  <NotificationToggle
                    label="In-App Notifications"
                    active={notifications.inApp}
                    onToggle={() => toggleNotification("inApp")}
                  />
                  <NotificationToggle
                    label="SMS Notifications"
                    active={notifications.sms}
                    onToggle={() => toggleNotification("sms")}
                  />
                </div>
              </div>

              {/* Specific Topics */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Alert Types
                </p>
                <div className="space-y-3">
                  <NotificationToggle
                    label="Leave Request Updates"
                    active={notifications.leaveUpdates}
                    onToggle={() => toggleNotification("leaveUpdates")}
                  />
                  <NotificationToggle
                    label="Expense Claim Status"
                    active={notifications.expenseUpdates}
                    onToggle={() => toggleNotification("expenseUpdates")}
                  />
                  <NotificationToggle
                    label="Monthly Payslip Alerts"
                    active={notifications.payslipAlerts}
                    onToggle={() => toggleNotification("payslipAlerts")}
                  />
                  <NotificationToggle
                    label="Company Announcements"
                    active={notifications.hrAnnouncements}
                    onToggle={() => toggleNotification("hrAnnouncements")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Preferences */}
          <section className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Globe size={20} />
              </div>
              <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight">
                Preferences
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Display Language
                </label>
                <div className="relative group">
                  <select className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-[14px] font-bold text-foreground appearance-none focus:outline-none focus:border-primary transition-all">
                    <option value="en">English (United States)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon size={20} className="text-primary" />
                  ) : (
                    <Sun size={20} className="text-amber-500" />
                  )}
                  <span className="text-[14px] font-black text-foreground">
                    Theme: {isDarkMode ? "Dark" : "Light"}
                  </span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-1.5 rounded-full transition-all border-2 ${isDarkMode ? "bg-primary border-primary" : "bg-slate-200 border-slate-200"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-sm transition-all transform ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[14px] font-bold text-foreground/80">{label}</span>
      <button
        onClick={onToggle}
        className={`transition-colors duration-200 ${active ? "text-primary" : "text-slate-300"}`}
      >
        {active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
      </button>
    </div>
  );
}
