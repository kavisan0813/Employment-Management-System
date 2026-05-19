import { useState } from "react";
import { 
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  ChevronDown,
} from "lucide-react";

const ATTENDANCE_LOGS = [
  { date: "01 Apr 2026", in: "08:52 AM", out: "06:05 PM", status: "Present" },
  { date: "02 Apr 2026", in: "08:58 AM", out: "06:02 PM", status: "Present" },
  { date: "03 Apr 2026", in: "09:15 AM", out: "06:10 PM", status: "Present" },
  { date: "04 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "05 Apr 2026", in: "-", out: "-", status: "Weekend" },
  { date: "06 Apr 2026", in: "08:45 AM", out: "06:00 PM", status: "Present" },
  { date: "07 Apr 2026", in: "-", out: "-", status: "Present" },
  { date: "08 Apr 2026", in: "09:02 AM", out: "06:15 PM", status: "Present" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function FinanceAttendance() {
  const [selectedMonth, setSelectedMonth] = useState(3); // April
  const [selectedYear] = useState(2026);

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-card rounded-xl border border-border shadow-sm w-fit">
          <button
            onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 px-3 text-[14px] font-black text-foreground min-w-[120px] justify-center">
            <Calendar size={14} className="text-muted-foreground" />
            <span>{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
          </div>
          <button
            onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-[#00B87C] text-[#00B87C] font-black text-[12px] uppercase tracking-widest hover:bg-[#00B87C]/5 transition-all">
            Apply Regularization
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition-all">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">AD</div>
            <span className="text-[13px] font-black text-foreground">Ananya Das</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ─── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Working Days" value="22" color="#111827" />
        <StatCard label="Present" value="19" color="#00B87C" bg="bg-[#DCFCE7]/50" />
        <StatCard label="Absent" value="0" color="#EF4444" bg="bg-rose-500/5" />
        <StatCard label="Leaves Taken" value="2" color="#F59E0B" bg="bg-amber-500/5" />
      </div>

      {/* ─── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Calendar (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-black text-foreground tracking-tight">Monthly Attendance Calendar</h3>
              <div className="flex flex-wrap items-center gap-4">
                <LegendItem label="Present" color="#00B87C" />
                <LegendItem label="Absent" color="#EF4444" />
                <LegendItem label="Leave" color="#F59E0B" />
                <LegendItem label="Holiday" color="#14B8A6" />
                <LegendItem label="Weekend" color="#D1D5DB" />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 mb-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-center text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;

                const isToday = day === 6;
                const isLeave = day === 15 || day === 16;
                const isWeekend = i % 7 === 0 || i % 7 === 6;
                
                let cellStyle = "bg-card border-border hover:border-[#00B87C]";
                let textStyle = "text-foreground";
                let dotColor = "bg-[#00B87C]";

                if (isToday) {
                  cellStyle = "bg-[#00B87C] border-[#00B87C] shadow-lg shadow-[#00B87C]/20";
                  textStyle = "text-white";
                  dotColor = "bg-white";
                } else if (isLeave) {
                  cellStyle = "bg-[#FEF3C7] border-transparent";
                  textStyle = "text-[#F59E0B]";
                  dotColor = "bg-[#F59E0B]";
                } else if (isWeekend) {
                  cellStyle = "bg-card border-transparent opacity-60";
                  textStyle = "text-[#D1D5DB]";
                  dotColor = "bg-transparent";
                } else if (day < 6) {
                  cellStyle = "bg-[#DCFCE7] border-transparent";
                  textStyle = "text-[#00B87C]";
                  dotColor = "bg-[#00B87C]";
                }

                return (
                  <div key={day} className={`aspect-square min-h-[85px] rounded-[20px] flex flex-col items-center justify-center transition-all border ${cellStyle}`}>
                    <span className={`text-[18px] font-black ${textStyle}`}>{day}</span>
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MiniStat label="Check-in Avg" value="08:58 AM" />
            <MiniStat label="Check-out Avg" value="06:04 PM" />
            <MiniStat label="Punctuality" value="96%" />
          </div>
        </div>

        {/* RIGHT: Daily Log (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-foreground tracking-tight">Daily Log</h3>
                <span className="text-[14px] font-bold text-muted-foreground">April 2026</span>
              </div>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">In</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Out</th>
                  <th className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ATTENDANCE_LOGS.map((log, i) => (
                  <tr key={i} className="h-14 hover:bg-[#F0FDF4] dark:hover:bg-emerald-500/5 transition-all">
                    <td className="px-6 text-[13px] font-black text-foreground">{log.date}</td>
                    <td className="px-6 text-[12px] font-bold text-muted-foreground">{log.in}</td>
                    <td className="px-6 text-[12px] font-bold text-muted-foreground">{log.out}</td>
                    <td className="px-6">
                      <span className={`text-[12px] font-black ${
                        log.status === 'Present' ? 'text-[#00B87C]' : 
                        log.status === 'Leave' ? 'text-[#F59E0B]' : 
                        log.status === 'Absent' ? 'text-[#EF4444]' : 'text-muted-foreground'
                      }`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-card rounded-[32px] p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-black text-foreground tracking-tight">Regularization Requests</h3>
              <button className="text-[12px] font-black text-[#00B87C] hover:underline uppercase tracking-widest">Apply New</button>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 mb-4">
                <Plus size={32} />
              </div>
              <p className="text-[13px] font-bold text-muted-foreground italic">No regularization requests this month</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ─── UI COMPONENTS ─── */

function StatCard({ label, value, color, bg = "bg-card" }: { label: string, value: string, color: string, bg?: string }) {
  return (
    <div className={`p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center hover:border-[#00B87C]/30 transition-all ${bg}`}>
      <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center hover:border-[#00B87C]/30 transition-all">
      <p className="text-[16px] font-black text-foreground mb-1 tracking-tight">{value}</p>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
  );
}
