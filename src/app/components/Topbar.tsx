import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Bell, Search, ChevronDown, Settings, LogOut, User, Sun, Moon, X, UserSearch, ArrowRight } from "lucide-react";
import { employees } from "../data/mockData";


interface TopbarProps {
  title: string;
  sidebarWidth: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Topbar({ title, sidebarWidth, isDark, onToggleTheme }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotificationsScreen, setShowAllNotificationsScreen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = searchQuery.trim() === "" 
    ? [] 
    : employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);


  return (
    <div
      className="fixed top-0 right-0 flex items-center h-16 z-[1000] transition-all duration-300"
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
      <div className="relative" ref={searchRef}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 transition-all duration-200"
          style={{
            backgroundColor: "var(--background)",
            border: `1px solid ${showSearchResults && searchQuery ? "var(--primary)" : "var(--border)"}`,
            height: "38px",
            width: "280px",
            boxShadow: showSearchResults && searchQuery ? "0 0 0 2px var(--primary-muted)" : "none",
          }}
        >
          <Search size={15} color={searchQuery ? "var(--primary)" : "var(--muted-foreground)"} />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              color: "var(--foreground)",
              width: "100%",
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full"
            >
              <X size={12} color="var(--muted-foreground)" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() !== "" && (
          <div
            className="absolute top-full left-0 mt-2 rounded-xl shadow-xl z-50 overflow-hidden"
            style={{
              width: "320px",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-4 py-2 border-b bg-neutral-50 dark:bg-zinc-800/50" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
                EMPLOYEES
              </span>
            </div>
            {filteredEmployees.length > 0 ? (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      navigate(`/employees/${emp.id}`);
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
                  >
                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border" style={{ borderColor: "var(--border)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-[var(--primary)] transition-colors" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                      <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>{emp.role} • {emp.department}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))}
                <div 
                  className="px-4 py-2 text-center hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>See all results</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-10 h-10 bg-neutral-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserSearch size={20} className="text-gray-300" />
                </div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>No employees found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
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
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) setNotifications(0);
          }}
          className="relative flex items-center justify-center rounded-xl transition-colors"
          style={{
            width: "38px",
            height: "38px",
            backgroundColor: location.pathname === "/notifications" || showNotifications ? "var(--accent)" : "var(--background)",
            border: `1px solid ${location.pathname === "/notifications" ? "#00B87C" : "var(--border)"}`,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#00B87C";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = location.pathname === "/notifications" ? "#00B87C" : "var(--border)";
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

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-[1000]" onClick={() => setShowNotifications(false)} />
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-[1001] shadow-lg"
              style={{
                width: "320px",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="px-4 py-3 border-b flex justify-between items-center"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ color: "var(--primary)", fontSize: "12px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600 }}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {[
                  { text: "Emily Chen submitted a leave request", time: "5 mins ago", color: "#14B8A6" },
                  { text: "Payroll successfully processed", time: "1 hour ago", color: "#059669" },
                  { text: "New candidate application received", time: "2 hours ago", color: "#0EA5E9" }
                ].map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.color }} />
                    <div>
                      <p style={{ color: "var(--foreground)", fontSize: "13px", lineHeight: 1.4 }}>{n.text}</p>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="px-4 py-3 text-center border-t cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                style={{ borderColor: "var(--border)" }}
                onClick={() => { setShowNotifications(false); navigate("/notifications"); }}
              >
                <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>View All Notifications</span>
              </div>
            </div>
          </>
        )}
      </div>

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
            <div className="fixed inset-0 z-[1000]" onClick={() => setShowDropdown(false)} />
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-[1001] shadow-lg"
              style={{
                width: "180px",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {[
                { icon: User, label: "My Profile", path: "/profile" },
                { icon: Settings, label: "Settings", path: "/settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setShowDropdown(false); navigate(item.path); }}
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
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  setShowDropdown(false);
                  navigate("/login");
                }}
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

      {showAllNotificationsScreen && (
        <div className="fixed inset-y-0 right-0 z-50 flex transition-all duration-300" style={{ left: `${sidebarWidth}px`, backgroundColor: "var(--background)" }}>
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="flex items-center gap-4">
                <h2 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 800 }}>Notifications History</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>3 Unread</span>
              </div>
              <button 
                onClick={() => setShowAllNotificationsScreen(false)} 
                className="p-2 rounded-xl transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
              <div className="space-y-4">
                {[
                  { text: "Emily Chen submitted a leave request for Aug 12-15", time: "5 mins ago", color: "#14B8A6", type: "Leave Request", date: "April 6, 2026" },
                  { text: "Payroll for March 2026 successfully processed for 248 employees", time: "1 hour ago", color: "#059669", type: "Payroll", date: "April 6, 2026" },
                  { text: "New candidate application received for Senior Frontend Developer", time: "2 hours ago", color: "#0EA5E9", type: "Recruitment", date: "April 6, 2026" },
                  { text: "Quarterly Performance Review window is now open", time: "1 day ago", color: "#F59E0B", type: "System", date: "April 5, 2026" },
                  { text: "System maintenance scheduled for weekend downtime", time: "2 days ago", color: "#EF4444", type: "System", date: "April 4, 2026" },
                  { text: "Ryan Park updated company policies document", time: "3 days ago", color: "#8B5CF6", type: "Document", date: "April 3, 2026" },
                ].map((n, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800" style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}>
                    <div className="w-3 h-3 rounded-full mt-2 shrink-0" style={{ backgroundColor: n.color }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span style={{ color: n.color, fontSize: "12px", fontWeight: 700 }}>{n.type}</span>
                          <p style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 600, marginTop: "4px" }}>{n.text}</p>
                        </div>
                        <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{n.date}</span>
                      </div>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "8px" }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
