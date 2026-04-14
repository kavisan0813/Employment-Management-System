import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employee Directory",
  "/departments": "Departments",
  "/attendance": "Attendance Tracker",
  "/payroll": "Payroll Management",
  "/recruitment": "Recruitment Pipeline",
  "/performance": "Performance Reviews",
  "/reports": "Reports & Analytics",
  "/settings": "System Settings",
  "/profile": "My Profile",
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const basePath = "/" + location.pathname.split("/")[1];
  const isEmployeeProfile = location.pathname.startsWith("/employees/") && location.pathname !== "/employees";
  const title = isEmployeeProfile ? "Employee Profile" : (pageTitles[basePath] || "NexusHR EMS");

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh", color: "var(--foreground)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
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
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
