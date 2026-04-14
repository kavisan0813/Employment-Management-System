import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employee Directory",
  "/attendance": "Attendance Tracker",
  "/payroll": "Payroll Management",
  "/recruitment": "Recruitment Pipeline",
  "/performance": "Performance Reviews",
  "/reports": "Reports & Analytics",
  "/settings": "System Settings",
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const basePath = "/" + location.pathname.split("/")[1];
  const isEmployeeProfile = location.pathname.startsWith("/employees/") && location.pathname !== "/employees";
  const title = isEmployeeProfile ? "Employee Profile" : (pageTitles[basePath] || "NexusHR EMS");

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div style={{ backgroundColor: "#F0FDF4", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar title={title} sidebarWidth={sidebarWidth} />
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
