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

interface ShiftTemplate {
  id: number;
  name: string;
  employeesCount: number;
  department: string;
  lastApplied: string;
  rotationType: string;
  badge?: 'Active' | 'Most Used' | 'Recently Applied';
  badgeColor: string;
  badgeBg: string;
  weeklySchedule: { [key: string]: string };
}

export const ShiftSchedule: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<'Week' | 'Month' | 'Day'>('Week');
  const [showAddModal, setShowAddModal] = useState(false);

  const [templates, setTemplates] = useState<ShiftTemplate[]>([
    { 
      id: 1, 
      name: 'Engineering Week A', 
      employeesCount: 7, 
      department: 'Engineering', 
      lastApplied: 'Apr 1', 
      rotationType: 'Weekly Rotation',
      badge: 'Active',
      badgeColor: '#059669',
      badgeBg: '#E6F4EA',
      weeklySchedule: { 'Mon': 'Morning', 'Tue': 'Morning', 'Wed': 'Morning', 'Thu': 'Morning', 'Fri': 'Morning', 'Sat': 'Off Day', 'Sun': 'Off Day' }
    },
    { 
      id: 2, 
      name: 'Night Rot.', 
      employeesCount: 4, 
      department: 'Operations', 
      lastApplied: 'Apr 5', 
      rotationType: 'Bi-weekly',
      badge: 'Most Used',
      badgeColor: '#7C3AED',
      badgeBg: '#F3E8FF',
      weeklySchedule: { 'Mon': 'Night', 'Tue': 'Night', 'Wed': 'Off Day', 'Thu': 'Night', 'Fri': 'Night', 'Sat': 'Night', 'Sun': 'Off Day' }
    },
    { 
      id: 3, 
      name: 'Weekend Peak', 
      employeesCount: 12, 
      department: 'Sales', 
      lastApplied: 'Mar 28', 
      rotationType: 'Weekend Only',
      badge: 'Recently Applied',
      badgeColor: '#D97706',
      badgeBg: '#FFFBEB',
      weeklySchedule: { 'Mon': 'Off Day', 'Tue': 'Off Day', 'Wed': 'Off Day', 'Thu': 'Off Day', 'Fri': 'Evening', 'Sat': 'Morning', 'Sun': 'Morning' }
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState<number | null>(null);
  const [editTemplate, setEditTemplate] = useState<ShiftTemplate | null>(null);
  const [renameTemplate, setRenameTemplate] = useState<ShiftTemplate | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  const [newTName, setNewTName] = useState('');
  const [newTDept, setNewTDept] = useState('Engineering');
  const [newTRotation, setNewTRotation] = useState('Weekly Rotation');
  const [newTSchedule, setNewTSchedule] = useState<Record<string, string>>({
    'Mon': 'Morning', 'Tue': 'Morning', 'Wed': 'Morning', 'Thu': 'Morning', 'Fri': 'Morning', 'Sat': 'Off Day', 'Sun': 'Off Day'
  });
  const [advancedApplyTemplate, setAdvancedApplyTemplate] = useState<ShiftTemplate | null>(null);
  const [applyStep, setApplyStep] = useState<'form' | 'confirmation'>('form');
  const [applyDept, setApplyDept] = useState('All Departments');
  const [selectedEmps, setSelectedEmps] = useState<string[]>([]);
  const [applyDateRange, setApplyDateRange] = useState('Apr 28 - May 4');
  const [applyStartDay, setApplyStartDay] = useState('Monday');
  const [applyConflictHandling, setApplyConflictHandling] = useState<'replace' | 'fill' | 'skip'>('replace');
  const [applyNotes, setApplyNotes] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

      {/* Shift Templates Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Shift Templates</h3>
            <p className="text-xs font-medium text-muted-foreground mt-1">Deploy pre-configured schedule routines across organizational groups</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#00B87C] text-white rounded-xl hover:bg-[#00a36d] shadow-sm transition-all text-sm font-bold active:scale-95"
            onClick={() => setShowCreateTemplate(true)}
          >
            <Plus size={18} />
            <span>Create Template</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group"
            >
              {tmpl.badge && (
                <span
                  className="absolute top-4 right-12 px-2.5 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-wide"
                  style={{
                    backgroundColor: tmpl.badgeBg,
                    color: tmpl.badgeColor,
                    borderColor: `${tmpl.badgeColor}20`,
                  }}
                >
                  {tmpl.badge}
                </span>
              )}

              {/* 3-Dot Menu Trigger */}
              <div className="absolute top-4 right-4">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateMenu(showTemplateMenu === tmpl.id ? null : tmpl.id);
                  }}
                >
                  <MoreIcon size={16} />
                </button>
                {showTemplateMenu === tmpl.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
                    {['View Template', 'Edit Template', 'Duplicate Template', 'Rename Template', 'Delete Template'].map(
                      (action) => (
                        <button
                          key={action}
                          className={`w-full text-left px-4 py-2 text-xs font-bold ${action === 'Delete Template' ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' : 'text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40'}`}
                          onClick={() => {
                            setShowTemplateMenu(null);
                            if (action === 'View Template') setSelectedTemplate(tmpl);
                            if (action === 'Edit Template') setEditTemplate(tmpl);
                            if (action === 'Duplicate Template') {
                              const newId = Math.max(...templates.map(t => t.id), 0) + 1;
                              setTemplates(prev => [...prev, {
                                ...tmpl,
                                id: newId,
                                name: `${tmpl.name} (Copy)`,
                                badge: 'Recently Applied',
                                badgeColor: '#0EA5E9',
                                badgeBg: '#E0F2FE'
                              }]);
                            }
                            if (action === 'Rename Template') {
                              setRenameTemplate(tmpl);
                              setRenameValue(tmpl.name);
                            }
                            if (action === 'Delete Template') setTemplates(prev => prev.filter(t => t.id !== tmpl.id));
                          }}
                        >
                          {action}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-2">{tmpl.name}</h4>

                {/* Shift Legend Compact Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Array.from(new Set(Object.values(tmpl.weeklySchedule))).map((shiftName) => {
                    const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
                      'Morning': { bg: 'bg-[#E6F4EA] dark:bg-emerald-900/20', text: 'text-[#00B87C]', dot: '#00B87C' },
                      'Evening': { bg: 'bg-[#FFFBEB] dark:bg-amber-900/20', text: 'text-[#F59E0B]', dot: '#F59E0B' },
                      'Night': { bg: 'bg-[#F3E8FF] dark:bg-violet-900/20', text: 'text-[#7C3AED]', dot: '#7C3AED' },
                      'Off Day': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-[#90A4AE]', dot: '#90A4AE' },
                    };
                    const colors = colorMap[shiftName] || { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: '#757575' };
                    return (
                      <span
                        key={shiftName}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight uppercase ${colors.bg} ${colors.text}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors.dot }}
                        />
                        {shiftName}
                      </span>
                    );
                  })}
                </div>

                {/* Template Details */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Users size={14} />
                    <span>{tmpl.employeesCount} employees utilizing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Activity size={14} />
                    <span>Department: <span className="text-foreground">{tmpl.department}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Clock size={14} />
                    <span>Last applied: <span className="text-foreground">{tmpl.lastApplied}</span></span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-2 rounded-xl text-sm font-extrabold flex items-center justify-center bg-[#00B87C] text-white hover:bg-[#00a36d] transition-all shadow-sm active:scale-95"
                onClick={() => {
                  setAdvancedApplyTemplate(tmpl);
                  setApplyStep('form');
                  setApplyDept(tmpl.department === 'All Departments' ? 'Engineering' : tmpl.department);
                  const emps = globalEmployees
                    .filter(e => tmpl.department === 'All Departments' || e.department.toLowerCase() === tmpl.department.toLowerCase())
                    .map(e => e.id);
                  setSelectedEmps(emps);
                }}
              >
                <span>Apply Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Apply Template Workflow */}
      {advancedApplyTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setAdvancedApplyTemplate(null)}>
          {applyStep === 'form' ? (
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Apply Shift Template</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Assign this template to employees for the selected week.</p>
                </div>
                <button onClick={() => setAdvancedApplyTemplate(null)} className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                
                {/* Top Info Summary */}
                <div className="bg-[#F4FBF7] dark:bg-emerald-950/10 border border-[#00B87C]/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-slate-100">{advancedApplyTemplate.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{advancedApplyTemplate.department} • {advancedApplyTemplate.employeesCount} Utilizing • Last Applied: {advancedApplyTemplate.lastApplied}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(Object.values(advancedApplyTemplate.weeklySchedule))).map((shiftName) => {
                      const colorMap: Record<string, string> = {
                        'Morning': 'bg-[#E6F4EA] text-[#00B87C]',
                        'Evening': 'bg-[#FFFBEB] text-[#F59E0B]',
                        'Night': 'bg-[#F3E8FF] text-[#7C3AED]',
                        'Off Day': 'bg-slate-100 text-slate-400',
                      };
                      return (
                        <span key={shiftName} className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${colorMap[shiftName] || 'bg-neutral-100 text-neutral-600'}`}>
                          {shiftName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Select Department</label>
                      <select 
                        className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                        value={applyDept}
                        onChange={(e) => {
                          setApplyDept(e.target.value);
                          const emps = globalEmployees
                            .filter(emp => e.target.value === 'All Departments' || emp.department.toLowerCase() === e.target.value.toLowerCase())
                            .map(emp => emp.id);
                          setSelectedEmps(emps);
                        }}
                      >
                        {['All Departments', 'Engineering', 'Operations', 'Sales', 'Marketing', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Select Employees</label>
                        <button 
                          className="text-[10px] font-black text-[#00B87C] hover:underline uppercase tracking-wider"
                          onClick={() => {
                            const allDeptEmps = globalEmployees
                              .filter(emp => applyDept === 'All Departments' || emp.department.toLowerCase() === applyDept.toLowerCase())
                              .map(emp => emp.id);
                            setSelectedEmps(selectedEmps.length === allDeptEmps.length ? [] : allDeptEmps);
                          }}
                        >
                          {selectedEmps.length === globalEmployees.filter(emp => applyDept === 'All Departments' || emp.department.toLowerCase() === applyDept.toLowerCase()).length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="border border-border rounded-xl p-3 bg-neutral-50 dark:bg-zinc-800/50 max-h-[140px] overflow-y-auto space-y-2">
                        {globalEmployees
                          .filter(emp => applyDept === 'All Departments' || emp.department.toLowerCase() === applyDept.toLowerCase())
                          .map(emp => (
                            <label key={emp.id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700/40 transition-colors cursor-pointer">
                              <input 
                                type="checkbox"
                                className="rounded text-[#00B87C] focus:ring-[#00B87C]/20 w-4 h-4 accent-[#00B87C]"
                                checked={selectedEmps.includes(emp.id)}
                                onChange={() => {
                                  setSelectedEmps(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id]);
                                }}
                              />
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.name} <span className="text-[9px] text-muted-foreground uppercase font-black ml-1">({emp.department})</span></span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Select Date Range</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
                        value={applyDateRange}
                        onChange={(e) => setApplyDateRange(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Start Day</label>
                        <select 
                          className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                          value={applyStartDay}
                          onChange={(e) => setApplyStartDay(e.target.value)}
                        >
                          {['Monday', 'Sunday', 'Custom'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Conflicts</label>
                        <select 
                          className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                          value={applyConflictHandling}
                          onChange={(e) => setApplyConflictHandling(e.target.value as 'replace' | 'fill' | 'skip')}
                        >
                          <option value="replace">Replace existing</option>
                          <option value="fill">Fill empty slots</option>
                          <option value="skip">Skip employees</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Notes</label>
                      <input 
                        type="text" 
                        placeholder="Optional schedule annotations..."
                        className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
                        value={applyNotes}
                        onChange={(e) => setApplyNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview & Warnings Panel */}
                <div className="bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-2xl p-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Employees</p>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{selectedEmps.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Shifts</p>
                    <p className="text-xl font-extrabold text-[#00B87C] mt-0.5">{selectedEmps.length * 5}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Conflicts</p>
                    <p className="text-xl font-extrabold text-amber-500 mt-0.5">{selectedEmps.length > 0 ? '2' : '0'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">On Leave</p>
                    <p className="text-xl font-extrabold text-rose-500 mt-0.5">1</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">OT Risks</p>
                    <p className="text-xl font-extrabold text-indigo-600 mt-0.5">0</p>
                  </div>
                </div>

                {selectedEmps.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <AlertTriangle size={16} />
                    <span>Warning: 2 shifts already assigned to selected staff. 1 employee on approved leave.</span>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                  onClick={() => setAdvancedApplyTemplate(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95 disabled:opacity-50"
                  disabled={selectedEmps.length === 0}
                  onClick={() => setApplyStep('confirmation')}
                >
                  Preview Schedule
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Confirmation Popup */
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border p-6 text-center animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#00B87C] flex items-center justify-center mx-auto mb-4">
                <CalendarPlus size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Confirm Apply Template</h3>
              <p className="text-xs text-muted-foreground mb-5">Apply the <span className="font-black text-slate-800 dark:text-slate-200">"{advancedApplyTemplate.name}"</span> routine to {selectedEmps.length} employees for {applyDateRange}?</p>
              <div className="flex gap-3">
                <button
                  className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                  onClick={() => setApplyStep('form')}
                >
                  Back
                </button>
                <button
                  className="w-full py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95"
                  onClick={() => {
                    const weekly = advancedApplyTemplate.weeklySchedule;
                    
                    setScheduleData(prev => prev.map(emp => {
                      if (selectedEmps.includes(emp.id)) {
                        const newShifts = { ...emp.shifts };
                        const times: Record<string, string> = {
                          'Morning': '06:00 – 14:00',
                          'Evening': '14:00 – 22:00',
                          'Night': '22:00 – 06:00',
                          'Full Day': '09:00 – 18:00'
                        };
                        
                        Object.entries(weekly).forEach(([day, shiftType]) => {
                          if (applyConflictHandling === 'skip' && emp.shifts[day]) {
                            return;
                          }
                          if (applyConflictHandling === 'fill' && emp.shifts[day]) {
                            return;
                          }
                          
                          if (shiftType === 'Off Day') {
                            delete newShifts[day];
                          } else {
                            newShifts[day] = {
                              type: shiftType as 'Morning' | 'Evening' | 'Night' | 'Full Day',
                              time: times[shiftType] || '09:00 – 18:00',
                              isOT: false
                            };
                          }
                        });
                        return { ...emp, shifts: newShifts };
                      }
                      return emp;
                    }));

                    setTemplates(prev => prev.map(t => t.id === advancedApplyTemplate.id ? {
                      ...t,
                      employeesCount: selectedEmps.length,
                      lastApplied: 'Apr 27'
                    } : t));

                    setAdvancedApplyTemplate(null);
                    setShowSuccessToast(true);
                    setTimeout(() => setShowSuccessToast(false), 3000);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#00B87C] flex items-center justify-center text-white font-bold text-xs">✓</div>
          <div>
            <p className="text-xs font-bold">Template Applied Successfully</p>
          </div>
        </div>
      )}

      {/* View Template Modal (Weekly Schedule Preview) */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedTemplate(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/40">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{selectedTemplate.name}</h3>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{selectedTemplate.rotationType} • {selectedTemplate.department}</p>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs font-extrabold text-slate-400 tracking-widest uppercase mb-3">Weekly Schedule Preview</p>
              <div className="divide-y divide-border">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const shift = selectedTemplate.weeklySchedule[day] || 'Off Day';
                  const colorMap: Record<string, string> = {
                    'Morning': 'bg-[#E6F4EA] text-[#00B87C]',
                    'Evening': 'bg-[#FFFBEB] text-[#F59E0B]',
                    'Night': 'bg-[#F3E8FF] text-[#7C3AED]',
                    'Off Day': 'bg-slate-100 text-slate-400',
                  };
                  return (
                    <div key={day} className="flex items-center justify-between py-3 text-sm font-bold">
                      <span className="text-slate-700 dark:text-slate-300">{day}</span>
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wide rounded-full ${colorMap[shift] || 'bg-slate-400 text-white'}`}>{shift}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Popup */}
      {showCreateTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowCreateTemplate(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="text-[#00B87C]" size={20} />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Create Shift Template</h3>
              </div>
              <button onClick={() => setShowCreateTemplate(false)} className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Template Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Morning Flex A" 
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
                  value={newTName}
                  onChange={(e) => setNewTName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Department</label>
                  <select 
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                    value={newTDept}
                    onChange={(e) => setNewTDept(e.target.value)}
                  >
                    {['Engineering', 'Operations', 'Sales', 'Marketing', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Rotation Type</label>
                  <select 
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                    value={newTRotation}
                    onChange={(e) => setNewTRotation(e.target.value)}
                  >
                    {['Weekly Rotation', 'Bi-weekly', 'Monthly', 'Weekend Only'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Weekly Shift Selector</label>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day}>
                      <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground block mb-1.5">{day}</span>
                      <select
                        className="w-full p-1.5 text-[10px] font-black bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-lg focus:ring-1 focus:ring-[#00B87C] outline-none appearance-none text-center uppercase cursor-pointer"
                        value={newTSchedule[day]}
                        onChange={(e) => setNewTSchedule(prev => ({ ...prev, [day]: e.target.value }))}
                      >
                        {['Morning', 'Evening', 'Night', 'Off Day'].map(s => <option key={s} value={s}>{s.substring(0,3)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                  onClick={() => setShowCreateTemplate(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95"
                  onClick={() => {
                    if (!newTName.trim()) return;
                    const newId = templates.length + 1;
                    setTemplates(prev => [...prev, {
                      id: newId,
                      name: newTName,
                      employeesCount: 0,
                      department: newTDept,
                      lastApplied: 'Never',
                      rotationType: newTRotation,
                      badge: 'Recently Applied',
                      badgeColor: '#0ea5e9',
                      badgeBg: '#E0F2FE',
                      weeklySchedule: newTSchedule
                    }]);
                    setNewTName('');
                    setShowCreateTemplate(false);
                  }}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Popup */}
      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setEditTemplate(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="text-[#00B87C]" size={20} />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Edit Shift Template</h3>
              </div>
              <button onClick={() => setEditTemplate(null)} className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Template Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
                  value={editTemplate.name}
                  onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Department</label>
                  <select 
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                    value={editTemplate.department}
                    onChange={(e) => setEditTemplate({ ...editTemplate, department: e.target.value })}
                  >
                    {['Engineering', 'Operations', 'Sales', 'Marketing', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Rotation Type</label>
                  <select 
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold appearance-none"
                    value={editTemplate.rotationType}
                    onChange={(e) => setEditTemplate({ ...editTemplate, rotationType: e.target.value })}
                  >
                    {['Weekly Rotation', 'Bi-weekly', 'Monthly', 'Weekend Only'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Weekly Shift Selector</label>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day}>
                      <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground block mb-1.5">{day}</span>
                      <select
                        className="w-full p-1.5 text-[10px] font-black bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-lg focus:ring-1 focus:ring-[#00B87C] outline-none appearance-none text-center uppercase cursor-pointer"
                        value={editTemplate.weeklySchedule[day]}
                        onChange={(e) => setEditTemplate({ 
                          ...editTemplate, 
                          weeklySchedule: { ...editTemplate.weeklySchedule, [day]: e.target.value } 
                        })}
                      >
                        {['Morning', 'Evening', 'Night', 'Off Day'].map(s => <option key={s} value={s}>{s.substring(0,3)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                  onClick={() => setEditTemplate(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95"
                  onClick={() => {
                    setTemplates(prev => prev.map(t => t.id === editTemplate.id ? editTemplate : t));
                    setEditTemplate(null);
                  }}
                >
                  Update Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rename Template Popup */}
      {renameTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setRenameTemplate(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-border p-6 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-4">Rename Template</h3>
            <div className="mb-5">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-zinc-800/50 border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                onClick={() => setRenameTemplate(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95"
                onClick={() => {
                  if (!renameValue.trim()) return;
                  setTemplates(prev => prev.map(t => t.id === renameTemplate.id ? { ...t, name: renameValue } : t));
                  setRenameTemplate(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
