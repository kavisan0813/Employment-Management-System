import { useState, useRef, useEffect } from "react";
import {
  User,
  Camera,
  MapPin,
  X,
  Plus,
  Mail,
  Phone,
  Linkedin,
  Github,
  Download,
  Check,
  ChevronDown,
  Info,
  Lock,
  Calendar,
  AlertTriangle,
  Star,
  Briefcase,
  TrendingUp,
  MessageSquare,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../components/workflow/ToastNotification";
import { useAuth } from "../../context/AuthContext";

type ProfileTab =
  | "Personal Info"
  | "Employment"
  | "Documents"
  | "Emergency Contact"
  | "Preferences";

interface SkillItem {
  id: string;
  name: string;
  isCustom?: boolean;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export function ManagerProfile() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal Info");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Form States (Personal Details) ---
  const [fullName, setFullName] = useState(() => user?.name || "Suresh Iyer");
  const [dob, setDob] = useState("1985-07-22");
  const [gender, setGender] = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [maritalStatus, setMaritalStatus] = useState("Married");
  const [nationality, setNationality] = useState("Indian");

  // --- Form States (Contact) ---
  const [personalEmail, setPersonalEmail] = useState(
    () => user?.email || "suresh.iyer@gmail.com",
  );
  const [mobileNumber, setMobileNumber] = useState("+91 99887 76655");
  const [alternatePhone, setAlternatePhone] = useState("+91 98001 12233");
  const [linkedinUrl, setLinkedinUrl] = useState("linkedin.com/in/suresh-iyer");
  const [githubUrl, setGithubUrl] = useState("github.com/sureshiyer");
  const [currentAddress, setCurrentAddress] = useState(
    "42, Nungambakkam High Road, Chennai 600034, Tamil Nadu",
  );

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`nexus_avatar_${user.email}`);
      if (saved) {
        setAvatarPreview(saved);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPersonalEmail(user.email);
    }
  }, [user]);

  const avatarInitials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "SI";

  // --- Skills State ---
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: "1", name: "System Architecture" },
    { id: "2", name: "Team Leadership" },
    { id: "3", name: "React.js" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "AWS" },
    { id: "6", name: "Agile/Scrum" },
    { id: "7", name: "Technical Recruiting" },
    { id: "8", name: "Code Review" },
  ]);
  const [newSkillText, setNewSkillText] = useState("");
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // --- Bio State ---
  const [bio, setBio] = useState(
    "Engineering Manager with 7+ years of experience leading high-performance tech teams. Passionate about building scalable systems and mentoring developers.",
  );

  // --- Emergency Contacts State ---
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      name: "Priya Iyer",
      relationship: "Spouse",
      phone: "+91 98001 11122",
      email: "priya.iyer@email.com",
      address: "42, Nungambakkam High Road, Chennai 600034, Tamil Nadu",
    },
  ]);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(true);

  // --- Preferences State ---
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: true,
    leaveReminders: true,
    teamDigests: true,
    performanceReminders: true,
    announcements: false,
  });
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [preferredLanguage, setPreferredLanguage] = useState("English (India)");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");

  // --- Password State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          setAvatarPreview(base64);
          if (user?.email) {
            localStorage.setItem(`nexus_avatar_${user.email}`, base64);
          }
          showToast(
            "Profile Picture",
            "success",
            "Your photo has been uploaded successfully.",
          );
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddSkill = () => {
    if (newSkillText.trim()) {
      setSkills((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: newSkillText.trim(),
          isCustom: true,
        },
      ]);
      setNewSkillText("");
      setShowAddSkillInput(false);
      showToast(
        "Skill Added",
        "success",
        `"${newSkillText.trim()}" added to your expertise.`,
      );
    }
  };

  const handleAddContact = () => {
    setContacts((prev) => [
      ...prev,
      {
        name: "",
        relationship: "",
        phone: "",
        email: "",
        address: sameAsCurrentAddress ? currentAddress : "",
      },
    ]);
    showToast(
      "Contact Form Added",
      "info",
      "Please fill in the emergency contact details.",
    );
  };

  const handleContactChange = (
    index: number,
    field: keyof EmergencyContact,
    value: string,
  ) => {
    setContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAllChanges = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: fullName,
        email: personalEmail,
        initials:
          fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "SI",
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

    setIsEditing(false);
    showToast(
      "Profile Saved",
      "success",
      "Your profile details have been securely updated.",
    );
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    // In a real application, you would revert state to last fetched database values here
    showToast("Changes Discarded", "info", "Edits have been reverted.");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast(
        "Verification Failed",
        "error",
        "Please fill out all password fields.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(
        "Mismatch Error",
        "error",
        "Confirm password does not match new password.",
      );
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast(
      "Password Secure",
      "success",
      "Your account security credentials have been updated.",
    );
  };

  const handleDeactivateConfirm = () => {
    setShowDeactivateModal(false);
    showToast(
      "Action Restricted",
      "error",
      "Deactivation request has been sent to HR for verification.",
    );
  };

  const handleThemeChange = (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme);
    const root = window.document.documentElement;
    localStorage.setItem("theme", selectedTheme);

    let isDarkTheme: boolean;
    if (selectedTheme === "system") {
      isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDarkTheme = selectedTheme === "dark";
    }

    if (isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    showToast(
      "Theme Preference",
      "info",
      `Switched display theme to ${selectedTheme}.`,
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 space-y-6 animate-in fade-in duration-500">
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
              {/* Avatar Section */}
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
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Name & Title Content */}
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
                  {"Engineering Manager"}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    #EMP-0042
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Engineering
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <MapPin size={13} /> Chennai, India
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <Calendar size={13} /> Since Jan 2019
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Full-time
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex items-center gap-3 mb-2 shrink-0 justify-center w-full md:w-auto">
              <button
                onClick={() =>
                  showToast(
                    "Message System",
                    "info",
                    "Routing to HR correspondence desk...",
                  )
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm bg-transparent"
              >
                <MessageSquare size={16} />
                Message HR
              </button>
              {!isEditing ? (
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
                    onClick={handleCancelChanges}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAllChanges}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] transition-all"
                  >
                    Save
                  </button>
                </div>
              )}
              <button
                onClick={() =>
                  showToast(
                    "Quick Actions",
                    "info",
                    "Profile settings options details loading...",
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
            <div className="flex items-center gap-4 px-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: "rgba(5,150,105,0.1)",
                  color: "#059669",
                }}
              >
                <Briefcase size={22} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">
                  7.2 yrs
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Tenure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: "rgba(20,184,166,0.1)",
                  color: "#14B8A6",
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">
                  94%
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Attendance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: "rgba(245,158,11,0.1)",
                  color: "#F59E0B",
                }}
              >
                <Star size={22} fill="currentColor" />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">
                  4.6★
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Rating
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: "rgba(34,197,94,0.1)",
                  color: "#22C55E",
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">
                  1,048
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Tasks Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation Bar ───────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
        {(
          [
            "Personal Info",
            "Employment",
            "Documents",
            "Emergency Contact",
            "Preferences",
          ] as ProfileTab[]
        ).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-widest uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                active
                  ? "bg-[#00B87C] text-white font-bold shadow-md shadow-emerald-500/15"
                  : "text-[#6B7280] hover:text-[#374151] hover:bg-muted/50"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Panel Content ────────────────────────────────────── */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Personal Info" && (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column (60%) */}
                <div className="lg:w-[60%] space-y-6">
                  {/* Personal Details */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>Personal Details</SectionLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                      <InputField
                        label="Full Name"
                        value={fullName}
                        onChange={setFullName}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Date of Birth"
                        value={dob}
                        onChange={setDob}
                        type="date"
                        disabled={!isEditing}
                      />
                      <DropdownField
                        label="Gender"
                        value={gender}
                        onChange={setGender}
                        options={["Male", "Female", "Other"]}
                        disabled={!isEditing}
                      />
                      <DropdownField
                        label="Blood Group"
                        value={bloodGroup}
                        onChange={setBloodGroup}
                        options={[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "O+",
                          "O-",
                          "AB+",
                          "AB-",
                        ]}
                        disabled={!isEditing}
                      />
                      <DropdownField
                        label="Marital Status"
                        value={maritalStatus}
                        onChange={setMaritalStatus}
                        options={["Single", "Married", "Divorced", "Widowed"]}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Nationality"
                        value={nationality}
                        onChange={setNationality}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>Contact Information</SectionLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                      <InputField
                        label="Personal Email"
                        value={personalEmail}
                        onChange={setPersonalEmail}
                        icon={<Mail size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Mobile Number"
                        value={mobileNumber}
                        onChange={setMobileNumber}
                        icon={<Phone size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="Alternate Phone"
                        value={alternatePhone}
                        onChange={setAlternatePhone}
                        icon={<Phone size={14} />}
                        disabled={!isEditing}
                      />
                      <InputField
                        label="LinkedIn"
                        value={linkedinUrl}
                        onChange={setLinkedinUrl}
                        icon={<Linkedin size={14} />}
                        disabled={!isEditing}
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="GitHub"
                          value={githubUrl}
                          onChange={setGithubUrl}
                          icon={<Github size={14} />}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Address */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>Current Address</SectionLabel>
                    <div className="mt-5">
                      <textarea
                        value={currentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-24 bg-muted/30 border border-border rounded-2xl p-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 transition-all resize-none disabled:opacity-75"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column (40%) */}
                <div className="lg:w-[40%] space-y-6">
                  {/* Skills & Expertise */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>Skills & Expertise</SectionLabel>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3.5 py-1.5 rounded-xl border border-emerald-500/10 bg-[#DCFCE7] dark:bg-emerald-950/20 text-[#00B87C] text-[12px] font-bold tracking-wide"
                        >
                          {skill.name}
                        </span>
                      ))}

                      {/* Add Skill Button/Input */}
                      {isEditing && (
                        <div className="inline-flex items-center gap-1">
                          {showAddSkillInput ? (
                            <div className="flex items-center gap-1.5 bg-muted/60 border border-border rounded-xl px-2.5 py-1 w-[180px]">
                              <input
                                type="text"
                                value={newSkillText}
                                onChange={(e) =>
                                  setNewSkillText(e.target.value)
                                }
                                placeholder="Enter skill..."
                                className="bg-transparent border-none outline-none text-[11px] font-bold w-full text-foreground"
                              />
                              <button
                                onClick={handleAddSkill}
                                className="w-5 h-5 rounded-md bg-[#00B87C] text-white flex items-center justify-center hover:opacity-95"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddSkillInput(true)}
                              className="px-3.5 py-1.5 rounded-xl border border-dashed border-border text-muted-foreground text-[12px] font-bold hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-1"
                            >
                              <Plus size={14} /> Add Skill
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>Languages</SectionLabel>
                    <div className="space-y-3 mt-5">
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-[#DCFCE7] dark:bg-emerald-950/20">
                        <span className="text-[13px] font-bold text-foreground">
                          English
                        </span>
                        <span className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider">
                          Native
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-teal-500/10 bg-teal-500/5">
                        <span className="text-[13px] font-bold text-foreground">
                          Hindi
                        </span>
                        <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          Fluent
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5">
                        <span className="text-[13px] font-bold text-foreground">
                          Tamil
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Conversational
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* About / Bio */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <SectionLabel>About / Bio</SectionLabel>
                    <div className="mt-5 space-y-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 500))}
                        disabled={!isEditing}
                        maxLength={500}
                        className="w-full h-36 bg-muted/30 border border-border rounded-2xl p-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 transition-all resize-none disabled:opacity-75 custom-scrollbar"
                      />
                      <p className="text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider pr-1">
                        {bio.length} / 500
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Employment Tab */}
            {activeTab === "Employment" && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
                  <SectionLabel>HR Managed Information</SectionLabel>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider shadow-inner">
                    <Info size={14} /> HR Admin Secure
                  </div>
                </div>

                {/* Soft Emerald Policy Banner */}
                <div className="flex gap-4 p-5 bg-[#F0FDF4] dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-emerald-900 flex items-center justify-center shadow-sm shrink-0 text-[#00B87C]">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-emerald-800 dark:text-emerald-300 leading-snug">
                      HR Administration Policy
                    </p>
                    <p className="text-[12px] font-bold text-emerald-700/80 dark:text-emerald-400/80 mt-0.5 leading-relaxed">
                      These details are managed by HR. Contact HR to request
                      changes or file structural modifications.
                    </p>
                  </div>
                </div>

                {/* 2-col Read-Only Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12 mt-4">
                  <ReadOnlyField label="Employee ID" value="#EMP-0042" />
                  <ReadOnlyField
                    label="Designation"
                    value="Engineering Manager"
                  />
                  <ReadOnlyField label="Department" value="Engineering" />
                  <ReadOnlyField
                    label="Reporting Manager"
                    value="Robert Chen (VP Engineering)"
                  />
                  <ReadOnlyField label="Employment Type" value="Full-time" />
                  <ReadOnlyField
                    label="Work Mode"
                    value="Hybrid (3 days office)"
                  />
                  <ReadOnlyField label="Office Location" value="HQ, Chennai" />
                  <ReadOnlyField
                    label="Joining Date"
                    value="January 15, 2019"
                  />
                  <ReadOnlyField
                    label="Probation End Date"
                    value="July 15, 2019"
                  />
                  <ReadOnlyField label="Notice Period" value="90 days" />
                  <ReadOnlyField label="Cost Center" value="ENG-001" />
                  <ReadOnlyField label="Grade/Band" value="Manager Level 2" />
                </div>

                {/* Reporting Structure Mini Org Chart */}
                <div className="pt-8 border-t border-border mt-10">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                    Reporting Structure
                  </p>
                  <div className="flex flex-col items-center py-4 bg-muted/10 rounded-3xl border border-border/40 max-w-lg mx-auto">
                    {/* VP */}
                    <div className="px-5 py-3 rounded-2xl bg-card border border-border shadow-sm text-center min-w-[220px]">
                      <p className="text-[13px] font-bold text-foreground">
                        Robert Chen
                      </p>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                        VP Engineering
                      </p>
                    </div>

                    {/* Line Down */}
                    <div className="w-0.5 h-8 bg-[#00B87C]/60" />

                    {/* Suresh Iyer */}
                    <div className="px-5 py-3 rounded-2xl bg-[#00B87C] border border-[#00B87C] shadow-lg shadow-emerald-500/10 text-center min-w-[220px] relative">
                      <p className="text-[13px] font-bold text-white">
                        Suresh Iyer
                      </p>
                      <p className="text-[11px] font-bold text-emerald-100/90 uppercase tracking-wider mt-0.5">
                        Engineering Manager
                      </p>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    {/* Line Down */}
                    <div className="w-0.5 h-8 bg-border" />

                    {/* Direct Reports */}
                    <div className="px-5 py-3 rounded-2xl bg-muted border border-border text-center min-w-[220px]">
                      <p className="text-[13px] font-bold text-muted-foreground">
                        12 Direct Reports
                      </p>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                        Engineering Division
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "Documents" && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="pb-2 border-b border-border">
                  <SectionLabel>Employee Documents</SectionLabel>
                </div>

                <div className="space-y-6 mt-4">
                  {/* Identity */}
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Identity Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DocCard
                        name="Aadhar_Card_Verified.pdf"
                        category="Aadhar Verified"
                        size="1.2 MB"
                      />
                      <DocCard
                        name="PAN_Card_Verified.pdf"
                        category="PAN Verified"
                        size="0.9 MB"
                      />
                      <DocCard
                        name="Passport_Copy.pdf"
                        category="Passport (expires Dec 2027)"
                        size="2.4 MB"
                      />
                    </div>
                  </div>

                  {/* Employment */}
                  <div className="pt-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Employment Records
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DocCard
                        name="Offer_Letter_Signed.pdf"
                        category="Offer Letter"
                        size="3.1 MB"
                      />
                      <DocCard
                        name="Appointment_Letter.pdf"
                        category="Appointment"
                        size="4.2 MB"
                      />
                      <DocCard
                        name="NDA_Agreement.pdf"
                        category="NDA Verified"
                        size="1.5 MB"
                      />
                      <DocCard
                        name="Appraisal_Letter_2024.pdf"
                        category="Appraisal 2024"
                        size="1.8 MB"
                      />
                    </div>
                  </div>

                  {/* Educational */}
                  <div className="pt-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Educational Certificates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DocCard
                        name="BTech_Degree_Certificate.pdf"
                        category="B.Tech Degree"
                        size="5.5 MB"
                      />
                      <DocCard
                        name="MBA_Degree_Certificate.pdf"
                        category="MBA Degree"
                        size="6.2 MB"
                      />
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="pt-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Financial Certificates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DocCard
                        name="Bank_Passbook_Copy.pdf"
                        category="Bank Passbook"
                        size="1.4 MB"
                      />
                      <DocCard
                        name="Form_16_FY24-25.pdf"
                        category="Form 16"
                        size="2.8 MB"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === "Emergency Contact" && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="pb-2 border-b border-border flex items-center justify-between">
                  <SectionLabel>Emergency Contacts</SectionLabel>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="addressSync"
                        checked={sameAsCurrentAddress}
                        onChange={(e) => {
                          setSameAsCurrentAddress(e.target.checked);
                          if (e.target.checked) {
                            setContacts((prev) =>
                              prev.map((c) => ({
                                ...c,
                                address: currentAddress,
                              })),
                            );
                          }
                        }}
                        className="rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                      />
                      <label
                        htmlFor="addressSync"
                        className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer"
                      >
                        Sync with Current Address
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-8 mt-4">
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="p-5 md:p-6 rounded-2xl border border-border/80 bg-muted/10 relative"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-3.5 rounded-full bg-[#00B87C]" />
                        <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                          {index === 0
                            ? "Primary Contact"
                            : `Emergency Contact #${index + 1}`}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                          label="Contact Name"
                          value={contact.name}
                          onChange={(val) =>
                            handleContactChange(index, "name", val)
                          }
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Relationship"
                          value={contact.relationship}
                          onChange={(val) =>
                            handleContactChange(index, "relationship", val)
                          }
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Phone"
                          value={contact.phone}
                          onChange={(val) =>
                            handleContactChange(index, "phone", val)
                          }
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Email Address"
                          value={contact.email}
                          onChange={(val) =>
                            handleContactChange(index, "email", val)
                          }
                          disabled={!isEditing}
                        />
                        <div className="md:col-span-2">
                          <InputField
                            label="Address"
                            value={contact.address}
                            onChange={(val) =>
                              handleContactChange(index, "address", val)
                            }
                            disabled={!isEditing || sameAsCurrentAddress}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddContact}
                  className="flex items-center gap-2 text-[#00B87C] hover:underline font-bold text-[13px] uppercase tracking-wider pl-1 mt-2 active:scale-95 transition-all outline-none"
                >
                  + Add Another Contact
                </button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "Preferences" && (
              <div className="space-y-6">
                {/* Notification Preferences */}
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="pb-2 border-b border-border">
                    <SectionLabel>Notification Preferences</SectionLabel>
                  </div>
                  <div className="divide-y divide-border/60 mt-4">
                    <ToggleRow
                      label="Email Notifications"
                      value={preferences.email}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          email: !prev.email,
                        }))
                      }
                    />
                    <ToggleRow
                      label="Push Notifications"
                      value={preferences.push}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          push: !prev.push,
                        }))
                      }
                    />
                    <ToggleRow
                      label="SMS Alerts — Critical Only"
                      value={preferences.sms}
                      onToggle={() =>
                        setPreferences((prev) => ({ ...prev, sms: !prev.sms }))
                      }
                    />
                    <ToggleRow
                      label="Leave Approval Reminders"
                      value={preferences.leaveReminders}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          leaveReminders: !prev.leaveReminders,
                        }))
                      }
                    />
                    <ToggleRow
                      label="Team Update Digests"
                      value={preferences.teamDigests}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          teamDigests: !prev.teamDigests,
                        }))
                      }
                    />
                    <ToggleRow
                      label="Performance Review Reminders"
                      value={preferences.performanceReminders}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          performanceReminders: !prev.performanceReminders,
                        }))
                      }
                    />
                    <ToggleRow
                      label="System Announcements"
                      value={preferences.announcements}
                      onToggle={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          announcements: !prev.announcements,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Display Preferences */}
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="pb-2 border-b border-border">
                    <SectionLabel>Display Preferences</SectionLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Theme Selector */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                        Theme Mode
                      </label>
                      <div className="p-1.5 rounded-2xl bg-muted/40 border border-border flex items-center max-w-[320px]">
                        {(["light", "dark", "system"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            className={`flex-1 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all ${
                              theme === t
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <DropdownField
                      label="System Language"
                      value={preferredLanguage}
                      onChange={setPreferredLanguage}
                      options={[
                        "English (India)",
                        "English (US)",
                        "English (UK)",
                        "Hindi",
                        "Tamil",
                      ]}
                      disabled={false}
                    />
                    <DropdownField
                      label="Date Format"
                      value={dateFormat}
                      onChange={setDateFormat}
                      options={["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]}
                      disabled={false}
                    />
                  </div>
                </div>

                {/* Security Actions */}
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="pb-2 border-b border-border">
                    <SectionLabel>Account Security</SectionLabel>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C] shadow-inner">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-foreground tracking-tight">
                          Security Credentials
                        </p>
                        <p className="text-[12px] font-bold text-muted-foreground">
                          Keep your password robust and updated regularly
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-6 py-3 rounded-xl border border-border text-foreground font-bold text-[12px] uppercase tracking-wider hover:bg-muted/50 transition-all shadow-sm active:scale-95"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-[14px] font-bold text-foreground">
                        Deactivate Profile Account
                      </p>
                      <p className="text-[12px] font-medium text-muted-foreground leading-relaxed max-w-md mt-0.5">
                        This action will lock your access and notify HR. Profile
                        files will remain archived under compliance rules.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeactivateModal(true)}
                      className="text-red-500 hover:text-red-600 hover:underline font-bold text-[12px] uppercase tracking-wider active:scale-95 pl-1 transition-all outline-none shrink-0"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom Floating Save Bar (Editing Mode) ──────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-6 px-6 py-4 rounded-2xl bg-card border border-border shadow-2xl ring-1 ring-black/5 min-w-[340px] md:min-w-[480px]"
          >
            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider hidden md:inline-block pl-2">
              Unsaved Changes!
            </span>
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={handleCancelChanges}
                className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground font-bold text-[12px] uppercase tracking-wider hover:bg-muted/50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAllChanges}
                className="px-8 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Change Password Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-muted-foreground hover:bg-muted/60 transition-all outline-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
                  <Lock size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-foreground tracking-tight">
                  Change Password
                </h3>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-bold text-[12px] uppercase tracking-wider hover:bg-muted/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-wider hover:opacity-95 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Deactivate Confirmation Modal ───────────────────────── */}
      <AnimatePresence>
        {showDeactivateModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-muted-foreground hover:bg-muted/60 transition-all outline-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle size={24} />
                <h3 className="text-[18px] font-bold text-foreground tracking-tight">
                  Confirm Deactivation
                </h3>
              </div>

              <p className="text-[13px] font-bold text-muted-foreground leading-relaxed mb-6">
                Are you sure you want to deactivate your profile? This will
                immediately restrict your system access and suspend all pending
                task workflows. Deactivation is subject to HR clearance.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-bold text-[12px] uppercase tracking-wider hover:bg-muted/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateConfirm}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[12px] uppercase tracking-wider hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
                >
                  Confirm Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MINI SUB-COMPONENTS ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 rounded-full bg-[#00B87C]" />
      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  disabled: boolean;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  icon,
  disabled,
}: InputFieldProps) {
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
          onChange={(e) => onChange(e.target.value)}
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

interface DropdownFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  disabled: boolean;
}

function DropdownField({
  label,
  value,
  onChange,
  options,
  disabled,
}: DropdownFieldProps) {
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
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold appearance-none disabled:cursor-not-allowed cursor-pointer"
          style={{
            WebkitTextFillColor: "var(--foreground)",
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none text-muted-foreground shrink-0 flex items-center">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
        {label}
      </p>
      <p className="text-[15px] font-bold text-foreground tracking-tight ml-1">
        {value}
      </p>
    </div>
  );
}

function DocCard({
  name,
  category,
  size,
}: {
  name: string;
  category: string;
  size: string;
}) {
  return (
    <div
      onClick={() =>
        showToast("File Download", "success", `Downloading file: "${name}"`)
      }
      className="p-4 rounded-2xl border border-border bg-muted/10 flex items-center justify-between gap-4 hover:border-[#00B87C]/40 hover:bg-[#00B87C]/5 transition-all cursor-pointer group shadow-sm"
    >
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-foreground truncate group-hover:text-[#00B87C] transition-colors">
          {category}
        </p>
        <p className="text-[11px] font-bold text-muted-foreground truncate mt-0.5">
          {name} • {size}
        </p>
      </div>
      <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:bg-[#00B87C]/15 group-hover:text-[#00B87C] transition-all shadow-sm">
        <Download size={15} />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div>
        <p className="text-[14px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors">
          {label}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
          value ? "bg-[#00B87C]" : "bg-muted-foreground/20"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
