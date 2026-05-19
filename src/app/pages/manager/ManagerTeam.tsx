import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  LayoutGrid, 
  List, 
  Download, 
  X, 
  ChevronRight, 
  Calendar, 
  Star, 
  MessageSquare, 
  ExternalLink,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router";

const TEAM_DATA = [
  { 
    id: "EMP-0142", 
    name: "Arjun Mehta", 
    designation: "Sr Developer", 
    attendance: "95%", 
    leaveBal: "10d", 
    performance: "4.5", 
    ctc: "₹18L", 
    status: "Active", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    email: "arjun.m@nexushr.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    joinDate: "Mar 2021",
    workMode: "Hybrid",
    color: "#00B87C"
  },
  { 
    id: "EMP-0145", 
    name: "Sneha Rao", 
    designation: "Frontend Dev", 
    attendance: "92%", 
    leaveBal: "8d", 
    performance: "4.2", 
    ctc: "₹14L", 
    status: "WFH", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    email: "sneha.r@nexushr.com",
    phone: "+91 98765 43211",
    location: "Bangalore, India",
    joinDate: "Jan 2022",
    workMode: "Remote",
    color: "#8B5CF6"
  },
  { 
    id: "EMP-0148", 
    name: "Dev Patel", 
    designation: "Junior Dev", 
    attendance: "78%", 
    leaveBal: "12d", 
    performance: "3.8", 
    ctc: "₹8L", 
    status: "At Risk", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
    email: "dev.p@nexushr.com",
    phone: "+91 98765 43212",
    location: "Pune, India",
    joinDate: "Oct 2023",
    workMode: "On-site",
    color: "#0EA5E9"
  },
  { 
    id: "EMP-0150", 
    name: "Leo Martinez", 
    designation: "Backend Dev", 
    attendance: "90%", 
    leaveBal: "14d", 
    performance: "4.0", 
    ctc: "₹16L", 
    status: "Active", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    email: "leo.m@nexushr.com",
    phone: "+91 98765 43213",
    location: "Remote",
    joinDate: "Jul 2021",
    workMode: "Remote",
    color: "#EF4444"
  },
  { 
    id: "EMP-0152", 
    name: "Aisha Khan", 
    designation: "Sr Dev", 
    attendance: "96%", 
    leaveBal: "6d", 
    performance: "4.7", 
    ctc: "₹20L", 
    status: "Active", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    email: "aisha.k@nexushr.com",
    phone: "+91 98765 43214",
    location: "Delhi, India",
    joinDate: "Nov 2020",
    workMode: "Hybrid",
    color: "#10B981"
  }
];

