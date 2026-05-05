import { useState } from "react";
import {
  Megaphone,
  Pin,
  MessageSquare,
  ThumbsUp,
  Eye,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
type Category = "HR Updates" | "Events" | "Policy" | "Urgent" | "Payroll Update" | "L&D" | "Holiday";

interface Announcement {
  id: number;
  title: string;
  preview: string;
  category: Category;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  postedAt: string;
  likes: number;
  comments: number;
  views: number;
  isRead: boolean;
  isPinned?: boolean;
  priority?: "Urgent" | "Important" | "Normal";
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const PINNED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Q2 Appraisal Reviews Start April 25th",
    preview: "All employees must complete self-review by April 25. Manager reviews close May 5.",
    category: "Urgent",
    author: { name: "HR Team", role: "Corporate HR" },
    postedAt: "Apr 5",
    likes: 48,
    comments: 12,
    views: 284,
    isRead: false,
    isPinned: true,
    priority: "Urgent"
  },
  {
    id: 2,
    title: "New WFH Policy Effective May 1st",
    preview: "The updated hybrid work guidelines have been published. Please review the mandatory office days.",
    category: "Policy",
    author: { name: "Operations", role: "HQ Ops" },
    postedAt: "Apr 2",
    likes: 32,
    comments: 8,
    views: 195,
    isRead: true,
    isPinned: true,
    priority: "Important"
  }
];

const RECENT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 3,
    title: "Team Building Event — April 30",
    preview: "Join us for an outdoor retreat at Green Valley Resorts. Activities include trekking and team lunch.",
    category: "Events",
    author: { name: "Sarah Johnson", role: "HR Manager" },
    postedAt: "Today",
    likes: 24,
    comments: 5,
    views: 110,
    isRead: false,
  },
  {
    id: 4,
    title: "Salary Revision Effective April 1st",
    preview: "The annual increment letters have been dispatched to your official emails.",
    category: "Payroll Update",
    author: { name: "Finance Team", role: "Payroll Dept" },
    postedAt: "Yesterday",
    likes: 85,
    comments: 15,
    views: 450,
    isRead: true,
  },
  {
    id: 5,
    title: "New Training Module: Docker & K8s",
    preview: "Enroll now for the advanced containerization workshop starting next Monday.",
    category: "L&D",
    author: { name: "Technical Training", role: "L&D Head" },
    postedAt: "Apr 10",
    likes: 18,
    comments: 3,
    views: 88,
    isRead: false,
  },
  {
    id: 6,
    title: "Office Closed: Good Friday",
    preview: "Please note that the office will remain closed on April 10th for the holiday.",
    category: "Holiday",
    author: { name: "Admin", role: "Facility Manager" },
    postedAt: "Apr 8",
    likes: 12,
    comments: 2,
    views: 150,
    isRead: true,
  }
];

