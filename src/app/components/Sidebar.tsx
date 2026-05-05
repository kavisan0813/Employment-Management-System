import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, CalendarCheck, IndianRupee, Briefcase,
  TrendingUp, BarChart3, Settings, ChevronLeft, ChevronRight,
  Zap, CalendarDays, Store, Sparkles, CalendarClock,
  Award, UserPlus, BookOpen, Folder, Receipt, LogOut, ShieldCheck,
  Home, Megaphone, Users as UsersIcon, Clock,
  
} from "lucide-react";
import { useAuth, ROLE_CONFIG, type UserRole } from "../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// ─── All nav items with role restrictions ────────────────────
// `roles: undefined` means visible to all authenticated users
const ALL_NAV_ITEMS: {
  icon: React.ElementType;
  label: string;
  path: string;
  roles?: UserRole[];
}[] = [
  { icon: Sparkles,       label: "Smart Search",        path: "/smart-search" },
  { icon: LayoutDashboard,label: "Dashboard",           path: "/" },

  // People Management
  { icon: Users,          label: "Employees",           path: "/employees",   roles: ["Super Admin","HR Admin","Manager","Recruiter"] },
  { icon: UserPlus,       label: "Onboarding",          path: "/onboarding",  roles: ["Super Admin","HR Admin","Recruiter"] },
  { icon: Folder,         label: "Documents",           path: "/documents",   roles: ["Super Admin","HR Admin"] },
  { icon: Store,          label: "Departments",         path: "/departments", roles: ["Super Admin","HR Admin"] },

  // Time & Attendance
  { icon: CalendarCheck,  label: "Attendance",          path: "/attendance",  roles: ["Super Admin","HR Admin","Manager","Employee"] },
  { icon: CalendarClock,  label: "Schedule",            path: "/schedule",    roles: ["Super Admin","HR Admin","Manager"] },
  { icon: CalendarDays,   label: "Leave Management",    path: "/leave",       roles: ["Super Admin","HR Admin","Manager","Employee"] },

  // Finance
  { icon: IndianRupee,    label: "Payroll",             path: "/payroll",     roles: ["Super Admin","Payroll Admin"] },
  { icon: Receipt,        label: "Expenses",            path: "/expenses",    roles: ["Super Admin","Payroll Admin","HR Admin","Manager","Employee","Recruiter"] },

  // Talent
  { icon: Briefcase,      label: "Recruitment",         path: "/recruitment", roles: ["Super Admin","HR Admin","Recruiter"] },
  { icon: TrendingUp,     label: "Performance",         path: "/performance", roles: ["Super Admin","HR Admin","Manager"] },
  { icon: BookOpen,       label: "Training",            path: "/training",    roles: ["Super Admin","HR Admin","Manager","Recruiter","Employee"] },
  { icon: Award,          label: "Increment & Appraisal",path: "/appraisal", roles: ["Super Admin","HR Admin","Manager"] },

  // Analytics
  { icon: BarChart3,      label: "Reports",             path: "/reports",     roles: ["Super Admin","HR Admin","Manager","Payroll Admin"] },
];

