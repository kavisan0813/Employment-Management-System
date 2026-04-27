import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,

  Plus,
  Users,
  CheckSquare,
  Clock,
  ArrowLeftRight,
  CalendarPlus,
  X,
  Search,
  Check,
  Calendar as CalendarIcon,
  Filter,
  AlertTriangle,
  Download,
  CalendarDays,
  Activity,
  UserCheck,
  MoreVertical as MoreIcon
} from 'lucide-react';
import { employees as globalEmployees } from '../data/mockData';


interface Shift {
  type: 'Morning' | 'Evening' | 'Night' | 'Full Day';
  time: string;
  isOT?: boolean;
}

interface ShiftMap {
  [key: string]: Shift | null;
}

interface SwapItem {
  id: number;
  p1: string;
  p1Init: string;
  p2: string;
  p2Init: string;
  reason: string;
  detail: string;
  p1Color: string;
  p2Color: string;
  shiftTypes: string;
}

export const ShiftSchedule: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<'Week' | 'Month' | 'Day'>('Week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBrush, setActiveBrush] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [swaps, setSwaps] = useState<SwapItem[]>([
    { id: 1, p1: 'Sarah J.', p1Init: 'SJ', p2: 'Marcus W.', p2Init: 'MW', reason: 'Doctor appointment', detail: 'Mon Apr 7 Morning ↔ Tue Apr 8 Evening', p1Color: '#059669', p2Color: '#2563EB', shiftTypes: 'Morning ↔ Evening' },
    { id: 2, p1: 'Ravi K.', p1Init: 'RK', p2: 'Sneha P.', p2Init: 'SP', reason: 'Family event', detail: 'Wed Apr 9 Night ↔ Fri Apr 11 Night', p1Color: '#0D9488', p2Color: '#7C3AED', shiftTypes: 'Night ↔ Night' },
    { id: 3, p1: 'James C.', p1Init: 'JC', p2: 'Emily R.', p2Init: 'ER', reason: 'Transport issues', detail: 'Thu Apr 10 Evening ↔ Fri Apr 11 Morning', p1Color: '#D97706', p2Color: '#DB2777', shiftTypes: 'Evening ↔ Morning' },
  ]);
  const [fixingOT, setFixingOT] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedSwapDetails, setSelectedSwapDetails] = useState<SwapItem | null>(null);
  const swapListRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const dates = useMemo(() => {
    const baseDate = new Date(2026, 3, 6); // Apr 6, 2026
    return days.map((_, i) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + (weekOffset * 7) + i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  }, [weekOffset]);

  // Generate dynamic schedule from global data
  const [scheduleData, setScheduleData] = useState(() => {
    return globalEmployees.map(emp => ({
      id: emp.id,
      name: emp.name,
      dept: emp.department,
      initials: emp.name.split(' ').map(n => n[0]).join(''),
      avatar: emp.avatar,
      shifts: days.reduce((acc, day) => {
        const rand = Math.random();
        if (rand > 0.3) {
          const types: ('Morning' | 'Evening' | 'Night' | 'Off Day')[] = ['Morning', 'Evening', 'Night', 'Off Day'];
          const type = types[Math.floor(Math.random() * types.length)];
          const times: Record<string, string> = {
            'Morning': '06:00 – 14:00',
            'Evening': '14:00 – 22:00',
            'Night': '22:00 – 06:00',
            'Off Day': 'Rest Day'
          };
          if (type !== 'Off Day') {
            acc[day] = { type: type as 'Morning' | 'Evening' | 'Night' | 'Full Day', time: times[type], isOT: Math.random() > 0.8 };
          }
        }
        return acc;
      }, {} as ShiftMap)
    }));
  });

  const handleDrop = (empId: string, day: string, shiftType: string) => {
    setScheduleData(prev => prev.map(emp => {
      if (emp.id === empId) {
        const times: Record<string, string> = {
          'Morning': '06:00 – 14:00',
          'Evening': '14:00 – 22:00',
          'Night': '22:00 – 06:00',
          'Off Day': 'Rest Day',
        };
        const updatedShifts = { ...emp.shifts };
        if (shiftType === 'Off Day') {
          delete updatedShifts[day];
        } else {
          updatedShifts[day] = { 
            type: shiftType as 'Morning' | 'Evening' | 'Night' | 'Full Day', 
            time: times[shiftType] || '09:00 – 18:00', 
            isOT: false 
          };
        }
        return { ...emp, shifts: updatedShifts };
      }
      return emp;
    }));
  };

  const departments = ['All Departments', ...new Set(globalEmployees.map(e => e.department))];

  const filteredSchedule = useMemo(() => {
    if (selectedDept === 'All Departments') return scheduleData;
    return scheduleData.filter(s => s.dept === selectedDept);
  }, [selectedDept, scheduleData]);

  const handleExport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      setShowExportModal(false);
    }, 1500);
  };

  const weekLabel = useMemo(() => {
    if (weekOffset === 0) return 'Apr 6 - Apr 12, 2026';
    if (weekOffset === 1) return 'Apr 13 - Apr 19, 2026';
    if (weekOffset === -1) return 'Mar 30 - Apr 5, 2026';
    return weekOffset > 0 ? `Next ${weekOffset} Weeks` : `Prev ${Math.abs(weekOffset)} Weeks`;
  }, [weekOffset]);

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>Shift & Schedule Manager</h2>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>Efficiently manage workforce rotations, overtime limits, and shift swap approvals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-bold rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            <div className="flex items-center gap-2">
              <Download size={16} />
              {showExportModal ? 'Exporting...' : 'Export Schedule'}
            </div>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 hover:-translate-y-1 active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #0D9488)" }}>
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-bold">Add Shift</span>
          </button>
        </div>
      </div>

      {/* System Health / Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckSquare size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Coverage Status</p>
            <p className="text-sm font-bold text-foreground">94.2% Optimal Coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-widest">System Alerts</p>
            <p className="text-sm font-bold text-foreground">3 Understaffed Shifts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-widest">Ongoing Swaps</p>
            <p className="text-sm font-bold text-foreground">8 Pending Reviews</p>
          </div>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl">
            <button
              className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-primary active:scale-90"
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold px-3 text-foreground min-w-[180px] text-center">{weekLabel}</span>
            <button
              className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-primary active:scale-90"
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            className="px-4 py-2 text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors active:scale-95"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              className="pl-9 pr-6 py-2 rounded-xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex p-1 bg-secondary rounded-xl">
            {['Week', 'Month', 'Day'].map(v => (
              <button
                key={v}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === v ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setView(v as 'Week' | 'Month' | 'Day')}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Total Employees</p>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>248</p>
              <span className="text-[10px] font-bold text-emerald-600 mt-2 inline-block">↑ 4 from last week</span>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-zinc-800">
              <Users size={24} color="var(--primary)" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Target Coverage</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-tight text-emerald-600 group-hover:scale-105 transition-transform">94.2%</p>
                <span className="text-[10px] font-extrabold text-muted-foreground">/ 90%</span>
              </div>
              <div className="w-28 h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <UserCheck size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Total Overtime</p>
              <p className="text-3xl font-extrabold tracking-tight text-amber-600">142<span className="text-sm ml-1 font-bold">h</span></p>
              <span className="text-[10px] font-bold text-amber-600 mt-2 inline-block">↑ 12h vs last week</span>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 transition-colors group-hover:bg-amber-100">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Pending Swaps</p>
              <p className="text-3xl font-extrabold tracking-tight text-teal-600 group-hover:scale-105 transition-transform">8</p>
              <button
                className="text-[10px] font-black text-teal-700 hover:text-teal-500 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer transition-colors"
                onClick={() => document.getElementById('swaps-panel')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Review Applications <ArrowLeftRight size={10} />
              </button>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 text-teal-600 transition-colors group-hover:bg-teal-100">
              <CalendarDays size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Shift Legend & Quick Assign Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-[#00B87C]">
              <CalendarPlus size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Quick Assign</p>
              <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none">Drag Shift to slot</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          <div className="flex gap-4">
            {[
              { type: 'Morning', color: 'bg-[#00B87C]', label: 'MOR' },
              { type: 'Evening', color: 'bg-[#F59E0B]', label: 'EVE' },
              { type: 'Night', color: 'bg-[#7C3AED]', label: 'NGT' },
              { type: 'Off Day', color: 'bg-[#90A4AE]', label: 'OFF' },
            ].map(type => (
              <div
                key={type.type}
                draggable="true"
                onDragStart={(e) => e.dataTransfer.setData('shiftType', type.type)}
                onClick={() => setActiveBrush(activeBrush === type.type ? null : type.type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-grab active:cursor-grabbing transition-all hover:bg-secondary select-none ${activeBrush === type.type ? 'bg-[#E8F5E9] dark:bg-emerald-900/20 border border-[#00B87C]/20' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full ${type.color} flex items-center justify-center text-white text-[9px] font-black shadow-sm`}>
                  {type.label}
                </div>
                <span className="text-xs font-extrabold text-foreground pr-1">{type.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none mb-1">Staffing Level</p>
            <p className="text-sm font-bold text-foreground leading-none">Optimal (24/25)</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8 bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-secondary/50 border-b border-border">
          <div className="px-4 py-3 text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center">Employee</div>
          {days.map((day, i) => (
            <div key={day} className={`px-3 py-3 text-center border-l border-border flex flex-col justify-center ${day === 'Mon' ? 'bg-primary/5' : ''}`}>
              <span className={`text-xs font-extra-bold ${day === 'Mon' ? 'text-primary' : 'text-foreground'}`}>{day}</span>
              <span className="text-[10px] text-muted-foreground font-bold">{dates[i]}</span>
            </div>
          ))}
        </div>
        <div className="grid-body divide-y divide-border">
          {filteredSchedule.map(emp => (
            <div key={emp.id} className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]">
              <div className="px-4 py-2 flex items-center gap-3 border-r border-border/50">
                <div className="relative flex-shrink-0">
                  <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-extrabold text-foreground leading-tight">{emp.name}</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight mt-0.5">{emp.dept}</span>
                </div>
              </div>
              {days.map(day => {
                const shift = emp.shifts[day];
                return (
                  <div 
                    key={day} 
                    className="border-l border-border/50 p-1 flex items-stretch"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const shiftType = e.dataTransfer.getData('shiftType');
                      if (shiftType) {
                        handleDrop(emp.id, day, shiftType);
                      }
                    }}
                    onClick={() => {
                      if (activeBrush) {
                        handleDrop(emp.id, day, activeBrush);
                      } else {
                        setShowAddModal(true);
                      }
                    }}
                  >
                    {shift ? (
                      <div className={`flex-1 rounded-xl p-2 flex flex-col justify-center text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm relative group ${shift.type === 'Morning' ? 'bg-secondary text-primary border-l-4 border-l-primary' :
                        shift.type === 'Evening' ? 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-l-4 border-l-[#F59E0B]' :
                          shift.type === 'Night' ? 'bg-violet-50 text-violet-700 border-l-4 border-l-violet-500' :
                            'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                        }`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-tight">{shift.type}</span>
                          {shift.isOT && <span className="text-[8px] bg-red-500 text-white px-1.5 rounded-full font-black animate-pulse">OT</span>}
                        </div>
                        <span className="text-[10px] font-bold opacity-80">{shift.time}</span>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}>
                          <MoreIcon size={12} className="text-muted-foreground hover:text-emerald-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-xl border border-dashed border-border/60 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-colors flex items-center justify-center text-muted-foreground/40 hover:text-emerald-500 cursor-pointer">
                        <Plus size={12} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {/* Swap Requests */}
        {/* Swap Requests */}
        <div id="swaps-panel" className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-[400px] transition-all hover:shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <ArrowLeftRight color="#00B87C" size={18} />
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Shift Swap Requests</h3>
            </div>
            <span className="px-3 py-1 bg-amber-50/50 text-amber-600 text-[11px] font-bold rounded-full border border-amber-200">3 PENDING</span>
          </div>
          
          {/* Scrollable Request List */}
          <div ref={swapListRef} className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent scroll-smooth">
            {swaps.map(swap => (
              <div key={swap.id} className="pb-4 border-b last:border-b-0 border-border/50 last:pb-0 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: swap.p1Color }}>{swap.p1Init}</div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: swap.p2Color }}>{swap.p2Init}</div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground flex items-center gap-1.5">{swap.p1} ↔ {swap.p2}</span>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{swap.shiftTypes}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-neutral-50 text-muted-foreground rounded-full border border-border hover:bg-neutral-100 transition-colors active:scale-95"
                      title="Reject"
                      onClick={() => setSwaps(prev => prev.filter(s => s.id !== swap.id))}
                    >
                      <X size={14} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors active:scale-95"
                      title="Approve"
                      onClick={() => setSwaps(prev => prev.filter(s => s.id !== swap.id))}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-[#F4FBF7] dark:bg-zinc-800/50 px-4 py-3 rounded-2xl flex items-center justify-between">
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {swap.detail}
                  </p>
                  <button
                    className="text-[12px] font-bold text-[#00B87C] hover:underline cursor-pointer"
                    onClick={() => setSelectedSwapDetails(swap)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
            {swaps.length === 0 && (
              <div className="py-10 text-center text-muted-foreground font-bold text-sm">No pending requests</div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 mt-auto border-t border-border bg-card rounded-b-2xl flex-shrink-0">
            <button className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors active:scale-95" onClick={() => navigate('/reports', { state: { activeReport: 'Shift Swap Report' } })}>View All Swap Requests</button>
          </div>
        </div>

        {/* Overtime Summary */}
        <div id="overtime-panel" className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-all hover:shadow-md">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Clock color="#F59E0B" size={18} />
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Overtime Monitoring</h3>
            </div>
            <span className="px-2.5 py-1 bg-secondary text-primary text-[10px] font-bold rounded-full border border-primary/20">142 TOTAL HRS</span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {[
              { name: 'James Carter', hrs: 18, limit: 15, color: '#EF4444', avatar: 'JC' },
              { name: 'Ravi Kumar', hrs: 15, limit: 15, color: '#F59E0B', avatar: 'RK' },
              { name: 'Sarah Johnson', hrs: 11, limit: 15, color: 'var(--primary)', avatar: 'SJ' },
              { name: 'Robert Chen', hrs: 9, limit: 15, color: 'var(--primary)', avatar: 'RC' },
              { name: 'Yuki Tanaka', hrs: 8, limit: 15, color: 'var(--primary)', avatar: 'YT' },
            ].map(item => (
              <div key={item.name} className="group">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary">{item.avatar}</div>
                    <span className="text-xs font-bold text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: item.color }}>{item.hrs}h <span className="text-[10px] font-medium text-muted-foreground ml-1">/ {item.limit}h</span></span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.hrs / 20) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 mt-auto">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">3 employees exceed the 15hr limit</p>
              </div>
              <button
                className="text-[11px] font-black text-amber-800 dark:text-amber-200 hover:underline active:scale-95 disabled:opacity-50"
                onClick={() => {
                  setFixingOT(true);
                  setTimeout(() => setFixingOT(false), 2000);
                }}
                disabled={fixingOT}
              >
                {fixingOT ? 'Fixing...' : 'Fix Now'}
              </button>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-border bg-card rounded-b-2xl">
            <button
              className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors active:scale-95 disabled:opacity-50"
              onClick={() => {
                setGeneratingReport(true);
                setTimeout(() => {
                  setGeneratingReport(false);
                  navigate('/reports', { state: { activeReport: 'Overtime Monitoring' } });
                }, 1500);
              }}
              disabled={generatingReport}
            >
              {generatingReport ? 'Generating...' : 'Generate Overtime Report'}
            </button>
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarPlus size={22} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Assign New Shift</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Select Employee</label>
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    placeholder="Search name or ID..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Shift Type</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    <option value="Morning">Morning (06:00 - 14:00)</option>
                    <option value="Full Day">Full Day (09:00 - 18:00)</option>
                    <option value="Evening">Evening (14:00 - 22:00)</option>
                    <option value="Night">Night (22:00 - 06:00)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Department</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {departments.filter(d => d !== 'All Departments').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Shift Date</label>
                <div className="relative group">
                  <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
                  <input type="date" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} defaultValue="2026-04-06" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notes (Optional)</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent resize-none" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="Add any special instructions..."></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800"
                style={{ color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                Assign Shift
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Swap Details Modal */}
      {selectedSwapDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-border w-full max-w-md overflow-hidden transform transition-all p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-foreground">Swap Details</h3>
              <button
                onClick={() => setSelectedSwapDetails(null)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-12 py-6 bg-[#F8FCFA] dark:bg-zinc-800/30 rounded-2xl mb-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md" style={{ backgroundColor: selectedSwapDetails.p1Color }}>
                  {selectedSwapDetails.p1Init}
                </div>
                <span className="text-sm font-extrabold mt-2 text-foreground">{selectedSwapDetails.p1}</span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-2 rounded-full border border-border shadow-sm">
                <ArrowLeftRight size={16} className="text-[#00B87C]" />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md" style={{ backgroundColor: selectedSwapDetails.p2Color }}>
                  {selectedSwapDetails.p2Init}
                </div>
                <span className="text-sm font-extrabold mt-2 text-foreground">{selectedSwapDetails.p2}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shift Transition</p>
                <p className="text-sm font-extrabold text-foreground mt-1">{selectedSwapDetails.shiftTypes || 'Morning ↔ Evening'}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reason For Swap</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{selectedSwapDetails.reason}</p>
              </div>

              <div className="bg-[#F4FBF7] dark:bg-zinc-800/50 px-4 py-3 rounded-2xl flex items-center gap-2 mt-4 border border-[#E0F2F1]/50">
                <CalendarIcon size={14} className="text-[#00B87C]" />
                <p className="text-xs font-bold text-foreground">{selectedSwapDetails.detail}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSwaps(prev => prev.filter(s => s.id !== selectedSwapDetails.id));
                  setSelectedSwapDetails(null);
                }}
                className="px-6 py-2.5 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500 text-xs font-bold rounded-full transition-all active:scale-95"
              >
                Reject Swap
              </button>
              <button
                onClick={() => {
                  setSwaps(prev => prev.filter(s => s.id !== selectedSwapDetails.id));
                  setSelectedSwapDetails(null);
                }}
                className="px-6 py-2.5 bg-[#00B87C] hover:bg-[#00A670] text-white text-xs font-bold rounded-full transition-all shadow-md shadow-emerald-500/10 active:scale-95"
              >
                Approve Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
