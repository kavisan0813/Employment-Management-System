import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Check,
  Settings,
  Calendar,
  IndianRupee,
  Info,
  Gift,
  Pin,
  X,
  Bold,
  Italic,
  Underline,
  List,
  RotateCcw,
  Link2,
  ArrowLeft,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NotificationItem {
  id: number;
  type: "Leave" | "Payroll" | "Alert" | "Info" | "Birthday";
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: "Approvals" | "Payroll" | "Mentions" | "System";
}

interface AnnouncementItem {
  id: number;
  type: "URGENT" | "IMPORTANT" | "HR UPDATE" | "INFO";
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  pinned: boolean;
}

export function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role === "Finance") {
    return <FinanceNotificationsView />;
  }

  const [activeFilter, setActiveFilter] = useState<
    "All" | "Unread" | "Approvals" | "Mentions" | "System"
  >("All");
  const [activeModal, setActiveModal] = useState<"create_announcement" | null>(
    null,
  );
  const [showPreferences, setShowPreferences] = useState(false);

  // Notification data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "Alert",
      title: "MFA Verification Required",
      description:
        "Ensure multi-factor authentication is verified before April 30.",
      time: "2h ago",
      read: false,
      category: "System",
    },
    {
      id: 2,
      type: "Leave",
      title: "Leave Request Approved",
      description:
        "Your annual leave request for May 12-15 has been approved by HR.",
      time: "3h ago",
      read: false,
      category: "Approvals",
    },
    {
      id: 3,
      type: "Payroll",
      title: "Payroll Disbursed",
      description: "Salary slip for March 2026 is available for download.",
      time: "5h ago",
      read: false,
      category: "Payroll",
    },
    {
      id: 4,
      type: "Info",
      title: "Security Update",
      description: "Sarah Johnson tagged you in security policy v2.3.",
      time: "1d ago",
      read: false,
      category: "Mentions",
    },
    {
      id: 5,
      type: "Birthday",
      title: "Birthday Today",
      description: "Wish Emily Chen a wonderful happy birthday today!",
      time: "1d ago",
      read: true,
      category: "System",
    },
    {
      id: 6,
      type: "Leave",
      title: "Approval Needed",
      description: "David Miller requested a shift swap for next Friday.",
      time: "2d ago",
      read: true,
      category: "Approvals",
    },
    {
      id: 7,
      type: "Info",
      title: "Appraisal Complete",
      description:
        "Quarterly increments have been logged into the performance matrix.",
      time: "3d ago",
      read: true,
      category: "System",
    },
  ]);

  // Announcements data
  const [announcements] = useState<AnnouncementItem[]>([
    {
      id: 1,
      type: "URGENT",
      title: "System Downtime: Scheduled Maintenance",
      content:
        "Core HR systems will be offline on Saturday, May 2, from 12:00 AM to 4:00 AM IST for server upgrades.",
      author: "Tech Infrastructure Team",
      authorRole: "IT",
      authorAvatar: "TI",
      date: "Apr 28, 2026",
      likes: 12,
      comments: 3,
      views: 188,
      pinned: true,
    },
    {
      id: 2,
      type: "IMPORTANT",
      title: "Quarterly Townhall Meeting",
      content:
        "Join us for our Q1 business review this Thursday at 3:00 PM. The meeting link is provided in your calendar.",
      author: "Sarah Johnson",
      authorRole: "HR Director",
      authorAvatar: "SJ",
      date: "Apr 26, 2026",
      likes: 45,
      comments: 12,
      views: 420,
      pinned: true,
    },
    {
      id: 3,
      type: "HR UPDATE",
      title: "Enhanced Health Insurance Benefits",
      content:
        "We are proud to announce expanded medical benefits for employees starting next month.",
      author: "Sarah Johnson",
      authorRole: "HR Director",
      authorAvatar: "SJ",
      date: "Apr 24, 2026",
      likes: 56,
      comments: 22,
      views: 512,
      pinned: false,
    },
    {
      id: 4,
      type: "INFO",
      title: "Eco-Friendly Workplace Initiative",
      content:
        "NexusHR is moving paperless. Check out our new sustainability guidelines today.",
      author: "Green Committee",
      authorRole: "Internal",
      authorAvatar: "GC",
      date: "Apr 22, 2026",
      likes: 31,
      comments: 4,
      views: 215,
      pinned: false,
    },
  ]);

  const [preferences, setPreferences] = useState({
    leave: { email: true, push: true, sms: false },
    payroll: { email: true, push: true, sms: true },
    system: { email: false, push: true, sms: false },
    mentions: { email: true, push: true, sms: false },
    announcements: { email: true, push: false, sms: false },
    onboarding: { email: true, push: true, sms: false },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    return notifications.filter((n) => {
      if (activeFilter === "Unread") return !n.read;
      if (activeFilter === "Approvals") return n.category === "Approvals";
      if (activeFilter === "Mentions") return n.category === "Mentions";
      if (activeFilter === "System") return n.category === "System";
      return true;
    });
  };

  const getIconDetails = (type: NotificationItem["type"]) => {
    switch (type) {
      case "Leave":
        return { icon: Calendar, color: "#00B87C", bg: "#DCFCE7" };
      case "Payroll":
        return { icon: IndianRupee, color: "#8B5CF6", bg: "#EDE9FE" };
      case "Alert":
        return { icon: Bell, color: "#EF4444", bg: "#FEE2E2" };
      case "Birthday":
        return { icon: Gift, color: "#F59E0B", bg: "#FEF3C7" };
      default:
        return { icon: Info, color: "#0EA5E9", bg: "#E0F2FE" };
    }
  };

  const getBadgeStyle = (type: AnnouncementItem["type"]) => {
    switch (type) {
      case "URGENT":
        return {
          color: "#EF4444",
          bg: "rgba(239, 68, 68, 0.1)",
          border: "#EF4444",
        };
      case "IMPORTANT":
        return {
          color: "#F59E0B",
          bg: "rgba(245, 158, 11, 0.1)",
          border: "#F59E0B",
        };
      default:
        return {
          color: "#00B87C",
          bg: "rgba(0, 184, 124, 0.1)",
          border: "#00B87C",
        };
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--accent)]"
            style={{
              width: "42px",
              height: "42px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={20} color="var(--foreground)" />
          </button>
          <div
            style={{
              width: "42px",
              height: "42px",
              backgroundColor: "#00B87C",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 184, 124, 0.2)",
            }}
          >
            <Bell size={20} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Notifications & Announcements
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
              }}
            >
              Stay up to date with your workplace alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Check size={16} />
            Mark All Read
          </button>

          <button
            onClick={() => setShowPreferences(true)}
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Settings size={16} />
            Preferences
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* LEFT COLUMN (35%) — Notifications Feed */}
        <div
          className="lg:col-span-4 rounded-2xl p-6"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Notifications Feed
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(
              ["All", "Unread", "Approvals", "Mentions", "System"] as const
            ).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border:
                    activeFilter === filter
                      ? "none"
                      : "1px solid var(--border)",
                  backgroundColor:
                    activeFilter === filter ? "#00B87C" : "transparent",
                  color:
                    activeFilter === filter
                      ? "white"
                      : "var(--muted-foreground)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {filter === "Unread" ? `Unread (${unreadCount})` : filter}
              </button>
            ))}
          </div>

          {/* Notification Items */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {getFilteredNotifications().map((notif) => {
              const details = getIconDetails(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    setNotifications(
                      notifications.map((n) =>
                        n.id === notif.id ? { ...n, read: true } : n,
                      ),
                    );
                  }}
                  className="flex items-center gap-3 py-3 relative cursor-pointer group"
                  style={{
                    backgroundColor: !notif.read
                      ? "var(--accent)"
                      : "transparent",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    marginLeft: "-12px",
                    marginRight: "-12px",
                    borderRadius: "8px",
                    borderLeft: !notif.read ? "3px solid #00B87C" : "none",
                    borderBottom: "1px solid var(--border)",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: details.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <details.icon size={18} color={details.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: !notif.read ? 700 : 600,
                        color: "var(--foreground)",
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {notif.title}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        margin: "2px 0 0",
                        lineHeight: 1.3,
                      }}
                    >
                      {notif.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {notif.time}
                    </span>
                    {!notif.read && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#00B87C",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#00B87C",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Load more
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (65%) — Announcements */}
        <div
          className="lg:col-span-6 rounded-2xl p-6"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Company Announcements
            </h2>
            <button
              onClick={() => setActiveModal("create_announcement")}
              style={{
                backgroundColor: "#00B87C",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + New Announcement
            </button>
          </div>

          {/* Pinned Announcements */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {announcements
              .filter((a) => a.pinned)
              .map((ann) => {
                const style = getBadgeStyle(ann.type);
                return (
                  <div
                    key={ann.id}
                    className="rounded-xl p-4 relative"
                    style={{
                      backgroundColor: "var(--input-background)",
                      border: "1px solid var(--border)",
                      borderLeft: `4px solid ${style.border}`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Pin
                          size={14}
                          color="var(--muted-foreground)"
                          style={{ transform: "rotate(45deg)" }}
                        />
                        <span
                          style={{
                            backgroundColor: style.bg,
                            color: style.color,
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {ann.type}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {ann.date}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "0 0 6px",
                      }}
                    >
                      {ann.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                        margin: "0 0 12px",
                        lineHeight: 1.4,
                      }}
                    >
                      {ann.content}
                    </p>

                    <div
                      className="flex justify-between items-center pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: "#00B87C" }}
                        >
                          {ann.authorAvatar}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          Posted by{" "}
                          <strong style={{ color: "var(--foreground)" }}>
                            {ann.author}
                          </strong>{" "}
                          ({ann.authorRole})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span>👍 {ann.likes}</span>
                        <span>💬 {ann.comments}</span>
                        <span>👁 {ann.views}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Recent Announcements */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Recent Announcements
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {announcements
              .filter((a) => !a.pinned)
              .map((ann) => {
                const style = getBadgeStyle(ann.type);
                return (
                  <div
                    key={ann.id}
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                        }}
                      >
                        {ann.type}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {ann.date}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "0 0 4px",
                      }}
                    >
                      {ann.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                        margin: "0 0 10px",
                        lineHeight: 1.4,
                      }}
                    >
                      {ann.content}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
                          style={{ backgroundColor: "#00B87C" }}
                        >
                          {ann.authorAvatar}
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {ann.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
                        <span>👍 {ann.likes}</span>
                        <span>💬 {ann.comments}</span>
                        <span>👁 {ann.views}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="text-center">
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#00B87C",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View All →
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: CREATE ANNOUNCEMENT */}
      {activeModal === "create_announcement" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="rounded-2xl p-6 max-w-xl w-full mx-4"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                New Announcement
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="Enter descriptive title..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="HR UPDATE">HR Update</option>
                    <option value="URGENT">Urgent</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="INFO">General Info</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Target Audience
                  </label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Engineering">Engineering Dept</option>
                    <option value="Sales">Sales Team</option>
                    <option value="Managers">Managers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Content
                </label>
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="flex items-center gap-1 px-2 py-1 border-b"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700">
                      <Bold size={14} />
                    </button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700">
                      <Italic size={14} />
                    </button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700">
                      <Underline size={14} />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700">
                      <List size={14} />
                    </button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700">
                      <Link2 size={14} />
                    </button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700 ml-auto">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Compose your announcement here..."
                    className="w-full px-3 py-2.5 text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{ accentColor: "#00B87C" }}
                    />
                    Send Email
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{ accentColor: "#00B87C" }}
                    />
                    Push Alert
                  </label>
                </div>

                <button
                  onClick={() => {
                    setActiveModal(null);
                  }}
                  style={{
                    backgroundColor: "#00B87C",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Post Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREFERENCES SLIDE PANEL */}
      {showPreferences && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 2000,
            }}
            onClick={() => setShowPreferences(false)}
          />
          <div
            className="fixed top-0 right-0 h-full z-[2010] overflow-y-auto transition-all duration-300"
            style={{
              width: "380px",
              backgroundColor: "var(--card)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              padding: "24px",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Notification Preferences
              </h2>
              <button
                onClick={() => setShowPreferences(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginBottom: "20px",
              }}
            >
              Configure how you want to be reached for individual alerts.
            </p>

            <div className="space-y-6">
              {Object.entries(preferences).map(([key, methods]) => (
                <div key={key} className="space-y-2">
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      textTransform: "capitalize",
                    }}
                  >
                    {key === "wfh" ? "Work From Home" : key}
                  </span>
                  <div
                    className="p-3 rounded-xl space-y-2"
                    style={{
                      backgroundColor: "var(--input-background)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {Object.entries(methods).map(([method, enabled]) => (
                      <div
                        key={method}
                        className="flex items-center justify-between"
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                            textTransform: "capitalize",
                          }}
                        >
                          {method} Notifications
                        </span>
                        <button
                          onClick={() => {
                            setPreferences((prev) => ({
                              ...prev,
                              [key]: {
                                ...prev[key as keyof typeof prev],
                                [method]: !enabled,
                              },
                            }));
                          }}
                          style={{
                            width: "36px",
                            height: "20px",
                            borderRadius: "20px",
                            backgroundColor: enabled ? "#00B87C" : "#E5E7EB",
                            position: "relative",
                            transition: "all 0.2s",
                            cursor: "pointer",
                            border: "none",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "2px",
                              left: enabled ? "18px" : "2px",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "white",
                              transition: "all 0.2s",
                            }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── FINANCE ROLE NOTIFICATIONS MASTERPIECE VIEW ───────────────────
function FinanceNotificationsView() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Payroll" | "Expenses" | "System" | "Alerts">("All");
  const [showPreferences, setShowPreferences] = useState(false);

  // Finance-specific Notifications state
  const [financeNotifications, setFinanceNotifications] = useState([
    {
      id: 1,
      type: "Alert",
      urgent: true,
      title: "TDS Filing Deadline in 8 Days",
      description: "Submit Form 24Q before April 15 to avoid penalties",
      time: "10:30 AM",
      read: false,
      section: "TODAY",
      category: "Alerts",
      path: "/reports",
      state: { activeTab: "Tax Reports" }
    },
    {
      id: 2,
      type: "Expense",
      title: "36 Expense Claims Awaiting Your Approval",
      description: "Total value: ₹42,800 — oldest claim: 4 days",
      time: "9:45 AM",
      read: false,
      section: "TODAY",
      category: "Expenses",
      path: "/expenses",
      state: { activeTab: "Pending" }
    },
    {
      id: 3,
      type: "Payroll",
      title: "Payroll Calculation In Progress — April 2026",
      description: "Stage 3 of 5: Auto-calculation started",
      time: "9:00 AM",
      read: false,
      section: "TODAY",
      category: "Payroll",
      path: "/payroll"
    },
    {
      id: 4,
      type: "Alert",
      amberAlert: true,
      title: "PF Payment Due — April 20",
      description: "Ensure bank transfer initiated by Apr 20, 2026",
      time: "8:30 AM",
      read: false,
      section: "TODAY",
      category: "Alerts",
      path: "/finance/dashboard"
    },
    {
      id: 5,
      type: "Success",
      title: "Yuki Tanaka Increment Approved by You",
      description: "+15% increment — ₹94K to ₹1.08L — effective May 1",
      time: "8:00 AM",
      read: false,
      section: "TODAY",
      category: "System",
      path: "/appraisal",
      state: { search: "Yuki Tanaka", employeeId: "EMP-002" }
    },
    {
      id: 6,
      type: "Payroll",
      title: "March 2026 Payroll Disbursed Successfully",
      description: "₹24.2L credited to 1,248 accounts",
      time: "Apr 5, 6:00 PM",
      read: true,
      section: "YESTERDAY",
      category: "Payroll",
      path: "/payroll"
    },
    {
      id: 7,
      type: "Expense",
      title: "Daniel Kim Expense Rejected — Missing Receipt",
      description: "₹1,400 claim #EXP-0398 rejected",
      time: "Apr 5, 3:00 PM",
      read: true,
      section: "YESTERDAY",
      category: "Expenses",
      path: "/expenses",
      state: { activeTab: "Rejected" }
    },
    {
      id: 8,
      type: "Info",
      title: "New Salary Band Structure Approved by HR",
      description: "Effective from FY 2026-27",
      time: "Apr 5, 11:00 AM",
      read: true,
      section: "YESTERDAY",
      category: "System",
      path: "/settings"
    },
    {
      id: 9,
      type: "Alert",
      title: "ESI Contribution Calculation Reminder",
      description: "Due Apr 21, 2026",
      time: "Apr 3, 4:30 PM",
      read: true,
      section: "THIS WEEK",
      category: "Alerts",
      path: "/payroll"
    },
    {
      id: 10,
      type: "Success",
      title: "Form 16 Generated for All Employees — FY 2024-25",
      description: "1,284 employees",
      time: "Apr 2, 10:00 AM",
      read: true,
      section: "THIS WEEK",
      category: "System",
      path: "/reports",
      state: { activeTab: "Tax Reports" }
    }
  ]);

  // Preferences Toggles & Channels
  const [preferences, setPreferences] = useState({
    tds: true,
    expenses: true,
    payroll: true,
    increments: true,
    budget: false,
    maintenance: false,
    pf: true,
  });

  const [channels, setChannels] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const handleMarkAllRead = () => {
    setFinanceNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRowClick = (notif: typeof financeNotifications[0]) => {
    // Mark row as read
    setFinanceNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
    );
    // Navigate with deep-linking state if present
    if (notif.state) {
      navigate(notif.path, { state: notif.state });
    } else {
      navigate(notif.path);
    }
  };

  const handleSavePreferences = () => {
    setShowPreferences(false);
  };

  // Filter Logic
  const getFilteredNotifications = () => {
    return financeNotifications.filter(n => {
      if (activeFilter === "Unread") return !n.read;
      if (activeFilter === "Payroll") return n.category === "Payroll";
      if (activeFilter === "Expenses") return n.category === "Expenses";
      if (activeFilter === "System") return n.category === "System";
      if (activeFilter === "Alerts") return n.category === "Alerts";
      return true;
    });
  };

  // Dynamic KPI stats calculations
  const unreadTodayCount = financeNotifications.filter(n => !n.read && n.section === "TODAY").length;
  const pendingActionsCount = financeNotifications.filter(n => !n.read && (n.category === "Expenses" || n.category === "Alerts")).length;

  const tabs = [
    { key: "All", label: `All (${financeNotifications.length})` },
    { key: "Unread", label: `Unread (${financeNotifications.filter(n => !n.read).length})` },
    { key: "Payroll", label: "Payroll" },
    { key: "Expenses", label: "Expenses" },
    { key: "System", label: "System" },
    { key: "Alerts", label: "Alerts" }
  ] as const;

  const getIconDetails = (type: string) => {
    switch (type) {
      case "Payroll":
        return { icon: IndianRupee, color: "#8B5CF6", bg: "#EDE9FE" };
      case "Expense":
        return { icon: Receipt, color: "#F59E0B", bg: "#FEF3C7" };
      case "Alert":
        return { icon: AlertCircle, color: "#EF4444", bg: "#FEE2E2" };
      case "Success":
        return { icon: Check, color: "#00B87C", bg: "#DCFCE7" };
      default:
        return { icon: Info, color: "#0EA5E9", bg: "#E0F2FE" };
    }
  };

  // Group notifications by section (Today, Yesterday, This Week)
  const groupedNotifications = () => {
    const list = getFilteredNotifications();
    const sections: Record<string, typeof financeNotifications> = {
      TODAY: [],
      YESTERDAY: [],
      "THIS WEEK": []
    };
    list.forEach(n => {
      if (sections[n.section]) {
        sections[n.section].push(n);
      }
    });
    return sections;
  };

  const grouped = groupedNotifications();

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "#FEF3C7",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)"
            }}
          >
            <Bell size={22} color="#F59E0B" fill="#F59E0B" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-[#1E293B] dark:text-white tracking-tight leading-none">Notifications</h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1.5">Stay updated on payroll, expenses and financial alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            Mark All Read
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            ⚙ Preferences
          </button>
        </div>
      </div>

      {/* NOTIFICATION STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="UNREAD TODAY" value={unreadTodayCount} color="amber" />
        <KPICard title="PENDING ACTIONS" value={pendingActionsCount} color="red" />
        <KPICard title="RESOLVED TODAY" value={8} color="green" />
      </div>

      {/* FILTER TABS */}
      <div className="space-y-6">
        <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-6 py-4 text-[13px] font-black tracking-widest uppercase transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]"
                    style={{ borderRadius: "3px 3px 0 0" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* NOTIFICATION LIST CARD */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-0">
          {Object.keys(grouped).map(sectionKey => {
            const items = grouped[sectionKey];
            if (items.length === 0) return null;
            return (
              <div key={sectionKey} className="flex flex-col">
                {/* Uppercase date header */}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#9CA3AF",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "12px 24px",
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    opacity: 0.8
                  }}
                >
                  {sectionKey}
                </div>

                {/* Notifications list */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map(notif => {
                    const details = getIconDetails(notif.type);
                    const leftBorder = !notif.read
                      ? notif.urgent
                        ? "border-l-[3px] border-[#EF4444]"
                        : "border-l-[3px] border-[#00B87C]"
                      : "border-l-[3px] border-transparent";

                    const bgTint = !notif.read 
                      ? "bg-[#F0FDF4] dark:bg-emerald-500/5" 
                      : "bg-transparent";

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleRowClick(notif)}
                        className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#F0FDF4] dark:hover:bg-emerald-500/5 transition-all ${bgTint} ${leftBorder}`}
                        style={{ height: "64px" }}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          {/* Icon square */}
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              backgroundColor: details.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            }}
                          >
                            <details.icon size={18} color={details.color} />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold text-foreground leading-tight truncate">
                              {notif.title}
                            </p>
                            <p className="text-[12px] font-semibold text-muted-foreground leading-relaxed mt-0.5 truncate max-w-[90%]">
                              {notif.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Time & Unread dot */}
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {notif.time}
                          </span>
                          <div className="w-2.5 h-2.5 flex items-center justify-center">
                            {!notif.read && (
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: "#00B87C"
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREFERENCES PANEL (Right Slide-in Drawer) */}
      {showPreferences && (
        <>
          {/* Overlay background */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 2000,
              backdropFilter: "blur(2px)"
            }}
            onClick={() => setShowPreferences(false)}
          />

          {/* Sliding drawer content */}
          <div
            className="fixed top-0 right-0 h-full z-[2010] overflow-y-auto"
            style={{
              width: "380px",
              backgroundColor: "var(--card)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              padding: "28px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-6 border-b border-border/80">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-[#00B87C]" />
                <h2 className="text-[18px] font-black text-foreground tracking-tight">Notification Preferences</h2>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Toggle controls */}
            <div className="flex-1 py-6 space-y-2 overflow-y-auto">
              <ToggleRow
                label="TDS / Tax Deadlines"
                desc="Critical payroll alerts"
                value={preferences.tds}
                onChange={() => setPreferences(prev => ({ ...prev, tds: !prev.tds }))}
              />
              <ToggleRow
                label="Expense Claim Alerts"
                desc="New claims submitted"
                value={preferences.expenses}
                onChange={() => setPreferences(prev => ({ ...prev, expenses: !prev.expenses }))}
              />
              <ToggleRow
                label="Payroll Processing"
                desc="Stage updates"
                value={preferences.payroll}
                onChange={() => setPreferences(prev => ({ ...prev, payroll: !prev.payroll }))}
              />
              <ToggleRow
                label="Increment Approvals"
                desc="Pending your action"
                value={preferences.increments}
                onChange={() => setPreferences(prev => ({ ...prev, increments: !prev.increments }))}
              />
              <ToggleRow
                label="Budget Alerts"
                desc="Department over-budget"
                value={preferences.budget}
                onChange={() => setPreferences(prev => ({ ...prev, budget: !prev.budget }))}
              />
              <ToggleRow
                label="System Maintenance"
                desc="Scheduled downtime"
                value={preferences.maintenance}
                onChange={() => setPreferences(prev => ({ ...prev, maintenance: !prev.maintenance }))}
              />
              <ToggleRow
                label="PF/ESI Reminders"
                desc="Statutory deadlines"
                value={preferences.pf}
                onChange={() => setPreferences(prev => ({ ...prev, pf: !prev.pf }))}
              />

              {/* Channels checkboxes layout */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">Notification Channels</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[13px] font-bold text-foreground cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={channels.email}
                      onChange={() => setChannels(prev => ({ ...prev, email: !prev.email }))}
                      className="w-4 h-4 rounded border-slate-300 text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                      style={{ accentColor: "#00B87C" }}
                    />
                    <span>Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 text-[13px] font-bold text-foreground cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={channels.push}
                      onChange={() => setChannels(prev => ({ ...prev, push: !prev.push }))}
                      className="w-4 h-4 rounded border-slate-300 text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                      style={{ accentColor: "#00B87C" }}
                    />
                    <span>Push Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 text-[13px] font-bold text-foreground cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={() => setChannels(prev => ({ ...prev, sms: !prev.sms }))}
                      className="w-4 h-4 rounded border-slate-300 text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                      style={{ accentColor: "#00B87C" }}
                    />
                    <span>SMS Alerts</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border/80 bg-card">
              <button
                onClick={handleSavePreferences}
                className="w-full py-3.5 bg-[#00B87C] text-white rounded-2xl text-[14px] font-black uppercase tracking-[1.5px] hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PRIVATE COMPONENTS FOR FINANCE NOTIFICATIONS ──────────────────
function KPICard({ title, value, color }: { title: string; value: number; color: "amber" | "red" | "green" }) {
  const colors = {
    amber: { text: "text-[#D97706]", bg: "bg-[#FEF3C7]/40 dark:bg-amber-500/5", border: "border-amber-100/50 dark:border-amber-500/10" },
    red: { text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/5", border: "border-rose-100/50 dark:border-rose-500/10" },
    green: { text: "text-[#00B87C]", bg: "bg-[#F0FDF4]/40 dark:bg-emerald-500/5", border: "border-[#00B87C]/20 dark:border-emerald-500/10" }
  };

  return (
    <div className={`p-6 bg-card border ${colors[color].border} ${colors[color].bg} rounded-2xl shadow-sm hover:shadow-md transition-all`}>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[1.5px] mb-2">{title}</p>
      <h3 className={`text-3xl font-black tracking-tighter ${colors[color].text}`}>{value}</h3>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border/40">
      <div>
        <p className="text-[13px] font-bold text-foreground leading-tight">{label}</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-1">{desc}</p>
      </div>
      <button
        onClick={onChange}
        style={{
          width: "36px",
          height: "20px",
          borderRadius: "20px",
          backgroundColor: value ? "#00B87C" : "#E5E7EB",
          position: "relative",
          transition: "all 0.2s",
          cursor: "pointer",
          border: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: value ? "18px" : "2px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "white",
            transition: "all 0.2s",
          }}
        />
      </button>
    </div>
  );
}

