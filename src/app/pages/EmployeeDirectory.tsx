import { useState, useMemo } from "react";
import {
  Users,
  Search,
  LayoutGrid,
  List,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  X,
  Linkedin,
  MapPin,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Home,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
interface Colleague {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: "Available" | "In Meeting" | "WFH" | "Away";
  email: string;
  phone: string;
  skills: string[];
  avatar?: string;
  initials: string;
  location: string;
  joinedDate: string;
  manager: string;
  timezone: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const TEAM_COLLEAGUES: Colleague[] = [
  {
    id: "EMP-0101",
    name: "Rajan Kumar",
    designation: "Frontend Manager",
    department: "Engineering",
    status: "Available",
    email: "rajan.k@nexushr.com",
    phone: "+91 98765 43210",
    skills: ["React", "System Design", "Leadership"],
    initials: "RK",
    location: "Bangalore, India",
    joinedDate: "Jan 12, 2022",
    manager: "Sanjay Gupta",
    timezone: "IST (GMT+5:30)",
  },
  {
    id: "EMP-0102",
    name: "Arjun Mehta",
    designation: "Senior Frontend Developer",
    department: "Engineering",
    status: "In Meeting",
    email: "arjun.m@nexushr.com",
    phone: "+91 98765 43211",
    skills: ["TypeScript", "GraphQL", "CSS"],
    initials: "AM",
    location: "Mumbai, India",
    joinedDate: "Mar 05, 2023",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
  },
  {
    id: "EMP-0103",
    name: "Sneha Rao",
    designation: "Frontend Developer",
    department: "Engineering",
    status: "Available",
    email: "sneha.r@nexushr.com",
    phone: "+91 98765 43212",
    skills: ["React Native", "Tailwind", "Redux"],
    initials: "SR",
    location: "Bangalore, India",
    joinedDate: "Jun 18, 2024",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
  },
  {
    id: "EMP-0104",
    name: "Dev Patel",
    designation: "Junior Developer",
    department: "Engineering",
    status: "WFH",
    email: "dev.p@nexushr.com",
    phone: "+91 98765 43213",
    skills: ["HTML", "JavaScript", "React"],
    initials: "DP",
    location: "Pune, India",
    joinedDate: "Jan 10, 2026",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
  },
  {
    id: "EMP-0105",
    name: "Aisha Khan",
    designation: "UI Developer",
    department: "Engineering",
    status: "Away",
    email: "aisha.k@nexushr.com",
    phone: "+91 98765 43214",
    skills: ["Figma", "SASS", "Motion"],
    initials: "AK",
    location: "Hyderabad, India",
    joinedDate: "Aug 22, 2024",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
  },
  {
    id: "EMP-0106",
    name: "Leo Singh",
    designation: "Frontend Developer",
    department: "Engineering",
    status: "Available",
    email: "leo.s@nexushr.com",
    phone: "+91 98765 43215",
    skills: ["Vue.js", "D3.js", "Next.js"],
    initials: "LS",
    location: "Delhi, India",
    joinedDate: "Oct 15, 2025",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
  },
];

const ALL_OTHER_COLLEAGUES: Colleague[] = [
  {
    id: "EMP-0201",
    name: "Sarah Johnson",
    designation: "HR Manager",
    department: "Human Resources",
    status: "Available",
    email: "sarah.j@nexushr.com",
    phone: "+91 98765 11111",
    skills: ["Recruitment", "Employee Relations"],
    initials: "SJ",
    location: "London, UK",
    joinedDate: "May 20, 2021",
    manager: "David Wilson",
    timezone: "GMT (GMT+0:00)",
  },
  {
    id: "EMP-0301",
    name: "Robert Chen",
    designation: "Product Head",
    department: "Product",
    status: "In Meeting",
    email: "robert.c@nexushr.com",
    phone: "+91 98765 22222",
    skills: ["Roadmapping", "Strategy"],
    initials: "RC",
    location: "San Francisco, USA",
    joinedDate: "Feb 10, 2020",
    manager: "CEO",
    timezone: "PST (GMT-8:00)",
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function ColleagueCard({
  colleague,
  onClick,
}: {
  colleague: Colleague;
  onClick: () => void;
}) {
  const statusConfig = {
    Available: {
      color: "text-primary",
      bg: "bg-emerald-500/10",
      icon: CheckCircle2,
    },
    "In Meeting": {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      icon: Clock,
    },
    WFH: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Home },
    Away: {
      color: "text-muted-foreground",
      bg: "bg-secondary",
      icon: AlertCircle,
    },
  };
  const conf = statusConfig[colleague.status];

  return (
    <div
      onClick={onClick}
      className="bg-card p-5 rounded-[24px] border border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group flex flex-col items-center text-center"
    >
      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-black text-muted-foreground border-2 border-card shadow-sm overflow-hidden group-hover:border-primary transition-all">
          {colleague.avatar ? (
            <img
              src={colleague.avatar}
              alt={colleague.name}
              className="w-full h-full object-cover"
            />
          ) : (
            colleague.initials
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${conf.color.replace("text-", "bg-")}`}
        />
      </div>

      {/* Info */}
      <div className="mb-4">
        <h4 className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">
          {colleague.name}
        </h4>
        <p className="text-[13px] font-bold text-muted-foreground">
          {colleague.designation}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-secondary text-primary text-[10px] font-black uppercase tracking-wider">
          {colleague.department}
        </span>
        <span
          className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${conf.color}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${conf.color.replace("text-", "bg-")}`}
          ></span>
          {colleague.status}
        </span>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${colleague.email}`;
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Mail size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${colleague.phone}`;
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Phone size={16} />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            showToast(
              "Direct Message",
              "info",
              `Opening chat with ${colleague.name}`,
            );
          }}
          className="w-full py-2 bg-emerald-500/10 text-primary text-[12px] font-black rounded-xl hover:bg-emerald-500/20 transition-all"
        >
          Message
        </button>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {colleague.skills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] font-bold rounded-md border border-border uppercase"
          >
            {skill}
          </span>
        ))}
        {colleague.skills.length > 2 && (
          <span className="text-[9px] font-bold text-muted-foreground">
            +{colleague.skills.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeDirectory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"Info" | "Contact" | "Skills">(
    "Info",
  );

  const filteredTeam = useMemo(
    () =>
      TEAM_COLLEAGUES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.department.toLowerCase().includes(search.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())),
      ),
    [search],
  );

  const filteredAll = useMemo(
    () =>
      ALL_OTHER_COLLEAGUES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.department.toLowerCase().includes(search.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())),
      ),
    [search],
  );

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700 px-4 md:px-8 py-6 pb-20 relative">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Users size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Team Directory
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-emerald-500/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-emerald-500/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* ─── Search + Filter Bar ──────────────────────────────────── */}
      <div className="bg-card p-4 rounded-[24px] border border-border shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill, department..."
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <div className="relative shrink-0">
            <select className="appearance-none pl-4 pr-8 py-2.5 bg-card border border-border rounded-xl text-[13px] font-black text-muted-foreground outline-none cursor-pointer">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Product</option>
            </select>
            <ChevronRight
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90"
            />
          </div>
          <div className="relative shrink-0">
            <select className="appearance-none pl-4 pr-8 py-2.5 bg-card border border-border rounded-xl text-[13px] font-black text-muted-foreground outline-none cursor-pointer">
              <option>All Teams</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Design</option>
            </select>
            <ChevronRight
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90"
            />
          </div>
          <span className="text-[13px] font-bold text-muted-foreground whitespace-nowrap ml-2">
            {filteredTeam.length + filteredAll.length} colleagues
          </span>
        </div>
      </div>

      {/* ─── My Team Section ──────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h3 className="text-[13px] font-black text-foreground uppercase tracking-widest">
              MY TEAM
            </h3>
          </div>
          <p className="text-[12px] font-bold text-muted-foreground ml-3 uppercase tracking-wider">
            Engineering — Frontend Team
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((colleague) => (
            <ColleagueCard
              key={colleague.id}
              colleague={colleague}
              onClick={() => setSelectedColleague(colleague)}
            />
          ))}
        </div>
      </div>

      {/* ─── All Employees Section ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-muted rounded-full" />
          <h3 className="text-[13px] font-black text-muted-foreground uppercase tracking-widest">
            ALL EMPLOYEES
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
          {filteredAll.map((colleague) => (
            <ColleagueCard
              key={colleague.id}
              colleague={colleague}
              onClick={() => setSelectedColleague(colleague)}
            />
          ))}
        </div>
      </div>

      {/* ─── Colleague Profile Quick-View Panel ─────────────────────── */}
      {selectedColleague && (
        <div className="fixed inset-0 z-[3000] animate-in fade-in duration-300 overflow-hidden">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"
            onClick={() => setSelectedColleague(null)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-[360px] bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
            {/* Panel Header */}
            <div className="p-6 pb-4 flex items-start justify-between border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl font-black text-primary border border-border">
                  {selectedColleague.initials}
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-foreground">
                    {selectedColleague.name}
                  </h3>
                  <p className="text-[12px] font-bold text-primary">
                    {selectedColleague.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedColleague(null)}
                className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 flex items-center gap-6 border-b border-border">
              {(["Info", "Contact", "Skills"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-[13px] font-black relative transition-all ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activeTab === "Info" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-[11px] font-black text-muted-foreground uppercase">
                        Location
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {selectedColleague.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-[11px] font-black text-muted-foreground uppercase">
                        Joined Date
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {selectedColleague.joinedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-[11px] font-black text-muted-foreground uppercase">
                        Reporting Manager
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {selectedColleague.manager}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-[11px] font-black text-muted-foreground uppercase">
                        Timezone
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {selectedColleague.timezone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contact" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 rounded-2xl bg-secondary border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-primary" />
                      <span className="text-[13px] font-bold text-foreground">
                        {selectedColleague.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedColleague.email);
                        showToast(
                          "Copied",
                          "success",
                          "Email copied to clipboard",
                        );
                      }}
                      className="p-2 hover:bg-card rounded-lg text-muted-foreground"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary border border-border flex items-center gap-3">
                    <Phone size={16} className="text-primary" />
                    <span className="text-[13px] font-bold text-foreground">
                      {selectedColleague.phone}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary border border-border flex items-center gap-3">
                    <Linkedin size={16} className="text-blue-500" />
                    <span className="text-[13px] font-bold text-foreground">
                      LinkedIn Profile
                    </span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Skills" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
                    Endorsed Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedColleague.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-emerald-500/10 text-primary text-[12px] font-black rounded-xl border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-6 border-t border-border">
              <button
                onClick={() =>
                  showToast(
                    "Direct Message",
                    "success",
                    `Starting chat with ${selectedColleague.name}...`,
                  )
                }
                className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
