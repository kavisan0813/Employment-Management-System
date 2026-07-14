import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Zap,
  ArrowRight,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  Check,
  Globe,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { OrganizationService } from "../../admin/features/organizations/services/organization.service";
import { db } from "../../admin/mockData";
import { PlatformUser } from "../../admin/types";

interface PasswordStrength {
  score: number;
  label: "Weak" | "Medium" | "Strong";
  color: string;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
];

const INDUSTRIES = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Other",
];

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  India: [
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Delhi",
    "Telangana",
    "Gujarat",
    "Other",
  ],
  "United States": [
    "California",
    "New York",
    "Texas",
    "Florida",
    "Washington",
    "Illinois",
    "Other",
  ],
  "United Kingdom": [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "Other",
  ],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Other"],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "Other",
  ],
};
interface SignupFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  orgName: string;
  orgCode: string;
  industry: string;
  regNumber: string;
  gstNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  companySize: string;
  departmentsCount: string;
  plan: "Starter" | "Growth" | "Enterprise";
  billingCycle: "Monthly" | "Yearly";
}

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stepper state: 1 (Account), 2.1 (Basic Org), 2.2 (Address/Size), 2.4 (Review), 3 (Plan), "payment", "contact-sales"
  const [step, setStep] = useState<number | string>(() => {
    const savedStep = sessionStorage.getItem("nexus_onboarding_step");
    return savedStep ? JSON.parse(savedStep) : 1;
  });

  // Form State
  const [formData, setFormData] = useState<SignupFormData>(() => {
    const savedData = sessionStorage.getItem("nexus_onboarding_data");
    return savedData
      ? (JSON.parse(savedData) as SignupFormData)
      : {
          // Screen 1: Personal info
          fullName: "",
          email: "",
          countryCode: "+91",
          phone: "",
          password: "",
          confirmPassword: "",

          // Screen 2.1: Basic Org Info
          orgName: "",
          orgCode: "",
          industry: "",
          regNumber: "",
          gstNumber: "",

          // Screen 2.2: Org Address & Size
          country: "India",
          state: "",
          city: "",
          address: "",
          companySize: "",
          departmentsCount: "",

          // Screen 2.3: Contact & Branding

          // Screen 3: Billing Plan
          plan: "Starter" as "Starter" | "Growth" | "Enterprise",
          billingCycle: "Monthly" as "Monthly" | "Yearly",
        };
  });

  // Mock Credit Card Data for Payment step
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  // Password strength calculation
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Weak",
    color: "#EF4444",
  });

  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setStrength({ score: 0, label: "Weak", color: "#EF4444" });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) setStrength({ score, label: "Weak", color: "#EF4444" });
    else if (score === 3)
      setStrength({ score, label: "Medium", color: "#F59E0B" });
    else setStrength({ score, label: "Strong", color: "#10B981" });
  }, [formData.password]);

  // Sync to session storage
  useEffect(() => {
    sessionStorage.setItem("nexus_onboarding_step", JSON.stringify(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("nexus_onboarding_data", JSON.stringify(formData));
  }, [formData]);

  // Helper to suggest Org Code
  useEffect(() => {
    if (formData.orgName && !formData.orgCode) {
      const clean = formData.orgName.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const code = clean.slice(0, 3) + "001";
      setFormData((prev) => ({ ...prev, orgCode: code }));
    }
  }, [formData.orgName]);

  const handleInputChange = (
    field: keyof SignupFormData,
    value: string | boolean | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Screen 1: Submit account details
  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (strength.score < 2) {
      toast.error(
        "Password must be stronger (min 8 chars, 1 number, 1 symbol)",
      );
      return;
    }

    // Check email uniqueness
    const userList = db.users.get();
    if (
      userList.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase(),
      )
    ) {
      toast.error("An account with this email address already exists");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Create user record in system db with orgId = null
      const newUser: PlatformUser = {
        id: `user-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        status: "Active",
        role: "Org Admin", // Will link to Org later
        organization: "",
        organizationId: null,
        lastLoginAt: new Date().toISOString(),
        mfaEnabled: false,
        joinedAt: new Date().toISOString(),
        password: formData.password,
      };

      db.users.save([newUser, ...db.users.get()]);

      // Register user in registered list for quick login page reference
      const registeredUser = {
        name: formData.fullName,
        email: formData.email,
        role: "Super Admin", // Display level on Login page
        initials:
          formData.fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "JD",
      };

      const regListRaw = localStorage.getItem("nexus_registered_users");
      const regList = regListRaw ? JSON.parse(regListRaw) : [];
      regList.push(registeredUser);
      localStorage.setItem("nexus_registered_users", JSON.stringify(regList));

      // Auto-login the user into current context
      login({
        name: formData.fullName,
        email: formData.email,
        role: "Super Admin",
        initials: registeredUser.initials,
      });

      setIsLoading(false);
      toast.success(
        "Account created successfully! Verification email simulated.",
      );
      setStep(2.1);
    }, 1200);
  };

  // Screen 2.4: Save organization settings
  const confirmOrganization = () => {
    setIsLoading(true);

    setTimeout(() => {
      // Use OrgService to create the organization row in local DB
      const newOrg = OrganizationService.createOrganization({
        name: formData.orgName,
        code: formData.orgCode,
        domain:
          formData.orgName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
        industry: formData.industry,
        registrationNumber: formData.regNumber,
        gstNumber: formData.gstNumber,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        ownerEmail: formData.email,
        ownerName: formData.fullName,
        password: formData.password,
      });

      // Retrieve and update the user context role and org link
      login({
        name: formData.fullName,
        email: formData.email,
        role: "Super Admin",
        initials:
          formData.fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "JD",
      });

      sessionStorage.setItem("nexus_current_org_id", newOrg.id);

      setIsLoading(false);
      toast.success("Organization setup completed successfully!");
      setStep(3);
    }, 1500);
  };

  // Screen 3: Choose Plan
  const choosePlan = (planName: "Starter" | "Growth" | "Enterprise") => {
    if (planName === "Enterprise") {
      setStep("contact-sales");
      return;
    }

    setFormData((prev) => ({ ...prev, plan: planName }));

    if (planName === "Starter") {
      savePlanDetails("Starter");
    } else {
      setStep("payment");
    }
  };

  const savePlanDetails = (planName: "Starter" | "Growth") => {
    setIsLoading(true);

    setTimeout(() => {
      const orgId = sessionStorage.getItem("nexus_current_org_id");
      if (orgId) {
        // Update mock organizations plan
        const orgs = db.organizations.get();
        const updatedOrgs = orgs.map((o) =>
          o.id === orgId
            ? {
                ...o,
                plan: planName,
                seatLimit: planName === "Growth" ? 100 : 10,
              }
            : o,
        );
        db.organizations.save(updatedOrgs);

        // Update mock subscriptions
        const subs = db.subscriptions.get();
        const updatedSubs = subs.map((s) =>
          s.organizationId === orgId
            ? {
                ...s,
                plan: planName,
                billingCycle: (formData.billingCycle === "Yearly"
                  ? "Annual"
                  : "Monthly") as "Annual" | "Monthly",
                amount:
                  planName === "Growth"
                    ? formData.billingCycle === "Yearly"
                      ? 15990
                      : 1999
                    : 0,
              }
            : s,
        );
        db.subscriptions.save(updatedSubs);
      }

      setIsLoading(false);
      toast.success(`Activated the ${planName} Plan! Welcome aboard.`);

      sessionStorage.removeItem("nexus_onboarding_step");
      sessionStorage.removeItem("nexus_onboarding_data");
      sessionStorage.removeItem("nexus_current_org_id");

      navigate("/admin/dashboard");
    }, 1500);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      savePlanDetails(formData.plan as "Growth");
    }, 2000);
  };

  const submitContactSales = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        "Sales request submitted! Our team will contact you shortly.",
      );
      setStep(3);
    }, 1200);
  };

  // Helper validation for steps
  const isStep2_1Valid = () => {
    return formData.orgName && formData.orgCode && formData.industry;
  };

  const isStep2_2Valid = () => {
    return (
      formData.country &&
      formData.state &&
      formData.city &&
      formData.companySize
    );
  };

  const renderStepsIndicator = () => {
    const steps = [
      { num: 2.1, label: "Basic Info" },
      { num: 2.2, label: "Address & Size" },

      { num: 2.4, label: "Confirm" },
    ];

    const currentNum = typeof step === "number" ? step : 2.1;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => {
            const isActive = s.num === currentNum;
            const isCompleted = currentNum > s.num;

            return (
              <div
                key={s.num}
                className="flex items-center flex-1 last:flex-initial"
              >
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                        : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    {isCompleted ? <Check size={18} /> : index + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap hidden md:block uppercase tracking-wider ${
                      isActive ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full mx-4 transition-all duration-500 ${
                      currentNum > s.num
                        ? "bg-emerald-600"
                        : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 py-12"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#E0F2FE",
      }}
    >
      <div
        className={`relative z-10 w-full rounded-[32px] p-8 lg:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all ${
          step === 1
            ? "max-w-[600px]"
            : step === 3 || step === "payment" || step === "contact-sales"
              ? "max-w-[1100px]"
              : "max-w-[750px]"
        }`}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Render Header based on steps */}
        {step === 1 && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
              }}
            >
              <Zap size={28} color="white" fill="white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Create Founder Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
              Start by setting up your own personal account first
            </p>
          </div>
        )}

        {typeof step === "number" && step >= 2 && step < 3 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                <Building2 size={20} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Setup Your Organization
                </h1>
                <p className="text-xs text-gray-400">
                  Step-by-step wizard to register your company workspace
                </p>
              </div>
            </div>
            {renderStepsIndicator()}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 mb-4">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Choose the Best Plan for Your Team
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-[500px]">
              Select a flexible plan that grows with your organization. Upgrade,
              downgrade, or cancel anytime.
            </p>
          </div>
        )}

        {step === "payment" && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 mb-4">
              <CreditCard size={36} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Secure Checkout
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your payment details to activate the{" "}
              <strong>{formData.plan}</strong> subscription
            </p>
          </div>
        )}

        {step === "contact-sales" && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 mb-4">
              <Globe size={36} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Get in Touch with Sales
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[500px]">
              Tell us more about your enterprise needs and we will prepare a
              customized quote for your team.
            </p>
          </div>
        )}

        {/* STEP 1: CREATE ACCOUNT */}
        {step === 1 && (
          <form onSubmit={submitAccount} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Work Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@nexushr.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              {/* Phone Number with Country Code */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-[130px] shrink-0">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        handleInputChange("countryCode", e.target.value)
                      }
                      className="w-full rounded-2xl px-3 py-3 text-sm outline-none appearance-none cursor-pointer text-center font-semibold"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country.slice(0, 3)})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full rounded-2xl pl-12 pr-12 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Password Strength
                      </span>
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-full flex-1 transition-all duration-500"
                          style={{
                            backgroundColor:
                              i <= strength.score
                                ? strength.color
                                : "transparent",
                            opacity: i <= strength.score ? 1 : 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full rounded-2xl pl-12 pr-12 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    style={{
                      background: "var(--background)",
                      border:
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "1px solid #EF4444"
                          : "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-2xl py-4 mt-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                border: "none",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-[15px]">
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                )}
              </span>
            </button>

            <div className="text-center mt-6">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 hover:underline cursor-pointer font-extrabold"
                >
                  Log In
                </span>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2.1: BASIC INFO */}
        {step === 2.1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Org Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={formData.orgName}
                  onChange={(e) => handleInputChange("orgName", e.target.value)}
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Org Code */}

              {/* Industry Type */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Industry Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none appearance-none cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="" disabled>
                      Select Industry
                    </option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Company Registration Number */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  placeholder="ACM-REG-9912 (Optional)"
                  value={formData.regNumber}
                  onChange={(e) =>
                    handleInputChange("regNumber", e.target.value)
                  }
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* GST / Tax Number */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  GST / Tax Number
                </label>
                <input
                  type="text"
                  placeholder="GST-ACM-551X (Optional)"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    handleInputChange("gstNumber", e.target.value)
                  }
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-end mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                disabled={!isStep2_1Valid()}
                onClick={() => setStep(2.2)}
                className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-md hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
              >
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2.2: ORG ADDRESS & SIZE */}
        {step === 2.2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Organization Address & Size
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                        state: "",
                      }));
                    }}
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none appearance-none cursor-pointer text-gray-900 dark:text-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {STATES_BY_COUNTRY[formData.country] ? (
                    <>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none appearance-none cursor-pointer text-gray-900 dark:text-white"
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {STATES_BY_COUNTRY[formData.country].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ontario"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                    />
                  )}
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Company Size */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.companySize}
                    onChange={(e) =>
                      handleInputChange("companySize", e.target.value)
                    }
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none appearance-none cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="" disabled>
                      Select Size
                    </option>
                    {COMPANY_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz} employees
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Full Address
                </label>
                <textarea
                  placeholder="Enter full office address details (Optional)"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Number of Departments */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Number of Departments
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5 (Optional)"
                  min={1}
                  value={formData.departmentsCount}
                  onChange={(e) =>
                    handleInputChange("departmentsCount", e.target.value)
                  }
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(2.1)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                disabled={!isStep2_2Valid()}
                onClick={() => setStep(2.4)}
                className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-md hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
              >
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2.4: REVIEW & CONFIRM */}
        {step === 2.4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Review and Confirm Settings
            </h2>

            <div className="space-y-4">
              {/* Section 2.1 Info */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative">
                <span
                  onClick={() => setStep(2.1)}
                  className="absolute right-5 top-5 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Edit
                </span>
                <h3 className="font-extrabold text-sm text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                  Basic Organization Info
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Organization Name
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.orgName}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">
                      Industry
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.industry}
                    </span>
                  </div>
                  {(formData.regNumber || formData.gstNumber) && (
                    <>
                      {formData.regNumber && (
                        <div>
                          <span className="text-xs text-gray-400 block">
                            Registration Number
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formData.regNumber}
                          </span>
                        </div>
                      )}
                      {formData.gstNumber && (
                        <div>
                          <span className="text-xs text-gray-400 block">
                            GST/Tax ID
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formData.gstNumber}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Section 2.2 Info */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative">
                <span
                  onClick={() => setStep(2.2)}
                  className="absolute right-5 top-5 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Edit
                </span>
                <h3 className="font-extrabold text-sm text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                  Address & Size
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Location Address
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.city}, {formData.state}, {formData.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Company Size
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.companySize} employees
                    </span>
                  </div>
                  {formData.departmentsCount && (
                    <div>
                      <span className="text-xs text-gray-400 block">
                        Departments Count
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formData.departmentsCount}
                      </span>
                    </div>
                  )}
                  {formData.address && (
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400 block">
                        Full Address
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formData.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(2.2)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={confirmOrganization}
                className="flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
              >
                {isLoading ? "Saving Setup..." : "Confirm & Continue"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: CHOOSE PLAN */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full flex gap-1 items-center relative">
                <button
                  type="button"
                  onClick={() => handleInputChange("billingCycle", "Monthly")}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all ${
                    formData.billingCycle === "Monthly"
                      ? "bg-white text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("billingCycle", "Yearly")}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
                    formData.billingCycle === "Yearly"
                      ? "bg-white text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Yearly Billing
                  <span className="bg-emerald-100 text-emerald-700 font-bold text-[9px] px-1.5 py-0.5 rounded-md dark:bg-emerald-950/40 dark:text-emerald-400">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* STARTER */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col hover:shadow-xl transition-all">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Starter
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    ₹0
                  </span>
                  <span className="text-gray-400 text-xs font-semibold">
                    / forever
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-6 font-medium">
                  Ideal for small start-ups setup with core operations needs.
                </p>

                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                <ul className="space-y-3 flex-1 mb-8 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Up to 10 employees included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Basic attendance register</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Basic leave tracking</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => choosePlan("Starter")}
                  className="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-extrabold text-sm transition-all cursor-pointer text-center active:scale-95"
                >
                  Choose Starter
                </button>
              </div>

              {/* GROWTH */}
              <div className="bg-white dark:bg-gray-900 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col hover:shadow-2xl transition-all relative scale-105 shadow-md">
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Recommended
                </span>
                <h3 className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">
                  Growth
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {formData.billingCycle === "Yearly" ? "₹1,599" : "₹1,999"}
                  </span>
                  <span className="text-gray-400 text-xs font-semibold">
                    / month
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-6 font-medium">
                  For growing mid-sized organizations with payroll and
                  customized tracking needs.
                </p>

                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                <ul className="space-y-3 flex-1 mb-8 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Up to 100 employees included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Automated Payroll processing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Custom roles & permissions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Bulk employee details import</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => choosePlan("Growth")}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition-all cursor-pointer text-center shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  Choose Growth
                </button>
              </div>

              {/* ENTERPRISE */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col hover:shadow-xl transition-all">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Enterprise
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Custom
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-6 font-medium">
                  Designed for heavy requirements, large organizations, and
                  complex setups.
                </p>

                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                <ul className="space-y-3 flex-1 mb-8 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Unlimited employees</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Single Sign-On (SSO) integration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Full system Audit Logs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>Dedicated account support manager</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => choosePlan("Enterprise")}
                  className="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-extrabold text-sm transition-all cursor-pointer text-center active:scale-95"
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <span className="text-xs text-gray-500 font-semibold">
                Not sure? Start on{" "}
                <strong
                  onClick={() => choosePlan("Starter")}
                  className="text-emerald-600 hover:underline cursor-pointer"
                >
                  Starter
                </strong>{" "}
                — you can upgrade anytime.
              </span>
            </div>
          </div>
        )}

        {/* SCREEN 3.1: PAYMENT FLOW */}
        {step === "payment" && (
          <form
            onSubmit={submitPayment}
            className="max-w-[500px] mx-auto space-y-6"
          >
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
              <h4 className="font-extrabold text-sm uppercase tracking-wider mb-2">
                Order Summary
              </h4>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>Growth Subscription ({formData.billingCycle})</span>
                <span className="font-bold">
                  {formData.billingCycle === "Yearly" ? "₹15,990" : "₹1,999"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ryan Park"
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4111 2222 3333 4444"
                    value={cardData.number}
                    onChange={(e) => {
                      const v = e.target.value
                        .replace(/[^0-9]/g, "")
                        .replace(/(\d{4})/g, "$1 ")
                        .trim();
                      setCardData({ ...cardData, number: v });
                    }}
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] pl-11 pr-4 p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => {
                      const v = e.target.value
                        .replace(/[^0-9]/g, "")
                        .replace(/(\d{2})/g, "$1/")
                        .slice(0, 5);
                      setCardData({ ...cardData, expiry: v });
                    }}
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none text-gray-900 dark:text-white text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="•••"
                    value={cardData.cvc}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvc: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none text-gray-900 dark:text-white text-center"
                  />
                </div>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
              >
                {isLoading ? "Processing payment..." : "Pay & Activate Plan"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 3.2: CONTACT SALES FLOW */}
        {step === "contact-sales" && (
          <form
            onSubmit={submitContactSales}
            className="max-w-[500px] mx-auto space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Business Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  Tell us about your team size and requirements
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify total employee seat needs, custom SSO setups, or specialized integration requests..."
                  className="w-full bg-[#F5F6F8] dark:bg-gray-800 border-0 rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
              >
                {isLoading ? "Submitting request..." : "Submit Inquiry"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
