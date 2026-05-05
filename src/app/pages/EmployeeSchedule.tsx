import { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
interface Shift {
  id: string;
  date: string;
  day: string;
  type: "Morning" | "Evening" | "Night" | "Off Day";
  time: string;
  hours: string;
  location: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const UPCOMING_SHIFTS: Shift[] = [
  { id: "S1", date: "Apr 06", day: "Mon", type: "Morning", time: "08:00 AM - 04:00 PM", hours: "8h", location: "Head Office, BLR" },
  { id: "S2", date: "Apr 07", day: "Tue", type: "Morning", time: "08:00 AM - 04:00 PM", hours: "8h", location: "Head Office, BLR" },
  { id: "S3", date: "Apr 08", day: "Wed", type: "Evening", time: "04:00 PM - 12:00 AM", hours: "8h", location: "Remote" },
  { id: "S4", date: "Apr 09", day: "Thu", type: "Evening", time: "04:00 PM - 12:00 AM", hours: "8h", location: "Remote" },
  { id: "S5", date: "Apr 10", day: "Fri", type: "Night", time: "12:00 AM - 08:00 AM", hours: "8h", location: "Head Office, BLR" },
];

/* ─────────────────────────────────────────────────────────────── */
/* Shift Styling                                                  */
/* ─────────────────────────────────────────────────────────────── */
interface ShiftColor {
  bg: string;
  text: string;
  border: string;
}

const SHIFT_COLORS: Record<string, ShiftColor> = {
  "Morning": { bg: "bg-emerald-500/10", text: "text-primary", border: "border-primary/20" },
  "Evening": { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
  "Night": { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
  "Off Day": { bg: "bg-secondary", text: "text-muted-foreground", border: "border-border" }
};

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface ShiftOverviewProps {
  label: string;
  value: string | number;
  subValue: string;
  trend?: string;
  trendColor?: 'amber' | 'teal';
}

function PersonalShiftOverviewCard({ label, value, subValue, trend, trendColor }: ShiftOverviewProps) {
  return (
    <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[32px] font-black text-foreground leading-none">{value}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-[13px] font-bold text-muted-foreground">{subValue}</span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
            trendColor === 'amber' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-emerald-500/10 text-primary border-primary/20'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeSchedule() {
  const [view, setView] = useState<'Week' | 'Month' | 'Day'>('Week');
  const [showSwapModal, setShowSwapModal] = useState(false);

  const handleRequestSwap = () => setShowSwapModal(true);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-20">
      
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
            <Clock size={22} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            My Schedule
          </h1>
        </div>
        <button
          onClick={handleRequestSwap}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-emerald-500/10 active:scale-[0.98] whitespace-nowrap"
        >
          ↔ Request Swap
        </button>
      </div>

      {/* ─── Date Navigator + View Toggles ─────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl shadow-sm">
          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all"><ChevronLeft size={18} /></button>
          <div className="px-4 py-1.5 text-[14px] font-black text-foreground">Apr 6 – Apr 12, 2026</div>
          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all"><ChevronRight size={18} /></button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-card border border-border text-primary text-[13px] font-black rounded-xl hover:bg-secondary transition-all">Today</button>
          <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm">
             {['Week', 'Month', 'Day'].map(v => (
               <button 
                key={v}
                onClick={() => setView(v as 'Week' | 'Month' | 'Day')}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-black transition-all ${view === v ? 'bg-emerald-500/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 {v}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* ─── Personal Shift Overview Cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PersonalShiftOverviewCard label="THIS WEEK SHIFTS" value="5" subValue="40h scheduled" />
        <PersonalShiftOverviewCard label="OVERTIME" value="2h" subValue="above 40h" trend="+1.5h" trendColor="amber" />
        <PersonalShiftOverviewCard label="NEXT DAY OFF" value="Saturday" subValue="Apr 11, 2026" />
        <PersonalShiftOverviewCard label="SHIFT SWAPS" value="1" subValue="pending review" trend="New" trendColor="teal" />
      </div>

      {/* ─── My Weekly Schedule Grid ──────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">MY WEEKLY SCHEDULE</h3>
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border min-w-[200px]">EMPLOYEE</th>
                {['MON 06', 'TUE 07', 'WED 08', 'THU 09', 'FRI 10', 'SAT 11', 'SUN 12'].map(day => (
                  <th key={day} className="px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-5 border-b border-border">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-black border-2 border-card shadow-sm">PS</div>
                      <div>
                         <p className="text-[14px] font-black text-foreground">Priya Sharma</p>
                         <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Engineering</p>
                      </div>
                   </div>
                </td>
                {UPCOMING_SHIFTS.map((shift, idx) => {
                   const conf = SHIFT_COLORS[shift.type] || SHIFT_COLORS["Morning"];
                   return (
                     <td key={idx} className="p-2 border-b border-border">
                        <div className={`h-full min-h-[60px] rounded-xl p-2 flex flex-col items-center justify-center gap-1 border-t-4 shadow-sm group cursor-pointer transition-all hover:scale-[1.02] ${conf.bg} ${conf.border}`}>
                           <p className={`text-[11px] font-black uppercase tracking-wider ${conf.text}`}>{shift.type}</p>
                           <p className="text-[10px] font-bold text-muted-foreground">{shift.hours}</p>
                        </div>
                     </td>
                   );
                })}
                {/* Filling rest of the week if mock data is short */}
                <td className="p-2 border-b border-border">
                  <div className="h-full min-h-[60px] rounded-xl bg-secondary flex items-center justify-center border border-dashed border-border">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Off Day</span>
                  </div>
                </td>
                <td className="p-2 border-b border-border">
                  <div className="h-full min-h-[60px] rounded-xl bg-secondary flex items-center justify-center border border-dashed border-border">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Off Day</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Upcoming Shifts List ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">UPCOMING SHIFTS</h3>
           <div className="space-y-3">
             {UPCOMING_SHIFTS.map(shift => {
                const conf = SHIFT_COLORS[shift.type];
                return (
                  <div key={shift.id} className="bg-card p-5 rounded-[20px] border border-border shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${conf.bg} ${conf.border} shadow-sm transition-transform group-hover:scale-105`}>
                           <span className={`text-[14px] font-black ${conf.text}`}>{shift.date.split(' ')[1]}</span>
                           <span className="text-[10px] font-black text-muted-foreground uppercase">{shift.date.split(' ')[0]}</span>
                        </div>
                        <div>
                           <h4 className="text-[15px] font-black text-foreground">{shift.type} Shift</h4>
                           <p className="text-[12px] font-bold text-muted-foreground">{shift.time} · {shift.hours}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-500/10 text-primary border-primary/20`}>Confirmed</span>
                        <button className="p-2 text-muted-foreground/30 hover:text-foreground transition-colors"><MoreVertical size={18} /></button>
                     </div>
                  </div>
                );
             })}
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">SHIFT NOTES</h3>
           <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <h5 className="text-[14px] font-black text-foreground">Available Swaps</h5>
                    <p className="text-[12px] font-bold text-muted-foreground">2 colleagues looking to swap</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertCircle size={20} />
                 </div>
                 <div>
                    <h5 className="text-[14px] font-black text-foreground">Pending Requests</h5>
                    <p className="text-[12px] font-bold text-muted-foreground">1 request awaiting manager</p>
                 </div>
              </div>
              <button 
                onClick={() => showToast("Requests Viewed", "info", "Opening your swap requests...")}
                className="w-full py-3 bg-secondary text-primary text-[13px] font-black rounded-xl border border-primary/20 hover:bg-emerald-500/10 transition-all"
              >
                 View My Requests
              </button>
           </div>
        </div>
      </div>

      {/* ─── Swap Request Modal ────────────────────────────────────── */}
      {showSwapModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={() => setShowSwapModal(false)} />
           <div className="relative bg-card w-full max-w-[480px] rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <ArrowLeftRight size={20} className="text-primary" />
                    </div>
                    <h3 className="text-[18px] font-black text-foreground">Request Shift Swap</h3>
                 </div>
                 <button onClick={() => setShowSwapModal(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-6 space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select Your Shift</label>
                    <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none">
                       <option>Apr 06 - Morning Shift</option>
                       <option>Apr 07 - Morning Shift</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Colleague to Swap with</label>
                    <div className="relative">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                       <input type="text" placeholder="Search colleague name..." className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none focus:border-primary transition-all" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reason for Swap</label>
                    <textarea rows={3} placeholder="Optional reason..." className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none" />
                 </div>
                 <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-500" />
                    <p className="text-[11px] font-black text-amber-600">Swap requests require manager approval.</p>
                 </div>
                 <button 
                  onClick={() => { showToast("Swap Requested", "success", "Your swap request has been sent."); setShowSwapModal(false); }}
                  className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all mt-2"
                 >
                    Send Swap Request
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
