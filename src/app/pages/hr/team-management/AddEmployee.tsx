import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useEmployees, EmployeeInput } from "../../../context/AppContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  ChevronLeft,
  Mail,
  Check,
  Plus,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAssignableRoles } from "../../../hooks/useAssignableRoles";


const AUTOSAVE_KEY = "nexus_add_employee_draft";

/* ─────────────────────────────────────────────────────────
   ROLE ASSIGNMENT MODEL
   Mirrors the `user_role_assignments` table from the
   architecture doc: a user can hold MULTIPLE roles, each
   scoped independently. This is what lets one person at a
   small company be HR Manager + Finance Manager + Team Lead
   with a single account, while a large multi-branch org can
   still give each Admin a role scoped to just their branch.
   ───────────────────────────────────────────────────────── */

type ScopeType = "organization" | "branch" | "department" | "team";

export type RoleAssignment = {
  id: string;
  role: string; // catalog role name, e.g. "HR Manager"
  scope: ScopeType;
  scopeId: string; // empty string when scope === "organization"
};

export const ROLE_CATALOG = [
  { value: "Employee", label: "Employee", alwaysOn: true },
  { value: "HR Manager", label: "HR Manager" },
  { value: "Finance", label: "Finance Manager" },
  { value: "Manager", label: "Team Manager" },
  { value: "Super Admin", label: "Admin (Super Admin)", superAdminOnly: true },
] as const;

