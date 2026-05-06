import { useState, useRef } from "react";
import {
  User,
  Camera,
  MapPin,
  Edit3,
  Save,
  X,
  Shield,
  AlertCircle,
  FileText,
  Plus,
  ShieldAlert,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  "Personal Info",
  "Employment",
  "Documents",
  "Emergency Contact",
  "Settings",
];

export function EmployeeSelfProfile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsEditing(false);
    showToast(
      "Profile Updated",
      "success",
      "Your changes have been saved successfully.",
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full pb-10">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-secondary flex items-center justify-center shadow-sm">
            <User size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            My Profile
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-95"
          >
            <Edit3 size={16} /> Request Update
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-primary/10 active:scale-95"
            >
              <User size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-border text-muted-foreground hover:bg-secondary active:scale-95"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-95"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showUpdateModal && (
          <ProfileUpdateModal onClose={() => setShowUpdateModal(false)} />
        )}
      </AnimatePresence>

      {/* ─── Profile Hero Card ────────────────────────────────────── */}
      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
        {/* Top Gradient Strip */}
        <div
          className="h-[100px] w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, #065F46 100%)",
          }}
        ></div>

        <div className="px-8 pb-8 relative">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar Section */}
            <div className="relative -mt-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-[4px] border-card bg-primary flex items-center justify-center text-white font-black text-3xl shadow-xl overflow-hidden">
                  PS
                </div>
                <div
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={24} className="text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Profile Detail Content */}
            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-[26px] font-black text-foreground tracking-tight">
                    Priya Sharma
                  </h2>
                  <p className="text-[15px] font-bold text-primary mt-0.5">
                    Senior Frontend Developer
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <span className="px-3 py-1 rounded-lg bg-secondary text-muted-foreground text-[11px] font-black uppercase tracking-wider border border-border shadow-sm">
                      #EMP-0142
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider border border-primary/20 shadow-sm">
                      Engineering
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground text-[13px] font-bold">
                      <MapPin size={14} className="text-primary" /> Chennai,
                      India
                    </span>
                    <span className="text-muted-foreground text-[13px] font-bold">
                      Since Mar 2021
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[12px] font-black text-primary uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <span className="px-4 py-1 rounded-full bg-secondary text-muted-foreground text-[11px] font-black uppercase tracking-widest border border-border shadow-sm">
                    Full-time
                  </span>
                </div>
              </div>

              {/* Stat Boxes */}
              <div className="flex items-center gap-10 mt-8 pt-6 border-t border-border">
                <div className="flex flex-col">
                  <p className="text-[24px] font-black text-foreground tracking-tight">
                    4.2 yrs
                  </p>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Tenure
                  </p>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="flex flex-col">
                  <p className="text-[24px] font-black text-foreground tracking-tight">
                    92%
                  </p>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Attendance
                  </p>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="flex flex-col">
                  <p className="text-[24px] font-black text-foreground tracking-tight">
                    4.5 ★
                  </p>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Bar ──────────────────────────────────────────────── */}
      <div className="bg-card rounded-[20px] border border-border shadow-sm p-1.5 flex items-center overflow-x-auto no-scrollbar">
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
              <PersonalTab isEditing={isEditing} />
            )}
            {activeTab === "Employment" && <EmploymentTab />}
            {activeTab === "Documents" && <DocumentsTab />}
            {activeTab === "Emergency Contact" && (
              <EmergencyTab isEditing={isEditing} />
            )}
            {activeTab === "Settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Save Bar (Editing Mode) ─────────────────────────────── */}
      {isEditing && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl p-4 flex items-center gap-6 animate-in slide-in-from-bottom-10"
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
              className="px-10 py-3 rounded-xl bg-primary text-white font-black shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
      <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
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
}

function InputField({
  label,
  value,
  disabled,
  placeholder = "",
  type = "text",
  isTextarea = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          disabled={disabled}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] disabled:opacity-70 disabled:cursor-not-allowed custom-scrollbar"
        />
      ) : (
        <div className="relative group">
          <input
            type={type}
            disabled={disabled}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
}

function DropdownField({
  label,
  value,
  options,
  disabled,
}: DropdownFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          disabled={disabled}
          defaultValue={value}
          className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
  );
}

function PersonalTab({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT (65%) */}
      <div className="lg:w-[65%] space-y-8">
        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
          <Label>PERSONAL DETAILS</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              value="Priya Sharma"
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

        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
          <Label>CONTACT INFORMATION</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Personal Email"
              value="priya.sharma@gmail.com"
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
        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
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

        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
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

        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
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

function EmploymentTab() {
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
    <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
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
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 group-hover:text-primary transition-colors">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {docs.map((doc) => (
        <div
          key={doc.name}
          className="bg-card rounded-[24px] p-7 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-background group-hover:bg-primary/10 transition-colors shadow-inner">
              <FileText size={28} style={{ color: doc.color }} />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
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
            <button className="flex-1 py-3 rounded-xl bg-background text-foreground text-[12px] font-black border border-border hover:bg-secondary transition-all">
              View
            </button>
            <button className="flex-1 py-3 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all">
              Replace
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergencyTab({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
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

function SettingsTab() {
  const [preferences, setPreferences] = useState({
    email: true,
    inApp: true,
    sms: false,
    leave: true,
    expense: true,
    payslip: true,
    announcements: false,
  });

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
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-[60%] space-y-6">
        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
          <Label>ACCOUNT PREFERENCES</Label>

          <div className="space-y-10">
            {/* Delivery Channels */}
            <div>
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">
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
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">
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
        <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm">
          <Label>SECURITY</Label>
          <button className="w-full py-4 rounded-2xl border border-border text-foreground font-black text-[14px] flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-sm">
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
            <button className="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[14px] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
              <ShieldAlert size={18} /> Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
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
                    className="w-full bg-[#F0FDF4] dark:bg-emerald-950/50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-primary appearance-none transition-all"
                  >
                    <option
                      value="Phone"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Phone Number
                    </option>
                    <option
                      value="Address"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Address
                    </option>
                    <option
                      value="Bank Details"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Bank Details
                    </option>
                    <option
                      value="Emergency Contact"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Emergency Contact
                    </option>
                    <option
                      value="Personal Info"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
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
                className="flex-1 py-4.5 px-8 border border-slate-200 dark:border-border rounded-[20px] text-[15px] font-black text-slate-500 hover:bg-secondary transition-all uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4.5 px-8 bg-[#00B87C] text-white rounded-[20px] text-[15px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all"
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
