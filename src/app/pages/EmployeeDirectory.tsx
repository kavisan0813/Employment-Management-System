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
  ExternalLink,
  User,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
interface Colleague {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  status: "Active" | "On Leave" | "Remote" | "Offline";
  availability: "Available" | "Busy" | "In Meeting" | "Away";
  email: string;
  phone: string;
  skills: string[];
  avatar?: string;
  initials: string;
  location: string;
  joinedDate: string;
  manager: string;
  timezone: string;
  workSchedule: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const TEAM_COLLEAGUES: Colleague[] = [
  {
    id: "EMP-0101",
    name: "Rajan Kumar",
    role: "Manager",
    designation: "Frontend Manager",
    department: "Engineering",
    status: "Active",
    availability: "Available",
    email: "rajan.k@nexushr.com",
    phone: "+91 98765 43210",
    skills: ["React", "System Design", "Leadership"],
    initials: "RK",
    location: "Bangalore, India",
    joinedDate: "Jan 12, 2022",
    manager: "Sanjay Gupta",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
  },
  {
    id: "EMP-0102",
    name: "Arjun Mehta",
    role: "Senior Developer",
    designation: "Senior Frontend Developer",
    department: "Engineering",
    status: "Active",
    availability: "In Meeting",
    email: "arjun.m@nexushr.com",
    phone: "+91 98765 43211",
    skills: ["TypeScript", "GraphQL", "CSS"],
    initials: "AM",
    location: "Mumbai, India",
    joinedDate: "Mar 05, 2023",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 10:00 AM - 07:00 PM",
  },
  {
    id: "EMP-0103",
    name: "Sneha Rao",
    role: "Developer",
    designation: "Frontend Developer",
    department: "Engineering",
    status: "Active",
    availability: "Available",
    email: "sneha.r@nexushr.com",
    phone: "+91 98765 43212",
    skills: ["React Native", "Tailwind", "Redux"],
    initials: "SR",
    location: "Bangalore, India",
    joinedDate: "Jun 18, 2024",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
  },
  {
    id: "EMP-0104",
    name: "Dev Patel",
    role: "Junior Developer",
    designation: "Junior Developer",
    department: "Engineering",
    status: "Remote",
    availability: "Away",
    email: "dev.p@nexushr.com",
    phone: "+91 98765 43213",
    skills: ["HTML", "JavaScript", "React"],
    initials: "DP",
    location: "Pune, India",
    joinedDate: "Jan 10, 2026",
    manager: "Rajan Kumar",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
  },
];

const ALL_OTHER_COLLEAGUES: Colleague[] = [
  {
    id: "EMP-0201",
    name: "Sarah Johnson",
    role: "Manager",
    designation: "HR Manager",
    department: "Human Resources",
    status: "Active",
    availability: "Available",
    email: "sarah.j@nexushr.com",
    phone: "+91 98765 11111",
    skills: ["Recruitment", "Employee Relations"],
    initials: "SJ",
    location: "London, UK",
    joinedDate: "May 20, 2021",
    manager: "David Wilson",
    timezone: "GMT (GMT+0:00)",
    workSchedule: "Mon - Fri, 09:00 AM - 05:00 PM",
  },
  {
    id: "EMP-0301",
    name: "Robert Chen",
    role: "Head",
    designation: "Product Head",
    department: "Product",
    status: "On Leave",
    availability: "Away",
    email: "robert.c@nexushr.com",
    phone: "+91 98765 22222",
    skills: ["Roadmapping", "Strategy"],
    initials: "RC",
    location: "San Francisco, USA",
    joinedDate: "Feb 10, 2020",
    manager: "CEO",
    timezone: "PST (GMT-8:00)",
    workSchedule: "Mon - Fri, 09:00 AM - 05:00 PM",
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────── */
/* UI Components                                                  */
/* ─────────────────────────────────────────────────────────────── */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  maxWidth = "max-w-[480px]",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={`relative bg-card w-full ${maxWidth} rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border flex flex-col max-h-[90vh]`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
            )}
            <h3 className="text-[18px] font-black text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: Colleague["status"] }) => {
  const styles = {
    Active: "bg-emerald-500/10 text-primary border-primary/20",
    "On Leave": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Remote: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Offline: "bg-secondary text-muted-foreground border-border",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const AvailabilityBadge = ({
  availability,
}: {
  availability: Colleague["availability"];
}) => {
  const styles = {
    Available: "bg-emerald-500",
    Busy: "bg-red-500",
    "In Meeting": "bg-amber-500",
    Away: "bg-slate-400",
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${styles[availability]}`} />
      <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
        {availability}
      </span>
    </div>
  );
};

function ColleagueCard({
  colleague,
  onClick,
  onMessage,
  onEmail,
}: {
  colleague: Colleague;
  onClick: () => void;
  onMessage: (c: Colleague) => void;
  onEmail: (c: Colleague) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-card p-5 rounded-[24px] border border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group flex flex-col items-center text-center h-full"
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
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${
            colleague.availability === "Available"
              ? "bg-emerald-500"
              : colleague.availability === "Busy"
                ? "bg-red-500"
                : colleague.availability === "In Meeting"
                  ? "bg-amber-500"
                  : "bg-slate-400"
          }`}
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

      <div className="flex flex-col items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-secondary text-primary text-[10px] font-black uppercase tracking-wider">
          {colleague.department}
        </span>
        <StatusBadge status={colleague.status} />
      </div>

      {/* Actions */}
      <div className="w-full space-y-3 mt-auto">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmail(colleague);
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Mail size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast("Phone Number", "info", `Calling ${colleague.phone}`);
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Phone size={16} />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMessage(colleague);
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
function ColleagueTableRow({
  colleague,
  onClick,
  onMessage,
  onEmail,
}: {
  colleague: Colleague;
  onClick: () => void;
  onMessage: (c: Colleague) => void;
  onEmail: (c: Colleague) => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="group hover:bg-secondary/50 transition-all cursor-pointer border-b border-border last:border-0"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-[12px] font-black text-muted-foreground border border-border shadow-sm overflow-hidden group-hover:border-primary transition-all">
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
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                colleague.availability === "Available"
                  ? "bg-emerald-500"
                  : colleague.availability === "Busy"
                    ? "bg-red-500"
                    : colleague.availability === "In Meeting"
                      ? "bg-amber-500"
                      : "bg-slate-400"
              }`}
            />
          </div>
          <div>
            <p className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors">
              {colleague.name}
            </p>
            <p className="text-[12px] font-bold text-muted-foreground">
              {colleague.id}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="space-y-0.5">
          <p className="text-[13px] font-bold text-foreground">
            {colleague.designation}
          </p>
          <p className="text-[11px] font-black text-primary uppercase tracking-wider">
            {colleague.department}
          </p>
        </div>
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={colleague.status} />
      </td>
      <td className="py-4 px-4">
        <AvailabilityBadge availability={colleague.availability} />
      </td>
      <td className="py-4 px-4">
        <p className="text-[13px] font-bold text-muted-foreground">
          {colleague.location}
        </p>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmail(colleague);
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Mail size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage(colleague);
            }}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeDirectory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "All Departments",
    role: "All Roles",
    location: "All Locations",
    status: "All Status",
    availability: "All Availability",
  });

  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(
    null,
  );

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOrgChartModal, setShowOrgChartModal] = useState(false);
  const [targetColleague, setTargetColleague] = useState<Colleague | null>(
    null,
  );

  const handleOpenProfile = (c: Colleague) => {
    setSelectedColleague(c);
    setShowProfileModal(true);
  };

  const handleOpenMessage = (c: Colleague) => {
    setTargetColleague(c);
    setShowMessageModal(true);
  };

  const handleOpenEmail = (c: Colleague) => {
    setTargetColleague(c);
    setShowEmailModal(true);
  };

  const clearFilters = () => {
    setFilters({
      department: "All Departments",
      role: "All Roles",
      location: "All Locations",
      status: "All Status",
      availability: "All Availability",
    });
    setSearch("");
  };

  const applyFilters = (list: Colleague[]) => {
    return list.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.department.toLowerCase().includes(search.toLowerCase()) ||
        c.designation.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchesDept =
        filters.department === "All Departments" ||
        c.department === filters.department;
      const matchesRole =
        filters.role === "All Roles" || c.role === filters.role;
      const matchesLocation =
        filters.location === "All Locations" ||
        c.location.includes(filters.location);
      const matchesStatus =
        filters.status === "All Status" || c.status === filters.status;
      const matchesAvail =
        filters.availability === "All Availability" ||
        c.availability === filters.availability;

      return (
        matchesSearch &&
        matchesDept &&
        matchesRole &&
        matchesLocation &&
        matchesStatus &&
        matchesAvail
      );
    });
  };

  const filteredTeam = useMemo(
    () => applyFilters(TEAM_COLLEAGUES),
    [search, filters],
  );
  const filteredAll = useMemo(
    () => applyFilters(ALL_OTHER_COLLEAGUES),
    [search, filters],
  );

  const hasActiveFilters =
    search !== "" ||
    filters.department !== "All Departments" ||
    filters.role !== "All Roles" ||
    filters.location !== "All Locations" ||
    filters.status !== "All Status" ||
    filters.availability !== "All Availability";

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700 px-4 md:px-8 py-6 pb-20 relative">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Users size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none mb-1">
              Team Directory
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground">
              Connect with your colleagues across departments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <div className="relative group">
            <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-[13px] font-black text-foreground hover:bg-secondary transition-all flex items-center gap-2">
              <ExternalLink size={16} className="text-primary" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
              {["Export as PDF", "Export as Excel", "Export as CSV"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      showToast(
                        "Exporting",
                        "success",
                        `${opt} generated successfully`,
                      )
                    }
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-foreground hover:bg-secondary transition-all"
                  >
                    {opt}
                  </button>
                ),
              )}
            </div>
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
      </div>

      {/* ─── Search + Filter Bar ──────────────────────────────────── */}
      <div className="bg-card p-5 rounded-[24px] border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, department, or role..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-[13px] font-black text-red-500 hover:bg-red-500/5 rounded-xl transition-all flex items-center gap-2"
            >
              <X size={16} /> Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {[
            {
              key: "department",
              options: ["All Departments", "Engineering", "HR", "Product"],
            },
            {
              key: "role",
              options: ["All Roles", "Manager", "Senior Developer", "Developer"],
            },
            {
              key: "location",
              options: ["All Locations", "Bangalore", "Mumbai", "London"],
            },
            {
              key: "status",
              options: ["All Status", "Active", "On Leave", "Remote"],
            },
            {
              key: "availability",
              options: ["All Availability", "Available", "Busy", "In Meeting"],
            },
          ].map((filter) => (
            <div key={filter.key} className="relative shrink-0">
              <select
                value={filters[filter.key as keyof typeof filters]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                className="appearance-none pl-4 pr-10 py-2.5 bg-background border border-border rounded-xl text-[13px] font-bold text-foreground outline-none cursor-pointer focus:border-primary transition-all"
              >
                {filter.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <ChevronRight
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Results Section ──────────────────────────────────────── */}
      {filteredTeam.length === 0 && filteredAll.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[32px] border-dashed">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-[18px] font-black text-foreground">
            No colleagues found
          </h3>
          <p className="text-[14px] font-bold text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-black text-[13px] hover:opacity-90 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* My Team */}
          {filteredTeam.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
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
                <span className="text-[12px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {filteredTeam.length} Members
                </span>
              </div>

              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTeam.map((colleague) => (
                    <ColleagueCard
                      key={colleague.id}
                      colleague={colleague}
                      onClick={() => handleOpenProfile(colleague)}
                      onMessage={handleOpenMessage}
                      onEmail={handleOpenEmail}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/50 border-b border-border">
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Role / Dept
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Availability
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Location
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeam.map((colleague) => (
                          <ColleagueTableRow
                            key={colleague.id}
                            colleague={colleague}
                            onClick={() => handleOpenProfile(colleague)}
                            onMessage={handleOpenMessage}
                            onEmail={handleOpenEmail}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Employees */}
          {filteredAll.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-muted rounded-full" />
                  <h3 className="text-[13px] font-black text-muted-foreground uppercase tracking-widest">
                    ALL EMPLOYEES
                  </h3>
                </div>
                <span className="text-[12px] font-black text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {filteredAll.length} Total
                </span>
              </div>

              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAll.map((colleague) => (
                    <ColleagueCard
                      key={colleague.id}
                      colleague={colleague}
                      onClick={() => handleOpenProfile(colleague)}
                      onMessage={handleOpenMessage}
                      onEmail={handleOpenEmail}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/50 border-b border-border">
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Role / Dept
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Availability
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider">
                            Location
                          </th>
                          <th className="py-4 px-4 text-[12px] font-black text-muted-foreground uppercase tracking-wider text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAll.map((colleague) => (
                          <ColleagueTableRow
                            key={colleague.id}
                            colleague={colleague}
                            onClick={() => handleOpenProfile(colleague)}
                            onMessage={handleOpenMessage}
                            onEmail={handleOpenEmail}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Profile Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={showProfileModal && !!selectedColleague}
        onClose={() => setShowProfileModal(false)}
        title="Employee Profile"
        icon={User}
        maxWidth="max-w-[520px]"
      >
        {selectedColleague && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[32px] bg-secondary flex items-center justify-center text-3xl font-black text-primary border-4 border-card shadow-xl overflow-hidden">
                  {selectedColleague.avatar ? (
                    <img
                      src={selectedColleague.avatar}
                      alt={selectedColleague.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedColleague.initials
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <StatusBadge status={selectedColleague.status} />
                </div>
              </div>
              <h3 className="text-[22px] font-black text-foreground">
                {selectedColleague.name}
              </h3>
              <p className="text-[14px] font-bold text-primary">
                {selectedColleague.designation}
              </p>
              <div className="mt-2">
                <AvailabilityBadge availability={selectedColleague.availability} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Employee ID
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Department
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.department}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Location
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.location}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Reporting To
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.manager}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Work Schedule
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.workSchedule}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Timezone
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedColleague.timezone}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Skills & Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedColleague.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 bg-secondary text-[12px] font-black rounded-xl border border-border uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  handleOpenMessage(selectedColleague);
                }}
                className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-black text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Message
              </button>
              <button
                onClick={() => setShowOrgChartModal(true)}
                className="px-4 py-3.5 bg-secondary text-foreground rounded-2xl font-black text-[13px] hover:bg-border transition-all"
              >
                Org Chart
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Message Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={showMessageModal && !!targetColleague}
        onClose={() => setShowMessageModal(false)}
        title="Send Message"
        icon={MessageSquare}
      >
        {targetColleague && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl border border-border">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center font-black text-primary border border-border">
                {targetColleague.initials}
              </div>
              <div>
                <p className="text-[13px] font-black text-foreground">
                  {targetColleague.name}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground">
                  {targetColleague.designation}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
                Quick Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Need a quick update",
                  "Meeting request",
                  "Task follow-up",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      const el = document.getElementById(
                        "msg-area",
                      ) as HTMLTextAreaElement;
                      if (el) el.value = t;
                    }}
                    className="px-3 py-1.5 bg-secondary hover:bg-border text-[11px] font-black rounded-lg transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
                Message
              </label>
              <textarea
                id="msg-area"
                rows={4}
                className="w-full p-4 bg-background border border-border rounded-2xl text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 py-3.5 bg-secondary text-foreground rounded-xl font-black text-[13px] hover:bg-border transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(
                    "Message Sent",
                    "success",
                    `Notification sent to ${targetColleague.name}`,
                  );
                  setShowMessageModal(false);
                }}
                className="flex-1 py-3.5 bg-primary text-white rounded-xl font-black text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Email Modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={showEmailModal && !!targetColleague}
        onClose={() => setShowEmailModal(false)}
        title="Send Email"
        icon={Mail}
      >
        {targetColleague && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                To
              </label>
              <div className="w-full p-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[10px] font-black text-primary border border-border">
                  {targetColleague.initials}
                </div>
                {targetColleague.email}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full p-3 bg-background border border-border rounded-xl text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all"
                placeholder="Enter subject"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Body
              </label>
              <textarea
                rows={5}
                className="w-full p-4 bg-background border border-border rounded-xl text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all resize-none"
                placeholder="Write your email content..."
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-3.5 bg-secondary text-foreground rounded-xl font-black text-[13px] hover:bg-border transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(
                    "Email Sent",
                    "success",
                    `Email successfully delivered to ${targetColleague.name}`,
                  );
                  setShowEmailModal(false);
                }}
                className="flex-1 py-3.5 bg-primary text-white rounded-xl font-black text-[13px] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Org Chart Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={showOrgChartModal && !!selectedColleague}
        onClose={() => setShowOrgChartModal(false)}
        title="Organization Chart"
        icon={Users}
        maxWidth="max-w-[600px]"
      >
        {selectedColleague && (
          <div className="space-y-8 py-4">
            {/* Manager */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-card border border-border rounded-[20px] shadow-sm flex items-center gap-3 min-w-[240px]">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-black text-muted-foreground">
                  {selectedColleague.manager.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[13px] font-black text-foreground">{selectedColleague.manager}</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Manager</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border mt-2" />
            </div>

            {/* Selected Employee */}
            <div className="flex flex-col items-center relative">
              <div className="w-full h-px bg-border absolute top-0 left-0 right-0" />
              <div className="p-4 bg-primary/5 border-2 border-primary rounded-[20px] shadow-lg flex items-center gap-3 min-w-[260px] relative z-10">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black">
                  {selectedColleague.initials}
                </div>
                <div>
                  <p className="text-[14px] font-black text-foreground">{selectedColleague.name}</p>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider">{selectedColleague.designation}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border mt-2" />
            </div>

            {/* Direct Reports / Team */}
            <div className="grid grid-cols-2 gap-4">
              {filteredTeam.filter(c => c.id !== selectedColleague.id).slice(0, 2).map(peer => (
                <div key={peer.id} className="p-3 bg-secondary border border-border rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-[10px] font-black text-muted-foreground">
                    {peer.initials}
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground">{peer.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{peer.designation}</p>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-secondary border border-border rounded-xl flex items-center justify-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">+ {filteredTeam.length - 1} Team Members</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