export function ManagerTeam() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof TEAM_DATA[0] | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();

  const filteredTeam = TEAM_DATA.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#10B981] shadow-sm border border-[#10B981]/10">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">My Team</h1>
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              Engineering <span className="w-1 h-1 rounded-full bg-muted-foreground/40" /> 12 direct reports
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-black text-foreground hover:bg-secondary transition-all shadow-sm">
          <Download size={18} />
          EXPORT
        </button>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Search team member..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-[#00B87C]/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-48">
            <select 
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm font-bold appearance-none focus:ring-2 focus:ring-[#00B87C]/20 outline-none transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="WFH">WFH</option>
              <option value="At Risk">At Risk</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90" size={16} />
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl border border-border">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-card shadow-sm text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* ─── TEAM TABLE ─── */}
      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Direct Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-secondary/20">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Designation</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Attendance</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Leave Bal.</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Performance</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">CTC</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTeam.map((emp) => (
                <tr key={emp.id} className="hover:bg-secondary/30 transition-colors h-16 group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-border" style={{ backgroundColor: emp.color + '15', color: emp.color }}>
                        <img src={emp.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-black text-foreground truncate">{emp.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">#{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[13px] font-bold text-muted-foreground">{emp.designation}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[13px] font-black ${parseInt(emp.attendance) < 85 ? 'text-amber-500' : 'text-[#00B87C]'}`}>
                        {emp.attendance}
                      </span>
                      <div className="w-12 h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${parseInt(emp.attendance) < 85 ? 'bg-amber-500' : 'bg-[#00B87C]'}`} style={{ width: emp.attendance }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-[13px] font-black text-foreground">{emp.leaveBal}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[13px] font-black text-foreground">{emp.performance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-[13px] font-black text-foreground">{emp.ctc}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className={`px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                      emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                      emp.status === 'WFH' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10' :
                      'bg-red-50 text-red-600 dark:bg-red-500/10'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === 'Active' ? 'bg-emerald-600' :
                        emp.status === 'WFH' ? 'bg-teal-600' : 'bg-red-600'
                      }`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{emp.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button 
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-[11px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1 ml-auto hover:gap-2 transition-all"
                    >
                      Profile <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── EMPLOYEE PROFILE PANEL (SLIDE-OUT) ─── */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2100]"
            />
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-card border-l border-border z-[2200] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-base font-black text-foreground uppercase tracking-widest">Employee Profile</h2>
                <button 
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Profile Summary */}
              <div className="p-8 pb-0 text-center flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] p-1 border-4 border-[#00B87C]/10 mb-4 overflow-hidden bg-secondary">
                    <img src={selectedEmployee.avatar} alt="" className="w-full h-full rounded-[28px] object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-card border border-border flex items-center justify-center text-emerald-500 shadow-sm">
                    <UserCheck size={16} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-foreground">{selectedEmployee.name}</h3>
                <p className="text-sm font-black text-[#00B87C] uppercase tracking-wider mt-1">{selectedEmployee.designation}</p>
                <div className="flex items-center gap-3 mt-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Engineering</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{selectedEmployee.id}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Since {selectedEmployee.joinDate}</span>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[#10B981] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {selectedEmployee.status}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    Full-time
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 mt-8">
                <div className="flex items-center gap-4 border-b border-border">
                  {["Overview", "Attendance", "Leave", "Performance"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                        activeTab === tab ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                        <p className="text-sm font-bold text-foreground truncate">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-sm font-bold text-foreground">{selectedEmployee.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                        <p className="text-sm font-bold text-foreground">{selectedEmployee.location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Work Mode</p>
                        <p className="text-sm font-bold text-foreground">{selectedEmployee.workMode}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current CTC</p>
                      <p className="text-2xl font-black text-foreground">₹{parseInt(selectedEmployee.ctc.replace('₹', '').replace('L', ''))},00,000</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Calendar size={14} className="text-[#00B87C]" /> Upcoming Leaves
                      </h4>
                      <div className="space-y-2">
                        {[
                          { date: "May 24 - 26", type: "Casual Leave", status: "Approved" },
                          { date: "Jun 12", type: "Earned Leave", status: "Pending" }
                        ].map((leave, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div>
                              <p className="text-xs font-black text-foreground">{leave.date}</p>
                              <p className="text-[10px] font-bold text-muted-foreground">{leave.type}</p>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              leave.status === "Approved" ? "text-[#00B87C] bg-emerald-50 dark:bg-emerald-500/10" : "text-amber-500 bg-amber-50"
                            }`}>
                              {leave.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14} className="text-[#00B87C]" /> Recent Activity
                      </h4>
                      <div className="space-y-4 ml-2 border-l border-border pl-4">
                        {[
                          { time: "2h ago", text: "Submitted Weekly Report" },
                          { time: "Yesterday", text: "Approved Leave Request" },
                          { time: "2 days ago", text: "Completed Security Training" }
                        ].map((item, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#00B87C] ring-4 ring-card" />
                            <p className="text-xs font-bold text-foreground leading-tight">{item.text}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Attendance" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Present", value: "18", color: "#00B87C", bg: "#DCFCE7" },
                        { label: "Absent", value: "0", color: "#EF4444", bg: "#FEE2E2" },
                        { label: "Late", value: "2", color: "#F59E0B", bg: "#FEF3C7" },
                        { label: "Leave", value: "2", color: "#0EA5E9", bg: "#E0F2FE" }
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-border bg-card flex flex-col items-center">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
                          <span className="text-2xl font-black text-foreground">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-card">
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4">May 2026</h4>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {["M", "T", "W", "T", "F", "S", "S"].map(d => (
                          <div key={d} className="text-[10px] font-black text-muted-foreground py-1">{d}</div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isToday = day === 15;
                          const isAbsent = day === 5 || day === 12;
                          return (
                            <div 
                              key={i} 
                              className={`aspect-square flex items-center justify-center text-[11px] font-bold rounded-lg transition-all ${
                                isToday ? 'bg-[#00B87C] text-white' : 
                                isAbsent ? 'text-red-500 bg-red-50' : 'text-foreground hover:bg-secondary'
                              }`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Leave" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "CL", value: "4", total: "12", color: "#F59E0B" },
                        { label: "EL", value: "12", total: "24", color: "#00B87C" },
                        { label: "SL", value: "6", total: "10", color: "#EF4444" },
                        { label: "CO", value: "2", total: "5", color: "#8B5CF6" }
                      ].map((bal, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-border bg-card">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{bal.label} Bal</span>
                            <span className="text-lg font-black text-foreground">{bal.value}<span className="text-xs text-muted-foreground">/{bal.total}</span></span>
                          </div>
                          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(parseInt(bal.value)/parseInt(bal.total))*100}%`, backgroundColor: bal.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4">Recent Requests</h4>
                      <div className="space-y-2">
                        {[
                          { type: "Sick Leave", date: "Apr 12", status: "Approved" },
                          { type: "Casual Leave", date: "Mar 05 - 06", status: "Approved" }
                        ].map((req, i) => (
                          <div key={i} className="p-3 rounded-xl border border-border bg-secondary/20 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-foreground">{req.type}</p>
                              <p className="text-[10px] font-bold text-muted-foreground">{req.date}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                              {req.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Performance" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-sm">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Overall Rating</p>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={24} className={s <= Math.floor(parseFloat(selectedEmployee.performance)) ? "fill-amber-400 text-amber-400" : "text-border"} />
                        ))}
                      </div>
                      <p className="text-2xl font-black text-foreground">{selectedEmployee.performance}<span className="text-sm text-muted-foreground">/5.0</span></p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">Last Review: Dec 15, 2025</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center justify-between">
                        Goal Progress
                        <span className="text-[#00B87C] cursor-pointer hover:underline">View All</span>
                      </h4>
                      <div className="space-y-5">
                        {[
                          { label: "Q2 Deliverables", progress: 85 },
                          { label: "Code Quality Index", progress: 92 },
                          { label: "Team Mentorship", progress: 60 }
                        ].map((goal, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[11px] font-bold text-foreground">{goal.label}</span>
                              <span className="text-[11px] font-black text-[#00B87C]">{goal.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className="h-full bg-[#00B87C] rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-[#00B87C]/10 text-[#00B87C] text-[12px] font-black uppercase tracking-widest hover:bg-[#00B87C] hover:text-white transition-all flex items-center justify-center gap-2 mt-4 border border-[#00B87C]/20">
                      Write Performance Review <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-secondary/5 grid grid-cols-2 gap-3">
                <button className="py-3.5 rounded-2xl border border-border bg-card text-foreground text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                  <MessageSquare size={16} /> Message
                </button>
                <button 
                  onClick={() => navigate(`/employees/${selectedEmployee.id}`)}
                  className="py-3.5 rounded-2xl bg-[#00B87C] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
                >
                  Full Profile <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Re-using UserCheck from lucide-react if needed, otherwise use icon
const UserCheck = ({ size, className }: { size?: number; className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);
