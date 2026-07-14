import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useEmployees, EmployeeInput } from "../../../context/AppContext";
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
} from "lucide-react";

const AUTOSAVE_KEY = "nexus_manage_account_add_user_draft";

export function ManageAccountAddUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeesList, addEmployee } = useEmployees();

  const currentUserRole = user?.role || "Employee";
  const isSuperAdmin =
    currentUserRole === "Super Admin" || currentUserRole === "Platform Admin";

  // ─── Step state ───
  const [step, setStep] = useState(1);

  // ─── Dropdown lists (dynamic inline addition) ───
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
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Remote",
    "San Francisco",
  ]);
  const [designations, setDesignations] = useState([
    "Senior Developer",
    "Software Engineer",
    "HR Specialist",
    "Product Manager",
    "UI/UX Designer",
    "Financial Analyst",
    "Operations Associate",
  ]);
  const [employmentTypes, setEmploymentTypes] = useState([
    "Full-time",
    "Contract",
    "Intern",
  ]);
  const [sourcesOfHire, setSourcesOfHire] = useState([
    "Referral",
    "Job Portal",
    "Campus",
    "Other",
  ]);

  // ─── Form state ───
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
    location: "Bangalore",
    designation: "Software Engineer",
    employmentType: "Full-time",
    employeeStatus: "Active",
    sourceOfHire: "Referral",
    dateOfJoining: new Date().toISOString().split("T")[0],
    currentExperience: "",
    totalExperience: "",

    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    bloodGroup: "",
    nationality: "Indian",

    aadhaarNumber: "",
    panNumber: "",
    uanNumber: "",
    passportNumber: "",

    personalMobile: "+91 ",
    workMobile: "",
    currentAddress: "",
    permanentAddress: "",
    sameAddress: false,
    emergencyContactName: "",
    emergencyContactNumber: "",

    probationEndDate: "",
    notes: "",

    sendInvite: true,
    notifyManager: true,
    notifyHR: false,
    reminderUnopened: true,
  });

  const [activeTab, setActiveTab] = useState("basic");

  // Inline new-value prompt
  const [newValPrompt, setNewValPrompt] = useState<{
    field: "dept" | "location" | "designation" | "type" | "source";
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
        showToast("Restored incomplete draft", "info");
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  // Autosave
  useEffect(() => {
    const t = setTimeout(
      () => sessionStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)),
      3000,
    );
    return () => clearTimeout(t);
  }, [form]);

  // Sync first/last name from full name
  useEffect(() => {
    if (form.fullName) {
      const parts = form.fullName.trim().split(" ");
      setForm((f) => ({
        ...f,
        firstName: f.firstName || parts[0] || "",
        lastName: f.lastName || parts.slice(1).join(" ") || "",
      }));
    }
  }, [form.fullName]);

  // Auto probation date
  useEffect(() => {
    if (form.dateOfJoining) {
      const d = new Date(form.dateOfJoining);
      d.setDate(d.getDate() + 90);
      setForm((f) => ({
        ...f,
        probationEndDate: d.toISOString().split("T")[0],
      }));
    }
  }, [form.dateOfJoining]);

  // ─── Validation ───
  const isIdUnique = !employeesList.some(
    (e) => e.id.toLowerCase() === form.employeeId.toLowerCase().trim(),
  );
  const isEmailUnique =
    !employeesList.some(
      (e) => e.email.toLowerCase() === form.email.toLowerCase().trim(),
    ) &&
    !((): boolean => {
      try {
        const saved = localStorage.getItem("nexus_registered_users");
        if (saved)
          return JSON.parse(saved).some(
            (u: { email: string }) =>
              u.email.toLowerCase() === form.email.toLowerCase().trim(),
          );
      } catch (e) {
        console.log(e);
      }
      return false;
    })();

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
    personal: false,
    identity: false,
    contact:
      form.personalMobile.trim() === "" || form.personalMobile.trim() === "+91",
    other: false,
  };

  const isStep3Valid = !Object.values(tabErrors).some((err) => err);

  const canContinue = () => {
    if (step === 1) return true;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    return true;
  };

  // ─── Inline add new value ───
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
    } else if (newValPrompt.field === "source") {
      setSourcesOfHire((p) => [...p, val]);
      setForm((f) => ({ ...f, sourceOfHire: val }));
    }
    setNewValPrompt({ field: "dept", visible: false, value: "" });
    showToast("Added successfully", "success");
  };

  // ─── Final submit ───
  const handleFinalSubmit = () => {
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
      salary: 500000,
      location: form.location,
      manager: form.reportingManager || "Unassigned",
      employmentType: form.employmentType,
      gender: form.gender,
      dob: form.dob || "1995-01-01",
      address: form.currentAddress || "N/A",
      emergencyContact: form.emergencyContactName
        ? `${form.emergencyContactName} (${form.emergencyContactNumber})`
        : "N/A",
    };

    addEmployee(newEmp);

    try {
      const savedUsers = localStorage.getItem("nexus_registered_users") || "[]";
      const usersList = JSON.parse(savedUsers);
      const newPlatformUser = {
        id: `user-${Date.now()}`,
        name: form.fullName.trim(),
        email: form.email.trim(),
        initials: form.fullName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
        role: form.role,
        status: "Pending Invite",
        joinedAt: new Date().toISOString(),
        mfaEnabled: false,
        lastLoginAt: "",
        organization: user?.organization || "NexusHR Org",
        organizationId: "org-1",
      };
      localStorage.setItem(
        "nexus_registered_users",
        JSON.stringify([newPlatformUser, ...usersList]),
      );
    } catch (err) {
      console.error("Failed to register platform login", err);
    }

    sessionStorage.removeItem(AUTOSAVE_KEY);
    showToast(`${form.fullName} has been added — invite sent.`, "success");
    navigate("/admin/manage-account");
  };

  /* ─── Shared styles ─── */
  const labelCls = "block text-xs font-bold text-slate-700 uppercase mb-2";
  const inputCls =
    "w-full px-4 py-3.5 bg-[#F5F6F8] rounded-xl text-sm border-0 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 font-medium";
  const selectCls = inputCls;

  return (
    <div className="w-full px-4 md:px-12 py-8 bg-[#F8F9FD] min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate("/admin/manage-account")}
        className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back to Users
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Add User
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new user account and invite them to the organization
        </p>
      </div>

      {/* ─── Step Tracker ─── */}
      <div className="max-w-3xl mx-auto mb-10 px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--primary)] -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[
            { s: 1, label: "Selection" },
            { s: 2, label: "Account" },
            { s: 3, label: "Details" },
            { s: 4, label: "Alerts" },
          ].map((item) => {
            const done = step > item.s;
            const active = step === item.s;
            return (
              <div key={item.s} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    done
                      ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                      : active
                        ? "bg-white border-[var(--primary)] text-[var(--primary)] shadow-md shadow-emerald-200"
                        : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : item.s}
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${active ? "text-[var(--primary)]" : "text-slate-500"}`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Card ─── */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden mb-12">
        {/* ═══ STEP 1: Selection ═══ */}
        {step === 1 && (
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-black text-slate-800 mb-2">
              Select User Onboarding Method
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Choose whether you are adding a single new user or importing a
              batch.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div
                onClick={() => setForm((f) => ({ ...f, entryType: "single" }))}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-start ${
                  form.entryType === "single"
                    ? "border-[var(--primary)] bg-emerald-50/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    form.entryType === "single"
                      ? "bg-emerald-100 text-[var(--primary)]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <User size={24} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-1">
                  Add a single user
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill in one person's details manually. Selected by default.
                </p>
              </div>

              <div
                onClick={() => {
                  setForm((f) => ({ ...f, entryType: "spreadsheet" }));
                  navigate("/admin/manage-account/import");
                }}
                className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-200 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-1">
                  Bulk Import
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Import employees from a CSV file. Redirects to the import
                  page.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button
                disabled={!canContinue()}
                onClick={() => setStep(2)}
                className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Create Account ═══ */}
        {step === 2 && (
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-black text-slate-800 mb-2">
              Create User Account
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Capture minimum identity to create login access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className={labelCls}>Employee ID</label>
                <input
                  type="text"
                  placeholder="e.g. EMP001"
                  className={inputCls}
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employeeId: e.target.value }))
                  }
                />
                {!isIdUnique && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                    <Info size={12} /> Employee ID already registered!
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className={inputCls}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="email"
                    placeholder="name@organization.com"
                    className={`${inputCls} pl-11`}
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                {!isEmailUnique && form.email && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                    <Info size={12} /> Email already taken!
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>System Role</label>
                <select
                  className={selectCls}
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  <option value="Employee">Team Member</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Finance">Finance Manager</option>
                  <option value="Manager">Team Manager</option>
                  {isSuperAdmin && (
                    <option value="Super Admin">Admin (Super Admin)</option>
                  )}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Reporting Manager</label>
                <select
                  className={selectCls}
                  value={form.reportingManager}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reportingManager: e.target.value }))
                  }
                >
                  <option value="">Unassigned / Direct Report</option>
                  {employeesList
                    .filter(
                      (e) =>
                        e.role === "Manager" ||
                        e.role === "Super Admin" ||
                        e.role === "HR Manager",
                    )
                    .map((mgr) => (
                      <option key={mgr.id} value={mgr.name}>
                        {mgr.name} ({mgr.designation})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/30 rounded-2xl flex items-start gap-3 mb-10">
              <Info className="text-[var(--primary)] shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-emerald-900/60 leading-relaxed font-semibold">
                The user will receive an email invitation to create their own
                password.
              </p>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                ← Back
              </button>
              <button
                disabled={!canContinue()}
                onClick={() => setStep(3)}
                className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Employee Details ═══ */}
        {step === 3 && (
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Left Vertical Tabs */}
            <div className="w-full md:w-64 border-r border-slate-100 bg-[#FAFBFD] p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
              {[
                { id: "basic", label: "Basic Information" },
                { id: "work", label: "Work Information" },
                { id: "personal", label: "Personal Info" },
                { id: "identity", label: "Identity Data" },
                { id: "contact", label: "Contact Info" },
                { id: "other", label: "Other Details" },
              ].map((tabItem) => {
                const hasErr = tabErrors[tabItem.id as keyof typeof tabErrors];
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 md:shrink ${
                      isActive
                        ? "bg-white text-[var(--primary)] shadow-md shadow-slate-100 border border-slate-100"
                        : "text-slate-500 hover:bg-slate-100/50"
                    }`}
                  >
                    <span>{tabItem.label}</span>
                    {hasErr && (
                      <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div>
                {/* Basic */}
                {activeTab === "basic" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Employee ID</label>
                        <input
                          type="text"
                          disabled
                          className={`${inputCls} bg-slate-100 text-slate-400 cursor-not-allowed`}
                          value={form.employeeId}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Nick Name</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={form.nickName}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, nickName: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>First Name *</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={form.firstName}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Email (Read Only)</label>
                        <input
                          type="text"
                          disabled
                          className={`${inputCls} bg-slate-100 text-slate-400 cursor-not-allowed`}
                          value={form.email}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Last Name *</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={form.lastName}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, lastName: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Work */}
                {activeTab === "work" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Work Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Department */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Department *
                          </label>
                          <button
                            onClick={() =>
                              setNewValPrompt({
                                field: "dept",
                                visible: true,
                                value: "",
                              })
                            }
                            className="text-[var(--primary)] hover:underline text-[11px] font-bold flex items-center"
                          >
                            <Plus size={10} /> New
                          </button>
                        </div>
                        <select
                          className={selectCls}
                          value={form.department}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              department: e.target.value,
                            }))
                          }
                        >
                          {depts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Role (read-only) */}
                      <div>
                        <label className={labelCls}>System Role</label>
                        <select
                          className={selectCls}
                          value={form.role}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, role: e.target.value }))
                          }
                        >
                          <option value="Employee">Team Member</option>
                          <option value="HR Manager">HR Manager</option>
                          <option value="Finance">Finance Manager</option>
                          <option value="Manager">Team Manager</option>
                          {isSuperAdmin && (
                            <option value="Super Admin">Admin</option>
                          )}
                        </select>
                      </div>
                      {/* Location */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Location *
                          </label>
                          <button
                            onClick={() =>
                              setNewValPrompt({
                                field: "location",
                                visible: true,
                                value: "",
                              })
                            }
                            className="text-[var(--primary)] hover:underline text-[11px] font-bold flex items-center"
                          >
                            <Plus size={10} /> New
                          </button>
                        </div>
                        <select
                          className={selectCls}
                          value={form.location}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                          }
                        >
                          {locations.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Employment Type */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Employment Type
                          </label>
                          <button
                            onClick={() =>
                              setNewValPrompt({
                                field: "type",
                                visible: true,
                                value: "",
                              })
                            }
                            className="text-[var(--primary)] hover:underline text-[11px] font-bold flex items-center"
                          >
                            <Plus size={10} /> New
                          </button>
                        </div>
                        <select
                          className={selectCls}
                          value={form.employmentType}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              employmentType: e.target.value,
                            }))
                          }
                        >
                          {employmentTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Designation */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Designation *
                          </label>
                          <button
                            onClick={() =>
                              setNewValPrompt({
                                field: "designation",
                                visible: true,
                                value: "",
                              })
                            }
                            className="text-[var(--primary)] hover:underline text-[11px] font-bold flex items-center"
                          >
                            <Plus size={10} /> New
                          </button>
                        </div>
                        <select
                          className={selectCls}
                          value={form.designation}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              designation: e.target.value,
                            }))
                          }
                        >
                          {designations.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Employee Status */}
                      <div>
                        <label className={labelCls}>Employee Status</label>
                        <select
                          className={selectCls}
                          value={form.employeeStatus}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              employeeStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Probation">Probation</option>
                          <option value="Notice Period">Notice Period</option>
                        </select>
                      </div>
                      {/* Source of Hire */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Source of Hire
                          </label>
                          <button
                            onClick={() =>
                              setNewValPrompt({
                                field: "source",
                                visible: true,
                                value: "",
                              })
                            }
                            className="text-[var(--primary)] hover:underline text-[11px] font-bold flex items-center"
                          >
                            <Plus size={10} /> New
                          </button>
                        </div>
                        <select
                          className={selectCls}
                          value={form.sourceOfHire}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              sourceOfHire: e.target.value,
                            }))
                          }
                        >
                          {sourcesOfHire.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Date of Joining */}
                      <div>
                        <label className={labelCls}>Date of Joining</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={form.dateOfJoining}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              dateOfJoining: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {/* Current Experience */}
                      <div>
                        <label className={labelCls}>Current Experience</label>
                        <input
                          type="text"
                          placeholder="-"
                          className={inputCls}
                          value={form.currentExperience}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              currentExperience: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {/* Total Experience */}
                      <div>
                        <label className={labelCls}>
                          Total Experience (Years)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 5"
                          className={inputCls}
                          value={form.totalExperience}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              totalExperience: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal */}
                {activeTab === "personal" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Date of Birth</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={form.dob}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, dob: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Gender</label>
                        <select
                          className={selectCls}
                          value={form.gender}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, gender: e.target.value }))
                          }
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Marital Status</label>
                        <select
                          className={selectCls}
                          value={form.maritalStatus}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              maritalStatus: e.target.value,
                            }))
                          }
                        >
                          <option>Single</option>
                          <option>Married</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Blood Group</label>
                        <input
                          type="text"
                          placeholder="e.g. O+"
                          className={inputCls}
                          value={form.bloodGroup}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              bloodGroup: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Nationality</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={form.nationality}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            nationality: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Identity */}
                {activeTab === "identity" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-4 border border-amber-100">
                      <Lock className="text-amber-600" size={14} />
                      <p className="text-[11px] text-amber-800/80 font-bold">
                        Sensitive Information: Only Admin and HR Managers can
                        edit. All updates are logged in the Audit Log.
                      </p>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Identity Information
                    </h3>
                    <div>
                      <label className={labelCls}>Aadhaar Number</label>
                      <input
                        type="text"
                        placeholder="12-digit Aadhaar"
                        className={inputCls}
                        value={form.aadhaarNumber}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            aadhaarNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>PAN Number</label>
                      <input
                        type="text"
                        placeholder="Permanent Account Number"
                        className={inputCls}
                        value={form.panNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, panNumber: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>UAN Number</label>
                      <input
                        type="text"
                        placeholder="Universal PF Account Number"
                        className={inputCls}
                        value={form.uanNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, uanNumber: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Passport Number</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={form.passportNumber}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            passportNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Contact */}
                {activeTab === "contact" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Personal Mobile *</label>
                        <input
                          type="tel"
                          placeholder="+91 "
                          className={inputCls}
                          value={form.personalMobile}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              personalMobile: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Work Mobile</label>
                        <input
                          type="tel"
                          className={inputCls}
                          value={form.workMobile}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              workMobile: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Current Address</label>
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-none`}
                        value={form.currentAddress}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            currentAddress: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Permanent Address
                        </label>
                        <label className="flex items-center gap-1 text-[11px] text-[var(--primary)] font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="rounded text-[var(--primary)] focus:ring-0 cursor-pointer"
                            checked={form.sameAddress}
                            onChange={(e) => {
                              const c = e.target.checked;
                              setForm((f) => ({
                                ...f,
                                sameAddress: c,
                                permanentAddress: c ? f.currentAddress : "",
                              }));
                            }}
                          />
                          Same as Current
                        </label>
                      </div>
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-none`}
                        value={form.permanentAddress}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            permanentAddress: e.target.value,
                          }))
                        }
                        disabled={form.sameAddress}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          value={form.emergencyContactName}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              emergencyContactName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          Emergency Contact Mobile
                        </label>
                        <input
                          type="tel"
                          className={inputCls}
                          value={form.emergencyContactNumber}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              emergencyContactNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Other */}
                {activeTab === "other" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                      Other Information
                    </h3>
                    <div>
                      <label className={labelCls}>Probation End Date</label>
                      <input
                        type="date"
                        className={inputCls}
                        value={form.probationEndDate}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            probationEndDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Internal Notes</label>
                      <textarea
                        rows={4}
                        placeholder="Internal notes — never shown to the employee."
                        className={`${inputCls} resize-none`}
                        value={form.notes}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, notes: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div className="flex justify-between pt-8 border-t border-slate-100 mt-10">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
                >
                  ← Back
                </button>
                <button
                  disabled={!canContinue()}
                  onClick={() => setStep(4)}
                  className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Alerts ═══ */}
        {step === 4 && (
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-black text-slate-800 mb-2">
              Configure Notification Alerts
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Select which system notifications trigger once the user is
              created.
            </p>

            <div className="space-y-6 mb-10">
              {[
                {
                  id: "sendInvite",
                  label: "Send invite email",
                  desc: "User receives a link to set their password and sign in.",
                },
                {
                  id: "notifyManager",
                  label: "Notify Reporting Manager",
                  desc: "Manager gets an email once the account is active.",
                },
                {
                  id: "notifyHR",
                  label: "Notify HR",
                  desc: "HR gets a copy of the new-hire record.",
                },
                {
                  id: "reminderUnopened",
                  label: "Reminder if invite unopened",
                  desc: "Auto-resend the invite after 3 days of no response.",
                },
              ].map((alertItem) => (
                <div
                  key={alertItem.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-[#FAFBFD] transition-all hover:border-slate-200"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm mb-0.5">
                      {alertItem.label}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {alertItem.desc}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        [alertItem.id]: !f[alertItem.id as keyof typeof f],
                      }))
                    }
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${form[alertItem.id as keyof typeof form] ? "bg-[var(--primary)]" : "bg-slate-200"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${form[alertItem.id as keyof typeof form] ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 shadow-md shadow-emerald-100"
              >
                Create User ✓
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Inline add modal ─── */}
      {newValPrompt.visible && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl">
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">
              Add{" "}
              {newValPrompt.field === "dept"
                ? "Department"
                : newValPrompt.field === "location"
                  ? "Location"
                  : newValPrompt.field === "designation"
                    ? "Designation"
                    : newValPrompt.field === "type"
                      ? "Employment Type"
                      : "Source of Hire"}
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">
              This option will be appended to the dropdown and selected.
            </p>
            <input
              type="text"
              placeholder="Enter new value"
              className={`${inputCls} mb-6 font-bold`}
              value={newValPrompt.value}
              onChange={(e) =>
                setNewValPrompt((p) => ({ ...p, value: e.target.value }))
              }
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNewValSubmit();
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setNewValPrompt((p) => ({ ...p, visible: false }))
                }
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200/65 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewValSubmit}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-[var(--primary)] hover:opacity-90 transition-all"
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
