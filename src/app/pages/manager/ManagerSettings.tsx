import { useState } from "react";
import {
  Settings,
  Lock,
  Users,
  Calendar,
  Award,
  Receipt,
  Bell,
  Globe,
  Key,
  Palette,
  Eye,
  EyeOff,
  Check,
  Info,
  RefreshCw,
  Sliders,
  CheckCircle,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";

type SettingsTab =
  | "Team Preferences"
  | "Leave Approval Rules"
  | "Performance Defaults"
  | "Expense Approval Limits"
  | "Notification Settings"
  | "Language & Region"
  | "Change Password"
  | "Appearance";

export function ManagerSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Team Preferences");

  // ─── States: Team Preferences ──────────────────────────────────────────
  const [teamName, setTeamName] = useState("Engineering Frontend Team");
  const [teamLocation, setTeamLocation] = useState("HQ, Chennai");
  const [teamWorkMode, setTeamWorkMode] = useState("Hybrid");
  const [allowWfh, setAllowWfh] = useState(true);
  const [requireLeaveReason, setRequireLeaveReason] = useState(true);
  const [autoApproveCL, setAutoApproveCL] = useState(false);
  const [notifyLateArrivals, setNotifyLateArrivals] = useState(true);

  // ─── States: Leave Approval Rules ──────────────────────────────────────
  const [maxLeaveDays, setMaxLeaveDays] = useState("5");
  const [autoEscalateDays, setAutoEscalateDays] = useState("2");
  const [advanceNoticeDays, setAdvanceNoticeDays] = useState("3");
  const [blackoutDates, setBlackoutDates] = useState("Review period Apr 20 – May 5");
  const [allowBackdated, setAllowBackdated] = useState(false);
  const [blockDuringReview, setBlockDuringReview] = useState(true);
  const [requireHandover, setRequireHandover] = useState(true);
  const [alertConsecutiveAbsences, setAlertConsecutiveAbsences] = useState(true);

  // ─── States: Performance Defaults ──────────────────────────────────────
  const [selfReviewWindow, setSelfReviewWindow] = useState("14");
  const [reviewDeadline, setReviewDeadline] = useState("21");
  const [ratingScale, setRatingScale] = useState("5-point");
  const [feedbackVisibility, setFeedbackVisibility] = useState("After finalization");
  const [notifyReviewOpen, setNotifyReviewOpen] = useState(true);
  const [requireJustificationBelow3, setRequireJustificationBelow3] = useState(true);
  const [enablePeerFeedback, setEnablePeerFeedback] = useState(true);

  // ─── States: Notification Preferences ──────────────────────────────────
  const [notifLeaveRequests, setNotifLeaveRequests] = useState(true);
  const [notifExpenseRequests, setNotifExpenseRequests] = useState(true);
  const [notifAttendanceAlerts, setNotifAttendanceAlerts] = useState(true);
  const [notifPerformanceDue, setNotifPerformanceDue] = useState(true);
  const [notifShiftSwaps, setNotifShiftSwaps] = useState(true);
  const [notifTrainingDeadlines, setNotifTrainingDeadlines] = useState(true);
  const [notifOvertimeAlerts, setNotifOvertimeAlerts] = useState(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);
  const [notifSmsCritical, setNotifSmsCritical] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // ─── States: Language & Region ─────────────────────────────────────────
  const [lang, setLang] = useState("English (India)");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [timeZone, setTimeZone] = useState("IST (UTC +5:30)");

  // ─── States: Change Password ───────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // ─── States: Appearance ────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");

  // ─── Password Strength Calculations ────────────────────────────────────
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

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleSave = () => {
    if (activeTab === "Change Password") {
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
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    if (activeTab === "Team Preferences") {
      setTeamName("Engineering Frontend Team");
      setTeamLocation("HQ, Chennai");
      setTeamWorkMode("Hybrid");
      setAllowWfh(true);
      setRequireLeaveReason(true);
      setAutoApproveCL(false);
      setNotifyLateArrivals(true);
    } else if (activeTab === "Leave Approval Rules") {
      setMaxLeaveDays("5");
      setAutoEscalateDays("2");
      setAdvanceNoticeDays("3");
      setBlackoutDates("Review period Apr 20 – May 5");
      setAllowBackdated(false);
      setBlockDuringReview(true);
      setRequireHandover(true);
      setAlertConsecutiveAbsences(true);
    } else if (activeTab === "Performance Defaults") {
      setSelfReviewWindow("14");
      setReviewDeadline("21");
      setRatingScale("5-point");
      setFeedbackVisibility("After finalization");
      setNotifyReviewOpen(true);
      setRequireJustificationBelow3(true);
      setEnablePeerFeedback(true);
    } else if (activeTab === "Notification Settings") {
      setNotifLeaveRequests(true);
      setNotifExpenseRequests(true);
      setNotifAttendanceAlerts(true);
      setNotifPerformanceDue(true);
      setNotifShiftSwaps(true);
      setNotifTrainingDeadlines(true);
      setNotifOvertimeAlerts(true);
      setNotifAnnouncements(false);
      setNotifEmailDigest(true);
      setNotifSmsCritical(true);
      setNotifPush(true);
    } else if (activeTab === "Language & Region") {
      setLang("English (India)");
      setDateFormat("DD-MM-YYYY");
      setTimeZone("IST (UTC +5:30)");
    } else if (activeTab === "Appearance") {
      setTheme("system");
    }
    showToast("Reset Complete", "info", `Restored defaults for ${activeTab}.`);
  };

  // ─── Custom UI Toggle Component ───────────────────────────────────────
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
        <p className="text-[13px] font-bold text-foreground leading-tight">{label}</p>
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
        <div className="w-11 h-11 rounded-[10px] bg-secondary flex items-center justify-center border border-border flex-shrink-0">
          <Settings size={22} className="text-[#6B7280]" />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
            Settings
          </h1>
          <p className="text-[13px] text-[#6B7280]">
            Personal preferences and team configuration
          </p>
        </div>
      </div>

      {/* ─── Access Notice Banner (amber) ────────────────────────── */}
      <div className="w-full bg-amber-500/10 rounded-2xl border border-amber-500/20 px-6 py-4 flex items-start gap-3.5 dark:bg-amber-500/5">
        <Lock size={18} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] font-bold text-amber-700 dark:text-amber-500/90 leading-relaxed">
          <span className="font-bold">Manager role access active.</span> You have permission to manage team preferences and personal configs only. System, payroll, and global security policies remain locked and are managed by Super Admin and Finance roles.
        </p>
      </div>

      {/* ─── Two-Column Layout ───────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sub-nav */}
        <div className="w-full lg:w-[260px] bg-card rounded-2xl border border-border p-4 flex flex-col gap-6 shadow-sm flex-shrink-0">
          {/* Section: Team Settings */}
          <div>
            <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Team Settings
            </p>
            <ul className="space-y-1">
              {[
                { label: "Team Preferences", icon: Users },
                { label: "Leave Approval Rules", icon: Calendar },
                { label: "Performance Defaults", icon: Award },
                { label: "Expense Approval Limits", icon: Receipt },
              ].map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveTab(item.label as SettingsTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-bold transition-all text-left ${
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

          {/* Section: My Preferences */}
          <div>
            <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              My Preferences
            </p>
            <ul className="space-y-1">
              {[
                { label: "Notification Settings", icon: Bell },
                { label: "Language & Region", icon: Globe },
                { label: "Change Password", icon: Key },
                { label: "Appearance", icon: Palette },
              ].map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveTab(item.label as SettingsTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-bold transition-all text-left ${
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

          {/* Locked Sections */}
          <div className="border-t border-border pt-4">
            <p className="px-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              System Settings <Lock size={10} />
            </p>
            <ul className="space-y-1 opacity-50">
              {[
                "Company Settings",
                "Payroll Settings",
                "Roles & Permissions",
                "Security",
                "Integrations",
              ].map((name) => (
                <li key={name}>
                  <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[12px] font-bold text-muted-foreground cursor-not-allowed">
                    <span className="flex items-center gap-3">
                      <Sliders size={15} />
                      {name}
                    </span>
                    <Lock size={12} className="opacity-70" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 w-full bg-card rounded-[28px] border border-border p-6 md:p-8 shadow-sm flex flex-col gap-6 relative min-h-[500px] overflow-hidden">
          {/* ─── Tab Panel 1: Team Preferences ─────────────────────── */}
          {activeTab === "Team Preferences" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Team Configuration</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Update basic team metadata and accessibility permissions
                </p>
              </div>

              {/* Policy Block Section */}
              <div className="bg-[#F0FDF4] border border-emerald-500/20 rounded-2xl p-6 dark:bg-[#00B87C]/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Team Size
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="12 members"
                      className="w-full h-11 px-4 rounded-xl border border-border bg-secondary text-[13px] font-bold text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Department
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Engineering"
                      className="w-full h-11 px-4 rounded-xl border border-border bg-secondary text-[13px] font-bold text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Cost Center
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="ENG-001"
                      className="w-full h-11 px-4 rounded-xl border border-border bg-secondary text-[13px] font-bold text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Default Location
                    </label>
                    <select
                      value={teamLocation}
                      onChange={(e) => setTeamLocation(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    >
                      <option value="HQ, Chennai">HQ, Chennai</option>
                      <option value="Bangalore Hub">Bangalore Hub</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Standard Work Mode
                    </label>
                    <select
                      value={teamWorkMode}
                      onChange={(e) => setTeamWorkMode(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site</option>
                      <option value="Fully Remote">Fully Remote</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-card rounded-2xl border border-border p-4 divide-y divide-border">
                <ToggleRow
                  label="Allow WFH Requests from Team"
                  description="Team members can submit work-from-home requests for your review and approval."
                  checked={allowWfh}
                  onChange={setAllowWfh}
                />
                <ToggleRow
                  label="Require Reason for Leave Requests"
                  description="Force team members to supply a detailed reason when filing leaves of any category."
                  checked={requireLeaveReason}
                  onChange={setRequireLeaveReason}
                />
                <ToggleRow
                  label="Auto-approve Casual Leave (1 day)"
                  description="Single-day casual leaves will bypass your approval and be auto-approved by the system."
                  checked={autoApproveCL}
                  onChange={setAutoApproveCL}
                />
                <ToggleRow
                  label="Notify on Team Late Arrivals"
                  description="Get dashboard alerts and emails whenever a team member checks in more than 15 minutes past shift start."
                  checked={notifyLateArrivals}
                  onChange={setNotifyLateArrivals}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 2: Leave Approval Rules ─────────────────── */}
          {activeTab === "Leave Approval Rules" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Approval Workflow</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Set triggers, notice windows, and escalation policies for leave management
                </p>
              </div>

              {/* Policy Block Section */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Max leave days per request (before escalation to HR)
                    </label>
                    <input
                      type="number"
                      value={maxLeaveDays}
                      onChange={(e) => setMaxLeaveDays(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Auto-escalate if not reviewed within (days)
                    </label>
                    <input
                      type="number"
                      value={autoEscalateDays}
                      onChange={(e) => setAutoEscalateDays(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Leave calendar advance notice required (days)
                    </label>
                    <input
                      type="number"
                      value={advanceNoticeDays}
                      onChange={(e) => setAdvanceNoticeDays(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Blackout dates
                    </label>
                    <input
                      type="text"
                      value={blackoutDates}
                      onChange={(e) => setBlackoutDates(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-card rounded-2xl border border-border p-4 divide-y divide-border">
                <ToggleRow
                  label="Allow Backdated Leave Applications"
                  description="Enable team members to request leave for past dates."
                  checked={allowBackdated}
                  onChange={setAllowBackdated}
                />
                <ToggleRow
                  label="Block Leaves During Performance Review Period"
                  description="Enforce strict blackout during critical annual appraisal timeline."
                  checked={blockDuringReview}
                  onChange={setBlockDuringReview}
                />
                <ToggleRow
                  label="Require Handover Document for > 5 days"
                  description="Mandate attachment of project status checklist for extended leave cycles."
                  checked={requireHandover}
                  onChange={setRequireHandover}
                />
                <ToggleRow
                  label="Alert HR for Consecutive Absences > 3 days"
                  description="Automatically flag potential unplanned absences directly to HR Partner."
                  checked={alertConsecutiveAbsences}
                  onChange={setAlertConsecutiveAbsences}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 3: Performance Defaults ─────────────────── */}
          {activeTab === "Performance Defaults" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Default Review Settings</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Establish standard performance review timeframes and evaluation defaults
                </p>
              </div>

              {/* Input Fields */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Self-review window (days)
                    </label>
                    <input
                      type="number"
                      value={selfReviewWindow}
                      onChange={(e) => setSelfReviewWindow(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      My review deadline (days after self-review)
                    </label>
                    <input
                      type="number"
                      value={reviewDeadline}
                      onChange={(e) => setReviewDeadline(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Default rating scale
                    </label>
                    <select
                      value={ratingScale}
                      onChange={(e) => setRatingScale(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    >
                      <option value="5-point">5-point scale</option>
                      <option value="10-point">10-point scale</option>
                      <option value="Descriptive">Descriptive feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Feedback visibility
                    </label>
                    <select
                      value={feedbackVisibility}
                      onChange={(e) => setFeedbackVisibility(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    >
                      <option value="After finalization">After review cycle finalization</option>
                      <option value="Immediate">Immediately on submission</option>
                      <option value="Hidden">Always hidden from employee</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-card rounded-2xl border border-border p-4 divide-y divide-border">
                <ToggleRow
                  label="Notify team of review opening"
                  description="Trigger automated announcements and email updates when the cycle goes active."
                  checked={notifyReviewOpen}
                  onChange={setNotifyReviewOpen}
                />
                <ToggleRow
                  label="Require justification for ratings below 3"
                  description="Enforce mandatory explanatory comments if any rating is set below average."
                  checked={requireJustificationBelow3}
                  onChange={setRequireJustificationBelow3}
                />
                <ToggleRow
                  label="Enable peer feedback for my team"
                  description="Allow peer nominations and direct constructive peer-to-peer reviews."
                  checked={enablePeerFeedback}
                  onChange={setEnablePeerFeedback}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 4: Expense Approval Limits ──────────────── */}
          {activeTab === "Expense Approval Limits" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">My Approval Authority</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Review your current expense delegation limits and routing thresholds
                </p>
              </div>

              {/* Limit Table */}
              <div className="border border-border rounded-2xl overflow-hidden bg-card">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border">
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        My Limit
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-bold">
                        Above Limit Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-[13px] font-bold text-foreground">
                    {[
                      { cat: "Travel", limit: "₹10,000", action: "Escalate to Finance" },
                      { cat: "Food", limit: "₹2,000", action: "Escalate to Finance" },
                      { cat: "Equipment", limit: "₹5,000", action: "Escalate to Finance" },
                      { cat: "Medical", limit: "₹5,000", action: "Escalate to Finance" },
                      { cat: "Other", limit: "₹3,000", action: "Escalate to Finance" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-bold">{row.cat}</td>
                        <td className="px-6 py-4 text-[#00B87C] font-bold">{row.limit}</td>
                        <td className="px-6 py-4 font-bold text-muted-foreground">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Request Bar */}
              <div className="bg-[#F0FDF4] border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between dark:bg-[#00B87C]/5">
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-[#00B87C]" />
                  <span className="text-[13px] font-bold text-foreground">
                    Total per request threshold:
                  </span>
                </div>
                <span className="text-[15px] font-bold text-[#00B87C]">
                  ₹25,000 max
                </span>
              </div>

              {/* Read-only Alert */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex items-start gap-3">
                <Info size={16} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-amber-700 dark:text-amber-500/90 leading-tight">
                    Delegated approval authority is locked.
                  </p>
                  <p className="text-[11px] font-bold text-amber-600/90 dark:text-amber-500/80 mt-1">
                    Approval limits are configured centrally by HR Administration. Please contact your Department Head to request threshold changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab Panel 5: Notification Settings ───────────────── */}
          {activeTab === "Notification Settings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">My Notification Preferences</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Configure alerts, push triggers, and digest schedules
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 divide-y divide-border">
                <ToggleRow
                  label="Leave Approval Requests"
                  description="Receive instant alerts when a team member files a leave."
                  checked={notifLeaveRequests}
                  onChange={setNotifLeaveRequests}
                />
                <ToggleRow
                  label="Expense Approval Requests"
                  description="Get notified when team expenses require L1 authorization."
                  checked={notifExpenseRequests}
                  onChange={setNotifExpenseRequests}
                />
                <ToggleRow
                  label="Team Attendance Alerts"
                  description="Daily summaries of late check-ins or unnotified absences."
                  checked={notifAttendanceAlerts}
                  onChange={setNotifAttendanceAlerts}
                />
                <ToggleRow
                  label="Performance Review Due"
                  description="Reminders as appraisal cycles open or deadlines approach."
                  checked={notifPerformanceDue}
                  onChange={setNotifPerformanceDue}
                />
                <ToggleRow
                  label="Shift Swap Requests"
                  description="Approval requests from team members requesting schedule modifications."
                  checked={notifShiftSwaps}
                  onChange={setNotifShiftSwaps}
                />
                <ToggleRow
                  label="Team Training Deadlines"
                  description="Alerts when assigned learning modules are close to due dates."
                  checked={notifTrainingDeadlines}
                  onChange={setNotifTrainingDeadlines}
                />
                <ToggleRow
                  label="Overtime Alerts"
                  description="Get notified when a team member registers > 2 hours of overtime."
                  checked={notifOvertimeAlerts}
                  onChange={setNotifOvertimeAlerts}
                />
                <ToggleRow
                  label="System Announcements"
                  description="Receive corporate broadcasts, news, and HR updates."
                  checked={notifAnnouncements}
                  onChange={setNotifAnnouncements}
                />
                <ToggleRow
                  label="Email Digest (Daily 9 AM)"
                  description="Consolidated overview report delivered to your inbox every morning."
                  checked={notifEmailDigest}
                  onChange={setNotifEmailDigest}
                />
                <ToggleRow
                  label="SMS for Critical Only"
                  description="Deliver urgent policy alerts or system failures via text."
                  checked={notifSmsCritical}
                  onChange={setNotifSmsCritical}
                />
                <ToggleRow
                  label="Push Notifications"
                  description="Desktop active toast updates when running EMS."
                  checked={notifPush}
                  onChange={setNotifPush}
                />
              </div>
            </div>
          )}

          {/* ─── Tab Panel 6: Language & Region ────────────────────── */}
          {activeTab === "Language & Region" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Language & Region Settings</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Select your localized display parameters and time zone defaults
                </p>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 gap-6 flex flex-col">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Preferred Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="English (India)">English (India)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                    <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 18-05-2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-18)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/18/2026)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="IST (UTC +5:30)">IST (UTC +5:30) - Mumbai, Kolkata</option>
                    <option value="GMT (UTC +0:00)">GMT (UTC +0:00) - London</option>
                    <option value="EST (UTC -5:00)">EST (UTC -5:00) - New York</option>
                    <option value="PST (UTC -8:00)">PST (UTC -8:00) - Los Angeles</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab Panel 7: Change Password ──────────────────────── */}
          {activeTab === "Change Password" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Change Password</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Create a new secure passphrase for your user credentials
                </p>
              </div>

              <div className="space-y-5">
                {/* Current Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Bar */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase">
                      <span>Password Strength</span>
                      <span
                        className={
                          strengthScore === 4
                            ? "text-[#00B87C]"
                            : strengthScore >= 2
                            ? "text-amber-500"
                            : "text-rose-500"
                        }
                      >
                        {strengthScore === 4
                          ? "Strong"
                          : strengthScore >= 2
                          ? "Medium"
                          : "Weak"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((bar) => {
                        let barColor = "bg-secondary";
                        if (bar <= strengthScore) {
                          if (strengthScore === 1) barColor = "bg-rose-500";
                          else if (strengthScore < 4) barColor = "bg-amber-500";
                          else barColor = "bg-[#00B87C]";
                        }
                        return (
                          <div key={bar} className={`h-full rounded-full transition-all duration-300 ${barColor}`} />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="bg-secondary/40 rounded-xl p-4 border border-border">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                    Security Requirements
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          hasMinLength
                            ? "bg-emerald-500/10 text-[#00B87C]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {hasMinLength ? <Check size={10} /> : <div className="w-1 h-1 rounded-full bg-current" />}
                      </div>
                      <span className={hasMinLength ? "text-foreground" : "text-muted-foreground"}>
                        Minimum 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          hasUppercase
                            ? "bg-emerald-500/10 text-[#00B87C]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {hasUppercase ? <Check size={10} /> : <div className="w-1 h-1 rounded-full bg-current" />}
                      </div>
                      <span className={hasUppercase ? "text-foreground" : "text-muted-foreground"}>
                        Uppercase letter
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          hasNumber
                            ? "bg-emerald-500/10 text-[#00B87C]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {hasNumber ? <Check size={10} /> : <div className="w-1 h-1 rounded-full bg-current" />}
                      </div>
                      <span className={hasNumber ? "text-foreground" : "text-muted-foreground"}>
                        At least one number
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          hasSpecial
                            ? "bg-emerald-500/10 text-[#00B87C]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {hasSpecial ? <Check size={10} /> : <div className="w-1 h-1 rounded-full bg-current" />}
                      </div>
                      <span className={hasSpecial ? "text-foreground" : "text-muted-foreground"}>
                        Special character (@#$%!)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab Panel 8: Appearance ───────────────────────────── */}
          {activeTab === "Appearance" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Theme & Layout Customization</h2>
                <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
                  Update theme controls, display templates, and format protocols
                </p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Display Mode
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: "light", label: "☀️ Light" },
                    { val: "dark", label: "🌙 Dark" },
                    { val: "system", label: "💻 System" },
                  ].map((t) => {
                    const isSelected = theme === t.val;
                    return (
                      <button
                        key={t.val}
                        onClick={() => setTheme(t.val)}
                        className={`px-6 py-3 rounded-2xl text-[13px] font-bold border transition-all ${
                          isSelected
                            ? "bg-[#00B87C] text-white border-emerald-500/20 shadow-lg shadow-emerald-500/20"
                            : "bg-card text-foreground border-border hover:bg-secondary"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Locale Fields */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex flex-col gap-5 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    System Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="English (India)">English (India)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    System Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-[13px] font-bold text-foreground outline-none focus:border-[#00B87C]"
                  >
                    <option value="IST (UTC +5:30)">IST (UTC +5:30)</option>
                    <option value="GMT (UTC +0:00)">GMT (UTC +0:00)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── Save Action Bar ───────────────────────────────────── */}
          <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-5">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw size={14} />
              Reset to Defaults
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-[#00B87C] text-white rounded-2xl font-bold text-[13px] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <CheckCircle size={15} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