export const VALIDATION = {
  employeeId: /^EMP\d{3,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^\+91[6-9]\d{9}$/,
  aadhaar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  uan: /^\d{12}$/,
  passport: /^[A-Z]\d{7}$/,
  name: /^[a-zA-Z\s'-]{1,50}$/,
};

function makeAssignmentId() {
  return `ra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AddEmployee() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeesList, addEmployee } = useEmployees();

  const { data: assignableRoles, isLoading, error } = useAssignableRoles();

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

  // Branches / teams — used only for scope selection on role assignments.
  // Orgs without multiple branches will just have one entry here ("Main").
  const [branches] = useState(["Main", "Chennai", "Coimbatore", "Bangalore"]);
  const [teams] = useState(["Sales", "Support", "Recruitment", "AP/AR"]);

  // ─── Form state ───
  const [form, setForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    roleIds: ["Employee"],
    // ★ replaces the old single `role: string` field
    roleAssignments: [
      {
        id: makeAssignmentId(),
        role: "Employee",
        scope: "organization" as ScopeType,
        scopeId: "",
      },
    ] as RoleAssignment[],

    reportingManager: "",
    department: "Engineering",
    location: "Bangalore",
    designation: "Software Engineer",
    employmentType: "Full-time",
    employeeStatus: "Active",
    sourceOfHire: "Referral",
    dateOfJoining: new Date().toISOString().split("T")[0],
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
        const parsed = JSON.parse(draft);
        setForm((prev) => ({
          ...prev,
          ...parsed,
          roleIds: parsed.roleIds || prev.roleIds || ["Employee"],
        }));
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

  // Sync first/last name removed

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

  // ─── Role assignment helpers ───

  const handleRoleIdsChange = (ids: string[]) => {
    // Keep at least one role assigned
    if (ids.length === 0) return;
    setForm((prev) => {
      const newAssignments = ids.map((id) => {
        const existing = prev.roleAssignments.find((a) => a.role === id);
        if (existing) return existing;
        return {
          id: makeAssignmentId(),
          role: id,
          scope: "organization" as ScopeType,
          scopeId: "",
        };
      });
      return {
        ...prev,
        roleIds: ids,
        roleAssignments: newAssignments,
      };
    });
  };

  const updateAssignmentScope = (
    id: string,
    scope: ScopeType,
    scopeId: string,
  ) => {
    setForm((f) => ({
      ...f,
      roleAssignments: f.roleAssignments.map((a) =>
        a.id === id ? { ...a, scope, scopeId } : a,
      ),
    }));
  };

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

  // A scoped assignment (branch/department/team) must have a scopeId chosen
  const areAssignmentsValid = form.roleAssignments.every(
    (a) => a.scope === "organization" || a.scopeId.trim() !== "",
  );

  const isStep1Valid =
    VALIDATION.employeeId.test(form.employeeId.trim()) &&
    VALIDATION.name.test(form.firstName.trim()) &&
    VALIDATION.name.test(form.lastName.trim()) &&
    VALIDATION.email.test(form.email.trim()) &&
    form.roleAssignments.length > 0 &&
    areAssignmentsValid &&
    isIdUnique &&
    isEmailUnique;

  const isStep2Valid =
    form.department.trim() !== "" &&
    form.location.trim() !== "" &&
    form.designation.trim() !== "" &&
    form.employmentType.trim() !== "" &&
    form.employeeStatus.trim() !== "" &&
    form.dateOfJoining.trim() !== "";

  const isStep3Valid = true; // All fields optional except DOB which has a default

  const isStep4Valid =
    (!form.aadhaarNumber ||
      VALIDATION.aadhaar.test(form.aadhaarNumber.trim())) &&
    (!form.panNumber || VALIDATION.pan.test(form.panNumber.trim())) &&
    (!form.uanNumber || VALIDATION.uan.test(form.uanNumber.trim())) &&
    (!form.passportNumber ||
      VALIDATION.passport.test(form.passportNumber.trim()));

  const isStep5Valid =
    (!form.personalMobile ||
      form.personalMobile.trim() === "+91" ||
      VALIDATION.mobile.test(form.personalMobile.trim())) &&
    (!form.workMobile || VALIDATION.mobile.test(form.workMobile.trim()));

  const isStep6Valid = true;

  const canContinue = () => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    if (step === 4) return isStep4Valid;
    if (step === 5) return isStep5Valid;
    if (step === 6) return isStep6Valid;
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

  const handleFinalSubmit = async () => {
    // Primary role kept for any legacy code that still reads a single
    // `role` field (e.g. list-view badges) — first non-Employee
    // assignment wins, otherwise falls back to Employee.
    const primaryRole =
      form.roleAssignments.find((a) => a.role !== "Employee")?.role ||
      "Employee";

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

    const newEmp: EmployeeInput = {
      id: form.employeeId.trim(),
      name: fullName,
      email: form.email.trim(),
      phone: form.personalMobile.trim(),
      department: form.department,
      role: primaryRole,
      roleAssignments: form.roleAssignments, // ★ full multi-role record
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

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmp),
      });

      if (!response.ok) {
        if (response.status === 403) {
          showToast(
            "You're no longer permitted to assign one of the selected roles. Refresh and try again.",
            "error",
          );
          return;
        }
        throw new Error("Server error during registration");
      }

      addEmployee(newEmp);

      try {
        const savedUsers = localStorage.getItem("nexus_registered_users") || "[]";
        const usersList = JSON.parse(savedUsers);
        const newPlatformUser = {
          id: `user-${Date.now()}`,
          name: fullName,
          email: form.email.trim(),
          initials: fullName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase(),
          role: primaryRole,
          roleAssignments: form.roleAssignments, // ★ persisted alongside the user
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
      showToast(`${fullName} has been added — invite sent.`, "success");
      navigate("/employees");
    } catch (err) {
      console.error("Failed to submit employee", err);
      showToast("Failed to create employee. Please try again.", "error");
    }
  };

  /* ─── Shared styles ─── */
  const labelCls = "block text-xs font-bold text-slate-700 uppercase mb-2";
  const inputCls =
    "w-full px-4 py-3.5 bg-[#F5F6F8] rounded-xl text-sm border-0 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 font-medium";
  const selectCls = inputCls;

  // Which scope options make sense to offer — keeps the dropdown short
  // for single-branch orgs instead of always showing all 4 types.
  const scopeOptionsFor = (assignment: RoleAssignment) => {
    const opts: { value: ScopeType; label: string }[] = [
      { value: "organization", label: "Whole organization" },
      { value: "branch", label: "Specific branch" },
      { value: "department", label: "Specific department" },
    ];
    if (assignment.role === "Manager") {
      opts.push({ value: "team", label: "Specific team" });
    }
    return opts;
  };

  const scopeValueListFor = (scope: ScopeType) => {
    if (scope === "branch") return branches;
    if (scope === "department") return depts;
    if (scope === "team") return teams;
    return [];
  };

  return (
    <div className="w-full px-4 md:px-12 py-8 bg-[#F8F9FD] min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate("/employees")}
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
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
          {[
            { s: 1, label: "Account" },
            { s: 2, label: "Work" },
            { s: 3, label: "Personal" },
            { s: 4, label: "Identity" },
            { s: 5, label: "Contact" },
            { s: 6, label: "Alerts" },
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
        {/* ═══ STEP 1: Create Account ═══ */}
        {step === 1 && (
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-black text-slate-800 mb-2">
              Create User Account
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Capture minimum identity to create login access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  className={inputCls}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  className={inputCls}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>
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
              <div className="md:col-span-1">
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
            </div>

            {/* Roles Dropdown Select */}
            <div className="mb-8">
              <label className={labelCls}>System Role</label>
              {error ? (
                <div className="text-xs text-rose-500 font-bold mb-2 flex items-center gap-1">
                  <Info size={12} /> Failed to load roles: {error.message}
                </div>
              ) : null}
              <select
                className={selectCls}
                value={form.roleIds[0] || ""}
                disabled={isLoading || !!error || (assignableRoles || []).length === 0}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    handleRoleIdsChange([val]);
                  }
                }}
              >
                {isLoading ? (
                  <option value="">Loading roles...</option>
                ) : (assignableRoles || []).length === 0 ? (
                  <option value="">
                    You don't have permission to assign additional roles. Contact your Admin if this employee needs elevated access.
                  </option>
                ) : (
                  <>
                    <option value="">Select a role...</option>
                    {assignableRoles?.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                You can only assign roles at or below your own level of access.
              </p>

              {/* Scope pickers — only shown once a role is checked */}
              {(form.roleIds || []).length > 0 && (
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 mt-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Role Scope Assignments
                  </h4>
                  {(form.roleIds || []).map((roleId) => {
                    const roleName = roleId;
                    const assignment = form.roleAssignments.find(
                      (a) => a.role === roleName,
                    );
                    if (!assignment) return null;

                    return (
                      <div
                        key={roleId}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl"
                      >
                        <span className="text-xs font-bold text-slate-700 shrink-0 sm:w-32">
                          {roleName}
                        </span>
                        <select
                          className={`${selectCls} sm:w-48 py-2 px-3 text-xs`}
                          value={assignment.scope}
                          onChange={(e) =>
                            updateAssignmentScope(
                              assignment.id,
                              e.target.value as ScopeType,
                              "",
                            )
                          }
                        >
                          {scopeOptionsFor(assignment).map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>

                        {assignment.scope !== "organization" && (
                          <select
                            className={`${selectCls} sm:w-48 py-2 px-3 text-xs`}
                            value={assignment.scopeId}
                            onChange={(e) =>
                              updateAssignmentScope(
                                assignment.id,
                                assignment.scope,
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Select…</option>
                            {scopeValueListFor(assignment.scope).map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {!areAssignmentsValid && (
                <p className="text-xs text-rose-500 font-bold mt-3 flex items-center gap-1">
                  <Info size={12} /> Pick a branch/department/team for every
                  scoped role above.
                </p>
              )}
            </div>

            <div className="mb-8">
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

            <div className="p-4 bg-emerald-50/30 rounded-2xl flex items-start gap-3 mb-10">
              <Info
                className="text-[var(--primary)] shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-xs text-emerald-900/60 leading-relaxed font-semibold">
                The user will receive an email invitation to create their own
                password.
              </p>
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

        {/* ═══ STEP 2: Work Information ═══ */}
        {step === 2 && (
          <div className="p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
            <div>
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
                  {/* Total Experience */}
                  <div>
                    <label className={labelCls}>Total Experience (Years)</label>
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
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100 mt-10">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                Back
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

        {/* ═══ STEP 3: Personal Information ═══ */}
        {step === 3 && (
          <div className="p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
            <div>
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
                    <select
                      className={selectCls}
                      value={form.bloodGroup}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          bloodGroup: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
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
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100 mt-10">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                Back
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
        )}

        {/* ═══ STEP 4: Identity Information ═══ */}
        {step === 4 && (
          <div className="p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="space-y-5">
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-4 border border-amber-100">
                  <Lock className="text-amber-600" size={14} />
                  <p className="text-[11px] text-amber-800/80 font-bold">
                    Sensitive Information: Only Admin and HR Managers can edit.
                    All updates are logged in the Audit Log.
                  </p>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-4">
                  Identity Information (optional)
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
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100 mt-10">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                Back
              </button>
              <button
                disabled={!canContinue()}
                onClick={() => setStep(5)}
                className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 5: Contact Information ═══ */}
        {step === 5 && (
          <div className="p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
            <div>
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
                    <label className={labelCls}>Emergency Contact Name</label>
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
                    <label className={labelCls}>Emergency Contact Mobile</label>
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
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100 mt-10">
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                Back
              </button>
              <button
                disabled={!canContinue()}
                onClick={() => setStep(6)}
                className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 6: Other Information ═══ */}
       

        {/* ═══ STEP 7: Alerts ═══ */}
        {step === 6 && (
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
                onClick={() => setStep(5)}
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
