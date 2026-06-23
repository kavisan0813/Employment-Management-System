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
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  UserCheck,
  CheckCircle,
  Copy,
  Linkedin,
  Send,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

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
  isDirectReport?: boolean;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const COLLEAGUES_DATA: Colleague[] = [
  // Direct Reports (My Team)
  {
    id: "EMP-0102",
    name: "Arjun Mehta",
    role: "Senior Developer",
    designation: "Senior Frontend Developer",
    department: "Engineering",
    status: "Active",
    availability: "Available",
    email: "arjun.m@nexushr.com",
    phone: "+91 98765 43211",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
    initials: "AM",
    location: "Bangalore, India",
    joinedDate: "Mar 05, 2023",
    manager: "Suresh Iyer",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
    isDirectReport: true,
  },
  {
    id: "EMP-0103",
    name: "Sneha Rao",
    role: "Developer",
    designation: "Frontend Developer",
    department: "Engineering",
    status: "Active",
    availability: "In Meeting",
    email: "sneha.r@nexushr.com",
    phone: "+91 98765 43212",
    skills: ["React Native", "JavaScript", "Redux Toolkit", "Figma"],
    initials: "SR",
    location: "Bangalore, India",
    joinedDate: "Jun 18, 2024",
    manager: "Suresh Iyer",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
    isDirectReport: true,
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
    skills: ["HTML5", "CSS3", "JavaScript", "Vue.js"],
    initials: "DP",
    location: "Pune, India",
    joinedDate: "Jan 10, 2026",
    manager: "Suresh Iyer",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
    isDirectReport: true,
  },
  {
    id: "EMP-0105",
    name: "Leo Martinez",
    role: "Developer",
    designation: "UI/UX Developer",
    department: "Engineering",
    status: "Active",
    availability: "Available",
    email: "leo.m@nexushr.com",
    phone: "+91 98765 43214",
    skills: ["UI/UX Design", "Framer Motion", "Tailwind CSS", "React"],
    initials: "LM",
    location: "Mumbai, India",
    joinedDate: "Nov 12, 2024",
    manager: "Suresh Iyer",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 10:00 AM - 07:00 PM",
    isDirectReport: true,
  },

  // Other Colleagues / Leaders
  {
    id: "EMP-0101",
    name: "Rajan Kumar",
    role: "Director",
    designation: "Technical Delivery Director",
    department: "Engineering",
    status: "Active",
    availability: "Busy",
    email: "rajan.k@nexushr.com",
    phone: "+91 98765 43210",
    skills: ["System Design", "Cloud Infrastructure", "Engineering Management"],
    initials: "RK",
    location: "Bangalore, India",
    joinedDate: "Jan 12, 2022",
    manager: "Sanjay Gupta",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:00 AM - 06:00 PM",
  },
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
    skills: ["Recruitment", "Employee Relations", "Strategic Planning"],
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
    skills: ["Product Roadmapping", "User Research", "Agile Methodology"],
    initials: "RC",
    location: "San Francisco, USA",
    joinedDate: "Feb 10, 2020",
    manager: "CEO",
    timezone: "PST (GMT-8:00)",
    workSchedule: "Mon - Fri, 09:00 AM - 05:00 PM",
  },
  {
    id: "EMP-0405",
    name: "Neha Sharma",
    role: "Specialist",
    designation: "L&D Specialist",
    department: "Human Resources",
    status: "Active",
    availability: "Available",
    email: "neha.s@nexushr.com",
    phone: "+91 98765 33333",
    skills: ["Training Delivery", "Content Development", "LMS Admin"],
    initials: "NS",
    location: "Delhi, India",
    joinedDate: "Jul 15, 2023",
    manager: "Sarah Johnson",
    timezone: "IST (GMT+5:30)",
    workSchedule: "Mon - Fri, 09:30 AM - 06:30 PM",
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* UI Badges                                                      */
/* ─────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: Colleague["status"] }) => {
  const styles = {
    Active: "bg-emerald-500/10 text-[#00B87C] border-[#00B87C]/20",
    "On Leave": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Remote: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Offline: "bg-secondary text-muted-foreground border-border",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${styles[status]}`}
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
      <div className={`w-2.5 h-2.5 rounded-full ${styles[availability]}`} />
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        {availability}
      </span>
    </div>
  );
};

export function ManagerTeamDirectory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "All Departments",
    location: "All Locations",
    status: "All Status",
    availability: "All Availability",
  });

  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(
    null,
  );
  const [targetColleague, setTargetColleague] = useState<Colleague | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const clearFilters = () => {
    setFilters({
      department: "All Departments",
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
        matchesLocation &&
        matchesStatus &&
        matchesAvail
      );
    });
  };

  const directReports = useMemo(
    () => applyFilters(COLLEAGUES_DATA.filter((c) => c.isDirectReport)),
    [search, filters],
  );

  const otherEmployees = useMemo(
    () => applyFilters(COLLEAGUES_DATA.filter((c) => !c.isDirectReport)),
    [search, filters],
  );

  const hasActiveFilters =
    search !== "" ||
    filters.department !== "All Departments" ||
    filters.location !== "All Locations" ||
    filters.status !== "All Status" ||
    filters.availability !== "All Availability";

  const handleExport = () => {
    const headers = [
      "ID", "Name", "Role", "Designation", "Department",
      "Status", "Availability", "Email", "Phone", "Skills",
      "Location", "Joined Date", "Manager", "Timezone", "Work Schedule", "Is Direct Report"
    ];
    const allMatching = [...directReports, ...otherEmployees];
    const rows = allMatching.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.role}"`,
      `"${c.designation}"`,
      `"${c.department}"`,
      c.status,
      c.availability,
      c.email,
      `"${c.phone}"`,
      `"${c.skills.join("; ")}"`,
      `"${c.location}"`,
      `"${c.joinedDate}"`,
      `"${c.manager}"`,
      `"${c.timezone}"`,
      `"${c.workSchedule}"`,
      c.isDirectReport ? "Yes" : "No",
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_directory_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!", "success", "Directory list exported successfully.");
  };

  const handleOpenMail = (email: string) => {
    window.location.href = `mailto:${email}`;
    showToast("Email Client Opened", "success", `Drafting email to ${email}`);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !targetColleague) return;
    const mailtoUrl = `mailto:${targetColleague.email}?subject=${encodeURIComponent("Message from Manager")}&body=${encodeURIComponent(messageText)}`;
    window.location.href = mailtoUrl;
    showToast(
      "Email Client Opened",
      "success",
      `Drafting email message to ${targetColleague.name}`,
    );
    setMessageText("");
    setShowMessageModal(false);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent relative">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm flex-shrink-0">
            <Users size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none">
              Team Directory
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Directory of direct reports and all company employees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-card border border-border rounded-xl text-[13px] font-bold text-foreground hover:bg-secondary transition-all flex items-center gap-2"
          >
            <ExternalLink size={16} className="text-[#00B87C]" />
            Export
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${
                view === "grid"
                  ? "bg-emerald-500/10 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${
                view === "list"
                  ? "bg-emerald-500/10 text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Search + Filter Bar ──────────────────────────────────── */}
      <div className="bg-card p-6 rounded-[28px] border border-border shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#00B87C]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, department, designation or email..."
              className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-2xl text-[14px] font-bold text-foreground outline-none focus:border-[#00B87C] transition-all"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-[13px] font-bold text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all flex items-center gap-2 shrink-0 border border-rose-500/20"
            >
              <X size={16} /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              key: "department",
              options: ["All Departments", "Engineering", "HR", "Product"],
            },
            {
              key: "location",
              options: [
                "All Locations",
                "Bangalore",
                "Mumbai",
                "Pune",
                "London",
                "San Francisco",
              ],
            },
            {
              key: "status",
              options: ["All Status", "Active", "On Leave", "Remote"],
            },
            {
              key: "availability",
              options: [
                "All Availability",
                "Available",
                "Busy",
                "In Meeting",
                "Away",
              ],
            },
          ].map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={filters[filter.key as keyof typeof filters]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                className="w-full appearance-none pl-4 pr-10 py-3 bg-background border border-border rounded-2xl text-[13px] font-bold text-foreground outline-none cursor-pointer focus:border-[#00B87C] transition-all"
              >
                {filter.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <ChevronRight
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Directory Results ────────────────────────────────────── */}
      {directReports.length === 0 && otherEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[32px] border-dashed">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-foreground">
            No colleagues found
          </h3>
          <p className="text-[14px] font-bold text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 px-6 py-3 bg-[#00B87C] text-white rounded-xl font-bold text-[13px] hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section: Direct Reports (My Team) */}
          {directReports.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#00B87C] rounded-full" />
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider">
                    My Team (Direct Reports)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#00B87C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  {directReports.length} Direct Reports
                </span>
              </div>

              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {directReports.map((colleague) => (
                    <ColleagueCard
                      key={colleague.id}
                      colleague={colleague}
                      onSelect={() => setSelectedColleague(colleague)}
                      onMessage={() => {
                        setTargetColleague(colleague);
                        setShowMessageModal(true);
                      }}
                      onEmail={handleOpenMail}
                    />
                  ))}
                </div>
              ) : (
                <ColleagueTable
                  list={directReports}
                  onSelect={setSelectedColleague}
                  onMessage={(colleague) => {
                    setTargetColleague(colleague);
                    setShowMessageModal(true);
                  }}
                  onEmail={handleOpenMail}
                />
              )}
            </div>
          )}

          {/* Section: All Company Employees */}
          {otherEmployees.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-slate-400 rounded-full" />
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider">
                    All Employees
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full uppercase tracking-wider border border-border">
                  {otherEmployees.length} Colleagues
                </span>
              </div>

              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {otherEmployees.map((colleague) => (
                    <ColleagueCard
                      key={colleague.id}
                      colleague={colleague}
                      onSelect={() => setSelectedColleague(colleague)}
                      onMessage={() => {
                        setTargetColleague(colleague);
                        setShowMessageModal(true);
                      }}
                      onEmail={handleOpenMail}
                    />
                  ))}
                </div>
              ) : (
                <ColleagueTable
                  list={otherEmployees}
                  onSelect={setSelectedColleague}
                  onMessage={(colleague) => {
                    setTargetColleague(colleague);
                    setShowMessageModal(true);
                  }}
                  onEmail={handleOpenMail}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Profile Slide Panel ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedColleague && (
          <ColleagueSlidePanel
            colleague={selectedColleague}
            onClose={() => setSelectedColleague(null)}
            onMessage={() => {
              setTargetColleague(selectedColleague);
              setShowMessageModal(true);
            }}
            onCopyEmail={handleOpenMail}
          />
        )}
      </AnimatePresence>

      {/* ─── Message Dialog Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showMessageModal && targetColleague && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessageModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[480px] rounded-[32px] shadow-2xl p-8 border border-border flex flex-col"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-[#00B87C] font-bold text-xs">
                  {targetColleague.initials}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground leading-none">
                    Send Quick Message
                  </h3>
                  <p className="text-[12px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                    To: {targetColleague.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2.5 hover:bg-secondary rounded-xl text-muted-foreground transition-all ml-auto"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Write your message to ${targetColleague.name}...`}
                  className="w-full bg-background border border-border rounded-2xl p-4 text-[14px] font-semibold text-foreground outline-none focus:border-[#00B87C] transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 py-4 border border-border text-[12px] font-bold uppercase tracking-wider rounded-2xl hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="flex-1 py-4 bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Send Message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Card Component                                                 */
/* ─────────────────────────────────────────────────────────────── */
function ColleagueCard({
  colleague,
  onSelect,
  onMessage,
  onEmail,
}: {
  colleague: Colleague;
  onSelect: () => void;
  onMessage: () => void;
  onEmail: (email: string) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-card p-6 rounded-[28px] border transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group flex flex-col items-center text-center h-full relative overflow-hidden ${
        colleague.isDirectReport
          ? "border-[#00B87C]/30 shadow-emerald-500/[0.02]"
          : "border-border"
      }`}
    >
      {colleague.isDirectReport && (
        <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-wider px-3 py-1 rounded-br-xl border-r border-b border-emerald-500/30">
          Direct
        </div>
      )}

      {/* Avatar */}
      <div className="relative mb-5 mt-2">
        <div className="w-18 h-18 rounded-3xl bg-emerald-500/5 flex items-center justify-center text-xl font-bold text-[#00B87C] border-2 border-card shadow-sm overflow-hidden group-hover:border-[#00B87C] transition-all">
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
          className={`absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-2 border-card ${
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
        <h4 className="text-[16px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors leading-tight">
          {colleague.name}
        </h4>
        <p className="text-[12px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
          {colleague.designation}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 mb-5">
        <span className="px-2.5 py-0.5 rounded-md bg-secondary text-[#00B87C] text-[9px] font-bold uppercase tracking-wider border border-border">
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
              onEmail(colleague.email);
            }}
            className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-[#00B87C] hover:bg-emerald-500/10 transition-all border border-border/50"
            title="Open Mail"
          >
            <Mail size={15} />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMessage();
          }}
          className="w-full py-2.5 bg-emerald-500/10 text-[#00B87C] hover:text-white text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#00B87C] transition-all border border-emerald-500/20"
        >
          Message
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Table View Component                                           */
/* ─────────────────────────────────────────────────────────────── */
function ColleagueTable({
  list,
  onSelect,
  onMessage,
  onEmail,
}: {
  list: Colleague[];
  onSelect: (c: Colleague) => void;
  onMessage: (c: Colleague) => void;
  onEmail: (email: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-[28px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Employee
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Role & Department
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Availability
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className="group hover:bg-secondary/35 transition-all cursor-pointer border-b border-border last:border-0"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-[10px] bg-emerald-500/5 flex items-center justify-center text-[12px] font-bold text-[#00B87C] border border-border shadow-sm overflow-hidden group-hover:border-[#00B87C] transition-all">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          c.initials
                        )}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                          c.availability === "Available"
                            ? "bg-emerald-500"
                            : c.availability === "Busy"
                              ? "bg-red-500"
                              : c.availability === "In Meeting"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors leading-none flex items-center gap-2">
                        {c.name}
                        {c.isDirectReport && (
                          <span className="bg-emerald-500/10 text-[#00B87C] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Direct
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                        {c.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="text-[13px] font-bold text-foreground">
                      {c.designation}
                    </p>
                    <p className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider mt-0.5">
                      {c.department}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-4 px-6">
                  <AvailabilityBadge availability={c.availability} />
                </td>
                <td className="py-4 px-6">
                  <p className="text-[13px] font-bold text-muted-foreground flex items-center gap-1.5">
                    <MapPin size={14} className="text-muted-foreground/60" />{" "}
                    {c.location}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEmail(c.email);
                      }}
                      className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-[#00B87C] hover:bg-emerald-500/10 transition-all border border-border/50"
                      title="Copy Email"
                    >
                      <Mail size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessage(c);
                      }}
                      className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-[#00B87C] hover:bg-emerald-500/10 transition-all border border-border/50"
                      title="Message"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Slide Panel Details                                            */
/* ─────────────────────────────────────────────────────────────── */
function ColleagueSlidePanel({
  colleague,
  onClose,
  onMessage,
  onCopyEmail,
}: {
  colleague: Colleague;
  onClose: () => void;
  onMessage: () => void;
  onCopyEmail: (email: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[4000] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      {/* Slide Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-card w-full max-w-[480px] h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] border-l border-border flex flex-col overflow-y-auto custom-scrollbar z-50 p-8"
      >
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={20} />
        </button>

        {/* Profile Details Header */}
        <div className="flex flex-col items-center text-center mt-12 pb-8 border-b border-border">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-[32px] bg-emerald-500/5 flex items-center justify-center text-3xl font-bold text-[#00B87C] border-2 border-border shadow-sm overflow-hidden">
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
              className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-card ${
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

          <h2 className="text-[22px] font-bold text-foreground leading-tight">
            {colleague.name}
          </h2>
          <p className="text-[14px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
            {colleague.designation}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-0.5 rounded-md bg-secondary text-[#00B87C] text-[11px] font-bold uppercase tracking-wider border border-border">
              {colleague.department}
            </span>
            <StatusBadge status={colleague.status} />
            {colleague.isDirectReport && (
              <span className="px-3 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider">
                Direct Report
              </span>
            )}
          </div>
        </div>

        {/* Profile Info Details Tabs */}
        <div className="py-8 space-y-6 flex-1">
          {/* Section: General Info */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={14} className="text-muted-foreground/60" /> Job
              Information
            </h3>
            <div className="bg-secondary/30 p-5 rounded-2xl border border-border/50 space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-muted-foreground">
                  Employee ID
                </span>
                <span className="font-bold text-foreground">
                  {colleague.id}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-muted-foreground">Manager</span>
                <span className="font-bold text-foreground">
                  {colleague.manager}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-muted-foreground">
                  Date Joined
                </span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Calendar size={13} className="text-[#00B87C]" />{" "}
                  {colleague.joinedDate}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-muted-foreground">
                  Timezone
                </span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Clock size={13} className="text-blue-500" />{" "}
                  {colleague.timezone}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-muted-foreground">
                  Work Hours
                </span>
                <span className="font-bold text-foreground">
                  {colleague.workSchedule}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <UserCheck size={14} className="text-muted-foreground/60" />{" "}
              Contact Details
            </h3>
            <div className="space-y-3">
              {/* Email */}
              <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#00B87C] flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Business Email
                    </p>
                    <p className="text-[13px] font-bold text-foreground truncate mt-0.5">
                      {colleague.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onCopyEmail(colleague.email)}
                  className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all border border-border/30 shadow-sm"
                  title="Copy Email"
                >
                  <Copy size={13} />
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#00B87C] flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Contact Number
                    </p>
                    <p className="text-[13px] font-bold text-foreground truncate mt-0.5">
                      {colleague.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <Linkedin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      LinkedIn Profile
                    </p>
                    <p className="text-[13px] font-bold text-foreground truncate mt-0.5">
                      linkedin.com/in/
                      {colleague.name.toLowerCase().replace(" ", "")}
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Redirecting",
                      "info",
                      "Opening LinkedIn Profile...",
                    );
                  }}
                  className="p-2 hover:bg-blue-500 hover:text-white rounded-lg text-muted-foreground transition-all border border-border/30 shadow-sm"
                  title="Open Link"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Section: Skills & Competencies */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={14} className="text-muted-foreground/60" />{" "}
              Skills & Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {colleague.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-secondary text-foreground text-[11px] font-bold rounded-lg border border-border uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Send message button */}
        <div className="border-t border-border pt-6 mt-auto">
          <button
            onClick={onMessage}
            className="w-full py-4 bg-[#00B87C] text-white text-[13px] font-bold uppercase tracking-wider rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Send Message
          </button>
        </div>
      </motion.div>
    </div>
  );
}
