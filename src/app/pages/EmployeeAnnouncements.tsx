import { useState, useEffect, useMemo } from "react";
import {
  Megaphone,
  Pin,
  MessageSquare,
  ThumbsUp,
  Eye,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  Search,
  X,
  Download,
  Share2,
  Calendar,
  Paperclip,
  Trash2,
  Bell,
  Archive,
  RefreshCcw,
  Clock,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";

/* ─────────────────────────────────────────────────────────────── */
/* Types & Mock Data                                               */
/* ─────────────────────────────────────────────────────────────── */

type Category =
  | "General"
  | "HR Policy"
  | "Payroll"
  | "Holiday"
  | "Training"
  | "Emergency";
type Priority = "Normal" | "Important" | "Urgent";

interface Announcement {
  id: number;
  title: string;
  message: string;
  shortDescription: string;
  category: Category;
  priority: Priority;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  postedDate: string;
  expiryDate?: string;
  isRead: boolean;
  isAcknowledged: boolean;
  needsAcknowledgement: boolean;
  isPinned: boolean;
  attachments: { name: string; size: string; url: string }[];
  likes: number;
  comments: number;
  views: number;
  acknowledgedAt?: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Q2 Appraisal Reviews Start April 25th",
    shortDescription:
      "All employees must complete self-review by April 25. Manager reviews close May 5.",
    message:
      "Dear Team,\n\nThe Q2 Performance Appraisal cycle is officially commencing. This year, we have introduced a new streamlined self-assessment form in the Performance module. \n\nKey Dates:\n- Self-Review: April 25th - April 30th\n- Manager Review: May 1st - May 5th\n- Final Feedback: May 10th onwards.\n\nPlease ensure your goals are updated before starting the review.",
    category: "HR Policy",
    priority: "Urgent",
    author: { name: "Arjun Reddy", role: "Corporate HR Head" },
    postedDate: "2026-04-05",
    isRead: false,
    isAcknowledged: false,
    needsAcknowledgement: true,
    isPinned: true,
    attachments: [
      { name: "Appraisal_Guidelines_2026.pdf", size: "1.2 MB", url: "#" },
    ],
    likes: 48,
    comments: 12,
    views: 284,
  },
  {
    id: 2,
    title: "Updated Hybrid Work Policy (v2.1)",
    shortDescription:
      "New guidelines for mandatory office presence effective May 1st.",
    message:
      "Following feedback from department heads, we are adjusting our hybrid work model to ensure better team synergy. Effective May 1st, all teams are required to be in the office on Tuesdays and Thursdays. Monday/Wednesday/Friday remain optional based on project requirements.",
    category: "HR Policy",
    priority: "Important",
    author: { name: "Operations Team", role: "Facility Operations" },
    postedDate: "2026-04-02",
    isRead: true,
    isAcknowledged: true,
    acknowledgedAt: "2026-04-03 09:30 AM",
    needsAcknowledgement: true,
    isPinned: true,
    attachments: [
      { name: "Hybrid_Work_Policy_v2.pdf", size: "850 KB", url: "#" },
    ],
    likes: 32,
    comments: 8,
    views: 195,
  },
  {
    id: 3,
    title: "Company Annual Offsite: Green Valley",
    shortDescription:
      "Join us for our annual retreat on April 30th at Green Valley Resorts.",
    message:
      "It's time to unwind! We are organizing a 1-day retreat at Green Valley Resorts. The day will include team building activities, a keynote from the CEO, and a gala lunch. Please RSVP via the link provided below.",
    category: "General",
    priority: "Normal",
    author: { name: "Sarah Johnson", role: "Engagement Lead" },
    postedDate: "2026-04-06",
    isRead: false,
    isAcknowledged: false,
    needsAcknowledgement: false,
    isPinned: false,
    attachments: [],
    likes: 24,
    comments: 5,
    views: 110,
  },
  {
    id: 4,
    title: "Payroll Cycle: March Disbursement",
    shortDescription:
      "March salaries have been credited. Payslips are available in the portal.",
    message:
      "We are pleased to inform you that salaries for the month of March 2026 have been successfully disbursed. You can now view and download your payslips from the 'My Payslips' section in the Employee portal.",
    category: "Payroll",
    priority: "Normal",
    author: { name: "Finance Dept", role: "Payroll Manager" },
    postedDate: "2026-03-31",
    isRead: true,
    isAcknowledged: false,
    needsAcknowledgement: false,
    isPinned: false,
    attachments: [],
    likes: 85,
    comments: 15,
    views: 450,
  },
  {
    id: 5,
    title: "Emergency Maintenance: Office Power Cut",
    shortDescription:
      "Power outage scheduled for the main building on Sunday, April 12.",
    message:
      "Due to mandatory transformer maintenance by the city electricity board, there will be no power in the main office building on Sunday, April 12th, from 9:00 AM to 6:00 PM. Please avoid visiting the office during this time.",
    category: "Emergency",
    priority: "Urgent",
    author: { name: "Admin Services", role: "HQ Security" },
    postedDate: "2026-04-10",
    isRead: false,
    isAcknowledged: false,
    needsAcknowledgement: true,
    isPinned: false,
    attachments: [],
    likes: 15,
    comments: 2,
    views: 65,
  },
  {
    id: 6,
    title: "New Training: Generative AI for HR",
    shortDescription: "A mandatory workshop for all HR and Operations staff.",
    message:
      "We are launching a new training module on leveraging Generative AI for workplace productivity. This is part of our digital transformation initiative. Attendance is mandatory for the initial session.",
    category: "Training",
    priority: "Important",
    author: { name: "L&D Academy", role: "Training Head" },
    postedDate: "2026-04-01",
    isRead: false,
    isAcknowledged: false,
    needsAcknowledgement: false,
    isPinned: false,
    attachments: [
      { name: "Training_Curriculum.pdf", size: "2.1 MB", url: "#" },
    ],
    likes: 18,
    comments: 3,
    views: 140,
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function PriorityBadge({ priority }: { priority: Priority }) {
  let styleClass = "";
  switch (priority) {
    case "Urgent":
      styleClass = "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      break;
    case "Important":
      styleClass = "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      break;
    case "Normal":
    default:
      styleClass = "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
      break;
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${styleClass}`}
    >
      {priority}
    </span>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  let styleClass = "";
  switch (category) {
    case "General":
      styleClass = "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20";
      break;
    case "HR Policy":
      styleClass = "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20";
      break;
    case "Payroll":
      styleClass = "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20";
      break;
    case "Holiday":
      styleClass = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20";
      break;
    case "Training":
      styleClass = "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20";
      break;
    case "Emergency":
    default:
      styleClass = "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20";
      break;
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${styleClass}`}
    >
      {category}
    </span>
  );
}

function AnnouncementSkeleton() {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-secondary rounded-md" />
          <div className="h-5 w-16 bg-secondary rounded-md" />
        </div>
        <div className="h-4 w-4 bg-secondary rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-secondary rounded-md" />
        <div className="h-4 w-full bg-secondary rounded-md" />
        <div className="h-4 w-5/6 bg-secondary rounded-md" />
      </div>
      <div className="pt-4 flex justify-between items-center border-t border-border/50">
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-secondary rounded-full" />
          <div className="h-8 w-24 bg-secondary rounded-md" />
        </div>
        <div className="h-4 w-16 bg-secondary rounded-md" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeAnnouncements() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    type: "archive" | "acknowledge";
    id: number;
  } | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAnnouncements(MOCK_ANNOUNCEMENTS);
      setIsLoading(false);

      // Handle navigation from notifications
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (id) {
        const found = MOCK_ANNOUNCEMENTS.find((a) => a.id === parseInt(id));
        if (found) setSelectedAnnouncement(found);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.search]);

  const filteredData = useMemo(() => {
    return announcements
      .filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          categoryFilter === "All" || a.category === categoryFilter;
        const matchesPriority =
          priorityFilter === "All" || a.priority === priorityFilter;
        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Read" && a.isRead) ||
          (statusFilter === "Unread" && !a.isRead) ||
          (statusFilter === "Awaiting Acknowledge" &&
            a.needsAcknowledgement &&
            !a.isAcknowledged);

        return (
          matchesSearch && matchesCategory && matchesPriority && matchesStatus
        );
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      });
  }, [
    announcements,
    searchQuery,
    categoryFilter,
    priorityFilter,
    statusFilter,
  ]);

  const handleMarkAsRead = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
    );
    showToast("Status Updated", "success", "Announcement marked as read.");
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement((prev) =>
        prev ? { ...prev, isRead: true } : null,
      );
    }
  };

  const handleAcknowledge = (id: number) => {
    const timestamp = new Date().toLocaleString();
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              isAcknowledged: true,
              acknowledgedAt: timestamp,
              isRead: true,
            }
          : a,
      ),
    );
    showToast(
      "Acknowledged",
      "success",
      "You have acknowledged this announcement.",
    );
    setShowConfirmModal(null);
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement((prev) =>
        prev
          ? {
              ...prev,
              isAcknowledged: true,
              acknowledgedAt: timestamp,
              isRead: true,
            }
          : null,
      );
    }
  };

  const handleDownload = (name: string) => {
    showToast("Downloading", "success", `${name} is being downloaded.`);
  };

  const handleArchive = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast("Archived", "info", "Announcement has been archived.");
    setShowConfirmModal(null);
  };

  const announcementHelpers = {
    copyLink: (id: number) => {
      const link = `${window.location.origin}/notifications?id=${id}`;
      navigator.clipboard.writeText(link);
      showToast("Copied", "success", "Announcement link copied to clipboard.");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-amber-500/10 flex items-center justify-center shadow-sm">
            <Megaphone size={22} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-[28px] font-black text-foreground leading-none">
              Announcements
            </h1>
            <p className="text-[14px] font-bold text-muted-foreground mt-1.5">
              Stay updated with company news and policies
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary/10 rounded-xl flex items-center gap-2 border border-primary/20">
            <Bell size={16} className="text-primary" />
            <span className="text-[13px] font-black text-primary">
              {announcements.filter((a) => !a.isRead).length} New
            </span>
          </div>
        </div>
      </div>

      {/* ─── Filter Bar ────────────────────────────────────────────── */}
      <div className="bg-card p-6 rounded-[28px] border border-border shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative group lg:col-span-2">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl pl-11 pr-4 py-3 text-[14px] font-bold focus:outline-none focus:border-primary transition-all shadow-inner"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="HR Policy">HR Policy</option>
              <option value="Payroll">Payroll</option>
              <option value="Holiday">Holiday</option>
              <option value="Training">Training</option>
              <option value="Emergency">Emergency</option>
            </select>
            <ChevronRight
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
            <ChevronRight
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Read">Read</option>
              <option value="Unread">Unread</option>
              <option value="Awaiting Acknowledge">Awaiting Acknowledge</option>
            </select>
            <ChevronRight
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-[12px] font-bold text-muted-foreground">
            Found <span className="text-foreground">{filteredData.length}</span>{" "}
            announcements
          </p>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-primary text-[13px] font-black hover:underline px-4 py-1.5 hover:bg-primary/10 rounded-lg transition-all"
          >
            <RefreshCcw size={14} /> Reset Filters
          </button>
        </div>
      </div>

      {/* ─── Announcements Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <AnnouncementSkeleton key={i} />
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onView={() => setSelectedAnnouncement(ann)}
              onMarkRead={() => handleMarkAsRead(ann.id)}
              onCopy={() => announcementHelpers.copyLink(ann.id)}
              onArchive={() =>
                setShowConfirmModal({ type: "archive", id: ann.id })
              }
            />
          ))
        ) : (
          <div className="col-span-full py-20 bg-card rounded-[32px] border border-dashed border-border flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mb-4">
              <Megaphone size={32} />
            </div>
            <h3 className="text-[18px] font-black text-foreground">
              No announcements found
            </h3>
            <p className="text-[14px] font-bold text-muted-foreground mt-1 max-w-[300px]">
              Try adjusting your filters or search query to find what you're
              looking for.
            </p>
          </div>
        )}
      </div>

      {/* ─── Detail Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <AnnouncementDetailModal
            announcement={selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
            onMarkRead={() => handleMarkAsRead(selectedAnnouncement.id)}
            onAcknowledge={() =>
              setShowConfirmModal({
                type: "acknowledge",
                id: selectedAnnouncement.id,
              })
            }
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>

      {/* ─── Confirmation Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(null)}
              className="absolute inset-0 bg-background/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[400px] rounded-[32px] shadow-2xl p-8 border border-border flex flex-col items-center text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  showConfirmModal.type === "archive"
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {showConfirmModal.type === "archive" ? (
                  <Trash2 size={32} />
                ) : (
                  <CheckCircle size={32} />
                )}
              </div>
              <h3 className="text-[20px] font-black text-foreground uppercase tracking-tight">
                {showConfirmModal.type === "archive"
                  ? "Archive Announcement?"
                  : "Confirm Acknowledgement?"}
              </h3>
              <p className="text-[14px] font-medium text-muted-foreground mt-2 leading-relaxed">
                {showConfirmModal.type === "archive"
                  ? "Are you sure you want to archive this? It will be removed from your active list."
                  : "Do you acknowledge that you have read and understood this announcement?"}
              </p>
              <div className="flex flex-col w-full gap-3 mt-8">
                <button
                  onClick={() => {
                    if (showConfirmModal.type === "archive")
                      handleArchive(showConfirmModal.id);
                    else handleAcknowledge(showConfirmModal.id);
                  }}
                  className={`w-full py-4 rounded-2xl text-[14px] font-semibold uppercase tracking-wider shadow-xl transition-all active:scale-[0.98] ${
                    showConfirmModal.type === "archive"
                      ? "bg-rose-500 text-white shadow-rose-500/25"
                      : "bg-primary text-white shadow-primary/25"
                  }`}
                >
                  {showConfirmModal.type === "archive"
                    ? "Yes, Archive It"
                    : "Confirm & Acknowledge"}
                </button>
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="w-full py-4 text-[13px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onView,
  onMarkRead,
  onCopy,
  onArchive,
}: {
  announcement: Announcement;
  onView: () => void;
  onMarkRead: () => void;
  onCopy: () => void;
  onArchive: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-card p-6 rounded-[28px] border transition-all hover:shadow-xl flex flex-col justify-between h-full relative overflow-hidden ${
        !announcement.isRead
          ? "border-primary/30 ring-1 ring-primary/5"
          : "border-border"
      }`}
    >
      {!announcement.isRead && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-semibold uppercase tracking-wider py-1 px-8 rotate-45 translate-x-4 translate-y-[-4px] shadow-sm">
            New
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CategoryBadge category={announcement.category} />
            <PriorityBadge priority={announcement.priority} />
          </div>
          <div className="relative group/actions">
            <button className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground">
              <MoreVertical size={16} />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all w-[180px]">
              {!announcement.isRead && (
                <button
                  onClick={onMarkRead}
                  className="w-full px-4 py-3 text-left text-[12px] font-bold text-foreground hover:bg-secondary flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-primary" /> Mark as
                  Read
                </button>
              )}
              <button
                onClick={onCopy}
                className="w-full px-4 py-3 text-left text-[12px] font-bold text-foreground hover:bg-secondary flex items-center gap-2"
              >
                <Share2 size={14} className="text-blue-500" /> Copy Link
              </button>
              <button
                onClick={onArchive}
                className="w-full px-4 py-3 text-left text-[12px] font-bold text-rose-500 hover:bg-rose-500/5 flex items-center gap-2"
              >
                <Archive size={14} /> Archive
              </button>
            </div>
          </div>
        </div>

        <div className="cursor-pointer" onClick={onView}>
          <h3 className="text-[17px] font-black text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
            {announcement.title}
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {announcement.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {announcement.attachments.length > 0 && (
            <div className="px-2.5 py-1 bg-secondary/50 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest border border-border/50">
              <Paperclip size={12} /> {announcement.attachments.length} File
            </div>
          )}
          {announcement.needsAcknowledgement && (
            <div
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest border ${
                announcement.isAcknowledged
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
              }`}
            >
              <CheckCircle size={12} />{" "}
              {announcement.isAcknowledged
                ? "Acknowledged"
                : "Acknowledge Required"}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[11px] border border-primary/20">
            {announcement.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-[12px] font-black text-foreground leading-none">
              {announcement.author.name}
            </p>
            <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
              {announcement.author.role}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={12} />
            <span className="text-[11px] font-bold">
              {new Date(announcement.postedDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnnouncementDetailModal({
  announcement,
  onClose,
  onMarkRead,
  onAcknowledge,
  onDownload,
}: {
  announcement: Announcement;
  onClose: () => void;
  onMarkRead: () => void;
  onAcknowledge: () => void;
  onDownload: (name: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-card w-full max-w-[800px] rounded-[36px] shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        <div className="p-8 border-b border-border flex items-start justify-between bg-white dark:bg-card">
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={announcement.category} />
              <PriorityBadge priority={announcement.priority} />
              {announcement.isPinned && (
                <Pin size={16} className="text-amber-500 rotate-45" />
              )}
            </div>
            <h2 className="text-[28px] font-black text-foreground leading-tight">
              {announcement.title}
            </h2>
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                  {announcement.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-[13px] font-black text-foreground leading-none">
                    {announcement.author.name}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {announcement.author.role}
                  </p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-border hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  Posted On
                </span>
                <div className="flex items-center gap-2 text-[13px] font-black text-foreground">
                  <Calendar size={14} className="text-primary" />
                  {new Date(announcement.postedDate).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "long", year: "numeric" },
                  )}
                </div>
              </div>
              {announcement.expiryDate && (
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    Expires On
                  </span>
                  <div className="flex items-center gap-2 text-[13px] font-black text-rose-500">
                    <Clock size={14} />
                    {announcement.expiryDate}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-2xl transition-colors text-muted-foreground active:scale-90 flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white dark:bg-card">
          <div className="space-y-6">
            <p className="text-[16px] text-foreground/90 leading-loose whitespace-pre-wrap font-medium">
              {announcement.message}
            </p>
          </div>

          {announcement.attachments.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-border">
              <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Paperclip size={14} /> Attachments (
                {announcement.attachments.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {announcement.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-sm">
                        <Download size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-foreground truncate max-w-[150px]">
                          {file.name}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDownload(file.name)}
                      className="p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  announcement.isAcknowledged
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-amber-500/20 text-amber-600"
                }`}
              >
                {announcement.isAcknowledged ? (
                  <CheckCircle size={24} />
                ) : (
                  <Bell size={24} />
                )}
              </div>
              <div>
                <h5 className="text-[15px] font-black text-foreground leading-none">
                  {announcement.needsAcknowledgement
                    ? announcement.isAcknowledged
                      ? "Already Acknowledged"
                      : "Acknowledgement Required"
                    : "No Action Required"}
                </h5>
                <p className="text-[12px] font-bold text-muted-foreground mt-1.5">
                  {announcement.isAcknowledged
                    ? `Confirmed on ${announcement.acknowledgedAt}`
                    : announcement.needsAcknowledgement
                      ? "Please read and acknowledge this update."
                      : "This is for your information only."}
                </p>
              </div>
            </div>
            {announcement.needsAcknowledgement &&
              !announcement.isAcknowledged && (
                <button
                  onClick={onAcknowledge}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold uppercase tracking-wider shadow-xl shadow-primary/20 hover:opacity-95 active:scale-95 transition-all"
                >
                  Acknowledge Now
                </button>
              )}
          </div>
        </div>

        <div className="p-8 bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <ThumbsUp size={16} />
              <span className="text-[13px] font-black">
                {announcement.likes} Likes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="text-[13px] font-black">
                {announcement.comments} Comments
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span className="text-[13px] font-black">
                {announcement.views} Views
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {!announcement.isRead && (
              <button
                onClick={onMarkRead}
                className="flex-1 sm:flex-none px-6 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl text-[12px] font-semibold uppercase tracking-wider transition-all"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-10 py-3 bg-secondary text-foreground hover:bg-border rounded-xl text-[12px] font-semibold uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
