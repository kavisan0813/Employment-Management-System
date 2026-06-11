import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Pencil,
  Download,
  User,
  FileText,
  CalendarCheck,
  TrendingUp,
  Briefcase,
  Eye,
  EyeOff,
  Linkedin,
  Award,
  Activity,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { employees, performanceData } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tabs = [
  "Personal",
  "Employment",
  "Documents",
  "Attendance",
  "Payroll",
  "Performance",
  "Training",
  "Assets",
];

const skills = [
  { name: "React", level: 90 },
  { name: "Node.js", level: 80 },
  { name: "PostgreSQL", level: 75 },
  { name: "Docker", level: 65 },
  { name: "AWS", level: 70 },
  { name: "TypeScript", level: 85 },
];

const activities = [
  {
    icon: TrendingUp,
    color: "var(--primary)",
    title: "Salary revised ↑",
    time: "2 weeks ago",
  },
  {
    icon: CalendarCheck,
    color: "var(--primary)",
    title: "Leave approved",
    time: "1 month ago",
  },
  {
    icon: Award,
    color: "var(--primary)",
    title: "Certification added",
    time: "2 months ago",
  },
  {
    icon: FileText,
    color: "var(--primary)",
    title: "Document uploaded",
    time: "3 months ago",
  },
  {
    icon: Activity,
    color: "var(--primary)",
    title: "Performance review completed",
    time: "6 months ago",
  },
  {
    icon: Briefcase,
    color: "var(--primary)",
    title: "Project assigned",
    time: "8 months ago",
  },
];

