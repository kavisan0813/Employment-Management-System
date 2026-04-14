import { useState } from "react";
import { Bell, Search, ChevronDown, Settings, LogOut, User, Sun, Moon } from "lucide-react";

interface TopbarProps {
  title: string;
  sidebarWidth: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Topbar({ title, sidebarWidth, isDark, onToggleTheme }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState(3);

  return (
    <div
      className="fixed top-0 right-0 flex items-center h-16 z-40 transition-all duration-300"
      style={{
        left: `${sidebarWidth}px`,
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        paddingLeft: "24px",
        paddingRight: "24px",
        gap: "16px",
      }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1
          style={{
            color: "var(--foreground)",
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
          Monday, April 6, 2026
        </p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-xl px-3"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          height: "38px",
          width: "260px",
        }}
      >
        <Search size={15} color="var(--muted-foreground)" />
        <input
          type="text"
          placeholder="Search employees..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "13px",
            color: "var(--foreground)",
            width: "100%",
          }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="flex items-center justify-center rounded-xl transition-colors"
        style={{
          width: "38px",
          height: "38px",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          cursor: "pointer",
        }}
      >
        {isDark ? <Sun size={16} color="var(--primary)" /> : <Moon size={16} color="var(--primary)" />}
      </button>

      {/* Notifications */}
      <button
        className="relative flex items-center justify-center rounded-xl transition-colors"
        style={{
          width: "38px",
          height: "38px",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
      >
        <Bell size={16} color="var(--primary)" />
        {notifications > 0 && (
          <span
            className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full"
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#EF4444",
              fontSize: "9px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {notifications}
          </span>
        )}
      </button>

      {/* User Avatar / Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: showDropdown ? "var(--accent)" : "var(--background)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            if (!showDropdown) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
          >
            <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>RP</span>
          </div>
          <div className="text-left hidden md:block">
            <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, lineHeight: 1.2 }}>
              Ryan Park
            </p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", lineHeight: 1.2 }}>Admin</p>
          </div>
          <ChevronDown
            size={14}
            color="var(--muted-foreground)"
            style={{ transition: "transform 0.2s", transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 shadow-lg"
              style={{
                width: "180px",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                  style={{ color: "var(--foreground)", fontSize: "13px" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  }}
                >
                  <item.icon size={14} color="var(--primary)" />
                  {item.label}
                </button>
              ))}
              <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "4px 0" }} />
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                style={{ color: "#EF4444", fontSize: "13px" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
