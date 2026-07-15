import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

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
  "/finance": "Finance",
  "/manager": "Team Management",
  "/expenses": "Expenses",
  "/appraisal": "Appraisal",
  "/training": "Training",
  "/employee": "My Workspace",
  "/goals": "Goals",
  "/support": "Support",
  "/schedule": "Schedule",
  "/payslips": "My Payslips",
  "/documents": "Documents",
  "/admin": "Admin",
  "/asset-management": "Asset Management",
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

  // Determine page title from path, without role checks
  const fullPath = location.pathname;
  const basePath = "/" + fullPath.split("/")[1];
  const isEmployeeProfile =
    fullPath.startsWith("/employees/") && fullPath !== "/employees";

  const title = isEmployeeProfile
    ? "Employee Profile"
    : pageTitles[fullPath] || pageTitles[basePath] || "viyanHR";

  const sidebarWidth = collapsed ? 72 : 240;

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
