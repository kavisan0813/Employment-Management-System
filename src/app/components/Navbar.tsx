import { useState } from "react";
import { Search, Bell, ChevronDown, Settings, LogOut, User, Moon, Sun } from "lucide-react";

export function Navbar({ title }: { title?: string }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Leave request from Sarah Johnson pending", time: "2h ago", unread: true },
    { id: 2, text: "Payroll processing complete for March", time: "5h ago", unread: true },
    { id: 3, text: "New candidate applied for UX Designer", time: "1d ago", unread: false },
    { id: 4, text: "Performance review deadline tomorrow", time: "1d ago", unread: false },
  ];

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3.5"
      style={{
        left: "260px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 style={{ color: "#1E293B", fontFamily: "Inter, sans-serif" }} className="text-lg font-semibold">
          {title || "Dashboard"}
        </h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ width: "16px", height: "16px", color: "#94A3B8" }}
          />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#1E293B",
              fontFamily: "Inter, sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <Bell style={{ width: "20px", height: "20px" }} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#EF4444" }}
            />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center justify-between">
                  <p style={{ color: "#1E293B" }} className="text-sm font-semibold">Notifications</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}
                  >
                    2 new
                  </span>
                </div>
              </div>
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-3 border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: "#F1F5F9",
                      backgroundColor: n.unread ? "#F8FAFC" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = n.unread ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <p style={{ color: "#1E293B" }} className="text-sm">{n.text}</p>
                    <p style={{ color: "#94A3B8" }} className="text-xs mt-0.5">{n.time}</p>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 text-center">
                <button style={{ color: "#2563EB" }} className="text-sm font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: "#E2E8F0" }} />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg transition-colors"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <img
              src="https://images.unsplash.com/photo-1584940121258-c2553b66a739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: "2px solid #E2E8F0" }}
            />
            <div className="text-left hidden sm:block">
              <p style={{ color: "#1E293B" }} className="text-sm font-medium leading-tight">Robert Chen</p>
              <p style={{ color: "#94A3B8" }} className="text-xs">VP Engineering</p>
            </div>
            <ChevronDown style={{ width: "14px", height: "14px", color: "#94A3B8" }} />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "#E2E8F0" }}>
                <p style={{ color: "#1E293B" }} className="text-sm font-semibold">Robert Chen</p>
                <p style={{ color: "#94A3B8" }} className="text-xs">robert.chen@company.com</p>
              </div>
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#374151" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <Icon style={{ width: "15px", height: "15px", color: "#64748B" }} />
                  {label}
                </button>
              ))}
              <div className="border-t" style={{ borderColor: "#E2E8F0" }}>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#EF4444" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FFF5F5")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <LogOut style={{ width: "15px", height: "15px" }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
