import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  IndianRupee,
  MessageSquare,
  Download,
  Zap,
  Star,
  Target,
  Users,
  Home,
  Sparkles,
  ArrowUpRight,
  CalendarX,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router";
import { showToast } from "../../components/workflow/ToastNotification";

const PENDING_ACTIONS = [
  {
    id: 1,
    title: "Performance reviews due",
    desc: "2 team members pending appraisals",
    icon: Star,
    color: "var(--destructive)",
    bg: "rgba(239, 68, 68, 0.1)",
    status: "Overdue",
    route: "/performance",
  },
  {
    id: 2,
    title: "Team report pending",
    desc: "Monthly report not yet submitted",
    icon: FileText,
    color: "var(--primary)",
    bg: "var(--secondary)",
    status: "Due Soon",
    route: "/employees",
  },
  {
    id: 3,
    title: "My goals check-in",
    desc: "Q1 goal review due this week",
    icon: Target,
    color: "var(--primary)",
    bg: "var(--secondary)",
    status: "Due Soon",
    route: "/manager/my-goals",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Approve Leaves",
    icon: Calendar,
    route: "/leave",
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    label: "My Payslip",
    icon: Download,
    route: "/manager/my-payslips",
    color: "#7C3AED",
    bg: "rgba(124, 58, 237, 0.1)",
  },
  {
    label: "Submit Expense",
    icon: Receipt,
    route: "/manager/my-expenses",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    label: "My Goals",
    icon: Target,
    route: "/manager/my-goals",
    color: "var(--destructive)",
    bg: "rgba(239, 68, 68, 0.1)",
  },
  {
    label: "View Team",
    icon: Users,
    route: "/employees",
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    label: "New Ticket",
    icon: MessageSquare,
    route: "/manager/support",
    color: "#0EA5E9",
    bg: "rgba(14, 165, 233, 0.1)",
  },
];

const ANNOUNCEMENTS = [
  {
    title: "Team Performance Updates",
    time: "2 hours ago",
    priority: "amber",
    desc: "Q1 team metrics available",
  },
  {
    title: "Policy Change",
    time: "1 day ago",
    priority: "red",
    desc: "Updated travel policy for managers",
  },
  {
    title: "Townhall Meeting",
    time: "2 days ago",
    priority: "green",
    desc: "Leadership team sync this Friday",
  },
];

