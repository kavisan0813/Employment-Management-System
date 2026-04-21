import { NavLink, useLocation } from "react-router";
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
} from "lucide-react";


interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: Sparkles, label: "Smart Search", path: "/smart-search" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },

  { icon: Users, label: "Employees", path: "/employees" },
  { icon: Store, label: "Departments", path: "/departments" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: CalendarClock, label: "Schedule", path: "/schedule" },
  { icon: CalendarDays, label: "Leave Management", path: "/leave" },
  { icon: IndianRupee, label: "Payroll", path: "/payroll" },
  { icon: Briefcase, label: "Recruitment", path: "/recruitment" },
  { icon: TrendingUp, label: "Performance", path: "/performance" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-50 shadow-sm"
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
            background: "linear-gradient(135deg, #10B981, #059669)",
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
              style={{ color: "var(--primary)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.5px" }}
            >
              EMS PLATFORM
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p
            className="px-4 mb-2"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.6, fontSize: "10px", fontWeight: 700, letterSpacing: "1px" }}
          >
            MAIN MENU
          </p>
        )}
        <ul className="space-y-1 px-2">
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
                    padding: collapsed ? "10px 14px" : "10px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: active ? "var(--sidebar-primary)" : "transparent",
                    color: active ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  className={`group ${!active && 'hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'}`}
                >
                  <item.icon
                    size={18}
                    style={{
                      color: active ? "var(--sidebar-primary-foreground)" : "inherit",
                      flexShrink: 0,
                    }}
                  />
                  {!collapsed && (
                    <span
                      style={{
                        fontSize: "14px",
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
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--sidebar-primary-foreground)", flexShrink: 0 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div
        className="shrink-0 px-2 pb-4"
        style={{ borderTop: "1px solid var(--sidebar-border)", paddingTop: "12px" }}
      >
        {/* User avatar section */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
            style={{ backgroundColor: "var(--sidebar-accent)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
            >
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>RP</span>
            </div>
            <div className="overflow-hidden">
              <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                Ryan Park
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px", whiteSpace: "nowrap" }}>HR Administrator</p>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center rounded-xl transition-colors"
          style={{
            padding: "8px",
            color: "var(--sidebar-foreground)",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--sidebar-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
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
