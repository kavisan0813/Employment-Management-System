import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar as CalendarIcon, Pencil, Download,
  User, FileText, CalendarCheck, TrendingUp, Briefcase, Eye, EyeOff, Linkedin,
  Award, Activity, ChevronRight, MoreVertical
} from "lucide-react";
import { employees, performanceData } from "../data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const tabs = ["Personal", "Employment", "Documents", "Attendance", "Payroll", "Performance", "Training", "Assets"];

const skills = [
  { name: "React", level: 90 },
  { name: "Node.js", level: 80 },
  { name: "PostgreSQL", level: 75 },
  { name: "Docker", level: 65 },
  { name: "AWS", level: 70 },
  { name: "TypeScript", level: 85 },
];

const activities = [
  { icon: TrendingUp, color: "#10B981", title: "Salary revised ↑", time: "2 weeks ago" },
  { icon: CalendarCheck, color: "#3B82F6", title: "Leave approved", time: "1 month ago" },
  { icon: Award, color: "#8B5CF6", title: "Certification added", time: "2 months ago" },
  { icon: FileText, color: "#F59E0B", title: "Document uploaded", time: "3 months ago" },
  { icon: Activity, color: "var(--primary)", title: "Performance review completed", time: "6 months ago" },
  { icon: Briefcase, color: "#6366F1", title: "Project assigned", time: "8 months ago" },
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
    const filename = doc.name.includes('.') ? doc.name.substring(0, doc.name.lastIndexOf('.')) + '.txt' : doc.name + '.txt';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActivityRoute = (title: string) => {
    if (title.toLowerCase().includes("salary")) return () => setActiveTab("payroll");
    if (title.toLowerCase().includes("leave")) return () => setActiveTab("attendance");
    if (title.toLowerCase().includes("cert")) return () => setActiveTab("training");
    if (title.toLowerCase().includes("doc")) return () => setActiveTab("documents");
    if (title.toLowerCase().includes("performance")) return () => setActiveTab("performance");
    if (title.toLowerCase().includes("project")) return () => setActiveTab("employment");
    return () => navigate("/");
  };

  const QuickInfoItem = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string | undefined, href?: string }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-[13px] font-bold truncate block hover:underline" style={{ color: "var(--foreground)" }}>{value}</a>
        ) : (
          <p className="text-[13px] font-bold truncate" style={{ color: "var(--foreground)" }}>{value}</p>
        )}
      </div>
    </div>
  );

  const OrgBox = ({ name, title, avatar, highlighted }: { name: string, title: string, avatar?: string, highlighted?: boolean }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl min-w-[200px] shrink-0 transition-all hover:shadow-md cursor-pointer"
      onClick={() => highlighted ? null : navigate(`/employees`)}
      style={{ backgroundColor: highlighted ? "var(--secondary)" : "var(--background)", border: highlighted ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
      <img src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
        className="w-10 h-10 rounded-full object-cover border-2"
        style={{ borderColor: highlighted ? "var(--primary)" : "var(--border)" }} alt={name} />
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: highlighted ? "var(--primary)" : "var(--foreground)" }}>{name}</p>
        <p className="text-xs font-medium truncate" style={{ color: "var(--muted-foreground)" }}>{title}</p>
      </div>
    </div>
  );

  const InfoField = ({ label, value }: { label: string, value: string }) => (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</p>
      <p className="text-[15px] font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 mb-5 rounded-xl px-4 py-2 transition-colors font-bold text-sm"
        style={{ color: "var(--muted-foreground)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
        }}
      >
        <ArrowLeft size={16} />
        Back to Directory
      </button>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT COLUMN (70%) */}
        <div className="flex-1 flex flex-col gap-6 xl:w-[70%] min-w-0">

          {/* PROFILE HEADER CARD */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="h-[120px] w-full" style={{ background: "linear-gradient(135deg, var(--primary), #047857)" }}></div>
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex gap-6 items-start">
                  <img src={employee.avatar} className="w-[110px] h-[110px] rounded-full object-cover relative -mt-12 border-[4px] bg-white" style={{ borderColor: "var(--card)" }} alt={employee.name} />
                  <div className="pt-3">
                    <h1 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>
                      {employee.name} <span className="text-sm font-bold ml-2" style={{ color: "var(--muted-foreground)" }}>#{employee.id}</span>
                    </h1>
                    <p className="text-[16px] font-bold mt-1" style={{ color: "var(--primary)" }}>{employee.designation}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px]">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold shadow-sm" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                        <Briefcase size={14} color="var(--primary)" /> {employee.department}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold shadow-sm" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                        <MapPin size={14} color="var(--primary)" /> {employee.location}
                      </span>
                      <span className="flex items-center gap-2 font-bold px-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: employee.status === 'Active' ? '#10B981' : '#F59E0B' }}></span>
                        <span style={{ color: "var(--foreground)" }}>{employee.status}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{employee.employmentType || "Full-time"}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons row */}
                <div className="pt-4 flex items-center gap-2">
                  <button className="p-2.5 rounded-xl transition-colors hover:scale-105" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }} title="Message" onClick={() => window.open(`mailto:${employee.email}`)}><Mail size={18} /></button>
                  <button className="p-2.5 rounded-xl transition-colors hover:scale-105" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }} title="Schedule Meet" onClick={() => window.open("https://calendar.google.com", "_blank")}><CalendarIcon size={18} /></button>
                  <button className="p-2.5 rounded-xl transition-colors hover:scale-105" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }} title="Download Profile" onClick={handleDownloadProfile}><Download size={18} /></button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 text-white shadow-md whitespace-nowrap" style={{ background: "linear-gradient(135deg, var(--primary), #047857)" }} onClick={() => setIsEditModalOpen(true)}>
                    <Pencil size={16} /> Edit Profile
                  </button>
                  <div className="relative">
                    <button 
                      className="p-2.5 rounded-xl transition-colors hover:scale-105" 
                      style={{ backgroundColor: "var(--background)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }} 
                      title="More"
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      onBlur={() => setTimeout(() => setIsMoreMenuOpen(false), 200)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {isMoreMenuOpen && (
                      <div 
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg z-[2000] py-1"
                        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                      >

                        <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5" style={{ color: "var(--foreground)" }} onClick={() => { setIsMoreMenuOpen(false); setActiveTab("performance"); }}>View Analytics</button>
                        <div className="h-px w-full my-1" style={{ backgroundColor: "var(--border)" }}></div>
                        <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-red-50 text-red-600" onClick={() => { setIsMoreMenuOpen(false); alert("Account deactivated."); }}>Deactivate Account</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-10 mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Tenure</p>
                  <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>4.2 yrs</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: "var(--border)" }}></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Attendance</p>
                  <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>92%</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: "var(--border)" }}></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Rating</p>
                  <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>{employee.performance ? (employee.performance / 20).toFixed(1) : "4.5"}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex overflow-x-auto pb-1 -mb-1 scrollbar-hide" style={{ borderBottom: "1px solid var(--border)" }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className="px-6 py-4 text-[14px] transition-all whitespace-nowrap"
                style={{
                  color: activeTab === tab.toLowerCase() ? "var(--primary)" : "var(--muted-foreground)",
                  borderBottom: activeTab === tab.toLowerCase() ? "3px solid var(--primary)" : "3px solid transparent",
                  fontWeight: activeTab === tab.toLowerCase() ? 800 : 600,
                  marginBottom: "-1px"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          {activeTab === "employment" ? (
            <div className="flex flex-col gap-6 pb-10">

              {/* Job Details Section */}
              <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                  <InfoField label="Employee ID" value={employee.id} />
                  <InfoField label="Designation" value={employee.designation} />
                  <InfoField label="Department" value={employee.department} />
                  <InfoField label="Manager" value={employee.manager || "Sarah Jenkins"} />
                  <InfoField label="Employment Type" value={employee.employmentType || "Full-time"} />
                  <InfoField label="Work Location" value={employee.location} />
                  <InfoField label="Work Mode" value="Hybrid (3 days onsite)" />
                  <InfoField label="Date of Joining" value={new Date(employee.joinDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} />
                  <InfoField label="Probation End" value="01 Sep 2022" />
                  <InfoField label="Notice Period" value="60 Days" />
                </div>
              </div>

              {/* Reporting Structure Section */}
              <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Reporting Structure</h3>
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  <OrgBox name="Sarah Jenkins" title="CEO" avatar="https://i.pravatar.cc/150?u=sarah" />
                  <ChevronRight size={20} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                  <OrgBox name="David Chen" title="VP Engineering" avatar="https://i.pravatar.cc/150?u=david" />
                  <ChevronRight size={20} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                  <OrgBox name={employee.manager || "Engineering Manager"} title="Manager" avatar={`https://i.pravatar.cc/150?u=${employee.manager}`} />
                  <ChevronRight size={20} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                  <OrgBox name={employee.name} title={employee.designation} avatar={employee.avatar} highlighted />
                </div>
              </div>

              {/* Compensation Summary Section */}
              <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>Compensation Summary</h3>
                  <button onClick={() => setIsSalaryVisible(!isSalaryVisible)} className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", padding: "6px 12px", borderRadius: "8px" }}>
                    {isSalaryVisible ? <EyeOff size={16} /> : <Eye size={16} />} {isSalaryVisible ? "Hide Details" : "Reveal Details"}
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="rounded-2xl p-6 flex-1 w-full relative overflow-hidden" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--primary)" }}></div>
                    <p className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>Current CTC</p>
                    <div className="mt-2 h-[40px] flex items-center">
                      {isSalaryVisible ? (
                        <p className="text-3xl font-black" style={{ color: "var(--foreground)", animation: "fadeIn 0.3s ease" }}>
                          ₹{employee.salary ? employee.salary.toLocaleString() : "18,00,000"} <span className="text-base font-bold ml-1" style={{ color: "var(--muted-foreground)" }}>/ year</span>
                        </p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black tracking-widest" style={{ color: "var(--foreground)", filter: "blur(6px)", userSelect: "none" }}>₹18,00,000 / year</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full flex gap-8">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Last Revised</p>
                      <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>01 April 2025</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Next Review</p>
                      <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>01 April 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Competencies Section */}
              <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Skills & Competencies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {skills.map(s => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 rounded-lg text-[13px] font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{s.name}</span>
                        <span className="text-[13px] font-black" style={{ color: "var(--foreground)" }}>{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full w-full overflow-hidden" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.level}%`, background: "linear-gradient(90deg, var(--primary), #10B981)" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "personal" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                <InfoField label="Full Name" value={employee.name} />
                <InfoField label="Date of Birth" value={new Date(employee.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
                <InfoField label="Gender" value={employee.gender} />
                <InfoField label="Phone Number" value={employee.phone} />
                <InfoField label="Email" value={employee.email} />
                <InfoField label="Emergency Contact" value={employee.emergencyContact} />
                <div className="md:col-span-2 lg:col-span-3">
                  <InfoField label="Home Address" value={employee.address} />
                </div>
              </div>
            </div>
          ) : activeTab === "documents" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Documents</h3>
              <div className="space-y-4">
                {docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl transition-colors hover:shadow-sm" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: doc.name.endsWith('.pdf') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                        <FileText size={18} color={doc.name.endsWith('.pdf') ? '#EF4444' : '#10B981'} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold" style={{ color: "var(--foreground)" }}>{doc.name}</p>
                        <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--muted-foreground)" }}>Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-[13px] font-bold" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)" }} onClick={() => handleDownloadDoc(doc)}>
                      <Download size={16} /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "attendance" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Attendance Summary (Current Month)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Working Days", value: "22", color: "var(--foreground)", bg: "var(--background)" },
                  { label: "Present", value: "18", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
                  { label: "Absent", value: "2", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
                  { label: "Leaves", value: "2", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
                ].map(stat => (
                  <div key={stat.label} className="p-6 rounded-xl flex flex-col items-center justify-center border" style={{ backgroundColor: stat.bg, borderColor: "var(--border)" }}>
                    <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "payroll" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Payroll Summary (Last Month)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border flex flex-col items-center justify-center" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                  <p className="text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Gross Salary</p>
                  <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>₹{(employee.salary ? employee.salary / 12 : 150000).toLocaleString()}</p>
                </div>
                <div className="p-6 rounded-xl border flex flex-col items-center justify-center" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                  <p className="text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Deductions</p>
                  <p className="text-2xl font-black" style={{ color: "#EF4444" }}>₹{(employee.salary ? (employee.salary / 12) * 0.1 : 15000).toLocaleString()}</p>
                </div>
                <div className="p-6 rounded-xl flex flex-col items-center justify-center border-2" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--primary)" }}>
                  <p className="text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Net Pay</p>
                  <p className="text-2xl font-black" style={{ color: "var(--primary)" }}>₹{(employee.salary ? (employee.salary / 12) * 0.9 : 135000).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : activeTab === "performance" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-black mb-6" style={{ color: "var(--foreground)" }}>Performance Trend</h3>
              <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis domain={[60, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        fontWeight: 600
                      }}
                      itemStyle={{ color: "var(--foreground)", fontWeight: 800 }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: "var(--card)", strokeWidth: 3 }} activeDot={{ r: 8, fill: "var(--primary)", strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Current Score</p>
                  <p className="text-2xl font-black" style={{ color: "var(--primary)" }}>{employee.performance}%</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Rating</p>
                  <p className="text-lg font-bold" style={{ color: "#10B981" }}>{employee.performance >= 90 ? "⭐ Excellent" : employee.performance >= 80 ? "✅ Good" : "📈 Improving"}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>YoY Change</p>
                  <p className="text-lg font-bold" style={{ color: "#10B981" }}>+14%</p>
                </div>
              </div>
            </div>
          ) : activeTab === "training" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>Training & Certifications</h3>
                <button className="text-sm font-bold transition-colors hover:opacity-80" style={{ color: "var(--primary)" }} onClick={() => setIsTrainingModalOpen(true)}>+ Add Record</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Advanced React Patterns", date: "Jan 2026", status: "Completed", type: "Internal" },
                  { name: "AWS Certified Developer", date: "Nov 2025", status: "Completed", type: "Certification" },
                  { name: "Leadership Workshop", date: "In Progress", status: "Ongoing", type: "Internal" }
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                    <div>
                      <p className="text-[15px] font-bold" style={{ color: "var(--foreground)" }}>{t.name}</p>
                      <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--muted-foreground)" }}>{t.type} • {t.date}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: t.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: t.status === 'Completed' ? '#10B981' : '#F59E0B' }}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "assets" ? (
            <div className="rounded-2xl p-7 shadow-sm transition-all" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>Assigned Assets</h3>
                <button className="text-sm font-bold transition-colors hover:opacity-80" style={{ color: "var(--primary)" }} onClick={() => setIsAssetModalOpen(true)}>+ Request Asset</button>
              </div>
              <div className="space-y-4">
                {[
                  { id: "AST-2022-041", name: "MacBook Pro 16\"", category: "Laptop", date: "01 Mar 2022", status: "Assigned" },
                  { id: "AST-2022-089", name: "Dell UltraSharp 27\"", category: "Monitor", date: "15 Mar 2022", status: "Assigned" },
                  { id: "AST-2024-102", name: "Magic Keyboard", category: "Accessory", date: "10 Jan 2024", status: "Assigned" },
                ].map((ast, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold" style={{ color: "var(--foreground)" }}>
                          {ast.name} <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded-md" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{ast.id}</span>
                        </p>
                        <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--muted-foreground)" }}>{ast.category} • Issued {ast.date}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: ast.status === 'Assigned' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: ast.status === 'Assigned' ? '#10B981' : '#F59E0B' }}>
                      {ast.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center rounded-2xl shadow-sm border border-dashed" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <Briefcase size={24} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <h4 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Information</h4>
              <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>This module is currently being updated for the new design system.</p>
              <button onClick={() => setActiveTab("employment")} className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: "var(--primary)", color: "white" }}>View Employment Tab</button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="flex flex-col gap-6 xl:w-[30%] min-w-[320px] shrink-0 pb-10">

          {/* Quick Info Card */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-base font-black mb-5" style={{ color: "var(--foreground)" }}>Quick Info</h3>
            <div className="space-y-4">
              <QuickInfoItem icon={<Phone size={16} />} label="Phone" value={employee.phone} />
              <QuickInfoItem icon={<Mail size={16} />} label="Email" value={employee.email} href={`mailto:${employee.email}`} />
              <QuickInfoItem icon={<Linkedin size={16} />} label="LinkedIn" value="linkedin.com/in/employee" href="https://linkedin.com/in/employee" />

              <div className="h-px w-full my-5" style={{ backgroundColor: "var(--border)" }}></div>

              <QuickInfoItem icon={<CalendarIcon size={16} />} label="Birthday" value="15 August 1992" />
              <QuickInfoItem icon={<User size={16} />} label="Blood Group" value="O+" />

              <div className="h-px w-full my-5" style={{ backgroundColor: "var(--border)" }}></div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Emergency Contact</p>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{employee.emergencyContact}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--muted-foreground)" }}>Spouse</p>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-emerald-50" style={{ color: "var(--primary)", border: "1px solid var(--primary)" }} onClick={() => window.open(`tel:${employee.phone}`)}>
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-base font-black mb-6" style={{ color: "var(--foreground)" }}>Recent Activity</h3>
            <div className="relative pl-3 space-y-7">
              <div className="absolute left-[27px] top-4 bottom-4 w-[2px] z-0 rounded-full" style={{ backgroundColor: "var(--border)" }}></div>
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10 group cursor-pointer" onClick={getActivityRoute(act.title)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: "var(--card)", border: "2px solid var(--background)" }}>
                    <act.icon size={18} color={act.color} />
                  </div>
                  <div className="pt-2">
                    <p className="text-[14px] font-bold transition-colors group-hover:text-emerald-500" style={{ color: "var(--foreground)" }}>{act.title}</p>
                    <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--muted-foreground)" }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-80" style={{ color: "var(--foreground)", border: "1px solid var(--border)", backgroundColor: "var(--background)" }} onClick={() => navigate("/")}>View All Activity</button>
          </div>

          {/* Manager Notes Card */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-base font-black mb-5" style={{ color: "var(--foreground)" }}>Manager Notes</h3>
            <div className="p-4 rounded-xl mb-4 relative overflow-hidden" style={{ backgroundColor: "var(--secondary)" }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--primary)" }}></div>
              <p className="text-[13px] font-medium italic" style={{ color: "var(--primary)", lineHeight: "1.6" }}>
                "Arjun has been performing exceptionally well in the recent Q3 sprint. Needs to focus slightly more on peer code reviews going forward."
              </p>
              <p className="text-[11px] font-bold mt-3 text-right" style={{ color: "var(--primary)", opacity: 0.8 }}>
                — {employee.manager || "David Chen"}, 2 weeks ago
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-90 shadow-sm" style={{ color: "white", backgroundColor: "var(--primary)" }} onClick={() => setIsNoteModalOpen(true)}>+ Add New Note</button>
          </div>

          {/* Documents Card */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-base font-black mb-5" style={{ color: "var(--foreground)" }}>Key Documents</h3>
            <div className="space-y-3">
              {docs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-black/5" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: doc.name.endsWith('.pdf') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                      <FileText size={14} color={doc.name.endsWith('.pdf') ? '#EF4444' : '#10B981'} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: "var(--foreground)" }}>{doc.name}</p>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--muted-foreground)" }}>{doc.date}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)" }} title="Download" onClick={() => handleDownloadDoc(doc)}>
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-80" style={{ color: "var(--foreground)", border: "1px solid var(--border)", backgroundColor: "transparent" }} onClick={() => setActiveTab("documents")}>View Document Center</button>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-6 rounded-2xl shadow-xl"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
              Edit Employee Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Full Name</label>
                <input
                  type="text"
                  defaultValue={employee.name}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Designation</label>
                <input
                  type="text"
                  defaultValue={employee.designation}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Department</label>
                <input
                  type="text"
                  defaultValue={employee.department}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--primary), #047857)", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Training Record Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Add Training Record</h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Training Name</label>
                <input type="text" placeholder="e.g. Advanced UI Design" className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Date</label>
                  <input type="text" placeholder="Jan 2026" className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Type</label>
                  <select className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}>
                    <option>Internal</option>
                    <option>Certification</option>
                    <option>External Workshop</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsTrainingModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
                <button onClick={() => setIsTrainingModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--primary), #047857)" }}>Add Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Request New Asset</h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Asset Name</label>
                <input type="text" placeholder="e.g. Wireless Mouse" className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Category</label>
                <select className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}>
                  <option>Hardware</option>
                  <option>Peripheral</option>
                  <option>License / Software</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Reason for Request</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px", resize: "none" }}></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsAssetModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
                <button onClick={() => setIsAssetModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--primary), #047857)" }}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Add Manager Note</h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Note Content</label>
                <textarea rows={4} placeholder="Type your note here..." className="w-full px-3 py-2 rounded-xl outline-none transition-colors" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px", resize: "none" }}></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
                <button onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--primary), #047857)" }}>Save Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
