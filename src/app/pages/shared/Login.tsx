import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Zap,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Users,
  Coins,
  Briefcase,
  User,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import {
  useAuth,
  UserRole,
  ROLE_HOME_ROUTE,
  ROLE_CONFIG,
} from "../../context/AuthContext";
import { db } from "../../admin/mockData";

// ─── Demo account map (role → credentials) ──────────────────
const DEMO_ACCOUNTS: Record<
  UserRole,
  { email: string; name: string; initials: string }
> = {
  "Platform Admin": {
    email: "platform@nexushr.com",
    name: "System Root",
    initials: "SR",
  },
  "Super Admin": {
    email: "admin@nexushr.com",
    name: "Ryan Park",
    initials: "RP",
  },
  "HR Manager": {
    email: "hr@nexushr.com",
    name: "Alex Johnson",
    initials: "AJ",
  },
  Finance: {
    email: "finance@nexushr.com",
    name: "Priya Sharma",
    initials: "PS",
  },
  Manager: {
    email: "manager@nexushr.com",
    name: "Sarah Chen",
    initials: "SC",
  },
  Employee: {
    email: "emp@nexushr.com",
    name: "Priya Sharma",
    initials: "PS",
  },
};

interface RegisteredUser {
  email: string;
  name: string;
  initials: string;
  role?: string;
  id?: string;
}

const ROLE_ICONS: Record<UserRole, React.ComponentType<LucideProps>> = {
  "Platform Admin": ShieldCheck,
  "Super Admin": ShieldAlert,
  "HR Manager": Users,
  Finance: Coins,
  Manager: Briefcase,
  Employee: User,
};

