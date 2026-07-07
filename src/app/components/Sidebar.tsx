import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Users,
  CalendarCheck,
  IndianRupee,
  Briefcase,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  LogOut,
  Home,
  Lock,
  Sprout,
} from "lucide-react";
import { useAuth, type UserRole } from "../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Accordion-based navigation grouping is defined dynamically inside the Sidebar component.

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentRole = user?.role as UserRole | undefined;
  const isNewJoinee = false;

  // Accordion groups configuration based on active user role
  let groups: {
    label: string;
    icon: React.ElementType;
    path?: string;
    items?: { label: string; path: string; disabled?: boolean }[];
  }[] = [];

  if (isNewJoinee) {
    groups = [
      {
        label: "Home",
        icon: Home,
        items: [
          { label: "Smart Search", path: "/smart-search" },
          { label: "My Dashboard", path: "/employee/dashboard" },
          { label: "Notifications", path: "/notifications" },
        ],
      },
      {
        label: "My Journey",
        icon: Sprout,
        items: [
          { label: "🌱 My Onboarding", path: "/my-onboarding" },
          { label: "My Profile", path: "/profile" },
          { label: "My Documents", path: "/my-documents" },
          { label: "My Training", path: "/training" },
        ],
      },
      {
        label: "My Workspace",
        icon: Briefcase,
        items: [
          { label: "My Attendance", path: "/attendance" },
          { label: "My Leaves", path: "/leave" },
          { label: "My Payslips", path: "/payslips" },
          { label: "My Schedule", path: "/schedule" },
          { label: "My Performance", path: "/performance" },
          { label: "My Expenses", path: "/expenses" },
          { label: "My Assets", path: "/my-assets" },
        ],
      },
    ];
  } else if (currentRole === "Super Admin") {
    groups = [
      {
        label: "Home",
        icon: Home,
        items: [
          { label: "Smart Search", path: "/smart-search" },
          { label: "Dashboard", path: "/" },
          { label: "Notifications", path: "/notifications" },
        ],
      },
      {
        label: "Reports",
        icon: BarChart3,
        items: [{ label: "Reports & Analytics", path: "/reports" }],
      },
      {
        label: "Team Management",
        icon: Users,
        items: [
          { label: "Employees", path: "/employees" },
          { label: "Departments", path: "/departments" },
          { label: "Recruitment", path: "/recruitment" },
          { label: "Onboarding", path: "/onboarding" },
          { label: "Offboarding", path: "/offboarding" },
        ],
      },
      {
        label: "HR Operations",
        icon: CalendarCheck,
        items: [
          { label: "Attendance", path: "/attendance" },
          { label: "Schedule", path: "/schedule" },
          { label: "Leave Management", path: "/leave" },
          { label: "Performance", path: "/performance" },
          { label: "Training", path: "/training" },
          { label: "Documents", path: "/documents" },
        ],
      },
      {
        label: "Finance & Payroll",
        icon: IndianRupee,
        items: [
          { label: "Payroll", path: "/payroll" },
          { label: "Expenses", path: "/expenses" },
          { label: "Asset Management", path: "/asset-management" },
          { label: "F&F Settlement", path: "/finance/settlements" },
          { label: "Increment & Appraisal", path: "/appraisal" },
          { label: "Audit Logs", path: "/settings/audit-logs" },
        ],
      },
      {
        label: "Account Management",
        icon: Lock,
        items: [{ label: "Manage Account", path: "/admin/manage-account" }],
      },
    ];
  } else if (currentRole === "HR Manager") {
    groups = [
      {
        label: "Home",
        icon: Home,
        items: [
          { label: "Smart Search", path: "/smart-search" },
          { label: "Dashboard", path: "/" },
          { label: "Notifications", path: "/notifications" },
        ],
      },
      {
        label: "Reports",
        icon: BarChart3,
        items: [{ label: "Reports & Analytics", path: "/reports" }],
      },
      {
        label: "Team Management",
        icon: Users,
        items: [
          { label: "Employees", path: "/employees" },
          { label: "Departments", path: "/departments" },
          { label: "Recruitment", path: "/recruitment" },
          { label: "Onboarding", path: "/onboarding" },
          { label: "Offboarding", path: "/offboarding" },
        ],
      },
      {
        label: "HR Operations",
        icon: CalendarCheck,
        items: [
          { label: "Attendance", path: "/attendance" },
          { label: "Schedule", path: "/schedule" },
          { label: "Leave Management", path: "/leave" },
          { label: "Performance", path: "/performance" },
          { label: "Training", path: "/training" },
          { label: "Documents", path: "/documents" },
        ],
      },
      {
        label: "My Workspace",
        icon: Briefcase,
        items: [
          { label: "My Dashboard", path: "/employee/dashboard" },
          { label: "My Attendance", path: "/employee/attendance" },
          { label: "My Leaves", path: "/employee/leave" },
          { label: "My Schedule", path: "/employee/schedule" },
          { label: "My Performance", path: "/employee/performance" },
        ],
      },
    ];
  } else if (currentRole === "Finance") {
    groups = [
      {
        label: "Home",
        icon: Home,
        items: [
          { label: "Smart Search", path: "/smart-search" },
          { label: "Finance Dashboard", path: "/" },
          { label: "Notifications", path: "/notifications" },
        ],
      },
      {
        label: "Reports",
        icon: BarChart3,
        items: [{ label: "Reports & Analytics", path: "/reports" }],
      },
      {
        label: "Finance Ops",
        icon: IndianRupee,
        items: [
          { label: "Employees (view)", path: "/employees" },
          { label: "Departments", path: "/departments" },
          { label: "Payroll", path: "/payroll" },
          { label: "Financial Onboarding", path: "/finance/onboarding" },
          { label: "Asset Cost Report", path: "/finance/asset-cost-report" },
          { label: "F&F Settlement", path: "/finance/settlements" },
          { label: "Expense Approvals", path: "/expenses" },
          { label: "Increment & Appraisal", path: "/appraisal" },
          { label: "Audit Logs", path: "/settings/audit-logs" },
        ],
      },
      {
        label: "My Workspace",
        icon: Briefcase,
        items: [
          { label: "My Dashboard", path: "/employee/dashboard" },
          { label: "My Attendance", path: "/attendance" },
          { label: "My Leaves", path: "/leave" },
          { label: "My Exit", path: "/my-exit" },
          { label: "My Payslips", path: "/payslips" },
          { label: "My Documents", path: "/my-documents" },
          { label: "My Assets", path: "/my-assets" },
          { label: "My Expenses", path: "/finance/my-expenses" },
          { label: "My Performance", path: "/performance" },
          { label: "My Schedule", path: "/schedule" },
          { label: "My Goals", path: "/goals" },
          { label: "My Profile", path: "/profile" },
          { label: "Support Ticket", path: "/support" },
        ],
      },
    ];
  } else if (currentRole === "Manager") {
    groups = [
      {
        label: "Home",
        icon: Home,
        items: [
          { label: "Smart Search", path: "/smart-search" },
          { label: "Team Dashboard", path: "/" },
          { label: "Notifications", path: "/notifications" },
        ],
      },
      {
        label: "Reports",
        icon: BarChart3,
        items: [{ label: "Reports & Analytics", path: "/reports" }],
      },
      {
        label: "My Team",
        icon: Users,
        items: [
          { label: "Team Dashboard", path: "/" },
          { label: "My Team", path: "/employees" },
          { label: "Team Attendance", path: "/attendance" },
          { label: "Team Schedule", path: "/schedule" },
          { label: "Leave Approvals", path: "/leave" },
          { label: "Team Performance", path: "/performance" },
          { label: "Team Appraisal", path: "/appraisal" },
          { label: "Team Training", path: "/training" },
          { label: "Team Onboarding", path: "/manager/team-onboarding" },
          { label: "Team Assets", path: "/manager/team-assets" },
          { label: "Exit Tasks", path: "/manager/exit-tasks" },
          { label: "Expense Approvals", path: "/expenses" },
          { label: "Recruitment", path: "/recruitment" },
        ],
      },
      {
        label: "My Workspace",
        icon: Briefcase,
        items: [
          { label: "My Dashboard", path: "/manager/my-dashboard" },
          { label: "My Exit", path: "/my-exit" },
          { label: "My Attendance", path: "/manager/my-attendance" },
          { label: "My Leaves", path: "/manager/my-leaves" },
          { label: "My Payslips", path: "/manager/my-payslips" },
          { label: "My Schedule", path: "/manager/my-schedule" },
          { label: "My Documents", path: "/manager/my-documents" },
          { label: "My Expenses", path: "/manager/my-expenses" },
          { label: "My Goals", path: "/manager/my-goals" },
          { label: "My Performance", path: "/manager/my-performance" },
          { label: "My Profile", path: "/profile" },
          { label: "Team Directory", path: "/manager/directory" },
          { label: "Support Ticket", path: "/manager/support" },
          { label: "Announcements", path: "/manager/announcements" },
        ],
      },
    ];
  } else {
    // Regular Employee role or fallback (nested under My Workspace)
    groups = [
      {
        label: "My Workspace",
        icon: Briefcase,
        items: [
          { label: "My Dashboard", path: "/employee/dashboard" },
          { label: "My Attendance", path: "/employee/attendance" },
          { label: "Leave", path: "/employee/leave" },
          { label: "Pay Slip", path: "/employee/payslip" },
          { label: "Schedule", path: "/employee/schedule" },
          { label: "My Performance", path: "/employee/performance" },
          { label: "Training", path: "/training" },
          { label: "Notifications", path: "/employee/notifications" },
        ],
      },
    ];
  }

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const activeGroup = groups.find((group) =>
      group.items?.some((item) => isActive(item.path) && !item.disabled),
    );
    if (activeGroup) {
      setExpandedGroups((prev) => {
        if (prev[activeGroup.label]) return prev;
        return {
          ...prev,
          [activeGroup.label]: true,
        };
      });
    }
  }, [location.pathname, currentRole]);

  const toggleGroup = (groupLabel: string) => {
    if (collapsed) {
      onToggle(); // expand sidebar
      setExpandedGroups((prev) => ({
        ...prev,
        [groupLabel]: true,
      }));
    } else {
      setExpandedGroups((prev) => ({
        ...prev,
        [groupLabel]: !prev[groupLabel],
      }));
    }
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;

    // Root dashboard handling
    if (path === "/") {
      return (
        currentPath === "/" ||
        currentPath === "/admin/dashboard" ||
        currentPath === "/hr/dashboard" ||
        currentPath === "/finance/dashboard" ||
        currentPath === "/manager/dashboard"
      );
    }

    // Exact match for employee dashboard to avoid double highlighting
    if (path === "/employee/dashboard") {
      return currentPath === "/employee/dashboard";
    }

    if (path === "/appraisal") {
      return (
        currentPath === "/appraisal" || currentPath === "/increment-approvals"
      );
    }

    if (path === "/payroll") {
      const isFinanceDash =
        currentPath === "/finance/dashboard" ||
        (currentPath === "/" && currentRole === "Finance");
      return currentPath === "/payroll" && !isFinanceDash;
    }

    if (path === "/settings") {
      return currentPath === "/settings";
    }

    return (
      currentPath === path ||
      (path !== "/" && currentPath.startsWith(path + "/")) ||
      currentPath.startsWith(path)
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
        {isNewJoinee && !collapsed && (
          <div
            className="mx-3 mb-4 p-3 rounded-xl border border-[#00B87C]/20"
            style={{ backgroundColor: "rgba(0,184,124,0.08)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00B87C] to-[#059669] flex items-center justify-center text-white text-[11px] font-black shrink-0">
                PS
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-foreground truncate">
                  Priya Sharma
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Frontend Developer · Engineering
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" />
              <span className="text-[10px] font-bold text-[#00B87C]">
                Onboarding in Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--muted)" }}
              >
                <div
                  className="h-full bg-[#00B87C] rounded-full"
                  style={{ width: "45%" }}
                />
              </div>
              <span className="text-[9px] font-bold text-[#00B87C] shrink-0">
                45%
              </span>
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          {groups.map((group) => {
            const GroupIcon = group.icon;

            // Check if any child item inside this group is active
            const isGroupActive = group.path
              ? isActive(group.path)
              : group.items?.some(
                  (item) => !item.disabled && isActive(item.path),
                ) || false;

            return (
              <div key={group.label} className="px-2">
                {group.path ? (
                  <NavLink
                    to={group.path}
                    title={collapsed ? group.label : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: collapsed ? "10px 14px" : "9px 12px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      backgroundColor: isGroupActive
                        ? "rgba(0, 184, 124, 0.12)"
                        : "transparent",
                      color: isGroupActive
                        ? "#00B87C"
                        : "var(--sidebar-foreground)",
                      justifyContent: collapsed ? "center" : "flex-start",
                    }}
                    className={`group ${!isGroupActive && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
                  >
                    <GroupIcon
                      size={18}
                      style={{
                        color: isGroupActive ? "#00B87C" : "inherit",
                        flexShrink: 0,
                      }}
                    />
                    {!collapsed && (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isGroupActive ? 600 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {group.label}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <>
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.label)}
                      title={collapsed ? group.label : undefined}
                      className="w-full flex items-center gap-3 rounded-xl transition-all duration-200 border-none cursor-pointer"
                      style={{
                        padding: collapsed ? "10px 14px" : "9px 12px",
                        backgroundColor: "transparent",
                        color: isGroupActive
                          ? "#00B87C"
                          : "var(--sidebar-foreground)",
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--sidebar-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <GroupIcon
                        size={18}
                        style={{
                          color: isGroupActive ? "#00B87C" : "inherit",
                          flexShrink: 0,
                        }}
                      />
                      {!collapsed && (
                        <>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "left",
                              flex: 1,
                            }}
                          >
                            {group.label}
                          </span>
                          {/* Chevron Indicator */}
                          {expandedGroups[group.label] || false ? (
                            <ChevronDown size={14} style={{ opacity: 0.7 }} />
                          ) : (
                            <ChevronRight size={14} style={{ opacity: 0.7 }} />
                          )}
                        </>
                      )}
                    </button>

                    {/* Sub-items list (if expanded and sidebar is not collapsed) */}
                    {!collapsed &&
                      (expandedGroups[group.label] || false) &&
                      group.items && (
                        <ul
                          className="mt-1 space-y-0.5"
                          style={{ paddingLeft: "28px" }}
                        >
                          {group.items.map((item) => {
                            if (item.disabled) {
                              return (
                                <li key={item.label}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      padding: "7px 12px",
                                      borderRadius: "8px",
                                      textDecoration: "none",
                                      opacity: 0.45,
                                      cursor: "not-allowed",
                                      position: "relative",
                                    }}
                                    className="group"
                                  >
                                    <div className="relative flex items-center">
                                      <Lock
                                        size={12}
                                        style={{
                                          color: "var(--muted-foreground)",
                                          marginRight: "6px",
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          color: "var(--muted-foreground)",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {item.label}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            }

                            const active = isActive(item.path);
                            return (
                              <li key={item.label}>
                                <NavLink
                                  to={item.path}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "7px 12px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                    backgroundColor: active
                                      ? "rgba(0, 184, 124, 0.12)"
                                      : "transparent",
                                    color: active
                                      ? "#00B87C"
                                      : "var(--sidebar-foreground)",
                                  }}
                                  className={`group ${!active && "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"}`}
                                >
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: active ? 600 : 500,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {item.label}
                                  </span>
                                  {active && (
                                    <span
                                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00B87C]"
                                      style={{ flexShrink: 0 }}
                                    />
                                  )}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div
        className="shrink-0 px-2 pb-4"
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          paddingTop: "12px",
        }}
      >
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
