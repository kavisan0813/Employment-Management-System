import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  LogOut,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  usePermissions,
  filterNavigation,
  FULL_NAVIGATION,
} from "../shared/permission-engine";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { permissions } = usePermissions();

  // ── Permission-driven navigation ──────────────────────────────
  // Filter the full navigation tree to only items this user can see.
  // This replaces the 5 hardcoded `if (currentRole === "X")` blocks.
  const groups = filterNavigation(FULL_NAVIGATION, permissions);

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
  }, [location.pathname, permissions]);

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
      return currentPath === "/payroll";
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
              viyanHR
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
