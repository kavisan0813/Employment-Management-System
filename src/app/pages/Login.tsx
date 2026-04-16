import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Zap, ArrowRight } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password reset logic
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
        backgroundColor: "#E0F2FE", // Fallback blue-ish
      }}
    >


      <div
        className="relative z-10 w-full max-w-[420px] rounded-[32px] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
            }}
          >
            <Zap size={32} color="white" fill="white" />
          </div>
          <h1 style={{ color: "#022C22", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            NexusHR
          </h1>
          <p style={{ color: "#064E3B", fontSize: "14px", fontWeight: 600, marginTop: "6px", opacity: 0.85 }}>
            Enterprise Management System
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#064E3B", marginBottom: "16px" }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
                Work Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
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
                Send Reset Link
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </button>
            <div className="text-center pt-2">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); }} className="hover:underline transition-all" style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>
                Back to Login
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
                Work Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
                <input
                  type="email"
                  required
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

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
                Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
                <input
                  type="password"
                  required
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: "#10B981" }}
                />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#022C22" }}>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }} className="hover:underline transition-all" style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>
                Forgot Password?
              </a>
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
                Login
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#064E3B", opacity: 0.7 }}>
            v2.0.4 · Enterprise Protection Active
          </p>
        </div>
      </div>
    </div>
  );
}
