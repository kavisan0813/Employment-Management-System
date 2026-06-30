import { useState, useRef, useEffect } from "react";
import {
  User,
  Camera,
  MapPin,
  Edit3,
  X,
  Shield,
  AlertCircle,
  FileText,
  Plus,
  ShieldAlert,
  ChevronRight,
  Paperclip,
  Briefcase,
  TrendingUp,
  Star,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { DocumentPreviewContent } from "./EmployeeDocuments";

const TABS = [
  "Personal Info",
  "Onboarding",
  "Documents",
  "Assets",
  "Expenses",
];

export function EmployeeSelfProfile() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [fullName, setFullName] = useState(() => user?.name || "Priya Sharma");
  const [email, setEmail] = useState(
    () => user?.email || "priya.sharma@gmail.com",
  );

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const avatarInitials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "PS";
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`nexus_avatar_${user.email}`);
      if (saved) {
        setAvatarPreview(saved);
      }
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
            localStorage.setItem(`nexus_avatar_${user.email}`, base64);
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

  const handleSave = () => {
    if (user) {
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
            .slice(0, 2) || "PS",
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
      "Profile Updated",
      "success",
      "Your changes have been saved successfully.",
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-20 text-foreground">
      <AnimatePresence>
        {showUpdateModal && (
          <ProfileUpdateModal onClose={() => setShowUpdateModal(false)} />
        )}
      </AnimatePresence>

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
                onClick={() => {
                  fileInputRef.current?.click();
                }}
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
                  {"Senior Frontend Developer"}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    #EMP-0142
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Engineering
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <MapPin size={13} /> Chennai, India
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <Calendar size={13} /> Since Mar 2021
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Full-time
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-2 shrink-0 justify-center w-full md:w-auto">
              <button
                onClick={() => setShowUpdateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm bg-transparent"
              >
                <Edit3 size={16} />
                Request Update
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
              )}
              <button
                onClick={() =>
                  showToast(
                    "Info",
                    "info",
                    "Role permissions: Employee workspace.",
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
                  4.2 yrs
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
                  92%
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
                  4.5★
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
                  924
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Tasks Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Bar ──────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
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
              <PersonalTab
                isEditing={isEditing}
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
              />
            )}
            {activeTab === "Onboarding" && (
              <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm flex flex-col gap-3">
                <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">My Onboarding Journey</h3>
                <p className="text-[13px] font-semibold text-muted-foreground">Onboarding tasks, stages, and checklist details will be displayed here.</p>
                <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[#00B87C] font-black text-xs uppercase tracking-widest rounded-lg w-fit">Coming Soon</div>
              </div>
            )}
            {activeTab === "Documents" && <DocumentsTab />}
            {activeTab === "Assets" && (
              <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm flex flex-col gap-3">
                <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">My Assigned Assets</h3>
                <p className="text-[13px] font-semibold text-muted-foreground">Details of assets, hardware, and inventory assigned to you will be shown here.</p>
                <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[#00B87C] font-black text-xs uppercase tracking-widest rounded-lg w-fit">Coming Soon</div>
              </div>
            )}
            {activeTab === "Expenses" && (
              <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm flex flex-col gap-3">
                <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">My Expenses</h3>
                <p className="text-[13px] font-semibold text-muted-foreground">Reimbursement requests, expense claims, and status updates will be displayed here.</p>
                <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[#00B87C] font-black text-xs uppercase tracking-widest rounded-lg w-fit">Coming Soon</div>
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
              className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-background transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 rounded-xl bg-primary text-white font-black shadow-xl shadow-[#00B87C]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// --- Sub-components for Tabs ---

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1.5 h-5 bg-primary rounded-full"></div>
      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  disabled: boolean;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
  onChange?: (val: string) => void;
}

function InputField({
  label,
  value,
  disabled,
  placeholder = "",
  type = "text",
  isTextarea = false,
  onChange,
}: InputFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLocalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          disabled={disabled}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] disabled:opacity-70 disabled:cursor-not-allowed custom-scrollbar resize-none"
        />
      ) : (
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 bg-background border border-border h-12 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5"
          style={{
            opacity: disabled ? 0.7 : 1,
          }}
        >
          <input
            type={type}
            disabled={disabled}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold disabled:cursor-not-allowed"
            style={{
              WebkitTextFillColor: "var(--foreground)",
            }}
          />
        </div>
      )}
    </div>
  );
}

interface DropdownFieldProps {
  label: string;
  value: string;
  options: string[];
  disabled: boolean;
  onChange?: (val: string) => void;
}

function DropdownField({
  label,
  value,
  options,
  disabled,
  onChange,
}: DropdownFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e.target.value);
  };

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
          value={localValue}
          onChange={handleChange}
          className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold appearance-none disabled:cursor-not-allowed cursor-pointer"
          style={{
            WebkitTextFillColor: "var(--foreground)",
          }}
        >
          {options.map((opt: string) => (
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

function PersonalTab({
  isEditing,
  fullName,
  setFullName,
  email,
  setEmail,
}: {
  isEditing: boolean;
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT (65%) */}
      <div className="lg:w-[65%] space-y-8">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <Label>PERSONAL DETAILS</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              disabled={!isEditing}
            />
            <InputField
              label="Date of Birth"
              value="1995-08-15"
              type="date"
              disabled={!isEditing}
            />
            <DropdownField
              label="Gender"
              value="Female"
              options={["Male", "Female", "Other"]}
              disabled={!isEditing}
            />
            <DropdownField
              label="Blood Group"
              value="O+"
              options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
              disabled={!isEditing}
            />
            <DropdownField
              label="Marital Status"
              value="Single"
              options={["Single", "Married", "Divorced"]}
              disabled={!isEditing}
            />
            <InputField
              label="Nationality"
              value="Indian"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <Label>CONTACT INFORMATION</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Personal Email"
              value={email}
              onChange={setEmail}
              disabled={!isEditing}
            />
            <InputField
              label="Mobile Number"
              value="+91 98765 43210"
              disabled={!isEditing}
            />
            <InputField
              label="Alternate Phone"
              value=""
              placeholder="Enter number"
              disabled={!isEditing}
            />
            <InputField
              label="LinkedIn"
              value="linkedin.com/in/priya-sharma"
              disabled={!isEditing}
            />
            <div className="md:col-span-2">
              <InputField
                label="Current Address"
                value="Flat 402, Green Meadows Apartment, Velachery, Chennai - 600042"
                isTextarea
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (35%) */}
      <div className="lg:w-[35%] space-y-8">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <Label>SKILLS & EXPERTISE</Label>
          <div className="flex flex-wrap gap-2.5">
            {[
              "React",
              "Node.js",
              "PostgreSQL",
              "Docker",
              "AWS",
              "TypeScript",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-2 rounded-xl bg-secondary text-primary text-[12px] font-black border border-primary/10 shadow-sm transition-all hover:scale-105"
              >
                {skill}
              </span>
            ))}
            {isEditing && (
              <button className="px-3.5 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-[12px] font-black hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                + Add Skill
              </button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <Label>LANGUAGES</Label>
          <div className="space-y-4">
            {[
              { lang: "English", prof: "Native" },
              { lang: "Hindi", prof: "Fluent" },
              { lang: "Tamil", prof: "Conversational" },
            ].map((l) => (
              <div
                key={l.lang}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
              >
                <span className="text-[14px] font-black text-foreground">
                  {l.lang}
                </span>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-md">
                  {l.prof}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <Label>BIO / ABOUT</Label>
          <InputField
            label="Tell about yourself"
            value="Passionate senior frontend developer with 5+ years of experience in building enterprise-grade web applications. Expert in React ecosystem and focused on crafting premium user experiences."
            isTextarea
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}

export function EmploymentTab() {
  const fields = [
    { label: "Employee ID", value: "#EMP-0142" },
    { label: "Designation", value: "Senior Frontend Developer" },
    { label: "Department", value: "Engineering" },
    { label: "Manager", value: "Arjun Reddy" },
    { label: "Employment Type", value: "Full-time" },
    { label: "Work Mode", value: "Hybrid (Chennai)" },
    { label: "Location", value: "Chennai, India" },
    { label: "Joining Date", value: "15-03-2021" },
    { label: "Probation End Date", value: "15-09-2021" },
    { label: "Notice Period", value: "60 Days" },
    { label: "Cost Center", value: "CC-TECH-04" },
  ];

  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <div className="flex items-center gap-4 mb-10 p-5 bg-primary/10 rounded-2xl border border-primary/20">
        <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center text-primary shadow-sm shrink-0">
          <AlertCircle size={24} />
        </div>
        <p className="text-[14px] font-bold text-primary leading-relaxed">
          These details are managed by HR. Contact your department administrator
          to request updates to your professional profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
        {fields.map((f) => (
          <div key={f.label} className="group">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 group-hover:text-primary transition-colors">
              {f.label}
            </p>
            <p className="text-[16px] font-black text-foreground tracking-tight">
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsTab() {
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [replacingDoc, setReplacingDoc] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const docs = [
    {
      name: "Aadhar Card",
      type: "ID Proof",
      status: "Verified",
      color: "#3B82F6",
    },
    {
      name: "PAN Card",
      type: "ID Proof",
      status: "Verified",
      color: "#F59E0B",
    },
    {
      name: "Passport",
      type: "Identity",
      status: "Verified",
      color: "#8B5CF6",
    },
    {
      name: "Bank Passbook",
      type: "Finance",
      status: "Pending",
      color: "#10B981",
    },
    {
      name: "Educational Certificate",
      type: "Academics",
      status: "Verified",
      color: "#EC4899",
    },
    {
      name: "Experience Letters",
      type: "Work",
      status: "Under Review",
      color: "#6366F1",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleReplaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setReplacingDoc(null);
            setFileToUpload(null);
            showToast(
              "Replacement Successful",
              "success",
              `${replacingDoc} replacement file uploaded and queued for HR review.`,
            );
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div
            key={doc.name}
            className="bg-card rounded-2xl p-7 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-[10px] flex items-center justify-center bg-background group-hover:bg-primary/10 transition-colors shadow-inner">
                <FileText size={22} style={{ color: doc.color }} />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                  doc.status === "Verified"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : doc.status === "Pending"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }`}
              >
                {doc.status}
              </span>
            </div>
            <h4 className="text-[16px] font-black text-foreground mb-1 group-hover:text-primary transition-colors">
              {doc.name}
            </h4>
            <p className="text-[13px] font-bold text-muted-foreground mb-8 uppercase tracking-wide">
              {doc.type}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setViewingDoc(doc.name)}
                className="flex-1 py-3 rounded-xl bg-background text-foreground text-[12px] font-black border border-border hover:bg-secondary transition-all"
              >
                View
              </button>
              <button
                onClick={() => {
                  setReplacingDoc(doc.name);
                  setFileToUpload(null);
                }}
                className="flex-1 py-3 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all"
              >
                Replace
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Document View Modal --- */}
      <AnimatePresence>
        {viewingDoc && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-background/40"
              onClick={() => setViewingDoc(null)}
            />
            <div className="relative bg-card w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">
                      {viewingDoc}
                    </h3>
                    <p className="text-[11px] font-bold text-primary">
                      Preview
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center gap-6 bg-white dark:bg-card">
                <div className="w-full flex items-center justify-center p-2">
                  <DocumentPreviewContent docName={viewingDoc} />
                </div>
                <button
                  onClick={() => {
                    showToast("Downloading", "info", "File download started.");
                    setViewingDoc(null);
                  }}
                  className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-[#00B87C]/20 hover:opacity-95 transition-all"
                >
                  Download File
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Document Replace Upload Modal --- */}
      <AnimatePresence>
        {replacingDoc && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/40"
              onClick={() => {
                if (!isUploading) setReplacingDoc(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[460px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary border border-primary/20">
                    <Paperclip size={20} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-foreground">
                      Replace Document
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      {replacingDoc}
                    </p>
                  </div>
                </div>
                <button
                  disabled={isUploading}
                  onClick={() => setReplacingDoc(null)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleReplaceSubmit}
                className="p-6 space-y-6 bg-white dark:bg-card"
              >
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                    Select Replacement File
                  </label>

                  <div
                    onClick={() => {
                      if (!isUploading) fileInputRef.current?.click();
                    }}
                    className="border-2 border-dashed border-border rounded-2xl p-8 bg-secondary/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-all cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                      disabled={isUploading}
                    />
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Paperclip size={20} />
                    </div>
                    {fileToUpload ? (
                      <p className="text-[13px] font-black text-foreground text-center truncate max-w-xs">
                        {fileToUpload.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-[13px] font-black text-foreground">
                          Browse Files
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          PDF, JPG, PNG (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setReplacingDoc(null)}
                    className="flex-1 px-6 py-3.5 border border-border rounded-xl text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!fileToUpload || isUploading}
                    className="flex-1 px-6 py-3.5 bg-primary text-white rounded-xl font-black text-[13px] shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Replace File"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function EmergencyTab({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <Label>PRIMARY EMERGENCY CONTACT</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <InputField
          label="Contact Name"
          value="Rajesh Sharma"
          disabled={!isEditing}
        />
        <InputField label="Relationship" value="Father" disabled={!isEditing} />
        <InputField
          label="Phone Number"
          value="+91 98450 12345"
          disabled={!isEditing}
        />
        <InputField
          label="Email Address"
          value="rajesh.s@example.com"
          disabled={!isEditing}
        />
      </div>

      <button className="flex items-center gap-2 text-primary font-black text-[13px] hover:underline transition-all">
        <Plus size={18} /> Add Another Contact
      </button>
    </div>
  );
}

export function SettingsTab() {
  const [preferences, setPreferences] = useState({
    email: true,
    inApp: true,
    sms: false,
    leave: true,
    expense: true,
    payslip: true,
    announcements: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Verification Failed", "error", "Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mismatch Error", "error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      showToast(
        "Weak Password",
        "error",
        "Password must be at least 8 characters long.",
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

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleItem = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between py-3.5 group">
      <span className="text-[15px] font-bold text-foreground/90 group-hover:text-primary transition-colors">
        {label}
      </span>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-all relative border-2 ${
          value
            ? "bg-primary/10 border-primary"
            : "bg-secondary/50 border-border"
        }`}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all ${
            value ? "right-1 bg-primary" : "left-1 bg-muted-foreground/40"
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[60%] space-y-6">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <Label>ACCOUNT PREFERENCES</Label>

            <div className="space-y-10">
              {/* Delivery Channels */}
              <div>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
                  Delivery Channels
                </h4>
                <div className="space-y-1 divide-y divide-border/50">
                  <ToggleItem
                    label="Email Notifications"
                    value={preferences.email}
                    onToggle={() => toggle("email")}
                  />
                  <ToggleItem
                    label="In-App Notifications"
                    value={preferences.inApp}
                    onToggle={() => toggle("inApp")}
                  />
                  <ToggleItem
                    label="SMS Notifications"
                    value={preferences.sms}
                    onToggle={() => toggle("sms")}
                  />
                </div>
              </div>

              {/* Alert Types */}
              <div>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
                  Alert Types
                </h4>
                <div className="space-y-1 divide-y divide-border/50">
                  <ToggleItem
                    label="Leave Request Updates"
                    value={preferences.leave}
                    onToggle={() => toggle("leave")}
                  />
                  <ToggleItem
                    label="Expense Claim Status"
                    value={preferences.expense}
                    onToggle={() => toggle("expense")}
                  />
                  <ToggleItem
                    label="Monthly Payslip Alerts"
                    value={preferences.payslip}
                    onToggle={() => toggle("payslip")}
                  />
                  <ToggleItem
                    label="Company Announcements"
                    value={preferences.announcements}
                    onToggle={() => toggle("announcements")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-border">
              <DropdownField
                label="Preferred Language"
                value="English (US)"
                options={["English (US)", "English (UK)", "Hindi"]}
                disabled={false}
              />
              <DropdownField
                label="Timezone"
                value="(GMT+05:30) India Standard Time"
                options={["(GMT+05:30) IST", "(GMT-08:00) PST"]}
                disabled={false}
              />
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] space-y-6">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <Label>SECURITY</Label>
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full py-4 rounded-2xl border border-border text-foreground font-black text-[14px] flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-sm cursor-pointer"
            >
              <Shield size={18} className="text-primary" /> Change Password
            </button>

            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-[13px] font-black text-rose-500 mb-2 uppercase tracking-widest">
                Danger Zone
              </h4>
              <p className="text-[12px] text-muted-foreground mb-6 font-bold">
                Once you deactivate your account, there is no going back. Please
                be certain.
              </p>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[14px] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <ShieldAlert size={18} /> Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Change Password Modal --- */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/40"
              onClick={() => setShowPasswordModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[440px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col p-8 bg-white dark:bg-card"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute right-6 top-6 p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-primary border border-primary/20">
                  <Lock size={18} />
                </div>
                <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                  Change Password
                </h3>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
                    Current Password
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl px-4 bg-background border border-border h-12 transition-all focus-within:border-primary">
                    <Lock size={14} className="text-muted-foreground" />
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer flex items-center"
                    >
                      {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
                    New Password
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl px-4 bg-background border border-border h-12 transition-all focus-within:border-primary">
                    <Lock size={14} className="text-muted-foreground" />
                    <input
                      type={showNewPw ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer flex items-center"
                    >
                      {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
                    Confirm New Password
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl px-4 bg-background border border-border h-12 transition-all focus-within:border-primary">
                    <Lock size={14} className="text-muted-foreground" />
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-[13px] text-foreground font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer flex items-center"
                    >
                      {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3.5 border border-border rounded-xl text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-primary text-white rounded-xl font-black text-[13px] shadow-lg shadow-[#00B87C]/20 hover:opacity-95 transition-all cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Deactivate Account Modal --- */}
      <AnimatePresence>
        {showDeactivateModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/40"
              onClick={() => setShowDeactivateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[440px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col p-8 items-center text-center gap-6 bg-white dark:bg-card"
            >
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="absolute right-6 top-6 p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-[24px] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h3 className="text-[20px] font-black text-foreground uppercase tracking-tight mb-2">
                  Deactivate Account?
                </h3>
                <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                  Are you sure you want to deactivate your profile? This will
                  lock your account and send a verification request to HR.
                </p>
              </div>
              <div className="flex gap-4 w-full mt-2">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 py-4 bg-background border border-border rounded-2xl text-[14px] font-black text-muted-foreground hover:bg-secondary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateConfirm}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[14px] font-black hover:bg-rose-600 shadow-xl shadow-rose-500/25 transition-all cursor-pointer"
                >
                  Deactivate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
function ProfileUpdateModal({ onClose }: { onClose: () => void }) {
  const [fieldToUpdate, setFieldToUpdate] = useState("Phone");
  const [currentValue] = useState("+91 98765 43210");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      "Request Submitted",
      "success",
      "Your profile update request has been sent to HR for approval.",
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[550px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary border border-emerald-500/20 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                PROFILE UPDATE REQUEST
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                Request changes to your managed profile details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  FIELD TO UPDATE
                </label>
                <div className="relative">
                  <select
                    value={fieldToUpdate}
                    onChange={(e) => setFieldToUpdate(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none transition-all"
                  >
                    <option value="Phone" className="bg-card text-foreground">
                      Phone Number
                    </option>
                    <option value="Address" className="bg-card text-foreground">
                      Address
                    </option>
                    <option
                      value="Bank Details"
                      className="bg-card text-foreground"
                    >
                      Bank Details
                    </option>
                    <option
                      value="Emergency Contact"
                      className="bg-card text-foreground"
                    >
                      Emergency Contact
                    </option>
                    <option
                      value="Personal Info"
                      className="bg-card text-foreground"
                    >
                      Personal Information
                    </option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    CURRENT VALUE
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentValue}
                    className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-[14px] font-bold text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    NEW VALUE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-white dark:bg-card border border-border rounded-2xl px-5 py-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  REASON FOR UPDATE
                </label>
                <textarea
                  placeholder="Explain why this update is needed..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-3xl px-6 py-5 text-[15px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all min-h-[140px] resize-none"
                />
              </div>

              <div className="p-5 border-2 border-dashed border-emerald-500/10 rounded-3xl flex items-center justify-between group hover:border-primary/40 cursor-pointer transition-all bg-[#F0FDF4]/20 dark:bg-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 group-hover:text-primary transition-colors">
                    <Paperclip size={20} />
                  </div>
                  <span className="text-[14px] font-black text-slate-600 dark:text-slate-400">
                    Attach Supporting Doc (Optional)
                  </span>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  PDF, JPG
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4.5 px-8 border border-slate-200 dark:border-border rounded-2xl text-[15px] font-black text-slate-500 hover:bg-secondary transition-all uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4.5 px-8 bg-[#00B87C] text-white rounded-2xl text-[15px] font-bold uppercase tracking-wider shadow-xl shadow-[#00B87C]/25 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                SUBMIT REQUEST
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