const EMPLOYEE_NAV_ITEMS = [
  { icon: Home,          label: "My Dashboard",     path: "/" },
  { icon: CalendarCheck, label: "My Attendance",    path: "/attendance" },
  { icon: CalendarDays,  label: "My Leaves",        path: "/leave" },
  { icon: IndianRupee,   label: "My Payslips",      path: "/payroll" },
  { icon: Receipt,       label: "My Expenses",      path: "/expenses" },
  { icon: Folder,        label: "My Documents",     path: "/my-documents" },
  { icon: TrendingUp,    label: "My Performance",   path: "/performance" },
  { icon: Clock,         label: "Shift & Schedule", path: "/schedule" },

  { icon: BookOpen,      label: "Training",         path: "/training" },
  { icon: Megaphone,     label: "Announcements",    path: "/notifications" },
  { icon: UsersIcon,     label: "Team Directory",   path: "/employees" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const currentRole = user?.role as UserRole | undefined;

  // Filter nav items based on current user's role
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.roles) return true; // visible to all
    if (!currentRole) return false;
    return item.roles.includes(currentRole);
  });

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleConf = currentRole ? ROLE_CONFIG[currentRole] : null;

  if (currentRole === "Employee") {
    const activeNavItems = EMPLOYEE_NAV_ITEMS;
    
    return (
      <div
        className="fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-[2000] border-r"
        style={{
          width: "235px",
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center h-16 px-6 shrink-0">
          <div
            className="flex items-center justify-center rounded-[8px] shrink-0"
            style={{ width: "32px", height: "32px", backgroundColor: "var(--primary)" }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          <div className="ml-3">
            <span className="block text-[14px] font-bold text-foreground">
              NexusHR
            </span>
            <span className="block text-[10px] font-bold tracking-[0.5px] text-primary" style={{ fontVariant: "small-caps" }}>
              EMS PLATFORM
            </span>
          </div>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="mx-3 my-3 p-3 rounded-xl bg-primary/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                 {user.initials || "PS"}
               </div>
               <div>
                 <p className="text-[14px] font-bold text-foreground">{user.name}</p>
                 <p className="text-[12px] text-muted-foreground">Frontend Developer</p>
               </div>
            </div>
            <div className="space-y-1">
               <p className="text-[11px] text-muted-foreground/60">Engineering · #EMP-0142</p>
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-[11px] font-bold text-primary">Active</span>
               </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            MY WORKSPACE
          </p>
          <ul className="space-y-1">
            {activeNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      height: "40px",
                      padding: "0 12px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      backgroundColor: active ? "var(--primary)" : "transparent",
                      color: active ? "white" : "var(--muted-foreground)",
                    }}
                    className={!active ? "hover:bg-primary/10 hover:text-primary" : ""}
                  >
                    <item.icon size={16} className={active ? "text-white" : "text-muted-foreground/60 group-hover:text-primary"} />
                    <span className="text-[13px] font-bold whitespace-nowrap">
                      {item.label}
                    </span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border">
           {/* Same Bottom user card & logout */}
           <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all font-bold text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-[2000] shadow-sm"
      style={{
        width: collapsed ? "72px" : "240px",
        backgroundColor: "var(--sidebar-background)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #10B981, #059669)" }}
        >
          <Zap size={18} color="white" fill="white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <span className="block whitespace-nowrap" style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>
              NexusHR
            </span>
            <span className="block" style={{ color: "var(--primary)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.5px" }}>
              EMS PLATFORM
            </span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && roleConf && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: roleConf.bg }}>
          <ShieldCheck size={14} style={{ color: roleConf.color, flexShrink: 0 }} />
          <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: roleConf.color }}>
            {currentRole}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-4 mb-2" style={{ color: "var(--sidebar-foreground)", opacity: 0.6, fontSize: "10px", fontWeight: 700, letterSpacing: "1px" }}>
            MAIN MENU
          </p>
        )}
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: collapsed ? "10px 14px" : "9px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: active ? "var(--sidebar-primary)" : "transparent",
                    color: active ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  className={`group ${!active && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
                >
                  <item.icon size={18} style={{ color: active ? "var(--sidebar-primary-foreground)" : "inherit", flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ fontSize: "13px", fontWeight: active ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden" }}>
                      {item.label}
                    </span>
                  )}
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--sidebar-primary-foreground)", flexShrink: 0 }} />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 px-2 pb-4" style={{ borderTop: "1px solid var(--sidebar-border)", paddingTop: "12px" }}>
        {/* Settings — only for Super Admin & HR Admin */}
        {(!currentRole || ["Super Admin", "HR Admin"].includes(currentRole)) && (
          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: collapsed ? "10px 14px" : "9px 12px",
              borderRadius: "10px", textDecoration: "none", transition: "all 0.15s ease",
              backgroundColor: isActive("/settings") ? "var(--sidebar-primary)" : "transparent",
              color: isActive("/settings") ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
              justifyContent: collapsed ? "center" : "flex-start",
              marginBottom: "6px",
            }}
            className={`group ${!isActive("/settings") && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
          >
            <Settings size={18} style={{ color: isActive("/settings") ? "var(--sidebar-primary-foreground)" : "inherit", flexShrink: 0 }} />
            {!collapsed && (
              <span style={{ fontSize: "13px", fontWeight: isActive("/settings") ? 600 : 500, whiteSpace: "nowrap" }}>
                Settings
              </span>
            )}
          </NavLink>
        )}

        {/* User info card */}
        {!collapsed && user && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
            style={{ backgroundColor: "var(--sidebar-accent)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
            >
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>{user.initials}</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "10px", whiteSpace: "nowrap" }}>
                {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center rounded-xl transition-colors mb-2"
          style={{
            padding: collapsed ? "8px 14px" : "8px 12px",
            color: "#EF4444",
            backgroundColor: "rgba(239,68,68,0.06)",
            border: "none",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "12px",
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Sign Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center rounded-xl transition-colors"
          style={{ padding: "8px", color: "var(--sidebar-foreground)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--sidebar-accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft size={16} />
              <span style={{ fontSize: "12px" }}>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
