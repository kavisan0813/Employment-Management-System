import React, { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  CalendarX,
  MessageSquare,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

// Types
type ViewMode = "Week" | "Month" | "Day";

interface ShiftCell {
  day: string;
  date: string;
  type: "Morning" | "Evening" | "Night" | "Off Day";
  time: string;
  hasOt?: boolean;
}

const SHIFT_SCHEDULE: ShiftCell[] = [
  { day: "Mon", date: "Apr 6", type: "Morning", time: "06:00 – 14:00" },
  { day: "Tue", date: "Apr 7", type: "Morning", time: "06:00 – 14:00", hasOt: true },
  { day: "Wed", date: "Apr 8", type: "Off Day", time: "N/A" },
  { day: "Thu", date: "Apr 9", type: "Evening", time: "14:00 – 22:00" },
  { day: "Fri", date: "Apr 10", type: "Morning", time: "06:00 – 14:00" },
  { day: "Sat", date: "Apr 11", type: "Off Day", time: "N/A" },
  { day: "Sun", date: "Apr 12", type: "Off Day", time: "N/A" },
];

export function FinanceSchedule() {
  const [view, setView] = useState<ViewMode>("Week");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [showShiftDetails, setShowShiftDetails] = useState<ShiftCell | null>(null);

  const handleRequestSwap = () => {
    showToast("Swap request submitted successfully to Rajan Kumar.", "success");
    setIsSwapModalOpen(false);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 space-y-8 animate-in fade-in duration-500">
      
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-[#DCFCE7] flex items-center justify-center text-[#00B87C] shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight m-0 leading-none">My Schedule</h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1">Your personal shift schedule</p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsSwapModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-[#00B87C] text-[#00B87C] font-black text-[13px] hover:bg-[#00B87C]/10 transition-all flex items-center gap-2 bg-transparent"
          >
            <span className="text-[15px]">↔</span> Request Swap
          </button>
        </div>
      </div>

      {/* ═══════ DATE NAVIGATOR & VIEW TOGGLE ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl shadow-sm">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-1.5 text-[14px] font-black text-foreground whitespace-nowrap">
              Apr 6 – Apr 12, 2026
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="px-5 py-2 bg-card border-2 border-[#00B87C] text-[#00B87C] text-[13px] font-black rounded-xl hover:bg-emerald-500/10 transition-all">
            Today
          </button>
        </div>
        
        <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm w-fit">
          {(["Week", "Month", "Day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-black transition-all ${
                view === v ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ KPI CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
                <Clock size={18} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">THIS WEEK SHIFTS</p>
            </div>
            <p className="text-[32px] font-black text-[#00B87C] leading-none">5</p>
          </div>
          <div className="mt-4">
            <span className="text-[13px] font-bold text-muted-foreground">40h scheduled</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between hover:border-[#F59E0B]/30 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                <Clock size={18} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">OVERTIME</p>
            </div>
            <p className="text-[32px] font-black text-[#111827] leading-none dark:text-white">0h</p>
          </div>
          <div className="mt-4">
            <span className="text-[13px] font-bold text-muted-foreground">within 40h limit</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
                <Calendar size={18} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">NEXT DAY OFF</p>
            </div>
            <p className="text-[24px] font-black text-[#111827] leading-none dark:text-white mt-2">Saturday</p>
          </div>
          <div className="mt-4">
            <span className="text-[13px] font-bold text-muted-foreground">Apr 11, 2026</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between hover:border-[#0EA5E9]/30 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0EA5E9]">
                <CalendarX size={18} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">SHIFT SWAPS</p>
            </div>
            <p className="text-[32px] font-black text-[#0D9488] leading-none">0</p>
          </div>
          <div className="mt-4">
            <span className="text-[13px] font-bold text-muted-foreground">no pending</span>
          </div>
        </div>
      </div>

      {/* ═══════ MY WEEKLY SCHEDULE GRID ═══════ */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-2">MY WEEKLY SCHEDULE — Apr 6–12</h3>
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border min-w-[200px]">
                  EMPLOYEE
                </th>
                {SHIFT_SCHEDULE.map((s, idx) => (
                  <th key={idx} className="px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-center">
                    {s.day === 'Mon' ? <span className="text-[#00B87C]">{s.day} {s.date.split(' ')[1]}</span> : <>{s.day} {s.date.split(' ')[1]}</>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-[12px] font-black border-2 border-card shadow-sm">
                      AD
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-foreground">Ananya Das</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-black bg-teal-500/10 text-[#0D9488] uppercase">Finance</span>
                    </div>
                  </div>
                </td>
                {SHIFT_SCHEDULE.map((shift, idx) => (
                  <td key={idx} className="p-2 border-b border-border text-center align-top min-w-[120px]">
                    {shift.type === "Morning" && (
                      <div className="relative group bg-[#DCFCE7] border-l-[3px] border-l-[#00B87C] rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer min-h-[70px] dark:bg-[#00B87C]/10">
                        {shift.hasOt && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">OT</div>}
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#00B87C]">MORNING</span>
                        <span className="text-[13px] font-bold text-[#374151] dark:text-slate-300">{shift.time}</span>
                        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button className="p-1 rounded hover:bg-black/10 text-[#00B87C]"><Edit2 size={12} /></button>
                          <button className="p-1 rounded hover:bg-black/10 text-[#00B87C]"><MessageSquare size={12} /></button>
                        </div>
                      </div>
                    )}
                    {shift.type === "Evening" && (
                      <div className="relative group bg-[#FEF3C7] border-l-[3px] border-l-[#F59E0B] rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer min-h-[70px] dark:bg-[#F59E0B]/10">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#F59E0B]">EVENING</span>
                        <span className="text-[13px] font-bold text-[#374151] dark:text-slate-300">{shift.time}</span>
                        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button className="p-1 rounded hover:bg-black/10 text-[#F59E0B]"><Edit2 size={12} /></button>
                          <button className="p-1 rounded hover:bg-black/10 text-[#F59E0B]"><MessageSquare size={12} /></button>
                        </div>
                      </div>
                    )}
                    {shift.type === "Night" && (
                      <div className="relative group bg-[#EDE9FE] border-l-[3px] border-l-[#8B5CF6] rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer min-h-[70px] dark:bg-[#8B5CF6]/10">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#8B5CF6]">NIGHT</span>
                        <span className="text-[13px] font-bold text-[#374151] dark:text-slate-300">{shift.time}</span>
                        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button className="p-1 rounded hover:bg-black/10 text-[#8B5CF6]"><Edit2 size={12} /></button>
                          <button className="p-1 rounded hover:bg-black/10 text-[#8B5CF6]"><MessageSquare size={12} /></button>
                        </div>
                      </div>
                    )}
                    {shift.type === "Off Day" && (
                      <div className="h-full min-h-[70px] rounded-xl bg-card flex items-center justify-center cursor-pointer transition-all border border-transparent hover:border-border group">
                        <span className="text-[12px] font-bold text-muted-foreground italic group-hover:text-foreground transition-colors">OFF</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ BOTTOM PANELS ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Shifts List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-2">NEXT 14 DAYS</h3>
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">DATE</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">DAY</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">SHIFT TYPE</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">TIME</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">HOURS</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">LOCATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowShiftDetails({ day: 'Tue', date: 'Apr 7', type: 'Morning', time: '06:00–14:00' })}>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground whitespace-nowrap">Apr 7</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">Tuesday</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-[#00B87C] uppercase tracking-widest border border-emerald-500/20">MORNING</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground whitespace-nowrap">06:00 – 14:00</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">8h</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground whitespace-nowrap">HQ Office</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowShiftDetails({ day: 'Wed', date: 'Apr 8', type: 'Off Day', time: 'N/A' })}>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground whitespace-nowrap">Apr 8</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">Wednesday</td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-muted-foreground italic">OFF</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">—</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">—</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">—</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowShiftDetails({ day: 'Thu', date: 'Apr 9', type: 'Evening', time: '14:00–22:00' })}>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground whitespace-nowrap">Apr 9</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">Thursday</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-[#F59E0B] uppercase tracking-widest border border-amber-500/20">EVENING</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground whitespace-nowrap">14:00 – 22:00</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">8h</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground whitespace-nowrap">HQ Office</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* My Swap Requests Panel */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-2">MY SWAP REQUESTS</h3>
          <div className="bg-card rounded-[24px] border border-border shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <p className="text-[13px] font-bold text-muted-foreground italic">No active swap requests</p>
          </div>
        </div>

      </div>

      {/* ═══════ REQUEST SWAP MODAL ═══════ */}
      <AnimatePresence>
        {isSwapModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[460px] bg-card border border-border rounded-[24px] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-[18px] font-black text-foreground tracking-tight">Request Shift Swap</h2>
                </div>
                <button onClick={() => setIsSwapModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">My shift to swap</label>
                  <div className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-[#00B87C] uppercase border border-emerald-500/20">MORNING</span>
                    <span className="text-[13px] font-bold text-foreground">Apr 7 (Tue) · 06:00 – 14:00</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Swap with colleague</label>
                  <input type="text" placeholder="Search colleague name..." className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Their shift to receive</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-muted-foreground appearance-none">
                    <option>Select colleague first...</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reason for swap</label>
                  <textarea placeholder="Add reason for swap..." className="w-full h-20 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground resize-none" />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/30 dark:bg-[#00B87C]/5">
                  <div className="mt-0.5 text-[#00B87C]"><MessageSquare size={16} /></div>
                  <p className="text-[12px] font-black text-[#00B87C]">Your manager Rajan Kumar will be notified for approval</p>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between gap-4 rounded-b-[24px]">
                <button 
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-6 py-3 text-[12px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRequestSwap}
                  className="flex-1 px-6 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-black uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 text-center"
                >
                  Submit Swap Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ SHIFT DETAILS TOOTLIP (SIMPLE MODAL FOR DEMO) ═══════ */}
      <AnimatePresence>
        {showShiftDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShiftDetails(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-[320px] bg-card border border-border rounded-2xl shadow-xl p-5 flex flex-col items-center text-center">
              <h3 className="text-[16px] font-black text-foreground mb-1">{showShiftDetails.type} Shift</h3>
              <p className="text-[13px] font-bold text-muted-foreground mb-4">{showShiftDetails.day}, {showShiftDetails.date} · {showShiftDetails.time}</p>
              <button onClick={() => setShowShiftDetails(null)} className="px-5 py-2 rounded-xl bg-muted text-foreground text-[12px] font-black uppercase">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
