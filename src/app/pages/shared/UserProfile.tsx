import { useState, useRef, useEffect } from "react";
import { EmployeeSelfProfile } from "../employee/EmployeeSelfProfile";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Building2,
  Globe,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Save,
  X,
  Bell,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Github,
  Award,
  Clock,
  TrendingUp,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

const profileTabs = [
  "Personal Info",
  "Employment",
  "Recent Activity",
  "Settings",
];

const settingsSections = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Privacy", icon: Shield },
];

const initialSkills = [
  "HR Strategy",
  "Talent Acquisition",
  "Payroll Management",
  "Employee Relations",
  "Performance Management",
  "HRIS Systems",
];

const activityLog = [
  {
    action: "Updated payroll for March 2026",
    time: "2 hours ago",
    type: "payroll",
  },
  {
    action: "Approved leave request from Emily Chen",
    time: "5 hours ago",
    type: "leave",
  },
  {
    action: "Added new employee: Marcus Williams",
    time: "Yesterday",
    type: "employee",
  },
  {
    action: "Generated Q1 Performance Report",
    time: "2 days ago",
    type: "report",
  },
  {
    action: "Scheduled interview with candidate",
    time: "3 days ago",
    type: "recruitment",
  },
];

const stats = [
  { label: "Employees Managed", value: "247", icon: Users, color: "#059669" },
  { label: "Years Experience", value: "8", icon: TrendingUp, color: "#14B8A6" },
  {
    label: "Tasks Completed",
    value: "1,284",
    icon: CheckCircle2,
    color: "#22C55E",
  },
  { label: "Avg Response Time", value: "1.2h", icon: Clock, color: "#F59E0B" },
];

