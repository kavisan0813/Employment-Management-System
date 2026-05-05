import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  X
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ATTENDANCE_LOGS = [
  { date: "01 Apr 2026", in: "08:52 AM", out: "06:05 PM", status: "Present" },
  { date: "02 Apr 2026", in: "08:58 AM", out: "06:02 PM", status: "Present" },
  { date: "03 Apr 2026", in: "09:15 AM", out: "06:10 PM", status: "Late" },
  { date: "04 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "05 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "06 Apr 2026", in: "08:45 AM", out: "06:00 PM", status: "Present" },
  { date: "07 Apr 2026", in: "-", out: "-", status: "Leave" },
  { date: "08 Apr 2026", in: "09:02 AM", out: "06:15 PM", status: "Present" },
];

const REGULARIZATION_REQUESTS = [
  { date: "10 Apr 2026", reason: "Forgot to punch out", status: "Pending" },
  { date: "12 Apr 2026", reason: "On-site client meeting", status: "Approved" },
];

function RegularizationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border">
         <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
            <h3 className="text-[18px] font-black text-foreground">Apply Regularization</h3>
            <button onClick={onClose} className="p-2 hover:bg-card rounded-xl transition-colors text-muted-foreground"><X size={20} /></button>
         </div>
         <div className="p-8 space-y-6">
            <div className="space-y-2">
               <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Select Date</label>
               <input type="date" className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Check-in Time</label>
                  <input type="time" className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner" />
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Check-out Time</label>
                  <input type="time" className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reason</label>
               <textarea placeholder="Explain why you missed the punch..." className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner h-24 resize-none" />
            </div>
         </div>
         <div className="p-6 bg-secondary/30 flex items-center gap-4 border-t border-border">
            <button onClick={onClose} className="flex-1 py-4 text-[13px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Cancel</button>
            <button 
             onClick={() => {
                showToast("Request Submitted", "success", "Your regularization request has been sent to your manager.");
                onClose();
             }}
             className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
            >
               Submit Request
            </button>
         </div>
      </motion.div>
    </div>
  );
}

export function EmployeeAttendance() {
  const [selectedMonth, setSelectedMonth] = useState(3); // April
  const [selectedYear] = useState(2026);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handleApplyRegularization = () => {
    setIsRegModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">
      
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-card rounded-xl border border-border shadow-sm">
          <button 
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 text-[14px] font-black text-foreground min-w-[100px] text-center">
            {MONTH_NAMES[selectedMonth]} {selectedYear}
          </span>
          <button 
            onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button 
          onClick={handleApplyRegularization}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-primary/10 shadow-sm"
        >
          <Plus size={16} /> Apply Regularization
        </button>
      </div>

      {/* ─── Stat Cards Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Working Days", value: "22", color: "var(--foreground)", bg: "bg-card" },
          { label: "Present", value: "19", color: "var(--primary)", bg: "bg-card" },
          { label: "Absent", value: "0", color: "var(--destructive)", bg: "bg-card" },
          { label: "Leaves Taken", value: "2", color: "#F59E0B", bg: "bg-card" },
        ].map((card, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary transition-colors ${card.bg}`}>
            <p className="text-3xl font-black mb-1" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Main Content Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Calendar (7/12) */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-black text-foreground">Attendance Calendar</h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { label: "Present", color: "var(--primary)" },
                  { label: "Absent", color: "var(--destructive)" },
                  { label: "Leave", color: "#F59E0B" },
                  { label: "Weekend", color: "var(--muted-foreground)" }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                
                const isWeekend = i % 7 === 0 || i % 7 === 6;
                const isToday = day === 6; // April 6
                const isLeave = day === 7;
                
                let cellStyle = "bg-background";
                let textStyle = "text-foreground";
                let dotStyle = "bg-transparent";

                if (isToday) {
                  cellStyle = "bg-primary shadow-xl shadow-primary/30";
                  textStyle = "text-white";
                  dotStyle = "bg-white";
                } else if (isLeave) {
                  cellStyle = "bg-amber-500/10 border-amber-500/20";
                  textStyle = "text-amber-500";
                  dotStyle = "bg-amber-500";
                } else if (isWeekend) {
                  cellStyle = "bg-secondary/30 border-transparent opacity-40";
                  textStyle = "text-muted-foreground";
                } else if (day < 6) {
                  cellStyle = "bg-primary/10 border-primary/20";
                  textStyle = "text-primary";
                  dotStyle = "bg-primary";
                }

                return (
                  <div 
                    key={day}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 border ${cellStyle}`}
                  >
                    <span className={`text-base font-black ${textStyle}`}>{day}</span>
                    {!isWeekend && <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotStyle}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Check-in Avg", value: "08:54 AM", color: "text-primary" },
              { label: "Check-out Avg", value: "06:04 PM", color: "text-muted-foreground" },
              { label: "Punctuality", value: "96%", color: "text-primary" },
            ].map((stat, i) => (
              <div key={i} className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center group hover:border-primary transition-colors">
                <p className={`text-lg font-black mb-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Daily Log & Regularization (5/12) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-foreground">Daily Log</h3>
                <span className="px-2.5 py-0.5 rounded-md bg-background border border-border text-[10px] font-bold text-muted-foreground">April 2026</span>
              </div>
              <button onClick={() => showToast("History", "info", "Viewing detailed attendance history")} className="text-primary text-[12px] font-black hover:underline flex items-center gap-1">
                View History <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">In</th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Out</th>
                    <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ATTENDANCE_LOGS.map((log, i) => (
                    <tr key={i} className="h-14 hover:bg-secondary transition-colors group">
                      <td className="px-6 text-[13px] font-black text-foreground">{log.date}</td>
                      <td className="px-6 text-[12px] font-bold text-muted-foreground">{log.in}</td>
                      <td className="px-6 text-[12px] font-bold text-muted-foreground">{log.out}</td>
                      <td className="px-6">
                        <span className={`text-[12px] font-black ${
                          log.status === 'Present' ? 'text-primary' :
                          log.status === 'Late' ? 'text-amber-500' :
                          log.status === 'Leave' ? 'text-indigo-400' :
                          'text-muted-foreground/30'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regularization Requests Section */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-black text-foreground">Regularization</h3>
              <button 
                onClick={handleApplyRegularization}
                className="text-primary text-[12px] font-black hover:underline px-3 py-1 bg-primary/10 rounded-lg"
              >
                Apply New
              </button>
            </div>

            <div className="space-y-4">
              {REGULARIZATION_REQUESTS.length > 0 ? (
                REGULARIZATION_REQUESTS.map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border transition-all hover:border-primary/40 group">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">{req.date}</span>
                      <span className="text-[11px] font-bold text-muted-foreground">{req.reason}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border ${
                      req.status === 'Approved' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-background rounded-2xl border border-dashed border-border">
                  <p className="text-[13px] font-bold text-muted-foreground italic">No regularization requests this month</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        <RegularizationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
      </AnimatePresence>
    </div>
  );
}
