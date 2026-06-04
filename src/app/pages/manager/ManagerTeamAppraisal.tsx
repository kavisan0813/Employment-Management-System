import React, { useState } from "react";
import {
  Star,
  Users,
  Clock,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  IndianRupee,
  Info,
  Search,
  RefreshCw,
  Download,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

interface TeamAppraisalMember {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  avatarBg: string;
  designation: string;
  department: string;
  attendancePct: number;
  leaveDays: number;
  lateMarks: number;
  performanceScore: number;
  kpiScore: number;
  managerRating: number;
  recommendedIncrement: number | string;
  currentSalary: number;
  revisedSalary: number;
  status: "Approved" | "Pending Finance" | "Manual Review";
  justification?: string;
  goalsMet: number;
  goalsTotal: number;
  peerRating: number;
}

const INITIAL_TEAM_MEMBERS: TeamAppraisalMember[] = [
  {
    id: "emp-1",
    name: "Arjun Mehta",
    avatar: "",
    initials: "AJ",
    avatarBg: "#DCFCE7",
    designation: "Sr Developer",
    department: "Engineering",
    attendancePct: 97,
    leaveDays: 2,
    lateMarks: 0,
    performanceScore: 97,
    kpiScore: 96,
    managerRating: 5.0,
    recommendedIncrement: 15,
    currentSalary: 150000,
    revisedSalary: 172500,
    status: "Approved",
    goalsMet: 9,
    goalsTotal: 10,
    peerRating: 4.6,
  },
  {
    id: "emp-2",
    name: "Sneha Rao",
    avatar: "",
    initials: "SR",
    avatarBg: "#EDE9FE",
    designation: "Frontend Dev",
    department: "Engineering",
    attendancePct: 92,
    leaveDays: 3,
    lateMarks: 0,
    performanceScore: 95,
    kpiScore: 94,
    managerRating: 4.8,
    recommendedIncrement: 15,
    currentSalary: 110000,
    revisedSalary: 126500,
    status: "Approved",
    goalsMet: 8,
    goalsTotal: 10,
    peerRating: 4.4,
  },
  {
    id: "emp-3",
    name: "Dev Patel",
    avatar: "",
    initials: "DP",
    avatarBg: "#E0F2FE",
    designation: "Junior Dev",
    department: "Engineering",
    attendancePct: 78,
    leaveDays: 6,
    lateMarks: 2,
    performanceScore: 85,
    kpiScore: 82,
    managerRating: 3.8,
    recommendedIncrement: 5,
    currentSalary: 650000 / 12, // Let's normalize current/revised salaries to match standard values
    revisedSalary: 68250,
    status: "Pending Finance",
    goalsMet: 6,
    goalsTotal: 10,
    peerRating: 3.9,
  },
  {
    id: "emp-4",
    name: "Leo Martinez",
    avatar: "",
    initials: "LM",
    avatarBg: "#FEE2E2",
    designation: "Backend Dev",
    department: "Engineering",
    attendancePct: 95,
    leaveDays: 2,
    lateMarks: 0,
    performanceScore: 94,
    kpiScore: 93,
    managerRating: 4.7,
    recommendedIncrement: 15,
    currentSalary: 130000,
    revisedSalary: 149500,
    status: "Pending Finance",
    goalsMet: 7,
    goalsTotal: 10,
    peerRating: 4.3,
  },
  {
    id: "emp-5",
    name: "Aisha Khan",
    avatar: "",
    initials: "AK",
    avatarBg: "#FEF3C7",
    designation: "Sr Dev",
    department: "Engineering",
    attendancePct: 82,
    leaveDays: 8,
    lateMarks: 3,
    performanceScore: 80,
    kpiScore: 78,
    managerRating: 3.5,
    recommendedIncrement: "Manual Review",
    currentSalary: 160000,
    revisedSalary: 160000,
    status: "Manual Review",
    goalsMet: 7,
    goalsTotal: 10,
    peerRating: 4.0,
  },
];

export function ManagerTeamAppraisal() {
  const [members, setMembers] = useState<TeamAppraisalMember[]>(INITIAL_TEAM_MEMBERS);
  
  // States for search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBand, setSelectedBand] = useState("All");

  // Interaction States
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTargetId, setRatingTargetId] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState(3.8);
  const [tempJustification, setTempJustification] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedYear("2025-2026");
    setSelectedStatus("All");
    setSelectedBand("All");
  };

  // Open Modal for Rating edit
  const openRatingModal = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    setRatingTargetId(memberId);
    setTempRating(member.managerRating);
    setTempJustification(member.justification || "");
    setRatingModalOpen(true);
  };

  // Save Manager Rating
  const saveRating = () => {
    if (!ratingTargetId) return;
    
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== ratingTargetId) return m;

        // Dynamic formula recalculating revision based on rating update
        let inc: number | string = m.recommendedIncrement;
        if (m.status !== "Manual Review") {
          const score = m.attendancePct * 0.4 + (tempRating * 20) * 0.6;
          inc = score >= 92 ? 15 : score >= 85 ? 12 : score >= 78 ? 8 : 5;
        }

        const revisedSal = typeof inc === "number" 
          ? Math.round(m.currentSalary * (1 + inc / 100))
          : m.currentSalary;

        return {
          ...m,
          managerRating: tempRating,
          justification: tempJustification,
          recommendedIncrement: inc,
          revisedSalary: revisedSal,
        };
      })
    );

    const targetName = members.find((m) => m.id === ratingTargetId)?.name || "Employee";
    setSuccessToast(`Successfully updated manager rating for ${targetName}!`);
    setTimeout(() => setSuccessToast(null), 4000);

    setRatingModalOpen(false);
    setRatingTargetId(null);
  };

  // Get description for manager rating
  const getRatingLabel = (score: number) => {
    if (score >= 5.0) return "Exceptional";
    if (score >= 4.0) return "Exceeds Expectations";
    if (score >= 3.0) return "Meets Expectations";
    if (score >= 2.0) return "Below Expectations";
    return "Unsatisfactory";
  };

  // Filters logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Approved" && m.status === "Approved") ||
      (selectedStatus === "Pending Finance" && m.status === "Pending Finance") ||
      (selectedStatus === "Manual Review" && m.status === "Manual Review");

    const matchesBand =
      selectedBand === "All" ||
      (selectedBand === "Excellent" && m.performanceScore >= 95) ||
      (selectedBand === "Good" && m.performanceScore >= 85 && m.performanceScore < 95) ||
      (selectedBand === "Average" && m.performanceScore < 85);

    return matchesSearch && matchesStatus && matchesBand;
  });

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      
      {/* Toast Notification */}
      {successToast && (
        <div 
          className="fixed bottom-6 right-6 px-5 py-4 rounded-xl flex items-center gap-3 shadow-2xl z-[4000] border border-[#10B981]/20 transition-all duration-300"
          style={{ backgroundColor: "rgba(16, 185, 129, 0.95)", color: "white" }}
        >
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="ml-3 text-white/80 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FEF3C7] text-[#F59E0B] shadow-sm">
            <Star size={24} fill="#F59E0B" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight leading-tight">Team Appraisal</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">FY 2025-26 — Increment recommendations for your team</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors flex items-center gap-2">
          <Download size={15} />
          Export
        </button>
      </div>

      {/* Important Notice Banner */}
      <div 
        className="mb-6 p-4 rounded-2xl border-l-[4px] border-[#F59E0B] flex gap-3.5"
        style={{ backgroundColor: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.12)", borderLeft: "4px solid #F59E0B" }}
      >
        <Info size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[14px] font-bold text-[#B45309] leading-snug">Increment Approval & Rating Policy Notice</p>
          <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
            Increment approval is handled strictly by <strong className="text-foreground">Finance</strong>. As an Engineering Manager, you can:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 mt-2.5">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="text-[#10B981] font-bold">✓</span> View increment recommendations for your team
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="text-[#EF4444] font-bold">✗</span> Cannot approve or modify final increment amounts
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="text-[#10B981] font-bold">✓</span> Provide manager rating inputs (used in calculation)
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="text-[#10B981] font-bold">✓</span> Track Finance approval status
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar (colored dot strip) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 px-4 py-3 bg-card border border-border rounded-xl text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span>9 employees eligible for increment this year</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>2 need manual review (attendance &lt; 85%)</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
          <span>Estimated payroll increase: ₹1.0L this cycle</span>
        </div>
      </div>

      {/* KPI Cards (6 columns layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Eligible for Increment</span>
            <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#10B981]">
              <Users size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#10B981]">9</h3>
            <p className="text-[11px] text-muted-foreground mt-1">of 12 team members</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pending Finance</span>
            <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
              <Clock size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#F59E0B]">3</h3>
            <p className="text-[11px] text-muted-foreground mt-1">awaiting Finance</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Approved by Finance</span>
            <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#10B981]">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#10B981]">5</h3>
            <p className="text-[11px] text-muted-foreground mt-1">increments processed</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Avg Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#10B981]">
              <CalendarCheck size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#10B981]">91%</h3>
            <p className="text-[11px] text-muted-foreground mt-1">yearly avg</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Avg Perf Score</span>
            <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6]">
              <TrendingUp size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#8B5CF6]">4.2</h3>
            <p className="text-[11px] text-muted-foreground mt-1">team average</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payroll Impact</span>
            <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6]">
              <IndianRupee size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#8B5CF6]">₹87K</h3>
            <p className="text-[11px] text-muted-foreground mt-1">annual increase</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 px-4 py-3 bg-card border border-border rounded-2xl mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B87C] focus:border-[#00B87C] transition-all"
            />
          </div>

          {/* Year */}
          <div className="relative">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B87C] font-semibold"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
          </div>

          {/* Status */}
          <div className="relative">
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B87C] font-semibold"
            >
              <option value="All">Status: All</option>
              <option value="Approved">Approved</option>
              <option value="Pending Finance">Pending Finance</option>
              <option value="Manual Review">Manual Review</option>
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
          </div>

          {/* Band */}
          <div className="relative">
            <select 
              value={selectedBand} 
              onChange={(e) => setSelectedBand(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B87C] font-semibold"
            >
              <option value="All">Band: All</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
          </div>

          {/* Reset Filters */}
          <button 
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            <RefreshCw size={12} />
            Reset
          </button>
        </div>

        {/* Right side: Export button */}
        <button className="px-4 py-2 bg-[#00B87C] hover:bg-[#00a36c] text-white text-sm font-bold rounded-xl shadow-md shadow-[#00B87C]/15 transition-all flex items-center justify-center gap-2">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Team Appraisal Table Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table Title Block */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/5">
          <div>
            <h2 className="text-base font-bold text-foreground">Team Increment Appraisal</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">12 team members · Click row for details · Manager ratings editable</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span>Page 1 of 2</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <button className="hover:text-foreground">Filter Options</button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</th>
                <th className="px-3 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Leaves</th>
                <th className="px-3 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Late</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Perf Score</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">KPI</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Mgr Rating</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Increment %</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Current Salary</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Revised Salary</th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => {
                const lowAtt = m.attendancePct < 85;
                
                return (
                  <tr 
                    key={m.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                    style={{
                      borderLeft: lowAtt ? "3px solid #F59E0B" : "none",
                      backgroundColor: lowAtt ? "rgba(245, 158, 11, 0.03)" : "transparent",
                    }}
                  >
                    {/* Employee Profile */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                          style={{ backgroundColor: m.avatarBg, color: m.status === "Approved" ? "#059669" : "#4B5563" }}
                        >
                          {m.initials}
                        </div>
                        <div className="leading-tight">
                          <p className="text-[14px] font-bold text-foreground">{m.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{m.designation}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 text-xs font-bold text-foreground/80">{m.department}</td>

                    {/* Attendance */}
                    <td className="px-4 py-4">
                      <span 
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap`}
                        style={{
                          backgroundColor: m.attendancePct >= 90 ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                          color: m.attendancePct >= 90 ? "#10B981" : "#F59E0B",
                        }}
                      >
                        {m.attendancePct}%
                      </span>
                    </td>

                    {/* Leaves */}
                    <td className="px-3 py-4 text-xs font-bold text-foreground/80">{m.leaveDays}d</td>

                    {/* Late Marks */}
                    <td className="px-3 py-4 text-xs font-bold text-foreground/80">{m.lateMarks}</td>

                    {/* Performance Score */}
                    <td className="px-4 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#00B87C] h-full rounded-full" 
                            style={{ width: `${m.performanceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-foreground">{m.performanceScore}%</span>
                      </div>
                    </td>

                    {/* KPI */}
                    <td className="px-4 py-4 text-xs font-bold text-foreground/80">{m.kpiScore}%</td>

                    {/* Manager Rating */}
                    <td className="px-4 py-4 text-center">
                      {m.id === "emp-3" ? (
                        /* Editable Rating Input Button */
                        <button 
                          onClick={() => openRatingModal(m.id)}
                          className="px-3 py-1 bg-muted/60 border border-border rounded-lg text-xs font-bold text-[#F59E0B] hover:bg-muted transition-all inline-flex items-center gap-1.5"
                        >
                          <Star size={13} fill="#F59E0B" className="text-[#F59E0B]" />
                          <span>{m.managerRating}</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-foreground/80">
                          <Star size={13} fill="#F59E0B" className="text-[#F59E0B]" />
                          <span>{m.managerRating}</span>
                        </div>
                      )}
                    </td>

                    {/* Increment Recommendation */}
                    <td className="px-4 py-4 text-center">
                      {typeof m.recommendedIncrement === "number" ? (
                        <span className="text-xs font-bold text-[#10B981]">
                          +{m.recommendedIncrement}%
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-red-500/10 text-red-500 rounded-md uppercase tracking-wider">
                          {m.recommendedIncrement}
                        </span>
                      )}
                    </td>

                    {/* Current Salary */}
                    <td className="px-4 py-4 text-right text-xs font-bold text-foreground/75">
                      ₹{Math.round(m.currentSalary).toLocaleString()}
                    </td>

                    {/* Revised Salary */}
                    <td className="px-4 py-4 text-right text-xs font-bold text-[#10B981]">
                      ₹{Math.round(m.revisedSalary).toLocaleString()}
                    </td>

                    {/* Status Chip */}
                    <td className="px-4 py-4 text-center">
                      <span 
                        className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: m.status === "Approved" 
                            ? "rgba(16, 185, 129, 0.1)" 
                            : m.status === "Pending Finance" 
                              ? "rgba(245, 158, 11, 0.1)" 
                              : "rgba(239, 68, 68, 0.1)",
                          color: m.status === "Approved" 
                            ? "#10B981" 
                            : m.status === "Pending Finance" 
                              ? "#F59E0B" 
                              : "#EF4444",
                        }}
                      >
                        {m.status === "Approved" 
                          ? "✓ Approved" 
                          : m.status === "Pending Finance" 
                            ? "⏳ Pending Finance" 
                            : "⚠ Manual Review"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {m.status === "Manual Review" ? (
                          <button 
                            onClick={() => alert(`A justification report is required for ${m.name} due to attendance (${m.attendancePct}%). Complete this form to submit justification to Finance.`)}
                            className="px-2.5 py-1 border border-red-500/30 text-red-500 text-[11px] font-bold rounded-lg hover:bg-red-500/5 transition-colors"
                          >
                            Justify →
                          </button>
                        ) : (
                          <button 
                            onClick={() => setSelectedMemberId(m.id)}
                            className="px-2.5 py-1 border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <span>{m.status === "Approved" ? "₹ Payroll" : "View"}</span>
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANAGER RATING MODAL (Star Selector Modal) */}
      {ratingModalOpen && ratingTargetId && (() => {
        const targetMember = members.find(m => m.id === ratingTargetId);
        if (!targetMember) return null;

        return (
          <>
            {/* Modal Overlay */}
            <div 
              onClick={() => setRatingModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-[3000] backdrop-blur-xs transition-opacity"
            />
            {/* Modal Box */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[90vw] bg-card border border-border rounded-2xl p-6 shadow-2xl z-[3001] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold tracking-tight text-foreground">Update Manager Rating</h3>
                <button onClick={() => setRatingModalOpen(false)} className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Employee Quick Info card */}
              <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-xl mb-5">
                <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-sm shrink-0">
                  {targetMember.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{targetMember.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{targetMember.designation} · <span className="text-[#00B87C] font-semibold">{targetMember.department}</span></p>
                </div>
              </div>

              {/* Star Rating Section */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Manager Performance Rating
                </label>
                <div className="flex flex-col items-center py-4 bg-muted/10 border border-border/80 rounded-xl">
                  {/* Large interactive Stars */}
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const filled = starVal <= tempRating;
                      return (
                        <button 
                          key={starVal}
                          onClick={() => setTempRating(starVal)}
                          className="p-1 hover:scale-110 active:scale-95 transition-all text-[#F59E0B]"
                        >
                          <Star size={32} fill={filled ? "#F59E0B" : "none"} strokeWidth={2} />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {tempRating.toFixed(1)} — {getRatingLabel(tempRating)}
                  </span>
                </div>
              </div>

              {/* Rating Justification Textarea */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Rating Justification <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea 
                  required
                  placeholder="Provide reasoning for this rating score..."
                  value={tempJustification}
                  onChange={(e) => setTempJustification(e.target.value)}
                  className="w-full min-h-[80px] p-3 text-sm bg-muted/20 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B87C] transition-all resize-none"
                />
              </div>

              {/* Rating Guide List */}
              <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-[11px] text-muted-foreground leading-relaxed mb-5">
                <div className="font-bold text-foreground uppercase tracking-wider mb-1">Appraisal Rating Scale Guide:</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div>⭐5 Exceptional / Outstanding</div>
                  <div>⭐4 Exceeds Expectations</div>
                  <div>⭐3 Meets Expectations</div>
                  <div>⭐2 Below Expectations</div>
                  <div>⭐1 Unsatisfactory</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setRatingModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveRating}
                  disabled={!tempJustification.trim()}
                  className="px-5 py-2.5 bg-[#00B87C] hover:bg-[#00a36c] disabled:opacity-40 disabled:hover:bg-[#00B87C] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Update Rating
                </button>
              </div>

              {/* Notification note badge */}
              <div className="mt-4 p-2.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl flex items-center gap-2 text-[11px] text-[#15803D] font-bold">
                <Info size={12} className="shrink-0" />
                <span>Note: Rating change sends notification to Finance for appraisal processing.</span>
              </div>
            </div>
          </>
        );
      })()}

      {/* APPRAISAL DETAIL PANEL (Slide-in Right Panel) */}
      {selectedMemberId && selectedMember && (
        <>
          {/* Panel Overlay */}
          <div 
            onClick={() => setSelectedMemberId(null)}
            className="fixed inset-0 bg-black/25 z-[2000] backdrop-blur-xs transition-opacity"
          />
          {/* Slide-in Container */}
          <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-card border-l border-border shadow-2xl z-[2001] p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Appraisal Details</h3>
                <button onClick={() => setSelectedMemberId(null)} className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Employee Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0"
                  style={{ backgroundColor: selectedMember.avatarBg, color: "#4B5563" }}
                >
                  {selectedMember.initials}
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">{selectedMember.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedMember.designation}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-muted/65 text-[#00B87C] text-[11px] font-bold rounded-md">
                    {selectedMember.department}
                  </span>
                </div>
              </div>

              {/* 4 Mini stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-muted/10 border border-border p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-muted-foreground block uppercase">Attendance</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{selectedMember.attendancePct}%</span>
                </div>
                <div className="bg-muted/10 border border-border p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-muted-foreground block uppercase">Performance Score</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{selectedMember.performanceScore}%</span>
                </div>
                <div className="bg-muted/10 border border-border p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-muted-foreground block uppercase">Manager Rating</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{selectedMember.managerRating.toFixed(1)}★</span>
                </div>
                <div className="bg-muted/10 border border-border p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-muted-foreground block uppercase">Increment Recommendation</span>
                  <span className="text-sm font-bold text-[#10B981] mt-1 block">
                    {typeof selectedMember.recommendedIncrement === "number" ? `+${selectedMember.recommendedIncrement}%` : selectedMember.recommendedIncrement}
                  </span>
                </div>
              </div>

              {/* Vertical Timeline Approval Journey */}
              <div className="mb-6">
                <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Approval Journey</h5>
                <div className="space-y-4 relative pl-5 border-l-2 border-border/60 ml-2">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[#10B981] flex items-center justify-center border border-white">
                      <Check size={8} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Manager Review</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Rating {selectedMember.managerRating} submitted by Suresh Iyer</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[#10B981] flex items-center justify-center border border-white">
                      <Check size={8} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">HR Verification</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Eligibility confirmed and verified</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div 
                      className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white"
                      style={{ backgroundColor: selectedMember.status === "Approved" ? "#10B981" : "#14B8A6" }}
                    >
                      {selectedMember.status === "Approved" ? (
                        <Check size={8} className="text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Finance Approval</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {selectedMember.status === "Approved" ? "Approved by Ananya Das" : "Under review (Ananya Das)"}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-border flex items-center justify-center border border-white">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Payroll Processing</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Pending final processing by Finance</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-border flex items-center justify-center border border-white">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Increment Effective</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Scheduled for May 1, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown Block */}
              <div className="bg-muted/10 border border-border/80 rounded-xl p-4 mb-6">
                <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Salary Breakdown</h5>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Monthly Base:</span>
                    <span className="font-bold text-foreground">₹{Math.round(selectedMember.currentSalary).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Increment Rate:</span>
                    <span className="font-bold text-[#10B981]">
                      {typeof selectedMember.recommendedIncrement === "number" ? `+${selectedMember.recommendedIncrement}%` : "Manual Review"}
                    </span>
                  </div>
                  <div className="w-full h-px bg-border my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-foreground">Revised Monthly Salary:</span>
                    <span className="text-[#10B981]">₹{Math.round(selectedMember.revisedSalary).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>Annual Increase Impact:</span>
                    <span className="font-semibold text-foreground">
                      ₹{Math.round((selectedMember.revisedSalary - selectedMember.currentSalary) * 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Summary block */}
              <div className="bg-muted/10 border border-border/80 rounded-xl p-4">
                <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Performance &amp; Goals</h5>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Goals Completed:</span>
                      <span className="font-bold text-foreground">{selectedMember.goalsMet} / {selectedMember.goalsTotal}</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00B87C] h-full rounded-full" style={{ width: `${(selectedMember.goalsMet / selectedMember.goalsTotal) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">KPI Score Achievement:</span>
                      <span className="font-bold text-foreground">{selectedMember.kpiScore}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#14B8A6] h-full rounded-full" style={{ width: `${selectedMember.kpiScore}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Peer Rating Score:</span>
                    <span className="font-bold text-foreground">{selectedMember.peerRating} / 5.0</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-border mt-6">
              <button 
                onClick={() => setSelectedMemberId(null)}
                className="w-full py-2.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl transition-all"
              >
                Close Details Panel
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
