import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Zap,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import {
  useAuth,
  UserRole,
  ROLE_HOME_ROUTE,
  ROLE_CONFIG,
} from "../context/AuthContext";

// ─── Demo account map (role → credentials) ──────────────────
const DEMO_ACCOUNTS: Record<
  UserRole,
  { email: string; name: string; initials: string }
> = {
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
    name: "John Doe",
    initials: "JD",
  },
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Determine which role to use
      const role: UserRole = selectedRole || "Employee";
      const account = DEMO_ACCOUNTS[role];

      login({
        name: account.name,
        email: email || account.email,
        role,
        initials: account.initials,
      });

      navigate(ROLE_HOME_ROUTE[role], { replace: true });
      setIsLoading(false);
    }, 600);
  };

  const handleDemoLogin = (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    login({
      name: account.name,
      email: account.email,
      role,
      initials: account.initials,
    });
    navigate(ROLE_HOME_ROUTE[role], { replace: true });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link sent to " + resetEmail);
    setIsForgotPassword(false);
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
            {/* Role selector */}
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
                Sign in as
              </label>
              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full rounded-2xl pl-12 pr-10 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="">Select your role…</option>
                  {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
              {selectedRole && (
                <div
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: ROLE_CONFIG[selectedRole].bg }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: ROLE_CONFIG[selectedRole].color }}
                  >
                    {ROLE_CONFIG[selectedRole].label} access level selected
                  </span>
                </div>
              )}
            </div>

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

        {/* Quick Demo Login chips */}
        {!isForgotPassword && (
          <div className="mt-6">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "10px",
              }}
            >
              Quick demo access
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: ROLE_CONFIG[role].bg,
                    color: ROLE_CONFIG[role].color,
                    border: `1px solid ${ROLE_CONFIG[role].color}30`,
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

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
