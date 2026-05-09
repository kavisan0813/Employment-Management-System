import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  IndianRupee,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  CalendarDays,
  Store,
  Sparkles,
  CalendarClock,
  Award,
  BookOpen,
  Folder,
  Receipt,
  LogOut,
  ShieldCheck,
  Home,
  Megaphone,
  Clock,
  HelpCircle,
} from "lucide-react";
import { useAuth, ROLE_CONFIG, type UserRole } from "../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// ─── All nav items with role restrictions ────────────────────
const ALL_NAV_ITEMS: {
  icon: React.ElementType;
  label: string;
  path: string;
  roles?: UserRole[];
  section?: "MAIN MENU" | "MY WORKSPACE";
}[] = [
  { icon: Sparkles, label: "Smart Search", path: "/smart-search" },
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/", 
    roles: ["Super Admin", "HR Manager", "Finance", "Manager"] 
  },

  // Admin / HR Items
  {
    icon: Users,
    label: "Employees",
    path: "/employees",
    roles: ["Super Admin", "HR Manager", "Finance", "Manager"],
  },
  {
    icon: Store,
    label: "Departments",
    path: "/departments",
    roles: ["Super Admin", "HR Manager", "Finance"],
  },
  {
    icon: CalendarCheck,
    label: "Attendance",
    path: "/attendance",
    roles: ["Super Admin", "HR Manager", "Manager"],
  },
  {
    icon: CalendarClock,
    label: "Schedule",
    path: "/schedule",
    roles: ["Super Admin", "HR Manager", "Manager"],
  },
  {
    icon: CalendarDays,
    label: "Leave Management",
    path: "/leave",
    roles: ["Super Admin", "HR Manager", "Manager"],
  },
  {
    icon: IndianRupee,
    label: "Payroll",
    path: "/payroll",
    roles: ["Super Admin", "HR Manager", "Finance"],
  },
  {
    icon: Briefcase,
    label: "Recruitment",
    path: "/recruitment",
    roles: ["Super Admin", "HR Manager", "Manager"],
  },
  {
    icon: TrendingUp,
    label: "Performance",
    path: "/performance",
    roles: ["Super Admin", "HR Manager", "Manager"],
  },
  {
    icon: Award,
    label: "Increment & Appraisal",
    path: "/appraisal",
    roles: ["Super Admin", "HR Manager", "Finance", "Manager"],
  },
  {
    icon: BookOpen,
    label: "Training",
    path: "/training",
    roles: ["Super Admin", "HR Manager", "Manager", "Employee"],
  },
  {
    icon: Folder,
    label: "Documents",
    path: "/documents",
    roles: ["Super Admin", "HR Manager"],
  },
  {
    icon: Receipt,
    label: "Expenses",
    path: "/expenses",
    roles: ["Super Admin", "HR Manager", "Finance", "Manager"],
  },
  {
    icon: BarChart3,
    label: "Reports & Analytics",
    path: "/reports",
    roles: ["Super Admin", "HR Manager", "Finance", "Manager"],
  },
  {
    icon: Megaphone,
    label: "Announcements",
    path: "/notifications",
    roles: ["Super Admin", "HR Manager", "Finance", "Manager", "Employee"],
  },

  // My Workspace Items (for non-admins)
  {
    icon: Home,
    label: "My Dashboard",
    path: "/employee/dashboard",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: CalendarCheck,
    label: "My Attendance",
    path: "/attendance",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: CalendarDays,
    label: "My Leaves",
    path: "/leave",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: IndianRupee,
    label: "My Payslips",
    path: "/payslips",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: Folder,
    label: "My Documents",
    path: "/my-documents",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: Receipt,
    label: "My Expenses",
    path: "/expenses",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: TrendingUp,
    label: "My Performance",
    path: "/performance",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: Clock,
    label: "My Schedule",
    path: "/schedule",
    roles: ["Finance", "Manager", "Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: Users,
    label: "Directory",
    path: "/directory",
    roles: ["Employee"],
    section: "MY WORKSPACE",
  },
  {
    icon: HelpCircle,
    label: "Support & Helpdesk",
    path: "/support",
    roles: ["Employee"],
    section: "MY WORKSPACE",
  },
];


