import { useState } from "react";
import { 
  MapPin, 
  TrendingUp, 
  Star,
  MessageSquare,
  Edit3,
  MoreHorizontal,
  Mail,
  Phone,
  Plus,
  Briefcase,
  Calendar,
  Download,
  ShieldCheck,
  Key,
  Camera,
  Info,
  ChevronDown,
  Linkedin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

type ProfileTab = "Personal Info" | "Employment" | "Documents" | "Emergency Contact" | "Settings";

export function FinanceProfile() {
  const { user } = useAuth(); // Keep this but prefix with _ if needed, or just use it for the name
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal Info");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 space-y-6 animate-in fade-in duration-500">
      
      {/* PROFILE HERO CARD */}
      <div className="bg-card border border-border rounded-[32px] shadow-sm overflow-hidden relative">
        {/* Gradient Banner */}
        <div className="h-[100px] w-full bg-gradient-to-r from-[#00B87C] to-[#009966] relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-20" />
        </div>

        {/* Hero Content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar with Upload Overlay */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-emerald-100 dark:bg-emerald-500/10 border-[6px] border-card shadow-xl overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-black text-[#00B87C]">AD</span>
                </div>
                <div className="absolute inset-0 rounded-[40px] bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px] m-[6px]">
                  <Camera size={24} className="text-white" />
                </div>
              </div>

              <div className="text-center md:text-left pb-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h1 className="text-2xl font-black text-foreground tracking-tight">{user?.name || "Ananya Das"}</h1>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] text-[10px] font-black uppercase tracking-widest text-white">
                    ● Active
                  </span>
                </div>
                <p className="text-[#00B87C] font-bold text-sm mb-3">{user?.role || "Finance Officer"}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    #EMP-0088
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Finance
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <MapPin size={13} /> Mumbai, India
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    <Calendar size={13} /> Since Jan 2022
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Full-time
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-2">
              {saved && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Changes Saved!</span>
                </motion.div>
              )}
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm">
                <MessageSquare size={16} />
                Message
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all shadow-sm font-black text-[12px] uppercase tracking-widest ${
                  isEditing 
                  ? "bg-[#00B87C] border-[#00B87C] text-white" 
                  : "border-border text-foreground hover:bg-muted/50"
                }`}
              >
                <Edit3 size={16} />
                {isEditing ? "Editing..." : "Edit Profile"}
              </button>
              <button className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted/50 transition-all shadow-sm">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-[#00B87C] shadow-inner">
                <Briefcase size={22} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">3.8 yrs</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Tenure</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 border-x border-border">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">94%</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Attendance</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                <Star size={22} fill="currentColor" />
              </div>
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">4.3★</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        {["Personal Info", "Employment", "Documents", "Emergency Contact", "Settings"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ProfileTab)}
              className={`px-8 py-4 text-[13px] font-black tracking-widest uppercase transition-all relative whitespace-nowrap ${
                isActive ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {isActive && (
                <motion.div 
                  layoutId="activeTabProfile"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B87C]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Personal Info" && <PersonalInfoTab isEditing={isEditing} />}
            {activeTab === "Employment" && <EmploymentTab />}
            {activeTab === "Documents" && <DocumentsTab />}
            {activeTab === "Emergency Contact" && <EmergencyContactTab isEditing={isEditing} />}
            {activeTab === "Settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SAVE BAR */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-[24px] bg-card border border-border shadow-2xl ring-1 ring-black/5"
          >
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
            >
              Save Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TAB CONTENT COMPONENTS ─── */

function PersonalInfoTab({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN: 60% */}
      <div className="flex-[0.6] space-y-6">
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <SectionTitle title="Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <EditField label="Full Name" value="Ananya Das" disabled={!isEditing} />
            <EditField label="Date of Birth" value="15 Aug 1992" type="date" disabled={!isEditing} />
            <SelectField label="Gender" value="Female" options={["Male", "Female", "Other"]} disabled={!isEditing} />
            <SelectField label="Blood Group" value="O+" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} disabled={!isEditing} />
            <SelectField label="Marital Status" value="Single" options={["Single", "Married", "Divorced", "Widowed"]} disabled={!isEditing} />
            <EditField label="Nationality" value="Indian" disabled={!isEditing} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <SectionTitle title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <EditField label="Personal Email" value="ananya.das@email.com" icon={<Mail size={14} />} disabled={!isEditing} />
            <EditField label="Mobile" value="+91 98765 43210" icon={<Phone size={14} />} disabled={!isEditing} />
            <EditField label="Alternate Phone" value="+91 98765 00000" icon={<Phone size={14} />} disabled={!isEditing} />
            <EditField label="LinkedIn" value="linkedin.com/in/ananya-das-fin" icon={<Linkedin size={14} />} disabled={!isEditing} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <SectionTitle title="About / Bio" />
          <div className="mt-6">
            <textarea 
              disabled={!isEditing}
              className="w-full h-[120px] rounded-2xl bg-muted/30 border border-border p-4 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              defaultValue="Passionate finance professional with 8+ years of experience in payroll compliance, statutory audit, and financial modeling. Dedicated to optimizing payroll processes and ensuring 100% regulatory compliance."
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 40% */}
      <div className="flex-[0.4] space-y-6">
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <SectionTitle title="Skills & Expertise" />
          <div className="flex flex-wrap gap-2.5 mt-6">
            <SkillChip label="Excel" color="green" />
            <SkillChip label="SAP" color="blue" />
            <SkillChip label="TDS Filing" color="amber" />
            <SkillChip label="PF Management" color="purple" />
            <SkillChip label="Financial Modeling" color="emerald" />
            <SkillChip label="Taxation" color="rose" />
            {isEditing && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-border text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all">
                <Plus size={14} /> Add Skill
              </button>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <SectionTitle title="Languages" />
          <div className="space-y-4 mt-6">
            <LanguageRow label="English" level="Native" />
            <LanguageRow label="Hindi" level="Fluent" />
            <LanguageRow label="Marathi" level="Intermediate" />
          </div>
        </div>

        {/* Security / Role Info Widget */}
        <div className="bg-gradient-to-br from-[#00B87C]/10 to-[#0EA5E9]/10 border border-emerald-500/20 rounded-[32px] p-6">
          <div className="flex items-center gap-3 mb-3 text-emerald-600">
            <ShieldCheck size={20} />
            <span className="text-[12px] font-black uppercase tracking-widest">Enterprise Access</span>
          </div>
          <p className="text-[13px] font-bold text-foreground/80 leading-relaxed">
            Your profile is secured with enterprise-grade MFA. Certain employment details are managed exclusively by HR.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmploymentTab() {
  return (
    <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <SectionTitle title="Employment Record" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-600">
          <Info size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Managed by HR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
        <ReadOnlyField label="Employee ID" value="EMP-0088" />
        <ReadOnlyField label="Designation" value="Finance Officer" />
        <ReadOnlyField label="Department" value="Finance & Accounts" />
        <ReadOnlyField label="Reporting Manager" value="Sameer Mehta (VP Finance)" />
        <ReadOnlyField label="Employment Type" value="Full-time Permanent" />
        <ReadOnlyField label="Work Mode" value="Hybrid (Mumbai Office)" />
        <ReadOnlyField label="Work Location" value="Mumbai SEZ" />
        <ReadOnlyField label="Joining Date" value="Jan 12, 2022" />
        <ReadOnlyField label="Notice Period" value="90 Days" />
        <ReadOnlyField label="Cost Center" value="FIN-GLOBAL-01" />
        <ReadOnlyField label="Probation Status" value="Completed" />
        <ReadOnlyField label="Official Email" value="ananya.das@nexushr.com" />
      </div>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
      <SectionTitle title="My Documents" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <DocCard name="Educational Certificates.zip" size="12.4 MB" date="Jan 15, 2022" />
        <DocCard name="PAN_Card_Copy.pdf" size="1.2 MB" date="Jan 12, 2022" />
        <DocCard name="Experience_Letter.pdf" size="2.5 MB" date="Jan 12, 2022" />
        <DocCard name="Aadhar_Verified.pdf" size="0.8 MB" date="Jan 12, 2022" />
      </div>
      <button className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-dashed border-border text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:border-[#00B87C] hover:text-[#00B87C] transition-all w-full justify-center">
        <Plus size={18} /> Upload New Document
      </button>
    </div>
  );
}

function EmergencyContactTab({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
      <SectionTitle title="Emergency Contact" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Primary Contact</p>
          <div className="grid grid-cols-1 gap-6">
            <EditField label="Contact Name" value="Rajat Das" disabled={!isEditing} />
            <EditField label="Relationship" value="Spouse" disabled={!isEditing} />
            <EditField label="Phone Number" value="+91 98765 11111" disabled={!isEditing} />
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secondary Contact</p>
          <div className="grid grid-cols-1 gap-6">
            <EditField label="Contact Name" value="Suman Das" disabled={!isEditing} />
            <EditField label="Relationship" value="Father" disabled={!isEditing} />
            <EditField label="Phone Number" value="+91 98765 22222" disabled={!isEditing} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <SectionTitle title="Account Settings" />
        <div className="space-y-4 mt-8">
          <ToggleField label="Email Notifications" desc="Receive payroll and approval alerts via email" active />
          <ToggleField label="Two-Factor Authentication" desc="Require MFA code for sensitive finance data access" active />
          <ToggleField label="Desktop App Sync" desc="Keep local payroll reports in sync with cloud" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <SectionTitle title="Security" />
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
              <Key size={22} />
            </div>
            <div>
              <p className="text-[15px] font-black text-foreground tracking-tight">Password Management</p>
              <p className="text-[12px] font-bold text-muted-foreground">Last changed 45 days ago</p>
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 rounded-full bg-[#00B87C]" />
      <h3 className="text-[13px] font-black text-foreground uppercase tracking-[1.5px]">{title}</h3>
    </div>
  );
}

function EditField({ label, value, type = "text", icon, disabled }: { label: string, value: string, type?: string, icon?: React.ReactNode, disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${disabled ? 'bg-muted/10 border-border opacity-70' : 'bg-muted/30 border-border focus-within:border-[#00B87C] focus-within:ring-2 focus-within:ring-[#00B87C]/10'}`}>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input 
          type={type}
          defaultValue={value} 
          disabled={disabled}
          className="w-full bg-transparent border-none outline-none text-[14px] font-bold text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, disabled }: { label: string, value: string, options: string[], disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      <div className={`relative ${disabled ? 'opacity-70' : ''}`}>
        <select 
          defaultValue={value}
          disabled={disabled}
          className={`w-full appearance-none px-4 py-3 rounded-2xl border bg-muted/30 border-border text-[14px] font-bold text-foreground outline-none transition-all ${!disabled && 'focus:border-[#00B87C] focus:ring-2 focus:ring-[#00B87C]/10 cursor-pointer'}`}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      <p className="text-[14px] font-bold text-foreground tracking-tight ml-1">{value}</p>
    </div>
  );
}

function SkillChip({ label, color }: { label: string, color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-600",
  };
  return (
    <span className={`px-4 py-2 rounded-xl border text-[12px] font-black tracking-tight ${colorMap[color] || "bg-muted/50 border-border text-muted-foreground"}`}>
      {label}
    </span>
  );
}

function LanguageRow({ label, level }: { label: string, level: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="text-[10px] font-black text-[#00B87C] uppercase tracking-widest">{level}</span>
    </div>
  );
}

function DocCard({ name, size, date }: { name: string, size: string, date: string }) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-muted/10 group hover:border-[#00B87C]/50 hover:bg-[#00B87C]/5 transition-all cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-[#00B87C]/20 transition-all">
        <Download size={20} className="text-muted-foreground group-hover:text-[#00B87C]" />
      </div>
      <p className="text-[13px] font-bold text-foreground line-clamp-1 mb-1">{name}</p>
      <p className="text-[10px] font-bold text-muted-foreground">{size} • {date}</p>
    </div>
  );
}

function ToggleField({ label, desc, active }: { label: string, desc: string, active?: boolean }) {
  const [isOn, setIsOn] = useState(!!active);
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="text-[14px] font-bold text-foreground">{label}</p>
        <p className="text-[12px] font-medium text-muted-foreground">{desc}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isOn ? 'bg-[#00B87C]' : 'bg-muted-foreground/20'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isOn ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
