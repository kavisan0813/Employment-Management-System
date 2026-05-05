import { useState } from "react";
import { useLocation } from "react-router";
import {
  Target,
  Clock,
  Award,
  Plus,
  X,
  MessageSquare,
  TrendingUp,
  Download,
  Info,
  ChevronRight,
  Star
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
type GoalStatus = "Not Started" | "In Progress" | "Completed" | "Overdue";
type GoalPriority = "High" | "Medium" | "Low";
type GoalCategory = "Technical" | "Soft Skills" | "Leadership" | "Operational";

interface Goal {
  id: number;
  title: string;
  category: GoalCategory;
  progress: number;
  targetDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  description: string;
  targetMetric: string;
  managerComments: string;
}

interface PerformanceReview {
  id: number;
  period: string;
  overallScore: number;
  rating: string;
  attendanceScore: number;
  goalCompletion: number;
  kpiScore: number;
  recommendation: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const MOCK_GOALS: Goal[] = [
  { 
    id: 1, title: "Complete React Advanced Training", category: "Technical", progress: 85, targetDate: "May 20, 2026", priority: "High", status: "In Progress",
    description: "Deep dive into React performance optimization, custom hooks, and server components.",
    targetMetric: "Certification completion & demo project",
    managerComments: "Great progress, ensure you apply the learnings to the new dashboard."
  },
  { 
    id: 2, title: "Maintain attendance above 95%", category: "Operational", progress: 98, targetDate: "Dec 31, 2026", priority: "Medium", status: "In Progress",
    description: "Ensure consistent punctuality and minimal unplanned leaves throughout the year.",
    targetMetric: "Attendance records from EMS",
    managerComments: "Consistency is key. Keep up the good work."
  },
  { 
    id: 3, title: "Complete 5 project tasks", category: "Operational", progress: 100, targetDate: "Apr 30, 2026", priority: "High", status: "Completed",
    description: "Deliver assigned features for the NexusHR mobile app integration.",
    targetMetric: "Jira task completion",
    managerComments: "Excellent delivery, ahead of schedule."
  },
  { 
    id: 4, title: "Improve client response time", category: "Soft Skills", progress: 40, targetDate: "Jun 15, 2026", priority: "High", status: "In Progress",
    description: "Reduce average ticket response time from 4 hours to 1 hour.",
    targetMetric: "CRM response analytics",
    managerComments: "Focus on early morning ticket triaging."
  },
];

const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 1, period: "Annual Review 2025-26", overallScore: 4.5, rating: "Exceeds Expectations",
    attendanceScore: 96, goalCompletion: 90, kpiScore: 92, recommendation: "Salary Increment",
    status: "Approved", date: "Mar 28, 2026",
    strengths: ["Technical Proficiency", "Problem Solving", "Team Collaboration"],
    improvements: ["Time Management for minor tasks", "Public speaking"],
    feedback: "Exceptional contribution to the React migration project. One of the top performers in the engineering team."
  },
  {
    id: 2, period: "Mid-Year Review 2025", overallScore: 4.2, rating: "Meets Expectations",
    attendanceScore: 94, goalCompletion: 85, kpiScore: 88, recommendation: "N/A",
    status: "Approved", date: "Sep 15, 2025",
    strengths: ["Reliability", "Coding Standards"],
    improvements: ["Requirement gathering"],
    feedback: "Solid performance, meeting all key targets."
  }
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    "Completed": "bg-emerald-500/10 text-primary border-primary/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Overdue": "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "Not Started": "bg-secondary text-muted-foreground border-border dark:bg-zinc-800",
    "Approved": "bg-emerald-500/10 text-primary border-primary/20",
    "Pending": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Rejected": "bg-rose-500/10 text-rose-500 border-rose-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${cfg[status] || cfg["Not Started"]}`}>
      {status}
    </span>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
  value: string | number;
  subValue: string;
  chip?: string;
  chipColor?: 'green' | 'amber' | 'purple' | 'teal';
}

function SummaryCard({ icon: Icon, color, bg, label, value, subValue, chip, chipColor }: SummaryCardProps) {
  return (
    <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center justify-between">
           <p className="text-2xl font-black text-foreground leading-none">{value}</p>
           {chip && (
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
               chipColor === 'green' ? 'bg-emerald-500/10 text-primary border-primary/20' :
               chipColor === 'amber' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
               chipColor === 'purple' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
               'bg-teal-500/10 text-teal-600 border-teal-500/20'
             }`}>
               {chip}
             </span>
           )}
        </div>
        <p className="text-[12px] font-bold text-muted-foreground mt-1">{subValue}</p>
      </div>
    </div>
  );
}

