import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  User,
  Users,
  Lock,
  ShieldCheck,
  Bell,
  Moon,
  Globe,
  Laptop,
  Download,
  HelpCircle,
  Headphones,
  ChevronRight,
  Camera,
  X,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Sun,
  Monitor,
  Search,
  Phone,
  Mail,
  Smartphone,
  MapPin,
  Linkedin,
  Clock,
  Calendar,
  FileText,
  Receipt,
  Target,
  Folder,
  Star,
  AlertCircle,
  Info,
  Copy,
  LogOut,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { useAuth } from "../context/AuthContext";

type SectionKey =
  | "security"
  | "privacy"
  | "notifications"
  | "appearance"
  | "language"
  | "devices"
  | "data"
  | "help"
  | "contact";

interface SubNavItem {
  key: SectionKey;
  icon: React.ElementType;
  label: string;
  group: string;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  {
    key: "security",
    icon: Lock,
    label: "Account & Security",
    group: "ACCOUNT",
  },
  { key: "privacy", icon: ShieldCheck, label: "Privacy", group: "ACCOUNT" },
  {
    key: "notifications",
    icon: Bell,
    label: "Notifications",
    group: "PREFERENCES",
  },
  { key: "appearance", icon: Moon, label: "Appearance", group: "PREFERENCES" },
  {
    key: "language",
    icon: Globe,
    label: "Language & Region",
    group: "PREFERENCES",
  },
  {
    key: "devices",
    icon: Laptop,
    label: "Connected Devices",
    group: "DEVICES & DATA",
  },
  {
    key: "data",
    icon: Download,
    label: "My Data & Downloads",
    group: "DEVICES & DATA",
  },
  { key: "help", icon: HelpCircle, label: "Help & FAQ", group: "SUPPORT" },
  {
    key: "contact",
    icon: Headphones,
    label: "Contact HR / Support",
    group: "SUPPORT",
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-5 bg-primary rounded-full shrink-0" />
      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

function Breadcrumb({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 text-[12px] font-bold">
      <span className="text-muted-foreground/60">Settings</span>
      <ChevronRight size={12} className="text-muted-foreground/40" />
      <span className="text-primary">{active}</span>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[3001] flex items-center justify-center p-4"
          >
            <div className="relative bg-card w-full max-w-[520px] rounded-[32px] shadow-2xl border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h3 className="text-[16px] font-black text-foreground">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className={`w-11 h-6 rounded-full transition-all relative border-2 shrink-0 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${on ? "bg-primary/10 border-primary" : "bg-secondary/50 border-border"}`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all ${on ? "right-1 bg-primary" : "left-1 bg-muted-foreground/40"}`}
      />
    </button>
  );
}

export default function EmployeeSettings() {
  const [activeSection, setActiveSection] = useState<SectionKey>("security");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-11 h-11 rounded-[12px] bg-secondary flex items-center justify-center shadow-sm">
          <Settings size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Settings
          </h1>
          <p className="text-[14px] font-bold text-muted-foreground mt-1">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      {/* ─── 2-Column Layout ───────────────────────────────────── */}
      <div className="flex gap-6 items-start">
        {/* Left: Sub-navigation */}
        <div className="w-[220px] shrink-0 sticky top-[80px]">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-3">
            {["ACCOUNT", "PREFERENCES", "DEVICES & DATA", "SUPPORT"].map(
              (group) => (
                <div key={group} className="mb-1">
                  <p className="px-3 py-2 text-[11px] font-semibold text-[#94A3B8]/50 uppercase tracking-widest">
                    {group}
                  </p>
                  {SUB_NAV_ITEMS.filter((i) => i.group === group).map(
                    (item) => {
                      const active = activeSection === item.key;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => setActiveSection(item.key)}
                          className={`w-full flex items-center gap-3 rounded-xl transition-all text-left ${active ? "bg-primary text-white font-black" : "text-muted-foreground font-bold hover:bg-secondary hover:text-foreground"}`}
                          style={{ padding: "9px 12px", fontSize: "13px" }}
                        >
                          <Icon
                            size={16}
                            className={
                              active ? "text-white" : "text-muted-foreground"
                            }
                          />
                          <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.label}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right: Content Panel */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            {activeSection === "security" && (
              <AccountSecurity onModal={_setActiveModal} />
            )}
            {activeSection === "privacy" && (
              <PrivacySettings onModal={_setActiveModal} />
            )}
            {activeSection === "notifications" && (
              <NotificationSettings onModal={_setActiveModal} />
            )}
            {activeSection === "appearance" && <AppearanceSettings />}
            {activeSection === "language" && (
              <LanguageRegion onModal={_setActiveModal} />
            )}
            {activeSection === "devices" && (
              <ConnectedDevices onModal={_setActiveModal} />
            )}
            {activeSection === "data" && (
              <DataDownloads onModal={setActiveModal} />
            )}
            {activeSection === "help" && <HelpFAQ navigate={navigate} />}
            {activeSection === "contact" && (
              <ContactSupport onModal={setActiveModal} navigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: ACCOUNT & SECURITY
   ═══════════════════════════════════════════ */
function AccountSecurity({ onModal }: { onModal: (m: string | null) => void }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFA, setTwoFA] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro · Chrome",
      location: "Chennai, India",
      time: "Today 9:02 AM",
      icon: Laptop,
      color: "var(--primary)",
      bg: "var(--secondary)",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 14 Pro · NexusHR App",
      location: "Chennai, India",
      time: "Apr 5, 2026",
      icon: Smartphone,
      color: "#0EA5E9",
      bg: "#E0F2FE",
      current: false,
    },
    {
      id: 3,
      device: "Windows PC · Chrome",
      location: "Mumbai, India",
      time: "Mar 28, 2026",
      icon: Laptop,
      color: "#8B5CF6",
      bg: "#EDE9FE",
      current: false,
    },
  ];

  const pwStrength = (pw: string) => {
    if (!pw)
      return {
        level: 0,
        label: "Enter a password",
        color: "var(--muted-foreground)",
      };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[!@#$%^&*]/.test(pw)) s++;
    const getLabel = (v: number): string => {
      switch (v) {
        case 1:
          return "Weak";
        case 2:
          return "Fair";
        case 3:
          return "Good";
        case 4:
          return "Strong";
        default:
          return "";
      }
    };
    const getColor = (v: number): string => {
      switch (v) {
        case 1:
          return "#EF4444";
        case 2:
          return "#F59E0B";
        case 3:
          return "#3B82F6";
        case 4:
          return "var(--primary)";
        default:
          return "var(--muted-foreground)";
      }
    };
    return { level: s, label: getLabel(s), color: getColor(s) };
  };

  const strength = pwStrength(newPw);
  const pwMatch = confirmPw ? newPw === confirmPw : null;

  return (
    <div>
      <Breadcrumb active="Account & Security" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Account & Security
      </h2>

      {/* Change Password */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-8">
        <Label>UPDATE YOUR PASSWORD</Label>
        <div className="space-y-5 max-w-lg">
          <PasswordField
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            show={showPw.current}
            onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
          />
          <div>
            <PasswordField
              label="New Password"
              value={newPw}
              onChange={setNewPw}
              show={showPw.new}
              onToggle={() => setShowPw({ ...showPw, new: !showPw.new })}
            />
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      i <= strength.level ? strength.color : "var(--border)",
                  }}
                />
              ))}
              <span
                className="text-[11px] font-bold ml-1"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          </div>
          <div>
            <PasswordField
              label="Confirm New Password"
              value={confirmPw}
              onChange={setConfirmPw}
              show={showPw.confirm}
              onToggle={() =>
                setShowPw({ ...showPw, confirm: !showPw.confirm })
              }
            />
            {pwMatch !== null && (
              <p
                className={`text-[12px] font-bold mt-1.5 ${pwMatch ? "text-primary" : "text-rose-500"}`}
              >
                {pwMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>
        </div>
        <ul className="mt-4 space-y-1 text-[12px] font-bold text-muted-foreground">
          <li>• Minimum 8 characters</li>
          <li>• At least 1 uppercase letter</li>
          <li>• At least 1 number</li>
          <li>• At least 1 special character (!@#$)</li>
        </ul>
        <button
          onClick={() =>
            showToast(
              "Password Updated",
              "success",
              "Password updated successfully!",
            )
          }
          className="mt-6 w-full max-w-lg py-3.5 rounded-xl bg-primary text-white font-black text-[14px] shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between mb-5">
          <Label>TWO-FACTOR AUTHENTICATION (2FA)</Label>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20">
            {twoFA ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        {twoFA && (
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
            <div className="flex items-center gap-2 text-[13px] font-black text-primary mb-1">
              <ShieldCheck size={16} /> 2FA is active — your account is
              protected
            </div>
            <p className="text-[13px] font-bold text-muted-foreground">
              ● Authenticator App (Google Authenticator)
            </p>
            <p className="text-[12px] font-bold text-muted-foreground/60">
              Last used: Apr 5, 2026 at 9:15 AM
            </p>
          </div>
        )}
        <div className="space-y-5 max-w-lg">
          <ToggleRow
            label="Enable Two-Factor Authentication"
            desc="Requires a second verification step on login"
            on={twoFA}
            onChange={setTwoFA}
          />
          <div className="flex items-center justify-between py-2 px-4 rounded-2xl bg-background border border-border">
            <div>
              <p className="text-[14px] font-bold text-foreground">
                Backup Codes
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                8 backup codes available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl border border-primary text-primary text-[11px] font-black hover:bg-primary/10 transition-all">
                View Codes
              </button>
              <button className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-all">
                Regenerate
              </button>
            </div>
          </div>
          <ToggleRow
            label="Remember this device for 30 days"
            desc="Skip 2FA on trusted devices"
            on={rememberDevice}
            onChange={setRememberDevice}
          />
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <Label>YOUR ACTIVE LOGIN SESSIONS</Label>
        <div className="space-y-1">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 py-3.5 px-3 rounded-2xl hover:bg-secondary transition-colors border-b border-border/50 last:border-b-0"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-foreground truncate">
                    {s.device}
                  </p>
                  <p className="text-[12px] font-bold text-muted-foreground truncate">
                    {s.location} · {s.time}
                  </p>
                </div>
                {s.current ? (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20 shrink-0">
                    This device
                  </span>
                ) : (
                  <button className="text-[12px] font-black text-rose-500 hover:underline shrink-0">
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className="mt-4 text-[12px] font-black text-rose-500 hover:underline flex items-center gap-2">
          <LogOut size={14} /> Sign Out of All Other Devices
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: PRIVACY
   ═══════════════════════════════════════════ */
function PrivacySettings({ onModal }: { onModal: (m: string | null) => void }) {
  const [toggles, setToggles] = useState({
    showPhone: false,
    showEmail: true,
    showDob: false,
    showLinkedin: true,
    showBlood: false,
    showSchedule: true,
    showOnline: true,
    allowPerformanceData: true,
    receiveBirthdayWishes: true,
    salaryManager: true,
    salaryFinance: true,
    loginActivity: true,
  });
  const toggle = (key: keyof typeof toggles) => {
    if (["salaryManager", "salaryFinance", "loginActivity"].includes(key))
      return;
    setToggles({ ...toggles, [key]: !toggles[key] });
    showToast("Privacy Updated", "success", "Privacy setting updated.");
  };

  return (
    <div>
      <Breadcrumb active="Privacy" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Privacy Settings
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>PROFILE VISIBILITY</Label>
        <p className="text-[13px] font-bold text-muted-foreground mb-5">
          Control what information colleagues can see in the Team Directory
        </p>
        <div className="space-y-1 max-w-lg">
          <ToggleRow
            label="Show my phone number to colleagues"
            desc="Team Directory will hide your mobile number"
            on={toggles.showPhone}
            onChange={() => toggle("showPhone")}
          />
          <ToggleRow
            label="Show my email to colleagues"
            desc="Work email always visible. Personal email follows this setting"
            on={toggles.showEmail}
            onChange={() => toggle("showEmail")}
          />
          <ToggleRow
            label="Show my date of birth"
            desc="Birthday reminders depend on this setting"
            on={toggles.showDob}
            onChange={() => toggle("showDob")}
          />
          <ToggleRow
            label="Show my LinkedIn profile"
            on={toggles.showLinkedin}
            onChange={() => toggle("showLinkedin")}
          />
          <ToggleRow
            label="Show my blood group"
            desc="Only HR and emergency contacts can see this"
            on={toggles.showBlood}
            onChange={() => toggle("showBlood")}
          />
          <ToggleRow
            label="Allow colleagues to see my work schedule"
            desc="Team members can see your shift timings"
            on={toggles.showSchedule}
            onChange={() => toggle("showSchedule")}
          />
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 mb-6">
        <Label>
          <span className="text-amber-500">SALARY PRIVACY</span>
        </Label>
        <div className="space-y-3 max-w-lg">
          <ToggleRow
            label="Show my salary to my manager"
            desc="Managers can always see their team's salary (company policy)"
            on={toggles.salaryManager}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> This setting is controlled by HR policy
          </p>
          <ToggleRow
            label="Show my salary details to Finance team"
            desc="Finance requires this for payroll processing"
            on={toggles.salaryFinance}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> Required for payroll — cannot be
            disabled
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>ACTIVITY & DATA VISIBILITY</Label>
        <div className="space-y-1 max-w-lg">
          <ToggleRow
            label="Show my online status (green dot)"
            desc="Colleagues see when you're active in the system"
            on={toggles.showOnline}
            onChange={() => toggle("showOnline")}
          />
          <ToggleRow
            label="Allow HR to see my login activity"
            desc="HR can view login times for attendance purposes"
            on={toggles.loginActivity}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> Required by company policy
          </p>
          <ToggleRow
            label="Allow performance data to be used in team reports"
            desc="Your anonymized performance contributes to team analytics"
            on={toggles.allowPerformanceData}
            onChange={() => toggle("allowPerformanceData")}
          />
          <ToggleRow
            label="Receive birthday wishes from colleagues"
            desc="Colleagues are notified on your birthday"
            on={toggles.receiveBirthdayWishes}
            onChange={() => toggle("receiveBirthdayWishes")}
          />
        </div>
      </div>

      <Label>DATA REQUESTS</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          <p className="text-[15px] font-black text-foreground mb-1">
            Request a copy of my data
          </p>
          <p className="text-[12px] font-bold text-muted-foreground mb-5">
            Download all your personal data stored in NexusHR
          </p>
          <button
            className="px-5 py-2.5 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all active:scale-95"
            onClick={() =>
              showToast(
                "Export Requested",
                "success",
                "Your data export request has been submitted. You'll receive an email within 48 hours.",
              )
            }
          >
            Request Download
          </button>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl shadow-sm p-8">
          <p className="text-[15px] font-black text-rose-500 mb-1">
            Request data deletion
          </p>
          <p className="text-[12px] font-bold text-muted-foreground mb-5">
            Request removal of personal data (subject to HR policy)
          </p>
          <button
            className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[12px] font-black hover:bg-rose-600 transition-all active:scale-95"
            onClick={() => onModal("deletion")}
          >
            Request Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: NOTIFICATIONS
   ═══════════════════════════════════════════ */
function NotificationSettings({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  const [channels, setChannels] = useState({
    leave: { email: true, push: true, sms: false },
    payroll: { email: true, push: true, sms: true },
    attendance: { email: false, push: true, sms: false },
    performance: { email: true, push: true, sms: false },
    expenses: { email: true, push: true, sms: false },
    schedule: { email: false, push: true, sms: true },
    announcements: { email: true, push: true, sms: false },
    training: { email: true, push: false, sms: false },
  });
  const [digest, setDigest] = useState(true);
  const [digestTime, setDigestTime] = useState("9:00 AM");
  const [quietHours, setQuietHours] = useState(true);
  const [quietFrom, setQuietFrom] = useState("10:00 PM");
  const [quietTo, setQuietTo] = useState("7:00 AM");
  const [weekendNotifs, setWeekendNotifs] = useState(false);

  const toggleChannel = (
    cat: keyof typeof channels,
    ch: "email" | "push" | "sms",
  ) => {
    setChannels({
      ...channels,
      [cat]: { ...channels[cat], [ch]: !channels[cat][ch] },
    });
  };

  const channelRows = [
    {
      key: "leave" as const,
      label: "Leave Requests & Approvals",
      desc: "When your leave is approved or rejected",
    },
    {
      key: "payroll" as const,
      label: "Salary & Payslips",
      desc: "When salary is credited or payslip is ready",
    },
    {
      key: "attendance" as const,
      label: "Attendance Alerts",
      desc: "Late marks, regularization approvals",
    },
    {
      key: "performance" as const,
      label: "Performance Reviews",
      desc: "Review deadlines, feedback received",
    },
    {
      key: "expenses" as const,
      label: "Expense Claims",
      desc: "When expense is approved, rejected",
    },
    {
      key: "schedule" as const,
      label: "Shift & Schedule",
      desc: "Shift changes, swap approvals",
    },
    {
      key: "announcements" as const,
      label: "Company Announcements",
      desc: "Urgent company-wide updates",
    },
    {
      key: "training" as const,
      label: "Goals & Learning",
      desc: "Goal deadlines, training due dates",
    },
  ];

  return (
    <div>
      <Breadcrumb active="Notifications" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Notification Preferences
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>NOTIFICATION CHANNELS</Label>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_52px_52px_52px] gap-2 px-5 py-3 border-b border-border bg-secondary/50 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            <span>Category</span>
            <span className="text-center">Email</span>
            <span className="text-center">Push</span>
            <span className="text-center">SMS</span>
          </div>
          {channelRows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_52px_52px_52px] gap-2 px-5 py-4 border-b last:border-b-0 border-border/50 hover:bg-[#00B87C]/[0.08] transition-colors items-center"
            >
              <div>
                <p className="text-[14px] font-black text-foreground">
                  {row.label}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground">
                  {row.desc}
                </p>
              </div>
              {(["email", "push", "sms"] as const).map((ch) => (
                <div key={ch} className="flex justify-center">
                  <Toggle
                    on={channels[row.key][ch]}
                    onChange={() => toggleChannel(row.key, ch)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>NOTIFICATION TIMING</Label>
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[14px] font-black text-foreground">
                Daily Digest Email
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                Receive a summary email at 9 AM instead of individual emails
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <Toggle on={digest} onChange={setDigest} />
              {digest && (
                <select
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "1:00 PM",
                    "2:00 PM",
                    "3:00 PM",
                    "4:00 PM",
                    "5:00 PM",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <ToggleRow
            label="Quiet Hours"
            desc="No push notifications during off-hours"
            on={quietHours}
            onChange={setQuietHours}
          />
          {quietHours && (
            <div className="flex items-center gap-3 pl-1">
              <span className="text-[12px] font-bold text-muted-foreground">
                From
              </span>
              <select
                value={quietFrom}
                onChange={(e) => setQuietFrom(e.target.value)}
                className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
              <span className="text-[12px] font-bold text-muted-foreground">
                To
              </span>
              <select
                value={quietTo}
                onChange={(e) => setQuietTo(e.target.value)}
                className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
          <ToggleRow
            label="Weekend Notifications"
            desc="Only receive critical alerts on weekends"
            on={weekendNotifs}
            onChange={setWeekendNotifs}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <Label>EMAIL PREFERENCES</Label>
        <button
          className="px-5 py-2.5 rounded-xl border border-rose-500 text-rose-500 text-[12px] font-black hover:bg-rose-500/10 transition-all active:scale-95"
          onClick={() => onModal("unsubscribe")}
        >
          Unsubscribe from all non-critical emails
        </button>
        <p className="text-[12px] font-bold text-muted-foreground italic mt-3">
          Critical notifications (salary, security) cannot be unsubscribed
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: APPEARANCE
   ═══════════════════════════════════════════ */
function AppearanceSettings() {
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
function LanguageRegion({ onModal }: { onModal: (m: string | null) => void }) {
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
function ConnectedDevices({
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
          meta: "NexusHR App · iOS 17",
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
              NexusHR Mobile App
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
function DataDownloads({ onModal }: { onModal: (m: string | null) => void }) {
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
function HelpFAQ({ navigate }: { navigate: (p: string) => void }) {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const [feedback, setFeedback] = useState("");

  const faqs = [
    {
      q: "How do I apply for leave?",
      a: "Go to My Leaves → click 'Apply Leave' button to submit a new request.",
      link: "/leave",
      linkLabel: "Apply Now →",
    },
    {
      q: "How do I download my payslip?",
      a: "Go to My Payslips → click the Download button against any payslip entry.",
      link: "/payslips",
      linkLabel: "Go to Payslips →",
    },
    {
      q: "How do I update my bank account details?",
      a: "Please contact HR or the Finance team to update your bank details.",
    },
    {
      q: "Why is my attendance showing incorrect?",
      a: "You can submit a regularization request from the Attendance page.",
      link: "/attendance",
      linkLabel: "Go to Attendance →",
    },
    {
      q: "How do I check my leave balance?",
      a: "Your leave balance is displayed on the My Leaves page and the dashboard.",
    },
    {
      q: "How do I submit an expense claim?",
      a: "Go to My Expenses → click 'New Claim' to submit an expense.",
    },
    {
      q: "How do I change my password?",
      a: "Go to Settings → Account & Security to update your password.",
    },
    {
      q: "How do I view my performance review?",
      a: "Go to My Performance → Reviews section to view your reviews.",
    },
    {
      q: "What is my Employee ID?",
      a: "Your Employee ID is EMP-0142, visible on your profile.",
    },
    {
      q: "How do I enroll for health insurance?",
      a: "Contact HR during the open enrollment period or within 30 days of joining.",
    },
  ];

  const filtered = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Breadcrumb active="Help & FAQ" />
      <h2 className="text-[22px] font-black text-foreground mb-5">
        Help & Frequently Asked Questions
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center mb-6">
        <Search size={18} className="text-muted-foreground ml-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full h-12 bg-transparent px-3 text-[14px] font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: Calendar,
            label: "Attendance & Leave",
            count: "12 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: FileText,
            label: "Payroll & Salary",
            count: "8 articles",
            bg: "#EDE9FE",
            color: "#8B5CF6",
          },
          {
            icon: User,
            label: "Documents & Profile",
            count: "6 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: Receipt,
            label: "Expenses",
            count: "5 articles",
            bg: "#FEF3C7",
            color: "#F59E0B",
          },
          {
            icon: Target,
            label: "Goals & Performance",
            count: "7 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: Lock,
            label: "Account & Security",
            count: "9 articles",
            bg: "#FEE2E2",
            color: "#EF4444",
          },
        ].map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm p-5 cursor-pointer hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon size={18} style={{ color: cat.color }} />
                </div>
                <p className="text-[14px] font-black text-foreground">
                  {cat.label}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
                style={{
                  backgroundColor: cat.bg,
                  color: cat.color,
                  borderColor: `${cat.color}20`,
                }}
              >
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>

      <Label>FREQUENTLY ASKED QUESTIONS</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
        {filtered.map((faq, i) => {
          const expanded = expandedFaq === i;
          return (
            <div key={i} className="border-b border-border/50 last:border-b-0">
              <button
                onClick={() => setExpandedFaq(expanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="text-[14px] font-black text-foreground flex-1 pr-4">
                  {faq.q}
                </span>
                <span className="text-muted-foreground text-[14px] shrink-0">
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
              {expanded && (
                <div className="px-6 pb-5">
                  <p className="text-[14px] font-bold text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                  {faq.link && faq.linkLabel && (
                    <button
                      onClick={() => navigate(faq.link!)}
                      className="mt-3 text-[13px] font-black text-primary hover:underline flex items-center gap-1"
                    >
                      {faq.linkLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <p className="text-[14px] font-bold text-muted-foreground mb-4">
          Was this page helpful?
        </p>
        {helpful === null ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setHelpful("yes")}
              className="px-6 py-2.5 rounded-xl border border-border text-[13px] font-black text-foreground hover:bg-secondary transition-all"
            >
              👍 Yes
            </button>
            <button
              onClick={() => setHelpful("no")}
              className="px-6 py-2.5 rounded-xl border border-border text-[13px] font-black text-foreground hover:bg-secondary transition-all"
            >
              👎 No
            </button>
          </div>
        ) : helpful === "yes" ? (
          <p className="text-[16px] font-black text-primary">
            Thank you for your feedback! 🙏
          </p>
        ) : (
          <div className="max-w-md mx-auto">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us how we can improve"
              rows={2}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[80px] resize-none mb-3"
            />
            <button
              onClick={() => {
                showToast("Feedback Submitted", "success", "Thank you!");
                setHelpful(null);
                setFeedback("");
              }}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: CONTACT HR / SUPPORT
   ═══════════════════════════════════════════ */
function ContactSupport({
  onModal,
  navigate,
}: {
  onModal: (m: string | null) => void;
  navigate: (p: string) => void;
}) {
  return (
    <div>
      <Breadcrumb active="Contact HR / Support" />
      <h2 className="text-[22px] font-black text-foreground mb-5">
        Contact HR & Support
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            icon: Headphones,
            bg: "#E0F2FE",
            color: "#0EA5E9",
            title: "Raise a Support Ticket",
            desc: "For IT issues, HR requests, payroll queries",
            btn: "Create Ticket",
            onClick: () => navigate("/support"),
          },
          {
            icon: Users,
            bg: "var(--secondary)",
            color: "var(--primary)",
            title: "Contact HR Team",
            desc: "For policy questions, personal matters, HR issues",
            email: "hr@nexushr.com",
            phone: "+91 80 1234 5678",
          },
          {
            icon: Monitor,
            bg: "#EDE9FE",
            color: "#8B5CF6",
            title: "IT Helpdesk",
            desc: "For laptop, software, VPN, access issues",
            email: "it@nexushr.com",
            onClick: () => navigate("/support"),
          },
          {
            icon: AlertCircle,
            bg: "#FEE2E2",
            color: "#EF4444",
            title: "Emergency",
            desc: "For urgent matters requiring immediate attention",
            phone: "+91 98765 00000",
            emergency: true,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: card.bg }}
              >
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <p className="text-[16px] font-black text-foreground mb-1">
                {card.title}
              </p>
              <p className="text-[13px] font-bold text-muted-foreground mb-4">
                {card.desc}
              </p>
              {card.email && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-black text-primary">
                    {card.email}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(card.email!);
                      showToast("Copied", "success", "Email copied!");
                    }}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-all"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                </div>
              )}
              {card.phone && !card.emergency && (
                <p className="text-[13px] font-bold text-muted-foreground mb-3">
                  {card.phone}
                </p>
              )}
              {card.emergency && (
                <>
                  <p className="text-[15px] font-black text-rose-500">
                    {card.phone}
                  </p>
                  <p className="text-[12px] font-bold text-muted-foreground italic mt-1">
                    Only for genuine emergencies
                  </p>
                </>
              )}
              {card.btn && (
                <button
                  onClick={card.onClick}
                  className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {card.btn}
                </button>
              )}
              {card.email && !card.btn && (
                <button
                  onClick={() => onModal("email")}
                  className="w-full mt-3 py-2.5 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all"
                >
                  Send Email
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Label>YOUR DEDICATED CONTACTS</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
        {[
          {
            initials: "RP",
            gradient: "linear-gradient(135deg, #00B87C, #059669)",
            name: "Ryan Park",
            role: "HR Administrator",
            email: "ryan@nexushr.com",
          },
          {
            initials: "SI",
            gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
            name: "Suresh Iyer",
            role: "Engineering Manager",
            email: "suresh@nexushr.com",
          },
          {
            initials: "IT",
            gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)",
            name: "IT Support Team",
            role: "Information Technology",
            email: "it@nexushr.com",
          },
          {
            initials: "AD",
            gradient: "linear-gradient(135deg, #00B87C, #059669)",
            name: "Ananya Das",
            role: "Finance Officer",
            email: "ananya@nexushr.com",
          },
        ].map((contact, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-b-0 hover:bg-[#00B87C]/[0.08] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-sm"
                style={{ background: contact.gradient }}
              >
                {contact.initials}
              </div>
              <div>
                <p className="text-[14px] font-black text-foreground">
                  {contact.name}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground">
                  {contact.role}
                </p>
                <p className="text-[12px] font-black text-primary">
                  {contact.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => onModal("message")}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all shrink-0"
            >
              {contact.name === "IT Support Team" ? "Raise Ticket" : "Message"}
            </button>
          </div>
        ))}
      </div>

      <Label>SUPPORT AVAILABILITY</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="space-y-3 mb-5">
          {[
            { label: "HR Team", hours: "Monday–Friday, 9:00 AM – 6:00 PM IST" },
            {
              label: "IT Support",
              hours: "Monday–Saturday, 8:00 AM – 8:00 PM IST",
            },
            { label: "Emergency", hours: "24/7" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-muted-foreground">
                {item.label}
              </span>
              <span className="text-[14px] font-black text-foreground">
                {item.hours}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[13px] font-black text-primary">
            HR Team is currently available
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  on,
  onChange,
  disabled,
}: {
  label: string;
  desc?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 group">
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={`text-[14px] font-black ${disabled ? "text-muted-foreground/60" : "text-foreground"} group-hover:text-primary transition-colors`}
        >
          {label}
        </p>
        {desc && (
          <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
            {desc}
          </p>
        )}
      </div>
      <Toggle on={on} onChange={onChange} disabled={disabled} />
    </div>
  );
}