function Toggle({
  label,
  desc,
  defaultOn = false,
}: {
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div>
        <p
          style={{
            color: "var(--foreground)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: "var(--muted-foreground)",
            fontSize: "12px",
            marginTop: "2px",
          }}
        >
          {desc}
        </p>
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
          cursor: "pointer",
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
}

function InputField({
  label,
  value,
  onChange,
  icon,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  icon?: React.ReactNode;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 rounded-xl px-4 bg-background border border-border h-12 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5"
        style={{
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {icon && (
          <span className="text-muted-foreground flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold disabled:cursor-not-allowed"
          style={{
            WebkitTextFillColor: "var(--foreground)",
          }}
        />
      </div>
    </div>
  );
}

export function UserProfile() {
  const { user, login } = useAuth();

  if (user?.role === "Employee") {
    return <EmployeeSelfProfile />;
  }

  const [activeTab, setActiveTab] = useState("Personal Info");
  const [activeSettingsSection, setActiveSettingsSection] = useState("company");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load avatar from localStorage by user email
  useEffect(() => {
    if (user?.email) {
      const savedAvatar = localStorage.getItem(`viyan_avatar_${user.email}`);
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    }
  }, [user]);

  // Form states matching details
  const [firstName, setFirstName] = useState("Ryan");
  const [lastName, setLastName] = useState("Park");
  const [email, setEmail] = useState("ryan.park@viyanhr.com");
  const [phone, setPhone] = useState("+1 (415) 823-9100");
  const [location, setLocation] = useState("San Francisco, CA");
  const [jobTitle, setJobTitle] = useState("HR Administrator");
  const [department, setDepartment] = useState("Human Resources");
  const [reportsTo, setReportsTo] = useState("Sarah Mitchell, VP HR");
  const [bio, setBio] = useState(
    "Experienced HR professional with 8+ years managing full-cycle human resources for fast-growing tech organizations. Passionate about building strong employee cultures, optimizing HR processes, and leveraging data-driven decisions.",
  );
  const [website, setWebsite] = useState("ryanpark.hr.dev");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/ryanpark");
  const [twitter, setTwitter] = useState("@ryanpark_hr");
  const [github, setGithub] = useState("github.com/ryanpark");
  const [activeSkills, setActiveSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");

  // Update default form values if current user email or name changes
  useEffect(() => {
    if (user) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setJobTitle(
        user.role === "Super Admin" ? "Super Administrator" : "HR Manager",
      );
      setDepartment(
        user.role === "Super Admin" ? "Executive Office" : "Human Resources",
      );
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          setAvatarPreview(base64);
          if (user?.email) {
            localStorage.setItem(`viyan_avatar_${user.email}`, base64);
          }
          showToast(
            "Avatar Updated",
            "success",
            "Your profile photo has been updated successfully.",
          );
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim()) {
      setActiveSkills([...activeSkills, newSkill.trim()]);
      setNewSkill("");
      showToast(
        "Skill Added",
        "success",
        `"${newSkill.trim()}" has been added to your skills.`,
      );
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setActiveSkills(activeSkills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        initials:
          `${firstName} ${lastName}`
            .trim()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "RP",
      };

      login(updatedUser);

      try {
        const registeredRaw = localStorage.getItem("viyan_registered_users");
        if (registeredRaw) {
          const users = JSON.parse(registeredRaw);
          const updatedUsers = users.map(
            (u: { email: string; name?: string; initials?: string }) => {
              if (u.email.toLowerCase() === user.email.toLowerCase()) {
                return {
                  ...u,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  initials: updatedUser.initials,
                };
              }
              return u;
            },
          );
          localStorage.setItem(
            "viyan_registered_users",
            JSON.stringify(updatedUsers),
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    setSaved(true);
    setIsEditing(false);
    showToast(
      "Profile Updated",
      "success",
      "Your changes have been saved successfully.",
    );
    setTimeout(() => setSaved(false), 3000);
  };

  const activityTypeColor: Record<string, string> = {
    payroll: "#059669",
    leave: "#14B8A6",
    employee: "#22C55E",
    report: "#F59E0B",
    recruitment: "#0EA5E9",
  };

  const avatarInitials = user?.initials || "RP";
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20 text-foreground">
      {/* ─── Profile Hero Card ────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[32px] shadow-sm overflow-hidden relative">
        {/* Gradient Banner */}
        <div className="h-[130px] w-full bg-gradient-to-r from-[#00B87C] to-[#009966] relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-20" />
        </div>

        {/* Hero Content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar with Upload Overlay */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="w-32 h-32 rounded-[40px] bg-emerald-100 dark:bg-emerald-500/10 border-[6px] border-card shadow-xl overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-[#00B87C]">
                      {avatarInitials}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-[40px] bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px] m-[6px]">
                  <Camera size={24} className="text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex-1 pt-4 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                  <h1 className="text-2xl font-black text-foreground tracking-tight">
                    {fullName}
                  </h1>
                  <span className="px-2.5 rounded-lg bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] text-[11px] font-semibold uppercase tracking-widest text-white">
                    ● Active
                  </span>
                </div>
                <p className="text-[#00B87C] font-bold text-sm mb-3">
                  {jobTitle}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    EMP-0001
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    {department}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <MapPin size={13} /> {location}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <Calendar size={13} /> Since Mar 2018
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Full-time
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-2 shrink-0 justify-center w-full md:w-auto">
              {saved && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                    Saved!
                  </span>
                </div>
              )}
              {activeTab !== "Settings" &&
                activeTab !== "Recent Activity" &&
                (!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm bg-transparent"
                  >
                    <User size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                    >
                      Save
                    </button>
                  </div>
                ))}
              <button
                onClick={() =>
                  showToast(
                    "Info",
                    "info",
                    `Role permissions: ${user?.role || "Admin"} workspace.`,
                  )
                }
                className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted/50 transition-all shadow-sm bg-transparent"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-border">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tab Bar ──────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center overflow-x-auto no-scrollbar">
        {profileTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-[14px] text-[14px] transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab
                ? "bg-secondary text-primary font-black shadow-sm"
                : "text-muted-foreground font-bold hover:text-foreground hover:bg-background"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ──────────────────────────────────────────── */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Personal Info" && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT (65%) */}
                <div className="lg:w-[65%] space-y-8">
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        PERSONAL DETAILS
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="First Name"
                        value={firstName}
                        onChange={setFirstName}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Last Name"
                        value={lastName}
                        onChange={setLastName}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Email Address"
                        value={email}
                        onChange={setEmail}
                        icon={<Mail size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Phone Number"
                        value={phone}
                        onChange={setPhone}
                        icon={<Phone size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Location"
                        value={location}
                        onChange={setLocation}
                        icon={<MapPin size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Date Joined"
                        value="March 12, 2018"
                        icon={<Calendar size={14} />}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Bio Card */}
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        BIO
                      </h3>
                    </div>
                    <textarea
                      disabled={!isEditing}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] disabled:opacity-70 disabled:cursor-not-allowed custom-scrollbar resize-none"
                    />
                  </div>
                </div>

                {/* RIGHT (35%) */}
                <div className="lg:w-[35%] space-y-8">
                  {/* Skills & Expertise */}
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        SKILLS & EXPERTISE
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {activeSkills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-primary text-[12px] font-black border border-primary/10 shadow-sm transition-all hover:scale-105"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-full p-0.5 transition-colors flex items-center justify-center border-none bg-transparent text-primary"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <input
                        type="text"
                        placeholder="Add skill and press Enter..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold"
                      />
                    )}
                  </div>

                  {/* Online Presence */}
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        ONLINE PRESENCE
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <InputField
                        label="Website"
                        value={website}
                        onChange={setWebsite}
                        icon={<Globe size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="LinkedIn"
                        value={linkedin}
                        onChange={setLinkedin}
                        icon={<Linkedin size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Twitter"
                        value={twitter}
                        onChange={setTwitter}
                        icon={<Twitter size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="GitHub"
                        value={github}
                        onChange={setGithub}
                        icon={<Github size={14} />}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Employment" && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT (65%) */}
                <div className="lg:w-[65%] space-y-8">
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        PROFESSIONAL DETAILS
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Job Title"
                        value={jobTitle}
                        onChange={setJobTitle}
                        icon={<Briefcase size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Department"
                        value={department}
                        onChange={setDepartment}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Employee ID"
                        value="EMP-0001"
                        disabled
                      />
                      <InputField
                        label="Reports To"
                        value={reportsTo}
                        onChange={setReportsTo}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT (35%) */}
                <div className="lg:w-[35%] space-y-8">
                  {/* Role Badge Card */}
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #059669, #14B8A6)",
                        }}
                      >
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-[13px]">
                          {user?.role || "HR Manager"}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Full Access
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl p-3 bg-[#059669]/10 border border-[#059669]/20">
                      <p className="text-[#059669] text-[12px] font-bold mb-1">
                        Access Level: Admin
                      </p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Full read/write access to all modules including payroll,
                        recruitment, and settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Recent Activity" && (
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                  <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    RECENT ACTIVITY
                  </h3>
                </div>
                <div className="flex flex-col gap-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div
                        className="w-4.5 h-4.5 rounded-full border-4 border-card flex items-center justify-center absolute -left-[23px] top-1"
                        style={{
                          backgroundColor:
                            activityTypeColor[log.type] || "var(--primary)",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <div>
                        <p className="text-foreground text-[13px] font-bold leading-normal">
                          {log.action}
                        </p>
                        <p className="text-muted-foreground text-[11px] mt-1">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Settings sidebar */}
                <div className="md:w-60 bg-card rounded-2xl p-3 border border-border shadow-sm shrink-0 self-start">
                  {settingsSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSettingsSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-none text-left cursor-pointer mb-1 ${
                        activeSettingsSection === sec.id
                          ? "bg-secondary text-primary font-black shadow-sm"
                          : "text-muted-foreground font-bold hover:text-foreground hover:bg-background"
                      }`}
                    >
                      <sec.icon size={15} />
                      <span className="text-[13px]">{sec.label}</span>
                    </button>
                  ))}
                </div>

                {/* Settings Content Card */}
                <div className="flex-1 bg-card rounded-2xl p-8 border border-border shadow-sm min-h-[400px]">
                  {activeSettingsSection === "company" && (
                    <div>
                      <h3 className="text-foreground text-[16px] font-bold mb-1">
                        Company Information
                      </h3>
                      <p className="text-muted-foreground text-[13px] mb-6">
                        Update your organization details and preferences.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Company Name"
                          value="viyanHR Technologies"
                        />
                        <InputField
                          label="Industry"
                          value="Software & Technology"
                        />
                        <InputField
                          label="Email"
                          value="hr@viyanhr.com"
                          icon={<Mail size={14} />}
                        />
                        <InputField
                          label="Phone"
                          value="+1 (800) 123-4567"
                          icon={<Phone size={14} />}
                        />
                        <div className="md:col-span-2">
                          <InputField
                            label="Headquarters"
                            value="1000 Innovation Drive, San Francisco, CA 94105"
                            icon={<MapPin size={14} />}
                          />
                        </div>
                        <InputField
                          label="Website"
                          value="www.viyanhr.com"
                          icon={<Globe size={14} />}
                        />
                        <InputField label="Founded Year" value="2018" />
                        <div className="md:col-span-2 flex flex-col gap-2">
                          <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
                            Company Description
                          </label>
                          <textarea
                            defaultValue="viyanHR is a leading enterprise HR management platform empowering organizations to manage their most valuable assets — their people."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[100px] resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => {
                            setSaved(true);
                            showToast(
                              "Company Info",
                              "success",
                              "Company settings saved successfully.",
                            );
                            setTimeout(() => setSaved(false), 3000);
                          }}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:scale-[1.02] border-none cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(135deg, #059669, #047857)",
                            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                          }}
                        >
                          <Save size={14} />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {activeSettingsSection === "account" && (
                    <div>
                      <h3 className="text-foreground text-[16px] font-bold mb-1">
                        Account Settings
                      </h3>
                      <p className="text-muted-foreground text-[13px] mb-6">
                        Manage your personal profile information and
                        preferences.
                      </p>

                      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-background border border-border">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center relative shadow-md"
                          style={{
                            background:
                              "linear-gradient(135deg, #059669, #14B8A6)",
                          }}
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-white text-[20px] font-black">
                              {avatarInitials}
                            </span>
                          )}
                          <div
                            className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                            style={{
                              background: "var(--primary)",
                              border: "2px solid var(--card)",
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera size={9} color="white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-foreground text-[15px] font-bold">
                            {fullName}
                          </p>
                          <p className="text-muted-foreground text-[13px]">
                            {jobTitle}
                          </p>
                        </div>
                        <button
                          className="ml-auto px-4 py-2 rounded-xl text-[13px] font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Photo
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <InputField
                          label="First Name"
                          value={firstName}
                          onChange={setFirstName}
                        />
                        <InputField
                          label="Last Name"
                          value={lastName}
                          onChange={setLastName}
                        />
                        <InputField
                          label="Email Address"
                          value={email}
                          onChange={setEmail}
                          icon={<Mail size={14} />}
                        />
                        <InputField
                          label="Phone Number"
                          value={phone}
                          onChange={setPhone}
                          icon={<Phone size={14} />}
                        />
                        <InputField
                          label="Job Title"
                          value={jobTitle}
                          onChange={setJobTitle}
                          icon={<Briefcase size={14} />}
                          disabled
                        />
                        <InputField
                          label="Location"
                          value={location}
                          onChange={setLocation}
                          icon={<MapPin size={14} />}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:scale-[1.02] border-none cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(135deg, #059669, #047857)",
                            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                          }}
                        >
                          <Save size={14} />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {activeSettingsSection === "notifications" && (
                    <div>
                      <h3 className="text-foreground text-[16px] font-bold mb-1">
                        Notification Preferences
                      </h3>
                      <p className="text-muted-foreground text-[13px] mb-6">
                        Control which alerts and updates you receive.
                      </p>
                      <Toggle
                        label="New Employee Onboarding"
                        desc="Get notified when a new employee joins"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Leave Requests"
                        desc="Alerts for pending leave approvals"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Payroll Processed"
                        desc="Confirmation when payroll is run"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Performance Reviews"
                        desc="Reminders for upcoming review cycles"
                        defaultOn={false}
                      />
                      <Toggle
                        label="Recruitment Updates"
                        desc="Candidate stage changes and new applications"
                        defaultOn={true}
                      />
                      <Toggle
                        label="System Alerts"
                        desc="Critical system notifications and errors"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Email Digest"
                        desc="Weekly summary sent to your email"
                        defaultOn={false}
                      />
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() =>
                            showToast(
                              "Preferences",
                              "success",
                              "Notification preferences updated.",
                            )
                          }
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] border-none cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(135deg, #059669, #047857)",
                            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                          }}
                        >
                          <Save size={14} />
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  )}

                  {activeSettingsSection === "security" && (
                    <div>
                      <h3 className="text-foreground text-[16px] font-bold mb-1">
                        Security & Privacy
                      </h3>
                      <p className="text-muted-foreground text-[13px] mb-6">
                        Manage your password, 2FA, and active sessions.
                      </p>

                      <div className="rounded-xl p-6 mb-6 bg-background border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Key size={15} className="text-emerald-600" />
                          <h4 className="text-foreground text-[14px] font-bold">
                            Change Password
                          </h4>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider ml-1 block mb-2">
                              Current Password
                            </label>
                            <div className="flex items-center gap-2.5 rounded-xl px-4 border border-border bg-card h-11 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                              <Lock
                                size={14}
                                className="text-muted-foreground"
                              />
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="border-none bg-transparent cursor-pointer flex items-center text-muted-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider ml-1 block mb-2">
                              New Password
                            </label>
                            <div className="flex items-center gap-2.5 rounded-xl px-4 border border-border bg-card h-11 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                              <Lock
                                size={14}
                                className="text-muted-foreground"
                              />
                              <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold"
                              />
                              <button
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                className="border-none bg-transparent cursor-pointer flex items-center text-muted-foreground"
                              >
                                {showNewPassword ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </button>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4].map((n) => (
                                <div
                                  key={n}
                                  className="flex-1 rounded-full"
                                  style={{
                                    height: "3px",
                                    backgroundColor:
                                      n <= 2 ? "#F59E0B" : "var(--border)",
                                  }}
                                />
                              ))}
                              <span className="text-[#F59E0B] text-[10px] font-bold ml-2">
                                Medium
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            showToast(
                              "Security",
                              "success",
                              "Your password has been successfully updated.",
                            )
                          }
                          className="mt-6 px-4 py-2 rounded-xl text-white font-bold text-[13px] flex items-center gap-2 border-none cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(135deg, #059669, #047857)",
                            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                          }}
                        >
                          <Save size={13} /> Update Password
                        </button>
                      </div>

                      <Toggle
                        label="Two-Factor Authentication"
                        desc="Require 2FA for all admin accounts"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Session Timeout"
                        desc="Auto-logout after 30 minutes of inactivity"
                        defaultOn={true}
                      />
                      <Toggle
                        label="Audit Logging"
                        desc="Track all admin actions for compliance"
                        defaultOn={true}
                      />
                      <Toggle
                        label="IP Restriction"
                        desc="Only allow access from approved IPs"
                        defaultOn={false}
                      />

                      <div className="rounded-xl p-5 mt-6 border border-red-500/30 bg-red-500/5">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={15} className="text-red-500" />
                          <p className="text-red-500 text-[13px] font-bold">
                            Danger Zone
                          </p>
                        </div>
                        <p className="text-muted-foreground text-[12px] mb-4">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <button
                          onClick={() =>
                            showToast(
                              "Danger",
                              "error",
                              "Account deletion is restricted for demo environments.",
                            )
                          }
                          className="px-4 py-2 rounded-xl text-[13px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 cursor-pointer"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Save Bar (Editing Mode) ─────────────────────────────── */}
      {isEditing && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-card/40 rounded-2xl border border-border shadow-2xl p-4 flex items-center gap-6 animate-in slide-in-from-bottom-10"
        >
          <p className="text-sm font-bold text-foreground px-4 border-r border-border">
            You have unsaved changes
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-background transition-all border-none bg-transparent cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 rounded-xl bg-primary text-white font-black shadow-xl shadow-[#00B87C]/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
