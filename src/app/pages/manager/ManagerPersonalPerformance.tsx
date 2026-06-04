import { useState } from "react";
import { 
  TrendingUp, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Clock, 
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { showToast } from "../../components/workflow/ToastNotification";

type PerformanceTab = "My Goals" | "Self Review" | "Feedback" | "History";

const radarData = [
  { subject: 'Leadership', self: 95, manager: 90, peers: 92, fullMark: 150 },
  { subject: 'Technical Arch', self: 90, manager: 95, peers: 88, fullMark: 150 },
  { subject: 'Delivery Management', self: 85, manager: 80, peers: 85, fullMark: 150 },
  { subject: 'Communication', self: 80, manager: 85, peers: 88, fullMark: 150 },
  { subject: 'Team Mentoring', self: 95, manager: 92, peers: 95, fullMark: 150 },
  { subject: 'Initiative', self: 90, manager: 90, peers: 88, fullMark: 150 },
];

export function ManagerPersonalPerformance() {
  const [activeTab, setActiveTab] = useState<PerformanceTab>("My Goals");

  const handleSubmitSelfReview = () => {
    showToast("Submitted!", "success", "Your self assessment has been successfully submitted to your manager.");
    setActiveTab("My Goals");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-500 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-[#00B87C]">
            <TrendingUp size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight mb-1">My Performance</h1>
            <p className="text-[13px] text-[#6B7280]">Track your professional development, goals and appraisal status</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <Clock size={14} className="text-amber-600" />
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Self-review due: April 25</span>
          </div>
          <button 
            onClick={() => setActiveTab("Self Review")}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-bold text-[12px] uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
          >
            Start Self-Review
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="CURRENT RATING" value="4.6" suffix="★" color="amber" />
        <KPICard label="GOALS MET" value="8/10" suffix="" color="green" />
        <KPICard label="REVIEW STATUS" value="Open" suffix="" color="teal" />
        <KPICard label="MY BAND" value="A+" suffix="" color="purple" />
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-8 border-b border-border overflow-x-auto no-scrollbar">
        {(["My Goals", "Self Review", "Feedback", "History"] as PerformanceTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[12px] font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
              activeTab === tab ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabPerf"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C]"
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "My Goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SectionTitle title="FY 2025-26 GOALS" />
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-[#00B87C] uppercase tracking-wider">5 goals</span>
                </div>
                <button 
                  onClick={() => showToast("Info", "info", "Goal requests are sent to HR.")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#00B87C] text-[#00B87C] font-bold text-[11px] uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all"
                >
                  <Plus size={14} /> Request Add Goal
                </button>
              </div>

              <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
                <GoalRow title="Lead Architecture Review" category="Technical" progress={80} status="On track" />
                <GoalRow title="Grow Team to 15 Members" category="Leadership" progress={60} status="On track" />
                <GoalRow title="PMP Certification" category="Strategy" progress={100} status="Completed" isComplete />
                <GoalRow title="Improve Team Sprint Velocity" category="Strategy" progress={95} status="Completed" isComplete />
                <GoalRow title="Establish DevOps CI/CD Best Practices" category="Technical" progress={25} status="At risk" />
              </div>
            </motion.div>
          )}

          {activeTab === "Self Review" && (
            <motion.div
              key="self-review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 animate-in fade-in"
            >
              <SectionTitle title="SELF ASSESSMENT — FY 2025-26" />
              <div className="space-y-8">
                <RatingSection label="Leadership & Ownership" />
                <RatingSection label="Technical Architecture & Excellence" />
                <RatingSection label="Delivery & Project Management" />
                <RatingSection label="Communication & Influence" />
                <RatingSection label="Team Mentorship & Growth" />
                <RatingSection label="Initiative & Innovation" />
                
                <button 
                  onClick={handleSubmitSelfReview}
                  className="w-full py-4 rounded-2xl bg-[#00B87C] text-white font-bold text-[14px] uppercase tracking-[2px] hover:opacity-90 transition-all shadow-xl shadow-emerald-500/20"
                >
                  Submit Self Review
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <SectionTitle title="360° FEEDBACK SUMMARY" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-[32px] p-8 h-[420px] shadow-sm flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="Self" dataKey="self" stroke="#00B87C" fill="#00B87C" fillOpacity={0.3} />
                      <Radar name="Manager" dataKey="manager" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Radar name="Peers" dataKey="peers" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <FeedbackCard 
                    role="Manager" 
                    name="Rajan Kumar" 
                    comment="Suresh has demonstrated incredible leadership this year, especially during the core EMS project migration. His focus on team velocity and architecture standard holds the entire unit together."
                    date="3 days ago"
                  />
                  <FeedbackCard 
                    role="Peer" 
                    name="Anonymous Colleague" 
                    comment="Incredible architect and mentor. Always makes time to resolve architecture bottlenecks for frontend teams. Delivery excellence at its best."
                    date="1 week ago"
                  />
                  <FeedbackCard 
                    role="Peer" 
                    name="Anonymous Colleague" 
                    comment="Suresh's delivery management is stellar. He would do even better by pushing for more cross-department standardization."
                    date="2 weeks ago"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "History" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Review Period</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Band</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Reviewer</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <HistoryRow period="FY 24-25" rating="4.5" band="A" reviewer="Rajan Kumar" date="Apr 2025" />
                  <HistoryRow period="FY 23-24" rating="4.3" band="A-" reviewer="Rajan Kumar" date="Apr 2024" />
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function KPICard({ label, value, suffix, color }: { label: string, value: string, suffix: string, color: 'amber' | 'green' | 'teal' | 'purple' }) {
  const colorMap = {
    amber: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    green: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    teal: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    purple: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-[#00B87C]/30 transition-all">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
      <div className="flex items-baseline gap-1">
        <h3 className={`text-2xl font-bold tracking-tight ${colorMap[color].split(' ')[0]}`}>{value}</h3>
        <span className="text-sm font-bold text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 rounded-full bg-[#00B87C]" />
      <h3 className="text-[13px] font-bold text-foreground uppercase tracking-[1.5px]">{title}</h3>
    </div>
  );
}

function GoalRow({ title, category, progress, status, isComplete }: { title: string, category: string, progress: number, status: string, isComplete?: boolean }) {
  const statusColor = status === "On track" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : 
                      status === "Completed" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-rose-600 bg-rose-500/10 border-rose-500/20";
  
  return (
    <div className="flex items-center justify-between p-6 h-[72px] hover:bg-[#00B87C]/[0.08] dark:hover:bg-emerald-500/5 transition-all group border-b border-border last:border-0 cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isComplete ? 'bg-[#00B87C] border-[#00B87C]' : 'border-border group-hover:border-[#00B87C]'}`}>
          {isComplete && <CheckCircle2 size={14} className="text-white" />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-foreground leading-none">{title}</span>
            <span className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{category}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8 w-[300px]">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#00B87C] rounded-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-[120px] justify-end">
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-wider ${statusColor}`}>
            {status} {status === "Completed" && "✅"} {status === "At risk" && "⚠"}
          </span>
          <ChevronRight size={16} className="text-muted-foreground group-hover:text-[#00B87C] transition-all" />
        </div>
      </div>
    </div>
  );
}

function RatingSection({ label }: { label: string }) {
  const [rating, setRating] = useState(0);
  return (
    <div className="space-y-4 bg-secondary/35 border border-border p-6 rounded-2xl">
      <p className="text-[15px] font-bold text-foreground">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
              rating === num 
                ? "bg-[#00B87C] text-white shadow-lg shadow-emerald-500/20 scale-110" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <textarea 
        placeholder={`Add details for ${label.toLowerCase()}...`}
        className="w-full h-24 p-4 rounded-xl bg-card border border-border outline-none focus:border-[#00B87C] transition-all text-sm font-medium resize-none"
      />
    </div>
  );
}

function FeedbackCard({ role, name, comment, date }: { role: string, name: string, comment: string, date: string }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-[#00B87C]/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${role === 'Manager' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600'}`}>
            {role[0]}
          </div>
          <div>
            <p className="text-[13px] font-bold text-foreground">{name}</p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{role}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">{date}</span>
      </div>
      <p className="text-[13px] font-medium text-foreground leading-relaxed italic">"{comment}"</p>
    </div>
  );
}

function HistoryRow({ period, rating, band, reviewer, date }: { period: string, rating: string, band: string, reviewer: string, date: string }) {
  return (
    <tr className="group hover:bg-[#00B87C]/[0.08]/30 dark:hover:bg-emerald-500/5 transition-all cursor-pointer">
      <td className="px-8 py-5 text-[14px] font-bold text-foreground">{period}</td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 w-fit">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-bold">{rating}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 text-xs font-bold uppercase">{band}</span>
      </td>
      <td className="px-8 py-5 text-[13px] font-bold text-muted-foreground">{reviewer}</td>
      <td className="px-8 py-5 text-[13px] font-bold text-muted-foreground">{date}</td>
      <td className="px-8 py-5 text-right">
        <button 
          onClick={() => showToast("Success", "success", "Appraisal history report downloaded.")}
          className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider hover:underline"
        >
          View
        </button>
      </td>
    </tr>
  );
}