export function ManagerPersonalDashboard() {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  const handleQuickAction = (route: string) => {
    navigate(route);
    showToast("Opening Module", "info", "Navigating...");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 animate-in fade-in duration-700 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-amber-500/10 flex items-center justify-center shadow-sm border border-amber-500/20">
            <Home size={22} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none mb-1">
              My Dashboard
            </h1>
            <p className="text-[13px] text-[#6B7280]">Monday, April 6, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm w-fit">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[12px] font-bold text-amber-500 uppercase tracking-wider">
            Manager Access
          </span>
        </div>
      </div>

      <div className="w-full bg-card rounded-2xl p-8 mb-8 flex items-center justify-between border border-border shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-[22px] font-bold text-foreground mb-1">
            Good Morning, Suresh! 👋
          </h2>
          <p className="text-[14px] font-medium text-muted-foreground">
            You have{" "}
            <span className="text-amber-500 font-bold">3 pending items</span>{" "}
            requiring your attention.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
              Engineering Manager
            </div>
            <p className="text-[11px] font-bold text-muted-foreground mt-1">
              #EMP-2041
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 p-0.5 overflow-hidden shadow-inner">
            <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              SI
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group">
          <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center mb-6">
            <Calendar size={18} className="text-amber-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            MY ATTENDANCE
          </p>
          <p className="text-[28px] font-bold text-amber-500">94%</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[12px] text-[#6B7280]">22/24 days</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-semibold border border-amber-500/20">
              +1.8%
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={() => navigate("/manager/my-attendance")}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-amber-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group">
          <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 flex items-center justify-center mb-6">
            <CalendarX size={18} className="text-blue-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            LEAVE BALANCE
          </p>
          <p className="text-[28px] font-bold text-foreground">8d</p>
          <div className="flex flex-col mt-3">
            <span className="text-[12px] text-[#6B7280] mb-1">
              remaining this quarter
            </span>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              CL: 4 | EL: 4
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={() => navigate("/manager/my-leaves")}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-amber-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group">
          <div className="w-9 h-9 rounded-[10px] bg-indigo-500/10 flex items-center justify-center mb-6">
            <IndianRupee size={18} className="text-indigo-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            MY CTC
          </p>
          <p className="text-[28px] font-bold text-indigo-500">₹24L</p>
          <div className="flex flex-col mt-3">
            <span className="text-[12px] text-[#6B7280] mb-1">
              Annual package
            </span>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              Revised Apr 2025
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={() => navigate("/manager/my-payslips")}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-amber-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative group cursor-pointer active:scale-[0.98]">
          <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center mb-6">
            <Star size={18} className="text-amber-500" />
          </div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            MY RATING
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-[28px] font-bold text-amber-500">4.6</p>
            <p className="text-[16px] font-bold text-muted-foreground/60">★</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[12px] text-[#6B7280]">
              Last review: Dec '25
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-semibold border border-amber-500/20 uppercase tracking-tighter">
              Excellent
            </span>
          </div>
          <ArrowUpRight
            size={14}
            onClick={() => navigate("/manager/my-performance")}
            className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-amber-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[65%] space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
              <h3 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                PENDING ACTIONS
              </h3>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {PENDING_ACTIONS.map((action, i) => (
                <div
                  key={action.id}
                  className={`flex items-center justify-between p-5 hover:bg-[#00B87C]/[0.08] transition-all cursor-pointer ${i !== PENDING_ACTIONS.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: action.bg }}
                    >
                      <action.icon size={18} style={{ color: action.color }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-foreground truncate">
                        {action.title}
                      </h4>
                      <p className="text-[12px] text-muted-foreground truncate font-medium">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${action.status === "Overdue" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}
                    >
                      {action.status}
                    </span>
                    <button
                      onClick={() => navigate(action.route)}
                      className="text-amber-500 text-[13px] font-bold hover:underline whitespace-nowrap"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-7 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-bold text-foreground">
                Today's Schedule
              </h3>
              <span className="text-[12px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
                April 6, 2026
              </span>
            </div>
            <div className="bg-secondary/50 rounded-2xl p-6 border-l-[4px] border-amber-500 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                  MORNING SHIFT
                </p>
                <p className="text-[16px] font-bold text-foreground">
                  09:00 – 18:00
                </p>
              </div>
              <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
                <Clock size={16} className="text-amber-500" />
                <span className="text-[13px] font-bold text-amber-500">
                  Punch in at 08:55
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[35%] space-y-8">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-amber-500 fill-amber-500" />
              <h3 className="text-[14px] font-bold text-foreground">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.route)}
                  onMouseEnter={() => setHoveredAction(i)}
                  onMouseLeave={() => setHoveredAction(null)}
                  className="flex flex-col items-start gap-3 p-4 rounded-xl border transition-all duration-200 group text-left h-[100px] justify-between relative overflow-hidden"
                  style={{
                    backgroundColor:
                      hoveredAction === i ? action.bg : "var(--background)",
                    borderColor:
                      hoveredAction === i
                        ? `${action.color}30`
                        : "var(--border)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: action.bg }}
                  >
                    <action.icon size={16} style={{ color: action.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-foreground leading-tight">
                    {action.label}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="absolute top-4 right-4 text-muted-foreground/40 group-hover:text-amber-500 transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-bold text-foreground">
                Announcements
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-bold border border-amber-500/20">
                3 new
              </span>
            </div>
            <div className="space-y-4">
              {ANNOUNCEMENTS.map((ann, i) => (
                <div
                  key={i}
                  className={`pl-3 border-l-[3px] py-1 ${ann.priority === "green" ? "border-primary" : ann.priority === "amber" ? "border-amber-500" : "border-rose-500"}`}
                >
                  <h4 className="text-[13px] font-bold text-foreground hover:text-amber-500 cursor-pointer transition-colors leading-tight mb-1">
                    {ann.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {ann.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="text-[11px] text-muted-foreground font-medium truncate">
                      {ann.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/manager/announcements")}
              className="w-full mt-6 py-3 text-amber-500 text-[13px] font-bold hover:underline text-center"
            >
              View All Announcements →
            </button>
          </div>

          <div className="bg-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden group cursor-pointer">
            <Sparkles
              size={80}
              className="absolute -right-4 -bottom-4 text-white opacity-10 group-hover:rotate-12 transition-transform duration-500"
            />
            <h3 className="text-[16px] font-bold mb-1">Team Milestone!</h3>
            <p className="text-white/80 text-[12px] font-medium mb-4">
              Engineering team hit 95% sprint completion rate.
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="w-6 h-6 rounded-full border-2 border-amber-500 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-white"
                >
                  +
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
