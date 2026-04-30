import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Mail, Lock, Zap, ArrowRight, User, Phone, 
  Building2, Briefcase, MapPin, Eye, EyeOff, 
  ShieldCheck, CheckCircle2, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

type UserRole = 
  | "Super Admin" 
  | "HR Admin" 
  | "Manager" 
  | "Payroll Admin" 
  | "Recruiter" 
  | "Employee";

interface PasswordStrength {
  score: number;
  label: "Weak" | "Medium" | "Strong";
  color: string;
}

export function Signup() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeId: "",
    department: "",
    role: "" as UserRole | "",
    location: "",
    password: "",
    confirmPassword: "",
    termsAccepted: true
  });

  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: "Weak", color: "#EF4444" });

  // Calculate Password Strength
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
    else if (score === 3) setStrength({ score, label: "Medium", color: "#F59E0B" });
    else setStrength({ score, label: "Strong", color: "#10B981" });
  }, [formData.password]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      const needsApproval = ["HR Admin", "Manager", "Payroll Admin"].includes(formData.role);
      
      if (needsApproval) {
        setIsSuccess(true);
      } else {
        navigate("/signup-success", { 
          state: { 
            name: formData.fullName, 
            email: formData.email, 
            role: formData.role 
          } 
        });
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{
          backgroundImage: "url('/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#E0F2FE",
        }}
      >
        <div 
          className="w-full max-w-[480px] rounded-[32px] p-12 text-center animate-in fade-in zoom-in-95 duration-500 shadow-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 style={{ color: "var(--foreground)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Registration Received
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "16px", fontWeight: 500, marginTop: "12px", lineHeight: "1.6" }}>
            Your account is awaiting administrator approval. You will receive an email once your access is provisioned.
          </p>
          
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-10 rounded-2xl py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
        className="relative z-10 w-full max-w-[600px] rounded-[32px] p-8 lg:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
            }}
          >
            <Zap size={28} color="white" fill="white" />
          </div>
          <h1 style={{ color: "var(--foreground)", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>
            Register to access the Employee Management System
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Full Name
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Work Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type="email"
                  required
                  placeholder="name@nexushr.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Mobile Number
              </label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Employee ID */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Employee ID <span style={{ fontWeight: 500, opacity: 0.6 }}>(Optional)</span>
              </label>
              <div className="relative group">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type="text"
                  placeholder="EMP-XXXXX"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Department
              </label>
              <div className="relative group">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-10 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="" disabled>Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Requested Role
              </label>
              <div className="relative group">
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full rounded-2xl pl-12 pr-10 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Payroll Admin">Payroll Admin</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Employee">Employee</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Location */}
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Location <span style={{ fontWeight: 500, opacity: 0.6 }}>(Optional)</span>
              </label>
              <div className="relative group">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-10 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="">Select Location</option>
                  <option value="Mumbai">Mumbai (HQ)</option>
                  <option value="Bangalore">Bangalore Hub</option>
                  <option value="Chennai">Chennai Office</option>
                  <option value="Delhi">Delhi Office</option>
                  <option value="Remote">Remote</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Empty space for alignment on desktop */}
            <div className="hidden md:block"></div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Strength</span>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="h-full flex-1 transition-all duration-500" 
                        style={{ 
                          backgroundColor: i <= strength.score ? strength.color : "transparent",
                          opacity: i <= strength.score ? 1 : 0.2
                        }} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                Confirm Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--primary)" }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full rounded-2xl pl-12 pr-12 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-[10px] font-bold text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-2xl py-4 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
              border: "none",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-[15px]">
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="text-emerald-600 hover:underline cursor-pointer font-black">Sign In</a>
          </p>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)" }}>
            NexusHR Enterprise Security Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
}
