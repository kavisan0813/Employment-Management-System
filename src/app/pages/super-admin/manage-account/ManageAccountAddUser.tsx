import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useEmployees, EmployeeInput } from "../../../context/AppContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { PermissionGate } from "../../../shared/permission-engine/PermissionGate";
import { ROLE_TEMPLATES, LEGACY_ROLE_MAP, SystemRoleId } from "../../../shared/permission-engine/roles";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  ChevronLeft,
  User,
  Mail,
  Check,
  Plus,
  Briefcase,
  Lock,
  ArrowRight,
  Info,
  Rocket,
  CheckCircle2,
  Phone,
  Building,
  MapPin,
  Calendar,
  XCircle,
  Shield,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const AUTOSAVE_KEY = "viyan_manage_account_add_user_draft";

/* Role Descriptions & Capabilities Summary Map */
const ROLE_CAPABILITIES_SUMMARY: Record<string, { desc: string; highlights: string[] }> = {
  Employee: {
    desc: "Standard employee access to personal workspace, self attendance, leave applications, and training modules.",
    highlights: ["View Personal Profile & Payslips", "Apply for Leaves & Log Attendance", "Access Employee Training & Self Help"],
  },
  Manager: {
    desc: "Department/Team Manager with authority to approve team leaves, log reviews, and track team performance.",
    highlights: ["Approve Team Leaves & Attendance", "Conduct Team Performance Reviews", "Recommend Appraisals & Training"],
  },
  "HR Manager": {
    desc: "Comprehensive HR operational authority over employee directory, onboarding, recruitment, and attendance.",
    highlights: ["Manage Employee Directory & Creation", "Oversee Onboarding & Offboarding", "Configure Shift Schedules & Leaves"],
  },
  Finance: {
    desc: "Financial management authority over payroll processing, expense reimbursements, and full settlements.",
    highlights: ["Process Monthly Payroll & Payslips", "Approve Expense Reimbursements", "Manage Final Exit Settlements"],
  },
  "Super Admin": {
    desc: "Full organization owner access across all EMS modules, system settings, subscription billing, and security.",
    highlights: ["Full Administrative Organization Control", "Manage All Roles & Permission Scopes", "Access System Audit Logs & Config"],
  },
};

