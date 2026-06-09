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

  // Stateful Swap Requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [colleagueName, setColleagueName] = useState("");
  const [theirShift, setTheirShift] = useState("Evening Shift (14:00 - 22:00)");
  const [swapReason, setSwapReason] = useState("");

  const handleRequestSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colleagueName.trim() || !swapReason.trim()) {
      showToast("Error", "error", "Please fill in all the fields.");
      return;
    }
    const newRequest = {
      id: `SWAP-${Math.floor(1000 + Math.random() * 9000)}`,
      myShift: "Apr 7 (Tue) · Morning · 06:00 – 14:00",
      colleague: colleagueName,
      theirShift: theirShift,
      reason: swapReason,
      status: "Pending Approval"
    };
    setSwapRequests([newRequest, ...swapRequests]);
    showToast("Success", "success", `Swap request submitted successfully to ${colleagueName}.`);
    setIsSwapModalOpen(false);
    setColleagueName("");
    setSwapReason("");
  };

  const handleCancelSwap = (id: string) => {
    setSwapRequests(prev => prev.filter(r => r.id !== id));
    showToast("Cancelled", "info", "Swap request cancelled successfully.");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 space-y-8 animate-in fade-in duration-500">
      
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center text-[#00B87C] shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight m-0 leading-none">My Schedule</h1>
            <p className="text-[13px] text-[#6B7280] mt-1">Your personal shift schedule</p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsSwapModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-[#00B87C] text-[#00B87C] font-black text-[13px] hover:bg-[#00B87C]/10 transition-all flex items-center gap-2 bg-transparent cursor-pointer"
          >
            <span className="text-[15px]">↔</span> Request Swap
          </button>
        </div>
      </div>

      {/* ═══════ DATE NAVIGATOR & VIEW TOGGLE ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl shadow-sm">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all bg-transparent border-0">
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-1.5 text-[14px] font-black text-foreground whitespace-nowrap">
              Apr 6 – Apr 12, 2026
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all bg-transparent border-0">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="px-5 py-2 bg-card border-2 border-[#00B87C] text-[#00B87C] text-[13px] font-black rounded-xl hover:bg-emerald-500/10 transition-all bg-transparent cursor-pointer">
            Today
          </button>
        </div>
        
        <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm w-fit">
          {(["Week", "Month", "Day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-black transition-all border-0 bg-transparent cursor-pointer ${
                view === v ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ PERSONAL KPI CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-all min-h-[120px]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">SHIFTS THIS WEEK</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-foreground">4</span>
            <span className="text-[14px] font-bold text-muted-foreground">/ 5 days</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-all min-h-[120px]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">WEEKLY HOURS</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-[#00B87C]">32</span>
            <span className="text-[14px] font-bold text-muted-foreground">/ 40 hrs</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-all min-h-[120px]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">OVERTIME HOURS</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-amber-500">2.5</span>
            <span className="text-[14px] font-bold text-muted-foreground">hrs approved</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#00B87C]/30 transition-all min-h-[120px]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">SHIFT TYPE</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-lg font-black text-foreground uppercase tracking-wider">Morning Standard</span>
          </div>
        </div>
      </div>

      {/* ═══════ WEEKLY SCHEDULE GRID & MY SWAP REQUESTS ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Schedule Table (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-2">WEEKLY GRID</h3>
          <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Shift Type</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Scheduled Hours</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowShiftDetails({ day: 'Mon', date: 'Apr 6', type: 'Morning', time: '06:00–14:00' })}>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground whitespace-nowrap">Apr 6</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">Monday</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-[#00B87C] uppercase tracking-widest border border-emerald-500/20">MORNING</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground whitespace-nowrap">06:00 – 14:00</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">—</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground whitespace-nowrap">HQ Office</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowShiftDetails({ day: 'Tue', date: 'Apr 7', type: 'Morning', time: '06:00–14:00', hasOt: true })}>
                  <td className="px-6 py-4 text-[13px] font-black text-foreground whitespace-nowrap">Apr 7</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">Tuesday</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-[#00B87C] uppercase tracking-widest border border-emerald-500/20">MORNING</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground whitespace-nowrap">06:00 – 14:00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[11px] font-semibold uppercase">2.5 hrs OT</span>
                  </td>
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
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-[#F59E0B] uppercase tracking-widest border border-amber-500/20">EVENING</span>
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
          <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-2">MY SWAP REQUESTS</h3>
          
          {swapRequests.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-[13px] font-bold text-muted-foreground italic">No active swap requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {swapRequests.map((req) => (
                <div key={req.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 relative hover:border-[#00B87C]/30 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-black text-[#00B87C] tracking-wider bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{req.id}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">{req.status}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">My Shift</p>
                    <p className="text-[13px] font-bold text-foreground">{req.myShift}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Swap Colleague</p>
                    <p className="text-[13px] font-bold text-foreground">{req.colleague}</p>
                    <p className="text-[11px] font-bold text-muted-foreground">Colleague's Shift: {req.theirShift}</p>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[11px] font-bold text-muted-foreground italic">"{req.reason}"</span>
                    <button 
                      onClick={() => handleCancelSwap(req.id)}
                      className="px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              className="relative w-full max-w-[460px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-[18px] font-black text-foreground tracking-tight">Request Shift Swap</h2>
                </div>
                <button onClick={() => setIsSwapModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground bg-transparent border-0"><X size={20} /></button>
              </div>

              <form onSubmit={handleRequestSwap} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">My shift to swap</label>
                  <div className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-[#00B87C] uppercase border border-emerald-500/20">MORNING</span>
                    <span className="text-[13px] font-bold text-foreground">Apr 7 (Tue) · 06:00 – 14:00</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Swap with colleague</label>
                  <input 
                    type="text" 
                    value={colleagueName}
                    onChange={(e) => setColleagueName(e.target.value)}
                    placeholder="Search colleague name (e.g. Rajan Kumar)..." 
                    className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Their shift to receive</label>
                  <select 
                    value={theirShift}
                    onChange={(e) => setTheirShift(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground appearance-none"
                  >
                    <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                    <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                    <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">Reason for swap</label>
                  <textarea 
                    value={swapReason}
                    onChange={(e) => setSwapReason(e.target.value)}
                    placeholder="Add reason for swap..." 
                    className="w-full h-20 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground resize-none" 
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/30 dark:bg-[#00B87C]/5">
                  <div className="mt-0.5 text-[#00B87C]"><MessageSquare size={16} /></div>
                  <p className="text-[12px] font-black text-[#00B87C]">Your manager Rajan Kumar will be notified for approval</p>
                </div>

                <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between gap-4 rounded-b-[24px] -mx-6 -mb-6">
                  <button 
                    type="button"
                    onClick={() => setIsSwapModalOpen(false)}
                    className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 text-center border-0 cursor-pointer"
                  >
                    Submit Swap Request
                  </button>
                </div>
              </form>
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