const CATEGORIES: ("All" | Category)[] = ["All", "HR Updates", "Events", "Policy", "Urgent"];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function CategoryChip({ category, size = "sm" }: { category: string, size?: "sm" | "md" }) {
  const cfg: Record<string, string> = {
    "Urgent": "bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
    "Policy": "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
    "Events": "bg-emerald-50 text-primary border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    "Payroll Update": "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/10 dark:border-teal-500/20",
    "L&D": "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20",
    "Holiday": "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-500/10 dark:border-slate-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'} font-black uppercase tracking-wider border ${cfg[category] || 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-secondary'}`}>
      {category}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeAnnouncements() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const handleMarkAllRead = () => {
    showToast("Success", "success", "All announcements marked as read");
  };

  const handleReadMore = (title: string) => {
    showToast("Announcement", "info", `Opening: ${title}`);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto pb-20 px-4">
      
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-amber-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Megaphone size={22} className="text-amber-500" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Announcements
          </h1>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-emerald-500/10 active:scale-[0.98] whitespace-nowrap"
        >
          <CheckCircle size={16} /> Mark All Read
        </button>
      </div>

      {/* ─── Filter Tabs (Pill Toggles) ────────────────────────────── */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full text-[13px] font-black transition-all border whitespace-nowrap ${
              activeTab === cat 
                ? "bg-primary text-white border-primary shadow-lg shadow-emerald-500/20" 
                : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Pinned Announcements ─────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <Pin size={14} className="text-muted-foreground rotate-45" />
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">PINNED ANNOUNCEMENTS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PINNED_ANNOUNCEMENTS.map(ann => (
            <div 
              key={ann.id} 
              className={`bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between h-full border-l-4 transition-all hover:shadow-md ${
                ann.priority === 'Urgent' ? 'border-l-rose-500' : 'border-l-amber-500'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         ann.priority === 'Urgent' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                      }`}>
                         {ann.priority === 'Urgent' ? '🚨 URGENT' : '📢 IMPORTANT'}
                      </span>
                   </div>
                   <Pin size={16} className="text-muted-foreground/30" />
                </div>
                <div>
                   <h4 className="text-[16px] font-black text-foreground mb-2 leading-tight">{ann.title}</h4>
                   <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">{ann.preview}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-black text-primary border border-border">
                          {ann.author.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[12px] font-black text-foreground">{ann.author.name}</p>
                          <p className="text-[11px] font-bold text-muted-foreground">Posted {ann.postedAt}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                       <div className="flex items-center gap-1.5">
                          <ThumbsUp size={14} />
                          <span className="text-[11px] font-bold">{ann.likes}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <MessageSquare size={14} />
                          <span className="text-[11px] font-bold">{ann.comments}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span className="text-[11px] font-bold">{ann.views}</span>
                       </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleReadMore(ann.title)}
                  className="text-primary text-[13px] font-black flex items-center gap-1 hover:underline self-start"
                 >
                    Read More →
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent Announcements ─────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">RECENT ANNOUNCEMENTS</h3>
        <div className="space-y-3">
          {RECENT_ANNOUNCEMENTS.map(ann => (
            <div 
              key={ann.id} 
              onClick={() => handleReadMore(ann.title)}
              className={`bg-card p-5 rounded-xl border transition-all hover:shadow-md cursor-pointer flex flex-col gap-4 relative overflow-hidden ${
                !ann.isRead 
                  ? "border-l-[3px] border-l-primary bg-emerald-500/5" 
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 flex-1">
                   <div className="flex items-center gap-3">
                      <CategoryChip category={ann.category} />
                      {!ann.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                   </div>
                   <h4 className="text-[14px] font-black text-foreground leading-tight group-hover:text-primary transition-colors">{ann.title}</h4>
                   <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">{ann.preview}</p>
                </div>
                <button className="p-1 text-muted-foreground/30 hover:text-foreground">
                   <MoreVertical size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                       {ann.author.name.charAt(0)}
                    </div>
                    <p className="text-[12px] font-bold text-muted-foreground">
                       Posted by <span className="font-black text-foreground">{ann.author.name}</span>, {ann.author.role}
                    </p>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-muted-foreground">{ann.postedAt}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                       <div className="flex items-center gap-1.5">
                          <ThumbsUp size={13} />
                          <span className="text-[11px] font-bold">{ann.likes}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <MessageSquare size={13} />
                          <span className="text-[11px] font-bold">{ann.comments}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Pagination ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p className="text-[13px] font-bold text-muted-foreground">Showing 1-6 of 24 announcements</p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-50" disabled>
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
             <button className="w-9 h-9 rounded-lg bg-primary text-white text-[13px] font-black">1</button>
             <button className="w-9 h-9 rounded-lg hover:bg-secondary text-foreground text-[13px] font-bold dark:hover:bg-zinc-800">2</button>
             <button className="w-9 h-9 rounded-lg hover:bg-secondary text-foreground text-[13px] font-bold dark:hover:bg-zinc-800">3</button>
          </div>
          <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-secondary">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}