export function ManageAccountAddUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeesList, addEmployee } = useEmployees();
  const { hasPermissionKey } = usePermissions();

  /* ─── Permission Checks ─── */
  const canManageAccount =
    hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_CREATE) ||
    hasPermissionKey(P.PLATFORM_ADMIN_FULL);

  const canAssignPrivilegedRole =
    hasPermissionKey(P.PLATFORM_ADMIN_FULL) ||
    hasPermissionKey(P.SETTINGS_FULL) ||
    hasPermissionKey(P.ROLES_MANAGE);

  // Active Organization Context
  const activeOrgId = user?.organizationId || "org-1";
  const activeOrgName = user?.organization || "NexusHR Org";

  // Step state (1: Method, 2: Account, 3: Details, 4: Alerts, 5: Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Dropdown lists
  const [depts, setDepts] = useState([
    "Engineering",
    "Marketing",
    "Design",
    "Finance",
    "HR",
    "Product",
    "Sales",
    "Operations",
  ]);
  const [locations, setLocations] = useState([
    "HQ - Bangalore",
    "Mumbai Branch",
    "Delhi Branch",
    "Remote",
    "San Francisco",
  ]);
  const [designations, setDesignations] = useState([
    "Senior Software Engineer",
    "Software Engineer",
    "HR Specialist",
    "Product Manager",
    "UI/UX Designer",
    "Financial Analyst",
    "Operations Lead",
  ]);
  const [employmentTypes, setEmploymentTypes] = useState([
    "Full-time",
    "Contract",
    "Intern",
    "Part-time",
  ]);

  // Form state
  const [form, setForm] = useState({
    entryType: "single" as "single" | "spreadsheet",
    employeeId: "",
    fullName: "",
    email: "",
    role: "Employee",
    reportingManager: "",

    firstName: "",
    lastName: "",
    nickName: "",

    department: "Engineering",
    location: "HQ - Bangalore",
    designation: "Software Engineer",
    employmentType: "Full-time",
    employeeStatus: "Active",
    dateOfJoining: new Date().toISOString().split("T")[0],

    dob: "",
    gender: "Male",
    maritalStatus: "Single",

    personalMobile: "+91 98765 43210",
    workMobile: "",
    currentAddress: "",
    permanentAddress: "",
    sameAddress: false,
    emergencyContactName: "",
    emergencyContactNumber: "",

    probationEndDate: ((): string => {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      return d.toISOString().split("T")[0];
    })(),
    notes: "",

    sendInvite: true,
    notifyManager: true,
    notifyHR: false,
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [createdEmployee, setCreatedEmployee] = useState<EmployeeInput | null>(null);

  // Inline new-value prompt
  const [newValPrompt, setNewValPrompt] = useState<{
    field: "dept" | "location" | "designation" | "type";
    visible: boolean;
    value: string;
  }>({ field: "dept", visible: false, value: "" });

  // Auto-generate Employee ID
  useEffect(() => {
    const nextNum = employeesList.length + 1;
    setForm((f) => ({
      ...f,
      employeeId: `EMP${String(nextNum).padStart(3, "0")}`,
    }));
  }, [employeesList]);

  // Restore draft
  useEffect(() => {
    const draft = sessionStorage.getItem(AUTOSAVE_KEY);
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  // Autosave
  useEffect(() => {
    const t = setTimeout(
      () => sessionStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)),
      3000
    );
    return () => clearTimeout(t);
  }, [form]);

  /* ─── VALIDATION LOGIC ─── */
  const isIdUnique = !employeesList.some(
    (e) => e.id.toLowerCase() === form.employeeId.toLowerCase().trim()
  );

  const isEmailUnique =
    !employeesList.some((e) => e.email.toLowerCase() === form.email.toLowerCase().trim()) &&
    !((): boolean => {
      try {
        const saved = localStorage.getItem("viyan_registered_users:v1");
        if (saved)
          return JSON.parse(saved).some(
            (u: { email: string }) => u.email.toLowerCase() === form.email.toLowerCase().trim()
          );
      } catch (e) {
        console.log(e);
      }
      return false;
    })();

  const isPhoneValid = /^\+?[0-9\s\-()]{7,15}$/.test(form.personalMobile.trim());

  const isStep2Valid =
    form.employeeId.trim() !== "" &&
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.role.trim() !== "" &&
    isIdUnique &&
    isEmailUnique;

  const tabErrors = {
    basic: form.firstName.trim() === "" || form.lastName.trim() === "",
    work:
      form.department.trim() === "" ||
      form.location.trim() === "" ||
      form.designation.trim() === "",
    contact: !isPhoneValid,
  };

  const isStep3Valid = !Object.values(tabErrors).some((err) => err);

  const canContinue = () => {
    if (step === 1) return true;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    return true;
  };

  /* Inline add option submit */
  const handleAddNewValSubmit = () => {
    const val = newValPrompt.value.trim();
    if (!val) return;
    if (newValPrompt.field === "dept") {
      setDepts((p) => [...p, val]);
      setForm((f) => ({ ...f, department: val }));
    } else if (newValPrompt.field === "location") {
      setLocations((p) => [...p, val]);
      setForm((f) => ({ ...f, location: val }));
    } else if (newValPrompt.field === "designation") {
      setDesignations((p) => [...p, val]);
      setForm((f) => ({ ...f, designation: val }));
    } else if (newValPrompt.field === "type") {
      setEmploymentTypes((p) => [...p, val]);
      setForm((f) => ({ ...f, employmentType: val }));
    }
    setNewValPrompt({ field: "dept", visible: false, value: "" });
    showToast("Option added", "success");
  };

  /* ─── FINAL SUBMIT HANDLER ─── */
  const handleFinalSubmit = () => {
    if (!canManageAccount) {
      showToast("Access Denied", "error", "You do not have permission to add new users.");
      return;
    }

    const newEmp: EmployeeInput = {
      id: form.employeeId.trim(),
      name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.personalMobile.trim(),
      department: form.department,
      role: form.role,
      designation: form.designation,
      status: "Pending Invite",
      joinDate: form.dateOfJoining,
      salary: 600000,
      location: form.location,
      manager: form.reportingManager || "Unassigned",
      employmentType: form.employmentType,
      gender: form.gender,
      dob: form.dob || "1995-01-01",
      address: form.currentAddress || "HQ - Bangalore",
      emergencyContact: form.emergencyContactName
        ? `${form.emergencyContactName} (${form.emergencyContactNumber})`
        : "N/A",
    };

    addEmployee(newEmp);

    // Register User Login in viyan_registered_users:v1 with Dynamic Org Context
    try {
      const savedUsers = localStorage.getItem("viyan_registered_users:v1") || "[]";
      const usersList = JSON.parse(savedUsers);
      const newPlatformUser = {
        id: `user-${Date.now()}`,
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.personalMobile.trim(),
        initials: form.fullName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        role: form.role,
        status: "Pending Invite",
        joinedAt: new Date().toISOString(),
        mfaEnabled: false,
        lastLoginAt: "",
        organization: activeOrgName,
        organizationId: activeOrgId,
      };
      localStorage.setItem(
        "viyan_registered_users:v1",
        JSON.stringify([newPlatformUser, ...usersList])
      );
    } catch (err) {
      console.error("Failed to register platform login", err);
    }

    // Dispatch In-App Notification
    try {
      const notifs = JSON.parse(localStorage.getItem("viyan_notifications:v1") || "[]");
      const newNotif = {
        id: Date.now(),
        type: "Info",
        title: "New Employee Added",
        description: `${form.fullName.trim()} has been added successfully.`,
        time: "Just now",
        read: false,
        category: "System",
        actionRoute: "/onboarding",
        actionLabel: "Start Onboarding",
      };
      localStorage.setItem("viyan_notifications:v1", JSON.stringify([newNotif, ...notifs]));
      window.dispatchEvent(new Event("viyan:notifications-updated"));
    } catch (err) {
      console.error("Failed to dispatch in-app notification", err);
    }

    sessionStorage.removeItem(AUTOSAVE_KEY);
    setCreatedEmployee(newEmp);
    setStep(5); // Move to Success state
    showToast(`${form.fullName} added successfully — invitation created.`, "success");
  };

  // Selected Role Permission Preview Info
  const rolePreview = useMemo(() => {
    return (
      ROLE_CAPABILITIES_SUMMARY[form.role] || {
        desc: "Standard role capabilities as defined by organization permission policies.",
        highlights: ["Module access as configured by role template"],
      }
    );
  }, [form.role]);

  if (!canManageAccount) {
    return (
      <div className="w-full px-4 md:px-12 py-12 bg-background min-h-screen flex items-center justify-center">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-xl max-w-md text-center">
          <XCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-foreground mb-2">Access Restricted</h2>
          <p className="text-xs text-muted-foreground mb-6">
            You do not have the required permission (<code>manage_account:manage</code> or <code>employees:create</code>) to add new users.
          </p>
          <button
            onClick={() => navigate("/admin/manage-account")}
            className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            Return to User Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-12 py-8 bg-background min-h-screen text-foreground transition-colors duration-200">
      {/* ═══ BACK BUTTON ═══ */}
      <button
        onClick={() => navigate("/admin/manage-account")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft size={16} /> Back to User Directory
      </button>

      {/* ═══ HEADER ═══ */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Add User Account</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create a new employee profile, configure role permissions, and issue account invitations.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-bold text-muted-foreground flex items-center gap-2 self-start">
          <Building size={14} className="text-primary" />
          <span>Active Context: <strong className="text-foreground">{activeOrgName}</strong></span>
        </div>
      </div>

      {/* ═══ STEP TRACKER ═══ */}
      {step < 5 && (
        <div className="max-w-3xl mx-auto mb-10 px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-border -z-10" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary -z-10 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[
              { s: 1, label: "Method" },
              { s: 2, label: "Account" },
              { s: 3, label: "Profile Details" },
              { s: 4, label: "Alerts & Confirm" },
            ].map((item) => {
              const done = step > item.s;
              const active = step === item.s;
              return (
                <div key={item.s} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                      done
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : active
                        ? "bg-card border-primary text-primary shadow-md shadow-primary/20"
                        : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    {done ? <Check size={16} strokeWidth={3} /> : item.s}
                  </div>
                  <span className={`text-xs font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ CARD CONTAINER ═══ */}
      <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border shadow-xl overflow-hidden mb-12">
        {/* ── STEP 1: METHOD SELECTION ── */}
        {step === 1 && (
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Select User Onboarding Method</h2>
            <p className="text-xs text-muted-foreground">
              Choose whether you are adding a single new employee profile or performing a bulk spreadsheet import.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div
                onClick={() => setForm((f) => ({ ...f, entryType: "single" }))}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  form.entryType === "single"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary/40"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <User size={24} />
                </div>
                <h3 className="font-extrabold text-foreground text-base mb-1">Add Single User</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fill in employee identity, department, role, and contact details manually.
                </p>
              </div>

              <div
                onClick={() => {
                  setForm((f) => ({ ...f, entryType: "spreadsheet" }));
                  navigate("/admin/manage-account/import");
                }}
                className="p-6 rounded-2xl border-2 border-border hover:border-primary/40 hover:bg-secondary/40 cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="font-extrabold text-foreground text-base mb-1">Bulk Import</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Import multiple employee records from a CSV spreadsheet. Redirects to the 6-step wizard.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border">
              <button
                disabled={!canContinue()}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: CREATE ACCOUNT & ROLE PERMISSION PREVIEW ── */}
        {step === 2 && (
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Create User Account & Assign Role</h2>
            <p className="text-xs text-muted-foreground">
              Define core employee identity and system authorization access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  disabled
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-muted-foreground font-mono text-xs font-bold outline-none cursor-not-allowed"
                  value={`${form.employeeId} (Auto-generated by backend)`}
                />
                <p className="text-[11px] text-muted-foreground font-medium mt-1">
                  Authoritative system Employee ID is generated automatically upon account creation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arun Kumar"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.fullName}
                  onChange={(e) => {
                    const fullName = e.target.value;
                    const parts = fullName.trim().split(" ");
                    setForm((f) => ({
                      ...f,
                      fullName,
                      firstName: f.firstName || parts[0] || "",
                      lastName: f.lastName || parts.slice(1).join(" ") || "",
                    }));
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Corporate Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="arun@nexus-ems.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                {!isEmailUnique && form.email && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                    <Info size={12} /> Email address already registered!
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  System Role Assignment *
                </label>
                <select
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="Employee">Employee (Team Member)</option>
                  <option value="Manager">Team Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Finance">Finance Manager</option>
                  {canAssignPrivilegedRole && <option value="Super Admin">Super Admin (Org Owner)</option>}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Reporting Manager
                </label>
                <select
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.reportingManager}
                  onChange={(e) => setForm((f) => ({ ...f, reportingManager: e.target.value }))}
                >
                  <option value="">Unassigned / Direct Report</option>
                  {employeesList.map((mgr) => (
                    <option key={mgr.id} value={mgr.name}>
                      {mgr.name} ({mgr.designation} - {mgr.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ═══ ROLE PERMISSION SUMMARY PREVIEW CARD ═══ */}
            <div className="p-5 rounded-2xl bg-secondary/60 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h4 className="font-extrabold text-foreground text-xs">
                  Role Capabilities Summary — <span className="text-primary">{form.role}</span>
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{rolePreview.desc}</p>
              <div className="space-y-1.5 pt-1">
                {rolePreview.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Check size={14} className="text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-2xl flex items-start gap-3">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground font-semibold leading-relaxed">
                An account invitation record will be initialized for <strong>{form.email || "the employee"}</strong> under tenant <strong>{activeOrgName}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                disabled={!canContinue()}
                onClick={() => setStep(3)}
                className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  isStep2Valid
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-primary/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Continue to Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PROFILE DETAILS ── */}
        {step === 3 && (
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Left Vertical Tabs */}
            <div className="w-full md:w-60 border-r border-border bg-secondary/30 p-4 flex md:flex-col gap-2 overflow-x-auto">
              {[
                { id: "basic", label: "Basic Information" },
                { id: "work", label: "Work Information" },
                { id: "contact", label: "Contact Details" },
              ].map((tabItem) => {
                const hasErr = tabErrors[tabItem.id as keyof typeof tabErrors];
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 md:shrink cursor-pointer ${
                      isActive
                        ? "bg-card text-primary shadow-sm border border-border"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{tabItem.label}</span>
                    {hasErr && <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div>
                {/* Basic Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-foreground text-base mb-4">Basic Profile Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">First Name *</label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.firstName}
                          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Last Name *</label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.lastName}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nick Name</label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.nickName}
                          onChange={(e) => setForm((f) => ({ ...f, nickName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Date of Birth</label>
                        <input
                          type="date"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.dob}
                          onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Work Tab */}
                {activeTab === "work" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-foreground text-base mb-4">Work & Organization Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Department *</label>
                          <button
                            onClick={() => setNewValPrompt({ field: "dept", visible: true, value: "" })}
                            className="text-primary hover:underline text-[11px] font-bold flex items-center"
                          >
                            + New
                          </button>
                        </div>
                        <select
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.department}
                          onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                        >
                          {depts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Branch Location *</label>
                          <button
                            onClick={() => setNewValPrompt({ field: "location", visible: true, value: "" })}
                            className="text-primary hover:underline text-[11px] font-bold flex items-center"
                          >
                            + New
                          </button>
                        </div>
                        <select
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.location}
                          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        >
                          {locations.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Designation *</label>
                          <button
                            onClick={() => setNewValPrompt({ field: "designation", visible: true, value: "" })}
                            className="text-primary hover:underline text-[11px] font-bold flex items-center"
                          >
                            + New
                          </button>
                        </div>
                        <select
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.designation}
                          onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                        >
                          {designations.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Date of Joining</label>
                        <input
                          type="date"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.dateOfJoining}
                          onChange={(e) => setForm((f) => ({ ...f, dateOfJoining: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-foreground text-base mb-4">Contact & Communication</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                          Contact / Personal Mobile *
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className={`w-full p-3 rounded-xl border bg-background text-foreground font-bold text-xs ${
                            !isPhoneValid ? "border-rose-500 ring-1 ring-rose-500" : "border-border"
                          }`}
                          value={form.personalMobile}
                          onChange={(e) => setForm((f) => ({ ...f, personalMobile: e.target.value }))}
                        />
                        {!isPhoneValid && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1">
                            Please enter a valid phone contact number.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Work Mobile</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 00000"
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs"
                          value={form.workMobile}
                          onChange={(e) => setForm((f) => ({ ...f, workMobile: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Current Address</label>
                      <textarea
                        rows={2}
                        className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold text-xs resize-none"
                        value={form.currentAddress}
                        onChange={(e) => setForm((f) => ({ ...f, currentAddress: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={!isStep3Valid}
                  onClick={() => setStep(4)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    isStep3Valid
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-primary/40 text-white/70 cursor-not-allowed"
                  }`}
                >
                  Proceed to Review <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: ALERTS & CONFIRMATION ── */}
        {step === 4 && (
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Configure Invitation & Notifications</h2>
            <p className="text-xs text-muted-foreground">
              Set automated notifications triggered upon account creation.
            </p>

            <div className="space-y-4">
              {[
                { id: "sendInvite", label: "Create Account Invitation Record", desc: "Generates simulated password setup invitation link for onboarding." },
                { id: "notifyManager", label: "Notify Reporting Manager", desc: "Sends alert to manager regarding newly assigned direct report." },
                { id: "notifyHR", label: "Notify HR Department", desc: "Logs user creation record in HR onboarding workflow." },
              ].map((alertItem) => (
                <div
                  key={alertItem.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/30"
                >
                  <div>
                    <h4 className="font-extrabold text-foreground text-xs">{alertItem.label}</h4>
                    <p className="text-[11px] text-muted-foreground">{alertItem.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        [alertItem.id]: !f[alertItem.id as keyof typeof f],
                      }))
                    }
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                      form[alertItem.id as keyof typeof form] ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        form[alertItem.id as keyof typeof form] ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 size={18} /> Confirm & Create User Account
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: SUCCESS STATE & ONBOARDING REDIRECT ── */}
        {step === 5 && createdEmployee && (
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-foreground">User Account Created</h2>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>{createdEmployee.name}</strong> ({createdEmployee.email}) is registered as <code>{createdEmployee.id}</code> under <strong>{activeOrgName}</strong> with status <strong>Pending Invite</strong>.
              </p>
            </div>

            {/* Created Summary Card */}
            <div className="p-5 rounded-2xl bg-secondary/50 border border-border max-w-md mx-auto grid grid-cols-2 gap-4 text-left text-xs">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Employee ID</span>
                <span className="font-mono font-bold text-primary">{createdEmployee.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">System Role</span>
                <span className="font-bold text-foreground">{createdEmployee.role}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Department</span>
                <span className="font-bold text-foreground">{createdEmployee.department}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Branch Location</span>
                <span className="font-bold text-foreground">{createdEmployee.location}</span>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border max-w-md mx-auto">
              <button
                onClick={() =>
                  navigate("/onboarding", {
                    state: {
                      employeeId: createdEmployee.id,
                      employeeName: createdEmployee.name,
                    },
                  })
                }
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Rocket size={16} /> Start Employee Onboarding
              </button>
              <button
                onClick={() => navigate("/admin/manage-account")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-all cursor-pointer"
              >
                Return to Directory
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline Option Add Modal */}
      {newValPrompt.visible && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-foreground">Add Custom Option</h3>
            <input
              type="text"
              placeholder="Enter title..."
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs font-bold"
              value={newValPrompt.value}
              onChange={(e) => setNewValPrompt((p) => ({ ...p, value: e.target.value }))}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setNewValPrompt((p) => ({ ...p, visible: false }))}
                className="flex-1 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewValSubmit}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
