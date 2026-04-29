import { useState } from "react";
import { Bell, Check, Settings, Calendar, IndianRupee, Info, Gift, Pin, X, Bold, Italic, Underline, List, RotateCcw, Link2 } from "lucide-react";

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
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Approvals" | "Mentions" | "System">("All");
  const [activeModal, setActiveModal] = useState<"create_announcement" | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Notification data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, type: "Alert", title: "MFA Verification Required", description: "Ensure multi-factor authentication is verified before April 30.", time: "2h ago", read: false, category: "System" },
    { id: 2, type: "Leave", title: "Leave Request Approved", description: "Your annual leave request for May 12-15 has been approved by HR.", time: "3h ago", read: false, category: "Approvals" },
    { id: 3, type: "Payroll", title: "Payroll Disbursed", description: "Salary slip for March 2026 is available for download.", time: "5h ago", read: false, category: "Payroll" },
    { id: 4, type: "Info", title: "Security Update", description: "Sarah Johnson tagged you in security policy v2.3.", time: "1d ago", read: false, category: "Mentions" },
    { id: 5, type: "Birthday", title: "Birthday Today", description: "Wish Emily Chen a wonderful happy birthday today!", time: "1d ago", read: true, category: "System" },
    { id: 6, type: "Leave", title: "Approval Needed", description: "David Miller requested a shift swap for next Friday.", time: "2d ago", read: true, category: "Approvals" },
    { id: 7, type: "Info", title: "Appraisal Complete", description: "Quarterly increments have been logged into the performance matrix.", time: "3d ago", read: true, category: "System" },
  ]);

  // Announcements data
  const [announcements] = useState<AnnouncementItem[]>([
    { id: 1, type: "URGENT", title: "System Downtime: Scheduled Maintenance", content: "Core HR systems will be offline on Saturday, May 2, from 12:00 AM to 4:00 AM IST for server upgrades.", author: "Tech Infrastructure Team", authorRole: "IT", authorAvatar: "TI", date: "Apr 28, 2026", likes: 12, comments: 3, views: 188, pinned: true },
    { id: 2, type: "IMPORTANT", title: "Quarterly Townhall Meeting", content: "Join us for our Q1 business review this Thursday at 3:00 PM. The meeting link is provided in your calendar.", author: "Sarah Johnson", authorRole: "HR Director", authorAvatar: "SJ", date: "Apr 26, 2026", likes: 45, comments: 12, views: 420, pinned: true },
    { id: 3, type: "HR UPDATE", title: "Enhanced Health Insurance Benefits", content: "We are proud to announce expanded medical benefits for employees starting next month.", author: "Sarah Johnson", authorRole: "HR Director", authorAvatar: "SJ", date: "Apr 24, 2026", likes: 56, comments: 22, views: 512, pinned: false },
    { id: 4, type: "INFO", title: "Eco-Friendly Workplace Initiative", content: "NexusHR is moving paperless. Check out our new sustainability guidelines today.", author: "Green Committee", authorRole: "Internal", authorAvatar: "GC", date: "Apr 22, 2026", likes: 31, comments: 4, views: 215, pinned: false },
  ]);

  const [preferences, setPreferences] = useState({
    leave: { email: true, push: true, sms: false },
    payroll: { email: true, push: true, sms: true },
    system: { email: false, push: true, sms: false },
    mentions: { email: true, push: true, sms: false },
    announcements: { email: true, push: false, sms: false },
    onboarding: { email: true, push: true, sms: false },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(n => {
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
        return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", border: "#EF4444" };
      case "IMPORTANT":
        return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", border: "#F59E0B" };
      default:
        return { color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)", border: "#00B87C" };
    }
  };

  return (
    <div style={{ maxWidth: "1400px", minHeight: "calc(100vh - 100px)" }}>
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div 
            style={{ 
              width: "42px", 
              height: "42px", 
              backgroundColor: "#00B87C", 
              borderRadius: "12px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 184, 124, 0.2)"
            }}
          >
            <Bell size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
              Notifications & Announcements
            </h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>
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
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
              Notifications Feed
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(["All", "Unread", "Approvals", "Mentions", "System"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: activeFilter === filter ? "none" : "1px solid var(--border)",
                  backgroundColor: activeFilter === filter ? "#00B87C" : "transparent",
                  color: activeFilter === filter ? "white" : "var(--muted-foreground)",
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
                    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                  }}
                  className="flex items-center gap-3 py-3 relative cursor-pointer group"
                  style={{
                    backgroundColor: !notif.read ? "var(--accent)" : "transparent",
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
                      flexShrink: 0
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
                        lineHeight: 1.3
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
                        lineHeight: 1.3
                      }}
                    >
                      {notif.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                      {notif.time}
                    </span>
                    {!notif.read && (
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00B87C" }} />
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
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
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
            {announcements.filter(a => a.pinned).map((ann) => {
              const style = getBadgeStyle(ann.type);
              return (
                <div
                  key={ann.id}
                  className="rounded-xl p-4 relative"
                  style={{ 
                    backgroundColor: "var(--input-background)", 
                    border: "1px solid var(--border)",
                    borderLeft: `4px solid ${style.border}`
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Pin size={14} color="var(--muted-foreground)" style={{ transform: "rotate(45deg)" }} />
                      <span 
                        style={{ 
                          backgroundColor: style.bg, 
                          color: style.color, 
                          padding: "2px 8px", 
                          borderRadius: "8px",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.5px"
                        }}
                      >
                        {ann.type}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{ann.date}</span>
                  </div>

                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 6px" }}>
                    {ann.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 12px", lineHeight: 1.4 }}>
                    {ann.content}
                  </p>

                  <div className="flex justify-between items-center pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: "#00B87C" }}
                      >
                        {ann.authorAvatar}
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                        Posted by <strong style={{ color: "var(--foreground)" }}>{ann.author}</strong> ({ann.authorRole})
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
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Recent Announcements
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {announcements.filter(a => !a.pinned).map((ann) => {
              const style = getBadgeStyle(ann.type);
              return (
                <div
                  key={ann.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
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
                        letterSpacing: "0.5px"
                      }}
                    >
                      {ann.type}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{ann.date}</span>
                  </div>

                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px" }}>
                    {ann.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 10px", lineHeight: 1.4 }}>
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
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
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
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div 
            className="rounded-2xl p-6 max-w-xl w-full mx-4" 
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                New Announcement
              </h2>
              <button 
                onClick={() => setActiveModal(null)} 
                style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>
                  Announcement Title
                </label>
                <input 
                  type="text" 
                  placeholder="Enter descriptive title..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="HR UPDATE">HR Update</option>
                    <option value="URGENT">Urgent</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="INFO">General Info</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Target Audience
                  </label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Engineering">Engineering Dept</option>
                    <option value="Sales">Sales Team</option>
                    <option value="Managers">Managers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>
                  Content
                </label>
                <div 
                  className="rounded-xl border overflow-hidden" 
                  style={{ borderColor: "var(--border)" }}
                >
                  <div 
                    className="flex items-center gap-1 px-2 py-1 border-b" 
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)" }}
                  >
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700"><Bold size={14} /></button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700"><Italic size={14} /></button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700"><Underline size={14} /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700"><List size={14} /></button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700"><Link2 size={14} /></button>
                    <button className="p-1.5 rounded text-gray-500 hover:bg-neutral-200 dark:hover:bg-zinc-700 ml-auto"><RotateCcw size={14} /></button>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Compose your announcement here..."
                    className="w-full px-3 py-2.5 text-sm outline-none resize-none"
                    style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked style={{ accentColor: "#00B87C" }} />
                    Send Email
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked style={{ accentColor: "#00B87C" }} />
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
              zIndex: 110,
            }}
            onClick={() => setShowPreferences(false)}
          />
          <div 
            className="fixed top-0 right-0 h-full z-[120] overflow-y-auto transition-all duration-300"
            style={{ 
              width: "380px", 
              backgroundColor: "var(--card)", 
              borderLeft: "1px solid var(--border)",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              padding: "24px"
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                Notification Preferences
              </h2>
              <button 
                onClick={() => setShowPreferences(false)} 
                style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "20px" }}>
              Configure how you want to be reached for individual alerts.
            </p>

            <div className="space-y-6">
              {Object.entries(preferences).map(([key, methods]) => (
                <div key={key} className="space-y-2">
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", textTransform: "capitalize" }}>
                    {key === "wfh" ? "Work From Home" : key}
                  </span>
                  <div 
                    className="p-3 rounded-xl space-y-2" 
                    style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}
                  >
                    {Object.entries(methods).map(([method, enabled]) => (
                      <div key={method} className="flex items-center justify-between">
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "capitalize" }}>
                          {method} Notifications
                        </span>
                        <button
                          onClick={() => {
                            setPreferences(prev => ({
                              ...prev,
                              [key]: {
                                ...prev[key as keyof typeof prev],
                                [method]: !enabled
                              }
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