export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentRole = user?.role as UserRole | undefined;

  // Filter nav items based on current user's role and section
  const mainItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.section === "MY WORKSPACE") return false;
    if (!item.roles) return true;
    if (!currentRole) return false;
    return item.roles.includes(currentRole);
  });

  const workspaceItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.section !== "MY WORKSPACE") return false;
    if (!item.roles) return true;
    if (!currentRole) return false;
    return item.roles.includes(currentRole);
  });

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Root dashboard handling
    if (path === "/") {
      return currentPath === "/" || 
             currentPath === "/admin/dashboard" || 
             currentPath === "/hr/dashboard" || 
             currentPath === "/finance/dashboard" || 
             currentPath === "/manager/dashboard";
    }
    
    // Exact match for employee dashboard to avoid double highlighting
    if (path === "/employee/dashboard") {
      return currentPath === "/employee/dashboard";
    }

    return currentPath === path || (path !== "/" && currentPath.startsWith(path + "/")) || currentPath.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleConf = currentRole ? ROLE_CONFIG[currentRole] : null;

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
      <div
        className="flex items-center h-16 px-4 shrink-0"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #00B87C, #059669)",
          }}
        >
          <Zap size={18} color="white" fill="white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <span
              className="block whitespace-nowrap"
              style={{
                color: "var(--foreground)",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              NexusHR
            </span>
            <span
              className="block"
              style={{
                color: "var(--primary)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              EMS PLATFORM
            </span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && roleConf && (
        <div
          className="mx-3 mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
          style={{ backgroundColor: roleConf.bg }}
        >
          <ShieldCheck
            size={14}
            style={{ color: roleConf.color, flexShrink: 0 }}
          />
          <span
            className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
            style={{ color: roleConf.color }}
          >
            {currentRole}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
        {/* MAIN MENU Section */}
        {mainItems.length > 0 && (
          <div className="mb-4">
            {!collapsed && (
              <p
                className="px-4 mb-2"
                style={{
                  color: "var(--sidebar-foreground)",
                  opacity: 0.6,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                MAIN MENU
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {mainItems.map((item) => {
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
                        backgroundColor: active
                          ? "var(--sidebar-primary)"
                          : "transparent",
                        color: active
                          ? "var(--sidebar-primary-foreground)"
                          : "var(--sidebar-foreground)",
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                      className={`group ${!active && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
                    >
                      <item.icon
                        size={18}
                        style={{
                          color: active
                            ? "var(--sidebar-primary-foreground)"
                            : "inherit",
                          flexShrink: 0,
                        }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: active ? 600 : 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                      {active && !collapsed && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: "var(--sidebar-primary-foreground)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* MY WORKSPACE Section */}
        {workspaceItems.length > 0 && (
          <div>
            {!collapsed && (
              <p
                className="px-4 mb-2 mt-2"
                style={{
                  color: "var(--sidebar-foreground)",
                  opacity: 0.6,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                MY WORKSPACE
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {workspaceItems.map((item) => {
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
                        backgroundColor: active
                          ? "var(--sidebar-primary)"
                          : "transparent",
                        color: active
                          ? "var(--sidebar-primary-foreground)"
                          : "var(--sidebar-foreground)",
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                      className={`group ${!active && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
                    >
                      <item.icon
                        size={18}
                        style={{
                          color: active
                            ? "var(--sidebar-primary-foreground)"
                            : "inherit",
                          flexShrink: 0,
                        }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: active ? 600 : 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                      {active && !collapsed && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: "var(--sidebar-primary-foreground)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div
        className="shrink-0 px-2 pb-4"
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          paddingTop: "12px",
        }}
      >
        {/* Settings — only for Super Admin & HR Manager */}
        {(!currentRole ||
          ["Super Admin", "HR Manager"].includes(currentRole)) && (
          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: collapsed ? "10px 14px" : "9px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "all 0.15s ease",
              backgroundColor: isActive("/settings")
                ? "var(--sidebar-primary)"
                : "transparent",
              color: isActive("/settings")
                ? "var(--sidebar-primary-foreground)"
                : "var(--sidebar-foreground)",
              justifyContent: collapsed ? "center" : "flex-start",
              marginBottom: "6px",
            }}
            className={`group ${!isActive("/settings") && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
          >
            <Settings
              size={18}
              style={{
                color: isActive("/settings")
                  ? "var(--sidebar-primary-foreground)"
                  : "inherit",
                flexShrink: 0,
              }}
            />
            {!collapsed && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: isActive("/settings") ? 600 : 500,
                  whiteSpace: "nowrap",
                }}
              >
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
              style={{
                background: "linear-gradient(135deg, #00B87C, #059669)",
              }}
            >
              <span
                style={{ color: "white", fontSize: "12px", fontWeight: 700 }}
              >
                {user.initials}
              </span>
            </div>
            <div className="overflow-hidden flex-1">
              <p
                style={{
                  color: "var(--foreground)",
                  fontSize: "12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                }}
              >
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
          {!collapsed && (
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Sign Out</span>
          )}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center rounded-xl transition-colors"
          style={{
            padding: "8px",
            color: "var(--sidebar-foreground)",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--sidebar-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
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
