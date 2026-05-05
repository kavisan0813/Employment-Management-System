import { BookOpen, CheckCircle2, Award, ArrowRight, Clock, AlertCircle, Book, Download, Plus } from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
interface Course {
  id: number;
  title: string;
  category: "Technical" | "Compliance" | "Soft Skills";
  provider: "Internal" | "LinkedIn Learning";
  progress: number;
  timeLeft: string;
  gradient: string;
}

interface Certification {
  id: number;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expiring Soon" | "Expired";
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const CONTINUE_LEARNING_COURSES: Course[] = [
  { 
    id: 1, title: "Advanced React Architecture", category: "Technical", provider: "Internal", 
    progress: 65, timeLeft: "2h 30m", gradient: "from-emerald-400 to-teal-600" 
  },
  { 
    id: 2, title: "Data Privacy & GDPR", category: "Compliance", provider: "Internal", 
    progress: 30, timeLeft: "1h 15m", gradient: "from-blue-400 to-indigo-600" 
  },
  { 
    id: 3, title: "Effective Communication", category: "Soft Skills", provider: "LinkedIn Learning", 
    progress: 45, timeLeft: "45m", gradient: "from-purple-400 to-fuchsia-600" 
  },
  { 
    id: 4, title: "Cloud Computing Fundamentals", category: "Technical", provider: "LinkedIn Learning", 
    progress: 10, timeLeft: "5h 20m", gradient: "from-emerald-400 to-teal-600" 
  },
];

const MANDATORY_TRAININGS = [
  { id: 1, title: "Cybersecurity Awareness 2026", deadline: "May 10, 2026", status: "Due Soon", urgency: "High", color: "amber" },
  { id: 2, title: "Code of Conduct & Ethics", deadline: "Apr 25, 2026", status: "Overdue", urgency: "Critical", color: "red" },
  { id: 3, title: "Workplace Safety Orientation", deadline: "Jun 15, 2026", status: "Completed", urgency: "Low", color: "green" },
];

const MY_CERTIFICATIONS: Certification[] = [
  { id: 1, name: "AWS Certified Solutions Architect", issuedBy: "Amazon Web Services", issueDate: "Nov 15, 2025", expiryDate: "Nov 15, 2028", status: "Active" },
  { id: 2, name: "Professional Scrum Master (PSM I)", issuedBy: "Scrum.org", issueDate: "Jan 20, 2026", expiryDate: "Never", status: "Active" },
  { id: 3, name: "Google Data Analytics Professional", issuedBy: "Google", issueDate: "Mar 10, 2025", expiryDate: "Mar 10, 2027", status: "Expiring Soon" },
];

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface StatsCardProps {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
  subValue: string;
  bg: string;
}

function StatsCard({ icon: Icon, color, label, value, subValue, bg }: StatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={24} className={color.startsWith('#') ? '' : color} style={color.startsWith('#') ? { color } : {}} />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-foreground leading-none mb-1">{value}</p>
        <p className="text-[12px] font-bold text-muted-foreground">{subValue}</p>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="w-[220px] h-[320px] bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col flex-shrink-0 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer group">
      {/* Header Gradient */}
      <div className={`h-[130px] bg-gradient-to-br ${course.gradient} p-4 relative flex flex-col justify-between`}>
        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-black tracking-wide uppercase self-start border border-white/20">
          {course.category}
        </span>
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center self-end border border-white/10">
          <Book size={18} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-[14px] font-black text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
            {course.title}
          </h4>
          <p className="text-[12px] font-bold text-muted-foreground">{course.provider}</p>
        </div>

        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-black">
               <span className="text-muted-foreground uppercase">Progress</span>
               <span className="text-primary">{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-500" style={{ width: `${course.progress}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Clock size={12} />
              {course.timeLeft}
            </span>
            <button className="px-3 py-1.5 bg-emerald-500/10 text-primary text-[11px] font-black rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1">
              Continue <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeTraining() {

  const handleBrowseCatalog = () => {
    showToast("Browse Catalog", "info", "Opening training catalog...");
  };

  const handleStartNow = (courseTitle: string) => {
    showToast("Launch Training", "success", `Launching ${courseTitle}...`);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-20">
      
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
            <Book size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Training & Learning
          </h1>
        </div>
        <button
          onClick={handleBrowseCatalog}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-emerald-500/10 active:scale-[0.98] whitespace-nowrap"
        >
          Browse Catalog
        </button>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard 
          icon={BookOpen} color="text-emerald-500" label="ENROLLED" 
          value="3" subValue="courses active" bg="bg-emerald-500/10" 
        />
        <StatsCard 
          icon={CheckCircle2} color="text-teal-500" label="COMPLETED" 
          value="8" subValue="this year · 42 hrs" bg="bg-teal-500/10" 
        />
        <StatsCard 
          icon={Award} color="text-purple-500" label="CERTIFICATIONS" 
          value="5" subValue="active & valid" bg="bg-purple-500/10" 
        />
      </div>

      {/* ─── Continue Learning ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">CONTINUE LEARNING</h3>
           <button className="text-[11px] font-black text-primary hover:underline">View All My Courses</button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {CONTINUE_LEARNING_COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* ─── Mandatory Training ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">MANDATORY TRAINING</h3>
           <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 text-[10px] font-black border border-rose-100 dark:bg-rose-500/10">
             2 due this month
           </span>
        </div>
        <div className="space-y-3">
          {MANDATORY_TRAININGS.map(item => (
            <div 
              key={item.id} 
              className={`bg-card p-5 rounded-[20px] border border-border shadow-sm flex items-center justify-between gap-4 border-l-[3px] ${
                item.color === 'red' ? 'border-l-rose-500' : 
                item.color === 'amber' ? 'border-l-amber-500' : 'border-l-primary'
              } transition-all hover:shadow-md group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                   item.color === 'red' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : 
                   item.color === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' : 'bg-emerald-500/10 text-primary'
                }`}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-[12px] font-bold text-muted-foreground mt-0.5">Deadline: {item.deadline}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   item.color === 'red' ? 'bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-500/10' : 
                   item.color === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10' : 'bg-emerald-500/10 text-primary border border-primary/20'
                }`}>
                  {item.status}
                </span>
                {item.status !== 'Completed' ? (
                   <button 
                    onClick={() => handleStartNow(item.title)}
                    className="px-5 py-2 bg-primary text-white text-[12px] font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
                   >
                     Start Now
                   </button>
                ) : (
                  <CheckCircle2 size={24} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── My Certifications ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">MY CERTIFICATIONS</h3>
           <button className="flex items-center gap-1.5 text-[11px] font-black text-primary hover:underline">
             <Plus size={14} /> Add External Certification
           </button>
        </div>
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">CERTIFICATION</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ISSUED BY</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ISSUE DATE</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">EXPIRY</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">STATUS</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MY_CERTIFICATIONS.map(cert => (
                <tr key={cert.id} className="hover:bg-secondary transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-black text-foreground">{cert.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">{cert.issuedBy}</td>
                  <td className="px-6 py-4 text-[12px] font-bold text-muted-foreground">{cert.issueDate}</td>
                  <td className="px-6 py-4 text-[12px] font-bold text-muted-foreground">{cert.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      cert.status === 'Active' ? 'bg-emerald-500/10 text-primary border-primary/20' :
                      cert.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10' :
                      'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
