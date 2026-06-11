import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "../context/AuthContext";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employee Directory",
  "/departments": "Departments",
  "/leave": "Leave Management",
  "/attendance": "Attendance Tracker",
  "/payroll": "Payroll Management",
  "/recruitment": "Recruitment Pipeline",
  "/onboarding": "Employee Onboarding",
  "/offboarding": "Offboarding / Exit Management",
  "/performance": "Performance Reviews",
  "/reports": "Reports & Analytics",
  "/settings": "System Settings",
  "/profile": "My Profile",
  "/my-onboarding": "My Onboarding",
  "/my-exit": "My Exit Checklist",
  "/notifications": "Notifications & Announcements",
  "/finance/dashboard": "Finance Dashboard",
  "/finance/asset-cost-report": "Asset Cost Report",
  "/finance/onboarding": "Financial Onboarding",
  "/manager/dashboard": "Team Dashboard",
  "/expenses": "Expense Approvals",
  "/appraisal": "Team Appraisal",
  "/training": "Team Training",
  "/manager/settings": "Settings",
  "/manager/team-onboarding": "Team Onboarding",
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const location = useLocation();

  if (!sessionStorage.getItem("isLoggedIn")) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const { user } = useAuth();
  const basePath = "/" + location.pathname.split("/")[1];
  const isEmployeeProfile =
    location.pathname.startsWith("/employees/") &&
    location.pathname !== "/employees";
  let title = isEmployeeProfile
    ? "Employee Profile"
    : pageTitles[basePath] || "NexusHR EMS";
  if (basePath === "/notifications" && user?.role === "Finance") {
    title = "Notifications";
  }
  if (location.pathname === "/employee/dashboard" && user?.role === "Finance") {
    title = "My Dashboard";
  }
  if (basePath === "/leave" && user?.role === "Finance") {
    title = "My Leaves";
  }
  if (basePath === "/schedule" && user?.role === "Finance") {
    title = "My Schedule";
  }

  const defaultSidebarWidth = user?.role === "Manager" ? 235 : 240;
  const sidebarWidth = collapsed ? 72 : defaultSidebarWidth;

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        color: "var(--foreground)",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <Topbar
        title={title}
        sidebarWidth={sidebarWidth}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "64px",
          minHeight: "100vh",
        }}
      >
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
