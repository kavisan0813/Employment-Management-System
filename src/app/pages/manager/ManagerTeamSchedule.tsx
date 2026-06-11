import React, { useState } from "react";
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
  Check,
  Filter,
  AlertTriangle,
  Download,
  CalendarDays,
  Activity,
  UserCheck,
  MoreVertical as MoreIcon,
} from "lucide-react";

export function ManagerTeamSchedule() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [view, setView] = useState<"Week" | "Month" | "Day">("Week");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBrush, setActiveBrush] = useState<string | null>(null);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Clock size={22} className="text-[#10B981]" />
          </div>
          <div>
            <h1
              className="text-[26px] font-bold tracking-tight leading-none"
              style={{ color: "var(--foreground)" }}
            >
              Team Schedule
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Efficiently manage workforce rotations and coverage.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95 flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <Download size={16} /> Export
          </button>
          <button
            className="px-4 py-2.5 text-sm font-bold rounded-xl border transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95 flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <CalendarPlus size={16} /> Shift Painter
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#00B87C" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-bold">Add Shift</span>
          </button>
        </div>
      </div>

      {/* COVERAGE + STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckSquare size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">
              Coverage Status
            </p>
            <p className="text-sm font-bold text-foreground">
              94.2% Optimal Coverage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400 tracking-widest">
              System Alerts
            </p>
            <p className="text-sm font-bold text-foreground">
              1 Understaffed Shift
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
          <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-blue-700 dark:text-blue-400 tracking-widest">
              Pending Swaps
            </p>
            <p className="text-sm font-bold text-foreground">
              2 Pending Reviews
            </p>
          </div>
        </div>
      </div>

      {/* DATE NAV + CONTROLS */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl">
            <button className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold px-3 text-foreground min-w-[180px] text-center">
              Apr 6 - Apr 12, 2026
            </span>
            <button className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors active:scale-95">
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <select
              className="pl-9 pr-6 py-2 rounded-xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option>All Departments</option>
              <option>Engineering</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
          <div className="flex p-1 bg-secondary rounded-xl">
            {["Week", "Month", "Day"].map((v) => (
              <button
                key={v}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  view === v
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setView(v as "Week" | "Month" | "Day")}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Team Shifts
              </p>
              <p className="text-3xl font-bold tracking-tight text-emerald-600">
                38
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary transition-colors group-hover:bg-neutral-100">
              <Users size={24} color="var(--primary)" />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Coverage Target
              </p>
              <p className="text-3xl font-bold tracking-tight text-emerald-600">
                91%
              </p>
              <div className="w-28 h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "91%" }}
                ></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 group-hover:bg-emerald-100">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Overtime
              </p>
              <p className="text-3xl font-bold tracking-tight text-amber-600">
                42<span className="text-sm ml-1 font-bold">h</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 group-hover:bg-amber-100">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 group"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Swap Requests
              </p>
              <p className="text-3xl font-bold tracking-tight text-teal-600">
                2
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 text-teal-600 group-hover:bg-teal-100">
              <CalendarDays size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* QUICK TOOL ROW */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] bg-secondary flex items-center justify-center text-[#00B87C]">
              <CalendarPlus size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mb-1">
                Quick Tool
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                Shift Painter
              </p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          <div className="flex gap-4">
            {[
              { type: "Morning", color: "bg-[#00B87C]", label: "MOR" },
              { type: "Evening", color: "bg-[#F59E0B]", label: "EVE" },
              { type: "Night", color: "bg-[#7C3AED]", label: "NGT" },
              { type: "Full Day", color: "bg-[#3B82F6]", label: "FUL" },
            ].map((type) => (
              <div
                key={type.type}
                onClick={() =>
                  setActiveBrush(activeBrush === type.type ? null : type.type)
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all hover:bg-secondary select-none ${
                  activeBrush === type.type
                    ? "bg-[#E8F5E9] dark:bg-emerald-900/20 border border-[#00B87C]/20"
                    : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full ${type.color} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}
                >
                  {type.label}
                </div>
                <span className="text-xs font-bold text-foreground pr-1">
                  {type.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase text-emerald-600 tracking-widest leading-none mb-1">
              Staffing Level
            </p>
            <p className="text-sm font-bold text-foreground leading-none">
              Optimal (11/12)
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* SCHEDULE GRID */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8 bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-secondary/50 border-b border-border">
          <div className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
            Employee
          </div>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div
              key={day}
              className={`px-3 py-3 text-center border-l border-border flex flex-col justify-center ${day === "Mon" ? "bg-primary/5" : ""}`}
            >
              <span
                className={`text-xs font-bold ${day === "Mon" ? "text-primary border-b-2 border-[#00B87C] pb-0.5 inline-block mx-auto" : "text-foreground"}`}
              >
                {day}
              </span>
              <span className="text-[11px] text-muted-foreground font-bold mt-1">
                Apr {6 + i}
              </span>
            </div>
          ))}
        </div>

        <div className="grid-body divide-y divide-border">
          {/* Arjun Mehta */}
          <div className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]">
            <EmployeeCell
              name="Arjun Mehta"
              dept="Engineering"
              avatar="https://i.pravatar.cc/150?u=Arjun"
            />
            <ShiftCell type="Morning" time="06:00-14:00" />
            <EmptyCell />
            <ShiftCell type="Evening" time="14:00-22:00" isOT />
            <EmptyCell />
            <ShiftCell type="Morning" time="06:00-14:00" />
            <ShiftCell type="Full Day" time="09:00-18:00" />
            <ShiftCell type="Off Day" time="Rest Day" />
          </div>

          {/* Sneha Rao */}
          <div className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]">
            <EmployeeCell
              name="Sneha Rao"
              dept="Engineering"
              avatar="https://i.pravatar.cc/150?u=Sneha"
            />
            <EmptyCell />
            <ShiftCell type="Night" time="22:00-06:00" />
            <ShiftCell type="Morning" time="06:00-14:00" />
            <EmptyCell />
            <ShiftCell type="Evening" time="14:00-22:00" isOT />
            <EmptyCell />
            <EmptyCell />
          </div>

          {/* Dev Patel */}
          <div className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]">
            <EmployeeCell
              name="Dev Patel"
              dept="Engineering"
              avatar="https://i.pravatar.cc/150?u=Dev"
            />
            <ShiftCell type="Night" time="22:00-06:00" />
            <EmptyCell />
            <ShiftCell type="Morning" time="06:00-14:00" isOT />
            <ShiftCell type="Evening" time="14:00-22:00" />
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
          </div>

          {/* Priya Sharma */}
          <div className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]">
            <EmployeeCell
              name="Priya Sharma"
              dept="Engineering"
              avatar="https://i.pravatar.cc/150?u=Priya"
            />
            <div className="col-span-5 border-l border-border/50 p-1">
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-[11px] font-bold tracking-widest text-[#F59E0B] border-l-4 border-l-[#F59E0B]"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                ON APPROVED LEAVE Apr 6-10
              </div>
            </div>
            <EmptyCell />
            <EmptyCell />
          </div>
        </div>
      </div>

      {/* BOTTOM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {/* Swap Requests */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-[400px] transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <ArrowLeftRight color="#00B87C" size={18} />
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Shift Swap Requests
              </h3>
            </div>
            <span className="px-3 py-1 bg-amber-50/50 text-amber-600 text-[11px] font-bold rounded-full border border-amber-200">
              2 PENDING
            </span>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Swap 1 */}
            <div className="pb-4 border-b border-border/50 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-[#059669]">
                      AM
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-[#2563EB]">
                      DP
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      Arjun M. ↔ Dev P.
                    </span>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Morning ↔ Night
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-neutral-50 text-muted-foreground rounded-full border border-border hover:bg-neutral-100 transition-colors">
                    <X size={14} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
                    <Check size={14} />
                  </button>
                </div>
              </div>
              <div className="bg-[#F4FBF7] dark:bg-zinc-800/50 px-4 py-3 rounded-2xl flex items-center justify-between">
                <p className="text-[12px] font-medium text-muted-foreground">
                  Wed Apr 8 Evening ↔ Wed Apr 8 Morning
                </p>
                <button className="text-[12px] font-bold text-[#00B87C] hover:underline">
                  Details
                </button>
              </div>
            </div>
            {/* Swap 2 */}
            <div className="pb-4 border-b border-border/50 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-[#7C3AED]">
                      SR
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-[#DB2777]">
                      PS
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      Sneha R. ↔ Priya S.
                    </span>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Night ↔ Evening
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-neutral-50 text-muted-foreground rounded-full border border-border hover:bg-neutral-100 transition-colors">
                    <X size={14} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
                    <Check size={14} />
                  </button>
                </div>
              </div>
              <div className="bg-[#F4FBF7] dark:bg-zinc-800/50 px-4 py-3 rounded-2xl flex items-center justify-between">
                <p className="text-[12px] font-medium text-muted-foreground">
                  Tue Apr 7 Night ↔ Wed Apr 8 Evening
                </p>
                <button className="text-[12px] font-bold text-[#00B87C] hover:underline">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overtime Summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Clock color="#F59E0B" size={18} />
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Overtime Monitoring
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-secondary text-primary text-[11px] font-bold rounded-full border border-primary/20">
              42 TOTAL HRS
            </span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {[
              {
                name: "Dev Patel",
                hrs: 12,
                limit: 15,
                color: "#F59E0B",
                avatar: "DP",
              },
              {
                name: "Arjun Mehta",
                hrs: 8,
                limit: 15,
                color: "var(--primary)",
                avatar: "AM",
              },
              {
                name: "Sneha Rao",
                hrs: 4,
                limit: 15,
                color: "var(--primary)",
                avatar: "SR",
              },
            ].map((item) => (
              <div key={item.name} className="group">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary">
                      {item.avatar}
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: item.color }}
                  >
                    {item.hrs}h{" "}
                    <span className="text-[11px] font-medium text-muted-foreground ml-1">
                      / {item.limit}h
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.hrs / 20) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 mt-auto">
            <button className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors">
              Generate Overtime Report
            </button>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border animate-in zoom-in-95"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="p-6 border-b flex items-center justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-secondary flex items-center justify-center text-primary">
                  <CalendarPlus size={20} />
                </div>
                <h3 className="text-[16px] font-bold text-foreground">
                  Assign New Shift
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Employee
                </label>
                <input
                  type="text"
                  placeholder="Search team member..."
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Shift Type
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors appearance-none"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option>Morning (06:00 - 14:00)</option>
                  <option>Evening (14:00 - 22:00)</option>
                  <option>Night (22:00 - 06:00)</option>
                  <option>Full Day (09:00 - 18:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Department
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors appearance-none"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option>Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Shift Date
                </label>
                <input
                  type="date"
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-[13px] font-bold outline-none focus:border-[#00B87C] transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Optional notes..."
                  className="w-full h-20 p-4 rounded-xl border bg-transparent text-[13px] outline-none focus:border-[#00B87C] transition-colors resize-none"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>
            <div
              className="p-6 border-t flex items-center justify-end gap-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-b-2xl"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-colors hover:bg-[#00B87C]/[0.08] dark:hover:bg-zinc-900"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-[#10B981]/20 hover:opacity-90"
                style={{ backgroundColor: "#00B87C" }}
              >
                Assign Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents for Table Grid
function EmployeeCell({
  name,
  dept,
  avatar,
}: {
  name: string;
  dept: string;
  avatar: string;
}) {
  return (
    <div className="px-4 py-2 flex items-center gap-3 border-r border-border/50">
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-foreground leading-tight">
          {name}
        </span>
        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight mt-0.5">
          {dept}
        </span>
      </div>
    </div>
  );
}

function EmptyCell() {
  return (
    <div className="border-l border-border/50 p-1 flex items-stretch">
      <div className="flex-1 rounded-xl border border-dashed border-border/60 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-colors flex items-center justify-center text-muted-foreground/40 hover:text-emerald-500 cursor-pointer">
        <Plus size={12} />
      </div>
    </div>
  );
}

function ShiftCell({
  type,
  time,
  isOT,
}: {
  type: string;
  time: string;
  isOT?: boolean;
}) {
  let styleClass = "";
  if (type === "Morning")
    styleClass = "bg-[#DCFCE7] text-[#00B87C] border-l-[#00B87C]";
  if (type === "Evening")
    styleClass = "bg-[#FEF3C7] text-[#F59E0B] border-l-[#F59E0B]";
  if (type === "Night")
    styleClass = "bg-[#EDE9FE] text-[#7C3AED] border-l-[#7C3AED]";
  if (type === "Full Day")
    styleClass = "bg-[#DBEAFE] text-[#3B82F6] border-l-[#3B82F6]";
  if (type === "Off Day")
    styleClass = "bg-slate-100 text-[#90A4AE] border-l-[#90A4AE]";

  return (
    <div className="border-l border-border/50 p-1 flex items-stretch">
      <div
        className={`flex-1 rounded-xl p-2 flex flex-col justify-center text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm relative group border-l-4 ${styleClass}`}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-tight">
            {type}
          </span>
          {isOT && (
            <span className="text-[8px] bg-red-500 text-white px-1.5 rounded-full font-bold animate-pulse">
              OT
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold opacity-80">{time}</span>
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreIcon
            size={12}
            className="text-current opacity-70 hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