export function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      const homeRoute = ROLE_HOME_ROUTE[user.role] || "/employee/dashboard";
      navigate(homeRoute, { replace: true });
    }
  }, [user, navigate]);

  const detectRole = (emailVal: string): UserRole => {
    if (!emailVal) return "Employee";

    // 1. Check system db (mock database) first
    try {
      const dbUsers = db.users.get();
      const match = dbUsers.find(
        (u) => u.email.toLowerCase() === emailVal.toLowerCase(),
      );
      if (match && match.role) {
        if (match.role === "Org Admin") {
          return "Super Admin";
        }
        return match.role as UserRole;
      }
    } catch (e) {
      console.log(e);
    }

    // 2. Check registered users list in localStorage
    try {
      const registered = localStorage.getItem("nexus_registered_users");
      if (registered) {
        const users = JSON.parse(registered);
        const match = users.find(
          (u: RegisteredUser) =>
            u.email.toLowerCase() === emailVal.toLowerCase(),
        );
        if (match && match.role) {
          if (match.role === "Org Admin") return "Super Admin";
          return match.role as UserRole;
        }
      }
    } catch (e) {
      console.log(e);
    }

    // 3. Fallback to keyword detection
    const lower = emailVal.toLowerCase();
    if (lower.includes("platform")) return "Platform Admin";
    if (lower.includes("admin")) return "Super Admin";
    if (lower.includes("hr")) return "HR Manager";
    if (lower.includes("finance")) return "Finance";
    if (lower.includes("manager")) return "Manager";
    return "Employee";
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const role: UserRole = detectRole(email);

      // Check system db for name/initials
      let accountName = "";
      let accountInitials = "";
      try {
        const dbUsers = db.users.get();
        const match = dbUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (match) {
          accountName = match.name;
        }
      } catch (err) {
        console.log(err);
      }

      // Check registered users list for name/initials if not found in db
      if (!accountName) {
        try {
          const registered = localStorage.getItem("nexus_registered_users");
          if (registered) {
            const users = JSON.parse(registered);
            const match = users.find(
              (u: RegisteredUser) =>
                u.email.toLowerCase() === email.toLowerCase(),
            );
            if (match) {
              accountName = match.name;
              accountInitials = match.initials;
            }
          }
        } catch (err) {
          console.log(err);
        }
      }

      // Fallback to demo account details if not found in either list
      if (!accountName || !accountInitials) {
        const demo = DEMO_ACCOUNTS[role];
        if (demo) {
          if (!accountName) accountName = demo.name;
          if (!accountInitials) accountInitials = demo.initials;
        } else {
          if (!accountName) accountName = "User";
        }
      }

      if (!accountInitials) {
        accountInitials =
          accountName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "JD";
      }

      login({
        name: accountName,
        email:
          email || (DEMO_ACCOUNTS[role] ? DEMO_ACCOUNTS[role].email : email),
        role,
        initials: accountInitials,
      });

      const route =
        role === "Platform Admin"
          ? "/platform-admin/dashboard"
          : ROLE_HOME_ROUTE[role] || "/employee/dashboard";
      navigate(route, { replace: true });
      setIsLoading(false);
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link sent to " + resetEmail);
    setIsForgotPassword(false);
  };

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      const demo = DEMO_ACCOUNTS[role];
      login({
        name: demo.name,
        email: demo.email,
        role,
        initials: demo.initials,
      });
      navigate(ROLE_HOME_ROUTE[role], { replace: true });
      setIsLoading(false);
    }, 500);
  };

  const handlePlatformDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: "System Root",
        email: "platform@nexushr.com",
        role: "Platform Admin",
        initials: "SR",
      });
      navigate("/platform-admin/dashboard", { replace: true });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#E0F2FE",
      }}
    >
      <div
        className="relative z-10 w-full max-w-[440px] rounded-[32px] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
          >
            <Zap size={32} color="white" fill="white" />
          </div>
          <h1
            style={{
              color: "var(--foreground)",
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            NexusHR
          </h1>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "14px",
              fontWeight: 600,
              marginTop: "6px",
            }}
          >
            Enterprise Management System
          </p>
        </div>

        {isForgotPassword ? (
          /* ── Forgot Password ── */
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--muted-foreground)",
                  marginBottom: "16px",
                }}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "8px",
                }}
              >
                Work Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@nexushr.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full relative group overflow-hidden rounded-2xl py-4 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                border: "none",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-[15px]">
                Send Reset Link{" "}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1.5"
                />
              </span>
            </button>
            <div className="text-center pt-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(false);
                }}
                className="hover:underline transition-all"
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                Back to Login
              </a>
            </div>
          </form>
        ) : (
          /* ── Login Form ── */
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "8px",
                }}
              >
                Work Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  type="email"
                  placeholder="admin@nexushr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              {/*   {email && (
                <div
                  className="mt-2.5 flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
                  style={{ backgroundColor: ROLE_CONFIG[detectedRole].bg }}
                >
                
                </div>
              )} */}
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: "#10B981" }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  Remember me
                </span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                }}
                className="hover:underline transition-all"
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-2xl py-4 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                border: "none",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-[15px]">
                {isLoading ? "Signing in…" : "Login"}
                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                )}
              </span>
            </button>
          </form>
        )}

        {/* Quick Demo Access */}
        <div
          className="mt-6 pt-5 border-t border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Quick Demo Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(DEMO_ACCOUNTS)
              .filter((k) => k !== "Platform Admin")
              .map((roleKey, idx, arr) => {
                const role = roleKey as UserRole;
                const demo = DEMO_ACCOUNTS[role];
                const config = ROLE_CONFIG[role];
                const isLast = idx === arr.length - 1;
                const Icon = ROLE_ICONS[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleDemoLogin(role)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group ${
                      isLast ? "col-span-2 justify-center" : ""
                    }`}
                    style={{
                      borderColor: config.color + "30",
                      backgroundColor: config.bg,
                    }}
                  >
                    <div
                      className="p-1 rounded-lg"
                      style={{
                        backgroundColor: config.color + "15",
                        color: config.color,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-wide group-hover:underline leading-tight"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate leading-normal">
                        {demo.name}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Separate Platform Admin Login Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handlePlatformDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group justify-center"
              style={{
                borderColor: "#6366F130",
                backgroundColor: "rgba(99,102,241,0.06)",
              }}
            >
              <div
                className="p-1 rounded-lg"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.12)",
                  color: "#6366F1",
                }}
              >
                <ShieldCheck size={14} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[11px] font-extrabold uppercase tracking-wide group-hover:underline leading-tight"
                  style={{ color: "#6366F1" }}
                >
                  Platform System Admin Console
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            New to NexusHR?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              className="hover:underline transition-all"
              style={{ color: "var(--primary)", fontWeight: 800 }}
            >
              Create an Account
            </a>
          </p>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--muted-foreground)",
            }}
          >
            v2.0.4 · Enterprise Protection Active
          </p>
        </div>
      </div>
    </div>
  );
}