const docs = [
  { name: "Offer Letter.pdf", date: "01 Mar 2022" },
  { name: "NDA Agreement.pdf", date: "01 Mar 2022" },
  { name: "Passport_Copy.jpg", date: "05 Mar 2022" },
  { name: "PAN_Card.pdf", date: "05 Mar 2022" },
  { name: "Last Appraisal.pdf", date: "15 Apr 2025" },
];

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("employment");
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const employee = employees.find((e) => e.id === id) || employees[0];

  const handleDownloadProfile = () => {
    const dataStr = JSON.stringify(employee, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, "_")}_Profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDoc = (doc: { name: string; date: string }) => {
    const textContent = `Document Name: ${doc.name}\nUpload Date: ${doc.date}\n\n[Mock file content]`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = doc.name.includes(".")
      ? doc.name.substring(0, doc.name.lastIndexOf(".")) + ".txt"
      : doc.name + ".txt";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActivityRoute = (title: string) => {
    if (title.toLowerCase().includes("salary"))
      return () => setActiveTab("payroll");
    if (title.toLowerCase().includes("leave"))
      return () => setActiveTab("attendance");
    if (title.toLowerCase().includes("cert"))
      return () => setActiveTab("training");
    if (title.toLowerCase().includes("doc"))
      return () => setActiveTab("documents");
    if (title.toLowerCase().includes("performance"))
      return () => setActiveTab("performance");
    if (title.toLowerCase().includes("project"))
      return () => setActiveTab("employment");
    return () => navigate("/");
  };

  const QuickInfoItem = ({
    icon,
    label,
    value,
    href,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
    href?: string;
  }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-secondary text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-bold truncate block hover:underline text-foreground"
          >
            {value}
          </a>
        ) : (
          <p className="text-[13px] font-bold truncate text-foreground">
            {value}
          </p>
        )}
      </div>
    </div>
  );

  const OrgBox = ({
    name,
    title,
    avatar,
    highlighted,
  }: {
    name: string;
    title: string;
    avatar?: string;
    highlighted?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl min-w-[200px] shrink-0 transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] cursor-pointer border ${highlighted ? "bg-secondary border-primary" : "bg-background border-border"}`}
      onClick={() => (highlighted ? null : navigate(`/employees`))}
    >
      <img
        src={
          avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        }
        className={`w-10 h-10 rounded-full object-cover border-2 ${highlighted ? "border-primary" : "border-border"}`}
        alt={name}
      />
      <div className="min-w-0">
        <p
          className={`text-sm font-bold truncate ${highlighted ? "text-primary" : "text-foreground"}`}
        >
          {name}
        </p>
        <p className="text-xs font-medium truncate text-muted-foreground">
          {title}
        </p>
      </div>
    </div>
  );

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-wider mb-1 text-muted-foreground">
        {label}
      </p>
      <p className="text-[15px] font-bold text-foreground">{value}</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] animate-in fade-in duration-700">
      {/* Back button */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 mb-5 rounded-xl px-4 py-2 transition-colors font-bold text-sm text-muted-foreground hover:bg-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Directory
      </button>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT COLUMN (70%) */}
        <div className="flex-1 flex flex-col gap-6 xl:w-[70%] min-w-0">
          {/* PROFILE HEADER CARD */}
          <div className="rounded-2xl overflow-hidden shadow-sm bg-card border border-border">
            <div
              className="h-[140px] w-full relative"
              style={{
                background: "linear-gradient(135deg, #00B87C 0%, #009966 100%)",
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex gap-6 items-start">
                  <img
                    src={employee.avatar}
                    className="w-[110px] h-[110px] rounded-full object-cover relative -mt-12 border-[4px] border-card bg-card"
                    alt={employee.name}
                  />
                  <div className="pt-3">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h1 className="text-[28px] font-black text-foreground tracking-tight leading-none">
                        {employee.name}
                      </h1>
                      <div className="px-2.5 py-1 rounded-lg bg-[#00B87C]/10 text-[#00B87C] text-[11px] font-black uppercase tracking-widest border border-[#00B87C]/20 shadow-sm">
                        {employee.designation}
                      </div>
                    </div>
                    <p className="text-[15px] font-bold text-muted-foreground mt-1.5 flex items-center gap-2">
                      {employee.department}{" "}
                      <span className="w-1 h-1 rounded-full bg-border" /> #
                      {employee.id}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px]">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold shadow-sm bg-background text-foreground border border-border">
                        <Briefcase size={14} className="text-primary" />{" "}
                        {employee.department}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold shadow-sm bg-background text-foreground border border-border">
                        <MapPin size={14} className="text-primary" />{" "}
                        {employee.location}
                      </span>
                      <span className="flex items-center gap-2 font-bold px-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${employee.status === "Active" ? "bg-primary" : "bg-muted-foreground"}`}
                        ></span>
                        <span className="text-foreground">
                          {employee.status}
                        </span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-secondary text-primary">
                        {employee.employmentType || "Full-time"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    className="p-2.5 rounded-xl transition-colors hover:scale-105 bg-secondary text-primary"
                    title="Message"
                    onClick={() => window.open(`mailto:${employee.email}`)}
                  >
                    <Mail size={18} />
                  </button>
                  <button
                    className="p-2.5 rounded-xl transition-colors hover:scale-105 bg-secondary text-primary"
                    title="Schedule Meet"
                    onClick={() =>
                      window.open("https://calendar.google.com", "_blank")
                    }
                  >
                    <CalendarIcon size={18} />
                  </button>
                  <button
                    className="p-2.5 rounded-xl transition-colors hover:scale-105 bg-secondary text-primary"
                    title="Download Profile"
                    onClick={handleDownloadProfile}
                  >
                    <Download size={18} />
                  </button>
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 text-white shadow-md shadow-primary/20 whitespace-nowrap bg-primary"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Pencil size={16} /> Edit Profile
                  </button>
                  <div className="relative">
                    <button
                      className="p-2.5 rounded-xl transition-colors hover:scale-105 bg-background text-muted-foreground border border-border"
                      title="More"
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      onBlur={() =>
                        setTimeout(() => setIsMoreMenuOpen(false), 200)
                      }
                    >
                      <MoreVertical size={18} />
                    </button>
                    {isMoreMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg z-[2000] py-1 animate-in zoom-in-95 duration-100 bg-card border border-border">
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary/10 text-foreground"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsMoreMenuOpen(false);
                            setActiveTab("performance");
                          }}
                        >
                          View Analytics
                        </button>
                        <div className="h-px w-full my-1 bg-border"></div>
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-rose-500/10 text-rose-500"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsMoreMenuOpen(false);
                            alert("Account deactivated.");
                          }}
                        >
                          Deactivate Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 mt-8 pt-6 border-t border-border">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                    Tenure
                  </p>
                  <p className="text-xl font-black text-foreground">4.2 yrs</p>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                    Attendance
                  </p>
                  <p className="text-xl font-black text-foreground">92%</p>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                    Rating
                  </p>
                  <p className="text-xl font-black text-foreground">
                    {employee.performance
                      ? (employee.performance / 20).toFixed(1)
                      : "4.5"}
                    /5
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-1 -mb-1 scrollbar-hide border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 text-[14px] transition-all whitespace-nowrap mb-[-1px] ${activeTab === tab.toLowerCase() ? "text-primary border-b-[3px] border-primary font-extrabold" : "text-muted-foreground border-b-[3px] border-transparent font-semibold"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pb-10">
            {activeTab === "employment" ? (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                  <h3 className="text-lg font-black mb-6 text-foreground">
                    Job Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                    <InfoField label="Employee ID" value={employee.id} />
                    <InfoField
                      label="Designation"
                      value={employee.designation}
                    />
                    <InfoField label="Department" value={employee.department} />
                    <InfoField
                      label="Manager"
                      value={employee.manager || "Sarah Jenkins"}
                    />
                    <InfoField
                      label="Employment Type"
                      value={employee.employmentType || "Full-time"}
                    />
                    <InfoField
                      label="Work Location"
                      value={employee.location}
                    />
                    <InfoField
                      label="Work Mode"
                      value="Hybrid (3 days onsite)"
                    />
                    <InfoField
                      label="Date of Joining"
                      value={new Date(employee.joinDate).toLocaleDateString(
                        "en-US",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    />
                    <InfoField label="Probation End" value="01 Sep 2022" />
                    <InfoField label="Notice Period" value="60 Days" />
                  </div>
                </div>

                <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                  <h3 className="text-lg font-black mb-6 text-foreground">
                    Reporting Structure
                  </h3>
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <OrgBox
                      name="Sarah Jenkins"
                      title="CEO"
                      avatar="https://i.pravatar.cc/150?u=sarah"
                    />
                    <ChevronRight
                      size={20}
                      className="text-muted-foreground shrink-0"
                    />
                    <OrgBox
                      name="David Chen"
                      title="VP Engineering"
                      avatar="https://i.pravatar.cc/150?u=david"
                    />
                    <ChevronRight
                      size={20}
                      className="text-muted-foreground shrink-0"
                    />
                    <OrgBox
                      name={employee.manager || "Engineering Manager"}
                      title="Manager"
                      avatar={`https://i.pravatar.cc/150?u=${employee.manager}`}
                    />
                    <ChevronRight
                      size={20}
                      className="text-muted-foreground shrink-0"
                    />
                    <OrgBox
                      name={employee.name}
                      title={employee.designation}
                      avatar={employee.avatar}
                      highlighted
                    />
                  </div>
                </div>

                <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-foreground">
                      Compensation Summary
                    </h3>
                    <button
                      onClick={() => setIsSalaryVisible(!isSalaryVisible)}
                      className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-all bg-secondary text-primary px-3 py-1.5 rounded-lg"
                    >
                      {isSalaryVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}{" "}
                      {isSalaryVisible ? "Hide Details" : "Reveal Details"}
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="rounded-2xl p-6 flex-1 w-full relative overflow-hidden bg-secondary border border-border">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <p className="text-sm font-bold text-muted-foreground">
                        Current CTC
                      </p>
                      <div className="mt-2 h-[40px] flex items-center">
                        {isSalaryVisible ? (
                          <p className="text-[28px] font-bold animate-in fade-in duration-300">
                            ₹
                            {employee.salary
                              ? employee.salary.toLocaleString()
                              : "18,00,000"}{" "}
                            <span className="text-base font-bold ml-1 text-muted-foreground">
                              / year
                            </span>
                          </p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[28px] font-bold tracking-widest text-foreground blur-md select-none">
                              ₹18,00,000 / year
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex gap-8">
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                          Last Revised
                        </p>
                        <p className="text-base font-bold text-foreground">
                          01 April 2025
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                          Next Review
                        </p>
                        <p className="text-base font-bold text-foreground">
                          01 April 2026
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                  <h3 className="text-lg font-black mb-6 text-foreground">
                    Skills & Competencies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {skills.map((s) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 rounded-lg text-[13px] font-bold bg-secondary text-primary">
                            {s.name}
                          </span>
                          <span className="text-[13px] font-black text-foreground">
                            {s.level}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full w-full overflow-hidden bg-background border border-border">
                          <div
                            className="h-full rounded-full transition-all duration-1000 bg-primary"
                            style={{ width: `${s.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === "personal" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <h3 className="text-lg font-black mb-6 text-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                  <InfoField label="Full Name" value={employee.name} />
                  <InfoField
                    label="Date of Birth"
                    value={new Date(employee.dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                  <InfoField label="Gender" value={employee.gender} />
                  <InfoField label="Phone Number" value={employee.phone} />
                  <InfoField label="Email" value={employee.email} />
                  <InfoField
                    label="Emergency Contact"
                    value={employee.emergencyContact}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <InfoField label="Home Address" value={employee.address} />
                  </div>
                </div>
              </div>
            ) : activeTab === "documents" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <h3 className="text-lg font-black mb-6 text-foreground">
                  Documents
                </h3>
                <div className="space-y-4">
                  {docs.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-sm bg-background border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-primary">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-foreground">
                            {doc.name}
                          </p>
                          <p className="text-[12px] font-semibold mt-0.5 text-muted-foreground">
                            Uploaded: {doc.date}
                          </p>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-[13px] font-bold text-primary bg-secondary hover:opacity-80"
                        onClick={() => handleDownloadDoc(doc)}
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "attendance" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <h3 className="text-lg font-black mb-6 text-foreground">
                  Attendance Summary (Current Month)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Working Days",
                      value: "22",
                      color: "text-foreground",
                      bg: "bg-background",
                    },
                    {
                      label: "Present",
                      value: "18",
                      color: "text-primary",
                      bg: "bg-secondary",
                    },
                    {
                      label: "Absent",
                      value: "2",
                      color: "text-rose-500",
                      bg: "bg-rose-500/10",
                    },
                    {
                      label: "Leaves",
                      value: "2",
                      color: "text-primary",
                      bg: "bg-secondary",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`p-6 rounded-xl flex flex-col items-center justify-center border border-border ${stat.bg}`}
                    >
                      <p className={`text-[28px] font-bold mb-1 ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "payroll" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <h3 className="text-lg font-black mb-6 text-foreground">
                  Payroll Summary (Last Month)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border border-border flex flex-col items-center justify-center bg-background">
                    <p className="text-[13px] font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                      Gross Salary
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      ₹
                      {(employee.salary
                        ? employee.salary / 12
                        : 150000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-border flex flex-col items-center justify-center bg-background">
                    <p className="text-[13px] font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                      Deductions
                    </p>
                    <p className="text-2xl font-black text-rose-500">
                      ₹
                      {(employee.salary
                        ? (employee.salary / 12) * 0.1
                        : 15000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6 rounded-xl flex flex-col items-center justify-center border-2 border-primary bg-secondary">
                    <p className="text-[13px] font-bold uppercase tracking-wider mb-2 text-primary">
                      Net Pay
                    </p>
                    <p className="text-2xl font-black text-primary">
                      ₹
                      {(employee.salary
                        ? (employee.salary / 12) * 0.9
                        : 135000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === "performance" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <h3 className="text-lg font-black mb-6 text-foreground">
                  Performance Trend
                </h3>
                <div className="h-[250px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis
                        domain={[60, 100]}
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontWeight: 600,
                        }}
                        itemStyle={{
                          color: "var(--foreground)",
                          fontWeight: 800,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--primary)"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "var(--card)", strokeWidth: 3 }}
                        activeDot={{
                          r: 8,
                          fill: "var(--primary)",
                          strokeWidth: 0,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                      Current Score
                    </p>
                    <p className="text-2xl font-black text-primary">
                      {employee.performance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                      Rating
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {employee.performance >= 90
                        ? "⭐ Excellent"
                        : employee.performance >= 80
                          ? "✅ Good"
                          : "📈 Improving"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                      YoY Change
                    </p>
                    <p className="text-lg font-bold text-primary">+14%</p>
                  </div>
                </div>
              </div>
            ) : activeTab === "training" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-foreground">
                    Training & Certifications
                  </h3>
                  <button
                    className="text-sm font-bold transition-colors hover:opacity-80 text-primary"
                    onClick={() => setIsTrainingModalOpen(true)}
                  >
                    + Add Record
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: "Advanced React Patterns",
                      date: "Jan 2026",
                      status: "Completed",
                      type: "Internal",
                    },
                    {
                      name: "AWS Certified Developer",
                      date: "Nov 2025",
                      status: "Completed",
                      type: "Certification",
                    },
                    {
                      name: "Leadership Workshop",
                      date: "In Progress",
                      status: "Ongoing",
                      type: "Internal",
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
                    >
                      <div>
                        <p className="text-[15px] font-bold text-foreground">
                          {t.name}
                        </p>
                        <p className="text-[13px] font-semibold mt-1 text-muted-foreground">
                          {t.type} • {t.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary ${t.status === "Completed" ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "assets" ? (
              <div className="rounded-2xl p-7 shadow-sm transition-all bg-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-foreground">
                    Assigned Assets
                  </h3>
                  <button
                    className="text-sm font-bold transition-colors hover:opacity-80 text-primary"
                    onClick={() => setIsAssetModalOpen(true)}
                  >
                    + Request Asset
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      id: "AST-2022-041",
                      name: 'MacBook Pro 16"',
                      category: "Laptop",
                      date: "01 Mar 2022",
                      status: "Assigned",
                    },
                    {
                      id: "AST-2022-089",
                      name: 'Dell UltraSharp 27"',
                      category: "Monitor",
                      date: "15 Mar 2022",
                      status: "Assigned",
                    },
                    {
                      id: "AST-2024-102",
                      name: "Magic Keyboard",
                      category: "Accessory",
                      date: "10 Jan 2024",
                      status: "Assigned",
                    },
                  ].map((ast, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-primary">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground">
                            {ast.name}{" "}
                            <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded-md bg-secondary text-primary">
                              {ast.id}
                            </span>
                          </p>
                          <p className="text-[13px] font-semibold mt-1 text-muted-foreground">
                            {ast.category} • Issued {ast.date}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-primary">
                        {ast.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center rounded-2xl shadow-sm border border-dashed border-border bg-card">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-background border border-border">
                  <Briefcase size={24} className="text-muted-foreground" />
                </div>
                <h4 className="text-lg font-bold text-foreground">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Information
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  This module is currently being updated for the new design
                  system.
                </p>
                <button
                  onClick={() => setActiveTab("employment")}
                  className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors bg-primary text-white hover:opacity-90"
                >
                  View Employment Tab
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:w-[30%] min-w-[320px] shrink-0 pb-10">
          <div className="rounded-2xl p-6 shadow-sm bg-card border border-border">
            <h3 className="text-base font-black mb-5 text-foreground">
              Quick Info
            </h3>
            <div className="space-y-4">
              <QuickInfoItem
                icon={<Phone size={16} />}
                label="Phone"
                value={employee.phone}
              />
              <QuickInfoItem
                icon={<Mail size={16} />}
                label="Email"
                value={employee.email}
                href={`mailto:${employee.email}`}
              />
              <QuickInfoItem
                icon={<Linkedin size={16} />}
                label="LinkedIn"
                value="linkedin.com/in/employee"
                href="https://linkedin.com/in/employee"
              />
              <div className="h-px w-full my-5 bg-border"></div>
              <QuickInfoItem
                icon={<CalendarIcon size={16} />}
                label="Birthday"
                value="15 August 1992"
              />
              <QuickInfoItem
                icon={<User size={16} />}
                label="Blood Group"
                value="O+"
              />
              <div className="h-px w-full my-5 bg-border"></div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Emergency Contact
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {employee.emergencyContact}
                    </p>
                    <p className="text-xs font-semibold mt-0.5 text-muted-foreground">
                      Spouse
                    </p>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-primary/10 text-primary border border-primary"
                    onClick={() => window.open(`tel:${employee.phone}`)}
                  >
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-sm bg-card border border-border">
            <h3 className="text-base font-black mb-6 text-foreground">
              Recent Activity
            </h3>
            <div className="relative pl-3 space-y-7">
              <div className="absolute left-[27px] top-4 bottom-4 w-[2px] z-0 rounded-full bg-border"></div>
              {activities.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 relative z-10 group cursor-pointer"
                  onClick={getActivityRoute(act.title)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 bg-card border-2 border-background">
                    <act.icon size={18} className="text-primary" />
                  </div>
                  <div className="pt-2">
                    <p className="text-[14px] font-bold transition-colors group-hover:text-primary text-foreground">
                      {act.title}
                    </p>
                    <p className="text-[12px] font-semibold mt-0.5 text-muted-foreground">
                      {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-6 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-80 text-foreground border border-border bg-background"
              onClick={() => navigate("/")}
            >
              View All Activity
            </button>
          </div>

          <div className="rounded-2xl p-6 shadow-sm bg-card border border-border">
            <h3 className="text-base font-black mb-5 text-foreground">
              Manager Notes
            </h3>
            <div className="p-4 rounded-xl mb-4 relative overflow-hidden bg-secondary">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <p className="text-[13px] font-medium italic text-primary leading-relaxed">
                "Arjun has been performing exceptionally well in the recent Q3
                sprint. Needs to focus slightly more on peer code reviews going
                forward."
              </p>
              <p className="text-[11px] font-bold mt-3 text-right text-primary opacity-80">
                — {employee.manager || "David Chen"}, 2 weeks ago
              </p>
            </div>
            <button
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 shadow-sm text-white bg-primary"
              onClick={() => setIsNoteModalOpen(true)}
            >
              + Add New Note
            </button>
          </div>

          <div className="rounded-2xl p-6 shadow-sm bg-card border border-border">
            <h3 className="text-base font-black mb-5 text-foreground">
              Key Documents
            </h3>
            <div className="space-y-3">
              {docs.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-primary/10 bg-background border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-primary">
                      <FileText size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold truncate text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-[11px] font-semibold mt-0.5 text-muted-foreground">
                        {doc.date}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg transition-colors text-primary bg-secondary hover:opacity-80"
                    title="Download"
                    onClick={() => handleDownloadDoc(doc)}
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-80 text-foreground border border-border bg-transparent"
              onClick={() => setActiveTab("documents")}
            >
              View Document Center
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 bg-card border border-border">
            <h3 className="text-[18px] font-black text-foreground mb-4">
              Edit Employee Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={employee.name}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  defaultValue={employee.designation}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  defaultValue={employee.department}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-background border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 bg-card border border-border">
            <h3 className="text-[18px] font-black text-foreground mb-4">
              Add Training Record
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Training Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced UI Design"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="Jan 2026"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                    Type
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary appearance-none">
                    <option>Internal</option>
                    <option>Certification</option>
                    <option>External Workshop</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-background border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:opacity-90"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 bg-card border border-border">
            <h3 className="text-[18px] font-black text-foreground mb-4">
              Request New Asset
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Asset Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary appearance-none">
                  <option>Hardware</option>
                  <option>Peripheral</option>
                  <option>License / Software</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Reason for Request
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAssetModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-background border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsAssetModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:opacity-90"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 bg-card border border-border">
            <h3 className="text-[18px] font-black text-foreground mb-4">
              Add Manager Note
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Note Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your note here..."
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all bg-background border border-border text-foreground text-[14px] focus:border-primary resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-background border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
