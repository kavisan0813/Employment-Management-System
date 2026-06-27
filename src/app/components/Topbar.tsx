import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  X,
  UserSearch,
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  ClipboardList,
  Clock,
  CheckCheck,
} from "lucide-react";
import { employees } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  title: string;
  sidebarWidth: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Topbar({
  title,
  sidebarWidth,
  isDark,
  onToggleTheme,
}: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotificationsScreen, setShowAllNotificationsScreen] =
    useState(false);
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setNotifications(user?.role === "Finance" ? 5 : 3);
  }, [user?.role]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees =
    searchQuery.trim() === ""
      ? []
      : employees
          .filter(
            (emp) =>
              emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              emp.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              emp.id.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5);

  return (
    <div
      className="fixed top-0 right-0 flex items-center h-16 z-[1000] transition-all duration-300 px-4 md:px-8"
      style={{
        left: `${sidebarWidth}px`,
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        gap: "16px",
      }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        {title && title !== "NexusHR" && (
          <h1
            style={{
              color: "var(--foreground)",
              fontSize: "22px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.3px",
            }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Search */}
      <div className="relative" ref={searchRef}>
        <div
          className="flex items-center gap-2 rounded-full px-4 transition-all duration-200"
          style={{
            backgroundColor: "var(--background)",
            border: `1px solid ${showSearchResults && searchQuery ? "var(--primary)" : "var(--border)"}`,
            height: "38px",
            width: "280px",
            boxShadow:
              showSearchResults && searchQuery
                ? "0 0 0 2px var(--primary-muted)"
                : "none",
          }}
        >
          <Search
            size={15}
            color={searchQuery ? "var(--primary)" : "var(--muted-foreground)"}
          />
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
            className="absolute top-full left-0 mt-2 rounded-xl shadow-xl z-[2000] overflow-hidden"
            style={{
              width: "320px",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="px-4 py-2 border-b bg-neutral-50 dark:bg-zinc-800/50"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                EMPLOYEES
              </span>
            </div>
            {filteredEmployees.length > 0 ? (
              <div
                className="divide-y"
                style={{ borderColor: "var(--border)" }}
              >
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
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full border"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm truncate group-hover:text-[var(--primary)] transition-colors"
                        style={{ color: "var(--foreground)" }}
                      >
                        {emp.name}
                      </p>
                      <p
                        className="text-[11px] truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {emp.role} • {emp.department}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                    />
                  </div>
                ))}
                <div
                  className="px-4 py-2 text-center hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    See all results
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-10 h-10 bg-neutral-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserSearch size={20} className="text-gray-300" />
                </div>
                <p
                  style={{ color: "var(--muted-foreground)", fontSize: "13px" }}
                >
                  No employees found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="flex items-center justify-center rounded-full transition-colors"
        style={{
          width: "38px",
          height: "38px",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          cursor: "pointer",
        }}
      >
        {isDark ? (
          <Sun size={16} color="var(--primary)" />
        ) : (
          <Moon size={16} color="var(--primary)" />
        )}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) setNotifications(0);
          }}
          className="relative flex items-center justify-center rounded-full transition-colors"
          style={{
            width: "38px",
            height: "38px",
            backgroundColor:
              location.pathname === "/notifications" || showNotifications
                ? "var(--accent)"
                : "var(--background)",
            border: `1px solid ${location.pathname === "/notifications" ? "#00B87C" : "var(--border)"}`,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#00B87C";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              location.pathname === "/notifications"
                ? "#00B87C"
                : "var(--border)";
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
            <div
              className="fixed inset-0 z-[1000]"
              onClick={() => setShowNotifications(false)}
            />
            {user?.role === "Employee" ? (
              <EmployeeNotificationPanel
                onClose={() => setShowNotifications(false)}
                navigate={navigate}
              />
            ) : (
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
                  <span
                    style={{
                      color: "var(--foreground)",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Notifications
                  </span>
                  <button
                    onClick={() => {
                      setNotifications(0);
                      setShowNotifications(false);
                    }}
                    style={{
                      color: "var(--primary)",
                      fontSize: "12px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {(user?.role === "Finance"
                    ? [
                        {
                          text: "TDS Filing Deadline in 8 Days",
                          time: "10:30 AM",
                          color: "#EF4444",
                        },
                        {
                          text: "36 Expense Claims Awaiting Your Approval",
                          time: "9:45 AM",
                          color: "#F59E0B",
                        },
                        {
                          text: "Payroll Calculation In Progress — April 2026",
                          time: "9:00 AM",
                          color: "#6366F1",
                        },
                        {
                          text: "PF Payment Due — April 20",
                          time: "8:30 AM",
                          color: "#EF4444",
                        },
                        {
                          text: "Yuki Tanaka Increment Approved by You",
                          time: "8:00 AM",
                          color: "#00B87C",
                        },
                      ]
                    : [
                        {
                          text: "MFA Verification Required",
                          time: "2h ago",
                          color: "#EF4444",
                        },
                        {
                          text: "Leave Request Approved",
                          time: "3h ago",
                          color: "#00B87C",
                        },
                        {
                          text: "Payroll Disbursed",
                          time: "5h ago",
                          color: "#8B5CF6",
                        },
                      ]
                  ).map((n, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer"
                      style={{ borderBottom: "1px solid var(--border)" }}
                      onClick={() => setShowNotifications(false)}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: n.color }}
                      />
                      <div>
                        <p
                          style={{
                            color: "var(--foreground)",
                            fontSize: "13px",
                            lineHeight: 1.4,
                          }}
                        >
                          {n.text}
                        </p>
                        <p
                          style={{
                            color: "var(--muted-foreground)",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="px-4 py-3 text-center border-t cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => {
                    setShowNotifications(false);
                    navigate(
                      user?.role === "Employee"
                        ? "/my-notifications"
                        : "/notifications",
                    );
                  }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    View All Notifications
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Avatar / Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-colors"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: showDropdown
              ? "var(--accent)"
              : "var(--background)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent)";
          }}
          onMouseLeave={(e) => {
            if (!showDropdown)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--background)";
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
          >
            <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>
              {user?.initials || "RP"}
            </span>
          </div>
          <div className="text-left hidden md:block">
            <p
              style={{
                color: "var(--foreground)",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {user?.role === "Finance"
                ? `${user.name} / ${user.role}`
                : user?.name || "Ryan Park"}
            </p>
            {user?.role !== "Finance" && (
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "11px",
                  lineHeight: 1.2,
                }}
              >
                {user?.role || "Admin"}
              </p>
            )}
          </div>
          <ChevronDown
            size={14}
            color="var(--muted-foreground)"
            style={{
              transition: "transform 0.2s",
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-[1000]"
              onClick={() => setShowDropdown(false)}
            />
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
                ...(user?.role !== "Employee"
                  ? [{ icon: Settings, label: "Settings", path: "/settings" }]
                  : []),
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(item.path);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                  style={{ color: "var(--foreground)", fontSize: "13px" }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <item.icon size={14} color="var(--primary)" />
                  {item.label}
                </button>
              ))}
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--border)",
                  margin: "4px 0",
                }}
              />
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                style={{ color: "#EF4444", fontSize: "13px" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
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
        <div
          className="fixed inset-y-0 right-0 z-[2000] flex transition-all duration-300"
          style={{
            left: `${sidebarWidth}px`,
            backgroundColor: "var(--background)",
          }}
        >
          <div className="w-full h-full flex flex-col">
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-4">
                <h2
                  style={{
                    color: "var(--foreground)",
                    fontSize: "24px",
                    fontWeight: 800,
                  }}
                >
                  Notifications History
                </h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  3 Unread
                </span>
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
                  {
                    text: "Ensure multi-factor authentication is verified before April 30.",
                    time: "2h ago",
                    color: "#EF4444",
                    type: "Alert",
                    date: "April 6, 2026",
                  },
                  {
                    text: "Your annual leave request for May 12-15 has been approved by HR.",
                    time: "3h ago",
                    color: "#00B87C",
                    type: "Leave",
                    date: "April 6, 2026",
                  },
                  {
                    text: "Salary slip for March 2026 is available for download.",
                    time: "5h ago",
                    color: "#8B5CF6",
                    type: "Payroll",
                    date: "April 6, 2026",
                  },
                  {
                    text: "Sarah Johnson tagged you in security policy v2.3.",
                    time: "1d ago",
                    color: "#0EA5E9",
                    type: "Info",
                    date: "April 5, 2026",
                  },
                  {
                    text: "Wish Emily Chen a wonderful happy birthday today!",
                    time: "1d ago",
                    color: "#F59E0B",
                    type: "Birthday",
                    date: "April 5, 2026",
                  },
                  {
                    text: "David Miller requested a shift swap for next Friday.",
                    time: "2d ago",
                    color: "#00B87C",
                    type: "Leave",
                    date: "April 4, 2026",
                  },
                  {
                    text: "Quarterly increments have been logged into the performance matrix.",
                    time: "3d ago",
                    color: "#0EA5E9",
                    type: "Info",
                    date: "April 3, 2026",
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: n.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            style={{
                              color: n.color,
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            {n.type}
                          </span>
                          <p
                            style={{
                              color: "var(--foreground)",
                              fontSize: "16px",
                              fontWeight: 600,
                              marginTop: "4px",
                            }}
                          >
                            {n.text}
                          </p>
                        </div>
                        <span
                          style={{
                            color: "var(--muted-foreground)",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {n.date}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "var(--muted-foreground)",
                          fontSize: "13px",
                          marginTop: "8px",
                        }}
                      >
                        {n.time}
                      </p>
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

function EmployeeNotificationPanel({
  onClose,
  navigate,
}: {
  onClose: () => void;
  navigate: (path: string) => void;
}) {
  const [items, setItems] = useState([
    {
      id: 1,
      type: "Leave",
      title: "Leave Approved",
      message: "Your Sick Leave request for April 10-12 has been approved.",
      time: "2 hours ago",
      isRead: false,
      icon: Calendar,
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
      path: "/leave",
    },
    {
      id: 2,
      type: "Expense",
      title: "Expense Reimbursed",
      message: "Your travel expense claim (TXN-582) has been processed.",
      time: "5 hours ago",
      isRead: false,
      icon: CreditCard,
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.1)",
      path: "/expenses",
    },
    {
      id: 3,
      type: "Payslip",
      title: "Payslip Available",
      message: "March 2026 payslip is now available for download.",
      time: "1 day ago",
      isRead: true,
      icon: FileText,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.1)",
      path: "/payroll",
    },
    {
      id: 4,
      type: "HR Request",
      title: "Profile Update Request",
      message: "HR has requested additional documents for your bank update.",
      time: "2 days ago",
      isRead: false,
      icon: ClipboardList,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
      path: "/hr-requests",
    },
    {
      id: 5,
      type: "Attendance",
      title: "Regularization Success",
      message: "Your attendance correction for April 5th was approved.",
      time: "3 days ago",
      isRead: true,
      icon: Clock,
      color: "#06B6D4",
      bg: "rgba(6,182,212,0.1)",
      path: "/attendance",
    },
  ]);

  const markAllRead = () => {
    setItems(items.map((item) => ({ ...item, isRead: true })));
  };

  const handleItemClick = (item: (typeof items)[0]) => {
    setItems(items.map((i) => (i.id === item.id ? { ...i, isRead: true } : i)));
    onClose();
    navigate(item.path);
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-[1001] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        width: "360px",
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="px-5 py-4 border-b flex justify-between items-center bg-secondary/10"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span
            style={{
              color: "var(--foreground)",
              fontSize: "15px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Notifications
          </span>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          style={{
            color: "var(--primary)",
            fontSize: "11px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto no-scrollbar py-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group px-5 py-4 flex items-start gap-4 transition-all cursor-pointer relative ${!item.isRead ? "bg-primary/5" : "hover:bg-secondary/20"}`}
            onClick={() => handleItemClick(item)}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              <item.icon size={18} />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: item.color }}
                >
                  {item.type}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {item.time}
                </span>
              </div>
              <p
                style={{
                  color: "var(--foreground)",
                  fontSize: "13px",
                  fontWeight: item.isRead ? 600 : 800,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </p>
              <p className="truncate text-[12px] font-medium text-muted-foreground mt-0.5 leading-tight">
                {item.message}
              </p>
            </div>

            {!item.isRead && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            )}

            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div
        className="px-5 py-4 text-center border-t cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors group"
        style={{ borderColor: "var(--border)" }}
        onClick={() => {
          onClose();
          navigate("/my-notifications");
        }}
      >
        <span
          className="flex items-center justify-center gap-2"
          style={{
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          View All{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </span>
      </div>
    </div>
  );
}
