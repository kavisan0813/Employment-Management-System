import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Calendar,
  CreditCard,
  ClipboardList,
  Clock,
  CheckCheck,
  Trash2,
  Search,
  ArrowLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

type NotificationCategory = "All" | "Unread" | "Approvals" | "System";
type NotificationType =
  | "Leave"
  | "Expense"
  | "HR"
  | "Attendance"
  | "Performance"
  | "Training";

interface Notification {
  id: number;
  type: NotificationType;
  category: "Approvals" | "System";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  path: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "Performance",
    category: "System",
    title: "Performance Reviews Due",
    message:
      "Annual appraisals for your team are due by April 25. 3 reviews pending your rating.",
    timestamp: "1h ago",
    isRead: false,
    isImportant: true,
    path: "/performance",
  },
  {
    id: 2,
    type: "Leave",
    category: "Approvals",
    title: "Leave Request: Arjun Mehta",
    message: "Arjun Mehta has requested 4 days of casual leave for May 12-15.",
    timestamp: "3h ago",
    isRead: false,
    isImportant: false,
    path: "/leave",
  },
  {
    id: 3,
    type: "Training",
    category: "System",
    title: "Training at Risk: Dev Patel",
    message: "Dev Patel is overdue on mandatory 'Git CI/CD Pipeline' training.",
    timestamp: "5h ago",
    isRead: false,
    isImportant: true,
    path: "/training",
  },
  {
    id: 4,
    type: "Attendance",
    category: "System",
    title: "Team Overtime Alert",
    message:
      "Your team has clocked an average of 48h this week. Review resource bandwidth.",
    timestamp: "1d ago",
    isRead: true,
    isImportant: false,
    path: "/attendance",
  },
  {
    id: 5,
    type: "HR",
    category: "System",
    title: "New Team Member Onboarding",
    message:
      "Rohan Sen (Senior React Engineer) is joining your team on May 20. Access onboarding pipeline.",
    timestamp: "2d ago",
    isRead: true,
    isImportant: false,
    path: "/manager/directory",
  },
];

export function ManagerNotifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationCategory>("All");
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Unread" && !n.isRead) ||
        (activeTab === "Approvals" && n.category === "Approvals") ||
        (activeTab === "System" && n.category === "System");

      const matchesType = typeFilter === "All" || n.type === typeFilter;

      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesType && matchesSearch;
    });
  }, [notifications, activeTab, typeFilter, searchQuery]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    showToast("Success", "success", "Notification marked as read");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("Success", "success", "All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast("Deleted", "info", "Notification removed");
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "Leave":
        return { icon: Calendar, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
      case "Expense":
        return {
          icon: CreditCard,
          color: "#3B82F6",
          bg: "rgba(59,130,246,0.1)",
        };
      case "Performance":
        return {
          icon: TrendingUp,
          color: "#8B5CF6",
          bg: "rgba(139,92,246,0.1)",
        };
      case "Training":
        return { icon: BookOpen, color: "#06B6D4", bg: "rgba(6,182,212,0.1)" };
      case "Attendance":
        return { icon: Clock, color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
      case "HR":
      default:
        return {
          icon: ClipboardList,
          color: "#00B87C",
          bg: "rgba(0,184,124,0.1)",
        };
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-[10px] border border-border bg-card flex items-center justify-center hover:bg-[#00B87C]/[0.08] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none">
              Notifications
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Manage your manager updates, team requests and system alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00B87C] text-[#00B87C] text-[13px] font-bold uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all"
          >
            <CheckCheck size={16} /> Mark All Read
          </button>
        </div>
      </div>

      {/* ─── Tabs & Filters ─────────────────────────────────────── */}
      <div className="bg-card rounded-[32px] border border-border p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Custom Tabs */}
          <div className="flex items-center p-1.5 bg-secondary/30 rounded-2xl w-fit">
            {(["All", "Unread", "Approvals", "System"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  activeTab === tab
                    ? "bg-card text-[#00B87C] shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {tab === "Unread" &&
                  notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-[#00B87C] text-white text-[11px] rounded-full">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#00B87C] transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold focus:outline-none focus:border-[#00B87C] transition-all w-[240px]"
              />
            </div>

            {/* Type Filter */}
            <div className="relative group">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-11 pr-10 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold appearance-none focus:outline-none focus:border-[#00B87C]"
              >
                <option value="All">All Types</option>
                <option value="Leave">Leave</option>
                <option value="Expense">Expense</option>
                <option value="HR">HR</option>
                <option value="Attendance">Attendance</option>
                <option value="Performance">Performance</option>
                <option value="Training">Training</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Notification List ──────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const iconData = getIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-card p-6 rounded-[28px] border transition-all hover:shadow-xl flex flex-col md:flex-row items-center gap-6 ${
                    !notification.isRead
                      ? "border-[#00B87C]/30 bg-[#00B87C]/[0.02]"
                      : "border-border"
                  }`}
                >
                  {/* Left: Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-transparent group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: iconData.bg,
                      color: iconData.color,
                    }}
                  >
                    <iconData.icon size={26} />
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <span
                        className="text-[11px] font-bold uppercase tracking-[2px]"
                        style={{ color: iconData.color }}
                      >
                        {notification.type}
                      </span>
                      {notification.isImportant && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-rose-500/20">
                          <AlertCircle size={10} /> Urgent
                        </div>
                      )}
                    </div>
                    <h3 className="text-[17px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors leading-tight">
                      {notification.title}
                    </h3>
                    <p className="text-[14px] font-bold text-muted-foreground/80 mt-1.5 leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  {/* Right: Meta & Actions */}
                  <div className="flex flex-col items-center md:items-end gap-4 min-w-[140px]">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} />
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        {notification.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-3 rounded-xl bg-secondary hover:bg-[#00B87C] hover:text-white transition-all text-muted-foreground shadow-sm"
                          title="Mark as read"
                        >
                          <CheckCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-3 rounded-xl bg-secondary hover:bg-rose-500 hover:text-white transition-all text-muted-foreground shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => navigate(notification.path)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:opacity-90 active:scale-95 transition-all"
                      >
                        View <ChevronRight size={16} />
                      </button>
                    </div>

                    {!notification.isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00B87C] absolute top-6 right-6 shadow-[0_0_12px_rgba(0,184,124,0.5)] md:hidden lg:block group-hover:hidden" />
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center bg-card rounded-[32px] border border-dashed border-border"
            >
              <div className="w-20 h-20 rounded-[32px] bg-secondary flex items-center justify-center text-muted-foreground/30 mb-6">
                <Bell size={40} />
              </div>
              <h3 className="text-[20px] font-bold text-foreground uppercase tracking-tight">
                No notifications found
              </h3>
              <p className="text-[14px] font-bold text-muted-foreground mt-2 max-w-[300px]">
                We couldn't find any notifications matching your current
                filters.
              </p>
              <button
                onClick={() => {
                  setActiveTab("All");
                  setTypeFilter("All");
                  setSearchQuery("");
                }}
                className="mt-6 text-[#00B87C] text-[13px] font-bold uppercase tracking-wider hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
