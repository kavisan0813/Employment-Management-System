import { useLocation, useNavigate } from "react-router";
import { 
  Check, ArrowRight, Calendar, BarChart3, Laptop, 
  ClipboardCheck, Settings, Users, HelpCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export function AuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure state with fallbacks for manual page access
  const { 
    name = "User", 
    email = "your-email@nexushr.com", 
    role = "Employee" 
  } = location.state || {};

  const handleGoToDashboard = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userRole", role);
    
    const roleRoutes: Record<string, string> = {
      "Super Admin": "/",
      "HR Admin": "/employees",
      "Manager": "/attendance",
      "Team Lead": "/schedule",
      "Employee": "/",
      "Payroll Admin": "/payroll",
      "Recruiter": "/recruitment"
    };

    navigate(roleRoutes[role] || "/");
  };

  const getRoleSpecificPortal = () => {
    switch (role) {
      case "Super Admin": return "Admin dashboard ready";
      case "HR Admin": return "HR Dashboard ready";
      case "Manager": return "Team dashboard ready";
      case "Employee": return "Employee portal ready";
      case "Payroll Admin": return "Payroll dashboard ready";
      case "Recruiter": return "Hiring dashboard ready";
      default: return "Dashboard ready";
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#F0FDF4] dark:bg-[#021410]"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
        <FloatingIcon icon={<Calendar size={32} />} top="15%" left="10%" delay={0} />
        <FloatingIcon icon={<BarChart3 size={40} />} top="65%" left="15%" delay={2} />
        <FloatingIcon icon={<Laptop size={36} />} top="20%" right="15%" delay={1.5} />
        <FloatingIcon icon={<ClipboardCheck size={32} />} top="75%" right="10%" delay={3} />
        <FloatingIcon icon={<Settings size={28} />} top="45%" left="5%" delay={1} />
        <FloatingIcon icon={<Users size={34} />} top="50%" right="5%" delay={2.5} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[500px] p-1 px-4"
      >
        <div 
          className="relative w-full rounded-[32px] p-8 lg:p-12 shadow-2xl border-t-4 border-t-emerald-500 flex flex-col items-center text-center overflow-hidden"
          style={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)",
            borderTopWidth: "4px" 
          }}
        >
          {/* Success Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-8"
          >
            <Check size={40} strokeWidth={3} />
          </motion.div>

          {/* Heading */}
          <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">
            Account Created! 🎉
          </h1>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-6">
            Welcome to NexusHR EMS, <span className="text-foreground font-bold">{name}</span>.<br />
            Your workspace has been set up successfully.
          </p>

          {/* Email Badge */}
          <div className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-10">
            {email}
          </div>

          {/* Status List */}
          <div className="w-full space-y-3 mb-10">
            <StatusRow text="Dashboard ready" delay={0.6} />
            <StatusRow text="Welcome email sent" delay={0.8} />
            <StatusRow text={getRoleSpecificPortal()} delay={1.0} />
          </div>

          {/* Primary Action */}
          <button
            onClick={handleGoToDashboard}
            className="w-full group relative overflow-hidden rounded-2xl py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Go to Dashboard
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          {/* Secondary Actions */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button 
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-muted-foreground hover:text-emerald-600 transition-colors"
            >
              Back to Login
            </button>
            <div className="w-1 h-1 rounded-full bg-border" />
            <button 
              className="text-xs font-bold text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle size={14} />
              Need Help?
            </button>
          </div>

          {/* Footer */}
          <p className="mt-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            v2.0 Enterprise HRMS Platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StatusRow({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-xs font-bold text-foreground opacity-90">{text}</span>
    </motion.div>
  );
}

function FloatingIcon({ icon, top, left, right, delay }: { icon: React.ReactNode; top: string; left?: string; right?: string; delay: number }) {
  return (
    <motion.div 
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay
      }}
      className="absolute text-emerald-600"
      style={{ top, left, right }}
    >
      {icon}
    </motion.div>
  );
}