function ModalLayout({ title, icon: Icon, onClose, children }: { title: string, icon: React.ElementType, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[520px] rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
            <h3 className="text-[18px] font-black text-foreground">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeePerformance() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'My Goals' | 'My Performance'>(
    location.pathname === '/goals' ? 'My Goals' : 'My Performance'
  );
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Form States (Mock)
  const [feedbackManager, setFeedbackManager] = useState("");
  const [feedbackTopic, setFeedbackTopic] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleDownloadReport = () => {
    showToast("Report Downloaded", "success", "Your performance report is ready and downloaded.");
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Feedback Requested", "success", "Your request has been sent to the manager.");
    setShowFeedback(false);
    setFeedbackManager("");
    setFeedbackTopic("");
    setFeedbackMessage("");
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-20">
      
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-purple-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Target size={22} className="text-purple-500" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            {activeTab === 'My Goals' ? 'My Goals & Objectives' : 'My Performance Review'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-5 py-3 bg-secondary text-foreground border border-border rounded-2xl font-black hover:bg-secondary/80 transition-all text-[13px]"
          >
            <Download size={18} /> Download Report
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black hover:bg-primary/20 transition-all text-[13px]"
          >
            <MessageSquare size={18} /> Request Feedback
          </button>
        </div>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-8 border-b border-border mt-4">
        {(['My Goals', 'My Performance'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-[14px] font-black relative transition-all ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(16,185,129,0.3)]" />}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─────────────────────────────────────────── */}
      <div className="space-y-8">
        {activeTab === 'My Goals' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">FY 2025-26 GOALS</h3>
                   <span className="text-[12px] font-bold text-muted-foreground">{MOCK_GOALS.length} goals</span>
                </div>
                <button 
                  onClick={() => setShowAddGoal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-primary rounded-xl text-[12px] font-black hover:bg-emerald-500/20 transition-all"
                >
                   <Plus size={16} /> Propose New Goal
                </button>
             </div>
             
             <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                   {MOCK_GOALS.map(goal => (
                     <div 
                       key={goal.id} 
                       onClick={() => setSelectedGoal(goal)}
                       className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group"
                     >
                       <div className="flex items-center gap-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                             goal.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                             goal.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                             'bg-emerald-500/10 text-primary'
                          }`}>
                             <Target size={20} />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">{goal.title}</h4>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{goal.category}</span>
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                   <Clock size={10} /> {goal.targetDate}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-10">
                          <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                             <div className="flex items-center justify-between w-full text-[11px] font-black">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-primary">{goal.progress}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <StatusBadge status={goal.status} />
                             <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'My Performance' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Summary Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div onClick={() => setSelectedReview(MOCK_REVIEWS[0])} className="cursor-pointer">
                  <SummaryCard 
                    icon={Star} color="text-amber-500" bg="bg-amber-500/10" label="OVERALL SCORE" 
                    value="4.5" subValue="FY 2025-26" chip="Excellent" chipColor="green" 
                  />
                </div>
                <div onClick={() => setSelectedReview(MOCK_REVIEWS[0])} className="cursor-pointer">
                  <SummaryCard 
                    icon={Clock} color="text-blue-500" bg="bg-blue-500/10" label="ATTENDANCE SCORE" 
                    value="96%" subValue="Last 12 Months" chip="On Track" chipColor="green" 
                  />
                </div>
                <div onClick={() => setSelectedReview(MOCK_REVIEWS[0])} className="cursor-pointer">
                  <SummaryCard 
                    icon={Target} color="text-primary" bg="bg-emerald-500/10" label="GOAL COMPLETION" 
                    value="90%" subValue="8/10 Completed" chip="High" chipColor="green" 
                  />
                </div>
                <div onClick={() => setSelectedReview(MOCK_REVIEWS[0])} className="cursor-pointer">
                  <SummaryCard 
                    icon={Award} color="text-purple-500" bg="bg-purple-500/10" label="MANAGER RATING" 
                    value="A" subValue="Top Performer" chip="Elite" chipColor="purple" 
                  />
                </div>
             </div>

             {/* Review History Table */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">PERFORMANCE REVIEW HISTORY</h3>
                   <span className="text-[12px] font-bold text-muted-foreground">Review Period: Apr 2025 - Mar 2026</span>
                </div>
                <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-x-auto">
                   <table className="w-full text-left min-w-[800px]">
                     <thead>
                       <tr className="bg-secondary">
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Review Period</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rating</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recommendation</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {MOCK_REVIEWS.map(review => (
                         <tr key={review.id} className="hover:bg-secondary transition-colors cursor-pointer group" onClick={() => setSelectedReview(review)}>
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors">{review.period}</span>
                                 <span className="text-[11px] font-bold text-muted-foreground">{review.date}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[15px] font-black text-primary">{review.overallScore}</span>
                              <span className="text-[11px] font-bold text-muted-foreground ml-1">/ 5.0</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[13px] font-bold text-foreground">{review.rating}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[12px] font-bold text-muted-foreground">{review.recommendation}</span>
                           </td>
                           <td className="px-6 py-4">
                              <StatusBadge status={review.status} />
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-primary text-[12px] font-black hover:underline flex items-center gap-1 justify-end ml-auto">
                                 View Review <ChevronRight size={14} />
                              </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>

             {/* KPI & Metric Breakdown */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
                   <h3 className="text-[14px] font-black text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary" /> Key Performance Indicators
                   </h3>
                   <div className="space-y-4">
                      {[
                         { label: "Code Quality", val: 92 },
                         { label: "Documentation", val: 85 },
                         { label: "Team Collaboration", val: 95 },
                         { label: "Timely Delivery", val: 88 }
                      ].map(kpi => (
                         <div key={kpi.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[12px] font-bold">
                               <span className="text-muted-foreground">{kpi.label}</span>
                               <span className="text-foreground">{kpi.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                               <div className="h-full bg-primary" style={{ width: `${kpi.val}%` }} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
                   <h3 className="text-[14px] font-black text-foreground mb-4 flex items-center gap-2">
                      <Star size={18} className="text-amber-500" /> Recent Feedback
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                         <p className="text-[12px] font-bold text-foreground leading-relaxed italic mb-2">
                            "Excellent work on the React migration. Your attention to performance details was outstanding."
                         </p>
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">MW</div>
                            <span className="text-[11px] font-black text-muted-foreground">Marcus Williams, Manager</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setShowFeedback(true)}
                        className="w-full py-3 border border-dashed border-border rounded-xl text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all"
                      >
                         + Request More Feedback
                      </button>
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */
      /* MODALS                                                          */
      /* ─────────────────────────────────────────────────────────────── */}

      {/* 1. Goal Detail Modal */}
      {selectedGoal && (
        <ModalLayout title="Goal Detail" icon={Target} onClose={() => setSelectedGoal(null)}>
          <div className="space-y-6">
            <div>
               <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Goal Description</h4>
               <p className="text-[13px] font-bold text-foreground leading-relaxed">{selectedGoal.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Target Metric</h4>
                  <p className="text-[13px] font-black text-primary">{selectedGoal.targetMetric}</p>
               </div>
               <div>
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Due Date</h4>
                  <p className="text-[13px] font-black text-foreground">{selectedGoal.targetDate}</p>
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Current Progress</h4>
                  <span className="text-[13px] font-black text-primary">{selectedGoal.progress}%</span>
               </div>
               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${selectedGoal.progress}%` }} />
               </div>
            </div>

            <div className="bg-secondary p-4 rounded-2xl border border-border">
               <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} /> Manager Comments
               </h4>
               <p className="text-[12px] font-bold text-muted-foreground italic">"{selectedGoal.managerComments}"</p>
            </div>

            <div className="flex items-center gap-3 pt-4">
               <button onClick={() => setSelectedGoal(null)} className="flex-1 py-3 px-4 rounded-xl border border-border text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all">Close</button>
               <button onClick={() => showToast("Progress Updated", "success", "Progress has been recorded.")} className="flex-[2] py-3 px-4 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all">Update Progress</button>
            </div>
          </div>
        </ModalLayout>
      )}

      {/* 2. Add Goal Modal */}
      {showAddGoal && (
        <ModalLayout title="Add New Goal" icon={Plus} onClose={() => setShowAddGoal(false)}>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); showToast("Goal Proposed", "success", "Your goal request has been submitted."); setShowAddGoal(false); }}>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Goal Title</label>
               <input type="text" placeholder="Enter goal name..." className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</label>
                  <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none appearance-none">
                     <option>Technical</option>
                     <option>Operational</option>
                     <option>Soft Skills</option>
                     <option>Leadership</option>
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Due Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none" required />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Value / Metric</label>
               <input type="text" placeholder="e.g. 100% completion, 5 tasks" className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none" required />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</label>
               <textarea rows={3} placeholder="Brief details about the goal..." className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none" required />
            </div>
            <button type="submit" className="w-full py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all mt-2">
               Submit Goal Request
            </button>
          </form>
        </ModalLayout>
      )}

      {/* 3. Performance Review Detail Modal */}
      {selectedReview && (
        <ModalLayout title="Performance Review Detail" icon={Award} onClose={() => setSelectedReview(null)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-secondary p-4 rounded-2xl border border-border">
               <div>
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Review Period</h4>
                  <p className="text-[15px] font-black text-foreground">{selectedReview.period}</p>
               </div>
               <div className="text-right">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Overall Score</h4>
                  <p className="text-[20px] font-black text-primary">{selectedReview.overallScore}<span className="text-[12px] text-muted-foreground">/5.0</span></p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               {[
                  { label: "Attendance", val: `${selectedReview.attendanceScore}%` },
                  { label: "Goal Comp.", val: `${selectedReview.goalCompletion}%` },
                  { label: "KPI Score", val: selectedReview.kpiScore }
               ].map(s => (
                  <div key={s.label} className="p-3 bg-card border border-border rounded-xl text-center">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                     <p className="text-[14px] font-black text-foreground">{s.val}</p>
                  </div>
               ))}
            </div>

            <div className="space-y-4">
               <div>
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Key Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                     {selectedReview.strengths.map(s => (
                        <span key={s} className="px-3 py-1 bg-emerald-500/10 rounded-lg text-[11px] font-bold text-primary border border-primary/20">{s}</span>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-2">Areas for Improvement</h4>
                  <div className="flex flex-wrap gap-2">
                     {selectedReview.improvements.map(s => (
                        <span key={s} className="px-3 py-1 bg-rose-500/10 rounded-lg text-[11px] font-bold text-rose-500 border border-rose-500/20">{s}</span>
                     ))}
                  </div>
               </div>
            </div>

            <div>
               <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Manager Feedback</h4>
               <p className="text-[13px] font-bold text-foreground leading-relaxed italic">"{selectedReview.feedback}"</p>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-between">
               <div>
                  <h4 className="text-[11px] font-black text-purple-600 uppercase tracking-widest">Recommendation</h4>
                  <p className="text-[13px] font-black text-purple-600">{selectedReview.recommendation}</p>
               </div>
               <div className="text-right">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Final Rating</h4>
                  <p className="text-[13px] font-black text-foreground">{selectedReview.rating}</p>
               </div>
            </div>
          </div>
        </ModalLayout>
      )}

      {/* 4. Request Feedback Modal */}
      {showFeedback && (
        <ModalLayout title="Request Feedback" icon={MessageSquare} onClose={() => setShowFeedback(false)}>
          <form onSubmit={handleSendFeedback} className="space-y-5">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select Manager / Colleague</label>
               <select 
                value={feedbackManager}
                onChange={(e) => setFeedbackManager(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
                required
               >
                  <option value="">Select a person...</option>
                  <option>Marcus Williams (Manager)</option>
                  <option>Sarah Johnson (Team Lead)</option>
                  <option>Robert Chen (Peer)</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Feedback Topic</label>
               <input 
                type="text" 
                value={feedbackTopic}
                onChange={(e) => setFeedbackTopic(e.target.value)}
                placeholder="e.g. Project Delivery, Collaboration" 
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all" 
                required
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Message</label>
               <textarea 
                rows={4} 
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Briefly explain what aspects you'd like feedback on..." 
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none" 
                required
               />
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-primary/20 flex items-center gap-3">
               <Info size={16} className="text-primary" />
               <p className="text-[11px] font-black text-primary">You will receive a notification once they respond.</p>
            </div>
            <button type="submit" className="w-full py-4 rounded-xl bg-primary text-white text-[14px] font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all mt-2">
               Send Feedback Request
            </button>
          </form>
        </ModalLayout>
      )}

    </div>
  );
}
